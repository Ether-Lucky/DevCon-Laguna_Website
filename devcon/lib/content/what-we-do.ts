/**
 * what-we-do.ts — content data for the "What We Do" highlight cards.
 *
 * Each item represents a category card displayed in the homepage grid. Update
 * the labels, image paths, and size metadata here when refreshing campaigns,
 * feature sets, or visual assets.
 */

/**
 * Represents a single highlight card in the What We Do section.
 *
 * @property id     - Unique numeric identifier.
 * @property title  - Card label shown to users.
 * @property img    - Public image path used for the card artwork.
 * @property width  - Original image width for layout and optimization.
 * @property height - Original image height for layout and optimization.
 * @property isTall - Optional flag for larger cards that span a bigger layout area.
 */
interface WhatWeDoItem {
  id: number;
  title: string;
  img: string;
  width: number;
  height: number;
  isTall?: boolean;
}

const whatWeDo: WhatWeDoItem[] = [
  {
    id: 1,
    title: 'Workshops',
    img: '/images/workshops2.png',
    width: 284,
    height: 284,
  },
  {
    id: 2,
    title: 'Tech Talks',
    img: '/images/techtalks2.png',
    width: 596,
    height: 596,
    isTall: true,
  },
  {
    id: 3,
    title: 'Projects',
    img: '/images/projects.png',
    width: 284,
    height: 284,
  },
  {
    id: 4,
    title: 'Hackathons',
    img: '/images/hackathons2.png',
    width: 284,
    height: 284,
  },
  {
    id: 5,
    title: 'Community',
    img: '/images/community.png',
    width: 284,
    height: 284,
  },
];

export { whatWeDo };