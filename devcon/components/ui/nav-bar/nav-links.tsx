import Link from "next/link";
import clsx from "clsx";

type NavLinksProps = {
  orientation?: "horizontal" | "vertical";
  onNavigate?: () => void;
  className?: string;
};

const navLinks = [
  { name: "Home", href: "#hero" },
  { name: "About", href: "#about" },
  { name: "Events", href: "#events" },
  { name: "Officers", href: "#officers" },
  { name: "Partners", href: "#partners" },
  { name: "Contact", href: "#contact" },
];

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
