'use client';

import React from 'react';
import Image from 'next/image';
import { Category, EventItem, events } from '@/lib/content/events';
import { DynamicCarousel } from '@/components/ui/dynamic-carousel';

import { CalendarIcon } from '@heroicons/react/24/outline';

/**
 * Maps each event `Category` to a consistent Tailwind background + text color pair.
 *
 * This is the single source of truth for event badge colors.
 * To retheme a category, change its value here — all events of that category
 * will update automatically. Do NOT set colors on individual events in `events.ts`.
 *
 * Color token reference (defined in `app/globals.css`):
 *   hackaton  → devcon-purple-500 (#6A0DF2)
 *   workshop  → devcon-yellow-500 (#F0C419)
 *   seminar   → devcon-purple-700 (#6320EE)
 *   community → devcon-lime-500   (#C0E00B)
 *   career    → devcon-orange-500 (#E06B22)
 */
const categoryColors: Record<Category, string> = {
  hackaton:  'bg-devcon-purple-500 text-white',
  workshop:  'bg-devcon-yellow-500 text-black',
  seminar:   'bg-devcon-purple-700 text-white',
  community: 'bg-devcon-lime-500   text-black',
  career:    'bg-devcon-orange-500  text-white',
};

/**
 * EventCard — a tall image card representing a single event in the carousel.
 *
 * - If `event.img` is provided, the image fills the card with a dark bottom gradient.
 * - Otherwise a purple-to-black placeholder gradient is shown with a calendar icon.
 * - The category badge color is derived from `categoryColors` — not from the event data.
 */
function EventCard({ event }: { event: EventItem }) {
  return (
    <div className="relative flex-shrink-0 h-[400px] sm:h-[600px] w-[80vw] sm:w-[45vw] md:w-[30vw] rounded-[28px] overflow-hidden bg-zinc-900 group">
      {event.img ? (
        <>
          <Image
            src={event.img}
            alt={event.title}
            fill
            sizes="(max-width: 640px) 80vw, (max-width: 768px) 45vw, 30vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-devcon-purple-700 to-devcon-black-500 flex items-center justify-center">
          <CalendarIcon className="w-16 h-16 text-white/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
        </div>
      )}

      {/* Category Badge */}
      <div className={`absolute top-6 left-6 z-10 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${categoryColors[event.category]}`}>
        {event.category}
      </div>

      {/* Card Details */}
      <div className="absolute bottom-8 left-8 right-8 z-10 text-white">
        <h3 className="text-2xl font-bold leading-tight drop-shadow-lg">{event.title}</h3>
        <div className="flex items-center gap-2 text-sm text-gray-300 mt-3 drop-shadow-md">
          <CalendarIcon className="w-4 h-4" />
          <span>{event.date}</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Events — the "Featured Events" homepage section.
 *
 * Renders a horizontally scrollable `DynamicCarousel` of `EventCard` tiles.
 * Event data is sourced from `lib/content/events.ts`.
 * Badge colors are determined by `categoryColors` above — not by the event objects.
 */
export default function Events() {
  return (
    <section id="events" className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
      <div className="w-full flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 px-4">
        <div>
          <h2 className="text-4xl md:text-6xl font-extrabold text-foreground">
            Featured <span className="text-accent-purple">Events</span>
          </h2>
          <p className="mt-6 max-w-2xl text-base text-muted">
            Explore the latest events and activities organized by DevCon to inspire learning, innovation, and community engagement.
          </p>
        </div>      </div>

      <DynamicCarousel label="Featured events" className="w-full py-12 px-4"
        tiles={events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      />
    </section>
  );
}