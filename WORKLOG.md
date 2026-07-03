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

### 2026-06-15 — 할인카드 '정상가'/'제휴카드가' 라벨 분리 시도 → 롤백
**커밋:** `365521b`(feat)+`dbfce11`(deploy)로 배포했다가 → 본 롤백 커밋에서 `@d237f37` 복원.

할인 카드 상단 라벨 `제휴카드가`→`정상가`(취소선 정가)로 바꾸고, 점선 구분 + `제휴카드가` 캡션
(신규 `.bj-pz-cap`)을 추가해 할인전/할인후 가격을 분리 라벨링. 단일가 카드는 숨김 placeholder로
높이 맞춤. route-interception(`deploy/verify-cap.js`)으로 검증 후 배포까지 진행했으나, **Jun이 이전
디자인 선호 → 즉시 롤백**(logscript `@d237f37` 재배포, inject.js 원복). 코드 변경분은 git history
`365521b`에 남아있음(재시도 시 참고).

### 2026-06-15 — 가격카드 2단 재구성 (월 렌탈료 메인 + 제휴카드가)
**커밋:** `8e796d9` (feat) → logscript `@8e796d9` 배포

**요청(롤백 직후 Jun 새 방향):** 가격을 "정상가 / 월 렌탈료 / 제휴카드가" 3단으로, 단 **카드 크기는
안 키우고**. 월 렌탈료를 메인 가격으로, 제휴카드가 있는 제품만 추가 표기.

**핵심 발견:** 사이트 데이터엔 `.fee`(월 렌탈료) + `.fee2`(제휴카드 할인) **2개뿐**, "정상가"는 아예
없음(페이지 전체 정상가/정가 토큰 0). 정상가는 제품당 신규 입력이 필요 → 405개 관리 부담. **Jun이
'정상가 제외, 2단 확정' 선택.**

**구현(`bjpFormat`):**
- 메인: `월 렌탈료`(.fee) 큰 글씨 + 색상 파랑→검정(`#1a1a1e`). (이전엔 제휴카드가가 메인 파랑이었음)
- 추가: `제휴카드가`(.fee2)를 하단 파랑 pill(`.bj-pz-card`, bg `#eaefff`)로. 있는 제품만 표시,
  단일가 카드는 `.bj-pz-card.bj-pz-ph` 숨김 placeholder로 높이 정렬 유지.
- 미사용: 취소선(`.bj-pz-orig`)·절감액 배지(`.bj-pz-save`) → HTML에서 제거(CSS는 잔존, 무해).
- 이름↔구분선 간격 축소(Jun 요청): `.bj-pz` margin-top 10→5 `!important`, padding-top 14→11.

**검증:** route-interception(`deploy/verify-2tier.js`)으로 라이브 prod_list/1-8 주입 캡처. 4개 카드
box 높이 모두 494px 동일(완벽 정렬), 메인 검정·pill 파랑 확인. 목업(`billyjo-rename/price-card-3tier-mockup.html`)
Jun 승인 후 배포.

### 2026-06-15 — 카드 높이 균일화 (이름 줄 수 차이 정렬 깨짐 fix)
**커밋:** `1ec86c8` (fix) → logscript `@1ec86c8` 배포

**Jun 보고:** "가끔씩 길이가 안 맞는 프라이스카드". **측정으로 원인 규명**(`deploy/diag-align.js`): 제휴카드
pill 유무는 **무관**(placeholder 정상, 가격블록 항상 127px). 진짜 원인은 **이름 2줄 제품(~7%)이 1줄 제품보다
카드 20px 큼**(boxH 514 vs 494). 이름은 `min-height:0` 자동높이라 줄 수에 따라 카드가 들쭉날쭉.

**수정(stretch 방식 — 과거 거부된 '이름 아래/이름-가격 사이' 빈공간 회피, 빈공간을 카드 하단으로):**
- `.prod_list` `align-items: flex-start → stretch !important` (행 내 카드 같은 높이)
- `.item[data-bjp]`·`.box` `display:flex; flex-direction:column; flex:1 1 auto`, `.box > a { flex:1 1 auto }`
  → 흰 `.box`가 행 높이를 채우고, 짧은 카드의 여백은 카드 **맨 아래 흰 여백**으로 감(이름-가격은 상단 타이트).
- **주의:** `.box`에 `flex:1`(flex-grow) 빠뜨리면 .item만 늘고 흰 카드는 안 늘어남(첫 시도 실패 → 추가하니 해결).

**검증:** route-interception 데스크탑 `0/15`·모바일 `0/23` 행 높이 불일치(`deploy/verify-stretch.js`,
`shot-stretch.js`). 혼합 높이 행(현대렌탈 1줄+pill / LG 2줄 ×2) 바닥 정렬 캡처 확인 후 배포.

### 2026-06-15 — 카드 높이 전역 통일 (이름 2줄 예약)
**커밋:** `3b732f2` (fix) → logscript `@3b732f2` 배포

**Jun 보고:** "두 프라이스카드 제휴카드가 하단 흰 여백 크기가 다르다". **원인:** stretch는 같은 **행** 안에서만
카드를 맞춤 → 2줄 이름 제품이 섞인 행은 더 크고, 그 행 pill 카드들도 하단 여백이 커짐. 행마다 최대 높이가
달라 행 간 여백 불일치. (측정: 유일한 높이 변동원은 이름 1↔2줄, boxH 494↔514 / 모바일 366↔386. 모델명·`.txt`는
이름 외 변동 없음 — `deploy/diag-variance.js`.)

