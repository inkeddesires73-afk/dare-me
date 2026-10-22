const CACHE_NAME = 'dare-me-pwa-v24';
const APP_SHELL = [
  './',
  './index.html',
  './rules.html',
  './architect.html',
  './trutharchitect.html',
  './site-services-config.js',
  './visit-statistics.js',
  './deck-notification.js',
  './deck-submission.js',
  './deck-submission.js?v=20261022-contact-email-2',
  './deck-notification.js?v=20261022-contact-email-2',
  './submission-contact.css',
  './design-system.css',
  './manifest.webmanifest',
  './dareme.png',
  './icon-192.jpg',
  './icon-512.jpg',
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
          .filter(key => key.startsWith('dare-me-pwa-') && key !== CACHE_NAME)
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
    const appHomePath = new URL('./', self.registration.scope).pathname;
    const isAppHome = url.pathname === appHomePath || url.pathname === `${appHomePath}index.html`;
    const cacheKey = isAppHome ? './index.html' : request;
    event.respondWith(
      fetch(request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(cacheKey, copy));
          return response;
        })
        .catch(() => caches.match(cacheKey))
    );
    return;
  }

  const isHtml = url.pathname.endsWith('.html') || url.pathname.endsWith('/');
  const isServiceAsset = ['site-services-config.js', 'deck-submission.js', 'deck-notification.js', 'submission-contact.css']
    .some(file => url.pathname.endsWith('/' + file));
  const isDeck = /\/(?:level\d+|truth\d+)\.json$/i.test(url.pathname);
  const cacheRequest = isDeck ? new Request(url.origin + url.pathname) : request;
  event.respondWith(
    ((isHtml || isServiceAsset) ? fetch(request).catch(() => caches.match(cacheRequest)) : caches.match(cacheRequest).then(cached => cached || fetch(request))).then(response => {
      if (!response) return response;
      const copy = response.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(cacheRequest, copy));
      return response;
    })
  );
});
