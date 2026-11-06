#!/usr/bin/env node
// Concatenates the src/ modules in MODULES order, then compiles that script to
// anonscore.js (plain browser JS, classic React runtime). The site loads the
// compiled file directly — no in-browser Babel, no ES module graph.
//
// The modules share one script scope. They do not import or export each other;
// a name defined in an earlier file is visible to every later file, same as
// when this app lived in a single anonscore.jsx. Keep MODULES in this order.
// Run after editing src/:  npm run build
//
// This used to stamp a per-build content hash into sw.js. That hash changed on
// every build and collided whenever two code PRs were open. The service worker
// uses stale-while-revalidate (see sw.js), so nothing here touches sw.js.
import { transformSync } from "@babel/core";
import presetReact from "@babel/preset-react";
import { readFileSync, writeFileSync, realpathSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";

const root = dirname(fileURLToPath(import.meta.url));

// Top to bottom, the order the single file used to read. Do not sort.
export const MODULES = [
  "src/theme.jsx",            // CSS, design tokens, score color and grade
  "src/copy.jsx",             // landing facts, funding, newsletter, coach
  "src/i18n.jsx",             // STRINGS, language detection
  "src/client/relay.jsx",     // relay URL and on/off state
  "src/client/explorer.jsx",  // block-explorer choice
  "src/catalog/tools.jsx",    // tool and affiliate URLs
  "src/catalog/wallets.jsx",  // wallet directory data
  "src/catalog/cases.jsx",    // case-file data
  "src/storage.jsx",          // scan history and dismissed fixes
  "src/ui/marks.jsx",         // icons, case art, check lists, scan steps
  "src/scoring/classify.jsx", // UTXO class and CoinJoin shape
  "src/codec/bytes.jsx",      // hex, SHA-256, bech32
  "src/codec/payments.jsx",   // silent payments, BOLT11/12, LNURL, Cashu, base58
  "src/tx/parse.jsx",         // raw transaction and PSBT parser
  "src/tx/analyze.jsx",       // tx privacy analysis, lookup, fingerprint
  "src/tx/send.jsx",          // before-you-send check and coin control
  "src/wallet/hd.jsx",        // BIP32, xpub scan, wallet engine
  "src/scoring/engine.jsx",   // Bitcoin score (11 heuristics)
  "src/client/chain.jsx",     // address fetch and demo data
  "src/scoring/lightning.jsx",// Lightning fetch and score
  "src/format.jsx",           // formatters, plain English, input detection
  "src/ui/primitives.jsx",    // tags, nav, toast, score ring
  "src/ui/share.jsx",         // PNG share card
  "src/ui/trust.jsx",         // relay toggle and public guarantees
  "src/ui/cases.jsx",         // case-file pages
  "src/ui/landing.jsx",       // landing and scanning
  "src/ui/charts.jsx",        // charts, funding modal, newsletter form
  "src/ui/inspector.jsx",     // transaction inspector
  "src/ui/xpub.jsx",          // xpub scan page
  "src/ui/wallets.jsx",       // wallet directory page
  "src/ui/coach.jsx",         // coach waitlist
  "src/ui/assistant.jsx",     // AI consent gate and chat
  "src/scoring/exposure.jsx", // cluster, linkage map, poisoning, activity clock
  "src/ui/methodology.jsx",   // methodology page
  "src/scoring/verdict.jsx",  // plain verdict and how-to copy
  "src/share/plan.jsx",       // redacted share report and privacy plan
  "src/ui/dashboard.jsx",     // address results
  "src/ui/lightning.jsx",     // Lightning results
  "src/app.jsx",              // shell, routing, test hook, mount
];

export function readAppSource(dir = root) {
  return MODULES.map((rel) => {
    const text = readFileSync(join(dir, rel), "utf8");
    if (!text.endsWith("\n")) throw new Error(rel + " must end with a newline");
    return text;
  }).join("");
}

export function compileApp(src) {
  const { code } = transformSync(src, {
    // classic runtime: emits React.createElement, so the page's global React
    // (loaded as a UMD <script>) is used — no ESM react/jsx-runtime import.
    presets: [[presetReact, { runtime: "classic" }]],
    compact: false,
    comments: false,
    sourceMaps: false,
  });
  const banner = "/* AUTO-GENERATED from src/ by build.mjs — do not edit directly. Run `npm run build`. */\n";
  return banner + code;
}

export function build() {
  const compiled = compileApp(readAppSource(root));
  writeFileSync(join(root, "anonscore.js"), compiled);
  console.log("Built anonscore.js (" + compiled.length + " bytes) from " + MODULES.length + " modules");
  return compiled;
}

function invokedDirectly() {
  const entry = process.argv[1];
  if (!entry) return false;
  try {
    return import.meta.url === pathToFileURL(realpathSync(entry)).href;
  } catch {
    return false;
  }
}

if (invokedDirectly()) build();
