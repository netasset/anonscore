#!/usr/bin/env node
// End-to-end test suite. Runs in CI on every PR to prevent regressions like:
//   - the source file accidentally being emptied (May 2026 disaster)
//   - PNG export silently breaking from a wrong SRI hash
//   - third-party CDN creeping back in
//   - a11y regressions
//   - console errors slipping through
//
// Usage:  node scripts/test.mjs
// Exits non-zero on any failure, with a clear summary at the end.
import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { readFileSync, statSync, existsSync } from "node:fs";
import { join, extname } from "node:path";
// Prefer locally-installed playwright (CI installs the version pinned in package.json),
// but in dev sandboxes that lack browser downloads, fall back to a globally-installed one.
let chromium;
try { chromium = (await import("playwright")).chromium; }
catch { chromium = (await import("/opt/node22/lib/node_modules/playwright/index.mjs")).chromium; }

const ROOT = process.cwd();
const PORT = 8788;
const failures = [];
const fail = (msg) => { console.log("  ✗ " + msg); failures.push(msg); };
const pass = (msg) => console.log("  ✓ " + msg);

// ───────────────────────────────────────────
// 1. Build invariants — fail fast if files are malformed
// ───────────────────────────────────────────
console.log("[1/7] Build invariants");
const jsxBytes = statSync(join(ROOT, "anonscore.jsx")).size;
if (jsxBytes < 100_000) fail(`anonscore.jsx is suspiciously small (${jsxBytes} bytes — the May disaster left it at ~130 bytes)`);
else pass(`anonscore.jsx is ${jsxBytes} bytes`);

const jsBytes = statSync(join(ROOT, "anonscore.js")).size;
if (jsBytes < 100_000) fail(`anonscore.js is suspiciously small (${jsBytes} bytes)`);
else pass(`anonscore.js is ${jsBytes} bytes`);

const jsCode = readFileSync(join(ROOT, "anonscore.js"), "utf8");
if (/^import /m.test(jsCode)) fail("anonscore.js contains top-level ES imports — wrong React runtime (need classic)");
else pass("anonscore.js uses classic React runtime (no ES imports)");

const html = readFileSync(join(ROOT, "index.html"), "utf8");
for (const banned of ["unpkg.com", "cdn.tailwindcss", "babel", "cdnjs.cloudflare"]) {
  if (html.includes(banned)) fail(`index.html references banned CDN: ${banned}`);
}
for (const required of ["vendor/react", "vendor/react-dom", "anonscore.js"]) {
  if (!html.includes(required)) fail(`index.html missing required script: ${required}`);
}
if (failures.length === 0) pass("index.html references only self-hosted assets");

