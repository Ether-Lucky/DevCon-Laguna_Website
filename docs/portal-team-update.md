# DevCon Laguna Landing Page: Integration Update

**From:** DevCon Laguna Website team · **To:** DevConnect Portal team · **Date:** 2026-09-22
**Landing page:** https://dev-con-laguna-website-nine.vercel.app

Thank you. All three requests from the handoff are integrated and live on the landing page, and
your API matched your `docs/public-api.md` exactly. This note covers what we built on your data,
what we checked, and what your officers should know before they start uploading.

---

## Status

| Your change | On the landing page | Status |
|---|---|---|
| Revalidation call on save | Portal edits appear on the next page load | ✅ **Confirmed in production** |
| Officers | "Meet Our Officers" section | ✅ Live: the real roster of 12, with photos |
| Event `category` + TBA dates | "Featured Events" section | ✅ Ready. Switches over once you add events |
| Landing images | Hero, Who We Are, What We Do, bottom banner | ✅ Ready. Each slot switches over once it has images |

**Instant refresh works end to end.** An officer's title was edited in the portal and showed on the
landing page on the next load, with no redeploy. Thank you for the server-side call and the
timeout.

**Your currently empty sections are fine.** Every section, and every image slot, keeps the landing
page's built-in content until your data exists. You can populate them in any order, one at a
time, and nothing on the page will ever show a gap.

---

## How the landing page uses your data

### Officers

- Shown in **`display_order`**, ascending.
- **`title`** is shown exactly as entered. Keep one naming style across officers; the page currently
  uses "VP for …" throughout.
- **`photo_url`** is shown in a circular frame and cropped to a square. **Square, at least 960×960**,
  looks best. With no photo, the card shows the officer's initials.
- `bio` and `term_year` are received but not currently shown.

### Events

| Field | On the card |
|---|---|
| `title` | The card heading |
| `category` | A coloured badge. Any value other than the five is skipped (the event won't show) |
| `start_date` / `end_date` | A date label, e.g. **"May 10–12, 2026"**. Both `null` → **"TBA"** |
| `cover_image_url` | The card background. With none, a branded placeholder |
| `description`, `location` | Received, not currently shown |

- **Dates are shown in Philippine time.** Your UTC timestamps are converted, so an event at 8 PM in
  Laguna shows on the right day. No change needed on your side.
- **We keep your order**: TBA first, then newest start date first.
- **Past events are shown** as long as they're published. If you only want upcoming events on the
  landing page, unpublish old ones, or tell us and we can filter on our side.

### Landing images: one rule per slot

| Slot | Where it shows | Rule |
|---|---|---|
| `hero-desktop` | The hero on screens 768 px and wider | First image by `display_order` |
| `hero-mobile` | The hero on phones | First image by `display_order` |
| `who-we-are-carousel` | The "Who We Are" photo carousel | Any number, in `display_order` |
| `what-we-do` | The five-card "What We Do" grid | ⚠️ **Needs all five**. See below |
| `bottom` | The first banner in "Programs & Activities" | First image by `display_order` |

**`what-we-do` needs exactly five images.** The grid is a fixed layout of five cards. With four or
fewer, the page keeps its **whole** built-in grid rather than mixing old and new photos. With five
or more, it uses the first five by `display_order`. **The second one is the large centre card**, so
put your strongest photo there. Each card shows its `label` as a caption, so give all five a label.

**`bottom` replaces the DevCon Kids banner** in Programs & Activities. That banner's headline is
part of the artwork itself, and so is the new one's: the landing page adds no text, only a
**Join Us** button at the bottom-left and the slideshow controls at the bottom centre. Put the
banner's message into the image, keep the bottom strip clear for those, and write `alt` text that
says what the banner says, because screen readers only get the `alt`.

It's a wide banner, about **2.2 : 1** (e.g. 3008 × 1376). On phones and tablets it's shown whole,
scaled down, so keep the text large enough to read small.

---

## ⚠️ Hero images need a specific kind of artwork

Please pass this to whoever uploads, because it's the one slot where an ordinary photo looks wrong.

The hero keeps a **fixed shape** so an upload can never push the page around. Anything uploaded is
cropped to fit. That protects the layout, **not the look**:

- The built-in hero is a **cut-out collage floating in transparent space**, with a soft glow fading
  to nothing at the edges.
- The page design depends on that. The hero deliberately sits partly behind the headline and
  buttons above it, especially on phones.
- **An ordinary opaque photo puts the "Volunteer" and "Learn More" buttons on top of the photo on
  phones.** We tried it, and it doesn't look intentional.

So hero uploads should be:

| | Desktop (`hero-desktop`) | Mobile (`hero-mobile`) |
|---|---|---|
| Format | Transparent **PNG or WebP** | Transparent **PNG or WebP** |
| Size | At least **2048 × 2036** | At least **786 × 1194** (portrait) |
| Composition | Subject in the middle; edges empty | Subject in the **middle third**; top and bottom empty |

Use **the same scene in both**: the page uses a single description for the pair, the desktop
one. The other slots have no such constraint, and ordinary photos crop cleanly in them.

---

## Data rules: thank you, and please keep them

Your safety nets match what we asked for, and the landing page relies on them.

1. **No test data in the public API.** A test account was once shown to the public on the live
   landing page. We have no way to tell a test record from a real one on our side.
2. **Images only from your storage.** The landing page only displays images from
   `vdqczedgmehendqqifgs.supabase.co/storage/v1/object/public/…`.
   > **If you ever move to a different Supabase project, tell us first.** The new host has to be
   > allowed on our side, or every photo on the landing page will disappear.
3. **Don't rename or remove fields without telling us.** Adding fields is always fine. Renaming or
   removing one we use (`name`, `title`, `display_order`, `photo_url`, `category`, `start_date`,
   `slot`, `image_url`, `alt`, …) silently removes content from the landing page.
4. **Alt text on every landing image.** Your database already requires it. We skip any image that
   arrives without it, so an image missing alt text won't appear.

---

## Good to know

- **Caching.** The landing page caches your data for 30 minutes. Your revalidation call makes edits
  immediate. If that call ever fails, an edit still appears within about 30 minutes, on the first
  visit after that window.
- **CORS.** The landing page only ever calls your API from its server. If our domain was added to
  `PUBLIC_SITE_ORIGINS` for us, it isn't needed and can be removed.
- **Your data can't break our page.** If your API is down, slow, or returns something unexpected,
  the landing page shows its built-in content for that section. You can deploy freely.

---

## What's next from your side

1. **Add the real events**, including TBA ones, with categories and cover images.
2. **Upload landing images** as officers are ready, following the hero guidance above, with
   **all five** What We Do images.
3. **Keep us posted** before any change to field names, slots, categories, or the Supabase project.

Tell us when events and images are in, and we'll check them on the live landing page and confirm
each section has switched over.
