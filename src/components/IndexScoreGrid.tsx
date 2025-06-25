import { IndexScore } from '../types';
import { ACICalculator } from '../utils/aci-calculator';

interface IndexScoreGridProps {
  scores: IndexScore[];
}

const IndexScoreGrid = ({ scores }: IndexScoreGridProps) => {
  const getProgressBarColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 70) return 'bg-yellow-500';
    if (score >= 60) return 'bg-orange-500';
    if (score >= 50) return 'bg-red-500';
    return 'bg-gray-500';
  };

  const getScoreStatus = (score: number) => {
    if (score >= 80) return '우수';
    if (score >= 70) return '양호';
    if (score >= 60) return '보통';
    if (score >= 50) return '주의';
    return '위험';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {scores.map((score, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{score.icon}</span>
              <div>
                <h3 className="font-semibold text-gray-900">{score.name}</h3>
                <p className="text-sm text-gray-600">{getScoreStatus(score.score)}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold" style={{ color: score.color }}>
                {score.score}
              </div>
              <div className="text-sm text-gray-600">점</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>0</span>
              <span>50</span>
              <span>100</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className={`h-3 rounded-full transition-all duration-500 ${getProgressBarColor(score.score)}`}
                style={{ width: `${score.score}%` }}
              ></div>
            </div>
          </div>

          {/* Grade Badge */}
          <div className="flex justify-center">
            <div 
              className="px-3 py-1 rounded-full text-white text-sm font-medium"
              style={{ backgroundColor: score.color }}
            >
              {score.grade}등급 - {ACICalculator.getGradeLabel(score.grade)}
            </div>
          </div>

          {/* Detail Link */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <button className="w-full text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors">
              세부 분석 →
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default IndexScoreGrid;