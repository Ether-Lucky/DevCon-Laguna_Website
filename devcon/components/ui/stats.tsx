import Image from 'next/image';

const stats = [
  { name: 'Community Volunteers', value: 500, icon: { link: '/stat/people.svg', width: 75, height: 59 } },
  { name: 'Events Organized', value: 30, icon: { link: '/stat/calendar.svg', width: 55, height: 65.39 } },
  { name: 'Community Reached', value: 100, icon: { link: '/stat/map.svg', width: 66, height: 63.83 } },
  { name: 'Industry Partners', value: 20, icon: { link: '/stat/shake-hands.svg', width: 102.73, height: 65.39 } },
]

export default function Stats() {
  return (
    <section
      id="stats"
      className='grid w-full grid-cols-2 gap-y-10 px-6 py-10 text-center sm:px-10 md:grid-cols-4 md:gap-6 lg:px-16'
    >
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
              className='h-16 w-auto object-contain'
            />
            <p className='text-4xl font-semibold leading-none tracking-tight text-devcon-white md:text-[44px]'>
              {stat.value}<span className='text-devcon-gray'>+</span>
            </p>
            <p className='max-w-40 text-sm font-semibold leading-snug text-devcon-gray md:text-base'>
              {stat.name}
            </p>
          </div>
        );
      })}
    </section>
  );
}