import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

let serviceAccount;
try {
  // Option 1: JSON string from environment variable (for Render / production)
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } else {
    // Option 2: Local file path (for local development)
    const keyPath = resolve(__dirname, '../../', process.env.FIREBASE_SERVICE_ACCOUNT_PATH || '../codesus-c6c78-firebase-adminsdk-fbsvc-eddb7f8457.json');
    serviceAccount = JSON.parse(readFileSync(keyPath, 'utf8'));
  }
} catch (err) {
  console.warn('⚠️  Firebase service account key not found. Server will run without Firebase.');
  serviceAccount = null;
}

if (serviceAccount && !admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: `${serviceAccount.project_id}.firebasestorage.app`,
  });
  console.log(`✅ Firebase Admin initialized for project: ${serviceAccount.project_id}`);
}

const db = admin.apps.length ? admin.firestore() : null;
const auth = admin.apps.length ? admin.auth() : null;
const storage = admin.apps.length ? admin.storage() : null;

export { admin, db, auth, storage };
export default admin;
