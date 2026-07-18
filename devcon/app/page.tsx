import React from 'react';
import Carousel from '@/components/ui/events-carousel';
import WhatWeDo from '@/components/ui/what-we-do';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-devcon-black p-24 text-devcon-white font-inter">  

      <WhatWeDo />

    </main>
  );
}