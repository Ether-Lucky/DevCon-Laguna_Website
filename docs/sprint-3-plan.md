# Sprint 3 Plan — Dynamic Content via Headless CMS

**Project:** DevCon Laguna Official Website · **PM:** Lucky Guevarra
**Duration:** 2 weeks · **Follows:** [Sprint 2 Review](./sprint-2-review.md)

## Sprint goal

Hand content control to the team. Events, officers and the landing page's key images move to a
hosted CMS, so an officer can publish a change without a developer, a pull request, or a
redeploy — and the accessibility criterion that Sprint 2 never verified gets verified.

---

## 1. Committed scope (7 tickets)

| Ticket | What it delivers |
|---|---|
| **CMS-01** #74 | Sanity project, content models for Events / Officers / Images, sample entries |
| **CMS-02** #75 | Events section rendered from the CMS |
| **CMS-03** #76 | Officers section rendered from the CMS |
| **CMS-04** #77 | Hero, Who We Are carousel, What We Do and bottom-section images CMS-managed |
| **CMS-05** #78 | Cached content with ~30-minute revalidation |
| **CMS-06** #79 | Authenticated on-demand revalidation for instant publishing |
| **A11Y-01** #116 | axe audit, keyboard and contrast checks, plus a CI assertion |

### Stretch, not committed

**PERF-02** (#94) LCP · **NEWS-01** (#66) newsletter · **FOOTER-02** (#72) footer redesign, which
also clears 17 remaining dead `#` links · **LEGAL-01** (#73) Terms & Privacy · **DATA-BT-01**
(#91) social-links refactor · **CON-03** (#71) contact map.

---

## 2. Why the scope stops there

Sprint 2 closed 24 tickets, but **17 of them were unplanned** — 71%. Much of that was the
one-off cost of repairing a CI pipeline that could not fail, and should not recur. But planning
Sprint 3 at full capacity would repeat the same mistake: leaving no room for what surfaces.

Seven committed tickets with the rest explicitly stretch is the deliberate correction. If the
CMS work lands early, the stretch list is ordered and ready.

**A11Y-01 is committed rather than stretch on purpose.** It is a Definition of Done criterion
that has now gone one full sprint unverified, and it only slipped because it was never written
down as a ticket. Leaving it stretch a second time would be how it slips again.

---

## 3. CMS decision: Sanity

Chosen against this project's real constraints — no infrastructure to run, free tier essential,
non-technical editors, and CMS-05's requirement that content update **without a redeploy**.

| Option | Verdict |
|---|---|
| **Sanity** | ✅ Free tier covers 3 users / 10k docs / 5GB assets; image CDN satisfies CMS-04; webhooks satisfy CMS-06; strong Next.js support |
| Contentful | Viable — 5 free editor seats against Sanity's 3, but stricter API limits |
| Strapi / Payload | Rejected — both need a server and database the team does not have; cloud tiers are paid |
| Git-based (Keystatic, Tina) | Rejected — free and simple, but a content change triggers a rebuild, which **is** a redeploy, contradicting CMS-05 |

> ⚠️ **Watch the seat limit.** Sanity's free tier allows **3 editor seats**. Worth confirming how
> many officers will actually edit content before roles are built out — if it is more than three,
> this becomes a cost decision, and it is far cheaper to know that now than after CMS-01 ships.

---

## 4. Sequencing

CMS-01 blocks everything else, so it goes first and should not be rushed — the content models
defined there are what every later ticket renders.

```
CMS-01  ──┬── CMS-02  Events
          ├── CMS-03  Officers      ──┬── CMS-05  caching
          └── CMS-04  Images          └── CMS-06  instant publish

A11Y-01 ── independent, can run in parallel
```

CMS-05 and CMS-06 depend on at least one section already reading from the CMS, so they follow
CMS-02/03 rather than running alongside. A11Y-01 touches no CMS code and can proceed in
parallel at any point.

---

## 5. Definition of Done

- An officer can add, edit or remove an event or officer in Sanity and see it live **without a
  developer and without a redeploy**.
- The four landing page images are replaceable from the CMS admin UI.
- Content is cached; the CMS is not called on every request; a failed revalidation keeps serving
  the last known good content rather than breaking the page.
- Instant publish works and its endpoint is authenticated.
- **No critical or serious axe violations**, keyboard navigation works throughout, and contrast
  passes in **both** themes.
- An accessibility assertion runs in CI.
- All four CI gates green; deployed to production and pushed to the deploy fork.
- Documentation updated in `docs/`.
- PM approval.

### Carried forward as a known gap

Lighthouse **performance remains below 0.90** and is still set to `warn` rather than `error`.
That is accepted going into Sprint 3, and PERF-02 stays stretch. Promoting the gate is
explicitly *not* a Sprint 3 commitment.

---

## 6. Risks

| Risk | Why it matters | Handling |
|---|---|---|
| Sanity's 3-seat free tier | More editors than seats turns this into a cost decision mid-sprint | Confirm the editor count during CMS-01, before roles are built |
| Content model churn | Every later ticket renders what CMS-01 defines; changing it late means rework across four tickets | Model all three types up front; review before CMS-02 starts |
| A CMS outage taking the page down | The landing page would lose its main sections | Graceful degradation is an acceptance criterion on CMS-02, CMS-03 and CMS-05 — test it deliberately, do not assume it |
| Webhook secret leaking | An open revalidation endpoint can be abused | Authenticated endpoint, secret in env, never committed (CMS-06) |
| Repeating the 71% overrun | Discovery work crowds out committed work | Scope held to 7 tickets; stretch list ordered but uncommitted |

---

## 7. Configuration needed before development

| Item | Blocks | Owner |
|---|---|---|
| Sanity account + project created | CMS-01 and everything after it | PM |
| Sanity API token (read) as an env var | CMS-02 onward | PM |
| Revalidation secret as an env var | CMS-06 | PM |
| Confirmed count of content editors | CMS-01 seat planning | PM |

**Remember to redeploy after adding any environment variable.** `NEXT_PUBLIC_*` values are
inlined at build time; setting one on a running deployment does nothing. This caught the team
twice in Sprint 2 — with the Gmail credentials and again with analytics.

---

## 8. Open question, unresolved from Sprint 2

**#87 — Programs & Activities** is still commented out of the page, so **FR-06 is not currently
satisfied in production** despite being marked delivered in Sprint 1. It sits in Todo awaiting a
decision: restore the section, or formally descope FR-06 and update the SRS.

It is small, but it is an SRS requirement currently unmet, and it has been open longer than any
other item on the board. Worth settling before or at the start of the sprint rather than
carrying it a third time.
