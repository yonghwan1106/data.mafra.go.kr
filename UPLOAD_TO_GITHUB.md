# 🚀 GitHub 업로드 방법

## 📋 현재 상황
- ✅ GitHub 저장소 준비됨: https://github.com/yonghwan1106/data.mafra.go.kr.git
- ✅ 로컬 코드 모두 커밋 완료
- ❌ 인증 토큰 없이 푸시 불가

## 🔑 방법 1: Personal Access Token 사용 (권장)

### 1단계: GitHub Personal Access Token 생성
1. GitHub 로그인 후 https://github.com/settings/tokens 접속
2. **Generate new token (classic)** 클릭
3. 설정:
   - **Note**: `AgriIndex Deploy`
   - **Expiration**: 90 days
   - **Scopes**: `repo` 체크 ✅
4. **Generate token** 클릭
5. **토큰 복사 후 안전하게 보관** (다시 볼 수 없음)

### 2단계: 토큰으로 푸시
```bash
cd /mnt/c/MYCLAUDE_PROJECT/data.mafra.go.kr

# 토큰을 비밀번호로 사용 (YOUR_TOKEN을 실제 토큰으로 변경)
git remote set-url origin https://yonghwan1106:YOUR_TOKEN@github.com/yonghwan1106/data.mafra.go.kr.git

# 푸시 실행
git push -u origin main
```

## 📁 방법 2: 웹 업로드 (간단함)

### 1단계: 코드 압축
```bash
cd /mnt/c/MYCLAUDE_PROJECT/data.mafra.go.kr
tar -czf agri-index-source.tar.gz --exclude='.git' --exclude='node_modules' --exclude='website/node_modules' --exclude='website/dist' .
```

### 2단계: GitHub 웹에서 업로드
1. https://github.com/yonghwan1106/data.mafra.go.kr 접속
2. **uploading an existing file** 클릭
3. `agri-index-source.tar.gz` 드래그 앤 드롭
4. Commit message: `🌾 아그리인덱스 v1.2.0 - 완전한 스마트 농업 플랫폼`
5. **Commit changes** 클릭

## 🌐 방법 3: Vercel에서 직접 Import

### GitHub 연동 없이 Vercel 배포
1. https://vercel.com 접속 및 로그인
2. **Add New... → Project**
3. **Import Git Repository** 대신 **Browse All Git Repositories**
4. GitHub 계정 연결 후 `yonghwan1106/data.mafra.go.kr` 선택
5. 설정:
   - **Root Directory**: `website` ⬅️ **매우 중요!**
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. **Deploy** 클릭

## 📋 현재 준비된 파일들

```
├── README.md                     # 프로젝트 소개
├── CLAUDE.md                     # 개발 문서
├── DEPLOYMENT.md                 # 배포 가이드
├── website/                      # 메인 웹 애플리케이션
│   ├── src/                     # React 소스코드
│   ├── public/                  # 정적 파일
│   ├── package.json             # 의존성 정보
│   └── vercel.json              # Vercel 설정
├── competition-docs/            # 경진대회 자료
└── 아그리인덱스_상세_설계서.md   # 핵심 설계 문서
```

## ✅ 권장 방법

**Personal Access Token 방법**이 가장 안전하고 효율적입니다:
1. Token 생성 (1분)
2. URL에 토큰 포함하여 푸시 (30초)
3. Vercel에서 자동 배포 (2분)

**Total: 약 3-4분으로 완전한 배포 완료!**

---

어떤 방법을 선택하시겠습니까?