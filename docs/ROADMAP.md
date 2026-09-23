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
| FR-06 Programs & Activities | Done — but **commented out of the page from Sprint 1 until Sprint 4**, so FR-06 was unmet in production for three sprints. Restored and made fit to show in #87 | `devcon/components/ui/sections/program-and-activities.tsx` |
| FR-07 Contact | Done — working form closed this in Sprint 2 (#59) | `devcon/components/ui/sections/contact.tsx` |
| FR-08 Footer | Done | `devcon/components/ui/sections/footer.tsx` |
| FR-09 Responsive Design | Done | Tailwind + Playwright visual snapshots |
| CI/CD pipeline | Done | `feat/ci-cd` merges, Playwright visual regression |

Of the Project Charter's original **Out of Scope** list, the membership-related items
(authentication, member dashboard, admin panel, and full CMS) are owned by a **separate
DevCon website** and remain out of scope here. Phase 2 focuses on the remaining items —
interactivity, content maintainability, discoverability, and content expansion — as detailed
in the sprints below.

## Phase 2: complete (Sprints 2–4)

**Phase 2 finished on 2026-09-23.** Its targets, stated honestly:

| Charter target | Outcome |
|---|---|
| Working contact form with spam protection | ✅ Delivered and verified in production (Sprint 2) |
| Content maintainable without code changes | ✅ Officers, events and landing images come from the DevConnect Portal (Sprint 3) |
| SEO and metadata | ✅ Sitemap, robots, structured data, share image; SEO audits pass after SEO-04 |
| Accessibility (WCAG 2.1 AA target) | ✅ Lighthouse 1.00; nine axe violations found and fixed; the audit runs in CI (A11Y-01) |
| **Performance — Lighthouse ≥ 0.90** | ⚠️ **Not met.** ~0.90 across 19 CI runs (0.88–0.92), LCP ~3.6 s against a 2.5 s target. The assertion remains a warning. Carried to Phase 3 as PERF-02 (#94) |
| Analytics and engagement tracking | ✅ Pageviews live; custom events need a Vercel Pro plan (a cost decision, not a code gap) |
| Automated test coverage for new functionality | ✅ 94 → 348 tests; CI fails on flaky results (CICD-BT-06) |
| Continued deployment to Vercel | ✅ Every merge deployed via the `laguna-devcon` fork |

**The one unmet target is Performance**, and it is unmet by about one point. It was stretch in
Sprints 3 and 4 and was never attempted; the recommendation from Sprint 2 still stands — re-run
with `throttlingMethod: devtools` before a fourth speculative fix.

## How Phase 2 was planned (~4 weeks, became ~6)

> **Note:** Member application, authentication, member dashboards, and content
> administration are handled by a **separate DevCon website** and are therefore out of scope
> for this project. The membership track (previously proposed as Sprints 4–5) has been
> removed; the public "Join Us" call-to-action links out to that external site.

| Sprint | Theme | Duration | Delivers |
|---|---|---|---|
| **Sprint 2** | Dynamic Content, Contact & Quality Hardening | 2 weeks | Working contact form (closes FR-07), content data layer, SEO/metadata, accessibility + performance pass, analytics |
| **Sprint 3** | Dynamic Content from the DevConnect Portal | 2 weeks | Portal API client, portal-driven Events and Officers, portal-managed landing page images, ~30-minute cached revalidation, instant on-demand publish. *Planned as a hosted headless CMS; changed mid-sprint (#74)* |
| **Sprint 4** | Phase 2 close-out | 2 weeks | The three failing Lighthouse audits, 17 dead footer links, Privacy and Terms pages, flaky tests, and these documents |

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

Each sprint's plan and review live in `/docs`: [sprint-2-backlog](./sprint-2-backlog.md),
[sprint-2-review](./sprint-2-review.md), [sprint-3-plan](./sprint-3-plan.md),
[sprint-3-review](./sprint-3-review.md), [sprint-4-plan](./sprint-4-plan.md).

---

## Phase 3 — draft, for the PM to decide (DOCS-01, #137)

**Nothing here is committed.** These are the candidates the Project Charter deferred beyond
Phase 2, with what each actually depends on. Phase 3 should be planned from this, not from it.

| Candidate | Depends on | Notes |
|---|---|---|
| **Event detail pages** | **Nothing new.** The portal already sends each event's `description` and `location`, and the landing page displays neither | The cheapest real feature available. A page per event, linked from the Events cards, with structured data for search |
| **News / blog section** | **A new portal endpoint.** The portal team would need to add posts to their admin and API | Cross-team, so it runs on their schedule. The handoff pattern from Sprint 3 worked: a written specification, delivered same-day |
| **Event registration** | **Probably not ours.** Members already have accounts on the portal | Confirm with the portal team before scoping. Building sign-ups here would rebuild what the portal has |
| **PERF-02** (#94) | Nothing | The one unmet Phase 2 target. Start by confirming whether the ~2.4 s of "render delay" is real or an artifact of Lighthouse's simulated throttling |
| **NEWS-01** (#66) newsletter | An email provider and a list owner | Backlog since Sprint 2 |
| **CON-03** (#71) contact map | A venue to show | Backlog since Sprint 2 |
| **DATA-BT-01** (#91) | Nothing | Small refactor: `social-links.tsx` embeds JSX icons in a content file |

### Two open questions that should be settled at planning

1. **Vercel Pro.** Custom analytics events (which buttons get clicked) need it; pageviews work on
   the free plan. A cost decision, not a technical one.
2. **Who may assign work to Copilot.** Six draft pull requests appeared on the CMS tickets in
   Sprint 3 (#119–#124), one duplicating work already in review. Nobody has established who
   triggered it.

### What Phase 3 should keep from Phase 2

- **Seven-ticket sprints.** Unplanned work fell from 71% to 22% when scope was held there.
- **Break a check before trusting it.** Six checks in Sprint 3 and four flaky tests in Sprint 4
  passed while testing nothing. Sabotage is the cheapest defect-finding method this project has.
- **Write the ticket before the work.** Three Sprint 2 stories that never became tickets silently
  left the sprint; Sprint 4's three audit fixes had no tickets until planning created them.
