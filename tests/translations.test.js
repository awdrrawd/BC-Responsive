import test from 'node:test';
import assert from 'node:assert/strict';
import en from '../Translation/en.js';
const tokens = (value) => [...value.matchAll(/\{\w+\}/g)].map((match) => match[0]).sort();
test('all translations have matching keys and interpolation parameters', async () => {
  for (const lang of ['tw', 'cn', 'de', 'fr', 'ru', 'ua']) {
    const table = (await import(`../Translation/${lang}.js`)).default;
    assert.deepEqual(Object.keys(table).sort(), Object.keys(en).sort(), lang);
    for (const key of Object.keys(en)) {
      assert.ok(typeof table[key] === 'string' && table[key].trim(), `${lang}:${key}`);
      assert.deepEqual(tokens(table[key]), tokens(en[key]), `${lang}:${key}`);
    }
  }
});

test('localized tables contain no English placeholders except reviewed shared terms', async () => {
  // Product names and words that are also valid in the target language.
  const shared = {
    tw: ['title', 'owns'],
    cn: ['title', 'owns'],
    de: ['title', 'owns', 'name', 'emote', 'textStep'],
    fr: ['title', 'owns', 'activity', 'action', 'activePersona', 'type'],
    ru: ['title', 'owns'],
    ua: ['title', 'owns'],
  };
  for (const [lang, allowed] of Object.entries(shared)) {
    const table = (await import(`../Translation/${lang}.js`)).default;
    assert.deepEqual(
      Object.keys(en)
        .filter((key) => table[key] === en[key])
        .sort(),
      allowed.sort(),
      `${lang}: review untranslated or legitimately shared terms`,
    );
  }
});
