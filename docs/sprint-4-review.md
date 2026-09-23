# Sprint 4 Review — Phase 2 Close-out

**Project:** DevCon Laguna Official Website · **PM:** Lucky Guevarra
**Follows:** [Sprint 4 Plan](./sprint-4-plan.md) · [Sprint 3 Review](./sprint-3-review.md)

**Sprint goal:** finish Phase 2 properly — meet the charter's quality targets, remove every dead end
from the page, publish a real privacy notice, and make the planning documents describe what was
actually built.

**Verdict: goal met, with one target honestly recorded as unmet.** All eight committed tickets
shipped. Best Practices and SEO reached 1.00 from 0.93 and 0.92, accessibility held at 1.00, and the
17 dead footer links became 20 working ones. **Performance is still ~0.90 against a ≥ 0.90 target**,
recorded in the roadmap as not met rather than rounded up.

---

## 1. What shipped

**10 tickets closed · 12 pull requests merged · all deployed to production.**

### Committed work (8 of 8)

| Ticket | Outcome |
|---|---|
| SEO-04 #133 | ✅ The hero's "Learn More" became "Visit DevConnect Portal" → **SEO 0.92 → 1.00** |
| LOGO-BT-01 #134 | ✅ The logo declares its real 384×65 proportions → **Best Practices 0.93 → 1.00** |
| ANL-01-BT-01 #135 | ✅ Analytics loads only on Vercel → the console `404` in CI is gone |
| CICD-BT-06 #130 | ✅ Two flaky tests fixed, and **CI now fails on a test that only passes on retry** |
| EVENTS-02 #136 | ✅ Featured Events shows upcoming and TBA events only, judged in Philippine time |
| LEGAL-01 #73 | ✅ **`/privacy` and `/terms` are live**, published only after the PM's answers were recorded |
| FOOTER-02 #72 | ✅ **17 dead links → 20 working ones**, enforced by a test |
| DOCS-01 #137 | ✅ SRS, charter and roadmap match the portal architecture; **Phase 2 closed**; Phase 3 drafted |

### Unplanned (2)

| Ticket | Outcome |
|---|---|
| OFFICER-02 #149 | ✅ PM request mid-sprint: the Officers carousel shows a whole batch and steps one column |
| OFFICER-02-BT-01 #151 | ✅ Two firefox tests from #149 were flaky in CI, and are now deterministic |

**2 of 10 closed tickets were unplanned — 20%**, against 22% in Sprint 3 and 71% in Sprint 2. The
ticket ceiling absorbed a mid-sprint feature request and its follow-up without anything committed
slipping.

### Filed, not done

**CLEANUP-02 #153** — `devcon/server.log` is tracked in the repository. Found while reviewing this
sprint's commits. Its contents are harmless and were checked for credentials; it belongs in
`.gitignore`.

---

## 2. Measurements

| | End of Sprint 3 | End of Sprint 4 |
|---|---|---|
| Lighthouse Performance | ~0.90 | **~0.90**, unchanged ⚠️ |
| Largest Contentful Paint | ~3.6 s | **~3.5 s**, unchanged ⚠️ target 2.5 s |
| Lighthouse Accessibility | 1.00 | **1.00** ✅ |
| Lighthouse Best Practices | 0.93 | **1.00** ✅ |
| Lighthouse SEO | 0.92 | **1.00** ✅ |
| Failing Lighthouse audits | 3 | **0** |
| axe violations (critical/serious) | 0 on `/` | **0 on `/`, `/privacy` and `/terms`** |
| Automated tests (per browser) | 153 in 11 files | **193 in 13 files** |
| Flaky tests | absorbed by retries | **fail the build** |
| Footer links with no destination | 17 | **0** |
| Published legal pages | 0 | **2** |
| Unplanned share of closed tickets | 22% | **20%** |

**On the Performance row.** The figure is the spread of medians across **8 CI runs** at the end of
this sprint: **0.88–0.92, median 0.90**, LCP 3.3–3.9 s. Individual samples inside those runs ranged
from **0.78 to 0.92**, which is why no single run is quoted anywhere in this document.

**On the three audits that reached target.** Each was fixed by its own small ticket, and each score
changed on exactly the commit that fixed it. All three had been failing since Sprint 2, and were
misreported once (Sprint 3 review, §8).

