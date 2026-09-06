import http from 'node:http';
import { readFile } from 'node:fs/promises';
const root = new URL('../', import.meta.url);
http.createServer(async (req, res) => {
  const pathname = new URL(req.url, 'http://localhost').pathname;
  const allowed = { '/': ['dev/preview.html', 'text/html'], '/preview.js': ['dev/preview.js', 'text/javascript'], '/main.js': ['dist/main.js', 'text/javascript'], '/loader.user.js': ['loader.user.js', 'text/javascript'], '/loader.local.user.js': ['loader.local.user.js', 'text/javascript'] };
  const route = allowed[pathname]; if (!route) { res.writeHead(404); res.end(); return; }
  try {
    const content = await readFile(new URL(route[0], root));
    res.writeHead(200, { 'Content-Type': `${route[1]}; charset=utf-8`, 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'no-store' });
    res.end(content);
  }
  catch { res.writeHead(500); res.end('Build the project first'); }
}).listen(5175, '127.0.0.1', () => console.log('Preview: http://127.0.0.1:5175'));
