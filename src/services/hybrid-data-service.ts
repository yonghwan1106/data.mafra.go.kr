/**
 * 하이브리드 데이터 서비스 - 모크데이터와 실제 API를 유연하게 전환
 */

import { DATA_SOURCE_CONFIG } from '../config/data-sources';
import { farmMapApiClient, FarmMapData } from './farmmap-api-client';
import { kmaApiClient } from './kma-api-client';
import { rdaApiClient } from './rda-api-client';
import { Farm, WeatherData, AgriculturalWeatherData, RDAPestInfo, SoilInfo } from '../types';

// 기존 모크데이터 로더 (기존 기능 유지)
const loadMockFarms = async (): Promise<Farm[]> => {
  try {
    // Vercel 환경에서는 import 방식 사용
    const farmsData = await import('../data/farms.json');
    return farmsData.default as Farm[];
  } catch (error) {
    console.error('모크데이터 로딩 실패:', error);
    // 폴백으로 하드코딩된 샘플 데이터 제공
    return [
      {
        id: "farm-001",
        name: "그린팜 농장",
        owner: "김농부",
        location: {
          lat: 36.5665,
          lng: 126.9780,
          address: "충청남도 공주시 우성면 신풍리",
          region: "충청남도 공주시"
        },
        cropType: "벼",
        farmSize: 2000,
        aciScore: 78,
        aciGrade: "B" as const,
        lastUpdated: "2024-07-21"
      },
      {
        id: "farm-002", 
        name: "스마트팜 센터",
        owner: "이농부",
        location: {
          lat: 36.4800,
          lng: 127.2890,
          address: "세종특별자치시 연기면",
          region: "세종특별자치시"
        },
        cropType: "토마토",
        farmSize: 1500,
        aciScore: 85,
        aciGrade: "A" as const,
        lastUpdated: "2024-07-21"
      }
    ];
  }
};

// FarmMap 데이터를 기존 Farm 타입으로 변환
const convertFarmMapDataToFarm = (data: FarmMapData, index: number): Farm => {
  // 농경지 분류별 ACI 점수 매핑 (임시 로직)
  const landTypeScores: Record<string, number> = {
    '논': 78,
    '밭': 72,
    '과수': 85,
    '시설': 88,
    '비경지': 45
  };

  const baseScore = landTypeScores[data.fl_nm] || 70;
  const aciScore = Math.min(100, Math.max(0, baseScore + (Math.random() - 0.5) * 20));
  const grade = aciScore >= 90 ? 'A' : aciScore >= 80 ? 'B' : aciScore >= 70 ? 'C' : aciScore >= 60 ? 'D' : 'E';

  // 지역 추출 (stdg_addr에서)
  const extractRegion = (address: string) => {
    if (!address) return '알 수 없음';
    const parts = address.split(' ');
    return parts.slice(0, 2).join(' ') || '알 수 없음';
  };

  return {
    id: data.id || `farm-${index}`,
    name: `${data.fl_nm} 농장 ${index + 1}`,
    owner: `농장주 ${index + 1}`,
    location: {
      lat: 36.5 + Math.random() * 0.5,
      lng: 127.3 + Math.random() * 0.5,
      address: data.stdg_addr || '주소 정보 없음',
      region: extractRegion(data.stdg_addr || '')
    },
    cropType: data.fl_nm || '기타',
    farmSize: Math.round(data.fl_ar || 1000),
    aciScore: Math.round(aciScore),
    aciGrade: grade,
    lastUpdated: new Date().toISOString().split('T')[0]
  };
};

