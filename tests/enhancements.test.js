import test from 'node:test';
import assert from 'node:assert/strict';
import { persona, rule, validatePersona } from '../src/core/model.js';
import { createScheduler } from '../src/core/engine.js';
import { petSpeech, installSpeech } from '../src/features/speech.js';
import { editAppearanceState, animationState } from '../src/features/appearance.js';
import { createOutput } from '../src/features/output.js';
import {
  searchActivities,
  normalizeSearch,
  fuzzyMatch,
  hasSearchText,
  createActivitySearch,
} from '../src/integrations/search.js';
import { catalog, activityLabel, activityOptions } from '../src/integrations/catalog.js';
import { readFileSync, existsSync } from 'node:fs';
import variants from '../src/integrations/action-variants.json' with { type: 'json' };

test('guaranteed response runs once before a distinct random choice, and pending second response cancels', () => {
  const p = persona(),
    r = rule();
  p.rules = [r];
  r.dedupeMs = 0;
  r.choices = [
    { always: true, steps: [{ type: 'chat', text: 'fixed' }] },
    { steps: [{ type: 'chat', text: 'random' }] },
  ];
  const calls = [],
    timers = new Map();
  let id = 0;
  const scheduler = createScheduler({
    active: () => p,
    valid: () => true,
    execute: (s) => calls.push(s.text),
    setTimer: (fn, ms) => {
      timers.set(++id, { fn, ms });
      return id;
    },
    clearTimer: (id) => timers.delete(id),
  });
  const event = { kind: 'activity', room: 'r', actor: 2 };
  scheduler.submit(event);
  assert.deepEqual(calls, ['fixed']);
  assert.equal(timers.get(1).ms, 50);
  const first = timers.get(1);
  timers.delete(1);
  first.fn();
  assert.deepEqual(calls, ['fixed', 'random']);
  scheduler.submit(event);
  scheduler.cancel();
  assert.equal(timers.size, 0);
  r.choices[1].always = true;
  assert.throws(() => validatePersona(p), /Only one/);
});

test('speech severity respects short text, sentence ending, insertion and replacement budgets', () => {
  assert.equal(
    petSpeech('好', ['喵'], 'weak', () => 0),
    '好喵',
  );
  assert.equal(
    petSpeech('好', ['喵'], 'addicted', () => 0),
    '喵',
  );
  assert.equal(
    petSpeech('你好！', ['喵'], 'weak', () => 0),
    '你好喵！',
  );
  const long = '今天一起出去公園散步然後回家吃晚餐';
  assert.equal((petSpeech(long, ['喵'], 'strong', () => 0).match(/喵/g) || []).length, 3);
  assert.equal((petSpeech(long, ['喵'], 'addicted', () => 0.8).match(/喵/g) || []).length, 5);
  assert.ok(petSpeech(long, ['喵'], 'medium', () => 0).endsWith('喵'));
  for (const text of ['/help', '(OOC)', 'https://example.com'])
    assert.equal(petSpeech(text, ['喵'], 'addicted'), text);
});

test('speech hook respects channel/chance and restores blocked sends without duplicating a retry', () => {
  const p = persona(),
    r = rule();
  r.trigger = { kind: 'speech', channel: 'whisper', chance: 100, severity: 'weak' };
  r.choices[0].steps[0].text = '喵';
  p.rules = [r];
  const store = { active: p };
  let callback,
    text = '好';
  const host = {
    CurrentScreen: 'ChatRoom',
    ChatRoomTargetMemberNumber: -1,
    ElementValue: (_, v) => (v === undefined ? text : (text = v)),
  };
  installSpeech({
    sdk: { hookFunction: (_, __, fn) => (callback = fn) },
    store,
    host,
    enabled: () => true,
    random: () => 0,
  });
  callback([], () => assert.equal(text, '好'));
  host.ChatRoomTargetMemberNumber = 2;
  callback([], () => assert.equal(text, '好喵'));
  assert.equal(text, '好');
  r.trigger.chance = 0;
  callback([], () => assert.equal(text, '好'));
  r.trigger.chance = 100;
  r.trigger.members = [999];
  callback([], () => {
    assert.equal(text, '好喵');
    text = '';
  });
  assert.equal(text, '');
  assert.equal(validatePersona(p).rules[0].trigger.members, undefined);
});

