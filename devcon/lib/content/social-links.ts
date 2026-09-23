/**
 * social-links.ts — content data for the organisation's social media profiles.
 *
 * Update this file when a profile URL changes or a platform is added or removed.
 * Editing it needs no JSX and no imports from the UI: each entry names its icon
 * with a plain string, and the UI decides what to draw for that name
 * (DATA-BT-01).
 *
 * It used to store rendered React elements — `icon: <RiFacebookFill … />` — which
 * made this the one file in a content folder that could not be edited without
 * writing component code, and the only `.tsx` among `.ts` data files. It was
 * also a shape no API could ever send: content fetched from the portal arrives
 * as serialisable data, so the name-to-component mapping has to live in the UI
 * regardless.
 *
 * Adding a platform: add an entry here, then add the matching icon to
 * `components/ui/social-icon.tsx`. The compiler will tell you if you forget —
 * `SocialIconName` is the union of the names that component knows how to draw.
 */

import type { SocialIconName } from '@/components/ui/social-icon';

/**
 * A single social media profile.
 *
 * @property platform - Display name, also used as the link's accessible name.
 * @property link     - The profile URL.
 * @property icon     - Which icon to draw. See `components/ui/social-icon.tsx`.
 */
export type SocialLink = {
  platform: string;
  link: string;
  icon: SocialIconName;
};

const socialLinks: SocialLink[] = [
  {
    platform: 'Facebook',
    link: 'https://www.facebook.com/DEVCONLAGUNA',
    icon: 'facebook',
  },
  {
    platform: 'Twitter',
    link: 'https://x.com/DEVCONPH',
    icon: 'twitter',
  },
  {
    platform: 'Instagram',
    link: 'https://www.instagram.com/devconlaguna',
    icon: 'instagram',
  },
  {
    platform: 'LinkedIn',
    link: 'https://www.linkedin.com/company/devconlaguna/',
    icon: 'linkedin',
  },
  {
    platform: 'YouTube',
    link: 'https://www.youtube.com/@devconlaguna',
    icon: 'youtube',
  },
];

export { socialLinks };
