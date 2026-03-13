# RiseIQ Dashboard Redesign — Staff Engineering Specification
**Version:** 1.0
**Date:** March 2026
**Scope:** Student dashboard, navigation architecture, course-entitlement system

---

## Missing Requirements & Product Assumptions

Before the spec, here are the gaps that must be resolved — with sensible defaults assumed throughout this document.

| # | Gap | Assumed Default |
|---|-----|-----------------|
| 1 | What is "Synapse" exactly? A chat assistant, a study planner, or both? | Assumed: AI study assistant (chat + recommendations), course-aware |
| 2 | Can a student enroll in multiple courses simultaneously? | Yes — the system must handle multi-course students gracefully |
| 3 | Is plan (Free/Pro) the only entitlement gate, or can courses be purchased individually? | Plan-based for now; course-level entitlement modelled but not enforced |
| 4 | Does "Mock Test" mean IELTS-only, or does SQL/Azure have mock exams too? | Course-aware mock tests — each course can register its own test type |
| 5 | Where do the IELTS practice pages (Reading, Writing, Listening, Speaking) live once removed from primary nav? | Accessible via Dashboard contextual shortcuts and Learning Hub course page |
| 6 | Should unenrolled courses be visible in the dashboard (locked)? | No — only enrolled courses render widgets on the home dashboard |
| 7 | What is the unauthenticated onboarding flow (course selection before dashboard)? | Out of scope for this spec; assumed handled at signup |
| 8 | Is there a mobile app, or web-only? | Web-only, but fully responsive |
| 9 | Are streaks, goals, and target band IELTS-specific or universal? | They are course-specific — each course type registers its own goal/streak model |
| 10 | How is user progress data structured in the API? | See Data Model section — a unified CourseProgress interface is proposed |

---

## 1. Redesigned Information Architecture

The current architecture is **course-specific by default** — the sidebar assumes every user is an IELTS student. The redesign makes the application **course-agnostic by default**, with course-specific UI injected via a configuration-driven entitlement system.

### Structural Principle

```
App Shell
├── Authenticated Shell (sidebar + main)
│   ├── Universal Pages  (always visible to all enrolled users)
│   │   ├── /dashboard       Home — personalised per enrolled courses
│   │   ├── /synapse         AI study assistant
│   │   ├── /mock-test       Course-aware exam launcher
│   │   ├── /progress        Unified progress across all courses
│   │   ├── /profile         Account, plan, settings
│   │   └── /learning        Course catalog + individual course pages
│   │
│   └── Course-Specific Pages  (URL-accessible, but not in primary nav)
│       ├── /ielts/reading
│       ├── /ielts/writing
│       ├── /ielts/listening
│       ├── /ielts/speaking
│       ├── /sql/practice
│       └── /azure/labs
│
└── Public Shell
    ├── /               Landing page
    ├── /courses        Marketing catalog
    ├── /pricing        Pricing
    └── /about
```

### Key Structural Decisions

**Why remove Reading/Writing/Listening/Speaking from primary nav?**
Primary nav is prime real estate — it should represent the entire product surface, not a single course. When an SQL student logs in, they should not see IELTS-specific items. Moving these to course-scoped URLs (`/ielts/reading`) and dashboard shortcuts gives IELTS students the same fast access via contextual links, without polluting the nav for all users.

