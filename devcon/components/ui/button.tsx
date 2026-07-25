import Link from "next/link";
import clsx from "clsx";

interface ButtonProps {
  label: string;
  onClick?: () => void;
  href?: string;
  variant?: "primary" | "outline";
  hasArrow?: boolean;
  className?: string;
}

export default function Button({
  label,
  onClick,
  href,
  variant = "primary",
  hasArrow = true,
  className,
}: ButtonProps) {
  const ArrowIcon = () => (
    <svg
      className="ml-1.5 h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
      />
    </svg>
  );

  const baseClasses =
    "group inline-flex items-center justify-center rounded-full px-8 py-3 font-inter text-body-sm font-semibold transition-all duration-200";

  const variantClasses =
    variant === "primary"
      ? "bg-devcon-lime text-devcon-black hover:bg-opacity-90 active:bg-opacity-80"
      : "border border-border bg-transparent text-foreground hover:border-foreground/60 hover:bg-foreground/10";

  const combinedClasses = clsx(baseClasses, variantClasses, className);

  if (href) {
    return (
      <Link href={href} className={combinedClasses}>
        {label}
        {hasArrow && <ArrowIcon />}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={combinedClasses} type="button">
      {label}
      {hasArrow && <ArrowIcon />}
    </button>
  );
}