test('settings list registered activities independently of current self availability and body zones', () => {
  const host = {
    Player: { AssetFamily: 'Female3DCG' },
    ActivityFemale3DCG: [
      { Name: 'Pet', Target: ['ItemHead'] },
      { Name: 'OtherOnly', Target: ['ItemHands'], TargetSelf: [] },
      { Name: 'Hold', Target: ['ItemHandheld'] },
      { Name: 'SelfOnly', Target: [], TargetSelf: ['ItemMouth2'] },
    ],
    ActivityAllowedForGroup() {
      throw Error('must not inspect execution prerequisites');
    },
    ActivityDictionaryText: () => 'MISSING TEXT',
  };
  assert.deepEqual(
    activityOptions(host, 'ItemHead').map((x) => x.name),
    ['Pet'],
  );
  assert.deepEqual(
    activityOptions(host, 'ItemHands').map((x) => x.name),
    ['Hold', 'OtherOnly'],
  );
  assert.deepEqual(
    activityOptions(host, 'ItemMouth').map((x) => x.name),
    ['SelfOnly'],
  );
  assert.equal(activityOptions(host).length, 4);
  assert.deepEqual(
    searchActivities(activityOptions(host), 'OtherOnly').map((x) => x.name),
    ['OtherOnly'],
  );
});

test('same clothing follows A asset while retaining independent B colors and coordinates', () => {
  const track = {
    group: 'HairAccessory2',
    stateA: { asset: 'NewEars', color: 'red', property: { OverrideHeight: { Height: 3 } } },
    stateB: {
      sameAsset: true,
      asset: 'OldEars',
      color: 'blue',
      property: { OverrideHeight: { Height: 20 } },
    },
  };
  assert.equal(animationState(track, 'B').asset, 'NewEars');
  assert.equal(animationState(track, 'B').color, 'blue');
  assert.equal(animationState(track, 'B').property.OverrideHeight.Height, 20);
  track.stateA.asset = 'OtherEars';
  assert.equal(animationState(track, 'B').asset, 'OtherEars');
  track.stateB.sameAsset = false;
  assert.equal(animationState(track, 'B').asset, 'OldEars');
});

test('search uses game labels and character folding, not PTT labels or categories', () => {
  const rows = [
    { name: 'Nibble', group: 'ItemFeet', label: '輕咬腿部' },
    { name: 'Lick', group: 'ItemFeet', label: '舔腿' },
  ];
  assert.equal(normalizeSearch('輕咬'), normalizeSearch('轻咬'));
  assert.equal(normalizeSearch('頭部腳踝'), normalizeSearch('头部脚踝'));
  assert.equal(normalizeSearch('?'), '?');
  assert.deepEqual(searchActivities(rows, '輕咬'), searchActivities(rows, '轻咬'));
  assert.equal(searchActivities(rows, '轻咬')[0].name, 'Nibble');
  assert.deepEqual(searchActivities(rows, '嘴-轻咬'), []);
  assert.deepEqual(
    searchActivities([{ name: 'Nibble', group: 'ItemFeet', label: '新的遊戲翻譯' }], '轻咬'),
    [],
  );
  assert.equal(searchActivities(rows, 'completely unrelated').length, 0);
});

const pttFile = new URL('../TEMP/PTT_actions_1784184106842.json', import.meta.url);
test(
  'variant table contains only distinct Chinese pairs relevant to PTT',
  { skip: !existsSync(pttFile) },
  () => {
    const source = new Set(readFileSync(pttFile, 'utf8').match(/\p{Script=Han}/gu));
    const canonical = new Set([...source].map(normalizeSearch));
    for (const [char, folded] of Object.entries(variants)) {
      assert.equal([...char].length, 1);
      assert.equal([...folded].length, 1);
      assert.notEqual(char, folded, `Redundant identity entry ${char}`);
      assert.ok(canonical.has(folded), `Unrelated character ${char}`);
      assert.equal(normalizeSearch(char), normalizeSearch(folded));
    }
    assert.equal(variants['手'], undefined);
    assert.equal(normalizeSearch('上下手'), '上下手');
    assert.equal(variants['撥'], '拨');
    assert.equal(variants['動'], '动');
    assert.equal(variants['鈴'], '铃');
    assert.equal(variants['鐺'], '铛');
    assert.equal(variants['龍'], undefined);
  },
);

