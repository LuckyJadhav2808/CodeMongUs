import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import useGameStore from '../../store/gameStore';

export default function RoleReveal() {
  const { myRole, setScreen, setShowRoleReveal } = useGameStore();
  const [phase, setPhase] = useState('enter'); // 'enter' | 'show' | 'exit'

  const isImpostor = myRole === 'impostor';

  useEffect(() => {
    const timer1 = setTimeout(() => setPhase('show'), 500);
    const timer2 = setTimeout(() => setPhase('exit'), 3500);
    const timer3 = setTimeout(() => {
      setShowRoleReveal(false);
      setScreen('game');
    }, 4200);
    return () => { clearTimeout(timer1); clearTimeout(timer2); clearTimeout(timer3); };
  }, [setScreen, setShowRoleReveal]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{
        background: isImpostor
          ? 'linear-gradient(160deg, #1a0002 0%, #4f0001 50%, #ba0209 100%)'
          : 'linear-gradient(160deg, #000838 0%, #001aa4 50%, #3046e3 100%)'
      }}
    >
      {/* Scanline effect */}
      <div className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)',
          backgroundSize: '100% 4px',
        }}
      />

      <div className="text-center relative">
        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={phase !== 'exit' ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ delay: 0.3 }}
          className="font-body text-white/60 text-lg mb-4 uppercase tracking-[0.3em]"
        >
          Your role is...
        </motion.p>

        {/* Main Role Text */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.3, rotate: -5 }}
          animate={phase === 'show'
            ? { opacity: 1, scale: [0.3, 1.3, 1], rotate: [-5, 3, 0] }
            : phase === 'exit'
            ? { opacity: 0, scale: 0.8, y: -40 }
            : { opacity: 0, scale: 0.3 }}
          transition={{ type: 'spring', damping: 12, stiffness: 200 }}
          className={`font-display font-extrabold text-7xl md:text-8xl lg:text-9xl tracking-tight
            ${isImpostor ? 'text-primary-container' : 'text-secondary-container'}`}
          style={{
            textShadow: isImpostor
              ? '0 0 60px rgba(186,2,9,0.8), 0 0 120px rgba(186,2,9,0.4)'
              : '0 0 60px rgba(48,70,227,0.8), 0 0 120px rgba(48,70,227,0.4)',
          }}
        >
          {isImpostor ? 'IMPOSTOR' : 'CREWMATE'}
        </motion.h1>

        {/* Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={phase === 'show' ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
          transition={{ delay: 0.6, type: 'spring' }}
          className="mt-8 text-6xl"
        >
          {isImpostor ? '🗡️' : '🛡️'}
        </motion.div>

        {/* Flavor Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={phase === 'show' ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 1 }}
          className="font-body text-white/50 text-base mt-6 max-w-md mx-auto"
        >
          {isImpostor
            ? 'Sabotage the code. Eliminate the crew. Stay hidden.'
            : 'Complete your tasks. Find the impostor. Survive.'}
        </motion.p>
      </div>
    </motion.div>
  );
}
