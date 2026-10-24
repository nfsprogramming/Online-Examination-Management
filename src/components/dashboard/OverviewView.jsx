import { useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Clock,
  Star,
  Users,
  BarChart2,
  ChevronRight,
  ShieldCheck,
  Radio,
  Trophy,
  Award,
} from "lucide-react";
import StatCard from "../common/StatCard";

function Avatar({ name, photoURL, idx }) {
  if (photoURL) {
    return (
      <img
        src={photoURL}
        alt={name}
        style={{
          width: 32,
          height: 32,
          borderRadius: "var(--radius-sm)",
          objectFit: "cover",
          border: "1px solid var(--border-color)",
          flexShrink: 0,
        }}
      />
    );
  }
  const initials = (name || "?")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: "var(--radius-sm)",
        flexShrink: 0,
        background: idx === 1 ? "var(--surface-active)" : "var(--surface-secondary)",
        border: "1px solid var(--border-color)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 11.5,
        fontWeight: 700,
        color: idx === 1 ? "var(--primary-brand)" : "var(--text-secondary)",
      }}
    >
      {initials}
    </div>
  );
}

export default function OverviewView({
  user,
  exams,
  onSelectExam,
  onViewAllExams,
  liveLeaderboardEntries = [],
  isLiveLeaderboard = false,
  liveCount = 0,
}) {
  const [selectedSubject, setSelectedSubject] = useState("All");

  const subjects = ["All", ...new Set(exams.map((e) => e.subject))];
  const filteredExams =
    selectedSubject === "All"
      ? exams
      : exams.filter((e) => e.subject === selectedSubject);

  const totalQuestions = exams.reduce((sum, e) => sum + e.questions.length, 0);
  const avgPassingScore = Math.round(
    exams.reduce((sum, e) => sum + e.avgScore, 0) / (exams.length || 1)
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      {/* ── Section 1: Page Introduction Banner ── */}
      <div
        style={{
          background: "var(--surface-main)",
          border: "1px solid var(--border-color)",
          borderRadius: "var(--radius-lg)",
          padding: "26px 30px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 18,
          boxShadow: "var(--shadow-xs)",
        }}
      >
        <div style={{ maxWidth: 620 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "var(--surface-secondary)",
              border: "1px solid var(--border-color)",
              borderRadius: "var(--radius-full)",
              padding: "3px 10px",
              fontSize: 11,
              fontWeight: 700,
              color: "var(--primary-brand)",
              textTransform: "uppercase",
              letterSpacing: 0.6,
              marginBottom: 10,
            }}
          >
            <ShieldCheck size={13} />
            Academic Examination Session Active
          </div>
          <h2
            style={{
              fontSize: "clamp(20px, 2.5vw, 24px)",
              fontWeight: 800,
              letterSpacing: -0.4,
              color: "var(--text-primary)",
              marginBottom: 6,
            }}
          >
            Welcome back, {user?.name?.split(" ")[0] || "Candidate"}
          </h2>
          <p
            style={{
              fontSize: 13.5,
              color: "var(--text-secondary)",
              lineHeight: 1.5,
            }}
          >
            Choose a standardized assessment from your curriculum. All examinations include automated evaluation, anti-cheat monitoring, and official transcript generation.
          </p>
        </div>

        {exams[0] && (
          <button
            className="btn btn-primary"
            onClick={() => onSelectExam(exams[0])}
            style={{ padding: "10px 20px" }}
          >
            Start: {exams[0]?.title} <ChevronRight size={16} />
          </button>
        )}
      </div>

      {/* ── Section 2: Statistics Row ── */}
      <section aria-label="Key examination metrics">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
          }}
        >
          <StatCard
            icon={BookOpen}
            label="Total Examinations"
            value={exams.length}
            trend="+12% this term"
            trendPositive={true}
            sublabel="Standardized"
          />
          <StatCard
            icon={Star}
            label="Question Repository"
            value={totalQuestions}
            trend="3 Format Types"
            trendPositive={true}
            sublabel="Auto-graded"
          />
          <StatCard
            icon={BarChart2}
            label="Average Score"
            value={`${avgPassingScore}%`}
            trend="+4.8% cohort avg"
            trendPositive={true}
            sublabel="Passing benchmark 60%"
          />
          <StatCard
            icon={Users}
            label="Candidates Active"
            value={liveCount > 0 ? `${liveCount} Live` : "1,248"}
            trend={liveCount > 0 ? "Real-time presence" : "Total tested"}
            trendPositive={true}
          />
        </div>
      </section>

      {/* ── Main Split: Examinations Grid & Leaderboard ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 320px",
          gap: 24,
          alignItems: "start",
        }}
        className="overview-split"
      >
        {/* Left: Available Examinations */}
        <section aria-label="Available examinations" style={{ minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 16,
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: "var(--text-primary)" }}>
                Certified Examinations
              </h3>
              <span
                style={{
                  background: "var(--surface-secondary)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "var(--radius-full)",
                  padding: "2px 8px",
                  fontSize: 11,
                  fontFamily: "var(--mono)",
                  fontWeight: 700,
                  color: "var(--text-secondary)",
                }}
              >
                {filteredExams.length}
              </span>
            </div>

            {/* Subject Filters */}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {subjects.map((sub) => (
                <button
                  key={sub}
                  onClick={() => setSelectedSubject(sub)}
                  style={{
                    padding: "5px 11px",
                    borderRadius: "var(--radius-md)",
                    border: `1px solid ${selectedSubject === sub ? "var(--primary-brand)" : "var(--border-color)"}`,
                    background: selectedSubject === sub ? "var(--surface-active)" : "var(--surface-main)",
                    color: selectedSubject === sub ? "var(--primary-brand)" : "var(--text-secondary)",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>

          <div className="exam-grid">
            {filteredExams.map((exam, idx) => (
              <motion.article
                key={exam.id}
                className="exam-card"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.06, duration: 0.25 }}
              >
                <div className="card-top">
                  <div className="card-icon-wrap" aria-hidden="true">
                    {exam.icon}
                  </div>
                  <span className="badge-status live">
                    <span className="badge-live-dot" /> Live
                  </span>
                </div>

                <div className="card-subject">{exam.subject}</div>
                <h4 className="card-title">{exam.title}</h4>

                <div className="card-meta-row">
                  <span className="meta-chip">
                    <Clock size={12} /> {exam.duration} min
                  </span>
                  <span className="meta-chip">
                    <BookOpen size={12} /> {exam.questions.length} Qs
                  </span>
                  <span className="meta-chip">
                    <Star size={12} /> {exam.totalMarks} marks
                  </span>
                  <span className={`diff-badge diff-${exam.difficulty}`}>
                    {exam.difficulty}
                  </span>
                </div>

                <div className="card-meta-row" style={{ marginTop: "auto" }}>
                  <span className="meta-chip" style={{ fontSize: 11 }}>
                    <Users size={11} /> {exam.attempts.toLocaleString()} attempts
                  </span>
                  <span className="meta-chip" style={{ fontSize: 11 }}>
                    <BarChart2 size={11} /> avg {exam.avgScore}%
                  </span>
                </div>

                <div className="card-footer">
                  <div className="pass-info">
                    Pass: <strong>{exam.passMark}</strong>/{exam.totalMarks}
                  </div>
                  <button
                    id={`start-exam-card-${exam.id}`}
                    className="btn btn-primary"
                    style={{ padding: "7px 14px", minHeight: 36, fontSize: 12.5 }}
                    onClick={() => onSelectExam(exam)}
                  >
                    Take Exam <ChevronRight size={14} />
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        {/* Right: Live Leaderboard Panel */}
        <aside className="leaderboard-panel" aria-label="Live leaderboard">
          <div className="panel-header">
            <h3 className="panel-title">
              <Trophy size={16} color="var(--warning)" /> Top Candidates
            </h3>
            {isLiveLeaderboard && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  fontSize: 10.5,
                  color: "var(--success)",
                  fontWeight: 700,
                  fontFamily: "var(--mono)",
                }}
              >
                <Radio size={11} /> LIVE
              </span>
            )}
          </div>

          <div className="lb-list">
            {liveLeaderboardEntries.slice(0, 7).map((entry, i) => (
              <div key={entry.id || (entry.displayName || entry.name) + i} className="lb-item">
                <div className={`lb-rank ${i < 3 ? `rank-${i + 1}` : "rank-other"}`}>
                  {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
                </div>
                <Avatar
                  name={entry.displayName || entry.name}
                  photoURL={entry.photoURL}
                  idx={i + 1}
                />
                <div className="lb-info">
                  <span className="lb-name">
                    {entry.displayName || entry.name || "Candidate"}
                  </span>
                  <span className="lb-exam">
                    {entry.examTitle || entry.exam || "General Exam"}
                  </span>
                </div>
                <div className="lb-score">
                  <span className="lb-val">{entry.score}</span>
                  <span className="lb-pct">/{entry.totalMarks || entry.total || 50}</span>
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: 16,
              paddingTop: 12,
              borderTop: "1px solid var(--border-color)",
              textAlign: "center",
            }}
          >
            <button
              className="btn btn-ghost"
              style={{ width: "100%", fontSize: 12.5, minHeight: 36 }}
              onClick={onViewAllExams}
            >
              Full Student Directory →
            </button>
          </div>
        </aside>
      </div>

      <style>{`
        @media (max-width: 1100px) {
          .overview-split {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
