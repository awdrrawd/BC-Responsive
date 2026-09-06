import test from 'node:test';
import assert from 'node:assert/strict';
import { drawingContext } from '../src/ui/canvas.js';

test('canvas adapter accepts a drawing context and resolves an HTML canvas', () => {
  const context = { save() {}, canvas: {} };
  assert.equal(drawingContext({ MainCanvas: context }), context);
  assert.equal(drawingContext({ MainCanvas: { getContext: type => { assert.equal(type, '2d'); return context; } } }), context);
});

test('missing context reports the missing BC surface', () => {
  assert.throws(() => drawingContext({}), /drawing context is unavailable/);
});
