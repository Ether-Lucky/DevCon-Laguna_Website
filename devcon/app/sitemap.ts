import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/site-config';

/**
 * The landing page plus the legal pages (LEGAL-01). In-page anchors (#about,
 * #events, ...) are not separate URLs, so they are intentionally not listed:
 * crawlers treat them as the same document.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    { url: `${siteConfig.url}/privacy`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${siteConfig.url}/terms`, changeFrequency: 'yearly', priority: 0.3 },
  ];
}
