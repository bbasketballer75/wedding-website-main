import React, { useEffect, Suspense } from 'react';
import { setupSectionFadeIn } from './scrollFadeIn';
import LoadingScreen from './components/LoadingScreen';
import './App.css';

// Code splitting: Lazy load components
const Navbar = React.lazy(() => import('./components/Navbar'));
const ThankYouSection = React.lazy(() => import('./components/ThankYouSection'));
const StayInTouchSection = React.lazy(() => import('./components/StayInTouchSection'));
const AlbumPage = React.lazy(() => import('./page-components/AlbumPage'));
const GuestbookPage = React.lazy(() => import('./page-components/GuestbookPage'));
const MapPage = React.lazy(() => import('./page-components/MapPage'));
const WeddingPartyPage = React.lazy(() => import('./page-components/WeddingPartyPage'));
const FamilyTreePage = React.lazy(() => import('./page-components/FamilyTreePage'));
const MemoryWall = React.lazy(() => import('./components/MemoryWall'));

const OnePage = () => {
  useEffect(() => {
    setupSectionFadeIn();
  }, []);
  return (
    <div className="App">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Suspense fallback={<LoadingScreen message="Loading navigation..." />}>
        <Navbar onePage />
      </Suspense>
      <main className="onepage-main" id="main-content" role="main" aria-label="Main content">
        {/* 1. Thank You Section - Welcome message (play intro video after landing page and before showing this section) */}
        <Suspense fallback={<LoadingScreen message="Loading content..." />}>
          <ThankYouSection />
        </Suspense>
        {/* 2. Family Tree - Parent videos (with photos of me and jordyn above the parents) */}
        <section id="family-tree" aria-label="Family Tree" role="region">
          <Suspense fallback={<LoadingScreen message="Loading family tree..." />}>
            <FamilyTreePage onePage />
          </Suspense>
        </section>

        {/* 3. Wedding Party - Bridesmaids & groomsmen */}
        <section id="wedding-party" aria-label="Wedding Party" role="region">
          <Suspense fallback={<LoadingScreen message="Loading wedding party..." />}>
            <WeddingPartyPage onePage />
          </Suspense>
        </section>
        {/* 4. Main Wedding Video Section - YouTube Embed */}
        <section id="main-wedding-video" aria-label="Main Wedding Video" role="region">
          <h2 className="section-title">Our Wedding Video</h2>
          <div className="video-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div
              className="embed-responsive embed-responsive-16by9"
              style={{ position: 'relative', width: '100%', paddingBottom: '56.25%', height: 0 }}
            >
              <iframe
                src="https://www.youtube.com/embed/ZOIRb_ghdh0"
                title="Austin & Jordyn Wedding Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                allowFullScreen
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
              ></iframe>
            </div>
          </div>
        </section>
        {/* 5. Album - Engagement Photos Only */}
        <section id="engagement-album" aria-label="Engagement Album" role="region">
          <Suspense fallback={<LoadingScreen message="Loading photo album..." />}>
            <AlbumPage onePage engagementOnly />
          </Suspense>
        </section>

        {/* 6. Memory Wall - Guest uploads */}
        <section id="memory-wall" aria-label="Memory Wall" role="region">
          <Suspense fallback={<LoadingScreen message="Loading memory wall..." />}>
            <MemoryWall />
          </Suspense>
        </section>
        {/* 7. Guestbook & Map side by side (landscape) */}
        <section
          id="guestbook-map"
          aria-label="Guestbook and Map"
          role="region"
          style={{ display: 'flex', flexDirection: 'row', gap: '2rem' }}
        >
          <div style={{ flex: 1 }}>
            <Suspense fallback={<LoadingScreen message="Loading guestbook..." />}>
              <GuestbookPage onePage />
            </Suspense>
          </div>
          <div style={{ flex: 1 }}>
            <Suspense fallback={<LoadingScreen message="Loading map..." />}>
              <MapPage onePage />
            </Suspense>
          </div>
        </section>
        {/* 8. Stay in Touch - Contact info */}
        <Suspense fallback={<LoadingScreen message="Loading contact section..." />}>
          <StayInTouchSection />
        </Suspense>
      </main>
    </div>
  );
};

export default OnePage;
