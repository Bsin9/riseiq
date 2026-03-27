/**
 * StatusBadge — shared status pill for admin tables.
 * Replaces the duplicated STATUS_COLOR map in admin/page and admin/students.
 */
const STATUS_VARIANTS = {
  Active:  { bg: "#dcfce7", color: "#166534" },
  Paused:  { bg: "#fef9c3", color: "#854d0e" },
  Expired: { bg: "#fee2e2", color: "#991b1b" },
  Pro:     { bg: "#eef2ff", color: "#4f46e5" },
  Free:    { bg: "#f1f5f9", color: "#475569" },
};

export function StatusBadge({ status }) {
  const style = STATUS_VARIANTS[status] ?? STATUS_VARIANTS.Active;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      padding: "0.2rem 0.625rem", borderRadius: "9999px",
      fontSize: "0.75rem", fontWeight: 600,
      background: style.bg, color: style.color,
      lineHeight: 1.4,
    }}>
      {status}
    </span>
  );
}
