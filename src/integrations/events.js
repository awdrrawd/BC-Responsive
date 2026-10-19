import { ID } from '../core/model.js';

export function installEvents({ sdk, submit, mouth, reset, host = globalThis }) {
  let syncing = 0,
    roomEpoch = 0;
  let leavingEvent;
  let sendingLeave = false;
  let lastRoomName = host.ChatRoomData?.Name ?? '';
  const roomName = () => host.ChatRoomData?.Name ?? lastRoomName;
  const roomKey = () => (sendingLeave ? leavingEvent.room : `${roomName()}:${roomEpoch}`);
  const event = (kind, actorCharacter, fields = {}) => ({
    kind,
    room: roomKey(),
    roomName: roomName(),
    self: host.Player.MemberNumber,
    actor: actorCharacter?.MemberNumber,
    actorCharacter,
    actorArousal: actorCharacter?.ArousalSettings?.Progress ?? 0,
    selfArousal: host.Player.ArousalSettings?.Progress ?? 0,
    ...fields,
  });
  const handler = {
    Description: 'Responsive_Liko: reactions and speech',
    Priority: 320,
    Callback(data, sender, message, metadata) {
      try {
        mouth.receive(data, sender, message);
        if (host.CurrentScreen !== 'ChatRoom' || host.Player.GhostList?.includes(sender?.MemberNumber))
          return false;
        if (data.Type === 'Activity' && sender?.MemberNumber === host.Player.MemberNumber) {
          const key = data.Content;
          const outcome = /^Orgasm\d+$/.test(key)
            ? 'Orgasmed'
            : /^OrgasmFailResist\d+$/.test(key)
              ? 'Resisted'
              : /^OrgasmFail(?:Timeout|Surrender)\d+$/.test(key)
                ? 'Ruined'
                : null;
          if (outcome) submit(event('orgasm', host.Player, { outcome }));
        }
        if (
          data.Type === 'Activity' &&
          !data.Dictionary?.some((entry) => entry.Tag === `${ID}_AutoActivity` && entry.Text === '1') &&
          metadata?.TargetCharacter?.MemberNumber === host.Player.MemberNumber &&
          metadata.ActivityName &&
          metadata.GroupName &&
          sender
        ) {
          submit(event('activity', sender, { activity: metadata.ActivityName, group: metadata.GroupName }));
        }
      } catch (e) {
        console.warn('Responsive_Liko event', e);
      }
      return false;
    },
  };
  host.ChatRoomRegisterMessageHandler(handler);
  sdk.hookFunction('ChatRoomSync', 0, (args, next) => {
    const data = args[0];
    // BC ignores a malformed payload before touching its room state, so it is not a room change here either.
    if (!data || typeof data !== 'object' || typeof data.SourceMemberNumber !== 'number') return next(args);
    lastRoomName = args[0]?.Name ?? host.ChatRoomData?.Name ?? '';
    syncing++;
    roomEpoch++;
    reset();
    try {
      const result = next(args);
      const joined = () => {
        syncing--;
        // BC rejects invalid or duplicate rooms by leaving again; only an accepted room (the same object) is a join.
        if (host.CurrentScreen === 'ChatRoom' && host.ChatRoomData === data)
          submit(event('event', host.Player, { event: 'join' }));
      };
      if (result?.then)
        return result.then(
          (value) => {
            joined();
            return value;
          },
          (error) => {
            syncing--;
            throw error;
          },
        );
      joined();
      return result;
    } catch (e) {
      syncing--;
      throw e;
    }
  });
  sdk.hookFunction('ChatRoomAddCharacterToChatRoom', 0, (args, next) => {
    const existed = host.ChatRoomCharacter.some((c) => c.MemberNumber === args[0]?.MemberNumber);
    const result = next(args);
    const c = host.ChatRoomCharacter.find((c) => c.MemberNumber === args[0]?.MemberNumber);
    if (
      !syncing &&
      !existed &&
      c &&
      c.MemberNumber !== host.Player.MemberNumber &&
      host.CurrentScreen === 'ChatRoom'
    )
      submit(event('event', c, { event: 'visitor' }));
    return result;
  });
  if (typeof host.ChatRoomAttemptLeave === 'function')
    sdk.hookFunction('ChatRoomAttemptLeave', 0, (args, next) => {
      // BC returns early when the player cannot leave (leashed, cannot walk, locked room...): no leave attempt happens.
      if (
        host.CurrentScreen === 'ChatRoom' &&
        host.Player?.IsSlow?.() &&
        !host.ChatRoomSlowtimer &&
        host.ChatRoomCanLeave?.() !== false
      )
        submit(event('event', host.Player, { event: 'slowLeave' }));
      return next(args);
    });
  if (typeof host.ChatRoomLeave === 'function')
    sdk.hookFunction('ChatRoomLeave', 0, (args, next) => {
      if (host.CurrentScreen === 'ChatRoom' && host.Player) {
        leavingEvent = event('event', host.Player, { event: 'leave' });
      }
      try {
        return next(args);
      } finally {
        leavingEvent = undefined;
      }
    });
  if (typeof host.ServerSend === 'function')
    sdk.hookFunction('ServerSend', 1, (args, next) => {
      if (args[0] === 'ChatRoomLeave' && !sendingLeave) {
        const captured = leavingEvent;
        leavingEvent ??=
          host.CurrentScreen === 'ChatRoom' && host.Player
            ? event('event', host.Player, { event: 'leave' })
            : undefined;
        if (leavingEvent) {
          sendingLeave = true;
          try {
            submit(leavingEvent);
          } catch (error) {
            console.warn('Responsive_Liko leave event', error);
          } finally {
            sendingLeave = false;
            leavingEvent = captured;
          }
        }
      }
      return next(args);
    });
  return { roomKey };
}
