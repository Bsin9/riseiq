import { getServerSession }            from "next-auth";
import { authOptions }                 from "@/lib/auth/authOptions.js";
import { redirect }                    from "next/navigation";
import { getEnrolledCoursesMeta, isEnrolledIn } from "@/config/courseRegistry.js";
import { WelcomeBanner }               from "@/components/dashboard/WelcomeBanner.jsx";
import { WeeklyProgressChart }         from "@/components/dashboard/WeeklyProgressChart.jsx";
import { DailyGoalsWidget }            from "@/components/dashboard/DailyGoalsWidget.jsx";
import { RecentActivityFeed }          from "@/components/dashboard/RecentActivityFeed.jsx";
import { IELTSDashboardSection }       from "@/components/dashboard/IELTSDashboardSection.jsx";
import { SQLDashboardSection }         from "@/components/dashboard/SQLDashboardSection.jsx";
import { AzureDashboardSection }       from "@/components/dashboard/AzureDashboardSection.jsx";

export const metadata = { title: "Dashboard — RiseIQ" };

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

export default async function DashboardPage() {
  // All user data comes from the JWT token — no DB call required in Phase 1
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const enrolledCourses = session.user.enrolledCourses ?? [];
  const enrolledMeta    = getEnrolledCoursesMeta(enrolledCourses);
  const enrolledKeys    = ["ielts", "sql", "azure"].filter((key) =>
    isEnrolledIn(enrolledCourses, key)
  );

  return (
    <div style={{ padding: "1.5rem", maxWidth: "1100px", margin: "0 auto" }}>

      {/* ── Universal welcome banner ──────────────────────────── */}
      <WelcomeBanner user={session.user} />

      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 320px",
        gap: "1.5rem",
        alignItems: "start",
        marginTop: "1.5rem",
      }}>

        {/* ── Left column — course sections ────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {enrolledKeys.length === 0 ? (
            /* No enrolled courses — empty state */
            <div className="card" style={{
              padding: "3rem 2rem", textAlign: "center",
              background: "#e8f8f5",
              border: "1px solid var(--color-brand-teal)",
            }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>🎓</div>
              <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--color-brand-navy)", marginBottom: "0.5rem" }}>
                No courses yet
              </h2>
              <p style={{ color: "var(--color-brand-gray)", fontSize: "0.875rem", marginBottom: "1rem" }}>
                Browse the Learning Hub to get started.
              </p>
              <a href="/learning" className="btn-primary">Browse Courses →</a>
            </div>
          ) : (
            enrolledKeys.map((key) => {
              const Section    = COURSE_SECTION_MAP[key];
              const enrollment = enrolledCourses.find((e) => e.courseKey === key);
              if (!Section) return null;
              return (
                <Section
                  key={key}
                  enrollment={enrollment}
                  user={session.user}
                />
              );
            })
          )}
        </div>

        {/* ── Right column — universal widgets ─────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <WeeklyProgressChart />
          <DailyGoalsWidget enrolledCourses={enrolledMeta} />
          <RecentActivityFeed />
        </div>

      </div>
    </div>
  );
}
