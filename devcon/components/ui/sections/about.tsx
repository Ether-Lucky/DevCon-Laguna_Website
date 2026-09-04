import Image from 'next/image';
import { slides } from '@/lib/content/about-devcon-slideshow';
import { DynamicCarousel } from '@/components/ui/dynamic-carousel';

/**
 * ImageSlideTiles — maps the `slides` content array into a list of
 * rounded image cards suitable for use as `DynamicCarousel` tiles.
 *
 * The first slide gets `priority` loading for LCP performance.
 * Each card has a subtle bottom gradient overlay for visual polish.
 */
function ImageSlideTiles() {
  return slides.map((slide) => (
    <div
      key={slide.id}
      className="relative flex-shrink-0 w-[calc(100vw-3rem)] sm:w-[500px] md:w-[540px] lg:w-[480px] xl:w-[540px] aspect-[3/2] rounded-[32px] overflow-hidden bg-zinc-900"
    >
      <Image
        src={slide.src}
        alt={slide.alt || 'DevCon Laguna event'}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 540px, 540px"
        className="object-cover"
        priority={slide.id === 1}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
    </div>
  ));
}

/**
 * About — the "Who We Are" homepage section.
 *
 * Two-column layout on large screens: descriptive copy on the left,
 * `DynamicCarousel` of community event photos on the right (hidden on mobile).
 */
export default function About() {
  return (
    <section id="about" className="max-w-7xl mx-auto py-12 lg:py-20 px-6 lg:px-12">
      <div className="w-full bg-background flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
        <div className="w-full lg:max-w-xl">
          <span className="text-base sm:text-lg font-mono tracking-wide text-accent-lime">
            {'// ABOUT DEVCON LAGUNA'}
          </span>
          <h2 className="mt-2 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground">
            Who <span className="text-accent-purple">We Are</span>
          </h2>
          <p className="mt-6 text-base sm:text-lg font-light leading-relaxed text-foreground/90">
            DevCon Laguna is a local chapter of the Developers Connect (DevCon) community, dedicated to fostering a culture of continuous learning, collaboration, and innovation. We bring together students, professionals, educators, and technology enthusiasts through engaging events, workshops, and community-driven initiatives that inspire growth and strengthen the local tech ecosystem.
          </p>
        </div>
        <DynamicCarousel
          label="Photos of the DevCon Laguna community"
          className="w-full max-w-xl lg:max-w-[480px] xl:max-w-[540px] min-w-0 hidden lg:block rounded-[32px]"
          tiles={ImageSlideTiles()}
        />
      </div>
    </section>
  );
}