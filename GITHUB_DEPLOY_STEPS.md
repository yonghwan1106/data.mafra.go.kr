# 🚀 GitHub 수동 배포 단계

## 📋 현재 상황
- ✅ Git 저장소 초기화 완료
- ✅ 모든 파일 커밋 완료  
- ✅ 빌드 테스트 성공
- ❌ GitHub CLI 인증 미완료

## 🔗 수동 GitHub 저장소 생성 및 연결

### 1단계: GitHub 웹사이트에서 저장소 생성
1. 브라우저에서 https://github.com/new 접속
2. GitHub 계정으로 로그인 (sanoramyun8@gmail.com)
3. 저장소 설정:
   - **Repository name**: `agri-index`
   - **Description**: `🌾 아그리인덱스 - 제10회 농림축산식품 공공데이터 활용 창업경진대회 출품작`
   - **Visibility**: Public ✅ (경진대회 출품작)
   - **Initialize**: 모든 체크박스 해제 (README, .gitignore, license)
4. **Create repository** 클릭

### 2단계: 로컬 저장소와 연결
저장소 생성 후 나타나는 명령어 중 다음을 실행:

```bash
cd /mnt/c/MYCLAUDE_PROJECT/data.mafra.go.kr

# GitHub 저장소와 연결 (YOUR_USERNAME을 실제 사용자명으로 변경)
git remote add origin https://github.com/sanoramyun8/agri-index.git

# 코드 푸시
git push -u origin main
```

### 3단계: Vercel 배포
1. https://vercel.com 접속
2. GitHub 계정으로 로그인
3. **New Project** → **Import Git Repository**
4. 방금 생성한 `agri-index` 저장소 선택
5. 프로젝트 설정:
   - **Framework Preset**: Vite
   - **Root Directory**: `website` ⬅️ 중요!
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. **Deploy** 클릭

## 📝 준비된 명령어 (복사해서 실행)

```bash
# 저장소 연결
git remote add origin https://github.com/sanoramyun8/agri-index.git

# 메인 브랜치로 푸시
git push -u origin main
```

## 🎯 배포 완료 후 예상 결과

### GitHub 저장소
- **URL**: https://github.com/sanoramyun8/agri-index
- **내용**: 완전한 소스코드, 문서, 경진대회 자료

### Vercel 배포 사이트  
- **URL**: https://agri-index.vercel.app (또는 자동 생성된 URL)
- **기능**: 
  - 🧮 ACI 계산 시스템
  - 🤖 LSTM AI 예측 모델
  - 🔔 실시간 알림 시스템
  - 📊 반응형 대시보드
  - 🗺️ 지도 시각화

## ✅ 배포 확인 체크리스트

### GitHub
- [ ] 저장소 생성 완료
- [ ] 코드 푸시 성공
- [ ] README.md 정상 표시
- [ ] 파일 구조 정상

### Vercel
- [ ] 빌드 성공
- [ ] 사이트 접속 가능
- [ ] 모든 페이지 로딩
- [ ] 모바일 반응형 확인
- [ ] AI 예측 시스템 작동
- [ ] 알림 시스템 작동

---

**💡 tip**: 배포 완료 후 CLAUDE.md 파일에 실제 URL을 업데이트하세요!