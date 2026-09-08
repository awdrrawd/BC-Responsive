import { lceFeatureEnabled } from '../integrations/compat.js';
import { ID, VERSION, clone } from './model.js';
export function createAPI(namespace, store, host = globalThis) {
  const listeners = new Set();
  const consumers = new Map();
  let ready = false;
  let lastPublished = '';
  let capabilities = { mouth: false, expressions: false };
  let desired = { ...capabilities };
  const getState = () => ({
    apiVersion: 1,
    version: VERSION,
    ready,
    enabled: ready && store.data.settings.enabled,
    activePersona: store.data.activePersona,
    capabilities: clone(capabilities),
    desired: clone(desired),
    scope: { mouth: 'room-local', expressions: 'player' },
  });
  function publish() {
    const signature = JSON.stringify(getState());
    if (signature === lastPublished) return;
    lastPublished = signature;
    for (const listener of listeners)
      try {
        listener(getState());
      } catch (e) {
        console.warn(ID, e);
      }
    host.dispatchEvent?.(new CustomEvent(`${ID}:state`, { detail: getState() }));
  }
  Object.assign(namespace, {
    apiVersion: 1,
    version: VERSION,
    getState,
    isActive: (capability) => ready && store.data.settings.enabled && capabilities[capability] === true,
    subscribe(listener) {
      if (typeof listener !== 'function') throw new TypeError('Listener required');
      listeners.add(listener);
      listener(getState());
      return () => listeners.delete(listener);
    },
    // Consumers synchronously stop their writers before returning true. Registration works in either load order.
    registerConsumer(name, handler) {
      if (typeof name !== 'string' || typeof handler !== 'function') throw new TypeError('Invalid consumer');
      consumers.set(name, handler);
      namespace.refresh();
      return () => {
        if (consumers.get(name) !== handler) return;
        consumers.delete(name);
        namespace.refresh();
      };
    },
  });
  return {
    setReady(value) {
      ready = value;
    },
    owns: (key) => capabilities[key] === true,
    refresh() {
      const settings = store.data.settings;
      desired = {
        mouth: ready && settings.enabled && settings.mouth,
        expressions:
          ready &&
          settings.enabled &&
          settings.reactions &&
          !!store.active?.rules.some(
            (r) => r.enabled && r.choices.some((c) => c.steps.some((s) => s.type === 'expression')),
          ),
      };
      const next = { ...desired };
      // Mouth has one writer. Never ask an enabled LCE mouth to yield back to us.
      if (lceFeatureEnabled('autoMouthOnTalk', host)) next.mouth = false;
      for (const [name, handler] of consumers) {
        try {
          // Expressions are independently managed; the settings panel warns about overlap.
          // Release the older LCE adapter's expression ownership instead of disabling LCE.
          const request = name === 'LCE' ? { ...next, expressions: false } : next;
          const accepted = handler(clone(request));
          if (accepted !== true) {
            next.mouth = false;
            next.expressions = false;
          }
        } catch {
          next.mouth = false;
          next.expressions = false;
        }
      }
      capabilities = next;
      publish();
    },
  };
}
