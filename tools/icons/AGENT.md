# bjicon — 에이전트용 아이콘 파이프라인

빌리조 UI에 쓸 애니메이션 아이콘을 **에이전트가 사람 개입 없이** 고르고, 빌리조 테마를 입히고,
코드에 넣기 위한 도구. 소스는 Lordicon(PRO 구독), 산출물은 Lottie JSON + GIF/APNG/PNG.

> 사람에게 "lordicon.com 가서 골라주세요"라고 요청하지 말 것. 아래 절차로 직접 고른다.

---

## 0. 어디서 가져오는가

**탐색·선정은 로그인 없이 전부 된다.** Lordicon 사이트가 자기 라이브러리 UI 를 그릴 때 쓰는
엔드포인트와 프리뷰 SVG 가 공개이기 때문이다. 로그인이 필요한 건 **채택한 아이콘의 Lottie JSON
을 받는 마지막 한 단계뿐**이다.

| 단계 | 소스 | 인증 |
|---|---|---|
| 카탈로그 수집 | `lordicon.com/api/library/sidebar`, `/api/library/icons` | 불필요 |
| 검색 | 카탈로그 오프라인, 또는 `/api/library/search` (`--live`) | 불필요 |
| 시각 선정 | `media.lordicon.com/icons/<f>/<s>/<index>-<name>.svg` | 불필요 |
| **Lottie JSON 수급** | 로그인된 세션의 정식 다운로드 | **웹 PRO 로그인** |

`.li` 파일(`media.lordicon.com/.../<index>-<name>.li`)은 공개지만 Lordicon 자체 보호 포맷이다.
**디코딩해서 우회하지 말 것.** 정식 다운로드 경로만 쓴다.

**Lordicon API(`api.lordicon.com`)는 쓰지 않는다.** 웹 구독과 별개 상품이다 —
미검증 앱은 34개 샌드박스에 `search` 무동작, API Free 는 크레딧 표기 의무 부활,
API PRO 는 $149/월. 이미 웹 PRO 로 전량 권리가 있으므로 다시 살 이유가 없다.

```bash
cd billyjo-inject
alias bjicon='node tools/icons/bjicon.mjs'
```

---

## 1. 표준 워크플로

```bash
# ① 카탈로그 (최초 1회, 13초. 신규 아이콘 반영하려면 가끔 다시)
bjicon catalog                 # 기본 wired/outline
bjicon catalog --all           # 6개 family/style 전부

# ② 후보를 눈으로 본다 — 컨택트시트 PNG 를 만든 뒤 Read 툴로 연다
bjicon find "phone support" --desc        # 텍스트 목록 + 설명
bjicon find "phone" --live                # 카탈로그에 없으면 사이트 검색 직격
bjicon pick "phone support" --limit 10    # 컨택트시트 PNG
#   → 이 PNG 를 Read 해서 실제로 보고 고른다. 절대 이름만 보고 고르지 말 것.

# ③ 고른 것의 Lottie JSON 을 수급 (로그인된 브라우저 필요 — §7)
node tools/icons/fetch.mjs --raw wired/outline/463-headset-customer-support
bjicon index

# ④ 등록 (원본 저장 + 테마별 리컬러 + 매니페스트)
bjicon add wired-outline-463-headset-customer-support --as consult-headset

# ⑤ JS 를 못 쓰는 채널(카톡/메일/스마트스토어)에 필요할 때만 래스터
bjicon render consult-headset --theme brand --gif --poster
#   출력에 찍히는 "구간"과 "다른 state" 를 확인할 것. 기본은 default: 마커 구간이고,
#   다른 연출이 필요하면 --state loop-roll 처럼 지정한다.

# ⑥ 코드에 넣은 뒤 사용처를 기록 (다음 세션이 중복 선정하지 않도록)
bjicon use consult-headset "inject.js 상담 CTA 버튼"
```

`bjicon list` 로 이미 등록된 것부터 확인한다. **있는 걸 다시 고르지 말 것.**

③ 에서 JSON 이 없다고 하면 로그인된 세션이 필요하다는 뜻이다 — `browse.mjs` 로 처리하거나
(§7) 사람에게 그 아이콘만 받아달라고 요청한다. `icons/library/` 에 배치 다운로드본을 부어두면
`bjicon index` 로 색인해 오프라인 소스로도 쓸 수 있다(선택 사항).

---

## 2. 선정 판단 규칙

**모션을 쓸 자리인가**
- 쓴다: 상태 전환(저장 완료·동기화 중), 빈 상태, 전환 유도 CTA, 온보딩, KPI 헤더
- 안 쓴다: 테이블 셀, 반복 목록, 상시 노출되는 네비게이션 → 정적 SVG(lucide / 인라인)로 충분
- **한 화면에 loop 아이콘 3개 이상 금지.** 모바일 CPU/배터리와 시각적 소음.

