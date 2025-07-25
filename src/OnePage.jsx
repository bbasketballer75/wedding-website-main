import React, { useEffect, Suspense } from 'react';
import { setupSectionFadeIn } from './scrollFadeIn';
import Navbar from './components/Navbar';
import ThankYouSection from './components/ThankYouSection';
import WeddingHighlightsSection from './components/WeddingHighlightsSection';
import LoadingScreen from './components/LoadingScreen';
import './App.css';

// Lazy load heavy components
const MemoryWall = React.lazy(() => import('./components/MemoryWall'));
const KeepsakesSection = React.lazy(() => import('./components/KeepsakesSection'));
const TimelineSection = React.lazy(() => import('./components/TimelineSection'));
const StayInTouchSection = React.lazy(() => import('./components/StayInTouchSection'));
const HomePage = React.lazy(() => import('./page-components/HomePage'));
const AlbumPage = React.lazy(() => import('./page-components/AlbumPage'));
const GuestbookPage = React.lazy(() => import('./page-components/GuestbookPage'));
const MapPage = React.lazy(() => import('./page-components/MapPage'));
const FamilyTreePage = React.lazy(() => import('./page-components/FamilyTreePage'));
const WeddingPartyPage = React.lazy(() => import('./page-components/WeddingPartyPage'));

const OnePage = () => {
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
        {/* 1. Thank You Section - Welcome message (play intro video after landing page and before showing this section) */}
        <ThankYouSection />
        {/* 2. Family Tree - Parent videos (with photos of me and jordyn above the parents) */}
        <section id="family-tree" aria-label="Family Tree" role="region">
          {/* Add photos of Austin & Jordyn above parent videos */}
          {/* <FamilyTreePage onePage /> */}
        </section>
        {/* 3. Wedding Party - Bridesmaids & groomsmen */}
        <section id="wedding-party" aria-label="Wedding Party" role="region">
          {/* <WeddingPartyPage onePage /> */}
        </section>
        {/* 4. Main Wedding Video Section with Custom Player */}
        <section id="main-wedding-video" aria-label="Main Wedding Video" role="region">
          {/* <CustomYouTubePlayer /> */}
        </section>
        {/* 5. Album - Engagement Photos Only */}
        <section id="engagement-album" aria-label="Engagement Album" role="region">
          {/* Custom Engagement Album component here */}
        </section>
        {/* 6. Memory Wall - Guest uploads */}
        <section id="memory-wall" aria-label="Memory Wall" role="region">
          {/* <MemoryWall /> */}
        </section>
        {/* 7. Guestbook & Map side by side (landscape) */}
        <section id="guestbook-map" aria-label="Guestbook and Map" role="region" style={{ display: 'flex', flexDirection: 'row', gap: '2rem' }}>
          <div style={{ flex: 1 }}>
            {/* <GuestbookPage onePage /> */}
          </div>
          <div style={{ flex: 1 }}>
            {/* <MapPage onePage /> */}
          </div>
        </section>
        {/* 8. Stay in Touch - Contact info */}
        <StayInTouchSection />
      </main>
      </main>
    </div>
  );
};

export default OnePage;
