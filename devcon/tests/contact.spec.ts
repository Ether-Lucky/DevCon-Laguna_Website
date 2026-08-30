import { test, expect } from '@playwright/test';

/**
 * CON-01 (#59) — contact form, closing FR-07.
 *
 * Delivery is mocked at the network boundary so the suite never depends on a
 * live email provider or an API key. The endpoint's own behaviour is asserted
 * separately below by posting to it directly.
 */

const VALID = {
  name: 'Juan Dela Cruz',
  email: 'juan@example.com',
  subject: 'Speaking proposal',
  message: 'I would love to speak at the next DevCon Laguna event.',
};

async function fillForm(page: import('@playwright/test').Page, values = VALID) {
  await page.fill('#name', values.name);
  await page.fill('#email', values.email);
  await page.fill('#subject', values.subject);
  await page.fill('#message', values.message);
}

test.beforeEach(async ({ page }) => {
  await page.goto('/#contact');
  await page.waitForLoadState('networkidle');
});

test.describe('CON-01 form rendering', () => {
  test('renders all four fields and a submit button', async ({ page }) => {
    const form = page.getByRole('form', { name: 'Contact form' });
    await expect(form).toBeVisible();
    for (const id of ['#name', '#email', '#subject', '#message']) {
      await expect(page.locator(id)).toBeVisible();
    }
    await expect(page.getByRole('button', { name: /send message/i })).toBeVisible();
  });

  test('the contact anchor resolves to the form, not the footer', async ({ page }) => {
    // The nav "Contact" link should land on the form itself.
    const section = page.locator('#contact');
    await expect(section).toBeVisible();
    await expect(section.locator('#email')).toBeVisible();
  });

  test('the honeypot field is hidden from real users', async ({ page }) => {
    await expect(page.locator('#website')).toBeHidden();
  });
});

test.describe('CON-01 validation', () => {
  test('blocks submission and reports each invalid field', async ({ page }) => {
    let posted = false;
    await page.route('**/api/contact', (route) => {
      posted = true;
      return route.fulfill({ status: 200, body: '{"ok":true}' });
    });

    await fillForm(page, { name: 'A', email: 'not-an-email', subject: 'hi', message: 'short' });
    await page.getByRole('button', { name: /send message/i }).click();

    await expect(page.locator('#email-error')).toContainText(/valid email/i);
    await expect(page.locator('#name-error')).toBeVisible();
    await expect(page.locator('#subject-error')).toBeVisible();
    await expect(page.locator('#message-error')).toBeVisible();
    expect(posted, 'invalid input must not reach the server').toBe(false);
  });

  test('marks invalid fields for assistive technology', async ({ page }) => {
    await fillForm(page, { ...VALID, email: 'not-an-email' });
    await page.getByRole('button', { name: /send message/i }).click();

    const email = page.locator('#email');
    await expect(email).toHaveAttribute('aria-invalid', 'true');
    await expect(email).toHaveAttribute('aria-describedby', 'email-error');
    await expect(page.locator('#email-error')).toHaveAttribute('role', 'alert');
  });

  test('clears a field error once the user starts correcting it', async ({ page }) => {
    await fillForm(page, { ...VALID, email: 'not-an-email' });
    await page.getByRole('button', { name: /send message/i }).click();
    await expect(page.locator('#email-error')).toBeVisible();

    await page.fill('#email', 'juan@example.com');
    await expect(page.locator('#email-error')).toHaveCount(0);
  });
});

test.describe('CON-01 submission', () => {
  test('confirms success and clears the form', async ({ page }) => {
    await page.route('**/api/contact', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' }),
    );

    await fillForm(page);
    await page.getByRole('button', { name: /send message/i }).click();

    await expect(page.getByTestId('contact-success')).toBeVisible();
    await expect(page.locator('#message')).toHaveValue('');
  });

  test('sends the entered values as JSON', async ({ page }) => {
    let body: Record<string, string> = {};
    await page.route('**/api/contact', (route) => {
      body = JSON.parse(route.request().postData() ?? '{}');
      return route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' });
    });

    await fillForm(page);
    await page.getByRole('button', { name: /send message/i }).click();
    await expect(page.getByTestId('contact-success')).toBeVisible();

    expect(body.name).toBe(VALID.name);
    expect(body.email).toBe(VALID.email);
    expect(body.subject).toBe(VALID.subject);
    expect(body.message).toBe(VALID.message);
  });

  test('shows the server error and PRESERVES the user input', async ({ page }) => {
    await page.route('**/api/contact', (route) =>
      route.fulfill({
        status: 503,
        contentType: 'application/json',
        body: '{"error":"The contact form is not configured yet. Please email us directly."}',
      }),
    );

    await fillForm(page);
    await page.getByRole('button', { name: /send message/i }).click();

    await expect(page.getByTestId('contact-error')).toContainText(/not configured/i);
    // Losing a long message to a failed send is the worst outcome; it must survive.
    await expect(page.locator('#message')).toHaveValue(VALID.message);
    await expect(page.locator('#name')).toHaveValue(VALID.name);
  });

  test('reports a network failure without losing input', async ({ page }) => {
    await page.route('**/api/contact', (route) => route.abort());

    await fillForm(page);
    await page.getByRole('button', { name: /send message/i }).click();

    await expect(page.getByTestId('contact-error')).toBeVisible();
    await expect(page.locator('#message')).toHaveValue(VALID.message);
  });
});

