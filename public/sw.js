const CACHE_VERSION = 'v4';
const PAGES_CACHE = `bejaia-pages-${CACHE_VERSION}`;
const ASSETS_CACHE = `bejaia-assets-${CACHE_VERSION}`;
const TILES_CACHE = `bejaia-tiles-${CACHE_VERSION}`;
const VALID_CACHES = [PAGES_CACHE, ASSETS_CACHE, TILES_CACHE];

const CORE_SHELL = [
  '/',
  '/destinations',
  '/carte',
  '/circuits',
  '/categories',
  '/histoire',
  '/culture',
  '/guide-pratique',
  '/a-propos',
  '/contact',
  '/manifest.webmanifest',
  '/maplibre-gl-worker.js',
  '/icon.svg',
  '/pwa-192x192.png',
  '/pwa-512x512.png',
  '/pwa-maskable-512x512.png',
  '/apple-touch-icon.png',
  '/images/hero-cap-carbon.jpg',
  '/images/gouraya-nature.jpg',
  '/images/aokas-coast.jpg',
  '/images/casbah-heritage.jpg',
  '/images/kabyle-village.jpg',
  '/images/kabyle-craft.jpg',
];

const DESTINATION_ROUTES = [
  '/destinations/parc-national-gouraya',
  '/destinations/cap-carbon',
  '/destinations/mont-gouraya',
  '/destinations/pic-des-singes',
  '/destinations/baie-des-aiguades',
  '/destinations/foret-akfadou',
  '/destinations/gorges-kherrata-chabet-el-akra',
  '/destinations/grottes-aokas',
  '/destinations/paysages-cotiers-aokas',
  '/destinations/tichy',
  '/destinations/plage-aokas',
  '/destinations/boulimat',
  '/destinations/saket',
  '/destinations/souk-el-tenine',
  '/destinations/melbou',
  '/destinations/casbah-bejaia',
  '/destinations/bab-el-bhar',
  '/destinations/remparts-hammadites',
  '/destinations/fort-gouraya',
  '/destinations/fort-sidi-abdelkader',
  '/destinations/musee-bordj-moussa',
  '/destinations/village-uthrunen',
  '/destinations/toudja',
  '/destinations/vallee-de-la-soummam',
  '/destinations/villages-traditionnels-bejaia',
  '/destinations/sources-thermales-tifra',
  '/destinations/sources-thermales-adekar',
  '/destinations/sources-thermales-bouhamza',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(PAGES_CACHE)
      .then((cache) => cache.addAll(CORE_SHELL).catch(() => undefined))
      .then(() => self.skipWaiting())
  );
});

async function cacheAllTravelPages(notifyClients) {
  const cache = await caches.open(PAGES_CACHE);
  const targets = Array.from(new Set(['/destinations', '/carte', '/circuits', ...DESTINATION_ROUTES]));
  let completed = 0;

  for (const route of targets) {
    try {
      const res = await fetch(route, { credentials: 'same-origin' });
      if (res.ok) {
        await cache.put(route, res.clone());
      }
    } catch {
      // Skip individual route failures when offline
    }
    completed += 1;
    if (notifyClients) {
      const clients = await self.clients.matchAll({ includeUncontrolled: true });
      clients.forEach((client) => {
        client.postMessage({
          type: 'OFFLINE_CACHE_PROGRESS',
          cached: completed,
          total: targets.length,
          done: completed === targets.length,
        });
      });
    }
  }
}

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => !VALID_CACHES.includes(k))
            .map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CACHE_ALL_TRAVEL_PAGES') {
    event.waitUntil(cacheAllTravelPages(true));
  }
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Cache OpenFreeMap vector tiles/styles and OpenStreetMap tiles when visited
  if (
    url.hostname === 'tiles.openfreemap.org' ||
    url.hostname.endsWith('tile.openstreetmap.org')
  ) {
    event.respondWith(
      caches.open(TILES_CACHE).then((cache) =>
        cache.match(request).then((cached) => {
          const network = fetch(request)
            .then((response) => {
              if (response.ok || response.type === 'opaque') {
                cache.put(request, response.clone()).catch(() => undefined);
              }
              return response;
            })
            .catch(() => cached);
          return cached || network;
        })
      )
    );
    return;
  }

  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/api/')) return;

  const isRscRequest =
    request.headers.get('RSC') === '1' || url.searchParams.has('_rsc');

  // Network-first for HTML navigations and Next.js RSC payloads
  if (request.mode === 'navigate' || isRscRequest) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(PAGES_CACHE).then((cache) => {
              cache.put(request, copy).catch(() => undefined);
            });
          }
          return response;
        })
        .catch(() =>
          caches.open(PAGES_CACHE).then((cache) =>
            cache
              .match(request)
              .then((exact) => exact || cache.match(url.pathname))
              .then((fallback) => fallback || cache.match('/destinations'))
              .then((homeFallback) => homeFallback || cache.match('/'))
          )
        )
    );
    return;
  }

  // Network-first for Next.js JS/CSS chunks so fresh SSR HTML always hydrates with matching JS
  if (url.pathname.startsWith('/_next/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(ASSETS_CACHE).then((cache) => {
              cache.put(request, copy).catch(() => undefined);
            });
          }
          return response;
        })
        .catch(() => caches.open(ASSETS_CACHE).then((cache) => cache.match(request)))
    );
    return;
  }

  // Stale-while-revalidate for static images, icons, and MapLibre worker script
  event.respondWith(
    caches.open(ASSETS_CACHE).then((cache) =>
      cache.match(request).then((cached) => {
        const networkFetch = fetch(request)
          .then((response) => {
            if (response.ok) {
              cache.put(request, response.clone()).catch(() => undefined);
            }
            return response;
          })
          .catch(() => cached);
        return cached || networkFetch;
      })
    )
  );
});
