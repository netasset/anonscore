# AnonScore

**Free, client-side Bitcoin & Lightning privacy audit.** Paste a wallet address or Lightning node pubkey, get a privacy score (0–100), see every issue explained in plain English, and get a ranked fix plan. Nothing is stored. No accounts. No tracking.

Live: <https://anonscore.com>

[![License: MIT](https://img.shields.io/badge/License-MIT-cyan.svg)](LICENSE)

---

## What it does

- **11 Bitcoin heuristics**: address reuse, dust attacks, round amounts, CoinJoin usage, unsafe consolidation, UTXO count, fee fingerprinting, change address reuse, balance concentration, script-type mixing, change detection (script-type mismatch).
- **8 Lightning heuristics**: KYC peers, channel diversity, Tor/IP exposure, alias privacy, capacity concentration, peer analysis, node age, fee fingerprinting.
- **Plain-English mode**: every check rephrased for non-technical users.
- **AI Privacy Assistant** (optional, consent-gated): personalized guidance for *your* specific issues. Your address is never sent — only your analysis results: the score, the findings (each with its plain-English explanation), and the ranked recommendations. For public/institutional wallets (Case Files, forensic mode) the payload also includes public on-chain transaction and UTXO summaries — all data anyone can already read off the chain. A preview of exactly what will be sent is shown in the consent gate before anything leaves the browser.
- **Case Files**: forensic narratives of notable Bitcoin wallets (Bitfinex, Binance, Silk Road, etc.).
- **PWA**: works fully offline after first visit. Installable to home screen.

---

## Architecture

Single static site. No backend, no database, no analytics.

| File | Role |
|---|---|
| `anonscore.jsx` | **Source of truth.** ~6,000 lines of React with inline styles. Edit this. |
| `anonscore.js` | **Auto-generated** from `anonscore.jsx` (classic React runtime, no in-browser Babel). |
| `index.html` | Static shell: pre-rendered hero (instant paint), defer-loaded scripts, manifest + favicon + JSON-LD. |
| `sw.js` | Service worker. Precaches for offline, serves stale-while-revalidate so returning visitors always converge on fresh code. No per-build cache key. |
| `manifest.webmanifest` | PWA manifest — makes the site installable. |
| `vendor/` | Self-hosted React, ReactDOM, canvas-confetti, dom-to-image-more, and Google Fonts. **Zero third-party requests at runtime.** |
| `_headers` | Cloudflare security headers + strict CSP (`script-src 'self'`) + cache rules. |
| `build.mjs` | One-shot compiler: `anonscore.jsx → anonscore.js`. Touches nothing else. |
| `scripts/test.mjs` | End-to-end test suite (26 checks, incl. honesty guards that fail CI if a public claim drifts from the code). Runs in CI on every PR. |
| `scripts/fetch-fonts.mjs` | Re-fetches the self-hosted Google Fonts subset. Run only if updating font weights. |
| `.github/workflows/` | `build.yml` auto-rebuilds `anonscore.js` on feature-branch pushes. `test.yml` runs the test suite on every PR. |

## Build & test

```bash
npm install        # once
npm run build      # compiles anonscore.jsx → anonscore.js
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

The link gets auto-tagged "↗ affiliate" and the disclosure modal (footer → "How we're paid for") auto-updates from this map. There's no separate page to keep in sync. Until you add a URL, every recommendation links to the tool's canonical homepage with no kickback.

### 3. Newsletter (On-Chain Forensics)

```js
const NEWSLETTER = {
  endpoint: "",                                  // ← your Buttondown / Beehiiv / Substack / Mailerlite URL
  fallbackMailto: "netassetpremium@gmail.com",   // current fallback
  name: "On-Chain Forensics",
  pitch: "Weekly deep-dives on notable wallets, privacy heuristics, and seizure stories.",
};
```

Until `endpoint` is set, the signup form opens a `mailto:` link instead. Point it at whatever email provider you use once you're ready to send issues.

### 4. AI Assistant (already configured)

The AI worker URL (`anonscore-ai.netassetpremium.workers.dev`) is wired in. The 5-message daily cap is enforced server-side. The worker only ever receives what the consent gate previews — never the user's address.

### 5. Languages (i18n)

The site auto-detects the visitor's language (`?lang=` → saved choice → browser → English) and shows a switcher in the nav. English is always the fallback, so a partially-translated locale degrades gracefully — untranslated strings just render in English.

To add or extend a locale, edit the `STRINGS` map near the top of `anonscore.jsx`:

```js
const STRINGS = {
  en: { "hero.h1.em": "Find out in 60 seconds.", ... },
  es: { "hero.h1.em": "Descúbrelo en 60 segundos.", ... },
  // add e.g. pt, ru, fr here — copy the en keys, translate the values
};
```

Spanish currently covers the landing + scanning surfaces. The dashboard/case-files still fall back to English. **Before promoting a locale, get a native-speaker pass** — for a security tool, a mistranslated privacy instruction can mislead someone in a high-stakes situation.

---

## Privacy stance (what makes this site different)

- **Zero third-party requests at runtime.** Every script, font, and asset is self-hosted under `/vendor/`. The only outbound calls are: the block explorer for the address you paste (blockstream.info or mempool.space — your choice, and by default routed through our open-source no-log relay so the explorer can't see your IP; one click switches to direct queries), and the AI worker if you opt in.
- **No cookies, no localStorage tracking, no analytics.** localStorage holds exactly five things, all local to your browser and never transmitted: your language choice (`anonscore_lang`), your recent scan history (`anonscore_history_v1` — last 5 addresses, clearable from the UI), dismissed fix items per address (`anonscore_fixes_v1:<addr>`), your privacy-relay setting (`anonscore_relay`), and your block-explorer choice (`anonscore_explorer`). Nothing else — no visitor ID, no session token, no analytics beacon.
- **Strict CSP**: `script-src 'self'`. No inline scripts. No eval.
- **Tor compatible**: no fingerprinting, no canvas tricks, no third-party requests.
- **Open source under MIT.** The full audit logic is in `anonscore.jsx`, plain JavaScript. Verifiable in minutes.

---

## Security

Found a vulnerability? Please report it privately first — don't open a public issue for anything exploitable.

- **Preferred:** [open a GitHub security advisory](https://github.com/netasset/anonscore/security/advisories/new) (private, coordinated disclosure).
- **Or email:** <netassetpremium@gmail.com>.

These same contacts are published machine-readably at [`/.well-known/security.txt`](.well-known/security.txt).

**What we care about most**, given the threat model of a client-side privacy tool:

- Anything that could leak a user's address off their device — the core promise is that the address you scan never reaches the AI worker or any server. The only outbound calls are the block explorer for the address you paste (by default via our open-source no-log relay — `workers/relay/` — so the explorer can't tie the address to your IP) and, if you opt in, the AI worker with the payload previewed in the consent gate.
- CSP or self-hosting bypasses that would introduce a third-party runtime request.
- XSS or injection via scanned addresses, URL params, or API responses.

There's no bug-bounty budget (this is a free, open-source project), but real reports get real credit. The whole audit surface is `anonscore.jsx` in plain JavaScript — verifiable in minutes.

---

## Contributing

Two paths:

**Bug or small fix**: open a PR against `main`. CI runs the 23-check test suite automatically; it will reject regressions in performance, accessibility, third-party requests, or feature flow.

**Larger change**: open an issue first to discuss. The repo guide (`CLAUDE.md`) covers the architecture, build pipeline, and conventions.

---

## License

MIT — see [LICENSE](LICENSE).

Built by [OPNorange](https://opnorange.com).
