import { requireRole } from "@/lib/auth/withAuth.js";

export const metadata = {
  title: "Admin Portal — RiseIQ",
  description: "RiseIQ platform administration",
};

// ── Mock data (replace with DB calls) ───────────────────────────────────────
const PLATFORM_STATS = {
  totalStudents:    142,
  activeThisWeek:    38,
  avgBand:          6.2,
  mockTestsThisMonth: 94,
  certIssued:        17,
};

const RECENT_STUDENTS = [
  { id: "u_s01", name: "Alex Chen",    email: "student@riseiq.ca", course: "IELTS",  plan: "Pro",  band: 6.5, status: "Active",  joined: "2026-03-08" },
  { id: "u_s02", name: "Sara Patel",   email: "sara@example.com",  course: "IELTS",  plan: "Free", band: 5.5, status: "Active",  joined: "2026-03-01" },
  { id: "u_s03", name: "James Kim",    email: "jkim@example.com",  course: "SQL",    plan: "Pro",  band: null, status: "Active", joined: "2026-02-20" },
  { id: "u_s04", name: "Priya Nair",   email: "priya@example.com", course: "Azure",  plan: "Pro",  band: null, status: "Paused", joined: "2026-02-14" },
  { id: "u_s05", name: "Tom Nguyen",   email: "tom@example.com",   course: "IELTS",  plan: "Pro",  band: 7.0, status: "Active",  joined: "2026-01-30" },
];

const STATUS_COLOR = {
  Active:  { bg: "#dcfce7", color: "#166534" },
  Paused:  { bg: "#fef9c3", color: "#854d0e" },
  Expired: { bg: "#fee2e2", color: "#991b1b" },
};

export default async function AdminPage() {
  await requireRole("admin");

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>

      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
          Admin Portal
        </h1>
        <p style={{ color: "#64748b", marginTop: "0.25rem", fontSize: "0.9375rem" }}>
          Platform overview · {new Date().toLocaleDateString("en-CA", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* Platform stats */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "1rem",
        marginBottom: "2rem",
      }}>
        {[
          { label: "Total Students",     value: PLATFORM_STATS.totalStudents,        icon: "👥", color: "#6366f1" },
          { label: "Active This Week",   value: PLATFORM_STATS.activeThisWeek,       icon: "🔥", color: "#f59e0b" },
          { label: "Avg Band Score",     value: PLATFORM_STATS.avgBand.toFixed(1),   icon: "📊", color: "#10b981" },
          { label: "Mock Tests (Month)", value: PLATFORM_STATS.mockTestsThisMonth,   icon: "📝", color: "#0ea5e9" },
          { label: "Certs Issued",       value: PLATFORM_STATS.certIssued,           icon: "🏆", color: "#8b5cf6" },
        ].map(({ label, value, icon, color }) => (
          <div key={label} className="card" style={{ padding: "1.25rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <span style={{ fontSize: "1.25rem" }}>{icon}</span>
              <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {label}
              </span>
            </div>
            <p style={{ fontSize: "2rem", fontWeight: 800, color, margin: 0, lineHeight: 1 }}>
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Students table */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "#0f172a", margin: 0 }}>
            Recent Students
          </h2>
          <a href="/admin/students" style={{ fontSize: "0.8125rem", color: "#6366f1", fontWeight: 600, textDecoration: "none" }}>
            View all →
          </a>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {["Name", "Email", "Course", "Plan", "Band", "Status", "Joined"].map((h) => (
                  <th key={h} style={{
                    padding: "0.75rem 1.5rem", textAlign: "left", fontWeight: 600,
                    color: "#64748b", fontSize: "0.75rem", textTransform: "uppercase",
                    letterSpacing: "0.05em", borderBottom: "1px solid #e2e8f0",
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RECENT_STUDENTS.map((s, i) => {
                const badge = STATUS_COLOR[s.status] ?? STATUS_COLOR.Active;
                return (
                  <tr key={s.id} style={{ background: i % 2 === 0 ? "#fff" : "#f8fafc", transition: "background 0.1s" }}>
                    <td style={{ padding: "0.875rem 1.5rem", fontWeight: 600, color: "#0f172a" }}>{s.name}</td>
                    <td style={{ padding: "0.875rem 1.5rem", color: "#64748b" }}>{s.email}</td>
                    <td style={{ padding: "0.875rem 1.5rem" }}>
                      <span style={{
                        padding: "0.2rem 0.6rem", borderRadius: "9999px",
                        fontSize: "0.75rem", fontWeight: 600,
                        background: "#f1f5f9", color: "#334155",
                      }}>
                        {s.course}
                      </span>
                    </td>
                    <td style={{ padding: "0.875rem 1.5rem", color: "#64748b" }}>{s.plan}</td>
                    <td style={{ padding: "0.875rem 1.5rem", fontWeight: 700, color: "#0f172a" }}>
                      {s.band ?? "—"}
                    </td>
                    <td style={{ padding: "0.875rem 1.5rem" }}>
                      <span style={{
                        padding: "0.2rem 0.6rem", borderRadius: "9999px",
                        fontSize: "0.75rem", fontWeight: 600,
                        background: badge.bg, color: badge.color,
                      }}>
                        {s.status}
                      </span>
                    </td>
                    <td style={{ padding: "0.875rem 1.5rem", color: "#94a3b8", fontSize: "0.8125rem" }}>
                      {s.joined}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick links */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginTop: "1.5rem" }}>
        {[
          { href: "/admin/students",    label: "All Students",      icon: "👥", desc: "View, search, and manage students" },
          { href: "/admin/permissions", label: "Permissions / RBAC", icon: "🔐", desc: "Manage roles and access control"    },
          { href: "/admin/audit",       label: "Audit Log",          icon: "📋", desc: "Who changed what and when"          },
          { href: "/admin/advanced",    label: "Advanced Cohort",    icon: "⭐", desc: "High performers and power users"   },
        ].map(({ href, label, icon, desc }) => (
          <a key={href} href={href} style={{ textDecoration: "none" }}>
            <div className="card card-hover" style={{ padding: "1.25rem" }}>
              <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{icon}</div>
              <p style={{ fontWeight: 700, color: "#0f172a", margin: "0 0 0.25rem", fontSize: "0.9375rem" }}>{label}</p>
              <p style={{ color: "#64748b", fontSize: "0.8125rem", margin: 0 }}>{desc}</p>
            </div>
          </a>
        ))}
      </div>

    </div>
  );
}
