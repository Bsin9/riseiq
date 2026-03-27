import Link from "next/link";
import { ROUTES } from "@/config/routes.js";

/**
 * RecommendedTasks
 * A short list of recommended next actions for IELTS students.
 * In Phase 2 this will be personalised based on weak areas and recent activity.
 * For now it shows a sensible default study sequence.
 */

const DEFAULT_TASKS = [
  {
    icon: "✍️",
    title: "Practice Task 2 Essay",
    desc: "Discuss both views and give your opinion",
    href: ROUTES.IELTS.WRITING,
    color: "#1e40af",
    bg: "#eff6ff",
  },
  {
    icon: "📖",
    title: "Complete a Reading passage",
    desc: "True/False/Not Given — 20 minutes",
    href: ROUTES.IELTS.READING,
    color: "#0d9488",
    bg: "#e6faf8",
  },
  {
    icon: "🎧",
    title: "Try a Listening section",
    desc: "Gap fill and MCQ — 10 minutes",
    href: ROUTES.IELTS.LISTENING,
    color: "#b45309",
    bg: "#fffbeb",
  },
  {
    icon: "🎤",
    title: "Practice a Speaking cue card",
    desc: "1 min prep · 2 min talk · follow-ups",
    href: ROUTES.IELTS.SPEAKING,
    color: "#7c3aed",
    bg: "#f5f3ff",
  },
];

export function RecommendedTasks({ tasks = DEFAULT_TASKS }) {
  return (
    <div>
      <p style={{
        fontSize: "0.7rem", fontWeight: 700,
        color: "var(--color-brand-gray)",
        textTransform: "uppercase", letterSpacing: "0.05em",
        marginBottom: "0.75rem",
      }}>
        Recommended Next
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {tasks.map((t, i) => (
          <Link
            key={t.title}
            href={t.href}
            style={{ textDecoration: "none" }}
          >
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "0.75rem 1rem",
              borderRadius: "0.625rem",
              background: t.bg,
              border: `1px solid ${t.bg}`,
              transition: "transform 0.12s, box-shadow 0.12s",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateX(3px)";
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "none";
            }}
            >
              <span style={{ fontSize: "1.25rem", flexShrink: 0 }}>{t.icon}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: "0.8rem", fontWeight: 700, color: t.color, margin: "0 0 0.125rem" }}>
                  {t.title}
                </p>
                <p style={{ fontSize: "0.7rem", color: "#64748b", margin: 0 }}>
                  {t.desc}
                </p>
              </div>
              <span style={{ fontSize: "0.875rem", color: t.color, flexShrink: 0 }}>→</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
