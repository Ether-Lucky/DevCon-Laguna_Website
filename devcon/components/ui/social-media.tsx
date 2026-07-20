import Image from "next/image";

const socialLinks = [
  { label: "Facebook", href: "https://facebook.com", icon: "/icons/facebook.svg" },
  { label: "Twitter", href: "https://x.com", icon: "/icons/twitter.svg" },
  { label: "Instagram", href: "https://instagram.com", icon: "/icons/instagram.svg" },
  { label: "LinkedIn", href: "https://linkedin.com", icon: "/icons/linkedin.svg" },
];

export default function SocialMedia() {
  return (
    <div className="mt-8 flex items-center gap-4 md:mt-9 md:gap-5">
    {socialLinks.map((item) => (
      <a
      key={item.label}
      href={item.href}
      aria-label={item.label}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-devcon-lime/80 text-xl font-semibold text-devcon-white transition-transform duration-200 hover:-translate-y-0.5 hover:border-devcon-lime hover:bg-devcon-lime/10 p-3"
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