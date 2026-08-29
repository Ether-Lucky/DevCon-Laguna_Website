import Image, { getImageProps } from "next/image";
import Button from "@/components/ui/button";
import SocialMedia from '@/components/ui/sections/social-media';

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
              href="#"
              variant="primary"
            />
            <Button
              label="Learn More"
              href="#"
              variant="outline"
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
            const common = { alt: "DevCon Laguna community collage", width: 2286, height: 2286 };
            const { props: { srcSet: desktop } } = getImageProps({ ...common, src: "/hero/web.png", sizes: "60vw" });
            const { props: { srcSet: mobile, ...rest } } = getImageProps({ ...common, src: "/hero/mobile.png", sizes: "140vw" });

            // `contents` removes the <picture> box from layout so the <img> stays the
            // flex item, exactly as before art direction. Without it the inline
            // <picture> wrapper adds line-box descender space and grew the hero ~40px.
            return (
              <picture className="contents">
                <source media="(min-width: 768px)" srcSet={desktop} />
                <img
                  {...rest}
                  alt={common.alt}
                  srcSet={mobile}
                  fetchPriority="high"
                  loading="eager"
                  className="w-[140vw] max-w-none -my-[50vw] md:w-[60vw] md:max-w-full md:-my-[10%] flex-shrink-0 z-0"
                />
              </picture>
            );
          })()}
      </div>
    </section>
  );
}
