import React from 'react';
import Button from '@/components/ui/button';
import '@/components/color.css';
import Carousel from '@/components/ui/events-carousel';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black p-24 text-white">
      {/* DevCon Header logo space */}
      <div className="mb-12 text-3xl font-bold tracking-widest text-[#b8d90a]">
        DEVCON
      </div>

      <div className="text-center max-w-xl">
        <h1 className="text-4xl font-extrabold mb-4">
          Ready to make an impact?
        </h1>
        <p className="text-devcon-orange mb-8">
          Join our developer community events and programs. Let's build together.
        </p>

        {/* This is your new button! */}
        <div className="flex justify-center">
          <Button label="Volunteer" href="/volunteer" />
        </div>
      </div>
      <Carousel />
    </main>
  );
}