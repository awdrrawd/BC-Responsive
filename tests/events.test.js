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
    ServerSend() {},
  };
  const sdk = {
    hookFunction(name, _priority, callback) {
      hooks.set(name, callback);
    },
  };
  installEvents({ sdk, submit: (event) => submitted.push(event), mouth: { receive() {} }, reset() {}, host });
  const room = { Name: 'Room', SourceMemberNumber: 2 };
  hooks.get('ChatRoomSync')([room], () => {
    host.ChatRoomData = room;
  });
  const guest = { MemberNumber: 2 };
  hooks.get('ChatRoomAddCharacterToChatRoom')([guest], () => host.ChatRoomCharacter.push(guest));
  host.ChatRoomCharacter.pop();
  assert.equal(hooks.has('ChatRoomSyncMemberLeave'), false, 'visitor departure needs no hook');
  hooks.get('ChatRoomAttemptLeave')([], () => {});
  hooks.get('ChatRoomLeave')([], () => {
    host.ChatRoomData = null;
    hooks.get('ServerSend')(['ChatRoomLeave', ''], () => {});
  });
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
    hooks.get('ChatRoomSync')([{ Name: 'Room', SourceMemberNumber: 2 }], () =>
      Promise.reject(Error('offline')),
    ),
    /offline/,
  );
  assert.equal(submitted.length, 0);
  const visitor = { MemberNumber: 2 };
  hooks.get('ChatRoomAddCharacterToChatRoom')([visitor], () => host.ChatRoomCharacter.push(visitor));
  assert.equal(submitted[0].event, 'visitor');
});

function lifecycle(extra = {}) {
  const hooks = new Map(),
    submitted = [];
  let resets = 0;
  const player = { MemberNumber: 1, IsSlow: () => true };
  const host = {
    CurrentScreen: 'ChatRoom',
    ChatRoomData: null,
    Player: player,
    ChatRoomCharacter: [player],
    ChatRoomSlowtimer: 0,
    ChatRoomRegisterMessageHandler() {},
    ChatRoomAttemptLeave() {},
    ChatRoomLeave() {},
    ServerSend() {},
    ...extra,
  };
  installEvents({
    sdk: { hookFunction: (name, _priority, fn) => hooks.set(name, fn) },
    host,
    submit: (event) => submitted.push(event),
    mouth: { receive() {} },
    reset: () => resets++,
  });
  return { hooks, host, submitted, resets: () => resets };
}

test('a rejected or malformed room sync is not a join and malformed payloads reset nothing', async () => {
  const w = lifecycle();
  // BC drops invalid payloads before changing anything.
  w.hooks.get('ChatRoomSync')([null], () => {});
  w.hooks.get('ChatRoomSync')([{ Name: 'x' }], () => {});
  assert.equal(w.resets(), 0);
  assert.deepEqual(w.submitted, []);
  // A duplicate/invalid room makes BC leave again: ChatRoomData ends up null.
  const rejected = { Name: 'Room', SourceMemberNumber: 2 };
  await w.hooks.get('ChatRoomSync')([rejected], async () => {
    w.host.ChatRoomData = null;
  });
  assert.deepEqual(w.submitted, []);
  const accepted = { Name: 'Room', SourceMemberNumber: 2 };
  await w.hooks.get('ChatRoomSync')([accepted], async () => {
    w.host.ChatRoomData = accepted;
  });
  assert.deepEqual(
    w.submitted.map((event) => event.event),
    ['join'],
  );
});

test('slow leave is only reported when BC would actually start leaving', () => {
  let canLeave = false;
  const w = lifecycle({ ChatRoomCanLeave: () => canLeave });
  w.hooks.get('ChatRoomAttemptLeave')([], () => {});
  assert.deepEqual(w.submitted, [], 'leashed or immobile players cannot leave');
  canLeave = true;
  w.hooks.get('ChatRoomAttemptLeave')([], () => {});
  assert.deepEqual(
    w.submitted.map((event) => event.event),
    ['slowLeave'],
  );
});