// CSP is `script-src 'self'` with no 'unsafe-inline' — so index.html must not
// carry any executable inline <script>. (A JSON-LD data block is not executed
// and is exempt.) An inline script would be silently blocked in production.
const inlineScripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
  .filter(([, attrs, body]) =>
    !/\bsrc=/i.test(attrs) &&                       // external scripts are fine
    !/type=["']application\/ld\+json["']/i.test(attrs) && // JSON-LD data, not executed
    body.trim().length > 0);                        // has actual inline JS
if (inlineScripts.length) fail(`index.html has ${inlineScripts.length} executable inline <script> block(s) — blocked by CSP script-src 'self'`);
else pass("index.html has no executable inline scripts (CSP script-src 'self' compliant)");

for (const f of ["vendor/react.production.min.js", "vendor/react-dom.production.min.js",
                 "vendor/confetti.browser.min.js", "vendor/dom-to-image-more.min.js",
                 "vendor/fonts/fonts.css", "sw.js"]) {
  if (!existsSync(join(ROOT, f))) fail(`Missing vendor file: ${f}`);
}
pass("All vendor files present");

// Service worker must have a named cache and use stale-while-revalidate so
// clients get fresh code without a per-build cache-hash (which used to collide
// across concurrent PRs). Freshness comes from revalidation, not the key.
const swCode = readFileSync(join(ROOT, "sw.js"), "utf8");
const cacheKey = swCode.match(/const CACHE = "(anonscore-[\w.-]+)"/);
if (!cacheKey) fail("sw.js has no named cache key (const CACHE = \"anonscore-…\")");
else if (!/hit \|\| network/.test(swCode) || !/caches\.open\(CACHE\)\.then\(\(c\) => c\.put/.test(swCode))
  fail("sw.js is not stale-while-revalidate — it must serve cache AND revalidate in the background, or clients get stuck on stale code");
else pass(`sw.js cache "${cacheKey[1]}" uses stale-while-revalidate (no per-build hash to conflict on)`);

// ── Honesty guards — the site's public claims must match the code. ──
// These encode what a manual audit previously caught by hand: stale
// outbound-call lists, undocumented storage keys, and trust-copy that
// drifted from the source it claims to describe. If one of these fails,
// a user-facing claim has become falsifiable — fix the claim or the code.
const jsxSrc  = readFileSync(join(ROOT, "anonscore.jsx"), "utf8");
const readme  = readFileSync(join(ROOT, "README.md"), "utf8");
const headers = readFileSync(join(ROOT, "_headers"), "utf8");

// 1. The relay origin the app calls must be allowed by the CSP it ships.
const relayUrl = (jsxSrc.match(/const RELAY_URL = "([^"]*)"/) || [])[1] || "";
if (relayUrl && !headers.includes(new URL(relayUrl).origin))
  fail(`RELAY_URL origin ${new URL(relayUrl).origin} is missing from _headers connect-src — relay lookups would be blocked by CSP in production`);
else pass(relayUrl ? "CSP connect-src covers the relay origin" : "Relay unset — no CSP entry required");

// 2. Every localStorage key the code writes must be documented in README's
//    privacy stance ("localStorage holds exactly …" must stay exact).
const lsKeys = new Set([...jsxSrc.matchAll(/localStorage\.setItem\("([a-z0-9_]+)"/g)].map(m => m[1]));
for (const m of jsxSrc.matchAll(/const (?:HISTORY_KEY|FIXES_KEY) = "([a-z0-9_]+)"/g)) lsKeys.add(m[1]);
const undocumented = [...lsKeys].filter(k => !readme.includes(k));
if (undocumented.length) fail(`localStorage key(s) not documented in README privacy stance: ${undocumented.join(", ")}`);
else pass(`All ${lsKeys.size} localStorage keys documented in README`);

// 3. The guarantee-rail i18n labels must match the GUARANTEES source labels
//    (they're duplicated by design; this keeps them from drifting apart).
const enLabels = {};
for (const m of jsxSrc.matchAll(/"g\.(\d)\.label": "([^"]+)"/g)) if (!(m[1] in enLabels)) enLabels[m[1]] = m[2]; // first block = EN
const srcLabels = [...jsxSrc.matchAll(/\{ icon: "[^"]+", label: "([^"]+)", desc:/g)].map(m => m[1]);
const gMismatch = srcLabels.map((l, i) => enLabels[i] !== l ? `#${i} ("${enLabels[i]}" vs "${l}")` : null).filter(Boolean);
if (srcLabels.length !== 6) fail(`Expected 6 GUARANTEES entries, found ${srcLabels.length} — update this check if the list changed on purpose`);
else if (gMismatch.length) fail(`Guarantee labels drifted between STRINGS and GUARANTEES: ${gMismatch.join("; ")}`);
else pass("Guarantee labels in sync (GUARANTEES ↔ i18n strings)");

// PWA manifest must be valid JSON with the keys browsers require for "installable".
try {
  const m = JSON.parse(readFileSync(join(ROOT, "manifest.webmanifest"), "utf8"));
  const need = ["name", "short_name", "start_url", "display", "icons"];
  const missing = need.filter((k) => !m[k]);
  if (missing.length) fail(`manifest.webmanifest missing keys: ${missing.join(", ")}`);
  else if (!m.icons.some((i) => i.sizes === "192x192") || !m.icons.some((i) => i.sizes === "512x512"))
    fail("manifest.webmanifest missing required 192x192 or 512x512 icon");
  else pass(`PWA manifest valid (${m.icons.length} icons, display=${m.display})`);
} catch (e) {
  fail("manifest.webmanifest invalid JSON: " + e.message.slice(0, 100));
}

// ───────────────────────────────────────────
// 2. Relay worker unit tests — the SSRF allowlist and the no-tracking
//    guarantees of workers/relay/worker.js are security-critical and were
//    previously enforced only by eyeballs. The worker is a plain ES module,
//    so we import it and drive it with stubbed upstream fetch.
// ───────────────────────────────────────────
console.log("[2/7] Relay worker unit tests");
{
  const relay = (await import(join(ROOT, "workers/relay/worker.js"))).default;
  const realFetch = globalThis.fetch;
  let upstreamCalls = [];
  let upstreamResponse = () => new Response(JSON.stringify({ ok: 1 }), {
    status: 200,
    headers: { "Content-Type": "application/json", "Set-Cookie": "spy=1; HttpOnly", "X-Track": "yes" },
  });
  globalThis.fetch = async (target, opts) => { upstreamCalls.push({ target, opts }); return upstreamResponse(); };
  const hit = (path, init) => relay.fetch(new Request("https://relay.test" + path, init));
  const addr = "bc1qm34lsc65zpw79lxes69zkqmk6ee3ewf0j77s3h";
  const pub = "ab".repeat(33);

  try {
    // Allowed paths map to the right upstream and pass the body through.
    upstreamCalls = [];
    const okBtc = await hit(`/btc/address/${addr}`);
    const okBtcm = await hit(`/btcm/address/${addr}/utxo`);
    const okLn = await hit(`/ln/nodes/${pub}`);
    if (okBtc.status !== 200 || okBtcm.status !== 200 || okLn.status !== 200)
      fail("relay: allowed endpoints did not pass through");
    else if (!upstreamCalls[0].target.startsWith("https://blockstream.info/api/address/") ||
             !upstreamCalls[1].target.startsWith("https://mempool.space/api/address/") ||
             !upstreamCalls[2].target.startsWith("https://mempool.space/api/v1/lightning/nodes/"))
      fail("relay: upstream mapping wrong: " + upstreamCalls.map(c => c.target).join(" , "));
    else pass("relay: allowed endpoints map to the right upstreams (btc→blockstream, btcm→mempool, ln→mempool)");

    // SSRF: everything off the allowlist is 404 and NEVER touches the network.
    upstreamCalls = [];
    const blocked = [
      "/", "/btc", "/btc/blocks", "/btc/address/short", `/btc/address/${"a".repeat(121)}`,
      `/btc/address/${addr}/txs/chain`, "/evil/address/" + addr, "/ln/nodes/nothex",
      `/btc/address/${encodeURIComponent("../")}${addr}`, "/btc/tx/abc123",
    ];
    const statuses = await Promise.all(blocked.map(p => hit(p).then(r => r.status)));
    if (statuses.some(s => s !== 404)) fail(`relay: non-allowlisted path not 404 (got ${statuses.join(",")})`);
    else if (upstreamCalls.length !== 0) fail(`relay: blocked path still reached upstream (${upstreamCalls.length} calls) — SSRF!`);
    else pass(`relay: SSRF allowlist blocks ${blocked.length}/${blocked.length} hostile paths with zero upstream calls`);

    // Methods: POST rejected, OPTIONS answers CORS preflight.
    const post = await hit(`/btc/address/${addr}`, { method: "POST" });
    const opts = await hit(`/btc/address/${addr}`, { method: "OPTIONS" });
    if (post.status !== 405) fail(`relay: POST not rejected (got ${post.status})`);
    else if (opts.status !== 200 || !opts.headers.get("Access-Control-Allow-Origin")) fail("relay: OPTIONS preflight broken");
    else pass("relay: POST rejected (405), OPTIONS preflight answered");

    // Privacy: the upstream request carries ONLY Accept + User-Agent — no
    // caller IP, cookies, or fingerprint headers are ever forwarded.
    upstreamCalls = [];
    await hit(`/btc/address/${addr}`, { headers: { "Cookie": "session=1", "X-Forwarded-For": "1.2.3.4", "User-Agent": "victim-browser" } });
    const fwd = upstreamCalls[0]?.opts?.headers || {};
    const fwdKeys = Object.keys(fwd).map(k => k.toLowerCase()).sort();
    if (fwdKeys.join(",") !== "accept,user-agent") fail(`relay: unexpected headers forwarded upstream: ${fwdKeys.join(",")}`);
    else if (fwd["User-Agent"] !== "anonscore-relay") fail("relay: caller User-Agent leaked upstream");
    else pass("relay: only Accept + a fixed User-Agent go upstream — no IP, cookies, or fingerprint");

    // Tracking headers from the upstream must be stripped on the way back,
    // and responses must never be cached.
    const back = await hit(`/btc/address/${addr}`);
    if (back.headers.get("Set-Cookie") || back.headers.get("X-Track")) fail("relay: upstream tracking headers leaked to the caller");
    else if (back.headers.get("Cache-Control") !== "no-store") fail("relay: response is cacheable — must be no-store");
    else pass("relay: upstream tracking headers stripped, response no-store");

    // Query smuggling: only ?status=open on /channels survives; everything else is dropped.
    upstreamCalls = [];
    await hit(`/ln/nodes/${pub}/channels?status=open`);
    await hit(`/ln/nodes/${pub}/channels?status=closed&evil=1`);
    await hit(`/btc/address/${addr}?spy=1`);
    const targets = upstreamCalls.map(c => c.target);
    if (!targets[0].endsWith("?status=open")) fail("relay: legitimate ?status=open was dropped");
    else if (targets[1].includes("?") || targets[2].includes("?")) fail("relay: query smuggled upstream: " + targets.slice(1).join(" , "));
    else pass("relay: query smuggling prevented (only ?status=open on /channels survives)");

    // Upstream failure → honest 502, no fallback.
    upstreamResponse = () => { throw new Error("down"); };
    const down = await hit(`/btc/address/${addr}`);
    if (down.status !== 502) fail(`relay: upstream failure not surfaced as 502 (got ${down.status})`);
    else pass("relay: upstream failure surfaces as an honest 502");
  } finally {
    globalThis.fetch = realFetch;
  }
}

// ───────────────────────────────────────────
// 3. Spin up local server serving the actual production files
// ───────────────────────────────────────────
console.log("[3/7] Local server");
const server = createServer((req, res) => {
  let url = req.url.split("?")[0]; if (url === "/") url = "/index.html";
  let p = join(ROOT, url);
  try {
    const buf = readFileSync(p);
    const ext = extname(url);
    const ct = ext === ".js" ? "application/javascript" : ext === ".html" ? "text/html"
             : ext === ".css" ? "text/css" : ext === ".woff2" ? "font/woff2"
             : ext === ".png" ? "image/png" : ext === ".svg" ? "image/svg+xml"
             : ext === ".xml" ? "application/xml" : ext === ".txt" ? "text/plain"
             : "application/octet-stream";
    res.writeHead(200, { "Content-Type": ct });
    res.end(buf);
  } catch { res.writeHead(404); res.end("404"); }
}).listen(PORT);
await new Promise(r => server.on("listening", r));
pass(`Server on :${PORT}`);

// ───────────────────────────────────────────
// 3. Browser-based checks (smoke + a11y + network)
// ───────────────────────────────────────────
console.log("[4/7] Smoke test (real browser)");
const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await ctx.newPage();
const consoleErrors = [], pageErrors = [];
const requests = [];
page.on("pageerror", (e) => pageErrors.push(e.message));
page.on("console", (m) => { if (m.type() === "error") consoleErrors.push(m.text()); });
page.on("request", (r) => requests.push({ url: r.url(), type: r.resourceType() }));

await page.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: "load" });
await page.waitForFunction(() => document.getElementById("root")?.childElementCount > 0, { timeout: 20000 });
await page.waitForTimeout(1500); // let fonts settle

const root = await page.evaluate(() => document.getElementById("root")?.childElementCount || 0);
if (root === 0) fail("React did not mount");
else pass(`React mounted (${root} root children)`);

if (await page.evaluate(() => typeof window.Babel) !== "undefined") fail("Babel is loaded — should be absent");
else pass("Babel is absent (no in-browser compile)");

if (await page.evaluate(() => typeof window.confetti) !== "function") fail("confetti not loaded");
else pass("confetti loaded");

// Keyboard shortcut: "/" should focus the address input
await page.keyboard.press("/");
const focused = await page.evaluate(() => document.activeElement?.tagName);
if (focused !== "INPUT") fail(`"/" did not focus input (got: ${focused})`);
else pass(`"/" focuses address input`);

// i18n: switching to Spanish swaps hero copy + sets <html lang>, and English
// is the default. Then switch back so the rest of the run sees English labels.
const enHero = await page.evaluate(() => document.body.innerText.includes("Is your Bitcoin"));
if (!enHero) fail("i18n: default English hero not found");
const esBtn = page.getByRole("button", { name: /Switch language to ES/i });
if (await esBtn.count() === 0) fail("i18n: language switcher (ES) not found");
else {
  await esBtn.click();
  await page.waitForTimeout(200);
  const esState = await page.evaluate(() => ({
    htmlLang: document.documentElement.lang,
    hasEs: document.body.innerText.includes("Descúbrelo en 60 segundos"),
    hasEnGone: !document.body.innerText.includes("Is your Bitcoin"),
  }));
  if (esState.htmlLang !== "es") fail(`i18n: <html lang> not "es" (got "${esState.htmlLang}")`);
  else if (!esState.hasEs) fail("i18n: Spanish hero copy not rendered after switch");
  else if (!esState.hasEnGone) fail("i18n: English hero still present after switching to ES");
  else pass("i18n: ES switch swaps hero copy + sets <html lang=es>");
  // Back to English for the remaining assertions/labels
  await page.getByRole("button", { name: /Switch language to EN/i }).click();
  await page.waitForTimeout(200);
}

// Wallet directory page: deep-linkable at /?page=wallets, renders ≥10 reviews.
{
  const dirPage = await ctx.newPage();
  try {
    await dirPage.goto(`http://127.0.0.1:${PORT}/?page=wallets`, { waitUntil: "load" });
    await dirPage.waitForFunction(() => document.getElementById("root")?.childElementCount > 0, { timeout: 15000 });
    await dirPage.waitForTimeout(800);
    const heroOk = await dirPage.getByText(/Bitcoin wallet directory/i).count();
    const visitLinks = await dirPage.locator('a:has-text("Visit")').count();
    if (heroOk === 0) fail("wallet directory: hero not rendered");
    else if (visitLinks < 10) fail(`wallet directory: only ${visitLinks} outbound links (expected ≥10)`);
    else pass(`wallet directory renders at /?page=wallets (${visitLinks} outbound links)`);
  } catch (e) {
    fail("wallet directory: " + e.message.slice(0, 120));
  } finally {
    await dirPage.close();
  }
}

// Service worker should register and precache the static assets.
await page.waitForFunction(
  () => navigator.serviceWorker?.controller || navigator.serviceWorker?.ready,
  { timeout: 8000 }
).catch(() => {});
const swInfo = await page.evaluate(async () => {
  if (!navigator.serviceWorker) return { supported: false };
  const reg = await navigator.serviceWorker.getRegistration();
  if (!reg) return { supported: true, registered: false };
  await navigator.serviceWorker.ready;
  const keys = await caches.keys();
  let entryCount = 0;
  for (const k of keys) {
    const c = await caches.open(k);
    entryCount += (await c.keys()).length;
  }
  return { supported: true, registered: true, scope: reg.scope, caches: keys, entries: entryCount };
});
if (!swInfo.supported) fail("Service worker API not supported in test browser");
else if (!swInfo.registered) fail("Service worker did not register");
else if (swInfo.entries < 5) fail(`Service worker registered but precached only ${swInfo.entries} entries (expected ≥5)`);
else pass(`Service worker registered, ${swInfo.entries} entries cached in ${swInfo.caches[0]}`);

// ───────────────────────────────────────────
// 4. Engine unit tests — run against the BUILT bundle via the read-only
//    window.__ANONSCORE_TEST__ hook ("verify, don't trust", applied to
//    ourselves). These pin the pure scoring/analysis functions so a logic
//    regression can't ship silently behind a green smoke test.
// ───────────────────────────────────────────
console.log("[5/7] Engine unit tests (built bundle)");
const unit = await page.evaluate(() => {
  const E = window.__ANONSCORE_TEST__;
  if (!E) return { missing: true };
  const r = [];
  const t = (name, cond) => r.push({ name, ok: !!cond });
  const pv = a => ({ prevout: { scriptpubkey_address: a } });
  const me = "bc1qm34lsc65zpw79lxes69zkqmk6ee3ewf0j77s3h";
  const sib1 = "bc1qsibling1aaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
  const sib2 = "bc1qsibling2bbbbbbbbbbbbbbbbbbbbbbbbbbbbb";

  // — Cluster: common-input ownership —
  {
    const consolidation = { txid: "t1", vin: [pv(me), pv(sib1), pv(sib2)], vout: [{ value: 9e7 }] };
    const c1 = E.computeCluster([consolidation], me);
    t("cluster: 3-input spend links the 2 sibling addresses", c1.linked.length === 2 && c1.spends === 1);
    // A real (multi-participant) CoinJoin must NOT imply one owner
    const cj = { txid: "t2", vin: [pv(me), pv(sib1), pv(sib2)], vout: [{ value: 5e6 }, { value: 5e6 }, { value: 5e6 }, { value: 1e6 }, { value: 2e6 }] };
    const c2 = E.computeCluster([cj], me);
    t("cluster: multi-input equal-output CoinJoin is excluded", c2.linked.length === 0 && c2.cjExcluded === 1);
    // Audit regression: a SINGLE-input batch payout also has repeated equal
    // outputs but is NOT a CoinJoin — it must not be excluded as one.
    const batch = { txid: "b1", vin: [pv(me)], vout: [{ value: 5e6 }, { value: 5e6 }, { value: 5e6 }, { value: 5e6 }, { value: 1e6 }] };
    const c4 = E.computeCluster([batch], me);
    t("cluster: single-input batch payout is NOT treated as a CoinJoin", c4.cjExcluded === 0 && c4.spends === 1);
    // Receive-only history links nothing
    const recv = { txid: "t3", vin: [pv(sib1)], vout: [{ value: 1e6, scriptpubkey_address: me }] };
    const c3 = E.computeCluster([recv], me);
    t("cluster: receive-only history links nothing", c3.linked.length === 0 && c3.spends === 0);
  }

  // — Address poisoning: lookalike matching —
  {
    const bait = "bc1qm34lx9k2v7d0trplq5u8snw6hjazy4j77s3h"; // head+tail match `me`, middle differs
    t("poisoning: true bait detected", E.isLookalikeAddress(me, bait) === true);
    t("poisoning: identical address is not bait", E.isLookalikeAddress(me, me) === false);
    t("poisoning: different head rejected", E.isLookalikeAddress(me, "bc1qzzzzsc65zpw79lxes69zkqmk6ee3ewf0j77s3h") === false);
    t("poisoning: cross-type bc1q/bc1p rejected", E.isLookalikeAddress(me, "bc1p" + me.slice(4)) === false);
    t("poisoning: legacy 1… lookalike detected", E.isLookalikeAddress("1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa", "1A1zPxxxxxxxxxxxxxxxxxxxxxx7DivfNa") === true);
    const pz = E.computePoisoning([
      { txid: "p1", vin: [], vout: [{ value: 546, scriptpubkey_address: bait }] },
      { txid: "p2", vin: [pv(sib1)], vout: [{ value: 1e6, scriptpubkey_address: me }] },
    ], me);
    t("poisoning: sweep finds planted bait exactly once", pz.lookalikes.length === 1 && pz.lookalikes[0].addr === bait);
  }

  // — Activity clock: timezone inference —
  {
    // 12 txs all at 18:xx UTC → strong daily rhythm; quiet window must exclude 18.
    const txs = Array.from({ length: 12 }, (_, i) => ({ status: { block_time: i * 86400 + 18 * 3600 + 120 } }));
    const ac = E.computeActivityClock(txs);
    const inQuiet = h => ((h - ac.qStart + 24) % 24) < ac.K;
    t("clock: strong single-hour rhythm detected", ac.hasData && ac.strong && ac.counts[18] === 12);
    t("clock: quiet window excludes the active hour", !inQuiet(18));
    t("clock: timezone estimate is well-formed", /^UTC[+-]?\d+$/.test(ac.tz));
  }

  // — Engine invariants —
  {
    const empty = E.runEngine([], [], 0);
    t("engine: empty wallet is the honest isEmpty state (null score, — grade)", empty.isEmpty === true && empty.score === null && empty.grade === "—");
    const now = Math.floor(Date.now() / 1000);
    const coin = v => ({ txid: "u", vout: 0, value: v, scriptpubkey_type: "v0_p2wpkh", status: { confirmed: true, block_time: now - 86400 * 30 } });
    const clean = E.runEngine([coin(5e7), coin(3e7)], [], 2);
    const dusted = E.runEngine([coin(5e7), coin(3e7), coin(500), coin(510), coin(520)], [], 5);
    t("engine: dust beacons lower the score", dusted.score < clean.score);
    // Audit regression: a single-input batch payout (repeated equal outputs,
    // one input) must NOT be credited as CoinJoin — the cj check stays "fail".
    const batchTx = { txid: "bt", vin: [{ txid: "s", vout: 0 }], vout: [{ value: 5e6 }, { value: 5e6 }, { value: 5e6 }, { value: 5e6 }, { value: 1e6 }], status: { block_time: now - 86400 } };
    const batchRes = E.runEngine([coin(5e7)], [batchTx], 1);
    const cjCheck = batchRes.checks.find(c => c.key === "cj");
    t("engine: single-input batch is not miscredited as CoinJoin", !!cjCheck && cjCheck.status === "fail");
    t("engine: grade boundaries (A/F)", E.scoreGrade(95) === "A" && E.scoreGrade(30) === "F");
    t("engine: validators (genesis addr, junk, LN pubkey)",
      E.isValidBitcoinAddress("1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa") === true &&
      E.isValidBitcoinAddress("not-an-address") === false &&
      E.detectInputType("02".padEnd(66, "ab")) === "ln_pubkey");
  }
  return { results: r };
});
if (unit.missing) fail("window.__ANONSCORE_TEST__ hook missing from the built bundle");
else {
  const bad = unit.results.filter(u => !u.ok);
  bad.forEach(u => fail("engine unit: " + u.name));
  if (!bad.length) pass(`engine unit tests: ${unit.results.length}/${unit.results.length} passed (cluster, poisoning, clock, engine)`);
}

// Run a demo scan end-to-end
console.log("[6/7] Demo scan flow");
// Re-navigate to a clean landing (earlier blocks switched language / visited
// the directory page), then trigger the demo from the sample chip.
await page.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: "load" });
await page.waitForFunction(() => document.getElementById("root")?.childElementCount > 0, { timeout: 20000 });
await page.waitForTimeout(800);
await page.getByText("Risky wallet").click();
await page.waitForTimeout(3500);
const dashText = await page.evaluate(() => document.body.innerText);
if (!dashText.includes("Grade")) fail("Dashboard didn't render after demo scan");
else pass("Dashboard renders after demo scan");
for (const tab of ["Fix It", "Overview", "Flow", "UTXOs", "Transactions", "Methodology"]) {
  const el = page.getByText(tab, { exact: true }).first();
  if (await el.count() === 0) { fail(`Dashboard tab missing: ${tab}`); continue; }
  await el.click(); await page.waitForTimeout(250);
  const txt = await page.evaluate(() => document.body.innerText);
  if (txt.length < 500) fail(`Tab ${tab} rendered too little (${txt.length} chars)`);
}
pass("All 6 dashboard tabs rendered");

// Wallet recommendations should be real outbound links (affiliate scaffolding).
// Find Sparrow links and verify they point to a real URL.
const fixIt = page.getByText("Fix It", { exact: true }).first();
if (await fixIt.count()) await fixIt.click();
// Wait for the staggered fadeUp animation on the rec cards to fully complete
// (≈ recCount * .06s delay + .35s duration). Otherwise the a11y audit below
// races the animation and axe sees mid-opacity colors that fail contrast.
await page.waitForTimeout(1200);
const walletLinks = await page.evaluate(() => {
  const anchors = Array.from(document.querySelectorAll("a"));
  return anchors
    .filter(a => /Sparrow|Wasabi|Phoenix|Electrum/.test(a.textContent || ""))
    .map(a => ({ text: a.textContent?.slice(0, 30), href: a.href }))
    .slice(0, 3);
});
if (walletLinks.length === 0) fail("No wallet recommendation links found on dashboard");
else if (walletLinks.some(l => !l.href || !l.href.startsWith("http"))) fail("Wallet recommendation links don't have URLs: " + JSON.stringify(walletLinks));
else pass(`Wallet recommendations link out (${walletLinks.length} samples checked)`);

// PNG export: the script tag uses vendor/dom-to-image-more.min.js (no broken SRI).
// Verifies the source path in the bundle matches a real file — guards against the
// exact bug we previously had silently broken (the famous MDN placeholder SRI hash).
if (!jsCode.includes("vendor/dom-to-image-more.min.js")) fail("anonscore.js doesn't reference the self-hosted dom-to-image path");
else pass("PNG export wired to self-hosted dom-to-image (no broken SRI)");

// Same-origin network check (proves no third-party CDN crept back in)
console.log("[7/7] Same-origin network check");
const thirdParty = [...new Set(requests.map(r => new URL(r.url).origin))]
  .filter(o => !o.includes("127.0.0.1"));
if (thirdParty.length) fail(`Third-party origins detected: ${thirdParty.join(", ")}`);
else pass(`100% same-origin (${requests.length} requests)`);

// Console errors (excluding the known benign dom-to-image cross-origin CSSOM warning,
// which is now also gone because fonts are same-origin)
const realErrors = [...consoleErrors, ...pageErrors];
if (realErrors.length) realErrors.forEach(e => fail("console: " + e.slice(0, 200)));
else pass("0 console errors");

// a11y on landing and dashboard (we're already on dashboard, audit it, then go back)
const AXE = readFileSync(join(ROOT, "node_modules/axe-core/axe.min.js"), "utf8");
async function axeRun(label, pg) {
  await pg.addScriptTag({ content: AXE });
  const v = await pg.evaluate(async () => (await window.axe.run()).violations
    .filter(v => v.impact === "critical" || v.impact === "serious")
    .map(v => `${v.impact}/${v.id}(${v.nodes.length}x)`));
  if (v.length) fail(`a11y on ${label}: ${v.join(", ")}`);
  else pass(`a11y ${label}: 0 critical/serious`);
}
await axeRun("Dashboard", page);
const back = page.getByText(/← Back/).first();
if (await back.count()) { await back.click(); await page.waitForTimeout(900); }
await axeRun("Landing (after demo)", page);

await browser.close();
server.close();

// ───────────────────────────────────────────
// Result
// ───────────────────────────────────────────
console.log("\n" + "═".repeat(50));
if (failures.length) {
  console.log(`✗ ${failures.length} failures`);
  failures.forEach(f => console.log("  - " + f));
  process.exit(1);
} else {
  console.log("✓ All checks passed");
  process.exit(0);
}
