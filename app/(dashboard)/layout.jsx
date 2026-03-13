import { Sidebar }  from "@/components/layout/Sidebar.jsx";
import { MobileNav } from "@/components/layout/MobileNav.jsx";
import userData from "@/data/users.json";

export default function DashboardLayout({ children }) {
  // In production this would come from the auth session; for now read from static data
  const user = userData[0];
  const enrolledCourses = user?.enrolledCourses ?? [];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--color-brand-gray-light)" }}>
      {/* Desktop sidebar */}
      <Sidebar enrolledCourses={enrolledCourses} />

      {/* Main content */}
      <main id="main-content" style={{ flex: 1, minWidth: 0, overflowX: "hidden" }}>
        {children}
      </main>

      {/* Mobile bottom nav */}
      <MobileNav />
    </div>
  );
}
