const missing = (s) =>
  typeof s !== 'string' || !s || /MISSING (?:TEXT|ACTIVITY)|STRING_RETRIEVAL_FAILED/.test(s);
const LABEL_GROUP = {
  ItemMouth2: 'ItemMouth',
  ItemMouth3: 'ItemMouth',
  ItemNeckAccessories: 'ItemNeck',
  ItemNeckRestraints: 'ItemNeck',
  ItemNipplesPiercings: 'ItemNipples',
  ItemTorso2: 'ItemTorso',
  ItemHandheld: 'ItemHands',
};
function activityLabelKeys(name, group, character) {
  const sexGroup = character?.HasPenis?.()
    ? ({ ItemVulva: 'ItemPenis', ItemVulvaPiercings: 'ItemGlans' }[group] ?? group)
    : group;
  const groups = [...new Set([sexGroup, group, LABEL_GROUP[group]].filter(Boolean))];
  return groups.flatMap((candidate) =>
    ['ChatOther', 'ChatSelf'].map((direction) => `Label-${direction}-${candidate}-${name}`),
  );
}
export function activityLabel(name, group, host = globalThis, character = host.Player) {
  for (const key of activityLabelKeys(name, group, character)) {
    let value;
    try {
      value = host.ActivityDictionaryText?.(key);
    } catch {
      /* dictionary not ready */
    }
    if (!missing(value)) return value;
    const row = host.ActivityDictionary?.find?.((r) => Array.isArray(r) && r[0] === key && !missing(r[1]));
    if (row) return row[1];
  }
  if (name.startsWith('XSAct_')) return name.slice(6);
  return name.replace(/^[A-Za-z]{2,12}_/, '');
}
const originalLabels = new WeakMap();
function gameOriginalLabels(host) {
  // TextCache translates copies of these rows; CommonCSVCache retains BC's English source.
  const path =
    host.ScreenFileGetPath?.('ActivityDictionary.csv', 'Character', 'Preference') ??
    'Screens/Character/Preference/ActivityDictionary.csv';
  const source = host.CommonCSVCache?.[path];
  if (!Array.isArray(source)) return new Map();
  let cached = originalLabels.get(source);
  if (!cached || cached.length !== source.length) {
    cached = {
      length: source.length,
      labels: new Map(
        source.filter((row) => Array.isArray(row) && !missing(row[1])).map((row) => [row[0], row[1]]),
      ),
    };
    originalLabels.set(source, cached);
  }
  return cached.labels;
}
export function activitySearchLabels(name, group, host = globalThis, character = host.Player, lookup) {
  const english = gameOriginalLabels(host),
    labels = new Set();
  for (const key of activityLabelKeys(name, group, character)) {
    let translated;
    try {
      translated = lookup ? lookup(key) : host.ActivityDictionaryText?.(key);
    } catch {
      /* resource not ready */
    }
    if (!missing(translated)) labels.add(translated);
    if (!lookup)
      for (const row of host.ActivityDictionary ?? [])
        if (Array.isArray(row) && row[0] === key && !missing(row[1])) labels.add(row[1]);
    if (english.has(key)) labels.add(english.get(key));
  }
  return [...labels];
}
function* catalogRows(host = globalThis, selectedGroup = null) {
  let activities;
  try {
    activities = host.AssetAllActivities?.(host.Player?.AssetFamily ?? 'Female3DCG');
  } catch {
    /* fallback */
  }
  activities ??= host.ActivityFemale3DCG ?? [];
  const result = new Map();
  const legacy = new Map(
    (host.ActivityDictionary ?? [])
      .filter((row) => Array.isArray(row) && !missing(row[1]))
      .map((row) => [row[0], row[1]]),
  );
  const resolved = new Map();
  const lookup = (key) => {
    if (!resolved.has(key)) {
      let value;
      try {
        value = host.ActivityDictionaryText?.(key);
      } catch {
        /* resource not ready */
      }
      resolved.set(key, missing(value) ? legacy.get(key) : value);
    }
    return resolved.get(key);
  };
  for (const a of activities) {
    const groups = [a.Target, a.TargetSelf === true ? a.Target : a.TargetSelf]
      .flat()
      .filter((g) => typeof g === 'string');
    for (const group of groups)
      if (
        (!selectedGroup || canonicalGroup(group) === canonicalGroup(selectedGroup)) &&
        typeof a.Name === 'string' &&
        !result.has(`${group}|${a.Name}`)
      ) {
        const label =
          activityLabelKeys(a.Name, group, host.Player)
            .map(lookup)
            .find((value) => !missing(value)) ?? a.Name.replace(/^[A-Za-z]{2,12}_/, '');
        const row = {
          name: a.Name,
          group,
          label,
          searchLabels: activitySearchLabels(a.Name, group, host, host.Player, lookup),
        };
        result.set(`${group}|${a.Name}`, row);
        yield row;
      }
  }
}
export function catalog(host = globalThis) {
  return [...catalogRows(host)].sort((a, b) => a.label.localeCompare(b.label));
}
export async function activityOptionsAsync(host = globalThis, cancelled = () => false, group = null) {
  const rows = [];
  // Yield before resource work and between small batches so the dialog can paint.
  await new Promise((resolve) => setTimeout(resolve, 16));
  if (cancelled()) return null;
  let deadline = performance.now() + 4;
  for (const row of catalogRows(host, group)) {
    if (cancelled()) return null;
    rows.push(row);
    if (performance.now() >= deadline) {
      await new Promise((resolve) => setTimeout(resolve, 0));
      deadline = performance.now() + 4;
    }
  }
  return rows.sort((a, b) => a.label.localeCompare(b.label));
}
export function allowedActivity(target, name, group, host = globalThis) {
  const old = target.FocusGroup;
  try {
    target.FocusGroup = host.AssetGroupGet?.(target.AssetFamily, group) ?? { Name: group };
    return host.ActivityAllowedForGroup(target, group)?.find((a) => a.Activity?.Name === name);
  } finally {
    target.FocusGroup = old;
  }
}

// Keep this list aligned with BC's interactive target groups.  The geometry
// itself always comes from AssetGroup.Zone, which is also what BC and
// QuickInteraction use for hit testing.
export const BODY_GROUPS = [
  'ItemHead',
  'ItemNose',
  'ItemEars',
  'ItemHood',
  'ItemMouth',
  'ItemMouth2',
  'ItemMouth3',
  'ItemNeck',
  'ItemNeckAccessories',
  'ItemNeckRestraints',
  'ItemNipples',
  'ItemNipplesPiercings',
  'ItemBreast',
  'ItemTorso',
  'ItemTorso2',
  'ItemArms',
  'ItemHands',
  'ItemHandheld',
  'ItemPelvis',
  'ItemVulva',
  'ItemVulvaPiercings',
  'ItemButt',
  'ItemLegs',
  'ItemFeet',
  'ItemBoots',
];
const GROUP_ALIAS = {
  ItemMouth2: 'ItemMouth',
  ItemMouth3: 'ItemMouth',
  ItemNeckAccessories: 'ItemNeck',
  ItemNeckRestraints: 'ItemNeck',
  ItemNipplesPiercings: 'ItemNipples',
  ItemTorso2: 'ItemTorso',
  ItemHandheld: 'ItemHands',
};
export const canonicalGroup = (group) => GROUP_ALIAS[group] ?? group;

// Settings describe future interactions, so do not apply the player's current
// self-target, equipment, distance or permission prerequisites to this list.
export function activityOptions(host = globalThis, group = null) {
  const rows = catalog(host);
  return group ? rows.filter((row) => canonicalGroup(row.group) === canonicalGroup(group)) : rows;
}

export function bodyZones(character, host = globalThis) {
  const family = character?.AssetFamily ?? host.Player?.AssetFamily ?? 'Female3DCG';
  const zones = [];
  for (const physical of BODY_GROUPS) {
    let group;
    try {
      group =
        host.AssetGroupGet?.(family, physical) ??
        host.AssetGroup?.find?.((g) => g?.Family === family && g.Name === physical);
    } catch {
      /* optional BC surface */
    }
    if (!Array.isArray(group?.Zone)) continue;
    for (const zone of group.Zone)
      if (Array.isArray(zone) && zone.length >= 4)
        zones.push({ group: canonicalGroup(physical), physical, zone: zone.slice(0, 4) });
  }
  return zones;
}

export function activitiesForGroup(character, group, host = globalThis) {
  if (!character || !group) return [];
  const physicalGroups = group === 'ItemHands' ? ['ItemHands', 'ItemHandheld'] : [group];
  const found = new Map();
  for (const physical of physicalGroups) {
    const old = character.FocusGroup;
    try {
      character.FocusGroup = host.AssetGroupGet?.(character.AssetFamily, physical) ?? { Name: physical };
      for (const item of host.ActivityAllowedForGroup?.(character, physical) ?? []) {
        const activity = item?.Activity ?? item;
        if (!activity?.Name) continue;
        const key = `${physical}|${activity.Name}`;
        found.set(key, {
          name: activity.Name,
          group: physical,
          label: activityLabel(activity.Name, physical, host, character),
          searchLabels: activitySearchLabels(activity.Name, physical, host, character),
        });
      }
    } catch {
      /* a third-party prerequisite may throw while being queried */
    } finally {
      character.FocusGroup = old;
    }
  }
  return [...found.values()].sort((a, b) => a.label.localeCompare(b.label));
}
