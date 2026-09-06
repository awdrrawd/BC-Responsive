import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
import { webcrypto } from 'node:crypto';
import LZString from 'lz-string';
import { defaults, ID, rule } from '../src/core/model.js';
test('bundled plugin registers with ModSDK and handles a visitor through actual hooks', async () => {
  const data = defaults();
  data.settings.enabled = true;
  const r = rule();
  r.trigger = { kind: 'event', event: 'visitor' };
  r.delayMs = 0;
  r.choices[0].steps = [
    { type: 'chat', text: 'Hello {other}' },
    { type: 'activity', activity: 'Hug', group: 'ItemArms' },
  ];
  data.personas[0].rules = [r];
  const calls = [];
  const intervals = new Set();
  let draft = 'draft';
  let setting;
  let handler;
  const drawn = [],
    fields = [];
  const canvas = { getBoundingClientRect: () => ({ left: 10, top: 20, width: 1000, height: 500 }) };
  const drawing = {
    canvas,
    save() {},
    restore() {},
    fillRect() {},
    fillText(value) {
      drawn.push(value);
    },
  };
  const sandbox = {
    TextEncoder,
    crypto: webcrypto,
    console,
    LZString,
    setTimeout,
    clearTimeout,
    setInterval(callback) {
      intervals.add(callback);
      return callback;
    },
    clearInterval(callback) {
      intervals.delete(callback);
    },
    TranslationLanguage: 'EN',
    CurrentScreen: 'ChatRoom',
    ChatRoomData: { Name: 'Test' },
    Player: {
      MemberNumber: 1,
      Name: 'Player',
      ExtensionSettings: { [ID]: LZString.compressToBase64(JSON.stringify(data)) },
    },
    ChatRoomCharacter: [],
    ChatRoomTargetMemberNumber: -1,
    PreferenceRegisterExtensionSetting(config) {
      setting = config;
    },
    ChatRoomRegisterMessageHandler(config) {
      handler = config;
    },
    ChatRoomSync() {},
    ChatRoomAddCharacterToChatRoom(c) {
      sandbox.ChatRoomCharacter.push(c);
    },
    ChatRoomSyncMemberLeave(data) {
      sandbox.ChatRoomCharacter = sandbox.ChatRoomCharacter.filter(
        (c) => c.MemberNumber !== data.SourceMemberNumber,
      );
    },
    CommonDrawAppearanceBuild() {},
    CharacterRefresh() {},
    InventoryGet() {
      return null;
    },
    ElementValue: (_, value) => (value === undefined ? draft : (draft = value)),
    ChatRoomSetTarget(value) {
      sandbox.ChatRoomTargetMemberNumber = value;
    },
    ChatRoomSendChat() {
      calls.push(draft);
      draft = '';
    },
    CharacterNickname: (c) => c.Name,
    ActivityAllowedForGroup: () => [{ Activity: { Name: 'Hug' } }],
    ActivityGetGroupOrMirror: () => ({}),
    ActivityRun(actor, target) {
      calls.push(`Hug ${target.Name}`);
    },
    ServerPlayerExtensionSettingsSync() {},
    // The window property is a named DOM element, not BC's lexical context.
    MainCanvas: canvas,
    __drawing: drawing,
    DrawButton() {},
    MouseIn() {
      return false;
    },
    document: {
      createElement: () => ({
        style: {},
        setAttribute() {},
        remove() {},
        querySelector() {
          return null;
        },
        querySelectorAll() {
          return [];
        },
      }),
      body: {
        appendChild(node) {
          fields.push(node);
        },
      },
    },
  };
  sandbox.window = sandbox;
  sandbox.ChatRoomCharacter = [sandbox.Player];
  const context = vm.createContext(sandbox);
  vm.runInContext('let MainCanvas = globalThis.__drawing;', context);
  const script = readFileSync(new URL('../dist/main.js', import.meta.url), 'utf8');
  vm.runInContext(script, context);
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(sandbox.Liko[ID].getState().ready, true);
  assert.equal(setting.Identifier, ID);
  assert.equal(handler.Priority, 320);
  setting.load();
  setting.run();
  assert.ok(fields.some((node) => node.innerHTML?.includes('Responsive_Liko')));
  assert.equal(typeof sandbox.MainCanvas.save, 'undefined');
  // The bundle registers the real DOM settings page; full interactions are verified in the preview browser.
  setting.click();
  setting.run();
  setting.unload();
  sandbox.ChatRoomAddCharacterToChatRoom({ MemberNumber: 2, Name: 'Friend' });
  assert.deepEqual(calls, ['Hello Friend', 'Hug Friend']);
  assert.equal(draft, 'draft');
  sandbox.ChatRoomSyncMemberLeave({ SourceMemberNumber: 2 });
  sandbox.ChatRoomAddCharacterToChatRoom({ MemberNumber: 2, Name: 'Friend' });
  assert.equal(calls.length, 2);
  sandbox.Liko[ID].stop();
  assert.equal(intervals.size, 1, 'stop clears the plugin monitor; the shared i18n service remains');
  sandbox.ChatRoomAddCharacterToChatRoom({ MemberNumber: 3, Name: 'Another' });
  assert.equal(calls.length, 2);
  // Re-executing the userscript must not register a second SDK instance or run twice.
  vm.runInContext(script, context);
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(sandbox.bcModSdk.getModsInfo().length, 1);
});
