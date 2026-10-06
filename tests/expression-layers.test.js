import test from 'node:test';
import assert from 'node:assert/strict';
import { createExpressionLayers } from '../src/features/expression-layers.js';
import { createOutput } from '../src/features/output.js';
import { createMouth } from '../src/features/mouth.js';
import { hscExpressionGroups, expressionEngineIntercepts } from '../src/integrations/compat.js';

const ALLOWED = ['Happy', 'Closed', 'Lewd', 'Smile'];
function world(extra = {}) {
  const items = {};
  for (const group of ['Eyes', 'Eyes2', 'Mouth'])
    items[group] = { Asset: { Group: { AllowExpression: ALLOWED } }, Property: {} };
  let now = 0,
    seq = 0;
  const timers = new Map();
  const calls = [];
  const set = (group, value) => {
    const item = items[group];
    if (value) item.Property.Expression = value;
    else delete item.Property.Expression;
  };
  const host = {
    Player: { MemberNumber: 1 },
    InventoryGet: (_, group) => items[group],
    // Mirrors BC: "Eyes" writes both eyes, "Eyes1" the left eye only.
    CharacterSetFacialExpression(_, group, value, timer) {
      calls.push([group, value ?? null, timer]);
      if (group === 'Eyes') {
        set('Eyes', value);
        set('Eyes2', value);
      } else set(group === 'Eyes1' ? 'Eyes' : group, value);
    },
    setTimeout(fn, delay) {
      const id = ++seq;
      timers.set(id, { fn, at: now + delay });
      return id;
    },
    clearTimeout: (id) => timers.delete(id),
    ...extra,
  };
  const advance = (ms) => {
    const target = now + ms;
    for (;;) {
      const due = [...timers].filter(([, t]) => t.at <= target).sort((a, b) => a[1].at - b[1].at)[0];
      if (!due) break;
      now = due[1].at;
      timers.delete(due[0]);
      due[1].fn();
    }
    now = target;
  };
  const face = (group = 'Eyes') => items[group].Property.Expression ?? null;
  return { host, items, calls, advance, face, timers };
}
const step = (value, durationMs = 10000, group = 'Eyes') => ({
  type: 'expression',
  group,
  value,
  durationMs,
});

test('a later identical effect is not cut short by the first effect timer', () => {
  const w = world();
  const layers = createExpressionLayers({ host: w.host });
  layers.apply(step('Happy'));
  w.advance(9000);
  layers.apply(step('Happy'));
  w.advance(1000); // t=10: first effect ends
  assert.equal(w.face(), 'Happy');
  w.advance(8999); // t=18.999
  assert.equal(w.face(), 'Happy');
  w.advance(1); // t=19: second effect ends
  assert.equal(w.face(), null);
});

test('an expired effect never reappears; ending the newest returns to the older live effect', () => {
  const w = world();
  const layers = createExpressionLayers({ host: w.host });
  layers.apply(step('Happy', 10000));
  w.advance(9000);
  layers.apply(step('Closed', 10000));
  assert.equal(w.face(), 'Closed');
  w.advance(1000); // Happy has ended; Closed must stay
  assert.equal(w.face(), 'Closed');
  w.advance(9000);
  assert.equal(w.face(), null, 'the expired Happy must not come back');

  layers.apply(step('Happy', 10000));
  w.advance(2000);
  layers.apply(step('Closed', 3000));
  assert.equal(w.face(), 'Closed');
  w.advance(3000); // newer ends first: the older live effect is shown again
  assert.equal(w.face(), 'Happy');
  w.advance(5000);
  assert.equal(w.face(), null);
});

test('the original face returns once, and a manual change during an effect is kept', () => {
  const w = world();
  w.items.Eyes.Property.Expression = 'Smile';
  w.items.Eyes2.Property.Expression = 'Smile';
  const layers = createExpressionLayers({ host: w.host });
  layers.apply(step('Lewd', 5000));
  w.advance(5000);
  assert.equal(w.face(), 'Smile');
  assert.equal(w.face('Eyes2'), 'Smile');
  layers.apply(step('Lewd', 5000));
  w.items.Eyes.Property.Expression = 'Closed'; // the player edits the left eye manually
  w.advance(5000);
  assert.equal(w.face(), 'Closed');
  assert.equal(w.face('Eyes2'), 'Smile', 'the untouched eye still returns to its original face');
});

