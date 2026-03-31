import TimerManager from './TimerManager.js';
import SabotageManager from './SabotageManager.js';
import * as GameSessionModel from '../models/GameSession.js';
import * as UserModel from '../models/User.js';
import { getRandomPrompt, trackUsage } from '../models/Prompt.js';
import { resolvePromptForGame, getRandomCatalogPrompt } from '../data/promptCatalog.js';
import { processPostGame } from '../services/statsService.js';
import { executeCode } from '../services/piston.js';

const PHASES = ['lobby', 'roleReveal', 'coding', 'voting', 'build', 'gameEnd'];
const DEFAULT_PHASE_DURATIONS = {
  roleReveal: 5,
  coding: 240,
  voting: 60,
  build: 30,
  gameEnd: 15,
};

/**
 * GameRoom — State machine for a single game room.
 * Manages players, phases, roles, voting, and scoring.
 */
export default class GameRoom {
  constructor(io, roomCode, hostUid, hostName) {
    this.io = io;
    this.roomCode = roomCode;
    this.hostUid = hostUid;
    this.phase = 'lobby';
    this.timer = new TimerManager(io, roomCode);
    this.sabotage = new SabotageManager(io, roomCode);

    // Per-room phase durations (copy from defaults so mutations don't leak)
    this.phaseDurations = { ...DEFAULT_PHASE_DURATIONS };

    // Players: Map<uid, { uid, username, socketId, role, status, votes }>
    this.players = new Map();
    this.prompt = null;
    this.meetingNumber = 0;
    this.votes = {};          // current meeting votes: { voterUid: targetUid }
    this.winner = null;
    this.finalCode = null;
    this.testResults = null;

    // Meeting guard — prevents multiple meetings from being queued
    this._meetingPending = false;

    // Track remaining coding seconds so we can resume after a meeting
    this._codingTimeRemaining = null;

    // Reference to YjsServer (set externally after construction)
    this.yjsServer = null;

    // Create Firestore session
    GameSessionModel.createSession(roomCode, hostUid, hostName).catch(() => {});

    console.log(`🏠 [${roomCode}] Room created by ${hostName}`);
  }

  // ──────────────── PLAYER MANAGEMENT ────────────────

  addPlayer(uid, username, socketId) {
    if (this.phase !== 'lobby') return { success: false, error: 'Game already in progress' };
    if (this.players.size >= 8) return { success: false, error: 'Room is full (8 max)' };
    if (this.players.has(uid)) {
      // Reconnection — update socketId
      this.players.get(uid).socketId = socketId;
      return { success: true, reconnected: true };
    }

    this.players.set(uid, {
      uid, username, socketId,
      role: null,
      status: 'alive',
    });
    GameSessionModel.addPlayer(this.roomCode, uid, { username }).catch(() => {});
    this.broadcastState();
    return { success: true };
  }

  removePlayer(uid) {
    const player = this.players.get(uid);
    if (!player) return;
    this.players.delete(uid);
    GameSessionModel.removePlayer(this.roomCode, uid).catch(() => {});

    // Transfer host if needed
    if (uid === this.hostUid && this.players.size > 0) {
      this.hostUid = this.players.keys().next().value;
      this.io.to(this.roomCode).emit('game:hostChanged', { newHostUid: this.hostUid });
    }

    // If no players, signal cleanup
    if (this.players.size === 0) return 'EMPTY';
    this.broadcastState();
  }

  /**
   * Handle a player leaving mid-game.
   * Marks them as 'left' (not alive) and checks if the game should end.
   */
  leaveGameMidMatch(uid) {
    const player = this.players.get(uid);
    if (!player) return;

    // Mark as left so they don't count toward alive players
    player.status = 'left';

    // Do NOT expose role — it compromises the social-deduction game
    this.io.to(this.roomCode).emit('player:left', {
      uid,
      username: player.username,
    });

    // Check if game is still viable
    const alive = this.getAlivePlayers();
    const impostorsAlive = alive.filter(p => p.role === 'impostor').length;
    const crewmatesAlive = alive.filter(p => p.role === 'crewmate').length;

    if (impostorsAlive === 0) {
      this.winner = 'crewmates';
      this.io.to(this.roomCode).emit('game:forceEnd', {
        reason: 'Impostor left the game',
        winner: 'crewmates',
      });
      setTimeout(() => this.transitionTo('gameEnd'), 1500);
    } else if (crewmatesAlive === 0 || impostorsAlive >= crewmatesAlive) {
      this.winner = 'impostor';
      this.io.to(this.roomCode).emit('game:forceEnd', {
        reason: 'Not enough crewmates to continue',
        winner: 'impostor',
      });
      setTimeout(() => this.transitionTo('gameEnd'), 1500);
    } else {
      this.broadcastState();
    }
  }

