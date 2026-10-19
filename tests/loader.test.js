import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';

function fixture(local = false) {
  const appended = [],
    timers = new Map();
  let id = 0;
  const sandbox = {
    URL,
    console: { info() {}, error() {} },
    setTimeout(fn) {
      timers.set(++id, fn);
      return id;
    },
    clearTimeout(id) {
      timers.delete(id);
    },
    document: {
      createElement() {
        return {
          remove() {
            this.removed = true;
          },
        };
      },
      head: {
        appendChild(script) {
          appended.push(script);
        },
      },
    },
  };
  const context = vm.createContext(sandbox);
  const script = readFileSync(
    new URL(local ? '../loader.local.user.js' : '../loader.user.js', import.meta.url),
    'utf8',
  );
  const run = () => vm.runInContext(script, context);
  return { sandbox, appended, timers, run };
}

const pagesMain = 'https://awdrrawd.github.io/BC-Responsive/dist/main.js';

test('production loader targets the configured repository and prevents duplicates', () => {
  const f = fixture();
  f.run();
  const url = new URL(f.appended[0].src);
  assert.equal(url.origin + url.pathname, pagesMain);
  assert.ok(url.searchParams.has('v'), 'main.js has no hash, so the loader cache-busts it');
  f.run();
  assert.equal(f.appended.length, 1);
  f.sandbox.Liko.Responsive_Liko = {};
  f.appended[0].onload();
  assert.equal(f.sandbox.Liko.Responsive_LikoLoader.status, 'loaded');
  assert.equal(f.timers.size, 0);
  f.run();
  assert.equal(f.appended.length, 1);
});

test('production loader retries Pages once with a fresh cache-buster and never uses jsDelivr', () => {
  const f = fixture();
  f.run();
  f.appended[0].onerror();
  assert.equal(f.appended[0].removed, true);
  assert.equal(f.appended.length, 2);
  const [first, second] = f.appended.map((script) => new URL(script.src));
  assert.equal(second.origin + second.pathname, pagesMain);
  assert.notEqual(first.search, second.search);
  assert.equal(f.sandbox.Liko.Responsive_LikoLoader.attempt, 2);
  f.sandbox.Liko.Responsive_Liko = {};
  f.appended[1].onload();
  assert.equal(f.sandbox.Liko.Responsive_LikoLoader.status, 'loaded');
});

test('production loader reports an error after the retry also fails', () => {
  const f = fixture();
  f.run();
  f.appended[0].onerror();
  f.appended[1].onerror();
  assert.equal(f.appended.length, 2);
  assert.equal(f.sandbox.Liko.Responsive_LikoLoader.status, 'error');
  assert.equal(f.timers.size, 0);
});

test('local loader cache-busts localhost and allows retry after a failed load', () => {
  const f = fixture(true);
  f.run();
  const url = new URL(f.appended[0].src);
  assert.equal(url.origin, 'http://127.0.0.1:5175');
  assert.ok(url.searchParams.has('t'));
  f.appended[0].onerror();
  assert.equal(f.sandbox.Liko.Responsive_LikoLoader.status, 'error');
  assert.equal(f.appended[0].removed, true);
  f.run();
  assert.equal(f.appended.length, 2);
});

test('a fetched script without the plugin namespace is not marked successful', () => {
  const f = fixture();
  f.run();
  f.appended[0].onload();
  f.appended[1].onload();
  assert.equal(f.sandbox.Liko.Responsive_LikoLoader.status, 'error');
  assert.equal(f.timers.size, 0);
});

test('timeout clears the script and does not allow a late onload to report success', () => {
  const f = fixture();
  f.run();
  [...f.timers.values()][0]();
  assert.equal(f.appended.length, 2);
  assert.equal(f.appended[0].removed, true);
  [...f.timers.values()][0]();
  assert.equal(f.sandbox.Liko.Responsive_LikoLoader.status, 'error');
  assert.equal(f.appended[1].removed, true);
  f.sandbox.Liko.Responsive_Liko = {};
  f.appended[1].onload();
  assert.equal(f.sandbox.Liko.Responsive_LikoLoader.status, 'error');
});
