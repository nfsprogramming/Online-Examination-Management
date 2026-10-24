import { TrendingUp, TrendingDown } from "lucide-react";

export default function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  trendPositive = true,
  sublabel,
  accentColor,
}) {
  return (
    <div className="stat-card" style={accentColor ? { borderColor: accentColor } : undefined}>
      <div className="stat-card-header">
        <span className="stat-card-label">{label}</span>
        {Icon && (
          <div className="stat-card-icon">
            <Icon size={18} />
          </div>
        )}
      </div>

      <div className="stat-card-value">{value}</div>

      {(trend || sublabel) && (
        <div className="stat-card-sub">
          {trend && (
            <span
              className={trendPositive ? "stat-trend-up" : "stat-trend-down"}
              style={{ display: "inline-flex", alignItems: "center", gap: 3 }}
            >
              {trendPositive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
              {trend}
            </span>
          )}
          {sublabel && <span>{sublabel}</span>}
        </div>
      )}
    </div>
  );
}
