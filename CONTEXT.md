# RiseIQ — Claude Context File

> **What is this?**
> This file is the single source of truth for any Claude session working on RiseIQ.
> Read it first, every time. Update it at the end of every session.

---

## 1. Project Identity

| Field | Value |
|---|---|
| **Product name** | RiseIQ |
| **Tagline** | Rise Smarter. Learn Faster. |
| **Live URL** | https://www.riseiq.ca |
| **Owner** | Balgeet Singh — balgeet.singh2@gmail.com |
| **GitHub repo** | `Bsin9/riseiq` |
| **Created** | March 2026 |
| **Last Claude session** | March 13, 2026 |

---

## 2. What Is RiseIQ?

RiseIQ is an AI-powered multi-course learning platform. It started as an IELTS prep tool and has grown into a full learning ecosystem. The AI engine is called **Synapse Brain** (backed by Claude API — never call it "AI" in the UI).

**Core product pillars:**
- Enrollment-driven dashboard — each student sees only the courses they're in
- Synapse Brain — real-time writing feedback scored to IELTS band rubrics
- Mock tests, progress tracking, certifications
- Admin portal with full RBAC (student vs admin roles)

---

## 3. Repository Layout

**One repo: `Bsin9/riseiq`** — all code lives here, all commits go here, this is what deploys to riseiq.ca.

Local working path: `/sessions/.../mnt/IELTS/riseiq/`

### Key file paths:

```
app/
  (auth)/login/page.jsx          ← Login page (credentials + Google OAuth)
  (dashboard)/layout.jsx         ← Student shell — wraps Sidebar + MobileNav
  (dashboard)/dashboard/page.jsx ← Enrollment-driven dashboard orchestrator
  (dashboard)/ielts/*/page.jsx   ← IELTS module pages (4 skills)
  (dashboard)/practice/*/page.jsx← Redirects → /ielts/* (backwards compat)
  (dashboard)/synapse/page.jsx   ← Synapse AI assistant (coming-soon state)
  (dashboard)/certifications/page.jsx ← Earned + in-progress certs
  (dashboard)/learning/page.jsx  ← Learning Hub (all courses)
  (dashboard)/learning/[courseKey]/page.jsx ← Per-course detail
  admin/layout.jsx               ← Admin shell (requireRole guard + AdminSidebar)
  admin/page.jsx                 ← Admin overview (stats, recent students)
  admin/students/page.jsx        ← All students table
  admin/permissions/page.jsx     ← RBAC viewer
  admin/audit/page.jsx           ← Audit log
  admin/advanced/page.jsx        ← High-performer cohort

components/
  layout/Sidebar.jsx             ← Student sidebar (enrollment-aware nav)
  layout/AdminSidebar.jsx        ← Admin sidebar (dark navy, separate shell)
  layout/MobileNav.jsx           ← Mobile tab bar
  dashboard/IELTSDashboardSection.jsx ← IELTS dashboard card block
  dashboard/SQLDashboardSection.jsx   ← SQL coming-soon stub
  dashboard/AzureDashboardSection.jsx ← Azure coming-soon stub

config/
  routes.js                      ← ALL route constants — always import from here
  courseRegistry.js              ← COURSE_REGISTRY + isEnrolledIn() + getEnrolledCoursesMeta()

data/
  users.json                     ← Mock user data (replace with DB in Phase 2)
  learningCourses.js             ← Course content structure

lib/auth/
  authOptions.js                 ← NextAuth config: credentials + Google OAuth, JWT callbacks

middleware.js                    ← Edge RBAC: protects routes, enforces admin-only, redirects
staticwebapp.config.json         ← Azure SWA: cache-control headers (CDN caching fix)
```

---

## 4. Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 15 — App Router |
| **Language** | JavaScript / React (no TypeScript) |
| **Styling** | Tailwind CSS 4 + CSS custom properties |
| **Auth** | NextAuth.js v4 — JWT strategy |
| **AI** | Claude API (`claude-haiku-4-5`) via `/api/ai/evaluate` |
| **Hosting** | Azure Static Web Apps (`riseiq-app`, East US 2) |
| **Resource Group** | RiseIQ |
| **CI/CD** | GitHub Actions → Azure SWA (~3–4 min build) |
| **Domain** | riseiq.ca — GoDaddy DNS CNAME → Azure SWA |
| **Database** | None yet — mock data in `data/users.json` |

---

## 5. Authentication & RBAC

### Test Accounts

| Email | Password | Role | Enrolled Courses |
|---|---|---|---|
| `student@riseiq.ca` | `student2026` | student | IELTS |
| `admin@riseiq.ca` | `admin2026` | admin | none |
| `demo@riseiq.ca` | `demo1234` | student | IELTS (legacy) |

### Google OAuth
- Uses `GoogleProvider` from NextAuth
- Requires env vars: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- Google users get `role=student` by default on first sign-in
- If a Google user's email matches a TEST_ACCOUNT entry, their role is preserved (admin email keeps admin role)
- Redirect URI to add in Google Cloud Console: `https://www.riseiq.ca/api/auth/callback/google`

