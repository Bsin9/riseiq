import { requireRole } from "@/lib/auth/withAuth.js";

export const metadata = { title: "Audit Log — RiseIQ Admin" };

const AUDIT_LOG = [
  { id:1, actor:"admin@riseiq.ca",   action:"Updated student plan",     target:"sara@example.com",  detail:"Free → Pro",         ts:"2026-03-13 09:14" },
  { id:2, actor:"admin@riseiq.ca",   action:"Reset student password",   target:"jkim@example.com",  detail:"Password reset sent", ts:"2026-03-12 15:32" },
  { id:3, actor:"student@riseiq.ca", action:"Enrolled in course",       target:"self",              detail:"Enrolled: IELTS",     ts:"2026-03-08 11:00" },
  { id:4, actor:"admin@riseiq.ca",   action:"Issued certificate",       target:"fat@example.com",   detail:"IELTS Band 7.5",      ts:"2026-03-07 17:05" },
  { id:5, actor:"admin@riseiq.ca",   action:"Changed role",             target:"priya@example.com", detail:"student → student",   ts:"2026-03-06 10:48" },
  { id:6, actor:"system",            action:"Subscription renewed",     target:"tom@example.com",   detail:"Pro plan renewed",    ts:"2026-03-01 00:00" },
];

export default async function AuditPage() {
  await requireRole("admin");

  return (
    <div style={{ padding:"2rem", maxWidth:"1100px", margin:"0 auto" }}>
      <h1 style={{ fontSize:"1.5rem", fontWeight:800, color:"#0f172a", marginBottom:"0.375rem" }}>Audit Log</h1>
      <p style={{ color:"#64748b", marginBottom:"2rem", fontSize:"0.9375rem" }}>
        Read-only record of significant platform actions. Retained for 365 days.
      </p>

      <div className="card" style={{ padding:0, overflow:"hidden" }}>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"0.875rem" }}>
          <thead>
            <tr style={{ background:"#f8fafc" }}>
              {["Timestamp","Actor","Action","Target","Detail"].map((h) => (
                <th key={h} style={{ padding:"0.75rem 1.25rem", textAlign:"left", fontWeight:600, color:"#64748b", fontSize:"0.75rem", textTransform:"uppercase", letterSpacing:"0.05em", borderBottom:"1px solid #e2e8f0" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {AUDIT_LOG.map((e, i) => (
              <tr key={e.id} style={{ background:i%2===0?"#fff":"#f8fafc" }}>
                <td style={{ padding:"0.75rem 1.25rem", color:"#94a3b8", fontSize:"0.8rem", whiteSpace:"nowrap" }}>{e.ts}</td>
                <td style={{ padding:"0.75rem 1.25rem", fontWeight:600, color:"#334155", fontSize:"0.8125rem" }}>{e.actor}</td>
                <td style={{ padding:"0.75rem 1.25rem", color:"#0f172a" }}>{e.action}</td>
                <td style={{ padding:"0.75rem 1.25rem", color:"#64748b" }}>{e.target}</td>
                <td style={{ padding:"0.75rem 1.25rem", color:"#64748b", fontSize:"0.8125rem" }}>{e.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
