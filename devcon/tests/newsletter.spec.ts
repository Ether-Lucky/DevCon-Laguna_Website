import { test, expect } from '@playwright/test';

/**
 * NEWS-01 (#66) while the portal's list is not live.
 *
 * These projects run with no `NEWSLETTER_ENABLED` and no portal key, which is
 * production until the portal team ships the endpoint. A visitor must not meet
 * a form that cannot work. The enabled path is in portal-data.spec.ts.
 */
test.describe('NEWS-01 newsletter sign-up before the portal is ready', () => {
  test('no sign-up form is shown', async ({ page }) => {
    await page.goto('/', { waitUntil: 'load' });
    await expect(page.locator('footer')).toBeVisible();
    await expect(page.getByTestId('newsletter-form')).toHaveCount(0);
    await expect(page.locator('#newsletter-email')).toHaveCount(0);
  });

  test('the Privacy Policy does not describe a list that is not live', async ({ page }) => {
    await page.goto('/privacy', { waitUntil: 'load' });
    await expect(page.getByRole('heading', { name: 'What we collect, and why' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'When you subscribe to event updates' })).toHaveCount(0);
  });

  test('the endpoint says it is not open rather than pretending to succeed', async ({ request }) => {
    const response = await request.post('/api/newsletter', { data: { email: 'visitor@example.com' } });
    expect(response.status()).toBe(503);
    expect((await response.json()).error).toMatch(/not open yet/i);
  });
});
