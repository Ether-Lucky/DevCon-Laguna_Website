import Button from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";
import ThemeButton from "./theme-button";

/**
 * NavActions — the right-hand action group in the desktop navigation bar.
 *
 * Contains:
 * - A "Join Us" primary `Button` (no icon) linking to the DevConnect Portal,
 *   where visitors actually register.
 * - A `ThemeButton` for toggling dark/light mode.
 *
 * Hidden on mobile; shown at the `xl` breakpoint and above.
 */
export default function NavActions() {
  return (
    <div className="flex items-center gap-3 md:gap-4">
      <Button
        label="Join Us"
        href={siteConfig.portalUrl}
        icon={null}
        variant="primary"
        analyticsId="nav-join-us"
      />
      <ThemeButton />
    </div>
  );
}
