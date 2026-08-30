/**
 * Server-side Cloudflare Turnstile verification (CON-02).
 *
 * Never call this from the browser: it uses the secret, which must stay on the
 * server. The flow is always browser → our endpoint → siteverify.
 *
 * Environment variables:
 *   NEXT_PUBLIC_TURNSTILE_SITE_KEY  public site key, safe to expose
 *   TURNSTILE_SECRET                secret key, server only
 *   TURNSTILE_HOSTNAMES             comma-separated hostnames the widget may be
 *                                   solved on, e.g. "dev-con-laguna-website-nine.vercel.app"
 *
 * A production value for TURNSTILE_HOSTNAMES must NOT contain localhost or
 * 127.0.0.1 — accepting those in production would let a token solved on a local
 * page be replayed against the live site.
 */

const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

/** Tokens are well under this; the cap stops an oversized body reaching Cloudflare. */
const MAX_TOKEN_LENGTH = 2048;

export type TurnstileOutcome =
  | { status: 'skipped' }
  | { status: 'ok' }
  | { status: 'failed'; reason: string };

/** Turnstile is only enforced once a secret is configured. */
export function isTurnstileEnabled(): boolean {
  return Boolean(process.env.TURNSTILE_SECRET);
}

function expectedHostnames(): Set<string> {
  return new Set(
    (process.env.TURNSTILE_HOSTNAMES ?? '')
      .split(',')
      .map((hostname) => hostname.trim())
      .filter(Boolean),
  );
}

/**
 * Verifies a Turnstile token.
 *
 * Returns `skipped` when no secret is configured, so the contact form keeps
 * working before Turnstile is set up — the honeypot still applies. Once a secret
 * IS set, every failure path is closed: a network error, a non-2xx response, a
 * non-JSON body, a mismatched action or an unexpected hostname all reject.
 *
 * Checking `success` alone is not enough. Without the action check a token minted
 * for another surface would pass, and without the hostname check a token solved on
 * an attacker's page using the same site key would pass.
 */
export async function verifyTurnstile(
  token: unknown,
  expectedAction: string,
  remoteIp?: string | null,
): Promise<TurnstileOutcome> {
  const secret = process.env.TURNSTILE_SECRET;
  if (!secret) return { status: 'skipped' };

  const hostnames = expectedHostnames();
  if (hostnames.size === 0) {
    // Enforcing with no allowlist would accept a token solved anywhere.
    console.error('[turnstile] TURNSTILE_SECRET is set but TURNSTILE_HOSTNAMES is empty.');
    return { status: 'failed', reason: 'missing-hostname-allowlist' };
  }

  if (typeof token !== 'string' || token.length === 0 || token.length > MAX_TOKEN_LENGTH) {
    return { status: 'failed', reason: 'missing-token' };
  }

  const body = new URLSearchParams({ secret, response: token });
  if (remoteIp) body.set('remoteip', remoteIp);

  let result: {
    success?: boolean;
    action?: string;
    hostname?: string;
    'error-codes'?: string[];
  };

  try {
    const response = await fetch(SITEVERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      signal: AbortSignal.timeout(10_000),
      body,
    });
    if (!response.ok) throw new Error(`siteverify ${response.status}`);
    result = await response.json();
  } catch (error) {
    // Fail closed: an unreachable or misbehaving siteverify must not wave traffic through.
    console.error('[turnstile] siteverify request failed:', error);
    return { status: 'failed', reason: 'siteverify-unreachable' };
  }

  if (!result.success) {
    return { status: 'failed', reason: (result['error-codes'] ?? ['rejected']).join(',') };
  }
  if (result.action !== expectedAction) {
    return { status: 'failed', reason: 'action-mismatch' };
  }
  if (!result.hostname || !hostnames.has(result.hostname)) {
    return { status: 'failed', reason: 'hostname-mismatch' };
  }

  return { status: 'ok' };
}
