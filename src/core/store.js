import { gameLanguage } from './language.js';
import { ID, clone, defaults, object, starterPersona, validateData } from './model.js';

/*
 * BC limits the size of ONE transmission (~180 KB, an anti-DDoS measure), not the total amount of
 * ExtensionSettings a plugin may keep. The exact server-side measuring is unverified, so we budget
 * below the limit and measure the whole AccountUpdate message in UTF-8 bytes (see BC插件開發指南 §8.5).
 *
 * Storage layout, every leaf is a LZString/Base64 JSON string and is saved by its own AccountUpdate:
 *   ExtensionSettings.<ID>.Settings        settings, activePersona, starterVersion, order: [{ id, key }]
 *   ExtensionSettings.<ID>.Personas.P<n>   one persona per key
 * Only leaves whose value changed are sent. Persona leaves go first and Settings last, so Settings never
 * references a persona that has not been written. Removed personas are emptied afterwards.
 * Profiles saved by older versions (everything in one string at ExtensionSettings.<ID>) are read as-is and
 * converted by ONE whole-key replace, because a path update cannot create fields inside a string.
 * ServerSend only queues; BC sends at most 14 messages / 1200 ms across all message types (§8.5.1).
 */
export const MAX_TRANSFER_BYTES = 150_000;
const KEY = /^P\d+$/;
const utf8 = (text) => new TextEncoder().encode(text).byteLength;
const fieldOf = (path) => ['ExtensionSettings', ID, ...path].join('.');
export const transferBytes = (path, value) =>
  utf8(JSON.stringify(['AccountUpdate', { [fieldOf(path)]: value }]));

export function createStore(host = globalThis) {
  let data = defaults(host.Player?.MemberNumber, gameLanguage(host));
  let loaded = false;
  const listeners = new Set();
  const notify = () => listeners.forEach((fn) => fn(data));
  const encode = (value) => host.LZString.compressToBase64(JSON.stringify(value));
  const decode = (raw) => JSON.parse(host.LZString.decompressFromBase64(raw));
  const isSplit = (root) => object(root) && typeof root.Settings === 'string' && object(root.Personas);

  function read(root) {
    if (typeof root === 'string') return validateData(decode(root)); // legacy single-string profile
    if (!isSplit(root)) throw new Error('Unknown settings layout');
    const index = decode(root.Settings);
    if (!object(index) || !Array.isArray(index.order)) throw new Error('Invalid settings index');
    const personas = index.order.map(({ id, key }) => {
      if (typeof key !== 'string' || !KEY.test(key)) throw new Error('Invalid settings index');
      if (!root.Personas[key]) throw new Error(`Missing persona data: ${id}`);
      return decode(root.Personas[key]);
    });
    const { order, ...rest } = index;
    return validateData({ ...rest, personas });
  }

  const get = (path) => path.reduce((o, k) => o?.[k], host.Player.ExtensionSettings[ID]);
  function set(path, value) {
    const settings = host.Player.ExtensionSettings;
    if (!path.length) {
      if (value === undefined) delete settings[ID];
      else settings[ID] = value;
      return;
    }
    const parent = path.slice(0, -1).reduce((o, k) => o[k], settings[ID]);
    if (value === undefined) delete parent[path.at(-1)];
    else parent[path.at(-1)] = value;
  }
  function checkSize(path, value, label) {
    const bytes = transferBytes(path, value);
    if (bytes > MAX_TRANSFER_BYTES)
      throw new Error(`${label} too large (${bytes} bytes; single transfer budget ${MAX_TRANSFER_BYTES})`);
  }

  /* Work out the writes that turn the stored state into `next`. Nothing is modified here. */
  function plan(next) {
    const root = host.Player.ExtensionSettings[ID];
    let keyOf = new Map();
    if (isSplit(root)) {
      try {
        keyOf = new Map(decode(root.Settings).order.map((e) => [e.id, e.key]));
      } catch {
        /* unreadable index: allocate fresh keys */
      }
    }
    const used = new Set(next.personas.map((p) => keyOf.get(p.id)).filter(Boolean));
    let n = 0;
    const free = () => {
      while (used.has(`P${n}`)) n++;
      used.add(`P${n}`);
      return `P${n}`;
    };
    const order = next.personas.map((p) => ({ id: p.id, key: keyOf.get(p.id) ?? free() }));
    const { personas, ...rest } = next;
    const blobs = next.personas.map((p, i) => [order[i].key, encode(p), p.name]);
    const settings = encode({ ...rest, order });

    if (!isSplit(root)) {
      // First split save (new profile or legacy single string): replace the whole key in ONE transfer.
      const value = { Settings: settings, Personas: Object.fromEntries(blobs.map(([k, v]) => [k, v])) };
      checkSize([], value, 'Initial settings');
      return [{ path: [], value }];
    }
    const writes = [];
    for (const [key, value, name] of blobs)
      if (root.Personas[key] !== value) {
        checkSize(['Personas', key], value, `Persona "${name}"`);
        writes.push({ path: ['Personas', key], value });
      }
    if (root.Settings !== settings) {
      checkSize(['Settings'], settings, 'Settings');
      writes.push({ path: ['Settings'], value: settings });
    }
    const kept = new Set(order.map((e) => e.key));
    for (const key of keyOf.values())
      if (!kept.has(key) && root.Personas[key]) writes.push({ path: ['Personas', key], value: '' });
    return writes;
  }

  function persist(next) {
    if (!host.Player?.ExtensionSettings) throw new Error('Player settings unavailable');
    if (typeof host.ServerSend !== 'function') throw new Error('ServerSend unavailable');
    const writes = plan(next);
    const previous = writes.map((w) => [w.path, clone({ v: get(w.path) }).v]);
    try {
      for (const { path, value } of writes) {
        if (!path.length) set(path, clone(value));
        else set(path, value);
        // A queued payload is not copied by ServerSend, so never hand it the live local object.
        host.ServerSend('AccountUpdate', { [fieldOf(path)]: path.length ? value : clone(value) });
      }
    } catch (error) {
      for (const [path, value] of previous.reverse()) set(path, value);
      throw error;
    }
  }

  return {
    get data() {
      return data;
    },
    get loaded() {
      return loaded;
    },
    subscribe(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    load() {
      const raw = host.Player?.ExtensionSettings?.[ID];
      if (raw) {
        // Never silently overwrite an unreadable existing profile with defaults.
        data = read(raw);
        if (data.starterVersion < 1) {
          if (data.personas.length === 1 && data.personas[0].rules.length === 0) {
            data.personas[0].rules = starterPersona(
              data.personas[0].name,
              host.Player?.MemberNumber,
              gameLanguage(host),
            ).rules;
            if (
              Number.isSafeInteger(host.Player?.MemberNumber) &&
              !data.personas[0].blackList.includes(host.Player.MemberNumber)
            )
              data.personas[0].blackList.push(host.Player.MemberNumber);
          }
          data.starterVersion = 1;
          persist(data);
        }
      } else data = defaults(host.Player?.MemberNumber, gameLanguage(host));
      loaded = true;
      notify();
    },
    update(change) {
      if (!loaded) throw new Error('Settings not loaded');
      const draft = clone(data);
      change(draft);
      const next = validateData(draft);
      persist(next);
      data = next;
      notify();
    },
    get active() {
      return data.personas.find((p) => p.id === data.activePersona);
    },
  };
}
