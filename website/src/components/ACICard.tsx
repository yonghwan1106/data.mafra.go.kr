import { Farm, ACIGrade } from '../types';
import { ACICalculator } from '../utils/aci-calculator';

interface ACICardProps {
  score: number;
  grade: ACIGrade;
  gradeLabel: string;
  farm: Farm;
}

const ACICard = ({ score, grade, gradeLabel, farm }: ACICardProps) => {
  const gradeColor = ACICalculator.getGradeColor(grade);
  
  const getGradeIcon = (grade: ACIGrade) => {
    const icons = {
      'A': '🟢',
      'B': '🟡', 
      'C': '🟠',
      'D': '🔴',
      'E': '⚫'
    };
    return icons[grade];
  };

  const getScoreDescription = (score: number) => {
    if (score >= 80) return '농업 환경이 매우 우수합니다';
    if (score >= 70) return '농업 환경이 좋은 상태입니다';
    if (score >= 60) return '농업 환경이 보통 수준입니다';
    if (score >= 50) return '농업 환경에 주의가 필요합니다';
    return '농업 환경에 위험 요소가 있습니다';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="text-center">
        {/* Header */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">농업 종합 지수</h3>
          <p className="text-sm text-gray-600">Agricultural Composite Index</p>
        </div>

        {/* Score Circle */}
        <div className="relative mb-6">
          <div className="mx-auto w-32 h-32 rounded-full border-8 flex items-center justify-center"
               style={{ borderColor: gradeColor, backgroundColor: gradeColor + '10' }}>
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ color: gradeColor }}>
                {score}
              </div>
              <div className="text-sm text-gray-600">점</div>
            </div>
          </div>
          
          {/* Grade Badge */}
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
            <div className="bg-white px-3 py-1 rounded-full border-2 flex items-center space-x-2"
                 style={{ borderColor: gradeColor }}>
              <span className="text-lg">{getGradeIcon(grade)}</span>
              <span className="font-semibold" style={{ color: gradeColor }}>
                {grade}등급
              </span>
            </div>
          </div>
        </div>

        {/* Grade Label */}
        <div className="mb-4">
          <div className="text-xl font-bold text-gray-900 mb-1">{gradeLabel}</div>
          <p className="text-sm text-gray-600">{getScoreDescription(score)}</p>
        </div>

        {/* Status Indicators */}
        <div className="space-y-3 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">평가일시</span>
            <span className="text-sm font-medium text-gray-900">
              {new Date(farm.lastUpdated).toLocaleDateString('ko-KR')}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">위험도</span>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                grade === 'A' ? 'bg-green-400' :
                grade === 'B' ? 'bg-yellow-400' :
                grade === 'C' ? 'bg-orange-400' :
                grade === 'D' ? 'bg-red-400' : 'bg-gray-400'
              }`}></div>
              <span className="text-sm font-medium">{gradeLabel}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">다음 평가</span>
            <span className="text-sm font-medium text-primary-600">내일 예정</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6">
          <button className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-md transition-colors">
            상세 분석 보기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ACICard;