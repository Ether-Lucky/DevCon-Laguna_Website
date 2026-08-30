# Sprint 2 Review — Dynamic Content, Contact & Quality Hardening

**Project:** DevCon Laguna Official Website · **PM:** Lucky Guevarra
**Sprint goal:** Turn the static landing page into a measurable, maintainable and interactive
public site — close FR-07 with a working contact form, make content data-driven, and meet the
SRS non-functional bar.

**Verdict: goal met, Definition of Done partially met.** Every planned ticket except the
stretch story shipped, and FR-07 is closed. Two DoD criteria are not satisfied — Lighthouse
performance, and an accessibility audit that was never run. Details in *Definition of Done*
below.

---

## 1. What shipped

**24 tickets closed · 17 pull requests merged · all deployed to production.**

### Planned work (7 of 8)

| Ticket | Outcome |
|---|---|
| CON-01 Contact Form | ✅ **Closes FR-07** — delivering mail in production |
| CON-02 Spam Protection | ✅ Honeypot live; Turnstile ready, awaiting keys |
| DATA-01 Content Models | ✅ Delivered by the team before the sprint's own work began |
| SEO-01 Metadata & Sharing | ✅ Includes a generated share image |
| SEO-02 Sitemap & Robots | ✅ |
| SEO-03 Structured Data | ✅ |
| ANL-01 Analytics | ✅ Code live; custom events need a Pro plan |
| NEWS-01 Newsletter *(stretch)* | ⬜ Not started — the planned cut line |

### Unplanned work (17)

Defects found during the sprint and fixed within it: five CI/CD failures, four performance
tickets, three contact/CTA defects, and five code-quality fixes.

**17 of the 24 closed tickets — 71% — were unplanned.** That is the sprint's most important
number, and section 3 explains why.

---

## 2. Measurements

Everything below is measured, not estimated. Lighthouse figures are the median of three runs.

| | Start of sprint | End of sprint |
|---|---|---|
| Lighthouse Performance | 0.78 | **0.88** ⚠️ below the 0.90 target |
| Lighthouse Accessibility | 0.96 | **0.96** ✅ |
| Lighthouse Best Practices | 0.96 | **0.96** ✅ |
| Lighthouse SEO | 1.00 | **1.00** ✅ |
| Largest Contentful Paint | 4.6s | **~3.5s** ⚠️ target is 2.5s |
| Total Blocking Time | 280ms | **~40ms** ✅ |
| Hero image assets | 3.44 MB | **0.65 MB** (−81%) |
| Client JavaScript | 792 KB | **704 KB** (−11%) |
| Automated tests | 29 *(3 failing)* | **94** ✅ |
| CI jobs that can fail | effectively 0 | **4** |

**On that last row.** At the start of the sprint the pipeline reported green while being
incapable of failing. It is now a real gate. That is arguably worth more than any single
feature delivered.

---

## 3. The theme of this sprint: a green pipeline that could not fail

Five separate defects shared one root cause — **CI reported success while not doing its job.**
They were found in sequence, each uncovered by fixing the one before it.

| Ticket | Defect | Consequence |
|---|---|---|
| CICD-BT-01 | Every job guarded by `if: github.ref == 'refs/heads/prod'`, never true on a PR | **No check ever ran on a pull request** |
| CICD-BT-02 | Visual job ran `--update-snapshots` | Baselines rewrote themselves; the job **could not fail** |
| CICD-BT-03 | Lighthouse assertions all set to `warn` | Reported success at a score of 0.78 |
| CICD-BT-04 | Lighthouse asserted a single run | Scores swung ±0.09; noise indistinguishable from regression |
| CICD-BT-05 | Deploy lacked `--prod` | Published previews; **the production alias never updated** |

Fixing the first exposed three tests that had been broken since the UI rework and never
noticed. Fixing the visual gate then immediately caught a real 53px layout regression during
the performance work — a gate that had never once fired proved its value within hours.

**Lesson for Sprint 3:** a passing pipeline is only evidence if each job has been observed to
fail. Worth verifying deliberately when adding any future check.

---

## 4. Definition of Done

| Criterion | Status |
|---|---|
| Contact form delivers email in production | ✅ Verified end to end with a live submission |
| Content is data-driven | ✅ Typed models; Events/Officers move to the CMS in Sprint 3 |
| Lighthouse ≥ 0.90 — Accessibility, Best Practices, SEO | ✅ 0.96 / 0.96 / 1.00 |
| Lighthouse ≥ 0.90 — **Performance** | ❌ **0.88** |
| **No critical axe accessibility violations** | ⚠️ **Never verified — see below** |
| CI green including new tests | ✅ 4 jobs, 94 tests |
| Deployed to Vercel | ✅ |
| PM approval | ⬜ Pending this review |

