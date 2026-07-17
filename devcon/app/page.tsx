import React from 'react';
import Button from '@/components/ui/button';
import Carousel from '@/components/ui/events-carousel';
import NavLinks from "@/components/ui/nav-links";

export default function Home() {
  return (
    <>
      <nav className='flex flex-row gap-16'>
        {/* Logo */}
        <NavLinks />
        <button>Join Us</button>
        {/* Theme Button */}
      </nav>
          <main className="flex min-h-screen flex-col items-center justify-center bg-devcon-black p-24 text-devcon-white font-inter">  

      <div className="mb-12 text-display-sm font-bold tracking-widest text-devcon-lime">
        DEVCON
      </div>

      <div className="text-center max-w-xl mb-12">
        <h1 className="text-display-md font-extrabold mb-4">
          Ready to make an impact?
        </h1>
        
        <p className="text-devcon-orange text-body-sm mb-8">
          Join our developer community events and programs. Let's build together.
        </p>

        <div className="flex justify-center">
          <Button label="Volunteer" href="/volunteer" />
        </div>
      </div>

      <Carousel />
    </main>
      <footer></footer>
    </>
  );
}