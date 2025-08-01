'use client';
import React, { useEffect, Suspense } from 'react';

import dynamic from 'next/dynamic';
import { setupSectionFadeIn } from '../scrollFadeIn';
import Navbar from '../components/Navbar';
import ThankYouSection from '../components/ThankYouSection';
import WeddingHighlightsSection from '../components/WeddingHighlightsSection';
import LoadingScreen from '../components/LoadingScreen';
import '../App.css';

// Dynamically load heavy components with SSR disabled for client-side optimizations
const MemoryWall = dynamic(() => import('../components/MemoryWall'), {
  loading: () => <LoadingScreen message="Loading Memory Wall..." />,
  ssr: false,
});
const KeepsakesSection = dynamic(() => import('../components/KeepsakesSection'), {
  loading: () => <LoadingScreen message="Loading Keepsakes..." />,
  ssr: false,
});
const TimelineSection = dynamic(() => import('../components/TimelineSection'), {
  loading: () => <LoadingScreen message="Loading Timeline..." />,
  ssr: false,
});
const StayInTouchSection = dynamic(() => import('../components/StayInTouchSection'), {
  loading: () => <LoadingScreen message="Loading Stay in Touch..." />,
  ssr: false,
});
const AlbumPage = dynamic(() => import('../page-components/AlbumPage'), {
  loading: () => <LoadingScreen message="Loading Album..." />,
  ssr: false,
});
const GuestbookPage = dynamic(() => import('../page-components/GuestbookPage'), {
  loading: () => <LoadingScreen message="Loading Guestbook..." />,
  ssr: false,
});
const MapPage = dynamic(() => import('../page-components/MapPage'), {
  loading: () => <LoadingScreen message="Loading Map..." />,
  ssr: false,
});
const FamilyTreePage = dynamic(() => import('../page-components/FamilyTreePage'), {
  loading: () => <LoadingScreen message="Loading Family Tree..." />,
  ssr: false,
});
const WeddingPartyPage = dynamic(() => import('../page-components/WeddingPartyPage'), {
  loading: () => <LoadingScreen message="Loading Wedding Party..." />,
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

        {/* Wedding Highlights - Always visible */}
        <WeddingHighlightsSection />

        {/* Memory Wall - Lazy loaded */}
        <Suspense fallback={<LoadingScreen message="Loading Memory Wall..." />}>
          <section id="memorywall" aria-label="Memory Wall and Photo Booth">
            <MemoryWall />
          </section>
        </Suspense>

        {/* Keepsakes - Lazy loaded */}
        <Suspense fallback={<LoadingScreen message="Loading Keepsakes..." />}>
          <section id="keepsakes" aria-label="Downloadable Keepsakes">
            <KeepsakesSection />
          </section>
        </Suspense>

        {/* Timeline - Lazy loaded */}
        <Suspense fallback={<LoadingScreen message="Loading Timeline..." />}>
          <section id="timeline" aria-label="Wedding Day Timeline">
            <TimelineSection />
          </section>
        </Suspense>

        {/* Album - Lazy loaded */}
        <Suspense fallback={<LoadingScreen message="Loading Album..." />}>
          <section id="album" aria-label="Photo Album">
            <AlbumPage />
          </section>
        </Suspense>

        {/* Guestbook - Lazy loaded */}
        <Suspense fallback={<LoadingScreen message="Loading Guestbook..." />}>
          <section id="guestbook" aria-label="Guestbook">
            <GuestbookPage />
          </section>
        </Suspense>

        {/* Map - Lazy loaded */}
        <Suspense fallback={<LoadingScreen message="Loading Map..." />}>
          <section id="map" aria-label="Venue Map">
            <MapPage />
          </section>
        </Suspense>

        {/* Family Tree - Lazy loaded */}
        <Suspense fallback={<LoadingScreen message="Loading Family..." />}>
          <section id="family" aria-label="Family Tree">
            <FamilyTreePage />
          </section>
        </Suspense>

        {/* Wedding Party - Lazy loaded */}
        <Suspense fallback={<LoadingScreen message="Loading Wedding Party..." />}>
          <section id="party" aria-label="Wedding Party">
            <WeddingPartyPage />
          </section>
        </Suspense>

        {/* Stay in Touch - Always visible at bottom */}
        <StayInTouchSection />
      </main>
    </div>
  );
}
