/* Registers the AnonScore service worker for offline support + instant repeat
 * visits. Same-origin only; cross-origin API calls are never intercepted.
 *
 * Kept as a separate same-origin file (not an inline <script>) so the strict
 * CSP — script-src 'self', no 'unsafe-inline' — applies with no exceptions.
 * An inline script here would be blocked by that CSP in production. */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  });
}
