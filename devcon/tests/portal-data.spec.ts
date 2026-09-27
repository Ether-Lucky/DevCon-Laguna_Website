import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { team } from '../lib/content/officers';
import { events as bundledEvents } from '../lib/content/events';
import type { PortalLanding } from '../lib/portal/types';

/**
 * TEST-01 (#172) — the site running against a portal that answers.
 *
 * Every portal feature so far was verified the same way: mock the portal
 * locally, look at the page, revert the mock. What CI tested was the opposite
 * situation — no `PORTAL_API_KEY`, every section falling back to bundled
 * content. The path a visitor will be on permanently, a day after the portal
 * team adds their content, had no automated coverage at all.
 *
 * These run against a second instance of the site (port 3100) pointed at the
 * fixture portal. The fixture **rejects a request without the API key**, so a
 * site that stopped sending it would fail here rather than quietly fall back.
 *
 * Image URLs in the fixture point at the portal's real storage host, because
 * that host is what the image allowlist permits. The files do not exist, so
 * these tests assert on attributes and never on a rendered pixel.
 */

/**
 * The payload is read from the fixture server at run time rather than imported.
 *
 * Its dates are relative to now — "upcoming" is the property under test, and
 * hard-coded dates would quietly turn the upcoming event into a past one the
 * day they passed. Importing the module would compute those dates a second
 * time, in a second process, seconds apart: the first version of this suite
 * failed on exactly that, comparing `…:26:02.852Z` with `…:24:53.552Z`.
 *
 * Asking the server what it served removes the second copy entirely.
 */
const FIXTURE_URL = 'http://localhost:3999/api/public/landing';
let FIXTURE: PortalLanding;

test.beforeAll(async ({ request }) => {
  const response = await request.get(FIXTURE_URL, { headers: { 'x-api-key': 'fixture-key' } });
  expect(response.status(), 'the fixture portal should be serving').toBe(200);
  FIXTURE = (await response.json()) as PortalLanding;
});

const officer = (id: string) => FIXTURE.officers.find((o) => o.id === id)!;
const event = (id: string) => FIXTURE.events.find((e) => e.id === id)!;

test.describe('TEST-01 the officers section on portal data', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('shows the portal roster instead of the bundled one', async ({ page }) => {
    const section = page.locator('#officers');
    await expect(section.getByText(officer('officer-1').name, { exact: true })).toBeVisible();

    // The bundled list must be gone entirely, not merged with the portal's.
    // Mixing the two would put people on the page who are no longer officers.
    await expect(section.getByText(team[0].name, { exact: true })).toHaveCount(0);
  });

  test('renders a bio where there is one, and nothing where there is not', async ({ page }) => {
    const bios = page.locator('#officers [data-officer-bio]');
    await expect(bios).toHaveCount(1);
    await expect(bios.first()).toHaveText(officer('officer-1').bio!);
    // officer-2 has `null` and officer-3 has "   ". Both are "no bio", and
    // whitespace must not become an empty paragraph under a name.
  });

  test('an unrenderable photo falls back to initials', async ({ page }) => {
    // The production incident from CMS-03-BT-01, as data rather than a unit
    // test: the portal held officers whose photos were Tenor links, the image
    // optimizer answered 400, and visitors saw broken images.
    const card = page.locator('#officers [data-carousel-tile]', {
      hasText: officer('officer-3').name,
    });
    await expect(card.locator('img')).toHaveCount(0);
    await expect(card.getByText('FT', { exact: true })).toBeVisible();
  });

  test('photos that are renderable go through the image optimizer', async ({ page }) => {
    const card = page.locator('#officers [data-carousel-tile]', {
      hasText: officer('officer-1').name,
    });
    await expect(card.locator('img').first()).toHaveAttribute('src', /\/_next\/image/);
  });
});

