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
console.log("[1/5] Build invariants");
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

// Service worker must have a build hash injected (not the placeholder).
const swCode = readFileSync(join(ROOT, "sw.js"), "utf8");
if (swCode.includes("__BUILD_HASH__")) fail("sw.js still has __BUILD_HASH__ placeholder — run `npm run build`");
else if (!/anonscore-[a-f0-9]{12}/.test(swCode)) fail("sw.js cache key not in expected anonscore-<hash> format");
else pass(`sw.js cache key stamped (${swCode.match(/anonscore-[a-f0-9]{12}/)[0]})`);

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
// 2. Spin up local server serving the actual production files
// ───────────────────────────────────────────
console.log("[2/5] Local server");
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
console.log("[3/5] Smoke test (real browser)");
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

// Run a demo scan end-to-end
console.log("[4/5] Demo scan flow");
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
console.log("[5/5] Same-origin network check");
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
