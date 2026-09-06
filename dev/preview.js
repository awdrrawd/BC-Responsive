// Minimal BC surface for offline layout and interaction checks. Never connects to a server.
// Match BC's lexical context binding; window.MainCanvas remains the DOM element.
let MainCanvas = document.getElementById('MainCanvas').getContext('2d');
var TranslationLanguage = 'TW',
  CurrentScreen = 'ChatRoom',
  MouseX = 0,
  MouseY = 0,
  ChatRoomTargetMemberNumber = -1;
var Player = {
  MemberNumber: 1,
  Name: 'Player',
  ExtensionSettings: {},
  GhostList: [],
  AssetFamily: 'Female3DCG',
  ArousalSettings: { Progress: 0 },
};
var ChatRoomCharacter = [Player],
  ChatRoomData = { Name: 'Offline preview' },
  ActivityDictionary = [];
var ActivityFemale3DCG = [
  { Name: 'Hug', Target: ['ItemArms'] },
  { Name: 'Handshake', Target: ['ItemHands'] },
  { Name: 'Pet', Target: ['ItemHead'] },
  { Name: 'BellRing', Target: ['ItemNeck'] },
];
var AssetGroup = [
  ['HairAccessory2', '耳朵'],
  ['TailStraps', '尾巴'],
  ['Wings', '翅膀'],
].map(([Name, Description]) => ({ Name, Description, Family: 'Female3DCG' }));
var Asset = AssetGroup.flatMap((Group) =>
  ['A', 'B'].map((state) => ({
    Name: Group.Name + state,
    Description: Group.Description + ' ' + state,
    Group,
  })),
);
AssetGroup.push(
  ...[
    ['ItemHead', '頭部', [160, 30, 180, 160]],
    ['ItemNeck', '脖子', [195, 195, 110, 70]],
    ['ItemArms', '手臂', [75, 280, 80, 240]],
    ['ItemHands', '手部', [60, 525, 90, 110]],
  ].map(([Name, Description, Zone]) => ({ Name, Description, Zone: [Zone], Family: 'Female3DCG' })),
);
function AssetGroupGet(family, name) {
  return AssetGroup.find((g) => g.Family === family && g.Name === name);
}
var activePreference,
  handlers = [];
function log(value) {
  document.getElementById('log').textContent = JSON.stringify(value, null, 2);
}
function DrawButton(x, y, w, h, text, color, icon) {
  MainCanvas.save();
  MainCanvas.fillStyle = color;
  MainCanvas.fillRect(x, y, w, h);
  MainCanvas.strokeStyle = '#111';
  MainCanvas.lineWidth = 2;
  MainCanvas.strokeRect(x, y, w, h);
  MainCanvas.textAlign = 'center';
  MainCanvas.textBaseline = 'middle';
  MainCanvas.font = '28px sans-serif';
  MainCanvas.fillStyle = '#111';
  MainCanvas.fillText(icon?.includes('Exit') ? '×' : text, x + w / 2, y + h / 2, w - 14);
  MainCanvas.restore();
}
function MouseIn(x, y, w, h) {
  return MouseX >= x && MouseX <= x + w && MouseY >= y && MouseY <= y + h;
}
function PreferenceRegisterExtensionSetting(config) {
  activePreference = config;
  config.load();
}
function PreferenceSubscreenExtensionsClear() {
  activePreference.unload();
  activePreference.load();
}
function ServerPlayerExtensionSettingsSync() {
  log('Settings saved (in memory only)');
}
function ChatRoomRegisterMessageHandler(handler) {
  handlers.push(handler);
}
function ChatRoomSync() {}
function ChatRoomAddCharacterToChatRoom(c) {
  ChatRoomCharacter.push(c);
}
function ChatRoomSyncMemberLeave(data) {
  ChatRoomCharacter = ChatRoomCharacter.filter((c) => c.MemberNumber !== data.SourceMemberNumber);
}
function CommonDrawAppearanceBuild() {}
function CharacterRefresh() {}
function InventoryGet() {
  return null;
}
function CharacterSetFacialExpression() {}
function CharacterNickname(c) {
  return c.Name;
}
function CharacterPronounDescription() {
  return 'They/Them';
}
function ElementValue(id, value) {
  const n = document.getElementById(id);
  if (value !== undefined) n.value = value;
  return n?.value ?? '';
}
function ChatRoomSetTarget(id) {
  ChatRoomTargetMemberNumber = id;
}
function ChatRoomSendChat() {
  log({ text: ElementValue('InputChat'), target: ChatRoomTargetMemberNumber });
  ElementValue('InputChat', '');
}
function ServerSend(type, data) {
  log({ type, data });
}
function AssetAllActivities() {
  return ActivityFemale3DCG;
}
function ActivityDictionaryText(key) {
  return key.includes('Hug')
    ? '擁抱'
    : key.includes('Handshake')
      ? '握手'
      : key.includes('Pet')
        ? '摸頭'
        : key.includes('BellRing')
          ? '拨动铃铛'
          : 'MISSING TEXT IN dictionary';
}
function ActivityAllowedForGroup(c, group) {
  return ActivityFemale3DCG.filter((a) => a.Target.includes(group)).map((Activity) => ({ Activity }));
}
function ActivityGetGroupOrMirror(family, group) {
  return { Name: group };
}
function ActivityRun(actor, target, group, item) {
  log({ activity: item.Activity.Name, target: target.Name, group });
}
MainCanvas.canvas.addEventListener('click', (e) => {
  const r = MainCanvas.canvas.getBoundingClientRect();
  MouseX = ((e.clientX - r.left) * 2000) / r.width;
  MouseY = ((e.clientY - r.top) * 1000) / r.height;
  activePreference?.click();
});
document.getElementById('lang').onchange = (e) => (TranslationLanguage = e.target.value);
document.getElementById('enter').onclick = () => {
  const c = { MemberNumber: 12345, Name: 'Friend', ArousalSettings: { Progress: 0 } };
  ChatRoomSyncMemberLeave({ SourceMemberNumber: c.MemberNumber });
  ChatRoomAddCharacterToChatRoom(c);
};
function frame() {
  activePreference?.run();
  requestAnimationFrame(frame);
}
frame();