test('all mixed Chinese spellings and the English original match live game resources', () => {
  const key = 'Label-ChatOther-ItemNeck-BellRing',
    english = 'Jingle the bell';
  let translation = '拨动铃铛';
  const host = {
    ActivityFemale3DCG: [{ Name: 'BellRing', Target: ['ItemNeck'] }],
    ActivityDictionaryText: (k) => (k === key ? translation : 'MISSING TEXT IN dictionary'),
    CommonCSVCache: { 'Screens/Character/Preference/ActivityDictionary.csv': [[key, english]] },
  };
  const rows = catalog(host);
  assert.equal(rows[0].label, '拨动铃铛');
  for (let mask = 0; mask < 16; mask++) {
    const query = ['拨撥', '动動', '铃鈴', '铛鐺'].map((pair, i) => pair[(mask >> i) & 1]).join('');
    assert.deepEqual(searchActivities(rows, query), rows, query);
  }
  assert.deepEqual(searchActivities(rows, 'JINGLE THE BELL'), rows);
  assert.deepEqual(searchActivities(rows, 'BellRing'), rows);
  translation = '遊戲即時更新名稱';
  assert.equal(catalog(host)[0].label, translation);
  host.BC_Interactive_Index = {
    Interactive_Index: [
      { activityName: 'Unknown', Target_Group: 'ItemNeck', translatedactivity: '舊索引名稱' },
    ],
  };
  assert.equal(activityLabel('Unknown', 'ItemNeck', host), 'Unknown');
});

test('AEE search matches ordered subsequences and punctuation, without similarity ranking', () => {
  assert.equal(fuzzyMatch('輕輕撫摸頭部', '轻头'), true);
  assert.equal(fuzzyMatch('輕輕撫摸頭部', '头轻'), false);
  assert.equal(fuzzyMatch('撫摸', '摸摸'), false);
  assert.equal(fuzzyMatch('Ｈｕｇ（頭部）', 'h_u-g "头部"'), true);
  assert.equal(hasSearchText(' （）_ : · \'"[]- '), false);
  const rows = [
    { name: 'Unknown1', group: 'Test', label: '輕輕撫摸頭部' },
    { name: 'Unknown2', group: 'Test', label: '輕頭' },
  ];
  assert.deepEqual(searchActivities(rows, '轻头'), rows);
  assert.deepEqual(searchActivities(rows, '头轻'), []);
  assert.equal(searchActivities(rows, '（）'), rows);
});

test('picker indexing reads translations once and typing only filters prepared text', () => {
  let calls = 0,
    legacyReads = 0;
  const legacy = Array.from({ length: 1000 }, (_, i) => {
    const row = ['Label-ChatOther-ItemHead-Action' + i, '拨动铃铛 ' + i];
    return new Proxy(row, {
      get(target, key) {
        if (key === '0') legacyReads++;
        return target[key];
      },
    });
  });
  const host = {
    ActivityFemale3DCG: Array.from({ length: 1000 }, (_, i) => ({
      Name: 'Action' + i,
      Target: ['ItemHead'],
      TargetSelf: true,
    })),
    ActivityDictionary: legacy,
    ActivityDictionaryText() {
      calls++;
      return 'MISSING TEXT';
    },
  };
  const rows = catalog(host),
    search = createActivitySearch(rows);
  const before = { calls, legacyReads };
  assert.equal(rows.length, 1000);
  assert.ok(legacyReads <= 2000, `Legacy dictionary repeatedly scanned: ${legacyReads}`);
  assert.equal(calls, 2000);
  for (const query of ['拨', '拨動', '拨動鈴', '拨動鈴铛', 'Action99', ''])
    assert.deepEqual(search(query), searchActivities(rows, query));
  assert.deepEqual({ calls, legacyReads }, before);
});

