import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  BookOpen,
  Star,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  ChevronRight,
  X,
  Zap,
} from "lucide-react";
import { LEADERBOARD as STATIC_LB } from "../data/exams";
import { subscribeLeaderboard, subscribeLiveCount } from "../firebase/firestore";
import { FIREBASE_CONFIGURED } from "../firebase/config";
import { logoutUser } from "../firebase/auth";

import Sidebar from "./layout/Sidebar";
import Topbar from "./layout/Topbar";
import MobileNav from "./layout/MobileNav";

import OverviewView from "./dashboard/OverviewView";
import ExamsView from "./dashboard/ExamsView";
import QuestionsView from "./dashboard/QuestionsView";
import ResultsView from "./dashboard/ResultsView";
import StudentsView from "./dashboard/StudentsView";
import AnalyticsView from "./dashboard/AnalyticsView";
import SettingsView from "./dashboard/SettingsView";

/* ── Pre-Exam Rules & Info Modal ────────────────────────────────────────── */
function InfoModal({ exam, onClose, onBegin }) {
  const passPercent = Math.round((exam.passMark / exam.totalMarks) * 100);

  return (
    <motion.div
      className="modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="info-modal-title"
    >
      <motion.div
        className="modal-content"
        initial={{ scale: 0.95, opacity: 0, y: 14 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 14 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 800,
              color: "var(--primary-brand)",
              textTransform: "uppercase",
              letterSpacing: 1.2,
            }}
          >
            {exam.subject}
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "var(--text-muted)",
              cursor: "pointer",
              padding: 4,
            }}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <h2
          id="info-modal-title"
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: "var(--text-primary)",
            marginBottom: 6,
          }}
        >
          {exam.title}
        </h2>

        <p style={{ color: "var(--text-secondary)", fontSize: 13.5, marginBottom: 20 }}>
          {exam.questions.length} questions · {exam.duration} minutes · {exam.totalMarks} marks · Difficulty: {exam.difficulty}
        </p>

        {/* Rules breakdown cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
          {[
            {
              icon: "⏱",
              title: "Time Limit Enforced",
              desc: `${exam.duration} minutes allocated. The examination automatically submits once the timer expires.`,
            },
            {
              icon: "🗺",
              title: "Free Question Navigation",
              desc: "Jump freely between questions or flag items for final review before submission.",
            },
            {
              icon: "🚨",
              title: "Active Integrity Monitoring",
              desc: "Tab switching and window minimization are recorded. 3 violations locks the examination session.",
            },
            {
              icon: "✅",
              title: "Pass Threshold",
              desc: `Requires a minimum of ${exam.passMark}/${exam.totalMarks} marks (${passPercent}%) to receive a passing grade.`,
            },
          ].map(({ icon, title, desc }) => (
            <div
              key={title}
              style={{
                display: "flex",
                gap: 12,
                background: "var(--surface-secondary)",
                border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-md)",
                padding: "10px 14px",
              }}
            >
              <div style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>{icon}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", marginBottom: 2 }}>
                  {title}
                </div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.4 }}>
                  {desc}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal CTAs */}
        <div style={{ display: "flex", gap: 10 }}>
          <button
            id="cancel-start-btn"
            className="btn btn-secondary"
            onClick={onClose}
            style={{ flex: 1 }}
          >
            Cancel
          </button>
          <button
            id="begin-exam-btn"
            className="btn btn-primary"
            onClick={onBegin}
            style={{ flex: 2 }}
          >
            Begin Examination <ChevronRight size={16} />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Main Dashboard Page ────────────────────────────────────────────────── */
export default function DashboardPage({
  user,
  exams,
  onStartExam,
  onLogout,
  resultsHistory = [],
  theme,
  toggleTheme,
}) {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedExam, setSelectedExam] = useState(null);
  const [liveCount, setLiveCount] = useState(0);

  const [leaderboardEntries, setLeaderboardEntries] = useState(
    STATIC_LB.map((e, i) => ({
      rank: i + 1,
      displayName: e.name,
      examTitle: e.exam,
      score: e.score,
      totalMarks: e.total,
    }))
  );
  const [isLiveLeaderboard, setIsLiveLeaderboard] = useState(false);

  /* Subscribe to live students in exams */
  useEffect(() => {
    const unsub = subscribeLiveCount(setLiveCount);
    return unsub;
  }, []);

  /* Subscribe to real-time leaderboard */
  useEffect(() => {
    if (!FIREBASE_CONFIGURED) return;
    setIsLiveLeaderboard(true);
    const unsub = subscribeLeaderboard((liveEntries) => {
      if (liveEntries.length > 0) setLeaderboardEntries(liveEntries);
    }, 15);
    return unsub;
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    onLogout();
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case "overview":    return "Dashboard Overview";
      case "exams":       return "Certified Examinations";
      case "questions":   return "Question Bank";
      case "results":     return "Academic Results";
      case "leaderboard": return "Student Directory";
      case "analytics":   return "Cohort Analytics";
      case "settings":    return "Settings & Preferences";
      default:            return "ExamiNation";
    }
  };

  return (
    <div className="dashboard-shell">
      {/* Desktop Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        user={user}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div className="dashboard-main-area">
        <Topbar
          pageTitle={getPageTitle()}
          searchQuery={searchQuery}
          onSearchChange={(q) => {
            setSearchQuery(q);
            if (activeTab === "overview" && q) setActiveTab("exams");
          }}
          liveCount={liveCount}
          user={user}
          onLogout={handleLogout}
          theme={theme}
          toggleTheme={toggleTheme}
        />

        <main className="dashboard-body">
          {activeTab === "overview" && (
            <OverviewView
              user={user}
              exams={exams}
              onSelectExam={setSelectedExam}
              onViewAllExams={() => setActiveTab("leaderboard")}
              liveLeaderboardEntries={leaderboardEntries}
              isLiveLeaderboard={isLiveLeaderboard}
              liveCount={liveCount}
            />
          )}

          {activeTab === "exams" && (
            <ExamsView
              exams={exams}
              onSelectExam={setSelectedExam}
              searchQuery={searchQuery}
            />
          )}

          {activeTab === "questions" && (
            <QuestionsView exams={exams} />
          )}

          {activeTab === "results" && (
            <ResultsView
              resultsHistory={resultsHistory}
              onStartExam={setSelectedExam}
              exams={exams}
            />
          )}

          {activeTab === "leaderboard" && (
            <StudentsView
              leaderboardEntries={leaderboardEntries}
              isLive={isLiveLeaderboard}
              liveCount={liveCount}
            />
          )}

          {activeTab === "analytics" && (
            <AnalyticsView exams={exams} />
          )}

          {activeTab === "settings" && (
            <SettingsView
              user={user}
              onLogout={handleLogout}
              theme={theme}
              toggleTheme={toggleTheme}
            />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* Pre-Exam Modal */}
      <AnimatePresence>
        {selectedExam && (
          <InfoModal
            key="info-modal"
            exam={selectedExam}
            onClose={() => setSelectedExam(null)}
            onBegin={() => {
              const exam = selectedExam;
              setSelectedExam(null);
              onStartExam(exam);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
