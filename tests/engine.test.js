import test from 'node:test';
import assert from 'node:assert/strict';
import { persona, rule, validatePersona } from '../src/core/model.js';
import { matches, selectResponse, createScheduler } from '../src/core/engine.js';
const event = (actor) => ({ kind: 'event', event: 'join', room: 'test', self: 1, actor });
function fixture() {
  const p = persona();
  const r = rule();
  r.trigger = { kind: 'event', event: 'join' };
  r.delayMs = 5000;
  r.dedupeMs = 10000;
  r.choices = [
    {
      steps: [
        { type: 'chat', text: 'hello' },
        { type: 'activity', activity: 'Hug', group: 'ItemArms' },
      ],
    },
  ];
  p.rules.push(r);
  return { p, r };
}
test('one random choice can execute multiple steps in order', () => {
  const { p, r } = fixture();
  r.delayMs = 0;
  const calls = [];
  const scheduler = createScheduler({
    active: () => p,
    valid: () => true,
    execute: (s) => calls.push(s.type),
  });
  assert.equal(scheduler.submit(event(2)), true);
  assert.deepEqual(calls, ['chat', 'activity']);
});

test('own room lifecycle bypasses member lists while visitor filters remain active', () => {
  const { p, r } = fixture();
  for (const mode of ['blacklist', 'whitelist']) {
    p.listMode = mode;
    p.blackList = [1, 2];
    p.whiteList = [3];
    for (const name of ['join', 'leave', 'slowLeave']) {
      r.trigger = { kind: 'event', event: name };
      assert.ok(selectResponse(p, { ...event(1), event: name }));
    }
    r.trigger = { kind: 'event', event: 'visitor' };
    assert.equal(selectResponse(p, { ...event(2), event: 'visitor' }), null);
  }
});
test('delayed responses cancel on disable without legacy rule dedupe', () => {
  const { p } = fixture();
  const timers = new Map();
  let id = 0,
    time = 0;
  const calls = [];
  const scheduler = createScheduler({
    active: () => p,
    valid: () => true,
    execute: (s) => calls.push(s.type),
    now: () => time,
    setTimer: (fn) => {
      timers.set(++id, fn);
      return id;
    },
    clearTimer: (id) => timers.delete(id),
  });
  assert.equal(scheduler.submit(event(2)), true);
  assert.equal(scheduler.submit(event(2)), true);
  assert.equal(scheduler.submit(event(3)), true);
  assert.equal(timers.size, 3);
  scheduler.cancel();
  assert.equal(timers.size, 0);
  assert.deepEqual(calls, []);
  assert.equal(scheduler.submit(event(2)), true);
  time = 16000;
  assert.equal(scheduler.submit(event(2)), true);
});
test('rechecks room/target before executing a delayed response', () => {
  const { p } = fixture();
  let callback,
    present = true;
  const calls = [];
  const scheduler = createScheduler({
    active: () => p,
    valid: () => present,
    execute: (s) => calls.push(s),
    setTimer: (f) => {
      callback = f;
      return 1;
    },
    clearTimer() {},
  });
  scheduler.submit(event(2));
  present = false;
  callback();
  assert.deepEqual(calls, []);
});
test('blacklist, self membership, empty legacy filter and player arousal are respected', () => {
  const { p, r } = fixture();
  p.blackList = [2];
  assert.equal(selectResponse(p, event(2)), null);
  r.trigger = { kind: 'activity', self: false };
  assert.equal(matches(r, { kind: 'activity', self: 1, actor: 1 }), true);
  p.blackList = [1];
  assert.equal(selectResponse(p, { kind: 'activity', self: 1, actor: 1 }), null);
  p.blackList = [];
  r.trigger = { kind: 'activity', self: true, matchNone: true };
  assert.equal(matches(r, { kind: 'activity', self: 1, actor: 2 }), false);
  r.trigger = { kind: 'spicer', min: 50 };
  assert.equal(matches(r, { kind: 'spicer', actorArousal: 80, selfArousal: 10 }), false);
  assert.equal(matches(r, { kind: 'spicer', actorArousal: 10, selfArousal: 80 }), true);
});

