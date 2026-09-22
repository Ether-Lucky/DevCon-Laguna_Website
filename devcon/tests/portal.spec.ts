import { test, expect } from '@playwright/test';
import { team } from '../lib/content/officers';
import { isAllowedRemoteImage, remoteImagePatterns } from '../lib/remote-images';

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

test.describe('CMS-03 photo guard', () => {
  /**
   * Regression for a production incident: the portal held officers whose photos
   * were Tenor GIF links rather than uploads. `next/image` rejected them with a
   * 400 and the landing page showed broken images. Photos are now checked
   * against the same allowlist `next.config.ts` uses, and an unrenderable one
   * falls back to the officer's initials.
   *
   * These call the checker directly, so they run without a portal or a key.
   */
  const supabase = 'https://vdqczedgmehendqqifgs.supabase.co/storage/v1/object/public/avatars/a.jpg';

  test('accepts a portal Supabase Storage photo', () => {
    expect(isAllowedRemoteImage(supabase)).toBe(true);
  });

  test('rejects the Tenor links that broke production', () => {
    expect(isAllowedRemoteImage('https://media.tenor.com/gzMIpUy6gBEAAAAM/laufey.gif')).toBe(false);
    expect(isAllowedRemoteImage('https://media1.tenor.com/m/BwlmCWtzaskAAAAd/laufey.gif')).toBe(false);
  });

  test('rejects near misses an allowlist must not wave through', () => {
    const cases = [
      // Another Supabase project: a wildcard would have trusted it.
      'https://someoneelse.supabase.co/storage/v1/object/public/a.jpg',
      // Right host, private bucket path.
      'https://vdqczedgmehendqqifgs.supabase.co/storage/v1/object/sign/a.jpg',
      // Prefix match without the slash.
      'https://vdqczedgmehendqqifgs.supabase.co/storage/v1/object/publicity/a.jpg',
      // Traversal out of the public path, normalised by the URL parser.
      'https://vdqczedgmehendqqifgs.supabase.co/storage/v1/object/public/../sign/a.jpg',
      // Plain HTTP.
      'http://vdqczedgmehendqqifgs.supabase.co/storage/v1/object/public/a.jpg',
      // The host as a subdomain of something else.
      'https://vdqczedgmehendqqifgs.supabase.co.evil.example/storage/v1/object/public/a.jpg',
      // Non-default port.
      'https://vdqczedgmehendqqifgs.supabase.co:8443/storage/v1/object/public/a.jpg',
      // Not a URL at all.
      'not a url',
      '',
    ];
    for (const url of cases) {
      expect(isAllowedRemoteImage(url), url).toBe(false);
    }
  });

  test('next.config.ts uses the same list', async () => {
    // If the config grew its own copy, a host added to one list and not the
    // other would bring the broken-image failure back.
    // Playwright loads the config through CommonJS interop, which wraps the
    // default export twice, so unwrap until we reach the config object.
    type Config = import('next').NextConfig;
    let loaded: unknown = await import('../next.config');
    while (loaded && typeof loaded === 'object' && 'default' in loaded && !('images' in loaded)) {
      loaded = (loaded as { default: unknown }).default;
    }
    const config = loaded as Config;
    expect(config.images, 'next.config.ts should define images').toBeDefined();
    // Compared by content, not identity: the test loader can give each file
    // its own module instance. What matters is that both allow exactly the
    // same hosts.
    expect(config.images?.remotePatterns).toEqual(remoteImagePatterns);
  });
});
