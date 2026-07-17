import Image from 'next/image';

export interface InfoCardProps {
  id: string;
  title: string;
  description: string;
  themeClass: string;
  icon: string;
  iconPosition: 'top-right' | 'bottom-left';
  width: number;
  height: number;
}

export default function InfoCard({ title, description, themeClass, icon, iconPosition, width, height }: InfoCardProps) {
  // Determine icon placement based on the prop
  const iconAlignment = iconPosition === 'top-right' 
    ? 'top-4 right-4' 
    : 'bottom-4 left-4';

  return (
    <div className={`relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br ${themeClass} min-h-[300px] flex flex-col justify-between`}>
      {/* Text Content */}
      <div className="z-10 max-w-[80%]">
        <h3 className="text-3xl font-bold text-white mb-3">{title}</h3>
        <p className="text-gray-300 text-sm leading-relaxed">{description}</p>
      </div>

      {/* Background Decorative Icon */}
      <Image 
        src={icon} 
        alt="" 
        width={width}
        height={height}
        aria-hidden="true"
        className={`absolute w-32 h-32 opacity-20 pointer-events-none ${iconAlignment}`}
      />
    </div>
  );
}