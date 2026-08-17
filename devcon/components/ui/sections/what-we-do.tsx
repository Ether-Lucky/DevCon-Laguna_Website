import React from 'react';
import { whatWeDo } from '@/lib/content/what-we-do';
import clsx from 'clsx';
import Image from 'next/image';

export default function WhatWeDo() {
  return (
    <section className="w-full bg-background px-4 py-16 sm:px-6 sm:py-20 md:px-6 md:py-24">
      {/* Heading */}
      <div className="mb-12 text-center">
        <h2 className="text-4xl md:text-6xl sm:text-display-sm md:text-display-md font-extrabold text-foreground">
          What <span className="text-devcon-purple-700">We Do</span>
        </h2>

        <p className="mx-auto mt-4 max-w-[620px] text-center">
          We create opportunities for developers of all skill levels to learn,
          connect, and grow through community-driven initiatives.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-[1.4fr_2.8fr_1.4fr] sm:grid-rows-2 gap-4 sm:gap-7 max-w-7xl mx-auto">
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