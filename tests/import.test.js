import test from 'node:test';
import assert from 'node:assert/strict';
import LZString from 'lz-string';
import { importPersonas, exportPersona } from '../src/core/import.js';
import { persona, rule, validateData, defaults } from '../src/core/model.js';
test('legacy compressed persona preserves rules, chat/action, placeholders and inactive state', () => {
  const original = { name: 'Old', responses: [
    { name: 'Welcome', enabled: false, trigger: { mode: 'event', event: 'Join' }, messages: [{ type: 'message', content: 'Hello {other}' }, { type: 'action', content: '{me} waves' }] },
    { name: 'Empty', trigger: { mode: 'activity', allow_activities: [] }, messages: [] },
    { name: 'Spice', trigger: { mode: 'spicer', min_arousal: 50, max_arousal: 80, apply_favorite: true }, messages: [] }
  ] };
  const result = importPersonas(LZString.compressToBase64(JSON.stringify(original)), LZString);
  const p = result.personas[0]; assert.equal(p.name, 'Old'); assert.equal(p.rules[0].enabled, false);
  assert.deepEqual(p.rules[0].choices.map(c => c.steps[0]), [{ type: 'chat', text: 'Hello {other}' }, { type: 'action', text: '{me} waves' }]);
  assert.equal(p.rules[1].trigger.matchNone, true); assert.equal(p.rules[2].trigger.arousalSource, undefined);
  assert.ok(result.warnings.includes('legacyBlacklist')); assert.ok(result.warnings.includes('legacyFavorite'));
});
test('own Base64 export round trip retains grouped and animation steps with fresh identity', () => {
  const p = persona('Grouped'); const r = rule(); r.choices[0].steps.push({ type: 'activity', activity: 'Hug', group: 'ItemArms' }, { type: 'animation', group: 'HairAccessory2', assetA: 'EarA', assetB: 'EarB', count: 6, durationMs: 1200, messageType: 'emote', text: '' }); p.rules.push(r);
  const encoded = exportPersona(p, LZString); assert.doesNotMatch(encoded, /^\s*\{/);
  const imported = importPersonas(encoded, LZString).personas[0]; assert.notEqual(imported.id, p.id); assert.notEqual(imported.rules[0].id, r.id); assert.deepEqual(imported.rules[0].choices, r.choices);
});
test('Responsive-main @/@@ and emote convert without enabling unused extras', () => {
  const old = { name: 'Profile', data: { GlobalModule: {}, ResponsesModule: { mainResponses: [{ actName: 'Hug', groupName: ['ItemArms'], responses: ['@@waves', '@waves', '*waves', 'hello'] }], extraResponses: { low: ['hello'] } } } };
  const result = importPersonas(JSON.stringify(old)); const [r, extra] = result.personas[0].rules;
  assert.deepEqual(r.choices.map(c => c.steps[0].type), ['action', 'action', 'emote', 'chat']); assert.equal(r.choices[0].steps[0].text, '{me} waves'); assert.equal(extra.enabled, false);
});
test('null and malformed settings/imports fail without silently resetting', () => {
  for (const data of [null, {}, { name: 'bad', responses: [null] }, { format: 'Responsive_Liko', schemaVersion: 100, personas: [] }]) assert.throws(() => importPersonas(JSON.stringify(data), LZString));
  const d = defaults(); d.settings.enabled = 'yes'; assert.throws(() => validateData(d));
});
