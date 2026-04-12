import { db } from '../config/firebase.js';
import { FieldValue } from 'firebase-admin/firestore';

const COLLECTION = 'users';

/**
 * Create or update user profile on first login.
 */
export async function createOrUpdateUser(uid, data) {
  if (!db) return { uid, ...data };
  const ref = db.collection(COLLECTION).doc(uid);
  const doc = await ref.get();

  if (doc.exists) {
    await ref.update({ lastLogin: FieldValue.serverTimestamp(), ...data });
    return { uid, ...doc.data(), ...data };
  }

  const profile = {
    uid,
    username: data.username || data.name || 'Player',
    email: data.email || null,
    avatarUrl: data.picture || null,
    isAnonymous: data.isAnonymous || false,
    stats: {
      gamesPlayed: 0,
      gamesWon: 0,
      gamesLost: 0,
      timesImpostor: 0,
      impostorWins: 0,
      timesCrewmate: 0,
      crewmateWins: 0,
      sabotagesUsed: 0,
      bugsReported: 0,
      bugReports: 0,
      totalPlayTimeMs: 0,
      totalVotesCast: 0,
      gitXp: 0,
    },
    achievements: [],
    createdAt: FieldValue.serverTimestamp(),
    lastLogin: FieldValue.serverTimestamp(),
  };
  await ref.set(profile);
  return { uid, ...profile };
}

export async function getUser(uid) {
  if (!db) return null;
  const doc = await db.collection(COLLECTION).doc(uid).get();
  return doc.exists ? { uid, ...doc.data() } : null;
}

export async function updateUser(uid, updates) {
  if (!db) return updates;
  await db.collection(COLLECTION).doc(uid).update(updates);
  return updates;
}

export async function updateStats(uid, statUpdates) {
  if (!db) return;
  const increments = {};
  for (const [key, val] of Object.entries(statUpdates)) {
    increments[`stats.${key}`] = FieldValue.increment(val);
  }
  await db.collection(COLLECTION).doc(uid).update(increments);
}

export async function checkUsername(username) {
  if (!db) return { available: true };
  const snap = await db.collection(COLLECTION).where('username', '==', username).limit(1).get();
  return { available: snap.empty };
}

export async function deleteUser(uid) {
  if (!db) return;
  await db.collection(COLLECTION).doc(uid).delete();
}

export async function getLeaderboard(limit = 20, sortBy = 'stats.gamesWon') {
  if (!db) return [];
  const snap = await db.collection(COLLECTION)
    .orderBy(sortBy, 'desc')
    .limit(limit)
    .get();
  return snap.docs.map(d => ({ uid: d.id, ...d.data() }));
}
