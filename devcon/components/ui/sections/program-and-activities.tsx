"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Button from "../button";

// Inline Image Icon to represent a missing photo
const ImageIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
  </svg>
);

interface Slide {
  id: number;
  titlePart1: string;
  titleHighlight: string;
  titlePart2: string;
  description: string;
  primaryBtnText: string;
  secondaryBtnText: string;
  imagePath?: string; 
  hideText?: boolean; 
}

const slides: Slide[] = [
  {
    id: 1,
    titlePart1: "Become Part of the ",
    titleHighlight: "DevCon Kids",
    titlePart2: " Community",
    description: "Join us in shaping a future where every kid can code, create, and change the world.",
    primaryBtnText: "Join Us",
    secondaryBtnText: "Learn More",
    imagePath: "/images/banner/banner1.png",
  },
  {
    id: 2,
    titlePart1: "Empowering Next-Gen ",
    titleHighlight: "Developers",
    titlePart2: " Daily",
    description: "Explore our intensive workshops, hackathons, and tech talks tailored for growth.",
    primaryBtnText: "Explore",
    secondaryBtnText: "View Events",
    imagePath: "", 
    hideText: true, 
  },
  {
    id: 3,
    titlePart1: "Innovate Together with ",
    titleHighlight: "DevCon Laguna",
    titlePart2: " Initiatives",
    description: "Collaborate with passionate student developers and industry leaders across the region.",
    primaryBtnText: "Get Involved",
    secondaryBtnText: "Contact Us",
    imagePath: "", 
    hideText: true, 
  },
];

export default function ProgramsAndActivities() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const isDragging = useRef<boolean>(false);
  const dragStartX = useRef<number>(0);

  // Auto-slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  // Handle Swipe / Drag Logic
  const handleSwipeAction = (distance: number) => {
    if (distance > 50) {
      setCurrentIndex((prevIndex) => (prevIndex === 0 ? slides.length - 1 : prevIndex - 1));
    } else if (distance < -50) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
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

  const currentSlide = slides[currentIndex];
  // Determine if text should be hidden (either by an existing image or the new hideText flag)
  const isTextHidden = Boolean(currentSlide.imagePath || currentSlide.hideText);

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-12">
      <div 
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="relative w-full rounded-[32px] overflow-hidden bg-devcon-black border border-devcon-gray/20 p-8 md:p-16 shadow-2xl h-[480px] md:h-[540px] flex flex-col justify-between cursor-grab active:cursor-grabbing select-none"
      >
        
        {/* Background Layer */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                currentIndex === index ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              {slide.imagePath ? (
                <Image
                  src={slide.imagePath}
                  alt={slide.titleHighlight}
                  fill
                  sizes="(max-width: 1280px) 100vw, 1280px"
                  className="object-cover object-center w-full h-full"
                  priority={index === 0}
                />
              ) : (
                /* Placeholder card: no photo yet */
                <div className="absolute inset-0 bg-gradient-to-br from-devcon-purple-dark to-devcon-black flex items-center justify-center">
                  <ImageIcon className="w-16 h-16 text-devcon-white/10" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Slide Content Overlay */}
        <div className="relative z-30 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center my-auto pointer-events-auto">
          
          <div className="flex flex-col justify-center space-y-6">
            
            {/* DYNAMIC TEXT: Invisible if an image exists OR hideText is true */}
            <h2 
              aria-hidden={isTextHidden ? "true" : "false"} 
              className={`text-3xl md:text-5xl font-bold tracking-tight font-sans leading-tight transition-all duration-300 ${
                isTextHidden ? "invisible select-none pointer-events-none" : "text-devcon-white visible"
              }`}
            >
              {currentSlide.titlePart1}
              <span className="text-devcon-lime">{currentSlide.titleHighlight}</span>
              {currentSlide.titlePart2}
            </h2>
            
            <p 
              aria-hidden={isTextHidden ? "true" : "false"} 
              className={`text-base md:text-lg font-light leading-relaxed max-w-xl font-sans transition-all duration-300 ${
                isTextHidden ? "invisible select-none pointer-events-none" : "text-devcon-gray visible"
              }`}
            >
              {currentSlide.description}
            </p>

            {/* VISIBLE BUTTONS */}
            <div className="flex flex-wrap items-center gap-4 pt-4 ml-14
              [&>*]:!px-[24px] [&>*]:!py-[12px]
              [&>*]:!text-[20px] [&>*]:!font-[700] [&>*]:!leading-[20px] [&>*]:!tracking-[0%] 
              [&>*]:![font-family:var(--font-sans)]
              [&>*]:flex [&>*]:items-center [&>*]:justify-center"
            >
              <Button 
                label={currentSlide.primaryBtnText} 
                variant="primary" 
              />
              <Button 
              label={currentSlide.secondaryBtnText} 
              variant="outline" 
              className="!bg-[var(--color-devcon-black)] !border !border-[var(--color-devcon-lime)] !text-[var(--color-devcon-white)]"
              />
            </div>
          </div>

          <div className="hidden lg:block" />

        </div>

        {/* Bottom Slider Indicators */}
        <div className="relative z-30 flex items-center justify-center mt-8 pt-2">
          <div className="flex items-center gap-2">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                onClick={() => setCurrentIndex(index)}
                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  currentIndex === index ? "w-8 bg-devcon-white" : "w-2.5 bg-devcon-gray/40 hover:bg-devcon-gray"
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