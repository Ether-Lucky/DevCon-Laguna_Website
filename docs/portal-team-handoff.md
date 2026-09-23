# Handoff: DevConnect Portal ↔ DevCon Laguna Landing Page

**From:** DevCon Laguna Website team · **To:** DevConnect Portal team
**Landing page:** https://dev-con-laguna-website-nine.vercel.app

The DevCon Laguna landing page now takes its content from the portal's public API, instead of
keeping its own copy. That means officers can edit the site from the portal admin they already
use, without a developer or a redeploy.

The officers section is **live and working** on your data today. Three pieces need work on your
side to finish the job. They're listed in order of effort, smallest first.

---

## What already works

- The landing page calls `GET /api/public/landing` with `x-api-key`, **server-side only**. The key
  never reaches a browser.
- **Officers** render from your data, sorted by `display_order`.
- Responses are cached on our side for **30 minutes**. You don't need to cache anything.
- If your API is down, slow (over 8 seconds), returns an error, or returns an empty list, the page
  falls back to its own built-in content. Your outages can't break our page.

**CORS:** we never call your API from a browser, so our domain **doesn't need to be in
`PUBLIC_SITE_ORIGINS`**. If you added it for us, you can safely remove it.

---

## Request 1 — Tell us when content changes *(small)*

**Why:** without this, an edit in the portal can take up to **30 minutes** to appear on the landing
page. With it, the edit appears for the next visitor.

**Our side is done.** When an officer or event is **created, updated or deleted**, make one
request from your **server code**:

```http
POST https://dev-con-laguna-website-nine.vercel.app/api/revalidate
Authorization: Bearer <shared secret>
```

No body. The shared secret is being sent to you **separately and privately**. Store it as a
server-side environment variable in your Vercel project (the name is up to you, e.g.
`LANDING_REVALIDATE_SECRET`).

```ts
// After a successful save of an officer or event
await fetch('https://dev-con-laguna-website-nine.vercel.app/api/revalidate', {
  method: 'POST',
  headers: { Authorization: `Bearer ${process.env.LANDING_REVALIDATE_SECRET}` },
  signal: AbortSignal.timeout(5000),
}).catch(() => {}); // never fail a save because of this call
```

| Response | Meaning |
|---|---|
| `200` `{"revalidated": true}` | Done |
| `401` | Wrong or missing secret |
| `503` | Not configured on our side (tell us) |

**Requirements**

- **Server-side only.** If this runs in the browser, the secret is exposed to anyone who opens
  the admin.
- **Never let it fail a save.** If the call fails, the change still appears within 30 minutes.
- **Await it with a timeout**; don't fire it off without waiting. Vercel may stop a function as
  soon as it returns a response. If you're on Next.js, `after()` from `next/server` is a clean way
  to run it.

**Done when:** saving an officer in the portal changes the landing page on the next page load.

---

## Request 2 — `category` on events *(small schema change)*

**Why:** this blocks moving the **Events** section to your data. Each event card shows a
colour-coded category badge, and your events have no category field.

**Add** a `category` string to each event in both `/api/public/events` and
`/api/public/landing`. It must be one of these five values:

```
hackaton | workshop | seminar | community | career
```

> ⚠️ **`hackaton` is misspelled on purpose.** The landing page's badge colours use that exact
> string. Please match it. Fixing the spelling is worth doing, but as a separate change agreed by
> both teams, because it has to happen on both sides at the same moment.

**Also needed — "TBA" events.** `start_date` is currently required, so the portal can't hold an
event that's been announced without a date. **Six of the nine events currently on the landing page
are "TBA".** Either:

- make `start_date` (and `end_date`) **nullable**, meaning "date to be announced", or
- add an `is_tba: boolean` flag.

Nullable dates are simpler for us. Either works.

**Also, cover images must be uploaded to your Supabase storage**, not linked from another site.
See *Data rules* below.

**You don't need to format dates.** We turn `start_date`/`end_date` into "May 10–12, 2026" and
similar on our side.

Resulting event shape:

