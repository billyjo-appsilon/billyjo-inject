# 제품 카드 가격·후기 스타일 (신혼가전 스타일 통일 규격)

> billyjo 제품 카드의 **일반/제휴 가격 블록 + 후기 태그** 공통 디자인 규격.
> 처음 출처: `신혼 가전, 한 번에 시작하기`(billyjo_lp_detailcard_extract/landing/newlywed.js)의 썸네일 카드.
> 이 스타일을 일반 제품 리스트 카드(`/prod_list`)에도 적용. 다른 세션에서 카드 변경 시 **이 문서를 단일 소스로 참조**.

미리보기(외부 접속): https://bj-card-price-preview.vercel.app
미리보기 소스: `billyjo-inject/preview-card-price-style.html`
실제 적용 모듈: `billyjo-inject/inject.js` → IIFE `billyjoProdListCardRestyle`

---

## 1. 디자인 원칙

가격 한 줄(우측정렬 숫자)이 아니라 **2줄 구조**로, 칩 색으로 역할을 구분한다. 일반/제휴 **글씨 크기는 동일**(15px / 모바일 12.5px)하게 두고 **색·굵기**로만 강약을 준다.

| 요소 | 칩 | 색 | 의미 |
|---|---|---|---|
| 일반 | `일반` | 회색 (글자 `#6b7280` / 배경 `#eceff3`) | 월 렌탈료(연한 글씨, `#555`, 숫자만 `#333` bold) |
| 제휴 | `제휴💳` | **솔리드 파랑** (글자 `#fff` / 배경 `#0838F8`) | 제휴카드 적용 최종가(굵은 파랑 `#0838F8` 800) |
| 할인율 | `-N%` 배지 | 흰 글자 / 핑크 `#d6336c` | 제휴 할인율 (할인 0이면 미표시) |
| 후기 | 라운드 화이트 펄 | 금별 `★ #f5a623` + 평점 `#1f2937` + 후기수 `#9b8763` | `★ 4.9 · 후기 2,156` |

> 세 칩(회색/파랑/앰버)이 **색 계열이 모두 달라야** 혼동이 없다. 후기 태그는 `💰 가성비` 칩과 같은 앰버 톤.

### 후기 태그 후보 (현재 ①번 채택)
1. **라운드 화이트 + 금색 별점** `★ 4.9 · 후기 2,156` — 채택(가격칩과 안 부딪힘)
2. 앰버 그라데이션 필 `⭐ 4.9 후기 2,156개`
3. 별 5개 + 후기수 `★★★★★ 2,156`

---

## 2. 마크업 (적용 후)

네이티브 카드(`/prod_list`)의 `.fee`(월 렌탈료) / `.fee2`(제휴카드 할인액) 블록을 다음으로 교체:

```html
<!-- .fee 안에 주입, .fee2 는 숨김 -->
<div class="bj-cf-line bj-cf-normal"><span class="bj-cf-chip">일반</span>월 <b>25,500원</b>~</div>
<div class="bj-cf-line bj-cf-deal"><span class="bj-cf-chip">제휴💳</span>월 12,500원~<span class="bj-cf-disc">-49%</span></div>
<!-- 후기 있는 모델만 .txt 끝에 추가 -->
<p class="bj-card-review"><span class="star">★</span><span class="rt">4.9</span><span class="ct">후기 1,284</span></p>
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
.bj-card-review{display:inline-flex;align-items:center;gap:4px;font-size:11px;font-weight:700;margin:8px 0 0;padding:3px 9px 3px 8px;border-radius:999px;background:#fff;border:1px solid #ffe2a8;box-shadow:0 1px 2px rgba(180,83,9,.08);max-width:100%;white-space:nowrap;overflow:hidden}
.bj-card-review .star{color:#f5a623;font-size:11.5px;line-height:1}
.bj-card-review .rt{color:#1f2937;font-weight:800}
.bj-card-review .ct{color:#9b8763;font-weight:600;position:relative;padding-left:7px}
.bj-card-review .ct::before{content:"";position:absolute;left:2px;top:50%;transform:translateY(-50%);width:3px;height:3px;border-radius:50%;background:#e2c89a}
/* 모바일 ≤640px: 일반/제휴 동일 축소 + 줄바꿈 허용(가로 넘침 0) */
@media all and (max-width:640px){
  .prod_list .item .fee.bj-cf{padding:8px 10px 10px!important}
  .bj-cf-normal,.bj-cf-deal{font-size:12.5px;white-space:normal;flex-wrap:wrap;gap:3px;row-gap:1px;letter-spacing:-.3px}
  .bj-cf-chip{font-size:8.5px;min-width:32px;padding:1px 3px}
  .bj-cf-disc{font-size:9px;padding:1px 4px}
  .bj-card-review{font-size:9.5px;margin-top:6px;padding:2px 7px 2px 6px}
}
```

