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

  // remove old caches
  const currentCaches = [STATIC_CACHE, RUNTIME_CACHE];
  event.waitUntil(
    caches
      .keys()
      .then(cacheNames => {
        return cacheNames.filter(
          cacheName => !currentCaches.includes(cacheName)
        );
      })
      .then(cachesToDelete => {
        return Promise.all(
          cachesToDelete.map(cacheToDelete => {
            return caches.delete(cacheToDelete);
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// fetch event
self.addEventListener('fetch', event => {

  // does not cache non GET requests or requests to other origins
  if (
    event.request.method !== "GET" ||
    !event.request.url.startsWith(self.location.origin)
  ) {
    event.respondWith(fetch(event.request));
    return;
  }

  // cache requests to api
  if (event.request.url.includes("/api/transaction")) {
    event.respondWith(
      caches
        .open(RUNTIME_CACHE)
        .then(cache => {
          return fetch(event.request)

            // clone if response is sucessful
            .then(response => {
              if (response.status === 200) {
                cache.put(event.request, response.clone());
              }
              return response;
            })

            // get from cache if response is unsuccessful
            .catch(err => cache.match(event.request));
        })
        .catch(err => console.log(err))
    );
    return;
  }

  // use cached response first 
  event.respondWith(
    caches
      .match(event.request)
      .then(cachedResponse => {

        // use cached response if request is in cache
        if (cachedResponse) {
          return cachedResponse;
        }

        // fetch and cache response if request is not in cache
        return caches
          .open(RUNTIME_CACHE)
          .then(cache => {
            return fetch(event.request)

              // clone if response is sucessful
              .then(response => {
                if (response.status === 200) {
                  cache.put(event.request, response.clone());
                }
                return response;
              })

              // get from cache if response is unsuccessful
              .catch(err => cache.match(event.request));
          })
          .catch(err => console.log(err))
      })
      .catch(err => console.log(err))
  );
});