import { updateStats, getUser } from '../models/User.js';
import { checkAchievements, saveUserAchievements } from '../models/Achievement.js';

/**
 * Process post-game statistics for a player.
 * Updates user stats and checks for new achievements.
 */
export async function processPostGame(uid, role, won, metrics = {}) {
  try {
    const statUpdates = {
      gamesPlayed: 1,
      totalPlayTimeMs: metrics.totalPlayTimeMs || 0,
      totalVotesCast: metrics.totalVotesCast || 0,
      sabotagesUsed: metrics.sabotagesUsed || 0,
      bugReports: metrics.bugReports || 0,
      gitXp: metrics.xpEarned || 0,
    };

    if (role === 'impostor') {
      statUpdates.timesImpostor = 1;
      if (won) statUpdates.impostorWins = 1;
    } else {
      statUpdates.timesCrewmate = 1;
      if (won) statUpdates.crewmateWins = 1;
    }

    if (won) {
      statUpdates.gamesWon = 1;
    } else {
      statUpdates.gamesLost = 1;
    }

    await updateStats(uid, statUpdates);

    // Check achievements
    const user = await getUser(uid);
    if (user) {
      const newAchievements = checkAchievements(user.stats, user.achievements || []);
      if (newAchievements.length > 0) {
        const ids = newAchievements.map(a => a.id);
        await saveUserAchievements(uid, ids);
        console.log(`🏆 [${uid}] Unlocked: ${newAchievements.map(a => a.name).join(', ')}`);
        return newAchievements;
      }
    }
    return [];
  } catch (err) {
    console.error(`Stats update failed for ${uid}:`, err.message);
    return [];
  }
}
