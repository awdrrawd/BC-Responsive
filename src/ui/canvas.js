// BC declares `let MainCanvas` in Drawing.js. That lexical binding is not a
// window property: window.MainCanvas can instead be the named HTML element.
export function drawingContext(host = globalThis) {
  const main = host === globalThis && typeof MainCanvas !== 'undefined' ? MainCanvas : host.MainCanvas;
  const context = typeof main?.save === 'function' ? main : main?.getContext?.('2d');
  if (!context?.canvas || typeof context.save !== 'function') {
    throw new Error('Responsive_Liko: BC drawing context is unavailable');
  }
  return context;
}