### Two honest gaps

**Performance is 0.88 against a 0.90 target.** LCP came down from 4.6s to ~3.5s, but the
target is 2.5s. Three separate fixes each corrected the thing they targeted — image weight,
the hero's opacity wrapper, 116 KB of JavaScript — yet ~2.4s of "render delay" never moved.
That figure is *modelled* by Lighthouse's simulated throttling rather than measured, so the
recommendation on PERF-02 (#94) is to re-run with `throttlingMethod: devtools` before
attempting a fourth fix. Adding analytics late in the sprint also cost roughly 2 points, a
deliberate trade.

**The accessibility audit was never run.** The Sprint 2 backlog included an *Accessibility
Pass* (US-204) calling for an axe audit, but **no ticket was ever created for it**, so it was
never scheduled and quietly fell out of the sprint. The same happened to US-205 (Performance
Pass) and US-207 (Test Coverage) — the latter got done incidentally rather than by plan.

Lighthouse reports accessibility at 0.96, which is reassuring but is **not** the same as an axe
audit, and the DoD asks specifically for the latter. This should be an explicit Sprint 3
ticket. The process gap — backlog stories that never became tickets — is worth correcting at
planning.

---

## 5. Decisions taken during the sprint

| Decision | Reason |
|---|---|
| Membership/admin track removed from scope | Handled by the separate DevConnect Portal |
| Sprint 3 retargeted to a hosted headless CMS | Editors need content control without redeploys |
| Gmail SMTP instead of Resend | Resend requires a verified domain; the org owns none |
| The advertised email address removed entirely | `hello@devconlaguna.com` was unowned and unreachable |
| CTAs point at the DevConnect Portal | They were dead links; the portal is the real destination |
| Deploy job removed from this repo | Publishing happens from the `laguna-devcon` fork |
| Analytics merged despite a ~2-point cost | Engagement data judged worth more than 2 points |

### One defect worth singling out

The site advertised **`hello@devconlaguna.com`** — an address on a domain the organisation does
not own. It was a clickable `mailto:` **and** was being published to search engines as the
official contact in JSON-LD. It came from the UI/UX mockup and was taken at face value.

Structured data raises the stakes on that kind of error: a mistake in a mockup became a machine-
readable claim to search engines. **Contact details taken from a design should be verified as
real before they ship.**

---

## 6. Carried into Sprint 3

**Ready to schedule**

- **PERF-02** (#94) — LCP 3.5s vs 2.5s. Start by confirming whether render delay is real or a
  modelling artifact.
- **Accessibility audit** — needs creating; the DoD criterion is still unverified.
- **Promote Lighthouse performance to `error`** — the second half of CICD-BT-03, safe only once
  the score clears 0.90 with headroom.

**Backlog (4)** — NEWS-01 newsletter · FOOTER-02 footer redesign, which also clears 17
remaining dead `#` links · LEGAL-01 Terms & Privacy · DATA-BT-01 social-links refactor.

**Awaiting a decision** — **#87**: Programs & Activities is still commented out of the page,
which means **FR-06 is not currently satisfied** despite being marked delivered in Sprint 1.
This needs resolving either way, and is the oldest open question on the board.

**Sprint 3 (CMS-01…CMS-06)** — headless CMS for Events, Officers and section images, with
~30-minute cached revalidation and authenticated on-demand publishing.

> ⚠️ **Board hygiene:** the six CMS tickets, CON-03 and #87 are currently sitting in
> **For Review** despite no work having been done on them. They should move back to Backlog
> before planning, or the Sprint 3 board will misrepresent its own starting state.

---

## 7. Outstanding configuration

| Item | Unblocks |
|---|---|
| Cloudflare Turnstile keys, then redeploy | Activates the CAPTCHA layer (honeypot works today) |
| Vercel **Pro** plan | Custom analytics events; pageviews work on Hobby |
| Decision on #87 | FR-06 compliance |

`NEXT_PUBLIC_*` values are inlined at build time — setting one on a running deployment does
nothing. This caught us twice, with the Gmail credentials and again with analytics. **Always
redeploy after changing environment variables.**

---

## 8. Recommendations for planning

1. **Create tickets for every backlog story.** Three stories never became tickets and two of
   them silently left the sprint. If it is not on the board, it will not happen.
2. **Schedule the accessibility audit explicitly.** It is a DoD criterion that has never been
   verified.
3. **Budget for unplanned work.** 71% of this sprint was unplanned. Much of that was a one-off
   cost of repairing the pipeline and should not recur — but planning at 100% capacity again
   would repeat the same squeeze.
4. **Settle #87 before Sprint 3 planning.** An SRS requirement is currently unmet in production.
5. **Verify each new CI gate can actually fail.** The single highest-value lesson available
   from this sprint.
