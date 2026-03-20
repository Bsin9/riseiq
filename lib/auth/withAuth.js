import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions.js";
import { redirect } from "next/navigation";

/**
 * Server-side role guard.
 * Usage: await requireRole("admin") at the top of any server component or layout.
 * Redirects non-authenticated users to /login, and wrong-role users to /dashboard.
 */
export async function requireRole(role) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  if (session.user.role !== role) redirect("/dashboard");
  return session;
}

/**
 * Get the current session or redirect to login.
 */
export async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  return session;
}
