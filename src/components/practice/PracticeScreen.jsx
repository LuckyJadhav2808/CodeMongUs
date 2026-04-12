import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Editor from '@monaco-editor/react';
import Button from '../common/Button';
import useGameStore from '../../store/gameStore';
import { auth as firebaseAuth } from '../../config/firebase';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Helper to get a fresh Firebase token for API calls.
 */
async function getToken() {
  const user = firebaseAuth.currentUser;
  if (!user) return null;
  return user.getIdToken();
}

/**
 * PracticeScreen — A full single-player practice coding environment.
 * Uses REST APIs (no WebSocket rooms). Includes a stopwatch, Monaco editor,
 * prompt panel, AI hints, and test execution via Piston.
 */
export default function PracticeScreen() {
  const { practicePrompt, setScreen } = useGameStore();
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [testResults, setTestResults] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [hints, setHints] = useState([]);
  const [hintLoading, setHintLoading] = useState(false);
  const [solved, setSolved] = useState(false);

  // Stopwatch
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef(null);

  // Start stopwatch on mount
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setElapsed(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  // Stop stopwatch when solved
  useEffect(() => {
    if (solved && timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, [solved]);

  // Load starter code and language when prompt arrives
  useEffect(() => {
    if (practicePrompt?.starterCode) {
      setCode(practicePrompt.starterCode);
    }
    if (practicePrompt?.language) {
      setLanguage(practicePrompt.language);
    }
  }, [practicePrompt]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // ──── Run Tests ────
  const handleRunTests = useCallback(async () => {
    if (!practicePrompt || isRunning) return;
    setIsRunning(true);
    setTestResults(null);
    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}/api/practice/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ code, promptId: practicePrompt.id, language }),
      });
      const data = await res.json();
      setTestResults(data);
      if (data.allPassed) {
        setSolved(true);
      }
    } catch (err) {
      setTestResults({ error: err.message });
    } finally {
      setIsRunning(false);
    }
  }, [code, practicePrompt, language, isRunning]);

  // ──── Request AI Hint ────
  const handleRequestHint = useCallback(async () => {
    if (!practicePrompt || hintLoading) return;
    setHintLoading(true);
    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}/api/practice/hint`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ code, promptId: practicePrompt.id, language }),
      });
      const data = await res.json();
      if (data.success && data.hint) {
        setHints(prev => [...prev, data.hint]);
      }
    } catch (err) {
      console.error('Hint request failed:', err);
    } finally {
      setHintLoading(false);
    }
  }, [code, practicePrompt, language, hintLoading]);

  // ──── Back to Lobby ────
  const handleBack = () => {
    setScreen('lobby');
  };

  const monacoLang = language === 'cpp' ? 'cpp' : language;

  if (!practicePrompt) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <span className="text-4xl block mb-3">🔧</span>
          <p className="font-display font-bold text-on-surface-variant">Loading practice prompt...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* ──── Top Header ──── */}
      <motion.header
        initial={{ y: -60 }}
        animate={{ y: 0 }}
        className="glass-nav border-b-3 border-on-surface px-6 py-3 flex items-center justify-between z-30 sticky top-0"
      >
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBack}
            className="btn-ghost !px-3 !py-2 !text-sm !rounded-xl"
          >
            ← Back
          </motion.button>
          <h1 className="font-display font-extrabold text-lg tracking-tight">
            <span className="text-primary">{'<'}</span>
            Practice<span className="text-secondary">Mode</span>
            <span className="text-primary">{'/>'}</span>
          </h1>
          <span className="badge-blue text-xs">{practicePrompt.difficulty?.toUpperCase()}</span>
        </div>
        <div className="flex items-center gap-6">
          {/* Stopwatch */}
          <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] font-display font-bold uppercase tracking-widest text-on-surface-variant">
              ELAPSED
            </span>
            <motion.div
              className={`font-display font-extrabold text-3xl tabular-nums ${solved ? 'text-success' : 'text-on-surface'}`}
            >
              {formatTime(elapsed)}
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* ──── Main Content ──── */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Prompt + Hints */}
        <motion.aside
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="hidden lg:flex flex-col w-[300px] border-r-3 border-on-surface bg-surface-low shrink-0"
        >
          <div className="px-4 py-3 border-b-3 border-on-surface bg-surface-high">
            <h3 className="font-display font-bold text-sm flex items-center gap-2">
              <span>🎯</span> {practicePrompt.title}
            </h3>
            <span className="text-xs text-on-surface-variant">{practicePrompt.category}</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div>
              <p className="font-body text-sm text-on-surface-variant leading-relaxed">
                {practicePrompt.description}
              </p>
            </div>

            {practicePrompt.functionSignature && (
              <div className="p-3 rounded-xl border-2 border-on-surface bg-on-surface">
                <code className="text-xs font-mono text-surface break-all">{practicePrompt.functionSignature}</code>
              </div>
            )}

            {/* Hints Section */}
            <div className="space-y-2">
              <h4 className="font-display font-bold text-sm flex items-center gap-2">
                <span>🔮</span> AI Hints
              </h4>
              {hints.length === 0 && (
                <p className="text-xs text-on-surface-variant italic">No hints requested yet.</p>
              )}
              {hints.map((hint, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-xl bg-tertiary-container border-2 border-on-surface"
                >
                  <p className="text-xs font-body text-on-surface leading-relaxed">{hint}</p>
                </motion.div>
              ))}
              <Button
                variant="ghost"
                size="sm"
                icon="🔮"
                onClick={handleRequestHint}
                disabled={hintLoading}
                className="w-full !text-xs"
              >
                {hintLoading ? 'Thinking...' : 'Ask Oracle for Hint'}
              </Button>
            </div>
          </div>
        </motion.aside>

        {/* Center: Code Editor */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 relative">
            <Editor
              height="100%"
              language={monacoLang}
              theme="vs-dark"
              value={code}
              onChange={(v) => setCode(v || '')}
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                wordWrap: 'on',
                padding: { top: 16 },
                fontFamily: "'Fira Code', 'Cascadia Code', monospace",
                fontLigatures: true,
                lineNumbers: 'on',
                renderLineHighlight: 'all',
                bracketPairColorization: { enabled: true },
                autoClosingBrackets: 'always',
              }}
            />
            {/* Flashbang / sabotage overlays not needed in practice */}
          </div>

          {/* Bottom: Run Tests + Results */}
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className="border-t-3 border-on-surface bg-surface-low"
          >
            <div className="px-4 py-3 flex items-center justify-between">
              <Button
                variant="primary"
                size="md"
                icon={isRunning ? '⏳' : '▶️'}
                onClick={handleRunTests}
                disabled={isRunning || solved}
              >
                {isRunning ? 'Running...' : solved ? 'All Tests Passed! ✅' : 'Run Tests'}
              </Button>
              {testResults && !testResults.error && (
                <span className={`font-display font-bold text-sm ${testResults.allPassed ? 'text-success' : 'text-error'}`}>
                  {testResults.passed}/{testResults.total} Passed
                </span>
              )}
            </div>

            {/* Test Results Grid */}
            <AnimatePresence>
              {testResults && testResults.results && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[200px] overflow-y-auto">
                    {testResults.results.map((tc, i) => (
                      <div
                        key={i}
                        className={`p-3 rounded-xl border-2 border-on-surface text-xs font-mono ${
                          tc.passed ? 'bg-success-container' : 'bg-error-container'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-display font-bold">Test {i + 1}</span>
                          <span>{tc.passed ? '✅' : '❌'}</span>
                        </div>
                        {tc.visible && (
                          <>
                            <p className="text-on-surface-variant">Expected: <span className="text-on-surface">{tc.expected}</span></p>
                            <p className="text-on-surface-variant">Got: <span className="text-on-surface">{tc.actual}</span></p>
                          </>
                        )}
                        {!tc.visible && !tc.passed && (
                          <p className="text-on-surface-variant italic">Hidden test case</p>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {testResults?.error && (
              <div className="px-4 pb-4">
                <div className="p-3 rounded-xl bg-error-container border-2 border-on-surface text-xs text-error">
                  ⚠️ {testResults.error}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* ──── Success Modal ──── */}
      <AnimatePresence>
        {solved && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 20 }}
              className="card !shadow-chunky-lg text-center max-w-md mx-4"
            >
              <span className="text-6xl block mb-4">🎉</span>
              <h2 className="font-display font-extrabold text-2xl text-on-surface mb-2">
                Problem Solved!
              </h2>
              <p className="font-body text-on-surface-variant mb-2">
                You debugged <strong>{practicePrompt.title}</strong> successfully.
              </p>
              <p className="font-display font-bold text-xl text-primary mb-6">
                ⏱️ Time: {formatTime(elapsed)}
              </p>
              <div className="flex gap-3 justify-center">
                <Button variant="primary" size="lg" icon="🏠" onClick={handleBack}>
                  Return to Lobby
                </Button>
                <Button variant="ghost" size="lg" icon="🔄" onClick={() => {
                  setSolved(false);
                  setTestResults(null);
                  setHints([]);
                  setElapsed(0);
                  setCode(practicePrompt.starterCode);
                  timerRef.current = setInterval(() => setElapsed(prev => prev + 1), 1000);
                }}>
                  Try Again
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
