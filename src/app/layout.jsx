import { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Austin & Jordyn Porada - Wedding Website',
  description: 'Celebrate the wedding of Austin & Jordyn Porada. View photos, leave messages in our guestbook, and explore our special memories together.',
  keywords: 'wedding, Austin Porada, Jordyn Porada, wedding photos, guestbook, memories',
  authors: [{ name: 'Austin Porada' }],
  openGraph: {
    title: 'Austin & Jordyn Porada - Wedding Website',
    description: 'Celebrate our wedding! View photos, leave messages, and explore our memories.',
    url: 'https://www.theporadas.com',
    siteName: 'The Poradas Wedding',
    images: [
      {
        url: '/images/landing-bg.webp',
        width: 1200,
        height: 630,
        alt: 'Austin & Jordyn Wedding',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Austin & Jordyn Porada - Wedding Website',
    description: 'Celebrate our wedding! View photos, leave messages, and explore our memories.',
    images: ['/images/landing-bg.webp'],
  },
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://www.theporadas.com" />
        <meta name="theme-color" content="#2563eb" />
      </head>
      <body>{children}</body>
    </html>
  );
}
