import React from 'react';
import Link from 'next/link';

interface ButtonProps {
  label: string;
  onClick?: () => void;
  href?: string;
  variant?: 'primary' | 'outline'; // Choose between lime-green or outline
}

export default function Button({ label, onClick, href, variant = 'primary' }: ButtonProps) {
  
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
  const baseClasses = "group inline-flex items-center justify-center font-semibold px-8 py-3 rounded-full transition-all duration-200 text-sm";

  // Dynamic styling based on the variant
  const variantClasses = variant === 'primary'
    ? "bg-[#C0E00B] hover:bg-[#a6c209] active:bg-[#8ca407] text-black" // Lime green filled
    : "border border-white/30 hover:border-white text-white bg-transparent hover:bg-white/10"; // Transparent outline

  const combinedClasses = `${baseClasses} ${variantClasses}`;

  // Render as Link or standard Button
  if (href) {
    return (
      <Link href={href} className={combinedClasses}>
        {label}
        <ArrowIcon />
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={combinedClasses}>
      {label}
      <ArrowIcon />
    </button>
  );
}