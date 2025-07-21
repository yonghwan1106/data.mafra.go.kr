/**
 * 하이브리드 데이터 서비스 - 모크데이터와 실제 API를 유연하게 전환
 */

import { DATA_SOURCE_CONFIG } from '../config/data-sources';
import { farmMapApiClient, FarmMapData } from './farmmap-api-client';
import { Farm } from '../types';

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
   * API 연결 상태 확인
   */
  async checkAPIConnection(): Promise<boolean> {
    if (!DATA_SOURCE_CONFIG.farmMapAPI.enabled) {
      return false;
    }

    try {
      return await farmMapApiClient.testConnection();
    } catch (error) {
      console.error('❌ API 연결 테스트 실패:', error);
      return false;
    }
  }
}

// 싱글톤 인스턴스
export const hybridDataService = new HybridDataService();