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
assert.ok(
  (source.match(/SUPPRESSED_LEAD_FUNNEL_EVENTS/g) || []).length >= 4,
  'all injected tracking paths must share an intermediate lead-event suppression policy'
);
assert.ok(
  (source.match(/eventName === 'persona_bonus_completed' && typeof window\.gtag === 'function'/g) || []).length >= 2,
  'every injected tracking path must send the completed second step to GA4'
);

console.log('BillyJo lead conversion guard checks passed');
