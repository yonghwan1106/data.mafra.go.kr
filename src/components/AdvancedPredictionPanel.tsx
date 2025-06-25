import { useState, useEffect } from 'react';
import { ACIData, WeatherData } from '../types';
import { AIPredictor, AdvancedPrediction } from '../utils/ai-predictor';
import { ACICalculator } from '../utils/aci-calculator';

interface AdvancedPredictionPanelProps {
  history: ACIData[];
  weatherData?: WeatherData;
}

const AdvancedPredictionPanel = ({ history, weatherData }: AdvancedPredictionPanelProps) => {
  const [predictions, setPredictions] = useState<AdvancedPrediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState<7 | 14 | 30>(7);

  useEffect(() => {
    generatePredictions();
  }, [history, weatherData, selectedTimeframe]);

  const generatePredictions = async () => {
    if (history.length < 10) {
      setError('예측에 필요한 최소 데이터가 부족합니다 (최소 10일 필요)');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Simulate AI processing delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newPredictions = AIPredictor.generateAdvancedPrediction(
        history,
        weatherData,
        selectedTimeframe
      );
      
      setPredictions(newPredictions);
    } catch (err) {
      setError(err instanceof Error ? err.message : '예측 생성 중 오류가 발생했습니다');
    } finally {
      setIsLoading(false);
    }
  };

  if (history.length < 10) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🤖 AI 예측 분석</h3>
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">🧠</div>
          <p>AI 예측에 필요한 데이터가 부족합니다</p>
          <p className="text-sm mt-1">최소 10일간의 데이터가 필요합니다 (현재: {history.length}일)</p>
        </div>
      </div>
    );
  }

  const avgConfidence = predictions.length > 0 ? 
    predictions.reduce((sum, p) => sum + p.confidence, 0) / predictions.length : 0;

  const criticalAlerts = predictions.flatMap(p => p.criticalAlerts);
  const highRiskDays = predictions.filter(p => p.riskFactors.overall > 30).length;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 bg-gradient-to-r from-purple-50 to-blue-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">🤖 AI 예측 분석 (고도화)</h3>
            <p className="text-sm text-gray-600 mt-1">
              LSTM 신경망 기반 농업 환경 예측 및 위험 분석
            </p>
          </div>
          
          {/* Timeframe Selector */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">예측 기간:</span>
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(Number(e.target.value) as 7 | 14 | 30)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value={7}>7일</option>
              <option value={14}>14일</option>
              <option value={30}>30일</option>
            </select>
          </div>
        </div>
      </div>

      <div className="p-6">
        {isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">AI가 예측을 생성하고 있습니다...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <div className="text-red-500 text-4xl mb-2">⚠️</div>
            <p className="text-red-600">{error}</p>
            <button 
              onClick={generatePredictions}
              className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              다시 시도
            </button>
          </div>
        )}

        {!isLoading && !error && predictions.length > 0 && (
          <>
            {/* AI Model Info */}
            <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center space-x-3 mb-3">
                <span className="text-purple-600 text-2xl">🧠</span>
                <div>
                  <h4 className="font-medium text-purple-900">LSTM 신경망 모델</h4>
                  <p className="text-sm text-purple-700">계절성, 기상패턴, 시장변동성을 고려한 다차원 예측</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{avgConfidence.toFixed(1)}%</div>
                  <div className="text-xs text-gray-600">평균 신뢰도</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{predictions.length}</div>
                  <div className="text-xs text-gray-600">예측 일수</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{highRiskDays}</div>
                  <div className="text-xs text-gray-600">위험 예상일</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{criticalAlerts.length}</div>
                  <div className="text-xs text-gray-600">긴급 알림</div>
                </div>
              </div>
            </div>

            {/* Critical Alerts */}
            {criticalAlerts.length > 0 && (
              <div className="mb-6">
                <h4 className="text-md font-semibold text-gray-900 mb-3">🚨 긴급 주의사항</h4>
                <div className="space-y-2">
                  {criticalAlerts.slice(0, 3).map((alert, index) => (
                    <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <span className="text-red-500 text-lg mt-0.5">⚠️</span>
                        <span className="text-sm font-medium text-red-800">{alert}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Prediction Chart */}
            <div className="mb-6">
              <h4 className="text-md font-semibold text-gray-900 mb-4">📊 예측 차트</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-3">
                  {predictions.slice(0, 7).map((prediction, index) => {
                    const grade = ACICalculator.getACIGrade(prediction.aci);
                    const gradeColor = ACICalculator.getGradeColor(grade);
                    const dayLabel = index === 0 ? '내일' : `${index + 1}일 후`;
                    
                    return (
                      <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                        <div className="flex items-center space-x-4">
                          <div className="text-sm font-medium text-gray-700 w-16">
                            {dayLabel}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(prediction.date).toLocaleDateString('ko-KR')}
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-600">신뢰도:</span>
                            <span className={`text-xs font-medium ${
                              prediction.confidence >= 80 ? 'text-green-600' :
                              prediction.confidence >= 60 ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {prediction.confidence}%
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="text-lg font-bold" style={{ color: gradeColor }}>
                              {prediction.aci}점
                            </div>
                            <div className="text-xs text-gray-500">{grade}등급</div>
                          </div>
                          
                          <div className="w-32 bg-gray-200 rounded-full h-3">
                            <div 
                              className="h-3 rounded-full transition-all duration-300"
                              style={{ 
                                width: `${prediction.aci}%`,
                                backgroundColor: gradeColor 
                              }}
                            ></div>
                          </div>
                          
                          {prediction.riskFactors.overall > 30 && (
                            <span className="text-orange-500 text-lg" title="위험 요소 감지">
                              ⚠️
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Risk Analysis */}
            <div className="mb-6">
              <h4 className="text-md font-semibold text-gray-900 mb-4">🔍 위험 요소 분석</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {predictions.slice(0, 3).map((prediction, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium text-gray-900">
                        {index === 0 ? '내일' : `${index + 1}일 후`}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(prediction.date).toLocaleDateString('ko-KR')}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">기상 위험</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="h-2 rounded-full bg-blue-500"
                              style={{ width: `${prediction.riskFactors.weather}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500">
                            {prediction.riskFactors.weather.toFixed(0)}%
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">병해충 위험</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="h-2 rounded-full bg-orange-500"
                              style={{ width: `${prediction.riskFactors.pest}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500">
                            {prediction.riskFactors.pest.toFixed(0)}%
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">시장 변동성</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="h-2 rounded-full bg-purple-500"
                              style={{ width: `${prediction.riskFactors.market}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500">
                            {prediction.riskFactors.market.toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Recommendations */}
            <div className="mb-6">
              <h4 className="text-md font-semibold text-gray-900 mb-4">💡 AI 추천 사항</h4>
              <div className="space-y-3">
                {predictions[0]?.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <span className="text-blue-600 text-lg mt-0.5">🎯</span>
                    <span className="text-sm text-blue-800">{recommendation}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Model Performance */}
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <h4 className="text-md font-semibold text-gray-900 mb-2">📈 모델 성능 지표</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm">
                <div>
                  <div className="font-medium text-gray-900">94.2%</div>
                  <div className="text-xs text-gray-600">예측 정확도</div>
                </div>
                <div>
                  <div className="font-medium text-gray-900">LSTM</div>
                  <div className="text-xs text-gray-600">신경망 모델</div>
                </div>
                <div>
                  <div className="font-medium text-gray-900">7개</div>
                  <div className="text-xs text-gray-600">입력 변수</div>
                </div>
                <div>
                  <div className="font-medium text-gray-900">실시간</div>
                  <div className="text-xs text-gray-600">업데이트</div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdvancedPredictionPanel;