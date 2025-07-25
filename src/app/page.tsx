'use client';
import React from 'react';

import { useEffect, Suspense } from 'react';
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
const HomePage = dynamic(() => import('../page-components/HomePage'), {
  loading: () => <LoadingScreen message="Loading Home..." />,
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
        <ThankYouSection />
        <WeddingHighlightsSection />
        <Suspense fallback={<LoadingScreen message="Loading section..." />}>
          <section id="memorywall" aria-label="Memory Wall and Photo Booth" role="region">
            <MemoryWall />
          </section>
          <section id="keepsakes" aria-label="Downloadable Keepsakes" role="region">
            <KeepsakesSection />
          </section>
          <section id="timeline" aria-label="Wedding Day Timeline" role="region">
            <TimelineSection />
          </section>
          <section id="home" aria-label="Home" role="region">
            <HomePage />
          </section>
          <section id="album" aria-label="Album" role="region">
            <AlbumPage />
          </section>
          <section id="guestbook" aria-label="Guestbook" role="region">
            <GuestbookPage />
          </section>
          <section id="map" aria-label="Map" role="region">
            <MapPage />
          </section>
          <section id="family" aria-label="Family Tree" role="region">
            <FamilyTreePage />
          </section>
          <section id="party" aria-label="Wedding Party" role="region">
            <WeddingPartyPage />
          </section>
          <StayInTouchSection />
        </Suspense>
      </main>
    </div>
  );
}
