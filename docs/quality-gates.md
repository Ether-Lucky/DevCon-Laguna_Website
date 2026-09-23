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


### Deployment is not part of this pipeline

The live site is served by a Vercel project connected to the
`laguna-devcon/DevCon-Laguna_Website` fork, not by CI in this repository. This repo previously
carried a `deploy` job pointing at an older, abandoned Vercel project; it also lacked
`--prod`, so it only ever published preview deployments while reporting success. It has been
removed rather than left as a misleading green step.

**Publishing is a push to the fork:**

```bash
git push deploy prod
```

(`deploy` is the git remote for `laguna-devcon/DevCon-Laguna_Website`. Add it once with
`git remote add deploy https://github.com/laguna-devcon/DevCon-Laguna_Website.git`.)

Do this after every merge to `prod`, or the deployed site silently falls behind. Confirm it
landed:

```bash
curl -s https://dev-con-laguna-website-nine.vercel.app/robots.txt | head -3
```

A robots file means the new build is live; the 404 page means it is not.

All checks run on pull requests as well as pushes. They previously carried an
`if: github.ref == 'refs/heads/prod'` guard that is never true during a pull request, so
every check silently skipped on every PR; that guard has been removed.

## Flaky tests fail the build (CICD-BT-06)

CI retries a failed test twice. A test that fails and then passes is reported as **flaky**, and
the job used to pass anyway, so nobody was told. Three tests were being rescued that way, and a
real regression and a timing glitch look identical once a retry turns them into a pass.

The `test` and `visual-regression` jobs now run with **`--fail-on-flaky-tests`**. Retries still
run, so a genuine blip is visible in the report, but the job fails.

### The three, and what they actually were

All three were **test bugs**, not product bugs. They were invisible locally, because a single test
running alone always passed; they surfaced under load. Note CI clusters these tests into a single
worker (`workers: 1`), so it does *not* run them in parallel — "under load" means several repeat
runs sharing the machine ([`--repeat-each`](#diagnosing-the-next-one)) or the whole suite grinding
through a busy browser. The local reproduction that pinned each race used parallel workers.

**1. The contact form tests raced React hydration.**
The form is a client component. Typing into it before React hydrates works on the DOM, and
hydration then resets the input to its empty state. Only the **first** field is lost. The symptom
was a missing success banner, and the probe that found it showed the name field empty with the
other three filled, and *"Please enter your name"* on screen.

`tests/support/form.ts` now waits for React's own hydration marker (`__reactFiber$…`, which React
attaches to a DOM node when it hydrates) before typing.

> ⚠️ Checking that a typed value "stuck" is **not** enough. With React not yet hydrated nothing
> resets the field, so the check passes and hydration wipes it immediately afterwards. That
> version still failed 1 run in 20.

That fixed the typing, but the Click capture showed the suite still failed **20 of 20 runs on
WebKit** — and the failure proved the fill was no longer the problem. At failure the accessibility
snapshot showed all four fields filled correctly, the button still reading *"Send message"*
(`status === 'idle'`), no error banner, and no URL change: the `onSubmit` handler had never run,
so **the click itself was never delivered**.

**2. The clicks were lost mid-reveal (the same WebKit failures, second race).**
`ScrollReveal` slides the Contact section in with a 0.85s translate/fade transition. A test that
answers the `/#contact` hash then clicks straight away sends the click while the section is still
moving: Playwright checks the target is stable once, then fires `mousedown`+`mouseup`, and if a
layout shift moves the element in between, the click lands on the wrong target. Nothing breaks
visibly — the form is simply left untouched. Under `--repeat-each=20` on WebKit this surfaced in
all three form-submit tests, and in the CTA-tracking test too (whose tracked events come from a
delegated `document` listener that `AnalyticsEvents` only registers in a `useEffect`, so it also
needed the listener to exist before the click).

The fix is effect-driven retry rather than a fixed wait: `clickUntilEffect` in
`tests/support/form.ts` repeats the click until the expected outcome is visible, and exits the
moment it passes. It does not disable the animation the test runs against, and re-clicking a spent
control is safe because the effect assertion stops the loop as soon as it holds.

**3. The accessibility audit measured text mid-fade.**
`ScrollReveal` animates sections in by fading opacity, and axe computes contrast from the colours
as rendered, so text caught mid-fade measures as low contrast. It failed once in CI with 8
contrast violations in the Contact section, then passed on retry. The audits now run with
`prefers-reduced-motion`, which `ScrollReveal` honours.

A test asserts that the setting is actually applied. Playwright moved this option once already
(`reducedMotion` → `contextOptions.reducedMotion` in 1.61); if it moves again, the setting would
silently stop working and the flake would return with nothing to show why.

**4. The analytics pageview test** was removed in ANL-01-BT-01, because `<Analytics />` no longer
renders outside Vercel. It was testing Vercel's library rather than this project.

A dev server build (`npm run build && npm run start`) exceeds the config's 60s `webServer` wait on
some machines; start it by hand first and Playwright reuses it (`reuseExistingServer` is set away
from CI).

### Diagnosing the next one

Run it under load, not on its own: `--repeat-each` with several projects at once. A test that
passes 20 times alone and fails 3 times in 8 under load is a race, and the race is usually with
something the page does after it loads.
