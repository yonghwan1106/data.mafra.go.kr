# 아그리인덱스 (AgriIndex) 🌾

농업 종합 지수(ACI) 기반 농장 관리 대시보드

## 🎯 프로젝트 개요

아그리인덱스는 7개 공공데이터를 융합하여 농업 종합 지수(Agricultural Composite Index, ACI)를 산출하고, 농장 운영에 필요한 인사이트를 제공하는 웹 애플리케이션입니다.

### 핵심 기능
- **농업 종합 지수(ACI) 계산**: 6개 세부 지수를 통한 종합 평가
- **실시간 대시보드**: 농장 현황을 한눈에 파악
- **지도 기반 시각화**: 지역별 농장 현황 비교
- **예측 분석**: AI 기반 7일 후 ACI 예측
- **맞춤형 개선 방안**: 농장별 상황에 맞는 액션 플랜 제공

## 🛠️ 기술 스택

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Charts**: Chart.js + react-chartjs-2
- **Maps**: Leaflet + react-leaflet
- **State Management**: Zustand
- **Build Tool**: Vite

## 🚀 빠른 시작

### 1. 저장소 클론
```bash
git clone <repository-url>
cd data.mafra.go.kr/website
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 개발 서버 실행
```bash
npm run dev
```

브라우저에서 `http://localhost:3000`을 열어 확인하세요.

### 4. 빌드
```bash
npm run build
```

## 📊 ACI (Agricultural Composite Index) 계산 공식

### 세부 지수 구성
1. **기상 위험 지수 (WRI)** - 25% 가중치
2. **토양 건강 지수 (SHI)** - 20% 가중치
3. **병해충 위험 지수 (PRI)** - 20% 가중치
4. **시장 가치 지수 (MVI)** - 15% 가중치
5. **정책 지원 지수 (PSI)** - 10% 가중치
6. **지리적 적합성 지수 (GSI)** - 10% 가중치

### 종합 지수 계산
```
ACI = (WRI × 0.25) + (SHI × 0.20) + (PRI × 0.20) + (MVI × 0.15) + (PSI × 0.10) + (GSI × 0.10)
```

### 등급 체계
- **A등급 (80-100점)**: 매우좋음 🟢
- **B등급 (70-79점)**: 좋음 🟡
- **C등급 (60-69점)**: 보통 🟠
- **D등급 (50-59점)**: 주의 🔴
- **E등급 (0-49점)**: 위험 ⚫

## 📁 프로젝트 구조

```
src/
├── components/          # 재사용 가능한 컴포넌트
│   ├── Layout.tsx      # 공통 레이아웃
│   ├── ACICard.tsx     # ACI 점수 카드
│   ├── IndexScoreGrid.tsx  # 세부 지수 그리드
│   ├── TrendChart.tsx  # 추이 차트
│   └── ...
├── pages/              # 페이지 컴포넌트
│   ├── Dashboard.tsx   # 메인 대시보드
│   ├── MapView.tsx     # 지도 뷰
│   └── Analytics.tsx   # 상세 분석
├── stores/             # 상태 관리
│   └── useAppStore.ts  # Zustand 스토어
├── utils/              # 유틸리티 함수
│   └── aci-calculator.ts  # ACI 계산 로직
├── types/              # TypeScript 타입 정의
└── hooks/              # Custom React hooks
```

## 🎨 주요 페이지

### 대시보드 (`/`)
- 농장 개요 및 ACI 점수
- 세부 지수 카드
- 실시간 알림 패널
- 30일 추이 차트

### 지도 뷰 (`/map`)
- 전국 농장 분포 지도
- ACI 등급별 마커 표시
- 농장 상세 정보 팝업

### 상세 분석 (`/analytics`)
- 세부 지수별 트렌드 분석
- 지역/작물별 비교
- 7일 예측 분석
- 맞춤형 개선 방안

## 📊 가상 데이터

개발 및 데모 목적으로 다음 가상 데이터를 제공합니다:

- `farms.json`: 농장 기본 정보
- `aci-history.json`: ACI 점수 히스토리
- `weather.json`: 기상 정보
- `market-prices.json`: 시장 가격 정보
- `policies.json`: 정책 지원 정보

## 🔧 개발 가이드

### 컴포넌트 추가
```tsx
// src/components/NewComponent.tsx
import { useAppStore } from '../stores/useAppStore';

const NewComponent = () => {
  const { selectedFarm } = useAppStore();
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {/* 컴포넌트 내용 */}
    </div>
  );
};

export default NewComponent;
```

### 스토어 사용
```tsx
// 상태 가져오기
const { farms, selectedFarm, setSelectedFarm } = useAppStore();

// 농장 선택
setSelectedFarm(farm);

// ACI 히스토리 가져오기
const history = getFarmHistory(farmId);
```

### ACI 계산
```tsx
import { ACICalculator } from '../utils/aci-calculator';

// ACI 점수 계산
const aciScore = ACICalculator.calculateACI(wri, shi, pri, mvi, psi, gsi);

// 등급 계산
const grade = ACICalculator.getACIGrade(aciScore);

// 색상 가져오기
const color = ACICalculator.getGradeColor(grade);
```

## 🚀 배포

### Vercel 배포 (추천)
1. GitHub에 저장소 푸시
2. Vercel에서 프로젝트 연결
3. 자동 배포 설정

### Netlify 배포
1. 프로젝트 빌드: `npm run build`
2. `dist` 폴더를 Netlify에 업로드

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 📞 문의

프로젝트 관련 문의나 버그 리포트는 GitHub Issues를 통해 남겨주세요.

---

**제10회 농림축산식품 공공데이터 활용 창업경진대회 출품작**

*Built with ❤️ by Claude AI Assistant*