import * as admin from "firebase-admin";

/**
 * Server-only Firestore (Firebase Admin). The JSON must live in server env vars only — never
 * `NEXT_PUBLIC_*`. Prefer a dedicated service account with least-privilege IAM, not your personal key.
 * Omit `FIREBASE_SERVICE_ACCOUNT_JSON` to skip Admin entirely; public events then use the browser client
 * and rely on Firestore security rules instead.
 */
export function getAdminFirestore(): admin.firestore.Firestore | null {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
  if (!raw) return null;

  try {
    if (!admin.apps.length) {
      const cred = JSON.parse(raw) as admin.ServiceAccount;
      admin.initializeApp({
        credential: admin.credential.cert(cred),
      });
    }
    return admin.firestore();
  } catch (e) {
    console.error("[firebase-admin] Failed to init:", e);
    return null;
  }
}
