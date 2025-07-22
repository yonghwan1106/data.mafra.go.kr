import { ACIData, ACIGrade, IndexScore, WeatherData, AgriculturalWeatherData, RDAPestInfo, SoilInfo } from '../types';

export class ACICalculator {
  static calculateWeatherRiskIndex(
    tempDeviation: number,
    rainfallDeviation: number, 
    extremeDays: number
  ): number {
    return Math.max(0, Math.min(100, 
      100 - (rainfallDeviation * 0.3 + tempDeviation * 0.3 + extremeDays * 0.4)
    ));
  }

  /**
   * 실제 기상 데이터를 기반으로 기상 위험 지수 계산
   */
  static calculateWeatherRiskFromRealData(weatherData: WeatherData): number {
    const current = weatherData.current;
    const forecast = weatherData.forecast;
    
    let riskScore = 100; // 기본값 100에서 위험 요소만큼 차감

    // 1. 현재 기온 위험도 평가 (최적 온도: 15-25℃)
    const tempRisk = this.evaluateTemperatureRisk(current.temperature);
    riskScore -= tempRisk * 0.25;

    // 2. 강수량 위험도 평가
    const rainfallRisk = this.evaluateRainfallRisk(current.rainfall);
    riskScore -= rainfallRisk * 0.3;

    // 3. 풍속 위험도 평가
    const windRisk = this.evaluateWindRisk(current.windSpeed);
    riskScore -= windRisk * 0.15;

    // 4. 습도 위험도 평가 (최적 습도: 50-70%)
    const humidityRisk = this.evaluateHumidityRisk(current.humidity);
    riskScore -= humidityRisk * 0.1;

    // 5. 예보 기반 향후 위험도 (3일간)
    const forecastRisk = this.evaluateForecastRisk(forecast.slice(0, 3));
    riskScore -= forecastRisk * 0.2;

    return Math.max(0, Math.min(100, Math.round(riskScore)));
  }

  /**
   * 농업기상 데이터를 기반으로 기상 위험 지수 계산 (더 정확한 버전)
   */
  static calculateWeatherRiskFromAgriculturalData(agriData: AgriculturalWeatherData): number {
    let riskScore = 100;

    // 기온 위험도
    const tempRisk = this.evaluateTemperatureRisk(agriData.temperature);
    riskScore -= tempRisk * 0.3;

    // 강수량 위험도
    const rainfallRisk = this.evaluateRainfallRisk(agriData.rainfall);
    riskScore -= rainfallRisk * 0.25;

    // 풍속 위험도
    const windRisk = this.evaluateWindRisk(agriData.windSpeed);
    riskScore -= windRisk * 0.15;

    // 습도 위험도
    const humidityRisk = this.evaluateHumidityRisk(agriData.humidity);
    riskScore -= humidityRisk * 0.1;

    // 일조시간 평가 (최적: 6-10시간)
    const sunshineRisk = this.evaluateSunshineRisk(agriData.sunshine);
    riskScore -= sunshineRisk * 0.1;

    // 일사량 평가 (최적: 10-20 MJ/m²)
    const solarRisk = this.evaluateSolarRadiationRisk(agriData.solarRadiation);
    riskScore -= solarRisk * 0.1;

    return Math.max(0, Math.min(100, Math.round(riskScore)));
  }

  // 개별 위험 요소 평가 함수들
  private static evaluateTemperatureRisk(temp: number): number {
    if (temp >= 15 && temp <= 25) return 0; // 최적 온도
    if (temp >= 10 && temp <= 30) return 10; // 주의 온도
    if (temp >= 5 && temp <= 35) return 25; // 경고 온도
    return 40; // 위험 온도 (5℃ 미만 또는 35℃ 초과)
  }

  private static evaluateRainfallRisk(rainfall: number): number {
    if (rainfall <= 5) return 0; // 적정 강수량
    if (rainfall <= 15) return 10; // 약간 많음
    if (rainfall <= 30) return 25; // 많음
    return 40; // 매우 많음 (30mm 초과)
  }

