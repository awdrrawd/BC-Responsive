import { installEvents } from '../src/integrations/events.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import LZString from 'lz-string';
import { createStore, MAX_TRANSFER_BYTES, transferBytes } from '../src/core/store.js';
import { createAPI } from '../src/core/api.js';
import { defaults, ID } from '../src/core/model.js';
import { createOutput, renderText } from '../src/features/output.js';
import { allowedActivity, activityLabel } from '../src/integrations/catalog.js';
import { checkBCX } from '../src/integrations/bcx.js';

test('disposing an older consumer preserves the replacement registration', () => {
  const data = defaults(),
    namespace = {},
    store = { data, active: data.personas[0] };
  const api = createAPI(namespace, store, {});
  namespace.refresh = api.refresh;
  let calls = 0;
  const dispose = namespace.registerConsumer('test', () => true);
  namespace.registerConsumer('test', () => {
    calls++;
    return true;
  });
  dispose();
  api.refresh();
  assert.equal(calls, 2);
});
test('storage validates before saving and rolls back failed persistence', () => {
  const host = { Player: { ExtensionSettings: {} }, LZString, ServerSend() {} };
  const store = createStore(host);
  store.load();
  store.update((d) => (d.settings.enabled = true));
  const saved = JSON.stringify(host.Player.ExtensionSettings[ID]);
  assert.equal(store.data.settings.enabled, true);
  host.ServerSend = () => {
    throw Error('offline');
  };
  assert.throws(() => store.update((d) => (d.settings.enabled = false)));
  assert.equal(store.data.settings.enabled, true);
  assert.equal(JSON.stringify(host.Player.ExtensionSettings[ID]), saved);
  assert.throws(() => store.update((d) => d.personas[0].rules.push(null)));
});
test('malformed stored data is not overwritten', () => {
  const host = { Player: { ExtensionSettings: { [ID]: 'invalid' } }, LZString };
  const store = createStore(host);
  assert.throws(() => store.load());
  assert.equal(store.loaded, false);
  assert.equal(host.Player.ExtensionSettings[ID], 'invalid');
});
test('the former empty initial persona receives starter responses once', () => {
  const old = defaults();
  old.starterVersion = 0;
  old.personas[0].rules = [];
  let syncs = 0;
  const host = {
    Player: { ExtensionSettings: { [ID]: LZString.compressToBase64(JSON.stringify(old)) } },
    LZString,
    ServerSend(message) {
      if (message === 'AccountUpdate') syncs++;
    },
  };
  const store = createStore(host);
  store.load();
  assert.ok(store.active.rules.some((r) => r.trigger.kind === 'activity'));
  assert.ok(store.active.rules.some((r) => r.trigger.kind === 'orgasm'));
  assert.ok(store.active.rules.some((r) => r.trigger.kind === 'spicer'));
  assert.equal(store.data.starterVersion, 1);
  assert.equal(syncs, 1, 'legacy profile converted by one whole-key replace');
});
test('new on-account personas blacklist self by default', () => {
  const data = defaults(1234);
  assert.equal(data.personas[0].listMode, 'blacklist');
  assert.deepEqual(data.personas[0].blackList, [1234]);
});
test('Responsive mouth yields to LCE even with a registered consumer', () => {
  const data = defaults();
  data.settings.enabled = true;
  data.settings.mouth = true;
  const store = { data, active: data.personas[0] };
  const namespace = {};
  const host = { Liko: { LCE: { getFeature: () => true } } };
  const coordination = createAPI(namespace, store, host);
  namespace.refresh = () => coordination.refresh();
  coordination.setReady(true);
  coordination.refresh();
  assert.equal(namespace.isActive('mouth'), false);
  let paused = false;
  namespace.registerConsumer('LCE', (desired) => {
    paused = desired.mouth;
    return true;
  });
  assert.equal(paused, false);
  assert.equal(namespace.isActive('mouth'), false);
  host.Liko.LCE.getFeature = () => false;
  coordination.refresh();
  assert.equal(paused, true);
  assert.equal(namespace.isActive('mouth'), true);
  data.settings.enabled = false;
  coordination.refresh();
  assert.equal(paused, false);
  assert.equal(namespace.isActive('mouth'), false);
  let calls = 0;
  namespace.subscribe(() => calls++);
  coordination.refresh();
  coordination.refresh();
  assert.equal(calls, 1);
});
test('failed consumer cannot claim successful ownership', () => {
  const data = defaults();
  data.settings.enabled = true;
  data.settings.mouth = true;
  const ns = {};
  const api = createAPI(ns, { data, active: data.personas[0] }, {});
  ns.refresh = api.refresh;
  api.setReady(true);
  ns.registerConsumer('other', () => false);
  assert.equal(ns.isActive('mouth'), false);
});
test('draft and whisper target survive successful non-interrupt output and failed send', () => {
  let text = 'private draft';
  const host = {
    Player: { MemberNumber: 1 },
    ChatRoomCharacter: [],
    ChatRoomTargetMemberNumber: 42,
    ElementValue: (_, value) => (value === undefined ? text : (text = value)),
    ChatRoomSetTarget: (n) => (host.ChatRoomTargetMemberNumber = n),
    CharacterNickname: () => 'Me',
    ChatRoomSendChat() {
      text = '';
    },
  };
  const store = { data: { settings: { interruption: false, bcx: false } } };
  const output = createOutput({ store, host, owns: () => false, report() {} });
  output.execute({ type: 'chat', text: 'hello' }, {});
  assert.equal(text, 'private draft');
  assert.equal(host.ChatRoomTargetMemberNumber, 42);
  host.ChatRoomSendChat = () => {
    throw Error('send failed');
  };
  assert.throws(() => output.execute({ type: 'emote', text: 'waves' }, {}));
  assert.equal(text, 'private draft');
  assert.equal(host.ChatRoomTargetMemberNumber, 42);
});
test('current placeholder buttons render both self and other names', () => {
  const host = {
    Player: { MemberNumber: 1, Name: 'Alice' },
    ChatRoomCharacter: [{ MemberNumber: 2, Name: 'Bob' }],
    CharacterNickname: (c) => c.Name,
  };
  assert.equal(renderText('{Self} greets {Other}', { actor: 2 }, host), 'Alice greets Bob');
});
test('special animation alternates two assets and restores when cancelled', () => {
  const scheduled = [],
    worn = [],
    original = { Asset: { Name: 'EarA' }, Color: 'red', Property: { Type: 'Up' } };
  const host = {
    Player: { MemberNumber: 1 },
    ChatRoomCharacter: [],
    InventoryGet: () => original,
    InventoryWear(_character, asset) {
      worn.push(asset);
      return { Asset: { Name: asset } };
    },
    CharacterRefresh() {},
    ChatRoomCharacterItemUpdate() {},
    setTimeout(fn, delay) {
      const timer = { fn, delay, cleared: false };
      scheduled.push(timer);
      return timer;
    },
    clearTimeout(timer) {
      timer.cleared = true;
    },
  };
  const store = { data: { settings: { interruption: false, bcx: false } } };
  const output = createOutput({ store, host, owns: () => false, report() {} });
  output.execute(
    {
      type: 'animation',
      group: 'HairAccessory2',
      assetA: 'EarA',
      assetB: 'EarB',
      count: 2,
      durationMs: 1000,
      messageType: 'emote',
      text: '',
    },
    {},
  );
  scheduled.find((timer) => timer.delay === 0).fn();
  scheduled.find((timer) => timer.delay === 500).fn();
  assert.deepEqual(worn, ['EarB', 'EarA']);
  output.clear();
  assert.equal(worn.at(-1), 'EarA');
  assert.ok(scheduled.every((timer) => timer.cleared));
});
test('activity lookup restores FocusGroup even on prerequisite error', () => {
  const target = { FocusGroup: { Name: 'old' } };
  const old = target.FocusGroup;
  assert.throws(() =>
    allowedActivity(target, 'Hug', 'ItemArms', {
      ActivityAllowedForGroup() {
        throw Error('prereq');
      },
    }),
  );
  assert.equal(target.FocusGroup, old);
});
test('missing dictionary labels fall back to legacy dictionary or stable ID', () => {
  const host = {
    ActivityDictionaryText: () => 'MISSING TEXT IN dictionary',
    ActivityDictionary: [['Label-ChatSelf-ItemArms-Hug', 'Hug label']],
  };
  assert.equal(activityLabel('Hug', 'ItemArms', host), 'Hug label');
  assert.equal(activityLabel('Unknown', 'ItemArms', host), 'Unknown');
});
test('BCX emote rule is checked; disabled preflight does not touch BCX', () => {
  const host = {
    bcx: {
      getModApi: () => ({
        getRuleState: (name) => ({ inEffect: true, isEnforced: name === 'speech_forbid_emotes' }),
      }),
    },
  };
  assert.equal(checkBCX({ type: 'emote' }, true, host).allowed, false);
  assert.equal(checkBCX({ type: 'emote' }, false, host).allowed, true);
});

