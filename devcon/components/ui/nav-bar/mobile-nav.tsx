"use client";

import { useState } from "react";
import Image from "next/image";
import NavLinks from "./nav-links";
import NavActions from "./nav-actions";
import { navVisibility } from "./constants";

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);
  const toggleMenu = () => setIsOpen((open) => !open);

  return (
    <div className={navVisibility.mobileOnly}>
      <button
        type="button"
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={isOpen}
        aria-controls="mobile-navigation"
        onClick={toggleMenu}
        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-foreground/20 bg-transparent text-foreground transition-colors duration-200 hover:border-foreground/35 hover:bg-foreground/8"
      >
        <span
          aria-hidden
          className="block size-[18px] bg-[var(--foreground)] opacity-80 hover:opacity-100 transition-opacity duration-200"
          style={{
          maskImage: `url(${isOpen ? '/icons/close.svg' : '/icons/Menu.svg'})`,
            maskSize: "contain",
            maskRepeat: "no-repeat",
            maskPosition: "center",
            WebkitMaskImage: `url(${isOpen ? '/icons/close.svg' : '/icons/Menu.svg'})`,
            WebkitMaskSize: "contain",
            WebkitMaskRepeat: "no-repeat",
            WebkitMaskPosition: "center",
          }}
        />
      </button>

      {isOpen ? (
        <div
          id="mobile-navigation"
          className="absolute inset-x-0 top-full border-t border-background/10 bg-background/95 backdrop-blur-md"
        >
          <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-6 py-6 md:px-8">
            <NavLinks orientation="vertical" onNavigate={closeMenu} />
            <NavActions />
          </div>
        </div>
      ) : null}
    </div>
  );
}
