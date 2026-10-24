import { useState, useMemo } from "react";
import {
  Trophy,
  Search,
  Radio,
  CheckCircle2,
  Clock,
  ChevronRight,
  Filter,
} from "lucide-react";
import EmptyState from "../common/EmptyState";

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

export default function StudentsView({
  leaderboardEntries = [],
  isLive = false,
  liveCount = 0,
}) {
  const [search, setSearch] = useState("");
  const [examFilter, setExamFilter] = useState("All");

  const examsList = [
    "All",
    ...new Set(
      leaderboardEntries
        .map((e) => e.examTitle || e.exam)
        .filter(Boolean)
    ),
  ];

  const filteredEntries = useMemo(() => {
    return leaderboardEntries.filter((item) => {
      const name = item.displayName || item.name || "";
      const examName = item.examTitle || item.exam || "";
      const matchSearch =
        !search ||
        name.toLowerCase().includes(search.toLowerCase()) ||
        examName.toLowerCase().includes(search.toLowerCase());
      const matchExam =
        examFilter === "All" || examName === examFilter;
      return matchSearch && matchExam;
    });
  }, [leaderboardEntries, search, examFilter]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* ── Search & Filter Bar ── */}
      <div
        style={{
          background: "var(--surface-main)",
          border: "1px solid var(--border-color)",
          borderRadius: "var(--radius-lg)",
          padding: "20px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
          boxShadow: "var(--shadow-xs)",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <h2 style={{ fontSize: 19, fontWeight: 800, color: "var(--text-primary)" }}>
              Student Directory & Leaderboard
            </h2>
            {isLive && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "3px 9px",
                  borderRadius: "var(--radius-full)",
                  fontSize: 10.5,
                  fontWeight: 700,
                  background: "var(--success-bg)",
                  border: "1px solid var(--success-border)",
                  color: "var(--success)",
                  fontFamily: "var(--mono)",
                }}
              >
                <Radio size={11} /> LIVE SYNC
              </span>
            )}
          </div>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 2 }}>
            Real-time verified candidate standings across all examination sessions.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          {/* Exam Filter Dropdown */}
          <select
            value={examFilter}
            onChange={(e) => setExamFilter(e.target.value)}
            className="input-field"
            style={{ minHeight: 38, width: 200, paddingLeft: 12, fontSize: 13 }}
          >
            {examsList.map((e) => (
              <option key={e} value={e}>
                {e === "All" ? "All Examinations" : e}
              </option>
            ))}
          </select>

          {/* Search */}
          <div style={{ position: "relative", width: 230 }}>
            <Search
              size={14}
              style={{
                position: "absolute",
                left: 11,
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-muted)",
              }}
            />
            <input
              type="text"
              placeholder="Search candidates..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field"
              style={{ minHeight: 38, fontSize: 13, paddingLeft: 34 }}
            />
          </div>
        </div>
      </div>

      {filteredEntries.length === 0 ? (
        <EmptyState
          title="No candidates found"
          description="Try clearing your search query or selecting all examinations."
          actionLabel="Reset Search"
          onAction={() => {
            setSearch("");
            setExamFilter("All");
          }}
        />
      ) : (
        <>
          {/* Desktop Table View (>= 768px) */}
          <div className="table-container desktop-table-only">
            <table className="responsive-table" aria-label="Student Standings">
              <thead>
                <tr>
                  <th style={{ width: 70 }}>Rank</th>
                  <th>Candidate</th>
                  <th>Examination Subject</th>
                  <th>Score</th>
                  <th>Accuracy</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredEntries.map((entry, idx) => {
                  const score = entry.score;
                  const total = entry.totalMarks || entry.total || 50;
                  const pct = entry.pct ?? Math.round((score / total) * 100);
                  const isPassed = pct >= 60;
                  const rank = idx + 1;

                  return (
                    <tr key={entry.id || idx}>
                      <td>
                        <span
                          style={{
                            fontSize: rank <= 3 ? 16 : 12.5,
                            fontWeight: 800,
                            fontFamily: "var(--mono)",
                            color:
                              rank === 1
                                ? "var(--warning)"
                                : rank === 2
                                ? "var(--text-secondary)"
                                : rank === 3
                                ? "var(--warning)"
                                : "var(--text-muted)",
                          }}
                        >
                          {rank === 1
                            ? "🥇 #1"
                            : rank === 2
                            ? "🥈 #2"
                            : rank === 3
                            ? "🥉 #3"
                            : `#${rank}`}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <Avatar
                            name={entry.displayName || entry.name}
                            photoURL={entry.photoURL}
                            idx={rank}
                          />
                          <div>
                            <div
                              style={{
                                fontSize: 13.5,
                                fontWeight: 700,
                                color: "var(--text-primary)",
                              }}
                            >
                              {entry.displayName || entry.name || "Candidate"}
                            </div>
                            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                              ID #{String(idx + 100).padStart(5, "0")}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontSize: 13, color: "var(--text-primary)" }}>
                          {entry.examTitle || entry.exam || "Examination"}
                        </span>
                      </td>
                      <td>
                        <span
                          style={{
                            fontFamily: "var(--mono)",
                            fontWeight: 800,
                            fontSize: 14,
                            color: "var(--success)",
                          }}
                        >
                          {score}{" "}
                          <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
                            / {total}
                          </span>
                        </span>
                      </td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div
                            style={{
                              width: 60,
                              height: 5,
                              background: "var(--surface-secondary)",
                              borderRadius: 3,
                              overflow: "hidden",
                              border: "1px solid var(--border-color)",
                            }}
                          >
                            <div
                              style={{
                                width: `${pct}%`,
                                height: "100%",
                                background: isPassed
                                  ? "var(--success)"
                                  : "var(--error)",
                              }}
                            />
                          </div>
                          <span
                            style={{
                              fontFamily: "var(--mono)",
                              fontSize: 12,
                              fontWeight: 700,
                              color: "var(--text-secondary)",
                            }}
                          >
                            {pct}%
                          </span>
                        </div>
                      </td>
                      <td>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                            padding: "3px 8px",
                            borderRadius: "var(--radius-full)",
                            fontSize: 11,
                            fontWeight: 700,
                            background: isPassed
                              ? "var(--success-bg)"
                              : "var(--error-bg)",
                            border: `1px solid ${
                              isPassed ? "var(--success-border)" : "var(--error-border)"
                            }`,
                            color: isPassed ? "var(--success)" : "var(--error)",
                          }}
                        >
                          {isPassed ? <CheckCircle2 size={11} /> : null}
                          {isPassed ? "Passed" : "Incomplete"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card Layout (< 768px) */}
          <div className="mobile-cards-only" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filteredEntries.map((entry, idx) => {
              const score = entry.score;
              const total = entry.totalMarks || entry.total || 50;
              const pct = entry.pct ?? Math.round((score / total) * 100);
              const isPassed = pct >= 60;
              const rank = idx + 1;

              return (
                <div
                  key={entry.id || idx}
                  style={{
                    background: "var(--surface-main)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "var(--radius-md)",
                    padding: "12px 14px",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    boxShadow: "var(--shadow-xs)",
                  }}
                >
                  <div
                    style={{
                      width: 28,
                      textAlign: "center",
                      fontFamily: "var(--mono)",
                      fontSize: 13,
                      fontWeight: 800,
                      color:
                        rank === 1
                          ? "var(--warning)"
                          : rank === 2
                          ? "var(--text-secondary)"
                          : rank === 3
                          ? "var(--warning)"
                          : "var(--text-muted)",
                    }}
                  >
                    {rank <= 3 ? ["🥇", "🥈", "🥉"][rank - 1] : `#${rank}`}
                  </div>
                  <Avatar
                    name={entry.displayName || entry.name}
                    photoURL={entry.photoURL}
                    idx={rank}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 13.5,
                        fontWeight: 700,
                        color: "var(--text-primary)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {entry.displayName || entry.name || "Candidate"}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "var(--text-muted)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {entry.examTitle || entry.exam || "Exam"}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 800,
                        fontFamily: "var(--mono)",
                        color: "var(--success)",
                      }}
                    >
                      {score}/{total}
                    </div>
                    <span
                      style={{
                        fontSize: 11,
                        color: isPassed ? "var(--success)" : "var(--error)",
                        fontWeight: 700,
                      }}
                    >
                      {pct}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-table-only { display: none !important; }
          .mobile-cards-only { display: flex !important; }
        }
        @media (min-width: 769px) {
          .desktop-table-only { display: block !important; }
          .mobile-cards-only { display: none !important; }
        }
      `}</style>
    </div>
  );
}
