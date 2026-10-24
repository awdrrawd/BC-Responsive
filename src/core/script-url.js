// Scripts fetched by the shared i18n engine are executed with new Function, so the origin must be trusted:
// HTTPS on the project's own hosts, or loopback (HTTP allowed) for local development.
const TRUSTED_HOSTS = new Set(['awdrrawd.github.io', 'raw.githubusercontent.com', 'cdn.jsdelivr.net']);
const LOOPBACK_HOSTS = new Set(['127.0.0.1', 'localhost', '[::1]']);
export function isTrustedScriptUrl(url, base) {
  try {
    const u = new URL(String(url), base);
    if (u.username || u.password) return false;
    if (u.protocol === 'https:') return TRUSTED_HOSTS.has(u.hostname) || LOOPBACK_HOSTS.has(u.hostname);
    return u.protocol === 'http:' && LOOPBACK_HOSTS.has(u.hostname);
  } catch {
    return false;
  }
}
