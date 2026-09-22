import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.locator('#splash-screen').waitFor({ state: 'detached', timeout: 5000 });

  await page.addStyleTag({
    content: `
      main > div { opacity: 1 !important; transform: none !important; }
      [style*="opacity"] { opacity: 1 !important; }
    `,
  });

  await page.evaluate(() => {
    const timeout = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
    const fontReady = document.fonts.ready.then(() => {});
    const imagePromises = Array.from(document.images).map((img) => {
      if (img.complete) return Promise.resolve();
      return new Promise<void>((r) => {
        const done = () => r();
        img.onload = done;
        img.onerror = done;
        setTimeout(done, 3000);
      });
    });
    return Promise.race([Promise.all([fontReady, ...imagePromises]), timeout(10000)]);
  });
  await page.waitForTimeout(500);
});

test('full page snapshot', async ({ page }) => {
  await expect(page).toHaveScreenshot('full-page.png', {
    fullPage: true,
    maxDiffPixelRatio: 0.01,
    timeout: 60000,
  });
});

test('hero section snapshot', async ({ page }) => {
  await expect(page.locator('#hero')).toHaveScreenshot('hero-section.png', {
    maxDiffPixelRatio: 0.01,
    timeout: 60000,
  });
});

test('stats section snapshot', async ({ page }) => {
  await expect(page.locator('#partners')).toHaveScreenshot('stats-section.png', {
    maxDiffPixelRatio: 0.01,
    timeout: 60000,
  });
});

test('about section snapshot', async ({ page }) => {
  await expect(page.locator('#about')).toHaveScreenshot('about-section.png', {
    maxDiffPixelRatio: 0.01,
    timeout: 60000,
  });
});

test('mission vision section snapshot', async ({ page }) => {
  await expect(page.locator('#mission-vision')).toHaveScreenshot('mission-vision-section.png', {
    maxDiffPixelRatio: 0.01,
    timeout: 60000,
  });
});

test('events section snapshot', async ({ page }) => {
  await expect(page.locator('section').filter({ has: page.getByRole('heading', { name: 'Featured Events' }) })).toHaveScreenshot('events-section.png', {
    maxDiffPixelRatio: 0.01,
    timeout: 60000,
  });
});

// Restored coverage: the Officers section renders from the content data layer
// and had its snapshot removed in 94e664c.
test('officers section snapshot', async ({ page }) => {
  await expect(page.locator('#officers')).toHaveScreenshot('officers-section.png', {
    maxDiffPixelRatio: 0.01,
    timeout: 60000,
  });
});

// Programs & Activities is back on the page (PROGRAM-01-BT-01, #87). The
// slideshow does not auto-advance here: every test runs with reduced motion,
// which the carousel honours, so the capture is always slide 1.
test('programs and activities section snapshot', async ({ page }) => {
  // The banner is lazy-loaded (it sits at the bottom of the page and must not
  // compete with the hero), so it only starts loading once scrolled to. The
  // first version of this snapshot captured the section before it arrived and
  // recorded an empty gradient as the baseline — wait for the real image.
  const section = page.locator('#activities');
  await section.scrollIntoViewIfNeeded();
  await page.waitForFunction(() => {
    const img = document.querySelector('#activities img') as HTMLImageElement | null;
    return !!img && img.complete && img.naturalWidth > 0;
  });
  await expect(section).toHaveScreenshot('programs-section.png', {
    maxDiffPixelRatio: 0.01,
    timeout: 60000,
  });
});

test('footer snapshot', async ({ page }) => {
  await expect(page.locator('footer')).toHaveScreenshot('footer-section.png', {
    maxDiffPixelRatio: 0.01,
    timeout: 60000,
  });
});

test('navbar snapshot', async ({ page }) => {
  await expect(page.getByRole('navigation')).toHaveScreenshot('navbar.png', {
    maxDiffPixelRatio: 0.01,
    timeout: 60000,
  });
});
