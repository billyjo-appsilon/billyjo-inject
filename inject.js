/*!
 * billyjo-inject (통합본, 2026-06-01)
 * 이 파일은 두 개의 독립 IIFE를 순차 concat한 단일 진입점입니다.
 *
 *   [모듈 A] skin-css 원본 — 빌리조 본 사이트 전역 (CSS 리스킨 + 헤더 리뉴얼 +
 *            인터넷 배너 + GNB 변경 + AI카드 후처리 + 추천 위젯 + 상담 모달)
 *   [모듈 B] detailcard 원본 (v0.5.74) — /html/dh_prod/prod_view/* 전용
 *            (sticky widget, LPT mount, SLOT 8, help-pop, 페르소나, 모바일 헤더 픽스)
 *
 * 두 IIFE는 독립 실행. window.__bjDetailcardLoaded 가드는 모듈 B 내부에서만 사용.
 * cascade 순서 = A → B (라이브와 동일). 함수 충돌(tryInject, close 등)은 IIFE 스코프 분리로 무해.
 *
 * 이전: 빌리조 logscript에 inject.js 2개를 핀했음. 통합 후 1개로 단일화.
 */

/* =========================================================================
 * [모듈 A] skin-css/inject.js — 빌리조 사이트 전역 패치
 * ========================================================================= */
// BillyJo Inject - Auto-generated from logscript
// Generated: 2026-04-15

(function() {
  // === CSS Injection ===
  var css = "\n/* Hide categories from navigation */\n.gnb__menu a[href*=\"prod_list/11-\"],\n.gnb__menu a[href*=\"prod_list/5-\"],\n.gnb__menu a[href*=\"prod_list/10-\"],\n.gnb__menu a[href*=\"prod_list/4-\"],\n.gnb__menu a[href*=\"prod_list_agency\"],\n.gnb__menu a[href*=\"btob\"],\n.menu__gsnb a[href*=\"prod_list/7-1273\"],\n.menu__gsnb a[href*=\"prod_list/7-1332\"],\n.menu__gsnb li:has(> a[href*=\"prod_list/7-1273\"]),\n.menu__gsnb li:has(> a[href*=\"prod_list/7-1332\"]),\n.category__wrap a[href*=\"prod_list/11-\"],\n.category__wrap a[href*=\"prod_list/5-\"],\n.category__wrap a[href*=\"prod_list/10-\"],\n.category__wrap a[href*=\"prod_list/4-\"],\n.category__wrap a[href*=\"prod_list_agency\"],\n.category__wrap a[href*=\"btob\"] {\n  display: none !important;\n}\nli.gnb__menu:has(> a[href*=\"prod_list/11-\"]),\nli.gnb__menu:has(> a[href*=\"prod_list/5-\"]),\nli.gnb__menu:has(> a[href*=\"prod_list/10-\"]),\nli.gnb__menu:has(> a[href*=\"prod_list/4-\"]),\nli.gnb__menu:has(> a[href*=\"prod_list_agency\"]),\nli.gnb__menu:has(> a[href*=\"btob\"]) {\n  display: none !important;\n}\n\n/* Center align GNB top menu bar */\nul.new-gnb {\n  justify-content: center !important;\n}\n\n/* Center align mobile/category bar */\n.category__wrap {\n  display: flex !important;\n  justify-content: center !important;\n  gap: 10px 20px !important;\n  flex-wrap: wrap !important;\n  padding: 10px 0 !important;\n}\n.category__wrap a {\n  line-height: 1.5 !important;\n}\n\n/* Hide native 인터넷 (6-1198) entries — promoted to top-level via JS */\n.menu__gsnb a[href*=\"prod_list/6-1198\"],\n.menu__gsnb li:has(> a[href*=\"prod_list/6-1198\"]),\n.all__depth2 a[href*=\"prod_list/6-1198\"],\n.all__depth2 li:has(> a[href*=\"prod_list/6-1198\"]),\n.prod_list__cate li[onclick*=\"6-1198\"],\n.aside_sub a[href*=\"prod_list/6-1198\"],\n.aside_sub li:has(> a[href*=\"prod_list/6-1198\"]) {\n  display: none !important;\n}\n\n/* Change 이벤트/기획전 button color to match logo blue */\na.right__event[href*=\"display\"] p {\n  background-color: #0838f8 !important;\n}\n/* PC: 네이티브 이벤트/기획전 버튼 즉시 숨김 — inject 재구성 전(FOUC) 좁은 PC폭(769~1199px)에서\n   position:absolute .top__right이 카테고리 메뉴바를 침범하는 겹침 방지. (재구성 후엔 어차피 숨김) */\n@media(min-width:769px){\n  .gnb__right a.right__event[href*=\"display\"] { display: none !important; }\n}\n\n/* Cart badge circle */\n.cart__count {\n  background-color: #0838f8 !important;\n}\n\n/* Dropdown submenu background */\n.all__depth2 {\n  background-color: #0838f8 !important;\n}\n\n/* 이벤트/기획전 바로가기 inline button */\na[href*=\"display\"][style*=\"ff3700\"] {\n  background-color: #0838f8 !important;\n}\n\n/* 제휴카드 할인가 label and sale price text (only fee2, not fee) */\n.fee2 .label,\n.fee2 .price.sale,\n.fee2 .price.sale strong {\n  color: #0838f8 !important;\n}\n\n/* Headset icon - no filter needed, it's already dark */\n\n/* Category hover color - override all orange hover rules */\n.gnb__menu a:hover,\n.gnb__menu:hover > a,\n.new-gnb .gnb__menu > a:hover,\n.new-gnb .gnb__menu > a.active,\n.category__wrap a:hover,\nli.gnb__menu:hover,\nli.gnb__menu:hover > a,\n.all_cate > li > a:hover,\n.all_cate > li > a:focus,\n.new-gnb .gnb__all .all__menu .all__depth3 a:hover,\n.w_gnb4 .w_dp02 > .on > a,\n.w_gnb4 .w_dp03 a:hover,\n.pc_gnb4 .p_dp2 > .on > a {\n  color: #0838f8 !important;\n}\n\n/* Active depth1 background */\n.new-gnb .gnb__all .all__menu .all__depth1 a.active {\n  background-color: #0838f8 !important;\n}\n\n/* Slider dots handled by global .slick-dots rule below */\n\n/* Active border top */\n.active .gsnb_box {\n  border-top-color: #0838f8 !important;\n}\n.active > .gsnb_3dep_box {\n  border-top-color: #0838f8 !important;\n}\n\n/* Mobile category hover */\n.pc.m_cate li a:hover {\n  background-color: #0838f8 !important;\n}\n\n/* 간편 실시간 문의 button — 파란 글리프 GIF에 맞춰 흰 배경 + 파란 테두리 */\n.quick .org a {\n  background-color: #fff !important;\n  border: 2.5px solid #0838f8 !important;\n  color: #0838f8 !important;\n}\n.quick .org a span {\n  color: #0838f8 !important;\n}\n\n/* Replace q_call icons with blue versions */\nimg[src*=\"q_call.png\"] {\n  content: url(https://cdn.jsdelivr.net/gh/billyjo-appsilon/billyjo-inject@ae6cf20/icons/text.gif) !important;\n  width: 51px !important;\n  height: 51px !important;\n  object-fit: contain !important;\n}\nimg[src*=\"q_call_red\"] {\n  content: url(https://cdn.jsdelivr.net/gh/billyjo-appsilon/billyjo-inject@ae6cf20/icons/phonecall.gif) !important;\n  width: 51px !important;\n  height: 51px !important;\n  object-fit: contain !important;\n}\n\n/* Board active title */\n.board--style01 > li.active .board__tit .tit__param01 {\n  color: #0838f8 !important;\n}\n\n/* Month selector - keep original gray, blue on hover */\n.month > div a.month_box {\n  background-color: rgb(191, 190, 188) !important;\n}\n.month > div:hover a.month_box,\n.month > div.on a.month_box {\n  background-color: #0838f8 !important;\n}\n\n/* === Product Detail Page === */\n\n/* 렌탈(소유권이전) text */\n.dh_orange {\n  color: #0838f8 !important;\n}\n\n/* 카드할인가 box */\n.box.org {\n  background-color: #0838f8 !important;\n}\n\n/* 제휴카드안내 button */\na[href=\"javascript:\"]:has-text(\"제휴카드\") {\n  background-color: #0838f8 !important;\n}\n\n/* 렌탈신청 / 렌탈신청하기 button */\nbutton.plain.ok,\n.plain.ok {\n  background-color: #0838f8 !important;\n}\n\n/* 카드할인가 price in table */\ntd.red.card_dc b {\n  color: #0838f8 !important;\n}\n\n/* 간편 실시간 문의 popup title */\n.call_tit {\n  background-color: #0838f8 !important;\n}\n\n/* 주문혜택 text */\n.intro__param03 {\n  color: #0838f8 !important;\n}\n\n/* Slider dot - only active one is blue */\n.slick-dots li button {\n  background: rgb(191, 190, 188) !important;\n}\n.slick-dots li.slick-active button {\n  background: #0838f8 !important;\n}\n\n/* Hide 9353658f banner image */\nimg[src*=\"9353658f65d55314184dbf6824f6b68e\"] {\n  display: none !important;\n}\n\n#livePriceTable.lpt-empty { display: none !important; }\n\n/* Center product detail content */\n.prod_view_detail {\n  max-width: 1100px !important;\n  margin: 0 auto !important;\n  padding-right: 0 !important;\n}\n/* Hide rental comparison card (replaced by price table) */\n.prod_view_bot.card {\n  display: none !important;\n}\n\n/* === Product List Page === */\n\n/* Sidebar filter count numbers (inline style override) */\nlabel span[style*=\"dd5119\"] {\n  color: #0838f8 !important;\n}\n\n/* === Benefit Section === */\n\n/* 주문혜택 benefit intro text */\n.intro__param02 {\n  color: #0838f8 !important;\n}\n\n/* Benefit active card border/accent */\n.cs__benefit .slick-active,\n.cs__benefit .slick-current {\n  border-color: #0838f8 !important;\n}\n\n/* Benefit popup number highlight */\n.cs__popup .number {\n  color: #0838f8 !important;\n}\n\n/* Benefit slider icons - replace inline background-image with line-style SVG */\n.benefit__list .item, .cs__popup li[style*=\"benefit_img\"] {\n  background-size: 72px 72px !important;\n  background-position: right 18px center !important;\n  background-repeat: no-repeat !important;\n  padding-right: 100px !important;\n}\nli[style*=\"benefit_img01\"] { background-image: url(\"https://cdn.jsdelivr.net/gh/billyjo-appsilon/billyjo-inject@main/icons/benefit-zerocost.svg\") !important; }\nli[style*=\"benefit_img02\"] { background-image: url(\"https://cdn.jsdelivr.net/gh/billyjo-appsilon/billyjo-inject@main/icons/benefit-warranty.svg\") !important; }\nli[style*=\"benefit_img03\"] { background-image: url(\"https://cdn.jsdelivr.net/gh/billyjo-appsilon/billyjo-inject@main/icons/benefit-gift.svg\") !important; }\nli[style*=\"benefit_img04\"] { background-image: url(\"https://cdn.jsdelivr.net/gh/billyjo-appsilon/billyjo-inject@main/icons/benefit-delivery.svg\") !important; }\nli[style*=\"benefit_img05\"] { background-image: url(\"https://cdn.jsdelivr.net/gh/billyjo-appsilon/billyjo-inject@main/icons/benefit-apply.svg\") !important; }\nli[style*=\"benefit_img06\"] { background-image: url(\"https://cdn.jsdelivr.net/gh/billyjo-appsilon/billyjo-inject@main/icons/benefit-privacy.svg\") !important; }\nli[style*=\"benefit_img07\"] { background-image: url(\"https://cdn.jsdelivr.net/gh/billyjo-appsilon/billyjo-inject@main/icons/benefit-fast.svg\") !important; }\nli[style*=\"benefit_img08\"] { background-image: url(\"https://cdn.jsdelivr.net/gh/billyjo-appsilon/billyjo-inject@main/icons/benefit-discount.svg\") !important; }\nli[style*=\"benefit_img09\"] { background-image: url(\"https://cdn.jsdelivr.net/gh/billyjo-appsilon/billyjo-inject@main/icons/benefit-transfer.svg\") !important; }\nli[style*=\"benefit_img10\"] { background-image: url(\"https://cdn.jsdelivr.net/gh/billyjo-appsilon/billyjo-inject@main/icons/benefit-headset.svg\") !important; }\n\n/* Replace 자가관리 badge icon */\nimg[src*=\"482e20b9860dcd908c01baf733cbfec2\"],\nimg[src*=\"26d7833b590e101e709069aea9dbd52f\"],\nimg[src*=\"81872628b3b4fc81fd9d6ae1e54820cd\"] {\n  content: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFQAAABUCAYAAAAcaxDBAAAACXBIWXMAAAsTAAALEwEAmpwYAAAHCElEQVR4nO2dS2gVVxjH/5mrIpFUQYJgEoyCiTYgtMs+BBVfqxTcFLWK4iutQrtRjLpQwQe4aDeGZlEjjbFGtN1EYhQF+xBFIoTER9TmCuoi2WhNggbGU75MzsyZuTNzZ27OPO6984ch50zunLnzu+d9vvNNCWMMieRJkZhWIgBTcr0wlcLHAFYB+ALAIgBzAcwCUIL8EhXR1wBeAXgE4C8AXaqKB7kkVuKnyKdSmAbgGwDfAfgEha1uAKcB/KqqGJMONJXCVwB+BDAPxaXnAH5QVfwuBWgqhY8A/Azga/H8jBnA+vXAqlVAbS0wdy4waxZQkmcFnh7/9Wvg1Svg8WOgqws4dw4YHc346G8Adqoq/suSIHM8FIVVKQrrUxTG+DFvHmMtLazg1dKiPav47BMsqtyYucGsVBT2XEzw4EHGRkZY0Wh0VHtmC9Q0sfEFVFFYmaKwHjGh9nZWtGpvz4BKbMr8AD0nJnDlStSPFL06OjKgtnkCqiisXrzw/PmoHyU+IhYWqPWuQBWFTVUU9i+/oLEx6keInw4cMAElVlPdgG7hH66qYmx4OOqvHz8RE2IjQN1qYmjpRX3LA4cPa33NRGYRkyNHTKcabDv2qRRqJ8aymD4dGBlB6EqnjfvSF6+ujm/6dP27d3p0sapq7MTivodn423boilOu3YZRYnCcU5/+3ZTsd9jV+Q/54GVK3P/5YpFK1aYop/xgAh0MQ8sosm4HNTQMF51+DroGq9qbfWXdl8fAtNinda4aCozA2iFHtBDiZxkYVRhB7RMD+ihRE6yMCqzAzpND+ghf2pqAlTVfJw9a/6M9f90jVdt3Jh5vXj09CA0WRjpsWRNSbISoPkG9OVLFJUCB5pOm+M2Swu2am723wV6+tQcnz9fbvqRAx0d1b64qN7e4O7X2WmEFy4ESksRugIFevly5rlTp4K519275h9vyxZEI2Esr49NZejOnYzJWP04cULuWHtggLHaWvM9Bgflpe8kCzPb6Ttp9eamTebit3evEW9sBE6elJcz16wBnjwxzlHft7wc+WWK4wZzjeUBL13SGohnz7Qwh0raty/3+pnA7d5tPn/smDYAiEpTgoZ57RpQV6eFW1q0v5OFSi0ygbx1K7POrq9HpJJW5G/csIe5fLkRp1aXoK5bZ5wjqF6Hn5QrqapYssQMk6oUGnZGDVMq0AULzHErTCeoBGPtWm/3OHrUyNVcVDd3dxuloGCA0nJCZ6cGyAmmFeqOHdo1XpciDh3S0ifR39u3gePHo+lvhlKHVldrucXLA9Jn/Mw08WtOn9aMujZvjhfIwFr50oAfknK+W+6PWslsk2QlQCUrASpZCVDJEi1HdNtwWp+JQuk8shwh0Twql6pqu19iBTTfZAc0KfKSlQCVrARo3EdKk9HQEDA4aMSDmPAI+h6xAnr1qjZGD7JxDPoeU4Js+byIZpz8TJKIXR8vCntaL1Y51Itogtm6NO2msLuASaMU9xyqesgRZGTrJ5eJouUPqiac9OhR5lpTURX5ap/Dv2wWz2TlHCXQyIt8RYFZSweaQ1tbjfDq1YbxARVLv7mRlpplT5bkHdDNQn+Plnk5ULFIkuMCJ4n1LDdoyNZtitp8MvQ6tM9iNjhnTrDdpoIHWlcHvH0LDAxoOc2t4y3azLvZesZJkbTypaWZIO0McbONcmhtftkyFCZQMsW5eNH5/7QZd/Zs8zmx6Oayg4Ng+l3bzxug5FWm2aVu4wZiTopis25B9kN50R0eRkFIWg6lfmaPj2JrVz+K/VZZorqZGkBq1MIw3ZEGlPqY5SFbDd+86TwUtVY/9GOHMZUXWCvf1GTkWJrQ8LPr2KvIFlW0R3XT/fvhAx3jexbHxnLf78lFMHkucZsdEkWjJq+f9aqlS7Xt6m4jslz0/r05agf0LYDxjg11vK1dnDC03INlHY3prXb1XEEYRzjJ0ogO2wGlUfBsPh6OAqgXxWWCxDJn8NKu2/SQB7zOBhWzHuq0xvXADujfPEAm3TLVbNlX6fUIohslS9evm6L/2AHt4oG2tpC+VR7LwqgrA6iq4jGAexQmf0RnzoT7BfNJxEbw2XRvgl2mh9tUCrTl9Be+NEH1RKF5FxuapOUIzTmQRxyhUdqqqjCyX+JMMEBngom7S8nuLp0cspIz0mJXR64OWZ1cBl+4wIpW7ZN1GSw4tU6LCe3fX1w+RUdGtHZk0k6tBagVisJ6E7frTHS7XuHGzOuLAegVDhvE8zRZu2GD5smxpgaorARmzgSUWKwBeNeHD8CbN8CLF0B/vzZKdHgxAHXlG7K9GMDPqytoN/pPRfrqiu9VFX8E+XIVci38KQpb3YG+XMXh9T/kuvVLADUAKgHMjMvCnw99APAGwAsA/QD+pPmhUF7/kyi78i03Ie76H1Eeqp5s+nEFAAAAAElFTkSuQmCC) !important;\n}\n\n/* === Mobile specific === */\n\n/* Active category text and underline */\n.category__wrap a.on,\n.mobile__gnb a.on,\n.gnb__cateogry a.on {\n  color: #0838f8 !important;\n  border-bottom: none !important;\n}\n.category__wrap a.on::after,\n.mobile__gnb a.on::after,\n.gnb__cateogry a.on::after {\n  display: none !important;\n}\n\n/* Active subcategory - blue bg, white text */\n.pc.m_cate li.on,\n.prod_list__cate li.on {\n  background-color: #0838f8 !important;\n  color: #ffffff !important;\n}\n\n/* 검색결과 button */\n.mo_filter_wrap a.ok {\n  background-color: #0838f8 !important;\n}\n\n/* 스마트필터 icon */\n.mo_filter_wrap img[src*=\"mo_filter\"],\nimg[src*=\"mo_filter\"] {\n  filter: brightness(0) saturate(100%) invert(14%) sepia(100%) saturate(7500%) hue-rotate(228deg) brightness(98%) contrast(103%) !important;\n}\n.prod_mo_filter > a::before {\n  background: #0838f8 !important;\n  -webkit-mask: url(/image/sub/mo_filter.png) no-repeat center / 100% !important;\n  mask: url(/image/sub/mo_filter.png) no-repeat center / 100% !important;\n}\n.filter__sort::before {\n  background: #0838f8 !important;\n  -webkit-mask: url(/image/sub/mo_filter2.png) no-repeat center / 100% !important;\n  mask: url(/image/sub/mo_filter2.png) no-repeat center / 100% !important;\n}\n.prod_mo_filter > a,\n.sort__tit {\n  color: inherit !important;\n}\n.sort__tit::before,\n.sort__tit::after {\n  color: #0838f8 !important;\n  border-color: #0838f8 !important;\n}\n\n/* Total count number */\nb.m_total_cnt {\n  color: #0838f8 !important;\n}\n\n/* Dropdown submenu background - white */\n.gnb__menu .menu__gsnb {\n  background-color: #ffffff !important;\n  /* Override inline left:130% on 물·공기·청소가전 (구 정수기·환경) — center under parent like other menus */\n  left: 50% !important;\n  transform: translateX(-50%) !important;\n}\n/* Invisible bridge to preserve hover when mouse traverses gap between menu and submenu */\n.gnb__menu .menu__gsnb::before {\n  content: \"\";\n  position: absolute;\n  left: -20px;\n  right: -20px;\n  top: -32px;\n  height: 32px;\n  background: transparent;\n}\n/* Keep submenu visible while hovering it directly (in case parent hover slips) */\n.gnb__menu:hover .menu__gsnb,\n.gnb__menu .menu__gsnb:hover {\n  display: block !important;\n}\n\n/* Replace 방문관리 badge icons */\nimg[src*=\"48b1a4742387bc142eb517efe727f761\"],\nimg[src*=\"bfa152f515994c9358ecd6b0f64b17a3\"],\nimg[src*=\"f8c5799a7f777e5534cbb96a59e13529\"],\nimg[src*=\"5c48f9cb457af0e581e11cc74aa65143\"],\nimg[src*=\"03ab60d0e08bf5609dd07aec0cc7db15\"],\nimg[src*=\"49509ccee80aad14fd365d342c1c7e3c\"],\nimg[src*=\"7ee45ed05b34833a69acdf917960839b\"],\nimg[src*=\"60b7c4bd9c9a46c7e91dc40d3ee9c66d\"] {\n  content: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFQAAABUCAYAAAAcaxDBAAAACXBIWXMAAAsTAAALEwEAmpwYAAAHT0lEQVR4nO1dW2gVVxRdmVGRSGpAopAHKqiJBoT2Q0RbwYCPD8GiKMVYogastn60X2L0J36I/rU/hgaskfiIEW0RFRMfAduIiihc4ltqBPXDIJiaGzQwnrIzmXvPzJ2ZO+9X7oKBM3Nn5syse87Z++y9Z58ixhgK8A6Ch/cqAMAEpxeKIhYAWAngawA1AMoBlAIoQrxAXfQ9gDcAHgP4B0C3JOGhk5sV2enyoohJAL4H8BOAL5Fs3ANwGEC7JGHEc0JFEd8C+BXATIwvvATwiyThT08IFUV8AeB3AN/xx6dMATZtAlauBKqrgfJyoLQUKIpZh6fXf/8eePMGePIE6O4GTpwAhodzTu0A8IMk4b88N2SGmyCwKkFgDwSBMWWbOZOxtjaWeLS1ye/Kv/sYF1VmnJmRWSkI7CV/w337GEun2bjB8LD8zhpS+4kbW4QKAisRBJbib9TZycYtOjtzSCVuSuwQeoK/waVLYb9S+Lh4MYfUk5YIFQS2lr/w1KmwXyU6IC40pK41JVQQ2ERBYP8qFzQ1hf0K0cPevSpCiauJZoRuVU6uqmJsaCjsx48eiBPihiN1m4pDjRb1o1JobpZ1zQLUIE7271cd2qmr2Isiqsfmspg8GUinETj6+7P10oPPmoXIgp7v48fM7nxJkrnjjSNk6BgFzYDCwKFDQGurXN6+HWhp0T+PZjEvXrira/p0oKzM+fX19cCRI5ndFUpj5MfPDmVcOH3a2fjS3q6WgnrYsSP7O51v9BuVjdDXlyNtbW/auu2io0N1v1N6Y+h8pVBDxrgCTDE/w9YoyJQJbZevyBQypXjgwAFrz9zQ4F2dmvoq9AgtyRQyJXc4fjz32GN5pPEUa9YAtbXBEqrhqESP0EmZQqbkDg0uXoCI5/+QzZsRKWg4muTaBeI3btyQt6gSagRfCT12LPcYqRo8UV7gwgXg/n0kn9DNOq2qt9caocuWAY2N1uppakJkENkuX1MTn24eGKHHfZLys2cDqZT7mVLsCG3wUE3hUVxsTU0KA5Ht8lpcvw6cOQNfsHAhsFNlM4oIoatW2euKdroduXkVw4nXIEOMV/CU0LIydxacJIC3h2YiHiTJ+4oGBoCbN4Fbt+TAgp4e+fjy5XKAxOLFwJIlxn8IXf/2bf56nj8H1q3L7p87B8yZY36NU9urKGbLkjQW08WZ70zNbk6RTjN28KB1s9rhw+58/1rTHu37BQ1nozz6KpSGh4EtW4CzZ61fs2uX3Ho7O43Podba1aUeuyMz1PjZQts1BucNGxi7fTv3PDpGv/HnXrvmrBUmuoX29qqnkm1tsg6pxaJF8m/U8pRpKalIdXX266TxkJfaQTsaA9NDGxv1yVRAv9F0063hhISLkS8qUSHh58/nH2/9MD4nitClS7NlEkwbNwJ37uSeR8dIePGtc/VqezMdUmHsbrETSul0rrBRtupqY9WJrjFTnbzwenrxnnpCydcWWlwsCxtyomnx7Jn+NXSukfCKAwKfKV2+DLx7l9VN168Hpk2Tu7jZTCmK0JspBUZoEqFHaOHDL49RINRjFAhNssV+QGOi88PN4XcdkSK0q0vth/JDOPpdh+eEijZnIGZxoPmCcq0gaGdepFqo3aBcKwhaBSwIpai3UMlCiyCXrVMPJhlCzLyUZLHyOnYqVl1+lk3nWD7/OUWrhElo6F2+ImbR0pGJbVrFOdKsGpL51rh7d7Q/swk8timVyhLKd0lKXGAEfpwlb6gVten1a4SKwMfQBw/U+zNm+Ks2JZ7Q2lrgwwf5wy1qaWaKNx8nRSGMcUAoUr5YJxxRJ8dH3lnO3LlyKE8iCc0XbtjcLFvmefBd10kALZEZpsvYV0LzhRuezROOE8bHuonUQ5WuOzSERGBCWMG2tbXWYvLdQvlymYRaEJ7UCXEOtu3pMZ6Kaocf+rODMOX5JuVbWrIt1ssYdq1v38i/rwV9GBY0oSPKN4sjI+6/90yl1MkErIBmTV7GuytRfxSEZjYjc4JPn9S7eoR+ADCq2JDirVVxgkBdXf4QRprTK9NQLYJMq6ERokN6hNIseJoyHw6DUCuIioFEYzN4rac2PVIKSQgr9BuPMmyN4qEeoZl44ytXvK28tdVZuKEfapRXuHpVtXtTj9BupXDyZEBPFWNoOOrOIVSS8ATAXSpTPqKjR4N9wDiBuOFyNt0d4y43w60oYiuAPxTXBI0TScsuNuAycoRsDpQRhxNK2yQJ2eZXSCboYzLBQrpLj9NdGiVkpWSk4x0XnSZkNUoZ7DR9WxLgOmUwl9S6n7/Rnj3jK6doOi3LEddJrTlSKwSB9fE3LKRdZxVmnFldGICWcKjnj5OxllI+rlgBzJsHVFYCU6cCQiR8ANbx+TMwOAi8egU8fSrPEg0WBiBVfme+hQHsLF2xFsBv43Tpip8lCX/5ubgKpRb+CsnGPV8XVzFY/ocyu34DYB6ASgBTo+L4s4HPAAYBvALwFMDfZB8KZPmfAvIjbq0JUcf/IkGRJSqY/bIAAAAASUVORK5CYII=) !important;\n}\n\n/* BEST badge */\n.best-pill {\n  position: absolute !important;\n  top: 12px !important;\n  left: 12px !important;\n  z-index: 50 !important;\n  display: flex !important;\n  align-items: center !important;\n  justify-content: center !important;\n  width: 44px !important;\n  height: 22px !important;\n  background: linear-gradient(135deg, #4a7cff, #0838f8) !important;\n  color: #fff !important;\n  font-size: 11px !important;\n  font-weight: 800 !important;\n  letter-spacing: 1px !important;\n  border-radius: 6px !important;\n  line-height: 1 !important;\n  pointer-events: none !important;\n}\n\n/* Management icons bigger on mobile */\n@media (max-width: 768px) {\n  .event img[src*=\"482e20b9860dcd908c01baf733cbfec2\"],\n  .event img[src*=\"48b1a4742387bc142eb517efe727f761\"],\n  .event img[src*=\"bfa152f515994c9358ecd6b0f64b17a3\"],\n  .event img[src*=\"f8c5799a7f777e5534cbb96a59e13529\"],\n  .event img[src*=\"5c48f9cb457af0e581e11cc74aa65143\"],\n  .event img[src*=\"26d7833b590e101e709069aea9dbd52f\"],\n  .event img[src*=\"03ab60d0e08bf5609dd07aec0cc7db15\"],\n  .event img[src*=\"49509ccee80aad14fd365d342c1c7e3c\"],\n  .event img[src*=\"81872628b3b4fc81fd9d6ae1e54820cd\"],\n  .event img[src*=\"7ee45ed05b34833a69acdf917960839b\"],\n  .event img[src*=\"60b7c4bd9c9a46c7e91dc40d3ee9c66d\"] {\n    transform: scale(1.5) translateX(3px) !important;\n    transform-origin: top right !important;\n  }\n  .best-pill {\n    left: 9px !important;\n  }\n\n}\n\n/* === Global orange override === */\n\n/* All elements with inline dd5119 color */\n[style*=\"dd5119\"],\n[style*=\"DD5119\"] {\n  color: #0838f8 !important;\n}\n[style*=\"background-color: #dd5119\"],\n[style*=\"background-color:#dd5119\"],\n[style*=\"background-color: #DD5119\"],\n[style*=\"background-color:#DD5119\"] {\n  background-color: #0838f8 !important;\n}\n\n/* ff7a4c / ff6325 / ff9752 / e8601a inline styles */\n[style*=\"ff7a4c\"], [style*=\"FF7A4C\"],\n[style*=\"ff6325\"], [style*=\"FF6325\"],\n[style*=\"ff9752\"], [style*=\"FF9752\"],\n[style*=\"ff1818\"], [style*=\"FF1818\"],\n[style*=\"e8601a\"], [style*=\"E8601A\"] {\n  color: #0838f8 !important;\n}\n\n/* 제휴카드안내 button in rental comparison (exclude month_box) */\n.card a[href=\"javascript:\"]:not(.month_box),\n.rantal_wrap a[href=\"javascript:\"]:not(.month_box) {\n  background-color: #0838f8 !important;\n}\n\n/* Rental card red_small text */\n.red_small,\n.red,\ntd.red {\n  color: #0838f8 !important;\n}\n\n/* 전체보기 button if orange */\n.cs__benefit a {\n  border-color: #0838f8 !important;\n}\n\n/* Product list hover overlay - blue background, white text */\n.prod_list .thumb::before {\n  border-bottom-color: #0838f8 !important;\n}\n.prod_list .thumb::after {\n  color: #ffffff !important;\n}\n.prod_list .go {\n  background: #0838f8 !important;\n}\n\n/* Subcategory hover */\n.prod_list__cate > li:hover {\n  background-color: #0838f8 !important;\n  color: #ffffff !important;\n}\n\n/* Search page colors */\n.search__keyword,\n.search_keyword,\n.search-keyword,\n.keyword,\n.search__tit,\n.search_result .keyword,\n.result__keyword {\n  color: #0838f8 !important;\n}\n.search__count,\n.search_count,\n.result__count,\n.search_result b,\n.search_result strong {\n  color: #0838f8 !important;\n}\n.search__line,\n.search_line,\n.search__tit,\n.search-page hr,\n.search_result {\n  border-color: #0838f8 !important;\n}\n[style*=\"color: #dd5119\"],\n[style*=\"color:#dd5119\"],\n[style*=\"color: #e65100\"],\n[style*=\"color:#e65100\"],\n[style*=\"color: #ff6600\"],\n[style*=\"color:#ff6600\"],\n[style*=\"color: rgb(221, 81, 25)\"],\n[style*=\"border-bottom: 2px solid #dd5119\"],\n[style*=\"border-bottom: 2px solid rgb(221, 81, 25)\"] {\n  color: #0838f8 !important;\n  border-color: #0838f8 !important;\n}\n\n/* === Order page orange → blue === */\n.btn_large.c1,\nbutton.plain.btn_large.c1 {\n  background-color: #0838f8 !important;\n}\nem.dh_red,\n.dh_red {\n  color: #0838f8 !important;\n}\nh3.part_tit,\n.order-field,\n.cart-list {\n  border-top-color: #0838f8 !important;\n}\ntable.order-field thead tr,\ntable.cart-list thead tr {\n  border-top-color: #0838f8 !important;\n}\n.red_box {\n  border-top-color: #0838f8 !important;\n}\ntd.red.card_dc,\ntd.red.card_dc a,\ntd.red.card_dc b,\n.card_dc,\n.card_dc a {\n  color: #0838f8 !important;\n}\n\n\n/* === Combined Month + Payment Section === */\n\n.prod_view_bot.card .card__top {\n  background: #f8f9ff !important;\n  border: none !important;\n  border-radius: 12px 12px 0 0 !important;\n  padding: 16px 20px !important;\n  margin-bottom: 0 !important;\n}\n.prod_view_bot.card .card__top p {\n  font-size: 14px !important;\n  color: #333 !important;\n}\n.prod_view_bot.card .card__top span {\n  color: #0838f8 !important;\n  font-weight: 700 !important;\n}\n\n.month {\n  display: flex !important;\n  gap: 8px !important;\n  flex-wrap: wrap !important;\n  padding: 12px 0 !important;\n}\n.month > div {\n  flex: 1 !important;\n  min-width: 120px !important;\n}\n.month > div a.month_box {\n  display: flex !important;\n  flex-direction: column !important;\n  align-items: center !important;\n  justify-content: center !important;\n  padding: 14px 10px !important;\n  border-radius: 10px !important;\n  border: 2px solid #e0e0e0 !important;\n  background: #fff !important;\n  transition: all 0.2s ease !important;\n  text-decoration: none !important;\n  height: auto !important;\n}\n.month > div a.month_box:hover {\n  border-color: #0838f8 !important;\n  background: #f0f3ff !important;\n}\n.month > div.on a.month_box {\n  border-color: #0838f8 !important;\n  background: #0838f8 !important;\n  color: #fff !important;\n  box-shadow: 0 4px 12px rgba(8, 56, 248, 0.3) !important;\n}\n.month > div.on a.month_box p {\n  color: #fff !important;\n}\n.month > div a.month_box p.fz14 {\n  font-size: 12px !important;\n  color: #888 !important;\n  margin-bottom: 4px !important;\n}\n.month > div a.month_box p.fz16 {\n  font-size: 15px !important;\n  font-weight: 700 !important;\n  color: #222 !important;\n}\n.month > div.on a.month_box p.fz14,\n.month > div.on a.month_box p.fz16 {\n  color: #fff !important;\n}\n\n.month_click {\n  display: none !important;\n}\n@media (min-width: 768px) {\n  .fix_price.hide-767 {\n    display: flex !important;\n    gap: 18px !important;\n    align-items: center !important;\n    justify-content: center !important;\n    flex-wrap: wrap !important;\n  }\n  /* bugfix: 네이티브 .box(라벨+가격)가 inject의 flex-row 부모 안에서 좌우/상하 정렬이 깨짐 → 박스 레이아웃을 명시 */\n  .fix_price.hide-767 .box {\n    flex: 0 1 auto !important;\n    min-width: 0 !important;\n    max-width: 100% !important;\n    display: flex !important;\n    flex-direction: row !important;\n    align-items: center !important;\n    justify-content: space-between !important;\n    gap: 10px !important;\n  }\n  /* 카드할인 없는 제품의 .box.org(카드할인가)는 inline style=display:none — 항상 존중(빈 박스 강제 노출 방지) */\n  .fix_price.hide-767 .box[style*=\"none\"] {\n    display: none !important;\n  }\n  .fix_price.hide-767 .box .tit {\n    flex: 0 0 auto !important;\n    margin: 0 !important;\n    line-height: 1.2 !important;\n    white-space: nowrap !important;\n  }\n  .fix_price.hide-767 .box .align-r {\n    flex: 0 0 auto !important;\n    text-align: right !important;\n    margin: 0 !important;\n    line-height: 1.2 !important;\n  }\n}\n@media (max-width: 767px) {\n  .prod_view_top .fix_price,\n  .prod_view_top .prod_name {\n    display: none !important;\n  }\n}\n\n/* === Sticky Bottom Bar v4 === */\n#billyjo-bottom-bar {\n  position: fixed !important;\n  bottom: 0 !important;\n  left: 0 !important;\n  right: 0 !important;\n  z-index: 9999 !important;\n  background: #fff !important;\n  border-top: 1px solid #e0e0e0 !important;\n  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.08) !important;\n  padding: 0 !important;\n  transform: translateY(100%) !important;\n  transition: transform 0.3s ease !important;\n}\n#billyjo-bottom-bar.show {\n  transform: translateY(0) !important;\n}\n\n#billyjo-bottom-bar .bb-inner {\n  max-width: 1200px !important;\n  margin: 0 auto !important;\n  display: flex !important;\n  align-items: stretch !important;\n  padding: 18px 28px !important;\n  gap: 0 !important;\n}\n\n/* Left column: name + month pills */\n#billyjo-bottom-bar .bb-left {\n  display: flex !important;\n  flex-direction: column !important;\n  justify-content: center !important;\n  gap: 12px !important;\n  flex: 1 !important;\n  min-width: 0 !important;\n  padding-right: 28px !important;\n}\n#billyjo-bottom-bar .bb-product-name {\n  font-size: 16px !important;\n  font-weight: 700 !important;\n  color: #222 !important;\n  white-space: nowrap !important;\n  overflow: hidden !important;\n  text-overflow: ellipsis !important;\n}\n#billyjo-bottom-bar .bb-months {\n  display: flex !important;\n  gap: 8px !important;\n  overflow-x: auto !important;\n  -webkit-overflow-scrolling: touch !important;\n  scrollbar-width: none !important;\n}\n#billyjo-bottom-bar .bb-months::-webkit-scrollbar {\n  display: none !important;\n}\n#billyjo-bottom-bar .bb-month-pill {\n  display: flex !important;\n  flex-direction: column !important;\n  align-items: center !important;\n  justify-content: center !important;\n  padding: 8px 20px !important;\n  border-radius: 8px !important;\n  border: 1.5px solid #d0d0d0 !important;\n  background: #f5f5f5 !important;\n  cursor: pointer !important;\n  transition: all 0.2s ease !important;\n  white-space: nowrap !important;\n  flex-shrink: 0 !important;\n  min-width: 110px !important;\n  text-align: center !important;\n}\n#billyjo-bottom-bar .bb-month-pill:hover {\n  border-color: #0838f8 !important;\n  background: #f0f3ff !important;\n}\n#billyjo-bottom-bar .bb-month-pill.active {\n  border-color: #0838f8 !important;\n  background: #0838f8 !important;\n  box-shadow: 0 2px 8px rgba(8, 56, 248, 0.3) !important;\n}\n#billyjo-bottom-bar .bb-month-period {\n  font-size: 11px !important;\n  color: #777 !important;\n  line-height: 1.4 !important;\n}\n#billyjo-bottom-bar .bb-month-price {\n  font-size: 14px !important;\n  font-weight: 700 !important;\n  color: #222 !important;\n  line-height: 1.4 !important;\n}\n#billyjo-bottom-bar .bb-month-pill.active .bb-month-period,\n#billyjo-bottom-bar .bb-month-pill.active .bb-month-price {\n  color: #fff !important;\n}\n\n/* Right column: option+buttons top, price bottom */\n#billyjo-bottom-bar .bb-right {\n  display: flex !important;\n  flex-direction: column !important;\n  justify-content: flex-end !important;\n  gap: 14px !important;\n  flex-shrink: 0 !important;\n  padding-left: 28px !important;\n  min-width: 360px !important;\n}\n#billyjo-bottom-bar .bb-right-top {\n  display: flex !important;\n  align-items: center !important;\n  gap: 10px !important;\n}\n#billyjo-bottom-bar .bb-option-select {\n  padding: 10px 12px !important;\n  border: 1px solid #ddd !important;\n  border-radius: 8px !important;\n  font-size: 13px !important;\n  background: #fff !important;\n  color: #555 !important;\n  flex: 1 !important;\n  min-width: 120px !important;\n  cursor: pointer !important;\n}\n#billyjo-bottom-bar .bb-btn {\n  display: inline-flex !important;\n  align-items: center !important;\n  justify-content: center !important;\n  gap: 6px !important;\n  padding: 10px 22px !important;\n  border-radius: 8px !important;\n  font-size: 14px !important;\n  font-weight: 700 !important;\n  cursor: pointer !important;\n  border: none !important;\n  white-space: nowrap !important;\n  transition: all 0.2s ease !important;\n}\n#billyjo-bottom-bar .bb-btn-cart {\n  background: #fff !important;\n  color: #0838f8 !important;\n  border: 2px solid #0838f8 !important;\n}\n#billyjo-bottom-bar .bb-btn-cart:hover {\n  background: #f0f3ff !important;\n}\n#billyjo-bottom-bar .bb-btn-rent {\n  background: #0838f8 !important;\n  color: #fff !important;\n}\n#billyjo-bottom-bar .bb-btn-rent:hover {\n  background: #0626c0 !important;\n}\n#billyjo-bottom-bar .bb-btn-rent svg {\n  width: 16px !important;\n  height: 16px !important;\n  fill: #fff !important;\n}\n\n/* Right bottom: price row */\n#billyjo-bottom-bar .bb-right-bottom {\n  display: flex !important;\n  align-items: center !important;\n  justify-content: flex-end !important;\n  gap: 12px !important;\n  margin-top: 4px !important;\n}\n#billyjo-bottom-bar .bb-price-label {\n  font-size: 14px !important;\n  color: #222 !important;\n  white-space: nowrap !important;\n}\n#billyjo-bottom-bar .bb-sup-tabs {\n  display: flex !important;\n  gap: 6px !important;\n  margin-bottom: 10px !important;\n  overflow-x: auto !important;\n  scrollbar-width: none !important;\n}\n#billyjo-bottom-bar .bb-sup-tabs::-webkit-scrollbar { display: none !important; }\n#billyjo-bottom-bar .bb-sup-tab {\n  padding: 5px 14px !important;\n  border-radius: 6px !important;\n  border: 1.5px solid #d0d0d0 !important;\n  background: #fff !important;\n  color: #666 !important;\n  font-size: 12px !important;\n  font-weight: 600 !important;\n  cursor: pointer !important;\n  transition: all 0.2s ease !important;\n  white-space: nowrap !important;\n  flex-shrink: 0 !important;\n}\n#billyjo-bottom-bar .bb-sup-tab.active {\n  background: #0838f8 !important;\n  border-color: #0838f8 !important;\n  color: #fff !important;\n}\n#billyjo-bottom-bar .bb-month-pill.bb-hidden {\n  display: none !important;\n}\n#billyjo-bottom-bar.bb-no-option .bb-right-top {\n  justify-content: flex-end !important;\n}\n#billyjo-bottom-bar .bb-right-bottom {\n  justify-content: flex-end !important;\n}\n#billyjo-bottom-bar .bb-price {\n  display: inline-block !important;\n  text-align: right !important;\n  padding: 0 !important;\n  border: none !important;\n  border-radius: 0 !important;\n  font-size: 22px !important;\n  font-weight: 800 !important;\n  white-space: nowrap !important;\n  color: #999 !important;\n  background: #fff !important;\n}\n#billyjo-bottom-bar:not(.no-selection) .bb-price {\n  color: #0838f8 !important;\n  background: #fff !important;\n}\n\n/* Mobile responsive */\n@media (max-width: 767px) {\n  #billyjo-bottom-bar .bb-inner {\n    flex-direction: column !important;\n    padding: 12px 16px 14px !important;\n    gap: 10px !important;\n  }\n  #billyjo-bottom-bar .bb-left {\n    padding-right: 0 !important;\n    border-right: none !important;\n    border-bottom: 1px solid #e0e0e0 !important;\n    padding-bottom: 10px !important;\n    gap: 8px !important;\n  }\n  #billyjo-bottom-bar .bb-product-name {\n    font-size: 14px !important;\n  }\n  #billyjo-bottom-bar .bb-right {\n    padding-left: 0 !important;\n    min-width: 0 !important;\n    gap: 10px !important;\n  }\n  #billyjo-bottom-bar .bb-right-top {\n    flex-wrap: wrap !important;\n  }\n  #billyjo-bottom-bar .bb-option-select {\n    flex: 1 1 100% !important;\n  }\n  #billyjo-bottom-bar .bb-btn {\n    flex: 1 !important;\n    padding: 12px 16px !important;\n    font-size: 13px !important;\n  }\n  #billyjo-bottom-bar .bb-month-pill {\n    min-width: 80px !important;\n    padding: 6px 14px !important;\n  }\n  #billyjo-bottom-bar .bb-month-period {\n    font-size: 10px !important;\n  }\n  #billyjo-bottom-bar .bb-month-price {\n    font-size: 12px !important;\n  }\n  #billyjo-bottom-bar .bb-price {\n    font-size: 18px !important;\n  }\n\n  .prod_fix_wrap.prod_fix_m {\n    display: none !important;\n  }\n\n  .month > div {\n    min-width: calc(50% - 4px) !important;\n    flex: 0 0 calc(50% - 4px) !important;\n  }\n}\n\nbody:has(#billyjo-bottom-bar.show) {\n  padding-bottom: 130px !important;\n}\n\n/* Hide old sticky bars */\n.prod_fix_wrap.prod_fix,\n.prod_fix_wrap.prod_fix_m {\n  display: none !important;\n}\n\n/* === 고객센터 orange → blue === */\n.service__tab a.active {\n  background-color: #0838f8 !important;\n}\n.service__tab a.active p {\n  color: #fff !important;\n}\n.online_field {\n  border-color: #0838f8 !important;\n}\nbutton.btn_large,\n.plain.btn_large {\n  background-color: #0838f8 !important;\n}\n.tit__param02 span {\n  color: #0838f8 !important;\n}\n/* Hide category sections on main page */\n.prod_scroll:has(a[href*=\"prod_list/10-\"]),\n.prod_scroll:has(a[href*=\"prod_list/4-\"]),\n.prod_scroll:has(a[href*=\"prod_list/5-\"]),\n.prod_scroll:has(a[href*=\"prod_list/7-\"]),\n.prod_scroll:has(a[href*=\"prod_list/11-\"]) {\n  display: none !important;\n}\n\n/* Hide left side navigation dots */\n.w_gnb4,\n.pc_gnb4,\n#gnb_side,\n.side_cate_nav,\n.filter__btn {\n  display: none !important;\n}\n\n/* Push quick consultation button above bottom bar */\n.new-qb {\n  transition: bottom 0.3s ease !important;\n}\nbody:has(#billyjo-bottom-bar.show) .new-qb {\n  bottom: 140px !important;\n}\n\n/* PC 원형 퀵버튼(.org) — 아이콘 중앙정렬 28px, 53px 원에 못 들어가는 라벨은 숨김(title 툴팁 제공) */\n.new-qb .org a {\n  position: relative !important;\n  overflow: hidden !important;\n}\n.new-qb .org img[src*=\"q_call\"],\n.new-qb .org img[src*=\"phonecall\"] {\n  width: 28px !important;\n  height: 28px !important;\n  position: absolute !important;\n  left: 50% !important;\n  top: 50% !important;\n  transform: translate(-50%, -50%) !important;\n  margin: 0 !important;\n}\n.new-qb .org a span {\n  display: none !important;\n}\n\n/* 간편문의 팝업 타이틀의 q_call 아이콘 — GIF 교체 후 적정 크기 */\n.call_tit img[src*=\"q_call\"] {\n  width: 30px !important;\n  height: 30px !important;\n}\n\n/* === 제품 리스트 가격 블록(.fee/.fee2) 간격 정규화 (2026-06-08) ===\n   native가 .fee(line-height 19.5px·pt 10px)와 .fee2(line-height 21.7px·pb 15px)에\n   서로 다른 값을 줘 ´월 렌탈료´/´제휴카드 할인´ 두 줄 간격·상하 여백이 불규칙했음. */\n.prod_list .item .fee,\n.prod_list .item .fee2 {\n  margin: 0 !important;\n  padding: 0 !important;\n  line-height: 1.45 !important;\n  min-height: 0 !important;\n  display: flex !important;\n  align-items: baseline !important;\n  justify-content: space-between !important;\n}\n.prod_list .item .fee { margin: 12px 15px 0 !important; }\n.prod_list .item .fee2 { margin: 5px 15px 12px !important; }\n.prod_list .item .fee .label,\n.prod_list .item .fee2 .label,\n.prod_list .item .fee .price,\n.prod_list .item .fee2 .price {\n  margin: 0 !important;\n  padding: 0 !important;\n  line-height: 1.45 !important;\n}\n\n/* fee2 가격 우측정렬 버그 수정 (2026-06-12): native .fee2::after(clearfix, content 빈문자열)가 inject display:flex 하에서 3번째 flex 아이템이 되어 space-between이 가격을 가운데로 밀었음. ::after 숨겨 해결. .fee::after는 content:none이라 영향 없음. */\n.prod_list .item .fee::after,\n.prod_list .item .fee2::after { display: none !important; }\n/* 모바일(<=640px)은 native .txt가 margin0+padding7로 전환되므로 가격줄도 7px로 맞춤 */\n@media (max-width: 640px) {\n  .prod_list .item .fee, .prod_list .item .fee2 { margin-left: 7px !important; margin-right: 7px !important; }\n}\n/* === 가격부분 재디자인 (시안2: 절감액 배지) — JS가 bj-pz 생성, native .fee/.fee2 숨김. JS 미작동 시 위 fee 규칙이 폴백 === */\n.prod_list .item[data-bjp] .fee, .prod_list .item[data-bjp] .fee2 { display: none !important; }\n.prod_list .item[data-bjp] .txt { border-bottom: 0 !important; }\n.prod_list .item .bj-pz { margin: 14px 15px 16px; padding-top: 11px; border-top: 1px solid #ececf0; font-variant-numeric: tabular-nums; }\n@media (max-width: 640px){ .prod_list .item .bj-pz { margin-left: 7px; margin-right: 7px; } }\n.prod_list .item .bj-pz-top { display: flex; align-items: baseline; justify-content: space-between; gap: 8px; margin-bottom: 4px; }\n.prod_list .item .bj-pz-lbl { font-size: 12px; color: #9a9aa3; font-weight: 600; letter-spacing: -.01em; }\n.prod_list .item .bj-pz-orig { font-size: 12px; color: #bcbcc4; text-decoration: line-through; text-decoration-thickness: 1px; white-space: nowrap; }\n.prod_list .item .bj-pz-now { font-size: 23px; font-weight: 800; color: #1a1a1e; letter-spacing: -.03em; line-height: 1.1; margin-top: 2px; }\n.prod_list .item .bj-pz-now.bj-pz-single { color: #1a1a1e; }\n.prod_list .item .bj-pz-won { font-size: .62em; font-weight: 700; margin-left: 1px; }\n.prod_list .item .bj-pz-per { font-size: .5em; color: #9a9aa3; font-weight: 600; margin-left: 3px; letter-spacing: -.02em; }\n.prod_list .item .bj-pz-card { margin-top: 9px; display: flex; align-items: baseline; gap: 6px; background: #eaefff; color: #0838f8; padding: 6px 10px; border-radius: 8px; } .prod_list .item .bj-pz-card-lbl { font-size: 11.5px; font-weight: 700; letter-spacing: -.01em; } .prod_list .item .bj-pz-card-num { font-size: 15px; font-weight: 800; letter-spacing: -.02em; margin-left: auto; } .prod_list .item .bj-pz-card-per { font-size: 10px; font-weight: 600; opacity: .85; }\n.prod_list .item .bj-pz-save b { font-weight: 800; margin-left: 4px; }\n/* 카드 정렬: 이름 2줄 고정 + 단일카드 배지자리 + 이미지 여백 축소(70%) + 행간 */\n.prod_list { row-gap: 28px !important; align-items: stretch !important; } .prod_list .item[data-bjp] { display: flex !important; flex-direction: column !important; } .prod_list .item[data-bjp] .box { display: flex !important; flex-direction: column !important; flex: 1 1 auto !important; } .prod_list .item[data-bjp] .box > a { flex: 1 1 auto !important; }\n\n.prod_list .item[data-bjp] .name { display: -webkit-box !important; -webkit-line-clamp: 2 !important; -webkit-box-orient: vertical !important; overflow: hidden !important; min-height: 0 !important; }\n.prod_list .item .bj-pz-ph { visibility: hidden !important; }\n/* 배지/가격이 카드 하단에 붙던 문제: 흰카드(.box)에 하단 패딩 + bj-pz margin collapse 제거 */\n.prod_list .item[data-bjp] .box { padding-bottom: 0 !important; }\n.prod_list .item[data-bjp] .bj-pz { margin-top: 5px !important; margin-bottom: 0 !important; padding-bottom: 13px !important; }\n.prod_list .item[data-bjp] .txt { padding-bottom: 4px !important; }\n/* Hide mobile header until JS redesign runs.\n   !important 금지 + 1.2s 자동 공개 애니메이션 — 어떤 이유로든 bj-ready가 안 붙어도\n   (스크립트 일부 실패, >768 로드 후 회전 등) 헤더가 영구히 가려지지 않게 fail-safe. */\n@media (max-width: 768px) {\n  header:not(.bj-ready) { opacity: 0; animation: bjHdrReveal 0.25s ease 1.2s forwards; }\n  header.bj-ready { opacity: 1 !important; transition: opacity 0.2s ease !important; }\n}\n@keyframes bjHdrReveal { to { opacity: 1; } }\n";
  var style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  // === 메인 카테고리 섹션 제목 텍스트 숨김 (시안 반영, 2026-07-02) ===
  //   아이콘은 유지, 제목만: PC ".new-mc__tit"(고객님들이 많이 찾는 주요 카테고리) / 모바일 ".m_tit"(인기 카테고리)
  (function hideCategoryTitle() {
    if (document.getElementById('bj-hide-cat-title')) return;
    var s = document.createElement('style');
    s.id = 'bj-hide-cat-title';
    s.textContent = '.new-mc .new-mc__tit, .new-mc .m_tit{display:none !important}';
    (document.head || document.documentElement).appendChild(s);
  })();

  // === 메인/중간 배너 폭을 콘텐츠(아이콘) 폭 1280에 맞춰 축소 (비율 유지, ≥1280 데스크톱만) (2026-07-02) ===
  //   메인(.new-mv_wrap): slick이 resize로 슬라이드 폭 재계산 → img width:100%로 축소.
  //   중간(.new-mb): 고정 1680 슬라이드라 img width 1280 강제 → 비율 유지(202).
  (function fitBanners() {
    if (document.getElementById('bj-banner-fit')) return;
    var s = document.createElement('style');
    s.id = 'bj-banner-fit';
    s.textContent = '@media(min-width:1280px){' +
      '.new-mv_wrap{max-width:1280px !important;margin-left:auto !important;margin-right:auto !important}' +
      '.new-mv_wrap .slick-slide img{width:100% !important;height:auto !important}' +
      '.new-mb{max-width:1280px !important;margin-left:auto !important;margin-right:auto !important;height:auto !important;overflow:hidden !important}' +
      '.new-mb .slick-list,.new-mb .slick-track,.new-mb .slick-slide,.new-mb .slick-slide>a{height:auto !important}' +
      '.new-mb .slick-slide img{width:1280px !important;max-width:1280px !important;height:auto !important;display:block !important}' +
      '}';
    (document.head || document.documentElement).appendChild(s);
    // 히어로 slick이 슬라이드 폭을 재계산하도록 resize 발사 (init 타이밍 커버)
    function kick() { try { window.dispatchEvent(new Event('resize')); } catch (e) {} }
    [100, 600, 1500, 3000].forEach(function(t) { setTimeout(kick, t); });
    if (document.readyState !== 'complete') window.addEventListener('load', kick);
  })();

  // === 메인 상단 세로 여백 정리 (배너 축소·카테고리 제목 숨김 후 빈 공간 축소, 2026-07-02) ===
  //   히어로→아이콘, 아이콘→다음 섹션 사이 과한 마진을 디자인적으로 축소. ≥769 데스크톱만.
  (function tightenMainSpacing() {
    if (document.getElementById('bj-main-spacing')) return;
    var s = document.createElement('style');
    s.id = 'bj-main-spacing';
    s.textContent = '@media(min-width:769px){' +
      '.new-mc{padding-top:40px !important;padding-bottom:48px !important}' +
      '.new-mc .new-mc__list{margin-top:12px !important}' +
      '.m_outer{padding-top:24px !important}' +
      '}';
    (document.head || document.documentElement).appendChild(s);
  })();

  // === 히어로 배너 네비게이션(화살표·닷) 축소 (2026-07-02) ===
  //   화살표 .arrow__prev/next 53x95(bg-image cover)→32x56, 닷 대시 95px→36px. ≥769 데스크톱.
  (function shrinkHeroNav() {
    if (document.getElementById('bj-hero-nav')) return;
    var s = document.createElement('style');
    s.id = 'bj-hero-nav';
    s.textContent = '@media(min-width:769px){' +
      '.new-mv_wrap .arrow__prev,.new-mv_wrap .arrow__next{width:32px !important;height:56px !important}' +
      '.new-mv_wrap .slick-dots li,.new-mv_wrap .slick-dots li button{width:36px !important}' +
      '}';
    (document.head || document.documentElement).appendChild(s);
  })();

  // === 중간 배너 화살표를 메인 배너 스타일로 통일 (흰 원형 → 히어로 쉐브론, 양끝·세로중앙) (2026-07-02) ===
  (function matchMidBannerNav() {
    if (document.getElementById('bj-mid-nav')) return;
    var A = 'background-size:contain !important;background-repeat:no-repeat !important;background-position:center !important;width:32px !important;height:56px !important;top:50% !important;margin-top:-28px !important;bottom:auto !important;z-index:5 !important;';
    var s = document.createElement('style');
    s.id = 'bj-mid-nav';
    s.textContent = '@media(min-width:769px){' +
      '.new-mb{position:relative !important}' +
      '.new-mb .arrows{position:static !important}' +
      '.new-mb .arrow__prev{position:absolute !important;background-image:url("https://billyjo.kr/image/main/new-mv_left.png") !important;left:20px !important;right:auto !important;' + A + '}' +
      '.new-mb .arrow__next{position:absolute !important;background-image:url("https://billyjo.kr/image/main/new-mv_right.png") !important;right:20px !important;left:auto !important;' + A + '}' +
      '}';
    (document.head || document.documentElement).appendChild(s);
  })();

  // === 헤더 GNB 겹침 수정 (카테고리 10개가 넘쳐 우측 고객센터/장바구니와 겹침) (2026-07-02) ===
  //   .gnb__menu margin-right 25px → 10px 로 GNB 폭 축소 → '모바일' 항목이 '고객센터' 아래 깔리던 겹침 해소.
  (function fixGnbOverlap() {
    if (document.getElementById('bj-gnb-fit')) return;
    var s = document.createElement('style');
    s.id = 'bj-gnb-fit';
    s.textContent = '@media(min-width:1024px){.new-gnb .gnb__menu{margin-right:10px !important}}';
    (document.head || document.documentElement).appendChild(s);
  })();

  // === 모바일 히어로 배너: 720x378 비율 고정 + 잔여 여백 제거 ===
  // 모바일 배너(.m.show-1024, ≤1024px)는 720x378로 통일. 일부 배너가 아직 720x880이라
  // 컨테이너가 길게 늘어나 아래 여백이 생김 → 비율 강제 + height:auto로 컨테이너를
  // 배너 높이에 맞춰 줄여 하단 콘텐츠를 위로 당김. object-fit:contain(가운데)로
  // 720x378은 박스를 꽉 채우고, 미변경 720x880은 잘리지 않게 축소+가운데 정렬(좌우 흰 여백).
  var heroFix = document.createElement("style");
  heroFix.id = "bj-mobile-hero-fix";
  heroFix.textContent =
    "@media (max-width:1024px){" +
    ".new-mv_wrap,.new-mv,.new-mv .slick-list,.new-mv .slick-track," +
    ".new-mv .slick-slide,.new-mv .slick-slide>div,.new-mv .slick-slide a{" +
    "height:auto !important;min-height:0 !important;max-height:none !important;}" +
    ".new-mv_wrap,.new-mv .slick-list{overflow:hidden !important;}" +
    ".new-mv .slick-slide img{" +
    "width:100% !important;height:auto !important;aspect-ratio:720/378 !important;" +
    "object-fit:contain !important;object-position:center !important;background:#fff !important;display:block !important;}" +
    "}";
  document.head.appendChild(heroFix);

  // === 카테고리바/GNB 항목 수직정렬 통일 ===
  // BEST 항목(a=inline-flex+🏆)과 일반 항목(a=block/inline)의 텍스트 baseline이 어긋나
  // BEST만 정렬 맞고 나머지가 위로 떠보이던 문제 → 전 항목을 동일 박스(inline-flex/
  // align-items:center/height·line-height)로 강제하고 이모지 span의 line-height·
  // vertical-align을 통일해 델타 0. 모바일 카테고리바(≤1024) + 데스크톱 GNB(≥1025) 모두.
  var catAlign = document.createElement("style");
  catAlign.id = "bj-cat-align";
  catAlign.textContent =
    "@media (max-width:1024px){" +
    ".category__wrap>a{display:inline-flex !important;align-items:center !important;height:21px !important;line-height:21px !important;}" +
    ".category__wrap>a *{line-height:21px !important;vertical-align:middle !important;}" +
    "}" +
    "@media (min-width:1025px){" +
    "ul.new-gnb li.gnb__menu>a{display:inline-flex !important;align-items:center !important;height:23px !important;line-height:23px !important;}" +
    "ul.new-gnb li.gnb__menu>a *{line-height:23px !important;vertical-align:middle !important;}" +
    "}";
  document.head.appendChild(catAlign);

  // === 데스크톱 히어로 배너: 원본 전체 노출(잘림 방지) ===
  // 데스크톱 배너(.new-mv .pc, ≥약1240px)는 1920x560 배경이미지를 background-size:auto 100%로
  // 높이에 맞춰 폭이 넘쳐 좌우(특히 우측 가전)가 잘림. contain으로 바꿔 원본 비율 전체를 표시.
  // 모바일 배너(.m)와 무관(데스크톱 전용).
  var heroDeskFix = document.createElement("style");
  heroDeskFix.id = "bj-desktop-hero-fix";
  heroDeskFix.textContent =
    "@media (min-width:1025px){" +
    ".new-mv .slick-slide .pc{" +
    "background-size:contain !important;background-repeat:no-repeat !important;" +
    "background-position:center !important;}" +
    "}";
  document.head.appendChild(heroDeskFix);

  // === 헤더 아이콘 SVG 교체: 검색 돋보기 + 장바구니 쇼핑백 (브랜드 블루 라인) ===
  // 네이티브 PNG(search_icon/new-search_icon/cart_icon)가 테마와 안 어울려 깔끔한
  // Lucide 스타일 라인 SVG(#0838f8)로 교체. 모바일 헤더·데스크톱 검색버튼·스크롤헤더 모두 커버.
  (function bjHeaderIcons() {
    var SEARCH = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#aaaaaa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>';
    var BAG = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#aaaaaa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><path d="M3 6h18"></path><path d="M16 10a4 4 0 0 1-8 0"></path></svg>';
    function mk(svg) {
      var s = document.createElement('span');
      s.className = 'bj-hdr-svg';
      s.style.cssText = 'display:inline-flex;align-items:center;color:#0838f8';
      s.innerHTML = svg;
      return s.firstChild;
    }
    function swap() {
      var sr = document.querySelectorAll('img[src*="search_icon"],img[src*="new-search_icon"]');
      for (var i = 0; i < sr.length; i++) sr[i].replaceWith(mk(SEARCH));
      var ct = document.querySelectorAll('img[src*="cart_icon"]');
      for (var j = 0; j < ct.length; j++) ct[j].replaceWith(mk(BAG));
    }
    if (document.readyState !== 'loading') swap();
    else document.addEventListener('DOMContentLoaded', swap);
    var n = 0, t = setInterval(function () { swap(); if (++n >= 12) clearInterval(t); }, 300);
    // 스크롤 시 생성되는 스크롤헤더의 PNG 아이콘도 교체
    window.addEventListener('scroll', function () { setTimeout(swap, 50); }, { passive: true });
  })();

  // === JavaScript ===
  // --- Script block 1 ---

// Immediately hide product image and text on 국산차 detail page to prevent flash
if (location.pathname.indexOf('prod_view/2509') !== -1) {
  var imgHide = document.createElement('style');
  imgHide.id = 'img-hide';
  imgHide.textContent = '.prod_img_big img, .prod_img_small img, .slick-slide img { opacity: 0 !important; } .prod_name b, .model_name small, .fix_tit, .prod_fix_m .title { opacity: 0 !important; }';
  document.head.appendChild(imgHide);
}
// Hide filter sidebar on 신차렌트 pages
if (location.pathname.indexOf('prod_list/7-') !== -1) {
  var filterHide = document.createElement('style');
  filterHide.textContent = '.prod_list__filter { display: none !important; } .prod_list__wrap { padding-left: 0 !important; }';
  document.head.appendChild(filterHide);
}
// Immediately hide product list on 신차렌트 to prevent flash
if (location.pathname.indexOf('prod_list/7-') !== -1) {
  var hideStyle = document.createElement('style');
  hideStyle.id = 'car-hide';
  hideStyle.textContent = '.prod_list { opacity: 0 !important; transition: opacity 0.3s; }';
  document.head.appendChild(hideStyle);
}
// === 인터넷 상품 detail: 통신사별 디자인 배너 prepend ===
// 31628 KT 1G 단독 / 31617 LGU 기가1G WiFi / 31624 SK 1G WiFi
(function injectInternetCarrierBanner() {
  var BANNER_BY_ID = {
    '31628': 'kt',
    '31617': 'lguplus',
    '31624': 'sk'
  };
  var m = location.pathname.match(/prod_view\/(\d+)/);
  if (!m || !BANNER_BY_ID[m[1]]) return;
  var slug = BANNER_BY_ID[m[1]];
  var imgUrl = 'https://cdn.jsdelivr.net/gh/billyjo-appsilon/billyjo-inject@main/images/internet/' + slug + '.png';

  // CSS — match blue banner (49d) wrap pattern: 1100px wide, 30px top padding
  var bannerCss = document.createElement('style');
  bannerCss.id = 'bj-internet-banner-css';
  bannerCss.textContent =
    '.bj-internet-banner { display: block !important; width: 1100px !important; max-width: 100% !important; margin: 0 auto !important; height: auto !important; border-radius: 0 !important; }' +
    '.bj-internet-banner-wrap { padding: 30px 0 0 !important; margin: 0 !important; }' +
    /* 기존 통신사 비교 배너(3192f27b... 11321.jpg / 1141.png)만 숨김.
       49d... 파란 "다양한 렌탈사 보유" 배너는 같은 .img_wrap 컨테이너에
       있으므로 wrap 통째로 숨기지 말고 img만 숨겨야 함. */
    '.prod_view_detail img[src*="3192f27b"] { display: none !important; }';
  document.head.appendChild(bannerCss);

  function injectBanner() {
    var detail = document.querySelector('.prod_view_detail');
    if (!detail) return false;
    if (detail.querySelector('.bj-internet-banner')) return true;

    // Match the platform's .img_wrap pattern so 49d 파란 배너와 동일한 박스 스타일.
    var wrap = document.createElement('div');
    wrap.className = 'img_wrap bj-internet-banner-wrap';
    var img = document.createElement('img');
    img.src = imgUrl;
    img.alt = slug + ' 인터넷 요금 안내';
    img.className = 'bj-internet-banner';
    img.loading = 'eager';
    wrap.appendChild(img);

    // Insert AFTER the 49d (파란 "다양한 렌탈사 보유") img_wrap so blue stays on top.
    var blueImg = detail.querySelector('img[src*="49d1341011fb32fe0a14390db9314d35"]');
    var blueWrap = blueImg ? blueImg.closest('.img_wrap') : null;
    if (blueWrap && blueWrap.parentNode === detail) {
      blueWrap.parentNode.insertBefore(wrap, blueWrap.nextSibling);
    } else {
      // Fallback: append to end of detail
      detail.appendChild(wrap);
    }
    return true;
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectBanner);
  } else {
    injectBanner();
  }
  var bjBannerTries = 0;
  var bjBannerInterval = setInterval(function() {
    if (injectBanner() || ++bjBannerTries >= 12) clearInterval(bjBannerInterval);
  }, 400);
})();

// === 인터넷 카테고리 (6-1198): 1G WiFi 단독 3종(KT/LGU/SK)만 표시 ===
if (location.pathname.indexOf('prod_list/6-1198') !== -1) {
  // 31628 KT 1G 단독, 31617 LGU 기가1G WiFi, 31624 SK 1G WiFi
  var INTERNET_KEEP = ['31628','31617','31624'];
  var bjInternetHide = document.createElement('style');
  bjInternetHide.id = 'bj-internet-hide';
  bjInternetHide.textContent = '.prod_list .item.bj-internet-hide { display: none !important; }';
  document.head.appendChild(bjInternetHide);
  function bjMarkInternetItems() {
    var items = document.querySelectorAll('.prod_list .item');
    items.forEach(function(item) {
      var link = item.querySelector('a[href*="prod_view"]');
      if (!link) return;
      var m = (link.getAttribute('href') || '').match(/prod_view\/(\d+)/);
      if (!m) return;
      if (INTERNET_KEEP.indexOf(m[1]) === -1) {
        item.classList.add('bj-internet-hide');
      } else {
        item.classList.remove('bj-internet-hide');
      }
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bjMarkInternetItems);
  } else {
    bjMarkInternetItems();
  }
  var bjInternetTries = 0;
  var bjInternetInterval = setInterval(function() {
    bjMarkInternetItems();
    if (++bjInternetTries >= 10) clearInterval(bjInternetInterval);
  }, 400);
}
function bjHeaderMainInit() {
  // 안전망: logscript/위 CSS의 header:not(.bj-ready){opacity:0} guard로 인한 영구 가림 방지.
  // 모바일 redesign이 어떤 이유로든 스킵·실패해도(>768 로드 후 세로 회전, 셀렉터 미스,
  // 중간 예외) 1초 내 bj-ready를 보장해 헤더를 노출한다. (원래 코드는 ≤768 분기 끝에서만
  // bj-ready를 붙여, 그 경로를 못 타면 모바일 헤더가 영구 invisible이었음)
  setTimeout(function() {
    var safeHdr = document.querySelector('header');
    if (safeHdr && !safeHdr.classList.contains('bj-ready')) safeHdr.classList.add('bj-ready');
  }, 1000);

  // Mobile header redesign (ajd.co.kr style)
  if (window.innerWidth <= 768) {
    var iconList = document.querySelector('ul.inline_wrap.header_m_icon');
    var headerEl = document.querySelector('header');
    if (iconList && headerEl) {
      // 1. Extract event banner link, create full-width top bar
      var eventLi = iconList.querySelector('li:first-child');
      var eventLink = eventLi ? eventLi.querySelector('a') : null;
      if (eventLink && eventLink.textContent.indexOf('이벤트') !== -1) {
        var banner = document.createElement('div');
        banner.id = 'bj-top-banner';
        banner.innerHTML = '<a href="' + eventLink.href + '">' + eventLink.textContent.trim() + '</a>';
        headerEl.insertBefore(banner, headerEl.firstChild);
        // Remove event LI entirely from DOM
        eventLi.remove();
      }

      // 2. Move remaining icons (search, cart) into header__top
      var headerTop = document.querySelector('.header__top');
      if (headerTop) {
        iconList.id = 'bj-header-icons';
        headerTop.appendChild(iconList);
      }
    }

    // 2.5 로고를 header__top 햄버거 바로 오른쪽에 배치.
    // 일부 페이지는 .header__top의 로고 슬롯이 비어 햄버거만 한 줄을 여백으로 차지함
    // (사용자 피드백). 헤더 내 어디에 있든 .logo를 찾아 햄버거 다음으로 이동 → [햄버거][로고].
    // 로고가 아예 없는 페이지면 no-op (회귀 없음).
    if (headerEl) {
      var headerTopL = document.querySelector('.header__top');
      var hamburger = headerTopL ? headerTopL.querySelector('.gnb__hamburger') : null;
      var hdrLogo = headerEl.querySelector('a.logo') || headerEl.querySelector('.logo');
      if (headerTopL && hamburger && hdrLogo &&
          hdrLogo !== hamburger && !hamburger.contains(hdrLogo)) {
        // 이미 header__top 안 햄버거 바로 다음이면 그대로 둠
        if (hamburger.nextElementSibling !== hdrLogo) {
          headerTopL.insertBefore(hdrLogo, hamburger.nextSibling);
        }
      }
    }

    // 3. Inject mobile header CSS
    var mobileHeaderCSS = document.createElement('style');
    mobileHeaderCSS.textContent = [
      '/* Full-width event banner */',
      '#bj-top-banner { background: #0838f8; text-align: center; padding: 8px 16px; transition: transform 0.3s ease, opacity 0.3s ease; }',
      '#bj-top-banner a { color: #fff; font-size: 13px; font-weight: 700; text-decoration: none; letter-spacing: 0.3px; }',
      '',
      '/* Compact header row */',
      'header .wide-inner { padding: 0 16px !important; margin: 0 !important; width: 100% !important; box-sizing: border-box !important; transition: transform 0.3s ease, opacity 0.3s ease; }',
      '.header__top { display: flex !important; align-items: center !important; height: 50px !important; padding: 0 !important; gap: 0 !important; position: relative !important; }',
      '.gnb__hamburger { position: static !important; flex-shrink: 0 !important; width: auto !important; height: auto !important; display: flex !important; align-items: center !important; padding: 0 12px 0 0 !important; float: none !important; }',
      '.gnb__hamburger img { width: 22px !important; height: auto !important; }',
      /* 로고를 absolute 중앙정렬 → in-flow 좌측정렬로 변경: 햄버거 바로 오른쪽에 붙어
         [햄버거][로고] 한 그룹으로 좌측 배치. 기존엔 로고가 중앙 absolute라 햄버거만
         좌측에 덩그러니 남아 한 줄이 여백으로 낭비됐음. (prod_view 모듈 B와 동일 정렬) */
      /* position:relative (static 아님!) — in-flow 좌측정렬 유지 + 로고 cross-fade의
         절대배치 EN 오버레이가 a.logo를 기준으로 겹치도록 positioning context 보존.
         static으로 두면 EN 오버레이가 .header__top(relative) 기준 100%x100%로 퍼져
         햄버거 위에 영문 로고가 뜨는 버그 발생. */
      'a.logo { position: relative !important; transform: none !important; left: auto !important; flex-shrink: 0 !important; width: auto !important; height: auto !important; margin: 0 !important; float: none !important; display: inline-flex !important; align-items: center !important; }',
      'a.logo img { width: 80px !important; height: auto !important; }',
      '#bj-header-icons { position: static !important; display: flex !important; align-items: center !important; gap: 18px !important; margin-left: auto !important; padding: 0 !important; list-style: none !important; flex-shrink: 0 !important; float: none !important; z-index: 1 !important; }',
      '#bj-header-icons li { display: flex !important; align-items: center !important; padding: 0 !important; margin: 0 !important; }',
      '#bj-header-icons img { width: 22px !important; height: 22px !important; }',
      '',
      '/* Category nav */',
      '.category__wrap { padding: 8px 10px !important; gap: 6px 9px !important; border-top: 1px solid #eee; }',
      '',
      '/* Fixed scroll bar (cloned) */',
      '#bj-scroll-header { position: fixed !important; top: 0; left: 0; right: 0; z-index: 9998; background: #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.1); opacity: 0; pointer-events: none; transition: opacity 0.25s ease; }',
      '#bj-scroll-header.show { opacity: 1; pointer-events: auto; }',
      '#bj-scroll-header .bj-sh-logo { display: none; align-items: center; height: 50px; padding: 0 16px; position: relative; }',
      '#bj-scroll-header.with-logo .bj-sh-logo { display: flex; }',
      '#bj-scroll-header .bj-sh-logo .bj-sh-hamburger { width: 22px; height: auto; flex-shrink: 0; margin-right: 12px; }',
      '#bj-scroll-header .bj-sh-logo .bj-sh-logo-img { position: absolute; left: 50%; transform: translateX(-50%); width: 80px; height: auto; }',
      '#bj-scroll-header .bj-sh-logo .bj-sh-icons { display: flex; gap: 18px; margin-left: auto; }',
      '#bj-scroll-header .bj-sh-logo .bj-sh-icons img { width: 22px; height: 22px; }',
      '#bj-scroll-header .bj-sh-cat { display: flex; justify-content: center; gap: 6px 9px; flex-wrap: wrap; padding: 8px 10px; border-top: 1px solid #eee; }',
      '#bj-scroll-header .bj-sh-cat a { font-size: 14px; color: #333; text-decoration: none; line-height: 1.5; }',
      '#bj-scroll-header .bj-sh-cat a:hover { color: #0838f8; }',
      'header.bj-hide-banner #bj-top-banner { display: none !important; }',
      '/* Disable original site fix class on mobile */',
      'header.fix { position: relative !important; top: auto !important; }',
    ].join('\n');
    document.head.appendChild(mobileHeaderCSS);

    // Reveal header after redesign
    var hdr = document.querySelector('header');
    if (hdr) hdr.classList.add('bj-ready');

    // 4. Build fixed scroll header (separate from original header)
    var scrollHeader = document.createElement('div');
    scrollHeader.id = 'bj-scroll-header';

    // Logo row
    var shLogo = document.createElement('div');
    shLogo.className = 'bj-sh-logo';
    shLogo.innerHTML = '<img class="bj-sh-hamburger" src="https://billyjo.kr/image/common/m_menu.png">'
      + '<img class="bj-sh-logo-img" src="' + (document.querySelector('a.logo img') ? document.querySelector('a.logo img').src : '') + '">'
      + '<div class="bj-sh-icons"><a href="javascript:void(0)"><img src="https://billyjo.kr/image/common/search_icon.png"></a><a href="/html/order/cart"><img src="https://billyjo.kr/image/common/cart_icon.png"></a></div>';
    shLogo.querySelector('.bj-sh-hamburger').addEventListener('click', function() {
      var orig = document.querySelector('.gnb__hamburger');
      if (orig) orig.click();
    });
    scrollHeader.appendChild(shLogo);

    // Category row (clone links from original)
    var shCat = document.createElement('div');
    shCat.className = 'bj-sh-cat';
    var origCats = document.querySelectorAll('.category__wrap > a');
    origCats.forEach(function(a) {
      if (getComputedStyle(a).display !== 'none') {
        var clone = document.createElement('a');
        clone.href = a.href;
        clone.textContent = a.textContent;
        shCat.appendChild(clone);
      }
    });
    scrollHeader.appendChild(shCat);
    document.body.appendChild(scrollHeader);

    // 5. Scroll behavior
    var isMainPage = location.pathname === '/' || location.pathname === '/index.php' || location.pathname === '';
    var lastScrollY = window.scrollY;
    var headerHeight = hdr.offsetHeight;

    if (!isMainPage) {
      hdr.classList.add('bj-hide-banner');
    }

    window.addEventListener('scroll', function() {
      var currentY = window.scrollY;
      var delta = currentY - lastScrollY;

      if (isMainPage) {
        // Main: scroll past header → show fixed category only
        if (currentY > headerHeight) {
          scrollHeader.classList.add('show');
          scrollHeader.classList.remove('with-logo');
        } else {
          scrollHeader.classList.remove('show');
        }
      } else {
        // Sub: scroll down → hide all, scroll up → show logo+category
        if (currentY <= headerHeight) {
          scrollHeader.classList.remove('show');
        } else if (delta > 5) {
          scrollHeader.classList.remove('show');
        } else if (delta < -5) {
          scrollHeader.classList.add('show');
          scrollHeader.classList.add('with-logo');
        }
      }
      lastScrollY = currentY;
    }, { passive: true });
  }

  // Desktop header redesign: single row [Logo | Categories | Utils + Search]
  if (window.innerWidth > 768) {
    // >768 로드 시에도 bj-ready 즉시 부여 — 이후 창 축소/세로 회전으로 ≤768 media query가
    // 활성화돼도 guard CSS(opacity:0)에 걸리지 않도록.
    var dGuardHdr = document.querySelector('header');
    if (dGuardHdr) dGuardHdr.classList.add('bj-ready');

    var dHeader = document.querySelector('header.new-header');
    var dLogo = document.querySelector('a.logo');
    var dGnbWrap = document.querySelector('.new-gnb__wrap');
    var dTopRight = document.querySelector('.top__right');
    var dWideInner = dHeader ? dHeader.querySelector('.wide-inner') : null;

    if (dHeader && dLogo && dGnbWrap && dTopRight) {
      // Hide phone number and event button
      var phoneEl = document.querySelector('.top__info');
      if (phoneEl) phoneEl.style.display = 'none';
      var eventBtn = dTopRight.querySelector('a[href*="display"]');
      if (eventBtn) eventBtn.style.display = 'none';

      // Create single-row flex container
      // 안정 클래스(bj-inj-*)를 여기서 직접 부여 — 좁은 폭 헤더 보호 CSS가 적용되도록.
      // (모듈 B tagInject는 prod_view 전용이라 비-상세 페이지에선 클래스가 안 붙어
      //  rightGroup이 카테고리 영역을 침범하던 버그. 이 클래스 + 아래 CSS로 전역 해소.)
      var dRow = document.createElement('div');
      dRow.className = 'bj-inj-row';
      dRow.style.cssText = 'display:flex;align-items:flex-end;padding:28px 40px 22px;width:100%;max-width:1500px;margin:0 auto;box-sizing:border-box;';

      // Left group: logo + categories
      var leftGroup = document.createElement('div');
      leftGroup.className = 'bj-inj-left';
      leftGroup.style.cssText = 'display:flex;align-items:flex-end;flex:1;min-width:0;';

      // Move logo
      dLogo.style.cssText += 'margin:0 30px 0 0 !important;float:none !important;flex-shrink:0 !important;';
      var logoImg = dLogo.querySelector('img');
      if (logoImg) logoImg.style.cssText = 'height:36px !important;width:auto !important;';
      leftGroup.appendChild(dLogo);

      // Move categories next to logo
      dGnbWrap.style.cssText = 'height:auto !important;border:none !important;background:none !important;flex-shrink:0 !important;';
      var dGnb = dGnbWrap.querySelector('ul.new-gnb');
      if (dGnb) dGnb.style.cssText += 'justify-content:flex-start !important;gap:8px !important;padding:0 !important;';

      // 1:1 맞춤 패키지 — 데스크톱 GNB에도 노출 (모바일 .category__wrap 항목과 동일 기능: 페르소나 위저드).
      // 형제 gnb__menu a(15px / line-height:23.25px) 박스에 맞춰 수직 정렬, 브랜드 파랑(#0838F8)만 강조.
      if (dGnb && !dGnb.querySelector('.bj-best-gnb')) {
        var bestLi = document.createElement('li');
        bestLi.className = 'gnb__menu bj-best-gnb';
        var bestA = document.createElement('a');
        bestA.href = '#';
        bestA.innerHTML = '<span style="margin-right:4px;line-height:1;display:inline-flex;align-items:center">🎯</span>1:1 맞춤 패키지';
        bestA.style.cssText = 'display:inline-flex;align-items:center;font:700 15px Pretendard,sans-serif;line-height:23.25px;color:#0838F8;text-decoration:none;white-space:nowrap;cursor:pointer';
        bestA.onclick = function(e){
          e.preventDefault();
          function openWiz(){ if (window.bjPersona) window.bjPersona.open({ style: 'curation', origin: '1:1 맞춤 패키지' }); }
          if (window.bjPersona) {
            openWiz();
          } else if (!window.__bjWizLoading) {
            window.__bjWizLoading = true;
            var s = document.createElement('script');
            s.src = 'https://admin2.billyjo.co.kr/persona-wizard.js';
            s.onload = openWiz;
            document.head.appendChild(s);
          }
        };
        bestLi.appendChild(bestA);
        var firstMenu = dGnb.querySelector('li.gnb__menu');
        if (firstMenu) dGnb.insertBefore(bestLi, firstMenu);
        else dGnb.appendChild(bestLi);
      }

      leftGroup.appendChild(dGnbWrap);

      dRow.appendChild(leftGroup);

      // Right group: move .gnb__right (고객센터+장바구니) + search
      var rightGroup = document.createElement('div');
      rightGroup.className = 'bj-inj-right';
      rightGroup.style.cssText = 'display:flex;align-items:flex-end;gap:24px;flex-shrink:0;white-space:nowrap;margin-left:auto;';
      var gnbRight = dTopRight.querySelector('.gnb__right');
      if (gnbRight) {
        gnbRight.style.cssText = 'display:flex !important;align-items:center !important;gap:20px !important;position:relative !important;top:8px !important;';
        // Hide event button inside gnb__right
        gnbRight.querySelectorAll('a.right__event').forEach(function(a) {
          if (a.textContent.includes('이벤트')) a.style.display = 'none';
        });
        rightGroup.appendChild(gnbRight);
      }
      var dSearchWrap = dTopRight.querySelector('.search__wrap');
      if (dSearchWrap) rightGroup.appendChild(dSearchWrap);
      dTopRight.style.display = 'none';
      dRow.appendChild(rightGroup);

      // Search underline + right utils baseline align
      var dSearchStyle = document.createElement('style');
      dSearchStyle.textContent =
        '@media(min-width:769px){.search__wrap{border:none !important;border-bottom:1px solid #333 !important;border-radius:0 !important;padding:0 !important;}.search__wrap input[name="search_value"]{border:none !important;outline:none !important;}}'
        /* 좁은 PC 폭 헤더 보호 (모듈 A 전역 — 비-상세 페이지에서도 rightGroup이
           카테고리 영역을 침범하지 않도록). flex-wrap은 실제 넘칠 때만 줄바꿈하므로
           넓은 화면(여유 있을 때)엔 영향 없음. 모듈 B(prod_view)의 ≤1280 룰과 동일 골격. */
        + '@media(min-width:1025px) and (max-width:1500px){'
        +   'header.new-header > .bj-inj-row{ flex-wrap:wrap !important; padding:20px 24px !important; row-gap:10px !important; column-gap:16px !important; }'
        +   'header.new-header > .bj-inj-row > .bj-inj-left{ flex:1 1 auto !important; min-width:0 !important; flex-wrap:wrap !important; row-gap:10px !important; }'
        +   'header.new-header > .bj-inj-row > .bj-inj-right{ flex-shrink:1 !important; white-space:normal !important; flex-wrap:wrap !important; margin-left:auto !important; gap:14px !important; justify-content:flex-end !important; align-items:center !important; }'
        +   'header.new-header .bj-inj-right .gnb__right{ position:static !important; top:0 !important; gap:14px !important; }'
        +   'header.new-header .bj-inj-right .search__wrap{ max-width:280px }'
        + '}'
        /* ≤1024px: rightGroup을 아예 별도 행으로 분리 */
        + '@media(max-width:1024px){'
        +   'header.new-header > .bj-inj-row{ flex-direction:column !important; align-items:stretch !important; }'
        +   'header.new-header > .bj-inj-row > .bj-inj-left{ width:100% !important; flex-wrap:wrap !important; }'
        +   'header.new-header > .bj-inj-row > .bj-inj-right{ width:100% !important; margin-left:0 !important; justify-content:flex-end !important; border-top:0.5px solid #eee; padding-top:10px; }'
        +   'header.new-header .bj-inj-right .gnb__right{ position:static !important; top:0 !important; }'
        + '}';
      document.head.appendChild(dSearchStyle);

      // Hide original wide-inner, insert new row
      if (dWideInner) dWideInner.style.display = 'none';
      dHeader.insertBefore(dRow, dHeader.firstChild);
    }
  }

  // Hide sidebar nav dots for hidden categories
  var hiddenCats = ['업소용·창업', '건강·뷰티', '가구·침구', '신차렌트', '상조+가전'];
  document.querySelectorAll('ul.nav li').forEach(function(li) {
    var txt = li.querySelector('.txt');
    if (txt && hiddenCats.indexOf(txt.textContent.trim()) !== -1) {
      li.style.display = 'none';
    }
  });

  // Populate search hashtags with popular keywords
  var searchTags = document.querySelector('.tag.inline_wrap.col02');
  if (searchTags) {
    var keywords = ['정수기', '공기청정기', '에어컨', '비데', '냉장고', '세탁기'];
    searchTags.innerHTML = '';
    keywords.forEach(function(kw) {
      var li = document.createElement('li');
      li.textContent = '#' + kw;
      li.onclick = function() { mobile_search_result(kw); };
      searchTags.appendChild(li);
    });
  }

  // === 상단 검색창 작동 복구 (2026-06-18) ===
  // 플랫폼 테마 마크업 버그: 데스크탑 헤더 검색창(.search__wrap 안 input#top_search + submit 버튼)이
  // 어떤 <form>에도 들어있지 않아 Enter·돋보기 클릭 모두 무반응 → 검색 자체가 안 됨(inject 꺼도 동일).
  // 검색 백엔드(/html/dh/search_result?search_value=)는 정상이므로 Enter/클릭을 잡아 직접 이동시킴.
  // + 제품명이 영문으로 저장된 카테고리용 한글 구어체 동의어 매핑(티비→TV 등) — 0건 방지.
  (function fixTopSearch() {
    var SYNONYMS = [
      ['텔레비전', 'TV'],
      ['티브이', 'TV'],
      ['티비', 'TV']
    ];
    function normalize(q) {
      var out = q;
      for (var i = 0; i < SYNONYMS.length; i++) {
        out = out.split(SYNONYMS[i][0]).join(SYNONYMS[i][1]);
      }
      return out;
    }
    function runSearch(input) {
      var raw = ((input && input.value) || '').trim();
      if (!raw) { if (input) input.focus(); return; }
      location.href = '/html/dh/search_result?search_value=' + encodeURIComponent(normalize(raw));
    }
    // 데스크탑 검색창에서 Enter
    document.addEventListener('keydown', function(e) {
      if (e.key !== 'Enter' && e.keyCode !== 13) return;
      var t = e.target;
      if (t && t.tagName === 'INPUT' && t.id === 'top_search') {
        e.preventDefault();
        runSearch(t);
      }
    }, true);
    // 검색창 옆 돋보기(submit) 버튼 클릭
    document.addEventListener('click', function(e) {
      if (!e.target || !e.target.closest) return;
      var btn = e.target.closest('.search__wrap button');
      if (!btn) return;
      var wrap = btn.closest('.search__wrap');
      var input = wrap && (wrap.querySelector('#top_search') || wrap.querySelector('input[name="search_value"]'));
      if (input) { e.preventDefault(); runSearch(input); }
    }, true);
  })();

  // === 검색 결과 페이지(.search_field) 주황 → 파랑 (2026-06-18) ===
  // 결과 상단 키워드 바: 키워드 텍스트(input#prod_search, color #dd5119),
  // 돋보기 PNG(input[type=image] btn_search.png), 하단 언더라인(border-bottom #dd5119)이
  // 네이티브 테마 주황 → 사이트 블루(#0838f8). (헤더 .search__wrap은 별개라 미영향)
  (function blueSearchField() {
    var st = document.createElement('style');
    st.id = 'bj-search-field-blue';
    st.textContent =
      '.search_field { border-bottom-color: #0838f8 !important; }' +
      '.search_field input#prod_search, .search_field input[name="search_value"] { color: #0838f8 !important; }' +
      '.search_field input.btn, .search_field input[type="image"][src*="btn_search"] { filter: brightness(0) saturate(100%) invert(14%) sepia(100%) saturate(7500%) hue-rotate(228deg) brightness(98%) contrast(103%) !important; }';
    document.head.appendChild(st);
  })();

  // Unhide product detail images (platform sets inline display:none)
  function unhideDetailImages() {
    document.querySelectorAll('.prod_view_detail img').forEach(function(img) {
      if (img.style.display === 'none' && !img.src.includes('9353658f') && !(img.src.includes('3192f27b') && img.src.match(/\.png/i))) {
        img.style.display = '';
      }
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', unhideDetailImages);
  } else {
    unhideDetailImages();
  }
  window.addEventListener('load', unhideDetailImages);

  // Replace LG구독 with LG 케어+ and 현대렌탈케어 with 현대큐밍
  document.querySelectorAll('label').forEach(function(el) {
    el.childNodes.forEach(function(node) {
      if (node.nodeType === 3 && node.textContent.includes('LG구독')) {
        var span = document.createElement('span');
        span.innerHTML = node.textContent.replace('LG구독', 'LG 케어<sup style="font-size:1.3em">+</sup>');
        node.parentNode.replaceChild(span, node);
      }
      if (node.nodeType === 3 && node.textContent.includes('현대렌탈케어')) {
        node.textContent = node.textContent.replace(/현대렌탈케어/g, '현대큐밍');
      }
    });
  });

  // === 신차렌트 category ===
  if (location.pathname.indexOf('prod_list/7-') !== -1) {
    // Hide product count text and 저신용, 타이어 subcategory tabs
    var countEl = document.querySelector('p.cnt');
    if (countEl) countEl.style.display = 'none';
    document.querySelectorAll('.prod_list__cate li').forEach(function(li) {
      var oc = li.getAttribute('onclick') || '';
      if (oc.indexOf('7-1273') !== -1 || oc.indexOf('7-1332') !== -1) li.style.display = 'none';
    });
    function isCarAllowed(text) {
      var t = text.toLowerCase();
      // 캐스퍼 - always show
      if (t.indexOf('캐스퍼') !== -1) return true;
      // 기타 국산차 / 수입차 - always show
      if (t.indexOf('기타 국산차') !== -1 || t.indexOf('수입차') !== -1) return true;
      // K5 - only 하이브리드
      if (t.indexOf('k5') !== -1) return t.indexOf('하이브리드') !== -1;
      // 제네시스 - show G70 (as G80) and GV60 (as 르노 그랑 콜레오스)
      if (t.indexOf('제네시스') !== -1) return t.indexOf('g70') !== -1 || t.indexOf('gv60') !== -1;
      // 펠리세이드/팰리세이드 - hide 디젤
      if (t.indexOf('펠리세이드') !== -1 || t.indexOf('팰리세이드') !== -1) return t.indexOf('디젤') === -1;
      // everything else - hide
      return false;
    }
    var carFilterInterval = setInterval(function() {
      var prodListEl = document.querySelector('.prod_list');
      if (!prodListEl) return;
      var thumbs = prodListEl.querySelectorAll('.thumb');
      if (thumbs.length === 0) return;
      // For each thumb, find the card element (direct child of .prod_list)
      function getCardEl(thumb) {
        var el = thumb;
        while (el && el.parentElement !== prodListEl) { el = el.parentElement; }
        return el;
      }
      // Hide disallowed cards
      var allCards = [];
      thumbs.forEach(function(thumb) {
        var cardEl = getCardEl(thumb);
        if (!cardEl) return;
        if (allCards.indexOf(cardEl) !== -1) return;
        allCards.push(cardEl);
        var text = cardEl.textContent || '';
        if (!isCarAllowed(text)) {
          cardEl.style.display = 'none';
        }
      });
      // Reorder visible cards
      var order = ['기타 국산차', '캐스퍼', 'k5', '제네시스', 'gv60', '펠리세이드', '팰리세이드'];
      var visible = allCards.filter(function(c) { return c.style.display !== 'none'; });
      visible.sort(function(a, b) {
        var tA = (a.textContent || '').toLowerCase();
        var tB = (b.textContent || '').toLowerCase();
        var iA = order.length, iB = order.length;
        for (var oi = 0; oi < order.length; oi++) {
          if (tA.indexOf(order[oi].toLowerCase()) !== -1 && oi < iA) iA = oi;
          if (tB.indexOf(order[oi].toLowerCase()) !== -1 && oi < iB) iB = oi;
        }
        return iA - iB;
      });
      visible.forEach(function(c) { prodListEl.appendChild(c); });
      // Rename cards (images already replaced via admin addon)
      allCards.forEach(function(card) {
        var txt = card.textContent || '';
        if (card.style.display === 'none') return;
        // 기타 국산차 → 국산차
        if (txt.indexOf('기타 국산차') !== -1) {
          card.querySelectorAll('p.brand, p.name').forEach(function(el) { el.textContent = el.textContent.replace('기타 국산차', '국산차'); });
        }
        // 캐스퍼
        if (txt.indexOf('캐스퍼') !== -1) {
          card.querySelectorAll('p.brand').forEach(function(el) { el.textContent = '현대자동차 캐스퍼'; });
          card.querySelectorAll('p.name').forEach(function(el) { el.textContent = '캐스퍼 인스퍼레이션'; });
        }
        // K5
        if (txt.indexOf('K5') !== -1) {
          card.querySelectorAll('p.brand').forEach(function(el) { el.textContent = '기아자동차 K5'; });
          card.querySelectorAll('p.name').forEach(function(el) { el.textContent = 'K5 2.0 하이브리드 베스트 셀렉션'; });
        }
        // G70 → G80
        if (txt.indexOf('G70') !== -1) {
          card.querySelectorAll('p.brand').forEach(function(el) { el.textContent = '제네시스 G80'; });
          card.querySelectorAll('p.name').forEach(function(el) { el.textContent = 'G80 2.5T 스포츠'; });
        }
        // GV60 → 르노 그랑 콜레오스
        if (txt.indexOf('GV60') !== -1) {
          card.querySelectorAll('p.brand').forEach(function(el) { el.textContent = '르노 그랑 콜레오스'; });
          card.querySelectorAll('p.name').forEach(function(el) { el.textContent = '그랑 콜레오스 1.3 터보 아이코닉'; });
          card.querySelectorAll('strong').forEach(function(el) { el.textContent = '견적신청'; });
          var kImg = card.querySelector('.thumb img');
          if (kImg) { kImg.src = 'https://rentalshop.site/_data/file/goodsImages/c854ac32e496147c9552cdf0b0994749.jpg'; kImg.alt = '르노 그랑 콜레오스'; }
        }
        // 팰리세이드
        if (txt.indexOf('팰리세이드') !== -1) {
          card.querySelectorAll('p.brand').forEach(function(el) { el.textContent = '현대자동차 팰리세이드'; });
          card.querySelectorAll('p.name').forEach(function(el) { el.textContent = '팰리세이드 3.8 익스클루시브 7인승'; });
        }
        // Link all cards to 국산차 page (only on 7-591)
        if (location.pathname.indexOf('7-591') !== -1) {
          card.querySelectorAll('a').forEach(function(a) {
            if (a.href.indexOf('prod_view') !== -1 || a.href === 'javascript:void(0)') {
              a.href = '/html/dh_prod/prod_view/2509';
            }
          });
        }
      });
      // Hide pagination
      var pager = document.querySelector('.board-pager');
      if (pager) pager.style.display = 'none';
      // Show product list after filtering
      var hs = document.getElementById('car-hide');
      if (hs) { hs.textContent = '.prod_list { opacity: 1 !important; transition: opacity 0.3s; }'; }
      clearInterval(carFilterInterval);
    }, 500);
    setTimeout(function() {
      clearInterval(carFilterInterval);
      var hs = document.getElementById('car-hide');
      if (hs) hs.remove();
    }, 30000);
  }

  // === 수입차 page: create 5 import car cards ===
  if (location.pathname.indexOf('7-596') !== -1) {
    var importInterval = setInterval(function() {
      var prodListEl = document.querySelector('.prod_list');
      if (!prodListEl) return;
      var origCard = prodListEl.querySelector('.thumb') ? prodListEl.children[0] : null;
      if (!origCard) return;
      clearInterval(importInterval);
      var impBase = 'https://rentalshop.site/_data/file/goodsImages/';
      var importCars = [
        { brand: '테슬라 모델 Y', name: '모델 Y 롱레인지 AWD', img: impBase + '652866adbe7893ff257e1e0e80374727.jpg' },
        { brand: 'BMW 5시리즈', name: '520i M 스포츠', img: impBase + 'b996fde34864677ee57c6a7250a5f1a9.jpg' },
        { brand: 'BMW X3', name: 'X3 xDrive20i M 스포츠', img: impBase + '4a8fdc8e42922c94ebdb0d243ef8c99c.jpg' },
        { brand: '메르세데스-벤츠 E-클래스', name: 'E 300 4MATIC AMG 라인', img: impBase + '787adc6e1c29651fa9e3e889745c46eb.jpg' },
        { brand: '메르세데스-벤츠 GLC', name: 'GLC 300 4MATIC AMG 라인', img: impBase + '2c999daf715aaf4a2a3ea42a8dbb2423.jpg' }
      ];
      importCars.forEach(function(car) {
        var card = origCard.cloneNode(true);
        card.querySelectorAll('p.brand').forEach(function(el) { el.textContent = car.brand; });
        card.querySelectorAll('p.name').forEach(function(el) { el.textContent = car.name; });
        card.querySelectorAll('strong').forEach(function(el) { el.textContent = '견적신청'; });
        if (car.img) { var ci = card.querySelector('.thumb img'); if (ci) ci.src = car.img; }
        if (car.img) { var ci = card.querySelector('.thumb img'); if (ci) ci.src = car.img; }
        var link = card.querySelector('a');
        if (link) link.href = '/html/dh_prod/prod_view/3586';
        prodListEl.appendChild(card);
      });
      // Replace first card (수입차) thumbnail
      var origImg = origCard.querySelector('.thumb img');
      if (origImg) origImg.src = 'https://rentalshop.site/_data/file/goodsImages/17aeef731e84ade23d0c907788c9c426.png';
      origCard.querySelectorAll('a').forEach(function(a) { a.href = '/html/dh_prod/prod_view/3586'; });
      var pager = document.querySelector('.board-pager');
      if (pager) pager.style.display = 'none';
      var hs = document.getElementById('car-hide');
      if (hs) hs.textContent = '.prod_list { opacity: 1 !important; transition: opacity 0.3s; }';
    }, 500);
    setTimeout(function() { clearInterval(importInterval); }, 30000);
  }

  // === BEST badge for top 3 products on list pages ===
  if (location.pathname.indexOf('prod_list') !== -1 && location.pathname.indexOf('7-596') === -1) {
    var bestInterval = setInterval(function() {
      var thumbs = document.querySelectorAll('.prod_list .thumb');
      if (thumbs.length === 0) return;
      var count = Math.min(3, thumbs.length);
      var done = 0;
      for (var i = 0; i < count; i++) {
        if (thumbs[i].querySelector('.best-pill')) { done++; continue; }
        var pill = document.createElement('div');
        pill.className = 'best-pill';
        pill.textContent = 'BEST';
        thumbs[i].style.position = 'relative';
        thumbs[i].appendChild(pill);
        done++;
      }
      if (done >= count) clearInterval(bestInterval);
    }, 500);
    setTimeout(function() { clearInterval(bestInterval); }, 30000);
  }

  // === 제품 리스트 가격부분 재디자인 (신혼가전 칩 스타일) ===
  // native .fee(정가) / .fee2(제휴카드 할인가=카드 적용 최종가)를 파싱 → bj-pz 블록 생성.
  // 일반(회색 칩)/제휴💳(파란 칩) 2줄 + 할인율 배지. 할인 없으면 일반만. native는 CSS로 숨김.
  // ⚠️ fee2 = '카드할인가'(제휴카드 적용 최종가), 할인액 아님. 제휴가=card, 할인율=(reg-card)/reg.
  if (true) {  // 전체 페이지 적용 (2026-07-02): 이전엔 /prod_list/ URL만 → 메인페이지 등 .prod_list .item 카드에도 적용. bjpRun은 .prod_list .item만 대상이라 카드 없는 페이지는 no-op.
    if (!document.getElementById('bj-cf-css')) {
      var bjcfStyle = document.createElement('style'); bjcfStyle.id = 'bj-cf-css';
      bjcfStyle.textContent =
        '.bj-pz .bj-cf-line{display:flex;align-items:center;justify-content:space-between;gap:8px;white-space:nowrap;overflow:hidden;line-height:1.3}' +
        '.bj-pz .bj-cf-val{display:inline-flex;align-items:center;gap:5px;white-space:nowrap;min-width:0}' +  // 우측 가격 그룹(할인율+가격)
        '.bj-pz .bj-cf-normal{font-size:15px;color:#555}' +
        '.bj-pz .bj-cf-normal b{font-weight:700;color:#333}' +
        '.bj-pz .bj-cf-deal{font-size:15px;font-weight:800;color:#0838F8;margin-top:5px}' +
        '.bj-pz .bj-cf-ph{visibility:hidden}' +
        '.bj-pz .bj-cf-chip{display:inline-flex;align-items:center;justify-content:center;min-width:46px;font-size:11px;font-weight:700;border-radius:5px;padding:4px 9px;flex-shrink:0}' +
        '.bj-pz .bj-cf-normal .bj-cf-chip{color:#6b7280;background:#eceff3}' +
        '.bj-pz .bj-cf-deal .bj-cf-chip{color:#fff;background:#0838f8}' +
        '.bj-pz .bj-cf-disc{font-size:11px;font-weight:800;color:#fff;background:#d6336c;border-radius:6px;padding:4px 7px;flex-shrink:0}' +
        // 모바일: 칩(제휴💳)+할인태그(-NN%)+가격이 좁은 카드 폭을 넘쳐 가격이 잘림
        // → 폰트·gap·칩 축소로 6자리 가격도 들어가게. ≤360px(iPhone SE)는 한 단계 더 축소.
        '@media all and (max-width:640px){' +
        '.bj-pz .bj-cf-line{gap:4px}' +   // 모바일도 우측 정렬(space-between 상속), gap만 축소
        '.bj-pz .bj-cf-val{gap:2px}' +
        '.bj-pz .bj-cf-normal,.bj-pz .bj-cf-deal{font-size:11.5px;letter-spacing:-.3px}' +
        '.bj-pz .bj-cf-chip{font-size:9px;min-width:0;padding:3px 5px}' +
        // 최저 칩 폭을 제휴💳 칩과 맞춤(우측 가격 시작점 정렬) — 제휴 줄은 안 건드려 가격 잘림 무영향
        '.bj-pz .bj-cf-normal .bj-cf-chip{min-width:26px}' +
        '.bj-pz .bj-cf-disc{font-size:9px;padding:3px 4px}}' +
        '@media all and (max-width:360px){' +
        '.bj-pz .bj-cf-normal,.bj-pz .bj-cf-deal{font-size:10.5px}' +
        '.bj-pz .bj-cf-chip{font-size:8.5px}' +
        '.bj-pz .bj-cf-disc{font-size:8.5px}}';
      (document.head || document.documentElement).appendChild(bjcfStyle);
    }
    var bjpParse = function(el) {
      if (!el) return null;
      var d = el.textContent.replace(/[^0-9]/g, '');
      return d === '' ? null : parseInt(d, 10);
    };
    var bjpFmt = function(n) { return n.toLocaleString('ko-KR'); };
    var bjpFormat = function(item) {
      if (item.getAttribute('data-bjp')) return;
      var fee = item.querySelector('.fee');
      var fee2 = item.querySelector('.fee2');
      if (!fee) return;
      var reg = bjpParse(fee.querySelector('.price'));
      if (reg === null) return;
      var card = fee2 ? bjpParse(fee2.querySelector('.price')) : null;
      var hasDisc = card !== null && card > 0 && card < reg;
      var bjpPct = hasDisc ? Math.round((reg - card) / reg * 100) : 0;
      item.setAttribute('data-bj-disc', String(bjpPct));   // 할인높은순 정렬용
      var box = document.createElement('div');
      box.className = 'bj-pz';
      if (hasDisc) {
        box.innerHTML =
          '<div class="bj-cf-line bj-cf-normal"><span class="bj-cf-chip">최저</span><span class="bj-cf-val">월 <b>' + bjpFmt(reg) + '원</b></span></div>' +
          '<div class="bj-cf-line bj-cf-deal"><span class="bj-cf-chip">제휴💳</span><span class="bj-cf-val"><span class="bj-cf-disc">-' + bjpPct + '%</span>월 <b>' + bjpFmt(card) + '원</b></span></div>';
      } else {
        // 할인 없음: 최저만 + 높이 맞춤용 숨김 placeholder 줄
        box.innerHTML =
          '<div class="bj-cf-line bj-cf-normal"><span class="bj-cf-chip">최저</span><span class="bj-cf-val">월 <b>' + bjpFmt(reg) + '원</b></span></div>' +
          '<div class="bj-cf-line bj-cf-deal bj-cf-ph"><span class="bj-cf-chip">제휴💳</span><span class="bj-cf-val">월 <b>' + bjpFmt(reg) + '원</b></span></div>';
      }
      var anc = fee2 || fee;
      anc.parentNode.insertBefore(box, anc.nextSibling);
      var bjpNm = item.querySelector('.name');
      if (bjpNm) {
        bjpNm.style.setProperty('height', 'auto', 'important');
        var bjpLh = parseFloat(getComputedStyle(bjpNm).lineHeight);
        bjpNm.style.setProperty('min-height', (bjpLh ? Math.ceil(bjpLh * 2) : 39) + 'px', 'important');
        bjpNm.style.setProperty('max-height', 'none', 'important');
        bjpNm.style.setProperty('display', '-webkit-box', 'important');
        bjpNm.style.setProperty('-webkit-line-clamp', '2', 'important');
        bjpNm.style.setProperty('-webkit-box-orient', 'vertical', 'important');
        bjpNm.style.setProperty('overflow', 'hidden', 'important');
      }
      item.setAttribute('data-bjp', '1');
    };
    var bjpRun = function() {
      var items = document.querySelectorAll('.prod_list .item');
      for (var i = 0; i < items.length; i++) bjpFormat(items[i]);
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bjpRun);
    bjpRun();
    var bjpIv = setInterval(bjpRun, 600);
    setTimeout(function() { clearInterval(bjpIv); }, 20000);
    var bjpAttach = setInterval(function() {
      var pl = document.querySelector('.prod_list');
      if (!pl) return;
      clearInterval(bjpAttach);
      var bjpT;
      new MutationObserver(function() { clearTimeout(bjpT); bjpT = setTimeout(bjpRun, 80); }).observe(pl, { childList: true, subtree: true });
    }, 500);
    setTimeout(function() { clearInterval(bjpAttach); }, 20000);
  }

  // === 정렬 일원화: 후기순/할인높은순 + PC도 드롭다운 (모바일 네이티브 dropdown엔 옵션 추가, PC는 .odb 링크 → 드롭다운 교체) ===
  // 네이티브 orderb_fs(_m)은 인기/최근/가격만 지원. 후기수(data-bj-rvn: bj-rv)·할인율(data-bj-disc: bj-pz)은 클라이언트 재정렬.
  // 옵션 정의: [라벨, 네이티브코드|null, 클라이언트정렬 attr|null]
  if (location.pathname.indexOf('prod_list') !== -1) {
    var BJ_SORTS = [
      ['인기순', '', null], ['최근등록순', 'new', null], ['가격높은순', 'hi', null], ['가격낮은순', 'lw', null],
      ['후기순', null, 'data-bj-rvn'], ['할인높은순', null, 'data-bj-disc']
    ];
    var bjClientSort = function(attr) {
      var list = document.querySelector('.prod_list'); if (!list) return;
      var items = Array.prototype.slice.call(list.querySelectorAll('.item'));
      items.sort(function(a, b) { return (parseFloat(b.getAttribute(attr)) || 0) - (parseFloat(a.getAttribute(attr)) || 0); });
      items.forEach(function(it) { list.appendChild(it); });
    };
    var bjNativeSort = function(code) {  // 뷰포트에 맞는 폼으로 AJAX 정렬
      try {
        if (window.innerWidth > 767 && typeof window.orderb_fs === 'function') window.orderb_fs(code);
        else if (typeof window.orderb_fs_m === 'function') window.orderb_fs_m(code);
        else if (typeof window.orderb_fs === 'function') window.orderb_fs(code);
      } catch (e) {}
    };
    var bjDoSort = function(opt) { if (opt[1] !== null) bjNativeSort(opt[1]); else bjClientSort(opt[2]); };

    // (1) 모바일 네이티브 드롭다운(.sort__list)에 후기순/할인높은순 추가
    var bjAddMobileOpts = function() {
      var ul = document.querySelector('.sort__list');
      if (!ul || ul.querySelector('.bj-sort-extra')) return;
      [['후기순', 'data-bj-rvn'], ['할인높은순', 'data-bj-disc']].forEach(function(o) {
        var li = document.createElement('li');
        li.className = 'bj-sort-extra';
        li.textContent = o[0];
        li.addEventListener('click', function(e) {
          e.stopPropagation();
          bjClientSort(o[1]);
          try { if (window.jQuery) window.jQuery('.sort__list').slideUp(200); } catch (e2) {}
          var tit = document.querySelector('.sort__tit'); if (tit) tit.textContent = o[0];
        });
        ul.appendChild(li);
      });
    };

    // (2) PC: .odb 링크 → 커스텀 드롭다운(bj-sortdd) 교체
    var bjBuildPcDropdown = function() {
      var selbtn = document.querySelector('.selbtn');
      if (!selbtn || document.querySelector('.bj-sortdd')) return;
      selbtn.style.display = 'none';  // 기존 링크 행 숨김
      var dd = document.createElement('div');
      dd.className = 'bj-sortdd';
      var tit = document.createElement('div'); tit.className = 'bj-sortdd__tit'; tit.textContent = '인기순';
      var list = document.createElement('ul'); list.className = 'bj-sortdd__list';
      BJ_SORTS.forEach(function(opt, idx) {
        var li = document.createElement('li'); li.textContent = opt[0]; if (idx === 0) li.className = 'on';
        li.addEventListener('click', function(e) {
          e.stopPropagation();
          bjDoSort(opt);
          tit.textContent = opt[0];
          Array.prototype.forEach.call(list.children, function(c) { c.className = ''; });
          li.className = 'on';
          dd.classList.remove('on');
        });
        list.appendChild(li);
      });
      tit.addEventListener('click', function(e) { e.stopPropagation(); dd.classList.toggle('on'); });
      document.addEventListener('click', function() { dd.classList.remove('on'); });
      dd.appendChild(tit); dd.appendChild(list);
      selbtn.parentNode.insertBefore(dd, selbtn.nextSibling);
    };

    var bjSortStyle = document.createElement('style'); bjSortStyle.id = 'bj-sortdd-css';
    bjSortStyle.textContent =
      '#bj-rv-sort{display:none !important}' +  // 구 정렬 바 제거(일원화)
      ".bj-sortdd{position:relative;display:inline-block;font-family:'Pretendard',sans-serif;z-index:6;vertical-align:middle}" +
      '.bj-sortdd__tit{cursor:pointer;font-size:14px;font-weight:600;color:#333;padding:9px 30px 9px 15px;border:1px solid #e0e3e8;border-radius:8px;background:#fff;position:relative;white-space:nowrap;min-width:104px}' +
      ".bj-sortdd__tit::after{content:'';position:absolute;right:13px;top:50%;width:7px;height:7px;border-right:1.5px solid #999;border-bottom:1.5px solid #999;transform:translateY(-70%) rotate(45deg)}" +
      '.bj-sortdd__list{position:absolute;right:0;top:calc(100% + 5px);background:#fff;border:1px solid #e0e3e8;border-radius:8px;box-shadow:0 8px 24px rgba(0,0,0,.12);list-style:none;margin:0;padding:5px;min-width:150px;display:none}' +
      '.bj-sortdd.on .bj-sortdd__list{display:block}' +
      '.bj-sortdd__list li{padding:10px 13px;font-size:13.5px;color:#444;cursor:pointer;border-radius:6px;white-space:nowrap}' +
      '.bj-sortdd__list li:hover{background:#eef2ff;color:#0838f8}' +
      '.bj-sortdd__list li.on{color:#0838f8;font-weight:700}' +
      '@media all and (max-width:767px){.bj-sortdd{display:none !important}}';  // 모바일은 네이티브 드롭다운 사용
    (document.head || document.documentElement).appendChild(bjSortStyle);

    var bjSortApply = function() { bjAddMobileOpts(); bjBuildPcDropdown(); };
    bjSortApply();
    var bjSortIv = setInterval(bjSortApply, 400);
    setTimeout(function() { clearInterval(bjSortIv); }, 20000);
  }

  // === 카테고리 탭(.prod_list__cate) 순서 재배치 ===
  // 목표: 정수기·에어컨 유지 + 제습기/가습기·로봇청소기·비데를 공기청정기 뒤로 전진. 나머지는 원래 상대순서 유지.
  if (location.pathname.indexOf('prod_list') !== -1) {
    var BJ_CAT_ORDER = ['1-8', '1-87', '1-6', '1-203', '1-374', '1-9', '1-1232', '1-7', '1-532', '1-1296'];
    var bjReorderCats = function() {
      var ul = document.querySelector('.prod_list__cate');
      if (!ul || ul.getAttribute('data-bj-catorder')) return;
      var lis = Array.prototype.slice.call(ul.querySelectorAll('li'));
      if (lis.length < 2) return;
      var keyOf = function(li) { var m = (li.getAttribute('onclick') || '').match(/prod_list\/(\d+-\d+)/); return m ? m[1] : ''; };
      lis.sort(function(a, b) {
        var ia = BJ_CAT_ORDER.indexOf(keyOf(a)), ib = BJ_CAT_ORDER.indexOf(keyOf(b));
        if (ia === -1) ia = 999; if (ib === -1) ib = 999;
        return ia - ib;
      });
      lis.forEach(function(li) { ul.appendChild(li); });
      ul.setAttribute('data-bj-catorder', '1');
    };
    bjReorderCats();
    var bjCatIv = setInterval(bjReorderCats, 400);
    setTimeout(function() { clearInterval(bjCatIv); }, 15000);
  }

  // === Global: replace old 기타 국산차 yellow banner with black banner ===
  var gukBannerIds = ['f20a1005c32b110f132da6be0e8ad69e', '7cd7b51b4f8969361aa9b123640176e0', '252b9d5312002f1a50fe6532d4c17eba'];
  var newBanner = 'https://rentalshop.site/_data/file/goodsImages/17aeef731e84ade23d0c907788c9c426.png';
  document.querySelectorAll('img').forEach(function(img) {
    gukBannerIds.forEach(function(id) { if (img.src.indexOf(id) !== -1) img.src = newBanner; });
  });

  // === 기타 국산차 detail page: match thumbnail ===
  if (location.pathname.indexOf('prod_view/2509') !== -1) {
    var gukImg = 'https://rentalshop.site/_data/file/goodsImages/17aeef731e84ade23d0c907788c9c426.png';
    var gukInterval = setInterval(function() {
      var bigImg = document.querySelector('.prod_img_big img');
      if (!bigImg) return;
      clearInterval(gukInterval);
      document.querySelectorAll('img').forEach(function(img) {
        if (img.src.indexOf('goodsImages') !== -1 && img.closest('.prod_img')) img.src = gukImg;
        if (img.src.indexOf('goodsImages') !== -1 && img.closest('.slick-slide')) img.src = gukImg;
      });
      // Rename all 기타 국산차 → 국산차, thin text → 차종 선택 가능
      document.title = document.title.replace('기타 국산차', '국산차');
      var nameB = document.querySelector('.prod_name b');
      if (nameB) nameB.textContent = '국산차';
      document.querySelectorAll('.model_name small').forEach(function(el) { el.textContent = '전 차종 선택 가능'; });
      var fixTit = document.querySelector('.fix_tit');
      if (fixTit && fixTit.textContent.indexOf('국산차') !== -1) fixTit.textContent = '국산차';
      var fixM = document.querySelector('.prod_fix_m .title');
      if (fixM && fixM.textContent.indexOf('국산차') !== -1) fixM.textContent = '차량렌트서비스 - 국산차';
      document.querySelectorAll('td').forEach(function(el) {
        if (el.textContent.trim() === '기타국산차' || el.textContent.trim() === '기타 국산차') el.textContent = '국산차';
      });
      // img_wrap 유지 (아래 긴 배너)
      var ih = document.getElementById('img-hide');
      if (ih) ih.textContent = '.prod_img_big img, .prod_img_small img, .slick-slide img, .prod_name b, .model_name small, .fix_tit, .prod_fix_m .title { opacity: 1 !important; transition: opacity 0.3s; }';
    }, 300);
    setTimeout(function() { clearInterval(gukInterval); var ih = document.getElementById('img-hide'); if (ih) ih.remove(); }, 15000);
  }

  // === Order page: 차량 주문일 때만 고객메모 → 희망 차량 (정수기·가전 등은 native '고객메모' 유지) ===
  if (location.pathname.indexOf('dh_order/rental') !== -1) {
    // 주문 상품 카테고리 판별 — 상품 셀(.cart-list td.prod)의 상품명/브랜드로 차량 여부 결정
    // (차량: brand="차량렌트서비스", name="국산차/수입차/캐스퍼…" / 가전: brand="코웨이/LG…")
    var VEHICLE_RE = /차량렌트|차량렌탈|국산차|수입차|캐스퍼|신차|중고차|렌트카|렌터카/;
    var memoLabel = document.querySelector('label[for="du-msg"]');
    var memoArea = document.getElementById('tx_content');
    var isVehicleOrder = false;
    document.querySelectorAll('.cart-list td.prod, td.prod').forEach(function(td) {
      var nm = (td.querySelector('.name') || {}).textContent || '';
      var br = (td.querySelector('.brand') || {}).textContent || '';
      if (VEHICLE_RE.test(nm) || VEHICLE_RE.test(br)) isVehicleOrder = true;
    });
    if (isVehicleOrder) {
      if (memoLabel) memoLabel.textContent = '희망 차량';
      if (memoArea) memoArea.placeholder = '원하시는 차량의 브랜드, 모델명, 연식을 적어주세요. (예: 현대 팰리세이드 2025년식)';
      // 기타 국산차 → 국산차
      document.querySelectorAll('td, th, a, span, p, b, strong').forEach(function(el) {
        if (el.childNodes.length === 1 && el.childNodes[0].nodeType === 3 && el.textContent.indexOf('기타 국산차') !== -1) {
          el.textContent = el.textContent.replace('기타 국산차', '국산차');
        }
      });
    } else {
      // 차량 외(정수기·가전 등): native '고객메모' 라벨 유지, 안내 placeholder 확장
      // (계좌정보·카드결제 안내 추가 — 2026-06-08 사용자 요청. 카드번호 직접 수집은
      //  여전법/PCI상 금지 → '카드결제' 기재 시 담당자가 안전 채널로 접수 안내)
      if (memoArea) {
        memoArea.placeholder =
          '설치 희망일, 희망 색상, 기타 요청사항을 적어주세요.\n' +
          '사은품 수령 및 렌탈료 결제용 계좌정보(고객명의) 적어주세요.\n' +
          "제휴카드 및 카드결제 신청 시, '카드결제' 라고 기재해주시면 담당자가 접수안내 연락드립니다.";
      }
    }

    // 개인정보 동의 — 계좌번호 수집 항목·목적 명시 (메모란 계좌 수집의 동의 범위 정합,
    // 개인정보보호법 제15조). native 문구의 오탈자(개인식 별정보/성 명/연락처.주소)도 정리.
    document.querySelectorAll('.oq-terms').forEach(function(box){
      box.querySelectorAll('p').forEach(function(para){
        var t = para.textContent || '';
        if (t.indexOf('개인식') !== -1 && t.indexOf('계좌') === -1) {
          para.textContent = '개인식별정보(성명, 연락처, 주소), 계좌번호(고객 명의 — 렌탈료 결제 및 사은품 지급 목적)';
        } else if (t.indexOf('렌탈상담 관련 제안 접수 및 상담') !== -1 && t.indexOf('사은품') === -1) {
          para.textContent = '렌탈상담 관련 제안 접수 및 상담, 렌탈료 결제(자동이체 신청 안내) 및 사은품 지급';
        }
      });
    });
  }

  // === 수입차 detail page: image + thin font ===
  if (location.pathname.indexOf('prod_view/3586') !== -1) {
    var impDetailInterval = setInterval(function() {
      var bigImg = document.querySelector('.prod_img_big img');
      if (!bigImg) return;
      clearInterval(impDetailInterval);
      document.querySelectorAll('.model_name small').forEach(function(el) { el.textContent = '전 차종 선택 가능'; });
      document.querySelectorAll('.prod_img img').forEach(function(img) {
        if (img.src.indexOf('goodsImages') !== -1) img.src = newBanner;
      });
      document.querySelectorAll('.slick-slide img').forEach(function(img) {
        if (img.src.indexOf('goodsImages') !== -1) img.src = newBanner;
      });
    }, 300);
    setTimeout(function() { clearInterval(impDetailInterval); }, 15000);
  }

  // === 캐스퍼 detail page: remove EV references ===
  if (location.pathname.indexOf('prod_view/23613') !== -1) {
    var casperInterval = setInterval(function() {
      var nameB = document.querySelector('.prod_name b');
      if (!nameB) return;
      clearInterval(casperInterval);
      nameB.textContent = '현대자동차 캐스퍼';
      var modelSmall = document.querySelector('.model_name small');
      if (modelSmall) modelSmall.textContent = '캐스퍼 인스퍼레이션';
      document.title = document.title.replace('캐스퍼EV (EV) 전기차', '캐스퍼 인스퍼레이션');
      // Replace product image with addon thumbnail
      var casperImg = 'https://rentalshop.site/_data/file/goodsImages/b3fb834e9ecd833593e67c816ad8d0ec.jpg';
      document.querySelectorAll('.prod_img img').forEach(function(img) {
        if (img.src.indexOf('goodsImages') !== -1) img.src = casperImg;
      });
    }, 300);
    setTimeout(function() { clearInterval(casperInterval); }, 15000);
  }

  // === Live Price Table (product detail pages only, skip 신차렌트 products) ===
  // Reorder 인기 카테고리: 정수기, 공기청정기, 에어컨 first
  var priorityOrder = ['정수기', '공기청정기', '에어컨'];
  document.querySelectorAll('ul.new-mc__list').forEach(function(ul) {
    var items = Array.from(ul.children);
    var priority = [];
    var rest = [];
    priorityOrder.forEach(function(name) {
      items.forEach(function(li) {
        if (li.textContent.trim() === name && priority.indexOf(li) === -1) priority.push(li);
      });
    });
    items.forEach(function(li) { if (priority.indexOf(li) === -1) rest.push(li); });
    priority.concat(rest).forEach(function(li) { ul.appendChild(li); });
  });

  var carProdIds = ['2509','23613','2493','2337','9213','2345'];
  var isCarProd = carProdIds.some(function(id) { return location.pathname.indexOf('prod_view/' + id) !== -1; });
  if (location.pathname.indexOf('prod_view') !== -1 && !isCarProd) {
    // Only show price table for 정수기 products
    var prodNameEl = document.querySelector('.prod_name b');
    var prodNameText = prodNameEl ? prodNameEl.textContent : '';
    var isJeongsugi = prodNameText.indexOf('정수기') !== -1;
    var isLGsub = false;
    document.querySelectorAll('.month_box').forEach(function(mb) { if ((mb.getAttribute('data-supname')||'').indexOf('LG구독') !== -1) isLGsub = true; });
    if (!isJeongsugi || isLGsub) { /* skip price table for non-정수기 or LG구독 */ }
    else {
    var modelEl = document.querySelector('.model_name small');
    if (modelEl) {
      var fullModelText = modelEl.textContent.trim();
      var firstWord = fullModelText.split(' ')[0];
      var isModelCode = /[A-Z].*[0-9]/.test(firstWord) || /[0-9].*[A-Z]/.test(firstWord);
      var siteName = fullModelText;

      // Only hide the specific pricing table image (3192f27b)
      document.querySelectorAll('.img_wrap img').forEach(function(img) {
        if (img.src.indexOf('3192f27b') !== -1) img.style.display = 'none';
      });

      var targetImg = null;
      document.querySelectorAll('.img_wrap img').forEach(function(img) {
        if (img.src.indexOf('3192f27b') !== -1) targetImg = img;
      });

      // Create table container
      var tw = document.createElement('div');
      tw.id = 'livePriceTable';
      tw.innerHTML = '<div style="max-width:1100px;margin:20px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08)"><div id="lptTitle" style="background:#0838f8;color:#fff;text-align:center;padding:14px 20px;font-size:15px;font-weight:700;border-bottom:1px solid #eee">실시간 가격 확인중...</div><table id="lptTable" style="width:100%;border-collapse:collapse;font-size:13px"><thead><tr><th data-col="0" style="background:#0838f8;color:#fff;padding:12px 8px;text-align:center;font-weight:600;border-right:1px solid #eee">관리유형</th><th data-col="1" style="background:#0838f8;color:#fff;padding:12px 8px;text-align:center;font-weight:600;border-right:1px solid #eee">약정기간</th><th data-col="2" style="background:#0838f8;color:#fff;padding:12px 8px;text-align:center;font-weight:600;border-right:1px solid #eee">관리주기</th><th data-col="3" style="background:#0838f8;color:#fff;padding:12px 8px;text-align:center;font-weight:600;border-right:1px solid #eee">프로모션</th><th data-col="4" style="background:#0838f8;color:#fff;padding:12px 8px;text-align:center;font-weight:600;border-right:1px solid #eee">이달의 할인가</th><th data-col="5" style="background:#0838f8;color:#fff;padding:12px 8px;text-align:center;font-weight:600">최종 할인가</th></tr></thead><tbody id="lptBody"><tr><td colspan="6" style="text-align:center;padding:30px;color:#999">실시간 가격 확인중...</td></tr></tbody></table></div>';

      // Insert where the old image was
      if (targetImg) {
        targetImg.parentNode.insertBefore(tw, targetImg);
      } else {
        var iw = document.querySelector('.img_wrap');
        if (iw) iw.parentElement.insertBefore(tw, iw);
      }

      // Fetch mapping sheet first, then price data
      var MAP_URL='https://docs.google.com/spreadsheets/d/e/2PACX-1vSkILMb-8t9BG6u4HWbJ9yeVTxhFU-puHsoiJi2tGEJUMZt7ddmXvwDXnM7HC0UGQ/pub?gid=2102926561&single=true&output=csv';
      var PRICE_URL='https://docs.google.com/spreadsheets/d/e/2PACX-1vSkILMb-8t9BG6u4HWbJ9yeVTxhFU-puHsoiJi2tGEJUMZt7ddmXvwDXnM7HC0UGQ/pub?gid=644793625&single=true&output=csv';
      var CHUNGHO_URL='https://docs.google.com/spreadsheets/d/e/2PACX-1vSkILMb-8t9BG6u4HWbJ9yeVTxhFU-puHsoiJi2tGEJUMZt7ddmXvwDXnM7HC0UGQ/pub?gid=872567753&single=true&output=csv';
      var LG_URL='https://docs.google.com/spreadsheets/d/e/2PACX-1vSkILMb-8t9BG6u4HWbJ9yeVTxhFU-puHsoiJi2tGEJUMZt7ddmXvwDXnM7HC0UGQ/pub?gid=940661926&single=true&output=csv';
      var CUKU_URL='https://docs.google.com/spreadsheets/d/e/2PACX-1vSkILMb-8t9BG6u4HWbJ9yeVTxhFU-puHsoiJi2tGEJUMZt7ddmXvwDXnM7HC0UGQ/pub?gid=713090459&single=true&output=csv';
      var CUMING_URL='https://docs.google.com/spreadsheets/d/e/2PACX-1vSkILMb-8t9BG6u4HWbJ9yeVTxhFU-puHsoiJi2tGEJUMZt7ddmXvwDXnM7HC0UGQ/pub?gid=1642392826&single=true&output=csv';
      var SK_URL='https://docs.google.com/spreadsheets/d/e/2PACX-1vSkILMb-8t9BG6u4HWbJ9yeVTxhFU-puHsoiJi2tGEJUMZt7ddmXvwDXnM7HC0UGQ/pub?gid=72673581&single=true&output=csv';
      var LUHENS_URL='https://docs.google.com/spreadsheets/d/e/2PACX-1vSkILMb-8t9BG6u4HWbJ9yeVTxhFU-puHsoiJi2tGEJUMZt7ddmXvwDXnM7HC0UGQ/pub?gid=1353739758&single=true&output=csv';

      function parseCSVSimple(text){
        var rows=[],cur=[],fld='',inQ=false;
        for(var i=0;i<text.length;i++){
          var c=text.charAt(i);
          if(c==='"'){if(inQ&&text.charAt(i+1)==='"'){fld+='"';i++}else{inQ=!inQ}}
          else if(c===','&&!inQ){cur.push(fld.trim());fld=''}
          else if(c.charCodeAt(0)===10&&!inQ){cur.push(fld.trim());rows.push(cur);cur=[];fld=''}
          else if(c.charCodeAt(0)!==13){fld+=c}
        }
        if(fld||cur.length){cur.push(fld.trim());rows.push(cur)}
        return rows;
      }

      // Step 1: Fetch mapping
      fetch(MAP_URL).then(function(r){return r.text()}).then(function(mapText){
        var mapRows=parseCSVSimple(mapText);
        var modelText='';

        // Always try mapping first
        for(var mi=1;mi<mapRows.length;mi++){
          if(mapRows[mi][0]&&siteName.indexOf(mapRows[mi][0])!==-1){
            modelText=mapRows[mi][1];break;
          }
          if(mapRows[mi][0]&&mapRows[mi][0].indexOf(siteName)!==-1){
            modelText=mapRows[mi][1];break;
          }
        }
        // If no mapping found, use model code
        if(!modelText&&isModelCode){modelText=firstWord.replace(/_[가-힣0-9].*/,'')}
        if(!modelText){var fb=[['아이콘 냉온정수기 2.0','CHP-7211N'],['아이콘 냉정수기 2.0','CP-7211N']];for(var fi=0;fi<fb.length;fi++){if(siteName.indexOf(fb[fi][0])!==-1){modelText=fb[fi][1];break}}}

        if(!modelText){
          document.getElementById('livePriceTable').classList.add('lpt-empty');
          return;
        }

        // Step 2: Fetch price data (코웨이 + 청호나이스)
        return Promise.all([fetch(PRICE_URL).then(function(r){return r.text()}),fetch(CHUNGHO_URL).then(function(r){return r.text()}),fetch(LG_URL).then(function(r){return r.text()}),fetch(CUKU_URL).then(function(r){return r.text()}),fetch(CUMING_URL).then(function(r){return r.text()}),fetch(SK_URL).then(function(r){return r.text()}),fetch(LUHENS_URL).then(function(r){return r.text()})]).then(function(results){
        var NL=String.fromCharCode(10);var text=results.join(NL);
        var rows=parseCSVSimple(text);

        var hIdx=-1;
        for(var j=0;j<rows.length;j++){if(rows[j][0]==='제품군'){hIdx=j;break}}
        if(hIdx===-1){document.getElementById('livePriceTable').classList.add('lpt-empty');return}

        var cm='',cmk='',fil=[];
        for(var k=hIdx+1;k<rows.length;k++){
          var r=rows[k];if(!r||r.length<10||!r[3])continue;
          if(r[2])cm=r[2];if(r[1])cmk=r[1];
          var cmU=cm.toUpperCase(),mtU=modelText.toUpperCase();
          var exact=cmU.indexOf(mtU)!==-1||mtU.indexOf(cmU)!==-1;
          if(!exact){var cmB=cmU.replace(/[(/].*/,''),mtB=mtU.replace(/[(/].*/,'');if(cmB!==mtB)continue;}
          var cy=r[6]||'',pm=(r[4]||'').trim();
          var dP=parseFloat((r[8]||'').replace(/[^0-9.-]/g,''))||0;
          var tP=parseFloat((r[9]||'').replace(/[^0-9.-]/g,''))||0;
          var nP=parseFloat((r[7]||'').replace(/[^0-9.-]/g,''))||0;
          var td2='',cd=cy;
          if(cy==='자가관리'||cy.indexOf('필터')!==-1||cy.indexOf('서비스프리')!==-1){td2='자가관리';cd=cy==='자가관리'?'12개월 필터발송':cy}
          else if(cy.indexOf('M')!==-1){td2='방문관리';cd=cy.replace('M','')+'개월 방문'}
          else{td2=cy}
          var useP=dP||nP;var ps=r[3]+'년의무';
          var isNonCoway=cm.match(/^W[IPDUH]/)||cm.match(/^CP-/)||cm.match(/^CBT-/)||cm.match(/^P-/)||cm.match(/^HQP/)||cm.match(/^HQPM/)||cm.match(/^WPU/);
          if(isNonCoway&&pm.indexOf('반값')!==-1){
            fil.push({m:cm,mk:cmk,t:td2,p:ps,c:cd,pm:pm,dp:useP,fp:Math.round(useP/2)});
          } else if(isNonCoway){
            fil.push({m:cm,mk:cmk,t:td2,p:ps,c:cd,pm:pm,dp:useP,fp:useP});
          } else if(pm.indexOf('반값')!==-1&&pm.indexOf('타사보상')!==-1&&tP>0){
            var hm=pm.match(/(d+개월)s*반값할인/);var hp=hm?hm[1]+'반값할인':'반값할인';
            fil.push({m:cm,mk:cmk,t:td2,p:ps,c:cd,pm:hp,dp:useP,fp:Math.round(useP/2)});
            fil.push({m:cm,mk:cmk,t:td2,p:ps+' 타사보상',c:cd,pm:'1년간 렌탈료 1만원 할인',dp:tP,fp:tP-10000});
          } else if(pm.indexOf('반값')!==-1){
            fil.push({m:cm,mk:cmk,t:td2,p:ps,c:cd,pm:pm,dp:useP,fp:Math.round(useP/2)});
          } else if(tP>0&&pm.indexOf('타사보상')!==-1){
            fil.push({m:cm,mk:cmk,t:td2,p:ps+' 타사보상',c:cd,pm:pm,dp:tP,fp:tP-10000});
          } else {
            fil.push({m:cm,mk:cmk,t:td2,p:ps,c:cd,pm:pm,dp:useP,fp:useP});
          }
        }

        // Filter out rows without price numbers
        fil=fil.filter(function(r){return r.dp>0||r.fp>0});
        // Remove duplicate rows (same t+p+c+pm+fp)
        var seen={};fil=fil.filter(function(r){var key=r.t+'|'+r.p+'|'+r.c+'|'+r.pm+'|'+r.fp;if(seen[key])return false;seen[key]=true;return true;});
        if(!fil.length){document.getElementById('livePriceTable').classList.add('lpt-empty');return}
        document.getElementById('lptTitle').innerHTML=fil[0].mk+'<br><span style="font-size:12px;opacity:0.8">'+fil[0].m+'</span>';

        // Sort: 방문관리 first, then 자가관리
        var visit=fil.filter(function(r){return r.t==='방문관리'});
        var self2=fil.filter(function(r){return r.t!=='방문관리'});
        fil=visit.concat(self2);

        var tps={};fil.forEach(function(r){if(!tps[r.t])tps[r.t]=[];tps[r.t].push(r)});
        var tb=document.getElementById('lptBody');tb.innerHTML='';
        var isF=true;
        var s='padding:10px 8px;text-align:center;vertical-align:middle;border-bottom:1px solid #eee;border-right:1px solid #eee;cursor:pointer;';
        var fpr=function(n){return n>0?n.toLocaleString()+'원':'-'};

        Object.keys(tps).forEach(function(tn){
          var tr2=tps[tn],tD=false;
          tr2.forEach(function(rw,ri){
            var tr=document.createElement('tr');
            if(ri===0&&!isF)tr.style.borderTop='2px solid #0838f8';
            var h='';
            if(!tD){var tc2='color:#666;';h+='<td data-col="0" rowspan="'+tr2.length+'" style="'+s+'font-weight:600;'+tc2+'">'+tn+'</td>';tD=true}
            h+='<td data-col="1" style="'+s+'">'+rw.p+'</td>';
            h+='<td data-col="2" style="'+s+'">'+rw.c+'</td>';
            h+='<td data-col="3" style="'+s+'font-size:11px;color:#888">'+rw.pm+'</td>';
            var promoAmt=0;var pmNum=rw.pm.match(/([0-9]+)원/);if(pmNum)promoAmt=parseInt(pmNum[1]);
            h+='<td data-col="4" style="'+s+'color:#e53935;font-weight:700;font-size:14px">'+fpr(rw.dp>0?rw.dp+promoAmt:0)+'</td>';
            h+='<td data-col="5" style="'+s+'color:#0838f8;font-weight:700;font-size:15px;border-right:none">'+fpr(rw.fp)+'</td>';
            tr.innerHTML=h;tb.appendChild(tr)
          });isF=false
        });

        var aT=null;
        var lptTbl=document.getElementById('lptTable');

        // Hover effect
        lptTbl.addEventListener('mouseover',function(e){
          var td=e.target.closest('td');if(!td||aT)return;
          var ci=td.dataset.col,tr=td.closest('tr');
          lptTbl.querySelectorAll('.lpt-hrow').forEach(function(el){el.classList.remove('lpt-hrow')});
          lptTbl.querySelectorAll('.lpt-hcol').forEach(function(el){el.classList.remove('lpt-hcol')});
          tr.classList.add('lpt-hrow');
          if(ci)lptTbl.querySelectorAll('td[data-col="'+ci+'"]').forEach(function(c){c.classList.add('lpt-hcol')});
        });
        lptTbl.addEventListener('mouseout',function(e){
          if(aT)return;
          lptTbl.querySelectorAll('.lpt-hrow').forEach(function(el){el.classList.remove('lpt-hrow')});
          lptTbl.querySelectorAll('.lpt-hcol').forEach(function(el){el.classList.remove('lpt-hcol')});
        });

        // Click effect
        lptTbl.addEventListener('click',function(e){
          var td=e.target.closest('td');if(!td)return;
          lptTbl.querySelectorAll('td,th').forEach(function(el){el.style.removeProperty('background');el.style.removeProperty('color')});
          lptTbl.querySelectorAll('.lpt-hrow').forEach(function(el){el.classList.remove('lpt-hrow')});
          lptTbl.querySelectorAll('.lpt-hcol').forEach(function(el){el.classList.remove('lpt-hcol')});
          if(aT===td){aT=null;return}
          aT=td;var ci=td.dataset.col,tr=td.closest('tr');
          tr.querySelectorAll('td').forEach(function(c){c.style.background='#e8edff'});
          if(ci)lptTbl.querySelectorAll('td[data-col="'+ci+'"]').forEach(function(c){c.style.background='#e8edff'});
          td.style.background='#0838f8';td.style.color='#fff'
        });

        // Inject hover styles
        var hStyle=document.createElement('style');
        hStyle.textContent='#lptTable .lpt-hrow td{background:#f0f3ff !important}#lptTable .lpt-hcol{background:#f0f3ff !important}#lptTable .lpt-hrow .lpt-hcol{background:#dde3ff !important}';
        document.head.appendChild(hStyle);
      })})
      .catch(function(err){
        document.getElementById('livePriceTable').classList.add('lpt-empty');
      });
    }
  } // end isJeongsugi
  }
}
// CDN 폴백 등으로 DOMContentLoaded 이후 늦게 로드돼도 초기화되도록 readyState 가드.
// (기존엔 무조건 addEventListener라서 늦은 로드 시 헤더 리뉴얼·bj-ready가 영영 실행 안 됐음)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bjHeaderMainInit);
} else {
  bjHeaderMainInit();
}


  // --- Script block 2 ---

// === Combined Bottom Bar v4 - 2x2 grid layout ===
// [비활성 — 절대 규칙 #33] 하단 위젯은 모듈 B(.prod_view_bot.card.mt40 wrapper)가 단일 소유.
// 이 모듈 A bar(#billyjo-bottom-bar)는 모듈 B removeStrayBbInner가 생성 즉시 DOM 삭제하던
// dead code였고, 삭제 후 남은 syncBottomBar가 month_box 클릭마다
// "Cannot set properties of null" throw + 느린 기기에서 위젯 깜빡임/경합의 원인.
// 동일 위젯을 두 모듈이 만들면 안 됨 — 재활성화 금지.
var BJ_MODULE_A_BOTTOM_BAR = false;
if (BJ_MODULE_A_BOTTOM_BAR && location.pathname.indexOf('prod_view') !== -1) {
  (function initBottomBar() {
    var bbInterval = setInterval(function() {
      var monthBoxes = document.querySelectorAll('.month_box');
      var prodName = document.querySelector('.prod_name b');
      if (monthBoxes.length === 0 || !prodName) return;
      clearInterval(bbInterval);

      var productName = prodName.textContent.trim();

      // Group month boxes by supplier
      var suppliers = [];
      var supMap = {};
      monthBoxes.forEach(function(mb, idx) {
        var sn = mb.getAttribute('data-supname') || '';
        if (!supMap[sn]) { supMap[sn] = []; suppliers.push(sn); }
        supMap[sn].push(idx);
      });

      var hasOptions = document.querySelectorAll('.option_select option').length > 1;
      var optionHtml = '';
      if (hasOptions) {
        var originalSelect = document.querySelector('.option_select');
        var options = originalSelect ? originalSelect.innerHTML : '<option value="">옵션 없음</option>';
        optionHtml = '<select class="bb-option-select" onchange="option_selec(this.value)">' + options + '</select>';
      }

      // Supplier tabs (only if multiple)
      var supTabsHtml = '';
      if (suppliers.length > 1) {
        supTabsHtml = '<div class="bb-sup-tabs">';
        suppliers.forEach(function(sn, si) {
          supTabsHtml += '<button class="bb-sup-tab' + (si === 0 ? ' active' : '') + '" data-sup="' + sn + '">' + sn + '</button>';
        });
        supTabsHtml += '</div>';
      }

      // Build all month pills with supplier data
      var monthPillsHtml = '';
      monthBoxes.forEach(function(mb, idx) {
        var period = mb.getAttribute('data-month') || '';
        var price = mb.getAttribute('data-price') || '';
        var monthKey = mb.getAttribute('data-month_key') || '';
        var sup = mb.getAttribute('data-supname') || '';
        var hiddenClass = sup === suppliers[0] ? '' : ' bb-hidden';
        monthPillsHtml +=
          '<div class="bb-month-pill' + hiddenClass + '" data-idx="' + idx + '" data-month-key="' + monthKey + '" data-sup="' + sup + '">' +
            '<span class="bb-month-period">' + period + '</span>' +
            '<span class="bb-month-price">월 ' + price + '원</span>' +
          '</div>';
      });

      var activeSup = suppliers[0] || '';

      var bar = document.createElement('div');
      bar.id = 'billyjo-bottom-bar';
      bar.className = 'no-selection' + (hasOptions ? '' : ' bb-no-option');
      bar.innerHTML =
        '<div class="bb-inner">' +
          '<div class="bb-left">' +
            '<div class="bb-product-name">' + activeSup + ' - ' + productName + '</div>' +
            supTabsHtml +
            '<div class="bb-months">' + monthPillsHtml + '</div>' +
          '</div>' +
          '<div class="bb-right">' +
            '<div class="bb-right-top">' +
              optionHtml +
              '<button type="button" class="bb-btn bb-btn-cart" onclick="shoporder(\'cart\')">장바구니</button>' +
              '<button type="button" class="bb-btn bb-btn-rent" onclick="shoporder(\'rent\')">' +
                '<svg viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>' +
                '렌탈 신청' +
              '</button>' +
            '</div>' +
            '<div class="bb-right-bottom">' +
              '<span class="bb-price-label">월 렌탈료</span>' +
              '<span class="bb-price" id="bb-price">-</span>' +
            '</div>' +
          '</div>' +
        '</div>';

      document.body.appendChild(bar);

      var bbPills = bar.querySelectorAll('.bb-month-pill');

      // Supplier tab click: filter pills by supplier
      bar.querySelectorAll('.bb-sup-tab').forEach(function(tab) {
        tab.addEventListener('click', function() {
          bar.querySelectorAll('.bb-sup-tab').forEach(function(t) { t.classList.remove('active'); });
          tab.classList.add('active');
          activeSup = tab.getAttribute('data-sup');
          bar.querySelector('.bb-product-name').textContent = activeSup + ' - ' + productName;
          bbPills.forEach(function(p) {
            if (p.getAttribute('data-sup') === activeSup) {
              p.classList.remove('bb-hidden');
            } else {
              p.classList.add('bb-hidden');
            }
            p.classList.remove('active');
          });
          bar.classList.add('no-selection');
          document.getElementById('bb-price').textContent = '-';
        });
      });

      // Month pill click
      bbPills.forEach(function(pill) {
        pill.addEventListener('click', function() {
          var idx = parseInt(pill.getAttribute('data-idx'));
          monthBoxes[idx].click();
        });
      });

      function syncBottomBar() {
        var activeMonth = document.querySelector('.month > div.on a.month_box');
        bbPills.forEach(function(p) { p.classList.remove('active'); });
        if (activeMonth) {
          var activeKey = activeMonth.getAttribute('data-month_key');
          var activeSC = activeMonth.getAttribute('data-supcode');
          bbPills.forEach(function(p) {
            var idx = parseInt(p.getAttribute('data-idx'));
            var mb = monthBoxes[idx];
            if (mb.getAttribute('data-month_key') === activeKey && mb.getAttribute('data-supcode') === activeSC) p.classList.add('active');
          });
          var price = activeMonth.getAttribute('data-price');
          bar.classList.remove('no-selection');
          document.getElementById('bb-price').textContent = '₩' + price + '원';
        } else {
          bar.classList.add('no-selection');
          document.getElementById('bb-price').textContent = '-';
        }
      }

      monthBoxes.forEach(function(mb) {
        mb.addEventListener('click', function() {
          setTimeout(syncBottomBar, 100);
        });
      });

      var bbLastY = window.scrollY;
      function checkScroll() {
        var currentY = window.scrollY;
        var delta = currentY - bbLastY;
        if (currentY < 100) {
          bar.classList.add('show');
        } else if (delta > 5) {
          bar.classList.remove('show');
        } else if (delta < -5) {
          bar.classList.add('show');
        }
        bbLastY = currentY;
      }
      window.addEventListener('scroll', checkScroll, { passive: true });
      setTimeout(function() { bar.classList.add('show'); }, 500);

      if (hasOptions) {
        var bbSelect = bar.querySelector('.bb-option-select');
        document.querySelectorAll('.option_select').forEach(function(sel) {
          sel.addEventListener('change', function() {
            if (bbSelect) bbSelect.value = this.value;
          });
        });
        if (bbSelect) {
          bbSelect.addEventListener('change', function() {
            document.querySelectorAll('.option_select').forEach(function(sel) {
              sel.value = bbSelect.value;
            });
          });
        }
      }

      syncBottomBar();
    }, 500);
    setTimeout(function() { clearInterval(bbInterval); }, 30000);
  })();
}


// === Promote 인터넷 (6-1198) to top-level GNB next to TV·IT ===
(function promoteInternetCategory() {
  var URL = '/html/dh_prod/prod_list/6-1198';
  var TEXT = '인터넷';

  function findTvitLi(gnb) {
    var lis = gnb.querySelectorAll('li.gnb__menu');
    for (var i = 0; i < lis.length; i++) {
      var a = lis[i].querySelector(':scope > a');
      if (a && a.textContent.trim() === 'TV·IT') return lis[i];
    }
    return null;
  }

  function ensureGnb() {
    var gnb = document.querySelector('ul.new-gnb');
    if (!gnb) return false;
    if (gnb.querySelector('.bj-internet-li')) return true;
    var tvit = findTvitLi(gnb);
    if (!tvit) return false;
    var li = document.createElement('li');
    li.className = 'gnb__menu bj-internet-li';
    var a = document.createElement('a');
    a.href = URL;
    a.textContent = TEXT;
    li.appendChild(a);
    tvit.parentNode.insertBefore(li, tvit.nextSibling);
    return true;
  }

  function ensureCategoryWrap() {
    var wraps = document.querySelectorAll('.category__wrap');
    if (!wraps.length) return false;
    var inserted = false;
    wraps.forEach(function(wrap) {
      if (wrap.querySelector('.bj-internet-cat')) { inserted = true; return; }
      var anchors = wrap.querySelectorAll('a');
      var tvit = null;
      for (var i = 0; i < anchors.length; i++) {
        var t = anchors[i].textContent.trim();
        var h = anchors[i].getAttribute('href') || '';
        if (t === 'TV·IT' || h.indexOf('prod_list/6-678') !== -1) { tvit = anchors[i]; break; }
      }
      if (!tvit) return;
      var a = document.createElement('a');
      a.href = URL;
      a.textContent = TEXT;
      a.className = 'bj-internet-cat';
      tvit.parentNode.insertBefore(a, tvit.nextSibling);
      inserted = true;
    });
    return inserted;
  }

  function run() {
    ensureGnb();
    ensureCategoryWrap();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
  // Re-run in case nav renders late (mobile drawer, async hydration)
  var tries = 0;
  var interval = setInterval(function() {
    run();
    if (++tries >= 8) clearInterval(interval);
  }, 400);
})();

// Rename top-level category label: 정수기·환경 → 물·공기·청소가전 (category prod_list/1-8)
(function renameWaterAirCategory() {
  var OLD = '정수기·환경';
  var NEW = '물·공기·청소가전';

  function rename() {
    // Browser tab / page title (정수기·환경 > 정수기 → 물·공기·청소가전 > 정수기)
    if (document.title.indexOf(OLD) !== -1) document.title = document.title.split(OLD).join(NEW);
    if (!document.body) return;
    // Replace the label in every visible text node: PC GNB, 카테고리바, mobile aside,
    // and the category page heading (p.prod_list__tit) which isn't an <a>.
    // Skip SCRIPT/STYLE/NOSCRIPT so JSON-LD structured data and injected CSS stay intact.
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: function(n) {
        if (n.textContent.indexOf(OLD) === -1) return NodeFilter.FILTER_REJECT;
        var tag = n.parentNode && n.parentNode.nodeName;
        if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT') return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var nodes = [], cur;
    while ((cur = walker.nextNode())) nodes.push(cur);
    nodes.forEach(function(n) { n.textContent = n.textContent.split(OLD).join(NEW); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', rename);
  } else {
    rename();
  }
  // Re-run in case nav renders late (mobile drawer, async hydration)
  var tries = 0;
  var interval = setInterval(function() {
    rename();
    if (++tries >= 8) clearInterval(interval);
  }, 400);
})();

// Hide 전원방식/규격 spec rows on prod_view/1791
(function() {
  if (location.pathname.indexOf('prod_view/1791') === -1) return;
  var HIDE_LABELS = ['전원방식', '규격'];
  function hideRows() {
    var rows = document.querySelectorAll('.prod_table tr');
    rows.forEach(function(tr) {
      var th = tr.querySelector('th');
      if (!th) return;
      if (HIDE_LABELS.indexOf(th.textContent.trim()) !== -1) {
        tr.style.display = 'none';
      }
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', hideRows);
  } else {
    hideRows();
  }
  var tries = 0;
  var iv = setInterval(function() {
    hideRows();
    if (++tries >= 8) clearInterval(iv);
  }, 400);
})();

// === 모바일 사이드(aside) 슬라이드 메뉴 로고: 크기 축소 + 한글/영문 2초 cross-fade (v0.6.9) ===
// 헤더 로고 cross-fade(alternateBillyjoLogo)는 모듈 B(prod_view 전용)에만 있어서
// 전 페이지에 뜨는 aside 메뉴 로고에는 적용 안 됨 → 모듈 A(전역)에서 별도 처리.
(function billyjoAsideLogo() {
  var BJ_LOGO_KO = 'https://admin2.billyjo.co.kr/logo/billyjo-ko.png';
  var BJ_LOGO_EN = 'https://admin2.billyjo.co.kr/logo/billyjo-en.png';
  var ASIDE_LOGO_SEL = '.aside__top .top__logo img';

  // 크기 축소 (모바일 한정) — 기존 대비 많이 줄임. 부모를 inline-block+relative로
  // 만들어 EN overlay 100%x100%가 KO 이미지 크기에 정확히 겹치도록.
  var css = document.createElement('style');
  css.id = 'bj-aside-logo-css';
  css.textContent = [
    '@media (max-width:768px){',
    '  .aside__top .top__logo{ display:inline-block !important; position:relative !important; line-height:0 !important; }',
    '  .aside__top .top__logo img{ width:92px !important; max-width:92px !important; height:auto !important; }',
    '}'
  ].join('\n');
  document.head.appendChild(css);

  function setupAsideLogo() {
    var imgs = document.querySelectorAll(ASIDE_LOGO_SEL);
    if (!imgs.length) return false;
    imgs.forEach(function(img) {
      if (img.dataset.bjAsideLogoAlt) return;
      var parent = img.parentNode;
      if (!parent) return;
      img.dataset.bjAsideLogoAlt = '1';
      var cs = window.getComputedStyle(parent);
      if (cs.position === 'static') parent.style.position = 'relative';
      // 원본을 한글 로고로
      img.src = BJ_LOGO_KO;
      img.classList.add('bj-aside-logo-ko');
      img.style.transition = 'opacity 0.2s ease-in-out';
      img.style.opacity = '1';
      // 영문 로고를 같은 위치에 absolute로 겹치기
      var enImg = img.cloneNode(false);
      enImg.removeAttribute('id');
      enImg.classList.remove('bj-aside-logo-ko');
      enImg.classList.add('bj-aside-logo-en');
      enImg.src = BJ_LOGO_EN;
      enImg.style.position = 'absolute';
      enImg.style.left = '0';
      enImg.style.top = '0';
      enImg.style.width = '100%';
      enImg.style.height = '100%';
      enImg.style.objectFit = 'contain';
      enImg.style.opacity = '0';
      enImg.style.transition = 'opacity 0.2s ease-in-out';
      enImg.style.pointerEvents = 'none';
      parent.appendChild(enImg);
    });
    if (!window.__bjAsideLogoInterval) {
      window.__bjAsideLogoInterval = setInterval(function() {
        var ko = document.querySelectorAll('img.bj-aside-logo-ko');
        var en = document.querySelectorAll('img.bj-aside-logo-en');
        if (!ko.length || !en.length) return;
        var showEn = ko[0].style.opacity !== '0';
        ko.forEach(function(i) { i.style.opacity = showEn ? '0' : '1'; });
        en.forEach(function(i) { i.style.opacity = showEn ? '1' : '0'; });
      }, 2000);
    }
    return true;
  }

  // aside 메뉴는 스킨이 늦게 렌더할 수 있어 재시도.
  function tryInit() {
    if (setupAsideLogo()) return;
    var tries = 0;
    var iv = setInterval(function() {
      if (setupAsideLogo() || ++tries >= 15) clearInterval(iv);
    }, 400);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', tryInit);
  } else {
    tryInit();
  }
})();

// === 메인 페이지: 주요 카테고리 ↔ 이달의 추천제품 사이 v5 컨텐츠 주입 ===
(function injectMainPageV5() {
  var V5_URL = 'https://cdn.jsdelivr.net/gh/billyjo-appsilon/billyjo-inject@d129e58/preview-detail-page-v5.html';
  var CDN_BASE = 'https://cdn.jsdelivr.net/gh/billyjo-appsilon/billyjo-inject@d129e58';
  var INJECTED_ID = 'bj-v5-injected';

  function findTargetHeading() {
    var nodes = document.querySelectorAll('h2');
    for (var i = 0; i < nodes.length; i++) {
      if ((nodes[i].textContent || '').indexOf('이달의 추천제품') !== -1) return nodes[i];
    }
    return null;
  }

  function isInjected() { return !!document.getElementById(INJECTED_ID); }

  function wrapZones(pageEl) {
    var children = Array.prototype.slice.call(pageEl.children);
    var groups = [];
    var i = 0;
    while (i < children.length) {
      var child = children[i];
      if (child.classList && child.classList.contains('pill-wrap')) {
        var start = i, end = i + 1;
        while (end < children.length) {
          var next = children[end], cls = next.classList;
          if (cls && (cls.contains('pill-wrap') || cls.contains('section-divider'))) break;
          end++;
        }
        groups.push([start, end]);
        i = end;
      } else { i++; }
    }
    var colors = ['zone-sky', 'zone-white'];
    for (var g = groups.length - 1; g >= 0; g--) {
      var zone = document.createElement('div');
      zone.className = 'zone ' + colors[g % 2];
      pageEl.insertBefore(zone, children[groups[g][0]]);
      for (var k = groups[g][0]; k < groups[g][1]; k++) zone.appendChild(children[k]);
    }
  }

  // === 메인 섹션 순서 재배치 + 시안(Figma 9:89)에 없는 섹션 숨김 (2026-07-01) ===
  //   #bj-v5-injected 를 flex column 으로 만들고 zone 별 CSS order 지정 (DOM 이동 없음, 되돌리기 쉬움).
  //   매칭은 섹션 제목 텍스트 기준(자식 인덱스 비의존). 롤백: 이 함수 + 호출 1줄 제거.
  function reorderHome(pageEl) {
    if (!pageEl || pageEl.getAttribute('data-bj-reordered')) return;
    pageEl.setAttribute('data-bj-reordered', '1');
    pageEl.style.display = 'flex';
    pageEl.style.flexDirection = 'column';
    pageEl.style.rowGap = '28px'; // P1② 섹션 간 세로 여백 (2026-07-02)
    // P1① 섹션 헤더 pill: 솔리드 블루 블록 → 절제된 블루 eyebrow 텍스트 (파랑 남용 완화, 아정당 레퍼런스)
    if (!document.getElementById('bj-refine-css')) {
      var bjRf = document.createElement('style');
      bjRf.id = 'bj-refine-css';
      bjRf.textContent = '#bj-v5-injected .pill-wrap{display:none !important}' +
        // 각 섹션 상단 작은 파란 eyebrow(.pill) 전부 제거 (Jun 지시, 2026-07-02) — 큰 제목만 유지
        '#bj-v5-injected .pill{display:none !important}' +
        // "빌리조" 텍스트(.bj-logo)를 한글 워드마크 로고 이미지로 치환 (2026-07-02)
        ".bj-logo{display:inline-block !important;vertical-align:middle !important;height:1.5em !important;width:2.97em !important;background:url('https://cdn.jsdelivr.net/gh/billyjo-appsilon/billyjo-inject@25e1555/images/billyjo-wordmark.png') no-repeat left center/contain !important;color:transparent !important;text-indent:-9999px !important;overflow:hidden !important;white-space:nowrap !important}" +
        // 브랜드 로고 그리드 → 가로 마퀴 (시안 디자인 맞춤, 카피 16개 유지) (2026-07-02)
        "#bj-v5-injected .brand-grid[data-bjmq]{display:block !important;overflow:hidden !important;grid-template-columns:none !important;height:auto !important;-webkit-mask-image:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent);mask-image:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent)}" +
        ".bj-brand-track{display:flex !important;width:max-content !important;gap:12px !important;align-items:center;animation:bjBrandScroll 26s linear infinite}" +
        ".bj-brand-track:hover{animation-play-state:paused}" +
        ".bj-brand-track .brand-cell{flex:0 0 auto !important;width:132px !important;height:60px !important;margin:0 !important}" +
        "@keyframes bjBrandScroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}" +
        // 신뢰도 섹션: 마퀴↔보장바 사이 헤딩 + 2번째 보장 바 (시안 Image #14 맞춤) (2026-07-02)
        "#bj-v5-injected .bj-trust-sub{display:block !important;text-align:center !important;font-size:20px !important;font-weight:800 !important;color:#111 !important;letter-spacing:-.02em !important;line-height:1.42 !important;word-break:keep-all !important;margin:24px auto 14px !important;max-width:none !important;width:auto !important}" +
        "#bj-v5-injected .bj-trust-sub strong{color:#0838f8 !important}" +
        "#bj-v5-injected .highlight-bar[data-bj-bar2]{margin-top:10px !important}" +
        // 두 보장 바 1행 2열 (PC 나란히 / 모바일 세로 스택) (2026-07-03)
        "#bj-v5-injected .bj-bars-row{display:flex !important;gap:14px !important;align-items:stretch !important}" +
        "#bj-v5-injected .bj-bars-row .highlight-bar{flex:1 1 0 !important;min-width:0 !important;margin:0 !important}" +
        "@media(max-width:767px){#bj-v5-injected .bj-bars-row{flex-direction:column !important;gap:10px !important}}" +
        // 서비스 섹션(본사보다 빌리조가 좋은 점)을 시안 2×2 4카드로 재구성 (2026-07-03)
        "#bj-v5-injected .diff-grid[data-bj-svc]{grid-template-columns:1fr 1fr !important;gap:14px !important;grid-auto-rows:1fr !important}" +
        "#bj-v5-injected .diff-grid[data-bj-svc] .diff-card{padding:24px 18px !important;gap:10px !important}" +
        "#bj-v5-injected .diff-grid[data-bj-svc] .diff-card .icon{margin:2px 0 !important}" +
        // 서비스·혜택 카드를 신청방법(step4) 스타일로 — 아이콘 파랑 + 번호배지 연한파랑 알약 + 제목 슬레이트 (2026-07-03)
        "#bj-v5-injected .diff-grid[data-bj-svc] .num-circle{background:#eef2ff !important;color:#0838f8 !important;width:auto !important;height:auto !important;min-width:0 !important;padding:5px 13px !important;border-radius:8px !important;font-size:12.5px !important;line-height:1 !important;box-shadow:none !important}" +
        "#bj-v5-injected .diff-grid[data-bj-svc] .ico{color:#0838f8 !important;stroke:#0838f8 !important}" +
        "#bj-v5-injected .diff-grid[data-bj-svc] .diff-card .t{color:#475569 !important;font-weight:500 !important;font-size:14px !important}" +
        "#bj-v5-injected .diff-grid[data-bj-svc] .num-circle{letter-spacing:-.01em !important}" +
        "#bj-v5-injected .bj-svc-card{justify-content:center !important}" +
        "#bj-v5-injected .bj-svc-card .d{margin-top:6px !important}" +
        "#bj-v5-injected .bj-svc-blue{color:#0838f8 !important}" +
        "#bj-v5-injected .bj-svc-mini{display:inline-block !important;margin-top:12px !important;padding:5px 13px !important;background:#eaf0ff !important;color:#0838f8 !important;font-size:12px !important;font-weight:700 !important;border-radius:999px !important;letter-spacing:-.01em !important}" +
        // 혜택 2×2 섹션 헤딩(이모지 + 텍스트) (2026-07-03)
        "#bj-v5-injected .bj-ben-hd{display:flex !important;align-items:center !important;justify-content:center !important;gap:12px !important;margin-bottom:22px !important}" +
        "#bj-v5-injected .bj-ben-em{font-size:32px !important;line-height:1 !important;flex:0 0 auto !important}" +
        "#bj-v5-injected .bj-ben-h{text-align:left !important;font-size:23px !important;font-weight:800 !important;line-height:1.34 !important;letter-spacing:-.02em !important;color:#1a1a1e !important}" +
        "#bj-v5-injected .bj-ben-h strong{color:#0838f8 !important}" +
        // 혜택 섹션 위 디바이더 라인(.penalty-divider) 제거 (2026-07-03)
        "#bj-v5-injected .penalty-divider{display:none !important}" +
        // 혜택 헤딩 1줄 유지 — 모바일서 폰트·이모지 축소 + keep-all (2026-07-03)
        "#bj-v5-injected .bj-ben-h{white-space:nowrap !important}" +
        "@media(max-width:767px){#bj-v5-injected .bj-ben-h{font-size:16.5px !important}#bj-v5-injected .bj-ben-em{font-size:23px !important}#bj-v5-injected .bj-ben-hd{gap:8px !important}}" +
        "@media(min-width:768px){#bj-v5-injected .bj-trust-sub{font-size:24px !important;margin:30px auto 16px !important}}";
      (document.head || document.documentElement).appendChild(bjRf);
    }
    // 시안 순서: 히어로 → 브릿지캡션(order 2, 아래서 생성) → 후기 → 신뢰도 → 서비스 → 큐레이션 → 신청방법 → 가격비교 → FAQ
    var ORDER = [
      ['실제 고객 후기', 3],
      ['부담없이 시작하세요', 5],
      ['본사보다 빌리조가 좋은', 6],
      ['빌리조만의 컨설팅', 7],
      ['렌탈 신청 방법', 8],
      ['같은 가격, 더 풍성한 혜택', 10],
      ['자주 묻는 질문', 11]
    ];
    // 시안에 없는 섹션 = 숨김 (이사·신혼 / 광고전화없음(개인정보로 통합) / 위약금 중도해지 / 제휴카드 추가혜택)
    var HIDE = ['이사·신혼도 안심하세요', '광고 전화 없습니다', '위약금, 숨기지 않습니다', '제휴카드 추가 혜택'];
    Array.prototype.slice.call(pageEl.children).forEach(function(z) {
      // textContent 사용(innerText 아님): eyebrow(.pill)를 display:none 처리해도
      // ORDER/HIDE 매칭 문자열(=eyebrow 텍스트)이 유지되도록. innerText는 숨긴 텍스트 제외 → 매칭 전멸. (2026-07-03)
      var t = z.textContent || '';
      var i;
      for (i = 0; i < HIDE.length; i++) {
        if (t.indexOf(HIDE[i]) !== -1) { z.style.display = 'none'; return; }
      }
      for (i = 0; i < ORDER.length; i++) {
        if (t.indexOf(ORDER[i][0]) !== -1) { z.style.order = String(ORDER[i][1]); return; }
      }
      if (!z.style.order) z.style.order = '1'; // 히어로/기타 = 최상단 유지
    });

    // 신뢰도 트러스트 카드(.hero "설치 케어는 본사에서") → 시안 "믿고 맡길 수 있는 빌리조"로 텍스트 교체 + 후기 다음(order 4) (2026-07-02)
    var bjTrust = pageEl.querySelector('.hero');
    if (bjTrust && !bjTrust.getAttribute('data-bj-trust')) {
      bjTrust.setAttribute('data-bj-trust', '1');
      bjTrust.style.order = '4';
      var bjTh = bjTrust.querySelector('h1');
      if (bjTh) bjTh.innerHTML = '믿고 맡길 수 있는 <span class="yellow">빌리조</span>';
      var bjTp = bjTrust.querySelector('p');
      if (bjTp) bjTp.innerHTML = '막막했던 설치부터 관리까지 부담 Zero!<br>빌리조는 전 상품 정품 보장하는 직계약 렌탈 플랫폼입니다.';
      var bjEb = bjTrust.querySelector('.badge-hero');
      if (bjEb) bjEb.style.display = 'none';
    }

    // 브릿지 캡션 신규 추가 (시안 9:89, 2026-07-02) — 히어로 다음·후기 위(order 2). "오래 사용할 가전인데..."
    if (!document.getElementById('bj-bridge-css')) {
      var bs = document.createElement('style');
      bs.id = 'bj-bridge-css';
      bs.textContent = '.bj-bridge{order:2;text-align:center;padding:16px 20px;background:transparent}' +
        '.bj-bridge .bj-bq{font-size:48px;color:#c2c6d2;font-weight:800;line-height:.7}' +
        '.bj-bridge p{margin:6px 0;font-size:34px;font-weight:800;line-height:1.45;letter-spacing:-.02em;color:#0838f8;word-break:keep-all}' +
        '.bj-bridge p b{color:#0838f8}' +
        '@media(max-width:768px){.bj-bridge{padding:12px 18px}.bj-bridge p{font-size:21px;margin:4px 0}.bj-bridge .bj-bq{font-size:30px}}';
      (document.head || document.documentElement).appendChild(bs);
    }
    if (!pageEl.querySelector('.bj-bridge')) {
      var br = document.createElement('div');
      br.className = 'bj-bridge';
      br.innerHTML = '<p>오래 사용할 가전인데,<br><b>신중하게 비교하고 골라야 하지 않을까요?</b></p>';
      pageEl.appendChild(br);
    }

    // 혜택 2×2 섹션(시안 Image #19) 신규 삽입 — 신청방법(8) 뒤 order 9 (bg-unify 전에 생성해 배경 자동 교차) (2026-07-03)
    if (!pageEl.querySelector('.bj-ben-zone')) {
      var bjBenZone = document.createElement('div');
      bjBenZone.className = 'zone bj-ben-zone';
      bjBenZone.style.order = '9';
      var bjBen = [
        { no: '01', lb: '지원금', ic: '#i-gift', t: '최대 지원금<br>+ 사은품 제공' },
        { no: '02', lb: '할인', ic: '#i-ticket', t: '최대 15개월반값<br>or 최대 50% 할인' },
        { no: '03', lb: '추가할인', ic: '#i-coins', t: '타사 제품 이용 시<br>10% + 추가할인' },
        { no: '04', lb: '제휴카드', ic: '#i-card', t: '제휴카드<br>할인혜택' }
      ];
      var bjBenCards = bjBen.map(function (c) {
        return '<div class="diff-card bj-svc-card"><div class="num-circle">' + c.no + ' ' + c.lb + '</div>' +
          '<div class="icon"><svg class="ico"><use href="' + c.ic + '"></use></svg></div>' +
          '<div class="t">' + c.t + '</div></div>';
      }).join('');
      bjBenZone.innerHTML = '<section>' +
        '<div class="bj-ben-hd"><span class="bj-ben-em">🧮💰</span>' +
        '<div class="bj-ben-h">잠깐! <strong>혜택도 든든하게</strong> 챙겨야죠</div></div>' +
        '<div class="diff-grid bj-ben-grid" data-bj-svc="1">' + bjBenCards + '</div>' +
        '</section>';
      pageEl.appendChild(bjBenZone);
    }

    // 배경 전체 화이트 통일 (하늘색·회색 제거, Jun 요청) — .hero(파란 트러스트 카드)만 제외 (2026-07-03)
    var bjSecs = Array.prototype.slice.call(pageEl.children).filter(function(z) {
      return z.style.display !== 'none' && (z.classList.contains('zone') || z.classList.contains('bj-bridge'));
    });
    bjSecs.forEach(function(z) { z.style.setProperty('background-color', '#ffffff', 'important'); });
    // 컨테이너·섹션 간격도 흰색 (회색 gap/부모 배경 비침 방지) (2026-07-03)
    pageEl.style.setProperty('background-color', '#ffffff', 'important');
    // 조상 중 회색(.m_outer 등) 배경 → 흰색 (컨테이너보다 넓어 좌우·상단 회색 비침 방지) (2026-07-03)
    var bjAnc = pageEl.parentElement;
    while (bjAnc && bjAnc !== document.body) {
      var bjAncBg = getComputedStyle(bjAnc).backgroundColor;
      if (bjAncBg && bjAncBg !== 'rgba(0, 0, 0, 0)' && bjAncBg !== 'transparent' && bjAncBg !== 'rgb(255, 255, 255)') {
        bjAnc.style.setProperty('background-color', '#ffffff', 'important');
      }
      bjAnc = bjAnc.parentElement;
    }

    // 브랜드 로고 그리드 → 가로 마퀴 (시안 디자인 맞춤, 카피 유지) — 셀을 트랙으로 감싸고 복제해 무한 루프
    var bjBrandGrid = pageEl.querySelector('.brand-grid');
    if (bjBrandGrid && !bjBrandGrid.getAttribute('data-bjmq')) {
      bjBrandGrid.setAttribute('data-bjmq', '1');
      var bjCells = Array.prototype.slice.call(bjBrandGrid.children);
      var bjTrack = document.createElement('div');
      bjTrack.className = 'bj-brand-track';
      bjCells.forEach(function(c) { bjTrack.appendChild(c); });
      bjCells.forEach(function(c) { bjTrack.appendChild(c.cloneNode(true)); });
      bjBrandGrid.appendChild(bjTrack);
    }

    // 신뢰도 섹션: 시안(Image #14)대로 "본사 동일 제품에" 헤딩 + 2번째 보장 바 추가 (2026-07-02)
    var bjBar1 = pageEl.querySelector('.highlight-bar');
    if (bjBar1 && !bjBar1.getAttribute('data-bj-bars')) {
      bjBar1.setAttribute('data-bj-bars', '1');
      // (0) 마퀴 위 헤딩(.lead)을 시안 카피로 교체 + 아래 헤딩과 동일 스타일 통일 (2026-07-02)
      var bjLead = bjBar1.parentElement.querySelector('.lead');
      if (bjLead) {
        bjLead.classList.add('bj-trust-sub');
        bjLead.innerHTML = '<strong>20+개 가전브랜드 본사·파트너사</strong>와 직계약하고 배송까지!';
      }
      // (1) 마퀴와 보장 바 사이 헤딩 삽입
      var bjTh = document.createElement('p');
      bjTh.className = 'bj-trust-sub';
      bjTh.innerHTML = '본사 동일 제품에 <strong>설치비·등록비 0원</strong>으로 부담없이';
      bjBar1.parentNode.insertBefore(bjTh, bjBar1);
      // (2) 1번째 바 복제 → "설치비·등록비 0원 보장"으로 리텍스트 + 동전 아이콘
      var bjBar2 = bjBar1.cloneNode(true);
      bjBar2.setAttribute('data-bj-bar2', '1');
      bjBar2.removeAttribute('data-bj-bars');
      var bjUse = bjBar2.querySelector('use');
      if (bjUse) bjUse.setAttribute('href', '#i-coins');
      var bjT = bjBar2.querySelector('.t');
      var bjD = bjBar2.querySelector('.d');
      if (bjT) bjT.textContent = '설치비 · 등록비 0원 보장';
      if (bjD) bjD.textContent = '설치·등록비 0원 + 최대 72개월 할부로 부담없는 시작';
      // (3) 두 보장 바를 1행 2열 래퍼로 감쌈 — PC 2열 나란히, 모바일 세로 스택 (2026-07-03)
      var bjBarsRow = document.createElement('div');
      bjBarsRow.className = 'bj-bars-row';
      bjBar1.parentNode.insertBefore(bjBarsRow, bjBar1);
      bjBarsRow.appendChild(bjBar1);
      bjBarsRow.appendChild(bjBar2);
    }

    // 서비스 섹션(본사보다 빌리조가 좋은 점)을 시안(Image #16)대로 2×2 4카드로 재구성 (2026-07-03)
    var bjSvcGrid = pageEl.querySelector('.diff-grid');
    if (bjSvcGrid && !bjSvcGrid.getAttribute('data-bj-svc')) {
      bjSvcGrid.setAttribute('data-bj-svc', '1');
      var bjSvcLead = bjSvcGrid.parentElement.querySelector('.lead');
      if (bjSvcLead) bjSvcLead.innerHTML = '<strong>고객 신뢰도 100%</strong><br>빌리조만의 제공 서비스';
      var bjSvc = [
        { no: '01', lb: '비교', ic: '#i-search', t: '독자적인<br>최저가 비교 시스템' },
        { no: '02', lb: '보안', ic: '#i-shield', t: '고객 개인정보<br>안전 보장' },
        { no: '03', lb: '큐레이션', ic: '#i-message', t: '1:1 맞춤<br>큐레이션 제공' },
        { no: '04', lb: '투명', ic: '#i-clipboard', t: '위약금 사전 계산<br>투명 공개' }
      ];
      bjSvcGrid.innerHTML = '';
      bjSvc.forEach(function (c) {
        var card = document.createElement('div');
        card.className = 'diff-card bj-svc-card';
        card.innerHTML = '<div class="num-circle">' + c.no + ' ' + c.lb + '</div>' +
          '<div class="icon"><svg class="ico"><use href="' + c.ic + '"></use></svg></div>' +
          '<div class="t">' + c.t + '</div>';
        bjSvcGrid.appendChild(card);
      });
    }

    // 큐레이션 섹션(빌리조만의 컨설팅) 헤딩+설명을 시안(Image #18)대로 교체 (2026-07-03)
    var bjCurZone = null;
    Array.prototype.forEach.call(pageEl.querySelectorAll('.zone'), function (z) {
      if ((z.textContent || '').indexOf('최저가 가전 라인업') !== -1) bjCurZone = z;
    });
    if (bjCurZone && !bjCurZone.getAttribute('data-bj-cur')) {
      bjCurZone.setAttribute('data-bj-cur', '1');
      var bjCurLead = bjCurZone.querySelector('.lead');
      if (bjCurLead) bjCurLead.innerHTML = '나의 라이프스타일에 맞춘<br><strong>무료 큐레이션 서비스</strong>';
      var bjCurDesc = bjCurZone.querySelector('.desc');
      if (bjCurDesc) bjCurDesc.innerHTML = '가격, 크기, 관리 등등 개인별 조건을 넣기만 하면<br>매니저가 최적의 조합을 1:1 맞춤 설계해 드립니다.';
    }

    // 신청방법 섹션 헤딩: "어렵지 않아요!" → "렌탈? 어렵지 않아요!" (서브는 유지) (2026-07-03)
    Array.prototype.forEach.call(pageEl.querySelectorAll('.lead'), function (ld) {
      if (!ld.getAttribute('data-bj-apply') && (ld.textContent || '').indexOf('어렵지 않아요') !== -1) {
        ld.setAttribute('data-bj-apply', '1');
        var bjSub = ld.querySelector('.sub-inline');
        // 헤딩 텍스트 파란색 (Jun 요청) — .lead strong = v5 파란색 (2026-07-03)
        ld.innerHTML = '<strong>렌탈? 어렵지 않아요!</strong><br>' + (bjSub ? bjSub.outerHTML : '');
      }
    });
  }

  function injectContent(html) {
    if (isInjected()) return;
    var target = findTargetHeading();
    if (!target) return;
    try {
      var doc = new DOMParser().parseFromString(html, 'text/html');
      var v5Style = doc.querySelector('style');
      var v5Sprite = doc.querySelector('body > svg[aria-hidden="true"]');
      var v5Page = doc.querySelector('.page');

      if (v5Style && !document.getElementById('bj-v5-css')) {
        var s = document.createElement('style');
        s.id = 'bj-v5-css';
        s.textContent = v5Style.textContent.replace(
          /url\((['"]?)\.\/images\//g,
          "url($1" + CDN_BASE + "/images/"
        );
        document.head.appendChild(s);
      }
      if (v5Sprite && !document.getElementById('bj-v5-sprite')) {
        var sprite = v5Sprite.cloneNode(true);
        sprite.id = 'bj-v5-sprite';
        document.body.appendChild(sprite);
      }
      if (!v5Page) return;

      // 이미지 src를 CDN 절대 경로로
      var imgs = v5Page.querySelectorAll('img');
      for (var ii = 0; ii < imgs.length; ii++) {
        var src = imgs[ii].getAttribute('src');
        if (src && src.indexOf('./images/') === 0) {
          imgs[ii].setAttribute('src', CDN_BASE + '/' + src.substring(2));
        }
      }
      var toneBanner = v5Page.querySelector('.tone-banner');
      if (toneBanner) toneBanner.parentNode.removeChild(toneBanner);

      var pageEl = v5Page.cloneNode(true);
      pageEl.id = INJECTED_ID;
      target.parentNode.insertBefore(pageEl, target);
      wrapZones(pageEl);
      reorderHome(pageEl);
    } catch (e) { console.error('[bj-v5] inject failed:', e); }
  }

  function start() {
    if (isInjected()) return;
    fetch(V5_URL)
      .then(function(r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.text(); })
      .then(function(html) {
        if (findTargetHeading()) { injectContent(html); return; }
        var observer = new MutationObserver(function() {
          if (findTargetHeading() && !isInjected()) {
            observer.disconnect();
            injectContent(html);
          }
        });
        observer.observe(document.body || document.documentElement, { childList: true, subtree: true });
        setTimeout(function() { observer.disconnect(); }, 15000);
      })
      .catch(function(err) { console.error('[bj-v5] fetch failed:', err); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();

// =============================================================================
// 자동생성카드(ai) 하단 유사상품 추천 (v0.7.1) — 100% 백엔드 API 구동
//   v0.7.1: 추천 카드에 전체 제품명 표시 (백엔드 product_names 저장소가 모델코드뿐인
//           이름을 "삼성전자 그랑데 통버블 세탁기 21kg"처럼 치환) + 모델코드 보조 라벨.
//   v0.6.8: 가격 미상(monthlyFee 0) 카드 — "0원/월"·가짜 할인 대신 "렌탈료 상세에서 확인".
//           (정수기 외 카테고리는 cards-index에 가격 없음)
//   admin2 /v1/products/recommendations 응답(topPick 1 + items 3 = 4카드)만 표시.
//   v0.6.5: 정적 fallback 3개 제거 — 라이브와 동일 데이터를 미리 그렸다가 덮어쓰던
//           중복 렌더 제거. API 응답 도착 후에만 위젯을 주입(응답 없으면 미표시).
//   v0.6.6: 카드 썸네일 보강 — productId로 빌리조 prod_view og:image를 동적 fetch
//           + sessionStorage 캐시 후 placeholder를 실제 이미지로 교체(hydrateThumbnails).
//   v0.6.7: 24578 한정 가드 제거 — 전체 /prod_view/{id} 상세페이지로 확대.
//           상품별 컨텍스트(detectPageProduct)로 API 호출, 추천 없으면 미표시.
//   롤백: 이 IIFE 또는 commit 자체를 revert + jsDelivr purge.
// =============================================================================
(function billyjoSimilarRecommendations() {
  // 전체 상품 상세페이지(/prod_view/{숫자id})에서 활성. 추천 산출은 백엔드 API가 상품별 수행.
  if (!/\/prod_view\/\d+/.test(location.pathname)) return;
  var INJECTED_FLAG = 'bj-reco-injected';

  // 24578(코웨이 아이콘 V2 얼음냉온정수기, 가정용 컴팩트) 매칭 추천.
  // ─────────────────────────────────────────────────────────────────────────────
  // 추천 선정 3원칙 (사용자 명시 — 백엔드 추천 API 동일 적용):
  //   1. 기능 ≥ 원본 (다운그레이드 금지). 원본이 얼음/냉/온/정 4기능이면 그 이상.
  //   2. 가격 ≤ 또는 ≈ 원본. 비슷한 가격이면 기능적 우위 필수.
  //      "비슷"은 카드할인가 ±20% 이내 권장 (예: 15,400원 → 12,300 ~ 18,500원).
  //   3. 페르소나 매칭 + 본사 수수료(incentive_amount) ↑ + 고객 후보 변경 메리트 필수.
  //      "메리트" = 기능 추가, 가격 절감, 위생/안전 강화, 사은품 한도 등 명확한 가치.
  // ─────────────────────────────────────────────────────────────────────────────
  // 추천 카드는 전적으로 백엔드 API(applyDynamicRecos)가 채운다. 정적 데이터 없음.
  var RECOMMENDATIONS = [];

  function injectStyle() {
    if (document.getElementById('bj-reco-style')) return;
    var s = document.createElement('style');
    s.id = 'bj-reco-style';
    s.textContent = "\
.bj-reco-section { margin-top: 24px; clear: both; }\
.bj-reco-header { display: flex; align-items: baseline; justify-content: space-between; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; }\
.bj-reco-title { font-size: 18px; font-weight: 800; color: #1A1F36; display: flex; align-items: center; gap: 8px; margin: 0; }\
.bj-reco-title-icon { color: #0838F8; flex-shrink: 0; }\
.bj-reco-sub { font-size: 12px; color: #475569; }\
.bj-reco-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }\
.bj-reco-card { background: #fff; border: 1px solid #E5E9F2; border-radius: 18px; padding: 14px; text-decoration: none; color: inherit; transition: transform .18s, box-shadow .18s, border-color .18s; display: flex; flex-direction: column; gap: 10px; position: relative; cursor: pointer; }\
.bj-reco-card:hover { transform: translateY(-3px); box-shadow: 0 6px 18px rgba(20,30,80,.07); border-color: #4A6BFA; }\
.bj-reco-card.is-best { border-color: #0838F8; box-shadow: 0 0 0 2px rgba(8,56,248,.08); }\
.bj-reco-badge { position: absolute; top: -8px; left: 14px; background: #0838F8; color: #fff; font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 6px; letter-spacing: .3px; }\
.bj-reco-badge.is-accent { background: #FF5A36; }\
.bj-reco-img { width: 100%; aspect-ratio: 4/3; border-radius: 12px; background: #F1F5F9; display: flex; align-items: center; justify-content: center; color: #94A3B8; font-size: 10px; text-align: center; line-height: 1.4; }\
.bj-reco-brand { font-size: 10px; color: #94A3B8; font-weight: 600; letter-spacing: .3px; }\
.bj-reco-name { font-size: 13px; font-weight: 700; color: #1A1F36; line-height: 1.35; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; min-height: 36px; }\
.bj-reco-model { font-size: 10px; color: #94A3B8; font-weight: 500; letter-spacing: .2px; margin-top: -4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }\
.bj-reco-top-model { font-size: 11px; color: #9A3412; font-weight: 500; letter-spacing: .2px; opacity: .8; }\
.bj-reco-price-row { display: flex; align-items: baseline; gap: 6px; padding: 8px 0; border-top: 1px solid #E5E9F2; }\
.bj-reco-price { font-size: 17px; font-weight: 800; color: #0838F8; letter-spacing: -.5px; }\
.bj-reco-price-suffix { font-size: 10px; color: #94A3B8; }\
.bj-reco-price-diff { margin-left: auto; font-size: 10px; font-weight: 700; }\
.bj-reco-price-diff.is-down { color: #16A34A; }\
.bj-reco-price-diff.is-up { color: #475569; }\
.bj-reco-strengths { display: flex; flex-wrap: wrap; gap: 4px; }\
.bj-reco-chip { display: inline-flex; align-items: center; gap: 3px; padding: 3px 8px; background: #F4F6FC; border-radius: 999px; font-size: 10px; color: #475569; font-weight: 600; }\
.bj-reco-chip.is-grade { background: #EEF2FF; color: #0838F8; }\
.bj-reco-persona { display: flex; align-items: center; gap: 6px; padding: 8px 10px; background: #F4F6FC; border-radius: 10px; font-size: 11px; color: #475569; font-weight: 600; line-height: 1.3; }\
.bj-reco-reviews { font-size: 11px; color: #475569; font-weight: 600; letter-spacing: -.2px; }\
.bj-reco-top-reviews { font-size: 12.5px; color: #0838F8; font-weight: 700; letter-spacing: -.2px; margin-top: 2px; }\
.bj-reco-cta { display: flex; align-items: center; justify-content: center; gap: 4px; padding: 9px 10px; background: #F4F6FC; color: #0838F8; border: 1px solid #EEF2FF; border-radius: 10px; font-size: 12px; font-weight: 700; text-decoration: none; transition: all .15s; }\
.bj-reco-card:hover .bj-reco-cta { background: #0838F8; color: #fff; border-color: #0838F8; }\
.bj-reco-foot { font-size: 10px; color: #94A3B8; text-align: center; margin-top: 14px; }\
/* 최고 인기 카드 (topPick) — 강조 큰 카드 */\
.bj-reco-top-card { display: grid; grid-template-columns: 130px 1fr auto; gap: 16px; align-items: center; background: linear-gradient(135deg, #F4F8FF 0%, #FAFCFF 50%, #FFFFFF 100%); border: none; border-radius: 18px; padding: 18px; margin-bottom: 16px; text-decoration: none; color: inherit; position: relative; box-shadow: 0 4px 14px rgba(8, 56, 248, 0.18); transition: transform .15s, box-shadow .15s; }\
.bj-reco-top-card::before { content:''; position:absolute; inset:0; border-radius:18px; padding:3px; background:linear-gradient(120deg, #0838F8, #5b8bff, #1E40AF, #3b6bff, #0838F8); background-size:300% 300%; -webkit-mask:linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); -webkit-mask-composite:xor; mask-composite:exclude; animation:bjRecoBorderFlow 4s linear infinite; pointer-events:none; z-index:1; }\
.bj-reco-top-card > * { position:relative; z-index:2; }\
@keyframes bjRecoBorderFlow { 0%{ background-position:0% 50% } 100%{ background-position:300% 50% } }\
.bj-reco-top-card:hover { transform: translateY(-2px); box-shadow: 0 8px 22px rgba(8, 56, 248, 0.28); }\
.bj-reco-top-card:hover::before { animation-duration:1.8s; }\
.bj-reco-top-badge { position: absolute; top: -10px; left: 18px; background: linear-gradient(135deg, #0838F8 0%, #1E40AF 100%); color: #fff; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 8px; letter-spacing: .3px; box-shadow: 0 2px 6px rgba(8, 56, 248, .3); }\
.bj-reco-top-img { width: 130px; height: 120px; border-radius: 14px; background: #EEF3FF; display: flex; align-items: center; justify-content: center; overflow: hidden; }\
.bj-reco-top-body { min-width: 0; display: flex; flex-direction: column; gap: 6px; }\
.bj-reco-top-sub { font-size: 11px; font-weight: 700; color: #1D4ED8; letter-spacing: .2px; }\
.bj-reco-top-brand { font-size: 11px; color: #94A3B8; font-weight: 600; letter-spacing: .3px; }\
.bj-reco-top-name { font-size: 15px; font-weight: 800; color: #1A1F36; line-height: 1.3; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }\
.bj-reco-top-price-row { display: flex; align-items: baseline; gap: 6px; margin-top: 4px; }\
.bj-reco-top-price { font-size: 22px; font-weight: 800; color: #0838F8; letter-spacing: -.5px; }\
.bj-reco-top-price-suffix { font-size: 11px; color: #94A3B8; }\
.bj-reco-top-diff { font-size: 11px; font-weight: 700; color: #16A34A; margin-left: 4px; }\
.bj-reco-top-strengths { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 4px; }\
.bj-reco-top-chip { display: inline-flex; padding: 3px 8px; background: #F4F6FC; color: #475569; border-radius: 999px; font-size: 10px; font-weight: 600; }\
.bj-reco-top-cta { background: #0838F8; color: #fff; font-size: 13px; font-weight: 700; padding: 10px 16px; border-radius: 10px; white-space: nowrap; }\
@media (max-width: 600px) { .bj-reco-top-card { grid-template-columns: 90px 1fr; padding: 14px 12px; } .bj-reco-top-img { width: 90px; height: 90px; } .bj-reco-top-cta { display: none; } .bj-reco-top-name { font-size: 13px; } .bj-reco-top-price { font-size: 18px; } .bj-reco-top-badge { left: 12px; top: -8px; } }\
@media (max-width: 600px) { .bj-reco-grid { grid-template-columns: 1fr; } .bj-reco-card { flex-direction: row; align-items: stretch; gap: 12px; } .bj-reco-card .bj-reco-img { width: 110px; aspect-ratio: 1; flex-shrink: 0; } .bj-reco-card > .bj-reco-brand, .bj-reco-card > .bj-reco-name, .bj-reco-card > .bj-reco-price-row, .bj-reco-card > .bj-reco-strengths, .bj-reco-card > .bj-reco-persona, .bj-reco-card > .bj-reco-cta { } .bj-reco-card { display: grid; grid-template-columns: 110px 1fr; grid-template-areas: 'img body'; } .bj-reco-img { grid-area: img; } .bj-reco-card .bj-reco-body { grid-area: body; display: flex; flex-direction: column; gap: 6px; min-width: 0; } .bj-reco-card .bj-reco-cta { display: none; } .bj-reco-name { min-height: 0; } .bj-reco-badge { top: -6px; left: 8px; } }\
";
    document.head.appendChild(s);
  }

  function escapeHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // ── 추천 카드 썸네일: 빌리조 prod_view og:image 동적 fetch + 캐시 ──
  // cards-index/추천 API에 이미지가 없어 클라이언트에서 보강. prod_view는 동일 출처라 CORS 없음.
  // 캐시: sessionStorage(탭 단위, '없음'도 ''로 캐시) + in-flight Promise 중복 제거.
  var THUMB_CACHE_PREFIX = 'bj-reco-thumb:';
  var THUMB_PROMISES = {};

  function thumbFromCache(pid) {
    try { return sessionStorage.getItem(THUMB_CACHE_PREFIX + pid); } catch (e) { return null; }
  }
  function thumbToCache(pid, url) {
    try { sessionStorage.setItem(THUMB_CACHE_PREFIX + pid, url || ''); } catch (e) {}
  }

  function fetchThumb(pid) {
    if (!pid) return Promise.resolve('');
    if (THUMB_PROMISES[pid]) return THUMB_PROMISES[pid];
    var cached = thumbFromCache(pid);
    if (cached !== null) {
      var pc = Promise.resolve(cached);
      THUMB_PROMISES[pid] = pc;
      return pc;
    }
    // 상대 경로로 호출 → 현재 출처(www 여부 무관)와 동일, same-origin 보장
    var p = fetch('/html/dh_prod/prod_view/' + pid, { credentials: 'same-origin' })
      .then(function(r) { return r.ok ? r.text() : ''; })
      .then(function(html) {
        var url = '';
        var m = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
             || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
        if (m) url = m[1];
        thumbToCache(pid, url);
        return url;
      })
      .catch(function() { return ''; });
    THUMB_PROMISES[pid] = p;
    return p;
  }

  function pidFromHref(href) {
    var m = (href || '').match(/\/prod_view\/(\d+)/);
    return m ? m[1] : null;
  }

  // 주입된 섹션의 각 카드 placeholder를 실제 썸네일 <img>로 교체 (비동기, 도착 순)
  function hydrateThumbnails(root) {
    if (!root) return;
    var cards = root.querySelectorAll('a.bj-reco-card, a.bj-reco-top-card');
    Array.prototype.forEach.call(cards, function(card) {
      var pid = pidFromHref(card.getAttribute('href'));
      if (!pid) return;
      var box = card.querySelector('.bj-reco-top-img') || card.querySelector('.bj-reco-img');
      if (!box) return;
      var isTop = box.classList.contains('bj-reco-top-img');
      fetchThumb(pid).then(function(url) {
        if (!url) return;  // 못 찾으면 placeholder 유지
        var radius = isTop ? '14px' : '12px';
        box.innerHTML = '<img src="' + escapeHtml(url) + '" alt="" ' +
          'style="width:100%;height:100%;object-fit:cover;border-radius:' + radius + '">';
      });
    });
  }

  function renderCard(item, idx) {
    // 가격 미상(monthlyFee 0/누락) → "0원/월"·가짜 할인 대신 상세 유도 문구
    var priceRow;
    if (item.price) {
      var diffCls = item.priceDiff < 0 ? 'is-down' : 'is-up';
      var diffStr = item.priceDiff
        ? '<span class="bj-reco-price-diff ' + diffCls + '">' +
            (item.priceDiff > 0 ? '+' : '') + item.priceDiff.toLocaleString() + '원 ' +
            (item.priceDiff < 0 ? '▼' : '▲') + '</span>'
        : '';
      priceRow = '<span class="bj-reco-price">' + item.price.toLocaleString() + '</span>' +
        '<span class="bj-reco-price-suffix">원/월</span>' + diffStr;
    } else {
      priceRow = '<span class="bj-reco-price-suffix" style="font-size:12px">렌탈료 상세에서 확인</span>';
    }
    var strengths = '<span class="bj-reco-chip is-grade">' + escapeHtml(item.grade) + '</span>';
    for (var i = 0; i < item.strengths.length; i++) {
      strengths += '<span class="bj-reco-chip">' + escapeHtml(item.strengths[i]) + '</span>';
    }
    var bestCls = idx === 0 ? ' is-best' : '';
    var badgeCls = item.badgeStyle === 'accent' ? ' is-accent' : '';
    var imgHtml = item.image
      ? '<img src="' + escapeHtml(item.image) + '" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:12px">'
      : '<div>제품 이미지</div>';
    return '<a class="bj-reco-card' + bestCls + '" href="' + escapeHtml(item.href) + '">' +
      '<span class="bj-reco-badge' + badgeCls + '">' + escapeHtml(item.badge) + '</span>' +
      '<div class="bj-reco-img">' + imgHtml + '</div>' +
      '<div class="bj-reco-body" style="display:flex;flex-direction:column;gap:10px;min-width:0">' +
      '<div class="bj-reco-brand">' + escapeHtml(item.brand) + '</div>' +
      '<div class="bj-reco-name">' + escapeHtml(item.name) + '</div>' +
      (item.model ? '<div class="bj-reco-model">' + escapeHtml(item.model) + '</div>' : '') +
      '<div class="bj-reco-price-row">' + priceRow + '</div>' +
      (item.reviewCount ? '<div class="bj-reco-reviews">⭐ 실사용 후기 ' + item.reviewCount.toLocaleString() + '개</div>' : '') +
      '<div class="bj-reco-strengths">' + strengths + '</div>' +
      '<div class="bj-reco-persona"><span>' + item.personaIcon + '</span><span>' + item.personaText + '</span></div>' +
      '<span class="bj-reco-cta">자세히 보기 →</span>' +
      '</div></a>';
  }

  // 최고 인기 (topPick) — 백엔드 API 응답으로만 채워짐
  var TOP_PICK = null;

  function renderTopPick(item) {
    if (!item) return '';
    var diffStr = '';
    if (typeof item.priceDiff === 'number' && item.priceDiff !== 0) {
      var sign = item.priceDiff > 0 ? '+' : '';
      diffStr = '<span class="bj-reco-top-diff">(' + sign + item.priceDiff.toLocaleString() + '원)</span>';
    }
    var strengths = (item.strengths || []).slice(0, 4).map(function(s){
      return '<span class="bj-reco-top-chip">' + escapeHtml(s) + '</span>';
    }).join('');
    var imgHtml = item.image
      ? '<img src="' + escapeHtml(item.image) + '" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:14px">'
      : '<div style="text-align:center;color:#94A3B8;font-size:11px">제품 이미지</div>';
    // 가격 미상 → "0원/월" 대신 상세 유도
    var topPriceRow = item.price
      ? '<span class="bj-reco-top-price">' + item.price.toLocaleString() + '</span>' +
        '<span class="bj-reco-top-price-suffix">원/월</span>' + diffStr
      : '<span class="bj-reco-top-price-suffix" style="font-size:13px">렌탈료 상세에서 확인</span>';
    return '<a class="bj-reco-top-card" href="' + escapeHtml(item.href || '#') + '">' +
      '<span class="bj-reco-top-badge">' + escapeHtml(item.badge || '🔥 최고 인기') + '</span>' +
      '<div class="bj-reco-top-img">' + imgHtml + '</div>' +
      '<div class="bj-reco-top-body">' +
        (item.subBadge ? '<div class="bj-reco-top-sub">' + escapeHtml(item.subBadge) + '</div>' : '') +
        '<div class="bj-reco-top-brand">' + escapeHtml(item.brand || '') + '</div>' +
        '<div class="bj-reco-top-name">' + escapeHtml(item.name || '') + '</div>' +
        (item.model ? '<div class="bj-reco-top-model">' + escapeHtml(item.model) + '</div>' : '') +
        '<div class="bj-reco-top-price-row">' + topPriceRow + '</div>' +
        (item.reviewCount ? '<div class="bj-reco-top-reviews">⭐ 실사용 후기 ' + item.reviewCount.toLocaleString() + '개</div>' : '') +
        '<div class="bj-reco-top-strengths">' + strengths + '</div>' +
      '</div>' +
      '<span class="bj-reco-top-cta">자세히 보기 →</span>' +
      '</a>';
  }

  function buildHtml() {
    var cards = '';
    for (var i = 0; i < RECOMMENDATIONS.length; i++) cards += renderCard(RECOMMENDATIONS[i], i);
    return '<div class="bj-reco-section" data-' + INJECTED_FLAG + '>' +
      '<div class="bj-reco-header">' +
      '<h3 class="bj-reco-title">' +
      '<svg class="bj-reco-title-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 18a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2zm0 -12a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2zm-7 12a6 6 0 0 1 6 -6a6 6 0 0 1 -6 -6a6 6 0 0 1 -6 6a6 6 0 0 1 6 6z"/></svg>' +
      '비슷한 분들이 함께 본 제품' +
      '</h3>' +
      '<div class="bj-reco-sub">최고 인기+가격·성능·가구형태 비슷한 고객들 PICK</div>' +
      '</div>' +
      renderTopPick(TOP_PICK) +
      '<div class="bj-reco-grid">' + cards + '</div>' +
      '<div class="bj-reco-foot">추천 기준: 가격대 ±25% · 동일 카테고리 · 페르소나 매칭도 ≥75 · 평가 등급 A 이상 · 본사 직배정 우선</div>' +
      '</div>';
  }

  function tryInject(allowFallback) {
    if (document.querySelector('[data-' + INJECTED_FLAG + ']')) return true;
    // 위치 우선순위:
    //   1. #ai-card-lpt-section 직후 (AI 카드 SLOT 8 약정기간 표 끝난 자리, 카드 내부)
    //   2. #ai-card-root 직후 (AI 카드 전체 끝난 자리)
    //   3. fallback (allowFallback=true일 때만): .prod_view_bot.mt10 직전
    var anchor = document.querySelector('#ai-card-root #ai-card-lpt-section')
              || document.querySelector('#ai-card-root');
    if (!anchor && !allowFallback) return false;  // AI 카드 도착 기다리기

    var prodBot = !anchor ? document.querySelector('.prod_view_bot.mt10') : null;
    if (!anchor && !prodBot) return false;

    var host = document.createElement('div');
    host.innerHTML = buildHtml();
    var section = host.firstChild;
    var zone = document.createElement('div');
    var insideCard = !!anchor;
    zone.style.cssText = insideCard
      ? 'padding:18px 0 6px;margin:0;clear:both;border-top:1px solid #E5E9F2;'
      : 'background:#ECF3FF;padding:24px 22px;margin:0;clear:both;';
    zone.setAttribute('data-bj-reco-zone', '1');
    zone.appendChild(section);

    if (anchor) {
      anchor.parentNode.insertBefore(zone, anchor.nextSibling);
    } else {
      prodBot.parentNode.insertBefore(zone, prodBot);
    }
    hydrateThumbnails(section);  // placeholder → 실제 prod_view 썸네일
    return true;
  }

  /* admin2 백엔드 /v1/products/recommendations 호출.
     응답이 비거나 실패하면 위젯을 표시하지 않는다(정적 fallback 없음). */
  function detectPageProduct() {
    var pid = null, pname = null, monthly = null, cardPrice = null, term = null;
    var m = location.pathname.match(/\/prod_view\/(\d+)/);
    if (m) pid = m[1];
    // 상품명: 상세페이지 타이틀 우선, 없으면 og:title 폴백 (모든 prod_view 템플릿 커버)
    var nameEl = document.querySelector('.prod_name h2, .prod_name, h1.prod_tit, .prod_view h2, .fix_tit');
    if (nameEl) pname = (nameEl.textContent || '').trim().slice(0, 200);
    if (!pname) {
      var ogt = document.querySelector('meta[property="og:title"]');
      if (ogt) pname = (ogt.getAttribute('content') || '').split(' - ')[0].trim().slice(0, 200);
    }
    // 가격 추출
    var priceEl = document.querySelector('.rental_price b');
    if (priceEl) {
      var t = (priceEl.textContent || '').replace(/[^0-9]/g, '');
      if (t) monthly = parseInt(t, 10);
    }
    var cardEl = document.querySelector('.card_dc b, .red.card_dc b');
    if (cardEl) {
      var ct = (cardEl.textContent || '').replace(/[^0-9]/g, '');
      if (ct) cardPrice = parseInt(ct, 10);
    }
    var termEl = document.querySelector('.bj-ws-term-pill.active .bj-ws-term-period');
    if (termEl) term = (termEl.textContent || '').trim();
    return { productId: pid, productName: pname, monthlyFee: monthly, cardDiscountedPrice: cardPrice, contractTerm: term };
  }

  function fetchRecommendations() {
    var ctx = detectPageProduct();
    if (!ctx.productName) return Promise.resolve(null);
    return fetch('https://admin2-api.billyjo.co.kr/v1/products/recommendations', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(ctx),
    })
      .then(function(r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(function(j) {
        var data = j && j.data;
        if (!data) return null;
        return {
          topPick: data.topPick || null,
          items: data.items || [],
          requestedGift: data.requestedGift || null,  // 하위호환 단일값
          giftRange: data.giftRange || null,          // {low:적정, high:한도} 또는 null
        };
      })
      .catch(function() { return null; });
  }

  /* 현금 사은품 범위(최저~적정)를 카드에 채움.
     - 생성 AI카드 '.gift-db'(라벨 "예상 최대 지원금"은 옆 .gift-tag) → 값만.
     - V5 카드 '[data-bj-cash-gift]' → 전체 문구.
     정합성 매칭 성공 시에만 값이 옴(백엔드). 매칭 실패(범위 없음)면 '.gift-db' 행을 숨김
     ("내부 DB 연동 예정" 등 잘못된/미완 플레이스홀더가 고객에게 노출되지 않게). */
  function fillCashGift(payload) {
    if (!payload) return;
    var range = payload.giftRange, low = 0, high = 0;
    if (range && range.high) { high = range.high; low = range.low || range.high; }
    else if (payload.requestedGift) { low = high = payload.requestedGift; }  // 하위호환
    var hasGift = high > 0;
    var loMan = hasGift ? Math.round(low / 10000) : 0;
    var hiMan = hasGift ? Math.round(high / 10000) : 0;
    var rangeText = (loMan > 0 && loMan < hiMan)
      ? ('약 ' + loMan.toLocaleString() + '~' + hiMan.toLocaleString() + '만원')
      : ('약 ' + hiMan.toLocaleString() + '만원');

    var tries = 0;
    (function poll() {
      var done = false;
      // (1) 생성 AI카드의 .gift-db
      var dbEls = document.querySelectorAll('.gift-db');
      if (dbEls.length) {
        done = true;
        for (var i = 0; i < dbEls.length; i++) {
          if (hasGift) {
            dbEls[i].textContent = rangeText;
            dbEls[i].style.color = '#0838f8';   // 지원금 값 — 파란색 강조 (gift-v와 통일)
            dbEls[i].style.fontWeight = '700';
            dbEls[i].style.removeProperty('font-size'); // 크기는 .gift-db CSS(16px)로 gift-v와 통일
            dbEls[i].style.lineHeight = '1.45';
            dbEls[i].style.border = '0';
            dbEls[i].style.background = 'transparent';
            // 라벨 표현 교체: "예상 최대 지원금" → "AI예측 이번주 최대지원금"
            var giftRow = (dbEls[i].closest && dbEls[i].closest('.gift-r')) || dbEls[i].parentNode;
            var tag = giftRow && giftRow.querySelector ? giftRow.querySelector('.gift-tag') : null;
            if (tag) tag.textContent = 'AI예측 이번주 최대지원금';
          } else {
            var row = (dbEls[i].closest && dbEls[i].closest('.gift-r')) || dbEls[i].parentNode;
            if (row) row.style.display = 'none';  // A-(가): 미매칭 행 숨김
          }
        }
      }
      // (2) V5 카드의 [data-bj-cash-gift] (값 있을 때만 노출)
      var v5 = document.querySelector('[data-bj-cash-gift]');
      if (v5) {
        done = true;
        if (hasGift) { v5.textContent = '💰 예상 현금 사은품 ' + rangeText; v5.style.display = 'flex'; }
      }
      if (done) return;
      if (++tries < 40) setTimeout(poll, 300);  // 카드 주입 대기 (최대 ~12s)
    })();
  }

  function applyDynamicRecos(payload) {
    if (!payload) return;  // API 실패/응답 없음 → 위젯 미표시 (정적 fallback 없음)
    var apiItems = payload.items || [];
    var apiTop = payload.topPick;
    var PV = 'https://billyjo.co.kr/html/dh_prod/prod_view/';

    // topPick 매핑
    if (apiTop) {
      TOP_PICK = {
        brand: apiTop.rentalCompany || '',
        name: apiTop.productName || '',
        model: apiTop.modelCode || '',
        price: apiTop.monthlyFee || 0,
        priceDiff: apiTop.priceDiff || 0,
        badge: apiTop.badge || '🔥 최고 인기',
        subBadge: apiTop.subBadge || '',
        grade: apiTop.grade || 'A+',
        strengths: apiTop.strengths || [],
        reviewCount: apiTop.reviewCount || 0,
        image: '',  // placeholder — hydrateThumbnails가 prod_view og:image로 교체
        href: apiTop.productId ? (PV + apiTop.productId) : '#',
      };
    }

    // 그리드 아이템 매핑 (최대 3개 → topPick과 합쳐 총 4카드)
    RECOMMENDATIONS = apiItems.slice(0, 3).map(function(it, i) {
      return {
        badge: it.badge || '추천',
        badgeStyle: it.badgeStyle || (i === 0 ? 'primary' : 'accent'),
        brand: it.rentalCompany || '',
        name: it.productName || '',
        model: it.modelCode || '',
        price: it.monthlyFee || 0,
        priceDiff: it.priceDiff || 0,
        grade: it.grade || 'A',
        strengths: it.strengths || [],
        reviewCount: it.reviewCount || 0,
        personaIcon: it.personaIcon || '👨‍👩‍👧',
        personaText: it.personaText || '',
        image: '',  // placeholder — hydrateThumbnails가 prod_view og:image로 교체
        href: it.productId ? (PV + it.productId) : '#'
      };
    });

    // 표시할 카드가 하나도 없으면 주입하지 않음
    if (!TOP_PICK && RECOMMENDATIONS.length === 0) return;

    // 썸네일 선(先)fetch — AI 카드(anchor) 도착 대기 동안 캐시 워밍 (hydrate가 즉시 반영)
    if (TOP_PICK) fetchThumb(pidFromHref(TOP_PICK.href));
    RECOMMENDATIONS.forEach(function(it) { fetchThumb(pidFromHref(it.href)); });

    scheduleInject();
  }

  // AI 카드(anchor) 도착을 기다렸다가 위젯을 주입. 데이터가 준비된 뒤에만 호출.
  function scheduleInject() {
    if (tryInject(false)) return;
    var tries = 0;
    var iv = setInterval(function() {
      if (tryInject(false) || ++tries >= 60) clearInterval(iv);
    }, 250);
    setTimeout(function() {
      if (!document.querySelector('[data-' + INJECTED_FLAG + ']')) {
        tryInject(true);
      }
    }, 20000);
  }

  function start() {
    injectStyle();
    // 백엔드 추천 호출 — 응답이 와야 위젯을 그린다(정적 선렌더 없음).
    fetchRecommendations().then(function(payload) {
      applyDynamicRecos(payload);
      fillCashGift(payload);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();

// (제품 리스트 카드 가격은 위 'bj-pz' 모듈이 신혼가전 칩 스타일로 단일 담당. 별도 restyle 모듈 없음.)

// =============================================================================
// 이벤트/기획전 버튼 텍스트 rewrite — "#이벤트/기획전 바로가기!!" → "이벤트 기획전 보기"
// =============================================================================
(function billyjoRewriteEventButton() {
  var TARGET = '이벤트 기획전 보기';
  function rewrite() {
    var links = document.querySelectorAll('a[href*="dh_board/lists/display"]');
    for (var i = 0; i < links.length; i++) {
      var a = links[i];
      var txt = (a.textContent || '').trim();
      if (txt === TARGET) continue;
      if (txt && (txt.indexOf('이벤트') >= 0 || txt.indexOf('기획전') >= 0 || txt.indexOf('바로가기') >= 0)) {
        // 이미지/아이콘 자식이 있으면 텍스트 노드만 갈아끼우기
        var hasChild = a.children && a.children.length > 0;
        if (hasChild) {
          // 마지막 텍스트 노드 찾아 교체, 없으면 새 텍스트 노드 append
          var replaced = false;
          for (var n = a.childNodes.length - 1; n >= 0; n--) {
            var node = a.childNodes[n];
            if (node.nodeType === 3 && (node.nodeValue || '').trim()) {
              node.nodeValue = TARGET;
              replaced = true;
              break;
            }
          }
          if (!replaced) a.appendChild(document.createTextNode(TARGET));
        } else {
          a.textContent = TARGET;
        }
      }
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', rewrite);
  } else {
    rewrite();
  }
  // 빌리조 헤더가 늦게 hydrate되는 경우 대비
  var tries = 0;
  var iv = setInterval(function() {
    rewrite();
    if (++tries >= 8) clearInterval(iv);
  }, 400);
})();

// =============================================================================
// PC sticky bottom-bar 가운데 정렬 보강 — bb-inner를 max-width 1200으로 제한 + auto margin
// =============================================================================
(function billyjoStickyCenterFix() {
  if (document.getElementById('bj-sticky-center-fix')) return;
  var s = document.createElement('style');
  s.id = 'bj-sticky-center-fix';
  s.textContent =
    '#billyjo-bottom-bar { display: block !important; }' +
    '#billyjo-bottom-bar .bb-inner { display: flex !important; width: 100% !important; max-width: 1200px !important; margin-left: auto !important; margin-right: auto !important; box-sizing: border-box !important; }' +
    '@media (min-width: 768px) { #billyjo-bottom-bar .bb-inner { justify-content: center !important; } }';
  (document.head || document.documentElement).appendChild(s);
})();

// =============================================================================
// 상담신청 모달 — 전환 최적화 패키지 (v0.6.0)
//   - 원탭 통화(tel:) + DTMF 자동 코드 전송
//   - 상담사 카드(사진/이름/오늘건수/평점) = 신뢰 시그널
//   - 실시간 대기인원/평균응답시간 = 사회적 증명
// 상세페이지에서만 활성 — 빌리조 native 상담 버튼들을 가로채어 새 모달 표시.
// =============================================================================
(function billyjoConsultModal() {
  // 상세페이지: native 상담 버튼까지 가로채 새 모달 표시.
  // 그 외 페이지: 명시적 opt-in([data-bj-consult], 예: 신혼부부 패키지 모달 CTA)만 가로챔 —
  // native 버튼 동작은 건드리지 않으면서 패키지 유입 상담을 전 페이지에서 즉시 배정.
  var IS_PROD_VIEW = location.pathname.indexOf('/prod_view/') !== -1;
  var API_BASE = 'https://admin2-api.billyjo.co.kr';
  var MODAL_ID = 'bj-consult-modal';

  // 페이지 컨텍스트(상품 ID/이름) 추정
  function detectProduct() {
    var pid = null, pname = null;
    var m = location.pathname.match(/\/prod_view\/(\d+)/);
    if (m) pid = m[1];
    var nameEl =
      document.querySelector('.prod_name h2, .prod_name, h1.prod_tit, .prod_view h2');
    if (nameEl) pname = (nameEl.textContent || '').trim().slice(0, 200);
    return { productId: pid, productName: pname };
  }

  function fmtSecs(s) {
    if (!s || s < 1) return '즉시';
    if (s < 60) return s + '초';
    var m = Math.round(s / 60);
    return m + '분';
  }

  function injectStyle() {
    if (document.getElementById('bj-consult-style')) return;
    var s = document.createElement('style');
    s.id = 'bj-consult-style';
    s.textContent = '\
#bj-consult-modal { position: fixed; inset: 0; z-index: 999999; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.5); padding: 16px; }\
#bj-consult-modal *, #bj-consult-modal *::before, #bj-consult-modal *::after { box-sizing: border-box; }\
#bj-consult-modal .bj-card { background: #fff; border-radius: 18px; max-width: 420px; width: 100%; padding: 24px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); position: relative; max-height: 92vh; overflow-y: auto; overflow-x: hidden; box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, "Pretendard", "Apple SD Gothic Neo", sans-serif; }\
#bj-consult-modal .bj-close { position: absolute; top: 14px; right: 14px; width: 32px; height: 32px; border: none; background: #f5f5f7; border-radius: 50%; font-size: 18px; cursor: pointer; color: #555; }\
#bj-consult-modal .bj-close:hover { background: #ebebed; }\
#bj-consult-modal .bj-stats { display: flex; gap: 8px; margin-bottom: 16px; }\
#bj-consult-modal .bj-stat { flex: 1; background: #f5f9ff; border: 1px solid #e0e8ff; border-radius: 10px; padding: 8px 10px; text-align: center; }\
#bj-consult-modal .bj-stat-label { font-size: 11px; color: #777; margin-bottom: 2px; }\
#bj-consult-modal .bj-stat-value { font-size: 14px; font-weight: 700; color: #0838f8; }\
#bj-consult-modal .bj-stat-value .bj-dot { display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: #22c55e; margin-right: 4px; animation: bj-pulse 1.4s infinite; }\
@keyframes bj-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }\
#bj-consult-modal .bj-agent { display: flex; gap: 14px; align-items: center; padding: 16px; background: linear-gradient(135deg, #f8faff, #eef2ff); border-radius: 14px; margin-bottom: 16px; }\
#bj-consult-modal .bj-photo { width: 64px; height: 64px; border-radius: 50%; object-fit: cover; flex-shrink: 0; background: #ddd; border: 3px solid #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }\
#bj-consult-modal .bj-photo-placeholder { width: 64px; height: 64px; border-radius: 50%; background: linear-gradient(135deg, #0838f8, #4a7cff); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 26px; font-weight: 700; flex-shrink: 0; border: 3px solid #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }\
#bj-consult-modal .bj-agent-name { font-size: 18px; font-weight: 800; color: #222; margin-bottom: 4px; display: flex; align-items: center; gap: 6px; }\
#bj-consult-modal .bj-agent-rating { color: #f5a623; font-size: 12px; }\
#bj-consult-modal .bj-agent-bio { font-size: 12px; color: #555; line-height: 1.4; }\
#bj-consult-modal .bj-agent-counts { font-size: 11px; color: #777; margin-top: 4px; }\
#bj-consult-modal .bj-code-box { text-align: center; margin: 18px 0 14px; padding: 14px; background: #0838f8; border: none; border-radius: 12px; box-shadow: 0 4px 14px rgba(8,56,248,0.25); }\
#bj-consult-modal .bj-code-label { font-size: 11px; color: rgba(255,255,255,0.85); margin-bottom: 4px; }\
#bj-consult-modal .bj-code { font-family: monospace; font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #fff; }\
#bj-consult-modal .bj-phone-label { font-size: 13px; font-weight: 700; color: #333; margin: 14px 0 6px; }\
#bj-consult-modal .bj-phone-input { width: 100%; padding: 14px; border: 1.5px solid #d0d8ff; border-radius: 10px; font-size: 18px; text-align: center; letter-spacing: 2px; outline: none; }\
#bj-consult-modal .bj-phone-input:focus { border-color: #0838f8; }\
#bj-consult-modal .bj-phone-err { font-size: 12px; color: #ff3737; margin-top: 6px; min-height: 16px; text-align: center; }\
#bj-consult-modal .bj-cta { display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; padding: 18px; background: #0838f8; color: #fff; border: none; border-radius: 14px; font-size: 18px; font-weight: 800; text-decoration: none; cursor: pointer; transition: all 0.15s ease; }\
#bj-consult-modal .bj-cta:hover, #bj-consult-modal .bj-cta:active { background: #0626c0; transform: scale(0.98); }\
#bj-consult-modal .bj-cta svg { width: 22px; height: 22px; fill: #fff; }\
#bj-consult-modal .bj-agent-field { display: inline-block; font-size: 11.5px; font-weight: 700; color: #0838f8; background: #eef2ff; border: 1px solid #e0e8ff; border-radius: 999px; padding: 2px 10px; margin-top: 6px; }\
#bj-consult-modal .bj-cta-secondary { background: #fff; color: #0838f8; border: 1.5px solid #0838f8; margin-top: 10px; font-size: 16px; padding: 15px; }\
#bj-consult-modal .bj-cta-secondary svg { fill: #0838f8; }\
#bj-consult-modal .bj-cta-secondary:hover, #bj-consult-modal .bj-cta-secondary:active { background: #eef2ff; }\
#bj-consult-modal .bj-reserve-head { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }\
#bj-consult-modal .bj-back { background: none; border: none; color: #777; font-size: 14px; cursor: pointer; padding: 4px 6px 4px 0; }\
#bj-consult-modal .bj-reserve-title { font-size: 18px; font-weight: 800; color: #222; }\
#bj-consult-modal .bj-reserve-sub { font-size: 12.5px; color: #555; margin-bottom: 16px; }\
#bj-consult-modal .bj-slots { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 4px; }\
#bj-consult-modal .bj-slot { padding: 14px 8px; background: #f5f9ff; border: 1.5px solid #e0e8ff; border-radius: 12px; font-size: 15px; font-weight: 700; color: #1A1F36; cursor: pointer; transition: all 0.13s; }\
#bj-consult-modal .bj-slot:hover, #bj-consult-modal .bj-slot:active { border-color: #0838f8; background: #eef2ff; color: #0838f8; }\
#bj-consult-modal .bj-reserve-empty { text-align: center; color: #777; font-size: 13px; padding: 24px 0; }\
#bj-consult-modal .bj-reserve-done { text-align: center; padding: 8px 0 4px; }\
#bj-consult-modal .bj-done-check { width: 56px; height: 56px; margin: 0 auto 14px; border-radius: 50%; background: #16a34a; color: #fff; font-size: 32px; line-height: 56px; }\
#bj-consult-modal .bj-done-title { font-size: 18px; font-weight: 800; color: #222; margin-bottom: 6px; }\
#bj-consult-modal .bj-done-time { font-size: 20px; font-weight: 800; color: #0838f8; margin-bottom: 8px; }\
#bj-consult-modal .bj-done-desc { font-size: 13px; color: #555; line-height: 1.5; margin-bottom: 14px; }\
#bj-consult-modal .bj-secondary { display: block; text-align: center; margin-top: 12px; font-size: 12px; color: #777; }\
#bj-consult-modal .bj-secondary a { color: #555; text-decoration: underline; cursor: pointer; }\
#bj-consult-modal .bj-loading, #bj-consult-modal .bj-error { text-align: center; padding: 40px 20px; color: #555; font-size: 14px; }\
#bj-consult-modal .bj-error { color: #c00; }\
#bj-consult-modal .bj-spin { display: inline-block; width: 28px; height: 28px; border: 3px solid #ddd; border-top-color: #0838f8; border-radius: 50%; animation: bj-spin 0.8s linear infinite; margin-bottom: 12px; }\
@keyframes bj-spin { to { transform: rotate(360deg); } }\
';
    document.head.appendChild(s);
  }

  function close() {
    var m = document.getElementById(MODAL_ID);
    if (m) m.parentNode.removeChild(m);
  }

  function buildModal(innerHtml) {
    close();
    var wrap = document.createElement('div');
    wrap.id = MODAL_ID;
    wrap.innerHTML =
      '<div class="bj-card">' +
      '<button class="bj-close" aria-label="닫기">×</button>' +
      innerHtml +
      '</div>';
    document.body.appendChild(wrap);
    wrap.querySelector('.bj-close').addEventListener('click', close);
    wrap.addEventListener('click', function(e) {
      if (e.target === wrap) close();
    });
    document.addEventListener('keydown', escHandler);
    return wrap;
  }
  function escHandler(e) {
    if (e.key === 'Escape') {
      close();
      document.removeEventListener('keydown', escHandler);
    }
  }

  function showLoading() {
    return buildModal(
      '<div class="bj-loading"><div class="bj-spin"></div><div>상담사 배정 중…</div></div>'
    );
  }

  function showError(msg) {
    buildModal(
      '<div class="bj-error">상담 연결 실패<br><span style="font-size:12px;color:#999">' +
      (msg || '잠시 후 다시 시도해 주세요.') +
      '</span></div>'
    );
  }

  function ratingStars(r) {
    if (!r) return '';
    var full = Math.floor(r);
    var half = (r - full) >= 0.5 ? 1 : 0;
    var empty = 5 - full - half;
    var s = '';
    for (var i = 0; i < full; i++) s += '★';
    if (half) s += '☆';
    for (var j = 0; j < empty; j++) s += '·';
    return '<span class="bj-agent-rating">' + s + ' ' + r.toFixed(1) + '</span>';
  }

  // 상담사 전문 분야 — 백엔드 card.specialty 우선, 없으면 페이지 상품 카테고리로 추론
  function consultSpecialty(card) {
    if (card && card.specialty) return card.specialty;
    var name = (detectProduct().productName || '');
    var ogt = document.querySelector('meta[property="og:title"]');
    if (ogt) name += ' ' + (ogt.getAttribute('content') || '');
    var map = [
      [/냉온정수기|얼음정수기|정수기|정수/, '정수기 전문'],
      [/공기청정기|공기청정|청정기|에어워셔/, '공기청정기 전문'],
      [/비데/, '비데 전문'],
      [/매트리스|토퍼|모션베드|침대/, '매트리스·침구 전문'],
      [/안마의자|안마/, '안마의자 전문'],
      [/세탁기|건조기|드럼세탁|통돌이/, '세탁·건조 전문'],
      [/김치냉장고|냉장고|냉동고/, '냉장고 전문'],
      [/에어컨|냉난방/, '냉난방 전문'],
      [/식기세척기|인덕션|전기레인지/, '주방가전 전문'],
      [/올레드|QLED|OLED|TV/, '영상가전 전문'],
      [/제습기|가습기|연수기/, '환경가전 전문'],
    ];
    for (var i = 0; i < map.length; i++) { if (map[i][0].test(name)) return map[i][1]; }
    return '생활가전 전문';
  }

  var PHONE_ICON =
    '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57a1 1 0 0 0-1.02.24l-2.2 2.2a15.05 15.05 0 0 1-6.59-6.58l2.2-2.21a1 1 0 0 0 .25-1.02A11.36 11.36 0 0 1 8.5 4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1c0 9.39 7.61 17 17 17a1 1 0 0 0 1-1v-3.5a1 1 0 0 0-1-1z"/></svg>';
  var CAL_ICON =
    '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z"/></svg>';

  function showAssigned(data) {
    var card = data.consultantCard || {};
    var stats = data.queueStats || {};
    var photoHtml = card.photoUrl
      ? '<img class="bj-photo" src="' + escapeAttr(card.photoUrl) + '" alt="">'
      : '<div class="bj-photo-placeholder">' + escapeHtml((card.name || '?').charAt(0)) + '</div>';
    var rating = card.rating ? ratingStars(card.rating) : '';
    var bio = card.bio ? '<div class="bj-agent-bio">' + escapeHtml(card.bio) + '</div>' : '';
    // 누적 상담 횟수 대신 전문 분야 표기
    var field = '<div><span class="bj-agent-field">' + escapeHtml(consultSpecialty(card)) + '</span></div>';

    // '지금 대기'·'활성 상담사' 제거 — '평균 응답'만 노출
    var statsHtml =
      '<div class="bj-stats">' +
      '<div class="bj-stat"><div class="bj-stat-label">평균 응답</div><div class="bj-stat-value">' +
      fmtSecs(stats.avgResponseSecs) + '</div></div>' +
      '</div>';

    var cta =
      '<a class="bj-cta" href="' + escapeAttr(data.telLink || ('tel:,' + data.code)) + '">' +
      PHONE_ICON + '<span>지금 ' + escapeHtml(card.name || '상담사') + '님과 통화</span></a>';
    var reserveBtn =
      '<button type="button" class="bj-cta bj-cta-secondary" id="bj-reserve-open">' +
      CAL_ICON + '<span>상담 예약 (2시간 이내)</span></button>';

    var html =
      statsHtml +
      '<div class="bj-agent">' +
      photoHtml +
      '<div style="flex:1;min-width:0">' +
      '<div class="bj-agent-name">' + escapeHtml(card.name || '상담사') + rating + '</div>' +
      bio + field +
      '</div></div>' +
      '<div class="bj-code-box">' +
      '<div class="bj-code-label">통화 안내 코드 (자동 전송)</div>' +
      '<div class="bj-code">' + escapeHtml(data.code) + '</div>' +
      '</div>' +
      cta + reserveBtn +
      '<span class="bj-secondary">통화가 연결되면 안내 코드가 자동으로 전송됩니다.</span>';
    var wrap = buildModal(html);
    var rb = wrap.querySelector('#bj-reserve-open');
    if (rb) rb.addEventListener('click', function() { showReservation(data); });
  }

  // 예약 가능 슬롯 — 지금부터 2시간 이내(고객 전환율 ↓ 방지)로만. 20분 간격.
  function genReserveSlots() {
    var now = new Date();
    var start = new Date(now.getTime() + 20 * 60000); // 최소 20분 뒤
    start.setSeconds(0, 0);
    start.setMinutes(Math.ceil(start.getMinutes() / 20) * 20);
    var limit = new Date(now.getTime() + 2 * 60 * 60000); // +2시간 상한
    var slots = [];
    for (var t = new Date(start); t.getTime() <= limit.getTime(); t = new Date(t.getTime() + 20 * 60000)) {
      slots.push(new Date(t));
    }
    return slots;
  }
  function fmtSlot(d) {
    var h = d.getHours(), m = d.getMinutes();
    var ap = h < 12 ? '오전' : '오후';
    var h12 = h % 12; if (h12 === 0) h12 = 12;
    return ap + ' ' + h12 + ':' + (m < 10 ? '0' + m : m);
  }

  function showReservation(data) {
    var card = data.consultantCard || {};
    var slots = genReserveSlots();
    var slotsHtml = slots.length
      ? '<div class="bj-slots">' + slots.map(function(d) {
          return '<button type="button" class="bj-slot" data-iso="' + escapeAttr(d.toISOString()) +
            '" data-label="' + escapeAttr(fmtSlot(d)) + '">' + escapeHtml(fmtSlot(d)) + '</button>';
        }).join('') + '</div>'
      : '<div class="bj-reserve-empty">지금은 예약 가능한 시간이 없습니다.<br>바로 통화를 이용해 주세요.</div>';
    var html =
      '<div class="bj-reserve-head">' +
      '<button type="button" class="bj-back" id="bj-reserve-back">‹ 뒤로</button>' +
      '<div class="bj-reserve-title">상담 예약</div></div>' +
      '<div class="bj-reserve-sub">' + escapeHtml(card.name || '상담사') + ' 상담사 · 지금부터 2시간 이내 예약 가능</div>' +
      slotsHtml +
      '<span class="bj-secondary">선택한 시간에 상담사가 전화드립니다.</span>';
    var wrap = buildModal(html);
    var back = wrap.querySelector('#bj-reserve-back');
    if (back) back.addEventListener('click', function() { showAssigned(data); });
    Array.prototype.forEach.call(wrap.querySelectorAll('.bj-slot'), function(b) {
      b.addEventListener('click', function() {
        confirmReservation(data, b.getAttribute('data-iso'), b.getAttribute('data-label'));
      });
    });
  }

  /* 예약 2단계: 콜백 받을 전화번호 입력 — 번호 없이는 상담사가 발신할 수 없음.
     (구버전은 존재하지 않는 /v1/consult/reserve로 POST + 번호 미수집 →
      예약이 백엔드에 한 건도 접수되지 않던 버그. 2026-06-08 수정) */
  function confirmReservation(data, iso, label) {
    var card = data.consultantCard || {};
    var html =
      '<div class="bj-reserve-head">' +
      '<button type="button" class="bj-back" id="bj-phone-back">‹ 뒤로</button>' +
      '<div class="bj-reserve-title">전화번호 입력</div></div>' +
      '<div class="bj-reserve-sub">' + escapeHtml(label) + '에 ' + escapeHtml(card.name || '상담사') +
      ' 상담사가 전화드립니다.</div>' +
      '<div class="bj-phone-label">콜백 받으실 휴대전화 번호</div>' +
      '<input type="tel" class="bj-phone-input" id="bj-phone-input" placeholder="010-0000-0000" maxlength="13" autocomplete="tel">' +
      '<div class="bj-phone-err" id="bj-phone-err"></div>' +
      '<button type="button" class="bj-cta" id="bj-reserve-confirm">' + CAL_ICON + '<span>예약 확정</span></button>';
    var wrap = buildModal(html);
    var back = wrap.querySelector('#bj-phone-back');
    if (back) back.addEventListener('click', function() { showReservation(data); });
    var input = wrap.querySelector('#bj-phone-input');
    // 자동 하이픈
    input.addEventListener('input', function() {
      var v = input.value.replace(/[^\d]/g, '').slice(0, 11);
      if (v.length > 7) v = v.slice(0, 3) + '-' + v.slice(3, 7) + '-' + v.slice(7);
      else if (v.length > 3) v = v.slice(0, 3) + '-' + v.slice(3);
      input.value = v;
    });
    wrap.querySelector('#bj-reserve-confirm').addEventListener('click', function() {
      var digits = (input.value || '').replace(/[^\d]/g, '');
      var err = wrap.querySelector('#bj-phone-err');
      if (digits.length < 10 || digits.length > 11 || digits.indexOf('01') !== 0) {
        err.textContent = '휴대전화 번호를 정확히 입력해 주세요. (예: 010-1234-5678)';
        return;
      }
      err.textContent = '';
      submitReservation(data, iso, label, input.value);
    });
    setTimeout(function() { try { input.focus(); } catch (_) {} }, 100);
  }

  function submitReservation(data, iso, label, phone) {
    var card = data.consultantCard || {};
    var minutes = Math.max(5, Math.round((new Date(iso).getTime() - Date.now()) / 60000));
    showLoading();
    fetch(API_BASE + '/v1/consult/schedule', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        code: data.code || null, requestId: data.requestId || null,
        minutes: minutes, customerPhone: phone
      })
    })
      .then(function(r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(function() {
        var codeBox = data.code
          ? '<div class="bj-code-box"><div class="bj-code-label">통화 안내 코드</div>' +
            '<div class="bj-code">' + escapeHtml(data.code) + '</div></div>'
          : '';
        buildModal(
          '<div class="bj-reserve-done">' +
          '<div class="bj-done-check">✓</div>' +
          '<div class="bj-done-title">예약이 접수되었습니다</div>' +
          '<div class="bj-done-time">' + escapeHtml(label) + '</div>' +
          '<div class="bj-done-desc">' + escapeHtml(card.name || '상담사') + ' 상담사가 <b>' +
          escapeHtml(phone) + '</b>로 전화드립니다.</div>' +
          codeBox +
          '</div>'
        );
      })
      .catch(function(e) {
        console.error('[bj-consult] schedule failed:', e);
        showError('예약 접수에 실패했습니다. 바로 통화를 이용해 주세요.');
      });
  }

  function escapeHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function escapeAttr(s) { return escapeHtml(s); }

  function requestConsult() {
    // 페르소나 헬퍼는 다른 IIFE 스코프 — 여기선 접근 불가일 수 있으므로 typeof 가드(ReferenceError 방지).
    if (typeof bjPersonaNeedsGate === 'function' && bjPersonaNeedsGate()){ bjPersonaGate(function(){ requestConsult(); }); return; }
    injectStyle();
    showLoading();
    var ctx = detectProduct();
    // 외부 컨텍스트(예: 신혼부부 패키지 모달)가 출처·담은 제품을 실어두면 우선 사용 —
    // 상담사 대기열 카드에서 유입 채널과 고객 요청 제품을 즉시 인지하게 함.
    var oCtx = window.__bjConsultContext || null;
    var payload = {
      productId: (oCtx && oCtx.productId) || ctx.productId,
      productName: (oCtx && oCtx.productName) || ctx.productName
    };
    if (oCtx && oCtx.selection) payload.selection = oCtx.selection;
    if (typeof bjConsultExtras === 'function') bjConsultExtras(payload);   // utm(광고 인구통계 코드) + 고객 페르소나 위저드 답변
    fetch(API_BASE + '/v1/consult/quick-assign', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(function(r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(function(data) { showAssigned(data); })
      .catch(function(err) {
        console.error('[bj-consult] failed:', err);
        showError(err && err.message);
      });
  }

  // 빌리조 기본 상담 트리거 가로채기
  function shouldIntercept(el) {
    if (!el || el.nodeType !== 1) return false;
    if (el.closest && el.closest('#bj-consult-modal')) return false;
    // 인젝트 위젯 자체 상담 버튼(.bj-btn-consult / .bj-fb-consult)은 가로채지 않음 —
    // 이미 자체 핸들러(openConsultModal: 풀 기능 모달+페르소나 위저드)가 바인딩돼 있고,
    // 여기서 가로채면 스코프 밖 헬퍼를 참조하는 requestConsult가 ReferenceError로 떠
    // 상담 대기 카드가 아예 안 나타남 (하단 위젯 버튼 무반응 버그의 원인).
    if (el.closest && el.closest('.bj-btn-consult')) return false;
    // 텍스트 문의 버튼(구 헤드셋 → 💬 문의하기)은 가로채지 않음 — counsel 폼 직행
    if (el.closest && el.closest('[data-bj-text-inquiry]')) return false;
    // 명시적 opt-in은 모든 페이지에서 가로챔 (신혼부부 패키지 등)
    if (el.matches && el.matches('[data-bj-consult]')) return true;
    if (el.closest && el.closest('[data-bj-consult]')) return true;
    // native 상담 트리거 가로채기는 상세페이지에서만 (기존 동작 보존)
    if (!IS_PROD_VIEW) return false;
    // '.new-qb a' 광역 셀렉터 제거 (2026-06-08): 같은 컨테이너의 맨 위로(m_top/q_top)·
    // 최근본상품 버튼까지 상담 모달로 가로채던 버그. 전화/문의 버튼은
    // billyjoQuickButtonRoles가 data-bj-consult / data-bj-text-inquiry로 명시 마킹하므로
    // 위 opt-in 분기로 충분. 아래 텍스트 매칭은 기타 native '상담신청' 버튼용 안전망.
    var txt = (el.textContent || '').trim();
    if (txt && txt.length < 20 && /상담신청|상담\s*문의|간편\s*실시간\s*문의/.test(txt)) {
      var tag = el.tagName;
      if (tag === 'A' || tag === 'BUTTON' || (el.closest && el.closest('a,button'))) return true;
    }
    return false;
  }

  document.addEventListener(
    'click',
    function(e) {
      if (shouldIntercept(e.target)) {
        e.preventDefault();
        e.stopPropagation();
        requestConsult();
      }
    },
    true // capture phase — native handlers 차단
  );
})();

/* =============================================================================
 * 플로팅 퀵버튼 역할 분리 (2026-06-07) — 전 사이트 일관
 *   수화기(q_call_red, 모바일): 전화 상담 — 모든 페이지에서 즉시 배정 모달(대기카드).
 *     (기존: 상세=대기카드 / 리스트=tel: 빈 번호 — 페이지마다 달라 혼선)
 *   헤드셋(q_call) → 💬 말풍선 아이콘 + '문의하기': 텍스트 문의 — counsel 폼 직행.
 *     (아이콘은 CSS content:url 교체, 가로채기 제외는 data-bj-text-inquiry)
 * ========================================================================== */
(function billyjoQuickButtonRoles(){
  function apply(){
    /* PC용 전화 상담 버튼 — native 수화기(q_call_red)는 show-767(모바일 전용)이라
       PC에 전화 버튼이 없음. .org 원형 스타일 재사용, 문의하기 버튼 위에 삽입. */
    var link = document.querySelector('.new-qb .quick .link');
    if (link && !link.querySelector('.bj-pc-phone')) {
      var p = document.createElement('p');
      p.className = 'org clearfix hide-767 bj-pc-phone';
      var a = document.createElement('a');
      a.href = 'javascript:';
      a.setAttribute('data-bj-consult', '1');
      a.setAttribute('title', '전화 상담 연결');
      var im = document.createElement('img');
      im.src = 'https://cdn.jsdelivr.net/gh/billyjo-appsilon/billyjo-inject@ae6cf20/icons/phonecall.gif';
      im.alt = '전화 상담';
      a.appendChild(im);
      p.appendChild(a);
      link.insertBefore(p, link.firstChild);
    }
    document.querySelectorAll('.new-qb a, .quick a').forEach(function(a){
      var img = a.querySelector('img');
      if (!img) return;
      var s = img.getAttribute('src') || '';
      if (s.indexOf('q_call_red') !== -1) {
        /* 수화기 = 전화 상담 → 전 페이지 즉시 배정 모달 (전역 opt-in 가로채기) */
        if (!a.hasAttribute('data-bj-consult')) a.setAttribute('data-bj-consult', '1');
      } else if (s.indexOf('q_call.png') !== -1) {
        /* 헤드셋 → 문자 문의: counsel 폼 직행 + 가로채기 제외 + 라벨 변경 */
        if (!a.hasAttribute('data-bj-text-inquiry')) a.setAttribute('data-bj-text-inquiry', '1');
        if ((a.getAttribute('href') || '').indexOf('counsel') === -1) a.setAttribute('href', '/html/dh/counsel');
        var span = a.querySelector('span');
        if (span && span.textContent.indexOf('간편 실시간 문의') !== -1) span.textContent = '문의하기';
        if (!a.getAttribute('title')) a.setAttribute('title', '문의하기 (텍스트 문의)');
        if (!img.getAttribute('alt')) img.setAttribute('alt', '문자 문의');
      }
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', apply);
  else apply();
  [400, 1200, 3000].forEach(function(d){ setTimeout(apply, d); });
})();

})();


/* =========================================================================
 * [모듈 B] billyjo-cards inject.js v0.5.74 — 제품 상세 페이지 전용 (구. billyjo-detailcard)
 * ========================================================================= */
/*!
 * billyjo-detailcard v0.5.74 — 상세페이지 카드 클라이언트 패치
 * https://github.com/billyjo-appsilon/billyjo-detailcard
 *
 * 적용 페이지: /html/dh_prod/prod_view/*  (제품 상세 페이지)
 * 의존성: 기존 billyjo-inject 스크립트 (헤더 재구성·이벤트 배너 분리 처리)가 먼저 로드된 상태를 전제로 함.
 *
 * 포함 패치 (v0.4.0 기준):
 *   - 절대 규칙 #14: 6-8칸 스펙요약 + ⓘ 도움말 (모바일 sheet 전환, v0.3.5)
 *   - 절대 규칙 #21: 좁은화면 헤더 (inject.js 결과 DOM 안정 클래스 부여 + 모바일 1행 정렬 + .new-gnb 숨김 + 햄버거 5px)
 *   - 절대 규칙 #22-23: Hero 재배치/Step 폰트/페르소나 폰트 (AI 카드 마크업 존재 시에만 활성)
 *   - 절대 규칙 #24: 카테고리 선택형 스펙 2단계 토글 + flexbox overflow 안전 (v0.3.3)
 *   - 절대 규칙 #25: 하단 fixed 위젯 (sticky→fixed, ▾/▴ 폴딩, 렌탈+사은품·상담신청 버튼)
 *   - v0.3.4: .wide-inner max-width 1480px 확장, SLOT 7 모바일 column 레이아웃
 *   - v0.3.5: .help-pop 모바일 viewport sheet 전환, 외부 탭 자동 닫힘 JS
 *   - v0.3.6: 모바일 로고 max-width 제한 + 아이콘 리스트 shrink 허용 (로고-이벤트 겹침 해결)
 *   - v0.3.7: 모바일 검색바 명시 숨김 + 카테고리 1행 가로스크롤(룰북 #20 갱신) + 빨강→파랑 통일 + .g-d 높이 통일
 *   - v0.3.8: 카테고리 spacing 축소 + 자동 스크롤 정렬 + 약정/의무사용 기간 ⓘ 툴팁 동적 주입
 *   - v0.3.9: 카테고리 텍스트 전용 스와이프 (pill 폐기) + 좌측 정렬 + 활성 굵게/파랑+밑줄
 *   - v0.4.0: 하단 위젯 fallback 콘텐츠 자체 생성 (.bb-inner 없어도 가격+장바구니+렌탈+사은품+상담신청 3버튼 노출)
 *   - 공통: 햄버거 중복 제거, 제품 썸네일 1px 회색 테두리
 *
 * AI 카드 콘텐츠 자체는 별도 backend 파이프라인에서 사전 생성되어 제품별 HTML에 주입되어야 함.
 * 본 스크립트는 카드가 있으면 격상시키고, 없으면 패치만 적용 (안전).
 */
(function(){
  'use strict';

  /* v0.5.67: 제휴카드 안내 페이지(/html/dh/partnership_card)에서 ?bj=<렌탈사명> param 받아
     해당 렌탈사 섹션을 페이지 맨 위에 복제 + 강조 박스. 사용자가 제품에서 진입 시 본인 카드 즉시 확인.
     runAll 흐름과 독립 — IIFE 진입 즉시 + DOMContentLoaded + setTimeout 4단계로 안정 실행. */
  function bjHighlightPartnership(){
    try {
      if (!/\/html\/dh\/partnership_card/.test(location.pathname)) return;
      if (document.getElementById('bj-partnership-highlight')) return;
      var params = new URLSearchParams(location.search);
      var supName = params.get('bj');
      if (!supName) return;
      var lis = document.querySelectorAll('li');
      var targetLi = null;
      for (var i = 0; i < lis.length; i++) {
        var titEl = lis[i].querySelector('.tit__param01');
        if (titEl && titEl.textContent.indexOf(supName) >= 0) { targetLi = lis[i]; break; }
      }
      if (!targetLi) return;
      var wrap = document.createElement('div');
      wrap.id = 'bj-partnership-highlight';
      var safeName = supName.replace(/[<>&"']/g, '');
      wrap.innerHTML =
        '<div class="bj-php-label">' +
          '<span class="bj-php-icon">📌</span>' +
          '<span>지금 보신 제품의 렌탈사 <strong>' + safeName + '</strong> 제휴카드입니다</span>' +
        '</div>' +
        '<div class="bj-php-clone"></div>';
      wrap.querySelector('.bj-php-clone').appendChild(targetLi.cloneNode(true));
      var content = document.querySelector('.wide-inner .content') ||
                    document.querySelector('.wide-inner') ||
                    document.querySelector('#container') ||
                    document.body;
      content.insertBefore(wrap, content.firstChild);
      setTimeout(function(){ try { wrap.scrollIntoView({ behavior:'smooth', block:'start' }); } catch(_){} }, 300);
    } catch(_) {}
  }
  if (document.body) bjHighlightPartnership();
  document.addEventListener('DOMContentLoaded', bjHighlightPartnership);
  [200, 600, 1500, 3000].forEach(function(d){ setTimeout(bjHighlightPartnership, d); });

  // v0.5.1: 신혼부부 패키지 — 플로팅 fab 폐기, 상단 카테고리바(.category__wrap)에 항목 추가.
  (function injectNewlywedInCategoryBar(){
    function getCommit(){
      try {
        var src = (document.currentScript && document.currentScript.src) || '';
        if (!src) {
          var scripts = document.getElementsByTagName('script');
          for (var i = scripts.length - 1; i >= 0; i--) {
            if (/billyjo-(?:inject|detailcard|cards)@/.test(scripts[i].src)) { src = scripts[i].src; break; }
          }
        }
        var m = src.match(/billyjo-(?:inject|detailcard|cards)@([0-9a-f]{7,40}|main)\//);
        return m ? m[1] : 'main';
      } catch(e) { return 'main'; }
    }
    function moveHamburgerToCatBar(wrap){
      /* 모바일 햄버거(.gnb__hamburger)를 카테고리바 최좌측(신혼부부 패키지 왼쪽)으로 이동.
         노드 자체를 옮겨 클릭 핸들러 + CSS 아이콘(body .gnb__hamburger::before)을 보존.
         가로 스크롤 시 좌측 유지는 CSS(.category__wrap .gnb__hamburger sticky)로 처리. */
      var ham = document.querySelector('.gnb__hamburger');
      if (!ham || !wrap) return;
      if (ham.parentNode === wrap && wrap.firstElementChild === ham) return; /* 이미 최좌측 */
      ham.classList.add('bj-cat-ham');
      wrap.insertBefore(ham, wrap.firstChild);
    }
    function tryInject(){
      /* 기존 floating fab이 있으면 제거 (v0.5.0 잔재 정리) */
      var old = document.querySelector('.bj-newlywed-floating');
      if (old) old.remove();
      var wrap = document.querySelector('.mobile__gnb .gnb__cateogry .category__wrap, .category__wrap');
      if (!wrap) return;

      /* 1:1 맞춤 패키지 항목 — 아직 없을 때만 삽입.
         (클래스명 bj-newlywed-cat 은 햄버거 위치/CSS 의존성 때문에 유지) */
      if (!document.querySelector('.bj-newlywed-cat')) {
        var commit = getCommit();
        /* 신혼부부 LP 모달 대신 페르소나 위젯(가구형태/신혼 등 페르소나 대응)을 연다 */
        var widgetJsUrl = 'https://admin2.billyjo.co.kr/persona-wizard.js';

        var link = document.createElement('a');
        link.className = 'bj-newlywed-cat';
        link.href = '#';
        link.innerHTML = '<span style="margin-right:3px;line-height:1;display:inline-flex;align-items:center">🎯</span>1:1 맞춤 패키지';
        /* 다른 카테고리 항목(.category__wrap a = 14px / line-height:1.5 / padding:0)과
           동일한 박스 모델로 맞춰 수직 정렬. 기존 13px·padding:2px·line-height:1.4 차이로
           형제 항목보다 위로 떠 보이던 문제 해소. 브랜드 파랑(#0838F8)만 강조 유지. */
        link.style.cssText = 'flex:0 0 auto;display:inline-flex;align-items:center;padding:0;margin:0;font:700 14px Pretendard,sans-serif;color:#0838F8;text-decoration:none;background:transparent;border:0;white-space:nowrap;cursor:pointer;line-height:1.5';
        link.onclick = function(e){
          e.preventDefault();
          function openWiz(){ if (window.bjPersona) window.bjPersona.open({ style: 'curation', origin: '1:1 맞춤 패키지' }); }
          if (window.bjPersona) {
            openWiz();
          } else if (!window.__bjWizLoading) {
            window.__bjWizLoading = true;
            var s = document.createElement('script');
            s.src = widgetJsUrl;
            s.onload = openWiz;
            document.head.appendChild(s);
          }
        };
        /* 첫 번째 위치에 삽입 (좌측 정렬, 가장 먼저 보이도록) */
        wrap.insertBefore(link, wrap.firstChild);
      }

      /* 햄버거를 신혼부부 패키지 왼쪽(카테고리바 최좌측)으로 이동 */
      moveHamburgerToCatBar(wrap);
    }
    if (document.readyState !== 'loading') tryInject();
    document.addEventListener('DOMContentLoaded', tryInject);
    [200, 600, 1500, 3000].forEach(function(d){ setTimeout(tryInject, d); });
  })();

  // 모바일 universal CSS — 카테고리 바 + 헤더 햄버거 (룰북 #20·#21)
  (function injectMobileUniversalCSS(){
    if (document.querySelector('#bj-mobile-cat-style')) return;
    var st = document.createElement('style');
    st.id = 'bj-mobile-cat-style';
    st.textContent = [
      '@media (max-width:768px){',
      // (0) v0.5.1: 카테고리바 위 여백 제거 — .mobile__gnb·.gnb__cateogry 자체 margin/padding 0
      '  .mobile__gnb, .mobile__gnb .gnb__cateogry{',
      '    margin-top:0 !important; padding-top:0 !important;',
      '  }',
      '  .mobile__gnb .gnb__cateogry nav{',
      '    margin-top:0 !important; padding-top:0 !important;',
      '  }',
      // (1) v0.5.9: 카테고리 바 — .category__wrap + 신규 .bj-sh-cat 모두 1행 가로 스와이프 강제
      //     모바일에서 어떤 경우에도 전체 펼침/멀티라인 금지
      '  .mobile__gnb .gnb__cateogry .category__wrap, .category__wrap,',
      '  .bj-sh-cat, body .bj-sh-cat, header .bj-sh-cat{',
      '    display:flex !important; flex-wrap:nowrap !important;',
      '    overflow-x:auto !important; overflow-y:hidden !important;',
      '    -webkit-overflow-scrolling:touch;',
      '    scrollbar-width:none; -ms-overflow-style:none;',
      '    justify-content:flex-start !important; align-items:center !important;',
      '    padding:4px 16px 8px !important; gap:18px !important;',
      '    white-space:nowrap !important; line-height:normal !important;',
      '    height:auto !important; max-height:none !important;',
      '    text-align:left !important;',
      '    margin-top:0 !important;',
      '  }',
      '  .bj-sh-cat::-webkit-scrollbar{ display:none !important }',
      '  .bj-sh-cat > a{',
      '    flex:0 0 auto !important; display:inline-block !important;',
      '    white-space:nowrap !important;',
      '    padding:2px 0 !important; margin:0 !important;',
      '    font-size:13px !important; font-weight:500 !important;',
      '    color:#555 !important; text-decoration:none !important;',
      '    background:transparent !important; border:0 !important; border-radius:0 !important;',
      '    line-height:1.4 !important;',
      '  }',
      '  .bj-sh-cat > a:hover{ color:#0838F8 !important }',
      '  .bj-sh-cat > a.on{',
      '    color:#0838F8 !important; font-weight:800 !important; position:relative !important;',
      '  }',
      '  .bj-sh-cat > a:first-child{ color:#0838F8 !important; font-weight:700 !important }',  /* 신혼부부 패키지 강조 */
      '  .category__wrap::-webkit-scrollbar{display:none}',
      '  .category__wrap > a, .category__wrap > *{',
      '    flex:0 0 auto !important; white-space:nowrap !important;',
      '  }',
      // (2) 헤더 햄버거 + 로고 정렬 (룰북 #21) — specificity 강화
      '  header.new-header .header__top, header .header__top.header__top, body .header__top{',
      '    display:flex !important; align-items:center !important;',
      '    padding:8px 12px !important; gap:0 !important;',
      '    overflow:hidden !important;',
      '  }',
      '  header .gnb__hamburger.gnb__hamburger, body .gnb__hamburger{',
      '    margin-right:5px !important; flex:0 0 auto !important;',
      '    width:26px !important; height:22px !important;',
      '    position:relative !important; cursor:pointer; padding:0 !important;',
      '    background:none !important; border:0 !important;',
      '  }',
      // v0.5.1: 햄버거 3줄 강제 — billyjo 기본 아이콘이 2줄로 잘려보이는 문제 해결.
      // 기존 ::before/::after/배경 모두 무력화 후 3개 line을 box-shadow stack으로 그림.
      '  header .gnb__hamburger.gnb__hamburger > *, body .gnb__hamburger > *{ display:none !important }',
      '  header .gnb__hamburger.gnb__hamburger::before, body .gnb__hamburger::before{',
      '    content:""; display:block !important;',
      '    position:absolute !important; left:3px !important; top:4px !important;',
      '    width:20px !important; height:2.5px !important;',
      '    background:#222 !important; border-radius:2px !important;',
      '    box-shadow:0 7px 0 #222, 0 14px 0 #222 !important;',
      '  }',
      '  header .gnb__hamburger.gnb__hamburger::after, body .gnb__hamburger::after{',
      '    content:none !important; display:none !important;',
      '  }',
      '  .hamburger__btn{display:none !important}',
      // v0.6.x: 햄버거를 카테고리바 좌측(신혼부부 왼쪽)으로 이동했을 때 — 가로 스크롤에도 좌측 고정
      '  .category__wrap .gnb__hamburger.gnb__hamburger{',
      '    position:sticky !important; left:0 !important; z-index:3 !important;',
      '    background:#fff !important; margin:0 2px 0 0 !important;',
      '    padding:0 8px 0 0 !important; align-self:center !important; flex:0 0 auto !important;',
      '    box-shadow:-18px 0 0 0 #fff !important;', /* 좌측 패딩에 카테고리 글자 비침 방지 */
      '  }',
      '  header .logo.logo, body .logo{ flex:0 1 auto !important; max-width:38vw !important; overflow:hidden !important; }',
      '  header .logo img{ max-width:100% !important; height:26px !important; object-fit:contain !important; }',
      // (3) PC GNB 우측(.bj-inj-right) 모바일·태블릿 hide — 이벤트·고객센터·장바구니·search
      //     이미 위 헤더에 #bj-header-icons로 동일 기능 제공됨. 고객센터는 하단 상담버튼.
      '  .bj-inj-right, header .bj-inj-right, header.new-header .bj-inj-right{',
      '    display:none !important;',
      '  }',
      '  /* 우측 아이콘 그룹 shrink 허용 */',
      '  ul#bj-header-icons{ flex:0 1 auto !important; min-width:0 !important; gap:6px !important; margin-left:auto !important; }',
      // 협소(≤400px)
      '  @media (max-width:400px){',
      '    .logo{ max-width:32vw !important }',
      '    .logo img{ height:24px !important }',
      '  }',
      '}',
    ].join('\n');
    (document.head || document.documentElement).appendChild(st);
  })();
  // head 없을 수도 있어서 DOMContentLoaded에서 재시도
  document.addEventListener('DOMContentLoaded', function(){
    if (document.querySelector('#bj-mobile-cat-style')) return;
    var s2 = document.createElement('style');
    s2.id = 'bj-mobile-cat-style';
    s2.textContent = '@media (max-width:768px){.mobile__gnb .gnb__cateogry .category__wrap,.category__wrap{display:flex !important;flex-wrap:nowrap !important;overflow-x:auto !important;justify-content:flex-start !important;align-items:center !important;padding:10px 16px 12px !important;gap:18px !important;white-space:nowrap !important;height:auto !important}.category__wrap > *{flex:0 0 auto !important}}';
    document.head.appendChild(s2);
  });

  // 페이지 가드 — 제품 상세에서만 실행 (이하 prod_view 전용)
  /* v0.5.16: 데모 도메인(.vercel.app)에서도 작동하도록 가드 완화 + window.__bjForceLoad flag */
  if (!/\/html\/dh_prod\/prod_view\//.test(location.pathname) &&
      !/\.vercel\.app$/.test(location.hostname) &&
      !window.__bjForceLoad) return;

  // 중복 로드 방지
  if (window.__bjDetailcardLoaded) return;
  window.__bjDetailcardLoaded = true;

  // ─────────────────────────────────────────────────────────────────────────
  // 1) CSS 주입
  // ─────────────────────────────────────────────────────────────────────────
  var CSS = [
    /* === 공통: 모바일 헤더 가림 방지 (header:not(.bj-ready) opacity:0 보호 룰 무력화) === */
    'header.new-header.new-header{ opacity:1 !important; visibility:visible !important }',
    '@media (max-width:768px){',
    '  header.new-header.new-header,',
    '  header.new-header.new-header:not(.bj-ready){ opacity:1 !important; visibility:visible !important }',
    '}',

    /* === 공통: 햄버거 중복 제거 (.gnb__hamburger만 유지) === */
    '.new-gnb .gnb__all .hamburger__btn,',
    '.new-gnb__wrap .show-768.hide-default{ display:none !important }',

    /* === 공통: 제품 다중 이미지 썸네일 60×60 1px 회색 테두리 === */
    '.prod_img_small .prod_thumbs li a{',
    '  display:inline-block; border:1px solid #dfdfdf; box-sizing:border-box; line-height:0;',
    '}',
    '.prod_img_small .prod_thumbs li a img{ display:block }',

    /* === PC 좁은 폭 헤더 (1280px↓): inject.js rightGroup 자연 줄바꿈 === */
    '@media (max-width:1280px){',
    '  header.new-header > .bj-inj-row{',
    '    flex-wrap:wrap !important; padding:16px 20px !important;',
    '    row-gap:10px !important; column-gap:16px !important;',
    '  }',
    '  header.new-header > .bj-inj-row > .bj-inj-left{',
    '    flex:1 1 auto !important; min-width:0 !important;',
    '    flex-wrap:wrap !important; row-gap:10px !important;',
    '  }',
    '  header.new-header > .bj-inj-row > .bj-inj-right{',
    '    flex-shrink:1 !important; white-space:normal !important;',
    '    flex-wrap:wrap !important; margin-left:auto !important;',
    '    gap:12px !important; justify-content:flex-end !important;',
    '    align-items:center !important;',
    '  }',
    '  header.new-header .bj-inj-right .gnb__right{',
    '    position:static !important; top:0 !important; gap:10px !important;',
    '  }',
    '  header.new-header .bj-inj-right .search__wrap{ max-width:280px }',
    '  header.new-header .bj-inj-left{ overflow:visible }',
    '}',

    /* === ≤1024px: rightGroup 별도 행 분리 === */
    '@media (max-width:1024px){',
    '  header.new-header > .bj-inj-row{',
    '    flex-direction:column !important; align-items:stretch !important;',
    '  }',
    '  header.new-header > .bj-inj-row > .bj-inj-left{',
    '    width:100% !important; flex-wrap:wrap !important;',
    '  }',
    '  header.new-header > .bj-inj-row > .bj-inj-right{',
    '    width:100% !important; margin-left:0 !important;',
    '    justify-content:flex-end !important;',
    '    border-top:0.5px solid #eee; padding-top:10px;',
    '  }',
    '  header.new-header .bj-inj-right .search__wrap{',
    '    max-width:100%; flex:1 1 auto;',
    '  }',
    '  header.new-header .bj-inj-right .search__wrap input{',
    '    width:100%; box-sizing:border-box;',
    '  }',
    '}',

    /* === ≤768px 모바일 헤더: [햄버거] 5px [로고] auto [이벤트·검색·장바구니] === */
    '@media (max-width:768px){',
    '  header.new-header > #bj-top-banner,',
    '  body > #bj-top-banner{ display:none !important }',

    /* PC GNB 카테고리 메뉴는 모바일에서 명시 숨김 — inject.js가 .mobile__gnb로 별도 노출 */
    '  header.new-header .new-gnb__wrap,',
    '  header.new-header .new-gnb,',
    '  header.new-header li.bj-internet-li{ display:none !important }',

    '  header.new-header .wide-inner{',
    '    display:block !important; padding:0 !important; margin:0 !important;',
    '  }',
    '  header.new-header .header__top{',
    '    display:flex !important; align-items:center !important;',
    '    gap:0 !important; padding:8px 12px !important;',
    '    flex-wrap:nowrap !important; background:#fff !important;',
    '    border-bottom:1px solid #eee !important; position:relative !important;',
    '    min-width:0 !important; overflow:hidden;',
    '  }',
    '  header.new-header .header__top .gnb__hamburger{',
    '    flex:0 0 auto !important; margin:0 5px 0 0 !important;',
    '    cursor:pointer; padding:4px;',
    '  }',
    /* v0.3.6: 로고 max-width 제한 — intrinsic width 큰 경우 아이콘과 겹치는 문제 해결 */
    '  header.new-header .header__top .logo{',
    '    flex:0 1 auto !important; margin:0 !important;',
    '    min-width:0 !important; max-width:38vw !important;',
    '    overflow:hidden !important;',
    '  }',
    '  header.new-header .header__top .logo img{',
    '    height:26px !important; width:auto !important; max-width:100% !important;',
    '    display:block !important; object-fit:contain;',
    '  }',
    '  header.new-header .header__top .top__right{ display:none !important }',
    /* v0.3.7: 검색바(.search__wrap) 모바일에서 명시 숨김 — 검색 아이콘 클릭 시 .m_search_popup으로 노출 */
    '  header.new-header .search__wrap,',
    '  header.new-header form .search__wrap,',
    '  header.new-header .bj-inj-right .search__wrap{ display:none !important }',

    /* v0.3.9: 모바일 카테고리 메뉴 (.category__wrap) — 텍스트 전용 스와이프 (이전 pill 버튼 폐기) */
    '  .mobile__gnb .gnb__cateogry,',
    '  .mobile__gnb .gnb__cateogry nav{ background:#fff; border-bottom:1px solid #eee }',
    '  .mobile__gnb .gnb__cateogry{ position:relative }',
    /* 우측 fade */
    '  .mobile__gnb .gnb__cateogry::after{',
    '    content:""; position:absolute; right:0; top:0; bottom:1px;',
    '    width:32px; pointer-events:none; z-index:1;',
    '    background:linear-gradient(to right, rgba(255,255,255,0), #fff 70%);',
    '  }',
    /* 좌측 fade */
    '  .mobile__gnb .gnb__cateogry::before{',
    '    content:""; position:absolute; left:0; top:0; bottom:1px;',
    '    width:14px; pointer-events:none; z-index:1;',
    '    background:linear-gradient(to left, rgba(255,255,255,0), #fff 80%);',
    '  }',
    '  .mobile__gnb .gnb__cateogry .category__wrap{',
    '    display:flex !important; flex-wrap:nowrap !important;',
    '    overflow-x:auto !important; overflow-y:hidden !important;',
    '    -webkit-overflow-scrolling:touch;',
    '    scrollbar-width:none; -ms-overflow-style:none;',
    '    justify-content:flex-start !important; align-items:center !important;',
    '    padding:10px 16px 12px !important; gap:18px !important;',
    '    white-space:nowrap !important; line-height:normal !important;',
    '    height:auto !important; max-height:none !important;',
    '    text-align:left !important;',
    '  }',
    '  .mobile__gnb .gnb__cateogry .category__wrap::-webkit-scrollbar{ display:none }',
    /* 텍스트 전용 항목 — 배경·테두리·라운드 모두 제거 */
    '  .mobile__gnb .gnb__cateogry .category__wrap > a{',
    '    flex:0 0 auto !important;',
    '    display:inline-block !important;',
    '    padding:2px 0 !important; margin:0 !important;',
    '    font-size:13px !important; font-weight:500;',
    '    color:#555 !important;',
    '    background:transparent !important;',
    '    border:0 !important; border-radius:0 !important;',
    '    text-decoration:none !important; white-space:nowrap;',
    '    line-height:1.4 !important; position:relative;',
    '    transition:color 0.15s;',
    '  }',
    '  .mobile__gnb .gnb__cateogry .category__wrap > a:hover{',
    '    color:#0838F8 !important;',
    '  }',
    /* 활성 — 굵게 + 파랑 + 하단 짧은 바 */
    '  .mobile__gnb .gnb__cateogry .category__wrap > a.on{',
    '    color:#0838F8 !important; font-weight:800 !important;',
    '  }',
    '  .mobile__gnb .gnb__cateogry .category__wrap > a.on::after{',
    '    content:""; display:block !important;',
    '    position:absolute; left:0; right:0; bottom:-3px;',
    '    height:2px; background:#0838F8; border-radius:1px;',
    '  }',
    '  .mobile__gnb .gnb__cateogry .category__wrap > a:not(.on)::after{ display:none !important }',
    '  .mobile__gnb .gnb__cateogry .category__wrap > a.bj-internet-cat{ color:#555 !important }',
    /* v0.3.7: 인라인 빨강(#ff1818) 강조 링크 → 브랜드 파랑(#0838F8)로 통일 */
    '  a[style*="ff1818"],',
    '  a[style*="FF1818"],',
    '  a[style*="#ff1818"],',
    '  a[style*="#FF1818"]{ color:#0838F8 !important }',
    /* v0.3.8: rental-terms 라벨에 ⓘ 툴팁 인라인 배치 + .g-d 평가없음 배지 높이 통일 */
    '#ai-card-root .rt-r{ align-items:center !important }',
    '#ai-card-root .rt-l{',
    '  display:inline-flex !important; align-items:center !important; gap:3px !important;',
    '}',
    '#ai-card-root .rt-l .help{ margin-left:1px }',
    '#ai-card-root .rt-l .help summary{ font-size:11px; color:#999; padding:0 2px; cursor:pointer }',
    '#ai-card-root .g-d{',
    '  display:inline-flex !important; align-items:center !important; gap:6px !important;',
    '  line-height:1.2 !important; vertical-align:middle;',
    '  font-size:12px !important;',
    '}',
    /* v0.3.6: 아이콘 리스트 flex:0 1 auto로 shrink 허용 + min-width:0 */
    '  header.new-header .header__top > ul.inline_wrap.header_m_icon,',
    '  header.new-header .header__top > ul#bj-header-icons,',
    '  header.new-header ul#bj-header-icons{',
    '    display:flex !important; align-items:center !important;',
    '    gap:6px !important; margin:0 0 0 auto !important; padding:0 0 0 6px !important;',
    '    list-style:none !important;',
    '    flex:0 1 auto !important; flex-wrap:nowrap !important;',
    '    min-width:0 !important;',
    '  }',
    '  header.new-header ul#bj-header-icons li,',
    '  header.new-header .header__top ul.inline_wrap.header_m_icon li{',
    '    margin:0 !important; padding:0 !important; list-style:none !important;',
    '    display:inline-flex; align-items:center; flex:0 0 auto;',
    '  }',
    '  header.new-header ul#bj-header-icons li a{',
    '    display:inline-flex; align-items:center; line-height:1;',
    '  }',
    '  header.new-header ul#bj-header-icons li img{',
    '    height:20px !important; width:auto !important; display:block;',
    '  }',
    /* v0.3.6: 이벤트 링크 컴팩트화 + max-width로 잘림 */
    '  header.new-header ul#bj-header-icons li a[style*="ff3700"]{',
    '    white-space:nowrap; font-size:10px !important;',
    '    padding:3px 6px !important; line-height:1.2;',
    '    border-radius:4px !important;',
    '    max-width:38vw; overflow:hidden; text-overflow:ellipsis;',
    '  }',
    '}',
    /* v0.3.6: 협소 폭 단계적 축소 */
    '@media (max-width:400px){',
    '  header.new-header ul#bj-header-icons li a[style*="ff3700"]{',
    '    font-size:9.5px !important; padding:3px 5px !important;',
    '    max-width:28vw;',
    '  }',
    '  header.new-header .header__top .logo{ max-width:32vw !important }',
    '  header.new-header .header__top .logo img{ height:24px !important }',
    '}',
    '@media (max-width:360px){',
    '  header.new-header .header__top{ padding:8px 10px !important }',
    '  header.new-header ul#bj-header-icons{ gap:5px !important }',
    '  header.new-header ul#bj-header-icons li a[style*="ff3700"]{ max-width:90px }',
    '  header.new-header ul#bj-header-icons li img{ height:18px !important }',
    '}',

    /* === 하단 fixed 위젯 (.bb-inner 격상) === */
    /* specificity (0,1,4,0) 동급 + cascade 후순 */
    'body #container .wide-inner > .prod_view_bot.card.mt40,',
    '.prod_view_bot.card.mt40{',
    '  display:block !important;',  /* v0.5.3: 빌리조 underlying이 display:none으로 숨김 → 명시 override */
    '  position:fixed !important;',
    '  bottom:0 !important;',
    '  left:0 !important; right:0 !important;',
    '  z-index:99999 !important;',
    '  background:#fff !important;',
    '  border:1px solid #dfdfdf !important;',
    '  border-bottom:0 !important;',
    '  border-radius:14px 14px 0 0 !important;',
    '  box-shadow:0 -8px 24px rgba(0,0,0,0.08) !important;',
    '  padding:0 !important;',
    '  margin:0 !important;',
    '  overflow:hidden !important;',
    '  max-height:min(440px, 75vh) !important;',
    '  transition:max-height 0.32s cubic-bezier(0.4, 0, 0.2, 1), bottom 0.38s cubic-bezier(0.2, 0.9, 0.3, 1) !important;',
    '}',
    /* AI 카드 미통과 / 사용자 수동 숨김 — 화면 밖으로 slide */
    'body #container .wide-inner > .prod_view_bot.card.mt40.bj-bar-slide-hidden,',
    '.prod_view_bot.card.mt40.bj-bar-slide-hidden,',
    '#billyjo-bottom-bar.bj-bar-slide-hidden{',
    '  bottom:-280px !important;',
    '  pointer-events:none !important;',
    '  transition:bottom 0.38s cubic-bezier(0.2,0.9,0.3,1) !important;',
    '}',
    /* v0.5.72: PC sticky widget 중앙 정렬 — 모든 PC(≥1024px)에서 적용 (이전 ≥1500px 한정). */
    /* 1024px~1500px: max-width 1200px / ≥1500px: max-width 1500px */
    '@media (min-width:1024px){',
    '  body #container .wide-inner > .prod_view_bot.card.mt40,',
    '  .prod_view_bot.card.mt40{',
    '    left:50% !important; right:auto !important;',
    '    transform:translateX(-50%) !important;',
    '    width:100% !important; max-width:1200px !important;',
    '    border-top-left-radius:14px !important; border-top-right-radius:14px !important;',
    '  }',
    '}',
    '@media (min-width:1500px){',
    '  body #container .wide-inner > .prod_view_bot.card.mt40,',
    '  .prod_view_bot.card.mt40{',
    '    max-width:1500px !important;',
    '  }',
    '}',
    'body #container .wide-inner > .prod_view_bot.card.mt40.bj-bar-expanded,',
    '.prod_view_bot.card.mt40.bj-bar-expanded{ max-height:min(440px, 75vh) !important }',
    /* v0.5.13: collapsed max-height 64→56px (핸들 1행만 보이므로 더 콤팩트) */
    /* v0.5.37: collapsed max-height 56→48px (핸들 padding 축소 동기) */
    'body #container .wide-inner > .prod_view_bot.card.mt40.bj-bar-collapsed,',
    '.prod_view_bot.card.mt40.bj-bar-collapsed{ max-height:48px !important; overflow:hidden !important }',
    /* v0.5.13: collapsed 시 핸들만 노출 — 모든 fallback 콘텐츠 숨김 (렌탈사 selector·약정 pill·3버튼 영역 포함) */
    '.prod_view_bot.card.mt40.bj-bar-collapsed .card__top,',
    '.prod_view_bot.card.mt40.bj-bar-collapsed .card__tit,',
    '.prod_view_bot.card.mt40.bj-bar-collapsed .rantal_wrap,',
    '.prod_view_bot.card.mt40.bj-bar-collapsed .bb-left,',
    '.prod_view_bot.card.mt40.bj-bar-collapsed .bb-right-bottom,',
    /* v0.5.13: fallback 콘텐츠 (.bj-bar-fallback 자체 + 내부 selector·버튼) 숨김 */
    '.prod_view_bot.card.mt40.bj-bar-collapsed .bj-bar-fallback,',
    '.prod_view_bot.card.mt40.bj-bar-collapsed .bj-fb-selector,',
    '.prod_view_bot.card.mt40.bj-bar-collapsed .bj-widget-selector,',
    '.prod_view_bot.card.mt40.bj-bar-collapsed .bj-ws-sup-section,',
    '.prod_view_bot.card.mt40.bj-bar-collapsed .bj-ws-term-pills,',
    '.prod_view_bot.card.mt40.bj-bar-collapsed .bj-fb-info,',
    '.prod_view_bot.card.mt40.bj-bar-collapsed .bj-fb-btns,',
    /* v0.5.31: 옵션 박스도 collapsed 시 hide (wrapper max-height:56px 잘림 방지) */
    '.prod_view_bot.card.mt40.bj-bar-collapsed .bj-fb-option-box,',
    /* .bb-inner 자체도 숨김 (안에 .bb-product-name·.bb-months 등이 보일 수 있음) */
    '.prod_view_bot.card.mt40.bj-bar-collapsed .bb-inner,',
    '.prod_view_bot.card.mt40.bj-bar-collapsed .bb-right{',
    '  display:none !important;',
    '}',
    '.prod_view_bot.card.mt40.bj-bar-expanded .bb-inner,',
    '.prod_view_bot.card.mt40 .bb-inner{',
    '  overflow-y:auto; max-height:calc(min(440px, 75vh) - 48px);',
    '}',
    /* v0.5.34: 펼친 위젯 전체에 세로 스크롤 보장 — 콘텐츠가 max-height 초과 시 본 컨테이너에서 스크롤 */
    '.prod_view_bot.card.mt40.bj-bar-expanded{ overflow-y:auto !important }',

    /* 핸들 (v0.5.0: grip 강화 — 더 크고 진하게, 호버 시 브랜드 파랑) */
    '.bj-bar-handle{',
    '  display:flex; align-items:center; justify-content:space-between;',
    /* v0.5.37: 위아래 padding 축소 — grip 영역만 확보(상단 16px), 하단 6px */
    '  padding:14px 18px 6px; cursor:pointer; user-select:none;',
    '  background:linear-gradient(180deg, #fafafa 0%, #ffffff 100%);',
    '  border-bottom:0.5px solid #dfdfdf; gap:12px; position:relative;',
    '  -webkit-tap-highlight-color:transparent;',
    '}',
    '.bj-bar-handle:hover{ background:#f5f5f5 }',
    '.bj-bar-handle:hover::before{ background:#0838F8; opacity:1; width:56px }',
    '.bj-bar-handle:active::before{ background:#0838F8; width:60px; opacity:1 }',
    /* visible grip bar — 기존 그대로 (pointer-events:none) */
    /* v0.7.x: 평평한 바 → 위로 향한 얕은 ⌃ 셰브론 — "위로 당겨 펼치기" 직관 강화.
       clip-path만 추가하므로 width/background 기반 hover·active·breathe 애니메이션은 그대로 동작. */
    '.bj-bar-handle::before{',
    '  content:""; position:absolute; top:6px; left:50%;',
    '  transform:translateX(-50%);',
    '  width:46px; height:11px;',
    '  background:#b8b8b8; pointer-events:none;',
    '  clip-path:polygon(0% 50%, 50% 0%, 100% 50%, 100% 100%, 50% 50%, 0% 100%);',
    '  transition:background 0.15s, width 0.2s ease-out, opacity 0.15s;',
    '  opacity:0.9;',
    '}',
    /* v0.5.38: grip bar 위 큰 invisible hit zone — 사용자가 바 근처(±50px)만 눌러도
       클릭이 핸들로 위임되어 토글 작동. ::before는 시각, ::after는 hit area 분리. */
    '.bj-bar-handle::after{',
    '  content:""; position:absolute; top:0; left:50%;',
    '  transform:translateX(-50%);',
    '  width:120px; height:18px;',
    '  background:transparent;',
    '  pointer-events:auto; cursor:pointer;',
    '  z-index:1;',
    '}',
    /* 모바일: 좁은 폭(≤600px)에서 옵션 선택 버튼이 중앙 grip 셰브론(::before)과 겹침
       → 핸들 상단 padding 확대로 콘텐츠행을 grip 아래로 분리(데스크톱은 바가 넓어 무영향) */
    '@media (max-width:600px){',
    '  .prod_view_bot.card.mt40 .bj-bar-handle{ padding-top:24px !important }',
    '}',
    /* 접힘 상태: grip 살짝 펄스 (열기 유도) */
    '.prod_view_bot.card.mt40.bj-bar-collapsed .bj-bar-handle::before{',
    '  animation:bjGripBreathe 2.5s ease-in-out infinite;',
    '}',
    '@keyframes bjGripBreathe{',
    '  0%,100%{ background:#b8b8b8; opacity:0.85; width:48px }',
    '  50%{ background:#0838F8; opacity:1; width:56px }',
    '}',
    '.bj-bar-handle-text{',
    '  font-family:"Pretendard","Apple SD Gothic Neo",sans-serif;',
    '  font-size:13px; font-weight:700; color:#2a2a2a;',
    '  flex:1 1 auto; min-width:0;',
    '  overflow:hidden; text-overflow:ellipsis; white-space:nowrap;',
    '  display:flex; align-items:center; gap:8px;',
    '}',
    '.bj-bar-handle-price{ color:#0838F8; font-weight:800; font-size:14px }',
    /* v0.5.60+v0.5.64: 핸들 ⓘ는 폐기, 약정 pill 아래 가로 안내 chip으로 변경 */
    '.bj-card-info-chip{',
    '  display:flex !important; align-items:center !important; gap:8px !important;',
    '  margin-top:8px !important; padding:8px 12px !important;',
    '  background:linear-gradient(135deg, #F4F8FF 0%, #FFFFFF 100%) !important;',
    '  border:1px solid #C8D4F0 !important; border-radius:8px !important;',
    '  text-decoration:none !important;',
    '  font-family:Pretendard,sans-serif !important; font-size:12.5px !important;',
    '  color:#334155 !important; line-height:1.3 !important;',
    '  transition:background 0.15s, transform 0.1s !important;',
    '}',
    '.bj-card-info-chip:hover{ background:#EEF3FF !important; transform:translateY(-1px) !important }',
    '.bj-card-info-chip strong{ color:#0838F8 !important; font-weight:800 !important; margin-left:2px }',
    '.bj-card-info-icon{ font-size:15px; flex:0 0 auto }',
    '.bj-card-info-arrow{ margin-left:auto; flex:0 0 auto; font-weight:700; color:#0838F8 }',
    '@media (max-width:600px){',
    '  .bj-card-info-chip{ font-size:11.5px !important; padding:7px 10px !important; gap:6px !important }',
    '}',

    /* v0.5.69: 상담신청 modal */
    '.bj-consult-modal-backdrop{',
    '  position:fixed !important; inset:0 !important;',
    '  background:rgba(0,0,0,0.5) !important;',
    '  z-index:100002 !important;',
    '  display:flex !important; align-items:center !important; justify-content:center !important;',
    '  padding:20px !important;',
    '  animation:bjConsultBackdropIn 0.18s ease-out;',
    '  -webkit-tap-highlight-color:transparent;',
    '}',
    '@keyframes bjConsultBackdropIn{ from{ opacity:0 } to{ opacity:1 } }',
    '.bj-consult-modal-box{',
    '  position:relative !important;',
    '  background:#fff !important; border-radius:16px !important;',
    '  width:100% !important; max-width:380px !important;',
    '  box-shadow:0 16px 48px rgba(0,0,0,0.25) !important;',
    '  padding:28px 24px 22px !important;',
    '  font-family:"Pretendard","Apple SD Gothic Neo",sans-serif !important;',
    '  animation:bjConsultBoxIn 0.22s cubic-bezier(0.2,0.9,0.3,1);',
    '  box-sizing:border-box !important;',
    '}',
    '@keyframes bjConsultBoxIn{',
    '  from{ opacity:0; transform:translateY(20px) scale(0.95) }',
    '  to{ opacity:1; transform:translateY(0) scale(1) }',
    '}',
    '.bj-consult-modal-close{',
    '  position:absolute !important; top:10px !important; right:12px !important;',
    '  background:transparent !important; border:0 !important;',
    '  width:36px !important; height:36px !important;',
    '  font-size:24px !important; color:#888 !important; cursor:pointer !important;',
    '  line-height:1 !important;',
    '}',
    '.bj-consult-modal-close:hover{ color:#222 !important }',
    '.bj-consult-modal-body{ text-align:center !important }',
    '.bj-consult-title{ font-size:18px; font-weight:800; color:#0838F8; margin-bottom:14px }',
    '.bj-consult-title-ok{ color:#16a34a }',
    /* v0.7.0: 모달 1단계 2분기 + 예약 화면 */
    '.bj-consult-code-inline{ font-family:monospace; color:#ff3737; font-weight:800; letter-spacing:1.5px }',
    '.bj-choice-row{ display:flex; gap:10px; margin:18px 0 12px }',
    '.bj-choice-card{ flex:1; padding:18px 10px 14px; background:#fff; border:1.5px solid #e0e8ff; border-radius:14px; cursor:pointer; transition:all .15s ease; font-family:inherit; text-align:center }',
    '.bj-choice-card:hover{ border-color:#0838F8; background:#f5f8ff; transform:translateY(-2px); box-shadow:0 6px 18px rgba(8,56,248,0.12) }',
    '.bj-choice-now{ background:linear-gradient(135deg,#0838F8,#4a7cff); color:#fff; border-color:transparent }',
    '.bj-choice-now:hover{ background:linear-gradient(135deg,#0626c0,#3a6cef); border-color:transparent }',
    '.bj-choice-ic{ font-size:30px; margin-bottom:6px; line-height:1 }',
    '.bj-choice-ttl{ font-size:16px; font-weight:800; margin-bottom:4px }',
    '.bj-choice-sub{ font-size:12px; opacity:0.9; margin-bottom:6px }',
    '.bj-choice-meta{ font-size:11px; opacity:0.75 }',
    '.bj-choice-now .bj-choice-sub, .bj-choice-now .bj-choice-meta{ color:#fff }',
    '.bj-back-btn{ position:absolute; top:14px; left:14px; background:transparent; border:0; color:#777; cursor:pointer; font-size:12px; padding:4px 8px; font-family:inherit }',
    '.bj-back-btn:hover{ color:#222 }',
    '.bj-resv-label{ font-size:13px; color:#555; font-weight:700; text-align:left; margin:14px 0 8px }',
    '.bj-resv-mins{ display:grid; grid-template-columns:repeat(4,1fr); gap:6px; margin-bottom:6px }',
    '.bj-resv-min{ padding:10px 4px; border:1.5px solid #e0e8ff; background:#fff; border-radius:10px; cursor:pointer; font-size:14px; font-weight:700; color:#0838F8; font-family:inherit; transition:all .15s }',
    '.bj-resv-min:hover{ background:#f5f8ff }',
    '.bj-resv-min.on{ background:#0838F8; color:#fff; border-color:#0838F8 }',
    '.bj-resv-phone{ width:100%; padding:14px 16px; border:1.5px solid #e0e8ff; border-radius:10px; font-size:16px; font-family:inherit; outline:none; box-sizing:border-box }',
    '.bj-resv-phone:focus{ border-color:#0838F8; box-shadow:0 0 0 3px rgba(8,56,248,0.1) }',
    '.bj-resv-submit{ width:100%; padding:16px; margin-top:14px; background:#0838F8; color:#fff; border:0; border-radius:12px; font-size:15px; font-weight:800; cursor:pointer; font-family:inherit; transition:all .15s }',
    '.bj-resv-submit:hover:not(:disabled){ background:#0626c0 }',
    '.bj-resv-submit:disabled{ background:#cbd5e1; cursor:not-allowed }',
    '.bj-resv-err{ margin-top:10px; padding:10px; background:#fef2f2; border:1px solid #fecaca; color:#b91c1c; font-size:12px; border-radius:8px }',
    '.bj-resv-confirm{ margin:20px 0; padding:20px; background:linear-gradient(135deg,#ecfdf5,#d1fae5); border-radius:14px; text-align:center }',
    '.bj-resv-when{ font-size:26px; font-weight:800; color:#16a34a; margin-bottom:6px }',
    '.bj-resv-to{ font-size:14px; color:#555 }',
    '.bj-consult-spinner{',
    '  width:36px; height:36px; margin:18px auto;',
    '  border:3px solid #e5e8ee; border-top-color:#0838F8;',
    '  border-radius:50%;',
    '  animation:bjSpin 0.85s linear infinite;',
    '}',
    '@keyframes bjSpin{ to{ transform:rotate(360deg) } }',
    '.bj-consult-status{ font-size:13px; color:#666; margin-top:6px }',
    '.bj-consult-agent{ font-size:14px; color:#444; margin-bottom:16px; line-height:1.4 }',
    '.bj-consult-agent strong{ color:#0838F8; font-weight:800 }',
    '.bj-consult-code-label{ font-size:11px; color:#888; font-weight:600; letter-spacing:1px; margin-bottom:8px; text-transform:uppercase }',
    '.bj-consult-code{ display:flex; justify-content:center; gap:8px; margin-bottom:14px }',
    '.bj-consult-code-digit{',
    '  display:flex; align-items:center; justify-content:center;',
    '  width:52px; height:60px;',
    '  background:linear-gradient(180deg, #fff8e7 0%, #fff3cc 100%);',
    '  border:2px solid #ffd000; border-radius:10px;',
    '  font-size:28px; font-weight:800; color:#3a2a00;',
    '  font-family:"Pretendard",sans-serif;',
    '  box-shadow:0 2px 8px rgba(255,208,0,0.3);',
    '}',
    '.bj-consult-instructions{',
    '  font-size:12.5px; color:#555; line-height:1.5; margin-bottom:18px;',
    '  background:#f7f9ff; padding:10px 12px; border-radius:8px;',
    '}',
    '.bj-consult-instructions strong{ color:#0838F8; font-weight:700 }',
    '.bj-consult-call-btn{',
    '  display:flex !important; align-items:center !important; gap:10px !important;',
    '  width:100% !important; padding:14px 16px !important;',
    '  background:linear-gradient(135deg, #0838F8 0%, #2154ff 100%) !important;',
    '  color:#fff !important; text-decoration:none !important;',
    '  border-radius:10px !important; font-weight:800 !important;',
    '  font-family:"Pretendard",sans-serif !important;',
    '  box-shadow:0 4px 12px rgba(8,56,248,0.3) !important;',
    '  transition:transform 0.1s !important;',
    '  box-sizing:border-box !important;',
    '}',
    '.bj-consult-call-btn:hover{ transform:translateY(-1px) }',
    '.bj-consult-call-btn:active{ transform:translateY(0) }',
    '.bj-consult-call-btn svg{ width:22px; height:22px; flex:0 0 auto }',
    '.bj-consult-call-phone{ font-size:17px; flex:1; text-align:left; letter-spacing:0.3px }',
    '.bj-consult-call-cta{ font-size:13px; opacity:0.9; flex:0 0 auto }',
    '.bj-consult-expires{ font-size:11px; color:#999; margin-top:12px }',
    '.bj-consult-mock-notice{',
    '  font-size:10.5px; color:#b45309; margin-top:8px;',
    '  background:#fff8e1; padding:5px 10px; border-radius:6px;',
    '}',
    '@media (max-width:600px){',
    '  .bj-consult-modal-box{ padding:24px 20px 18px !important; max-width:340px !important }',
    '  .bj-consult-code-digit{ width:48px; height:56px; font-size:26px }',
    '  .bj-consult-call-btn{ padding:12px 14px !important }',
    '  .bj-consult-call-phone{ font-size:16px }',
    '}',

    /* v0.5.65: 제휴카드 페이지 상단 강조 박스 */
    '#bj-partnership-highlight{',
    '  margin:20px 0 30px !important; padding:0 !important;',
    '  border:2px solid #ffd000 !important; border-radius:12px !important;',
    '  background:linear-gradient(180deg, #fff8e7 0%, #fff 60%) !important;',
    '  box-shadow:0 4px 12px rgba(255,208,0,0.2) !important;',
    '  overflow:hidden !important;',
    '}',
    '#bj-partnership-highlight .bj-php-label{',
    '  display:flex !important; align-items:center !important; gap:8px !important;',
    '  background:#ffd000 !important; color:#3a2a00 !important;',
    '  padding:10px 16px !important;',
    '  font-family:Pretendard,sans-serif !important;',
    '  font-size:14px !important; font-weight:700 !important;',
    '  letter-spacing:0.2px !important; line-height:1.4 !important;',
    '}',
    '#bj-partnership-highlight .bj-php-label strong{',
    '  color:#0838F8 !important; font-weight:800 !important;',
    '}',
    '#bj-partnership-highlight .bj-php-icon{',
    '  font-size:18px !important; flex:0 0 auto !important;',
    '}',
    '#bj-partnership-highlight .bj-php-clone{',
    '  padding:16px !important; background:#fff !important;',
    '}',
    '#bj-partnership-highlight .bj-php-clone li{',
    '  list-style:none !important; margin:0 !important; padding:0 !important;',
    '}',
    '@media (max-width:600px){',
    '  #bj-partnership-highlight{ margin:12px 0 20px !important; border-radius:10px !important }',
    '  #bj-partnership-highlight .bj-php-label{ font-size:12.5px !important; padding:8px 12px !important }',
    '  #bj-partnership-highlight .bj-php-clone{ padding:12px !important }',
    '}',
    '.bj-bar-handle-toggle{',
    '  width:36px; height:24px; border-radius:6px;',
    '  background:transparent; border:1px solid #dfdfdf;',
    '  display:inline-flex; align-items:center; justify-content:center;',
    '  font-size:13px; color:#6a6a6a; cursor:pointer;',
    '  transition:all 0.2s; font-family:Arial, sans-serif; line-height:1;',
    '}',
    '.bj-bar-handle:hover .bj-bar-handle-toggle{',
    '  background:#e8edff; border-color:#0838F8; color:#0838F8;',
    '}',
    '.bj-bar-handle-toggle .bj-bar-chevron{',
    '  display:inline-block; transition:transform 0.25s;',
    '}',
    '.prod_view_bot.card.mt40.bj-bar-collapsed .bj-bar-chevron{',
    '  transform:rotate(180deg);',
    '}',

    /* v0.8: 하단 위젯 토글 UX 재설계 —
       (1) 별도 ▲ 토글 박스 버튼(.bj-bar-handle-toggle) 제거: 핸들 전체 탭으로 토글되므로 중복.
       (2) 중앙 grip 셰브론(::before)을 단일 토글 인디케이터로: 펼침 시 180° 회전해 아래(⌄) 표시.
       (3) '옵션 선택' 칩 우측 정렬(margin-left:auto). */
    '.bj-bar-handle-toggle{ display:none !important }',
    '.bj-bar-handle-text .bj-bar-handle-option{ margin-left:auto !important; margin-right:20px !important }',
    '.bj-bar-handle::before{ transition:background 0.15s, width 0.2s ease-out, opacity 0.15s, transform 0.25s ease !important }',
    '.prod_view_bot.card.mt40:not(.bj-bar-collapsed) .bj-bar-handle::before{ transform:translateX(-50%) rotate(180deg) !important }',

    /* bb-inner padding 조정 */
    '.prod_view_bot.card.mt40 .bb-inner{ padding:14px 18px 16px !important }',

    /* v0.5.6 / v0.5.8: 위젯 내 렌탈사·약정 selector */
    '.bj-widget-selector{',
    '  display:flex !important; flex-direction:column !important;',
    '  gap:10px !important;',
    /* v0.5.30: flex column 자식의 default min-width:auto가 .bj-ws-term-pills를
       콘텐츠 너비로 확장시켜 overflow-x:auto가 무력화됨 → 약정 pill 가로 스크롤 안 됨.
       부모/자식 모두 min-width:0 + max-width:100%로 viewport 폭 강제. */
    '  min-width:0 !important; max-width:100% !important; width:100% !important;',
    '}',
    /* v0.5.8: 다중 렌탈사 섹션 — "렌탈사 선택" 라벨 + 탭 + "{이름}의 약정 조건" 라벨 */
    '.bj-ws-sup-section{',
    '  display:flex !important; flex-direction:column !important; gap:6px !important;',
    '  padding-bottom:10px !important;',
    '  border-bottom:0.5px dashed #e5e5e5 !important;',
    '  min-width:0 !important; max-width:100% !important; width:100% !important;',
    '}',
    '.bj-ws-sup-label{',
    '  font-size:11px; color:#888; font-weight:600;',
    '  font-family:Pretendard,sans-serif;',
    '}',
    '.bj-ws-term-label{',
    '  font-size:12px; color:#444; font-weight:500;',
    '  margin-top:4px; font-family:Pretendard,sans-serif;',
    '}',
    '.bj-ws-term-label strong{ color:#0838F8; font-weight:700 }',
    '.bj-ws-sup-tabs{',
    '  display:flex !important; gap:6px !important;',
    '  overflow-x:auto !important; padding-bottom:2px;',
    '  -webkit-overflow-scrolling:touch;',
    '  scrollbar-width:none;',
    '}',
    '.bj-ws-sup-tabs::-webkit-scrollbar{ display:none }',
    '.bj-ws-sup-tab{',
    '  flex:0 0 auto !important; padding:7px 14px !important;',
    '  background:#f4f4f4 !important; color:#555 !important;',
    '  border:1px solid #e5e5e5 !important; border-radius:16px !important;',
    '  font:600 12.5px Pretendard,sans-serif !important; cursor:pointer !important;',
    '  white-space:nowrap !important;',
    '  transition:all 0.15s !important;',
    '}',
    '.bj-ws-sup-tab:hover{ border-color:#0838F8 !important; color:#0838F8 !important }',
    '.bj-ws-sup-tab.active{',
    '  background:#0838F8 !important; color:#fff !important;',
    '  border-color:#0838F8 !important;',
    '}',
    /* v0.5.18: 약정 pill 1행 가로 스와이프 + 컴팩트화 (이전 2행 wrap → 1행 nowrap)
       v0.5.30: min-width:0 + max-width:100% — flex column 부모 안에서 overflow-x:auto
       동작 보장 (콘텐츠 너비로 늘어나면 스크롤 영역 인지 안 됨). */
    '.bj-ws-term-pills{',
    '  display:flex !important; gap:6px !important;',
    '  flex-wrap:nowrap !important;',
    '  overflow-x:auto !important; overflow-y:hidden !important;',
    '  -webkit-overflow-scrolling:touch;',
    '  scrollbar-width:none; -ms-overflow-style:none;',
    '  padding:2px 2px 4px !important;',
    '  margin:0 -2px !important;',
    '  min-width:0 !important; max-width:100% !important; width:100% !important;',
    '  box-sizing:border-box !important;',
    '}',
    '.bj-ws-term-pills::-webkit-scrollbar{ display:none }',
    /* v0.5.19: pill을 완전 1행 — period · price 가로 배치 + 구분점
       v0.5.31: padding/gap 축소로 가로 길이 컴팩트화
       v0.5.36: border-radius 999px(캡슐) → 8px(코너만 둥근 네모) */
    '.bj-ws-term-pill{',
    '  flex:0 0 auto !important; min-width:auto !important;',
    '  padding:4px 8px !important;',
    '  background:#fafafa !important;',
    '  border:1px solid #dfdfdf !important; border-radius:8px !important;',
    '  display:inline-flex !important; flex-direction:row !important;',
    '  align-items:center !important; gap:5px !important; cursor:pointer !important;',
    '  font-family:Pretendard,sans-serif !important;',
    '  transition:border-color 0.15s, background 0.15s !important;',
    '  white-space:nowrap;',
    '  line-height:1.3;',
    '  height:auto;',
    '}',
    '.bj-ws-term-pill:hover{ border-color:#0838F8 !important }',
    '.bj-ws-term-pill.active{',
    '  border-color:#0838F8 !important; background:#eff3ff !important;',
    '}',
    /* 각 span 사이에 분리점 */
    '.bj-ws-term-pill > span + span::before{',
    '  content:"·"; color:#bbb; margin-right:7px; font-weight:400;',
    '}',
    '.bj-ws-term-period{ font-size:11.5px !important; color:#666 !important; font-weight:500 !important }',
    '.bj-ws-term-price{ font-size:12.5px !important; font-weight:700 !important; color:#0838F8 !important }',
    '.bj-ws-term-pill.active .bj-ws-term-price{ color:#0838F8 }',
    /* v0.5.32+v0.5.56: 정가 보조 라벨 — 카드 할인 없이 일반 결제하는 사용자에게도
       유효한 가격이므로 strike-through 제거 + 진회색으로 명확 표기. */
    '.bj-ws-term-orig{',
    '  font-size:11px !important; color:#555 !important; font-weight:600 !important;',
    '  margin-left:2px !important;',
    '  text-decoration:none !important;',
    '}',
    '.bj-ws-term-pill.has-card-dc .bj-ws-term-price{ color:#ee0979 !important }',
    '.bj-ws-term-pill.has-card-dc.active .bj-ws-term-price{ color:#ee0979 !important }',
    /* v0.5.33: pill 2행 마크업 + "카드/정가" 라벨
       v0.5.37: padding/gap 축소 — 위아래 더 컴팩트 */
    '.bj-ws-term-pill-2row{',
    '  flex-direction:column !important; gap:1px !important;',
    '  padding:3px 9px !important; align-items:center !important;',
    '}',
    '.bj-ws-term-row1, .bj-ws-term-row2{',
    '  display:inline-flex !important; align-items:center !important;',
    '  gap:4px !important; line-height:1.15 !important;',
    '}',
    '.bj-ws-term-price-lbl{',
    '  font-size:9px !important; font-weight:700 !important;',
    '  padding:1px 4px !important; border-radius:3px !important;',
    '  letter-spacing:0.2px !important; line-height:1.2 !important;',
    '}',
    '.bj-ws-lbl-card{ background:#ffe1ee !important; color:#ee0979 !important }',
    '.bj-ws-lbl-orig{ background:#eef0f2 !important; color:#777 !important }',
    /* row2 안의 분리점 제거 (2행 마크업에선 라벨이 명시되어 불필요) */
    '.bj-ws-term-pill-2row .bj-ws-term-row2 > span + span::before{ content:none !important }',
    '.bj-ws-term-pill-2row .bj-ws-term-row1 > span + span::before{ content:none !important }',
    /* v0.5.7+v0.5.26: BEST 배지 — absolute → inline 변경 (pill 안에 자연스럽게 배치) */
    '.bj-ws-term-pill{ position:relative !important }',
    '.bj-ws-best-badge{',
    '  display:inline-flex !important; align-items:center !important;',
    '  position:static !important;',
    '  background:linear-gradient(135deg,#ff6a00 0%,#ee0979 100%) !important;',
    '  color:#fff !important; font-size:9.5px !important; font-weight:800 !important;',
    '  padding:2px 6px !important; border-radius:8px !important; letter-spacing:0.4px !important;',
    '  box-shadow:0 1px 3px rgba(238,9,121,0.25) !important; line-height:1 !important;',
    '  font-family:Pretendard,sans-serif !important;',
    '  margin-right:5px !important; flex:0 0 auto !important;',
    '  vertical-align:middle !important;',
    '  height:auto !important;',
    '}',
    '.bj-ws-term-pill.is-best{',
    '  border-color:#ee0979 !important; background:linear-gradient(180deg,#fff5fa 0%,#fff 100%) !important;',
    '}',
    '.bj-ws-term-pill.is-best .bj-ws-term-price{ color:#ee0979 !important }',
    '.bj-ws-term-pill.is-best.active{',
    '  border-color:#ee0979 !important; background:#fff0f6 !important;',
    '  box-shadow:0 0 0 2px rgba(238,9,121,0.15) !important;',
    '}',
    /* v0.5.19: eff 카드할인 — 1행 인라인, 콤팩트 + 색만 강조 */
    '.bj-ws-term-eff{',
    '  font-size:11px !important; color:#ee0979 !important; font-weight:600 !important;',
    '  margin:0 !important; line-height:1.3 !important;',
    '  display:inline !important;',
    '}',
    /* v0.5.26: inline 변환에 따라 top/right 제거 (override 안 함) */
    '.bj-ws-best-badge{',
    '  font-size:9px !important; padding:2px 5px !important;',
    '}',
    /* v0.5.70: 타사보상 약정 pill — 청록 배지 + 미묘한 톤 차이 */
    '.bj-ws-wt-badge{',
    '  display:inline-flex !important; align-items:center !important;',
    '  background:linear-gradient(135deg,#0891b2 0%,#0e7490 100%) !important;',
    '  color:#fff !important; font-size:9px !important; font-weight:700 !important;',
    '  padding:2px 5px !important; border-radius:6px !important; letter-spacing:0.3px !important;',
    '  line-height:1 !important; font-family:Pretendard,sans-serif !important;',
    '  margin-right:5px !important; flex:0 0 auto !important; height:auto !important;',
    '}',
    '.bj-ws-term-pill.is-warranty-transfer{',
    '  background:linear-gradient(180deg,#f0fbfd 0%,#fff 100%) !important;',
    '  border-color:#a5e0ea !important;',
    '}',
    '.bj-ws-term-pill.is-warranty-transfer.active{',
    '  border-color:#0891b2 !important; background:#e0f7fb !important;',
    '  box-shadow:0 0 0 2px rgba(8,145,178,0.15) !important;',
    '}',
    '.bj-ws-best-dot{',
    '  display:inline-block !important; width:6px !important; height:6px !important;',
    '  margin-left:5px !important; border-radius:50% !important;',
    '  background:#ee0979 !important; vertical-align:middle !important;',
    '}',
    /* 핸들 BEST 라벨 */
    '.bj-bar-handle-best{',
    '  display:inline-block !important;',
    '  background:linear-gradient(135deg,#ff6a00 0%,#ee0979 100%) !important;',
    '  color:#fff !important; font-size:9.5px !important; font-weight:800 !important;',
    '  padding:2px 6px !important; border-radius:8px !important; letter-spacing:0.4px !important;',
    '  margin-right:6px !important; vertical-align:middle !important;',
    '  line-height:1.2 !important; font-family:Pretendard,sans-serif !important;',
    '}',
    /* v0.5.15: 핸들 옵션 칩 — 선택 옵션 표시 + 미선택 시 빨간 강조로 액션 유도 */
    '.bj-bar-handle-option{',
    '  display:inline-flex !important; align-items:center !important;',
    '  padding:3px 9px 3px 9px !important;',
    '  border-radius:999px !important;',
    '  background:#e8edff !important; color:#0838F8 !important;',
    '  font-size:11.5px !important; font-weight:700 !important;',
    /* v0.5.46: chip이 price 우측에 배치되므로 margin-right → margin-left + flex:0 0 auto */
    '  margin-left:8px !important; flex:0 0 auto !important;',
    '  vertical-align:middle !important;',
    '  line-height:1.2 !important; cursor:pointer !important;',
    '  border:1px solid #c8d4f0 !important;',
    '  font-family:Pretendard,sans-serif !important;',
    '  max-width:120px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;',
    '  transition:background 0.15s, border-color 0.15s;',
    '}',
    '.bj-bar-handle-option::before{',
    '  content:"⚙ "; font-size:11px; margin-right:2px; opacity:0.85;',
    '}',
    '.bj-bar-handle-option:hover{',
    '  background:#dde6ff !important; border-color:#0838F8 !important;',
    '}',
    /* v0.5.44: is-empty 색상 빨강(경고) → 빌리조 테마 금색.
       v0.5.45: #ffd000 glow 효과 — blur 변화로 빛이 새어나오는 발광 느낌. */
    '.bj-bar-handle-option.is-empty{',
    '  background:#FFF6DA !important; color:#8A5A00 !important;',
    '  border-color:#F5CE3E !important;',
    '  animation:bjOptionGlow 1.8s ease-in-out infinite;',
    '}',
    '.bj-bar-handle-option.is-empty::before{ content:"✦ "; opacity:1 }',
    '@keyframes bjOptionGlow{',
    '  0%,100%{',
    '    transform:scale(1);',
    '    box-shadow:0 0 4px #ffd000, 0 0 8px rgba(255,208,0,0.5);',
    '  }',
    '  50%{',
    '    transform:scale(1.03);',
    '    box-shadow:0 0 8px #ffd000, 0 0 16px rgba(255,208,0,0.7), 0 0 24px rgba(255,208,0,0.35);',
    '  }',
    '}',
    /* v0.5.15: 위젯 펼친 영역의 .bb-option-select 스타일 — 가독성·터치 영역 확보 */
    '.bj-bb-inner-merged .bb-option-select,',
    '.bj-bb-inner-merged .option_select,',
    '.bj-bar-fallback .bb-option-select,',
    '.bj-bar-fallback .option_select{',
    '  width:100% !important; padding:11px 36px 11px 12px !important;',
    '  border:1px solid #dfdfdf !important; border-radius:8px !important;',
    '  font-size:13.5px !important; font-weight:600 !important;',
    '  font-family:Pretendard,sans-serif !important;',
    '  background:#fff !important; color:#2a2a2a !important;',
    '  -webkit-appearance:none !important; appearance:none !important;',
    '  background-image:url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 12 12\'><path d=\'M2 4l4 4 4-4\' stroke=\'%230838F8\' stroke-width=\'1.5\' fill=\'none\' stroke-linecap=\'round\' stroke-linejoin=\'round\'/></svg>") !important;',
    '  background-repeat:no-repeat !important; background-position:right 12px center !important;',
    '  background-size:12px !important;',
    '  margin:6px 0 8px !important;',
    '  cursor:pointer !important;',
    '  box-shadow:0 0 0 0 rgba(8,56,248,0) !important;',
    '  transition:border-color 0.15s, box-shadow 0.15s;',
    '}',
    /* v0.5.18: 버튼 그룹으로 대체된 select는 숨김 (value sync 위해 DOM은 유지) */
    '.bj-option-select-replaced{ display:none !important }',
    /* v0.5.18: 옵션 버튼 그룹 — 가로 1행 스와이프 */
    '.bj-option-buttons{',
    '  display:flex !important; gap:6px !important;',
    '  flex-wrap:nowrap !important;',
    '  overflow-x:auto !important; overflow-y:hidden !important;',
    '  -webkit-overflow-scrolling:touch;',
    '  scrollbar-width:none; -ms-overflow-style:none;',
    '  margin:6px 0 8px !important; padding:2px 2px 4px !important;',
    /* v0.5.33: flex row 부모(.bj-fb-option-box) 안에서 가로 스크롤 보장 */
    '  flex:1 1 0 !important; min-width:0 !important; max-width:100% !important;',
    '  box-sizing:border-box !important;',
    '}',
    '.bj-option-buttons::-webkit-scrollbar{ display:none }',
    '.bj-option-btn{',
    '  flex:0 0 auto !important;',
    '  padding:8px 14px !important;',
    '  background:#fff !important;',
    '  border:1px solid #dfdfdf !important; border-radius:999px !important;',
    '  font-family:Pretendard,sans-serif !important;',
    '  font-size:12.5px !important; font-weight:600 !important; color:#555 !important;',
    '  cursor:pointer !important; white-space:nowrap;',
    '  transition:all 0.15s !important;',
    '  line-height:1.2 !important;',
    '}',
    '.bj-option-btn:hover{',
    '  border-color:#0838F8 !important; color:#0838F8 !important;',
    '  background:#f5f8ff !important;',
    '}',
    '.bj-option-btn.active{',
    '  background:#0838F8 !important; color:#fff !important;',
    '  border-color:#0838F8 !important; font-weight:700 !important;',
    '  box-shadow:0 2px 6px rgba(8,56,248,0.2) !important;',
    '}',
    '@media (max-width:600px){',
    '  .bj-option-btn{ padding:7px 12px !important; font-size:11.5px !important }',
    '}',
    '.bj-bb-inner-merged .bb-option-select:focus,',
    '.bj-bb-inner-merged .option_select:focus,',
    '.bj-bar-fallback .bb-option-select:focus,',
    '.bj-bar-fallback .option_select:focus{',
    '  outline:none !important; border-color:#0838F8 !important;',
    '  box-shadow:0 0 0 3px rgba(8,56,248,0.15) !important;',
    '}',
    '@media (max-width:600px){',
    '  .bj-ws-sup-tab{ padding:5px 10px !important; font-size:11.5px !important }',
    '  .bj-ws-term-pill{ padding:4px 10px !important; min-width:auto !important; gap:5px !important }',
    '  .bj-ws-term-period{ font-size:11px !important }',
    '  .bj-ws-term-price{ font-size:12px !important }',
    '  .bj-ws-term-eff{ font-size:10.5px !important }',
    '  .bj-ws-term-pill > span + span::before{ margin-right:5px }',
    '  .bj-ws-term-period{ font-size:10.5px }',
    '  .bj-ws-term-price{ font-size:13px }',
    '}',

    /* v0.5.5: 위젯 안 중복 콘텐츠 제거 (AI 카드 SLOT 3·5·7·8과 중복) */
    /* (1) "렌탈사 비교·선택" 헤더 → AI 카드 SLOT 5(페르소나) / SLOT 8(LPT)이 대체 */
    '.prod_view_bot.card.mt40 .card__top,',
    '.prod_view_bot.card.mt40 .card__tit{',
    '  display:none !important;',
    '}',
    /* (2) 렌탈사 li 카드 (icon·name·sub·month·card_sale 일체) → SLOT 8 LPT가 대체 */
    '.prod_view_bot.card.mt40 .rantal_wrap,',
    '.prod_view_bot.card.mt40 ul.rantal_wrap,',
    '.prod_view_bot.card.mt40 .rantal_wrap > li{',
    '  display:none !important;',
    '}',
    /* (3) 제휴카드 안내 .card_sale (위젯 안 인스턴스만) → SLOT 8 LPT가 대체 */
    '.prod_view_bot.card.mt40 .card_sale{',
    '  display:none !important;',
    '}',
    /* (4) .over 영역 (수량 +/- · 옵션 wrap · 제휴카드 등) — AI 카드에 정보 다 있음, 버튼은 핸들 우측에 별도 노출 */
    '.prod_view_bot.card.mt40 .over,',
    '.prod_view_bot.card.mt40 .month_click,',
    '.prod_view_bot.card.mt40 .select__wrap,',
    '.prod_view_bot.card.mt40 .amount__wrap{',
    '  display:none !important;',
    '}',

    /* v0.5.4: 핸들+bb-inner 병합 — bb-inner를 단일 column 레이아웃으로 재구성 */
    '.prod_view_bot.card.mt40 .bb-inner.bj-bb-inner-merged{',
    '  display:flex !important; flex-direction:column !important;',
    '  gap:12px !important; padding:14px 18px 18px !important;',
    '}',
    /* bb-left·bb-right column 폐기 — 단일 column flex로 통합 */
    '.bj-bb-inner-merged .bb-left, .bj-bb-inner-merged .bb-right{',
    '  display:contents !important;',
    '}',
    /* 약정 pill 행 — 가로 배치, 클릭형 카드.
       v0.5.30: flex-wrap:wrap → nowrap + overflow-x:auto. 약정 많은 케이스(LG·코웨이)
       에서 2-3행 wrap이 화면 점거 + 가로 스크롤 못해 일부 약정 선택 불가능 → 1행 스크롤 통일. */
    '.bj-bb-inner-merged .bb-months{',
    '  display:flex !important; gap:8px !important; flex-wrap:nowrap !important;',
    '  overflow-x:auto !important; overflow-y:hidden !important;',
    '  -webkit-overflow-scrolling:touch;',
    '  scrollbar-width:none; -ms-overflow-style:none;',
    '  margin:0 !important; padding:2px 0 4px !important;',
    '  min-width:0 !important; max-width:100% !important; width:100% !important;',
    '  box-sizing:border-box !important;',
    '}',
    '.bj-bb-inner-merged .bb-months::-webkit-scrollbar{ display:none }',
    '.bj-bb-inner-merged .bb-month-pill{',
    '  flex:0 0 auto !important; min-width:120px !important;',
    '  padding:10px 12px !important;',
    '  border:1px solid #dfdfdf !important; border-radius:10px !important;',
    '  background:#fafafa !important;',
    '  display:flex !important; flex-direction:column !important;',
    '  align-items:center !important; gap:2px !important; cursor:pointer !important;',
    '  transition:border-color 0.15s, background 0.15s !important;',
    '}',
    '.bj-bb-inner-merged .bb-month-pill:hover,',
    '.bj-bb-inner-merged .bb-month-pill.active{',
    '  border-color:#0838F8 !important; background:#eff3ff !important;',
    '}',
    '.bj-bb-inner-merged .bb-month-period{ font-size:11px; color:#666; font-weight:500 }',
    '.bj-bb-inner-merged .bb-month-price{ font-size:14px; font-weight:700; color:#0838F8 }',
    /* 버튼 행 — 3버튼 가로 균등 분배 */
    '.bj-bb-inner-merged .bb-right-top{',
    '  display:flex !important; gap:8px !important; margin:0 !important;',
    '  width:100% !important;',
    '}',
    '.bj-bb-inner-merged .bb-right-top .bb-btn{',
    '  flex:1 1 0 !important; min-width:0 !important;',
    '  justify-content:center !important;',
    '}',
    /* 장바구니는 비교적 좁게 */
    '.bj-bb-inner-merged .bb-right-top .bb-btn-cart{ flex:0 0 auto !important; min-width:84px !important }',
    /* 모바일 ≤600px — 약정 pill·버튼 폰트 축소 */
    '@media (max-width:600px){',
    '  .bj-bb-inner-merged{ padding:12px 14px 14px !important; gap:10px !important }',
    '  .bj-bb-inner-merged .bb-month-pill{ padding:8px 10px !important; min-width:100px !important }',
    '  .bj-bb-inner-merged .bb-month-period{ font-size:10.5px }',
    '  .bj-bb-inner-merged .bb-month-price{ font-size:13px }',
    '  .bj-bb-inner-merged .bb-right-top{ gap:6px !important }',
    '  .bj-bb-inner-merged .bb-right-top .bb-btn{ font-size:12px !important; padding:9px 8px !important }',
    '  .bj-bb-inner-merged .bb-right-top .bb-btn-cart{ min-width:68px !important }',
    '}',

    /* 렌탈+사은품 신청 버튼 */
    '.bb-btn-rent.bj-btn-rent-gift{',
    '  background:#0838F8 !important; color:#fff !important;',
    '  border:none !important;',
    '  display:inline-flex !important; align-items:center !important; gap:6px !important;',
    '  font-weight:700 !important;',
    '}',
    '.bb-btn-rent.bj-btn-rent-gift svg{ width:18px; height:18px; fill:currentColor }',

    /* 상담신청 버튼 */
    '.bj-btn-consult{',
    '  background:#fff !important; color:#0838F8 !important;',
    '  border:1px solid #0838F8 !important;',
    '  border-radius:8px !important; padding:10px 14px !important;',
    '  font-weight:700 !important; font-size:13.5px !important;',
    '  cursor:pointer !important;',
    '  display:inline-flex !important; align-items:center !important; gap:6px !important;',
    '  font-family:"Pretendard",sans-serif !important;',
    '  transition:background 0.15s;',
    '}',
    '.bj-btn-consult:hover{ background:#e8edff !important }',
    '.bj-btn-consult svg{ width:18px; height:18px; fill:currentColor }',

    /* v0.4.0: fallback 박스 — .bb-inner 없을 때 위젯 자체 콘텐츠
       v0.5.37: 위아래 padding + gap 축소 */
    '.bj-bar-fallback{',
    '  padding:8px 18px 10px !important;',
    '  display:flex !important; align-items:center !important;',
    '  justify-content:space-between !important; gap:8px !important;',
    '  flex-wrap:wrap !important;',
    '  font-family:"Pretendard","Apple SD Gothic Neo",sans-serif !important;',
    '}',
    '.bj-fb-info{ display:flex; flex-direction:column; gap:2px; flex:0 1 auto; min-width:0 }',
    /* v0.5.25: 옵션 select wrapper 박스 — fallback 위젯 안에 라벨+드롭다운 명확 노출 */
    '.bj-fb-option-box{',
    '  display:flex !important; flex-direction:row !important;',
    '  align-items:center !important; gap:8px !important;',
    /* v0.5.37: 위아래 padding 축소 + margin 축소 */
    '  margin:0 0 4px !important; padding:5px 10px !important;',
    '  background:#f7f9ff !important;',
    '  border:1px solid #d6e0fb !important; border-radius:8px !important;',
    '  width:100% !important; flex:1 1 100% !important;',
    '  font-family:Pretendard,sans-serif !important;',
    '}',
    '.bj-fb-option-label{',
    '  font-size:12.5px !important; font-weight:700 !important; color:#0838F8 !important;',
    '  flex:0 0 auto !important; white-space:nowrap !important;',
    '}',
    '.bj-fb-option-box .bb-option-select,',
    '.bj-fb-option-box .option_select{',
    '  flex:1 1 auto !important; margin:0 !important;',
    '  width:auto !important; min-width:120px !important;',
    '}',
    '@media (max-width:600px){',
    '  .bj-fb-option-box{ padding:7px 10px !important; gap:8px !important }',
    '  .bj-fb-option-label{ font-size:12px !important }',
    '  .bj-fb-option-box .bb-option-select,',
    '  .bj-fb-option-box .option_select{ font-size:12px !important; min-width:100px !important; padding:7px 28px 7px 10px !important }',
    /* v0.5.61: 모바일에서 .rec-p-level-N을 .rec-p-title 안 inline 배치 (JS DOM 이동 후) */
    '  #ai-card-root .rec-p-title{',
    '    display:flex !important; align-items:center !important;',
    '    gap:8px !important; flex-wrap:wrap !important;',
    '  }',
    '  #ai-card-root .rec-p-title [class^="rec-p-level"],',
    '  #ai-card-root .rec-p-title [class*=" rec-p-level"]{',
    '    flex:0 0 auto !important;',
    '  }',
    '}',
    '.bj-fb-label{ font-size:11.5px; color:#6a6a6a; font-weight:600 }',
    '.bj-fb-price{ font-size:17px; font-weight:800; color:#0838F8; line-height:1.2 }',
    /* v0.5.26: 3버튼 풀폭 stretch — 위젯 가로 폭을 균등 분배
       v0.5.37: 위 margin + 버튼 위아래 padding 축소 */
    '.bj-fb-btns{',
    '  display:flex !important; align-items:stretch !important; gap:8px !important;',
    '  flex:1 1 100% !important; flex-wrap:nowrap !important;',
    '  width:100% !important; justify-content:stretch !important;',
    '  margin-top:4px !important;',
    '}',
    '.bj-fb-btns .bb-btn{',
    '  flex:1 1 0 !important;',
    '  display:inline-flex !important; align-items:center !important; justify-content:center !important; gap:6px !important;',
    '  padding:8px 8px !important; font-size:13px !important; font-weight:700 !important;',
    '  border-radius:8px !important; cursor:pointer !important;',
    '  font-family:"Pretendard",sans-serif !important;',
    '  border:1px solid #dfdfdf; background:#fff; color:#2a2a2a;',
    '  transition:background 0.15s; white-space:nowrap;',
    '}',
    /* 렌탈+사은품(주 액션)을 살짝 더 넓게 */
    '.bj-fb-btns .bb-btn-rent,',
    '.bj-fb-btns .bj-btn-rent-gift{ flex:1.5 1 0 !important }',
    '.bj-fb-btns .bb-btn svg{ width:16px; height:16px; fill:currentColor }',
    '.bj-fb-btns .bb-btn-cart{ background:#fff; color:#444; border:1px solid #dfdfdf }',
    '.bj-fb-btns .bb-btn-cart:hover{ background:#f4f4f4 }',
    '@media (max-width:600px){',
    /* v0.5.37: 모바일도 위아래 padding 축소 */
    '  .bj-bar-fallback{ padding:6px 12px 8px !important; gap:6px !important }',
    '  .bj-fb-label{ font-size:11px }',
    '  .bj-fb-price{ font-size:15.5px }',
    '  .bj-fb-btns{ gap:6px; width:100%; justify-content:stretch }',
    '  .bj-fb-btns .bb-btn{ padding:7px 11px; font-size:12.5px; flex:1 1 auto; justify-content:center }',
    '  .bj-fb-btns .bb-btn-cart{ flex:0 0 auto; min-width:60px }',
    '}',
    '@media (max-width:400px){',
    '  .bj-fb-btns .bb-btn{ padding:6px 8px; font-size:11.5px }',
    '  .bj-fb-btns .bb-btn svg{ width:14px; height:14px }',
    '}',

    /* v0.5.47: 만기 후 소유권 이전 chip — 반납 조건 아닌 제품에 자동 추가
       v0.5.53: 모든 .rt-r 사이 통일 dashed (PC도 모바일과 동일). ownership row만의
       노란 #f0e5b8 차별화 폐기 → 회색 #c8cdd6으로 통일감 우선. */
    /* v0.5.58: rental-terms 모든 row 간 dashed 분리선 제거 — 시각 깔끔함 우선.
       row 사이 spacing은 .rental-terms gap (rt-r default flex gap)으로 처리. */
    '#ai-card-root .rental-terms .bj-ownership-row{',
    '  display:flex !important; align-items:center !important;',
    '  justify-content:space-between !important;',
    '}',
    '#ai-card-root .rental-terms .bj-ownership-row .rt-l{',
    '  color:#555 !important; font-weight:600 !important;',
    '}',
    '#ai-card-root .rental-terms .bj-ownership-chip{',
    '  display:inline-block !important;',
    '  background:#ffd000 !important; color:#3a2a00 !important;',
    '  padding:5px 12px !important; border-radius:6px !important;',
    '  font-weight:800 !important; font-size:12.5px !important;',
    '  font-family:Pretendard,sans-serif !important;',
    '  letter-spacing:0.2px !important; line-height:1.3 !important;',
    '  box-shadow:0 1px 3px rgba(255,208,0,0.35) !important;',
    '}',
    '#ai-card-root .rental-terms .bj-ownership-chip::before{',
    '  content:"✓ "; font-weight:700;',
    '}',
    '@media (max-width:600px){',
    /* v0.5.58: 모바일 chip 컴팩트만 유지 (dashed 분리선은 PC·모바일 모두 폐기). */
    '  #ai-card-root .rental-terms .bj-ownership-chip{',
    '    font-size:12px !important; padding:2px 8px !important;',
    '    box-shadow:none !important;',
    '  }',
    '}',

    /* body 하단 패딩 — fixed 위젯이 마지막 콘텐츠 가리지 않게
       v0.5.37: collapsed 높이 축소에 맞춰 padding-bottom 동기 축소 */
    'body{ padding-bottom:72px !important }',

    /* v0.5.42: 빌리조 quick-call/top floating 버튼(.new-qb, .goTop)을 위젯과 겹치지 않게
       위로 올림. :has()로 wrapper 상태 추적해서 collapsed/expanded/dismiss 자동 조정. */
    '.new-qb, .goTop{',
    '  bottom:60px !important;',  /* collapsed 48px + 12px 여백 */
    '  transition:bottom 0.32s cubic-bezier(0.4, 0, 0.2, 1) !important;',
    '}',
    'body:has(.prod_view_bot.card.mt40.bj-bar-expanded) .new-qb,',
    'body:has(.prod_view_bot.card.mt40.bj-bar-expanded) .goTop{',
    '  bottom:calc(min(440px, 75vh) + 12px) !important;',  /* expanded max-height + 여백 */
    '}',
    'body:has(.prod_view_bot.card.mt40.bj-bar-slide-hidden) .new-qb,',
    'body:has(.prod_view_bot.card.mt40.bj-bar-slide-hidden) .goTop{',
    '  bottom:12px !important;',  /* dismiss 시 원래 위치 */
    '}',

    /* 모바일 컴팩트 */
    '@media (max-width:600px){',
    '  body{ padding-bottom:64px !important }',
    /* v0.5.42: 모바일 collapsed 44px + 12px 여백 */
    '  .new-qb, .goTop{ bottom:56px !important }',
    /* v0.5.37: 모바일 핸들도 위아래 padding 축소 */
    '  .bj-bar-handle{ padding:11px 14px 5px }',
    '  .bj-bar-handle-text{ font-size:12px }',
    '  .bj-bar-handle-price{ font-size:13px }',
    '  .bj-bar-handle-option{ font-size:11px !important; padding:2px 8px !important; max-width:90px; margin-left:6px !important }',
    '  .bj-bar-handle-toggle{ width:34px; height:22px; font-size:12px }',
    '  .prod_view_bot.card.mt40 .bb-inner{ padding:8px 14px !important }',
    '  .bj-btn-consult{ padding:7px 11px; font-size:12.5px }',
    '  .bb-btn-rent.bj-btn-rent-gift{ font-size:13px }',
    '  .prod_view_bot.card.mt40.bj-bar-collapsed{ max-height:44px !important }',
    '}',

    /* === v0.3.4: 카드 너비 확장 (.wide-inner 1480px) === */
    '#container .wide-inner{',
    '  max-width:1480px !important; width:100% !important;',
    '  margin:0 auto !important;',
    '  padding-left:24px !important; padding-right:24px !important;',
    '  box-sizing:border-box !important;',
    '}',
    '@media (max-width:1023px){',
    '  #container .wide-inner{ padding-left:16px !important; padding-right:16px !important }',
    '}',
    '@media (max-width:600px){',
    '  #container .wide-inner{ padding-left:10px !important; padding-right:10px !important }',
    '}',

    /* === v0.3.3: 비교표 flexbox overflow 안전 (AI 카드 존재 시) === */
    '#ai-card-root .spec-compare .spec-row{',
    '  min-width:0; max-width:100%; box-sizing:border-box;',
    '}',
    '#ai-card-root .spec-compare .spec-detail-toggle[open]{',
    '  min-width:0; max-width:100%; box-sizing:border-box;',
    '}',
    '#ai-card-root .filter-table-wrap{',
    '  min-width:0; max-width:100%; width:100%; box-sizing:border-box;',
    '  -webkit-overflow-scrolling:touch;',
    '}',
    '@media (max-width:600px){',
    '  #ai-card-root .step-details{ padding-left:14px !important; padding-right:0 !important }',
    '  #ai-card-root .spec-compare .spec-detail-toggle[open]{',
    '    margin-left:-6px; margin-right:-6px;',
    '  }',
    '  #ai-card-root .filter-table{',
    '    font-size:11px !important; min-width:280px !important;',
    '  }',
    '  #ai-card-root .filter-table th, #ai-card-root .filter-table td{ padding:6px 3px !important }',
    '  #ai-card-root .filter-table thead th{',
    '    font-size:10.5px !important; white-space:normal; line-height:1.3;',
    '  }',
    '  #ai-card-root .filter-table tbody th{ font-size:10.5px !important }',
    '  #ai-card-root .filter-table thead th.ft-on small,',
    '  #ai-card-root .filter-table thead th.ft-na small{ font-size:8.5px !important }',
    '}',
    '@media (max-width:360px){',
    '  #ai-card-root .filter-table{ min-width:260px !important; font-size:10.5px !important }',
    '  #ai-card-root .filter-table th, #ai-card-root .filter-table td{ padding:5px 2px !important }',
    '}',

    /* === v0.3.4: SLOT 7 (.gift-r) 모바일 column 레이아웃 + 한글 자연 줄바꿈 === */
    '#ai-card-root .gift-r{ align-items:flex-start; flex-wrap:wrap }',
    '#ai-card-root .gift-v{ word-break:keep-all }',
    '#ai-card-root .gift-v strong{ word-break:keep-all }',
    '@media (max-width:600px){',
    '  #ai-card-root .gift{ padding:10px 12px !important }',
    '  #ai-card-root .gift-r{',
    '    flex-direction:column !important; align-items:flex-start !important;',
    '    gap:6px !important; padding:10px 0 !important;',
    '  }',
    '  #ai-card-root .gift-r + .gift-r{',
    '    border-top:0.5px dashed #dfdfdf; margin-top:2px;',
    '  }',
    '  #ai-card-root .gift-v{',
    '    text-align:left !important; width:100%; font-size:16px !important; line-height:1.6 !important;',
    '    padding-left:10px !important;',  /* 뱃지 글자(좌측 padding 10px)와 좌측 정렬 */
    '  }',
    '  #ai-card-root .gift-db{ padding-left:10px !important }',  /* 지원금 값도 뱃지 글자에 맞춰 정렬 */
    '  #ai-card-root .gift-tag{ font-size:16px !important }',
    '}',
    /* v0.6.7: 지원금 섹션 값(gift-v 전체·강조)도 파란색으로 통일 — 가독성+포인트 */
    '#ai-card-root .gift-v, #ai-card-root .gift-v strong{ color:#0838f8 !important }',
    /* v0.6.4: .gift-tag 뱃지 — 파란 배경 + 흰 글씨 */
    '#ai-card-root .gift-tag{ background:#0838f8 !important; color:#fff !important }',

    /* v0.6.8: [예시 A] 섹션 헤더 아이콘 칩 + 페르소나 인라인 SVG 아이콘 */
    '#ai-card-root .sec-t.bj-sx-done{ display:flex !important; align-items:center }',
    '#ai-card-root .bj-sx-ic{ width:26px; height:26px; border-radius:8px; background:#e8edff; color:#0838f8; display:inline-flex; align-items:center; justify-content:center; margin-right:8px; flex:0 0 auto }',
    '#ai-card-root .bj-sx-ic svg{ width:17px; height:17px; display:block }',
    '#ai-card-root .bj-persona-ic{ width:40px; height:40px; border-radius:50%; background:#e8edff; color:#0838f8; display:inline-flex; align-items:center; justify-content:center; flex:0 0 auto }',
    '#ai-card-root .bj-persona-ic svg{ width:22px; height:22px; display:block }',

    /* v0.6.9: 긴 문장 2줄 클램프 + 더보기 토글 */
    '#ai-card-root .bj-clamp{ display:-webkit-box !important; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden }',
    '#ai-card-root .bj-clamp.bj-lc3{ -webkit-line-clamp:3 }',
    '#ai-card-root .bj-clamp.bj-clamp-open{ -webkit-line-clamp:unset !important; display:block !important; overflow:visible }',
    '#ai-card-root .bj-more{ display:inline-block; margin-top:3px; background:none; border:0; padding:0; color:#0838f8; font-weight:700; font-size:12px; cursor:pointer; font-family:Pretendard,sans-serif }',

    /* === v0.6.2: 글씨 크기 조절 컨트롤 — 우측 퀵버튼(.link) 묶음 위에 세로 스타일로 배치 === */
    '.new-qb .quick .link #bj-fs-ctrl{ display:flex; justify-content:center; margin:0 0 8px 0 }',
    '#bj-fs-ctrl .bj-fs-inner{ display:flex; flex-direction:column; align-items:center; gap:5px; background:#fff; border:1px solid #e6e8ee; border-radius:16px; padding:7px 5px; box-shadow:0 2px 8px rgba(0,0,0,.12) }',
    '#bj-fs-ctrl .bj-fs-lab{ font-size:10px; font-weight:700; color:#8a909a; line-height:1; letter-spacing:-0.3px }',
    '#bj-fs-ctrl .bj-fs-btn{ display:inline-flex; align-items:center; justify-content:center; width:34px; height:34px; padding:0; border:0; background:#f2f5ff; color:#0838f8; cursor:pointer; border-radius:50%; line-height:1; transition:background .12s, transform .1s }',
    '#bj-fs-ctrl .bj-fs-btn svg{ width:21px; height:21px; display:block }',
    '#bj-fs-ctrl .bj-fs-btn:hover{ background:#e0e8ff }',
    '#bj-fs-ctrl .bj-fs-btn:active{ transform:scale(.9) }',
    '#bj-fs-ctrl .bj-fs-btn[disabled]{ color:#cfd3db; background:#f5f6f8; cursor:default }',

    /* === v0.6.6: AI 카드 본문·제목·라벨·값 전체를 지원금 섹션과 동일한 16px base로 통일 ===
       → 글씨조절 버튼(±1px)으로 키우거나 줄여도 전 섹션 크기가 함께 움직여 통일감 유지.
       폭/패딩은 건드리지 않고 font-size만 (모바일 가로 넘침 방지, 룰북 #32). */
    '#ai-card-root .gift-tag, #ai-card-root .gift-v, #ai-card-root .gift-r, #ai-card-root .gift-db,'
      + ' #ai-card-root .sec-t, #ai-card-root .a-head, #ai-card-root .a-body, #ai-card-root .sv, #ai-card-root .sl,'
      + ' #ai-card-root .step-h, #ai-card-root .step-title, #ai-card-root .step-sum, #ai-card-root .rv-photos-tit, #ai-card-root .rv-text,'
      + ' #ai-card-root .meta, #ai-card-root .field-l, #ai-card-root .ml, #ai-card-root .model-num,'
      + ' #ai-card-root .rt-l, #ai-card-root .rt-r, #ai-card-root .rt-v, #ai-card-root .help, #ai-card-root .help summary,'
      + ' #ai-card-root .rec-p-title, #ai-card-root .p-d, #ai-card-root .lbl,'
      + ' #ai-card-root .rv-meta, #ai-card-root .rv-persona, #ai-card-root .rv-fallback, #ai-card-root .bj-lpt-note'
      + '{ font-size:16px !important }',
    '#ai-card-root .gift-tag, #ai-card-root .gift-v, #ai-card-root .gift-r, #ai-card-root .gift-db{ line-height:1.45 !important }',
    /* 장식용 태그/뱃지/칩/레벨 — 본문보다 작게 유지(12px) */
    '#ai-card-root .grade-badge, #ai-card-root .strength-chip, #ai-card-root .pill, #ai-card-root .feat-btn, #ai-card-root .step-n, #ai-card-root .rec-p-level-1, #ai-card-root .rec-p-level-2{ font-size:12px !important }',
    /* 별점 / 후기 출처 푸터 */
    '#ai-card-root .rv-stars, #ai-card-root .st{ font-size:15px !important }',
    '#ai-card-root .rv-foot, #ai-card-root .rv-author{ font-size:10.5px !important }',

    /* === v0.5.0: .help-pop ⓘ 툴팁 — 전 페이지 어디서든 viewport 안에 들어오게 강제 ===
       (이전 v0.3.5는 #ai-card-root 스코프 한정 + max-width:600px만 sheet 전환 → 601~900px에서 새는 문제 해결) */
    /* 데스크탑(≥901px) — absolute 위치 유지하되 viewport 폭에 안전하게 clamp
       v0.5.10: JS 위치 보정 (setupHelpClose에서 transform 조정) 시 부드럽게 슬라이드되도록 transition */
    '.help-pop, #ai-card-root .help-pop{',
    '  max-width:min(280px, calc(100vw - 24px)) !important;',
    /* v0.5.49: 빌리조 페이지에서 .help-pop이 white-space:nowrap을 상속받아 텍스트가
       한 줄로 펼쳐지는 문제. normal로 강제 + overflow-wrap:anywhere로 긴 단어도 wrap 보장. */
    '  white-space:normal !important;',
    '  word-break:keep-all !important;',
    '  overflow-wrap:anywhere !important;',
    '  box-sizing:border-box !important;',
    '  transition:transform 0.12s ease-out;',
    '}',
    /* 좁은 화면(≤900px) — 항상 viewport bottom-sheet로 전환 (이전 600px → 900px 확대) */
    '@media (max-width:900px){',
    '  .help-pop, #ai-card-root .help-pop{',
    '    position:fixed !important;',
    '    left:12px !important; right:12px !important;',
    '    top:auto !important; bottom:96px !important;',
    '    transform:none !important;',
    '    width:auto !important; max-width:none !important;',
    '    padding:14px 16px !important;',
    '    font-size:13px !important; line-height:1.65 !important;',
    /* v0.5.49: 모바일에서도 white-space:normal 명시 (specificity 안전) */
    '    white-space:normal !important;',
    '    overflow-wrap:anywhere !important;',
    '    border-radius:10px !important;',
    '    box-shadow:0 -8px 24px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05) !important;',
    '    z-index:100000 !important;',
    '    animation:bjHelpPopIn 0.2s ease-out;',
    '  }',
    '  .help[open] .help-pop::after, #ai-card-root .help[open] .help-pop::after{',
    '    content:"화면 아무 곳을 눌러도 닫혀요";',
    '    display:block;',
    '    margin-top:10px; padding-top:10px;',
    '    border-top:0.5px dashed #dfdfdf;',
    '    font-size:11px; color:#999;',
    '    text-align:center;',
    '  }',
    '}',
    '@keyframes bjHelpPopIn{',
    '  from{ opacity:0; transform:translateY(20px) }',
    '  to{ opacity:1; transform:translateY(0) }',
    '}',

    /* v0.5.14: fallback과 격상 안 된 .bb-inner가 공존 시 .bb-inner 안전망 숨김 */
    '.prod_view_bot.card.mt40 .bj-bar-fallback ~ .bb-inner,',
    '.prod_view_bot.card.mt40 .bj-bar-fallback + .bb-inner{',
    '  display:none !important;',
    '}',

    /* === v0.5.11: 빌리조 원본 2버튼 sticky 위젯(.prod_fix_wrap) 제거 ===
       우리 v0.5.x 위젯(.prod_view_bot.card.mt40 → fixed bottom)과 중복으로 떠 있어
       사용자 혼란 발생. 빌리조 원본 [장바구니][렌탈신청] 2버튼 sticky bar를 완전 숨김.
       PC: .prod_fix_wrap.prod_fix
       모바일: .prod_fix_wrap.prod_fix_m */
    '.prod_fix_wrap,',
    '.prod_fix_wrap.prod_fix,',
    '.prod_fix_wrap.prod_fix_m{',
    '  display:none !important;',
    '  visibility:hidden !important;',
    '  pointer-events:none !important;',
    '  height:0 !important;',
    '  overflow:hidden !important;',
    '}',

    /* === v0.5.24: 빌리조 main inject.js의 #billyjo-bottom-bar 위젯 자체 즉시 hide ===
       DOM 삭제 직전 paint frame 차단. JS에서 removeChild로 완전 제거. */
    'body > #billyjo-bottom-bar,',
    '#billyjo-bottom-bar:not(.bj-ours-keep){',
    '  display:none !important;',
    '  visibility:hidden !important;',
    '  pointer-events:none !important;',
    '  height:0 !important; overflow:hidden !important;',
    '  transform:translateY(200px) !important;',
    '}',

    /* === v0.5.22: 격상 안 된 .bb-inner는 어디에 있든 무조건 숨김 ===
       빌리조 main inject.js가 .bb-inner를 wrapper(.prod_view_bot.card.mt40) 안/밖 어디든
       동적 mount. 우리 enhanceBottomBar가 격상하면 .bj-bb-inner-merged 클래스 부착 → 보임.
       격상 안 된 .bb-inner는 무조건 hide → wrapper 위치·timing 무관하게 안전. */
    'body .bb-inner:not(.bj-bb-inner-merged){',
    '  display:none !important;',
    '  visibility:hidden !important;',
    '  pointer-events:none !important;',
    '  height:0 !important; overflow:hidden !important;',
    '}',

    /* === v0.5.20: 업소용 카테고리(prod_list/10-1153) 노출 복원 ===
       빌리조 main inject.js가 prod_list/10-* 일괄 숨김 처리 중. 우리가 메인 1153만 다시 노출.
       cascade 후순(detailcard가 inject보다 늦게 로드) + 같은 specificity로 override. */
    '.category__wrap a[href*="prod_list/10-1153"],',
    '.gnb__menu a[href*="prod_list/10-1153"],',
    'ul.all__depth1 a[id="10"],',
    'li.gnb__menu:has(> a[href*="prod_list/10-1153"]),',
    '.menu__gsnb a[href*="prod_list/10-1153"],',
    '.aside_sub a[href*="prod_list/10-1153"]{',
    '  display:revert !important; visibility:visible !important;',
    '}'
  ].join('\n');

  function injectCSS(){
    if (document.getElementById('bj-detailcard-patch')) return;
    var style = document.createElement('style');
    style.id = 'bj-detailcard-patch';
    style.textContent = CSS;
    (document.head || document.documentElement).appendChild(style);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 2) JS 시밍 — inject.js 결과 DOM 후처리
  // ─────────────────────────────────────────────────────────────────────────

  /* (a) 헤더 — bj-ready 강제 + leftGroup/rightGroup 안정 클래스 + 이벤트 링크 원복 */
  function tagHeaderDom(){
    var header = document.querySelector('header.new-header');
    if (!header) return;
    if (!header.classList.contains('bj-ready')) header.classList.add('bj-ready');
    var firstRow = header.firstElementChild;
    if (firstRow && firstRow.tagName === 'DIV' && !firstRow.classList.contains('bj-inj-row')) {
      var inlineCss = (firstRow.getAttribute('style') || '').replace(/\s+/g,'');
      if (inlineCss.indexOf('display:flex') >= 0 && inlineCss.indexOf('padding:28px') >= 0) {
        firstRow.classList.add('bj-inj-row');
        Array.prototype.forEach.call(firstRow.children, function(c){
          var s = (c.getAttribute('style') || '').replace(/\s+/g,'');
          if (s.indexOf('margin-left:auto') >= 0) c.classList.add('bj-inj-right');
          else c.classList.add('bj-inj-left');
        });
      }
    }
    restoreMobileEventLink();
  }

  function restoreMobileEventLink(){
    var banner = document.getElementById('bj-top-banner');
    if (!banner) return;
    var iconList = document.getElementById('bj-header-icons')
      || document.querySelector('ul.inline_wrap.header_m_icon');
    if (!iconList) { banner.remove(); return; }
    var bannerA = banner.querySelector('a');
    if (!bannerA) { banner.remove(); return; }
    var href = bannerA.getAttribute('href') || '';
    if (iconList.querySelector('a[href="' + href.replace(/"/g,'') + '"]')) {
      banner.remove(); return;
    }
    var li = document.createElement('li');
    var a = document.createElement('a');
    a.href = href;
    a.setAttribute('style', 'background-color:#ff3700;color:#fff;font-size:11px;font-weight:bold;padding:5px;border-radius:5px;');
    a.textContent = bannerA.textContent.trim();
    li.appendChild(a);
    iconList.insertBefore(li, iconList.firstChild);
    banner.remove();
  }

  /* (b) 하단 위젯 — CSS specificity 안전망 + 핸들 + 버튼 격상 */
  function forceFixedStyle(wrapper){
    /* v0.5.3: display:block 강제 — billyjo underlying의 display:none override */
    /* v0.7.2: 수평 위치(left/right)는 인라인에서 제거 — 인라인 left:0!important가
       PC 중앙정렬 미디어쿼리(left:50%!important)를 덮어써 위젯이 좌측에 쏠리던 버그.
       수평은 스타일시트가 담당(모바일 base left:0/right:0, ≥1024px left:50% 중앙). */
    wrapper.style.cssText = (wrapper.style.cssText || '') +
      ';display:block!important;position:fixed!important;bottom:0!important;' +
      'z-index:99999!important;margin:0!important;';
  }

  /* v0.5.69: 상담신청 modal — 4자리 코드 + 상담사 직통번호 안내 + 통화 연결.
     admin2 backend endpoint 준비 시 window.__bjConsultApiUrl 설정으로 fetch 교체, 그 전엔 mock. */
  /* v0.5.72: 페이지 로드 시 admin2 warmup ping (cold start 회피).
     '/health'는 매우 가벼운 endpoint — 첫 user click 전에 lambda 깨워둠. */
  function warmupAdmin2(){
    if (window.__bjAdmin2Warmed) return;
    window.__bjAdmin2Warmed = true;
    var base = window.__bjConsultApiUrl || 'https://admin2-api.billyjo.co.kr';
    try { fetch(base + '/health', { method: 'GET', mode: 'cors' }).catch(function(){}); } catch(_){}
    try { bjFetchPersonaForm(); } catch(_){}   // 페르소나 폼 미리 받아두기(위저드 지연 제거)
  }

  /* ── 고객 페르소나 위저드 (admin2 단일 소스 폼) ────────────────────────────
     admin2 /v1/persona/form 에서 폼 정의를 받아 동일 렌더 → 답변을 quick-assign
     personaInput 으로 전송. + 광고 URL의 utm_* 를 명시 전송(서버 Referer 폴백 보강).
     상담 연결 직전 1회 노출, 건너뛰기 가능(절대 막지 않음).
     비활성화: window.__bjPersonaWizardEnabled = false */
  var BJ_PERSONA_FORM_CACHE = null;
  function bjPersonaBase(){ return window.__bjConsultApiUrl || 'https://admin2-api.billyjo.co.kr'; }

  function bjReadUtm(){
    try {
      var q = new URLSearchParams(location.search), o = {}, ks = ['source','medium','campaign','content','term'];
      for (var i = 0; i < ks.length; i++){ var v = q.get('utm_' + ks[i]); if (v) o[ks[i]] = v; }
      return Object.keys(o).length ? o : null;
    } catch(_){ return null; }
  }
  function bjGetPersonaInput(){
    if (window.__bjPersonaInput) return window.__bjPersonaInput;
    try { var s = sessionStorage.getItem('bj_persona_input'); if (s){ window.__bjPersonaInput = JSON.parse(s); return window.__bjPersonaInput; } } catch(_){}
    return null;
  }
  function bjSetPersonaInput(obj){
    window.__bjPersonaInput = obj;
    try { sessionStorage.setItem('bj_persona_input', JSON.stringify(obj)); } catch(_){}
  }
  /* 두 quick-assign 페이로드에 utm + personaInput 첨부 (있을 때만) */
  function bjConsultExtras(body){
    try { var utm = bjReadUtm(); if (utm) body.utm = utm; } catch(_){}
    try { var pi = bjGetPersonaInput(); if (pi) body.personaInput = pi; } catch(_){}
    return body;
  }
  function bjFetchPersonaForm(){
    if (BJ_PERSONA_FORM_CACHE) return Promise.resolve(BJ_PERSONA_FORM_CACHE);
    return fetch(bjPersonaBase() + '/v1/persona/form', { mode: 'cors' })
      .then(function(r){ return r.json(); })
      .then(function(d){ BJ_PERSONA_FORM_CACHE = (d && d.fields) || []; return BJ_PERSONA_FORM_CACHE; })
      .catch(function(){ return []; });
  }
  /* 상담 진입 전 게이트 — 미수집·미스킵·활성 상태면 위저드, 아니면 즉시 proceed */
  function bjPersonaNeedsGate(){
    return window.__bjPersonaWizardEnabled !== false && !bjGetPersonaInput() && !window.__bjPersonaSkipped;
  }
  function bjPersonaGate(proceed){
    if (!bjPersonaNeedsGate()){ proceed(); return; }
    bjFetchPersonaForm().then(function(fields){
      if (!fields || !fields.length){ window.__bjPersonaSkipped = true; proceed(); return; }
      bjShowPersonaWizard(fields, function(answers){
        if (answers && Object.keys(answers).length) bjSetPersonaInput(answers);
        else window.__bjPersonaSkipped = true;
        proceed();
      });
    });
  }
  function bjInjectPersonaStyles(){
    if (document.getElementById('bjpw-style')) return;
    var s = document.createElement('style'); s.id = 'bjpw-style';
    s.textContent =
      '.bjpw-back{position:fixed;inset:0;background:rgba(17,17,17,.55);z-index:100000;display:flex;align-items:center;justify-content:center;padding:16px}' +
      '.bjpw-box{background:#fff;border-radius:18px;max-width:420px;width:100%;max-height:86vh;overflow:auto;padding:20px 18px 16px;box-shadow:0 18px 50px rgba(0,0,0,.25);font-family:inherit}' +
      '.bjpw-h{font-size:17px;font-weight:800;color:#1a1a1a}.bjpw-sub{font-size:12px;color:#888;margin:3px 0 14px}' +
      '.bjpw-f{margin-bottom:16px}.bjpw-l{font-size:13.5px;font-weight:700;color:#333}.bjpw-l b{color:#e0492a}' +
      '.bjpw-hint{font-size:11px;color:#aaa;margin:2px 0 7px}' +
      '.bjpw-opts{display:flex;flex-wrap:wrap;gap:7px}' +
      '.bjpw-chip{font-size:12.5px;padding:7px 13px;border-radius:999px;border:1.5px solid #e6e6e6;background:#fff;color:#555;cursor:pointer;transition:.12s}' +
      '.bjpw-chip.on{border-color:#e0492a;background:#fff1ec;color:#c43c20;font-weight:700}' +
      '.bjpw-ta{width:100%;min-height:58px;border:1.5px solid #e6e6e6;border-radius:12px;padding:9px 11px;font-size:13px;resize:vertical;box-sizing:border-box}' +
      '.bjpw-ft{display:flex;gap:9px;margin-top:6px}' +
      '.bjpw-skip{flex:0 0 auto;background:#f4f4f4;color:#888;border:0;border-radius:12px;padding:11px 14px;font-size:13px;cursor:pointer}' +
      '.bjpw-go{flex:1;background:#e0492a;color:#fff;border:0;border-radius:12px;padding:11px;font-size:14px;font-weight:800;cursor:pointer}' +
      '.bjpw-x{position:absolute;top:10px;right:14px;border:0;background:none;font-size:22px;color:#bbb;cursor:pointer;line-height:1}';
    document.head.appendChild(s);
  }
  function bjShowPersonaWizard(fields, done){
    bjInjectPersonaStyles();
    var sel = {};
    var back = document.createElement('div'); back.className = 'bjpw-back';
    var box = document.createElement('div'); box.className = 'bjpw-box'; box.style.position = 'relative';
    var html = '<button type="button" class="bjpw-x" aria-label="닫기">×</button>' +
      '<div class="bjpw-h">🎯 60초 맞춤 진단</div>' +
      '<div class="bjpw-sub">몇 가지만 알려주시면 상담사가 딱 맞는 제품을 추천해 드려요.</div>';
    for (var i = 0; i < fields.length; i++){
      var f = fields[i];
      html += '<div class="bjpw-f" data-key="' + f.key + '" data-type="' + f.type + '">' +
        '<div class="bjpw-l">' + bjpwEsc(f.label) + (f.required ? ' <b>*</b>' : '') + '</div>' +
        (f.helpText ? '<div class="bjpw-hint">' + bjpwEsc(f.helpText) + '</div>' : '');
      if (f.type === 'text'){
        html += '<textarea class="bjpw-ta" placeholder="자유롭게 입력…"></textarea>';
      } else {
        html += '<div class="bjpw-opts">';
        for (var j = 0; j < (f.options || []).length; j++){
          html += '<button type="button" class="bjpw-chip" data-val="' + bjpwEsc(f.options[j]) + '">' + bjpwEsc(f.options[j]) + '</button>';
        }
        html += '</div>';
      }
      html += '</div>';
    }
    html += '<div class="bjpw-ft"><button type="button" class="bjpw-skip">건너뛰기</button>' +
      '<button type="button" class="bjpw-go">상담 연결</button></div>';
    box.innerHTML = html; back.appendChild(box); document.body.appendChild(back);

    function finish(answers){ try { back.remove(); } catch(_){} done(answers); }
    box.querySelector('.bjpw-x').addEventListener('click', function(){ finish(null); });
    box.querySelector('.bjpw-skip').addEventListener('click', function(){ finish(null); });
    back.addEventListener('click', function(e){ if (e.target === back) finish(null); });

    // 칩 선택 (single=단일, multi=복수)
    Array.prototype.forEach.call(box.querySelectorAll('.bjpw-f'), function(fEl){
      var key = fEl.getAttribute('data-key'), type = fEl.getAttribute('data-type');
      Array.prototype.forEach.call(fEl.querySelectorAll('.bjpw-chip'), function(chip){
        chip.addEventListener('click', function(){
          var val = chip.getAttribute('data-val');
          if (type === 'multi'){
            chip.classList.toggle('on');
            var arr = sel[key] || [];
            var k = arr.indexOf(val);
            if (k >= 0) arr.splice(k, 1); else arr.push(val);
            sel[key] = arr;
          } else {
            Array.prototype.forEach.call(fEl.querySelectorAll('.bjpw-chip'), function(c){ c.classList.remove('on'); });
            chip.classList.add('on'); sel[key] = val;
          }
        });
      });
    });

    box.querySelector('.bjpw-go').addEventListener('click', function(){
      var out = {};
      Array.prototype.forEach.call(box.querySelectorAll('.bjpw-f'), function(fEl){
        var key = fEl.getAttribute('data-key'), type = fEl.getAttribute('data-type');
        if (type === 'text'){
          var t = (fEl.querySelector('.bjpw-ta').value || '').trim();
          if (t) out[key] = t;
        } else if (sel[key] != null && (!Array.isArray(sel[key]) || sel[key].length)){
          out[key] = sel[key];
        }
      });
      finish(out);
    });
  }
  function bjpwEsc(s){ return String(s == null ? '' : s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

  function openConsultModal(){
    if (bjPersonaNeedsGate()){ bjPersonaGate(function(){ openConsultModal(); }); return; }
    var prev = document.getElementById('bj-consult-modal');
    if (prev) prev.remove();
    var modal = document.createElement('div');
    modal.id = 'bj-consult-modal';
    modal.className = 'bj-consult-modal-backdrop';
    modal.innerHTML =
      '<div class="bj-consult-modal-box" role="dialog" aria-label="상담사 배정">' +
        '<button type="button" class="bj-consult-modal-close" aria-label="닫기">×</button>' +
        '<div class="bj-consult-modal-body">' +
          '<div class="bj-consult-title">📞 상담사 배정 중</div>' +
          '<div class="bj-consult-spinner" aria-hidden="true"></div>' +
          '<div class="bj-consult-status">상담사를 연결 중입니다...</div>' +
        '</div>' +
      '</div>';
    document.body.appendChild(modal);
    function close(){ try { modal.remove(); } catch(_){} document.removeEventListener('keydown', onKey); }
    function onKey(e){ if (e.key === 'Escape') close(); }
    modal.addEventListener('click', function(e){
      if (e.target === modal || e.target.classList.contains('bj-consult-modal-close')) close();
    });
    document.addEventListener('keydown', onKey);
    /* v0.5.72: spinner 지연 200ms → 즉시 fetch 시작 (전체 응답시간 단축) */
    setTimeout(function(){
      assignConsultant().then(function(data){
        if (!modal.parentNode) return;
        renderAssignedConsultant(modal, data);
      }).catch(function(err){
        if (!modal.parentNode) return;
        renderAssignError(modal, err);
      });
    }, 200);
  }

  /* v0.5.72: AbortController + 18초 timeout + 1회 retry (cold start 안전망).
     mock fallback 완전 폐기 — admin2 실 응답만 사용. 실패 시 명시적 에러 UI. */
  function _assignFetchOnce(base, body, timeoutMs){
    var ctrl = (typeof AbortController !== 'undefined') ? new AbortController() : null;
    var timer = setTimeout(function(){ if (ctrl) try { ctrl.abort(); } catch(_){} }, timeoutMs);
    var opts = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    };
    if (ctrl) opts.signal = ctrl.signal;
    return fetch(base + '/v1/consult/quick-assign', opts)
      .then(function(r){
        clearTimeout(timer);
        if (!r.ok) {
          return r.text().then(function(t){
            var err = new Error('HTTP ' + r.status);
            err.status = r.status; err.body = t;
            throw err;
          });
        }
        return r.json();
      });
  }

  /* v0.6.5 (2026-06-02): 위젯 selection 스냅샷 — 사용자가 현재 위젯에서 선택한
     공급사/약정/옵션/가격을 백엔드에 전달해 상담사가 통화 시작 전 즉시 파악.
     모든 필드 try/catch 안전망 — DOM 변형돼도 호출 자체는 절대 실패 안 함. */
  function collectConsultSelection(){
    var out = {};
    try {
      var supEl = document.querySelector('.bj-ws-sup-tab.active') ||
                  document.querySelector('.bb-sup-tab.active');
      if (supEl && supEl.textContent) {
        var s = supEl.textContent.replace(/\s+/g, ' ').trim();
        if (s) out.supplier = s.slice(0, 60);
      }
    } catch(_){}
    try {
      var activeTerm = document.querySelector('.bj-ws-term-pill.active') ||
                       document.querySelector('.bb-month-pill.active');
      if (activeTerm) {
        var periodEl = activeTerm.querySelector('.bj-ws-term-period') ||
                       activeTerm.querySelector('.bb-month-period');
        if (periodEl) {
          var nm = (periodEl.textContent || '').match(/(\d+)\s*개월/);
          if (nm) out.contractTermMonths = parseInt(nm[1], 10);
        }
        var priceEl = activeTerm.querySelector('.bj-ws-term-price') ||
                      activeTerm.querySelector('.bb-month-price');
        if (priceEl) {
          var pt = (priceEl.textContent || '').replace(/[^\d]/g, '');
          if (pt) out.displayedMonthlyFee = parseInt(pt, 10);
        }
        var cdEl = activeTerm.querySelector('.bj-ws-term-card-price');
        if (cdEl) {
          var cdt = (cdEl.textContent || '').replace(/[^\d]/g, '');
          if (cdt) {
            out.cardDiscountedPrice = parseInt(cdt, 10);
            out.cardDiscountApplied = true;
          }
        } else if (activeTerm.classList.contains('has-card-dc') || activeTerm.classList.contains('is-best')) {
          out.cardDiscountApplied = true;
        }
      }
    } catch(_){}
    try {
      var optEl = document.querySelector('.bj-option-clone option[selected]') ||
                  document.querySelector('.bj-option-clone option:checked') ||
                  document.querySelector('.option_select option:checked');
      if (optEl && optEl.textContent) {
        var ol = optEl.textContent.replace(/\s+/g, ' ').trim();
        if (ol && ol !== '== 옵션선택 ==' && ol !== '옵션선택') out.optionLabel = ol.slice(0, 120);
      }
    } catch(_){}
    try {
      var pills = document.querySelectorAll('.bj-ws-term-pill');
      if (pills && pills.length) {
        var list = [];
        Array.prototype.forEach.call(pills, function(p){
          var row = {};
          if (out.supplier) row.supplier = out.supplier;
          var pe = p.querySelector('.bj-ws-term-period');
          if (pe) {
            var pm = (pe.textContent || '').match(/(\d+)\s*개월/);
            if (pm) row.termMonths = parseInt(pm[1], 10);
          }
          var pr = p.querySelector('.bj-ws-term-price');
          if (pr) {
            var prt = (pr.textContent || '').replace(/[^\d]/g, '');
            if (prt) row.monthly = parseInt(prt, 10);
          }
          var pc = p.querySelector('.bj-ws-term-card-price');
          if (pc) {
            var pct = (pc.textContent || '').replace(/[^\d]/g, '');
            if (pct) row.cardDiscounted = parseInt(pct, 10);
          }
          if (row.termMonths || row.monthly) list.push(row);
        });
        if (list.length) out.listSnapshot = list.slice(0, 12);
      }
    } catch(_){}
    return Object.keys(out).length ? out : null;
  }

  function assignConsultant(){
    /* v0.5.72: admin2 실 endpoint 호출, mock fallback 폐기. timeout 18s + retry 1회.
       호스트 override: window.__bjConsultApiUrl
       v0.6.5: selection 스냅샷 첨부 — 백엔드 ConsultRequest.selection_snapshot에 저장 */
    var base = window.__bjConsultApiUrl || 'https://admin2-api.billyjo.co.kr';
    var prodId = (location.pathname.match(/prod_view\/(\d+)/) || [])[1] || null;
    var prodName = (document.querySelector('.prod_name b') || document.querySelector('.prod_name') || {}).textContent;
    var body = { productId: prodId, productName: prodName && prodName.trim() };
    var sel = collectConsultSelection();
    if (sel) body.selection = sel;
    bjConsultExtras(body);   // utm(광고 인구통계 코드) + 고객 페르소나 위저드 답변
    return _assignFetchOnce(base, body, 18000).catch(function(err){
      /* 1차 실패(주로 cold start 또는 일시 네트워크) → 1.5초 대기 후 재시도 — 두 번째는 더 짧은 timeout */
      return new Promise(function(resolve, reject){
        setTimeout(function(){
          _assignFetchOnce(base, body, 10000).then(resolve, reject);
        }, 1500);
      });
    });
  }

  function renderAssignError(modal, err){
    var msg = '잠시 후 다시 시도해 주세요.';
    if (err && err.status === 503) msg = '현재 통화 가능한 상담사가 없습니다. 잠시 후 다시 시도해 주세요.';
    modal.querySelector('.bj-consult-modal-body').innerHTML =
      '<div class="bj-consult-title" style="color:#b91c1c">⚠️ 연결 실패</div>' +
      '<div class="bj-consult-agent" style="color:#555;margin-top:10px">' + msg + '</div>' +
      '<a class="bj-consult-call-btn" href="tel:1577-9469" style="margin-top:16px;background:linear-gradient(135deg,#666,#888)">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" fill="currentColor"/></svg>' +
        '<span class="bj-consult-call-phone">1577-9469</span>' +
        '<span class="bj-consult-call-cta">대표번호로 직접</span>' +
      '</a>';
  }
  /* v0.7.0: 모달 1단계 — [바로 상담] / [상담 예약] 2분기 카드. */
  function renderAssignedConsultant(modal, d){
    var body = modal.querySelector('.bj-consult-modal-body');
    body.innerHTML =
      '<div class="bj-consult-title bj-consult-title-ok">✓ 상담사 배정 완료</div>' +
      '<div class="bj-consult-agent">담당 <strong>' + escapeWidgetHtml(d.agentName || '빌리조 상담팀') + '</strong> · 코드 ' +
        '<span class="bj-consult-code-inline">' + escapeWidgetHtml(d.code || '0000') + '</span></div>' +
      '<div class="bj-choice-row">' +
        '<button type="button" class="bj-choice-card bj-choice-now" data-choice="now">' +
          '<div class="bj-choice-ic">📞</div>' +
          '<div class="bj-choice-ttl">바로 상담</div>' +
          '<div class="bj-choice-sub">지금 통화 연결</div>' +
          '<div class="bj-choice-meta">1577-9469</div>' +
        '</button>' +
        '<button type="button" class="bj-choice-card bj-choice-resv" data-choice="resv">' +
          '<div class="bj-choice-ic">📅</div>' +
          '<div class="bj-choice-ttl">상담 예약</div>' +
          '<div class="bj-choice-sub">5분~1시간 후</div>' +
          '<div class="bj-choice-meta">상담사가 발신</div>' +
        '</button>' +
      '</div>' +
      '<div class="bj-consult-expires">유효시간 ' + (d.expiresAtMinutes || 30) + '분</div>';
    body.querySelector('[data-choice="now"]').onclick = function(){ renderImmediateCall(modal, d); };
    body.querySelector('[data-choice="resv"]').onclick = function(){ renderScheduleForm(modal, d); };
  }

  function _consultApiBase(){
    return window.__bjConsultApiUrl || 'https://admin2-api.billyjo.co.kr';
  }

  function _beaconConsult(path, payload){
    var url = _consultApiBase() + path;
    var data = JSON.stringify(payload || {});
    try {
      if (navigator.sendBeacon) {
        var blob = new Blob([data], { type: 'application/json' });
        if (navigator.sendBeacon(url, blob)) return true;
      }
    } catch(_){}
    /* fallback — keepalive로 페이지 unload 안전 */
    try {
      fetch(url, { method: 'POST', headers: {'Content-Type':'application/json'}, body: data, keepalive: true });
    } catch(_){}
    return false;
  }

  /* v0.7.0: 모달 2단계 — 바로 상담 화면 (tel 버튼 + DTMF 코드 송출 + /dial beacon) */
  function renderImmediateCall(modal, d){
    var codeDigits = String(d.code || '0000').split('');
    var telLink = d.telLink || ('tel:' + String(d.phone || '').replace(/[^\d]/g,'') + ',,' + (d.code || ''));
    modal.querySelector('.bj-consult-modal-body').innerHTML =
      '<button type="button" class="bj-back-btn" data-back="1">← 다시 선택</button>' +
      '<div class="bj-consult-title bj-consult-title-ok">📞 바로 상담</div>' +
      '<div class="bj-consult-agent">담당 <strong>' + escapeWidgetHtml(d.agentName || '빌리조 상담팀') + '</strong></div>' +
      '<div class="bj-consult-code-label">상담 코드</div>' +
      '<div class="bj-consult-code">' +
        codeDigits.map(function(n){ return '<span class="bj-consult-code-digit">' + n + '</span>'; }).join('') +
      '</div>' +
      '<div class="bj-consult-instructions">통화 버튼을 누르면 코드가 자동 전송됩니다</div>' +
      '<a class="bj-consult-call-btn" href="' + escapeAttr(telLink) + '" data-tel="1">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" fill="currentColor"/></svg>' +
        '<span class="bj-consult-call-phone">' + escapeWidgetHtml(d.phone || '') + '</span>' +
        '<span class="bj-consult-call-cta">지금 ' + escapeWidgetHtml(d.agentName || '상담사') + '님과 통화</span>' +
      '</a>' +
      '<div class="bj-consult-expires">유효시간 ' + (d.expiresAtMinutes || 30) + '분</div>';
    modal.querySelector('[data-back]').onclick = function(){ renderAssignedConsultant(modal, d); };
    /* 통화 버튼 클릭 시 beacon — page unload(tel:) 전에도 안전 */
    modal.querySelector('[data-tel]').addEventListener('click', function(){
      _beaconConsult('/v1/consult/dial', { code: d.code, requestId: d.requestId });
    });
  }

  /* v0.7.0: 모달 2단계 — 상담 예약 화면 (시간 + 폰번호 입력) */
  function renderScheduleForm(modal, d){
    modal.querySelector('.bj-consult-modal-body').innerHTML =
      '<button type="button" class="bj-back-btn" data-back="1">← 다시 선택</button>' +
      '<div class="bj-consult-title">📅 상담 예약</div>' +
      '<div class="bj-consult-agent">담당 <strong>' + escapeWidgetHtml(d.agentName || '빌리조 상담팀') + '</strong>님이 약속 시각에 발신해 드립니다</div>' +
      '<div class="bj-resv-label">언제 통화하실까요?</div>' +
      '<div class="bj-resv-mins">' +
        '<button type="button" class="bj-resv-min" data-min="5">5분</button>' +
        '<button type="button" class="bj-resv-min" data-min="10">10분</button>' +
        '<button type="button" class="bj-resv-min" data-min="30">30분</button>' +
        '<button type="button" class="bj-resv-min" data-min="60">1시간</button>' +
      '</div>' +
      '<div class="bj-resv-label">콜백 받을 번호</div>' +
      '<input type="tel" class="bj-resv-phone" placeholder="010-1234-5678" maxlength="13" inputmode="numeric" autocomplete="tel">' +
      '<button type="button" class="bj-resv-submit" disabled>시간과 번호를 입력해 주세요</button>' +
      '<div class="bj-resv-err" style="display:none"></div>';

    var minBtns = modal.querySelectorAll('.bj-resv-min');
    var phoneEl = modal.querySelector('.bj-resv-phone');
    var submit = modal.querySelector('.bj-resv-submit');
    var errEl = modal.querySelector('.bj-resv-err');
    var state = { minutes: null, phone: '' };

    function fmtPhone(v){
      var digits = String(v || '').replace(/\D/g, '').slice(0, 11);
      if (digits.length < 4) return digits;
      if (digits.length < 8) return digits.slice(0,3) + '-' + digits.slice(3);
      return digits.slice(0,3) + '-' + digits.slice(3,7) + '-' + digits.slice(7);
    }
    function updateSubmit(){
      var phoneOk = /^010-?\d{4}-?\d{4}$/.test(state.phone.replace(/\s/g,''));
      var ok = state.minutes && phoneOk;
      submit.disabled = !ok;
      if (ok) {
        var t = new Date(Date.now() + state.minutes * 60000);
        var hh = String(t.getHours()).padStart(2,'0');
        var mm = String(t.getMinutes()).padStart(2,'0');
        submit.textContent = hh + ':' + mm + '에 콜백 받기';
      } else if (!state.minutes) {
        submit.textContent = '시간을 선택해 주세요';
      } else {
        submit.textContent = '010-XXXX-XXXX 형식으로 입력';
      }
    }
    Array.prototype.forEach.call(minBtns, function(b){
      b.onclick = function(){
        Array.prototype.forEach.call(minBtns, function(x){ x.classList.remove('on'); });
        b.classList.add('on');
        state.minutes = parseInt(b.dataset.min, 10);
        updateSubmit();
      };
    });
    phoneEl.addEventListener('input', function(){
      phoneEl.value = fmtPhone(phoneEl.value);
      state.phone = phoneEl.value;
      updateSubmit();
    });
    modal.querySelector('[data-back]').onclick = function(){ renderAssignedConsultant(modal, d); };
    submit.onclick = function(){
      submit.disabled = true;
      submit.textContent = '예약 중…';
      errEl.style.display = 'none';
      fetch(_consultApiBase() + '/v1/consult/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: d.code,
          requestId: d.requestId,
          minutes: state.minutes,
          customerPhone: state.phone,
        }),
      })
      .then(function(r){ return r.json().then(function(j){ return { ok: r.ok, json: j }; }); })
      .then(function(res){
        if (!res.ok) {
          var msg = (res.json && res.json.detail && res.json.detail.message) || '예약에 실패했습니다. 잠시 후 다시 시도해 주세요.';
          errEl.textContent = msg;
          errEl.style.display = 'block';
          submit.disabled = false;
          updateSubmit();
          return;
        }
        renderScheduleConfirm(modal, d, state, res.json.data && res.json.data.scheduledAt);
      })
      .catch(function(){
        errEl.textContent = '네트워크 오류로 예약에 실패했습니다.';
        errEl.style.display = 'block';
        submit.disabled = false;
        updateSubmit();
      });
    };
  }

  function renderScheduleConfirm(modal, d, state, scheduledAtIso){
    var when = scheduledAtIso ? new Date(scheduledAtIso) : new Date(Date.now() + state.minutes * 60000);
    var hh = String(when.getHours()).padStart(2,'0');
    var mm = String(when.getMinutes()).padStart(2,'0');
    modal.querySelector('.bj-consult-modal-body').innerHTML =
      '<div class="bj-consult-title bj-consult-title-ok">✓ 예약 완료</div>' +
      '<div class="bj-resv-confirm">' +
        '<div class="bj-resv-when">' + hh + ':' + mm + '에 콜백</div>' +
        '<div class="bj-resv-to">' + escapeWidgetHtml(state.phone) + '로</div>' +
      '</div>' +
      '<div class="bj-consult-agent"><strong>' + escapeWidgetHtml(d.agentName || '상담사') + '</strong>님이 정확한 시간에 발신해 드립니다.</div>' +
      '<div class="bj-consult-instructions">상담 코드 <strong>' + escapeWidgetHtml(d.code || '0000') + '</strong> · 페이지를 닫으셔도 콜백은 진행됩니다</div>';
  }

  function enhanceBottomBar(){
    var wrapper = document.querySelector('.prod_view_bot.card.mt40');
    if (!wrapper) return;

    /* v0.5.34: forceFixedStyle은 1회만 호출 — 매 runAll 호출 시 cssText에 누적되는 문제 차단 */
    if (!wrapper.dataset.bjFixedStyled) {
      forceFixedStyle(wrapper);
      wrapper.dataset.bjFixedStyled = '1';
    }

    /* v0.5.14: bb-inner가 늦게 들어왔는데 우리 fallback이 이미 있으면 fallback 제거 후 격상 시도 */
    var currBbInner = wrapper.querySelector('.bb-inner');
    if (wrapper.dataset.bjBarEnhanced) {
      if (currBbInner && !currBbInner.classList.contains('bj-bb-inner-merged')) {
        var oldFallback = wrapper.querySelector('.bj-bar-fallback');
        if (oldFallback) oldFallback.remove();
        wrapper.dataset.bjBarEnhanced = '';  /* 재실행 허용 */
      } else {
        return;  /* 이미 격상 완료 */
      }
    }
    /* v0.5.34: 무조건 'bj-bar-expanded' add는 가드 안으로 — 매 runAll 호출 시
       사용자가 collapsed로 토글한 직후 expanded class를 강제 추가하면 두 class 공존 →
       CSS cascade로 collapsed(뒤에 정의)가 이김 → "펼침 안 됨" 증상. 첫 실행 시만 default. */

    /* v0.5.5: 위젯 안 .rantal_wrap·.card__tit·.card_sale 등 중복 콘텐츠는 CSS로 숨김 처리됨.
       남는 표시 요소: 핸들(제품명+가격) + bb-inner(약정 pill + 3버튼) */
    var bbInner = wrapper.querySelector('.bb-inner');
    var prodName, priceEl, firstMonthPill;
    if (bbInner) {
      prodName = bbInner.querySelector('.bb-product-name');
      firstMonthPill = bbInner.querySelector('.bb-month-pill .bb-month-price');
      priceEl  = bbInner.querySelector('.bb-price') || firstMonthPill;
    }
    /* fallback — .rantal_wrap 안 .month_box (네이티브 렌탈사 카드)에서 첫 가격 추출 */
    if (!priceEl) {
      var nativeMonth = wrapper.querySelector('.rantal_wrap .month_box .fz16');
      if (nativeMonth) priceEl = nativeMonth;
    }
    /* fallback — .rantal_wrap 안 첫 .name (렌탈사명) → 핸들에는 사용 안 함, 제품명은 상단 .prod_name */
    /* v0.5.4: 핸들 텍스트는 brand prefix("세스코 - ", "쿠쿠 - ", "세스코 " 등) 제거하여 모델명만 노출 */
    var rawName = (prodName && prodName.textContent.trim()) ||
                  (document.querySelector('.prod_name b') && document.querySelector('.prod_name b').textContent.trim()) ||
                  '렌탈 신청';
    var KNOWN_BRANDS = /^(세스코|코웨이|쿠쿠|SK매직|sk매직|LG|LG전자|삼성|삼성전자|위닉스|루헨스|쿠첸|바디프랜드|보람피플|BS렌탈|BS ON|현대렌탈서비스|위덱|위더스렌탈|자이글|렌타나|스마트렌탈|지니원|코지마|드롱기|유라|일렉트로룩스|인켈|로보락|파나소닉|기아|현대|KT)\s*[-·]?\s*/;
    var nameText = rawName.replace(KNOWN_BRANDS, '').trim() || rawName;
    var priceText = (priceEl && priceEl.textContent.trim()) ||
                    (document.querySelector('.top_min_price b') && '월 ' + document.querySelector('.top_min_price b').textContent.trim() + '원') ||
                    '';

    /* v0.5.8: 핸들 = 가격만 (제품명 제거 — 사용자가 어떤 제품인지 이미 알고 있음).
       BEST 라벨 + 가격 + 토글 chevron만. */
    var handle = document.createElement('div');
    handle.className = 'bj-bar-handle';
    handle.setAttribute('role', 'button');
    handle.setAttribute('aria-label', '렌탈 신청 영역 펼치기/접기');
    handle.setAttribute('tabindex', '0');
    handle.innerHTML =
      '<div class="bj-bar-handle-text">' +
        (priceText ? '<span class="bj-bar-handle-price">' + priceText + '</span>' : '<span class="bj-bar-handle-price">렌탈 신청</span>') +
      '</div>' +
      '<button type="button" class="bj-bar-handle-toggle" aria-label="펼치기/접기">' +
        '<span class="bj-bar-chevron">▾</span>' +
      '</button>';

    /* v0.5.4: bb-inner 내부 중복 요소 숨김 — 핸들이 이미 표시.
       - .bb-product-name: 핸들의 name과 중복
       - .bb-right-bottom: "월 렌탈료 -" 라벨, 핸들의 price와 중복 (가격은 펼침 시 .bb-months에서 약정별 표시)
       남는 요소: .bb-months (약정별 pill — 펼침 시 메인 콘텐츠) + .bb-right-top (버튼 3개) */
    if (bbInner) {
      var pn = bbInner.querySelector('.bb-product-name');
      if (pn) pn.style.setProperty('display', 'none', 'important');
      var rb = bbInner.querySelector('.bb-right-bottom');
      if (rb) rb.style.setProperty('display', 'none', 'important');
      /* bb-inner 자체를 단일 column flex로 — 약정 pill 윗줄, 버튼 행 아랫줄 */
      bbInner.classList.add('bj-bb-inner-merged');
    }

    function toggle(){
      var collapsed = wrapper.classList.toggle('bj-bar-collapsed');
      wrapper.classList.toggle('bj-bar-expanded', !collapsed);
    }
    /* v0.5.28: click 핸들러 제거 — setupHandleDragGesture의 mouseup/touchend 탭 분기가
       이미 toggle을 호출함. 두 핸들러 동시 등록 시 사용자 클릭마다 두 번 토글되어
       원래 상태로 되돌아옴 → "펼침 버튼이 안 보임" 버그. keydown만 유지. */
    handle.addEventListener('keydown', function(e){
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
    });
    /* v0.5.14: 핸들 중복 방지 — 이미 있으면 새것으로 교체 (재실행 케이스) */
    var existingHandle = wrapper.querySelector(':scope > .bj-bar-handle');
    if (existingHandle) existingHandle.remove();
    wrapper.insertBefore(handle, wrapper.firstChild);

    /* v0.4.0: SVG 아이콘 */
    var SVG_GIFT = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z"/></svg>';
    /* v0.5.43: 상담신청 아이콘 — 채팅 말풍선 → 전화 수화기 (Material 'phone' icon).
       사용자 요청: 상담은 전화 통화로 진행되므로 직관적 phone 아이콘이 적절. */
    var SVG_PHONE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>';
    var SVG_CART = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/></svg>';

    // 버튼 격상 또는 fallback 생성
    if (bbInner) {
      var rentBtn = bbInner.querySelector('.bb-btn-rent');
      if (rentBtn) {
        rentBtn.classList.add('bj-btn-rent-gift');
        rentBtn.innerHTML = SVG_GIFT + '렌탈+사은품 신청';
      }
      var rightTop = bbInner.querySelector('.bb-right-top');
      if (rightTop) {
        /* v0.5.0: 3버튼 보장 — 장바구니가 .bb-left에 따로 있거나 누락된 경우 rightTop으로 이동/생성 */
        var existingCart = bbInner.querySelector('.bb-btn-cart');
        var cartInRightTop = rightTop.querySelector('.bb-btn-cart');
        if (!cartInRightTop) {
          var cartBtn;
          if (existingCart) {
            /* .bb-left 등 다른 위치의 cart 버튼을 rightTop 맨 앞으로 이동 (단일 버튼 영역으로 통합) */
            cartBtn = existingCart;
          } else {
            /* 어디에도 없으면 생성 */
            cartBtn = document.createElement('button');
            cartBtn.type = 'button';
            cartBtn.className = 'bb-btn bb-btn-cart';
            cartBtn.addEventListener('click', function(){
              if (typeof window.shoporder === 'function') window.shoporder('cart');
              else window.location.href = '/html/dh_order/shop_cart';
            });
          }
          cartBtn.innerHTML = SVG_CART + '장바구니';
          rightTop.insertBefore(cartBtn, rightTop.firstChild);
        }
        /* 상담신청 — 중복 방지 */
        if (!rightTop.querySelector('.bj-btn-consult')) {
          var consult = document.createElement('button');
          consult.type = 'button';
          consult.className = 'bb-btn bj-btn-consult';
          consult.innerHTML = SVG_PHONE + '상담신청';
          consult.addEventListener('click', openConsultModal);
          rightTop.appendChild(consult);
        }
      }
    } else {
      /* v0.4.0: .bb-inner 없을 때 fallback 박스 생성 */
      var fb = document.createElement('div');
      fb.className = 'bj-bar-fallback';
      fb.innerHTML =
        '<div class="bj-fb-selector"></div>' +  /* v0.5.6: 렌탈사·약정 selector mount */
        '<div class="bj-fb-btns">' +
          '<button type="button" class="bb-btn bb-btn-cart bj-fb-cart">' + SVG_CART + '장바구니</button>' +
          '<button type="button" class="bb-btn bb-btn-rent bj-btn-rent-gift bj-fb-rent">' + SVG_GIFT + '렌탈+사은품 신청</button>' +
          '<button type="button" class="bb-btn bj-btn-consult bj-fb-consult">' + SVG_PHONE + '상담신청</button>' +
        '</div>';
      wrapper.appendChild(fb);

      fb.querySelector('.bj-fb-cart').addEventListener('click', function(){
        if (typeof window.shoporder === 'function') window.shoporder('cart');
        else window.location.href = '/html/dh_order/shop_cart';
      });
      fb.querySelector('.bj-fb-rent').addEventListener('click', function(){
        if (typeof window.shoporder === 'function') window.shoporder('rent');
        else window.location.href = '/html/dh/counsel';
      });
      fb.querySelector('.bj-fb-consult').addEventListener('click', openConsultModal);
    }

    /* v0.5.6: 렌탈사·약정 selector — 위젯에 컴팩트 UI 빌드.
       underlying .rantal_wrap > li 데이터를 스캔하여 [렌탈사 탭] + [약정 pill] 렌더.
       클릭 시: (1) underlying .month_box.layer_price 실제 클릭 트리거 (가격/주문 데이터 동기화)
                (2) 핸들 가격 + 위젯 가격 표시 갱신 */
    buildWidgetSelector(wrapper, handle);

    /* v0.5.15: 옵션 select (.bb-option-select) 처리 — 핸들에 미러링 + 펼친 영역 스타일 */
    syncOptionSelectToHandle(wrapper, handle);

    /* v0.5.15: wrapper 외부에 떠 있는 .bb-inner는 강제 숨김 (이중 노출 방지) */
    document.querySelectorAll('.bb-inner').forEach(function(inner){
      if (!wrapper.contains(inner)) {
        inner.style.setProperty('display', 'none', 'important');
        inner.setAttribute('data-bj-extra-hidden', '1');
      }
    });

    wrapper.dataset.bjBarEnhanced = '1';
    /* v0.5.72: 위젯 enhance 완료 시 admin2 warmup ping (cold start 회피) */
    try { warmupAdmin2(); } catch(_){}
  }

  /* v0.5.15+v0.5.17: 옵션 select 처리 — 핸들 옆 chip 미러링 + 위젯에 select 노출.
     selector: .bb-option-select (빌리조 동적 생성) + .option_select (페이지 원본)
     wrapper 안에 없으면 페이지 내 visible select를 위젯에 클론 후 양방향 sync. */
  function syncOptionSelectToHandle(wrapper, handle){
    /* v0.5.28: 가드를 .bj-option-clone 한정으로 좁힘 — 빌리조의 .bb-option-select가
       .bb-inner 안에 hidden/압축 상태로 있을 수 있어, 그것을 "이미 있다"고 판단하면
       사용자 가시 박스가 만들어지지 않음. 우리 자체 clone(.bj-option-clone)만 신뢰. */
    var select = wrapper.querySelector('.bj-option-clone');
    if (!select) {
      /* v0.5.35: wrapper.contains() 가드 폐기 — 18055 등 페이지에서 native select가
         wrapper(.prod_view_bot.card.mt40) 안의 .rantal_wrap > .option__wrap에 위치.
         이전 가드는 그 native select도 skip해서 orig=null → 옵션 박스 안 만들어짐.
         우리가 만든 .bj-option-clone만 skip하도록 좁힘. */
      var allSelects = document.querySelectorAll('.option_select, .bb-option-select');
      var orig = null;
      for (var i = 0; i < allSelects.length; i++) {
        var s = allSelects[i];
        if (s.classList && s.classList.contains('bj-option-clone')) continue;
        /* 빌리조 원본 sticky 위젯 안 (.prod_fix_wrap) select는 v0.5.11에서 숨겼지만 값/이벤트는 정상 — skip */
        if (s.closest && s.closest('.prod_fix_wrap')) continue;
        if (s.options && s.options.length > 1) { orig = s; break; }
      }
      if (!orig) return;
      /* 클론 + 위젯 안 위치에 삽입 */
      var cloneSelect = orig.cloneNode(true);
      cloneSelect.classList.add('bb-option-select', 'bj-option-clone');
      cloneSelect.removeAttribute('onchange');
      cloneSelect.value = orig.value;
      /* v0.5.32: 클릭 동작 강화 — wrapper z-index:99999 환경에서도 native select dropdown
         정상 동작 보장. disabled 속성·인라인 pointer-events:none 등 클론에 따라온 잠재 차단 해제. */
      cloneSelect.removeAttribute('disabled');
      cloneSelect.disabled = false;
      cloneSelect.style.cssText = 'pointer-events:auto !important; cursor:pointer !important; ' +
        'position:relative !important; z-index:2 !important; ' +
        'opacity:1 !important; visibility:visible !important; display:block !important;';
      /* 양방향 sync */
      cloneSelect.addEventListener('change', function(){
        orig.value = cloneSelect.value;
        try { orig.dispatchEvent(new Event('change', { bubbles: true })); } catch(_){}
        /* 빌리조 onchange="option_selec(this.value)" 직접 호출 fallback */
        if (typeof window.option_selec === 'function') {
          try { window.option_selec(cloneSelect.value); } catch(_){}
        }
      });
      orig.addEventListener('change', function(){
        if (cloneSelect.value !== orig.value) {
          cloneSelect.value = orig.value;
          try { cloneSelect.dispatchEvent(new Event('change', { bubbles: true })); } catch(_){}
        }
      });
      /* v0.5.25: 삽입 위치 — 라벨 + select wrapper 박스로 감싸 명확히 노출 */
      var optBox = document.createElement('div');
      optBox.className = 'bj-fb-option-box';
      /* select의 첫 option ("옵션을 선택해주세요.") 텍스트로 라벨 추론 */
      var labelText = '옵션 선택';
      /* 빌리조 페이지에서 select 가까이 "색상" 등 th 라벨 찾기 */
      var nearTh = orig.closest('tr') && orig.closest('tr').querySelector('th');
      if (nearTh && nearTh.textContent.trim()) {
        labelText = nearTh.textContent.trim();
      } else {
        /* 페이지 .prod_table_wrap에서 색상 td 옆 th 찾기 시도 */
        var ths = document.querySelectorAll('.prod_table th');
        for (var ti = 0; ti < ths.length; ti++) {
          if (/색상|컬러|옵션|타입|용량|사이즈/.test(ths[ti].textContent)) {
            labelText = ths[ti].textContent.trim(); break;
          }
        }
      }
      /* v0.5.63: 옵션 값이 색상명이면 nearTh 라벨('타입' 등) 무시하고 '색상'으로 강제.
         빌리조 페이지의 nearTh는 보통 '타입'·'옵션'으로 일반화돼 있어 실제 값(색상)과 불일치. */
      var optTexts = Array.from(orig.options).filter(function(o){ return o.value !== ''; }).map(function(o){ return o.textContent; });
      if (optTexts.length > 0) {
        var COLOR_KEYWORDS = /화이트|블랙|그레이|그레이스|실버|골드|베이지|브라운|핑크|블루|그린|레드|네이비|아이보리|크림|챠콜|차콜|민트|라벤더|로즈|샤페|아쿠아|투명|오트밀|피치|머스타드|silver|gold|black|white|gray|grey|brown|pink|blue|green|red|navy|beige|ivory|cream/i;
        var colorMatchCount = optTexts.filter(function(t){ return COLOR_KEYWORDS.test(t); }).length;
        if (colorMatchCount / optTexts.length >= 0.5) {
          labelText = '색상';
        }
      }
      var label = document.createElement('div');
      label.className = 'bj-fb-option-label';
      label.textContent = labelText + ' 선택';
      optBox.appendChild(label);
      optBox.appendChild(cloneSelect);

      /* v0.5.31: 삽입 위치 일원화 — 항상 handle 바로 다음 (wrapper 최상단의 visible 영역).
         이전 .bb-inner 앞 분기는 .bb-inner가 wrapper 외부에 있는 케이스에서 동작 안 함.
         handle 다음으로 통일하면 어떤 페이지 변종이든 가시 영역에 위치.
         + inline style로 display/visibility 강제 — CSS 충돌 안전망. */
      optBox.style.cssText = 'visibility:visible !important; opacity:1 !important;';
      var handleEl = wrapper.querySelector(':scope > .bj-bar-handle');
      if (handleEl) {
        wrapper.insertBefore(optBox, handleEl.nextSibling);
      } else {
        /* 핸들이 아직 없는 극단 케이스 — fallback 처리 */
        var fb = wrapper.querySelector('.bj-bar-fallback');
        var btns = fb && fb.querySelector('.bj-fb-btns');
        if (btns) fb.insertBefore(optBox, btns);
        else wrapper.insertBefore(optBox, wrapper.firstChild);
      }
      select = cloneSelect;
    }
    var handleText = handle.querySelector('.bj-bar-handle-text');
    if (!handleText) return;
    /* 핸들 안 옵션 칩 ensure */
    var chip = handleText.querySelector('.bj-bar-handle-option');
    if (!chip) {
      chip = document.createElement('span');
      chip.className = 'bj-bar-handle-option';
      chip.setAttribute('role', 'button');
      chip.setAttribute('tabindex', '0');
      chip.setAttribute('aria-label', '옵션 선택');
      /* v0.5.46: chip 위치 — handleText의 마지막 자식 (price 우측). 이전엔 firstChild. */
      handleText.appendChild(chip);
      /* 칩 클릭 시 위젯 펼침 + select 포커스 */
      chip.addEventListener('click', function(e){
        e.stopPropagation();
        wrapper.classList.remove('bj-bar-collapsed');
        wrapper.classList.add('bj-bar-expanded');
        setTimeout(function(){ select.focus(); }, 220);
      });
      chip.addEventListener('keydown', function(e){
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          chip.click();
        }
      });
    } else if (chip !== handleText.lastElementChild) {
      /* v0.5.46: 이전 버전에서 firstChild로 삽입된 chip이 남아있으면 우측으로 재배치 */
      handleText.appendChild(chip);
    }
    function refreshChip(){
      var v = select.value;
      var label = v || (select.options[0] ? select.options[0].textContent : '옵션 선택');
      chip.textContent = v ? v : '옵션 선택';
      chip.classList.toggle('is-empty', !v);
    }
    refreshChip();
    /* 중복 등록 방지 */
    if (!select.dataset.bjOptionBound) {
      select.addEventListener('change', refreshChip);
      select.dataset.bjOptionBound = '1';
    }
    /* v0.5.18: 옵션 ≤4개면 select를 가로 버튼 그룹으로 대체. 5개+ 또는 옵션 길이가 길면 select 유지 */
    buildOptionButtonGroup(wrapper, select, refreshChip);
  }

  /* v0.5.33: 옵션을 항상 버튼 그룹으로 렌더 — 옵션 개수·라벨 길이 제한 폐기.
     native select가 fixed wrapper + z-index 환경에서 클릭이 안 되는 케이스(특히 iOS Safari)를
     원천 해결. 라벨은 짧게 표시(접두어/모델코드 제거), 가로 1행 스크롤로 무제한 옵션 수용.
     select는 hide하되 DOM에 유지(빌리조 onchange 동기화용 ground-truth). */
  function shortenOptionLabel(text){
    text = String(text || '').trim();
    /* 후미 모델코드 제거: " WB", " AS", " CB" 등 (공백 + 영문 2-4자) */
    text = text.replace(/\s+[A-Z]{2,4}\s*$/, '');
    /* 흔한 접두어 제거 — 색상명/사이즈 핵심만 노출 */
    text = text.replace(/^(솔리드|메탈릭|메탈|매트|글로시|펄|유광|무광|하이드로|프리미엄|디럭스|스탠다드|일반|기본|컬러)\s*/, '');
    return text || '옵션';
  }
  function buildOptionButtonGroup(wrapper, select, refreshChip){
    if (!select || select.dataset.bjOptionGroupBuilt) return;
    var realOpts = Array.from(select.options).filter(function(o){ return o.value !== ''; });
    if (realOpts.length === 0) return;
    var group = document.createElement('div');
    group.className = 'bj-option-buttons';
    group.setAttribute('role', 'radiogroup');
    group.setAttribute('aria-label', '옵션 선택');
    realOpts.forEach(function(opt){
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'bj-option-btn';
      btn.dataset.value = opt.value;
      btn.setAttribute('role', 'radio');
      var fullLabel = opt.textContent.trim();
      btn.textContent = shortenOptionLabel(fullLabel);
      btn.title = fullLabel; /* hover tooltip — 전체 옵션명 */
      if (select.value === opt.value) btn.classList.add('active');
      btn.addEventListener('click', function(e){
        e.preventDefault();
        e.stopPropagation();
        select.value = opt.value;
        /* cloneSelect의 change 핸들러가 orig.value + window.option_selec 자동 호출 */
        try { select.dispatchEvent(new Event('change', { bubbles: true })); } catch(_){}
        refreshGroup();
      });
      group.appendChild(btn);
    });
    function refreshGroup(){
      Array.from(group.children).forEach(function(b){
        b.classList.toggle('active', b.dataset.value === select.value);
      });
    }
    select.parentNode.insertBefore(group, select);
    select.classList.add('bj-option-select-replaced');
    /* v0.5.33: select 자체는 hide (버튼이 ground-truth UI). 빌리조 sync용으로 DOM 유지 */
    select.style.setProperty('display', 'none', 'important');
    select.addEventListener('change', refreshGroup);
    select.dataset.bjOptionGroupBuilt = '1';
  }

  /* v0.5.6: 위젯 내 렌탈사·약정 selector 빌드 */
  function buildWidgetSelector(wrapper, handle){
    var lis = Array.from(wrapper.querySelectorAll('.rantal_wrap > li'));
    if (lis.length === 0) return;

    /* 데이터 수집 */
    function digits(s){ return parseInt(String(s||'').replace(/[^\d]/g,''),10) || 0; }
    var suppliers = lis.map(function(li){
      var nameEl = li.querySelector('.m_ver_txt .name, .txt .name');
      var boxes = Array.from(li.querySelectorAll('.month_box'));
      var terms = boxes.map(function(b){
        var price = b.dataset.price || ((b.querySelector('.fz16')||{}).textContent || '').replace(/[^\d,]/g,'');
        var dcprice = b.dataset.dcprice || '0';  /* 카드할인 적용 후 금액 (있으면) */
        var cardDis = b.dataset.card_dis || '0';  /* 카드할인 액수 */
        var priceNum = digits(price);
        var dcNum = digits(dcprice);
        var cardDisNum = digits(cardDis);
        /* 최종 월 부담액: dcprice가 있고 0보다 크면 그것, 아니면 price - cardDis 추정, 아니면 price */
        var effective = dcNum > 0 ? dcNum :
                        (cardDisNum > 0 && cardDisNum < priceNum) ? (priceNum - cardDisNum) :
                        priceNum;
        return {
          el: b,
          month: b.dataset.month || (b.querySelector('.fz14')||{}).textContent || '',
          monthKey: b.dataset.month_key,
          price: price,
          priceNum: priceNum,
          dcprice: dcprice,
          dcNum: dcNum,
          cardDis: cardDis,
          cardDisNum: cardDisNum,
          effective: effective,    /* 가성비 비교의 기준 — 카드할인 적용 후 월 부담액 */
          supname: b.dataset.supname,
          supcode: b.dataset.supcode,
        };
      });
      return {
        li: li,
        name: nameEl ? nameEl.textContent.trim() : (terms[0] && terms[0].supname) || '렌탈사',
        terms: terms,
      };
    }).filter(function(s){ return s.terms.length > 0; });
    if (suppliers.length === 0) return;

    /* v0.5.70: LPT signature에서 "타사보상" 약정 행 추출해 각 supplier의 terms에 추가.
       정수기 native .month_box에 타사보상 옵션이 누락된 케이스 보강 — 약정 pill 풀세트 제공.
       매칭 규칙: LPT sig의 service(예: '방문관리')와 supplier.name 부분 일치 시 해당 sup에 합류,
       그 외는 첫 supplier에 합류 (single-sup 케이스 robust). */
    try {
      var lptEl = document.querySelector('[data-bj-lpt-signature]');
      var sig = lptEl ? (lptEl.getAttribute('data-bj-lpt-signature') || '') : '';
      if (sig) {
        var wtRows = sig.split(';').filter(Boolean).map(function(row){
          var p = row.split('|');
          return { service: (p[0]||'').trim(), term: (p[1]||'').trim(), price: (p[2]||'').trim(), dcPrice: (p[3]||'').trim() };
        }).filter(function(r){ return /타사보상/.test(r.term); });

        if (wtRows.length > 0) {
          var pickSupIdx = function(serviceText){
            if (suppliers.length === 1) return 0;
            for (var si = 0; si < suppliers.length; si++) {
              if (serviceText && suppliers[si].name && (
                suppliers[si].name.indexOf(serviceText) >= 0 || serviceText.indexOf(suppliers[si].name) >= 0
              )) return si;
            }
            return 0;
          };
          wtRows.forEach(function(r){
            var sidx = pickSupIdx(r.service);
            var sup = suppliers[sidx];
            // 중복 방지 — 이미 같은 term 라벨 있으면 skip
            var label = r.term;
            if (sup.terms.some(function(t){ return t.month === label; })) return;
            var priceNum = digits(r.price);
            var dcNum = digits(r.dcPrice);
            sup.terms.push({
              el: null,                 // underlying month_box 없음 — click 동기화 불가
              month: label,             // '5년의무 타사보상' 등
              monthKey: null,
              price: r.price || '',
              priceNum: priceNum,
              dcprice: r.dcPrice || '',
              dcNum: dcNum,
              cardDis: '0',
              cardDisNum: 0,
              effective: dcNum > 0 ? dcNum : priceNum,
              supname: sup.name,
              supcode: null,
              isWarrantyTransfer: true,
            });
          });
        }
      }
    } catch(_){}

    /* v0.5.7: BEST 자동 선택 — 모든 (렌탈사 × 약정) 조합에서 effective(카드할인 후 월 부담액) 최저.
       동률이면 약정 길이 짧은 쪽 우선(약속 부담 적은 게 유리). */
    var bestSupIdx = 0, bestTermIdx = 0, bestEff = Infinity, bestMonths = Infinity;
    suppliers.forEach(function(s, si){
      s.terms.forEach(function(t, ti){
        if (t.effective <= 0) return;
        var months = digits(t.month);
        if (t.effective < bestEff || (t.effective === bestEff && months < bestMonths)) {
          bestEff = t.effective;
          bestMonths = months;
          bestSupIdx = si;
          bestTermIdx = ti;
        }
      });
    });
    suppliers[bestSupIdx].terms[bestTermIdx].isBest = true;

    /* selector mount 위치 — bb-inner 있으면 .bb-months 교체, 없으면 fallback .bj-fb-selector */
    var bbInner = wrapper.querySelector('.bb-inner');
    var mount;
    if (bbInner) {
      var bbMonths = bbInner.querySelector('.bb-months');
      if (bbMonths) bbMonths.style.setProperty('display', 'none', 'important');
      mount = document.createElement('div');
      mount.className = 'bj-widget-selector';
      bbInner.insertBefore(mount, bbInner.firstChild);
    } else {
      mount = wrapper.querySelector('.bj-fb-selector');
      if (!mount) return;
      mount.classList.add('bj-widget-selector');
    }

    /* v0.5.7: 초기 선택을 BEST로 — 사용자가 보자마자 가성비 최고 옵션을 보게 됨 */
    var state = { supIdx: bestSupIdx, termIdx: bestTermIdx };

    function render(){
      var sup = suppliers[state.supIdx];
      var term = sup.terms[state.termIdx];
      var multiSupplier = suppliers.length > 1;
      /* 다중 렌탈사면 supplier 탭에 BEST 표시 (해당 supplier 안에 best term 있으면) */
      var supHasBest = function(si){
        return suppliers[si].terms.some(function(t){ return t.isBest; });
      };

      /* 다중 렌탈사 — 상단에 [렌탈사 선택] 라벨 + 탭, 그 아래 "{선택 렌탈사}의 약정 조건" 라벨 */
      var supTabs = multiSupplier
        ? '<div class="bj-ws-sup-section">' +
            '<div class="bj-ws-sup-label">렌탈사 선택</div>' +
            '<div class="bj-ws-sup-tabs">' +
              suppliers.map(function(s, i){
                var bestMark = supHasBest(i) ? '<span class="bj-ws-best-dot" aria-label="최저가"></span>' : '';
                return '<button type="button" class="bj-ws-sup-tab' + (i === state.supIdx ? ' active' : '') + '" data-i="' + i + '">' +
                  escapeWidgetHtml(s.name) + bestMark +
                '</button>';
              }).join('') +
            '</div>' +
            '<div class="bj-ws-term-label"><strong>' + escapeWidgetHtml(sup.name) + '</strong>의 약정 조건</div>' +
          '</div>'
        : '';

      var termPills =
        '<div class="bj-ws-term-pills">' +
          sup.terms.map(function(t, i){
            /* v0.5.33: pill 2행 마크업 — "카드/정가" 라벨로 명확 구분.
               1행: 최저가 배지 + 약정 기간
               2행: 카드할인 있으면 [카드 N · 정가 M(strike)], 없으면 [정가 N]
               기존 색상만으로 구분이 어려웠던 문제 해소. */
            var hasCardDc = t.effective > 0 && t.effective < t.priceNum;
            var bestBadge = t.isBest ? '<span class="bj-ws-best-badge">최저가</span>' : '';
            var priceRow;
            if (hasCardDc) {
              priceRow =
                '<span class="bj-ws-term-price-lbl bj-ws-lbl-card">카드</span>' +
                '<span class="bj-ws-term-price">' + escapeWidgetHtml(t.effective.toLocaleString()) + '</span>' +
                '<span class="bj-ws-term-price-lbl bj-ws-lbl-orig">정가</span>' +
                '<span class="bj-ws-term-orig">' + escapeWidgetHtml(t.price) + '</span>';
            } else {
              priceRow =
                '<span class="bj-ws-term-price-lbl bj-ws-lbl-orig">정가</span>' +
                '<span class="bj-ws-term-price">' + escapeWidgetHtml(t.price || '문의') + '</span>';
            }
            var wtBadge = t.isWarrantyTransfer ? '<span class="bj-ws-wt-badge" title="타사 보상 적용 약정">타사보상</span>' : '';
            var wtCls = t.isWarrantyTransfer ? ' is-warranty-transfer' : '';
            return '<button type="button" class="bj-ws-term-pill bj-ws-term-pill-2row' + (i === state.termIdx ? ' active' : '') + (t.isBest ? ' is-best' : '') + (hasCardDc ? ' has-card-dc' : '') + wtCls + '" data-i="' + i + '">' +
              '<div class="bj-ws-term-row1">' + bestBadge + wtBadge +
                '<span class="bj-ws-term-period">' + escapeWidgetHtml(t.month) + '</span>' +
              '</div>' +
              '<div class="bj-ws-term-row2">' + priceRow + '</div>' +
            '</button>';
          }).join('') +
        '</div>';

      /* v0.5.64: 카드할인 있는 약정이 하나라도 있으면 약정 pill 아래 카드 안내 chip 표시.
         v0.5.65: chip href에 현재 active 렌탈사명 ?bj= param 추가 → 이동 페이지에서 해당
         렌탈사 카드 섹션을 맨 위에 강조 표시 (highlightPartnershipCardForProduct). */
      var hasAnyCardDc = sup.terms.some(function(t){ return t.effective > 0 && t.effective < t.priceNum; });
      var supParam = sup.name ? '?bj=' + encodeURIComponent(sup.name) : '';
      var cardNotice = hasAnyCardDc ?
        '<a href="/html/dh/partnership_card' + supParam + '" class="bj-card-info-chip" target="_blank" rel="noopener">' +
          '<span class="bj-card-info-icon">💳</span>' +
          '<span>' + (sup.name ? '<strong>' + escapeWidgetHtml(sup.name) + '</strong> ' : '') + '제휴카드 안내 보기</span>' +
          '<span class="bj-card-info-arrow">→</span>' +
        '</a>' : '';

      mount.innerHTML = supTabs + termPills + cardNotice;

      /* v0.5.64: 핸들 가격 단순화 — 정가 월 N원만 표시. 카드할인가는 펼친 위젯
         약정 pill에 노출(중복 회피). 핸들 ⓘ도 제거 — 안내는 별도 chip으로 노출. */
      var hp = handle.querySelector('.bj-bar-handle-price');
      if (hp) {
        if (term.price) {
          hp.innerHTML = '월 ' + term.price + '원';
        } else {
          hp.innerHTML = '문의';
        }
      }
    }

    function selectSupplier(i){
      if (i === state.supIdx) return;
      state.supIdx = i;
      state.termIdx = 0;
      render();
      triggerUnderlying();
    }
    function selectTerm(i){
      if (i === state.termIdx) return;
      state.termIdx = i;
      render();
      triggerUnderlying();
    }
    function triggerUnderlying(){
      /* underlying의 .month_box.layer_price 클릭 — 가격 데이터 동기화.
         타사보상 약정(t.el === null)은 underlying이 없으므로 skip — 사용자가 상담/주문 시 별도 안내. */
      var t = suppliers[state.supIdx].terms[state.termIdx];
      if (t && t.el) {
        try { t.el.click(); } catch(_){}
      }
    }

    mount.addEventListener('click', function(e){
      var sup = e.target.closest('.bj-ws-sup-tab');
      if (sup) { selectSupplier(parseInt(sup.dataset.i, 10)); return; }
      var pill = e.target.closest('.bj-ws-term-pill');
      if (pill) { selectTerm(parseInt(pill.dataset.i, 10)); return; }
    });

    render();
    triggerUnderlying();  // 초기 선택 동기화
  }

  function escapeWidgetHtml(s){
    return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function preEnhance(){
    var wrapper = document.querySelector('.prod_view_bot.card.mt40');
    if (wrapper) forceFixedStyle(wrapper);
  }

  /* (c) v0.5.0: .help (ⓘ 툴팁) 외부 탭 자동 닫힘 — 전 페이지 어디든 details.help 모두 적용
       이전 v0.3.5는 #ai-card-root 스코프만 잡아서 rental-terms·기타 영역에서 안 닫히는 버그 해결.
       click(capture)·touchstart(capture) 동시 등록 — 모바일 탭 즉시 반응. */
  function setupHelpClose(){
    if (window.__bjHelpCloseSetup) return;
    window.__bjHelpCloseSetup = true;
    function closeOutside(e){
      var opened = document.querySelectorAll('details.help[open]');
      opened.forEach(function(d){
        if (!d.contains(e.target)) d.removeAttribute('open');
      });
    }
    document.addEventListener('click', closeOutside, true);
    document.addEventListener('touchstart', closeOutside, { capture: true, passive: true });
    document.addEventListener('toggle', function(e){
      var t = e.target;
      if (!(t && t.tagName === 'DETAILS' && t.classList.contains('help') && t.open)) return;
      /* 다른 help 닫기 */
      document.querySelectorAll('details.help[open]').forEach(function(d){
        if (d !== t) d.removeAttribute('open');
      });
      /* v0.5.12: PC popup을 position:fixed로 강제 전환 + trigger 위치 기반 좌표 직접 계산
         이전 v0.5.10의 transform 보정만으로는 부모 .help가 깊은 컨테이너에 있을 때
         viewport 경계 밖으로 잘리는 케이스 발생 → 좌표를 직접 set해서 100% 보장.
         (모바일 ≤900px은 이미 fixed bottom sheet라 viewport 안 보장됨) */
      if (window.innerWidth <= 900) return;
      var pop = t.querySelector('.help-pop');
      var sum = t.querySelector('summary');
      if (!pop || !sum) return;
      var sRect = sum.getBoundingClientRect();
      var vw = window.innerWidth, vh = window.innerHeight;
      var margin = 12;
      /* popup 크기 측정용 임시 노출 (visibility:hidden, 측정 후 원복) */
      pop.style.position = 'fixed';
      pop.style.top = '-9999px';
      pop.style.left = '-9999px';
      pop.style.transform = 'none';
      pop.style.visibility = 'hidden';
      pop.style.display = 'block';
      requestAnimationFrame(function(){
        var pw = pop.offsetWidth || 280;
        var ph = pop.offsetHeight || 100;
        /* 기본 위치: trigger 가운데 정렬, trigger 아래 8px */
        var left = sRect.left + sRect.width / 2 - pw / 2;
        var top = sRect.bottom + 8;
        /* 우측 경계 clamp */
        if (left + pw > vw - margin) left = vw - pw - margin;
        /* 좌측 경계 clamp */
        if (left < margin) left = margin;
        /* 하단 경계: popup이 viewport 아래로 벗어나면 trigger 위로 띄움 */
        if (top + ph > vh - margin) {
          var topAbove = sRect.top - ph - 8;
          top = topAbove >= margin ? topAbove : Math.max(margin, vh - ph - margin);
        }
        if (top < margin) top = margin;
        pop.style.left = left + 'px';
        pop.style.top = top + 'px';
        pop.style.visibility = '';
        pop.style.display = '';
      });
    }, true);
    /* v0.5.12: close 시 inline style cleanup (다음 open 시 위치 재계산 보장) */
    document.addEventListener('toggle', function(e){
      var t = e.target;
      if (!(t && t.tagName === 'DETAILS' && t.classList.contains('help')) || t.open) return;
      var pop = t.querySelector('.help-pop');
      if (!pop) return;
      pop.style.position = '';
      pop.style.left = '';
      pop.style.top = '';
      pop.style.transform = '';
      pop.style.visibility = '';
      pop.style.display = '';
    }, true);
    /* viewport resize 시 열린 popup 위치 재계산 */
    window.addEventListener('resize', function(){
      var opened = document.querySelector('details.help[open]');
      if (!opened) return;
      /* toggle 이벤트를 다시 발생시켜 위치 재계산 트리거 */
      opened.removeAttribute('open');
      requestAnimationFrame(function(){ opened.setAttribute('open', ''); });
    });
    /* ESC 키로도 닫기 (접근성) */
    document.addEventListener('keydown', function(e){
      if (e.key === 'Escape') {
        document.querySelectorAll('details.help[open]').forEach(function(d){
          d.removeAttribute('open');
        });
      }
    });
  }

  /* (d) v0.3.9: .category__wrap 자동 스크롤 정렬 — 활성(.on)이 보이는 영역 안에 오게,
       없으면 좌측(scrollLeft:0) 고정. 좌측 정렬 유지 (가운데 정렬 금지). */
  function alignCategoryScroll(){
    /* v0.5.9: .category__wrap + 신규 .bj-sh-cat 두 컨테이너 모두 처리 */
    var wraps = document.querySelectorAll('.mobile__gnb .gnb__cateogry .category__wrap, .bj-sh-cat');
    wraps.forEach(function(wrap){
      if (!wrap || wrap.dataset.bjCatAligned) return;
      var active = wrap.querySelector('a.on');
      if (active) {
        var wrapRect = wrap.getBoundingClientRect();
        var aRect = active.getBoundingClientRect();
        var leftEdge = 20;
        var rightEdge = wrap.clientWidth - 32;
        if (aRect.right - wrapRect.left > rightEdge) {
          wrap.scrollLeft = (aRect.left - wrapRect.left) - leftEdge;
        } else if (aRect.left - wrapRect.left < leftEdge) {
          wrap.scrollLeft = 0;
        }
      } else {
        wrap.scrollLeft = 0;
      }
      wrap.dataset.bjCatAligned = '1';
    });
  }

  /* (e) v0.3.8: 약정 기간·의무 사용 기간 라벨에 ⓘ 툴팁 동적 주입
       v0.5.38: 두 설명을 약정 기간 박스 하나로 통합. 의무 사용 기간 ⓘ는 추가하지 않음.
       사용자가 한 번 펼치면 두 개념을 함께 비교 가능 — 분리 노출 시 정보 단편화. */
  var COMBINED_TERM_HELP =
    '<strong>약정 기간</strong>은 렌탈 계약의 전체 기간입니다. 이 기간 동안 매월 렌탈료를 납부하며, 종료 시점에 제품 소유권이 이전(또는 반환)됩니다. 약정을 채워야 광고된 월 렌탈료가 유지됩니다.' +
    '<br><br>' +
    '<strong>의무 사용 기간</strong>은 위약금이 부과되는 최소 기간입니다. 이 기간이 지난 뒤 해지하면 별도 위약금 없이 자유로운 해지가 가능합니다. 약정 기간보다 짧은 게 일반적이며, 짧을수록 사용자에게 유리합니다.';
  function addRentalTermsHelp(){
    var rows = document.querySelectorAll('#ai-card-root .rental-terms .rt-r .rt-l');
    rows.forEach(function(label){
      if (label.dataset.bjHelpAdded) return;
      var key = label.textContent.trim();
      /* v0.5.38: '약정 기간' 라벨에만 통합 설명 박스 추가. '의무 사용 기간' 라벨은 skip */
      if (key !== '약정 기간') {
        label.dataset.bjHelpAdded = '1';
        return;
      }
      var details = document.createElement('details');
      details.className = 'help';
      details.innerHTML =
        '<summary aria-label="약정 기간·의무 사용 기간 설명"></summary>' +
        '<div class="help-pop">' + COMBINED_TERM_HELP + '</div>';
      label.appendChild(document.createTextNode(' '));
      label.appendChild(details);
      label.dataset.bjHelpAdded = '1';
    });
  }

  /* v0.5.47: 만기 후 소유권 이전 안내 chip — 반납 조건 제품 외에는 자동 추가.
     본사 정책: 렌탈 상품은 보통 약정 만기 후 소유권 이전 가능. "반납" 조건만 예외.
     판정: 페이지 어디든 "반납" 키워드(반납제품/반납조건/반납형/반납 후 등) 있으면 skip. */
  function addOwnershipNotice(){
    var rt = document.querySelector('#ai-card-root .rental-terms');
    if (!rt) return;
    if (rt.querySelector('.bj-ownership-row')) return;  /* idempotent */

    /* 반납 조건 검출 — 제품명 + 상세 영역 텍스트에 "반납" 키워드 검사 */
    var checkAreas = [
      document.querySelector('.prod_name'),
      document.querySelector('#ai-card-root'),
      document.querySelector('.prod_view_top'),
    ].filter(Boolean);
    var combinedText = checkAreas.map(function(el){ return el.textContent || ''; }).join(' ');
    /* "반납제품", "반납 제품", "반납조건", "반납형", "반납이 원칙", "반납 후 환불 불가" 등 */
    if (/반납\s*(제품|조건|형|이|후|만|상품)/.test(combinedText) || /반납\s*[\(\[]/.test(combinedText)) {
      rt.dataset.bjOwnershipChecked = 'returnable';
      return;
    }
    /* row 추가 — 다른 .rt-r와 동일 구조, .rt-v에 chip 강조.
       v0.5.48: .rt-l '소유권' 옆 ⓘ details.help 자동 부착. setupHelpClose가 글로벌
       selector라 외부 클릭/ESC 닫힘 + 1개만 열림 자동 처리. */
    var helpHtml =
      '<details class="help"><summary aria-label="소유권 이전 설명"></summary>' +
      '<div class="help-pop"><strong>약정 기간 만료 시 제품 소유권이 고객에게 이전됩니다.</strong>' +
      ' 별도 비용 없이 자동 전환되며, 만기 이후에는 자유롭게 사용·양도 가능합니다.' +
      ' 빌리조 렌탈 상품은 본사 정책상 대부분 소유권 이전형이며,' +
      ' 반납 조건 제품은 상품명·상세에 명시되어 있습니다.</div></details>';
    var row = document.createElement('div');
    row.className = 'rt-r bj-ownership-row';
    row.innerHTML =
      '<span class="rt-l" data-bj-help-added="1">소유권 ' + helpHtml + '</span>' +
      '<span class="rt-v bj-ownership-chip">만기 후 소유권 이전</span>';
    rt.appendChild(row);
    rt.dataset.bjOwnershipChecked = 'ownership';
  }

  /* v0.5.59: 페르소나 카드 아이콘 — 페르소나 제목 텍스트에 따라 고객을 묘사하는
     Tabler 아이콘으로 자동 매핑. 샘플 단계 — 우선 "1인·신혼"만 적용, 사용자 확인 후 확장. */
  var PERSONA_ICON_MAP = [
    { match: /1인|신혼|커플/, icon: 'ti-user-heart' },
    /* 다음 단계 확장 후보:
       { match: /가족|패밀리/, icon: 'ti-users' },
       { match: /맘|육아|아기|키즈/, icon: 'ti-baby-carriage' },
       { match: /시니어|노년|부모/, icon: 'ti-walk' },
       { match: /오피스|직장|프로/, icon: 'ti-briefcase' },
       { match: /원룸|자취/, icon: 'ti-building-cottage' }, */
  ];
  function personalizePersonaIcons(){
    document.querySelectorAll('#ai-card-root .p').forEach(function(card){
      if (card.dataset.bjPersonaIconSet) return;
      var titleEl = card.querySelector('.rec-p-title');
      var iconEl = card.querySelector('.p-top i');
      if (!titleEl || !iconEl) return;
      var title = titleEl.textContent || '';
      for (var i = 0; i < PERSONA_ICON_MAP.length; i++) {
        var rule = PERSONA_ICON_MAP[i];
        if (rule.match.test(title)) {
          iconEl.className = 'ti ' + rule.icon;
          card.dataset.bjPersonaIconSet = '1';
          break;
        }
      }
    });
  }

  /* v0.5.61: 모바일(≤600px)에서 .rec-p-level-N(매우 추천 등)을 .rec-p-title 옆으로
     DOM 이동 → 세로 공간 절약 + 페르소나명과 함께 직관적 그룹화. PC는 원래 위치 유지. */
  function arrangePersonaLevelMobile(){
    var isMobile = window.matchMedia('(max-width: 600px)').matches;
    document.querySelectorAll('#ai-card-root .p').forEach(function(card){
      var pTop = card.querySelector('.p-top');
      var titleEl = card.querySelector('.rec-p-title');
      var levelEl = card.querySelector('[class^="rec-p-level"], [class*=" rec-p-level"]');
      if (!pTop || !titleEl || !levelEl) return;
      if (isMobile) {
        if (levelEl.parentElement !== titleEl) {
          titleEl.appendChild(levelEl);
          levelEl.dataset.bjMovedMobile = '1';
        }
      } else if (levelEl.dataset.bjMovedMobile && levelEl.parentElement === titleEl) {
        pTop.appendChild(levelEl);
        delete levelEl.dataset.bjMovedMobile;
      }
    });
  }
  /* viewport 변화 시 재배치 */
  if (!window.__bjPersonaLevelResize) {
    window.__bjPersonaLevelResize = true;
    window.addEventListener('resize', function(){
      if (window.__bjPersonaLevelResizeTimer) clearTimeout(window.__bjPersonaLevelResizeTimer);
      window.__bjPersonaLevelResizeTimer = setTimeout(arrangePersonaLevelMobile, 100);
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 2.y) 하단 위젯 가시성 — AI 카드 완전 통과 후 노출 + 드래그 게스처 (v0.5.2)
  //
  //   * 페이지에 #ai-card-root 있을 때만 활성. 모든 제품에 동일 적용 (10914 한정 게이트 폐기)
  //   * 트리거: AI 카드 bottom이 viewport top 위로 완전히 올라간 시점 (r.bottom < 0)
  //     → "사용자가 카드를 끝까지 다 봤다"는 명확한 신호
  //   * 한 번 노출되면 sticky — 스크롤 백업해도 자동으로 사라지지 않음
  //     (사용자가 드래그·X 버튼·외부 탭으로만 명시적으로 닫음)
  //   * 드래그 게스처 (.bj-bar-handle에 등록):
  //     - 위로 드래그 ≥30px → 펼침 (.bj-bar-expanded)
  //     - 아래로 드래그 ≥30px → 접기 (.bj-bar-collapsed)
  //     - 더 아래로 드래그 ≥120px → 위젯 dismiss (slide-hidden)
  //     - 작은 movement (<10px) → 탭으로 간주, 펼침/접힘 토글
  //   * push (탭) — 접힘 상태에서 핸들 탭 시 펼침으로 복귀
  // ─────────────────────────────────────────────────────────────────────────
  function setupBottomBarVisibility(){
    if (window.__bjBarVisibilitySetup) return;

    /* v0.5.24: #billyjo-bottom-bar는 우리가 DOM 삭제하므로 .prod_view_bot.card.mt40만 사용 */
    var wrapper = document.querySelector('.prod_view_bot.card.mt40');
    if (!wrapper) return;
    var aiCard = document.querySelector('#ai-card-root');
    if (!aiCard) return;

    window.__bjBarVisibilitySetup = true;
    if (!wrapper.dataset.bjBarTransition) {
      wrapper.style.setProperty('transition',
        (wrapper.style.transition || '') + ', bottom 0.38s cubic-bezier(0.2,0.9,0.3,1)',
        'important');
      wrapper.dataset.bjBarTransition = '1';
    }
    /* v0.5.31: 위젯이 페이지 진입 시부터 접힌 상태(collapsed)로 항상 노출.
       이전 slide-hidden 초기값 폐기 — 사용자 핸들이 항상 보여야 다시 펼침 가능. */
    wrapper.classList.remove('bj-bar-slide-hidden');
    wrapper.classList.add('bj-bar-collapsed');
    wrapper.classList.remove('bj-bar-expanded');

    var SESSION_KEY = 'bjBarDismissed_' + (location.pathname.match(/prod_view\/(\d+)/) || [,'unknown'])[1];
    var manualHide = (function(){ try { return sessionStorage.getItem(SESSION_KEY) === '1'; } catch(e){ return false; } })();
    /* v0.5.31: 트리거 의미 변경 — show/hide 결정 → expand/collapse 결정.
       페이지 진입 시 항상 visible+collapsed. trigger 천이(oov ↔ inview) 시점에만
       자동으로 expand/collapse 적용 (hysteresis). 사용자가 수동 토글한 후에는 다음
       trigger 천이까지 사용자 결정이 유지됨. 사용자 명시적 dismiss는 핸들 ≥120px 드래그. */
    var lastTriggerState = null; /* 'oov' | 'inview' | null */
    function evalScroll(){
      var r = aiCard.getBoundingClientRect();
      var cardOutOfView = r.bottom < 80;
      var cardInView = r.bottom > 200;
      var newTrigger = null;
      if (cardOutOfView) newTrigger = 'oov';
      else if (cardInView) newTrigger = 'inview';
      /* 천이가 일어났을 때만 자동 적용 — 그 사이엔 사용자 수동 토글 유지 */
      if (newTrigger && newTrigger !== lastTriggerState) {
        lastTriggerState = newTrigger;
        if (newTrigger === 'oov') {
          wrapper.classList.remove('bj-bar-collapsed');
          wrapper.classList.add('bj-bar-expanded');
        } else {
          wrapper.classList.remove('bj-bar-expanded');
          wrapper.classList.add('bj-bar-collapsed');
        }
      }
      apply();
    }
    function apply(){
      wrapper.style.setProperty('display', 'block', 'important');
      if (manualHide) {
        wrapper.classList.add('bj-bar-slide-hidden');
        wrapper.style.setProperty('bottom', '-320px', 'important');
        wrapper.style.setProperty('pointer-events', 'none', 'important');
        return;
      }
      wrapper.classList.remove('bj-bar-slide-hidden');
      wrapper.classList.add('show');
      wrapper.style.setProperty('bottom', '0', 'important');
      wrapper.style.setProperty('pointer-events', 'auto', 'important');
      wrapper.style.setProperty('visibility', 'visible', 'important');
      wrapper.style.setProperty('opacity', '1', 'important');
    }

    /* v0.5.27: 우측 상단 X 버튼 제거 — ▾ 토글과 기능 중복으로 사용자 혼란.
       기존 인스턴스가 DOM에 남아있으면 제거 (CDN 캐시 stale 시점 데이터 정리) */
    var prevX = wrapper.querySelector('.bj-bar-dismiss-x');
    if (prevX) try { prevX.remove(); } catch(_){}

    // v0.5.2: 핸들 드래그 게스처
    setupHandleDragGesture(wrapper);

    // throttled scroll — 트리거 진입만 감지, 빠져나가도 hide 안 함 (sticky)
    var scrollPending = false;
    function onScroll(){
      if (scrollPending) return;
      scrollPending = true;
      window.requestAnimationFrame(function(){
        scrollPending = false;
        evalScroll();
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    evalScroll();  // 초기 평가
  }

  // v0.5.2: 핸들 드래그 — 위로/아래로 swipe로 펼침·접기·dismiss
  function setupHandleDragGesture(wrapper){
    var handle = wrapper.querySelector('.bj-bar-handle');
    if (!handle || handle.dataset.bjDragSetup) return;
    handle.dataset.bjDragSetup = '1';

    var startY = null, startX = null, moved = false, dragOffset = 0;
    var DRAG_TAP_THRESHOLD = 10;   // 이하면 탭으로 간주
    var DRAG_TOGGLE_THRESHOLD = 30; // 이상이면 펼침/접기 전환
    var DRAG_DISMISS_THRESHOLD = 120; // 아래로 이상이면 완전 dismiss
    /* 터치 후 브라우저가 발사하는 합성(compatibility) mousedown/mouseup 무시용.
       가드 없으면 touchend 토글(펼침) 직후 합성 mouseup이 또 토글(접힘) →
       "위젯이 나왔다가 바로 사라지는" 이중 토글 버그 (아이콘 V2 모바일 신고, 2026-06-07).
       마우스 전용 데스크톱은 touch 이벤트가 없어 가드에 안 걸림. */
    var lastTouchTs = 0;
    var TOUCH_MOUSE_SUPPRESS_MS = 800;

    function isExpanded(){ return wrapper.classList.contains('bj-bar-expanded'); }

    function onStart(e){
      if (e.touches) { lastTouchTs = Date.now(); }
      else if (Date.now() - lastTouchTs < TOUCH_MOUSE_SUPPRESS_MS) return; // 합성 마우스 무시
      var t = e.touches ? e.touches[0] : e;
      startY = t.clientY;
      startX = t.clientX;
      moved = false;
      dragOffset = 0;
      wrapper.style.setProperty('transition', 'none', 'important');
    }
    function onMove(e){
      if (startY === null) return;
      var t = e.touches ? e.touches[0] : e;
      var dy = t.clientY - startY;
      var dx = t.clientX - startX;
      if (Math.abs(dy) > DRAG_TAP_THRESHOLD || Math.abs(dx) > DRAG_TAP_THRESHOLD) moved = true;
      /* v0.5.34: dy>10일 때만 transform 적용 — 탭 시점(dy≈0)에 transform:translateY(0)을
         박으면 1500px 이상 PC의 CSS transform:translateX(-50%) 위치 보정이 깨져
         위젯이 오프셋되는 잠재 버그 차단 */
      if (dy > DRAG_TAP_THRESHOLD) {
        dragOffset = Math.min(dy, 200);
        /* v0.7.2: PC(≥1024px)는 중앙정렬 translateX(-50%) 보존 — 안 그러면 드래그 중 좌측 점프 */
        var tx = window.innerWidth >= 1024 ? 'translateX(-50%) ' : '';
        wrapper.style.setProperty('transform', tx + 'translateY(' + dragOffset + 'px)', 'important');
      }
      if (e.cancelable && Math.abs(dy) > DRAG_TAP_THRESHOLD) e.preventDefault();
    }
    function onEnd(e){
      if (e.changedTouches) { lastTouchTs = Date.now(); }
      else if (Date.now() - lastTouchTs < TOUCH_MOUSE_SUPPRESS_MS) return; // 합성 마우스 무시
      if (startY === null) return;
      var t = e.changedTouches ? e.changedTouches[0] : e;
      var dy = t.clientY - startY;
      wrapper.style.removeProperty('transform');
      wrapper.style.setProperty('transition',
        'max-height 0.32s cubic-bezier(0.2,0.9,0.3,1), bottom 0.38s cubic-bezier(0.2,0.9,0.3,1)',
        'important');

      if (!moved || Math.abs(dy) < DRAG_TAP_THRESHOLD) {
        // 탭으로 간주 — 펼침/접힘 토글
        toggleExpanded();
      } else if (dy <= -DRAG_TOGGLE_THRESHOLD) {
        // 위로 드래그 → 펼침
        wrapper.classList.remove('bj-bar-collapsed');
        wrapper.classList.add('bj-bar-expanded');
      } else if (dy >= DRAG_DISMISS_THRESHOLD) {
        // 아래로 크게 드래그 → 완전 dismiss (다음 노출까지)
        wrapper.classList.add('bj-bar-slide-hidden');
        wrapper.style.setProperty('bottom', '-320px', 'important');
        wrapper.style.setProperty('pointer-events', 'none', 'important');
        try { sessionStorage.setItem(
          'bjBarDismissed_' + (location.pathname.match(/prod_view\/(\d+)/) || [,'x'])[1], '1'); } catch(_){}
      } else if (dy >= DRAG_TOGGLE_THRESHOLD) {
        // 아래로 드래그 → 접기
        wrapper.classList.add('bj-bar-collapsed');
        wrapper.classList.remove('bj-bar-expanded');
      }
      startY = null; startX = null; moved = false;
    }
    function toggleExpanded(){
      /* v0.5.34: 명시적 토글 — 현재 expanded면 collapsed로, 그 외(collapsed/none)는 expanded로.
         이전 단순 toggle은 class가 둘 다 없거나 둘 다 있는 비정상 상태에서 의도와 다르게 동작. */
      var isExpandedNow = wrapper.classList.contains('bj-bar-expanded') &&
                           !wrapper.classList.contains('bj-bar-collapsed');
      if (isExpandedNow) {
        wrapper.classList.remove('bj-bar-expanded');
        wrapper.classList.add('bj-bar-collapsed');
      } else {
        wrapper.classList.remove('bj-bar-collapsed');
        wrapper.classList.add('bj-bar-expanded');
      }
    }

    handle.addEventListener('mousedown', onStart);
    handle.addEventListener('touchstart', onStart, { passive: true });
    document.addEventListener('mousemove', onMove);
    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('mouseup', onEnd);
    document.addEventListener('touchend', onEnd, { passive: true });
    document.addEventListener('touchcancel', onEnd, { passive: true });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 2.x) 제품별 AI 카드 HTML 주입 (룰북 v0.4.2)
  //
  //   billyjo-cards 레포 cards/{prodNo}.html이 존재하면 페이지에 주입한다.
  //   - 자기 inject.js의 commit hash를 추출해 같은 commit의 카드 fetch (캐시 일관성)
  //   - 404면 silent skip — 패치(헤더·하단위젯)만 적용
  //   - 1회만 주입 (window.__bjAiCardFetched 가드)
  // ─────────────────────────────────────────────────────────────────────────
  function getOwnCommitHash(){
    try {
      var src = (document.currentScript && document.currentScript.src) || '';
      if (!src) {
        var scripts = document.getElementsByTagName('script');
        for (var i = scripts.length - 1; i >= 0; i--) {
          if (/billyjo-(?:inject|detailcard|cards)@/.test(scripts[i].src)) { src = scripts[i].src; break; }
        }
      }
      var m = src.match(/billyjo-(?:inject|detailcard|cards)@([0-9a-f]{7,40}|main)\//);
      return m ? m[1] : 'main';
    } catch(e) { return 'main'; }
  }

  function fetchAndInjectAICard(){
    if (window.__bjAiCardFetched) return;
    var path = location.pathname || '';
    var m = path.match(/\/prod_view\/(\d+)/);
    if (!m) return;
    var prodNo = m[1];
    window.__bjAiCardFetched = true;

    var url = 'https://cdn.jsdelivr.net/gh/billyjo-appsilon/billyjo-cards@main/cards/' + prodNo + '.html';
    fetch(url, { cache: 'force-cache' })
      .then(function(r){ return r.ok ? r.text() : null; })
      .then(function(html){
        if (!html) return;
        if (document.querySelector('#ai-card-root')) return;  // 이미 주입됨
        // 삽입 위치: .prod_view_bot.mt10 (상품정보) 바로 앞.
        // 없으면 .prod_view_detail 앞에, 그것도 없으면 .prod_view_top 뒤에.
        var anchor =
          document.querySelector('.prod_view_bot.mt10') ||
          document.querySelector('.prod_view_detail') ||
          (function(){
            var top = document.querySelector('.prod_view_top');
            return top && top.nextElementSibling;
          })();
        if (!anchor) return;
        var holder = document.createElement('div');
        holder.innerHTML = html;
        // holder 안의 자식들을 순서대로 anchor 앞에 삽입
        while (holder.firstChild) {
          anchor.parentNode.insertBefore(holder.firstChild, anchor);
        }
      })
      .catch(function(){ /* silent */ });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 2.y) 고객 후기 섹션 — .prod_view_top 바로 다음에 삽입 (이미지+가격 → 후기 → AI 카드)
  //   데이터: admin2 /v1/reviews?brand=&category= (CORS *). brand/category는 페이지에서 추출.
  //   디자인: 사진 있는 후기 우선 + 포토 갤러리 + PC 한 줄에 1건 + 페르소나 칩 + 아이디 마스킹.
  //   출처는 표시광고법 준수해 정직 표기(de-emphasize는 하되 미표시 금지). 아정당은 admin2에서 hidden→비노출.
  // ─────────────────────────────────────────────────────────────────────────
  var BJ_RV_ANALYSIS = {
    '코웨이|정수기':{avg:4.9,s:'얼음·물맛과 디자인 만족도가 높고, 설치가 친절했다는 평이 많아요.'},
    '코웨이|공기청정기':{avg:4.8,s:'필터 성능과 디자인에 만족하는 평이 많아요.'},
    '코웨이|비데':{avg:4.8,s:'설치가 친절하고 사용이 편리하다는 평이 많아요.'},
    '청호나이스|정수기':{avg:4.9,s:'얼음과 물맛이 좋고, 디자인 만족도가 높다는 평이 많아요.'},
    '청호나이스|비데':{avg:4.9,s:'설치가 친절하고 가성비가 좋다는 평이 많아요.'},
    'SK매직|정수기':{avg:5.0,s:'얼음 기능과 디자인 만족도가 높고, 설치가 깔끔했다는 평이 많아요.'},
    'SK매직|공기청정기':{avg:4.9,s:'성능과 디자인에 만족하고, 소음이 적다는 평이 많아요.'},
    '쿠쿠|음식물처리기':{avg:4.7,s:'음식물 쓰레기 처리가 편해졌다는 평이 많아요. 냄새 관련 의견은 갈리는 편이에요.'},
    '쿠쿠|제습기':{avg:4.8,s:'제습력에 만족하는 평이 많아요. 소음 의견도 일부 있어요.'},
    '쿠쿠|제빙기':{avg:4.8,s:'얼음이 빠르고 넉넉하게 나온다는 평이 많아요.'},
    '쿠쿠|공기청정기':{avg:4.8,s:'공기 개선 체감과 디자인에 만족하는 평이 많아요.'},
    '쿠쿠|식기세척기':{avg:4.7,s:'설거지 부담이 줄고 설치가 편했다는 평이 많아요.'},
    '쿠쿠|청소기':{avg:4.8,s:'가볍고 흡입력·먼지통 관리가 편하다는 평이 많아요.'},
    '쿠쿠|인덕션':{avg:4.8,s:'화력과 디자인에 만족하는 평이 많아요.'},
    '위닉스|제습기':{avg:4.8,s:'제습 성능과 디자인에 만족하는 평이 많아요. 작동 소음 의견도 일부 있어요.'},
    '위닉스|공기청정기':{avg:4.8,s:'디자인과 사용 편의에 만족하고, 배송이 빨랐다는 평이 많아요.'},
    '위닉스|건조기':{avg:4.9,s:'건조 성능과 디자인에 만족하는 평이 많아요.'},
    '위닉스|에어컨':{avg:4.7,s:'냉방과 설치에 만족하는 평이 많아요. 작동 소음 의견도 일부 있어요.'},
    '교원웰스|정수기':{avg:4.9,s:'깔끔한 디자인과 물맛에 만족하고, 설치가 친절했다는 평이 많아요.'},
    '교원웰스|비데':{avg:4.9,s:'설치가 친절하고 사용이 편하다는 평이 많아요.'},
    '교원웰스|공기청정기':{avg:4.8,s:'디자인 만족도가 높고, 작동이 조용한 편이라는 평이에요.'},
    '삼성|정수기':{avg:5.0,s:'전문적인 설치와 기대 이상이라는 평이 많아요.'},
    '삼성|에어컨':{avg:4.6,s:'냉방·무풍 성능에 만족하는 평이 많아요. 설치 관련 의견도 일부 있어요.'},
    '삼성|냉장고':{avg:4.8,s:'용량과 디자인에 만족하는 평이 많아요.'},
    '삼성|청소기':{avg:4.7,s:'흡입력과 가벼움에 만족하는 평이 많아요.'},
    '삼성|식기세척기':{avg:4.7,s:'설거지 편의와 건조력에 만족하는 평이 많아요.'},
    'LG|정수기':{avg:5.0,s:'퓨리케어 정수 성능과 친절한 설치, 렌탈 혜택에 만족하는 평이 많아요.'},
    'LG|의류관리기':{avg:5.0,s:'옷 관리가 편해졌다는 평이 많고, 디자인 만족도도 높아요.'},
    'LG|에어컨':{avg:4.7,s:'냉방 성능과 디자인에 만족하는 평이 많아요.'},
    'LG|냉장고':{avg:5.0,s:'성능과 빠른 배송에 만족하는 평이에요.'},
    'LG|건조기':{avg:5.0,s:'건조 성능에 만족하는 평이 많아요.'},
    'LG|식기세척기':{avg:5.0,s:'설거지 편의와 디자인에 만족하는 평이 많아요.'},
    'LG|청소기':{avg:4.9,s:'흡입력과 사용 편의에 만족하는 평이 많아요.'},
    'LG|공기청정기':{avg:5.0,s:'자동 운전과 공기 개선 체감에 만족하는 평이에요.'},
    '청호나이스|매트리스':{avg:4.9,s:'단단한 지지력과 편안함에 만족하는 평이 많아요.'}
  };
  function bjRvIsOfficialSeller(n){ n=n||''; if(/공식\s*파트너|공식\s*(영업)?\s*대리점/.test(n)) return false; return /공식/.test(n); }
  // 이상적 출처 표기 = 실제 채널을 구체적으로 (정확·다양·신뢰·준법)
  function bjRvChannel(s, brand){
    // v0.7.2: 표시 라벨은 '브랜드 공식 판매처'로 통일하되, 실제 수집 채널은 '자세히'(rv-realsrc)로 공개.
    return (brand?brand+' ':'')+'공식 판매처';
  }
  // 같은 출처 연속 3개 이상 방지(최대 2연속). 다른 출처 남아있을 때만 회피.
  function bjRvSpread(arr){
    var bk={}, order=[];
    arr.forEach(function(x){ var k=bjRvChannel(x.source,x.brand); if(!bk[k]){bk[k]=[];order.push(k);} bk[k].push(x); });
    var out=[], last=null, run=0;
    while(out.length<arr.length){
      var cands=order.filter(function(k){return bk[k].length;}).sort(function(a,b){return bk[b].length-bk[a].length;});
      var pick=null;
      for(var i=0;i<cands.length;i++){ if(!(cands[i]===last && run>=2)){ pick=cands[i]; break; } }
      if(pick===null) pick=cands[0];
      out.push(bk[pick].shift());
      if(pick===last) run++; else { last=pick; run=1; }
    }
    return out;
  }
  function bjRvEsc(s){ return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];}); }
  // 제품 제목→모델코드 정규화 (수집기 extractModel과 동일 규칙). 제품 단위 후기 매칭 키.
  function bjRvExtractModel(title){
    var s=String(title||'').toUpperCase();
    var cand=s.match(/[A-Z]{2,}[A-Z0-9-]*[0-9][A-Z0-9-]*/g);
    if(!cand) return null;
    var STOP=/^(LED|USB|BLDC|HEPA|UVC?|KC|AI|TV|PC|3D|2D|[0-9]+[LWGKMH]|V[0-9]+|NEW|HD|FHD|UHD)$/;
    var m=cand.filter(function(x){return x.length>=4&&x.length<=30&&!STOP.test(x)&&/[0-9]/.test(x)&&/[A-Z]/.test(x);});
    if(!m.length) return null;
    m.sort(function(a,b){return b.length-a.length;});
    return m[0].replace(/[_].*$/,'').replace(/-$/,'');
  }
  function bjRvStars(n){ n=Math.max(1,Math.min(5,Math.round(n||5))); return '★★★★★'.slice(0,n)+'☆☆☆☆☆'.slice(0,5-n); }
  function bjRvPhoto(r){ return r.photo_url || (r.photos && r.photos[0]) || ''; }
  function bjRvPersona(t){
    t=t||'';
    var R=[[/아기|유아|아이|육아|이유식|분유|애기|어린이|신생아/,'유아맘'],[/신혼|혼수|결혼|예단|남편|아내|와이프|부부/,'신혼·부부'],
      [/부모님|어머니|아버지|엄마|아빠|시부모|장모|장인|효도|선물해|선물로/,'부모님 선물'],[/혼자|자취|원룸|1인|혼자살/,'1인가구'],
      [/강아지|고양이|반려|냥이|댕댕|반려견|반려묘/,'반려가구'],[/사무실|매장|카페|업소|직원|회사|사업장|가게|영업장/,'사업장'],
      [/이사|새집|입주|신축|새 ?아파트/,'새집·이사'],[/부모님댁|친정|시댁/,'부모님댁']];
    for(var i=0;i<R.length;i++){ if(R[i][0].test(t)) return R[i][1]; } return '';
  }
  function bjRvAuthor(a){ a=(a==null?'':String(a)).trim(); if(!a) return '익명고객'; if(a.indexOf('*')>=0) return a; return a.slice(0, a.length<=2?1:2)+'***'; }

  /* v0.7.0: 제품 페르소나('이런 분에게 추천해요')와 일치하는 후기를 앞으로 정렬 + 태그.
     prodRe=카드 페르소나 제목 매칭, rvRe=후기 본문 매칭. 둘 다 충족 시 해당 후기를 '추천 대상'으로 본다. */
  var BJ_RV_CONCEPTS = [
    { key:'신혼·부부', prodRe:/신혼|부부|커플/, rvRe:/신혼|혼수|결혼|부부|남편|아내|와이프|예단/ },
    { key:'1인가구', prodRe:/1인|자취|혼자|원룸/, rvRe:/혼자|자취|원룸|1인|혼자살/ },
    { key:'가족', prodRe:/가족|패밀리|식구|3\s*-?\s*4\s*인|아이|키즈|육아/, rvRe:/아이|육아|아기|유아|가족|식구|애기|어린이|신생아|이유식|분유/ },
    { key:'사업장', prodRe:/오피스|사무|매장|업소|사업|영업|직장|회사|업무/, rvRe:/사무실|매장|카페|업소|회사|사업장|가게|영업장|직원/ },
    { key:'시니어·부모', prodRe:/시니어|노년|부모|어르신|실버/, rvRe:/부모님|어머니|아버지|효도|선물해|선물로|어르신/ },
    { key:'반려가구', prodRe:/반려|펫|강아지|고양이/, rvRe:/강아지|고양이|반려|냥이|댕댕|반려견|반려묘/ }
  ];
  function bjRvProductConcepts(){
    var out=[], titles=document.querySelectorAll('#ai-card-root .persona .rec-p-title');
    if(!titles.length) return out;
    var all=''; for(var i=0;i<titles.length;i++){ all += ' ' + (titles[i].textContent||''); }
    BJ_RV_CONCEPTS.forEach(function(c){ if(c.prodRe.test(all)) out.push(c); });
    return out;
  }
  function bjRvMatchPersona(text, cons){
    text=text||''; for(var i=0;i<cons.length;i++){ if(cons[i].rvRe.test(text)) return cons[i].key; } return '';
  }
  function bjRvFloatMatched(arr, cons){
    if(!cons.length) return arr;
    var m=[], r=[]; arr.forEach(function(x){ (bjRvMatchPersona(x.text, cons)?m:r).push(x); });
    return m.concat(r);
  }

  function bjRvInjectCss(){
    if (document.getElementById('bj-rv-style')) return;
    var st=document.createElement('style'); st.id='bj-rv-style';
    st.textContent=[
      "#bj-reviews-root{font-family:'Pretendard',sans-serif;background:#fff;border:1px solid #e6e8ee;border-radius:12px;padding:20px;margin:14px 0;min-width:0;clear:both;box-sizing:border-box;color:#222}",
      "#bj-reviews-root *{box-sizing:border-box}",
      "#bj-reviews-root .rv-summary{display:flex;align-items:center;gap:16px;flex-wrap:wrap;padding-bottom:14px;border-bottom:1px solid #e6e8ee;margin-bottom:14px;min-width:0}",
      "#bj-reviews-root .rv-score{text-align:center;flex:0 0 auto}",
      "#bj-reviews-root .rv-score .big{font-size:30px;font-weight:800;color:#0838F8;line-height:1}",
      "#bj-reviews-root .rv-score .big small{font-size:15px;color:#aab;font-weight:600}",
      "#bj-reviews-root .rv-score .st{color:#ffb400;font-size:14px;letter-spacing:1px;margin-top:4px}",
      "#bj-reviews-root .rv-score .lbl{font-size:11px;color:#667;margin-top:3px}",
      "#bj-reviews-root .rv-analysis{flex:1 1 280px;min-width:0;background:linear-gradient(135deg,#eef3ff,#f7f9ff);border:1px solid #d6e0ff;border-radius:12px;padding:11px 13px}",
      "#bj-reviews-root .rv-analysis .a-head{font-size:12.5px;font-weight:800;color:#0838F8;margin-bottom:3px}",
      "#bj-reviews-root .rv-analysis .a-body{font-size:13px;color:#33405c;line-height:1.5;word-break:keep-all}",
      "#bj-reviews-root .rv-fallback{font-size:12px;color:#5f656d;background:#f1f3f5;border:1px solid #e2e6ea;border-radius:10px;padding:8px 12px;margin-bottom:12px;line-height:1.45}",
      "#bj-reviews-root .rv-fallback b{color:#3a3f47}",
      "#bj-reviews-root .rv-photos-tit{font-size:13px;font-weight:800;margin:2px 0 9px}",
      "#bj-reviews-root .rv-photos-tit span{color:#667;font-weight:600;font-size:12px}",
      "#bj-reviews-root .rv-photos{display:flex;gap:8px;overflow-x:auto;padding-bottom:8px;margin-bottom:8px;-webkit-overflow-scrolling:touch}",
      "#bj-reviews-root .rv-photos img{width:96px;height:96px;flex:0 0 auto;border-radius:10px;object-fit:cover;background:#eef1f6;cursor:pointer;border:1px solid #e6e8ee}",
      "#bj-reviews-root .rv-filter{display:flex;gap:6px;margin-bottom:12px}",
      "#bj-reviews-root .rv-filter button{font:inherit;font-size:12px;padding:5px 12px;border-radius:999px;cursor:pointer;border:1px solid #e6e8ee;background:#fff;color:#555}",
      "#bj-reviews-root .rv-filter button.on{background:#eef3ff;border-color:#0838F8;color:#0838F8;font-weight:700}",
      "#bj-reviews-root .rv-list{display:flex;flex-direction:column}",
      "#bj-reviews-root .rv-card{display:flex;gap:14px;padding:15px 0;border-bottom:1px solid #e6e8ee;min-width:0}",
      "#bj-reviews-root .rv-card:last-child{border-bottom:0}",
      "#bj-reviews-root .rv-photo{width:118px;height:118px;flex:0 0 auto;border-radius:10px;object-fit:cover;background:#eef1f6;cursor:pointer;border:1px solid #e6e8ee}",
      "#bj-reviews-root .rv-body{flex:1 1 auto;min-width:0}",
      "#bj-reviews-root .rv-stars{color:#ffb400;font-size:14px;letter-spacing:1px}",
      "#bj-reviews-root .rv-persona{display:inline-block;font-size:11.5px;font-weight:700;color:#0838F8;background:#eef3ff;border:1px solid #d6e0ff;border-radius:999px;padding:3px 11px;margin:5px 0 2px}",
      "#bj-reviews-root .rv-persona.rv-persona-match{color:#fff;background:#0838F8;border-color:#0838F8}",
      "#bj-reviews-root .rv-text{font-size:13.5px;line-height:1.6;color:#333;margin:6px 0 8px;word-break:break-word}",
      "#bj-reviews-root .rv-meta{font-size:11.5px;color:#99a;display:flex;gap:7px;flex-wrap:wrap;align-items:center;min-width:0}",
      "#bj-reviews-root .rv-author{color:#c4c9d2;font-weight:400}",
      "#bj-reviews-root .rv-srcbtn{font:inherit;font-size:10.5px;color:#9aa0aa;background:none;border:0;border-bottom:1px dotted #c4c9d2;padding:0 0 1px;cursor:pointer}",
      "#bj-reviews-root .rv-srcbtn.shown{border-bottom:0;color:#aab0ba;cursor:default}",
      "#bj-reviews-root .rv-more{text-align:center;margin-top:16px}",
      "#bj-reviews-root .rv-more button{font:inherit;font-size:13px;padding:10px 22px;border-radius:9px;border:1px solid #e6e8ee;background:#fff;color:#444;cursor:pointer}",
      "#bj-reviews-root .rv-foot{font-size:9px;color:#c4c9d2;margin-top:14px;line-height:1.5;text-align:center}",
      "#bj-reviews-root .rv-srctoggle{background:none;border:0;padding:0 1px;margin:0;font-size:9px;color:#8a909a;text-decoration:underline;cursor:pointer;font-family:inherit;-webkit-appearance:none}",
      "#bj-reviews-root .rv-realsrc{display:none;color:#aab;margin-left:4px}",
      "#bj-reviews-root.bj-rv-showsrc .rv-realsrc{display:inline}",
      "#bj-rv-lb{position:fixed;inset:0;background:rgba(0,0,0,.82);display:none;align-items:center;justify-content:center;z-index:100000;padding:20px}",
      "#bj-rv-lb.on{display:flex}",
      "#bj-rv-lb img{max-width:100%;max-height:90vh;border-radius:8px}",
      "#bj-rv-lb .x{position:absolute;top:16px;right:18px;color:#fff;font-size:32px;cursor:pointer;line-height:1}",
      "@media(max-width:600px){#bj-reviews-root{padding:14px}#bj-reviews-root .rv-photo{width:88px;height:88px}#bj-reviews-root .rv-photos img{width:84px;height:84px}#bj-reviews-root .rv-score .big{font-size:26px}}"
    ].join('');
    document.head.appendChild(st);
  }
  function bjRvLightbox(){
    var lb=document.getElementById('bj-rv-lb');
    if(!lb){ lb=document.createElement('div'); lb.id='bj-rv-lb'; lb.innerHTML='<span class="x">&times;</span><img alt="">';
      lb.addEventListener('click', function(){ lb.classList.remove('on'); }); document.body.appendChild(lb); }
    return lb;
  }

  // 미리보기 게이트 — 이 상품번호에만 후기 섹션 노출. 전체 적용 시 빈 배열([])로 변경.
  var BJ_RV_ONLY = []; // 전체 상품 적용 (빈 배열=모든 prod_view)
  function fetchAndInjectReviews(){
    if (window.__bjReviewsFetched) return;
    var __m = (location.pathname||'').match(/\/prod_view\/(\d+)/);
    if (!__m) return;
    if (BJ_RV_ONLY.length && BJ_RV_ONLY.indexOf(__m[1]) < 0) return; // 미리보기 대상 아님
    var topEl = document.querySelector('.prod_view_top');
    if (!topEl) return; // 페이지 미렌더 — 다음 runAll 재시도
    // 브랜드 추출 (스펙표 '브랜드' 행 → 없으면 제품명 첫 토큰)
    function txt(sel){ var e=document.querySelector(sel); return e?(e.textContent||'').replace(/\s+/g,' ').trim():''; }
    var nameTxt = txt('.prod_name b') || txt('.prod_name') || document.title || '';
    var brand='';
    var ths = document.querySelectorAll('.prod_table th');
    for (var i=0;i<ths.length;i++){ if(/브랜드/.test(ths[i].textContent||'')){ var td=ths[i].nextElementSibling; if(td) brand=(td.textContent||'').trim(); break; } }
    if(!brand) brand=(nameTxt.split(/\s+/)[0]||'').trim();
    var BMAP={'SK':'SK매직','웰스':'교원웰스','교원':'교원웰스','청호':'청호나이스','LG구독':'LG','현대렌탈케어':'현대큐밍'};
    brand = BMAP[brand] || brand;
    // 카테고리 (제품명+스펙 키워드)
    var MAP=[['얼음정수기','정수기'],['정수기','정수기'],['연수기','연수기'],['비데','비데'],['공기청정기','공기청정기'],['청정기','공기청정기'],['제습기','제습기'],['가습기','가습기'],['음식물처리기','음식물처리기'],['음식물 처리기','음식물처리기'],['제빙기','제빙기'],['의류관리기','의류관리기'],['스타일러','의류관리기'],['식기세척기','식기세척기'],['인덕션','인덕션'],['전기레인지','인덕션'],['세탁기','세탁기'],['건조기','건조기'],['에어컨','에어컨'],['김치냉장고','냉장고'],['냉장고','냉장고'],['로봇청소기','청소기'],['청소기','청소기'],['안마의자','안마의자'],['매트리스','매트리스'],['침대','매트리스']];
    var spec = (txt('.prod_table_wrap')+' '+nameTxt), category='';
    for (var k=0;k<MAP.length;k++){ if(spec.indexOf(MAP[k][0])>=0){ category=MAP[k][1]; break; } }
    if(!brand || !category) return; // 분류 불가 → 후기 미표시(다음 runAll 재시도)
    // 모델코드 추출 (제품 단위 매칭용). .model_name(예 "CHPI-7400N_V2 4개월관리") 우선, 없으면 제품명.
    var model = bjRvExtractModel(txt('.model_name')+' '+nameTxt);
    // 삽입 위치: AI 카드의 '상세 스펙'(SLOT6) 바로 앞 = '이런 분에게 추천해요'(SLOT5) 다음.
    // 카드는 async 주입이라 로드 대기(최대 4초), 카드 없으면 .prod_view_top 다음으로 폴백.
    var anchor=null, parent=null, card=document.querySelector('#ai-card-root');
    if(card){ var secs=card.querySelectorAll('.sec-t'); for(var si=0;si<secs.length;si++){ if(/상세\s*스펙/.test(secs[si].textContent||'')){ anchor=secs[si]; parent=secs[si].parentNode; break; } } }
    if(!anchor){
      if(!window.__bjRvFirst) window.__bjRvFirst=Date.now();
      if(Date.now()-window.__bjRvFirst < 4000) return; // 카드 로드 대기
      parent=topEl.parentNode; anchor=topEl.nextSibling; // 폴백: 이미지+가격 다음
    }
    window.__bjReviewsFetched = true;
    if (document.getElementById('bj-reviews-root')) return;

    bjRvInjectCss();
    var root=document.createElement('div'); root.id='bj-reviews-root';
    root.style.display='none';
    (parent||topEl.parentNode).insertBefore(root, anchor);

    var API='https://admin2-api.billyjo.co.kr/v1/reviews';
    var shown=8, photoOnly=true, items=[], fallbackLevel=''; // ''=정확모델, 'line'=동일라인, 'brand'=브랜드폴백
    function render(){
      var withP=items.filter(function(r){return bjRvPhoto(r);});
      var noP=items.filter(function(r){return !bjRvPhoto(r);});
      var prodCon=bjRvProductConcepts();  // 제품이 타깃하는 페르소나 개념
      // 페르소나 일치 후기를 각 그룹 앞으로 (포토리뷰 우선 구조는 유지)
      var listSrc = photoOnly ? bjRvFloatMatched(bjRvSpread(withP), prodCon)
                              : bjRvFloatMatched(bjRvSpread(withP), prodCon).concat(bjRvFloatMatched(bjRvSpread(noP), prodCon));
      var galleryP = bjRvFloatMatched(withP, prodCon);  // 갤러리 썸네일도 일치 페르소나 먼저
      if(!items.length){ root.style.display='none'; return; }
      root.style.display='';
      var an=BJ_RV_ANALYSIS[brand+'|'+category];
      var avg=an?an.avg:(items.reduce(function(a,r){return a+(r.stars||5);},0)/items.length);
      var h='';
      h+='<div class="rv-summary"><div class="rv-score"><div class="big">'+avg.toFixed(1)+'<small>/5</small></div><div class="st">'+bjRvStars(avg)+'</div><div class="lbl">구매 만족도</div></div>';
      if(an){ h+='<div class="rv-analysis"><div class="a-head">📊 빌리조 분석</div><div class="a-body">'+bjRvEsc(an.s)+'</div></div>'; }
      h+='</div>';
      if(fallbackLevel==='line'){ h+='<div class="rv-fallback">이 제품은 아직 등록된 후기가 없어, <b>같은 모델라인('+bjRvEsc(brand)+')</b>의 실제 후기를 보여드려요.</div>'; }
      else if(fallbackLevel==='brand'){ h+='<div class="rv-fallback">이 제품은 아직 등록된 후기가 없어, <b>동일 브랜드('+bjRvEsc(brand)+')</b>의 유사 제품 후기를 보여드려요.</div>'; }
      if(withP.length){ h+='<div class="rv-photos-tit">📸 포토리뷰 <span>'+withP.length+'장</span></div><div class="rv-photos">';
        galleryP.slice(0,20).forEach(function(r){ h+='<img loading="lazy" src="'+bjRvEsc(bjRvPhoto(r))+'" alt="포토리뷰" data-full="'+bjRvEsc(bjRvPhoto(r))+'">'; }); h+='</div>'; }
      h+='<div class="rv-filter"><button data-f="1" class="'+(photoOnly?'on':'')+'">📷 포토리뷰만 ('+withP.length+')</button><button data-f="0" class="'+(photoOnly?'':'on')+'">전체 ('+items.length+')</button></div>';
      h+='<div class="rv-list">';
      listSrc.slice(0,shown).forEach(function(r){
        var ph=bjRvPhoto(r), src=bjRvChannel(r.source,r.brand);
        var mp=bjRvMatchPersona(r.text, prodCon);              // 제품 페르소나와 일치하면 그 라벨
        var persona=mp||bjRvPersona(r.text);                   // 일치 우선, 아니면 일반 추론
        h+='<div class="rv-card">';
        if(ph) h+='<img class="rv-photo" loading="lazy" src="'+bjRvEsc(ph)+'" alt="후기사진" data-full="'+bjRvEsc(ph)+'">';
        h+='<div class="rv-body"><div class="rv-stars">'+bjRvStars(r.stars)+'</div>'
          +(persona?'<div><span class="rv-persona'+(mp?' rv-persona-match':'')+'">'+(mp?'✓ ':'')+bjRvEsc(persona)+(mp?' 추천 대상':'')+'</span></div>':'')
          +'<div class="rv-text">'+bjRvEsc(r.text)+'</div>'
          +'<div class="rv-meta"><span class="rv-author">'+bjRvEsc(src)+' 구매자 후기(출처)</span>'+(r.reviewed_at?'<span>· '+bjRvEsc(r.reviewed_at)+'</span>':'')+'<span class="rv-realsrc">· 수집 출처: '+bjRvEsc(r.source||'-')+'</span></div></div></div>';
      });
      h+='</div>';
      if(!listSrc.length) h+='<div class="rv-foot" style="text-align:center;padding:10px 0">사진 있는 후기가 아직 없어요. 전체를 눌러보세요.</div>';
      if(listSrc.length>shown) h+='<div class="rv-more"><button id="bj-rv-more">후기 더 보기 ('+(listSrc.length-shown)+'+)</button></div>';
      h+='<div class="rv-foot">공식 판매처 등 실제 구매처에서 수집한 고객 리뷰입니다. 각 후기의 실제 수집 출처는 <button type="button" id="bj-rv-srctoggle" class="rv-srctoggle">출처 자세히</button>에서 확인할 수 있습니다.</div>';
      root.innerHTML=h;
      var lb=bjRvLightbox(), lbi=lb.querySelector('img');
      Array.prototype.forEach.call(root.querySelectorAll('.rv-srcbtn'),function(b){ b.onclick=function(){ if(b.classList.contains('shown')) return; b.textContent='출처: '+b.getAttribute('data-src'); b.classList.add('shown'); }; });
      Array.prototype.forEach.call(root.querySelectorAll('[data-full]'),function(im){ im.onclick=function(){ lbi.src=im.getAttribute('data-full'); lb.classList.add('on'); }; });
      Array.prototype.forEach.call(root.querySelectorAll('.rv-filter button'),function(b){ b.onclick=function(){ photoOnly=b.getAttribute('data-f')==='1'; shown=8; render(); }; });
      var mb=document.getElementById('bj-rv-more'); if(mb) mb.onclick=function(){ shown+=8; render(); };
      var stg=document.getElementById('bj-rv-srctoggle'); if(stg) stg.onclick=function(){ var on=root.classList.toggle('bj-rv-showsrc'); stg.textContent=on?'닫기':'자세히'; };
    }
    function fetchJson(qs){ return fetch(API+'?'+qs+'&limit=80').then(function(r){return r.json();}).then(function(j){return (j&&j.items)||[];}).catch(function(){return [];}); }
    // 모델 라인 키: 알파벳 접두 + 첫 숫자. 예 CHPI-7400N → 'CHPI-7' (아이콘 V2/V3/미니 묶음)
    function lineKey(m){ if(!m) return ''; var x=String(m).toUpperCase().match(/^([A-Z]+-?[0-9])/); return x?x[1]:String(m).toUpperCase().slice(0,4); }
    // 폴백: 1) 정확 모델 → 2) 동일 브랜드·동일 모델라인 → 3) 동일 브랜드+카테고리
    function fallbackChain(){
      fetchJson('brand='+encodeURIComponent(brand)+'&category='+encodeURIComponent(category)).then(function(pool){
        if(!pool.length){ root.style.display='none'; return; }
        if(model){
          var lk=lineKey(model);
          var line=pool.filter(function(r){ return r.model && lineKey(r.model)===lk; });
          if(line.length){ items=line; fallbackLevel='line'; render(); return; }
        }
        items=pool; fallbackLevel='brand'; render();
      });
    }
    if(model){
      fetchJson('model='+encodeURIComponent(model)).then(function(it){
        if(it.length){ items=it; fallbackLevel=''; render(); } else fallbackChain();
      });
    } else fallbackChain();
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 2.z) 페이지 본문 정리 — AI 카드와 중복되는 .prod_table_wrap hide +
  //      #livePriceTable 컬럼 축소 (약정기간 + 최종 할인가만)
  //
  //   AI 카드 SLOT 3가 이미 .prod_table_wrap의 스펙 정보를 흡수했으므로 원본 hide.
  //   #livePriceTable은 본문에 그대로 두되, 사용자 룰에 따라 6개 컬럼 중
  //   2개(약정기간·최종 할인가)만 노출 — 나머지 컬럼(관리유형·관리주기·프로모션·이달 할인가) hide.
  //   "카드사 할인" 자체는 카드 안에 표시하지 않음 (.card_sale 페이지 본문 그대로).
  //   AI 카드가 페이지에 있을 때만 적용.
  // ─────────────────────────────────────────────────────────────────────────
  function hideOriginalSpecsAndSimplifyLpt(){
    // prod_view 페이지에서만 동작
    if (!/\/prod_view\/\d+/.test(location.pathname || '')) return;

    // (1) .prod_table_wrap hide — AI 카드가 있을 때만 (SLOT 3와 중복이라 카드 있으면 정보 손실 없음;
    //     카드 없으면 본문 spec 표가 유일한 정보원이므로 보존)
    if (document.querySelector('#ai-card-root')) {
      var ptw = document.querySelector('.prod_table_wrap');
      if (ptw) ptw.style.setProperty('display', 'none', 'important');
    }

    // (2) #livePriceTable 컬럼 축소 — nth-child 기반 hide
    //     col 0 관리유형(nth=1)·col 2 관리주기(nth=3)·col 3 프로모션(nth=4)·col 4 이달 할인가(nth=5) hide
    //     col 1 약정기간(nth=2)·col 5 최종 할인가(nth=6) 유지
    var lpt = document.querySelector('#livePriceTable');
    if (lpt && !lpt.dataset.bjLptSimplified) {
      var hideNth = [1, 3, 4, 5];
      hideNth.forEach(function(n){
        lpt.querySelectorAll(
          'thead tr > *:nth-child(' + n + '), tbody tr > *:nth-child(' + n + ')'
        ).forEach(function(c){
          c.style.setProperty('display', 'none', 'important');
        });
      });
      lpt.dataset.bjLptSimplified = '1';
    }

    // (3) lptTable 데이터 채우기
    populateLptFromMonthBoxes();

    // (3b) .card_sale (제휴카드 안내) 강제 펼침 — 카드별 할인 정보 가시화
    var cs = document.querySelector('.card_sale');
    if (cs && !cs.dataset.bjOpened) {
      var ul = cs.querySelector('ul');
      if (ul) ul.style.setProperty('display', 'block', 'important');
      var closeBtn = cs.querySelector('.close_btn');
      if (closeBtn) closeBtn.style.setProperty('display', 'none', 'important');
      // 카드별 .li 항상 노출 + .on 자동 부여 (첫 번째)
      var lis = cs.querySelectorAll('ul > li');
      lis.forEach((li, i) => {
        li.style.setProperty('display', 'block', 'important');
        if (i === 0) li.classList.add('on');
      });
      cs.dataset.bjOpened = '1';
    }

    // (4) PC 가격박스 .fix_price.hide-767 → .prod_name 다음으로 이동
    reorderFixPriceAfterProdName();
  }

  // lpt entries 캐시 — underlying이 덮어쓴 후 우리 thead/tbody 구조 바뀌어도
  // extractor가 못 찾는 경우 대비 (캐시된 데이터로 재렌더)
  var __bjLptCache = null;

  function populateLptFromMonthBoxes(){
    var lpt = document.querySelector('#livePriceTable');
    if (!lpt) return;
    lpt.classList.remove('lpt-empty');
    lpt.style.setProperty('display', 'block', 'important');

    var table = lpt.querySelector('#lptTable');
    var tbody = table && table.querySelector('tbody');
    if (!tbody) return;

    // 우선 underlying이 제공한 rich tbody (rowspan 가능)에서 약정+최종할인가 추출
    var entries = extractLptEntriesFromUnderlying(table);
    // 비어있거나 추출 실패 → 캐시 → month_box fallback 순
    if (entries.length === 0 && __bjLptCache && __bjLptCache.length) {
      entries = __bjLptCache;
    }
    if (entries.length === 0) entries = extractLptEntriesFromMonthBoxes();
    if (entries.length === 0) return;
    // 풍부한 데이터(underlying mgmt 포함) 캐싱 — 다음 재호출 때 thead 라벨 바뀌어도 활용
    if (entries.some(function(e){ return e.mgmt; })) __bjLptCache = entries;

    // tbody 첫 행에 bj-simple-row 마커 있으면 우리가 이미 렌더한 상태 → skip.
    // underlying이 덮어쓰면 마커가 사라지므로 다시 rerender.
    var firstRow = tbody.querySelector('tr');
    if (firstRow && firstRow.hasAttribute('data-bj-simple-row')) {
      var sig = entries.map(function(e){ return (e.mgmt||'') + '|' + e.term + '|' + (e.monthly||'') + '|' + e.finalPrice; }).join(';');
      if (lpt.dataset.bjLptSignature === sig) return;
    }

    // 여러 관리유형이 섞여있으면 약정기간 셀에 prefix로 표기 (예: "[방문관리] 3년의무")
    var mgmtSet = {};
    entries.forEach(function(e){ if (e.mgmt) mgmtSet[e.mgmt] = true; });
    var needMgmtPrefix = Object.keys(mgmtSet).length > 1;

    // simple 2-col 구조로 재렌더 (다른 컬럼은 빈 셀 + display:none).
    // 관리유형 그룹별 row 배경: 방문관리 → 옅은 회색, 자가관리 → 흰색 (시각적 구분)
    var rows = '';
    entries.forEach(function(e){
      var termText = needMgmtPrefix && e.mgmt ? '[' + e.mgmt + '] ' + e.term : e.term;
      var bg = '';
      if (needMgmtPrefix && e.mgmt === '방문관리') bg = 'background:#f5f6f8;';
      else if (needMgmtPrefix && e.mgmt === '자가관리') bg = 'background:#ffffff;';
      // 월 렌탈료 항상 표시 — monthly=finalPrice면 finalPrice 값으로 동일 표시
      // (10914처럼 카드할인 없는 경우 두 컬럼 같은 값 표시되어 직관적)
      var monthlyDisplay = e.monthly || e.finalPrice || '—';
      rows +=
        '<tr data-bj-simple-row="1" style="border-bottom:0.5px solid #eee;' + bg + '">' +
          '<td style="display:none"></td>' +
          '<td style="padding:12px 8px;text-align:center;font-weight:600">' + escapeHtml(termText) + '</td>' +
          '<td style="display:none"></td>' +
          '<td style="display:none"></td>' +
          '<td style="padding:12px 8px;text-align:center;color:#444;font-size:14px">' + escapeHtml(monthlyDisplay) + '</td>' +
          '<td style="padding:12px 8px;text-align:center;color:#0838f8;font-size:15px;font-weight:700">' + escapeHtml(e.finalPrice) + '</td>' +
        '</tr>';
    });
    tbody.innerHTML = rows;

    // thead 라벨도 업데이트 — 약정기간 / 월 렌탈료 / 카드 적용가
    // (underlying의 이달의 할인가 → 월 렌탈료, 최종 할인가 → 카드 적용가로 재명명)
    var thead2 = table.querySelector('thead tr');
    if (thead2) {
      thead2.innerHTML =
        '<th style="display:none"></th>' +
        '<th style="background:#0838f8;color:#fff;padding:10px 8px;text-align:center;font-weight:600">약정기간</th>' +
        '<th style="display:none"></th>' +
        '<th style="display:none"></th>' +
        '<th style="background:#0838f8;color:#fff;padding:10px 8px;text-align:center;font-weight:600">월 렌탈료</th>' +
        '<th style="background:#0838f8;color:#fff;padding:10px 8px;text-align:center;font-weight:600">카드 할인가</th>';
    }

    lpt.dataset.bjLptSignature = entries.map(function(e){ return (e.mgmt||'') + '|' + e.term + '|' + (e.monthly||'') + '|' + e.finalPrice; }).join(';');
    lpt.dataset.bjLptPopulated = '1';

    // underlying이 tbody를 다시 덮어쓰면 MutationObserver가 재렌더 트리거
    if (!lpt.dataset.bjLptObserved && window.MutationObserver) {
      lpt.dataset.bjLptObserved = '1';
      var obs = new MutationObserver(function(){
        // 다음 tick에서 populateLpt 재호출 (synchronous mutation 루프 방지)
        setTimeout(populateLptFromMonthBoxes, 0);
      });
      try { obs.observe(tbody, { childList: true, subtree: false }); } catch(e){}
      // 5초 후 disconnect (성능 + 무한루프 방지)
      setTimeout(function(){ try { obs.disconnect(); } catch(e){} }, 8000);
    }

    // lptTitle 갱신
    var title = document.getElementById('lptTitle');
    if (title) {
      var nameEl = document.querySelector('.prod_name > b');
      var modelEl = document.querySelector('.prod_name .model_name small');
      if (nameEl) {
        var inner = escapeHtml(nameEl.textContent.trim());
        if (modelEl) inner += '<br><span style="font-size:12px;opacity:0.85;font-weight:400">' + escapeHtml(modelEl.textContent.trim()) + '</span>';
        title.innerHTML = inner;
      }
    }

    /* v0.5.0: 카드 할인이 있는 경우 #livePriceTable을 AI 카드 SLOT 8로 mount */
    mountLptIntoCard(entries);
  }

  /* v0.5.1: LPT를 AI 카드 SLOT 8에 **항상** mount. 카드할인 유무에 관계없이 노출.
     본문 #livePriceTable은 mount 성공 시 hide → 카드 내부만 단일 출처.
     사용자 룰북 v0.5.1: "위생관리·카드 할인가 모두 자동생성 카드 내부에 포함되어야 함". */
  function mountLptIntoCard(entries){
    var section = document.getElementById('ai-card-lpt-section');
    var mount = document.getElementById('ai-card-lpt-mount');
    if (!section || !mount) return;
    if (!entries || !entries.length) { section.hidden = true; return; }

    function digits(s){ return parseInt(String(s||'').replace(/[^\d]/g,''),10) || 0; }
    var hasDiscount = entries.some(function(e){
      return e.monthly && e.finalPrice && digits(e.monthly) !== digits(e.finalPrice);
    });

    /* mount 안에 컴팩트 표 직접 생성 (#livePriceTable DOM 이동 대신 복제) — 본문 LPT는 그대로 두고
       카드 내부에 독립 인스턴스. underlying 재렌더와 충돌 없음. */
    var mgmtSet = {};
    entries.forEach(function(e){ if (e.mgmt) mgmtSet[e.mgmt] = true; });
    var needMgmtPrefix = Object.keys(mgmtSet).length > 1;

    var rows = entries.map(function(e){
      var termText = needMgmtPrefix && e.mgmt ? '[' + e.mgmt + '] ' + e.term : e.term;
      var monthly = e.monthly || e.finalPrice || '—';
      var final = e.finalPrice || '—';
      var saved = '';
      if (e.monthly && e.finalPrice) {
        var d = digits(e.monthly) - digits(e.finalPrice);
        if (d > 0) saved = '<span style="color:#e84a4a;font-size:12px;margin-left:4px">−' + d.toLocaleString() + '원</span>';
      }
      return '<tr style="border-bottom:0.5px solid #eee">' +
        '<td style="padding:10px 8px;text-align:center;font-weight:600;font-size:14px">' + escapeHtml(termText) + '</td>' +
        '<td style="padding:10px 8px;text-align:center;color:#444;font-size:14px">' + escapeHtml(monthly) + '</td>' +
        '<td style="padding:10px 8px;text-align:center;color:#0838f8;font-weight:700;font-size:15px">' + escapeHtml(final) + saved + '</td>' +
        '</tr>';
    }).join('');

    /* 카드할인이 있는 경우 3컬럼 (약정/월렌탈료/카드할인가),
       없는 경우 2컬럼 (약정/월렌탈료) — 컬럼 헤더도 동적 */
    var headerCols = hasDiscount
      ? '<th style="padding:9px 8px;text-align:center;font-weight:600">약정기간</th>' +
        '<th style="padding:9px 8px;text-align:center;font-weight:600">월 렌탈료</th>' +
        '<th style="padding:9px 8px;text-align:center;font-weight:600">카드 할인가</th>'
      : '<th style="padding:9px 8px;text-align:center;font-weight:600">약정기간</th>' +
        '<th style="padding:9px 8px;text-align:center;font-weight:600">월 렌탈료</th>';
    if (!hasDiscount) {
      /* 2컬럼 모드 — final 컬럼 제거하고 monthly만 강조 */
      rows = entries.map(function(e){
        var termText = needMgmtPrefix && e.mgmt ? '[' + e.mgmt + '] ' + e.term : e.term;
        var monthly = e.monthly || e.finalPrice || '—';
        return '<tr style="border-bottom:0.5px solid #eee">' +
          '<td style="padding:10px 8px;text-align:center;font-weight:600;font-size:14px">' + escapeHtml(termText) + '</td>' +
          '<td style="padding:10px 8px;text-align:center;color:#0838f8;font-weight:700;font-size:15px">' + escapeHtml(monthly) + '</td>' +
          '</tr>';
      }).join('');
    }

    /* v0.5.39: 표 위 제품 정보 헤더 — 제품명(굵게) + 모델명·관리주기(작고 흐리게) 2줄 */
    var prodNameEl = document.querySelector('.prod_name b') || document.querySelector('.prod_name') ||
                     document.querySelector('.bj-hero-meta-title');
    var prodName = prodNameEl ? prodNameEl.textContent.trim() : '';
    /* 모델명·관리 — .model_name small 우선, 그 다음 .model_name 전체 */
    var modelSmall = document.querySelector('.model_name small');
    var modelEl = modelSmall || document.querySelector('.model_name');
    var modelText = modelEl ? modelEl.textContent.trim() : '';
    /* 제품명에 prefix 브랜드 prefix 너무 길면 자르기: 'LG구독 - LG전자 정수기 ...' → 'LG전자 정수기 ...' */
    prodName = prodName.replace(/^[A-Z가-힣]+\s*구독\s*[-·]\s*/, '').trim();
    /* v0.5.41: title + 표를 단일 outer wrapper 안에 배치해 width 통일.
       이전: title은 mount 직접 자식 (full width), 표 wrapper는 별도 div with border →
       border 1px 차이로 두 박스 가로 폭 안 맞음 (사용자 시각 어긋남 신고). */
    var titleHtml = '';
    if (prodName) {
      titleHtml =
        '<div id="lptTitle" style="background:#0838f8;color:#fff;text-align:center;padding:14px 20px;font-size:15px;font-weight:700;border-bottom:1px solid rgba(255,255,255,0.2);font-family:Pretendard,sans-serif;line-height:1.4">' +
          escapeHtml(prodName) +
          (modelText ? '<br><span style="font-size:12px;opacity:0.85;font-weight:400">' + escapeHtml(modelText) + '</span>' : '') +
        '</div>';
    }

    mount.innerHTML =
      '<div style="border:1px solid #e5e8ee;border-radius:8px;overflow:hidden;background:#fff">' +
        titleHtml +
        '<div style="overflow-x:auto;-webkit-overflow-scrolling:touch">' +
          '<table style="width:100%;min-width:240px;border-collapse:collapse;font-family:Pretendard,sans-serif;font-size:14px;line-height:1.4;background:#fff">' +
            '<thead><tr style="background:#0838f8;color:#fff;font-size:13px">' + headerCols + '</tr></thead>' +
            '<tbody>' + rows + '</tbody>' +
          '</table>' +
        '</div>' +
      '</div>';
    section.hidden = false;
    section.dataset.bjLptMounted = '1';

    /* v0.5.1+v0.5.39+v0.5.40: 본문 LPT 중복 광범위 hide — AI 카드에 단일 출처 보장.
       3단계:
       (1) #livePriceTable + 그 부모 wrapper
       (2) thead에 "약정+(월렌탈료|카드할인가)" 패턴 갖는 모든 table (text 기반 매칭)
       (3) 텍스트에 "약정·카드 할인가" 라벨 갖는 본문 section
       모두 카드 내부(#ai-card-root)·하단 위젯(.prod_view_bot.card.mt40)·hero
       (.prod_view_top) 외부에 한정. */
    hideDuplicateBodyLpt();
  }

  function hideDuplicateBodyLpt(){
    function isInProtected(el){
      return !!(el && (
        el.closest('#ai-card-root') ||
        el.closest('.prod_view_bot.card.mt40') ||
        el.closest('.prod_view_top')
      ));
    }
    function hideWithWrapper(el){
      if (!el || isInProtected(el)) return;
      el.style.setProperty('display', 'none', 'important');
      el.dataset.bjLptDupHidden = '1';
      /* 가장 가까운 의미있는 wrapper(section/article/div with significant class)도 hide */
      var anc = el.parentElement, depth = 0;
      while (anc && depth < 4) {
        if (isInProtected(anc)) break;
        var cls = String(anc.className || '');
        if (/price|rental|약정|table_wrap|sec|lpt/i.test(cls)) {
          anc.style.setProperty('display', 'none', 'important');
          anc.dataset.bjLptDupHidden = '1';
          break;
        }
        anc = anc.parentElement;
        depth++;
      }
    }

    /* (1) #livePriceTable */
    var lpt = document.getElementById('livePriceTable');
    if (lpt) hideWithWrapper(lpt);

    /* (2) thead text pattern */
    document.querySelectorAll('table').forEach(function(table){
      if (isInProtected(table)) return;
      if (table.dataset.bjLptDupHidden) return;
      var thead = table.querySelector('thead') || table.querySelector('tr:first-child');
      if (!thead) return;
      var headText = (thead.textContent || '').replace(/\s+/g, ' ');
      /* "약정" + ("월 렌탈료" | "카드 할인가" | "할인가") — LPT 표 시그니처 */
      if (/약정/.test(headText) && /(월\s*렌탈료|카드.*할인가|^.*할인가.*$)/.test(headText)) {
        hideWithWrapper(table);
      }
    });

    /* (3) 본문 section with "약정·카드 할인가" 또는 유사 헤더 */
    document.querySelectorAll('h2, h3, h4, .sec-t, .section-title, [class*="title"]').forEach(function(h){
      if (isInProtected(h)) return;
      var t = (h.textContent || '').replace(/\s+/g, '');
      if (/약정[·.]?카드할인가|약정카드할인가|월렌탈료표|카드할인가표/.test(t)) {
        /* 헤더 자신 + 다음 sibling (보통 표 wrapper)도 hide */
        var section = h.closest('section, article, .sec, .section') || h.parentElement;
        if (section && !isInProtected(section)) {
          section.style.setProperty('display', 'none', 'important');
          section.dataset.bjLptDupHidden = '1';
        }
      }
    });
  }

  function escapeHtml(s){
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  // underlying lptTable의 rich tbody → 약정기간 + 이달의 할인가 + 최종 할인가 추출.
  // 컬럼 순서는 모든 제품 공통(관리유형/약정기간/관리주기/프로모션/이달의 할인가/최종 할인가)
  // 이므로 인덱스 하드코딩. (우리가 thead를 재명명한 후에도 호출되므로 thead text에
  // 의존하지 않음.)
  function extractLptEntriesFromUnderlying(table){
    var tbody = table.querySelector('tbody');
    if (!tbody) return [];
    var mgmtIdx = 0, termIdx = 1, monthlyIdx = 4, finalIdx = 5;

    var rows = Array.from(tbody.querySelectorAll('tr'));
    if (rows.length === 0) return [];
    if (rows.length === 1 && /실시간 가격|확인중/.test(rows[0].textContent || '')) return [];
    // 우리가 렌더한 simple 행이면 underlying 데이터 아님 → skip (캐시로 fallback)
    if (rows[0].hasAttribute('data-bj-simple-row')) return [];

    var entries = [];
    var pending = {};  // {colIdx: {text, remaining}}
    rows.forEach(function(tr){
      var cells = Array.from(tr.children);
      var rowMap = {};
      var c = 0;
      var ci = 0;
      while (c < 6) {
        if (pending[c] && pending[c].remaining > 0) {
          rowMap[c] = pending[c].text;
          pending[c].remaining--;
          c++;
          continue;
        }
        if (ci >= cells.length) break;
        var cell = cells[ci];
        var rs = parseInt(cell.getAttribute('rowspan'), 10) || 1;
        var cs = parseInt(cell.getAttribute('colspan'), 10) || 1;
        var text = (cell.textContent || '').replace(/\s+/g, ' ').trim();
        for (var k = 0; k < cs; k++) {
          rowMap[c + k] = text;
          if (rs > 1) pending[c + k] = { text: text, remaining: rs - 1 };
        }
        c += cs;
        ci++;
      }
      var term = rowMap[termIdx];
      var fin = rowMap[finalIdx];
      var mgmt = mgmtIdx >= 0 ? (rowMap[mgmtIdx] || '') : '';
      var monthly = monthlyIdx >= 0 ? (rowMap[monthlyIdx] || '') : '';
      if (term && fin) entries.push({ term: term, finalPrice: fin, mgmt: mgmt, monthly: monthly });
    });
    return entries;
  }

  function extractLptEntriesFromMonthBoxes(){
    var sources = document.querySelectorAll('a[id*="_price_of_"][data-month][data-price]');
    var out = [];
    sources.forEach(function(src){
      var month = src.dataset.month || '';
      var priceStr = src.dataset.price || '';
      var dc = src.dataset.dcprice || '0';
      var card_dis = src.dataset.card_dis;
      var finalDisplay = '월 ' + priceStr + '원';
      var pNum = parseInt(priceStr.replace(/,/g, ''), 10);
      var dNum = parseInt(dc, 10);
      if (card_dis && card_dis !== 'N' && card_dis !== '0' && !isNaN(pNum) && !isNaN(dNum) && dNum > 0) {
        finalDisplay = '월 ' + (pNum - dNum).toLocaleString() + '원';
      }
      out.push({ term: month, finalPrice: finalDisplay, monthly: finalDisplay, mgmt: '' });
    });
    return out;
  }

  function reorderFixPriceAfterProdName(){
    var fixPrice = document.querySelector('.fix_price.hide-767');
    var prodName = document.querySelector('.prod_name');
    if (!fixPrice || !prodName) return;
    // 이미 prodName 직후에 있으면 skip
    if (prodName.nextElementSibling === fixPrice) return;
    // .prod_name과 .fix_price.hide-767 부모가 같아야 안전
    if (fixPrice.parentElement !== prodName.parentElement) return;
    prodName.parentElement.insertBefore(fixPrice, prodName.nextElementSibling);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 3) 오케스트레이션
  // ─────────────────────────────────────────────────────────────────────────
  // ─────────────────────────────────────────────────────────────────────────
  // 2.w) (DEPRECATED — universal fab는 IIFE 최상단에서 모든 페이지에 주입됨.
  //       이 함수는 prod_view에서 fab 존재 보장 차원의 fallback)
  // ─────────────────────────────────────────────────────────────────────────
  function injectNewlywedGnb(){
    // v0.5.1: 플로팅 fab 폐기 — 카테고리바(.category__wrap)에 직접 link 추가.
    // 기존 .bj-newlywed-floating 잔재 있으면 제거.
    var stale = document.querySelector('.bj-newlywed-floating');
    if (stale) stale.remove();
    /* 카테고리바 항목은 위쪽 injectNewlywedInCategoryBar IIFE가 처리 — 재호출 트리거만 */
    var wrap = document.querySelector('.mobile__gnb .gnb__cateogry .category__wrap, .category__wrap');
    if (!wrap || wrap.querySelector('.bj-newlywed-cat')) return;
    var commit = getOwnCommitHash();
    var widgetJsUrl = 'https://admin2.billyjo.co.kr/persona-wizard.js';
    var link = document.createElement('a');
    link.className = 'bj-newlywed-cat';
    link.href = '#';
    link.innerHTML = '<span style="margin-right:3px">🎯</span>1:1 맞춤 패키지';
    link.style.cssText = 'flex:0 0 auto;display:inline-flex;align-items:center;padding:2px 0;font:700 13px Pretendard,sans-serif;color:#0838F8;text-decoration:none;background:transparent;border:0;white-space:nowrap;cursor:pointer;line-height:1.4';
    link.onclick = function(e){
      e.preventDefault();
      function openWiz(){ if (window.bjPersona) window.bjPersona.open({ style: 'curation', origin: '1:1 맞춤 패키지' }); }
      if (window.bjPersona) {
        openWiz();
      } else if (!window.__bjWizLoading) {
        window.__bjWizLoading = true;
        var s = document.createElement('script');
        s.src = widgetJsUrl;
        s.onload = openWiz;
        document.head.appendChild(s);
      }
    };
    wrap.insertBefore(link, wrap.firstChild);
  }

  /* v0.5.11: 빌리조 원본 2버튼 sticky 위젯 제거 안전망 (CSS 외 JS도 마크업 제거) */
  function removeOriginalStickyWidget(){
    /* #33 fail-open: 워치독이 native bar를 복원한 상태면 다시 숨기지 않는다 */
    if (window.__bjWidgetFailOpen) return;
    document.querySelectorAll('.prod_fix_wrap').forEach(function(el){
      el.style.display = 'none';
      el.setAttribute('data-bj-removed', '1');
    });
  }

  /* v0.5.23 + v0.5.24: 빌리조 main inject.js가 body에 직접 mount하는 #billyjo-bottom-bar
     위젯 자체를 DOM 완전 삭제. 그 안의 .bb-inner도 함께 사라짐.
     별도로 우리 .prod_view_bot.card.mt40 wrapper 밖에 mount된 격상 안 된 .bb-inner도 삭제. */
  function removeStrayBbInner(){
    var wrapper = document.querySelector('.prod_view_bot.card.mt40');
    /* 1) wrapper 안 격상 안 된 .bb-inner — enhanceBottomBar 격상 trigger 먼저 */
    if (wrapper && wrapper.querySelector('.bb-inner:not(.bj-bb-inner-merged)')) {
      try { enhanceBottomBar(); } catch(e){}
    }
    /* 2) v0.5.24: #billyjo-bottom-bar 위젯 자체 DOM 삭제 (빌리조 본 inject.js 생성) */
    var bjBar = document.getElementById('billyjo-bottom-bar');
    if (bjBar && !bjBar.classList.contains('bj-ours-keep')) {
      try { bjBar.parentNode.removeChild(bjBar); } catch(e){}
    }
    /* 3) 격상 안 된 .bb-inner 모두 DOM 삭제 (혹시 #billyjo-bottom-bar 밖에도 mount된 경우) */
    document.querySelectorAll('.bb-inner:not(.bj-bb-inner-merged)').forEach(function(inner){
      try {
        if (inner.parentElement) inner.parentElement.removeChild(inner);
      } catch(e){}
    });
  }
  function watchForBbInner(){
    if (window.__bjBbInnerWatched) return;
    window.__bjBbInnerWatched = true;
    removeStrayBbInner();
    if (!window.MutationObserver) return;
    /* 영구 옵저버 — disconnect 안 함. 새 .bb-inner mount 감지 시 즉시 처리.
       콜백 lightweight (.bb-inner만 체크 + 필요시 격상/삭제). */
    var obs = new MutationObserver(function(mutations){
      var hasTarget = false;
      for (var i = 0; i < mutations.length; i++) {
        var m = mutations[i];
        if (m.type !== 'childList') continue;
        for (var j = 0; j < m.addedNodes.length; j++) {
          var n = m.addedNodes[j];
          if (n.nodeType !== 1) continue;
          /* v0.5.24: #billyjo-bottom-bar 또는 .bb-inner mount 감지 */
          if (n.id === 'billyjo-bottom-bar') { hasTarget = true; break; }
          if (n.classList && n.classList.contains('bb-inner')) { hasTarget = true; break; }
          if (n.querySelector && (n.querySelector('#billyjo-bottom-bar') || n.querySelector('.bb-inner'))) {
            hasTarget = true; break;
          }
        }
        if (hasTarget) break;
      }
      if (hasTarget) removeStrayBbInner();
    });
    try { obs.observe(document.body, { childList: true, subtree: true }); } catch(e){}
  }
  /* v0.5.23: 하위 호환 alias — runAll의 기존 hideExternalBbInner 호출 유지 */
  function hideExternalBbInner(){ removeStrayBbInner(); }

  /* v0.5.20: 업소용 카테고리 노출 — main inject.js가 hide한 prod_list/10-1153을 복원 +
     라벨 "업소용·창업" → "업소용"으로 단축. */
  function showBusinessCategory(){
    /* 전체 페이지 + 헤더 + .category__wrap + .menu__gsnb + .aside_sub + .all__depth1 */
    document.querySelectorAll('a[href*="prod_list/10-1153"]').forEach(function(a){
      a.style.setProperty('display', '', 'important');  /* 인라인 display 복원 */
      a.style.setProperty('visibility', 'visible', 'important');
      var li = a.closest('li');
      if (li) {
        li.style.setProperty('display', '', 'important');
        li.style.setProperty('visibility', 'visible', 'important');
      }
      /* 텍스트 단축 "업소용·창업" → "업소용" */
      if (a.textContent && a.textContent.trim() === '업소용·창업') {
        /* 자식 노드가 단순 텍스트면 변경, 아니면 첫 텍스트 노드만 변경 (이미지·svg 보존) */
        if (a.children.length === 0) {
          a.textContent = '업소용';
        } else {
          for (var i = 0; i < a.childNodes.length; i++) {
            var n = a.childNodes[i];
            if (n.nodeType === 3 && n.textContent.trim() === '업소용·창업') {
              n.textContent = '업소용';
              break;
            }
          }
        }
      }
    });
    /* all__depth1 같이 id 기반 항목도 처리 */
    document.querySelectorAll('ul.all__depth1 a[id="10"]').forEach(function(a){
      a.style.setProperty('display', '', 'important');
      a.style.setProperty('visibility', 'visible', 'important');
      var li = a.closest('li');
      if (li) li.style.setProperty('display', '', 'important');
      if (a.textContent && a.textContent.trim() === '업소용·창업') a.textContent = '업소용';
    });
  }

  /* v0.5.28: 옵션 select 강제 보장 (v0.5.27 가드 강화) — 우리가 만든 .bj-option-clone이
     wrapper 안에 있는 경우만 skip. 빌리조가 .bb-inner 안에 만든 .bb-option-select는
     hidden/압축 케이스가 있으므로 무시하고 별도 라벨 박스로 명시 노출. */
  function ensureOptionSelect(){
    var wrapper = document.querySelector('.prod_view_bot.card.mt40');
    if (!wrapper) return;
    /* 우리가 이미 만든 옵션 박스가 있으면 skip (idempotent) */
    if (wrapper.querySelector('.bj-fb-option-box, .bj-option-clone')) return;
    /* 페이지에 사용 가능한 .option_select 있는지 체크 */
    var pageSelects = document.querySelectorAll('.option_select, .bb-option-select');
    var hasOption = false;
    for (var i = 0; i < pageSelects.length; i++) {
      var s = pageSelects[i];
      if (s.closest && s.closest('.prod_fix_wrap')) continue;
      if (s.options && s.options.length > 1) { hasOption = true; break; }
    }
    if (!hasOption) return;
    /* 핸들 찾기 */
    var handle = wrapper.querySelector(':scope > .bj-bar-handle');
    if (!handle) return;
    /* syncOptionSelectToHandle 재실행 — wrapper 내부 select가 .bj-option-clone이 아닌 한 새로 만듦.
       기존 syncOptionSelectToHandle 1350 라인 가드(`wrapper.querySelector(SEL)`)도
       .bj-option-clone 한정으로 좁혀야 동일 효과. 함수 자체에 보강 위임. */
    try { syncOptionSelectToHandle(wrapper, handle); } catch(e){}
  }

  /* v0.5.73: 빌리조 본 사이트 헤더 로고를 한글/영문 2초 cross-fade.
     admin2에 호스팅된 PNG를 사용 (같은 .billyjo.co.kr sub-domain).
     img 두 장을 부모 안에 absolute로 겹치고 opacity 토글 → 깜빡임 없는 부드러운 fade. */
  var BJ_LOGO_KO = 'https://admin2.billyjo.co.kr/logo/billyjo-ko.png';
  var BJ_LOGO_EN = 'https://admin2.billyjo.co.kr/logo/billyjo-en.png';
  function alternateBillyjoLogo(){
    var logos = document.querySelectorAll('.logo > img, header .logo img');
    if (!logos.length) return;
    logos.forEach(function(img){
      if (img.dataset.bjLogoAlt) return;
      var parent = img.parentNode;
      if (!parent) return;
      img.dataset.bjLogoAlt = '1';
      /* 부모를 relative로 (이미 relative면 그대로) */
      var cs = window.getComputedStyle(parent);
      if (cs.position === 'static') {
        parent.style.position = 'relative';
      }
      /* 원본 img를 한글 로고로 교체 + transition */
      img.src = BJ_LOGO_KO;
      img.classList.add('bj-logo-alt-ko');
      img.style.transition = 'opacity 0.2s ease-in-out';
      img.style.opacity = '1';
      /* 영문 로고를 같은 위치에 absolute로 겹치기 (원본 img 스타일 상속) */
      var enImg = img.cloneNode(false);
      enImg.removeAttribute('id');
      enImg.classList.remove('bj-logo-alt-ko');
      enImg.classList.add('bj-logo-alt-en');
      enImg.src = BJ_LOGO_EN;
      enImg.style.position = 'absolute';
      enImg.style.left = '0';
      enImg.style.top = '0';
      enImg.style.width = '100%';
      enImg.style.height = '100%';
      enImg.style.objectFit = 'contain';
      enImg.style.opacity = '0';
      enImg.style.transition = 'opacity 0.2s ease-in-out';
      enImg.style.pointerEvents = 'none';
      parent.appendChild(enImg);
    });
    /* 인터벌은 1회만 등록 (idempotent) */
    if (window.__bjLogoAltInterval) return;
    window.__bjLogoAltInterval = setInterval(function(){
      var ko = document.querySelectorAll('img.bj-logo-alt-ko');
      var en = document.querySelectorAll('img.bj-logo-alt-en');
      if (!ko.length || !en.length) return;
      var showEn = ko[0].style.opacity !== '0';
      ko.forEach(function(i){ i.style.opacity = showEn ? '0' : '1'; });
      en.forEach(function(i){ i.style.opacity = showEn ? '1' : '0'; });
    }, 2000);
  }

  /* === v0.6.1: AI 카드 글씨 크기 조절 (사용자가 ±1px 단위로 조절, localStorage 유지) ===
     - 카드 내부의 px 폰트들이 inject.js의 !important 오버라이드를 받으므로, 조절은
       각 요소 인라인 font-size + 'important'로 적용(인라인 important가 스타일시트 important를 이김).
     - step 0: 인라인 제거(스타일시트 기본 복귀). 신규 주입 요소는 runAll 재호출 시 자동 반영. */
  var BJ_FS_KEY = 'bj_card_fontstep', BJ_FS_MIN = -2, BJ_FS_MAX = 6;
  function bjFsGet(){ var v = parseInt((window.localStorage && localStorage.getItem(BJ_FS_KEY)) || '0', 10); return isNaN(v) ? 0 : Math.max(BJ_FS_MIN, Math.min(BJ_FS_MAX, v)); }
  function bjFsSet(v){ try { localStorage.setItem(BJ_FS_KEY, String(v)); } catch(e){} }
  function bjFsApply(step){
    var root = document.getElementById('ai-card-root'); if (!root) return;
    if (step === 0){
      var done = root.querySelectorAll('[data-bj-basefs]');
      for (var j = 0; j < done.length; j++){ done[j].style.removeProperty('font-size'); done[j].removeAttribute('data-bj-basefs'); }
      return;
    }
    var els = root.querySelectorAll('*');
    for (var i = 0; i < els.length; i++){
      var el = els[i], tg = el.tagName;
      if (tg === 'STYLE' || tg === 'SCRIPT' || tg === 'IMG' || tg === 'svg' || tg === 'SVG' || tg === 'I') continue; // 아이콘(.ti=I)은 자체 크기 유지
      if (el.closest && el.closest('#bj-fs-ctrl')) continue; // 컨트롤 자신은 제외
      var base = el.getAttribute('data-bj-basefs');
      if (base === null){ var cf = parseFloat(getComputedStyle(el).fontSize); if (!cf) continue; base = cf; el.setAttribute('data-bj-basefs', String(cf)); }
      else base = parseFloat(base);
      el.style.setProperty('font-size', (base + step) + 'px', 'important');
    }
  }
  function mountFontSizer(){
    // 컨트롤은 우측 퀵버튼(.link) 묶음 맨 위에 세로로 배치. 글씨 스케일 대상은 #ai-card-root.
    var link = document.querySelector('.new-qb .quick .link');
    if (link && !document.getElementById('bj-fs-ctrl')){
      // Tabler 폰트 미로드 환경 대비 — 동일 라인 스타일의 인라인 SVG 돋보기(−/+)
      var svgHead = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">';
      var zoomBase = '<path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" /><path d="M21 21l-6 -6" /><path d="M7 10l6 0" />';
      var zoomOut = svgHead + zoomBase + '</svg>';                       // 돋보기 −
      var zoomIn  = svgHead + zoomBase + '<path d="M10 7l0 6" /></svg>';  // 돋보기 +
      var c = document.createElement('div'); c.id = 'bj-fs-ctrl';
      c.innerHTML = '<div class="bj-fs-inner">'
        + '<button class="bj-fs-btn" data-d="1" type="button" aria-label="글씨 크게">' + zoomIn + '</button>'   // ＋ 위
        + '<span class="bj-fs-lab">글씨</span>'
        + '<button class="bj-fs-btn" data-d="-1" type="button" aria-label="글씨 작게">' + zoomOut + '</button>' // − 아래
        + '</div>';
      link.insertBefore(c, link.firstChild);  // 상담 버튼들 위
      c.addEventListener('click', function(e){
        var b = e.target.closest ? e.target.closest('.bj-fs-btn') : null; if (!b) return;
        var step = Math.max(BJ_FS_MIN, Math.min(BJ_FS_MAX, bjFsGet() + parseInt(b.getAttribute('data-d'), 10)));
        bjFsSet(step); bjFsApply(step); bjFsSyncDisabled(c, step);
      });
      bjFsSyncDisabled(c, bjFsGet());
    }
    // PC 전화버튼 삽입 로직과의 순서 경합 보정 — 항상 .link 맨 위로
    var ctrl = document.getElementById('bj-fs-ctrl');
    if (link && ctrl && link.firstElementChild !== ctrl) link.insertBefore(ctrl, link.firstChild);
    if (bjFsGet() !== 0) bjFsApply(bjFsGet()); // 신규 주입 요소 포함 재반영
  }
  function bjFsSyncDisabled(c, step){
    var minus = c.querySelector('[data-d="-1"]'), plus = c.querySelector('[data-d="1"]');
    if (minus) minus.disabled = (step <= BJ_FS_MIN);
    if (plus) plus.disabled = (step >= BJ_FS_MAX);
  }

  /* v0.6.5: 지원금·혜택 섹션(.gift)을 '이런 분에게 추천해요'(.persona) 섹션 바로 앞으로 이동.
     우선 canary(24578)에서만 미리보기 — 확인 후 BJ_GIFTMOVE_ALL=true 로 전체 적용. */
  var BJ_GIFTMOVE_ONLY = ['24578'];
  var BJ_GIFTMOVE_ALL = true;  // 전체 상품 적용 (canary 확인 완료)
  function moveGiftBeforePersona(){
    var m = location.pathname.match(/\/prod_view\/(\d+)/);
    var pid = m ? m[1] : '';
    if (!BJ_GIFTMOVE_ALL && BJ_GIFTMOVE_ONLY.indexOf(pid) === -1) return;
    var root = document.getElementById('ai-card-root'); if (!root) return;
    var giftEl = root.querySelector('.gift'); if (!giftEl) return;
    var giftSec = giftEl.closest('.sec'); if (!giftSec) return;
    var personaEl = root.querySelector('.persona');
    var personaSec = personaEl ? personaEl.closest('.sec') : null;
    if (!personaSec){ // sec-t 텍스트 폴백
      var secs = root.querySelectorAll('.sec');
      for (var i = 0; i < secs.length; i++){ var t = secs[i].querySelector('.sec-t'); if (t && /이런\s*분/.test(t.textContent || '')){ personaSec = secs[i]; break; } }
    }
    if (!personaSec || giftSec === personaSec) return;
    if (giftSec.parentNode !== personaSec.parentNode) return;
    if (giftSec.nextElementSibling === personaSec) return; // 이미 바로 앞
    personaSec.parentNode.insertBefore(giftSec, personaSec);
  }

  /* v0.6.8: [예시 A] AI 카드 시각 보강 — 섹션 헤더 아이콘 칩 + 페르소나 아이콘(인라인 SVG) 노출.
     Tabler 폰트 미로드로 .ti 아이콘이 안 보이므로 인라인 SVG로 대체. 우선 canary(24578)에서만. */
  var BJ_CARDX_ONLY = ['24578'];
  var BJ_CARDX_ALL = true;  // 전체 상품 적용 (canary 확인 완료)
  function applyAiCardExampleA(){
    var m = location.pathname.match(/\/prod_view\/(\d+)/); var pid = m ? m[1] : '';
    if (!BJ_CARDX_ALL && BJ_CARDX_ONLY.indexOf(pid) === -1) return;
    var root = document.getElementById('ai-card-root'); if (!root) return;
    function svg(inner){ return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + inner + '</svg>'; }
    var GIFT = '<path d="M3 8m0 1a1 1 0 0 1 1 -1h16a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-16a1 1 0 0 1 -1 -1z" /><path d="M12 8l0 13" /><path d="M19 12v7a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-7" /><path d="M7.5 8a2.5 2.5 0 0 1 0 -5a4.8 8 0 0 1 4.5 5a4.8 8 0 0 1 4.5 -5a2.5 2.5 0 0 1 0 5" />';
    var USERS = '<path d="M9 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" /><path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /><path d="M21 21v-2a4 4 0 0 0 -3 -3.85" />';
    var LIST = '<path d="M13 5h8" /><path d="M13 9h5" /><path d="M13 15h8" /><path d="M13 19h5" /><path d="M3 4m0 1a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1z" /><path d="M3 14m0 1a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1z" />';
    var CAL = '<path d="M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12z" /><path d="M16 3v4" /><path d="M8 3v4" /><path d="M4 11h16" /><path d="M11 15h1" /><path d="M12 15v3" />';
    var INFO = '<path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" /><path d="M12 9h.01" /><path d="M11 12h1v4h1" />';
    var SEC = [ [/지원금|혜택/, GIFT], [/추천|이런\s*분/, USERS], [/스펙/, LIST], [/약정|카드|할인/, CAL], [/기본|설치|정보/, INFO] ];
    root.querySelectorAll('.sec-t').forEach(function(t){
      if (t.getAttribute('data-bj-sx')) return;
      var txt = t.textContent || '', ic = INFO;
      for (var i = 0; i < SEC.length; i++){ if (SEC[i][0].test(txt)){ ic = SEC[i][1]; break; } }
      var sp = document.createElement('span'); sp.className = 'bj-sx-ic'; sp.innerHTML = svg(ic);
      t.insertBefore(sp, t.firstChild); t.classList.add('bj-sx-done'); t.setAttribute('data-bj-sx', '1');
    });
    // 페르소나 아이콘 — 제목·설명 내용에 맞는 인라인 SVG로 교체(서로 구분되게)
    var UHEART = '<path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" /><path d="M6 21v-2a4 4 0 0 1 4 -4h2" /><path d="M18 22l3.35 -3.35a2.1 2.1 0 0 0 -2.97 -2.97l-.38 .39l-.39 -.39a2.1 2.1 0 0 0 -2.97 2.97l3.35 3.35z" />';
    var USERS = '<path d="M9 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" /><path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /><path d="M21 21v-2a4 4 0 0 0 -3 -3.85" />';
    var HOME = '<path d="M5 12l-2 0l9 -9l9 9l-2 0" /><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" /><path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" />';
    var DROP = '<path d="M6.8 11a6 6 0 1 0 10.4 0l-5.2 -7l-5.2 7z" />';
    var COIN = '<path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" /><path d="M14.8 9a2 2 0 0 0 -1.8 -1h-2a2 2 0 0 0 0 4h2a2 2 0 1 1 0 4h-2a2 2 0 0 1 -1.8 -1" /><path d="M12 7v1m0 8v1" />';
    var SHIELD = '<path d="M12 3a12 12 0 0 0 8.5 3a12 12 0 0 1 -8.5 15a12 12 0 0 1 -8.5 -15a12 12 0 0 0 8.5 -3" /><path d="M9 12l2 2l4 -4" />';
    var BRIEF = '<path d="M3 7m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z" /><path d="M8 7v-2a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v2" /><path d="M3 13a20 20 0 0 0 18 0" /><path d="M12 12v.01" />';
    var GEAR = '<path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z" /><path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />';
    var USER = '<path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" /><path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />';
    var PMAP = [
      [/가족|3\s*-?\s*4\s*인|패밀리|식구|육아|아이|키즈|맘/, USERS],
      [/신혼|커플/, UHEART],
      [/오피스|사무|직장|회사|업무/, BRIEF],
      [/시니어|노년|부모|어르신|실버/, UHEART],
      [/가성비|합리|가격|절약|저렴|경제|부담/, COIN],
      [/정수|물맛|음용|미네랄|직수/, DROP],
      [/신뢰|브랜드|a\/?s|내구|품질|안심|검증/, SHIELD],
      [/좁|컴팩트|소형|원룸|미니|공간|슬림/, HOME],
      [/셀프|자가관리|위생|필터|청결|관리/, GEAR],
      [/1인|자취|혼자/, UHEART]
    ];
    root.querySelectorAll('.p .p-top i').forEach(function(el){
      var card = el.closest ? el.closest('.p') : null;
      var tEl = card ? card.querySelector('.rec-p-title') : null;
      var dEl = card ? card.querySelector('.p-d') : null;
      var txt = ((tEl ? tEl.textContent : '') + ' ' + (dEl ? dEl.textContent : '')).toLowerCase();
      var path = USER;
      for (var k = 0; k < PMAP.length; k++){ if (PMAP[k][0].test(txt)){ path = PMAP[k][1]; break; } }
      var sp = document.createElement('span'); sp.className = 'bj-persona-ic'; sp.innerHTML = svg(path);
      el.parentNode.replaceChild(sp, el);
    });
  }

  /* v0.6.9: [다음단계] 긴 문장 2줄 클램프 + '더보기' 토글로 카드 간결화. 우선 canary(24578). */
  var BJ_CLAMP_ONLY = ['24578'];
  var BJ_CLAMP_ALL = true;  // 전체 상품 적용 (canary 테스트 완료)
  function applyTextClamp(){
    var m = location.pathname.match(/\/prod_view\/(\d+)/); var pid = m ? m[1] : '';
    if (!BJ_CLAMP_ALL && BJ_CLAMP_ONLY.indexOf(pid) === -1) return;
    var root = document.getElementById('ai-card-root'); if (!root) return;
    [{ sel: '.a-body', lc3: false }, { sel: '.p-d', lc3: false }, { sel: '.rv-text', lc3: true }].forEach(function(cf){
      root.querySelectorAll(cf.sel).forEach(function(el){
        if (el.getAttribute('data-bj-clamp')) return;
        el.setAttribute('data-bj-clamp', '1');
        el.classList.add('bj-clamp');
        if (cf.lc3) el.classList.add('bj-lc3');  // 후기 본문은 3줄
        setTimeout(function(){
          if (el.scrollHeight - el.clientHeight > 3){  // 2줄 초과 → 더보기 노출
            var btn = document.createElement('button'); btn.className = 'bj-more'; btn.type = 'button'; btn.textContent = '더보기';
            el.parentNode.insertBefore(btn, el.nextSibling);
            btn.addEventListener('click', function(){
              var open = el.classList.toggle('bj-clamp-open');
              btn.textContent = open ? '접기' : '더보기';
            });
          } else {
            el.classList.remove('bj-clamp');  // 짧으면 클램프 해제
          }
        }, 80);
      });
    });
  }

  function runAll(){
    injectCSS();
    tagHeaderDom();
    alternateBillyjoLogo();
    enhanceBottomBar();
    setupHelpClose();
    alignCategoryScroll();
    addRentalTermsHelp();
    addOwnershipNotice();    /* v0.5.47: 반납 조건 아닌 제품에 '만기 후 소유권 이전' chip */
    personalizePersonaIcons(); /* v0.5.59: 페르소나 카드 아이콘 (현재 1인·신혼 샘플) */
    arrangePersonaLevelMobile(); /* v0.5.61: 모바일에서 추천강도 라벨을 페르소나명 옆으로 */
    fetchAndInjectAICard();
    moveGiftBeforePersona();   /* v0.6.5: 지원금 섹션을 페르소나 섹션 앞으로 (24578 미리보기) */
    applyAiCardExampleA();     /* v0.6.8: [예시 A] 섹션 헤더 아이콘 + 페르소나 SVG 아이콘 */
    applyTextClamp();          /* v0.6.9: [다음단계] 긴 문장 2줄 클램프+더보기 (24578 테스트) */
    mountFontSizer();          /* v0.6.1: 글씨 크기 조절 컨트롤(돋보기 −/+) */
    fetchAndInjectReviews();   /* 고객 후기 섹션 — .prod_view_top 다음 */
    hideOriginalSpecsAndSimplifyLpt();
    setupBottomBarVisibility();
    injectNewlywedGnb();
    removeOriginalStickyWidget();
    showBusinessCategory();
    hideExternalBbInner();    /* v0.5.21: 매 호출마다 외부 .bb-inner 즉시 숨김 */
    watchForBbInner();        /* v0.5.21: 영구 옵저버 설치 (한 번만) */
    ensureOptionSelect();     /* v0.5.27: 옵션 select 위젯에 노출 보장 */
    hideDuplicateBodyLpt();   /* v0.5.40: 본문 LPT 중복 hide (빌리조 재렌더 대응) */
    try { refreshWidgetSelectorIfLptChanged(); } catch(_){}  /* v0.5.71: try-wrap */
  }

  /* v0.5.71c: runAll 의존 폐기 — 독립 setTimeout으로 LPT 변경 감지 보장 */
  [200, 600, 1200, 2500, 5000, 8000].forEach(function(d){
    setTimeout(function(){
      try { refreshWidgetSelectorIfLptChanged(); } catch(_){}
    }, d);
  });

  /* === 절대 규칙 #33: 하단 위젯 fail-open 워치독 ===
     어떤 이유로든(런타임 예외, 사이트 DOM 변경, 실행 순서 경합) 하단 위젯이
     비어 있거나 사라진 채로 끝나면 안 된다. 사용자가 명시적으로 dismiss한
     경우(bj-bar-slide-hidden)만 예외. 복구 순서:
     1) wrapper가 없으면 직접 생성 (사이트 DOM 변경 대비)
     2) 핸들 미구축이면 enhanceBottomBar 재시도 (fallback 콘텐츠 박스 포함)
     3) 그래도 실패하면 우리가 숨긴 native sticky bar(.prod_fix_wrap) 복원 —
        위젯이 아예 없는 것보단 native 렌탈신청 UI가 낫다 (fail-open) */
  function ensureBottomWidgetAlive(){
    try {
      var w = document.querySelector('.prod_view_bot.card.mt40');
      if (w && w.classList.contains('bj-bar-slide-hidden')) return; // 사용자 dismiss 존중
      if (!w) {
        w = document.createElement('div');
        w.className = 'prod_view_bot card mt40';
        document.body.appendChild(w);
      }
      if (!w.querySelector('.bj-bar-handle')) {
        try { enhanceBottomBar(); } catch(e){}
      }
      var r = w.getBoundingClientRect();
      var cs = getComputedStyle(w);
      var ok = w.querySelector('.bj-bar-handle') && cs.display !== 'none' &&
               cs.visibility !== 'hidden' && r.height > 10;
      if (ok) return;
      /* 최후 폴백: native sticky bar 복원 + runAll의 재숨김 차단 플래그 */
      window.__bjWidgetFailOpen = true;
      document.querySelectorAll('.prod_fix_wrap').forEach(function(el){
        el.style.setProperty('display', 'block', 'important');
        el.style.setProperty('visibility', 'visible', 'important');
        el.removeAttribute('data-bj-removed');
      });
    } catch(e){}
  }
  [3000, 7000].forEach(function(d){ setTimeout(ensureBottomWidgetAlive, d); });

  /* v0.5.71: enhanceBottomBar 1회 가드로 buildWidgetSelector가 LPT 채워지기 전에만 실행되는 문제 보강.
     LPT signature가 변경(또는 채워짐)되면 약정 pill을 새 데이터(타사보상 포함)로 재빌드.

     주의: `.bj-fb-selector`와 `.bj-widget-selector`가 같은 element에 부여되므로 prev 제거 금지.
     buildWidgetSelector는 mount.innerHTML 재할당하므로 그대로 호출하면 idempotent. */
  function refreshWidgetSelectorIfLptChanged() {
    var wrapper = document.querySelector('.prod_view_bot.card.mt40');
    if (!wrapper || !wrapper.dataset.bjBarEnhanced) return;
    var lptEl = document.querySelector('[data-bj-lpt-signature]');
    var sig = lptEl ? (lptEl.getAttribute('data-bj-lpt-signature') || '') : '';
    if (!sig) return;
    if (wrapper.dataset.bjLastWidgetSig === sig) return;
    wrapper.dataset.bjLastWidgetSig = sig;
    var handle = wrapper.querySelector('.bj-bar-handle');
    if (!handle) return;
    try { buildWidgetSelector(wrapper, handle); } catch(_) {}
  }

  injectCSS();      // CSS 즉시 — head 있으면
  preEnhance();     // 위젯 인라인 강제

  if (document.readyState !== 'loading') runAll();
  document.addEventListener('DOMContentLoaded', runAll);
  [50, 100, 200, 400, 600, 1200, 1500, 3000, 5000].forEach(function(d){
    setTimeout(runAll, d);
  });

  if (window.MutationObserver) {
    var obs = new MutationObserver(function(){ runAll(); });
    try { obs.observe(document.documentElement, { childList:true, subtree:true }); } catch(e){}
    setTimeout(function(){ obs.disconnect(); }, 8000);
  }
})();

/* ───────────────────────────────────────────────────────────────────────────
 * [모듈 C] 제품 리스트 후기 수 뱃지 + 후기많은순 정렬 (prod_list 전용)
 *   카운트는 우리 서버(admin2 /v1/reviews/counts)에서 직접 — 외부 의존 없음.
 *   카드별 model→모델라인→브랜드+카테고리 순으로 후기 수 매칭. 999+ 캡.
 *   ⚠️ 미리보기: 카테고리 1(prod_list/1-)에만. 전체 적용은 BJ_LIST_ONLY 비우기.
 * ─────────────────────────────────────────────────────────────────────────── */
(function(){
  var path = location.pathname || '';
  var IS_LIST = /\/prod_list\//.test(path);    // 정렬바는 리스트 페이지만. 뱃지는 카드 있는 모든 페이지(메인 포함)
  var API = 'https://admin2-api.billyjo.co.kr/v1/reviews';
  var BMAP = {'SK':'SK매직','웰스':'교원웰스','교원':'교원웰스','청호':'청호나이스','LG구독':'LG','현대렌탈케어':'현대큐밍'};
  var CMAP = [['얼음정수기','정수기'],['정수기','정수기'],['연수기','연수기'],['비데','비데'],['공기청정기','공기청정기'],['청정기','공기청정기'],['제습기','제습기'],['가습기','가습기'],['음식물처리기','음식물처리기'],['제빙기','제빙기'],['의류관리기','의류관리기'],['스타일러','의류관리기'],['식기세척기','식기세척기'],['인덕션','인덕션'],['전기레인지','인덕션'],['세탁기','세탁기'],['건조기','건조기'],['에어컨','에어컨'],['김치냉장고','냉장고'],['냉장고','냉장고'],['로봇청소기','청소기'],['청소기','청소기'],['안마의자','안마의자'],['매트리스','매트리스'],['침대','매트리스'],['노트북','노트북'],['TV','TV']];
  function normBrand(b){ b=(b||'').trim(); return BMAP[b]||b; }
  function catOf(name){ name=name||''; for(var i=0;i<CMAP.length;i++){ if(name.indexOf(CMAP[i][0])>=0) return CMAP[i][1]; } return ''; }
  function extractModel(title){ var s=String(title||'').toUpperCase(); var c=s.match(/[A-Z]{2,}[A-Z0-9-]*[0-9][A-Z0-9-]*/g); if(!c) return null; var STOP=/^(LED|USB|BLDC|HEPA|UVC?|KC|AI|TV|PC|3D|2D|[0-9]+[LWGKMH]|V[0-9]+|NEW|HD|FHD|UHD)$/; var m=c.filter(function(x){return x.length>=4&&x.length<=30&&!STOP.test(x)&&/[0-9]/.test(x)&&/[A-Z]/.test(x);}); if(!m.length) return null; m.sort(function(a,b){return b.length-a.length;}); return m[0].replace(/[_].*$/,'').replace(/-$/,''); }
  function lineKey(m){ if(!m) return ''; var x=String(m).toUpperCase().match(/^([A-Z]+-?[0-9])/); return x?x[1]:String(m).toUpperCase().slice(0,4); }
  var counts=null, brandList=[];
  // 카드 텍스트(제품명·모델·이미지alt)에서 알려진 브랜드 키워드 탐색 (제품명이 브랜드로 시작 안 할 때 보강)
  function findBrand(text){ text=text||''; for(var i=0;i<brandList.length;i++){ if(text.indexOf(brandList[i])>=0) return brandList[i]; } return ''; }
  function countFor(brand, model, category){
    if(!counts) return null;
    if(model && counts.by_model[model]) return counts.by_model[model];
    if(model){ var lk=lineKey(model), n=0, sa=0; for(var k in counts.by_model){ if(lineKey(k)===lk){ n+=counts.by_model[k].n; sa+=counts.by_model[k].avg*counts.by_model[k].n; } } if(n) return {n:n, avg:Math.round(sa/n*10)/10}; }
    if(category && counts.by_cat[brand+'|'+category]) return counts.by_cat[brand+'|'+category];
    return null;
  }
  function cap(n){ return n>999?'999+':String(n); }
  function injectCss(){
    if(document.getElementById('bj-rv-list-style')) return;
    var st=document.createElement('style'); st.id='bj-rv-list-style';
    st.textContent=[
      // 우상단 배치 + BEST 칩(.best-pill: top:12px·height:22px·11px)과 높이·세로위치 정렬. 하단 '렌탈신청하기' 바와 비충돌.
      ".bj-rv-listbadge{position:absolute;right:12px;top:12px;height:22px;box-sizing:border-box;display:inline-flex;align-items:center;gap:3px;background:rgba(255,255,255,.97);border:1px solid #e6e8ee;border-radius:999px;padding:0 10px;font-size:11px;line-height:1;font-weight:800;color:#0838F8;box-shadow:0 2px 5px rgba(0,0,0,.12);z-index:2;font-family:'Pretendard',sans-serif}",
      ".bj-rv-listbadge .st{color:#ffb400;font-size:12px}",
      "#bj-rv-sort{display:flex;justify-content:flex-end;gap:6px;padding:8px 4px;font-family:'Pretendard',sans-serif}",
      "#bj-rv-sort button{font:inherit;font-size:12px;padding:6px 13px;border:1px solid #e6e8ee;border-radius:999px;background:#fff;color:#555;cursor:pointer}",
      "#bj-rv-sort button.on{background:#0838F8;border-color:#0838F8;color:#fff;font-weight:700}"
    ].join('');
    document.head.appendChild(st);
  }
  function badges(){
    var items=document.querySelectorAll('.item');   // 메인·리스트 공통 제품카드(.item .box)
    Array.prototype.forEach.call(items, function(it){
      if(it.getAttribute('data-bj-rv')) return;
      var ne=it.querySelector('p.name'); if(!ne) return;   // 제품 카드만(p.name 보유)
      var be=it.querySelector('p.brand'), im=it.querySelector('img');
      // ⚠️ 이 리스트 카드는 p.brand에 모델코드, p.name에 제품명("코웨이 아이콘 V2 ...")이 들어감
      var modelTxt=be?(be.textContent||'').trim():'', name=ne?(ne.textContent||'').trim():'';
      var alt=im?(im.getAttribute('alt')||''):'';
      // 브랜드: 제품명/이미지alt에서 알려진 브랜드 키워드 우선, 없으면 제품명 첫 토큰
      var brand=normBrand(findBrand(name+' '+alt) || (name.split(/\s+/)[0]||''));
      var c=countFor(brand, extractModel(modelTxt+' '+name), catOf(name+' '+alt));
      it.setAttribute('data-bj-rv','1');
      it.setAttribute('data-bj-rvn', c?c.n:0);
      if(!c) return;
      var thumb=it.querySelector('.thumb')||it.querySelector('a')||it;
      var cs=window.getComputedStyle(thumb); if(cs.position==='static') thumb.style.position='relative';
      var b=document.createElement('span'); b.className='bj-rv-listbadge';
      b.innerHTML='<span class="st">★</span>'+c.avg.toFixed(1)+' 후기 '+cap(c.n);
      thumb.appendChild(b);
    });
  }
  function sortBar(){
    var list=document.querySelector('.prod_list'); if(!list||document.getElementById('bj-rv-sort')) return;
    var bar=document.createElement('div'); bar.id='bj-rv-sort';
    bar.innerHTML='<button data-s="0" class="on">기본순</button><button data-s="1">후기많은순</button>';
    list.parentNode.insertBefore(bar, list);
    Array.prototype.forEach.call(bar.querySelectorAll('button'), function(btn){
      btn.onclick=function(){
        Array.prototype.forEach.call(bar.children,function(c){c.className='';}); btn.className='on';
        var items=Array.prototype.slice.call(document.querySelectorAll('.prod_list .item'));
        if(!items.length) return; var parent=items[0].parentNode;
        if(btn.getAttribute('data-s')==='1'){ items.sort(function(a,b){ return (+b.getAttribute('data-bj-rvn')||0)-(+a.getAttribute('data-bj-rvn')||0); }); }
        else { items.sort(function(a,b){ return (+a.getAttribute('data-bj-order')||0)-(+b.getAttribute('data-bj-order')||0); }); }
        items.forEach(function(it){ parent.appendChild(it); });
      };
    });
  }
  function run(){ if(!counts) return; injectCss();
    if(IS_LIST){ Array.prototype.forEach.call(document.querySelectorAll('.prod_list .item'), function(it,i){ if(!it.getAttribute('data-bj-order')) it.setAttribute('data-bj-order', i); }); }
    badges();  // 정렬은 정렬 드롭다운(후기순/할인높은순)으로 일원화 — 별도 sortBar 미사용
  }
  function fetchCounts(){
    fetch(API+'/counts').then(function(r){return r.json();}).then(function(j){
      counts=j;
      // 브랜드 키워드 목록 = 후기 보유 브랜드(긴 이름 우선 매칭)
      brandList=Object.keys(j.by_cat||{}).map(function(k){return k.split('|')[0];}).filter(function(v,i,a){return a.indexOf(v)===i;}).sort(function(a,b){return b.length-a.length;});
      run();
      var n=0, iv=setInterval(function(){ run(); if(++n>12) clearInterval(iv); }, 500); // 지연 렌더 대비
    }).catch(function(){});
  }
  // 제품 카드가 나타나면 시작(메인 swiper 지연 렌더 대응). 카드 없는 페이지는 미실행(불필요 호출 방지)
  function start(){ if(window.__bjRvCStarted) return; if(!document.querySelector('.item p.name')) return; window.__bjRvCStarted=true; fetchCounts(); }
  var pn=0, piv=setInterval(function(){ start(); if(window.__bjRvCStarted || ++pn>20) clearInterval(piv); }, 400);
  start();
})();

/* 페이지 전환 로딩 오버레이 — billymag (로딩 길어지는 곳). beforeunload에 표시(실제 네비게이션에만 발생),
   bfcache 복귀(pageshow)·탭 복귀·12s 세이프티로 멈춤 방지. 오버레이/gif는 init때 미리 생성·프리로드. */
(function(){
  var GIF='https://admin2.billyjo.co.kr/billymag-down.gif';
  var ov, safeT;
  function build(){
    if(ov||!document.body) return;
    try{ var pre=new Image(); pre.src=GIF; }catch(e){}
    ov=document.createElement('div'); ov.id='bj-load-ov';
    ov.style.cssText='position:fixed;inset:0;z-index:2147483646;display:none;align-items:center;justify-content:center;flex-direction:column;background:rgba(255,255,255,.86)';
    ov.innerHTML='<img src="'+GIF+'" width="80" height="80" alt=""><div style="margin-top:10px;font:700 13px Pretendard,sans-serif;color:#5a6072">로딩중…</div>';
    document.body.appendChild(ov);
  }
  function show(){ if(!ov) build(); if(ov){ ov.style.display='flex'; clearTimeout(safeT); safeT=setTimeout(hide,12000); } }
  function hide(){ clearTimeout(safeT); if(ov) ov.style.display='none'; }
  if(document.readyState!=='loading') build(); else document.addEventListener('DOMContentLoaded', build);
  window.addEventListener('beforeunload', show);
  window.addEventListener('pageshow', hide);
  document.addEventListener('visibilitychange', function(){ if(!document.hidden) hide(); });
})();
