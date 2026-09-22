# DevConnect Portal Integration

The landing page's content comes from the **DevConnect Portal**, the organisation's existing
site, rather than from a CMS of its own. Officers already sign in there and the data already
lives there, so a second content system would have meant a second admin, a second set of logins,
and two sources of truth that quietly drift apart.

Replaces the headless-CMS approach originally planned for Sprint 3.

## Pieces

| File | Role |
|---|---|
| [`lib/portal/types.ts`](../devcon/lib/portal/types.ts) | The portal's response shapes, nullable exactly where the portal says |
| [`lib/portal/client.ts`](../devcon/lib/portal/client.ts) | Server-only fetch, caching, and failure handling |
| [`lib/portal/content.ts`](../devcon/lib/portal/content.ts) | Maps portal data to what the sections render, with fallbacks |
| [`tests/portal.spec.ts`](../devcon/tests/portal.spec.ts) | Degradation and credential-leak tests |
| [`app/api/revalidate/route.ts`](../devcon/app/api/revalidate/route.ts) | Instant publish endpoint (CMS-06) |
| [`lib/revalidate-auth.ts`](../devcon/lib/revalidate-auth.ts) | Its shared-secret check |
| [`tests/revalidate.spec.ts`](../devcon/tests/revalidate.spec.ts) | Auth branches and endpoint behaviour |

## The API

Base URL: `https://devconnect-portal-seven.vercel.app`

| Purpose | Path |
|---|---|
| Officers | `GET /api/public/officers` |
| Events | `GET /api/public/events` |
| **Both, combined** | `GET /api/public/landing` |

We use **`/landing`** only. One round trip, one cache entry, and officers and events that are
always from the same moment rather than half a minute apart.

### Authentication

An `x-api-key` header. The portal calls its variable `PUBLIC_API_KEY`; **ours is
`PORTAL_API_KEY`**, renamed deliberately — the word "public" beside a secret invites someone to
add a `NEXT_PUBLIC_` prefix, which would inline the credential into the browser bundle. Build-time
inlining has caught this team twice already; this is the version that leaks a credential.

| Response | Meaning |
|---|---|
| 401 | Our key is wrong or missing |
| 503 | The portal has not configured its own key |

### CORS does not apply to us

The portal documents an origin allowlist (`PUBLIC_SITE_ORIGINS`) for browser callers.

**We never call this API from the browser**, so our origin does not need to be on that list — and
if it was added, it should be removed. A browser fetch would ship the API key to every visitor,
and CORS would not prevent it: CORS governs who may *read* a response, not who may *see* the
request. `lib/portal/client.ts` starts with `import 'server-only'` so an accidental client import
fails the build instead of leaking the key.

## Caching

The portal responds `Cache-Control: private, no-store`, because it cannot safely cache a response
keyed on an API key it does not see. That is its decision about its own edge. Caching on ours is
ours to make:

```ts
next: { revalidate: 1800, tags: ['portal-content'] }
```

Thirty minutes, matching the requirement.

### Instant publish (CMS-06)

`POST /api/revalidate`, authenticated with `Authorization: Bearer <PORTAL_REVALIDATE_SECRET>`,
expires the `portal-content` tag so the next visitor gets fresh content without a redeploy.

It uses `revalidateTag(tag, { expire: 0 })`, **not** the `'max'` profile the Next.js docs recommend
for most cases. The difference was measured against a mock portal:

| Profile | First request after publish | Second request |
|---|---|---|
| `'max'` | **Old content** | New content |
| `{ expire: 0 }` | New content | New content |

`'max'` only marks content stale and refreshes it in the background, so the first visitor after a
publish still sees the old version. That is not instant. Next's own guidance for webhooks from
external systems is immediate expiry.

Design decisions:

- **The caller cannot choose what is revalidated.** Always the portal tag. A leaked secret can at
  most make the site refetch from the portal sooner.
- **An unset or short secret refuses every request (`503`)**, rather than falling open. Secrets
  under 32 characters are treated as unset.
- **Rejections do not say why.** Missing, malformed and wrong headers all return a plain `401`;
  the reason is logged server-side only, so the endpoint gives nothing away to someone probing it.
