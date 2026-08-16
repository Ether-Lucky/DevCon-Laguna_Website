import { Inter, JetBrains_Mono } from 'next/font/google';

const inter = Inter({
  subsets: ["latin"],
  variable: '--font-inter',
  display: 'swap',
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: '--font-jet-brains-mono',
  display: 'swap',});

export { inter, jetBrainsMono }