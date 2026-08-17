interface WhatWeDoItem {
  id: number;
  title: string;
  img: string;
  width: number;
  height: number;
  isTall?: boolean; // marks the center, larger card
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

export { whatWeDo }