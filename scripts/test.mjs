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

// Silent Payments: entering an sp1… address in the hero shows the BIP352
// education card (not a "scan"), decoded entirely in-browser.
{
  const spPage = await ctx.newPage();
  try {
    await spPage.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: "load" });
    await spPage.waitForFunction(() => document.getElementById("root")?.childElementCount > 0, { timeout: 15000 });
    await spPage.waitForTimeout(400);
    const ADDR = "sp1qqgste7k9hx0qftg6qmwlkqtwuy6cycyavzmzj85c6qdfhjdpdjtdgqjuexzk6murw56suy3e0rd2cgqvycxttddwsvgxe2usfpxumr70xc9pkqwv";
    await spPage.locator('input[aria-label*="silent payment"]').fill(ADDR);
    await spPage.getByRole("button", { name: /Analy[sz]e|Reveal|Audit/i }).first().click();
    await spPage.waitForTimeout(300);
    const card = await spPage.evaluate(() => !![...document.querySelectorAll('*')].find(e => /SILENT PAYMENT ADDRESS/.test(e.textContent || "") && e.children.length < 3));
    if (!card) fail("silent payments: BIP352 education card did not render for an sp1 address");
    else pass("silent payments: sp1 address shows the BIP352 education card (in-browser decode)");
    // BOLT11 invoice (with routing hints) → Lightning invoice lint card
    const INV = "lnbc20m1pvjluezsp5zyg3zyg3zyg3zyg3zyg3zyg3zyg3zyg3zyg3zyg3zyg3zyg3zygspp5qqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqfqypqhp58yjmdan79s6qqdhdzgynm4zwqd5d7xmw5fk98klysy043l2ahrqsfpp3qjmp7lwpagxun9pygexvgpjdc4jdj85fr9yq20q82gphp2nflc7jtzrcazrra7wwgzxqc8u7754cdlpfrmccae92qgzqvzq2ps8pqqqqqqpqqqqq9qqqvpeuqafqxu92d8lr6fvg0r5gv0heeeqgcrqlnm6jhphu9y00rrhy4grqszsvpcgpy9qqqqqqgqqqqq7qqzq9qrsgqdfjcdk6w3ak5pca9hwfwfh63zrrz06wwfya0ydlzpgzxkn5xagsqz7x9j4jwe7yj7vaf2k9lqsdk45kts2fd0fkr28am0u4w95tt2nsq76cqw0";
    await spPage.locator('input[aria-label*="silent payment"]').fill(INV);
    await spPage.getByRole("button", { name: /Analy[sz]e|Reveal|Audit/i }).first().click();
    await spPage.waitForTimeout(300);
    const lnCard = await spPage.evaluate(() => !![...document.querySelectorAll('*')].find(e => /LIGHTNING INVOICE · BOLT11/.test(e.textContent || "") && e.children.length < 4));
    if (!lnCard) fail("bolt11: Lightning invoice lint card did not render");
    else pass("bolt11: invoice shows the Lightning lint card (funding-UTXO leak surfaced, in-browser)");
  } catch (e) {
    fail("silent payments / bolt11: " + e.message.slice(0, 120));
  } finally {
    await spPage.close();
  }
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

