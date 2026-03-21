import Link from "next/link";
import { ROUTES } from "@/config/routes.js";

const MODULES = [
  {
    key: "reading",
    label: "Reading",
    icon: "📖",
    href: ROUTES.IELTS.READING,
    color: "#0d9488",
    bg: "#e6faf8",
    border: "#99e6de",
    tip: "True/False/Not Given · MCQ · Gap Fill",
  },
  {
    key: "writing",
    label: "Writing",
    icon: "✍️",
    href: ROUTES.IELTS.WRITING,
    color: "#1e40af",
    bg: "#eff6ff",
    border: "#bfdbfe",
    tip: "Task 1 Letters · Task 2 Essays",
  },
  {
    key: "listening",
    label: "Listening",
    icon: "🎧",
    href: ROUTES.IELTS.LISTENING,
    color: "#b45309",
    bg: "#fffbeb",
    border: "#fde68a",
    tip: "Gap Fill · MCQ · Sections 1–4",
  },
  {
    key: "speaking",
    label: "Speaking",
    icon: "🎤",
    href: ROUTES.IELTS.SPEAKING,
    color: "#7c3aed",
    bg: "#f5f3ff",
    border: "#ddd6fe",
    tip: "Part 2 Cue Cards · Part 3 Discussion",
  },
];

/**
 * 2×2 grid of quick-access cards for the four IELTS skills.
 * Optionally shows a band score per module when `scores` is provided.
 */
export function ModuleQuickAccess({ scores = {} }) {
  return (
    <div>
      <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--color-brand-gray)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.75rem" }}>
        Practice by Skill
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1.25rem" }}>
        {MODULES.map((m) => {
          const band = scores?.[m.key];
          return (
            <Link
              key={m.key}
              href={m.href}
              style={{ textDecoration: "none" }}
            >
              <div style={{
                padding: "1rem",
                borderRadius: "0.75rem",
                background: m.bg,
                border: `1px solid ${m.border}`,
                cursor: "pointer",
                transition: "transform 0.15s, box-shadow 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "none";
              }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.375rem" }}>
                  <span style={{ fontSize: "1.25rem" }}>{m.icon}</span>
                  {band != null && (
                    <span style={{ fontSize: "0.875rem", fontWeight: 800, color: m.color }}>
                      {band}
                    </span>
                  )}
                </div>
                <p style={{ fontSize: "0.875rem", fontWeight: 700, color: m.color, margin: "0 0 0.25rem" }}>
                  {m.label}
                </p>
                <p style={{ fontSize: "0.7rem", color: "#64748b", margin: 0, lineHeight: 1.4 }}>
                  {m.tip}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
