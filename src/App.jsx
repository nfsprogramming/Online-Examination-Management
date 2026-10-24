import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import LoginPage from "./components/LoginPage";
import DashboardPage from "./components/Dashboard";
import ExamScreen from "./components/ExamScreen";
import ResultPage from "./components/ResultPage";
import { EXAMS } from "./data/exams";
import { observeAuth } from "./firebase/auth";
import { FIREBASE_CONFIGURED } from "./firebase/config";

const SCREENS = { LOGIN: "login", DASHBOARD: "dashboard", EXAM: "exam", RESULT: "result" };

const pageVariants = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } },
  exit:    { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

function calculateScore(exam, answers, fillAnswers) {
  let score = 0;
  exam.questions.forEach((q, i) => {
    let isCorrect = false;
    if (q.type === "mcq") {
      isCorrect = answers[i] === q.correct;
    } else if (q.type === "truefalse") {
      isCorrect = answers[i] === q.correct;
    } else if (q.type === "fill") {
      const userAnswer = fillAnswers[i] || "";
      isCorrect = q.correct.some(
        (c) => c.toLowerCase() === userAnswer.trim().toLowerCase()
      );
    }
    if (isCorrect) score += q.marks;
  });
  return score;
}

export default function App() {
  const [screen, setScreen]           = useState(SCREENS.LOGIN);
  const [user, setUser]               = useState(null);
  const [activeExam, setActiveExam]   = useState(null);
  const [examResult, setExamResult]   = useState(null);
  const [authChecked, setAuthChecked] = useState(!FIREBASE_CONFIGURED);

  const [resultsHistory, setResultsHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("examination_results_history")) || [];
    } catch {
      return [];
    }
  });

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("examination_theme") || "dark";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("examination_theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((t) => (t === "light" ? "dark" : "light"));
  };

  /* ── Restore Firebase auth session on reload ── */
  useEffect(() => {
    const unsub = observeAuth((fbUser) => {
      setAuthChecked(true);
      if (fbUser) {
        setUser({
          uid:      fbUser.uid,
          name:     fbUser.displayName || fbUser.email,
          email:    fbUser.email,
          photoURL: fbUser.photoURL,
          role:     "student",
        });
        setScreen(SCREENS.DASHBOARD);
      } else {
        setUser(null);
        setScreen(SCREENS.LOGIN);
      }
    });
    return unsub;
  }, []);

  const handleLogin = (u) => {
    setUser(u);
    setScreen(SCREENS.DASHBOARD);
  };

  const handleLogout = () => {
    setUser(null);
    setActiveExam(null);
    setExamResult(null);
    setScreen(SCREENS.LOGIN);
  };

  const handleStartExam = (e) => {
    setActiveExam(e);
    setExamResult(null);
    setScreen(SCREENS.EXAM);
  };

  const handleExamFinish = (r) => {
    setExamResult(r);
    if (activeExam) {
      const score = calculateScore(activeExam, r.answers, r.fillAnswers);
      const pct = Math.round((score / activeExam.totalMarks) * 100);
      const passed = score >= activeExam.passMark;
      const record = {
        examId: activeExam.id,
        examTitle: activeExam.title,
        score,
        totalMarks: activeExam.totalMarks,
        passMark: activeExam.passMark,
        pct,
        passed,
        timeTaken: r.timeTaken,
        violations: r.violations || 0,
        date: new Date().toISOString(),
      };
      setResultsHistory((prev) => {
        const updated = [record, ...prev];
        try {
          localStorage.setItem("examination_results_history", JSON.stringify(updated));
        } catch (_) {}
        return updated;
      });
    }
    setScreen(SCREENS.RESULT);
  };

  const handleBack = () => {
    setActiveExam(null);
    setExamResult(null);
    setScreen(SCREENS.DASHBOARD);
  };

  /* Loading shimmer while Firebase checks session */
  if (!authChecked) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg)",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <div className="brand-logo-icon" style={{ width: 48, height: 48, fontSize: 22 }}>
          E
        </div>
        <div style={{ fontSize: 13, color: "var(--text-muted)", fontFamily: "var(--mono)" }}>
          Checking security session…
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {screen === SCREENS.LOGIN && (
        <motion.div key="login" variants={pageVariants} initial="initial" animate="animate" exit="exit">
          <LoginPage onLogin={handleLogin} theme={theme} toggleTheme={toggleTheme} />
        </motion.div>
      )}

      {screen === SCREENS.DASHBOARD && user && (
        <motion.div key="dashboard" variants={pageVariants} initial="initial" animate="animate" exit="exit">
          <DashboardPage
            user={user}
            exams={EXAMS}
            onStartExam={handleStartExam}
            onLogout={handleLogout}
            resultsHistory={resultsHistory}
            theme={theme}
            toggleTheme={toggleTheme}
          />
        </motion.div>
      )}

      {screen === SCREENS.EXAM && activeExam && (
        <motion.div key="exam" variants={pageVariants} initial="initial" animate="animate" exit="exit">
          <ExamScreen exam={activeExam} user={user} onFinish={handleExamFinish} />
        </motion.div>
      )}

      {screen === SCREENS.RESULT && activeExam && examResult && (
        <motion.div key="result" variants={pageVariants} initial="initial" animate="animate" exit="exit">
          <ResultPage
            exam={activeExam}
            answers={examResult.answers}
            fillAnswers={examResult.fillAnswers}
            timeTaken={examResult.timeTaken}
            violations={examResult.violations}
            user={user}
            onBack={handleBack}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