  reconnectPlayer(uid, socketId) {
    const player = this.players.get(uid);
    if (!player) return false;
    player.socketId = socketId;
    return true;
  }

  // ──────────────── GAME START ────────────────

  async startGame(requestingUid, settings = {}) {
    if (requestingUid !== this.hostUid) return { success: false, error: 'Only host can start' };
    if (this.players.size < 2) return { success: false, error: 'Need at least 2 players' };
    if (this.phase !== 'lobby') return { success: false, error: 'Game already started' };

    // Store settings
    this.settings = settings;
    const { promptId, timerDuration, language } = settings;

    // Override coding phase duration if host set a custom timer
    if (timerDuration && [120, 240, 360, 480].includes(timerDuration)) {
      this.phaseDurations.coding = timerDuration;
    }

    // Resolve prompt: use catalog first, fall back to Firestore
    if (promptId && promptId !== 'random') {
      this.prompt = resolvePromptForGame(promptId, language || 'javascript');
    }
    if (!this.prompt && promptId === 'random') {
      this.prompt = resolvePromptForGame('random', language || 'javascript');
    }
    if (!this.prompt) {
      // Fallback to Firestore prompts
      this.prompt = await getRandomPrompt();
      if (this.prompt?.id !== 'fallback') trackUsage(this.prompt.id).catch(() => {});
    }

    // Assign roles: 1 impostor, rest crewmates
    const uids = [...this.players.keys()];
    const impostorIdx = Math.floor(Math.random() * uids.length);
    uids.forEach((uid, i) => {
      this.players.get(uid).role = i === impostorIdx ? 'impostor' : 'crewmate';
    });

    // Update Firestore
    GameSessionModel.updateSession(this.roomCode, {
      status: 'active',
      promptId: this.prompt.id,
      promptTitle: this.prompt.title,
      startedAt: new Date(),
    }).catch(() => {});

    // Update player roles in Firestore
    for (const [uid, p] of this.players) {
      GameSessionModel.updatePlayer(this.roomCode, uid, { role: p.role }).catch(() => {});
    }

    this.transitionTo('roleReveal');
    return { success: true };
  }

  // ──────────────── PHASE TRANSITIONS ────────────────

  transitionTo(phase) {
    this.phase = phase;
    console.log(`⏩ [${this.roomCode}] Phase → ${phase}`);

    switch (phase) {
      case 'roleReveal':
        // Send each player their role privately
        for (const [uid, player] of this.players) {
          this.io.to(player.socketId).emit('game:roleReveal', {
            role: player.role,
            prompt: this.prompt,
          });
        }
        this.timer.start(this.phaseDurations.roleReveal, () => this.transitionTo('coding'));
        break;

      case 'coding': {
        // Use remaining time if resuming after a meeting, otherwise full duration
        const codingDuration = this._codingTimeRemaining ?? this.phaseDurations.coding;
        this._codingTimeRemaining = null; // consumed
        this._meetingPending = false;      // reset meeting guard
        this.io.to(this.roomCode).emit('game:codingStart', {
          prompt: this.prompt,
          duration: codingDuration,
          language: this.settings?.language || 'javascript',
        });
        this.timer.start(codingDuration, () => this.transitionTo('build'));
        break;
      }

      case 'voting':
        this.meetingNumber++;
        this.votes = {};
        // Snapshot the remaining coding time BEFORE stopping the timer
        this._codingTimeRemaining = this.timer.getRemaining();
        this.timer.stop();
        this.io.to(this.roomCode).emit('game:votingStart', {
          meetingNumber: this.meetingNumber,
          duration: this.phaseDurations.voting,
          alivePlayers: this.getAlivePlayers(),
        });
        this.timer.start(this.phaseDurations.voting, () => this.resolveVoting());
        break;

      case 'build':
        this.timer.stop();
        this.io.to(this.roomCode).emit('game:buildStart', { duration: this.phaseDurations.build });
        this.runCodeExecution();
        break;

      case 'gameEnd':
        this.timer.stop();
        this.io.to(this.roomCode).emit('game:end', {
          winner: this.winner,
          players: [...this.players.values()].map(p => ({
            uid: p.uid, username: p.username, role: p.role, status: p.status,
          })),
          testResults: this.testResults,
        });
        this.saveResults();
        this.timer.start(this.phaseDurations.gameEnd, () => {}); // auto-cleanup timer
        break;
    }

    this.broadcastState();
  }

