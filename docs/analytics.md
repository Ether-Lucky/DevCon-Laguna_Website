# Analytics

Vercel Web Analytics, wired up in **ANL-01** (#65).

## Setup

There is **no API key**. Collection has to be switched on for the project:

> Vercel → the project → **Analytics** tab → **Enable Web Analytics**

Until that is done the code runs harmlessly and reports nothing. Data appears in the dashboard
within a few minutes of the first real visit, and the ticket's acceptance window is 24 hours.

It must be enabled on the project that actually serves the site — currently the one connected
to the `laguna-devcon` fork, **not** the abandoned `devcon-laguna-website-delta` project.

## Privacy

Vercel Web Analytics is cookieless and stores no personal data, so it needs no consent banner.
That is why it was chosen over GA4, which would have required one.

## What is collected

| Event | When |
|---|---|
| `pageview` | Every page load, automatically |
| `cta_click` | A primary call-to-action is clicked, with `id` and `label` |
| `contact_submitted` | The contact form reports a **confirmed** send |

`contact_submitted` fires only after the server confirms delivery, never on a submit attempt.
A failed send must not inflate the enquiry count, and a test enforces that.

### Tracked calls to action

| `data-analytics-id` | Where |
|---|---|
| `nav-join-us` | "Join Us" in the navigation bar |
| `hero-volunteer` | "Volunteer" in the hero |
| `hero-learn-more` | "Learn More" in the hero |

## How CTA tracking works

`components/ui/analytics-events.tsx` attaches **one delegated click listener** and reports any
element carrying `data-analytics-id`.

This is deliberate. The obvious approach — a click handler on `Button` — would make `Button` a
client component and ship JavaScript for every button on the page. PERF-03 removed 116KB of
client JS to cut LCP render delay; undoing part of that for analytics would be a poor trade.
Delegation keeps `Button` a server component.

**To track a new CTA**, pass the prop:

```tsx
<Button label="Register" href="/events" analyticsId="events-register" />
```

Nothing else is needed — the listener picks it up. Event names live in `lib/analytics.ts`, so
a typo cannot silently split a metric into two.

## ⚠️ Custom events need a Vercel Pro plan

The project is on the **Hobby (free)** plan, where Web Analytics records **pageviews only**.
`cta_click` and `contact_submitted` are accepted client-side and queued, but never recorded,
so they will not appear in the dashboard.

The instrumentation is deliberately kept anyway: it is correct, tested, and starts reporting
the moment the project moves to Pro, with no code change. But **do not treat an empty custom
event list as a bug** — on Hobby it is expected.

If event-level tracking matters before any plan upgrade, GA4 is the usual alternative: it
reports custom events on its free tier, but it uses cookies and would require a consent
banner, which is exactly why Vercel Analytics was chosen first.

## Verifying it works

The analytics script is served from a **randomised path**, not `/_vercel/insights/script.js` —
Vercel does this so content blockers cannot recognise it by URL. Checking for the old path
gives a false negative.

To confirm: open DevTools → Network, filter for the hash in the script URL, and reload. A
`script.js` returning **200** means the integration is live.

Two things will stop data appearing even when the code is correct:

- **The deployment predates enabling Analytics.** The routes are provisioned at deploy time, so
  enabling it does not retrofit a running deployment — redeploy.
- **Automated traffic is filtered.** Vercel excludes bot and scripted sessions by design, so a
  headless browser cannot be used to confirm a counted pageview. That check needs a real visit.

## Cost

`@vercel/analytics` adds about **20KB** to the client bundle (676KB → 696KB). Worth watching if
the Lighthouse performance median, currently around 0.90, starts slipping — see
[quality-gates.md](./quality-gates.md).

## Only loaded on Vercel

`<Analytics />` is rendered only when `VERCEL` is set (`lib/analytics-config.ts`). Vercel sets
it on every production and preview deployment it hosts, and nowhere else sets it.

It used to render everywhere. Its script path, `/_vercel/insights/script.js`, exists only on
Vercel, so **every load in CI and local builds answered 404 and logged a console error**. That
failed Lighthouse's *errors-in-console* audit, costing Best Practices points. It also meant a
genuine console error always arrived next to one everybody had learned to ignore
(ANL-01-BT-01, #135).

CTA and contact tracking are unaffected. `track()` queues into `window.va` whether or not the
script loaded; the events simply aren't delivered outside Vercel, which was already the case.

## Testing

`tests/analytics.spec.ts` installs a `window.va` stub before page scripts run and captures
exactly what would be reported, so the suite asserts real behaviour without sending live data.
The collection endpoint only exists on Vercel deployments.

**Pageviews are not tested in CI.** The test that checked `<Analytics />` reported one was
replaced when the component stopped rendering outside Vercel. It was testing Vercel's library
rather than this project, and it was one of the two flaky WebKit tests in #130. The suite now
tests the rule this project owns: load on Vercel, and nowhere else. Pageviews themselves are
verified on the production deployment. `tests/regression.spec.ts` asserts that a full page load
logs no console errors and no failed same-origin requests.

One note for anyone extending these tests: an ad blocker does **not** make `window.va` throw —
the package installs its own queue stub, so `va` always exists. A blocker simply prevents the
script loading, and queued events are never delivered. Simulating a throwing `va` tests a
situation that does not occur, and breaks the page in a way reality does not.
