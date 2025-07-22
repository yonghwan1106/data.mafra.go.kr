/**
 * 농촌진흥청 API 클라이언트 (공공데이터포털을 통한 접근)
 * - 병해충 발생정보 조회
 * - 토양환경정보 조회
 */

import { DATA_SOURCE_CONFIG } from '../config/data-sources';
import { 
  RDAPestInfo, 
  RDAApiResponse, 
  RDAPestSearchItem,
  SoilInfo,
  AgriculturalWeatherData 
} from '../types';

export class RDAApiClient {
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly apiKeyEncoded: string;
  private readonly timeout: number;

  constructor() {
    this.baseUrl = DATA_SOURCE_CONFIG.dataPortalAPI.baseUrl;
    this.apiKey = DATA_SOURCE_CONFIG.dataPortalAPI.apiKey;
    this.apiKeyEncoded = DATA_SOURCE_CONFIG.dataPortalAPI.apiKeyEncoded;
    this.timeout = DATA_SOURCE_CONFIG.dataPortalAPI.timeout;

    if (DATA_SOURCE_CONFIG.debug) {
      console.log('🌱 농촌진흥청 API 클라이언트 초기화:', {
        baseUrl: this.baseUrl,
        apiKey: this.apiKey ? '***' + this.apiKey.slice(-4) : '없음',
        enabled: DATA_SOURCE_CONFIG.dataPortalAPI.enabled
      });
    }
  }

  /**
   * 연결 상태 테스트
   */
  async testConnection(): Promise<boolean> {
    try {
      if (!this.apiKey) {
        console.warn('⚠️ 공공데이터포털 API 키가 설정되지 않았습니다');
        return false;
      }

      // 병해충 검색 API로 기본 테스트
      const testUrl = `${this.baseUrl}/1390804/CrpPestSearchService/getCrpPestList`;
      await this.makeRequest(testUrl, {
        serviceKey: this.apiKeyEncoded,
        numOfRows: '1',
        pageNo: '1'
      });

      if (DATA_SOURCE_CONFIG.debug) {
        console.log('✅ 농촌진흥청 API 연결 테스트 성공');
      }

      return true;
    } catch (error) {
      console.error('❌ 농촌진흥청 API 연결 테스트 실패:', error);
      return false;
    }
  }

  /**
   * 작물별 병해충 정보 검색
   */
  async getPestInfoByCrop(cropName: string): Promise<RDAPestInfo[]> {
    try {
      if (!DATA_SOURCE_CONFIG.dataPortalAPI.enabled) {
        throw new Error('농촌진흥청 API가 비활성화되어 있습니다');
      }

      const url = `${this.baseUrl}/1390804/CrpPestSearchService/getCrpPestList`;
      const params = {
        serviceKey: this.apiKeyEncoded,
        numOfRows: '100',
        pageNo: '1',
        cropnm: encodeURIComponent(cropName)
      };

      const response = await this.makeRequest(url, params);
      const data = response as RDAApiResponse<RDAPestSearchItem>;

      if (data.response.header.resultCode !== '00') {
        throw new Error(`농촌진흥청 API 오류: ${data.response.header.resultMsg}`);
      }

      return this.parsePestData(data.response.body.items);

    } catch (error) {
      console.error('❌ 병해충 정보 조회 실패:', error);
      return [];
    }
  }

  /**
   * 병해충명으로 상세 정보 검색
   */
  async getPestInfoByName(pestName: string): Promise<RDAPestInfo[]> {
    try {
      if (!DATA_SOURCE_CONFIG.dataPortalAPI.enabled) {
        throw new Error('농촌진흥청 API가 비활성화되어 있습니다');
      }

      const url = `${this.baseUrl}/1390804/CrpPestSearchService/getCrpPestList`;
      const params = {
        serviceKey: this.apiKeyEncoded,
        numOfRows: '50',
        pageNo: '1',
        pestnm: encodeURIComponent(pestName)
      };

      const response = await this.makeRequest(url, params);
      const data = response as RDAApiResponse<RDAPestSearchItem>;

      if (data.response.header.resultCode !== '00') {
        throw new Error(`농촌진흥청 API 오류: ${data.response.header.resultMsg}`);
      }

      return this.parsePestData(data.response.body.items);

    } catch (error) {
      console.error('❌ 병해충 검색 실패:', error);
      return [];
    }
  }

