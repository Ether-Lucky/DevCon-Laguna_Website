import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.locator('#splash-screen').waitFor({ state: 'detached', timeout: 5000 });
  await page.waitForTimeout(500);
});

test('full page snapshot', async ({ page }) => {
  await expect(page).toHaveScreenshot('full-page.png', {
    fullPage: true,
    maxDiffPixelRatio: 0.01,
    timeout: 30000,
  });
});

test('hero section snapshot', async ({ page }) => {
  await expect(page.locator('#hero')).toHaveScreenshot('hero-section.png', {
    maxDiffPixelRatio: 0.01,
    timeout: 15000,
  });
});

test('stats section snapshot', async ({ page }) => {
  await expect(page.locator('#stats')).toHaveScreenshot('stats-section.png', {
    maxDiffPixelRatio: 0.01,
    timeout: 15000,
  });
});

test('about section snapshot', async ({ page }) => {
  await expect(page.locator('#about')).toHaveScreenshot('about-section.png', {
    maxDiffPixelRatio: 0.01,
    timeout: 15000,
  });
});

test('mission vision section snapshot', async ({ page }) => {
  await expect(page.locator('#mission-vision')).toHaveScreenshot('mission-vision-section.png', {
    maxDiffPixelRatio: 0.01,
    timeout: 15000,
  });
});

test('events section snapshot', async ({ page }) => {
  await expect(page.locator('section').filter({ has: page.getByRole('heading', { name: 'Featured Events' }) })).toHaveScreenshot('events-section.png', {
    maxDiffPixelRatio: 0.01,
    timeout: 15000,
  });
});

test('footer snapshot', async ({ page }) => {
  await expect(page.locator('footer')).toHaveScreenshot('footer-section.png', {
    maxDiffPixelRatio: 0.01,
    timeout: 15000,
  });
});

test('navbar snapshot', async ({ page }) => {
  await expect(page.getByRole('navigation')).toHaveScreenshot('navbar.png', {
    maxDiffPixelRatio: 0.01,
    timeout: 15000,
  });
});
