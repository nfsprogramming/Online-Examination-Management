import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  XCircle,
  CheckCircle2,
  SkipForward,
  Clock,
  ChevronLeft,
  ShieldAlert,
  Medal,
  Check,
  RotateCcw,
  Sparkles,
  BookOpen,
} from "lucide-react";
import confetti from "canvas-confetti";
import { saveExamResult, getGlobalRank } from "../firebase/firestore";
import { FIREBASE_CONFIGURED } from "../firebase/config";

const fmtTime = (s) =>
  `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

export default function ResultPage({
  exam,
  answers,
  fillAnswers,
  timeTaken,
  violations = 0,
  user,
  onBack,
}) {
  const confettiDone = useRef(false);
  const [globalRank, setGlobalRank] = useState(null);
  const [saving, setSaving] = useState(false);

  /* ── Compute Results ─────────────────────────────────────────────────── */
  let score = 0;
  const results = exam.questions.map((q, i) => {
    let isCorrect = false;
    let userAnswer = null;

    if (q.type === "mcq") {
      userAnswer = answers[i];
      isCorrect = userAnswer === q.correct;
    } else if (q.type === "truefalse") {
      userAnswer = answers[i];
      isCorrect = userAnswer === q.correct;
    } else if (q.type === "fill") {
      userAnswer = fillAnswers[i] || "";
      isCorrect = q.correct.some(
        (c) => c.toLowerCase() === userAnswer.trim().toLowerCase()
      );
    }

    if (isCorrect) score += q.marks;
    return { q, isCorrect, userAnswer };
  });

  const pct = Math.round((score / exam.totalMarks) * 100);
  const passed = score >= exam.passMark;
  const correctCount = results.filter((r) => r.isCorrect).length;
  const skippedCount = results.filter((r) => {
    if (r.q.type === "fill") return !r.userAnswer;
    return r.userAnswer === null;
  }).length;
  const incorrectCount = results.length - correctCount - skippedCount;

  // Compute academic letter grade
  const grade =
    pct >= 90
      ? "Grade A+ (Distinction)"
      : pct >= 80
      ? "Grade A (Excellent)"
      : pct >= 70
      ? "Grade B (Proficient)"
      : pct >= 60
      ? "Grade C (Satisfactory)"
      : "Grade F (Needs Improvement)";

  /* ── Save to Firestore + fetch rank ──────────────────────────────────── */
  useEffect(() => {
    if (!FIREBASE_CONFIGURED || !user?.uid) return;
    setSaving(true);
    saveExamResult({
      userId: user.uid,
      displayName: user.name,
      photoURL: user.photoURL || null,
      examId: exam.id,
      examTitle: exam.title,
      score,
      totalMarks: exam.totalMarks,
      pct,
      passed,
      timeTaken,
      violations,
    })
      .then(() => {
        setSaving(false);
        return getGlobalRank(exam.id, score);
      })
      .then((rankData) => {
        if (rankData) setGlobalRank(rankData);
      })
      .catch(() => setSaving(false));
  }, []); // eslint-disable-line

  /* ── Confetti Particle Celebration on Pass ───────────────────────────── */
  useEffect(() => {
    if (passed && !confettiDone.current) {
      confettiDone.current = true;
      confetti({
        particleCount: 140,
        spread: 70,
        origin: { y: 0.5 },
        colors: ["#4F46E5", "#2563EB", "#16A34A", "#D97706"],
      });
    }
  }, [passed]);

  /* ── Label Helpers ───────────────────────────────────────────────────── */
  const getAnswerLabel = (r) => {
    if (r.q.type === "mcq") {
      if (r.userAnswer === null) return null;
      return `${String.fromCharCode(65 + r.userAnswer)}: ${r.q.options[r.userAnswer]}`;
    }
    if (r.q.type === "truefalse") {
      if (r.userAnswer === null) return null;
      return r.userAnswer ? "True" : "False";
    }
    if (r.q.type === "fill") {
      return r.userAnswer ? `"${r.userAnswer}"` : null;
    }
    return null;
  };

  const getCorrectLabel = (q) => {
    if (q.type === "mcq") {
      return `${String.fromCharCode(65 + q.correct)}: ${q.options[q.correct]}`;
    }
    if (q.type === "truefalse") {
      return q.correct ? "True" : "False";
    }
    if (q.type === "fill") {
      return q.correct.join(" or ");
    }
    return "";
  };

  return (
    <div
      style={{
        maxWidth: 960,
        margin: "0 auto",
        padding: "36px 20px 64px",
      }}
    >
      {/* ── Back Navigation ── */}
      <div style={{ marginBottom: 24 }}>
        <button
          id="back-to-dashboard-btn"
          className="btn btn-secondary"
          onClick={onBack}
          style={{ gap: 6 }}
        >
          <ChevronLeft size={16} /> Return to Dashboard
        </button>
      </div>

      {/* ── Score Header Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: "var(--surface-main)",
          border: "1px solid var(--border-color)",
          borderRadius: "var(--radius-xl)",
          padding: "36px 28px",
          textAlign: "center",
          marginBottom: 24,
          boxShadow: "var(--shadow-sm)",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
            padding: "6px 16px",
            borderRadius: "var(--radius-full)",
            fontSize: 13,
            fontWeight: 700,
            marginBottom: 18,
            background: passed ? "var(--success-bg)" : "var(--error-bg)",
            border: `1px solid ${passed ? "var(--success-border)" : "var(--error-border)"}`,
            color: passed ? "var(--success)" : "var(--error)",
          }}
        >
          {passed ? <Trophy size={16} /> : <XCircle size={16} />}
          {passed ? "Official Examination Passed" : "Assessment Benchmark Not Met"}
        </div>

        {/* Big Score Display */}
        <div
          style={{
            fontSize: "clamp(52px, 7vw, 76px)",
            fontWeight: 800,
            fontFamily: "var(--mono)",
            lineHeight: 1,
            marginBottom: 8,
            color: "var(--text-primary)", /* Section 14: Score: #F8FAFC */
          }}
        >
          {score}
          <span style={{ fontSize: "clamp(22px, 3.5vw, 32px)", color: "var(--text-muted)", fontWeight: 600 }}>
            /{exam.totalMarks}
          </span>
        </div>

        {/* Percentage & Grade */}
        <div
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: "var(--text-primary)",
            marginBottom: 6,
          }}
        >
          {pct}% Score · {grade}
        </div>

        <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 16 }}>
          Passing benchmark: {exam.passMark} marks ({Math.round((exam.passMark / exam.totalMarks) * 100)}%) · {exam.title}
        </div>

        {/* Duration & Violation Metrics */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            flexWrap: "wrap",
            fontSize: 12.5,
            color: "var(--text-secondary)",
          }}
        >
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
            <Clock size={14} color="var(--primary-brand)" /> {fmtTime(timeTaken)} time elapsed
          </span>
          {violations > 0 ? (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, color: "var(--error)" }}>
              <ShieldAlert size={14} /> {violations} integrity violation{violations !== 1 ? "s" : ""} recorded
            </span>
          ) : (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, color: "var(--success)" }}>
              <Check size={14} /> Zero integrity breaches
            </span>
          )}
          {saving && (
            <span style={{ color: "var(--text-muted)", fontSize: 12 }}>
              Syncing verification record...
            </span>
          )}
        </div>

        {/* Global Rank Reveal */}
        {globalRank && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              marginTop: 20,
              background: "var(--surface-secondary)",
              border: "1px solid var(--border-color)",
              borderRadius: "var(--radius-lg)",
              padding: "10px 20px",
            }}
          >
            <Medal size={22} color="var(--warning)" />
            <div style={{ textAlign: "left" }}>
              <span style={{ fontSize: 10.5, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
                Global Cohort Standing
              </span>
              <div style={{ fontSize: 16, fontWeight: 800, fontFamily: "var(--mono)", color: "var(--text-primary)" }}>
                Rank <span style={{ color: "var(--primary-brand)" }}>#{globalRank.rank}</span> of {globalRank.total} candidates
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* ── Summary Stats Grid ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 14,
          marginBottom: 28,
        }}
      >
        {[
          {
            label: "Correct Responses",
            value: correctCount,
            icon: CheckCircle2,
            color: "var(--success)",
            bg: "var(--success-bg)",
            border: "var(--success-border)",
          },
          {
            label: "Incorrect Responses",
            value: incorrectCount,
            icon: XCircle,
            color: "var(--error)",
            bg: "var(--error-bg)",
            border: "var(--error-border)",
          },
          {
            label: "Skipped / Unanswered",
            value: skippedCount,
            icon: SkipForward,
            color: "var(--warning)",
            bg: "var(--warning-bg)",
            border: "var(--warning-border)",
          },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              style={{
                background: "var(--surface-main)",
                border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-lg)",
                padding: "18px 20px",
                textAlign: "center",
                boxShadow: "var(--shadow-xs)",
              }}
            >
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: "var(--radius-md)",
                  background: stat.bg,
                  border: `1px solid ${stat.border}`,
                  color: stat.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 10px",
                }}
              >
                <Icon size={20} />
              </div>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 800,
                  fontFamily: "var(--mono)",
                  color: stat.color,
                  lineHeight: 1,
                }}
              >
                {stat.value}
              </div>
              <div style={{ fontSize: 12.5, color: "var(--text-secondary)", marginTop: 6 }}>
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Question-by-Question Review ── */}
      <div
        style={{
          background: "var(--surface-main)",
          border: "1px solid var(--border-color)",
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
          marginBottom: 28,
          boxShadow: "var(--shadow-xs)",
        }}
      >
        <div
          style={{
            padding: "16px 24px",
            borderBottom: "1px solid var(--border-color)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "var(--surface-secondary)",
          }}
        >
          <h3 style={{ fontSize: 16, fontWeight: 800, color: "var(--text-primary)" }}>
            Itemized Examination Review
          </h3>
          <span style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--mono)" }}>
            {exam.questions.length} Items Total
          </span>
        </div>

        <div>
          {results.map((r, i) => {
            const userLabel = getAnswerLabel(r);
            const correctLabel = getCorrectLabel(r.q);
            const isSkipped = userLabel === null || userLabel === "";

            return (
              <div
                key={i}
                style={{
                  padding: "20px 24px",
                  borderBottom:
                    i < results.length - 1
                      ? "1px solid var(--border-color)"
                      : "none",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                    marginBottom: 12,
                  }}
                >
                  <span
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: "var(--radius-sm)",
                      background: r.isCorrect ? "var(--success-bg)" : "var(--error-bg)",
                      border: `1px solid ${r.isCorrect ? "var(--success-border)" : "var(--error-border)"}`,
                      color: r.isCorrect ? "var(--success)" : "var(--error)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11.5,
                      fontWeight: 800,
                      fontFamily: "var(--mono)",
                      flexShrink: 0,
                      marginTop: 2,
                    }}
                  >
                    #{i + 1}
                  </span>

                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: 14.5,
                        fontWeight: 600,
                        color: "var(--text-primary)",
                        lineHeight: 1.45,
                      }}
                    >
                      {r.q.question}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "var(--text-muted)",
                        fontFamily: "var(--mono)",
                        marginTop: 4,
                      }}
                    >
                      {r.q.type.toUpperCase()} · {r.q.marks} {r.q.marks === 1 ? "mark" : "marks"}
                    </div>
                  </div>

                  <span
                    style={{
                      padding: "3px 8px",
                      borderRadius: "var(--radius-sm)",
                      fontSize: 11.5,
                      fontWeight: 700,
                      fontFamily: "var(--mono)",
                      background: r.isCorrect ? "var(--success-bg)" : "var(--error-bg)",
                      color: r.isCorrect ? "var(--success)" : "var(--error)",
                      border: `1px solid ${r.isCorrect ? "var(--success-border)" : "var(--error-border)"}`,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {r.isCorrect ? `+${r.q.marks}` : "+0"}
                  </span>
                </div>

                {/* Answers Comparison */}
                <div style={{ display: "flex", flexDirection: "column", gap: 6, paddingLeft: 38 }}>
                  {isSkipped ? (
                    <div
                      style={{
                        background: "var(--surface-secondary)",
                        border: "1px solid var(--border-color)",
                        borderRadius: "var(--radius-sm)",
                        padding: "8px 12px",
                        fontSize: 12.5,
                        color: "var(--text-muted)",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <SkipForward size={14} color="var(--warning)" /> Skipped / Unanswered
                    </div>
                  ) : (
                    <div
                      style={{
                        background: r.isCorrect ? "var(--success-bg)" : "var(--error-bg)",
                        border: `1px solid ${r.isCorrect ? "var(--success-border)" : "var(--error-border)"}`,
                        borderRadius: "var(--radius-sm)",
                        padding: "8px 12px",
                        fontSize: 12.5,
                        color: r.isCorrect ? "var(--success)" : "var(--error)",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      {r.isCorrect ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                      <span>Your Response: <strong>{userLabel}</strong></span>
                    </div>
                  )}

                  {!r.isCorrect && (
                    <div
                      style={{
                        background: "var(--success-bg)",
                        border: "1px dashed var(--success-border)",
                        borderRadius: "var(--radius-sm)",
                        padding: "8px 12px",
                        fontSize: 12.5,
                        color: "var(--success)",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <CheckCircle2 size={14} />
                      <span>Verified Correct Answer: <strong>{correctLabel}</strong></span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Final Actions ── */}
      <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
        <button
          className="btn btn-primary"
          onClick={onBack}
          style={{ padding: "10px 24px" }}
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
}
