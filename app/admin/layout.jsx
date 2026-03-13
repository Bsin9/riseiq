import { AdminSidebar } from "@/components/layout/AdminSidebar.jsx";
import { requireRole }  from "@/lib/auth/withAuth.js";

export default async function AdminLayout({ children }) {
  // Server-side guard — redirects non-admins to /dashboard
  await requireRole("admin");

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f1f5f9" }}>
      <AdminSidebar />
      <main id="admin-main" style={{ flex: 1, minWidth: 0, overflowX: "hidden" }}>
        {children}
      </main>
    </div>
  );
}
