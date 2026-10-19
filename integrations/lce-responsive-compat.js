// Reference adapter for plugins integrating the public Responsive API.
// Kept in sync with BC-LCE `src/core/responsive-compat.js`, which is the copy LCE actually ships.
// No persistent LCE setting is changed by this adapter.
const listeners = new Set();
let ownership = { mouth: false, expressions: false };
let bound;
let observing = false;
let ownershipGeneration = 0;
export const responsiveOwns = (capability) => ownership[capability] === true;
// Increases on every ownership change so callers can discard work started under an older owner.
export const getResponsiveGeneration = () => ownershipGeneration;
export function observeResponsive(listener) {
  listeners.add(listener);
  function bind() {
    const api = globalThis.Liko?.Responsive_Liko;
    if (!api || api === bound || api.apiVersion !== 1 || typeof api.registerConsumer !== 'function') return;
    bound = api;
    api.registerConsumer('LCE', (desired) => {
      const previous = ownership;
      ownership = { mouth: desired.mouth === true, expressions: desired.expressions === true };
      if (previous.mouth !== ownership.mouth || previous.expressions !== ownership.expressions) {
        ownershipGeneration++;
        // One failing listener must not stop the others from learning about the new owner.
        for (const callback of [...listeners]) {
          try {
            callback(ownership, previous, ownershipGeneration);
          } catch (error) {
            console.warn('[LCE] Responsive ownership listener failed:', error);
          }
        }
      }
      return true;
    });
  }
  if (!observing && typeof globalThis.addEventListener === 'function') {
    observing = true;
    globalThis.addEventListener('Responsive_Liko:state', bind);
  }
  bind();
  listener(ownership, { mouth: false, expressions: false });
  return () => listeners.delete(listener);
}
