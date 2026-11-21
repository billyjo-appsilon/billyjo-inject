const fs = require('fs');
const path = require('path');

const source = fs.readFileSync(path.join(__dirname, '..', 'inject.js'), 'utf8');
const cutoutMatches = [...source.matchAll(/image: '(images\/products\/cutout-20261121\/[^']+\.(?:png|webp))'/g)];
const cutoutAssets = [...new Set(cutoutMatches.map((match) => match[1]))];

if (cutoutMatches.length !== 24 || cutoutAssets.length !== 24) {
  throw new Error(`expected 24 unique product cutout assets, got ${cutoutMatches.length} references and ${cutoutAssets.length} unique paths`);
}
for (const asset of cutoutAssets) {
  const assetPath = path.join(__dirname, '..', ...asset.split('/'));
  if (!fs.existsSync(assetPath) || fs.statSync(assetPath).size === 0) {
    throw new Error(`missing product cutout asset: ${asset}`);
  }
}

if (!/bestA\.innerHTML\s*=\s*'[^']*🎁<\/span>교체지원금\/사은품 확인'/.test(source)) {
  throw new Error('desktop GNB label is missing');
}
const mobileMatches = source.match(/link\.innerHTML\s*=\s*'[^']*🎁<\/span>교체지원금\/사은품 확인'/g) || [];
if (mobileMatches.length !== 2) throw new Error(`expected two mobile/fallback labels, got ${mobileMatches.length}`);