---

## 4. 데이터 소스

- **가격**: 카드 DOM에서 직접 산출(외부 의존 없음).
  - 일반가 = `.fee .price strong` (월 렌탈료)
  - 할인액 = `.fee2 .price strong` (제휴카드 할인)
  - 제휴 최종가 = 일반가 − 할인액, 할인율 = round(할인액/일반가×100)
- **후기**: `GET https://admin2-api.billyjo.co.kr/v1/reviews/counts` → `by_model[모델] = {n, avg}`
  - 모델 매칭 키: `.brand` 텍스트(=모델코드)를 정규화. **정규화 규칙**: `model.split('_')[0].split(' ')[0].trim().toUpperCase()`
    (예: `CHPI-7400N_V2 4개월관리` → `CHPI-7400N`, `EWBD351_4개월` → `EWBD351`)
  - 공식 채널 후기만 집계됨. 후기 없는 모델은 칩 미표시(2026-06 기준 정수기/공청기 위주 142개 모델 보유).

### ⚠️ 알려진 데이터 주의점 — 제휴 할인 출처 차이
같은 제품도 **신혼 메뉴**와 **일반 리스트**의 제휴 할인율이 다를 수 있다.
- 일반 리스트: 네이티브 `제휴카드 할인`(상품별 어드민 입력값, 0~수만원, 들쭉날쭉 → -2%같이 약한 값도 존재)
- 신혼 메뉴: 별도 산출 — `packages.py _card_discount(brand, fee)` = `min(CARD_MAX[brand], round(fee*0.6/100)*100)` (+ 일부 큐레이션 특가)

→ 일반 리스트 카드의 제휴 할인 소스를 (A) 네이티브 실값 / (B) `_card_discount` 산출값 / (C) 임계치 미만 배지 숨김 중 무엇으로 할지는 **상황별 결정 필요**. 현재 모듈 기본값 = **(A) 네이티브 실값**(정직·상품별 실데이터).

---

## 5. 구현 메모 (inject.js `billyjoProdListCardRestyle`)

- 적용 범위: `location.pathname`에 `prod_list` 포함, 단 차량 `prod_list/7-` 제외.
- **멱등**: `.fee.bj-cf` / `.bj-card-review` 존재 여부로 재처리 방지.
- **AJAX 대응**: 필터/정렬 시 `$('.prod_list').html(...)` 재렌더 → `MutationObserver`(디바운스 120ms) + 초기 1.2s 폴링으로 재적용.
- 가격은 즉시 적용, 후기칩은 counts API 응답 후 추가(이미 처리된 카드에도 칩만 보강).
- 전부 `try/catch`로 감싸 단일 카드 오류가 전체를 막지 않음.

## 6. 배포 (WORKLOG.md 절차)
1. `inject.js` 수정 → `git commit && git push` (billyjo-appsilon/billyjo-inject)
2. CDN: `https://cdn.jsdelivr.net/gh/billyjo-appsilon/billyjo-inject@<HASH>/inject.js`
3. `deploy/current-logscript.html`의 `@OLDHASH` → `@NEWHASH`(앞 7자리) 갱신 후 admin logscript 반영 → 라이브 활성화.
