# Software Requirements Specification (SRS) — Phase 2

**Version:** 2.0
**Status:** Draft for approval
**Supersedes:** SRS v1.0 (Sprint 1 — Landing Page)

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) defines the functional and non-functional
requirements for **Phase 2** of the DevCon Laguna Official Website, beginning with Sprint 2.
It builds on the Sprint 1 landing page and serves as the primary reference for the
development team as the site becomes interactive, maintainable, and discoverable. Each
functional requirement is written to map directly to a Kanban ticket (user story +
acceptance criteria).

### 1.2 Scope

Phase 2 extends the existing landing page rather than replacing it. The immediate scope
(Sprint 2) covers a working contact form, a content data layer, SEO and metadata,
accessibility and performance improvements, and web analytics. Sprint 3 makes the page
dynamic: events, officers, and key section images move to a hosted headless CMS, with cached
revalidation and instant on-demand publishing; those requirements are listed in Section 5 as
planned/future requirements and will be detailed at the Sprint 3 planning session. Member application and account management are handled by a
separate DevCon website and are out of scope.

## 2. Overall Description

### 2.1 Product Perspective

The website is a web-based application built with Next.js, React, and Tailwind CSS, deployed
on Vercel. Phase 1 delivered the responsive landing page. Phase 2 introduces the first
server-side functionality (contact form submission), a structured content layer that
decouples content from code, and quality and discoverability improvements. It remains the
foundation for future public content features (events, news). Member-facing and
administrative features live on a separate DevCon website.

### 2.2 Product Objectives

The website should:

- Allow visitors to contact DevCon Laguna directly from the site.
- Present content that can be updated without changing code.
- Be discoverable through search engines and shareable on social media.
- Meet accessibility and performance standards suitable for a public organization.
- Provide the team with engagement metrics.
- Continue to serve as the foundation for future website development.

### 2.3 Target Users

- Students
- Developers
- Community members
- Event participants
- Potential partners and sponsors
- General website visitors
- **Content editors** — team members who maintain officers, events, and programs via the
  content data layer (FR-12)

> Member application and account management are served by a separate DevCon website; this
> project has no authenticated end-user or administrator roles.

## 3. Functional Requirements (Sprint 2)

Each requirement below is ready to be filed as a Kanban ticket. The **Ticket** line gives the
suggested title and labels using the team's convention.

### FR-10 Contact Form

> **Ticket:** `CON-01: Contact Form` — labels: `feature`, `front-end`, `back-end`, `high priority`, `sprint-2`

**User Story:**
As a visitor, I want to send DevCon Laguna a message directly from the website so I can reach
out without leaving the site or opening a separate email client.

**Acceptance Criteria:**

- The contact section shall provide a form with fields for name, email, subject, and message.
- The form shall validate input on both the client and server, showing clear inline errors
  for missing or malformed fields (e.g. invalid email).
- On successful submission, the system shall deliver the message to DevCon Laguna's official
  inbox and show the user a success confirmation.
- On failure, the system shall show a clear error message and preserve the user's input.
- The submission endpoint shall use credentials stored as environment variables; no secrets
  appear in the codebase.

### FR-11 Spam Protection

> **Ticket:** `CON-02: Contact Form Spam Protection` — labels: `feature`, `back-end`, `security`, `medium priority`, `sprint-2`

**User Story:**
As DevCon Laguna, I want the contact form protected from spam and bots so our inbox stays
useful.

**Acceptance Criteria:**

- The form shall include bot mitigation (honeypot field and/or a CAPTCHA such as Cloudflare
  Turnstile).
- Submissions failing bot checks shall be rejected without delivering an email.
- Legitimate users shall be able to submit without friction on supported browsers.

### FR-12 Content Data Layer

> **Ticket:** `DATA-01: Content Data Layer` — labels: `feature`, `front-end`, `refactor`, `high priority`, `sprint-2`

**User Story:**
As a content editor, I want officers, events, and programs stored as structured data so I can
update site content without changing component code.

