/* AnonScore service worker — precaches all static assets so the app works
 * fully offline once visited. Tiny, no dependencies.
 *
 * Cache strategy: stale-while-revalidate for same-origin GETs. We serve from
 * cache instantly (fast, offline-capable) AND fetch a fresh copy in the
 * background to update the cache, so the next load is always current. Because
 * freshness comes from revalidation — not from the cache *name* — there is no
 * per-build content hash to stamp into this file. That's deliberate: a stamped
 * hash changed on every build and collided (merge conflicts) whenever two code
 * PRs were open at once. The cache key below is a plain manual version, bumped
 * only when the precache LIST changes (to force a full purge) — never per build.
 *
 * Privacy stance: only same-origin GETs are intercepted. Cross-origin API
 * calls (blockstream.info, mempool.space) go straight to the network — the
 * service worker never sees user addresses.
 */
const CACHE = "anonscore-v2";
const PRECACHE = [
  "/",
  "/index.html",
  "/anonscore.js",
  "/sw-register.js",
  "/manifest.webmanifest",
  "/vendor/react.production.min.js",
  "/vendor/react-dom.production.min.js",
  "/vendor/confetti.browser.min.js",
  "/vendor/dom-to-image-more.min.js",
  "/vendor/fonts/fonts.css",
  "/vendor/icon-192.png",
  "/vendor/icon-512.png",
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) =>
      // Don't fail install if a single asset is unavailable (e.g. fetch error
      // for a font subset the browser will never request). Best-effort.
      Promise.all(PRECACHE.map((u) => c.add(u).catch(() => null)))
    )
  );
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  // Only intercept same-origin requests — never touch API calls.
  if (url.origin !== self.location.origin) return;

  // Stale-while-revalidate: serve cache immediately if present, and in the
  // background fetch a fresh copy to update the cache for next time. Falls back
  // to network when there's no cache hit, and to the SPA shell when offline.
  e.respondWith(
    caches.match(req).then((hit) => {
      const network = fetch(req).then((res) => {
        if (res && res.ok && res.type === "basic") {
          const clone = res.clone();
          caches.open(CACHE).then((c) => c.put(req, clone));
        }
        return res;
      }).catch(() =>
        // Network failure + nothing cached → for navigation requests, fall back to /index.html (SPA shell).
        req.mode === "navigate" ? caches.match("/index.html") : Response.error()
      );
      // Serve cache immediately if we have it; the background revalidation above
      // still runs and refreshes the cache for next time. Otherwise wait on network.
      return hit || network;
    })
  );
});
