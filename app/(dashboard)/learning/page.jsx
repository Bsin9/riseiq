import Link from "next/link";
import { LEARNING_COURSES_LIST, LEARNING_STATS } from "@/data/learningCourses.js";
import { ROUTES } from "@/config/routes.js";

export const metadata = {
  title: "Learning Hub — RiseIQ",
  description: "Structured courses, practice tests, and certifications — all in one place.",
};

export default function LearningHubPage() {
  return (
    <div className="lhub-catalog">

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <div className="lhub-hero">
        <div className="lhub-hero-inner">
          <div className="lhub-hero-text">
            <p className="lhub-hero-eyebrow">RiseIQ Learning Hub</p>
            <h1 className="lhub-hero-title">Level up your skills</h1>
            <p className="lhub-hero-sub">
              Structured courses, practice tests, and certifications — all in one place.
            </p>
          </div>
          <div className="lhub-hero-stats">
            <div className="lhub-stat">
              <span className="lhub-stat-n">{LEARNING_STATS.totalCourses}</span>
              <span className="lhub-stat-l">Courses</span>
            </div>
            <div className="lhub-stat">
              <span className="lhub-stat-n">{LEARNING_STATS.totalLessons}+</span>
              <span className="lhub-stat-l">Lessons</span>
            </div>
            <div className="lhub-stat">
              <span className="lhub-stat-n">{LEARNING_STATS.totalHours}h</span>
              <span className="lhub-stat-l">Content</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Section header ───────────────────────────────────────────── */}
      <div className="lhub-section-head">
        <h2 className="lhub-section-title">Available Courses</h2>
        <span className="lhub-section-count">{LEARNING_STATS.totalCourses} courses</span>
      </div>

      {/* ── Course cards ─────────────────────────────────────────────── */}
      <div className="lhub-course-grid">
        {LEARNING_COURSES_LIST.map((course) => (
          <Link
            key={course.key}
            href={ROUTES.LEARNING_COURSE(course.key)}
            className="lhub-course-card"
          >
            {/* Card header */}
            <div
              className="lhub-card-header"
              style={{ borderBottom: `3px solid ${course.badgeColor}`, background: `${course.badgeColor}12` }}
            >
              <span className="lhub-card-icon">{course.icon}</span>
              <span
                className="lhub-card-badge"
                style={{ background: `${course.badgeColor}20`, color: course.badgeColor }}
              >
                {course.badge}
              </span>
            </div>

            {/* Card body */}
            <div className="lhub-card-body">
              <h3 className="lhub-card-title">{course.title}</h3>
              <p className="lhub-card-sub">{course.subtitle}</p>
              <p className="lhub-card-desc">{course.description.slice(0, 110)}…</p>

              {/* Meta row */}
              <div className="lhub-card-meta">
                <span className="lhub-meta-item">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                  {course.totalLessons} lessons
                </span>
                <span className="lhub-meta-item">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  {course.estimatedHours}h estimated
                </span>
                <span className="lhub-meta-item">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  {course.level}
                </span>
              </div>

              {/* Module chips */}
              <div className="lhub-card-modules">
                {course.modules.map((mod) => (
                  <span key={mod.key} className="lhub-mod-chip">
                    <span className="lhub-mod-dot" style={{ background: mod.color }} />
                    {mod.title}
                  </span>
                ))}
              </div>
            </div>

            {/* Card footer */}
            <div className="lhub-card-footer">
              <span className="lhub-start-btn" style={{ color: course.badgeColor }}>
                Start Learning
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </span>
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
}
