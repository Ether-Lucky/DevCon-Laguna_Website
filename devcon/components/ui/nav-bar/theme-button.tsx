import Image from "next/image";
import clsx from "clsx";

export default function ThemeButton({ theme } : { theme: 'light' | 'dark' }) {
  return (
    <button 
      className={clsx(
        "inline-flex h-11 w-11 items-center justify-center rounded-full border transition-colors duration-200", 
        {
          "border-devcon-black/20 bg-devcon-lime text-devcon-black hover:bg-devcon-lime/90" : theme === 'light',
          "border-devcon-white/20 bg-transparent text-devcon-white hover:border-devcon-white/35 hover:bg-devcon-white/8" : theme === 'dark'
        }
      )} 
      type="button"
    >
      <Image 
        src={theme === 'light' ? '/icons/sun.svg' : '/icons/moon.svg'}
        alt={theme === 'light' ? 'Light Mode' : 'Dark Mode'}
        width={18}
        height={18}
      />
    </button>
  );
}