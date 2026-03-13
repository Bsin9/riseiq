/**
 * Next.js Edge Middleware — RBAC Route Protection
 *
 * Runs before every request. Enforces:
 *   1. Authenticated routes redirect unauthenticated users → /login
 *   2. Admin-only routes redirect non-admin users → /dashboard
 *   3. Authenticated users hitting /login or /signup redirect → /dashboard
 *   4. Admin users hitting /dashboard redirect → /admin (their home)
 *
 * Uses next-auth's getToken() — reads the JWT from the session cookie
 * without a full DB round-trip (edge-compatible).
 */

import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

// Routes that require authentication
const PROTECTED_PREFIXES = [
  "/dashboard",
  "/synapse",
  "/mock-test",
  "/progress",
  "/profile",
  "/learning",
  "/ielts",
  "/sql",
  "/azure",
  "/certifications",
  "/admin",
];

// Routes only admins can access
const ADMIN_ONLY_PREFIXES = ["/admin"];

// Routes only unauthenticated users should see (redirect logged-in users away)
const AUTH_ONLY_PATHS = ["/login", "/signup", "/forgot-password"];

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Skip Next.js internals and static assets
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET ?? "riseiq-demo-jwt-secret-2026",
  });

  const isAuthenticated = Boolean(token);
  const role = token?.role ?? "student";

  // ── 1. Unauthenticated → /login ───────────────────────────────────────────
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ── 2. Non-admin hitting /admin → /dashboard ──────────────────────────────
  const isAdminOnly = ADMIN_ONLY_PREFIXES.some((p) => pathname.startsWith(p));
  if (isAdminOnly && isAuthenticated && role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // ── 3. Logged-in users hitting /login|/signup → their home ───────────────
  const isAuthPage = AUTH_ONLY_PATHS.some((p) => pathname.startsWith(p));
  if (isAuthPage && isAuthenticated) {
    const home = role === "admin" ? "/admin" : "/dashboard";
    return NextResponse.redirect(new URL(home, request.url));
  }

  // ── 4. Admin user hitting /dashboard → /admin ────────────────────────────
  if (pathname === "/dashboard" && isAuthenticated && role === "admin") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Run on all paths except static files and API routes already excluded above
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
