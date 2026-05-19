# BillyJo Skin-CSS 작업 내역

billyjo.kr 사이트의 CSS/JS injection 코드(`inject.js`)를 GitHub + jsDelivr CDN으로 배포하는 repo. 로컬 Windows와 공유 서버(`172.30.1.55`) 양쪽에서 작업 가능.

---

## 빠른 참조

### 접속
- **SSH:** `ssh appsilon@172.30.1.55` (공유 계정 — 비번은 팀에게 문의)
- **Windows 파일 드래그:** `\\172.30.1.55\repos\billyJo\skin-css` ⚠️ **자격증명 사용자명에 `172.30.1.55\` prefix 필수** (`appsilon`만 입력하면 거부됨)
- **GitHub:** https://github.com/billyjo-appsilon/billyjo-inject
- **CDN:** `https://cdn.jsdelivr.net/gh/billyjo-appsilon/billyjo-inject@<COMMIT_HASH>/inject.js`

### 핵심 명령 (서버 기준)
```bash
ssh appsilon@172.30.1.55
cd ~/repos/billyJo/skin-css

# 1) 작업 시작 — 항상 pull 먼저
git pull

# 2) CSS/JS 수정
vim inject.js          # 또는 code, nano
git commit -am "..." && git push        # → CDN(jsDelivr) 자동 갱신

# 3) Admin 패널에도 새 hash 반영 (logscript 갱신)
cd deploy
vim current-logscript.html              # @OLDHASH → @NEWHASH (앞 7자리)
node --env-file=.env deploy-fix.js      # Playwright로 admin 패널 푸시
```

### 이미지 교체 (Windows 드래그)
```
\\172.30.1.55\repos\billyJo\skin-css\images\internet\
```
에 PNG 드롭 → SSH에서 `git add images/ && git commit && git push`

---

## 폴더 구조
```
skin-css/
├── inject.js                # 메인 CSS/JS injection (jsDelivr 서빙)
├── icons/                   # benefit-*.svg
├── images/internet/         # KT/LGU+/SK PNG
├── deploy/
│   ├── deploy-fix.js        # Playwright로 admin 패널 textarea 갱신
│   ├── .env                 # BILLYJO_ADMIN_USER/PASS (gitignored)
│   ├── .env.example         # 템플릿
│   ├── current-logscript.html       # 현재 hash가 박힌 <script> 1줄
│   ├── billyjo-logscript-backup-*.html  # 외부 CDN 분리 전 백업
│   ├── coway_products.json  # 제품명 → 모델명 fallback 매핑
│   └── package.json
├── .gitignore               # deploy/node_modules, deploy/.env
└── WORKLOG.md
```

## 서버 환경 (172.30.1.55, macOS 26.2 ARM64, 공유 계정 `appsilon`)
- Node 24.15.0 via nvm (`~/.nvm`, `.zshrc`에서 auto-load)
- Playwright 1.59.1 + Chromium (캐시 `~/Library/Caches/ms-playwright/`)
- gh CLI v2.92.0 (`~/local/bin/gh`, `billyjo-appsilon` 계정 HTTPS 인증)
- git credential helper: `!gh auth git-credential` (push/pull 자동)
- `.env`는 `deploy/.env` (mode 600, gitignored)
- SMB 공유 켜져 있음 — Windows에서 `\\172.30.1.55\repos`로 접근

## 동시 작업 시 주의
- `inject.js`, `deploy/current-logscript.html`은 단일 파일 집중형 → 충돌 위험 ↑
- 작업 시작 전 `git pull`, 끝나면 즉시 push, 동시 편집은 가능한 피하기
- 충돌 났을 때 `git pull --rebase` → 충돌 라인 수동 해결

---

## 작업 세션

### 2026-05-19 — 공유 서버 작업 환경 구축
**커밋:** `4335e97` (Add deploy/ harness + .gitignore)

**한 일:**
1. 서버 `/Users/appsilon/repos/billyJo/skin-css/`에 repo 클론, tooling 일괄 설치 (Node nvm, Playwright + Chromium, gh CLI)
2. 기존 로컬 `billyjo-rename/deploy-fix.js`를 repo 안 `deploy/`로 이동
3. Admin creds(`billyjo`/`1234`)를 env vars로 분리 — public CDN repo라 하드코딩 X
   - `node --env-file=.env deploy-fix.js`로 실행
4. `.gitignore` 추가 (`deploy/node_modules/`, `deploy/.env`)
5. GitHub 인증 — 서버 SSH 키는 fetch만 가능 → gh CLI HTTPS + credential helper로 전환 (로컬 Windows와 동일한 방식)
6. Windows 11 SMB 접속 문제 해결 — 자격증명 사용자명에 `172.30.1.55\` prefix 필수, 기존 잘못된 캐시 제거 후 재저장
7. 로컬 Windows `billyjo-rename`의 deploy 관련 중복 파일 정리 (50MB 회수)

**다음 작업 시 참고:**
- 로컬 Windows에서는 `C:\Users\CJPARK\billyjo-inject\`이 canonical (예전 `billyjo-rename`은 디버깅 자료만 남음)
- 서버에서는 작업 후 `git push` 하면 jsDelivr CDN이 자동으로 새 commit 서빙 (URL의 `@HASH` 부분 갱신만 하면 됨)
