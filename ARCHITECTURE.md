# RiseIQ — Architecture Reference

---

## System Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        User (Browser)                           │
└─────────────────────────┬───────────────────────────────────────┘
                          │ HTTPS
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│              Azure Static Web Apps CDN                          │
│              riseiq-app — East US 2                             │
│              Domain: www.riseiq.ca (GoDaddy CNAME)             │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│              Next.js 15 App (App Router)                        │
│                                                                 │
│  ┌──────────────┐  ┌───────────────┐  ┌─────────────────────┐  │
│  │ Edge Middle- │  │  Server       │  │  Client Components  │  │
│  │ ware (RBAC)  │  │  Components   │  │  ("use client")     │  │
│  │ middleware.js│  │  (layouts,    │  │  (forms, charts,    │  │
│  │              │  │   pages)      │  │   interactive UI)   │  │
│  └──────┬───────┘  └───────┬───────┘  └─────────────────────┘  │
│         │                  │                                    │
│  ┌──────▼───────────────────▼──────────────────────────────┐   │
│  │               NextAuth.js v4 (JWT)                       │   │
│  │   CredentialsProvider + GoogleProvider                   │   │
│  │   lib/auth/authOptions.js                                │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │               API Routes (/app/api/)                      │  │
│  │   POST /api/ai/evaluate  → Claude API (claude-haiku-4-5) │  │
│  │   /api/auth/*            → NextAuth endpoints            │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│              Anthropic Claude API                               │
│              Model: claude-haiku-4-5                            │
│              Use: Writing evaluation (IELTS band scoring)       │
└─────────────────────────────────────────────────────────────────┘
```

---

## Request Flow: Page Load with RBAC

```
Browser GET /dashboard
  → Azure CDN (cache miss → forwards to Next.js)
    → middleware.js runs at EDGE
      → getToken() reads JWT from cookie (no DB call)
      → token.role === "student"? → allow
      → token is null? → redirect /login?callbackUrl=/dashboard
      → token.role === "admin"? → redirect /admin
    → app/(dashboard)/layout.jsx (Server Component)
      → getServerSession() → reads user from session
      → passes enrolledCourses to <Sidebar />
    → app/(dashboard)/dashboard/page.jsx
      → iterates COURSE_SECTION_MAP × enrolledCourses
      → renders <IELTSDashboardSection /> if enrolled in "ielts"
```

---

## Request Flow: Writing Evaluation (Synapse Brain)

```
Student submits essay in WritingSession component
  → POST /api/ai/evaluate
      body: { text: "...", taskType: "task2", prompt: "Discuss..." }
  → route.js calls Anthropic SDK
      model: claude-haiku-4-5
      system: IELTS examiner persona
      user: essay + prompt
  → Claude returns structured JSON
      { overallBand, criteria[4], strengths[], improvements[], wordCountNote }
  → AIFeedback.jsx renders:
      - Overall band score (colour-coded)
      - 4 criteria cards (Task Response, Coherence, Lexical, Grammar)
      - Strengths + Improvement sections
```

---

## Auth Flow: Credentials Login

```
/login form submit
  → POST /api/auth/callback/credentials
    → authOptions.authorize()
      → looks up email in TEST_ACCOUNTS
      → password match check
      → returns user object (no password)
    → jwt() callback
      → embeds role, plan, targetBand, examDate, enrolledCourses into JWT
    → session() callback
      → exposes same fields on session.user
  → middleware redirects to /dashboard (student) or /admin (admin)
```

---

## Auth Flow: Google OAuth

```
/login "Sign in with Google" button
  → signIn("google", { callbackUrl: "/dashboard" })
  → Google OAuth consent screen
  → callback: /api/auth/callback/google
    → jwt() callback (account.provider === "google")
      → checks if email matches TEST_ACCOUNTS
        → if yes: preserves role (admin email stays admin)
        → if no: assigns role="student", plan="free"
    → redirects to callbackUrl
```

---

## Data Model (Current — Mock)

### User (in JWT / data/users.json)
```js
{
  id:              "u_student",       // unique user ID
  email:           "student@riseiq.ca",
  name:            "Alex Chen",
  role:            "student" | "admin",
  plan:            "free" | "pro" | "admin",
  targetBand:      7.5,              // IELTS target (null for non-IELTS)
  examDate:        "2026-05-15",     // ISO date string
  enrolledCourses: [
    {
      courseKey: "ielts",            // matches COURSE_REGISTRY key
      status:    "active",           // "active" | "paused" | "completed"
      enrolledAt: "2026-03-08",
      targetBand: 7.5,               // course-specific override
      examDate:   "2026-05-15",
    }
  ]
}
```

### Course Registry entry (config/courseRegistry.js)
```js
{
  key:          "ielts",
  label:        "IELTS",
  icon:         "📝",
  badgeColor:   "#6366f1",
  learningPath: "/learning/ielts",
  weight:       1,                   // render order on dashboard
}
```

---

## Route Map

### Public
| Path | Page |
|---|---|
| `/` | Landing (index.html — static) |
| `/login` | Login page (credentials + Google) |
| `/signup` | Sign up (stub) |
| `/courses` | Course catalog |
| `/pricing` | Pricing page |

### Student (protected — role: student or admin)
| Path | Page |
|---|---|
| `/dashboard` | Enrollment-driven home |
| `/ielts/reading` | IELTS Reading module |
| `/ielts/writing` | IELTS Writing module |
| `/ielts/listening` | IELTS Listening module |
| `/ielts/speaking` | IELTS Speaking module |
| `/practice/*` | Redirects → `/ielts/*` (backwards compat) |
| `/synapse` | Synapse AI assistant (coming-soon) |
| `/mock-test` | Full mock exam |
| `/progress` | Progress + analytics |
| `/certifications` | Earned + in-progress certs |
| `/learning` | Learning Hub (all courses) |
| `/learning/[key]` | Per-course detail page |
| `/profile` | User profile |

### Admin (protected — role: admin only)
| Path | Page |
|---|---|
| `/admin` | Overview dashboard |
| `/admin/students` | All students table |
| `/admin/advanced` | High-performer cohort |
| `/admin/permissions` | RBAC viewer |
| `/admin/audit` | Audit log |
| `/admin/settings` | Settings (stub) |

### API
| Path | Method | Description |
|---|---|---|
| `/api/ai/evaluate` | POST | Claude writing evaluation |
| `/api/auth/*` | GET/POST | NextAuth endpoints |

---

## Deployment & CI/CD

```
Developer
  │
  ▼
git push origin main
  │ (to Bsin9/riseiq)
  ▼
GitHub Actions
  │ .github/workflows/azure-static-web-apps-*.yml
  │ Triggers: push to main
  │ Builds: next build
  │ Deploys: Azure SWA deployment token
  │ Duration: ~3–4 minutes
  ▼
Azure Static Web Apps
  │ riseiq-app — East US 2
  │ Resource Group: RiseIQ
  ▼
www.riseiq.ca (live)
```

### Environment Variables (Azure Portal → riseiq-app → Configuration)
| Variable | Purpose | Status |
|---|---|---|
| `NEXTAUTH_SECRET` | JWT signing key | ✅ Set |
| `NEXTAUTH_URL` | Auth redirect base URL | ✅ Set → `https://www.riseiq.ca` |
| `ANTHROPIC_API_KEY` | Claude API access | ✅ Set |
| `GOOGLE_CLIENT_ID` | Google OAuth | ⚠️ Pending |
| `GOOGLE_CLIENT_SECRET` | Google OAuth | ⚠️ Pending |

---

## Component Hierarchy

```
app/(dashboard)/layout.jsx
  └── Sidebar.jsx                  (desktop — enrollment-aware)
  └── MobileNav.jsx                (mobile tab bar)
  └── {children}                   (page content)
       ├── dashboard/page.jsx
       │     ├── IELTSDashboardSection.jsx
       │     │     ├── ExamReadinessIndicator
       │     │     ├── ModuleQuickAccess
       │     │     ├── MockTestShortcut
       │     │     ├── RecommendedTasks
       │     │     └── WeakSkillAlert
       │     ├── SQLDashboardSection.jsx (stub)
       │     └── AzureDashboardSection.jsx (stub)
       ├── synapse/page.jsx
       ├── certifications/page.jsx
       └── learning/page.jsx
             └── [courseKey]/page.jsx

app/admin/layout.jsx               (requires role="admin")
  └── AdminSidebar.jsx
  └── {children}
       ├── page.jsx (overview)
       ├── students/page.jsx
       ├── advanced/page.jsx
       ├── permissions/page.jsx
       └── audit/page.jsx
```

---

## Phase 2 Architecture Plan (Database)

```
Current (mock):           Phase 2 (real):
data/users.json     →    PostgreSQL (Azure Database for PostgreSQL)
TEST_ACCOUNTS{}     →    users table + bcrypt password hashing
in-memory sessions  →    Prisma ORM + NextAuth database adapter
no submissions      →    submissions table (essays, sessions, scores)
no history          →    synapse_history table (180-day TTL)
```

**ORM:** Prisma
**DB:** Azure Database for PostgreSQL (Flexible Server)
**Auth adapter:** `@auth/prisma-adapter`

---

*Last updated: March 13, 2026*
