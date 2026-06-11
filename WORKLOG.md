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

### 2026-06-04 — 주문 페이지 '희망 차량' 라벨 조건부 적용
**커밋:** `5b7267a` (fix) → logscript `@5b7267a` 배포

**문제:** `dh_order/rental` 주문 페이지가 상품 종류와 무관하게 무조건 고객메모 라벨을 "희망 차량"으로 + 차량용 placeholder로 바꿔, **정수기 등 가전 상담/주문에도 차량으로 표시**됨.

**해결:** 주문 상품 셀(`.cart-list td.prod`)의 `.name`/`.brand`로 차량 여부 판별.
- 차량 신호: `brand="차량렌트서비스"`, `name`이 국산차/수입차/캐스퍼 등 (정규식 `VEHICLE_RE`)
- 가전 신호: `brand="코웨이"`/`"LG"` 등 제조사
- 차량 주문 → "희망 차량" + 차량 placeholder (+ 기타국산차→국산차 치환) 유지
- 그 외 → native "고객메모" 유지 + 가전용 안내 placeholder 보강

**검증(라이브):** 국산차 주문 → "희망 차량" ✓ / 정수기(코웨이) 주문 → "고객메모" ✓

### 2026-06-07 — 모바일 헤더 영구 가림(상단바·햄버거 미표기) fail-safe
**커밋:** `300ad5d` (fix) → logscript `@300ad5d` 배포

**문제(counsel 페이지에서 보고):** logscript와 inject.js 양쪽의 FOUC guard
`@media(max-width:768px){header:not(.bj-ready){opacity:0!important}}` 가 폴백 없이
inject.js 실행에만 의존. `bj-ready`는 ≤768 redesign 분기 끝에서만 부여돼:
1. **CDN 장애/차단** 시 inject.js 미로드 → 모바일 전 페이지 헤더 영구 invisible (재현 확인)
2. **>768 로드 후 세로 회전/창 축소** → guard 활성인데 bj-ready 없음 → 헤더 가림
페이지 특정 아님 — logscript_base는 전 페이지 공통이라 전 페이지 동일 노출.

**해결 (4중 fail-safe):**
1. guard CSS에 `animation: bjHdrReveal .25s ease 1.2s forwards` 추가 + `opacity:0`의
   `!important` 제거 (important는 애니메이션보다 우선해 폴백을 죽임) — JS가 아예 안 돌아도
   1.2s 후 원본 헤더 자동 공개. logscript와 inject.js 내장 CSS 양쪽 모두 갱신.
2. `bjHeaderMainInit` 진입 직후 safety setTimeout(1s) — 어떤 경로든 bj-ready 보장
3. 데스크톱(>768) 분기에서도 bj-ready 즉시 부여 — 회전/축소 시나리오 해소
4. logscript script 태그에 `onerror` → fastly.jsdelivr.net 폴백 + 메인 핸들러
   DOMContentLoaded 등록에 readyState 가드 (늦은 로드에도 초기화)

**검증(라이브, headless mobile):** counsel/메인/prod_list — 정상 로드 시 redesign 헤더 ✓,
inject.js 전체 차단 시에도 1.2s 후 원본 헤더+햄버거 표시 ✓, 1024→390 회전 ✓

### 2026-06-11 — PC 가격박스(.fix_price.hide-767) 라벨/가격 좌우상하 정렬 깨짐 fix
**커밋:** _(서버 push 후 hash 기입)_

**문제(PC 상세페이지 보고):** "월 렌탈료 · 제휴카드(카드)할인가" 글씨가 좌우·상하 정렬이
무너져 보임. 원인: inject가 `@media(min-width:768px){.fix_price.hide-767{display:flex}}`로
컨테이너만 flex-row(두 박스 가로 배치)로 만들고 `reorderFixPriceAfterProdName()`로 위치만
옮길 뿐, **각 `.box`(`.tit` 라벨 + `.align-r` 가격) 내부 레이아웃은 빌리조 네이티브 CSS에
의존.** 네이티브 `.box`는 flex-row 부모의 flex 아이템(콘텐츠로 수축, float/블록 맥락 상실)에서
정렬이 의도대로 안 나옴 → 라벨·가격이 흩어짐.

**해결 (PC 미디어쿼리에 box 레이아웃 명시, 타이포·색상은 네이티브 유지):**
- `.fix_price.hide-767` 컨테이너 `gap:18px; align-items/justify-content:center; flex-wrap:wrap`
- `.box { flex:0 1 auto(전체폭 stretch 금지 → 콘텐츠폭); min-width:0; max-width:100%;
  display:flex; flex-direction:row; align-items:center; justify-content:space-between; gap:10px }`
  → 라벨 좌·가격 우, 세로 중앙, 한 쌍이 붙어 다니고 그룹째 중앙 정렬
- `.box .tit { white-space:nowrap; line-height:1.2 }` / `.box .align-r { text-align:right; line-height:1.2 }`
- **`.box[style*="none"]{ display:none }`** — 카드할인 없는 제품의 `.box.org`(카드할인가) inline
  `display:none`을 명시 존중(우리 `.box{display:flex}`가 빈 박스를 강제 노출하지 않도록)

`.fix_price.hide-767`은 PC 전용(≤767 hide)이라 모바일 가격박스(.show-767)·#32 가로넘침과 무관.
`node --check` 통과. **배포 전 라이브 PC 상세 2곳(카드할인 있는/없는 제품)에서 정렬 육안 확인 권장.**
