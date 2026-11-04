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
 * calls (blockstream.info, mempool.space, the relay) go straight to the
 * network. A same-origin URL may carry ?scan=<address>. The worker sees that
 * URL in memory for the request, then drops the query before any network
 * fetch or cache write, so the address is not sent to the host and is not
 * stored. The first load, before this worker controls the page, still
 * requests the original URL — that one is the browser's, not this file's.
 */
// v4: latin font files joined the precache (offline paint), and query
// strings are neither stored nor forwarded. The bump also drops any
// address-bearing entries an older cache may still hold.
const CACHE = "anonscore-v4";
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
  "/vendor/fonts/6NU78FyLNQOQZAnv9bYEvDiIdE9Ea92uemAk_WBq8U_9v0c2Wa0KxC9TeA.woff2",
  "/vendor/fonts/tDbv2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKwBNntkaToggR7BYRbKPxDcwg.woff2",
  "/vendor/fonts/QGYvz_MVcBeNP4NJtEtq.woff2",
  "/vendor/fonts/RrQQboN_4yJ0JmiMe2LE0Q.woff2",
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

  // Drop the query before matching, fetching, or storing. /?scan=<address>
  // and /?page=… are the same shell; forwarding the original request would
  // hand the address to the host on every return visit. A string (not a
  // Request) so the cache write is not a second use of a consumed body.
  const bareUrl = url.origin + url.pathname;
  // Stale-while-revalidate: serve cache immediately if present, and in the
  // background fetch a fresh copy to update the cache for next time. Falls back
  // to network when there's no cache hit, and to the SPA shell when offline.
  e.respondWith(
    caches.match(bareUrl).then((hit) => {
      const network = fetch(bareUrl).then(async (res) => {
        if (res && res.ok && res.type === "basic") {
          const clone = res.clone();
          await caches.open(CACHE).then((c) => c.put(bareUrl, clone));
        }
        return res;
      }).catch(() =>
        // Network failure + nothing cached → for navigation requests, fall back to /index.html (SPA shell).
        req.mode === "navigate" ? caches.match("/index.html") : Response.error()
      );
      // Keep the worker alive until the background revalidation finishes —
      // without this, responding from cache lets the browser kill the worker
      // before the fresh copy lands, making revalidation unreliable.
      e.waitUntil(network.then(() => {}, () => {}));
      // Serve cache immediately if we have it; otherwise wait on the network.
      return hit || network;
    })
  );
});