- **Constant-time comparison**, hashing both sides first so not even the length leaks.

## Graceful degradation

The portal is a separate deployment owned by a separate account. Its availability is outside this
project's control, so a landing page that breaks when someone else deploys is not an acceptable
design.

The bundled files in `lib/content/` stop being the source of truth and become the safety net.
Every one of these falls back to them:

| Condition | Behaviour |
|---|---|
| `PORTAL_API_KEY` not set | Bundled content |
| 401 / 503 / any non-2xx | Bundled content |
| Timeout (8s) or unreachable | Bundled content |
| Malformed JSON | Bundled content |
| Valid response, empty list | Bundled content — a live site with no officers is far likelier to be a portal-side mistake than an editorial choice |
| Individual entry missing required fields | That entry is dropped; the rest render |

**Verified, not assumed.** Each path was exercised by hand against a mock portal: a healthy
response renders portal officers; a wrong key falls back; and an unreachable portal falls back —
that last one **only after clearing `.next/cache`**, because the first attempt served the previous
build's cached data and would have passed while testing nothing.

That accident is worth keeping: it means a portal that goes down after a successful build keeps
serving the last known good content rather than reverting to bundled defaults.

## Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `PORTAL_API_KEY` | to use live content | The `x-api-key` credential. **Server-side secret** |
| `PORTAL_API_BASE_URL` | no | Defaults to the portal's production URL. Used to point at a mock |
| `PORTAL_REVALIDATE_SECRET` | for instant publish | Shared with the portal. **Server-side secret**, 32+ characters |

Set `PORTAL_API_KEY` in Vercel and **redeploy**. For local development put it in
`devcon/.env.local`, which is gitignored.

Without it the site runs on bundled content — deliberate, so the app is developable and testable
by anyone who does not hold the key.

## Field mapping

The portal's shapes and ours do not match one-to-one.

**Officers**

| Portal | Ours | Note |
|---|---|---|
| `title` | `role` | The portal's "title" is the position |
| `photo_url` | `img` | Nullable; the card shows initials when absent **or unrenderable** — see *Photo guard* |
| `display_order` | sort order | Not an id — ours is positional |
| — | `accent` | **No source.** Assigned by position, cycling the four brand colours. Deterministic so it is stable across renders and does not break visual regression |
| — | `width` / `height` | **Not reported.** Fixed at 960×960, which describes the square frame the avatar renders in rather than the file. The container is fixed and the image is `object-cover`, so this prevents layout shift regardless of what was uploaded |

**Events** (CMS-02)

| Portal | Ours | Note |
|---|---|---|
| `category` | `category` | One of five. `hackaton` misspelled on purpose, on both sides. Anything else → event skipped and logged |
| `start_date` / `end_date` | `date` label | `null` → **"TBA"**. Otherwise "May 10–12, 2026" style, see below |
| `cover_image_url` | `img` | Nullable, and checked against the image allowlist; a placeholder shows otherwise |
| `description`, `location` | — | Received, not rendered. The card shows title, date and category |

**Dates are formatted in Philippine time.** The portal sends UTC timestamps, and Vercel's servers
run in UTC. Formatting without an explicit time zone would put an evening event in Laguna on the
next day's date — `2026-10-01T20:00:00Z` is 04:00 on **Oct 2** in Manila. `lib/portal/format.ts`
formats in `Asia/Manila`, and a test proves it: with the zone changed to UTC, that test fails.

Labels are built from date parts rather than `Intl.DateTimeFormat#formatRange`, whose spacing and
dash characters vary between ICU versions.

**Event order is the portal's**: undated first, then newest start date first. The portal owns
that editorial choice, the same way it owns officers' `display_order`.

Images arrive as absolute Supabase Storage URLs. The host is allowlisted in `next.config.ts` as a
concrete hostname rather than `**.supabase.co` — a wildcard would survive a project migration, but
it would also trust every Supabase project in existence.

### Photo guard

The allowlist lives in `lib/remote-images.ts` and is used twice: `next.config.ts` hands it to
`next/image`, and `lib/portal/content.ts` checks every officer photo against it before rendering.
A photo on any other host is treated as **no photo**, so the card shows initials and a warning is
logged.

