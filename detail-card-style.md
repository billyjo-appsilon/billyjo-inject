# 제품 카드 가격 스타일 (신혼가전 스타일 통일 규격) — storefront `/prod_list`

> billyjo storefront 제품 리스트 카드의 **일반/제휴 가격 블록** 디자인 규격(inject.js DOM 리스타일 한정).
> 카드 전체 정본 규격은 `billyjo-lp/docs/product-card-style.md`. 이 문서는 그 하위 가격 블록 상세.
> 처음 출처: `신혼 가전, 한 번에 시작하기`(billyjo_lp_detailcard_extract/landing/newlywed.js)의 썸네일 카드.
>
> ⚠️ **후기는 이 모듈이 안 함**. storefront 후기 신호는 **별도 모듈 `bj-rv-listbadge`**(inject.js, 썸네일 **우상단** `★평점 후기N` 배지 + 정렬바)가 담당. 브랜드/카테고리 폴백 매칭이 더 정교해 그쪽이 정본. 중복 방지로 가격 restyle 모듈에서는 후기칩을 넣지 않는다. (이전 `bj-card-review` 본문 칩은 중복이라 제거됨, 2026-06-26)

미리보기(외부 접속): https://bj-card-price-preview.vercel.app (※ 후기칩은 미리보기 전용 — 실제 storefront는 썸네일 배지)
미리보기 소스: `billyjo-inject/preview-card-price-style.html`
실제 적용 모듈: `billyjo-inject/inject.js` → 가격 `billyjoProdListCardRestyle` / 후기 배지 `bj-rv-listbadge`(IIFE 하단)

---

## 1. 디자인 원칙

가격 한 줄(우측정렬 숫자)이 아니라 **2줄 구조**로, 칩 색으로 역할을 구분한다. 일반/제휴 **글씨 크기는 동일**(15px / 모바일 12.5px)하게 두고 **색·굵기**로만 강약을 준다.

| 요소 | 칩 | 색 | 의미 |
|---|---|---|---|
| 일반 | `일반` | 회색 (글자 `#6b7280` / 배경 `#eceff3`) | 월 렌탈료(연한 글씨, `#555`, 숫자만 `#333` bold) |
| 제휴 | `제휴💳` | **솔리드 파랑** (글자 `#fff` / 배경 `#0838F8`) | 제휴카드 적용 최종가(굵은 파랑 `#0838F8` 800) |
| 할인율 | `-N%` 배지 | 흰 글자 / 핑크 `#d6336c` | 제휴 할인율 (할인 0이면 미표시) |
| 후기(storefront) | 썸네일 **우상단** 배지 `bj-rv-listbadge` | 금별 `★ #ffb400` + 파랑 `#0838F8` | `★ 4.9 후기 429` (별도 모듈) |

> 가격 두 칩(회색 일반 / 파랑 제휴)은 색·굵기로만 강약. 후기 배지는 썸네일 위 별도.
> **썸네일 3코너 규약(겹침 금지)**: 좌상단=BEST(`.best-pill`) · 우상단=후기(`bj-rv-listbadge`) · 하단=hover '렌탈신청하기' 바(`.thumb::after`). 후기 배지를 하단/좌상단에 두면 겹침(2026-06-26 수정: bottom-left→top-right).

---

## 2. 마크업 (적용 후)

네이티브 카드(`/prod_list`)의 `.fee`(월 렌탈료) / `.fee2`(제휴카드 할인액) 블록을 다음으로 교체:

```html
<!-- 가격: .fee 안에 주입, .fee2 는 숨김 (billyjoProdListCardRestyle) -->
<div class="bj-cf-line bj-cf-normal"><span class="bj-cf-chip">일반</span>월 <b>25,500원</b>~</div>
<div class="bj-cf-line bj-cf-deal"><span class="bj-cf-chip">제휴💳</span>월 12,500원~<span class="bj-cf-disc">-49%</span></div>
<!-- 후기: 썸네일 우상단 배지 (별도 bj-rv 모듈) -->
<span class="bj-rv-listbadge"><span class="st">★</span>4.9 후기 429</span>
```

할인 0원이면 제휴 줄만 `일반` 칩으로 단순 표기(배지 없음).

---

## 3. CSS (핵심)

