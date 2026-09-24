import { test, expect } from '@playwright/test';
import { eventDescription, eventJsonLd, eventTitle, eventUrl } from '../lib/portal/event-seo';
import { locationUrl } from '../lib/portal/events';
import type { PortalEvent } from '../lib/portal/types';

/**
 * SEO-05 (#157) — what search engines are told about an event.
 *
 * Structured data is the kind of code that rots silently: when it goes wrong,
 * nothing on the page looks different. So the shapes are asserted directly
 * rather than eyeballed, and the site-level assertions at the bottom check that
 * the sitemap still answers with the portal unconfigured — the state CI runs in.
 */

const SITE = 'https://example.test';

function portalEvent(extra: Partial<PortalEvent> = {}): PortalEvent {
  return {
    id: 'evt-1',
    slug: null,
    slug_aliases: [],
    title: 'DevCon Hackathon 2026',
    description: 'Two days of building.',
    location: 'Los Baños',
    category: 'hackaton',
    start_date: '2026-05-10T00:00:00.000Z',
    end_date: '2026-05-12T00:00:00.000Z',
    cover_image_url: null,
    ...extra,
  };
}

test.describe('SEO-05 titles and descriptions', () => {
  test('the title is the event, not the site', () => {
    expect(eventTitle(portalEvent())).toBe('DevCon Hackathon 2026');
  });

  test('the description is the event\'s own words', () => {
    expect(eventDescription(portalEvent())).toBe('Two days of building.');
  });

  test('a long description is cut on a word boundary', () => {
    const long = `${'alpha bravo charlie '.repeat(20)}end`;
    const result = eventDescription(portalEvent({ description: long }));
    expect(result.length).toBeLessThanOrEqual(156);
    expect(result.endsWith('…')).toBe(true);

    // "Cut on a word boundary" means the kept text is a prefix of the original
    // that stops where a space was — not that the ellipsis follows punctuation.
    // Asserting the prefix is what catches a cut through the middle of a word.
    const kept = result.slice(0, -1);
    expect(long.startsWith(kept)).toBe(true);
    expect(long[kept.length]).toBe(' ');
  });

  test('an event with no description still gets one of its own', () => {
    // Falling back to the site description would make every event page
    // identical in search results — the same defect SEO-04 was raised about.
    const result = eventDescription(portalEvent({ description: null }));
    expect(result).toContain('DevCon Hackathon 2026');
    expect(result).toContain('Los Baños');
    expect(result).toContain('May 10–12, 2026');
  });

  test('an undated event says so rather than showing a date label', () => {
    const result = eventDescription(portalEvent({ description: null, start_date: null, end_date: null }));
    expect(result).toContain('Date to be announced');
    expect(result).not.toContain('TBA.');
  });

  test('the URL is absolute and uses the portal id', () => {
    expect(eventUrl(SITE, portalEvent())).toBe('https://example.test/events/evt-1');
  });
});

