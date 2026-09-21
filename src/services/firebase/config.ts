import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getDatabase, type Database } from 'firebase/database';

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'posterchild-retreat.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'posterchild-retreat',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'posterchild-retreat.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || 'https://posterchild-retreat-default-rtdb.firebaseio.com'
};

/**
 * Checks whether the required environment variables are set to connect to Firebase.
 */
export function isFirebaseConfigured(): boolean {
  return Boolean(
    firebaseConfig.apiKey &&
    firebaseConfig.apiKey !== 'your-api-key-here' &&
    firebaseConfig.databaseURL
  );
}

let app: FirebaseApp | null = null;
let database: Database | null = null;

export function getFirebaseApp(): FirebaseApp | null {
  if (!isFirebaseConfigured()) return null;
  if (!app) {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  }
  return app;
}

export function getFirebaseDatabase(): Database | null {
  if (!database) {
    const firebaseApp = getFirebaseApp();
    if (firebaseApp) {
      database = getDatabase(firebaseApp, firebaseConfig.databaseURL);
    }
  }
  return database;
}
