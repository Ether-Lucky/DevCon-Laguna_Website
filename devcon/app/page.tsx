import About from "@/components/ui/sections/about";
import MissionVision from '@/components/ui/sections/mission-vision/mission-vision';
import NavBar from '@/components/ui/nav-bar/nav-bar';
import Hero from '@/components/ui/sections/hero';
import Stats from '@/components/ui/sections/stats';
import Events from '@/components/ui/sections/events';
import WhatWeDo from '@/components/ui/sections/what-we-do';
import Officers from '@/components/ui/sections/officers';
import ProgramsAndActivities from '@/components/ui/sections/program-and-activities';
import Footer from '@/components/ui/sections/footer';
import ScrollReveal from '@/components/ui/scroll-reveal';


/**
 * Home — the root page of the DevCon Laguna website.
 *
 * Composes all homepage sections in order:
 *   NavBar → Hero → Stats → About → MissionVision → WhatWeDo
 *   → Events → Officers → Footer
 *
 * Each section (except NavBar) is wrapped in a `ScrollReveal` animation
 * that triggers once when it enters the viewport.
 *
 * `ProgramsAndActivities` is currently commented out pending content readiness.
 */
export default function Home() {
  return (
    <>
      <NavBar />
      <main className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground mt-0 overflow-hidden">  
        {/*
          The hero is above the fold and holds the Largest Contentful Paint
          element, so it is deliberately NOT scroll-revealed. ScrollReveal
          server-renders its children at opacity 0 and only reveals them after
          the bundle loads, React hydrates, framer-motion initialises, an
          IntersectionObserver fires and a 0.85s animation runs — which showed
          up as 2255ms of LCP "render delay". A plain wrapper paints immediately
          and keeps the same `w-full` box ScrollReveal would have rendered.
        */}
        <div className="w-full">
          <Hero />
        </div>
        <ScrollReveal className="w-full" variant="scale">
          <Stats />
        </ScrollReveal>
        <ScrollReveal className="w-full">
          <About />
        </ScrollReveal>
        <ScrollReveal className="w-full">
          <MissionVision />
        </ScrollReveal>
        <ScrollReveal className="w-full">
          <WhatWeDo />
        </ScrollReveal>
        <ScrollReveal className="w-full">
          <Events />
        </ScrollReveal>
        <ScrollReveal className="w-full">
          <Officers />
        </ScrollReveal>
        {/* <ScrollReveal className="w-full">
          <ProgramsAndActivities />
        </ScrollReveal> */}
      </main> 
      <ScrollReveal className="w-full" variant="fade">
          <Footer/>
      </ScrollReveal>
    </>
  );
}
