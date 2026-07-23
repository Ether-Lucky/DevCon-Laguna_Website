import Image from "next/image";

const socialLinks = [
  { label: "Facebook", href: "https://www.facebook.com/DEVCONLAGUNA", icon: "/icons/facebook.svg" },
  { label: "Twitter", href: "https://x.com/DEVCONPH", icon: "/icons/twitter.svg" },
  { label: "Instagram", href: "https://www.instagram.com/devconlaguna", icon: "/icons/instagram.svg" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/devconlaguna/", icon: "/icons/linkedin.svg" },
  { label: "YouTube", href: "https://www.youtube.com/@devconlaguna", icon: "/icons/youtube.svg" },

];

export default function SocialMedia() {
  return (
    <div className="mt-8 flex items-center gap-4 md:mt-9 md:gap-5">
    {socialLinks.map((item) => (
      <a
      key={item.label}
      href={item.href}
      aria-label={item.label}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-devcon-lime/80 text-xl font-semibold text-devcon-white transition-transform duration-200 hover:border-devcon-lime hover:bg-devcon-lime/10 p-3"
      >
      <span className="leading-none">
        <Image
          src={item.icon}
          alt={item.label}
          width={18}
          height={18}
        />
      </span>
      </a>
    ))}
    </div>
  );
}