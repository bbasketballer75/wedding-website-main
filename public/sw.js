import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies';

// Clean up old caches
cleanupOutdatedCaches();

// Precache static assets
precacheAndRoute(self.__WB_MANIFEST || []);

// Cache images with CacheFirst strategy
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'wedding-images',
    plugins: [
      {
        cacheKeyWillBeUsed: async ({ request }) => {
          return `${request.url}?v=1`;
        },
      },
    ],
  })
);

// Cache API responses with NetworkFirst
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new NetworkFirst({
    cacheName: 'api-cache',
    networkTimeoutSeconds: 3,
    plugins: [
      {
        cacheWillUpdate: async ({ response }) => {
          return response.status === 200 ? response : null;
        },
      },
    ],
  })
);

// Cache CSS and JS with StaleWhileRevalidate
registerRoute(
  ({ request }) => request.destination === 'style' || request.destination === 'script',
  new StaleWhileRevalidate({
    cacheName: 'static-resources',
  })
);

// Cache fonts with CacheFirst
registerRoute(
  ({ url }) => url.pathname.includes('/fonts/'),
  new CacheFirst({
    cacheName: 'fonts',
    plugins: [
      {
        cacheKeyWillBeUsed: async ({ request }) => {
          return request.url;
        },
      },
    ],
  })
);

// Background sync for guestbook submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync-guestbook') {
    event.waitUntil(syncGuestbookSubmissions());
  }
});

async function syncGuestbookSubmissions() {
  // Implementation for offline guestbook submissions
  const submissions = await getStoredSubmissions();
  for (const submission of submissions) {
    try {
      await fetch('/api/guestbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submission),
      });
      await removeStoredSubmission(submission.id);
    } catch (error) {
      console.log('Will retry submission later:', error);
    }
  }
}
