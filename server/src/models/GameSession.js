import { db } from '../config/firebase.js';
import { FieldValue } from 'firebase-admin/firestore';

const COLLECTION = 'gameSessions';

export async function createSession(roomCode, hostUid, hostName) {
  if (!db) return { id: roomCode, roomCode };
  const ref = db.collection(COLLECTION).doc(roomCode);
  const session = {
    roomCode,
    hostUid,
    status: 'lobby', // lobby | active | completed
    winner: null,     // 'crewmates' | 'impostor'
    createdAt: FieldValue.serverTimestamp(),
    startedAt: null,
    endedAt: null,
    promptId: null,
    promptTitle: null,
    finalCode: null,
    testResults: null,
    totalRounds: 0,
    meetingsCalled: 0,
  };
  await ref.set(session);
  return { id: roomCode, ...session };
}

export async function getSession(roomCode) {
  if (!db) return null;
  const doc = await db.collection(COLLECTION).doc(roomCode).get();
  return doc.exists ? { id: doc.id, ...doc.data() } : null;
}

export async function updateSession(roomCode, updates) {
  if (!db) return;
  await db.collection(COLLECTION).doc(roomCode).update(updates);
}

/**
 * Add player to game session's players subcollection.
 */
export async function addPlayer(roomCode, uid, playerData) {
  if (!db) return;
  await db.collection(COLLECTION).doc(roomCode)
    .collection('players').doc(uid)
    .set({
      uid,
      username: playerData.username,
      role: null, // assigned at game start
      status: 'alive',
      joinedAt: FieldValue.serverTimestamp(),
      sabotagesUsed: 0,
      bugsReported: 0,
      codeContributions: 0,
      votes: [],
    });
}

export async function removePlayer(roomCode, uid) {
  if (!db) return;
  await db.collection(COLLECTION).doc(roomCode)
    .collection('players').doc(uid).delete();
}

export async function updatePlayer(roomCode, uid, updates) {
  if (!db) return;
  await db.collection(COLLECTION).doc(roomCode)
    .collection('players').doc(uid).update(updates);
}

export async function getPlayers(roomCode) {
  if (!db) return [];
  const snap = await db.collection(COLLECTION).doc(roomCode)
    .collection('players').get();
  return snap.docs.map(d => ({ uid: d.id, ...d.data() }));
}

export async function recordVote(roomCode, meetingNum, voterUid, targetUid) {
  if (!db) return;
  await db.collection(COLLECTION).doc(roomCode)
    .collection('players').doc(voterUid)
    .update({
      votes: FieldValue.arrayUnion({ meeting: meetingNum, target: targetUid }),
    });
}

export async function setWinner(roomCode, winner, finalCode, testResults) {
  if (!db) return;
  await db.collection(COLLECTION).doc(roomCode).update({
    status: 'completed',
    winner,
    finalCode,
    testResults,
    endedAt: FieldValue.serverTimestamp(),
  });
}

export async function getGameHistory(uid, limit = 20) {
  if (!db) return [];
  // Get game IDs where user participated
  const sessions = await db.collectionGroup('players')
    .where('uid', '==', uid)
    .limit(limit)
    .get();
  
  const gameIds = [...new Set(sessions.docs.map(d => d.ref.parent.parent.id))];
  if (gameIds.length === 0) return [];

  const games = [];
  for (const id of gameIds) {
    const game = await getSession(id);
    if (game) games.push(game);
  }
  return games.sort((a, b) => (b.createdAt?._seconds || 0) - (a.createdAt?._seconds || 0));
}