**Why rename /practice/* to /ielts/*?**
The `/practice/reading` URL pattern implies it is generic. It is not — it is explicitly IELTS reading practice. Naming it `/ielts/reading` makes the entitlement semantically correct and opens a clean pattern for `/sql/practice`, `/azure/labs`, etc.

**Why keep Mock Test in primary nav?**
All three courses (IELTS, SQL, Azure) have practice exams. Mock Test becomes a unified launcher that shows only the exams relevant to the user's enrolled courses. It is course-aware, not IELTS-specific.

---

## 2. Revised Navigation Structure

### Primary Sidebar Navigation (All Enrolled Users)

```
● Dashboard          /dashboard
● Synapse            /synapse
● Mock Test          /mock-test
● Progress           /progress
● Profile            /profile
─────────────────────
● Learning Hub       /learning
    ↳ [enrolled course sub-links, contextual]
```

### Contextual Navigation (Course-Scoped — IELTS Only)

IELTS-enrolled students see a secondary section **within the dashboard home** and **on the Learning Hub IELTS course page**, not in the primary nav:

```
IELTS Practice (shown on /dashboard if enrolled in IELTS)
├── Reading      → /ielts/reading
├── Writing      → /ielts/writing
├── Listening    → /ielts/listening
└── Speaking     → /ielts/speaking
```

### Learning Hub Sub-Navigation (Contextual, When Inside /learning)

```
Learning Hub
├── All Courses     /learning
├── 📝 IELTS        /learning/ielts        (if enrolled)
├── 🗄️ SQL          /learning/sql          (if enrolled)
└── ☁️ Azure        /learning/azure        (if enrolled)
```

Non-enrolled courses appear in the catalog as "Enroll →" cards, not as nav sub-links.

---

## 3. UX Reasoning

### Problem: Navigation Pollution
Adding course-specific items to primary nav creates noise for students not in that course and signals that the product is IELTS-only, which limits perceived value and future growth.

### Solution: Progressive Disclosure
Primary nav provides universal access. Course-specific shortcuts appear contextually — on the dashboard home for enrolled courses, inside the Learning Hub course page, and via Synapse recommendations. Students discover course features where it is natural to encounter them, not by scanning a long sidebar.

### Synapse Placement
Synapse is the product's core differentiator (AI tutor). Elevating it to a primary nav item (not buried under a course) signals its importance and makes it accessible regardless of what course the user is working on. Synapse can be course-aware internally — it knows which courses the user is enrolled in and tailors its responses accordingly.

### Dashboard as Personalised Home
The dashboard becomes a "control centre" that aggregates progress, shortcuts, and recommendations across all enrolled courses. A user enrolled in both IELTS and SQL sees both course sections side-by-side, each with its own relevant widgets, rather than a single IELTS-only view.

### Multi-Course Student Experience
A student enrolled in IELTS + Azure sees:
- Welcome banner (universal)
- IELTS section: Exam Readiness, band target, 4 practice shortcuts
- Azure section: Certification tracker, lab progress
- Unified Synapse recommendations across both

---

## 4. Component Hierarchy

```
<DashboardLayout>                    — app/(dashboard)/layout.jsx
├── <Sidebar>                        — universal, config-driven nav
│   ├── <SidebarLogo>
│   ├── <SidebarNav items={NAV_ITEMS} />
│   ├── <SidebarLearningHub enrollments={user.enrolledCourses} />
│   └── <SidebarFooter user={user} />
│
└── <main>
    └── <DashboardPage>             — app/(dashboard)/dashboard/page.jsx
        ├── <WelcomeBanner user={user} />
        │
        ├── <CourseSection>         — rendered once per enrolled course
        │   ├── [IELTS]  <IELTSDashboardSection enrollment={...} />
        │   │   ├── <ExamReadinessIndicator />
        │   │   ├── <IELTSPracticeGrid />   (Reading/Writing/Listening/Speaking)
        │   │   ├── <WeakSkillAlert />
        │   │   └── <BandProgressChart />
        │   │
        │   ├── [SQL]    <SQLDashboardSection enrollment={...} />
        │   │   ├── <SQLPracticeShortcut />
        │   │   └── <SQLProgressCard />
        │   │
        │   └── [Azure]  <AzureDashboardSection enrollment={...} />
        │       ├── <CertificationTracker />
        │       └── <LabProgressCard />
        │
        └── <UniversalWidgets>      — always shown
            ├── <SynapseRecommendations enrollments={user.enrolledCourses} />
            ├── <RecentActivityFeed />
            └── <DailyGoalsWidget />
```

### Key Design: Course Section Registry

Each course registers its own dashboard section via a `COURSE_REGISTRY` configuration object. The dashboard page is a generic orchestrator — it does not contain any course-specific logic.

```
COURSE_REGISTRY = {
  ielts:  { Section: IELTSDashboardSection,  weight: 1 },
  sql:    { Section: SQLDashboardSection,    weight: 2 },
  azure:  { Section: AzureDashboardSection,  weight: 3 },
}
```

---

## 5. Course-Entitlement Visibility Logic

### Entitlement Hierarchy

```
User
└── enrolledCourses[]
    └── CourseEnrollment { courseKey, plan, status }

Visibility Rules:
  SHOW widget/nav/section   if  courseKey ∈ user.enrolledCourses
  LOCK widget/nav/section   if  courseKey exists but plan gates it
  HIDE widget/nav/section   if  courseKey ∉ user.enrolledCourses
```

### Helper Hooks

```js
// Returns the set of course keys the user is actively enrolled in
function useEnrolledCourses(user) → Set<CourseKey>

// Returns true if user is enrolled in a specific course
function useIsEnrolled(user, courseKey) → boolean

// Returns the enrollment object for a course (or null)
function useEnrollment(user, courseKey) → CourseEnrollment | null
```

### Visibility Rules Table

| Component | Show condition | Hide condition |
|---|---|---|
| Primary nav (Dashboard, Synapse, etc.) | Always | Never |
| IELTS practice shortcuts on dashboard | `isEnrolled('ielts')` | Not enrolled |
| IELTS target band in sidebar footer | `isEnrolled('ielts')` | Not enrolled |
| ExamReadinessIndicator | `isEnrolled('ielts')` | Not enrolled |
| WeakSkillAlert (IELTS) | `isEnrolled('ielts')` | Not enrolled |
| SQL practice shortcut | `isEnrolled('sql')` | Not enrolled |
| Azure certification tracker | `isEnrolled('azure')` | Not enrolled |
| Learning Hub sub-link (e.g. IELTS) | `isEnrolled('ielts')` | Not enrolled |
| Mock test launcher (IELTS tests) | `isEnrolled('ielts')` | Not enrolled |
| Mock test launcher (SQL quiz) | `isEnrolled('sql')` | Not enrolled |

---

## 6. Sample Data Model

```js
// ─── User ────────────────────────────────────────────────────────
interface User {
  id:               string;
  name:             string;
  email:            string;
  avatarUrl?:       string;
  plan:             'free' | 'pro';
  streakDays:       number;
  enrolledCourses:  CourseEnrollment[];
  createdAt:        string; // ISO-8601
}

// ─── Enrollment ──────────────────────────────────────────────────
interface CourseEnrollment {
  courseKey:   'ielts' | 'sql' | 'azure' | string; // extensible
  status:      'active' | 'paused' | 'completed';
  enrolledAt:  string;
  progress:    CourseProgress;
  target?:     CourseTarget;
}

// ─── Target (course-type-specific) ───────────────────────────────
type CourseTarget =
  | { type: 'band';  targetBand: number; examDate: string }  // IELTS
  | { type: 'cert';  certName: string;   examDate: string }  // Azure
  | { type: 'score'; targetScore: number }                   // SQL

// ─── Progress ────────────────────────────────────────────────────
interface CourseProgress {
  courseKey:        string;
  overallPct:       number;                   // 0–100
  moduleScores:     Record<string, ModuleScore>;
  weakAreas:        string[];
  recentSessions:   Session[];
  weeklyActivity:   WeeklyActivityEntry[];
}

interface ModuleScore {
  key:      string;
  label:    string;
  current:  number;   // e.g. band score or % correct
  target:   number;
  trend:    'up' | 'down' | 'flat';
  sessions: number;
}

// ─── Course Definition (static config, not from API) ─────────────
interface CourseDefinition {
  key:              string;
  title:            string;
  icon:             string;
  discipline:       'language' | 'database' | 'cloud' | 'ai' | string;
  dashboardSection: React.ComponentType<{ enrollment: CourseEnrollment }>;
  navSubLinks:      NavSubLink[];       // shown under Learning Hub when enrolled
  mockTestTypes:    MockTestType[];     // types of tests available
  goalTypes:        GoalType[];         // daily goal definitions
}

interface NavSubLink {
  key:   string;
  label: string;
  href:  string;
  icon:  string;
}
```

---

## 7. Low-Fidelity Wireframe Structure

### A. Sidebar — Universal

```
┌─────────────────────┐
│ ⚡ RiseIQ           │
│    Learn.Grow.Rise  │
├─────────────────────┤
│ ⊞  Dashboard        │
│ 🧠 Synapse          │
│ 📋 Mock Test        │
│ 📊 Progress         │
│ 👤 Profile          │
├─────────────────────┤
│ 📚 Learning Hub     │
│    ↳ 📝 IELTS  [•] │  ← only if enrolled
│    ↳ 🗄️ SQL    [•] │  ← only if enrolled
│    ↳ ☁️ Azure  [•] │  ← only if enrolled
├─────────────────────┤
│ 🧠 Synapse Brain    │  ← universal footer
│ [Log Out]           │
└─────────────────────┘
```

**Note:** "IELTS target band" section in the footer is removed. It was IELTS-specific. Replaced by the universal Synapse Brain brand badge only.

---

### B. Dashboard — IELTS-Only Student

```
┌──────────────────────────────────────────────────────────┐
│ Welcome back, Balgeet 👋   Streak: 14 days 🔥             │
├─────────────────────────────┬────────────────────────────┤
│ ── IELTS Preparation ────── │   Synapse Recommendations  │
│                             │   ─────────────────────    │
│ ┌──────────────────────┐    │   • Focus on Writing T2    │
│ │ EXAM READINESS       │    │   • 3 sessions this week   │
│ │ Band 6.0  → 7.5      │    │   • Mock test in 2 days    │
│ │ ████████░░  80%      │    ├────────────────────────────┤
│ └──────────────────────┘    │   Today's Goals    0/3     │
│                             │   ─────────────────────    │
│ Quick Practice              │   ☐ 1 Reading practice     │
│ ┌──────┐ ┌──────┐           │   ☐ Write 150 words        │
│ │ 📖   │ │ ✍️   │           │   ☐ 5 vocab words          │
│ │Read  │ │Write │           ├────────────────────────────┤
│ └──────┘ └──────┘           │   Recent Activity          │
│ ┌──────┐ ┌──────┐           │   ─────────────────────    │
│ │ 🎧   │ │ 🎤   │           │   Reading  · 45 min ago    │
│ │Listen│ │Speak │           │   Writing  · yesterday     │
│ └──────┘ └──────┘           └────────────────────────────┤
│                                                           │
│ ┌──────────────────────────────────────────────────────┐ │
│ │  Weak Areas: Writing Task 2 · Listening Section 4    │ │
│ └──────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

---

### C. Dashboard — Multi-Course Student (IELTS + Azure)

```
┌──────────────────────────────────────────────────────────┐
│ Welcome back, Balgeet 👋                                  │
├─────────────────────────────┬────────────────────────────┤
│ ── IELTS Preparation ──     │   Synapse Recommendations  │
│ ┌──────────────────────┐    │   • IELTS: Focus Writing   │
│ │ Band 6.0 → 7.5       │    │   • Azure: AZ-900 next     │
│ │ Quick Practice Grid  │    │   • Mock test this week    │
│ └──────────────────────┘    ├────────────────────────────┤
│                             │   Today's Goals    0/4     │
│ ── Microsoft Azure ──       ├────────────────────────────┤
│ ┌──────────────────────┐    │   Recent Activity          │
│ │ AZ-900  ██████░  72% │    │   IELTS Reading · 1hr ago  │
│ │ AZ-104  ██░░░░  28%  │    │   Azure Lab    · yesterday │
│ │ [Launch Lab]         │    └────────────────────────────┘
│ └──────────────────────┘
└─────────────────────────────┘
```

---

### D. Dashboard — SQL-Only Student (No IELTS Elements)

```
┌──────────────────────────────────────────────────────────┐
│ Welcome back, Jordan 👋                                   │
├─────────────────────────────┬────────────────────────────┤
│ ── SQL Mastery ──           │   Synapse Recommendations  │
│ ┌──────────────────────┐    │   • Try Window Functions   │
│ │ Overall:  64%        │    │   • Lab due this week      │
│ │ Joins     ████░  80% │    ├────────────────────────────┤
│ │ Advanced  ██░░░  40% │    │   Today's Goals    0/2     │
│ │                      │    │   ☐ 1 query challenge      │
│ │ [Practice Queries]   │    │   ☐ Review window funcs    │
│ └──────────────────────┘    └────────────────────────────┘
│
│  — No band target. No IELTS widgets. No speaking/reading. —
└──────────────────────────────────────────────────────────┘
```

---

## 8. Pseudocode — Navigation Rendering

```
// config/nav.js — static, not user-aware
const BASE_NAV = [
  { href: '/dashboard', label: 'Dashboard',  icon: LayoutDashboard },
  { href: '/synapse',   label: 'Synapse',    icon: Brain           },
  { href: '/mock-test', label: 'Mock Test',  icon: FileText        },
  { href: '/progress',  label: 'Progress',   icon: BarChart2       },
  { href: '/profile',   label: 'Profile',    icon: User            },
]

// components/layout/Sidebar.jsx
function Sidebar({ user }) {
  const enrolledKeys = user.enrolledCourses.map(e => e.courseKey)
  const pathname = usePathname()
  const isInLearning = pathname.startsWith('/learning')

  return (
    <aside>
      <Logo />

      <nav>
        // ── Primary nav (static, universal)
        {BASE_NAV.map(item =>
          <NavLink item={item} isActive={matchPath(item.href, pathname)} />
        )}

        // ── Learning Hub + enrolled course sub-links
        <NavDivider />
        <NavLink
          item={{ href: '/learning', label: 'Learning Hub', icon: Library }}
          isActive={isInLearning}
        />
        {isInLearning && enrolledKeys.map(key => {
          const course = COURSE_REGISTRY[key]
          return course.navSubLinks.map(sub =>
            <NavSubLink
              key={sub.key}
              item={sub}
              isActive={matchPath(sub.href, pathname)}
            />
          )
        })}
      </nav>

      // ── Footer: Synapse Brain badge + Logout only
      // NOTE: NO target band, NO IELTS-specific content
      <SidebarFooter onLogout={signOut} />
    </aside>
  )
}
```

---

## 9. Pseudocode — Course-Specific Dashboard Rendering

```
// config/courseRegistry.js
const COURSE_REGISTRY = {
  ielts: {
    key: 'ielts',
    Section: IELTSDashboardSection,
    weight: 10,
  },
  sql: {
    key: 'sql',
    Section: SQLDashboardSection,
    weight: 20,
  },
  azure: {
    key: 'azure',
    Section: AzureDashboardSection,
    weight: 30,
  },
  // Future courses register here — no changes to DashboardPage needed
}

// app/(dashboard)/dashboard/page.jsx
function DashboardPage({ user }) {
  // Sort enrolled courses by registry weight for consistent layout
  const enrolledSections = user.enrolledCourses
    .filter(e => e.status === 'active')
    .sort((a, b) => COURSE_REGISTRY[a.courseKey].weight
                  - COURSE_REGISTRY[b.courseKey].weight)

  return (
    <div className="dashboard-grid">
      <WelcomeBanner user={user} />

      <div className="dashboard-main">
        <div className="dashboard-left">
          // ── Render one section per enrolled course ──
          {enrolledSections.map(enrollment => {
            const { Section } = COURSE_REGISTRY[enrollment.courseKey]
            return (
              <Section
                key={enrollment.courseKey}
                enrollment={enrollment}
              />
            )
          })}

          // ── If no active enrollments, show CTA to browse courses ──
          {enrolledSections.length === 0 && (
            <EmptyStateEnroll />
          )}
        </div>

        <div className="dashboard-right">
          // ── Universal widgets, always visible ──
          <SynapseRecommendations enrollments={user.enrolledCourses} />
          <DailyGoalsWidget       enrollments={user.enrolledCourses} />
          <RecentActivityFeed     enrollments={user.enrolledCourses} />
        </div>
      </div>
    </div>
  )
}

// ── IELTS Section (self-contained, knows its own layout) ──
function IELTSDashboardSection({ enrollment }) {
  const { progress, target } = enrollment
  return (
    <CourseSection title="IELTS Preparation" icon="📝" color="#6366f1">
      <ExamReadinessIndicator
        currentBand={progress.overallScore}
        targetBand={target?.targetBand}
        examDate={target?.examDate}
      />
      <IELTSPracticeGrid />       // Reading / Writing / Listening / Speaking
      <WeakSkillAlert areas={progress.weakAreas} />
    </CourseSection>
  )
}

// ── SQL Section ──
function SQLDashboardSection({ enrollment }) {
  const { progress } = enrollment
  return (
    <CourseSection title="SQL Mastery" icon="🗄️" color="#f59e0b">
      <SQLProgressOverview modules={progress.moduleScores} />
      <SQLPracticeShortcut />
    </CourseSection>
  )
}

// ── Azure Section ──
function AzureDashboardSection({ enrollment }) {
  const { progress, target } = enrollment
  return (
    <CourseSection title="Microsoft Azure" icon="☁️" color="#0ea5e9">
      <CertificationTracker
        certName={target?.certName}
        examDate={target?.examDate}
        modules={progress.moduleScores}
      />
      <AzureLabShortcut />
    </CourseSection>
  )
}
```

---

## 10. Responsive Guidance

### Breakpoints

| Breakpoint | Width | Behaviour |
|---|---|---|
| Mobile | < 768px | Sidebar hidden, bottom tab bar shown |
| Tablet | 768–1024px | Sidebar collapsed to icon-only (48px wide) |
| Desktop | 1024–1440px | Full sidebar (240px), two-column dashboard |
| Wide | > 1440px | Sidebar + three-column dashboard layout |

### Mobile Bottom Tab Bar

The primary nav items map to 5 bottom tabs. Learning Hub sub-links are accessed via the Learning Hub tab.

```
[ Dashboard ][ Synapse ][ Mock Test ][ Progress ][ ☰ More ]
```

"More" expands a sheet with Profile, Learning Hub, and course shortcuts.

### Sidebar Collapsed (Tablet)

Icon-only mode: only icons are shown, labels appear as tooltips on hover. The Learning Hub sub-links collapse entirely — they are accessible via the Learning Hub icon click, which expands to full width temporarily (fly-out panel).

### Dashboard Grid Reflow

```
Desktop (≥1024px):   [Left column 2/3] + [Right column 1/3]
Tablet  (768-1023px): [Single column, full width]
Mobile  (<768px):    [Single column, full width, no sticky sidebar]
```

Course sections on mobile stack vertically. Collapsed by default if more than two courses are enrolled (user can expand).

---

## 11. Accessibility Guidance

### Navigation

- Sidebar uses `<nav>` with `aria-label="Main navigation"`
- Active link uses `aria-current="page"`
- Collapsed sections use `aria-expanded` and `aria-controls`
- All icons are `aria-hidden="true"` — labels provide text

### Dashboard

- Each `<CourseSection>` is wrapped in a `<section>` with `aria-labelledby` pointing to its heading
- Progress bars use `role="progressbar"` with `aria-valuenow`, `aria-valuemin="0"`, `aria-valuemax="100"`, and `aria-label` (e.g. "IELTS exam readiness: 72%")
- Practice grid buttons have descriptive `aria-label` (e.g. "Start IELTS Reading practice")
- Weak skill alerts use `role="alert"` for screen reader announcement

### Colour Contrast

- All text on coloured backgrounds meets WCAG AA (4.5:1 minimum)
- Active nav state uses a teal background — ensure navy text on teal meets contrast ratio
- Do not rely on colour alone to convey state — use icons, underlines, or labels as secondary indicators

### Keyboard Navigation

- Sidebar can be fully navigated with Tab / Shift+Tab
- Course section headings are focusable (`tabIndex={0}` if interactive)
- Skip-to-content link at the top of the page jumps to `<main id="main-content">`

### Focus Management

- When navigating between routes, focus moves to the page `<h1>` (or `<main>`)
- Modal dialogs trap focus and restore on close

---

## 12. Acceptance Criteria

### Navigation

- [ ] Sidebar shows exactly 5 primary items: Dashboard, Synapse, Mock Test, Progress, Profile
- [ ] Sidebar shows Learning Hub as a 6th item, separated by a divider
- [ ] Learning Hub shows enrolled course sub-links only when the user is inside `/learning`
- [ ] An SQL-only student sees zero IELTS items anywhere in the sidebar
- [ ] An IELTS-only student does not see SQL or Azure items in the dashboard
- [ ] "IELTS target band" content is absent from the sidebar footer for non-IELTS students
- [ ] "IELTS target band" content appears only in the IELTS dashboard section for IELTS students

### Dashboard

- [ ] Dashboard renders exactly one `<CourseSection>` per active enrollment
- [ ] A student enrolled in zero courses sees an empty-state CTA to browse Learning Hub
- [ ] A student enrolled in IELTS + Azure sees both sections with correct data
- [ ] IELTS practice shortcuts (Reading, Writing, Listening, Speaking) only appear inside the IELTS section
- [ ] No IELTS-specific widget (ExamReadiness, WeakSkill, BandTarget) renders for SQL/Azure-only students
- [ ] DailyGoalsWidget, SynapseRecommendations, and RecentActivityFeed render for all students

### Entitlement

- [ ] Enrolling in a new course immediately renders its section on the dashboard (no redeploy needed)
- [ ] Course sections are driven by COURSE_REGISTRY — adding a new course requires only a new registry entry and section component, zero changes to DashboardPage

### Performance

- [ ] Dashboard page first contentful paint < 1.5s on desktop (LCP < 2.5s)
- [ ] Course section components are code-split — SQL section bundle is not loaded for IELTS-only students

### Accessibility

- [ ] All interactive elements are keyboard-accessible
- [ ] Active nav link has `aria-current="page"`
- [ ] Progress indicators have appropriate ARIA attributes
- [ ] Colour contrast passes WCAG AA for all text/background combinations
- [ ] Screen reader announces page title changes on navigation

### Responsive

- [ ] Bottom tab bar renders on viewports < 768px, sidebar is hidden
- [ ] Dashboard columns reflow to single column on tablet and mobile
- [ ] No horizontal scrollbar at any standard breakpoint (320px+)

---

## Implementation Roadmap (Suggested Order)

| Phase | Work | Effort |
|---|---|---|
| 1 | Create `COURSE_REGISTRY` config and `CourseSection` wrapper | 0.5 day |
| 2 | Refactor `DashboardPage` to be enrollment-driven | 1 day |
| 3 | Extract `IELTSDashboardSection` from existing dashboard widgets | 1 day |
| 4 | Create stub `SQLDashboardSection` and `AzureDashboardSection` | 0.5 day |
| 5 | Update `Sidebar` to remove IELTS-specific items from footer | 0.5 day |
| 6 | Rename `/practice/*` routes to `/ielts/*`, add redirects | 0.5 day |
| 7 | Update `MobileNav` to use universal tab bar | 0.5 day |
| 8 | Wire entitlement hooks to real user data (or mock) | 1 day |

**Total estimated effort: ~5.5 engineering days** for a complete, production-quality implementation.
