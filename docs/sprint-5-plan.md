# Sprint 5 Plan — Phase 3, part one

**Project:** DevCon Laguna Official Website · **PM:** Lucky Guevarra
**Duration:** 2 weeks · **Follows:** [Sprint 4 Review](./sprint-4-review.md)

## Sprint goal

Start Phase 3 with the work that needs nothing from anyone else: give events a page of their own,
show the officer information the portal already sends, settle the one Phase 2 target that was missed,
and clear the two small debts left on the board.

---

## 1. What Phase 3 is, and what this sprint takes from it

The charter deferred three features past Phase 2 — **event detail pages**, a **news/blog section**,
and **event registration**. The Sprint 4 review sorted them by what they actually depend on:

| Candidate | Depends on | In Sprint 5? |
|---|---|---|
| **Event detail pages** | Nothing new. The portal already sends `description` and `location` | ✅ **Yes** — the flagship |
| News / blog section | A **new portal endpoint**; runs on the portal team's schedule | ❌ Not until the ask is written and accepted |
| Event registration | **Probably not ours.** Members already have accounts on the portal | ❌ Confirm ownership first |

**This sprint deliberately takes only work the team controls.** Sprint 3 showed the cross-team loop
can be fast — all three requests delivered the same day — but it is still someone else's queue, and
a sprint that opens a phase should not start blocked.

---

## 2. Committed scope (7 tickets)

| Ticket | What it delivers | Size |
|---|---|---|
| **CLEANUP-02** #153 | `devcon/server.log` out of version control, and ignored | XS |
| **DATA-BT-01** #91 | `social-links.tsx` stops embedding JSX icons in a content file | S |
| **OFFICER-03** #155 | Officer bios, shown when the portal provides one | M |
| **EVENTS-03** #156 | **A page per event** at `/events/[id]`, linked from the event cards | L |
| **SEO-05** #157 | Per-event metadata, `Event` structured data, and the events in the sitemap | M |
| **PERF-02** #94 | The one unmet Phase 2 target: measure honestly, then decide | M |
| **DOCS-02** #158 | Phase 3 opened in the charter, SRS and roadmap; the new FRs recorded | M |

### Backlog, unchanged

**NEWS-01** #66 (needs an email provider and a list owner) · **CON-03** #71 (needs a venue to show).

---

## 3. Decisions recorded at planning

| Question | Decision |
|---|---|
| Which events get a detail page? | **Portal events only.** The bundled events are placeholders with no description or location; a page for one would be an empty page. Placeholder cards stay unlinked |
| What is in the URL? | **The portal's event `id`.** The portal has no slug field, and inventing one here would break the moment the portal adds a real one |
| An event that does not exist | **A real 404**, not a redirect to the homepage. A wrong link should say so |
| How is a detail page verified, with no portal events? | **Against a mocked portal**, as CMS-02 and CMS-04 were. Live verification waits for the portal team's data and is recorded as pending, not as done |
| PERF-02: fix or drop? | **Measure first.** Sprint 2's recommendation — re-run with `throttlingMethod: devtools` — has been outstanding for three sprints. If the real-device number is at target, the finding is Lighthouse's simulated throttling and the ticket closes with that evidence. If it is genuinely slow, fix the largest single contributor and no more |
| Officer bios | **Shown when present, absent when not.** No placeholder text, no empty section. The portal's roster may have no bios at all today |

---

## 4. Sequencing

```
Day 1     CLEANUP-02 · DATA-BT-01          small, independent, clears the board
Week 1    OFFICER-03                        portal data already modelled
          EVENTS-03                         the flagship; start early
Week 2    SEO-05                            needs EVENTS-03's routes to exist
          PERF-02                           measurement first, then a decision
          DOCS-02                           last: records what this sprint decided
```

**EVENTS-03 starts in week 1**, because SEO-05 cannot start until its routes exist. If EVENTS-03
slips, SEO-05 slips with it, and that is the pair to protect.

---

## 5. Definition of Done

- **Every portal event has a page** showing its title, date, category, cover image, description and
  location, and the cards link to it.
- **A missing event returns a 404**, asserted by a test.
- **The detail page degrades like every other section:** if the portal is unreachable the page does
  not crash, and the section that links to it still renders.
- **Accessibility holds at 1.00** and axe reports no critical or serious violations on the new route,
  as it already does for `/`, `/privacy` and `/terms`.
- **No link on any page has `href="#"` or an empty `href`** — the FOOTER-02 test extended to the new
  route.
- **Each event page has its own title and description**, valid `Event` structured data, and appears
  in the sitemap.
- **Officer bios render when present and leave no empty space when absent**, both cases tested.
- **PERF-02 ends with a decision recorded on #94**, supported by measurements: either the target is
  met, or the target is changed on purpose, or the remaining gap is quantified and carried with a
  named reason.
- **`server.log` is untracked and ignored**, and no other runtime artefact is tracked.
- **Every new check is broken on purpose once** before it is trusted. Four were found hollow last
  sprint.
- All CI gates green; deployed to production and pushed to the deploy fork.
- Documentation updated in `docs/`; the charter, SRS and roadmap opened for Phase 3.
- PM approval.

---

## 6. Risks

| Risk | Why it matters | Handling |
|---|---|---|
| **The portal still has no events** | The flagship feature cannot be seen working on the live site | Build and test against a mocked portal, as CMS-02 and CMS-04 were. Report live verification as pending rather than claiming it |
| **PERF-02 turns into a fourth speculative fix** | Three attempts have already failed to move it | Measurement gates the work: no change is made until the real-device number is known |
| **Event `id` in the URL is ugly** | A uuid in a shared link looks unfinished | Accepted deliberately. A slug needs a portal field; ask for one only if the PM wants shareable URLs |
| **Officer bios may be empty everywhere** | The feature would be invisible on the live site | The absent case is the tested default. Told to the portal team so they know bios now appear |
| **Firefox cannot run locally** | A firefox-only defect costs a full CI run to see | Unchanged from Sprint 4. CI covers firefox; local runs cover chromium and WebKit |
| **New routes move visual baselines** | The established trap: two branches refreshing the same snapshot | Refresh on the branch, review the images, and re-run a comparison on that exact commit |

---

## 7. External actions needed

| Item | Blocks | Owner |
|---|---|---|
| **Add real events to the portal** | Live verification of EVENTS-03, SEO-05 and the Events section itself | Portal team |
| **Add landing images** (hero as transparent cut-outs) | The image slots switching over | Portal team |
| **Officer bios in the portal**, if bios are wanted on the site | OFFICER-03 being visible at all | DevCon Laguna officers |
| Decide whether shareable event URLs need a slug field | A follow-up ask to the portal team | PM |
| **Vercel Pro**, if custom analytics events are wanted | Click tracking; pageviews already work | PM — a cost decision |
| **Who may assign work to Copilot** | Unassigned automation opening pull requests | PM — open since Sprint 3 |

---

## 8. After this sprint

What is left of Phase 3 after Sprint 5 is the cross-team work: a **news/blog endpoint**, and a
decision on **event registration**. Both should be written as a specification for the portal team
before they are scheduled — the Sprint 3 handoff is the pattern that worked.
