import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useGameStore from '../../store/gameStore';

const DIFFICULTY_BADGES = {
  easy: { label: '🟢 Easy', color: 'bg-green-100 text-green-800 border-green-300' },
  medium: { label: '🟡 Medium', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
  hard: { label: '🔴 Hard', color: 'bg-red-100 text-red-800 border-red-300' },
};

const TIMER_OPTIONS = [
  { value: 120, label: '2 min', icon: '⚡' },
  { value: 240, label: '4 min', icon: '⏱️' },
  { value: 360, label: '6 min', icon: '🕐' },
  { value: 480, label: '8 min', icon: '🐢' },
];

const LANGUAGE_OPTIONS = [
  { value: 'javascript', label: 'JavaScript', icon: '🟨' },
  { value: 'python', label: 'Python', icon: '🐍' },
  { value: 'cpp', label: 'C++', icon: '⚙️' },
];

export default function GameSettings({ isHost }) {
  const { gameSettings, setGameSettings, promptCatalog, fetchPrompts } = useGameStore();
  const [expandedCategory, setExpandedCategory] = useState(null);

  // Fetch prompts on mount
  useEffect(() => {
    if (promptCatalog.length === 0) {
      fetchPrompts();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Group prompts by category
  const categories = useMemo(() => {
    const grouped = {};
    promptCatalog.forEach(p => {
      if (!grouped[p.category]) grouped[p.category] = [];
      grouped[p.category].push(p);
    });
    return grouped;
  }, [promptCatalog]);

  const selectedPrompt = promptCatalog.find(p => p.id === gameSettings.promptId);

  const handleSelectPrompt = (promptId) => {
    if (!isHost) return;
    setGameSettings({ promptId });
  };

  const handleTimerChange = (duration) => {
    if (!isHost) return;
    setGameSettings({ timerDuration: duration });
  };

  const handleLanguageChange = (language) => {
    if (!isHost) return;
    setGameSettings({ language });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="card !shadow-chunky-lg"
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">⚙️</span>
        <h3 className="font-display font-extrabold text-lg text-on-surface">
          {isHost ? 'GAME SETTINGS' : 'GAME CONFIG'}
        </h3>
        {!isHost && (
          <span className="badge-blue text-[10px]">Host controls</span>
        )}
      </div>

      {/* ── Language Selector ── */}
      <div className="mb-4">
        <p className="text-[10px] font-display font-bold uppercase tracking-wider text-on-surface-variant mb-2">
          🌐 Language
        </p>
        <div className="flex gap-2">
          {LANGUAGE_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => handleLanguageChange(opt.value)}
              disabled={!isHost}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border-2 font-display font-bold text-sm transition-all
                ${gameSettings.language === opt.value
                  ? 'border-primary bg-primary-container text-primary scale-105 shadow-md'
                  : 'border-outline-variant bg-surface-lowest text-on-surface-variant hover:border-primary/50'
                }
                ${!isHost ? 'cursor-default opacity-80' : 'cursor-pointer'}`}
            >
              <span>{opt.icon}</span>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Timer Selector ── */}
      <div className="mb-4">
        <p className="text-[10px] font-display font-bold uppercase tracking-wider text-on-surface-variant mb-2">
          ⏰ Coding Time
        </p>
        <div className="flex gap-2">
          {TIMER_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => handleTimerChange(opt.value)}
              disabled={!isHost}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 font-display font-bold text-sm transition-all
                ${gameSettings.timerDuration === opt.value
                  ? 'border-secondary bg-secondary-container text-secondary scale-105 shadow-md'
                  : 'border-outline-variant bg-surface-lowest text-on-surface-variant hover:border-secondary/50'
                }
                ${!isHost ? 'cursor-default opacity-80' : 'cursor-pointer'}`}
            >
              <span>{opt.icon}</span>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Prompt Selector ── */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] font-display font-bold uppercase tracking-wider text-on-surface-variant">
            🎯 Coding Challenge
          </p>
          {isHost && (
            <button
              onClick={() => handleSelectPrompt('random')}
              className={`px-3 py-1 rounded-lg border-2 font-display font-bold text-xs transition-all
                ${gameSettings.promptId === 'random'
                  ? 'border-primary bg-primary text-on-primary'
                  : 'border-outline-variant text-on-surface-variant hover:border-primary'}`}
            >
              🎲 Random
            </button>
          )}
        </div>

        {/* Selected prompt display */}
        {gameSettings.promptId !== 'random' && selectedPrompt && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-3 p-3 rounded-xl border-2 border-primary bg-primary-container/30"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm">✅</span>
              <span className="font-display font-bold text-sm text-on-surface">{selectedPrompt.title}</span>
              <span className={`text-[9px] font-display font-bold px-2 py-0.5 rounded-full border ${DIFFICULTY_BADGES[selectedPrompt.difficulty]?.color}`}>
                {DIFFICULTY_BADGES[selectedPrompt.difficulty]?.label}
              </span>
            </div>
            <p className="text-xs text-on-surface-variant mt-1 font-body line-clamp-2">{selectedPrompt.description}</p>
          </motion.div>
        )}

        {gameSettings.promptId === 'random' && (
          <div className="mb-3 p-3 rounded-xl border-2 border-primary/50 bg-primary-container/20 text-center">
            <span className="text-2xl">🎲</span>
            <p className="font-display font-bold text-sm text-primary mt-1">Random Challenge</p>
            <p className="text-[10px] text-on-surface-variant">A random prompt will be selected when the game starts</p>
          </div>
        )}

        {/* Category list */}
        <div className="space-y-1 max-h-[300px] overflow-y-auto pr-1">
          {Object.entries(categories).map(([category, prompts]) => (
            <div key={category}>
              <button
                onClick={() => setExpandedCategory(expandedCategory === category ? null : category)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg border-2 border-outline-variant
                  bg-surface-lowest hover:bg-surface-low transition-all font-display font-bold text-xs text-on-surface"
              >
                <span>{category}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] text-on-surface-variant font-body">{prompts.length} challenges</span>
                  <span className={`transition-transform ${expandedCategory === category ? 'rotate-180' : ''}`}>▾</span>
                </div>
              </button>

              <AnimatePresence>
                {expandedCategory === category && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="py-1 pl-2 space-y-1">
                      {prompts.map(prompt => (
                        <button
                          key={prompt.id}
                          onClick={() => handleSelectPrompt(prompt.id)}
                          disabled={!isHost}
                          className={`w-full text-left px-3 py-2 rounded-lg border-2 transition-all
                            ${gameSettings.promptId === prompt.id
                              ? 'border-primary bg-primary-container/40 shadow-sm'
                              : 'border-transparent hover:border-outline-variant hover:bg-surface-lowest'
                            }
                            ${!isHost ? 'cursor-default' : 'cursor-pointer'}`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-display font-bold text-xs text-on-surface">{prompt.title}</span>
                            <span className={`text-[8px] font-display font-bold px-1.5 py-0.5 rounded-full border ${DIFFICULTY_BADGES[prompt.difficulty]?.color}`}>
                              {prompt.difficulty}
                            </span>
                          </div>
                          <p className="text-[10px] text-on-surface-variant font-body mt-0.5 line-clamp-1">{prompt.description}</p>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
