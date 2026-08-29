# Quality Gates

What CI enforces, what it merely reports, and how to change either.

## Lighthouse thresholds

Configured in [`lighthouserc.json`](../lighthouserc.json) and run by the `lighthouse` job on
every push to `prod` and every pull request.

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

## Changing a threshold

Thresholds encode the Definition of Done, so treat a change as a scope decision rather than
a build fix:

1. Raise it in the sprint, don't lower it to turn a build green.
2. Change the value in `lighthouserc.json` in its own commit, explaining why.
3. Record the decision in the sprint documentation.

If a build fails on one of these gates, the fix is the page, not the threshold.

## The other gates

| Job | What it enforces |
|---|---|
| `lint` | ESLint passes with zero errors |
| `test` | Functional and regression suites pass (`home`, `regression`, `seo`) |
| `visual-regression` | Rendered output matches the committed Linux baselines — see [visual-regression.md](./visual-regression.md) |
| `lighthouse` | The thresholds above |
| `deploy` | Runs only on `prod`, and only after `lint`, `test` and `lighthouse` succeed |

All checks run on pull requests as well as pushes. They previously carried an
`if: github.ref == 'refs/heads/prod'` guard that is never true during a pull request, so
every check silently skipped on every PR; that guard has been removed.
