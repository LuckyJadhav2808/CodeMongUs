import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import Timer from './Timer';
import CodeEditor from './CodeEditor';
import PlayerSidebar from './PlayerSidebar';
import ActionButtons from './ActionButtons';
import ChatBox from '../lobby/ChatBox';
import VotingModal from '../voting/VotingModal';
import ImpostorDashboard from '../impostor/ImpostorDashboard';
import CommitVotingModal from './CommitVotingModal';
import useGameStore from '../../store/gameStore';

export default function GameScreen() {
  const { showVoting, setShowVoting, showImpostorPanel, activeSabotage, shipIntegrity, prompt, timerSeconds, unlockedHints } = useGameStore();
  const [timerExpired, setTimerExpired] = useState(false);
  const [codingStarted, setCodingStarted] = useState(false);
  const prevTimerRef = useRef(timerSeconds);

  // Detect when the coding phase truly starts (timerSeconds jumps to a large value)
  useEffect(() => {
    if (!codingStarted && timerSeconds > 30) {
      setCodingStarted(true);
    }
    prevTimerRef.current = timerSeconds;
  }, [timerSeconds, codingStarted]);

  const handleTimerExpire = () => {
    if (!codingStarted) return; // ignore expiry before coding phase
    setTimerExpired(true);
  };

  return (
    <div className={`min-h-screen bg-surface flex flex-col ${activeSabotage === 'lag' ? 'screen-shake' : ''}`}>
      {/* Top Header Bar */}
      <motion.header
        initial={{ y: -60 }}
        animate={{ y: 0 }}
        className="glass-nav border-b-3 border-on-surface px-6 py-3 flex items-center justify-between z-30 sticky top-0"
      >
        <div className="flex items-center gap-4">
          <h1 className="font-display font-extrabold text-lg tracking-tight">
            <span className="text-primary">{'<'}</span>
            Code<span className="text-secondary">M👾ng</span>Us
            <span className="text-primary">{'/>'}</span>
          </h1>
          <div className="hidden md:flex items-center gap-1 badge-yellow">
            <span>🛸</span> Ship Integrity: {shipIntegrity}%
          </div>
        </div>
        <div className="flex items-center gap-6">
          <Timer initialSeconds={codingStarted ? timerSeconds : 240} autoStart={codingStarted} label="MISSION TIME" onExpire={handleTimerExpire} />
          <ActionButtons />
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Prompt Panel */}
        <motion.aside
          initial={{ x: -280 }}
          animate={{ x: 0 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="hidden lg:flex flex-col w-[280px] border-r-3 border-on-surface bg-surface-low shrink-0"
        >
          <div className="px-4 py-3 border-b-3 border-on-surface bg-surface-high">
            <h3 className="font-display font-bold text-sm flex items-center gap-2">
              <span>🎯</span> CODING PROMPT
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {prompt ? (
              <>
                <div>
                  <h4 className="font-display font-bold text-base text-on-surface">{prompt.title}</h4>
                  <p className="font-body text-sm text-on-surface-variant mt-2 leading-relaxed">{prompt.description}</p>
                </div>
                {prompt.functionSignature && (
                  <div className="p-3 rounded-xl border-2 border-on-surface bg-on-surface">
                    <p className="text-[10px] font-display font-bold text-gray-400 mb-1">FUNCTION SIGNATURE</p>
                    <code className="font-mono text-sm text-green-400">{prompt.functionSignature}</code>
                  </div>
                )}
                {prompt.testCases?.filter(tc => tc.visible).length > 0 && (
                  <div>
                    <p className="text-[10px] font-display font-bold text-on-surface-variant mb-2">VISIBLE TEST CASES</p>
                    {prompt.testCases.filter(tc => tc.visible).map((tc, i) => (
                      <div key={i} className="p-2 rounded-lg border border-outline-variant mb-2 bg-surface-lowest">
                        <p className="font-mono text-xs text-on-surface">{tc.input}</p>
                        <p className="font-mono text-xs text-secondary">→ {tc.expected}</p>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-on-surface-variant font-body text-center py-8">Loading prompt...</p>
            )}
          </div>
        </motion.aside>

        {/* Center: Code Editor */}
        <main className="flex-1 flex flex-col p-4 min-w-0">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 card !p-3 !bg-secondary-container !border-secondary flex items-center gap-3"
          >
            <span className="text-lg">🎯</span>
            <div>
              <p className="text-[10px] font-display font-bold uppercase tracking-wider" style={{ color: '#0e2bcf' }}>Current Prompt</p>
              <p className="font-body text-sm text-on-surface font-medium">
                {prompt?.title || 'Loading...'}
              </p>
            </div>
          </motion.div>

          {/* Unlocked Hints */}
          {unlockedHints && unlockedHints.length > 0 && (
            <div className="mb-3 space-y-1">
              {unlockedHints.map((h, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="card !p-2 !py-1.5 !bg-tertiary-container !border-tertiary flex items-center gap-2"
                >
                  <span className="text-sm">💡</span>
                  <p className="text-xs font-body text-on-surface">
                    <span className="font-bold">Hint {h.hintNumber}:</span> {h.hint}
                  </p>
                </motion.div>
              ))}
            </div>
          )}

          <div className="flex-1 min-h-0">
            <CodeEditor />
          </div>
        </main>

        {/* Right: Player Sidebar + Chat */}
        <motion.aside
          initial={{ x: 320 }}
          animate={{ x: 0 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="hidden xl:flex flex-col w-[320px] border-l-3 border-on-surface bg-surface-low shrink-0"
        >
          <div className="h-1/2 border-b-3 border-on-surface">
            <PlayerSidebar />
          </div>
          <div className="h-1/2">
            <ChatBox />
          </div>
        </motion.aside>
      </div>

      {/* Voting Modal Overlay */}
      <VotingModal isOpen={showVoting} onClose={() => setShowVoting(false)} />

      {/* Commit Voting Modal */}
      <CommitVotingModal />

      {/* Impostor Dashboard (toggled by Sabotage button) */}
      {showImpostorPanel && <ImpostorDashboard />}

      {/* Flashbang Overlay */}
      {activeSabotage === 'flashbang' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0.8, 0] }}
          transition={{ duration: 5 }}
          className="fixed inset-0 bg-white z-[200] pointer-events-none"
        />
      )}
      {/* Timer Expired Overlay — prevents white screen while server transitions */}
      {timerExpired && !showVoting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-surface/90 backdrop-blur-md z-[150] flex items-center justify-center"
        >
          <div className="text-center">
            <motion.div
              animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-7xl mb-6"
            >
              ⏱️
            </motion.div>
            <h2 className="font-display font-extrabold text-3xl text-on-surface mb-2">TIME'S UP!</h2>
            <p className="font-body text-on-surface-variant">Running tests & evaluating code...</p>
            <motion.div
              className="mt-4 w-48 h-1 bg-outline-variant rounded-full mx-auto overflow-hidden"
            >
              <motion.div
                className="h-full bg-primary rounded-full"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
