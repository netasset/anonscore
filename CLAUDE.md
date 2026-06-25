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
sync with `anonscore.jsx`. Run the full suite with `npm test` (build invariants
+ headless-browser smoke + a11y; the same suite CI runs).

## Ship / pipeline (fully automated)

- **Never push to `main`** — it's branch-protected (direct push → 403). Work on a
  `claude/*` branch, open a PR.
- **Auto-merge**: `.github/workflows/auto-merge.yml` merges any `claude/*` PR once
  the **`test`** check passes (that's the only required check — `build` only runs
  when `anonscore.jsx` changes), then deletes the branch. Cloudflare Pages deploys
  from `main`. So: push branch → open PR → it merges + deploys itself, hands-free.
- Don't hand-edit `anonscore.js`; CI rebuilds it, and `npm run build` also stamps
  the `sw.js` cache hash. Commit the rebuilt `anonscore.js` so the diff is correct.

## Conventions & invariants (the test suite enforces most of these)

- **Zero third-party runtime requests.** Everything self-hosted under `vendor/`
  (incl. fonts). No CDNs. For imagery use **inline SVG**, never external/CDN
  images (CSP is `img-src 'self' data: blob:`; big rasters would also hurt FCP).
- **Strict CSP** (`script-src 'self'`, no `unsafe-eval`/`unsafe-inline`). No
  inline `<script>`, no `eval`, no in-browser Babel.
- **Styling**: inline style objects + the `T` design-token color object. Dark
  cyberpunk Bitcoin aesthetic. No CSS framework (Tailwind CDN was removed).
- **Accessibility**: keep axe critical/serious at 0 — landmarks, labels on icon
  buttons, `T.textDim`/`T.textMid` are tuned to clear WCAG AA contrast.
- **No auto-firing UX.** Nothing should scan / navigate / pop up without the user
  asking (an auto-demo was removed in PR #17 for exactly this reason).
- **PWA**: `sw.js` precaches everything for offline; cache key is build-stamped.

## Page routing (query params, parsed in `App`)

- `?scan=<addr>` — pre-fills a scan (shows a confirm prompt; never auto-fires).
- `?page=coach` — Privacy Coach waitlist · `?page=wallets` — wallet directory.
- `?case=<id|slug>` — opens a specific case file (also in `sitemap.xml`).
- `?lang=es` — Spanish. i18n via the `STRINGS` map + `t()`; English is the
  default and the fallback, so partial locales degrade gracefully.

## Strategy

Product strategy, monetization, locked/open decisions, and the operator setup
checklist live in **`ROADMAP.md`**. Read it before product/monetization work.
