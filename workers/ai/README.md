# AnonScore AI worker

The Cloudflare Worker behind the optional **Privacy Assistant**. It's a thin,
stateless proxy to the Anthropic API — open source so the privacy claims the
consent gate makes about it are **verifiable**, not just asserted.

It is published for the same reason the [relay](../relay/) is: a tool whose
whole pitch is "verify, don't trust" shouldn't ask you to trust an unpublished
server. This is the exact code deployed at
`anonscore-ai.netassetpremium.workers.dev`.

## What it receives — and what it doesn't

The browser sends exactly `{ messages, systemPrompt }` (see `buildAiContext` in
`anonscore.jsx`, and the exact text is shown to you in the consent gate before
anything leaves your browser):

- **`systemPrompt`** — your privacy score, the issue names + their plain-English
  descriptions, and the ranked recommendations. For public/institutional wallets
  (Case Files) it also includes public on-chain transaction/UTXO *summaries* —
  data anyone can already read off the chain.
- **`messages`** — the questions you type into the chat.

**Your scanned address is never in either.** The client never puts it in the
payload, and the system prompt itself instructs the model never to reproduce or
reference full Bitcoin addresses.

## What it stores — and what it logs

- **Storage:** a single rate-limit counter in KV, keyed by
  `rl:<hashed-ip>:<date>`, holding only an integer, with a **24-hour TTL**. The
  IP is SHA-256'd and truncated to 8 bytes (`hashIp()`) — never stored raw,
  never linked to your address (which the worker never sees anyway). That's the
  "anonymous 24h counter against a hashed version of your IP" the consent gate
  describes. Limit: **5 requests per hashed-IP per day** (`RATE_LIMIT`).
- **Logging:** the worker calls `console.error`/`console.warn` only on *errors*
  (KV failures, Anthropic upstream errors) and logs only status codes and error
  metadata — **never** your `systemPrompt` or messages. With
  `[observability] enabled = false` (see `wrangler.toml`) even that isn't
  retained.
- **Training:** the upstream is Anthropic's commercial API, which does not train
  on API data — Anthropic's stated policy, not something this worker can enforce.

## Input hardening

- POST only; strict CORS to `anonscore.com` / `www.anonscore.com`.
- Message count (`MAX_MESSAGES=10`), system-prompt length (`MAX_SYSTEM_PROMPT=8000`),
  and per-message length (`MAX_USER_MSG=800`) are all capped; message roles are
  validated to `user`/`assistant`.

## Known limitation (operator note)

A request with **no `Origin` header** (e.g. a direct `curl`) is allowed through
for debugging — only *mismatched* origins are blocked. That means the worker can
be used as a rate-limited (5/day/IP) Anthropic proxy by a script that omits the
Origin header. Impact is bounded to API cost, capped per hashed IP. If that
matters to you, drop the empty-origin allowance (require `ALLOWED_ORIGINS.has(origin)`)
and redeploy. This is a deliberate, disclosed trade-off, not a user-privacy
issue — no user data is exposed either way.

## Deploy

```bash
cd workers/ai
wrangler kv namespace create KV          # then put the id in wrangler.toml
wrangler secret put ANTHROPIC_API_KEY    # your Anthropic key — never committed
wrangler deploy
```

Redeploying under a different name means updating `WORKER_URL` in `anonscore.jsx`
and the `connect-src` entry in `_headers`, then rebuilding (`npm run build`).
