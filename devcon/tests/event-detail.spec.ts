import { test, expect } from '@playwright/test';
import { eventPath, findEvent, landingEvents, toEventItem } from '../lib/portal/events';
import { parseEvents } from '../lib/portal/parse';
import { events as bundledEvents } from '../lib/content/events';
import type { PortalEvent } from '../lib/portal/types';

/**
 * EVENTS-03 (#156) — a page for each event.
 *
 * The mapping and lookup rules are tested directly, as CMS-04's slot rules are.
 * The page-level tests run against the site as CI serves it: with no
 * `PORTAL_API_KEY`, the portal is unconfigured, which is also the shape of "the
 * portal is unreachable" — the case that decides whether this new route can
 * take the rest of the site down with it.
 */

function portalEvent(extra: Partial<PortalEvent> = {}): PortalEvent {
  return {
    id: '11111111-2222-3333-4444-555555555555',
    slug: null,
    slug_aliases: [],
    landing_visibility: 'auto',
    title: 'DevCon Hackathon 2026',
    description: 'Two days of building.',
    location: 'Los Baños, Laguna',
    category: 'hackaton',
    start_date: '2026-05-10T00:00:00.000Z',
    end_date: '2026-05-12T00:00:00.000Z',
    cover_image_url: null,
    ...extra,
  };
}

test.describe('EVENTS-03 the link a card points at', () => {
  test('a portal event carries its canonical path, not the card index', () => {
    // The card's own `id` is a position used as a React key; the URL has to
    // come from the portal or the link breaks the moment the order changes.
    const item = toEventItem(portalEvent(), 0, undefined);
    expect(item.id).toBe(1);
    expect(item.href).toBe('/events/11111111-2222-3333-4444-555555555555');
  });

  test('an event with a slug is addressed by its slug', () => {
    const item = toEventItem(portalEvent({ slug: 'devcon-hackathon-2026' }), 0, undefined);
    expect(item.href).toBe('/events/devcon-hackathon-2026');
  });

  test('the bundled placeholders have no portal id, so they link nowhere', () => {
    // They have no description and no location: a page for one would show
    // exactly what the card already shows. An anchor that adds nothing is a
    // promise of more.
    for (const event of bundledEvents) {
      expect(event.href, `${event.title} should not link`).toBeUndefined();
    }
  });

  test('identifiers are escaped into the path', () => {
    expect(eventPath({ id: 'a b/c', slug: null })).toBe('/events/a%20b%2Fc');
    expect(eventPath({ id: 'x', slug: 'a b/c' })).toBe('/events/a%20b%2Fc');
  });
});

test.describe('EVENTS-03 finding an event', () => {
  const events = [portalEvent(), portalEvent({ id: 'other', title: 'Web Dev Workshop' })];

  test('finds the event with that id, and says the id is its address', () => {
    const match = findEvent(events, 'other');
    expect(match?.event.title).toBe('Web Dev Workshop');
    // Neither fixture event has a slug, so the id *is* canonical.
    expect(match?.canonical).toBe(true);
  });

  test('a slug is canonical, and an id or alias is not', () => {
    const slugged = [
      portalEvent({ id: 'evt', slug: 'the-slug', slug_aliases: ['short'] }),
    ];
    expect(findEvent(slugged, 'the-slug')?.canonical).toBe(true);
    expect(findEvent(slugged, 'evt')?.canonical).toBe(false);
    expect(findEvent(slugged, 'short')?.canonical).toBe(false);
    // All three reach the same event; only one is where it is served.
    for (const identifier of ['the-slug', 'evt', 'short']) {
      expect(findEvent(slugged, identifier)?.event.id, identifier).toBe('evt');
    }
  });

  test('an unknown id finds nothing', () => {
    // Undefined is what the page turns into a 404, so this is the 404's source.
    expect(findEvent(events, 'no-such-event')).toBeUndefined();
    expect(findEvent([], '11111111-2222-3333-4444-555555555555')).toBeUndefined();
  });
});

