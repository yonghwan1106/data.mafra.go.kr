# 아그리인덱스 (AgriIndex) 프로젝트

## 📋 프로젝트 개요
- **서비스명**: 아그리인덱스 (AgriIndex)
- **목적**: 7개 공공데이터 융합을 통한 농업 종합 지수(ACI) 산출 및 대시보드 제공
- **대상**: 제10회 농림축산식품 공공데이터 활용 창업경진대회 출품작
- **기술스택**: React.js + TypeScript + Vite + Tailwind CSS
- **개발 현황**: MVP 완성 (2025-06-24)
- **배포 준비**: Vercel 배포 설정 완료

## 🏗️ 프로젝트 구조
```
├── website/                    # 메인 웹 애플리케이션
│   ├── src/                   
│   │   ├── components/        # React 컴포넌트
│   │   ├── pages/            # 페이지 컴포넌트
│   │   ├── hooks/            # Custom hooks
│   │   ├── stores/           # Zustand 상태 관리
│   │   ├── utils/            # 유틸리티 함수들
│   │   └── types/            # TypeScript 타입 정의
│   └── public/data/          # 가상 데이터 JSON 파일들
├── competition-docs/         # 경진대회 관련 문서들
└── 아그리인덱스_상세_설계서.md # 핵심 설계 문서
```

## 🚀 개발 환경 설정

### 1. 의존성 설치
```bash
cd website
npm install
```

### 2. 개발 서버 실행
```bash
npm run dev
```

### 3. 빌드
```bash
npm run build
```

### 4. 미리보기
```bash
npm run preview
```

## 🧮 핵심 기능

### ACI (Agricultural Composite Index) 계산
- **기상 위험 지수 (WRI)**: 25% 가중치
- **토양 건강 지수 (SHI)**: 20% 가중치  
- **병해충 위험 지수 (PRI)**: 20% 가중치
- **시장 가치 지수 (MVI)**: 15% 가중치
- **정책 지원 지수 (PSI)**: 10% 가중치
- **지리적 적합성 지수 (GSI)**: 10% 가중치

### 등급 체계
- A등급 (80-100점): 매우좋음 🟢
- B등급 (70-79점): 좋음 🟡
- C등급 (60-69점): 보통 🟠
- D등급 (50-59점): 주의 🔴
- E등급 (0-49점): 위험 ⚫

## 📊 데이터 구조

### 농장 데이터 (farms.json)
```typescript
interface Farm {
  id: string;
  name: string;
  owner: string;
  location: { lat: number; lng: number; address: string; region: string; };
  cropType: string;
  farmSize: number;
  aciScore: number;
  aciGrade: 'A' | 'B' | 'C' | 'D' | 'E';
  lastUpdated: string;
}
```

### ACI 히스토리 (aci-history.json)
```typescript
interface ACIData {
  date: string;
  aci: number;
  wri: number; // Weather Risk Index
  shi: number; // Soil Health Index
  pri: number; // Pest Risk Index
  mvi: number; // Market Value Index
  psi: number; // Policy Support Index
  gsi: number; // Geographic Suitability Index
}
```

## 🎨 UI/UX 컴포넌트

### 주요 페이지
- **Dashboard**: 메인 대시보드 (ACI 종합 정보, 경진대회 안내, 공공데이터 현황)
- **MapView**: 지도 기반 농장 시각화
- **Analytics**: 상세 분석 및 차트

### 신규 컴포넌트 (2025-06-24 추가)
- **ContestInfo**: 경진대회 정보 및 프로젝트 소개
- **PublicDataInfo**: 7개 공공데이터 활용 현황 안내
- **AdvancedPredictionPanel**: LSTM 기반 AI 예측 시스템
- **NotificationCenter**: 실시간 알림 센터

### 핵심 컴포넌트
- **Layout**: 공통 레이아웃 및 네비게이션 (알림 센터 포함)
- **ACICard**: ACI 점수 표시 카드
- **IndexScoreGrid**: 6개 세부 지수 그리드
- **TrendChart**: 시계열 추이 차트
- **FarmMap**: Leaflet 기반 지도 컴포넌트

