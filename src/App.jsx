import React, { useEffect, useState, Suspense } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import { Routes, Route, useLocation } from 'react-router-dom';
import { logVisit } from './services/api';
import LoadingScreen from './components/LoadingScreen';
import LandingPage from './components/LandingPage';
import MusicPlayer from './components/MusicPlayer';
import NotificationBanner from './components/NotificationBanner';
import OrientationOverlay from './components/OrientationOverlay';
import Navbar from './components/Navbar';
import './App.css';

// Code splitting: Lazy load heavy components
const OnePage = React.lazy(() => import('./OnePage'));
const AdminPage = React.lazy(() => import('./page-components/AdminPage'));

function App() {
  const [loading, setLoading] = useState(true);
  const [showLanding, setShowLanding] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [notification, setNotification] = useState('');
  const location = useLocation();
  
  // Determine if we're on the OnePage route
  const isOnePage = location.pathname === '/';

  useEffect(() => {
    setLoading(true);
    logVisit()
      .catch(console.error)
      .finally(() => setTimeout(() => setLoading(false), 800));
  }, []);

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timeout);
  }, [location.pathname]);

  // Handler for entering the site from the landing page
  const handleEnter = () => {
    setShowLanding(false);
    setMusicEnabled(true);
    setNotification('Welcome! Enjoy the music and explore the memories.');
  };

  return (
    <ErrorBoundary>
      <div className="App">
        <OrientationOverlay />
        {loading && <LoadingScreen message="Loading..." />}
        {!loading && showLanding && <LandingPage onEnter={handleEnter} />}
        {!loading && !showLanding && (
          <>
            <Navbar onePage={isOnePage} />
            <NotificationBanner message={notification} onClose={() => setNotification('')} />
            <MusicPlayer isEnabled={musicEnabled} position="bottom-left" />
            <Suspense fallback={<LoadingScreen message="Loading page..." />}>
              <Routes>
                <Route path="/" element={<OnePage />} />
                <Route path="/admin" element={<AdminPage />} />
              </Routes>
            </Suspense>
          </>
        )}
      </div>
    </ErrorBoundary>
  );
}

export default App;
