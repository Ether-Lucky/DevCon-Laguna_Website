"use client";

import Image from "next/image";
import clsx from "clsx";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeButton() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        type="button"
        aria-hidden
        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-transparent"
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={clsx(
        "inline-flex h-11 w-11 items-center justify-center rounded-full border transition-colors duration-200",
        {
          "border-devcon-black/20 bg-devcon-lime text-devcon-black hover:bg-devcon-lime/90":
            !isDark,
          "border-devcon-white/20 bg-transparent text-devcon-white hover:border-devcon-white/35 hover:bg-devcon-white/8":
            isDark,
        },
      )}
    >
      <Image
        src={isDark ? "/icons/sun.svg" : "/icons/moon.svg"}
        alt=""
        width={18}
        height={18}
      />
    </button>
  );
}
