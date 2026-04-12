import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Avatar from '../common/Avatar';
import useGameStore from '../../store/gameStore';
import { getRankForXp } from '../../utils/rankUtils';

/**
 * LeaderboardPanel — Real-time global leaderboard with a 3-step podium.
 * Rank 1 center (tallest), Rank 2 left (medium), Rank 3 right (lowest).
 */
export default function LeaderboardPanel() {
  const { globalLeaderboard, startLeaderboardListener, stopLeaderboardListener } = useGameStore();

  // Start/stop the real-time Firestore listener
  useEffect(() => {
    startLeaderboardListener();
    return () => stopLeaderboardListener();
  }, [startLeaderboardListener, stopLeaderboardListener]);

  const top3 = globalLeaderboard.slice(0, 3);
  const rest = globalLeaderboard.slice(3);

  // Podium order: [Rank 2, Rank 1, Rank 3] for visual layout
  const podiumOrder = top3.length >= 3
    ? [top3[1], top3[0], top3[2]]
    : top3;

  const podiumConfig = [
    { height: 120, color: 'bg-secondary-container', border: 'border-secondary', medal: '🥈', rank: 2 },
    { height: 160, color: 'bg-primary-container', border: 'border-primary', medal: '👑', rank: 1 },
    { height: 90, color: 'bg-tertiary-container', border: 'border-tertiary', medal: '🥉', rank: 3 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="font-display font-extrabold text-3xl text-on-surface mb-2">
          🏆 Global Leaderboard
        </h1>
        <p className="font-body text-on-surface-variant text-sm">
          Top crew members ranked by GitXP — updates in real time
        </p>
      </div>

      {/* Podium */}
      {top3.length >= 3 ? (
        <div className="flex items-end justify-center gap-4 mb-10 px-8">
          {podiumOrder.map((player, i) => {
            const config = podiumConfig[i];
            return (
              <motion.div
                key={player.id}
                initial={{ y: 60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 + i * 0.15, type: 'spring', damping: 12 }}
                className="flex flex-col items-center"
                style={{ width: config.rank === 1 ? '40%' : '30%' }}
              >
                {/* Player info above podium */}
                <div className="mb-3 text-center">
                  <div className="text-3xl mb-1">{config.medal}</div>
                  <div className={`${config.rank === 1 ? 'ring-4 ring-primary/30' : ''} rounded-full inline-block`}>
                    <Avatar name={player.displayName} size={config.rank === 1 ? 64 : 48} />
                  </div>
                  <p className="font-display font-bold text-sm mt-2 truncate max-w-[120px]">
                    {player.displayName}
                  </p>
                  <p className="font-body text-xs text-on-surface-variant">
                    {getRankForXp(player.stats.gitXp || 0).badge} {(player.stats.gitXp || 0).toLocaleString()} XP
                  </p>
                </div>

                {/* Podium block */}
                <div
                  className={`w-full ${config.color} border-3 ${config.border} rounded-t-2xl
                    flex items-center justify-center shadow-chunky`}
                  style={{ height: `${config.height}px` }}
                >
                  <span className="font-display font-extrabold text-4xl opacity-20">
                    #{config.rank}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 mb-8">
          <span className="text-5xl block mb-3">🏗️</span>
          <p className="font-body text-on-surface-variant text-sm">
            Not enough players for the podium yet. Play some games!
          </p>
        </div>
      )}

      {/* Remaining players list */}
      <div className="card !shadow-chunky">
        <div className="px-5 py-3 border-b-3 border-on-surface bg-surface-high rounded-t-2xl">
          <h3 className="font-display font-bold text-sm flex items-center gap-2">
            <span>📋</span> FULL RANKINGS
          </h3>
        </div>
        <div className="divide-y-2 divide-outline-variant">
          {globalLeaderboard.length === 0 && (
            <p className="text-center text-sm text-on-surface-variant font-body py-8 opacity-50">
              No players yet. Be the first to play!
            </p>
          )}
          {globalLeaderboard.map((player, i) => (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * i }}
              className={`flex items-center gap-4 px-5 py-3 ${i % 2 === 0 ? 'bg-surface-lowest' : 'bg-surface-low'} ${i < 3 ? 'font-bold' : ''}`}
            >
              {/* Rank */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-display font-extrabold text-sm
                ${i === 0 ? 'bg-primary text-on-primary' : i === 1 ? 'bg-secondary text-on-secondary' : i === 2 ? 'bg-tertiary text-on-tertiary' : 'bg-surface-container text-on-surface-variant'}`}
              >
                {i + 1}
              </div>

              {/* Avatar + Name */}
              <Avatar name={player.displayName} size={36} showBorder={false} />
              <div className="flex-1 min-w-0">
                <p className="font-display font-bold text-sm truncate">{player.displayName}</p>
                <p className="font-body text-[10px] text-on-surface-variant">
                  {player.stats.gamesPlayed || 0} games played
                </p>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 text-xs font-body">
                <div className="text-center">
                  <p className="font-display font-bold text-sm text-secondary">{(player.stats.gitXp || 0).toLocaleString()}</p>
                  <p className="text-[9px] text-on-surface-variant">GitXP</p>
                </div>
                <div className="text-center">
                  <p className="font-display font-bold text-sm text-primary">{player.stats.gamesWon || 0}</p>
                  <p className="text-[9px] text-on-surface-variant">WINS</p>
                </div>
                <div className="text-center hidden sm:block">
                  <p className="font-display font-bold text-xs">{getRankForXp(player.stats.gitXp || 0).badge} {getRankForXp(player.stats.gitXp || 0).title}</p>
                  <p className="text-[9px] text-on-surface-variant">RANK</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
