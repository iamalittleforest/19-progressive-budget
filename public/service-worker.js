const STATIC_CACHE_NAME = 'static-cache-v1';
const DATA_CACHE_NAME = 'data-cache-v1';
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
  event.waitUntil(
    caches
      .open(DATA_CACHE_NAME)
      .then(cache => cache.add("/api/transaction"))
  );

  // precache static assets
  event.waitUntil(
    caches
      .open(STATIC_CACHE_NAME)
      .then((cache) => cache.addAll(FILES_TO_CACHE))
  );

  // move to activate
  self.skipWaiting();
});

// activate event
self.addEventListener('activate', event => {

});

// fetch event
self.addEventListener('fetch', event => {

});