### RBAC Middleware (`middleware.js`)
Runs at the **edge** before any page renders. Four rules:
1. Any protected route + not authenticated → redirect to `/login?callbackUrl=...`
2. Any `/admin/*` route + role is not admin → redirect to `/dashboard`
3. `/login` or `/signup` + already authenticated → redirect to role home
4. `/dashboard` + role is admin → redirect to `/admin`

Protected prefixes: `/dashboard`, `/synapse`, `/mock-test`, `/progress`, `/profile`, `/learning`, `/ielts`, `/sql`, `/azure`, `/certifications`, `/admin`

---

## 6. Course Architecture

### COURSE_REGISTRY (`config/courseRegistry.js`)

| courseKey | Label | Color | Path |
|---|---|---|---|
| `ielts` | IELTS | Indigo #6366f1 | `/learning/ielts` |
| `sql` | SQL | Amber #f59e0b | `/learning/sql` |
| `azure` | Azure | Sky #0ea5e9 | `/learning/azure` |

### Enrollment model (per user)
```json
{
  "courseKey": "ielts",
  "status": "active",
  "enrolledAt": "2026-03-08",
  "targetBand": 7.5,
  "examDate": "2026-05-15"
}
```

### Dashboard rendering pattern
`dashboard/page.jsx` iterates `COURSE_SECTION_MAP` and renders one Section component per active enrollment. Adding a new course = one entry in `COURSE_SECTION_MAP` + a new `*DashboardSection.jsx`.

---

## 7. Platform Structure

### 6 Disciplines
| Discipline | Emoji | Color |
|---|---|---|
| Language | 🌐 | Teal |
| Data & Analytics | 📊 | Indigo |
| Cloud & DevOps | ☁️ | Sky Blue |
| AI & Automation | 🤖 | Purple |
| Personal Growth | 🚀 | Gold |
| Career | 💼 | Red |

### 13 Courses (planned)
| Course | Discipline | Plan |
|---|---|---|
| IELTS General Training | Language | Free |
| IELTS Academic | Language | Pro |
| English Communication | Language | Free |
| SQL Fundamentals | Data | Free |
| Python for Data | Data | Pro |
| Power BI | Data | Pro |
| Azure Fundamentals (AZ-900) | Cloud | Free |
| Azure Administrator (AZ-104) | Cloud | Pro |
| AI Fundamentals | AI | Free |
| Prompt Engineering | AI | Pro |
| Productivity Systems | Personal Growth | Free |
| LinkedIn & Personal Brand | Career | Free |
| Resume & Interview | Career | Free |

---

## 8. Synapse Brain (AI Engine)

**UI rule:** Never say "AI" — always say "Synapse Brain" or "Synapse".

### Current implementation (writing evaluation)
```
Student submits essay → POST /api/ai/evaluate
  body: { text, taskType, prompt }
→ claude-haiku-4-5 evaluates
→ returns: { overallBand, criteria[4], strengths[], improvements[], wordCountNote }
→ AIFeedback.jsx renders colour-coded band scores
```

### Synapse page (`/synapse`)
Currently in **coming-soon** state:
- Left panel: prompt suggestions + disabled input
- Right panel: history list (mock 3 items), privacy card
- Privacy card spec: remembers courses/progress/180-day history | does NOT store passwords/payment/post-180-day

### Phase 2 plan
- Wire to Azure OpenAI or Claude API via `/api/synapse/chat`
- Persist history per user to DB (`/api/synapse/history`)
- 180-day retention window

---

## 9. Admin Portal

**URL:** `/admin` (admin role only — middleware enforces)

### Pages
| Page | Path | Description |
|---|---|---|
| Overview | `/admin` | 5 stat tiles + recent students table + 4 quick-link cards |
| All Students | `/admin/students` | 8 mock students table |
| Advanced Cohort | `/admin/advanced` | Band 7.0+ or 30+ sessions |
| Permissions | `/admin/permissions` | RBAC role viewer cards |
| Audit Log | `/admin/audit` | Read-only event log |
| Settings | `/admin/settings` | (stub — not yet implemented) |

