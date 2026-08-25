import type { Metadata } from 'next';
import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const display = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-display'
});
const body = Inter({ subsets: ['latin'], variable: '--font-body' });
const mono = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-mono' });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Anime Gallery — Premium Wallpapers & Profile Pics',
    template: '%s · Anime Gallery'
  },
  description:
    'A premium, fast-loading gallery of anime wallpapers, profile pictures, and natural wallpapers in high resolution.',
  openGraph: {
    type: 'website',
    siteName: 'Anime Gallery',
    title: 'Anime Gallery — Premium Wallpapers & Profile Pics',
    description:
      'A premium, fast-loading gallery of anime wallpapers, profile pictures, and natural wallpapers in high resolution.'
  },
  robots: { index: true, follow: true }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="bg-void text-ink font-body antialiased selection:bg-sakura/30">
        {children}
      </body>
    </html>
  );
}
