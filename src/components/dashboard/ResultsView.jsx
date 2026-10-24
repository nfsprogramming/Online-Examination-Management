import {
  Trophy,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldAlert,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import EmptyState from "../common/EmptyState";

export default function ResultsView({
  resultsHistory = [],
  onStartExam,
  exams,
}) {
  const hasResults = resultsHistory && resultsHistory.length > 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* ── Header ── */}
      <div
        style={{
          background: "var(--surface-main)",
          border: "1px solid var(--border-color)",
          borderRadius: "var(--radius-lg)",
          padding: "24px 28px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
          boxShadow: "var(--shadow-xs)",
        }}
      >
        <div>
          <h2 style={{ fontSize: 19, fontWeight: 800, color: "var(--text-primary)" }}>
            Academic Examination History
          </h2>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 2 }}>
            Review official transcripts, passing percentages, and proctored verification records.
          </p>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <div
            style={{
              background: "var(--surface-secondary)",
              border: "1px solid var(--border-color)",
              borderRadius: "var(--radius-md)",
              padding: "7px 14px",
              display: "flex",
              alignItems: "center",
              gap: 7,
              fontSize: 12.5,
              fontWeight: 700,
              color: "var(--primary-brand)",
            }}
          >
            <Sparkles size={15} />
            <span>{resultsHistory.length} Recorded Attempts</span>
          </div>
        </div>
      </div>

      {!hasResults ? (
        <EmptyState
          icon={Trophy}
          title="No completed examinations yet"
          description="You haven't submitted any examinations in this session. Take an examination now to generate your verified scorecard."
          actionLabel="Browse Available Exams"
          onAction={() => onStartExam(exams[0])}
        />
      ) : (
        <div className="table-container">
          <table className="responsive-table" aria-label="Examination Results History">
            <thead>
              <tr>
                <th>Examination</th>
                <th>Score</th>
                <th>Percentage</th>
                <th>Grade</th>
                <th>Status</th>
                <th>Duration</th>
                <th>Integrity</th>
              </tr>
            </thead>
            <tbody>
              {resultsHistory.map((item, idx) => {
                const pct = item.pct ?? Math.round((item.score / item.totalMarks) * 100);
                const isPassed = item.passed ?? pct >= 60;
                const grade =
                  pct >= 90 ? "A+" : pct >= 80 ? "A" : pct >= 70 ? "B" : pct >= 60 ? "C" : "F";

                return (
                  <tr key={idx}>
                    <td>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <strong style={{ color: "var(--text-primary)", fontSize: 13.5 }}>
                          {item.examTitle}
                        </strong>
                        <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
                          Session ID #{String(idx + 1).padStart(4, "0")}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span
                        style={{
                          fontFamily: "var(--mono)",
                          fontWeight: 700,
                          fontSize: 14,
                          color: "var(--text-primary)",
                        }}
                      >
                        {item.score} / {item.totalMarks}
                      </span>
                    </td>
                    <td>
                      <span
                        style={{
                          fontFamily: "var(--mono)",
                          fontWeight: 700,
                          fontSize: 13.5,
                          color: isPassed ? "var(--success)" : "var(--error)",
                        }}
                      >
                        {pct}%
                      </span>
                    </td>
                    <td>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "2px 8px",
                          borderRadius: "var(--radius-xs)",
                          background: "var(--surface-secondary)",
                          color: "var(--text-primary)",
                          fontWeight: 800,
                          fontFamily: "var(--mono)",
                          fontSize: 11.5,
                          border: "1px solid var(--border-color)",
                        }}
                      >
                        {grade}
                      </span>
                    </td>
                    <td>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          padding: "3px 9px",
                          borderRadius: "var(--radius-full)",
                          fontSize: 11,
                          fontWeight: 700,
                          background: isPassed ? "var(--success-bg)" : "var(--error-bg)",
                          border: `1px solid ${isPassed ? "var(--success-border)" : "var(--error-border)"}`,
                          color: isPassed ? "var(--success)" : "var(--error)",
                        }}
                      >
                        {isPassed ? <CheckCircle2 size={11} /> : <XCircle size={11} />}
                        {isPassed ? "Passed" : "Not Passed"}
                      </span>
                    </td>
                    <td>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          fontSize: 12,
                          color: "var(--text-secondary)",
                          fontFamily: "var(--mono)",
                        }}
                      >
                        <Clock size={12} />
                        {Math.floor(item.timeTaken / 60)}m {item.timeTaken % 60}s
                      </span>
                    </td>
                    <td>
                      {item.violations > 0 ? (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                            color: "var(--error)",
                            fontSize: 12,
                            fontWeight: 600,
                          }}
                        >
                          <ShieldAlert size={12} /> {item.violations} warning{item.violations > 1 ? "s" : ""}
                        </span>
                      ) : (
                        <span
                          style={{
                            color: "var(--success)",
                            fontSize: 12,
                            fontWeight: 600,
                          }}
                        >
                          Verified Clean
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
