import { readFile, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
const root = resolve(process.argv[2] || '');
if (!process.argv[2]) throw new Error('Provide the BC-LCE repository path');
const files = ['src/features/char-talk.js', 'src/features/expressions.js'];
const source = await Promise.all(files.map(f => readFile(join(root, f), 'utf8')));
function replaceOnce(text, from, to) {
  if (text.split(from).length !== 2) throw new Error(`Expected exactly one anchor: ${from}`);
  return text.replace(from, to);
}
const importLine = "import { observeResponsive, responsiveOwns } from '../core/responsive-compat.js';\n";
let [mouth, face] = source.map(s => s.replaceAll('\r\n', '\n'));
if (mouth.includes(importLine) && face.includes(importLine)) {
  if (!mouth.includes('d.timer = setTimeout')) {
    mouth = replaceOnce(mouth, '    setTimeout(() => runStep(c), duration);', '    d.timer = setTimeout(() => runStep(c), duration);');
    mouth = replaceOnce(mouth, '        ids.forEach(id => delete charData[id]);', '        ids.forEach(id => { clearTimeout(charData[id].timer); delete charData[id]; });');
    await writeFile(join(root, files[0]), mouth);
  }
  console.log('LCE adapter linked, timers cancellable'); process.exit(0);
}
mouth = importLine + mouth;
mouth = replaceOnce(mouth, '    installed = true;', `    installed = true;
    observeResponsive((next) => {
        if (!next.mouth) return;
        const ids = Object.keys(charData);
        ids.forEach(id => { clearTimeout(charData[id].timer); delete charData[id]; });
        for (const c of (globalThis.ChatRoomCharacter || [])) {
            if (ids.includes(String(c.MemberNumber))) CharacterRefresh(c, false);
        }
    });`);
mouth = replaceOnce(mouth, "if (!getFeature('autoMouthOnTalk')) return false;", "if (!getFeature('autoMouthOnTalk') || responsiveOwns('mouth')) return false;");
mouth = replaceOnce(mouth, 'function runStep(c) {', "function runStep(c) {\n    if (responsiveOwns('mouth')) return;");
mouth = replaceOnce(mouth, '    setTimeout(() => runStep(c), duration);', '    d.timer = setTimeout(() => runStep(c), duration);');
mouth = replaceOnce(mouth, "modApi.hookFunction('CommonDrawAppearanceBuild', 0, (args, next) => {", "modApi.hookFunction('CommonDrawAppearanceBuild', 0, (args, next) => {\n        if (responsiveOwns('mouth')) return next(args);");
face = importLine + face;
face = replaceOnce(face, "const engineOn = () => engineStarted && !!getFeature('animationEngine');", "const engineOn = () => engineStarted && !!getFeature('animationEngine') && !responsiveOwns('expressions');");
face = replaceOnce(face, 'export function pushEvent(evt) {', "export function pushEvent(evt) {\n    if (responsiveOwns('expressions')) return;");
face = replaceOnce(face, '    installed = true;', `    installed = true;
    observeResponsive((next, previous) => {
        if (next.expressions === previous.expressions) return;
        queue.length = 0;
        for (const map of [manualComponents, broadcast, lastSentAt]) {
            for (const key of Object.keys(map)) delete map[key];
        }
        if (!next.expressions && engineStarted && globalThis.Player?.ArousalSettings) {
            PreviousArousal = { ...Player.ArousalSettings };
            // Adopt the present face/pose after handoff rather than replaying stale events.
            pushEvent({ Type: MANUAL_EVT, Duration: -1,
                Expression: Object.fromEntries(faceComponents().map(t => [t, [{ Expression: expression(t)[0], Duration: -1 }]])),
                Poses: [{ Pose: [...(Player.ActivePose || [])], Duration: -1 }],
            });
        }
    });`);
// All anchors were verified before any file is written.
await writeFile(join(root, 'src/core/responsive-compat.js'), await readFile(new URL('../integrations/lce-responsive-compat.js', import.meta.url)));
await writeFile(join(root, files[0]), mouth);
await writeFile(join(root, files[1]), face);
console.log('LCE mouth/expression cooperation linked');
