/* eslint-disable no-restricted-globals */
/**
 * Service worker — v3.7 cache strategies (idea #20, #49).
 *
 *   - cache-first for hashed static assets (`/assets/*` — immutable bundles)
 *   - network-first for HTML routes (so SPA updates land immediately,
 *     falls back to cache then to offline.html)
 *   - network-first w/ 3s timeout + cache fallback for `/api/*`
 *     (stale-while-revalidate semantics: fresh when online, cached when slow)
 *   - bypass cache for /applied-manifest.json (gallery wants fresh data)
 *   - periodic background sync stub for content refresh
 *
 * Cache versioning bumps via CACHE_VERSION; activate purges stale caches.
 * skipWaiting + clients.claim → new SW takes over the moment the page reloads.
 */
const CACHE_VERSION = 'v3.7';
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const RUNTIME_CACHE = `runtime-${CACHE_VERSION}`;
const API_CACHE = `api-${CACHE_VERSION}`;
const ACTIVE_CACHES = [STATIC_CACHE, RUNTIME_CACHE, API_CACHE];
const PRECACHE = ['/', '/offline.html', '/site.webmanifest'];
const API_TIMEOUT_MS = 3000;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => !ACTIVE_CACHES.includes(k)).map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

/** Race fetch against a timeout; resolves to undefined on timeout (caller falls back to cache). */
function fetchWithTimeout(req, ms) {
  return new Promise((resolve) => {
    let settled = false;
    const t = setTimeout(() => {
      if (!settled) {
        settled = true;
        resolve(undefined);
      }
    }, ms);
    fetch(req)
      .then((res) => {
        if (settled) return;
        settled = true;
        clearTimeout(t);
        resolve(res);
      })
      .catch(() => {
        if (settled) return;
        settled = true;
        clearTimeout(t);
        resolve(undefined);
      });
  });
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Network-first w/ timeout + cache fallback for /api/*
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      (async () => {
        const fresh = await fetchWithTimeout(req, API_TIMEOUT_MS);
        if (fresh && fresh.ok) {
          const copy = fresh.clone();
          caches.open(API_CACHE).then((c) => c.put(req, copy)).catch(() => {});
          return fresh;
        }
        const cached = await caches.match(req);
        if (cached) return cached;
        return new Response(JSON.stringify({ error: 'offline' }), {
          status: 503,
          headers: { 'Content-Type': 'application/json' },
        });
      })(),
    );
    return;
  }

  // Always-fresh: gallery manifest
  if (url.pathname === '/applied-manifest.json') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(RUNTIME_CACHE).then((c) => c.put(req, copy)).catch(() => {});
          return res;
        })
        .catch(() => caches.match(req)),
    );
    return;
  }

  // Cache-first for hashed, immutable bundles
  if (url.pathname.startsWith('/assets/')) {
    event.respondWith(
      caches.match(req).then(
        (cached) =>
          cached ||
          fetch(req).then((res) => {
            if (!res.ok) return res;
            const copy = res.clone();
            caches.open(STATIC_CACHE).then((c) => c.put(req, copy)).catch(() => {});
            return res;
          }),
      ),
    );
    return;
  }

  // Network-first for HTML routes — SPA updates land immediately
  if (req.mode === 'navigate' || req.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(req);
          const copy = fresh.clone();
          caches.open(RUNTIME_CACHE).then((c) => c.put(req, copy)).catch(() => {});
          return fresh;
        } catch {
          const cached = await caches.match(req);
          if (cached) return cached;
          const offline = await caches.match('/offline.html');
          return (
            offline ||
            new Response('You are offline.', {
              status: 503,
              headers: { 'Content-Type': 'text/plain' },
            })
          );
        }
      })(),
    );
    return;
  }

  // Default: cache-first for anything else (images, fonts, manifests)
  event.respondWith(
    caches.match(req).then(
      (cached) =>
        cached ||
        fetch(req).then((res) => {
          if (!res.ok) return res;
          const copy = res.clone();
          caches.open(RUNTIME_CACHE).then((c) => c.put(req, copy)).catch(() => {});
          return res;
        }),
    ),
  );
});

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});

/**
 * Periodic background sync stub — refreshes the gallery manifest in the
 * background so the next visit is instant. Requires user permission grant
 * via `navigator.permissions.query({ name: 'periodic-background-sync' })`
 * and registration: `registration.periodicSync.register('refresh-content', { minInterval: 24 * 60 * 60 * 1000 })`.
 */
self.addEventListener('periodicsync', (event) => {
  if (event.tag !== 'refresh-content') return;
  event.waitUntil(
    (async () => {
      try {
        const res = await fetch('/applied-manifest.json', { cache: 'no-cache' });
        if (!res.ok) return;
        const cache = await caches.open(RUNTIME_CACHE);
        await cache.put('/applied-manifest.json', res.clone());
      } catch {
        /* offline — try again next interval */
      }
    })(),
  );
});
