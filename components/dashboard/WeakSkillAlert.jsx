import Link from "next/link";
import { ROUTES } from "@/config/routes.js";

const SKILL_ROUTES = {
  reading:   ROUTES.IELTS.READING,
  writing:   ROUTES.IELTS.WRITING,
  listening: ROUTES.IELTS.LISTENING,
  speaking:  ROUTES.IELTS.SPEAKING,
};

const SKILL_ICONS = {
  reading: "📖", writing: "✍️", listening: "🎧", speaking: "🎤",
};

/**
 * WeakSkillAlert
 * Shown when the student has identified weak areas (from test results or self-assessment).
 * Provides direct links to practice those specific skills.
 * In Phase 2 this will be driven by actual performance data.
 */
export function WeakSkillAlert({ areas = [] }) {
  if (!areas || areas.length === 0) return null;

  return (
    <div style={{
      padding: "1rem 1.25rem",
      borderRadius: "0.75rem",
      background: "#fff7ed",
      border: "1px solid #fed7aa",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
        <span style={{ fontSize: "1rem" }}>⚠️</span>
        <p style={{ fontSize: "0.8rem", fontWeight: 700, color: "#9a3412", margin: 0 }}>
          Focus Areas — Synapse Brain detected gaps here
        </p>
      </div>

      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        {areas.map((area) => {
          const route = SKILL_ROUTES[area.toLowerCase()] ?? "/ielts/reading";
          const icon  = SKILL_ICONS[area.toLowerCase()] ?? "📚";
          return (
            <Link
              key={area}
              href={route}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.375rem",
                padding: "0.4rem 0.875rem",
                borderRadius: "9999px",
                background: "#ffedd5",
                border: "1px solid #fdba74",
                textDecoration: "none",
                fontSize: "0.8rem",
                fontWeight: 600,
                color: "#9a3412",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#fed7aa"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#ffedd5"; }}
            >
              {icon} {area.charAt(0).toUpperCase() + area.slice(1)} Practice →
            </Link>
          );
        })}
      </div>
    </div>
  );
}