test('persona whitelist mode limits every rule', () => {
  const p = persona('lists');
  const r = rule();
  r.choices[0].steps[0].text = 'ok';
  p.rules = [r];
  p.listMode = 'whitelist';
  p.whiteList = [2, 3];
  assert.equal(
    selectResponse(p, { kind: 'activity', actor: 4, self: 1, activity: 'Hug', group: 'ItemArms' }),
    null,
  );
  assert.ok(selectResponse(p, { kind: 'activity', actor: 2, self: 1, activity: 'Hug', group: 'ItemArms' }));
  assert.ok(selectResponse(p, { kind: 'activity', actor: 3, self: 1, activity: 'Hug', group: 'ItemArms' }));
});

test('a rule member list narrows the persona target mode without a second blacklist', () => {
  const p = persona('rule list');
  const r = rule();
  r.trigger.members = [2];
  r.choices[0].steps[0].text = 'ok';
  p.rules = [r];
  assert.ok(selectResponse(p, { kind: 'activity', actor: 2, self: 1, activity: 'Hug', group: 'ItemArms' }));
  assert.equal(
    selectResponse(p, { kind: 'activity', actor: 3, self: 1, activity: 'Hug', group: 'ItemArms' }),
    null,
  );
});

test('named room event filters are case-insensitive and new event names validate', () => {
  const p = persona('room');
  const r = rule();
  r.trigger = { kind: 'event', event: 'visitor', roomMode: 'named', roomNames: ['Liko Room'] };
  r.choices[0].steps[0].text = 'welcome';
  p.rules = [r];
  validatePersona(p);
  assert.ok(selectResponse(p, { kind: 'event', event: 'visitor', actor: 2, roomName: 'liko room' }));
  assert.equal(
    selectResponse(p, { kind: 'event', event: 'visitor', actor: 2, roomName: 'another room' }),
    null,
  );
});
test('flavour prepends only a chat step and does not replace the group', () => {
  const p = persona();
  const r = rule();
  r.trigger = { kind: 'activity', self: true };
  r.choices[0].steps = [
    { type: 'chat', text: 'hello' },
    { type: 'action', text: 'waves' },
  ];
  const spice = rule();
  spice.trigger = { kind: 'spicer', min: 0 };
  spice.choices[0].steps[0].text = 'Well,';
  p.rules = [r, spice];
  assert.deepEqual(
    selectResponse(p, { kind: 'activity', actor: 2, self: 1 }).steps.map((s) => s.text),
    ['Well, hello', 'waves'],
  );
});

test('activity cooldown is per person across rules and expires at 300 ms', () => {
  const { p, r } = fixture();
  r.trigger = { kind: 'activity' };
  r.delayMs = 0;
  r.dedupeMs = 3000; // Legacy saved values must not add a hidden cooldown.
  let time = 0;
  const scheduler = createScheduler({ active: () => p, valid: () => true, execute() {}, now: () => time });
  const activity = (actor) => ({ ...event(actor), kind: 'activity' });
  assert.equal(scheduler.submit(activity(2)), true);
  time = 299;
  assert.equal(scheduler.submit(activity(2)), false);
  assert.equal(scheduler.submit(activity(3)), true);
  time = 300;
  assert.equal(scheduler.submit(activity(2)), true);
  scheduler.cancel();
  assert.equal(scheduler.submit(activity(2)), true);
});

test('legacy rule cooldown is normalized without changing its response delay', () => {
  const { p, r } = fixture();
  r.dedupeMs = 60000;
  const normalized = validatePersona(p);
  assert.equal(normalized.rules[0].dedupeMs, 0);
  assert.equal(normalized.rules[0].delayMs, r.delayMs);
  assert.equal(r.dedupeMs, 60000, 'validation does not mutate imported input');
});