  private static evaluateWindRisk(windSpeed: number): number {
    if (windSpeed <= 3) return 0; // 미풍
    if (windSpeed <= 7) return 5; // 약간 바람
    if (windSpeed <= 12) return 15; // 바람
    return 30; // 강풍 (12m/s 초과)
  }

  private static evaluateHumidityRisk(humidity: number): number {
    if (humidity >= 50 && humidity <= 70) return 0; // 최적 습도
    if (humidity >= 40 && humidity <= 80) return 5; // 주의 습도
    if (humidity >= 30 && humidity <= 90) return 15; // 경고 습도
    return 25; // 위험 습도
  }

  private static evaluateSunshineRisk(sunshine: number): number {
    if (sunshine >= 6 && sunshine <= 10) return 0; // 최적 일조
    if (sunshine >= 4 && sunshine <= 12) return 5; // 양호
    if (sunshine >= 2 && sunshine <= 14) return 10; // 주의
    return 20; // 부족하거나 과다
  }

  private static evaluateSolarRadiationRisk(solarRadiation: number): number {
    if (solarRadiation >= 10 && solarRadiation <= 20) return 0; // 최적
    if (solarRadiation >= 5 && solarRadiation <= 25) return 5; // 양호
    if (solarRadiation >= 2 && solarRadiation <= 30) return 10; // 주의
    return 15; // 부족하거나 과다
  }

  private static evaluateForecastRisk(forecast: any[]): number {
    let totalRisk = 0;
    let count = 0;

    forecast.forEach(day => {
      let dayRisk = 0;
      
      // 예상 강수량
      if (day.rainfall > 20) dayRisk += 15;
      else if (day.rainfall > 10) dayRisk += 8;
      else if (day.rainfall > 5) dayRisk += 3;

      // 온도 범위
      const tempRange = day.tempMax - day.tempMin;
      if (tempRange > 15) dayRisk += 10; // 일교차 큼
      if (day.tempMin < 5 || day.tempMax > 35) dayRisk += 15; // 극한 온도

      // 위험도 등급
      if (day.risk === 'high') dayRisk += 20;
      else if (day.risk === 'medium') dayRisk += 10;

      totalRisk += dayRisk;
      count++;
    });

    return count > 0 ? totalRisk / count : 0;
  }

  static calculateSoilHealthIndex(
    phLevel: number,
    organicMatter: number,
    nutrients: number
  ): number {
    return Math.max(0, Math.min(100,
      phLevel * 0.3 + organicMatter * 0.4 + nutrients * 0.3
    ));
  }

  /**
   * 실제 토양 데이터를 기반으로 토양 건강 지수 계산
   */
  static calculateSoilHealthFromRealData(soilData: SoilInfo): number {
    let healthScore = 100;

    // pH 평가 (최적 범위: 6.0-7.0)
    const phScore = this.evaluatePhLevel(soilData.phLevel);
    healthScore -= phScore * 0.25;

    // 유기물 함량 평가 (최적: 3% 이상)
    const organicScore = this.evaluateOrganicMatter(soilData.organicMatter);
    healthScore -= organicScore * 0.25;

    // 주요 영양소 평가 (NPK)
    const nutrientScore = this.evaluateNutrients(
      soilData.nitrogen, 
      soilData.phosphorus, 
      soilData.potassium
    );
    healthScore -= nutrientScore * 0.3;

    // 토양수분 평가 (최적: 20-30%)
    const moistureScore = this.evaluateSoilMoisture(soilData.soilMoisture);
    healthScore -= moistureScore * 0.2;

    return Math.max(0, Math.min(100, Math.round(healthScore)));
  }

  static calculatePestRiskIndex(
    occurrence: number,
    severity: number
  ): number {
    return Math.max(0, Math.min(100,
      100 - (occurrence * 0.6 + severity * 0.4)
    ));
  }

