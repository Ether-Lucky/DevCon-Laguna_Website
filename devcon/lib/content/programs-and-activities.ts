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
 * @property bannerImg          - Optional hero image in `public/images/banner/`.
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
  primaryBtnLabel: string;
  primaryBtnLink: string;
  secondaryBtnLabel?: string;
  secondaryBtnLink?: string;
}

const programsAndActivities: ProgramOrActivity[] = [
  {
    id: 1,
    title: 'Become Part of the DevCon Kids Community',
    description: 'Join us in shaping a future where every kid can code, create, and change the world.',
    bannerImg: '/images/banner/banner1.png',
    primaryBtnLabel: 'Join Us',
    primaryBtnLink: '',
    secondaryBtnLabel: 'Learn More',
    secondaryBtnLink: '',
  },
  {
    id: 2,
    title: 'Empowering Next-Gen Developers Daily',
    description: 'Explore our intensive workshops, hackathons, and tech talks tailored for growth.',
    bannerImg: '',
    primaryBtnLabel: 'Explore',
    primaryBtnLink: '',
    secondaryBtnLabel: 'View Events',
    secondaryBtnLink: '',
  },
  {
    id: 3,
    title: 'Innovate Together with DevCon Laguna Initiatives',
    description: 'Collaborate with passionate student developers and industry leaders across the region.',
    bannerImg: '',
    primaryBtnLabel: 'Get Involved',
    primaryBtnLink: '',
    secondaryBtnLabel: 'Contact Us',
    secondaryBtnLink: '',
  },
];

export type { ProgramOrActivity };
export { programsAndActivities };