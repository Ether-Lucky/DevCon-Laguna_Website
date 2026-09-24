/**
 * The payload the fixture portal serves (TEST-01).
 *
 * Kept apart from the server so the test suite can import the data without
 * starting a second copy of the server — importing the server module binds its
 * port, which is exactly the mistake this split fixes.
 */

const STORAGE = 'https://vdqczedgmehendqqifgs.supabase.co/storage/v1/object/public';

/**
 * Dates are fixed and absurd on purpose.
 *
 * "Upcoming" is a property under test, so the dates have to sit on the right
 * side of now — but they must also be **identical in every process**. The first
 * version computed them from `Date.now()` at import time, which gave the site's
 * build one set of timestamps and the test run another, seconds apart, and the
 * structured-data assertion failed comparing `…:26:02.852Z` with `…:24:53.552Z`.
 *
 * A date in 2099 is upcoming for the next seventy years and a date in 2000 is
 * past forever, with no clock involved and no midnight to trip over.
 */
const FAR_FUTURE_START = '2099-05-10T00:00:00.000Z';
const FAR_FUTURE_END = '2099-05-12T00:00:00.000Z';
const LONG_PAST = '2000-03-01T00:00:00.000Z';

export const FIXTURE = {
  generated_at: '2026-09-24T00:00:00.000Z',
  officers: [
    {
      id: 'officer-1',
      name: 'Fixture President',
      title: 'President',
      term_year: 2026,
      display_order: 1,
      photo_url: `${STORAGE}/avatars/president.jpg`,
      bio: 'Leads the chapter and still mentors at every hackathon it runs.',
    },
    {
      id: 'officer-2',
      name: 'Fixture Secretary',
      title: 'Secretary',
      term_year: 2026,
      display_order: 2,
      photo_url: null,
      bio: null,
    },
    {
      // A photo on a host `next/image` will not optimise. The portal nulls these
      // now, but that guarantee lives in another codebase — this is the
      // production incident from CMS-03-BT-01, kept as data rather than a unit
      // test.
      id: 'officer-3',
      name: 'Fixture Treasurer',
      title: 'VP for Finance',
      term_year: 2026,
      display_order: 3,
      photo_url: 'https://media.tenor.com/gzMIpUy6gBEAAAAM/not-a-real-photo.gif',
      bio: '   ',
    },
  ],
  events: [
    {
      id: 'event-upcoming',
      // The canonical address, plus a short link an officer added because slugs
      // come from titles and titles are long (EVENTS-04).
      slug: 'fixture-hackathon-with-a-very-long-title',
      slug_aliases: ['fixture-hack'],
      title: 'Fixture Hackathon',
      description: 'Two days of building.\n\nBring a laptop and a team.',
      location: 'Los Baños, Laguna',
      category: 'hackaton',
      start_date: FAR_FUTURE_START,
      end_date: FAR_FUTURE_END,
      cover_image_url: `${STORAGE}/events/hackathon.jpg`,
    },
    {
      id: 'event-tba',
      slug: 'fixture-meetup',
      slug_aliases: [],
      title: 'Fixture Meetup',
      description: null,
      // The shape the portal's first real event arrived in: a map link where a
      // venue name belongs (EVENTS-05).
      location: 'https://maps.app.goo.gl/p5JtSzfv5ngZtFVZ6',
      category: 'community',
      start_date: null,
      end_date: null,
      cover_image_url: null,
    },
    {
      id: 'event-past',
      // Created before the portal added slugs: its id is still its address, and
      // every link shared for it has to keep working.
      slug: null,
      slug_aliases: [],
      title: 'Fixture Workshop',
      description: 'Already happened.',
      location: 'Calamba, Laguna',
      category: 'workshop',
      start_date: LONG_PAST,
      end_date: LONG_PAST,
      cover_image_url: null,
    },
  ],
  images: [
    { id: 'img-1', slot: 'hero-desktop', image_url: `${STORAGE}/landing/hero-desktop.png`, alt: 'Fixture hero', label: null, display_order: 1 },
    { id: 'img-2', slot: 'hero-mobile', image_url: `${STORAGE}/landing/hero-mobile.png`, alt: 'Fixture hero on a phone', label: null, display_order: 1 },
    { id: 'img-3', slot: 'bottom', image_url: `${STORAGE}/landing/banner.jpg`, alt: 'Fixture banner', label: null, display_order: 1 },
    // `who-we-are-carousel` and `what-we-do` are left empty on purpose: the
    // per-slot fallback is the rule worth proving, and a payload where every
    // slot is filled cannot show it.
  ],
};