## 🔧 개발 가이드

### 상태 관리 (Zustand)
```typescript
// 전역 상태 사용
const { selectedFarm, farms, setSelectedFarm } = useAppStore();
```

### ACI 계산 유틸리티
```typescript
import { ACICalculator } from '../utils/aci-calculator';

// ACI 점수 계산
const aciScore = ACICalculator.calculateACI(wri, shi, pri, mvi, psi, gsi);

// 등급 계산
const grade = ACICalculator.getACIGrade(aciScore);
```

### 데이터 로딩
```typescript
// 자동 데이터 로딩 훅 사용
useDataLoader(); // App.tsx에서 실행
```

## 📱 반응형 디자인
- **데스크탑**: 전체 기능 제공
- **태블릿**: 적응형 레이아웃
- **모바일**: 간소화된 UI, 하단 네비게이션

## 🚀 배포 전략

### Vercel 배포 (추천)
```bash
# GitHub 연동 후 자동 배포
# 커스텀 도메인: agri-index.vercel.app
```

### Netlify 배포
```bash
# 빌드 후 dist 폴더 업로드
npm run build
```

## 🛠️ 향후 개발 계획

### Phase 1: MVP (현재)
- [x] 기본 UI/UX 구현
- [x] 가상 데이터 시스템
- [x] ACI 계산 알고리즘
- [ ] 차트 및 시각화
- [ ] 지도 기능

### Phase 2: 실데이터 연동
- [ ] 공공데이터 API 연동
- [ ] 실시간 데이터 업데이트
- [ ] 사용자 인증 시스템

### Phase 3: 고도화
- [x] 경진대회 정보 및 공공데이터 안내 추가
- [x] AI 예측 모델 고도화 (LSTM 신경망 기반)
- [x] 실시간 알림 시스템
- [ ] 모바일 앱 개발

## 🔍 트러블슈팅

### 의존성 설치 오류
```bash
# Node 버전 확인 (18+ 권장)
node --version

# 캐시 클리어 후 재설치
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### 빌드 오류
```bash
# TypeScript 검사
npm run lint

# 타입 체크
npx tsc --noEmit
```

## 📅 업데이트 로그

### v1.2.0 (2025-06-24 23:15)
- ✅ LSTM 신경망 기반 AI 예측 모델 구현 (AdvancedPredictionPanel)
- ✅ 실시간 알림 시스템 구현 (NotificationCenter)
- ✅ 고급 위험 요소 분석 및 AI 추천 시스템
- ✅ 데스크톱 알림, 사운드 알림, 카테고리별 필터링
- ✅ 알림 센터 헤더 통합 및 자동 알림 생성

### v1.1.0 (2025-06-24 22:45)
- ✅ 경진대회 정보 컴포넌트 추가 (ContestInfo)
- ✅ 공공데이터 활용 안내 컴포넌트 추가 (PublicDataInfo)  
- ✅ 헤더에 경진대회 출품작 표시 추가
- ✅ CSS 오류 수정 (border-border 클래스 제거)
- ✅ 반응형 디자인 개선 (모바일 농장 선택기 추가)

### v1.0.0 (2025-06-24 21:00)
- ✅ 프로젝트 초기 구조 및 설정 완료
- ✅ 7개 공공데이터 기반 ACI 계산 알고리즘 구현
- ✅ 메인 대시보드, 지도 뷰, 상세 분석 페이지 완성
- ✅ 가상 데이터 시스템 구축
- ✅ Vercel 배포 설정 완료

## 📞 문의사항
프로젝트 관련 문의는 GitHub Issues를 통해 남겨주세요.

---
*최종 업데이트: 2025-06-24 23:15*
*개발자: Claude AI Assistant*
*제10회 농림축산식품 공공데이터 활용 창업경진대회 출품작*