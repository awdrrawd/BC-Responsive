// Delay all imports with side effects until after claiming the namespace.
globalThis.Liko ??= {};
if (globalThis.Liko.Responsive_Liko) {
  console.info('Responsive_Liko already loaded');
} else {
  const namespace = globalThis.Liko.Responsive_Liko = {};
  import('./app.js').then(({ start }) => start(namespace)).catch(error => {
    namespace.error = String(error); console.error('Responsive_Liko initialization failed', error);
  });
}
