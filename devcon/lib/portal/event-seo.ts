/**
 * event-seo.ts — what search engines are told about an event (SEO-05).
 *
 * Pure and free of `server-only`, like the other portal modules, so the shapes
 * can be asserted directly. Structured data is exactly the kind of code that
 * rots silently: nothing on the page changes when it goes wrong.
 */

import { TBA_LABEL, formatEventDate } from './format';
import { eventPath, locationUrl } from './events';
import type { PortalEvent } from './types';

/** How long a description may be before it is cut for a meta description. */
const DESCRIPTION_LIMIT = 155;

/**
 * The page title for an event.
 *
 * The site's template appends the site name, so this is the event alone.
 */
export function eventTitle(event: PortalEvent): string {
  return event.title;
}

/**
 * The meta description: the event's own words where it has them.
 *
 * Falls back to a sentence built from what the portal always sends — the
 * category, the date and the location — rather than the site's generic
 * description, which would make every event page identical in search results
 * and is what SEO-04 was raised about in the first place.
 *
 * Cut on a word boundary with an ellipsis, so the snippet does not end
 * mid-word.
 */
export function eventDescription(event: PortalEvent): string {
  const own = event.description?.trim();
  if (own) return truncate(own.replace(/\s+/g, ' '), DESCRIPTION_LIMIT);

  const when = formatEventDate(event.start_date, event.end_date);
  const date = when === TBA_LABEL ? 'Date to be announced' : when;
  return `${event.title} — a DevCon Laguna ${event.category} event in ${event.location}. ${date}.`;
}

function truncate(text: string, limit: number): string {
  if (text.length <= limit) return text;
  const cut = text.slice(0, limit);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > limit / 2 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
}

/** The absolute URL of an event's page. */
export function eventUrl(siteUrl: string, event: PortalEvent): string {
  return `${siteUrl}${eventPath(event)}`;
}

/**
 * schema.org `Event` data, or **null for an event with no date**.
 *
 * That null is a deliberate choice, not an oversight. `startDate` is required
 * for an Event to be usable by search engines, and the portal publishes events
 * whose date is still to be announced. Emitting an Event without a start date
 * would be invalid structured data, and inventing one would be a lie told to
 * search engines about a date the organisers have not set. Saying nothing until
 * the date exists is the only honest option, and the page itself still says
 * "TBA" to readers.
 *
 * Fields the portal has not provided are left out rather than filled with
 * empty strings: an absent property and a blank one mean different things to a
 * consumer.
 */
export function eventJsonLd(
  event: PortalEvent,
  siteUrl: string,
  organizationName: string,
): Record<string, unknown> | null {
  if (!event.start_date) return null;

  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    startDate: event.start_date,
    url: eventUrl(siteUrl, event),
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    // A `location` that is a URL is a link to a map, not the venue's name
    // (EVENTS-05). Publishing it as `name` would tell search engines the place
    // is called `https://maps.app.goo.gl/…`, which is worse than saying nothing:
    // the field is optional, a wrong value is not.
    ...(locationUrl(event.location)
      ? {}
      : {
          location: {
            '@type': 'Place',
            name: event.location,
            address: {
              '@type': 'PostalAddress',
              addressLocality: event.location,
              addressRegion: 'Laguna',
              addressCountry: 'PH',
            },
          },
        }),
    organizer: {
      '@type': 'Organization',
      name: organizationName,
      url: siteUrl,
    },
  };

  if (event.end_date) data.endDate = event.end_date;
  if (event.description?.trim()) data.description = event.description.trim();
  if (event.cover_image_url) data.image = event.cover_image_url;

  return data;
}
