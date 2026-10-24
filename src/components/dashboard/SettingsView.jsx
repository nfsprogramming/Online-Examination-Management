import {
  User,
  Shield,
  Keyboard,
  Sun,
  Moon,
  CheckCircle2,
  Lock,
  LogOut,
  Palette,
} from "lucide-react";

export default function SettingsView({ user, onLogout, theme, toggleTheme }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 860 }}>
      {/* ── Profile Information ── */}
      <div
        style={{
          background: "var(--surface-main)",
          border: "1px solid var(--border-color)",
          borderRadius: "var(--radius-lg)",
          padding: "24px 28px",
          boxShadow: "var(--shadow-xs)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
          <User size={18} color="var(--primary-brand)" />
          <h3 style={{ fontSize: 17, fontWeight: 800, color: "var(--text-primary)" }}>
            Academic Profile Information
          </h3>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
          }}
        >
          <div>
            <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
              Full Name
            </span>
            <div style={{ fontSize: 14.5, fontWeight: 700, color: "var(--text-primary)", marginTop: 4 }}>
              {user?.name || "Student Candidate"}
            </div>
          </div>

          <div>
            <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
              Institutional Email
            </span>
            <div style={{ fontSize: 14.5, fontWeight: 600, color: "var(--text-secondary)", marginTop: 4 }}>
              {user?.email || "student@examination.internal"}
            </div>
          </div>

          <div>
            <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
              Role Designation
            </span>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                marginTop: 4,
                padding: "3px 10px",
                borderRadius: "var(--radius-full)",
                background: user?.role === "admin" ? "var(--error-bg)" : "var(--surface-active)",
                color: user?.role === "admin" ? "var(--error)" : "var(--primary-brand)",
                fontSize: 11.5,
                fontWeight: 700,
                textTransform: "uppercase",
              }}
            >
              {user?.role === "admin" ? <Shield size={12} /> : <CheckCircle2 size={12} />}
              {user?.role || "Student Candidate"}
            </div>
          </div>

          <div>
            <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
              Security Status
            </span>
            <div style={{ fontSize: 13, color: "var(--success)", fontWeight: 700, marginTop: 4 }}>
              Active Verified Session
            </div>
          </div>
        </div>
      </div>

      {/* ── Appearance & Interface Theme ── */}
      <div
        style={{
          background: "var(--surface-main)",
          border: "1px solid var(--border-color)",
          borderRadius: "var(--radius-lg)",
          padding: "24px 28px",
          boxShadow: "var(--shadow-xs)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <Palette size={18} color="var(--primary-brand)" />
          <h3 style={{ fontSize: 17, fontWeight: 800, color: "var(--text-primary)" }}>
            Interface Theme & Appearance
          </h3>
        </div>

        <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 16 }}>
          Choose your preferred theme. Both Light and Dark themes maintain strict academic readability and contrast standards.
        </p>

        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={() => {
              if (theme === "dark") toggleTheme?.();
            }}
            style={{
              flex: 1,
              minWidth: 180,
              padding: "14px 18px",
              borderRadius: "var(--radius-md)",
              border: `2px solid ${theme === "light" ? "var(--primary-brand)" : "var(--border-color)"}`,
              background: theme === "light" ? "var(--surface-active)" : "var(--surface-secondary)",
              color: "var(--text-primary)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 12,
              transition: "all 0.18s ease",
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "var(--radius-sm)",
                background: "#FFFFFF",
                border: "1px solid #E2E8F0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#4F46E5",
              }}
            >
              <Sun size={18} />
            </div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: 13.5, fontWeight: 700 }}>Academic Light (Default)</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Navy & indigo on crisp slate</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              if (theme !== "dark") toggleTheme?.();
            }}
            style={{
              flex: 1,
              minWidth: 180,
              padding: "14px 18px",
              borderRadius: "var(--radius-md)",
              border: `2px solid ${theme === "dark" ? "var(--primary-brand)" : "var(--border-color)"}`,
              background: theme === "dark" ? "var(--surface-active)" : "var(--surface-secondary)",
              color: "var(--text-primary)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 12,
              transition: "all 0.18s ease",
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "var(--radius-sm)",
                background: "#111827",
                border: "1px solid #334155",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#818CF8",
              }}
            >
              <Moon size={18} />
            </div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: 13.5, fontWeight: 700 }}>Academic Dark</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Low-light high-contrast mode</div>
            </div>
          </button>
        </div>
      </div>

      {/* ── Keyboard Shortcuts Guide ── */}
      <div
        style={{
          background: "var(--surface-main)",
          border: "1px solid var(--border-color)",
          borderRadius: "var(--radius-lg)",
          padding: "24px 28px",
          boxShadow: "var(--shadow-xs)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <Keyboard size={18} color="var(--primary-brand)" />
          <div>
            <h3 style={{ fontSize: 17, fontWeight: 800, color: "var(--text-primary)" }}>
              Examination Keyboard Shortcuts
            </h3>
            <p style={{ fontSize: 12.5, color: "var(--text-secondary)", marginTop: 2 }}>
              Fast, accessibility-compliant keybindings active during examination sessions.
            </p>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
            gap: 10,
          }}
        >
          {[
            { key: "1 – 4", desc: "Select Option A, B, C, or D (MCQ)" },
            { key: "T / F", desc: "Select True or False (True/False)" },
            { key: "→ / ↓", desc: "Navigate to Next question" },
            { key: "← / ↑", desc: "Navigate to Previous question" },
            { key: "F", desc: "Flag / Unflag for review" },
            { key: "Enter", desc: "Confirm selection or jump" },
          ].map((sc) => (
            <div
              key={sc.key}
              style={{
                background: "var(--surface-secondary)",
                border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-md)",
                padding: "10px 14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 10,
              }}
            >
              <span style={{ fontSize: 12.5, color: "var(--text-secondary)" }}>{sc.desc}</span>
              <kbd
                style={{
                  background: "var(--surface-main)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "var(--radius-xs)",
                  padding: "3px 7px",
                  fontSize: 11.5,
                  fontWeight: 700,
                  fontFamily: "var(--mono)",
                  color: "var(--primary-brand)",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                }}
              >
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>

      {/* ── Anti-Cheat Integrity Specifications ── */}
      <div
        style={{
          background: "var(--surface-main)",
          border: "1px solid var(--border-color)",
          borderRadius: "var(--radius-lg)",
          padding: "24px 28px",
          boxShadow: "var(--shadow-xs)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <Shield size={18} color="var(--error)" />
          <h3 style={{ fontSize: 17, fontWeight: 800, color: "var(--text-primary)" }}>
            Academic Integrity Rules & Anti-Cheat
          </h3>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            {
              title: "Tab Switching & Focus Monitoring",
              desc: "Switching browser tabs or minimizing the examination window triggers a violation. 3 recorded violations result in automated session termination.",
            },
            {
              title: "Continuous LocalStorage Auto-Save",
              desc: "All entered responses and flagged question states are instantly persisted to local browser storage, ensuring uninterrupted recovery in case of connection disruption.",
            },
            {
              title: "Automated Strict Countdown",
              desc: "Exams auto-submit the instant the countdown expires. Server-side timestamp verification ensures fair, uniform duration constraints.",
            },
          ].map((rule) => (
            <div
              key={rule.title}
              style={{
                background: "var(--surface-secondary)",
                border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-md)",
                padding: "12px 16px",
              }}
            >
              <div style={{ fontSize: 13.5, fontWeight: 700, color: "var(--text-primary)", marginBottom: 3 }}>
                {rule.title}
              </div>
              <div style={{ fontSize: 12.5, color: "var(--text-secondary)", lineHeight: 1.45 }}>
                {rule.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Sign Out Button ── */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          onClick={onLogout}
          className="btn btn-danger"
          style={{ gap: 8 }}
        >
          <LogOut size={16} /> Sign Out of Portal
        </button>
      </div>
    </div>
  );
}
