/**
 * social-links.tsx — content data for the organization social media links.
 *
 * Update this file when a profile URL changes or a new platform needs to be added
 * to the footer or community navigation. The icon components are kept here so the
 * content stays easy to maintain without touching the UI layer.
 */

import { RiFacebookFill, RiTwitterFill, RiInstagramFill, RiLinkedinFill, RiYoutubeFill } from '@remixicon/react';

/**
 * Represents a single social media profile link.
 *
 * @property platform - Display name of the platform.
 * @property link     - External URL for the profile.
 * @property icon     - Remix icon node rendered in the UI.
 */
type SocialLink = {
  platform: string;
  link: string;
  icon: React.ReactNode;
};

const iconClassName = 'w-5.5 md:w-6 h-auto';

const socialLinks: SocialLink[] = [
  {
    platform: 'Facebook',
    link: 'https://www.facebook.com/DEVCONLAGUNA',
    icon: <RiFacebookFill className={iconClassName} />,
  },
  {
    platform: 'Twitter',
    link: 'https://x.com/DEVCONPH',
    icon: <RiTwitterFill className={iconClassName} />,
  },
  {
    platform: 'Instagram',
    link: 'https://www.instagram.com/devconlaguna',
    icon: <RiInstagramFill className={iconClassName} />,
  },
  {
    platform: 'LinkedIn',
    link: 'https://www.linkedin.com/company/devconlaguna/',
    icon: <RiLinkedinFill className={iconClassName} />,
  },
  {
    platform: 'YouTube',
    link: 'https://www.youtube.com/@devconlaguna',
    icon: <RiYoutubeFill className={iconClassName} />,
  },
];

export { socialLinks };