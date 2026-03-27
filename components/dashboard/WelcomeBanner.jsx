import { daysUntil } from "@/lib/utils/date.js";

export function WelcomeBanner({ user }) {
  const hour      = new Date().getHours();
  const greeting  = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const firstName = user?.name?.split(" ")[0] ?? "there";

  // Prefer IELTS enrollment data for band + exam date display
  const ieltsEnrollment = (user?.enrolledCourses ?? []).find((e) => e.courseKey === "ielts");
  const targetBand      = user?.targetBand ?? ieltsEnrollment?.targetBand;
  const examDate        = user?.examDate   ?? ieltsEnrollment?.examDate;

  const daysLeft = daysUntil(examDate);

  return (
    <div
      className="card"
      style={{
        padding: "1.5rem",
        background: "linear-gradient(135deg, var(--color-brand-navy) 0%, #1a2f5a 100%)",
        color: "white",
        border: "none",
      }}
    >
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        flexWrap: "wrap",
        gap: "1rem",
      }}>

        {/* Left — name + target */}
        <div>
          <p style={{ fontSize: "0.8rem", color: "#94a3b8", marginBottom: "0.25rem" }}>
            {greeting}
          </p>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800, margin: "0 0 0.375rem" }}>
            {firstName} 👋
          </h1>
          {targetBand && (
            <p style={{ fontSize: "0.8rem", color: "#94a3b8", margin: 0 }}>
              Target: Band {targetBand}
              {daysLeft !== null && daysLeft > 0 && (
                <> · <strong style={{ color: daysLeft < 30 ? "#fbbf24" : "#e2e8f0" }}>{daysLeft} days</strong> to exam</>
              )}
              {daysLeft === 0 && (
                <> · <strong style={{ color: "#fbbf24" }}>Exam day!</strong></>
              )}
            </p>
          )}
        </div>

        {/* Right — date */}
        <div style={{ textAlign: "right" }}>
          <p style={{ fontSize: "0.7rem", color: "#64748b", marginBottom: "0.2rem" }}>Today</p>
          <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "#e2e8f0" }}>
            {new Date().toLocaleDateString("en-CA", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </p>
        </div>

      </div>
    </div>
  );
}
