"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth";
import { getFirebaseAuth, getFirebaseFirestore, isFirebaseConfigured } from "@/lib/firebase/client";
import { isUidAdmin } from "@/lib/firebase/adminsStore";

type AdminAuthContextValue = {
  user: User | null;
  /** True after first auth state callback (or immediately if Firebase not configured). */
  ready: boolean;
  firebaseConfigured: boolean;
  /** True once we have determined admin allowlist membership (or immediately if Firebase not configured). */
  adminReady: boolean;
  /** True only if `admins/{uid}` exists. */
  isAdmin: boolean;
  /** If admin check failed, a short message for UI/debug. */
  adminError: string | null;
  signInWithEmailPassword: (email: string, password: string) => Promise<void>;
  signOutUser: () => Promise<void>;
};

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [adminReady, setAdminReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminError, setAdminError] = useState<string | null>(null);

  useEffect(() => {
    if (!isFirebaseConfigured()) {
      setReady(true);
      setAdminReady(true);
      setIsAdmin(false);
      return;
    }
    const auth = getFirebaseAuth();
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setReady(true);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!isFirebaseConfigured()) return;
    let cancelled = false;

    (async () => {
      if (!user) {
        setIsAdmin(false);
        setAdminReady(true);
        setAdminError(null);
        return;
      }
      setAdminReady(false);
      setAdminError(null);
      try {
        const db = getFirebaseFirestore();
        const ok = await isUidAdmin(db, user.uid);
        if (!cancelled) {
          setIsAdmin(ok);
          setAdminReady(true);
        }
      } catch (err) {
        console.error("Admin allowlist check failed:", err);
        if (!cancelled) {
          setIsAdmin(false);
          setAdminError(
            err instanceof Error && err.message
              ? err.message
              : "Failed to read admins/{uid} from Firestore.",
          );
          setAdminReady(true);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user]);

  const signInWithEmailPassword = useCallback(async (email: string, password: string) => {
    const auth = getFirebaseAuth();
    await signInWithEmailAndPassword(auth, email.trim(), password);
  }, []);

  const signOutUser = useCallback(async () => {
    if (!isFirebaseConfigured()) return;
    await firebaseSignOut(getFirebaseAuth());
  }, []);

  const value = useMemo(
    () => ({
      user,
      ready,
      firebaseConfigured: isFirebaseConfigured(),
      adminReady,
      isAdmin,
      adminError,
      signInWithEmailPassword,
      signOutUser,
    }),
    [user, ready, adminReady, isAdmin, adminError, signInWithEmailPassword, signOutUser],
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth(): AdminAuthContextValue {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) {
    throw new Error("useAdminAuth must be used under AdminAuthProvider");
  }
  return ctx;
}
