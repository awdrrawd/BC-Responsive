// ==UserScript==
// @name Responsive_Liko (Loader)
// @namespace https://github.com/awdrrawd/BC-Responsive
// @version 0.1.0
// @description Load Responsive_Liko from the GitHub main build via jsDelivr
// @homepageURL https://github.com/awdrrawd/BC-Responsive
// @include      /^https:\/\/(www\.)?bondage(projects\.elementfx|-(europe|asia))\.com\/.*/
// @icon         https://raw.githubusercontent.com/awdrrawd/liko-tool-Image-storage/refs/heads/main/Images/LOGO_2.png
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
  const url = new URL("https://cdn.jsdelivr.net/gh/awdrrawd/BC-Responsive@main/dist/main.js");
  // The main branch CDN may cache updates; use the local loader for development.
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
  script.onerror = () => fail("Build could not be loaded. Check that dist/main.js has been pushed to GitHub." );
  timer = setTimeout(() => fail('Loading timed out after 20 seconds.'), 20000);
  (document.head || document.documentElement).appendChild(script);
})();
