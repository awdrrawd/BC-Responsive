import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
const root = new URL('../', import.meta.url);
const identityPath = '/__responsive_preview';
function existingPreview(port, rootUrl) {
  return new Promise((resolve) => {
    const request = http.get(
      { hostname: '127.0.0.1', port, path: identityPath, timeout: 1500 },
      (response) => {
        let body = '';
        response.on('data', (chunk) => {
          body += chunk;
          if (body.length > 8192) {
            resolve(false);
            request.destroy();
          }
        });
        response.on('end', () => {
          try {
            const value = JSON.parse(body);
            resolve(value.app === 'responsive-liko-preview' && value.root === fileURLToPath(rootUrl));
          } catch {
            resolve(false);
          }
        });
        response.on('error', () => resolve(false));
      },
    );
    request.on('timeout', () => {
      resolve(false);
      request.destroy();
    });
    request.on('error', () => resolve(false));
  });
}
export async function startPreview({ port = 5175, rootUrl = root, log = console.log } = {}) {
  const server = http.createServer(async (req, res) => {
    const pathname = new URL(req.url, 'http://localhost').pathname;
    if (pathname === identityPath) {
      res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
      res.end(JSON.stringify({ app: 'responsive-liko-preview', root: fileURLToPath(rootUrl) }));
      return;
    }
    const allowed = {
      '/': ['dev/preview.html', 'text/html'],
      '/preview.js': ['dev/preview.js', 'text/javascript'],
      '/main.js': ['dist/main.js', 'text/javascript'],
      '/loader.user.js': ['loader.user.js', 'text/javascript'],
      '/loader.local.user.js': ['loader.local.user.js', 'text/javascript'],
    };
    const route = allowed[pathname];
    if (!route) {
      res.writeHead(404);
      res.end();
      return;
    }
    try {
      const content = await readFile(new URL(route[0], rootUrl));
      res.writeHead(200, {
        'Content-Type': `${route[1]}; charset=utf-8`,
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-store',
      });
      res.end(content);
    } catch {
      res.writeHead(500);
      res.end('Build the project first');
    }
  });
  try {
    await new Promise((resolve, reject) => {
      server.once('error', reject);
      server.listen(port, '127.0.0.1', () => {
        server.removeListener('error', reject);
        resolve();
      });
    });
  } catch (error) {
    if (error.code !== 'EADDRINUSE') throw error;
    if (await existingPreview(port, rootUrl)) {
      log(`本專案的預覽服務已在執行：http://127.0.0.1:${port}。直接重新整理即可載入最新建置。`);
      return null;
    }
    throw new Error(
      `127.0.0.1:${port} 已被其他服務或舊版預覽占用。請在原服務視窗按 Ctrl+C 停止後，再執行 npm run dev。`,
    );
  }
  log(`Preview: http://127.0.0.1:${server.address().port}`);
  return server;
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  startPreview().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
