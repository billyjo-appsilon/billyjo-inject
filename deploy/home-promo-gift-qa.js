const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const injectSource = fs.readFileSync(path.join(__dirname, '..', 'inject.js'), 'utf8');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const cases = [
    { name: 'desktop', width: 1440, height: 1000 },
    { name: 'mobile', width: 390, height: 844 },
  ];

  for (const testCase of cases) {
    const page = await browser.newPage({ viewport: testCase });
    await page.route(/cdn\.jsdelivr\.net\/gh\/billyjo-appsilon\/billyjo-inject@[^/]+\/inject(?:\.min)?\.js/, async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/javascript; charset=utf-8', body: injectSource });
    });
    await page.goto('https://billyjo.co.kr/', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForSelector('#bj-home-gift-promos', { timeout: 30000 });
    await page.waitForFunction(() => {
      const images = [...document.querySelectorAll('#bj-home-gift-promos img')];
      return images.length === 2 && images.every((image) => image.complete && image.naturalWidth > 0);
    }, { timeout: 30000 });
    await page.waitForTimeout(10000);

    const result = await page.evaluate(() => {
      const section = document.querySelector('#bj-home-gift-promos');
      const heading = [...document.querySelectorAll('h2')].find((node) => node.textContent.includes('이달의 추천제품'));
      const cards = [...document.querySelectorAll('.bj-hgp-card')];
      const menuLabels = [...document.querySelectorAll('.bj-best-gnb, .bj-newlywed-cat')]
        .map((node) => node.textContent.replace(/\s+/g, ' ').trim());
      return {
        cards: cards.map((card) => ({
          id: card.getAttribute('data-bj-hgp-product'),
          text: card.textContent.replace(/\s+/g, ' ').trim(),
          href: card.href,
          imageLoaded: card.querySelector('img').naturalWidth > 0,
        })),
        beforeNativeRecommendation: !!(section.compareDocumentPosition(heading) & Node.DOCUMENT_POSITION_FOLLOWING),
        menuLabels,
        oldVisibleMenuCount: [...document.querySelectorAll('.bj-best-gnb, .bj-newlywed-cat')]
          .filter((node) => node.textContent.includes('시크릿 1:1 패키지')).length,
        sectionVisible: getComputedStyle(section).display !== 'none' && section.getBoundingClientRect().height > 0,
        horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      };
    });

    if (result.cards.length !== 2) throw new Error(`${testCase.name}: expected two promo cards`);
    if (result.cards.map((card) => card.id).join(',') !== '34614,32586') {
      throw new Error(`${testCase.name}: promo card order is wrong`);
    }
    for (const expected of ['64% 할인', '월 13,450원~', '54% 할인', '월 20,950원~', '공기청정기 1대 증정 대상']) {
      if (!result.cards.some((card) => card.text.includes(expected))) {
        throw new Error(`${testCase.name}: missing ${expected}`);
      }
    }
    if (!result.cards.every((card) => card.imageLoaded)) throw new Error(`${testCase.name}: promo image failed`);
    if (!result.beforeNativeRecommendation) throw new Error(`${testCase.name}: promo cards must precede native recommendations`);
    if (!result.menuLabels.some((label) => label.includes('프로모션/사은품 확인'))) {
      throw new Error(`${testCase.name}: new menu label is missing`);
    }
    if (result.oldVisibleMenuCount !== 0) throw new Error(`${testCase.name}: old menu label remains visible`);
    if (!result.sectionVisible) throw new Error(`${testCase.name}: promo section is hidden`);
    if (result.horizontalOverflow) throw new Error(`${testCase.name}: horizontal overflow detected`);
    console.log(`${testCase.name}: ok`, JSON.stringify(result));
    await page.close();
  }
  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
