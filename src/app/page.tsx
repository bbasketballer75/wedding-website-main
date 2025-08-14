'use client';
import { Suspense, useEffect } from 'react';

import dynamic from 'next/dynamic';
import { AudioControls } from '../components/AmbientSoundSystem';
import InteractiveLoveTimeline from '../components/InteractiveLoveTimeline';
import LoadingScreen from '../components/LoadingScreen';
import Navbar from '../components/Navbar';
import RealTimeActivityFeed from '../components/RealTimeActivityFeed';
import ThankYouSection from '../components/ThankYouSection';
import { setupSectionFadeIn } from '../scrollFadeIn';
import { magicalExperience } from '../utils/magicalInteractions';

// Dynamically load heavy components with SSR disabled for client-side optimizations
const MemoryWall = dynamic(() => import('../components/MemoryWall'), {
  loading: () => <LoadingScreen message="Illuminating precious memories..." />,
  ssr: false,
});
const MagicalAlbumPage = dynamic(() => import('../page-components/MagicalAlbumPage'), {
  loading: () => <LoadingScreen message="Unveiling our magical photo gallery..." />,
  ssr: false,
});
const GuestbookPage = dynamic(() => import('../page-components/GuestbookPage'), {
  loading: () => <LoadingScreen message="Opening our sacred memory book..." />,
  ssr: false,
});
const FamilyWeddingPartyPage = dynamic(() => import('../page-components/FamilyWeddingPartyPage'), {
  loading: () => <LoadingScreen message="Introducing our beloved circle of love..." />,
  ssr: false,
});
const MapPage = dynamic(() => import('../page-components/MapPage'), {
  loading: () => <LoadingScreen message="Revealing our magical celebration venues..." />,
  ssr: false,
});
const StayInTouchSection = dynamic(() => import('../components/StayInTouchSection'), {
  loading: () => <LoadingScreen message="Preparing ways to stay connected..." />,
  ssr: false,
});

export default function Home() {
  useEffect(() => {
    setupSectionFadeIn();
    // Initialize magical interactions for enhanced UX
    magicalExperience.init();

    return () => {
      magicalExperience.destroy();
    };
  }, []);

  return (
    <div className="App">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Navbar onePage />

      {/* Floating Audio Controls */}
      <div
        className="fixed top-4 left-4 z-50 transition-all duration-300 hover:scale-105"
        style={{ backdropFilter: 'blur(10px)' }}
      >
        <AudioControls className="shadow-lg" />
      </div>

      {/* Real-Time Activity Feed */}
      <div
        className="fixed bottom-4 right-4 z-40 transition-all duration-300 hover:scale-105"
        style={{ maxWidth: '300px' }}
      >
        <RealTimeActivityFeed />
      </div>

      <main className="onepage-main" id="main-content" role="main" aria-label="Main content">
        {/* Hero Section */}
        <ThankYouSection />

        {/* Interactive Love Story Timeline */}
        <Suspense fallback={<LoadingScreen message="Crafting your love story..." />}>
          <section id="love-story" aria-label="Our Love Story Timeline" className="magical-section">
            <InteractiveLoveTimeline />
          </section>
        </Suspense>

        {/* Memory Wall & Photo Booth */}
        <Suspense fallback={<LoadingScreen message="Unveiling cherished moments..." />}>
          <section id="memorywall" aria-label="Memory Wall and Photo Booth">
            <MemoryWall />
          </section>
        </Suspense>

        {/* Engagement & Photo Album */}
        <Suspense fallback={<LoadingScreen message="Loading Magical Photo Gallery..." />}>
          <section id="album" aria-label="Engagement & Photo Album" className="magical-section">
            <MagicalAlbumPage />
          </section>
        </Suspense>

        {/* Guestbook */}
        <Suspense fallback={<LoadingScreen message="Loading Guestbook..." />}>
          <section id="guestbook" aria-label="Guestbook">
            <GuestbookPage />
          </section>
        </Suspense>

        {/* Family Tree & Wedding Party Combined */}
        <Suspense fallback={<LoadingScreen message="Loading Family & Wedding Party..." />}>
          <section id="family-party" aria-label="Family Tree & Wedding Party">
            <FamilyWeddingPartyPage />
          </section>
        </Suspense>

        {/* Map */}
        <Suspense fallback={<LoadingScreen message="Loading Map..." />}>
          <section id="map" aria-label="Wedding Venue Map">
            <MapPage />
          </section>
        </Suspense>

        {/* Stay in Touch - Always visible at bottom */}
        <StayInTouchSection />
      </main>
    </div>
  );
}
