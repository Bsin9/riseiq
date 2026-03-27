import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions.js";
import { redirect } from "next/navigation";
import { ROUTES } from "@/config/routes.js";

export const metadata = {
  title: "My Progress — RiseIQ",
  description: "Track your IELTS band score improvement over time",
};

// Mock progress data — replace with Prisma queries in Phase 2
const MOCK_PROGRESS = {
  targetBand: 7.5,
  examDate: "2026-05-15",
  currentEstimate: 6.5,
  skills: [
    {
      key: "listening",
      label: "Listening",
      icon: "🎧",
      currentBand: 7.0,
      targetBand: 7.5,
      sessionsCompleted: 4,
      lastSession: "2026-03-22",
      route: ROUTES.IELTS.LISTENING,
      trend: "up",
      history: [5.5, 6.0, 6.5, 7.0],
    },
    {
      key: "reading",
      label: "Reading",
      icon: "📖",
      currentBand: 6.5,
      targetBand: 7.5,
      sessionsCompleted: 3,
      lastSession: "2026-03-20",
      route: ROUTES.IELTS.READING,
      trend: "up",
      history: [5.5, 6.0, 6.5],
    },
    {
      key: "writing",
      label: "Writing",
      icon: "✍️",
      currentBand: 6.0,
      targetBand: 7.5,
      sessionsCompleted: 5,
      lastSession: "2026-03-24",
      route: ROUTES.IELTS.WRITING,
      trend: "up",
      history: [5.0, 5.5, 5.5, 6.0, 6.0],
    },
    {
      key: "speaking",
      label: "Speaking",
      icon: "🎙️",
      currentBand: 6.5,
      targetBand: 7.5,
      sessionsCompleted: 2,
      lastSession: "2026-03-18",
      route: ROUTES.IELTS.SPEAKING,
      trend: "stable",
      history: [6.0, 6.5],
    },
  ],
};

function daysUntil(dateStr) {
  const target = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
  return diff;
}

function BandBar({ current, target }) {
  const pct = Math.min((current / 9) * 100, 100);
  const targetPct = Math.min((target / 9) * 100, 100);
  return (
    <div className="relative h-2.5 rounded-full bg-gray-100 overflow-visible">
      {/* Target marker */}
      <div
        className="absolute top-1/2 -translate-y-1/2 h-4 w-0.5 bg-[var(--color-brand-gold)] rounded-full z-10"
        style={{ left: `${targetPct}%` }}
        title={`Target: ${target}`}
      />
      {/* Progress fill */}
      <div
        className="h-full rounded-full bg-gradient-to-r from-[var(--color-brand-navy)] to-[var(--color-brand-teal)] transition-all duration-700"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export default async function ProgressPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect(ROUTES.LOGIN);

  const daysLeft = daysUntil(MOCK_PROGRESS.examDate);
  const overallGap = MOCK_PROGRESS.targetBand - MOCK_PROGRESS.currentEstimate;
  const totalSessions = MOCK_PROGRESS.skills.reduce(
    (sum, s) => sum + s.sessionsCompleted,
    0
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-brand-navy)]">
          My Progress
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Band score tracking across all four IELTS skills
        </p>
      </div>

      {/* Exam Countdown + Overall Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card text-center col-span-2 sm:col-span-1">
          <div className="text-3xl font-bold text-[var(--color-brand-gold)]">
            {daysLeft}
          </div>
          <div className="text-xs text-gray-500 mt-1 font-medium uppercase tracking-wide">
            Days to Exam
          </div>
          <div className="text-xs text-gray-400 mt-0.5">
            {new Date(MOCK_PROGRESS.examDate).toLocaleDateString("en-CA", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-[var(--color-brand-teal)]">
            {MOCK_PROGRESS.currentEstimate}
          </div>
          <div className="text-xs text-gray-500 mt-1 font-medium uppercase tracking-wide">
            Current Band
          </div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-[var(--color-brand-navy)]">
            {MOCK_PROGRESS.targetBand}
          </div>
          <div className="text-xs text-gray-500 mt-1 font-medium uppercase tracking-wide">
            Target Band
          </div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-gray-700">
            {totalSessions}
          </div>
          <div className="text-xs text-gray-500 mt-1 font-medium uppercase tracking-wide">
            Sessions Done
          </div>
        </div>
      </div>

      {/* Gap Notice */}
      {overallGap > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 flex items-start gap-3">
          <span className="text-amber-500 text-lg">🎯</span>
          <div>
            <p className="text-sm font-semibold text-amber-800">
              {overallGap} band to go — you&apos;re on track
            </p>
            <p className="text-xs text-amber-700 mt-0.5">
              Focus on Writing to close the biggest gap. Synapse Brain feedback
              is your fastest lever.
            </p>
          </div>
        </div>
      )}

      {/* Skill Cards */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
          Skill Breakdown
        </h2>
        {MOCK_PROGRESS.skills.map((skill) => {
          const gap = skill.targetBand - skill.currentBand;
          const trendIcon =
            skill.trend === "up"
              ? "↑"
              : skill.trend === "down"
              ? "↓"
              : "→";
          const trendColor =
            skill.trend === "up"
              ? "text-green-600"
              : skill.trend === "down"
              ? "text-red-500"
              : "text-gray-400";

          return (
            <div key={skill.key} className="card space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{skill.icon}</span>
                  <div>
                    <h3 className="font-semibold text-[var(--color-brand-navy)]">
                      {skill.label}
                    </h3>
                    <p className="text-xs text-gray-400">
                      {skill.sessionsCompleted} session
                      {skill.sessionsCompleted !== 1 ? "s" : ""} completed ·
                      Last:{" "}
                      {new Date(skill.lastSession).toLocaleDateString("en-CA", {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-[var(--color-brand-navy)]">
                      {skill.currentBand}
                    </span>
                    <span className={`text-sm font-bold ${trendColor}`}>
                      {trendIcon}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">
                    Target: {skill.targetBand}
                  </p>
                </div>
              </div>

              <BandBar
                current={skill.currentBand}
                target={skill.targetBand}
              />

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  {gap > 0 ? (
                    <>
                      <span className="text-amber-600 font-semibold">
                        +{gap} band needed
                      </span>
                    </>
                  ) : (
                    <span className="text-green-600 font-semibold">
                      Target reached ✓
                    </span>
                  )}
                </span>
                <a
                  href={skill.route}
                  className="text-xs font-semibold text-[var(--color-brand-teal)] hover:underline"
                >
                  Practice {skill.label} →
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Phase 2 Notice */}
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 text-center space-y-1">
        <p className="text-sm font-semibold text-gray-600">
          📊 Detailed analytics coming in Phase 2
        </p>
        <p className="text-xs text-gray-400">
          Session-by-session band history, Synapse score predictions, and
          practice recommendations will live here once the database is
          connected.
        </p>
      </div>
    </div>
  );
}
