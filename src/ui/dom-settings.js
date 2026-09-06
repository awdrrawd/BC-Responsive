import { bindClearableInputs } from './input-controls.js';
import CSS from './settings.css';
import { createActivityPicker } from './activity-picker.js';
import { ID, clone, persona, rule, uid, supportsRuleMembers } from '../core/model.js';
import { exportPersona, importPersonas } from '../core/import.js';
import preferenceIcon from '../../assets/preference-icon.svg';
import exitIcon from '../../assets/exit-icon.svg';
import { canonicalGroup, activityLabel, bodyZones } from '../integrations/catalog.js';
import { drawingContext } from './canvas.js';
import {
  ANIMATION_GROUPS,
  snapshotItem,
  editAppearanceState,
  animationState,
} from '../features/appearance.js';

const svg = (path) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="${path}"/></svg>`;
const ICON = {
  crown: svg('M3 6l4 4 5-7 5 7 4-4-2 13H5L3 6Zm2 10h14'),
  edit: svg('M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z'),
  trash: svg('M3 6h18M8 6V4h8v2m3 0-1 14H6L5 6'),
  close: svg('M18 6 6 18M6 6l12 12'),
};

export function installSettings({ store, t, host = globalThis }) {
  let root,
    page = 'home',
    deleteMode = false,
    ruleDeleteMode = false,
    selectedRuleId = null,
    draft = null,
    sessionBaseline = null,
    pickerGroup = 'ItemHead',
    pickerScope = 'current',
    pickerSelected = new Set(),
    pickerQuery = '',
    pickerInput = '',
    pickerMode = 'trigger',
    responseDelete = false,
    primaryMode = false,
    modal = null,
    filter = 'all',
    ruleQuery = '',
    inlineEdit = null,
    notice = '',
    ruleScrollTop = 0;
  const esc = (v) =>
    String(v ?? '').replace(
      /[&<>"']/g,
      (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
    );
  const fmt = (key, vars = {}) =>
    Object.entries(vars).reduce((s, [k, v]) => s.replaceAll(`{${k}}`, String(v)), t(key));
  const sw = (on, small = false) =>
    `<button class="rl-switch ${small ? 'rl-small-switch' : ''} ${on ? 'on' : ''}" aria-label="${esc(t(on ? 'on' : 'off'))}"></button>`;
  const relationButtons = (scope) =>
    `<div class="rl-relation-buttons">${['owner', 'lover', 'submissive', 'bcWhitelist', 'friend'].map((key) => `<button data-relation="${key}" data-relation-scope="${scope}">${esc(t(`relation_${key}`))}</button>`).join('')}</div>`;
  function relationMembers(kind) {
    const p = host.Player ?? {},
      numbers = [];
    if (kind === 'owner') numbers.push(p.Ownership?.MemberNumber);
    if (kind === 'lover') numbers.push(...(p.Lovership ?? []).map((x) => x?.MemberNumber));
    if (kind === 'submissive')
      numbers.push(...[...(p.SubmissivesList ?? [])].map((x) => x?.MemberNumber ?? x));
    if (kind === 'bcWhitelist') numbers.push(...(p.WhiteList ?? []));
    if (kind === 'friend') {
      numbers.push(...(p.FriendList ?? []));
      if (p.FriendNames?.keys) numbers.push(...p.FriendNames.keys());
    }
    return [...new Set(numbers.map(Number).filter(Number.isSafeInteger))];
  }
  function animationGroups() {
    return ANIMATION_GROUPS.filter((group) => animationAssets(group).length);
  }
  function groupLabel(group) {
    return (
      host.AssetGroupGet?.(host.Player?.AssetFamily, group)?.Description ??
      host.AssetGroup?.find((g) => g.Name === group)?.Description ??
      t(group)
    );
  }
  let wardrobePending = false;
  function trackFor(group) {
    const current = snapshotItem(host.InventoryGet?.(host.Player, group));
    const assets = animationAssets(group);
    const state = current ?? { asset: assets[0]?.name, color: 'Default' };
    return { group, stateA: clone(state), stateB: { ...clone(state), sameAsset: true } };
  }
  function animationAssets(group) {
    const found = new Map();
    for (const a of host.Asset ?? [])
      if (a?.Group?.Name === group && a.Name)
        found.set(a.Name, { name: a.Name, label: a.Description || a.Name });
    return [...found.values()].sort((a, b) => a.label.localeCompare(b.label));
  }
  const active = () => store.active;
  const activeRule = () =>
    draft?.id === selectedRuleId ? draft : active().rules.find((r) => r.id === selectedRuleId);
  function editableName(name, editing, className, action) {
    return `<div class="rl-editable-name ${className}">${
      editing
        ? `<input class="rl-inline-input" data-inline-edit maxlength="100" aria-label="${esc(t('rename'))}" size="${Math.max(6, name.length + 1)}" value="${esc(name)}">`
        : `<span class="rl-name-text" title="${esc(name)}">${esc(name)}</span><button class="rl-icon" data-act="${action}" aria-label="${esc(t('rename'))}" title="${esc(t('rename'))}">${ICON.edit}</button>`
    } </div>`;
  }
  function titleBar(name = '') {
    const editing = name && inlineEdit?.type === 'persona' && inlineEdit.id === store.data.activePersona;
    const context = name ? editableName(name, editing, 'rl-context', 'editPersonaInline') : '';
    return `<header class="rl-top ${page === 'rules' ? 'rl-top-rules' : ''}"><div class="rl-brand"><img class="rl-brand-icon" src="${esc(preferenceIcon)}" alt="">Responsive_Liko${context}</div></header><button class="rl-exit" data-act="exit"><img src="${esc(exitIcon)}" alt="${esc(t('back'))}"></button>`;
  }
  function shell(body, name = '') {
    return `<style>${CSS}</style><section class="rl-screen">${titleBar(name)}${body}${modalHtml()}${notice ? `<div class="rl-notice">${esc(notice)}</div>` : ''}</section>`;
  }
  function homeHtml() {
    const s = store.data.settings;
    const settings = ['enabled', 'reactions', 'mouth', 'interruption', 'bcx']
      .map(
        (k) =>
          `<div class="rl-setting"><div class="rl-grow"><b>${esc(t(k))}</b>${k === 'enabled' ? `<div class="rl-muted">${esc(t('masterHint'))}</div>` : ''}</div><span data-setting="${k}">${sw(s[k])}</span></div>`,
      )
      .join('');
    const cards = store.data.personas
      .map((p) => {
        const on = p.rules.filter((r) => r.enabled).length,
          activeP = p.id === store.data.activePersona,
          rate = p.rules.length ? (100 * on) / p.rules.length : 0,
          editing = inlineEdit?.type === 'persona' && inlineEdit.id === p.id;
        return `<div class="rl-card-wrap" data-id="${esc(p.id)}"><article class="rl-card ${activeP ? 'active' : ''} ${deleteMode ? 'delete' : ''}">${activeP ? `<span class="rl-crown" aria-label="${esc(t('activePersona'))}">${ICON.crown}</span>` : ''}<div class="rl-card-name">${editableName(p.name, editing, 'rl-name-row', 'editCardInline')}<div class="rl-muted">${esc(t(activeP ? 'activePersona' : 'sparePersona'))}</div></div><div class="rl-meter"><div class="rl-track"><div class="rl-fill" style="width:${rate}%"></div></div><div class="rl-muted">${fmt('enabledRuleCount', { enabled: on, disabled: p.rules.length - on })}</div></div><div class="rl-count"><b>${p.rules.length}</b> ${esc(t('ruleCount'))}</div><button class="primary" data-act="openPersona">${esc(t('personaResponses'))}</button></article><button class="rl-card-side ${deleteMode ? 'danger' : ''}" data-act="${deleteMode ? 'deletePersona' : 'selectPersona'}">${deleteMode ? ICON.trash : activeP ? '✓' : ''}</button></div>`;
      })
      .join('');
    return `<main class="rl-main"><section class="rl-panel"><div class="rl-head"><h2>${esc(t('home'))}</h2></div>${settings}</section><section class="rl-panel"><div class="rl-head"><div class="rl-grow"><h2>${esc(t('persona'))}</h2><div class="rl-muted">${esc(t('personaProgressHint'))}</div></div><div class="rl-tools"><button data-act="newPersona">${esc(t('addPersona'))}</button><button data-act="import">${esc(t('import'))}</button><button data-act="export">${esc(t('export'))}</button><button data-act="deleteMode">${esc(t(deleteMode ? 'finish' : 'delete'))}</button></div></div><div class="rl-personas">${cards}</div></section></main>`;
  }
  function ensureDraft() {
    if (!selectedRuleId || !active().rules.some((r) => r.id === selectedRuleId))
      selectedRuleId = active().rules[0]?.id ?? null;
    if (selectedRuleId && draft?.id !== selectedRuleId)
      draft = clone(active().rules.find((r) => r.id === selectedRuleId));
  }
  function triggerHtml(r) {
    if (r.trigger.kind === 'speech')
      return `<div class="rl-field">${esc(t('speechChannel'))}</div><div class="rl-segments">${['all', 'chat', 'whisper'].map((v) => `<button data-trigger-value="channel" data-value="${v}" class="${r.trigger.channel === v ? 'on' : ''}">${esc(t('speech_' + v))}</button>`).join('')}</div><div class="rl-field"><span>${esc(t('chance'))}</span><output data-chance-value>${r.trigger.chance ?? 100}%</output></div><input class="rl-chance-bar" type="range" min="0" max="100" step="1" aria-label="${esc(t('chance'))}" data-chance value="${r.trigger.chance ?? 100}"><div class="rl-field">${esc(t('severity'))}</div><div class="rl-segments">${['weak', 'medium', 'strong', 'addicted'].map((v) => `<button data-trigger-value="severity" data-value="${v}" class="${r.trigger.severity === v ? 'on' : ''}">${esc(t(v))}</button>`).join('')}</div><p class="rl-muted">${esc(t('speechHint'))}</p>`;
    if (r.trigger.kind === 'activity')
      return `<div class="rl-summary"><b>${esc(r.trigger.groups?.join(', ') || t('allGroups'))}</b><br>${esc(r.trigger.activities?.map((a) => activityLabel(a, r.trigger.groups?.[0] || '', host)).join(', ') || t('allActivities'))}</div><button class="primary" style="margin-top:18px" data-act="picker" data-mode="trigger">${esc(t('openActionPicker'))}</button>`;
    if (r.trigger.kind === 'orgasm')
      return `<div class="rl-field"><span>${esc(t('outcome'))}</span></div><div class="rl-segments">${['Any', 'Orgasmed', 'Ruined', 'Resisted'].map((x) => `<button class="${r.trigger.outcome === x ? 'on' : ''}" data-trigger-value="outcome" data-value="${x}">${esc(t(x))}</button>`).join('')}</div>`;
    if (r.trigger.kind === 'spicer')
      return `<div class="rl-field"><span>${esc(t('min'))}</span><input class="rl-input rl-number" type="number" min="0" max="100" data-field="min" value="${r.trigger.min ?? 0}"></div><div class="rl-field"><span>${esc(t('max'))}</span><input class="rl-input rl-number" type="number" min="0" max="100" data-field="max" value="${r.trigger.max ?? 100}"></div>`;
    return `<div class="rl-field"><span>${esc(t('roomEvent'))}</span></div><div class="rl-segments">${['join', 'leave', 'slowLeave', 'visitor'].map((x) => `<button class="${r.trigger.event === x ? 'on' : ''}" data-trigger-value="event" data-value="${x}">${esc(t(x))}</button>`).join('')}</div><div class="rl-field"><span>${esc(t('roomScope'))}</span></div><div class="rl-segments"><button class="${r.trigger.roomMode !== 'named' ? 'on' : ''}" data-trigger-value="roomMode" data-value="any">${esc(t('anyRoom'))}</button><button class="${r.trigger.roomMode === 'named' ? 'on' : ''}" data-trigger-value="roomMode" data-value="named">${esc(t('namedRooms'))}</button></div>${r.trigger.roomMode === 'named' ? `<input class="rl-input" data-field="roomNames" value="${esc(r.trigger.roomNames?.join(', ') || '')}" placeholder="${esc(t('roomNamesPlaceholder'))}">` : ''}`;
  }
  function rulesHtml() {
    ensureDraft();
    const p = active();
    const shown = p.rules.filter(
      (r) =>
        (filter === 'all' || r.trigger.kind === filter) &&
        r.name.toLowerCase().includes(ruleQuery.toLowerCase()),
    );
    const list =
      shown
        .map(
          (r) =>
            `<div class="rl-rule ${r.id === selectedRuleId ? 'active' : ''} ${ruleDeleteMode && r.id === selectedRuleId ? 'delete-active' : ''}" data-id="${esc(r.id)}">${ruleDeleteMode && r.id === selectedRuleId ? `<button class="danger rl-rule-trash" data-act="deleteSelectedRule">${ICON.trash}</button>` : ''}<button class="rl-rule-main rl-grow" data-act="selectRule"><span><b>${esc(r.name)}</b><small>${esc(t(r.trigger.kind))} · ${r.choices.length} ${esc(t('responseCount'))}</small></span></button><span data-act="toggleRule">${sw(r.enabled, true)}</span></div>`,
        )
        .join('') || `<div class="rl-muted">${esc(t('empty'))}</div>`;
    const r = activeRule(),
      editingRule = r && inlineEdit?.type === 'rule' && inlineEdit.id === r.id;
    let editor = `<div class="rl-muted">${esc(t('selectRuleHint'))}</div>`;
    if (r) {
      const responses = r.choices
        .map((c, i) => ({ c, i }))
        .sort((a, b) => Number(!!b.c.always) - Number(!!a.c.always))
        .map(({ c, i }) => {
          const s = c.steps[0];
          return `<div class="rl-response ${c.always ? 'rl-primary-response' : ''} ${primaryMode ? 'rl-primary-pick' : ''}" ${primaryMode && r.trigger.kind !== 'speech' ? `data-primary-choice="${i}" role="button" tabindex="0" aria-label="${esc(t('mainResponse'))}"` : ''}>${c.always && r.trigger.kind !== 'speech' ? `<span class="rl-crown" aria-label="${esc(t('mainResponse'))}">${ICON.crown}</span>` : ''}<b>${esc(t(r.trigger.kind === 'speech' ? 'speech' : s.type === 'activity' ? 'activityStep' : s.type === 'animation' ? 'animationStep' : s.type))}</b><span>${esc(s.type === 'activity' ? `${activityLabel(s.activity, s.group, host)} · ${s.group}` : s.type === 'animation' ? `${(s.tracks ?? [{ group: s.group }]).map((x) => groupLabel(x.group)).join(' + ')} · ${s.count}× · ${s.durationMs / 1000}s` : s.text)}</span><button class="${responseDelete ? 'danger' : ''}" data-act="${responseDelete ? 'deleteResponse' : 'editResponse'}" data-index="${i}">${esc(t(responseDelete ? 'delete' : 'edit'))}</button></div>`;
        })
        .join('');
      editor = `<div class="rl-head">${editableName(r.name, editingRule, 'rl-inline-title', 'editRuleInline')}<span class="rl-grow"></span>${ruleDeleteMode ? `<button data-act="finishRuleDelete">${esc(t('finish'))}</button>` : `<span data-act="toggleRule" data-id="${esc(r.id)}">${sw(r.enabled)}</span><button data-act="deleteRule">${esc(t('delete'))}</button>`}<button class="primary" data-act="saveRule">${esc(t('save'))}</button></div><div class="rl-editor-grid"><div class="rl-box"><h3>${esc(t('trigger'))}</h3><div class="rl-field"><span>${esc(t('type'))}</span></div><div class="rl-segments">${['activity', 'orgasm', 'spicer', 'event', 'speech'].map((x) => `<button class="${r.trigger.kind === x ? 'on' : ''}" data-trigger-kind="${x}">${esc(t(x))}</button>`).join('')}</div>${triggerHtml(r)}${!supportsRuleMembers(r.trigger) ? '' : `<div class="rl-settings-group"><h3>${esc(t('ruleWhitelist'))}</h3><div class="rl-muted">${esc(t('ruleWhitelistHint'))}</div>${relationButtons('rule')}<input class="rl-input" data-field="members" value="${esc(r.trigger.members?.join(', ') || '')}" placeholder="${esc(t('memberNumbersPlaceholder'))}"></div>`}</div><div class="rl-box"><div class="rl-response-head"><h3 class="rl-grow">${esc(t(r.trigger.kind === 'speech' ? 'speechList' : 'responses'))}</h3>${r.trigger.kind === 'speech' ? '' : `<button data-act="primaryMode" class="${primaryMode ? 'primary' : ''}">${esc(t(primaryMode ? 'finish' : 'mainResponse'))}</button><span class="rl-response-gap"></span>`}<button data-act="newText">＋ ${esc(t(r.trigger.kind === 'speech' ? 'speech' : 'textStep'))}</button>${r.trigger.kind === 'speech' ? '' : `<button data-act="picker" data-mode="response">＋ ${esc(t('activityStep'))}</button><button data-act="newAnimation">＋ ${esc(t('animationStep'))}</button>`}<button class="rl-response-delete" data-act="responseDelete">${esc(t(responseDelete ? 'finish' : 'delete'))}</button></div>${responses}</div></div>`;
    }
    return `<main class="rl-work"><aside class="rl-panel rl-browser"><div class="rl-head"><button class="primary rl-grow" data-act="newRule">＋ ${esc(t('addRule'))}</button><button data-act="lists">${esc(t('listSettings'))}</button></div><input class="rl-search" data-rule-search value="${esc(ruleQuery)}" placeholder="${esc(t('searchRules'))}"><div class="rl-cats">${[
      ['all', 'all'],
      ['activity', 'activity'],
      ['orgasm', 'orgasm'],
      ['spicer', 'spicer'],
      ['event', 'event'],
      ['speech', 'speech'],
    ]
      .map(([v, k]) => `<button class="${filter === v ? 'on' : ''}" data-filter="${v}">${esc(t(k))}</button>`)
      .join(
        '',
      )}</div><div class="rl-rule-list">${list}</div></aside><section class="rl-panel rl-editor">${editor}</section></main>`;
  }
  const picker = createActivityPicker({ host });
  let pickerSearch;
  function pickerRows() {
    const scope = pickerScope === 'all' ? 'all' : canonicalGroup(pickerGroup);
    picker.select(
      modal,
      scope,
      () => {
        pickerSearch = picker.search;
        updatePickerResults();
        root
          ?.querySelectorAll('[data-act="selectAll"],[data-act="confirmPicker"]')
          .forEach((b) => (b.disabled = false));
      },
      (error) => {
        const el = root?.querySelector('.rl-actions');
        if (el) el.textContent = String(error.message || error);
      },
    );
    pickerSearch = picker.search;
    return pickerSearch ? pickerSearch(pickerQuery) : [];
  }
  function pickerActions(rows) {
    if (!pickerSearch) return `<div class="rl-muted" role="status">${esc(t('loadingActivities'))}</div>`;
    return (
      rows
        .map((a) => {
          const key = `${a.group}|${a.name}`;
          return `<button class="rl-action ${pickerSelected.has(key) ? 'on' : ''}" data-action="${esc(key)}"><strong>${esc(a.label)}</strong><small>${esc(a.name)}</small></button>`;
        })
        .join('') || `<div class="rl-muted">${esc(t('noAvailableActivities'))}</div>`
    );
  }

  function updatePickerResults() {
    const rows = pickerRows(),
      container = root?.querySelector('.rl-actions');
    if (!container || !pickerSearch) return;
    // Like QuickInteraction, typing changes visibility instead of replacing cards.
    if (container._pickerSearch !== pickerSearch) {
      const all = pickerSearch('');
      container.innerHTML =
        (all.length ? pickerActions(all) : '') +
        '<div class="rl-muted" data-picker-empty>' +
        esc(t('noAvailableActivities')) +
        '</div>';
      container._pickerSearch = pickerSearch;
      container._pickerCards = [...container.querySelectorAll('[data-action]')];
      container.onclick = (event) => {
        const b = event.target.closest('[data-action]');
        if (!b || !container.contains(b)) return;
        pickerSelected.has(b.dataset.action)
          ? pickerSelected.delete(b.dataset.action)
          : pickerSelected.add(b.dataset.action);
        b.classList.toggle('on', pickerSelected.has(b.dataset.action));
        const count = root.querySelector('[data-picker-count]');
        if (count) count.textContent = fmt('selectedActivityCount', { count: pickerSelected.size });
      };
    }
    const visible = new Set(rows.map((a) => a.group + '|' + a.name));
    for (const b of container._pickerCards) b.hidden = !visible.has(b.dataset.action);
    container.querySelector('[data-picker-empty]').style.display = rows.length ? 'none' : '';
    container.scrollTop = 0;
  }

  function animationModalBody() {
    return `<div class="rl-segments">${animationGroups()
      .map(
        (g) =>
          `<button data-animation-group="${g}" class="${modal.tracks.some((x) => x.group === g) ? 'on' : ''}">${esc(groupLabel(g))}</button>`,
      )
      .join('')}</div><div class="rl-animation-tracks">${modal.tracks
      .map(
        (track, i) =>
          `<div class="rl-settings-group rl-animation-track"><h3>${esc(groupLabel(track.group))}</h3>${[
            'A',
            'B',
          ]
            .map(
              (state) =>
                `<div class="rl-field"><span>${esc(t('animationState' + state))}</span><select class="rl-select" data-track="${i}" data-state="${state}">${state === 'B' ? `<option value="__same__" ${track.stateB.sameAsset ? 'selected' : ''}>${esc(t('sameClothing'))}</option>` : ''}${animationAssets(
                  track.group,
                )
                  .map(
                    (a) =>
                      `<option value="${esc(a.name)}" ${!(state === 'B' && track.stateB.sameAsset) && a.name === track['state' + state].asset ? 'selected' : ''}>${esc(a.label)}</option>`,
                  )
                  .join(
                    '',
                  )}</select><button data-wardrobe="${i}" data-state="${state}">${esc(t('editAppearance'))}</button></div>`,
            )
            .join('')}</div>`,
      )
      .join(
        '',
      )}</div><div class="rl-animation-grid"><span>${esc(t('animationCount'))}</span><input class="rl-input rl-number" type="number" min="1" max="100" data-animation-field="count" value="${modal.count}"><span>${esc(t('animationSeconds'))}</span><input class="rl-input rl-number" type="number" min="0.1" max="120" step="0.1" data-animation-seconds value="${modal.durationMs / 1000}"></div><div class="rl-animation-message"><div class="rl-muted">${esc(t('animationMessageHint'))}</div><div class="rl-choice-row">${['chat', 'emote', 'action'].map((x) => `<button class="${modal.messageType === x ? 'on' : ''}" data-animation-message-type="${x}">${esc(t(x))}</button>`).join('')}</div><textarea class="rl-textarea" style="height:90px" data-animation-field="text">${esc(modal.text)}</textarea><div class="rl-tools"><button data-animation-token="{Self}">${esc(t('insertSelfName'))}</button><button data-animation-token="{Other}">${esc(t('insertOtherName'))}</button></div></div>`;
  }
  function pickerHtml() {
    const zones = bodyZones(host.Player, host),
      rows = pickerRows();
    const zoneHtml = zones
      .map(({ group, zone }) => {
        const [x, y, w, h] = zone;
        return `<button class="rl-zone ${group === pickerGroup ? 'selected' : ''}" data-group="${group}" aria-label="${esc(groupLabel(group))}" title="${esc(groupLabel(group))}" style="left:${x / 5}%;top:${y / 10}%;width:${w / 5}%;height:${h / 10}%"></button>`;
      })
      .join('');
    const actions = pickerSearch ? '' : pickerActions(rows);
    return `<div class="rl-overlay"><section class="rl-dialog"><div class="rl-picker-head"><h2>${esc(t('chooseActivity'))}</h2><div class="rl-picker-controls"><select class="rl-select rl-picker-scope" data-picker-scope><option value="current" ${pickerScope === 'current' ? 'selected' : ''}>${esc(t('currentArea'))}</option><option value="all" ${pickerScope === 'all' ? 'selected' : ''}>${esc(t('allAreas'))}</option></select><div class="rl-action-search"><input class="rl-input" data-action-search value="${esc(pickerInput)}" placeholder="${esc(t('searchActivities'))}"></div><button data-act="searchActivities">${esc(t('searchButton'))}</button><span class="rl-grow"></span><button data-act="selectAll" ${!pickerSearch ? 'disabled' : ''}>${esc(t('selectAll'))}</button><button data-act="clearAll">${esc(t('clearAll'))}</button></div></div><div class="rl-dialog-body rl-picker-body"><div class="rl-body-map">${zoneHtml}</div><div class="rl-actions-wrap"><div class="rl-actions-title">${pickerScope === 'all' ? esc(t('allAreaActivities')) : fmt('availableForGroup', { group: esc(groupLabel(pickerGroup)) })}</div><div class="rl-actions">${actions}</div></div></div><div class="rl-dialog-foot"><span class="rl-grow rl-muted" data-picker-count>${fmt('selectedActivityCount', { count: pickerSelected.size })}</span><button data-act="closeModal">${esc(t('cancel'))}</button><button class="primary" data-act="confirmPicker" ${!pickerSearch ? 'disabled' : ''}>${esc(t('confirmAdd'))}</button></div></section></div>`;
  }
  function modalHtml() {
    if (!modal) return '';
    if (modal.type === 'picker') return pickerHtml();
    if (modal.type === 'unsaved')
      return `<div class="rl-overlay"><section class="rl-dialog compact"><div class="rl-dialog-head"><h2>${esc(t('unsavedTitle'))}</h2></div><div class="rl-dialog-body"><p>${esc(t('unsavedMessage'))}</p></div><div class="rl-dialog-foot"><span class="rl-grow"></span><button data-act="closeModal">${esc(t('cancel'))}</button><button data-act="discardExit">${esc(t('discardExit'))}</button><button class="primary" data-act="saveExit">${esc(t('saveExit'))}</button></div></section></div>`;
    const titles = {
      name: modal.mode === 'new' ? t('addPersona') : modal.mode === 'rule' ? t('renameRule') : t('rename'),
      confirm: t('confirmDelete'),
      transfer: t(modal.mode),
      text: t(modal.index == null ? 'newTextResponse' : 'editTextResponse'),
      animation: t(modal.index == null ? 'newAnimationResponse' : 'editAnimationResponse'),
      lists: t('listSettings'),
    };
    let body = '';
    if (modal.type === 'name') body = `<input class="rl-input" data-modal-value value="${esc(modal.value)}">`;
    if (modal.type === 'confirm') body = `<p>${esc(modal.message)}</p>`;
    if (modal.type === 'transfer')
      body = `<textarea class="rl-textarea" data-modal-value ${modal.mode === 'export' ? 'readonly' : ''}>${esc(modal.value)}</textarea><div class="rl-tools rl-transfer-tools"><button data-clipboard="${modal.mode}">${esc(t(modal.mode === 'export' ? 'copyText' : 'pasteText'))}</button><span class="rl-muted" data-clipboard-status role="status"></span></div>`;
    if (modal.type === 'text')
      body = `<div class="rl-choice-row">${(draft?.trigger.kind === 'speech' ? ['chat'] : ['chat', 'emote', 'action']).map((x) => `<button class="${modal.responseType === x ? 'on' : ''}" data-response-type="${x}">${esc(t(x))}</button>`).join('')}</div><textarea class="rl-textarea" style="margin-top:18px" data-modal-value>${esc(modal.value)}</textarea><div class="rl-tools" style="margin-top:12px"><button data-token="{Self}">${esc(t('insertSelfName'))}</button><button data-token="{Other}">${esc(t('insertOtherName'))}</button></div>`;
    if (modal.type === 'text' && draft?.trigger.kind === 'speech') {
      titles.text = t(modal.index == null ? 'newSpeech' : 'editSpeech');
      body = `<textarea class="rl-textarea" data-modal-value>${esc(modal.value)}</textarea>`;
    }
    if (modal.type === 'animation') body = animationModalBody();
    if (modal.type === 'lists') {
      const key = modal.listMode === 'whitelist' ? 'white' : 'black',
        value = key === 'white' ? modal.white : modal.black;
      body = `<div class="rl-settings-group"><h3>${esc(t('interactionTargets'))}</h3><div class="rl-segments"><button class="${modal.listMode === 'whitelist' ? 'on' : ''}" data-list-mode="whitelist">${esc(t('onlyWhitelist'))}</button><button class="${modal.listMode === 'blacklist' ? 'on' : ''}" data-list-mode="blacklist">${esc(t('onlyBlacklist'))}</button></div></div><div class="rl-settings-group"><h3>${esc(t(key === 'white' ? 'whiteList' : 'blackList'))}</h3><div class="rl-muted">${esc(t(key === 'white' ? 'whiteListHint' : 'blackListHint'))}</div>${relationButtons('persona')}<div class="rl-list-entry"><input class="rl-input" data-list="${key}" value="${esc(value)}" placeholder="${esc(t('memberNumbersPlaceholder'))}"><button data-act="normalizeList">＋</button></div></div>`;
    }
    return `<div class="rl-overlay"><section class="rl-dialog compact ${modal.type === 'animation' ? 'rl-animation-dialog' : ''}"><div class="rl-dialog-head"><h2 class="rl-grow">${esc(titles[modal.type])}</h2><button data-act="closeModal">${ICON.close}</button></div><div class="rl-dialog-body">${modal.error ? `<p role="alert">${esc(modal.error)}</p>` : ''}${body}</div><div class="rl-dialog-foot"><span class="rl-grow"></span><button data-act="closeModal">${esc(t('cancel'))}</button>${modal.mode === 'export' ? '' : `<button class="primary" data-act="confirmModal">${esc(t('save'))}</button>`}</div></section></div>`;
  }
  function render() {
    if (!root) return;
    if (modal?.type !== 'picker') picker.reset();
    const oldRuleList = root.querySelector('.rl-rule-list');
    if (oldRuleList) ruleScrollTop = oldRuleList.scrollTop;
    root.innerHTML = shell(page === 'home' ? homeHtml() : rulesHtml(), page === 'rules' ? active().name : '');
    const newRuleList = root.querySelector('.rl-rule-list');
    if (newRuleList) newRuleList.scrollTop = ruleScrollTop;
    bind();
    if (modal?.type === 'picker') updatePickerResults();
    position();
    const inline = root.querySelector('[data-inline-edit]');
    if (inline) {
      inline.focus();
      inline.select();
    }
  }
  function bindDragScroll(element) {
    let pointer = null,
      startX = 0,
      startY = 0,
      left = 0,
      top = 0,
      dragging = false;
    element.onpointerdown = (e) => {
      if (e.button !== 0 || e.target.closest('input,textarea,select')) return;
      const tracks = e.target.closest('.rl-animation-tracks'),
        trackScroll =
          tracks && (tracks.scrollWidth > tracks.clientWidth || tracks.scrollHeight > tracks.clientHeight);
      if (tracks && ((element !== tracks && trackScroll) || (element === tracks && !trackScroll))) return;
      pointer = e.pointerId;
      startX = e.clientX;
      startY = e.clientY;
      left = element.scrollLeft;
      top = element.scrollTop;
      dragging = false;
    };
    element.onpointermove = (e) => {
      if (e.pointerId !== pointer) return;
      const dx = e.clientX - startX,
        dy = e.clientY - startY;
      if (!dragging && Math.hypot(dx, dy) > 12) {
        dragging = true;
        element.classList.add('rl-dragging');
        element.setPointerCapture?.(pointer);
      }
      if (dragging) {
        element.scrollLeft = left - dx;
        element.scrollTop = top - dy;
        e.preventDefault();
      }
    };
    const finish = (e) => {
      if (e.pointerId !== pointer) return;
      const wasDragging = dragging;
      if (wasDragging) element.releasePointerCapture?.(pointer);
      pointer = null;
      dragging = false;
      element.classList.remove('rl-dragging');
      if (wasDragging)
        element.addEventListener(
          'click',
          (event) => {
            event.preventDefault();
            event.stopImmediatePropagation();
          },
          { capture: true, once: true },
        );
    };
    element.onpointerup = finish;
    element.onpointercancel = finish;
    element.onpointerleave = () => {
      if (!dragging) pointer = null;
    };
  }
  function contentOf(p, overlay = draft) {
    const rules = p.rules.map((r) => (overlay?.id === r.id ? overlay : r));
    return {
      name: p.name,
      rules: rules.map((r) => ({
        id: r.id,
        name: r.name,
        enabled: r.enabled,
        trigger: r.trigger,
        dedupeMs: r.dedupeMs,
        delayMs: r.delayMs,
        choices: r.choices,
      })),
    };
  }
  function dirty() {
    return !!sessionBaseline && JSON.stringify(contentOf(active())) !== JSON.stringify(sessionBaseline);
  }
  function commitDraft() {
    if (!draft) return;
    store.update((d) => {
      const p = d.personas.find((x) => x.id === d.activePersona),
        i = p.rules.findIndex((x) => x.id === draft.id);
      p.rules[i] = clone(draft);
    });
    draft = clone(active().rules.find((r) => r.id === selectedRuleId));
  }
  let noticeTimer;
  function flash(key) {
    clearTimeout(noticeTimer);
    notice = t(key);
    render();
    noticeTimer = setTimeout(() => {
      notice = '';
      render();
    }, 1600);
  }
  function parseMembers(value) {
    return [
      ...new Set(
        value
          .split(',')
          .map((x) => x.trim())
          .filter(Boolean)
          .map(Number)
          .filter((x) => Number.isSafeInteger(x) && x >= 0),
      ),
    ];
  }
  function bind() {
    bindResponseControls();
    bindPersonaControls();
    bindRuleControls();
    bindPickerControls();
    bindResponseEditors();
    bindDialogControls();
    bindClearableInputs(root, host, t('clearText'));
  }
  function bindResponseControls() {
    root.querySelectorAll('[data-animation-field]').forEach(
      (el) =>
        (el.oninput = () => {
          modal[el.dataset.animationField] =
            el.dataset.animationField === 'count' ? Number(el.value) : el.value;
        }),
    );

    root.querySelectorAll('[data-act="primaryMode"]').forEach(
      (b) =>
        (b.onclick = () => {
          primaryMode = !primaryMode;
          responseDelete = false;
          render();
        }),
    );
    root.querySelectorAll('[data-primary-choice]').forEach((b) => {
      const choose = () => {
        const choice = draft.choices[Number(b.dataset.primaryChoice)],
          value = !choice.always;
        draft.choices.forEach((c) => delete c.always);
        if (value) choice.always = true;
        primaryMode = false;
        render();
      };
      b.onclick = (e) => {
        if (!e.target.closest('button')) choose();
      };
      b.onkeydown = (e) => {
        if (e.target === b && ['Enter', ' '].includes(e.key)) {
          e.preventDefault();
          choose();
        }
      };
    });
    const chance = root.querySelector('[data-chance]');
    if (chance)
      chance.oninput = () => {
        draft.trigger.chance = Number(chance.value);
        root.querySelector('[data-chance-value]').textContent = chance.value + '%';
      };
    root.querySelectorAll('[data-animation-group]').forEach(
      (b) =>
        (b.onclick = () => {
          const g = b.dataset.animationGroup,
            i = modal.tracks.findIndex((x) => x.group === g);
          if (i < 0) modal.tracks.push(trackFor(g));
          else modal.tracks.splice(i, 1);
          render();
        }),
    );
    root.querySelectorAll('[data-track]').forEach(
      (el) =>
        (el.onchange = () => {
          const track = modal.tracks[Number(el.dataset.track)],
            state = el.dataset.state;
          if (state === 'B' && el.value === '__same__')
            track.stateB = { ...track.stateB, asset: track.stateA.asset, sameAsset: true };
          else {
            track['state' + state] = { asset: el.value, color: 'Default' };
            if (state === 'A' && track.stateB.sameAsset) track.stateB.asset = el.value;
          }
          render();
        }),
    );
    const seconds = root.querySelector('[data-animation-seconds]');
    if (seconds)
      seconds.oninput = seconds.onchange = () => {
        modal.durationMs = Number(seconds.value) * 1000;
      };
    root.querySelectorAll('[data-wardrobe]').forEach(
      (b) =>
        (b.onclick = async () => {
          const track = modal.tracks[Number(b.dataset.wardrobe)],
            state = 'state' + b.dataset.state;
          wardrobePending = true;
          root.style.display = 'none';
          try {
            await editAppearanceState(host, track.group, animationState(track, b.dataset.state), (saved) => {
              if (saved) {
                const same =
                  state === 'stateB' && track.stateB.sameAsset && saved.asset === track.stateA.asset;
                track[state] = { ...saved, ...(same ? { sameAsset: true } : {}) };
                if (state === 'stateA' && track.stateB.sameAsset) track.stateB.asset = saved.asset;
              }
              wardrobePending = false;
              if (!root) {
                root = host.document.createElement('div');
                root.className = 'rl-root';
                host.document.body.appendChild(root);
              }
              root.style.display = '';
              render();
            });
          } catch (error) {
            wardrobePending = false;
            if (root) root.style.display = '';
            modal.error = String(error.message);
            render();
          }
        }),
    );
  }
  function bindPersonaControls() {
    root
      .querySelectorAll('.rl-box,.rl-rule-list,.rl-animation-tracks,.rl-animation-dialog .rl-dialog-body')
      .forEach(bindDragScroll);
    root.querySelectorAll('[data-act="exit"]').forEach(
      (b) =>
        (b.onclick = () => {
          if (page === 'home') host.PreferenceSubscreenExtensionsClear?.();
          else if (dirty()) {
            modal = { type: 'unsaved' };
            render();
          } else {
            page = 'home';
            draft = null;
            sessionBaseline = null;
            render();
          }
        }),
    );
    root.querySelectorAll('[data-setting]').forEach(
      (w) =>
        (w.onclick = () => {
          store.update((d) => (d.settings[w.dataset.setting] = !d.settings[w.dataset.setting]));
          render();
        }),
    );
    root.querySelectorAll('[data-act="deleteMode"]').forEach(
      (b) =>
        (b.onclick = () => {
          deleteMode = !deleteMode;
          render();
        }),
    );
    root.querySelectorAll('[data-act="selectPersona"]').forEach(
      (b) =>
        (b.onclick = () => {
          const id = b.closest('.rl-card-wrap').dataset.id;
          store.update((d) => (d.activePersona = id));
          render();
        }),
    );
    root.querySelectorAll('[data-act="openPersona"]').forEach(
      (b) =>
        (b.onclick = () => {
          const id = b.closest('.rl-card-wrap').dataset.id;
          if (id !== store.data.activePersona) store.update((d) => (d.activePersona = id));
          selectedRuleId = null;
          draft = null;
          sessionBaseline = clone(contentOf(active(), null));
          page = 'rules';
          render();
        }),
    );
    root.querySelectorAll('[data-act="editCardInline"]').forEach(
      (b) =>
        (b.onclick = () => {
          inlineEdit = { type: 'persona', id: b.closest('.rl-card-wrap').dataset.id };
          render();
        }),
    );
    root.querySelectorAll('[data-act="editPersonaInline"]').forEach(
      (b) =>
        (b.onclick = () => {
          inlineEdit = { type: 'persona', id: store.data.activePersona };
          render();
        }),
    );
    root.querySelectorAll('[data-act="editRuleInline"]').forEach(
      (b) =>
        (b.onclick = () => {
          inlineEdit = { type: 'rule', id: selectedRuleId };
          render();
        }),
    );
    const inline = root.querySelector('[data-inline-edit]');
    if (inline) {
      let handled = false;
      const finish = (save) => {
        if (handled) return;
        handled = true;
        const value = inline.value.trim();
        if (save && value) {
          if (inlineEdit.type === 'rule') draft.name = value;
          else store.update((d) => (d.personas.find((p) => p.id === inlineEdit.id).name = value));
        }
        inlineEdit = null;
        render();
      };
      inline.onkeydown = (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          finish(true);
        } else if (e.key === 'Escape') {
          e.preventDefault();
          finish(false);
        }
      };
      inline.onblur = () => finish(true);
    }
    root.querySelectorAll('[data-act="renameCard"]').forEach((b) => {
      b.onclick = () => {
        const id = b.closest('.rl-card-wrap').dataset.id,
          p = store.data.personas.find((x) => x.id === id);
        modal = { type: 'name', mode: 'persona', id, value: p.name };
        render();
      };
    });
    root.querySelectorAll('[data-act="renamePersona"]').forEach(
      (b) =>
        (b.onclick = () => {
          modal = { type: 'name', mode: 'persona', id: store.data.activePersona, value: active().name };
          render();
        }),
    );
    root.querySelectorAll('[data-act="newPersona"]').forEach(
      (b) =>
        (b.onclick = () => {
          modal = { type: 'name', mode: 'new', value: t('newPersonaDefault') };
          render();
        }),
    );
    root.querySelectorAll('[data-act="deletePersona"]').forEach((b) => {
      b.onclick = () => {
        if (store.data.personas.length <= 1) return;
        modal = {
          type: 'confirm',
          mode: 'persona',
          id: b.closest('.rl-card-wrap').dataset.id,
          message: t('removePersonaConfirm'),
        };
        render();
      };
    });
    root.querySelectorAll('[data-act="import"]').forEach(
      (b) =>
        (b.onclick = () => {
          modal = { type: 'transfer', mode: 'import', value: '' };
          render();
        }),
    );
    root.querySelectorAll('[data-act="export"]').forEach(
      (b) =>
        (b.onclick = () => {
          modal = { type: 'transfer', mode: 'export', value: exportPersona(active(), host.LZString) };
          render();
        }),
    );
  }
  function bindRuleControls() {
    root.querySelectorAll('[data-filter]').forEach(
      (b) =>
        (b.onclick = () => {
          filter = b.dataset.filter;
          render();
        }),
    );
    const rs = root.querySelector('[data-rule-search]');
    if (rs)
      rs.oninput = () => {
        ruleQuery = rs.value;
        render();
      };
    root.querySelectorAll('[data-act="selectRule"]').forEach(
      (b) =>
        (b.onclick = () => {
          if (dirty()) commitDraft();
          primaryMode = false;
          selectedRuleId = b.closest('.rl-rule').dataset.id;
          draft = null;
          render();
        }),
    );
    root.querySelectorAll('[data-act="toggleRule"]').forEach(
      (w) =>
        (w.onclick = (e) => {
          e.stopPropagation();
          const id = w.dataset.id || w.closest('.rl-rule').dataset.id;
          if (draft?.id === id) draft.enabled = !draft.enabled;
          store.update((d) => {
            const r = d.personas.find((p) => p.id === d.activePersona).rules.find((x) => x.id === id);
            r.enabled = !r.enabled;
          });
          draft = null;
          render();
        }),
    );
    root.querySelectorAll('[data-act="newRule"]').forEach(
      (b) =>
        (b.onclick = () => {
          if (dirty()) commitDraft();
          const r = rule();
          r.name = t('newRule');
          store.update((d) => d.personas.find((p) => p.id === d.activePersona).rules.push(r));
          selectedRuleId = r.id;
          draft = null;
          render();
        }),
    );
    root.querySelectorAll('[data-act="deleteRule"]').forEach(
      (b) =>
        (b.onclick = () => {
          ruleDeleteMode = true;
          render();
        }),
    );
    root.querySelectorAll('[data-act="finishRuleDelete"]').forEach(
      (b) =>
        (b.onclick = () => {
          ruleDeleteMode = false;
          render();
        }),
    );
    root.querySelectorAll('[data-act="deleteSelectedRule"]').forEach(
      (b) =>
        (b.onclick = (e) => {
          e.stopPropagation();
          modal = { type: 'confirm', mode: 'rule', id: selectedRuleId, message: t('removeConfirm') };
          render();
        }),
    );
    root.querySelectorAll('[data-act="renameRule"]').forEach(
      (b) =>
        (b.onclick = () => {
          modal = { type: 'name', mode: 'rule', id: selectedRuleId, value: draft.name };
          render();
        }),
    );
    root.querySelectorAll('[data-act="saveRule"]').forEach(
      (b) =>
        (b.onclick = () => {
          commitDraft();
          sessionBaseline = clone(contentOf(active(), null));
          flash('saved');
        }),
    );
    root.querySelectorAll('[data-trigger-kind]').forEach(
      (b) =>
        (b.onclick = () => {
          const v = b.dataset.triggerKind;
          primaryMode = false;
          if (v === 'speech')
            draft.choices = draft.choices
              .map((c) => ({
                id: c.id,
                steps: c.steps
                  .filter((s) => ['chat', 'emote', 'action'].includes(s.type))
                  .map((s) => ({ type: 'chat', text: s.text })),
              }))
              .filter((c) => c.steps.length);
          draft.trigger = {
            kind: v,
            members: [],
            ...(v === 'activity'
              ? { activities: [], groups: [], self: false }
              : v === 'orgasm'
                ? { outcome: 'Any' }
                : v === 'spicer'
                  ? { min: 0, max: 100 }
                  : v === 'speech'
                    ? { channel: 'all', chance: 100, severity: 'weak' }
                    : { event: 'join', roomMode: 'any', roomNames: [] }),
          };
          render();
        }),
    );
    root.querySelectorAll('[data-trigger-value]').forEach(
      (b) =>
        (b.onclick = () => {
          draft.trigger[b.dataset.triggerValue] = b.dataset.value;
          render();
        }),
    );
    root.querySelectorAll('[data-field]').forEach(
      (el) =>
        (el.onchange = () => {
          const k = el.dataset.field,
            v = el.value;
          if (k === 'kind') {
            draft.trigger = {
              kind: v,
              members: [],
              ...(v === 'activity'
                ? { activities: [], groups: [], self: false }
                : v === 'orgasm'
                  ? { outcome: 'Any' }
                  : v === 'spicer'
                    ? { min: 0, max: 100 }
                    : v === 'speech'
                      ? { channel: 'all', chance: 100, severity: 'weak' }
                      : { event: 'join', roomMode: 'any', roomNames: [] }),
            };
          } else if (['min', 'max', 'chance'].includes(k)) {
            draft.trigger[k] = Math.max(0, Math.min(100, Number(v) || 0));
            el.value = draft.trigger[k];
            return;
          } else if (k === 'members') draft.trigger.members = parseMembers(v);
          else if (k === 'roomNames')
            draft.trigger.roomNames = v
              .split(',')
              .map((x) => x.trim())
              .filter(Boolean);
          else draft.trigger[k] = v;
          render();
        }),
    );
  }
  function bindPickerControls() {
    root.querySelectorAll('[data-act="picker"]').forEach(
      (b) =>
        (b.onclick = () => {
          pickerMode = b.dataset.mode;
          pickerScope = 'current';
          pickerSelected = new Set();
          pickerQuery = '';
          pickerInput = '';
          modal = { type: 'picker' };
          render();
        }),
    );
    const ps = root.querySelector('[data-picker-scope]');
    if (ps)
      ps.onchange = () => {
        pickerScope = ps.value;
        pickerQuery = pickerInput;
        render();
      };
    root.querySelectorAll('[data-group]').forEach(
      (b) =>
        (b.onclick = () => {
          pickerGroup = b.dataset.group;
          pickerScope = 'current';
          pickerQuery = pickerInput;
          render();
        }),
    );
    const as = root.querySelector('[data-action-search]');
    if (as) {
      as.oninput = (e) => {
        pickerInput = as.value;
        if (e.isComposing) return;
        pickerQuery = pickerInput;
        updatePickerResults();
      };
      as.oncompositionend = () => {
        pickerInput = as.value;
        pickerQuery = pickerInput;
        updatePickerResults();
      };
      as.onkeydown = (e) => {
        if (e.key === 'Enter' && !e.isComposing) {
          pickerInput = as.value;
          pickerQuery = pickerInput;
          updatePickerResults();
        }
      };
    }
    root.querySelectorAll('[data-act="searchActivities"]').forEach(
      (b) =>
        (b.onclick = () => {
          pickerInput = as?.value ?? pickerInput;
          pickerQuery = pickerInput;
          updatePickerResults();
        }),
    );
    root.querySelectorAll('[data-act="selectAll"]').forEach(
      (b) =>
        (b.onclick = () => {
          pickerRows().forEach((a) => pickerSelected.add(`${a.group}|${a.name}`));
          render();
        }),
    );
    root.querySelectorAll('[data-act="clearAll"]').forEach(
      (b) =>
        (b.onclick = () => {
          pickerSelected.clear();
          render();
        }),
    );
    root.querySelectorAll('[data-act="confirmPicker"]').forEach(
      (b) =>
        (b.onclick = () => {
          const picked = [...pickerSelected].map((k) => {
            const i = k.indexOf('|');
            return { group: k.slice(0, i), activity: k.slice(i + 1) };
          });
          if (pickerMode === 'trigger') {
            draft.trigger.groups = [...new Set(picked.map((x) => x.group))];
            draft.trigger.activities = [...new Set(picked.map((x) => x.activity))];
          } else if (pickerMode === 'responseEdit' && modal.responseIndex != null && picked[0]) {
            const old = draft.choices[modal.responseIndex];
            draft.choices[modal.responseIndex] = {
              id: old.id,
              always: old.always ?? false,
              steps: [{ type: 'activity', ...picked[0] }],
            };
          } else
            picked.forEach((x) => draft.choices.push({ id: uid(), steps: [{ type: 'activity', ...x }] }));
          modal = null;
          render();
        }),
    );
  }
  function bindResponseEditors() {
    root.querySelectorAll('[data-act="newText"]').forEach(
      (b) =>
        (b.onclick = () => {
          modal = { type: 'text', index: null, responseType: 'chat', value: '' };
          render();
        }),
    );
    root.querySelectorAll('[data-act="newAnimation"]').forEach(
      (b) =>
        (b.onclick = () => {
          const group = animationGroups()[0];
          if (!group) return;
          modal = {
            type: 'animation',
            index: null,
            tracks: [trackFor(group)],
            count: 6,
            durationMs: 1200,
            messageType: 'emote',
            text: '',
          };
          render();
        }),
    );
    root.querySelectorAll('[data-act="editResponse"]').forEach(
      (b) =>
        (b.onclick = () => {
          const i = Number(b.dataset.index),
            s = draft.choices[i].steps[0];
          if (s.type === 'activity') {
            pickerMode = 'responseEdit';
            pickerSelected = new Set([`${s.group}|${s.activity}`]);
            modal = { type: 'picker', responseIndex: i };
            render();
          } else if (s.type === 'animation') {
            modal = { type: 'animation', index: i, ...clone(s) };
            modal.tracks ??= [
              {
                group: s.group,
                stateA: {
                  asset: s.assetA,
                  color: snapshotItem(host.InventoryGet?.(host.Player, s.group))?.color ?? 'Default',
                },
                stateB: {
                  asset: s.assetB,
                  color: snapshotItem(host.InventoryGet?.(host.Player, s.group))?.color ?? 'Default',
                },
              },
            ];
            render();
          } else {
            modal = { type: 'text', index: i, responseType: s.type, value: s.text };
            render();
          }
        }),
    );
    root.querySelectorAll('[data-act="responseDelete"]').forEach(
      (b) =>
        (b.onclick = () => {
          responseDelete = !responseDelete;
          primaryMode = false;
          render();
        }),
    );
    root.querySelectorAll('[data-act="deleteResponse"]').forEach((b) => {
      b.onclick = () => {
        draft.choices.splice(Number(b.dataset.index), 1);
        render();
      };
    });
    root.querySelectorAll('[data-act="lists"]').forEach(
      (b) =>
        (b.onclick = () => {
          modal = {
            type: 'lists',
            listMode: active().listMode ?? 'blacklist',
            white: active().whiteList.join(', '),
            black: active().blackList.join(', '),
          };
          render();
        }),
    );
    root.querySelectorAll('[data-list-mode]').forEach(
      (b) =>
        (b.onclick = () => {
          const input = root.querySelector('[data-list]');
          if (input) modal[input.dataset.list] = input.value;
          modal.listMode = b.dataset.listMode;
          render();
        }),
    );
    root.querySelectorAll('[data-relation]').forEach(
      (b) =>
        (b.onclick = () => {
          const ids = relationMembers(b.dataset.relation);
          if (b.dataset.relationScope === 'rule') {
            draft.trigger.members = [...new Set([...(draft.trigger.members ?? []), ...ids])];
          } else {
            const input = root.querySelector('[data-list]'),
              key = input?.dataset.list ?? (modal.listMode === 'whitelist' ? 'white' : 'black');
            modal[key] = [...new Set([...parseMembers(input?.value ?? modal[key]), ...ids])].join(', ');
          }
          render();
        }),
    );
    root.querySelectorAll('[data-act="normalizeList"]').forEach(
      (b) =>
        (b.onclick = () => {
          const input = root.querySelector('[data-list]');
          if (input) {
            modal[input.dataset.list] = parseMembers(input.value).join(', ');
            render();
          }
        }),
    );
    const captureAnimation = () =>
      root.querySelectorAll('[data-animation-field]').forEach((el) => {
        modal[el.dataset.animationField] = ['count', 'durationMs'].includes(el.dataset.animationField)
          ? Number(el.value)
          : el.value;
      });
    root.querySelectorAll('[data-animation-field]').forEach(
      (el) =>
        (el.onchange = () => {
          captureAnimation();
        }),
    );
    root.querySelectorAll('[data-animation-message-type]').forEach(
      (b) =>
        (b.onclick = () => {
          captureAnimation();
          modal.messageType = b.dataset.animationMessageType;
          render();
        }),
    );
    root.querySelectorAll('[data-animation-token]').forEach(
      (b) =>
        (b.onclick = () => {
          const el = root.querySelector('[data-animation-field="text"]');
          el.value += b.dataset.animationToken;
          modal.text = el.value;
        }),
    );
    root.querySelectorAll('[data-response-type]').forEach(
      (b) =>
        (b.onclick = () => {
          modal.responseType = b.dataset.responseType;
          modal.value = root.querySelector('[data-modal-value]').value;
          render();
        }),
    );
    root.querySelectorAll('[data-token]').forEach(
      (b) =>
        (b.onclick = () => {
          const el = root.querySelector('[data-modal-value]');
          el.value += b.dataset.token;
        }),
    );
  }
  function bindDialogControls() {
    root.querySelectorAll('[data-clipboard]').forEach((button) => {
      button.onclick = async () => {
        const current = modal,
          field = root.querySelector('[data-modal-value]');
        const status = root.querySelector('[data-clipboard-status]');
        button.disabled = true;
        try {
          if (button.dataset.clipboard === 'export') await host.navigator.clipboard.writeText(field.value);
          else {
            const text = await host.navigator.clipboard.readText();
            if (modal !== current || !field.isConnected) return;
            field.value = text;
            current.value = text;
            field.focus();
          }
          if (status.isConnected)
            status.textContent = t(button.dataset.clipboard === 'export' ? 'copiedText' : 'pastedText');
        } catch {
          if (status.isConnected) status.textContent = t('clipboardUnavailable');
        } finally {
          button.disabled = false;
        }
      };
    });
    root.querySelectorAll('[data-act="closeModal"]').forEach(
      (b) =>
        (b.onclick = () => {
          modal = null;
          render();
        }),
    );
    root.querySelectorAll('[data-act="confirmModal"]').forEach((b) => (b.onclick = confirmModal));
    root.querySelectorAll('[data-act="discardExit"]').forEach(
      (b) =>
        (b.onclick = () => {
          const restore = sessionBaseline;
          modal = null;
          draft = null;
          if (restore)
            store.update((d) => {
              const p = d.personas.find((x) => x.id === d.activePersona);
              p.name = restore.name;
              p.rules = clone(restore.rules);
            });
          sessionBaseline = null;
          page = 'home';
          render();
        }),
    );
    root.querySelectorAll('[data-act="saveExit"]').forEach(
      (b) =>
        (b.onclick = () => {
          commitDraft();
          modal = null;
          draft = null;
          sessionBaseline = null;
          page = 'home';
          flash('saved');
        }),
    );
  }
  function confirmModal() {
    const m = modal,
      value = root.querySelector('[data-modal-value]')?.value?.trim() ?? '';
    try {
      if (m.type === 'name') {
        if (!value) return;
        if (m.mode === 'new') store.update((d) => d.personas.push(persona(value, host.Player?.MemberNumber)));
        else if (m.mode === 'rule') draft.name = value;
        else store.update((d) => (d.personas.find((p) => p.id === m.id).name = value));
      } else if (m.type === 'confirm' && m.mode === 'rule') {
        if (draft?.id === m.id) draft = null;
        store.update((d) => {
          const p = d.personas.find((x) => x.id === d.activePersona);
          p.rules = p.rules.filter((r) => r.id !== m.id);
        });
        selectedRuleId = active().rules[0]?.id ?? null;
        ruleDeleteMode = false;
      } else if (m.type === 'confirm') {
        store.update((d) => {
          d.personas = d.personas.filter((p) => p.id !== m.id);
          if (d.activePersona === m.id) d.activePersona = d.personas[0].id;
        });
      } else if (m.type === 'transfer') {
        const parsed = importPersonas(value);
        store.update((d) => d.personas.push(...parsed.personas));
      } else if (m.type === 'text') {
        const choice = {
          id: m.index == null ? uid() : draft.choices[m.index].id,
          steps: [{ type: m.responseType, text: value }],
        };
        if (m.index == null) draft.choices.push(choice);
        else draft.choices[m.index] = { ...choice, always: draft.choices[m.index].always ?? false };
      } else if (m.type === 'animation') {
        const seconds = root.querySelector('[data-animation-seconds]');
        if (seconds) m.durationMs = Number(seconds.value) * 1000;
        for (const el of root.querySelectorAll('[data-animation-field]'))
          m[el.dataset.animationField] = ['count', 'durationMs'].includes(el.dataset.animationField)
            ? Number(el.value)
            : el.value;
        for (const track of m.tracks) if (track.stateB.sameAsset) track.stateB.asset = track.stateA.asset;
        if (!m.tracks.length || m.tracks.some((x) => !x.stateA.asset || !x.stateB.asset))
          throw Error(t('chooseAnimationGroup'));
        if (
          !Number.isInteger(m.count) ||
          m.count < 1 ||
          m.count > 100 ||
          !Number.isFinite(m.durationMs) ||
          m.durationMs < 100 ||
          m.durationMs > 120000
        )
          throw Error(t('invalidAnimation'));
        const choice = {
          id: m.index == null ? uid() : draft.choices[m.index].id,
          steps: [
            {
              type: 'animation',
              tracks: clone(m.tracks),
              count: m.count,
              durationMs: m.durationMs,
              messageType: m.messageType,
              text: m.text,
            },
          ],
        };
        if (m.index == null) draft.choices.push(choice);
        else draft.choices[m.index] = { ...choice, always: draft.choices[m.index].always ?? false };
      } else if (m.type === 'lists') {
        const input = root.querySelector('[data-list]');
        if (input) m[input.dataset.list] = input.value;
        store.update((d) => {
          const p = d.personas.find((x) => x.id === d.activePersona);
          p.listMode = m.listMode;
          p.whiteList = parseMembers(m.white);
          p.blackList = parseMembers(m.black);
        });
      }
      modal = null;
      render();
    } catch (error) {
      modal.error = String(error.message);
      render();
    }
  }
  function position() {
    if (!root) return;
    const b = drawingContext(host).canvas.getBoundingClientRect();
    Object.assign(root.style, {
      left: `${b.left}px`,
      top: `${b.top}px`,
      transform: `scale(${b.width / 2000},${b.height / 1000})`,
    });
  }
  function load() {
    root?.remove();
    root = host.document.createElement('div');
    root.className = 'rl-root';
    host.document.body.appendChild(root);
    if (!wardrobePending) page = 'home';
    render();
  }
  function unload() {
    clearTimeout(noticeTimer);
    picker.reset();
    root?.remove();
    root = null;
  }
  host.PreferenceRegisterExtensionSetting({
    Identifier: ID,
    ButtonText: () => ID,
    Image: preferenceIcon,
    load,
    run: position,
    click() {},
    exit() {
      if (page === 'home') unload();
      else if (dirty()) {
        modal = { type: 'unsaved' };
        render();
      } else {
        page = 'home';
        draft = null;
        sessionBaseline = null;
        render();
      }
    },
    unload,
  });
  return { close: unload };
}
