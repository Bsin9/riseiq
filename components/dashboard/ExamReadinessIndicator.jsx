/**
 * ExamReadinessIndicator
 * Shows current band vs target band with a visual progress bar,
 * and how many days remain until the exam.
 */
export function ExamReadinessIndicator({ currentBand, targetBand, examDate }) {
  const hasBands = currentBand != null && targetBand != null;
  const progress = hasBands
    ? Math.min(100, Math.round((currentBand / targetBand) * 100))
    : null;

  const daysLeft = examDate
    ? Math.max(0, Math.ceil((new Date(examDate) - new Date()) / (1000 * 60 * 60 * 24)))
    : null;

  const urgency = daysLeft != null
    ? daysLeft <= 14 ? "#ef4444"
    : daysLeft <= 30 ? "#f59e0b"
    : "var(--color-brand-teal)"
    : "var(--color-brand-teal)";

  return (
    <div className="card" style={{
      padding: "1.25rem",
      marginBottom: "1.25rem",
      background: "linear-gradient(135deg, #f8faff 0%, #eef2ff 100%)",
      border: "1px solid #e0e7ff",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.75rem" }}>

        {/* Band progress */}
        <div style={{ flex: 1, minWidth: "160px" }}>
          <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "#6366f1", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.375rem" }}>
            Band Progress
          </p>
          <div style={{ display: "flex", alignItems: "baseline", gap: "0.375rem", marginBottom: "0.625rem" }}>
            <span style={{ fontSize: "1.75rem", fontWeight: 900, color: "var(--color-brand-navy)", lineHeight: 1 }}>
              {currentBand ?? "—"}
            </span>
            {targetBand != null && (
              <span style={{ fontSize: "0.875rem", color: "var(--color-brand-gray)" }}>
                / {targetBand} target
              </span>
            )}
          </div>
          {hasBands && (
            <div style={{ height: "6px", background: "#e0e7ff", borderRadius: "9999px", overflow: "hidden" }}>
              <div style={{
                width: `${progress}%`,
                height: "100%",
                background: progress >= 100 ? "#10b981" : "#6366f1",
                borderRadius: "9999px",
                transition: "width 0.6s ease",
              }} />
            </div>
          )}
          {!hasBands && (
            <p style={{ fontSize: "0.75rem", color: "var(--color-brand-gray)" }}>
              Complete a practice session to track your band
            </p>
          )}
        </div>

        {/* Days until exam */}
        {daysLeft != null && (
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "#6366f1", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.375rem" }}>
              Exam Countdown
            </p>
            <p style={{ fontSize: "1.75rem", fontWeight: 900, color: urgency, lineHeight: 1, marginBottom: "0.25rem" }}>
              {daysLeft}
            </p>
            <p style={{ fontSize: "0.7rem", color: "var(--color-brand-gray)" }}>
              {daysLeft === 1 ? "day" : "days"} left
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