**수정:** bjpFormat에서 이름 `min-height`를 `0` → **`line-height*2`(2줄 예약)** 인라인 setProperty(important).
(⚠️ CSS로는 안 됨 — bjpFormat이 인라인 important로 min-height를 박기 때문. JS에서 바꿔야 함.) → 모든 카드 단일
높이로 수렴(데스크탑 514·모바일 386, 45개 전부). stretch(1ec86c8)는 안전망으로 유지.

**트레이드오프:** 1줄 이름 제품은 2줄 자리 예약 → 짧은 이름 아래 일정한 빈공간(388cdd3에서 한 번 없앴던 방식).
Jun에게 캡처(`deploy/uniform-desktop.png`) 보여주고 "들쭉날쭉 하단여백 < 일정한 이름하단 공간" 트레이드오프로
**명시 승인받고** 배포. **검증:** route-interception 데스크탑/모바일 boxH 단일 값.

### 2026-06-15 — 모바일 햄버거를 카테고리바 좌측(신혼부부 왼쪽)으로 이동
**커밋:** `f104f6a` (feat) → logscript `@f104f6a` 배포

**Jun 요청:** 모바일 햄버거(☰)를 "신혼부부 패키지" 왼쪽에 위치. (기존: Row1 좌측 = ☰ + 로고 / Row2 = 신혼부부…)

**구조 파악:** 햄버거 `.gnb__hamburger`(`.header__top` 내). 카테고리바 `.category__wrap`(flex, 모바일 `overflow-x:auto`
가로스크롤)의 첫 항목이 inject 주입 `.bj-newlywed-cat`(💍 신혼부부). 햄버거 아이콘은 `body .gnb__hamburger::before`
box-shadow 3줄로 **CSS 렌더**(img는 `> * display:none`) → 노드를 옮겨도 아이콘·클릭핸들러 보존됨.

**구현:** `injectNewlywedInCategoryBar.tryInject`에 `moveHamburgerToCatBar(wrap)` 추가 — `.gnb__hamburger` 노드를
`.category__wrap` 최좌측(신혼부부 앞)으로 이동(멱등: 이미 firstChild면 skip). CSS(`#bj-mobile-cat-style` 미디어블록):
`.category__wrap .gnb__hamburger{position:sticky;left:0;z-index:3;background:#fff;box-shadow:-18px 0 0 #fff}` — 가로
스크롤 시 좌측 고정 + 좌측 16px 패딩에 카테고리 글자 비침을 흰 box-shadow로 가림. Row1은 자동으로 로고+아이콘만 남음.

**검증(route-interception):** 모바일 — 햄버거 카테고리바 최좌측·sticky·스크롤 고정·**클릭 시 슬라이드 메뉴 정상**(노드
이동에도 핸들러 보존), Row1 로고좌측. 데스크탑 — `.gnb__hamburger` display:none 유지(영향 없음). 스크립트: `deploy/verify-ham.js`.

### 2026-06-18 — 상단 검색창 작동 복구 + 한글 동의어(티비→TV)

**커밋:** `242fe77` (fix) → logscript `@242fe77` 배포 (`ffeb17b`)

**Jun 신고:** billyjo.kr에서 "얼음", "티비" 등으로 검색해도 안 됨.

**진단(라이브 재현):**
- 검색 백엔드는 정상 — GET `/html/dh/search_result?search_value=얼음` 직접 진입 시 159건 정상 반환.
- **진짜 원인 = 플랫폼 테마 마크업 버그:** 데스크탑 헤더 검색창 `.search__wrap`(안에 `<input id="top_search" name="search_value">` + `<button type="submit">` 돋보기)이 **어떤 `<form>`에도 들어있지 않음.** 제출할 폼이 없어 Enter·버튼 클릭 모두 무반응. **inject 꺼도 동일**(네이티브 `input.form === null` 확인) → 우리 코드 탓 아님.
- 별개로 "티비"/"텔레비전"은 제품명이 영문 "TV"로 저장돼 0건 (TV는 175건).

**수정(`fixTopSearch` IIFE, 검색 해시태그 블록 직후):** document 위임 리스너로 `#top_search`의 Enter + `.search__wrap button` 클릭을 가로채 `location.href = '/html/dh/search_result?search_value=' + encodeURIComponent(normalize(value))`. `normalize`는 동의어 매핑(티비/텔레비전/티브이→TV). 위임 방식이라 데스크탑 헤더 재배치로 검색창이 이동해도 안전. `#top_search` 한정이라 모바일 `mobile_search()` 팝업·`msch` 폼은 미간섭.

**검증:** `deploy/verify-search.js`(route-interception) + `deploy/verify-search-live.js`(실 CDN, liveHash=242fe77 확인). 얼음→159건, 티비→TV 카테고리(6-678) 175개, 정수기 버튼클릭→카테고리 이동. JS 에러 없음.

### 2026-06-18 — 검색 결과 페이지 키워드 바 주황 → 파랑

**커밋:** `b1fec0e` (style) → logscript `@b1fec0e` 배포

**Jun 요청:** 검색 결과 페이지 상단 주황색 키워드/돋보기를 파랑으로.

