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