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

export const siteConfig = {
  name: 'DevCon Laguna',
  title: 'DevCon Laguna — Developers Connect Laguna',
  description:
    'DevCon Laguna is a community of developers, students, and tech enthusiasts in Laguna, Philippines. Discover our events, officers, and programs.',
  url: resolveSiteUrl(),
  email: 'hello@devconlaguna.com',
  locale: 'en_PH',
} as const;
