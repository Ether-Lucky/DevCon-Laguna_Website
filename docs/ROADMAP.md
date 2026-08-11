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

Of the Project Charter's original **Out of Scope** list, the membership-related items
(authentication, member dashboard, admin panel, and full CMS) are owned by a **separate
DevCon website** and remain out of scope here. Phase 2 focuses on the remaining items —
interactivity, content maintainability, discoverability, and content expansion — as detailed
in the sprints below.

## Roadmap: 2 sprints to complete Phase 2 (~4 weeks)

> **Note:** Member application, authentication, member dashboards, and content
> administration are handled by a **separate DevCon website** and are therefore out of scope
> for this project. The membership track (previously proposed as Sprints 4–5) has been
> removed; the public "Join Us" call-to-action links out to that external site.

| Sprint | Theme | Duration | Delivers |
|---|---|---|---|
| **Sprint 2** | Dynamic Content, Contact & Quality Hardening | 2 weeks | Working contact form (closes FR-07), content data layer, SEO/metadata, accessibility + performance pass, analytics |
| **Sprint 3** | Events & News Expansion | 2 weeks | Multi-page routing, event detail pages, blog/news section, event registration |

### Why this order

- **Sprint 2 is the bridge sprint.** It closes the one open Sprint 1 gap (a real contact
  form), converts hard-coded content into a maintainable data layer (so content is editable
  without code changes), and lifts the SRS non-functional requirements — performance (NFR-01), usability
  (NFR-02), reliability (NFR-03), accessibility (NFR-05) — that a public landing page depends
  on. It introduces the first real backend touchpoint without committing to a full stack.
- **Sprint 3** grows the site from one page into a content platform, reusing Sprint 2's data
  layer. Still mostly frontend + light backend. This completes Phase 2.

The detailed, ready-to-execute plan for the next sprint lives in
[sprint-2-backlog.md](./sprint-2-backlog.md). Sprint 3 is directional and will be refined at
its planning session.
