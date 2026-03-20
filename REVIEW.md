# RiseIQ — Complete End-to-End Expert Review

> **Reviewed by:** Senior Full-Stack / Product / UX / QA audit
> **Date:** March 13, 2026
> **Repo:** `Bsin9/riseiq`
> **Scope:** All committed source files — 37 files, full codebase

---

## A. Executive Summary

RiseIQ has a solid Phase 1 architectural foundation. The COURSE_REGISTRY pattern is well-designed, the Edge Middleware RBAC is correct, and the design system (Tailwind 4 + CSS tokens + component classes) is clean and consistent. The Learning Hub, admin portal structure, and Synapse coming-soon state all look polished.

However, the platform has **several blocking issues** that make it not production-ready in its current state:

**The single most critical bug:** `app/(dashboard)/layout.jsx` and `dashboard/page.jsx` both read `userData[0]` directly from `data/users.json` instead of reading from the authenticated session. This means every logged-in user — including admins — sees the same hardcoded user (Alex Chen, student@riseiq.ca). This is a data isolation failure that would expose wrong user data to every session.

**Scope gap:** The committed repository is missing a large set of files that pages depend on. Components like `WelcomeBanner`, `WeeklyProgressChart`, `DailyGoalsWidget`, `RecentActivityFeed`, `components/ui/Badge.jsx`, `lib/auth/withAuth.js`, `data/writingPrompts.json`, `data/mock/speaking-cues.json`, `config/metadata.js`, and the entire `/app/api/` directory are imported by pages but absent from the repo. The current commit will not build.

**Navigation dead ends:** Every "Start →" button across all four IELTS skill pages links to session player pages that don't exist. `/mock-test`, `/progress`, and `/profile` — all visible in the sidebar nav — have no page files. `/admin/settings` has a directory but no page. These are all 404s today.

**Overall readiness score: 5.5/10.** The architecture and visual design are well above average for an MVP. The missing files, broken links, and session data bug bring the score down significantly.

---

## B. Missing Pages

These routes are reachable (linked from nav, buttons, or redirects) but have no `page.jsx` file:

| Route | Entry Point | Priority |
|---|---|---|
| `/mock-test` | Sidebar nav, IELTS dashboard shortcut, MobileNav | 🔴 Critical |
| `/progress` | Sidebar nav | 🔴 Critical |
| `/profile` | Sidebar nav, MobileNav | 🔴 Critical |
| `/ielts/reading/[sessionId]` | Every "Start →" on reading page | 🔴 Critical |
| `/ielts/writing/[sessionId]` | Every "Start →" on writing page | 🔴 Critical |
| `/ielts/listening/[sessionId]` | Every "Start →" on listening page | 🔴 Critical |
| `/ielts/speaking/[sessionId]` | Every "Start →" on speaking page | 🔴 Critical |
| `/admin/settings` | AdminSidebar nav item | 🟠 High |
| `/signup` | Login page link, public nav | 🟠 High |
| `/blog` | Likely public landing links | 🟡 Medium |
| `/contact` | Likely public landing links | 🟡 Medium |

The session player pages are the most urgent gap. They are the core product — a student goes to "Writing Practice", sees a list of prompts, clicks "Start →", and hits a 404. There is no actual practice happening yet.

---

## C. Missing Components & Files

These files are imported by existing pages but do not exist in the committed repository. The build will fail without them.

**Dashboard widgets** (imported by `dashboard/page.jsx`):
- `components/dashboard/WelcomeBanner.jsx`
- `components/dashboard/WeeklyProgressChart.jsx`
- `components/dashboard/DailyGoalsWidget.jsx`
- `components/dashboard/RecentActivityFeed.jsx`

**UI primitives** (imported by IELTS skill pages):
- `components/ui/Badge.jsx`

**Auth utility** (imported by admin layout + advanced page):
- `lib/auth/withAuth.js` — exports `requireRole()`

**Data files** (imported by IELTS pages):
- `data/writingPrompts.json` — writing practice prompts
- `data/mock/speaking-cues.json` — speaking cue cards

