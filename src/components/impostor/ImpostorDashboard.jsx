import { motion } from 'framer-motion';
import useGameStore from '../../store/gameStore';
import { useState } from 'react';

const ABILITIES = [
  { id: 'flashbang', name: 'Flashbang', desc: 'Flash all crewmate screens white for 5s', icon: '💡', cooldown: 30 },
  { id: 'typo', name: 'Typo Injection', desc: 'Delete 3 random syntax chars from code', icon: '⌨️', cooldown: 20 },
  { id: 'ghost', name: 'Cursor Ghosting', desc: 'Hide your cursor for 10s', icon: '👻', cooldown: 25 },
  { id: 'lag', name: 'Lag Spike', desc: 'Freeze crewmate keyboards for 3s', icon: '🧊', cooldown: 45 },
];

export default function ImpostorDashboard() {
  const { useSabotage, toggleImpostorPanel } = useGameStore();
  const [cooldowns, setCooldowns] = useState({});

  const handleSabotage = (ability) => {
    if (cooldowns[ability.id]) return;
    useSabotage(ability.id);

    // Start client-side cooldown display
    setCooldowns((prev) => ({ ...prev, [ability.id]: ability.cooldown }));
    const interval = setInterval(() => {
      setCooldowns((prev) => {
        const newTime = (prev[ability.id] || 0) - 1;
        if (newTime <= 0) {
          clearInterval(interval);
          const { [ability.id]: _, ...rest } = prev;
          return rest;
        }
        return { ...prev, [ability.id]: newTime };
      });
    }, 1000);
  };

  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed right-4 top-20 z-50 w-[300px]"
    >
      <div className="bg-on-surface border-3 border-primary rounded-2xl shadow-glow-red overflow-hidden">
        <div className="px-4 py-3 gradient-primary flex items-center justify-between">
          <h3 className="font-display font-bold text-sm text-white flex items-center gap-2">
            <span>🔧</span> SABOTAGE MENU
          </h3>
          <button onClick={toggleImpostorPanel} className="text-white/70 hover:text-white text-xl leading-none">×</button>
        </div>

        <div className="p-3 space-y-2">
          {ABILITIES.map((ability) => {
            const cd = cooldowns[ability.id];
            const isOnCooldown = !!cd;

            return (
              <motion.button
                key={ability.id}
                whileHover={!isOnCooldown ? { scale: 1.02 } : {}}
                whileTap={!isOnCooldown ? { scale: 0.97 } : {}}
                onClick={() => handleSabotage(ability)}
                disabled={isOnCooldown}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all
                  ${isOnCooldown
                    ? 'border-gray-600 bg-gray-800 opacity-50 cursor-not-allowed'
                    : 'border-primary/50 bg-gray-900 hover:bg-gray-800 hover:border-primary cursor-pointer'
                  }`}
              >
                <span className="text-2xl">{ability.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-display font-bold text-xs text-white">{ability.name}</p>
                  <p className="text-[10px] text-gray-400">{ability.desc}</p>
                </div>
                {isOnCooldown ? (
                  <span className="font-mono text-xs text-primary font-bold">{cd}s</span>
                ) : (
                  <span className="text-[10px] text-green-400 font-bold">READY</span>
                )}
              </motion.button>
            );
          })}
        </div>

        <div className="px-4 py-2 border-t border-gray-700 flex items-center justify-between">
          <span className="text-[10px] text-gray-500 font-mono">ROLE: IMPOSTOR</span>
          <span className="text-[10px] text-primary font-display font-bold">🎯 Stay hidden</span>
        </div>
      </div>
    </motion.div>
  );
}
