import Image from "next/image";
import Button from "@/components/ui/button";
import SocialMedia from '@/components/ui/sections/social-media';

export default function Hero() {
  return (
    <section
      id="hero"
      className="max-w-7xl mx-auto"
    >
      <div className="relative w-full flex flex-col xl:flex-row items-center xl:justify-between gap-6 xl:gap-4">
        {/* Text Content */}
        <div className="px-16 xl:pl-8 mt-16 xl:mt-0 h-fit z-1 max-w-full xl:max-w-xl">
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
          <Image
            src="/hero/test.png"
            alt="DevCon Laguna community collage"
            width={2286}
            height={2286}
            priority
            className="w-[200vw] w-[100vw] -my-[25%] -mx-[15%] flex-shrink-0 hidden xl:block z-0"
          />
         <Image
            src="/hero/mobile.png"
            alt="DevCon Laguna community collage"
            width={2286}
            height={2286}
            priority
            className="w-[140vw] max-w-none -my-[50vw] xl:hidden z-0"
          />
        {/* Mobile Buttons — below image */}
        {/* <div className="flex md:hidden w-full justify-center gap-3 mt-2 order-3 relative z-10">
          <Image 
            src="/hero/look-here.png"
            alt="Look Here"
            width={50}
            height={31}
            className="absolute -top-6 left-[calc(50%-120px)]"
          />
          <Button
            label="Volunteer"
            href="#"
            variant="primary"
            hasArrow
            className="h-14 min-w-0 px-6 text-[0.875rem] font-bold shadow-[0_0_0_1px_rgba(192,224,11,0.15)]"
          />
          <Button
            label="Learn More"
            href="#"
            variant="outline"
            hasArrow
            className="h-14 min-w-0 px-6 text-[0.875rem] font-bold"
          />
        </div> */}
      </div>
    </section>
  );
}
