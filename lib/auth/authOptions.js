import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider       from "next-auth/providers/google";

/**
 * ─── TEST ACCOUNTS ────────────────────────────────────────────────────────────
 * Replace with a real database lookup before going to production.
 *
 * Student  → student@riseiq.ca / student2026
 * Admin    → admin@riseiq.ca   / admin2026
 * Legacy   → demo@riseiq.ca    / demo1234   (kept for backwards compat)
 * ─────────────────────────────────────────────────────────────────────────────
 */
const TEST_ACCOUNTS = {
  "student@riseiq.ca": {
    id:              "u_student",
    email:           "student@riseiq.ca",
    name:            "Alex Chen",
    role:            "student",
    plan:            "pro",
    targetBand:      7.5,
    examDate:        "2026-05-15",
    enrolledCourses: ["ielts"],
    password:        "student2026",
  },
  "admin@riseiq.ca": {
    id:              "u_admin",
    email:           "admin@riseiq.ca",
    name:            "RiseIQ Admin",
    role:            "admin",
    plan:            "admin",
    targetBand:      null,
    examDate:        null,
    enrolledCourses: [],
    password:        "admin2026",
  },
  // Legacy demo account — kept for backwards compat
  "demo@riseiq.ca": {
    id:              "u_001",
    email:           "demo@riseiq.ca",
    name:            "RiseIQ Student",
    role:            "student",
    plan:            "pro",
    targetBand:      7.5,
    examDate:        "2026-05-10",
    enrolledCourses: ["ielts"],
    password:        "demo1234",
  },
};

/** NextAuth.js configuration — JWT-based, HTTPS-only cookies, RBAC */
export const authOptions = {
  providers: [
    // ── Google OAuth ─────────────────────────────────────────────────────────
    // Requires GOOGLE_CLIENT_ID + GOOGLE_CLIENT_SECRET in Azure SWA env vars.
    // Google users are assigned role="student" by default on first sign-in.
    GoogleProvider({
      clientId:     process.env.GOOGLE_CLIENT_ID     ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      authorization: {
        params: {
          prompt:        "consent",
          access_type:   "offline",
          response_type: "code",
        },
      },
    }),

    // ── Email / Password ─────────────────────────────────────────────────────
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email:    { label: "Email",    type: "email"    },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const account = TEST_ACCOUNTS[credentials?.email?.toLowerCase()];
        if (!account) return null;
        if (credentials.password !== account.password) return null;

        // Return only what gets embedded in the JWT (no password)
        const { password: _, ...safeAccount } = account;
        return safeAccount;
      },
    }),
  ],

  session: { strategy: "jwt" },

  callbacks: {
    /**
     * jwt — runs on sign-in and every token refresh.
     * For Google OAuth, assign default role="student" unless the email is
     * already in TEST_ACCOUNTS (lets admins use Google sign-in too).
     */
    async jwt({ token, user, account }) {
      if (user) {
        // Credentials provider — all fields already set
        token.id             = user.id;
        token.role           = user.role           ?? "student";
        token.plan           = user.plan           ?? "free";
        token.targetBand     = user.targetBand     ?? null;
        token.examDate       = user.examDate       ?? null;
        token.enrolledCourses = user.enrolledCourses ?? [];
      }

      // Google OAuth — user object only available on first sign-in
      if (account?.provider === "google" && !token.role) {
        const existing = TEST_ACCOUNTS[token.email?.toLowerCase()];
        token.id             = existing?.id        ?? `google_${Date.now()}`;
        token.role           = existing?.role      ?? "student";
        token.plan           = existing?.plan      ?? "free";
        token.targetBand     = existing?.targetBand ?? null;
        token.examDate       = existing?.examDate   ?? null;
        token.enrolledCourses = existing?.enrolledCourses ?? [];
      }

      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id              = token.id;
        session.user.role            = token.role;
        session.user.plan            = token.plan;
        session.user.targetBand      = token.targetBand;
        session.user.examDate        = token.examDate;
        session.user.enrolledCourses = token.enrolledCourses;
      }
      return session;
    },
  },

  pages: {
    signIn:  "/login",
    signOut: "/login",
    error:   "/login",
  },

  secret: process.env.NEXTAUTH_SECRET ?? "riseiq-demo-jwt-secret-2026",
};
