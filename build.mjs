#!/usr/bin/env node
// Compiles anonscore.jsx -> anonscore.js (plain browser JS, classic React runtime).
// Also stamps a short content hash into sw.js so a new deploy busts the old cache.
// The site loads the compiled anonscore.js directly — no in-browser Babel.
// Run after editing anonscore.jsx:  npm run build
import { transformSync } from "@babel/core";
import presetReact from "@babel/preset-react";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createHash } from "node:crypto";

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

// Stamp a content hash into sw.js so a new deploy invalidates the cache.
// The hash covers everything the SW precaches, so any change here triggers
// fresh fetches in already-installed clients on next visit.
const indexHtml = readFileSync(join(root, "index.html"), "utf8");
const precacheBytes = [
  compiled,
  indexHtml,
  readFileSync(join(root, "sw-register.js")),
  readFileSync(join(root, "manifest.webmanifest")),
  readFileSync(join(root, "vendor/react.production.min.js")),
  readFileSync(join(root, "vendor/react-dom.production.min.js")),
  readFileSync(join(root, "vendor/confetti.browser.min.js")),
  readFileSync(join(root, "vendor/dom-to-image-more.min.js")),
  readFileSync(join(root, "vendor/fonts/fonts.css")),
  readFileSync(join(root, "vendor/icon-192.png")),
  readFileSync(join(root, "vendor/icon-512.png")),
];
const hash = createHash("sha256");
precacheBytes.forEach((b) => hash.update(b));
const buildHash = hash.digest("hex").slice(0, 12);

const swSrc = readFileSync(join(root, "sw.js"), "utf8");
const swOut = swSrc.replace(/anonscore-[a-f0-9_]{6,}|anonscore-__BUILD_HASH__/g, "anonscore-" + buildHash);
writeFileSync(join(root, "sw.js"), swOut);
console.log("Stamped sw.js cache key: anonscore-" + buildHash);
