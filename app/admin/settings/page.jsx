import { requireRole } from "@/lib/auth/withAuth.js";
import { ROUTES } from "@/config/routes.js";

export const metadata = {
  title: "Admin Settings — RiseIQ",
  description: "Environment configuration and platform settings",
};

const SETTING_SECTIONS = [
  {
    key: "auth",
    title: "Authentication",
    icon: "🔐",
    settings: [
      {
        key: "NEXTAUTH_SECRET",
        label: "NextAuth Secret",
        status: "set",
        hint: "JWT signing key — required for all sessions",
      },
      {
        key: "NEXTAUTH_URL",
        label: "NextAuth URL",
        status: "set",
        hint: "Base URL used by NextAuth for callbacks",
      },
      {
        key: "GOOGLE_CLIENT_ID",
        label: "Google Client ID",
        status: "missing",
        hint: "OAuth 2.0 Client ID from Google Cloud Console",
        action: "https://console.cloud.google.com/apis/credentials",
      },
      {
        key: "GOOGLE_CLIENT_SECRET",
        label: "Google Client Secret",
        status: "missing",
        hint: "OAuth 2.0 Client Secret from Google Cloud Console",
        action: "https://console.cloud.google.com/apis/credentials",
      },
    ],
  },
  {
    key: "ai",
    title: "AI / Synapse Brain",
    icon: "🧠",
    settings: [
      {
        key: "ANTHROPIC_API_KEY",
        label: "Anthropic API Key",
        status: "set",
        hint: "Powers Synapse Brain feedback and content generation",
      },
    ],
  },
  {
    key: "payments",
    title: "Payments (Phase 2)",
    icon: "💳",
    settings: [
      {
        key: "STRIPE_SECRET_KEY",
        label: "Stripe Secret Key",
        status: "pending",
        hint: "Required for Pro plan subscriptions",
      },
      {
        key: "STRIPE_WEBHOOK_SECRET",
        label: "Stripe Webhook Secret",
        status: "pending",
        hint: "Validates incoming Stripe webhook events",
      },
    ],
  },
  {
    key: "database",
    title: "Database (Phase 2)",
    icon: "🗄️",
    settings: [
      {
        key: "DATABASE_URL",
        label: "PostgreSQL Connection URL",
        status: "pending",
        hint: "Prisma connection string — replaces mock JSON data",
      },
    ],
  },
  {
    key: "email",
    title: "Email (Phase 3)",
    icon: "📧",
    settings: [
      {
        key: "RESEND_API_KEY",
        label: "Resend API Key",
        status: "pending",
        hint: "For transactional emails — welcome, receipts, reminders",
      },
    ],
  },
];

const STATUS_STYLE = {
  set: {
    badge: "bg-green-100 text-green-800 border border-green-200",
    label: "Set",
    dot: "bg-green-500",
  },
  missing: {
    badge: "bg-red-100 text-red-800 border border-red-200",
    label: "Missing",
    dot: "bg-red-500",
  },
  pending: {
    badge: "bg-gray-100 text-gray-500 border border-gray-200",
    label: "Phase 2+",
    dot: "bg-gray-400",
  },
};

export default async function AdminSettingsPage() {
  await requireRole("admin");

  const allSettings = SETTING_SECTIONS.flatMap((s) => s.settings);
  const totalSet = allSettings.filter((s) => s.status === "set").length;
  const totalMissing = allSettings.filter((s) => s.status === "missing").length;
  const totalPending = allSettings.filter((s) => s.status === "pending").length;

  const missingSettings = allSettings.filter((s) => s.status === "missing");

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-brand-navy)]">
          Platform Settings
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Environment variable status and configuration guide
        </p>
      </div>

      {/* Summary Bar */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card text-center">
          <div className="text-3xl font-bold text-green-600">{totalSet}</div>
          <div className="text-xs text-gray-500 mt-1 font-medium uppercase tracking-wide">
            Configured
          </div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-red-600">{totalMissing}</div>
          <div className="text-xs text-gray-500 mt-1 font-medium uppercase tracking-wide">
            Missing
          </div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-gray-400">{totalPending}</div>
          <div className="text-xs text-gray-500 mt-1 font-medium uppercase tracking-wide">
            Pending
          </div>
        </div>
      </div>

      {/* Alert Banner */}
      {totalMissing > 0 && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <div className="flex items-start gap-3">
            <span className="text-red-500 text-lg">⚠️</span>
            <div>
              <p className="text-sm font-semibold text-red-800">
                {totalMissing} environment variable
                {totalMissing > 1 ? "s" : ""} missing
              </p>
              <ul className="mt-1 space-y-0.5">
                {missingSettings.map((s) => (
                  <li key={s.key} className="text-xs text-red-700">
                    <code className="font-mono">{s.key}</code> — {s.hint}
                    {s.action && (
                      <a
                        href={s.action}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 underline text-red-600 hover:text-red-800"
                      >
                        Configure →
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Setting Sections */}
      {SETTING_SECTIONS.map((section) => (
        <div key={section.key} className="card space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <span className="text-xl">{section.icon}</span>
            <h2 className="font-semibold text-[var(--color-brand-navy)]">
              {section.title}
            </h2>
          </div>
          <div className="space-y-3">
            {section.settings.map((setting) => {
              const style = STATUS_STYLE[setting.status];
              return (
                <div
                  key={setting.key}
                  className="flex items-start justify-between gap-4"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div
                      className={`mt-1.5 h-2 w-2 rounded-full flex-shrink-0 ${style.dot}`}
                    />
                    <div className="min-w-0">
                      <code className="text-sm font-mono font-semibold text-gray-800">
                        {setting.key}
                      </code>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {setting.hint}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${style.badge}`}
                  >
                    {style.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Google OAuth Setup Guide */}
      <div className="card space-y-4">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
          <span className="text-xl">🔑</span>
          <h2 className="font-semibold text-[var(--color-brand-navy)]">
            Google OAuth Setup Guide
          </h2>
        </div>
        <ol className="space-y-3">
          {[
            "Go to Google Cloud Console → APIs & Services → Credentials",
            'Click "Create Credentials" → OAuth 2.0 Client ID',
            'Set Application type to "Web application"',
            "Add Authorized JavaScript origin: https://riseiq.ca (and http://localhost:3000 for dev)",
            "Add Authorized redirect URI: https://riseiq.ca/api/auth/callback/google",
            "Also add: http://localhost:3000/api/auth/callback/google for local dev",
            "Copy the Client ID and Client Secret",
            "In Azure Portal → Static Web Apps → riseiq → Configuration → Application settings",
            'Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET, then click "Save"',
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="flex-shrink-0 h-6 w-6 rounded-full bg-[var(--color-brand-navy)] text-white text-xs flex items-center justify-center font-bold">
                {i + 1}
              </span>
              <p className="text-sm text-gray-600 pt-0.5">{step}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