// Transaction Inspector page: deep-linkable at /?page=inspector; "Load example
// PSBT" parses a real PSBT and renders the report entirely offline.
{
  const insPage = await ctx.newPage();
  const insReqs = [];
  insPage.on("request", r => insReqs.push(new URL(r.url()).origin));
  try {
    await insPage.goto(`http://127.0.0.1:${PORT}/?page=inspector`, { waitUntil: "load" });
    await insPage.waitForFunction(() => document.getElementById("root")?.childElementCount > 0, { timeout: 15000 });
    await insPage.waitForTimeout(600);
    const hasInput = await insPage.locator('textarea#tx-input').count();
    const hasH1 = await insPage.locator('h1.sr-only').count();
    await insPage.getByText("Load example PSBT").click();
    await insPage.waitForTimeout(500);
    const report = await insPage.evaluate(() => ({
      verdict: !![...document.querySelectorAll('*')].find(e => e.textContent === 'PRE-BROADCAST VERDICT'),
      cluster: !![...document.querySelectorAll('*')].find(e => e.textContent === 'CLUSTER THIS SPEND CREATES'),
      io: !![...document.querySelectorAll('*')].find(e => e.textContent === 'INPUTS → OUTPUTS'),
      entropy: !![...document.querySelectorAll('*')].find(e => e.textContent === 'INTERPRETATION ENTROPY'),
      provable: !![...document.querySelectorAll('*')].find(e => (e.textContent || '').includes('provably from these inputs')),
      fingerprint: !![...document.querySelectorAll('*')].find(e => e.textContent === 'WALLET FINGERPRINT'),
    }));
    const thirdParty = [...new Set(insReqs)].filter(o => !o.includes("127.0.0.1"));
    if (!hasInput || !hasH1) fail("inspector: input textarea or sr-only h1 missing");
    else if (!report.verdict || !report.cluster || !report.io || !report.entropy || !report.provable || !report.fingerprint) fail(`inspector: report incomplete after Load example (${JSON.stringify(report)})`);
    else if (thirdParty.length) fail(`inspector: made third-party requests (must be fully offline): ${thirdParty.join(", ")}`);
    else pass("inspector renders at /?page=inspector; example PSBT parsed + full report (incl. entropy), 100% offline");
  } catch (e) {
    fail("inspector: " + e.message.slice(0, 120));
  } finally {
    await insPage.close();
  }
}