test('activity execution uses target family, leaves focus untouched, and allows retry', () => {
  const old = { Name: 'ItemFeet' };
  const group = { Name: 'ItemHead' };
  const target = { MemberNumber: 2, AssetFamily: 'TargetFamily', FocusGroup: old };
  let fail = true,
    calls = 0;
  const host = {
    Player: { AssetFamily: 'ActorFamily' },
    ChatRoomCharacter: [target],
    AssetGroupGet: () => group,
    ActivityAllowedForGroup: () => [{ Activity: { Name: 'Pet' } }],
    ActivityGetGroupOrMirror(family) {
      assert.equal(family, 'TargetFamily');
      return group;
    },
    ActivityRun() {
      assert.equal(target.FocusGroup, old);
      calls++;
      if (fail) throw Error('activity hook failed');
    },
  };
  const output = createOutput({
    host,
    store: { data: { settings: { bcx: false } } },
    owns: () => true,
    report() {},
  });
  const step = { type: 'activity', activity: 'Pet', group: 'ItemHead' };
  const event = { actor: 2, room: 'room' };
  assert.throws(() => output.execute(step, event), /activity hook failed/);
  assert.equal(target.FocusGroup, old);
  fail = false;
  output.execute(step, event);
  assert.equal(calls, 2);
  assert.equal(target.FocusGroup, old);
});