### Admin sidebar
- Separate component from student sidebar (`AdminSidebar.jsx`)
- Dark navy (#0f172a) shell
- "Administrator" role badge in indigo
- "View as Student" escape hatch → `/dashboard`

---

## 10. Deployment

### Deploy pipeline
```
git push origin main (to Bsin9/riseiq)
  → GitHub Actions triggers
  → Azure SWA builds Next.js (~3–4 min)
  → Live at www.riseiq.ca
```

### Azure environment variables (set in Azure Portal → riseiq-app → Configuration)

| Variable | Value | Status |
|---|---|---|
| `NEXTAUTH_SECRET` | (random 32+ char string) | ✅ Set |
| `NEXTAUTH_URL` | `https://www.riseiq.ca` | ✅ Set |
| `ANTHROPIC_API_KEY` | `sk-ant-api03-zyCSY…` | ✅ Set |
| `GOOGLE_CLIENT_ID` | from Google Cloud Console | ⚠️ Not yet set |
| `GOOGLE_CLIENT_SECRET` | from Google Cloud Console | ⚠️ Not yet set |

### CDN caching fix
`staticwebapp.config.json` sets:
- `/_next/static/*` → `immutable` (hashed filenames, safe to cache forever)
- `/*` → `no-cache, must-revalidate` (HTML never cached by CDN)

**Problem this fixes:** Azure SWA was setting `s-maxage=31536000` on HTML responses, causing hard refresh to still serve stale pages from CDN.

---

## 11. Important Rules & Conventions

1. **Route constants** — never hard-code paths. Always import from `config/routes.js`.
2. **Course-agnostic** — all dashboard/sidebar logic must go through `COURSE_REGISTRY`. Adding a course should NOT require editing layout files.
3. **Synapse = Synapse Brain** — never "AI" in UI copy.
4. **No regressions** — `/practice/*` routes must continue to work (they redirect → `/ielts/*`).
5. **Admin shell is separate** — `AdminSidebar.jsx` never merges with `Sidebar.jsx`.
6. **`requireRole("admin")`** — every `/app/admin/*` layout must call this server-side guard.
7. **JWT strategy** — no DB session lookups. User data is in the JWT token.
8. **Phase 2 before prod** — `data/users.json` is mock data only. Replace with Prisma + PostgreSQL before real users.

---

## 12. Pending Tasks

### Immediate / unblocked
- [ ] **Set Google OAuth env vars** in Azure Portal → riseiq-app → Configuration: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- [ ] **Add redirect URI** in Google Cloud Console: `https://www.riseiq.ca/api/auth/callback/google`
- [ ] **Verify login flow end-to-end**: credentials login → student dashboard; admin@riseiq.ca → admin portal; Google OAuth → dashboard
- [ ] **Admin settings page** (`/admin/settings`) — currently a stub

### Phase 2 — Database & Backend
- [ ] Prisma + PostgreSQL replacing `data/users.json`
- [ ] Real user registration (email/password hashing with bcrypt)
- [ ] Persistent session/submission storage
- [ ] `/api/synapse/chat` — wire Synapse to Claude API
- [ ] `/api/synapse/history` — 180-day history per user
- [ ] Profile & billing page
- [ ] Stripe integration for Pro plan upgrades

### Phase 3 — Polish & Scale
- [ ] Certificate PDF generation + public verify URL (`/verify/:id`)
- [ ] Admin: student search, filter, invite flow, role change
- [ ] Progress/Analytics — Recharts multi-course dashboard
- [ ] Listening module: real audio files (mock references only now)
- [ ] Speaking module: video recording + evaluation
- [ ] WCAG 2.1 AA accessibility audit
- [ ] Blog page content (`/blog`)
- [ ] Contact form (`/contact`)
- [ ] Email notifications (SendGrid or Resend)

### Phase 4 — Courses
- [ ] SQL course content + `/sql/practice` module
- [ ] Azure (AZ-900) course + `/azure/labs` module
- [ ] Add `SQLDashboardSection.jsx` and `AzureDashboardSection.jsx` with real content (currently coming-soon stubs)

---

## 13. Known Issues & Bugs Fixed

| Issue | Status | Fix |
|---|---|---|
| Azure CDN serving stale HTML (`s-maxage=31536000`) | ✅ Fixed | `staticwebapp.config.json` — commit `484cb8b` |
| `/my-courses` and `/learning` both existed, confusing routing | ✅ Fixed | `/my-courses` redirects to `/learning` |
| Sidebar hardcoded to IELTS skills only | ✅ Fixed | Universal nav + enrollment-driven section rendering |
| Login page had pre-filled credentials | ✅ Fixed | Empty fields + test account hint card at bottom |
| Admin user redirected to student dashboard | ✅ Fixed | Middleware rule 4 + `requireRole()` guard |

---

## 14. Important Credentials Reference

| Item | Value | Where stored |
|---|---|---|
| Domain | riseiq.ca | GoDaddy DNS |
| Azure resource | `riseiq-app` | Azure Portal |
| GitHub | `Bsin9/riseiq` | github.com |
| Student test login | `student@riseiq.ca` / `student2026` | `lib/auth/authOptions.js` |
| Admin test login | `admin@riseiq.ca` / `admin2026` | `lib/auth/authOptions.js` |
| Anthropic API key | `sk-ant-api03-zyCSY…` | Azure SWA app settings |
| Claude model | `claude-haiku-4-5` | `/app/api/ai/evaluate/route.js` |

---

## 15. Notes for Claude

- **One repo: `Bsin9/riseiq`** — all code lives here, all commits go here.
- **No TypeScript** — this project uses plain JavaScript. Don't add `.ts`/`.tsx` files.
- **Tailwind 4** — utility class syntax is the same, but config is in `globals.css`, not `tailwind.config.js`.
- **App Router** — this is Next.js App Router. Use `"use client"` for interactive components. Layouts and pages are server components by default.
- **Mock data** — `data/users.json` only has 1 real-ish entry. All admin student tables use hardcoded mock arrays inside the page components.
- **Update this file** at the end of every Claude session.

---

*Last updated: March 13, 2026*
