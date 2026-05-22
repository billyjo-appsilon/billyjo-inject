const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true });
  const p = await ctx.newPage();
  const fp = path.resolve(__dirname, '..', 'preview-detail-page-v5.html').split(path.sep).join('/');
  await p.goto('file:///' + fp);
  await p.waitForLoadState('networkidle');

  // Use range-based line detection
  const out = await p.evaluate(() => {
    function getLines(el) {
      if (!el) return null;
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      const lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.5;
      const lines = Math.round(r.height / lh);
      // Get actual rendered text per line via Range
      const range = document.createRange();
      const node = el.firstChild;
      const result = [];
      if (node && node.nodeType === 3) {
        const text = node.nodeValue;
        let start = 0;
        let prevTop = null;
        for (let i = 0; i <= text.length; i++) {
          range.setStart(node, Math.max(0, i - 1));
          range.setEnd(node, i);
          const rect = range.getBoundingClientRect();
          if (prevTop !== null && Math.abs(rect.top - prevTop) > 2) {
            result.push(text.substring(start, i - 1));
            start = i - 1;
          }
          prevTop = rect.top;
        }
        result.push(text.substring(start));
      }
      return { h: Math.round(r.height), lh, lines, fullText: el.textContent.trim(), linesByRange: result };
    }
    const cards = document.querySelectorAll('.step-card');
    const out = [];
    cards.forEach((c, i) => {
      const t = c.querySelector('.step-t');
      const d = c.querySelector('.step-d');
      out.push({
        idx: i + 1,
        title: getLines(t),
        desc: getLines(d),
      });
    });

    // Also lead/desc of the section
    const sectionLead = document.querySelectorAll('section .lead')[5]; // section 6 approximately
    const sectionDesc = document.querySelectorAll('section .desc')[1];
    // Better: find by content
    let lead = null, desc = null;
    document.querySelectorAll('.lead').forEach(el => {
      if (el.textContent.includes('라이프스타일')) lead = getLines(el);
    });
    document.querySelectorAll('.desc, p').forEach(el => {
      if (el.textContent.includes('단순 가격 비교가 아닙니다')) desc = getLines(el);
    });

    return { steps: out, lead, desc };
  });
  console.log(JSON.stringify(out, null, 2));
  await b.close();
})();
