"use client";
import React, { useEffect, useState, Suspense } from 'react';
import { usePathname } from 'next/navigation';
import ErrorBoundary from '../components/ErrorBoundary';
import { logVisit } from '../services/api';
import LoadingScreen from '../components/LoadingScreen';
import LandingPage from '../components/LandingPage';
import MusicPlayer from '../components/MusicPlayer';
import NotificationBanner from '../components/NotificationBanner';
import OrientationOverlay from '../components/OrientationOverlay';
import '../App.css';

export default function RootLayout({ children }) {
  const [loading, setLoading] = useState(true);
  const [showLanding, setShowLanding] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [notification, setNotification] = useState('');
  const pathname = usePathname();

  useEffect(() => {
    setLoading(true);
    logVisit()
      .catch(console.error)
      .finally(() => setTimeout(() => setLoading(false), 800));
  }, []);

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timeout);
  }, [pathname]);

  // Handler for entering the site from the landing page
  const handleEnter = () => {
    setShowLanding(false);
    setMusicEnabled(true);
    setNotification('Welcome! Enjoy the music and explore the memories.');
  };

  return (
    <html lang="en">
      <body>
        <ErrorBoundary>
          <div className="App">
            <OrientationOverlay />
            {loading && <LoadingScreen message="Loading..." />}
            {!loading && showLanding && <LandingPage onEnter={handleEnter} />}
            {!loading && !showLanding && (
              <>
                <NotificationBanner message={notification} onClose={() => setNotification('')} />
                <MusicPlayer isEnabled={musicEnabled} position="bottom-left" />
                <Suspense fallback={<LoadingScreen message="Loading page..." />}>
                  {children}
                </Suspense>
              </>
            )}
          </div>
        </ErrorBoundary>
      </body>
    </html>
  );
}