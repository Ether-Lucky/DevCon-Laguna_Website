import { test, expect } from '@playwright/test';
import { checkRevalidateAuth, MIN_SECRET_LENGTH } from '../lib/revalidate-auth';

/**
 * Regression suite for CMS-06 (#79) — the authenticated revalidation endpoint.
 *
 * The auth check is tested directly, branch by branch, because CI has no secret
 * configured and should not: a real secret in CI would be one more place for it
 * to leak. The route itself is then tested in the state CI actually runs in —
 * unconfigured — where it must refuse every request.
 *
 * The happy path, a real publish reaching the page, was verified by hand against
 * a mock portal; see docs/portal-api.md.
 */

const secret = 'a'.repeat(MIN_SECRET_LENGTH);

test.describe('CMS-06 revalidation auth', () => {
  test('accepts the correct bearer secret', () => {
    expect(checkRevalidateAuth(`Bearer ${secret}`, secret)).toEqual({ status: 'ok' });
  });

  test('refuses everything when no secret is configured', () => {
    // The important case: a missing env var must never mean "open to anyone".
    expect(checkRevalidateAuth(`Bearer ${secret}`, undefined).status).toBe('unconfigured');
    expect(checkRevalidateAuth(`Bearer `, '').status).toBe('unconfigured');
    expect(checkRevalidateAuth(null, undefined).status).toBe('unconfigured');
  });

  test('treats a too-short secret as unconfigured', () => {
    const short = 'a'.repeat(MIN_SECRET_LENGTH - 1);
    expect(checkRevalidateAuth(`Bearer ${short}`, short).status).toBe('unconfigured');
  });

  test('rejects a missing, malformed or wrong header', () => {
    expect(checkRevalidateAuth(null, secret)).toEqual({ status: 'unauthorized', reason: 'missing' });
    for (const header of [secret, `Basic ${secret}`, `Bearer`, `Bearer ${secret} extra`, `bearer:${secret}`]) {
      expect(checkRevalidateAuth(header, secret), header).toEqual({ status: 'unauthorized', reason: 'malformed' });
    }
    for (const header of [`Bearer ${'b'.repeat(MIN_SECRET_LENGTH)}`, `Bearer ${secret}x`, `Bearer ${secret.slice(1)}`]) {
      expect(checkRevalidateAuth(header, secret), header).toEqual({ status: 'unauthorized', reason: 'mismatch' });
    }
  });
});

test.describe('CMS-06 revalidation endpoint', () => {
  test('refuses to revalidate when no secret is configured', async ({ request }) => {
    test.skip(Boolean(process.env.PORTAL_REVALIDATE_SECRET), 'only meaningful when unconfigured');
    const response = await request.post('/api/revalidate', {
      headers: { authorization: `Bearer ${secret}` },
    });
    expect(response.status()).toBe(503);
    expect(await response.json()).toMatchObject({ revalidated: false });
  });

  test('does not reveal why a request was rejected', async ({ request }) => {
    const response = await request.post('/api/revalidate');
    expect([401, 503]).toContain(response.status());
    const body = JSON.stringify(await response.json());
    for (const word of ['missing', 'malformed', 'mismatch']) {
      expect(body, `response must not say "${word}"`).not.toContain(word);
    }
  });

  test('only accepts POST', async ({ request }) => {
    const response = await request.get('/api/revalidate');
    expect(response.status()).toBe(405);
  });
});