  /**
   * 농업기상 상세 관측데이터 조회
   */
  async getDetailedAgriculturalData(stationCode?: string): Promise<AgriculturalWeatherData | null> {
    try {
      if (!DATA_SOURCE_CONFIG.dataPortalAPI.enabled) {
        throw new Error('농촌진흥청 API가 비활성화되어 있습니다');
      }

      // 농업기상 상세 관측데이터 API
      const url = `${this.baseUrl}/1390804/NiasWeatherDetailService/getWeatherDetail`;
      const params = {
        serviceKey: this.apiKeyEncoded,
        numOfRows: '1',
        pageNo: '1',
        stnCd: stationCode || '108' // 기본: 서울 관측소
      };

      const response = await this.makeRequest(url, params);
      
      if (response?.response?.body?.items && response.response.body.items.length > 0) {
        const item = response.response.body.items[0];
        return {
          station: item.stnNm || '서울',
          observationDate: item.tm || new Date().toISOString(),
          temperature: parseFloat(item.ta) || 20,
          humidity: parseFloat(item.hm) || 60,
          windDirection: parseFloat(item.wd) || 0,
          windSpeed: parseFloat(item.ws) || 0,
          rainfall: parseFloat(item.rn) || 0,
          sunshine: parseFloat(item.ss) || 0,
          solarRadiation: parseFloat(item.sr) || 0,
          soilTemperature: parseFloat(item.ts) || 15,
          soilMoisture: parseFloat(item.sm) || 30
        };
      }

      return null;
    } catch (error) {
      console.error('❌ 농업기상 상세 데이터 조회 실패:', error);
      return null;
    }
  }

  /**
   * 토양 정보 조회 (모의 데이터)
   * 실제로는 농촌진흥청의 토양 분석 데이터를 가져와야 하지만,
   * 공개 API가 제한적이므로 농업기상 데이터를 기반으로 추정
   */
  async getSoilInfo(region: string): Promise<SoilInfo | null> {
    try {
      // 실제 토양 API가 없으므로 기본값 반환
      // 향후 실제 토양 분석 API가 공개되면 연동 예정
      return {
        region: region,
        soilType: '양토',
        phLevel: 6.5 + (Math.random() - 0.5) * 1.0, // 6.0-7.0 범위
        organicMatter: 2.5 + (Math.random() - 0.5) * 1.0, // 2.0-3.0%
        nitrogen: 150 + Math.random() * 50, // 125-200 mg/kg
        phosphorus: 300 + Math.random() * 100, // 250-400 mg/kg
        potassium: 500 + Math.random() * 200, // 400-700 mg/kg
        calcium: 5000 + Math.random() * 2000, // 4000-7000 mg/kg
        magnesium: 200 + Math.random() * 100, // 150-300 mg/kg
        soilMoisture: 25 + Math.random() * 20, // 15-35%
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ 토양 정보 조회 실패:', error);
      return null;
    }
  }

  /**
   * API 요청 공통 함수
   */
  private async makeRequest(url: string, params: Record<string, string>): Promise<any> {
    const queryString = new URLSearchParams(params).toString();
    const fullUrl = `${url}?${queryString}`;

    if (DATA_SOURCE_CONFIG.logApiCalls) {
      console.log('🌐 농촌진흥청 API 호출:', fullUrl.replace(this.apiKeyEncoded, '***'));
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
   * 병해충 API 응답을 표준 형식으로 변환
   */
  private parsePestData(items: RDAPestSearchItem[]): RDAPestInfo[] {
    return items.map(item => ({
      cropName: item.cropnm || '알 수 없음',
      pestName: item.pestnm || '알 수 없음',
      pestType: item.pestdvsn || '기타',
      symptoms: item.sympt || '정보 없음',
      preventionMethod: item.prevmthd || '방제법 정보 없음',
      occurrenceTime: item.occrnc || '연중',
      riskLevel: this.calculatePestRisk(item),
      lastUpdated: new Date().toISOString()
    }));
  }

  /**
   * 병해충 위험도 계산
   */
  private calculatePestRisk(item: RDAPestSearchItem): 'low' | 'medium' | 'high' {
    const currentMonth = new Date().getMonth() + 1;
    const occurrence = item.occrnc || '';
    
    // 발생시기 기반 위험도 평가
    if (occurrence.includes(`${currentMonth}월`) || 
        occurrence.includes('연중') || 
        occurrence.includes('상시')) {
      return 'high';
    }
    
    // 인접 월 확인
    const adjacentMonths = [currentMonth - 1, currentMonth + 1].map(m => 
      m <= 0 ? 12 + m : m > 12 ? m - 12 : m
    );
    
    if (adjacentMonths.some(month => occurrence.includes(`${month}월`))) {
      return 'medium';
    }
    
    return 'low';
  }
}

// 싱글톤 인스턴스 생성
export const rdaApiClient = new RDAApiClient();