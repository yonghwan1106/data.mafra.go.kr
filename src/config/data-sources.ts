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

  // 기상청 API 설정
  weatherAPI: {
    enabled: boolean;
    baseUrl: string;
    apiKey: string;
    timeout: number;
  };

  // KAMIS 농산물 가격 API 설정
  priceAPI: {
    enabled: boolean;
    baseUrl: string;
    apiKey: string;
    timeout: number;
  };

  // 공공데이터포털 API 설정 (농촌진흥청 등)
  dataPortalAPI: {
    enabled: boolean;
    baseUrl: string;
    apiKey: string;
    apiKeyEncoded: string;
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

// 환경별 설정 - 환경변수에서 API 키 로드
export const DATA_SOURCE_CONFIG: DataSourceConfig = {
  // 안전을 위해 기본값은 모크데이터 사용
  primarySource: 'mock',
  fallbackEnabled: true,
  
  farmMapAPI: {
    enabled: !!process.env.REACT_APP_FARMMAP_API_KEY, // API 키가 있으면 자동 활성화
    baseUrl: process.env.REACT_APP_FARMMAP_API_BASE_URL || 'https://agis.epis.or.kr/ASD/farmmapApi/',
    apiKey: process.env.REACT_APP_FARMMAP_API_KEY || '',
    domain: 'https://data-mafra-go-kr.vercel.app/',
    timeout: 10000
  },

  weatherAPI: {
    enabled: !!process.env.REACT_APP_KMA_API_KEY, // API 키가 있으면 자동 활성화
    baseUrl: process.env.REACT_APP_KMA_API_BASE_URL || 'https://apihub.kma.go.kr',
    apiKey: process.env.REACT_APP_KMA_API_KEY || '',
    timeout: 10000
  },

  priceAPI: {
    enabled: !!process.env.REACT_APP_KAMIS_API_KEY, // 향후 API 키 발급시 자동 활성화
    baseUrl: process.env.REACT_APP_KAMIS_API_BASE_URL || 'https://www.kamis.or.kr',
    apiKey: process.env.REACT_APP_KAMIS_API_KEY || '',
    timeout: 10000
  },

  dataPortalAPI: {
    enabled: !!process.env.REACT_APP_DATA_PORTAL_API_KEY, // 공공데이터포털 API 키가 있으면 자동 활성화
    baseUrl: process.env.REACT_APP_DATA_PORTAL_BASE_URL || 'http://apis.data.go.kr',
    apiKey: process.env.REACT_APP_DATA_PORTAL_API_KEY || '',
    apiKeyEncoded: process.env.REACT_APP_DATA_PORTAL_API_KEY_ENCODED || '',
    timeout: 10000
  },
  
  mockData: {
    enabled: true,
    fallbackDelay: 1000
  },
  
  debug: process.env.REACT_APP_DEBUG_MODE === 'true',
  logApiCalls: process.env.REACT_APP_LOG_API_CALLS === 'true'
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

export const enableWeatherAPI = () => {
  DATA_SOURCE_CONFIG.weatherAPI.enabled = true;
  console.log('✅ 기상청 API 활성화');
};

export const disableWeatherAPI = () => {
  DATA_SOURCE_CONFIG.weatherAPI.enabled = false;
  console.log('⚠️ 기상청 API 비활성화');
};

export const enablePriceAPI = () => {
  DATA_SOURCE_CONFIG.priceAPI.enabled = true;
  console.log('✅ KAMIS 가격 API 활성화');
};

export const disablePriceAPI = () => {
  DATA_SOURCE_CONFIG.priceAPI.enabled = false;
  console.log('⚠️ KAMIS 가격 API 비활성화');
};

// 개발용 디버그 함수
export const getDataSourceStatus = () => {
  return {
    primary: DATA_SOURCE_CONFIG.primarySource,
    farmMapAPI: DATA_SOURCE_CONFIG.farmMapAPI.enabled,
    weatherAPI: DATA_SOURCE_CONFIG.weatherAPI.enabled,
    priceAPI: DATA_SOURCE_CONFIG.priceAPI.enabled,
    dataPortalAPI: DATA_SOURCE_CONFIG.dataPortalAPI.enabled,
    mockEnabled: DATA_SOURCE_CONFIG.mockData.enabled,
    fallback: DATA_SOURCE_CONFIG.fallbackEnabled,
    debug: DATA_SOURCE_CONFIG.debug
  };
};