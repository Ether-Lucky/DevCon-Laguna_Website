"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * ThemeProvider — wraps the app with `next-themes` for dark/light mode support.
 *
 * Configuration:
 * - `attribute="class"`: applies the active theme as a CSS class on `<html>` (e.g. `.dark`).
 * - `defaultTheme="dark"`: the site launches in dark mode by default.
 * - `enableSystem={false}`: ignores the OS preference; users switch manually via `ThemeButton`.
 * - `disableTransitionOnChange`: prevents a flash of unstyled transition on initial load.
 */
export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
