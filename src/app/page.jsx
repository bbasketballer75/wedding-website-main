'use client';

import React, { useEffect, useState, Suspense } from 'react';
import ErrorBoundary from '../components/ErrorBoundary';
import { logVisit } from '../services/api';
import LoadingScreen from '../components/LoadingScreen';
import OrientationOverlay from '../components/OrientationOverlay';
import { initWebVitals, initPerformanceObserver } from '../utils/webVitals';
import '../App.css';
import '../accessibility.css';

// Code splitting: Lazy load heavy components
const OnePage = React.lazy(() => import('../OnePage'));
const LandingPage = React.lazy(() => import('../components/LandingPage'));
const MusicPlayer = React.lazy(() => import('../components/MusicPlayer'));
const NotificationBanner = React.lazy(() => import('../components/NotificationBanner'));

function HomePage() {
  const [loading, setLoading] = useState(true);
  const [showLanding, setShowLanding] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [notification, setNotification] = useState('');

  // Skip link component for accessibility
  const SkipLink = () => (
    <a
      href="#main-content"
      className="skip-link sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:p-2 focus:bg-blue-600 focus:text-white focus:underline"
      style={{
        position: 'absolute',
        left: '-9999px',
        width: '1px',
        height: '1px',
        overflow: 'hidden',
      }}
      onFocus={(e) => {
        e.target.style.position = 'static';
        e.target.style.width = 'auto';
        e.target.style.height = 'auto';
        e.target.style.overflow = 'visible';
      }}
      onBlur={(e) => {
        e.target.style.position = 'absolute';
        e.target.style.left = '-9999px';
        e.target.style.width = '1px';
        e.target.style.height = '1px';
        e.target.style.overflow = 'hidden';
      }}
    >
      Skip to main content
    </a>
  );

  useEffect(() => {
    // Initialize Web Vitals monitoring for production
    if (typeof window !== 'undefined') {
      initWebVitals();
      initPerformanceObserver();
    }

    // Log visitor for analytics
    const timer = setTimeout(() => {
      logVisit().catch(console.error);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Handler for entering the site from the landing page
  const handleEnter = () => {
    setShowLanding(false);
    setMusicEnabled(true);
    setNotification('Welcome! Enjoy the music and explore the memories.');
  };

  return (
    <ErrorBoundary>
      <div className="App">
        <SkipLink />
        <OrientationOverlay />
        {loading && <LoadingScreen message="Loading..." />}
        {!loading && showLanding && (
          <Suspense fallback={<LoadingScreen message="Preparing experience..." />}>
            <LandingPage onEnter={handleEnter} />
          </Suspense>
        )}
        {!loading && !showLanding && (
          <main id="main-content" role="main">
            <Suspense fallback={null}>
              <NotificationBanner message={notification} onClose={() => setNotification('')} />
            </Suspense>
            <Suspense fallback={null}>
              <MusicPlayer isEnabled={musicEnabled} position="bottom-left" />
            </Suspense>
            <Suspense fallback={<LoadingScreen message="Loading page..." />}>
              <OnePage />
            </Suspense>
          </main>
        )}
      </div>
    </ErrorBoundary>
  );
}

export default HomePage;
