import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/site-config';
import { getPortalEvents, getPosts } from '@/lib/portal/content';
import { eventPath } from '@/lib/portal/events';
import { postPath } from '@/lib/portal/posts';

/**
 * The landing page, the legal pages (LEGAL-01), a URL per event (SEO-05), and
 * the news index and a URL per post (NEWS-02).
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
/**
 * Regenerated at most every 30 minutes, the same window as the portal fetch.
 *
 * Declared rather than left to be inferred (SEO-05-BT-01). The build does infer
 * a 30-minute window from the fetches inside — but in production the sitemap was
 * served from Vercel's cache for 59 hours after a deploy, never regenerating,
 * while the homepage built from the same fetch regenerated normally. Every event
 * and post published in that time was missing from it.
 *
 * `sitemap.ts` is a route handler, which Next caches by default unless it is
 * given dynamic or revalidate config; stating the window is the documented way
 * to give it one. `force-dynamic` would also work, but it would make every
 * sitemap request call the portal uncached.
 */
export const revalidate = 1800;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [events, posts] = await Promise.all([getPortalEvents(), getPosts()]);

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
    { url: `${siteConfig.url}/news`, changeFrequency: 'weekly', priority: 0.6 },
    ...posts.map((post) => ({
      url: `${siteConfig.url}${postPath(post)}`,
      lastModified: new Date(post.published_at),
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    })),
    { url: `${siteConfig.url}/privacy`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${siteConfig.url}/terms`, changeFrequency: 'yearly', priority: 0.3 },
  ];
}
