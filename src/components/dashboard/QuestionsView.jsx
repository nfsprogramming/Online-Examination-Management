import { useState, useMemo } from "react";
import { Search, FileQuestion, CheckCircle2, HelpCircle, BookOpen, KeyRound } from "lucide-react";
import EmptyState from "../common/EmptyState";

export default function QuestionsView({ exams }) {
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [search, setSearch] = useState("");
  const [showKeys, setShowKeys] = useState(false);

  // Aggregate all questions with exam context
  const allQuestions = useMemo(() => {
    return exams.flatMap((exam) =>
      exam.questions.map((q) => ({
        ...q,
        examId: exam.id,
        examTitle: exam.title,
        subject: exam.subject,
        examDifficulty: exam.difficulty,
      }))
    );
  }, [exams]);

  const subjects = ["All", ...new Set(exams.map((e) => e.subject))];
  const types = ["All", "mcq", "truefalse", "fill"];

  const filteredQuestions = useMemo(() => {
    return allQuestions.filter((q) => {
      const matchSubject =
        selectedSubject === "All" || q.subject === selectedSubject;
      const matchType = selectedType === "All" || q.type === selectedType;
      const matchSearch =
        !search ||
        q.question.toLowerCase().includes(search.toLowerCase()) ||
        q.subject.toLowerCase().includes(search.toLowerCase());
      return matchSubject && matchType && matchSearch;
    });
  }, [allQuestions, selectedSubject, selectedType, search]);

  const typeLabels = {
    mcq: "Multiple Choice",
    truefalse: "True / False",
    fill: "Fill in the Blank",
  };

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
              Question Bank Repository
            </h2>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 2 }}>
              Inspect curated assessment questions, formats, and point allocations.
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              onClick={() => setShowKeys(!showKeys)}
              className="btn btn-secondary"
              style={{ padding: "6px 12px", minHeight: 38, fontSize: 12.5 }}
            >
              <KeyRound size={14} color={showKeys ? "var(--primary-brand)" : "currentColor"} />
              {showKeys ? "Hide Answer Keys" : "Reveal Answer Keys"}
            </button>

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
                placeholder="Search questions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
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
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11.5, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
              Subject:
            </span>
            {subjects.map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSubject(s)}
                style={{
                  padding: "4px 10px",
                  borderRadius: "var(--radius-md)",
                  border: `1px solid ${
                    selectedSubject === s
                      ? "var(--primary-brand)"
                      : "var(--border-color)"
                  }`,
                  background:
                    selectedSubject === s
                      ? "var(--surface-active)"
                      : "var(--surface-secondary)",
                  color:
                    selectedSubject === s
                      ? "var(--primary-brand)"
                      : "var(--text-secondary)",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {s}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11.5, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
              Type:
            </span>
            {types.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                style={{
                  padding: "4px 10px",
                  borderRadius: "var(--radius-md)",
                  border: `1px solid ${
                    selectedType === t
                      ? "var(--primary-brand)"
                      : "var(--border-color)"
                  }`,
                  background:
                    selectedType === t
                      ? "var(--surface-active)"
                      : "var(--surface-secondary)",
                  color:
                    selectedType === t
                      ? "var(--primary-brand)"
                      : "var(--text-secondary)",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {t === "All" ? "All Formats" : typeLabels[t]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Questions List ── */}
      {filteredQuestions.length === 0 ? (
        <EmptyState
          title="No questions match criteria"
          description="Try broadening your search query or selecting all formats."
          actionLabel="Clear Filters"
          onAction={() => {
            setSelectedSubject("All");
            setSelectedType("All");
            setSearch("");
          }}
        />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filteredQuestions.map((q, idx) => (
            <div
              key={`${q.examId}-${q.id}`}
              style={{
                background: "var(--surface-main)",
                border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-lg)",
                padding: "18px 22px",
                boxShadow: "var(--shadow-xs)",
                transition: "all 0.18s ease",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: 16,
                  marginBottom: 10,
                  flexWrap: "wrap",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: "var(--radius-sm)",
                      background: "var(--surface-secondary)",
                      border: "1px solid var(--border-color)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11.5,
                      fontWeight: 800,
                      fontFamily: "var(--mono)",
                      color: "var(--primary-brand)",
                    }}
                  >
                    #{idx + 1}
                  </span>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: "var(--text-muted)",
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                    }}
                  >
                    {q.subject} · {q.examTitle}
                  </span>
                </div>

                <div style={{ display: "flex", gap: 6 }}>
                  <span
                    style={{
                      background: "var(--surface-secondary)",
                      border: "1px solid var(--border-color)",
                      borderRadius: "var(--radius-sm)",
                      padding: "3px 8px",
                      fontSize: 11,
                      fontWeight: 600,
                      color: "var(--text-secondary)",
                    }}
                  >
                    {typeLabels[q.type]}
                  </span>
                  <span
                    style={{
                      background: "var(--success-bg)",
                      border: "1px solid var(--success-border)",
                      borderRadius: "var(--radius-sm)",
                      padding: "3px 8px",
                      fontSize: 11,
                      fontWeight: 700,
                      color: "var(--success)",
                      fontFamily: "var(--mono)",
                    }}
                  >
                    {q.marks} Marks
                  </span>
                </div>
              </div>

              <h4
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  lineHeight: 1.45,
                  marginBottom: 12,
                }}
              >
                {q.question}
              </h4>

              {/* MCQ Preview */}
              {q.type === "mcq" && q.options && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: 8,
                  }}
                >
                  {q.options.map((opt, optIdx) => {
                    const isAnswer = showKeys && optIdx === q.correct;
                    return (
                      <div
                        key={optIdx}
                        style={{
                          background: isAnswer ? "var(--success-bg)" : "var(--surface-secondary)",
                          border: `1px solid ${isAnswer ? "var(--success-border)" : "var(--border-color)"}`,
                          borderRadius: "var(--radius-sm)",
                          padding: "7px 12px",
                          fontSize: 12.5,
                          color: isAnswer ? "var(--success)" : "var(--text-secondary)",
                          fontWeight: isAnswer ? 700 : 500,
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            fontFamily: "var(--mono)",
                            color: isAnswer ? "var(--success)" : "var(--text-muted)",
                          }}
                        >
                          {String.fromCharCode(65 + optIdx)}.
                        </span>
                        <span>{opt}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* True/False Preview */}
              {q.type === "truefalse" && (
                <div style={{ display: "flex", gap: 10 }}>
                  <span
                    style={{
                      background: showKeys
                        ? q.correct
                          ? "var(--success-bg)"
                          : "var(--surface-secondary)"
                        : "var(--surface-secondary)",
                      border: `1px solid ${showKeys && q.correct ? "var(--success-border)" : "var(--border-color)"}`,
                      borderRadius: "var(--radius-sm)",
                      padding: "5px 12px",
                      fontSize: 12.5,
                      color: showKeys && q.correct ? "var(--success)" : "var(--text-secondary)",
                      fontWeight: showKeys && q.correct ? 700 : 500,
                    }}
                  >
                    True {showKeys && q.correct && "✓ (Correct)"}
                  </span>
                  <span
                    style={{
                      background: showKeys
                        ? !q.correct
                          ? "var(--success-bg)"
                          : "var(--surface-secondary)"
                        : "var(--surface-secondary)",
                      border: `1px solid ${showKeys && !q.correct ? "var(--success-border)" : "var(--border-color)"}`,
                      borderRadius: "var(--radius-sm)",
                      padding: "5px 12px",
                      fontSize: 12.5,
                      color: showKeys && !q.correct ? "var(--success)" : "var(--text-secondary)",
                      fontWeight: showKeys && !q.correct ? 700 : 500,
                    }}
                  >
                    False {showKeys && !q.correct && "✓ (Correct)"}
                  </span>
                </div>
              )}

              {/* Fill in blank Preview */}
              {q.type === "fill" && (
                <div
                  style={{
                    background: showKeys ? "var(--success-bg)" : "var(--surface-secondary)",
                    border: `1px solid ${showKeys ? "var(--success-border)" : "var(--border-color)"}`,
                    borderRadius: "var(--radius-sm)",
                    padding: "7px 12px",
                    fontSize: 12.5,
                    color: showKeys ? "var(--success)" : "var(--text-muted)",
                    fontFamily: "var(--mono)",
                    maxWidth: 380,
                  }}
                >
                  {showKeys
                    ? `Acceptable answers: ${q.correct.join(", ")}`
                    : "Fill in the blank text matching"}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
