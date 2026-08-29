import { test, expect } from '@playwright/test';

/**
 * Regression suite for the code review findings raised against PR #70.
 *
 * Each block below locks in the fix for one ticket so the defect cannot return
 * silently. Follows the same conventions as `home.spec.ts`: navigate in
 * `beforeEach`, wait for the network to settle, then assert against the
 * rendered page.
 */

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
});

// HERO-01-BT-01 (#83) — the hero must not preload both image variants.
test.describe('#83 hero images', () => {
  test('neither hero variant is preloaded', async ({ page }) => {
    // `priority` emits <link rel="preload"> regardless of CSS visibility, which
    // made every device fetch both the desktop and the mobile collage.
    const heroPreloads = await page
      .locator('link[rel="preload"][as="image"]')
      .evaluateAll((links) =>
        links.filter((l) => (l.getAttribute('imagesrcset') ?? '').includes('hero')).length,
      );
    expect(heroPreloads).toBe(0);
  });

  test('both hero variants are lazy and declare sizes', async ({ page }) => {
    const heroImages = page.locator('#hero img[src*="hero"]');
    const count = await heroImages.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const img = heroImages.nth(i);
      // The collage images must stay lazy so the hidden breakpoint variant is
      // never downloaded; the decorative doodle is exempt.
      const alt = await img.getAttribute('alt');
      if (alt === 'DevCon Laguna community collage') {
        await expect(img).toHaveAttribute('loading', 'lazy');
        await expect(img).toHaveAttribute('sizes', /.+/);
      }
    }
  });
});

// LINK-BT-01 (#84) — no CTA may point at a route that does not exist.
test.describe('#84 broken links', () => {
  test('no link targets the removed /team or /events routes', async ({ page }) => {
    await expect(page.locator('a[href="/team"]')).toHaveCount(0);
    await expect(page.locator('a[href="/events"]')).toHaveCount(0);
  });

  test('every internal link resolves to a real route', async ({ page, request }) => {
    const hrefs = await page
      .locator('a[href^="/"]')
      .evaluateAll((links) =>
        Array.from(new Set(links.map((l) => l.getAttribute('href') ?? ''))).filter(
          (h) => h && !h.startsWith('//'),
        ),
      );

    for (const href of hrefs) {
      const response = await request.get(href);
      expect(response.status(), `internal link ${href} should not 404`).toBeLessThan(400);
    }
  });
});

// PERF-01 (#85) — images below the fold must be optimised and lazy.
test.describe('#85 image optimisation', () => {
  test('event card images are served through the Next image optimizer', async ({ page }) => {
    const eventImages = page.locator('#events img');
    await expect(eventImages.first()).toHaveAttribute('src', /\/_next\/image/);
  });

  test('officer avatars are lazy rather than preloaded', async ({ page }) => {
    const avatars = page.locator('#officers img');
    const count = await avatars.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      await expect(avatars.nth(i)).toHaveAttribute('loading', 'lazy');
    }
  });
});

// THEME-BT-01 (#88) — next-themes mutates <html> before hydration, which logs a
// hydration mismatch unless suppressHydrationWarning is set.
test.describe('#88 hydration', () => {
  test('page loads without a hydration mismatch error', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const hydrationErrors = errors.filter((e) => /hydrat/i.test(e));
    expect(hydrationErrors, hydrationErrors.join('\n')).toHaveLength(0);
  });
});

// CAROUSEL-BT-01 (#89) — the documented `gap` prop must actually be applied.
test.describe('#89 carousel gap', () => {
  test('carousel track uses the gap supplied by the component', async ({ page }) => {
    // The track previously hardcoded `gap-6`, silently ignoring the prop.
    const track = page.locator('#events .flex.overflow-x-auto').first();
    await expect(track).toBeVisible();
    const gap = await track.evaluate((el) => getComputedStyle(el).columnGap);
    expect(gap).toBe('24px');
  });
});

// CLEANUP-01 (#90) — the orphan asset must stay deleted.
test.describe('#90 orphan asset', () => {
  test('the removed test.png is no longer served', async ({ request }) => {
    const response = await request.get('/hero/test.png');
    expect(response.status()).toBe(404);
  });
});