  /**
   * 실제 병해충 데이터를 기반으로 병해충 위험 지수 계산
   */
  static calculatePestRiskFromRealData(pestData: RDAPestInfo[]): number {
    if (!pestData || pestData.length === 0) {
      return 90; // 병해충 정보가 없으면 비교적 안전한 것으로 판단
    }

    let totalRisk = 0;
    let highRiskCount = 0;
    let mediumRiskCount = 0;

    pestData.forEach(pest => {
      let pestRiskScore = 0;

      // 위험도 레벨별 점수
      switch (pest.riskLevel) {
        case 'high':
          pestRiskScore = 30;
          highRiskCount++;
          break;
        case 'medium':
          pestRiskScore = 15;
          mediumRiskCount++;
          break;
        case 'low':
          pestRiskScore = 5;
          break;
      }

      // 병해충 타입별 가중치
      if (pest.pestType === '병') {
        pestRiskScore *= 1.2; // 병은 더 위험
      }

      totalRisk += pestRiskScore;
    });

    // 고위험 병해충이 많을수록 추가 위험도
    const riskPenalty = highRiskCount * 10 + mediumRiskCount * 5;
    totalRisk += riskPenalty;

    // 최종 점수 계산 (100에서 차감)
    const finalScore = Math.max(0, 100 - totalRisk);
    
    return Math.round(finalScore);
  }

  // 토양 평가 함수들
  private static evaluatePhLevel(ph: number): number {
    if (ph >= 6.0 && ph <= 7.0) return 0; // 최적 pH
    if (ph >= 5.5 && ph <= 7.5) return 10; // 양호
    if (ph >= 5.0 && ph <= 8.0) return 25; // 주의
    return 40; // 위험
  }

  private static evaluateOrganicMatter(organic: number): number {
    if (organic >= 3.0) return 0; // 최적
    if (organic >= 2.5) return 10; // 양호
    if (organic >= 2.0) return 20; // 보통
    if (organic >= 1.5) return 30; // 주의
    return 40; // 부족
  }

  private static evaluateNutrients(nitrogen: number, phosphorus: number, potassium: number): number {
    let nutrientRisk = 0;

    // 질소 평가 (적정범위: 150-250 mg/kg)
    if (nitrogen < 100 || nitrogen > 300) nutrientRisk += 15;
    else if (nitrogen < 150 || nitrogen > 250) nutrientRisk += 8;

    // 인산 평가 (적정범위: 300-500 mg/kg)
    if (phosphorus < 200 || phosphorus > 600) nutrientRisk += 15;
    else if (phosphorus < 300 || phosphorus > 500) nutrientRisk += 8;

    // 칼리 평가 (적정범위: 500-800 mg/kg)
    if (potassium < 300 || potassium > 1000) nutrientRisk += 15;
    else if (potassium < 500 || potassium > 800) nutrientRisk += 8;

    return Math.min(40, nutrientRisk);
  }

  private static evaluateSoilMoisture(moisture: number): number {
    if (moisture >= 20 && moisture <= 30) return 0; // 최적
    if (moisture >= 15 && moisture <= 35) return 10; // 양호
    if (moisture >= 10 && moisture <= 40) return 20; // 주의
    return 30; // 위험 (너무 건조하거나 과습)
  }

  static calculateMarketValueIndex(
    currentPrice: number,
    averagePrice: number,
    stability: number
  ): number {
    const priceRatio = (currentPrice / averagePrice) * 50;
    const stabilityScore = stability * 50;
    return Math.max(0, Math.min(100, priceRatio + stabilityScore));
  }

  static calculatePolicySupportIndex(
    programCount: number,
    supportAmount: number,
    selectionRate: number
  ): number {
    return Math.max(0, Math.min(100,
      programCount * 30 + supportAmount * 40 + selectionRate * 30
    ));
  }

  static calculateGeographicSuitabilityIndex(
    landQuality: number,
    accessibility: number,
    infrastructure: number
  ): number {
    return Math.max(0, Math.min(100,
      landQuality * 0.4 + accessibility * 0.3 + infrastructure * 0.3
    ));
  }

  static calculateACI(
    wri: number,
    shi: number,
    pri: number,
    mvi: number,
    psi: number,
    gsi: number
  ): number {
    return Math.round(
      wri * 0.25 + shi * 0.20 + pri * 0.20 + mvi * 0.15 + psi * 0.10 + gsi * 0.10
    );
  }

  static getACIGrade(score: number): ACIGrade {
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    if (score >= 50) return 'D';
    return 'E';
  }

