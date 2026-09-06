export function matches(rule, event) {
  const t = rule.trigger;
  if (!rule.enabled || t.matchNone || t.kind !== event.kind) return false;
  if (t.members?.length && !t.members.includes(event.actor)) return false;
  if (t.kind === 'activity') {
    if (t.activities?.length && !t.activities.includes(event.activity)) return false;
    if (t.groups?.length && !t.groups.includes(event.group)) return false;
  }
  if (t.kind === 'event' && (t.event !== event.event || (t.roomMode === 'named' && !t.roomNames.some(name => name.toLocaleLowerCase() === String(event.roomName ?? '').toLocaleLowerCase())))) return false;
  if (t.kind === 'orgasm' && t.outcome !== 'Any' && t.outcome !== event.outcome) return false;
  const arousal = event.selfArousal;
  if (t.min !== undefined && (arousal ?? 0) < t.min) return false;
  if (t.max !== undefined && (arousal ?? 0) > t.max) return false;
  return true;
}
export function selectResponse(persona, event, random = Math.random) {
  if (!persona || (persona.listMode === 'whitelist' ? !persona.whiteList.includes(event.actor) : persona.blackList.includes(event.actor))) return null;
  const pool = persona.rules.filter(r => matches(r, event)).flatMap(r => r.choices.filter(c => c.steps.length).map(choice => ({ rule: r, choice })));
  if (!pool.length) return null;
  const selected = pool[Math.min(pool.length - 1, Math.floor(random() * pool.length))];
  const steps = selected.choice.steps.map(s => ({ ...s }));
  if (event.kind === 'activity') {
    const prefixes = persona.rules.filter(r => matches(r, { ...event, kind: 'spicer' })).flatMap(r => r.choices.flatMap(c => c.steps.filter(s => s.type === 'chat')));
    if (prefixes.length) {
      const chat = steps.find(s => s.type === 'chat');
      if (chat) chat.text = prefixes[Math.floor(random() * prefixes.length)].text + ' ' + chat.text;
    }
  }
  return { ...selected, steps };
}
export function createScheduler({ active, execute, valid, now = Date.now, random = Math.random, setTimer = setTimeout, clearTimer = clearTimeout, report = console.warn }) {
  const timers = new Set(); const seen = new Map(); let generation = 0;
  const keyFor = (r, e) => `${e.room}|${e.actor}|${r.id}`;
  return {
    cancel() { generation++; timers.forEach(clearTimer); timers.clear(); seen.clear(); },
    submit(event) {
      const p = active(); if (!p || !valid(event)) return false;
      const time = now(); for (const [key, expires] of seen) if (expires <= time) seen.delete(key);
      // Filter duplicate rules before drawing, so a blocked choice doesn't hide eligible alternatives.
      const eligible = { ...p, rules: p.rules.filter(r => !seen.has(keyFor(r, event))) };
      const selected = selectResponse(eligible, event, random); if (!selected) return false;
      const key = keyFor(selected.rule, event);
      seen.set(key, time + selected.rule.delayMs + selected.rule.dedupeMs);
      const token = generation;
      const run = () => {
        if (token !== generation || !valid(event)) return;
        for (const step of selected.steps) {
          if (token !== generation || !valid(event)) break;
          try { execute(step, event); } catch (error) { report(error); }
        }
      };
      if (selected.rule.delayMs) { const timer = setTimer(() => { timers.delete(timer); run(); }, selected.rule.delayMs); timers.add(timer); }
      else run();
      return true;
    }
  };
}
