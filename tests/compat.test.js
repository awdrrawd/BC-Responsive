import test from 'node:test';
import assert from 'node:assert/strict';
import { expressionEngines, expressionConflicts, lceFeatureEnabled } from '../src/integrations/compat.js';
import { createAPI } from '../src/core/api.js';
import { defaults } from '../src/core/model.js';
test('conflict detection uses enabled settings, not presence or the shared engine flag', () => {
  const host = {
    FBC_VERSION: '6',
    Player: { FBC: '6' },
    bceAnimationEngineEnabled: () => true,
    fbcSettingValue: () => false,
    Liko: { LCE: { getFeature: () => false } },
  };
  assert.deepEqual(expressionEngines(host), []);
  host.fbcSettingValue = () => true;
  assert.deepEqual(expressionEngines(host), ['WCE']);
  host.Liko.LCE.getFeature = () => true;
  assert.deepEqual(expressionEngines(host), ['WCE', 'LCE']);
  host.fbcSettingValue = () => {
    throw Error('loading');
  };
  assert.deepEqual(expressionEngines(host), ['LCE']);
  host.Liko.LCE.getFeature = () => {
    throw Error('loading');
  };
  assert.equal(lceFeatureEnabled('autoMouthOnTalk', host), false);
});
test('Responsive keeps expressions but releases the LCE expression consumer', () => {
  const data = defaults();
  data.settings.enabled = true;
  data.settings.reactions = true;
  const store = {
    data,
    active: { rules: [{ enabled: true, choices: [{ steps: [{ type: 'expression' }] }] }] },
  };
  const ns = {};
  const api = createAPI(ns, store, { Liko: { LCE: { getFeature: () => true } } });
  ns.refresh = api.refresh;
  api.setReady(true);
  let request;
  ns.registerConsumer('LCE', (value) => {
    request = value;
    return true;
  });
  assert.equal(ns.isActive('expressions'), true);
  assert.equal(request.expressions, false);
  assert.equal(request.mouth, false);
});

test('warning follows Responsive switches even without saved expression rules', () => {
  const data = defaults();
  const rule = { enabled: true, choices: [{ steps: [{ type: 'expression' }] }] };
  const store = { data, active: { rules: [rule] } };
  const external = { animationEngine: true, activityExpressions: true };
  const host = {
    FBC_VERSION: '6',
    Player: { FBC: '6' },
    fbcSettingValue: (key) => external[key],
    Liko: { LCE: { getFeature: (key) => external[key] } },
  };
  data.settings.enabled = false;
  data.settings.reactions = true;
  assert.deepEqual(expressionConflicts(store, host), []);
  data.settings.enabled = true;
  data.settings.reactions = false;
  assert.deepEqual(expressionConflicts(store, host), []);
  data.settings.reactions = true;
  assert.deepEqual(expressionConflicts(store, host), ['WCE', 'LCE']);
  rule.enabled = false;
  assert.deepEqual(expressionConflicts(store, host), ['WCE', 'LCE']);
  rule.enabled = true;
  external.activityExpressions = false;
  assert.deepEqual(expressionConflicts(store, host), []);
  external.activityExpressions = true;
  external.animationEngine = false;
  assert.deepEqual(expressionConflicts(store, host), []);
  external.animationEngine = true;
  rule.choices[0].steps[0].type = 'chat';
  assert.deepEqual(expressionConflicts(store, host), ['WCE', 'LCE']);
  store.active.rules = [];
  assert.deepEqual(expressionConflicts(store, host), ['WCE', 'LCE']);
});
