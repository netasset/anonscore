# AnonScore privacy relay

A tiny, stateless Cloudflare Worker that proxies the exact public block-explorer
endpoints AnonScore reads, so the explorer sees Cloudflare's IP instead of the
visitor's. It breaks the IP↔address link that a direct browser query creates.

It's **on by default** in the app (a one-click toggle switches to direct queries,
and an explicit choice is remembered) and **open source** so its no-log claim is
verifiable — that's the point of a privacy relay.

## What it does / doesn't do

- **Does:** forward the specific GET endpoints AnonScore reads (BTC address
  summary / UTXOs / txs — via blockstream.info at `/btc/…` or mempool.space at
  `/btcm/…`, matching the site's explorer picker — plus LN node / channels),
  server-side.
- **Doesn't:** log anything, hold any state, forward your IP or headers upstream,
  or proxy anything outside its strict allowlist (SSRF-safe — see `worker.js`).

The address itself still reaches the explorer (it must, to read the chain). What
changes is that it's no longer tied to the visitor's IP. That tradeoff — hide
your IP from the explorer, in exchange for the request passing through this
relay — is stated plainly in the app's toggle.

## Deploy (one command)

```bash
npm i -g wrangler        # if you don't have it
cd workers/relay
wrangler deploy          # deploys to https://anonscore-relay.<your-subdomain>.workers.dev
```

The relay is **live and wired in**: `RELAY_URL` in `anonscore.jsx` and the
`connect-src` allowlist in `_headers` both point at
`https://anonscore-relay.netassetpremium.workers.dev`. Redeploying under a
different name means updating those two spots and rebuilding (`npm run build`).

When a lookup through the relay fails, the scan fails honestly ("couldn't
complete", with a hint to switch the relay off) rather than silently falling
back to a direct query — we never leak the IP the relay exists to hide.

## Keeping the no-log guarantee end-to-end

The Worker code logs nothing, but the guarantee is only as good as the platform
config around it. To keep it honest:

- **Do not** enable Logpush or Workers Trace Events on this Worker — those would
  capture request URLs, which contain addresses.
- Leave it stateless — don't add KV/D1/analytics bindings.
- The default Cloudflare Workers configuration (no observability attached) is the
  correct one here.

## Verify it yourself

```bash
# Allowed — returns the same JSON blockstream would:
curl https://anonscore-relay.<subdomain>.workers.dev/btc/address/1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa

# Blocked — anything off the allowlist is 404, so it can't be used as an open proxy:
curl -i https://anonscore-relay.<subdomain>.workers.dev/anything/else
```
