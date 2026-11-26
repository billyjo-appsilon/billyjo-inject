const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const repoRoot = path.join(__dirname, '..');
const injectSource = fs.readFileSync(path.join(repoRoot, 'inject.js'), 'utf8');
const screenshotDir = process.env.FOOTER_SCREENSHOT_DIR || '';

for (const required of [
  'function bjNativeFooterBrandLockup()',
  "block.setAttribute('data-bj-footer-layout', 'live1-v1')",
  "asset('images/logo/billyjo-ko-transparent-trim.webp')",
  "asset('images/meta-business-partner.webp')",
  "asset('images/toss-logo.webp')",
  '평일 09:00–18:00',
  '앱실론코퍼레이션(주)',
  '서울 강남구 역삼로136, 6층(역삼동, 신명빌딩)',
  '인천 연수구 송도과학로 56 (송도동, 송도테크노파크 BT센터) 2205호',
  '2021-서울강남-04074',
  '810-81-01685',
  '제휴카드 최대 할인 적용 기준',
  '현금 사은품은 제품·시기별 예상 범위',
  'footer.new-footer>:not(.bj-native-partners){display:none!important}',
  'background:transparent;box-shadow:none',
  'filter:brightness(0) invert(1)',
]) {
  if (!injectSource.includes(required)) throw new Error(`missing live1 footer source contract: ${required}`);
}

async function inspect(browser, width) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  const pageErrors = [];
  let intercepts = 0;
  page.on('pageerror', (error) => pageErrors.push(String(error && error.message || error)));
  await page.route(/billyjo-inject(?:@[0-9a-f]{7,40})?\/inject(?:\.min)?\.js/i, async (route) => {
    intercepts += 1;
    await route.fulfill({ status: 200, contentType: 'application/javascript; charset=utf-8', headers: { 'access-control-allow-origin': '*' }, body: injectSource });
  });

  try {
    await page.goto(`https://billyjo.co.kr/?apsi_footer_live1_qa=${width}`, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForSelector('#bj-v5-injected[data-bj-home-released]', { timeout: 30000 });
    await page.waitForSelector('footer.new-footer > .bj-native-partners[data-bj-footer-layout="live1-v1"]', { timeout: 15000 });
    await page.waitForTimeout(2800);
    await page.locator('footer.new-footer > .bj-native-partners').scrollIntoViewIfNeeded();
    await page.waitForFunction(() => Array.from(document.querySelectorAll('.bj-native-partners img')).every((img) => img.complete && img.naturalWidth > 0), null, { timeout: 20000 });

    const result = await page.evaluate(() => {
      const footer = document.querySelector('footer.new-footer');
      const block = footer?.querySelector(':scope > .bj-native-partners');
      const style = (node) => node ? getComputedStyle(node) : null;
      const images = Array.from(block?.querySelectorAll('img') || []);
      const cards = Array.from(block?.querySelectorAll('.bj-native-partner-card') || []);
      const rect = (node) => {
        const r = node?.getBoundingClientRect();
        return r ? { width: r.width, height: r.height, left: r.left, right: r.right } : null;
      };
      return {
        viewportWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
        layout: block?.getAttribute('data-bj-footer-layout') || '',
        blockCount: footer?.querySelectorAll(':scope > .bj-native-partners').length || 0,
        firstChild: footer?.firstElementChild === block,
        background: style(footer)?.backgroundColor || '',
        footerPaddingTop: parseFloat(style(footer)?.paddingTop || '0'),
        footerPaddingBottom: parseFloat(style(footer)?.paddingBottom || '0'),
        block: rect(block),
        images: images.map((image) => ({ alt: image.alt, loaded: image.complete && image.naturalWidth > 0 })),
        brandStyle: (() => {
          const brand = block?.querySelector('.bj-native-brand');
          const computed = style(brand);
          return computed ? { background: computed.backgroundColor, filter: computed.filter, boxShadow: computed.boxShadow } : null;
        })(),
        cards: cards.map(rect),
        phone: block?.querySelector('.bj-native-phone-number')?.textContent?.trim() || '',
        row: block?.querySelector('.bj-native-row')?.textContent?.replace(/\s+/g, ' ').trim() || '',
        business: block?.querySelector('.bj-native-business')?.textContent?.replace(/\s+/g, ' ').trim() || '',
        legal: block?.querySelector('.bj-native-legal')?.textContent?.replace(/\s+/g, ' ').trim() || '',
        nativeVisible: Array.from(footer?.children || []).filter((child) => child !== block && style(child).display !== 'none').length,
        socialCount: footer?.querySelectorAll('.cs__sns, a[href*="instagram.com"], a[href*="facebook.com"]').length || 0,
      };
    });

    if (intercepts < 1) throw new Error(`inject not intercepted at ${width}px`);
    if (result.layout !== 'live1-v1' || result.blockCount !== 1 || !result.firstChild || result.nativeVisible !== 0) throw new Error(`footer placement regressed at ${width}px: ${JSON.stringify(result)}`);
    if (result.background !== 'rgb(21, 23, 31)' || result.footerPaddingTop !== 36 || result.footerPaddingBottom !== (width >= 940 ? 40 : 96)) throw new Error(`footer shell differs from live1 at ${width}px: ${JSON.stringify(result)}`);
    if (result.images.map((image) => image.alt).join('|') !== '빌리조|Meta Business Partner|toss' || result.images.some((image) => !image.loaded)) throw new Error(`footer images regressed at ${width}px: ${JSON.stringify(result.images)}`);
    if (!result.brandStyle || result.brandStyle.background !== 'rgba(0, 0, 0, 0)' || result.brandStyle.filter === 'none' || result.brandStyle.boxShadow !== 'none') throw new Error(`BillyJo footer logo must be white on transparent background at ${width}px: ${JSON.stringify(result.brandStyle)}`);
    if (result.cards.length !== 2 || result.cards.some((card) => card.width <= 0 || card.height <= 0)) throw new Error(`footer partner cards regressed at ${width}px: ${JSON.stringify(result.cards)}`);
    if (result.phone !== '070-4918-7683' || !result.row.includes('평일 09:00–18:00') || !result.row.includes('https://www.billyjo.co.kr')) throw new Error(`footer contact differs from live1 at ${width}px: ${JSON.stringify(result)}`);
    for (const copy of ['앱실론코퍼레이션(주)', '온재현', '2021-서울강남-04074', '810-81-01685']) if (!result.business.includes(copy)) throw new Error(`missing live1 business copy at ${width}px: ${copy}`);
    for (const copy of ['제휴카드 최대 할인 적용 기준', '현금 사은품은 제품·시기별 예상 범위', '© 2026 Billyjo.']) if (!result.legal.includes(copy)) throw new Error(`missing live1 legal copy at ${width}px: ${copy}`);
    if (result.socialCount !== 0 || result.scrollWidth > result.viewportWidth + 1) throw new Error(`footer overflow/social regression at ${width}px: ${JSON.stringify(result)}`);
    const relevantErrors = pageErrors.filter((message) => /footer|SyntaxError|ReferenceError|TypeError/.test(message));
    if (relevantErrors.length) throw new Error(`relevant page errors at ${width}px: ${relevantErrors.join(' | ')}`);
    if (screenshotDir) {
      fs.mkdirSync(screenshotDir, { recursive: true });
      await page.locator('footer.new-footer').screenshot({ path: path.join(screenshotDir, `footer-live1-${width}.png`) });
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
    console.log(JSON.stringify({ contract: 'live1-parity-ok', results }, null, 2));
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error && error.stack || error);
  process.exit(1);
});
