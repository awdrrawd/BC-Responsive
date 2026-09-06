import { ID } from '../core/model.js';
import { allowedActivity } from '../integrations/catalog.js';
import { checkBCX } from '../integrations/bcx.js';
export function renderText(text, event, host = globalThis) {
  const me = host.Player;
  const other = host.ChatRoomCharacter?.find(c => c.MemberNumber === event.actor) ?? event.actorCharacter;
  const nickname = c => c ? host.CharacterNickname(c) : '?';
  const pronoun = c => {
    const p = c && host.CharacterPronounDescription?.(c);
    return p === 'She/Her' ? ['she', 'her', 'her', 'herself'] : p === 'He/Him' ? ['he', 'his', 'him', 'himself'] : ['they', 'their', 'them', 'themself'];
  };
  const mp = pronoun(me), op = pronoun(other);
  const values = { '{me}': nickname(me), '{self}': nickname(me), '{Self}': nickname(me), '{other}': nickname(other), '{Other}': nickname(other), '%TARGET%': nickname(me), '%SOURCE%': nickname(other), '%name%': nickname(other), '%TARGET_PRONOUN%': mp[0], '%TARGET_POSSESIVE%': mp[1], '%TARGET_INTENSIVE%': mp[2], '%SOURCE_PRONOUN%': op[0], '%SOURCE_POSSESIVE%': op[1], '%SOURCE_INTENSIVE%': other?.MemberNumber === me?.MemberNumber ? op[3] : op[2] };
  return text.replace(/\{(?:me|self|Self|other|Other)\}|%[A-Z_]+%|%name%/g, token => values[token] ?? token);
}
export function createOutput({ store, host = globalThis, owns, report }) {
  const restores = new Set(); const activitySeen = new Map();
  function textMessage(step, event) {
    const text = renderText(step.text, event, host).trim(); if (!text) return;
    if (step.type === 'action') {
      host.ServerSend('ChatRoomChat', { Type: 'Action', Content: `${ID}_Action`, Dictionary: [{ Tag: `MISSING TEXT IN "Interface.csv": ${ID}_Action`, Text: text }] }); return;
    }
    // Never reinterpret imported text as a command. Emotes have their own explicit type.
    if (step.type === 'chat' && /^[\/!*(@.]/.test(text)) { report('Command-like chat skipped; use Emote/Action for narration.'); return; }
    const draft = host.ElementValue('InputChat'); const target = host.ChatRoomTargetMemberNumber;
    const canInterrupt = step.type === 'chat' && store.data.settings.interruption && target < 0 && draft.trim() && !/^[\/!*(@.]|^https?:/i.test(draft.trimStart());
    host.ChatRoomSetTarget(-1);
    try {
      host.ElementValue('InputChat', step.type === 'emote' ? '*' + text : canInterrupt ? draft + '... ' + text : text);
      host.ChatRoomSendChat();
      // A blocked send leaves the input intact; restore the user's original draft then too.
      if (!canInterrupt || host.ElementValue('InputChat').trim()) host.ElementValue('InputChat', draft);
    } catch (error) { host.ElementValue('InputChat', draft); throw error; }
    finally { host.ChatRoomSetTarget(target); }
  }
  function expression(step) {
    if (!owns('expressions')) { report('Expression ownership unavailable'); return; }
    const item = host.InventoryGet(host.Player, step.group);
    if (!item || (step.value && !item.Asset.Group.AllowExpression?.includes(step.value))) return;
    const previous = item.Property?.Expression ?? null;
    // BC's Eyes alias writes both eyes. Snapshot both so restore does not erase a manual right-eye edit.
    const paired = step.group === 'Eyes' ? host.InventoryGet(host.Player, 'Eyes2') : null;
    const pairedPrevious = paired?.Property?.Expression ?? null;
    host.CharacterSetFacialExpression(host.Player, step.group, step.value);
    let timer;
    const restore = () => {
      clearTimeout(timer); restores.delete(restore);
      const current = host.InventoryGet(host.Player, step.group);
      if (current === item && (current.Property?.Expression ?? null) === step.value) host.CharacterSetFacialExpression(host.Player, step.group === 'Eyes' ? 'Eyes1' : step.group, previous);
      if (paired && host.InventoryGet(host.Player, 'Eyes2') === paired && (paired.Property?.Expression ?? null) === step.value) host.CharacterSetFacialExpression(host.Player, 'Eyes2', pairedPrevious);
    };
    timer = setTimeout(restore, step.durationMs); restores.add(restore);
  }
  function animation(step, event) {
    const current = host.InventoryGet(host.Player, step.group);
    const original = current ? { asset: current.Asset?.Name, color: JSON.parse(JSON.stringify(current.Color ?? 'Default')), property: JSON.parse(JSON.stringify(current.Property ?? null)) } : null;
    const timers = [];
    const apply = asset => {
      const item = host.InventoryWear(host.Player, asset, step.group, original?.color ?? 'Default', undefined, undefined, undefined, false);
      if (item && original?.property) item.Property = JSON.parse(JSON.stringify(original.property));
      host.CharacterRefresh(host.Player, false); host.ChatRoomCharacterItemUpdate(host.Player, step.group);
    };
    const restore = () => {
      timers.forEach(timer => (host.clearTimeout ?? clearTimeout)(timer)); restores.delete(restore);
      if (original?.asset) { const item = host.InventoryWear(host.Player, original.asset, step.group, original.color, undefined, undefined, undefined, false); if (item && original.property) item.Property = original.property; }
      else host.InventoryRemove?.(host.Player, step.group, false);
      host.CharacterRefresh(host.Player, false); host.ChatRoomCharacterItemUpdate(host.Player, step.group);
    };
    restores.add(restore);
    const later = host.setTimeout ?? setTimeout, interval = step.durationMs / step.count;
    for (let i = 0; i < step.count; i++) timers.push(later(() => apply(i % 2 === 0 ? step.assetB : step.assetA), Math.round(i * interval)));
    timers.push(later(() => { apply(step.assetA); restores.delete(restore); }, step.durationMs));
    if (step.text.trim()) {
      const message = { type: step.messageType, text: step.text }, check = checkBCX(message, store.data.settings.bcx, host);
      if (check.allowed) textMessage(message, event); else report(check.reason);
    }
  }
  return {
    clear() { [...restores].forEach(fn => fn()); activitySeen.clear(); },
    execute(step, event) {
      const check = checkBCX(step, store.data.settings.bcx, host);
      if (!check.allowed) { report(check.reason); return; }
      if (['chat', 'emote', 'action'].includes(step.type)) return textMessage(step, event);
      if (step.type === 'expression') return expression(step);
      if (step.type === 'animation') return animation(step, event);
      if (step.type === 'activity') {
        const target = host.ChatRoomCharacter.find(c => c.MemberNumber === event.actor);
        if (!target || event.event === 'leave') return;
        const key = `${event.room}|${event.actor}|${step.group}|${step.activity}`;
        const time = Date.now(); for (const [k, expires] of activitySeen) if (expires <= time) activitySeen.delete(k);
        if (activitySeen.has(key)) return;
        const activity = allowedActivity(target, step.activity, step.group, host);
        if (!activity) { report(`Unavailable activity: ${step.activity}`); return; }
        // Per recipient/action circuit breaker; no global cooldown across different people.
        activitySeen.set(key, time + 5000);
        host.ActivityRun(host.Player, target, host.ActivityGetGroupOrMirror(host.Player.AssetFamily, step.group), activity);
      }
    }
  };
}
