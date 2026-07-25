import Link from "next/link";
import clsx from "clsx";
import { NAV_LINKS, navLinkClassName } from "./constants";

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
          ? "items-center gap-10"
          : "flex-col gap-4",
        className,
      )}
    >
      {NAV_LINKS.map((link) => (
        <Link
          key={link.name}
          href={link.href}
          onClick={onNavigate}
          className={navLinkClassName}
        >
          {link.name}
        </Link>
      ))}
    </div>
  );
}
