
// Simple but effective service worker
const CACHE_NAME = 'dark-pwa-cache-v2';
// Ermittele den Scope (Subpfad bei GitHub Pages), z. B. /<repo>/ oder /
const SCOPE = (self.registration && self.registration.scope) ? new URL(self.registration.scope).pathname.replace(/\/$/, '') : '';
const p = (path) => `${SCOPE}${path.startsWith('/') ? path : '/' + path}`;
const CORE_ASSETS = [
  p('/'),
  p('/index.html'),
  p('/manifest.webmanifest'),
  p('/offline.html'),
  p('/icons/icon-192.png'),
  p('/icons/icon-512.png')
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map(k => (k !== CACHE_NAME ? caches.delete(k) : Promise.resolve())));
      await self.clients.claim();
    })()
  );
});

// Network-first for navigations; cache-first for static assets
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);
  if (req.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(req);
        const cache = await caches.open(CACHE_NAME);
    cache.put(p('/'), fresh.clone());
        return fresh;
      } catch (err) {
        const cache = await caches.open(CACHE_NAME);
    return (await cache.match(p('/'))) || (await cache.match(p('/offline.html')));
      }
    })());
    return;
  }

  if (url.origin === location.origin) {
  if (url.pathname.startsWith(p('/assets/')) || url.pathname.startsWith(p('/icons/'))) {
      event.respondWith((async () => {
        const cache = await caches.open(CACHE_NAME);
        const cached = await cache.match(req);
        if (cached) return cached;
        const resp = await fetch(req);
        cache.put(req, resp.clone());
        return resp;
      })());
    }
  }
});

// Listen for SKIP_WAITING messages to update in-place
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
