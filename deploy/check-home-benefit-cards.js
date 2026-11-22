const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const repoRoot = path.join(__dirname, '..');
const injectPath = path.join(repoRoot, 'inject.js');
const injectSource = fs.readFileSync(injectPath, 'utf8');

const cards = [
  ['01', "빌리조만의 '최대'지원 혜택", '설치 보상 당일지급', 'benefit-01-same-day-cash-cutout.png'],
  ['02', '빌리조에서는', '렌탈료 15개월 반값', 'benefit-02-rental-half-cutout.png'],
  ['03', '카드 할인', '최대 13,000~25,000원', 'benefit-04-card-discount-cutout.png'],
  ['04', '정수기, 가전 렌탈 2대 이상 설치시', '결합할인 15% 이상, 추가 사은품 증정', 'benefit-05-package-two-cutout.png'],
  ['05', '정수기 교체할인 %', '할인+보상교체', 'benefit-06-switch-reward-cutout.png'],
  ['06', '타사 사은품 견적 안내 시', '추가 지원금 조회 가능', 'benefit-01-same-day-cash-cutout.png']
];

const assetHashes = {
  'benefit-01-same-day-cash-cutout.png': '7d87fbaacf97427c4b96efdc88e411deeea33032a3b4e1d1b38511bae7133ece',
  'benefit-02-rental-half-cutout.png': 'c2848a2727d8d0e70965e42c21080a5c93af731dcd4df1adedb30d1abc7b2209',
  'benefit-04-card-discount-cutout.png': '5ff299ee73f3150199356d69a12c902694113717359daf39cc0e2077aa9df95f',
  'benefit-05-package-two-cutout.png': '2a3727d85be37309b4d526c2f4ecbc82e26adf938107799b903a68a292d94066',
  'benefit-06-switch-reward-cutout.png': 'c6e41ac3a1105de2a4b7873f417f04e3041a7bd4f1acd5dd0fcaa914c3888564'
};

for (const [number, kicker, value, image] of cards) {
  for (const required of [
    `number: '${number}'`,
    kicker,
    value,
    `image: 'images/live1/icons/${image}'`
  ]) {
    if (!injectSource.includes(required)) throw new Error(`missing source contract: ${required}`);
  }
}

for (const [filename, expected] of Object.entries(assetHashes)) {
  const assetPath = path.join(repoRoot, 'images', 'live1', 'icons', filename);
  const actual = crypto.createHash('sha256').update(fs.readFileSync(assetPath)).digest('hex');
  if (actual !== expected) throw new Error(`asset hash mismatch for ${filename}: ${actual}`);
}

if (!injectSource.includes("section.parentNode.insertBefore(benefits, section.nextSibling)")) {
  throw new Error('benefit section must be inserted immediately after the category section');
}
if (!injectSource.includes("var ref = benefits ? benefits.nextSibling")) {
  throw new Error('category product module must preserve the benefit section position');
}
for (const sliderContract of [
  "stack.setAttribute('data-bj-slider-ready', '1')",
  "margin-left:20px",
  "goTo((currentIndex + 1) % cards.length, 'smooth')",
  "window.matchMedia('(prefers-reduced-motion: reduce)')"
]) {
  if (!injectSource.includes(sliderContract)) throw new Error(`missing benefit slider contract: ${sliderContract}`);
}

