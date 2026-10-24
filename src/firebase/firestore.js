import {
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  getDocs,
  where,
  doc,
  setDoc,
  deleteDoc,
  getCountFromServer,
} from "firebase/firestore";
import { db, FIREBASE_CONFIGURED } from "./config";

// ─── Save exam result ─────────────────────────────────────────────────────────
export async function saveExamResult({ userId, displayName, examId, examTitle, score, totalMarks, pct, passed, timeTaken, violations }) {
  if (!FIREBASE_CONFIGURED) return null;
  const ref = await addDoc(collection(db, "results"), {
    userId,
    displayName,
    examId,
    examTitle,
    score,
    totalMarks,
    pct,
    passed,
    timeTaken,
    violations: violations || 0,
    submittedAt: serverTimestamp(),
  });
  return ref.id;
}

// ─── Get global rank for a score on a given exam ──────────────────────────────
export async function getGlobalRank(examId, score) {
  if (!FIREBASE_CONFIGURED) return null;
  // Count how many results on this exam scored HIGHER
  const q = query(
    collection(db, "results"),
    where("examId", "==", examId),
    where("score", ">", score)
  );
  const snap = await getCountFromServer(q);
  const totalSnap = await getCountFromServer(
    query(collection(db, "results"), where("examId", "==", examId))
  );
  return { rank: snap.data().count + 1, total: totalSnap.data().count };
}

// ─── Real-time leaderboard listener ──────────────────────────────────────────
export function subscribeLeaderboard(callback, limitCount = 10) {
  if (!FIREBASE_CONFIGURED) return () => {};
  const q = query(
    collection(db, "results"),
    orderBy("score", "desc"),
    orderBy("timeTaken", "asc"),
    limit(limitCount)
  );
  return onSnapshot(q, (snap) => {
    const entries = snap.docs.map((d, i) => ({
      id: d.id,
      rank: i + 1,
      ...d.data(),
    }));
    callback(entries);
  });
}

// ─── Presence: mark user as "active in exam" ─────────────────────────────────
export async function markPresence(userId, examId) {
  if (!FIREBASE_CONFIGURED) return;
  await setDoc(doc(db, "presence", userId), {
    examId,
    userId,
    startedAt: serverTimestamp(),
  });
}

export async function clearPresence(userId) {
  if (!FIREBASE_CONFIGURED) return;
  await deleteDoc(doc(db, "presence", userId));
}

// ─── Count live students currently in an exam ─────────────────────────────────
export function subscribeLiveCount(callback) {
  if (!FIREBASE_CONFIGURED) { callback(0); return () => {}; }
  return onSnapshot(collection(db, "presence"), (snap) => {
    callback(snap.size);
  });
}

// ─── Log a tab-switch violation ───────────────────────────────────────────────
export async function logViolation(userId, examId, count) {
  if (!FIREBASE_CONFIGURED) return;
  await setDoc(
    doc(db, "violations", `${userId}_${examId}`),
    { userId, examId, count, lastAt: serverTimestamp() },
    { merge: true }
  );
}