**Acceptance Criteria:**

- Officers, events, and programs shall be stored as typed, structured data files
  (e.g. TypeScript/JSON/MDX), separate from presentation components.
- The Officers, Events, and Programs & Activities sections shall render from this data.
- Adding or editing an entry shall require editing only a data file, with no component
  changes and no visual regressions in the snapshot tests.
- Documentation shall describe how to add or update an entry.

### FR-13 SEO & Metadata

> **Ticket:** `SEO-01: Page Metadata & Social Sharing` — labels: `feature`, `front-end`, `SEO`, `medium priority`, `sprint-2`

**User Story:**
As DevCon Laguna, I want the site to be discoverable by search engines and to preview well
when shared, so more people find and visit us.

**Acceptance Criteria:**

- The page shall define title and description metadata via the framework's metadata API.
- The page shall include Open Graph and Twitter Card tags with a share image.
- Shared links shall render a correct preview (title, description, image) on major
  platforms.
- Lighthouse SEO score shall be ≥ 90.

### FR-14 Sitemap & Robots

> **Ticket:** `SEO-02: Sitemap & Robots` — labels: `feature`, `front-end`, `SEO`, `low priority`, `sprint-2`

**User Story:**
As a search engine, I want a sitemap and robots directives so I can index the site correctly.

**Acceptance Criteria:**

- The system shall serve a valid `sitemap.xml`.
- The system shall serve a valid `robots.txt` with appropriate directives.
- A favicon and app-icon set shall be present.

### FR-15 Structured Data

> **Ticket:** `SEO-03: Organization Structured Data` — labels: `feature`, `front-end`, `SEO`, `low priority`, `sprint-2`

**User Story:**
As a search engine, I want structured organization data so I can display rich information
about DevCon Laguna.

**Acceptance Criteria:**

- The page shall include JSON-LD Organization structured data (name, logo, URL, social
  profiles).
- The structured data shall validate against a schema validator without errors.

### FR-16 Web Analytics

> **Ticket:** `ANL-01: Web Analytics & Engagement Tracking` — labels: `feature`, `front-end`, `medium priority`, `sprint-2`

**User Story:**
As the Project Manager, I want engagement metrics so I can measure the landing page's
effectiveness and inform future decisions.

**Acceptance Criteria:**

- The system shall integrate a privacy-friendly analytics provider (e.g. Vercel Analytics or
  GA4).
- The system shall track pageviews and key events (primary CTA clicks, contact form
  submissions).
- Metrics shall be visible in the analytics dashboard within 24 hours of deployment.

### FR-17 Newsletter Subscription (Stretch)

> **Ticket:** `NEWS-01: Newsletter Subscription` — labels: `feature`, `front-end`, `back-end`, `low priority`, `sprint-2`, `stretch`

**User Story:**
As a visitor, I want to subscribe for updates so I stay informed about DevCon Laguna events
and news.

**Acceptance Criteria:**

- The system shall provide an email capture field (footer or dedicated block).
- The system shall validate the email and store it or forward it to an email provider.
- The user shall receive clear success or error feedback.
- *This requirement is a stretch goal and is pulled in only if Sprint 2 tracks ahead of
  plan.*

## 4. Non-Functional Requirements

### NFR-01 Performance

- The landing page shall achieve a Lighthouse Performance score ≥ 90 on desktop and mobile.
- Images shall be optimized and served responsively; below-the-fold and heavy client
  components shall be lazy-loaded.

### NFR-02 Usability

- Navigation and interactions shall be intuitive with clear feedback.
- The contact form shall communicate validation, loading, success, and error states.
- Layout shall remain consistent across the page.

### NFR-03 Reliability

- No broken links, missing images, or missing assets.
- No critical UI issues across supported browsers.
- Contact form submissions shall succeed reliably or fail gracefully with user feedback.

### NFR-04 Compatibility

The website shall support the latest versions of Google Chrome, Microsoft Edge, Mozilla
Firefox, and Safari.

### NFR-05 Accessibility

