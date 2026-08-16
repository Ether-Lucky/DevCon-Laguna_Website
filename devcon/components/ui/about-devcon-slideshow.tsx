'use client';

import { useState } from 'react';
import { slides } from '@/lib/content/about-devcon-slideshow';
import Image from 'next/image';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/16/solid';

export default function AboutDevconSlideshow() {
  const [current, setCurrent] = useState(0);
  const total = slides.length;

  const next = () => setCurrent((prev) => (prev + 1) % total);
  const prev = () => setCurrent((prev) => (prev - 1 + total) % total);
  const buttonClassName = "group absolute top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-foreground text-background shadow-md"
  const iconClassName = "w-6 transition-all transition-transform duration-200"
  return (
    <div className="relative w-full">
      <div>
        <div className="relative aspect-[3/2] w-full overflow-hidden rounded-[28px] bg-zinc-900">
          <div
            className="flex h-full transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {slides.map((slide) => (
              <div key={slide.id} className="relative h-full w-full flex-shrink-0">
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  width={slide.width}
                  height={slide.height}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-devcon-purple-dark/20 to-devcon-purple-bright/50" />
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={next}
          // className="absolute -right-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-foreground text-background shadow-md transition-all hover:bg-foreground"
          className={`${buttonClassName} -right-8`}
          aria-label="Next slide"
        >
          <ArrowRightIcon className={`${iconClassName} group-hover:translate-x-0.5`}/>
        </button>

        <button
          onClick={prev}
          className={`${buttonClassName} -left-8`}
          aria-label="Previous slide"
        >
          <ArrowLeftIcon className={`${iconClassName} group-hover:-translate-x-0.5`}/>
        </button>
      </div>

      <div className="mt-4 flex justify-center gap-2">
        {slides.map((slide, idx) => (
          <button
            key={slide.id}
            onClick={() => setCurrent(idx)}
            className={`h-3 rounded-full transition-all duration-300 ${
              current === idx ? 'w-7 bg-foreground' : 'w-3 bg-foreground/30'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
