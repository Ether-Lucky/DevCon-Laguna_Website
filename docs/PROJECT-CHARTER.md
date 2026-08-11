# Project Charter — Phase 2

**Version:** 2.0
**Status:** Draft for approval
**Supersedes:** Project Charter v1.0 (Sprint 1 — Landing Page)

## Project Title

DevCon Laguna Official Website — Phase 2: Dynamic Content, Engagement & Expansion

## Project Sponsor

DevCon

## Project Manager

Lucky Guevarra

## Project Team

- Project Manager
- UI/UX Designer
- Full Stack Developer 1
- Full Stack Developer 2
- Quality Assurance Engineer

## Project Background

Phase 1 delivered and deployed a responsive landing page for DevCon Laguna, satisfying the
Sprint 1 functional requirements and establishing a CI/CD pipeline with automated and visual
regression testing. The landing page introduces the organization, its mission, officers, and
programs, and is live on Vercel.

Phase 2 builds on that foundation. With the public presence established, the organization now
needs the site to be **interactive, maintainable, discoverable, and expandable**: a working
contact channel, content that can be updated without code changes, strong SEO and
accessibility, measurable engagement, and — across subsequent sprints — additional pages,
member features, and content administration.

## Project Objective

To evolve the DevCon Laguna website from a static landing page into a measurable,
maintainable, and interactive platform, delivered incrementally across a multi-sprint
roadmap while continuing the Agile workflow and quality practices established in Phase 1.

## Project Scope

Phase 2 is delivered across four sprints (Sprint 2–5). The **immediate sprint (Sprint 2)** is
fully specified below and in the SRS; later sprints are directional and refined at their
planning sessions.

### In Scope — Sprint 2 (current)

- Working contact form with email delivery and spam protection
- Content data layer for officers, events, and programs (updates without code changes)
- SEO and metadata (Open Graph, sitemap, robots, structured data)
- Accessibility remediation (WCAG 2.1 AA target)
- Performance optimization (Lighthouse ≥ 90)
- Web analytics and engagement tracking
- Automated test coverage for all new functionality
- Continued deployment to Vercel

### In Scope — Phase 2 roadmap (Sprints 3–5)

- **Sprint 3 — Events & News Expansion:** multi-page routing, event detail pages, blog/news
  section, event registration
- **Sprint 4 — Membership & Community:** authentication, member dashboard, database
  integration
- **Sprint 5 — Admin & CMS:** admin panel, full content management system, role management,
  analytics dashboard

### Out of Scope (Phase 2)

- E-commerce or paid ticketing/payments
- Native mobile applications
- Third-party integrations beyond those required by the sprint stories (email, analytics)
- Any feature not represented by an approved requirement in the SRS

## Deliverables

- Updated Project Charter (this document) and Software Requirements Specification (v2.0)
- Product Backlog and per-sprint backlogs
- Kanban tickets on the repository board (user story + acceptance criteria + labels)
- Updated UI/UX designs for new components (contact form, newsletter, etc.)
- Working contact form and content data layer
- SEO, accessibility, and performance improvements
- Analytics integration
- QA Testing Report and expanded automated test suite
- Deployed website (Vercel)

## Success Criteria

- The contact form reliably delivers messages to DevCon in production.
- Officers, events, and programs are data-driven and editable without code changes.
- Lighthouse scores ≥ 90 for Performance, Accessibility, SEO, and Best Practices.
- No critical accessibility (axe) violations.
- CI/CD pipeline executes successfully, including new tests.
- Engagement metrics are visible in the analytics dashboard.
- The website is deployed successfully to Vercel.
- The Project Manager approves each sprint deliverable.

## Constraints

- Work is planned and tracked on the repository's Kanban board; each requirement maps to a
  ticket labeled with its sprint.
- Each sprint is time-boxed to two weeks.
- Changes outside the approved SRS scope are deferred to a future sprint.
- No secrets (API keys, tokens) are committed to the repository; they are stored as
  environment variables.

## Roles and Responsibilities

- **Project Manager:** Maintains the roadmap and backlog, prioritizes and assigns tickets,
  monitors progress on the Kanban board, and approves completed work.
- **UI/UX Designer:** Designs new components and states (contact form, newsletter,
  accessibility improvements) and provides assets.
- **Full Stack Developers:** Implement the contact backend and data layer, apply SEO,
  performance, and accessibility work, review code, and resolve issues.
- **QA Engineer:** Performs manual, automated, and regression testing, maintains CI/CD
  validation and accessibility checks, reports bugs, verifies fixes, and approves builds.

## Timeline & Milestones

| Sprint | Theme | Dates (2026) |
|---|---|---|
| Sprint 2 | Dynamic Content, Contact & Quality Hardening | Aug 12 – Aug 25 |
| Sprint 3 | Events & News Expansion | Aug 26 – Sep 8 |
| Sprint 4 | Membership & Community | Sep 9 – Sep 22 |
| Sprint 5 | Admin & CMS | Sep 23 – Oct 6 |

| Milestone | Target Date (2026) |
|---|---|
| Phase 2 Charter & SRS approved | Aug 12 |
| Sprint 2 started | Aug 12 |
| Sprint 2 development complete | Aug 21 |
| Sprint 2 QA complete | Aug 25 |
| Sprint 2 review & PM approval | Aug 25 |
| Sprint 2 deployed to Vercel | Aug 26 |
| Phase 2 complete (through Sprint 5) | Oct 6 |

## Approval

This Project Charter serves as the formal agreement for the scope and objectives of Phase 2.
Approval signifies that the team understands the goals, responsibilities, and expected
deliverables before development begins. Sprint-level scope is confirmed at each sprint
planning session.
