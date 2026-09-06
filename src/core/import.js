import { clone, object, persona, rule, uid, validatePersona } from './model.js';

function decode(text, lz) {
  if (typeof text !== 'string' || !text.trim() || text.length > 1000000) throw new Error('Invalid import size');
  try { return JSON.parse(text); } catch { /* compressed legacy export */ }
  const decoded = lz?.decompressFromBase64(text.trim());
  if (!decoded || decoded.length > 4000000) throw new Error('Invalid import data');
  return JSON.parse(decoded);
}
function step(message) {
  if (!object(message) || !['message', 'action'].includes(message.type) || typeof message.content !== 'string') throw new Error('Invalid legacy message');
  return { type: message.type === 'action' ? 'action' : 'chat', text: message.content };
}
export function importPersonas(text, lz = globalThis.LZString) {
  const raw = decode(text, lz); const warnings = []; let format; let list;
  if (raw?.format === 'Responsive_Liko' && raw.schemaVersion === 1) {
    list = raw.personas; format = 'Responsive_Liko';
  } else if (object(raw) && Array.isArray(raw.rules)) {
    list = [raw]; format = 'Responsive_Liko';
  } else if (object(raw) && (Array.isArray(raw.responses) || Array.isArray(raw.personalities))) {
    format = 'BCResponsive';
    list = (raw.personalities ?? [raw]).filter(Boolean).map(old => {
      const p = persona(old.name); p.blackList = old.blackList ?? [];
      if (!old.blackList) warnings.push('legacyBlacklist');
      p.rules = old.responses.map(item => {
        if (!object(item) || !object(item.trigger) || !Array.isArray(item.messages)) throw new Error('Invalid legacy rule');
        const t = item.trigger; const r = rule(); r.name = item.name; r.enabled = item.enabled ?? true;
        r.trigger = { kind: t.mode, members: t.allow_ids ?? [] };
        if (t.mode === 'activity') Object.assign(r.trigger, { activities: t.allow_activities ?? [], groups: t.allow_bodyparts ?? [], self: true, matchNone: t.allow_activities?.length === 0 || t.allow_bodyparts?.length === 0 });
        if (t.mode === 'orgasm') r.trigger.outcome = t.type ?? 'Orgasmed';
        if (t.mode === 'event') { r.trigger.event = t.event?.toLowerCase(); r.delayMs = t.event === 'Join' ? 5000 : 0; }
        if (t.mode === 'spicer') {
          Object.assign(r.trigger, { min: t.min_arousal, max: t.max_arousal });
          if (t.apply_favorite) { r.legacy = { apply_favorite: true }; warnings.push('legacyFavorite'); }
        }
        r.choices = item.messages.map(m => ({ id: uid(), steps: [step(m)] }));
        return r;
      });
      return p;
    });
  } else if (object(raw) && (raw.ResponsesModule || raw.data?.ResponsesModule || Array.isArray(raw.mainResponses))) {
    format = 'Responsive-main'; const data = raw.data ?? raw; const source = data.ResponsesModule ?? data; const p = persona(raw.name || 'Responsive');
    const makeSteps = text => {
      if (typeof text !== 'string') throw new Error('Invalid response');
      const trimmed = text.trim();
      if (trimmed.startsWith('@@')) return [{ type: 'action', text: '{me} ' + trimmed.slice(2) }];
      if (trimmed.startsWith('@')) return [{ type: 'action', text: trimmed.slice(1) }];
      if (trimmed.startsWith('*')) return [{ type: 'emote', text: trimmed.replace(/^\*{1,2}/, '') }];
      return [{ type: 'chat', text }];
    };
    p.rules = (source.mainResponses ?? []).map(old => {
      const r = rule(); r.name = old.actName;
      r.trigger = { kind: 'activity', activities: [old.actName], groups: old.groupName, members: [], self: old.selfTrigger ?? false };
      r.choices = old.responses.map(s => ({ id: uid(), steps: makeSteps(s) })); return r;
    });
    for (const [key, messages] of Object.entries(source.extraResponses ?? {})) {
      const r = rule(); r.name = key;
      r.trigger = key === 'orgasm' ? { kind: 'orgasm', outcome: 'Orgasmed' } : { kind: 'spicer' };
      if (key !== 'orgasm') { r.enabled = false; warnings.push('legacyUnusedExtras'); }
      r.choices = messages.map(s => ({ id: uid(), steps: makeSteps(s) })); p.rules.push(r);
    }
    if (data.GlobalModule) warnings.push('legacyGlobal');
    list = [p];
  } else throw new Error('Unknown import format');
  if (!Array.isArray(list) || !list.length) throw new Error('No personas in import');
  const personas = list.map(p => { const copy = validatePersona(p); copy.id = uid(); copy.rules.forEach(r => { r.id = uid(); }); return copy; });
  return { format, personas, warnings: [...new Set(warnings)] };
}
export function exportPersona(p, lz = globalThis.LZString) {
  if (!lz?.compressToBase64) throw new Error('Base64 compressor unavailable');
  return lz.compressToBase64(JSON.stringify({ format: 'Responsive_Liko', schemaVersion: 1, personas: [clone(p)] }));
}