async function inspectViewport(browser, width, height) {
  const page = await browser.newPage({ viewport: { width, height } });
  let injectIntercepts = 0;
  const pageErrors = [];
  page.on('pageerror', (error) => pageErrors.push(String(error && error.message || error)));
  await page.route(/billyjo-inject(?:@[0-9a-f]{7,40})?\/inject(?:\.min)?\.js/i, async (route) => {
    injectIntercepts += 1;
    await route.fulfill({
      status: 200,
      contentType: 'application/javascript; charset=utf-8',
      headers: { 'access-control-allow-origin': '*' },
      body: injectSource
    });
  });
  await page.route(/billyjo-inject(?:@[^/]+)?\/images\/live1\/icons\/([^?]+)/i, async (route) => {
    const filename = path.basename(new URL(route.request().url()).pathname);
    const assetPath = path.join(repoRoot, 'images', 'live1', 'icons', filename);
    if (!fs.existsSync(assetPath)) return route.continue();
    await route.fulfill({ status: 200, contentType: 'image/png', body: fs.readFileSync(assetPath) });
  });

  try {
    await page.goto('https://billyjo.co.kr/', { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForSelector('#bj-home-benefit-cards .bj-hbenefit-card', { state: 'visible', timeout: 30000 });
    await page.waitForSelector('#bj-home-benefit-cards .bj-hbenefit-stack[data-bj-slider-ready="1"]', { state: 'visible', timeout: 30000 });
    await page.locator('#bj-home-benefit-cards').scrollIntoViewIfNeeded();
    if (width <= 767 && width !== 390) {
      await page.locator('#bj-home-benefit-cards .bj-hbenefit-toggle').click();
    }
    const benefitCards = page.locator('#bj-home-benefit-cards .bj-hbenefit-card');
    for (let index = 0; index < await benefitCards.count(); index += 1) {
      await benefitCards.nth(index).scrollIntoViewIfNeeded();
    }
    await page.evaluate(() => {
      document.querySelectorAll('#bj-home-benefit-cards img').forEach((image) => { image.loading = 'eager'; });
      const stack = document.querySelector('#bj-home-benefit-cards .bj-hbenefit-stack');
      if (stack) stack.scrollLeft = stack.scrollWidth;
    });
    await page.waitForFunction(() => Array.from(document.querySelectorAll('#bj-home-benefit-cards img')).every((img) => img.complete && img.naturalWidth > 0), null, { timeout: 30000 });
    await page.evaluate(() => {
      const stack = document.querySelector('#bj-home-benefit-cards .bj-hbenefit-stack');
      if (stack) stack.scrollLeft = 0;
    });
    await page.waitForFunction(() => document.body.classList.contains('bj-home-cats-ready'), null, { timeout: 10000 });
    // The home inject intentionally reruns several recovery passes through 3.5s.
    // Wait until those settle before measuring or taking visual evidence.
    await page.waitForTimeout(4200);
    await page.evaluate(() => {
      const card = document.querySelector('#bj-home-benefit-cards .bj-hbenefit-card');
      document.documentElement.style.scrollBehavior = 'auto';
      const top = card.getBoundingClientRect().top + window.scrollY;
      document.scrollingElement.scrollTop = Math.max(0, top - Math.round(window.innerHeight / 3));
    });
    if (width === 390) {
      await page.waitForTimeout(250);
      const toggle = page.locator('#bj-home-benefit-cards .bj-hbenefit-toggle');
      const firstDot = page.locator('#bj-home-benefit-cards .bj-hbenefit-dot').first();
      await toggle.click();
      await firstDot.click();
      await page.waitForTimeout(100);
      await toggle.click();
      const initialBenefit = await page.locator('#bj-home-benefit-cards').getAttribute('data-bj-active-benefit');
      try {
        await page.waitForFunction((initial) => {
          const section = document.getElementById('bj-home-benefit-cards');
          return section && section.getAttribute('data-bj-active-benefit') !== initial;
        }, initialBenefit, { timeout: 6000 });
      } catch (_autoplayError) {
        const autoplayDebug = await page.evaluate(() => {
          const section = document.getElementById('bj-home-benefit-cards');
          const stack = section && section.querySelector('.bj-hbenefit-stack');
          const rect = section && section.getBoundingClientRect();
          return {
            active: section && section.getAttribute('data-bj-active-benefit'),
            autoplay: section && section.getAttribute('data-bj-benefit-autoplay'),
            scrollLeft: stack && stack.scrollLeft,
            viewport: [innerWidth, innerHeight],
            sectionRect: rect && { top: rect.top, bottom: rect.bottom, height: rect.height },
            scroll: { y: scrollY, top: document.scrollingElement && document.scrollingElement.scrollTop },
            hidden: document.hidden,
            reduced: matchMedia('(prefers-reduced-motion: reduce)').matches
          };
        });
        throw new Error(`benefit autoplay did not advance from ${initialBenefit}: ${JSON.stringify(autoplayDebug)}`);
      }
      await page.waitForTimeout(800);
      const autoplayState = await page.locator('#bj-home-benefit-cards').evaluate((section) => {
        const active = section.getAttribute('data-bj-active-benefit');
        const card = section.querySelector(`[data-bj-benefit-number="${active}"]`);
        const stack = section.querySelector('.bj-hbenefit-stack');
        return {
          active,
          activeLeft: card && card.getBoundingClientRect().left,
          scrollLeft: stack.scrollLeft,
          stackLeft: stack.getBoundingClientRect().left
        };
      });
      if (autoplayState.active === initialBenefit || autoplayState.scrollLeft < 1 || Math.abs(autoplayState.activeLeft - autoplayState.stackLeft) > 1) {
        throw new Error(`benefit autoplay did not settle on the next padded card: ${JSON.stringify(autoplayState)}`);
      }
      const sectionScreenshotPath = String(process.env.BILLYJO_BENEFIT_SECTION_SCREENSHOT || '').trim();
      if (sectionScreenshotPath) {
        fs.mkdirSync(path.dirname(sectionScreenshotPath), { recursive: true });
        await page.locator('#bj-home-benefit-cards').screenshot({ path: sectionScreenshotPath });
      }
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.waitForTimeout(700);
      const reducedBefore = await page.locator('#bj-home-benefit-cards .bj-hbenefit-stack').evaluate((stack) => stack.scrollLeft);
      await page.waitForTimeout(2600);
      const reducedState = await page.locator('#bj-home-benefit-cards').evaluate((section) => ({
        autoplay: section.getAttribute('data-bj-benefit-autoplay'),
        scrollLeft: section.querySelector('.bj-hbenefit-stack').scrollLeft,
        scrollBehavior: getComputedStyle(section.querySelector('.bj-hbenefit-stack')).scrollBehavior,
        toggleDisplay: getComputedStyle(section.querySelector('.bj-hbenefit-toggle')).display
      }));
      if (reducedState.autoplay !== 'reduced-motion' || Math.abs(reducedState.scrollLeft - reducedBefore) > 1 || reducedState.scrollBehavior !== 'auto' || reducedState.toggleDisplay !== 'none') {
        throw new Error(`reduced-motion benefit slider contract regressed: ${JSON.stringify({ reducedBefore, reducedState })}`);
      }
      await page.locator('#bj-home-benefit-cards .bj-hbenefit-dot').last().click();
      await page.waitForTimeout(100);
      const lastCardState = await page.locator('#bj-home-benefit-cards').evaluate((section) => {
        const stack = section.querySelector('.bj-hbenefit-stack');
        const cards = Array.from(section.querySelectorAll('.bj-hbenefit-card'));
        const stackRect = stack.getBoundingClientRect();
        const lastRect = cards[cards.length - 1].getBoundingClientRect();
        const previousRect = cards[cards.length - 2].getBoundingClientRect();
        return {
          active: section.getAttribute('data-bj-active-benefit'),
          stackLeft: stackRect.left,
          lastLeft: lastRect.left,
          previousRight: previousRect.right,
          maxScrollReached: Math.abs(stack.scrollLeft - (stack.scrollWidth - stack.clientWidth)) <= 1
        };
      });
      if (lastCardState.active !== '06' || Math.abs(lastCardState.lastLeft - lastCardState.stackLeft) > 1 || lastCardState.previousRight > lastCardState.stackLeft + 1) {
        throw new Error(`last benefit card does not align cleanly at the left inset: ${JSON.stringify(lastCardState)}`);
      }
      await page.locator('#bj-home-benefit-cards .bj-hbenefit-stack').evaluate((stack) => { stack.scrollLeft = 0; });
    }
    const result = await page.evaluate(() => {
      const category = document.getElementById('bj-home-cat-links');
      const section = document.getElementById('bj-home-benefit-cards');
      const promo = document.getElementById('bj-home-gift-promos');
      const stack = section.querySelector('.bj-hbenefit-stack');
      const rows = Array.from(section.querySelectorAll('.bj-hbenefit-card')).map((card) => {
        const rect = card.getBoundingClientRect();
        const image = card.querySelector('img');
        return {
          number: card.querySelector('.bj-hbenefit-number').textContent.trim(),
          kicker: card.querySelector('.bj-hbenefit-kicker').textContent.trim(),
          value: card.querySelector('.bj-hbenefit-value').textContent.trim(),
          image: new URL(image.src).pathname.split('/').pop(),
          imageWidth: image.naturalWidth,
          left: rect.left,
          right: rect.right,
          sectionLeft: section.getBoundingClientRect().left,
          sectionRight: section.getBoundingClientRect().right
        };
      });
      return {
        directAfterPromo: promo && promo.nextElementSibling === section,
        redundantEntryPresent: Boolean(document.getElementById('bj-home-conversion-entry')),
        scroller: {
          left: stack.getBoundingClientRect().left,
          scrollWidth: stack.scrollWidth,
          clientWidth: stack.clientWidth,
          tabindex: stack.getAttribute('tabindex'),
          role: stack.getAttribute('role'),
          aria: stack.getAttribute('aria-label') || '',
          sliderReady: stack.getAttribute('data-bj-slider-ready'),
          paddingLeft: parseFloat(getComputedStyle(stack).paddingLeft) || 0,
          scrollPaddingLeft: parseFloat(getComputedStyle(stack).scrollPaddingLeft) || 0,
        },
        slider: {
          controls: section.querySelectorAll('.bj-hbenefit-controls').length,
          dots: section.querySelectorAll('.bj-hbenefit-dot').length,
          currentDots: section.querySelectorAll('.bj-hbenefit-dot[aria-current="true"]').length,
          autoplay: section.getAttribute('data-bj-benefit-autoplay'),
          active: section.getAttribute('data-bj-active-benefit')
        },
        homeReleased: document.body.classList.contains('bj-home-cats-ready'),
        count: rows.length,
        rows,
        viewportWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
        highlight: section.querySelector('[data-bj-benefit-number="05"] mark')?.textContent.trim() || '',
        sampleTopElement: (() => {
          const first = section.querySelector('.bj-hbenefit-card');
          const rect = first.getBoundingClientRect();
          const node = document.elementFromPoint(rect.left + Math.min(80, rect.width / 2), rect.top + Math.min(70, rect.height / 2));
          return node ? `${node.tagName.toLowerCase()}#${node.id || ''}.${node.className || ''}` : '';
        })(),
        firstRect: (() => {
          const rect = section.querySelector('.bj-hbenefit-card').getBoundingClientRect();
          return { top: rect.top, bottom: rect.bottom, left: rect.left, right: rect.right };
        })(),
        scrollDebug: {
          y: window.scrollY,
          scrollHeight: document.scrollingElement.scrollHeight,
          clientHeight: document.scrollingElement.clientHeight,
          bodyOverflow: getComputedStyle(document.body).overflow,
          htmlOverflow: getComputedStyle(document.documentElement).overflow,
          center: (() => {
            const node = document.elementFromPoint(innerWidth / 2, innerHeight / 2);
            return node ? `${node.tagName.toLowerCase()}#${node.id || ''}.${node.className || ''}` : '';
          })()
        }
      };
    });

    if (injectIntercepts < 1) throw new Error(`inject route was not intercepted at ${width}px`);
    if (!result.homeReleased) throw new Error(`home release gate did not open at ${width}px`);
    if (!result.directAfterPromo || result.redundantEntryPresent) throw new Error(`benefit section is not directly after promos or redundant entry remains at ${width}px`);
    if (result.count !== cards.length) throw new Error(`expected ${cards.length} cards, got ${result.count} at ${width}px`);
    if (result.highlight !== '할인+보상교체') throw new Error(`card 05 highlight mismatch at ${width}px`);
    if (!/bj-hbenefit/.test(result.sampleTopElement)) throw new Error(`benefit cards are visually occluded at ${width}px by ${result.sampleTopElement}; rect=${JSON.stringify(result.firstRect)}; scroll=${JSON.stringify(result.scrollDebug)}`);
    if (result.scrollWidth > Math.max(result.viewportWidth, width) + 1) throw new Error(`horizontal overflow at ${width}px: ${result.scrollWidth}/${result.viewportWidth}`);
    if (result.scroller.tabindex !== '0' || result.scroller.role !== 'region' || !result.scroller.aria.includes('혜택 6개')) {
      throw new Error(`benefit scroller accessibility contract regressed at ${width}px: ${JSON.stringify(result.scroller)}`);
    }
    if (result.scroller.sliderReady !== '1' || result.slider.controls !== 1 || result.slider.dots !== cards.length || result.slider.currentDots !== 1) {
      throw new Error(`benefit slider controls regressed at ${width}px: ${JSON.stringify(result.slider)}`);
    }
    if (width <= 767 && (result.scroller.left < 19 || result.rows[0].left < 19)) {
      throw new Error(`mobile benefit slider must preserve visible left padding at ${width}px: ${JSON.stringify({ scroller:result.scroller, first:result.rows[0] })}`);
    }
    result.rows.forEach((row, index) => {
      const expected = cards[index];
      const actual = [row.number, row.kicker, row.value, row.image];
      if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        throw new Error(`card ${index + 1} mismatch at ${width}px: ${JSON.stringify(actual)}`);
      }
      if (row.imageWidth < 1) throw new Error(`card ${row.number} image failed at ${width}px`);
      const exceedsSection = row.left < row.sectionLeft - 1 || row.right > row.sectionRight + 1;
      const exceedsScroller = row.left < result.scroller.left - 1 || row.right > result.scroller.left + result.scroller.scrollWidth + 1;
      if ((width > 767 && exceedsSection) || (width <= 767 && exceedsScroller)) {
        throw new Error(`card ${row.number} exceeds section bounds at ${width}px`);
      }
    });
    const relevantErrors = pageErrors.filter((message) => /bj-home-benefit|SyntaxError|ReferenceError/.test(message));
    if (relevantErrors.length) throw new Error(`relevant page errors at ${width}px: ${relevantErrors.join(' | ')}`);
    const screenshotDir = String(process.env.BILLYJO_BENEFIT_SCREENSHOT_DIR || '').trim();
    if (screenshotDir) {
      fs.mkdirSync(screenshotDir, { recursive: true });
      for (let index = 0; index < cards.length; index += 1) {
        await page.evaluate((cardIndex) => {
          const card = document.querySelectorAll('#bj-home-benefit-cards .bj-hbenefit-card')[cardIndex];
          document.scrollingElement.scrollTop += card.getBoundingClientRect().top - 20;
        }, index);
        const box = await page.locator('#bj-home-benefit-cards .bj-hbenefit-card').nth(index).boundingBox();
        await page.screenshot({ path: path.join(screenshotDir, `home-benefits-${width}-${index + 1}.png`), clip: box });
      }
    }
    return { width, count: result.count, directAfterPromo: result.directAfterPromo, overflow: result.scrollWidth - Math.max(result.viewportWidth, width) };
  } finally {
    await page.close();
  }
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const results = [];
    for (const viewport of [[320, 900], [390, 900], [430, 900], [1280, 900]]) {
      results.push(await inspectViewport(browser, viewport[0], viewport[1]));
    }
    console.log(JSON.stringify({ contract: 'ok', results }, null, 2));
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error && error.stack || error);
  process.exit(1);
});
