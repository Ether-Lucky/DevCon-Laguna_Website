import Image from "next/image";

export interface InfoCardProps {
  id: string;
  title: string;
  description: string;
  themeClass: string;
  icon: string;
  iconPosition: "top-right" | "bottom-left";
  iconWidth: number;
  iconHeight: number;
  contentAlign?: "top" | "bottom" | "center";
  iconClassName?: string;
}

export default function InfoCard({
  title,
  description,
  themeClass,
  icon,
  iconPosition,
  iconWidth,
  iconHeight,
  contentAlign = "top",
  iconClassName,
}: InfoCardProps) {
  const iconAlignment =
    iconPosition === "top-right"
      ? "-top-6 -right-8 sm:-top-4 sm:-right-4"
      : "-bottom-8 -left-10 sm:-bottom-6 sm:-left-6";

  const alignClass =
    contentAlign === "bottom"
      ? "justify-end"
      : contentAlign === "center"
        ? "justify-center"
        : "justify-start";

  return (
    <article
      className={`relative flex min-h-[320px] flex-col overflow-hidden rounded-[28px] p-8 sm:min-h-[380px] sm:p-10 md:min-h-[420px] ${themeClass} ${alignClass}`}
    >
      <div className="relative z-10 max-w-[min(100%,28rem)]">
        <h3 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-display-sm">
          {title}
        </h3>
        <p className="text-body-sm font-normal text-foreground sm:text-body-md">
          {description}
        </p>
      </div>

      <Image
        src={icon}
        alt=""
        width={iconWidth}
        height={iconHeight}
        aria-hidden="true"
        className={`pointer-events-none absolute ${iconAlignment} ${iconClassName ?? "opacity-40"}`}
        style={{ width: iconWidth, height: "auto", maxWidth: "none" }}
      />
    </article>
  );
}
