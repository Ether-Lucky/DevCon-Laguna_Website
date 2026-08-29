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

// HERO-01-BT-01 (#83) + PERF-02 (#94) — exactly one hero variant may be fetched,
// and it must load eagerly because it is the Largest Contentful Paint element.
//
// The original defect preloaded both variants. The first fix made both lazy, which
// stopped the double download but delayed the LCP image by ~990ms. Art direction
// via <picture> resolves both: the browser fetches one candidate, eagerly.
test.describe('#83/#94 hero images', () => {
  test('only one hero collage image is rendered', async ({ page }) => {
    const collage = page.locator('img[alt="DevCon Laguna community collage"]');
    await expect(collage).toHaveCount(1);
  });

  test('the hero image loads eagerly at high priority', async ({ page }) => {
    // Lazy loading here is what pushed LCP to 4.6s, so it must not come back.
    const collage = page.locator('img[alt="DevCon Laguna community collage"]');
    await expect(collage).toHaveAttribute('loading', 'eager');
    await expect(collage).toHaveAttribute('fetchpriority', 'high');
    await expect(collage).toHaveAttribute('sizes', /.+/);
  });

  test('a separate desktop candidate is offered via picture/source', async ({ page }) => {
    // Proves art direction is in place: the desktop file is reachable only
    // through a media-qualified <source>, so phones never request it.
    const source = page.locator('#hero picture source[media]');
    await expect(source).toHaveCount(1);
    await expect(source).toHaveAttribute('srcset', /web\.webp/);
    // ...and the fallback <img> serves the mobile variant.
    const collage = page.locator('img[alt="DevCon Laguna community collage"]');
    await expect(collage).toHaveAttribute('srcset', /mobile\.webp/);
  });

  test('no device is asked to preload more than one hero image', async ({ page }) => {
    const heroPreloads = await page
      .locator('link[rel="preload"][as="image"]')
      .evaluateAll((links) =>
        links.filter((l) => (l.getAttribute('imagesrcset') ?? '').includes('hero')).length,
      );
    expect(heroPreloads).toBeLessThanOrEqual(1);
  });
});

// PERF-02 (#94) — the hero must paint on first render.
//
// ScrollReveal server-renders its children at `opacity: 0` and only reveals them
// once the bundle loads, React hydrates, framer-motion initialises, an
// IntersectionObserver fires and a 0.85s animation completes. Wrapping the hero
// in it delayed the LCP paint by ~2.3s. Below-the-fold sections keep the effect.
test.describe('#94 hero paints immediately', () => {
  test('no hidden wrapper precedes the hero in the server HTML', async ({ request }) => {
    const html = await (await request.get('/')).text();
    const beforeHero = html.slice(0, html.indexOf('id="hero"'));
    expect(
      beforeHero.includes('opacity:0'),
      'the hero must not be inside a scroll-reveal wrapper',
    ).toBe(false);
  });

  test('below-the-fold sections still animate in', async ({ request }) => {
    // Guards against "fixing" this by disabling the effect site-wide.
    const html = await (await request.get('/')).text();
    expect(html).toContain('opacity:0');
  });

  test('the hero image is visible without waiting for an animation', async ({ page }) => {
    await page.goto('/', { waitUntil: 'commit' });
    const collage = page.locator('img[alt="DevCon Laguna community collage"]');
    await expect(collage).toBeVisible();
    const opacity = await collage.evaluate((el) => {
      let node: HTMLElement | null = el as HTMLElement;
      while (node) {
        if (parseFloat(getComputedStyle(node).opacity) === 0) return 0;
        node = node.parentElement;
      }
      return 1;
    });
    expect(opacity).toBe(1);
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
