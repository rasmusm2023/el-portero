import { cert, getApps, initializeApp, type ServiceAccount } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

/**
 * Server-only Firestore (Firebase Admin). The JSON must live in server env vars only — never
 * `NEXT_PUBLIC_*`. Prefer a dedicated service account with least-privilege IAM, not your personal key.
 * Omit `FIREBASE_SERVICE_ACCOUNT_JSON` to skip Admin entirely; public events then use the browser client
 * and rely on Firestore security rules instead.
 *
 * Uses modular entrypoints (`firebase-admin/app`, `firebase-admin/firestore`) plus
 * `serverExternalPackages` in `next.config.ts` so hosts like Netlify do not webpack-bundle the
 * full Admin SDK / gRPC stack into one giant serverless artifact.
 */
export function getAdminFirestore(): Firestore | null {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
  if (!raw) return null;

  try {
    if (!getApps().length) {
      const cred = JSON.parse(raw) as ServiceAccount;
      initializeApp({
        credential: cert(cred),
      });
    }
    return getFirestore();
  } catch (e) {
    console.error("[firebase-admin] Failed to init:", e);
    return null;
  }
}
