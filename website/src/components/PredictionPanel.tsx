import { ACIData } from '../types';
import { ACICalculator } from '../utils/aci-calculator';

interface PredictionPanelProps {
  history: ACIData[];
}

const PredictionPanel = ({ history }: PredictionPanelProps) => {
  if (history.length < 5) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">30일 예측</h3>
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">🔮</div>
          <p>예측에 필요한 데이터가 부족합니다</p>
          <p className="text-sm mt-1">최소 5일간의 데이터가 필요합니다</p>
        </div>
      </div>
    );
  }

  const predictions = ACICalculator.generateFuturePrediction(history, 7);
  const currentACI = history[history.length - 1];
  const avgPredicted = predictions.reduce((sum, p) => sum + p.aci, 0) / predictions.length;
  const trend = avgPredicted - currentACI.aci;
  const trendIcon = trend > 0 ? '📈' : trend < 0 ? '📉' : '➡️';
  const trendColor = trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-gray-600';

  const getRiskFactors = () => {
    const factors = [];
    
    if (currentACI.wri < 70) {
      factors.push({
        type: 'weather',
        message: '기상 조건 악화 가능성',
        icon: '🌧️',
        severity: 'medium'
      });
    }
    
    if (currentACI.pri < 60) {
      factors.push({
        type: 'pest',
        message: '병해충 발생 위험 증가',
        icon: '🐛',
        severity: 'high'
      });
    }
    
    if (currentACI.shi < 65) {
      factors.push({
        type: 'soil',
        message: '토양 건강도 저하 우려',
        icon: '🌱',
        severity: 'medium'
      });
    }

    return factors;
  };

  const getOpportunities = () => {
    const opportunities = [];
    
    if (currentACI.mvi > 80) {
      opportunities.push({
        type: 'market',
        message: '시장 가격 상승 지속 예상',
        icon: '💰',
        impact: 'high'
      });
    }
    
    if (currentACI.psi > 70) {
      opportunities.push({
        type: 'policy',
        message: '정책 지원 활용 기회',
        icon: '📋',
        impact: 'medium'
      });
    }
    
    if (currentACI.gsi > 85) {
      opportunities.push({
        type: 'location',
        message: '지리적 이점 극대화 가능',
        icon: '📍',
        impact: 'medium'
      });
    }

    return opportunities;
  };

  const riskFactors = getRiskFactors();
  const opportunities = getOpportunities();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">7일 예측 분석</h3>
            <p className="text-sm text-gray-600 mt-1">AI 기반 농업 환경 예측 및 리스크 분석</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{trendIcon}</span>
            <div className="text-right">
              <div className={`text-lg font-bold ${trendColor}`}>
                {trend > 0 ? '+' : ''}{trend.toFixed(1)}점
              </div>
              <div className="text-xs text-gray-500">예상 변동</div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Prediction Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {avgPredicted.toFixed(1)}점
            </div>
            <div className="text-sm text-gray-600">7일 평균 예상</div>
            <div className="text-xs text-blue-600 mt-1">
              {ACICalculator.getGradeLabel(ACICalculator.getACIGrade(avgPredicted))}
            </div>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-700 mb-1">
              {Math.max(...predictions.map(p => p.aci)).toFixed(1)}
            </div>
            <div className="text-sm text-gray-600">최고 예상 점수</div>
            <div className="text-xs text-green-600 mt-1">Peak 시점</div>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-700 mb-1">
              {Math.min(...predictions.map(p => p.aci)).toFixed(1)}
            </div>
            <div className="text-sm text-gray-600">최저 예상 점수</div>
            <div className="text-xs text-orange-600 mt-1">주의 시점</div>
          </div>
        </div>

        {/* Daily Predictions */}
        <div className="mb-8">
          <h4 className="text-md font-semibold text-gray-900 mb-4">일별 예측</h4>
          <div className="space-y-3">
            {predictions.slice(0, 7).map((prediction, index) => {
              const grade = ACICalculator.getACIGrade(prediction.aci);
              const gradeColor = ACICalculator.getGradeColor(grade);
              const dayName = ['내일', '모레', '3일 후', '4일 후', '5일 후', '6일 후', '7일 후'][index];
              
              return (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="text-sm font-medium text-gray-700 w-16">
                      {dayName}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(prediction.date).toLocaleDateString('ko-KR')}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-lg font-bold" style={{ color: gradeColor }}>
                        {prediction.aci}점
                      </div>
                      <div className="text-xs text-gray-500">{grade}등급</div>
                    </div>
                    
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${prediction.aci}%`,
                          backgroundColor: gradeColor 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Risk Factors */}
        {riskFactors.length > 0 && (
          <div className="mb-6">
            <h4 className="text-md font-semibold text-gray-900 mb-3">⚠️ 주의 사항</h4>
            <div className="space-y-2">
              {riskFactors.map((risk, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <span className="text-lg">{risk.icon}</span>
                  <div className="flex-1">
                    <span className="text-sm font-medium text-red-800">{risk.message}</span>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    risk.severity === 'high' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'
                  }`}>
                    {risk.severity === 'high' ? '높음' : '보통'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Opportunities */}
        {opportunities.length > 0 && (
          <div className="mb-6">
            <h4 className="text-md font-semibold text-gray-900 mb-3">✨ 기회 요소</h4>
            <div className="space-y-2">
              {opportunities.map((opp, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <span className="text-lg">{opp.icon}</span>
                  <div className="flex-1">
                    <span className="text-sm font-medium text-green-800">{opp.message}</span>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    opp.impact === 'high' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {opp.impact === 'high' ? '고효과' : '보통'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Recommendations */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="text-md font-semibold text-blue-900 mb-2">💡 추천 액션 플랜</h4>
          <div className="space-y-1 text-sm text-blue-800">
            {trend > 0 ? (
              <>
                <div>• 상승세를 유지하기 위한 현재 관리 방법을 지속하세요</div>
                <div>• 시장 타이밍을 고려한 출하 계획을 수립하세요</div>
              </>
            ) : (
              <>
                <div>• 하락 요인을 파악하고 집중적인 관리가 필요합니다</div>
                <div>• 위험 지수가 낮은 부분의 개선 방안을 우선 실행하세요</div>
              </>
            )}
            <div>• 기상 변화에 대비한 사전 준비를 권장합니다</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictionPanel;