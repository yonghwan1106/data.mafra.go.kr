/**
 * 기상청 API 클라이언트
 * - 기상청 API 허브를 통한 날씨 데이터 조회
 * - 농업기상정보 제공
 */

import { DATA_SOURCE_CONFIG } from '../config/data-sources';
import { 
  KMAWeatherResponse, 
  KMAWeatherItem, 
  KMAGridPosition, 
  AgriculturalWeatherData,
  WeatherData 
} from '../types';

export class KMAApiClient {
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly timeout: number;

  constructor() {
    this.baseUrl = DATA_SOURCE_CONFIG.weatherAPI.baseUrl;
    this.apiKey = DATA_SOURCE_CONFIG.weatherAPI.apiKey;
    this.timeout = DATA_SOURCE_CONFIG.weatherAPI.timeout;

    if (DATA_SOURCE_CONFIG.debug) {
      console.log('🌤️ 기상청 API 클라이언트 초기화:', {
        baseUrl: this.baseUrl,
        apiKey: this.apiKey ? '***' + this.apiKey.slice(-4) : '없음',
        enabled: DATA_SOURCE_CONFIG.weatherAPI.enabled
      });
    }
  }

  /**
   * 연결 상태 테스트
   */
  async testConnection(): Promise<boolean> {
    try {
      if (!this.apiKey) {
        console.warn('⚠️ 기상청 API 키가 설정되지 않았습니다');
        return false;
      }

      // 기본 API 호출 테스트 (서울 지역)
      const testUrl = `${this.baseUrl}/api/typ01/url/kma_sfctm2.php`;
      await this.makeRequest(testUrl, {
        authKey: this.apiKey,
        type: 'json',
        helpNo: '1',
        numOfRows: '1'
      });

      if (DATA_SOURCE_CONFIG.debug) {
        console.log('✅ 기상청 API 연결 테스트 성공');
      }

      return true;
    } catch (error) {
      console.error('❌ 기상청 API 연결 테스트 실패:', error);
      return false;
    }
  }

  /**
   * 좌표를 기상청 격자 좌표로 변환
   * 농장 위치(위도/경도)를 기상청 API에서 사용하는 격자 좌표로 변환
   */
  private convertToGrid(lat: number, lng: number): KMAGridPosition {
    // 기상청 격자 변환 공식 (간소화된 버전)
    // 실제로는 복잡한 투영법 변환이 필요하지만, 
    // 여기서는 대략적인 변환을 사용
    
    const RE = 6371.00877; // 지구 반경 (km)
    const GRID = 5.0; // 격자 간격 (km)
    const SLAT1 = 30.0; // 투영 위도1(degree)
    const SLAT2 = 60.0; // 투영 위도2(degree)
    const OLON = 126.0; // 기준점 경도(degree)
    const OLAT = 38.0; // 기준점 위도(degree)
    const XO = 43; // 기준점 X좌표(GRID)
    const YO = 136; // 기준점 Y좌표(GRID)

    const DEGRAD = Math.PI / 180.0;
    // const RADDEG = 180.0 / Math.PI; // 사용하지 않음

    const re = RE / GRID;
    const slat1 = SLAT1 * DEGRAD;
    const slat2 = SLAT2 * DEGRAD;
    const olon = OLON * DEGRAD;
    const olat = OLAT * DEGRAD;

    let sn = Math.tan(Math.PI * 0.25 + slat2 * 0.5) / Math.tan(Math.PI * 0.25 + slat1 * 0.5);
    sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
    let sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
    sf = Math.pow(sf, sn) * Math.cos(slat1) / sn;
    let ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
    ro = re * sf / Math.pow(ro, sn);

    let ra = Math.tan(Math.PI * 0.25 + lat * DEGRAD * 0.5);
    ra = re * sf / Math.pow(ra, sn);
    let theta = lng * DEGRAD - olon;
    if (theta > Math.PI) theta -= 2.0 * Math.PI;
    if (theta < -Math.PI) theta += 2.0 * Math.PI;
    theta *= sn;

    const x = Math.floor(ra * Math.sin(theta) + XO + 0.5);
    const y = Math.floor(ro - ra * Math.cos(theta) + YO + 0.5);

    return { nx: x, ny: y };
  }

  /**
   * 단기예보 조회 (농장 위치 기반)
   */
  async getShortTermForecast(farmLat: number, farmLng: number): Promise<WeatherData | null> {
    try {
      if (!DATA_SOURCE_CONFIG.weatherAPI.enabled) {
        throw new Error('기상청 API가 비활성화되어 있습니다');
      }

      const grid = this.convertToGrid(farmLat, farmLng);
      const today = new Date();
      const baseDate = today.toISOString().slice(0, 10).replace(/-/g, '');
      
      // 발표시간 계산 (02, 05, 08, 11, 14, 17, 20, 23시 발표)
      const currentHour = today.getHours();
      const baseTimes = ['0200', '0500', '0800', '1100', '1400', '1700', '2000', '2300'];
      let baseTime = '0200';
      for (let i = baseTimes.length - 1; i >= 0; i--) {
        if (currentHour >= parseInt(baseTimes[i].slice(0, 2))) {
          baseTime = baseTimes[i];
          break;
        }
      }

      const url = `${this.baseUrl}/api/typ02/openapi/VilageFcstInfoService_2.0/getVilageFcst`;
      const params = {
        serviceKey: this.apiKey,
        dataType: 'JSON',
        base_date: baseDate,
        base_time: baseTime,
        nx: grid.nx.toString(),
        ny: grid.ny.toString(),
        numOfRows: '1000'
      };

      const response = await this.makeRequest(url, params);
      const data = response as KMAWeatherResponse;

      if (data.response.header.resultCode !== '00') {
        throw new Error(`기상청 API 오류: ${data.response.header.resultMsg}`);
      }

      return this.parseWeatherData(data.response.body.items.item);

    } catch (error) {
      console.error('❌ 기상청 단기예보 조회 실패:', error);
      return null;
    }
  }

  /**
   * 농업기상 관측데이터 조회
   */
  async getAgriculturalWeatherData(stationName: string = '서울'): Promise<AgriculturalWeatherData | null> {
    try {
      if (!DATA_SOURCE_CONFIG.weatherAPI.enabled) {
        throw new Error('기상청 API가 비활성화되어 있습니다');
      }

      // 농업기상 API 엔드포인트
      const url = `${this.baseUrl}/api/typ01/url/kma_sfctm2.php`;
      const params = {
        authKey: this.apiKey,
        type: 'json',
        helpNo: '1',
        stnNm: encodeURIComponent(stationName)
      };

      const response = await this.makeRequest(url, params);
      
      if (response && response.length > 0) {
        const item = response[0];
        return {
          station: stationName,
          observationDate: new Date().toISOString(),
          temperature: parseFloat(item.ta) || 20, // 기온
          humidity: parseFloat(item.hm) || 60, // 습도
          windDirection: parseFloat(item.wd) || 0, // 풍향
          windSpeed: parseFloat(item.ws) || 0, // 풍속
          rainfall: parseFloat(item.rn) || 0, // 강수량
          sunshine: parseFloat(item.ss) || 0, // 일조시간
          solarRadiation: parseFloat(item.sr) || 0, // 일사량
          soilTemperature: parseFloat(item.ts) || 15, // 지중온도
          soilMoisture: parseFloat(item.sm) || 30 // 토양수분
        };
      }

      return null;
    } catch (error) {
      console.error('❌ 농업기상 데이터 조회 실패:', error);
      return null;
    }
  }

