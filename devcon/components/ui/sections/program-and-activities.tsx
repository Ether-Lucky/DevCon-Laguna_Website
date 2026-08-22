"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Button from "../button";
import { ProgramOrActivity, programsAndActivities} from '@/lib/content/programs-and-activities'

// Inline Image Icon to represent a missing photo
const ImageIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
  </svg>
);

export default function ProgramsAndActivities() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const isDragging = useRef<boolean>(false);
  const dragStartX = useRef<number>(0);

  // Auto-slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % programsAndActivities.length);
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  // Handle Swipe / Drag Logic
  const handleSwipeAction = (distance: number) => {
    if (distance > 50) {
      setCurrentIndex((prevIndex) => (prevIndex === 0 ? programsAndActivities.length - 1 : prevIndex - 1));
    } else if (distance < -50) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % programsAndActivities.length);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const distance = touchEndX.current - touchStartX.current;
    if (touchEndX.current !== 0) {
      handleSwipeAction(distance);
      touchEndX.current = 0;
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    dragStartX.current = e.clientX;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const distance = e.clientX - dragStartX.current;
    handleSwipeAction(distance);
  };

  const currentSlide = programsAndActivities[currentIndex];

  return (
    <section id="activities" className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
      <div 
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="relative w-full rounded-[28px] overflow-hidden bg-zinc-900 border border-border p-4 sm:p-8 md:p-16 shadow-2xl h-[400px] sm:h-[480px] md:h-[540px] flex flex-col justify-between cursor-grab active:cursor-grabbing select-none"
      >
        
        {/* Background Layer */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {programsAndActivities.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                currentIndex === index ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              {slide.bannerImg ? (
                <>
                  <Image
                    src={slide.bannerImg}
                    alt={slide.title}
                    fill
                    sizes="(max-width: 1280px) 100vw, 1280px"
                    className="object-cover object-center w-full h-full"
                    priority={index === 0}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />
                </>
              ) : (
                /* Placeholder card: no photo yet */
                <div className="absolute inset-0 bg-gradient-to-br from-devcon-purple-700 to-devcon-black flex items-center justify-center">
                  <ImageIcon className="w-16 h-16 text-white/10" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Slide Content Overlay */}
        <div className="relative z-30 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center my-auto pointer-events-auto">
          
          <div className="flex flex-col flex-end space-y-6">

            {/* VISIBLE BUTTONS */}
            <div className="flex flex-wrap items-center gap-4 pt-4 ml-0 sm:ml-8">
              <Button 
                label={currentSlide.primaryBtnLabel} 
                variant="primary" 
              />
              { currentSlide.secondaryBtnLabel && 
                <Button
                  label={currentSlide.secondaryBtnLabel} 
                  variant="outline" 
                />
              }
            </div>
          </div>

          <div className="hidden lg:block" />

        </div>

        {/* Bottom Slider Indicators */}
        <div className="relative z-30 flex items-center justify-center mt-8 pt-2">
          <div className="flex items-center gap-2">
            {programsAndActivities.map((slide, index) => (
              <button
                key={slide.id}
                onClick={() => setCurrentIndex(index)}
                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  currentIndex === index ? "w-8 bg-white" : "w-2.5 bg-white/40 hover:bg-white/60"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}