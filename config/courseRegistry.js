/**
 * COURSE_REGISTRY
 *
 * The single source of truth for all courses in RiseIQ.
 * Each entry maps a courseKey to metadata used by:
 *   - The sidebar (sub-links when inside /learning)
 *   - The dashboard (which section component to render)
 *   - Entitlement checks (visibility/lock logic)
 *
 * To add a new course: add an entry here + create a
 * components/dashboard/<Key>DashboardSection.jsx component.
 */

export const COURSE_REGISTRY = {
  ielts: {
    key:          "ielts",
    label:        "IELTS",
    icon:         "📝",
    badgeColor:   "#6366f1",
    learningPath: "/learning/ielts",
    /** Display weight — lower = rendered first on dashboard */
    weight:       1,
  },
  sql: {
    key:          "sql",
    label:        "SQL",
    icon:         "🗄️",
    badgeColor:   "#f59e0b",
    learningPath: "/learning/sql",
    weight:       2,
  },
  azure: {
    key:          "azure",
    label:        "Azure",
    icon:         "☁️",
    badgeColor:   "#0ea5e9",
    learningPath: "/learning/azure",
    weight:       3,
  },
};

/** Ordered array of all registered courses */
export const COURSE_REGISTRY_LIST = Object.values(COURSE_REGISTRY).sort(
  (a, b) => a.weight - b.weight
);

/**
 * Returns the subset of COURSE_REGISTRY entries the user is enrolled in,
 * sorted by weight, filtered to active enrollments only.
 *
 * @param {Array<{courseKey: string, status: string}>} enrolledCourses
 * @returns {Array}
 */
export function getEnrolledCoursesMeta(enrolledCourses = []) {
  const activeKeys = new Set(
    enrolledCourses
      .filter((e) => e.status === "active")
      .map((e) => e.courseKey)
  );
  return COURSE_REGISTRY_LIST.filter((c) => activeKeys.has(c.key));
}

/**
 * Returns true if the user is actively enrolled in a specific course.
 *
 * @param {Array<{courseKey: string, status: string}>} enrolledCourses
 * @param {string} courseKey
 * @returns {boolean}
 */
export function isEnrolledIn(enrolledCourses = [], courseKey) {
  return enrolledCourses.some(
    (e) => e.courseKey === courseKey && e.status === "active"
  );
}
