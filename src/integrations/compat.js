// Read live settings only. Presence alone does not mean a feature is enabled.
export function lceFeatureEnabled(key, host = globalThis) {
  try {
    return host.Liko?.LCE?.getFeature?.(key) === true;
  } catch {
    return false;
  }
}
export function expressionEngines(host = globalThis) {
  const engines = [];
  try {
    if (
      host.FBC_VERSION !== undefined &&
      host.Player?.FBC &&
      host.fbcSettingValue?.('animationEngine') === true &&
      host.fbcSettingValue?.('activityExpressions') === true
    )
      engines.push('WCE');
  } catch {
    /* An unavailable reader is not an enabled engine. */
  }
  if (lceFeatureEnabled('animationEngine', host) && lceFeatureEnabled('activityExpressions', host))
    engines.push('LCE');
  return engines;
}

// The warning follows feature switches, independent of saved persona rules.
export function expressionConflicts(store, host = globalThis) {
  if (!store.data.settings.enabled || !store.data.settings.reactions) return [];
  return expressionEngines(host);
}
