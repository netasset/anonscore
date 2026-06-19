# AnonScore — repo guide

Free, client-side Bitcoin & Lightning privacy audit. Single-page app, no backend.
Deployed on Cloudflare Pages (static hosting; see `_headers`).

## Architecture

- **`anonscore.jsx`** — the source of truth. The entire app (~4,100 lines, React,
  inline-styled). Edit this.
- **`anonscore.js`** — AUTO-GENERATED from `anonscore.jsx`. Do not edit by hand.
  This is what the browser actually loads. Plain JS (classic React runtime), so
  there is **no in-browser Babel** — the page is fast.
- **`index.html`** — loads the self-hosted vendor scripts + `anonscore.js`, all
  deferred. Fonts via a preconnected `<link>`.
- **`vendor/`** — self-hosted React, ReactDOM, canvas-confetti, dom-to-image-more.
  No third-party CDN requests at runtime (faster, more robust, better privacy).
  Versions tracked in `vendor/VERSIONS.txt`.
- **`_headers`** — Cloudflare security headers + CSP (`script-src 'self'`) + caching.

## Build (required after editing anonscore.jsx)

```
npm install      # once
npm run build    # regenerates anonscore.js from anonscore.jsx
```

A GitHub Action (`.github/workflows/build.yml`) also rebuilds and commits
`anonscore.js` automatically on feature-branch pushes, so PRs into `main`
always carry a fresh build. Still, run `npm run build` locally before
committing so what you push is correct.

## Verify before committing

Open `index.html` via any static server and confirm the app mounts with no
console errors, then run a demo scan. The compiled `anonscore.js` must be in
sync with `anonscore.jsx`.
