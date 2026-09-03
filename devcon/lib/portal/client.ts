import 'server-only';

import type { PortalLanding, PortalOfficer, PortalEvent } from './types';

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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

/**
 * Narrows an unknown payload to the officers we can actually render.
 *
 * The portal is a separate codebase on a separate deployment schedule, so its
 * response is untrusted input rather than a guarantee. An entry missing the
 * fields the card needs is dropped rather than rendered as a blank card.
 */
function parseOfficers(value: unknown): PortalOfficer[] {
  if (!Array.isArray(value)) return [];
  return value.filter((entry): entry is PortalOfficer => {
    if (!isRecord(entry)) return false;
    return (
      typeof entry.id === 'string' &&
      typeof entry.name === 'string' &&
      typeof entry.title === 'string' &&
      typeof entry.display_order === 'number'
    );
  });
}

function parseEvents(value: unknown): PortalEvent[] {
  if (!Array.isArray(value)) return [];
  return value.filter((entry): entry is PortalEvent => {
    if (!isRecord(entry)) return false;
    return (
      typeof entry.id === 'string' &&
      typeof entry.title === 'string' &&
      typeof entry.start_date === 'string'
    );
  });
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
    if (!isRecord(body)) return { status: 'failed', reason: 'malformed-body' };

    return {
      status: 'ok',
      data: {
        officers: parseOfficers(body.officers),
        events: parseEvents(body.events),
        generated_at: typeof body.generated_at === 'string' ? body.generated_at : '',
      },
    };
  } catch (error) {
    const reason = error instanceof Error && error.name === 'TimeoutError' ? 'timeout' : 'unreachable';
    console.error(`[portal] landing fetch ${reason}:`, error);
    return { status: 'failed', reason };
  }
}
