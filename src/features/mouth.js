import { hscExpressionGroups, lceFeatureEnabled } from '../integrations/compat.js';
export function createMouth({ sdk, owns, host = globalThis }) {
  const animations = new Map();
  const mouthOn = () => owns('mouth') && !lceFeatureEnabled('autoMouthOnTalk', host);
  const refresh = (c) => host.CharacterRefresh(c, false);
  // Hypnosis controls only the player's own face; other people's mouths keep animating.
  const hscHoldsMouth = (c) =>
    c?.MemberNumber !== undefined &&
    c.MemberNumber === host.Player?.MemberNumber &&
    hscExpressionGroups(host).has('Mouth');
  function clear() {
    for (const { timer } of animations.values()) clearTimeout(timer);
    const chars = [...animations.values()].map((v) => v.character);
    animations.clear();
    chars.forEach(refresh);
  }
  sdk.hookFunction('CommonDrawAppearanceBuild', 0, (args, next) => {
    if (!mouthOn() || hscHoldsMouth(args[0])) return next(args);
    const state = animations.get(args[0]?.MemberNumber);
    if (!state) return next(args);
    const item = host.InventoryGet(args[0], 'Mouth');
    if (!item) return next(args);
    const property = item.Property;
    const hadExpression = property && Object.hasOwn(property, 'Expression');
    const previous = property?.Expression;
    item.Property ??= {};
    item.Property.Expression = state.value;
    try {
      return next(args);
    } finally {
      if (!property) delete item.Property;
      else if (!hadExpression) delete item.Property.Expression;
      else item.Property.Expression = previous;
    }
  });
  return {
    clear,
    receive(data, sender, message) {
      if (
        !mouthOn() ||
        data.Type !== 'Chat' ||
        data.Target != null ||
        !sender ||
        hscHoldsMouth(sender) ||
        !message?.trim() ||
        /^[\/!*(@.]|^https?:/i.test(message.trimStart())
      )
        return;
      const existing = animations.get(sender.MemberNumber);
      if (existing) clearTimeout(existing.timer);
      const frames = Array.from(message).slice(0, 40);
      let index = 0;
      const state = { character: sender, value: null, timer: null };
      animations.set(sender.MemberNumber, state);
      const run = () => {
        if (
          !mouthOn() ||
          hscHoldsMouth(sender) ||
          host.CurrentScreen !== 'ChatRoom' ||
          !host.ChatRoomCharacter.includes(sender) ||
          index >= frames.length
        ) {
          animations.delete(sender.MemberNumber);
          refresh(sender);
          return;
        }
        const char = frames[index++];
        const value = /[\s,.!?，。！？]/.test(char) ? null : index % 2 ? 'Open' : 'HalfOpen';
        const item = host.InventoryGet(sender, 'Mouth');
        state.value = !value || item?.Asset.Group.AllowExpression?.includes(value) ? value : null;
        refresh(sender);
        state.timer = setTimeout(run, value ? 160 : 280);
      };
      run();
    },
  };
}
