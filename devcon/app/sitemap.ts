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
 * Rendered on every request, not cached (SEO-05-BT-01).
 *
 * In production the sitemap was served from Vercel's cache indefinitely: 59
 * hours after one deploy, 8.9 hours after the next, `X-Vercel-Cache: HIT` on
 * every request and never STALE — while the homepage, built from the same
 * portal fetch on the same deployment, went STALE and refreshed as it should.
 * Every event and post published after a deploy was missing from it until the
 * next one.
 *
 * The first fix declared `revalidate = 1800`. The build reported a 30-minute
 * window both before and after, and production ignored it: 33 minutes after
 * deploy the sitemap was still HIT at Age 1980. ISR for this route handler is
 * not reliable on this platform, so the sitemap no longer depends on it.
 *
 * The cost is one uncached portal call per sitemap request. Crawlers fetch a
 * sitemap a few times a day, the fetch times out after 8 seconds, and a failure
 * yields the static pages rather than an error — so a sitemap that is always
 * current is worth far more than the calls it saves.
 */
export const dynamic = 'force-dynamic';

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
