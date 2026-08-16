import Image from 'next/image';
import { stats } from '@/lib/content/stats';

export default function Stats() {
  return (
    <section id="partners" className="max-w-7xl mx-auto">
      <div className="relative w-full grid grid-cols-2 md:grid-cols-4 justify-between gap-8 md:gap-6 px-8 md:px-16 pt-0 pb-32 md:py-48 font-sans text-center">
        {stats.map((stat) => {
          return (
            <div
              key={stat.name}
              className='flex flex-col items-center gap-2'
            >
              <Image
                src={stat.icon.link}
                alt={stat.name}
                width={stat.icon.width}
                height={stat.icon.height}
                className='h-12 md:h-16 w-auto object-contain'
              />
              <p className='text-3xl md:text-5xl font-semibold leading-none tracking-tight text-foreground'>
                {stat.value}<span className='text-muted'>+</span>
              </p>
              <p className='max-w-40 text-base md:text-2xl font-semibold leading-snug text-muted'>
                {stat.name}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}