"use client";

import Link from "next/link";
import { useState } from "react";

const NAV_LINKS = [
  { label: "Events", href: "#events" },
  { label: "About", href: "#about" },
  { label: "Sponsors", href: "#sponsors" },
];

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-devcon-black/80 backdrop-blur-md">
      <Link href="/" className="flex items-center gap-2">
        <img
          src="/logo/devcon-Logo.png"
          alt="DevCon Laguna"
          className="h-9 w-auto"
        />
      </Link>

      {/* Desktop links */}
      <ul className="hidden md:flex items-center gap-8">
        {NAV_LINKS.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-body-sm font-inter text-devcon-white/70 hover:text-devcon-white transition-colors duration-200"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Mobile hamburger */}
      <button
        type="button"
        className="md:hidden flex flex-col gap-1.5 p-1"
        onClick={() => setMenuOpen((prev) => !prev)}
        aria-label="Toggle menu"
      >
        <span
          className={`block h-0.5 w-6 bg-devcon-white transition-transform duration-200 ${
            menuOpen ? "translate-y-2 rotate-45" : ""
          }`}
        />
        <span
          className={`block h-0.5 w-6 bg-devcon-white transition-opacity duration-200 ${
            menuOpen ? "opacity-0" : ""
          }`}
        />
        <span
          className={`block h-0.5 w-6 bg-devcon-white transition-transform duration-200 ${
            menuOpen ? "-translate-y-2 -rotate-45" : ""
          }`}
        />
      </button>

      {/* Mobile menu */}
      {menuOpen && (
        <ul className="absolute top-full left-0 right- flex flex-col items-center gap-6 py-8 bg-devcon-black/95 backdrop-blur-md md:hidden">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="text-body-md font-inter text-devcon-white/70 hover:text-devcon-white transition-colors duration-200"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}
