/*
 * AnonScore privacy relay — Cloudflare Worker
 * ===========================================
 *
 * Why this exists
 * ---------------
 * When AnonScore scans an address, the browser normally calls a public block
 * explorer (blockstream.info / mempool.space) DIRECTLY. That explorer then sees
 * the visitor's IP address next to the exact Bitcoin address they're curious
 * about — the very IP↔address link AnonScore warns users about.
 *
 * This relay breaks that link. The browser calls the relay instead; the relay
 * fetches from the explorer server-side, so the explorer sees Cloudflare's IP,
 * not the visitor's. The address still reaches the explorer (it has to, to read
 * the chain) — but it's no longer tied to the visitor's IP.
 *
 * No logging — and why you can trust that
 * ---------------------------------------
 * This Worker records nothing: not addresses, not IPs, not queries. It holds no
 * state — no KV, no D1, no bindings (see wrangler.toml). It never forwards the
 * caller's IP to the upstream (it builds a fresh request with only Accept +
 * User-Agent). It is open source precisely so the no-log claim is verifiable by
 * reading it — that's the whole point of a *privacy* relay.
 *
 * Operational note for whoever deploys this: the code logs nothing, but keep the
 * guarantee end-to-end by NOT enabling Logpush or Workers Trace Events on this
 * Worker (those would capture request URLs, which contain addresses). A stateless
 * Worker with no observability attached is the honest configuration.
 *
 * SSRF safety
 * -----------
 * The relay can reach ONLY the exact endpoint shapes AnonScore uses, enforced by
 * a strict path allowlist below. It is not a general-purpose proxy: anything not
 * matching an allowed pattern returns 404, so it can't be abused to fetch
 * arbitrary URLs.
 */

const UPSTREAM = {
  btc: "https://blockstream.info/api",
  ln: "https://mempool.space/api/v1/lightning",
};

// The ONLY path shapes AnonScore requests. Address/pubkey charsets are bounded
// and length-capped so this can't be coerced into fetching anything else.
const ALLOW = [
  /^\/btc\/address\/[a-zA-Z0-9]{10,120}$/,          // address summary
  /^\/btc\/address\/[a-zA-Z0-9]{10,120}\/utxo$/,    // UTXO set
  /^\/btc\/address\/[a-zA-Z0-9]{10,120}\/txs$/,     // recent transactions
  /^\/ln\/nodes\/[0-9a-fA-F]{66}$/,                 // LN node
  /^\/ln\/nodes\/[0-9a-fA-F]{66}\/channels$/,       // LN node channels
];

const CORS = {
  // Static, credential-less GETs from a public site — a permissive origin is
  // safe here (there's no cookie/session for another site to ride on).
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "86400",
};

const json = (obj, status) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: { ...CORS, "Content-Type": "application/json", "Cache-Control": "no-store" },
  });

export default {
  async fetch(request) {
    if (request.method === "OPTIONS") return new Response(null, { headers: CORS });
    if (request.method !== "GET") return json({ error: "method not allowed" }, 405);

    const url = new URL(request.url);
    const path = url.pathname;

    if (!ALLOW.some((re) => re.test(path))) return json({ error: "not found" }, 404);

    const seg = path.split("/");           // ["", "btc"|"ln", ...rest]
    const kind = seg[1];
    const rest = "/" + seg.slice(2).join("/");

    // Only the channels endpoint takes a query param, and only ?status=open.
    // Everything else is dropped so no arbitrary query can be smuggled upstream.
    const safeQs =
      path.endsWith("/channels") && url.searchParams.get("status") === "open"
        ? "?status=open"
        : "";

    const target = UPSTREAM[kind] + rest + safeQs;

    let upstream;
    try {
      // Fresh request: we forward NONE of the caller's headers (no IP, no
      // cookies, no fingerprint) — only what the explorer needs.
      upstream = await fetch(target, {
        method: "GET",
        headers: { Accept: "application/json", "User-Agent": "anonscore-relay" },
        cf: { cacheEverything: false, cacheTtl: 0 },
      });
    } catch {
      return json({ error: "upstream unreachable" }, 502);
    }

    // Pass through status + body; strip upstream headers that could set cookies
    // or otherwise track. Only content-type is preserved.
    const body = await upstream.arrayBuffer();
    return new Response(body, {
      status: upstream.status,
      headers: {
        ...CORS,
        "Content-Type": upstream.headers.get("Content-Type") || "application/json",
        "Cache-Control": "no-store",
      },
    });
  },
};