test('both eyes change and restore with one atomic alias call each, single eyes stay independent', () => {
  const w = world();
  const layers = createExpressionLayers({ host: w.host });
  layers.apply(step('Happy', 4000, 'Eyes'));
  assert.deepEqual(w.calls, [['Eyes', 'Happy', undefined]]);
  w.calls.length = 0;
  w.advance(4000);
  assert.deepEqual(w.calls, [['Eyes', null, undefined]]);
  w.calls.length = 0;
  layers.apply(step('Closed', 4000, 'Eyes2'));
  assert.equal(w.face('Eyes'), null);
  assert.equal(w.face('Eyes2'), 'Closed');
  layers.apply(step('Lewd', 2000, 'Eyes')); // overlaps the right eye
  assert.equal(w.face('Eyes2'), 'Lewd');
  w.advance(2000);
  assert.equal(w.face('Eyes2'), 'Closed', 'the right eye falls back to its own live effect');
  assert.equal(w.face('Eyes'), null);
});

test('clear restores the original face, cancels timers, and stale callbacks do nothing', () => {
  const w = world();
  const layers = createExpressionLayers({ host: w.host });
  layers.apply(step('Happy', 10000));
  layers.apply(step('Closed', 10000));
  layers.clear();
  assert.equal(w.face(), null);
  assert.equal(w.timers.size, 0);
  layers.apply(step('Lewd', 10000));
  w.advance(9999);
  w.calls.length = 0;
  layers.clear(); // a second clear is harmless
  layers.clear();
  assert.equal(w.face(), null);
  w.advance(20000);
  assert.deepEqual(
    w.calls.filter(([, v]) => v !== null),
    [],
  );
});

test('an item replaced during an effect, or another account, is never written back', () => {
  const w = world();
  const layers = createExpressionLayers({ host: w.host });
  layers.apply(step('Happy', 5000, 'Eyes1'));
  w.items.Eyes = { Asset: { Group: { AllowExpression: ALLOWED } }, Property: { Expression: 'Lewd' } };
  w.calls.length = 0;
  w.advance(5000);
  assert.deepEqual(w.calls, []);
  assert.equal(w.face(), 'Lewd');
});

test('values the item does not support are ignored', () => {
  const w = world();
  const layers = createExpressionLayers({ host: w.host });
  layers.apply(step('Nope'));
  assert.deepEqual(w.calls, []);
  assert.equal(w.timers.size, 0);
});

test('HSC control: nothing is written, nothing is scheduled, and effects ending under control are forgotten', () => {
  let hsc = { active: false, count: 0, groups: [] };
  const w = world({ Liko: { HSC: { expressions: { apiVersion: 1, getState: () => hsc } } } });
  const reports = [];
  const layers = createExpressionLayers({ host: w.host, report: (m) => reports.push(m) });
  hsc = { active: true, count: 1, groups: ['Eyes', 'Eyes2'] };
  layers.apply(step('Happy'));
  assert.deepEqual(w.calls, []);
  assert.equal(w.timers.size, 0);
  assert.equal(reports.length, 1);
  hsc = { active: false, count: 0, groups: [] };
  layers.apply(step('Happy', 5000));
  hsc = { active: true, count: 1, groups: ['Eyes', 'Eyes2'] };
  w.items.Eyes.Property.Expression = 'Closed'; // hypnosis set its own face
  w.items.Eyes2.Property.Expression = 'Closed';
  w.calls.length = 0;
  w.advance(5000);
  assert.deepEqual(w.calls, [], 'no stale restore during control');
  hsc = { active: false, count: 0, groups: [] };
  w.advance(10000);
  assert.equal(w.face(), 'Closed', 'nothing is replayed after hypnosis ends');
  layers.apply(step('Lewd', 2000)); // a new interaction works after hand-back
  assert.equal(w.face(), 'Lewd');
  w.advance(2000);
  assert.equal(w.face(), 'Closed');
});

test('HSC on only one eye blocks the whole both-eyes effect so the eyes never mismatch', () => {
  const w = world({
    Liko: { HSC: { expressions: { apiVersion: 1, getState: () => ({ active: true, groups: ['Eyes2'] }) } } },
  });
  const layers = createExpressionLayers({ host: w.host });
  layers.apply(step('Happy', 1000, 'Eyes'));
  assert.deepEqual(w.calls, []);
  layers.apply(step('Happy', 1000, 'Eyes1')); // the left eye is not controlled
  assert.equal(w.face('Eyes'), 'Happy');
});

