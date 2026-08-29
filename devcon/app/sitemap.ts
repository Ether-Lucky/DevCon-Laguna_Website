import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/site-config';

/**
 * The site is a single landing page. In-page anchors (#about, #events, ...) are
 * not separate URLs, so they are intentionally not listed here — crawlers treat
 * them as the same document. Additional entries belong here once real routes
 * exist (see LEGAL-01 for the Terms and Privacy pages).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ];
}
