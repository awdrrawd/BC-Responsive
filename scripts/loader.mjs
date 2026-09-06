export function makeLoader({ version, url, local = false }) {
  const parsed = new URL(url);
  if (!['https:', 'http:'].includes(parsed.protocol)) throw new Error('Loader URL must use HTTP(S)');
  return `// ==UserScript==
// @name Responsive_Liko${local ? ' (Local Loader)' : ' (Loader)'}
// @namespace https://github.com/awdrrawd/BC-Responsive
// @version ${version}
// @description ${local ? 'Load the local development build of Responsive_Liko' : 'Load Responsive_Liko from the GitHub main build via jsDelivr'}
// @homepageURL https://github.com/awdrrawd/BC-Responsive
// @match https://*.bondageprojects.elementfx.com/*
// @match https://*.bondage-europe.com/*
// @match https://*.bondageprojects.com/*
// @grant none
// @noframes
// @run-at document-end
// ==/UserScript==

(() => {
  'use strict';
  const root = globalThis.Liko ??= {};
  if (root.Responsive_Liko || root.Responsive_LikoLoader?.status === 'loading') {
    console.info('[Responsive_Liko] Already loaded or loading; skipped duplicate loader.');
    return;
  }
  const url = new URL(${JSON.stringify(url)});
  ${local ? "url.searchParams.set('t', String(Date.now()));" : '// The main branch CDN may cache updates; use the local loader for development.'}
  const state = root.Responsive_LikoLoader = { url: url.href, status: 'loading', error: null };
  const script = document.createElement('script');
  script.src = url.href;
  script.crossOrigin = 'anonymous';
  let timer;
  const fail = reason => {
    if (state.status !== 'loading') return;
    clearTimeout(timer);
    state.status = 'error'; state.error = reason;
    script.remove();
    console.error('[Responsive_Liko] ' + reason, state.url);
  };
  script.onload = () => {
    if (state.status !== 'loading') return;
    clearTimeout(timer);
    if (!root.Responsive_Liko) return fail('Downloaded script did not initialize Responsive_Liko.');
    state.status = 'loaded';
    script.remove();
  };
  script.onerror = () => fail(${JSON.stringify(local ? 'Local build could not be loaded. Start npm run dev and check browser local-network permissions.' : 'Build could not be loaded. Check that main/dist/Responsive_Liko.js has been pushed to GitHub.')} );
  timer = setTimeout(() => fail('Loading timed out after 20 seconds.'), 20000);
  (document.head || document.documentElement).appendChild(script);
})();
`;
}
