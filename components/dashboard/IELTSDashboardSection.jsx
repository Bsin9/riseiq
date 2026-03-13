import Link from "next/link";
import { ExamReadinessIndicator } from "@/components/dashboard/ExamReadinessIndicator.jsx";
import { ModuleQuickAccess }      from "@/components/dashboard/ModuleQuickAccess.jsx";
import { WeakSkillAlert }         from "@/components/dashboard/WeakSkillAlert.jsx";
import { MockTestShortcut }       from "@/components/dashboard/MockTestShortcut.jsx";
import { RecommendedTasks }       from "@/components/dashboard/RecommendedTasks.jsx";
import { ROUTES }                 from "@/config/routes.js";

/**
 * IELTS-specific dashboard section.
 *
 * Rendered by DashboardPage only when the user is enrolled in IELTS.
 * All IELTS widgets live here — not in the generic DashboardPage.
 *
 * @param {{
 *   enrollment: { courseKey: string, targetBand?: number, examDate?: string },
 *   user: { currentBand?: number, targetBand?: number },
 *   moduleScores: Record<string, number>,
 *   weakAreas: string[],
 * }} props
 */
export function IELTSDashboardSection({ enrollment, user, moduleScores, weakAreas }) {
  const targetBand = enrollment?.targetBand ?? user?.targetBand;
  const examDate   = enrollment?.examDate   ?? user?.examDate;
  const currentBand = user?.currentBand;

  return (
    <section aria-label="IELTS Progress">

      {/* Section header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: "1rem", paddingBottom: "0.625rem",
        borderBottom: "2px solid #6366f120",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
          <div style={{
            width: "2rem", height: "2rem", borderRadius: "0.5rem",
            background: "#6366f115", display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: "1rem",
          }}>
            📝
          </div>
          <div>
            <h2 style={{
              fontSize: "1rem", fontWeight: 700,
              color: "var(--color-brand-navy)", margin: 0,
            }}>
              IELTS Preparation
            </h2>
            {targetBand && (
              <p style={{ fontSize: "0.75rem", color: "var(--color-brand-gray)", margin: 0 }}>
                Target Band {targetBand}
                {examDate && ` · ${new Date(examDate).toLocaleDateString("en-CA", { month: "short", year: "numeric" })}`}
              </p>
            )}
          </div>
        </div>
        <Link
          href={ROUTES.LEARNING_COURSE("ielts")}
          style={{
            fontSize: "0.8rem", color: "#6366f1", fontWeight: 600,
            textDecoration: "none",
          }}
        >
          View Course →
        </Link>
      </div>

      {/* Exam readiness */}
      {(currentBand != null || targetBand != null) && (
        <ExamReadinessIndicator
          currentBand={currentBand}
          targetBand={targetBand}
        />
      )}

      {/* Practice quick-access grid (Reading / Writing / Listening / Speaking) */}
      <ModuleQuickAccess scores={moduleScores} />

      {/* Mock test shortcut */}
      <MockTestShortcut />

      {/* Recommended tasks */}
      <div style={{ marginTop: "1.5rem" }}>
        <RecommendedTasks />
      </div>

      {/* Weak skill alert */}
      {weakAreas?.length > 0 && (
        <div style={{ marginTop: "1rem" }}>
          <WeakSkillAlert areas={weakAreas} />
        </div>
      )}

    </section>
  );
}
