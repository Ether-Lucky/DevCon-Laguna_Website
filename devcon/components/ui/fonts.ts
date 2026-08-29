/**
 * fonts.ts
 *
 * Configures Next.js Google Font instances for the project.
 * Both fonts use `display: 'swap'` to prevent invisible text during load.
 * The resulting CSS variables are injected into the `<html>` tag via `layout.tsx`
 * and consumed in `globals.css` under `@theme inline`.
 */
import { DM_Sans, JetBrains_Mono } from 'next/font/google';

/**
 * DM Sans — used for headings (h1–h6) and UI labels.
 * CSS variable: `--font-dm-sans`
 */
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: '--font-dm-sans',
  display: 'swap',
});

/**
 * JetBrains Mono — used for body text and code-style labels.
 * CSS variable: `--font-jet-brains-mono`
 */
const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: '--font-jet-brains-mono',
  display: 'swap',});

export { dmSans, jetBrainsMono }