for (const required of [
  "var SNAPSHOT_MONTH = '2026-11'",
  "var TIERS = ['1만원 언더', '1만원대', '2만원대', '3만원대', '4만원대', '5만원대']",
  "var OFFICIAL_GIFT = '정수기 렌탈 시 공기청정기 1대 증정'",
  "tier: '1만원 언더', productId: '24129'",
  "tier: '1만원 언더', productId: '11327'",
  "tier: '1만원 언더', productId: '3657'",
  "tier: '1만원 언더', productId: '35287'",
  "tier: '1만원대', productId: '34614'",
  "tier: '1만원대', productId: '32596'",
  "tier: '1만원대', productId: '10914'",
  "tier: '1만원대', productId: '23052'",
  "tier: '2만원대', productId: '32586'",
  "tier: '2만원대', productId: '32100'",
  "tier: '2만원대', productId: '28918'",
  "tier: '2만원대', productId: '27223'",
  "tier: '3만원대', productId: '32918'",
  "tier: '3만원대', productId: '33000'",
  "tier: '3만원대', productId: '22764'",
  "tier: '3만원대', productId: '10428'",
  "tier: '4만원대', productId: '35730'",
  "tier: '4만원대', productId: '32592'",
  "tier: '4만원대', productId: '27476'",
  "tier: '4만원대', productId: '27503'",
  "tier: '5만원대', productId: '29036'",
  "tier: '5만원대', productId: '33632'",
  "tier: '5만원대', productId: '31903'",
  "tier: '5만원대', productId: '32406'",
  "productId: '34614'",
  "model: 'WP-50C90621N'",
  "regularPrice: 26900",
  "discount: 64",
  "price: 13450",
  "productId: '32586'",
  "model: 'WI-37C90720N'",
  "regularPrice: 39900",
  "discount: 54",
  "price: 20950",
  "rating: 4.9, reviewCount: 23",
  "rating: 4.9, reviewCount: 58",
  "rating: 4.8, reviewCount: 149",
  "rating: 4.8, reviewCount: 173",
  "month !== SNAPSHOT_MONTH",
  "benefits.indexOf(OFFICIAL_GIFT) === -1",
  "officialProducts.every(function (p) { return benefits.indexOf(p.benefitLine) !== -1; })",
  "data.year_month !== month",
  "section.id = 'bj-home-gift-promos'",
  "var LIVE1_HALF_BANNER_MASCOT = 'https://live.billyjo.co.kr/images/toss-banner-mascot.webp'",
  "function homeAssetUrl(path)",
  "src.match(/^(https?:\\/\\/[^/]+\\/gh\\/billyjo-appsilon\\/billyjo-inject@[^/]+\\/)/)",
  "HOME_ASSET_BASE || 'https://cdn.jsdelivr.net/gh/billyjo-appsilon/billyjo-inject@main/'",
  "image: 'images/products/cutout-20261121/WP610NWA6.png'",
  "image: 'images/products/cutout-20261121/AP1125G.webp'",
  "image: 'images/products/cutout-20261121/VR90F01SAG.png'",
  "class=\"bj-hgp-half-banner\" data-bj-live1-half-banner",
  "class=\"bj-hgp-half-line\">' + Number(month.split('-')[1]) + '월도</span> <em class=\"bj-hgp-half-line\">반값습니다!</em>",
  "선착순, 재고/사은품 소진시 종료",
  "data-bj-month-countdown aria-label=\"이번 달 특가 마감까지 남은 시간\"",
  "function startHomeMonthCountdown(section)",
  "var BRAND_LOGOS = {",
  "'웰스': 'images/brands/wells-horizontal-20261119.png'",
  "'LG전자': 'images/brands/lg-electronics-horizontal-20261119.png'",
  "'청호나이스': 'images/brands/chungho-horizontal-20261119.png'",
  "'쿠쿠': 'images/brands/cuckoo-horizontal-20261119.png'",
  "'루헨스': 'images/brands/ruhens-horizontal-20261119.png'",
  "'코웨이': 'images/brands/coway-horizontal-20261119.png'",
  "'현대렌탈케어': 'images/brands/quming-horizontal-20261119.png'",
  "'세스코': 'images/brands/cesco-horizontal-20261119.png'",
  "'삼성': 'images/brands/samsung-horizontal-20261119.png'",
  "class=\"bj-hgp-brand-logo\"",
  "class=\"bj-hgp-image\" data-bj-product-cutout=\"true\"><img src=\"' + homeAssetUrl(p.image) + '\" alt=\"' + p.name + '\" loading=\"lazy\" decoding=\"async\">' + badge + '<div class=\"bj-hgp-model\">' + p.model + '</div></div>'",
  "class=\"bj-hgp-pricebox\"",
  "class=\"bj-hgp-price-value\"",
  "class=\"bj-hgp-meta\"",
  "class=\"bj-hgp-main\"",
  "class=\"bj-hgp-actions\"",
  "class=\"bj-hgp-cart\"",
  "data-bj-hgp-cart=\"' + p.productId + '\"",
  ">담기</button>",
  "function addHomeProductToCart(productId)",
  "fetch('/html/dh_order/shop_cart'",
  "button.textContent = '담김 ✓'",
  "align-items:flex-start;text-align:left",
  ".bj-hgp-brand-logo{display:block;width:auto;height:16px;max-width:112px",
  ".bj-hgp-brand-logo{width:auto;height:14.4px;max-width:54px}",
  ".bj-hgp-model{position:absolute;z-index:3;left:8px;right:8px;bottom:7px",
  ".bj-hgp-model{left:6px;right:6px;bottom:6px",
  ".bj-hgp-image img{position:relative;z-index:1;width:100%;height:100%;object-fit:contain;filter:drop-shadow(0 5px 7px rgba(64,78,110,.18));transform:scale(1.18)}",
  ".bj-hgp-detail,.bj-hgp-cart{display:flex;min-width:0;height:34px",
  "font:900 13px/1 Pretendard,sans-serif",
  ".bj-hgp-detail,.bj-hgp-cart{height:30px;border-radius:8px;font-size:11px}",
  "align-items:baseline;justify-content:space-between",
  ".bj-hgp-pricebox{margin-top:5px;padding:5px 7px",
  "border-radius:18px;background:#fff;color:inherit",
  "aspect-ratio:1/1;border-radius:12px;background:radial-gradient",
  ".bj-hgp-half-banner{position:relative;display:grid;grid-template-columns:minmax(0,1fr) minmax(210px,42%)",
  ".bj-hgp-half-visual img{width:100%;height:100%;object-fit:cover;object-position:75% 68%}",
  "window.setInterval(update, 1000)",
  "data-bj-hgp-tier",
  "data-bj-hgp-extra hidden",
  "data-bj-hgp-toggle aria-expanded=\"false\"",
  "extras.length + '개 더보기'",
  "PRODUCTS.length - TIERS.length * 2",
  "function bindHomePromoToggle(section)",
  "function bindHomeProductNameRoll(section)",
  "class=\"bj-hgp-name-track\"",
  "class=\"bj-hgp-name-copy\" aria-hidden=\"true\"",
  ".bj-hgp-name.is-rolling .bj-hgp-name-track",
  "@keyframes bj-hgp-name-roll",
  "@media(prefers-reduced-motion:reduce)",
  "animation-play-state:paused",
  "text-overflow:ellipsis;animation:none",
  "document.fonts.ready.then(refreshAll)",
  "name.classList.add('is-rolling')",
  "bindHomeProductNameRoll(section)",
  "grid-template-columns:repeat(2,minmax(0,1fr));gap:8px",
  "flex-direction:column",
  "class=\"bj-hgp-info\"",
  "class=\"bj-hgp-regular\"",
  "class=\"bj-hgp-reviews\"",
  "<span class=\"bj-hgp-discount\">11월 특가</span>",
  "<span>정가</span> <s>월 ",
  "평점 ' + p.rating + '점, 후기 '",
  "월요금·할인·사은품은 약정과 관리방식에 따라 달라질 수 있으며",
  "if (!v5) return false",
  "v5.appendChild(section)",
  "data-bj-home-final-section', 'faq'",
  "pageEl.closest('.m_outer')",
  "padding-bottom:32px !important",
  "padding-bottom:24px !important",
  "window.__bjHomeReleaseV5('promotion-ready')",
  "pageEl.setAttribute('data-bj-home-pending', '1')",
  "releaseHome('promotion-timeout')",
  "var RELEASE_FALLBACK_MS = 2500",
  "showNativeFallback('v5-fetch-failed')",
  "settleWithoutPromotion('promotion-fetch-failed')",
]) {
  if (!source.includes(required)) throw new Error(`missing home promo contract: ${required}`);
}

