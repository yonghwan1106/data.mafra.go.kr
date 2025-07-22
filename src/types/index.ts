export interface Farm {
  id: string;
  name: string;
  owner: string;
  location: {
    lat: number;
    lng: number;
    address: string;
    region: string;
  };
  cropType: string;
  farmSize: number;
  aciScore: number;
  aciGrade: 'A' | 'B' | 'C' | 'D' | 'E';
  lastUpdated: string;
}

export interface ACIData {
  date: string;
  aci: number;
  wri: number; // Weather Risk Index
  shi: number; // Soil Health Index
  pri: number; // Pest Risk Index
  mvi: number; // Market Value Index
  psi: number; // Policy Support Index
  gsi: number; // Geographic Suitability Index
}

export interface WeatherData {
  current: {
    temperature: number;
    humidity: number;
    rainfall: number;
    windSpeed: number;
    condition: string;
    lastUpdated: string;
  };
  forecast: {
    date: string;
    tempMin: number;
    tempMax: number;
    rainfall: number;
    condition: string;
    risk: 'low' | 'medium' | 'high';
  }[];
  alerts: {
    type: string;
    severity: string;
    message: string;
    startDate: string;
    endDate: string;
  }[];
}

// 기상청 API 응답 타입들
export interface KMAWeatherResponse {
  response: {
    header: {
      resultCode: string;
      resultMsg: string;
    };
    body: {
      dataType: string;
      items: {
        item: KMAWeatherItem[];
      };
      pageNo: number;
      numOfRows: number;
      totalCount: number;
    };
  };
}

export interface KMAWeatherItem {
  baseDate: string;      // 발표일자
  baseTime: string;      // 발표시각
  category: string;      // 자료구분문자
  fcstDate: string;      // 예보일자
  fcstTime: string;      // 예보시각
  fcstValue: string;     // 예보값
  nx: number;           // 예보지점 X좌표
  ny: number;           // 예보지점 Y좌표
}

export interface KMAGridPosition {
  nx: number;
  ny: number;
}

// 기상청 카테고리 코드
export interface KMAWeatherCategories {
  POP: string;  // 강수확률 %
  PTY: string;  // 강수형태 (0:없음, 1:비, 2:비/눈, 3:눈, 4:소나기)
  PCP: string;  // 1시간 강수량 mm
  REH: string;  // 습도 %
  SNO: string;  // 1시간 신적설 cm
  SKY: string;  // 하늘상태 (1:맑음, 3:구름많음, 4:흐림)
  TMP: string;  // 1시간 기온 ℃
  TMN: string;  // 일 최저기온 ℃
  TMX: string;  // 일 최고기온 ℃
  UUU: string;  // 풍속(동서성분) m/s
  VVV: string;  // 풍속(남북성분) m/s
  WAV: string;  // 파고 M
  VEC: string;  // 풍향 deg
  WSD: string;  // 풍속 m/s
}

// 농업기상 데이터 타입
export interface AgriculturalWeatherData {
  station: string;        // 관측소명
  observationDate: string; // 관측일시
  temperature: number;     // 기온 (℃)
  humidity: number;        // 습도 (%)
  windDirection: number;   // 풍향 (도)
  windSpeed: number;       // 풍속 (m/s)
  rainfall: number;        // 강수량 (mm)
  sunshine: number;        // 일조시간 (hr)
  solarRadiation: number;  // 일사량 (MJ/m²)
  soilTemperature: number; // 지중온도 (℃)
  soilMoisture: number;    // 토양수분 (%)
}

// 농촌진흥청 병해충 정보 타입
export interface RDAPestInfo {
  cropName: string;        // 작물명
  pestName: string;        // 병해충명
  pestType: string;        // 병해충 구분 (병/해충)
  symptoms: string;        // 증상
  preventionMethod: string; // 방제법
  occurrenceTime: string;   // 발생시기
  riskLevel: 'low' | 'medium' | 'high'; // 위험도
  lastUpdated: string;     // 최종 업데이트
}

// 농촌진흥청 API 응답 타입
export interface RDAApiResponse<T> {
  response: {
    header: {
      resultCode: string;
      resultMsg: string;
    };
    body: {
      items: T[];
      numOfRows: number;
      pageNo: number;
      totalCount: number;
    };
  };
}

// 병해충 검색 API 응답 아이템
export interface RDAPestSearchItem {
  cropnm: string;      // 작물명
  pestnm: string;      // 병해충명
  pestdvsn: string;    // 병해충구분
  sympt: string;       // 증상
  prevmthd: string;    // 방제법
  occrnc: string;      // 발생시기
}

// 토양 정보 타입
export interface SoilInfo {
  region: string;          // 지역
  soilType: string;        // 토양형
  phLevel: number;         // pH
  organicMatter: number;   // 유기물 함량 (%)
  nitrogen: number;        // 질소 (mg/kg)
  phosphorus: number;      // 인산 (mg/kg)
  potassium: number;       // 칼리 (mg/kg)
  calcium: number;         // 칼슘 (mg/kg)
  magnesium: number;       // 마그네슘 (mg/kg)
  soilMoisture: number;    // 토양수분 (%)
  lastUpdated: string;     // 최종 업데이트
}

export interface MarketPrice {
  currentPrice: number;
  averagePrice: number;
  priceChange: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  unit: string;
  lastUpdated: string;
  history: {
    date: string;
    price: number;
  }[];
}

export interface Policy {
  id: string;
  title: string;
  category: string;
  supportAmount: number;
  applicationPeriod: {
    start: string;
    end: string;
  };
  targetCrops: string[];
  selectionRate: number;
  description: string;
  benefits: string[];
}

export type ACIGrade = 'A' | 'B' | 'C' | 'D' | 'E';

export interface IndexScore {
  score: number;
  grade: ACIGrade;
  name: string;
  icon: string;
  color: string;
}