test.describe('SEO-05 Event structured data', () => {
  test('describes the event', () => {
    const data = eventJsonLd(portalEvent(), SITE, 'DevCon Laguna');
    expect(data).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: 'DevCon Hackathon 2026',
      startDate: '2026-05-10T00:00:00.000Z',
      endDate: '2026-05-12T00:00:00.000Z',
      description: 'Two days of building.',
      url: 'https://example.test/events/evt-1',
    });
    expect(data?.location).toMatchObject({ '@type': 'Place', name: 'Los Baños' });
    expect(data?.organizer).toMatchObject({ '@type': 'Organization', name: 'DevCon Laguna' });
  });

  test('an event with no date emits nothing at all', () => {
    // `startDate` is required for search engines to use an Event. Emitting one
    // without it would be invalid, and inventing a date would tell search
    // engines something the organisers have not decided.
    expect(eventJsonLd(portalEvent({ start_date: null, end_date: null }), SITE, 'DevCon Laguna')).toBeNull();
  });

  test('absent fields are left out, not blanked', () => {
    const data = eventJsonLd(
      portalEvent({ description: null, end_date: null, cover_image_url: null }),
      SITE,
      'DevCon Laguna',
    );
    // An absent property and an empty one mean different things to a consumer.
    expect(data).not.toHaveProperty('description');
    expect(data).not.toHaveProperty('endDate');
    expect(data).not.toHaveProperty('image');
  });

  test('a whitespace-only description counts as absent', () => {
    expect(eventJsonLd(portalEvent({ description: '   ' }), SITE, 'DevCon Laguna')).not.toHaveProperty('description');
  });

  test('the payload cannot close the script tag it is written into', () => {
    // The description is text an officer typed into the portal. Serialised into
    // a <script> without escaping, "</script>" inside it would end the block
    // and everything after it would be parsed as HTML.
    const data = eventJsonLd(portalEvent({ description: '</script><img src=x onerror=alert(1)>' }), SITE, 'DevCon Laguna');
    const serialised = JSON.stringify(data).replace(/</g, '\\u003c');
    expect(serialised).not.toContain('</script>');
    expect(serialised).not.toContain('<img');
  });
});

test.describe('EVENTS-05 a location that is a link', () => {
  test('recognises http and https', () => {
    expect(locationUrl('https://maps.app.goo.gl/p5JtSzfv5ngZtFVZ6')).toBe('https://maps.app.goo.gl/p5JtSzfv5ngZtFVZ6');
    expect(locationUrl('  http://example.com/venue  ')).toBe('http://example.com/venue');
  });

  test('a place name stays a place name', () => {
    for (const place of ['Los Baños, Laguna', 'PUP Biñan CITE Building', 'Room 204', '']) {
      expect(locationUrl(place), place).toBeNull();
    }
  });

  test('no other scheme becomes a link', () => {
    // This decides what turns into a clickable link on a public page, from a
    // field an officer types into.
    for (const hostile of [
      'javascript:alert(1)',
      'data:text/html,<script>alert(1)</script>',
      'mailto:someone@example.com',
      'file:///etc/passwd',
      '//evil.example.com',
      'https:/not-really',
    ]) {
      expect(locationUrl(hostile), hostile).toBeNull();
    }
  });

  test('a URL location is left out of the structured data', () => {
    // Publishing it as the venue's `name` would tell search engines the place is
    // called `https://maps.app.goo.gl/…`. The field is optional; a wrong value
    // is not.
    const data = eventJsonLd(portalEvent({ location: 'https://maps.app.goo.gl/x' }), SITE, 'DevCon Laguna');
    expect(data).not.toHaveProperty('location');
  });

  test('a named location keeps its structured data', () => {
    const data = eventJsonLd(portalEvent({ location: 'PUP Biñan' }), SITE, 'DevCon Laguna');
    expect(data?.location).toMatchObject({ '@type': 'Place', name: 'PUP Biñan' });
  });
});

test.describe('SEO-05 on the site', () => {
  test('the sitemap still answers with the portal unconfigured', async ({ request }) => {
    // The sitemap now awaits the portal. If an unreachable portal could throw
    // here, the whole sitemap would 500 rather than list the static pages.
    const response = await request.get('/sitemap.xml');
    expect(response.status()).toBe(200);

    const xml = await response.text();
    for (const path of ['/privacy', '/terms']) {
      expect(xml, `${path} should still be listed`).toContain(path);
    }
    // No portal, so no event URLs — and no empty <url> entries either.
    expect(xml).not.toContain('/events/');
  });

  test('the homepage carries no Event structured data', async ({ request }) => {
    // Organization data belongs to the site; Event data belongs to an event.
    const html = await (await request.get('/')).text();
    expect(html).toContain('"@type":"Organization"');
    expect(html).not.toContain('"@type":"Event"');
  });
});