**family/style 고르기**
- 한 화면 안에서는 반드시 같은 family/style 로 통일한다. 섞이면 즉시 싸구려로 보인다.
- 기존 인라인 SVG(`icons/benefit-*.svg`, `billyjo-lp/icons.jsx`)는 stroke 1.75 아웃라인 계열 →
  아웃라인 계열 family 를 골라야 톤이 맞는다.

**테마**
- `brand` — 자사몰(billyjo-inject) · billyjo-lp
- `admin-light` / `admin-dark` — admin2. 다크모드는 아웃라인이 반전되어야 하므로 **둘 다 필요**
- 기본값은 세 테마 전부 생성. 필요 없으면 `--themes brand`

---

## 3. 산출물 규격

| 경로 | 내용 | 커밋 |
|---|---|---|
| `icons/library/` | 웹 PRO 배치 다운로드본 전량 (수백 MB) | **X** — gitignore |
| `icons/src/<name>.json` | 채택한 것의 Lordicon 원본 (무수정) | O — 재테마용 |
| `icons/lottie/<name>.<theme>.json` | 빌리조 색 적용본 | O — 실제 배포 자산 |
| `icons/raster/<name>.<theme>.gif\|.apng.png\|.poster.png` | 래스터 파생물 | O — 필요한 것만 |
| `icons/manifest.json` | 출처·테마·사용처 대장 | O |
| `tools/icons/.cache/` | 프리뷰·컨택트시트 | X (gitignore) |

---

## 4. 코드에 넣기

### admin2 (Next.js + React)
```bash
npm i @lordicon/react
```
```tsx
import { Player } from '@lordicon/react';
import ICON from '@/assets/icons/consult-call.admin-light.json';

const ref = useRef<Player>(null);
<Player ref={ref} icon={ICON} size={32} onComplete={() => ref.current?.playFromBeginning()} />
```
JSON 은 `admin2_frontend/src/assets/icons/` 로 복사해 번들에 포함시킨다 (CDN 의존 0).
다크모드는 `useTheme` 기준으로 `.admin-light` / `.admin-dark` 중 선택.

### billyjo-inject (자사몰 주입 — 제약이 가장 많다)
1. **커스텀 엘리먼트를 등록하지 말 것.** 자사몰의 다른 스크립트와 `lord-icon` 이름이 충돌할 수 있다.
   `lottie.loadAnimation()` 을 직접 호출한다.
2. 런타임(`vendor/lottie_light.min.js`, 약 168KB / gzip 50KB대)은 **지연 로드**한다.
   inject.js 는 이미 555KB다. 뷰포트 진입 시에만 받는다.
3. JSON 은 Lordicon CDN 이 아니라 **우리 jsdelivr 커밋핀**에서 받는다 — 기존 자산과 동일한 패턴:
   `https://cdn.jsdelivr.net/gh/billyjo-appsilon/billyjo-inject@<커밋>/icons/lottie/<name>.brand.json`
   (Tabler 웹폰트가 자사몰에서 로드 실패했던 전례가 있다. 외부 CDN 을 늘리지 않는다.)

```js
// 지연 로드 + 뷰포트 진입 시 재생
function mountLottie(el, url) {
  new IntersectionObserver(async (entries, obs) => {
    if (!entries[0].isIntersecting) return;
    obs.disconnect();
    if (!window.lottie) await loadScript(LOTTIE_URL);   // 1회만
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.style.backgroundImage = `url(${url.replace('/lottie/', '/raster/').replace('.json', '.poster.png')})`;
      return;
    }
    window.lottie.loadAnimation({
      container: el, renderer: 'svg', loop: true, autoplay: true, path: url,
    });
  }, { rootMargin: '200px' }).observe(el);
}
```

### JS 를 못 쓰는 채널
`icons/raster/<name>.<theme>.gif` 를 쓴다. 알파가 중요하면 `.apng.png`(품질이 훨씬 낫다),
구형 클라이언트 호환이 필요하면 GIF.

---

## 5. 지켜야 할 것

**라이선스 (웹 PRO 구독 중 → 크레딧 표기 불필요)**
- 라이브러리 경유본은 웹에서 이미 다운로드가 집계되었으므로 별도 보고가 없다.
- `--api` 로 API 경유 등록을 하면 `bjicon` 이 `/v1/download/track` 을 자동 호출한다.
  이건 API 라이선스의 의무이므로 실패 경고가 뜨면 무시하지 말고 재시도할 것.
- 산출물에 `watermark` / `lordicon.com` 레이어가 감지되면 경고가 뜬다.
  PRO 경로로 받은 파일에는 없어야 한다 → 뜨면 무료 CDN 으로 받은 것이니 다시 받는다.
