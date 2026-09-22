import { test, expect } from '@playwright/test';
import { team } from '../lib/content/officers';

/**
 * Regression suite for the DevConnect Portal integration (CMS-03).
 *
 * The portal API key is not available to CI, and deliberately so — these tests
 * therefore cover the two things that must hold whether or not the portal is
 * reachable: the page degrades to bundled content instead of breaking, and the
 * credential never reaches the browser.
 *
 * The happy path — real officers rendered from the portal — is verified by hand
 * against the deployment, because asserting on live content here would make the
 * suite fail whenever someone edits an officer in the portal. A test that breaks
 * when the system is used as intended is worse than no test.
 */

test.describe('CMS-03 graceful degradation', () => {
  test('renders the bundled officers when the portal is unconfigured', async ({ page }) => {
    await page.goto('/');

    const section = page.locator('#officers');
    await expect(section).toBeVisible();

    // The fallback is the bundled list, so the first officer must still appear.
    // Without a PORTAL_API_KEY this is the only path that can run, which makes
    // this the assertion that the site survives an unreachable portal.
    await expect(section.getByText(team[0].name, { exact: true }).first()).toBeVisible();
    await expect(section.getByText(team[0].role, { exact: true }).first()).toBeVisible();
  });

  test('the officers section is never empty', async ({ page }) => {
    await page.goto('/');
    // Whatever the source, a section with a heading and no people is a broken
    // page. This holds for the portal path too: an empty response falls back.
    const headings = page.locator('#officers h3');
    expect(await headings.count()).toBeGreaterThan(0);
  });
});

test.describe('CMS-03 the API key stays on the server', () => {
  test('the browser never calls the portal directly', async ({ page }) => {
    const portalRequests: string[] = [];
    page.on('request', (request) => {
      if (request.url().includes('devconnect-portal')) portalRequests.push(request.url());
    });

    await page.goto('/', { waitUntil: 'load' });

    // A browser-side fetch would ship `x-api-key` to every visitor. CORS would
    // not prevent that — it governs who may read the response, not who may see
    // the request. Fetching server-side is what keeps the credential secret.
    expect(portalRequests).toEqual([]);
  });

  test('no API key material is served to the client', async ({ page, request }) => {
    const html = await (await request.get('/')).text();
    expect(html).not.toContain('x-api-key');
    expect(html).not.toContain('PORTAL_API_KEY');

    // Also check the scripts the page actually loads: an accidental client
    // import would inline the value into a bundle rather than the HTML.
    const scriptUrls: string[] = [];
    page.on('request', (r) => {
      if (r.resourceType() === 'script') scriptUrls.push(r.url());
    });
    await page.goto('/', { waitUntil: 'load' });

    for (const url of scriptUrls) {
      const body = await (await request.get(url)).text();
      expect(body, `${url} must not carry the API key header`).not.toContain('x-api-key');
    }
  });
});
