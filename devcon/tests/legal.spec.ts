import { test, expect } from '@playwright/test';

/**
 * Regression suite for LEGAL-01 (#73): the Privacy Policy and Terms pages.
 */

const PAGES = [
  { path: '/privacy', title: 'Privacy Policy' },
  { path: '/terms', title: 'Terms and Conditions' },
] as const;

test.describe('LEGAL-01 pages', () => {
  for (const { path, title } of PAGES) {
    test(`${path} is served with its own title, heading and canonical URL`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
      await expect(page).toHaveTitle(new RegExp(title));
      await expect(page.getByRole('heading', { level: 1, name: title })).toBeVisible();
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', new RegExp(`${path}$`));
    });
  }

  test('both are listed in the sitemap', async ({ request }) => {
    const body = await (await request.get('/sitemap.xml')).text();
    expect(body).toMatch(/<loc>[^<]*\/privacy<\/loc>/);
    expect(body).toMatch(/<loc>[^<]*\/terms<\/loc>/);
  });

  test('the navbar works from a page other than home', async ({ page }) => {
    // The nav links were bare anchors (#about). On /privacy that meant
    // /privacy#about, which doesn't exist, so every nav link was dead on any
    // page but home. They now go home first (/#about).
    await page.goto('/privacy');
    const hrefs = await page.locator('nav').first().locator('a[href*="#"]').evaluateAll((links) => links.map((a) => a.getAttribute('href')));
    expect(hrefs.length).toBeGreaterThan(0);
    for (const href of hrefs) expect(href, href!).toMatch(/^\/#[a-z-]+$/);

    await page.locator('nav').first().getByRole('link', { name: 'Events', exact: true }).first().click();
    await expect(page).toHaveURL(/\/#events$/);
    await expect(page.locator('#events')).toBeAttached();
  });
});

test.describe('LEGAL-01 approval gate', () => {
  /**
   * The drafts mark every statement only the organisation can settle with a
   * visible "[TO CONFIRM: …]" (components/ui/legal/to-confirm.tsx).
   *
   * **This test fails on purpose until every one is resolved.** It is what
   * stops an unreviewed legal page from passing CI and shipping. Resolve a
   * placeholder by replacing the <ToConfirm> with the approved text. Never by
   * skipping or deleting this test.
   */
  for (const { path } of PAGES) {
    test(`${path} has no unresolved placeholders`, async ({ page }) => {
      await page.goto(path);
      const pending = await page.locator('[data-to-confirm]').allTextContents();
      expect(pending, `${pending.length} statements still need the organisation's approval`).toEqual([]);
    });
  }
});
