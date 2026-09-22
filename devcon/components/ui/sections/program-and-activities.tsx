"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Button from "../button";
import { type ProgramOrActivity, programsAndActivities } from '@/lib/content/programs-and-activities'

import { PauseIcon, PlayIcon, PhotoIcon as ImageIcon } from '@heroicons/react/24/outline';

/** How long each slide stays up while the slideshow is playing. */
const SLIDE_INTERVAL_MS = 10_000;

/** A swipe or drag shorter than this is treated as a click, not a slide change. */
const SWIPE_THRESHOLD_PX = 50;

/**
 * ProgramsAndActivities — a full-bleed banner carousel for featured programs
 * (PROGRAM-01, restored in PROGRAM-01-BT-01).
 *
 * A slide with a banner shows only the banner and its buttons: the banner's
 * headline and copy are baked into the artwork. A slide without one shows its
 * `title` and `description` as real text over a placeholder gradient, so it is
 * never an empty slide with two unexplained buttons.
 *
 * Accessibility (A11Y-01 applies to the whole page):
 * - **The slideshow can be paused** (WCAG 2.2.2). Anything that moves on its
 *   own for more than five seconds needs a pause control, and axe cannot detect
 *   this automatically — the accessibility suite would pass without it.
 * - It also pauses while hovered or while keyboard focus is inside, so a
 *   visitor reading a slide or tabbing to a button is never moved on mid-way,
 *   and it never auto-plays under `prefers-reduced-motion`.
 * - **Hover is read from the browser at each tick** (`:hover`), not tracked
 *   with enter/leave events. A missed `mouseleave` — the cursor leaving the
 *   window straight from the carousel, which WebKit reproduced in testing —
 *   would otherwise leave it paused until someone hovered it again. It only
 *   applies on devices that can hover: after a tap, touch browsers keep
 *   `:hover` stuck on the tapped element.
 * - Follows the WAI-ARIA carousel pattern: a labelled carousel region, slides
 *   announced as "slide 1 of 3", and a live region that only announces changes
 *   while paused, so auto-advance does not talk over a screen reader.
 * - The banner is always dark, so the section renders its tokens in the dark
 *   theme (`className="dark"`) — otherwise the light theme would put dark
 *   outline-button text on a dark banner.
 */
