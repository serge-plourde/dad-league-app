self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('dl-v1').then(cache => cache.addAll(['/', '/manifest.json']))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then(resp => resp || fetch(event.request))
  );
});
