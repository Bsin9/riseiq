import { META } from "@/config/metadata.js";
import { WelcomeBanner }            from "@/components/dashboard/WelcomeBanner.jsx";
import { WeeklyProgressChart }      from "@/components/dashboard/WeeklyProgressChart.jsx";
import { DailyGoalsWidget }         from "@/components/dashboard/DailyGoalsWidget.jsx";
import { RecentActivityFeed }       from "@/components/dashboard/RecentActivityFeed.jsx";
import { IELTSDashboardSection }    from "@/components/dashboard/IELTSDashboardSection.jsx";
import { SQLDashboardSection }      from "@/components/dashboard/SQLDashboardSection.jsx";
import { AzureDashboardSection }    from "@/components/dashboard/AzureDashboardSection.jsx";
import { isEnrolledIn }             from "@/config/courseRegistry.js";
import progressData from "@/data/progress.json";
import userData     from "@/data/users.json";

export const metadata = META.pages.dashboard;

/**
 * Maps a courseKey to its dashboard section component.
 * Adding a new course only requires adding an entry here
 * + creating components/dashboard/<Key>DashboardSection.jsx.
 */
const COURSE_SECTION_MAP = {
  ielts:  IELTSDashboardSection,
  sql:    SQLDashboardSection,
  azure:  AzureDashboardSection,
};

export default function DashboardPage() {
  const user     = userData[0];
  const progress = progressData;

  const enrolledCourses = user?.enrolledCourses ?? [];

  // moduleScores keyed by module id → current band (IELTS-specific data)
  const moduleScores = Object.fromEntries(
    Object.entries(progress.moduleScores ?? {}).map(([mod, data]) => [mod, data.current])
  );
  const recentSessions = progress.recentSessions ?? [];
  const weakAreas      = progress.weakAreas ?? [];

  // Determine exam date / streak from IELTS enrollment (if enrolled)
  const ieltsEnrollment = enrolledCourses.find((e) => e.courseKey === "ielts");
  const displayExamDate = ieltsEnrollment?.examDate ?? user?.examDate;

  // Enrolled courses sorted by weight (registry order)
  const enrolledKeys = ["ielts", "sql", "azure"].filter((key) =>
    isEnrolledIn(enrolledCourses, key)
  );

  return (
    <div style={{ padding: "1.5rem", maxWidth: "1100px", margin: "0 auto" }}>

      {/* ── Universal welcome banner ──────────────────────────── */}
      <WelcomeBanner
        name={user.name}
        examDate={displayExamDate}
        streakDays={user.streakDays}
      />

      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 320px",
        gap: "1.5rem",
        alignItems: "start",
      }}>

        {/* ── Left column — course sections ────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {enrolledKeys.length === 0 ? (
            /* No enrolled courses — empty state */
            <div className="card" style={{
              padding: "3rem 2rem", textAlign: "center",
              background: "var(--color-brand-teal-pale, #e8f8f5)",
              border: "1px solid var(--color-brand-teal)",
            }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>🎓</div>
              <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--color-brand-navy)", marginBottom: "0.5rem" }}>
                No courses yet
              </h2>
              <p style={{ color: "var(--color-brand-gray)", fontSize: "0.875rem" }}>
                Head to the <a href="/learning" style={{ color: "var(--color-brand-teal)", fontWeight: 600 }}>Learning Hub</a> to enrol in your first course.
              </p>
            </div>
          ) : (
            enrolledKeys.map((key) => {
              const Section     = COURSE_SECTION_MAP[key];
              const enrollment  = enrolledCourses.find((e) => e.courseKey === key);
              if (!Section) return null;
              return (
                <Section
                  key={key}
                  enrollment={enrollment}
                  user={user}
                  moduleScores={key === "ielts" ? moduleScores : {}}
                  weakAreas={key === "ielts" ? weakAreas : []}
                />
              );
            })
          )}
        </div>

        {/* ── Right column — universal widgets ─────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <WeeklyProgressChart data={progress.weeklyActivity ?? []} />
          <DailyGoalsWidget />
          <RecentActivityFeed sessions={recentSessions} />
        </div>

      </div>
    </div>
  );
}
