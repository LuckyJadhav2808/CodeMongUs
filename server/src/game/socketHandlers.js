/**
 * Socket.io event handler registration.
 * Maps incoming events to GameManager/GameRoom methods.
 */
import { getCatalogList } from '../data/promptCatalog.js';
export function registerSocketHandlers(io, gameManager) {
  io.on('connection', (socket) => {
    const user = socket.user;
    console.log(`🔌 Connected: ${user.name} (${user.uid})`);

    let currentRoom = null; // track which room this socket is in

    // ──────── ROOM MANAGEMENT ────────

    socket.on('room:create', (data, callback) => {
      const room = gameManager.createRoom(user.uid, data?.username || user.name);
      currentRoom = room.roomCode;
      room.addPlayer(user.uid, data?.username || user.name, socket.id);
      socket.join(room.roomCode);
      callback?.({ success: true, roomCode: room.roomCode, state: room.getState() });
    });

    socket.on('room:join', ({ roomCode, username }, callback) => {
      const result = gameManager.joinRoom(roomCode, user.uid, username || user.name, socket.id);
      if (result.success) {
        currentRoom = roomCode;
        socket.join(roomCode);
        const room = gameManager.getRoom(roomCode);
        callback?.({ success: true, state: room.getState() });
      } else {
        callback?.(result);
      }
    });

    socket.on('room:leave', (_, callback) => {
      if (currentRoom) {
        socket.leave(currentRoom);
        gameManager.leaveRoom(currentRoom, user.uid);
        currentRoom = null;
      }
      callback?.({ success: true });
    });

    socket.on('room:list', (_, callback) => {
      callback?.({ rooms: gameManager.getRoomList() });
    });

    // ──────── GAME FLOW ────────

    socket.on('game:start', async (data, callback) => {
      const room = gameManager.getRoom(currentRoom);
      if (!room) return callback?.({ success: false, error: 'Not in a room' });
      const settings = data || {};
      const result = await room.startGame(user.uid, settings);
      callback?.(result);
    });

    // ──────── PROMPT CATALOG ────────

    socket.on('prompts:list', (_, callback) => {
      callback?.({ prompts: getCatalogList() });
    });

    socket.on('game:reportBug', (_, callback) => {
      const room = gameManager.getRoom(currentRoom);
      if (!room) return callback?.({ success: false, error: 'Not in a room' });
      const result = room.reportBug(user.uid);
      callback?.(result);
    });

    socket.on('game:submitCode', ({ code }) => {
      const room = gameManager.getRoom(currentRoom);
      if (room) room.submitCode(code);
    });

    // ──────── VOTING ────────

    socket.on('vote:cast', ({ targetUid }, callback) => {
      const room = gameManager.getRoom(currentRoom);
      if (!room) return callback?.({ success: false, error: 'Not in a room' });
      const result = room.castVote(user.uid, targetUid);
      callback?.(result);
    });

    socket.on('vote:skip', (_, callback) => {
      const room = gameManager.getRoom(currentRoom);
      if (!room) return callback?.({ success: false, error: 'Not in a room' });
      const result = room.castVote(user.uid, 'skip');
      callback?.(result);
    });

    // ──────── SABOTAGE ────────

    socket.on('sabotage:use', ({ abilityId }, callback) => {
      const room = gameManager.getRoom(currentRoom);
      if (!room) return callback?.({ success: false, error: 'Not in a room' });
      const result = room.useSabotage(user.uid, abilityId);
      callback?.(result);
    });

    // ──────── CHAT ────────

    socket.on('chat:send', ({ message }) => {
      if (!currentRoom) return;
      io.to(currentRoom).emit('chat:message', {
        uid: user.uid,
        username: user.name,
        message,
        timestamp: Date.now(),
      });
    });

    // ──────── DISCONNECT ────────

    socket.on('disconnect', () => {
      console.log(`🔌 Disconnected: ${user.name} (${user.uid})`);
      if (currentRoom) {
        const room = gameManager.getRoom(currentRoom);
        if (room) {
          // If game is active, mark as disconnected but keep in game
          if (room.phase !== 'lobby' && room.phase !== 'gameEnd') {
            room.io.to(currentRoom).emit('player:disconnected', {
              uid: user.uid, username: user.name,
            });
          } else {
            gameManager.leaveRoom(currentRoom, user.uid);
          }
        }
      }
    });
  });
}
