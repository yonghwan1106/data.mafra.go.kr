const PublicDataInfo = () => {
  const publicDataSources = [
    {
      name: "팜맵(농업경영체 현황)",
      provider: "농림축산식품부",
      description: "농장 위치 및 경영체 정보",
      icon: "🗺️",
      color: "bg-blue-50 text-blue-700"
    },
    {
      name: "기상정보",
      provider: "기상청",
      description: "농업 기상정보 및 기상특보",
      icon: "🌤️",
      color: "bg-cyan-50 text-cyan-700"
    },
    {
      name: "병해충 발생정보",
      provider: "농촌진흥청",
      description: "작물 병해충 발생 현황 및 예보",
      icon: "🐛",
      color: "bg-orange-50 text-orange-700"
    },
    {
      name: "토양환경정보",
      provider: "농촌진흥청",
      description: "토양 화학성 및 물리성 정보",
      icon: "🌱",
      color: "bg-green-50 text-green-700"
    },
    {
      name: "농산물 가격정보",
      provider: "농림축산식품부",
      description: "도매시장 거래가격 및 동향",
      icon: "💰",
      color: "bg-purple-50 text-purple-700"
    },
    {
      name: "농가소득정보",
      provider: "통계청",
      description: "농업소득 및 경영성과 통계",
      icon: "📊",
      color: "bg-indigo-50 text-indigo-700"
    },
    {
      name: "정책지원정보",
      provider: "농림축산식품부",
      description: "농업정책 및 지원사업 현황",
      icon: "📋",
      color: "bg-red-50 text-red-700"
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 bg-gradient-to-r from-primary-50 to-green-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">📊 공공데이터 활용 현황</h3>
            <p className="text-sm text-gray-600 mt-1">
              7개 공공데이터를 융합하여 농업 종합 지수(ACI)를 산출합니다
            </p>
          </div>
          <div className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium">
            데이터 연동률 100%
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {publicDataSources.map((source, index) => (
            <div key={index} className={`p-4 rounded-lg border ${source.color.replace('text-', 'border-').replace('-700', '-200')}`}>
              <div className="flex items-start space-x-3">
                <span className="text-2xl">{source.icon}</span>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 text-sm mb-1">{source.name}</h4>
                  <p className="text-xs text-gray-600 mb-2">{source.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-500">{source.provider}</span>
                    <div className="w-2 h-2 bg-green-400 rounded-full" title="연동 완료"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">7개</div>
              <div className="text-sm text-gray-600">활용 데이터 소스</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">6개</div>
              <div className="text-sm text-gray-600">세부 지수 산출</div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">실시간</div>
              <div className="text-sm text-gray-600">데이터 업데이트</div>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <span className="text-amber-600 text-lg">ℹ️</span>
            <div>
              <h4 className="font-medium text-amber-800 mb-1">공공데이터 활용 정보</h4>
              <p className="text-sm text-amber-700">
                현재는 시연을 위한 가상 데이터로 운영됩니다. 
                실제 서비스에서는 상기 공공데이터 API를 통해 실시간 정보를 제공합니다.
              </p>
              <div className="mt-2">
                <a 
                  href="https://data.mafra.go.kr" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-amber-600 hover:text-amber-800 font-medium underline"
                >
                  농림축산식품 공공데이터 포털 바로가기 →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicDataInfo;