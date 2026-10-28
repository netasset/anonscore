#!/usr/bin/env node
/**
 * Live smoke against the deployed privacy relay and https://anonscore.com.
 *
 * The PR suite intercepts transaction URLs, which is how a relay allowlist
 * hole hid a production 404 for weeks. This script calls the real worker and
 * the real site. It is not part of `npm test`.
 *
 * Stable mainnet fixtures:
 *   - genesis coinbase txid (and the address it paid)
 *   - a fully-spent brainwallet address, so /utxo is a small HTTP 200
 *     (esplora answers the genesis address's UTXO route with 400
 *     "Too many unspent outputs"; that pass-through is checked too)
 *   - ACINQ's Lightning node pubkey
 *
 * Transient upstream failures (network, 408, 429, 5xx) are retried. A relay
 * rejection of an allowlisted path is a real failure and is not retried.
 * Exit code is 1 when anything failed; the failing paths are listed at the end.
 *
 * Until the relay build that allowlists /tx/… is deployed, the transaction
 * checks fail on purpose.
 */
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const RELAY = (process.env.SMOKE_RELAY || "https://anonscore-relay.netassetpremium.workers.dev").replace(/\/$/, "");
const SITE = (process.env.SMOKE_SITE || "https://anonscore.com").replace(/\/$/, "");

const GENESIS_TXID = "4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b";
const GENESIS_ADDR = "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa";
// "correct horse battery staple" — fully spent, so /utxo is a stable empty array.
const SPENT_ADDR = "1BoatSLRHtKNngkdXEeobR76b53LETtpyT";
const LN_NODE = "03864ef025fde8fb587d989186ce6a4a186895ee44a926bfc370e2c366597a3f8f";

const ATTEMPTS = 3;
const TIMEOUT_MS = 25_000;
const TRANSIENT = new Set([408, 425, 429, 500, 502, 503, 504]);
const SITE_ATTEMPTS = Number(process.env.SMOKE_SITE_ATTEMPTS || 4);
const SITE_WAIT_MS = Number(process.env.SMOKE_SITE_WAIT_MS || 15_000);

const failures = [];
const pass = (msg) => console.log("  ✓ " + msg);
const fail = (msg) => { console.log("  ✗ " + msg); failures.push(msg); };

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function relayRejection(status, text) {
  let payload = null;
  try { payload = JSON.parse(text); } catch { payload = null; }
  if (!payload || typeof payload.error !== "string") return false;
  if (status === 403 && payload.error === "path not allowed") return true;
  if (status === 404 && (payload.error === "not found" || payload.error === "path not allowed")) return true;
  return false;
}

async function readText(res, cap = 1_500_000) {
  if (!res.body) return { text: "", truncated: false };
  const reader = res.body.getReader();
  const chunks = [];
  let size = 0;
  let truncated = false;
  try {
    while (size < cap) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      chunks.push(Buffer.from(value));
      if (size >= cap) { truncated = true; break; }
    }
  } finally {
    try { await reader.cancel(); } catch { /* already closed */ }
  }
  const text = Buffer.concat(chunks).subarray(0, cap).toString("utf8");
  return { text, truncated };
}