**Config** (imported by IELTS pages):
- `config/metadata.js` — page metadata object (`META.pages.*`)

**API routes** (referenced in ARCHITECTURE.md, called by frontend, none exist):
- `app/api/ai/evaluate/route.js` — Claude writing evaluation
- `app/api/auth/[...nextauth]/route.js` — NextAuth endpoints

**Session player pages** (zero exist — all "Start →" links are broken):
- `app/(dashboard)/ielts/reading/[sessionId]/page.jsx`
- `app/(dashboard)/ielts/writing/[sessionId]/page.jsx`
- `app/(dashboard)/ielts/listening/[sessionId]/page.jsx`
- `app/(dashboard)/ielts/speaking/[sessionId]/page.jsx`

---

## D. Broken or Weak Flows

### 🔴 Critical — Broken Now

**1. Session data bug (hardcoded user)**
`app/(dashboard)/layout.jsx` and `dashboard/page.jsx` both do:
```js
const userData = require("@/data/users.json");
// reads userData[0] — always Alex Chen
```
This should be reading from `getServerSession(authOptions)`. Every logged-in user sees the wrong name, courses, and IELTS band. Fix: replace `userData[0]` with `await getServerSession(authOptions)` and use `session.user`.

**2. All "Start →" session buttons → 404**
Reading, writing, listening, and speaking pages all have "Start →" links that call `ROUTES.SESSION(id)`. No session player page exists. A student can see the list of practice tasks but cannot start any of them.

**3. Writing evaluation pipeline is broken end-to-end**
Even if a session page were built, `app/api/ai/evaluate/route.js` doesn't exist in the repo. The Claude API call has no handler.

**4. NextAuth has no route handler**
`app/api/auth/[...nextauth]/route.js` is not in the repo. NextAuth requires this catch-all route to function. If it's absent, login itself won't work (credentials POST to `/api/auth/callback/credentials` would 404).

### 🟠 High — Degraded Flows

**5. Certifications — misleading CTAs**
"View Certificate" and "Share / Verify" buttons appear on a cert that isn't real. Clicking them does nothing. Users who earned a mock cert will be confused.

**6. In-progress certifications are not enrollment-driven**
SQL (34/42 lessons) and Azure (0/54 lessons) are hardcoded on the certifications page regardless of what the user is enrolled in. A student enrolled only in IELTS still sees SQL and Azure in-progress certs.

**7. Admin Settings → empty page**
The AdminSidebar links to `/admin/settings`. The directory exists but there's no `page.jsx`. This is a 404 from the admin portal.

**8. "Clear all history" on Synapse → no-op**
The button renders and looks functional but has no `onClick` handler. Users will click it expecting their history to clear and nothing will happen.

**9. Forgot password → undefined**
The login page has a "Forgot password?" link with `href="#"`. No password reset flow exists. For credentials users, there's no recovery path at all.

**10. Mobile nav is missing Certifications**
The MobileNav has 5 tabs: Home, Synapse, Courses, Progress, Profile. Certifications is in the desktop sidebar but has no mobile tab. Mobile users have no path to their certifications.

### 🟡 Medium — Weak or Placeholder

**11. Learning Hub — no enrollment state on course cards**
Course cards in `/learning` have no indication of whether the user is enrolled. A student enrolled in IELTS sees IELTS with no "Enrolled" badge or progress bar. The "Start Learning" link takes them to the course detail page with no enrollment-aware CTA.

**12. Course detail "Start Course" → anchor jump, not lesson**
The enroll card's "Start Course" button is `<a href="#modules">` — it scrolls to the module list. It doesn't actually start the course or navigate to a lesson. Students land on the course page and can't begin.

**13. Admin Advanced Cohort — 2 students hardcoded**
The advanced cohort page shows exactly 2 hardcoded students. There's no query or filter logic. Band/session thresholds are described in a comment but not computed.

