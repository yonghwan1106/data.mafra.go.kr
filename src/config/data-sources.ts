/**
 * 데이터 소스 설정 - 모크데이터와 실제 API 간 전환 가능한 구조
 */

export interface DataSourceConfig {
  // 기본 설정
  primarySource: 'mock' | 'api';
  fallbackEnabled: boolean;
  
  // FarmMap API 설정
  farmMapAPI: {
    enabled: boolean;
    baseUrl: string;
    apiKey: string;
    domain: string;
    timeout: number;
  };
  
  // 모크데이터 설정
  mockData: {
    enabled: boolean;
    fallbackDelay: number; // API 실패시 대기 시간
  };
  
  // 개발/테스트 설정
  debug: boolean;
  logApiCalls: boolean;
}

// 환경별 설정
export const DATA_SOURCE_CONFIG: DataSourceConfig = {
  // 안전을 위해 기본값은 모크데이터 사용
  primarySource: 'mock',
  fallbackEnabled: true,
  
  farmMapAPI: {
    enabled: false, // 개발 완료 후 true로 변경
    baseUrl: 'https://agis.epis.or.kr/ASD/farmmapApi/',
    apiKey: '0eVL9ZCI4mwTeCbhdCwN',
    domain: 'https://data-mafra-go-kr.vercel.app/',
    timeout: 10000
  },
  
  mockData: {
    enabled: true,
    fallbackDelay: 1000
  },
  
  debug: process.env.NODE_ENV === 'development',
  logApiCalls: process.env.NODE_ENV === 'development'
};

// 런타임에 설정 변경 가능한 함수들
export const toggleDataSource = (source: 'mock' | 'api') => {
  DATA_SOURCE_CONFIG.primarySource = source;
  console.log(`✅ 데이터 소스 변경: ${source}`);
};

export const enableFarmMapAPI = () => {
  DATA_SOURCE_CONFIG.farmMapAPI.enabled = true;
  DATA_SOURCE_CONFIG.primarySource = 'api';
  console.log('✅ FarmMap API 활성화');
};

export const disableFarmMapAPI = () => {
  DATA_SOURCE_CONFIG.farmMapAPI.enabled = false;
  DATA_SOURCE_CONFIG.primarySource = 'mock';
  console.log('⚠️ FarmMap API 비활성화 - 모크데이터 사용');
};

// 개발용 디버그 함수
export const getDataSourceStatus = () => {
  return {
    primary: DATA_SOURCE_CONFIG.primarySource,
    apiEnabled: DATA_SOURCE_CONFIG.farmMapAPI.enabled,
    mockEnabled: DATA_SOURCE_CONFIG.mockData.enabled,
    fallback: DATA_SOURCE_CONFIG.fallbackEnabled
  };
};