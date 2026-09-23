import { socialLinks } from "@/lib/content/social-links";
import { SocialIcon } from "@/components/ui/social-icon";

/**
 * SocialMedia — a horizontal row of social platform icon links.
 *
 * Links come from `lib/content/social-links.ts`, which names each icon with a
 * string; `SocialIcon` turns that name into a component (DATA-BT-01).
 * Each link opens in a new tab (`target="_blank"`) with `rel="noopener
 * noreferrer"` and uses an `aria-label` set to the platform name for screen
 * reader accessibility.
 *
 * The `rel` is not decoration: without `noopener`, the page opened in the new
 * tab can reach back through `window.opener` and navigate this one. It was
 * missing until FOOTER-02, and was found by that ticket's test asserting every
 * off-site link opens safely.
 * The icon itself is hidden from assistive technology via `aria-hidden`.
 *
 * Rendered in both the `Hero` section and the `Footer`.
 */
export default function SocialMedia({ color = 'text-foreground', compact = false }: { color?: string; compact?: boolean }) {
  return (
    <div className={`mt-6 sm:mt-8 flex items-center ${compact ? 'gap-5' : 'gap-3 sm:gap-4 md:mt-9 md:gap-5'}`}>
    {socialLinks.map((item) => (
      <a
      key={item.platform}
      href={item.link}
      aria-label={item.platform}
      className={`group flex items-center justify-center ${compact ? 'p-1' : 'rounded-full border border-devcon-lime-500/80 p-2.5'} ${color} transition-transform duration-200 hover:border-devcon-lime hover:bg-devcon-lime/10`}
      target="_blank"
      rel="noopener noreferrer"
      >
        <span className="block opacity-80 group-hover:opacity-100 transition-opacity duration-200">
          <SocialIcon name={item.icon} />
        </span>
      </a>
    ))}
    </div>
  );
}