export class HybridDataService {
  /**
   * 농장 데이터 조회 - 설정에 따라 모크 또는 실제 API 사용
   */
  async getFarms(): Promise<Farm[]> {
    const config = DATA_SOURCE_CONFIG;
    
    if (config.debug) {
      console.log('🔍 데이터 소스 상태:', {
        primary: config.primarySource,
        apiEnabled: config.farmMapAPI.enabled,
        fallback: config.fallbackEnabled
      });
    }

    // 1차 시도: 기본 설정된 데이터 소스 사용
    try {
      if (config.primarySource === 'api' && config.farmMapAPI.enabled) {
        return await this.getFarmsFromAPI();
      } else {
        return await this.getFarmsFromMock();
      }
    } catch (error) {
      console.error('❌ 1차 데이터 로딩 실패:', error);
      
      // 2차 시도: 폴백 활성화시 대체 소스 사용
      if (config.fallbackEnabled) {
        console.log('🔄 폴백 모드 활성화...');
        
        if (config.mockData.fallbackDelay > 0) {
          await new Promise(resolve => setTimeout(resolve, config.mockData.fallbackDelay));
        }
        
        try {
          if (config.primarySource === 'api') {
            console.log('📦 모크데이터로 폴백');
            return await this.getFarmsFromMock();
          } else {
            console.log('🌐 API로 폴백');
            return await this.getFarmsFromAPI();
          }
        } catch (fallbackError) {
          console.error('❌ 폴백도 실패:', fallbackError);
          return []; // 빈 배열 반환하여 앱 크래시 방지
        }
      } else {
        throw error;
      }
    }
  }

  /**
   * 모크데이터에서 농장 정보 가져오기
   */
  private async getFarmsFromMock(): Promise<Farm[]> {
    if (DATA_SOURCE_CONFIG.debug) {
      console.log('📦 모크데이터 로딩...');
    }
    
    const farms = await loadMockFarms();
    
    if (DATA_SOURCE_CONFIG.debug) {
      console.log(`✅ 모크데이터 ${farms.length}개 농장 로딩 완료`);
    }
    
    return farms;
  }

  /**
   * FarmMap API에서 농장 정보 가져오기
   */
  private async getFarmsFromAPI(): Promise<Farm[]> {
    if (DATA_SOURCE_CONFIG.debug) {
      console.log('🌐 FarmMap API 호출...');
    }

    try {
      // 여러 지역의 농경지 데이터를 가져와서 다양성 확보
      const regions = [
        '3611031024', // 세종시 일부
        '3611034032', // 세종시 다른 지역
        '2771038025'  // 충북 일부
      ];

      const allFarms: Farm[] = [];
      
      for (let i = 0; i < regions.length; i++) {
        try {
          const bjdCd = regions[i];
          const landCodes: Array<'01' | '02' | '03' | '04'> = ['01', '02', '03', '04']; // 논, 밭, 과수, 시설
          
          for (const landCd of landCodes) {
            const farmData = await farmMapApiClient.getFarmDataByBjdAndLandCode(bjdCd, landCd);
            
            if (farmData && farmData.length > 0) {
              // 최대 5개 농장만 각 지역/분류별로 가져오기
              const limitedData = farmData.slice(0, 5);
              
              limitedData.forEach((data) => {
                const farm = convertFarmMapDataToFarm(data, allFarms.length);
                allFarms.push(farm);
              });
            }
          }
        } catch (regionError) {
          console.warn(`지역 ${regions[i]} 데이터 로딩 실패:`, regionError);
          continue;
        }
      }

      if (allFarms.length === 0) {
        throw new Error('API에서 농장 데이터를 가져올 수 없습니다');
      }

      if (DATA_SOURCE_CONFIG.debug) {
        console.log(`✅ FarmMap API ${allFarms.length}개 농장 로딩 완료`);
      }

      return allFarms;
    } catch (error) {
      console.error('❌ FarmMap API 호출 실패:', error);
      throw error;
    }
  }

  /**
   * 특정 지역의 농경지 데이터 조회 (새로운 기능)
   */
  async getFarmsByRegion(bjdCd: string): Promise<Farm[]> {
    if (!DATA_SOURCE_CONFIG.farmMapAPI.enabled) {
      throw new Error('FarmMap API가 비활성화 상태입니다');
    }

    try {
      const landCodes: Array<'01' | '02' | '03' | '04'> = ['01', '02', '03', '04'];
      const farms: Farm[] = [];

      for (const landCd of landCodes) {
        const farmData = await farmMapApiClient.getFarmDataByBjdAndLandCode(bjdCd, landCd);
        
        farmData.forEach((data) => {
          const farm = convertFarmMapDataToFarm(data, farms.length);
          farms.push(farm);
        });
      }

      return farms;
    } catch (error) {
      console.error('❌ 지역별 농장 데이터 조회 실패:', error);
      throw error;
    }
  }

