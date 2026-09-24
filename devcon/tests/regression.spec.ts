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
        links
          .filter((l) => (l.getAttribute('imagesrcset') ?? '').includes('hero'))
          .map((l) => ({
            media: l.getAttribute('media') ?? '',
            srcset: l.getAttribute('imagesrcset') ?? '',
          })),
      );
    // Since PERF-02, the two hero preloads are media-qualified and mirror the
    // <picture> sources. The media queries are mutually exclusive, so a single
    // device matches only one — the no-double-download guarantee still holds.
    expect(heroPreloads.length).toBeLessThanOrEqual(2);
    for (const preload of heroPreloads) {
      if (preload.media === '(min-width: 768px)') {
        expect(preload.srcset).toMatch(/web\.webp/);
        expect(preload.srcset).not.toMatch(/mobile\.webp/);
      } else if (preload.media === '(max-width: 767.98px)') {
        expect(preload.srcset).toMatch(/mobile\.webp/);
        expect(preload.srcset).not.toMatch(/web\.webp/);
      }
    }
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

// CTA-01 (#112) — the primary calls to action must actually convert.
//
// "Join Us" had no href at all, so Button rendered an inert <button>; the hero
// CTAs pointed at "#". They now link to the DevConnect Portal, the separate app
// where visitors register as members or volunteers.
test.describe('#112 primary CTAs', () => {
  const PORTAL = 'devconnect-portal-seven.vercel.app';

  // Matched on text, so it follows the labels. The hero's secondary CTA was
  // "Learn More" until SEO-04. Without updating this list, the rename would have
  // left this test passing while no longer checking that button. The explicit
  // analytics-id check below keeps it covered whatever it is called.
  const CTA_TEXT = /^(Join Us|Volunteer|Visit DevConnect Portal)$/;

  test('every Join Us, Volunteer and Visit DevConnect Portal links to the portal', async ({ page }) => {
    const ctas = page.locator('a', { hasText: CTA_TEXT });
    const count = await ctas.count();
    expect(count, 'the CTAs should be present').toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      await expect(ctas.nth(i)).toHaveAttribute('href', new RegExp(PORTAL));
    }
  });

  test('the hero CTAs are identified by analytics id, not only by label', async ({ page }) => {
    for (const id of ['hero-volunteer', 'hero-learn-more']) {
      await expect(page.locator(`[data-analytics-id="${id}"]`).first()).toHaveAttribute('href', new RegExp(PORTAL));
    }
  });

  test('the nav Join Us is a real link, not an inert button', async ({ page }) => {
    // With no href, Button renders <button> with no handler — nothing happens on click.
    const navJoin = page.locator('[data-analytics-id="nav-join-us"]').first();
    expect(await navJoin.evaluate((el) => el.tagName)).toBe('A');
    await expect(navJoin).toHaveAttribute('href', new RegExp(PORTAL));
  });

  test('portal links open in a new tab with a safe rel', async ({ page }) => {
    const links = page.locator(`a[href*="${PORTAL}"]`);
    const count = await links.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      await expect(links.nth(i)).toHaveAttribute('target', '_blank');
      // Without noopener the opened page can reach back via window.opener.
      await expect(links.nth(i)).toHaveAttribute('rel', /noopener/);
    }
  });

  test('no primary CTA is left pointing at "#"', async ({ page }) => {
    const dead = page.locator('a[href="#"]', { hasText: CTA_TEXT });
    await expect(dead).toHaveCount(0);
  });
});

