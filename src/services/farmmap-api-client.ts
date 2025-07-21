/**
 * FarmMap API 클라이언트 - 농림축산식품부 팜맵 API 연동
 */

import { DATA_SOURCE_CONFIG } from '../config/data-sources';

// API 응답 타입 정의
export interface FarmMapResponse<T = any> {
  status: {
    result: 'S' | 'F';
    message: string;
    code?: string;
  };
  input: Record<string, any>;
  output: {
    farmmapData?: {
      data: T[];
      totalCount: number;
    };
  };
}

// 농경지 데이터 타입
export interface FarmMapData {
  id: string;
  uid?: string;
  pnu: string;
  fl_nm: string; // 농경지 분류 (논, 밭, 과수, 시설)
  fl_ar: number; // 농경지 면적
  ldcg_cd: string; // 농경지 분류 코드
  stdg_cd?: string;
  stdg_addr?: string;
  geometry?: {
    type: string;
    coordinates: number[][][];
  };
}

// API 요청 파라미터
export interface FarmMapApiParams {
  pnu?: string;
  x?: number;
  y?: number;
  epsg?: string;
  radius?: number;
  bjdCd?: string;
  landCd?: string;
  mapType?: 'farmmap' | 'base';
  columnType?: 'ENG' | 'KOR';
  apiVersion?: 'v1' | 'v2' | 'v3';
}

export class FarmMapApiClient {
  private baseUrl: string;
  private apiKey: string;
  private domain: string;
  private timeout: number;

  constructor() {
    this.baseUrl = DATA_SOURCE_CONFIG.farmMapAPI.baseUrl;
    this.apiKey = DATA_SOURCE_CONFIG.farmMapAPI.apiKey;
    this.domain = DATA_SOURCE_CONFIG.farmMapAPI.domain;
    this.timeout = DATA_SOURCE_CONFIG.farmMapAPI.timeout;
  }

  /**
   * JSONP 방식으로 API 호출 (CORS 회피)
   */
  private async callApi<T>(
    endpoint: string, 
    params: FarmMapApiParams = {}
  ): Promise<FarmMapResponse<T>> {
    const defaultParams = {
      apiKey: this.apiKey,
      domain: this.domain,
      columnType: 'KOR',
      mapType: 'farmmap',
      apiVersion: 'v3',
      ...params
    };

    const queryString = new URLSearchParams(
      Object.entries(defaultParams).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null) {
          acc[key] = String(value);
        }
        return acc;
      }, {} as Record<string, string>)
    ).toString();

    const url = `${this.baseUrl}${endpoint}?${queryString}`;
    
    if (DATA_SOURCE_CONFIG.logApiCalls) {
      console.log('🌐 FarmMap API 호출:', url);
    }

    try {
      // JSONP 방식으로 호출
      const response = await this.fetchWithJsonp<FarmMapResponse<T>>(url);
      
      if (response.status.result === 'F') {
        throw new Error(`API 오류: ${response.status.message}`);
      }

      return response;
    } catch (error) {
      console.error('❌ FarmMap API 오류:', error);
      throw error;
    }
  }

  /**
   * JSONP 방식으로 데이터 가져오기
   */
  private fetchWithJsonp<T>(url: string): Promise<T> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      const callbackName = `callback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // 타임아웃 설정
      const timeoutId = setTimeout(() => {
        cleanup();
        reject(new Error('API 호출 타임아웃'));
      }, this.timeout);

      const cleanup = () => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
        delete (window as any)[callbackName];
        clearTimeout(timeoutId);
      };

      // 콜백 함수 설정
      (window as any)[callbackName] = (data: T) => {
        cleanup();
        resolve(data);
      };

      script.onerror = () => {
        cleanup();
        reject(new Error('스크립트 로딩 오류'));
      };

      // URL에 콜백 파라미터 추가
      const separator = url.includes('?') ? '&' : '?';
      script.src = `${url}${separator}callback=${callbackName}`;
      
      document.head.appendChild(script);
    });
  }

  /**
   * PNU(필지고유번호) 기반 농경지 데이터 조회
   */
  async getFarmDataByPNU(pnu: string): Promise<FarmMapData[]> {
    const response = await this.callApi<FarmMapData>('getFarmmapDataSeachPnu.do', { pnu });
    return response.output.farmmapData?.data || [];
  }

  /**
   * 좌표 기반 농경지 데이터 조회
   */
  async getFarmDataByCoordinate(
    x: number, 
    y: number, 
    epsg: string = 'EPSG:5179'
  ): Promise<FarmMapData[]> {
    const response = await this.callApi<FarmMapData>('getFarmmapDataSeachXY.do', { x, y, epsg });
    return response.output.farmmapData?.data || [];
  }

  /**
   * 반경 기반 농경지 데이터 조회
   */
  async getFarmDataByRadius(
    x: number, 
    y: number, 
    radius: number,
    epsg: string = 'EPSG:5179'
  ): Promise<FarmMapData[]> {
    const response = await this.callApi<FarmMapData>('getFarmmapDataSeachRadius.do', { 
      x, y, radius, epsg 
    });
    return response.output.farmmapData?.data || [];
  }

  /**
   * 읍면동 + 농경지분류 기반 조회
   */
  async getFarmDataByBjdAndLandCode(
    bjdCd: string,
    landCd: '01' | '02' | '03' | '04' | '06' // 논, 밭, 과수, 시설, 비경지
  ): Promise<FarmMapData[]> {
    const response = await this.callApi<FarmMapData>('getFarmmapDataSeachBjdAndLandCode.do', { 
      bjdCd, landCd 
    });
    return response.output.farmmapData?.data || [];
  }

  /**
   * 연결성 테스트
   */
  async testConnection(): Promise<boolean> {
    try {
      // 테스트용 PNU로 간단한 조회
      const testPnu = '3611031024201550000';
      await this.getFarmDataByPNU(testPnu);
      console.log('✅ FarmMap API 연결 성공');
      return true;
    } catch (error) {
      console.error('❌ FarmMap API 연결 실패:', error);
      return false;
    }
  }
}

// 싱글톤 인스턴스
export const farmMapApiClient = new FarmMapApiClient();