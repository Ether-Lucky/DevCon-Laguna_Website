import type { Metadata } from "next";
import ThemeProvider from "@/components/theme-provider";
import { dmSans, jetBrainsMono } from "@/components/ui/fonts";
import "./globals.css";

/**
 * Site-wide metadata.
 * Update `title` and `description` to reflect the current page or section
 * when adding additional routes.
 */
export const metadata: Metadata = {
  title: "DevCon Laguna",
  description: "The official website of DevCon Laguna — empowering developers through community, learning, and collaboration.",
};

/**
 * RootLayout — applied to every page in the app.
 *
 * - Injects DM Sans and JetBrains Mono as CSS variables (`--font-dm-sans`,
 *   `--font-jet-brains-mono`) which are consumed in `globals.css`.
 * - Wraps all children in `ThemeProvider` (dark-first, no system preference).
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${dmSans.variable} ${jetBrainsMono.variable}`}>
      <body className="antialiased min-h-full flex flex-col">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
