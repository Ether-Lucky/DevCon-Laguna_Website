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
// and had its snapshot removed in 94e664c. The Programs & Activities section is
// deliberately still uncovered because it is not rendered on the page (see #87).
test('officers section snapshot', async ({ page }) => {
  await expect(page.locator('#officers')).toHaveScreenshot('officers-section.png', {
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
