#!/usr/bin/env node
// Compiles anonscore.jsx -> anonscore.js (plain browser JS, classic React runtime).
// The site loads the compiled anonscore.js directly — no in-browser Babel.
// Run after editing anonscore.jsx:  npm run build
//
// Note: this used to also stamp a per-build content hash into sw.js's cache key
// so a new deploy busted the old cache. That hash changed on every build and
// collided (merge conflicts) whenever two code PRs were open at once. The
// service worker now uses stale-while-revalidate (see sw.js), so freshness no
// longer depends on the cache name — nothing here needs to touch sw.js.
import { transformSync } from "@babel/core";
import presetReact from "@babel/preset-react";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = dirname(fileURLToPath(import.meta.url));
const src = readFileSync(join(root, "anonscore.jsx"), "utf8");

const { code } = transformSync(src, {
  // classic runtime: emits React.createElement, so the page's global `React`
  // (loaded as a UMD <script>) is used — no ESM `react/jsx-runtime` import.
  presets: [[presetReact, { runtime: "classic" }]],
  compact: false,
  comments: false,
  sourceMaps: false,
});

const banner = "/* AUTO-GENERATED from anonscore.jsx by build.mjs — do not edit directly. Run `npm run build`. */\n";
const compiled = banner + code;
writeFileSync(join(root, "anonscore.js"), compiled);
console.log("Built anonscore.js (" + compiled.length + " bytes)");
