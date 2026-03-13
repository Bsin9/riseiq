# RiseIQ Platform Redesign — Full Engineering Specification v2.0
**Date:** 2026-03-13 | **Scope:** Student + Admin + AI Assistant | **Author:** Principal Engineer

---

## UX Diagnosis — What's Broken Today

| # | Issue | UX Impact |
|---|-------|-----------|
| 1 | IELTS items (Reading/Writing/Listening/Speaking) in primary nav | SQL/Azure students see irrelevant items. Nav is course-specific, not platform-wide |
| 2 | No role separation — same shell for Student and Admin | Admins have no management surface. RBAC is authOptions-only, not enforced in UI |
| 3 | No empty states — goals/activity widgets show "No sessions yet" with no CTA | New users hit a blank wall with no next action |
| 4 | Synapse exists as a "coming soon" placeholder | Zero value delivery. No history, no privacy spec, no context awareness |
| 5 | No certification flow | Completed students have nowhere to go. No shareable proof of achievement |
| 6 | No Google OAuth | High signup friction. Email/password is a barrier for new learners |
| 7 | No middleware-level RBAC | Admin routes protected only at component level — client-side bypass possible |
| 8 | Dashboard shows NaN% / "Gap: 0.0" when data is null | Broken trust signal on first load |

---

## Product Principles

1. **Next action always visible** — every screen has exactly one primary CTA above the fold
2. **Role renders the shell** — Student and Admin see completely different application chrome
3. **Progress predicts outcomes** — show band trajectory, not just current score
4. **Privacy by design** — Synapse declares what it knows; history auto-expires at 180 days
5. **Empty states earn trust** — blank states are helpful, not embarrassing
6. **Course-native, platform-universal** — primary nav works for every course; course UI injects contextually
7. **Google-first auth** — OAuth reduces drop-off; credentials are the fallback

---

## Information Architecture

### Student Routes
```
/                       Public landing
/login                  Auth (credentials + Google)
/signup                 Registration (credentials + Google)
/dashboard              Home — per-enrolled-course sections
/synapse                AI assistant + 180-day history
/mock-test              Course-aware exam launcher
/progress               Multi-course analytics
/certifications         Earned certs + in-progress tracker
/profile                Account info, notifications, security
/learning               Course catalog
/learning/[courseKey]   Course detail (IELTS / SQL / Azure)
/ielts/reading          IELTS Reading practice
/ielts/writing          IELTS Writing practice
/ielts/listening        IELTS Listening practice
/ielts/speaking         IELTS Speaking practice
/sql/practice           SQL practice (Phase 2)
/azure/labs             Azure labs (Phase 2)
/session/[id]           Live session engine
```

### Admin Routes
```
/admin                  Overview — platform stats + recent students
/admin/students         All students — searchable, filterable table
/admin/advanced         Advanced cohort (Band 7.0+ or 30+ sessions)
/admin/permissions      RBAC role viewer + management (Phase 2)
/admin/audit            Read-only audit log (365-day retention)
/admin/settings         Platform-level settings
```

### RBAC Matrix
| Route Prefix | Student | Admin | Unauthenticated |
|---|---|---|---|
| `/dashboard/*` | ✅ | → `/admin` | → `/login` |
| `/admin/*` | → `/dashboard` | ✅ | → `/login` |
| `/login`, `/signup` | → home | → home | ✅ |
| All other protected | ✅ | ✅ | → `/login` |

---

## Screen Designs

### 1. Student Dashboard
**Primary question:** "What should I do right now?"

**Layout:** 2-column (main 1fr / sidebar 320px)

Left column renders one `<CourseDashboardSection>` per enrolled course, in registry order.
IELTS section: Exam Readiness bar → Practice Grid (2×2) → Mock Test CTA → Recommended Tasks → Weak Skill Alert.
Right column: Weekly Activity chart → Today's Goals checklist → Recent Activity feed.

**Empty state:** Single card — "No courses yet. Browse the Learning Hub →"

**Mobile:** Stack columns. Practice grid becomes horizontal scroll. Goals collapse to 2 items.