test('automatic activity replies are tagged and do not trigger another automatic reply', () => {
  let sendHook, handler;
  const sent = [],
    submitted = [];
  const target = { MemberNumber: 2, AssetFamily: 'Female3DCG' };
  const host = {
    Player: { MemberNumber: 1 },
    CurrentScreen: 'ChatRoom',
    ChatRoomCharacter: [target],
    ChatRoomRegisterMessageHandler(value) {
      handler = value;
    },
    ActivityAllowedForGroup: () => [{ Activity: { Name: 'Hug' } }],
    ActivityGetGroupOrMirror: () => ({ Name: 'ItemArms' }),
    ActivityRun() {
      sendHook(['ChatRoomChat', { Type: 'Activity', Dictionary: [] }], (args) => sent.push(args[1]));
    },
  };
  const output = createOutput({
    host,
    store: { data: { settings: { bcx: false } } },
    owns: () => true,
    report() {},
    sdk: {
      hookFunction(name, priority, callback) {
        sendHook = callback;
      },
    },
  });
  output.execute({ type: 'activity', activity: 'Hug', group: 'ItemArms' }, { actor: 2, room: 'test' });
  installEvents({
    host,
    sdk: { hookFunction() {} },
    submit: (e) => submitted.push(e),
    mouth: { receive() {} },
    reset() {},
  });
  const metadata = { TargetCharacter: host.Player, ActivityName: 'Hug', GroupName: 'ItemArms' };
  handler.Callback(sent[0], target, 'Hug', metadata);
  assert.equal(submitted.length, 0);
  const manual = { Type: 'Activity', Dictionary: [] };
  sendHook(['ChatRoomChat', manual], (args) => {
    assert.equal(args[1], manual, 'manual sends are not copied or tagged');
    handler.Callback(args[1], target, 'Hug', metadata);
  });
  assert.equal(submitted.length, 1);
});

