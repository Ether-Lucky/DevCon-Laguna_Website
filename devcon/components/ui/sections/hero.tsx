import Image from "next/image";
import Button from "@/components/ui/button";
import SocialMedia from '@/components/ui/sections/social-media';

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative bg-devcon-black px-6 py-6 text-devcon-white md:px-8 md:py-16"
    >
      <div className="relative mx-auto flex w-full max-w-[1200px] flex-col items-center gap-4 md:flex-row md:items-center md:justify-between md:gap-10 lg:gap-16">
        
        {/* Text Content */}
        <div className="w-full max-w-[640px] md:w-[54%] md:max-w-none z-1">
          <h1 className="text-[clamp(3rem,7vw,5.25rem)] font-extrabold leading-[0.95] tracking-[-0.04em] text-devcon-white">
            <span className="block">Building the</span>
            <span className="block text-devcon-lime">Future of Tech,</span>
            <span className="block text-devcon-orange">Together.</span>
          </h1>

          <p className="mt-6 max-w-[36rem] text-[clamp(1rem,2vw,1.125rem)] leading-[1.45] text-devcon-gray md:mt-7">
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
        <div className="-mt-60 flex w-full justify-center md:mt-0 md:w-[50vw] md:justify-end z-0">
          <Image
            src="/hero/web.png"
            alt="DevCon Laguna community collage"
            width={1000}
            height={1023}
            priority
            className="hidden h-auto w-full md:block"
          />
          <Image
            src="/hero/mobile.png"
            alt="DevCon Laguna community collage"
            width={420}
            height={420}
            priority
            sizes="(max-width: 767px) 92vw, 0vw"
            className="h-auto w-full md:hidden"
          />
        </div>
      </div>
    </section>
  );
}
