import { getApp, getApps, initializeApp, type FirebaseApp, type FirebaseOptions } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

let app: FirebaseApp | null = null;
let appName: string | null = null;

/**
 * Web client config from env (all safe to expose; rules enforce access).
 * Set in `.env.local` from Project settings in Firebase console.
 */
export function getFirebaseWebConfig(): FirebaseOptions | null {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.trim();
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim();
  const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID?.trim();
  if (!apiKey || !projectId || !appId) return null;

  const authDomain =
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN?.trim() || `${projectId}.firebaseapp.com`;
  const storageBucket =
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET?.trim() || `${projectId}.appspot.com`;
  const messagingSenderId = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID?.trim() ?? "";

  return {
    apiKey,
    authDomain,
    projectId,
    storageBucket,
    messagingSenderId,
    appId,
  };
}

export function isFirebaseConfigured(): boolean {
  return getFirebaseWebConfig() !== null;
}

export function getFirebaseApp(): FirebaseApp {
  const cfg = getFirebaseWebConfig();
  if (!cfg) {
    throw new Error(
      "Firebase is not configured. Set NEXT_PUBLIC_FIREBASE_API_KEY, NEXT_PUBLIC_FIREBASE_PROJECT_ID, NEXT_PUBLIC_FIREBASE_APP_ID (see .env.example).",
    );
  }
  const desiredName = `app-${cfg.projectId}`;
  if (!app || appName !== desiredName) {
    appName = desiredName;
    const existing = getApps().find((a) => a.name === desiredName);
    app = existing ? getApp(desiredName) : initializeApp(cfg, desiredName);
  }
  return app!;
}

export function getFirebaseAuth(): Auth {
  return getAuth(getFirebaseApp());
}

/** Ready for Firestore when you migrate events / menus off the .NET API. */
export function getFirebaseFirestore(): Firestore {
  return getFirestore(getFirebaseApp());
}
