# RiseIQ — Task Backlog

> Track all pending work here. Update after every session.
> Format: `- [ ]` pending | `- [x]` done | `- [~]` in progress

---

## 🔴 Immediate (Unblocked Now)

- [ ] Set `GOOGLE_CLIENT_ID` in Azure Portal → riseiq-app → Configuration
- [ ] Set `GOOGLE_CLIENT_SECRET` in Azure Portal → riseiq-app → Configuration
- [ ] Add `https://www.riseiq.ca/api/auth/callback/google` as authorized redirect URI in Google Cloud Console
- [ ] Verify end-to-end login: `student@riseiq.ca` → student dashboard
- [ ] Verify end-to-end login: `admin@riseiq.ca` → admin portal
- [ ] Verify Google OAuth sign-in → student dashboard
- [ ] Build `/admin/settings` page (currently a stub route with no content)

---

## 🟠 Phase 2 — Database & Real Auth

- [ ] Set up Prisma + PostgreSQL (replace `data/users.json`)
- [ ] Real user registration — email/password with bcrypt
- [ ] Persistent essay/session submission storage
- [ ] Wire `/api/synapse/chat` → Claude API (streaming response)
- [ ] Wire `/api/synapse/history` → DB (180-day retention)
- [ ] Profile page — real user data (name, avatar, plan, exam date)
- [ ] Billing page — plan status, upgrade CTA
- [ ] Stripe integration — Pro plan checkout + webhook
- [ ] Enrollment system — allow users to enroll in courses from Learning Hub

---

## 🟡 Phase 3 — Polish

- [ ] Certificate PDF generation (use a library like `react-pdf` or `puppeteer`)
- [ ] Public certificate verify page `/verify/:id`
- [ ] Admin: student search + filter
- [ ] Admin: invite new admin (role change flow)
- [ ] Progress/Analytics — Recharts charts per course
- [ ] Listening module — real audio files (currently mock references)
- [ ] Speaking module — audio recording + evaluation via Claude
- [ ] WCAG 2.1 AA accessibility audit across all pages
- [ ] Blog page (`/blog`) — content + CMS or markdown-based
- [ ] Contact form (`/contact`) — form + email submission (Resend or SendGrid)
- [ ] Email notifications — enrollment confirmation, exam date reminders
- [ ] Mobile nav — ensure all new routes are reachable from mobile tab bar

---

## 🟢 Phase 4 — New Courses

- [ ] SQL course content — lessons, exercises, `/sql/practice` module
- [ ] Upgrade `SQLDashboardSection.jsx` from coming-soon → real content
- [ ] Azure (AZ-900) course content — modules, labs, `/azure/labs`
- [ ] Upgrade `AzureDashboardSection.jsx` from coming-soon → real content
- [ ] Add `python` to COURSE_REGISTRY + `PythonDashboardSection.jsx`
- [ ] Add `powerbi` to COURSE_REGISTRY + `PowerBIDashboardSection.jsx`
- [ ] Build out 6-discipline / 13-course catalog in Learning Hub

---

## ✅ Done (Recent)

- [x] Phase 1 dashboard redesign — enrollment-driven, course-agnostic architecture
- [x] COURSE_REGISTRY + `isEnrolledIn()` / `getEnrolledCoursesMeta()` helpers
- [x] Universal student sidebar (6 nav items, no longer IELTS-only)
- [x] AdminSidebar + separate admin shell (`/admin` layout)
- [x] Admin portal pages: overview, students, permissions, audit, advanced
- [x] RBAC Edge Middleware (`middleware.js`) — 4 routing rules
- [x] Two test accounts: `student@riseiq.ca` + `admin@riseiq.ca`
- [x] Google OAuth integration in `authOptions.js`
- [x] Certifications page (`/certifications`)
- [x] Synapse page coming-soon state with history panel + privacy card
- [x] `/ielts/*` canonical URLs + `/practice/*` redirect aliases
- [x] Learning Hub (`/learning` + `/learning/[courseKey]`)
- [x] Azure CDN caching bug fixed (`staticwebapp.config.json`)
- [x] Login page — Google sign-in button + test account hint card

---

*Last updated: March 13, 2026*
