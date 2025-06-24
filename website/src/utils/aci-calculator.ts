import { ACIData, ACIGrade, IndexScore } from '../types';

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

  static calculateSoilHealthIndex(
    phLevel: number,
    organicMatter: number,
    nutrients: number
  ): number {
    return Math.max(0, Math.min(100,
      phLevel * 0.3 + organicMatter * 0.4 + nutrients * 0.3
    ));
  }

  static calculatePestRiskIndex(
    occurrence: number,
    severity: number
  ): number {
    return Math.max(0, Math.min(100,
      100 - (occurrence * 0.6 + severity * 0.4)
    ));
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