import { requireRole } from "@/lib/auth/withAuth.js";

export const metadata = { title: "Advanced Cohort — RiseIQ Admin" };

// High-performers: band ≥ 7.0 OR sessions ≥ 30
const ADVANCED = [
  { id:"u_s05", name:"Tom Nguyen",    email:"tom@example.com", course:"IELTS", band:7.0, sessions:31, badge:"High Performer" },
  { id:"u_s08", name:"Fatima Hassan", email:"fat@example.com", course:"IELTS", band:7.5, sessions:45, badge:"Top Student"    },
];

export default async function AdvancedPage() {
  await requireRole("admin");

  return (
    <div style={{ padding:"2rem", maxWidth:"1000px", margin:"0 auto" }}>
      <h1 style={{ fontSize:"1.5rem", fontWeight:800, color:"#0f172a", marginBottom:"0.375rem" }}>Advanced Cohort</h1>
      <p style={{ color:"#64748b", marginBottom:"2rem", fontSize:"0.9375rem" }}>
        Power users and high performers — Band 7.0+ or 30+ sessions. {ADVANCED.length} students qualify.
      </p>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))", gap:"1rem" }}>
        {ADVANCED.map((s) => (
          <div key={s.id} className="card" style={{ padding:"1.5rem", borderLeft:"3px solid #8b5cf6" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"1rem" }}>
              <div>
                <p style={{ fontWeight:700, fontSize:"1rem", color:"#0f172a", margin:0 }}>{s.name}</p>
                <p style={{ fontSize:"0.75rem", color:"#64748b", margin:"0.125rem 0 0" }}>{s.email}</p>
              </div>
              <span style={{ padding:"0.2rem 0.625rem", borderRadius:"9999px", fontSize:"0.7rem", fontWeight:700, background:"#f3e8ff", color:"#7c3aed" }}>
                ⭐ {s.badge}
              </span>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"0.75rem" }}>
              {[
                { label:"Course",   value:s.course },
                { label:"Band",     value:s.band ?? "—" },
                { label:"Sessions", value:s.sessions },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p style={{ fontSize:"0.65rem", color:"#94a3b8", fontWeight:600, textTransform:"uppercase", margin:"0 0 0.125rem" }}>{label}</p>
                  <p style={{ fontSize:"1.1rem", fontWeight:800, color:"#0f172a", margin:0 }}>{value}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
