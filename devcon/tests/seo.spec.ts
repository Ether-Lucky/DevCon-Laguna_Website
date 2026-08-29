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