---

## 3. The theme of this sprint: the gate caught its author

Sprint 2's lesson was that a passing pipeline is evidence only once each job has been seen to fail.
Sprint 3 applied it to individual tests. Sprint 4 built the machine that applies it automatically —
and the machine's first catch was this sprint's own work.

**CICD-BT-06 added `--fail-on-flaky-tests`.** Before it, a test that failed and then passed on retry
was reported as a pass. Two WebKit tests had been doing exactly that.

- The **contact form** lost its first field: the test typed into server-rendered HTML before React
  hydrated, and hydration discarded it.
- The **Programs carousel** did not advance: the test moved a fake clock past a timer the component
  had not created yet, for the same reason.

Both were fixed by waiting for React's hydration marker instead of for the markup to appear. A second
round (#146) was needed when WebKit still lost clicks 20 runs out of 20.

**Then the gate caught OFFICER-02.** Within an hour of the Officers carousel merging, the first
`prod` run reported two flaky firefox tests and failed the build. They were the new tests, and the
failure was real: a press can be lost on a button React has not wired up yet, because the suite
waited for hydration on the *section* rather than on *the control it presses*.

**That is the gate working as intended on the person who installed it.** The fix also made the two
possible causes — a lost press and a stalled animation — fail differently, so the next occurrence
will say which one it was.

**Four more checks were found to be checking nothing**, by breaking them on purpose before trusting
them:

| Check | Why it proved nothing | Fixed by |
|---|---|---|
| "Unreachable portal" fallback | Passed from Next's data cache, never reaching the failure path | Bypassing the cache |
| Carousel "stays put" | Waited three intervals with three slides, so it wrapped to where it started | Fewer intervals than slides |
| Legal approval gate | Two sabotage attempts were invalid — a stale server, then an injection that never matched | Rebuilt, then re-sabotaged |
| Officers batch geometry | Passed at 1280 px, where there is enough slack to hide the bug it exists to catch | Asserting at 1024 px as well |

---

## 4. Phase 2 is closed

The roadmap now records Phase 2 as closed, with each target stated as met or not met:

| Target | Outcome |
|---|---|
| Working contact form | ✅ Delivered Sprint 2, with spam protection |
| Content editable without a developer | ✅ Officers verified live from the portal |
| SEO and metadata | ✅ **1.00**, no failing audits |
| Accessibility ≥ 0.90 | ✅ **1.00**, and 0 critical or serious axe violations |
| Best Practices | ✅ **1.00** |
| **Performance ≥ 0.90** | ⚠️ **Not met.** ~0.90 (0.88–0.92), LCP ~3.5 s against 2.5 s |
| Analytics | ✅ Pageviews live; custom events need a paid plan — a cost decision |
| Test coverage | ✅ 94 → 579 test executions per CI run; CI fails on flaky results |
| Continuous deployment | ✅ Every merge deployed |

**One target unmet, by about one point.** PERF-02 was stretch in Sprints 3 and 4 and was never
attempted, so this is a scheduling outcome rather than a technical dead end.

---

## 5. Publishing legal text, and the gate that held it back

LEGAL-01 wrote a Privacy Policy and Terms describing what the site actually collects, under the
Philippine Data Privacy Act of 2012. The draft carried **12 unanswered questions** — retention
period, response time, the contact address, the minimum age — and a test that **failed the build if
the pages were published with any of them still unanswered**.

The pages sat behind that gate until the PM answered all 12. Only then did they publish.

**Three of those answers are now public commitments**, and they are operational rather than code:

1. Contact-form emails are **deleted after 12 months**.
2. Privacy requests are answered **within 15 working days**.
3. Officers are **told that their photo appears on the site**.

---

## 6. Defects nobody was looking for

Three came out of work aimed at something else:

- **Social links opened without `rel="noopener"`** — found while auditing the footer's links.
- **The navbar was dead on any page but the homepage** — its links were bare `#section` anchors, so
  the new `/privacy` and `/terms` pages had a navbar that did nothing.
- **Two Sprint 1 status rows recorded work as delivered that was not on the page** — found while
  aligning the SRS in DOCS-01.

---

## 7. Definition of Done

| Criterion | Status |
|---|---|
| SEO and Best Practices have no failing audits, median of three runs at target | ✅ Both **1.00**, across 8 runs |
| Accessibility stays at 1.00; axe also covers `/privacy` and `/terms` | ✅ 0 critical or serious on all three routes |
| No link has `href="#"` or an empty `href`, enforced by a test | ✅ 0, enforced on all three routes |
| Privacy and Terms live, with approval recorded | ✅ Published after the PM's 12 answers were recorded on #73 |
| Featured Events hides past events; the empty state is decided and tested | ✅ Upcoming and TBA only, in Philippine time |
| Flaky WebKit tests pass 20 of 20, and CI reports a retry-only pass | ✅ Verified 20/20; the gate then caught a real flake in #150 |
| SRS, charter and roadmap describe the portal architecture; Phase 2 closed; Phase 3 drafted | ✅ |
| All CI gates green; deployed; pushed to the deploy fork | ✅ |
| Documentation updated in `docs/` | ✅ Including `accessibility.md` and the SRS for the unplanned work |
| PM approval | ⬜ Pending this review |

**Known gap, as planned:** Performance stays at about 0.90, and its CI assertion stays a warning.

---

## 8. Process findings

**The flaky gate paid for itself in under an hour.** It was built in CICD-BT-06 and caught a genuine
defect in OFFICER-02 the same day. Nothing else in this project has had that payback period.

**Two branches refreshing the same visual baseline leaves `prod` red.** LOGO-BT-01 and SEO-04 each
refreshed `full-page-firefox-linux.png` on their own branch, and the merged page matched neither. The
fix was a refresh taken from the merged state (#143), and the procedure is now written down in
`visual-regression.md`. **The gate was accurate, not broken.**

**Local Firefox is unusable on the maintainer's machine** — `browserType.launch: spawn UNKNOWN`,
unrelated to any change here. The firefox flake in OFFICER-02-BT-01 could not be reproduced locally
and the fix was reasoned from CI output. CI still covers firefox, so coverage is intact, but the
feedback loop for a firefox-only problem is now one CI run long.

**A commit from another contributor landed a dev-server log in the repository** (`157bc59`), now
filed as CLEANUP-02 #153. `.gitignore` covers `npm-debug.log*` but not `server.log`.

**Copilot's access is still unsettled**, carried from Sprint 3. No new draft pull requests appeared
this sprint, so nothing forced the issue.

---

## 9. Carried into Sprint 5

**Waiting on the portal team**

- **Real events and landing images.** Every section falls back on its own, so each switches over by
  itself once data exists — and each needs checking on the live site when it does.
- **Hero uploads must be transparent cut-outs.** An ordinary opaque photo puts the hero buttons on
  top of the image on phones. The guidance is in `docs/portal-team-update.md`.

**Ready to schedule**

- **PERF-02 #94** — the one unmet Phase 2 target. Sprint 2's recommendation still stands: re-run with
  `throttlingMethod: devtools` before a fourth speculative fix.
- **Event detail pages** — the cheapest real feature available. The portal already sends each event's
  `description` and `location`, and the site displays neither.
- **DATA-BT-01 #91** and **CLEANUP-02 #153** — both small.

**Backlog (2):** NEWS-01 #66 (needs an email provider and a list owner) · CON-03 #71 (needs a venue).

**Open questions**

- **Vercel Pro** for custom analytics events. A cost decision; pageviews work on the free plan.
- **Who may assign work to Copilot.** Unanswered since Sprint 3.

---

## 10. Recommendations for planning

1. **Attempt PERF-02 in Sprint 5, or drop the ≥ 0.90 target deliberately.** It has been stretch in two
   consecutive sprints and never started. Carrying it a third time without committing to it is a
   decision made by default rather than on purpose.
2. **Keep breaking checks before trusting them.** Four more were found hollow this sprint, one of them
   twice over. The cost is minutes; the alternative is a green build that means nothing.
3. **Keep the ticket ceiling at seven or eight.** It absorbed a mid-sprint feature request and a
   same-day bug fix with nothing slipping.
4. **Assert at the hostile size, not the comfortable one.** The officers layout bug was invisible at
   the default test viewport and obvious 256 pixels narrower.
5. **Start the cross-team ask on day one.** The portal team turned all three Sprint 3 requests around
   the same day they were specified. Whatever Phase 3 needs from them should be written down first.