**14. Admin Students — no actions**
The all-students table (8 mock rows) has no row actions — no view profile, no role change, no plan change, no invite, no deactivate. It's a static read-only table.

**15. Synapse coming-soon prompt buttons do nothing**
The disabled prompt suggestion buttons on the Synapse page look clickable but are disabled. There's no "coming soon" tooltip or hover state to explain why. Users just see inert buttons.

---

## E. Accessibility Issues

### WCAG 2.1 AA Failures

**E1. Login — emoji used as interactive control label**
The show/hide password toggle uses emoji (`🙈` / `👁`) as the visible label with no `aria-label`. A screen reader will announce these emoji names, not the function. Fix: `aria-label="Show password"` / `aria-label="Hide password"`.

**E2. Login — test credentials hint card**
The hint card says "Use test accounts below". For screen readers, the email/password values are in `<code>` tags with no additional context. This is fine semantically, but the card has no landmark label to distinguish it from the form.

**E3. AdminSidebar — `<aside>` has no accessible label**
`components/layout/AdminSidebar.jsx` renders `<aside>` with no `aria-label`. WCAG 4.1.2 requires landmark regions to be distinguishable when there are multiple landmarks of the same type. Fix: `aria-label="Admin navigation"`.

**E4. Synapse — disabled inputs missing `aria-disabled`**
Disabled input and buttons on the Synapse page use the `disabled` HTML attribute, which is correct, but the custom-styled button divs that act as suggestion prompts have no `aria-disabled="true"`. Screen readers won't convey that these are intentionally disabled.

**E5. Repeated non-descriptive link text**
All IELTS skill pages have multiple "Start →" links with identical text. A screen reader user navigating by links hears "Start →" repeated N times with no context about which session. Fix: use `aria-label="Start Urban Vertical Farming reading session"` on each link, or move the visible text to `<span className="sr-only">` describing the session name.

**E6. Learning Hub — "Start Learning" links repeat across all cards**
Same issue as E5. All course cards say "Start Learning" with no differentiation.

**E7. Admin pages — `0.65rem` font size**
Several admin pages (advanced cohort stat labels, badge text) use `fontSize: "0.65rem"`. At standard 16px base, that is ~10.4px. This fails WCAG 1.4.4 (text resizing) and is likely below the minimum readable size even before zoom is considered.

**E8. No skip navigation link**
There's no "Skip to main content" link. Keyboard users must Tab through the entire sidebar on every page before reaching content. Fix: add `<a href="#main-content" className="sr-only focus:not-sr-only">Skip to main content</a>` at the top of both layout files.

**E9. Color contrast — brand gray on white**
`--color-brand-gray: #64748b` on white (`#ffffff`) gives a contrast ratio of approximately 4.6:1, which passes AA for normal text but should be verified with actual font sizes since several uses are at 0.75rem–0.875rem where the threshold is 4.5:1 (it passes, but barely).

**E10. Focus management on page navigation**
There's no focus reset after client-side navigation (e.g., clicking a sidebar link). Focus stays on the link in the sidebar rather than moving to the main content heading. This disorients keyboard and screen reader users.

---

## F. Design System Issues

**F1. Massive inconsistency: CSS classes vs inline styles**
Student-facing pages (dashboard, certifications, learning) use the design system correctly — `.card`, `.btn-primary`, CSS tokens, component classes. Admin pages (`admin/page.jsx`, `admin/students/page.jsx`, `admin/advanced/page.jsx`, `admin/audit/page.jsx`) use 100% inline styles with magic numbers. This makes the admin portal unthemeable and maintenance-heavy. All admin pages should use the same `.card`, `.btn-*`, and token system.

**F2. Magic number font sizes throughout admin**
Inline `fontSize: "0.65rem"`, `fontSize: "0.7rem"`, `fontSize: "0.9375rem"` — these aren't in any token system. When the design system updates, these won't change.

**F3. Hardcoded hex colors in admin pages**
`color: "#0f172a"`, `color: "#64748b"`, `color: "#8b5cf6"` are scattered across admin JSX. These should be `var(--color-brand-navy)` and friends. If the brand color ever changes, admin pages won't update.

