import Link from "next/link";
import { ROUTES } from "@/config/routes.js";

/**
 * SQL-specific dashboard section stub.
 * Rendered by DashboardPage only when the user is enrolled in SQL.
 */
export function SQLDashboardSection({ enrollment }) {
  return (
    <section aria-label="SQL Progress">

      {/* Section header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: "1rem", paddingBottom: "0.625rem",
        borderBottom: "2px solid #f59e0b20",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
          <div style={{
            width: "2rem", height: "2rem", borderRadius: "0.5rem",
            background: "#f59e0b15", display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: "1rem",
          }}>
            🗄️
          </div>
          <div>
            <h2 style={{
              fontSize: "1rem", fontWeight: 700,
              color: "var(--color-brand-navy)", margin: 0,
            }}>
              SQL Mastery
            </h2>
            <p style={{ fontSize: "0.75rem", color: "var(--color-brand-gray)", margin: 0 }}>
              Database querying &amp; data modelling
            </p>
          </div>
        </div>
        <Link
          href={ROUTES.LEARNING_COURSE("sql")}
          style={{ fontSize: "0.8rem", color: "#f59e0b", fontWeight: 600, textDecoration: "none" }}
        >
          View Course →
        </Link>
      </div>

      {/* Coming-soon placeholder */}
      <div className="card" style={{
        padding: "1.5rem", textAlign: "center",
        background: "#f59e0b08", border: "1px dashed #f59e0b40",
      }}>
        <p style={{ color: "var(--color-brand-gray)", fontSize: "0.875rem", margin: 0 }}>
          SQL practice widgets coming soon. In the meantime,{" "}
          <Link href={ROUTES.LEARNING_COURSE("sql")} style={{ color: "#f59e0b", fontWeight: 600 }}>
            browse the SQL course →
          </Link>
        </p>
      </div>

    </section>
  );
}
