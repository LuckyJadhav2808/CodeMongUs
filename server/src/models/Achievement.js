import { db } from '../config/firebase.js';
import { FieldValue } from 'firebase-admin/firestore';

const COLLECTION = 'achievements';

const ACHIEVEMENT_DEFS = [
  { id: 'first_blood', name: 'First Blood', desc: 'Win your first game', condition: { stat: 'wins', threshold: 1 }, icon: '🏆' },
  { id: 'serial_winner', name: 'Serial Winner', desc: 'Win 10 games', condition: { stat: 'wins', threshold: 10 }, icon: '🔥' },
  { id: 'master_coder', name: 'Master Coder', desc: 'Win 50 games', condition: { stat: 'wins', threshold: 50 }, icon: '💎' },
  { id: 'perfect_impostor', name: 'Perfect Impostor', desc: 'Win as impostor without being suspected', condition: { stat: 'impostorWins', threshold: 1 }, icon: '🗡️' },
  { id: 'impostor_main', name: 'Impostor Main', desc: 'Win 10 games as impostor', condition: { stat: 'impostorWins', threshold: 10 }, icon: '😈' },
  { id: 'crewmate_hero', name: 'Crewmate Hero', desc: 'Win 10 games as crewmate', condition: { stat: 'crewmateWins', threshold: 10 }, icon: '🛡️' },
  { id: 'bug_reporter', name: 'Bug Reporter', desc: 'Report 20 bugs', condition: { stat: 'bugsReported', threshold: 20 }, icon: '🐛' },
  { id: 'saboteur', name: 'Master Saboteur', desc: 'Use 50 sabotages', condition: { stat: 'sabotagesUsed', threshold: 50 }, icon: '💣' },
  { id: 'veteran', name: 'Veteran', desc: 'Play 100 games', condition: { stat: 'totalGames', threshold: 100 }, icon: '⭐' },
];

export function getAchievementDefinitions() {
  return ACHIEVEMENT_DEFS;
}

/**
 * Check user stats against achievement conditions and return newly unlocked ones.
 */
export function checkAchievements(userStats, alreadyUnlocked = []) {
  const newlyUnlocked = [];
  for (const ach of ACHIEVEMENT_DEFS) {
    if (alreadyUnlocked.includes(ach.id)) continue;
    const statValue = userStats[ach.condition.stat] || 0;
    if (statValue >= ach.condition.threshold) {
      newlyUnlocked.push(ach);
    }
  }
  return newlyUnlocked;
}

export async function saveUserAchievements(uid, achievementIds) {
  if (!db) return;
  await db.collection('users').doc(uid).update({
    achievements: FieldValue.arrayUnion(...achievementIds),
  });
}

export async function getAllAchievements() {
  return ACHIEVEMENT_DEFS;
}
