# Sprint 5 Review — Phase 3, part one

**Project:** DevCon Laguna Official Website · **PM:** Lucky Guevarra
**Follows:** [Sprint 5 Plan](./sprint-5-plan.md) · [Sprint 4 Review](./sprint-4-review.md)

**Sprint goal:** start Phase 3 with the work that needs nothing from anyone else — give events a page
of their own, show the officer information the portal already sends, settle the one Phase 2 target
that was missed, and clear the two small debts on the board.

**Verdict: goal met.** All seven committed tickets shipped. Events have pages, with their own search
metadata and structured data; officer bios render when the portal has them; both small debts are
cleared; and PERF-02 ended in a recorded decision backed by measurement rather than a fourth guess.

**The one thing to read if you read nothing else:** §4. A measured "improvement" of 0.08 Lighthouse
points turned out to be an artifact of a stale server, and was caught only because the comparison was
run a third time.

---

## 1. What shipped

**8 tickets closed · 9 pull requests merged · all deployed to production.**

### Committed work (7 of 7)

| Ticket | Outcome |
|---|---|
| EVENTS-03 #156 | ✅ **A page per event** at `/events/[id]`, from data the portal has always sent |
| SEO-05 #157 | ✅ Per-event titles and descriptions, `Event` structured data, events in the sitemap |
| OFFICER-03 #155 | ✅ Officer bios, shown when the portal provides one and invisible when it does not |
| PERF-02 #94 | ✅ **Measured and decided.** Target still not met; the reason is now known and written down |
| DATA-BT-01 #91 | ✅ `social-links` holds data, not JSX — and the icons are now type-checked |
| CLEANUP-02 #153 | ✅ `server.log` out of version control, `*.log` ignored |
| DOCS-02 #158 | ✅ Phase 3 opened in the roadmap, charter and SRS |

### Unplanned (1)

| Ticket | Outcome |
|---|---|
| OFFICER-02-BT-01 #151 | ✅ Reopened **twice**. The officers carousel flake was the entrance animation, then my own assertion. See §3 |

**1 of 8 closed tickets was unplanned — 12.5%**, against 20% in Sprint 4 and 71% in Sprint 2.

---

## 2. Measurements

| | End of Sprint 4 | End of Sprint 5 |
|---|---|---|
| Lighthouse Performance | ~0.90 | **~0.90**, unchanged ⚠️ |
| Largest Contentful Paint | ~3.5 s | **~3.7 s**, unchanged within noise ⚠️ |
| Lighthouse Accessibility | 1.00 | **1.00** ✅ |
| Lighthouse Best Practices | 1.00 | **1.00** ✅ |
| Lighthouse SEO | 1.00 | **1.00** ✅ |
| Public routes | 3 | **3 + one per portal event** |
| Automated tests (per browser) | 193 in 13 files | **225 in 16 files** (645 + 30 executions per CI run) |
| Largest single asset removed | — | **95 KB → 19 KB** (the mission icon) |
| Unplanned share of closed tickets | 20% | **12.5%** |

Performance is the spread of medians across **6 CI runs** at the end of this sprint: **0.88–0.91,
median 0.90**, LCP 3.5–3.8 s. Accessibility, Best Practices and SEO were 1.00 in **every** run.

---

## 3. The flake that took three rounds

The officers carousel tests failed as flaky on CI three times, in three different ways. Every round
was caught by `--fail-on-flaky-tests` — the gate built last sprint — and never by anyone noticing.

