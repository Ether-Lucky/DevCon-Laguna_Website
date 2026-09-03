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

Thirty minutes, matching the requirement. The `portal-content` tag is what will make publishing
instant once the revalidation endpoint exists — see the change requests below.

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

Set `PORTAL_API_KEY` in Vercel and **redeploy**. For local development put it in
`devcon/.env.local`, which is gitignored.

Without it the site runs on bundled content — deliberate, so the app is developable and testable
by anyone who does not hold the key.

## Field mapping

The portal's shapes and ours do not match one-to-one:

| Portal | Ours | Note |
|---|---|---|
| `title` | `role` | The portal's "title" is the position |
| `photo_url` | `img` | Nullable; the card shows initials when absent |
| `display_order` | sort order | Not an id — ours is positional |
| — | `accent` | **No source.** Assigned by position, cycling the four brand colours. Deterministic so it is stable across renders and does not break visual regression |
| — | `width` / `height` | **Not reported.** Fixed at 960×960, which describes the square frame the avatar renders in rather than the file. The container is fixed and the image is `object-cover`, so this prevents layout shift regardless of what was uploaded |

Images arrive as absolute Supabase Storage URLs. The host is allowlisted in `next.config.ts` as a
concrete hostname rather than `**.supabase.co` — a wildcard would survive a project migration, but
it would also trust every Supabase project in existence.

---

## Change requests for the portal team

Two gaps block work on this side. Both need changes in the portal's repository.

### 1. `category` on events — blocks the Events section

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

### 2. A landing-images endpoint — blocks CMS-04

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

### 3. Optional: a publish webhook

Thirty-minute caching is already implemented. To make publishing **instant**, the portal's admin
would need to call a revalidation endpoint on this site when content is saved. That endpoint does
not exist yet; when it does, it will take a shared secret and invalidate the `portal-content` tag.

Not a blocker — content still updates within half an hour without it.