```css
.prod_list .item .fee.bj-cf{height:auto!important;overflow:visible!important;padding:8px 14px 12px!important}
.prod_list .item .fee2.bj-cf-hide{display:none!important}
.bj-cf-line{display:flex;align-items:center;gap:5px;white-space:nowrap;overflow:hidden;line-height:1.3;float:none}
.bj-cf-normal{font-size:15px;color:#555}
.bj-cf-normal b{font-weight:700;color:#333}
.bj-cf-deal{font-size:15px;font-weight:800;color:#0838F8;margin-top:4px}
.bj-cf-chip{display:inline-flex;align-items:center;justify-content:center;min-width:44px;font-size:10px;font-weight:700;border-radius:4px;padding:2px 6px;flex-shrink:0}
.bj-cf-normal .bj-cf-chip{color:#6b7280;background:#eceff3}
.bj-cf-deal .bj-cf-chip{color:#fff;background:#0838F8}
.bj-cf-disc{font-size:11px;font-weight:800;color:#fff;background:#d6336c;border-radius:6px;padding:2px 6px;flex-shrink:0}
/* 모바일 ≤640px: 일반/제휴 동일 축소 + 줄바꿈 허용(가로 넘침 0) */
@media all and (max-width:640px){
  .prod_list .item .fee.bj-cf{padding:8px 10px 10px!important}
  .bj-cf-normal,.bj-cf-deal{font-size:12.5px;white-space:normal;flex-wrap:wrap;gap:3px;row-gap:1px;letter-spacing:-.3px}
  .bj-cf-chip{font-size:8.5px;min-width:32px;padding:1px 3px}
  .bj-cf-disc{font-size:9px;padding:1px 4px}
}
```

후기 배지 CSS(`bj-rv-listbadge`, 별도 모듈) — 썸네일 우상단:
```css
.bj-rv-listbadge{position:absolute;right:8px;top:8px;display:inline-flex;align-items:center;gap:4px;background:rgba(255,255,255,.97);border:1px solid #e6e8ee;border-radius:999px;padding:4px 11px;font-size:14px;font-weight:800;color:#0838F8;box-shadow:0 2px 5px rgba(0,0,0,.12);z-index:2}
.bj-rv-listbadge .st{color:#ffb400;font-size:15px}
```

---

## 4. 데이터 소스

- **가격**: 카드 DOM에서 직접 산출(외부 의존 없음).
  - 일반가 = `.fee .price strong` (월 렌탈료)
  - 할인액 = `.fee2 .price strong` (제휴카드 할인)
  - 제휴 최종가 = 일반가 − 할인액, 할인율 = round(할인액/일반가×100)
- **후기**(별도 `bj-rv-listbadge` 모듈이 사용): `GET https://admin2-api.billyjo.co.kr/v1/reviews/counts` → `by_model[모델]={n,avg}` + `by_cat[브랜드|카테고리]={n,avg}`
  - 매칭: 카드 `p.brand`(모델코드)·`p.name`·이미지 alt에서 모델/브랜드/카테고리 추출 → by_model 정확매칭 → 라인키(시리즈) 합산 → by_cat 폴백 순. (가격 restyle 모듈의 단순 정규화보다 매칭률 높음)
  - 공식 채널 후기만 집계. 후기 없으면 배지 미표시(2026-06 기준 정수기/공청기 위주 142개 모델).

### ⚠️ 알려진 데이터 주의점 — 제휴 할인 출처 차이
같은 제품도 **신혼 메뉴**와 **일반 리스트**의 제휴 할인율이 다를 수 있다.
- 일반 리스트: 네이티브 `제휴카드 할인`(상품별 어드민 입력값, 0~수만원, 들쭉날쭉 → -2%같이 약한 값도 존재)
- 신혼 메뉴: 별도 산출 — `packages.py _card_discount(brand, fee)` = `min(CARD_MAX[brand], round(fee*0.6/100)*100)` (+ 일부 큐레이션 특가)

→ 일반 리스트 카드의 제휴 할인 소스를 (A) 네이티브 실값 / (B) `_card_discount` 산출값 / (C) 임계치 미만 배지 숨김 중 무엇으로 할지는 **상황별 결정 필요**. 현재 모듈 기본값 = **(A) 네이티브 실값**(정직·상품별 실데이터).

---

## 5. 구현 메모

**가격 — `billyjoProdListCardRestyle`**
- 적용 범위: `location.pathname`에 `prod_list` 포함, 단 차량 `prod_list/7-` 제외.
- **멱등**: `.fee.bj-cf` 존재 여부로 재처리 방지.
- **AJAX 대응**: 필터/정렬 시 `$('.prod_list').html(...)` 재렌더 → `MutationObserver`(디바운스 120ms) + 초기 1.2s 폴링으로 재적용.
- 전부 `try/catch`로 감싸 단일 카드 오류가 전체를 막지 않음.

**후기 — `bj-rv-listbadge` 모듈(inject.js 하단 IIFE)**
- `.item`마다 썸네일 우상단에 `★평점 후기N` 배지. `data-bj-rv` 멱등. 리스트 페이지엔 정렬바(기본순/후기많은순)도.
- ⚠️ 위치는 **우상단 고정**(좌상단 BEST·하단 렌탈신청하기 바와 겹치지 않게). 변경 시 §1 3코너 규약 준수.

## 6. 배포 (WORKLOG.md 절차)
1. `inject.js` 수정 → `git commit && git push` (billyjo-appsilon/billyjo-inject)
2. CDN: `https://cdn.jsdelivr.net/gh/billyjo-appsilon/billyjo-inject@<HASH>/inject.js`
3. `deploy/current-logscript.html`의 `@OLDHASH` → `@NEWHASH`(앞 7자리) 갱신 후 admin logscript 반영 → 라이브 활성화.
