const STATIC_CACHE = 'static-cache-v1';
const RUNTIME_CACHE = 'data-cache-v1';
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/index.js',
  '/manifest.webmanifest',
  '/styles.css',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// install event
self.addEventListener('install', event => {

  // precache transaction data
  // event.waitUntil(
  //   caches.open(RUNTIME_CACHE)
  //     .then(cache => cache.add("/api/transaction"))
  // );

  // precache static assets
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then(cache => cache.addAll(FILES_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

// activate event
self.addEventListener('activate', event => {

});

// fetch event
self.addEventListener('fetch', event => {

});