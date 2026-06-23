# AnonScore

**Free, client-side Bitcoin & Lightning privacy audit.** Paste a wallet address or Lightning node pubkey, get a privacy score (0–100), see every issue explained in plain English, and get a ranked fix plan. Nothing is stored. No accounts. No tracking.

Live: <https://anonscore.com>

[![License: MIT](https://img.shields.io/badge/License-MIT-cyan.svg)](LICENSE)

---

## What it does

- **10 Bitcoin heuristics**: address reuse, dust attacks, round amounts, CoinJoin usage, unsafe consolidation, UTXO count, fee fingerprinting, change address reuse, balance concentration, script-type mixing.
- **8 Lightning heuristics**: KYC peers, channel diversity, Tor/IP exposure, alias privacy, capacity concentration, peer analysis, node age, fee fingerprinting.
- **Plain-English mode**: every check rephrased for non-technical users.
- **AI Privacy Assistant** (optional, consent-gated): personalized guidance for *your* specific issues. Only the score + issue names are sent. Never the address.
- **Case Files**: forensic narratives of notable Bitcoin wallets (Bitfinex, Binance, Silk Road, etc.).
- **PWA**: works fully offline after first visit. Installable to home screen.

---

## Architecture

Single static site. No backend, no database, no analytics.

| File | Role |
|---|---|
| `anonscore.jsx` | **Source of truth.** ~4,100 lines of React with inline styles. Edit this. |
| `anonscore.js` | **Auto-generated** from `anonscore.jsx` (classic React runtime, no in-browser Babel). |
| `index.html` | Static shell: pre-rendered hero (instant paint), defer-loaded scripts, manifest + favicon + JSON-LD. |
| `sw.js` | Service worker. Precaches everything for offline. Cache key auto-stamped by build. |
| `manifest.webmanifest` | PWA manifest — makes the site installable. |
| `vendor/` | Self-hosted React, ReactDOM, canvas-confetti, dom-to-image-more, and Google Fonts. **Zero third-party requests at runtime.** |
| `_headers` | Cloudflare security headers + strict CSP (`script-src 'self'`) + cache rules. |
| `build.mjs` | One-shot compiler: `anonscore.jsx → anonscore.js`, plus stamps the SW cache hash. |
| `scripts/test.mjs` | End-to-end test suite (23 checks). Runs in CI on every PR. |
| `scripts/fetch-fonts.mjs` | Re-fetches the self-hosted Google Fonts subset. Run only if updating font weights. |
| `.github/workflows/` | `build.yml` auto-rebuilds `anonscore.js` on feature-branch pushes. `test.yml` runs the test suite on every PR. |

## Build & test

```bash
npm install        # once
npm run build      # compiles anonscore.jsx → anonscore.js + stamps sw.js
npm test           # full E2E (build invariants + smoke + a11y in headless Chromium)
```

Then open `index.html` via any static server (e.g. `python3 -m http.server`).

CI auto-rebuilds `anonscore.js` on feature-branch pushes, so PRs into `main` always carry a fresh build. Still run `npm run build` locally before committing so what you push is correct.

---

## Operator setup checklist

Things you (the operator) need to fill in to activate features. All configuration lives in clearly labelled constants near the top of `anonscore.jsx`. Search for `FUNDING`, `TOOL_AFFILIATE_URL`, `NEWSLETTER`.

### 1. Tip jar (Lightning + Nostr)

```js
const FUNDING = {
  lightning: "",  // ← your Lightning address, e.g. "you@getalby.com"
  nostr:     "",  // ← your Nostr npub, e.g. "npub1..."
};
```

When set, a subtle "⚡ Tip" and "Zap on Nostr" pair render in the footer. Click-to-copy. Empty values hide the tip jar.

### 2. Affiliate links

Recommendations in the Fix It tab already link to each tool's canonical homepage (no kickback). When you sign up for an affiliate program, add the referral URL to `TOOL_AFFILIATE_URL`:

```js
const TOOL_AFFILIATE_URL = {
  "Phoenix Wallet": "https://phoenix.acinq.co?ref=anonscore",
  // ...
};
```

The link gets auto-tagged "↗ affiliate" and the disclosure modal (footer → "How we're paid for") auto-updates from this map. There's no separate page to keep in sync.

Programs worth applying to (none signed up yet — research first):
- **Hardware wallets**: Trezor, Ledger, Foundation (Passport), Coldcard, BitBox
- **Software wallets**: BTCPay merchants (Wasabi, Sparrow are no-affiliate / community)
- **Lightning**: Phoenix (Acinq), Voltage
- **Nodes**: Umbrel, Start9
- **No-KYC P2P**: Robosats, AgoraDesk, Bisq

### 3. Newsletter (On-Chain Forensics)

```js
const NEWSLETTER = {
  endpoint: "",                                  // ← your Buttondown / Beehiiv / Substack / Mailerlite URL
  fallbackMailto: "netassetpremium@gmail.com",   // current fallback
  name: "On-Chain Forensics",
  pitch: "Weekly deep-dives on notable wallets, privacy heuristics, and seizure stories.",
};
```

Until `endpoint` is set, the signup form opens a `mailto:` link instead. Set up a real provider when you're ready to send issues.

Recommended provider order: **Buttondown** (privacy-first, $9/mo, RSS for paid tier) > Beehiiv (free tier, growth tools) > Substack (largest network, takes 10%).

### 4. AI Assistant (already configured)

The AI worker URL (`anonscore-ai.netassetpremium.workers.dev`) is wired in. The 5-message daily cap is enforced server-side. To upgrade to a paid Coach tier later, see the strategy doc.

---

## Privacy stance (what makes this site different)

- **Zero third-party requests at runtime.** Every script, font, and asset is self-hosted under `/vendor/`. The only outbound calls are: the public blockchain APIs (blockstream.info, mempool.space) for the address you paste, and the AI worker if you opt in.
- **No cookies, no localStorage tracking, no analytics.** localStorage is used only for: scan history (last 5 addresses, user-deletable), dismissed fix items per-address, and a "have you visited before" flag for the auto-demo.
- **Strict CSP**: `script-src 'self'`. No inline scripts. No eval.
- **Tor compatible**: no fingerprinting, no canvas tricks, no third-party requests.
- **Open source under MIT.** The full audit logic is in `anonscore.jsx`, plain JavaScript. Verifiable in minutes.

---

## Contributing

Two paths:

**Bug or small fix**: open a PR against `main`. CI runs the 23-check test suite automatically; it will reject regressions in performance, accessibility, third-party requests, or feature flow.

**Larger change**: open an issue first to discuss. The repo guide (`CLAUDE.md`) and the in-flight strategy doc explain where the project is heading.

---

## License

MIT — see [LICENSE](LICENSE).

Built by [OPNorange](https://opnorange.com).
