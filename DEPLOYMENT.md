# 🚀 아그리인덱스 배포 가이드

## 📋 배포 준비 완료 사항

✅ **Git 저장소 초기화 완료**
- 모든 파일이 커밋됨
- .gitignore 설정 완료
- README.md 작성 완료

✅ **빌드 테스트 완료**
- TypeScript 컴파일 성공
- Vite 빌드 성공
- 모든 컴포넌트 정상 작동

## 🔗 GitHub 저장소 생성 및 연결

### 1. GitHub에서 새 저장소 생성
1. https://github.com/new 접속
2. 저장소 이름: `agri-index` 또는 `agricultural-index` 권장
3. 설명: `🌾 아그리인덱스 - 제10회 농림축산식품 공공데이터 활용 창업경진대회 출품작`
4. Public으로 설정 (경진대회 출품작이므로)
5. README, .gitignore, License 체크 해제 (이미 생성됨)
6. **Create repository** 클릭

### 2. 로컬 저장소와 연결
```bash
# GitHub에서 생성한 저장소 URL로 변경 필요
git remote add origin https://github.com/USERNAME/REPOSITORY_NAME.git
git push -u origin main
```

## 🌐 Vercel 배포

### 자동 배포 (권장)
1. https://vercel.com 접속 및 로그인
2. **New Project** 클릭
3. **Import Git Repository** 선택
4. 위에서 생성한 GitHub 저장소 선택
5. 프로젝트 설정:
   - **Framework Preset**: Vite
   - **Root Directory**: `website`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. **Deploy** 클릭

### 수동 배포
```bash
cd website
npm install
npm run build

# Vercel CLI 사용 (옵션)
npx vercel --prod
```

## 📦 배포 설정 파일

### `website/vercel.json`
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

## 🔧 환경 변수 (필요시)

Vercel 대시보드에서 설정:
- `NODE_VERSION`: `18.x`
- `VITE_APP_TITLE`: `아그리인덱스`

## 📋 배포 체크리스트

### 배포 전 확인사항
- [ ] 빌드 성공 확인 (`npm run build`)
- [ ] 로컬 테스트 완료 (`npm run dev`)
- [ ] 모든 컴포넌트 정상 작동
- [ ] 반응형 디자인 확인
- [ ] GitHub 저장소 생성 및 Push

### 배포 후 확인사항
- [ ] 사이트 접속 확인
- [ ] 모든 페이지 정상 로딩
- [ ] 알림 시스템 작동 확인
- [ ] AI 예측 모델 작동 확인
- [ ] 모바일 반응형 확인

## 🌍 예상 배포 URL

- **Vercel**: `https://agri-index.vercel.app`
- **GitHub Pages**: `https://USERNAME.github.io/REPOSITORY_NAME`

## 🔍 성능 최적화

### 번들 크기 최적화
현재 번들 크기가 602KB로 다소 큰 편입니다. 추후 최적화 방안:

```javascript
// vite.config.ts에 추가
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          charts: ['chart.js', 'react-chartjs-2'],
          maps: ['leaflet', 'react-leaflet']
        }
      }
    }
  }
});
```

## 🎯 경진대회 제출용 정보

### 프로젝트 정보
- **서비스명**: 아그리인덱스 (AgriIndex)
- **기술스택**: React.js + TypeScript + Vite + Tailwind CSS
- **주요기능**: ACI 계산, AI 예측, 실시간 알림
- **공공데이터**: 7개 (기상청, 농진청, 농수산식품유통공사 등)

### 제출 자료
- **GitHub 저장소**: [배포 후 URL 입력]
- **데모 사이트**: [Vercel 배포 후 URL 입력]
- **발표자료**: `competition-docs/` 폴더 참조
- **기술문서**: `CLAUDE.md`, `README.md` 참조

---

**배포 완료 후 이 파일의 URL들을 실제 주소로 업데이트하세요!** 🚀