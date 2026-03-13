/**
 * Centralized route constants — import from here instead of hard-coding paths
 */

export const ROUTES = {
  // Public
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  FORGOT_PASSWORD: "/forgot-password",

  // Public marketing
  COURSES: "/courses",
  COURSE: (slug) => `/courses/${slug}`,
  PRICING: "/pricing",
  ABOUT: "/about",
  BLOG: "/blog",
  CONTACT: "/contact",

  // Dashboard
  DASHBOARD: "/dashboard",
  MY_COURSES: "/my-courses",

  // Practice modules (IELTS) — legacy aliases kept for backwards compat
  PRACTICE: {
    ROOT: "/practice",
    READING: "/ielts/reading",
    WRITING: "/ielts/writing",
    LISTENING: "/ielts/listening",
    SPEAKING: "/ielts/speaking",
  },

  // IELTS course-scoped pages
  IELTS: {
    ROOT: "/ielts",
    READING: "/ielts/reading",
    WRITING: "/ielts/writing",
    LISTENING: "/ielts/listening",
    SPEAKING: "/ielts/speaking",
  },

  // SQL course-scoped pages
  SQL: {
    ROOT: "/sql",
    PRACTICE: "/sql/practice",
  },

  // Azure course-scoped pages
  AZURE: {
    ROOT: "/azure",
    LABS: "/azure/labs",
  },

  // Session engine
  SESSION: (id) => `/session/${id}`,

  // Learning Hub
  LEARNING: "/learning",
  LEARNING_COURSE: (key) => `/learning/${key}`,

  // AI Study Assistant
  SYNAPSE: "/synapse",

  // Other protected pages
  MOCK_TEST:        "/mock-test",
  PROGRESS:         "/progress",
  PROFILE:          "/profile",
  CERTIFICATIONS:   "/certifications",

  // Admin portal
  ADMIN: {
    ROOT:        "/admin",
    STUDENTS:    "/admin/students",
    ADVANCED:    "/admin/advanced",
    PERMISSIONS: "/admin/permissions",
    AUDIT:       "/admin/audit",
    SETTINGS:    "/admin/settings",
  },

  // API
  API: {
    USER_PROGRESS: "/api/user/progress",
    WEAK_AREAS: "/api/user/weak-areas",
    SESSION_SUBMIT: (id) => `/api/sessions/${id}/submit`,
    WRITING_DRAFT: "/api/writing/save-draft",
    MOCK_TESTS: "/api/mock-tests",
    MODULE_LESSONS: (id) => `/api/modules/${id}/lessons`,
    SLACK_NOTIFY: "/api/slack/notify",
  },
};
