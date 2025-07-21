# 🌾 아그리인덱스 (AgriIndex)

**제10회 농림축산식품 공공데이터 활용 창업경진대회 출품작**

농업 종합 지수(ACI) 기반 스마트 농장 관리 대시보드

🔗 **라이브 데모**: https://data-mafra-go-kr.vercel.app/

---

## 🎯 프로젝트 개요

아그리인덱스는 농림축산식품부의 공공데이터와 7개 핵심 지표를 융합하여 **농업 종합 지수(Agricultural Composite Index, ACI)**를 산출하고, 농장 운영 최적화를 위한 데이터 기반 인사이트를 제공하는 차세대 농업 관리 플랫폼입니다.

### 🏆 핵심 가치
- **실용성**: 실제 농장 운영 의사결정 지원
- **정확성**: 농림축산식품부 공공데이터 기반 신뢰할 수 있는 분석
- **접근성**: 모든 농업인이 쉽게 사용할 수 있는 직관적 인터페이스
- **확장성**: 전국 농장으로 확장 가능한 플랫폼 아키텍처

---

## 📊 ACI (농업 종합 지수) 체계

### 📈 6개 세부 지수 구성
1. **🌡️ 기상 위험 지수 (WRI)** - 25% 가중치
   - 온도, 습도, 강수량, 일사량 종합 분석
   - 기상재해 위험도 평가

2. **🌱 토양 건강 지수 (SHI)** - 20% 가중치  
   - pH, 유기물, 질소/인/칼륨 함량 분석
   - 토양 개선 권장사항 제공

3. **🐛 병해충 위험 지수 (PRI)** - 20% 가중치
   - 계절별/지역별 병해충 발생 예측
   - 예방적 방제 시점 알림

4. **💰 시장 가치 지수 (MVI)** - 15% 가중치
   - 작물별 시장 가격 동향 분석
   - 최적 출하 시기 추천

5. **🏛️ 정책 지원 지수 (PSI)** - 10% 가중치
   - 정부 지원 정책 매칭
   - 보조금 신청 안내

6. **🗺️ 지리적 적합성 지수 (GSI)** - 10% 가중치
   - 토지 이용 현황 분석  
   - 작물별 재배 적합도 평가

### 🎯 종합 지수 계산 공식
```
ACI = (WRI × 0.25) + (SHI × 0.20) + (PRI × 0.20) + (MVI × 0.15) + (PSI × 0.10) + (GSI × 0.10)
```

### 📋 등급 체계
- **A등급 (90-100점)** 🟢 **최우수**: 최적의 농장 운영 상태
- **B등급 (80-89점)** 🟡 **우수**: 양호한 상태, 소폭 개선 권장  
- **C등급 (70-79점)** 🟠 **보통**: 일반적 수준, 개선 여지 존재
- **D등급 (60-69점)** 🔴 **주의**: 즉시 개선 필요
- **E등급 (0-59점)** ⚫ **위험**: 긴급 대응 필요

---

## 🚀 주요 기능

### 1. 🎛️ 스마트 대시보드
- **실시간 ACI 모니터링**: 농장별 종합 지수 실시간 추적
- **세부 지수 분석**: 6개 지수별 상세 현황 및 개선 포인트
- **맞춤형 알림 시스템**: 기상/병해충/시장 상황 기반 실시간 알림
- **30일 추이 분석**: 농장 성과 트렌드 시각화

### 2. 🗺️ 지도 기반 분석
- **전국 농장 분포**: Interactive 지도에 ACI 등급별 농장 표시
- **지역별 비교**: 인근 농장 성과 벤치마킹
- **농경지 경계**: 농림축산식품부 팜맵 API 연동 정확한 농경지 정보

### 3. 📈 고급 분석 기능
- **예측 분석**: AI 기반 7일 후 ACI 예측
- **비교 분석**: 작물별/지역별/규모별 성과 비교
- **트렌드 분석**: 계절별 농장 성과 패턴 분석
- **개선 방안**: 데이터 기반 맞춤형 농장 개선 로드맵

### 4. 🔗 실제 공공데이터 연동
- **농림축산식품부 팜맵 API**: 실시간 농경지 데이터
- **PNU 기반 조회**: 필지고유번호 기반 정확한 농경지 정보
- **하이브리드 데이터**: API + 모크데이터 자동 전환으로 안정성 보장

---

## 🛠️ 기술 스택

### Frontend Architecture
- **React 18** + **TypeScript**: 현대적이고 안전한 사용자 인터페이스
- **Vite**: 빠른 개발 환경 및 최적화된 빌드
- **Tailwind CSS**: 농업 특화 색상 체계 및 반응형 디자인
- **Zustand**: 경량 상태 관리

### Data Visualization
- **Chart.js** + **react-chartjs-2**: 풍부한 차트 및 그래프
- **Leaflet** + **react-leaflet**: 고성능 인터렉티브 지도

### API Integration  
- **FarmMap API Client**: 농림축산식품부 공공데이터 연동
- **JSONP CORS Solution**: 브라우저 보안 정책 우회 안전한 API 호출
- **Hybrid Data Service**: API + 모크데이터 자동 폴백 시스템

### Deployment & DevOps
- **Vercel**: 자동 CI/CD 파이프라인
- **Git 브랜치 전략**: 안전한 개발 및 배포 워크플로우

---

## 🏃‍♂️ 빠른 시작