test.describe('EVENTS-06 the portal chooses what the landing page shows', () => {
  const now = new Date('2026-09-27T04:00:00.000Z');
  const upcoming = { start_date: '2026-12-01T00:00:00.000Z', end_date: '2026-12-01T00:00:00.000Z' };
  const past = { start_date: '2026-05-29T02:00:00.000Z', end_date: '2026-05-29T02:00:00.000Z' };
  const tba = { start_date: null, end_date: null };

  const titles = (events: PortalEvent[]) => landingEvents(events, now).map((event) => event.title);

  test('auto is the rule the site always followed', () => {
    expect(
      titles([
        portalEvent({ title: 'Upcoming', ...upcoming }),
        portalEvent({ title: 'Undated', ...tba }),
        portalEvent({ title: 'Past', ...past }),
      ]),
    ).toEqual(['Upcoming', 'Undated']);
  });

  test('show keeps a past event on the landing page', () => {
    expect(titles([portalEvent({ title: 'Past highlight', landing_visibility: 'show', ...past })])).toEqual([
      'Past highlight',
    ]);
  });

  test('hide keeps an upcoming or undated event off it', () => {
    expect(
      titles([
        portalEvent({ title: 'Upcoming', landing_visibility: 'hide', ...upcoming }),
        portalEvent({ title: 'Undated', landing_visibility: 'hide', ...tba }),
      ]),
    ).toEqual([]);
  });

  test("keeps the portal's order", () => {
    // Undated first, then newest start date first, is the portal's editorial
    // choice. Showing a past event must not reshuffle it.
    const order = ['Undated', 'Upcoming', 'Past highlight'];
    expect(
      titles([
        portalEvent({ title: 'Undated', ...tba }),
        portalEvent({ title: 'Upcoming', ...upcoming }),
        portalEvent({ title: 'Past highlight', landing_visibility: 'show', ...past }),
      ]),
    ).toEqual(order);
  });

  test('a past event on the card is marked past, an upcoming one is not', () => {
    expect(toEventItem(portalEvent(past), 0, undefined, now).past).toBe(true);
    expect(toEventItem(portalEvent(upcoming), 0, undefined, now).past).toBe(false);
    expect(toEventItem(portalEvent(tba), 0, undefined, now).past).toBe(false);
  });

  test('absent or unknown visibility means auto, never hide', () => {
    // Until the portal ships the field, and for any value we do not recognise,
    // the site must behave exactly as it did before. An unknown value must never
    // hide an event nobody asked to hide.
    const base = { id: 'e', title: 'E', category: 'workshop', ...upcoming };
    for (const raw of [undefined, null, '', 'SHOW', 'visible', 1, true]) {
      const [parsed] = parseEvents([{ ...base, landing_visibility: raw }]);
      expect(parsed.landing_visibility, JSON.stringify(raw)).toBe('auto');
    }
    for (const value of ['auto', 'show', 'hide'] as const) {
      const [parsed] = parseEvents([{ ...base, landing_visibility: value }]);
      expect(parsed.landing_visibility).toBe(value);
    }
  });
});

test.describe('EVENTS-03 on the site', () => {
  test('an unknown event is a 404, not a redirect', async ({ request }) => {
    const response = await request.get('/events/no-such-event', { maxRedirects: 0 });
    // A redirect to the homepage would tell a visitor their link worked.
    expect(response.status()).toBe(404);
  });

  test('a strange id is still a 404 rather than an error', async ({ request }) => {
    // `..` is deliberately not in this list: the HTTP client normalises
    // `/events/..` to `/` before the request is sent, so it tests the client
    // rather than the route.
    for (const id of ['%20', 'null', '0', 'undefined', 'a'.repeat(300)]) {
      const response = await request.get(`/events/${id}`);
      expect([404], `/events/${id} returned ${response.status()}`).toContain(response.status());
    }
  });

  test('the events section still renders when no event has a page', async ({ page }) => {
    await page.goto('/');
    // With the portal unconfigured the bundled placeholders show, and none of
    // them links. The section must still be there: the new route must not
    // become a new way for the homepage to break.
    await expect(page.getByRole('heading', { name: 'Featured Events' })).toBeVisible();
    const cards = page.locator('#events h3');
    expect(await cards.count()).toBeGreaterThan(0);
    expect(await page.locator('#events a[href^="/events/"]').count()).toBe(0);
  });
});
