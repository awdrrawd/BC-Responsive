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

// HSC publishes which expression groups hypnosis controls right now. Read it live on every use so
// load order and clean-up never leave a cached flag behind; an absent or older API means "none".
export function hscExpressionGroups(host = globalThis) {
  const api = host.Liko?.HSC?.expressions;
  if (api?.apiVersion !== 1 || typeof api.getState !== 'function') return new Set();
  try {
    const state = api.getState();
    return new Set(
      state?.active === true && Array.isArray(state.groups)
        ? state.groups.filter((group) => typeof group === 'string')
        : [],
    );
  } catch {
    return new Set();
  }
}

// True while an expression animation engine (LCE or WCE) redirects CharacterSetFacialExpression
// into its own queue. Both engines read the Timer argument as the effect duration.
export function expressionEngineIntercepts(host = globalThis) {
  for (const key of ['lceAnimationEngineEnabled', 'bceAnimationEngineEnabled']) {
    try {
      if (host[key]?.()) return true;
    } catch {
      /* A failing reader is not an active engine. */
    }
  }
  return false;
}
