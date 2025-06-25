import { useAppStore } from '../stores/useAppStore';
import { ACICalculator } from '../utils/aci-calculator';
import DetailedChart from '../components/DetailedChart';
import ComparisonTable from '../components/ComparisonTable';
import AdvancedPredictionPanel from '../components/AdvancedPredictionPanel';

const Analytics = () => {
  const { selectedFarm, farms, getFarmHistory, policies, marketPrices } = useAppStore();

  if (!selectedFarm) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">📊</div>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">농장을 선택해주세요</h2>
        <p className="text-gray-500">상단의 농장 선택기에서 분석할 농장을 선택하세요.</p>
      </div>
    );
  }

  const history = getFarmHistory(selectedFarm.id);
  const currentData = history[history.length - 1];
  
  if (!currentData) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">📈</div>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">분석 데이터가 없습니다</h2>
        <p className="text-gray-500">선택한 농장의 분석 데이터를 불러올 수 없습니다.</p>
      </div>
    );
  }

  const indexScores = ACICalculator.getIndexScores(currentData);
  const grade = ACICalculator.getACIGrade(currentData.aci);
  
  // Calculate regional comparison
  const regionalFarms = farms.filter(f => f.location.region === selectedFarm.location.region);
  const avgRegionalScore = regionalFarms.reduce((sum, f) => sum + f.aciScore, 0) / regionalFarms.length;
  
  // Calculate crop comparison
  const cropFarms = farms.filter(f => f.cropType === selectedFarm.cropType);
  const avgCropScore = cropFarms.reduce((sum, f) => sum + f.aciScore, 0) / cropFarms.length;

  // Get relevant policies
  const relevantPolicies = policies.filter(p => 
    p.targetCrops.includes(selectedFarm.cropType) || p.targetCrops.includes('전작물')
  );

  // Get market price for current crop
  const currentPrice = marketPrices[selectedFarm.cropType];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">상세 분석</h1>
            <p className="text-gray-600 mt-1">
              {selectedFarm.name}의 종합적인 농업 환경 분석
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-primary-600">{currentData.aci}점</div>
            <div className="text-sm text-gray-600">{grade}등급</div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Detailed Trend Chart */}
        <div className="lg:col-span-2">
          <DetailedChart farmId={selectedFarm.id} history={history} />
        </div>
      </div>

      {/* Comparison Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Regional & Crop Comparison */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">비교 분석</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium text-gray-900">지역 평균 ({selectedFarm.location.region})</div>
                <div className="text-sm text-gray-600">{regionalFarms.length}개 농장</div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-gray-900">{avgRegionalScore.toFixed(1)}점</div>
                <div className={`text-sm ${currentData.aci > avgRegionalScore ? 'text-green-600' : 'text-red-600'}`}>
                  {currentData.aci > avgRegionalScore ? '+' : ''}{(currentData.aci - avgRegionalScore).toFixed(1)}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium text-gray-900">작물 평균 ({selectedFarm.cropType})</div>
                <div className="text-sm text-gray-600">{cropFarms.length}개 농장</div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-gray-900">{avgCropScore.toFixed(1)}점</div>
                <div className={`text-sm ${currentData.aci > avgCropScore ? 'text-green-600' : 'text-red-600'}`}>
                  {currentData.aci > avgCropScore ? '+' : ''}{(currentData.aci - avgCropScore).toFixed(1)}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium text-gray-900">전국 평균</div>
                <div className="text-sm text-gray-600">{farms.length}개 농장</div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-gray-900">
                  {(farms.reduce((sum, f) => sum + f.aciScore, 0) / farms.length).toFixed(1)}점
                </div>
                <div className={`text-sm ${currentData.aci > (farms.reduce((sum, f) => sum + f.aciScore, 0) / farms.length) ? 'text-green-600' : 'text-red-600'}`}>
                  {currentData.aci > (farms.reduce((sum, f) => sum + f.aciScore, 0) / farms.length) ? '+' : ''}{(currentData.aci - (farms.reduce((sum, f) => sum + f.aciScore, 0) / farms.length)).toFixed(1)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Market Information */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">시장 정보</h3>
          
          {currentPrice ? (
            <div className="space-y-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {currentPrice.currentPrice.toLocaleString()}원
                </div>
                <div className="text-sm text-gray-600">현재 {selectedFarm.cropType} 가격 (/{currentPrice.unit})</div>
                <div className={`text-sm mt-1 ${currentPrice.priceChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  전주 대비 {currentPrice.priceChange > 0 ? '+' : ''}{currentPrice.priceChange.toFixed(1)}%
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">평년 동기</span>
                  <span className="text-sm font-medium">{currentPrice.averagePrice.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">가격 추세</span>
                  <span className="text-sm font-medium">
                    {currentPrice.trend === 'increasing' ? '📈 상승' :
                     currentPrice.trend === 'decreasing' ? '📉 하락' : '➡️ 보합'}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">💰</div>
              <p>가격 정보를 불러올 수 없습니다</p>
            </div>
          )}
        </div>
      </div>

      {/* Detailed Index Analysis */}
      <ComparisonTable scores={indexScores} />

      {/* Policy Information */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          관련 정책 지원사업 ({relevantPolicies.length}건)
        </h3>
        
        {relevantPolicies.length > 0 ? (
          <div className="grid gap-4">
            {relevantPolicies.slice(0, 3).map((policy) => (
              <div key={policy.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">{policy.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{policy.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>💰 최대 {(policy.supportAmount / 10000).toLocaleString()}만원</span>
                      <span>📅 ~{new Date(policy.applicationPeriod.end).toLocaleDateString('ko-KR')}</span>
                      <span>📊 선정률 {policy.selectionRate}%</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <span className="px-2 py-1 bg-primary-100 text-primary-800 rounded text-xs">
                      {policy.category}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">📋</div>
            <p>해당하는 정책 지원사업이 없습니다</p>
          </div>
        )}
      </div>

      {/* Advanced AI Prediction Panel */}
      <AdvancedPredictionPanel history={history} weatherData={undefined} />
    </div>
  );
};

export default Analytics;