test('three animation tracks use their own colors/properties on the same clock and restore on cancellation', () => {
  let refreshes = 0;
  const groups = ['HairAccessory2', 'TailStraps', 'Wings'];
  const items = new Map(
    groups.map((g) => [
      g,
      { Asset: { Name: g + 'Original' }, Color: 'white', Property: { OverrideHeight: { Height: 1 } } },
    ]),
  );
  const scheduled = [];
  const host = {
    Player: {},
    InventoryGet: (_, g) => items.get(g),
    InventoryWear: (_, asset, g, color) => {
      const item = { Asset: { Name: asset }, Color: color };
      items.set(g, item);
      return item;
    },
    CharacterRefresh() {
      refreshes++;
    },
    ChatRoomCharacterItemUpdate() {},
    setTimeout: (fn, ms) => {
      const t = { fn, ms };
      scheduled.push(t);
      return t;
    },
    clearTimeout: (t) => (t.cancelled = true),
  };
  const tracks = groups.map((group) => ({
    group,
    stateA: { asset: group + 'A', color: ['red'], property: { OverrideHeight: { Height: 25 } } },
    stateB: { asset: group + 'B', color: ['blue'], property: { OverrideHeight: { Height: -10 } } },
  }));
  const p = persona(),
    r = rule();
  r.choices = [
    { steps: [{ type: 'animation', tracks, count: 2, durationMs: 1000, messageType: 'emote', text: '' }] },
  ];
  p.rules = [r];
  validatePersona(p);
  const output = createOutput({
    host,
    store: { data: { settings: { bcx: false } } },
    owns: () => true,
    report() {},
  });
  r.choices = validatePersona(p).rules[0].choices;
  assert.equal(r.choices[0].steps[0].intervalMs, 500, 'legacy total duration becomes a per-switch interval');
  assert.equal(r.choices[0].steps[0].durationMs, undefined);
  r.choices[0].steps[0].count = 4;
  output.execute(r.choices[0].steps[0], {});
  assert.deepEqual(
    scheduled.map((timer) => timer.ms),
    [0, 500, 1000, 1500, 2000],
    'increasing count preserves the A/B interval',
  );
  scheduled.find((t) => t.ms === 0).fn();
  assert.equal(refreshes, 1, 'one character rebuild per frame for all three tracks');
  for (const group of groups) {
    assert.equal(items.get(group).Asset.Name, group + 'B');
    assert.deepEqual(items.get(group).Color, ['blue']);
    assert.equal(items.get(group).Property.OverrideHeight.Height, -10);
  }
  output.clear();
  for (const group of groups) assert.equal(items.get(group).Asset.Name, group + 'Original');
  assert.ok(scheduled.every((t) => t.cancelled));
  scheduled.find((t) => t.ms === 0).fn();
  assert.equal(refreshes, 2, 'late callbacks do not restart a cancelled animation');
});

test('wardrobe saves full state from a preview character without changing player appearance', async () => {
  const original = { Asset: { Name: 'Ears' }, Color: 'red', Property: { OverrideHeight: { Height: 3 } } };
  const player = { Name: 'Me', Appearance: [original] },
    preview = {};
  let callback, saved;
  const host = {
    Player: player,
    InformationSheetReturnScreen: ['Online', 'ChatRoom'],
    CommonGetScreen: () => ['Character', 'Preference'],
    CommonSetScreen: async () => {},
    PreferenceSubscreenExtensionsOpen: async (_id, returnScreen) => {
      assert.deepEqual(returnScreen, ['Online', 'ChatRoom']);
      host.InformationSheetReturnScreen = returnScreen ?? ['Character', 'Preference'];
    },
    CharacterLoadSimple: () => preview,
    CharacterRefresh() {},
    InventoryWear: (c, asset, g, color) => {
      c.Appearance = [{ Asset: { Name: asset }, Color: color }];
      return c.Appearance[0];
    },
    InventoryGet: (c) => c.Appearance[0],
    CharacterAppearanceLoadCharacter: (c, fn) => {
      assert.equal(c, preview);
      callback = fn;
    },
  };
  await editAppearanceState(
    host,
    'HairAccessory2',
    { asset: 'Ears', color: 'blue', property: { OverrideHeight: { Height: 20 } } },
    (v) => (saved = v),
  );
  await callback(true);
  assert.deepEqual(host.InformationSheetReturnScreen, ['Online', 'ChatRoom']);
  assert.equal(saved.color, 'blue');
  assert.equal(saved.property.OverrideHeight.Height, 20);
  assert.equal(player.Appearance[0], original);
  assert.equal(original.Color, 'red');
  await editAppearanceState(host, 'HairAccessory2', saved, (v) => (saved = v));
  await callback(false);
  assert.deepEqual(host.InformationSheetReturnScreen, ['Online', 'ChatRoom']);
  assert.equal(saved, null);
});
