import { getServerSession }          from "next-auth";
import { authOptions }               from "@/lib/auth/authOptions.js";
import { redirect }                  from "next/navigation";
import { getEnrolledCoursesMeta }    from "@/config/courseRegistry.js";
import { Sidebar }                   from "@/components/layout/Sidebar.jsx";
import { MobileNav }                 from "@/components/layout/MobileNav.jsx";

export default async function DashboardLayout({ children }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  // Derive enrolled course metadata from the JWT token (no DB call needed)
  const enrolledCourses = getEnrolledCoursesMeta(session.user.enrolledCourses ?? []);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--color-brand-gray-light)" }}>
      {/* Desktop sidebar */}
      <Sidebar enrolledCourses={enrolledCourses} />

      {/* Main content */}
      <main id="main-content" style={{ flex: 1, minWidth: 0, overflowX: "hidden", paddingBottom: "5rem" }}>
        {children}
      </main>

      {/* Mobile bottom nav */}
      <MobileNav />
    </div>
  );
}