- The website shall target WCAG 2.1 AA conformance.
- It shall use readable typography and sufficient color contrast.
- All meaningful images shall have alternative text.
- All interactive elements shall be keyboard-navigable with visible focus states.
- Animations shall respect the user's reduced-motion preference.
- There shall be no critical or serious axe accessibility violations.

### NFR-06 Security & Privacy

- Secrets (API keys, tokens) shall be stored as environment variables, never in the
  repository.
- User-submitted data shall be transmitted over HTTPS and not exposed in URLs or logs.
- The analytics solution shall be configured in a privacy-friendly manner.

### NFR-07 Maintainability

- Content shall be decoupled from presentation via the content data layer (FR-12).
- New functionality shall be covered by automated tests in the CI pipeline.

## 5. Planned / Future Requirements (Sprint 3)

These are captured for roadmap visibility and will be detailed at the Sprint 3 planning
session. They complete Phase 2.

Sprint 3's theme is **Dynamic Content via Headless CMS**: the landing page stops being static,
with content managed by editors in a hosted CMS rather than by developers in code.

| ID | Requirement | Target Sprint |
|---|---|---|
| FR-18 | Headless CMS adoption and content modeling (Events, Officers, Landing Page Images) | Sprint 3 |
| FR-19 | Events section rendered from CMS data | Sprint 3 |
| FR-20 | Officers section rendered from CMS data | Sprint 3 |
| FR-21 | CMS-managed landing page images (hero, Who We Are carousel, What We Do, bottom section) | Sprint 3 |
| FR-22 | Content caching with scheduled revalidation (~30 minute interval) | Sprint 3 |
| FR-23 | Authenticated on-demand revalidation for instant publishing | Sprint 3 |

**Content freshness model (FR-22, FR-23).** The public site shall serve cached CMS content
rather than calling the CMS on every request; the cache shall revalidate on an approximately
30-minute interval, so edits appear without a redeploy. Administrators shall additionally be
able to trigger an immediate, authenticated revalidation so urgent changes publish instantly.
If a revalidation fetch fails, the last known good content shall continue to be served.

> **Out of scope:** Member application, user authentication, member dashboards, and
> database-backed accounts are handled by a **separate DevCon website** and are not
> requirements of this project; the public "Join Us" call-to-action links out to that site.
> Content administration for this site is provided by the **hosted headless CMS**, not by a
> bespoke admin application built in this project. Event detail pages, a blog/news section,
> and event registration are deferred beyond Phase 2.

## 6. Acceptance Criteria (Sprint 2)

Sprint 2 is considered complete when:

- The contact form delivers messages to DevCon Laguna in production, with spam protection
  active.
- Officers, events, and programs are data-driven and editable without code changes.
- SEO metadata, sitemap, robots, and structured data are in place.
- Lighthouse scores are ≥ 90 for Performance, Accessibility, SEO, and Best Practices.
- There are no critical axe accessibility violations.
- Analytics is live and reporting.
- Manual, automated, and regression testing pass, and the CI/CD pipeline is green.
- QA approves the release candidate and the Project Manager provides final approval.
- The website is successfully deployed to Vercel.

## 7. Project Timeline & Milestones

**Sprint 2 (Development):** August 12 – August 25, 2026
**Sprint Goal:** Deliver an interactive, maintainable, and discoverable DevCon Laguna site —
working contact form, data-driven content, and SEO/accessibility/performance/analytics
hardening.
**Target Deployment:** August 26, 2026
**Deployment Platform:** Vercel

| Date (2026) | Activity |
|---|---|
| Aug 12 | Phase 2 Charter & SRS approval, Sprint 2 planning |
| Aug 13 – Aug 21 | Development, code reviews, CI validation |
| Aug 22 – Aug 25 | QA testing, accessibility & performance audits, bug fixes |
| Aug 25 | Sprint review, final QA approval, PM approval |
| Aug 26 | Production deployment to Vercel |

Full multi-sprint milestones are listed in the Project Charter (Phase 2).
