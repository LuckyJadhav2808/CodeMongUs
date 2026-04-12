import { motion } from 'framer-motion';
import useGameStore from '../../store/gameStore';
import { getAvatarWithStyle } from '../../utils/avatarGenerator';
import { getRankForXp, getXpProgress } from '../../utils/rankUtils';

const STAT_CARDS = [
  { key: 'gamesPlayed', label: 'Games Played', icon: '🎮', color: 'bg-secondary-container', textColor: 'text-secondary' },
  { key: 'gamesWon', label: 'Wins', icon: '🏆', color: 'bg-tertiary-container', textColor: 'text-tertiary' },
  { key: 'gamesLost', label: 'Losses', icon: '💀', color: 'bg-primary-container', textColor: 'text-primary' },
  { key: 'timesImpostor', label: 'Impostor', icon: '🔪', color: 'bg-primary-container', textColor: 'text-primary' },
  { key: 'timesCrewmate', label: 'Crewmate', icon: '🔧', color: 'bg-secondary-container', textColor: 'text-secondary' },
  { key: 'impostorWins', label: 'Impostor Wins', icon: '😈', color: 'bg-primary-container', textColor: 'text-primary' },
  { key: 'crewmateWins', label: 'Crewmate Wins', icon: '🛡️', color: 'bg-secondary-container', textColor: 'text-secondary' },
  { key: 'bugReports', label: 'Bugs Reported', icon: '🐛', color: 'bg-tertiary-container', textColor: 'text-tertiary' },
];

function formatDuration(ms) {
  if (!ms) return '—';
  const mins = Math.floor(ms / 60000);
  const secs = Math.floor((ms % 60000) / 1000);
  return `${mins}m ${secs}s`;
}

function formatDate(timestamp) {
  if (!timestamp) return '—';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function StatsPanel() {
  const { userStats, matchHistory, user, profile } = useGameStore();
  const displayName = profile.displayName || user?.name || 'Player';
  const avatarStyle = profile.avatarStyle || 'bottts-neutral';
  const avatarSeed = profile.avatarSeed || user?.name || 'Player';

  const winRate = userStats.gamesPlayed > 0
    ? Math.round((userStats.gamesWon / userStats.gamesPlayed) * 100)
    : 0;

  const xp = userStats.gitXp || 0;
  const rank = getRankForXp(xp);
  const progress = getXpProgress(xp);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      {/* Player Summary */}
      <div className="card !shadow-chunky-lg mb-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-full border-4 border-on-surface bg-surface-highest overflow-hidden shadow-chunky-sm">
            <img
              src={getAvatarWithStyle(avatarSeed, avatarStyle, 80)}
              alt={displayName}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="font-display font-extrabold text-2xl text-on-surface">{displayName}</h2>
              <span className="text-xl">{rank.badge}</span>
            </div>
            <p className="font-body text-sm text-on-surface-variant">{rank.title} • {user?.email || 'Player'}</p>
            <div className="flex items-center gap-3 mt-2">
              <span className="badge-blue">⚡ {xp.toLocaleString()} GitXP</span>
              <span className="badge-yellow">{winRate}% win rate</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mb-6">
        <h3 className="font-display font-bold text-lg text-on-surface mb-4 flex items-center gap-2">
          <span>📊</span> Career Stats
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {STAT_CARDS.map((stat, i) => (
            <motion.div
              key={stat.key}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`${stat.color} border-3 border-on-surface rounded-xl p-4 shadow-chunky-sm
                hover:shadow-chunky hover:-translate-y-0.5 transition-all duration-200`}
            >
              <div className="text-2xl mb-1">{stat.icon}</div>
              <p className={`font-display font-extrabold text-2xl ${stat.textColor}`}>
                {userStats[stat.key] || 0}
              </p>
              <p className="font-body text-xs text-on-surface-variant font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Rank Progress */}
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display font-bold text-sm text-on-surface flex items-center gap-2">
            {rank.badge} Rank Progress
          </h3>
          {progress.nextRank && (
            <span className="font-body text-xs text-on-surface-variant">
              Next: {progress.nextRank.badge} {progress.nextRank.title}
            </span>
          )}
        </div>
        <div className="h-6 bg-surface-container rounded-full border-2 border-outline-variant overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress.percent}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #3046e3, #8b5cf6, #caceff)' }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs font-body text-on-surface-variant">
            {xp.toLocaleString()} / {(progress.nextRank?.xpRequired || xp).toLocaleString()} XP
          </span>
          <span className="font-display font-bold text-sm text-secondary">{progress.percent}%</span>
        </div>
      </div>

      {/* Win Rate Bar */}
      <div className="card mb-6">
        <h3 className="font-display font-bold text-sm text-on-surface mb-3">Win Rate</h3>
        <div className="h-6 bg-surface-container rounded-full border-2 border-outline-variant overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${winRate}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(160deg, #3046e3 0%, #caceff 100%)' }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs font-body text-on-surface-variant">{userStats.gamesWon}W / {userStats.gamesLost}L</span>
          <span className="font-display font-bold text-sm text-secondary">{winRate}%</span>
        </div>
      </div>

      {/* Play Time */}
      <div className="card mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold text-sm text-on-surface">⏱️ Total Play Time</h3>
            <p className="font-display font-extrabold text-xl text-secondary">
              {formatDuration(userStats.totalPlayTimeMs)}
            </p>
          </div>
          <div className="text-right">
            <h3 className="font-display font-bold text-sm text-on-surface">🗳️ Votes Cast</h3>
            <p className="font-display font-extrabold text-xl text-primary">
              {userStats.totalVotesCast || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Match History */}
      <div className="card !shadow-chunky-lg">
        <h3 className="font-display font-bold text-lg text-on-surface mb-4 flex items-center gap-2">
          <span>📜</span> Match History
        </h3>

        {matchHistory.length === 0 ? (
          <div className="text-center py-10">
            <span className="text-4xl block mb-3">🎮</span>
            <p className="font-body text-sm text-on-surface-variant">
              No matches played yet. Create or join a room to start!
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {matchHistory.map((match, i) => (
              <motion.div
                key={match.id || i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`flex items-center gap-3 p-3 rounded-xl border-3 transition-all
                  ${match.result === 'win'
                    ? 'border-secondary bg-secondary-container/30'
                    : 'border-primary bg-primary-container/30'}`}
              >
                <span className="text-xl">
                  {match.result === 'win' ? '🏆' : '💀'}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-display font-bold text-sm text-on-surface capitalize">
                      {match.role || 'Unknown'}
                    </span>
                    <span className={`text-xs font-display font-bold px-2 py-0.5 rounded-full border-2 border-on-surface
                      ${match.result === 'win' ? 'bg-secondary-container text-secondary' : 'bg-primary-container text-primary'}`}>
                      {match.result === 'win' ? 'WIN' : 'LOSS'}
                    </span>
                  </div>
                  <p className="text-xs font-body text-on-surface-variant">
                    Room: {match.roomCode || '—'} · {match.playerCount || 0} players · {formatDuration(match.durationMs)}
                  </p>
                </div>
                <span className="text-xs font-body text-on-surface-variant text-right whitespace-nowrap">
                  {formatDate(match.playedAt)}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
