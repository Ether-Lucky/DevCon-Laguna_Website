# Sprint 4 Plan — Phase 2 Close-out

**Project:** DevCon Laguna Official Website · **PM:** Lucky Guevarra
**Duration:** 2 weeks · **Follows:** [Sprint 3 Review](./sprint-3-review.md)

## Sprint goal

Finish Phase 2 properly before starting Phase 3. Meet the charter's own quality targets, remove
every dead end from the page, publish a real privacy notice, and bring the planning documents in
line with what was built. Then draft Phase 3 from an accurate baseline.

---

## 1. Why a close-out sprint

**Phase 2 was planned as Sprints 2 and 3, and it is built.** Sprint 4 is the first sprint beyond
the written roadmap. The charter defers three features past Phase 2: *event detail pages, a
blog/news section, and event registration*. They are the natural candidates for Phase 3.

But Phase 2 did not meet all of its own targets:

| Charter / SRS target | Today |
|---|---|
| Lighthouse ≥ 0.90 in every category | Accessibility **1.00** ✅ · Performance **~0.90** ⚠️ · Best Practices **0.93** ⚠️ · SEO **0.92** ⚠️ |
| SEO and metadata | One failing audit: generic link text |
| A working, trustworthy public site | **17 footer links go nowhere**, including **Privacy Policy** and **Terms** |
| Documents that describe the system | The SRS and charter still describe a **headless CMS**, which was replaced mid-Sprint 3 |

The SEO and Best Practices gaps **predate Sprint 3**, and the Sprint 2 review misreported them (see
the Sprint 3 review, §8). They are small, and they have been left alone for two sprints. Starting new
features on top would make that three.

**PM decision (2026-09-22): close out Phase 2.**

---

## 2. Committed scope (8 tickets)

| Ticket | What it delivers | Size |
|---|---|---|
| **SEO-04** #133 | Descriptive text for the hero's "Learn More" link → SEO to target | Small |
| **LOGO-BT-01** #134 | Logo rendered at its true aspect ratio → Best Practices audit passes | Small |
| **ANL-01-BT-01** #135 | Analytics script requested only on Vercel → no console errors in CI | Small |
| **FOOTER-02** #72 | Every footer link goes somewhere real, or is removed | Medium |
| **LEGAL-01** #73 | Privacy Policy and Terms pages, drafted here and approved by the organisation | Medium · *external* |
| **EVENTS-02** #136 | Featured Events shows upcoming and TBA events only | Medium |
| **CICD-BT-06** #130 | Two flaky WebKit tests fixed; CI stops hiding flaky results | Medium |
| **DOCS-01** #137 | SRS, charter and roadmap match what was built; Phase 2 closed; Phase 3 drafted | Medium |

### Stretch, not committed

