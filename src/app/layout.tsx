import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';
import '../App.css';
import '../accessibility.css';
import App from '../App';
import { weddingStructuredData, websiteStructuredData } from './structured-data';

export const metadata: Metadata = {
  title: {
    default: 'Austin & Jordyn - Wedding Website',
    template: '%s | Austin & Jordyn',
  },
  description:
    'Celebrate with Austin & Jordyn - Wedding photos, guestbook, and memories from our special day',
  keywords: [
    'wedding',
    'Austin Porada',
    'Jordyn Porada',
    'wedding photos',
    'guestbook',
    'celebration',
  ],
  authors: [{ name: 'Austin Porada' }, { name: 'Jordyn Porada' }],
  creator: 'Austin & Jordyn Porada',
  publisher: 'The Poradas',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://theporadas.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://theporadas.com',
    title: 'Austin & Jordyn - Wedding Website',
    description:
      'Celebrate with Austin & Jordyn - Wedding photos, guestbook, and memories from our special day',
    siteName: 'Austin & Jordyn Wedding',
    images: [
      {
        url: '/images/landing-bg.jpg',
        width: 1200,
        height: 630,
        alt: 'Austin & Jordyn Wedding',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Austin & Jordyn - Wedding Website',
    description: 'Celebrate with Austin & Jordyn - Wedding photos, guestbook, and memories',
    images: ['/images/landing-bg.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#9caf88' },
    { media: '(prefers-color-scheme: dark)', color: '#7a8b6c' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          id="wedding-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(weddingStructuredData),
          }}
        />
        <Script
          id="website-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteStructuredData),
          }}
        />
      </head>
      <body className="antialiased">
        <App>{children}</App>
      </body>
    </html>
  );
}