test.describe('LOGO-BT-01 declared image proportions', () => {
  /**
   * Mirrors Lighthouse's image-aspect-ratio audit: an image's width/height
   * attributes must describe the file it loads. The browser uses them to
   * reserve space before the image arrives, so a mismatch means a wrong-sized
   * box until then. The logo declared 240x76 (3.16) for a 384x65 file (5.91).
   *
   * Written for every image, not just the logo, so the next one is caught too.
   * Images that crop with `object-fit` are skipped, as Lighthouse skips them:
   * their declared size describes a frame, not a file.
   *
   * Compared in pixels, as Lighthouse does (a 2 px threshold on height), not as
   * a percentage of the ratio. A first version used a 2% ratio tolerance and
   * failed on WebKit only: Playwright's Desktop Safari runs at 2x density, where
   * WebKit reports a density-corrected natural size, so the 50x31 "Look Here"
   * doodle read as 25 x 15.5, rounded to 25x15, a 3% error from rounding
   * alone. In pixels that is 1 px, while the logo's real mismatch was about 36.
   */
  test('every image declares the proportions of the file it loads', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 500) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 50));
      }
    });
    await page.waitForLoadState('networkidle');

    const mismatches = await page.$$eval('img[width][height]', (imgs) =>
      imgs
        .map((node) => {
          const img = node as HTMLImageElement;
          const fit = getComputedStyle(img).objectFit;
          if (fit === 'cover' || fit === 'contain' || !img.naturalWidth || !img.naturalHeight) return null;
          const declaredWidth = Number(img.getAttribute('width'));
          const declaredHeight = Number(img.getAttribute('height'));
          // The height the declared width would need, at the file's real ratio.
          const expectedHeight = (declaredWidth * img.naturalHeight) / img.naturalWidth;
          return Math.abs(declaredHeight - expectedHeight) > 2
            ? `${img.getAttribute('alt')} (${img.currentSrc.split('url=')[1]?.split('&')[0] ?? img.src}): declared ${img.getAttribute('width')}x${img.getAttribute('height')}, file ${img.naturalWidth}x${img.naturalHeight}`
            : null;
        })
        .filter(Boolean),
    );

    expect(mismatches).toEqual([]);
  });
});

test.describe('ANL-01-BT-01 a clean console', () => {
  /**
   * The page must load without console errors, uncaught exceptions or failed
   * requests to its own origin. Before ANL-01-BT-01, every load outside Vercel
   * logged a 404 for the analytics script. That failed Lighthouse's
   * errors-in-console audit, and it meant a real error always arrived next to
   * one everybody had learned to ignore.
   *
   * The whole page is scrolled, so lazy-loaded images and below-the-fold
   * sections are included.
   */
  test('loading the whole page logs no errors', async ({ page, baseURL }) => {
    const problems: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') problems.push(`console: ${message.text()}`);
    });
    page.on('pageerror', (error) => problems.push(`exception: ${error.message}`));
    page.on('response', (response) => {
      if (response.status() >= 400 && baseURL && response.url().startsWith(baseURL)) {
        problems.push(`${response.status()}: ${response.url()}`);
      }
    });

    await page.goto('/');
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 500) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 60));
      }
    });
    await page.waitForLoadState('networkidle');

    expect(problems).toEqual([]);
  });
});

test.describe('FOOTER-02 every link goes somewhere', () => {
  /**
   * The footer shipped with 17 links pointing at `"#"`, including "Privacy
   * Policy" and "Terms and Conditions". They looked clickable, went nowhere,
   * and jumped the visitor back to the top of the page.
   *
   * Checked on every page, not just the home page, and for in-page anchors
   * the target section must actually exist. A link to `/#what-we-do` is only
   * useful if that section is there.
   */
  for (const path of ['/', '/privacy', '/terms']) {
    test(`${path} has no dead links`, async ({ page }) => {
      await page.goto(path);
      const dead = await page.locator('a').evaluateAll((links) =>
        links
          .filter((a) => {
            const href = a.getAttribute('href');
            return href === null || href.trim() === '' || href.trim() === '#';
          })
          .map((a) => (a.textContent ?? '').trim() || '(no text)'),
      );
      expect(dead, `dead links on ${path}`).toEqual([]);
    });
  }

  test('every in-page anchor in the footer points at a real section', async ({ page }) => {
    await page.goto('/');
    const anchors = await page.locator('footer a[href^="/#"]').evaluateAll((links) =>
      links.map((a) => a.getAttribute('href')!),
    );
    expect(anchors.length, 'the footer should link into the page').toBeGreaterThan(0);

    for (const href of anchors) {
      await expect(page.locator(href.replace('/', '')), `${href} must exist on the page`).toHaveCount(1);
    }
  });

  test('the footer legal links reach the real pages', async ({ page, request }) => {
    await page.goto('/');
    for (const [label, path] of [['Privacy Policy', '/privacy'], ['Terms and Conditions', '/terms']] as const) {
      await expect(page.locator('footer').getByRole('link', { name: label })).toHaveAttribute('href', path);
      expect((await request.get(path)).status(), `${path} should be served`).toBe(200);
    }
  });

  test('footer links off the site open safely in a new tab', async ({ page }) => {
    await page.goto('/');
    const external = page.locator('footer a[href^="http"]');
    const count = await external.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i += 1) {
      await expect(external.nth(i)).toHaveAttribute('target', '_blank');
      await expect(external.nth(i)).toHaveAttribute('rel', /noopener/);
    }
  });
});
