const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2 });
  const p = await ctx.newPage();
  const fp = path.resolve(__dirname, '..', 'preview-detail-page-v5.html').split(path.sep).join('/');
  await p.goto('file:///' + fp);
  await p.waitForLoadState('networkidle');

  // Compute the chevron's stroke pixel center vs circle center
  const out = await p.evaluate(() => {
    const cards = document.querySelectorAll('.step-card');
    const card1 = cards[0], card2 = cards[1];
    const r1 = card1.getBoundingClientRect();
    const r2 = card2.getBoundingClientRect();
    const gap = r2.left - r1.right;
    const gapMidX = r1.right + gap / 2;
    const cardMidY = r1.top + r1.height / 2;

    const afterStyle = window.getComputedStyle(card1, '::after');
    const beforeStyle = window.getComputedStyle(card1, '::before');

    // Circle center
    const circleW = parseFloat(afterStyle.width);
    const circleRightVal = parseFloat(afterStyle.right);
    const circleRightX = r1.right - circleRightVal;
    const circleCenterX = circleRightX - circleW / 2;

    // Arrow chevron — compute the visual stroke center
    // Pre-rotate element: width 8, height 8, bottom-left at (X, Y)
    // right: -13 → element right edge at r1.right + 13, left at r1.right + 5
    // So pre-rotate X (left) = r1.right + 5
    const arrowW = parseFloat(beforeStyle.width);
    const arrowRightVal = parseFloat(beforeStyle.right);
    const arrowRightX = r1.right - arrowRightVal;
    const arrowLeftX = arrowRightX - arrowW;
    const arrowCenterX_pre = arrowLeftX + arrowW / 2;

    // Apply transform: translate(-3px, -50%) rotate(45deg)
    // rotate around element center first (no effect on center)
    // translate(-3px, ...) → center moves left by 3px
    const matrix = beforeStyle.transform;
    // Compute visual stroke center: in pre-rotate coords, top stroke left end at (0, 0) right end (8, 0).
    // Rotated around (4,4) by 45deg: left ends become (4, ±5.66), right end (tip) at (9.66, 4).
    // Visual stroke center x = (4 + 9.66) / 2 = 6.83 from local origin.
    // Then translate by -3 in x.
    const localVisualCenterX = 6.83 - 3; // 3.83
    const visualCenterX_screen = arrowLeftX + localVisualCenterX;

    return {
      gap, gapMidX, cardMidY,
      transformStr: matrix,
      circle: {
        centerX: circleCenterX,
        offsetFromGapMid: +(circleCenterX - gapMidX).toFixed(2),
      },
      arrow: {
        leftX: arrowLeftX,
        geoCenterX_preTransform: arrowCenterX_pre,
        visualCenterX_screen: +visualCenterX_screen.toFixed(2),
        visualOffsetFromGapMid: +(visualCenterX_screen - gapMidX).toFixed(2),
        visualOffsetFromCircleCenter: +(visualCenterX_screen - circleCenterX).toFixed(2),
      },
    };
  });
  console.log(JSON.stringify(out, null, 2));
  await b.close();
})();
