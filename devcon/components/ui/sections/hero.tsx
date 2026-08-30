import Image, { getImageProps } from "next/image";
import Button from "@/components/ui/button";
import SocialMedia from '@/components/ui/sections/social-media';
import { siteConfig } from '@/lib/site-config';

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
 */
export default function Hero() {
  return (
    <section id="hero" className="max-w-7xl mx-auto">
      <div className="relative w-full flex flex-col md:flex-row items-center xl:justify-between gap-6 xl:gap-4">
        {/* Text Content */}
        <div className="px-8 xl:pl-8 mt-8 xl:mt-0 h-fit z-1 max-w-full xl:max-w-xl">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-none text-foreground">
            <span>Building the </span>
            <span className="mt-1 text-devcon-lime-500">Future of Tech, </span>
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
            // Each variant declares its own true intrinsic size. They were previously
            // both given 2286x2286, which matched neither file and left the browser
            // reserving the wrong aspect ratio before the image loaded.
            const alt = "DevCon Laguna community collage";
            const { props: { srcSet: desktop } } = getImageProps({ alt, src: "/hero/web.webp", width: 2048, height: 2036, sizes: "60vw" });
            const { props: { srcSet: mobile, ...rest } } = getImageProps({ alt, src: "/hero/mobile.webp", width: 786, height: 1194, sizes: "140vw" });

            // The <picture> carries the layout classes so it is the flex item with the
            // exact box the <img> used to have. Do NOT use `display: contents` here:
            // that promotes the <source> to a flex item too, adding one extra `gap`
            // (16px) which narrows the text column and rewraps the heading.
            return (
              <picture className="w-[140vw] max-w-none -my-[50vw] md:w-[60vw] md:max-w-full md:-my-[10%] flex-shrink-0 z-0 block">
                <source media="(min-width: 768px)" srcSet={desktop} sizes="60vw" />
                <img
                  {...rest}
                  alt={alt}
                  srcSet={mobile}
                  fetchPriority="high"
                  loading="eager"
                  className="block w-full h-auto"
                />
              </picture>
            );
          })()}
      </div>
    </section>
  );
}
