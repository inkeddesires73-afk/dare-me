const CACHE_NAME = 'dare-me-pwa-v5';
const APP_SHELL = [
  './',
  './index.html',
  './rules.html',
  './architect.html',
  './manifest.webmanifest',
  './dareme.png',
  './icon-192.jpg?v=2',
  './icon-512.jpg?v=2',
  './level1.json',
  './level2.json',
  './level3.json',
  './level4.json',
  './truth1.json',
  './truth2.json',
  './truth3.json',
  './truth4.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin && url.hostname !== 'www.gstatic.com') return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put('./index.html', copy));
          return response;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  const isHtml = url.pathname.endsWith('.html') || url.pathname.endsWith('/');
  event.respondWith(
    (isHtml ? fetch(request).catch(() => caches.match(request)) : caches.match(request).then(cached => cached || fetch(request))).then(response => {
      if (!response) return response;
      const copy = response.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
      return response;
    })
  );
});
