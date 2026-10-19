import test from 'node:test';
import assert from 'node:assert/strict';
import {
  observeResponsive,
  responsiveOwns,
  getResponsiveGeneration,
} from '../integrations/lce-responsive-compat.js';

test('reference adapter tracks ownership, counts changes and isolates failing listeners', () => {
  let consumer;
  globalThis.Liko = {
    Responsive_Liko: {
      apiVersion: 1,
      registerConsumer(name, handler) {
        assert.equal(name, 'LCE');
        consumer = handler;
        return () => {};
      },
    },
  };
  const warn = console.warn;
  console.warn = () => {};
  try {
    const seen = [];
    observeResponsive(() => {});
    observeResponsive((now, before, generation) => seen.push({ now, before, generation }));
    // The initial call on subscribe has no generation; only later ownership changes throw.
    observeResponsive((_now, _before, generation) => {
      if (generation) throw Error('listener bug');
    });
    assert.equal(responsiveOwns('mouth'), false);
    assert.equal(getResponsiveGeneration(), 0);

    assert.equal(consumer({ mouth: true, expressions: false }), true);
    assert.equal(responsiveOwns('mouth'), true);
    assert.equal(getResponsiveGeneration(), 1);
    assert.deepEqual(seen.at(-1).now, { mouth: true, expressions: false });
    assert.equal(seen.at(-1).generation, 1);

    consumer({ mouth: true, expressions: false });
    assert.equal(getResponsiveGeneration(), 1, 'an unchanged desired state is not a new generation');

    consumer({ mouth: false, expressions: false });
    assert.equal(responsiveOwns('mouth'), false);
    assert.equal(getResponsiveGeneration(), 2);
    assert.equal(seen.at(-1).generation, 2, 'a throwing listener did not block the later ones');
  } finally {
    console.warn = warn;
    delete globalThis.Liko;
  }
});
