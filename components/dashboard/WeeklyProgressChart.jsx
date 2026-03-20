"use client";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Mock data — replace with real DB data in Phase 2
const MOCK_SESSIONS = [2, 1, 3, 0, 2, 1, 0];

export function WeeklyProgressChart() {
  const max   = Math.max(...MOCK_SESSIONS, 1);
  const total = MOCK_SESSIONS.reduce((a, b) => a + b, 0);

  return (
    <div className="card" style={{ padding: "1.25rem" }}>
      <h3 style={{
        fontSize: "0.875rem", fontWeight: 700,
        color: "var(--color-brand-navy)", marginBottom: "1rem",
      }}>
        This Week
      </h3>

      {/* Bar chart */}
      <div style={{
        display: "flex",
        alignItems: "flex-end",
        gap: "0.375rem",
        height: "72px",
      }}>
        {MOCK_SESSIONS.map((count, i) => (
          <div
            key={i}
            style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "0.25rem" }}
          >
            <div style={{
              width: "100%",
              height: `${(count / max) * 52}px`,
              minHeight: count > 0 ? "6px" : "2px",
              background: count > 0 ? "var(--color-brand-teal)" : "#e2e8f0",
              borderRadius: "3px 3px 0 0",
              transition: "height 0.3s ease",
            }} />
            <span style={{ fontSize: "0.6rem", color: "#94a3b8" }}>{DAYS[i]}</span>
          </div>
        ))}
      </div>

      <p style={{ fontSize: "0.75rem", color: "var(--color-brand-gray)", marginTop: "0.75rem" }}>
        {total} session{total !== 1 ? "s" : ""} this week
      </p>
    </div>
  );
}
