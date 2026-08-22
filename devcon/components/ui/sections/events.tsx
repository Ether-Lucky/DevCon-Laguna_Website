'use client';

import React from 'react';
import Button from '@/components/ui/button';
import { EventItem, events } from '@/lib/content/events';
import { DynamicCarousel } from '@/components/ui/dynamic-carousel';

const CalendarIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <rect x="3" y="5" width="18" height="16" rx="2" strokeLinecap="round" strokeLinejoin="round" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 3v4M16 3v4M3 10h18" />
  </svg>
);

function EventCard({ event }: { event: EventItem }) {
  return (
    <div className="relative flex-shrink-0 h-[400px] sm:h-[600px] w-[80vw] sm:w-[45vw] md:w-[30vw] rounded-3xl overflow-hidden bg-zinc-900">
      {event.img ? (
        <>
          <img
            src={event.img}
            alt={event.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-devcon-purple-dark to-devcon-black flex items-center justify-center">
          <CalendarIcon className="w-16 h-16 text-devcon-white/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        </div>
      )}

      {/* Category Badge */}
      <div className={`absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${event.color}`}>
        {event.category}
      </div>

      {/* Card Details */}
      <div className="absolute bottom-6 left-6 right-6 z-10 text-white">
        <h3 className="text-xl font-bold">{event.title}</h3>
        <div className="flex items-center gap-2 text-sm text-gray-300 mt-1">
          <CalendarIcon className="w-3.5 h-3.5" />
          <span>{event.date}</span>
        </div>
      </div>
    </div>
  );
}

export default function Events() {
  return (
    <section id="events" className="w-full bg-background px-4 py-32 md:px-6 md:py-24">
      <div className="w-full max-w-[1440px] mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 px-4 sm:px-8">
        <div>
          <h2 className="text-4xl md:text-6xl sm:text-display-sm md:text-display-md font-extrabold text-foreground">
            Featured <span className="text-devcon-purple-700">Events</span>
          </h2>
          <p className="mt-4 max-w-2xl text-body-sm sm:text-body-md font-light text-foreground text-muted">
            Explore the latest events and activities organized by DevCon to inspire learning, innovation, and community engagement.
          </p>
        </div>
        <Button label="View All Events" href="/events" icon="" />
      </div>

      <DynamicCarousel className="relative w-full max-w-[1440px] mx-auto py-6 px-4 sm:px-8"
        tiles={events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      />
    </section>
  );
}