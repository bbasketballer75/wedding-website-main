'use client';

import { useEffect } from 'react';

// Helper function to handle service worker state changes
const handleWorkerStateChange = (newWorker: ServiceWorker) => {
  if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
    // New content available, show update prompt
    if (window.confirm('New version available! Refresh to update?')) {
      window.location.reload();
    }
  }
};

// Helper function to handle service worker updates
const handleUpdateFound = (registration: ServiceWorkerRegistration) => {
  const newWorker = registration.installing;
  if (newWorker) {
    newWorker.addEventListener('statechange', () => handleWorkerStateChange(newWorker));
  }
};

// Helper function to register service worker
const registerServiceWorker = async (): Promise<void> => {
  try {
    const registration = await navigator.serviceWorker.register('/sw.js');
    console.log('✅ Service Worker registered:', registration);

    // Check for updates
    registration.addEventListener('updatefound', () => handleUpdateFound(registration));
  } catch (error) {
    console.log('❌ Service Worker registration failed:', error);
  }
};

// Helper function to handle service worker messages
const setupServiceWorkerMessages = () => {
  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data.type === 'SW_ACTIVATED') {
      console.log('🎉 Service Worker activated and caching updated');
    }
  });
};

// Helper function to setup background sync
const setupBackgroundSync = async (): Promise<void> => {
  try {
    const registration = await navigator.serviceWorker.ready;
    if ('sync' in registration) {
      console.log('🔄 Background sync is supported');
    }
  } catch (error) {
    console.log('Service worker ready check failed:', error);
  }
};

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      // Register service worker
      registerServiceWorker();

      // Setup message handling
      setupServiceWorkerMessages();

      // Setup background sync
      setupBackgroundSync();
    }
  }, []);

  return null; // This component doesn't render anything
}
