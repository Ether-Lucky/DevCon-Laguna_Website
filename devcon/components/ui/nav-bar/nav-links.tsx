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
    <>
      {links.map((link) => {
        return (
          <Link
            key={link.name}
            href={link.href}
          >
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
