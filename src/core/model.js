import starters from '../../Translation/starters.js';
import packageInfo from '../../package.json' with { type: 'json' };
export const VERSION = packageInfo.version;
export const ID = 'Responsive_Liko';
export const clone = (value) => JSON.parse(JSON.stringify(value));
export const uid = () =>
  globalThis.crypto?.randomUUID?.() ?? `rl-${Date.now()}-${Math.random().toString(36).slice(2)}`;
export const object = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const DEFAULT_SETTINGS = Object.freeze({
  enabled: true,
  reactions: true,
  mouth: false,
  interruption: false,
  bcx: true,
});
export function persona(name = 'Default', selfMember) {
  return {
    id: uid(),
    name,
    listMode: 'blacklist',
    whiteList: [],
    blackList: Number.isSafeInteger(selfMember) ? [selfMember] : [],
    rules: [],
  };
}
const choice = (type, text) => ({ id: uid(), steps: [{ type, text }] });
const starterRule = (name, trigger, texts, type = 'chat') => ({
  id: uid(),
  name,
  enabled: true,
  trigger,
  dedupeMs: 0,
  delayMs: 0,
  choices: texts.map((text) => choice(type, text)),
});
export function starterPersona(name, selfMember, language = 'EN') {
  const localized = starters[language];
  const p = persona(name ?? localized?.[0] ?? 'Default', selfMember);
  p.rules = [
    starterRule(
      'Gentle touch',
      {
        kind: 'activity',
        activities: ['Pet', 'Caress'],
        groups: ['ItemHead', 'ItemNose', 'ItemEars'],
        members: [],
        self: false,
      },
      ['Mmm...', 'That feels nice.', 'Mm, keep going.'],
    ),
    starterRule(
      'Pain',
      {
        kind: 'activity',
        activities: ['Slap', 'Bite', 'Spank', 'Kick', 'Pinch', 'SpankItem', 'ShockItem'],
        groups: [],
        members: [],
        self: false,
      },
      ['Ouch!', 'Ah!', 'Nnh...'],
    ),
    starterRule(
      'Tickle',
      { kind: 'activity', activities: ['Tickle', 'TickleItem'], groups: [], members: [], self: false },
      ['Haha!', 'N-no, that tickles!', 'Ahaha...'],
    ),
    starterRule('Low arousal flavour', { kind: 'spicer', min: 0, max: 49, members: [] }, ['Mm...', 'Ah...']),
    starterRule('High arousal flavour', { kind: 'spicer', min: 50, max: 100, members: [] }, [
      'Mmh♥',
      'Haa...♥',
      'Nnh... ah♥',
    ]),
    starterRule('Climax', { kind: 'orgasm', outcome: 'Any', members: [] }, [
      'Aah...!',
      'Mmmh...!',
      'HaaAAaah!',
    ]),
    starterRule(
      'Welcome visitor',
      { kind: 'event', event: 'visitor', roomMode: 'any', roomNames: [], members: [] },
      ['Welcome, {Other}.'],
    ),
  ];
  if (localized)
    p.rules.forEach((r, i) => {
      r.name = localized[1][i];
      r.choices.forEach((c, j) => {
        c.steps[0].text = localized[2][i][j];
      });
    });
  return p;
}
export const supportsRuleMembers = (t) =>
  ['activity', 'spicer'].includes(t.kind) || (t.kind === 'event' && t.event === 'visitor');
export function defaults(selfMember, language = 'EN') {
  const p = starterPersona(undefined, selfMember, language);
  return {
    schemaVersion: 1,
    starterVersion: 1,
    settings: { ...DEFAULT_SETTINGS },
    activePersona: p.id,
    personas: [p],
  };
}
export function rule() {
  return {
    id: uid(),
    name: 'New rule',
    enabled: true,
    trigger: { kind: 'activity', activities: [], groups: [], members: [], self: false },
    dedupeMs: 0,
    delayMs: 0,
    choices: [{ id: uid(), steps: [{ type: 'chat', text: '' }] }],
  };
}
const kinds = ['activity', 'orgasm', 'spicer', 'event', 'speech'];
const types = ['chat', 'emote', 'action', 'activity', 'expression', 'animation'];
function assert(ok, message) {
  if (!ok) throw new Error(message);
}
function strings(v) {
  return Array.isArray(v) && v.every((x) => typeof x === 'string');
}
function members(v) {
  return Array.isArray(v) && v.every((x) => Number.isSafeInteger(x) && x >= 0);
}
export function validatePersona(input) {
  assert(object(input), 'Invalid persona');
  const p = clone(input);
  assert(typeof p.name === 'string' && p.name.trim() && p.name.length <= 100, 'Invalid persona name');
  p.id ||= uid();
  assert(typeof p.id === 'string', 'Invalid persona ID');
  p.blackList ??= [];
  p.whiteList ??= [];
  p.listMode ??= p.whiteList.length ? 'whitelist' : 'blacklist';
  assert(['whitelist', 'blacklist'].includes(p.listMode), 'Invalid list mode');
  assert(members(p.whiteList), 'Invalid whitelist');
  assert(members(p.blackList), 'Invalid blacklist');
  assert(Array.isArray(p.rules) && p.rules.length <= 500, 'Invalid rules (maximum 500)');
  const ids = new Set();
  for (const r of p.rules) {
    assert(object(r) && object(r.trigger), 'Invalid rule');
    r.id ||= uid();
    assert(typeof r.id === 'string' && !ids.has(r.id), 'Duplicate rule ID');
    ids.add(r.id);
    assert(typeof r.name === 'string' && typeof r.enabled === 'boolean', 'Invalid rule name/enabled');
    const t = r.trigger;
    assert(kinds.includes(t.kind), 'Unknown trigger');
    if (!supportsRuleMembers(t)) delete t.members;
    if (t.kind === 'speech') {
      delete t.members;
      t.channel ??= 'all';
      t.chance ??= 100;
      t.severity ??= 'weak';
      assert(['all', 'chat', 'whisper'].includes(t.channel), 'Invalid speech channel');
      assert(['weak', 'medium', 'strong', 'addicted'].includes(t.severity), 'Invalid speech severity');
      assert(Number.isFinite(t.chance) && t.chance >= 0 && t.chance <= 100, 'Invalid speech chance');
    }
    for (const key of ['activities', 'groups'])
      if (t[key] !== undefined) assert(strings(t[key]), `Invalid ${key}`);
    if (t.members !== undefined) assert(members(t.members), 'Invalid members');
    if (t.self !== undefined) assert(typeof t.self === 'boolean', 'Invalid self condition');
    if (t.matchNone !== undefined) assert(typeof t.matchNone === 'boolean', 'Invalid empty filter');
    if (t.kind === 'event') {
      assert(['join', 'leave', 'slowLeave', 'visitor'].includes(t.event), 'Invalid room event');
      t.roomMode ??= 'any';
      t.roomNames ??= [];
      assert(['any', 'named'].includes(t.roomMode) && strings(t.roomNames), 'Invalid room filter');
    }
    if (t.kind === 'orgasm')
      assert(['Any', 'Orgasmed', 'Ruined', 'Resisted'].includes(t.outcome), 'Invalid outcome');
    for (const key of ['min', 'max'])
      if (t[key] !== undefined)
        assert(Number.isFinite(t[key]) && t[key] >= 0 && t[key] <= 100, `Invalid ${key}`);
    if (t.min !== undefined && t.max !== undefined) assert(t.min <= t.max, 'Minimum exceeds maximum');
    if (t.kind === 'spicer') delete t.arousalSource;
    // Retain the legacy field for export compatibility; rule-level dedupe is retired.
    r.dedupeMs = 0;
    r.delayMs ??= 0;
    for (const key of ['dedupeMs', 'delayMs'])
      assert(Number.isFinite(r[key]) && r[key] >= 0 && r[key] <= 600000, `Invalid ${key}`);
    assert(Array.isArray(r.choices) && r.choices.length <= 1000, 'Invalid choices');
    assert(r.choices.filter((c) => c.always).length <= 1, 'Only one guaranteed response per rule');
    for (const c of r.choices) {
      assert(object(c), 'Invalid choice');
      c.id ||= uid();
      if (c.always !== undefined) assert(typeof c.always === 'boolean', 'Invalid guaranteed response');
      assert(
        Array.isArray(c.steps) && c.steps.length > 0 && c.steps.length <= 10,
        'A choice needs 1–10 steps',
      );
      for (const s of c.steps) {
        assert(object(s) && types.includes(s.type), 'Unknown response type');
        if (t.kind === 'speech') assert(s.type === 'chat', 'Speech habits accept text phrases only');
        if (['chat', 'emote', 'action'].includes(s.type))
          assert(typeof s.text === 'string' && s.text.length <= 4000, 'Invalid message');
        if (s.type === 'activity')
          assert(
            typeof s.activity === 'string' && !!s.activity && typeof s.group === 'string' && !!s.group,
            'Activity and group required',
          );
        if (s.type === 'expression')
          assert(
            typeof s.group === 'string' &&
              (s.value === null || typeof s.value === 'string') &&
              Number.isFinite(s.durationMs) &&
              s.durationMs >= 100 &&
              s.durationMs <= 60000,
            'Invalid expression',
          );
        if (s.type === 'animation') {
          const tracks = s.tracks ?? [
            { group: s.group, stateA: { asset: s.assetA }, stateB: { asset: s.assetB } },
          ];
          assert(
            Array.isArray(tracks) && tracks.length >= 1 && tracks.length <= 3,
            'Choose 1–3 animation groups',
          );
          assert(new Set(tracks.map((x) => x.group)).size === tracks.length, 'Duplicate animation group');
          for (const track of tracks) {
            assert(
              ['HairAccessory2', 'TailStraps', 'Wings'].includes(track.group),
              'Invalid animation group',
            );
            for (const state of [track.stateA, track.stateB]) {
              assert(
                object(state) && typeof state.asset === 'string' && !!state.asset,
                'Animation assets required',
              );
              if (state.color !== undefined)
                assert(typeof state.color === 'string' || strings(state.color), 'Invalid animation color');
              if (state.property != null) assert(object(state.property), 'Invalid animation property');
              if (state.craft != null) assert(object(state.craft), 'Invalid animation craft');
              if (state.sameAsset !== undefined)
                assert(typeof state.sameAsset === 'boolean', 'Invalid same clothing flag');
            }
          }
          assert(Number.isSafeInteger(s.count) && s.count >= 1 && s.count <= 100, 'Invalid animation count');
          // Legacy animations stored total duration, not the delay between states.
          if (s.intervalMs === undefined && Number.isFinite(s.durationMs))
            s.intervalMs = s.durationMs / s.count;
          assert(
            Number.isFinite(s.intervalMs) && s.intervalMs >= 1 && s.intervalMs <= 120000,
            'Invalid animation interval',
          );
          delete s.durationMs;
          assert(
            ['chat', 'emote', 'action'].includes(s.messageType) &&
              typeof s.text === 'string' &&
              s.text.length <= 4000,
            'Invalid animation message',
          );
        }
      }
    }
  }
  return p;
}
export function validateData(v) {
  assert(object(v) && v.schemaVersion === 1 && object(v.settings), 'Unknown settings version');
  const result = clone(v);
  result.starterVersion ??= 0;
  assert(
    Number.isSafeInteger(result.starterVersion) && result.starterVersion >= 0,
    'Invalid starter version',
  );
  for (const k of Object.keys(DEFAULT_SETTINGS))
    assert(typeof result.settings[k] === 'boolean', `Invalid setting: ${k}`);
  assert(
    Array.isArray(result.personas) && result.personas.length > 0 && result.personas.length <= 100,
    'Invalid personas',
  );
  result.personas = result.personas.map(validatePersona);
  assert(new Set(result.personas.map((p) => p.id)).size === result.personas.length, 'Duplicate persona ID');
  assert(
    result.personas.some((p) => p.id === result.activePersona),
    'Active persona missing',
  );
  return result;
}
