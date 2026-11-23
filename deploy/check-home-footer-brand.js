const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const repoRoot = path.join(__dirname, '..');
const injectSource = fs.readFileSync(path.join(repoRoot, 'inject.js'), 'utf8');
const screenshotDir = process.env.FOOTER_SCREENSHOT_DIR || '';

for (const required of [
  'function bjNativeFooterBrandLockup()',
  "block.setAttribute('data-bj-footer-layout', 'identity-v2')",
  "block.setAttribute('aria-label', '빌리조 회사 및 고객센터 정보')",
  '<div class="bj-native-company">APPSILON CORP.</div>',
  '<a href="/html/dh/privacy_policy">개인정보처리방침</a>',
  '<a href="/_dhadm" target="_blank" rel="noopener">사이트관리</a>',
  "asset('images/logo/billyjo-ko.webp')",
  "asset('images/meta-business-partner.webp')",
  "asset('images/toss-logo.webp')",
  '<a class="bj-native-phone" href="tel:07049187683">070-4918-7683</a>',
  '<div class="bj-native-hours">09:00-19:00</div>',
  "'.bj-home-faq-zone{padding-bottom:0!important}'",
  "'footer.new-footer{padding-top:20px!important}'",
  "footer.new-footer .footer__logo,footer.new-footer .footer__info .info__top,footer.new-footer .footer__cs,footer.new-footer .cs__sns{display:none!important}",
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
      const company = block?.querySelector('.bj-native-company');
      const links = block?.querySelector('.bj-native-links');
      const partnerRow = block?.querySelector('.bj-native-partner-row');
      const contact = block?.querySelector('.bj-native-contact');
      const cards = Array.from(block?.querySelectorAll('.bj-native-partner-card') || []);
      const images = Array.from(block?.querySelectorAll('img') || []);
      const lastFaq = document.querySelector('.bj-home-faq-item:last-child');
      const privacy = block?.querySelector('a[href*="privacy_policy"]');
      const siteAdmin = block?.querySelector('a[href="/_dhadm"]');
      const phone = block?.querySelector('.bj-native-phone');
      const hours = block?.querySelector('.bj-native-hours');
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
        layout: block?.getAttribute('data-bj-footer-layout') || '',
        childOrder: Array.from(block?.children || []).map((child) => child.className),
        block: box(block),
        brand: box(brand),
        company: { text: company?.textContent?.trim() || '', box: box(company) },
        links: {
          text: Array.from(links?.querySelectorAll('a') || []).map((link) => link.textContent.trim()),
          hrefs: Array.from(links?.querySelectorAll('a') || []).map((link) => link.getAttribute('href')),
          box: box(links),
        },
        partnerRow: box(partnerRow),
        contact: { box: box(contact), phone: phone?.textContent?.trim() || '', hours: hours?.textContent?.trim() || '' },
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
        gaps: {
          brandToCompany: brand && company ? Math.round(company.getBoundingClientRect().top - brand.getBoundingClientRect().bottom) : null,
          companyToLinks: company && links ? Math.round(links.getBoundingClientRect().top - company.getBoundingClientRect().bottom) : null,
          linksToPartners: links && partnerRow ? Math.round(partnerRow.getBoundingClientRect().top - links.getBoundingClientRect().bottom) : null,
          partnersToContact: partnerRow && contact ? Math.round(contact.getBoundingClientRect().top - partnerRow.getBoundingClientRect().bottom) : null,
        },
        infoMoreMargin: infoMore ? parseFloat(style(infoMore).marginTop) : null,
        nativeHidden: {
          logo: style(footer?.querySelector('.footer__logo'))?.display === 'none',
          topLinks: style(footer?.querySelector('.footer__info .info__top'))?.display === 'none',
          customerCenters: Array.from(footer?.querySelectorAll('.footer__cs') || []).every((node) => style(node).display === 'none'),
        },
        socialCount: footer?.querySelectorAll('.cs__sns, a[href*="instagram.com"], a[href*="facebook.com"]').length || 0,
        preserved: {
          privacy: Boolean(privacy),
          siteAdmin: Boolean(siteAdmin),
          phone: phone?.textContent?.trim() === '070-4918-7683',
          hours: hours?.textContent?.trim() === '09:00-19:00',
          businessInfo: (footer?.textContent || '').includes('사업자정보'),
        },
      };
    });

    if (injectIntercepts < 1) throw new Error(`inject not intercepted at ${width}px`);
    if (result.blockCount !== 1 || !result.firstChild || result.layout !== 'identity-v2' || result.ariaLabel !== '빌리조 회사 및 고객센터 정보') {
      throw new Error(`footer block placement regressed at ${width}px: ${JSON.stringify(result)}`);
    }
    if (result.childOrder.join('|') !== 'bj-native-brand-link|bj-native-company|bj-native-links|bj-native-partner-row|bj-native-contact') {
      throw new Error(`footer reading order regressed at ${width}px: ${JSON.stringify(result.childOrder)}`);
    }
    if (result.company.text !== 'APPSILON CORP.' || result.links.text.join('|') !== '개인정보처리방침|사이트관리' ||
        result.links.hrefs.join('|') !== '/html/dh/privacy_policy|/_dhadm' ||
        result.contact.phone !== '070-4918-7683' || result.contact.hours !== '09:00-19:00') {
      throw new Error(`footer copy contract regressed at ${width}px: ${JSON.stringify({ company: result.company, links: result.links, contact: result.contact })}`);
    }
    if (result.images.length !== 3 || result.images.some((image) => !image.loaded) ||
        result.images.map((image) => image.alt).join('|') !== '빌리조|Meta Business Partner|toss') {
      throw new Error(`footer image contract regressed at ${width}px: ${JSON.stringify(result.images)}`);
    }
    if (result.cards.length !== 2 || result.cards.some((card) => card.width <= 0 || card.height <= 0)) {
      throw new Error(`footer partner cards regressed at ${width}px: ${JSON.stringify(result.cards)}`);
    }
    if (!Object.values(result.preserved).every(Boolean) || !Object.values(result.nativeHidden).every(Boolean) || result.socialCount !== 0) {
      throw new Error(`native footer content regressed at ${width}px: ${JSON.stringify(result.preserved)}`);
    }
    if (Object.values(result.gaps).some((gap) => gap === null || gap < 3 || gap > 18)) {
      throw new Error(`footer vertical rhythm regressed at ${width}px: ${JSON.stringify(result.gaps)}`);
    }
    if (width <= 767) {
      if (result.gapFaqToBrand === null || result.gapFaqToBrand < 35 || result.gapFaqToBrand > 60) {
        throw new Error(`mobile FAQ/footer gap regressed at ${width}px: ${result.gapFaqToBrand}`);
      }
      if (result.infoMoreMargin !== 12) {
        throw new Error(`mobile business-info spacing regressed at ${width}px: ${result.infoMoreMargin}`);
      }
      if (result.cards.some((card) => card.width < 110 || card.width > 150 || card.height < 42 || card.height > 46)) {
        throw new Error(`mobile footer card geometry regressed at ${width}px: ${JSON.stringify(result.cards)}`);
      }
    }
    if (result.scrollWidth > result.viewportWidth + 1) {
      throw new Error(`horizontal overflow at ${width}px: ${result.scrollWidth}/${result.viewportWidth}`);
    }
    const relevantErrors = pageErrors.filter((message) => /footer|SyntaxError|ReferenceError|TypeError/.test(message));
    if (relevantErrors.length) throw new Error(`relevant page errors at ${width}px: ${relevantErrors.join(' | ')}`);
    if (screenshotDir) {
      fs.mkdirSync(screenshotDir, { recursive: true });
      await page.locator('footer.new-footer').screenshot({ path: path.join(screenshotDir, `footer-${width}.png`) });
    }
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
