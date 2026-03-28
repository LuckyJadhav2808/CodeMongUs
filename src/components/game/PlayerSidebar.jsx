import { motion } from 'framer-motion';
import Avatar from '../common/Avatar';
import useGameStore from '../../store/gameStore';

export default function PlayerSidebar() {
  const { players } = useGameStore();
  const alive = players.filter(p => p.status === 'alive');
  const dead = players.filter(p => p.status === 'eliminated');

  return (
    <div className="flex flex-col h-full bg-surface-lowest border-3 border-on-surface rounded-2xl shadow-chunky overflow-hidden">
      <div className="px-4 py-3 border-b-3 border-on-surface bg-surface-high">
        <h3 className="font-display font-bold text-sm flex items-center gap-2">
          <span>👥</span> CREW STATUS
          <span className="ml-auto badge-blue text-[10px]">{alive.length} alive</span>
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {alive.map((player, i) => (
          <motion.div
            key={player.uid || i}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="player-card"
          >
            <Avatar name={player.username || player.name} size={36} showBorder={false} />
            <div className="flex-1 min-w-0">
              <p className="font-display font-bold text-xs truncate">{player.username || player.name}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <span className="text-[10px] text-on-surface-variant">Coding...</span>
              </div>
            </div>
          </motion.div>
        ))}

        {dead.length > 0 && (
          <>
            <div className="pt-2 pb-1">
              <span className="text-[10px] font-display font-bold uppercase tracking-widest text-on-surface-variant">
                💀 Eliminated
              </span>
            </div>
            {dead.map((player) => (
              <div key={player.uid} className="player-card eliminated">
                <Avatar name={player.username || player.name} size={36} showBorder={false} />
                <div className="flex-1 min-w-0">
                  <p className="font-display font-bold text-xs truncate line-through">{player.username || player.name}</p>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