**F4. Badge component re-implemented inline in admin pages**
The advanced cohort page creates a custom badge span inline rather than using the `Badge` component from `components/ui/Badge.jsx`. Same pattern is duplicated in at least two admin pages.

**F5. Admin sidebar doesn't use sidebar design tokens**
`AdminSidebar.jsx` has its own hardcoded color scheme (`#0f172a` bg, etc.) which is correct by design — it's intentionally dark. But hover states, active states, and focus styles should still come from the design system to maintain consistency with keyboard interaction patterns.

**F6. No design token for the purple admin accent**
The `#8b5cf6` / `#7c3aed` purple used for admin badges and borders has no CSS custom property. It appears at least 4 times across admin files. Should be `--color-admin-accent: #7c3aed` or similar.

**F7. Inconsistent heading sizes across pages**
Some pages use `fontSize: "1.5rem", fontWeight: 800` for H1 (reading, writing, listening, speaking). Others use a slightly different stack. There's no `h1`, `h2`, `h3` typographic scale in `globals.css` — heading styles are always inline. This means every page author is hand-rolling heading styles.

**F8. No empty state illustration or icon system**
The empty dashboard state is a plain text card. There are no illustrated empty states, no consistent icon treatment for zero-data conditions. This is a polish gap for a learning platform where motivation matters.

---

## G. UX Copy Improvements

| Location | Current Copy | Recommended Copy |
|---|---|---|
| Synapse page — disabled input | `Ask Synapse anything…` (grayed out) | `Synapse Brain is launching soon — you'll be first to know` |
| Synapse — coming soon banner | `Synapse AI is almost ready` | `Synapse Brain is almost ready` (never say "AI" per brand rule) |
| Certifications — in-progress | `Keep going — your cert is within reach!` | Verify this is actually shown; the page doesn't currently display this |
| Learning Hub — "Start Learning" | `Start Learning →` | `Start IELTS` / `Start SQL` etc. (descriptive + accessible) |
| Course detail — "Start Course" | `Start Course` | `Go to First Lesson` (anchor scrolls, misleading) |
| Reading/Writing — "Start →" | `Start →` | `Practice Now →` or `Begin Session →` (more motivating) |
| Login — test hint card | `Use test accounts below to explore the platform.` | Remove from production. Keep only in staging/dev. |
| Dashboard empty state | `Enroll in a course to see your dashboard.` | Add a CTA button: `Browse Courses →` linking to `/learning` |
| Admin — Advanced Cohort | `Power users and high performers` | Fine — but add criteria: `Qualifying criteria: Band 7.0+ or 30+ sessions` |
| Synapse history — "Clear all history" | `🗑️ Clear all history` | `Clear history` — and make it functional or remove it entirely if not wired |
| Writing badge | `Task 1 — Letter` / `Task 2 — Essay` | These are clear and correct for IELTS users — keep as-is |

**Brand voice reminder:** The Synapse page copy uses the word "AI" in at least one place (the coming-soon banner text, depending on implementation). Per CONTEXT.md rule: never say "AI" in the UI — always "Synapse Brain" or "Synapse."

---

## H. Engineering Improvements

### H1. 🔴 Fix the hardcoded user data bug immediately

In `app/(dashboard)/layout.jsx`:
```js
// WRONG — reads hardcoded mock user
import userData from "@/data/users.json";
const user = userData[0];
const enrolledCourses = user.enrolledCourses ?? [];
```

Should be:
```js
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions.js";

const session = await getServerSession(authOptions);
if (!session) redirect("/login");
const enrolledCourses = session.user.enrolledCourses ?? [];
```

The same fix applies to `dashboard/page.jsx`. The JWT already embeds `enrolledCourses`, `targetBand`, `examDate`, and `name` via the jwt callback in `authOptions.js`. No DB call needed — just read from the session.

### H2. 🔴 Commit all missing files to the repo