  /**
   * 기상특보 조회
   */
  async getWeatherWarnings(): Promise<any[]> {
    try {
      if (!DATA_SOURCE_CONFIG.weatherAPI.enabled) {
        return [];
      }

      const url = `${this.baseUrl}/api/typ02/openapi/WthrWrnInfoService/getWthrWrnList`;
      const params = {
        serviceKey: this.apiKey,
        dataType: 'JSON',
        numOfRows: '10'
      };

      const response = await this.makeRequest(url, params);
      return response?.response?.body?.items?.item || [];

    } catch (error) {
      console.error('❌ 기상특보 조회 실패:', error);
      return [];
    }
  }

  /**
   * API 요청 공통 함수
   */
  private async makeRequest(url: string, params: Record<string, string>): Promise<any> {
    const queryString = new URLSearchParams(params).toString();
    const fullUrl = `${url}?${queryString}`;

    if (DATA_SOURCE_CONFIG.logApiCalls) {
      console.log('🌐 기상청 API 호출:', fullUrl.replace(this.apiKey, '***'));
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;

    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  /**
   * 기상청 API 응답을 WeatherData 형식으로 변환
   */
  private parseWeatherData(items: KMAWeatherItem[]): WeatherData {
    const now = new Date();
    const forecastData: Record<string, any> = {};

    // 카테고리별로 데이터 분류
    items.forEach(item => {
      const key = `${item.fcstDate}_${item.fcstTime}`;
      if (!forecastData[key]) {
        forecastData[key] = { date: item.fcstDate, time: item.fcstTime };
      }
      forecastData[key][item.category] = item.fcstValue;
    });

    // 현재 시간과 가장 가까운 데이터를 현재 날씨로 사용
    const forecastEntries = Object.entries(forecastData);
    const current = forecastEntries.length > 0 ? forecastEntries[0][1] : {};

    return {
      current: {
        temperature: parseFloat(current.TMP) || 20,
        humidity: parseFloat(current.REH) || 60,
        rainfall: parseFloat(current.PCP?.replace('강수없음', '0')) || 0,
        windSpeed: parseFloat(current.WSD) || 0,
        condition: this.getSkyCondition(current.SKY),
        lastUpdated: now.toISOString()
      },
      forecast: forecastEntries.slice(1, 8).map(([, item]) => ({
        date: item.date,
        tempMin: parseFloat(item.TMN) || 15,
        tempMax: parseFloat(item.TMX) || 25,
        rainfall: parseFloat(item.PCP?.replace('강수없음', '0')) || 0,
        condition: this.getSkyCondition(item.SKY),
        risk: this.calculateWeatherRisk(item)
      })),
      alerts: [] // 기상특보는 별도 API로 조회
    };
  }

  /**
   * 하늘 상태 코드를 문자열로 변환
   */
  private getSkyCondition(skyCode: string): string {
    switch (skyCode) {
      case '1': return '맑음';
      case '3': return '구름많음';
      case '4': return '흐림';
      default: return '알 수 없음';
    }
  }

  /**
   * 날씨 위험도 계산
   */
  private calculateWeatherRisk(data: any): 'low' | 'medium' | 'high' {
    const rainfall = parseFloat(data.PCP?.replace('강수없음', '0')) || 0;
    const windSpeed = parseFloat(data.WSD) || 0;
    const temp = parseFloat(data.TMP) || 20;

    // 농업에 위험한 조건들을 종합 평가
    let riskScore = 0;

    if (rainfall > 30) riskScore += 2; // 강한 비
    else if (rainfall > 10) riskScore += 1; // 보통 비

    if (windSpeed > 10) riskScore += 2; // 강풍
    else if (windSpeed > 5) riskScore += 1; // 바람

    if (temp < 0 || temp > 35) riskScore += 2; // 극한 온도
    else if (temp < 5 || temp > 30) riskScore += 1; // 주의 온도

    if (riskScore >= 4) return 'high';
    if (riskScore >= 2) return 'medium';
    return 'low';
  }
}

// 싱글톤 인스턴스 생성
export const kmaApiClient = new KMAApiClient();