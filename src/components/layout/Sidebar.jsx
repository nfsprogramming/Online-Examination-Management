import {
  LayoutDashboard,
  BookOpen,
  FileQuestion,
  CheckSquare,
  Trophy,
  BarChart2,
  Settings,
  LogOut,
  Shield,
  GraduationCap,
} from "lucide-react";

export const NAV_GROUPS = [
  {
    groupLabel: "Overview",
    items: [
      { id: "overview", label: "Dashboard", icon: LayoutDashboard },
    ],
  },
  {
    groupLabel: "Assessments",
    items: [
      { id: "exams", label: "Examinations", icon: BookOpen, badge: "3 Active" },
      { id: "questions", label: "Question Bank", icon: FileQuestion, badge: "27 Qs" },
      { id: "results", label: "Results & Records", icon: CheckSquare },
    ],
  },
  {
    groupLabel: "Cohort",
    items: [
      { id: "leaderboard", label: "Student Directory", icon: Trophy },
      { id: "analytics", label: "Performance Analytics", icon: BarChart2 },
    ],
  },
  {
    groupLabel: "System",
    items: [
      { id: "settings", label: "Preferences & Security", icon: Settings },
    ],
  },
];

export default function Sidebar({
  activeTab,
  onSelectTab,
  user,
  onLogout,
}) {
  const initials = (user?.name || "Candidate")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <aside className="desktop-sidebar" aria-label="Sidebar navigation">
      {/* Brand Header */}
      <div className="sidebar-header">
        <div className="brand-logo-icon" aria-hidden="true">
          <BookOpen size={18} color="#FFFFFF" />
        </div>
        <div className="brand-info">
          <span className="brand-title">ExamiNation</span>
          <span className="brand-subtitle">Academic SaaS</span>
        </div>
      </div>

      {/* Main Navigation Items with Groups */}
      <nav className="sidebar-nav">
        {NAV_GROUPS.map((group, gIdx) => (
          <div key={group.groupLabel} style={{ marginBottom: 12 }}>
            <span className="sidebar-nav-label">{group.groupLabel}</span>
            <div style={{ display: "flex", flexDirection: "column", gap: 3, marginTop: 4 }}>
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-item-${item.id}`}
                    className={`sidebar-link ${isActive ? "active" : ""}`}
                    onClick={() => onSelectTab(item.id)}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <Icon
                      size={18}
                      color={isActive ? "var(--primary-brand)" : "var(--text-muted)"}
                    />
                    <span>{item.label}</span>
                    {item.badge && <span className="sidebar-badge">{item.badge}</span>}
                  </button>
                );
              })}
            </div>
            {gIdx < NAV_GROUPS.length - 1 && <div className="sidebar-divider" />}
          </div>
        ))}
      </nav>

      {/* User Profile Footer */}
      <div className="sidebar-user">
        {user?.photoURL ? (
          <img
            src={user.photoURL}
            alt={user.name}
            style={{
              width: 36,
              height: 36,
              borderRadius: "var(--radius-md)",
              objectFit: "cover",
              border: "1px solid var(--border-color)",
              flexShrink: 0,
            }}
          />
        ) : (
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "var(--radius-md)",
              background: "var(--bg-hover)", /* Section 8: Avatar #1E293B */
              border: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
              fontWeight: 800,
              color: "var(--accent-light)",
              flexShrink: 0,
            }}
          >
            {initials}
          </div>
        )}

        <div className="user-meta-col">
          <span className="user-meta-name" title={user?.name}>
            {user?.name || "Candidate"}
          </span>
          <span className="user-meta-role">
            {user?.role === "admin" ? (
              <>
                <Shield size={12} color="var(--error)" /> Faculty Admin
              </>
            ) : (
              <>
                <GraduationCap size={12} color="var(--primary-brand)" /> Candidate
              </>
            )}
          </span>
        </div>

        <button
          id="sidebar-logout-btn"
          className="icon-button"
          onClick={onLogout}
          title="Sign Out"
          aria-label="Sign Out"
          style={{ width: 34, height: 34 }}
        >
          <LogOut size={15} />
        </button>
      </div>
    </aside>
  );
}