export default function ProgramsAndActivities({ slides = programsAndActivities }: { slides?: ProgramOrActivity[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const [focused, setFocused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const regionRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const isDragging = useRef<boolean>(false);
  const dragStartX = useRef<number>(0);

  const count = slides.length;
  const canRotate = count > 1;
  // Whether the slideshow is set to rotate. Hover is deliberately not part of
  // this: it is checked at each tick instead (see the component docs).
  const playing = canRotate && !userPaused && !focused && !reducedMotion;

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!playing) return;
    const canHover = window.matchMedia('(hover: hover)').matches;
    const timer = setInterval(() => {
      if (canHover && regionRef.current?.matches(':hover')) return;
      setCurrentIndex((index) => (index + 1) % count);
    }, SLIDE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [playing, count]);

  const next = useCallback(() => setCurrentIndex((index) => (index + 1) % count), [count]);
  const previous = useCallback(() => setCurrentIndex((index) => (index === 0 ? count - 1 : index - 1)), [count]);

  const handleSwipeAction = (distance: number) => {
    if (distance > SWIPE_THRESHOLD_PX) previous();
    else if (distance < -SWIPE_THRESHOLD_PX) next();
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

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    handleSwipeAction(e.clientX - dragStartX.current);
  };

  if (count === 0) return null;
  const currentSlide = slides[Math.min(currentIndex, count - 1)];

  return (
    <section id="activities" aria-labelledby="activities-heading" className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
      {/* The design has no visible heading here; this keeps the page's heading
          outline unbroken and names the section for screen readers. */}
      <h2 id="activities-heading" className="sr-only">Programs and Activities</h2>

      <div
        ref={regionRef}
        role="region"
        aria-roledescription="carousel"
        aria-label="Programs and activities"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => { isDragging.current = false; }}
        onFocus={() => setFocused(true)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false);
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="dark relative w-full rounded-[28px] overflow-hidden bg-devcon-black-500 border border-border p-4 sm:p-8 md:p-16 shadow-2xl h-[400px] sm:h-[480px] md:h-[540px] flex flex-col justify-between cursor-grab active:cursor-grabbing select-none"
      >

        {/* Background Layer */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              aria-hidden={currentIndex !== index}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                currentIndex === index ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              {slide.bannerImg ? (
                <>
                  {/* Not `priority`: this section sits at the bottom of the page,
                      and preloading a multi-megabyte banner competes with the hero
                      image the Largest Contentful Paint is measured on. */}
                  {/* Contained, not cropped, below `xl`. A banner is wide artwork
                      with its text baked in; cropping it to fill a tall phone
                      frame cut the headline off mid-word. Scaled to fit, it is
                      small but whole. The frame only reaches the banner's ~2.2:1
                      shape at `xl`, so cropping starts there and nowhere narrower.
                      This holds for any banner, including
                      ones uploaded later through the portal, because it does not
                      depend on knowing where the artwork's text is. */}
                  <Image
                    src={slide.bannerImg}
                    alt={slide.bannerAlt ?? slide.title}
                    fill
                    sizes="(max-width: 1280px) 100vw, 1280px"
                    className="object-contain xl:object-cover object-center w-full h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />
                </>
              ) : (
                /* Placeholder card: no photo yet */
                <div className="absolute inset-0 bg-gradient-to-br from-devcon-purple-700 to-devcon-black-500 flex items-center justify-center">
                  <ImageIcon className="w-16 h-16 text-white/10" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Slide Content Overlay */}
        <div
          role="group"
          aria-roledescription="slide"
          aria-label={`${currentIndex + 1} of ${count}`}
          aria-live={playing ? 'off' : 'polite'}
          // A banner's headline and copy are baked into the artwork on its left,
          // so its buttons sit at the bottom, clear of that text. Vertically
          // centred, they landed on top of the headline. Text slides keep their
          // content centred.
          className={`relative z-30 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center pointer-events-auto ${
            currentSlide.bannerImg ? 'mt-auto' : 'my-auto'
          }`}
        >
          <div className="flex flex-col flex-end space-y-6">
            {!currentSlide.bannerImg && (
              <div className="ml-0 sm:ml-8 space-y-4 text-white">
                <h3 className="text-3xl md:text-5xl font-extrabold leading-tight drop-shadow-lg">{currentSlide.title}</h3>
                {currentSlide.description && (
                  <p className="max-w-xl text-base md:text-lg text-white/85 drop-shadow-md">{currentSlide.description}</p>
                )}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-4 pt-4 ml-0 sm:ml-8">
              <Button
                label={currentSlide.primaryBtnLabel}
                href={currentSlide.primaryBtnLink}
                variant="primary"
                analyticsId={`programs-${currentSlide.id}-primary`}
              />
              {currentSlide.secondaryBtnLabel && currentSlide.secondaryBtnLink && (
                <Button
                  label={currentSlide.secondaryBtnLabel}
                  href={currentSlide.secondaryBtnLink}
                  variant="outline"
                  analyticsId={`programs-${currentSlide.id}-secondary`}
                />
              )}
            </div>
          </div>

          <div className="hidden lg:block" />
        </div>

        {/* Controls: pause/play and slide indicators */}
        {canRotate && (
          <div className="relative z-30 flex items-center justify-center gap-4 mt-8 pt-2">
            <button
              type="button"
              onClick={() => setUserPaused((paused) => !paused)}
              aria-label={userPaused ? 'Play slideshow' : 'Pause slideshow'}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {userPaused ? <PlayIcon className="h-4 w-4" /> : <PauseIcon className="h-4 w-4" />}
            </button>

            <div className="flex items-center gap-2">
              {slides.map((slide, index) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setCurrentIndex(index)}
                  aria-current={currentIndex === index ? 'true' : undefined}
                  className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                    currentIndex === index ? "w-8 bg-white" : "w-2.5 bg-white/40 hover:bg-white/60"
                  }`}
                  aria-label={`Go to slide ${index + 1}: ${slide.title}`}
                />
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
