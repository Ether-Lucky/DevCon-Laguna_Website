import Image from "next/image";
import Button from "@/components/ui/button";
import SocialMedia from '@/components/ui/sections/social-media';

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative overflow-visible bg-background -mt-8 px-6 pt-0 pb-6 text-foreground md:-mt-16 md:px-8 md:pt-0 md:pb-16"
    >
      <div className="relative mx-auto flex w-full max-w-[1400px] flex-col items-center gap-2 md:flex-row md:items-center md:justify-between md:gap-4 lg:gap-6">
        
        {/* Text Content */}
        <div className="w-full max-w-[640px] md:w-[54%] md:max-w-none z-1">
          <h1 className="text-[clamp(2rem,5vw,3.75rem)] font-extrabold leading-[1.25] tracking-[0.02em] text-foreground">
            <span className="block">Building the</span>
            <span className="mt-1 block whitespace-nowrap text-devcon-lime">Future of Tech,</span>
            <span className="mt-1 block text-devcon-orange">Together.</span>
          </h1>

          <p className="mt-6 max-w-[36rem] text-[clamp(1rem,2vw,1.125rem)] leading-[1.45] text-muted md:mt-7">
            DevCon Laguna is a community of developers, students, and technology
            enthusiasts dedicated to learning, collaborating, and creating meaningful
            impact through technology.
          </p>

          <SocialMedia />

          <div className="mt-8 flex flex-row gap-3 sm:gap-4 md:mt-12 relative">
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
              hasArrow
              className="h-14 min-w-[180px] px-8 text-[1rem] font-bold shadow-[0_0_0_1px_rgba(192,224,11,0.15)]"
            />
            <Button
              label="Learn More"
              href="#"
              variant="outline"
              hasArrow
              className="h-14 min-w-[180px] px-8 text-[1rem] font-bold"
            />
          </div>
        </div>

        {/* Image Content */}
        <div className="-mt-60 flex w-full justify-center md:mt-0 md:w-[65vw] md:flex-shrink-0 md:-ml-16 lg:-ml-24 z-0">
          <Image
            src="/hero/web.png"
            alt="DevCon Laguna community collage"
            width={1200}
            height={1228}
            priority
            className="hidden h-auto w-full md:block"
          />
          <Image
            src="/hero/mobile.png"
            alt="DevCon Laguna community collage"
            width={420}
            height={420}
            priority
            sizes="(max-width: 767px) 100vw, 0vw"
            className="h-auto w-full md:hidden mt-[23%]"
          />
        </div>
      </div>
    </section>
  );
}
