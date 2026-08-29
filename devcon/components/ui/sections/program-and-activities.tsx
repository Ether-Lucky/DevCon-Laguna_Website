"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Button from "../button";
import { ProgramOrActivity, programsAndActivities} from '@/lib/content/programs-and-activities'

import { PhotoIcon as ImageIcon } from '@heroicons/react/24/outline';

/**
 * ProgramsAndActivities — a full-bleed banner carousel for featured programs.
 *
 * Currently **disabled** on the home page (`page.tsx`) pending content readiness.
 * To re-enable, uncomment its `<ScrollReveal>` block in `app/page.tsx`.
 *
 * Features:
 * - Auto-advances every 10 seconds via `setInterval`.
 * - Supports touch swipe (left/right) and mouse drag for manual navigation.
 * - A swipe/drag distance > 50px triggers a slide change.
 * - Dot indicators at the bottom show current slide and allow direct navigation.
 * - If a slide has no `bannerImg`, a purple placeholder gradient is shown.
 *
 * Slide data is sourced from `lib/content/programs-and-activities.ts`.
 */
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