import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/site-config';
import { getPortalEvents } from '@/lib/portal/content';
import { eventPath } from '@/lib/portal/events';

/**
 * The landing page, the legal pages (LEGAL-01), and a URL per event (SEO-05).
 *
 * In-page anchors (#about, #events, ...) are not separate URLs, so they are
 * intentionally not listed: crawlers treat them as the same document.
 *
 * Events come from the portal and are listed **unfiltered**, including ones that
 * have already happened — their pages still exist and still answer, so leaving
 * them out would hide URLs that work.
 *
 * `getPortalEvents` returns an empty list when the portal is unreachable or
 * unconfigured, so the sitemap degrades to the static pages rather than failing
 * the build. A sitemap that 500s is worse than a short one.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const events = await getPortalEvents();

  return [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...events.map((event) => ({
      url: `${siteConfig.url}${eventPath(event)}`,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
    { url: `${siteConfig.url}/privacy`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${siteConfig.url}/terms`, changeFrequency: 'yearly', priority: 0.3 },
  ];
}
