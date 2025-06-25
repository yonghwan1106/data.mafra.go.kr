const ContestInfo = () => {
  return (
    <div className="bg-gradient-to-r from-primary-600 to-green-600 text-white rounded-lg shadow-lg overflow-hidden">
      <div className="px-6 py-8">
        <div className="text-center">
          <div className="text-4xl mb-4">🏆</div>
          <h2 className="text-2xl font-bold mb-2">제10회 농림축산식품 공공데이터 활용 창업경진대회</h2>
          <p className="text-primary-100 mb-6">
            7개 공공데이터를 융합한 농업 종합 지수(ACI) 기반 스마트팜 관리 솔루션
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-300">7개</div>
              <div className="text-sm text-primary-100">공공데이터 융합</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-300">AI</div>
              <div className="text-sm text-primary-100">예측 알고리즘</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-300">100%</div>
              <div className="text-sm text-primary-100">웹 접근성</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div className="bg-white bg-opacity-10 rounded-lg p-4">
              <h4 className="font-semibold mb-2">🎯 핵심 기능</h4>
              <ul className="text-sm space-y-1 text-primary-100">
                <li>• 농업 종합 지수(ACI) 실시간 산출</li>
                <li>• 6개 세부 지수 기반 종합 분석</li>
                <li>• AI 기반 30일 후 예측</li>
                <li>• 맞춤형 농장 관리 제안</li>
              </ul>
            </div>
            
            <div className="bg-white bg-opacity-10 rounded-lg p-4">
              <h4 className="font-semibold mb-2">📊 활용 데이터</h4>
              <ul className="text-sm space-y-1 text-primary-100">
                <li>• 팜맵(농업경영체) - 농식품부</li>
                <li>• 기상정보 - 기상청</li>
                <li>• 병해충정보 - 농진청</li>
                <li>• 시장가격, 정책정보 등</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-primary-400">
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="text-center">
                <div className="text-sm text-primary-200">주최</div>
                <div className="font-semibold">농림축산식품부 | 농촌진흥청</div>
              </div>
              <div className="hidden sm:block w-px h-8 bg-primary-400"></div>
              <div className="text-center">
                <div className="text-sm text-primary-200">접수기간</div>
                <div className="font-semibold">2025.03.17 ~ 06.30</div>
              </div>
              <div className="hidden sm:block w-px h-8 bg-primary-400"></div>
              <div className="text-center">
                <div className="text-sm text-primary-200">개발기간</div>
                <div className="font-semibold">3개월 (MVP 완성)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContestInfo;