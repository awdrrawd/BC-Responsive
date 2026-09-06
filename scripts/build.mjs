import { build } from 'esbuild';
import { mkdir, readFile, writeFile, copyFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { makeLoader } from './loader.mjs';
const root = new URL('../', import.meta.url);
process.chdir(fileURLToPath(root));
const pkg = JSON.parse(await readFile('package.json', 'utf8'));
await mkdir('dist', { recursive: true });
await build({ entryPoints: ['src/main.js'], outfile: 'dist/Responsive_Liko.js', bundle: true, format: 'iife', target: 'es2021', sourcemap: true, legalComments: 'eof', loader: { '.svg': 'dataurl' } });
const meta = `// ==UserScript==
// @name Responsive_Liko
// @namespace https://github.com/awdrrawd/BC-Responsive
// @version ${pkg.version}
// @homepageURL https://github.com/awdrrawd/BC-Responsive
// @description Configurable event reactions and persona import
// @match https://*.bondageprojects.elementfx.com/*
// @match https://*.bondage-europe.com/*
// @match https://*.bondageprojects.com/*
// @grant none
// @noframes
// @run-at document-end
// ==/UserScript==\n`;
await writeFile('dist/Responsive_Liko.user.js', meta + await readFile('dist/Responsive_Liko.js', 'utf8'));
await writeFile('loader.user.js', makeLoader({ version: pkg.version, url: pkg.config.loaderUrl }));
await writeFile('loader.local.user.js', makeLoader({ version: pkg.version, url: pkg.config.localLoaderUrl, local: true }));
await copyFile('README.md', 'dist/README.md');
await mkdir('dist/licenses', { recursive: true });
await copyFile('node_modules/bondage-club-mod-sdk/LICENSE', 'dist/licenses/ModSDK-MIT.txt');
await copyFile('node_modules/lz-string/LICENSE', 'dist/licenses/LZString-MIT.txt');
await copyFile('LICENSE', 'dist/licenses/Responsive_Liko-MIT.txt');
console.log('Built dist/Responsive_Liko.user.js, loader.user.js and loader.local.user.js');