test.describe('TEST-01 the events section on portal data', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('shows upcoming and TBA events, and hides the past one', async ({ page }) => {
    const section = page.locator('#events');
    await expect(section.getByText(event('event-upcoming').title, { exact: true })).toBeVisible();
    await expect(section.getByText(event('event-tba').title, { exact: true })).toBeVisible();
    // EVENTS-02. The fixture's past event is dated relative to now, so this
    // cannot rot into asserting the opposite once a hard-coded date passes.
    await expect(section.getByText(event('event-past').title, { exact: true })).toHaveCount(0);
  });

  test('a past event the portal chose to show is there, and marked past', async ({ page }) => {
    const target = event('event-past-shown');
    const card = page.locator('#events a', { hasText: target.title });
    await expect(card).toHaveCount(1);
    // In a section called Featured Events a visitor would read it as coming up.
    await expect(card.locator('[data-past-event]')).toHaveText(/Past event/i);
  });

  test('an upcoming event the portal chose to hide is not', async ({ page }) => {
    await expect(page.locator('#events').getByText(event('event-upcoming-hidden').title, { exact: true })).toHaveCount(0);
  });

  test('upcoming events are not marked past', async ({ page }) => {
    const card = page.locator('#events a', { hasText: event('event-upcoming').title });
    await expect(card.locator('[data-past-event]')).toHaveCount(0);
  });

  test('a card shows the main category, two more, and a count of the rest', async ({ page }) => {
    // EVENTS-07. The fixture's hackathon has four categories, primary first.
    const card = page.locator('#events a', { hasText: event('event-upcoming').title });
    await expect(card.locator('[data-category-main]')).toHaveText('Code Camp');
    await expect(card.locator('[data-category-sub]')).toHaveText(['Workshop', 'Community']);
    await expect(card.locator('[data-category-more]')).toContainText('+1');
    // Read aloud, "+1" means nothing; the hidden text says what it counts.
    await expect(card.locator('[data-category-more]')).toContainText('and 1 more category');
  });

  test('an event with a single category shows exactly one badge', async ({ page }) => {
    const card = page.locator('#events a', { hasText: event('event-tba').title });
    await expect(card.locator('[data-category-main]')).toHaveCount(1);
    await expect(card.locator('[data-category-sub]')).toHaveCount(0);
    await expect(card.locator('[data-category-more]')).toHaveCount(0);
  });

  test('drops the bundled placeholders entirely', async ({ page }) => {
    const section = page.locator('#events');
    for (const placeholder of bundledEvents.slice(0, 3)) {
      await expect(section.getByText(placeholder.title, { exact: true })).toHaveCount(0);
    }
  });

  test('each card links to its own page, by the canonical slug', async ({ page }) => {
    const target = event('event-upcoming');
    const link = page.locator(`#events a[href="/events/${target.slug}"]`);
    await expect(link).toHaveCount(1);
    await expect(link).toContainText(target.title);
    // Never the alias, and never the id when a slug exists (EVENTS-04).
    await expect(page.locator(`#events a[href="/events/${target.id}"]`)).toHaveCount(0);
  });

  test('a TBA event says so rather than showing a date', async ({ page }) => {
    const card = page.locator('#events a', { hasText: event('event-tba').title });
    await expect(card).toContainText('TBA');
  });
});

