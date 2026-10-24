import { Inbox } from "lucide-react";

export default function EmptyState({
  icon: Icon = Inbox,
  title = "No items found",
  description = "There are no records to display at this time.",
  actionLabel,
  onAction,
}) {
  return (
    <div
      style={{
        padding: "56px 24px",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--surface-primary)",
        border: "1px dashed var(--border-subtle)",
        borderRadius: "var(--radius-xl)",
        maxWidth: 520,
        margin: "24px auto",
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: "var(--radius-lg)",
          background: "var(--surface-secondary)",
          border: "1px solid var(--border-subtle)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--text-muted)",
          marginBottom: 16,
        }}
      >
        <Icon size={26} />
      </div>

      <h3
        style={{
          fontSize: 17,
          fontWeight: 800,
          color: "var(--text-primary)",
          marginBottom: 8,
        }}
      >
        {title}
      </h3>

      <p
        style={{
          fontSize: 14,
          color: "var(--text-secondary)",
          maxWidth: 360,
          lineHeight: 1.5,
          marginBottom: actionLabel ? 20 : 0,
        }}
      >
        {description}
      </p>

      {actionLabel && (
        <button className="btn btn-primary" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