  static getGradeColor(grade: ACIGrade): string {
    const colors = {
      'A': '#22c55e', // green
      'B': '#84cc16', // lime
      'C': '#eab308', // yellow
      'D': '#f97316', // orange
      'E': '#ef4444'  // red
    };
    return colors[grade];
  }

  static getGradeLabel(grade: ACIGrade): string {
    const labels = {
      'A': '매우좋음',
      'B': '좋음',
      'C': '보통',
      'D': '주의',
      'E': '위험'
    };
    return labels[grade];
  }

  static getIndexScores(data: ACIData): IndexScore[] {
    return [
      {
        score: data.wri,
        grade: this.getACIGrade(data.wri),
        name: '기상위험',
        icon: '🌤️',
        color: this.getGradeColor(this.getACIGrade(data.wri))
      },
      {
        score: data.shi,
        grade: this.getACIGrade(data.shi),
        name: '토양건강',
        icon: '🌱',
        color: this.getGradeColor(this.getACIGrade(data.shi))
      },
      {
        score: data.pri,
        grade: this.getACIGrade(data.pri),
        name: '병해충',
        icon: '🐛',
        color: this.getGradeColor(this.getACIGrade(data.pri))
      },
      {
        score: data.mvi,
        grade: this.getACIGrade(data.mvi),
        name: '시장가치',
        icon: '💰',
        color: this.getGradeColor(this.getACIGrade(data.mvi))
      },
      {
        score: data.psi,
        grade: this.getACIGrade(data.psi),
        name: '정책지원',
        icon: '📋',
        color: this.getGradeColor(this.getACIGrade(data.psi))
      },
      {
        score: data.gsi,
        grade: this.getACIGrade(data.gsi),
        name: '지리적합',
        icon: '📍',
        color: this.getGradeColor(this.getACIGrade(data.gsi))
      }
    ];
  }

  static generateFuturePrediction(historicalData: ACIData[], days: number = 30): ACIData[] {
    if (historicalData.length < 5) return [];

    const predictions: ACIData[] = [];
    const lastData = historicalData[historicalData.length - 1];
    const trend = this.calculateTrend(historicalData);

    for (let i = 1; i <= days; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      
      const noise = () => (Math.random() - 0.5) * 4; // ±2 points random variation
      
      const predicted: ACIData = {
        date: date.toISOString().split('T')[0],
        aci: Math.max(0, Math.min(100, lastData.aci + (trend.aci * i) + noise())),
        wri: Math.max(0, Math.min(100, lastData.wri + (trend.wri * i) + noise())),
        shi: Math.max(0, Math.min(100, lastData.shi + (trend.shi * i) + noise())),
        pri: Math.max(0, Math.min(100, lastData.pri + (trend.pri * i) + noise())),
        mvi: Math.max(0, Math.min(100, lastData.mvi + (trend.mvi * i) + noise())),
        psi: Math.max(0, Math.min(100, lastData.psi + (trend.psi * i) + noise())),
        gsi: Math.max(0, Math.min(100, lastData.gsi + (trend.gsi * i) + noise()))
      };

      // Recalculate ACI based on component scores
      predicted.aci = Math.round(this.calculateACI(
        predicted.wri, predicted.shi, predicted.pri,
        predicted.mvi, predicted.psi, predicted.gsi
      ));

      predictions.push(predicted);
    }

    return predictions;
  }

  private static calculateTrend(data: ACIData[]) {
    const recentData = data.slice(-7); // Last 7 days
    if (recentData.length < 2) return { aci: 0, wri: 0, shi: 0, pri: 0, mvi: 0, psi: 0, gsi: 0 };

    const first = recentData[0];
    const last = recentData[recentData.length - 1];
    const days = recentData.length - 1;

    return {
      aci: (last.aci - first.aci) / days,
      wri: (last.wri - first.wri) / days,
      shi: (last.shi - first.shi) / days,
      pri: (last.pri - first.pri) / days,
      mvi: (last.mvi - first.mvi) / days,
      psi: (last.psi - first.psi) / days,
      gsi: (last.gsi - first.gsi) / days
    };
  }
}