import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Austin & Jordyn - Wedding Website',
  description: 'Celebrate with Austin & Jordyn - Wedding photos, guestbook, and memories',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
