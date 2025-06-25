import { ACIData, WeatherData } from '../types';

export interface PredictionModel {
  confidence: number;
  accuracy: number;
  factors: string[];
}

export interface AdvancedPrediction extends ACIData {
  confidence: number;
  riskFactors: {
    weather: number;
    pest: number;
    market: number;
    overall: number;
  };
  recommendations: string[];
  criticalAlerts: string[];
}

export class AIPredictor {
  private static readonly LSTM_WEIGHTS = {
    weather: [0.3, 0.25, 0.2, 0.15, 0.1],
    seasonal: [0.4, 0.3, 0.2, 0.1],
    market: [0.35, 0.25, 0.2, 0.15, 0.05],
    historical: [0.5, 0.3, 0.15, 0.05]
  };

  private static readonly SEASONAL_FACTORS = {
    spring: { wri: 1.1, shi: 1.2, pri: 0.9, mvi: 1.0, psi: 1.1, gsi: 1.0 },
    summer: { wri: 0.8, shi: 0.9, pri: 1.3, mvi: 1.1, psi: 1.0, gsi: 1.0 },
    autumn: { wri: 1.0, shi: 1.0, pri: 1.1, mvi: 1.2, psi: 1.0, gsi: 1.0 },
    winter: { wri: 0.9, shi: 0.8, pri: 0.7, mvi: 0.9, psi: 1.2, gsi: 1.0 }
  };

  static generateAdvancedPrediction(
    history: ACIData[], 
    weatherData?: WeatherData,
    days: number = 30
  ): AdvancedPrediction[] {
    if (history.length < 10) {
      throw new Error('최소 10일간의 데이터가 필요합니다');
    }

    const predictions: AdvancedPrediction[] = [];
    const currentSeason = this.getCurrentSeason();
    const seasonalFactors = this.SEASONAL_FACTORS[currentSeason];

    for (let i = 1; i <= days; i++) {
      const prediction = this.generateSingleDayPrediction(
        history, 
        i, 
        seasonalFactors,
        weatherData
      );
      predictions.push(prediction);
    }

    return predictions;
  }

  private static generateSingleDayPrediction(
    history: ACIData[],
    dayOffset: number,
    seasonalFactors: any,
    weatherData?: WeatherData
  ): AdvancedPrediction {
    const recentHistory = history.slice(-14); // 최근 14일
    const trends = this.calculateAdvancedTrends(recentHistory);
    // Detect cyclical patterns for future analysis
    this.detectCyclicalPatterns(history);
    const volatility = this.calculateVolatility(recentHistory);

    // LSTM 기반 예측
    const lstmPrediction = this.lstmPredict(recentHistory, dayOffset);
    
    // 계절성 및 외부 요인 적용
    const seasonalAdjustment = this.applySeasonalFactors(lstmPrediction, seasonalFactors);
    
    // 기상 영향 반영
    const weatherAdjustment = weatherData ? 
      this.applyWeatherFactors(seasonalAdjustment, weatherData, dayOffset) : 
      seasonalAdjustment;

    // 시장 변동성 반영
    const marketAdjustment = this.applyMarketVolatility(weatherAdjustment, volatility);
    
    // 최종 예측값
    const finalPrediction = this.stabilizePrediction(marketAdjustment);

    // 신뢰도 계산
    const confidence = this.calculateConfidence(trends, volatility, dayOffset);

    // 위험 요소 분석
    const riskFactors = this.analyzeRiskFactors(finalPrediction, trends);

    // 추천사항 생성
    const recommendations = this.generateRecommendations(finalPrediction, riskFactors);

    // 중요 알림 생성
    const criticalAlerts = this.generateCriticalAlerts(finalPrediction, riskFactors);

    const date = new Date();
    date.setDate(date.getDate() + dayOffset);

    return {
      date: date.toISOString().split('T')[0],
      aci: Math.round(finalPrediction.aci),
      wri: Math.round(finalPrediction.wri),
      shi: Math.round(finalPrediction.shi),
      pri: Math.round(finalPrediction.pri),
      mvi: Math.round(finalPrediction.mvi),
      psi: Math.round(finalPrediction.psi),
      gsi: Math.round(finalPrediction.gsi),
      confidence,
      riskFactors,
      recommendations,
      criticalAlerts
    };
  }

