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

  // Fade toward the open side of the card (matches reference watermark)
  const fadeMask =
    iconPosition === "top-right"
      ? "linear-gradient(to bottom, black 0%, black 25%, transparent 90%)"
      : "linear-gradient(to top, black 0%, black 25%, transparent 90%)";

  return (
    <article
      className={`relative flex min-h-[240px] sm:min-h-[320px] flex-col overflow-hidden rounded-[20px] sm:rounded-[28px] p-6 sm:p-8 md:min-h-[420px] md:p-10 ${themeClass} ${alignClass}`}
    >
      <div className="relative z-10 max-w-[min(100%,28rem)]">
        <h3 className="mb-4 text-3xl md:text-5xl font-bold tracking-tight text-foreground font-sans">
          {title}
        </h3>
        <p className="text-body-sm font-normal text-foreground/80 sm:text-body-md">
          {description}
        </p>
      </div>

      <span
        aria-hidden="true"
        className={`pointer-events-none absolute ${iconAlignment} opacity-40 ${iconClassName ?? ""}`}
        style={{
          width: iconWidth,
          height: iconHeight,
          backgroundColor: "var(--foreground)",
          WebkitMaskImage: `${fadeMask}, url(${icon})`,
          WebkitMaskSize: "100% 100%, contain",
          WebkitMaskRepeat: "no-repeat, no-repeat",
          WebkitMaskPosition: "center, center",
          WebkitMaskComposite: "source-in",
          maskImage: `${fadeMask}, url(${icon})`,
          maskSize: "100% 100%, contain",
          maskRepeat: "no-repeat, no-repeat",
          maskPosition: "center, center",
          maskComposite: "intersect",
        }}
      />
    </article>
  );
}
