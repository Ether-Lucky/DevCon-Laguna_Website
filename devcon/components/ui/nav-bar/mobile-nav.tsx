"use client";

import { useState } from "react";
import NavLinks from "./nav-links";
import NavActions from "./nav-actions";
import { Bars3BottomRightIcon, XMarkIcon } from "@heroicons/react/24/outline";

/**
 * MobileNav — hamburger menu for the navigation bar on small screens (below `xl`).
 *
 * - Renders a toggle button (Bars icon → X icon) with proper `aria-expanded`
 *   and `aria-controls` attributes for accessibility.
 * - When open, drops down a full-width panel containing `NavLinks` (vertical)
 *   and `NavActions`.
 * - `closeMenu` is passed to `NavLinks` via `onNavigate` so the drawer closes
 *   automatically after the user taps a link.
 */
export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);
  const toggleMenu = () => setIsOpen((open) => !open);
  const iconClassName = "size-8 shrink-0";

  return (
    <div className="xl:hidden">
      <button
        type="button"
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={isOpen}
        aria-controls="mobile-navigation"
        onClick={toggleMenu}
        className="inline-flex size-8 shrink-0 items-center justify-center bg-transparent p-0 text-foreground transition-colors duration-200"
      >
        {isOpen ? <XMarkIcon className={iconClassName}/>: <Bars3BottomRightIcon className={iconClassName}/>}
      </button>

      <div
        id="mobile-navigation"
        aria-hidden={!isOpen}
        className={`absolute inset-x-0 top-full border-t border-background/10 bg-background/95 shadow-lg/5 backdrop-blur-md transition-[opacity,visibility] duration-300 ease-out ${
          isOpen
            ? "visible opacity-100"
            : "invisible pointer-events-none opacity-0"
        }`}
      >
        <div
          className={`mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-6 py-6 transition-opacity duration-300 ease-out md:px-8 ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
        >
          <NavLinks orientation="vertical" onNavigate={closeMenu} />
          <NavActions />
        </div>
      </div>
    </div>
  );
}