The repo is incomplete. Files imported by pages must be committed. Before the next push:
- All `components/dashboard/*` widgets
- `components/ui/Badge.jsx`
- `lib/auth/withAuth.js`
- `data/writingPrompts.json`
- `data/mock/speaking-cues.json`
- `config/metadata.js`
- `app/api/ai/evaluate/route.js`
- `app/api/auth/[...nextauth]/route.js`

Without these, the build fails with module-not-found errors.

### H3. 🟠 Remove hardcoded test credentials from login page

`app/(auth)/login/page.jsx` renders a visible hint card with `student@riseiq.ca / student2026` and `admin@riseiq.ca / admin2026` in plaintext. This is fine for a local dev environment but must not go live. Before production launch, either gate this card behind `NODE_ENV === "development"` or remove it entirely.

```js
{process.env.NODE_ENV === "development" && (
  <TestAccountsCard />
)}
```

### H4. 🟠 Add error boundaries and loading states

Currently there are no `loading.jsx` files in any route directory and no error boundaries. If a server component throws (e.g., `getServerSession` fails), Next.js will show a blank error page. Add:
- `app/(dashboard)/loading.jsx` — skeleton loader for the dashboard
- `app/(dashboard)/error.jsx` — graceful error state
- `app/admin/loading.jsx` / `error.jsx`

### H5. 🟠 Replace inline styles in admin pages with design system classes

Every admin page uses 100% inline styles. This is not just a design system issue — it's a DX and maintenance issue. When Tailwind utility classes or CSS tokens need updating, admin pages won't pick up the changes. Migrate to `.card`, `.btn-primary`, CSS tokens, and a shared `AdminTable` component.

### H6. 🟡 Add a `not-found.jsx` page

There's no custom 404 page. When a user hits any of the many broken session links, they get Next.js's default 404. Add `app/not-found.jsx` with the RiseIQ nav, an informative message, and a "Go to Dashboard" CTA.

### H7. 🟡 Separate mock data from component logic

Several admin page components (`students/page.jsx`, `audit/page.jsx`, `advanced/page.jsx`) define their mock data arrays at the top of the file, mixed with component code. Move these to `data/mock/*.js` files so when Phase 2 DB is added, the substitution is clean.

### H8. 🟡 `generateStaticParams` in learning course detail is good — extend it

`app/(dashboard)/learning/[courseKey]/page.jsx` correctly uses `generateStaticParams()` to pre-render at build time. This pattern should be applied to any other dynamic routes that use static data (e.g., session player pages once they exist).

### H9. 🟡 JWT payload could get too large

The JWT embeds `enrolledCourses` (array of objects), `targetBand`, `examDate`, `plan`, and `role`. For Phase 1 with one course, this is fine. For Phase 4 with 13 courses and rich enrollment metadata, the JWT could exceed browser cookie limits (~4KB). Plan to move non-essential fields out of the token for Phase 2.

### H10. 🟡 No test coverage

There are no tests of any kind (unit, integration, e2e). Before adding real users, add at minimum:
- Unit tests for `isEnrolledIn()` and `getEnrolledCoursesMeta()` in `courseRegistry.js`
- E2e test (Playwright) covering: login → dashboard → IELTS writing → submit → get feedback

---

## I. Page-by-Page Recommendations

### Login (`/login`)
- Remove test account hint card from production (gate behind `NODE_ENV`)
- Fix password toggle aria-label (emoji → descriptive label)
- Add proper loading spinner on Google OAuth button (currently uses `gLoading` state but no visual beyond button disable)
- "Forgot password?" → implement or remove; dead links erode trust
- Add `autocomplete="email"` and `autocomplete="current-password"` to inputs for password manager support

### Dashboard (`/dashboard`)
- CRITICAL: fix `userData[0]` → `session.user`
- Add loading.jsx skeleton for the two-column grid
- Weekly progress chart and daily goals widgets need to be built and committed
- Empty state should have a "Browse Courses" CTA button
- "RecommendedTasks" widget in IELTSDashboardSection should surface writing prompts, not be decorative