test.describe('TEST-01 an event page on portal data', () => {
  test('shows everything the card had no room for', async ({ page }) => {
    const target = event('event-upcoming');
    await page.goto(`/events/${target.slug}`);

    await expect(page.getByRole('heading', { name: target.title, level: 1 })).toBeVisible();
    // `description` and `location` were sent by the portal for two sprints
    // before anything displayed them.
    await expect(page.getByText('Bring a laptop and a team.')).toBeVisible();
    await expect(page.getByText(target.location, { exact: true })).toBeVisible();
    await expect(page.locator(`img[src*="${encodeURIComponent('events/hackathon.jpg')}"]`)).toHaveCount(1);
  });

  test('hiding an event from the landing page does not take its page down', async ({ page }) => {
    // `landing_visibility` decides the carousel only. A link someone shared
    // to an upcoming event must keep working when an officer hides it from the
    // homepage (EVENTS-06).
    const target = event('event-upcoming-hidden');
    const response = await page.goto(`/events/${target.slug}`);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole('heading', { name: target.title, level: 1 })).toBeVisible();
  });

  test('a past event still has a working page', async ({ page }) => {
    // Deliberate: the carousel is about what is next, but a link someone shared
    // must keep working after the event. If the portal ever unpublishes past
    // events, this is the test that will notice.
    const response = await page.goto(`/events/${event('event-past').id}`);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole('heading', { name: event('event-past').title, level: 1 })).toBeVisible();
  });

  test('an upcoming event says how to register, Join first', async ({ page }) => {
    // EVENTS-08. Registration needs an approved member account, and the portal
    // team asked for "Join DevCon" first: most visitors are not members yet.
    const target = event('event-upcoming');
    await page.goto(`/events/${target.slug}`);
    const notice = page.locator('[data-registration-notice]');
    await expect(notice).toContainText(/for DevCon Laguna members/i);

    const links = notice.getByRole('link');
    await expect(links.first()).toContainText('Join DevCon Laguna');
    await expect(links.nth(1)).toHaveAttribute('href', new RegExp(`/events/${target.id}$`));
    for (const link of await links.all()) {
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('rel', /noopener/);
    }
  });

  test('a TBA event says how to register too', async ({ page }) => {
    await page.goto(`/events/${event('event-tba').slug}`);
    await expect(page.locator('[data-registration-notice]')).toHaveCount(1);
  });

  test('a past event does not invite registration', async ({ page }) => {
    // Kept on the landing page by an officer, but over: showcasing, not open.
    await page.goto(`/events/${event('event-past-shown').slug}`);
    await expect(page.locator('[data-registration-notice]')).toHaveCount(0);
  });

  test('the event page shows every category', async ({ page }) => {
    await page.goto(`/events/${event('event-upcoming').slug}`);
    const badges = page.locator('main [data-event-categories]');
    await expect(badges.locator('[data-category-main]')).toHaveText('Code Camp');
    // No "+N" here: unlike a card, the page has room for all of them.
    await expect(badges.locator('[data-category-sub]')).toHaveText(['Workshop', 'Community', 'Career Talk']);
    await expect(badges.locator('[data-category-more]')).toHaveCount(0);
  });

  test('carries its own title and description, not the site defaults', async ({ page }) => {
    await page.goto(`/events/${event('event-upcoming').slug}`);
    await expect(page).toHaveTitle(new RegExp(event('event-upcoming').title));

    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toContain('Two days of building.');
  });

  test('emits Event structured data for a dated event', async ({ page }) => {
    await page.goto(`/events/${event('event-upcoming').slug}`);
    const payloads = await page.locator('script[type="application/ld+json"]').allTextContents();
    const eventData = payloads.map((p) => JSON.parse(p)).find((d) => d['@type'] === 'Event');

    expect(eventData, 'a dated event should be offered to search engines').toBeTruthy();
    expect(eventData.name).toBe(event('event-upcoming').title);
    expect(eventData.startDate).toBe(event('event-upcoming').start_date);
    expect(eventData.location.name).toBe(event('event-upcoming').location);
  });

  test('emits none for a TBA event', async ({ page }) => {
    await page.goto(`/events/${event('event-tba').slug}`);
    const payloads = await page.locator('script[type="application/ld+json"]').allTextContents();
    const types = payloads.map((p) => JSON.parse(p)['@type']);

    // `startDate` is required for an Event to be usable. Emitting one without
    // it would be invalid; inventing a date would be a lie. The page still
    // shows "TBA" to readers.
    expect(types).toContain('Organization');
    expect(types).not.toContain('Event');
  });

  test('a location that is a map link is a link, not printed text', async ({ page }) => {
    // The portal's first real event arrived with a Google Maps URL in
    // `location`; printed under a map pin it reads as broken (EVENTS-05).
    const target = event('event-tba');
    await page.goto(`/events/${target.slug}`);

    const link = page.getByRole('link', { name: 'View location on the map' });
    await expect(link).toHaveAttribute('href', target.location);
    await expect(link).toHaveAttribute('rel', /noopener/);
    // The raw URL is never printed.
    await expect(page.getByText(target.location, { exact: true })).toHaveCount(0);
  });

  test('an alias reaches the event, and moves to its real address', async ({ page }) => {
    const target = event('event-upcoming');
    const response = await page.goto(`/events/${target.slug_aliases[0]}`);

    // The short link works, and the visitor ends up on the canonical URL — the
    // same page at three addresses would leave search engines guessing which
    // one is the event (EVENTS-04).
    expect(response?.status()).toBe(200);
    expect(new URL(page.url()).pathname).toBe(`/events/${target.slug}`);
    await expect(page.getByRole('heading', { name: target.title, level: 1 })).toBeVisible();
  });

  test('an id still reaches an event that has since gained a slug', async ({ page }) => {
    // Every link shared before the portal added slugs uses the id.
    const target = event('event-upcoming');
    await page.goto(`/events/${target.id}`);
    expect(new URL(page.url()).pathname).toBe(`/events/${target.slug}`);
  });

  test('an event with no slug keeps its id as its address', async ({ page }) => {
    const target = event('event-past');
    const response = await page.goto(`/events/${target.id}`);
    expect(response?.status()).toBe(200);
    // No redirect: there is nowhere better to send it.
    expect(new URL(page.url()).pathname).toBe(`/events/${target.id}`);
  });

  test('an id the portal does not have is still a 404', async ({ page }) => {
    const response = await page.goto('/events/event-that-does-not-exist');
    expect(response?.status()).toBe(404);
  });
});

