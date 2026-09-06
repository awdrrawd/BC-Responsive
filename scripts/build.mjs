import { build } from 'esbuild';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const root = new URL('../', import.meta.url);
process.chdir(fileURLToPath(root));
await mkdir('dist', { recursive: true });
await build({ entryPoints: ['src/main.js'], outfile: 'dist/main.js', bundle: true, format: 'iife', target: 'es2021', sourcemap: true, legalComments: 'eof', loader: { '.svg': 'dataurl' } });
console.log('Built dist/main.js');
