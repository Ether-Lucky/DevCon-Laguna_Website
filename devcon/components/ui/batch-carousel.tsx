'use client';

import React, { useEffect, useState } from 'react';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/16/solid';
import clsx from 'clsx';

/**
 * How many tiles are shown at once at each viewport width, largest first.
 *
 * These mirror Tailwind's `sm` / `md` / `lg` breakpoints, because the tiles
 * themselves are sized with Tailwind classes. Keep the two in step: a batch of
 * four 224 px cards needs roughly 1024 px of room.
 */
const BATCH_SIZES = [
  { minWidth: 1024, perView: 4 },
  { minWidth: 768, perView: 3 },
  { minWidth: 640, perView: 2 },
  { minWidth: 0, perView: 1 },
] as const;

/** The widest batch — also the server-rendered default, see `perView` below. */
const DEFAULT_PER_VIEW = BATCH_SIZES[0].perView;

/**
 * batchSizeFor — how many tiles fit in one batch at `width` CSS pixels.
 */
export function batchSizeFor(width: number): number {
  return BATCH_SIZES.find((size) => width >= size.minWidth)?.perView ?? 1;
}

/**
 * clampStart — keeps the first visible tile inside the track.
 *
 * The last batch is flush with the end of the track rather than running past
 * it, so the final step never shows empty space where a tile should be.
 */
export function clampStart(start: number, total: number, perView: number): number {
  return Math.max(0, Math.min(start, total - perView));
}

/**
 * Props for `BatchCarousel`.
 *
 * @property tiles         - Slides. One tile is one step.
 * @property gap           - Pixel gap between tiles. Defaults to 24 (Tailwind `gap-6`).
 * @property label         - Accessible name for the group. Every carousel on the
 *                           page needs a distinct one (A11Y-01).
 * @property previousLabel - Accessible name for the "step back" button.
 * @property nextLabel     - Accessible name for the "step forward" button.
 * @property describeRange - Builds the live-region sentence from the visible tile
 *                           range (0-based, `last` inclusive). Without it, no live
 *                           region is rendered.
 * @property className     - Extra classes on the outer wrapper.
 */
interface BatchCarouselProps {
  tiles: React.ReactNode[];
  gap?: number;
  label: string;
  previousLabel?: string;
  nextLabel?: string;
  describeRange?: (first: number, last: number) => string;
  className?: string;
}

/**
 * BatchCarousel — shows a whole batch of tiles and steps one tile at a time.
 *
 * Unlike {@link DynamicCarousel}, which is a free-scrolling region, this one
 * shows a **fixed number of complete tiles** and moves by exactly one tile per
 * press: the tile at the front of the batch slides out of view and one new tile
 * appears at the end. Nothing is ever half visible at an edge.
 *
 * Why not `scroll-snap` like `DynamicCarousel`? Scrolling is driven by the
 * container's width, so the trailing tile is usually cut in half, and the user
 * cannot tell where the batch they have already seen ends. Here the track is a
 * transform on a clipped viewport, so the batch boundary is exact.
 *
 * Accessibility notes:
 * - **Every tile stays in the document.** They are clipped, not unmounted, so a
 *   screen reader still reaches the whole list and nothing depends on the user
 *   finding the buttons.
 * - The viewport is `overflow-hidden`, not scrollable, so it needs no
 *   `tabIndex` — the rule that forced one on `DynamicCarousel` applies to
 *   scrollable regions only.
 * - `describeRange` feeds a polite live region so a sighted screen-reader user
 *   is told what moved.
 * - The transform is dropped under `prefers-reduced-motion: reduce`
 *   (`motion-reduce:transition-none`); the step still happens, instantly.
 */
