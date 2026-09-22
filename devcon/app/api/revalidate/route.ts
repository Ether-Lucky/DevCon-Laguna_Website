import { revalidateTag } from 'next/cache';
import { PORTAL_CONTENT_TAG } from '@/lib/portal/client';
import { checkRevalidateAuth } from '@/lib/revalidate-auth';

/**
 * POST /api/revalidate — instant publish from the DevConnect Portal (CMS-06).
 *
 * Portal content is cached for 30 minutes (CMS-05). When an officer saves a
 * change in the portal's admin, the portal calls this endpoint and the cached
 * content expires at once, so the next visitor sees the change without a
 * redeploy and without waiting out the interval.
 *
 *   POST /api/revalidate
 *   Authorization: Bearer <PORTAL_REVALIDATE_SECRET>
 *
 * The caller cannot choose what is revalidated. It is always the portal content
 * tag, so a leaked secret can at most make the site refetch from the portal
 * sooner, which is the one thing the secret exists to allow.
 *
 * Environment variables:
 *   PORTAL_REVALIDATE_SECRET  shared with the portal, server only, 32+ chars
 */

export async function POST(request: Request) {
  const auth = checkRevalidateAuth(
    request.headers.get('authorization'),
    process.env.PORTAL_REVALIDATE_SECRET,
  );

  if (auth.status === 'unconfigured') {
    // Refuse rather than fall open: an endpoint that revalidated for anyone
    // whenever the secret was missing would be worse than no endpoint.
    console.error('[revalidate] PORTAL_REVALIDATE_SECRET is not set or is too short.');
    return Response.json({ revalidated: false, error: 'Revalidation is not configured.' }, { status: 503 });
  }

  if (auth.status === 'unauthorized') {
    // The reason is logged, never returned: telling a caller whether its header
    // was missing, malformed or wrong only helps someone probing the endpoint.
    console.warn(`[revalidate] rejected: ${auth.reason}`);
    return Response.json({ revalidated: false, error: 'Unauthorized.' }, { status: 401 });
  }

  // `{ expire: 0 }` rather than the recommended 'max'. 'max' only marks the
  // content stale, so the first visitor after a publish would still see the old
  // version while the new one loads in the background — not instant. Next's own
  // guidance for webhooks from external systems is immediate expiry.
  revalidateTag(PORTAL_CONTENT_TAG, { expire: 0 });

  return Response.json({ revalidated: true, tag: PORTAL_CONTENT_TAG, now: Date.now() });
}
