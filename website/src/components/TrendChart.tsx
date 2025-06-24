import { useEffect, useRef } from 'react';
import { useAppStore } from '../stores/useAppStore';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

// Register Chart.js components
Chart.register(...registerables);

interface TrendChartProps {
  farmId: string;
}

const TrendChart = ({ farmId }: TrendChartProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);
  const { getFarmHistory } = useAppStore();

  useEffect(() => {
    if (!canvasRef.current) return;

    const history = getFarmHistory(farmId);
    if (history.length === 0) return;

    // Destroy existing chart
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // Prepare data
    const labels = history.slice(-7).map(item => 
      new Date(item.date).toLocaleDateString('ko-KR', { 
        month: 'short', 
        day: 'numeric' 
      })
    );

    const aciData = history.slice(-7).map(item => item.aci);

    const config: ChartConfiguration = {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'ACI 점수',
            data: aciData,
            borderColor: '#0ea5e9',
            backgroundColor: 'rgba(14, 165, 233, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#0ea5e9',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: 6,
            pointHoverRadius: 8,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#ffffff',
            bodyColor: '#ffffff',
            borderColor: '#0ea5e9',
            borderWidth: 1,
            cornerRadius: 8,
            displayColors: false,
            callbacks: {
              title: function(context) {
                return `${context[0].label}`;
              },
              label: function(context) {
                return `ACI: ${context.parsed.y}점`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            },
            border: {
              display: false
            },
            ticks: {
              color: '#6b7280',
              font: {
                size: 12
              }
            }
          },
          y: {
            min: 0,
            max: 100,
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            },
            border: {
              display: false
            },
            ticks: {
              color: '#6b7280',
              font: {
                size: 12
              },
              callback: function(tickValue) {
                return `${tickValue}점`;
              }
            }
          }
        },
        interaction: {
          intersect: false,
          mode: 'index'
        },
        elements: {
          point: {
            hoverBackgroundColor: '#0ea5e9'
          }
        }
      }
    };

    chartRef.current = new Chart(ctx, config);

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [farmId, getFarmHistory]);

  const history = getFarmHistory(farmId);
  
  if (history.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">30일 추이</h3>
        <div className="h-64 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <div className="text-4xl mb-2">📈</div>
            <p>데이터가 부족합니다</p>
          </div>
        </div>
      </div>
    );
  }

  const latestData = history[history.length - 1];
  const previousData = history[history.length - 2];
  const trend = previousData ? latestData.aci - previousData.aci : 0;
  const trendIcon = trend > 0 ? '📈' : trend < 0 ? '📉' : '➡️';
  const trendColor = trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-gray-600';
  const trendText = trend > 0 ? '상승' : trend < 0 ? '하락' : '보합';

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">30일 추이</h3>
        <div className="flex items-center space-x-2">
          <span className="text-lg">{trendIcon}</span>
          <span className={`text-sm font-medium ${trendColor}`}>
            {trendText}
          </span>
        </div>
      </div>

      {/* Chart Container */}
      <div className="h-64 mb-4">
        <canvas ref={canvasRef}></canvas>
      </div>

      {/* Statistics */}
      <div className="pt-4 border-t border-gray-100">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-sm text-gray-600">현재</div>
            <div className="text-lg font-bold text-primary-600">
              {latestData.aci}점
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600">전일 대비</div>
            <div className={`text-lg font-bold ${trendColor}`}>
              {trend > 0 ? '+' : ''}{trend.toFixed(1)}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600">평균</div>
            <div className="text-lg font-bold text-gray-900">
              {(history.slice(-7).reduce((sum, item) => sum + item.aci, 0) / Math.min(7, history.length)).toFixed(1)}점
            </div>
          </div>
        </div>
      </div>

      {/* Prediction Note */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center space-x-2">
          <span className="text-blue-600">🔮</span>
          <div className="text-sm">
            <span className="font-medium text-blue-900">예측: </span>
            <span className="text-blue-700">
              {trend >= 0 ? '향후 3일간 상승 추세 예상' : '향후 3일간 하락세 주의'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendChart;