# Sprint 5 Review — Phase 3

**Project:** DevCon Laguna Official Website · **PM:** Lucky Guevarra
**Follows:** [Sprint 5 Plan](./sprint-5-plan.md) · [Sprint 4 Review](./sprint-4-review.md)

> **This replaces an earlier version of this review**, written on the sprint's first day after the
> seven committed tickets shipped. Twelve more followed, and the first version described none of
> them. The PM closed the sprint early, on 2026-09-27, once the work was done rather than at the
> planned date.

**Sprint goal:** start Phase 3 with the work that needs nothing from anyone else — give events a
page of their own, show the officer information the portal already sends, settle the one Phase 2
target that was missed, and clear two small debts.

**Verdict: goal met, and Phase 3 finished with it.** All seven committed tickets shipped. Because the
portal team answered every request the same day, the sprint also delivered what it had planned to
wait for: the news section, an answer on event registration, and every landing-page picture moved
into the portal. Performance is at target on CI's median for the first time, and under the LCP
budget with real throttling.

---

## 1. What shipped

**19 tickets · 25 pull requests merged · all deployed and checked on the live site.**

### Committed work (7 of 7)

| Ticket | Outcome |
|---|---|
| EVENTS-03 #156 | ✅ A page per event |
| SEO-05 #157 | ✅ Per-event metadata, `Event` structured data, sitemap entries |
| OFFICER-03 #155 | ✅ Officer bios, shown when present, invisible when not |
| PERF-02 #94 | ✅ **Fixed**: hero served as AVIF, LCP 2.90 s → 2.41 s with real throttling (§4) |
| DATA-BT-01 #91 | ✅ Social links hold data, not JSX |
| CLEANUP-02 #153 | ✅ `server.log` out of the repository |
| DOCS-02 #158 | ✅ Phase 3 opened in the documents |

### Pulled in by the portal team's turnaround (12)

| Ticket | Outcome |
|---|---|
| TEST-01 #172 | ✅ The site now runs in CI against a portal that **returns data** |
| EVENTS-04 #175 | ✅ Slugs are the address; aliases and old ids redirect — **verified on real data** |
| EVENTS-05 #177 | ✅ A map link in `location` is a link, never the venue's name |
| NEWS-02 #179 | ✅ `/news`, a page per post, and a homepage section that exists only when there is news |
| EVENTS-06 #184 | ✅ Officers choose which events the homepage features — **verified on the Code Camp** |
| EVENTS-07 #186 | ✅ Every category shown, the primary as the main badge — **live** |
| EVENTS-08 #190 | ✅ Upcoming events tell visitors how to take part, Join first |
| CONTENT-01 #187 | ✅ All 12 landing pictures now served from the portal — **verified slot by slot** |
| SEO-05-BT-01 #182 | ✅ The sitemap had stopped refreshing; fixed on the second attempt (§5) |
| CMS-05-BT-01 #183 | ✅ Investigated: not a bug on our side (§5) |
| OFFICER-02-BT-02 #170 | ✅ The third round of the officers-carousel flake |
| DOCS-03 #193 | ✅ Phase 3 recorded as delivered |

**12 of 19 tickets were unplanned — 63%**, against 20% in Sprint 4. That number needs reading
carefully. Sprint 2's 71% was mostly **defects**. Here, only three of the twelve were bugs, and one of
those turned out not to be ours. The rest were **opportunities**: the portal team delivered faster
than the plan assumed they would, and each delivery had a site-side half.

---

## 2. Measurements

| | End of Sprint 4 | End of Sprint 5 |
|---|---|---|
| Lighthouse Performance (CI median) | ~0.90 | **0.93** ✅ across 3 AVIF runs (0.91–0.94) |
| LCP, real throttling | ~2.97 s | **2.41 s** ✅ target 2.5 s |
| Hero image | 102 KB | **31 KB** (AVIF; WebP unchanged for other browsers) |
| Accessibility / Best Practices / SEO | 1.00 | **1.00** in every run |
| axe audit coverage | `/`, legal pages, no portal | **plus** every page built from portal data, both themes |
| Test executions per CI run | 645 | **799** + 30 visual |
| Public routes | `/`, `/privacy`, `/terms` | **plus** `/news`, `/news/<slug>`, `/events/<slug>` |

**On the Performance row, stated carefully.** CI measures with *simulated* throttling, which §4 shows
is a poor model of this page. Three CI runs with AVIF scored medians of 0.91, 0.93 and 0.94 — but a
run the same morning *without* AVIF scored 0.92. So the CI score is at target, and **CI cannot
attribute the gain cleanly**. The evidence that AVIF helps is the real-throttling A-B-A in §4, not the
CI number.

Individual CI samples still range widely, 0.60 to 0.97. The low ones are each run's first request,
which pays for encoding AVIF cold.

---

## 3. The theme: test the path visitors are actually on

For three sprints, every feature built on portal data was verified the same way: mock the portal on a
laptop, look at the page, revert the mock. CI tested the **opposite** case — no portal at all, every
section falling back to built-in content.

**TEST-01 put a fixture portal in CI**, and the site running against it. Its first version
appeared to pass while testing nothing: the homepage is prerendered, so a second server started from
the first build served the first build's fallback HTML regardless of its environment. It needed its
own build.

**Then the accessibility audit went onto those pages, and found 7 real contrast failures** — none in
the feature it was added for. They were in the event page and the news cards, from earlier tickets,
invisible to the main audit because those pages only exist when the portal returns data:

- the page body's background rule in `globals.css` is **commented out**, so pages that didn't set
  their own background measured grey text against white;
- the news card used a fixed dark tint that turned mid-grey on the light theme (1.99 : 1).

Both were fixed at the root. **The event page one was already live**, on the Code Camp.

---

## 4. PERF-02: the simulator's diagnosis was wrong

Sprint 4 closed Phase 2 with Performance recorded as not met. The first Sprint 5 round measured
simulated against real throttling, concluded the remaining gap was **main-thread work**, and shipped
only a 95 KB → 19 KB icon fix — reported, correctly, as having no measurable effect.

That conclusion came from the simulated breakdown, which put 63% of LCP in "render delay".
Lighthouse's newer `lcp-breakdown-insight`, read from a **real-throttling** run, disagreed:

| LCP part | Time |
|---|---|
| Time to first byte | 13 ms |
| Load delay | 611 ms |
| **Downloading the image** | **2,249 ms** |
| Render delay | 24 ms |

**LCP was the hero image's bytes**, sharing a slow connection with two fonts for its first second.
The hero is a transparent collage; AVIF compresses it to a third:

| Real throttling, 3 runs each | Hero | LCP |
|---|---|---|
| A — WebP | 102 KB | 2.90 s |
| B — AVIF | 36 KB | **2.41 s** |
| A again — WebP | 102 KB | 2.91 s |

**Measured A-B-A on purpose.** Earlier in this same sprint, an "improvement" to 0.98 turned out to be
a server left over from another build — caught only because the comparison was run a third time.
This one reproduced.

**Also worth recording:** PERF-02 was closed on 2026-09-24 by another contributor while the target was
still unmet. It was reopened when the PM asked for the remaining work to be finished, and is now
fixed.

---

## 5. Caching: two bugs, one of which wasn't

**The sitemap never refreshed.** In production it was served from Vercel's cache for 59 hours after
one deploy, and still stale 33 minutes into a declared 30-minute window after the next — while the
homepage on the same deployment refreshed on schedule. **The first fix, declaring the window, did
not work**, and was reported as not working. The second renders the sitemap per request; its portal
data is still cached exactly like the homepage's. Proved locally by swapping a portal's data out from
under a running build, and guarded by a test that fails if the change is reverted.

**"Portal edits aren't reaching the site" was not our bug.** The portal team had corrected records
**directly in their database**, which sends no refresh call, so each change waited for the timed
refresh — and after a quiet spell, the first visitor past it still gets the old copy. The proof was
one officer pressing Save in the portal: the next page load answered `REVALIDATED`. The portal team
then added a **"Refresh the website now"** button for changes made outside their screens.

---

## 6. Working with the portal team

Every request in this sprint was delivered the same day it was sent, and matched its specification:
the news API, event slugs, aliases, landing visibility, the categories list, the image import, and
fixes to their own forms that caused bad data (a location field that invited map links, a
description field that didn't say "plain text", a "Mark as Done" button that silently unpublished
events).

The pattern that made it work was the **written handoff**: a self-contained note per request, with
the exact field names, what each does on the landing page, and a "done when" test. Five went across
this sprint; none needed a follow-up question.

---

## 7. Definition of Done

| Criterion | Status |
|---|---|
| Every portal event has a page with title, date, category, image, description, location | ✅ Verified on the Code Camp |
| A missing event returns a 404 | ✅ Tested, and live |
| The detail page degrades like every other section | ✅ An unreachable portal 404s the page and leaves the homepage alone |
| Accessibility at 1.00, no critical or serious violations on new routes | ✅ Now audited on every portal-data page, both themes |
| No `href="#"` or empty links | ✅ |
| Each event page has its own metadata, structured data and sitemap entry | ✅ |
| Officer bios render when present, leave no space when absent | ✅ Absence verified live; presence against the fixture |
| PERF-02 ends with a decision backed by measurements | ✅ **Fixed**, with A-B-A evidence |
| `server.log` untracked and ignored | ✅ |
| Every new check broken on purpose once | ✅ Including the new axe audit, whose first run was its own proof |
| All CI gates green; deployed; pushed to the deploy fork | ✅ |
| Documentation updated | ✅ DOCS-02 and DOCS-03 |
| PM approval | ⬜ Pending this review |

---

## 8. Process findings

**I merged a pull request with a failing check** (#169, documentation only). The merge loop treated
"not pending" as "passing". Every merge since checks explicitly for a failure first.

**One fix went out as a hypothesis and failed.** The first sitemap fix was labelled as unproven in
its own pull request and verified after deploy — which is how its failure was caught within the
hour rather than weeks later.

**Local Firefox still cannot launch on the maintainer's machine**, so a firefox-only problem costs a
CI run per hypothesis. The officers-carousel flake needed three.

**Untracked hand-off files accumulate in `docs/`.** This sprint's five notes for the portal team sit
there, deliberately uncommitted. They should either be committed as a record of the cross-team contract or
moved out of the repository.

---

## 9. What is left

**Waiting on decisions only you can make**

| Item | Needs |
|---|---|
| **CON-03** #71 — contact map | **Which venue** the map should show |
| **NEWS-01** #66 — newsletter sign-up | **An email provider**, and **who owns the list** |
| Vercel Pro | A cost decision; custom analytics events need it |
| Copilot access | Who may assign work to it — open since Sprint 3 |

**Waiting on content, with the portal team:** officer bios, the first news post, the event back
catalogue, better photos for the two small carousel images and the Hackathons card, and whether the
Code Camp's main category should read "Code Camp".

**Not done, and worth doing:** visual-regression snapshots for the pages that only exist with portal
data. The visual suite still covers only the no-portal homepage.

---

## 10. Recommendations

1. **Settle CON-03 and NEWS-01 or drop them.** Both have waited since Sprint 2. Neither is worth
   building on a guess.
2. **Keep the written handoff.** It is why a cross-team phase finished early.
3. **Trust the real-throttling breakdown over the simulated one** for this page. The simulator sent
   PERF-02 down the wrong path for a sprint.
4. **Test the path visitors are on.** The fixture portal and its audit found more real defects in a
   day than hand-checks had in three sprints.
5. **Commit or remove the hand-off notes** in `docs/`.
