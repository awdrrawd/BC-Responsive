import test from 'node:test';
import assert from 'node:assert/strict';
import { createAnimationPreview } from '../src/ui/animation-preview.js';
test('preview switches at the configured interval without changing the player and stops on clear', () => {
  let time = 0;
  const original = { Asset: { Name: 'Original' }, Color: 'red', Property: { Height: 1 } };
  const player = { Name: 'Me', AssetFamily: 'Female3DCG', Appearance: [original] };
  const preview = {};
  let draws = 0;
  let readbacks = 0;
  const pixels = new Uint8ClampedArray(500 * 1850 * 4);
  pixels[(800 * 500 + 100) * 4 + 3] = 255;
  pixels[(1599 * 500 + 399) * 4 + 3] = 255;
  const host = {
    Player: player,
    CharacterLoadSimple: () => preview,
    InventoryWear(c, asset, group, color) {
      const item = { Asset: { Name: asset }, Color: color };
      c.Appearance = [item];
      return item;
    },
    InventoryGet: (c) => c.Appearance[0],
    CharacterRefresh(c) {
      assert.equal(c, preview);
      c.Canvas = {
        width: 500,
        height: 1850,
        getContext: () => ({
          getImageData() {
            readbacks++;
            return { data: pixels };
          },
        }),
      };
    },
  };
  const canvas = {
    width: 800,
    height: 1200,
    getContext: () => ({
      clearRect() {},
      drawImage(source, ...coordinates) {
        assert.equal(source, preview.Canvas);
        assert.deepEqual(coordinates, [100, 800, 300, 800, 182.5, 20, 435, 1160]);
        draws++;
      },
    }),
  };
  const settings = {
    count: 4,
    intervalMs: 200,
    tracks: [{ group: 'HairAccessory2', stateA: { asset: 'A' }, stateB: { asset: 'B' } }],
  };
  const controller = createAnimationPreview(host, () => time);
  controller.mount(canvas, settings);
  assert.equal(preview.Appearance[0].Asset.Name, 'A');
  controller.play(settings);
  assert.equal(preview.Appearance[0].Asset.Name, 'B');
  const beforeUnchangedFrame = readbacks;
  time = 199;
  controller.draw();
  assert.equal(preview.Appearance[0].Asset.Name, 'B');
  assert.equal(readbacks, beforeUnchangedFrame);
  time = 200;
  controller.draw();
  assert.equal(preview.Appearance[0].Asset.Name, 'A');
  time = 400;
  controller.draw();
  assert.equal(preview.Appearance[0].Asset.Name, 'B');
  time = 800;
  controller.draw();
  assert.equal(preview.Appearance[0].Asset.Name, 'A');
  assert.equal(player.Appearance[0], original);
  assert.equal(original.Color, 'red');
  controller.clear();
  const before = draws;
  controller.draw();
  assert.equal(draws, before);
});
