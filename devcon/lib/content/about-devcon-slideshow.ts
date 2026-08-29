
/**
 * about-devcon-slideshow.ts — image data for the About section slideshow.
 *
 * Update this file whenever the visual story of the organization changes.
 * Keep asset paths in `public/`, preserve the `id` values, and ensure alt text
 * remains descriptive for accessibility and SEO.
 */

/**
 * Represents a single slide in the About section image carousel.
 *
 * @property id     - Unique numeric identifier.
 * @property src    - Public image path.
 * @property alt    - Accessible alt text describing the image.
 * @property width  - Original image width.
 * @property height - Original image height.
 */
interface Slide {
  id: number;
  src: string;
  alt: string;
  width: number;
  height: number;
}

const slides: Slide[] = [
  {
    id: 1,
    src: '/images/community.jpg',
    alt: 'DevCon Laguna community members with certificates of recognition',
    width: 1920,
    height: 1080,
  },
  {
    id: 2,
    src: '/images/community.png',
    alt: 'DevCon Laguna community gathering',
    width: 284,
    height: 284,
  },
  {
    id: 3,
    src: '/images/hackathons2.jpg',
    alt: 'DevCon Laguna hackathon',
    width: 284,
    height: 284,
  },
  {
    id: 4,
    src: '/images/workshops2.png',
    alt: 'DevCon Laguna workshop',
    width: 284,
    height: 284,
  },
];

export { slides };