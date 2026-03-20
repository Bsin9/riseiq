const VARIANTS = {
  teal:   { background: "#e6faf8", color: "#0d9488" },
  navy:   { background: "#e8edf5", color: "#0F1F3D" },
  gold:   { background: "#fef3c7", color: "#b45309" },
  green:  { background: "#dcfce7", color: "#15803d" },
  red:    { background: "#fee2e2", color: "#dc2626" },
  gray:   { background: "#f1f5f9", color: "#64748b" },
  indigo: { background: "#eef2ff", color: "#4f46e5" },
  purple: { background: "#f3e8ff", color: "#7c3aed" },
};

export function Badge({ children, variant = "gray" }) {
  const style = VARIANTS[variant] ?? VARIANTS.gray;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "0.2rem 0.625rem",
        borderRadius: "9999px",
        fontSize: "0.75rem",
        fontWeight: 600,
        lineHeight: 1.4,
        ...style,
      }}
    >
      {children}
    </span>
  );
}
