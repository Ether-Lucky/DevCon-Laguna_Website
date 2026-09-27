/**
 * events.ts — turning the portal's events into what the site renders.
 *
 * Free of `server-only` on purpose, like `format.ts` and `officers.ts`, so the
 * rules can be tested directly rather than only through a running page. The
 * portal is a separate deployment with no test data of its own.
 */

import type { EventItem } from '@/lib/content/events';
import { formatEventDate, isUpcoming } from './format';
import type { PortalEvent } from './types';

/**
 * Where an event's page lives — its **canonical** address (EVENTS-03, EVENTS-04).
 *
 * The portal's slug where there is one, and the id otherwise: events created
 * before the portal added slugs have `slug: null`, and their links have to keep
 * working.
 *
 * Aliases never appear here. They are ways in, not the address.
 */
export function eventPath(event: Pick<PortalEvent, 'id' | 'slug'>): string {
  return `/events/${encodeURIComponent(event.slug ?? event.id)}`;
}

/**
 * One portal event as a card.
 *
 * `id` stays a card-local number because the bundled placeholders use numbers
 * and the carousel keys on it. The event's **canonical path** rides along in
 * `href`, which is what tells a card it has a page to link to at all — and
 * keeps the slug-or-id decision in one place rather than in the markup.
 *
 * `photo` arrives already checked against the image allowlist: deciding whether
 * a remote image is renderable belongs with the images, not here.
 */
export function toEventItem(
  event: PortalEvent,
  index: number,
  photo: string | undefined,
  now: Date = new Date(),
): EventItem {
  return {
    id: index + 1,
    title: event.title,
    date: formatEventDate(event.start_date, event.end_date),
    category: event.category,
    img: photo,
    href: eventPath(event),
    // Only a past event an officer chose to `show` can reach the carousel, and
    // it is marked so a visitor does not read it as coming up (EVENTS-06).
    past: !isUpcoming(event, now),
    labels: event.categories.map((label) => ({ name: label.name, category: label.publishes_as })),
  };
}

/**
 * The events Featured Events shows, in the portal's order (EVENTS-06).
 *
 * Each event's `landing_visibility` decides:
 *
 * - `show` — in, even if it has already happened
 * - `hide` — out, even if it is upcoming
 * - `auto` — the EVENTS-02 rule: in while upcoming or undated, out once past
 *
 * The portal's order is kept (undated first, then newest start date first). It
 * is their editorial choice, as `display_order` is for officers.
 *
 * This decides the **carousel only**. A hidden event still has its page, and
 * its sitemap entry, because a link someone shared must keep working.
 */
export function landingEvents(events: PortalEvent[], now: Date = new Date()): PortalEvent[] {
  return events.filter((event) => {
    if (event.landing_visibility === 'show') return true;
    if (event.landing_visibility === 'hide') return false;
    return isUpcoming(event, now);
  });
}

/**
 * The event this URL segment refers to, and whether the segment was its
 * canonical address.
 *
 * An event answers to three things (EVENTS-04):
 *
 * - its **slug**, the canonical address;
 * - its **id**, which every link shared before slugs existed still uses;
 * - any of its **aliases**, short links an officer added because slugs come
 *   from titles and titles are long.
 *
 * Only one of them is the address. The other two reach the event and then
 * redirect, so the page is never served at more than one URL — search engines
 * would otherwise see the same event several times and have to guess which is
 * real.
 *
 * Undefined is the honest answer for both "no such event" and "the portal did
 * not answer": the page turns either into a 404, because a page that cannot
 * show the event it promised is not a page.
 */
export function findEvent(
  events: PortalEvent[],
  identifier: string,
): { event: PortalEvent; canonical: boolean } | undefined {
  // Slug first: it is the canonical address, and checking it first means the
  // common case costs one comparison.
  const bySlug = events.find((event) => event.slug === identifier);
  if (bySlug) return { event: bySlug, canonical: true };

  const byId = events.find((event) => event.id === identifier);
  // An event with no slug is served at its id, so that *is* canonical.
  if (byId) return { event: byId, canonical: byId.slug === null };

  const byAlias = events.find((event) => event.slug_aliases.includes(identifier));
  if (byAlias) return { event: byAlias, canonical: false };

  return undefined;
}

/**
 * Whether an event's `location` is a link rather than a place (EVENTS-05).
 *
 * The field is documented as a place name, and the portal's first real event
 * arrived with a Google Maps URL in it. A URL printed under a map pin reads as
 * broken, and published as the venue's *name* in structured data it tells search
 * engines the place is called `https://maps.app.goo.gl/…`.
 *
 * Only `http` and `https` count. Anything else — `javascript:`, `data:`, a bare
 * `mailto:` — is text, because this decides what becomes a clickable link on a
 * public page from a field an officer types into.
 */
export function locationUrl(location: string): string | null {
  const trimmed = location.trim();
  if (!/^https?:\/\//i.test(trimmed)) return null;
  try {
    const url = new URL(trimmed);
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.toString() : null;
  } catch {
    return null;
  }
}

/**
 * The event in the portal, where a member signs in and registers (EVENTS-08).
 *
 * Registration is the portal's: it holds participants, volunteers and
 * attendance, and it requires an approved member account. The portal's event
 * pages are behind sign-in — a signed-out visitor who follows this lands on the
 * login screen, which is the right place for a member and the wrong one for
 * anybody else. That is why the page offers "Join" first.
 *
 * Built from the portal's `id`, not our slug: it is the portal's own address.
 */
export function portalEventUrl(portalBaseUrl: string, event: Pick<PortalEvent, 'id'>): string {
  return `${portalBaseUrl.replace(/\/+$/, '')}/events/${encodeURIComponent(event.id)}`;
}

/**
 * Whether a visitor can still take part: upcoming or undated.
 *
 * A past event shows no registration notice. `landing_visibility` has no say
 * here — an officer keeping a past event on the landing page is showcasing it,
 * not reopening it.
 */
export function isOpenForRegistration(event: Pick<PortalEvent, 'start_date' | 'end_date'>, now: Date = new Date()): boolean {
  return isUpcoming(event, now);
}
