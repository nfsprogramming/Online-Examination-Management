import { motion, AnimatePresence } from "framer-motion";
import { Bell, CheckCircle2, ShieldAlert, Sparkles, X } from "lucide-react";

export const SAMPLE_NOTIFICATIONS = [
  {
    id: "notif-1",
    title: "Session Initialized",
    desc: "Academic integrity monitoring active for this session.",
    time: "Just now",
    type: "info",
    icon: ShieldAlert,
    unread: true,
  },
  {
    id: "notif-2",
    title: "Web Dev Exam Live",
    desc: "Web Development Essentials exam is open for submissions.",
    time: "15 min ago",
    type: "success",
    icon: CheckCircle2,
    unread: true,
  },
  {
    id: "notif-3",
    title: "Global Rank Leaderboard",
    desc: "Rankings updated with latest exam completions.",
    time: "1 hour ago",
    type: "system",
    icon: Sparkles,
    unread: false,
  },
];

export default function NotificationsPopover({
  isOpen,
  onClose,
  notifications = SAMPLE_NOTIFICATIONS,
  onClear,
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 140,
            }}
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.16 }}
            style={{
              position: "absolute",
              right: 0,
              top: "calc(100% + 12px)",
              width: 340,
              background: "var(--surface-primary)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-lg)",
              boxShadow: "var(--shadow-lg)",
              zIndex: 150,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "14px 18px",
                borderBottom: "1px solid var(--border-subtle)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "var(--surface-secondary)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Bell size={16} color="var(--accent-light)" />
                <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>
                  Notifications
                </span>
              </div>
              <button
                onClick={onClose}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                  display: "flex",
                  padding: 4,
                }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ maxHeight: 320, overflowY: "auto", padding: "8px 10px" }}>
              {notifications.length === 0 ? (
                <div
                  style={{
                    padding: "28px 16px",
                    textAlign: "center",
                    color: "var(--text-muted)",
                    fontSize: 13,
                  }}
                >
                  No new notifications
                </div>
              ) : (
                notifications.map((item) => {
                  const Icon = item.icon || Bell;
                  return (
                    <div
                      key={item.id}
                      style={{
                        padding: "10px 12px",
                        borderRadius: "var(--radius-md)",
                        display: "flex",
                        gap: 12,
                        alignItems: "flex-start",
                        background: item.unread ? "rgba(99, 102, 241, 0.05)" : "transparent",
                        marginBottom: 4,
                        transition: "background 0.15s ease",
                      }}
                    >
                      <div
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: "var(--radius-sm)",
                          background:
                            item.type === "info"
                              ? "var(--info-bg)"
                              : item.type === "success"
                              ? "var(--success-bg)"
                              : "var(--surface-elevated)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color:
                            item.type === "info"
                              ? "var(--info)"
                              : item.type === "success"
                              ? "var(--success)"
                              : "var(--accent-light)",
                          flexShrink: 0,
                          marginTop: 2,
                        }}
                      >
                        <Icon size={15} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: "var(--text-primary)",
                            marginBottom: 2,
                          }}
                        >
                          {item.title}
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            color: "var(--text-secondary)",
                            lineHeight: 1.4,
                            marginBottom: 4,
                          }}
                        >
                          {item.desc}
                        </div>
                        <span style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--mono)" }}>
                          {item.time}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {notifications.length > 0 && (
              <div
                style={{
                  padding: "10px 16px",
                  borderTop: "1px solid var(--border-subtle)",
                  textAlign: "center",
                  background: "var(--surface-secondary)",
                }}
              >
                <button
                  onClick={onClear}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--accent-light)",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Mark all as read
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
