import admin from 'firebase-admin';

let dbInstance: FirebaseFirestore.Firestore | null = null;
let isMockMode = false;

if (!admin.apps.length) {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (projectId && clientEmail && privateKey && privateKey !== 'your-private-key') {
    try {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey: privateKey.replace(/\\n/g, '\n'),
        }),
      });
      console.log('✅ Firebase Admin initialized successfully');
      dbInstance = admin.firestore();
    } catch (err) {
      console.warn('⚠️ Failed to initialize Firebase Admin with credentials, falling back to mock mode:', err);
      isMockMode = true;
    }
  } else {
    console.warn('⚠️ Firebase credentials not found or incomplete in .env. Running in development mock storage mode.');
    isMockMode = true;
  }
} else {
  dbInstance = admin.firestore();
}

export const isFirebaseMock = () => isMockMode;
export const db = dbInstance;
export const FieldValue = admin.firestore?.FieldValue;
