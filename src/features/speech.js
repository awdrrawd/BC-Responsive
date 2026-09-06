// Modify outgoing speech before BC performs its usual speech processing.
export function petSpeech(text, phrases, severity, random = Math.random) {
  phrases = phrases.map(x => x.trim()).filter(Boolean);
  if (!phrases.length || !text.trim() || /^[\/!*(@.]/.test(text.trimStart()) || /https?:\/\//i.test(text)) return text;
  const chars = [...text], letters = chars.map((c, i) => /[\p{L}\p{N}]/u.test(c) ? i : -1).filter(i => i >= 0);
  if (!letters.length) return text;
  const pick = () => phrases[Math.min(phrases.length - 1, Math.floor(random() * phrases.length))];
  const budget = Math.min(3, Math.max(1, Math.ceil(letters.length / 6)));
  const edits = new Map();
  if (severity === 'addicted') {
    const candidates = [...letters];
    const count = Math.min(letters.length, letters.length < 6 ? 1 : 1 + Math.floor(random() * 2));
    for (let i = 0; i < count; i++) { const [at] = candidates.splice(Math.floor(random() * candidates.length), 1); chars[at] = pick(); }
    if (letters.length < 6) return chars.join('');
  }
  const end = letters.at(-1) + 1;
  if (severity === 'weak' || severity === 'medium') edits.set(end, pick());
  const count = severity === 'weak' ? 0 : severity === 'medium' ? (budget > 1 && random() < .5 ? 1 : 0) : budget;
  const positions = letters.slice(0, -1).map(i => i + 1);
  if (!positions.length && !edits.size) edits.set(end, pick());
  for (let i = 0; i < count && positions.length; i++) { const [at] = positions.splice(Math.floor(random() * positions.length), 1); edits.set(at, pick()); }
  return chars.map((c, i) => c + (edits.get(i + 1) ?? '')).join('');
}

export function installSpeech({ sdk, store, enabled, host = globalThis, random = Math.random }) {
  sdk.hookFunction('ChatRoomSendChat', 9, (args, next) => {
    if (!enabled() || host.CurrentScreen !== 'ChatRoom') return next(args);
    const original = host.ElementValue('InputChat');
    const channel = host.ChatRoomTargetMemberNumber >= 0 ? 'whisper' : 'chat';
    const rules = store.active.rules.filter(r => r.enabled && r.trigger.kind === 'speech' && !r.trigger.matchNone &&
      (r.trigger.channel === 'all' || r.trigger.channel === channel));
    // Pick one applicable rule so overlapping rules cannot multiply insertions.
    const rule = rules[Math.floor(random() * rules.length)];
    if (!rule || random() * 100 >= rule.trigger.chance) return next(args);
    const changed = petSpeech(original, rule.choices.flatMap(c => c.steps.filter(s => s.type === 'chat').map(s => s.text)), rule.trigger.severity, random);
    host.ElementValue('InputChat', changed);
    try { return next(args); }
    finally { if (host.ElementValue('InputChat') === changed) host.ElementValue('InputChat', original); }
  });
}
