import { useAppStore } from '../stores/useAppStore';
import { ACICalculator } from '../utils/aci-calculator';
import ACICard from '../components/ACICard';
import IndexScoreGrid from '../components/IndexScoreGrid';
import AlertPanel from '../components/AlertPanel';
import TrendChart from '../components/TrendChart';
import PublicDataInfo from '../components/PublicDataInfo';
import ContestInfo from '../components/ContestInfo';

const Dashboard = () => {
  const { selectedFarm, getCurrentFarmACI, weatherData } = useAppStore();

  if (!selectedFarm) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">🏠</div>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">농장을 선택해주세요</h2>
        <p className="text-gray-500">상단의 농장 선택기에서 분석할 농장을 선택하세요.</p>
      </div>
    );
  }

  const currentACI = getCurrentFarmACI();
  
  if (!currentACI) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">📊</div>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">데이터가 없습니다</h2>
        <p className="text-gray-500">선택한 농장의 ACI 데이터를 불러올 수 없습니다.</p>
      </div>
    );
  }

  const indexScores = ACICalculator.getIndexScores(currentACI);
  const grade = ACICalculator.getACIGrade(currentACI.aci);
  const gradeLabel = ACICalculator.getGradeLabel(grade);

  return (
    <div className="space-y-8">
      {/* Contest Information */}
      <ContestInfo />

      {/* Farm Info Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{selectedFarm.name}</h1>
            <p className="text-gray-600 mt-1">
              {selectedFarm.location.address} | {selectedFarm.cropType} | {selectedFarm.farmSize}ha
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">농장주</div>
            <div className="font-semibold text-gray-900">{selectedFarm.owner}</div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Left Column - ACI Score */}
        <div className="lg:col-span-1">
          <ACICard 
            score={currentACI.aci}
            grade={grade}
            gradeLabel={gradeLabel}
            farm={selectedFarm}
          />
        </div>

        {/* Middle Column - Alerts & Weather */}
        <div className="lg:col-span-1 space-y-4 lg:space-y-6">
          <AlertPanel weatherData={weatherData} currentACI={currentACI} />
        </div>

        {/* Right Column - Trend Chart */}
        <div className="lg:col-span-1">
          <TrendChart farmId={selectedFarm.id} />
        </div>
      </div>

      {/* Index Scores Grid */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-6">세부 지수 분석</h2>
        <IndexScoreGrid scores={indexScores} />
      </div>

      {/* Summary Stats */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">농장 현황 요약</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">{selectedFarm.aciScore}</div>
            <div className="text-sm text-gray-600">현재 ACI 점수</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-success-600">{selectedFarm.farmSize}ha</div>
            <div className="text-sm text-gray-600">농장 규모</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-warning-600">{selectedFarm.cropType}</div>
            <div className="text-sm text-gray-600">주요 작물</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">{selectedFarm.location.region}</div>
            <div className="text-sm text-gray-600">지역</div>
          </div>
        </div>
      </div>

      {/* Public Data Information */}
      <div>
        <PublicDataInfo />
      </div>
    </div>
  );
};

export default Dashboard;