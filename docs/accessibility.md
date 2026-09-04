# Accessibility

The audit, what it found, and the assertion that keeps it from drifting. Implements **A11Y-01**
(#116) — a Definition of Done criterion that had gone unverified since Sprint 1.

## Why Lighthouse was not enough

Lighthouse reported accessibility at **0.96** throughout Sprint 2, which is reassuring and was
also misleading. It runs a subset of axe rules, against one viewport, in one theme, in one state.

**Every violation found here was invisible to Lighthouse.** Seven of the nine were in the light
theme, in an interactive state, or below the fold.

## Method

`tests/a11y.spec.ts` runs axe-core against `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa` and
`best-practice`, in six states:

| | Dark | Light |
|---|---|---|
| Whole page, desktop | ✅ | ✅ |
| Contact form, error state | ✅ | ✅ |
| Mobile menu, open | ✅ | ✅ |

### One methodological trap worth recording

**The first audit reported zero violations, and was wrong.**

`ScrollReveal` renders each section at `opacity: 0` until it enters the viewport, and axe skips
elements that are not visible. An audit run at the top of the page therefore examines the hero
and almost nothing else — while five real contrast failures sat further down.

Every audit now scrolls the full page first (`revealWholePage`). Any future accessibility tooling
pointed at this site needs to do the same, or it will report a clean bill of health for a page it
never looked at.

## Findings

Nine violations, all **serious**, none critical. All fixed.

### 1. Colour contrast — six failures

| Element | Theme | Measured | Required |
|---|---|---|---|
| `--muted` body text | light | 4.47:1 | 4.5:1 |
| `--muted` body text | dark | 4.10:1 | 4.5:1 |
| Nav links (`foreground/75`) | light | 4.46:1 | 4.5:1 |
| Hero lime heading | light | **1.41:1** | 3:1 |
| Section heading accent (purple), ×5 | dark | 2.76:1 | 3:1 |
| Form error text, ×4 | light | 3.11:1 | 4.5:1 |

Three of these are near misses that a designer could not reasonably eyeball — 4.46 against 4.5.
Two are not: the brand lime on a near-white background measures **1.41:1** and is effectively
invisible, and the brand purple fails even the relaxed large-text threshold.

**The fix keeps the brand colours where they work and substitutes only where they do not.** Three
new tokens in `globals.css` resolve per theme:

| Token | Dark | Light |
|---|---|---|
| `--accent-lime` | `#C0E00B` brand, 14:1 | `#417B0E`, 4.82:1 |
| `--accent-purple` | `#8B5CF6`, 4.65:1 | `#6A0DF2` brand |
| `--accent-error` | `#E06B22` brand, 5.90:1 | `#B8500F`, 4.67:1 |

`--muted` also became theme-specific: `#8A8A89` dark, `#6B6B6A` light.

Each substitute is the same hue, moved along the lightness axis until it clears the threshold, so
light-theme accents stay green and purple rather than becoming a different colour. Every
substitute clears **4.5:1** — the body-text bar — not just the 3:1 large-text bar it strictly
needed, so a heading accent reused at a smaller size later cannot silently fall below.

> 📌 **For design review.** The light theme's lime and the dark theme's purple are visibly
> different from the brand palette. That is unavoidable: the brand values are unreadable on those
> backgrounds. If design prefers different substitutes, the only constraint is the measured ratio.

### 2. Carousels were not keyboard accessible — three failures

All three carousels — About, Events, Officers — were plain scrollable `div`s. A keyboard user
could move them only with the arrow **buttons**, and any tile scrolled out of view was
unreachable.

Fixed in `dynamic-carousel.tsx`: the track takes `tabIndex={0}`, `role="group"` and a required
accessible name, plus a visible focus ring. Native arrow-key scrolling then applies.

Each carousel is given a **distinct** name — "Featured events", "DevCon Laguna officers", "Photos
of the DevCon Laguna community". Three regions all called "Carousel" would tell a screen reader
user nothing about which one they were in.

## What was already right

Sprint 2's work held up. Nothing needed changing in: the contact form's `aria-invalid`,
`aria-describedby`, `role="alert"` and `aria-live` region; the mobile menu's `aria-expanded` and
state-dependent label; the theme toggle's label; alt text on hero and section images;
`prefers-reduced-motion` in `ScrollReveal`.

Heading order also passes with no skipped levels — axe's `heading-order` rule is part of the
`best-practice` tag included above.

## The CI assertion

The audit is not a one-off. `tests/a11y.spec.ts` runs in the existing `test` job — the workflow
discovers spec files rather than listing them, so no workflow change was needed — and fails the
build on any **critical or serious** violation.

`moderate` and `minor` violations do not fail the build. That threshold matches the Definition of
Done and keeps the gate meaningful rather than noisy; there are currently none of either.

### The gate was verified to fail

Sprint 2's most expensive lesson was a pipeline that reported green while incapable of failing.
So this gate was tested by reintroducing a real regression — reverting `--accent-purple` to the
brand value — and confirming the suite failed on it, in all three affected states, before
restoring the fix.

**A gate nobody has watched fail is not evidence of anything.**

## Keyboard coverage

Beyond axe, `tests/a11y.spec.ts` asserts directly that:

- every carousel track is focusable and uniquely named
- a focused carousel scrolls with `ArrowRight`
- the theme toggle can be operated with `Enter`
- focused elements have a visible outline or shadow — a focus state that exists but cannot be
  seen is the same as none for a sighted keyboard user

## Known gaps

- **Not tested with a real screen reader.** axe checks the markup a screen reader relies on; it
  does not check the experience. NVDA or VoiceOver on the carousels would be worth an hour.
- **Automated checks catch roughly half of accessibility issues** in general. A clean run means no
  *detectable* violations, not a guarantee.
- The audit covers the landing page and `/`-relative states only, which is currently the whole
  site.
