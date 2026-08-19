'use client';
import React, { useState } from 'react';
import Button from '@/components/ui/button';
import { EventItem, events, eventsPerPage } from '@/lib/content/events'

const CalendarIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <rect x="3" y="5" width="18" height="16" rx="2" strokeLinecap="round" strokeLinejoin="round" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 3v4M16 3v4M3 10h18" />
  </svg>
);

function EventCard({ event }: { event: EventItem }) {
  return (
    <div className="relative flex-1 h-[400px] sm:h-[600px] rounded-3xl overflow-hidden bg-zinc-900">
      {event.img ? (
        <>
          <img
            src={event.img}
            alt={event.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Bottom fade — hides baked-in graphic text and grounds our overlay text */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        </>
      ) : (
        // Placeholder card: no photo yet
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

export default function EventsCarousel() {
  const totalPages = Math.ceil(events.length / eventsPerPage);
  const [currentPage, setCurrentPage] = useState(0);

  const pages = Array.from({ length: totalPages }, (_, i) =>
    events.slice(i * eventsPerPage, i * eventsPerPage + eventsPerPage)
  );

  const nextPage = () => setCurrentPage((prev) => (prev + 1) % totalPages);
  const prevPage = () => setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);

  return (
    <section id="events" className="w-full">
      {/* Header */}
      <div className="w-full max-w-[1440px] mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 px-4 sm:px-8">
        <div>
          <h2 className="text-3xl sm:text-display-sm md:text-display-md font-extrabold text-foreground">
            Featured <span className="text-devcon-purple-bright">Events</span>
          </h2>

          <p className="mt-4 max-w-2xl text-body-sm sm:text-body-md font-extralight text-foreground">Explore the latest events and activities organized by DevCon to inspire learning, innovation, and community engagement.</p>
        </div>

        {/* Increase padding and text size */}
        <div className="[&>*]:!w-full sm:[&>*]:!w-[260px] [&>*]:!h-[56px] sm:[&>*]:!h-[76px] [&>*]:!text-[16px] sm:[&>*]:!text-[20px] [&>*]:!leading-[20px] [&>*]:!font-bold [&>*]:!flex [&>*]:!items-center [&>*]:!justify-center [&>*]:!gap-2 [&>*]:!whitespace-nowrap [&_svg]:!flex-shrink-0">
          <Button 
            label="View All Events" 
            href="/events"
            hasArrow={true} 
          />
        </div>
      </div>

      {/* Slider */}
      <div className="relative w-full max-w-[1440px] mx-auto py-6 px-4 sm:px-8">
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentPage * 100}%)` }}
          >
            {pages.map((pageEvents, pageIdx) => (
              <div key={pageIdx} className="w-full flex-shrink-0 flex gap-6">
                {pageEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Next button — always visible */}
        <button
          onClick={nextPage}
          className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 bg-white hover:bg-white/90 text-black rounded-full flex items-center justify-center shadow-md transition-all"
          aria-label="Next events"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Previous button — always visible */}
        <button
          onClick={prevPage}
          className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 bg-white hover:bg-white/90 text-black rounded-full flex items-center justify-center shadow-md transition-all"
          aria-label="Previous events"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Dots — one per page */}
        <div className="flex justify-center gap-2 mt-6">
          {pages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx)}
              className={`h-3 rounded-full transition-all duration-300 ${
                currentPage === idx ? 'w-7 bg-foreground' : 'w-3 bg-foreground/30'
              }`}
              aria-label={`Go to page ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}