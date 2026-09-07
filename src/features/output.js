import { ID } from '../core/model.js';
import { allowedActivity } from '../integrations/catalog.js';
import { checkBCX } from '../integrations/bcx.js';
import { snapshotItem, wearState, animationState } from './appearance.js';
export function renderText(text, event, host = globalThis) {
  const me = host.Player;
  const other = host.ChatRoomCharacter?.find((c) => c.MemberNumber === event.actor) ?? event.actorCharacter;
  const nickname = (c) => (c ? host.CharacterNickname(c) : '?');
  const pronoun = (c) => {
    const p = c && host.CharacterPronounDescription?.(c);
    return p === 'She/Her'
      ? ['she', 'her', 'her', 'herself']
      : p === 'He/Him'
        ? ['he', 'his', 'him', 'himself']
        : ['they', 'their', 'them', 'themself'];
  };
  const mp = pronoun(me),
    op = pronoun(other);
  const values = {
    '{me}': nickname(me),
    '{self}': nickname(me),
    '{Self}': nickname(me),
    '{other}': nickname(other),
    '{Other}': nickname(other),
    '%TARGET%': nickname(me),
    '%SOURCE%': nickname(other),
    '%name%': nickname(other),
    '%TARGET_PRONOUN%': mp[0],
    '%TARGET_POSSESIVE%': mp[1],
    '%TARGET_INTENSIVE%': mp[2],
    '%SOURCE_PRONOUN%': op[0],
    '%SOURCE_POSSESIVE%': op[1],
    '%SOURCE_INTENSIVE%': other?.MemberNumber === me?.MemberNumber ? op[3] : op[2],
  };
  return text.replace(
    /\{(?:me|self|Self|other|Other)\}|%[A-Z_]+%|%name%/g,
    (token) => values[token] ?? token,
  );
}
export function createOutput({ store, host = globalThis, owns, report }) {
  const restores = new Set();
  const activitySeen = new Map();
  const animations = new Map();
  function textMessage(step, event) {
    const text = renderText(step.text, event, host).trim();
    if (!text) return;
    if (step.type === 'action') {
      host.ServerSend('ChatRoomChat', {
        Type: 'Action',
        Content: `${ID}_Action`,
        Dictionary: [{ Tag: `MISSING TEXT IN "Interface.csv": ${ID}_Action`, Text: text }],
      });
      return;
    }
    // Never reinterpret imported text as a command. Emotes have their own explicit type.
    if (step.type === 'chat' && /^[\/!*(@.]/.test(text)) {
      report('Command-like chat skipped; use Emote/Action for narration.');
      return;
    }
    // BC clears InputChat before sending its leave packet. Keep native speech
    // restrictions/transforms, but do not depend on that deleted DOM element.
    if (event.kind === 'event' && event.event === 'leave') {
      if (step.type === 'chat' && typeof host.ChatRoomSendChatMessage === 'function')
        return host.ChatRoomSendChatMessage(text);
      if (step.type === 'emote' && typeof host.ChatRoomSendEmote === 'function')
        return host.ChatRoomSendEmote('*' + text);
    }
    const draft = host.ElementValue('InputChat');
    const target = host.ChatRoomTargetMemberNumber;
    const canInterrupt =
      step.type === 'chat' &&
      store.data.settings.interruption &&
      target < 0 &&
      draft.trim() &&
      !/^[\/!*(@.]|^https?:/i.test(draft.trimStart());
    host.ChatRoomSetTarget(-1);
    try {
      host.ElementValue(
        'InputChat',
        step.type === 'emote' ? '*' + text : canInterrupt ? draft + '... ' + text : text,
      );
      host.ChatRoomSendChat();
      // A blocked send leaves the input intact; restore the user's original draft then too.
      if (!canInterrupt || host.ElementValue('InputChat').trim()) host.ElementValue('InputChat', draft);
    } catch (error) {
      host.ElementValue('InputChat', draft);
      throw error;
    } finally {
      host.ChatRoomSetTarget(target);
    }
  }
  function expression(step) {
    if (!owns('expressions')) {
      report('Expression ownership unavailable');
      return;
    }
    const item = host.InventoryGet(host.Player, step.group);
    if (!item || (step.value && !item.Asset.Group.AllowExpression?.includes(step.value))) return;
    const previous = item.Property?.Expression ?? null;
    // BC's Eyes alias writes both eyes. Snapshot both so restore does not erase a manual right-eye edit.
    const paired = step.group === 'Eyes' ? host.InventoryGet(host.Player, 'Eyes2') : null;
    const pairedPrevious = paired?.Property?.Expression ?? null;
    host.CharacterSetFacialExpression(host.Player, step.group, step.value);
    let timer;
    const restore = () => {
      clearTimeout(timer);
      restores.delete(restore);
      const current = host.InventoryGet(host.Player, step.group);
      if (current === item && (current.Property?.Expression ?? null) === step.value)
        host.CharacterSetFacialExpression(
          host.Player,
          step.group === 'Eyes' ? 'Eyes1' : step.group,
          previous,
        );
      if (
        paired &&
        host.InventoryGet(host.Player, 'Eyes2') === paired &&
        (paired.Property?.Expression ?? null) === step.value
      )
        host.CharacterSetFacialExpression(host.Player, 'Eyes2', pairedPrevious);
    };
    timer = setTimeout(restore, step.durationMs);
    restores.add(restore);
  }
  function animation(step, event) {
    const groups = step.tracks?.map((track) => track.group) ?? [step.group];
    for (const group of groups) animations.get(group)?.();
    const originals = groups.map((group) => snapshotItem(host.InventoryGet(host.Player, group)));
    // Convert legacy input once, then use the same scheduler and restoration path.
    const tracks = step.tracks ?? [
      {
        group: step.group,
        stateA: { ...originals[0], asset: step.assetA },
        stateB: { ...originals[0], asset: step.assetB },
      },
    ];
    const timers = [],
      later = host.setTimeout ?? setTimeout;
    let finished = false;
    function cleanup() {
      finished = true;
      timers.forEach((timer) => (host.clearTimeout ?? clearTimeout)(timer));
      restores.delete(restore);
      for (const group of groups) if (animations.get(group) === restore) animations.delete(group);
    }
    function apply(states) {
      tracks.forEach((track, i) => wearState(host, track.group, states[i]));
      // Rebuild the character once per frame, even for three tracks.
      host.CharacterRefresh(host.Player, false);
      tracks.forEach((track) => host.ChatRoomCharacterItemUpdate(host.Player, track.group));
    }
    function restore() {
      if (finished) return;
      cleanup();
      // An unavailable asset must not prevent the remaining groups from restoring.
      tracks.forEach((track, i) => {
        try {
          wearState(host, track.group, originals[i]);
        } catch (error) {
          report(error);
        }
      });
      host.CharacterRefresh(host.Player, false);
      tracks.forEach((track) => host.ChatRoomCharacterItemUpdate(host.Player, track.group));
    }
    function frame(states, last = false) {
      if (finished) return;
      try {
        apply(states);
        if (last) cleanup();
      } catch (error) {
        report(error);
        restore();
      }
    }
    restores.add(restore);
    groups.forEach((group) => animations.set(group, restore));
    for (let i = 0; i < step.count; i++)
      timers.push(
        later(
          () => frame(tracks.map((track) => animationState(track, i % 2 ? 'A' : 'B'))),
          Math.round(i * (step.intervalMs ?? step.durationMs / step.count)),
        ),
      );
    timers.push(
      later(
        () =>
          frame(
            tracks.map((track) => track.stateA),
            true,
          ),
        Math.round(step.count * (step.intervalMs ?? step.durationMs / step.count)),
      ),
    );
    if (step.text.trim()) {
      const message = { type: step.messageType, text: step.text };
      const check = checkBCX(message, store.data.settings.bcx, host);
      if (check.allowed) textMessage(message, event);
      else report(check.reason);
    }
  }

  return {
    clear() {
      for (const restore of [...restores]) {
        try {
          restore();
        } catch (error) {
          report(error);
        }
      }
      activitySeen.clear();
    },
    execute(step, event) {
      const check = checkBCX(step, store.data.settings.bcx, host);
      if (!check.allowed) {
        report(check.reason);
        return;
      }
      if (['chat', 'emote', 'action'].includes(step.type)) return textMessage(step, event);
      if (step.type === 'expression') return expression(step);
      if (step.type === 'animation') return animation(step, event);
      if (step.type === 'activity') {
        const target = host.ChatRoomCharacter.find((c) => c.MemberNumber === event.actor);
        if (!target || event.event === 'leave') return;
        const key = `${event.room}|${event.actor}|${step.group}|${step.activity}`;
        const time = Date.now();
        for (const [k, expires] of activitySeen) if (expires <= time) activitySeen.delete(k);
        if (activitySeen.has(key)) return;
        const activity = allowedActivity(target, step.activity, step.group, host);
        if (!activity) {
          report(`Unavailable activity: ${step.activity}`);
          return;
        }
        // Per recipient/action circuit breaker; no global cooldown across different people.
        activitySeen.set(key, time + 5000);
        host.ActivityRun(
          host.Player,
          target,
          host.ActivityGetGroupOrMirror(host.Player.AssetFamily, step.group),
          activity,
        );
      }
    },
  };
}
