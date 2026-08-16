
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

export { slides }