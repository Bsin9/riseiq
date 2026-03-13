/**
 * Learning Hub — course catalogue data
 * Three courses: IELTS · SQL · Azure
 */

export const LEARNING_COURSES = {
  ielts: {
    key: "ielts",
    title: "IELTS Preparation",
    subtitle: "International English Language Testing System",
    badge: "Language",
    badgeColor: "#6366f1",
    level: "Beginner → Advanced",
    totalLessons: 48,
    estimatedHours: 40,
    icon: "📝",
    description:
      "Master all four IELTS skills with structured practice tests, expert strategies, and band-score focused training for Academic and General Training modules.",
    modules: [
      {
        key: "reading",
        title: "Reading",
        icon: "📖",
        color: "#6366f1",
        lessons: [
          { title: "Understanding Academic Texts",        duration: "25 min", type: "lesson" },
          { title: "Skimming & Scanning Techniques",      duration: "30 min", type: "lesson" },
          { title: "True / False / Not Given",            duration: "20 min", type: "lesson" },
          { title: "Matching Headings",                   duration: "25 min", type: "lesson" },
          { title: "Summary Completion",                  duration: "20 min", type: "lesson" },
          { title: "Practice Test — Reading Band 7+",    duration: "60 min", type: "test"   },
        ],
      },
      {
        key: "writing",
        title: "Writing",
        icon: "✍️",
        color: "#8b5cf6",
        lessons: [
          { title: "Task 1 — Describing Graphs & Charts",   duration: "35 min", type: "lesson" },
          { title: "Task 1 — Process Diagrams & Maps",      duration: "30 min", type: "lesson" },
          { title: "Task 2 — Essay Structure",              duration: "40 min", type: "lesson" },
          { title: "Task 2 — Argument & Opinion Essays",    duration: "35 min", type: "lesson" },
          { title: "Vocabulary for Band 7+",               duration: "25 min", type: "lesson" },
          { title: "Practice Test — Full Writing Section", duration: "60 min", type: "test"   },
        ],
      },
      {
        key: "listening",
        title: "Listening",
        icon: "🎧",
        color: "#06b6d4",
        lessons: [
          { title: "Section 1 — Everyday Social Conversations", duration: "20 min", type: "lesson" },
          { title: "Section 2 — Monologues & Announcements",    duration: "20 min", type: "lesson" },
          { title: "Section 3 — Academic Discussion",           duration: "25 min", type: "lesson" },
          { title: "Section 4 — Academic Lecture",              duration: "25 min", type: "lesson" },
          { title: "Note & Form Completion",                    duration: "20 min", type: "lesson" },
          { title: "Practice Test — Full Listening Section",   duration: "40 min", type: "test"   },
        ],
      },
      {
        key: "speaking",
        title: "Speaking",
        icon: "🎤",
        color: "#10b981",
        lessons: [
          { title: "Part 1 — Introduction & Interview",   duration: "20 min", type: "lesson" },
          { title: "Part 2 — Long Turn (Cue Card)",       duration: "25 min", type: "lesson" },
          { title: "Part 3 — Two-way Discussion",         duration: "25 min", type: "lesson" },
          { title: "Fluency & Coherence Strategies",      duration: "20 min", type: "lesson" },
          { title: "Pronunciation & Intonation",          duration: "20 min", type: "lesson" },
          { title: "Mock Speaking Test",                  duration: "15 min", type: "test"   },
        ],
      },
    ],
  },

  sql: {
    key: "sql",
    title: "SQL Mastery",
    subtitle: "Structured Query Language from Zero to Hero",
    badge: "Database",
    badgeColor: "#f59e0b",
    level: "Beginner → Advanced",
    totalLessons: 42,
    estimatedHours: 30,
    icon: "🗄️",
    description:
      "Learn SQL from fundamentals to advanced query optimisation. Covers MySQL, PostgreSQL, and SQL Server with real-world datasets and hands-on exercises.",
    modules: [
      {
        key: "fundamentals",
        title: "Fundamentals",
        icon: "🔑",
        color: "#f59e0b",
        lessons: [
          { title: "Introduction to Databases & SQL",  duration: "20 min", type: "lesson" },
          { title: "SELECT — Retrieving Data",         duration: "25 min", type: "lesson" },
          { title: "WHERE — Filtering Rows",           duration: "25 min", type: "lesson" },
          { title: "ORDER BY & LIMIT",                 duration: "20 min", type: "lesson" },
          { title: "INSERT, UPDATE, DELETE",           duration: "30 min", type: "lesson" },
          { title: "Quiz — SQL Basics",                duration: "15 min", type: "test"   },
        ],
      },
      {
        key: "joins",
        title: "Joins & Relations",
        icon: "🔗",
        color: "#ef4444",
        lessons: [
          { title: "INNER JOIN Explained",               duration: "25 min", type: "lesson" },
          { title: "LEFT, RIGHT & FULL OUTER JOIN",      duration: "30 min", type: "lesson" },
          { title: "Self Joins & Cross Joins",           duration: "25 min", type: "lesson" },
          { title: "Subqueries & Nested Selects",        duration: "30 min", type: "lesson" },
          { title: "CTEs (WITH Clause)",                 duration: "25 min", type: "lesson" },
          { title: "Practice Lab — Joins",              duration: "45 min", type: "test"   },
        ],
      },
      {
        key: "aggregation",
        title: "Aggregation & Analytics",
        icon: "📊",
        color: "#8b5cf6",
        lessons: [
          { title: "GROUP BY & HAVING",                          duration: "25 min", type: "lesson" },
          { title: "Aggregate Functions — SUM, AVG, COUNT",      duration: "20 min", type: "lesson" },
          { title: "Window Functions — ROW_NUMBER, RANK",        duration: "35 min", type: "lesson" },
          { title: "PARTITION BY & Running Totals",              duration: "30 min", type: "lesson" },
          { title: "CASE WHEN & Conditional Logic",              duration: "25 min", type: "lesson" },
          { title: "Analytics Lab — Sales Report",              duration: "45 min", type: "test"   },
        ],
      },
      {
        key: "advanced",
        title: "Advanced SQL",
        icon: "⚡",
        color: "#06b6d4",
        lessons: [
          { title: "Indexes & Query Performance",          duration: "35 min", type: "lesson" },
          { title: "EXPLAIN & Query Planner",              duration: "30 min", type: "lesson" },
          { title: "Stored Procedures & Functions",        duration: "35 min", type: "lesson" },
          { title: "Transactions & ACID Properties",       duration: "25 min", type: "lesson" },
          { title: "Schema Design & Normalisation",        duration: "30 min", type: "lesson" },
          { title: "Capstone — Full Database Project",    duration: "60 min", type: "test"   },
        ],
      },
    ],
  },

  azure: {
    key: "azure",
    title: "Microsoft Azure",
    subtitle: "Cloud Computing with Microsoft Azure",
    badge: "Cloud",
    badgeColor: "#0ea5e9",
    level: "Beginner → Professional",
    totalLessons: 54,
    estimatedHours: 45,
    icon: "☁️",
    description:
      "Prepare for AZ-900, AZ-104, and AZ-204 certifications. Hands-on labs, real architecture scenarios, and exam-focused practice questions throughout.",
    modules: [
      {
        key: "az900",
        title: "AZ-900 Fundamentals",
        icon: "🌐",
        color: "#0ea5e9",
        lessons: [
          { title: "Cloud Concepts & Deployment Models", duration: "30 min", type: "lesson" },
          { title: "Azure Core Services Overview",       duration: "35 min", type: "lesson" },
          { title: "Azure Pricing & SLAs",              duration: "25 min", type: "lesson" },
          { title: "Security & Compliance in Azure",    duration: "30 min", type: "lesson" },
          { title: "Azure Management Tools",            duration: "20 min", type: "lesson" },
          { title: "AZ-900 Practice Exam",             duration: "60 min", type: "test"   },
        ],
      },
      {
        key: "az104",
        title: "AZ-104 Administrator",
        icon: "🔧",
        color: "#6366f1",
        lessons: [
          { title: "Azure Active Directory & Identity",  duration: "40 min", type: "lesson" },
          { title: "Governance — Policies & RBAC",       duration: "35 min", type: "lesson" },
          { title: "Azure Storage & Blob Services",      duration: "35 min", type: "lesson" },
          { title: "Virtual Machines & Compute",         duration: "40 min", type: "lesson" },
          { title: "Azure Networking — VNets & NSGs",    duration: "40 min", type: "lesson" },
          { title: "AZ-104 Practice Exam",              duration: "90 min", type: "test"   },
        ],
      },
      {
        key: "az204",
        title: "AZ-204 Developer",
        icon: "💻",
        color: "#8b5cf6",
        lessons: [
          { title: "Azure App Service & Web Apps",    duration: "35 min", type: "lesson" },
          { title: "Azure Functions — Serverless",    duration: "40 min", type: "lesson" },
          { title: "Blob & Queue Storage",            duration: "30 min", type: "lesson" },
          { title: "Azure Cosmos DB & SQL API",       duration: "35 min", type: "lesson" },
          { title: "API Management & Event Grid",     duration: "35 min", type: "lesson" },
          { title: "AZ-204 Practice Exam",           duration: "90 min", type: "test"   },
        ],
      },
      {
        key: "devops",
        title: "Azure DevOps",
        icon: "🔄",
        color: "#10b981",
        lessons: [
          { title: "Azure DevOps Overview & Repos",          duration: "30 min", type: "lesson" },
          { title: "Azure Pipelines — CI/CD",               duration: "40 min", type: "lesson" },
          { title: "Infrastructure as Code — Bicep & ARM",  duration: "40 min", type: "lesson" },
          { title: "Container Apps & AKS Basics",           duration: "40 min", type: "lesson" },
          { title: "Monitoring with Azure Monitor",         duration: "30 min", type: "lesson" },
          { title: "DevOps Capstone Project",               duration: "60 min", type: "test"   },
        ],
      },
    ],
  },
};

/** Flat array of courses (for iteration) */
export const LEARNING_COURSES_LIST = Object.values(LEARNING_COURSES);

/** Total stats across all courses */
export const LEARNING_STATS = {
  totalCourses: LEARNING_COURSES_LIST.length,
  totalLessons: LEARNING_COURSES_LIST.reduce((s, c) => s + c.totalLessons, 0),
  totalHours:   LEARNING_COURSES_LIST.reduce((s, c) => s + c.estimatedHours, 0),
};
