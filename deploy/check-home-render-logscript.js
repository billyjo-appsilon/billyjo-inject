'use strict';

const { configureHomeRender, inspectHomeRender, pinInjectLoader } = require('./home-render-logscript');

const hash = '79c8b3f';
const preload = `<link rel="preload" as="script" href="https://cdn.jsdelivr.net/gh/billyjo-appsilon/billyjo-inject@${hash}/inject.min.js" crossorigin>`;
const script = `<script src="https://cdn.jsdelivr.net/gh/billyjo-appsilon/billyjo-inject@${hash}/inject.min.js" onerror="fallback()"></script>`;
const input = `<style id="keep">x</style>${preload}${script}`;

const unpinned = '<link rel="preload" as="script" href="https://cdn.jsdelivr.net/gh/billyjo-appsilon/billyjo-inject/inject.min.js"><script src="https://cdn.jsdelivr.net/gh/billyjo-appsilon/billyjo-inject/inject.min.js"></script>';
const pinnedFromMain = pinInjectLoader(unpinned, hash);
if ((pinnedFromMain.match(new RegExp(`billyjo-inject@${hash}/inject\\.min\\.js`, 'g')) || []).length !== 2) {
  throw new Error('unpinned main loaders must be promoted to the immutable release hash');
}
const repinned = pinInjectLoader(input, 'cf8a415');
if ((repinned.match(/billyjo-inject@cf8a415\/inject\.min\.js/g) || []).length !== 2) {
  throw new Error('existing immutable loaders must be promoted to the new release hash');
}

const enabled = configureHomeRender(input, '1');
if ((enabled.match(/id="bj-home-render-gate"/g) || []).length !== 1) throw new Error('home render gate must be inserted exactly once');
if (enabled.indexOf('rel="preload"') < 0 || enabled.indexOf('rel="preload"') > enabled.indexOf('<script src=')) {
  throw new Error('gate must preserve the preload before the core script');
}
if (!/<script\b[^>]*inject\.min\.js[^>]*crossorigin="anonymous"[^>]*>/i.test(enabled)) throw new Error('core script crossorigin is missing');
if (enabled.includes('visibility:hidden!important;animation:bjNativeFallback')) throw new Error('native fallback animation must be able to override initial hidden state');
const inspection = inspectHomeRender(enabled);
if (!inspection.preloadAnonymous || !inspection.scriptAnonymous) throw new Error('preload/script credentials modes must match');

const idempotent = configureHomeRender(enabled, '1');
if (idempotent !== enabled) throw new Error('home render logscript transform must be idempotent');

const disabled = configureHomeRender(enabled, '0');
if (disabled.includes('bj-home-render-gate')) throw new Error('rollback mode must remove the home render gate');
if (!/crossorigin="anonymous"/i.test(disabled)) throw new Error('safe preload reuse must remain enabled after gate rollback');

console.log('home render logscript contract: ok');
