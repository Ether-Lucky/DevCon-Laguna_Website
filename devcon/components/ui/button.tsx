import Link from 'next/link';

interface ButtonProps {
  label: string;
  onClick?: () => void;
  href?: string;
  variant?: 'primary' | 'outline'; // Choose between lime-green or outline
  hasArrow?: boolean; // Whether to show the arrow icon
}

export default function Button({ label, onClick, href, variant = 'primary', hasArrow = true }: ButtonProps) {
  // The arrow icon ↗
  const ArrowIcon = () => (
    <svg 
      className="w-4 h-4 ml-1.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor" 
      strokeWidth={2.5}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
    </svg>
  );

  // Base styles for both buttons
  const baseClasses = "group inline-flex items-center justify-center font-inter font-semibold px-8 py-3 rounded-full transition-all duration-200 text-body-sm";

  // Dynamic styling using your custom Tailwind config colors
  const variantClasses = variant === 'primary'
    ? "bg-devcon-lime hover:bg-opacity-90 active:bg-opacity-80 text-devcon-black" // Brand Lime Green
    : "border border-devcon-white/30 hover:border-devcon-white text-devcon-white bg-transparent hover:bg-devcon-white/10"; // Transparent Outline

  const combinedClasses = `${baseClasses} ${variantClasses}`;

  // Render as Link if href is provided
  if (href) {
    return (
      <Link href={href} className={combinedClasses}>
        {label}
        {hasArrow && <ArrowIcon />}
      </Link>
    );
  }

  // Render as normal button if onClick is provided
  return (
    <button onClick={onClick} className={combinedClasses} type="button">
      {label}
      {hasArrow && <ArrowIcon />}
    </button>
  );
}