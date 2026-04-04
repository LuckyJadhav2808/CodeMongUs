import { create } from 'zustand';
import { getSocket } from '../services/socket';
import {
  createUserDoc,
  getUserDoc,
  updateUserProfile,
  updateUserStats,
  addMatchRecord,
  getMatchHistory,
} from '../services/firestoreService';

// Load profile from localStorage
const loadProfile = () => {
  try {
    const saved = localStorage.getItem('codemongus_profile');
    if (saved) return JSON.parse(saved);
  } catch {}
  return { avatarStyle: 'bottts-neutral', avatarSeed: '', displayName: '' };
};

const useGameStore = create((set, get) => ({
  // ──────── AUTH ────────
  user: null,
  setUser: (user) => set({ user }),

  // ──────── CURRENT SCREEN ────────
  screen: 'login', // 'login' | 'lobby' | 'roleReveal' | 'game' | 'gameEnd'
  setScreen: (screen) => set({ screen }),

  // ──────── LOBBY TAB ────────
  lobbyTab: 'lobby', // 'lobby' | 'profile'
  setLobbyTab: (tab) => set({ lobbyTab: tab }),

  // ──────── PLAYER PROFILE ────────
  profile: loadProfile(),
  setProfile: (updates) => set((s) => {
    const newProfile = { ...s.profile, ...updates };
    try { localStorage.setItem('codemongus_profile', JSON.stringify(newProfile)); } catch {}
    return { profile: newProfile };
  }),

  // ──────── USER STATS (from Firestore) ────────
  userStats: {
    gamesPlayed: 0, gamesWon: 0, gamesLost: 0,
    timesImpostor: 0, timesCrewmate: 0,
    impostorWins: 0, crewmateWins: 0,
    totalVotesCast: 0, correctVotes: 0,
    timesSabotaged: 0, bugReports: 0,
    totalPlayTimeMs: 0,
  },
  setUserStats: (stats) => set({ userStats: stats }),

  // ──────── MATCH HISTORY ────────
  matchHistory: [],
  setMatchHistory: (matches) => set({ matchHistory: matches }),

  // ──────── FIRESTORE ACTIONS ────────
  loadUserData: async (uid) => {
    try {
      const userData = await getUserDoc(uid);
      if (userData) {
        // Hydrate profile
        const profileUpdate = {
          displayName: userData.displayName || '',
          avatarStyle: userData.avatarStyle || 'bottts-neutral',
          avatarSeed: userData.avatarSeed || '',
        };
        set((s) => {
          const merged = { ...s.profile, ...profileUpdate };
          try { localStorage.setItem('codemongus_profile', JSON.stringify(merged)); } catch {}
          return { profile: merged };
        });

        // Hydrate stats
        if (userData.stats) {
          set({ userStats: userData.stats });
        }

        // Load match history
        const matches = await getMatchHistory(uid, 20);
        set({ matchHistory: matches });
      }
    } catch (err) {
      console.error('Failed to load user data from Firestore:', err);
    }
  },

  saveProfileToFirestore: async (profileData) => {
    const { user } = get();
    if (!user?.uid) return;
    try {
      await updateUserProfile(user.uid, profileData);
    } catch (err) {
      console.error('Failed to save profile to Firestore:', err);
    }
  },

  recordGameEnd: async (matchData) => {
    const { user } = get();
    if (!user?.uid) return;
    try {
      // Determine stat increments
      const isWin = matchData.result === 'win';
      const isImpostor = matchData.role === 'impostor';
      const statUpdates = {
        gamesPlayed: 1,
        gamesWon: isWin ? 1 : 0,
        gamesLost: isWin ? 0 : 1,
        timesImpostor: isImpostor ? 1 : 0,
        timesCrewmate: isImpostor ? 0 : 1,
        impostorWins: isImpostor && isWin ? 1 : 0,
        crewmateWins: !isImpostor && isWin ? 1 : 0,
        totalPlayTimeMs: matchData.durationMs || 0,
      };

      await updateUserStats(user.uid, statUpdates);
      await addMatchRecord(user.uid, matchData);

      // Refresh local state
      const freshData = await getUserDoc(user.uid);
      if (freshData?.stats) set({ userStats: freshData.stats });
      const matches = await getMatchHistory(user.uid, 20);
      set({ matchHistory: matches });
    } catch (err) {
      console.error('Failed to record game end:', err);
    }
  },

  // ──────── ROOM ────────
  roomCode: null,
  hostUid: null,
  players: [],

  // ──────── GAME STATE ────────
  myRole: null,
  prompt: null,
  timerSeconds: 0,
  gameResult: null,
  testResults: null,
  gameStartTime: null,

  // ──────── GAME SETTINGS (host-configured) ────────
  gameSettings: {
    promptId: 'random',
    timerDuration: 240,
    language: 'javascript',
  },
  setGameSettings: (updates) => set((s) => ({
    gameSettings: { ...s.gameSettings, ...updates },
  })),

  // ──────── PROMPT CATALOG ────────
  promptCatalog: [],

  // ──────── UI TOGGLES ────────
  showVoting: false,
  setShowVoting: (show) => set({ showVoting: show }),
  showImpostorPanel: false,
  toggleImpostorPanel: () => set((s) => ({ showImpostorPanel: !s.showImpostorPanel })),
  showRoleReveal: false,
  setShowRoleReveal: (show) => set({ showRoleReveal: show }),

  // ──────── EDITOR CODE (for commit) ────────
  editorCode: '',
  setEditorCode: (code) => set({ editorCode: code }),

  // ──────── COMMIT PROPOSAL ────────
  commitProposal: null, // { proposerUid, proposerName, code, votes: {uid: bool}, total, needed }
  setCommitProposal: (proposal) => set({ commitProposal: proposal }),

  // ──────── SABOTAGE ────────
  activeSabotage: null,

  // ──────── VOTING ────────
  voteData: null,   // { alivePlayers, meetingNumber, duration }
  voteResult: null,  // { tally, eliminated, skipped }

  // ──────── CHAT ────────
  chatMessages: [],

  // ──────── HINTS ────────
  unlockedHints: [],

  // ──────── SHIP INTEGRITY (cosmetic) ────────
  shipIntegrity: 100,

  // ═══════════════════════════════════════════════
  //  SOCKET ACTIONS — emit events to the server
  // ═══════════════════════════════════════════════

  createRoom: (username) => {
    const socket = getSocket();
    if (!socket) return;
    socket.emit('room:create', { username }, (res) => {
      if (res.success) {
        set({
          roomCode: res.roomCode,
          screen: 'lobby',
          hostUid: res.state.hostUid,
          players: res.state.players,
        });
      } else {
        console.error('Create room failed:', res.error);
      }
    });
  },

  joinRoom: (roomCode, username) => {
    const socket = getSocket();
    if (!socket) return;
    socket.emit('room:join', { roomCode, username }, (res) => {
      if (res.success) {
        set({
          roomCode,
          screen: 'lobby',
          hostUid: res.state.hostUid,
          players: res.state.players,
        });
      } else {
        console.error('Join room failed:', res.error);
        alert(res.error || 'Failed to join room');
      }
    });
  },

  leaveRoom: () => {
    const socket = getSocket();
    if (!socket) return;
    socket.emit('room:leave', null, () => {
      set({ roomCode: null, screen: 'lobby', players: [], hostUid: null, myRole: null, prompt: null, chatMessages: [] });
    });
  },

  leaveGame: () => {
    const socket = getSocket();
    if (!socket) return;
    socket.emit('game:leave', null, () => {
      set({
        roomCode: null, screen: 'lobby', players: [], hostUid: null,
        myRole: null, prompt: null, chatMessages: [],
        commitProposal: null, editorCode: '',
        showVoting: false, showImpostorPanel: false,
        gameResult: null, testResults: null,
      });
    });
  },

  startGame: () => {
    const socket = getSocket();
    if (!socket) return;
    const { gameSettings } = get();
    socket.emit('game:start', gameSettings, (res) => {
      if (!res.success) {
        alert(res.error || 'Failed to start game');
      }
    });
  },

  reportBug: () => {
    const socket = getSocket();
    if (!socket) return;
    socket.emit('game:reportBug', null, (res) => {
      if (!res.success) console.error('Report bug failed:', res.error);
    });
  },

  castVote: (targetUid) => {
    const socket = getSocket();
    if (!socket) return;
    socket.emit('vote:cast', { targetUid }, (res) => {
      if (!res.success) console.error('Vote failed:', res.error);
    });
  },

  skipVote: () => {
    const socket = getSocket();
    if (!socket) return;
    socket.emit('vote:skip', null, (res) => {
      if (!res.success) console.error('Skip vote failed:', res.error);
    });
  },

  useSabotage: (abilityId) => {
    const socket = getSocket();
    if (!socket) return;
    socket.emit('sabotage:use', { abilityId }, (res) => {
      if (!res.success) {
        alert(res.error || 'Sabotage failed');
      }
    });
  },

  sendChat: (message) => {
    const socket = getSocket();
    if (!socket) return;
    socket.emit('chat:send', { message });
  },

  submitCode: (code) => {
    const socket = getSocket();
    if (!socket) return;
    socket.emit('game:submitCode', { code });
  },

  proposeCommit: () => {
    const socket = getSocket();
    if (!socket) return;
    const { editorCode } = get();
    socket.emit('commit:propose', { code: editorCode });
  },

  respondToCommitProposal: (approve) => {
    const socket = getSocket();
    if (!socket) return;
    socket.emit('commit:respond', { approve });
  },

  requestHint: () => {
    const socket = getSocket();
    if (!socket) return;
    socket.emit('game:requestHint', null, (res) => {
      if (!res.success) {
        console.log(res.error || 'No more hints');
      }
    });
  },

  fetchPrompts: () => {
    const socket = getSocket();
    if (!socket) return;
    socket.emit('prompts:list', null, (res) => {
      if (res?.prompts) {
        set({ promptCatalog: res.prompts });
      }
    });
  },

  // ═══════════════════════════════════════════════
  //  SOCKET LISTENERS — called once after connect
  // ═══════════════════════════════════════════════

  initSocketListeners: () => {
    const socket = getSocket();
    if (!socket) return;

    // Full state sync
    socket.on('game:state', (state) => {
      const currentScreen = get().screen;
      // Don't overwrite players on gameEnd — game:end already set them WITH role data
      const updates = {
        hostUid: state.hostUid,
        roomCode: state.roomCode,
        timerSeconds: state.timerRemaining,
      };
      if (currentScreen !== 'gameEnd') {
        updates.players = state.players;
      }
      set(updates);
    });

    // Role reveal (private per-player)
    socket.on('game:roleReveal', ({ role, prompt }) => {
      set({ myRole: role, prompt, screen: 'roleReveal', showRoleReveal: true });
      // After reveal animation, transition to game
      setTimeout(() => {
        set({ screen: 'game', showRoleReveal: false });
      }, 4500);
    });

    // Settings sync (lobby)
    socket.on('room:settingsUpdated', (settings) => {
      set((s) => ({ gameSettings: { ...s.gameSettings, ...settings } }));
    });

    // Coding phase start
    socket.on('game:codingStart', ({ prompt, duration, language }) => {
      const updates = { prompt, screen: 'game', timerSeconds: duration, gameStartTime: Date.now() };
      if (language) {
        updates.gameSettings = { ...get().gameSettings, language };
      }
      set(updates);
    });

    // Timer tick
    socket.on('timer:tick', ({ seconds }) => {
      set({ timerSeconds: seconds });
    });

    // Voting start
    socket.on('game:votingStart', ({ meetingNumber, duration, alivePlayers }) => {
      set({
        showVoting: true,
        voteData: { alivePlayers, meetingNumber, duration },
        voteResult: null,
      });
    });

    // Vote update (anonymous count)
    socket.on('game:voteUpdate', (data) => {
      // Could display a "X/Y voted" indicator
    });

    // Vote result
    socket.on('game:voteResult', (result) => {
      set({ voteResult: result });
      // Keep voting modal open for 3s to show result, then close
      setTimeout(() => {
        set({ showVoting: false, voteResult: null });
      }, 4000);
    });

    // Meeting called
    socket.on('game:meetingCalled', ({ calledBy }) => {
      console.log(`🚨 Meeting called by ${calledBy.username}`);
    });

    // Build phase
    socket.on('game:buildStart', () => {
      set({ showVoting: false });
    });

    // Game end
    socket.on('game:end', ({ winner, players, testResults }) => {
      set({
        gameResult: winner,
        players,
        testResults,
        screen: 'gameEnd',
        showVoting: false,
        showImpostorPanel: false,
      });

      // Stats are written server-side by processPostGame.
      // Refresh local copy after a short delay so the server writes have settled.
      const { user: currentUser } = get();
      if (currentUser?.uid) {
        setTimeout(() => get().loadUserData(currentUser.uid), 3000);
      }
    });

    // Host changed
    socket.on('game:hostChanged', ({ newHostUid }) => {
      set({ hostUid: newHostUid });
    });

    // Chat
    socket.on('chat:message', (msg) => {
      set((s) => ({ chatMessages: [...s.chatMessages, msg] }));
    });

    // ──── SABOTAGE EFFECTS (received by crewmates) ────
    socket.on('sabotage:flashbang', ({ duration }) => {
      set({ activeSabotage: 'flashbang' });
      setTimeout(() => set({ activeSabotage: null }), duration);
    });
    socket.on('sabotage:typo', () => {
      set({ activeSabotage: 'typo' });
      setTimeout(() => set({ activeSabotage: null }), 500);
    });
    socket.on('sabotage:ghost', ({ duration }) => {
      set({ activeSabotage: 'ghost' });
      setTimeout(() => set({ activeSabotage: null }), duration);
    });
    socket.on('sabotage:lag', ({ duration }) => {
      set({ activeSabotage: 'lag' });
      setTimeout(() => set({ activeSabotage: null }), duration);
    });

    // Sabotage confirmed (received by impostor)
    socket.on('sabotage:confirmed', ({ ability, cooldown }) => {
      console.log(`🔧 Sabotage ${ability} confirmed. Cooldown: ${cooldown}s`);
    });

    // Player disconnected
    socket.on('player:disconnected', ({ uid, username }) => {
      console.log(`⚠️ ${username} disconnected`);
    });

    // Player voluntarily left mid-game
    socket.on('player:left', ({ uid, username, role }) => {
      set((s) => ({
        players: s.players.map(p => p.uid === uid ? { ...p, status: 'left' } : p),
      }));
    });

    // Game forcibly ended (player left making game unviable)
    socket.on('game:forceEnd', ({ reason, winner }) => {
      set({ gameResult: { winner, reason, forced: true } });
    });

    // Hint received
    socket.on('game:hintReceived', ({ hint, hintNumber, totalHints }) => {
      set((s) => ({
        unlockedHints: [...s.unlockedHints, { hint, hintNumber, totalHints }],
      }));
    });

    // ──── COMMIT PROPOSAL (consensus) ────
    socket.on('commit:proposed', (proposal) => {
      set({ commitProposal: proposal });
    });

    socket.on('commit:update', (update) => {
      set((s) => {
        if (!s.commitProposal) return {};
        return { commitProposal: { ...s.commitProposal, ...update } };
      });
    });

    socket.on('commit:result', ({ approved, message }) => {
      console.log(approved ? '✅ Commit approved and submitted!' : '❌ Commit rejected:', message);
      // Stamp a result onto the proposal so the modal can display it
      set((s) => ({
        commitProposal: s.commitProposal
          ? { ...s.commitProposal, result: { approved, message } }
          : null,
      }));
      // Clear the proposal after 3s so users can read the outcome
      setTimeout(() => set({ commitProposal: null }), 3000);
    });
  },
}));

export default useGameStore;
