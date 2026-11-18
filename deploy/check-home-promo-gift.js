const fs = require('fs');
const path = require('path');

const source = fs.readFileSync(path.join(__dirname, '..', 'inject.js'), 'utf8');

if (!/bestA\.innerHTML\s*=\s*'[^']*프로모션\/사은품 확인'/.test(source)) {
  throw new Error('desktop GNB label is missing');
}
const mobileMatches = source.match(/link\.innerHTML\s*=\s*'[^']*프로모션\/사은품 확인'/g) || [];
if (mobileMatches.length !== 2) throw new Error(`expected two mobile/fallback labels, got ${mobileMatches.length}`);

for (const required of [
  "productId: '34614'",
  "model: 'WP-50C90621N'",
  "discount: 64",
  "price: 13450",
  "productId: '32586'",
  "model: 'WI-37C90720N'",
  "discount: 54",
  "price: 20950",
  "var GIFT = '정수기 렌탈 시 공기청정기 1대 증정'",
  "benefits.indexOf(p.benefitLine) !== -1",
  "data.year_month !== month",
  "section.id = 'bj-home-gift-promos'",
  "if (v5) v5.appendChild(section)",
  "else heading.parentNode.insertBefore(section, heading)",
]) {
  if (!source.includes(required)) throw new Error(`missing home promo contract: ${required}`);
}

if (!source.includes("origin: '시크릿 1:1 패키지'")) {
  throw new Error('analytics/wizard origin must remain stable');
}

console.log('home promo gift contract: ok');