```json
{
  "id": "uuid",
  "title": "DevCon Hackathon 2026",
  "description": "text or null",
  "location": "Laguna",
  "category": "hackaton",
  "start_date": "2026-05-10T00:00:00.000Z",
  "end_date": "2026-05-12T00:00:00.000Z",
  "cover_image_url": "https://vdqczedgmehendqqifgs.supabase.co/storage/v1/object/public/events/....jpg"
}
```

**Done when:** the events endpoint returns `category` on every event, and an event can exist
without a date.

---

## Request 3 — Landing page images *(the largest piece)*

**Why:** the goal is for officers to change the landing page's pictures themselves, without a
developer. **There's currently no endpoint for them at all**, so this is blocked entirely until
one exists.

It needs three things on your side: a table, storage, and a small admin screen to upload an
image to a slot.

### The endpoint

`GET /api/public/landing-images`, with the same `x-api-key` auth as your other public endpoints.
Adding the images to `/api/public/landing` as well would be ideal: one request for everything.

```json
{
  "images": [
    {
      "id": "uuid",
      "slot": "hero-desktop",
      "image_url": "https://vdqczedgmehendqqifgs.supabase.co/storage/v1/object/public/landing/....jpg",
      "alt": "DevCon Laguna members at the 2026 hackathon",
      "label": null,
      "display_order": 1
    }
  ]
}
```

| Field | Rules |
|---|---|
| `slot` | Exactly one of the five values below |
| `image_url` | Uploaded to your Supabase storage. See *Data rules* |
| `alt` | **Required, never null or empty.** A short description for screen readers. This is an accessibility requirement for the site |
| `label` | A caption. Only used by the `what-we-do` slot (e.g. "Hackathons"); `null` everywhere else |
| `display_order` | Orders images within a slot that holds several |

### The slots

| Slot | Holds | Where it appears |
|---|---|---|
| `hero-desktop` | 1 image | Main banner on wide screens |
| `hero-mobile` | 1 image | Main banner on phones (cropped differently, so it's a separate image) |
| `who-we-are-carousel` | several | The photo carousel in "Who We Are" |
| `what-we-do` | several | The "What We Do" cards, each with a `label` |
| `bottom` | 1 image | The image near the bottom of the page |

Single-image and multi-image slots use the same shape: a set of rows sharing a `slot`, ordered by
`display_order`. If a slot has no images, the landing page keeps its current built-in picture, so
you can populate slots one at a time.

### The admin screen

Officers need to be able to pick a slot, upload an image, enter the alt text (**required**), and
reorder or remove images in multi-image slots. Please call **Request 1**'s revalidation endpoint
on every change here too.

**Done when:** an officer can replace the hero image from the portal admin, and the landing page
shows it.

---

## Data rules

These apply to everything in the public API. The first two have already caused a production
incident.

1. **No test data in the public API.** A test account ("bril 123 User — Test Pro") was shown to the
   public on the live landing page. Nothing on our side can tell a test account from a real one,
   so this has to be prevented where the data lives: for example, filter by a status or
   `is_test` flag in the public endpoints.
2. **Images must be uploaded to your Supabase storage**, not linked from elsewhere. Photos linked
   from Tenor showed as broken images. The landing page only displays images from
   `vdqczedgmehendqqifgs.supabase.co/storage/v1/object/public/...`. Anything else now shows
   **initials** instead of a photo.
   > If you ever move to a different Supabase project, **tell us first.** The new host has to be
   > added on our side, or every photo will show as initials.
3. **Don't rename or remove fields without telling us.** Adding fields is always fine. Renaming or
   removing one we use (`name`, `title`, `display_order`, `photo_url`, `start_date`, …) silently
   removes content from the landing page. Entries missing a required field are dropped rather than
   shown broken.

---

## Checking your work

```bash
curl -s -H "x-api-key: $PUBLIC_API_KEY" https://devconnect-portal-seven.vercel.app/api/public/landing
```

When each request ships, let us know. We'll switch the matching landing-page section over and
confirm it on the live site.

| Request | Unblocks on the landing page |
|---|---|
| 1 — Revalidation call | Instant updates for officers (live now) and everything after |
| 2 — Event `category` + TBA | The Events section |
| 3 — Landing images | Editable hero, carousel, What We Do and bottom images |
