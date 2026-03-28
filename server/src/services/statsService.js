import { updateStats, getUser } from '../models/User.js';
import { checkAchievements, saveUserAchievements } from '../models/Achievement.js';

/**
 * Process post-game statistics for a player.
 * Updates user stats and checks for new achievements.
 */
export async function processPostGame(uid, role, won) {
  try {
    const statUpdates = { totalGames: 1 };

    if (role === 'impostor') {
      statUpdates.impostorGames = 1;
      if (won) statUpdates.impostorWins = 1;
    } else {
      statUpdates.crewmateGames = 1;
      if (won) statUpdates.crewmateWins = 1;
    }

    if (won) {
      statUpdates.wins = 1;
    } else {
      statUpdates.losses = 1;
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
