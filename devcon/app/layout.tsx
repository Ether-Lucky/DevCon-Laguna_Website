import type { Metadata } from "next";
import ThemeProvider from "@/components/theme-provider";
import StructuredData from "@/components/ui/structured-data";
import { siteConfig } from "@/lib/site-config";
import { dmSans, jetBrainsMono } from "@/components/ui/fonts";
import "./globals.css";

/**
 * Site-wide metadata.
 *
 * `metadataBase` resolves the canonical host from the environment (see
 * `lib/site-config`), which is what makes the Open Graph and canonical URLs
 * absolute — social platforms reject relative ones. The share image itself is
 * generated at build time by `app/opengraph-image.tsx`, so it does not need to
 * be listed here.
 *
 * `title.template` applies to future routes: a page exporting
 * `title: "Events"` renders as "Events | DevCon Laguna".
 */
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "DevCon Laguna",
    "Developers Connect",
    "developer community Philippines",
    "tech community Laguna",
    "hackathons",
    "developer events",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.url,
    locale: siteConfig.locale,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
  },
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
        <StructuredData />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