- 무료 플랜으로 되돌아가면 푸터 크레딧 의무가 되살아난다.

**룰북 연계**
- 모바일 가로 넘침 0 (룰북 #32): 아이콘 컨테이너에 고정 `width`/`height` + `min-width:0`.
  Lottie 캔버스/SVG 는 내재 크기가 없어 부모를 밀 수 있다. 320~430px 검증 필수.
- 정렬/여백 룰: 기존 SVG 자리에 Lottie 를 넣으면 **광학 중심이 어긋난다** (Lordicon 은 500×500
  아트보드에 자체 여백을 갖는다). 형제 요소와 델타 0 을 눈으로 확인하고 배포할 것.
- `prefers-reduced-motion: reduce` 면 `.poster.png` 로 폴백.

---

## 6. 트러블슈팅

| 증상 | 원인 / 조치 |
|---|---|
| `팔레트에 없는 색` 경고 | 그 아이콘이 표준 외 색을 쓴다. `bjicon colors <name>` 로 확인 후 `palette.json` 의 `roles` 에 hex→역할 추가하고 다시 `add` |
| `json 링크가 없습니다` | 현재 플랜에 없는 아이콘. 다른 후보를 고른다 |
| 렌더가 전부 빈 프레임 | 래스터는 canvas 렌더러 빌드(`vendor/lottie_light_canvas.min.js`)를 쓴다. SVG 전용 `lottie_light.min.js` 로 바꾸면 깨진다 |
| GIF 가 1프레임 | `untile` 출력 PTS 간격이 1ms 미만이라 `fps` 필터가 뭉갠다. `setpts=N/fps/TB` 로 타임스탬프를 재생성해야 한다 (이미 반영됨) |
| Chrome 이 멈춤 | Chrome 150 의 `--screenshot` 숏컷이 응답하지 않는다. CDP 직결(`lib/chrome.mjs`)을 쓴다 |
| `find` 가 0건인데 사이트엔 있다 | 카탈로그는 카테고리 기반이라 미분류 아이콘이 빠진다. `bjicon find --live` 로 확인 |
| 렌더 결과가 비거나 엉뚱한 연출 | Raw 익스포트는 여러 state 를 한 타임라인에 이어 붙인다. `ip→op` 전체가 아니라 **마커 구간**을 써야 한다 (`pickSegment`). 이미 반영됨 |
| 프레임이 밀려서 뒷부분이 빔 | `goToAndStop(f, true)` 는 **ip 기준 상대 프레임**이다. 절대 프레임을 넘기면 ip 만큼 밀린다 → `f - ip` 로 넘긴다 (이미 반영됨) |
| `fetch.mjs` 가 Export 를 못 찾음 | 버튼 라벨이 로그인 시 "Export Lottie", 비로그인 시 "Export" 로 갈린다. 로그인 상태부터 확인 |

---

## 7. 로그인이 필요한 단계 — `browse.mjs`

Lottie JSON 수급만 로그인된 세션이 필요하다. `browse.mjs` 는 **사람이 직접 로그인해 둔 Chrome 에
CDP 로 붙는** 드라이버다. 쿠키를 꺼내거나 비밀번호를 다루지 않는다.

```bash
# ① 별도 프로필 Chrome 을 띄운다 (Chrome 136+ 는 기본 프로필의 원격 디버깅을 막는다)
open -na "Google Chrome" --args --remote-debugging-port=9222 \
  --user-data-dir="$HOME/.chrome-bjicon" "https://lordicon.com/"

# ② 그 창이 lordicon.com 에 PRO 계정으로 로그인되어 있어야 한다.
#    프로필이 유지되므로 보통 한 번만 하면 된다. 상태 확인:
node tools/icons/browse.mjs status

# ③ 수급은 fetch.mjs 가 전부 자동으로 한다 (Export → Lottie → Raw → Download)
node tools/icons/fetch.mjs --raw \
  wired/outline/463-headset-customer-support \
  wired/outline/3589-phone-circle
node tools/icons/fetch.mjs --from picks.txt --raw     # 목록 파일로도 가능
```

받은 JSON 은 `icons/library/` 에 떨어진다 → `bjicon index` → `bjicon add <id> --as <이름>`.

디버깅이 필요하면 `browse.mjs` 의 `open` / `eval` / `shot` / `dl` / `wait` 를 직접 쓴다.
UI 가 바뀌어 `fetch.mjs` 가 깨지면 `shot` 으로 화면을 찍어 **눈으로 보고** 셀렉터를 고칠 것.

**커스텀 엘리먼트(`li-button` 등)는 합성 `el.click()` 이 안 먹는 경우가 있다.**
`clickDeep` 처럼 shadow DOM 을 관통해 좌표를 구한 뒤 CDP `Input.dispatchMouseEvent` 로
실제 마우스 이벤트를 보내야 한다.
