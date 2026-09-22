import { createHash, timingSafeEqual } from 'node:crypto';

/**
 * Authentication for the on-demand revalidation endpoint (CMS-06).
 *
 * Kept apart from the route so every branch can be tested directly, without a
 * running server or a configured secret.
 *
 * The caller presents `Authorization: Bearer <secret>`, where the secret is
 * `PORTAL_REVALIDATE_SECRET`, shared with the DevConnect Portal.
 */

export type RevalidateAuth =
  | { status: 'ok' }
  /** No secret configured on our side. The endpoint must refuse, never fall open. */
  | { status: 'unconfigured' }
  | { status: 'unauthorized'; reason: 'missing' | 'malformed' | 'mismatch' };

/**
 * Secrets shorter than this are refused as a configuration error. A short
 * shared secret on a public endpoint can be guessed; 32 characters is the floor
 * that `openssl rand -hex 16` or the documented node command comfortably clear.
 */
export const MIN_SECRET_LENGTH = 32;

/**
 * Compares in constant time.
 *
 * `timingSafeEqual` throws on inputs of different lengths, and checking the
 * length first would leak it. Hashing both sides first gives two equal-length
 * digests, so the comparison takes the same time whatever was sent.
 */
function safeEqual(a: string, b: string): boolean {
  const digest = (value: string) => createHash('sha256').update(value).digest();
  return timingSafeEqual(digest(a), digest(b));
}

export function checkRevalidateAuth(
  authorization: string | null,
  secret: string | undefined,
): RevalidateAuth {
  if (!secret || secret.length < MIN_SECRET_LENGTH) return { status: 'unconfigured' };
  if (!authorization) return { status: 'unauthorized', reason: 'missing' };

  const match = authorization.match(/^Bearer\s+(\S+)$/);
  if (!match) return { status: 'unauthorized', reason: 'malformed' };

  return safeEqual(match[1], secret)
    ? { status: 'ok' }
    : { status: 'unauthorized', reason: 'mismatch' };
}
