# AnonScore — Strategy & Roadmap

> Durable copy of the product strategy. (An earlier version lived in an
> ephemeral plans dir and was lost on a container reset — hence this file.
> Keep it in the repo so it survives.)

## Mission

Evolve AnonScore from a one-shot tool (paste → score → leave) into a sustained
relationship that actually helps people *fix* their privacy — especially those
for whom the gap is life-altering. Free core, forever. No tracking, no data
sale, no ads. Monetization must be compatible with that ethos.

## Who we're for (personas, by how much their life can change)

1. **Dissident / journalist** — sloppy BTC privacy can mean prison. Can't pay; funded by grants.
2. **Capital-controls escapee** (AR, VE, TR, NG, RU) — needs migration help. One-time $20–50.
3. **Privacy-conscious hodler** (US/EU, 6–7 figures) — subscribes $10–15/mo for real value.
4. **Plebs node operator** — node leaks; subscribes ~$5/mo for hardening guidance.
5. **Wallet company** — wants to differentiate on privacy; pays $5–25K per audit.

Personas 1–2 are the "change lives" core; 3–5 fund their access.

## Four pillars (status as of PR #17)

### Pillar 1 — Close the loop
- **Privacy Coach** — paid AI tier (unlimited msgs, persistent passphrase-encrypted memory, multi-device). `$10/mo`. **Waitlist SHIPPED** (`/?page=coach`); the product itself is **NOT built** — gated on validation (see below).
- **Continuous monitoring** (opt-in ~$3/mo, alert on new on-chain risks) — *not started* (needs a Worker + KV backend).
- **Migration concierge** ($99–299, human-assisted) — *not started* (needs operator to do the work).

### Pillar 2 — Make recommendations fundable ✅ largely shipped
- Affiliate scaffolding: `TOOL_URL` + `TOOL_AFFILIATE_URL` maps; links auto-tag "affiliate" + a self-updating **funding disclosure** modal ("How we're paid for"). **SHIPPED.**
- **Wallet directory** (`/?page=wallets`) — 25 curated reviews w/ honest watch-outs, SEO page. **SHIPPED.**
- *To do:* actually sign up for affiliate programs and populate `TOOL_AFFILIATE_URL`.

### Pillar 3 — Content / audience flywheel ◑ partial
- **Newsletter** signup ("On-Chain Forensics") — form **SHIPPED** (needs provider URL).
- **i18n + Spanish** (landing + scanning) — **SHIPPED** (needs native-speaker pass before promoting; dashboard/case-files still fall back to English).
- **Case-file expansion** — 6 case files exist; goal ~100 over time. *Ongoing content work.*
- **Translations** RU/ZH/AR/TR/FA — *not started* (infra is ready; just add to `STRINGS`).

### Pillar 4 — Productize methodology (B2B) — not started
- **Wallet Privacy Certification** ($5–25K/audit, published with permission).
- **Bitcoin Privacy Index** (quarterly public grading of top wallets/exchanges).

## Revolutionary bets (longer-term)
Pre-coercion architecture wizard (duress/decoy wallets) · Heirs plan (privacy-preserving succession) · "AnonScore Inside" embeddable SDK for wallet onboarding.

## Monetization, ranked (mission-fit × speed-to-revenue)
1. Affiliate links on wallet recs — aligned, modest, ready now (just sign up).
2. Lightning / Nostr tip jar — aligned, tiny, ready now (just set addresses).
3. Privacy Coach subscription — aligned, mid/high, ~3–4 wks to build (validate first).
4. Continuous monitoring — mostly aligned, mid, needs backend.
5. Newsletter (free + $5/mo) — aligned, low but builds audience.
6. Migration concierge — aligned, mid, manual ops.
7. Wallet certifications — ok, high, needs credibility first.
8. Privacy Index licensing — aligned, mid-high, 6–12 mo.
9. Grants (HRF, Open Sats, Spiral) — aligned, $25–200K/yr, non-dilutive.

**Ruled out** (incompatible with ethos): advertising, data sale, tracking pixels, walling any *current* free feature behind an account/email.

## Decisions locked
- **Pillar order**: affiliate + tip jar → newsletter → Coach (the compounding path).
- **OSS posture**: free tier (audit + 5-msg AI cap) stays **MIT**. Paid features (Coach memory layer, monitoring backend, certification methodology) are closed-source.

## Decisions still open (operator's call, before the relevant build)
- **Brand**: AnonScore-the-tool vs AnonScore-by-OPNorange vs separate paid-product name.
- **Revenue rails**: default recommendation = **both** Lightning + Stripe, Lightning as headline.
- **Concierge ops**: willing to be the human for the first ~10–20 customers? If not, defer.
- **Coach server-side data**: default = passphrase-encrypted blobs only (server can't read); or local-only (kills cross-device).

## Validation gates (cheap signals before expensive builds)
- **Coach**: ship the waitlist (done), then build the product **only if ≥5% of homepage visitors join the waitlist** over ~4 weeks. The denominator is measurable via Cloudflare's cookieless Web Analytics; the numerator via the email provider.
- **Newsletter**: if first 4 issues open <40%, reposition before investing more.
- **Affiliate**: get a real monthly-revenue baseline before betting weeks on paid products.

## Operator setup checklist (highest-leverage, all non-code)
Fill these placeholders in `anonscore.jsx` (search the `FUNDING`, `NEWSLETTER`, `COACH`, `TOOL_AFFILIATE_URL` constants near the top):
1. `FUNDING.lightning` / `FUNDING.nostr` → lights up the footer tip jar.
2. `NEWSLETTER.endpoint` + `COACH.endpoint` → a provider URL (Buttondown recommended; one provider can host both lists).
3. `TOOL_AFFILIATE_URL[name]` → add referral URLs as programs are approved (Trezor, Foundation, Phoenix, BitBox, Umbrel/Start9 are good starts). Links auto-tag + the disclosure auto-updates.
4. Share `anonscore.com/?page=coach`, `/?page=wallets`, and `/?lang=es` to start feeding the validation gates.

## Near-term code follow-ups (queued, not blocking)
- Visual pass 2: case-index card glyphs, methodology severity icons, "by the numbers" mini-rings, subtle section textures (the `HeuristicIcon` / `CaseHero` SVG system is the pattern to extend).
- Lighthouse CI in the test workflow (perf/SEO/PWA budgets).
- Native-speaker Spanish review before promoting `?lang=es`.
- `og.png` optimization (~171KB → ~30KB).
