# Sprint 3 Review — Dynamic Content & Accessibility

**Project:** DevCon Laguna Official Website · **PM:** Lucky Guevarra
**Follows:** [Sprint 3 Plan](./sprint-3-plan.md) · [Sprint 2 Review](./sprint-2-review.md)

**Sprint goal:** hand content control to the team, so an officer can publish a change without a
developer, a pull request, or a redeploy, and verify the accessibility criterion Sprint 2 never
checked.

**Verdict: goal met.** All seven committed tickets shipped. The Sprint 1 carry-over (#87) was
settled and closed. The Definition of Done is met, with one qualification: events and landing images
are built and tested, but have not yet run on real data, because the portal team has not entered it.
Officers ran on real data, and an edit in the portal reached the live site on the next page load.

---

## 1. What shipped

**9 tickets closed · 7 pull requests merged · all deployed to production.**

### Committed work (7 of 7)

| Ticket | Outcome |
|---|---|
| CMS-01 #74 | ✅ Portal API client: server-only, cached, falls back on every failure |
| CMS-02 #75 | ✅ Events from the portal: categories, "TBA" dates, dates shown in Philippine time |
| CMS-03 #76 | ✅ Officers from the portal: **live on real data**, the 2026 roster of 12 |
| CMS-04 #77 | ✅ Landing images for all five slots, each falling back on its own |
| CMS-05 #78 | ✅ 30-minute caching: **verified in production** |
| CMS-06 #79 | ✅ Authenticated instant publish: **verified in production** |
| A11Y-01 #116 | ✅ Nine violations found and fixed; the check now runs in CI |

### Also closed

| Ticket | Outcome |
|---|---|
| PROGRAM-01-BT-01 #87 | ✅ **Programs & Activities restored**, closing an FR-06 gap open since Sprint 1 |
| CMS-03-BT-01 #125 | ✅ Unplanned: fixes the production incident in section 5 |

**2 of the 9 closed tickets were unplanned, 22%, down from 71% in Sprint 2.** Keeping the plan to
seven tickets, as Sprint 2's review recommended, left room for the unexpected work and the restore of
#87 without anything slipping.

### Not built

The stretch list was not started: PERF-02, NEWS-01, FOOTER-02, LEGAL-01, DATA-BT-01, CON-03. That was
by design, and they carry forward.

---

## 2. Measurements

| | End of Sprint 2 | End of Sprint 3 |
|---|---|---|
| Lighthouse Accessibility | 0.96 | **1.00** ✅ |
| Lighthouse Performance | ~0.90 | **~0.90**, unchanged ⚠️ |
| Largest Contentful Paint | ~3.5 s | **~3.6 s**, unchanged ⚠️ target 2.5 s |
| Lighthouse Best Practices | 0.93 *(see §8)* | 0.93 |
| Lighthouse SEO | 0.92 *(see §8)* | 0.92 |
| axe violations (critical/serious) | never measured | **0**, from 9 found |
| Automated tests (per browser) | 94 | **153** in 11 spec files |
| Lint warnings | 3 | **0** |
| Unplanned share of closed tickets | 71% | **22%** |

**On the Performance row.** A single Lighthouse run cannot tell a regression from noise. One
production run this sprint scored 0.56, 0.89 and 0.90 on its three samples. So the figure is the
spread of medians across **19 CI runs** this sprint: **0.88–0.92, median 0.90**, LCP 3.4–3.9 s, with
no trend. Accessibility changed exactly once, from 0.96 to 1.00, on the commit where A11Y-01 merged.

---

## 3. The theme of this sprint: a check only counts once you've seen it fail

Sprint 2's lesson was that **a passing pipeline is evidence only if each job has been seen to
fail**. This sprint applied it one level down, to individual tests. It turned out to matter more
than expected: **six times, a check passed while testing nothing.**

| Check | Why it passed | Found by |
|---|---|---|
| First axe audit: **0 violations** | `ScrollReveal` hides sections until scrolled, and axe skips hidden elements, so it audited the hero and little else. **There were 9 real violations** | Auditing interactive states |
| "Portal unreachable" fallback | Served the previous build's cached data; the network was never touched | Clearing the cache and rerunning |
| Visual gate on a brand-colour change | 474–11,567 pixels differed per snapshot, but each stayed under the 1% tolerance | Measuring with zero tolerance |
| Carousel "stays paused" tests | Waited three intervals with three slides, so a slideshow that never paused wrapped back to slide 1 | Breaking the pause on purpose |
| Carousel pause test on WebKit | Raced React: the clock moved before the component re-rendered | Repeated runs, then a probe of state |
| Two WebKit tests in CI | CI retries each failure twice and reports success | Running locally without retries (#130) |

**The method is now standard:** after writing a test, break the thing it guards and confirm it fails.
Every CMS and accessibility test this sprint went through that step. Two of the six rows above are
bugs in the tests themselves, found only that way.

The visual-gate row is a lasting limitation. The visual gate catches **layout** changes but not **colour**
changes of that size. The contrast assertions in `tests/a11y.spec.ts` are what now guard colour.

---

## 4. The architecture changed mid-sprint

The plan chose **Sanity**, a hosted headless CMS, and CMS-01 was built on it. It was then **reversed**
in favour of the **DevConnect Portal's existing API**.

The original request, before Sprint 3 was planned, was for the landing page to read content from
**the organisation's other website**, which already had an admin. At planning, the question was put
as *"which CMS?"*. That question assumed a CMS, so the plan was never checked against the request.
When it was, the portal turned out to already expose the API. A second CMS would have meant a second
admin, a second set of logins, a 3-seat limit, and two sources of truth for the same officers and
events.

**Cost:** about an hour. The Sanity work was never merged, and it survives on the unpushed branch
`feat/cms-01-sanity`. All six CMS tickets were rewritten to match, with the reasoning recorded on #74.

**Lesson:** when a planning decision narrows the options ("which CMS?"), check it against the original
requirement before building. Asking whether a CMS was even needed would have found this at planning.

---

## 5. A production incident

The first time the portal API key was set in production, the live landing page showed:

- a **test account**, "bril 123 User — Test Pro", in "Meet Our Officers"
- **10 of the 12 real officers missing**
- **broken photos**: the portal's officer photos were Tenor GIF links, which the image optimiser correctly
  refused to serve

It was visible for a short time, until the PM entered the real roster.

**On our side (#125):** photos are now checked against the same allowlist `next.config.ts` uses, so an
unrenderable one shows initials instead of a broken image. One list of allowed hosts serves both.

**On the portal's side:** the portal team deleted all test data, now uploads photos to their own storage
instead of accepting links, and nulls any other host in the API.

**What can't be fixed on our side:** nothing in the data tells a test account from a real one. Keeping
test data out of the public API has to be the portal's rule, and it is now written into the agreement
between the two teams.

---

## 6. Working with the portal team

Three changes were needed from the portal: an events `category`, a landing-images endpoint, and a
call to our revalidation endpoint on every save. A written handoff specified each one precisely enough
to build without follow-up questions. **All three shipped on 2026-09-22, the day they were requested,
matching the specification exactly.**

Two documents went to them: `docs/portal-team-handoff.md` (the requests) and
`docs/portal-team-update.md` (what we built, what we verified, and upload guidance for their officers).

---

## 7. Definition of Done

| Criterion | Status |
|---|---|
| An officer can change content and see it live without a developer or a redeploy | ✅ **Officers: verified in production.** Events: built and tested, but the portal has no events yet |
| The four landing-page images are replaceable from the admin UI | ✅ **Built and tested** against a mock portal with every slot filled. The portal has no images yet |
| Content is cached, not fetched per request, and a failure keeps the last good content | ✅ Verified, including a cold cache with the portal down |
| Instant publish works and its endpoint is authenticated | ✅ **Verified in production.** Wrong secrets rejected with `401` |
| No critical or serious axe violations | ✅ 0, across both themes, the error state and the open mobile menu |
| Keyboard navigation works throughout | ✅ Carousels, theme toggle and focus visibility asserted |
| Contrast passes in **both** themes | ✅ 6 contrast failures found and fixed |
| An accessibility assertion runs in CI | ✅ **Verified to fail** on a reintroduced regression |
| All CI gates green; deployed; pushed to the deploy fork | ✅ |
| Documentation updated in `docs/` | ✅ `portal-api.md`, `accessibility.md`, content guide |
| PM approval | ⬜ Pending this review |

**Carried forward as planned:** Lighthouse Performance is still at about 0.90, and its CI assertion
still only warns. PERF-02 was stretch and was not attempted.

---

## 8. A correction to the Sprint 2 review

The Sprint 2 review reported **Best Practices 0.96** and **SEO 1.00**. **Both were wrong.** The Lighthouse
report from the last Sprint 2 run (the #115 CI run) shows **0.93** and **0.92**, failing the same three
audits that fail today:

| Audit | Cause | Introduced |
|---|---|---|
| SEO: *Links do not have descriptive text* | The hero's **"Learn More"** link to the portal | Sprint 2, CTA-01 (#113) |
| Best Practices: *incorrect image aspect ratio* | The **logo** images in the navbar and footer | Before Sprint 3 |
| Best Practices: *errors in console* | A `404` for Vercel's analytics script, which exists only on Vercel, not in CI | Sprint 2, ANL-01 |

The Sprint 2 figures were most likely taken before analytics and the portal links merged, and not
re-measured at sprint end. **These are not Sprint 3 regressions.** They are carried into Sprint 4 below.
Measurement discipline applies to reviews as well: every figure in this review comes from a CI report,
and each one is named.

---

## 9. Process findings

**GitHub Copilot opened six draft PRs** (#119–#124) on 2026-09-11, one per CMS ticket. Copilot's coding
agent does that when an issue is assigned to it. One duplicated the officers work in #117, one was
still built on the old "headless CMS" wording, and four contained no code. All were closed. **Who
triggered them is still unknown.** Worth settling, or the next assigned ticket will produce another
round.

**Merged branches were being deleted.** Merges had used `--delete-branch`, against the standing
instruction to keep a branch per feature. **21 branches were restored** from GitHub's permanent PR
references, and the rule has been recorded so future sessions keep branches.

**The local test environment degraded.** Disk usage reached 99%, which killed one full test run
partway through. Later, Windows began blocking Playwright's Firefox (*permission denied*), which a
reinstall didn't fix. CI is unaffected, since it runs Firefox on Linux, but local Firefox coverage is
gone until the block is lifted.

---

## 10. Carried into Sprint 4

**Waiting on the portal team**

- **Real events and landing images.** Each section switches over by itself when data exists; each
  needs checking on the live site when it does.
- **Hero upload composition.** The fixed frame protects the layout, but an opaque photo puts the
  buttons over the image on phones. Uploaders need the transparent cut-out guidance in the update.

**Ready to schedule**

- **CICD-BT-06 #130:** two flaky WebKit tests hidden by CI retries. The Sprint 2 pattern in a
  smaller form.
- **PERF-02 #94:** LCP ~3.6 s against 2.5 s. The Sprint 2 recommendation still stands: re-run with
  `throttlingMethod: devtools` before a fourth fix.
- **The three audits in §8:** a descriptive "Learn More", correct logo aspect ratios, and an analytics
  script that doesn't `404` in CI. All are small, and together they would bring SEO and Best Practices
  back to target.

**Backlog (5):** NEWS-01 · FOOTER-02 · LEGAL-01 · DATA-BT-01 · CON-03.

**Open questions**

- **Past events.** The portal publishes past events and the page shows them. Should the landing page
  show only upcoming events?
- **Vercel Pro.** Custom analytics events still need it; pageviews work on the free plan.

---

## 11. Recommendations for planning

1. **Check a planning question against the original requirement.** The CMS reversal came from a
   question that assumed its answer.
2. **Keep breaking tests on purpose.** Six checks passed while testing nothing this sprint. It is the
   cheapest defect-finding method this project has.
3. **Fix the three pre-existing audits early in Sprint 4.** They are small, long-standing, and were
   misreported once already.
4. **Settle Copilot's access.** Unassigned automation opening PRs is noise at best and a conflict risk
   at worst.
5. **Keep committed scope to around seven tickets.** The unplanned share fell from 71% to 22% with room
   to spare. That is evidence the buffer works, not that it can be removed.