const noisy = (n) => {
  let out = '';
  while (out.length < n) out += Math.random().toString(36).slice(2);
  return out.slice(0, n);
};
function bigPersona(d, name, rules) {
  const p = { ...d.personas[0], id: `id-${name}`, name, rules: [] };
  for (let i = 0; i < rules; i++)
    p.rules.push({
      id: `r${i}`,
      name: 'r',
      enabled: true,
      trigger: { kind: 'activity', activities: ['Pet'], groups: [], members: [], self: false },
      dedupeMs: 0,
      delayMs: 0,
      choices: [{ id: `c${i}`, steps: [{ type: 'chat', text: noisy(4000) }] }],
    });
  return p;
}
function splitHost() {
  const sent = [];
  const host = {
    Player: { ExtensionSettings: {} },
    LZString,
    ServerSend(message, payload) {
      assert.equal(message, 'AccountUpdate');
      const [field] = Object.keys(payload);
      assert.equal(Object.keys(payload).length, 1, 'one field per transfer');
      sent.push({ field, bytes: new TextEncoder().encode(JSON.stringify([message, payload])).byteLength });
    },
  };
  return { host, sent };
}
const P = `ExtensionSettings.${ID}`;
test('Settings and every persona are separate keys; changes send only the affected key', () => {
  const { host, sent } = splitHost();
  const store = createStore(host);
  store.load();
  store.update((d) => (d.settings.mouth = false)); // first split save: one whole-key replace
  assert.deepEqual(
    sent.map((m) => m.field),
    [P],
  );
  assert.deepEqual(Object.keys(host.Player.ExtensionSettings[ID]), ['Settings', 'Personas']);
  sent.length = 0;
  store.update((d) => d.personas.push(bigPersona(d, 'A', 30), bigPersona(d, 'B', 30)));
  assert.deepEqual(
    sent.map((m) => m.field),
    [`${P}.Personas.P1`, `${P}.Personas.P2`, `${P}.Settings`],
  );
  const total = JSON.stringify(host.Player.ExtensionSettings[ID]).length;
  assert.ok(total > MAX_TRANSFER_BYTES, `test data must exceed one transfer (got ${total})`);
  assert.ok(sent.every((m) => m.bytes <= MAX_TRANSFER_BYTES));
  sent.length = 0;
  store.update((d) => (d.settings.mouth = !d.settings.mouth));
  assert.deepEqual(
    sent.map((m) => m.field),
    [`${P}.Settings`],
  );
  sent.length = 0;
  store.update((d) => (d.personas.find((p) => p.id === 'id-A').name = 'A2'));
  assert.deepEqual(
    sent.map((m) => m.field),
    [`${P}.Personas.P1`],
  );
  const reloaded = createStore({ ...host });
  reloaded.load();
  assert.deepEqual(reloaded.data, store.data);
});
test('a single persona over the transfer budget is rejected without touching storage', () => {
  const { host, sent } = splitHost();
  const store = createStore(host);
  store.load();
  store.update((d) => d.personas.push(bigPersona(d, 'ok', 5)));
  const before = JSON.stringify(host.Player.ExtensionSettings);
  sent.length = 0;
  assert.throws(() => store.update((d) => d.personas.push(bigPersona(d, 'huge', 500))), /too large/);
  assert.equal(JSON.stringify(host.Player.ExtensionSettings), before);
  assert.equal(sent.length, 0);
});
test('legacy single-string profiles load, then convert to split keys in one transfer', () => {
  const legacy = defaults();
  const { host, sent } = splitHost();
  host.Player.ExtensionSettings[ID] = LZString.compressToBase64(JSON.stringify(legacy));
  const store = createStore(host);
  store.load();
  assert.equal(store.active.id, legacy.activePersona);
  store.update((d) => (d.settings.mouth = true));
  assert.deepEqual(
    sent.map((m) => m.field),
    [P],
    'whole-key replace, not a path update inside a string',
  );
  assert.equal(typeof host.Player.ExtensionSettings[ID], 'object');
  const again = createStore(host);
  again.load();
  assert.equal(again.data.settings.mouth, true);
});
test('removing a persona sends Settings first, then empties its key; missing blobs are never overwritten', () => {
  const { host, sent } = splitHost();
  const store = createStore(host);
  store.load();
  store.update((d) => d.personas.push(bigPersona(d, 'B', 3)));
  sent.length = 0;
  store.update((d) => d.personas.splice(1, 1));
  assert.deepEqual(
    sent.map((m) => m.field),
    [`${P}.Settings`, `${P}.Personas.P1`],
  );
  assert.equal(host.Player.ExtensionSettings[ID].Personas.P1, '');
  store.update((d) => d.personas.push(bigPersona(d, 'C', 3)));
  assert.notEqual(host.Player.ExtensionSettings[ID].Personas.P1, '', 'emptied key is reused');
  const broken = splitHost();
  broken.host.Player.ExtensionSettings = JSON.parse(JSON.stringify(host.Player.ExtensionSettings));
  broken.host.Player.ExtensionSettings[ID].Personas.P0 = '';
  const before = JSON.stringify(broken.host.Player.ExtensionSettings);
  assert.throws(() => createStore(broken.host).load());
  assert.equal(JSON.stringify(broken.host.Player.ExtensionSettings), before);
});
