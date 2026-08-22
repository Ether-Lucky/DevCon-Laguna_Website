import Image from "next/image";

/**
 * Logo — renders the DevCon Laguna wordmark with the "Laguna" chapter label below.
 *
 * Two versions of the logo image are included:
 * - `/logo/dark-logo.png`  → shown when the `.dark` class is active on `<html>`.
 * - `/logo/light-logo.png` → shown in light mode.
 *
 * Switching is handled purely with Tailwind's `dark:` variant so there is no JS flash.
 */
export default function Logo() {
  const logoClassName = "h-auto w-[120px] md:w-[200px]"

  return (
    <div className="flex-col shrink-0 size-fit leading-none">
      {/* Shown in dark theme */}
      <Image
        src="/logo/dark-logo.png"
        alt="Devcon Logo"
        width={240}
        height={76}
        priority
        className={`hidden dark:block ${logoClassName}`}
      />
      {/* Shown in light theme */}
      <Image
        src="/logo/light-logo.png"
        alt="Devcon Logo"
        width={240}
        height={76}
        priority
        className={`block dark:hidden ${logoClassName}`}
      />
      <span className="block text-right text-lg md:text-lg font-bold font-sans uppercase tracking-[0.01em] text-muted">
        Laguna
      </span>
    </div>
  );
}