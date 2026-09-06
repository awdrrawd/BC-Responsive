export function gameLanguage(host = globalThis) {
  let saved;
  try {
    saved = host.localStorage?.getItem('BondageClubLanguage');
  } catch {
    /* storage unavailable */
  }
  const value = String(saved || host.TranslationLanguage || host.navigator?.language || 'EN').toUpperCase();
  if (/^(TW|ZH(?:-TW|-HANT)?$)/.test(value) || value.startsWith('ZH-HANT')) return 'TW';
  if (value === 'CN' || value.startsWith('ZH')) return 'CN';
  return value.split('-')[0].replace(/^UK$/, 'UA');
}
