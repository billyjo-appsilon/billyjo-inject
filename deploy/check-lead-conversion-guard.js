const assert = require('node:assert/strict');
const fs = require('node:fs');

const source = fs.readFileSync(require('node:path').join(__dirname, '../inject.js'), 'utf8');

const guardedPushes = source.match(/if \(!data \|\| data\.status !== 'deleted'\) \{/g) || [];
assert.equal(guardedPushes.length, 2, 'both quick-assign success paths must guard deleted/test leads');
assert.equal(
  (source.match(/event: 'bj_admin2_lead_created'/g) || []).length,
  1,
  'the direct success path must keep one canonical browser lead event'
);
assert.ok(
  source.includes("_pushCatalogDataLayer('bj_admin2_lead_created', product, base)"),
  'the shared success path must keep the canonical browser lead event'
);
assert.equal(
  (source.match(/deleted\/test lead suppressed from browser conversion events/g) || []).length,
  2,
  'both deleted/test branches must be auditable'
);

console.log('BillyJo lead conversion guard checks passed');
