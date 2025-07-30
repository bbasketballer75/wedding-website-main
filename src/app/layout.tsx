import type { Metadata } from 'next';
import { structuredData } from './structured-data';
import './globals.css';

export const metadata: Metadata = {
  title: 'Austin & Jordyn - Wedding Website',
  description: 'Celebrate with Austin & Jordyn - Wedding photos, guestbook, and memories',
  keywords:
    'Austin Jordyn wedding, wedding photos, wedding memories, guestbook, wedding celebration',
  authors: [{ name: 'Austin & Jordyn Porada' }],
  creator: 'Austin & Jordyn Porada',
  publisher: 'Austin & Jordyn Porada',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://theporadas.com',
    title: 'Austin & Jordyn - Wedding Website',
    description: 'Celebrate with Austin & Jordyn - Wedding photos, guestbook, and memories',
    siteName: 'The Poradas Wedding',
    images: [
      {
        url: 'https://theporadas.com/images/engagement/PoradaProposal-11.webp',
        width: 1200,
        height: 630,
        alt: 'Austin & Jordyn Wedding Photo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Austin & Jordyn - Wedding Website',
    description: 'Celebrate with Austin & Jordyn - Wedding photos, guestbook, and memories',
    images: ['https://theporadas.com/images/engagement/PoradaProposal-11.webp'],
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
    google: 'your-google-verification-code', // Add your Google Search Console verification
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
