import { ID, clone, defaults, starterPersona, validateData } from './model.js';
export function createStore(host = globalThis) {
  let data = defaults(host.Player?.MemberNumber); let loaded = false; const listeners = new Set();
  const notify = () => listeners.forEach(fn => fn(data));
  return {
    get data() { return data; }, get loaded() { return loaded; },
    subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); },
    load() {
      const raw = host.Player?.ExtensionSettings?.[ID];
      if (raw) {
        const decoded = host.LZString.decompressFromBase64(raw);
        // Never silently overwrite an unreadable existing profile with defaults.
        data = validateData(JSON.parse(decoded));
        if (data.starterVersion < 1) {
          if (data.personas.length === 1 && data.personas[0].rules.length === 0) {
            data.personas[0].rules = starterPersona(data.personas[0].name).rules;
            if (Number.isSafeInteger(host.Player?.MemberNumber) && !data.personas[0].blackList.includes(host.Player.MemberNumber)) data.personas[0].blackList.push(host.Player.MemberNumber);
          }
          data.starterVersion = 1;
          host.Player.ExtensionSettings[ID] = host.LZString.compressToBase64(JSON.stringify(data));
          host.ServerPlayerExtensionSettingsSync(ID);
        }
      } else data = defaults(host.Player?.MemberNumber);
      loaded = true; notify();
    },
    update(change) {
      if (!loaded) throw new Error('Settings not loaded');
      const draft = clone(data); change(draft); const next = validateData(draft);
      const encoded = host.LZString.compressToBase64(JSON.stringify(next));
      if (encoded.length > 60000) throw new Error('Settings too large (60 KB compressed limit)');
      if (!host.Player?.ExtensionSettings) throw new Error('Player settings unavailable');
      const old = host.Player.ExtensionSettings[ID];
      host.Player.ExtensionSettings[ID] = encoded;
      try { host.ServerPlayerExtensionSettingsSync(ID); } catch (error) { host.Player.ExtensionSettings[ID] = old; throw error; }
      data = next; notify();
    },
    get active() { return data.personas.find(p => p.id === data.activePersona); }
  };
}