### IELTS Reading (`/ielts/reading`)
- Session player pages must be built — this is the core product loop
- "Start →" links need descriptive aria-labels
- Add a "Recently completed" section showing past sessions and scores

### IELTS Writing (`/ielts/writing`)
- Same session page gap as Reading
- Writing prompts data (`writingPrompts.json`) needs to be committed
- The writing session player needs the AI evaluation UI (`AIFeedback.jsx`) which is referenced in ARCHITECTURE.md but not found in the repo

### IELTS Listening (`/ielts/listening`)
- Only 2 sessions shown (Section 1 only), but the page copy promises "4 exam sections"
- Real audio files needed before this is usable
- Session pages missing

### IELTS Speaking (`/ielts/speaking`)
- `speaking-cues.json` is missing from repo — page will crash on load
- Speaking session player needs audio recording capability (browser MediaRecorder API)
- This is the most complex module — consider a clear "coming soon" state rather than a broken list

### Synapse (`/synapse`)
- "Synapse AI" copy should be "Synapse Brain" per brand rule
- "Clear all history" button needs either a handler or removal
- Disabled prompt buttons need `aria-disabled="true"` and a tooltip explaining why
- Consider adding an email capture: "Get notified when Synapse launches"

### Certifications (`/certifications`)
- Remove non-functional "View Certificate" and "Share / Verify" buttons, or replace with "Coming soon" state
- In-progress certs should only show courses the user is actually enrolled in — SQL and Azure shouldn't appear for an IELTS-only student
- Progress bar values (34/42, 0/54) are hardcoded — should derive from actual lesson progress

### Learning Hub (`/learning`)
- Add enrollment badge ("Enrolled ✓") to cards where user is already enrolled
- "Start Learning" CTA should say "Continue" with progress % if enrolled
- Add search/filter bar (at minimum by discipline or plan: Free / Pro)

### Course Detail (`/learning/[courseKey]`)
- "Start Course" button scrolls to module list — should navigate to first lesson
- Enroll card should show enrolled state if user is already enrolled, with "Continue" CTA instead
- Module lesson items should link to actual lesson pages (none exist yet)
- `generateStaticParams` is correctly implemented — good pattern

### Admin Overview (`/admin`)
- Stat tiles should use real data or be clearly labeled as "Demo data"
- Recent students table needs "View" row action
- Quick-link cards are useful — add a "Last updated" timestamp

### Admin Students (`/admin/students`)
- Add search input (filter by name/email)
- Add row actions: "View", "Change Role", "Deactivate"
- Add column sorting (Band, Sessions, Joined)
- Needs pagination if real data is ever connected

### Admin Advanced Cohort (`/admin/advanced`)
- Font size `0.65rem` for stat labels fails accessibility — use at minimum `0.75rem`
- 2 hardcoded students — label the page as demo data
- Consider a banner: "Students with Band 7.0+ or 30+ sessions automatically qualify"

### Admin Audit Log (`/admin/audit`)
- 6 hardcoded events — clearly demo
- Add export to CSV button (even if non-functional for now, set the expectation)
- Timestamps are hardcoded strings — standardize to ISO format

### Admin Permissions (`/admin/permissions`)
- Two role cards are informative and clear — good UX
- "Coming in Phase 2" card is appropriate
- No changes needed for Phase 1

### Admin Settings (`/admin/settings`)
- No page exists — add at minimum a stub page with planned settings sections so the nav link doesn't 404

---

## J. Priority Roadmap

### 🔴 Critical — Fix Before Any User Sees This

| # | Issue | File | Effort |
|---|---|---|---|
| J1 | Dashboard reads hardcoded user instead of session | `(dashboard)/layout.jsx`, `dashboard/page.jsx` | 1–2h |
| J2 | Commit all missing component/data files to repo | Multiple | 2–4h |
| J3 | NextAuth route handler missing | `app/api/auth/[...nextauth]/route.js` | 30min |
| J4 | Claude evaluate API route missing | `app/api/ai/evaluate/route.js` | 1h |
| J5 | Remove test credentials hint card from production login | `login/page.jsx` | 15min |
| J6 | Speaking page crashes — `speaking-cues.json` missing | `data/mock/speaking-cues.json` | 30min |