test.describe('NEWS-02 news on portal data', () => {
  const post = (slug: string) => FIXTURE.posts.find((entry) => entry.slug === slug)!;

  test('the homepage shows the latest posts', async ({ page }) => {
    await page.goto('/');
    const section = page.locator('#news');
    await expect(section.getByRole('heading', { name: /Latest News/i })).toBeVisible();

    for (const entry of FIXTURE.posts) {
      await expect(section.getByRole('link', { name: new RegExp(entry.title, 'i') })).toBeVisible();
    }
  });

  test('a post with no excerpt borrows the opening of its body', async ({ page }) => {
    await page.goto('/');
    const card = page.locator('#news a', { hasText: post('fixture-plain-post').title });
    // The card must not be a bare heading just because the portal left the
    // excerpt empty.
    await expect(card).toContainText('This body is the only thing the card can summarise');
  });

  test('the index lists every post', async ({ page }) => {
    await page.goto('/news');
    for (const entry of FIXTURE.posts) {
      await expect(page.getByRole('link', { name: new RegExp(entry.title, 'i') })).toBeVisible();
    }
  });

  test('a post has its own page, with its paragraphs kept', async ({ page }) => {
    const entry = post('fixture-hackathon-recap');
    await page.goto(`/news/${entry.slug}`);

    await expect(page.getByRole('heading', { name: entry.title, level: 1 })).toBeVisible();
    await expect(page.getByText('The first paragraph of the post.')).toBeVisible();
    await expect(page.getByText('The second paragraph, after a blank line.')).toBeVisible();
    await expect(page).toHaveTitle(new RegExp(entry.title));
  });

  test('a post page carries article structured data', async ({ page }) => {
    const entry = post('fixture-hackathon-recap');
    await page.goto(`/news/${entry.slug}`);

    const payloads = await page.locator('script[type="application/ld+json"]').allTextContents();
    const article = payloads.map((p) => JSON.parse(p)).find((d) => d['@type'] === 'NewsArticle');
    expect(article, 'a post should be offered to search engines').toBeTruthy();
    expect(article.headline).toBe(entry.title);
    expect(article.datePublished).toBe(entry.published_at);
  });

  test('the sitemap lists the index and every post', async ({ request }) => {
    const xml = await (await request.get('/sitemap.xml')).text();
    expect(xml).toContain('/news');
    for (const entry of FIXTURE.posts) {
      expect(xml, `${entry.slug} should be listed`).toContain(`/news/${entry.slug}`);
    }
  });

  test('an unknown post is a 404 even when posts exist', async ({ page }) => {
    const response = await page.goto('/news/no-such-post');
    expect(response?.status()).toBe(404);
  });
});

test.describe('TEST-01 the sitemap on portal data', () => {
  test('lists every event at its canonical address', async ({ request }) => {
    const xml = await (await request.get('/sitemap.xml')).text();
    for (const entry of FIXTURE.events) {
      const canonical = entry.slug ?? entry.id;
      expect(xml, `${entry.title} should be listed`).toContain(`/events/${canonical}`);
    }
    // An alias is a way in, not an address: listing it would offer search
    // engines a second URL for the same event.
    expect(xml).not.toContain('fixture-hack"');
    expect(xml).not.toContain('/events/event-upcoming');
    expect(xml).toContain('/privacy');
  });
});

