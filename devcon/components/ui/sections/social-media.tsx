import { socialLinks } from "@/lib/content/social-links";

/**
 * SocialMedia — a horizontal row of social platform icon links.
 *
 * Links and icons are sourced from `lib/content/social-links.tsx`.
 * Each link opens in a new tab (`target="_blank"`) and uses an `aria-label`
 * set to the platform name for screen reader accessibility.
 * The icon itself is hidden from assistive technology via `aria-hidden`.
 *
 * Rendered in both the `Hero` section and the `Footer`.
 */
export default function SocialMedia() {
  return (
    <div className="mt-6 sm:mt-8 flex items-center gap-3 sm:gap-4 md:mt-9 md:gap-5">
    {socialLinks.map((item) => (
      <a
      key={item.platform}
      href={item.link}
      aria-label={item.platform}
      className="group flex items-center justify-center rounded-full border border-devcon-lime-500/80 p-2.5 text-foreground transition-transform duration-200 hover:border-devcon-lime hover:bg-devcon-lime/10"
      target="_blank"
      >
        <span aria-hidden className="block opacity-80 group-hover:opacity-100 transition-opacity duration-200">{item.icon}</span>
      </a>
    ))}
    </div>
  );
}
