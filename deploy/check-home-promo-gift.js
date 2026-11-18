const fs = require('fs');
const path = require('path');

const source = fs.readFileSync(path.join(__dirname, '..', 'inject.js'), 'utf8');

if (!/bestA\.innerHTML\s*=\s*'[^']*프로모션\/사은품 확인'/.test(source)) {
  throw new Error('desktop GNB label is missing');
}
const mobileMatches = source.match(/link\.innerHTML\s*=\s*'[^']*프로모션\/사은품 확인'/g) || [];
if (mobileMatches.length !== 2) throw new Error(`expected two mobile/fallback labels, got ${mobileMatches.length}`);

for (const required of [
  "var SNAPSHOT_MONTH = '2026-11'",
  "var TIERS = ['1만원 언더', '1만원대', '2만원대', '3만원대', '4만원대', '5만원대']",
  "var OFFICIAL_GIFT = '정수기 렌탈 시 공기청정기 1대 증정'",
  "tier: '1만원 언더', productId: '24129'",
  "tier: '1만원 언더', productId: '11327'",
  "tier: '1만원대', productId: '34614'",
  "tier: '1만원대', productId: '32596'",
  "tier: '2만원대', productId: '32586'",
  "tier: '2만원대', productId: '32100'",
  "tier: '3만원대', productId: '32918'",
  "tier: '3만원대', productId: '33000'",
  "tier: '4만원대', productId: '35730'",
  "tier: '4만원대', productId: '32592'",
  "tier: '5만원대', productId: '29036'",
  "tier: '5만원대', productId: '33632'",
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
  "<b>' + monthLabel + '월 특가!</b> 추가 사은품!",
  "(VAT 별도)",
  "data-bj-hgp-tier",
  "grid-template-columns:116px minmax(0,1fr)",
  "class=\"bj-hgp-info\"",
  "class=\"bj-hgp-regular\"",
  "class=\"bj-hgp-reviews\"",
  "<span class=\"bj-hgp-discount\">11월 특가</span>",
  "정가 <s>월 ",
  "평점 ' + p.rating + '점, 후기 '",
  "월요금·할인·사은품은 약정과 관리방식에 따라 달라질 수 있으며",
  "if (v5) v5.appendChild(section)",
  "else heading.parentNode.insertBefore(section, heading)",
]) {
  if (!source.includes(required)) throw new Error(`missing home promo contract: ${required}`);
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
