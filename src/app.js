import 'bondage-club-mod-sdk';
import LZString from 'lz-string';
import { ID, VERSION } from './core/model.js';
import { createStore } from './core/store.js';
import { createAPI } from './core/api.js';
import { createScheduler } from './core/engine.js';
import { initI18n } from './core/i18n.js';
import { createOutput } from './features/output.js';
import { createMouth } from './features/mouth.js';
import { installSpeech } from './features/speech.js';
import { installEvents } from './integrations/events.js';
import { installSettings } from './ui/dom-settings.js';

export function start(namespace, host = globalThis) {
  host.LZString ??= LZString;
  const sdk = host.bcModSdk.registerMod({ name: ID, fullName: ID, version: VERSION, repository: 'https://github.com/awdrrawd/BC-Responsive' });
  const store = createStore(host); const coordination = createAPI(namespace, store, host); const t = initI18n(host);
  namespace.refresh = () => coordination.refresh();
  let output, scheduler, mouth, events, ui; let stopped = false; let account; let lastScreen;
  const report = message => { namespace.lastDiagnostic = String(message); console.warn(ID, message); };
  function reset() { scheduler?.cancel(); mouth?.clear(); output?.clear(); }
  namespace.stop = () => { stopped = true; reset(); coordination.setReady(false); coordination.refresh(); ui?.close(); };
  const ready = () => host.Player?.MemberNumber !== undefined && host.Player.ExtensionSettings && ['PreferenceRegisterExtensionSetting', 'ChatRoomRegisterMessageHandler', 'CommonDrawAppearanceBuild', 'ChatRoomSync', 'ChatRoomAddCharacterToChatRoom', 'ChatRoomSyncMemberLeave'].every(k => typeof host[k] === 'function');
  function initialize() {
    if (stopped) return;
    if (!ready()) { setTimeout(initialize, 500); return; }
    try {
      store.load(); account = host.Player.MemberNumber;
      installSpeech({ sdk, store, host, enabled: () => !stopped && store.loaded && store.data.settings.enabled && host.Player.MemberNumber === account });
      output = createOutput({ store, host, owns: coordination.owns, report });
      mouth = createMouth({ sdk, owns: coordination.owns, host });
      const valid = event => !stopped && store.loaded && store.data.settings.enabled && store.data.settings.reactions && host.CurrentScreen === 'ChatRoom' && host.Player.MemberNumber === account && event.room === events.roomKey() && !host.Player.GhostList?.includes(event.actor) && (event.event === 'leave' || host.ChatRoomCharacter.some(c => c.MemberNumber === event.actor));
      scheduler = createScheduler({ active: () => store.active, valid, execute: output.execute, report });
      events = installEvents({ sdk, submit: e => scheduler.submit(e), mouth, reset, host });
      ui = installSettings({ store, api: namespace, t, host });
      store.subscribe(() => { reset(); coordination.refresh(); });
      coordination.setReady(true); coordination.refresh();
      // Detect an old LCE loading later, leaving the room, or switching accounts.
      setInterval(() => {
        if (stopped) return;
        try {
          if (lastScreen !== host.CurrentScreen) { reset(); lastScreen = host.CurrentScreen; }
          if (account !== host.Player?.MemberNumber) {
            reset(); coordination.setReady(false); coordination.refresh();
            if (ready()) { store.load(); account = host.Player.MemberNumber; coordination.setReady(true); }
          }
          const before = namespace.getState().capabilities; coordination.refresh();
          if (before.mouth && !coordination.owns('mouth')) mouth.clear();
          if (before.expressions && !coordination.owns('expressions')) output.clear();
        } catch (error) { report(error); }
      }, 500);
      console.info(`${ID} ${VERSION} ready`);
    } catch (error) { reset(); coordination.setReady(false); coordination.refresh(); report(error); }
  }
  initialize();
}