  // ──────────────── VOTING ────────────────

  castVote(voterUid, targetUid) {
    if (this.phase !== 'voting') return { success: false, error: 'Not in voting phase' };
    const voter = this.players.get(voterUid);
    if (!voter || voter.status !== 'alive') return { success: false, error: 'Not eligible to vote' };

    this.votes[voterUid] = targetUid; // 'skip' or a player UID
    GameSessionModel.recordVote(this.roomCode, this.meetingNumber, voterUid, targetUid).catch(() => {});

    // Broadcast anonymous vote count
    const voteCount = Object.keys(this.votes).length;
    const totalAlive = this.getAlivePlayers().length;
    this.io.to(this.roomCode).emit('game:voteUpdate', { voteCount, totalAlive });

    // Auto-resolve if all alive players have voted
    if (voteCount >= totalAlive) {
      this.timer.stop();
      this.resolveVoting();
    }
    return { success: true };
  }

  resolveVoting() {
    // Tally votes
    const tally = {};
    for (const target of Object.values(this.votes)) {
      tally[target] = (tally[target] || 0) + 1;
    }

    // Find player with most votes (skip ties)
    let maxVotes = 0, eliminated = null, isTie = false;
    for (const [target, count] of Object.entries(tally)) {
      if (target === 'skip') continue;
      if (count > maxVotes) { maxVotes = count; eliminated = target; isTie = false; }
      else if (count === maxVotes) { isTie = true; }
    }

    const skipCount = tally['skip'] || 0;
    if (isTie || skipCount >= maxVotes) eliminated = null; // tie or majority skip

    if (eliminated) {
      const player = this.players.get(eliminated);
      if (player) {
        player.status = 'eliminated';
        GameSessionModel.updatePlayer(this.roomCode, eliminated, { status: 'eliminated' }).catch(() => {});
      }
    }

    this.io.to(this.roomCode).emit('game:voteResult', {
      tally,
      eliminated: eliminated ? {
        uid: eliminated,
        username: this.players.get(eliminated)?.username,
        role: this.players.get(eliminated)?.role,
      } : null,
      skipped: !eliminated,
    });

    GameSessionModel.updateSession(this.roomCode, { meetingsCalled: this.meetingNumber }).catch(() => {});

    // Check win conditions
    if (this.checkWinCondition()) {
      setTimeout(() => this.transitionTo('gameEnd'), 3000);
    } else {
      setTimeout(() => this.transitionTo('coding'), 3000);
    }
  }

  // ──────────────── SABOTAGE ────────────────

  useSabotage(uid, abilityId) {
    if (this.phase !== 'coding') return { success: false, error: 'Can only sabotage during coding' };
    const player = this.players.get(uid);
    if (!player || player.role !== 'impostor') return { success: false, error: 'Not the impostor' };

    const crewmateSockets = [];
    for (const [, p] of this.players) {
      if (p.role === 'crewmate' && p.status === 'alive') {
        crewmateSockets.push(p.socketId);
      }
    }

    const result = this.sabotage.use(abilityId, player.socketId, crewmateSockets);
    if (result.success) {
      GameSessionModel.updatePlayer(this.roomCode, uid, {
        sabotagesUsed: (this.players.get(uid).sabotagesUsed || 0) + 1,
      }).catch(() => {});
    }
    return result;
  }

