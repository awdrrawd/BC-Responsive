import test from 'node:test';
import assert from 'node:assert/strict';
import { installEvents } from '../src/integrations/events.js';

test('room lifecycle maps join, visitor, slow leave and leave to distinct events', () => {
  const hooks = new Map(), submitted = [], player = { MemberNumber: 1, IsSlow: () => true };
  const host = {
    CurrentScreen: 'ChatRoom', ChatRoomData: { Name: 'Room' }, Player: player,
    ChatRoomCharacter: [player], ChatRoomSlowtimer: 0,
    ChatRoomRegisterMessageHandler() {}, ChatRoomSync() {}, ChatRoomAddCharacterToChatRoom() {},
    ChatRoomSyncMemberLeave() {}, ChatRoomAttemptLeave() {}, ChatRoomLeave() {},
  };
  const sdk = { hookFunction(name, _priority, callback) { hooks.set(name, callback); } };
  installEvents({ sdk, submit: event => submitted.push(event), mouth: { receive() {} }, reset() {}, host });
  hooks.get('ChatRoomSync')([], () => {});
  const guest = { MemberNumber: 2 }; hooks.get('ChatRoomAddCharacterToChatRoom')([guest], () => host.ChatRoomCharacter.push(guest));
  hooks.get('ChatRoomSyncMemberLeave')([{ SourceMemberNumber: 2 }], () => host.ChatRoomCharacter.pop());
  hooks.get('ChatRoomAttemptLeave')([], () => {});
  hooks.get('ChatRoomLeave')([], () => {});
  assert.deepEqual(submitted.map(event => event.event), ['join', 'visitor', 'slowLeave', 'leave']);
  assert.deepEqual(submitted.map(event => event.actor), [1, 2, 1, 1]);
});
