import { build, context } from 'esbuild';
import { readFileSync } from 'node:fs';
import { mkdir, readdir, rm } from 'node:fs/promises';
import { basename, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));

// MIT 要求散布時保留依賴的版權與授權聲明：全文放在 licenses/ 並隨 Pages 發佈，這裡在每個產物開頭留下指引。
const dependencies = Object.entries(pkg.dependencies)
  .map(([name, version]) => `${name}@${version}`)
  .join(', ');
const banner = {
  js: `/*! Responsive_Liko ${pkg.version} (MIT). Bundles ${dependencies} (MIT). License texts: https://awdrrawd.github.io/BC-Responsive/licenses/ */`,
};

const shared = {
  absWorkingDir: root,
  entryPoints: ['src/main.js'],
  bundle: true,
  target: 'es2021',
  legalComments: 'eof',
  banner,
  loader: { '.svg': 'dataurl', '.css': 'text' },
};

// 只保留這次建置實際產出的檔案：app 分檔帶內容 hash，不清掉的話本機 dist/ 會一直累積舊檔。
function cleanStaleOutputs() {
  return {
    name: 'clean-stale-outputs',
    setup(api) {
      api.onEnd(async (result) => {
        if (!result.metafile) return;
        const keep = new Set(Object.keys(result.metafile.outputs).map((file) => basename(file)));
        const dir = resolve(root, api.initialOptions.outdir);
        for (const name of await readdir(dir))
          if (!keep.has(name)) await rm(join(dir, name), { force: true });
      });
    },
  };
}

// 正式輸出：
//   main.js         極小的入口，同步佔住 Liko.Responsive_Liko 作為重複載入防護，再動態載入 app 分檔。
//                   不含靜態 import/export，因此舊 loader 用一般 <script> 載入也能運作。
//   app-<hash>.js   實際程式碼；hash 讓「新 main.js 指到舊 app」不會發生。
export const releaseOptions = (outdir = 'dist') => ({
  ...shared,
  outdir,
  format: 'esm',
  splitting: true,
  entryNames: '[name]',
  chunkNames: '[name]-[hash]',
  sourcemap: true,
  metafile: true,
  plugins: [cleanStaleOutputs()],
});

// 測試用：同一份原始碼打成單一 IIFE 並留在記憶體，讓 vm 測試不依賴 dist/ 是否存在或是否最新。
export const singleFileOptions = () => ({
  ...shared,
  outfile: 'main.js',
  format: 'iife',
  write: false,
  sourcemap: false,
});

export async function bundleSingleFile() {
  const { outputFiles } = await build(singleFileOptions());
  return outputFiles[0].text;
}

export async function runBuild({ outdir = 'dist', log = console.log } = {}) {
  await mkdir(resolve(root, outdir), { recursive: true });
  const result = await build(releaseOptions(outdir));
  const files = Object.keys(result.metafile.outputs).filter((file) => file.endsWith('.js'));
  for (const file of files) log(`Built ${file}`);
  return result;
}

export async function watchBuild({ outdir = 'dist', log = console.log } = {}) {
  await mkdir(resolve(root, outdir), { recursive: true });
  const options = releaseOptions(outdir);
  options.plugins.push({
    name: 'report-rebuild',
    setup(api) {
      api.onEnd((result) => {
        if (result.errors.length) log(`Build failed (${result.errors.length} error)`);
        else
          log(
            `Rebuilt ${Object.keys(result.metafile.outputs)
              .filter((f) => f.endsWith('.js'))
              .join(', ')}`,
          );
      });
    },
  });
  const ctx = await context(options);
  await ctx.watch();
  return ctx;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (process.argv.includes('--watch')) await watchBuild();
  else await runBuild();
}
