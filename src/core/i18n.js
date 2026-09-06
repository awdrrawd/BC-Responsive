import EN from '../../Translation/en.js';
import TW from '../../Translation/tw.js';
import CN from '../../Translation/cn.js';
import DE from '../../Translation/de.js';
import FR from '../../Translation/fr.js';
import RU from '../../Translation/ru.js';
import UA from '../../Translation/ua.js';
import { ID } from './model.js';
const tables = { EN, DE, FR, RU, CN, TW, UA };
const normalize = value => ({ 'ZH-TW': 'TW', 'ZH-HANT': 'TW', 'ZH-CN': 'CN', 'ZH-HANS': 'CN', ZH: 'CN', UK: 'UA' })[String(value).toUpperCase()] ?? String(value || 'EN').toUpperCase();
export function initI18n(host = globalThis) {
  host.Liko ??= {};
  if (!host.Liko.I18N) {
    const registry = new Map(); const callbacks = new Set();
    const detect = () => normalize(host.TranslationLanguage || 'EN'); let current = detect();
    host.Liko.I18N = Object.freeze({ version: 1, normalize, language: () => current,
      register: (namespace, table) => registry.set(namespace, table),
      t: (namespace, key) => registry.get(namespace)?.[current]?.[key] ?? registry.get(namespace)?.EN?.[key] ?? key,
      onChange(fn) { callbacks.add(fn); return () => callbacks.delete(fn); }
    });
    setInterval(() => { const next = detect(); if (next !== current) { current = next; callbacks.forEach(fn => { try { fn(next); } catch { /* isolated subscriber */ } }); } }, 2000);
  }
  const shared = host.Liko.I18N;
  if (shared.version === 1 && typeof shared.register === 'function') { shared.register(ID, tables); return key => shared.t(ID, key); }
  return key => tables[normalize(host.TranslationLanguage)]?.[key] ?? EN[key] ?? key;
}