### 1. 환경 준비
```bash
# 저장소 클론
git clone https://github.com/yonghwan1106/data.mafra.go.kr.git
cd data.mafra.go.kr

# 의존성 설치
npm install
```

### 2. 개발 서버 실행
```bash
# 개발 모드 실행
npm run dev

# 브라우저에서 http://localhost:3000 접속
```

### 3. 빌드 및 배포
```bash
# 프로덕션 빌드
npm run build

# Vercel 배포 (선택사항)
npm run vercel-build
```

---

## 🏗️ 프로젝트 구조

```
src/
├── components/              # 재사용 가능한 UI 컴포넌트
│   ├── Layout.tsx          # 공통 레이아웃 및 네비게이션
│   ├── ACICard.tsx         # ACI 점수 카드 컴포넌트  
│   ├── DataSourceToggle.tsx # 개발자 도구: 데이터 소스 전환
│   └── ...
├── pages/                  # 메인 페이지 컴포넌트
│   ├── Dashboard.tsx       # 메인 대시보드 (/)
│   ├── MapView.tsx         # 지도 기반 분석 (/map)
│   ├── Analytics.tsx       # 고급 분석 (/analytics)  
│   └── About.tsx           # 프로젝트 소개 (/about)
├── services/               # API 및 데이터 서비스
│   ├── farmmap-api-client.ts    # 팜맵 API 클라이언트
│   └── hybrid-data-service.ts   # 하이브리드 데이터 매니저
├── config/                 # 설정 파일
│   └── data-sources.ts     # 데이터 소스 설정
├── stores/                 # 상태 관리
│   └── useAppStore.ts      # Zustand 글로벌 스토어
├── utils/                  # 비즈니스 로직 유틸리티
│   ├── aci-calculator.ts   # ACI 계산 엔진
│   ├── ai-predictor.ts     # AI 예측 모델
│   └── notification-system.ts  # 알림 시스템
└── data/                   # 모크/테스트 데이터
    ├── farms.json          # 농장 기본 정보
    ├── aci-history.json    # ACI 히스토리
    └── ...
```

---

## 🔧 주요 설정

### 데이터 소스 설정
```typescript
// src/config/data-sources.ts
export const DATA_SOURCE_CONFIG = {
  primarySource: 'mock',        // 기본: 안정적인 모크데이터
  fallbackEnabled: true,        // API 실패시 자동 폴백
  farmMapAPI: {
    enabled: false,             // 개발환경에서만 true
    baseUrl: 'https://agis.epis.or.kr/ASD/farmmapApi/',
    timeout: 10000
  }
};
```

### 개발자 도구
- **localhost/vercel.app에서만 표시**: 프로덕션 환경에서는 숨김
- **데이터 소스 토글**: 실시간 모크데이터 ↔ 실제 API 전환
- **API 연결 테스트**: FarmMap API 상태 실시간 모니터링

---

## 🎯 경진대회 출품 정보

### 💡 문제 해결 아이디어
**"농업인이 복잡한 데이터를 이해하기 어렵다"**
→ **단일 지수(ACI)로 농장 상태를 직관적으로 표현**

**"산발적인 공공데이터 활용의 어려움"**  
→ **7개 데이터를 융합한 종합 인사이트 제공**

### 🎨 차별화 포인트
1. **종합 지수 시스템**: 복잡한 농업 데이터를 하나의 지수로 단순화
2. **실제 공공데이터 연동**: 농림축산식품부 팜맵 API 완전 통합
3. **하이브리드 아키텍처**: 안정성과 실용성의 완벽한 균형
4. **사용자 중심 설계**: 농업인의 실제 업무 플로우 반영

### 🏆 기대 효과
- **농업 생산성 향상**: 데이터 기반 의사결정으로 수확량 증대
- **위험 관리**: 기상/병해충 위험 사전 대응으로 손실 최소화  
- **수익 극대화**: 최적 출하 시기 예측으로 농가 소득 증대
- **공공데이터 가치 창출**: 정부 데이터의 실용적 활용 사례

---

## 🚀 라이브 서비스

**🔗 배포 URL**: https://data-mafra-go-kr.vercel.app/

### 서비스 특징
- ✅ **24/7 안정 서비스**: Vercel 기반 고가용성 배포
- ✅ **모바일 친화적**: 반응형 디자인으로 모든 디바이스 지원  
- ✅ **빠른 로딩**: Vite 빌드 최적화로 초고속 로딩
- ✅ **에러 복구**: API 실패시 자동 폴백으로 서비스 중단 없음

---

## 🤝 기여하기

1. **Fork** 저장소
2. **Feature Branch** 생성 (`git checkout -b feature/amazing-feature`)
3. **변경사항 커밋** (`git commit -m 'Add amazing feature'`)  
4. **Branch Push** (`git push origin feature/amazing-feature`)
5. **Pull Request** 생성

---

## 📄 라이선스

이 프로젝트는 **MIT 라이선스** 하에 배포됩니다.

---

## 📞 문의

프로젝트 관련 문의나 버그 리포트는 [GitHub Issues](https://github.com/yonghwan1106/data.mafra.go.kr/issues)를 통해 남겨주세요.

---

<div align="center">

**🏆 제10회 농림축산식품 공공데이터 활용 창업경진대회 출품작 🏆**

**스마트 농업의 미래를 여는 아그리인덱스**

*Built with ❤️ for Korean Agriculture*

</div>