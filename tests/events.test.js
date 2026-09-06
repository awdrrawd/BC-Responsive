import test from 'node:test';
import assert from 'node:assert/strict';
import { installEvents } from '../src/integrations/events.js';

test('room lifecycle maps join, visitor, slow leave and leave to distinct events', () => {
  const hooks = new Map(),
    submitted = [],
    player = { MemberNumber: 1, IsSlow: () => true };
  const host = {
    CurrentScreen: 'ChatRoom',
    ChatRoomData: { Name: 'Room' },
    Player: player,
    ChatRoomCharacter: [player],
    ChatRoomSlowtimer: 0,
    ChatRoomRegisterMessageHandler() {},
    ChatRoomSync() {},
    ChatRoomAddCharacterToChatRoom() {},
    ChatRoomSyncMemberLeave() {},
    ChatRoomAttemptLeave() {},
    ChatRoomLeave() {},
  };
  const sdk = {
    hookFunction(name, _priority, callback) {
      hooks.set(name, callback);
    },
  };
  installEvents({ sdk, submit: (event) => submitted.push(event), mouth: { receive() {} }, reset() {}, host });
  hooks.get('ChatRoomSync')([], () => {});
  const guest = { MemberNumber: 2 };
  hooks.get('ChatRoomAddCharacterToChatRoom')([guest], () => host.ChatRoomCharacter.push(guest));
  host.ChatRoomCharacter.pop();
  assert.equal(hooks.has('ChatRoomSyncMemberLeave'), false, 'visitor departure needs no hook');
  hooks.get('ChatRoomAttemptLeave')([], () => {});
  hooks.get('ChatRoomLeave')([], () => {});
  assert.deepEqual(
    submitted.map((event) => event.event),
    ['join', 'visitor', 'slowLeave', 'leave'],
  );
  assert.deepEqual(
    submitted.map((event) => event.actor),
    [1, 2, 1, 1],
  );
});

test('failed room synchronization never emits join and releases the visitor guard', async () => {
  const hooks = new Map(),
    submitted = [];
  const host = {
    Player: { MemberNumber: 1 },
    CurrentScreen: 'ChatRoom',
    ChatRoomData: { Name: 'Room' },
    ChatRoomCharacter: [],
    ChatRoomRegisterMessageHandler() {},
  };
  installEvents({
    sdk: { hookFunction: (name, priority, fn) => hooks.set(name, fn) },
    host,
    submit: (event) => submitted.push(event),
    mouth: { receive() {} },
    reset() {},
  });
  await assert.rejects(
    hooks.get('ChatRoomSync')([], () => Promise.reject(Error('offline'))),
    /offline/,
  );
  assert.equal(submitted.length, 0);
  const visitor = { MemberNumber: 2 };
  hooks.get('ChatRoomAddCharacterToChatRoom')([visitor], () => host.ChatRoomCharacter.push(visitor));
  assert.equal(submitted[0].event, 'visitor');
});
