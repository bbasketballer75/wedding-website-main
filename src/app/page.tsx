'use client';
import React, { useEffect, Suspense } from 'react';

import dynamic from 'next/dynamic';
import { setupSectionFadeIn } from '../scrollFadeIn';
import Navbar from '../components/Navbar';
import ThankYouSection from '../components/ThankYouSection';
import LoadingScreen from '../components/LoadingScreen';
import '../App.css';

// Dynamically load heavy components with SSR disabled for client-side optimizations
const MemoryWall = dynamic(() => import('../components/MemoryWall'), {
  loading: () => <LoadingScreen message="Illuminating precious memories..." />,
  ssr: false,
});
const AlbumPage = dynamic(() => import('../page-components/AlbumPage'), {
  loading: () => <LoadingScreen message="Unveiling our engagement enchantment..." />,
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
  }, []);

  return (
    <div className="App">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Navbar onePage />
      <main className="onepage-main" id="main-content" role="main" aria-label="Main content">
        {/* Hero Section */}
        <ThankYouSection />

        {/* Memory Wall & Photo Booth */}
        <Suspense fallback={<LoadingScreen message="Unveiling cherished moments..." />}>
          <section id="memorywall" aria-label="Memory Wall and Photo Booth">
            <MemoryWall />
          </section>
        </Suspense>

        {/* Engagement & Photo Album */}
        <Suspense fallback={<LoadingScreen message="Loading Engagement & Album..." />}>
          <section id="album" aria-label="Engagement & Photo Album">
            <AlbumPage />
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
