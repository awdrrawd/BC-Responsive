import { expressionEngineIntercepts, hscExpressionGroups } from '../integrations/compat.js';

// BC's "Eyes" alias writes both eyes, "Eyes1" is the left eye only, "Eyes2" the right eye only.
// Layers are tracked per real item slot so a single-eye effect and a both-eyes effect can overlap.
const slotsFor = (group) => (group === 'Eyes' ? ['Eyes', 'Eyes2'] : group === 'Eyes1' ? ['Eyes'] : [group]);
const writeGroup = (slot) => (slot === 'Eyes' ? 'Eyes1' : slot);
const valueOf = (item) => item?.Property?.Expression ?? null;

/**
 * Timed facial expressions as stacked effects.
 *
 * - Every effect has its own identity; an expiring effect only removes itself.
 * - The newest live effect is shown. When it ends, the next newest live effect is shown, and the
 *   original face returns only when none remain. An ended effect can never reappear.
 * - If the face was changed by someone else (manual edit, another plugin, an item swap), the
 *   stack for that slot is abandoned without writing anything back.
 * - While HSC controls a group nothing is written, and effects that end during control are
 *   forgotten instead of restoring a stale value afterwards.
 * - When an animation engine (LCE/WCE) intercepts CharacterSetFacialExpression, the engine
 *   arbitrates and expires the effect: it is sent with a Timer so it is a timed event rather than
 *   a permanent manual override, and Responsive keeps no restore timer of its own.
 */
export function createExpressionLayers({ host = globalThis, report = () => {} } = {}) {
  const later = (fn, ms) => (host.setTimeout ?? setTimeout)(fn, ms);
  const cancel = (timer) => (host.clearTimeout ?? clearTimeout)(timer);
  const slots = new Map(); // slot name -> { item, base, shown, layers: effect[] }
  const effects = new Set(); // effects with a pending timer
  let nextId = 0;
  const current = (name) => host.InventoryGet(host.Player, name);

  function write(names, values) {
    if (!names.length) return;
    const pair = names.includes('Eyes') && names.includes('Eyes2') && values.Eyes === values.Eyes2;
    // One alias call keeps both eyes atomic; two calls would broadcast a mismatched face in between.
    if (pair) host.CharacterSetFacialExpression(host.Player, 'Eyes', values.Eyes);
    for (const name of names)
      if (!pair || (name !== 'Eyes' && name !== 'Eyes2'))
        host.CharacterSetFacialExpression(host.Player, writeGroup(name), values[name]);
  }
  function detach(effect, name) {
    effect.names.delete(name);
    if (!effect.names.size) {
      cancel(effect.timer);
      effects.delete(effect);
    }
  }
  function drop(name) {
    const slot = slots.get(name);
    if (!slot) return;
    slots.delete(name);
    for (const effect of [...slot.layers]) detach(effect, name);
  }
  // True while the face is still exactly what this module last showed and nobody else controls it.
  const ownsFace = (name, slot, held = hscExpressionGroups(host)) =>
    !held.has(name) && current(name) === slot.item && valueOf(slot.item) === slot.shown;

  function expire(effect) {
    effects.delete(effect);
    const names = [...effect.names];
    effect.names.clear();
    const held = hscExpressionGroups(host);
    const writes = {};
    for (const name of names) {
      const slot = slots.get(name);
      const index = slot ? slot.layers.indexOf(effect) : -1;
      if (index < 0) continue; // stale or duplicate callback
      slot.layers.splice(index, 1);
      if (!ownsFace(name, slot, held)) {
        drop(name);
        continue;
      }
      const desired = slot.layers.length ? slot.layers.at(-1).value : slot.base;
      if (!slot.layers.length) slots.delete(name);
      if (desired !== slot.shown) {
        writes[name] = desired;
        slot.shown = desired;
      }
    }
    try {
      write(Object.keys(writes), writes);
    } catch (error) {
      report(error);
    }
  }

  return {
    apply(step) {
      const names = slotsFor(step.group);
      const items = Object.fromEntries(names.map((name) => [name, current(name)]));
      const allowed = names.filter(
        (name) =>
          items[name] && (!step.value || items[name].Asset.Group.AllowExpression?.includes(step.value)),
      );
      // The first slot is the requested item itself; the second eye is optional.
      if (allowed[0] !== names[0]) return;
      const held = hscExpressionGroups(host);
      if (names.some((name) => held.has(name))) {
        report('Expression skipped: hypnosis controls this group');
        return;
      }
      const value = step.value ?? null;
      if (expressionEngineIntercepts(host)) {
        // The engine owns arbitration and expiry; earlier local stacks must not write over it later.
        for (const name of allowed) drop(name);
        host.CharacterSetFacialExpression(host.Player, step.group, value, step.durationMs / 1000);
        return;
      }
      const effect = { id: ++nextId, value, names: new Set(allowed), timer: null };
      for (const name of allowed) {
        let slot = slots.get(name);
        if (slot && !ownsFace(name, slot, held)) {
          drop(name); // someone else changed this face; their value becomes the new base
          slot = undefined;
        }
        if (!slot) {
          const shown = valueOf(items[name]);
          slot = { item: items[name], base: shown, shown, layers: [] };
          slots.set(name, slot);
        }
        slot.layers.push(effect);
      }
      effect.timer = later(() => expire(effect), step.durationMs);
      effects.add(effect);
      const writes = {};
      for (const name of allowed) {
        const slot = slots.get(name);
        if (value !== slot.shown) writes[name] = value;
      }
      write(Object.keys(writes), writes);
      for (const name of Object.keys(writes)) slots.get(name).shown = value;
    },
    // Cancel every pending effect and give back the original face where this module still owns it.
    clear() {
      const held = hscExpressionGroups(host);
      const writes = {};
      for (const [name, slot] of slots)
        if (ownsFace(name, slot, held) && slot.base !== slot.shown) writes[name] = slot.base;
      for (const effect of effects) cancel(effect.timer);
      effects.clear();
      slots.clear();
      try {
        write(Object.keys(writes), writes);
      } catch (error) {
        report(error);
      }
    },
  };
}
