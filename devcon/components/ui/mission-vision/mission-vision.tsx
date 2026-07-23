import InfoCard, { InfoCardProps } from '@/components/ui/mission-vision/info-card';

const companyValues: InfoCardProps[] = [
  {
    id: 'mission',
    title: 'Mission',
    description:
      'To empower developers by providing opportunities for learning, collaboration, mentorship, and community engagement while promoting innovation and excellence in the field of technology.',
    themeClass:
      'bg-gradient-to-b from-devcon-black via-devcon-purple-dark to-devcon-purple-bright',
    icon: '/mission-vision/bullet.svg',
    iconPosition: 'bottom-left',
    iconWidth: 280,
    iconHeight: 243,
    contentAlign: 'top',
  },
  {
    id: 'vision',
    title: 'Vision',
    description:
      'To cultivate a thriving and inclusive technology community in Laguna where individuals are inspired to innovate, lead, and create solutions that positively impact society.',
    themeClass:
      'bg-gradient-to-b from-[#f5c518] via-[#6b5510] to-devcon-black',
    icon: '/mission-vision/eye.svg',
    iconPosition: 'top-right',
    iconWidth: 320,
    iconHeight: 240,
    contentAlign: 'bottom',
  },
];

export default function MissionVision() {
  return (
    <section
      id="mission-vision"
      className="w-full bg-background px-4 py-16 font-inter sm:px-6 sm:py-20 md:px-8"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
        {companyValues.map((card) => (
          <InfoCard key={card.id} {...card} />
        ))}
      </div>
    </section>
  );
}
