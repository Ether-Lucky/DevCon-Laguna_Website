const socialLinks = [
  { label: "Facebook", href: "https://www.facebook.com/DEVCONLAGUNA", icon: "/icons/facebook.svg" },
  { label: "Twitter", href: "https://x.com/DEVCONPH", icon: "/icons/twitter.svg" },
  { label: "Instagram", href: "https://www.instagram.com/devconlaguna", icon: "/icons/instagram.svg" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/devconlaguna/", icon: "/icons/linkedin.svg" },
  { label: "YouTube", href: "https://www.youtube.com/@devconlaguna", icon: "/icons/youtube.svg" },

];

export default function SocialMedia() {
  return (
    <div className="mt-6 sm:mt-8 flex items-center gap-3 sm:gap-4 md:mt-9 md:gap-5">
    {socialLinks.map((item) => (
      <a
      key={item.label}
      href={item.href}
      aria-label={item.label}
      className="flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-devcon-lime/80 p-2.5 sm:p-3 text-xl font-semibold text-foreground transition-transform duration-200 hover:border-devcon-lime hover:bg-devcon-lime/10"
      >
      <span
        aria-hidden
        className="block size-[14px] sm:size-[18px] bg-[var(--foreground)] opacity-80 hover:opacity-100 transition-opacity duration-200"
        style={{
          maskImage: `url(${item.icon})`,
          maskSize: "contain",
          maskRepeat: "no-repeat",
          maskPosition: "center",
          WebkitMaskImage: `url(${item.icon})`,
          WebkitMaskSize: "contain",
          WebkitMaskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
        }}
      />
      </a>
    ))}
    </div>
  );
}
