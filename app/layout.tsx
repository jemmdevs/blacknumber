import type { Metadata } from 'next';
import { Inter, Noto_Serif_JP } from 'next/font/google';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const display = Noto_Serif_JP({
  variable: '--font-display-jp',
  subsets: ['latin'],
  weight: ['400', '600', '700'],
});

export const metadata: Metadata = {
  title: 'blacknumbers',
  description: 'A local number strategy game',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${display.variable} h-full`}>
      <body className="h-full">{children}</body>
    </html>
  );
}
