import { useEffect, useRef } from 'react';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { ACIData } from '../types';

Chart.register(...registerables);

interface DetailedChartProps {
  farmId: string;
  history: ACIData[];
}

const DetailedChart = ({ farmId, history }: DetailedChartProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current || history.length === 0) return;

    // Destroy existing chart
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // Prepare data (last 14 days)
    const recentHistory = history.slice(-14);
    const labels = recentHistory.map(item => 
      new Date(item.date).toLocaleDateString('ko-KR', { 
        month: 'short', 
        day: 'numeric' 
      })
    );

    const config: ChartConfiguration = {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'ACI 총점',
            data: recentHistory.map(item => item.aci),
            borderColor: '#0ea5e9',
            backgroundColor: 'rgba(14, 165, 233, 0.1)',
            borderWidth: 3,
            fill: false,
            tension: 0.4,
            pointRadius: 4,
          },
          {
            label: '기상위험',
            data: recentHistory.map(item => item.wri),
            borderColor: '#06b6d4',
            backgroundColor: 'rgba(6, 182, 212, 0.1)',
            borderWidth: 2,
            fill: false,
            tension: 0.4,
            pointRadius: 3,
          },
          {
            label: '토양건강',
            data: recentHistory.map(item => item.shi),
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            borderWidth: 2,
            fill: false,
            tension: 0.4,
            pointRadius: 3,
          },
          {
            label: '병해충',
            data: recentHistory.map(item => item.pri),
            borderColor: '#f59e0b',
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            borderWidth: 2,
            fill: false,
            tension: 0.4,
            pointRadius: 3,
          },
          {
            label: '시장가치',
            data: recentHistory.map(item => item.mvi),
            borderColor: '#8b5cf6',
            backgroundColor: 'rgba(139, 92, 246, 0.1)',
            borderWidth: 2,
            fill: false,
            tension: 0.4,
            pointRadius: 3,
          },
          {
            label: '정책지원',
            data: recentHistory.map(item => item.psi),
            borderColor: '#ef4444',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            borderWidth: 2,
            fill: false,
            tension: 0.4,
            pointRadius: 3,
          },
          {
            label: '지리적합',
            data: recentHistory.map(item => item.gsi),
            borderColor: '#84cc16',
            backgroundColor: 'rgba(132, 204, 22, 0.1)',
            borderWidth: 2,
            fill: false,
            tension: 0.4,
            pointRadius: 3,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: '세부 지수별 추이 분석 (최근 14일)',
            font: {
              size: 16,
              weight: 'bold'
            },
            color: '#374151'
          },
          legend: {
            position: 'top',
            labels: {
              usePointStyle: true,
              pointStyle: 'line',
              font: {
                size: 12
              }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#ffffff',
            bodyColor: '#ffffff',
            borderColor: '#0ea5e9',
            borderWidth: 1,
            cornerRadius: 8,
            displayColors: true,
            callbacks: {
              title: function(context) {
                return `${context[0].label}`;
              },
              label: function(context) {
                return `${context.dataset.label}: ${context.parsed.y}점`;
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
                size: 11
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
                size: 11
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
        }
      }
    };

    chartRef.current = new Chart(ctx, config);

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [farmId, history]);

  if (history.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">세부 지수 추이</h3>
        <div className="h-96 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <div className="text-4xl mb-2">📊</div>
            <p>분석할 데이터가 부족합니다</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="h-96 mb-4">
        <canvas ref={canvasRef}></canvas>
      </div>
      
      {/* Chart Controls */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="text-sm text-gray-600">
          최근 {Math.min(14, history.length)}일간 데이터 표시
        </div>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600">ACI 총점</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">세부 지수</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedChart;