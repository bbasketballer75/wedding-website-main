'use client';
import { useEffect } from 'react';
import { AudioControls } from '../components/AmbientSoundSystem';
import ModernFooter from '../components/ModernFooter';
import ModernNavigation from '../components/ModernNavigation';
import ModernHomePage from '../page-components/ModernHomePage';
import '../styles/modern-2025-design.css';

export default function HomePage() {
  useEffect(() => {
    // Initialize Lenis smooth scroll
    import('lenis').then(({ default: Lenis }) => {
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });

      function raf(time: number) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }

      requestAnimationFrame(raf);

      return () => {
        lenis.destroy();
      };
    });
  }, []);

  return (
    <div className="modern-app">
      <a href="#main-content" className="modern-skip-link">
        Skip to main content
      </a>

      <ModernNavigation />

      {/* Floating Audio Controls */}
      <div className="modern-floating-audio">
        <AudioControls />
      </div>

      <main id="main-content" className="modern-main" role="main">
        {/* Hero Section */}
        <section id="home" className="modern-section">
          <ModernHomePage />
        </section>

        {/* Coming Soon: More Modern Sections */}
        <section className="modern-section glass-card">
          <div className="modern-container">
            <h2 className="modern-title">More Beautiful Sections Coming Soon</h2>
            <p className="modern-subtitle">
              We&apos;re transforming each section with our new 2025 design system
            </p>
          </div>
        </section>
      </main>

      <ModernFooter />
    </div>
  );
}
