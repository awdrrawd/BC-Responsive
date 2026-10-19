// ==UserScript==
// @name Responsive_Liko (Loader)
// @namespace https://github.com/awdrrawd/BC-Responsive
// @version 0.1.1
// @description Load Responsive_Liko from GitHub Pages
// @homepageURL https://github.com/awdrrawd/BC-Responsive
// @downloadURL https://awdrrawd.github.io/BC-Responsive/loader.user.js
// @updateURL https://awdrrawd.github.io/BC-Responsive/loader.user.js
// @include      /^https:\/\/(www\.)?bondage(projects\.elementfx|-(europe|asia))\.com\/.*/
// @icon         https://raw.githubusercontent.com/awdrrawd/liko-tool-Image-storage/refs/heads/main/Images/LOGO_2.png
// @grant none
// @noframes
// @run-at document-end
// ==/UserScript==

(() => {
  'use strict';
  const root = (globalThis.Liko ??= {});
  if (root.Responsive_Liko || root.Responsive_LikoLoader?.status === 'loading') {
    console.info('[Responsive_Liko] Already loaded or loading; skipped duplicate loader.');
    return;
  }
  // 建置產物只存在於 GitHub Pages（由 Actions 在 main 更新時建置部署），倉庫本身不提交 dist/，
  // 所以沒有 jsDelivr（gh/...@main/dist）可退。main.js 沒有 hash，加時間戳避免讀到瀏覽器舊快取；
  // 失敗時以新的時間戳再試一次，涵蓋部署當下的短暫失敗。
  const base = 'https://awdrrawd.github.io/BC-Responsive/dist/main.js';
  const attempts = 2;
  const state = (root.Responsive_LikoLoader = {
    base,
    url: '',
    attempt: 0,
    status: 'loading',
    error: null,
  });
  let timer;
  const load = (index) => {
    state.attempt = index + 1;
    state.url = `${base}?v=${Date.now()}-${index + 1}`;
    const script = document.createElement('script');
    script.src = state.url;
    script.crossOrigin = 'anonymous';
    const retry = (reason) => {
      if (state.status !== 'loading' || script.src !== state.url) return;
      clearTimeout(timer);
      script.remove();
      if (index + 1 < attempts) {
        console.info('[Responsive_Liko] ' + reason + ' Retrying.', state.url);
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
