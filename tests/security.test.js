import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { readFileSync } from 'node:fs';
import { startPreview } from '../scripts/serve.mjs';
import { isTrustedScriptUrl } from '../src/core/script-url.js';

// The shared i18n engine runs fetched scripts with new Function, so it must only fetch trusted origins.
test('script URLs are limited to trusted HTTPS hosts and loopback', () => {
  for (const url of [
    'https://evil.example/x.js',
    'http://awdrrawd.github.io/x.js',
    'http://cdn.jsdelivr.net/x.js',
    'https://awdrrawd.github.io.evil.example/x.js',
    'https://cdn.jsdelivr.net@evil.example/x.js',
    'https://user:pw@awdrrawd.github.io/x.js',
    'javascript:alert(1)',
    'data:text/javascript,1',
    'not a url',
  ])
    assert.equal(isTrustedScriptUrl(url), false, url);
  for (const url of [
    'https://awdrrawd.github.io/BC-Responsive/x.js',
    'https://cdn.jsdelivr.net/gh/awdrrawd/x/y.js',
    'https://raw.githubusercontent.com/awdrrawd/x/main/y.js',
    'http://127.0.0.1:5175/y.js',
    'http://localhost:5175/y.js',
  ])
    assert.equal(isTrustedScriptUrl(url), true, url);
});

test('the i18n engine checks the origin before fetching a script', () => {
  const engine = readFileSync(new URL('../src/core/i18n-engine.js', import.meta.url), 'utf8');
  const body = engine.slice(engine.indexOf('function loadScript(url)'));
  assert.ok(body.indexOf('isTrustedScriptUrl(') > 0);
  assert.ok(body.indexOf('isTrustedScriptUrl(') < body.indexOf('fetch(_bust(url))'));
});

test('settings page escapes every interpolated attribute value', () => {
  const source = readFileSync(new URL('../src/ui/dom-settings.js', import.meta.url), 'utf8');
  // A raw ${...} inside an HTML attribute must be a fixed class/flag expression, not data.
  const raw = [...source.matchAll(/(?:value|data-[a-z-]+)="\$\{(?!esc\()([^}]*)\}"/g)].map((m) => m[1]);
  const allowed = /===|\?|^(?:k|x|v|i|state|action|key|path|modal\.mode)$/;
  assert.deepEqual(
    raw.filter((expression) => !allowed.test(expression)),
    [],
  );
});

test('the preview server rejects foreign Host headers and survives malformed URLs', async (t) => {
  const server = await startPreview({ port: 0, log() {} });
  t.after(() => new Promise((resolve) => server.close(resolve)));
  const port = server.address().port;
  const request = (path, headers = {}) =>
    new Promise((resolve, reject) => {
      const req = http.request({ host: '127.0.0.1', port, path, headers, method: 'GET' }, (res) => {
        res.resume();
        res.on('end', () => resolve(res.statusCode));
      });
      req.on('error', reject);
      req.end();
    });
  assert.equal(await request('/main.js', { Host: 'evil.example' }), 403, 'DNS rebinding Host');
  assert.equal(await request('//', {}), 400, 'malformed request target');
  assert.notEqual(await request('/', {}), 403);
  // The server is still alive after the malformed request.
  assert.equal(await request('/nope'), 404);
});
