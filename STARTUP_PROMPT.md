# RiseIQ — Claude Startup Prompt

Paste everything below this line into your first message when starting a new Claude session.

---

## Project Context

I am building **RiseIQ** — an IELTS preparation platform with a Next.js 15 App Router frontend, deployed on Azure Static Web Apps via GitHub Actions CI/CD.

**Repo:** `Bsin9/riseiq`
**Workspace:** `/Users/cloudesy/Documents/IELTS/riseiq/`

---

## Critical Rules — Read First

1. **NEVER use the Bash tool** — it has ENOSPC errors in this environment.
2. **ALWAYS use `mcp__mac-terminal__run_command`** for ALL shell and git commands.
3. When staging files with parentheses in the path, use: `git add -A`
4. Always commit with: `Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>`
5. Push to `main` after every completed feature.
6. There are TWO riseiq folders — the correct git repo is always `/Users/cloudesy/Documents/IELTS/riseiq/`.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 App Router |
| Auth | NextAuth v4 — JWT strategy |
| Styling | Tailwind CSS 4 (configured in `globals.css` via `@theme {}`, NOT `tailwind.config.js`) |
| AI | Anthropic Claude API via `/api/ai` route |
| Deploy | Azure Static Web Apps — GitHub Actions CI/CD |
| Data (Phase 1) | Mock JSON files in `data/mock/` |
| Data (Phase 2) | Prisma + PostgreSQL (not yet wired) |

---

## Coding Conventions

- **Server components** by default. Add `"use client"` only for hooks/interactivity.
- **Dynamic routes** — always `await params`: `const { id } = await params`
- **Auth guard** — use `getServerSession(authOptions)` + `redirect("/login")` on server, or `requireRole("admin")` / `requireAuth()` from `lib/auth/withAuth.js`
- **Design tokens only** — never hardcode colors. Use `var(--color-brand-navy)`, `var(--color-brand-teal)`, `var(--color-brand-gold)` etc.
- **All routes** come from `@/config/routes.js` — never hardcode URL strings.
- **Session ID prefixes**: `r_` reading · `w_` writing · `ls_` listening · `sp_` speaking
- **AI branding**: always call it "Synapse Brain" — never say "AI" in user-facing copy.
- **No "Phase 2" jargon** in user-facing copy — use "coming soon" instead.

---

## Design Tokens (key ones)

```css
--color-brand-navy:      #0F1F3D   /* primary text, backgrounds */
--color-brand-teal:      #1DB8A4   /* primary action, active states */
--color-brand-gold:      #F5A623   /* Pro tier, highlights, target band */
--color-brand-gray:      #64748B   /* secondary text */
--color-brand-gray-light:#F1F5F9   /* page background */
```

Shared CSS classes: `.btn-primary`, `.btn-secondary`, `.btn-navy`, `.btn-ghost`, `.card`, `.card-hover`, `.input-field`, `.hide-mobile`, `.show-mobile`

---

## Project Structure

```
app/
  (auth)/login/          — Login page (split-panel, Google Sign-In primary)
  (dashboard)/           — All student-facing pages (layout.jsx has auth guard)
    dashboard/           — Main dashboard (COURSE_SECTION_MAP pattern)
    ielts/               — /ielts root + reading/writing/listening/speaking lists
    session/[sessionId]/ — Universal session player (detects skill by ID prefix)
    learning/            — Learning Hub catalog + /[courseKey] detail pages
    synapse/             — AI study assistant (Phase 2 — UI only)
    mock-test/           — Mock exam selector (Phase 2 — UI only)
    progress/            — Band score tracker
    profile/             — Account, plan, enrolled courses
    certifications/      — Earned certificates
  admin/                 — Admin portal (requireRole("admin") guard)
    page.jsx             — Overview + stats + recent students
    students/            — Full student table
    permissions/         — RBAC documentation
    audit/               — Audit log
    advanced/            — High performers cohort
    settings/            — Env var status + Google OAuth setup guide

components/
  layout/   Sidebar.jsx · MobileNav.jsx · AdminSidebar.jsx
  dashboard/ WelcomeBanner · WeeklyProgressChart · DailyGoalsWidget ·
             RecentActivityFeed · IELTSDashboardSection · SQLDashboardSection ·
             AzureDashboardSection · ExamReadinessIndicator · ModuleQuickAccess ·
             MockTestShortcut · RecommendedTasks · WeakSkillAlert
  session/  WritingSession · ReadingSession · ListeningSession · SpeakingSession
  learning/ ModuleTabs
  admin/    StatusBadge
  ui/       Badge

config/
  routes.js        — All ROUTES constants (always import from here)
  courseRegistry.js — COURSE_REGISTRY, getEnrolledCoursesMeta(), isEnrolledIn()
  metadata.js      — Shared page metadata

lib/
  auth/authOptions.js  — NextAuth config
  auth/withAuth.js     — requireRole() and requireAuth() server helpers
  utils/date.js        — Shared daysUntil() and formatDate() utilities

data/
  writingPrompts.json          — 8 Task 1 + 12 Task 2 prompts
  mock/reading-sessions.json   — 7 reading sessions
  mock/listening-sessions.json — 5 listening sessions
  mock/speaking-cues.json      — 15 cue cards
  users.json                   — Mock users (student + admin)
  learningCourses.js           — Learning Hub course definitions
```

