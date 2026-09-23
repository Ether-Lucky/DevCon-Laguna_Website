# Performance: what the numbers actually say

How this project measures Lighthouse Performance, what the ≥ 0.90 target has cost so far, and what
is left (PERF-02, #94).

## The short version

| Question | Answer, with evidence |
|---|---|
| Is the target met? | **No.** ~0.90 in CI, LCP ~3.5 s against a 2.5 s target |
| Is CI's LCP figure real? | **Partly.** Simulated throttling reports LCP **0.9 s worse** than real throttling on the same build |
| Is the gap real after that correction? | **Yes.** ~3.0 s with real throttling, still ~0.5 s over target |
| What is the bottleneck? | **Main-thread work**, not bytes: 2.1 s, split between Style & Layout (768 ms) and Script Evaluation (764 ms) |
| Is there a cheap fix left? | **No.** The cheap ones are done, and the last one measured no better than noise |

## Why a single Lighthouse run means nothing here

A single run of the same build has scored anywhere from **0.56 to 0.92** on this project. The
Sprint 2 review reported two figures that were wrong because they came from one run each, and the
Sprint 3 review had to correct them.

**Every performance figure in this repository is a median of at least three runs, and says how many.**
CI runs Lighthouse three times per job and asserts on the median.

## Simulated throttling versus real throttling

Lighthouse's default — and CI's — is `throttlingMethod: simulate`: the page is loaded on the real
connection and the timings are then modelled as if on a slow 4G phone. `devtools` instead throttles
the connection and CPU for real.

Measured on the same production build, same machine, three runs each:

| | Score (median) | LCP (median) | FCP (median) | TBT (median) |
|---|---|---|---|---|
| `simulate` (what CI reports) | 0.89 | **3.84 s** | 0.91 s | 36 ms |
| `devtools` (real throttling) | 0.90 | **2.97 s** | 2.16 s | 175 ms |

**Simulation reports LCP about 0.9 s worse than real throttling, and TBT about 5× better.** The two
methods disagree in opposite directions, which is why they are not interchangeable.

The Sprint 2 review recommended this comparison before a fourth attempt at the number. This is it,
three sprints later. **It does not rescue the target:** 2.97 s is still over the 2.5 s LCP budget.

**CI keeps `simulate`.** It is the standard, it is what every historical figure in this repository
used, and switching would silently invalidate the comparison across four sprints. The offset above
is the thing to remember when reading a CI number, and it is recorded here so nobody has to
rediscover it.

## Where the time actually goes

From the real-throttling run, the LCP element is the hero image, and its phases are:

| Phase | Share |
|---|---|
| TTFB | 14% |
| Load delay | 8% |
| Load time | 15% |
| **Render delay** | **63%** |

The image is 102 KB, already fetched at High priority, and the page total is ~570 KB. **Bytes are
not the problem.** The main thread is:

| Main-thread work | Time |
|---|---|
| Style & Layout | 768 ms |
| Script evaluation | 764 ms (791 ms of it one chunk) |
| Other | 378 ms |

## What was tried, and what it was worth

**The 95 KB icon (done, kept, no measurable effect).** `mission-vision/bullet.svg` was not really an
SVG: it was a 410×410 PNG, base64-encoded inside SVG markup, used as a CSS `mask-image`. A mask uses
only the alpha channel, so it is now cropped to the region the SVG actually showed, sized for the box
it renders in, and stored as an alpha-only WebP: **95 KB → 19 KB**, with no visible change.

It is worth keeping on its own merits, and it **did not move LCP**:

| Same branch, fresh build, three runs each | Score | LCP |
|---|---|---|
| Before | 0.90 | 2.97 s |
| After | 0.88 | 3.00 s |

That is within noise. Reported as a byte reduction, not a performance fix, because that is what the
measurement supports.

> **A cautionary note, recorded because it nearly became a false claim.** An earlier "after" run
> scored 0.98 with LCP 1.50 s — three consecutive runs. It was measured against a server left over
> from a different build. Re-measured properly, the same code scored 0.88. **An A-B-A comparison
> caught it; an A-B comparison would have shipped a 0.08-point improvement that did not exist.**

## What is left

The remaining gap is main-thread work, and closing it means shipping less JavaScript to the client or
letting the hero paint before hydration. That is a scoped piece of work, not a patch, and guessing at
it is exactly what the last three attempts did.

**PERF-02 (#94) records the target as not met**, with the measurements above, rather than being
closed on a fourth guess or quietly carried a fourth time.
