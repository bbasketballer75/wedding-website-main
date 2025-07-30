import React, { useEffect, Suspense } from 'react';
import { setupSectionFadeIn } from './scrollFadeIn';
import LoadingScreen from './components/LoadingScreen';
import './App.css';

// Code splitting: Lazy load components
const Navbar = React.lazy(() => import('./components/Navbar'));
const ThankYouSection = React.lazy(() => import('./components/ThankYouSection'));
const WeddingHighlightsSection = React.lazy(() => import('./components/WeddingHighlightsSection'));
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

        {/* 1.5. Wedding Highlights - Key moments */}
        <Suspense fallback={<LoadingScreen message="Loading highlights..." />}>
          <WeddingHighlightsSection />
        </Suspense>
        {/* 2. Family Tree - Parent videos (with photos of me and jordyn above the parents) */}
        <section id="family-tree" aria-labelledby="family-tree-title" role="region">
          <h2 id="family-tree-title" className="sr-only">
            Family Tree
          </h2>
          <Suspense fallback={<LoadingScreen message="Loading family tree..." />}>
            <FamilyTreePage onePage />
          </Suspense>
        </section>

        {/* 3. Wedding Party - Bridesmaids & groomsmen */}
        <section id="wedding-party" aria-labelledby="wedding-party-title" role="region">
          <h2 id="wedding-party-title" className="sr-only">
            Wedding Party
          </h2>
          <Suspense fallback={<LoadingScreen message="Loading wedding party..." />}>
            <WeddingPartyPage onePage />
          </Suspense>
        </section>
        {/* 4. Main Wedding Video Section - YouTube Embed */}
        <section id="main-wedding-video" aria-labelledby="video-title" role="region">
          <h2 id="video-title" className="section-title">
            Our Wedding Video
          </h2>
          <div
            className="video-container"
            style={{ maxWidth: '800px', margin: '0 auto' }}
            role="group"
            aria-label="Wedding video player"
          >
            <div
              className="embed-responsive embed-responsive-16by9"
              style={{ position: 'relative', width: '100%', paddingBottom: '56.25%', height: 0 }}
            >
              <iframe
                src="https://www.youtube.com/embed/ZOIRb_ghdh0"
                title="Austin & Jordyn Wedding Video - Our complete wedding ceremony and celebration"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                allowFullScreen
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                aria-label="Wedding video embedded from YouTube"
                tabIndex="0"
              ></iframe>
            </div>
            <p className="video-description sr-only">
              Complete wedding video featuring our ceremony, vows, first dance, and celebration
              highlights.
            </p>
          </div>
        </section>
        {/* 5. Album - Engagement Photos Only */}
        <section id="engagement-album" aria-labelledby="engagement-album-title" role="region">
          <h2 id="engagement-album-title" className="sr-only">
            Engagement Photo Album
          </h2>
          <Suspense fallback={<LoadingScreen message="Loading photo album..." />}>
            <AlbumPage onePage engagementOnly />
          </Suspense>
        </section>

        {/* 6. Memory Wall - Guest uploads */}
        <section id="memory-wall" aria-labelledby="memory-wall-title" role="region">
          <h2 id="memory-wall-title" className="sr-only">
            Memory Wall
          </h2>
          <Suspense fallback={<LoadingScreen message="Loading memory wall..." />}>
            <MemoryWall />
          </Suspense>
        </section>
        {/* 7. Guestbook & Map side by side (landscape) */}
        <section
          id="guestbook-map"
          aria-labelledby="guestbook-map-title"
          role="region"
          style={{ display: 'flex', flexDirection: 'row', gap: '2rem' }}
        >
          <h2 id="guestbook-map-title" className="sr-only">
            Guestbook and Map
          </h2>
          <div style={{ flex: 1 }} role="complementary" aria-label="Guestbook section">
            <Suspense fallback={<LoadingScreen message="Loading guestbook..." />}>
              <GuestbookPage onePage />
            </Suspense>
          </div>
          <div style={{ flex: 1 }} role="complementary" aria-label="Map section">
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
