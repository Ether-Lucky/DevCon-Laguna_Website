# Visual Regression Testing

How the visual suite works, and how to approve a visual change.

## The rule

**CI compares against committed baselines. It never rewrites them automatically.**

Previously the CI job ran with `--update-snapshots`, which rewrites the baseline
instead of comparing against it. Every run accepted whatever the page happened to look
like and reported success, so the job could not detect a regression — which was its only
purpose. It is now split into two explicit paths.

| Trigger | Behaviour |
|---|---|
| Push to `prod`, or a pull request | **Compare** against the committed baselines. A visual difference fails the job. |
| Manual run with *Regenerate and commit the Linux visual baselines* checked | **Refresh** the baselines and commit them back. |

## Baselines are platform-specific

Playwright names snapshots per platform — `hero-section-chromium-linux.png` versus
`hero-section-chromium-win32.png`. CI runs on `ubuntu-latest`, so **only `-linux`
baselines are usable there**.

The previously committed baselines were all `-win32`, generated on a Windows machine, so
CI could never have compared against them even without the `--update-snapshots` flag.
They were also stale: after the UI rework in PR #70, all 8 snapshots failed. They have
been removed.

Baselines must be generated **by CI**, not locally. Font rendering and antialiasing
differ between a local machine (including WSL) and the GitHub runner, so locally
generated files will not match.

## Seeding the baselines (do this once)

There are no committed Linux baselines yet, so the **first comparison run will fail** with
missing-snapshot errors. That is expected. To seed them:

1. Go to **Actions → Playwright Tests → Run workflow**.
2. Tick **Regenerate and commit the Linux visual baselines**.
3. Run it on the target branch.

The job runs the suite with `--update-snapshots` and commits the generated
`-linux.png` files back to that branch as `chore(visual): refresh Linux baselines`.
Subsequent runs compare against them.

## Approving an intentional visual change

When a UI change is deliberate, the visual job will fail — that is correct. To accept it:

1. Confirm the diff is what you intended. The failing run uploads a
   `visual-regression-report` artifact containing the expected, actual, and diff images.
2. Trigger the workflow manually with the refresh box ticked, on your branch.
3. Review the committed baseline change in the pull request like any other diff.

Never refresh baselines to make a red build green without looking at the diff first —
that is exactly the failure mode this setup exists to prevent.

## Running locally

```bash
cd devcon
npx playwright test tests/visual.spec.ts --project=chromium
```

On a machine with no local baselines, the first run generates them and reports the tests
as failed with "snapshot not found". Local baselines carry your own platform suffix, so
they never conflict with the `-linux` files CI uses. Do not commit them.

## Coverage

Covered: full page, navbar, hero, stats, about, mission-vision, events, **officers**,
footer.

The Officers snapshot was removed in `94e664c` and has been restored — the section
renders from the content data layer and is worth protecting.

**Programs & Activities is deliberately not covered**, because the section is currently
commented out of the page. If it is restored (see #87), add a snapshot for it.
