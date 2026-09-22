import Image, { getImageProps } from "next/image";
import Button from "@/components/ui/button";
import SocialMedia from '@/components/ui/sections/social-media';
import { siteConfig } from '@/lib/site-config';
import type { HeroImage } from '@/lib/portal/landing-images';

/** The built-in artwork, and the frame every hero image is shown in. */
const BUILT_IN = {
  alt: 'DevCon Laguna community collage',
  desktop: { src: '/hero/web.webp', width: 2048, height: 2036 },
  mobile: { src: '/hero/mobile.webp', width: 786, height: 1194 },
} as const;

/**
 * Hero — the full-width landing section at the top of the homepage.
 *
 * Layout (desktop): two-column row — text content left, hero image right.
 * Layout (mobile): single column, image below text.
 *
 * - `web.png`: large circular collage, shown on `md` and above.
 * - `mobile.png`: full-bleed version optimised for small screens.
 * - `look-here.png`: a small decorative doodle above the CTA buttons.
 * - `SocialMedia` renders the row of social platform icon links.
 *
 * `desktop` and `mobile` come from the portal's `hero-desktop` / `hero-mobile`
 * slots (CMS-04). Each falls back to the built-in artwork independently.
 */
export default function Hero({ desktop, mobile }: { desktop?: HeroImage; mobile?: HeroImage } = {}) {
  return (
    <section id="hero" className="max-w-7xl mx-auto">
      <div className="relative w-full flex flex-col md:flex-row items-center xl:justify-between gap-6 xl:gap-4">
        {/* Text Content */}
        <div className="px-8 xl:pl-8 mt-8 xl:mt-0 h-fit z-1 max-w-full xl:max-w-xl">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-none text-foreground">
            <span>Building the </span>
            <span className="mt-1 text-accent-lime">Future of Tech, </span>
            <span className="mt-1 text-devcon-orange-500">Together.</span>
          </h1>

          <p className="mt-6 text-muted">
            DevCon Laguna is a community of developers, students, and technology
            enthusiasts dedicated to learning, collaborating, and creating meaningful
            impact through technology.
          </p>

          <SocialMedia />

          <div className="flex flex-col md:flex-row mt-12 gap-4 md:gap-8 relative">
            <Image 
              src="/hero/look-here.png"
              alt="Look Here"
              width={50}
              height={31}
              className="absolute -top-6 -left-4"
            />
            <Button
              label="Volunteer"
              href={siteConfig.portalUrl}
              variant="primary"
              analyticsId="hero-volunteer"
            />
            <Button
              label="Learn More"
              href={siteConfig.portalUrl}
              variant="outline"
              analyticsId="hero-learn-more"
            />
          </div>
        </div>

        {/* Image Content */}
          {/*
            Art direction via getImageProps + <picture>: the browser evaluates the
            media conditions and fetches exactly ONE candidate, so no device pays
            for the variant it will not display.

            Rendering both as <Image> and toggling with CSS forced a bad trade.
            With `priority` on both, every device preloaded both files. Without it,
            the LCP image was lazy and the browser found it ~990ms late, which is
            what dropped Largest Contentful Paint to 4.6s. One image per breakpoint
            removes the dilemma, so it can be eager and high priority.
          */}
          {(() => {
            // Each variant declares the size of its frame. For the built-in artwork
            // that is also the file's true size. An earlier version gave both
            // 2286x2286, which matched neither and reserved the wrong aspect ratio.
            //
            // One alt for both: <picture> puts alt on the single <img>, so a
            // desktop/mobile pair must describe the same scene. Desktop's wins.
            const alt = desktop?.alt ?? mobile?.alt ?? BUILT_IN.alt;
            const { props: { srcSet: desktopSrcSet } } = getImageProps({
              alt, src: desktop?.src ?? BUILT_IN.desktop.src,
              width: BUILT_IN.desktop.width, height: BUILT_IN.desktop.height, sizes: "60vw",
            });
            const { props: { srcSet: mobileSrcSet, ...rest } } = getImageProps({
              alt, src: mobile?.src ?? BUILT_IN.mobile.src,
              width: BUILT_IN.mobile.width, height: BUILT_IN.mobile.height, sizes: "140vw",
            });

            // The <picture> carries the layout classes so it is the flex item with the
            // exact box the <img> used to have. Do NOT use `display: contents` here:
            // that promotes the <source> to a flex item too, adding one extra `gap`
            // (16px) which narrows the text column and rewraps the heading.
            return (
              <picture className="w-[140vw] max-w-none -my-[50vw] md:w-[60vw] md:max-w-full md:-my-[10%] flex-shrink-0 z-0 block">
                <source media="(min-width: 768px)" srcSet={desktopSrcSet} sizes="60vw" />
                {/*
                  A fixed frame, not `h-auto` (CMS-04, PM decision 2026-09-22). With
                  `h-auto` the hero's height followed the loaded file, so an
                  uploaded image of any other shape would reflow the top of the
                  page. The aspect ratios are the built-in artwork's own, so it
                  renders exactly as before; anything else is cropped to fit.
                */}
                <img
                  {...rest}
                  alt={alt}
                  srcSet={mobileSrcSet}
                  fetchPriority="high"
                  loading="eager"
                  className="block w-full aspect-[786/1194] md:aspect-[2048/2036] object-cover"
                />
              </picture>
            );
          })()}
      </div>
    </section>
  );
}
