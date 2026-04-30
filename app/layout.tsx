import type { Metadata } from 'next';
import { Cinzel, Roboto_Mono, Crimson_Pro } from 'next/font/google';
import './globals.css';

const cinzel = Cinzel({
  variable: '--font-cinzel',
  subsets: ['latin'],
  weight: ['400', '600', '700'],
});

const robotoMono = Roboto_Mono({
  variable: '--font-roboto-mono',
  subsets: ['latin'],
  weight: ['400', '500', '700'],
});

const crimsonPro = Crimson_Pro({
  variable: '--font-crimson-pro',
  subsets: ['latin'],
  weight: ['400', '600'],
});

export const metadata: Metadata = {
  title: 'THRESHOLD',
  description: '¿Cuánto sabes lo que piensan los demás?',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`${cinzel.variable} ${robotoMono.variable} ${crimsonPro.variable} h-full`}
    >
      <body className="h-full">{children}</body>
    </html>
  );
}
