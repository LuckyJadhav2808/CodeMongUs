import { motion } from 'framer-motion';
import useGameStore from '../../store/gameStore';
import { getRankForXp, getXpProgress, getUnlockedRewards, RANKS, REWARDS } from '../../utils/rankUtils';

export default function RewardsPanel() {
  const { userStats } = useGameStore();
  const xp = userStats?.gitXp || 0;
  const rank = getRankForXp(xp);
  const progress = getXpProgress(xp);
  const unlocked = getUnlockedRewards(xp, []);
  const unlockedIds = new Set(unlocked.map(r => r.id));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      {/* Current Rank Card */}
      <div className="card !shadow-chunky-lg mb-6">
        <div className="flex items-center gap-5">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="text-6xl"
          >
            {rank.badge}
          </motion.div>
          <div className="flex-1">
            <p className="font-body text-xs text-on-surface-variant uppercase tracking-wider mb-1">Current Rank</p>
            <h2 className="font-display font-extrabold text-3xl text-on-surface">{rank.title}</h2>
            <p className="font-display font-bold text-sm text-secondary mt-1">⚡ {xp.toLocaleString()} GitXP</p>
          </div>
        </div>

        {/* XP Progress Bar */}
        {progress.nextRank ? (
          <div className="mt-5">
            <div className="flex items-center justify-between mb-2">
              <span className="font-display font-bold text-xs text-on-surface-variant">
                Progress to {progress.nextRank.badge} {progress.nextRank.title}
              </span>
              <span className="font-mono text-xs text-on-surface-variant">
                {xp} / {progress.nextRank.xpRequired} XP
              </span>
            </div>
            <div className="h-4 bg-surface-container rounded-full border-2 border-outline-variant overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress.percent}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #3046e3, #8b5cf6, #caceff)' }}
              />
            </div>
            <p className="font-body text-[10px] text-on-surface-variant mt-1 text-right">
              {progress.nextRank.xpRequired - xp} XP to next rank
            </p>
          </div>
        ) : (
          <div className="mt-5 py-3 px-4 rounded-xl bg-secondary-container/30 border-2 border-secondary text-center">
            <p className="font-display font-bold text-sm text-secondary">👑 Maximum Rank Achieved!</p>
          </div>
        )}
      </div>

      {/* Rank Roadmap */}
      <div className="card mb-6">
        <h3 className="font-display font-bold text-lg text-on-surface mb-4 flex items-center gap-2">
          <span>🗺️</span> Rank Roadmap
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {RANKS.map((r, i) => {
            const isCurrentOrPast = rank.level >= r.level;
            const isCurrent = rank.level === r.level;
            return (
              <motion.div
                key={r.level}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-3 transition-all
                  ${isCurrent
                    ? 'border-secondary bg-secondary-container/30 shadow-chunky-blue'
                    : isCurrentOrPast
                      ? 'border-on-surface bg-surface-lowest'
                      : 'border-outline-variant bg-surface-highest opacity-50'}`}
              >
                <span className="text-3xl">{r.badge}</span>
                <p className={`font-display font-bold text-xs text-center ${isCurrent ? 'text-secondary' : 'text-on-surface'}`}>
                  {r.title}
                </p>
                <span className="font-mono text-[10px] text-on-surface-variant">
                  {r.xpRequired.toLocaleString()} XP
                </span>
                {isCurrent && (
                  <span className="text-[9px] font-display font-bold text-secondary bg-secondary-container px-2 py-0.5 rounded-full border border-secondary">
                    YOU
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Rewards Grid */}
      <div className="card !shadow-chunky-lg">
        <h3 className="font-display font-bold text-lg text-on-surface mb-4 flex items-center gap-2">
          <span>🎁</span> Rewards
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {REWARDS.map((reward, i) => {
            const isUnlocked = unlockedIds.has(reward.id);
            const conditionText = reward.condition.type === 'rank'
              ? `Rank ${reward.condition.level}: ${RANKS.find(r => r.level === reward.condition.level)?.title || ''}`
              : `Achievement: ${reward.condition.id}`;

            return (
              <motion.div
                key={reward.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`flex items-center gap-3 p-3 rounded-xl border-3 transition-all
                  ${isUnlocked
                    ? 'border-on-surface bg-surface-lowest shadow-chunky-sm hover:shadow-chunky hover:-translate-y-0.5'
                    : 'border-outline-variant bg-surface-highest opacity-40 grayscale'}`}
              >
                <span className="text-2xl">{reward.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-display font-bold text-xs truncate">{reward.name}</p>
                  <p className="font-body text-[10px] text-on-surface-variant capitalize">
                    {reward.type}
                  </p>
                  {!isUnlocked && (
                    <p className="font-body text-[9px] text-on-surface-variant mt-0.5 truncate">
                      🔒 {conditionText}
                    </p>
                  )}
                  {isUnlocked && (
                    <p className="font-body text-[9px] text-secondary font-bold mt-0.5">
                      ✅ Unlocked
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
