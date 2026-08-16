import { DM_Sans, JetBrains_Mono } from 'next/font/google';

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: '--font-dm-sans',
  display: 'swap',
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: '--font-jet-brains-mono',
  display: 'swap',});

export { dmSans, jetBrainsMono }