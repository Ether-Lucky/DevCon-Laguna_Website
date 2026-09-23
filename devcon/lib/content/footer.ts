import { siteConfig } from '@/lib/site-config';
import { socialLinks } from '@/lib/content/social-links';

/**
 * footer.ts — the footer's link columns (FOOTER-02).
 *
 * **Every link here must go somewhere that exists.** The footer shipped with
 * 17 links pointing at `"#"`: they looked clickable, went nowhere, and jumped
 * the visitor back to the top of the page. Two of them were "Privacy Policy"
 * and "Terms and Conditions", on a site whose contact form collects names and
 * email addresses.
 *
 * Links with no destination were **removed** rather than left dangling (PM
 * decision, 2026-09-22): Our Chapters, Blog, FAQ, Handbook, Donate, Sponsors,
 * Chat support and Discord. Each can come back the day it has a real URL.
 *
 * A test fails the build if any link on the page has `href="#"` or an empty
 * `href`, so this cannot quietly regress.
 *
 * Destinations:
 * - `/#section` for parts of the home page. The leading slash matters: a bare
 *   `#about` resolves against the current page, so on /privacy it would mean
 *   /privacy#about.
 * - `siteConfig.portalUrl` for membership and volunteering, which live on the
 *   DevConnect Portal.
 * - `/privacy` and `/terms` (LEGAL-01).
 * - Social profiles come from `social-links.tsx`, so the footer and the icon
 *   rows can never disagree about a URL.
 */

export type FooterLink = {
  label: string;
  href: string;
  /** Opens in a new tab with a safe `rel`. Set for anything off this site. */
  external?: boolean;
};

export type FooterColumn = {
  heading: string;
  links: FooterLink[];
};

const social = (platform: string): FooterLink | null => {
  const match = socialLinks.find((link) => link.platform === platform);
  return match ? { label: match.platform, href: match.link, external: true } : null;
};

/** Platforms listed in the Connect column, in order. */
const CONNECT_PLATFORMS = ['Facebook', 'Twitter', 'Instagram', 'LinkedIn', 'YouTube'];

export const footerColumns: FooterColumn[] = [
  {
    heading: 'Explore',
    links: [
      { label: 'About Us', href: '/#about' },
      { label: 'What We Do', href: '/#what-we-do' },
      { label: 'Events', href: '/#events' },
      { label: 'Officers', href: '/#officers' },
      { label: 'Join Us', href: siteConfig.portalUrl, external: true },
    ],
  },
  {
    heading: 'Support',
    links: [
      { label: 'Volunteer', href: siteConfig.portalUrl, external: true },
      { label: 'Partners', href: '/#partners' },
      { label: 'Contact', href: '/#contact' },
    ],
  },
  {
    heading: 'Connect',
    // Filtered rather than listed, so a platform removed from social-links.tsx
    // disappears here too instead of becoming a broken link.
    links: CONNECT_PLATFORMS.map(social).filter((link): link is FooterLink => link !== null),
  },
];

/** The legal links in the bottom bar. */
export const footerLegalLinks: FooterLink[] = [
  { label: 'Terms and Conditions', href: '/terms' },
  { label: 'Privacy Policy', href: '/privacy' },
];