---

## Brand Assets

```
brand/
  logo-color.svg      — Full color horizontal lockup
  logo-dark.svg       — White/teal for dark backgrounds
  logo-mono.svg       — Single-color black
  logo-icon.svg       — Standalone 40×40 icon
  logo-app-icon.svg   — 200×200 square app icon (navy rounded rect)
  logo-preview.html   — Full brand guidelines document
```

**Logo concept**: Three ascending nodes on a 45° line — Navy (bottom) → Teal (mid) → Gold (top). Represents "Rise" (upward), "IQ" (neural/data nodes), three courses, gold = Pro tier.

---

## What Is Complete (Phase 1)

- ✅ Auth: NextAuth v4 — credentials + Google OAuth (Google env vars pending in Azure Portal)
- ✅ Dashboard with `COURSE_SECTION_MAP` — enrollment-driven course sections
- ✅ All 4 IELTS skill list pages (reading / writing / listening / speaking)
- ✅ Universal session player — routes by session ID prefix
- ✅ All 4 session components with Claude API feedback (WritingSession, ReadingSession, ListeningSession, SpeakingSession)
- ✅ Synapse page (UI shell — Phase 2 backend)
- ✅ Mock Test page (UI shell — Phase 2 backend)
- ✅ Progress page (mock data — Phase 2 DB)
- ✅ Profile page (session data — Phase 2 DB)
- ✅ Certifications page
- ✅ Learning Hub catalog + course detail pages
- ✅ Admin portal: overview, students, permissions, audit log, advanced cohort, settings
- ✅ RBAC middleware
- ✅ Brand assets: 5 SVG logo variants + full brand guidelines HTML
- ✅ Login page: split-panel with Google Sign-In as primary CTA
- ✅ Shared utilities: `lib/utils/date.js`, `components/admin/StatusBadge.jsx`

---

## What Is Pending (Phase 2+)

| Priority | Task |
|---|---|
| 🔴 | Set `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET` in Azure Portal → Configuration |
| 🔴 | Verify end-to-end login: `student@riseiq.ca` / `student2026` and `admin@riseiq.ca` / `admin2026` |
| 🟠 | Prisma + PostgreSQL — replace all mock JSON data |
| 🟠 | Real user registration (`/signup` page — route exists, page missing) |
| 🟠 | `/forgot-password` page (route exists, page missing) |
| 🟠 | Synapse Brain chat API (`/api/synapse/chat`) |
| 🟠 | Stripe integration for Pro plan |
| 🟡 | Real audio files for listening sessions |
| 🟡 | Certificate PDF generation |
| 🟡 | `/` root landing page (currently 404) |
| 🟡 | Loading/skeleton states |
| 🟡 | SQL and Azure course content (Phase 4) |

---

## Test Accounts

| Role | Email | Password |
|---|---|---|
| Student | `student@riseiq.ca` | `student2026` |
| Admin | `admin@riseiq.ca` | `admin2026` |

---

## Recent Git History

```
83f132e feat: redesign login page + admin cleanup
d01248b fix: full audit cleanup — P0 bugs, UX gaps, and code quality
0e7bbeb feat: add mock-test, progress, profile, and admin settings pages
d1a781c feat(dashboard): create 5 missing IELTS dashboard sub-components
d939d71 fix(ielts): reading and listening pages now read from JSON data files dynamically
5027938 feat(content): expand IELTS question bank from PDF source materials
63b7e05 feat: Claude API integration — IELTS session players + dashboard fix
6bf3001 feat: Phase 1 dashboard redesign + project documentation
```

---

## What I Need You to Do Now

[**Replace this section with your actual request for the session**]

Examples:
- "Continue with Phase 2 — set up Prisma and PostgreSQL"
- "Build the /signup and /forgot-password pages"
- "Fix issue X / add feature Y"
