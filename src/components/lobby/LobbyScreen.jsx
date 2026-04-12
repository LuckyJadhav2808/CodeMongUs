import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PlayerSlot from './PlayerSlot';
import ChatBox from './ChatBox';
import NavBar from './NavBar';
import ProfilePanel from './ProfilePanel';
import StatsPanel from './StatsPanel';
import LeaderboardPanel from './LeaderboardPanel';
import RewardsPanel from './RewardsPanel';
import GameSettings from './GameSettings';
import Button from '../common/Button';
import useGameStore from '../../store/gameStore';
import { auth as firebaseAuth } from '../../config/firebase';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function LobbyScreen() {
  const { players, roomCode, hostUid, user, createRoom, joinRoom, startGame, leaveRoom, lobbyTab, startPractice } = useGameStore();
  const [joinCode, setJoinCode] = useState('');
  const [copied, setCopied] = useState('');
  const [showPracticeModal, setShowPracticeModal] = useState(false);
  const [selectedPracticePrompt, setSelectedPracticePrompt] = useState(null);
  const [catalogPrompts, setCatalogPrompts] = useState([]);
  const [catalogLoading, setCatalogLoading] = useState(false);
  const [showCustomGenerator, setShowCustomGenerator] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const [customLanguage, setCustomLanguage] = useState('javascript');
  const [customGenerating, setCustomGenerating] = useState(false);
  const maxSlots = 8;
  const emptySlots = maxSlots - players.length;
  const isHost = user?.uid === hostUid;
  const isInRoom = !!roomCode;

  // Auto-join from URL ?room= parameter
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlRoom = params.get('room');
    if (urlRoom && !isInRoom && user?.uid) {
      joinRoom(urlRoom.toUpperCase(), user?.name || 'Player');
    }
  }, [user?.uid]); // eslint-disable-line react-hooks/exhaustive-deps

  // Update URL when room changes
  useEffect(() => {
    if (roomCode) {
      const url = new URL(window.location.href);
      url.searchParams.set('room', roomCode);
      window.history.replaceState({}, '', url.toString());
    } else {
      const url = new URL(window.location.href);
      url.searchParams.delete('room');
      window.history.replaceState({}, '', url.toString());
    }
  }, [roomCode]);

  // Fetch prompt catalog when modal opens
  useEffect(() => {
    if (!showPracticeModal || catalogPrompts.length > 0) return;
    setCatalogLoading(true);
    (async () => {
      try {
        const token = await firebaseAuth.currentUser?.getIdToken();
        const res = await fetch(`${API_URL}/api/practice/prompts`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) setCatalogPrompts(data.prompts);
      } catch (err) {
        console.error('Failed to load prompts:', err);
      } finally {
        setCatalogLoading(false);
      }
    })();
  }, [showPracticeModal]); // eslint-disable-line react-hooks/exhaustive-deps

  const getShareLink = () => {
    const url = new URL(window.location.origin);
    url.searchParams.set('room', roomCode);
    return url.toString();
  };

  const copyCode = () => {
    navigator.clipboard?.writeText(roomCode);
    setCopied('code');
    setTimeout(() => setCopied(''), 2000);
  };

  const copyLink = () => {
    navigator.clipboard?.writeText(getShareLink());
    setCopied('link');
    setTimeout(() => setCopied(''), 2000);
  };

  const handleCreateRoom = () => {
    createRoom(user?.name || 'Player');
  };

  const handleJoinRoom = () => {
    if (!joinCode.trim()) return;
    joinRoom(joinCode.trim().toUpperCase(), user?.name || 'Player');
  };

  const handleStartGame = () => {
    startGame();
  };

  const diffColors = {
    easy: 'badge-green',
    medium: 'badge-yellow',
    hard: 'badge-red',
  };

  return (
    <div className="min-h-screen bg-surface p-4 lg:p-8">
      {/* Navigation Bar */}
      <div className="max-w-7xl mx-auto">
        <NavBar />
      </div>

      {/* Tab Content */}
      {lobbyTab === 'profile' ? (
        <div className="max-w-7xl mx-auto">
          <ProfilePanel />
        </div>
      ) : lobbyTab === 'stats' ? (
        <div className="max-w-7xl mx-auto">
          <StatsPanel />
        </div>
      ) : lobbyTab === 'leaderboard' ? (
        <div className="max-w-7xl mx-auto">
          <LeaderboardPanel />
        </div>
      ) : lobbyTab === 'rewards' ? (
        <div className="max-w-7xl mx-auto">
          <RewardsPanel />
        </div>
      ) : (
        <>
          {/* ──── NOT IN A ROOM YET ──── */}
          {!isInRoom ? (
            <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 140px)' }}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-lg w-full"
              >
                <div className="card !shadow-chunky-lg text-center">
                  <span className="text-5xl block mb-4">⚡</span>
                  <h1 className="font-display font-extrabold text-3xl text-on-surface mb-2">
                    <span className="text-primary">{'<'}</span>Code<span className="text-secondary">M👾ng</span>Us<span className="text-primary">{'/>'}</span>
                  </h1>
                  <p className="font-body text-on-surface-variant text-sm mb-8">
                    Create a new room, join an existing one, or practice solo.
                  </p>

                  <div className="space-y-4">
                    <Button variant="primary" size="lg" icon="🚀" onClick={handleCreateRoom} className="w-full">
                      Create Room
                    </Button>

                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-[2px] bg-outline-variant" />
                      <span className="text-xs font-display text-on-surface-variant">OR JOIN</span>
                      <div className="flex-1 h-[2px] bg-outline-variant" />
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={joinCode}
                        onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                        placeholder="Enter room code..."
                        className="input-field !text-center !font-display !font-bold !tracking-widest !text-lg"
                        onKeyDown={(e) => e.key === 'Enter' && handleJoinRoom()}
                      />
                      <Button variant="secondary" icon="🔗" onClick={handleJoinRoom}>
                        Join
                      </Button>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-[2px] bg-outline-variant" />
                      <span className="text-xs font-display text-on-surface-variant">OR PRACTICE</span>
                      <div className="flex-1 h-[2px] bg-outline-variant" />
                    </div>

                    <Button variant="ghost" size="lg" icon="🧩" onClick={() => setShowPracticeModal(true)} className="w-full">
                      Practice Solo
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          ) : (
            /* ──── IN A ROOM ──── */
            <>
              {/* Header */}
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
                <h1 className="font-display font-extrabold text-4xl lg:text-5xl text-on-surface text-outline-black mb-2">
                  ⚡ CREW ASSEMBLY
                </h1>
                <p className="font-body text-on-surface-variant text-lg">Waiting for players to join the mission...</p>
              </motion.div>

              {/* Room Code Banner */}
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="max-w-md mx-auto mb-10">
                <div className="card-container !bg-secondary-container flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-display font-bold uppercase tracking-wider" style={{ color: '#0e2bcf' }}>Room Code</p>
                    <p className="font-display font-extrabold text-2xl text-secondary tracking-widest">{roomCode}</p>
                  </div>
                  <div className="flex gap-2">
                    <motion.button whileTap={{ scale: 0.9 }} onClick={copyCode} className="btn-ghost !px-4 !py-2 !text-xs !rounded-xl">
                      {copied === 'code' ? '✅ Copied!' : '📋 Copy Code'}
                    </motion.button>
                    <motion.button whileTap={{ scale: 0.9 }} onClick={copyLink} className="btn-ghost !px-4 !py-2 !text-xs !rounded-xl">
                      {copied === 'link' ? '✅ Copied!' : '🔗 Copy Link'}
                    </motion.button>
                  </div>
                </div>
              </motion.div>

              {/* Main Content */}
              <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Player Grid */}
                <div className="lg:col-span-2">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="font-display font-bold text-xl flex items-center gap-2">
                      <span>👥</span> Crew Members
                      <span className="badge-blue">{players.length}/{maxSlots}</span>
                    </h2>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {players.map((player, i) => (
                      <PlayerSlot key={player.uid} player={player} index={i} isHost={player.uid === hostUid} />
                    ))}
                    {Array.from({ length: emptySlots }).map((_, i) => (
                      <PlayerSlot key={`empty-${i}`} isEmpty index={players.length + i} />
                    ))}
                  </div>

                  {/* Game Settings Panel */}
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-6">
                    <GameSettings isHost={isHost} />
                  </motion.div>

                  {/* Buttons */}
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-8 flex justify-center gap-4">
                    {isHost && (
                      <Button variant="primary" size="lg" icon="🚀" onClick={handleStartGame}
                        disabled={players.length < 2}>
                        {players.length < 2 ? `NEED ${2 - players.length} MORE` : 'START MISSION'}
                      </Button>
                    )}
                    <Button variant="ghost" size="lg" icon="🚪" onClick={leaveRoom}>
                      Leave Room
                    </Button>
                  </motion.div>
                </div>

                {/* Chat */}
                <div className="lg:col-span-1 lg:self-start lg:sticky lg:top-4" style={{ maxHeight: '500px' }}>
                  <ChatBox />
                </div>
              </div>
            </>
          )}
        </>
      )}

      {/* ──── Practice Prompt Selector Modal ──── */}
      <AnimatePresence>
        {showPracticeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => { setShowPracticeModal(false); setSelectedPracticePrompt(null); setShowCustomGenerator(false); }}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: 'spring', damping: 20 }}
              className="card !shadow-chunky-lg max-w-2xl w-full mx-4 max-h-[80vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* ── Header ── */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-extrabold text-xl flex items-center gap-2">
                  <span>🧩</span>{' '}
                  {showCustomGenerator ? 'Create Custom Challenge' : selectedPracticePrompt ? 'Select Language' : 'Choose a Problem'}
                </h2>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    if (showCustomGenerator) {
                      setShowCustomGenerator(false);
                    } else if (selectedPracticePrompt) {
                      setSelectedPracticePrompt(null);
                    } else {
                      setShowPracticeModal(false);
                    }
                  }}
                  className="btn-ghost !px-3 !py-2 !text-sm !rounded-xl"
                >
                  {showCustomGenerator || selectedPracticePrompt ? '← Back' : '✕ Close'}
                </motion.button>
              </div>

              {catalogLoading ? (
                <div className="flex-1 flex items-center justify-center py-12">
                  <span className="text-2xl animate-bounce">⏳</span>
                </div>

              ) : showCustomGenerator ? (
                /* ── Custom AI Generator View ── */
                <div className="space-y-4 py-2">
                  <p className="font-body text-sm text-on-surface-variant">
                    Describe a topic (e.g. "linked list reversal") or paste working code you want to practice debugging. Our AI will introduce subtle bugs and generate test cases.
                  </p>
                  <textarea
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    placeholder={"Enter a topic like 'binary search' or paste code here...\n\nExample: function fibonacci(n) {\n  if (n <= 1) return n;\n  return fibonacci(n-1) + fibonacci(n-2);\n}"}
                    className="input-field !h-40 !resize-none !font-mono !text-sm"
                    disabled={customGenerating}
                  />

                  <div>
                    <p className="text-[10px] font-display font-bold uppercase tracking-wider text-on-surface-variant mb-2">
                      🌐 Language
                    </p>
                    <div className="flex gap-2">
                      {[
                        { value: 'javascript', label: 'JavaScript', icon: '🟨' },
                        { value: 'python', label: 'Python', icon: '🐍' },
                        { value: 'cpp', label: 'C++', icon: '⚙️' },
                      ].map((lang) => (
                        <button
                          key={lang.value}
                          onClick={() => setCustomLanguage(lang.value)}
                          disabled={customGenerating}
                          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border-2 font-display font-bold text-sm transition-all
                            ${customLanguage === lang.value
                              ? 'border-primary bg-primary-container text-primary scale-105 shadow-md'
                              : 'border-outline-variant bg-surface-lowest text-on-surface-variant hover:border-primary/50'
                            }`}
                        >
                          <span>{lang.icon}</span>
                          {lang.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button
                    variant="primary"
                    size="lg"
                    icon={customGenerating ? '⏳' : '🤖'}
                    disabled={customGenerating || customInput.trim().length < 3}
                    className="w-full"
                    onClick={async () => {
                      setCustomGenerating(true);
                      try {
                        const token = await firebaseAuth.currentUser?.getIdToken();
                        const res = await fetch(`${API_URL}/api/prompts/generate`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                          body: JSON.stringify({ input: customInput, language: customLanguage }),
                        });
                        const data = await res.json();
                        if (data.success && data.prompt) {
                          setShowPracticeModal(false);
                          setShowCustomGenerator(false);
                          setCustomInput('');
                          // Jump straight into practice with the resolved prompt
                          useGameStore.setState({ practicePrompt: data.prompt, screen: 'practice' });
                        } else {
                          alert(data.error || 'Failed to generate problem');
                        }
                      } catch (err) {
                        console.error('Custom generation failed:', err);
                        alert('Failed to generate problem. Check your connection.');
                      } finally {
                        setCustomGenerating(false);
                      }
                    }}
                  >
                    {customGenerating ? 'AI is generating your challenge...' : 'Generate Custom Challenge'}
                  </Button>
                </div>

              ) : selectedPracticePrompt ? (
                /* ── Step 2: Language Selection ── */
                <div className="space-y-6 py-4">
                  <div className="p-4 rounded-xl border-3 border-primary bg-primary-container/30">
                    <h3 className="font-display font-bold text-lg text-on-surface">{selectedPracticePrompt.title}</h3>
                    <p className="text-xs text-on-surface-variant mt-1">{selectedPracticePrompt.category}</p>
                  </div>

                  <p className="font-display font-bold text-sm text-on-surface-variant text-center">
                    🌐 Choose your language
                  </p>

                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { value: 'javascript', label: 'JavaScript', icon: '🟨' },
                      { value: 'python', label: 'Python', icon: '🐍' },
                      { value: 'cpp', label: 'C++', icon: '⚙️' },
                    ].map((lang) => (
                      <motion.button
                        key={lang.value}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setShowPracticeModal(false);
                          setSelectedPracticePrompt(null);
                          startPractice(selectedPracticePrompt.id, lang.value);
                        }}
                        className="flex flex-col items-center gap-2 p-6 rounded-xl border-3 border-on-surface bg-surface-low hover:bg-surface-high hover:border-primary transition-all cursor-pointer"
                      >
                        <span className="text-3xl">{lang.icon}</span>
                        <span className="font-display font-bold text-sm text-on-surface">{lang.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>

              ) : (
                /* ── Step 1: Problem Selection ── */
                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                  {/* Custom AI Challenge Button */}
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    className="p-4 rounded-xl border-3 border-dashed border-primary bg-primary-container/20 cursor-pointer hover:bg-primary-container/40 transition-colors"
                    onClick={() => setShowCustomGenerator(true)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🤖</span>
                      <div>
                        <h3 className="font-display font-bold text-base text-primary">Create Custom Challenge</h3>
                        <p className="text-xs text-on-surface-variant mt-1">Paste code or describe a topic — AI will generate a debuggable problem</p>
                      </div>
                    </div>
                  </motion.div>

                  {catalogPrompts.map((p) => (
                    <motion.div
                      key={p.id}
                      whileHover={{ scale: 1.01 }}
                      className="p-4 rounded-xl border-3 border-on-surface bg-surface-low cursor-pointer hover:bg-surface-high transition-colors"
                      onClick={() => setSelectedPracticePrompt(p)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-display font-bold text-base text-on-surface">{p.title}</h3>
                          <p className="text-xs text-on-surface-variant mt-1">{p.category}</p>
                        </div>
                        <span className={`text-xs font-display font-bold px-3 py-1 rounded-full border-2 border-on-surface ${
                          p.difficulty === 'easy' ? 'bg-success-container text-success' :
                          p.difficulty === 'medium' ? 'bg-warning-container text-warning' :
                          'bg-error-container text-error'
                        }`}>
                          {p.difficulty?.toUpperCase()}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
