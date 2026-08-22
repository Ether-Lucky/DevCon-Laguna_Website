import Button from "@/components/ui/button";
import ThemeButton from "./theme-button";

/**
 * NavActions — the right-hand action group in the desktop navigation bar.
 *
 * Contains:
 * - A "Join Us" primary `Button` (no icon) for the membership CTA.
 * - A `ThemeButton` for toggling dark/light mode.
 *
 * Hidden on mobile; shown at the `xl` breakpoint and above.
 */
export default function NavActions() {
  return (
    <div className="flex items-center gap-3 md:gap-4">
      <Button label="Join Us" icon={null} variant="primary" />
      <ThemeButton />
    </div>
  );
}
