import InfoCard, { InfoCardProps } from '@/components/ui/mission-vision/info-card';

const companyValues: InfoCardProps[] = [
  {
    id: 'mission',
    title: 'Mission',
    description: 'To empower developers by providing opportunities for learning, collaboration, mentorship, and community engagement...',
    themeClass: 'from-purple-900/40 via-purple-950 to-black text-purple-400', 
    icon: '/assets/target-icon.svg', 
    iconPosition: 'bottom-left',
    width: 128,
    height: 128
  },
  {
    id: 'vision',
    title: 'Vision',
    description: 'To cultivate a thriving and inclusive technology community in Laguna...',
    themeClass: 'from-yellow-600/40 via-neutral-900 to-black text-yellow-500',
    icon: '/assets/eye-icon.svg',
    iconPosition: 'top-right',
    width: 128,
    height: 128
  }
];

export default function MissionVision() {
  return (
    <section id='mission-vision' className="bg-black py-16 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {companyValues.map((card) => (
          <InfoCard key={card.id} {...card} />
        ))}
      </div>
    </section>
  );
}