function BatchCarousel({
  tiles,
  gap = 24,
  label,
  previousLabel = 'Previous',
  nextLabel = 'Next',
  describeRange,
  className,
}: BatchCarouselProps) {
  // Rendered on the server before any viewport is known, so it starts at the
  // widest batch and narrows on mount. Starting narrow instead would make every
  // desktop visitor see one card and then a jump to four.
  const [perView, setPerView] = useState<number>(DEFAULT_PER_VIEW);
  const [start, setStart] = useState(0);

  useEffect(() => {
    const measure = () => setPerView(batchSizeFor(window.innerWidth));
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  if (!tiles.length) return null;

  const visible = Math.min(perView, tiles.length);
  const maxStart = Math.max(0, tiles.length - visible);
  // Clamped on the way out rather than in an effect: rotating the device, or a
  // shorter roster arriving from the portal, can leave the stored index past the
  // end of the track, and re-deriving it here needs no extra render.
  const first = clampStart(start, tiles.length, visible);
  const last = Math.min(tiles.length - 1, first + visible - 1);
  const canStepBack = first > 0;
  const canStepForward = first < maxStart;

  const step = (direction: -1 | 1) =>
    setStart(clampStart(first + direction, tiles.length, visible));

  // One tile's share of the track, and the distance of one step: a tile plus
  // the gap that follows it.
  const tileWidth = `(100% - ${(visible - 1) * gap}px) / ${visible}`;
  const offset = `calc(${first} * -1 * (${tileWidth} + ${gap}px))`;

  const buttonClassName =
    'group absolute top-1/2 z-20 flex h-10 w-10 md:h-12 md:w-12 -translate-y-1/2 items-center justify-center rounded-full bg-foreground text-background shadow-md cursor-pointer transition-opacity duration-200 disabled:opacity-0 disabled:pointer-events-none';
  const iconClassName = 'w-5 md:w-6 transition-transform duration-200';

  return (
    <div className={clsx('relative w-full mx-auto', className)}>
      {/*
        `aria-roledescription="carousel"` is the WAI-ARIA carousel pattern, and it
        is also what tells the accessibility suite this group is not one of the
        scrollable tracks that must carry `tabIndex` — this one is clipped, not
        scrollable, so there is nothing for the arrow keys to move.
      */}
      <div
        className="overflow-hidden"
        role="group"
        aria-roledescription="carousel"
        aria-label={label}
      >
        <div
          className="flex transition-transform duration-500 ease-out motion-reduce:transition-none"
          style={{ gap: `${gap}px`, transform: `translateX(${offset})` }}
        >
          {tiles.map((tile, idx) => (
            <div
              key={idx}
              // The tests assert on which tiles are wholly inside the clip; an
              // officer's heading is narrower than its tile, so measuring the
              // headings would count a tile clipped by a few pixels as visible.
              data-carousel-tile={idx}
              // `min-w-0` lets the tile honour its computed share of the track.
              // A flex item otherwise refuses to go below its content's
              // intrinsic width, so one tile with a fixed-width child turns a
              // batch of four into three-and-a-bit spilling past the clip.
              className="flex min-w-0 shrink-0 grow-0"
              style={{ flexBasis: `calc(${tileWidth})` }}
            >
              {tile}
            </div>
          ))}
        </div>
      </div>

      {describeRange ? (
        <p className="sr-only" aria-live="polite">
          {describeRange(first, last)}
        </p>
      ) : null}

      {/*
        Both buttons are rendered even when the whole list fits, so the markup
        does not change shape between batch sizes; `disabled:opacity-0` hides
        them and takes them out of the tab order.
      */}
      <button
        onClick={() => step(-1)}
        disabled={!canStepBack}
        className={`${buttonClassName} -left-2 sm:-left-5`}
        aria-label={previousLabel}
      >
        <ArrowLeftIcon className={`${iconClassName} group-hover:-translate-x-0.5`} />
      </button>

      <button
        onClick={() => step(1)}
        disabled={!canStepForward}
        className={`${buttonClassName} -right-2 sm:-right-5`}
        aria-label={nextLabel}
      >
        <ArrowRightIcon className={`${iconClassName} group-hover:translate-x-0.5`} />
      </button>
    </div>
  );
}

export { BatchCarousel };
