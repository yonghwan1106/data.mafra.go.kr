import { IndexScore } from '../types';

interface ComparisonTableProps {
  scores: IndexScore[];
}

const ComparisonTable = ({ scores }: ComparisonTableProps) => {
  const getScoreDescription = (name: string, score: number) => {
    const descriptions: Record<string, Record<string, string>> = {
      '기상위험': {
        high: '기상 조건이 매우 안정적입니다. 농작물 생육에 최적의 환경을 제공합니다.',
        medium: '기상 조건이 양호합니다. 일반적인 농업 활동에 적합합니다.',
        low: '기상 위험이 있습니다. 극한 기상 현상에 대비가 필요합니다.'
      },
      '토양건강': {
        high: '토양 상태가 우수합니다. pH, 유기물, 영양분이 모두 적정 수준입니다.',
        medium: '토양 상태가 양호합니다. 일부 영양분 보충을 고려하세요.',
        low: '토양 개선이 필요합니다. 유기물 투입과 토양 개량을 권장합니다.'
      },
      '병해충': {
        high: '병해충 발생 위험이 낮습니다. 현재 방제 상태를 유지하세요.',
        medium: '병해충 발생 가능성이 있습니다. 예방적 방제를 고려하세요.',
        low: '병해충 위험이 높습니다. 즉시 방제 조치가 필요합니다.'
      },
      '시장가치': {
        high: '시장 가격이 유리합니다. 출하 타이밍을 검토하세요.',
        medium: '시장 가격이 평균 수준입니다. 품질 향상에 집중하세요.',
        low: '시장 가격이 불리합니다. 저장이나 가공을 고려하세요.'
      },
      '정책지원': {
        high: '다양한 정책 지원을 받을 수 있습니다. 지원 사업 신청을 검토하세요.',
        medium: '일부 정책 지원이 가능합니다. 해당 사업 요건을 확인하세요.',
        low: '현재 해당되는 정책 지원이 제한적입니다.'
      },
      '지리적합': {
        high: '지리적 조건이 매우 우수합니다. 농업 인프라와 접근성이 좋습니다.',
        medium: '지리적 조건이 양호합니다. 농업 활동에 적합한 환경입니다.',
        low: '지리적 여건 개선을 고려하세요. 접근성이나 인프라 보완이 필요합니다.'
      }
    };

    const level = score >= 80 ? 'high' : score >= 60 ? 'medium' : 'low';
    return descriptions[name]?.[level] || '분석 정보를 확인할 수 없습니다.';
  };

  const getRecommendation = (name: string, score: number) => {
    const recommendations: Record<string, Record<string, string[]>> = {
      '기상위험': {
        high: ['현재 기상 관리 방법 유지', '예보 정보 지속 모니터링'],
        medium: ['기상 예보 주의 깊게 관찰', '피복 자재 준비'],
        low: ['비닐하우스 보강', '배수로 정비', '작물보호 시설 점검']
      },
      '토양건강': {
        high: ['정기적인 토양 검정', '현재 관리 방법 유지'],
        medium: ['유기물 투입량 증가', '토양 검정 주기 단축'],
        low: ['토양 개량제 투입', 'pH 조정', '유기물 대량 투입']
      },
      '병해충': {
        high: ['예방적 관찰 지속', '천적 곤충 활용'],
        medium: ['정기적인 포장 관찰', '예방적 방제 실시'],
        low: ['즉시 방제 실시', '전문가 상담', '저항성 품종 검토']
      },
      '시장가치': {
        high: ['출하 시기 최적화', '직거래 확대'],
        medium: ['품질 향상 집중', '브랜드화 검토'],
        low: ['저장 시설 활용', '가공 사업 검토', '계약재배 추진']
      },
      '정책지원': {
        high: ['지원 사업 적극 신청', '컨설팅 서비스 활용'],
        medium: ['신규 지원 사업 모니터링', '교육 프로그램 참여'],
        low: ['지역 농업기술센터 상담', '협동조합 가입 검토']
      },
      '지리적합': {
        high: ['현재 입지 조건 최대 활용', '주변 농가와 협력'],
        medium: ['유통 채널 다변화', '접근성 개선 방안 모색'],
        low: ['물류비 절감 방안 검토', '공동 선별장 활용']
      }
    };

    const level = score >= 80 ? 'high' : score >= 60 ? 'medium' : 'low';
    return recommendations[name]?.[level] || ['전문가 상담을 권장합니다.'];
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">세부 지수 분석 및 개선 방안</h3>
        <p className="text-sm text-gray-600 mt-1">각 지수별 현황과 맞춤형 개선 방안을 제공합니다</p>
      </div>
      
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                지수
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                점수/등급
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                현재 상태
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                개선 방안
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {scores.map((score, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{score.icon}</span>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{score.name}</div>
                      <div className="text-xs text-gray-500">
                        {score.name === '기상위험' ? 'Weather Risk' :
                         score.name === '토양건강' ? 'Soil Health' :
                         score.name === '병해충' ? 'Pest Risk' :
                         score.name === '시장가치' ? 'Market Value' :
                         score.name === '정책지원' ? 'Policy Support' :
                         'Geographic Suitability'}
                      </div>
                    </div>
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl font-bold" style={{ color: score.color }}>
                      {score.score}
                    </div>
                    <div>
                      <div 
                        className="px-2 py-1 text-xs font-medium rounded-full text-white"
                        style={{ backgroundColor: score.color }}
                      >
                        {score.grade}등급
                      </div>
                    </div>
                  </div>
                </td>
                
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 max-w-xs">
                    {getScoreDescription(score.name, score.score)}
                  </div>
                </td>
                
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    {getRecommendation(score.name, score.score).map((rec, recIndex) => (
                      <div key={recIndex} className="flex items-start space-x-2">
                        <span className="text-primary-500 text-xs mt-1">•</span>
                        <span className="text-sm text-gray-700">{rec}</span>
                      </div>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4 p-4">
        {scores.map((score, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{score.icon}</span>
                <div>
                  <div className="text-sm font-medium text-gray-900">{score.name}</div>
                  <div className="text-xs text-gray-500">
                    {score.name === '기상위험' ? 'Weather Risk' :
                     score.name === '토양건강' ? 'Soil Health' :
                     score.name === '병해충' ? 'Pest Risk' :
                     score.name === '시장가치' ? 'Market Value' :
                     score.name === '정책지원' ? 'Policy Support' :
                     'Geographic Suitability'}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold" style={{ color: score.color }}>
                  {score.score}
                </div>
                <div 
                  className="px-2 py-1 text-xs font-medium rounded-full text-white inline-block"
                  style={{ backgroundColor: score.color }}
                >
                  {score.grade}등급
                </div>
              </div>
            </div>

            {/* Current Status */}
            <div className="mb-3">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                현재 상태
              </div>
              <div className="text-sm text-gray-900">
                {getScoreDescription(score.name, score.score)}
              </div>
            </div>

            {/* Recommendations */}
            <div>
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                개선 방안
              </div>
              <div className="space-y-1">
                {getRecommendation(score.name, score.score).map((rec, recIndex) => (
                  <div key={recIndex} className="flex items-start space-x-2">
                    <span className="text-primary-500 text-xs mt-1">•</span>
                    <span className="text-sm text-gray-700">{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="px-4 sm:px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <div className="text-sm text-gray-600">
            💡 <strong>팁:</strong> 점수가 낮은 지수부터 우선적으로 개선하시면 전체 ACI 향상에 효과적입니다.
          </div>
          <button className="text-sm text-primary-600 hover:text-primary-700 font-medium text-left sm:text-right">
            상세 가이드 보기 →
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComparisonTable;