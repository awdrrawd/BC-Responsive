const missing = s => typeof s !== 'string' || !s || /MISSING (?:TEXT|ACTIVITY)|STRING_RETRIEVAL_FAILED/.test(s);
const LABEL_GROUP = { ItemMouth2: 'ItemMouth', ItemMouth3: 'ItemMouth', ItemNeckAccessories: 'ItemNeck', ItemNeckRestraints: 'ItemNeck', ItemNipplesPiercings: 'ItemNipples', ItemTorso2: 'ItemTorso', ItemHandheld: 'ItemHands' };
export function activityLabel(name, group, host = globalThis, character = host.Player) {
  const sexGroup = character?.HasPenis?.() ? ({ ItemVulva: 'ItemPenis', ItemVulvaPiercings: 'ItemGlans' }[group] ?? group) : group;
  const groups = [...new Set([sexGroup, group, LABEL_GROUP[group]].filter(Boolean))];
  for (const candidate of groups) for (const direction of ['ChatOther', 'ChatSelf']) {
    const key = `Label-${direction}-${candidate}-${name}`;
    let value;
    try { value = host.ActivityDictionaryText?.(key); } catch { /* dictionary not ready */ }
    if (!missing(value)) return value;
    const row = host.ActivityDictionary?.find?.(r => Array.isArray(r) && r[0] === key && !missing(r[1]));
    if (row) return row[1];
  }
  const indexed = host.BC_Interactive_Index?.Interactive_Index?.find?.(a => a?.activityName === name && (!group || a.Target_Group === group));
  if (!missing(indexed?.translatedactivity)) return indexed.translatedactivity;
  if (name.startsWith('XSAct_')) return name.slice(6);
  return name.replace(/^[A-Za-z]{2,12}_/, '');
}
export function catalog(host = globalThis) {
  let activities;
  try { activities = host.AssetAllActivities?.(host.Player?.AssetFamily ?? 'Female3DCG'); } catch { /* fallback */ }
  activities ??= host.ActivityFemale3DCG ?? [];
  const result = new Map();
  for (const a of activities) {
    const groups = [a.Target, a.TargetSelf === true ? a.Target : a.TargetSelf].flat().filter(g => typeof g === 'string');
    for (const group of groups) if (typeof a.Name === 'string') result.set(`${group}|${a.Name}`, { name: a.Name, group, label: activityLabel(a.Name, group, host) });
  }
  return [...result.values()].sort((a, b) => a.label.localeCompare(b.label));
}
export function allowedActivity(target, name, group, host = globalThis) {
  const old = target.FocusGroup;
  try {
    target.FocusGroup = host.AssetGroupGet?.(target.AssetFamily, group) ?? { Name: group };
    return host.ActivityAllowedForGroup(target, group)?.find(a => a.Activity?.Name === name);
  } finally { target.FocusGroup = old; }
}

// Keep this list aligned with BC's interactive target groups.  The geometry
// itself always comes from AssetGroup.Zone, which is also what BC and
// QuickInteraction use for hit testing.
export const BODY_GROUPS = [
  'ItemHead', 'ItemNose', 'ItemEars', 'ItemHood', 'ItemMouth', 'ItemMouth2', 'ItemMouth3',
  'ItemNeck', 'ItemNeckAccessories', 'ItemNeckRestraints', 'ItemNipples',
  'ItemNipplesPiercings', 'ItemBreast', 'ItemTorso', 'ItemTorso2', 'ItemArms',
  'ItemHands', 'ItemHandheld', 'ItemPelvis', 'ItemVulva', 'ItemVulvaPiercings',
  'ItemButt', 'ItemLegs', 'ItemFeet', 'ItemBoots'
];
const GROUP_ALIAS = { ItemMouth2: 'ItemMouth', ItemMouth3: 'ItemMouth', ItemNeckAccessories: 'ItemNeck', ItemNeckRestraints: 'ItemNeck', ItemNipplesPiercings: 'ItemNipples', ItemTorso2: 'ItemTorso', ItemHandheld: 'ItemHands' };
export const canonicalGroup = group => GROUP_ALIAS[group] ?? group;

export function bodyZones(character, host = globalThis) {
  const family = character?.AssetFamily ?? host.Player?.AssetFamily ?? 'Female3DCG';
  const zones = [];
  for (const physical of BODY_GROUPS) {
    let group;
    try { group = host.AssetGroupGet?.(family, physical) ?? host.AssetGroup?.find?.(g => g?.Family === family && g.Name === physical); } catch { /* optional BC surface */ }
    if (!Array.isArray(group?.Zone)) continue;
    for (const zone of group.Zone) if (Array.isArray(zone) && zone.length >= 4) zones.push({ group: canonicalGroup(physical), physical, zone: zone.slice(0, 4) });
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
        found.set(key, { name: activity.Name, group: physical, label: activityLabel(activity.Name, physical, host, character) });
      }
    } catch { /* a third-party prerequisite may throw while being queried */ }
    finally { character.FocusGroup = old; }
  }
  return [...found.values()].sort((a, b) => a.label.localeCompare(b.label));
}
