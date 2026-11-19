'use strict';

const HOME_RENDER_GATE_STYLE = '<style id="bj-home-render-gate">.new-mc:not(.show-767){visibility:hidden;animation:bjNativeFallback 0s 5s forwards}body.bj-home-cats-ready .new-mc:not(.show-767){visibility:hidden!important;animation:none!important}body.bj-home-native-fallback .new-mc:not(.show-767){visibility:visible!important;animation:none!important}@keyframes bjNativeFallback{to{visibility:visible}}</style>';

function normalizeCrossorigin(tag) {
  return tag
    .replace(/\s+crossorigin(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?/gi, '')
    .replace(/>$/, ' crossorigin="anonymous">');
}

function configureHomeRender(content, mode) {
  if (mode && mode !== '1' && mode !== '0') {
    throw new Error('BILLYJO_HOME_RENDER_GATE must be 1, 0, or omitted');
  }
  let next = content;
  if (mode) {
    next = next.replace(/<style id=["']bj-home-render-gate["']>[\s\S]*?<\/style>/gi, '');
    if (mode === '1') {
      const insertBefore = next.search(/<link\b[^>]*\brel=["']preload["'][^>]*\binject(?:\.min)?\.js[^>]*>/i);
      if (insertBefore < 0) throw new Error('inject preload tag not found for home render gate');
      next = next.slice(0, insertBefore) + HOME_RENDER_GATE_STYLE + next.slice(insertBefore);
    }
  }
  next = next.replace(
    /<link\b[^>]*\brel=["']preload["'][^>]*\bhref=["']https:\/\/cdn\.jsdelivr\.net\/gh\/billyjo-appsilon\/billyjo-inject@[0-9a-f]{7,40}\/inject(?:\.min)?\.js["'][^>]*>/gi,
    normalizeCrossorigin
  );
  // Match the preload credentials mode so Chromium can reuse the response for
  // the blocking core script instead of downloading the same bundle twice.
  return next.replace(
    /<script\b([^>]*\bsrc=["']https:\/\/cdn\.jsdelivr\.net\/gh\/billyjo-appsilon\/billyjo-inject@[0-9a-f]{7,40}\/inject(?:\.min)?\.js["'])([^>]*)>/gi,
    normalizeCrossorigin
  );
}

function inspectHomeRender(content) {
  const preload = content.match(/<link\b[^>]*\brel=["']preload["'][^>]*\bhref=["']https:\/\/cdn\.jsdelivr\.net\/gh\/billyjo-appsilon\/billyjo-inject@[0-9a-f]{7,40}\/inject(?:\.min)?\.js["'][^>]*>/i);
  const script = content.match(/<script\b[^>]*\bsrc=["']https:\/\/cdn\.jsdelivr\.net\/gh\/billyjo-appsilon\/billyjo-inject@[0-9a-f]{7,40}\/inject(?:\.min)?\.js["'][^>]*>/i);
  return {
    gateCount: (content.match(/id=["']bj-home-render-gate["']/gi) || []).length,
    preloadAnonymous: !!preload && /\scrossorigin=["']anonymous["']/i.test(preload[0]),
    scriptAnonymous: !!script && /\scrossorigin=["']anonymous["']/i.test(script[0]),
  };
}

module.exports = { configureHomeRender, inspectHomeRender, HOME_RENDER_GATE_STYLE };
