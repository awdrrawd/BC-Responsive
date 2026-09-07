import { clone } from '../core/model.js';
import { animationState, createPreviewCharacter, wearState } from '../features/appearance.js';

const CHARACTER_HEIGHT = 1000;
const CANVAS_UPPER_OVERFLOW = 700;
const PREVIEW_PADDING = 20;

function visibleBounds(source) {
  // Character canvases include overflow and transparent space around the pose.
  // Measure only when refreshed, so preview playback does not scan every frame.
  try {
    const { data } = source.getContext('2d').getImageData(0, 0, source.width, source.height);
    let left = source.width,
      top = source.height,
      right = -1,
      bottom = -1;
    for (let y = 0; y < source.height; y++) {
      for (let x = 0; x < source.width; x++) {
        if (data[(y * source.width + x) * 4 + 3] > 0) {
          left = Math.min(left, x);
          right = Math.max(right, x);
          top = Math.min(top, y);
          bottom = y;
        }
      }
    }
    if (right >= left) return { x: left, y: top, width: right - left + 1, height: bottom - top + 1 };
  } catch {
    // Keep drawing if browser canvas readback is unavailable.
  }
  const y = source.height >= CANVAS_UPPER_OVERFLOW + CHARACTER_HEIGHT ? CANVAS_UPPER_OVERFLOW : 0;
  return { x: 0, y, width: source.width, height: Math.min(CHARACTER_HEIGHT, source.height - y) };
}

// Isolated character and elapsed-time playback: no player writes or server calls.
export function createAnimationPreview(host, now = () => performance.now()) {
  let character,
    canvas,
    settings,
    bounds,
    started = null,
    frame = -1;
  function apply(state) {
    const local = Object.create(host);
    local.Player = character;
    for (const track of settings.tracks) wearState(local, track.group, animationState(track, state));
    host.CharacterRefresh(character, false);
    bounds = null;
  }
  return {
    mount(element, value) {
      canvas = element;
      settings = clone(value);
      started = null;
      frame = -1;
      character = createPreviewCharacter(host, 'Responsive_Liko_AnimationPreview');
      character.ActivePose = clone(host.Player.ActivePose ?? []);
      apply('A');
      this.draw();
    },
    play(value) {
      if (!character) return;
      if (
        !Number.isInteger(value.count) ||
        value.count < 1 ||
        value.count > 100 ||
        !Number.isFinite(value.intervalMs) ||
        value.intervalMs < 1 ||
        value.intervalMs > 120000 ||
        !value.tracks.length ||
        value.tracks.some((t) => !t.stateA.asset || !animationState(t, 'B').asset)
      )
        throw Error('invalidAnimation');
      settings = clone(value);
      started = now();
      frame = -1;
      this.draw();
    },
    draw() {
      if (!canvas || !character) return;
      if (started !== null) {
        const next = Math.min(settings.count, Math.floor((now() - started) / settings.intervalMs));
        if (next !== frame) {
          frame = next;
          apply(next === settings.count || next % 2 ? 'A' : 'B');
        }
        if (next === settings.count) started = null;
      }
      if (character.MustDraw) {
        host.CharacterLoadCanvas(character);
        character.MustDraw = false;
        bounds = null;
      }
      const context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);
      if (character.Canvas) {
        const source = character.Canvas;
        bounds ??= visibleBounds(source);
        const scale = Math.min(
          (canvas.width - PREVIEW_PADDING * 2) / bounds.width,
          (canvas.height - PREVIEW_PADDING * 2) / bounds.height,
        );
        context.drawImage(
          source,
          bounds.x,
          bounds.y,
          bounds.width,
          bounds.height,
          (canvas.width - bounds.width * scale) / 2,
          (canvas.height - bounds.height * scale) / 2,
          bounds.width * scale,
          bounds.height * scale,
        );
      }
    },
    clear() {
      canvas = character = settings = bounds = null;
      started = null;
      frame = -1;
    },
  };
}
