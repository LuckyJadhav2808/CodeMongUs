/**
 * Socket.io event handler registration.
 * Maps incoming events to GameManager/GameRoom methods.
 */
import { getCatalogList, getHints } from '../data/promptCatalog.js';
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

    // Leave mid-game (voluntary quit)
    socket.on('game:leave', (_, callback) => {
      if (!currentRoom) return callback?.({ success: false });
      const room = gameManager.getRoom(currentRoom);
      if (!room) return callback?.({ success: false });

      if (room.phase !== 'lobby' && room.phase !== 'gameEnd') {
        room.leaveGameMidMatch(user.uid);
      } else {
        gameManager.leaveRoom(currentRoom, user.uid);
      }
      socket.leave(currentRoom);
      currentRoom = null;
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

    // ──────── SETTINGS SYNC ────────

    socket.on('room:updateSettings', (settings) => {
      if (!currentRoom) return;
      const room = gameManager.getRoom(currentRoom);
      if (!room) return;
      // Only the host can update settings
      if (room.hostUid !== user.uid) return;
      // Broadcast to all players in the room
      io.to(currentRoom).emit('room:settingsUpdated', settings);
    });

    // ──────── PROMPT CATALOG ────────

    socket.on('prompts:list', (_, callback) => {
      callback?.({ prompts: getCatalogList() });
    });

    // ──────── HINTS ────────

    socket.on('game:requestHint', (_, callback) => {
      if (!currentRoom) return callback?.({ success: false });
      const room = gameManager.getRoom(currentRoom);
      if (!room || !room.prompt) return callback?.({ success: false });

      // Only crewmates can request hints
      const player = room.players.get(user.uid);
      if (!player || player.role !== 'crewmate') return callback?.({ success: false, error: 'Only crewmates can request hints' });

      const hints = getHints(room.prompt.id);
      if (!room._hintsUnlocked) room._hintsUnlocked = 0;

      if (room._hintsUnlocked >= hints.length) {
        return callback?.({ success: false, error: 'No more hints available' });
      }

      const hint = hints[room._hintsUnlocked];
      room._hintsUnlocked++;

      // Send hint to ALL players in the room
      io.to(currentRoom).emit('game:hintReceived', {
        hint,
        hintNumber: room._hintsUnlocked,
        totalHints: hints.length,
      });

      callback?.({ success: true });
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

    // ──────── COMMIT PROPOSAL (consensus) ────────

    socket.on('commit:propose', ({ code }) => {
      if (!currentRoom) return;
      const room = gameManager.getRoom(currentRoom);
      if (!room || room.phase !== 'coding') return;

      // Only crewmates can propose commits
      const player = room.players.get(user.uid);
      if (!player || player.role === 'impostor') return;

      // Reject if a proposal is already in progress
      if (room._commitProposal) return;

      // Count alive crewmates (excluding the proposer)
      const crewmates = [...room.players.entries()]
        .filter(([uid, p]) => p.status === 'alive' && p.role === 'crewmate' && uid !== user.uid);

      // If sole crewmate, auto-approve immediately
      if (crewmates.length === 0) {
        room.submitCode(code);
        io.to(currentRoom).emit('commit:proposed', {
          proposerUid: user.uid,
          proposerName: player.username,
          total: 0,
          needed: 0,
          approvals: 0,
          rejections: 0,
        });
        setTimeout(() => {
          io.to(currentRoom).emit('commit:result', { approved: true, message: 'Auto-approved (sole crewmate)' });
        }, 500);
        return;
      }

      const needed = Math.ceil(crewmates.length / 2);

      // Clear any lingering timer from a previous proposal (safety net)
      if (room._commitTimer) {
        clearTimeout(room._commitTimer);
        room._commitTimer = null;
      }

      // Store proposal on the room
      room._commitProposal = {
        proposerUid: user.uid,
        proposerName: player.username,
        code,
        votes: {},
        total: crewmates.length,
        needed,
        approvals: 0,
        rejections: 0,
      };

      // Broadcast to all players in the room
      io.to(currentRoom).emit('commit:proposed', {
        proposerUid: user.uid,
        proposerName: player.username,
        total: crewmates.length,
        needed,
        approvals: 0,
        rejections: 0,
      });

      // Auto-expire after 15 seconds
      room._commitTimer = setTimeout(() => {
        if (room._commitProposal) {
          io.to(currentRoom).emit('commit:result', { approved: false, message: 'Commit proposal expired' });
          room._commitProposal = null;
        }
        room._commitTimer = null;
      }, 15000);
    });

    socket.on('commit:respond', ({ approve }) => {
      if (!currentRoom) return;
      const room = gameManager.getRoom(currentRoom);
      if (!room || !room._commitProposal) return;

      const proposal = room._commitProposal;
      // Can't vote on your own proposal, and can't vote twice
      if (user.uid === proposal.proposerUid) return;
      if (proposal.votes[user.uid] !== undefined) return;

      // Only crewmates can vote
      const player = room.players.get(user.uid);
      if (!player || player.role !== 'crewmate') return;

      proposal.votes[user.uid] = approve;
      if (approve) proposal.approvals++;
      else proposal.rejections++;

      // Broadcast updated counts
      io.to(currentRoom).emit('commit:update', {
        approvals: proposal.approvals,
        rejections: proposal.rejections,
      });

      // Check if we have enough votes
      const rejected = proposal.rejections > proposal.total - proposal.needed;
      if (proposal.approvals >= proposal.needed) {
        // Approved! Submit the code
        clearTimeout(room._commitTimer);
        room.submitCode(proposal.code);
        io.to(currentRoom).emit('commit:result', { approved: true, message: 'Commit approved!' });
        room._commitProposal = null;
      } else if (rejected) {
        // Rejected
        clearTimeout(room._commitTimer);
        io.to(currentRoom).emit('commit:result', { approved: false, message: 'Commit rejected by crew' });
        room._commitProposal = null;
      }
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
          if (room.phase !== 'lobby' && room.phase !== 'gameEnd') {
            // Mid-game disconnect — treat as leaving
            room.leaveGameMidMatch(user.uid);
          } else {
            gameManager.leaveRoom(currentRoom, user.uid);
          }
        }
      }
    });
  });
}
