import { siteConfig } from '@/lib/site-config';

/**
 * programs-and-activities.ts — content data for the Programs and Activities slider.
 *
 * Add or edit slide content here when launching initiatives, community campaigns,
 * or student development programs. The component expects a stable array shape and
 * will render the provided buttons and banners automatically.
 */

/**
 * Represents a single program or activity slide.
 *
 * @property id                 - Unique numeric identifier.
 * @property title              - Main heading shown in the slide.
 * @property description        - Supporting copy under the title.
 * @property bannerImg          - Optional banner in `public/images/banner/`. A banner
 *                                carries its own headline and copy baked into the
 *                                artwork, so the slide shows no text over it. A slide
 *                                without one shows `title` and `description` as text.
 * @property bannerAlt          - Alt text for the banner. Must repeat the text baked
 *                                into the artwork, or screen readers never get it.
 * @property primaryBtnLabel    - Label for the main call-to-action button.
 * @property primaryBtnLink     - Destination URL for the main call-to-action.
 * @property secondaryBtnLabel  - Optional label for the secondary action.
 * @property secondaryBtnLink   - Optional destination for the secondary action.
 */
interface ProgramOrActivity {
  id: number;
  title: string;
  description?: string;
  bannerImg?: string;
  bannerAlt?: string;
  primaryBtnLabel: string;
  primaryBtnLink: string;
  secondaryBtnLabel?: string;
  secondaryBtnLink?: string;
}

/**
 * Button destinations (PROGRAM-01-BT-01). Every link was an empty string, which
 * is why the section was taken off the page. "Join Us" and "Get Involved" go to
 * the DevConnect Portal like every other membership CTA on the site (CTA-01);
 * the rest point at real sections of this page. The DevCon Kids "Learn More"
 * was removed rather than pointed somewhere arbitrary: there is no DevCon Kids
 * page to send anyone to.
 */
const programsAndActivities: ProgramOrActivity[] = [
  {
    id: 1,
    title: 'Become Part of the DevCon Kids Community',
    description: 'Join us in shaping a future where every kid can code, create, and change the world.',
    bannerImg: '/images/banner/banner1.png',
    bannerAlt:
      'Become Part of the DevCon Kids Community. Join us in shaping a future where every kid can code, create, and change the world.',
    primaryBtnLabel: 'Join Us',
    primaryBtnLink: siteConfig.portalUrl,
  },
  {
    id: 2,
    title: 'Empowering Next-Gen Developers Daily',
    description: 'Explore our intensive workshops, hackathons, and tech talks tailored for growth.',
    primaryBtnLabel: 'Explore',
    primaryBtnLink: '#what-we-do',
    secondaryBtnLabel: 'View Events',
    secondaryBtnLink: '#events',
  },
  {
    id: 3,
    title: 'Innovate Together with DevCon Laguna Initiatives',
    description: 'Collaborate with passionate student developers and industry leaders across the region.',
    primaryBtnLabel: 'Get Involved',
    primaryBtnLink: siteConfig.portalUrl,
    secondaryBtnLabel: 'Contact Us',
    secondaryBtnLink: '#contact',
  },
];

export type { ProgramOrActivity };
export { programsAndActivities };