### 🟠 High — Before First Real Students

| # | Issue | File | Effort |
|---|---|---|---|
| J7 | Build session player pages for reading + writing | New pages | 2–3 days |
| J8 | Wire writing evaluation end-to-end (AI feedback) | `api/ai/evaluate` + session page | 1 day |
| J9 | Add error boundaries + loading skeletons | `loading.jsx`, `error.jsx` per route | 4h |
| J10 | Build `/progress` page | New page | 1 day |
| J11 | Add `/admin/settings` stub page | New page | 30min |
| J12 | Fix certifications enrollment-awareness | `certifications/page.jsx` | 2h |
| J13 | Add accessible aria-labels to session links | All skill pages | 1h |
| J14 | Add skip-nav link to both layouts | `layout.jsx`, `admin/layout.jsx` | 30min |

### 🟡 Medium — Next Polish Sprint

| # | Issue | Effort |
|---|---|---|
| J15 | Migrate admin pages to design system (remove inline styles) | 1 day |
| J16 | Add "Enrolled" badge to Learning Hub course cards | 2h |
| J17 | Fix "Start Course" button → navigate to first lesson | 1h |
| J18 | Fix password toggle aria-label (emoji → descriptive) | 15min |
| J19 | Add `not-found.jsx` custom 404 | 30min |
| J20 | Fix `AdminSidebar` missing `aria-label` on aside | 15min |
| J21 | Fix min font-size in admin pages (0.65rem → 0.75rem min) | 30min |
| J22 | Add search to Admin Students table | 2h |
| J23 | Wire "Clear all history" on Synapse or remove the button | 1h |
| J24 | Add `autocomplete` attributes to login form | 15min |

### 🟢 Nice-to-Have — Phase 3 Polish

| # | Issue | Effort |
|---|---|---|
| J25 | Add email capture to Synapse coming-soon page | 2h |
| J26 | Add row actions to Admin Students (View, Edit role) | 1 day |
| J27 | Add illustrated empty states | 1 day |
| J28 | Listening module — build real audio player + real audio files | 1 week |
| J29 | Speaking module — build MediaRecorder + evaluation flow | 1–2 weeks |
| J30 | WCAG 2.1 AA accessibility audit with automated tooling (axe) | 1 day |
| J31 | Add Recharts progress charts to `/progress` dashboard | 2 days |
| J32 | Blog + contact pages | 1 day |
| J33 | Add "Get notified" email to Synapse page | 1h |

---

## Summary Scorecard

| Dimension | Score | Notes |
|---|---|---|
| Architecture | 8/10 | COURSE_REGISTRY pattern, Edge middleware, JWT strategy — all well-designed |
| Design System | 7/10 | Student pages clean; admin pages bypass system entirely |
| Information Architecture | 6/10 | Nav is logical; too many dead routes hurt confidence |
| Core Functionality | 3/10 | No session player, no working AI eval pipeline, broken "Start" buttons |
| Accessibility | 4/10 | Some good patterns (aria-current, focus-visible) but multiple AA failures |
| UX Copy & Flows | 6/10 | Copy is generally good; broken flows undercut the experience |
| Engineering Quality | 5/10 | Good patterns in config layer; critical data bug, missing files |
| Mobile Experience | 5/10 | MobileNav works but Certifications tab missing, admin has no mobile layout |
| Admin Portal | 6/10 | Well-structured shell; all data is mock; no row actions |
| Production Readiness | 2/10 | Build fails without missing files; session bug; no real data flows |

**Overall: 5.5/10 — Strong foundation, significant gaps to close before real users.**

---

*Review completed March 13, 2026. Commit the missing files, fix the session data bug (J1), and build the session player pages (J7–J8) — those three efforts unlock 80% of the product's value.*
