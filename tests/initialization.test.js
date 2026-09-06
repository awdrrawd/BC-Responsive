import test from 'node:test';
import assert from 'node:assert/strict';
import LZString from 'lz-string';
import { createStore } from '../src/core/store.js';
import { defaults, validateData, ID } from '../src/core/model.js';
import { matches } from '../src/core/engine.js';
import { gameLanguage } from '../src/core/language.js';
import { activityOptions, activityOptionsAsync } from '../src/integrations/catalog.js';
import { createActivitySearch, createActivitySearchAsync } from '../src/integrations/search.js';

test('initial registration uses persisted game language and preserves saved names after language changes', () => {
  const host = { TranslationLanguage: 'EN', localStorage: { getItem: () => 'TW' }, Player: { MemberNumber: 42, ExtensionSettings: {} }, LZString, ServerPlayerExtensionSettingsSync() {} };
  const store = createStore(host); store.load();
  assert.equal(store.active.name, '預設');
  assert.equal(store.active.rules[0].name, '溫柔撫摸');
  assert.equal(store.active.rules[0].choices[1].steps[0].text, '好舒服。');
  store.update(() => {});
  host.localStorage.getItem = () => 'CN';
  const reopened = createStore(host); reopened.load();
  assert.equal(reopened.active.name, '預設');
  assert.equal(reopened.active.rules[0].name, '溫柔撫摸');
  delete host.Player.ExtensionSettings[ID];
  reopened.load(); assert.equal(reopened.active.name, '默认');
  assert.equal(gameLanguage({ navigator: { language: 'fr-FR' } }), 'FR');
  assert.equal(gameLanguage({ localStorage: { getItem() { throw Error(); } }, TranslationLanguage: 'ZH-Hant' }), 'TW');
  for (const language of ['EN','TW','CN','DE','FR','RU','UA']) assert.equal(validateData(defaults(42,language)).personas[0].rules.length,7);
});

test('only visitor events use a rule whitelist; orgasm ignores old member restrictions', () => {
  for (const event of ['join','leave','slowLeave','visitor']) {
    const r = { enabled:true,trigger:{kind:'event',event,roomMode:'any',members:[99]} };
    assert.equal(matches(r,{kind:'event',event,actor:42}),event!=='visitor');
  }
  const data=defaults(); const orgasm=data.personas[0].rules.find(r=>r.trigger.kind==='orgasm');
  orgasm.trigger.members=[99];
  assert.equal(matches(orgasm,{kind:'orgasm',outcome:'Orgasmed',actor:42}),true);
  assert.equal(validateData(data).personas[0].rules.find(r=>r.trigger.kind==='orgasm').trigger.members,undefined);
});

test('picker resource work yields before lookup, preserves search results, and cancels closed dialogs', async () => {
  let calls=0;
  const host={ ActivityFemale3DCG:Array.from({length:600},(_,i)=>({Name:`Action${i}`,Target:['ItemHands']})), ActivityDictionaryText(key){calls++;return key+' 撥動鈴鐺';} };
  const pending=activityOptionsAsync(host);
  assert.equal(calls,0,'opening must not synchronously read translations');
  const rows=await pending;
  assert.deepEqual(rows,activityOptions(host));
  const search=await createActivitySearchAsync(rows);
  assert.deepEqual(search('拨動铃鐺'),createActivitySearch(rows)('拨動铃鐺'));
  calls=0;
  assert.equal(await activityOptionsAsync(host,()=>true),null);
  assert.equal(calls,0,'cancelled dialogs must not start resource lookups');
  assert.equal(await createActivitySearchAsync(rows,()=>true),null);
});
