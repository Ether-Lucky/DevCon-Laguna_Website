import Link from "next/link";
import clsx from "clsx";
import { ArrowUpRightIcon } from '@heroicons/react/16/solid'

interface ButtonProps {
  label: string;
  onClick?: () => void;
  href?: string;
  variant?: "primary" | "outline";
  icon?: React.ReactNode | null;
  iconWidth?: string;
  className?: string;
}

export default function Button({
  label,
  onClick,
  href,
  variant = "primary",
  icon = <ArrowUpRightIcon />,
  iconWidth = "w-6",
  className,
}: ButtonProps) {

  const buttonFinalClassName = clsx(
    "group font-sans text-body-sm font-semibold flex flex-row items-center justify-center rounded-full gap-2 cursor-pointer",
    {
      "px-6 py-2": !icon,
      "px-8 py-4": icon,
    },
    className,
    {
      "bg-devcon-lime-500 text-devcon-black-500 hover:bg-opacity-90 active:bg-opacity-80": variant === "primary",
      "border border-border bg-transparent text-foreground hover:border-foreground/60 hover:bg-foreground/10": variant === "outline",
    },
  );

  const iconClassName = `${iconWidth} transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5`

  if (href) {
    return (
      <Link href={href} className={buttonFinalClassName}>
        <span>{label}</span>
        <span className={iconClassName}>{icon}</span>
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={buttonFinalClassName} type="button">
      <span>{label}</span>
      {icon && <span className={iconClassName}>{icon}</span>}
    </button>
  );
}
