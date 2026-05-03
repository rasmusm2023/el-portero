import { doc, getDoc, type Firestore } from "firebase/firestore";

export const ADMINS_COLLECTION = "admins";

/**
 * Admin allowlist.
 *
 * We intentionally do NOT treat “any authenticated user” as an admin, because
 * if Email/Password is enabled, anyone can create a new account via the public
 * Firebase Auth API using your project's web API key.
 *
 * Instead, access is granted only when a document exists at: `admins/{uid}`.
 * You create those docs manually in the Firebase Console (or later via a trusted script).
 */
export async function isUidAdmin(db: Firestore, uid: string): Promise<boolean> {
  if (!uid) return false;
  const snap = await getDoc(doc(db, ADMINS_COLLECTION, uid));
  if (process.env.NODE_ENV !== "production") {
    // Helpful during setup: confirms which project/db the client is reading from.
    console.log("[admin-check]", snap.ref.path, "exists=", snap.exists());
  }
  return snap.exists();
}

