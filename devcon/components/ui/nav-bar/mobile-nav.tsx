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
        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-devcon-white/20 bg-transparent text-devcon-white transition-colors duration-200 hover:border-devcon-white/35 hover:bg-devcon-white/8"
      >
        {isOpen ? (
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M6 6L18 18M18 6L6 18"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <Image
            src="/icons/menu.svg"
            alt=""
            width={20}
            height={20}
            aria-hidden="true"
          />
        )}
      </button>

      {isOpen ? (
        <div
          id="mobile-navigation"
          className="absolute inset-x-0 top-full border-t border-devcon-white/10 bg-devcon-black/95 backdrop-blur-md"
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
