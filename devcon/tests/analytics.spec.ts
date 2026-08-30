import { test, expect, type Page } from '@playwright/test';

/**
 * ANL-01 (#65) — Vercel Web Analytics.
 *
 * `@vercel/analytics` pushes into `window.va`, so a stub installed before page
 * scripts run captures exactly what would be reported. The real collection
 * endpoint only exists on Vercel deployments; nothing here sends live data.
 */

type Captured = [string, Record<string, unknown>][];

/** Installs a `window.va` stub that records everything reported. */
async function captureAnalytics(page: Page) {
  await page.addInitScript(() => {
    const w = window as unknown as Record<string, unknown>;
    w.__events = [];
    w.va = (...args: unknown[]) => {
      (w.__events as unknown[]).push(args);
    };
  });
}

const events = (page: Page) =>
  page.evaluate(() => (window as unknown as Record<string, unknown>).__events as Captured);

test.describe('ANL-01 pageviews', () => {
  test('reports a pageview for the landing page', async ({ page }) => {
    await captureAnalytics(page);
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const captured = await events(page);
    const pageview = captured.find(([type]) => type === 'pageview');
    expect(pageview, 'a pageview should be reported').toBeTruthy();
    expect(pageview![1].path).toBe('/');
  });
});

test.describe('ANL-01 CTA tracking', () => {
  test('the primary CTAs are marked for tracking', async ({ page }) => {
    await page.goto('/');
    for (const id of ['nav-join-us', 'hero-volunteer', 'hero-learn-more']) {
      await expect(page.locator(`[data-analytics-id="${id}"]`).first()).toHaveCount(1);
    }
  });

  test('clicking a CTA reports it with its id and label', async ({ page }) => {
    await captureAnalytics(page);
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await page.locator('[data-analytics-id="hero-volunteer"]').first().click();

    const captured = await events(page);
    const cta = captured.find(([type, payload]) => type === 'event' && payload.name === 'cta_click');
    expect(cta, 'a cta_click event should be reported').toBeTruthy();
    expect((cta![1].data as Record<string, string>).id).toBe('hero-volunteer');
    expect((cta![1].data as Record<string, string>).label).toBe('Volunteer');
  });

  test('clicking an untracked element reports nothing', async ({ page }) => {
    await captureAnalytics(page);
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await page.locator('h1').first().click();

    const captured = await events(page);
    expect(captured.filter(([, p]) => p.name === 'cta_click')).toHaveLength(0);
  });
});

test.describe('ANL-01 contact conversion', () => {
  test('reports contact_submitted only after a confirmed send', async ({ page }) => {
    await captureAnalytics(page);
    await page.route('**/api/contact', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' }),
    );

    await page.goto('/#contact');
    await page.waitForLoadState('networkidle');
    await page.fill('#name', 'Juan Dela Cruz');
    await page.fill('#email', 'juan@example.com');
    await page.fill('#subject', 'Speaking proposal');
    await page.fill('#message', 'I would love to speak at the next DevCon Laguna event.');
    await page.getByRole('button', { name: /send message/i }).click();
    await expect(page.getByTestId('contact-success')).toBeVisible();

    const captured = await events(page);
    const submitted = captured.find(
      ([type, payload]) => type === 'event' && payload.name === 'contact_submitted',
    );
    expect(submitted, 'a confirmed send should be reported').toBeTruthy();
  });

  test('does NOT report a submission that failed', async ({ page }) => {
    // The metric must count real enquiries, not attempts.
    await captureAnalytics(page);
    await page.route('**/api/contact', (route) =>
      route.fulfill({ status: 503, contentType: 'application/json', body: '{"error":"nope"}' }),
    );

    await page.goto('/#contact');
    await page.waitForLoadState('networkidle');
    await page.fill('#name', 'Juan Dela Cruz');
    await page.fill('#email', 'juan@example.com');
    await page.fill('#subject', 'Speaking proposal');
    await page.fill('#message', 'I would love to speak at the next DevCon Laguna event.');
    await page.getByRole('button', { name: /send message/i }).click();
    await expect(page.getByTestId('contact-error')).toBeVisible();

    const captured = await events(page);
    expect(captured.filter(([, p]) => p.name === 'contact_submitted')).toHaveLength(0);
  });
});

test.describe('ANL-01 resilience', () => {
  test('a blocked analytics script does not break the contact form', async ({ page }) => {
    // Ad blockers are common. They do not make `window.va` throw — they stop the
    // insights script loading, leaving `va` undefined and `track()` a no-op. This
    // reproduces that, and asserts the form still works with no analytics at all.
    await page.route('**/_vercel/insights/**', (route) => route.abort());
    await page.route('**/api/contact', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' }),
    );

    await page.goto('/#contact');
    await page.waitForLoadState('networkidle');

    // `window.va` still exists — the package installs its own queue stub — but with
    // the script blocked nothing is ever delivered. What matters is that the page
    // and the form carry on regardless.

    await page.fill('#name', 'Juan Dela Cruz');
    await page.fill('#email', 'juan@example.com');
    await page.fill('#subject', 'Speaking proposal');
    await page.fill('#message', 'I would love to speak at the next DevCon Laguna event.');
    await page.getByRole('button', { name: /send message/i }).click();

    await expect(page.getByTestId('contact-success')).toBeVisible();
  });
});
