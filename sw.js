const CACHE = 'mba-v1';
const STATIC = [
  '/personal-mba-feed/',
  '/personal-mba-feed/index.html',
  '/personal-mba-feed/css/app.css',
  '/personal-mba-feed/js/config.js',
  '/personal-mba-feed/js/seed-data.js',
  '/personal-mba-feed/js/api.js',
  '/personal-mba-feed/js/cards.js',
  '/personal-mba-feed/js/dashboard.js',
  '/personal-mba-feed/js/app.js',
  '/personal-mba-feed/manifest.json',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(STATIC)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // Network-first for API calls (Apps Script)
  if (url.hostname.includes('script.google.com')) {
    e.respondWith(
      fetch(e.request).catch(() => new Response('{"error":"offline"}', {
        headers: { 'Content-Type': 'application/json' }
      }))
    );
    return;
  }

  // Cache-first for static assets
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).then(res => {
      if (res.ok && e.request.method === 'GET') {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
      }
      return res;
    }))
  );
});