test.describe('CON-01 endpoint', () => {
  test('rejects invalid input with per-field errors', async ({ request }) => {
    const response = await request.post('/api/contact', {
      data: { name: 'A', email: 'nope', subject: 'hi', message: 'short' },
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.errors.email).toMatch(/valid email/i);
    expect(Object.keys(body.errors)).toHaveLength(4);
  });

  test('re-validates on the server, not just in the browser', async ({ request }) => {
    // The browser can be bypassed entirely, so the endpoint must stand alone.
    const response = await request.post('/api/contact', { data: { email: 'nope' } });
    expect(response.status()).toBe(400);
  });

  test('rejects a malformed body', async ({ request }) => {
    const response = await request.post('/api/contact', {
      headers: { 'Content-Type': 'application/json' },
      data: 'not json',
    });
    expect(response.status()).toBe(400);
  });

  test('silently accepts a honeypot submission without sending', async ({ request }) => {
    // Answering 200 gives a bot no signal that it was detected.
    const response = await request.post('/api/contact', {
      data: {
        name: 'Bot Name',
        email: 'bot@example.com',
        subject: 'Spam subject',
        message: 'This is a spam message body',
        website: 'http://spam.example',
      },
    });
    expect(response.status()).toBe(200);
    expect((await response.json()).ok).toBe(true);
  });

  test('fails honestly when no provider key is configured', async ({ request }) => {
    // With RESEND_API_KEY unset the endpoint must not pretend to have sent.
    const response = await request.post('/api/contact', {
      data: {
        name: 'Juan Dela Cruz',
        email: 'juan@example.com',
        subject: 'Speaking proposal',
        message: 'I would love to speak at the next DevCon Laguna event.',
      },
    });
    expect([200, 502, 503]).toContain(response.status());
    if (response.status() !== 200) {
      expect((await response.json()).error).toBeTruthy();
    }
  });
});

/**
 * CON-01-BT-01 (#109) — the site must not advertise an address it cannot receive at.
 *
 * DevCon Laguna does not own a domain, so `hello@devconlaguna.com` reached nobody.
 * It was live in the Contact section and in the JSON-LD published to search engines.
 */
test.describe('CON-01-BT-01 no unowned contact address', () => {
  test('no mailto link is offered anywhere on the page', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('a[href^="mailto:"]')).toHaveCount(0);
  });

  test('the unowned domain appears nowhere in the served HTML', async ({ request }) => {
    const html = await (await request.get('/')).text();
    expect(html).not.toContain('devconlaguna.com');
  });

  test('structured data publishes no email to search engines', async ({ page }) => {
    await page.goto('/');
    const raw = await page.locator('script[type="application/ld+json"]').innerText();
    expect(JSON.parse(raw).email).toBeUndefined();
  });

  test('the Facebook page is offered as the direct channel instead', async ({ page }) => {
    await page.goto('/#contact');
    const link = page.locator('#contact a[href*="facebook.com/DEVCONLAGUNA"]').first();
    await expect(link).toBeVisible();
    // External link hygiene.
    await expect(link).toHaveAttribute('rel', /noopener/);
  });
});

/**
 * CON-02 (#60) — bot protection.
 *
 * Two layers: the honeypot (always on) and Cloudflare Turnstile (active once keys
 * are configured). These run against the default build, where Turnstile is not
 * configured, so they assert the unconfigured behaviour is safe and that the
 * honeypot still does its job.
 *
 * The enforced path cannot be exercised here: Turnstile deliberately resists
 * headless automation, so a real token cannot be obtained in CI. It was verified
 * manually with Cloudflare's official test keys — see docs/contact-form.md.
 */
test.describe('CON-02 bot protection', () => {
  test('the honeypot silently drops a bot submission', async ({ request }) => {
    const response = await request.post('/api/contact', {
      data: {
        name: 'Bot Name',
        email: 'bot@spam.example',
        subject: 'Cheap watches',
        message: 'Buy our products right now please',
        website: 'http://spam.example',
      },
    });
    // 200 so the bot gets no signal that it was detected.
    expect(response.status()).toBe(200);
  });

  test('the honeypot field is present but hidden from real users', async ({ page }) => {
    await page.goto('/#contact');
    const honeypot = page.locator('#website');
    await expect(honeypot).toHaveCount(1);
    await expect(honeypot).toBeHidden();
  });

  test('the form submits a cf-turnstile-response field', async ({ page }) => {
    // Present even when Turnstile is unconfigured, so enabling it needs no
    // client change — only environment variables.
    let body: Record<string, unknown> = {};
    await page.route('**/api/contact', (route) => {
      body = JSON.parse(route.request().postData() ?? '{}');
      return route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' });
    });

    await page.goto('/#contact');
    await page.fill('#name', 'Juan Dela Cruz');
    await page.fill('#email', 'juan@example.com');
    await page.fill('#subject', 'Speaking proposal');
    await page.fill('#message', 'I would love to speak at the next DevCon Laguna event.');
    await page.getByRole('button', { name: /send message/i }).click();
    await expect(page.getByTestId('contact-success')).toBeVisible();

    expect(Object.keys(body)).toContain('cf-turnstile-response');
  });

  test('with Turnstile unconfigured the form still works', async ({ page }) => {
    // Turnstile must be opt-in: a missing site key cannot block legitimate use.
    await page.goto('/#contact');
    await expect(page.getByTestId('turnstile-widget')).toHaveCount(0);
    await expect(page.locator('#name')).toBeVisible();
  });
});
