import { test, expect } from '@playwright/test';

/**
 * Regression suite for SEO-02 (#63) — sitemap.xml and robots.txt.
 *
 * These are generated routes rather than page content, so the assertions run
 * against the HTTP responses directly instead of a rendered page. Follows the
 * same conventions as `home.spec.ts` for imports and structure.
 *
 * The canonical host is environment-driven (`NEXT_PUBLIC_SITE_URL`, then
 * Vercel's own variable, then localhost), so these tests assert on structure
 * and internal consistency rather than on a hardcoded domain.
 */

test.describe('SEO-02 robots.txt', () => {
  test('is served as plain text', async ({ request }) => {
    const response = await request.get('/robots.txt');
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('text/plain');
  });

  test('allows crawling and excludes the API routes', async ({ request }) => {
    const body = await (await request.get('/robots.txt')).text();
    expect(body).toMatch(/User-Agent:\s*\*/i);
    expect(body).toMatch(/^Allow:\s*\/$/im);
    // /api/ holds no indexable content (e.g. the CON-01 contact endpoint).
    expect(body).toMatch(/^Disallow:\s*\/api\/$/im);
  });

  test('advertises the sitemap location', async ({ request }) => {
    const body = await (await request.get('/robots.txt')).text();
    expect(body).toMatch(/^Sitemap:\s*https?:\/\/\S+\/sitemap\.xml$/im);
  });
});

test.describe('SEO-02 sitemap.xml', () => {
  test('is served as XML', async ({ request }) => {
    const response = await request.get('/sitemap.xml');
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('xml');
  });

  test('is a valid urlset with at least the home page', async ({ request }) => {
    const body = await (await request.get('/sitemap.xml')).text();
    expect(body).toContain('<?xml');
    expect(body).toContain('http://www.sitemaps.org/schemas/sitemap/0.9');
    expect(body).toMatch(/<loc>https?:\/\/\S+<\/loc>/);
    expect(body).toMatch(/<lastmod>.+<\/lastmod>/);
  });

  test('does not list in-page anchors as separate URLs', async ({ request }) => {
    const body = await (await request.get('/sitemap.xml')).text();
    // Anchors such as #about resolve to the same document, so listing them
    // would misrepresent the site to crawlers.
    expect(body).not.toContain('#');
  });
});

test.describe('SEO-02 consistency', () => {
  test('robots and sitemap agree on the canonical host', async ({ request }) => {
    const robots = await (await request.get('/robots.txt')).text();
    const sitemap = await (await request.get('/sitemap.xml')).text();

    const robotsHost = robots.match(/^Sitemap:\s*(https?:\/\/[^/\s]+)/im)?.[1];
    const sitemapHost = sitemap.match(/<loc>(https?:\/\/[^/<]+)/)?.[1];

    expect(robotsHost, 'robots.txt should advertise a sitemap URL').toBeTruthy();
    expect(sitemapHost, 'sitemap.xml should contain a <loc> entry').toBeTruthy();
    expect(robotsHost).toBe(sitemapHost);
  });
});

/**
 * SEO-03 (#64) — schema.org Organization structured data.
 *
 * Asserted against the rendered page rather than an HTTP route, since the JSON-LD
 * is embedded in the document head by the root layout.
 */
test.describe('SEO-03 structured data', () => {
  test('emits exactly one Organization JSON-LD block', async ({ page }) => {
    await page.goto('/');
    const blocks = page.locator('script[type="application/ld+json"]');
    await expect(blocks).toHaveCount(1);
  });

  test('is valid JSON with the required Organization fields', async ({ page }) => {
    await page.goto('/');
    const raw = await page.locator('script[type="application/ld+json"]').innerText();

    const data = JSON.parse(raw); // throws if the payload is malformed
    expect(data['@context']).toBe('https://schema.org');
    expect(data['@type']).toBe('Organization');
    expect(data.name).toBeTruthy();
    expect(data.description).toBeTruthy();

    // schema.org requires absolute URLs for url and logo.
    expect(data.url).toMatch(/^https?:\/\//);
    expect(data.logo).toMatch(/^https?:\/\//);
  });

  test('advertises the official social profiles via sameAs', async ({ page }) => {
    await page.goto('/');
    const raw = await page.locator('script[type="application/ld+json"]').innerText();
    const data = JSON.parse(raw);

    expect(Array.isArray(data.sameAs)).toBe(true);
    expect(data.sameAs.length).toBeGreaterThan(0);
    for (const profile of data.sameAs) {
      expect(profile).toMatch(/^https:\/\//);
    }
  });

  test('escapes angle brackets so the payload cannot close the script tag', async ({ page }) => {
    await page.goto('/');
    // A raw "<" in the JSON would allow a crafted string to break out of the
    // script element, so the payload must never contain one.
    const html = await page
      .locator('script[type="application/ld+json"]')
      .evaluate((el) => el.innerHTML);
    expect(html).not.toContain('<');
  });

  test('the structured data host matches the sitemap host', async ({ page, request }) => {
    await page.goto('/');
    const raw = await page.locator('script[type="application/ld+json"]').innerText();
    const jsonLdHost = JSON.parse(raw).url.match(/^(https?:\/\/[^/]+)/)?.[1];

    const sitemap = await (await request.get('/sitemap.xml')).text();
    const sitemapHost = sitemap.match(/<loc>(https?:\/\/[^/<]+)/)?.[1];

    expect(jsonLdHost).toBe(sitemapHost);
  });
});
