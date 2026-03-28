import GameRoom from './GameRoom.js';

/**
 * GameManager — Singleton managing all active game rooms.
 */
export default class GameManager {
  constructor(io) {
    this.io = io;
    this.rooms = new Map(); // roomCode → GameRoom
  }

  generateRoomCode() {
    const words = ['GIT', 'CODE', 'BUG', 'HACK', 'SUDO', 'NPM', 'DEV', 'API'];
    const w1 = words[Math.floor(Math.random() * words.length)];
    const w2 = words[Math.floor(Math.random() * words.length)];
    const num = Math.floor(Math.random() * 99) + 1;
    return `${w1}-${w2}-${num}`;
  }

  createRoom(hostUid, hostName) {
    let code = this.generateRoomCode();
    while (this.rooms.has(code)) code = this.generateRoomCode();

    const room = new GameRoom(this.io, code, hostUid, hostName);
    this.rooms.set(code, room);
    return room;
  }

  getRoom(roomCode) {
    return this.rooms.get(roomCode) || null;
  }

  joinRoom(roomCode, uid, username, socketId) {
    const room = this.rooms.get(roomCode);
    if (!room) return { success: false, error: 'Room not found' };
    return room.addPlayer(uid, username, socketId);
  }

  leaveRoom(roomCode, uid) {
    const room = this.rooms.get(roomCode);
    if (!room) return;
    const result = room.removePlayer(uid);
    if (result === 'EMPTY') {
      room.destroy();
      this.rooms.delete(roomCode);
      console.log(`🗑️ Room ${roomCode} auto-cleaned (empty)`);
    }
  }

  findRoomByPlayer(uid) {
    for (const [code, room] of this.rooms) {
      if (room.players.has(uid)) return { code, room };
    }
    return null;
  }

  getActiveRoomCount() {
    return this.rooms.size;
  }

  getRoomList() {
    return [...this.rooms.entries()]
      .filter(([, r]) => r.phase === 'lobby')
      .map(([code, r]) => ({
        roomCode: code,
        playerCount: r.players.size,
        hostUid: r.hostUid,
      }));
  }
}
