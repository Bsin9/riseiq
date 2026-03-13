import Link from "next/link";
import { notFound } from "next/navigation";
import { LEARNING_COURSES, LEARNING_COURSES_LIST } from "@/data/learningCourses.js";
import { ROUTES } from "@/config/routes.js";
import { ModuleTabs } from "@/components/learning/ModuleTabs.jsx";

/** Pre-generate routes for all courses at build time */
export function generateStaticParams() {
  return LEARNING_COURSES_LIST.map((c) => ({ courseKey: c.key }));
}

export function generateMetadata({ params }) {
  const course = LEARNING_COURSES[params.courseKey];
  if (!course) return {};
  return {
    title: `${course.title} — RiseIQ Learning Hub`,
    description: course.description,
  };
}

export default function CourseDetailPage({ params }) {
  const course = LEARNING_COURSES[params.courseKey];
  if (!course) notFound();

  const otherCourses = LEARNING_COURSES_LIST.filter((c) => c.key !== course.key);

  return (
    <div className="lhub-course-page">

      {/* ── Course hero ──────────────────────────────────────────────── */}
      <div
        className="lhub-course-hero"
        style={{
          background: `linear-gradient(135deg, ${course.badgeColor}18 0%, ${course.badgeColor}06 100%)`,
          borderBottom: `3px solid ${course.badgeColor}`,
        }}
      >
        <div className="lhub-course-hero-inner">
          <div className="lhub-course-hero-left">

            {/* Back link */}
            <Link href={ROUTES.LEARNING} className="lhub-back-link">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
              All Courses
            </Link>

            {/* Badge + level */}
            <div className="lhub-course-hero-badge-row">
              <span
                className="lhub-card-badge"
                style={{ background: `${course.badgeColor}20`, color: course.badgeColor }}
              >
                {course.badge}
              </span>
              <span className="lhub-course-hero-level">{course.level}</span>
            </div>

            <h1 className="lhub-course-hero-title">
              {course.icon} {course.title}
            </h1>
            <p className="lhub-course-hero-sub">{course.subtitle}</p>
            <p className="lhub-course-hero-desc">{course.description}</p>

            {/* Stats row */}
            <div className="lhub-course-hero-stats">
              <div className="lhub-hero-stat">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                <strong>{course.totalLessons}</strong> lessons
              </div>
              <div className="lhub-hero-stat">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <strong>{course.estimatedHours}h</strong> content
              </div>
              <div className="lhub-hero-stat">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
                <strong>{course.modules.length}</strong> modules
              </div>
            </div>
          </div>

          {/* Enroll card */}
          <div className="lhub-course-hero-right">
            <div className="lhub-enroll-card">
              <div className="lhub-enroll-icon">{course.icon}</div>
              <div className="lhub-enroll-title">Ready to start?</div>
              <p className="lhub-enroll-sub">Work through every module at your own pace.</p>
              <a
                className="lhub-enroll-btn"
                href="#modules"
                style={{ background: course.badgeColor }}
              >
                Start Course
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              </a>
              <div className="lhub-enroll-meta">
                <span>{course.estimatedHours}h estimated</span>
                <span>·</span>
                <span>{course.totalLessons} lessons</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Module tabs (client component) ───────────────────────────── */}
      <ModuleTabs modules={course.modules} />

      {/* ── Other courses ────────────────────────────────────────────── */}
      {otherCourses.length > 0 && (
        <div className="lhub-other-courses">
          <h3 className="lhub-other-title">Other Courses</h3>
          <div className="lhub-other-grid">
            {otherCourses.map((c) => (
              <Link key={c.key} href={ROUTES.LEARNING_COURSE(c.key)} className="lhub-other-card">
                <span className="lhub-other-icon">{c.icon}</span>
                <div className="lhub-other-info">
                  <div className="lhub-other-name">{c.title}</div>
                  <div className="lhub-other-meta">{c.totalLessons} lessons · {c.estimatedHours}h</div>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.4, flexShrink: 0 }} aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </Link>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
