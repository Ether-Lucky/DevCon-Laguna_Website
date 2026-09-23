import Image from "next/image";

/**
 * Logo — renders the DevCon Laguna wordmark with the "Laguna" chapter label below.
 *
 * Two versions of the logo image are included:
 * - `/logo/dark-logo.png`  → shown when the `.dark` class is active on `<html>`.
 * - `/logo/light-logo.png` → shown in light mode.
 *
 * Pass `onDark` when the logo is placed on a dark surface, such as the footer,
 * to use the white wordmark regardless of the page theme.
 *
 * Switching is handled purely with Tailwind's `dark:` variant so there is no JS flash.
 */
/**
 * The logo files' true pixel size, measured from `public/logo/*.png` (both are
 * 384 × 65). `next/image` uses these to reserve space before the file loads.
 *
 * They were 240 × 76, a 3.16 ratio for a 5.91 image. `h-auto` hid it once the
 * image loaded, but until then the browser reserved a box nearly twice the
 * logo's height, and Lighthouse's image-aspect-ratio audit failed on every
 * logo (LOGO-BT-01). If the artwork changes, measure the new file.
 */
const LOGO_WIDTH = 384;
const LOGO_HEIGHT = 65;

export default function Logo({ onDark = false }: { onDark?: boolean }) {
  const logoClassName = "h-auto w-[120px] md:w-[200px]"

  return (
    <div className="flex-col shrink-0 size-fit leading-none">
      {/* Shown in dark theme */}
      <Image
        src="/logo/dark-logo.png"
        alt="Devcon Logo"
        width={LOGO_WIDTH}
        height={LOGO_HEIGHT}
        priority
        className={`${onDark ? 'block' : 'hidden dark:block'} ${logoClassName}`}
      />
      {/* Shown in light theme */}
      <Image
        src="/logo/light-logo.png"
        alt="Devcon Logo"
        width={LOGO_WIDTH}
        height={LOGO_HEIGHT}
        priority
        className={`${onDark ? 'hidden' : 'block dark:hidden'} ${logoClassName}`}
      />
      <span className={`block text-right text-lg md:text-lg font-bold font-sans uppercase tracking-[0.01em] ${onDark ? 'text-white/80' : 'text-muted'}`}>
        Laguna
      </span>
    </div>
  );
}