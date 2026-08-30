import Link from "next/link";
import clsx from "clsx";

/**
 * Props for the `NavLinks` component.
 *
 * @property orientation - `"horizontal"` (default, desktop): flex-row, hidden below `xl`.
 *                         `"vertical"` (mobile menu): flex-col, always visible.
 * @property onNavigate  - Optional callback fired when a link is clicked.
 *                         Used by `MobileNav` to close the drawer after navigation.
 * @property className   - Extra Tailwind classes for the wrapper.
 */
type NavLinksProps = {
  orientation?: "horizontal" | "vertical";
  onNavigate?: () => void;
  className?: string;
};

/**
 * Ordered list of in-page anchor links shown in the navigation bar.
 * Each `href` value corresponds to a section `id` on the home page.
 * Update this array to add, remove, or reorder nav items.
 */
const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/#about" },
  { name: "Events", href: "/#events" },
  { name: "Officers", href: "/#officers" },
  { name: "Partners", href: "/#partners" },
  { name: "Contact", href: "/contact" },
];

/**
 * NavLinks — renders the list of site navigation links.
 *
 * In `"horizontal"` mode the list is flex-row and hidden below the `xl` breakpoint
 * (used inside the desktop nav bar). In `"vertical"` mode it becomes a flex-col list
 * for use inside the mobile dropdown drawer.
 */
export default function NavLinks({
  orientation = "horizontal",
  onNavigate,
}: NavLinksProps) {
  return (
    <div
      className={clsx(
        "flex",
        {
          "hidden xl:flex flex-row items-center gap-16": orientation === "horizontal",
          "flex-col gap-4": orientation === "vertical",
        },
      )}
    >
      {navLinks.map((link) => (
        <Link
          key={link.name}
          href={link.href}
          onClick={onNavigate}
          className='text-base font-semibold leading-none text-foreground/75 transition-colors duration-150 hover:text-foreground'
        >
          {link.name}
        </Link>
      ))}
    </div>
  );
}
