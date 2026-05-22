const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  const fp = path.resolve(__dirname, '..', 'preview-detail-page-v5.html').split(path.sep).join('/');
  await p.goto('file:///' + fp);
  await p.waitForLoadState('networkidle');
  await p.waitForTimeout(500);
  const out = await p.evaluate(() => {
    const cards = document.querySelectorAll('.step-card');
    const card1 = cards[0], card2 = cards[1];
    const r1 = card1.getBoundingClientRect();
    const r2 = card2.getBoundingClientRect();
    const gap = r2.left - r1.right;
    const gapMid = r1.right + gap / 2;

    // Get ::after (circle) and ::before (arrow) positions
    const afterStyle = window.getComputedStyle(card1, '::after');
    const beforeStyle = window.getComputedStyle(card1, '::before');

    // We can't get exact getBoundingClientRect of pseudo elements directly,
    // so let's compute from styles
    const cardRight = r1.right;

    // circle: right offset from card right edge in px
    const circleRight = parseFloat(afterStyle.right); // 22px width
    const circleW = parseFloat(afterStyle.width);
    const circleH = parseFloat(afterStyle.height);
    // circle's right edge = cardRight - circleRight (when right is positive, it's inside; CSS right is negative for outside)
    // Actually: when 'right: -20px' is computed, getComputedStyle returns "20px" or "-20px"?
    // Let me also check via computed offset
    const circleRightEdge = cardRight + Math.abs(circleRight) * Math.sign(-1 * parseFloat(afterStyle.right));
    // Simpler: compute right edge
    // right CSS prop: positive = inside parent, negative = outside.
    // For position absolute child, child's right edge x = parent's right edge x - right_value
    // (because right CSS measures from parent's right inward)
    // So child right edge = parent right - right_value
    const rightVal = parseFloat(afterStyle.right);
    const circleRightX = cardRight - rightVal;
    const circleCenterX = circleRightX - circleW / 2;

    const arrowRightVal = parseFloat(beforeStyle.right);
    const arrowW = parseFloat(beforeStyle.width);
    const arrowRightX = cardRight - arrowRightVal;
    const arrowCenterX = arrowRightX - arrowW / 2;

    return {
      cardRightX: cardRight,
      card2LeftX: r2.left,
      gap, gapMid,
      circle: { rightVal, width: circleW, height: circleH, rightX: circleRightX, centerX: circleCenterX, offsetFromGapMid: circleCenterX - gapMid },
      arrow: { rightVal: arrowRightVal, width: arrowW, rightX: arrowRightX, centerX: arrowCenterX, offsetFromGapMid: arrowCenterX - gapMid },
      arrowCenterVsCircleCenter: arrowCenterX - circleCenterX,
    };
  });
  console.log(JSON.stringify(out, null, 2));
  await b.close();
})();
