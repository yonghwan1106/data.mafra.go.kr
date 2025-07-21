# 🌾 아그리인덱스 개발 가이드

> 안전한 개발을 위한 Git 브랜치 전략 및 개발 가이드

## 📋 브랜치 전략

### 주요 브랜치 구조

```
main                    ← 배포용 안정 버전
├── backup/stable-prototype  ← 백업: 소개 페이지 포함 완성 프로토타입
└── feature/farmmap-api-integration  ← 현재 개발 브랜치: FarmMap API 연동
```

### 브랜치별 역할

#### 🔒 `main` 브랜치
- **목적**: 검증된 안정 버전만 포함
- **배포**: Vercel 자동 배포
- **보호**: 직접 커밋 금지, PR을 통해서만 병합

#### 💾 `backup/stable-prototype` 브랜치  
- **목적**: 소개 페이지가 포함된 완전한 프로토타입 백업
- **내용**: 
  - 완성된 React 앱
  - About 페이지
  - 모든 문서 및 자료
- **용도**: 문제 발생시 안전한 복원 지점

#### 🚀 `feature/farmmap-api-integration` 브랜치
- **목적**: FarmMap API 연동 개발
- **개발 방향**: 기존 기능 유지하면서 실제 공공데이터 추가
- **안전장치**: 모크데이터와 실제 API를 토글 가능하게 구현

---

## 🛡️ 안전한 개발 원칙

### 1. 점진적 개발
- 기존 기능을 절대 제거하지 않음
- 새로운 기능은 **추가**로만 구현
- 토글 스위치로 새 기능 활성화/비활성화

### 2. 데이터 소스 이중화
```typescript
// 예시: 데이터 소스 전환 가능한 구조
interface DataConfig {
  useMockData: boolean;
  useRealAPI: boolean;
  fallbackToMock: boolean;
}

const DATA_CONFIG: DataConfig = {
  useMockData: true,    // 기본값: 모크데이터 사용
  useRealAPI: false,    // 실제 API는 개발 완료 후 활성화
  fallbackToMock: true  // API 실패시 모크데이터로 대체
};
```

### 3. 환경별 설정
- **개발환경**: 모크데이터 + API 테스트
- **스테이징**: 실제 API 우선, 모크데이터 백업
- **프로덕션**: 검증된 설정만 사용

---

## 🔄 개발 워크플로우

### 일반적인 개발 사이클

```bash
# 1. 개발 브랜치에서 작업
git checkout feature/farmmap-api-integration

# 2. 기능 개발
# - 새로운 API 클라이언트 추가
# - 기존 컴포넌트는 수정하지 않고 확장

# 3. 테스트
# - 모크데이터로 기존 기능 정상 동작 확인
# - 새 API로 추가 기능 테스트

# 4. 커밋
git add .
git commit -m "✨ FarmMap API 클라이언트 추가 - 모크데이터 호환성 유지"

# 5. 안전 확인 후 푸시
git push origin feature/farmmap-api-integration
```

### 백업 브랜치 활용

```bash
# 문제 발생시 백업 브랜치로 복원
git checkout backup/stable-prototype

# 특정 파일만 복원
git checkout backup/stable-prototype -- src/components/SomeComponent.tsx

# 새로운 수정 브랜치 생성
git checkout -b hotfix/restore-from-backup
```

---

## 🎯 FarmMap API 통합 계획

### Phase 1: API 클라이언트 개발 (1주차)
- [ ] FarmMap API 클라이언트 클래스 생성
- [ ] 에러 핸들링 및 타임아웃 처리
- [ ] 모크데이터와 동일한 인터페이스 제공

### Phase 2: 점진적 통합 (2주차)
- [ ] 토글 방식으로 데이터 소스 선택 가능
- [ ] 지도 컴포넌트에 실제 농경지 경계 표시
- [ ] 기존 ACI 계산에 실제 농경지 데이터 활용

### Phase 3: 고도화 (3주차)
- [ ] 새로운 분석 기능 추가
- [ ] 성능 최적화
- [ ] 사용자 경험 개선

---

## 🚨 비상 복구 절차

### 심각한 문제 발생시

```bash
# 1. 즉시 안전한 버전으로 복귀
git checkout backup/stable-prototype

# 2. 긴급 배포 (필요시)
git checkout main
git merge backup/stable-prototype
git push origin main

# 3. 문제 분석 및 수정
git checkout feature/farmmap-api-integration
# 문제 해결 후 재시작
```

### 파일별 복구

```bash
# 특정 컴포넌트만 문제인 경우
git checkout backup/stable-prototype -- src/pages/Dashboard.tsx
git commit -m "🔥 긴급 복구: Dashboard 컴포넌트 백업 버전으로 복원"
```

---

## 📋 체크리스트

### 커밋 전 필수 확인사항
- [ ] 기존 기능이 정상 동작하는가?
- [ ] 새로운 기능이 기존 기능을 방해하지 않는가?
- [ ] 모크데이터와 실제 API 모두 테스트했는가?
- [ ] 에러가 발생해도 앱이 크래시되지 않는가?
- [ ] TypeScript 타입 오류가 없는가?

### PR 생성 전 확인사항
- [ ] 코드 리뷰 준비 (주요 변경사항 문서화)
- [ ] 테스트 결과 첨부
- [ ] 스크린샷 또는 데모 영상 준비
- [ ] 백워드 호환성 확인

---

## 🎖️ 성공 기준

이 개발 가이드를 따르면:
- ✅ **안전성**: 기존 기능은 절대 손실되지 않음
- ✅ **확장성**: 새로운 기능을 점진적으로 추가 가능
- ✅ **복원력**: 언제든 안전한 버전으로 복귀 가능
- ✅ **신뢰성**: 창업경진대회 출품시 안정적인 데모 보장

**기억하세요**: "완벽한 새 기능보다는 안정적인 기존 기능이 더 중요합니다!" 🛡️