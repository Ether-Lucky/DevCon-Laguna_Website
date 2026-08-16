import Link from "next/link";
import clsx from "clsx";
import { navLinks } from "./constants";

type NavLinksProps = {
  orientation?: "horizontal" | "vertical";
  onNavigate?: () => void;
  className?: string;
};

export default function NavLinks({
  orientation = "horizontal",
  onNavigate,
  className,
}: NavLinksProps) {
  return (
    <div
      className={clsx(
        "flex",
        orientation === "horizontal"
          ? "items-center gap-16"
          : "flex-col gap-4",
        className,
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
