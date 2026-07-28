/* 라이브 상세페이지의 '비슷한 분들이 함께 본 제품' 카드 이미지 회귀 검사.
 *
 * 배경: 2026-07-28 — 목록에서 내려간 상품이 추천에 남아 빈 회색 박스로 노출됐다.
 * 데이터 파이프라인(admin2 image_status)이 막아야 정상이지만, 파이프라인이 굳거나
 * 사이트 마크업이 바뀌면 또 샐 수 있다. 이 검사는 **실제 화면 기준**으로 확인한다.
 *
 * 검사 항목 (카드 1장이라도 어기면 exit 1)
 *   - 카드의 <img> 가 실제로 로드됐는가 (naturalWidth > 0)
 *   - "제품 이미지" placeholder 로 남은 카드가 없는가
 *   - 링크(href)가 prod_view 를 가리키는가
 *
 * 사용:
 *   node reco-image-check.js                 # 기본 상품 3종, 데스크탑+모바일
 *   node reco-image-check.js 24129 24578     # 상품번호 지정
 *   node reco-image-check.js --local         # 로컬 inject.js 를 주입해 배포 전 검사
 */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const argv = process.argv.slice(2);
const LOCAL_MODE = argv.includes('--local');
const PRODUCTS = argv.filter((a) => /^\d+$/.test(a));
const TARGETS = PRODUCTS.length ? PRODUCTS : ['24129', '24578', '9898'];
const LOCAL = fs.readFileSync(path.join(__dirname, '..', 'inject.js'), 'utf8');

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 1000, mobile: false },
  { name: 'mobile', width: 390, height: 844, mobile: true },
];

(async () => {
  const browser = await chromium.launch();
  const fails = [];
  let checked = 0;

  for (const pid of TARGETS) {
    for (const vp of VIEWPORTS) {
      const ctx = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        isMobile: vp.mobile,
        hasTouch: vp.mobile,
        userAgent: vp.mobile
          ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1'
          : undefined,
      });
      if (LOCAL_MODE) {
        await ctx.route(/billyjo-inject@[^/]+\/inject\.js/, (route) =>
          route.fulfill({ status: 200, contentType: 'application/javascript', body: LOCAL })
        );
      }
      const page = await ctx.newPage();
      await page.goto(`https://www.billyjo.co.kr/html/dh_prod/prod_view/${pid}`, {
        waitUntil: 'domcontentloaded', timeout: 60000,
      });
      await page.waitForTimeout(15000); // 카드 주입 + 추천 fetch + 썸네일 로드

      const cards = await page.evaluate(() => {
        const out = [];
        document.querySelectorAll('a.bj-reco-top-card, a.bj-reco-card').forEach((c) => {
          const img = c.querySelector('img');
          const box = c.querySelector('.bj-reco-top-img, .bj-reco-img');
          out.push({
            name: (c.querySelector('.bj-reco-top-name, .bj-reco-name') || {}).textContent?.trim() || '?',
            href: c.getAttribute('href') || '',
            hasImg: !!img,
            loaded: img ? img.naturalWidth > 0 && img.naturalHeight > 0 : false,
            src: img ? img.getAttribute('src') : null,
            boxText: box ? box.textContent.trim() : '',
          });
        });
        return out;
      });
      await ctx.close();

      const tag = `[${pid}/${vp.name}]`;
      if (!cards.length) {
        console.log(`${tag} 추천 카드 없음 — SKIP (추천 후보가 없는 상품일 수 있음)`);
        continue;
      }
      checked += cards.length;
      console.log(`${tag} 카드 ${cards.length}장`);
      cards.forEach((c) => {
        const label = `${tag} "${c.name.slice(0, 22)}"`;
        if (!c.hasImg) fails.push(`${label} 이미지 없음 (placeholder: "${c.boxText}")`);
        else if (!c.loaded) fails.push(`${label} 이미지 로드 실패 — ${c.src}`);
        if (!/\/prod_view\/\d+/.test(c.href)) fails.push(`${label} 링크 이상 — ${c.href}`);
      });
    }
  }

  await browser.close();
  if (fails.length) {
    console.error(`\nFAIL (${fails.length}건):\n- ` + fails.join('\n- '));
    process.exit(1);
  }
  console.log(`\nOK — 카드 ${checked}장 전부 이미지 정상`);
})().catch((e) => { console.error('FAIL:', e.message); process.exit(1); });
