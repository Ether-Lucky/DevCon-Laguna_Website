'use client';

import React, { useRef, useState, useEffect } from 'react';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/16/solid';
import clsx from 'clsx';

/**
 * Props for the `DynamicCarousel` component.
 *
 * @property tiles     - Array of React nodes to render as carousel slides.
 * @property gap       - Pixel gap between tiles. Defaults to 24 (matches Tailwind `gap-6`).
 * @property className - Additional Tailwind classes applied to the outer wrapper.
 */
interface CarouselProps {
	tiles: React.ReactNode[];
	gap?: number; // Gap between cards in px (matches Tailwind gap-6 = 24)
	className?: string;
}

/**
 * DynamicCarousel — a horizontally scrollable tile carousel with arrow navigation.
 *
 * - Uses native CSS `scroll-snap` for smooth, predictable alignment.
 * - Arrow buttons are automatically hidden/disabled when there is nothing to scroll.
 * - Scroll state is recalculated on scroll and window resize events.
 * - Clicking an arrow scrolls by the full visible container width.
 *
 * @example
 * <DynamicCarousel
 *   tiles={events.map(e => <EventCard key={e.id} event={e} />)}
 *   className="w-full py-8"
 * />
 */
function DynamicCarousel({ tiles, gap=24, className }: CarouselProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const [canScrollLeft, setCanScrollLeft] = useState(false);
	const [canScrollRight, setCanScrollRight] = useState(true);

	// Check scroll position to update button active states
	const updateScrollState = () => {
		const el = containerRef.current;
		if (!el) return;

		const { scrollLeft, scrollWidth, clientWidth } = el;
		setCanScrollLeft(scrollLeft > 5);
		setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
	};

	useEffect(() => {
		const el = containerRef.current;
		if (!el) return;

		updateScrollState();
		el.addEventListener('scroll', updateScrollState, { passive: true });
		window.addEventListener('resize', updateScrollState);

		return () => {
			el.removeEventListener('scroll', updateScrollState);
			window.removeEventListener('resize', updateScrollState);
		};
	}, [tiles]);

	// Scroll by container width for a full page swipe
	const scroll = (direction: 'left' | 'right') => {
		const container = containerRef.current;
		if (!container) return;

		// Scroll by the container's visible width, allowing CSS scroll-snap to align it perfectly
		const step = container.clientWidth;

		container.scrollBy({
			left: direction === 'right' ? step : -step,
			behavior: 'smooth',
		});
	};

	if (!tiles.length) return null;

	const buttonClassName =
		'group absolute top-1/2 z-20 flex h-10 w-10 md:h-12 md:w-12 -translate-y-1/2 items-center justify-center rounded-full bg-foreground text-background shadow-md cursor-pointer transition-opacity duration-200 disabled:opacity-0 disabled:pointer-events-none';
	const iconClassName = 'w-5 md:w-6 transition-transform duration-200';

	return (
		<div className={clsx("relative w-full mx-auto", className)}>
			{/* Scrollable Track */}
			<div
				ref={containerRef}
				className="flex overflow-x-auto scrollbar-none snap-x snap-mandatory py-4 scroll-smooth"
				style={{ gap: `${gap}px`, scrollbarWidth: 'none', msOverflowStyle: 'none' }}
			>
				{tiles.map((tile, idx) => (
					<div key={idx} className="flex-shrink-0 snap-start h-auto flex">
						{tile}
					</div>
				))}
			</div>

			{/* Navigation Controls */}
			<button
				onClick={() => scroll('left')}
				disabled={!canScrollLeft}
				className={`${buttonClassName} -left-2 sm:-left-5`}
				aria-label="Scroll left"
			>
				<ArrowLeftIcon className={`${iconClassName} group-hover:-translate-x-0.5`} />
			</button>

			<button
				onClick={() => scroll('right')}
				disabled={!canScrollRight}
				className={`${buttonClassName} -right-2 sm:-right-5`}
				aria-label="Scroll right"
			>
				<ArrowRightIcon className={`${iconClassName} group-hover:translate-x-0.5`} />
			</button>
		</div>
	);
}

export { DynamicCarousel }