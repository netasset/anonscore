/* AnonScore service worker — precaches all static assets so the app works
 * fully offline once visited. Tiny, no dependencies. The cache key is
 * injected at build time so a new deploy busts the old cache.
 *
 * Privacy stance: only same-origin GETs are intercepted. Cross-origin API
 * calls (blockstream.info, mempool.space) go straight to the network — the
 * service worker never sees user addresses.
 */
const CACHE = "anonscore-38264fa2e742";
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

  // Cache-first, then network, then opportunistic backfill.
  e.respondWith(
    caches.match(req).then((hit) => {
      if (hit) return hit;
      return fetch(req).then((res) => {
        if (res && res.ok && res.type === "basic") {
          const clone = res.clone();
          caches.open(CACHE).then((c) => c.put(req, clone));
        }
        return res;
      }).catch(() =>
        // Network failure + nothing cached → for navigation requests, fall back to /index.html (SPA shell).
        req.mode === "navigate" ? caches.match("/index.html") : Response.error()
      );
    })
  );
});
