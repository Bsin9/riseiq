export const metadata = {
  title: "Certifications — RiseIQ",
  description: "Your earned certificates and completed courses.",
};

const CERTIFICATES = [
  {
    id: "cert_001",
    course: "IELTS Preparation",
    icon: "📝",
    color: "#6366f1",
    issuedDate: "2026-01-15",
    score: "Band 7.5",
    verifyId: "RISEIQ-2026-IELTS-7C9A",
    status: "earned",
  },
];

const IN_PROGRESS = [
  { id: "c_sql",   icon: "🗄️", course: "SQL Mastery",     color: "#f59e0b", progress: 34, totalLessons: 42 },
  { id: "c_azure", icon: "☁️", course: "Microsoft Azure", color: "#0ea5e9", progress: 0,  totalLessons: 54 },
];

export default function CertificationsPage() {
  const hasCerts = CERTIFICATES.length > 0;

  return (
    <div style={{ padding: "1.5rem", maxWidth: "900px", margin: "0 auto" }}>

      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.625rem", fontWeight: 800, color: "var(--color-brand-navy)", margin: 0 }}>
          🏆 Certifications
        </h1>
        <p style={{ color: "var(--color-brand-gray)", marginTop: "0.25rem", fontSize: "0.9375rem" }}>
          Your earned certificates and course completion records.
        </p>
      </div>

      {/* Earned certificates */}
      <section aria-label="Earned certificates" style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--color-brand-navy)", marginBottom: "1rem" }}>
          Earned Certificates ({CERTIFICATES.length})
        </h2>

        {!hasCerts ? (
          <div className="card" style={{ padding: "3rem 2rem", textAlign: "center" }}>
            <div style={{ fontSize: "3rem", marginBottom: "0.75rem" }}>🏆</div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--color-brand-navy)", marginBottom: "0.5rem" }}>
              No certificates yet
            </h3>
            <p style={{ color: "var(--color-brand-gray)", fontSize: "0.875rem" }}>
              Complete a course to earn your first certificate.
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {CERTIFICATES.map((cert) => (
              <div key={cert.id} className="card" style={{
                padding: "1.5rem",
                borderLeft: `4px solid ${cert.color}`,
                display: "flex", flexWrap: "wrap", gap: "1.5rem",
                justifyContent: "space-between", alignItems: "center",
              }}>
                {/* Left */}
                <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                  <div style={{
                    width: "3.5rem", height: "3.5rem", borderRadius: "0.875rem",
                    background: `${cert.color}15`, display: "flex", alignItems: "center",
                    justifyContent: "center", fontSize: "1.75rem", flexShrink: 0,
                  }}>
                    {cert.icon}
                  </div>
                  <div>
                    <p style={{ fontWeight: 800, fontSize: "1.0625rem", color: "var(--color-brand-navy)", margin: 0 }}>
                      {cert.course}
                    </p>
                    <p style={{ color: "var(--color-brand-gray)", fontSize: "0.8125rem", margin: "0.125rem 0 0" }}>
                      Issued {cert.issuedDate} · {cert.score}
                    </p>
                    <p style={{ color: "#94a3b8", fontSize: "0.75rem", margin: "0.25rem 0 0", fontFamily: "monospace" }}>
                      ID: {cert.verifyId}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                  <button style={{
                    padding: "0.5rem 1rem", borderRadius: "0.5rem", border: `1.5px solid ${cert.color}`,
                    background: "transparent", color: cert.color, fontWeight: 600,
                    fontSize: "0.8125rem", cursor: "pointer", fontFamily: "inherit",
                  }}>
                    📄 View Certificate
                  </button>
                  <button style={{
                    padding: "0.5rem 1rem", borderRadius: "0.5rem", border: "1.5px solid #e2e8f0",
                    background: "transparent", color: "var(--color-brand-gray)", fontWeight: 600,
                    fontSize: "0.8125rem", cursor: "pointer", fontFamily: "inherit",
                  }}>
                    🔗 Share / Verify
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* In-progress courses */}
      <section aria-label="Courses in progress">
        <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--color-brand-navy)", marginBottom: "1rem" }}>
          In Progress ({IN_PROGRESS.length})
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {IN_PROGRESS.map((c) => {
            const pct = Math.round((c.progress / c.totalLessons) * 100);
            return (
              <div key={c.id} className="card" style={{ padding: "1.25rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.75rem" }}>
                  <span style={{ fontSize: "1.5rem" }}>{c.icon}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 700, color: "var(--color-brand-navy)", margin: 0 }}>{c.course}</p>
                    <p style={{ fontSize: "0.75rem", color: "var(--color-brand-gray)", margin: "0.125rem 0 0" }}>
                      {c.progress} / {c.totalLessons} lessons · {pct}% complete
                    </p>
                  </div>
                </div>
                <div style={{ height: "6px", borderRadius: "9999px", background: "#f1f5f9", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: c.color, borderRadius: "9999px", transition: "width 0.5s" }} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
