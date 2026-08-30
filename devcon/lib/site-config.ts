/**
 * Shared site-wide constants used by SEO metadata, the sitemap, and robots.
 *
 * The canonical URL is read from the environment so it is correct per
 * deployment and never hardcoded to the wrong host:
 *
 * - `NEXT_PUBLIC_SITE_URL` — set this to the production domain. Takes priority.
 * - `VERCEL_PROJECT_PRODUCTION_URL` — supplied automatically by Vercel.
 * - Falls back to localhost for local development.
 */

function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, '');

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;

  return 'http://localhost:3000';
}

// No `email` here on purpose: DevCon Laguna does not own devconlaguna.com, and
// advertising an address the organisation cannot receive at is worse than none.
// Visitors are pointed at the contact form and the social profiles instead.
export const siteConfig = {
  name: 'DevCon Laguna',
  title: 'DevCon Laguna — Developers Connect Laguna',
  description:
    'DevCon Laguna is a community of developers, students, and tech enthusiasts in Laguna, Philippines. Discover our events, officers, and programs.',
  url: resolveSiteUrl(),
  locale: 'en_PH',
  /**
   * DevConnect Portal — the separate application where visitors register as
   * members or volunteers, and where officers and admins manage events,
   * officers and members. Every "Join Us" / "Volunteer" call to action on this
   * landing page sends people here.
   */
  portalUrl: 'https://devconnect-portal-seven.vercel.app/',
} as const;
