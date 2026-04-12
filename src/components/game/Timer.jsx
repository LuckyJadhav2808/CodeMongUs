import { motion } from 'framer-motion';
import { useEffect } from 'react';

export default function Timer({ initialSeconds = 240, autoStart = true, label = 'MISSION TIME', onExpire }) {
  const seconds = initialSeconds;
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const display = `${minutes}:${secs.toString().padStart(2, '0')}`;
  const isWarning = seconds <= 30 && seconds > 10;
  const isCritical = seconds <= 10;
  const isExpired = seconds <= 0;

  useEffect(() => {
    if (isExpired && onExpire) onExpire();
  }, [isExpired, onExpire]);

  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-[10px] font-display font-bold uppercase tracking-widest text-on-surface-variant">
        {label}
      </span>
      <motion.div
        className={`font-display font-extrabold text-3xl tabular-nums
          ${isCritical ? 'text-error timer-warning' : isWarning ? 'text-error' : 'text-on-surface'}`}
        animate={isCritical ? { scale: [1, 1.08, 1] } : {}}
        transition={isCritical ? { repeat: Infinity, duration: 0.6 } : {}}
      >
        {display}
      </motion.div>
    </div>
  );
}