test('HSC reader tolerates missing, old, or failing APIs', () => {
  assert.equal(hscExpressionGroups({}).size, 0);
  assert.equal(
    hscExpressionGroups({ Liko: { HSC: { expressions: { apiVersion: 2, getState: () => ({}) } } } }).size,
    0,
  );
  const failing = {
    Liko: {
      HSC: {
        expressions: {
          apiVersion: 1,
          getState() {
            throw Error('x');
          },
        },
      },
    },
  };
  assert.equal(hscExpressionGroups(failing).size, 0);
  const inactive = {
    Liko: { HSC: { expressions: { apiVersion: 1, getState: () => ({ active: false, groups: ['Mouth'] }) } } },
  };
  assert.equal(hscExpressionGroups(inactive).size, 0);
});

test('with an expression engine active the effect is sent as a timed event and no local restore is kept', () => {
  const w = world({ lceAnimationEngineEnabled: () => true });
  const layers = createExpressionLayers({ host: w.host });
  layers.apply(step('Happy', 2500));
  assert.deepEqual(w.calls, [['Eyes', 'Happy', 2.5]]);
  assert.equal(w.timers.size, 0, 'the engine owns expiry');
  w.calls.length = 0;
  layers.clear();
  w.advance(10000);
  assert.deepEqual(w.calls, [], 'no permanent manual override is written back');
});

test('engine detection reads LCE and WCE flags and tolerates errors', () => {
  assert.equal(expressionEngineIntercepts({}), false);
  assert.equal(expressionEngineIntercepts({ bceAnimationEngineEnabled: () => true }), true);
  assert.equal(
    expressionEngineIntercepts({
      lceAnimationEngineEnabled() {
        throw Error('x');
      },
      bceAnimationEngineEnabled: () => false,
    }),
    false,
  );
});

test('output routes expression steps through the layers and clear() restores them', () => {
  const w = world();
  const output = createOutput({
    host: w.host,
    store: { data: { settings: { bcx: false } } },
    owns: () => true,
    report() {},
  });
  output.execute(step('Happy'), {});
  assert.equal(w.face(), 'Happy');
  output.clear();
  assert.equal(w.face(), null);
  const reports = [];
  const off = createOutput({
    host: world().host,
    store: { data: { settings: { bcx: false } } },
    owns: () => false,
    report: (m) => reports.push(m),
  });
  off.execute(step('Happy'), {});
  assert.deepEqual(reports, ['Expression ownership unavailable']);
});

test('mouth animation yields only the player face to HSC', () => {
  let hook;
  let held = true;
  const host = {
    Player: { MemberNumber: 1 },
    CurrentScreen: 'ChatRoom',
    ChatRoomCharacter: [],
    CharacterRefresh() {},
    InventoryGet: (c) => c.mouth,
    Liko: { HSC: { expressions: { apiVersion: 1, getState: () => ({ active: held, groups: ['Mouth'] }) } } },
  };
  const mouthItem = () => ({ Asset: { Group: { AllowExpression: ['Open', 'HalfOpen'] } }, Property: {} });
  const me = { MemberNumber: 1, mouth: mouthItem() };
  const other = { MemberNumber: 2, mouth: mouthItem() };
  host.ChatRoomCharacter.push(me, other);
  const mouth = createMouth({
    sdk: { hookFunction: (_n, _p, fn) => (hook = fn) },
    owns: () => true,
    host,
  });
  const originalSetTimeout = globalThis.setTimeout;
  globalThis.setTimeout = () => 0;
  try {
    mouth.receive({ Type: 'Chat' }, me, 'hello');
    mouth.receive({ Type: 'Chat' }, other, 'hello');
    const seen = [];
    for (const c of [me, other])
      hook([c], () => {
        seen.push([c.MemberNumber, c.mouth.Property?.Expression ?? null]);
      });
    assert.deepEqual(seen[0], [1, null], 'the controlled player mouth is left alone');
    assert.notEqual(seen[1][1], null, 'other players keep their animated mouth');
    held = false;
    mouth.receive({ Type: 'Chat' }, me, 'hello');
    let drawn;
    hook([me], () => (drawn = me.mouth.Property.Expression));
    assert.ok(drawn, 'the player mouth animates again after hand-back');
  } finally {
    globalThis.setTimeout = originalSetTimeout;
    mouth.clear();
  }
});
