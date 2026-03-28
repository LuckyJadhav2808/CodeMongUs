import { db } from '../config/firebase.js';
import { FieldValue } from 'firebase-admin/firestore';

const COLLECTION = 'codingPrompts';

export async function getRandomPrompt(difficulty = null) {
  if (!db) return getFallbackPrompt();
  let query = db.collection(COLLECTION);
  if (difficulty) query = query.where('difficulty', '==', difficulty);
  const snap = await query.get();
  if (snap.empty) return getFallbackPrompt();
  const docs = snap.docs;
  const random = docs[Math.floor(Math.random() * docs.length)];
  return { id: random.id, ...random.data() };
}

export async function getPromptsByDifficulty(difficulty, limit = 10) {
  if (!db) return [getFallbackPrompt()];
  const snap = await db.collection(COLLECTION)
    .where('difficulty', '==', difficulty)
    .limit(limit).get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getAllPrompts() {
  if (!db) return [getFallbackPrompt()];
  const snap = await db.collection(COLLECTION).get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function createPrompt(data) {
  if (!db) return data;
  const ref = await db.collection(COLLECTION).add({
    ...data,
    usageCount: 0,
    createdAt: FieldValue.serverTimestamp(),
  });
  return { id: ref.id, ...data };
}

export async function trackUsage(promptId) {
  if (!db) return;
  await db.collection(COLLECTION).doc(promptId).update({
    usageCount: FieldValue.increment(1),
  });
}

function getFallbackPrompt() {
  return {
    id: 'fallback',
    title: 'Sum of Two Numbers',
    description: 'Write a function that takes two numbers and returns their sum.',
    difficulty: 'easy',
    language: 'javascript',
    functionSignature: 'function add(a, b)',
    starterCode: '// Write your solution here\nfunction add(a, b) {\n  // TODO\n}\n',
    testCases: [
      { input: 'add(1, 2)', expected: '3', visible: true },
      { input: 'add(-1, 1)', expected: '0', visible: true },
      { input: 'add(0, 0)', expected: '0', visible: false },
    ],
  };
}
