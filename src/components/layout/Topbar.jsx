import { useState } from "react";
import { Search, Bell, Radio, User, LogOut, Shield, Sun, Moon, ChevronRight } from "lucide-react";
import NotificationsPopover from "./NotificationsPopover";

export default function Topbar({
  pageTitle,
  searchQuery,
  onSearchChange,
  liveCount = 0,
  user,
  onLogout,
  theme,
  toggleTheme,
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const initials = (user?.name || "User")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="topbar" aria-label="Page topbar">
      {/* Page Title & Breadcrumb */}
      <div className="topbar-left">
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--text-muted)" }}>
          <span>Portal</span>
          <ChevronRight size={13} />
        </div>
        <h1 className="topbar-page-title">{pageTitle}</h1>
      </div>

      {/* Global Search */}
      <div className="topbar-search">
        <Search size={15} className="topbar-search-icon" />
        <input
          id="global-search-input"
          type="search"
          className="topbar-search-input"
          placeholder="Search exams, topics..."
          value={searchQuery}
          onChange={(e) => onSearchChange?.(e.target.value)}
          aria-label="Search exams and topics"
        />
      </div>

      {/* Action Controls */}
      <div className="topbar-right">
        {/* Live Active Students Counter */}
        {liveCount > 0 ? (
          <div className="badge-live-pill" title={`${liveCount} candidates currently taking an examination`}>
            <span className="badge-live-dot" />
            <span>{liveCount} Live</span>
          </div>
        ) : (
          <div
            className="badge-live-pill"
            style={{
              background: "var(--surface-secondary)",
              borderColor: "var(--border-color)",
              color: "var(--text-secondary)",
            }}
          >
            <Radio size={12} color="var(--primary-brand)" />
            <span>System Active</span>
          </div>
        )}

        {/* Theme Switcher Toggle */}
        {toggleTheme && (
          <button
            id="topbar-theme-toggle"
            className="icon-button"
            onClick={toggleTheme}
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
          </button>
        )}

        {/* Notifications */}
        <div style={{ position: "relative" }}>
          <button
            id="notifications-toggle-btn"
            className="icon-button"
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="View notifications"
            aria-expanded={showNotifications}
          >
            <Bell size={17} />
            <span className="notification-dot" />
          </button>

          <NotificationsPopover
            isOpen={showNotifications}
            onClose={() => setShowNotifications(false)}
            onClear={() => setShowNotifications(false)}
          />
        </div>

        {/* User profile dropdown trigger */}
        <div style={{ position: "relative" }}>
          <button
            id="user-profile-menu-btn"
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            aria-label="User account menu"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "var(--surface-secondary)",
              border: "1px solid var(--border-color)",
              borderRadius: "var(--radius-md)",
              padding: "4px 10px 4px 4px",
              cursor: "pointer",
              transition: "all 0.18s ease",
            }}
          >
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.name}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "var(--radius-sm)",
                  objectFit: "cover",
                }}
              />
            ) : (
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "var(--radius-sm)",
                  background: "var(--bg-hover)", /* Section 8: Avatar #1E293B */
                  border: "1px solid var(--border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  fontWeight: 800,
                  color: "var(--accent-light)",
                }}
              >
                {initials}
              </div>
            )}
            <div style={{ textAlign: "left", display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  fontSize: 12.5,
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  maxWidth: 96,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  lineHeight: 1.2,
                }}
              >
                {user?.name?.split(" ")[0] || "Candidate"}
              </span>
              <span
                style={{
                  fontSize: 10,
                  color: "var(--text-muted)",
                  textTransform: "capitalize",
                }}
              >
                {user?.role === "admin" ? "Faculty" : "Student"}
              </span>
            </div>
          </button>

          {showUserDropdown && (
            <>
              <div
                style={{ position: "fixed", inset: 0, zIndex: 140 }}
                onClick={() => setShowUserDropdown(false)}
              />
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: "calc(100% + 8px)",
                  width: 230,
                  background: "var(--surface-main)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "var(--radius-lg)",
                  boxShadow: "var(--shadow-lg)",
                  padding: 8,
                  zIndex: 150,
                }}
              >
                <div
                  style={{
                    padding: "10px 12px",
                    borderBottom: "1px solid var(--border-color)",
                    marginBottom: 6,
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>
                    {user?.name || "Candidate"}
                  </div>
                  <div style={{ fontSize: 11.5, color: "var(--text-muted)", marginTop: 2 }}>
                    {user?.email || (user?.role === "admin" ? "admin@examination.internal" : "student@examination.internal")}
                  </div>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      marginTop: 8,
                      fontSize: 10.5,
                      fontWeight: 700,
                      color: user?.role === "admin" ? "var(--error)" : "var(--primary-brand)",
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                    }}
                  >
                    {user?.role === "admin" ? <Shield size={11} /> : <User size={11} />}
                    {user?.role || "Student"} Role
                  </div>
                </div>

                <button
                  id="dropdown-logout-btn"
                  onClick={() => {
                    setShowUserDropdown(false);
                    onLogout();
                  }}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "9px 12px",
                    borderRadius: "var(--radius-md)",
                    background: "none",
                    border: "none",
                    color: "var(--error)",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "background 0.15s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--error-bg)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                >
                  <LogOut size={15} /> Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