| Round | What it actually was | How it was found |
|---|---|---|
| 1 (#152) | Unclear: a lost press and a stalled animation looked identical | Fixed both candidate causes, and **made them fail differently** |
| 2 (#163) | **The entrance animation.** The suite pressed a button 72 px from where it had been told it was, on a section still at `opacity: 0` | Round 1's better message said "the press did not reach the carousel", and a measurement confirmed it |
| 3 (#167) | **My own assertion.** WebKit reports a settled transform as `matrix(1, 0, 0, 1, 0, 0)`, not `none` | The guard test from round 2 failed on a page that had revealed perfectly well |

**Round 1's real value was not its fix — it was making the next failure legible.** Without that, round
2 would have been another guess.

The cost is three CI cycles and three pull requests for one test file. The alternative was a suite
that failed once a week for reasons nobody could name.

---

## 4. A 0.08-point improvement that did not exist

PERF-02 was committed this sprint specifically so it would end in a decision rather than a fourth
speculative fix. It nearly ended in a fifth.

The candidate fix was real: `mission-vision/bullet.svg` was **not an SVG**. It was a 410×410 PNG,
base64-encoded inside SVG markup, used as a CSS mask — 95 KB for a decorative watermark. Rebuilt as
an alpha-only WebP at the size it renders: **19 KB**.

Measured before and after: **0.90 → 0.98, LCP 2.97 s → 1.50 s.** Three runs each, consistent.

It was wrong. The "after" runs had been measured against a **server left over from a different
build**. Re-measured properly, the same code scored **0.88** — no better than the baseline.

> **An A-B comparison would have shipped it as a performance fix.** An A-B-A comparison caught it.

The asset change still ships, honestly labelled as a 76 KB byte reduction with no measurable LCP
effect. The real finding is in §5.

---

## 5. What PERF-02 actually established

Three sprints ago the Sprint 2 review recommended re-running Lighthouse with real throttling before
attempting the number again. That comparison finally happened:

| Same build, same machine, 3 runs each | Score | LCP | FCP | TBT |
|---|---|---|---|---|
| `simulate` — what CI reports | 0.89 | **3.84 s** | 0.91 s | 36 ms |
| `devtools` — real throttling | 0.90 | **2.97 s** | 2.16 s | 175 ms |

**CI's LCP is about 0.9 s pessimistic**, and its TBT about 5× optimistic. The two methods disagree in
opposite directions, so they are not interchangeable.

**It does not rescue the target.** 2.97 s is still over the 2.5 s budget. The gap is real, just
smaller than CI says.

**CI keeps `simulate`,** because every historical figure in this project used it and switching would
silently invalidate four sprints of comparison. The offset is recorded in
[performance.md](./performance.md) instead.

**The bottleneck is not bytes.** The hero image is 102 KB at High priority and the page totals
~570 KB. The main thread is 2.1 s — Style & Layout 768 ms, script evaluation 764 ms — and 63% of LCP
is render delay. Closing that means shipping less client JavaScript or painting the hero before
hydration: scoped work, not a patch.

**#94 stays open, with the measurements on it.** The recommendation is to either commit to that
scoped work or change the target on purpose. What should not happen is a fifth attempt without a
hypothesis.

---

## 6. Definition of Done

| Criterion | Status |
|---|---|
| Every portal event has a page with title, date, category, image, description, location | ✅ Verified against a mocked portal |
| A missing event returns a 404, asserted by a test | ✅ Including odd ids, and verified on the live site |
| The detail page degrades like every other section | ✅ An unreachable portal 404s the page and leaves the homepage untouched |
| Accessibility holds at 1.00, no critical or serious violations on the new route | ✅ 1.00 in every CI run |
| No link anywhere has `href="#"` or an empty `href` | ✅ Still 0 |
| Each event page has its own title, description, valid `Event` data, sitemap entry | ✅ Verified on a production build |
| Officer bios render when present and leave no empty space when absent | ✅ Both cases tested; absence verified live |
| PERF-02 ends with a decision recorded on #94, backed by measurements | ✅ §5, and `docs/performance.md` |
| `server.log` untracked and ignored; no other runtime artefact tracked | ✅ Swept for `*.log`, `test-results/`, `playwright-report/`, `*.tsbuildinfo`, `.env*` |
| Every new check broken on purpose once | ✅ See §7 |
| All CI gates green; deployed; pushed to the deploy fork | ✅ |
| Documentation updated; charter, SRS and roadmap opened for Phase 3 | ✅ DOCS-02, plus a new `performance.md` |
| PM approval | ⬜ Pending this review |

**Reported as pending, not done:** the event pages have **never run on a real event**, because the
portal has none. Everything was verified against a mocked portal, as CMS-02 and CMS-04 were.

---

## 7. Checks broken on purpose

| Check | Sabotage | Result |
|---|---|---|
| Social icons render | `SocialIcon` returns `null` | ✅ Both new tests fail |
| Officers batch geometry | Restore the fixed-width avatar | ✅ Fails at 1024 px |
| Carousel steps | Force the track offset to `0` | ✅ Four tests fail |
| Reduced-motion step | Remove `motion-reduce:transition-none` | ✅ Fails |
| Reveal wait | Measure without it | ✅ `opacity: 0`, translated 72 px |

One test was **wrong in an instructive way**: the reduced-motion check first asserted
`transitionDuration === '0s'` and failed against a component that was behaving correctly.
`transition-none` removes the transition *property*; the duration stays `0.5s` and simply stops
meaning anything.

---

## 8. Process findings

**Stacked branches worked, once.** SEO-05 was built on EVENTS-03's branch because it needed those
routes, and retargeted to `prod` after EVENTS-03 merged. The one merge conflict — two branches each
moving a different half of `content.ts` into its own module — resolved cleanly because both halves
were moves, not rewrites.

**Firefox still cannot run locally** (`browserType.launch: spawn UNKNOWN`), so round 2 of the flake
was reasoned from CI output rather than reproduced. Unchanged from Sprint 4, and now a known cost:
a firefox-only defect takes one CI cycle per hypothesis.

**A dev-server log had been committed by another contributor** and is now removed, with `*.log`
ignored. The previous patterns covered only the package managers' own debug logs.

---

## 9. Carried into Sprint 6

**Waiting on the portal team — now blocking visible value**

- **Real events.** Event pages, their metadata and their sitemap entries are built, tested and live,
  and **not one of them can be seen**, because there are no events to open.
- **Landing images**, with hero uploads as transparent cut-outs.
- **Officer bios**, if bios are wanted on the site at all.

**Ready to schedule**

- **News / blog section** — needs a written specification for the portal team first. The Sprint 3
  handoff was answered the same day it was sent.
- **Event registration** — confirm with the portal team whether it is theirs before scoping.
- **PERF-02 #94** — commit to the main-thread work, or change the target deliberately.

**Backlog (2):** NEWS-01 #66 · CON-03 #71. Both still need a decision from outside the team.

**Open questions, unchanged since Sprint 3:** Vercel Pro for custom analytics events; who may assign
work to Copilot.

---

## 10. Recommendations for planning

1. **Send the news/blog specification before Sprint 6 starts.** Two sprints have now ended with the
   cross-team item untouched because it was never written down. The portal team's turnaround is a
   day; the delay is entirely on this side.
2. **A-B-A, or do not claim it.** This sprint produced a clean, consistent, three-run measurement of
   an improvement that did not exist. Two measurements are an anecdote.
3. **Decide PERF-02 rather than carrying it.** It has now been stretch twice and committed once. The
   measurement is done; what is left is a choice.
4. **Make the failure legible before fixing it.** The flake's second round was solved by the error
   message written in the first, not by the fix in the first.
5. **Keep the ticket ceiling.** Seven committed, one unplanned, nothing slipped, for the third sprint
   running.
