# AnonScore AI worker

The Cloudflare Worker behind the optional **Privacy Assistant**. It's a thin
proxy to the Anthropic API — open source so the privacy claims the consent
gate makes about it are **verifiable**, not just asserted.

It is published for the same reason the [relay](../relay/) is: a tool whose
whole pitch is "verify, don't trust" shouldn't ask you to trust an unpublished
server. This is the exact code deployed at
`anonscore-ai.netassetpremium.workers.dev`.

## What it receives — and what it doesn't

The browser sends `{ messages, context }` (see `buildAiContext` in
`anonscore.jsx`). The consent gate shows that context before anything leaves
the browser. The **system prompt is built here**, in `buildSystemPrompt()`.
A body that includes `systemPrompt` or `system` is rejected with 400 — the
worker will not forward a client-written instruction prompt.

`context` is structured analysis data, length-capped field by field:

- **score, grade, issues, recommendations** — the privacy score, the issue
  names + their plain-English descriptions, and the ranked recommendations.
- **For public/institutional wallets** (Case Files), `transactions` and
  `utxos`: public on-chain summaries anyone can already read off the chain.
- **`messages`** — the questions you type into the chat.

**Your scanned address is never in either.** The client never puts it in the
payload, and the system prompt itself instructs the model never to reproduce or
reference full Bitcoin addresses.

## What it stores — and what it logs

- **Storage:** a single rate-limit counter in KV, keyed by
  `rl:<hmac-ip>:<date>`, holding only an integer, with a **24-hour TTL**. The
  IP is an HMAC-SHA256 keyed with the `IP_HASH_SALT` secret and truncated to
  16 bytes (`hashIp()`) — never stored raw, never linked to your address
  (which the worker never sees anyway). That's the "anonymous 24h counter
  against a hashed version of your IP" the consent gate describes. Limit:
  **5 requests per hashed-IP per day** (`RATE_LIMIT`).
- **Logging:** the worker calls `console.error` only on *errors* (missing
  rate-limit config, KV failures, Anthropic upstream errors) and logs only
  status codes and error metadata — **never** the prompt or messages. With
  `[observability] enabled = false` (see `wrangler.toml`) even that isn't
  retained.
- **Training:** the upstream is Anthropic's commercial API, which does not train
  on API data — Anthropic's stated policy, not something this worker can enforce.

## Input hardening

- POST only. `Origin` must be `https://anonscore.com` or
  `https://www.anonscore.com`. A missing or other Origin is **403**.
  (`DEBUG_ALLOW_NO_ORIGIN=1` bypasses that check for local curl testing; it
  does not bypass the rate limit.)
- Client-supplied system prompts are rejected.
- Message count (`MAX_MESSAGES=10`) and per-message length (`MAX_USER_MSG=800`)
  are capped; message roles are validated to `user`/`assistant`. The body
  itself is capped at 32 KB.
- **Rate limiting fails closed.** If the `KV` binding is missing, or
  `IP_HASH_SALT` is missing or shorter than 16 characters, or KV throws, the
  worker returns **503** and does not call Anthropic. It does not skip the cap.

## Deploy

KV and both secrets are required. The `id` in `wrangler.toml` ships as the
placeholder `<your-kv-namespace-id>` — replace it with a real namespace id
before deploying. A deploy that leaves the placeholder, or that forgets
`IP_HASH_SALT`, will not serve traffic: the worker refuses requests when the
binding or the salt is missing.

```bash
cd workers/ai
wrangler kv namespace create KV          # REQUIRED — copy the printed id into wrangler.toml
                                         # over the "<your-kv-namespace-id>" placeholder
wrangler secret put ANTHROPIC_API_KEY    # REQUIRED — your Anthropic key, never committed
wrangler secret put IP_HASH_SALT         # REQUIRED — long random string (>= 16 chars),
                                         # the HMAC key for the daily IP counter
wrangler deploy
```

Deploy the worker **before or with** the site that sends `{ messages, context }`.
An older worker still expects a client `systemPrompt` and will 400 the new
payload; the new worker 400s a client `systemPrompt`.

Redeploying under a different name means updating `WORKER_URL` in `anonscore.jsx`
and the `connect-src` entry in `_headers`, then rebuilding (`npm run build`).
