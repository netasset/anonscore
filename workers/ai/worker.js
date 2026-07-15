/**
 * AnonScore AI Worker — v2
 * Fixes v1: CORS accepts both anonscore.com and www.anonscore.com
 *           KV gracefully skips rate limiting if binding missing/misconfigured
 *           Better error logging
 */

const ALLOWED_ORIGINS = new Set([
  "https://anonscore.com",
  "https://www.anonscore.com",
]);

const MAX_MESSAGES      = 10;
const MAX_SYSTEM_PROMPT = 8000;
const MAX_USER_MSG      = 800;
const RATE_LIMIT        = 5;

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405, headers: corsHeaders(origin) });
    }

    // Require a matching Origin. The browser always sends Origin on the
    // cross-origin POST the app makes, so this never blocks real app traffic; a
    // MISSING Origin means a direct non-browser call (curl), which we now reject
    // so the endpoint can't be driven as a free Claude proxy on the operator's
    // credits. Set env.DEBUG_ALLOW_NO_ORIGIN=1 to bypass for local testing.
    if (!env.DEBUG_ALLOW_NO_ORIGIN && (!origin || !ALLOWED_ORIGINS.has(origin))) {
      return new Response("Forbidden", { status: 403 });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: "Invalid JSON" }, 400, origin);
    }

    const { messages, systemPrompt } = body;

    if (!Array.isArray(messages) || messages.length === 0 || messages.length > MAX_MESSAGES) {
      return json({ error: "Invalid messages" }, 400, origin);
    }
    if (typeof systemPrompt !== "string" || systemPrompt.length > MAX_SYSTEM_PROMPT) {
      return json({ error: "Invalid systemPrompt" }, 400, origin);
    }

    const sanitised = [];
    for (const m of messages) {
      if (!m || typeof m.content !== "string" || !["user", "assistant"].includes(m.role)) {
        return json({ error: "Invalid message shape" }, 400, origin);
      }
      sanitised.push({ role: m.role, content: m.content.slice(0, MAX_USER_MSG) });
    }

    // Rate limit — skip gracefully if KV not bound or misconfigured
    if (env.KV) {
      try {
        const ip = request.headers.get("CF-Connecting-IP") || "unknown";
        const dayKey = `rl:${await hashIp(ip)}:${new Date().toISOString().slice(0, 10)}`;
        const count = parseInt((await env.KV.get(dayKey)) || "0");
        if (count >= RATE_LIMIT) {
          return json({ error: "rate_limited" }, 429, origin);
        }
        await env.KV.put(dayKey, String(count + 1), { expirationTtl: 86400 });
      } catch (e) {
        console.error("KV error (rate limiting skipped):", e.message);
      }
    } else {
      console.warn("KV binding not configured — rate limiting disabled");
    }

    // Call Anthropic
    let anthropicRes;
    try {
      anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 600,
          system: systemPrompt,
          messages: sanitised,
        }),
      });
    } catch (e) {
      console.error("Anthropic fetch failed:", e.message);
      return json({ error: "Upstream fetch failed" }, 502, origin);
    }

    if (!anthropicRes.ok) {
      const errText = await anthropicRes.text().catch(() => "");
      console.error("Anthropic error:", anthropicRes.status, errText.slice(0, 200));
      return json({ error: "Upstream error" }, 502, origin);
    }

    const data = await anthropicRes.json();
    const reply = data.content?.[0]?.text || "Sorry, no response.";
    return json({ reply }, 200, origin);
  },
};

function corsHeaders(origin) {
  const allow = ALLOWED_ORIGINS.has(origin) ? origin : "https://anonscore.com";
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
}

function json(body, status, origin) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
  });
}

async function hashIp(ip) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(ip));
  return Array.from(new Uint8Array(buf)).slice(0, 8).map(b => b.toString(16).padStart(2, "0")).join("");
}
