import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
const root = new URL('../', import.meta.url);
const identityPath = '/__responsive_preview';
const staticRoutes = {
  '/': ['dev/preview.html', 'text/html'],
  '/preview.js': ['dev/preview.js', 'text/javascript'],
  '/loader.user.js': ['loader.user.js', 'text/javascript'],
  '/loader.local.user.js': ['loader.local.user.js', 'text/javascript'],
};
// 建置產物只開放 main.js 與 app-<hash>.js（含 .map）；檔名固定格式，不接受任何路徑片段。
const bundleFile = /^\/((?:main|app-[A-Za-z0-9_-]+)\.js(\.map)?)$/;
function routeFor(pathname) {
  if (Object.hasOwn(staticRoutes, pathname)) return staticRoutes[pathname];
  const match = bundleFile.exec(pathname);
  if (match) return [`dist/${match[1]}`, match[2] ? 'application/json' : 'text/javascript'];
}
// Chrome 的 Private Network Access：公開 HTTPS 頁面讀取本機服務時需要明確允許。
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Private-Network': 'true',
};
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
// 只接受以回送位址存取的請求。惡意網站可用 DNS rebinding 讓瀏覽器把自己的網域解析到 127.0.0.1，
// 此時 Host 標頭會是攻擊者的網域；擋掉它，預覽服務就不會被當成跨站讀取本機檔案的跳板。
const allowedHost = /^(?:127\.0\.0\.1|localhost|\[::1\])(?::\d{1,5})?$/i;
export async function startPreview({ port = 5175, rootUrl = root, log = console.log } = {}) {
  const server = http.createServer(async (req, res) => {
    if (!allowedHost.test(req.headers.host ?? '')) {
      res.writeHead(403);
      res.end();
      return;
    }
    let pathname;
    try {
      pathname = new URL(req.url, 'http://localhost').pathname;
    } catch {
      // 例如 "//"：不是合法的請求目標，回 400，不讓例外把行程帶走。
      res.writeHead(400);
      res.end();
      return;
    }
    if (req.method === 'OPTIONS') {
      res.writeHead(204, { ...corsHeaders, 'Access-Control-Allow-Methods': 'GET, OPTIONS' });
      res.end();
      return;
    }
    if (pathname === identityPath) {
      res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
      res.end(JSON.stringify({ app: 'responsive-liko-preview', root: fileURLToPath(rootUrl) }));
      return;
    }
    const route = routeFor(pathname);
    if (!route) {
      res.writeHead(404);
      res.end();
      return;
    }
    try {
      const content = await readFile(new URL(route[0], rootUrl));
      res.writeHead(200, {
        'Content-Type': `${route[1]}; charset=utf-8`,
        ...corsHeaders,
        'Cache-Control': 'no-store',
      });
      res.end(content);
    } catch {
      res.writeHead(500);
      res.end('Build the project first: npm run build');
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
