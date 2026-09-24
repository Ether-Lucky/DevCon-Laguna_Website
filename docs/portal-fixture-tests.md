# Testing against a portal that answers

How the suite covers the path where the DevConnect Portal returns data, and why it needed a second
copy of the site (TEST-01, #172).

## The gap this closes

Every portal feature was verified the same way: build it, mock the portal on a laptop, look at the
page, revert the mock. CMS-02, CMS-04, OFFICER-03, EVENTS-03 and SEO-05 all say some version of
*"verified by hand against a mock portal"*.

What CI tested was the **opposite situation**. It runs with no `PORTAL_API_KEY`, so every section
falls back to its bundled content. That is a real case worth testing — and it is the only one that
was tested, for three sprints.

The moment the portal team adds their first event, the live site leaves that path permanently.

## How it works

Three servers, started together by Playwright:

| Port | What it is |
|---|---|
| `3999` | **The fixture portal.** Plain Node, no dependencies, serving `/api/public/landing` |
| `3000` | The site with **no portal configured** — the fallback path, and every existing test |
| `3100` | The site **pointed at the fixture** — the `portal-data` project |

The `portal-data` Playwright project runs `tests/portal-data.spec.ts` against `3100`; every other
project ignores that file, and it ignores them.

### The fixture rejects an unauthenticated request

`/api/public/landing` answers `401` without the right `x-api-key`. That is not decoration: a site
that stopped sending the key would otherwise fall back silently and every assertion would still pass
against bundled content. **Verified** by removing the header from the client — 14 of 19 tests fail.

### Why the second site is a second build

The homepage is prerendered. Serving the first build from another port would serve that build's
**fallback HTML**, whatever the runtime environment says — which is exactly how the first version of
this suite appeared to work while testing nothing.

So the fixture instance runs its own `next build` with the portal configured, into `.next-portal`
(`NEXT_DIST_DIR`). The two builds run in parallel and never share an output directory.

### The dist directory is deleted before each build

Next keeps its fetch cache there, and the portal fetch is cached for 30 minutes. After a change to
the fixture, a rebuild would otherwise serve **the previous payload**, and the suite would be
asserting against data nobody is serving any more. That cost an hour before it was understood.

## Two rules for the fixture data

**Dates are fixed and absurd.** `2099` for upcoming, `2000` for past. The first version computed
them from `Date.now()` at import time, which gave the site's build one set of timestamps and the test
run another a few seconds later:

```
Expected: "2026-10-24T02:26:02.852Z"
Received: "2026-10-24T02:24:53.552Z"
```

A date seventy years out is upcoming with no clock involved and no midnight to trip over.

**The suite reads the payload from the server, not from the module.** Importing it would compute a
second copy in a second process — the same mistake in a different costume.

## What the fixture deliberately contains

| Record | Why it is there |
|---|---|
| An officer with a bio | The bio renders |
| An officer with `bio: null` | No empty paragraph under the name |
| An officer with `bio: "   "` | Whitespace is not content |
| An officer with a Tenor photo | The CMS-03-BT-01 production incident, as data: the card must show initials |
| An upcoming event | Card, link, page, `Event` structured data |
| A TBA event | "TBA" on the page, and **no** structured data |
| A past event | Hidden from the carousel, **page still answers 200**, still in the sitemap |
| Three image slots filled, two left empty | Per-slot fallback: filling every slot could never show it |

**Image URLs point at the portal's real storage host and the files do not exist**, because that host
is what the image allowlist permits. The optimizer logs `upstream image response failed` during the
run; that is expected. These tests assert on attributes, never on a rendered pixel.

## Running it

```bash
cd devcon
npx playwright test tests/portal-data.spec.ts --project=portal-data
```

The rest of the suite is unchanged and still runs against `3000`.