  private static lstmPredict(history: ACIData[], dayOffset: number): ACIData {
    const weights = this.LSTM_WEIGHTS.historical;
    const recentData = history.slice(-weights.length);
    
    const prediction = {
      aci: 0, wri: 0, shi: 0, pri: 0, mvi: 0, psi: 0, gsi: 0
    };

    // LSTM 시뮬레이션 (가중평균 + 추세)
    recentData.forEach((data, index) => {
      const weight = weights[index] || 0.05;
      prediction.aci += data.aci * weight;
      prediction.wri += data.wri * weight;
      prediction.shi += data.shi * weight;
      prediction.pri += data.pri * weight;
      prediction.mvi += data.mvi * weight;
      prediction.psi += data.psi * weight;
      prediction.gsi += data.gsi * weight;
    });

    // 시간 감쇠 적용 (예측일이 멀수록 평균회귀)
    const decayFactor = Math.exp(-dayOffset * 0.05);
    const avgValues = this.calculateHistoricalAverage(history);
    
    Object.keys(prediction).forEach(key => {
      const currentValue = (prediction as any)[key];
      const avgValue = (avgValues as any)[key];
      (prediction as any)[key] = currentValue * decayFactor + avgValue * (1 - decayFactor);
    });

    return {
      date: '',
      ...prediction
    };
  }

  private static calculateAdvancedTrends(history: ACIData[]) {
    const trends = { aci: 0, wri: 0, shi: 0, pri: 0, mvi: 0, psi: 0, gsi: 0 };
    const weights = [0.5, 0.3, 0.2]; // 최근 3일 가중치
    
    for (let i = 0; i < Math.min(3, history.length - 1); i++) {
      const current = history[history.length - 1 - i];
      const previous = history[history.length - 2 - i];
      const weight = weights[i] || 0.1;
      
      Object.keys(trends).forEach(key => {
        const change = (current as any)[key] - (previous as any)[key];
        (trends as any)[key] += change * weight;
      });
    }
    
    return trends;
  }

  private static detectCyclicalPatterns(history: ACIData[]): number[] {
    // 7일 주기 패턴 감지
    const weeklyPattern = new Array(7).fill(0);
    const dailyCounts = new Array(7).fill(0);
    
    history.forEach((data, index) => {
      const dayOfWeek = index % 7;
      weeklyPattern[dayOfWeek] += data.aci;
      dailyCounts[dayOfWeek]++;
    });
    
    return weeklyPattern.map((sum, index) => 
      dailyCounts[index] > 0 ? sum / dailyCounts[index] : 0
    );
  }

  private static calculateVolatility(history: ACIData[]) {
    const aciValues = history.map(h => h.aci);
    const mean = aciValues.reduce((sum, val) => sum + val, 0) / aciValues.length;
    const variance = aciValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / aciValues.length;
    return Math.sqrt(variance);
  }

  private static applySeasonalFactors(prediction: ACIData, factors: any): ACIData {
    return {
      ...prediction,
      wri: prediction.wri * factors.wri,
      shi: prediction.shi * factors.shi,
      pri: prediction.pri * factors.pri,
      mvi: prediction.mvi * factors.mvi,
      psi: prediction.psi * factors.psi,
      gsi: prediction.gsi * factors.gsi
    };
  }

  private static applyWeatherFactors(prediction: ACIData, weather: WeatherData, dayOffset: number): ACIData {
    const forecastIndex = Math.min(dayOffset - 1, weather.forecast.length - 1);
    const forecast = weather.forecast[forecastIndex];
    
    if (!forecast) return prediction;

    let weatherImpact = {
      wri: 0,
      shi: 0,
      pri: 0,
      mvi: 0,
      psi: 0,
      gsi: 0
    };

    // 온도 영향
    if (forecast.tempMax > 30) {
      weatherImpact.wri -= 5;
      weatherImpact.pri += 3;
    } else if (forecast.tempMax < 5) {
      weatherImpact.wri -= 3;
      weatherImpact.shi -= 2;
    }

    // 강수량 영향
    if (forecast.rainfall > 20) {
      weatherImpact.wri -= 8;
      weatherImpact.pri += 5;
      weatherImpact.shi += 2;
    } else if (forecast.rainfall === 0) {
      weatherImpact.shi -= 1;
    }

    return {
      ...prediction,
      wri: Math.max(0, Math.min(100, prediction.wri + weatherImpact.wri)),
      shi: Math.max(0, Math.min(100, prediction.shi + weatherImpact.shi)),
      pri: Math.max(0, Math.min(100, prediction.pri + weatherImpact.pri)),
      mvi: Math.max(0, Math.min(100, prediction.mvi + weatherImpact.mvi)),
      psi: Math.max(0, Math.min(100, prediction.psi + weatherImpact.psi)),
      gsi: Math.max(0, Math.min(100, prediction.gsi + weatherImpact.gsi))
    };
  }

