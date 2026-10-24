export function Skeleton({
  width = "100%",
  height = 20,
  borderRadius = "var(--radius-sm)",
  style,
}) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius,
        background: "linear-gradient(90deg, var(--surface-secondary) 25%, var(--surface-elevated) 50%, var(--surface-secondary) 75%)",
        backgroundSize: "200% 100%",
        animation: "skeleton-loading 1.6s infinite",
        ...style,
      }}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="card-base" style={{ display: "flex", flexDirection: "column", gap: 16, padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Skeleton width={44} height={44} borderRadius="var(--radius-md)" />
        <Skeleton width={70} height={24} borderRadius={100} />
      </div>
      <Skeleton width="40%" height={14} />
      <Skeleton width="85%" height={22} />
      <div style={{ display: "flex", gap: 8 }}>
        <Skeleton width={60} height={24} borderRadius={6} />
        <Skeleton width={80} height={24} borderRadius={6} />
        <Skeleton width={70} height={24} borderRadius={6} />
      </div>
      <div style={{ marginTop: 12, paddingTop: 16, borderTop: "1px solid var(--border-subtle)", display: "flex", justifyContent: "space-between" }}>
        <Skeleton width={90} height={16} />
        <Skeleton width={80} height={36} borderRadius="var(--radius-md)" />
      </div>
    </div>
  );
}
