// Mock daily goals — will be driven by DB + user settings in Phase 2
const ALL_GOALS = [
  { label: "Complete 1 writing session",  done: false, course: "ielts",  href: "/ielts/writing"   },
  { label: "Complete 1 reading session",  done: true,  course: "ielts",  href: "/ielts/reading"   },
  { label: "Complete 1 listening session",done: false, course: "ielts",  href: "/ielts/listening" },
  { label: "Review Synapse feedback",     done: false, course: null,     href: "/synapse"         },
];

export function DailyGoalsWidget({ enrolledCourses = [] }) {
  // Only show goals relevant to enrolled courses (plus course-agnostic goals)
  const goals = ALL_GOALS.filter(
    (g) => !g.course || enrolledCourses.find((e) => e.courseKey === g.course)
  );

  const doneCount = goals.filter((g) => g.done).length;

  return (
    <div className="card" style={{ padding: "1.25rem" }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "1rem",
      }}>
        <h3 style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--color-brand-navy)", margin: 0 }}>
          Today's Goals
        </h3>
        <span style={{ fontSize: "0.75rem", color: "var(--color-brand-gray)" }}>
          {doneCount}/{goals.length}
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
        {goals.map((g, i) => (
          <a
            key={i}
            href={g.href}
            style={{ display: "flex", alignItems: "center", gap: "0.625rem", textDecoration: "none" }}
          >
            {/* Checkbox circle */}
            <div style={{
              width: "18px",
              height: "18px",
              borderRadius: "50%",
              flexShrink: 0,
              border: g.done ? "none" : "2px solid #e2e8f0",
              background: g.done ? "var(--color-brand-teal)" : "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              {g.done && (
                <span style={{ color: "white", fontSize: "0.6rem", fontWeight: 800 }}>✓</span>
              )}
            </div>

            <span style={{
              fontSize: "0.8rem",
              color: g.done ? "#94a3b8" : "var(--color-brand-navy)",
              textDecoration: g.done ? "line-through" : "none",
            }}>
              {g.label}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