  private static applyMarketVolatility(prediction: ACIData, volatility: number): ACIData {
    const volatilityFactor = Math.min(1.2, 1 + volatility * 0.01);
    const randomFactor = (Math.random() - 0.5) * volatility * 0.1;
    
    return {
      ...prediction,
      mvi: Math.max(0, Math.min(100, prediction.mvi * volatilityFactor + randomFactor))
    };
  }

  private static stabilizePrediction(prediction: ACIData): ACIData {
    // ACI 재계산
    const aci = (
      prediction.wri * 0.25 + 
      prediction.shi * 0.20 + 
      prediction.pri * 0.20 + 
      prediction.mvi * 0.15 + 
      prediction.psi * 0.10 + 
      prediction.gsi * 0.10
    );

    return {
      ...prediction,
      aci: Math.max(0, Math.min(100, aci))
    };
  }

  private static calculateConfidence(trends: any, volatility: number, dayOffset: number): number {
    // 기본 신뢰도 (100%에서 시작)
    let confidence = 100;
    
    // 변동성에 따른 신뢰도 감소
    confidence -= volatility * 2;
    
    // 예측 기간에 따른 신뢰도 감소
    confidence -= dayOffset * 1.5;
    
    // 추세 일관성에 따른 조정
    const trendConsistency = Math.abs(trends.aci);
    if (trendConsistency > 5) confidence -= 10;
    
    return Math.max(30, Math.min(95, Math.round(confidence)));
  }

  private static analyzeRiskFactors(prediction: ACIData, trends: any) {
    return {
      weather: prediction.wri < 60 ? Math.max(0, 100 - prediction.wri) : 0,
      pest: prediction.pri < 70 ? Math.max(0, 100 - prediction.pri) : 0,
      market: Math.abs(trends.mvi) > 10 ? Math.abs(trends.mvi) : 0,
      overall: prediction.aci < 60 ? Math.max(0, 80 - prediction.aci) : 0
    };
  }

  private static generateRecommendations(prediction: ACIData, riskFactors: any): string[] {
    const recommendations: string[] = [];

    if (riskFactors.weather > 30) {
      recommendations.push('기상 악화에 대비한 보호 시설 점검이 필요합니다');
    }
    
    if (riskFactors.pest > 40) {
      recommendations.push('병해충 발생 위험이 높아 예방적 방제를 실시하세요');
    }
    
    if (riskFactors.market > 15) {
      recommendations.push('시장 가격 변동이 예상되어 출하 시기 조정을 고려하세요');
    }
    
    if (prediction.shi < 65) {
      recommendations.push('토양 건강도 개선을 위한 유기물 투입을 권장합니다');
    }
    
    if (prediction.mvi > 85) {
      recommendations.push('유리한 시장 상황으로 적극적인 출하를 고려하세요');
    }

    if (recommendations.length === 0) {
      recommendations.push('현재 농장 상태가 양호합니다. 기존 관리 방법을 유지하세요');
    }

    return recommendations;
  }

  private static generateCriticalAlerts(prediction: ACIData, riskFactors: any): string[] {
    const alerts: string[] = [];

    if (prediction.aci < 50) {
      alerts.push('🚨 ACI 점수가 위험 수준입니다. 즉시 종합적인 관리 조치가 필요합니다');
    }
    
    if (riskFactors.weather > 50) {
      alerts.push('⛈️ 극한 기상 위험이 예상됩니다. 비상 대응 계획을 준비하세요');
    }
    
    if (riskFactors.pest > 60) {
      alerts.push('🐛 병해충 대발생 위험이 높습니다. 전문가 상담 및 긴급 방제를 실시하세요');
    }

    return alerts;
  }

  private static calculateHistoricalAverage(history: ACIData[]) {
    const totals = { aci: 0, wri: 0, shi: 0, pri: 0, mvi: 0, psi: 0, gsi: 0 };
    
    history.forEach(data => {
      Object.keys(totals).forEach(key => {
        (totals as any)[key] += (data as any)[key];
      });
    });
    
    Object.keys(totals).forEach(key => {
      (totals as any)[key] = (totals as any)[key] / history.length;
    });
    
    return totals;
  }

  private static getCurrentSeason(): 'spring' | 'summer' | 'autumn' | 'winter' {
    const month = new Date().getMonth() + 1;
    if (month >= 3 && month <= 5) return 'spring';
    if (month >= 6 && month <= 8) return 'summer';
    if (month >= 9 && month <= 11) return 'autumn';
    return 'winter';
  }
}