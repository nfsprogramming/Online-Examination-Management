import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  ChevronRight,
  ChevronLeft,
  Flag,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Save,
  ShieldAlert,
  Menu,
  X,
  LayoutGrid,
  Check,
  BookOpen,
} from "lucide-react";
import { markPresence, clearPresence, logViolation } from "../firebase/firestore";
import { FIREBASE_CONFIGURED } from "../firebase/config";

const fmtTime = (s) =>
  `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

const LS_KEY = (examId) => `examination_progress_${examId}`;
const MAX_VIOLATIONS = 3;

export default function ExamScreen({ exam, user, onFinish }) {
  // ── Restore from localStorage if exists ──────────────────────────────────
  const saved = (() => {
    try {
      return JSON.parse(localStorage.getItem(LS_KEY(exam.id)));
    } catch {
      return null;
    }
  })();

  const [qIdx, setQIdx] = useState(saved?.qIdx ?? 0);
  const [answers, setAnswers] = useState(
    saved?.answers ?? Array(exam.questions.length).fill(null)
  );
  const [fillAnswers, setFillAnswers] = useState(
    saved?.fillAnswers ?? Array(exam.questions.length).fill("")
  );
  const [flags, setFlags] = useState(
    saved?.flags ?? Array(exam.questions.length).fill(false)
  );
  const [timeLeft, setTimeLeft] = useState(
    saved?.timeLeft ?? exam.duration * 60
  );
  const [violations, setViolations] = useState(saved?.violations ?? 0);

  const [showConfirm, setShowConfirm] = useState(false);
  const [showViolation, setShowViolation] = useState(false);
  const [showLocked, setShowLocked] = useState(false);
  const [showMobileMap, setShowMobileMap] = useState(false);
  const [autoSaveFlash, setAutoSaveFlash] = useState(false);
  const [startTime] = useState(
    Date.now() - (exam.duration * 60 - timeLeft) * 1000
  );

  const timerRef = useRef(null);
  const questionRef = useRef(null);

  // ── Firebase presence ─────────────────────────────────────────────────────
  useEffect(() => {
    if (FIREBASE_CONFIGURED && user?.uid) {
      markPresence(user.uid, exam.id);
      return () => {
        clearPresence(user.uid);
      };
    }
  }, [user?.uid, exam.id]);

  // ── Auto-save to localStorage whenever state changes ──────────────────────
  useEffect(() => {
    const state = { qIdx, answers, fillAnswers, flags, timeLeft, violations };
    localStorage.setItem(LS_KEY(exam.id), JSON.stringify(state));
    setAutoSaveFlash(true);
    const t = setTimeout(() => setAutoSaveFlash(false), 1200);
    return () => clearTimeout(t);
  }, [answers, fillAnswers, flags, qIdx, timeLeft, violations, exam.id]);

  // ── Countdown timer & Submission ──────────────────────────────────────────
  const doSubmit = useCallback(() => {
    clearInterval(timerRef.current);
    localStorage.removeItem(LS_KEY(exam.id));
    if (FIREBASE_CONFIGURED && user?.uid) clearPresence(user.uid);
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    onFinish({ answers, fillAnswers, timeTaken, violations });
  }, [answers, fillAnswers, startTime, violations, onFinish, user?.uid, exam.id]);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          doSubmit();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [doSubmit]);

  // ── Anti-Cheat: Tab visibility detection ─────────────────────────────────
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setViolations((v) => {
          const next = v + 1;
          if (FIREBASE_CONFIGURED && user?.uid)
            logViolation(user.uid, exam.id, next);
          if (next >= MAX_VIOLATIONS) {
            setShowLocked(true);
          } else {
            setShowViolation(true);
          }
          return next;
        });
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [user?.uid, exam.id]);

  // ── Keyboard Navigation & Shortcuts ──────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't intercept if user is typing in the fill-in-the-blank input
      if (e.target.tagName === "INPUT") return;

      const q = exam.questions[qIdx];

      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        setQIdx((prev) => Math.min(exam.questions.length - 1, prev + 1));
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        setQIdx((prev) => Math.max(0, prev - 1));
      } else if (e.key.toLowerCase() === "f") {
        toggleFlag();
      } else if (q.type === "mcq") {
        const num = parseInt(e.key, 10);
        if (num >= 1 && num <= q.options.length) {
          setAnswerHelper(num - 1);
        }
      } else if (q.type === "truefalse") {
        if (e.key.toLowerCase() === "t") setAnswerHelper(true);
        if (e.key.toLowerCase() === "f") setAnswerHelper(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  // Focus question text on navigation for screen readers
  useEffect(() => {
    questionRef.current?.focus();
  }, [qIdx]);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const setAnswerHelper = (val) => {
    setAnswers((prev) => {
      const n = [...prev];
      n[qIdx] = val;
      return n;
    });
  };
  const setFill = (val) => {
    setFillAnswers((prev) => {
      const n = [...prev];
      n[qIdx] = val;
      return n;
    });
  };
  const toggleFlag = () => {
    setFlags((prev) => {
      const n = [...prev];
      n[qIdx] = !n[qIdx];
      return n;
    });
  };

  const q = exam.questions[qIdx];
  const answered = answers.filter((a, i) => a !== null || fillAnswers[i]).length;
  const flaggedCount = flags.filter(Boolean).length;

  // Semantic timer state: normal >10m, warning <=10m (600s), critical <=2m (120s)
  const timerClass =
    timeLeft <= 120 ? "critical" : timeLeft <= 600 ? "warning" : "";
  const progress = ((qIdx + 1) / exam.questions.length) * 100;

  const getDotState = (i) => {
    if (i === qIdx) return "current";
    if (flags[i]) return "flagged";
    if (answers[i] !== null || fillAnswers[i]) return "answered";
    return "";
  };

  const QuestionMapGrid = () => (
    <>
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: "var(--text-muted)",
          textTransform: "uppercase",
          letterSpacing: 1.2,
          marginBottom: 12,
        }}
      >
        Question Navigator
      </div>
      <div className="q-map">
        {exam.questions.map((_, i) => (
          <button
            key={i}
            id={`qmap-${i}`}
            className={`q-map-dot ${getDotState(i)}`}
            onClick={() => {
              setQIdx(i);
              setShowMobileMap(false);
            }}
            aria-label={`Go to question ${i + 1}${
              flags[i] ? ", flagged" : ""
            }${answers[i] !== null || fillAnswers[i] ? ", answered" : ""}`}
            aria-current={i === qIdx ? "true" : undefined}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <div style={{ marginTop: 20 }}>
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "var(--text-muted)",
            textTransform: "uppercase",
            letterSpacing: 1.2,
            marginBottom: 10,
          }}
        >
          Status Legend
        </div>
        {[
          { color: "var(--primary)", border: "var(--primary)", label: "Current Question" },
          { color: "rgba(34, 197, 94, 0.15)", border: "rgba(34, 197, 94, 0.35)", label: "Answered" },
          { color: "rgba(245, 158, 11, 0.15)", border: "rgba(245, 158, 11, 0.35)", label: "Flagged for Review" },
          { color: "var(--bg-elevated)", border: "var(--border)", label: "Unanswered" },
        ].map(({ color, border: boxBorder, label }) => (
          <div
            key={label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 6,
            }}
          >
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: 3,
                background: color,
                border: `1px solid ${boxBorder}`,
              }}
            />
            <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>
              {label}
            </span>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: 20,
          paddingTop: 16,
          borderTop: "1px solid var(--border-color)",
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "var(--text-muted)",
            textTransform: "uppercase",
            letterSpacing: 1.2,
            marginBottom: 10,
          }}
        >
          Session Progress
        </div>
        {[
          { label: "Answered",  value: answered,                         color: "var(--success)" },
          { label: "Flagged",   value: flaggedCount,                     color: "var(--warning)" },
          { label: "Remaining", value: exam.questions.length - answered, color: "var(--error)"   },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "5px 0",
              borderBottom: "1px solid var(--border-color)",
            }}
          >
            <span style={{ fontSize: 12.5, color: "var(--text-secondary)" }}>
              {label}
            </span>
            <span
              style={{
                fontFamily: "var(--mono)",
                fontSize: 13,
                fontWeight: 800,
                color,
              }}
            >
              {value}
            </span>
          </div>
        ))}
      </div>
    </>
  );

  return (
    <div className="exam-layout" role="main">
      {/* ── Top Bar ── */}
      <header className="exam-header" aria-label="Exam header">
        <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
          <div className="brand-logo-icon" style={{ width: 32, height: 32, fontSize: 13 }} aria-hidden="true">
            <BookOpen size={16} />
          </div>
          <span
            style={{
              fontSize: 14.5,
              fontWeight: 700,
              color: "var(--text-primary)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {exam.title}
          </span>
          <span
            style={{
              fontSize: 12,
              color: "var(--text-muted)",
              fontFamily: "var(--mono)",
              background: "var(--surface-secondary)",
              padding: "3px 8px",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--border-color)",
              whiteSpace: "nowrap",
            }}
            aria-label={`Question ${qIdx + 1} of ${exam.questions.length}`}
          >
            Q {qIdx + 1} / {exam.questions.length}
          </span>

          {/* Anti-cheat violation badge */}
          {violations > 0 && (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                background: "var(--error-bg)",
                border: "1px solid var(--error-border)",
                borderRadius: "var(--radius-full)",
                padding: "2px 8px",
                fontSize: 11,
                color: "var(--error)",
                fontWeight: 700,
              }}
            >
              <ShieldAlert size={12} /> {violations}/{MAX_VIOLATIONS} warnings
            </span>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Mobile Question Map Toggle */}
          <button
            id="mobile-question-map-btn"
            className="icon-button"
            onClick={() => setShowMobileMap(true)}
            title="Question Map"
            aria-label="Open question navigator"
            style={{ display: "none" }}
          >
            <LayoutGrid size={17} />
          </button>

          {/* Auto-save status */}
          <AnimatePresence>
            {autoSaveFlash && (
              <motion.span
                key="save"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  fontSize: 11.5,
                  fontWeight: 600,
                  color: "var(--success)",
                }}
                aria-live="polite"
              >
                <Save size={12} /> Saved
              </motion.span>
            )}
          </AnimatePresence>

          {/* Timer Box */}
          <div
            className={`timer-box ${timerClass}`}
            role="timer"
            aria-label={`Time remaining: ${fmtTime(timeLeft)}`}
          >
            <Clock size={15} />
            {fmtTime(timeLeft)}
          </div>

          {/* Submit Button */}
          <button
            id="submit-exam-btn"
            className="btn btn-danger"
            onClick={() => setShowConfirm(true)}
            style={{ minHeight: 36, padding: "7px 16px", fontSize: 12.5 }}
            aria-label="Submit examination"
          >
            Submit
          </button>
        </div>
      </header>

      {/* Progress Bar */}
      <div
        style={{ height: 3, background: "var(--surface-secondary)", width: "100%" }}
        role="progressbar"
        aria-valuenow={qIdx + 1}
        aria-valuemin={1}
        aria-valuemax={exam.questions.length}
      >
        <motion.div
          style={{
            height: "100%",
            background: "var(--primary-brand)",
          }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.25 }}
        />
      </div>

      {/* Main Examination View */}
      <div className="exam-main">
        {/* Question Panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={qIdx}
            className="question-container"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.16 }}
          >
            <div
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-xl)",
                padding: "32px",
                boxShadow: "var(--shadow-lg)",
                display: "flex",
                flexDirection: "column",
                gap: 22,
              }}
            >
              <div>
                <div className="q-label" aria-label={`Question type: ${q.type}`}>
                  Question {qIdx + 1} of {exam.questions.length} · {q.marks} {q.marks === 1 ? "Mark" : "Marks"} ·{" "}
                  {q.type === "mcq"
                    ? "Multiple Choice"
                    : q.type === "truefalse"
                    ? "True / False"
                    : "Fill in the Blank"}
                </div>

                <h2
                  ref={questionRef}
                  tabIndex={-1}
                  className="q-text"
                  style={{ marginTop: 10, outline: "none" }}
                >
                  {q.question}
                </h2>

                <p
                  style={{
                    fontSize: 12,
                    color: "var(--text-muted)",
                    marginTop: 6,
                    fontFamily: "var(--mono)",
                  }}
                >
                  {q.type === "mcq"
                    ? "Press Keys 1–4 to select · Arrow keys to navigate · F to flag"
                    : q.type === "truefalse"
                    ? "Press T = True · F = False · Arrow keys to navigate"
                    : "Type answer · Arrow keys to navigate · F to flag"}
                </p>
              </div>

              {/* MCQ Options */}
              {q.type === "mcq" && (
                <div className="options-list" role="radiogroup" aria-label="Answer options">
                  {q.options.map((opt, i) => {
                    const isSelected = answers[qIdx] === i;
                    return (
                      <motion.div
                        key={i}
                        id={`option-${i}`}
                        className={`option-item ${isSelected ? "active" : ""}`}
                        onClick={() => setAnswerHelper(i)}
                        whileTap={{ scale: 0.99 }}
                        role="radio"
                        aria-checked={isSelected}
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") setAnswerHelper(i);
                        }}
                        aria-label={`Option ${String.fromCharCode(65 + i)}: ${opt}`}
                      >
                        <div className="option-mark" aria-hidden="true">
                          {String.fromCharCode(65 + i)}
                        </div>
                        <span style={{ fontSize: 14.5, fontWeight: isSelected ? 600 : 500, color: "var(--text-primary)", flex: 1 }}>
                          {opt}
                        </span>
                        {isSelected && (
                          <div
                            style={{
                              width: 20,
                              height: 20,
                              borderRadius: "50%",
                              background: "var(--primary)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#FFFFFF",
                              flexShrink: 0,
                            }}
                          >
                            <Check size={13} strokeWidth={3} />
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {/* True / False Options */}
              {q.type === "truefalse" && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 14,
                  }}
                  role="radiogroup"
                  aria-label="True or False"
                >
                  {[true, false].map((val) => {
                    const isSelected = answers[qIdx] === val;
                    return (
                      <motion.button
                        key={String(val)}
                        id={`tf-${val}`}
                        onClick={() => setAnswerHelper(val)}
                        whileTap={{ scale: 0.98 }}
                        role="radio"
                        aria-checked={isSelected}
                        style={{
                          padding: "20px 18px",
                          borderRadius: "var(--radius-lg)",
                          cursor: "pointer",
                          fontFamily: "var(--sans)",
                          fontSize: 16,
                          fontWeight: 700,
                          background: isSelected ? "rgba(99, 102, 241, 0.12)" : "var(--bg-surface-secondary)",
                          border: `1.5px solid ${isSelected ? "var(--primary)" : "var(--border)"}`,
                          color: isSelected ? "var(--text-primary)" : "var(--text-secondary)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 10,
                          boxShadow: isSelected ? "0 0 0 1px var(--primary)" : "var(--shadow-xs)",
                          transition: "all 0.18s ease",
                        }}
                      >
                        {val ? <CheckCircle size={20} /> : <XCircle size={20} />}
                        {val ? "True" : "False"}
                      </motion.button>
                    );
                  })}
                </div>
              )}

              {/* Fill in the Blank Option */}
              {q.type === "fill" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <input
                    id="fill-answer-input"
                    className="input-field no-icon"
                    placeholder="Type your exact response here..."
                    value={fillAnswers[qIdx]}
                    onChange={(e) => setFill(e.target.value)}
                    aria-label="Fill in the blank answer"
                    autoFocus
                    style={{ fontSize: 15 }}
                  />
                  <span style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--mono)" }}>
                    Case-insensitive match · Verify spelling before submission
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Desktop Sidebar Navigator */}
        <aside className="exam-sidebar-desktop" aria-label="Question navigation panel">
          <QuestionMapGrid />
        </aside>
      </div>

      {/* ── Bottom Navigation Controls ── */}
      <footer className="exam-actions" aria-label="Question navigation actions">
        <button
          id="prev-question-btn"
          className="btn btn-secondary"
          onClick={() => setQIdx(Math.max(0, qIdx - 1))}
          disabled={qIdx === 0}
          aria-label="Previous question"
        >
          <ChevronLeft size={16} /> Previous
        </button>

        <button
          id="flag-btn"
          className="btn"
          onClick={toggleFlag}
          style={{
            background: flags[qIdx] ? "var(--warning-bg)" : "var(--surface-secondary)",
            borderColor: flags[qIdx] ? "var(--warning-border)" : "var(--border-color)",
            color: flags[qIdx] ? "var(--warning)" : "var(--text-secondary)",
          }}
          aria-label={flags[qIdx] ? "Remove flag from this question" : "Flag this question for review"}
          aria-pressed={flags[qIdx]}
        >
          <Flag size={15} /> {flags[qIdx] ? "Flagged for Review" : "Flag for Review"}
        </button>

        <button
          id="next-question-btn"
          className="btn btn-primary"
          onClick={() => setQIdx(Math.min(exam.questions.length - 1, qIdx + 1))}
          disabled={qIdx === exam.questions.length - 1}
          aria-label="Next question"
        >
          Next <ChevronRight size={16} />
        </button>
      </footer>

      {/* ── Mobile Question Navigator Drawer (Bottom Sheet) ── */}
      <AnimatePresence>
        {showMobileMap && (
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowMobileMap(false)}
          >
            <motion.div
              className="modal-content"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <span style={{ fontSize: 16, fontWeight: 800, color: "var(--text-primary)" }}>
                  Question Navigation
                </span>
                <button
                  onClick={() => setShowMobileMap(false)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--text-muted)",
                    padding: 4,
                  }}
                >
                  <X size={20} />
                </button>
              </div>
              <QuestionMapGrid />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Anti-Cheat Tab Violation Modal ── */}
      <AnimatePresence>
        {showViolation && (
          <motion.div
            className="modal-backdrop"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="violation-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="modal-content"
              style={{ textAlign: "center" }}
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: "var(--error-bg)",
                  border: "1px solid var(--error-border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                  color: "var(--error)",
                }}
              >
                <ShieldAlert size={28} />
              </div>
              <h2
                id="violation-title"
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: "var(--text-primary)",
                  marginBottom: 8,
                }}
              >
                Integrity Violation Detected
              </h2>
              <p
                style={{
                  color: "var(--text-secondary)",
                  fontSize: 13.5,
                  marginBottom: 16,
                  lineHeight: 1.5,
                }}
              >
                Browser tab switching or minimization was recorded. Academic proctoring rules require candidates to keep the examination window active.
              </p>
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 800,
                  fontFamily: "var(--mono)",
                  color: "var(--error)",
                  marginBottom: 14,
                }}
              >
                {violations} / {MAX_VIOLATIONS} Warnings
              </div>
              <p style={{ color: "var(--text-muted)", fontSize: 12.5, marginBottom: 22 }}>
                {MAX_VIOLATIONS - violations} more violation
                {MAX_VIOLATIONS - violations !== 1 ? "s" : ""} will automatically lock your examination session.
              </p>
              <button
                id="dismiss-violation-btn"
                className="btn btn-primary"
                onClick={() => setShowViolation(false)}
                style={{ width: "100%", padding: "10px" }}
              >
                I Understand — Resume Examination
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Exam Locked Modal (Max Violations Reached) ── */}
      <AnimatePresence>
        {showLocked && (
          <motion.div
            className="modal-backdrop"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="locked-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="modal-content"
              style={{ textAlign: "center" }}
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
            >
              <div style={{ fontSize: 44, marginBottom: 12 }}>🔒</div>
              <h2
                id="locked-title"
                style={{ fontSize: 20, fontWeight: 800, color: "var(--text-primary)", marginBottom: 8 }}
              >
                Examination Session Locked
              </h2>
              <p
                style={{
                  color: "var(--text-secondary)",
                  fontSize: 13.5,
                  marginBottom: 22,
                  lineHeight: 1.5,
                }}
              >
                Maximum integrity violations ({MAX_VIOLATIONS}) exceeded. Your responses have been locked and submitted for proctor review.
              </p>
              <button
                id="locked-submit-btn"
                className="btn btn-danger"
                onClick={doSubmit}
                style={{ width: "100%", padding: "10px" }}
              >
                Finalize Answers & Review
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Confirm Submit Modal ── */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            className="modal-backdrop"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="modal-content"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <AlertTriangle size={22} color="var(--warning)" />
                <h2
                  id="confirm-title"
                  style={{ fontSize: 19, fontWeight: 800, color: "var(--text-primary)" }}
                >
                  Submit Examination?
                </h2>
              </div>

              <p
                style={{
                  color: "var(--text-secondary)",
                  fontSize: 13.5,
                  marginBottom: 18,
                  lineHeight: 1.5,
                }}
              >
                Are you ready to submit your responses? Once submitted, your answers will be graded and cannot be amended.
              </p>

              {/* Status summary */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 10,
                  marginBottom: 22,
                }}
              >
                {[
                  { label: "Answered",   value: answered,                         color: "var(--success)" },
                  { label: "Unanswered", value: exam.questions.length - answered, color: "var(--error)"   },
                  { label: "Flagged",    value: flaggedCount,                     color: "var(--warning)" },
                ].map(({ label, value, color }) => (
                  <div
                    key={label}
                    style={{
                      background: "var(--surface-secondary)",
                      border: "1px solid var(--border-color)",
                      borderRadius: "var(--radius-md)",
                      padding: "10px 8px",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 20,
                        fontWeight: 800,
                        color,
                        fontFamily: "var(--mono)",
                      }}
                    >
                      {value}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                      {label}
                    </div>
                  </div>
                ))}
              </div>

              {violations > 0 && (
                <div
                  style={{
                    background: "var(--error-bg)",
                    border: "1px solid var(--error-border)",
                    borderRadius: "var(--radius-md)",
                    padding: "10px 14px",
                    marginBottom: 18,
                    fontSize: 12,
                    color: "var(--error)",
                    display: "flex",
                    gap: 8,
                    alignItems: "center",
                  }}
                >
                  <ShieldAlert size={14} /> {violations} tab-switch violation
                  {violations !== 1 ? "s" : ""} will be recorded with your submission.
                </div>
              )}

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  id="cancel-submit-btn"
                  className="btn btn-secondary"
                  onClick={() => setShowConfirm(false)}
                  style={{ flex: 1 }}
                >
                  Review
                </button>
                <button
                  id="confirm-submit-btn"
                  className="btn btn-primary"
                  onClick={doSubmit}
                  style={{ flex: 2 }}
                >
                  Confirm & Submit
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 900px) {
          #mobile-question-map-btn {
            display: inline-flex !important;
          }
        }
      `}</style>
    </div>
  );
}