**PERF-02** (#94): LCP ~3.6 s against 2.5 s · **DATA-BT-01** (#91): social-links refactor, a natural
fit if FOOTER-02 touches that file anyway.

### Backlog, unchanged

**NEWS-01** (#66) newsletter · **CON-03** (#71) contact map.

---

## 3. Decisions recorded at planning

| Question | Decision |
|---|---|
| What is Sprint 4? | **Close out Phase 2**; draft Phase 3 as part of DOCS-01 |
| The 17 dead footer links | **Link the ones with a real destination, remove the rest.** Anchors and the hero's working social URLs are reused; links with no destination (Blog, FAQ, Handbook, Donate, Discord, …) are removed until one exists. The list is confirmed in review |
| Where the privacy and terms text comes from | **Drafted here** from what the site actually collects, marked as a draft and **not legal advice**, then **reviewed and approved by the organisation** before publishing |
| Past events | **Upcoming and TBA only.** Past events are hidden once their end date passes |

---

## 4. Sequencing

```
Day 1-2   SEO-04 · LOGO-BT-01 · ANL-01-BT-01   quick wins; prove SEO / BP reach target early
          LEGAL-01 draft                        start now: org review is the longest wait
Week 1    CICD-BT-06 · EVENTS-02               independent
Week 2    FOOTER-02                             its Privacy/Terms links depend on LEGAL-01's routes
          DOCS-01                               last: records the sprint's decisions and drafts Phase 3
```

**LEGAL-01 is drafted first, not last.** The only part that can't be sped up is the organisation's
review. Everything else in this sprint is in the team's hands.

**FOOTER-02 comes after LEGAL-01's routes exist.** Its Privacy and Terms links point at those pages.
If approval hasn't arrived by the time FOOTER-02 is done, those two links are **left out**, not
pointed at unpublished pages. A dead link is exactly what this sprint removes.

---

## 5. Definition of Done

- **SEO and Best Practices have no failing audits** in CI, with the median of three runs at target.
- **Accessibility stays at 1.00**, and the axe audit also covers the new `/privacy` and `/terms`
  routes, not only `/`.
- **No link on the page has `href="#"` or an empty `href`**, enforced by a test so it can't creep
  back in.
- **Privacy Policy and Terms are live, with the organisation's approval recorded on #73.** If
  approval doesn't arrive, this criterion is reported as unmet. It is not quietly published.
- **Featured Events hides past events**, and what shows when none are upcoming has been decided and
  tested.
- **The flaky WebKit tests pass 20 of 20** repeated runs, and **CI reports** a test that only passes
  on retry instead of absorbing it.
- **The SRS, charter and roadmap describe the portal architecture as built**, Phase 2 is recorded as
  closed, with its targets stated as met or not met, and a Phase 3 draft exists.
- All CI gates green; deployed to production and pushed to the deploy fork.
- Documentation updated in `docs/`.
- PM approval.

### Carried forward as a known gap

**Performance stays at about 0.90**, and its CI assertion stays at `warn`. PERF-02 is stretch again.
If it isn't reached, the Phase 2 closure records the Performance target as **not met**, with the
measurements. It isn't silently dropped.

---

## 6. Risks

| Risk | Why it matters | Handling |
|---|---|---|
| **Legal review doesn't arrive in time** | LEGAL-01 can't finish without the organisation's approval, and FOOTER-02's legal links depend on it | Draft on day 1. The approval gate is explicit, and an unmet criterion is reported, not worked around |
| **Removing links someone wanted** | Discord, Donate or Chapters may have real destinations nobody has shared | The removal list is confirmed in review; any URL supplied goes straight back in |
| **Events: no upcoming events** | The built-in fallback events are themselves **3 past-dated and 6 TBA placeholders**, so filtering them leaves six placeholder cards | Decided with the PM inside EVENTS-02: an honest empty state, or a filtered fallback |
| **Visual baselines** | Changing the hero link text, footer and logo moves snapshots | The established procedure: refresh on the branch, inspect the new images, then run a comparison on that exact commit |
| **Portal content arriving mid-sprint** | Each section switching over needs checking on the live site | Unplanned but expected; a scope of 8 with three small tickets leaves room |
| **Repeating Sprint 3's six silent checks** | New tests (dead links, console errors, flaky detection) could pass without testing anything | Every new test is broken on purpose once before it's trusted |

---

## 7. External actions needed

| Item | Blocks | Owner |
|---|---|---|
| **Review and approve the Privacy Policy and Terms drafts** | LEGAL-01, and FOOTER-02's legal links | DevCon Laguna officers / DevCon national |
| Confirm the footer removal list, or supply real URLs (Discord, Donate, Chapters, …) | FOOTER-02 sign-off | PM |
| Choose the no-upcoming-events state | EVENTS-02 | PM |
| Approve the new hero link wording | SEO-04 | PM |
| Real events and landing images in the portal | Live verification of CMS-02 and CMS-04 | Portal team |

### Open, but not part of this sprint

- **Who triggered Copilot** on the CMS tickets (Sprint 3 review, §9).
- **Vercel Pro** for custom analytics events. This is a cost decision; pageviews work on the free plan.

---

## 8. After this sprint

DOCS-01 produces a **Phase 3 draft** for the PM to decide on. Today's candidates:

| Feature | Dependency |
|---|---|
| **Event detail pages** | None new. The portal already sends each event's `description` and `location`, which the landing page doesn't display yet |
| **News / blog section** | A new endpoint from the portal team |
| **Event registration** | Probably the **portal's** job, since members already have accounts there. To confirm with the portal team |