async function request(url, { acceptStatuses } = {}) {
  let lastErr = null;
  for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
    try {
      const res = await fetch(url, {
        method: "GET",
        redirect: "follow",
        headers: { Accept: "application/json, text/plain, */*", "User-Agent": "anonscore-live-smoke" },
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      const retryable = TRANSIENT.has(res.status) && !(acceptStatuses && acceptStatuses.includes(res.status));
      if (retryable && attempt < ATTEMPTS) {
        await sleep(400 * attempt * attempt);
        continue;
      }
      return res;
    } catch (e) {
      lastErr = e;
      if (attempt < ATTEMPTS) {
        await sleep(400 * attempt * attempt);
        continue;
      }
    }
  }
  const why = lastErr && lastErr.name === "TimeoutError" ? "timed out" : (lastErr && lastErr.message) || "network error";
  throw new Error(why);
}

function parseJson(text, label) {
  try { return JSON.parse(text); }
  catch { throw new Error(`${label}: not JSON (${text.slice(0, 140).replace(/\s+/g, " ")})`); }
}

async function check(name, fn) {
  try {
    await fn();
    pass(name);
  } catch (e) {
    fail(`${name}: ${e.message || e}`);
  }
}

async function expectJsonOk(url, label, pred) {
  const res = await request(url);
  const { text, truncated } = await readText(res);
  if (relayRejection(res.status, text)) {
    throw new Error(`relay rejected this path (HTTP ${res.status} ${text.slice(0, 80)})`);
  }
  if (!res.ok) throw new Error(`HTTP ${res.status} ${text.slice(0, 140).replace(/\s+/g, " ")}`);
  if (truncated) throw new Error("response larger than expected");
  const body = parseJson(text, label);
  if (pred) pred(body);
  return body;
}

async function checkBtcFamily(prefix) {
  const base = `${RELAY}${prefix}`;
  await check(`${prefix}/address/${GENESIS_ADDR}`, async () => {
    await expectJsonOk(`${base}/address/${GENESIS_ADDR}`, "address", (body) => {
      if (!body.chain_stats || typeof body.chain_stats.tx_count !== "number") throw new Error("missing chain_stats.tx_count");
      if (body.address && body.address !== GENESIS_ADDR) throw new Error("address field mismatch");
    });
  });

  await check(`${prefix}/address/${GENESIS_ADDR}/utxo (explorer reached)`, async () => {
    const url = `${base}/address/${GENESIS_ADDR}/utxo`;
    const res = await request(url, { acceptStatuses: [400] });
    const { text } = await readText(res, 4_000);
    if (relayRejection(res.status, text)) throw new Error(`relay rejected utxo (HTTP ${res.status} ${text.slice(0, 80)})`);
    // A 200 array is the happy path. esplora also refuses this particular
    // address ("too many unspent outputs") with a plain-text 400 — blockstream
    // and mempool word that differently. Either response means the relay
    // forwarded the path; its own block is JSON 403/404, which failed above.
    if (res.status === 200) {
      if (!text.trimStart().startsWith("[")) throw new Error("utxo was not a JSON array");
      return;
    }
    if (res.status === 400 && /unspent/i.test(text)) return;
    throw new Error(`HTTP ${res.status} ${text.slice(0, 140).replace(/\s+/g, " ")}`);
  });

  await check(`${prefix}/address/${SPENT_ADDR}/utxo`, async () => {
    await expectJsonOk(`${base}/address/${SPENT_ADDR}/utxo`, "utxo", (body) => {
      if (!Array.isArray(body)) throw new Error("utxo was not an array");
    });
  });

  let cursor = null;
  await check(`${prefix}/address/${GENESIS_ADDR}/txs`, async () => {
    const page = await expectJsonOk(`${base}/address/${GENESIS_ADDR}/txs`, "txs", (body) => {
      if (!Array.isArray(body) || body.length === 0) throw new Error("expected a non-empty tx page");
      if (!body.every((tx) => tx && /^[0-9a-fA-F]{64}$/.test(tx.txid || ""))) throw new Error("tx page entries have no txid");
    });
    const confirmed = page.filter((tx) => tx.status && tx.status.confirmed && tx.txid);
    cursor = (confirmed.length ? confirmed : page).at(-1).txid;
  });

  await check(`${prefix}/tx/${GENESIS_TXID}`, async () => {
    await expectJsonOk(`${base}/tx/${GENESIS_TXID}`, "tx", (body) => {
      if (body.txid !== GENESIS_TXID) throw new Error(`txid mismatch (${body.txid})`);
      if (!Array.isArray(body.vin) || !Array.isArray(body.vout)) throw new Error("missing vin/vout");
    });
  });

  await check(`${prefix}/tx/${GENESIS_TXID}/outspends`, async () => {
    await expectJsonOk(`${base}/tx/${GENESIS_TXID}/outspends`, "outspends", (body) => {
      if (!Array.isArray(body) || body.length < 1) throw new Error("expected an outspends array");
      if (typeof body[0].spent !== "boolean") throw new Error("outspend missing spent flag");
    });
  });

  await check(`${prefix}/address/${GENESIS_ADDR}/txs/chain/${GENESIS_TXID}`, async () => {
    await expectJsonOk(`${base}/address/${GENESIS_ADDR}/txs/chain/${GENESIS_TXID}`, "chain", (body) => {
      if (!Array.isArray(body)) throw new Error("chain page was not an array");
    });
  });

  await check(`${prefix}/address/${GENESIS_ADDR}/txs/chain/<page cursor>`, async () => {
    if (!cursor) throw new Error("no cursor from the txs page");
    await expectJsonOk(`${base}/address/${GENESIS_ADDR}/txs/chain/${cursor}`, "chain cursor", (body) => {
      if (!Array.isArray(body) || body.length === 0) throw new Error("expected an older page of transactions");
      if (!/^[0-9a-fA-F]{64}$/.test(body[0].txid || "")) throw new Error("older page has no txid");
    });
  });
}

function scriptSrcs(html) {
  const out = [];
  const re = /<script\b([^>]*)>/gi;
  let m;
  while ((m = re.exec(html))) {
    const src = m[1].match(/\bsrc\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);
    if (!src) continue;
    out.push(src[1] || src[2] || src[3]);
  }
  return out;
}

async function checkSiteOnce() {
  const pageRes = await request(SITE + "/", { acceptStatuses: [200] });
  const { text: html } = await readText(pageRes, 1_500_000);
  if (!pageRes.ok) throw new Error(`homepage HTTP ${pageRes.status}`);
  const pageUrl = pageRes.url || SITE + "/";
  const origin = new URL(pageUrl).origin;
  const srcs = scriptSrcs(html);
  if (!srcs.some((s) => /anonscore\.js(?:\?|$)/.test(s))) throw new Error("homepage HTML has no anonscore.js script");
  const third = [];
  for (const src of srcs) {
    let abs;
    try { abs = new URL(src, pageUrl); }
    catch { third.push(src); continue; }
    if (abs.origin !== origin) third.push(abs.href);
  }
  if (third.length) throw new Error("third-party script origins: " + third.join(", "));

  const jsUrl = new URL("anonscore.js", pageUrl).href;
  const jsRes = await request(jsUrl);
  if (!jsRes.ok) throw new Error(`anonscore.js HTTP ${jsRes.status}`);
  const remote = Buffer.from(await jsRes.arrayBuffer());
  const local = readFileSync(join(ROOT, "anonscore.js"));
  const remoteHash = createHash("sha256").update(remote).digest("hex");
  const localHash = createHash("sha256").update(local).digest("hex");
  if (remoteHash !== localHash) {
    const err = new Error(`anonscore.js sha256 mismatch\n    live  ${remoteHash}\n    file  ${localHash}`);
    err.hashMismatch = true;
    throw err;
  }
  return { scripts: srcs.length, hash: localHash.slice(0, 16) };
}

async function checkSite() {
  let last = null;
  for (let attempt = 1; attempt <= SITE_ATTEMPTS; attempt++) {
    try {
      const info = await checkSiteOnce();
      pass(`site serves anonscore.js (${info.hash}…) with ${info.scripts} same-origin scripts and no third-party script origins`);
      return;
    } catch (e) {
      last = e;
      const deployLag = e.hashMismatch || /homepage HTTP|anonscore\.js HTTP|timed out|network/i.test(e.message || "");
      if (deployLag && attempt < SITE_ATTEMPTS) {
        console.log(`  … site check attempt ${attempt} failed (${(e.message || "").split("\n")[0]}); retrying in ${SITE_WAIT_MS / 1000}s`);
        await sleep(SITE_WAIT_MS);
        continue;
      }
      break;
    }
  }
  fail("site: " + (last && last.message ? last.message : last));
}

console.log(`Live smoke\n  relay ${RELAY}\n  site  ${SITE}`);

await checkBtcFamily("/btc");
await checkBtcFamily("/btcm");

await check(`/ln/nodes/${LN_NODE}`, async () => {
  await expectJsonOk(`${RELAY}/ln/nodes/${LN_NODE}`, "ln node", (body) => {
    const key = body.public_key || body.pubkey || body.id;
    if (key !== LN_NODE) throw new Error(`pubkey mismatch (${key})`);
  });
});

const malformed = [
  "/btc/tx/abc123",
  `/btc/tx/${"a".repeat(63)}`,
  `/btc/tx/${"g".repeat(64)}`,
  `/btcm/tx/${"a".repeat(65)}`,
];
for (const path of malformed) {
  await check(`rejected ${path}`, async () => {
    const res = await request(RELAY + path, { acceptStatuses: [403, 404] });
    const { text } = await readText(res, 2_000);
    if (!relayRejection(res.status, text)) {
      throw new Error(`expected a relay rejection, got HTTP ${res.status} ${text.slice(0, 140).replace(/\s+/g, " ")}`);
    }
  });
}

await checkSite();

console.log("\n" + "═".repeat(50));
if (failures.length) {
  console.log(`✗ ${failures.length} live check${failures.length === 1 ? "" : "s"} failed`);
  failures.forEach((f) => console.log("  - " + f));
  process.exit(1);
}
console.log("✓ Live relay and site checks passed");
