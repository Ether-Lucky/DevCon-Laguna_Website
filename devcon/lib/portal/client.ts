import 'server-only';

import { parseEvents, parseLandingImages, parseOfficers, parsePosts } from './parse';
import type { PortalLanding, PortalPost } from './types';

/**
 * Client for the DevConnect Portal's public API (CMS-02, CMS-03).
 *
 * `server-only` is the first line for a reason. The API key is a credential; a
 * browser fetch would ship it to every visitor, and CORS would not prevent that
 * — it only decides who may read the response, not who may see the request. The
 * import makes an accidental client import a build error rather than a leak.
 *
 * For the same reason the variable is `PORTAL_API_KEY` and not the portal's own
 * `PUBLIC_API_KEY`: the word "public" next to a secret invites someone to add a
 * `NEXT_PUBLIC_` prefix, which would inline it into the browser bundle.
 *
 * Environment variables:
 *   PORTAL_API_BASE_URL  defaults to the portal's production URL
 *   PORTAL_API_KEY       the x-api-key credential, server only
 */

const DEFAULT_BASE_URL = 'https://devconnect-portal-seven.vercel.app';

/** Half an hour, the interval the landing page content is allowed to lag by. */
export const REVALIDATE_SECONDS = 1800;

/** Cache tag for on-demand revalidation, so publishing can be made instant (CMS-06). */
export const PORTAL_CONTENT_TAG = 'portal-content';

/** Beyond this, a slow portal is worse than no portal: the page must still render. */
const REQUEST_TIMEOUT_MS = 8000;

export type PortalResult =
  | { status: 'ok'; data: PortalLanding }
  | { status: 'unconfigured' }
  | { status: 'failed'; reason: string };

export function isPortalConfigured(): boolean {
  return Boolean(process.env.PORTAL_API_KEY);
}

function baseUrl(): string {
  return (process.env.PORTAL_API_BASE_URL ?? DEFAULT_BASE_URL).replace(/\/+$/, '');
}

/**
 * Fetches the combined landing payload.
 *
 * Uses `/api/public/landing` rather than the two separate endpoints: one round
 * trip, one cache entry, and officers and events that are always from the same
 * moment rather than half a minute apart.
 *
 * The portal sends `Cache-Control: private, no-store` because it cannot cache a
 * response keyed on an API key it does not see. That is its decision about its
 * own edge; caching on ours is ours to make, which is what `next.revalidate`
 * does here.
 *
 * Never throws. Every failure — no key, a timeout, a 401, malformed JSON —
 * returns a result the caller can fall back from, because a section rendering
 * yesterday's content is always better than a landing page that does not render.
 */
export async function fetchPortalLanding(): Promise<PortalResult> {
  const key = process.env.PORTAL_API_KEY;
  if (!key) return { status: 'unconfigured' };

  try {
    const response = await fetch(`${baseUrl()}/api/public/landing`, {
      headers: { 'x-api-key': key, accept: 'application/json' },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      next: { revalidate: REVALIDATE_SECONDS, tags: [PORTAL_CONTENT_TAG] },
    });

    if (!response.ok) {
      // 401 means the key is wrong or missing, 503 that the portal has not
      // configured its own. Both are operator errors worth naming in the log.
      return { status: 'failed', reason: `http-${response.status}` };
    }

    const body: unknown = await response.json();
    if (typeof body !== 'object' || body === null) return { status: 'failed', reason: 'malformed-body' };
    const record = body as Record<string, unknown>;

    return {
      status: 'ok',
      data: {
        officers: parseOfficers(record.officers),
        events: parseEvents(record.events),
        images: parseLandingImages(record.images),
        // Added by the portal in their news release (NEWS-02). An older portal
        // that does not send it yields `[]`, which is also what "no posts yet"
        // looks like — so the site behaves the same either way.
        posts: parsePosts(record.posts),
        generated_at: typeof record.generated_at === 'string' ? record.generated_at : '',
      },
    };
  } catch (error) {
    const reason = error instanceof Error && error.name === 'TimeoutError' ? 'timeout' : 'unreachable';
    console.error(`[portal] landing fetch ${reason}:`, error);
    return { status: 'failed', reason };
  }
}

/**
 * Every published post, for `/news` and the sitemap (NEWS-02).
 *
 * `/api/public/landing` carries only the three most recent, which is what the
 * homepage shows. The index needs all of them, and that is a second endpoint
 * rather than a bigger landing payload — the homepage should not pay for a page
 * most visitors never open.
 *
 * Never throws, for the same reason as the landing fetch: an empty list renders
 * an empty index, and a landing page that cannot load news still has everything
 * else on it.
 */
export async function fetchPortalPosts(): Promise<PortalPost[]> {
  const key = process.env.PORTAL_API_KEY;
  if (!key) return [];

  try {
    const response = await fetch(`${baseUrl()}/api/public/posts`, {
      headers: { 'x-api-key': key, accept: 'application/json' },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      next: { revalidate: REVALIDATE_SECONDS, tags: [PORTAL_CONTENT_TAG] },
    });

    if (!response.ok) {
      console.warn(`[portal] posts request failed: http-${response.status}`);
      return [];
    }

    const body: unknown = await response.json();
    if (typeof body !== 'object' || body === null) return [];
    return parsePosts((body as Record<string, unknown>).posts);
  } catch (error) {
    console.warn(`[portal] posts request failed: ${error instanceof Error ? error.message : 'unknown'}`);
    return [];
  }
}

export type SubscribeResult =
  | { status: 'subscribed' }
  | { status: 'invalid' }
  | { status: 'rate-limited' }
  | { status: 'failed'; reason: string };

/**
 * Sends a newsletter sign-up to the portal, which owns the list (NEWS-01).
 *
 * The portal stores the address, sends the confirmation email and handles
 * unsubscribes; this site only collects the address and relays it with the key.
 * A new subscriber and an existing one get the same answer from the portal, so a
 * visitor cannot use the form to learn who is on the list.
 *
 * Never cached, never throws.
 */
export async function subscribeToNewsletter(email: string, consentText: string): Promise<SubscribeResult> {
  const key = process.env.PORTAL_API_KEY;
  if (!key) return { status: 'failed', reason: 'unconfigured' };

  try {
    const response = await fetch(`${baseUrl()}/api/public/newsletter/subscribe`, {
      method: 'POST',
      headers: { 'x-api-key': key, 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify({ email, source: 'landing-page', consent_text: consentText }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      cache: 'no-store',
    });

    if (response.ok) return { status: 'subscribed' };
    if (response.status === 400 || response.status === 422) return { status: 'invalid' };
    if (response.status === 429) return { status: 'rate-limited' };
    return { status: 'failed', reason: `http-${response.status}` };
  } catch (error) {
    const reason = error instanceof Error && error.name === 'TimeoutError' ? 'timeout' : 'unreachable';
    return { status: 'failed', reason };
  }
}
