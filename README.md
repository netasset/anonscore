# AnonScore

**Free, client-side Bitcoin & Lightning privacy audit.** Paste a wallet address or Lightning node pubkey, get a privacy score (0–100), see every issue explained in plain English, and get a ranked fix plan. Nothing is stored. No accounts. No tracking.

Live: <https://anonscore.com>

[![License: MIT](https://img.shields.io/badge/License-MIT-cyan.svg)](LICENSE)

---

## What it does

- **11 Bitcoin heuristics**: address reuse, dust attacks, round amounts, CoinJoin usage, unsafe consolidation, UTXO count, fee fingerprinting, change address reuse, balance concentration, script-type mixing, change detection (script-type mismatch).
- **8 Lightning heuristics**: public node announcement, KYC exchange peers, Tor/clearnet exposure, channel diversity, capacity concentration, alias privacy, node establishment (age), on-chain channel footprint.
- **Cluster Exposure**: computes the common-input-ownership heuristic — the workhorse of chain surveillance — client-side, and draws the cluster of other addresses the chain ties to the one you scanned. Each linked address is auditable in one click.
- **Address-poisoning alert**: flags lookalike addresses planted in your history (same first/last characters as yours) — the copy-paste scam bait — before you copy the wrong one. Deliberately not part of the privacy score: being targeted doesn't make a wallet more traceable.
- **Plain-English mode**: every check rephrased for non-technical users.
- **AI Privacy Assistant** (optional, consent-gated): personalized guidance for *your* specific issues. Your address is never sent — only your analysis results: the score, the findings (each with its plain-English explanation), and the ranked recommendations. For public/institutional wallets (Case Files, forensic mode) the payload also includes public on-chain transaction and UTXO summaries — all data anyone can already read off the chain. The **exact context** that will be sent is shown in the consent gate before anything leaves the browser. The worker builds the system prompt itself and rejects a client-supplied one; its source is open ([`workers/ai/`](workers/ai/)).
- **Case Files**: forensic narratives of notable Bitcoin wallets (Bitfinex, Binance, Silk Road, etc.).
- **PWA**: works fully offline after first visit. Installable to home screen.

---

## Architecture

Single static site. No backend, no database, no analytics.

| File | Role |
|---|---|
| `src/` | **Source of truth.** The app, split into modules that share one script scope. `build.mjs` lists the concatenation order in `MODULES`. |
| `anonscore.js` | **Auto-generated** from `src/` (classic React runtime, no in-browser Babel). |
| `index.html` | Static shell: pre-rendered hero (instant paint), defer-loaded scripts, manifest + favicon + JSON-LD. |
| `sw.js` | Service worker. Precaches for offline, serves stale-while-revalidate so returning visitors always converge on fresh code. No per-build cache key. |
| `manifest.webmanifest` | PWA manifest — makes the site installable. |
| `vendor/` | Self-hosted React, ReactDOM, canvas-confetti, dom-to-image-more, and Google Fonts. **Zero third-party requests at runtime.** |
| `_headers` | Cloudflare security headers + strict CSP (`script-src 'self'`) + cache rules. |
| `build.mjs` | One-shot compiler: concatenates `src/` in `MODULES` order, then writes `anonscore.js`. Touches nothing else. |
| `scripts/test.mjs` | End-to-end test suite (68 checks: build invariants, honesty guards that fail CI if a public claim drifts from the code, relay-worker SSRF and no-tracking unit tests, AI-worker prompt and rate-limit tests, engine unit tests against the built bundle, browser smoke + a11y). Runs in CI on every PR. |
| `scripts/fetch-fonts.mjs` | Re-fetches the self-hosted Google Fonts subset. Run only if updating font weights. |
| `.github/workflows/` | `build.yml` rebuilds `anonscore.js` when `src/` or `build.mjs` changes on a feature branch. `test.yml` runs the test suite on every PR and on `main`. `smoke-live.yml` checks the deployed relay and the live site. `deploy-workers.yml` deploys the relay and the AI worker after tests. `auto-merge.yml` merges an approved `claude/*` PR. |

## Build & test

```bash
npm install        # once
npm run build      # compiles src/ → anonscore.js
npm test           # full E2E (build invariants + smoke + a11y in headless Chromium)
npm run smoke:live # deployed relay + https://anonscore.com (not part of npm test)
```

Then open `index.html` via any static server (e.g. `python3 -m http.server`).

`npm run smoke:live` (`scripts/smoke-live.mjs`) calls the real privacy relay and the production site. It checks an address (summary, UTXO, and transactions), the genesis coinbase transaction and its outspends, `/txs/chain/<txid>` paging, the mempool.space mirror under `/btcm/`, and a Lightning node. A malformed txid must be rejected by the relay. It also checks that https://anonscore.com serves `anonscore.js` with the same hash as the committed file, and that the HTML loads no third-party scripts. Transient explorer errors are retried. A path the relay rejects, or a bundle that does not match this commit, fails the run and lists every check that failed.

GitHub Actions runs it every day, when started by hand, and after each push to `main` (that run waits briefly so the Pages deploy can finish). A successful relay deploy from `deploy-workers.yml` runs it again, in that same workflow, so the live result sits next to the deploy. It does not run inside `npm test`, which stays offline.

The built bundle exposes its pure engine functions read-only at `window.__ANONSCORE_TEST__` — open the console on the live site and test the scoring logic yourself (`runEngine`, `computeCluster`, `computePoisoning`, …). CI unit-tests the built bundle through the same hook, so what you can verify in your console is exactly what's tested.

CI auto-rebuilds `anonscore.js` on feature-branch pushes, so PRs into `main` always carry a fresh build. Still run `npm run build` locally before committing so what you push is correct.

---

## Deploying the workers

The relay (`workers/relay`) and the AI worker (`workers/ai`) deploy from [`.github/workflows/deploy-workers.yml`](.github/workflows/deploy-workers.yml). A push to `main` that changes `workers/relay/**` or `workers/ai/**` runs `npm test`, then deploys each worker whose files changed. Actions → Deploy workers → Run workflow deploys `relay`, `ai`, or `both` without waiting for a file change. Merging a pull request that does not touch those directories does not deploy; run the workflow by hand the first time.

The two deploys are separate jobs, so a failure in one stays visible. Overlapping runs queue (`cancel-in-progress: false`) instead of deploying the same Worker at the same time. The workflow token can only read the repo (`contents: read`). Deploys run only from `main`.

Nothing in the workflow uploads Worker secrets. `ANTHROPIC_API_KEY` and `IP_HASH_SALT` are set once with `wrangler secret put` and stay on the Worker across later deploys.

### One-time setup

1. **Create a Cloudflare API token.** Dashboard → My Profile → API Tokens → Create Token → Custom token.
   - Permission: **Account → Workers Scripts → Edit**.
   - Also **Account → Workers KV Storage → Edit** if you deploy the AI worker (it binds a KV namespace).
   - Account resources: only the account that owns these workers.
2. **Copy the Account ID.** Workers & Pages → the Account ID in the sidebar (32 hex characters). That is not the API token.
3. **Add two repository secrets.** GitHub → this repo → Settings → Secrets and variables → Actions → Repository secrets.
   - `CLOUDFLARE_API_TOKEN` — the token from step 1.
   - `CLOUDFLARE_ACCOUNT_ID` — the account id from step 2.

   Until those two secrets exist, the deploy job fails in **Require Cloudflare credentials** and says which one is missing (the token, the account id, or both). It does not call Wrangler.

4. **AI worker only, on your machine** (the workflow does not do this):

   ```bash
   cd workers/ai
   npx wrangler kv namespace create KV
   npx wrangler secret put ANTHROPIC_API_KEY   # Anthropic API key. Never commit it.
   npx wrangler secret put IP_HASH_SALT        # random string, 16+ characters
   ```

   Put the namespace id where the workflow can see it. Either commit it in place of `<your-kv-namespace-id>` in `workers/ai/wrangler.toml`, or leave the placeholder and set the repository **variable** `AI_KV_NAMESPACE_ID` (Settings → Secrets and variables → Actions → Variables) to that id. A repository secret of the same name works too; the value is not printed. While the placeholder is still in the file and `AI_KV_NAMESPACE_ID` is unset, the AI job logs `AI worker deploy skipped.` and finishes green. The relay job is separate.

   An `AI_KV_NAMESPACE_ID` that is set but is not 32 hex characters fails the AI job and is not logged.

The relay has no KV and no Worker secrets. After the relay deploy succeeds, the same run executes `npm run smoke:live`.

---

## Operator setup checklist

Things you (the operator) need to fill in to activate features. Configuration lives in clearly labelled constants: `FUNDING` and `NEWSLETTER` in `src/copy.jsx`, `TOOL_AFFILIATE_URL` in `src/catalog/tools.jsx`.

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

The AI worker URL (`anonscore-ai.netassetpremium.workers.dev`) is wired in. The 5-message daily cap is enforced server-side and **fails closed**: the worker refuses requests if its KV binding or the `IP_HASH_SALT` secret is missing. The worker only ever receives what the consent gate shows — never the user's address — and it writes the system prompt itself. Its full source, including the required KV namespace id and secrets, is published at [`workers/ai/`](workers/ai/). Deploy steps are in that README and under [Deploying the workers](#deploying-the-workers). The `id` in `wrangler.toml` is a placeholder until you paste a real one (or set `AI_KV_NAMESPACE_ID`). The deploy workflow skips the AI worker, and stays green, while that placeholder is still there.

### 5. Languages (i18n)

The site auto-detects the visitor's language (`?lang=` → saved choice → browser → English) and shows a switcher in the nav. English is always the fallback, so a partially-translated locale degrades gracefully — untranslated strings just render in English.

To add or extend a locale, edit the `STRINGS` map in `src/i18n.jsx`:

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
- **Open source under MIT.** The full audit logic is in `src/`, plain JavaScript. Verifiable in minutes.

---

## Security

Found a vulnerability? Please report it privately first — don't open a public issue for anything exploitable.

- **Preferred:** [open a GitHub security advisory](https://github.com/netasset/anonscore/security/advisories/new) (private, coordinated disclosure).
- **Or email:** <netassetpremium@gmail.com>.

These same contacts are published machine-readably at [`/.well-known/security.txt`](.well-known/security.txt).

**What we care about most**, given the threat model of a client-side privacy tool:

- Anything that could leak a user's address off their device — the core promise is that the address you scan never reaches the AI worker or any server. The only outbound calls are the block explorer for the address you paste (by default via our open-source no-log relay — `workers/relay/` — so the explorer can't tie the address to your IP) and, if you opt in, the AI worker (also open source — `workers/ai/`) with the exact context shown in the consent gate. The worker builds its own system prompt; a client-supplied one is rejected.
- CSP or self-hosting bypasses that would introduce a third-party runtime request.
- XSS or injection via scanned addresses, URL params, or API responses.

There's no bug-bounty budget (this is a free, open-source project), but real reports get real credit. The whole audit surface is `src/` in plain JavaScript — verifiable in minutes.

---

## Contributing

Two paths:

**Bug or small fix**: open a PR against `main`. CI runs the 68-check test suite automatically; it will reject regressions in scoring logic, accessibility, third-party requests, or feature flow.

**Larger change**: open an issue first to discuss. The repo guide (`CLAUDE.md`) covers the architecture, build pipeline, and conventions.

---

## License

MIT — see [LICENSE](LICENSE).

Built by [OPNorange](https://opnorange.com).
