import Link from "next/link";
import { ROUTES } from "@/config/routes.js";

/**
 * Azure-specific dashboard section stub.
 * Rendered by DashboardPage only when the user is enrolled in Azure.
 */
export function AzureDashboardSection({ enrollment }) {
  return (
    <section aria-label="Azure Progress">

      {/* Section header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: "1rem", paddingBottom: "0.625rem",
        borderBottom: "2px solid #0ea5e920",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
          <div style={{
            width: "2rem", height: "2rem", borderRadius: "0.5rem",
            background: "#0ea5e915", display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: "1rem",
          }}>
            ☁️
          </div>
          <div>
            <h2 style={{
              fontSize: "1rem", fontWeight: 700,
              color: "var(--color-brand-navy)", margin: 0,
            }}>
              Microsoft Azure
            </h2>
            <p style={{ fontSize: "0.75rem", color: "var(--color-brand-gray)", margin: 0 }}>
              Cloud infrastructure &amp; certification prep
            </p>
          </div>
        </div>
        <Link
          href={ROUTES.LEARNING_COURSE("azure")}
          style={{ fontSize: "0.8rem", color: "#0ea5e9", fontWeight: 600, textDecoration: "none" }}
        >
          View Course →
        </Link>
      </div>

      {/* Coming-soon placeholder */}
      <div className="card" style={{
        padding: "1.5rem", textAlign: "center",
        background: "#0ea5e908", border: "1px dashed #0ea5e940",
      }}>
        <p style={{ color: "var(--color-brand-gray)", fontSize: "0.875rem", margin: 0 }}>
          Azure lab widgets coming soon. In the meantime,{" "}
          <Link href={ROUTES.LEARNING_COURSE("azure")} style={{ color: "#0ea5e9", fontWeight: 600 }}>
            browse the Azure course →
          </Link>
        </p>
      </div>

    </section>
  );
}