---

### 2. Admin Dashboard
**Primary question:** "Is the platform healthy? Who needs attention?"

**Layout:** Full-width with stat row + student table + quick-link cards

Stat row (5 tiles): Total Students / Active This Week / Avg Band / Mock Tests This Month / Certs Issued.
Student table: Name | Email | Course | Plan | Band | Sessions | Status | Joined — sortable, searchable (Phase 2).
Quick-links: All Students / Permissions / Audit Log / Advanced Cohort.

**Shell difference:** AdminSidebar is dark navy (#0f172a) vs student sidebar (white). Shows "Administrator" badge. Has "View as Student" escape hatch.

---

### 3. Synapse AI Assistant
**Primary question:** "What do I need to know right now about my learning journey?"

**Layout:** 2-column (chat area 1fr / right panel 280px)

Chat area: Suggested prompts → input bar at bottom (⌘+Enter to send).
Right panel: History list (date + tag + preview, searchable) → Privacy card.

**History spec:**
- Retention: 180 calendar days from message timestamp
- Older records are not archived — they are permanently deleted at TTL boundary
- Search: client-side filter on preview text + tag within the 180-day window
- Clear all: soft-delete all records for the user immediately

**Privacy card (always visible):**
- ✅ Remembers: enrolled courses, progress milestones, recent activity
- ✅ Remembers: conversation history for up to 180 days
- ❌ Does NOT store: passwords, payment details, documents
- ❌ Does NOT store: conversations after 180 days — permanently expired

**API shape (Phase 2):**
```
POST /api/synapse/chat
  body: { message, contextSnapshot: { courses, progress, certs } }
  returns: { reply, sessionId }

GET  /api/synapse/history?days=180
  returns: SynapseMessage[]

DELETE /api/synapse/history
  effect: permanently deletes all messages for the session user
```

---

### 4. Certifications
**Primary question:** "What have I earned and how do I prove it?"

Earned certs: Card per certificate with icon, course name, issue date, score, verification ID.
Actions: "View Certificate" (PDF) / "Share / Verify" (public URL with metadata).
In-progress: Progress bar per enrolled course — lesson count + % complete.

---

### 5. Profile & Billing (Phase 2)
Tabs: Profile Info / Notifications / Security / Payment Methods / Invoices.
Invoices tied to enrolled courses with download as PDF.

---

## Data Model

### User
```typescript
interface User {
  id:              string;
  email:           string;
  name:            string;
  role:            "student" | "admin";
  plan:            "free" | "pro" | "admin";
  streakDays:      number;
  enrolledCourses: CourseEnrollment[];
  createdAt:       string; // ISO-8601
}

interface CourseEnrollment {
  courseKey:   "ielts" | "sql" | "azure";
  status:      "active" | "paused" | "completed";
  enrolledAt:  string;
  targetBand?: number;    // IELTS only
  examDate?:   string;    // IELTS only
}
```

### Certificate
```typescript
interface Certificate {
  id:         string;
  userId:     string;
  courseKey:  string;
  issuedAt:   string;
  score:      string;      // "Band 7.5" | "SQL Level 3" etc.
  verifyId:   string;      // public verification token
  pdfUrl?:    string;
}
```

### Synapse Message
```typescript
interface SynapseMessage {
  id:        string;
  userId:    string;
  role:      "user" | "assistant";
  content:   string;
  tags:      string[];     // ["Writing", "IELTS", "Planning"]
  createdAt: string;       // ISO-8601
  expiresAt: string;       // createdAt + 180 days — enforced at DB + API layer
}
```

---

## Google OAuth Setup

**Required Azure SWA environment variables:**
```
GOOGLE_CLIENT_ID      = <from Google Cloud Console>
GOOGLE_CLIENT_SECRET  = <from Google Cloud Console>
NEXTAUTH_SECRET       = <32-char random string>
NEXTAUTH_URL          = https://www.riseiq.ca
```

**Google Cloud Console steps:**
1. Console → APIs & Services → Credentials → Create OAuth 2.0 Client
2. Application type: Web application
3. Authorized redirect URIs: `https://www.riseiq.ca/api/auth/callback/google`
4. Add the Client ID and Secret to Azure SWA environment variables

**Behavior:** Google users default to `role=student`. If the Google email matches an entry in `TEST_ACCOUNTS` (e.g. admin@riseiq.ca), that account's role is preserved.

---

## Test Accounts

| Role | Email | Password | Notes |
|------|-------|----------|-------|
| Student | `student@riseiq.ca` | `student2026` | Enrolled in IELTS, Pro plan |
| Admin | `admin@riseiq.ca` | `admin2026` | Full admin portal access |
| Legacy | `demo@riseiq.ca` | `demo1234` | Backwards compat only |

---

## Component Inventory

### Core (exist today)
- `WelcomeBanner` — name + exam countdown + streak
- `ExamReadinessIndicator` — progress bar + band labels
- `ModuleQuickAccess` — 2×2 practice grid (IELTS)
- `MockTestShortcut` — dark navy CTA card
- `WeeklyProgressChart` — bar chart (This Week)
- `DailyGoalsWidget` — checklist
- `RecentActivityFeed` — timeline
- `WeakSkillAlert` — alert card

### New (this sprint)
- `AdminSidebar` — dark navy, role-badged, admin nav
- `IELTSDashboardSection` — wraps all IELTS widgets with section header
- `SQLDashboardSection` — stub (Phase 2)
- `AzureDashboardSection` — stub (Phase 2)
- `SynapseHistoryPanel` — 180-day list + search + clear
- `SynapsePrivacyCard` — always-visible privacy affordance
- `CertificateCard` — earned cert with verify/share actions

### Phase 2
- `BillingSection` — payment methods + invoices
- `ProfileTabs` — tabbed profile/settings
- `MockTestLauncher` — course-aware exam selector
- `ProgressAnalytics` — multi-course Recharts dashboard
- `AdminStudentDetail` — drawer/modal with full student profile

---

## Implementation Rollout

### Phase 1 — Foundation (DONE ✅)
- RBAC middleware (middleware.js) — edge-level route protection
- Test accounts (student + admin)
- Google OAuth provider (configured; env vars needed in Azure)
- Admin portal (/admin, /admin/students, /admin/advanced, /admin/permissions, /admin/audit)
- Certifications page (/certifications)
- Synapse v1 (history panel + privacy spec)
- Sidebar: Certifications added; course-agnostic universal nav

### Phase 2 — Core Features (Next 2 weeks)
- Wire Google OAuth (set GOOGLE_CLIENT_ID + GOOGLE_CLIENT_SECRET in Azure SWA)
- Real database (Prisma + PostgreSQL or Azure CosmosDB) replacing JSON files
- Synapse: connect to Azure OpenAI, implement /api/synapse/chat + /api/synapse/history
- Profile/Billing: payment methods + invoice list (Stripe integration)
- Progress/Analytics: multi-course Recharts dashboard

### Phase 3 — Polish (Week 3–4)
- Certificate PDF generation + public verify URL
- Admin: student search/filter, invite admin, change roles
- Mock test launcher with course-aware exam types
- Empty state illustrations + onboarding flow for new signups
- A11y audit (WCAG 2.1 AA): focus rings, aria-labels, contrast

### Phase 4 — Scale
- Feature flags per route (LaunchDarkly or simple env-var gates)
- Analytics: track lesson_start, mock_test_complete, cert_earned events
- Synapse memory: vector embeddings for long-term context (beyond 180-day window)

---

## Key Metrics to Track

| Metric | Target | How |
|--------|--------|-----|
| D7 activation rate (≥1 lesson started) | > 60% | Event: lesson_start |
| Weekly active users (≥1 session) | > 40% | Event: session_start |
| Mock test completion rate | > 70% | Event: mock_test_complete |
| Certification claim rate (eligible students) | > 50% | Event: cert_viewed |
| Support tickets about navigation | ↓ 50% | Zendesk tag: nav |
| Google OAuth adoption (vs credentials) | > 60% | NextAuth provider log |
