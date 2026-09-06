import { ID, clone, persona, rule, uid, validatePersona } from '../core/model.js';
import { importPersonas, exportPersona } from '../core/import.js';
import preferenceIcon from '../../assets/preference-icon.svg';
import exitIcon from '../../assets/exit-icon.svg';
import { activitiesForGroup, bodyZones, catalog } from '../integrations/catalog.js';
import { drawingContext } from './canvas.js';

export function installSettings({ store, api, t, host = globalThis }) {
  let page = 'home', index = 0, draft, advanced = false, pending, status = '', buttons = [], inputs = new Map(), catalogRows = [], catalogPage = 0;
  let personaDeleteMode = false, pickerReturn = 'editor', pickerGroup = '', pickerRows = [], pickerPage = 0, pickerSelected = new Set(), responseDeleteMode = false;
  const get = id => inputs.get(id)?.node.value ?? '';
  const removeInputs = () => { inputs.forEach(({ node }) => node.remove()); inputs.clear(); };
  function go(next) { removeInputs(); page = next; status = ''; pending = null; }
  function input(id, value, rect, multiline = false, readonly = false) {
    if (!inputs.has(id)) {
      const node = document.createElement(multiline ? 'textarea' : 'input');
      node.id = `${ID}_${id}`; node.value = value; node.readOnly = readonly;
      node.setAttribute('aria-label', t(id));
      node.style.cssText = 'position:fixed;box-sizing:border-box;background:white;color:black;border:2px solid #777;border-radius:5px;padding:8px;z-index:10;resize:none;';
      document.body.appendChild(node); inputs.set(id, { node, rect });
    }
    inputs.get(id).rect = rect;
    const canvas = drawingContext(host).canvas; const b = canvas.getBoundingClientRect(); const [x, y, w, h] = rect; const node = inputs.get(id).node;
    Object.assign(node.style, { left: b.left + x * b.width / 2000 + 'px', top: b.top + y * b.height / 1000 + 'px', width: w * b.width / 2000 + 'px', height: h * b.height / 1000 + 'px', font: `${Math.max(12, 25 * b.width / 2000)}px sans-serif` });
    return node;
  }
  function text(value, x, y, width = 1500, color = '#222', size = 28) {
    const ctx = drawingContext(host); ctx.save(); ctx.font = `${size}px sans-serif`; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillStyle = color; ctx.fillText(String(value), x, y, width); ctx.restore();
  }
  function button(label, x, y, w, action, enabled = true, image = '', h = 60, color = 'White') {
    host.DrawButton(x, y, w, h, label, enabled ? color : '#ddd', image);
    buttons.push({ x, y, w, h, action, enabled });
  }
  function exit() {
    if (page === 'home') { removeInputs(); host.PreferenceSubscreenExtensionsClear?.(); }
    else if (['picker', 'textResponse'].includes(page)) go('editor');
    else if (['editor', 'catalog', 'lists'].includes(page)) go('rules');
    else go('home');
  }
  function toggle(key, y) {
    text(t(key), 180, y + 30, 500, '#222', 30);
    // A compact BC switch: state is conveyed by its position and colour only.
    const on = store.data.settings[key];
    button('', 720, y + 5, 105, () => store.update(d => { d.settings[key] = !d.settings[key]; }), true, '', 50, on ? '#bdeeee' : '#c8c8c8');
    const ctx = drawingContext(host); ctx.save(); ctx.fillStyle = 'White'; ctx.fillRect((on ? 795 : 750) - 17, y + 13, 34, 34); ctx.restore();
  }
  const current = () => store.active;
  function commitRule() {
    if (advanced) draft = JSON.parse(get('json'));
    else {
      draft.name = get('name');
      const split = id => get(id).split(',').map(s => s.trim()).filter(Boolean);
      draft.trigger.members = split('members').map(Number);
      if (draft.trigger.kind === 'activity') { draft.trigger.activities = split('activities'); draft.trigger.groups = split('groups'); delete draft.trigger.matchNone; }
      if (draft.trigger.kind === 'spicer') { draft.trigger.min = Number(get('min')); draft.trigger.max = Number(get('max')); }
      draft.delayMs = Number(get('delay')); draft.dedupeMs = Number(get('dedupe'));
      if (inputs.has('responses')) {
        const type = draft.choices[0]?.steps[0]?.type ?? 'chat';
        draft.choices = get('responses').split('\n').filter(s => s.trim()).map(text => ({ id: uid(), steps: [{ type, text }] }));
      }
    }
    const validated = validatePersona({ ...current(), rules: [draft] }).rules[0];
    store.update(data => { const p = data.personas.find(p => p.id === data.activePersona); const i = p.rules.findIndex(r => r.id === validated.id); if (i < 0) p.rules.push(validated); else p.rules[i] = validated; });
    go('rules'); status = t('saved');
  }
  function openRule(r) {
    draft = clone(r); advanced = draft.choices.some(c => c.steps.length !== 1 || !['chat', 'emote', 'action'].includes(c.steps[0].type) || c.steps[0].text.includes('\n')) || new Set(draft.choices.map(c => c.steps[0]?.type)).size > 1;
    go('editor');
  }
  // Capture edits before cycling a button or opening the action browser.
  function capture() {
    if (advanced) { if (inputs.has('json')) draft = JSON.parse(get('json')); return; }
    if (!inputs.has('name')) return;
    draft.name = get('name'); draft.delayMs = Number(get('delay')); draft.dedupeMs = Number(get('dedupe'));
    draft.trigger.members = get('members').split(',').map(s => s.trim()).filter(Boolean).map(Number);
    if (inputs.has('activities')) draft.trigger.activities = get('activities').split(',').map(s => s.trim()).filter(Boolean);
    if (inputs.has('groups')) draft.trigger.groups = get('groups').split(',').map(s => s.trim()).filter(Boolean);
    if (inputs.has('min')) { draft.trigger.min = Number(get('min')); draft.trigger.max = Number(get('max')); }
    if (inputs.has('responses')) {
      const type = draft.choices[0]?.steps[0]?.type ?? 'chat';
      draft.choices = get('responses').split('\n').filter(s => s.trim()).map(text => ({ id: uid(), steps: [{ type, text }] }));
    }
  }
  function field(key, value, x, y, w = 700) { text(t(key), x, y - 20, w, '#333', 24); input(key, value, [x, y, w, 48]); }
  function drawHome() {
    text(t('home'), 180, 195, 650, '#333', 34);
    ['enabled', 'reactions', 'mouth', 'interruption', 'bcx'].forEach((k, i) => toggle(k, 225 + i * 82));
    text(t(store.data.settings.enabled ? 'running' : 'disabled'), 180, 685, 650, '#666', 23);
    text(t('persona'), 900, 195, 750, '#333', 34);
    button(t('addPersona'), 900, 220, 190, () => go('persona'));
    button(t('import'), 1110, 220, 150, () => go('import'));
    button(t('export'), 1280, 220, 170, () => go('export'));
    button(personaDeleteMode ? t('cancel') : t('delete'), 1470, 220, 170, () => { personaDeleteMode = !personaDeleteMode; });
    const list = store.data.personas.slice(0, 5);
    list.forEach((p, i) => {
      const y = 310 + i * 115, active = p.id === store.data.activePersona;
      const x = personaDeleteMode ? 920 : 900, w = personaDeleteMode ? 650 : 740;
      const ctx = drawingContext(host); ctx.save(); ctx.fillStyle = active ? '#fff7df' : 'White'; ctx.strokeStyle = active ? '#c08a3e' : '#aaa'; ctx.lineWidth = active ? 4 : 2; ctx.fillRect(x, y, w, 92); ctx.strokeRect?.(x, y, w, 92); ctx.restore();
      text(p.name, x + 25, y + 26, 260, '#222', 28);
      // Pencil icon beside the name; the hit target is deliberately larger than the glyph.
      const px = x + Math.min(290, 35 + p.name.length * 19); text('✎', px, y + 25, 40, '#555', 27);
      buttons.push({ x: px - 8, y: y + 3, w: 45, h: 42, enabled: true, action: () => { if (p.id !== store.data.activePersona) store.update(d => { d.activePersona = p.id; }); go('rename'); } });
      const enabledCount = p.rules.filter(r => r.enabled).length;
      text(`${p.rules.length} ${t('rules')} · ${enabledCount} ${t('on')}`, x + 25, y + 67, 340, '#666', 21);
      if (!personaDeleteMode) {
        button(active ? '✓' : t('choose'), x + 390, y + 17, 105, () => store.update(d => { d.activePersona = p.id; }), true, '', 56, active ? '#bdeeee' : 'White');
        button(t('rules'), x + 510, y + 17, 200, () => { if (!active) store.update(d => { d.activePersona = p.id; }); go('rules'); }, true, '', 56);
      } else {
        button('🗑', 1590, y + 10, 70, () => {
          if (store.data.personas.length <= 1) { status = '至少需要保留一個人格'; return; }
          if (!host.confirm(t('removeConfirm'))) return;
          store.update(d => { d.personas = d.personas.filter(x => x.id !== p.id); if (d.activePersona === p.id) d.activePersona = d.personas[0].id; });
        }, true, '', 70, '#f6dcd9');
      }
    });
    const state = api.getState();
    text(`${t('mouthState')}: ${t(state.capabilities.mouth ? 'owns' : 'waiting')}`, 180, 790, 650, '#555', 23);
    text(`${t('faceState')}: ${t(state.capabilities.expressions ? 'owns' : 'waiting')}`, 180, 830, 650, '#555', 23);
  }
  function cyclePersona(delta) { store.update(d => { const i = d.personas.findIndex(p => p.id === d.activePersona); d.activePersona = d.personas[(i + delta + d.personas.length) % d.personas.length].id; }); index = 0; }
  function drawRules() {
    button(t('addRule'), 180, 205, 300, () => openRule(rule()));
    button('名單設置', 500, 205, 220, () => go('lists'));
    text(current().name, 760, 235, 900);
    const list = current().rules; index = Math.min(index, Math.max(0, Math.ceil(list.length / 6) - 1));
    if (!list.length) text(t('empty'), 180, 365);
    list.slice(index * 6, index * 6 + 6).forEach((r, i) => {
      const y = 310 + i * 85;
      text(`${r.name} · ${t(r.trigger.kind)} · ${r.choices.length}`, 180, y + 30, 950);
      const on = r.enabled;
      button('', 1170, y + 5, 105, () => store.update(d => { const x = d.personas.find(p => p.id === d.activePersona).rules.find(x => x.id === r.id); x.enabled = !x.enabled; }), true, '', 50, on ? '#bdeeee' : '#c8c8c8');
      const ctx = drawingContext(host); ctx.save(); ctx.fillStyle = 'White'; ctx.fillRect((on ? 1245 : 1200) - 17, y + 13, 34, 34); ctx.restore();
      button(t('edit'), 1320, y, 180, () => openRule(r));
      button(t('delete'), 1520, y, 180, () => { if (host.confirm(t('removeConfirm'))) store.update(d => { const p = d.personas.find(p => p.id === d.activePersona); p.rules = p.rules.filter(x => x.id !== r.id); }); });
    });
    button(t('prev'), 180, 850, 220, () => index--, index > 0); button(t('next'), 430, 850, 220, () => index++, (index + 1) * 6 < list.length);
  }
  function drawEditor() {
    button(t('save'), 1410, 205, 280, commitRule);
    button(t('advanced'), 1090, 205, 280, () => { capture(); advanced = true; removeInputs(); }, !advanced);
    if (advanced) {
      text(t('groupHelp'), 180, 310, 1510, '#444', 24);
      input('json', JSON.stringify(draft, null, 2), [180, 345, 1510, 490], true);
      return;
    }
    field('name', draft.name, 180, 240, 780);
    button(t(draft.trigger.kind), 180, 330, 340, () => { capture(); const kinds = ['activity', 'orgasm', 'spicer', 'event']; const kind = kinds[(kinds.indexOf(draft.trigger.kind) + 1) % 4]; draft.trigger = { kind, members: [], ...(kind === 'event' ? { event: 'join' } : kind === 'orgasm' ? { outcome: 'Any' } : {}) }; removeInputs(); });
    if (draft.trigger.kind === 'activity') {
      button(t('catalog'), 550, 330, 350, () => openPicker('trigger'));
      text(`${t('groups')}: ${draft.trigger.groups?.join(', ') || '—'}`, 180, 455, 700, '#444', 22);
      text(`${t('activities')}: ${draft.trigger.activities?.join(', ') || '—'}`, 180, 505, 700, '#444', 22);
      button(`${t('self')}: ${t(draft.trigger.self ? 'on' : 'off')}`, 180, 610, 700, () => { capture(); draft.trigger.self = !draft.trigger.self; });
    } else if (draft.trigger.kind === 'event') {
      button(t(draft.trigger.event), 180, 430, 700, () => { capture(); draft.trigger.event = draft.trigger.event === 'join' ? 'leave' : 'join'; });
    } else if (draft.trigger.kind === 'orgasm') {
      button(t(draft.trigger.outcome), 180, 430, 700, () => { capture(); const options = ['Any', 'Orgasmed', 'Ruined', 'Resisted']; draft.trigger.outcome = options[(options.indexOf(draft.trigger.outcome) + 1) % 4]; });
    } else {
      field('min', draft.trigger.min ?? 0, 180, 440, 320); field('max', draft.trigger.max ?? 100, 550, 440, 330);
    }
    field('members', draft.trigger.members?.join(', ') ?? '', 180, 720);
    field('delay', draft.delayMs, 180, 820, 320); field('dedupe', draft.dedupeMs, 550, 820, 400);
    text(t('responses'), 1010, 300, 360, '#333', 30);
    button('+ 動作', 1260, 270, 130, () => openPicker('response'));
    button('+ 文字', 1410, 270, 130, () => go('textResponse'));
    button(responseDeleteMode ? t('cancel') : t('delete'), 1560, 270, 130, () => { responseDeleteMode = !responseDeleteMode; });
    draft.choices.slice(0, 6).forEach((choice, i) => {
      const step = choice.steps[0], y = 360 + i * 75;
      const label = step.type === 'activity' ? `${step.activity} · ${step.group}` : `${t(step.type)} · ${step.text}`;
      text(label, 1010, y + 28, 500, '#333', 22);
      button(responseDeleteMode ? t('delete') : t('edit'), 1540, y, 150, () => {
        if (responseDeleteMode) draft.choices = draft.choices.filter(c => c.id !== choice.id);
        else if (step.type === 'activity') openPicker('responseEdit', choice.id);
        else { go('textResponse'); pending = choice.id; }
      });
    });
  }
  function openPicker(mode, choiceId = null) {
    capture(); pickerReturn = mode; pickerGroup = draft.trigger.groups?.[0] ?? 'ItemHead';
    pickerRows = activitiesForGroup(host.Player, pickerGroup, host); pickerPage = 0; pickerSelected = new Set(); go('picker'); pending = choiceId;
  }
  function drawLists() {
    text('人格名單設置', 180, 225, 900, '#333', 34);
    text('套用於目前人格的全部規則；黑名單優先。', 180, 275, 1200, '#666', 23);
    field('whiteList', current().whiteList?.join(', ') ?? '', 180, 350, 720);
    field('blackList', current().blackList?.join(', ') ?? '', 180, 485, 720);
    button(t('save'), 180, 590, 300, () => {
      const parse = value => [...new Set(value.split(',').map(x => Number(x.trim())).filter(Number.isSafeInteger))];
      store.update(d => { const p = d.personas.find(x => x.id === d.activePersona); p.whiteList = parse(get('whiteList')); p.blackList = parse(get('blackList')); });
      go('rules'); status = t('saved');
    });
  }
  function drawPicker() {
    text(pickerReturn.startsWith('response') ? '選擇回應動作' : '選擇觸發動作', 180, 205, 1100, '#333', 34);
    input('search', '', [1120, 185, 570, 52]);
    const zones = bodyZones(host.Player, host);
    const bx = 210, by = 245, bw = 390, bh = 610;
    const ctx = drawingContext(host); ctx.save(); ctx.fillStyle = '#f7e8ec'; ctx.fillRect(bx, by, bw, bh); ctx.strokeStyle = '#b799a1'; ctx.strokeRect?.(bx, by, bw, bh); ctx.restore();
    const logical = new Set();
    for (const item of zones) {
      const [zx, zy, zw, zh] = item.zone, x = bx + zx * bw / 500, y = by + zy * bh / 1000, w = Math.max(8, zw * bw / 500), h = Math.max(8, zh * bh / 1000);
      const selected = item.group === pickerGroup; const c = drawingContext(host); c.save(); c.globalAlpha = .55; c.fillStyle = selected ? '#c08a3e' : '#bdeeee'; c.fillRect(x, y, w, h); c.strokeStyle = selected ? '#7a541f' : '#555'; c.strokeRect?.(x, y, w, h); c.restore();
      buttons.push({ x, y, w, h, enabled: true, action: () => { pickerGroup = item.group; pickerRows = activitiesForGroup(host.Player, pickerGroup, host); pickerPage = 0; removeInputs(); } }); logical.add(item.group);
    }
    if (!zones.length) text('BC 身體區域尚未載入', bx + 55, by + 300, 300, '#875610', 23);
    text(`部位：${pickerGroup}`, 680, 275, 380, '#333', 27);
    const query = get('search').trim().toLowerCase();
    const rows = pickerRows.filter(row => `${row.label} ${row.name} ${row.group}`.toLowerCase().includes(query));
    pickerPage = Math.min(pickerPage, Math.max(0, Math.ceil(rows.length / 10) - 1));
    rows.slice(pickerPage * 10, pickerPage * 10 + 10).forEach((row, i) => {
      const col = i % 2, line = Math.floor(i / 2), x = 680 + col * 480, y = 315 + line * 105, key = `${row.group}|${row.name}`;
      button(`${pickerSelected.has(key) ? '✓ ' : ''}${row.label}`, x, y, 440, () => { pickerSelected.has(key) ? pickerSelected.delete(key) : pickerSelected.add(key); }, true, '', 62, pickerSelected.has(key) ? '#bdeeee' : 'White');
      text(`${row.group} / ${row.name}`, x + 8, y + 82, 430, '#666', 18);
    });
    button(t('prev'), 680, 850, 160, () => pickerPage--, pickerPage > 0);
    button(t('next'), 860, 850, 160, () => pickerPage++, (pickerPage + 1) * 10 < rows.length);
    button(t('cancel'), 1230, 850, 190, () => go('editor'));
    button(t('choose'), 1440, 850, 250, () => {
      const chosen = [...pickerSelected].map(key => { const at = key.indexOf('|'); return { group: key.slice(0, at), name: key.slice(at + 1) }; });
      if (pickerReturn === 'trigger') {
        draft.trigger.groups = [...new Set([...(draft.trigger.groups ?? []), ...chosen.map(x => x.group)])];
        draft.trigger.activities = [...new Set([...(draft.trigger.activities ?? []), ...chosen.map(x => x.name)])];
      } else if (chosen.length) {
        const makeChoice = item => ({ id: uid(), steps: [{ type: 'activity', activity: item.name, group: item.group }] });
        if (pickerReturn === 'responseEdit' && pending) {
          const at = draft.choices.findIndex(c => c.id === pending); if (at >= 0) draft.choices[at] = { id: pending, steps: makeChoice(chosen[0]).steps };
        } else draft.choices.push(...chosen.map(makeChoice));
      }
      go('editor');
    }, pickerSelected.size > 0);
  }
  function drawTextResponse() {
    const choiceId = typeof pending === 'string' ? pending : pending?.choiceId;
    const existing = choiceId ? draft.choices.find(c => c.id === choiceId)?.steps[0] : null;
    text(existing ? '編輯文字回應' : '新增文字回應', 180, 235, 900, '#333', 34);
    const types = ['chat', 'emote', 'action'], active = existing?.type ?? 'chat';
    types.forEach((type, i) => button(t(type), 180 + i * 240, 285, 220, () => { pending = { choiceId, type, text: get('responseText') }; removeInputs(); }, true, '', 60, (pending?.type ?? active) === type ? '#bdeeee' : 'White'));
    const chosenType = pending?.type ?? active;
    input('responseText', pending?.text ?? existing?.text ?? '', [180, 390, 1220, 230], true);
    button(t('self'), 180, 650, 180, () => { const node = inputs.get('responseText').node; node.value += '{me}'; });
    button('他人', 380, 650, 180, () => { const node = inputs.get('responseText').node; node.value += '{other}'; });
    button(t('save'), 1120, 700, 280, () => {
      const choice = { id: choiceId || uid(), steps: [{ type: chosenType, text: get('responseText') }] };
      const at = draft.choices.findIndex(c => c.id === choiceId); if (at >= 0) draft.choices[at] = choice; else draft.choices.push(choice);
      pending = null; go('editor');
    });
  }
  function drawCatalog() {
    field('search', '', 180, 230, 1250);
    const query = get('search').toLowerCase(); const rows = catalogRows.filter(r => `${r.name} ${r.group} ${r.label}`.toLowerCase().includes(query));
    catalogPage = Math.min(catalogPage, Math.max(0, Math.ceil(rows.length / 6) - 1));
    rows.slice(catalogPage * 6, catalogPage * 6 + 6).forEach((row, i) => {
      const y = 330 + i * 80;
      text(row.label, 180, y + 10, 1070); text(`${row.group} / ${row.name}`, 180, y + 40, 1070, '#666', 22);
      button(t('choose'), 1430, y, 250, () => { draft.trigger.activities = [row.name]; draft.trigger.groups = [row.group]; go('editor'); });
    });
    button(t('prev'), 180, 850, 220, () => catalogPage--, catalogPage > 0); button(t('next'), 430, 850, 220, () => catalogPage++, (catalogPage + 1) * 6 < rows.length);
    button(t('cancel'), 1430, 850, 250, () => go('editor'));
  }
  function drawTransfer() {
    text(t(page === 'import' ? 'importHint' : 'exportHint'), 180, 235, 1510, '#333', 27);
    input('transfer', page === 'export' ? exportPersona(current(),host.LZString) : '', [180, 285, 1510, 340], true, page === 'export');
    if (page === 'import') {
      button(t('inspect'), 180, 660, 330, () => { pending = importPersonas(get('transfer')); pending.source = get('transfer'); status = `${pending.format}: ${pending.personas.length} ${t('importReady')}`; });
      button(t('confirmImport'), 550, 660, 450, () => {
        if (!pending || pending.source !== get('transfer')) throw new Error('Import changed; inspect again');
        store.update(d => { for (const p of pending.personas) { const names = new Set(d.personas.map(x => x.name)); const base = p.name; let n = 2; while (names.has(p.name)) p.name = `${base.slice(0, 85)} (${n++})`; d.personas.push(p); } });
        go('home'); status = t('imported');
      }, !!pending && pending.source === get('transfer'));
      pending?.warnings.forEach((w, i) => text(t(w), 180, 760 + i * 35, 1510, '#875610', 23));
    }
  }
  function run() {
    buttons = []; const ctx = drawingContext(host); ctx.save();
    try {
      ctx.fillStyle = '#f6f6f6'; ctx.fillRect(0, 0, 2000, 1000);
      text(`Responsive_Liko / ${t(page === 'editor' ? 'edit' : page === 'rules' ? 'rules' : page === 'catalog' ? 'catalog' : page === 'home' ? 'home' : page)}`, 180, 120, 1500, '#111', 42);
      host.DrawButton(1815, 75, 90, 90, '', 'White', exitIcon); buttons.push({ x: 1815, y: 75, w: 90, h: 90, action: exit, enabled: true });
      if (page === 'home') drawHome(); else if (page === 'rules') drawRules(); else if (page === 'editor') drawEditor(); else if (page === 'catalog') drawCatalog();
      else if (page === 'lists') drawLists(); else if (page === 'picker') drawPicker(); else if (page === 'textResponse') drawTextResponse();
      else if (page === 'import' || page === 'export') drawTransfer();
      else {
        field('name', page === 'rename' ? current().name : '', 180, 310, 1200);
        button(t('save'), 180, 410, 330, () => { const name = get('name').trim(); store.update(d => { if (page === 'rename') d.personas.find(p => p.id === d.activePersona).name = name; else { const p = persona(name); d.personas.push(p); d.activePersona = p.id; } }); go('home'); });
      }
      if (status) text(status, 180, 940, 1510, '#8b4100', 24);
    } finally { ctx.restore(); }
  }
  host.PreferenceRegisterExtensionSetting({ Identifier: ID, ButtonText: () => 'Responsive_Liko', Image: preferenceIcon, load: () => go('home'), run,
    click: () => { const b = buttons.find(b => b.enabled && host.MouseIn(b.x, b.y, b.w, b.h)); if (b) try { b.action(); } catch (e) { status = `${t('error')}: ${e.message}`; } }, exit, unload: removeInputs });
  return { close: removeInputs };
}
