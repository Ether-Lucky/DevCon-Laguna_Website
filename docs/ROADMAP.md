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
| **Sprint 3** | Dynamic Content via Headless CMS | 2 weeks | Hosted headless CMS, CMS-driven Events and Officers, CMS-managed landing page images, ~30-minute cached revalidation, instant on-demand publish |

### Why this order

- **Sprint 2 is the bridge sprint.** It closes the one open Sprint 1 gap (a real contact
  form), converts hard-coded content into a maintainable data layer (so content is editable
  without code changes), and lifts the SRS non-functional requirements — performance (NFR-01), usability
  (NFR-02), reliability (NFR-03), accessibility (NFR-05) — that a public landing page depends
  on. It introduces the first real backend touchpoint without committing to a full stack.
- **Sprint 3** makes the landing page genuinely dynamic. Featured events, officers, and the
  main section images move to a **hosted headless CMS**, so content is updated by editors
  rather than developers and no longer requires a redeploy. Content is cached and revalidated
  on roughly a 30-minute interval, with an authenticated on-demand hook so an admin can push
  an urgent change live instantly. This completes Phase 2.
  - Content types in scope: **Events**, **Officers**, and the landing page images for the
    hero/first section, the Who We Are carousel, What We Do, and the bottom section.
  - A hosted CMS was chosen over building a bespoke admin app so the team gets the admin UI,
    image hosting, and roles without maintaining a second product.
  - *Event detail pages, a blog/news section, and event registration — previously proposed
    for Sprint 3 — are deferred; the dynamic content foundation takes priority.*

The detailed, ready-to-execute plan for the next sprint lives in
[sprint-2-backlog.md](./sprint-2-backlog.md). Sprint 3 is directional and will be refined at
its planning session.
