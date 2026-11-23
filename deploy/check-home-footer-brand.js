const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const repoRoot = path.join(__dirname, '..');
const injectSource = fs.readFileSync(path.join(repoRoot, 'inject.js'), 'utf8');

for (const required of [
  'function bjNativeFooterBrandLockup()',
  "block.setAttribute('aria-label', '빌리조 및 공식 파트너')",
  "asset('images/logo/billyjo-ko.webp')",
  "asset('images/meta-business-partner.webp')",
  "asset('images/toss-logo.webp')",
  "'.bj-home-faq-zone{padding-bottom:0!important}'",
  "'footer.new-footer{padding-top:20px!important}'",
  "'footer.new-footer .footer__info .info__top{position:static!important;margin:0 0 12px!important}'",
]) {
  if (!injectSource.includes(required)) throw new Error(`missing footer source contract: ${required}`);
}

async function inspect(browser, width) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  const pageErrors = [];
  let injectIntercepts = 0;
  page.on('pageerror', (error) => pageErrors.push(String(error && error.message || error)));
  await page.route(/billyjo-inject(?:@[0-9a-f]{7,40})?\/inject(?:\.min)?\.js/i, async (route) => {
    injectIntercepts += 1;
    await route.fulfill({
      status: 200,
      contentType: 'application/javascript; charset=utf-8',
      headers: { 'access-control-allow-origin': '*' },
      body: injectSource,
    });
  });

  try {
    await page.goto(`https://billyjo.co.kr/?apsi_footer_brand_qa=${width}`, {
      waitUntil: 'domcontentloaded',
      timeout: 45000,
    });
    await page.waitForSelector('#bj-v5-injected[data-bj-home-released]', { timeout: 30000 });
    await page.waitForSelector('footer.new-footer > .bj-native-partners', { timeout: 15000 });
    // The home landing top guard owns the first 2.5s; scroll only after it settles.
    await page.waitForTimeout(2800);
    await page.locator('footer.new-footer > .bj-native-partners').scrollIntoViewIfNeeded();
    try {
      await page.waitForFunction(() => Array.from(document.querySelectorAll('.bj-native-partners img')).every((img) => img.complete && img.naturalWidth > 0), null, { timeout: 20000 });
    } catch (error) {
      const imageState = await page.evaluate(() => Array.from(document.querySelectorAll('.bj-native-partners img')).map((image) => ({
        alt: image.alt,
        src: image.src,
        complete: image.complete,
        naturalWidth: image.naturalWidth,
        naturalHeight: image.naturalHeight,
      })));
      throw new Error(`footer images failed to load at ${width}px: ${JSON.stringify(imageState)} (${error.message})`);
    }
    await page.waitForTimeout(800);

    const result = await page.evaluate(() => {
      const footer = document.querySelector('footer.new-footer');
      const block = footer?.querySelector(':scope > .bj-native-partners');
      const brand = block?.querySelector('.bj-native-brand');
      const cards = Array.from(block?.querySelectorAll('.bj-native-partner-card') || []);
      const images = Array.from(block?.querySelectorAll('img') || []);
      const lastFaq = document.querySelector('.bj-home-faq-item:last-child');
      const mobileCs = footer?.querySelector('.footer__info .footer__cs.show-767');
      const privacy = footer?.querySelector('.footer__info .info__top');
      const social = footer?.querySelector('.footer__info .show-767 .cs__sns');
      const infoMore = footer?.querySelector('.footer__info .info__more');
      const box = (node) => {
        const rect = node?.getBoundingClientRect();
        return rect ? { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom, width: rect.width, height: rect.height } : null;
      };
      const style = (node) => node ? getComputedStyle(node) : null;
      return {
        viewportWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
        blockCount: document.querySelectorAll('footer.new-footer > .bj-native-partners').length,
        firstChild: footer?.firstElementChild === block,
        ariaLabel: block?.getAttribute('aria-label') || '',
        block: box(block),
        brand: box(brand),
        cards: cards.map(box),
        images: images.map((image) => ({
          alt: image.alt,
          src: image.src,
          loaded: Boolean(image.complete && image.naturalWidth > 0),
          naturalWidth: image.naturalWidth,
          naturalHeight: image.naturalHeight,
        })),
        lastFaq: box(lastFaq),
        privacy: box(privacy),
        gapFaqToBrand: lastFaq && brand ? Math.round(brand.getBoundingClientRect().top - lastFaq.getBoundingClientRect().bottom) : null,
        gapPartnersToPrivacy: block && privacy ? Math.round(privacy.getBoundingClientRect().top - block.getBoundingClientRect().bottom) : null,
        mobileMargins: {
          customer: mobileCs ? parseFloat(style(mobileCs).marginTop) : null,
          social: social ? parseFloat(style(social).marginTop) : null,
          infoMore: infoMore ? parseFloat(style(infoMore).marginTop) : null,
        },
        preserved: {
          privacy: Boolean(footer?.querySelector('a[href*="privacy_policy"]')),
          phone: (footer?.textContent || '').includes('070-4918-7683'),
          instagram: Boolean(footer?.querySelector('a[href*="instagram.com"]')),
          facebook: Boolean(footer?.querySelector('a[href*="facebook.com"]')),
          businessInfo: (footer?.textContent || '').includes('사업자정보'),
        },
      };
    });

    if (injectIntercepts < 1) throw new Error(`inject not intercepted at ${width}px`);
    if (result.blockCount !== 1 || !result.firstChild || result.ariaLabel !== '빌리조 및 공식 파트너') {
      throw new Error(`footer block placement regressed at ${width}px: ${JSON.stringify(result)}`);
    }
    if (result.images.length !== 3 || result.images.some((image) => !image.loaded) ||
        result.images.map((image) => image.alt).join('|') !== '빌리조|Meta Business Partner|toss') {
      throw new Error(`footer image contract regressed at ${width}px: ${JSON.stringify(result.images)}`);
    }
    if (result.cards.length !== 2 || result.cards.some((card) => card.width <= 0 || card.height <= 0)) {
      throw new Error(`footer partner cards regressed at ${width}px: ${JSON.stringify(result.cards)}`);
    }
    if (!Object.values(result.preserved).every(Boolean)) {
      throw new Error(`native footer content regressed at ${width}px: ${JSON.stringify(result.preserved)}`);
    }
    if (width <= 767) {
      if (result.gapFaqToBrand === null || result.gapFaqToBrand < 35 || result.gapFaqToBrand > 60) {
        throw new Error(`mobile FAQ/footer gap regressed at ${width}px: ${result.gapFaqToBrand}`);
      }
      if (Object.values(result.mobileMargins).some((margin) => margin !== 12)) {
        throw new Error(`mobile footer inner spacing regressed at ${width}px: ${JSON.stringify(result.mobileMargins)}`);
      }
      if (result.gapPartnersToPrivacy < 8 || result.gapPartnersToPrivacy > 16) {
        throw new Error(`mobile footer privacy overlap/gap regressed at ${width}px: ${result.gapPartnersToPrivacy}`);
      }
      if (result.cards.some((card) => card.width < 120 || card.height < 48 || card.height > 52)) {
        throw new Error(`mobile footer card geometry regressed at ${width}px: ${JSON.stringify(result.cards)}`);
      }
    }
    if (result.scrollWidth > result.viewportWidth + 1) {
      throw new Error(`horizontal overflow at ${width}px: ${result.scrollWidth}/${result.viewportWidth}`);
    }
    const relevantErrors = pageErrors.filter((message) => /footer|SyntaxError|ReferenceError|TypeError/.test(message));
    if (relevantErrors.length) throw new Error(`relevant page errors at ${width}px: ${relevantErrors.join(' | ')}`);
    return { width, ...result };
  } finally {
    await page.close();
  }
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const results = [];
    for (const width of [320, 390, 1280]) results.push(await inspect(browser, width));
    console.log(JSON.stringify({ contract: 'ok', results }, null, 2));
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error && error.stack || error);
  process.exit(1);
});
