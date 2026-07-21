'use client';

import { useState } from 'react';

interface Slide {
  id: number;
  src: string;
  alt: string;
}

const SLIDES: Slide[] = [
  {
    id: 1,
    src: '/images/community.jpg',
    alt: 'DevCon Laguna community members with certificates of recognition',
  },
  {
    id: 2,
    src: '/images/community.png',
    alt: 'DevCon Laguna community gathering',
  },
  {
    id: 3,
    src: '/images/hackathons2.jpg',
    alt: 'DevCon Laguna hackathon',
  },
  {
    id: 4,
    src: '/images/workshops2.png',
    alt: 'DevCon Laguna workshop',
  },
];

export default function Slideshow() {
  const [current, setCurrent] = useState(0);
  const total = SLIDES.length;

  const next = () => setCurrent((prev) => (prev + 1) % total);
  const prev = () => setCurrent((prev) => (prev - 1 + total) % total);

  return (
    <div className="relative w-full">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[28px] bg-zinc-900 sm:aspect-[5/4]">
        <div
          className="flex h-full transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {SLIDES.map((slide) => (
            <div key={slide.id} className="relative h-full w-full flex-shrink-0">
              <img
                src={slide.src}
                alt={slide.alt}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-devcon-purple-dark/20 to-devcon-purple-bright/50" />
            </div>
          ))}
        </div>

        <button
          onClick={next}
          className="absolute right-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-black shadow-md transition-all hover:bg-white/90 sm:right-5"
          aria-label="Next slide"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <button
          onClick={prev}
          className="absolute left-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-black shadow-md transition-all hover:bg-white/90 sm:left-5"
          aria-label="Previous slide"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      <div className="mt-4 flex justify-center gap-2">
        {SLIDES.map((slide, idx) => (
          <button
            key={slide.id}
            onClick={() => setCurrent(idx)}
            className={`h-3 rounded-full transition-all duration-300 ${
              current === idx ? 'w-7 bg-devcon-white' : 'w-3 bg-devcon-white/30'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
