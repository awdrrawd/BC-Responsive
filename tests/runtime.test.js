import test from 'node:test';
import assert from 'node:assert/strict';
import LZString from 'lz-string';
import { createStore } from '../src/core/store.js';
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
  const host = { Player: { ExtensionSettings: {} }, LZString, ServerPlayerExtensionSettingsSync() {} };
  const store = createStore(host);
  store.load();
  store.update((d) => (d.settings.enabled = true));
  const saved = host.Player.ExtensionSettings[ID];
  assert.equal(store.data.settings.enabled, true);
  host.ServerPlayerExtensionSettingsSync = () => {
    throw Error('offline');
  };
  assert.throws(() => store.update((d) => (d.settings.enabled = false)));
  assert.equal(store.data.settings.enabled, true);
  assert.equal(host.Player.ExtensionSettings[ID], saved);
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
    ServerPlayerExtensionSettingsSync() {
      syncs++;
    },
  };
  const store = createStore(host);
  store.load();
  assert.ok(store.active.rules.some((r) => r.trigger.kind === 'activity'));
  assert.ok(store.active.rules.some((r) => r.trigger.kind === 'orgasm'));
  assert.ok(store.active.rules.some((r) => r.trigger.kind === 'spicer'));
  assert.equal(store.data.starterVersion, 1);
  assert.equal(syncs, 1);
});
test('new on-account personas blacklist self by default', () => {
  const data = defaults(1234);
  assert.equal(data.personas[0].listMode, 'blacklist');
  assert.deepEqual(data.personas[0].blackList, [1234]);
});
test('old LCE blocks competing mouth; registered LCE pauses before ownership, resumes after disable', () => {
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

test('activity execution keeps target focus, restores it on error, and allows retry', () => {
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
      assert.equal(target.FocusGroup, group);
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
