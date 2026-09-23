import {
  RiFacebookFill,
  RiTwitterFill,
  RiInstagramFill,
  RiLinkedinFill,
  RiYoutubeFill,
} from '@remixicon/react';

/**
 * The icons the UI knows how to draw for a social profile (DATA-BT-01).
 *
 * This union is what keeps the content layer honest: `social-links.ts` names an
 * icon with a string, and naming one that is not here is a compile error rather
 * than a missing icon discovered in the browser.
 */
const SOCIAL_ICONS = {
  facebook: RiFacebookFill,
  twitter: RiTwitterFill,
  instagram: RiInstagramFill,
  linkedin: RiLinkedinFill,
  youtube: RiYoutubeFill,
} as const;

export type SocialIconName = keyof typeof SOCIAL_ICONS;

/**
 * SocialIcon — draws the icon a content entry asked for by name.
 *
 * The mapping lives in the UI layer on purpose. Content that arrives from the
 * portal is plain serialisable data and can only ever carry a name, so putting
 * the component here is what lets the same rendering path serve a bundled entry
 * and a fetched one.
 *
 * Decorative by default: these icons sit inside links whose accessible name is
 * the platform, so announcing the icon as well would say everything twice.
 */
export function SocialIcon({
  name,
  className = 'w-5.5 md:w-6 h-auto',
}: {
  name: SocialIconName;
  className?: string;
}) {
  const Icon = SOCIAL_ICONS[name];
  return <Icon className={className} aria-hidden />;
}
