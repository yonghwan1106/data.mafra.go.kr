import { ChartBarIcon, MapIcon, BeakerIcon, TrophyIcon } from '@heroicons/react/24/outline';
import ContestInfo from '../components/ContestInfo';
import PublicDataInfo from '../components/PublicDataInfo';

const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
      {/* Hero Section */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-6">
          <span className="text-6xl mr-4">🌾</span>
          <h1 className="text-4xl font-bold text-primary-600">아그리인덱스</h1>
        </div>
        <p className="text-xl text-gray-600 mb-4">
          농업 복합 지수를 통한 스마트 농업 의사결정 지원 플랫폼
        </p>
        <div className="bg-primary-50 border-l-4 border-primary-400 p-4 max-w-3xl mx-auto">
          <p className="text-primary-800 font-medium">
            제10회 농림축산식품 공공데이터 활용 창업경진대회 출품작
          </p>
        </div>
      </div>

      {/* Project Overview */}
      <section className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">프로젝트 개요</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-primary-600 mb-4">문제 정의</h3>
            <p className="text-gray-700 leading-relaxed">
              농업인들은 기상, 토양, 병해충, 시장가격, 정책지원 등 다양한 요소를 종합적으로 고려해야 하지만, 
              이러한 정보가 분산되어 있어 효과적인 농업 의사결정에 어려움을 겪고 있습니다.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-primary-600 mb-4">솔루션</h3>
            <p className="text-gray-700 leading-relaxed">
              공공데이터를 활용하여 6개 핵심 지수를 통합한 <strong>농업복합지수(ACI)</strong>를 개발하고, 
              이를 시각화하여 농업인의 데이터 기반 의사결정을 지원합니다.
            </p>
          </div>
        </div>
      </section>

      {/* ACI Components */}
      <section className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">농업복합지수(ACI) 구성요소</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-blue-50 rounded-lg">
            <div className="text-3xl mb-3">🌤️</div>
            <h3 className="font-semibold text-blue-800 mb-2">기상 위험도</h3>
            <p className="text-sm text-blue-600">기온, 강수량, 습도 등 기상 조건 분석</p>
          </div>
          <div className="text-center p-6 bg-green-50 rounded-lg">
            <div className="text-3xl mb-3">🌱</div>
            <h3 className="font-semibold text-green-800 mb-2">토양 건강도</h3>
            <p className="text-sm text-green-600">토양 pH, 영양분, 유기물 함량 평가</p>
          </div>
          <div className="text-center p-6 bg-red-50 rounded-lg">
            <div className="text-3xl mb-3">🐛</div>
            <h3 className="font-semibold text-red-800 mb-2">병해충 위험도</h3>
            <p className="text-sm text-red-600">병해충 발생 예측 및 위험도 평가</p>
          </div>
          <div className="text-center p-6 bg-yellow-50 rounded-lg">
            <div className="text-3xl mb-3">💰</div>
            <h3 className="font-semibold text-yellow-800 mb-2">시장 가치</h3>
            <p className="text-sm text-yellow-600">농산물 가격 동향 및 수요 분석</p>
          </div>
          <div className="text-center p-6 bg-purple-50 rounded-lg">
            <div className="text-3xl mb-3">🏛️</div>
            <h3 className="font-semibold text-purple-800 mb-2">정책 지원도</h3>
            <p className="text-sm text-purple-600">정부 지원 정책 및 보조금 정보</p>
          </div>
          <div className="text-center p-6 bg-indigo-50 rounded-lg">
            <div className="text-3xl mb-3">🗺️</div>
            <h3 className="font-semibold text-indigo-800 mb-2">지리적 적합성</h3>
            <p className="text-sm text-indigo-600">지역별 작물 재배 적합도 평가</p>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">주요 기능</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <ChartBarIcon className="w-12 h-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">종합 대시보드</h3>
            <p className="text-gray-600">농업복합지수와 세부 지수를 한눈에 확인할 수 있는 직관적인 대시보드</p>
          </div>
          <div className="text-center">
            <MapIcon className="w-12 h-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">지역별 현황 지도</h3>
            <p className="text-gray-600">전국 농업 현황을 지도로 시각화하여 지역간 비교 분석 제공</p>
          </div>
          <div className="text-center">
            <BeakerIcon className="w-12 h-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">상세 분석</h3>
            <p className="text-gray-600">시계열 분석과 예측 모델을 통한 농업 트렌드 분석</p>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="bg-gray-50 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">기술 스택</h2>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg text-center">
            <h3 className="font-semibold text-blue-600 mb-2">Frontend</h3>
            <p className="text-sm text-gray-600">React + TypeScript</p>
          </div>
          <div className="bg-white p-4 rounded-lg text-center">
            <h3 className="font-semibold text-green-600 mb-2">State Management</h3>
            <p className="text-sm text-gray-600">Zustand</p>
          </div>
          <div className="bg-white p-4 rounded-lg text-center">
            <h3 className="font-semibold text-purple-600 mb-2">Styling</h3>
            <p className="text-sm text-gray-600">Tailwind CSS</p>
          </div>
          <div className="bg-white p-4 rounded-lg text-center">
            <h3 className="font-semibold text-orange-600 mb-2">Visualization</h3>
            <p className="text-sm text-gray-600">Chart.js + Leaflet</p>
          </div>
        </div>
      </section>

      {/* Contest Info */}
      <ContestInfo />

      {/* Public Data Info */}
      <PublicDataInfo />

      {/* Team & Vision */}
      <section className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">비전</h2>
        <div className="text-center">
          <TrophyIcon className="w-16 h-16 text-primary-600 mx-auto mb-4" />
          <p className="text-lg text-gray-700 leading-relaxed max-w-4xl mx-auto">
            아그리인덱스는 공공데이터의 힘으로 농업의 디지털 전환을 이끌어, 
            모든 농업인이 데이터에 기반한 스마트한 의사결정을 내릴 수 있는 
            <strong className="text-primary-600"> 농업 4.0 시대</strong>를 만들어 나가겠습니다.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 text-white rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">지금 바로 체험해보세요</h2>
        <p className="mb-6">아그리인덱스로 농업 데이터의 새로운 가능성을 발견하세요</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href="/" 
            className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            📊 대시보드 보기
          </a>
          <a 
            href="/map" 
            className="bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-800 transition-colors border border-primary-500"
          >
            🗺️ 지도 보기
          </a>
        </div>
      </section>
    </div>
  );
};

export default About;