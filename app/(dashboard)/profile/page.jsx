import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions.js";
import { redirect } from "next/navigation";
import { ROUTES } from "@/config/routes.js";

export const metadata = {
  title: "My Profile — RiseIQ",
  description: "Manage your account, exam goal, and preferences",
};

const ENROLLED_COURSES = [
  {
    key: "ielts",
    label: "IELTS Academic",
    icon: "📚",
    status: "active",
    route: ROUTES.IELTS.ROOT,
  },
];

const PLAN_FEATURES = {
  free: [
    "3 practice sessions per skill per month",
    "Synapse Brain basic feedback",
    "Band score estimates",
    "Progress tracking",
  ],
  pro: [
    "Unlimited practice sessions",
    "Synapse Brain detailed feedback",
    "Full mock tests with scoring",
    "Priority support",
    "Certificate of completion",
  ],
};

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect(ROUTES.LOGIN);

  const user = session.user;
  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user.email?.[0]?.toUpperCase() ?? "?";

  const currentPlan = user.plan ?? "free";
  const isPro = currentPlan === "pro";

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-brand-navy)]">
          My Profile
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Account details, exam goal, and plan
        </p>
      </div>

      {/* Profile Card */}
      <div className="card flex items-start gap-5">
        {/* Avatar */}
        <div className="flex-shrink-0 h-16 w-16 rounded-2xl bg-gradient-to-br from-[var(--color-brand-navy)] to-[var(--color-brand-teal)] flex items-center justify-center text-white text-xl font-bold shadow-sm">
          {user.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.image}
              alt={user.name ?? "Avatar"}
              className="h-16 w-16 rounded-2xl object-cover"
            />
          ) : (
            initials
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-lg font-bold text-[var(--color-brand-navy)]">
              {user.name ?? "Student"}
            </h2>
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                isPro
                  ? "bg-[var(--color-brand-gold)]/10 text-[var(--color-brand-gold)] border-[var(--color-brand-gold)]/30"
                  : "bg-gray-100 text-gray-500 border-gray-200"
              }`}
            >
              {isPro ? "Pro" : "Free Plan"}
            </span>
            {user.role === "admin" && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[var(--color-brand-navy)]/10 text-[var(--color-brand-navy)] border border-[var(--color-brand-navy)]/20">
                Admin
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-0.5">{user.email}</p>
          <p className="text-xs text-gray-400 mt-1">
            Member since{" "}
            {new Date().toLocaleDateString("en-CA", {
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Exam Goal */}
      <div className="card space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h2 className="font-semibold text-[var(--color-brand-navy)] flex items-center gap-2">
            🎯 Exam Goal
          </h2>
          <span className="text-xs text-gray-400">IELTS Academic</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">
              Target Band
            </p>
            <p className="text-2xl font-bold text-[var(--color-brand-gold)]">
              7.5
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">
              Exam Date
            </p>
            <p className="text-2xl font-bold text-[var(--color-brand-navy)]">
              May 15
            </p>
            <p className="text-xs text-gray-400">2026</p>
          </div>
        </div>
        <p className="text-xs text-gray-400 border-t border-gray-100 pt-3">
          Editing exam goals will be available once the database is connected in
          Phase 2.
        </p>
      </div>

      {/* Enrolled Courses */}
      <div className="card space-y-4">
        <h2 className="font-semibold text-[var(--color-brand-navy)] border-b border-gray-100 pb-3">
          📚 Enrolled Courses
        </h2>
        <div className="space-y-2">
          {ENROLLED_COURSES.map((course) => (
            <a
              key={course.key}
              href={course.route}
              className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-[var(--color-brand-teal)]/40 hover:bg-[var(--color-brand-teal)]/5 transition-all group"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{course.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {course.label}
                  </p>
                  <p className="text-xs text-green-600 font-medium capitalize">
                    {course.status}
                  </p>
                </div>
              </div>
              <span className="text-gray-300 group-hover:text-[var(--color-brand-teal)] transition-colors">
                →
              </span>
            </a>
          ))}
        </div>
        <p className="text-xs text-gray-400">
          SQL and Azure courses coming in Phase 4.
        </p>
      </div>

      {/* Plan */}
      <div className="card space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h2 className="font-semibold text-[var(--color-brand-navy)]">
            💳 Your Plan
          </h2>
          <span
            className={`text-sm font-bold ${
              isPro
                ? "text-[var(--color-brand-gold)]"
                : "text-gray-500"
            }`}
          >
            {isPro ? "Pro" : "Free"}
          </span>
        </div>
        <ul className="space-y-2">
          {(isPro ? PLAN_FEATURES.pro : PLAN_FEATURES.free).map((feature) => (
            <li key={feature} className="flex items-center gap-2 text-sm text-gray-600">
              <span className={isPro ? "text-green-500" : "text-gray-400"}>
                ✓
              </span>
              {feature}
            </li>
          ))}
        </ul>
        {!isPro && (
          <div className="pt-2 border-t border-gray-100">
            <button
              disabled
              className="w-full btn-primary opacity-80 cursor-not-allowed text-sm"
              title="Stripe integration coming in Phase 2"
            >
              Upgrade to Pro — coming soon
            </button>
            <p className="text-xs text-gray-400 text-center mt-2">
              Stripe payments launching in Phase 2
            </p>
          </div>
        )}
      </div>

      {/* Account Actions */}
      <div className="card space-y-3">
        <h2 className="font-semibold text-[var(--color-brand-navy)] border-b border-gray-100 pb-3">
          ⚙️ Account
        </h2>
        <div className="space-y-2">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-gray-700">
                Authentication
              </p>
              <p className="text-xs text-gray-400">
                Signed in via credentials
              </p>
            </div>
            <span className="text-xs text-green-600 font-semibold bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
              Active
            </span>
          </div>
          <div className="border-t border-gray-100 pt-2">
            <a
              href={ROUTES.LOGOUT ?? "/api/auth/signout"}
              className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors"
            >
              Sign out →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
