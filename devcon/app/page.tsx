import Carousel from '@/components/ui/events-carousel';
import WhatWeDo from '@/components/ui/what-we-do';
import NavBar from '@/components/ui/nav-bar/nav-bar';

export default function Home() {
  return (
    <>
      <NavBar />
      <main className="flex min-h-screen flex-col items-center justify-center bg-devcon-black p-24 text-devcon-white font-inter"> 
        <WhatWeDo />
      </main>
      <footer></footer>
    </>
  )
}
