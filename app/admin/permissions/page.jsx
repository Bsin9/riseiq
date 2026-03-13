import { requireRole } from "@/lib/auth/withAuth.js";

export const metadata = { title: "Permissions — RiseIQ Admin" };

const ROLES = [
  { role:"admin",   label:"Administrator", color:"#6366f1", perms:["All platform access","Student management","Billing","RBAC management","Audit log"] },
  { role:"student", label:"Student",       color:"#10b981", perms:["Own dashboard","Own progress","Own profile & billing","Learning Hub","Synapse (own history only)"] },
];

export default async function PermissionsPage() {
  await requireRole("admin");

  return (
    <div style={{ padding:"2rem", maxWidth:"900px", margin:"0 auto" }}>
      <h1 style={{ fontSize:"1.5rem", fontWeight:800, color:"#0f172a", marginBottom:"0.375rem" }}>Permissions & RBAC</h1>
      <p style={{ color:"#64748b", marginBottom:"2rem", fontSize:"0.9375rem" }}>
        Role-based access control — what each role can see and do.
      </p>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))", gap:"1.5rem" }}>
        {ROLES.map(({ role, label, color, perms }) => (
          <div key={role} className="card" style={{ padding:"1.5rem", borderTop:`3px solid ${color}` }}>
            <div style={{ display:"flex", alignItems:"center", gap:"0.625rem", marginBottom:"1.25rem" }}>
              <div style={{ width:"2rem", height:"2rem", borderRadius:"0.5rem", background:`${color}20`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1rem" }}>
                {role === "admin" ? "🔐" : "🎓"}
              </div>
              <div>
                <p style={{ fontWeight:700, fontSize:"1rem", color:"#0f172a", margin:0 }}>{label}</p>
                <p style={{ fontSize:"0.75rem", color:"#64748b", margin:0 }}>role: {role}</p>
              </div>
            </div>
            <ul style={{ margin:0, padding:0, listStyle:"none", display:"flex", flexDirection:"column", gap:"0.5rem" }}>
              {perms.map((p) => (
                <li key={p} style={{ display:"flex", alignItems:"center", gap:"0.5rem", fontSize:"0.875rem", color:"#334155" }}>
                  <span style={{ color, fontWeight:700 }}>✓</span> {p}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="card" style={{ padding:"1.5rem", marginTop:"1.5rem", background:"#fffbeb", border:"1px solid #fde68a" }}>
        <h3 style={{ fontSize:"0.9375rem", fontWeight:700, color:"#92400e", margin:"0 0 0.5rem" }}>⚠ Coming in Phase 2</h3>
        <p style={{ color:"#78350f", fontSize:"0.875rem", margin:0 }}>
          Granular permission management (invite admins, create custom roles, per-course access gates) is planned for Phase 2.
          Today roles are assigned at account creation and updated via backend config.
        </p>
      </div>
    </div>
  );
}