  // ──────────────── REPORT BUG (CALL MEETING) ────────────────

  reportBug(uid) {
    if (this.phase !== 'coding') return { success: false, error: 'Can only report during coding' };
    // Guard against multiple meetings being queued during the 2s delay
    if (this._meetingPending) return { success: false, error: 'A meeting is already being called' };
    const player = this.players.get(uid);
    if (!player || player.status !== 'alive') return { success: false, error: 'Not eligible' };

    this._meetingPending = true;

    GameSessionModel.updatePlayer(this.roomCode, uid, {
      bugsReported: (player.bugsReported || 0) + 1,
    }).catch(() => {});

    this.io.to(this.roomCode).emit('game:meetingCalled', {
      calledBy: { uid: player.uid, username: player.username },
    });

    setTimeout(() => this.transitionTo('voting'), 2000);
    return { success: true };
  }

  // ──────────────── CODE EXECUTION ────────────────

  async runCodeExecution() {
    try {
      // Try to grab the live editor content from the Yjs document first
      let code = this.finalCode;
      if (!code && this.yjsServer) {
        code = this.yjsServer.getCode(this.roomCode);
      }
      code = code || this.prompt?.starterCode || '';
      const testCases = this.prompt?.testCases || [];

      if (!code || testCases.length === 0) {
        this.testResults = { passed: 0, total: 0, error: 'No code or test cases' };
        this.winner = 'impostor';
        this.transitionTo('gameEnd');
        return;
      }

      const results = await executeCode(code, testCases, this.prompt.language || 'javascript');
      this.testResults = results;

      // Crewmates win if ALL tests pass, impostor wins otherwise
      this.winner = results.allPassed ? 'crewmates' : 'impostor';
      this.transitionTo('gameEnd');
    } catch (err) {
      console.error(`[${this.roomCode}] Code execution failed:`, err.message);
      this.testResults = { passed: 0, total: 0, error: err.message };
      this.winner = 'impostor';
      this.transitionTo('gameEnd');
    }
  }

  submitCode(code) {
    this.finalCode = code;
  }

  // ──────────────── WIN CONDITIONS ────────────────

  checkWinCondition() {
    const alive = this.getAlivePlayers();
    const impostorsAlive = alive.filter(p => p.role === 'impostor').length;
    const crewmatesAlive = alive.filter(p => p.role === 'crewmate').length;

    if (impostorsAlive === 0) {
      this.winner = 'crewmates';
      return true;
    }
    if (impostorsAlive >= crewmatesAlive) {
      this.winner = 'impostor';
      return true;
    }
    return false;
  }

  // ──────────────── SAVE RESULTS ────────────────

  async saveResults() {
    GameSessionModel.setWinner(this.roomCode, this.winner, this.finalCode, this.testResults).catch(() => {});

    // Process post-game stats for each player
    for (const [uid, player] of this.players) {
      const won = (player.role === 'impostor' && this.winner === 'impostor') ||
                  (player.role === 'crewmate' && this.winner === 'crewmates');
      processPostGame(uid, player.role, won).catch(() => {});
    }
  }

  // ──────────────── HELPERS ────────────────

  getAlivePlayers() {
    return [...this.players.values()].filter(p => p.status === 'alive');
  }

  getState() {
    return {
      roomCode: this.roomCode,
      phase: this.phase,
      hostUid: this.hostUid,
      playerCount: this.players.size,
      players: [...this.players.values()].map(p => ({
        uid: p.uid,
        username: p.username,
        status: p.status,
        // Never expose role to clients — handled per-player in roleReveal
      })),
      prompt: this.phase !== 'lobby' ? { title: this.prompt?.title, description: this.prompt?.description } : null,
      timerRemaining: this.timer.getRemaining(),
    };
  }

  broadcastState() {
    this.io.to(this.roomCode).emit('game:state', this.getState());
  }

  destroy() {
    this.timer.destroy();
    this.sabotage.destroy();
    this.players.clear();
    console.log(`🗑️ [${this.roomCode}] Room destroyed`);
  }
}
