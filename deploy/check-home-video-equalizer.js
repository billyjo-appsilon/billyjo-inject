const assert = require('node:assert/strict');
const fs = require('node:fs');

const source = fs.readFileSync(new URL('../inject.js', `file://${__filename}`), 'utf8');
const start = source.indexOf('(function bjHomeVideoEqualizer()');
assert.ok(start >= 0, 'home equalizer module is present');
const block = source.slice(start, source.indexOf('\n})();', start) + 6);

assert.match(block, /right:16px!important;bottom:16px!important/, 'button has a 16px video-edge inset');
assert.match(block, /billyjo-video-slide__frame/, 'module targets the current Cafe24 video frame');
assert.match(block, /bj-video-equalizer/, 'equalizer icon is rendered');
assert.match(block, /@keyframes bjVideoSoundEq/, 'audible state animates the equalizer');
assert.match(block, /background:#ff3b30/, 'muted state shows a red diagonal slash');
assert.match(block, /var soundOn = !video\.muted/, 'visual state follows the real muted property');
assert.match(block, /getAttribute\('aria-pressed'\) !== pressed/, 'attribute observer cannot self-trigger forever');
assert.match(block, /data-bj-sound-owned/, 'fallback button owns its click handler without double-binding the existing button');

console.log('home video equalizer contract: ok');
