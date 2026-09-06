// ==UserScript==
// @name Responsive_Liko (Loader)
// @namespace https://github.com/awdrrawd/BC-Responsive
// @version 0.1.0
// @description Load Responsive_Liko from GitHub Pages with a jsDelivr fallback
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
  const urls = [
    'https://awdrrawd.github.io/BC-Responsive/dist/main.js',
    'https://cdn.jsdelivr.net/gh/awdrrawd/BC-Responsive@main/dist/main.js',
  ];
  const state = root.Responsive_LikoLoader = { urls: [...urls], url: '', attempt: 0, status: 'loading', error: null };
  let timer;
  const load = index => {
    state.attempt = index + 1;
    state.url = urls[index];
    const script = document.createElement('script');
    script.src = state.url;
    script.crossOrigin = 'anonymous';
    const retry = reason => {
      if (state.status !== 'loading' || script.src !== state.url) return;
      clearTimeout(timer);
      script.remove();
      if (index + 1 < urls.length) {
        console.info('[Responsive_Liko] ' + reason + ' Trying fallback.', state.url);
        load(index + 1);
        return;
      }
      state.status = 'error';
      state.error = reason;
      console.error('[Responsive_Liko] ' + reason, state.url);
    };
    script.onload = () => {
      if (state.status !== 'loading' || script.src !== state.url) return;
      clearTimeout(timer);
      if (!root.Responsive_Liko) return retry('Downloaded script did not initialize Responsive_Liko.');
      state.status = 'loaded';
      script.remove();
    };
    script.onerror = () => retry('Build could not be loaded.');
    timer = setTimeout(() => retry('Loading timed out after 20 seconds.'), 20000);
    (document.head || document.documentElement).appendChild(script);
  };
  load(0);
})();
