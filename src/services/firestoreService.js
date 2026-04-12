import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  getDocs,
  onSnapshot,
  serverTimestamp,
  increment,
} from 'firebase/firestore';
import { db } from '../config/firebase';

// ─────────────────────────────────────────────
// Default stats for new users
// ─────────────────────────────────────────────
const DEFAULT_STATS = {
  gamesPlayed: 0,
  gamesWon: 0,
  gamesLost: 0,
  timesImpostor: 0,
  timesCrewmate: 0,
  impostorWins: 0,
  crewmateWins: 0,
  totalVotesCast: 0,
  correctVotes: 0,
  timesSabotaged: 0,
  bugReports: 0,
  totalPlayTimeMs: 0,
  gitXp: 0,
};

// ─────────────────────────────────────────────
// CREATE — called once on first sign-up
// ─────────────────────────────────────────────
export async function createUserDoc(uid, data = {}) {
  const ref = doc(db, 'users', uid);
  const existing = await getDoc(ref);

  if (existing.exists()) {
    // User already exists, just update lastLoginAt
    await updateDoc(ref, { lastLoginAt: serverTimestamp() });
    return existing.data();
  }

  const userData = {
    displayName: data.displayName || 'Player',
    email: data.email || '',
    avatarStyle: data.avatarStyle || 'bottts-neutral',
    avatarSeed: data.avatarSeed || '',
    createdAt: serverTimestamp(),
    lastLoginAt: serverTimestamp(),
    stats: { ...DEFAULT_STATS },
  };

  await setDoc(ref, userData);
  return userData;
}

// ─────────────────────────────────────────────
// READ — fetch user profile + stats
// ─────────────────────────────────────────────
export async function getUserDoc(uid) {
  const ref = doc(db, 'users', uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

// ─────────────────────────────────────────────
// UPDATE — save profile changes
// ─────────────────────────────────────────────
export async function updateUserProfile(uid, profileData) {
  const ref = doc(db, 'users', uid);
  const updates = {};

  if (profileData.displayName !== undefined) updates.displayName = profileData.displayName;
  if (profileData.avatarStyle !== undefined) updates.avatarStyle = profileData.avatarStyle;
  if (profileData.avatarSeed !== undefined) updates.avatarSeed = profileData.avatarSeed;
  if (profileData.email !== undefined) updates.email = profileData.email;

  if (Object.keys(updates).length > 0) {
    await updateDoc(ref, updates);
  }
}

// ─────────────────────────────────────────────
// UPDATE — increment stats after game events
// ─────────────────────────────────────────────
export async function updateUserStats(uid, statUpdates) {
  const ref = doc(db, 'users', uid);
  const updates = {};

  for (const [key, value] of Object.entries(statUpdates)) {
    if (typeof value === 'number') {
      updates[`stats.${key}`] = increment(value);
    }
  }

  if (Object.keys(updates).length > 0) {
    await updateDoc(ref, updates);
  }
}

// ─────────────────────────────────────────────
// MATCH HISTORY — add a match record
// ─────────────────────────────────────────────
export async function addMatchRecord(uid, matchData) {
  const matchesRef = collection(db, 'users', uid, 'matches');
  await addDoc(matchesRef, {
    roomCode: matchData.roomCode || '',
    role: matchData.role || 'crewmate',
    result: matchData.result || 'loss',
    playerCount: matchData.playerCount || 0,
    playedAt: serverTimestamp(),
    durationMs: matchData.durationMs || 0,
  });
}

// ─────────────────────────────────────────────
// MATCH HISTORY — fetch recent matches
// ─────────────────────────────────────────────
export async function getMatchHistory(uid, maxResults = 20) {
  const matchesRef = collection(db, 'users', uid, 'matches');
  const q = query(matchesRef, orderBy('playedAt', 'desc'), limit(maxResults));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// ─────────────────────────────────────────────
// LEADERBOARD — real-time top players
// ─────────────────────────────────────────────
export function listenToLeaderboard(callback, maxResults = 20) {
  const usersRef = collection(db, 'users');
  const q = query(usersRef, orderBy('stats.gitXp', 'desc'), limit(maxResults));
  return onSnapshot(q, (snapshot) => {
    const leaders = snapshot.docs.map((d) => ({
      id: d.id,
      displayName: d.data().displayName || 'Player',
      avatarStyle: d.data().avatarStyle || 'bottts-neutral',
      avatarSeed: d.data().avatarSeed || '',
      stats: d.data().stats || {},
    }));
    callback(leaders);
  });
}

