import { db } from '../config/firebase.js';
import { FieldValue } from 'firebase-admin/firestore';

const COLLECTION = 'reports';

export async function createReport({ reporterUid, reportedUid, gameSessionId, reason, details }) {
  if (!db) return { id: 'mock', reason };
  const ref = await db.collection(COLLECTION).add({
    reporterUid,
    reportedUid,
    gameSessionId: gameSessionId || null,
    reason,
    details: details || '',
    status: 'pending', // pending | reviewed | resolved | dismissed
    createdAt: FieldValue.serverTimestamp(),
    resolvedAt: null,
    resolvedBy: null,
  });
  return { id: ref.id, reason, status: 'pending' };
}

export async function getReports(status = null, limit = 50) {
  if (!db) return [];
  let query = db.collection(COLLECTION);
  if (status) query = query.where('status', '==', status);
  const snap = await query.orderBy('createdAt', 'desc').limit(limit).get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function resolveReport(reportId, resolverId, resolution) {
  if (!db) return;
  await db.collection(COLLECTION).doc(reportId).update({
    status: resolution, // 'resolved' | 'dismissed'
    resolvedBy: resolverId,
    resolvedAt: FieldValue.serverTimestamp(),
  });
}
