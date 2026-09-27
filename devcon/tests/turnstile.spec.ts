import { test, expect } from '@playwright/test';
import { verifyTurnstile } from '../lib/turnstile';

/**
 * CON-02-BT-01 (#199): the server-side Turnstile check, against canned
 * siteverify answers. The log reason must say what Cloudflare returned, and every
 * check must still reject: a better message must never mean a weaker gate.
 *
 * Runs in Node; no browser is involved, so one project is enough.
 */
test.skip(({ browserName }) => browserName !== 'chromium', 'Node-only; browser-independent');

const REAL_LOOKING_SECRET = '0x4AAAAAAAfixtureSecretValue000000000';
const HOST = 'dev-con-laguna-website-nine.vercel.app';

let realFetch: typeof fetch;
let calls = 0;

function answer(body: Record<string, unknown>) {
  globalThis.fetch = (async () => {
    calls += 1;
    return new Response(JSON.stringify(body), { status: 200, headers: { 'content-type': 'application/json' } });
  }) as typeof fetch;
}

test.beforeEach(() => {
  realFetch = globalThis.fetch;
  calls = 0;
  process.env.TURNSTILE_SECRET = REAL_LOOKING_SECRET;
  process.env.TURNSTILE_HOSTNAMES = HOST;
});

test.afterEach(() => {
  globalThis.fetch = realFetch;
  delete process.env.TURNSTILE_SECRET;
  delete process.env.TURNSTILE_HOSTNAMES;
});

test.describe('CON-02-BT-01 Turnstile verification', () => {
  test('passes a token issued for this action on this host', async () => {
    answer({ success: true, action: 'contact', hostname: HOST });
    expect(await verifyTurnstile('token', 'contact')).toEqual({ status: 'ok' });
  });

  test('an action mismatch names what Cloudflare returned', async () => {
    answer({ success: true, action: 'test', hostname: 'example.com' });
    expect(await verifyTurnstile('token', 'contact')).toEqual({
      status: 'failed',
      reason: 'action-mismatch (received "test", expected "contact")',
    });
  });

  test('a missing action is reported as null, and still rejects', async () => {
    answer({ success: true, hostname: HOST });
    expect(await verifyTurnstile('token', 'contact')).toEqual({
      status: 'failed',
      reason: 'action-mismatch (received null, expected "contact")',
    });
  });

  test('a hostname mismatch names the host and the allowlist', async () => {
    answer({ success: true, action: 'contact', hostname: 'evil.example' });
    expect(await verifyTurnstile('token', 'contact')).toEqual({
      status: 'failed',
      reason: `hostname-mismatch (received "evil.example", allowed ${HOST})`,
    });
  });

  test("Cloudflare's own rejection passes its error codes through", async () => {
    answer({ success: false, 'error-codes': ['invalid-input-response'] });
    expect(await verifyTurnstile('token', 'contact')).toEqual({ status: 'failed', reason: 'invalid-input-response' });
  });

  for (const secret of ['1x0000000000000000000000000000000AA', '2x0000000000000000000000000000000AA']) {
    test(`a Cloudflare test secret (${secret.slice(0, 2)}…) is named, and Cloudflare is never asked`, async () => {
      process.env.TURNSTILE_SECRET = secret;
      answer({ success: true, action: 'contact', hostname: HOST });
      expect(await verifyTurnstile('token', 'contact')).toEqual({ status: 'failed', reason: 'test-secret' });
      expect(calls).toBe(0);
    });
  }

  test('the reason never contains the secret or the token', async () => {
    answer({ success: true, action: 'other', hostname: 'elsewhere.example' });
    const result = await verifyTurnstile('the-visitor-token', 'contact');
    const text = JSON.stringify(result);
    expect(text).not.toContain(REAL_LOOKING_SECRET);
    expect(text).not.toContain('the-visitor-token');
  });
});
