const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');

const repoRoot = path.join(__dirname, '..');
const injectSource = fs.readFileSync(path.join(repoRoot, 'inject.js'), 'utf8');
const corePattern = /billyjo-inject(?:@[0-9a-f]{7,40})?\/inject(?:\.min)?\.js/i;

for (const required of [
  "data-bj-review-layout', 'landscape",
  "data-bj-wide-card-section', '1",
  "grid-template-areas:'badge stars' 'quote quote' 'gift gift' 'author author'",
  'width:calc(100% + 44px)',
  'flex-basis:clamp(288px,calc(100svw - 32px),520px)',
  'var secondRow = createRow(rows[1], false, 2)',
]) {
  if (!injectSource.includes(required)) throw new Error(`missing review landscape source contract: ${required}`);
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function inspect(browser, width) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  const errors = [];
  let intercepts = 0;
  page.on('pageerror', (error) => errors.push(String(error?.message || error)));
  await page.route(corePattern, async (route) => {
    intercepts += 1;
    await route.fulfill({
      status: 200,
      contentType: 'application/javascript; charset=utf-8',
      headers: { 'access-control-allow-origin': '*' },
      body: injectSource,
    });
  });

  try {
    await page.goto(`https://billyjo.co.kr/?qa=home-review-landscape-${width}`, {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });
    await page.locator("#bj-v5-injected .review-section[data-bj-review-layout='landscape']").waitFor({
      state: 'visible',
      timeout: 30000,
    });
    await page.waitForTimeout(3600);
    await page.locator('#bj-v5-injected .review-section').scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);

    const result = await page.evaluate(() => {
      const review = document.querySelector('#bj-v5-injected .review-section');
      const reviewZone = review?.closest('.zone');
      const bars = document.querySelector('#bj-v5-injected .bj-bars-row');
      const barsZone = bars?.closest('.zone');
      const rows = Array.from(review?.querySelectorAll('.review-track-wrap') || []);
      const rect = (node) => {
        const box = node?.getBoundingClientRect();
        return box ? {
          left: Math.round(box.left * 10) / 10,
          right: Math.round(box.right * 10) / 10,
          width: Math.round(box.width * 10) / 10,
          height: Math.round(box.height * 10) / 10,
        } : null;
      };
      return {
        viewportWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
        review: {
          layout: review?.getAttribute('data-bj-review-layout') || '',
          marker: review?.getAttribute('data-bj-review-rows') || '',
          rect: rect(review),
          section: rect(review?.closest('section')),
          zoneWide: reviewZone?.getAttribute('data-bj-wide-card-section') || '',
          rows: rows.map((wrap) => {
            const track = wrap.querySelector('.review-track');
            const sets = Array.from(track?.querySelectorAll(':scope > .review-track-set') || []);
            const card = sets[0]?.querySelector('.review-item');
            const photo = card?.querySelector('.rv-photo');
            const body = card?.querySelector('.rv-body');
            const cardRect = rect(card);
            const photoRect = rect(photo);
            const bodyRect = rect(body);
            return {
              row: wrap.getAttribute('data-bj-review-row') || '',
              wrap: rect(wrap),
              animation: track ? getComputedStyle(track).animationName : '',
              sets: sets.length,
              itemsPerSet: sets.map((set) => set.querySelectorAll('.review-item').length),
              duplicateHidden: sets[1]?.getAttribute('aria-hidden') || '',
              card: cardRect,
              aspect: cardRect ? Math.round((cardRect.width / cardRect.height) * 100) / 100 : 0,
              photo: photoRect,
              body: bodyRect,
              sideBySide: Boolean(photoRect && bodyRect && photoRect.right <= bodyRect.left + 1),
              titledAuthors: sets[0] ? Array.from(sets[0].querySelectorAll('.author')).filter((node) => node.title === node.textContent.trim()).length : 0,
            };
          }),
        },
        bars: {
          rect: rect(bars),
          section: rect(bars?.closest('section')),
          zoneWide: barsZone?.getAttribute('data-bj-wide-card-section') || '',
          children: Array.from(bars?.children || []).map(rect),
        },
      };
    });

    if (process.env.BILLYJO_REVIEW_DEBUG === '1') console.log(JSON.stringify({ width, result }, null, 2));

    assert(intercepts > 0, `${width}px: local inject was not intercepted`);
    assert(result.review.layout === 'landscape' && result.review.marker === '2', `${width}px: review layout markers mismatch (${JSON.stringify(result.review)})`);
    assert(result.review.zoneWide === '1' && result.bars.zoneWide === '1', `${width}px: wide section markers missing (${JSON.stringify(result)})`);
    assert(result.review.rows.length === 2, `${width}px: expected two visible review rows (${JSON.stringify(result.review.rows)})`);
    assert(result.review.rows.every((row) => row.animation === 'bjReviewScroll'), `${width}px: review rows should progress in one direction (${JSON.stringify(result.review.rows)})`);
    assert(result.review.rows.every((row) => row.sets === 2 && row.itemsPerSet[0] === 5 && row.itemsPerSet[1] === 5 && row.duplicateHidden === 'true'), `${width}px: infinite loop set contract mismatch (${JSON.stringify(result.review.rows)})`);
    assert(result.review.rows.every((row) => row.sideBySide && row.aspect >= 1.8 && row.card.height <= 176 && row.photo.height <= row.card.height && row.titledAuthors === 5), `${width}px: landscape card geometry/accessibility mismatch (${JSON.stringify(result.review.rows)})`);
    assert(Math.abs(result.review.section.width - result.bars.section.width) <= 2, `${width}px: review/guarantee section widths diverge (${JSON.stringify(result)})`);
    assert(result.scrollWidth <= result.viewportWidth + 1, `${width}px: horizontal overflow ${result.scrollWidth}/${result.viewportWidth}`);
    assert(errors.length === 0, `${width}px: browser errors (${errors.join(' | ')})`);

    if (width <= 767) {
      assert(result.review.section.left <= 9 && result.viewportWidth - result.review.section.right <= 9, `${width}px: review section does not use wide mobile gutters (${JSON.stringify(result.review.section)})`);
      assert(result.bars.section.left <= 9 && result.viewportWidth - result.bars.section.right <= 9, `${width}px: guarantee section does not match wide mobile gutters (${JSON.stringify(result.bars.section)})`);
      assert(result.review.rect.height <= 350, `${width}px: two-row review section is still too tall (${result.review.rect.height}px)`);
      assert(result.review.rows.every((row) => row.card.height <= 160), `${width}px: mobile review cards are too tall (${JSON.stringify(result.review.rows)})`);
    } else {
      assert(result.review.rect.width >= 1200, `${width}px: desktop review section did not expand (${result.review.rect.width}px)`);
      assert(result.review.rect.height <= 390, `${width}px: desktop review section is too tall (${result.review.rect.height}px)`);
    }

    if (width === 390) {
      const screenshotPath = String(process.env.BILLYJO_REVIEW_LANDSCAPE_SCREENSHOT || '').trim();
      await page.emulateMedia({ reducedMotion: 'reduce' });
      const reduced = await page.evaluate(() => Array.from(document.querySelectorAll('#bj-v5-injected .review-track-wrap')).map((wrap) => ({
        animation: getComputedStyle(wrap.querySelector('.review-track')).animationName,
        duplicateDisplay: getComputedStyle(wrap.querySelector(".review-track-set[aria-hidden='true']")).display,
        overflowX: getComputedStyle(wrap).overflowX,
      })));
      assert(reduced.length === 2 && reduced.every((row) => row.animation === 'none' && row.duplicateDisplay === 'none' && row.overflowX === 'auto'), `390px: reduced-motion fallback mismatch (${JSON.stringify(reduced)})`);
      if (screenshotPath) await page.locator('#bj-v5-injected .review-section').screenshot({ path: screenshotPath });
    }
    if (width === 1280) {
      const screenshotPath = String(process.env.BILLYJO_REVIEW_LANDSCAPE_DESKTOP_SCREENSHOT || '').trim();
      if (screenshotPath) {
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await page.locator('#bj-v5-injected .review-section').screenshot({ path: screenshotPath });
      }
    }

    return result;
  } finally {
    await page.close();
  }
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const results = [];
    const widths = String(process.env.BILLYJO_REVIEW_WIDTHS || '320,390,430,1280')
      .split(',').map(Number).filter(Number.isFinite);
    for (const width of widths) results.push(await inspect(browser, width));
    console.log(JSON.stringify({ contract: 'ok', results }, null, 2));
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error?.stack || error);
  process.exit(1);
});
