'use client';
import React, { useState } from 'react';

const EVENTS = [
  { id: 1, title: 'DevCon Hackathon 2026', date: 'May 10–12, 2026', category: 'HACKATHON', color: 'bg-[#C0E00B] text-black', img: '/images/hackathon.png' },
  { id: 2, title: 'Web Dev Workshop', date: 'Dec 17, 2025', category: 'WORKSHOP', color: 'bg-[#F2C94C] text-black', img: '/images/workshop.png' },
  { id: 3, title: 'Tech Talk: AI in Dev', date: 'Feb 12, 2024', category: 'SEMINAR', color: 'bg-[#6320EE] text-white', img: '/images/techtalk.png' }
];

export default function EventsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % EVENTS.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + EVENTS.length) % EVENTS.length);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto py-8 px-4">
      {/* Slider Viewport */}
      <div className="relative overflow-hidden rounded-3xl group">
        <div 
          className="flex transition-transform duration-500 ease-in-out" 
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {EVENTS.map((event) => (
            <div 
              key={event.id} 
              className="w-full flex-shrink-0 h-[400px] relative bg-zinc-900"
            >
              {/* Background Image */}
              <img 
                src={event.img} 
                alt={event.title} 
                className="absolute inset-0 w-full h-full object-cover opacity-60" 
              />
              
              {/* Category Badge */}
              <div className={`absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${event.color}`}>
                {event.category}
              </div>
              
              {/* Card Details */}
              <div className="absolute bottom-6 left-6 z-10 text-white">
                <h3 className="text-2xl font-bold">{event.title}</h3>
                <p className="text-sm text-gray-300 mt-1">{event.date}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Previous Button */}
        <button 
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/80 hover:bg-white text-black rounded-full flex items-center justify-center shadow-md transition-all opacity-0 group-hover:opacity-100"
          aria-label="Previous slide"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Next Button */}
        <button 
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/80 hover:bg-white text-black rounded-full flex items-center justify-center shadow-md transition-all opacity-0 group-hover:opacity-100"
          aria-label="Next slide"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Interactive Dots */}
      <div className="flex justify-center gap-2 mt-6">
        {EVENTS.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-3 rounded-full transition-all duration-300 ${
              currentIndex === idx ? 'w-7 bg-white' : 'w-3 bg-white/30'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}