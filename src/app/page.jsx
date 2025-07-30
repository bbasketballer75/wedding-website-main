import React, { useEffect, Suspense } from 'react';
import { setupSectionFadeIn } from '../scrollFadeIn';
import Navbar from '../components/Navbar';
import ThankYouSection from '../components/ThankYouSection';
import LoadingScreen from '../components/LoadingScreen';
import '../App.css';
// Only import components that are still used
const StayInTouchSection = React.lazy(() => import('../components/StayInTouchSection'));
const AlbumPage = React.lazy(() => import('../page-components/AlbumPage'));
const GuestbookPage = React.lazy(() => import('../page-components/GuestbookPage'));
const MapPage = React.lazy(() => import('../page-components/MapPage'));

export default function HomePage() {
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
          {/* Custom Engagement Album component here */}
        </section>
        {/* 6. Memory Wall - Guest uploads */}
        <section id="memory-wall" aria-label="Memory Wall" role="region">
          {/* <MemoryWall /> */}
        </section>
        {/* 7. Guestbook & Map side by side (landscape) */}
        <section
          id="guestbook-map"
          aria-label="Guestbook and Map"
          role="region"
          style={{ display: 'flex', flexDirection: 'row', gap: '2rem' }}
        >
          <div style={{ flex: 1 }}>{/* <GuestbookPage onePage /> */}</div>
          <div style={{ flex: 1 }}>{/* <MapPage onePage /> */}</div>
        </section>
        {/* 8. Stay in Touch - Contact info */}
        <StayInTouchSection />
      </main>
    </div>
  );
}