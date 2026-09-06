import test from 'node:test';
import assert from 'node:assert/strict';
import { createActivityPicker } from '../src/ui/activity-picker.js';

const flush = () => new Promise((resolve) => setImmediate(resolve));
test('rapid A/B/A changes reject stale results and reuse only finished indexes', async () => {
  const pending = [],
    changes = [];
  const picker = createActivityPicker({
    host: { TranslationLanguage: 'TW' },
    load: (_, cancelled, scope) => new Promise((resolve) => pending.push({ resolve, cancelled, scope })),
    index: async (rows) => () => rows,
  });
  const session = {};
  const select = (scope) => picker.select(session, scope, () => changes.push(picker.search('')), assert.fail);
  select('ItemHead');
  select('ItemHands');
  select('ItemHead');
  assert.equal(pending[0].cancelled(), true);
  pending[2].resolve(['new']);
  await flush();
  pending[0].resolve(['old']);
  pending[1].resolve(['hands']);
  await flush();
  assert.deepEqual(changes, [['new']]);
  select('ItemHands');
  select('ItemHead');
  assert.deepEqual(picker.search(''), ['new']);
  assert.equal(pending.length, 4);
  picker.reset();
  pending[3].resolve(['late']);
  await flush();
  assert.equal(picker.search, undefined);
  assert.deepEqual(changes, [['new']]);
});

test('picker language changes invalidate caches and rejected loads report once', async () => {
  const host = { TranslationLanguage: 'TW' },
    pending = [],
    errors = [];
  const picker = createActivityPicker({
    host,
    load: () => new Promise((resolve, reject) => pending.push({ resolve, reject })),
    index: async (rows) => () => rows,
  });
  const session = {};
  picker.select(
    session,
    'all',
    () => {},
    (e) => errors.push(e.message),
  );
  host.TranslationLanguage = 'EN';
  picker.select(
    session,
    'all',
    () => {},
    (e) => errors.push(e.message),
  );
  pending[0].reject(Error('obsolete'));
  pending[1].reject(Error('current'));
  await flush();
  assert.deepEqual(errors, ['current']);
});
