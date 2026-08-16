import About from "@/components/ui/sections/about";
import MissionVision from '@/components/ui/mission-vision/mission-vision';
import NavBar from '@/components/ui/nav-bar/nav-bar';
import Hero from '@/components/ui/sections/hero';
import Stats from '@/components/ui/sections/stats';
import Events from '@/components/ui/sections/events-carousel';
import WhatWeDo from '@/components/ui/sections/what-we-do';
import Officers from '@/components/ui/sections/officers';
import ProgramsAndActivities from '@/components/ui/sections/program-and-activities';
import Footer from '@/components/ui/sections/footer';
import ScrollReveal from '@/components/ui/scroll-reveal';


export default function Home() {
  return (
    <>
      <NavBar />
      <main className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground mt-0 overflow-hidden">  
        <ScrollReveal className="w-full" variant="fade" amount={0.05}>
          <Hero />
        </ScrollReveal>
        <ScrollReveal className="w-full" variant="scale">
          <Stats />
        </ScrollReveal>
        <ScrollReveal className="w-full">
          <About />
        </ScrollReveal>
        {/* <ScrollReveal className="w-full">
          <MissionVision />
        </ScrollReveal> */}
        {/* <ScrollReveal className="w-full">
          <WhatWeDo />
        </ScrollReveal> */}
        {/* <ScrollReveal className="w-full">
          <Events />
        </ScrollReveal> */}
        {/* <ScrollReveal className="w-full">
          <Officers />
        </ScrollReveal> */}
        {/* <ScrollReveal className="w-full">
          <ProgramsAndActivities />
        </ScrollReveal> */}
      </main> 
      {/* <ScrollReveal className="w-full" variant="fade">
          <Footer/>
      </ScrollReveal> */}
    </>
  );
}
