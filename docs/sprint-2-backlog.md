# Sprint 2 Backlog — Dynamic Content, Contact & Quality Hardening

Project: DevCon Laguna Official Website
Sprint length: **2 weeks** · Team: PM, UI/UX Designer, 2× Full-Stack Developer, QA Engineer
Follows: Sprint 1 (responsive landing page + CI/CD)

## Sprint Goal

Turn the static landing page into a **measurable, maintainable, and interactive** public
site: close FR-07 with a working contact form, make all page content data-driven, and meet
the SRS non-functional bar for performance, accessibility, and SEO.

## Scope

**In scope**

- Working contact form with email delivery and spam protection
- Content data layer for Officers, Events, and Programs & Activities
- SEO and metadata (Open Graph, sitemap, robots, structured data)
- Accessibility remediation (NFR-05)
- Performance optimization (NFR-01)
- Web analytics
- Test coverage for all new functionality

**Out of scope (deferred to later sprints)**

- Authentication, member dashboard, admin panel — Sprint 4 / Sprint 5
- Database-backed content, full CMS — Sprint 5
- Additional pages (events detail, blog/news) — Sprint 3

## Backlog

Estimates use story points (Fibonacci). Core = 39 pts, plus 1 stretch story (3 pts).

### US-201 — Contact Form (8 pts) · closes FR-07

> As a visitor, I want to send DevCon a message directly so I can reach out without leaving the site.

- [ ] Build accessible contact form UI (name, email, subject, message) matching approved design
- [ ] Client + server-side validation with clear inline errors
- [ ] Serverless API route to handle submission
- [ ] Email delivery via a transactional provider (e.g. Resend) or form service (e.g. Formspree)
- [ ] Spam protection (honeypot field and/or Cloudflare Turnstile)
- [ ] Success and error states with user feedback
- [ ] Secrets stored as environment variables (no keys in the repo)

**Acceptance:** submitting a valid form delivers an email to the DevCon inbox in production;
invalid input is blocked with helpful messages; spam attempts are filtered.

### US-202 — Content Data Layer (8 pts)

> As a content editor, I want officers, events, and programs stored as structured data so updates don't require editing components.

- [ ] Define typed data models for Officers, Events, and Programs
- [ ] Extract existing hard-coded content into data files (TS/JSON/MDX)
- [ ] Refactor `officers.tsx`, `events-carousel.tsx`, and `program-and-activities.tsx` to render from data
- [ ] Document how to add/update an entry in `docs/`
- [ ] Remove the stray `next-theme@0.1.5` dependency in `devcon/package.json` (keep `next-themes`)

**Acceptance:** a non-developer can add an officer/event/program by editing one data file;
no visual regression in Playwright snapshots.

### US-203 — SEO & Metadata (5 pts)

> As DevCon, I want the site to be discoverable and to look good when shared.

- [ ] Page metadata via the Next.js metadata API (title, description)
- [ ] Open Graph + Twitter card tags with a share image
- [ ] `sitemap.ts` and `robots.ts`
- [ ] Favicon and app-icon set
- [ ] JSON-LD Organization structured data

**Acceptance:** link previews render correctly on social platforms; sitemap and robots are
served; Lighthouse SEO ≥ 90.

### US-204 — Accessibility Pass (5 pts) · NFR-05

> As any user, including those using assistive technology, I want an accessible site.

- [ ] Run axe / Lighthouse accessibility audit and log findings
- [ ] Fix color contrast, alt text, heading order, and ARIA landmarks
- [ ] Ensure full keyboard navigation and visible focus states
- [ ] Respect `prefers-reduced-motion` for Framer Motion animations

**Acceptance:** no critical/serious axe violations; keyboard-only navigation reaches all
interactive elements; Lighthouse Accessibility ≥ 90.

### US-205 — Performance Pass (5 pts) · NFR-01

> As a visitor, I want the page to load quickly under normal network conditions.

- [ ] Convert images to `next/image` with correct sizing and lazy loading
- [ ] Optimize font loading strategy
- [ ] Defer/lazy-load below-the-fold and heavy client components
- [ ] Verify bundle size and remove unused code

**Acceptance:** Lighthouse Performance ≥ 90 on desktop and mobile; no layout shift regressions.

### US-206 — Analytics (3 pts)

> As the PM, I want engagement metrics so I can measure the landing page's effectiveness.

- [ ] Integrate privacy-friendly analytics (Vercel Analytics or GA4)
- [ ] Track key events: primary CTA clicks, contact form submissions
- [ ] Confirm data appears in the analytics dashboard

**Acceptance:** pageviews and the tracked events are visible in the analytics dashboard
within 24h of deploy.

### US-207 — Test Coverage (5 pts)

> As QA, I want Sprint 2 functionality covered by automated tests in CI.

- [ ] Playwright test for the contact form flow (valid + invalid submission)
- [ ] Extend visual snapshots to cover new/changed states
- [ ] Add an accessibility assertion (axe) to the CI pipeline
- [ ] Ensure CI is green on the Sprint 2 branch

**Acceptance:** new tests run in CI and pass; regression suite remains green.

### US-208 — Newsletter Capture (3 pts) · STRETCH

> As a visitor, I want to subscribe for updates so I stay informed about DevCon events.

- [ ] Email capture UI (footer or dedicated block)
- [ ] Store submissions or integrate an email provider
- [ ] Validation and success feedback

**Acceptance:** a valid email is captured/stored and the user sees confirmation.
*This is the cut line if velocity runs short.*

## Definition of Done (Sprint 2)

- Contact form delivers email in production
- All target content (officers, events, programs) is data-driven
- Lighthouse ≥ 90 for Performance, Accessibility, SEO, and Best Practices
- No critical axe accessibility violations
- CI green, including the new Sprint 2 tests
- Deployed to Vercel
- Project Manager approval

## Capacity note

39 core points over 2 weeks with this team is realistic-to-slightly-ambitious. US-208
(stretch) should only be pulled in if the core stories are tracking ahead by mid-sprint.
