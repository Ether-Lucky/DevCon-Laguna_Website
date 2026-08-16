"use client";

import clsx from "clsx";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";

export default function ThemeButton() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";
  const iconClassName = "w-7 stroke-2";

  return (
    <button
      type="button"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={clsx(
        "inline-flex h-11 w-11 items-center justify-center rounded-full border transition-colors duration-200 border-foreground/20  text-foreground hover:border-foreground/35 hover:bg-foreground/8 cursor-pointer",
        {
          "bg-devcon-white-500": !isDark,
          "bg-background":  isDark,
        },
      )}
    >
      {isDark ? <SunIcon className={iconClassName}/> : <MoonIcon className={iconClassName} />}
    </button>
  );
}