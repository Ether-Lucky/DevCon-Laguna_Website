import React from 'react';

interface WhatWeDoItem {
  id: number;
  title: string;
  img: string;
  span?: 'tall'; // marks the center, larger card
  objectPosition?: string; // e.g. '30% 20%' to focus on a specific part of the photo
  zoom?: number; // e.g. 1.3 to zoom in 30%
  colorOverlay?: string; // CSS gradient/color layered on top with a blend mode for a pastel wash
}

const ITEMS: WhatWeDoItem[] = [
  { 
    id: 1, 
    title: 'Workshops', 
    img: '/images/workshops2.png',
    colorOverlay: 'linear-gradient(135deg, rgba(255, 170, 0, 0.22) 0%, rgba(140, 110, 210, 0.25) 100%)'
  },
  {
    id: 2,
    title: 'Tech Talks',
    img: '/images/techtalks2.png',
    span: 'tall',
    objectPosition: '15% 15%',
    zoom: 1.05,
    // Heavy signature wash: Yellowish/amber top-left passing into deep purple bottom-right
    colorOverlay: 'linear-gradient(145deg, rgba(248, 174, 0, 0.22) 0%, rgba(210, 160, 245, 0.2) 45%, rgba(120, 90, 200, 0.3) 100%)',
  },
  { 
    id: 3, 
    title: 'Projects', 
    img: '/images/projects.png',
    colorOverlay: 'linear-gradient(135deg, rgba(255, 170, 0, 0.22) 0%, rgba(140, 110, 210, 0.22) 100%)'
  },
  { 
    id: 4, 
    title: 'Hackathons', 
    img: '/images/hackathons2.png',
    objectPosition: '50% 40%',
    colorOverlay: 'linear-gradient(135deg, rgba(255, 170, 0, 0.22) 0%, rgba(140, 110, 210, 0.25) 100%)'
  },
  { 
    id: 5, 
    title: 'Community', 
    img: '/images/community.png',
    colorOverlay: 'linear-gradient(135deg, rgba(255, 170, 0, 0.22) 0%, rgba(140, 110, 210, 0.22) 100%)'
  },
];

export default function WhatWeDo() {
  return (
    <section className="w-full bg-devcon-black py-24 px-6 font-inter">
      {/* Heading */}
      <div className="text-center mb-12">
        <h2 className="text-display-md font-extrabold text-devcon-white">
          What <span className="text-devcon-purple-bright">We Do</span>
        </h2>

        <p className="text-devcon-white font-dm font-extralight text-[18px] leading-[30px] tracking-[0px] text-center max-w-[620px] mx-auto mt-4">
          We create opportunities for developers of all skill levels to learn,
          connect, and grow through community-driven initiatives.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-[1.4fr_2.8fr_1.4fr] grid-rows-2 gap-7 max-w-7xl mx-auto">
        {ITEMS.map((item) => (
          <div
            key={item.id}
            className={`relative overflow-hidden rounded-[28px] group ${
              item.span === 'tall' ? 'row-span-2' : ''
            }`}
          >
            <img
              src={item.img}
              alt={item.title}
              style={
                {
                  objectPosition: item.objectPosition ?? '50% 50%',
                  '--zoom': item.zoom ?? 1,
                } as React.CSSProperties
              }
              className="absolute inset-0 w-full h-full object-cover scale-[var(--zoom)] transition-transform duration-500 group-hover:scale-[calc(var(--zoom)*1.05)]"
            />

            {/*pastel color wash */}
            {item.colorOverlay && (
              <div
                className="absolute inset-0 mix-blend-soft-light"
                style={{ background: item.colorOverlay }}
              />
            )}

            {/* Subtle bottom shadow for text legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-devcon-black/50 via-transparent to-transparent" />

            <div
              className={`relative w-full ${
                item.span === 'tall' ? 'h-[600px]' : 'h-[288px]'
              }`}
            />

            <h3 className="absolute bottom-9 left-6 text-devcon-white text-2xl font-bold drop-shadow-lg">
              {item.title}
            </h3>
          </div>
        ))}
      </div>
    </section>
  );
}