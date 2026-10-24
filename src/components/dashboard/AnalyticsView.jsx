import {
  TrendingUp,
  BarChart2,
  PieChart,
  CheckCircle2,
  Clock,
  Award,
  Users,
} from "lucide-react";
import StatCard from "../common/StatCard";

export default function AnalyticsView({ exams }) {
  const totalQuestions = exams.reduce((sum, e) => sum + e.questions.length, 0);
  const totalAttempts = exams.reduce((sum, e) => sum + e.attempts, 0);
  const overallAvg = Math.round(
    exams.reduce((sum, e) => sum + e.avgScore, 0) / (exams.length || 1)
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* ── Key Performance Metrics ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16,
        }}
      >
        <StatCard
          icon={Award}
          label="Overall Pass Rate"
          value="78.4%"
          trend="+3.2% vs last term"
          trendPositive={true}
          sublabel="Passing benchmark"
        />
        <StatCard
          icon={TrendingUp}
          label="Cohort Avg Score"
          value={`${overallAvg}%`}
          trend="+5.1% improvements"
          trendPositive={true}
          sublabel="Standardized tests"
        />
        <StatCard
          icon={Clock}
          label="Avg Time Spent"
          value="24.5 min"
          trend="-2.1 min efficiency"
          trendPositive={true}
          sublabel="Per examination"
        />
        <StatCard
          icon={Users}
          label="Validated Attempts"
          value={totalAttempts.toLocaleString()}
          trend="100% verified"
          trendPositive={true}
          sublabel="Zero security breaches"
        />
      </div>

      {/* ── Subject Mastery & Format Distributions ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 20,
        }}
      >
        {/* Subject Performance Breakdown */}
        <div
          style={{
            background: "var(--surface-main)",
            border: "1px solid var(--border-color)",
            borderRadius: "var(--radius-lg)",
            padding: "22px 26px",
            display: "flex",
            flexDirection: "column",
            gap: 18,
            boxShadow: "var(--shadow-xs)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <BarChart2 size={18} color="var(--primary-brand)" />
            <h3 style={{ fontSize: 16, fontWeight: 800, color: "var(--text-primary)" }}>
              Subject Proficiency Breakdown
            </h3>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {exams.map((exam) => (
              <div key={exam.id}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 5,
                    fontSize: 13,
                  }}
                >
                  <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                    {exam.title}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--mono)",
                      fontWeight: 700,
                      color: "var(--primary-brand)",
                    }}
                  >
                    {exam.avgScore}% avg
                  </span>
                </div>
                <div
                  style={{
                    height: 7,
                    background: "var(--surface-secondary)",
                    borderRadius: 4,
                    overflow: "hidden",
                    border: "1px solid var(--border-color)",
                  }}
                >
                  <div
                    style={{
                      width: `${exam.avgScore}%`,
                      height: "100%",
                      borderRadius: 4,
                      background: "var(--primary-brand)",
                    }}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: 4,
                    fontSize: 11,
                    color: "var(--text-muted)",
                  }}
                >
                  <span>{exam.subject}</span>
                  <span>{exam.attempts.toLocaleString()} candidates</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Question Format Performance */}
        <div
          style={{
            background: "var(--surface-main)",
            border: "1px solid var(--border-color)",
            borderRadius: "var(--radius-lg)",
            padding: "22px 26px",
            display: "flex",
            flexDirection: "column",
            gap: 18,
            boxShadow: "var(--shadow-xs)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <PieChart size={18} color="var(--primary-brand)" />
            <h3 style={{ fontSize: 16, fontWeight: 800, color: "var(--text-primary)" }}>
              Question Format Accuracy
            </h3>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              {
                format: "Multiple Choice (MCQ)",
                accuracy: 76,
                count: 18,
                desc: "High conceptual recall",
                color: "var(--primary-brand)",
              },
              {
                format: "True / False Questions",
                accuracy: 84,
                count: 5,
                desc: "Rapid binary evaluation",
                color: "var(--success)",
              },
              {
                format: "Fill in the Blank",
                accuracy: 62,
                count: 4,
                desc: "Exact keyword matching",
                color: "var(--warning)",
              },
            ].map((f) => (
              <div
                key={f.format}
                style={{
                  background: "var(--surface-secondary)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "var(--radius-md)",
                  padding: "12px 16px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 4,
                  }}
                >
                  <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>
                    {f.format}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: 13,
                      fontWeight: 800,
                      color: f.color,
                    }}
                  >
                    {f.accuracy}%
                  </span>
                </div>
                <div style={{ fontSize: 11.5, color: "var(--text-muted)" }}>
                  {f.desc} · {f.count} items in repository
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
