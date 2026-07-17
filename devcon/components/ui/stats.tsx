import Image from 'next/image';

const stats = [
  { name: 'Community Volunteers', value: 500, icon: { link: '/stat/people.svg', width: 75, height: 59 } },
  { name: 'Events Organized', value: 30, icon: { link: '/stat/calendar.svg', width: 55, height: 65.39 } },
  { name: 'Community Reached', value: 100, icon: { link: '/stat/map.svg', width: 66, height: 63.83 } },
  { name: 'Industry Partners', value: 20, icon: { link: '/stat/shake-hands.svg', width: 102.73, height: 65.39 } },
]

export default function Stats() {
  return (
    <section id="stats" className='flex flex-wrap justify-center gap-10'>
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
              className='object-contain'
            />
            <em>{stat.value}+</em>
            <em>{stat.name}</em>
          </div>
        );
      })}
    </section>
  );
}