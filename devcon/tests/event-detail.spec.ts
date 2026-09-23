import { test, expect } from '@playwright/test';
import { eventPath, findEvent, toEventItem } from '../lib/portal/events';
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
  test('a portal event carries its portal id, not the card index', () => {
    // The card's own `id` is a position used as a React key; the URL has to be
    // the portal's id or the link breaks the moment the order changes.
    const item = toEventItem(portalEvent(), 0, undefined);
    expect(item.id).toBe(1);
    expect(item.portalId).toBe('11111111-2222-3333-4444-555555555555');
  });

  test('the bundled placeholders have no portal id, so they link nowhere', () => {
    // They have no description and no location: a page for one would show
    // exactly what the card already shows. An anchor that adds nothing is a
    // promise of more.
    for (const event of bundledEvents) {
      expect(event.portalId, `${event.title} should not link`).toBeUndefined();
    }
  });

  test('ids are escaped into the path', () => {
    expect(eventPath('a b/c')).toBe('/events/a%20b%2Fc');
  });
});

test.describe('EVENTS-03 finding an event', () => {
  const events = [portalEvent(), portalEvent({ id: 'other', title: 'Web Dev Workshop' })];

  test('finds the event with that id', () => {
    expect(findEvent(events, 'other')?.title).toBe('Web Dev Workshop');
  });

  test('an unknown id finds nothing', () => {
    // Undefined is what the page turns into a 404, so this is the 404's source.
    expect(findEvent(events, 'no-such-event')).toBeUndefined();
    expect(findEvent([], '11111111-2222-3333-4444-555555555555')).toBeUndefined();
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
