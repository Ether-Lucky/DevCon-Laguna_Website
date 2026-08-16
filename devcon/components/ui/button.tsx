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
    "group font-sans text-body-sm font-semibold flex flex-row items-center justify-center rounded-full gap-2 cursor-pointer px-6 py-2 w-max",
    // {
    //   "",
    //   // "px-6 py-3": icon,
    // },
    className,
    {
      "bg-devcon-lime-500 text-devcon-black-500 hover:bg-opacity-90 active:bg-opacity-80": variant === "primary",
      "border border-border bg-transparent text-foreground hover:border-foreground/60 hover:bg-foreground/10": variant === "outline",
    },
  );

  const iconClassName = `${iconWidth} transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5`

  return (href ?
    (
      <Link href={href} className={buttonFinalClassName}>
        {label}
        {icon && <span className={iconClassName}>{icon}</span>}
      </Link>
    ) :
    (
      <button onClick={onClick} className={buttonFinalClassName} type="button">
        {label}
        {icon && <span className={iconClassName}>{icon}</span>}
      </button>
    )
  );
}
