import { ID } from '../core/model.js';
export function checkBCX(step, enabled, host = globalThis) {
  if (!enabled || !host.bcx) return { allowed: true };
  try {
    const api = host.bcx.getModApi?.(ID);
    if (!api?.getRuleState) return { allowed: false, reason: 'BCX API unavailable' };
    // Conservative preflight. BCX still receives normal hooks and handles its own enforcement.
    const names = step.type === 'chat'
      ? ['speech_forbid_open_talking', 'speech_limit_open_talking', 'speech_specific_sound', 'speech_mandatory_words', 'greet_room_order']
      : step.type === 'emote' || step.type === 'action'
        ? ['speech_forbid_emotes', 'greet_room_order']
        : step.type === 'expression' && step.group === 'Emoticon' ? ['block_changing_emoticon'] : [];
    for (const name of names) {
      const state = api.getRuleState(name);
      if (state?.inEffect && state.isEnforced) return { allowed: false, reason: `BCX: ${name}` };
    }
    return { allowed: true };
  } catch { return { allowed: false, reason: 'BCX preflight failed' }; }
}
