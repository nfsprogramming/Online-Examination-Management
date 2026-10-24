import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  Shield,
  GraduationCap,
  Sparkles,
  Sun,
  Moon,
  BookOpen,
} from "lucide-react";
import {
  loginWithGoogle,
  checkAdminCredentials,
  loginUser,
  registerUser,
} from "../firebase/auth";
import { FIREBASE_CONFIGURED } from "../firebase/config";

export default function LoginPage({ onLogin, theme, toggleTheme }) {
  // Tab: "student" | "admin"
  const [roleTab, setRoleTab] = useState("student");
  // Auth mode for student: "signin" | "signup"
  const [authMode, setAuthMode] = useState("signin");

  // Student form state
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [studentPassword, setStudentPassword] = useState("");
  const [showStudentPass, setShowStudentPass] = useState(false);

  // Admin form state
  const [adminUser, setAdminUser] = useState("");
  const [adminPass, setAdminPass] = useState("");
  const [showAdminPass, setShowAdminPass] = useState(false);

  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  /* ── One-click Candidate Demo ── */
  const handleDemoStudent = async () => {
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    onLogin({
      uid: "candidate-demo",
      name: "Alex Morgan",
      email: "alex.morgan@university.edu",
      role: "student",
      photoURL: null,
    });
  };

  /* ── Student Email/Password Sign In or Registration ── */
  const handleStudentAuth = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);

    try {
      if (authMode === "signin") {
        if (FIREBASE_CONFIGURED) {
          const user = await loginUser(studentEmail, studentPassword);
          onLogin({
            uid: user.uid,
            name: user.displayName || studentEmail.split("@")[0],
            email: user.email,
            role: "student",
            photoURL: user.photoURL,
          });
        } else {
          // Simulated demo sign-in
          await new Promise((r) => setTimeout(r, 500));
          onLogin({
            uid: `demo-${Date.now()}`,
            name: studentEmail.split("@")[0] || "Candidate",
            email: studentEmail,
            role: "student",
            photoURL: null,
          });
        }
      } else {
        // Sign Up / Register
        if (FIREBASE_CONFIGURED) {
          const user = await registerUser(studentEmail, studentPassword, studentName);
          setSuccessMsg("Account created successfully! Signing you in...");
          setTimeout(() => {
            onLogin({
              uid: user.uid,
              name: studentName,
              email: studentEmail,
              role: "student",
              photoURL: null,
            });
          }, 600);
        } else {
          await new Promise((r) => setTimeout(r, 500));
          setSuccessMsg("Account created successfully in Demo Mode!");
          setTimeout(() => {
            onLogin({
              uid: `demo-${Date.now()}`,
              name: studentName || "Candidate",
              email: studentEmail,
              role: "student",
              photoURL: null,
            });
          }, 600);
        }
      }
    } catch (err) {
      console.error("Auth error:", err);
      setError(
        err.code === "auth/user-not-found"
          ? "No account found with this email."
          : err.code === "auth/wrong-password"
          ? "Incorrect password."
          : err.code === "auth/email-already-in-use"
          ? "An account with this email already exists."
          : err.code === "auth/weak-password"
          ? "Password should be at least 6 characters."
          : err.message || "Authentication failed. Please verify your details."
      );
      setLoading(false);
    }
  };

  /* ── Google Sign-In ── */
  const handleGoogle = async () => {
    setError("");
    setLoading(true);
    try {
      if (FIREBASE_CONFIGURED) {
        const user = await loginWithGoogle();
        onLogin(user);
      } else {
        await new Promise((r) => setTimeout(r, 450));
        onLogin({
          uid: "demo-student-google",
          name: "Dr. Jordan Hayes",
          email: "jordan.hayes@academic.edu",
          role: "student",
          photoURL: null,
        });
      }
    } catch (err) {
      setError(
        err.code === "auth/popup-closed-by-user"
          ? "Sign-in was cancelled."
          : "Google sign-in failed. Please verify configuration."
      );
      setLoading(false);
    }
  };

  /* ── Admin Login ── */
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    const admin = checkAdminCredentials(adminUser, adminPass);
    if (admin) {
      onLogin(admin);
    } else {
      setError("Invalid administrator credentials. Hint: admin / admin123");
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Theme Toggle in top right */}
      {toggleTheme && (
        <button
          id="login-theme-toggle"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="icon-button"
          style={{
            position: "absolute",
            top: 24,
            right: 24,
            zIndex: 20,
          }}
          title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
        </button>
      )}

      <motion.div
        className="login-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: "center", marginBottom: 26 }}>
          <div className="login-logo" aria-hidden="true">
            <BookOpen size={26} color="#FFFFFF" />
          </div>
          <h1 className="login-title">Welcome to ExamiNation</h1>
          <p className="login-subtitle">Your examination journey starts here.</p>
        </div>

        {/* Role Tab Switcher: Candidate vs Faculty / Admin */}
        <div
          style={{
            display: "flex",
            background: "var(--surface-secondary)",
            borderRadius: "var(--radius-md)",
            padding: 3,
            marginBottom: 24,
            border: "1px solid var(--border-color)",
          }}
          role="tablist"
        >
          {[
            { key: "student", label: "Candidate Portal", icon: GraduationCap },
            { key: "admin", label: "Faculty / Admin", icon: Shield },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              id={`tab-${key}`}
              role="tab"
              aria-selected={roleTab === key}
              onClick={() => {
                setRoleTab(key);
                setError("");
                setSuccessMsg("");
              }}
              style={{
                flex: 1,
                padding: "8px 12px",
                borderRadius: "var(--radius-sm)",
                border: "none",
                cursor: "pointer",
                fontFamily: "var(--sans)",
                fontSize: 13,
                fontWeight: roleTab === key ? 700 : 600,
                background: roleTab === key ? "var(--surface-main)" : "transparent",
                color: roleTab === key ? "var(--text-primary)" : "var(--text-muted)",
                transition: "all 0.18s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 7,
                boxShadow: roleTab === key ? "var(--shadow-xs)" : "none",
              }}
            >
              <Icon size={15} color={roleTab === key ? "var(--primary-brand)" : "currentColor"} />
              {label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* ── Candidate Portal ── */}
          {roleTab === "student" && (
            <motion.div
              key="student-panel"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.18 }}
            >
              <form onSubmit={handleStudentAuth} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {authMode === "signup" && (
                  <div className="input-group">
                    <label className="input-label" htmlFor="student-name-input">
                      Full Name
                    </label>
                    <div className="input-wrapper">
                      <div className="input-icon">
                        <User size={16} />
                      </div>
                      <input
                        id="student-name-input"
                        type="text"
                        className="input-field"
                        placeholder="e.g. Alex Morgan"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        required
                        autoComplete="name"
                      />
                    </div>
                  </div>
                )}

                <div className="input-group">
                  <label className="input-label" htmlFor="student-email-input">
                    Institutional Email address
                  </label>
                  <div className="input-wrapper">
                    <div className="input-icon">
                      <Mail size={16} />
                    </div>
                    <input
                      id="student-email-input"
                      type="email"
                      className="input-field"
                      placeholder="student@university.edu"
                      value={studentEmail}
                      onChange={(e) => setStudentEmail(e.target.value)}
                      required
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div className="input-group">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <label className="input-label" htmlFor="student-pass-input">
                      Password
                    </label>
                    {authMode === "signin" && (
                      <span
                        style={{
                          fontSize: 12,
                          color: "var(--primary-brand)",
                          cursor: "pointer",
                          fontWeight: 600,
                        }}
                        onClick={() => alert("Password reset link sent to institutional inbox (demo).")}
                      >
                        Forgot password?
                      </span>
                    )}
                  </div>
                  <div className="input-wrapper">
                    <div className="input-icon">
                      <Lock size={16} />
                    </div>
                    <input
                      id="student-pass-input"
                      type={showStudentPass ? "text" : "password"}
                      className="input-field"
                      style={{ paddingRight: 40 }}
                      placeholder="••••••••"
                      value={studentPassword}
                      onChange={(e) => setStudentPassword(e.target.value)}
                      required
                      autoComplete={authMode === "signin" ? "current-password" : "new-password"}
                    />
                    <button
                      type="button"
                      id="toggle-student-pass-btn"
                      onClick={() => setShowStudentPass(!showStudentPass)}
                      aria-label="Toggle password visibility"
                      style={{
                        position: "absolute",
                        right: 12,
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        color: "var(--text-muted)",
                        cursor: "pointer",
                        display: "flex",
                      }}
                    >
                      {showStudentPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Primary CTA */}
                <button
                  id="student-submit-btn"
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary"
                  style={{ width: "100%", marginTop: 4 }}
                >
                  {loading ? (
                    "Processing..."
                  ) : authMode === "signin" ? (
                    <>
                      Sign in <ArrowRight size={16} />
                    </>
                  ) : (
                    "Create account"
                  )}
                </button>
              </form>

              {/* Mode Switcher */}
              <div
                style={{
                  textAlign: "center",
                  marginTop: 18,
                  fontSize: 13,
                  color: "var(--text-secondary)",
                }}
              >
                {authMode === "signin" ? (
                  <>
                    Don't have an account?{" "}
                    <button
                      type="button"
                      id="switch-to-signup"
                      onClick={() => {
                        setAuthMode("signup");
                        setError("");
                      }}
                      style={{
                        background: "none",
                        border: "none",
                        color: "var(--primary-brand)",
                        fontWeight: 700,
                        cursor: "pointer",
                        fontSize: 13,
                        padding: 0,
                      }}
                    >
                      Create account
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <button
                      type="button"
                      id="switch-to-signin"
                      onClick={() => {
                        setAuthMode("signin");
                        setError("");
                      }}
                      style={{
                        background: "none",
                        border: "none",
                        color: "var(--primary-brand)",
                        fontWeight: 700,
                        cursor: "pointer",
                        fontSize: 13,
                        padding: 0,
                      }}
                    >
                      Sign in
                    </button>
                  </>
                )}
              </div>

              {/* Divider */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  margin: "20px 0 16px",
                }}
              >
                <div style={{ flex: 1, height: 1, background: "var(--border-color)" }} />
                <span style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.5 }}>
                  Or Continue With
                </span>
                <div style={{ flex: 1, height: 1, background: "var(--border-color)" }} />
              </div>

              {/* Google Sign-in button */}
              <button
                id="google-signin-btn"
                type="button"
                className="btn btn-secondary"
                onClick={handleGoogle}
                disabled={loading}
                style={{ width: "100%", gap: 10 }}
              >
                <svg width="18" height="18" viewBox="0 0 48 48">
                  <path
                    fill="#4285F4"
                    d="M44.5 20H24v8.5h11.8C34.5 33.2 30 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l6-6C34.5 6.5 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-7.7 19.7-20 0-1.3-.1-2.7-.2-4z"
                  />
                  <path
                    fill="#34A853"
                    d="M24 44c5.4 0 10.3-1.8 14.1-4.9l-6.8-5.6c-2 1.3-4.5 2.1-7.3 2.1-5.6 0-10.4-3.8-12.1-8.9l-7 5.4C8.6 39.4 15.7 44 24 44z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M11.9 26.7c-.4-1.3-.7-2.7-.7-4.2 0-1.4.3-2.8.7-4.2l-7-5.4C3.2 16.4 2 20.1 2 24s1.2 7.6 2.9 11.1l7-5.4z"
                  />
                  <path
                    fill="#EA4335"
                    d="M24 10.5c3.2 0 6.1 1.1 8.3 3.2l6.2-6.2C34.7 3.8 29.8 2 24 2 15.7 2 8.6 6.6 4.9 13.9l7 5.4c1.7-5.1 6.5-8.8 12.1-8.8z"
                  />
                </svg>
                Continue with Institutional Google
              </button>

              {/* Instant One-Click Candidate Demo Button */}
              <button
                type="button"
                id="demo-student-quick-btn"
                onClick={handleDemoStudent}
                disabled={loading}
                className="btn btn-ghost"
                style={{
                  width: "100%",
                  marginTop: 8,
                  fontSize: 12.5,
                  color: "var(--primary-brand)",
                  fontWeight: 600,
                  gap: 6,
                }}
              >
                <Sparkles size={14} /> Quick Demo Access (Alex Morgan)
              </button>
            </motion.div>
          )}

          {/* ── Faculty / Admin Portal ── */}
          {roleTab === "admin" && (
            <motion.div
              key="admin-panel"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.18 }}
            >
              <div
                style={{
                  background: "var(--surface-secondary)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "var(--radius-md)",
                  padding: "10px 14px",
                  fontSize: 12,
                  color: "var(--text-secondary)",
                  marginBottom: 18,
                  lineHeight: 1.5,
                  display: "flex",
                  gap: 8,
                }}
              >
                <Shield size={16} color="var(--primary-brand)" style={{ flexShrink: 0, marginTop: 2 }} />
                <span>
                  <strong>Faculty Assessment Access:</strong> Restricted to accredited examiners and academic administrators.
                </span>
              </div>

              <form onSubmit={handleAdminLogin} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div className="input-group">
                  <label className="input-label" htmlFor="admin-user-input">
                    Administrator ID
                  </label>
                  <div className="input-wrapper">
                    <div className="input-icon">
                      <Shield size={16} />
                    </div>
                    <input
                      id="admin-user-input"
                      type="text"
                      className="input-field"
                      placeholder="admin"
                      value={adminUser}
                      onChange={(e) => setAdminUser(e.target.value)}
                      required
                      autoComplete="username"
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label" htmlFor="admin-pass-input">
                    Access Key / Password
                  </label>
                  <div className="input-wrapper">
                    <div className="input-icon">
                      <Lock size={16} />
                    </div>
                    <input
                      id="admin-pass-input"
                      type={showAdminPass ? "text" : "password"}
                      className="input-field"
                      style={{ paddingRight: 40 }}
                      placeholder="admin123"
                      value={adminPass}
                      onChange={(e) => setAdminPass(e.target.value)}
                      required
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      id="toggle-admin-pass-btn"
                      onClick={() => setShowAdminPass(!showAdminPass)}
                      aria-label="Toggle password visibility"
                      style={{
                        position: "absolute",
                        right: 12,
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        color: "var(--text-muted)",
                        cursor: "pointer",
                        display: "flex",
                      }}
                    >
                      {showAdminPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  id="admin-submit-btn"
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary"
                  style={{ width: "100%", marginTop: 4 }}
                >
                  {loading ? (
                    "Authenticating..."
                  ) : (
                    <>
                      Enter Faculty Panel <ArrowRight size={16} />
                    </>
                  )}
                </button>

                {/* Quick Auto-fill for Examiner Demo */}
                <button
                  type="button"
                  id="auto-fill-admin-btn"
                  className="btn btn-ghost"
                  onClick={() => {
                    setAdminUser("admin");
                    setAdminPass("admin123");
                  }}
                  style={{ fontSize: 12, color: "var(--text-muted)", marginTop: -4 }}
                >
                  Fill Default Credentials (admin / admin123)
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Validation Errors & Alerts */}
        <AnimatePresence>
          {error && (
            <motion.div
              role="alert"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                marginTop: 18,
                background: "var(--error-bg)",
                border: "1px solid var(--error-border)",
                borderRadius: "var(--radius-md)",
                padding: "10px 14px",
                fontSize: 12.5,
                color: "var(--error)",
                textAlign: "center",
                fontWeight: 500,
              }}
            >
              {error}
            </motion.div>
          )}

          {successMsg && (
            <motion.div
              role="status"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                marginTop: 18,
                background: "var(--success-bg)",
                border: "1px solid var(--success-border)",
                borderRadius: "var(--radius-md)",
                padding: "10px 14px",
                fontSize: 12.5,
                color: "var(--success)",
                textAlign: "center",
                fontWeight: 600,
              }}
            >
              {successMsg}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
