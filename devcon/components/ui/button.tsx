import Link from "next/link";
import clsx from "clsx";
import { ArrowUpRightIcon } from '@heroicons/react/16/solid'

/**
 * Props for the `Button` component.
 *
 * @property label      - Visible button text.
 * @property onClick    - Click handler. Used only when `href` is not provided.
 * @property href       - If provided, renders a Next.js `<Link>` instead of `<button>`.
 * @property variant    - Visual style. `"primary"` = lime fill; `"outline"` = bordered ghost.
 * @property icon       - Icon rendered to the right of the label. Defaults to `ArrowUpRightIcon`.
 *                        Pass `null` to suppress the icon entirely.
 * @property iconWidth  - Tailwind width class applied to the icon wrapper (e.g. `"w-6"`).
 * @property className  - Additional Tailwind classes merged onto the root element.
 */
interface ButtonProps {
  label: string;
  onClick?: () => void;
  href?: string;
  variant?: "primary" | "outline";
  icon?: React.ReactNode | null;
  iconWidth?: string;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

/**
 * Button — the primary interactive element across the site.
 *
 * Renders a `<Link>` when `href` is supplied, otherwise a plain `<button>`.
 * The icon animates up-right on hover using a CSS group-hover transform.
 *
 * @example
 * // Lime CTA with link
 * <Button label="Join Us" href="/join" variant="primary" />
 *
 * // Outline button without an icon
 * <Button label="Learn More" onClick={handleClick} variant="outline" icon={null} />
 */
export default function Button({
  label,
  onClick,
  href,
  variant = "primary",
  icon = <ArrowUpRightIcon />,
  iconWidth = "w-6",
  className,
  type = "button",
  disabled = false,
}: ButtonProps) {

  const buttonFinalClassName = clsx(
    "group font-sans text-lg font-semibold flex flex-row items-center text-center justify-center rounded-full gap-2 px-6 py-2 cursor-pointer w-max transition-opacity",
    className,
    {
      "bg-devcon-lime-500 text-devcon-black-500 hover:bg-opacity-90 active:bg-opacity-80": variant === "primary",
      "border border-foreground/40 bg-transparent text-foreground hover:border-foreground/60 hover:bg-foreground/10": variant === "outline",
      "opacity-60 cursor-not-allowed pointer-events-none": disabled,
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
      <button onClick={onClick} className={buttonFinalClassName} type={type} disabled={disabled}>
        {label}
        {icon && <span className={iconClassName}>{icon}</span>}
      </button>
    )
  );
}