  /**
   * 기상 데이터 조회 - 농장 위치 기반
   */
  async getWeatherData(farmLat?: number, farmLng?: number): Promise<WeatherData> {
    const config = DATA_SOURCE_CONFIG;
    
    if (config.debug) {
      console.log('🌤️ 기상 데이터 조회 시작:', {
        weatherAPI: config.weatherAPI.enabled,
        farmLocation: farmLat && farmLng ? `${farmLat}, ${farmLng}` : '기본 위치'
      });
    }

    // 1차 시도: 기상청 API 사용
    if (config.weatherAPI.enabled && farmLat && farmLng) {
      try {
        const weatherData = await kmaApiClient.getShortTermForecast(farmLat, farmLng);
        if (weatherData) {
          if (config.debug) {
            console.log('✅ 기상청 API에서 데이터 로딩 완료');
          }
          return weatherData;
        }
      } catch (error) {
        console.error('❌ 기상청 API 조회 실패:', error);
      }
    }

    // 2차 시도: 모크 데이터 사용
    if (config.debug) {
      console.log('📦 기상 모크데이터 사용');
    }
    
    return await this.getMockWeatherData();
  }

  /**
   * 농업기상 관측데이터 조회
   */
  async getAgriculturalWeatherData(stationName?: string): Promise<AgriculturalWeatherData | null> {
    const config = DATA_SOURCE_CONFIG;

    if (config.weatherAPI.enabled) {
      try {
        const data = await kmaApiClient.getAgriculturalWeatherData(stationName);
        if (data) {
          if (config.debug) {
            console.log('✅ 농업기상 데이터 로딩 완료:', data.station);
          }
          return data;
        }
      } catch (error) {
        console.error('❌ 농업기상 데이터 조회 실패:', error);
      }
    }

    // 폴백: 기본값 반환
    return {
      station: stationName || '기본 관측소',
      observationDate: new Date().toISOString(),
      temperature: 22,
      humidity: 65,
      windDirection: 180,
      windSpeed: 2.5,
      rainfall: 0,
      sunshine: 8.5,
      solarRadiation: 15.2,
      soilTemperature: 18,
      soilMoisture: 35
    };
  }

  /**
   * 모크 기상 데이터 로더
   */
  private async getMockWeatherData(): Promise<WeatherData> {
    try {
      // Vercel 환경에서는 import 방식 사용
      const weatherData = await import('../data/weather.json');
      return weatherData.default as WeatherData;
    } catch (error) {
      console.error('모크 기상데이터 로딩 실패:', error);
      // 폴백으로 하드코딩된 데이터 제공
      return {
        current: {
          temperature: 22,
          humidity: 65,
          rainfall: 0,
          windSpeed: 2.5,
          condition: '맑음',
          lastUpdated: new Date().toISOString()
        },
        forecast: Array.from({ length: 7 }, (_, i) => ({
          date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          tempMin: 15 + Math.random() * 5,
          tempMax: 25 + Math.random() * 5,
          rainfall: Math.random() > 0.7 ? Math.random() * 10 : 0,
          condition: ['맑음', '구름많음', '흐림'][Math.floor(Math.random() * 3)],
          risk: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high'
        })),
        alerts: []
      };
    }
  }

  /**
   * 병해충 정보 조회 - 작물별
   */
  async getPestInfo(cropName: string): Promise<RDAPestInfo[]> {
    const config = DATA_SOURCE_CONFIG;
    
    if (config.debug) {
      console.log('🐛 병해충 정보 조회:', cropName);
    }

    // 1차 시도: 농촌진흥청 API 사용
    if (config.dataPortalAPI.enabled) {
      try {
        const pestData = await rdaApiClient.getPestInfoByCrop(cropName);
        if (pestData.length > 0) {
          if (config.debug) {
            console.log(`✅ 농촌진흥청 API에서 ${pestData.length}개 병해충 정보 로딩 완료`);
          }
          return pestData;
        }
      } catch (error) {
        console.error('❌ 농촌진흥청 병해충 API 조회 실패:', error);
      }
    }

    // 2차 시도: 모크 데이터 사용
    if (config.debug) {
      console.log('📦 병해충 모크데이터 사용');
    }
    
    return this.getMockPestData(cropName);
  }

