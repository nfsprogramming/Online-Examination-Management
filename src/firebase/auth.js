import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, FIREBASE_CONFIGURED } from "./config";

const googleProvider = new GoogleAuthProvider();

// ── Google Sign-In (students) ────────────────────────────────────────────────
export async function loginWithGoogle() {
  const cred = await signInWithPopup(auth, googleProvider);
  // Upsert Firestore profile (create on first login, skip if exists)
  const profileRef = doc(db, "users", cred.user.uid);
  const existing = await getDoc(profileRef);
  if (!existing.exists()) {
    await setDoc(profileRef, {
      displayName: cred.user.displayName,
      email:       cred.user.email,
      photoURL:    cred.user.photoURL,
      role:        "student",
      createdAt:   serverTimestamp(),
    });
  }
  return {
    uid:      cred.user.uid,
    name:     cred.user.displayName || cred.user.email,
    email:    cred.user.email,
    photoURL: cred.user.photoURL,
    role:     "student",
  };
}

// ── Admin credential check (env-only) ───────────────────────────────────────
export function checkAdminCredentials(username, password) {
  const ADMIN_USER = import.meta.env.VITE_ADMIN_USER || "admin";
  const ADMIN_PASS = import.meta.env.VITE_ADMIN_PASS || "admin123";
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    return { uid: "admin", name: "Administrator", email: "", role: "admin" };
  }
  return null;
}

// ── Email/Password sign-in (kept for fallback/demo) ──────────────────────────
export async function loginUser(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

// ── Register ─────────────────────────────────────────────────────────────────
export async function registerUser(email, password, displayName) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(cred.user, { displayName });
  await setDoc(doc(db, "users", cred.user.uid), {
    displayName,
    email,
    role:      "student",
    createdAt: serverTimestamp(),
  });
  return cred.user;
}

// ── Sign out ─────────────────────────────────────────────────────────────────
export async function logoutUser() {
  if (FIREBASE_CONFIGURED) await signOut(auth);
}

// ── Get Firestore profile ─────────────────────────────────────────────────────
export async function getUserProfile(uid) {
  if (!FIREBASE_CONFIGURED) return null;
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data() : null;
}

// ── Auth state observer ───────────────────────────────────────────────────────
export function observeAuth(callback) {
  if (!FIREBASE_CONFIGURED) return () => {};
  return onAuthStateChanged(auth, callback);
}