**대상 = `.search_field`(검색 결과 전용 바, 헤더 `.search__wrap`과 별개):**
- `<input id="prod_search" value="얼음">` 키워드 텍스트 — `color: rgb(221,81,25)`(#dd5119 주황)
- `<input type="image" src="/image/sub/btn_search.png" class="btn">` 돋보기 — 주황 PNG
- `.search_field` 하단 언더라인 — `border-bottom-color: #dd5119`

**수정(`blueSearchField` IIFE, `fixTopSearch` 직후 style 주입):** `.search_field{border-bottom-color:#0838f8}` + `.search_field input#prod_search{color:#0838f8}` + 돋보기 PNG는 기존 mo_filter용 blue 필터(`brightness(0) ... hue-rotate(228deg) ...`) 재사용으로 #0838f8 틴트. 기존 CSS의 "Search page colors" 추측 셀렉터(.search__keyword 등)는 실제 구조와 안 맞아 미적용이었음 → 실 셀렉터로 대체.

**검증:** `deploy/verify-field-blue.js`(route-interception) + `deploy/verify-field-live.js`(실 CDN, liveHash=b1fec0e). border/kwColor 모두 rgb(8,56,248), 돋보기 필터 적용, 캡처로 파랑 렌더 확인.

### 2026-07-01 — 메인 섹션 순서 재배치 + 시안(Figma 9:89) 외 섹션 숨김

**커밋:** `e8705ad` (feat home) → logscript `@e8705ad` 배포 (`2469f8e`). origin 최신(🎯 1:1 맞춤 패키지 메뉴 등) 위로 rebase 후 배포.

**Jun 요청:** 리디자인 시안(9:89) 순서대로 메인 섹션 재배치 + 시안에 없는 섹션 숨김. 전체 리디자인의 1단계(순서만·안전·되돌리기 쉬움).

**대상:** `#bj-v5-injected`(injectMainPageV5가 preview-detail-page-v5.html을 `.zone`으로 감싸 주입) 하위 zone들. Figma 보드 77:394의 "원본" = 이 v5 라이브.

**수정(`reorderHome(pageEl)`, `wrapZones` 직후 호출):** `#bj-v5-injected`를 flex column화 후 zone별 CSS `order` 지정(DOM 이동 없음, `data-bj-reordered` 가드). 매칭은 섹션 제목 텍스트 기준(자식 인덱스 비의존).
- 순서: 히어로 → 후기 → 신뢰도(부담없이 시작) → 서비스(본사보다 빌리조) → 큐레이션 → 신청방법 → 혜택(제휴카드) → 가격비교(같은 가격) → FAQ
- 숨김(시안에 없음): 이사·신혼도 안심 / 광고 전화 없습니다(개인정보로 통합) / 위약금 숨기지 않습니다(중도해지) / 제휴카드 추가 혜택

**검증:** 배포 전 라이브 콘텐츠 매칭 오작동 0건(`scratchpad/validate.js`). 배포 후 billyjo.kr 재로드 → `data-bj-reordered=1`, 시각 순서·숨김 3섹션·렌더 정상 캡처 확인.

**롤백:** logscript 핀을 `@62bbd4d`로 되돌려 재배포(`deploy/current-logscript.html` → `node --env-file=.env deploy-fix.js`). 또는 inject.js `reorderHome` 함수+호출 1줄 제거.

**남은 것(시안 대비, 순서 외):** 헤더 검색바 스타일·"인기 카테고리" 라벨 삭제·각 섹션 콘텐츠 고도화(신뢰도 카드/서비스 2×2 01~04/큐레이션 3STEP/가격비교 사은품3중택1)·상품 그리드·푸터 개편.

### 2026-07-02 — 메인 카테고리 섹션 제목 텍스트 숨김
**커밋:** `333f5da` → logscript `@333f5da` 배포 (`d93f91c`)

**요청(Jun):** 카테고리 아이콘 위 제목 텍스트만 숨김(아이콘은 유지).

**대상(native `.new-mc`):** PC `p.new-mc__tit`("고객님들이 많이 찾는 주요 카테고리") / 모바일 `p.m_tit`("인기 카테고리") — 반응형 2종.

**수정:** inject.js 모듈A 상단(css 주입 직후) `hideCategoryTitle` IIFE로 `.new-mc .new-mc__tit, .new-mc .m_tit{display:none!important}` 주입.

**검증:** 라이브 PC(1280)·모바일(440) 양쪽 두 제목 HIDDEN, 카테고리 링크 16개 유지, 캡처로 아이콘만 렌더 확인.

**롤백:** logscript `@1af0cb6` 재배포, 또는 `hideCategoryTitle` IIFE 제거.

### 2026-07-02 — 메인/중간 배너 폭을 콘텐츠(아이콘) 폭 1280에 맞춰 축소 (비율 유지)
**커밋:** `5cdd7ed` → logscript `@5cdd7ed` 배포 (`561aca4`)

**요청(Jun):** 메인 히어로 + 중간 배너를 카테고리 아이콘 열 폭에 맞춰 가운데로 줄이기, 비율 유지.

**측정:** 콘텐츠 컨테이너 `.new-mc .wide-inner`=1280(뷰포트1920서 320~1600), 아이콘 양끝 340~1580 → 타깃 1280 가운데.

**방식(`fitBanners` IIFE, `@media(min-width:1280px)`):**
- 메인 `.new-mv_wrap`(slick): `max-width:1280;margin:auto`+`img{width:100%;height:auto}` + `resize` 발사(100/600/1500/3000ms+load)로 slick 슬라이드 재계산 → 1920×576→**1280×384**.
- 중간 `.new-mb`(고정 1680 슬라이드): slick이 안 줄여서 `img{width:1280px}` 강제 + 컨테이너 height auto + overflow hidden → 1680×265→**1280×202**.
- ≥1280 데스크톱만(모바일 오버플로 방지).

**검증:** 라이브 배포본 1920서 hero 1280×384 / mid 1280×202, 둘 다 좌측 320(아이콘 정렬), 캡처로 크롭 없이 축소 확인.

**롤백:** logscript `@333f5da` 재배포, 또는 `fitBanners` IIFE 제거.

### 2026-07-02 — 메인 상단 세로 여백 축소 (배너/제목 정리 후)
**커밋:** `4825495` → logscript `@4825495` 배포 (`8e20dd6`)

**요청(Jun):** 배너 축소 + 카테고리 제목 숨김으로 히어로~아이콘~다음 섹션 사이 여백이 과함 → 디자인적으로 축소.

**측정(전):** 히어로→아이콘 170px(`.new-mc` pT95 + `.new-mc__list` mT75), 아이콘→다음 섹션 245px(`.new-mc` pB130 + `.m_outer` pT75 + 여백).

**수정(`tightenMainSpacing` IIFE, `@media(min-width:769px)`):** `.new-mc{padding:40px/48px}` `.new-mc__list{margin-top:12px}` `.m_outer{padding-top:24px}`.

**검증(후, 라이브):** 히어로→아이콘 52px, 아이콘→다음 섹션 112px. 균형 확인.

**롤백:** logscript `@5cdd7ed` 재배포, 또는 `tightenMainSpacing` IIFE 제거.

### 2026-07-02 — 히어로 배너 화살표·닷 네비게이션 축소
**커밋:** `be29d9e` → logscript `@be29d9e` 배포 (`b28c5a5`)

**요청(Jun):** 히어로 배너 화살표(‹›)와 하단 닷(대시 바)이 큼 → 축소.

**대상:** 화살표 `.new-mv_wrap .arrow__prev/next` 53x95(배경이미지 cover), 닷 `.slick-dots li button` 95x3(대시 7개).

**수정(`shrinkHeroNav` IIFE, `@media(min-width:769px)`):** 화살표 32x56, 닷 대시 36px.

**검증(라이브):** arrow 32x56, dotBtn 36x3 확인.

**롤백:** logscript `@4825495` 재배포, 또는 `shrinkHeroNav` IIFE 제거.

**보류(Jun 확인 필요):** "중간배너를 메인 배너 스타일에 맞게 리디자인" — 크롬(화살표/닷/모서리) CSS 매칭 vs 배너 그래픽 자체 교체(신규 이미지 에셋 필요) 범위 확인 후 진행.

### 2026-07-02 — 중간 배너 화살표를 메인 배너 스타일로 통일
**커밋:** `d09b8f2` → logscript `@d09b8f2` 배포 (`4728acf`)

**요청(Jun, "CSS 크롬만 맞춤" 선택):** 중간 배너(.new-mb)를 메인 배너 스타일에 맞게. 배너 이미지는 유지, 화살표만 통일.

**대상:** 중간 화살표 `.new-mb .arrow__prev/next` = 흰 원형 버튼(new-mb_prev/next.png), `.arrows` 컨테이너 안에서 오른쪽에 뭉쳐 있었음. 히어로는 얇은 쉐브론(new-mv_left/right.png) 양끝.

**수정(`matchMidBannerNav` IIFE, `@media(min-width:769px)`):** `.new-mb{position:relative}` + `.new-mb .arrows{position:static}`(offset parent 해제) → 화살표를 `.new-mb` 기준 절대배치. 배경이미지를 `new-mv_left/right.png`로 교체, 32x56, 좌우 20px·세로중앙(top:50%/margin-top:-28).

**검증:** 라이브 데스크톱서 prev x340~372(좌), next 1548~1580(우), 세로중앙 101/202 확인. 흰 원형 제거·쉐브론 렌더 확인.

**롤백:** logscript `@be29d9e` 재배포, 또는 `matchMidBannerNav` IIFE 제거.

### 2026-07-02 — 프라이스 카드(bj-pz) 디자인 전체 페이지 적용
**커밋:** `4970b5a` → logscript `@4970b5a` 배포 (`929c7bf`)

**요청(Jun):** Image #6 프라이스 카드 디자인(최저 회색칩 / 제휴💳 파란칩 / -N% 핑크배지 / 파란가격)을 전체 카드에 적용.

**원인:** bjpFormat 블록이 `if(location.pathname.indexOf('prod_list')!==-1)`로 /prod_list/ URL에서만 실행 → 메인페이지의 `.prod_list .item` 144개엔 bj-pz 미적용(0개)이었음. native .fee 숨김 CSS는 전역이라 로직만 안 돌던 것.

**수정:** 해당 가드를 `if(true)`로 변경(전체 페이지). bjpRun은 `.prod_list .item`만 대상이라 카드 없는 페이지는 no-op → 안전.

**검증:** 배포 전 메인페이지에서 로직 재현 → 144개 정상 렌더 캡처. 배포 후 라이브 메인 144/144 bj-pz 적용·css present 확인.

**롤백:** logscript `@d09b8f2` 재배포, 또는 가드를 원복.

**참고:** Image #6의 BEST 배지·후기 별점(★4.9 후기 N)은 별도 모듈(best-pill/bj-rv) 소관 — 프라이스 디자인과 별개. 메인 카드에도 필요하면 추가 작업.

### 2026-07-02 — 헤더 GNB 카테고리 ↔ 우측 고객센터/장바구니 겹침 수정
**커밋:** `0858184` → logscript `@0858184` 배포 (`2e8e934`)

**요청(Jun):** 헤더 메뉴 겹침("모바일"이 "고객센터" 밑에 깔려 글자 뭉개짐).

**원인:** GNB 카테고리 10개(.new-gnb, flex-start) 폭 916px가 `.bj-inj-left` 공간을 넘쳐 우측 `.gnb__right`(고객센터/장바구니, left 1236)와 73px 겹침. 항목 간격은 `.gnb__menu margin-right:25px`.

**수정(`fixGnbOverlap` IIFE):** `@media(min-width:1024px){.new-gnb .gnb__menu{margin-right:10px}}` → GNB 폭 916→~766, right 1309→1159. 카테고리 하나도 안 숨기고 간격만 축소.

**검증:** 1920/1600/1440 모두 overlap 없음. 라이브 gnbRight 1159 < rightCtrlLeft 1236.

**롤백:** logscript `@4970b5a` 재배포, 또는 `fixGnbOverlap` IIFE 제거.

### 2026-07-02 — 브릿지 캡션 신규 추가 (순서: 브릿지→후기→신뢰도)
**커밋:** `32bd1b4` → logscript `@32bd1b4` 배포 (`f024db9`)

**요청(Jun):** 시안(Image #7)처럼 순서 변경 + "오래 사용할 가전인데,~" 캡션 신규 추가.

**대상:** 시안 9:89의 🟦 신규 브릿지 캡션. 라이브엔 없던 섹션.

**수정(reorderHome 내):** ① ORDER 리넘버링(후기 2→3, 부담없이 3→4, 본사보다 4→5, 컨설팅 5→6, 렌탈신청 6→7) → order 2 자리 확보. ② `.bj-bridge` 요소를 #bj-v5-injected에 신규 생성(order:2, 히어로 다음·후기 위): "❝ 오래 사용할 가전인데,(검정) / 신중하게 비교하고 골라야 하지 않을까요?(파랑) ❞". `bj-bridge-css` 스타일 주입(데스크톱 23px/모바일 18px).

**검증:** 라이브 순서 = 히어로 → 브릿지 → 후기 → 신뢰도 → 서비스. 캡션 렌더·❝❞ 확인.

**롤백:** logscript `@0858184` 재배포, 또는 reorderHome의 브릿지 생성 블록+ORDER 원복.

### 2026-07-02 — 브릿지 확대 + 신뢰카드 '믿고 맡길 수 있는 빌리조' 교체·후기 뒤 배치
**커밋:** `b54da36` → logscript `@b54da36` 배포 (`7ea6f9a`)

**요청(Jun):** ① 브릿지 "오래 사용할 가전인데" 텍스트 확대 ② "설치 케어는 본사에서" 카드를 Image #8("믿고 맡길 수 있는 빌리조")대로 교체 ③ 후기 다음에 배치.

**대상:** `.hero`(#bj-v5-injected 직접 자식, order 1) = 트러스트 카드. 구조: span.badge-hero(eyebrow)/h1/p/div.trust-chips(3칩 동일).

**수정(reorderHome):**
- 브릿지: bj-bridge-css 폰트 23→28(모바일 18→21), 인용부호 34→42.
- 트러스트: h1 → "믿고 맡길 수 있는 <span class=yellow>빌리조</span>", p → "막막했던 설치부터 관리까지 부담 Zero!<br>빌리조는 전 상품 정품 보장하는 직계약 렌탈 플랫폼입니다.", .badge-hero display:none, order 1→4(후기 다음). 3칩은 그대로.
- ORDER 리넘버링: 부담없이 4→5, 본사보다 5→6, 컨설팅 6→7, 신청방법 7→8, 같은가격 8→9, 자주묻는 9→10.

**검증:** 라이브 순서 = 히어로 → 브릿지 → 후기 → 믿고맡길 → 부담없이 → 서비스. 브릿지 28px, 트러스트 heading "믿고 맡길 수 있는 빌리조" 확인.

**롤백:** logscript `@32bd1b4` 재배포.

### 2026-07-02 — 브릿지 캡션 배경 불일치 수정
**커밋:** `e0f95ba` → logscript `@e0f95ba` 배포 (`d49e673`)

**요청(Jun):** 브릿지 "오래 사용할 가전인데" 영역 배경 mismatch(흰 박스가 주변 회색과 안 맞음).

**원인:** `.bj-bridge{background:#fff}`인데 상위 `.m_outer` 배경이 회색 `#f7f7f7`(247,247,247) → 흰 사각형이 튐.

**수정:** `.bj-bridge` background `#fff`→`transparent` (주변 회색과 블렌드).

**검증:** 라이브 브릿지 bg rgba(0,0,0,0), .m_outer rgb(247,247,247) — 균일하게 블렌드 확인.

**롤백:** logscript `@b54da36` 재배포.

### 2026-07-02 — 섹션 배경 흰색/회색 통일 (하늘색 제거)
**커밋:** `26b9e2f` → logscript `@26b9e2f` 배포 (`ae6e110`)

**요청(Jun):** 배경이 흰색/회색/하늘색 3가지 → 흰색·회색으로 통일.

**원인:** v5 zone이 zone-white(#fff)/zone-sky(#ECF3FF 하늘색) 교차 + 재배치로 교차 순서도 엉킴(흰-하늘-흰-흰-흰-하늘-하늘).

**수정(reorderHome 끝):** #bj-v5-injected의 `.zone`+`.bj-bridge`를 시각 순서(order)대로 정렬 후 회색(#f7f7f7)/흰색(#fff) 교차 배정(inline bg-color !important). `.hero`(파란 트러스트 카드)는 제외(그라데이션 유지). ⚠️ 초기 시도서 background-image:none을 걸어 .hero 파랑이 날아갔던 것 → .hero 완전 제외로 수정.

**검증:** 라이브 anySky=false, trustBlue=true, 순서 회/흰/파랑/회/흰/회/흰/회/흰 교차 확인.

**롤백:** logscript `@e0f95ba` 재배포.

### 2026-07-02 — P1 디자인 정돈 (아정당 레퍼런스): 섹션 pill 블루 남용 완화 + 여백
**커밋:** `4c0e055` → logscript `@4c0e055` 배포 (`b0619c9`)

**배경(Jun 요청):** frontend-design 스킬 + 아정당(ajd.co.kr) 레퍼런스로 디자인 체크 → P1만 적용. 큰 틀 유지.

**아정당 DNA:** 블루는 액센트로만, 넉넉한 여백, 섹션 헤더=굵은 텍스트(pill 없음), 흰/회색 밴드.

**진단:** 모든 섹션 헤더가 동일 솔리드 블루 `span.pill` 7개 반복 → "파랑 남용/템플릿" 인상. (frontend-design: 과감함은 한 곳에만.)

**수정(reorderHome, bj-refine-css):**
- P1①: `#bj-v5-injected .pill{background:transparent;color:#0838f8;padding:0;font-size:15px;font-weight:800}` → 솔리드 블록 제거, 절제된 블루 eyebrow 텍스트로. 파랑은 트러스트카드·CTA·03결과카드·가격에 집중.
- P1②: `#bj-v5-injected{row-gap:28px}` 섹션 여백 확대.

**검증:** 라이브 anySolidBluePill=false, rowGap=28px. 미리보기(p1_0/1) 정돈감 확인.

**롤백:** logscript `@26b9e2f` 재배포, 또는 bj-refine-css/rowGap 제거.

**보류(P2/P3, Jun 미요청):** 이모지→아이콘, "OO만원" 플레이스홀더, 카드 스타일 토큰 통일, 히어로 카피 구체화, 타입 스케일 3단 통일.

### 2026-07-02 — "빌리조" 텍스트를 한글 워드마크 로고 이미지로 치환
**커밋:** `b71f5e5` → logscript `@b71f5e5` 배포 (`bce61ee`)

**요청(Jun, 모바일):** 본문에 "빌리조"로 텍스트 표기된 부분들을 한글 로고로.

**발견:** 한글 로고 에셋 `https://admin2.billyjo.co.kr/logo/billyjo-ko.png`(아사이드에서 사용). "빌리조" 텍스트는 `.bj-logo` 클래스(파란 텍스트, 이름 그대로 로고 자리) 5곳: 빌리조는 본사직계약(.bj-logo.large 32px), 실시간혜택비교 빌리조 카드헤딩, vs-mini 라벨, zone-white desc 등.

**수정(bj-refine-css에 추가):** `.bj-logo{display:inline-block;height:1.05em;width:3.3em;background:url(billyjo-ko.png) contain;color:transparent;text-indent:-9999px}` → 텍스트 숨기고 로고 이미지 인라인. em 기반이라 폰트 크기별 스케일. 전 뷰포트.

**미변경(주의):** 비교카드 흰색 "빌리조" 버튼(파란 배경 위 흰텍스트 — 파란 로고 넣으면 안 보임, .bj-logo 아님), "빌리조만의 X" 합성어 헤딩, 트러스트카드 노랑 "빌리조"(span.yellow, 의도적 강조). 필요시 별도 처리.

**검증:** 라이브 모바일 .bj-logo.large bg=billyjo-ko.png, 106x34, 텍스트 숨김. 로고 렌더 확인.

**롤백:** logscript `@4c0e055` 재배포, 또는 bj-refine-css의 .bj-logo 규칙 제거.

### 2026-07-02 — .bj-logo 로고를 빌리조 투명 워드마크로 교체
**커밋:** 이미지 `25e1555`(images/billyjo-wordmark.png) + inject.js `88b8063` → logscript `@88b8063` 배포 (`24cadd2`)

**요청(Jun):** 아까 .bj-logo로 교체한 로고를 준 파일(투명 PNG)로 교체. (기존 admin2 billyjo-ko.png는 배경 있음/톤 안맞음)

**작업:**
- `C:\Users\CJPARK\Desktop\소재\빌리조\파비콘\Logo_FInal.png`(158x80, RGBA 투명, 비율1.98, 화살표 포함) → 레포 `images/billyjo-wordmark.png`로 복사·커밋(25e1555)·푸시 → jsDelivr 서빙.
- `.bj-logo` background-image를 `@25e1555/images/billyjo-wordmark.png`로, height 1.5em/width 2.97em(비율 1.98)로 조정.

**검증:** 라이브 모바일 .bj-logo.large bg=billyjo-wordmark.png, 회색 배경에 투명 블렌드 렌더 확인.

**롤백:** logscript `@b71f5e5` 재배포(admin2 로고로 복귀).

### 2026-07-02 — 브릿지 캡션 텍스트 확대
**커밋:** `8c1cb5a` → logscript `@8c1cb5a` 배포 (`06d2a3e`)

**요청(Jun):** "오래 사용할 가전인데," 텍스트 더 키우기.

**수정(bj-bridge-css):** `.bj-bridge p` 28→34px(모바일 21→24px), 인용부호 42→48/30→34. `word-break:keep-all` 추가 — 모바일서 "않을까요?"가 단어 중간에 잘리던 것 방지(단어 단위 줄바꿈).

**검증:** 라이브 PC 34px / 모바일 24px, keep-all 확인.

**롤백:** logscript `@88b8063` 재배포.

### 2026-07-02 — 브릿지 캡션 모바일만 확대 전(21px)으로 복귀
**커밋:** `1795a17` → logscript `@1795a17` 배포 (`dd374b2`)
**요청(Jun):** PC는 좋으니 유지, 모바일만 키우기 전으로.
**수정:** `@media(max-width:768px) .bj-bridge p` 24→21px, 인용부호 34→30px. PC 34px 유지. keep-all 유지.
**검증:** 라이브 PC 34px / 모바일 21px.
**롤백:** logscript `@8c1cb5a` 재배포.

### 2026-07-02 — 모바일 신뢰도 구간 품질 정돈 (브랜드 로고 그리드 콤팩트)
**커밋:** `581f3be` → logscript `@581f3be` 배포 (`65fbe2a`)

**요청(Jun, Image #12):** 신뢰도·브랜드·서비스·큐레이션 구간 "카피/구조 유지 + 디자인 제대로". 선택: 구간 전체 모바일 품질 정돈.

**진단:** 이 구간 최대 모바일 품질 이슈 = 브랜드 로고 그리드(`.brand-grid` 3열×16개, `.brand-cell` 106×79 → 세로 521px로 과대). 서비스 diff-card·큐레이션 STEP 카드는 이미 정돈됨.

**수정(bj-refine-css @media≤768):** `.brand-cell{height:52px}`(79→52), 로고 img `max-height:26px;object-fit:contain` → 그리드 521→362px, 로고 선명 유지. 카피·구조 그대로.

**검증:** 라이브 모바일 gridH=362, cellH=52.

**롤백:** logscript `@1795a17` 재배포.

**참고:** 서비스/큐레이션 카드는 현 상태 양호 판단해 미변경. 특정 부분 추가 폴리시는 Jun 지정 시.

### 2026-07-02 — 브랜드 로고 그리드 → 가로 마퀴 (시안 디자인 맞춤)
**커밋:** `d32f96e` → logscript `@d32f96e` 배포 (`2242b4a`)

**요청(Jun):** 신뢰도/서비스/큐레이션 구간을 내 시안(billyjo-redesign-mockup.html) 디자인으로 맞춤 + **카피는 그대로**. (앞서 "구간 정돈"을 그리드 축소만 해서 미흡 → 재작업)

**핵심 차이:** 시안=브랜드 가로 마퀴 vs 라이브=16개 로고 그리드(모바일 362px 과대).

**수정(reorderHome JS + bj-refine-css):** `.brand-grid` 셀 16개를 `.bj-brand-track`으로 감싸고 복제(32) → CSS 마퀴(flex, width max-content, translateX -50% 무한, 양끝 mask 페이드, hover 정지). 그리드 362→80px 한 줄. 카피(브랜드 16개) 유지. 이전 compact CSS 대체.

**검증:** 라이브 모바일 trackCells=32, gridH=80.

**롤백:** logscript `@581f3be` 재배포.

**참고:** 서비스(diff-card)·큐레이션 STEP은 시안과 이미 유사해 유지. 추가 맞춤 필요시 지정.

---

### 2026-07-02 — 신뢰도 섹션 요소 완성 ("본사 동일 제품에" 헤딩 + 2번째 보장 바)
**커밋:** `195c998` → logscript `@195c998` 배포

**요청(Jun, Image #14):** 신뢰도 섹션 재점검, 시안의 모든 요소가 다 있도록 + 디자인 신경. 라이브는 시안 대비 (1) 마퀴~보장바 사이 "본사 동일 제품에" 헤딩, (2) 2번째 보장 바("설치비·등록비 0원 보장")가 **빠져 있었음**(마퀴 전환으로 섹션 축소된 게 아니라 원래 v5에 없던 시안 요소).

**섹션 구조(라이브):** `p.lead`(20개+ 직계약) → `.brand-grid`(마퀴) → `.highlight-bar`(100% 정품, shield). 자식 3개.

**수정(reorderHome JS + bj-refine-css):**
- 헤딩 `p.bj-trust-sub` 신규 삽입(마퀴↔바1): "본사 동일 제품에 **설치비·등록비 0원**으로 부담없이" (0원 blue #0838f8, center, keep-all, mo 20px/pc 24px).
- 바1(`.highlight-bar`) `cloneNode` → 바2로 리텍스트: `.t`="설치비 · 등록비 0원 보장", `.d`="설치·등록비 0원 + 최대 72개월 할부로 부담없는 시작", 아이콘 `#i-shield`→`#i-coins`. `data-bj-bar2` + margin-top 10px.
- 가드: `data-bj-bars`로 1회만.

**검증:** 라이브 모바일 `sub:true, bar2:true, bars:2`. PC/모바일 스크린샷 Image #14 일치.

**롤백:** logscript `@d32f96e` 재배포.

---

### 2026-07-02 — 신뢰도 헤딩 시안 카피 교체 + 전 섹션 eyebrow(.pill) 제거
**커밋:** `d37c796` → logscript `@d37c796` 배포

**요청(Jun):** ①(카피 방향 정정) "카피 그대로"="**시안 카피대로** 맞춰라"는 뜻이었음 → 신뢰도 마퀴 위 헤딩을 시안 카피로. ②"부담없이 시작하세요, 빌리조만의 컨설팅 같은 각 섹션의 **작은 글씨(eyebrow) 다 지우고 간격 맞춰**". (후기/FAQ 제목까지 전부 제거 확정 — AskUserQuestion)

**수정(reorderHome JS + bj-refine-css):**
- 신뢰도 `.lead`("20개+ 본사 & 파트너사 직계약 / 중간 대리점 없이…") → 시안 카피 "**20+개 가전브랜드 본사·파트너사**와 직계약하고 배송까지!"로 교체 + `bj-trust-sub` 클래스 부여해 아래 "본사 동일 제품에" 헤딩과 스타일 통일(대칭).
- 각 섹션 상단 파란 eyebrow `.pill`/`.pill-wrap` 전부 `display:none`(기존 P1의 `.pill` eyebrow 스타일 룰 대체). 11개 제거(부담없이시작/본사보다/같은가격/컨설팅/후기/FAQ/신청방법 등). `display:none`이라 여백 자동 수축 → 간격 별도 조정 불필요.

**검증:** 라이브 `visiblePills:0`, 트러스트 헤딩 시안 카피 반영, 후기·FAQ 여백 자연스러움. 4개 큰제목 섹션 스크린샷 확인.

**롤백:** logscript `@195c998` 재배포.

**주의:** 후기/FAQ는 eyebrow가 유일 제목이라 제거 후 섹션 라벨 없음(Jun 승인). 시안(mockup)엔 원래 .pill eyebrow 유지돼 있으나 Jun 라이브 지시로 제거.

### 2026-07-03 — 신뢰도 두 보장 바 1행 2열 배치 + eyebrow/시안카피 재배포(CDN 워밍업)
**커밋:** `bd98090` → logscript `@bd98090` 배포

**요청(Jun, Image #15):** 신뢰도 두 파란 박스(100% 정품 / 설치비·등록비 0원)를 세로 스택 → **1행 2열**로.

**수정(reorderHome JS + bj-refine-css):** 두 `.highlight-bar`를 `.bj-bars-row` 플렉스 래퍼로 감쌈. CSS: `.bj-bars-row{display:flex;gap:14px;align-items:stretch}`, `.highlight-bar{flex:1 1 0;min-width:0;margin:0}`, `@media(max-width:767px){flex-direction:column;gap:10px}` — **PC 2열 나란히(각 463px), 모바일 세로 스택**(390px서 2열은 텍스트 뭉개짐 회피).

**+ 롤백됐던 d37c796 변경 재포함:** HEAD에 있던 eyebrow(.pill) 제거 + 신뢰도 `.lead` 시안 카피("20+개 가전브랜드…")가 이 배포에 함께 반영됨. **이번엔 push 직후 CDN 워밍업**(jsDelivr+fastly URL curl → 둘 다 HTTP 200 + `bj-bars-row` 내용 확인) 후 logscript 갱신 → 전파 지연 재발 방지.

**검증:** 라이브(캐시버스트) hash=bd98090, barsRow=true, barWidths=[463,463], sameRow=true(동일 top), visiblePills=0. PC 스크린샷 2열 확인.

**롤백:** logscript `@195c998` 재배포(2열·eyebrow 제거 전 안전 버전).

---

**⚠️ (이전) 롤백됨(2026-07-02):** d37c796 배포 직후 Jun 환경에서 사이트가 원본(주입 실패)으로 표시 — 추가요소 안 보이고 숨긴 섹션 다시 노출. 원인 추정 = jsDelivr 신규 해시(d37c796) 전파 지연으로 일부 엣지 404 → 스크립트 로드 실패. (헤드리스 Playwright·curl에선 d37c796 정상 200·전 요소 렌더 확인, 콘솔 에러 없음.) Jun 강력새로고침에도 미표시 → 요청대로 **logscript `@195c998`로 롤백 배포**(정상 확인됨: bars=2, marquee, trustSub). d37c796 코드(eyebrow 제거 + 신뢰도 시안 카피)는 HEAD에 유지, **CDN 완전 전파 후 재배포 예정**. 재배포 시 push 직후 CDN URL 워밍업(200 확인) 후 logscript 갱신 순서 권장.
