// Mock recent activity — will come from DB in Phase 2
const MOCK_ACTIVITY = [
  { icon: "✍️", label: "Writing Practice",   sub: "Task 2 — Technology Essay",  time: "2h ago",    band: 6.5 },
  { icon: "📖", label: "Reading Practice",   sub: "Urban Vertical Farming",      time: "Yesterday", band: null },
  { icon: "🎧", label: "Listening Practice", sub: "Hotel Booking — Section 1",   time: "2 days ago",band: null },
];

/**
 * RecentActivityFeed
 * Shows the last few practice sessions.
 * Pass `sessions` to override mock data. Pass an empty array to show the empty state.
 * When `sessions` is undefined (not yet loaded), falls back to mock data.
 */
export function RecentActivityFeed({ sessions }) {
  // undefined = not provided → use mock data (Phase 1 fallback)
  // [] = explicitly empty → show empty state
  const feed = sessions === undefined ? MOCK_ACTIVITY : sessions;

  return (
    <div className="card" style={{ padding: "1.25rem" }}>
      <h3 style={{
        fontSize: "0.875rem",
        fontWeight: 700,
        color: "var(--color-brand-navy)",
        marginBottom: "1rem",
      }}>
        Recent Activity
      </h3>

      {feed.length === 0 ? (
        <p style={{ fontSize: "0.8rem", color: "var(--color-brand-gray)", textAlign: "center", padding: "0.75rem 0" }}>
          No sessions yet. Your first one takes 10 minutes.
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {feed.map((item, i) => (
            <div key={item.label + i} style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
              <span style={{ fontSize: "1.125rem", flexShrink: 0 }}>{item.icon}</span>

              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  fontSize: "0.8rem", fontWeight: 600,
                  color: "var(--color-brand-navy)", margin: 0,
                }}>
                  {item.label}
                </p>
                <p style={{
                  fontSize: "0.7rem",
                  color: "var(--color-brand-gray)",
                  margin: 0,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}>
                  {item.sub}
                </p>
              </div>

              <div style={{ textAlign: "right", flexShrink: 0 }}>
                {item.band != null && (
                  <p style={{
                    fontSize: "0.875rem", fontWeight: 800,
                    color: "var(--color-brand-teal)", margin: 0,
                  }}>
                    {item.band}
                  </p>
                )}
                <p style={{ fontSize: "0.65rem", color: "#94a3b8", margin: 0 }}>{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
