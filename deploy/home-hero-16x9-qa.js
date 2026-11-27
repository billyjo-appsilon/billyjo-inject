const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');

const injectSource = fs.readFileSync(path.join(__dirname, '..', 'inject.js'), 'utf8');
const CORE_RE = /cdn\.jsdelivr\.net\/gh\/billyjo-appsilon\/billyjo-inject(?:@[^/]+)?\/inject(?:\.min)?\.js/;
const TARGET_RATIO = 16 / 9;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function isRatio169(value) {
  return Math.abs(Number(value || 0) - TARGET_RATIO) < 0.01;
}

async function inspect(browser, width, height) {
  const page = await browser.newPage({ viewport: { width, height } });
  const errors = [];
  let intercepts = 0;
  page.on('pageerror', (error) => errors.push(String(error?.message || error)));
  await page.route(CORE_RE, async (route) => {
    intercepts += 1;
    await route.fulfill({
      status: 200,
      contentType: 'application/javascript; charset=utf-8',
      headers: { 'access-control-allow-origin': '*' },
      body: injectSource,
    });
  });

  try {
    await page.goto(`https://billyjo.co.kr/?qa=home-hero-16x9-${width}`, {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });
    await page.waitForFunction(() => {
      const video = document.querySelector('.new-mv .slick-slide.slick-current:not(.slick-cloned) video.billyjo-video-hero__media');
      return Boolean(video && video.videoWidth && video.videoHeight);
    }, null, { timeout: 30000 });
    await page.waitForTimeout(1800);

    const result = await page.evaluate(() => {
      const video = document.querySelector('.new-mv .slick-slide.slick-current:not(.slick-cloned) video.billyjo-video-hero__media');
      const item = video?.closest('.item');
      const frame = video?.closest('.billyjo-video-slide__frame');
      const list = video?.closest('.slick-list');
      const geometry = (node) => {
        const rect = node?.getBoundingClientRect();
        return rect ? {
          width: rect.width,
          height: rect.height,
          ratio: rect.height ? rect.width / rect.height : 0,
        } : null;
      };
      return {
        source: video?.currentSrc || video?.src || '',
        intrinsicRatio: video?.videoHeight ? video.videoWidth / video.videoHeight : 0,
        item: geometry(item),
        frame: geometry(frame),
        video: geometry(video),
        list: geometry(list),
        objectFit: video ? getComputedStyle(video).objectFit : '',
        autoplay: Boolean(video?.autoplay),
        muted: Boolean(video?.muted),
        loop: Boolean(video?.loop),
        playsInline: Boolean(video?.playsInline),
        paused: Boolean(video?.paused),
        overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      };
    });

    assert(intercepts > 0, `${width}px: local inject was not intercepted`);
    assert(result.source.includes('billyjo-hero-16x9-audio-v3.mp4'), `${width}px: unexpected hero source (${result.source})`);
    assert(isRatio169(result.intrinsicRatio), `${width}px: source is not 16:9 (${JSON.stringify(result)})`);
    for (const key of ['item', 'frame', 'video', 'list']) {
      assert(result[key] && isRatio169(result[key].ratio), `${width}px: ${key} is not 16:9 (${JSON.stringify(result)})`);
    }
    assert(result.autoplay && result.muted && result.loop && result.playsInline && !result.paused, `${width}px: playback contract changed (${JSON.stringify(result)})`);
    if (width > 1024) assert(result.objectFit === 'contain', `${width}px: desktop video is cropped (${JSON.stringify(result)})`);
    assert(!result.overflow, `${width}px: horizontal overflow (${JSON.stringify(result)})`);
    assert(!errors.some((message) => /SyntaxError|ReferenceError|TypeError/.test(message)), `${width}px: page errors (${errors.join(' | ')})`);
    return { width, source: result.source, ratios: Object.fromEntries(['item', 'frame', 'video', 'list'].map((key) => [key, result[key].ratio])) };
  } finally {
    await page.close();
  }
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const results = [];
    for (const [width, height] of [[320, 760], [390, 844], [430, 900], [1280, 900], [1920, 1080]]) {
      results.push(await inspect(browser, width, height));
    }
    console.log(JSON.stringify({ contract: 'ok', results }, null, 2));
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error?.stack || error);
  process.exit(1);
});
