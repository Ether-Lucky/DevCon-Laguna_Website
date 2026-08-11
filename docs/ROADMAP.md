# DevCon Laguna Website — Product Roadmap

Project Manager: Lucky Guevarra · Sponsor: DevCon
Source of truth: [Project Charter] and [SRS] (see `/docs`).

This roadmap covers development **after Sprint 1**. Sprint 1 delivered the responsive
landing page and CI/CD, satisfying the SRS functional requirements FR-01 through FR-09
(with FR-07 Contact only partially met — links exist, but there is no working form).

## Sprint 1 status (baseline)

| SRS Req | Status | Location |
|---|---|---|
| FR-01 Navigation | Done | `devcon/components/ui/nav-bar/` |
| FR-02 Hero | Done | `devcon/components/ui/sections/hero.tsx` |
| FR-03 About | Done | `devcon/components/ui/sections/about.tsx` |
| FR-04 Mission & Vision | Done | `devcon/components/ui/mission-vision/` |
| FR-05 Officers | Done | `devcon/components/ui/sections/officers.tsx` |
| FR-06 Programs & Activities | Done | `devcon/components/ui/sections/program-and-activities.tsx` |
| FR-07 Contact | Partial — no working form | `devcon/components/ui/sections/social-media.tsx` |
| FR-08 Footer | Done | `devcon/components/ui/sections/footer.tsx` |
| FR-09 Responsive Design | Done | Tailwind + Playwright visual snapshots |
| CI/CD pipeline | Done | `feat/ci-cd` merges, Playwright visual regression |

The Project Charter's entire **Out of Scope** list (authentication, member dashboard,
admin panel, database integration, CMS, advanced backend) is intentionally untouched and
forms the backlog for the sprints below.

## Roadmap: 4 sprints to the full charter vision (~8 weeks)

| Sprint | Theme | Duration | Delivers |
|---|---|---|---|
| **Sprint 2** | Dynamic Content, Contact & Quality Hardening | 2 weeks | Working contact form (closes FR-07), content data layer, SEO/metadata, accessibility + performance pass, analytics |
| **Sprint 3** | Events & News Expansion | 2 weeks | Multi-page routing, event detail pages, blog/news section, event registration |
| **Sprint 4** | Membership & Community | 2 weeks | Authentication, member dashboard, database integration |
| **Sprint 5** | Admin & CMS | 2 weeks | Admin panel, full content management system, role management, analytics dashboard |

### Why this order

- **Sprint 2 is the bridge sprint.** It closes the one open Sprint 1 gap (a real contact
  form), converts hard-coded content into a maintainable data layer (the seed of the future
  CMS), and lifts the SRS non-functional requirements — performance (NFR-01), usability
  (NFR-02), reliability (NFR-03), accessibility (NFR-05) — that a public landing page depends
  on. It introduces the first real backend touchpoint without committing to a full stack.
- **Sprint 3** grows the site from one page into a content platform, reusing Sprint 2's data
  layer. Still mostly frontend + light backend.
- **Sprint 4** introduces persistence and identity — the first heavy backend sprint. Depends
  on the data layer and routing from Sprints 2–3.
- **Sprint 5** hands content control to non-developers, completing the charter's CMS/admin
  vision and closing the loop with the analytics started in Sprint 2.

The detailed, ready-to-execute plan for the next sprint lives in
[sprint-2-backlog.md](./sprint-2-backlog.md). Sprints 3–5 are directional and will be
refined at their respective planning sessions.
