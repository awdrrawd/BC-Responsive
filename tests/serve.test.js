import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { readdirSync } from 'node:fs';
import { startPreview } from '../scripts/serve.mjs';
import { runBuild } from '../scripts/build.mjs';

// dist/ is not committed; build it so the preview has something to serve.
await runBuild({ log() {} });

test('a duplicate preview reuses the running server and still serves the current bundle', async (t) => {
  const server = await startPreview({ port: 0, log() {} });
  t.after(() => new Promise((resolve) => server.close(resolve)));
  const port = server.address().port,
    messages = [];
  assert.equal(await startPreview({ port, log: (message) => messages.push(message) }), null);
  assert.match(messages[0], /本專案的預覽服務已在執行/);
  const response = await fetch(`http://127.0.0.1:${port}/main.js`);
  assert.equal(response.status, 200);
  assert.match(await response.text(), /Responsive_Liko/);
  assert.equal(response.headers.get('access-control-allow-private-network'), 'true');
});

test('the preview serves the hashed app chunk that main.js imports, and nothing else from dist', async (t) => {
  const server = await startPreview({ port: 0, log() {} });
  t.after(() => new Promise((resolve) => server.close(resolve)));
  const base = `http://127.0.0.1:${server.address().port}`;
  const main = await (await fetch(`${base}/main.js`)).text();
  const chunk = /import\("\.\/(app-[A-Za-z0-9_-]+\.js)"\)/.exec(main)?.[1];
  assert.ok(chunk, 'main.js dynamically imports the app chunk');
  const app = await fetch(`${base}/${chunk}`);
  assert.equal(app.status, 200);
  assert.match(app.headers.get('content-type'), /javascript/);
  assert.equal((await fetch(`${base}/${chunk}.map`)).status, 200);
  for (const path of ['/app-.js', '/app-..%2Fmain.js', '/dist/main.js', '/package.json', '/app-ABC.json'])
    assert.equal((await fetch(`${base}${path}`)).status, 404, path);
  assert.ok(readdirSync(new URL('../dist/', import.meta.url)).includes(chunk));
  const preflight = await fetch(`${base}/main.js`, { method: 'OPTIONS' });
  assert.equal(preflight.status, 204);
  assert.equal(preflight.headers.get('access-control-allow-private-network'), 'true');
});

test('a foreign service gives a helpful port conflict without shutting it down', async (t) => {
  const server = http.createServer((req, res) => {
    res.writeHead(404);
    res.end('other app');
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise((resolve) => server.close(resolve)));
  await assert.rejects(startPreview({ port: server.address().port, log() {} }), /Ctrl\+C/);
  assert.equal(server.listening, true);
});

test('another checkout is not mistaken for this project preview', async (t) => {
  const server = await startPreview({ port: 0, rootUrl: new URL('../dev/', import.meta.url), log() {} });
  t.after(() => new Promise((resolve) => server.close(resolve)));
  await assert.rejects(startPreview({ port: server.address().port, log() {} }), /已被其他服務/);
});
