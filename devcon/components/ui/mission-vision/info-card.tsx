import Image from 'next/image';

export interface InfoCardProps {
  id: string;
  title: string;
  description: string;
  themeClass: string;
  icon: string;
  iconPosition: 'top-right' | 'bottom-left';
  iconWidth: number;
  iconHeight: number;
  contentAlign?: 'top' | 'bottom';
}

export default function InfoCard({
  title,
  description,
  themeClass,
  icon,
  iconPosition,
  iconWidth,
  iconHeight,
  contentAlign = 'top',
}: InfoCardProps) {
  const iconAlignment =
    iconPosition === 'top-right'
      ? '-top-6 -right-8 sm:-top-4 sm:-right-4'
      : '-bottom-8 -left-10 sm:-bottom-6 sm:-left-6';

  return (
    <article
      className={`relative flex min-h-[320px] flex-col overflow-hidden rounded-[28px] p-8 sm:min-h-[380px] sm:p-10 md:min-h-[420px] ${themeClass} ${
        contentAlign === 'bottom' ? 'justify-end' : 'justify-start'
      }`}
    >
      <div className="relative z-10 max-w-[min(100%,28rem)]">
        <h3 className="mb-4 text-3xl font-bold tracking-tight text-devcon-white sm:text-display-sm">
          {title}
        </h3>
        <p className="text-body-sm font-normal text-devcon-white/90 sm:text-body-md">
          {description}
        </p>
      </div>

      <Image
        src={icon}
        alt=""
        width={iconWidth}
        height={iconHeight}
        aria-hidden="true"
        className={`pointer-events-none absolute opacity-40 ${iconAlignment}`}
        style={{ width: iconWidth, height: 'auto', maxWidth: 'none' }}
      />
    </article>
  );
}
