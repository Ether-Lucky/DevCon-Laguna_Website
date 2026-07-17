import Image from "next/image";
import clsx from "clsx";

export default function ThemeButton({ theme } : { theme: 'light' | 'dark' }) {
  return (
    <button 
      className={clsx(
        "group inline-flex items-center justify-center font-inter font-semibold px-8 py-3 rounded-full transition-all duration-200 text-body-sm", 
        {
          "bg-devcon-lime hover:bg-opacity-90 active:bg-opacity-80 text-devcon-black" : theme === 'light',
          "border border-devcon-white/30 hover:border-devcon-white text-devcon-white bg-transparent hover:bg-devcon-white/10" : theme === 'dark'
        }
      )} 
      type="button"
    >
      <Image 
        src={theme === 'light' ? '/icons/sun.svg' : '/icons/moon.svg'}
        alt={theme === 'light' ? 'Light Mode' : 'Dark Mode'}
        width={24}
        height={24}
      />
    </button>
  );
}