import { test, expect, type Page } from '@playwright/test';
import { siteConfig } from '../lib/site-config';

/**
 * Regression suite for PROGRAM-01-BT-01 (#87) — Programs & Activities restored.
 *
 * The section was taken off the page because every button linked to an empty
 * string and two of its three slides had no content. These tests pin the
 * things that made it unfit to show, so it cannot drift back there, and the
 * WCAG 2.2.2 pause behaviour that axe cannot detect on its own.
 *
 * The slideshow advances every 10 seconds, so the tests control the clock
 * rather than waiting for it.
 */

const SLIDE_MS = 10_000;

/**
 * Just past one slide change. Every "it stayed put" assertion waits exactly
 * this long, never a multiple of the slide count: an earlier version waited
 * three intervals, and with three slides a slideshow that never paused went all
 * the way round and landed back on slide 1 — so those tests could not fail.
 */
const ONE_TICK = SLIDE_MS + 100;

async function openSection(page: Page) {
  await page.clock.install();
  await page.goto('/');
  const section = page.locator('#activities');
  await section.scrollIntoViewIfNeeded();
  // Move the pointer well away so hover-to-pause is not triggered by accident.
  await page.mouse.move(0, 0);
  return section;
}

const currentSlide = (page: Page) =>
  page.locator('#activities [aria-roledescription="slide"]');

/**
 * Waits until the carousel reports whether it is playing, before the clock is
 * moved. The slide's live region is "off" while playing and "polite" while
 * paused, so it is the component's own statement of its state.
 *
 * Without this the tests race React: advancing the clock before a click has
 * re-rendered and restarted the timer skips the tick entirely, which failed
 * intermittently on WebKit under load.
 */
async function expectPlaying(page: Page, playing: boolean) {
  await expect(currentSlide(page)).toHaveAttribute('aria-live', playing ? 'off' : 'polite');
}

/**
 * Clears everything else that pauses the slideshow — keyboard focus inside it,
 * and the pointer hovering over it — so a test measures the pause button alone.
 * Clicking a control leaves both behind, and either would make "it stayed on
 * slide 1" pass even if the button did nothing.
 */
async function leaveCarousel(page: Page) {
  await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
  await page.mouse.move(0, 0);
}

test.describe('PROGRAM-01-BT-01 restored section', () => {
  test('is on the page with a heading for assistive technology', async ({ page }) => {
    const section = await openSection(page);
    await expect(section).toBeAttached();
    await expect(section.getByRole('heading', { level: 2, name: 'Programs and Activities' })).toBeAttached();
  });

  test('every button goes somewhere real', async ({ page }) => {
    const section = await openSection(page);
    const count = await section.locator('button[aria-label^="Go to slide"]').count();
    expect(count).toBe(3);

    for (let i = 0; i < count; i += 1) {
      await section.locator('button[aria-label^="Go to slide"]').nth(i).click();
      const links = section.locator('[aria-roledescription="slide"] a');
      expect(await links.count(), `slide ${i + 1} has buttons`).toBeGreaterThan(0);

      for (const href of await links.evaluateAll((els) => els.map((el) => el.getAttribute('href')))) {
        // The defect: every link was an empty string.
        expect(href, `slide ${i + 1}`).toBeTruthy();
        expect(href === siteConfig.portalUrl || /^#[a-z-]+$/.test(href!), `slide ${i + 1}: ${href}`).toBe(true);
        if (href!.startsWith('#')) {
          await expect(page.locator(href!), `${href} must be a real section`).toHaveCount(1);
        }
      }
    }
  });

  test('the DevCon Kids banner has no dead "Learn More"', async ({ page }) => {
    const section = await openSection(page);
    await expect(section.getByRole('link', { name: /learn more/i })).toHaveCount(0);
    await expect(section.getByRole('link', { name: /join us/i })).toHaveAttribute('href', siteConfig.portalUrl);
  });

  test('a slide without a banner shows its text instead of an empty gradient', async ({ page }) => {
    const section = await openSection(page);
    await section.getByRole('button', { name: /go to slide 2/i }).click();
    await expect(section.getByRole('heading', { level: 3, name: 'Empowering Next-Gen Developers Daily' })).toBeVisible();
  });

  test('the banner alt text carries the words baked into the artwork', async ({ page }) => {
    const section = await openSection(page);
    const banner = section.locator('img[src*="banner1"]');
    await expect(banner).toHaveAttribute('alt', /every kid can code/);
  });

  test('the bottom-of-page banner is not preloaded', async ({ request }) => {
    // It was `priority`, which preloads a multi-megabyte image in <head> and
    // competes with the hero the Largest Contentful Paint is measured on.
    const html = await (await request.get('/')).text();
    const preloads = html.match(/<link[^>]+rel="preload"[^>]*>/g) ?? [];
    expect(preloads.filter((tag) => tag.includes('banner1'))).toEqual([]);
  });
});

test.describe('PROGRAM-01-BT-01 slideshow motion (WCAG 2.2.2)', () => {
  test('advances on its own while playing', async ({ page }) => {
    await openSection(page);
    await expect(currentSlide(page)).toHaveAttribute('aria-label', '1 of 3');
    await expectPlaying(page, true);
    await page.clock.runFor(ONE_TICK);
    await expect(currentSlide(page)).toHaveAttribute('aria-label', '2 of 3');
  });

  test('stops when paused and resumes when played', async ({ page }) => {
    const section = await openSection(page);
    const toggle = section.getByRole('button', { name: 'Pause slideshow' });
    await toggle.click();
    await expect(section.getByRole('button', { name: 'Play slideshow' })).toBeVisible();

    await leaveCarousel(page);
    await expectPlaying(page, false);
    await page.clock.runFor(ONE_TICK);
    await expect(currentSlide(page)).toHaveAttribute('aria-label', '1 of 3');

    await section.getByRole('button', { name: 'Play slideshow' }).click();
    await leaveCarousel(page);
    await expectPlaying(page, true);
    await page.clock.runFor(ONE_TICK);
    await expect(currentSlide(page)).toHaveAttribute('aria-label', '2 of 3');
  });

  test('does not move while keyboard focus is inside', async ({ page }) => {
    const section = await openSection(page);
    await section.getByRole('link').first().focus();
    await expectPlaying(page, false);
    await page.clock.runFor(ONE_TICK);
    await expect(currentSlide(page)).toHaveAttribute('aria-label', '1 of 3');
  });

  test('holds still while the pointer is over it, and resumes when it leaves', async ({ page }) => {
    const section = await openSection(page);
    // Hover is read from the browser at each tick rather than tracked with
    // enter/leave events, so this is the test that the check actually runs.
    await section.locator('[aria-roledescription="carousel"]').hover({ position: { x: 20, y: 20 } });
    await page.clock.runFor(ONE_TICK);
    await expect(currentSlide(page)).toHaveAttribute('aria-label', '1 of 3');

    await page.mouse.move(0, 0);
    await page.clock.runFor(ONE_TICK);
    await expect(currentSlide(page)).toHaveAttribute('aria-label', '2 of 3');
  });

  test('never auto-plays under reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await openSection(page);
    await expectPlaying(page, false);
    await page.clock.runFor(ONE_TICK);
    await expect(currentSlide(page)).toHaveAttribute('aria-label', '1 of 3');
  });
});
