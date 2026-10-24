import { useState, useMemo } from "react";
import {
  Search,
  BookOpen,
  Clock,
  Star,
  Users,
  BarChart2,
  ChevronRight,
  LayoutGrid,
  List,
} from "lucide-react";
import EmptyState from "../common/EmptyState";

export default function ExamsView({ exams, onSelectExam, searchQuery = "" }) {
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [localSearch, setLocalSearch] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "table"

  const effectiveSearch = localSearch || searchQuery;

  const subjects = ["All", ...new Set(exams.map((e) => e.subject))];
  const difficulties = ["All", "Beginner", "Intermediate", "Advanced"];

  const filteredExams = useMemo(() => {
    return exams.filter((exam) => {
      const matchSubject =
        subjectFilter === "All" || exam.subject === subjectFilter;
      const matchDifficulty =
        difficultyFilter === "All" || exam.difficulty === difficultyFilter;
      const matchQuery =
        !effectiveSearch ||
        exam.title.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
        exam.subject.toLowerCase().includes(effectiveSearch.toLowerCase());
      return matchSubject && matchDifficulty && matchQuery;
    });
  }, [exams, subjectFilter, difficultyFilter, effectiveSearch]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* ── Filters & Search Header ── */}
      <div
        style={{
          background: "var(--surface-main)",
          border: "1px solid var(--border-color)",
          borderRadius: "var(--radius-lg)",
          padding: "20px 24px",
          display: "flex",
          flexDirection: "column",
          gap: 16,
          boxShadow: "var(--shadow-xs)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div>
            <h2 style={{ fontSize: 19, fontWeight: 800, color: "var(--text-primary)" }}>
              Examination Catalog
            </h2>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 2 }}>
              Explore certified examinations, track requirements, and begin assessment.
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* View switcher */}
            <div
              style={{
                display: "inline-flex",
                background: "var(--surface-secondary)",
                padding: 3,
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-color)",
              }}
            >
              <button
                onClick={() => setViewMode("grid")}
                aria-label="Grid view"
                style={{
                  background: viewMode === "grid" ? "var(--surface-main)" : "transparent",
                  border: "none",
                  borderRadius: "var(--radius-sm)",
                  padding: "5px 8px",
                  cursor: "pointer",
                  color: viewMode === "grid" ? "var(--primary-brand)" : "var(--text-muted)",
                  display: "flex",
                  boxShadow: viewMode === "grid" ? "var(--shadow-xs)" : "none",
                }}
              >
                <LayoutGrid size={16} />
              </button>
              <button
                onClick={() => setViewMode("table")}
                aria-label="Table view"
                style={{
                  background: viewMode === "table" ? "var(--surface-main)" : "transparent",
                  border: "none",
                  borderRadius: "var(--radius-sm)",
                  padding: "5px 8px",
                  cursor: "pointer",
                  color: viewMode === "table" ? "var(--primary-brand)" : "var(--text-muted)",
                  display: "flex",
                  boxShadow: viewMode === "table" ? "var(--shadow-xs)" : "none",
                }}
              >
                <List size={16} />
              </button>
            </div>

            <div style={{ position: "relative", width: 260 }}>
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
                placeholder="Search by title or topic..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="input-field"
                style={{ minHeight: 38, fontSize: 13, paddingLeft: 34 }}
              />
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
            borderTop: "1px solid var(--border-color)",
            paddingTop: 14,
          }}
        >
          {/* Subject Pills */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11.5, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
              Subject:
            </span>
            {subjects.map((sub) => (
              <button
                key={sub}
                onClick={() => setSubjectFilter(sub)}
                style={{
                  padding: "4px 10px",
                  borderRadius: "var(--radius-md)",
                  border: `1px solid ${
                    subjectFilter === sub
                      ? "var(--primary-brand)"
                      : "var(--border-color)"
                  }`,
                  background:
                    subjectFilter === sub
                      ? "var(--surface-active)"
                      : "var(--surface-secondary)",
                  color:
                    subjectFilter === sub
                      ? "var(--primary-brand)"
                      : "var(--text-secondary)",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {sub}
              </button>
            ))}
          </div>

          {/* Difficulty Pills */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11.5, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
              Difficulty:
            </span>
            {difficulties.map((diff) => (
              <button
                key={diff}
                onClick={() => setDifficultyFilter(diff)}
                style={{
                  padding: "4px 10px",
                  borderRadius: "var(--radius-md)",
                  border: `1px solid ${
                    difficultyFilter === diff
                      ? "var(--primary-brand)"
                      : "var(--border-color)"
                  }`,
                  background:
                    difficultyFilter === diff
                      ? "var(--surface-active)"
                      : "var(--surface-secondary)",
                  color:
                    difficultyFilter === diff
                      ? "var(--primary-brand)"
                      : "var(--text-secondary)",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content: Empty State, Grid, or Table ── */}
      {filteredExams.length === 0 ? (
        <EmptyState
          title="No examinations match your criteria"
          description="Try selecting another subject, removing difficulty restrictions, or clearing search text."
          actionLabel="Reset Filters"
          onAction={() => {
            setSubjectFilter("All");
            setDifficultyFilter("All");
            setLocalSearch("");
          }}
        />
      ) : viewMode === "grid" ? (
        <div className="exam-grid">
          {filteredExams.map((exam) => (
            <article key={exam.id} className="exam-card">
              <div className="card-top">
                <div className="card-icon-wrap" aria-hidden="true">
                  {exam.icon}
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <span className={`diff-badge diff-${exam.difficulty}`}>
                    {exam.difficulty}
                  </span>
                  <span className="badge-status live">
                    <span className="badge-live-dot" /> Live
                  </span>
                </div>
              </div>

              <div className="card-subject">{exam.subject}</div>
              <h3 className="card-title">{exam.title}</h3>

              <div className="card-meta-row">
                <span className="meta-chip">
                  <Clock size={12} /> {exam.duration} Min
                </span>
                <span className="meta-chip">
                  <BookOpen size={12} /> {exam.questions.length} Questions
                </span>
                <span className="meta-chip">
                  <Star size={12} /> {exam.totalMarks} Marks
                </span>
                <span className="meta-chip">
                  Pass: {exam.passMark}/{exam.totalMarks}
                </span>
              </div>

              <div className="card-meta-row" style={{ marginTop: "auto" }}>
                <span className="meta-chip" style={{ fontSize: 11 }}>
                  <Users size={11} /> {exam.attempts.toLocaleString()} candidates
                </span>
                <span className="meta-chip" style={{ fontSize: 11 }}>
                  <BarChart2 size={11} /> avg score {exam.avgScore}%
                </span>
              </div>

              <div className="card-footer">
                <div className="pass-info">
                  Passing: <strong>{Math.round((exam.passMark / exam.totalMarks) * 100)}%</strong>
                </div>
                <button
                  id={`catalog-start-${exam.id}`}
                  className="btn btn-primary"
                  style={{ padding: "7px 16px", minHeight: 36, fontSize: 13 }}
                  onClick={() => onSelectExam(exam)}
                >
                  Take Exam <ChevronRight size={14} />
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="table-container">
          <table className="responsive-table" aria-label="Examinations list">
            <thead>
              <tr>
                <th>Examination</th>
                <th>Subject</th>
                <th>Difficulty</th>
                <th>Duration</th>
                <th>Questions</th>
                <th>Marks</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredExams.map((exam) => (
                <tr key={exam.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 20 }}>{exam.icon}</span>
                      <strong style={{ color: "var(--text-primary)", fontSize: 13.5 }}>
                        {exam.title}
                      </strong>
                    </div>
                  </td>
                  <td>{exam.subject}</td>
                  <td>
                    <span className={`diff-badge diff-${exam.difficulty}`}>
                      {exam.difficulty}
                    </span>
                  </td>
                  <td>{exam.duration} mins</td>
                  <td>{exam.questions.length} Qs</td>
                  <td>
                    {exam.passMark} / {exam.totalMarks}
                  </td>
                  <td>
                    <span className="badge-status live">
                      <span className="badge-live-dot" /> Live
                    </span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <button
                      className="btn btn-primary"
                      style={{ padding: "5px 12px", minHeight: 32, fontSize: 12 }}
                      onClick={() => onSelectExam(exam)}
                    >
                      Begin <ChevronRight size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
