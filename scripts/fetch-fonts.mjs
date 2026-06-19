#!/usr/bin/env node
// Downloads all .woff2 files referenced by vendor/fonts/fonts.css to vendor/fonts/
// and rewrites the URLs to relative paths. Self-hosts Google Fonts (no third-party requests).
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { createWriteStream } from "node:fs";
import { get } from "node:https";
import { basename } from "node:path";

const cssPath = "vendor/fonts/fonts.css";
const css = readFileSync(cssPath, "utf8");
const urls = [...new Set(css.match(/https:\/\/fonts\.gstatic\.com[^)]+\.woff2/g) || [])];
console.log(`Downloading ${urls.length} woff2 files...`);

const download = (url) => new Promise((res, rej) => {
  const fname = basename(url);
  const out = `vendor/fonts/${fname}`;
  if (existsSync(out)) return res({ fname, skipped: true });
  get(url, (r) => {
    if (r.statusCode !== 200) return rej(new Error(`${url} -> ${r.statusCode}`));
    const f = createWriteStream(out);
    r.pipe(f);
    f.on("finish", () => f.close(() => res({ fname, skipped: false, size: r.headers["content-length"] })));
  }).on("error", rej);
});

const results = await Promise.all(urls.map(download));
results.forEach(r => console.log(r.skipped ? `  cached: ${r.fname}` : `  fetched: ${r.fname} (${r.size}b)`));

// Rewrite CSS: replace https://fonts.gstatic.com/...filename.woff2 with ./filename.woff2 (relative to fonts.css)
const newCss = css.replace(/https:\/\/fonts\.gstatic\.com[^)]+\/([^/)]+\.woff2)/g, "./$1");
writeFileSync(cssPath, newCss);
console.log(`Rewrote ${cssPath} to use local paths.`);
