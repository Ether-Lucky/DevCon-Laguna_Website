# Quality Gates

What CI enforces, what it merely reports, and how to change either.

## Lighthouse thresholds

Configured in [`lighthouserc.json`](../lighthouserc.json) and run by the `lighthouse` job on
every push to `prod` and every pull request.

Scores are the **median of 3 runs**, not a single sample — see *Why three runs* below.

| Category | Level | Threshold | Current | Enforced? |
|---|---|---|---|---|
| Accessibility | `error` | ≥ 0.90 | 0.96 | ✅ fails the build |
| Best Practices | `error` | ≥ 0.90 | 0.96 | ✅ fails the build |
| SEO | `error` | ≥ 0.90 | 1.00 | ✅ fails the build |
| Performance | `warn` | ≥ 0.90 | **0.78** | ⚠️ reported only |

### Why performance is still a warning

Every assertion used to be set to `warn`. `warn` prints a message and exits successfully, so
the job could not fail no matter how far a score dropped — it reported success at a
performance score of 0.78 and let `deploy` proceed. That defeated the point of having a
threshold at all.

Three categories already pass comfortably and are now enforced. Performance is deliberately
left at `warn` because the landing page currently scores 0.78: promoting it to `error` today
would block every merge until the underlying LCP problem is fixed.

**Promote performance to `error` as soon as PERF-02 (#94) lands and the score clears 0.90.**
That is the last step of this gate, and the Sprint 2 Definition of Done is not met until it
is done.

## Why three runs

Lighthouse originally ran **once** per CI execution and asserted against that single sample.
Three consecutive runs, on code that was identical or strictly improved between them, produced:

| Run | Context | Performance |
|---|---|---|
| `33261148335` | prod baseline | 0.78 |
| `33262534313` | PERF-02 mid-fix | 0.83 |
| `33263582237` | PERF-02 final | 0.74 |

A **±0.09 swing** — wider than many real regressions. That made the gate untrustworthy in both
directions: PERF-02 could not be given a verdict, and promoting performance to `error` would
have produced builds failing at random.

The job now collects **3 runs** and asserts against the **median**, stated explicitly with
`aggregationMethod` rather than relying on a default. The tradeoff is that the Lighthouse job
takes roughly three times as long — about a minute becomes about three. That is worth paying
for a number anyone can act on.

If a score still moves without a corresponding change, raise the run count rather than
assuming the result is real.

## Changing a threshold

Thresholds encode the Definition of Done, so treat a change as a scope decision rather than
a build fix:

1. Raise it in the sprint, don't lower it to turn a build green.
2. Change the value in `lighthouserc.json` in its own commit, explaining why.
3. Record the decision in the sprint documentation.

If a build fails on one of these gates, the fix is the page, not the threshold.

## Client JavaScript

Under Lighthouse's mobile profile the CPU is throttled 4×, so script evaluation sits on the
critical path and shows up as LCP **render delay** rather than as an obvious "slow script".
Keep an eye on the total when adding dependencies:

| | Total client JS |
|---|---|
| Before PERF-03 | 792 KB |
| After PERF-03 | **676 KB** |

framer-motion accounted for a 154.5 KB chunk while being used by a single component for three
entrance effects. `ScrollReveal` now does the same work with a CSS transition driven by an
`IntersectionObserver`, and mutates the node directly rather than through React state, so
revealing a section costs no re-render.

Before adding an animation or UI library, check whether a few lines of CSS would do — the cost
lands on the metric that is hardest to attribute.

## The other gates

| Job | What it enforces |
|---|---|
| `lint` | ESLint passes with zero errors |
| `test` | Functional and regression suites pass (`home`, `regression`, `seo`) |
| `visual-regression` | Rendered output matches the committed Linux baselines — see [visual-regression.md](./visual-regression.md) |
| `lighthouse` | The thresholds above |
| `deploy` | Publishes to **production** on `prod`, after `lint`, `test` and `lighthouse` succeed |

### Deploy must pass `--prod`

`amondnet/vercel-action` publishes a **preview** deployment unless `vercel-args: '--prod'` is
set. A preview gets a throwaway URL and never updates the production alias, while the job
still reports success — so the live site silently stayed on an old build through an entire
sprint. Do not remove that argument.

After a merge to `prod`, confirm the deploy actually landed:

```bash
curl -s https://<production-url>/robots.txt | head -3
```

A robots file means the new build is live; the 404 page means it is not.

All checks run on pull requests as well as pushes. They previously carried an
`if: github.ref == 'refs/heads/prod'` guard that is never true during a pull request, so
every check silently skipped on every PR; that guard has been removed.
