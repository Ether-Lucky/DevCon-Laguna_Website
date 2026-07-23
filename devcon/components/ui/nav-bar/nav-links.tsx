'use client';

import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import clsx from 'clsx';

const links = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/#about' },
  { name: 'Events', href: '/#events' },
  { name: 'Officers', href: '/#officers' },
  { name: 'Partners', href: '/#partners' },
  { name: 'Contact', href: '/#contact' },
];

export default function NavLinks() {
  // const pathname = usePathname();

  return (
    <div className="flex items-center gap-10">
      {links.map((link) => {
        return (
          <Link
            key={link.name}
            href={link.href}
            className="text-[18px] font-semibold leading-none text-foreground/75 transition-colors duration-150 hover:text-foreground"
          >
            {link.name}
          </Link>
        );
      })}
    </div>
  );
}