test.describe('TEST-01 landing images on portal data', () => {
  test('a filled slot switches over', async ({ page }) => {
    await page.goto('/');
    // The hero is a <picture>: the desktop image lives in a <source srcset> and
    // only the mobile one reaches the <img>. Reading the markup covers both,
    // where looking at `img[src]` alone would miss the desktop slot entirely.
    const markup = await page.locator('#hero').innerHTML();
    for (const file of ['landing/hero-desktop.png', 'landing/hero-mobile.png']) {
      expect(markup.includes(encodeURIComponent(file)), `${file} should be in the hero`).toBe(true);
    }
  });

  test('an empty slot keeps its built-in picture, in the same page', async ({ page }) => {
    await page.goto('/');
    // `what-we-do` is deliberately empty in the fixture. Each slot falls back on
    // its own, so a portal that has filled two slots out of five must not empty
    // the other three — and a payload with every slot filled could never show
    // that.
    const cards = page.locator('#what-we-do img');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);

    const sources = await cards.evaluateAll((images) =>
      images.map((image) => image.getAttribute('src') ?? ''),
    );
    expect(sources.every((src) => !src.includes('supabase'))).toBe(true);
  });
});

test.describe('TEST-01 the key still never reaches the browser', () => {
  test('no request from the browser carries the API key', async ({ page }) => {
    const leaked: string[] = [];
    page.on('request', (request) => {
      const headers = request.headers();
      if (headers['x-api-key']) leaked.push(request.url());
    });

    await page.goto('/', { waitUntil: 'load' });
    // The fallback suite asserts this with no key configured, where there is
    // nothing to leak. Here there is.
    expect(leaked).toEqual([]);
  });

  test('the key is not in the HTML either', async ({ request }) => {
    const html = await (await request.get('/')).text();
    expect(html).not.toContain('fixture-key');
    expect(html).not.toContain('x-api-key');
  });
});

/**
 * Accessibility on pages built from portal data (EVENTS-07).
 *
 * `a11y.spec.ts` audits the site with no portal — bundled content only. Every
 * piece of the page that exists only when the portal answers had never been
 * audited: event links, the past-event marker, and now the category chips,
 * which appear only when an event has more than one category.
 *
 * Same method as the main audit: motion off so text is not measured mid-fade,
 * the page scrolled through so every section has revealed, and only critical or
 * serious violations fail.
 */
test.describe('EVENTS-07 accessibility on portal data', () => {
  // The first run of this block found 7 real contrast failures, none of them in
  // the new category chips: the event page and the news cards, both built in
  // earlier tickets, both invisible to the main audit because they only exist
  // when the portal returns data. Fixed by giving <body> the theme background
  // and the news card a theme-aware surface.
  test.use({ contextOptions: { reducedMotion: 'reduce' } });

  const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'];

  async function audit(page: Page, context: string) {
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 400) {
        window.scrollTo(0, y);
        await new Promise((resolve) => setTimeout(resolve, 60));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(1000);

    const { violations } = await new AxeBuilder({ page }).withTags(TAGS).analyze();
    const blocking = violations.filter((v) => ['critical', 'serious'].includes(v.impact ?? ''));
    const detail = blocking
      .map((v) => `${v.impact} ${v.id} (x${v.nodes.length}): ${v.help}\n    ${v.nodes.map((n) => n.target.join(' ')).join('\n    ')}`)
      .join('\n');
    expect(blocking, `${context} has blocking accessibility violations:\n${detail}`).toEqual([]);
  }

  for (const theme of ['dark', 'light'] as const) {
    test(`the homepage, ${theme} theme`, async ({ page }) => {
      await page.addInitScript((value) => window.localStorage.setItem('theme', value), theme);
      await page.goto('/', { waitUntil: 'load' });
      await audit(page, `homepage (${theme})`);
    });

    test(`the news index and a post, ${theme} theme`, async ({ page }) => {
      // The news pages set no background of their own; before the body did,
      // their text was measured against the browser's default canvas.
      await page.addInitScript((value) => window.localStorage.setItem('theme', value), theme);
      await page.goto('/news', { waitUntil: 'load' });
      await audit(page, `news index (${theme})`);
      await page.goto('/news/fixture-hackathon-recap', { waitUntil: 'load' });
      await audit(page, `news post (${theme})`);
    });

    test(`an event page with several categories, ${theme} theme`, async ({ page }) => {
      await page.addInitScript((value) => window.localStorage.setItem('theme', value), theme);
      await page.goto(`/events/${event('event-upcoming').slug}`, { waitUntil: 'load' });
      await audit(page, `event page (${theme})`);
    });
  }
});