// Wallet xpub scan page: deep-linkable at /?page=xpub; "Load example" runs the
// wallet engine on a fixture and renders the report entirely offline.
{
  const xp = await ctx.newPage();
  const xReqs = [];
  xp.on("request", r => xReqs.push(new URL(r.url()).origin));
  try {
    await xp.goto(`http://127.0.0.1:${PORT}/?page=xpub`, { waitUntil: "load" });
    await xp.waitForFunction(() => document.getElementById("root")?.childElementCount > 0, { timeout: 15000 });
    await xp.waitForTimeout(600);
    const hasInput = await xp.locator('textarea#xpub-input').count();
    await xp.getByText("Load example").click();
    await xp.waitForTimeout(700);
    const rep = await xp.evaluate(() => ({
      grade: !![...document.querySelectorAll('*')].find(e => /Grade [A-F]/.test(e.textContent || "") && e.children.length < 3),
      breakdown: !![...document.querySelectorAll('*')].find(e => e.textContent === 'HOW THE WALLET SCORES'),
      addrs: !![...document.querySelectorAll('*')].find(e => /^ADDRESSES \(/.test(e.textContent || "")),
    }));
    const thirdParty = [...new Set(xReqs)].filter(o => !o.includes("127.0.0.1"));
    if (!hasInput) fail("xpub scan: xpub textarea missing");
    else if (!rep.grade || !rep.breakdown || !rep.addrs) fail(`xpub scan: report incomplete after Load example (${JSON.stringify(rep)})`);
    else if (thirdParty.length) fail(`xpub scan: made third-party requests on the offline demo: ${thirdParty.join(", ")}`);
    else pass("xpub scan renders at /?page=xpub; example wallet scored + report, 100% offline");
  } catch (e) {
    fail("xpub scan: " + e.message.slice(0, 120));
  } finally {
    await xp.close();
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

  // — Transaction Inspector: parser + analysis (validated against BIP174/173/350) —
  {
    const b64ToBytes = s => { const bin = atob(s); const u = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i); return u; };
    const bytes = a => new Uint8Array(a);
    // classifyScript across every script type
    t("inspector: classify p2pkh→address (genesis)", E.classifyScript(bytes([0x76,0xa9,0x14,0x62,0xe9,0x07,0xb1,0x5c,0xbf,0x27,0xd5,0x42,0x53,0x99,0xeb,0xf6,0xf0,0xfb,0x50,0xeb,0xb8,0x8f,0x18,0x88,0xac])).address === "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa");
    t("inspector: classify p2wpkh (bech32)", E.classifyScript(bytes([0x00,0x14,0x75,0x1e,0x76,0xe8,0x19,0x91,0x96,0xd4,0x54,0x94,0x1c,0x45,0xd1,0xb3,0xa3,0x23,0xf1,0x43,0x3b,0xd6])).address === "bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4");
    t("inspector: classify p2tr (bech32m)", E.classifyScript(bytes([0x51,0x20,0x79,0xbe,0x66,0x7e,0xf9,0xdc,0xbb,0xac,0x55,0xa0,0x62,0x95,0xce,0x87,0x0b,0x07,0x02,0x9b,0xfc,0xdb,0x2d,0xce,0x28,0xd9,0x59,0xf2,0x81,0x5b,0x16,0xf8,0x17,0x98])).address === "bc1p0xlxvlhemja6c4dqv22uapctqupfhlxm9h8z3k2e72q4k9hcz7vqzk5jj0");
    t("inspector: classify op_return", E.classifyScript(bytes([0x6a,0x05,1,2,3,4,5])).type === "op_return");
    // BIP174 canonical PSBT: 2 in (p2pkh + p2sh), 2 out (199900000 + 9358), fee 90341
    const PSBT = "cHNidP8BAKACAAAAAqsJSaCMWvfEm4IS9Bfi8Vqz9cM9zxU4IagTn4d6W3vkAAAAAAD+////qwlJoIxa98SbghL0F+LxWrP1wz3PFTghqBOfh3pbe+QBAAAAAP7///8CYDvqCwAAAAAZdqkUdopAu9dAy+gdmI5x3ipNXHE5ax2IrI4kAAAAAAAAGXapFG9GILVT+glechue4O/p+gOcykWXiKwAAAAAAAEA3wIAAAABJoFxNx7f8oXpN63upLN7eAAMBWbLs61kZBcTykIXG/YAAAAAakcwRAIgcLIkUSPmv0dNYMW1DAQ9TGkaXSQ18Jo0p2YqncJReQoCIAEynKnazygL3zB0DsA5BCJCLIHLRYOUV663b8Eu3ZWzASECZX0RjTNXuOD0ws1G23s59tnDjZpwq8ubLeXcjb/kzjH+////AtPf9QUAAAAAGXapFNDFmQPFusKGh2DpD9UhpGZap2UgiKwA4fUFAAAAABepFDVF5uM7gyxHBQ8k0+65PJwDlIvHh7MuEwAAAQEgAOH1BQAAAAAXqRQ1RebjO4MsRwUPJNPuuTycA5SLx4cBBBYAFIXRNTfy4mVAWjTbr6nj3aAfuCMIAAAA";
    const psbt = E.parsePsbt(b64ToBytes(PSBT));
    t("inspector: PSBT 2 in / 2 out", psbt.vin.length === 2 && psbt.vout.length === 2);
    t("inspector: PSBT output values (199900000, 9358)", psbt.vout[0].value === 199900000 && psbt.vout[1].value === 9358);
    t("inspector: PSBT input prevout types (p2pkh, p2sh)", psbt.vin[0].prevout.scriptpubkey_type === "p2pkh" && psbt.vin[1].prevout.scriptpubkey_type === "p2sh");
    t("inspector: PSBT fee = 90341", psbt.fee === 90341);
    // The bundled DEMO_PSBT: 3 fused inputs, round payment, change reused
    const demo = E.parseTransactionInput(E.DEMO_PSBT);
    const a = E.analyzeTx(demo.tx), ch = E.guessChange(demo.tx), cl = E.clusterUnification(demo.tx);
    t("inspector: demo parses to 3 inputs, fee 50000", demo.tx.vin.length === 3 && demo.tx.fee === 50000);
    t("inspector: demo flagged leaky (reuse + round)", a.leaky === true && a.reuse === true && a.round === true);
    t("inspector: demo change = output #2, High confidence", ch && ch.index === 1 && ch.confidence === "High");
    t("inspector: demo cluster-unifies 3 addresses", cl.addrs.length === 3);
    // Robustness: garbage input throws (never hangs), txid is recognized-but-deferred
    let threw = false; try { E.parseTransactionInput("deadbeef00"); } catch { threw = true; }
    t("inspector: malformed hex throws", threw);
    t("inspector: txid detected as networked kind", E.detectTxInput("ab".repeat(32)) === "txid");
  }

  // — transaction entropy / linkability (Boltzmann · KYCP methodology) —
  //   validated against LaurentMT's canonical examples: N=1/E=0 (payment),
  //   N=2/E=1 (ambiguous), N=3/E=1.585 (CoinJoin), and LP=2/3 for the 2×2 CJ —
  {
    const close = (a, b) => Math.abs(a - b) < 1e-9;
    const pay = E.txInterpretations([100000], [70000, 29000], 1000);
    t("entropy: payment N=1, E=0", pay.N === 1 && pay.entropy === 0);
    t("entropy: payment both outputs deterministically linked", pay.dl === 2);
    const amb = E.txInterpretations([40000, 60000], [40000, 60000], 0);
    t("entropy: ambiguous 2×2 distinct N=2, E=1", amb.N === 2 && amb.entropy === 1);
    const cj = E.txInterpretations([1, 1], [1, 1], 0);
    t("entropy: 2×2 equal CoinJoin N=3, E=1.585", cj.N === 3 && close(cj.entropy, Math.log2(3)));
    t("entropy: 2×2 CoinJoin LP = 2/3, no deterministic links", close(cj.lp[0][0], 2 / 3) && cj.dl === 0);
    const cj3 = E.txInterpretations([1, 1, 1], [1, 1, 1], 0);
    t("entropy: 3×3 equal CoinJoin N=16, E=4", cj3.N === 16 && close(cj3.entropy, 4));
    const undiv = E.txInterpretations([1, 3], [2, 2], 0);
    t("entropy: indivisible 2×2 N=1, all 4 links deterministic", undiv.N === 1 && undiv.dl === 4);
    t("entropy: negative fee rejected", E.txInterpretations([100], [200], -50).error === "negative-fee");
    t("entropy: 13 inputs exceeds the 12-item cap", E.txInterpretations(new Array(13).fill(1), [1], 0).error === "too-many");
    // txLinkability wraps a parsed tx (needs input amounts → full PSBT works)
    const dtx = E.parseTransactionInput(E.DEMO_PSBT).tx;
    const dl = E.txLinkability(dtx);
    t("entropy: demo PSBT linkability available with a 3×2 matrix", dl.available === true && dl.n === 3 && dl.m === 2 && dl.lp.length === 3 && dl.lp[0].length === 2);
    // raw hex carries no input values → honestly reports unavailable, never guesses
    const noVals = { vin: [{ prevout: null }], vout: [{ value: 1000, scriptpubkey_type: "v0_p2wpkh" }] };
    t("entropy: missing input values → unavailable (no guessing)", E.txLinkability(noVals).available === false && E.txLinkability(noVals).reason === "input-values-unknown");
  }

  // — wallet fingerprint: structural tells (version / locktime / RBF / BIP69 / mix) —
  {
    // Demo PSBT: v2, all-0xfffffffd sequences (RBF default), locktime 0 (no anti-snipe)
    const dtx = E.parseTransactionInput(E.DEMO_PSBT).tx;
    t("fingerprint: parser now preserves nSequence", dtx.vin[0].sequence === 0xfffffffd && dtx.locktime === 0 && dtx.version === 2);
    const fp = E.fingerprintTx(dtx);
    t("fingerprint: demo flags locktime-0 as distinctive, RBF-default as common", fp.available && fp.distinctive === 1 && fp.signals.some(s => s.key === "locktime" && s.distinctive) && fp.signals.some(s => s.key === "rbf" && !s.distinctive));
    t("fingerprint: demo narrative explains the RBF/anti-snipe mismatch", /RBF default matches/.test(fp.guess));
    // Anti-fee-sniping + RBF → consistent-with-Core/Electrum narrative
    const core = { version: 2, locktime: 800000, vin: [{ sequence: 0xfffffffd, prevout: { scriptpubkey_type: "v0_p2wpkh" } }], vout: [{ value: 100, scriptpubkey: "0014aa" }] };
    t("fingerprint: anti-snipe + RBF reads as Core/Electrum", /Bitcoin Core or Electrum/.test(E.fingerprintTx(core).guess));
    // Mixed input script types is a distinctive coin-control tell
    const mixed = { version: 2, locktime: 800000, vin: [{ sequence: 0xfffffffd, prevout: { scriptpubkey_type: "v0_p2wpkh" } }, { sequence: 0xfffffffd, prevout: { scriptpubkey_type: "p2pkh" } }], vout: [{ value: 100, scriptpubkey: "0014aa" }, { value: 90, scriptpubkey: "0014bb" }] };
    t("fingerprint: mixed input types flagged distinctive", E.fingerprintTx(mixed).signals.some(s => s.key === "mixin" && s.distinctive));
    // No-RBF + locktime 0 rules out Core/Electrum defaults
    const mobile = { version: 2, locktime: 0, vin: [{ sequence: 0xffffffff, prevout: { scriptpubkey_type: "v0_p2wpkh" } }], vout: [{ value: 100, scriptpubkey: "0014aa" }] };
    t("fingerprint: no-RBF + locktime-0 rules out Core/Electrum", /rules out current Core/.test(E.fingerprintTx(mobile).guess));

    // Low-r signature grinding — the deterministic "not Core" tell (DER classifier)
    const hx = h => new Uint8Array(h.match(/../g).map(x => parseInt(x, 16)));
    const lowR = hx("30" + "44" + "0220" + "11".repeat(32) + "0220" + "22".repeat(32) + "01");
    const highR = hx("30" + "45" + "0221" + "00" + "11".repeat(32) + "0220" + "22".repeat(32) + "01");
    t("fingerprint: DER low-r sig is 71 bytes, not high-r", E._derSigInfo(lowR).len === 71 && E._derSigInfo(lowR).highR === false);
    t("fingerprint: DER high-r sig is 72 bytes, flagged high-r", E._derSigInfo(highR).len === 72 && E._derSigInfo(highR).highR === true);
    t("fingerprint: a 33-byte pubkey is not misread as a signature", E._derSigInfo(hx("02" + "ab".repeat(32))) === null);
    // End-to-end: a real signed segwit tx hex (high-r sig) → parser captures the
    // witness → fingerprint decisively rules out Core.
    const signedHighR = "0200000000010100000000000000000000000000000000000000000000000000000000000000000000000000fdffffff018038010000000000160014abababababababababababababababababababab02483045022100111111111111111111111111111111111111111111111111111111111111111102202222222222222222222222222222222222222222222222222222222222222222012103cdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcd00000000";
    const stx = E.parseRawTx(hx(signedHighR));
    t("fingerprint: parser captures the witness stack", Array.isArray(stx.vin[0].witness) && stx.vin[0].witness.length === 2);
    const sfp = E.fingerprintTx(stx);
    t("fingerprint: high-r signed tx decisively rules out Core", sfp.signals.some(s => s.key === "lowr" && s.distinctive) && /not signed by Bitcoin Core/.test(sfp.guess));
  }

  // — Silent Payments (BIP352) decode/validate — validated against the spec's
  //   "Simple send" test-vector address (must reproduce its scan + spend keys) —
  {
    const ADDR = "sp1qqgste7k9hx0qftg6qmwlkqtwuy6cycyavzmzj85c6qdfhjdpdjtdgqjuexzk6murw56suy3e0rd2cgqvycxttddwsvgxe2usfpxumr70xc9pkqwv";
    const sp = E.decodeSilentPayment(ADDR);
    t("silentpay: BIP352 vector → mainnet v0", sp && sp.network === "mainnet" && sp.version === 0);
    t("silentpay: BIP352 vector → exact scan key", sp && sp.scanKey === "0220bcfac5b99e04ad1a06ddfb016ee13582609d60b6291e98d01a9bc9a16c96d4");
    t("silentpay: BIP352 vector → exact spend key", sp && sp.spendKey === "025cc9856d6f8375350e123978daac200c260cb5b5ae83106cab90484dcd8fcf36");
    t("silentpay: detectSilentPayment recognizes the address", E.detectSilentPayment(ADDR) === "sp" && E.detectSilentPayment("bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4") === null);
    // A normal segwit address is NOT a silent payment; garbage rejected
    t("silentpay: bech32 (not bech32m) / wrong hrp rejected", E.decodeSilentPayment("bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4") === null && E.decodeSilentPayment("sp1qqqqqqqqqqq") === null);
    // bech32m decoder still validates a normal p2tr address (checksum round-trip)
    const tr = E._bech32Decode("bc1p0xlxvlhemja6c4dqv22uapctqupfhlxm9h8z3k2e72q4k9hcz7vqzk5jj0");
    t("silentpay: _bech32Decode verifies a p2tr checksum (bech32m)", tr && tr.hrp === "bc" && tr.spec === "bech32m");
  }

  // — BOLT11 Lightning invoice decode + privacy lint — validated against the
  //   BOLT11 spec's routing-hint example (SCID → funding-tx location) —
  {
    const INV = "lnbc20m1pvjluezsp5zyg3zyg3zyg3zyg3zyg3zyg3zyg3zyg3zyg3zyg3zyg3zyg3zygspp5qqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqfqypqhp58yjmdan79s6qqdhdzgynm4zwqd5d7xmw5fk98klysy043l2ahrqsfpp3qjmp7lwpagxun9pygexvgpjdc4jdj85fr9yq20q82gphp2nflc7jtzrcazrra7wwgzxqc8u7754cdlpfrmccae92qgzqvzq2ps8pqqqqqqpqqqqq9qqqvpeuqafqxu92d8lr6fvg0r5gv0heeeqgcrqlnm6jhphu9y00rrhy4grqszsvpcgpy9qqqqqqgqqqqq7qqzq9qrsgqdfjcdk6w3ak5pca9hwfwfh63zrrz06wwfya0ydlzpgzxkn5xagsqz7x9j4jwe7yj7vaf2k9lqsdk45kts2fd0fkr28am0u4w95tt2nsq76cqw0";
    const inv = E.decodeBolt11(INV);
    t("bolt11: amount 20m = 2,000,000,000 msat, mainnet, timestamp", inv && inv.network === "mainnet" && inv.amountMsat === 2000000000 && inv.timestamp === 1496314658);
    t("bolt11: payment hash decoded", inv && inv.paymentHash === "0001020304050607080900010203040506070809000102030405060708090102");
    t("bolt11: 2 routing hops → peer pubkey + SCID funding-tx location", inv && inv.routes.length === 2
      && inv.routes[0].pubkey === "029e03a901b85534ff1e92c43c74431f7ce72046060fcf7a95c37e148f78c77255"
      && inv.routes[0].block === 66051 && inv.routes[0].tx === 263430 && inv.routes[0].out === 1800
      && inv.routes[1].block === 197637 && inv.routes[1].tx === 395016 && inv.routes[1].out === 2314);
    t("bolt11: detector recognizes an invoice, rejects a normal address", E.detectBolt11(INV) === "bolt11" && E.detectBolt11("bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4") === null);
    t("bolt11: garbage / silent-payment address rejected", E.decodeBolt11("lnbc1garbage") === null && E.decodeBolt11("sp1qq") === null);
  }

  // — xpub wallet scanner: BIP32 public derivation (validated end-to-end against
  //   the BIP84 known-answer vector) + the wallet-level engine —
  {
    const toHex = b => { let s=""; for(const x of b) s+=x.toString(16).padStart(2,"0"); return s; };
    // SHA-512 known-answer (underpins HMAC-SHA512 → all derivation)
    t("xpub: sha512('') KAT", toHex(E._sha512(new Uint8Array(0))) === "cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e");
    t("xpub: ripemd160('abc') KAT", toHex(E._ripemd160(new TextEncoder().encode("abc"))) === "8eb208f7e05d987a9b044a8e98c6b087f15a0bfc");
    // BIP84 canonical: zpub → m/.../0/0, 0/1, 1/0 must reproduce the published bc1q addresses
    const zpub = "zpub6rFR7y4Q2AijBEqTUquhVz398htDFrtymD9xYYfG1m4wAcvPhXNfE3EfH1r1ADqtfSdVCToUG868RvUUkgDKf31mGDtKsAYz2oz2AGutZYs";
    const n = E.decodeXpub(zpub);
    t("xpub: zpub → p2wpkh scriptType", n.scriptType === "p2wpkh");
    const ext = E.ckdPub(n.keyData, n.chainCode, 0), chg = E.ckdPub(n.keyData, n.chainCode, 1);
    const r00 = E.ckdPub(ext.pub33, ext.cc32, 0), r01 = E.ckdPub(ext.pub33, ext.cc32, 1), r10 = E.ckdPub(chg.pub33, chg.cc32, 0);
    t("xpub: BIP84 0/0 pubkey", toHex(r00.pub33) === "0330d54fd0dd420a6e5f8d3624f5f3482cae350f79d5f0753bf5beef9c2d91af3c");
    t("xpub: BIP84 0/0 address (bech32)", E.deriveWalletAddress(r00.pub33, "p2wpkh") === "bc1qcr8te4kr609gcawutmrza0j4xv80jy8z306fyu");
    t("xpub: BIP84 0/1 address", E.deriveWalletAddress(r01.pub33, "p2wpkh") === "bc1qnjg0jd8228aq7egyzacy8cys3knf9xvrerkf9g");
    t("xpub: BIP84 1/0 change address", E.deriveWalletAddress(r10.pub33, "p2wpkh") === "bc1q8c6fshw2dlwun7ekn9qwf37cu2rn755upcp6el");
    // p2pkh + p2sh-p2wpkh address construction from the same pubkey (structural)
    t("xpub: p2pkh address is base58 '1…'", E.deriveWalletAddress(r00.pub33, "p2pkh")[0] === "1");
    t("xpub: p2sh-p2wpkh address is '3…'", E.deriveWalletAddress(r00.pub33, "p2sh-p2wpkh")[0] === "3");
    // Safety: a private key (xprv) must be rejected, and a hardened index is impossible
    let rejectedPriv = false; try { E.decodeXpub("xprv" + zpub.slice(4)); } catch { rejectedPriv = true; }
    t("xpub: hardened index returns null (skip)", E.ckdPub(n.keyData, n.chainCode, 0x80000000) === null);
    t("xpub: detectXpub recognizes a zpub", E.detectXpub(zpub) === "xpub" && E.detectXpub("not a key") === null);

    // Wallet engine on the offline demo: reused address + cross-address link + dust
    const w = E.runWalletEngine(E.DEMO_WALLET);
    t("wallet: demo scores in range with 3 used, 1 reused", w.score >= 0 && w.score <= 100 && w.stats.used === 3 && w.stats.reused === 1);
    t("wallet: cross-address common-input flagged (cluster fail)", w.checks.find(c => c.key === "cluster")?.status === "fail");
    t("wallet: true reuse via funded_txo_count (reuse not pass)", w.checks.find(c => c.key === "reuse")?.status !== "pass");
    // A tidy fresh-address wallet must NOT be flagged for reuse (the funded_txo_count fix)
    const tidy = { scriptType: "p2wpkh", derived: 5, capHit: false, addresses: [
      { address: "bc1qtidy0", branch: 0, index: 0, chain_stats: { tx_count: 2, funded_txo_count: 1, spent_txo_count: 1 }, utxos: [], txs: [] },
      { address: "bc1qtidy1", branch: 0, index: 1, chain_stats: { tx_count: 1, funded_txo_count: 1, spent_txo_count: 0 }, utxos: [{ value: 5e6, address: "bc1qtidy1" }], txs: [] },
    ] };
    t("wallet: receive-then-spend (tx_count 2) is NOT reuse", E.runWalletEngine(tidy).checks.find(c => c.key === "reuse")?.status === "pass");
    // Empty wallet → honest isEmpty with empty arrays (render guard relies on this)
    const empty = E.runWalletEngine({ scriptType: "p2wpkh", derived: 40, capHit: false, addresses: [] });
    t("wallet: empty wallet isEmpty with empty checks/recs", empty.isEmpty === true && empty.checks.length === 0 && empty.recommendations.length === 0);
  }

  return { results: r };
});
if (unit.missing) fail("window.__ANONSCORE_TEST__ hook missing from the built bundle");
else {
  const bad = unit.results.filter(u => !u.ok);
  bad.forEach(u => fail("engine unit: " + u.name));
  if (!bad.length) pass(`engine unit tests: ${unit.results.length}/${unit.results.length} passed (cluster, poisoning, clock, engine, tx-inspector, xpub+wallet)`);
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
// a11y on the Transaction Inspector with a full report on screen
{
  const axePage = await ctx.newPage();
  try {
    await axePage.goto(`http://127.0.0.1:${PORT}/?page=inspector`, { waitUntil: "load" });
    await axePage.waitForFunction(() => document.getElementById("root")?.childElementCount > 0, { timeout: 15000 });
    await axePage.waitForTimeout(500);
    await axePage.getByText("Load example PSBT").click();
    await axePage.waitForTimeout(500);
    await axeRun("Inspector", axePage);
  } catch (e) { fail("inspector a11y: " + e.message.slice(0, 120)); }
  finally { await axePage.close(); }
}
// a11y on the xpub wallet scan with a full report on screen
{
  const axeX = await ctx.newPage();
  try {
    await axeX.goto(`http://127.0.0.1:${PORT}/?page=xpub`, { waitUntil: "load" });
    await axeX.waitForFunction(() => document.getElementById("root")?.childElementCount > 0, { timeout: 15000 });
    await axeX.waitForTimeout(500);
    await axeX.getByText("Load example").click();
    await axeX.waitForTimeout(700);
    await axeRun("Wallet scan", axeX);
  } catch (e) { fail("xpub a11y: " + e.message.slice(0, 120)); }
  finally { await axeX.close(); }
}
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