This exists because of a production incident. The first time live portal data reached the site,
the officers' photos were **Tenor GIF links rather than uploads**. `next/image` correctly refused
them with a `400`, and visitors saw broken images. The allowlist was right; the missing piece was
checking against it before rendering.

**Officer photos must be uploaded into the portal's Supabase storage.** A pasted link from anywhere
else will show as initials. The `[portal]` warning in the server logs names the offending URL.


---

## Change requests for the portal team

All three were delivered on 2026-09-22. The portal's own reference is `docs/public-api.md` in the portal repository.

### 1. `category` on events — ✅ delivered 2026-09-22

> Delivered with nullable dates for TBA events. The Events section reads from the portal as of CMS-02.

<details><summary>Original request</summary>


The events section colours each event's badge by category. The API returns no such field, and
none of `title`, `description` or `location` can stand in for it.

**Requested:** a `category` string on each event in `/api/public/events` and `/api/public/landing`,
constrained to these five values, which are what the landing page already styles:

```
hackaton | workshop | seminar | community | career
```

> `hackaton` is misspelled. It is kept because the site's badge colours are keyed on that exact
> string. Correcting it means changing both codebases and any saved rows together — worth doing,
> but as its own coordinated change rather than a silent fix on either side.

**Also worth raising:** `start_date` is required, so the portal cannot express an announced but
unscheduled event. Six of the nine events currently on the landing page are "TBA". Either a
nullable `start_date` or an explicit `is_tba` flag would let those exist in the portal at all.

</details>

### 2. A landing-images endpoint — ✅ delivered 2026-09-22

> `GET /api/public/landing-images`, and `images` on `/landing`. Wiring it in is CMS-04.

<details><summary>Original request</summary>


There is no endpoint for the landing page's imagery, so the hero, the Who We Are carousel, the
What We Do cards and the bottom section cannot be edited without a developer. That was the whole
of CMS-04.

**Requested:** `GET /api/public/landing-images`, same auth, returning:

```json
{
  "images": [
    {
      "id": "uuid",
      "slot": "hero-desktop",
      "image_url": "https://....supabase.co/storage/v1/object/public/landing/....jpg",
      "alt": "Descriptive text for screen readers",
      "label": "Workshops",
      "display_order": 1
    }
  ]
}
```

| Field | Notes |
|---|---|
| `slot` | One of `hero-desktop`, `hero-mobile`, `who-we-are-carousel`, `what-we-do`, `bottom` |
| `alt` | **Required, not nullable.** An accessibility requirement (NFR-05) — an image nobody can describe is usually an image the page does not need |
| `label` | Only the What We Do cards show a caption; null elsewhere |
| `display_order` | Orders images within a slot that holds several |

Some slots hold one image (the hero), others hold several (the carousel, the What We Do grid).
Both are the same shape — a set of rows sharing a slot, ordered by `display_order`.

</details>

### 3. Call our revalidation endpoint on save — ✅ delivered 2026-09-22

> The portal calls it after every officer, event or landing-image change. End-to-end confirmation on the live site is pending a real edit.

<details><summary>Original request</summary>


**Our side is built (CMS-06).** Content already refreshes within 30 minutes on its own. To make a
change appear **immediately**, the portal's admin needs to make one request after an officer or
event is saved, updated or deleted:

```http
POST https://dev-con-laguna-website-nine.vercel.app/api/revalidate
Authorization: Bearer <PORTAL_REVALIDATE_SECRET>
```

No body is needed. Responses:

| Status | Meaning |
|---|---|
| `200` `{"revalidated": true}` | Done. The next visitor gets fresh content |
| `401` | Wrong or missing secret |
| `503` | We have not configured the secret on our side |

**Fire-and-forget.** The portal should not block or fail a save on this call. If it fails, the
content still updates within 30 minutes, so the worst case is the behaviour that exists today.

**The secret is shared** between the two projects: ours as `PORTAL_REVALIDATE_SECRET`, theirs in
whatever server-side variable they choose. It must never be sent from a browser, which means the
call has to come from the portal's server code (an API route or database hook), not its admin UI.

</details>
