import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions.js";
import { redirect } from "next/navigation";
import { ROUTES } from "@/config/routes.js";

export const metadata = {
  title: "Mock Test — RiseIQ",
  description: "Full-length IELTS mock exam under timed conditions",
};

const MOCK_TESTS = [
  {
    id: "mock-1",
    title: "IELTS Academic Mock Test 1",
    description:
      "Full-length 4-skill exam: Listening 30 min · Reading 60 min · Writing 60 min · Speaking 11–14 min",
    status: "available",
    estimatedTime: "2h 45min",
    sections: ["Listening", "Reading", "Writing", "Speaking"],
    difficulty: "Band 6.5–7.5",
  },
  {
    id: "mock-2",
    title: "IELTS Academic Mock Test 2",
    description: "Second complete practice exam with fresh passages and tasks",
    status: "coming_soon",
    estimatedTime: "2h 45min",
    sections: ["Listening", "Reading", "Writing", "Speaking"],
    difficulty: "Band 7.0–8.0",
  },
  {
    id: "mock-3",
    title: "IELTS Academic Mock Test 3",
    description: "Advanced exam targeting Band 7+ performance",
    status: "coming_soon",
    estimatedTime: "2h 45min",
    sections: ["Listening", "Reading", "Writing", "Speaking"],
    difficulty: "Band 7.5–8.5",
  },
];

const SECTION_CONFIG = {
  Listening: { icon: "🎧", color: "text-blue-600 bg-blue-50" },
  Reading: { icon: "📖", color: "text-emerald-600 bg-emerald-50" },
  Writing: { icon: "✍️", color: "text-violet-600 bg-violet-50" },
  Speaking: { icon: "🎙️", color: "text-orange-600 bg-orange-50" },
};

export default async function MockTestPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect(ROUTES.LOGIN);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-brand-navy)]">
            Mock Test
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Simulate real exam conditions across all four IELTS skills
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2">
          <span className="text-amber-500 text-sm">⏱️</span>
          <span className="text-xs font-medium text-amber-800">
            Timed · No pausing
          </span>
        </div>
      </div>

      {/* Prep Tip */}
      <div className="rounded-xl border border-[var(--color-brand-teal)]/30 bg-[var(--color-brand-teal)]/5 p-4">
        <p className="text-sm text-gray-700">
          <span className="font-semibold text-[var(--color-brand-teal)]">
            Pro tip:
          </span>{" "}
          Before starting, make sure you have a quiet space, headphones, and
          60–90 minutes free for each skill section. Synapse Brain will give you
          a full band score breakdown when you finish.
        </p>
      </div>

      {/* Mock Test Cards */}
      <div className="space-y-4">
        {MOCK_TESTS.map((test) => {
          const isAvailable = test.status === "available";
          return (
            <div
              key={test.id}
              className={`card transition-all ${
                isAvailable
                  ? "hover:shadow-md hover:border-[var(--color-brand-teal)]/40"
                  : "opacity-60"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-3 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-semibold text-[var(--color-brand-navy)]">
                      {test.title}
                    </h2>
                    {!isAvailable && (
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 border border-gray-200">
                        Coming Soon
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-500">{test.description}</p>

                  <div className="flex flex-wrap items-center gap-2">
                    {test.sections.map((sec) => {
                      const cfg = SECTION_CONFIG[sec];
                      return (
                        <span
                          key={sec}
                          className={`text-xs font-medium px-2 py-0.5 rounded-full ${cfg.color}`}
                        >
                          {cfg.icon} {sec}
                        </span>
                      );
                    })}
                  </div>

                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span>⏱ {test.estimatedTime}</span>
                    <span>🎯 {test.difficulty}</span>
                  </div>
                </div>

                {isAvailable && (
                  <button
                    disabled
                    className="flex-shrink-0 btn-primary text-sm opacity-80 cursor-not-allowed"
                    title="Full mock test coming soon"
                  >
                    Start Test
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Coming Soon Notice */}
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 text-center space-y-2">
        <div className="text-3xl">🚧</div>
        <h3 className="font-semibold text-gray-700">
          Full Mock Tests Coming Soon
        </h3>
        <p className="text-sm text-gray-500 max-w-md mx-auto">
          We&apos;re building a fully-timed exam engine with automatic scoring
          and Synapse Brain band score predictions. In the meantime, practice
          each skill individually using the menu on the left.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <a href={ROUTES.IELTS.READING} className="btn-secondary text-sm">
            Practice Reading
          </a>
          <a href={ROUTES.IELTS.WRITING} className="btn-secondary text-sm">
            Practice Writing
          </a>
        </div>
      </div>
    </div>
  );
}
