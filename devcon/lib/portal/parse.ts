import {
  EVENT_CATEGORIES,
  LANDING_SLOTS,
  type LandingSlot,
  type PortalEvent,
  type PortalEventCategory,
  type PortalLandingImage,
  type PortalOfficer,
  type PortalPost,
} from './types';

/**
 * Narrowing for the portal's responses.
 *
 * The portal is a separate codebase on a separate deployment schedule, so what
 * it sends is untrusted input rather than a guarantee. Each parser keeps the
 * entries this site can render and drops the rest, rather than rendering a
 * blank or broken card.
 *
 * Deliberately free of `server-only` so the test suite can exercise it
 * directly, without a portal or an API key.
 */

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isNullableString(value: unknown): value is string | null {
  return value === null || typeof value === 'string';
}

export function parseOfficers(value: unknown): PortalOfficer[] {
  if (!Array.isArray(value)) return [];
  return value.filter((entry): entry is PortalOfficer => {
    if (!isRecord(entry)) return false;
    return (
      typeof entry.id === 'string' &&
      typeof entry.name === 'string' &&
      typeof entry.title === 'string' &&
      typeof entry.display_order === 'number'
    );
  });
}

function isCategory(value: unknown): value is PortalEventCategory {
  return typeof value === 'string' && (EVENT_CATEGORIES as readonly string[]).includes(value);
}

/** True for a string `Date` can read. An unparseable date is as unrenderable as a missing title. */
function isDateString(value: unknown): value is string {
  return typeof value === 'string' && !Number.isNaN(Date.parse(value));
}

/**
 * Events the section can render.
 *
 * Dropped, and logged so the data can be fixed at source:
 * - a missing id or title
 * - a `category` outside the five the badge colours exist for. The portal's
 *   database constrains this today; a sixth category added there without the
 *   landing page knowing would otherwise render as an uncoloured badge.
 * - a date that is present but unparseable
 *
 * **Null dates are kept** — they mean "TBA". The portal promises start and end
 * are both set or both null; if only one arrives, the event is still shown,
 * treated as a single-day event on the date that is present.
 */
export function parseEvents(value: unknown): PortalEvent[] {
  if (!Array.isArray(value)) return [];

  const events: PortalEvent[] = [];
  for (const entry of value) {
    if (!isRecord(entry) || typeof entry.id !== 'string' || typeof entry.title !== 'string') continue;

    if (!isCategory(entry.category)) {
      console.warn(`[portal] event "${entry.title}" has an unknown category and was skipped: ${String(entry.category)}`);
      continue;
    }

    const start = entry.start_date;
    const end = entry.end_date;
    if (!isNullableString(start) || !isNullableString(end) || (start !== null && !isDateString(start)) || (end !== null && !isDateString(end))) {
      console.warn(`[portal] event "${entry.title}" has an unreadable date and was skipped.`);
      continue;
    }

    events.push({
      id: entry.id,
      // The portal promises a string or null, and an array. That promise lives
      // in another codebase, so anything else is treated as absent rather than
      // rendered into a URL (EVENTS-04).
      slug: typeof entry.slug === 'string' && entry.slug.length > 0 ? entry.slug : null,
      slug_aliases: Array.isArray(entry.slug_aliases)
        ? entry.slug_aliases.filter((alias): alias is string => typeof alias === 'string' && alias.length > 0)
        : [],
      title: entry.title,
      description: typeof entry.description === 'string' ? entry.description : null,
      location: typeof entry.location === 'string' ? entry.location : '',
      category: entry.category,
      start_date: start ?? end,
      end_date: end ?? start,
      cover_image_url: typeof entry.cover_image_url === 'string' ? entry.cover_image_url : null,
    });
  }
  return events;
}

/**
 * Posts the news section can render (NEWS-02).
 *
 * Dropped, and logged so the data can be fixed at source:
 * - a missing id, slug, title or body — each is the post's URL, heading or
 *   content, and none of them has a sensible default
 * - a `published_at` that is missing or unreadable, because it is both the date
 *   shown and the order posts are listed in
 *
 * A missing `excerpt` or `cover_image_url` is normal and handled at render.
 */
export function parsePosts(value: unknown): PortalPost[] {
  if (!Array.isArray(value)) return [];

  const posts: PortalPost[] = [];
  for (const entry of value) {
    if (!isRecord(entry)) continue;

    const required = [entry.id, entry.slug, entry.title, entry.body];
    if (required.some((field) => typeof field !== 'string' || field.trim().length === 0)) {
      console.warn(`[portal] a post is missing an id, slug, title or body and was skipped.`);
      continue;
    }

    if (!isDateString(entry.published_at)) {
      console.warn(`[portal] post "${String(entry.title)}" has an unreadable published_at and was skipped.`);
      continue;
    }

    posts.push({
      id: entry.id as string,
      slug: entry.slug as string,
      title: entry.title as string,
      body: entry.body as string,
      excerpt: typeof entry.excerpt === 'string' && entry.excerpt.trim().length > 0 ? entry.excerpt.trim() : null,
      cover_image_url: typeof entry.cover_image_url === 'string' ? entry.cover_image_url : null,
      published_at: entry.published_at,
    });
  }
  return posts;
}

function isSlot(value: unknown): value is LandingSlot {
  return typeof value === 'string' && (LANDING_SLOTS as readonly string[]).includes(value);
}

/**
 * Landing page images the page can place (CMS-04).
 *
 * Dropped, and logged: an unknown slot (nowhere to put it), a missing URL, or
 * **empty alt text**. The portal's database already rejects an image without
 * alt text; this holds the same line on our side, because an image with no
 * description is an accessibility failure (NFR-05) on a page that has been
 * audited clean.
 */
export function parseLandingImages(value: unknown): PortalLandingImage[] {
  if (!Array.isArray(value)) return [];

  const images: PortalLandingImage[] = [];
  for (const entry of value) {
    if (!isRecord(entry) || typeof entry.id !== 'string') continue;

    if (!isSlot(entry.slot)) {
      console.warn(`[portal] landing image ${entry.id} has an unknown slot and was skipped: ${String(entry.slot)}`);
      continue;
    }
    if (typeof entry.image_url !== 'string' || entry.image_url.length === 0) continue;
    if (typeof entry.alt !== 'string' || entry.alt.trim().length === 0) {
      console.warn(`[portal] landing image ${entry.id} (${entry.slot}) has no alt text and was skipped.`);
      continue;
    }

    images.push({
      id: entry.id,
      slot: entry.slot,
      image_url: entry.image_url,
      alt: entry.alt.trim(),
      label: typeof entry.label === 'string' && entry.label.trim() ? entry.label.trim() : null,
      display_order: typeof entry.display_order === 'number' ? entry.display_order : 0,
    });
  }
  return images;
}
