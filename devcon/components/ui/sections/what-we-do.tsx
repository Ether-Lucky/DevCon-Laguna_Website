import React from 'react';
import { whatWeDo } from '@/lib/content/what-we-do';
import clsx from 'clsx';
import Image from 'next/image';

/**
 * WhatWeDo — a bento-style photo grid showcasing DevCon Laguna's activities.
 *
 * Uses a 3-column asymmetric grid on `sm` and above:
 *   [short card] [tall center card (row-span-2)] [short card]
 *   [short card]                                 [short card]
 *
 * The center card is marked with `isTall: true` in the data.
 * Each card is an image with a subtle bottom gradient and a hover zoom effect.
 * Images and titles are sourced from `lib/content/what-we-do.ts`.
 */
export default function WhatWeDo() {
  return (
    <section id="what-we-do" className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
      {/* Heading */}
      <div className="mb-12 text-center">
        <h2 className="text-4xl md:text-6xl font-extrabold text-foreground">
          What <span className="text-devcon-purple-500">We Do</span>
        </h2>

        <p className="mx-auto mt-6 max-w-xl text-center text-base text-muted">
          We create opportunities for developers of all skill levels to learn,
          connect, and grow through community-driven initiatives.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-[1.4fr_2.8fr_1.4fr] sm:grid-rows-2 gap-4 sm:gap-7 w-full">
        {whatWeDo.map((item) => (
          <div
            key={item.id}
            className={clsx("relative overflow-hidden rounded-[28px] group", { 'sm:row-span-2': item.isTall })}
          >
            <Image
              src={item.img}
              alt={item.title}
              width={item.width}
              height={item.height}
              style={{
                  objectPosition: '50% 50%',
                  '--zoom': 1,
                } as React.CSSProperties
              }
              className="absolute inset-0 w-full h-full object-cover scale-[var(--zoom)] transition-transform duration-500 group-hover:scale-[calc(var(--zoom)*1.05)]"
            />

            {/* Subtle bottom shadow for text legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-devcon-black/50 via-transparent to-transparent" />

            <div
              className={clsx("relative w-full",
                {
                  'h-[400px] sm:h-[600px]': item.isTall,
                  'h-[220px] sm:h-[288px]': !item.isTall
                })}
            />

            <h3 className="absolute bottom-9 left-6 text-devcon-white-500 text-2xl font-bold drop-shadow-lg">
              {item.title}
            </h3>
          </div>
        ))}
      </div>
    </section>
  );
}