import About from "@/components/ui/about";
import MissionVision from '@/components/ui/mission-vision/mission-vision';

import NavBar from '@/components/ui/nav-bar/nav-bar';
import Hero from '@/components/ui/sections/hero';
import Stats from '@/components/ui/sections/stats';
import Events from '@/components/ui/events-carousel';
import WhatWeDo from '@/components/ui/what-we-do';
import Officers from '@/components/ui/officers';

export default function Home() {
  return (
    <>
      <NavBar />
      <main className="flex min-h-screen flex-col items-center justify-center bg-devcon-black p-24 text-devcon-white font-inter">  
        <Hero />
        <Stats />
        <About />
        <MissionVision />
        <WhatWeDo />
        <Events />
        <Officers />
      </main>
      <footer></footer>
    </>
  );
}