import TimerManager from './TimerManager.js';
import SabotageManager from './SabotageManager.js';
import * as GameSessionModel from '../models/GameSession.js';
import * as UserModel from '../models/User.js';
import { getRandomPrompt, trackUsage } from '../models/Prompt.js';
import { resolvePromptForGame, getRandomCatalogPrompt } from '../data/promptCatalog.js';
import { processPostGame } from '../services/statsService.js';
import { executeCode } from '../services/piston.js';
import { askOracle } from '../services/aiService.js';
import { getRandomTaunt } from '../data/taunts.js';
import { calculateXpEarned, getRankForXp } from '../data/ranks.js';

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
    this.chatHistory = [];     // persisted chat messages for reconnection

    // Meeting guard — prevents multiple meetings from being queued
    this._meetingPending = false;

    // Track remaining coding seconds so we can resume after a meeting
    this._codingTimeRemaining = null;

    // Reference to YjsServer (set externally after construction)
    this.yjsServer = null;

    // Create Firestore session
    GameSessionModel.createSession(roomCode, hostUid, hostName).catch(() => { });

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
    GameSessionModel.addPlayer(this.roomCode, uid, { username }).catch(() => { });
    this.broadcastState();
    return { success: true };
  }

  removePlayer(uid) {
    const player = this.players.get(uid);
    if (!player) return;
    this.players.delete(uid);
    GameSessionModel.removePlayer(this.roomCode, uid).catch(() => { });

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

    // Recalculate commit proposal threshold if one is active
    if (this._commitProposal) {
      const crewmates = [...this.players.entries()]
        .filter(([id, p]) => p.status === 'alive' && p.role === 'crewmate' && id !== this._commitProposal.proposerUid);
      this._commitProposal.total = crewmates.length;
      this._commitProposal.needed = Math.max(1, Math.ceil(crewmates.length / 2));
    }

    // Check if game is still viable
    const alive = this.getAlivePlayers();
    const impostorsAlive = alive.filter(p => p.role === 'impostor').length;
    const crewmatesAlive = alive.filter(p => p.role === 'crewmate').length;

    if (impostorsAlive === 0) {
      this.winner = 'crewmates';
      // Stop the active timer immediately to prevent double transitions
      this.timer.stop();
      this.io.to(this.roomCode).emit('game:forceEnd', {
        reason: 'Impostor left the game',
        winner: 'crewmates',
      });
      setTimeout(() => this.transitionTo('gameEnd'), 1500);
    } else if (crewmatesAlive === 0 || impostorsAlive >= crewmatesAlive) {
      this.winner = 'impostor';
      // Stop the active timer immediately to prevent double transitions
      this.timer.stop();
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

    // Send the reconnected player the full current game state
    this.io.to(socketId).emit('game:state', this.getState());

    // If coding or voting, resend timer so they're in sync
    if (this.timer.getRemaining() > 0) {
      this.io.to(socketId).emit('timer:start', { seconds: this.timer.getRemaining() });
    }

    // Resend their role privately
    if (player.role) {
      this.io.to(socketId).emit('game:roleReveal', {
        role: player.role,
        prompt: this.prompt,
      });
    }

    // Resend active sabotage state so the UI reflects it
    const cooldowns = this.sabotage.getCooldowns();
    if (Object.keys(cooldowns).length > 0) {
      this.io.to(socketId).emit('sabotage:syncState', { cooldowns });
    }

    // Resend chat history so the player doesn't lose context
    if (this.chatHistory.length > 0) {
      this.io.to(socketId).emit('chat:history', this.chatHistory);
    }

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
    if (timerDuration && [120, 240, 360, 480, 600, 900, 1200, 1800].includes(timerDuration)) {
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
      if (this.prompt?.id !== 'fallback') trackUsage(this.prompt.id).catch(() => { });
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
    }).catch(() => { });

    // Update player roles in Firestore
    for (const [uid, p] of this.players) {
      GameSessionModel.updatePlayer(this.roomCode, uid, { role: p.role }).catch(() => { });
    }

    this.gameStartedAt = Date.now();
    this._oracleHintsUsed = 0;
    this._lastOracleTime = null;
    this.commitChancesRemaining = 2;
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
        // Snapshot remaining coding time so we can resume if the commit fails
        this._codingTimeRemaining = this.timer.getRemaining();
        this.timer.stop();
        this.io.to(this.roomCode).emit('game:buildStart', { duration: this.phaseDurations.build });
        this.runCodeExecution();
        break;

      case 'gameEnd':
        this.timer.stop();

        // Compute match superlatives
        const matchHighlights = [];
        const allPlayers = [...this.players.values()];

        // Top Bug Reporter (most meetings called)
        const topBugReporter = allPlayers.reduce((best, p) =>
          (p.bugsReported || 0) > (best?.bugsReported || 0) ? p : best, null);
        if (topBugReporter && (topBugReporter.bugsReported || 0) > 0) {
          matchHighlights.push({
            emoji: '🐛', title: 'Top Bug Reporter',
            username: topBugReporter.username, value: topBugReporter.bugsReported,
          });
        }

        // Sabotage Master (most sabotages used)
        const topSaboteur = allPlayers.reduce((best, p) =>
          (p.sabotagesUsed || 0) > (best?.sabotagesUsed || 0) ? p : best, null);
        if (topSaboteur && (topSaboteur.sabotagesUsed || 0) > 0) {
          matchHighlights.push({
            emoji: '🔧', title: 'Sabotage Master',
            username: topSaboteur.username, value: topSaboteur.sabotagesUsed,
          });
        }

        // Mystery Hint usage (if any hints were used)
        if (this._oracleHintsUsed > 0) {
          matchHighlights.push({
            emoji: '🔮', title: 'Mystery Consulted',
            username: 'Team', value: `${this._oracleHintsUsed} hint${this._oracleHintsUsed > 1 ? 's' : ''}`,
          });
        }

        // Most Curious (most hints requested by a single player)
        const mostCurious = allPlayers.reduce((best, p) =>
          (p.hintsRequested || 0) > (best?.hintsRequested || 0) ? p : best, null);
        if (mostCurious && (mostCurious.hintsRequested || 0) > 0) {
          matchHighlights.push({
            emoji: '🧐', title: 'Most Curious',
            username: mostCurious.username, value: mostCurious.hintsRequested,
          });
        }

        // Top Detective (most votes cast)
        const topDetective = allPlayers.reduce((best, p) =>
          (p.votesCast || 0) > (best?.votesCast || 0) ? p : best, null);
        if (topDetective && (topDetective.votesCast || 0) > 0) {
          matchHighlights.push({
            emoji: '🕵️', title: 'Top Detective',
            username: topDetective.username, value: topDetective.votesCast,
          });
        }

        // Meeting Caller count
        const totalMeetings = this.meetingNumber;
        if (totalMeetings > 0) {
          matchHighlights.push({
            emoji: '🚨', title: 'Meetings Called',
            username: 'Team', value: totalMeetings,
          });
        }

        // Calculate XP for each player
        const xpResults = {};
        for (const p of allPlayers) {
          const won = (p.role === 'impostor' && this.winner === 'impostor') ||
            (p.role === 'crewmate' && this.winner === 'crewmates');
          const xpData = calculateXpEarned({
            won,
            survived: p.status === 'alive',
            bugsReported: p.bugsReported || 0,
            correctVotes: p.correctVotes || 0,
            sabotagesUsed: p.sabotagesUsed || 0,
            testsPassed: won ? (this.testResults?.passed || 0) : 0,
            hintsUsed: p.hintsRequested || 0,
          });
          xpResults[p.uid] = xpData;
        }

        this.io.to(this.roomCode).emit('game:end', {
          winner: this.winner,
          taunt: getRandomTaunt(this.winner === 'crewmates' ? 'crewmateWin' : 'impostorWin'),
          players: allPlayers.map(p => ({
            uid: p.uid, username: p.username, role: p.role, status: p.status,
          })),
          testResults: this.testResults,
          matchHighlights,
          xpResults,
        });
        this.saveResults();
        this.timer.start(this.phaseDurations.gameEnd, () => { }); // auto-cleanup timer
        break;
    }

    this.broadcastState();
  }

  // ──────────────── VOTING ────────────────

  castVote(voterUid, targetUid) {
    if (this.phase !== 'voting') return { success: false, error: 'Not in voting phase' };
    const voter = this.players.get(voterUid);
    if (!voter || voter.status !== 'alive') return { success: false, error: 'Not eligible to vote' };
    if (this.votes[voterUid] !== undefined) return { success: false, error: 'Already voted' };

    // Validate target: must be 'skip' or a living player's UID
    if (targetUid !== 'skip') {
      const target = this.players.get(targetUid);
      if (!target || target.status !== 'alive') {
        return { success: false, error: 'Invalid vote target' };
      }
    }

    this.votes[voterUid] = targetUid; // 'skip' or a player UID
    voter.votesCast = (voter.votesCast || 0) + 1;
    GameSessionModel.recordVote(this.roomCode, this.meetingNumber, voterUid, targetUid).catch(() => { });

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
        GameSessionModel.updatePlayer(this.roomCode, eliminated, { status: 'eliminated' }).catch(() => { });

        // Track correct votes — if the eliminated player was the impostor,
        // credit every voter who voted for them
        if (player.role === 'impostor') {
          for (const [voterUid, targetUid] of Object.entries(this.votes)) {
            if (targetUid === eliminated) {
              const voter = this.players.get(voterUid);
              if (voter) voter.correctVotes = (voter.correctVotes || 0) + 1;
            }
          }
        }
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

    GameSessionModel.updateSession(this.roomCode, { meetingsCalled: this.meetingNumber }).catch(() => { });

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
    if (player.status !== 'alive') return { success: false, error: 'Cannot sabotage while eliminated' };

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
      }).catch(() => { });
    }
    return result;
  }

  // ──────────────── ORACLE HINT (AI-DRIVEN) ────────────────

  /**
   * Request an AI-generated hint from the Oracle.
   * Costs 15 seconds off the timer. Rate-limited to 1 per 20s.
   */
  async requestOracleHint(uid) {
    if (this.phase !== 'coding') return { success: false, error: 'Can only use Oracle during coding' };

    const player = this.players.get(uid);
    if (!player || player.status !== 'alive') return { success: false, error: 'Not eligible' };
    if (player.role !== 'crewmate') return { success: false, error: 'Only crewmates can consult the Oracle' };

    // Hard limit: max 3 Oracle hints per game
    if (this._oracleHintsUsed >= 3) {
      return { success: false, error: 'Maximum Oracle hints (3) reached' };
    }

    // Rate limit: 1 hint per 20 seconds (room-wide cooldown)
    const now = Date.now();
    if (this._lastOracleTime && (now - this._lastOracleTime) < 20000) {
      const wait = Math.ceil((20000 - (now - this._lastOracleTime)) / 1000);
      return { success: false, error: `Oracle was recently consulted by the team. Wait ${wait}s` };
    }

    // Must have enough time left (at least 20s remaining)
    if (this.timer.getRemaining() < 20) {
      return { success: false, error: 'Not enough time remaining to consult the Oracle' };
    }

    // Get current code from Yjs
    let code = '';
    if (this.yjsServer) {
      code = this.yjsServer.getCode(this.roomCode) || '';
    }

    // Call the AI
    const result = await askOracle(
      code,
      this.prompt?.description || 'Debug the code',
      this.prompt?.functionSignature || ''
    );

    if (!result.success) {
      return { success: false, error: result.error || 'Oracle failed' };
    }

    // Deduct 15 seconds as penalty
    this.timer.adjust(-15);
    this._lastOracleTime = now;

    // Track hint count
    if (!this._oracleHintsUsed) this._oracleHintsUsed = 0;
    this._oracleHintsUsed++;

    // Track per-player hint requests
    const player2 = this.players.get(uid);
    if (player2) player2.hintsRequested = (player2.hintsRequested || 0) + 1;

    // Broadcast to all players in the room
    this.io.to(this.roomCode).emit('game:oracleHint', {
      hint: result.hint,
      hintNumber: this._oracleHintsUsed,
      requestedBy: player.username,
      timeCost: 15,
    });

    console.log(`🔮 [${this.roomCode}] Oracle hint #${this._oracleHintsUsed} requested by ${player.username}`);
    return { success: true };
  }

  // ──────────────── REPORT BUG (CALL MEETING) ────────────────

  reportBug(uid) {
    if (this.phase !== 'coding') return { success: false, error: 'Can only report during coding' };
    // Guard against multiple meetings being queued during the 2s delay
    if (this._meetingPending) return { success: false, error: 'A meeting is already being called' };
    // Block meetings while a commit proposal vote is in progress
    if (this._commitProposal) return { success: false, error: 'A commit vote is in progress' };
    const player = this.players.get(uid);
    if (!player || player.status !== 'alive') return { success: false, error: 'Not eligible' };

    this._meetingPending = true;

    // Cancel any lingering commit timer (safety net)
    if (this._commitTimer) {
      clearTimeout(this._commitTimer);
      this._commitTimer = null;
      this._commitProposal = null;
      this.io.to(this.roomCode).emit('commit:result', { approved: false, message: 'Cancelled — meeting called' });
    }

    GameSessionModel.updatePlayer(this.roomCode, uid, {
      bugsReported: (player.bugsReported || 0) + 1,
    }).catch(() => { });

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

      if (results.allPassed) {
        this.winner = 'crewmates';
        this.transitionTo('gameEnd');
      } else if (this.commitChancesRemaining > 1) {
        this.commitChancesRemaining--;
        this.io.to(this.roomCode).emit('game:commitFailed', {
          message: `Tests failed! ${this.commitChancesRemaining} chance(s) remaining.`,
          taunt: getRandomTaunt('commitFail'),
          testResults: results,
          chancesLeft: this.commitChancesRemaining,
        });
        setTimeout(() => this.transitionTo('coding'), 3000);
      } else {
        this.commitChancesRemaining = 0;
        this.winner = 'impostor';
        this.transitionTo('gameEnd');
      }
    } catch (err) {
      console.error(`[${this.roomCode}] Code execution failed:`, err.message);
      this.testResults = { passed: 0, total: 0, error: err.message };

      if (this.commitChancesRemaining > 1) {
        this.commitChancesRemaining--;
        this.io.to(this.roomCode).emit('game:commitFailed', {
          message: `Execution error! ${this.commitChancesRemaining} chance(s) remaining.`,
          taunt: getRandomTaunt('commitFail'),
          chancesLeft: this.commitChancesRemaining,
        });
        setTimeout(() => this.transitionTo('coding'), 3000);
      } else {
        this.winner = 'impostor';
        this.transitionTo('gameEnd');
      }
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
    GameSessionModel.setWinner(this.roomCode, this.winner, this.finalCode, this.testResults).catch(() => { });

    // Process post-game stats for each player
    const totalPlayTimeMs = Date.now() - (this.gameStartedAt || Date.now());
    for (const [uid, player] of this.players) {
      const won = (player.role === 'impostor' && this.winner === 'impostor') ||
        (player.role === 'crewmate' && this.winner === 'crewmates');

      // Calculate XP
      const xpData = calculateXpEarned({
        won,
        survived: player.status === 'alive',
        bugsReported: player.bugsReported || 0,
        correctVotes: player.correctVotes || 0,
        sabotagesUsed: player.sabotagesUsed || 0,
        testsPassed: won ? (this.testResults?.passed || 0) : 0,
        hintsUsed: player.hintsRequested || 0,
      });

      const metrics = {
        totalPlayTimeMs,
        totalVotesCast: player.votesCast || 0,
        sabotagesUsed: player.sabotagesUsed || 0,
        bugReports: player.bugsReported || 0,
        xpEarned: xpData.total,
      };
      processPostGame(uid, player.role, won, metrics).catch(() => { });
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
      commitChancesRemaining: this.commitChancesRemaining ?? 2,
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
