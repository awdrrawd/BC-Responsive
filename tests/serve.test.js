import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { startPreview } from '../scripts/serve.mjs';

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
