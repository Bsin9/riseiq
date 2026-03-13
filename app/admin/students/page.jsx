import { requireRole } from "@/lib/auth/withAuth.js";

export const metadata = { title: "Students — RiseIQ Admin" };

const ALL_STUDENTS = [
  { id:"u_s01", name:"Alex Chen",     email:"student@riseiq.ca", course:"IELTS",  plan:"Pro",  band:6.5,  status:"Active",  joined:"2026-03-08", sessions:12 },
  { id:"u_s02", name:"Sara Patel",    email:"sara@example.com",  course:"IELTS",  plan:"Free", band:5.5,  status:"Active",  joined:"2026-03-01", sessions:4  },
  { id:"u_s03", name:"James Kim",     email:"jkim@example.com",  course:"SQL",    plan:"Pro",  band:null, status:"Active",  joined:"2026-02-20", sessions:8  },
  { id:"u_s04", name:"Priya Nair",    email:"priya@example.com", course:"Azure",  plan:"Pro",  band:null, status:"Paused",  joined:"2026-02-14", sessions:2  },
  { id:"u_s05", name:"Tom Nguyen",    email:"tom@example.com",   course:"IELTS",  plan:"Pro",  band:7.0,  status:"Active",  joined:"2026-01-30", sessions:31 },
  { id:"u_s06", name:"Mei Lin",       email:"mei@example.com",   course:"IELTS",  plan:"Free", band:6.0,  status:"Active",  joined:"2026-01-20", sessions:18 },
  { id:"u_s07", name:"David Osei",    email:"david@example.com", course:"SQL",    plan:"Pro",  band:null, status:"Active",  joined:"2026-01-15", sessions:22 },
  { id:"u_s08", name:"Fatima Hassan", email:"fat@example.com",   course:"IELTS",  plan:"Pro",  band:7.5,  status:"Active",  joined:"2026-01-10", sessions:45 },
];

const STATUS_COLOR = {
  Active:  { bg:"#dcfce7", color:"#166534" },
  Paused:  { bg:"#fef9c3", color:"#854d0e" },
  Expired: { bg:"#fee2e2", color:"#991b1b" },
};

export default async function StudentsPage() {
  await requireRole("admin");

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.5rem" }}>
        <div>
          <h1 style={{ fontSize:"1.5rem", fontWeight:800, color:"#0f172a", margin:0 }}>All Students</h1>
          <p style={{ color:"#64748b", margin:"0.25rem 0 0", fontSize:"0.875rem" }}>{ALL_STUDENTS.length} students total</p>
        </div>
      </div>

      <div className="card" style={{ padding:0, overflow:"hidden" }}>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"0.875rem" }}>
            <thead>
              <tr style={{ background:"#f8fafc" }}>
                {["Name","Email","Course","Plan","Band","Sessions","Status","Joined"].map((h) => (
                  <th key={h} style={{ padding:"0.75rem 1.25rem", textAlign:"left", fontWeight:600, color:"#64748b", fontSize:"0.75rem", textTransform:"uppercase", letterSpacing:"0.05em", borderBottom:"1px solid #e2e8f0" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ALL_STUDENTS.map((s, i) => {
                const badge = STATUS_COLOR[s.status] ?? STATUS_COLOR.Active;
                return (
                  <tr key={s.id} style={{ background: i%2===0?"#fff":"#f8fafc" }}>
                    <td style={{ padding:"0.875rem 1.25rem", fontWeight:600, color:"#0f172a" }}>{s.name}</td>
                    <td style={{ padding:"0.875rem 1.25rem", color:"#64748b" }}>{s.email}</td>
                    <td style={{ padding:"0.875rem 1.25rem" }}>
                      <span style={{ padding:"0.2rem 0.6rem", borderRadius:"9999px", fontSize:"0.75rem", fontWeight:600, background:"#f1f5f9", color:"#334155" }}>{s.course}</span>
                    </td>
                    <td style={{ padding:"0.875rem 1.25rem", color:"#64748b" }}>{s.plan}</td>
                    <td style={{ padding:"0.875rem 1.25rem", fontWeight:700, color:"#0f172a" }}>{s.band ?? "—"}</td>
                    <td style={{ padding:"0.875rem 1.25rem", color:"#64748b" }}>{s.sessions}</td>
                    <td style={{ padding:"0.875rem 1.25rem" }}>
                      <span style={{ padding:"0.2rem 0.6rem", borderRadius:"9999px", fontSize:"0.75rem", fontWeight:600, background:badge.bg, color:badge.color }}>{s.status}</span>
                    </td>
                    <td style={{ padding:"0.875rem 1.25rem", color:"#94a3b8", fontSize:"0.8125rem" }}>{s.joined}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