  /**
   * 토양 정보 조회 - 지역별
   */
  async getSoilInfo(region: string): Promise<SoilInfo | null> {
    const config = DATA_SOURCE_CONFIG;
    
    if (config.debug) {
      console.log('🌱 토양 정보 조회:', region);
    }

    // 1차 시도: 농촌진흥청 API 사용
    if (config.dataPortalAPI.enabled) {
      try {
        const soilData = await rdaApiClient.getSoilInfo(region);
        if (soilData) {
          if (config.debug) {
            console.log('✅ 농촌진흥청 API에서 토양 정보 로딩 완료');
          }
          return soilData;
        }
      } catch (error) {
        console.error('❌ 농촌진흥청 토양 API 조회 실패:', error);
      }
    }

    // 2차 시도: 모크 데이터 사용
    if (config.debug) {
      console.log('📦 토양 모크데이터 사용');
    }
    
    return this.getMockSoilData(region);
  }

  /**
   * 모크 병해충 데이터 생성
   */
  private getMockPestData(cropName: string): RDAPestInfo[] {
    const commonPests = [
      {
        cropName: cropName,
        pestName: '진딧물',
        pestType: '해충',
        symptoms: '잎이 오그라들고 황변됨',
        preventionMethod: '친환경 방제제 살포, 천적 곤충 활용',
        occurrenceTime: '4-6월, 9-10월',
        riskLevel: 'medium' as const,
        lastUpdated: new Date().toISOString()
      },
      {
        cropName: cropName,
        pestName: '잿빛곰팡이병',
        pestType: '병',
        symptoms: '잎과 과실에 회색 곰팡이 발생',
        preventionMethod: '통풍 개선, 습도 조절, 살균제 처리',
        occurrenceTime: '연중 (특히 습한 시기)',
        riskLevel: 'high' as const,
        lastUpdated: new Date().toISOString()
      },
      {
        cropName: cropName,
        pestName: '총채벌레',
        pestType: '해충',
        symptoms: '잎에 흰색 반점, 성장 저해',
        preventionMethod: '�끈끈이 트랩 설치, 생물학적 방제',
        occurrenceTime: '5-9월',
        riskLevel: 'low' as const,
        lastUpdated: new Date().toISOString()
      }
    ];

    return commonPests;
  }

  /**
   * 모크 토양 데이터 생성
   */
  private getMockSoilData(region: string): SoilInfo {
    return {
      region: region,
      soilType: '양토',
      phLevel: 6.2 + Math.random() * 0.6, // 6.2-6.8
      organicMatter: 2.8 + Math.random() * 0.4, // 2.8-3.2%
      nitrogen: 140 + Math.random() * 20, // 130-160 mg/kg
      phosphorus: 280 + Math.random() * 40, // 260-320 mg/kg
      potassium: 480 + Math.random() * 40, // 460-520 mg/kg
      calcium: 5200 + Math.random() * 600, // 4900-5800 mg/kg
      magnesium: 180 + Math.random() * 40, // 160-220 mg/kg
      soilMoisture: 28 + Math.random() * 8, // 24-36%
      lastUpdated: new Date().toISOString()
    };
  }

  /**
   * API 연결 상태 확인
   */
  async checkAPIConnection(): Promise<{ farmMap: boolean; weather: boolean; dataPortal: boolean }> {
    const results = {
      farmMap: false,
      weather: false,
      dataPortal: false
    };

    // FarmMap API 연결 테스트
    if (DATA_SOURCE_CONFIG.farmMapAPI.enabled) {
      try {
        results.farmMap = await farmMapApiClient.testConnection();
      } catch (error) {
        console.error('❌ FarmMap API 연결 테스트 실패:', error);
      }
    }

    // 기상청 API 연결 테스트
    if (DATA_SOURCE_CONFIG.weatherAPI.enabled) {
      try {
        results.weather = await kmaApiClient.testConnection();
      } catch (error) {
        console.error('❌ 기상청 API 연결 테스트 실패:', error);
      }
    }

    // 농촌진흥청 API 연결 테스트
    if (DATA_SOURCE_CONFIG.dataPortalAPI.enabled) {
      try {
        results.dataPortal = await rdaApiClient.testConnection();
      } catch (error) {
        console.error('❌ 농촌진흥청 API 연결 테스트 실패:', error);
      }
    }

    return results;
  }
}

// 싱글톤 인스턴스
export const hybridDataService = new HybridDataService();