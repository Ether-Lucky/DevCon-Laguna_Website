/**
 * events.ts — turning the portal's events into what the site renders.
 *
 * Free of `server-only` on purpose, like `format.ts` and `officers.ts`, so the
 * rules can be tested directly rather than only through a running page. The
 * portal is a separate deployment with no test data of its own.
 */

import type { EventItem } from '@/lib/content/events';
import { formatEventDate } from './format';
import type { PortalEvent } from './types';

/** Where an event's own page lives (EVENTS-03). */
export function eventPath(id: string): string {
  return `/events/${encodeURIComponent(id)}`;
}

/**
 * One portal event as a card.
 *
 * `id` stays a card-local number because the bundled placeholders use numbers
 * and the carousel keys on it. The portal's own id rides along in `portalId`,
 * which is what the detail page's URL is built from — and what tells a card it
 * has a page to link to at all.
 *
 * `photo` arrives already checked against the image allowlist: deciding whether
 * a remote image is renderable belongs with the images, not here.
 */
export function toEventItem(
  event: PortalEvent,
  index: number,
  photo: string | undefined,
): EventItem {
  return {
    id: index + 1,
    title: event.title,
    date: formatEventDate(event.start_date, event.end_date),
    category: event.category,
    img: photo,
    portalId: event.id,
  };
}

/**
 * The event with this id, or undefined.
 *
 * Undefined is the honest answer for both "no such event" and "the portal did
 * not answer": the detail page turns either into a 404, because a page that
 * cannot show the event it promised is not a page.
 */
export function findEvent(events: PortalEvent[], id: string): PortalEvent | undefined {
  return events.find((event) => event.id === id);
}
