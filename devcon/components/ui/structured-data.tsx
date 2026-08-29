import { siteConfig } from '@/lib/site-config';
import { socialLinks } from '@/lib/content/social-links';

/**
 * StructuredData — emits schema.org Organization data as JSON-LD.
 *
 * Search engines use this to display richer information about DevCon Laguna
 * (name, logo, official channels) than they could infer from the page copy.
 *
 * Rendered from the root layout so it applies site-wide, which is the framework's
 * recommended placement for organization-level structured data.
 *
 * The absolute URLs are derived from `siteConfig`, which resolves the canonical
 * host from the environment — schema.org requires absolute URLs, so `logo` and
 * `url` are only correct in production once `NEXT_PUBLIC_SITE_URL` is set.
 *
 * Social profile URLs are read from the existing content data so there is a single
 * source of truth; adding a platform there also advertises it to search engines.
 */
export default function StructuredData() {
  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    alternateName: 'Developers Connect Laguna',
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo/dark-logo.png`,
    image: `${siteConfig.url}/logo/dark-logo.png`,
    email: siteConfig.email,
    description: siteConfig.description,
    address: {
      '@type': 'PostalAddress',
      addressRegion: 'Laguna',
      addressCountry: 'PH',
    },
    sameAs: socialLinks.map((social) => social.link),
  };

  return (
    <script
      type="application/ld+json"
      // Escaping `<` as \u003c prevents a string in the payload from closing the
      // script tag early, which would otherwise be an XSS vector. This is the
      // sanitisation the framework documentation calls for.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(organization).replace(/</g, '\u003c'),
      }}
    />
  );
}