if (source.includes('(VAT 별도)')) throw new Error('VAT label must stay hidden on home promo cards');
if (source.includes('추가 사은품 상담 대상')) throw new Error('stale consultation-target gift copy remains');
if (source.includes('min-height:31px')) throw new Error('mobile product names must not reserve a blank second line');
if (source.includes('.bj-hgp-name{display:-webkit-box')) throw new Error('mobile product names must not wrap to two lines');
for (const removed of [
  '<b>빌리조 위크</b> - 이번주 한정',
  'data-bj-week-countdown',
  'data-bj-countdown=',
  'startWeekCountdown(section)',
  'bj-hgp-source',
]) {
  if (source.includes(removed)) throw new Error(`removed weekly header contract remains: ${removed}`);
}

const numericDiscounts = source.match(/discount:\s*\d+/g) || [];
if (numericDiscounts.length !== 3) {
  throw new Error(`only three approved public promotion discounts may render, got ${numericDiscounts.length}`);
}
if (source.includes("p.discount + '% 할인'")) {
  throw new Error('official headline percentages must not be rendered beside arithmetically different regular/sale prices');
}
for (const stalePrice of ["price: 9400", "price: 44900", "price: 51210", "price: 56600"]) {
  if (source.includes(stalePrice)) throw new Error(`stale product price remains: ${stalePrice}`);
}

if (!source.includes("origin: '시크릿 1:1 패키지'")) {
  throw new Error('analytics/wizard origin must remain stable');
}

console.log('home promo gift contract: ok');
