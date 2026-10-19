import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { mkdtemp, readdir, readFile, rm, writeFile, mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { runBuild } from '../scripts/build.mjs';

// Build into a throwaway directory so tests never touch dist/.
async function tempBuild(t) {
  const outdir = await mkdtemp(join(tmpdir(), 'responsive-build-'));
  t.after(() => rm(outdir, { recursive: true, force: true }));
  return outdir;
}

test('release build emits a tiny classic-compatible main.js plus a hashed app chunk', async (t) => {
  const outdir = await tempBuild(t);
  await runBuild({ outdir, log() {} });
  const files = (await readdir(outdir)).sort();
  const app = files.find((name) => /^app-[A-Za-z0-9_-]+\.js$/.test(name));
  assert.ok(app, `expected an app-<hash>.js chunk, got ${files}`);
  assert.deepEqual(files, ['main.js', 'main.js.map', app, `${app}.map`].sort());
  const main = await readFile(join(outdir, 'main.js'), 'utf8');
  // Old installed loaders still load main.js with a plain <script>: no static import/export allowed.
  assert.doesNotMatch(main, /^\s*(import|export)\s/m);
  assert.doesNotThrow(() => new vm.Script(main), 'main.js parses as a classic script');
  assert.ok(main.includes(`import("./${app}")`), 'main.js points at the hashed chunk of this build');
  assert.ok(main.length < 4096, 'main.js stays a bootstrap, not the whole bundle');
  assert.match(await readFile(join(outdir, app), 'utf8'), /Responsive_Liko/);
});

test('main.js claims the namespace synchronously and a second load is a no-op', async (t) => {
  const outdir = await tempBuild(t);
  await runBuild({ outdir, log() {} });
  const main = await readFile(join(outdir, 'main.js'), 'utf8');
  const loaded = [];
  const sandbox = { console: { info() {}, error() {} } };
  sandbox.globalThis = sandbox;
  // vm cannot run import() without a module linker; stub it by rewriting the call.
  const source = main.replace(/import\("([^"]+)"\)/, (_, file) => `__import(${JSON.stringify(file)})`);
  sandbox.__import = (file) => {
    loaded.push(file);
    return new Promise(() => {});
  };
  const context = vm.createContext(sandbox);
  vm.runInContext(source, context);
  assert.ok(sandbox.Liko.Responsive_Liko, 'namespace is claimed before the chunk finishes loading');
  vm.runInContext(source, context);
  assert.equal(loaded.length, 1, 'the duplicate load does not import the app again');
});

test('rebuilding removes stale hashed chunks but nothing else is kept', async (t) => {
  const outdir = await tempBuild(t);
  await mkdir(outdir, { recursive: true });
  await writeFile(join(outdir, 'app-OLDHASH1.js'), '// stale');
  await writeFile(join(outdir, 'app-OLDHASH1.js.map'), '{}');
  await runBuild({ outdir, log() {} });
  const files = await readdir(outdir);
  assert.ok(!files.includes('app-OLDHASH1.js'));
  assert.ok(!files.includes('app-OLDHASH1.js.map'));
  assert.equal(files.filter((name) => name.endsWith('.js') && name.startsWith('app-')).length, 1);
});
