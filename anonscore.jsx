const { useState, useEffect, useCallback, useRef, useMemo } = React;

/* ─────────────────────────────────────────────
   GLOBAL CSS
───────────────────────────────────────────── */
const CSS = `
/* Fonts are loaded via a preconnected <link> in index.html (faster than @import). */
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{background:#0b0d14;color:#e6edf3;font-family:'Outfit',sans-serif;-webkit-font-smoothing:antialiased}
input,button,select,textarea{font-family:'Outfit',sans-serif;-webkit-tap-highlight-color:transparent}
::selection{background:#22D3EE25;color:#e6edf3}
::-webkit-scrollbar{width:4px;height:4px}
::-webkit-scrollbar-track{background:#13151f}
::-webkit-scrollbar-thumb{background:#2a2d3a;border-radius:4px}
@keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes slideDown{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}
@keyframes toastIn{from{opacity:0;transform:translateY(10px) scale(.96)}to{opacity:1;transform:none}}
@keyframes toastOut{to{opacity:0;transform:translateY(6px)}}
@keyframes factIn{from{opacity:0;transform:translateX(-10px)}to{opacity:1;transform:none}}
@keyframes demoSlide{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
@keyframes scanPulse{0%,100%{background:#22D3EE22}50%{background:#22D3EE44}}
@keyframes borderGlow{0%,100%{box-shadow:0 0 0 0 #22D3EE22}50%{box-shadow:0 0 0 6px #22D3EE00}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
@keyframes orb{0%,100%{opacity:.12;transform:scale(1)}50%{opacity:.22;transform:scale(1.1)}}
@keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
@keyframes nodePulse{0%,100%{opacity:.4}50%{opacity:1}}
@keyframes lineIn{from{stroke-dashoffset:200}to{stroke-dashoffset:0}}
@keyframes popIn{0%{opacity:0;transform:scale(.4)}65%{opacity:1;transform:scale(1.08)}100%{opacity:1;transform:scale(1)}}
@keyframes checkPop{0%{transform:scale(0) rotate(-45deg)}55%{transform:scale(1.25) rotate(8deg)}100%{transform:scale(1) rotate(0)}}
@keyframes scanLink{from{stroke-dashoffset:120;opacity:.1}to{stroke-dashoffset:0;opacity:.65}}
@keyframes scanRing{0%{transform:scale(.4);opacity:.55}100%{transform:scale(2.4);opacity:0}}
@keyframes shake{0%,100%{transform:translateX(0)}10%,30%,50%,70%,90%{transform:translateX(-3px)}20%,40%,60%,80%{transform:translateX(3px)}}
.dot-grid{background-image:radial-gradient(circle,#ffffff06 1px,transparent 1px);background-size:24px 24px}
.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
:focus-visible{outline:2px solid #22D3EE;outline-offset:2px;border-radius:4px}
input:focus-visible,button:focus-visible{outline-offset:2px}
/* ── Motion & interaction layer (cyberpunk depth) ── */
@keyframes auroraDrift{0%{transform:translate3d(-3%,-2%,0) scale(1)}50%{transform:translate3d(4%,3%,0) scale(1.14)}100%{transform:translate3d(-3%,-2%,0) scale(1)}}
@keyframes sheenSweep{0%{transform:translateX(-150%) skewX(-18deg)}55%,100%{transform:translateX(260%) skewX(-18deg)}}
@keyframes scanSweep{0%{transform:translateY(-130%)}100%{transform:translateY(130%)}}
@keyframes accentGlow{0%,100%{text-shadow:0 0 18px #22D3EE3a}50%{text-shadow:0 0 34px #22D3EE99}}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
.blink{animation:blink 1s step-end infinite}
@keyframes breathe{0%,100%{box-shadow:0 0 50px -14px #22D3EE40}50%{box-shadow:0 0 66px -8px #22D3EE73}}
@keyframes dotPulse{0%,100%{box-shadow:0 0 8px #F7931A,0 0 0 0 #F7931A66}70%{box-shadow:0 0 8px #F7931A,0 0 0 9px #F7931A00}}
@keyframes barGrow{from{width:0}to{width:var(--w,100%)}}
@keyframes clusterIn{from{opacity:0}to{opacity:1}}
@keyframes haloPulse{0%,100%{opacity:.1}50%{opacity:.28}}
.reveal{opacity:0;transform:translateY(26px);transition:opacity .7s cubic-bezier(.16,.84,.44,1),transform .7s cubic-bezier(.16,.84,.44,1);will-change:opacity,transform}
.reveal.in{opacity:1;transform:none}
.lift{transition:transform .28s cubic-bezier(.16,.84,.44,1),box-shadow .28s,border-color .28s}
.lift:hover{transform:translateY(-4px)}
.glow-c{transition:box-shadow .25s,border-color .25s,transform .25s}
.glow-c:hover{box-shadow:0 0 26px -8px #22D3EE99;border-color:#22D3EE77}
.glow-o{transition:box-shadow .25s,border-color .25s,transform .25s}
.glow-o:hover{box-shadow:0 0 26px -8px #F7931A99;border-color:#F7931A77}
.sheen{position:relative;overflow:hidden;isolation:isolate}
.sheen::after{content:"";position:absolute;top:0;left:0;width:55%;height:100%;background:linear-gradient(100deg,transparent,#ffffff5a,transparent);transform:translateX(-150%) skewX(-18deg);pointer-events:none;z-index:1}
.sheen:hover::after{animation:sheenSweep .85s cubic-bezier(.16,.84,.44,1)}
.aurora{position:absolute;border-radius:50%;filter:blur(64px);pointer-events:none;will-change:transform;animation:auroraDrift 22s ease-in-out infinite}
.accent-glow{animation:accentGlow 4.5s ease-in-out infinite}
.scan-ov{position:absolute;inset:0;pointer-events:none;overflow:hidden;z-index:0}
.scan-ov::before{content:"";position:absolute;left:0;right:0;height:38%;background:linear-gradient(180deg,transparent,#22D3EE10 55%,transparent);animation:scanSweep 8s linear infinite}
/* ── Site-wide ambient backdrop (fixed, z:-1, behind every page) ── */
@keyframes ambDrift{0%,100%{transform:translate3d(-2%,-1%,0) scale(1)}50%{transform:translate3d(3%,2.5%,0) scale(1.12)}}
.amb{position:absolute;border-radius:50%;pointer-events:none;will-change:transform;animation:ambDrift 46s ease-in-out infinite}
.bg-noise{position:absolute;inset:0;pointer-events:none;opacity:.03;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");background-size:180px 180px}
.hairline-x{border-top:1px solid transparent;border-bottom:1px solid transparent;border-image:linear-gradient(90deg,transparent,#22D3EE3d 28%,#F7931A3d 72%,transparent) 1}
@media (prefers-reduced-motion: reduce){
  *,*::before,*::after{animation-duration:.001ms!important;animation-iteration-count:1!important;transition-duration:.001ms!important}
  .reveal{opacity:1!important;transform:none!important}
  .aurora,.accent-glow,.scan-ov::before,.amb{animation:none!important}
}
`;

/* ─────────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────────── */
const T = {
  bg:       "#0b0d14",
  surface:  "#13151f",
  card:     "#181b27",
  cardAlt:  "#1e2130",
  border:   "#2a2d3a",
  borderLo: "#1e2130",
  text:     "#e8eaf6",
  textMid:  "#9096b8",
  textDim:  "#888fae",  /* clears WCAG AA 4.5:1 against bg (#0b0d14) and card (#181b27) */
  cyan:     "#22D3EE",
  cyanLo:   "#22D3EE14",
  cyanMid:  "#22D3EE28",
  amber:    "#E8A730",
  amberLo:  "#E8A73018",
  amberMid: "#E8A73040",
  btc:      "#F7931A",
  btcLo:    "#F7931A18",
  btcMid:   "#F7931A40",
  opn:      "#FF6600",  /* OPNorange family accent — cross-tool/umbrella elements only; ~6:1 on bg, clears WCAG AA */
  opnLo:    "#FF660018",
  opnMid:   "#FF660040",
  red:      "#f85149",
  redLo:    "#f8514914",
  green:    "#3fb950",
  greenLo:  "#3fb95014",
  blue:     "#58a6ff",
  blueLo:   "#58a6ff14",
  ln:       "#F59E0B",
  lnLo:     "#F59E0B14",
  lnMid:    "#F59E0B33",
  mono:     "'JetBrains Mono',monospace",
  serif:    "'Fraunces',serif",
  sans:     "'Outfit',sans-serif",
  display:  "'Oxanium',sans-serif",
};

const RISK_META = {
  critical: { color: T.red,   bg: T.redLo,   label: "Critical" },
  high:     { color: T.btc,   bg: T.btcLo,   label: "High"     },
  medium:   { color: T.amber, bg: T.amberLo, label: "Medium"   },
  low:      { color: T.blue,  bg: T.blueLo,  label: "Low"      },
  clean:    { color: T.green, bg: T.greenLo, label: "Clean"    },
};

// green ≥ 80 | amber 60–79 (moderate) | orange 40–59 (high risk) | red < 40 (critical)
const scoreColor = s => s >= 80 ? T.green : s >= 60 ? T.amber : s >= 40 ? T.btc : T.red;
const scoreLabel = s => s >= 80 ? "Low Risk" : s >= 60 ? "Moderate" : s >= 40 ? "High Risk" : "Critical";
const scoreGrade = s => s >= 90 ? "A" : s >= 75 ? "B" : s >= 60 ? "C" : s >= 45 ? "D" : "F";
// Two widths for the hero. The supporting elements (score bar, privacy panel,
// history) sit in a narrower column; the scan console — the actual tool — is
// deliberately WIDER so it breaks out of that column and is the thing the eye
// lands on. The gap between them is the point: don't collapse them back to one.
const HERO_COL = 548;   // supporting elements — the narrow column
const HERO_WIDE = 760;  // the scan console — juts out past the column, left + right

/* ─────────────────────────────────────────────
   HOISTED CONSTANTS
───────────────────────────────────────────── */
const LANDING_CHECKS = [
  { n:"01", k:"reuse",  icon:"↩", label:"Address Reuse",       desc:"Every time you reuse an address, you create a permanent public link between all your transactions." },
  { n:"02", k:"dust",   icon:"⚠", label:"Dust Attacks",        desc:"Tiny amounts sent to your wallet by trackers. Spending them reveals your wallet cluster to analysts." },
  { n:"03", k:"round",  icon:"◯", label:"Round Amounts",        desc:"Withdrawing 0.1 BTC instead of 0.10743 BTC is a primary signal that funds came from a KYC exchange." },
  { n:"04", k:"coinjoin", icon:"⊕", label:"CoinJoin Usage",     desc:"Whether your transaction history includes any mixing events that break the chain of custody." },
  { n:"05", k:"consolidation", icon:"⊞", label:"Unsafe Consolidation", desc:"Merging UTXOs from different sources permanently links those coin histories on-chain." },
  { n:"06", k:"utxo",   icon:"≣", label:"UTXO Count",           desc:"Too many UTXOs tempt consolidation. Too few exposes your full balance in every transaction." },
  { n:"07", k:"fee",    icon:"₿", label:"Fee Fingerprinting",   desc:"Using the same sat/vbyte rate every time identifies your wallet software to blockchain analysts." },
  { n:"08", k:"change", icon:"↔", label:"Change Address Reuse", desc:"Sending change back to an input address reveals your full balance to the transaction recipient." },
  { n:"09", k:"concentration", icon:"◐", label:"Balance Concentration", desc:"Holding 90%+ in a single UTXO exposes nearly your full holdings in any transaction." },
  { n:"10", k:"script", icon:"T", label:"Script Type Mix",       desc:"Mixing legacy and SegWit addresses creates analyst-exploitable patterns across your UTXO set." },
  { n:"11", k:"changeid", icon:"⇄", label:"Change Detection",     desc:"When a payment's two outputs use different address types and only one matches your input, analysts know that one is your change." },
];

const LANDING_FACTS = [
  { stat:"$8.6B",  desc:"valuation of Chainalysis — the largest blockchain-surveillance firm, whose customers include governments and exchanges (~$190M 2023 revenue)",  source:"Chainalysis Series F, May 2022", url:"https://www.chainalysis.com/blog/series-f/" },
  { stat:"§10",    desc:"of the Bitcoin whitepaper says to use a new address for every payment. Reusing one permanently links all its transactions — the most common avoidable privacy mistake.", source:"Bitcoin whitepaper (Nakamoto, 2008)", url:"https://bitcoin.org/bitcoin.pdf" },
  { stat:"546 sat",desc:"minimum dust threshold — outputs below this are used by surveillance firms as tracking beacons", source:"Bitcoin Core relay policy (GetDustThreshold)", url:"https://github.com/bitcoin/bitcoin/blob/master/src/policy/policy.cpp" },
  { stat:"~38/100", desc:"what this tool scores a typical wallet — address reuse, no CoinJoin, round-amount withdrawals. An illustrative baseline you can reproduce, not survey data.", source:"AnonScore scoring rubric — we store no scan data", url:"" },
];

/* ─────────────────────────────────────────────
   FUNDING — how AnonScore keeps the lights on, in the open.
   The tool is free for everyone, never tracks users, never sells data.
   Funding is voluntary tips + transparent affiliate links, and it's all
   disclosed to users on the "How we're paid for" page (FundingDisclosure
   component). This object is where those funding hooks are configured.
───────────────────────────────────────────── */

// Lightning + Nostr tip jar. Set these to real values when ready.
// Leave them empty strings to hide the tip jar (graceful fallback).
const FUNDING = {
  lightning: "",  // e.g. "anonscore@getalby.com" or "anonscore@strike.me"
  nostr:     "",  // e.g. "npub1..." — set to enable a "Zap on Nostr" button
};

// Newsletter signup. POSTs the email to this endpoint (set up Buttondown /
// Beehiiv / Substack / mailerlite later and drop the URL in here). Until
// then, the signup form falls back to a clean mailto: link.
const NEWSLETTER = {
  endpoint: "",                                  // e.g. "https://buttondown.email/api/emails/embed-subscribe/anonscore"
  fallbackMailto: "netassetpremium@gmail.com",   // until provider is set up
  name: "On-Chain Forensics",
  pitch: "Weekly deep-dives on notable wallets, privacy heuristics, and seizure stories.",
};

// Privacy Coach — an optional paid tier of the AI assistant (unlimited
// messages + memory across scans). This is just the waitlist landing page
// (reachable at /?page=coach, linked from the AI assistant card); the Coach
// product itself isn't built yet — we're gauging interest first.
const COACH = {
  price:        "$10",
  unit:         "/mo",
  launchTarget: "Q4 2026",
  endpoint:     "",                                // Same provider as NEWSLETTER once chosen — or a separate list
  fallbackMailto: "netassetpremium@gmail.com",
  benefits: [
    { icon: "∞",  title: "Unlimited messages",  desc: "Today's 5/day cap → none. Ask as much as you need." },
    { icon: "⏱",  title: "Persistent memory",   desc: "The Coach remembers your scans, the fixes you've shipped, and what's next." },
    { icon: "⌂",  title: "Multi-device",        desc: "Pick up where you left off across devices. Memory is passphrase-encrypted; the server can't read it." },
    { icon: "✓",  title: "Personal fix queue",  desc: "Tracked plan across all your wallets, with progress markers." },
  ],
};

/* ─────────────────────────────────────────────
   i18n — minimal, dependency-free.
   English is the default and the fallback for every key, so partial
   translations degrade gracefully (an untranslated string just renders
   in English). Locale is chosen by, in order: ?lang= param → saved
   preference → browser language → "en". Adding a locale = add its key
   map below; adding a string = add an "en" entry and reference it via t().
   Spanish first: large, active Spanish-speaking Bitcoin communities
   (Argentina, Venezuela, El Salvador, Spain, and beyond).
───────────────────────────────────────────── */
const STRINGS = {
  en: {
    "nav.free": "Free",
    "nav.nocookies": "✓ No cookies",
    "nav.nothingstored": "✓ Nothing stored",
    "nav.tor": "✓ Tor compatible",
    "nav.opensource": "✓ Open source",
    "umbrella.label": "TOOLKIT",
    "umbrella.privacy": "Privacy Audit",
    "umbrella.dca": "DCA Butler",
    "umbrella.hub": "Hub",
    "hero.eyebrow": "FREE BITCOIN & LIGHTNING PRIVACY AUDIT",
    "hero.h1.line1": "Is your Bitcoin",
    "hero.h1.line2": "stack leaking?",
    "hero.h1.em": "Find out in 60 seconds.",
    "hero.sub": "Paste a Bitcoin address or a Lightning node pubkey. Get a privacy score, every issue explained, and a ranked fix plan — free, open source, nothing stored.",
    "spectrum.low": "0 · Fully traceable",
    "spectrum.avg": "typical wallet: ~38",
    "spectrum.high": "100 · Invisible",
    "trust.btc": "₿ Addresses are public by design — we never see or store yours. The relay decides whether the explorer can see your IP too.",
    "trust.ln": "⚡ Node pubkeys are public on the gossip network — we never see or store yours. The relay decides whether mempool.space can see your IP too.",
    "relay.on.label": "Privacy relay on",
    "relay.off.label": "Privacy relay off",
    "relay.on.body": " — your IP stays hidden behind our open-source, no-log relay. The explorer ({x}) sees only the address.",
    "relay.off.body": " — lookups go straight to {x}, which sees your IP next to the address. Flip the relay on to break that link.",
    "relay.verify": "verify: relay source ↗",
    "relay.explorer": "EXPLORER",
    "relay.aria": "Route lookups through the AnonScore privacy relay to hide your IP from the block explorer",
    "rail.title": "GUARANTEES",
    "rail.foot": "Each one links to the code that proves it.",
    "open.title": "RADICALLY OPEN",
    "open.h2.pre": "Don't trust.",
    "open.h2.em": "Verify.",
    "recent.note": "Saved only in this browser's local storage — gone when you hit CLEAR ALL or clear this site's data in your browser. (Note: clearing browsing history alone doesn't remove site data.)",
    "recent.clear": "CLEAR ALL",
    // Guarantee labels (rail + trust box header chips). Keep in sync with GUARANTEES[].label.
    "g.0.label": "No server, no backend",
    "g.1.label": "Nothing stored or logged",
    "g.2.label": "Scoring runs in your browser",
    "g.3.label": "Zero third-party requests",
    "g.4.label": "Even the relay can't remember you",
    "g.5.label": "Open source, MIT, auditable in minutes",
    "cta.analyze": "Analyze →",
    "cta.audit": "⚡ Audit →",
    "sample.divider": "or try a sample",
    "sample.risky": "₿ Risky wallet",
    "sample.pristine": "✨ Pristine wallet",
    "sample.lightning": "⚡ Lightning node",
    "recent.title": "RECENT SCANS",
    "err.empty": "Please enter a Bitcoin address or Lightning node pubkey.",
    "err.invalid": "Paste a Bitcoin address (bc1…, 1…, 3…) or a Lightning node pubkey (66-char hex).",
    "err.lnaddress": "Lightning addresses can't be audited yet — paste your node's 66-character pubkey instead.",
    "finalcta.h2.a": "A typical wallet scores ~38/100.",
    "finalcta.h2.b": "Where does yours land?",
    "finalcta.sub": "Free, open source, nothing stored. Takes 60 seconds.",
    "finalcta.scan": "Scan my address ↑",
    "finalcta.sample": "▶ See a sample wallet",
    "scanning.btc.title": "Analyzing your wallet…",
    "scanning.ln.title": "Auditing your node…",
    "scanning.btc.checks": "RUNNING 10 CHECKS",
    "scanning.ln.checks": "⚡ RUNNING 8 LIGHTNING CHECKS",
    "scanning.didyouknow": "DID YOU KNOW",
  },
  es: {
    "nav.free": "Gratis",
    "nav.nocookies": "✓ Sin cookies",
    "nav.nothingstored": "✓ Nada se guarda",
    "nav.tor": "✓ Compatible con Tor",
    "nav.opensource": "✓ Código abierto",
    "umbrella.label": "KIT",
    "umbrella.privacy": "Auditoría de privacidad",
    "umbrella.dca": "DCA Butler",
    "umbrella.hub": "Hub",
    "hero.eyebrow": "AUDITORÍA GRATUITA DE PRIVACIDAD BITCOIN Y LIGHTNING",
    "hero.h1.line1": "¿Tu stack de Bitcoin",
    "hero.h1.line2": "está filtrando datos?",
    "hero.h1.em": "Descúbrelo en 60 segundos.",
    "hero.sub": "Pega una dirección de Bitcoin o la clave pública de un nodo Lightning. Obtén una puntuación de privacidad, cada problema explicado y un plan de mejora priorizado — gratis, código abierto, nada se guarda.",
    "spectrum.low": "0 · Totalmente rastreable",
    "spectrum.avg": "billetera típica: ~38",
    "spectrum.high": "100 · Invisible",
    "trust.btc": "₿ Las direcciones son públicas por diseño — nunca vemos ni guardamos la tuya. El relé decide si el explorador también puede ver tu IP.",
    "trust.ln": "⚡ Las claves de nodo son públicas en la red gossip — nunca vemos ni guardamos la tuya. El relé decide si mempool.space también puede ver tu IP.",
    "relay.on.label": "Relé de privacidad activado",
    "relay.off.label": "Relé de privacidad desactivado",
    "relay.on.body": " — tu IP queda oculta tras nuestro relé de código abierto y sin registros. El explorador ({x}) solo ve la dirección.",
    "relay.off.body": " — las consultas van directas a {x}, que ve tu IP junto a la dirección. Activa el relé para romper ese vínculo.",
    "relay.verify": "verificar: código del relé ↗",
    "relay.explorer": "EXPLORADOR",
    "relay.aria": "Enrutar las consultas por el relé de privacidad de AnonScore para ocultar tu IP al explorador de bloques",
    "rail.title": "GARANTÍAS",
    "rail.foot": "Cada una enlaza al código que la demuestra.",
    "open.title": "RADICALMENTE ABIERTO",
    "open.h2.pre": "No confíes.",
    "open.h2.em": "Verifica.",
    "recent.note": "Guardado solo en el almacenamiento local de este navegador — desaparece con BORRAR TODO o al borrar los datos de este sitio en tu navegador. (Nota: borrar solo el historial de navegación no elimina los datos del sitio.)",
    "recent.clear": "BORRAR TODO",
    "g.0.label": "Sin servidor, sin backend",
    "g.1.label": "Nada guardado ni registrado",
    "g.2.label": "El análisis corre en tu navegador",
    "g.3.label": "Cero peticiones a terceros",
    "g.4.label": "Ni el relé puede recordarte",
    "g.5.label": "Código abierto, MIT, auditable en minutos",
    "cta.analyze": "Analizar →",
    "cta.audit": "⚡ Auditar →",
    "sample.divider": "o prueba un ejemplo",
    "sample.risky": "₿ Billetera riesgosa",
    "sample.pristine": "✨ Billetera impecable",
    "sample.lightning": "⚡ Nodo Lightning",
    "recent.title": "ESCANEOS RECIENTES",
    "err.empty": "Ingresa una dirección de Bitcoin o la clave pública de un nodo Lightning.",
    "err.invalid": "Pega una dirección de Bitcoin (bc1…, 1…, 3…) o una clave pública de nodo Lightning (66 caracteres hex).",
    "err.lnaddress": "Las direcciones Lightning aún no se pueden auditar — pega la clave pública (66 caracteres hex) de tu nodo.",
    "finalcta.h2.a": "Una billetera típica puntúa ~38/100.",
    "finalcta.h2.b": "¿Dónde queda la tuya?",
    "finalcta.sub": "Gratis, código abierto, nada se guarda. Toma 60 segundos.",
    "finalcta.scan": "Escanear mi dirección ↑",
    "finalcta.sample": "▶ Ver una billetera de ejemplo",
    "scanning.btc.title": "Analizando tu billetera…",
    "scanning.ln.title": "Auditando tu nodo…",
    "scanning.btc.checks": "EJECUTANDO 10 VERIFICACIONES",
    "scanning.ln.checks": "⚡ EJECUTANDO 8 VERIFICACIONES LIGHTNING",
    "scanning.didyouknow": "¿SABÍAS QUE?",
  },
};
const SUPPORTED_LANGS = Object.keys(STRINGS);
const LANG_LABEL = { en: "EN", es: "ES" };

function detectLang() {
  try {
    const q = new URLSearchParams(window.location.search).get("lang");
    if (q && SUPPORTED_LANGS.includes(q)) return q;
    const saved = localStorage.getItem("anonscore_lang");
    if (saved && SUPPORTED_LANGS.includes(saved)) return saved;
    const nav = (navigator.language || "en").slice(0, 2).toLowerCase();
    if (SUPPORTED_LANGS.includes(nav)) return nav;
  } catch {}
  return "en";
}

let _lang = (typeof window !== "undefined") ? detectLang() : "en";
const _langListeners = new Set();
function setLang(l) {
  if (!SUPPORTED_LANGS.includes(l) || l === _lang) return;
  _lang = l;
  try { localStorage.setItem("anonscore_lang", l); } catch {}
  try { document.documentElement.lang = l; } catch {}
  _langListeners.forEach(fn => fn());
}
function t(key) {
  return (STRINGS[_lang] && STRINGS[_lang][key]) || STRINGS.en[key] || key;
}
// Hook: re-renders the calling component whenever the language changes.
function useLang() {
  const [, force] = useState(0);
  useEffect(() => {
    const fn = () => force(x => x + 1);
    _langListeners.add(fn);
    return () => { _langListeners.delete(fn); };
  }, []);
  return _lang;
}

/* Privacy relay (opt-in) ─────────────────────────────────────────────
   By default the browser queries the block explorer directly, so the explorer
   sees the visitor's IP next to the address. When this is ON *and* RELAY_URL is
   configured, lookups route through the AnonScore relay (a stateless, no-log
   Cloudflare Worker — source in workers/relay/) so the explorer sees the relay's
   IP instead. Off by default: a direct query keeps the address off our
   infrastructure entirely, which is the lower-trust-surface choice — the relay
   trades that for hiding the IP. Mirrors the language hook above.
   Dormant until configured: leave "" and the toggle stays hidden (nothing
   changes). After deploying workers/relay/, set this to the Worker's URL —
   e.g. "https://anonscore-relay.netassetpremium.workers.dev" — and rebuild;
   the toggle then appears. The relay origin is already allowed in _headers. */
const RELAY_URL = "https://anonscore-relay.netassetpremium.workers.dev";
// Default ON: the average visitor gets IP↔address unlinkability out of the box,
// and the relay is verifiably no-log (open source, stateless, observability
// pinned off). The toggle stays one click away for anyone who prefers their
// address to touch no AnonScore infrastructure at all — an explicit choice is
// saved either way and wins over the default forever after.
let _relay = (() => { try { const s = localStorage.getItem("anonscore_relay"); return s === null ? true : s === "1"; } catch { return true; } })();
const _relayListeners = new Set();
function setRelay(on) {
  _relay = !!on;
  try { localStorage.setItem("anonscore_relay", _relay ? "1" : "0"); } catch {}
  _relayListeners.forEach(fn => fn());
}
function relayOn() { return !!RELAY_URL && _relay; }
function useRelay() {
  const [, force] = useState(0);
  useEffect(() => {
    const fn = () => force(x => x + 1);
    _relayListeners.add(fn);
    return () => { _relayListeners.delete(fn); };
  }, []);
  return _relay;
}

/* BTC block-explorer choice ──────────────────────────────────────────
   Both upstreams speak the same esplora API, so they're drop-in swaps —
   direct or through the relay (which mirrors them at /btc and /btcm).
   Lightning data always comes from mempool.space's LN endpoints. */
const EXPLORERS = {
  blockstream: { label: "blockstream.info", api: "https://blockstream.info/api", relayPath: "/btc" },
  mempool:     { label: "mempool.space",    api: "https://mempool.space/api",    relayPath: "/btcm" },
};
let _explorer = (() => { try { const s = localStorage.getItem("anonscore_explorer"); return EXPLORERS[s] ? s : "blockstream"; } catch { return "blockstream"; } })();
const _explorerListeners = new Set();
function setExplorer(id) {
  if (!EXPLORERS[id]) return;
  _explorer = id;
  try { localStorage.setItem("anonscore_explorer", id); } catch {}
  _explorerListeners.forEach(fn => fn());
}
function explorer() { return EXPLORERS[_explorer]; }
function useExplorer() {
  const [, force] = useState(0);
  useEffect(() => {
    const fn = () => force(x => x + 1);
    _explorerListeners.add(fn);
    return () => { _explorerListeners.delete(fn); };
  }, []);
  return _explorer;
}

// Canonical homepage for each tool we recommend. Source of truth for outbound
// links — the recommendation text in `recs[].tools[].name` looks up here at
// render time. Adding a new tool name without a URL is fine; it just renders
// as plain text (graceful fallback).
const TOOL_URL = {
  // Desktop wallets
  "Wasabi Wallet":   "https://wasabiwallet.io",
  "Sparrow Wallet":  "https://sparrowwallet.com",
  "Bitcoin Core":    "https://bitcoincore.org",
  "Electrum":        "https://electrum.org",
  "Joinmarket":      "https://github.com/JoinMarket-Org/joinmarket-clientserver",
  "JoinStr":         "https://github.com/JoinStr",
  "BTCPay Server":   "https://btcpayserver.org",
  // Mobile wallets
  "Blue Wallet":     "https://bluewallet.io",
  "Nunchuk":         "https://nunchuk.io",
  // Lightning wallets
  "Phoenix Wallet":  "https://phoenix.acinq.co",
  "Breez":           "https://breez.technology",
  "Zeus":            "https://zeusln.app",
  "Mutiny Wallet":   "https://mutinywallet.com",
  "Blixt Wallet":    "https://blixtwallet.github.io",
  "Alby":            "https://getalby.com",
  // Non-KYC exchanges / P2P
  "Bisq":            "https://bisq.network",
  "Robosats":        "https://learn.robosats.com",
  "Peach Bitcoin":   "https://peachbitcoin.com",
  "HodlHodl":        "https://hodlhodl.com",
  "AgoraDesk":       "https://agoradesk.com",
  // Nodes / infra
  "Umbrel":          "https://umbrel.com",
  "Start9":          "https://start9.com",
  "RaspiBlitz":      "https://raspiblitz.com",
  "MyNode":          "https://mynodebtc.com",
  "Nodl":            "https://nodl.it",
  // Fee tools
  "mempool.space":   "https://mempool.space",
};

// When an affiliate program is signed up for, drop the affiliate URL here and
// it overrides the canonical TOOL_URL for that tool. Empty by default —
// every recommendation today links to the official homepage with no kickback.
// See /how-we-get-paid for the public disclosure page (lists whatever's in here).
const TOOL_AFFILIATE_URL = {
  // e.g. "Phoenix Wallet": "https://phoenix.acinq.co?ref=anonscore",
};

const toolLink = (name) => TOOL_AFFILIATE_URL[name] || TOOL_URL[name] || null;
const toolIsAffiliate = (name) => !!TOOL_AFFILIATE_URL[name];

/* ─────────────────────────────────────────────
   WALLET DIRECTORY — curated reviews of every tool the audit recommends.
   Standalone page at /?page=wallets. Each entry: factual pitch + the
   privacy STRENGTHS the tool actually delivers, plus honest WATCH-OUTS so
   visitors trust the list isn't pay-to-play. Categories let the page
   double as comparison material.
   When TOOL_AFFILIATE_URL adds an entry, that tool's "Visit" link
   auto-becomes affiliate + the page surfaces the disclosure.
───────────────────────────────────────────── */
const WALLET_CATEGORIES = [
  { key: "desktop",   label: "Desktop wallets",    icon: "🖥",  blurb: "Full coin control, the strongest privacy primitives."          },
  { key: "mobile",    label: "Mobile wallets",     icon: "📱",  blurb: "On-chain BTC in your pocket. Less privacy than desktop — pick carefully." },
  { key: "lightning", label: "Lightning wallets",  icon: "⚡",  blurb: "Off-chain payments. Self-custodial > custodial for privacy."   },
  { key: "p2p",       label: "Non-KYC exchanges",  icon: "🤝",  blurb: "Source Bitcoin without doxxing yourself to a centralised gatekeeper." },
  { key: "node",      label: "Self-hosted nodes",  icon: "📡",  blurb: "Stop leaking every address you query to public Electrum servers." },
];

const WALLET_REVIEWS = [
  // ─ Desktop ──────────────────────────────────────────
  { name: "Sparrow Wallet", category: "desktop", os: "macOS · Windows · Linux", pitch: "The pro's desktop Bitcoin wallet. Best-in-class coin control, UTXO labelling, hardware-wallet support, and Tor / your-own-node connectivity by default.",
    strengths: ["Per-UTXO freeze, label, and select before every spend", "Connects to your own Electrum server or Bitcoin Core out of the box — no leaking queries", "Silent Payments send + receive (BIP352), plus strong hardware-wallet support (Coldcard, Trezor, Ledger, Foundation, BitBox, Jade)"],
    watchOuts:  ["Desktop only — there is no mobile app", "No built-in CoinJoin since Samourai's Whirlpool was seized in 2024 (Sparrow removed the integration) — use it for coin control + Silent Payments, and mix via a separate tool if needed"] },
  { name: "Wasabi Wallet", category: "desktop", os: "macOS · Windows · Linux", pitch: "Privacy-first desktop Bitcoin wallet with WabiSabi CoinJoin and automatic coin labelling. Beginner-friendlier than Sparrow.",
    strengths: ["WabiSabi CoinJoin runs automatically once you pick a coordinator", "Default labels every coin by source, helping avoid accidental cluster merges", "Built-in Tor"],
    watchOuts:  ["Its original coordinator (zkSNACKs) shut down in 2024 — you now select a community-run coordinator via 'Change Coordinator'", "Centralized WabiSabi coordinators carry some deanonymization risk; Joinmarket avoids a coordinator entirely", "Desktop only"] },
  { name: "Ginger Wallet", category: "desktop", os: "macOS · Windows · Linux", pitch: "An open-source Wasabi fork that runs its own active WabiSabi CoinJoin coordinator — filling the gap left when the original coordinator shut down in 2024.",
    strengths: ["Ships with a working CoinJoin coordinator out of the box — no hunting for one", "Inherits Wasabi's client-side block filters, coin labelling, and built-in Tor", "Fully open source, community-maintained"],
    watchOuts:  ["Centralized WabiSabi coordinators carry some deanonymization risk — Joinmarket avoids a coordinator entirely", "Desktop only; a younger fork than upstream Wasabi"] },
  { name: "Bitcoin Core", category: "desktop", os: "macOS · Windows · Linux · BSD", pitch: "The reference Bitcoin implementation. The wallet is bundled with a full node, so by definition you query no one but yourself.",
    strengths: ["You ARE your own node — no third-party query leaks possible", "Maximum sovereignty + verification", "Free and battle-tested since 2009"],
    watchOuts:  ["Initial block download requires ~600GB and several days", "UX is functional, not friendly — best paired with a wallet front-end (Sparrow, Electrum, Specter)"] },
  { name: "Electrum", category: "desktop", os: "macOS · Windows · Linux · Android", pitch: "Long-standing lightweight Bitcoin wallet. Fast, scriptable, deeply customisable, with manual coin control.",
    strengths: ["Lightweight — no full-node download needed", "Manual coin control via the Coins tab + UTXO freezing", "Connects to your own Electrum / Bitcoin-Core-with-Electrs server"],
    watchOuts:  ["Default connects to public Electrum servers — change this to your own node before scanning real addresses", "Multiple lookalike fake-Electrum scam wallets exist; verify download signatures"] },
  { name: "Joinmarket", category: "desktop", os: "macOS · Windows · Linux", pitch: "Peer-to-peer CoinJoin protocol where 'makers' earn fees and 'takers' pay them. No operator-run coordinator.",
    strengths: ["No central coordinator — fully P2P, harder to censor or seize", "Earn yield as a maker while improving network-wide privacy", "Mature codebase (since 2015)"],
    watchOuts:  ["Steep learning curve — CLI-first; the YieldGenerator GUI is improving but rough", "Best for users comfortable running a Bitcoin Core node"] },
  { name: "BTCPay Server", category: "desktop", os: "Self-hosted (Docker / Lightning Node)", pitch: "Self-hosted Bitcoin + Lightning payment processor. Merchants own their keys and node — no third-party seeing every payment.",
    strengths: ["Replaces BitPay-style processors that doxx every customer", "Built-in Payjoin + CoinJoin support for merchant flows", "Plugin ecosystem (point-of-sale, accounting, gift cards)"],
    watchOuts:  ["You're running infrastructure — backups, updates, and uptime are on you", "Best for merchants and power users; not a personal wallet"] },

  // ─ Mobile ──────────────────────────────────────────
  { name: "Cake Wallet", category: "mobile", os: "iOS · Android · macOS", pitch: "Open-source mobile wallet for Bitcoin and Monero that brings desktop-grade privacy features — Silent Payments and Payjoin — to your phone.",
    strengths: ["Silent Payments send + receive with on-device scanning (the server never learns which outputs are yours)", "Payjoin v2 in the default send flow — breaks the common-input heuristic on ordinary payments", "Open source; also holds Monero for cross-chain privacy"],
    watchOuts:  ["Multi-coin app is heavier than a Bitcoin-only wallet", "Built-in swap/exchange services are third parties — using them can pull in KYC"] },
  { name: "Blue Wallet", category: "mobile", os: "iOS · Android", pitch: "Open-source mobile Bitcoin wallet with HD support, multisig, Lightning (via LndHub), and Tor.",
    strengths: ["HD wallet — fresh address per receive by default, plus Silent Payments receiving (BIP352)", "Optional Tor for connection privacy", "Multisig (Vault) support"],
    watchOuts:  ["Default Lightning is custodial (LndHub) — fine for spending money, not savings", "Mobile means limited coin control vs. desktop"] },
  { name: "Nunchuk", category: "mobile", os: "iOS · Android · macOS · Windows · Linux", pitch: "Privacy-focused multisig wallet with strong UTXO management and collaborative custody.",
    strengths: ["First-class multisig + assisted recovery", "Per-UTXO tagging and coin control, plus Silent Payments receiving (BIP352)", "Works with most hardware wallets"],
    watchOuts:  ["Some features (key recovery service) involve trusting Nunchuk Pro — read the model before enabling", "Best for users already comfortable with multisig concepts"] },

  // ─ Lightning ──────────────────────────────────────────
  { name: "Phoenix Wallet", category: "lightning", os: "iOS · Android", pitch: "Self-custodial mobile Lightning by ACINQ. Channels managed automatically — feels custodial, but the keys are yours.",
    strengths: ["You hold the keys — true self-custody", "Channels open and rebalance themselves; no liquidity management needed", "Tor-friendly"],
    watchOuts:  ["ACINQ is the only LSP — single peer is fine for spending, less so for receiving large amounts", "Splice/channel fees are unavoidable when on-chain settlement happens"] },
  { name: "Breez", category: "lightning", os: "iOS · Android", pitch: "Self-custodial mobile Lightning wallet with a built-in podcast player and merchant point-of-sale.",
    strengths: ["Self-custodial Lightning + on-chain in one app", "Built-in keysend & podcast support (LN over RSS)", "POS mode for merchants"],
    watchOuts:  ["Like all auto-channel-opening LN wallets, you trust the LSP not to grief during channel opens", "Receive UX can be confusing for first-timers (channel-open fees on first receive)"] },
  { name: "Zeus", category: "lightning", os: "iOS · Android", pitch: "Connect your own LND, CLN, or Eclair node from your phone. Power-user remote control.",
    strengths: ["You run the node — zero LSP / operator trust", "Supports LND, Core Lightning (CLN), Eclair, Embedded LND", "Per-channel routing controls"],
    watchOuts:  ["Requires you to already have a Lightning node — not a beginner starting point", "Mobile connection back to your node needs careful Tor / VPN setup"] },
  { name: "Mutiny Wallet", category: "lightning", os: "Web (PWA) · Android", pitch: "Self-custodial Lightning + on-chain wallet that runs in your browser. No app store.",
    strengths: ["PWA — no app store to deplatform you", "Self-custodial Lightning via LDK", "Built-in Nostr Wallet Connect (NWC) for zaps"],
    watchOuts:  ["Browser environment means cookies/storage hygiene matters", "Younger codebase than Phoenix or Breez; treat as 'spending money', not 'cold storage'"] },
  { name: "Blixt Wallet", category: "lightning", os: "Android · macOS · Windows · Linux", pitch: "Runs a full LND node directly on your phone — no LSP, no custodian, no compromises.",
    strengths: ["Embedded LND node — you ARE the Lightning node", "Full feature set: keysend, AMP, MPP, splicing, BOLT-12", "Open source, no telemetry"],
    watchOuts:  ["You must manage channels and liquidity yourself", "Battery drain higher than auto-channel wallets — needs to stay online to route"] },
  { name: "Alby", category: "lightning", os: "Browser extension (Chrome / Firefox / Safari)", pitch: "Browser-side Lightning + Nostr identity. Zaps, podcasting, and WebLN-enabled apps without leaving the page.",
    strengths: ["WebLN brings one-click LN payments to web apps", "Nostr signing built in — one extension covers both protocols", "Account → Alby Hub option lets you self-host the back-end"],
    watchOuts:  ["The hosted Alby account is custodial unless you migrate to Alby Hub", "Browser extension model means an attacker who compromises the browser sees your keys"] },

  // ─ Non-KYC exchanges / P2P ──────────────────────────────────────────
  { name: "Bisq", category: "p2p", os: "macOS · Windows · Linux", pitch: "Decentralised peer-to-peer Bitcoin exchange. Trades happen over Tor with two-of-two multisig escrow — no custodian.",
    strengths: ["No KYC, no account, no operator that can be subpoenaed", "Tor-only by default", "Multisig escrow means even a fraudulent counterparty can't take your funds"],
    watchOuts:  ["Liquidity is thinner than KYC venues — expect higher spreads and slower fills", "Bisq2 (the rewrite) is still maturing; Bisq1 will sunset eventually"] },
  { name: "Robosats", category: "p2p", os: "Web (Tor) · Android", pitch: "Lightning-based peer-to-peer Bitcoin exchange. Trades complete in minutes via hold invoices — no custody, no signup.",
    strengths: ["Tor-native + Lightning-fast settlement", "No account, no email, no KYC ever", "Reputation system built around hashed-key identities, not real names"],
    watchOuts:  ["Lower-volume than Bisq for large trades", "You need a Lightning wallet that supports hold invoices (most do, some don't)"] },
  { name: "Peach Bitcoin", category: "p2p", os: "iOS · Android", pitch: "Mobile peer-to-peer Bitcoin marketplace. SEPA, cash-by-mail, and many other payment methods supported.",
    strengths: ["Mobile-first — easier than Bisq for non-technical users", "Wide payment-method support per region", "Optional escrow"],
    watchOuts:  ["Operator-run platform — not as censorship-resistant as Bisq", "Mobile means you trust your phone OS — use a privacy-respecting handset"] },
  { name: "HodlHodl", category: "p2p", os: "Web", pitch: "Non-custodial P2P marketplace using on-chain multisig escrow. Years of operation, broad payment-method support.",
    strengths: ["Multisig escrow — funds locked in 2-of-3 between buyer, seller, HodlHodl arbiter", "Lots of payment methods including cash-by-mail", "Long operating history"],
    watchOuts:  ["Web-only — Tor recommended", "Arbiter participates in escrow; choose counterparties with established reputation"] },
  { name: "AgoraDesk", category: "p2p", os: "Web", pitch: "Peer-to-peer marketplace evolved from LocalBitcoins-style trading. Supports cash-in-person and many fiat methods.",
    strengths: ["Cash-in-person and cash-by-mail support is rare and valuable", "No mandatory KYC for most trades"],
    watchOuts:  ["Operator-run — you trust AgoraDesk's arbitration", "Cash-in-person trades carry physical-safety considerations; meet in public"] },

  // ─ Nodes ──────────────────────────────────────────
  { name: "Umbrel", category: "node", os: "Raspberry Pi · Linux · Umbrel Home (hardware)", pitch: "App-store-style plug-and-play personal server. Bitcoin + Lightning + dozens of self-hostable apps.",
    strengths: ["One-click app installs — easiest path to your own node", "Includes Bitcoin Core, LND, and Electrs out of the box", "Active community + frequent updates"],
    watchOuts:  ["Umbrel OS opens an attack surface — keep it on a separate VLAN, don't expose to the internet without Tor", "App-store model means trusting Umbrel's app review for any add-ons you install"] },
  { name: "Start9", category: "node", os: "StartOS (purpose-built) · Server Hardware", pitch: "Sovereignty-focused Linux distro for self-hosting. Strong privacy and security defaults — Tor by default, no remote telemetry.",
    strengths: ["Tor everywhere by default — clearnet is opt-in", "Reproducible builds for every service", "Lightning + Bitcoin + Nostr relay + many privacy services in the catalogue"],
    watchOuts:  ["Pricier hardware than Umbrel's Pi-based starter setups", "More configuration surface — read each service's docs before exposing it"] },
  { name: "RaspiBlitz", category: "node", os: "Raspberry Pi", pitch: "DIY-style Bitcoin + Lightning node distribution with a focus on transparency and learning.",
    strengths: ["Fully open source — every layer auditable", "Strong Lightning routing-node feature set", "Active maintainer community"],
    watchOuts:  ["More hands-on than Umbrel — assumes Linux comfort", "Display + Pi hardware integration can be finicky"] },
  { name: "MyNode", category: "node", os: "Raspberry Pi · Linux", pitch: "Beginner-friendly Bitcoin / Lightning node with a free community edition and a paid premium tier.",
    strengths: ["Simple web UI", "Free Community Edition covers the essentials", "Premium adds VPN, BTCPay, and pro support"],
    watchOuts:  ["Premium model means some features (VPN, BTCPay one-click) require a paid licence", "Community is smaller than Umbrel's"] },
  { name: "Nodl", category: "node", os: "Nodl hardware appliance", pitch: "Pre-built plug-and-play Bitcoin + Lightning node hardware. Pay once, plug in, done.",
    strengths: ["Zero-assembly hardware — fastest path from 'no node' to 'have node'", "Tor + clearnet + Electrum + LND all preconfigured"],
    watchOuts:  ["Hardware vendor — you trust Nodl's firmware build process", "More expensive than DIY Pi setups"] },
];

/* ─────────────────────────────────────────────
   CASE FILES — notable Bitcoin wallets
───────────────────────────────────────────── */
const CASE_FILES = [
  {
    id: "001",
    slug: "bitfinex-hack-recovery",
    title: "The Bitfinex Hack Recovery",
    address: "bc1qazcm763858nkj2dj986etajv6wquslv8uxwczt",
    entity: "US Department of Justice",
    btc: "~94,000",
    category: "seizure",
    status: "active",
    added: "2026-04-01",
    hook: "In 2016, hackers stole 119,756 BTC from Bitfinex. In 2022, the DOJ seized it back — and the wallet fingerprint tells the whole story.",
    summary: "The largest cryptocurrency seizure in history. After sitting dormant for six years, the 2016 Bitfinex hack funds were traced to a New York couple — Ilya Lichtenstein and Heather Morgan — who had laundered only a fraction before being caught. The rest sat in this wallet.",
    narrative: `In August 2016, hackers executed 2,072 transactions to drain 119,756 BTC from Bitfinex, then worth ~$72 million. The funds sat largely untouched for years while investigators built their case.

On February 1, 2022, everything moved at once — all the hack proceeds consolidated into this single government-controlled address in a single day. Lichtenstein and Morgan were arrested the same week. The government had been watching the wallet for years, waiting for the launderers to move.

What makes this address forensically remarkable: the funding pattern is completely unlike normal wallet behaviour. Every input arrived on a single date. The address has never sent anything out. There is zero mixing, zero CoinJoin, zero attempt at obfuscation — the DOJ simply took custody and held.

The privacy score here is interesting not because of what the wallet's owner did wrong, but because of what a government seizure wallet looks like on-chain: extreme balance concentration, no transaction diversity, no privacy measures whatsoever. It scores poorly by every heuristic — not because of bad habits, but because it was never meant to be private.

The case resolved after the seizure: both pleaded guilty to money-laundering conspiracy in August 2023 — Lichtenstein admitting he was the original 2016 hacker. On November 14, 2024 he was sentenced to five years; Heather "Razzlekhan" Morgan followed on November 18 with 18 months. (Lichtenstein was released early in 2026 under the First Step Act.) The forensic point stands: the chain preserved the whole trail for years, and the coins never had to move for the case to close.`,
    thread: [
      "In 2016, hackers stole 119,756 BTC from Bitfinex (~$72M at the time). The funds sat dormant for 6 years. Then in Feb 2022, the DOJ moved it all at once — and arrested a NYC couple the same day. Here's what the on-chain data shows 🧵",
      "All 94,000+ BTC arrived at this address on a single date: February 1, 2022. Every input, same day. That's not how normal wallets work. That's a government seizure — structured, controlled, and permanent.",
      "The wallet has NEVER sent anything out. No mixing. No CoinJoin. No obfuscation attempts. It's the forensic opposite of what a privacy-conscious holder would do — which makes sense. The FBI isn't trying to hide.",
      "The privacy score? Terrible. Balance concentration at 100%. No CoinJoin ever. Round amounts everywhere. Script type inconsistency from the original hack consolidations. It scores F by almost every heuristic.",
      "The lesson isn't about the DOJ's privacy. It's about what 6 years of blockchain forensics looks like. Chainalysis and CipherTrace traced every hop. The hack funds never really moved — they just waited to be claimed. anonscore.com/?scan=bc1qazcm763858nkj2dj986etajv6wquslv8uxwczt",
    ],
    tags: ["#Bitcoin", "#Bitfinex", "#Forensics", "#DOJ"],
    notable: ["Largest crypto seizure in history", "Funded in a single day — Feb 1 2022", "Connected to 2016 Bitfinex hack", "Lichtenstein & Morgan sentenced Nov 2024 (5 yrs / 18 mo)"],
    externalUrl: "https://www.justice.gov/opa/pr/two-arrested-alleged-conspiracy-launder-45-billion-stolen-cryptocurrency-hack",
  },
  {
    id: "002",
    slug: "binance-cold-wallet-1",
    title: "Binance Cold Wallet #1",
    address: "34xp4vRoCGJym3xR7yCVPFHoCNxv4Twseo",
    entity: "Binance",
    btc: "~248,000",
    category: "exchange",
    status: "active",
    added: "2026-04-01",
    hook: "The single largest Bitcoin address on the blockchain. Nearly $17 billion in one wallet, with zero privacy measures — a perfect surveillance target.",
    summary: "The largest known single-address Bitcoin wallet belongs to Binance. With ~248,000 BTC, it holds more Bitcoin than any other individual address on-chain. Its transaction patterns are a textbook case of what custodial exchanges look like — and why they score so poorly on privacy.",
    narrative: `This address holds more Bitcoin than any other single address on the blockchain — roughly 248,000 BTC, worth approximately $17 billion at current prices.

Binance uses this as a primary cold storage address. Funds flow in from exchange operations in large batches, and flow out rarely — only for major withdrawals, exchange operations, or proof-of-reserves audits. The activity pattern is unmistakable to any blockchain analyst.

From a privacy standpoint, this wallet commits almost every heuristic violation in the book. Round-number transactions are pervasive — exchange deposits and withdrawals almost always come in round amounts, a primary Chainalysis fingerprint. The balance is extremely concentrated. There is no CoinJoin usage. The address itself is a legacy P2SH format, mixing with SegWit inputs over time.

But the most important thing this wallet illustrates is custodial risk. Every Bitcoin in this address belongs to Binance customers — yet those customers have no on-chain claim. Their funds are mixed together, indistinguishable, and fully controlled by Binance. If this address moved tomorrow, every customer would know instantly. That's both transparency and vulnerability in the same package.`,
    thread: [
      "This is the single largest Bitcoin address on Earth. ~248,000 BTC. ~$17 billion. One address. It belongs to Binance — and its privacy score is absolutely terrible. Here's why that matters 🧵",
      "Round amounts everywhere. Binance processes thousands of deposits and withdrawals, almost always in round numbers (0.1 BTC, 1.0 BTC, 10.0 BTC). This is the primary signal Chainalysis uses to identify exchange activity. It's permanently on-chain.",
      "Zero CoinJoin. Zero mixing. 100% balance concentration. The wallet literally scores 0 on the checks that matter most for privacy. Not because Binance is careless — but because custodial exchanges fundamentally can't be private.",
      "The deeper point: every sat in this address belongs to a Binance customer, but those customers have no on-chain claim. Their coins are pooled, indistinguishable, and controlled by a single company. That's custodial risk in address form.",
      "Not your keys, not your coins — this is what that looks like on-chain. Scan it yourself: anonscore.com/?scan=34xp4vRoCGJym3xR7yCVPFHoCNxv4Twseo",
    ],
    tags: ["#Bitcoin", "#Binance", "#NotYourKeys", "#Privacy"],
    notable: ["Largest single Bitcoin address on-chain", "~248,000 BTC / ~$17B", "Primary Binance cold storage", "Perfect example of custodial risk"],
    externalUrl: "https://arkham.com",
  },
  {
    id: "003",
    slug: "silk-road-individual-x",
    title: "Silk Road — Individual X",
    address: "1HQ3Go3ggs8pFnXuHVHRytPCq5fGG8Hbhx",
    entity: "US Government (seized from Individual X)",
    btc: "~0",
    category: "seizure",
    status: "liquidated",
    added: "2026-04-01",
    hook: "69,370 BTC sat in this address for 8 years. Nobody knew who owned it. Then on November 3, 2020, it all moved — and the US Government revealed they'd seized it from an anonymous hacker.",
    summary: "The most mysterious wallet in Bitcoin history. An unknown person — called only 'Individual X' in court documents — hacked Silk Road between 2012 and 2013, stealing tens of thousands of BTC. They held it for 7 years without spending a satoshi. Then in 2020, they agreed to forfeit it to the US government, who auctioned it off.",
    narrative: `Between 2012 and 2013, someone hacked Silk Road — the darknet marketplace that pioneered Bitcoin commerce — and quietly stole 69,370 BTC. The funds were moved to this address and then never touched again. For seven years.

Nobody knew who owned it. On-chain, it was just a dormant address with an enormous balance. Blockchain analysts tracked it, wondered about it, and waited. When it finally moved on November 3, 2020, the entire Bitcoin world noticed: $1 billion moved in a single transaction, the largest single on-chain movement in Bitcoin's history at the time.

The court documents revealed the holder had been "Individual X" — an anonymous hacker who approached the US Government and agreed to forfeit the funds. In exchange, they presumably received some form of immunity or reduced liability. Their identity was never revealed.

What makes this address fascinating from a forensics perspective: the holding pattern itself is the signature. A single large inflow in 2013. Then absolute silence for 7 years. No mixing, no splitting, no consolidation attempts. The holder knew that any movement would be traced. So they held. Until they didn't.`,
    thread: [
      "On November 3, 2020, $1 billion in Bitcoin moved from this address. It had been dormant for 7 years. The owner was never identified. This is the most mysterious wallet in Bitcoin history 🧵",
      "Between 2012-2013, someone hacked Silk Road and stole 69,370 BTC. They moved it here — and then never spent a single satoshi for 7 years. No mixing. No splitting. Just held.",
      "Why hold for 7 years without spending? Because they knew any movement would be traced. Blockchain analytics firms had this address tagged and watched. The only safe move was no move.",
      "In 2020, 'Individual X' — their identity still unknown — contacted the US Government and voluntarily forfeited the coins. In exchange for what, exactly, was never disclosed. The DOJ auctioned off the BTC.",
      "The privacy lesson: sometimes the right move is to do nothing. 7 years of inaction was the most effective privacy strategy possible. Until it wasn't. anonscore.com/?scan=1HQ3Go3ggs8pFnXuHVHRytPCq5fGG8Hbhx",
    ],
    tags: ["#Bitcoin", "#SilkRoad", "#Forensics", "#Privacy"],
    notable: ["69,370 BTC dormant for 7 years", "Stolen from Silk Road 2012-2013", "Owner 'Individual X' — never identified", "Largest single BTC movement at time ($1B, Nov 2020)"],
    externalUrl: "https://en.wikipedia.org/wiki/Silk_Road_(marketplace)",
  },
  {
    id: "004",
    slug: "james-zhong-silk-road-hacker",
    title: "James Zhong — Silk Road Hacker",
    address: "bc1qmxjefnuy06v345v6vhwpwt05dztztmx4g3y7wp",
    entity: "US Department of Justice (James Zhong seizure)",
    btc: "~50,000",
    category: "seizure",
    status: "liquidating",
    added: "2026-04-01",
    hook: "In 2012, James Zhong stole 50,000 BTC from Silk Road by exploiting a withdrawal bug. He hid it for 9 years — under floorboards and in a popcorn tin. The FBI found it anyway.",
    summary: "James Zhong stole approximately 50,000 BTC from Silk Road in 2012 by rapidly triggering withdrawals faster than the system could process. He held the coins for nearly a decade, moving them only occasionally. In November 2021, the FBI executed a search warrant and found the coins hidden in a single-board computer buried under his bathroom floor and in a popcorn tin in a safe.",
    narrative: `In September 2012, James Zhong executed one of the earliest and most audacious Bitcoin thefts. He created nine Silk Road accounts, deposited small amounts of Bitcoin, then rapidly triggered multiple withdrawals before the system could update balances. The exploit netted him approximately 50,000 BTC — worth around $600,000 at the time.

Zhong then did something remarkable: almost nothing. The coins sat largely untouched for years. Between 2012 and 2019, he made a small number of movements — consolidations, some conversions — but showed unusual discipline in not spending the bulk of the funds.

In late 2020 and early 2021, Zhong moved some coins to a mixing service. But by then, blockchain forensics had advanced dramatically. The FBI traced the funds through the mixer and eventually to wallets on Zhong's devices.

The November 2021 search warrant produced one of law enforcement's most colourful seizures: 50,491 BTC found on a single-board Raspberry Pi-style computer hidden under floorboards in a bathroom, along with 1 BTC in a popcorn tin inside a safe. Zhong pleaded guilty in November 2022 and was sentenced to a year in prison.

The forensic lesson: holding coins without moving them is effective short-term privacy. But the blockchain is permanent. Nine years later, every original transaction was still there, fully traceable. The mixer didn't help — the pattern analysis connecting his accounts to the original theft was complete before he ever tried to obscure it.`,
    thread: [
      "In 2012, James Zhong stole 50,000 BTC from Silk Road using a withdrawal exploit. He then hid the coins for 9 years — barely touching them. The FBI found them under his bathroom floor. Here's the on-chain story 🧵",
      "The theft was simple: create accounts, deposit small amounts, then trigger multiple rapid withdrawals before Silk Road's system updated balances. Nine accounts. ~50,000 BTC. One exploit. $600,000 in 2012 — $3.3 billion when seized.",
      "For 9 years, Zhong did almost nothing with the coins. A few consolidations. Some small movements. Remarkable discipline. The blockchain recorded every one of those moves permanently.",
      "In late 2020, he moved some coins to a mixer. Too late. The FBI had already traced the original theft through the full transaction history. The mixing didn't obscure what had already been established.",
      "The find: a single-board computer hidden under his bathroom floorboards, containing the wallet. Plus 1 BTC in a popcorn tin in a safe. The blockchain led them straight there. anonscore.com/?scan=bc1qmxjefnuy06v345v6vhwpwt05dztztmx4g3y7wp",
    ],
    tags: ["#Bitcoin", "#SilkRoad", "#Forensics", "#DOJ"],
    notable: ["50,000 BTC stolen via withdrawal exploit in 2012", "Held untouched for 9 years", "Found on Raspberry Pi under bathroom floorboards + in a popcorn tin", "Mixer used in 2020 — too late to obscure the original trace"],
    externalUrl: "https://www.justice.gov/opa/pr/special-agent-james-zhong-pleads-guilty-wire-fraud-stealing-over-50000-bitcoin-silk-road",
  },
  {
    id: "005",
    slug: "satoshi-patoshi-cluster",
    title: "The Satoshi Cluster",
    address: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
    entity: "Satoshi Nakamoto (attributed)",
    btc: "~100",
    category: "miner",
    status: "dormant",
    added: "2026-04-01",
    hook: "The genesis address holds the first 50 BTC ever mined — provably unspendable, never moved (the ~100 BTC you see is well-wishers' tribute dust). It anchors the ~1.1M-BTC 'Patoshi' cluster: thousands of early addresses, identified by one mining fingerprint, untouched for 15+ years. What happens if it ever moves?",
    summary: "Satoshi Nakamoto mined approximately 1.1 million Bitcoin in the early days of the network, identifiable through a distinctive mining pattern called the Patoshi Pattern. None of it has ever been spent. These dormant coins represent the ultimate long-term hodl — and the ultimate privacy case study.",
    narrative: `On January 3, 2009, Satoshi Nakamoto mined the first Bitcoin block — the Genesis Block — and received 50 BTC. That reward has never moved. Neither have the rewards from thousands of subsequent blocks Satoshi mined in the following months.

Researcher Sergio Demian Lerner identified a distinctive pattern in early Bitcoin mining — now called the Patoshi Pattern — that allows attribution of roughly 1.1 million BTC to a single miner, almost certainly Satoshi. The nonce values in these early blocks follow a unique incremental pattern not seen in any other early miner.

From a privacy perspective, Satoshi's approach was actually quite sophisticated for 2009: mining to fresh addresses, never consolidating, never reusing. The problem was scale — mining 1.1 million BTC in a single cohort creates an attribution link that no amount of address rotation can erase. The Patoshi Pattern shows that privacy through address diversity only works if your total activity doesn't form a recognizable signature.

The burning question: what happens if these coins ever move? Every analysis suggests it would be the most significant Bitcoin event in history. The market would likely crash. Every blockchain analytics firm has alerts set. And whoever moved them would immediately become the most watched Bitcoin holder on Earth.

Satoshi's best privacy move was also the simplest: don't spend.`,
    thread: [
      "1,100,000 Bitcoin. Never moved. The coins mined by Bitcoin's creator, Satoshi Nakamoto, have sat untouched for 15+ years. What do they tell us about privacy — and what happens if they ever move? 🧵",
      "Researcher Sergio Lerner found a distinctive pattern in early block mining — now called the 'Patoshi Pattern'. The nonce values increment in a unique way that links ~22,000 early blocks to a single miner. Almost certainly Satoshi.",
      "The privacy lesson: Satoshi used fresh addresses for every block. Smart. But mining 1.1M BTC in one cohort creates an attribution fingerprint that address rotation can't erase. Scale defeats privacy.",
      "What happens if these coins move? Every analytics firm has alerts set. The market would likely drop significantly. Whoever moved them would be the most-watched Bitcoin holder on Earth. Which may be why they haven't.",
      "Satoshi's best privacy strategy turned out to be the simplest: don't spend. 15 years of inaction. The coins are worth $77B today. Sometimes the most private wallet is the one that never moves. anonscore.com",
    ],
    tags: ["#Bitcoin", "#Satoshi", "#PatoshiPattern", "#Privacy"],
    notable: ["Genesis Block — first Bitcoin ever mined", "~1.1M BTC attributed via Patoshi Pattern", "Never moved since 2009-2010", "Would be the most significant BTC event in history if moved"],
    externalUrl: "https://bitslog.com/2013/04/17/the-well-deserved-fortune-of-satoshi-nakamoto/",
  },
  {
    id: "006",
    slug: "mt-gox-hacker-1feex",
    title: "The Mt. Gox Hacker — 79,957 BTC Untouched",
    address: "1FeexV6bAHb8ybZjqQMjJrcCrHGW9sb6uF",
    entity: "Unknown (2011 Mt. Gox hack attacker)",
    btc: "~79,957",
    category: "seizure",
    status: "dormant",
    added: "2026-04-01",
    hook: "In March 2011, an attacker drained 80,000 BTC from Mt. Gox. The funds landed in this address and have never moved. It's the biggest untouched heist wallet in Bitcoin history.",
    summary: "One of the earliest and largest Bitcoin thefts ever recorded. On March 1, 2011, an attacker compromised a Mt. Gox auditor account and transferred 79,957.2 BTC into this single address. Nothing has ever been sent out — not a single satoshi in 15 years. The attacker is still unknown. At current prices, the dormant balance is worth over $5 billion.",
    narrative: `In March 2011, Mt. Gox was the dominant Bitcoin exchange — handling most of the world's trading volume. The compromise started when an attacker obtained access to an auditor's account. Within a short window, 79,957.2 BTC was transferred out of Mt. Gox's operational wallets into a single address: 1FeexV6bAHb8ybZjqQMjJrcCrHGW9sb6uF.

At the time, those coins were worth roughly $875,000. Today, the same balance is worth more than $5 billion.

What makes this wallet extraordinary is what hasn't happened. In 15 years, the attacker has not sent a single satoshi out. No consolidations. No test transactions. No mixing attempts. No exchanges. The wallet has only ever received — including small taunting amounts sent by onlookers over the years — and has never sent.

From a privacy perspective, this is the most effective strategy available to a thief: do nothing. Moving stolen coins creates forensic opportunities. Chainalysis, CipherTrace, and every major blockchain analytics firm have had this wallet tagged and watched since 2011. Any outbound transaction would be flagged instantly, traced to exchanges, and likely lead to prosecution — especially under modern KYC regimes.

Mt. Gox itself survived this 2011 incident but ultimately collapsed in 2014 after a separate, much larger loss. This specific theft was considered one of several early signs that the exchange's security practices were inadequate. The attacker, whoever they were, saw no path to spending the coins safely — so they chose to simply hold.

Whether those coins will ever move is one of the longest-running open questions in Bitcoin. Every few years, a tiny dust transaction to the address triggers a market reaction. But the 79,957 BTC itself has not moved since March 1, 2011.`,
    thread: [
      "On March 1, 2011, someone stole 80,000 BTC from Mt. Gox — then put it in this address and never touched it again. 15 years of silence. $5 billion sitting there. Here's the full on-chain story 🧵",
      "The attack: compromised an auditor's account, transferred 79,957.2 BTC in a single move. Worth $875,000 at the time. Worth $5+ billion now. It was one of the largest Bitcoin thefts ever recorded.",
      "What makes this forensically unique: in 15 years, not one satoshi has left this address. No test tx. No consolidations. No mixing attempts. The wallet has only ever RECEIVED — including taunting dust sent by onlookers over the years.",
      "The privacy lesson: for a thief, the most effective strategy is often to do absolutely nothing. Any movement would be traced instantly — Chainalysis has had this wallet flagged since 2011. Moving would trigger alerts at every major exchange.",
      "The attacker made a choice: billions sitting in an address they can never spend safely, or millions in prison. They chose billions. The coins are still there. Still watched. Still untouched. anonscore.com/?scan=1FeexV6bAHb8ybZjqQMjJrcCrHGW9sb6uF",
    ],
    tags: ["#Bitcoin", "#MtGox", "#Forensics", "#Privacy"],
    notable: ["79,957 BTC stolen on March 1, 2011", "Never sent anything out — 15 years dormant", "Worth $5+ billion at current prices", "Attacker identity never established"],
    externalUrl: "https://bitcointalk.org/index.php?topic=5464048.0",
  },
];


const HISTORY_KEY = "anonscore_history_v1";
const getHistory = () => { try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]"); } catch { return []; } };
const addToHistory = (entry) => {
  try {
    const h = getHistory().filter(e => e.addr !== entry.addr);
    h.unshift(entry);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(h.slice(0, 5)));
  } catch {}
};
const removeFromHistory = (addr) => {
  try { localStorage.setItem(HISTORY_KEY, JSON.stringify(getHistory().filter(e => e.addr !== addr))); } catch {}
};
const clearAllHistory = () => { try { localStorage.removeItem(HISTORY_KEY); } catch {} };

const FIXES_KEY = "anonscore_fixes_v1";
const getDoneFixes  = (addr) => { try { return new Set(JSON.parse(localStorage.getItem(FIXES_KEY + ":" + addr) || "[]")); } catch { return new Set(); } };
const saveDoneFixes = (addr, set) => { try { localStorage.setItem(FIXES_KEY + ":" + addr, JSON.stringify([...set])); } catch {} };

const DEMO_EXAMPLES = [
  {
    grade:"F", score:22, label:"High Risk", color:T.red,
    issues:["Address reused 12 times","KYC coins merged with private","3 dust UTXOs (trackers)","No CoinJoin ever used"],
  },
  {
    grade:"C", score:61, label:"Moderate", color:T.amber,
    issues:["Address reused 3 times","Round-number withdrawal","Single UTXO — exposes balance","Change sent to fresh addresses ✓"],
  },
  {
    grade:"A", score:91, label:"Low Risk", color:T.green,
    issues:["Fresh address every transaction ✓","CoinJoin used — 2 rounds ✓","Balanced UTXO set ✓","Lightning for spending ✓"],
  },
];

const LANDING_CHECKS_LN = [
  { n:"01", k:"node",    label:"Public Node Announcement",    desc:"Whether your node is gossiped publicly. Public nodes expose IP or Tor address to every peer on the network." },
  { n:"02", k:"kyc",     label:"KYC Exchange Peers",          desc:"Channels open to Bitfinex, Kraken, Binance or similar. These log routing metadata and can correlate payment flows." },
  { n:"03", k:"tor",     label:"Tor / Clearnet Exposure",     desc:"Clearnet-only nodes leak your physical location and ISP. Tor-only operation prevents this entirely." },
  { n:"04", k:"diversity", label:"Channel Diversity",         desc:"Fewer channels mean predictable routing paths and limited payment anonymity. More peers = harder to surveil." },
  { n:"05", k:"capacity", label:"Capacity Concentration",     desc:"If 80%+ of capacity sits in one channel, your routing patterns become trivially predictable to any observer." },
  { n:"06", k:"alias",   label:"Node Alias Privacy",          desc:"Your alias is broadcast to the entire gossip network. A real name or handle links your identity to every channel." },
  { n:"07", k:"age",     label:"Node Age",                    desc:"New nodes have thin routing history, making their activity easier to attribute. Older nodes blend into the network." },
  { n:"08", k:"footprint", label:"On-Chain Channel Footprint", desc:"Every channel open/close is an on-chain transaction. Funding from KYC UTXOs permanently links your two identities." },
];

/* ─────────────────────────────────────────────
   HEURISTIC ICONS — inline, themeable line icons (24×24, stroke-based)
   for the privacy checks. Zero requests, crisp at any DPI, colourable
   with the T tokens. Keyed to LANDING_CHECKS[].k / LANDING_CHECKS_LN[].k.
───────────────────────────────────────────── */
function HeuristicIcon({ k, size = 22, color = "currentColor" }) {
  const shapes = {
    // ── Bitcoin ──
    reuse:        <><circle cx="8" cy="12" r="4" /><circle cx="16" cy="12" r="4" /></>,
    dust:         <><circle cx="6" cy="7" r="1" /><circle cx="11" cy="5" r="1" /><circle cx="17" cy="8" r="1" /><circle cx="8" cy="13" r="1" /><circle cx="15" cy="15" r="1" /><circle cx="19" cy="13" r="1" /><circle cx="5" cy="18" r="1" /><circle cx="12" cy="19" r="1" /></>,
    round:        <><circle cx="12" cy="12" r="8" /><path d="M9.5 12a2.5 3 0 1 0 5 0a2.5 3 0 1 0 -5 0" /></>,
    coinjoin:     <><path d="M4 6 L12 12 L4 18" /><path d="M20 6 L12 12 L20 18" /><circle cx="12" cy="12" r="1.4" /></>,
    consolidation:<><path d="M4 5 L13 12 M4 12 L13 12 M4 19 L13 12" /><path d="M13 12 L20 12" /><circle cx="20" cy="12" r="1.4" /></>,
    utxo:         <><rect x="4" y="6" width="16" height="3" rx="1.5" /><rect x="4" y="11" width="11" height="3" rx="1.5" /><rect x="4" y="16" width="14" height="3" rx="1.5" /></>,
    fee:          <><path d="M13 4 L20 11 a1.5 1.5 0 0 1 0 2 L13 20 a1.5 1.5 0 0 1 -2 0 L4 13 L4 6 a2 2 0 0 1 2 -2 Z" /><circle cx="8" cy="8" r="1.1" /></>,
    change:       <><path d="M16 7 L8 7 a4 4 0 0 0 0 8 L17 15" /><path d="M14 12 L17 15 L14 18" /></>,
    concentration:<><circle cx="10" cy="12" r="6" /><circle cx="19" cy="6" r="1.6" /><circle cx="19" cy="18" r="1.6" /></>,
    script:       <><rect x="4" y="5" width="8" height="8" rx="1" /><circle cx="16" cy="15" r="4" /></>,
    // ── Lightning ──
    node:         <><circle cx="12" cy="12" r="2" /><path d="M6 12a6 6 0 0 1 12 0" opacity=".85" /><path d="M3.5 12a8.5 8.5 0 0 1 17 0" opacity=".5" /></>,
    kyc:          <><path d="M4 9 L12 4 L20 9" /><path d="M5 9 L5 18 M19 9 L19 18 M9 9 L9 18 M15 9 L15 18" /><path d="M4 19 L20 19" /></>,
    tor:          <><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="5" opacity=".7" /><circle cx="12" cy="12" r="2" opacity=".5" /></>,
    diversity:    <><circle cx="12" cy="12" r="2" /><path d="M12 10 L12 4 M12 14 L12 20 M10 12 L4 12 M14 12 L20 12 M10.5 10.5 L6 6 M13.5 13.5 L18 18" /><circle cx="12" cy="4" r="1.3" /><circle cx="12" cy="20" r="1.3" /><circle cx="4" cy="12" r="1.3" /><circle cx="20" cy="12" r="1.3" /></>,
    capacity:     <><rect x="4" y="5" width="16" height="5" rx="2" /><rect x="4" y="13" width="6" height="3" rx="1.5" opacity=".55" /><rect x="4" y="18" width="4" height="2.5" rx="1.2" opacity=".4" /></>,
    alias:        <><path d="M4 7 a2 2 0 0 1 2 -2 L13 5 L20 12 L13 19 L6 19 a2 2 0 0 1 -2 -2 Z" /><circle cx="8.5" cy="9.5" r="1.3" /></>,
    age:          <><circle cx="12" cy="12" r="8" /><path d="M12 7.5 L12 12 L15.5 14" /></>,
    footprint:    <><ellipse cx="9" cy="12" rx="4" ry="3" transform="rotate(-30 9 12)" /><ellipse cx="15" cy="12" rx="4" ry="3" transform="rotate(-30 15 12)" /></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {shapes[k] || <circle cx="12" cy="12" r="7" />}
    </svg>
  );
}

/* ─────────────────────────────────────────────
   CASE HERO — decorative "on-chain fingerprint" band shown atop each
   case file. An abstract transaction-flow: inputs (left) funnel through
   a central cluster to outputs (right), tinted to the case category.
   Deterministic per case id, so each looks distinct. Breaks up the
   long narrative with a thematically-apt visual ("what an analyst sees").
───────────────────────────────────────────── */
/* CASE HERO — editorial on-chain "fingerprint" art for each case file.
   Same thin line-art language everywhere, but each known case gets a
   composition that tells ITS story (the id is the variant key); unknown ids
   fall back to a seeded generic flow graph. Pure inline SVG, aria-hidden,
   ring animation is killed by the global reduced-motion rule. */
function CaseHero({ seed = "0", color = "#22D3EE", height = 120 }) {
  const W = 800, H = height;
  let s = 0; for (let i = 0; i < seed.length; i++) s = (s * 31 + seed.charCodeAt(i)) >>> 0;
  const rnd = () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff; };
  const node = (x, y, r = 6) => <>
    <circle cx={x} cy={y} r={r + 5} fill="none" stroke={color} strokeWidth="1.5" strokeOpacity="0.5" style={{ animation: "scanRing 2.4s ease-out infinite", transformOrigin: `${x}px ${y}px` }} />
    <circle cx={x} cy={y} r={r} fill={color} fillOpacity="0.9" style={{ filter: `drop-shadow(0 0 6px ${color})` }} />
  </>;
  const glow = (x, y) => <>
    <defs><radialGradient id={`ch-g-${seed}`} cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor={color} stopOpacity="0.35" /><stop offset="100%" stopColor={color} stopOpacity="0" /></radialGradient></defs>
    <rect x={x - 120} y={y - 60} width="240" height="120" fill={`url(#ch-g-${seed})`} />
  </>;

  let scene = null;
  if (seed === "001") {
    // Bitfinex seizure: 2,072 hops of history swept into ONE point on ONE day.
    const cx = W * 0.62, cy = H / 2, n = 16;
    scene = <>
      {glow(cx, cy)}
      {Array.from({ length: n }).map((_, i) => {
        const y0 = (H * (i + 1)) / (n + 1);
        return <path key={i} d={`M20 ${y0.toFixed(1)} C ${W * 0.35} ${y0.toFixed(1)}, ${cx - 70} ${cy}, ${cx} ${cy}`} fill="none" stroke={color} strokeWidth="1" strokeOpacity="0.22" />;
      })}
      <line x1={cx} y1="6" x2={cx} y2={H - 6} stroke={color} strokeWidth="1" strokeOpacity="0.35" strokeDasharray="3 5" />
      {node(cx, cy, 7)}
    </>;
  } else if (seed === "002") {
    // Binance cold wallet: a vault — few huge inflows, perfectly uniform round outputs.
    const cx = W * 0.34, cy = H / 2;
    scene = <>
      {glow(cx, cy)}
      {[0.3, 0.5, 0.7].map((f, i) => <path key={i} d={`M20 ${(H * f).toFixed(1)} C ${cx - 120} ${(H * f).toFixed(1)}, ${cx - 80} ${cy}, ${cx - 26} ${cy}`} fill="none" stroke={color} strokeWidth="2" strokeOpacity="0.3" />)}
      {[20, 14].map((r, i) => <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="1.5" strokeOpacity={0.45 - i * 0.1} />)}
      {node(cx, cy, 6)}
      {Array.from({ length: 6 }).map((_, i) => {
        const y0 = (H * (i + 1)) / 7;
        return <g key={"o" + i}>
          <line x1={cx + 26} y1={y0} x2={W - 60} y2={y0} stroke={color} strokeWidth="1" strokeOpacity="0.25" />
          <rect x={W - 58} y={y0 - 3} width="6" height="6" fill={color} fillOpacity="0.5" />
        </g>;
      })}
    </>;
  } else if (seed === "003") {
    // Silk Road Individual X: seven flat years, then the sudden fork.
    const cy = H / 2, fx = W * 0.7;
    scene = <>
      {glow(fx, cy)}
      <line x1="20" y1={cy} x2={fx} y2={cy} stroke={color} strokeWidth="1.5" strokeOpacity="0.4" />
      {Array.from({ length: 9 }).map((_, i) => <line key={i} x1={40 + i * 62} y1={cy - 4} x2={40 + i * 62} y2={cy + 4} stroke={color} strokeWidth="1" strokeOpacity="0.35" />)}
      <path d={`M${fx} ${cy} C ${fx + 60} ${cy}, ${fx + 40} ${H * 0.22}, ${W - 30} ${H * 0.22}`} fill="none" stroke={color} strokeWidth="1.5" strokeOpacity="0.45" />
      <path d={`M${fx} ${cy} C ${fx + 60} ${cy}, ${fx + 40} ${H * 0.78}, ${W - 30} ${H * 0.78}`} fill="none" stroke={color} strokeWidth="1.5" strokeOpacity="0.45" />
      {node(fx, cy, 6)}
    </>;
  } else if (seed === "004") {
    // James Zhong: the trail vanishes under the floorboards — until the search warrant.
    const cy = H / 2, bx = W * 0.28, ex = W * 0.72;
    scene = <>
      {glow(ex + 60, cy)}
      <line x1={bx - 6} y1={cy - 14} x2={ex + 6} y2={cy - 14} stroke={color} strokeWidth="1.5" strokeOpacity="0.5" />
      {Array.from({ length: 22 }).map((_, i) => <line key={i} x1={bx + i * 16} y1={cy - 14} x2={bx + i * 16 - 8} y2={cy - 26} stroke={color} strokeWidth="1" strokeOpacity="0.3" />)}
      <path d={`M20 ${H * 0.25} C ${bx - 40} ${H * 0.25}, ${bx - 30} ${cy + 12} , ${bx + 10} ${cy + 14}`} fill="none" stroke={color} strokeWidth="1.2" strokeOpacity="0.4" />
      <line x1={bx + 10} y1={cy + 14} x2={ex - 10} y2={cy + 14} stroke={color} strokeWidth="1.2" strokeOpacity="0.18" strokeDasharray="4 4" />
      <path d={`M${ex - 10} ${cy + 14} C ${ex + 30} ${cy + 12}, ${ex + 20} ${H * 0.3}, ${ex + 60} ${H * 0.3}`} fill="none" stroke={color} strokeWidth="1.2" strokeOpacity="0.4" />
      {node(ex + 60, H * 0.3, 5)}
    </>;
  } else if (seed === "005") {
    // Satoshi cluster: coinbase rays minted outward — and nothing ever leaves.
    const cx = W * 0.5, cy = H / 2, n = 13;
    scene = <>
      {glow(cx, cy)}
      {Array.from({ length: n }).map((_, i) => {
        const a = (Math.PI * 2 * i) / n, r1 = 22, r2 = Math.min(W, 260) / 2 - 14;
        const x1 = cx + Math.cos(a) * r1, y1 = cy + Math.sin(a) * r1 * (H / 260);
        const x2 = cx + Math.cos(a) * r2, y2 = cy + Math.sin(a) * r2 * (H / 260);
        return <g key={i}>
          <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="1" strokeOpacity="0.3" />
          <circle cx={x2} cy={y2} r="2.5" fill={color} fillOpacity="0.55" />
        </g>;
      })}
      {node(cx, cy, 7)}
    </>;
  } else if (seed === "006") {
    // Mt. Gox hacker: everything in, nothing out — outputs are stubs that die.
    const cx = W * 0.55, cy = H / 2;
    const hex = Array.from({ length: 6 }).map((_, i) => { const a = Math.PI / 3 * i - Math.PI / 6; return `${(cx + Math.cos(a) * 26).toFixed(1)},${(cy + Math.sin(a) * 26).toFixed(1)}`; }).join(" ");
    scene = <>
      {glow(cx, cy)}
      {[0.25, 0.5, 0.75].map((f, i) => <path key={i} d={`M20 ${(H * f).toFixed(1)} C ${W * 0.3} ${(H * f).toFixed(1)}, ${cx - 70} ${cy}, ${cx - 24} ${cy}`} fill="none" stroke={color} strokeWidth="1.2" strokeOpacity="0.3" />)}
      <polygon points={hex} fill="none" stroke={color} strokeWidth="1.5" strokeOpacity="0.5" />
      {node(cx, cy, 6)}
      {[0.35, 0.5, 0.65].map((f, i) => <line key={"s" + i} x1={cx + 28} y1={H * f} x2={cx + 88} y2={H * f} stroke={color} strokeWidth="1" strokeOpacity="0.18" strokeDasharray="3 6" />)}
    </>;
  } else {
    // Generic seeded flow graph for any future case.
    const inputs = 4 + Math.floor(rnd() * 4), outputs = 3 + Math.floor(rnd() * 4);
    const cx = W * 0.5, cy = H / 2;
    const yIn = n => (H * (n + 1)) / (inputs + 1), yOut = n => (H * (n + 1)) / (outputs + 1);
    scene = <>
      {glow(cx, cy)}
      {Array.from({ length: inputs }).map((_, i) => <path key={"i" + i} d={`M40 ${yIn(i).toFixed(1)} C ${W * 0.3} ${yIn(i).toFixed(1)}, ${cx - 60} ${cy}, ${cx} ${cy}`} fill="none" stroke={color} strokeWidth="1" strokeOpacity="0.28" />)}
      {Array.from({ length: outputs }).map((_, i) => <path key={"o" + i} d={`M${cx} ${cy} C ${cx + 60} ${cy}, ${W * 0.7} ${yOut(i).toFixed(1)}, ${W - 40} ${yOut(i).toFixed(1)}`} fill="none" stroke={color} strokeWidth="1" strokeOpacity="0.28" />)}
      {Array.from({ length: inputs }).map((_, i) => <circle key={"ni" + i} cx="40" cy={yIn(i).toFixed(1)} r="3" fill={color} fillOpacity="0.55" />)}
      {Array.from({ length: outputs }).map((_, i) => <circle key={"no" + i} cx={W - 40} cy={yOut(i).toFixed(1)} r="3" fill={color} fillOpacity="0.55" />)}
      {node(cx, cy, 6)}
    </>;
  }
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} preserveAspectRatio="none" aria-hidden="true" style={{ display: "block" }}>
      {scene}
    </svg>
  );
}

function ChecksSection({ isMobile }) {
  const [mode, setMode] = useState("btc");
  const checks = mode === "btc" ? LANDING_CHECKS : LANDING_CHECKS_LN;
  const accent = mode === "btc" ? T.cyan : T.ln;
  const accentLo = mode === "btc" ? T.cyanLo : T.lnLo;
  const accentMid = mode === "btc" ? T.cyanMid : T.lnMid;
  return (
    <>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ fontFamily: T.mono, fontSize: 10, color: T.textDim, letterSpacing: 2.5, marginBottom: 12 }}>WHAT WE CHECK — PLAIN ENGLISH</div>
        <h2 style={{ fontFamily: T.serif, fontSize: isMobile ? 28 : 40, color: T.text, fontWeight: 400, marginBottom: 20 }}>Every check, explained</h2>
        <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
          {[["btc","₿ 11 Bitcoin heuristics",T.cyan,T.cyanLo,T.cyanMid],["ln","⚡ 8 Lightning checks",T.ln,T.lnLo,T.lnMid]].map(([m,label,col,lo,mid]) => (
            <button key={m} onClick={() => setMode(m)} style={{ fontFamily: T.mono, fontSize: 10, color: mode === m ? col : T.textDim, background: mode === m ? lo : "transparent", border: `1px solid ${mode === m ? mid : T.border}`, borderRadius: 6, padding: "6px 14px", cursor: "pointer", transition: "all .15s" }}>{label}</button>
          ))}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", gap: 10 }}>
        {checks.map((c) => (
          <div key={c.n} style={{ display: "flex", gap: 14, alignItems: "flex-start", background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: "16px 18px", transition: "transform .13s ease-out, border-color .15s, box-shadow .28s" }}
            onMouseMove={tiltMove}
            onMouseOver={e => { e.currentTarget.style.borderColor = accentMid; e.currentTarget.style.boxShadow = `0 12px 30px -14px ${accent}`; }}
            onMouseOut={e => { tiltReset(e); e.currentTarget.style.borderColor = T.border; e.currentTarget.style.boxShadow = "none"; }}>
            <div style={{ flexShrink: 0, width: 42, height: 42, borderRadius: 11, background: accentLo, border: `1px solid ${accentMid}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <HeuristicIcon k={c.k} size={22} color={accent} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 7, marginBottom: 4 }}>
                <span style={{ fontFamily: T.mono, fontSize: 10, color: accent }}>{c.n}</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: T.text }}>{c.label}</span>
              </div>
              <div style={{ fontSize: 13, color: T.textMid, lineHeight: 1.6 }}>{c.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

const SCAN_STEPS = [
  { label:"Resolving address…",           fact:"Bitcoin addresses are pseudonymous, not anonymous. Every transaction is permanently public." },
  { label:"Fetching UTXO set…",           fact:"UTXOs are like banknotes. How many you hold and their sizes reveal your spending habits." },
  { label:"Pulling transaction history…", fact:"Blockchain-surveillance is a multi-billion-dollar industry — its whole business is de-anonymizing public chain data." },
  { label:"Checking address reuse…",      fact:"Reusing an address even once permanently links all its transactions — the single biggest avoidable privacy mistake in Bitcoin." },
  { label:"Looking for dust attacks…",    fact:"Exchanges and surveillance firms send dust to wallets they want to track. It's legal." },
  { label:"Scanning for consolidations…", fact:"Merging a KYC coin with a private coin permanently links them — forever, on-chain." },
  { label:"Checking round amounts…",      fact:"'0.1 BTC' is a Chainalysis red flag. '0.10431 BTC' looks like change — much less identifiable." },
  { label:"Detecting CoinJoin patterns…", fact:"CoinJoin breaks the chain of custody. With 50+ participants, tracking becomes computationally infeasible." },
  { label:"Analysing fee fingerprints…",  fact:"Your wallet software can be identified by the fee rates it uses. Different wallets have different defaults." },
  { label:"Calculating privacy score…",   fact:"Score 0 = fully traceable in seconds. Score 100 = requires nation-state resources to de-anonymise." },
  { label:"Building your fix plan…",      fact:"Most wallets can improve by 30+ points in under a week with no technical knowledge required." },
];

/* ─────────────────────────────────────────────
   UTXO CLASSIFIER — hoisted, not per-render
───────────────────────────────────────────── */
function classifyUtxo(u) {
  if (u.value < 1000) return "critical";
  if (u.value >= 100000 && u.value % 100000 === 0) return "medium";
  if (u.value > 5000000) return "low";
  return "clean";
}

// A CoinJoin has many *participants*: several inputs (each from a different
// owner) AND several equal-value outputs (the shared denomination). A single-
// sender batch payout also emits many equal outputs — but from ONE input.
// Requiring multiple inputs is what separates a real mix from a batch, so a
// batch is never miscredited as privacy-positive mixing. Used everywhere
// CoinJoin shape is judged (scoring, cluster exclusion, exposure map) so the
// definition can't drift between call sites.
function isCoinJoinShape(vin, vout) {
  const inputs = (vin || []).length;
  const outs = vout || [];
  if (inputs < 3 || outs.length < 5) return false;
  const dn = {};
  outs.forEach(o => { if (o && o.value != null) dn[o.value] = (dn[o.value] || 0) + 1; });
  return Math.max(0, ...Object.values(dn)) >= 3;
}

/* ─────────────────────────────────────────────
   TRANSACTION INSPECTOR — parse a PSBT / raw tx entirely in the browser and
   analyze what it will leak BEFORE it's broadcast. Pure-JS (no eval/WASM, so
   CSP-clean; no dependency). PSBTs embed their input UTXO data, so a PSBT is
   analyzed with ZERO network — the transaction never leaves the browser.
   Parser + encoders validated against BIP174 / BIP173 / BIP350 test vectors.
───────────────────────────────────────────── */

// -- byte helpers --
function _hexToBytes(h) {
  h = (h || "").trim().replace(/^0x/i, "");
  if (h.length % 2) throw new Error("odd-length hex");
  const out = new Uint8Array(h.length / 2);
  for (let i = 0; i < out.length; i++) {
    const b = parseInt(h.substr(i * 2, 2), 16);
    if (Number.isNaN(b)) throw new Error("invalid hex");
    out[i] = b;
  }
  return out;
}
function _bytesToHex(b) { let s = ""; for (const x of b) s += x.toString(16).padStart(2, "0"); return s; }
function _base64ToBytes(b64) {
  const bin = atob((b64 || "").trim());
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

// -- pure-JS SHA-256 (for base58check + double-SHA256; SubtleCrypto is async
//    and unusable in synchronous parse/render) --
function _sha256(bytes) {
  const K = [0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
  let h0=0x6a09e667,h1=0xbb67ae85,h2=0x3c6ef372,h3=0xa54ff53a,h4=0x510e527f,h5=0x9b05688c,h6=0x1f83d9ab,h7=0x5be0cd19;
  const l = bytes.length, bitLen = l * 8, withOne = l + 1;
  const pad = (56 - (withOne % 64) + 64) % 64, total = withOne + pad + 8;
  const m = new Uint8Array(total); m.set(bytes); m[l] = 0x80;
  const dv = new DataView(m.buffer);
  dv.setUint32(total - 4, bitLen >>> 0);
  dv.setUint32(total - 8, Math.floor(bitLen / 0x100000000));
  const w = new Int32Array(64), rotr = (x, n) => (x >>> n) | (x << (32 - n));
  for (let off = 0; off < total; off += 64) {
    for (let i = 0; i < 16; i++) w[i] = dv.getUint32(off + i * 4);
    for (let i = 16; i < 64; i++) {
      const s0 = rotr(w[i-15],7) ^ rotr(w[i-15],18) ^ (w[i-15] >>> 3);
      const s1 = rotr(w[i-2],17) ^ rotr(w[i-2],19) ^ (w[i-2] >>> 10);
      w[i] = (w[i-16] + s0 + w[i-7] + s1) | 0;
    }
    let a=h0,b=h1,c=h2,d=h3,e=h4,f=h5,g=h6,h=h7;
    for (let i = 0; i < 64; i++) {
      const S1 = rotr(e,6) ^ rotr(e,11) ^ rotr(e,25), ch = (e & f) ^ (~e & g);
      const t1 = (h + S1 + ch + K[i] + w[i]) | 0;
      const S0 = rotr(a,2) ^ rotr(a,13) ^ rotr(a,22), maj = (a & b) ^ (a & c) ^ (b & c);
      const t2 = (S0 + maj) | 0;
      h=g; g=f; f=e; e=(d + t1)|0; d=c; c=b; b=a; a=(t1 + t2)|0;
    }
    h0=(h0+a)|0;h1=(h1+b)|0;h2=(h2+c)|0;h3=(h3+d)|0;h4=(h4+e)|0;h5=(h5+f)|0;h6=(h6+g)|0;h7=(h7+h)|0;
  }
  const out = new Uint8Array(32), odv = new DataView(out.buffer);
  [h0,h1,h2,h3,h4,h5,h6,h7].forEach((hv, i) => odv.setUint32(i * 4, hv >>> 0));
  return out;
}

// -- bech32 / bech32m (BIP173 / BIP350); pure data, no secp256k1 --
const _BECH = "qpzry9x8gf2tvdw0s3jn54khce6mua7l";
function _bechPolymod(v){let chk=1;const G=[0x3b6a57b2,0x26508e6d,0x1ea119fa,0x3d4233dd,0x2a1462b3];for(const x of v){const b=chk>>25;chk=((chk&0x1ffffff)<<5)^x;for(let i=0;i<5;i++)if((b>>i)&1)chk^=G[i];}return chk;}
function _hrpExpand(hrp){const r=[];for(let i=0;i<hrp.length;i++)r.push(hrp.charCodeAt(i)>>5);r.push(0);for(let i=0;i<hrp.length;i++)r.push(hrp.charCodeAt(i)&31);return r;}
function _bechChecksum(hrp,data,spec){const C=spec==="bech32m"?0x2bc830a3:1;const v=_hrpExpand(hrp).concat(data).concat([0,0,0,0,0,0]);const pm=_bechPolymod(v)^C;const r=[];for(let i=0;i<6;i++)r.push((pm>>(5*(5-i)))&31);return r;}
function _bechEncode(hrp,data,spec){const c=data.concat(_bechChecksum(hrp,data,spec));let s=hrp+"1";for(const d of c)s+=_BECH[d];return s;}
function _convertBits(data,from,to,pad){let acc=0,bits=0;const r=[];const maxv=(1<<to)-1;for(const val of data){acc=((acc<<from)|val)&0xffffffff;bits+=from;while(bits>=to){bits-=to;r.push((acc>>bits)&maxv);}}if(pad&&bits)r.push((acc<<(to-bits))&maxv);return r;}
function _segwitAddress(version,program){const data=[version].concat(_convertBits(Array.from(program),8,5,true));return _bechEncode("bc",data,version===0?"bech32":"bech32m");}
// bech32 / bech32m DECODE (checksum-verified) → { hrp, data(5-bit, no checksum),
// spec } or null. No 90-char cap (BIP352 addresses run 117+ chars).
const _BECHKEY = (() => { const m = {}; for (let i = 0; i < _BECH.length; i++) m[_BECH[i]] = i; return m; })();
function _bech32Decode(str) {
  if (typeof str !== "string" || str.length < 8 || str.length > 1023) return null;
  const low = str.toLowerCase(), up = str.toUpperCase();
  if (str !== low && str !== up) return null;                 // mixed case is invalid
  str = low;
  const pos = str.lastIndexOf("1");
  if (pos < 1 || pos + 7 > str.length) return null;
  const hrp = str.slice(0, pos), vals = [];
  for (const c of str.slice(pos + 1)) { const v = _BECHKEY[c]; if (v === undefined) return null; vals.push(v); }
  const poly = _bechPolymod(_hrpExpand(hrp).concat(vals));
  const spec = poly === 1 ? "bech32" : poly === 0x2bc830a3 ? "bech32m" : null;
  if (!spec) return null;
  return { hrp, data: vals.slice(0, -6), spec };
}

/* SILENT PAYMENTS (BIP352) — decode/validate an sp1…/tsp1… address entirely in
   the browser. A silent payment address is a REUSABLE address that never reuses
   on-chain: each payment derives a fresh, unlinkable output, so address-reuse
   clustering simply can't touch it. It encodes two keys — a scan key (kept
   online to detect payments) and a spend key (kept in cold storage). bech32m,
   hrp "sp"/"tsp", version 0 = char 'q', 66-byte payload = ser(B_scan)‖ser(B_spend).
   Validated against the BIP352 "Simple send" test-vector address. */
function decodeSilentPayment(str) {
  const d = _bech32Decode((str || "").trim());
  if (!d || d.spec !== "bech32m") return null;
  const network = d.hrp === "sp" ? "mainnet" : d.hrp === "tsp" ? "testnet" : null;
  if (!network || d.data.length < 1) return null;
  const version = d.data[0];
  if (version === 31) return { network, version, error: "v31" };   // reserved breaking change
  // strict 5→8 bit unpacking (reject bad padding / stray bits)
  let acc = 0, bits = 0; const out = [];
  for (const v of d.data.slice(1)) { acc = (acc << 5) | v; bits += 5; while (bits >= 8) { bits -= 8; out.push((acc >> bits) & 0xff); } }
  if (bits >= 5 || (acc & ((1 << bits) - 1))) return null;
  if (out.length < 66) return null;                 // v1–30 may append; read the first 66
  const scan = out.slice(0, 33), spend = out.slice(33, 66);
  const ok = b => b[0] === 0x02 || b[0] === 0x03;
  if (!ok(scan) || !ok(spend)) return null;
  const hex = a => a.map(x => x.toString(16).padStart(2, "0")).join("");
  return { network, version, scanKey: hex(scan), spendKey: hex(spend) };
}
function detectSilentPayment(v) { const s = (v || "").trim().toLowerCase(); if (!/^t?sp1[a-z0-9]+$/.test(s)) return null; return decodeSilentPayment(s) ? (s.startsWith("tsp1") ? "tsp" : "sp") : null; }

/* BOLT11 LIGHTNING INVOICE decode + privacy lint (pure JS, no network). The big
   leak: to be paid over a PRIVATE channel, an invoice MUST carry routing hints —
   the peer's node pubkey plus a short-channel-ID, and a SCID is defined (BOLT7)
   as block_height × tx_index × output_index of the channel's FUNDING transaction.
   So anyone you hand the invoice to learns the exact on-chain UTXO backing your
   channel. Decoded here purely by parsing the invoice; validated against the
   BOLT11 spec's routing-hint example. */
function _g5Int(g) { let n = 0; for (const x of g) n = n * 32 + x; return n; }               // 5-bit groups → int (≤~45 bits)
function _g5Bytes(g) { let acc = 0, bits = 0; const out = []; for (const x of g) { acc = (acc << 5) | x; bits += 5; if (bits >= 8) { bits -= 8; out.push((acc >> bits) & 0xff); } } return out; }
const _BOLT_MULT = { m: 1e8, u: 1e5, n: 1e2, p: 0.1 };   // multiplier → msat per unit (1 BTC = 1e11 msat)
function decodeBolt11(str) {
  const d = _bech32Decode((str || "").trim());
  if (!d || d.spec !== "bech32" || !d.hrp.startsWith("ln")) return null;
  const m = d.hrp.slice(2).match(/^(bcrt|bcs|bc|tb|sb)([0-9]*)([munp]?)$/);
  if (!m) return null;
  const network = { bc: "mainnet", tb: "testnet", bcs: "signet", sb: "signet", bcrt: "regtest" }[m[1]];
  let amountMsat = null;
  if (m[2]) { const num = parseInt(m[2], 10); amountMsat = m[3] ? Math.round(num * _BOLT_MULT[m[3]]) : num * 1e11; }
  const data = d.data;
  if (data.length < 7 + 104) return null;                 // timestamp(7) + 520-bit sig(104)
  const timestamp = _g5Int(data.slice(0, 7));
  const end = data.length - 104;
  const TYPE = { 1: "p", 16: "s", 13: "d", 19: "n", 23: "h", 6: "x", 3: "r", 9: "f", 5: "9", 27: "m", 24: "c" };
  const hex = a => a.map(x => x.toString(16).padStart(2, "0")).join("");
  const f = {}; const routes = [];
  let pos = 7;
  while (pos + 3 <= end) {
    const len = data[pos + 1] * 32 + data[pos + 2];
    const name = TYPE[data[pos]];
    pos += 3;
    if (pos + len > end) break;
    const g = data.slice(pos, pos + len); pos += len;
    if (name === "p" || name === "h") f[name] = hex(_g5Bytes(g)).slice(0, 64);
    else if (name === "n") f.n = hex(_g5Bytes(g)).slice(0, 66);
    else if (name === "d") { try { f.d = new TextDecoder().decode(new Uint8Array(_g5Bytes(g))); } catch { f.d = null; } }
    else if (name === "x") f.x = _g5Int(g);
    else if (name === "r") {
      const b = _g5Bytes(g);
      for (let i = 0; i + 51 <= b.length; i += 51) {
        // SCID (BOLT7) = 3-byte block_height · 3-byte tx_index · 2-byte output_index
        // of the funding tx. Read each field straight from the bytes (the full
        // 8-byte value exceeds 2^53, so never form it as a Number).
        const o = i + 33;
        routes.push({ pubkey: hex(b.slice(i, i + 33)),
          block: (b[o] << 16) | (b[o + 1] << 8) | b[o + 2],
          tx: (b[o + 3] << 16) | (b[o + 4] << 8) | b[o + 5],
          out: (b[o + 6] << 8) | b[o + 7] });
      }
    }
  }
  return { network, amountMsat, timestamp, paymentHash: f.p, description: f.d ?? null, payeePubkey: f.n ?? null, expiry: f.x ?? null, descHash: f.h ?? null, routes };
}
function detectBolt11(v) { const s = (v || "").trim().toLowerCase(); if (!/^ln(bc|tb|bcrt|bcs|sb)[0-9]*[munp]?1[a-z0-9]+$/.test(s)) return null; return decodeBolt11(s) ? "bolt11" : null; }

// -- base58check (P2PKH / P2SH) --
const _B58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function _base58encode(bytes){let zeros=0;while(zeros<bytes.length&&bytes[zeros]===0)zeros++;const digits=[0];for(let i=zeros;i<bytes.length;i++){let carry=bytes[i];for(let j=0;j<digits.length;j++){carry+=digits[j]<<8;digits[j]=carry%58;carry=(carry/58)|0;}while(carry){digits.push(carry%58);carry=(carry/58)|0;}}let s="";for(let i=0;i<zeros;i++)s+="1";for(let i=digits.length-1;i>=0;i--)s+=_B58[digits[i]];return s;}
function _base58check(version,payload){const buf=new Uint8Array(1+payload.length);buf[0]=version;buf.set(payload,1);const chk=_sha256(_sha256(buf)).slice(0,4);const full=new Uint8Array(buf.length+4);full.set(buf);full.set(chk,buf.length);return _base58encode(full);}

// -- byte cursor for deserialization --
function _makeCursor(bytes) {
  let p = 0;
  return {
    get p() { return p; },
    byte() { return bytes[p++]; },
    peek() { return bytes[p]; },
    slice(n) { if (p + n > bytes.length) throw new Error("unexpected end of data"); const s = bytes.slice(p, p + n); p += n; return s; },
    u32() { if (p + 4 > bytes.length) throw new Error("unexpected end of data"); const v = (bytes[p]|(bytes[p+1]<<8)|(bytes[p+2]<<16)|(bytes[p+3]<<24)) >>> 0; p += 4; return v; },
    u64() { if (p + 8 > bytes.length) throw new Error("unexpected end of data"); let v = 0n; for (let i = 0; i < 8; i++) v |= BigInt(bytes[p+i]) << BigInt(8*i); p += 8; if (v > BigInt(Number.MAX_SAFE_INTEGER)) throw new Error("value exceeds 2^53"); return Number(v); },
    varint() { const f = bytes[p++]; if (f === undefined) throw new Error("unexpected end of data"); if (f < 0xfd) return f; if (f === 0xfd) { const v = bytes[p]|(bytes[p+1]<<8); p += 2; return v; } if (f === 0xfe) { const v = (bytes[p]|(bytes[p+1]<<8)|(bytes[p+2]<<16)|(bytes[p+3]<<24)) >>> 0; p += 4; return v; } let v = 0n; for (let i = 0; i < 8; i++) v |= BigInt(bytes[p+i]) << BigInt(8*i); p += 8; if (v > BigInt(Number.MAX_SAFE_INTEGER)) throw new Error("varint exceeds 2^53"); return Number(v); },
    varslice() { const n = this.varint(); return this.slice(n); },
  };
}

// -- scriptPubKey → { type, address }. The address is deterministic from the
//    script bytes (real bc1…/1…/3… where encodable, else a "script:<hex>"
//    sentinel), so equality — used for reuse/cluster detection — is byte-exact
//    for every type while common cases still show a real address. --
function classifyScript(s) {
  if (s.length === 25 && s[0]===0x76 && s[1]===0xa9 && s[2]===0x14 && s[23]===0x88 && s[24]===0xac)
    return { type: "p2pkh", address: _base58check(0x00, s.slice(3, 23)) };
  if (s.length === 23 && s[0]===0xa9 && s[1]===0x14 && s[22]===0x87)
    return { type: "p2sh", address: _base58check(0x05, s.slice(2, 22)) };
  if (s.length === 22 && s[0]===0x00 && s[1]===0x14)
    return { type: "v0_p2wpkh", address: _segwitAddress(0, s.slice(2)) };
  if (s.length === 34 && s[0]===0x00 && s[1]===0x20)
    return { type: "v0_p2wsh", address: _segwitAddress(0, s.slice(2)) };
  if (s.length === 34 && s[0]===0x51 && s[1]===0x20)
    return { type: "v1_p2tr", address: _segwitAddress(1, s.slice(2)) };
  if (s.length >= 1 && s[0]===0x6a)
    return { type: "op_return", address: null };
  return { type: "unknown", address: null };
}
function _spkAddr(cl, spk) { return cl.address ?? ("script:" + _bytesToHex(spk)); }

// -- deserialize a raw Bitcoin transaction → Esplora-ish shape --
function parseRawTx(bytes) {
  const c = _makeCursor(bytes);
  const version = c.u32();
  let segwit = false;
  if (c.peek() === 0x00) { c.byte(); const flag = c.byte(); if (flag !== 0x01) throw new Error("bad segwit flag"); segwit = true; }
  const nIn = c.varint();
  if (nIn > 5000) throw new Error("too many inputs");
  const vin = [];
  for (let i = 0; i < nIn; i++) {
    const prevTxid = c.slice(32);
    const vout = c.u32();
    c.varslice();               // scriptSig
    const sequence = c.u32();    // nSequence — kept for RBF / anti-fee-sniping fingerprinting
    vin.push({ txid: _bytesToHex(prevTxid.slice().reverse()), vout, prevout: null, sequence });
  }
  const nOut = c.varint();
  if (nOut > 5000) throw new Error("too many outputs");
  const vout = [];
  for (let i = 0; i < nOut; i++) {
    const value = c.u64();
    const spk = c.varslice();
    const cl = classifyScript(spk);
    vout.push({ value, scriptpubkey: _bytesToHex(spk), scriptpubkey_type: cl.type, scriptpubkey_address: _spkAddr(cl, spk) });
  }
  if (segwit) { for (let i = 0; i < nIn; i++) { const items = c.varint(); const w = []; for (let j = 0; j < items; j++) w.push(c.varslice()); vin[i].witness = w; } }
  const locktime = c.u32();
  return { version, vin, vout, locktime, segwit };
}

// -- deserialize a PSBT (BIP174, v0) → the same shape, with input prevouts
//    resolved from witness_utxo / non_witness_utxo (so fully offline) --
function parsePsbt(bytes) {
  const c = _makeCursor(bytes);
  if (_bytesToHex(c.slice(5)) !== "70736274ff") throw new Error("not a PSBT (bad magic)");
  let unsigned = null;
  while (true) {                                  // global map
    const kl = c.varint(); if (kl === 0) break;
    const key = c.slice(kl); const val = c.varslice();
    if (key[0] === 0x00) unsigned = parseRawTx(val);
  }
  if (!unsigned) throw new Error("PSBTv2 (or missing unsigned tx) isn't supported yet — paste a v0 PSBT or the raw transaction hex");
  let partial = false;
  for (let i = 0; i < unsigned.vin.length; i++) {  // one input map per vin
    let wUtxo = null, nwUtxo = null;
    while (true) {
      const kl = c.varint(); if (kl === 0) break;
      const key = c.slice(kl); const val = c.varslice();
      if (key[0] === 0x01) { const ic = _makeCursor(val); const value = ic.u64(); const spk = ic.varslice(); wUtxo = { value, spk }; }
      else if (key[0] === 0x00) { nwUtxo = parseRawTx(val); }
    }
    let uxo = null;
    if (wUtxo) uxo = wUtxo;
    else if (nwUtxo) { const o = nwUtxo.vout[unsigned.vin[i].vout]; if (o) uxo = { value: o.value, spk: _hexToBytes(o.scriptpubkey) }; }
    if (!uxo) { partial = true; continue; }
    const cl = classifyScript(uxo.spk);
    unsigned.vin[i].prevout = { value: uxo.value, scriptpubkey_type: cl.type, scriptpubkey_address: _spkAddr(cl, uxo.spk) };
  }
  const inSum = unsigned.vin.reduce((a, v) => a + (v.prevout ? v.prevout.value : 0), 0);
  const outSum = unsigned.vout.reduce((a, o) => a + o.value, 0);
  return { txid: null, vin: unsigned.vin, vout: unsigned.vout, fee: partial ? null : inSum - outSum, partial, version: unsigned.version, locktime: unsigned.locktime };
}

// -- input detection + dispatch (paste-DoS capped) --
function detectTxInput(v) {
  const s = (v || "").trim();
  if (!s) return null;
  if (/^[0-9a-fA-F]{64}$/.test(s)) return "txid";
  if (/^cHNidP/.test(s)) return "psbt";                                  // base64 PSBT magic
  if (/^[0-9a-fA-F]+$/.test(s) && s.length % 2 === 0 && s.length >= 20) return "rawhex";
  return null;
}
function parseTransactionInput(raw) {
  const s = (raw || "").trim();
  if (s.length > 100000) throw new Error("Input too large — paste a single transaction");
  const kind = detectTxInput(s);
  if (kind === "psbt") return { kind, tx: parsePsbt(_base64ToBytes(s)) };
  if (kind === "rawhex") { const t = parseRawTx(_hexToBytes(s)); return { kind, tx: { txid: null, vin: t.vin, vout: t.vout, fee: null, partial: true, version: t.version, locktime: t.locktime } }; }
  if (kind === "txid") return { kind, tx: null };   // networked path (handled by the caller)
  throw new Error("Unrecognized input — paste a PSBT (base64), raw transaction hex, or a 64-character txid");
}

// -- transaction privacy analysis (mirrors the on-chain Exposure heuristics,
//    applied to one not-yet-broadcast transaction) --
const _txRound = v => v >= 100000 && (v % 1000000 === 0 || v % 500000 === 0);
const _txOpReturn = o => o.scriptpubkey_type === "op_return";
const _txDust = o => !_txOpReturn(o) && o.value > 0 && o.value < 546;
function analyzeTx(tx) {
  const vin = tx.vin || [], vout = tx.vout || [];
  const inAddrs = new Set(vin.map(v => v.prevout && v.prevout.scriptpubkey_address).filter(Boolean));
  const coinjoin = isCoinJoinShape(vin, vout);
  const consolidation = vin.length >= 4 && vout.length <= 2;
  const dust = vout.some(_txDust);
  const reuse = vout.some(o => o.scriptpubkey_address && inAddrs.has(o.scriptpubkey_address));
  const round = vout.some(o => _txRound(o.value));
  const leaky = consolidation || dust || reuse || (round && !coinjoin);
  const findings = [];
  if (coinjoin) findings.push({ ok: true, t: "Looks like a CoinJoin (many inputs, repeated equal outputs) — this breaks the trail" });
  if (consolidation) findings.push({ ok: false, t: vin.length + " inputs merge into " + vout.length + " output" + (vout.length !== 1 ? "s" : "") + " — this provably links those coins' histories forever" });
  if (reuse) findings.push({ ok: false, t: "An output pays back to one of the input addresses — address reuse exposes your whole balance" });
  if (round && !coinjoin) findings.push({ ok: false, t: "A round-number output — the classic KYC-exchange withdrawal fingerprint" });
  if (dust) findings.push({ ok: false, t: "A sub-546-sat dust output — a tracking beacon if it's ever spent" });
  return { coinjoin, consolidation, reuse, dust, round, leaky, findings };
}
// Which output is likely change (for a not-yet-broadcast tx)
function guessChange(tx) {
  const vin = tx.vin || [], vout = tx.vout || [];
  const spend = vout.map((o, i) => ({ o, i })).filter(x => x.o.scriptpubkey_type !== "op_return");
  const inAddrs = new Set(vin.map(v => v.prevout && v.prevout.scriptpubkey_address).filter(Boolean));
  const reuseHit = spend.find(x => x.o.scriptpubkey_address && inAddrs.has(x.o.scriptpubkey_address));
  if (reuseHit) return { index: reuseHit.i, confidence: "High", reason: "it pays back to one of the input addresses" };
  const inTypes = new Set(vin.map(v => v.prevout && v.prevout.scriptpubkey_type).filter(Boolean));
  if (spend.length === 2 && inTypes.size === 1) {
    const only = [...inTypes][0];
    const match = spend.filter(x => x.o.scriptpubkey_type === only);
    if (match.length === 1) return { index: match[0].i, confidence: "Medium", reason: "its address type (" + only + ") matches the inputs, and the other output's doesn't" };
  }
  if (spend.length === 2) {
    const rnd = spend.filter(x => _txRound(x.o.value));
    if (rnd.length === 1) { const other = spend.find(x => !_txRound(x.o.value)); return { index: other.i, confidence: "Low", reason: "the other output is a round payment amount, so this non-round one is likely change" }; }
  }
  return null;
}
// Addresses this spend fuses into one provable identity (common-input heuristic)
function clusterUnification(tx) {
  const vin = tx.vin || [];
  const addrs = [...new Set(vin.map(v => v.prevout && v.prevout.scriptpubkey_address).filter(a => a && !a.startsWith("script:")))];
  const types = new Set(vin.map(v => v.prevout && v.prevout.scriptpubkey_type).filter(Boolean));
  return { addrs, distinctTypes: types.size, knownInputs: vin.filter(v => v.prevout).length, totalInputs: vin.length };
}
function estimateVsize(tx) {
  const vin = tx.vin || [], vout = tx.vout || [];
  let vb = 10.5 + vout.length * 33;
  for (const v of vin) { const t = v.prevout && v.prevout.scriptpubkey_type; vb += (t === "v0_p2wpkh" || t === "v1_p2tr") ? 68 : t === "p2sh" ? 91 : 148; }
  return Math.max(1, Math.round(vb));
}
function feeRate(tx) { if (tx.fee == null) return null; const vs = estimateVsize(tx); return { sat: tx.fee, vsize: vs, rate: +(tx.fee / vs).toFixed(1), estimated: !tx.txid }; }

/* ─────────────────────────────────────────────
   TRANSACTION ENTROPY & LINKABILITY (Boltzmann / KYCP methodology, in pure JS)
   ───────────────────────────────────────────────
   The metric KYCP.org and OXT.me were built on — both offline since April 2024.
   An "interpretation" is a way to read the transaction as one or more independent
   sub-payments: a partition of the inputs and outputs into matched blocks (a
   bijection between input-blocks and output-blocks) where each block's inputs
   cover its outputs — the surplus is that sub-tx's share of the fee, so every
   block's surplus is ≥ 0 and the surpluses sum to the total fee. N = the number
   of such interpretations; the transaction's ENTROPY is E = log2(N) bits
   (LaurentMT's definition: a plain payment N=1 → E=0; an ambiguous 2×2 N=2 →
   E=1; a 2×2 equal-value CoinJoin N=3 → E=1.585). The LINK PROBABILITY LP(i,j)
   is the fraction of interpretations in which input i and output j share a block;
   LP=1 is a DETERMINISTIC link — an input→output connection provable on-chain,
   the exact thing surveillance clustering exploits. Validated against those
   canonical vectors (and LP=2/3 for the 2×2 CoinJoin) in the test suite.

   Pure-JS bitmask enumeration with memoised partition counting — no eval, no
   WASM, no dependency, unlike the Rust→WASM engines other tools ship. Capped at
   12 inputs / 12 outputs (the reference Boltzmann limit) with an iteration budget
   so it can never hang the browser; large equal-value CoinJoins are the only
   shape that explodes, and their ambiguity is exactly the point. */
function txInterpretations(ins, outs, fee, opts) {
  opts = opts || {};
  const n = ins.length, m = outs.length;
  const CAP = opts.cap || 12;
  if (n === 0 || m === 0) return { error: "empty" };
  if (n > CAP || m > CAP) return { error: "too-many", n, m, cap: CAP };
  if (fee == null) fee = ins.reduce((a, x) => a + x, 0) - outs.reduce((a, x) => a + x, 0);
  if (fee < 0) return { error: "negative-fee" };

  // subset sums (n,m ≤ 12 → ≤ 4096 masks each)
  const inSum = new Array(1 << n), outSum = new Array(1 << m);
  inSum[0] = 0; outSum[0] = 0;
  for (let mask = 1; mask < (1 << n); mask++) { const low = mask & -mask; inSum[mask] = inSum[mask ^ low] + ins[31 - Math.clz32(low)]; }
  for (let mask = 1; mask < (1 << m); mask++) { const low = mask & -mask; outSum[mask] = outSum[mask ^ low] + outs[31 - Math.clz32(low)]; }

  const fullIn = (1 << n) - 1, fullOut = (1 << m) - 1;
  const memo = new Map();
  const IT_CAP = opts.itCap || 8_000_000;
  let iterations = 0, bailed = false;

  // number of valid matched partitions of (inMask, outMask)
  function count(inMask, outMask) {
    if (inMask === 0) return outMask === 0 ? 1 : 0;
    if (outMask === 0) return 0;
    const key = inMask * (1 << m) + outMask;
    const hit = memo.get(key);
    if (hit !== undefined) return hit;
    const i0 = inMask & -inMask, restIn = inMask ^ i0;   // lowest input must be placed
    let total = 0, sub = restIn;
    for (;;) {
      if (bailed) break;
      const si = sub | i0, sIn = inSum[si];
      let osub = outMask;
      for (;;) {
        if (++iterations > IT_CAP) { bailed = true; break; }
        if (osub !== 0) { const surplus = sIn - outSum[osub]; if (surplus >= 0 && surplus <= fee) total += count(inMask ^ si, outMask ^ osub); }
        if (osub === 0) break;
        osub = (osub - 1) & outMask;
      }
      if (sub === 0) break;
      sub = (sub - 1) & restIn;
    }
    memo.set(key, total);
    return total;
  }

  const N = count(fullIn, fullOut);
  if (bailed) return { error: "iteration-cap" };
  if (N === 0) return { error: "no-interpretation" };

  // LP(i,j) = Σ over valid blocks (Si,So) containing i and j of count(rest) / N
  const link = [];
  for (let i = 0; i < n; i++) link.push(new Array(m).fill(0));
  for (let si = 1; si <= fullIn; si++) {
    const sIn = inSum[si];
    for (let so = 1; so <= fullOut; so++) {
      const surplus = sIn - outSum[so];
      if (surplus < 0 || surplus > fee) continue;
      const rest = count(fullIn ^ si, fullOut ^ so);
      if (rest === 0) continue;
      for (let i = 0; i < n; i++) if (si & (1 << i)) for (let j = 0; j < m; j++) if (so & (1 << j)) link[i][j] += rest;
    }
  }
  const lp = link.map(row => row.map(v => v / N));
  let dl = 0;
  for (let i = 0; i < n; i++) for (let j = 0; j < m; j++) if (Math.abs(lp[i][j] - 1) < 1e-9) dl++;
  return { N, entropy: Math.log2(N), lp, dl };
}

// Wrap a parsed tx: pull input/output values, drop OP_RETURN data outputs, and
// run the entropy analysis. Needs input amounts (a full PSBT or fetched tx), so
// raw hex — which carries none — reports unavailable rather than guessing.
function txLinkability(tx) {
  const vin = tx.vin || [], voutAll = tx.vout || [];
  if (!vin.length || vin.some(v => !v.prevout || v.prevout.value == null)) return { available: false, reason: "input-values-unknown" };
  const outs = [];
  voutAll.forEach((o, i) => { if (o.scriptpubkey_type !== "op_return" && o.value != null) outs.push({ v: o.value, idx: i }); });
  if (!outs.length) return { available: false, reason: "no-outputs" };
  const inVals = vin.map(v => v.prevout.value), outVals = outs.map(o => o.v);
  const fee = inVals.reduce((a, b) => a + b, 0) - outVals.reduce((a, b) => a + b, 0);
  if (fee < 0) return { available: false, reason: "negative-fee" };
  if (vin.length > 12 || outs.length > 12) return { available: false, reason: "too-many", n: vin.length, m: outs.length };
  const res = txInterpretations(inVals, outVals, fee);
  if (res.error) return { available: false, reason: res.error, n: vin.length, m: outs.length };
  return { available: true, n: vin.length, m: outs.length, N: res.N, entropy: res.entropy, dl: res.dl, lp: res.lp, outIdx: outs.map(o => o.idx), fee };
}

/* ─────────────────────────────────────────────
   WALLET FINGERPRINT — what a transaction's STRUCTURE reveals about the
   software that built it. Wallets differ in defaults an analyst reads directly
   off-chain: anti-fee-sniping nLockTime, nVersion, RBF nSequence, BIP69 input/
   output ordering, and script-type uniformity. A distinctive combination links
   all of a user's transactions to one wallet and narrows which software they
   run. Computed purely from the parsed tx (no network). Probabilistic by nature
   — reported as "consistent with / rules out", never as certain identification.
   Refs: Bitcoin Optech (fee-sniping, RBF, output linking), BIP69, BIP125. */
function fingerprintTx(tx) {
  const vin = tx.vin || [], vout = tx.vout || [];
  const nIn = vin.length, nOut = vout.length;
  if (!nIn || !nOut) return { available: false };
  const seqs = vin.map(v => v.sequence).filter(s => s != null);
  const haveSeq = seqs.length === nIn;
  const signals = [];

  // nVersion — 2 is near-universal post-BIP68; 1 is a mild tell of older/simpler software.
  if (tx.version === 1) signals.push({ key: "version", distinctive: true, t: "nVersion = 1 — most modern wallets set version 2; this is a mild tell of older or minimal software." });

  // Anti-fee-sniping: a height-based nLockTime near the chain tip (Core, Electrum).
  // Height-based locktime is < 500,000,000; 0 means the wallet doesn't bother.
  const lt = tx.locktime;
  const antiSnipe = lt != null && lt > 0 && lt < 500000000;
  if (lt != null) {
    if (antiSnipe) signals.push({ key: "locktime", distinctive: false, t: `nLockTime = ${lt} (a recent block height) — anti-fee-sniping, the Bitcoin Core / Electrum default. Good: it's the herd behaviour.` });
    else if (lt === 0) signals.push({ key: "locktime", distinctive: true, t: "nLockTime = 0 — no anti-fee-sniping. Rules out current Bitcoin Core / Electrum defaults; common in many mobile and hardware wallets." });
  }

  // RBF (BIP125): a tx opts in if any input sequence < 0xfffffffe. Uniform
  // 0xfffffffd is the Core/Electrum default (RBF + locktime-enabled).
  let rbf = null;
  if (haveSeq) {
    rbf = seqs.some(s => s < 0xfffffffe);
    const allFD = seqs.every(s => s === 0xfffffffd);
    const allMax = seqs.every(s => s === 0xffffffff);
    if (allFD) signals.push({ key: "rbf", distinctive: false, t: "All inputs nSequence = 0xfffffffd — opt-in RBF, the Core / Electrum default. Good: common." });
    else if (allMax) signals.push({ key: "rbf", distinctive: true, t: "All inputs nSequence = 0xffffffff — no RBF, no locktime. A distinctive default of some wallets; also disables anti-fee-sniping." });
    else if (rbf) signals.push({ key: "rbf", distinctive: true, t: "Mixed / non-standard nSequence values — an unusual signature that stands out." });
  }

  // BIP69: deterministic lexicographic ordering of inputs and outputs. Only a
  // handful of wallets do it, so it's a strong minority fingerprint.
  const inSorted = vin.every((v, i) => i === 0 || cmpIn(vin[i - 1], v) <= 0);
  const outSorted = vout.every((o, i) => i === 0 || cmpOut(vout[i - 1], o) <= 0);
  const bip69Meaningful = nIn > 1 || nOut > 1;
  if (bip69Meaningful && inSorted && outSorted) signals.push({ key: "bip69", distinctive: true, t: "Inputs and outputs are in BIP69 lexicographic order — a deterministic-ordering scheme only a minority of wallets use, so it narrows the field." });

  // Script-type uniformity. Mixed input types = manual coin control or a merged
  // wallet — itself a behavioural fingerprint an analyst notes.
  const inTypes = new Set(vin.map(v => v.prevout && v.prevout.scriptpubkey_type).filter(Boolean));
  if (inTypes.size > 1) signals.push({ key: "mixin", distinctive: true, t: `Inputs mix ${inTypes.size} script types — spending different address types together is unusual and links those coins as one owner's coin-control choice.` });

  // Low-r signature grinding — the strongest deterministic tell, but only visible
  // on a SIGNED tx (raw hex with witnesses); PSBTs are unsigned so it's skipped.
  let sawSig = false, sawHighR = false;
  for (const v of vin) for (const it of (v.witness || [])) { const si = _derSigInfo(it); if (si) { sawSig = true; if (si.highR) sawHighR = true; } }
  if (sawSig) {
    if (sawHighR) signals.push({ key: "lowr", distinctive: true, t: "A high-r ECDSA signature (72 bytes) is present — Bitcoin Core grinds every signature to low-r since v0.17 (2018), so this rules Core out as the signer." });
    else signals.push({ key: "lowr", distinctive: false, t: "All signatures are low-r (≤71 bytes) — consistent with Bitcoin Core and other modern wallets that grind signatures. Good: the common case." });
  }

  // A soft narrowing narrative from the strongest tells.
  let guess = "";
  const allFDseq = haveSeq && seqs.every(s => s === 0xfffffffd);
  if (sawHighR) return { available: true, signals, distinctive: signals.filter(s => s.distinctive).length, guess: "The high-r signature is decisive: this transaction was not signed by Bitcoin Core.", version: tx.version, locktime: lt, rbf };
  if (antiSnipe && rbf) guess = "Structure is consistent with Bitcoin Core or Electrum (anti-fee-sniping + opt-in RBF defaults).";
  else if (lt === 0 && haveSeq && seqs.every(s => s === 0xffffffff)) guess = "Structure rules out current Core / Electrum defaults (no anti-fee-sniping, no RBF) — consistent with several mobile / hardware wallets.";
  else if (allFDseq && !antiSnipe) guess = "The RBF default matches Core / Electrum, but the missing anti-fee-sniping locktime doesn't — an inconsistent pairing that itself stands out.";

  const distinctive = signals.filter(s => s.distinctive).length;
  return { available: true, signals, distinctive, guess, version: tx.version, locktime: lt, rbf };
}
// BIP69 comparators (module scope so fingerprintTx stays flat).
function cmpIn(a, b) { if (a.txid !== b.txid) return a.txid < b.txid ? -1 : 1; return (a.vout || 0) - (b.vout || 0); }
function cmpOut(a, b) { if ((a.value || 0) !== (b.value || 0)) return (a.value || 0) - (b.value || 0); const x = a.scriptpubkey || "", y = b.scriptpubkey || ""; return x < y ? -1 : x > y ? 1 : 0; }
// A witness/scriptSig signature push is a DER ECDSA sig + 1 sighash byte:
// 30 <len> 02 <rlen> <r> 02 <slen> <s> <sighash>. Bitcoin Core (≥v0.17, 2018)
// grinds every signature to low-r, so r fits in 32 bytes (rlen=0x20) and the sig
// is ≤71 bytes; a high-r sig (rlen=0x21, 33 bytes, total 72) is one Core would
// never produce — a deterministic "not Core" tell. Returns null for non-sigs.
function _derSigInfo(b) {
  if (!b || b.length < 9 || b[0] !== 0x30) return null;
  if (b[1] !== b.length - 3) return null;                 // DER length (excl. 2 header + 1 sighash)
  if (b[2] !== 0x02) return null;                         // r INTEGER marker
  const rlen = b[3];
  if (4 + rlen >= b.length || b[4 + rlen] !== 0x02) return null; // s INTEGER marker
  return { der: true, len: b.length, highR: rlen >= 0x21 };
}

// A real, minted PSBT (validated round-trip): 3 bech32 inputs fused, a round
// 5,000,000-sat payment, and change reused back to input #1 — a compact tour
// of what the Inspector catches. Parsed live by the real parser (zero network).
const DEMO_PSBT = "cHNidP8BAMMCAAAAAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD9////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAP3///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAA/f///wJAS0wAAAAAABYAFEREREREREREREREREREREREREREUC0ZAAAAAAAWABQREREREREREREREREREREREREREQAAAAAAAQEfwMYtAAAAAAAWABQREREREREREREREREREREREREREQABAR+gJSYAAAAAABYAFCIiIiIiIiIiIiIiIiIiIiIiIiIiAAEBH4BPEgAAAAAAFgAUMzMzMzMzMzMzMzMzMzMzMzMzMzMAAAA=";

/* ─────────────────────────────────────────────
   BIP32 PUBLIC DERIVATION — derive a whole wallet's addresses from an xpub,
   entirely in the browser (pure-JS BigInt, no eval/WASM, no dependency). Public
   keys only: no private keys, no signing, non-hardened indices only. Reuses the
   Inspector's _sha256 / _segwitAddress / _base58check. The added primitives
   (SHA-512, HMAC-SHA512, RIPEMD-160, secp256k1 point math) are validated against
   the BIP32 Test Vector 1 (non-hardened public path) and BIP84 (zpub → the exact
   bc1q addresses) known-answer vectors in the test suite before being trusted.
───────────────────────────────────────────── */
const _M64 = (1n << 64n) - 1n;
function _sha512(bytes) {
  const K=[0x428a2f98d728ae22n,0x7137449123ef65cdn,0xb5c0fbcfec4d3b2fn,0xe9b5dba58189dbbcn,0x3956c25bf348b538n,0x59f111f1b605d019n,0x923f82a4af194f9bn,0xab1c5ed5da6d8118n,0xd807aa98a3030242n,0x12835b0145706fben,0x243185be4ee4b28cn,0x550c7dc3d5ffb4e2n,0x72be5d74f27b896fn,0x80deb1fe3b1696b1n,0x9bdc06a725c71235n,0xc19bf174cf692694n,0xe49b69c19ef14ad2n,0xefbe4786384f25e3n,0x0fc19dc68b8cd5b5n,0x240ca1cc77ac9c65n,0x2de92c6f592b0275n,0x4a7484aa6ea6e483n,0x5cb0a9dcbd41fbd4n,0x76f988da831153b5n,0x983e5152ee66dfabn,0xa831c66d2db43210n,0xb00327c898fb213fn,0xbf597fc7beef0ee4n,0xc6e00bf33da88fc2n,0xd5a79147930aa725n,0x06ca6351e003826fn,0x142929670a0e6e70n,0x27b70a8546d22ffcn,0x2e1b21385c26c926n,0x4d2c6dfc5ac42aedn,0x53380d139d95b3dfn,0x650a73548baf63den,0x766a0abb3c77b2a8n,0x81c2c92e47edaee6n,0x92722c851482353bn,0xa2bfe8a14cf10364n,0xa81a664bbc423001n,0xc24b8b70d0f89791n,0xc76c51a30654be30n,0xd192e819d6ef5218n,0xd69906245565a910n,0xf40e35855771202an,0x106aa07032bbd1b8n,0x19a4c116b8d2d0c8n,0x1e376c085141ab53n,0x2748774cdf8eeb99n,0x34b0bcb5e19b48a8n,0x391c0cb3c5c95a63n,0x4ed8aa4ae3418acbn,0x5b9cca4f7763e373n,0x682e6ff3d6b2b8a3n,0x748f82ee5defb2fcn,0x78a5636f43172f60n,0x84c87814a1f0ab72n,0x8cc702081a6439ecn,0x90befffa23631e28n,0xa4506cebde82bde9n,0xbef9a3f7b2c67915n,0xc67178f2e372532bn,0xca273eceea26619cn,0xd186b8c721c0c207n,0xeada7dd6cde0eb1en,0xf57d4f7fee6ed178n,0x06f067aa72176fban,0x0a637dc5a2c898a6n,0x113f9804bef90daen,0x1b710b35131c471bn,0x28db77f523047d84n,0x32caab7b40c72493n,0x3c9ebe0a15c9bebcn,0x431d67c49c100d4cn,0x4cc5d4becb3e42b6n,0x597f299cfc657e2an,0x5fcb6fab3ad6faecn,0x6c44198c4a475817n];
  let h=[0x6a09e667f3bcc908n,0xbb67ae8584caa73bn,0x3c6ef372fe94f82bn,0xa54ff53a5f1d36f1n,0x510e527fade682d1n,0x9b05688c2b3e6c1fn,0x1f83d9abfb41bd6bn,0x5be0cd19137e2179n];
  const l=bytes.length, bitLen=BigInt(l)*8n, withOne=l+1, pad=(112-(withOne%128)+128)%128, total=withOne+pad+16;
  const m=new Uint8Array(total); m.set(bytes); m[l]=0x80;
  for(let i=0;i<8;i++) m[total-1-i]=Number((bitLen>>BigInt(8*i))&0xffn);
  const rot=(x,n)=>((x>>n)|(x<<(64n-n)))&_M64, W=new Array(80);
  for(let off=0;off<total;off+=128){
    for(let i=0;i<16;i++){ let w=0n; for(let j=0;j<8;j++) w=(w<<8n)|BigInt(m[off+i*8+j]); W[i]=w; }
    for(let i=16;i<80;i++){ const s0=rot(W[i-15],1n)^rot(W[i-15],8n)^(W[i-15]>>7n), s1=rot(W[i-2],19n)^rot(W[i-2],61n)^(W[i-2]>>6n); W[i]=(W[i-16]+s0+W[i-7]+s1)&_M64; }
    let [a,b,c,d,e,f,g,hh]=h;
    for(let i=0;i<80;i++){ const S1=rot(e,14n)^rot(e,18n)^rot(e,41n), ch=(e&f)^((~e&_M64)&g), t1=(hh+S1+ch+K[i]+W[i])&_M64, S0=rot(a,28n)^rot(a,34n)^rot(a,39n), maj=(a&b)^(a&c)^(b&c), t2=(S0+maj)&_M64; hh=g;g=f;f=e;e=(d+t1)&_M64;d=c;c=b;b=a;a=(t1+t2)&_M64; }
    h=[(h[0]+a)&_M64,(h[1]+b)&_M64,(h[2]+c)&_M64,(h[3]+d)&_M64,(h[4]+e)&_M64,(h[5]+f)&_M64,(h[6]+g)&_M64,(h[7]+hh)&_M64];
  }
  const out=new Uint8Array(64); for(let i=0;i<8;i++) for(let j=0;j<8;j++) out[i*8+j]=Number((h[i]>>BigInt(56-8*j))&0xffn); return out;
}
function _hmacSha512(key, data) {
  const B=128; if(key.length>B) key=_sha512(key);
  const k=new Uint8Array(B); k.set(key); const ip=new Uint8Array(B), op=new Uint8Array(B);
  for(let i=0;i<B;i++){ ip[i]=k[i]^0x36; op[i]=k[i]^0x5c; }
  const cat=(a,b)=>{ const o=new Uint8Array(a.length+b.length); o.set(a); o.set(b,a.length); return o; };
  return _sha512(cat(op, _sha512(cat(ip, data))));
}
function _ripemd160(bytes) {
  const rol=(x,n)=>((x<<n)|(x>>>(32-n)))>>>0;
  const f=(j,x,y,z)=> j<16?(x^y^z): j<32?((x&y)|(~x&z)): j<48?((x|~y)^z): j<64?((x&z)|(y&~z)): (x^(y|~z));
  const K=[0x00000000,0x5a827999,0x6ed9eba1,0x8f1bbcdc,0xa953fd4e], KK=[0x50a28be6,0x5c4dd124,0x6d703ef3,0x7a6d76e9,0x00000000];
  const r=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,7,4,13,1,10,6,15,3,12,0,9,5,2,14,11,8,3,10,14,4,9,15,8,1,2,7,0,6,13,11,5,12,1,9,11,10,0,8,12,4,13,3,7,15,14,5,6,2,4,0,5,9,7,12,2,10,14,1,3,8,11,6,15,13];
  const rr=[5,14,7,0,9,2,11,4,13,6,15,8,1,10,3,12,6,11,3,7,0,13,5,10,14,15,8,12,4,9,1,2,15,5,1,3,7,14,6,9,11,8,12,2,10,0,4,13,8,6,4,1,3,11,15,0,5,12,2,13,9,7,10,14,12,15,10,4,1,5,8,7,6,2,13,14,0,3,9,11];
  const s=[11,14,15,12,5,8,7,9,11,13,14,15,6,7,9,8,7,6,8,13,11,9,7,15,7,12,15,9,11,7,13,12,11,13,6,7,14,9,13,15,14,8,13,6,5,12,7,5,11,12,14,15,14,15,9,8,9,14,5,6,8,6,5,12,9,15,5,11,6,8,13,12,5,12,13,14,11,8,5,6];
  const ss=[8,9,9,11,13,15,15,5,7,7,8,11,14,14,12,6,9,13,15,7,12,8,9,11,7,7,12,7,6,15,13,11,9,7,15,11,8,6,6,14,12,13,5,14,13,13,7,5,15,5,8,11,14,14,6,14,6,9,12,9,12,5,15,8,8,5,12,9,12,5,14,6,8,13,6,5,15,13,11,11];
  const l=bytes.length, bitLen=l*8, withOne=l+1, pad=(56-(withOne%64)+64)%64, total=withOne+pad+8;
  const m=new Uint8Array(total); m.set(bytes); m[l]=0x80; const dv=new DataView(m.buffer);
  dv.setUint32(total-8,bitLen>>>0,true); dv.setUint32(total-4,Math.floor(bitLen/0x100000000),true);
  let h0=0x67452301,h1=0xefcdab89,h2=0x98badcfe,h3=0x10325476,h4=0xc3d2e1f0; const X=new Array(16);
  for(let off=0;off<total;off+=64){
    for(let i=0;i<16;i++)X[i]=dv.getUint32(off+i*4,true);
    let a=h0,b=h1,c=h2,d=h3,e=h4,a2=h0,b2=h1,c2=h2,d2=h3,e2=h4;
    for(let j=0;j<80;j++){ const jj=(j/16)|0;
      let tt=(a+f(j,b,c,d)+X[r[j]]+K[jj])>>>0; tt=(rol(tt,s[j])+e)>>>0; a=e;e=d;d=rol(c,10);c=b;b=tt;
      let t2=(a2+f(79-j,b2,c2,d2)+X[rr[j]]+KK[jj])>>>0; t2=(rol(t2,ss[j])+e2)>>>0; a2=e2;e2=d2;d2=rol(c2,10);c2=b2;b2=t2;
    }
    const tmp=(h1+c+d2)>>>0; h1=(h2+d+e2)>>>0; h2=(h3+e+a2)>>>0; h3=(h4+a+b2)>>>0; h4=(h0+b+c2)>>>0; h0=tmp;
  }
  const out=new Uint8Array(20), odv=new DataView(out.buffer); [h0,h1,h2,h3,h4].forEach((hv,i)=>odv.setUint32(i*4,hv>>>0,true)); return out;
}
function _hash160(b) { return _ripemd160(_sha256(b)); }

// base58check DECODE (the Inspector added ENCODE only)
const _B58MAP = (() => { const m = {}; for (let i=0;i<_B58.length;i++) m[_B58[i]]=i; return m; })();
function _base58decode(str) {
  let z=0; while(z<str.length && str[z]==="1") z++;
  const bytes=[0];
  for(let i=z;i<str.length;i++){ const c=_B58MAP[str[i]]; if(c===undefined) throw new Error("invalid base58"); let carry=c; for(let j=0;j<bytes.length;j++){ carry+=bytes[j]*58; bytes[j]=carry&0xff; carry>>=8; } while(carry){ bytes.push(carry&0xff); carry>>=8; } }
  const out=new Uint8Array(z+bytes.length); for(let i=0;i<bytes.length;i++) out[z+i]=bytes[bytes.length-1-i]; return out;
}
function _base58checkDecode(str) {
  const full=_base58decode(str); if(full.length<5) throw new Error("too short");
  const body=full.slice(0,full.length-4), chk=full.slice(full.length-4), calc=_sha256(_sha256(body)).slice(0,4);
  for(let i=0;i<4;i++) if(chk[i]!==calc[i]) throw new Error("bad checksum");
  return body;
}

// secp256k1 (affine, a=0 b=7) — public-key math only
const _ecP=0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2Fn;
const _ecN=0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141n;
const _ecG={x:0x79BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798n,y:0x483ADA7726A3C4655DA4FBFC0E1108A8FD17B448A68554199C47D08FFB10D4B8n};
const _ecMod=(a)=>{ a%=_ecP; return a<0n?a+_ecP:a; };
function _modpow(b,e,m){ b=((b%m)+m)%m; let r=1n; while(e>0n){ if(e&1n) r=(r*b)%m; b=(b*b)%m; e>>=1n; } return r; }
const _modinv=(a)=>_modpow(_ecMod(a),_ecP-2n,_ecP);
function _ptDouble(A){ if(!A) return null; const s=_ecMod((3n*A.x*A.x)*_modinv(2n*A.y)); const x=_ecMod(s*s-2n*A.x); return {x,y:_ecMod(s*(A.x-x)-A.y)}; }
function _ptAdd(A,B){ if(!A) return B; if(!B) return A; if(A.x===B.x){ if(_ecMod(A.y+B.y)===0n) return null; return _ptDouble(A); } const s=_ecMod((B.y-A.y)*_modinv(B.x-A.x)); const x=_ecMod(s*s-A.x-B.x); return {x,y:_ecMod(s*(A.x-x)-A.y)}; }
function _ptMul(k,Pt){ let r=null,a=Pt; while(k>0n){ if(k&1n) r=_ptAdd(r,a); a=_ptDouble(a); k>>=1n; } return r; }
const _beToBig=(b)=>{ let v=0n; for(const x of b) v=(v<<8n)|BigInt(x); return v; };
const _bigTo32=(v)=>{ const o=new Uint8Array(32); for(let i=31;i>=0;i--){ o[i]=Number(v&0xffn); v>>=8n; } return o; };
function _decompressPt(pub33){ const prefix=pub33[0]; const x=_beToBig(pub33.slice(1,33)); const rhs=_ecMod(x*x*x+7n); let y=_modpow(rhs,(_ecP+1n)/4n,_ecP); if((y&1n)!==BigInt(prefix&1)) y=_ecMod(-y); if(_ecMod(y*y)!==rhs) throw new Error("point not on curve"); return {x,y}; }
function _compressPt(pt){ const o=new Uint8Array(33); o[0]=(pt.y&1n)===0n?0x02:0x03; o.set(_bigTo32(pt.x),1); return o; }

// SLIP-132 version → scriptType; derivation math is identical for all three.
const SLIP132 = { 0x0488b21e: "p2pkh", 0x049d7cb2: "p2sh-p2wpkh", 0x04b24746: "p2wpkh" };
function decodeXpub(str) {
  const p = _base58checkDecode(str.trim());
  if (p.length !== 78) throw new Error("Not an extended public key");
  const version = ((p[0]<<24)|(p[1]<<16)|(p[2]<<8)|p[3]) >>> 0;
  const scriptType = SLIP132[version];
  const keyData = p.slice(45, 78);
  if (!scriptType) throw new Error("Unsupported key — paste an xpub, ypub, or zpub (mainnet)");
  if (keyData[0] !== 0x02 && keyData[0] !== 0x03) throw new Error("That's a private key (xprv). Never paste a private key — use the public xpub/ypub/zpub.");
  return { version, scriptType, depth: p[4], childNumber: ((p[9]<<24)|(p[10]<<16)|(p[11]<<8)|p[12])>>>0, chainCode: p.slice(13, 45), keyData };
}
function _ser32(i) { return new Uint8Array([(i>>>24)&0xff,(i>>>16)&0xff,(i>>>8)&0xff,i&0xff]); }
function ckdPub(pub33, cc32, i) {
  if (i >= 0x80000000) return null;   // hardened is impossible from a public key — skip
  const data = new Uint8Array(37); data.set(pub33); data.set(_ser32(i), 33);
  const I = _hmacSha512(cc32, data), IL = I.slice(0, 32), IR = I.slice(32, 64);
  const ILint = _beToBig(IL);
  if (ILint >= _ecN) return null;                       // invalid — caller skips this index
  const child = _ptAdd(_ptMul(ILint, _ecG), _decompressPt(pub33));
  if (!child) return null;
  return { pub33: _compressPt(child), cc32: IR };
}
function deriveWalletAddress(pub33, scriptType) {
  const h = _hash160(pub33);
  if (scriptType === "p2pkh") return _base58check(0x00, h);
  if (scriptType === "p2sh-p2wpkh") { const redeem = new Uint8Array(22); redeem[0]=0x00; redeem[1]=0x14; redeem.set(h, 2); return _base58check(0x05, _hash160(redeem)); }
  return _segwitAddress(0, h);   // p2wpkh
}
function detectXpub(v) {
  const s = (v || "").trim();
  return /^(xpub|ypub|zpub)[1-9A-HJ-NP-Za-km-z]{100,116}$/.test(s) ? "xpub" : null;
}

/* ─────────────────────────────────────────────
   WALLET SCANNER + ENGINE — gap-limit scan a whole wallet from its xpub and
   score it at the WALLET level (not per address). Reuses the single-address
   detectors on a txid-deduped combined set, and adds the checks only a
   wallet-wide view can see (true address reuse, cross-address common-input
   linkage). Every derived address is fetched as an ordinary single-address
   lookup, so the relay/explorer path is unchanged.
───────────────────────────────────────────── */
// Cheap probe — the address summary only (chain_stats), for gap-limit detection.
async function fetchAddrInfo(addr) {
  const exp = explorer();
  const base = relayOn() ? RELAY_URL + exp.relayPath : exp.api;
  const r = await fetch(`${base}/address/${encodeURIComponent(addr)}`);
  if (!r.ok) throw new Error("Address lookup failed");
  return r.json();
}

async function scanXpub(xpub, opts = {}) {
  const onProgress = opts.onProgress || (() => {});
  const node = decodeXpub(xpub);
  const GAP = 20, CAP = 100;              // gap limit + hard per-branch cap
  const addresses = [];
  let derived = 0, capHit = false;
  for (const branch of [0, 1]) {          // 0 = receive, 1 = change
    const b = ckdPub(node.keyData, node.chainCode, branch);
    if (!b) continue;
    let gap = 0, i = 0;
    while (gap < GAP && i < CAP) {         // CAP is PER-BRANCH so a big receive chain can't starve change
      const child = ckdPub(b.pub33, b.cc32, i);
      if (!child) { i++; continue; }
      const address = deriveWalletAddress(child.pub33, node.scriptType);
      derived++;
      onProgress({ derived, branch, used: addresses.length });
      const info = await fetchAddrInfo(address);
      const cs = info.chain_stats || {};
      if ((cs.tx_count || 0) > 0) {
        gap = 0;
        const full = await fetchAddress(address);
        (full.utxos || []).forEach(u => { u.address = address; });
        addresses.push({ address, branch, index: i, chain_stats: cs, utxos: full.utxos || [], txs: full.txs || [] });
      } else gap++;
      i++;
    }
    if (i >= CAP) capHit = true;
  }
  return { scriptType: node.scriptType, addresses, derived, capHit };
}

function runWalletEngine(scan) {
  const addrs = scan.addresses || [];
  const ownAddrs = new Set(addrs.map(a => a.address));
  const utxos = addrs.flatMap(a => a.utxos || []);
  const balance = utxos.reduce((s, u) => s + (u.value || 0), 0);
  const stats = { addresses: scan.derived || addrs.length, used: addrs.length, reused: 0, balance };

  if (addrs.length === 0) {
    return { score: null, grade: "—", riskLabel: "No history", riskColor: T.textDim, checks: [], recommendations: [], stats, isEmpty: true, capHit: scan.capHit };
  }

  // Dedupe transactions by txid (a self-send touches >=2 scanned addresses).
  const txMap = new Map();
  addrs.forEach(a => (a.txs || []).forEach(tx => { if (tx.txid && !txMap.has(tx.txid)) txMap.set(tx.txid, tx); }));
  const txs = [...txMap.values()];
  const spentByMe = tx => (tx.vin || []).some(v => v.prevout && ownAddrs.has(v.prevout.scriptpubkey_address));

  // True reuse = an address that RECEIVED more than once (funded_txo_count>=2).
  // tx_count>=2 alone is the normal receive-then-spend lifecycle and is NOT reuse.
  const reusedAddrs = addrs.filter(a => (a.chain_stats.funded_txo_count || 0) >= 2);
  stats.reused = reusedAddrs.length;

  // Cross-address common-input: a tx whose inputs span >=2 of the wallet's own
  // addresses — the chain provably tying your addresses to one owner.
  const linkTxs = txs.filter(tx => new Set((tx.vin || []).map(v => v.prevout && v.prevout.scriptpubkey_address).filter(a => ownAddrs.has(a))).size >= 2);
  const consolidations = txs.filter(tx => spentByMe(tx) && (tx.vin || []).length >= 4 && (tx.vout || []).length <= 2);
  const coinjoins = txs.filter(tx => isCoinJoinShape(tx.vin, tx.vout));
  const dustU = utxos.filter(u => u.value > 0 && u.value < 1000);
  const roundU = utxos.filter(u => u.value >= 100000 && u.value % 100000 === 0);
  const largest = utxos.reduce((m, u) => Math.max(m, u.value || 0), 0);
  const concentrated = balance > 0 && largest / balance > 0.9 && addrs.length > 1;

  let score = 100;
  const checks = [];
  const add = (key, name, status, detail, plain, sev, pts) => { checks.push({ key, name, status, detail, plain, sev, pts }); score += pts; };

  if (reusedAddrs.length >= 3)      add("reuse", "Address Reuse", "fail", `${reusedAddrs.length} of your addresses were reused (received more than once)`, "Reusing an address links all its payments. Several of your addresses received more than once.", "high", -22);
  else if (reusedAddrs.length)      add("reuse", "Address Reuse", "warn", `${reusedAddrs.length} address${reusedAddrs.length > 1 ? "es" : ""} reused`, "One or two addresses received more than once — use a fresh address every time.", "medium", -8);
  else                             add("reuse", "Address Reuse", "pass", "Every address received at most once", "No reuse — your wallet uses a fresh address per payment. This is the single most important habit.", "clean", 0);

  if (linkTxs.length)               add("cluster", "Address Linkage", "fail", `${linkTxs.length} transaction${linkTxs.length > 1 ? "s" : ""} co-spend from ${linkTxs.length > 1 ? "several" : "two"} of your addresses`, "When one transaction spends from two of your addresses, the chain proves they share one owner — collapsing your wallet into a single cluster.", "high", -18);
  else                             add("cluster", "Address Linkage", "pass", "No transaction links your addresses together", "None of your spends co-spend from multiple of your addresses, so the chain can't merge them via the common-input heuristic.", "clean", 0);

  if (coinjoins.length)             add("cj", "CoinJoin", "pass", `${coinjoins.length} CoinJoin${coinjoins.length > 1 ? "s" : ""} in this wallet`, "This wallet has used CoinJoin — the strongest break in the transaction graph.", "clean", +8);
  else                             add("cj", "CoinJoin", "warn", "No CoinJoin — history is fully linkable", "Nothing in this wallet breaks the transaction graph. A CoinJoin (or Payjoin on payments) is the highest-impact fix.", "medium", -6);

  if (consolidations.length)        add("cons", "Unsafe Consolidation", "warn", `${consolidations.length} consolidation${consolidations.length > 1 ? "s" : ""} merge coins`, "Merging many inputs into one output links those coins' histories permanently. Use coin control to keep sources separate.", "medium", -6);
  else                             add("cons", "Unsafe Consolidation", "pass", "No risky consolidations", "You haven't merged coins from different sources into one output.", "clean", 0);

  if (dustU.length)                 add("dust", "Dust", "warn", `${dustU.length} dust output${dustU.length > 1 ? "s" : ""} in the wallet`, "Sub-1000-sat outputs are often tracking beacons. Freeze them — never spend them.", "medium", -8);
  else                             add("dust", "Dust", "pass", "No dust outputs", "No suspicious tiny outputs found across the wallet.", "clean", 0);

  if (roundU.length)                add("round", "Round Amounts", "warn", `${roundU.length} round-amount output${roundU.length > 1 ? "s" : ""}`, "Round amounts fingerprint KYC-exchange withdrawals.", "low", -4);
  if (concentrated)                 add("conc", "Balance Concentration", "warn", "90%+ of the balance is in one output", "Nearly all your Bitcoin sits in a single output — every spend reveals almost your whole balance.", "medium", -5);

  score = Math.max(0, Math.min(100, Math.round(score)));

  const recs = [];
  const R = (icon, action, plain, impact, effort, tools) => recs.push({ icon, action, plain, detail: plain, impact, effort, tools });
  if (reusedAddrs.length) R("🔄", "Use a fresh address every time", "Reusing an address links all its payments. Let your wallet generate a new receive address for each payment, or publish a Silent Payment (sp1…) so a single shareable string derives a fresh address per sender.", 15, "Easy", [{ name: "Sparrow Wallet", note: "" }, { name: "Cake Wallet", note: "Silent Payments" }]);
  if (linkTxs.length || consolidations.length) R("⚗️", "Use coin control — don't merge sources", "Combining coins from different addresses links them forever. Select inputs manually and keep KYC and non-KYC coins in separate wallets.", 12, "Medium", [{ name: "Sparrow Wallet", note: "best-in-class coin control" }]);
  if (!coinjoins.length) R("🔀", "Break the graph with CoinJoin / Payjoin", "Nothing in this wallet breaks the transaction graph. A CoinJoin round or Payjoin on ordinary payments makes the common-input heuristic fail.", 18, "Medium", [{ name: "Wasabi Wallet", note: "" }, { name: "Joinmarket", note: "" }]);
  if (dustU.length) R("🧊", "Freeze your dust", "Those tiny outputs may be tracking beacons. Mark them do-not-spend so they're never pulled into a transaction.", 9, "Easy", [{ name: "Sparrow Wallet", note: "right-click → Freeze" }]);
  recs.sort((a, b) => b.impact - a.impact);

  return { score, grade: scoreGrade(score), riskLabel: scoreLabel(score), riskColor: scoreColor(score), checks, recommendations: recs.slice(0, 5), stats, isEmpty: false, capHit: scan.capHit, perAddress: addrs };
}

// Offline demo wallet (zero network): the three real BIP84 addresses, with a
// reused address, a cross-address link tx, and a dust output — fed straight to
// runWalletEngine by the "Load example" button.
const _DA = ["bc1qcr8te4kr609gcawutmrza0j4xv80jy8z306fyu", "bc1qnjg0jd8228aq7egyzacy8cys3knf9xvrerkf9g", "bc1q8c6fshw2dlwun7ekn9qwf37cu2rn755upcp6el"];
const DEMO_WALLET = {
  scriptType: "p2wpkh", derived: 26, capHit: false,
  addresses: [
    { address: _DA[0], branch: 0, index: 0, chain_stats: { tx_count: 3, funded_txo_count: 2, spent_txo_count: 1 },
      utxos: [{ txid: "w1", value: 4200000, address: _DA[0] }],
      txs: [{ txid: "link1", vin: [{ prevout: { scriptpubkey_address: _DA[0] } }, { prevout: { scriptpubkey_address: _DA[1] } }], vout: [{ value: 6100000, scriptpubkey_address: "bc1qexternalpayee000000000000000000000000" }], fee: 600, size: 200 }] },
    { address: _DA[1], branch: 0, index: 1, chain_stats: { tx_count: 2, funded_txo_count: 1, spent_txo_count: 1 },
      utxos: [{ txid: "w2", value: 546, address: _DA[1] }],
      txs: [{ txid: "link1" }, { txid: "d1", vin: [{ prevout: { scriptpubkey_address: "bc1qtracker00000000000000000000000000000" } }], vout: [{ value: 546, scriptpubkey_address: _DA[1] }], fee: 200, size: 150 }] },
    { address: _DA[2], branch: 1, index: 0, chain_stats: { tx_count: 1, funded_txo_count: 1, spent_txo_count: 0 },
      utxos: [{ txid: "w3", value: 3000000, address: _DA[2] }], txs: [] },
  ],
};

/* ─────────────────────────────────────────────
   PRIVACY ENGINE — 11 heuristics
───────────────────────────────────────────── */
function runEngine(utxos = [], txs = [], txCount = 0) {
  // Guard: no on-chain history at all — new/unused address
  if (txCount === 0 && utxos.length === 0) {
    return {
      score: null,
      grade: "—",
      riskLabel: "No History",
      riskColor: T.textDim,
      checks: [],
      recommendations: [],
      isEmpty: true,
    };
  }

  let score = 100;
  const checks = [];
  const add = (key, name, status, detail, plain, sev, pts) => {
    checks.push({ key, name, status, detail, plain, sev: sev || "medium", pts: pts || 0 });
    score += pts;
  };

  // 1. Address reuse
  if (txCount >= 10)     add("reuse","Address Reuse","fail",`Used ${txCount}+ times — every spend permanently linked`,"This address has been used many times. Every reuse permanently links your transactions for any analyst to see.","critical",-28);
  else if (txCount >= 4) add("reuse","Address Reuse","fail",`Used ${txCount} times — linkable on-chain`,"This address has been reused. Ideally, use a fresh address for every transaction.","high",-15);
  else if (txCount >= 2) add("reuse","Address Reuse","warn",`Used ${txCount} times — minor exposure`,"Minor reuse. Generate a new address for your next receive.","medium",-7);
  else                   add("reuse","Address Reuse","pass","Fresh address — no reuse","Great. This address has only been used once.","clean",0);

  // 2. Dust
  const dust = utxos.filter(u => u.value < 1000);
  if (dust.length > 2)   add("dust","Dust Attack","fail",`${dust.length} dust UTXOs — tracking beacons planted`,"Small amounts sent by trackers. Spending them reveals your wallet cluster to surveillance firms.","high",-12);
  else if (dust.length)  add("dust","Dust Attack","warn",`${dust.length} dust UTXO — possible tracker`,"A tiny amount was sent to your address. Freeze it in Sparrow — never spend it.","medium",-5);
  else                   add("dust","Dust Attack","pass","No dust UTXOs","No suspicious tiny amounts found.","clean",0);

  // 3. Round amounts
  const round = utxos.filter(u => u.value >= 100000 && u.value % 100000 === 0);
  if (round.length >= 2) add("round","Round Amounts","fail",`${round.length} round-number UTXOs — KYC withdrawal pattern`,"Round amounts like 0.1 BTC are a Chainalysis red flag. Analysts assume these came from KYC exchanges.","high",-10);
  else if (round.length) add("round","Round Amounts","warn","1 round-number UTXO — minor fingerprint","One round amount. Use odd numbers next time you withdraw from an exchange.","medium",-5);
  else                   add("round","Round Amounts","pass","No suspicious round amounts","Good — your UTXOs use non-round amounts.","clean",0);

  // 4. CoinJoin — requires multiple inputs (participants), not just repeated
  // outputs, so a single-sender batch payout isn't miscredited as a mix.
  let cjCount = 0;
  for (const tx of txs.slice(0, 20)) {
    if (isCoinJoinShape(tx.vin, tx.vout)) cjCount++;
  }
  if (cjCount >= 2)      add("cj","CoinJoin Used","pass",`${cjCount} CoinJoin transactions — strong mixing hygiene`,"You've used CoinJoin to break transaction links. This significantly improves your privacy.","clean",+12);
  else if (cjCount === 1)add("cj","CoinJoin Used","warn","1 CoinJoin — anonymity set may be small","You've used CoinJoin once. More rounds with larger groups improve your score.","medium",+4);
  else                   add("cj","CoinJoin Used","fail","No CoinJoin — full history traceable","Your transaction history is fully visible. CoinJoin breaks this chain permanently.","high",-8);

  // 5. Consolidation
  const cons = txs.filter(t => t.vin?.length >= 4 && t.vout?.length <= 2);
  if (cons.length >= 2)  add("cons","Unsafe Consolidation","fail",`${cons.length} merges link your coin histories`,"You've combined coins from different sources. This links those histories permanently on-chain.","high",-10);
  else if (cons.length)  add("cons","Unsafe Consolidation","warn","1 consolidation — minor linking event","One consolidation detected. Be careful about which coins you combine.","medium",-4);
  else                   add("cons","Unsafe Consolidation","pass","No risky UTXO merges","Your UTXOs haven't been unsafely combined.","clean",0);

  // 6. UTXO count
  const n = utxos.length;
  if (n > 20)            add("utxo_n","UTXO Count","fail",`${n} UTXOs — bloated, high consolidation risk`,"Too many small UTXOs create fee pressure and tempt you to consolidate unsafely.","medium",-8);
  else if (n > 10)       add("utxo_n","UTXO Count","warn",`${n} UTXOs — manageable but monitor`,"Slightly high. Manage carefully during low-fee periods.","low",-3);
  else if (n === 1)      add("utxo_n","UTXO Count","warn","Single UTXO — exposes total balance per spend","With one UTXO, every transaction reveals your full balance to the recipient.","medium",-5);
  else                   add("utxo_n","UTXO Count","pass",`${n} UTXOs — healthy range`,"Good — your balance is spread across a manageable number of UTXOs.","clean",0);

  // 7. Fee fingerprinting
  const feeRates = txs.filter(t => t.fee && t.size).map(t => Math.round(t.fee / t.size));
  if (feeRates.length >= 4 && new Set(feeRates).size <= 2)
    add("fee","Fee Fingerprinting","warn","Identical fee rates — wallet software identifiable","Using the same fee rate every time fingerprints your wallet software for analysts.","medium",-6);
  else
    add("fee","Fee Fingerprinting","pass","Varied fee rates — no wallet fingerprint","Good — your fee rates vary, making your wallet harder to identify.","clean",0);

  // 8. Change address — FIX: use scriptpubkey_address safely
  const changeReuse = txs.some(tx => {
    if (tx.vout?.length !== 2) return false;
    const inputAddrs = new Set((tx.vin || []).map(i => i.prevout?.scriptpubkey_address).filter(Boolean));
    return (tx.vout || []).some(o => o.scriptpubkey_address && inputAddrs.has(o.scriptpubkey_address));
  });
  if (changeReuse)
    add("change","Change Address Reuse","fail","Change sent back to input address — balance exposed","Your wallet sent change back to the same address it spent from. This exposes your full balance.","high",-10);
  else
    add("change","Change Address Reuse","pass","Change sent to fresh addresses","Your change outputs go to new addresses — good practice.","clean",0);

  // 9. Balance concentration
  const largest = utxos.length ? Math.max(...utxos.map(u => u.value)) : 0;
  const total = utxos.reduce((s, u) => s + u.value, 0);
  if (largest > 0 && total > 0 && largest / total > 0.9)
    add("conc","Balance Concentration","warn","90%+ in one UTXO — exposes full balance per spend","Almost all your Bitcoin is in one output. Every transaction reveals nearly your full holdings.","medium",-5);
  else
    add("conc","Balance Concentration","pass","Balance spread across UTXOs","Good — your balance is distributed.","clean",0);

  // 10. Script type mixing — FIX: use scriptpubkey_type from API, not value proxy
  const scriptTypes = new Set(utxos.map(u => u.scriptpubkey_type || (u.value > 10000000 ? "v0_p2wpkh" : "p2pkh")).filter(Boolean));
  if (scriptTypes.size > 1)
    add("script","Mixed Script Types","warn","Mixed legacy/SegWit — linkable by script type","Using different address formats across UTXOs creates patterns analysts can exploit.","low",-4);
  else
    add("script","Mixed Script Types","pass","Consistent script type","Your UTXOs use a consistent address format.","clean",0);

  // 11. Change detection via script-type mismatch — the classic two-output
  // tell: when a payment has exactly two outputs and only ONE matches the
  // input's script type, that one is almost certainly the change. Analysts use
  // this to know which coins are still yours, hop after hop.
  const changeIdCount = txs.filter(tx => {
    if (tx.vout?.length !== 2) return false;
    const inType = (tx.vin || []).map(i => i.prevout?.scriptpubkey_type).find(Boolean);
    if (!inType) return false;
    const [a, b] = tx.vout.map(o => o.scriptpubkey_type);
    if (!a || !b || a === b) return false;
    return a === inType || b === inType;
  }).length;
  if (changeIdCount >= 3)
    add("changeid","Change Detection","fail",`${changeIdCount} payments reveal which output is your change`,"In several of your payments, only one output matches your input's address type — analysts read that output as your change and keep following your coins.","high",-8);
  else if (changeIdCount >= 1)
    add("changeid","Change Detection","warn",`${changeIdCount} payment${changeIdCount > 1 ? "s" : ""} reveal${changeIdCount > 1 ? "" : "s"} which output is the change`,"A payment's two outputs used different address types, and only one matched your input — that one is identifiable as your change.","medium",-4);
  else
    add("changeid","Change Detection","pass","Change not identifiable by script type","Your payments don't give away which output is the change via mismatched address types.","clean",0);

  score = Math.max(0, Math.min(100, Math.round(score)));

  const recs = [];
  const failed = checks.filter(c => c.status !== "pass");
  if (failed.find(f => f.key === "cj"))
    recs.push({ icon:"🔀", action:"Mix your coins with CoinJoin", plain:"CoinJoin pools your Bitcoin with others in a single transaction, making it impossible to trace which output is yours.", detail:"The mixing landscape changed in 2024 — Samourai's Whirlpool was seized and Wasabi's original coordinator shut down. CoinJoin still works: you now connect to a community-run coordinator (built into Wasabi 2.x and its forks) or use Joinmarket's coordinator-free peer-to-peer model. Aim for large anonymity sets and time it during low-fee periods. (Note: centralized WabiSabi coordinators carry some deanonymization risk — Joinmarket avoids a coordinator entirely.)", impact:18, effort:"Medium", tools:[
      { name:"Wasabi Wallet",  note:"WabiSabi CoinJoin — since its default coordinator closed in 2024, pick a community coordinator in-app (Change Coordinator)" },
      { name:"Ginger Wallet",  note:"Wasabi fork that runs its own active CoinJoin coordinator, desktop" },
      { name:"Joinmarket",     note:"Peer-to-peer, no central coordinator — the most censorship-resistant option" },
      { name:"JoinStr",        note:"Nostr-coordinated CoinJoin, experimental" },
      { name:"BTCPay Server",  note:"Self-hosted Payjoin for merchants — breaks the common-input heuristic" },
    ], key:"cj" });
  if (failed.find(f => f.key === "cj") || cons.length)
    recs.push({ icon:"🤝", action:"Use Payjoin when you pay or get paid", plain:"Payjoin is a payment where the receiver quietly adds one of their own coins to your transaction. Analysts assume every input to a transaction has one owner — Payjoin breaks that assumption on an ordinary-looking payment, no mixing round or anonymity set required.", detail:"Payjoin (BIP78, and the newer async Payjoin / BIP77) needs a receiver who supports it, so it works best when transacting with Payjoin-enabled wallets and merchants. Adoption is climbing fast: Cake Wallet and Bull Bitcoin ship it, and the Payjoin Foundation (2025) is pushing it toward the default payment experience. It's coordinator-free and cheap — a great complement to CoinJoin.", impact:9, effort:"Easy", tools:[
      { name:"Cake Wallet",    note:"Mobile, ships Payjoin v2 (async) in the default send flow" },
      { name:"Bull Bitcoin",   note:"Non-custodial, Payjoin-enabled buy/sell and payments" },
      { name:"BTCPay Server",  note:"Receive Payjoin payments as a merchant, self-hosted" },
      { name:"Payjoin Dev Kit",note:"Open-source Rust library (BIP78 + BIP77) for wallet builders" },
    ], key:"payjoin" });
  if (failed.find(f => f.key === "reuse"))
    recs.push({ icon:"🔄", action:"Use a new address every time", plain:"Your wallet can generate unlimited fresh addresses. Every reuse permanently links your transactions for any analyst to trace.", detail:"Every HD wallet generates a new address on each 'Receive' — the trick is discipline: never re-paste an old one. If you need a fixed address to publish (a donation link, an invoice), use a Silent Payment (BIP352): you share ONE reusable string ('sp1…') and the sender's wallet derives a fresh, unlinkable on-chain address for every payment — so a public address never causes reuse. Sparrow, Cake Wallet, Nunchuk and BlueWallet support receiving them today.", impact:15, effort:"Easy", tools:[
      { name:"Sparrow Wallet",  note:"Coin control + labelling, and Silent Payments send/receive, desktop" },
      { name:"Cake Wallet",     note:"Silent Payments send + receive with on-device scanning, mobile" },
      { name:"Nunchuk",         note:"Silent Payments receiving + multisig, mobile + desktop" },
      { name:"Blue Wallet",     note:"Silent Payments receiving, open source, mobile" },
      { name:"Electrum",        note:"Lightweight, long-standing open source, desktop" },
      { name:"Bitcoin Core",    note:"Full node wallet, maximum sovereignty" },
    ], key:"reuse" });
  recs.push({ icon:"⚡", action:"Move spending money to Lightning", plain:"Lightning payments don't appear on-chain at all — zero on-chain footprint for every day-to-day purchase.", detail:"Open a channel from a clean UTXO, then use Lightning for all spending. Options range from fully self-custodial to simple custodial — choose based on how much sovereignty you want.", impact:12, effort:"Medium", tools:[
    { name:"Phoenix Wallet", note:"Self-custodial, mobile, simple UX, automatic channels" },
    { name:"Breez",          note:"Self-custodial, mobile, point-of-sale + podcasting" },
    { name:"Zeus",           note:"Connect to your own LND/CLN node, advanced" },
    { name:"Mutiny Wallet",  note:"Self-custodial, web + mobile, open source" },
    { name:"Blixt Wallet",   note:"Self-custodial, full LND node on mobile" },
    { name:"Alby",           note:"Browser extension, great for web payments" },
  ], key:"lightning" });
  if (failed.find(f => f.key === "cons"))
    recs.push({ icon:"⚗️", action:"Never merge coins from different sources", plain:"Combining exchange Bitcoin with privately-bought Bitcoin links them permanently on-chain — this cannot be undone.", detail:"Use coin control to manually select which UTXOs to spend. Ideally keep KYC and non-KYC coins in entirely separate wallets with no on-chain connection.", impact:10, effort:"Medium", tools:[
      { name:"Sparrow Wallet",  note:"Best-in-class coin control UI, UTXO labelling" },
      { name:"Wasabi Wallet",   note:"Built-in coin labelling and control" },
      { name:"Electrum",        note:"Coin control via Coins tab" },
      { name:"Bitcoin Core",    note:"listunspent + coin control in advanced mode" },
      { name:"Nunchuk",         note:"UTXO management with tags and notes" },
    ], key:"cons" });
  if (failed.find(f => f.key === "dust"))
    recs.push({ icon:"🧊", action:"Freeze your dust UTXOs immediately", plain:"Those tiny amounts are tracking beacons planted by surveillance firms. Spending them links your entire wallet cluster.", detail:"Mark each dust UTXO as frozen/do-not-spend. It will be excluded from all future transactions. Never consolidate dust even during low-fee periods.", impact:9, effort:"Easy", tools:[
      { name:"Sparrow Wallet",  note:"Right-click UTXO → Freeze" },
      { name:"Wasabi Wallet",   note:"Label as suspicious, excluded from CoinJoins" },
      { name:"Electrum",        note:"Right-click → Freeze coin" },
      { name:"Bitcoin Core",    note:"lockunspent to freeze specific UTXOs" },
      { name:"Nunchuk",         note:"Tag UTXOs, exclude from spending" },
    ], key:"dust" });
  if (failed.find(f => f.key === "round"))
    recs.push({ icon:"🎲", action:"Withdraw odd amounts from exchanges", plain:"Instead of 0.1 BTC, withdraw 0.10743 BTC. Round numbers are a primary KYC withdrawal fingerprint used by Chainalysis.", detail:"Change the last 3–4 digits of every withdrawal. Even better: source Bitcoin from non-KYC options so there's no KYC origin to fingerprint in the first place.", impact:8, effort:"Easy", tools:[
      { name:"Any KYC exchange", note:"Just change the withdrawal amount manually" },
      { name:"Bisq",             note:"Decentralised, peer-to-peer, no KYC" },
      { name:"Robosats",         note:"Lightning-based, Tor-native, no KYC" },
      { name:"Peach Bitcoin",    note:"Mobile peer-to-peer, no KYC" },
      { name:"HodlHodl",         note:"Non-custodial P2P, no KYC" },
      { name:"AgoraDesk",        note:"P2P, supports cash and many payment methods" },
    ], key:"round" });
  if (failed.find(f => f.key === "change"))
    recs.push({ icon:"↩", action:"Never reuse change addresses", plain:"Sending change back to an input address exposes your full balance to anyone reading the transaction.", detail:"Ensure your wallet sends change to a fresh address every time. This is the default in all modern HD wallets — check settings if you're unsure.", impact:7, effort:"Easy", tools:[
      { name:"Sparrow Wallet",    note:"Settings → Script type → Native SegWit (BIP84)" },
      { name:"Wasabi Wallet",     note:"Fresh change addresses automatic by default" },
      { name:"Electrum",          note:"Wallet → Preferences → Use change addresses" },
      { name:"Bitcoin Core",      note:"Default HD wallet behaviour, always fresh change" },
      { name:"Blue Wallet",       note:"HD wallet, fresh change addresses by default" },
      { name:"Nunchuk",           note:"BIP84 by default, visible in transaction detail" },
    ], key:"change" });
  recs.push({ icon:"🖥️", action:"Connect to your own Bitcoin node", plain:"Public Electrum servers see every address you query and can link your IP to your wallet. Your own node leaks nothing.", detail:"Run a full node and point your wallet at it via local network or Tor. Options range from plug-and-play hardware appliances to software on any machine.", impact:6, effort:"Hard", tools:[
    { name:"Bitcoin Core",  note:"Original full node, free, runs on any OS" },
    { name:"Umbrel",        note:"Plug-and-play on Raspberry Pi, app store" },
    { name:"Start9",        note:"Sovereignty-focused OS, strong privacy defaults" },
    { name:"RaspiBlitz",    note:"Open source, Lightning + Bitcoin, DIY" },
    { name:"MyNode",        note:"Beginner-friendly, community edition is free" },
    { name:"Nodl",          note:"Pre-built hardware node, plug and play" },
  ], key:"node" });
  if (failed.find(f => f.key === "fee"))
    recs.push({ icon:"💸", action:"Vary your fee rates", plain:"Using the same fee rate every time fingerprints your wallet software — analysts can identify which wallet you use.", detail:"Check the current mempool before each transaction and manually set a fee rather than using your wallet's default. Vary the rate each time.", impact:6, effort:"Easy", tools:[
      { name:"Sparrow Wallet",    note:"Full manual fee control per transaction" },
      { name:"mempool.space",     note:"Live fee estimates, open source, Tor-accessible" },
      { name:"Bitcoin Core",      note:"estimatesmartfee RPC for precise control" },
      { name:"Electrum",          note:"Manual fee slider on every send" },
      { name:"bitcoinfees.earn",  note:"Simple fee rate overview by confirmation target" },
    ], key:"fee" });
  if (failed.find(f => f.key === "conc"))
    recs.push({ icon:"⚖️", action:"Distribute your balance across UTXOs", plain:"Nearly all your Bitcoin is in one output — every transaction reveals almost your full holdings to the recipient.", detail:"A CoinJoin round naturally produces multiple balanced outputs. Or split manually by sending to yourself across several transactions during low-fee periods.", impact:5, effort:"Medium", tools:[
      { name:"Sparrow Wallet",  note:"Manual UTXO splitting with coin control" },
      { name:"Wasabi Wallet",   note:"CoinJoin produces a well-distributed output set" },
      { name:"Joinmarket",      note:"Yields naturally distributed UTXO set" },
      { name:"Electrum",        note:"Send-to-self with manual output splitting" },
      { name:"Bitcoin Core",    note:"createrawtransaction for precise output control" },
    ], key:"conc" });
  if (failed.find(f => f.key === "changeid"))
    recs.push({ icon:"⇄", action:"Match your change to the payment type", plain:"When you pay a different address type than your own, your change output sticks out — analysts can tell which coins are still yours and keep following them.", detail:"Use a wallet that matches the change output's address type to the payment's (Bitcoin Core does this automatically; Sparrow lets you choose the change type per transaction). Keeping your whole wallet on one script type and preferring recipients of the same type also blurs the tell.", impact:8, effort:"Easy", tools:[
      { name:"Bitcoin Core",    note:"Matches change type to the destination automatically" },
      { name:"Sparrow Wallet",  note:"Choose the change address type per transaction" },
      { name:"Wasabi Wallet",   note:"Single script type wallet-wide — no mismatch to read" },
    ], key:"changeid" });
  // Sort by impact descending
  recs.sort((a, b) => b.impact - a.impact);

  return {
    score,
    grade: scoreGrade(score),
    riskLabel: scoreLabel(score),
    riskColor: scoreColor(score),
    checks,
    recommendations: recs.slice(0, 6),
  };
}

/* ─────────────────────────────────────────────
   API + DEMO DATA
───────────────────────────────────────────── */
async function fetchAddress(addr) {
  // Uses the user-selected explorer (blockstream / mempool — same esplora API),
  // directly or via the relay's mirror path for it. If the relay is on but
  // unreachable, the fetch below rejects and analyze() fails honestly — we
  // never silently fall back to a direct query, which would leak the very IP
  // the user has the relay on to hide.
  const exp = explorer();
  const base = relayOn() ? `${RELAY_URL}${exp.relayPath}` : exp.api;
  const safe = encodeURIComponent(addr);
  const [info, utxos, txs] = await Promise.all([
    fetch(`${base}/address/${safe}`).then(r => { if (!r.ok) throw new Error("Not found"); return r.json(); }),
    fetch(`${base}/address/${safe}/utxo`).then(r => r.json()),
    fetch(`${base}/address/${safe}/txs`).then(r => r.json()),
  ]);
  if (!info || typeof info !== "object") throw new Error("Invalid API response");
  if (!Array.isArray(utxos)) throw new Error("Invalid UTXO response");
  if (!Array.isArray(txs)) throw new Error("Invalid TX response");
  return { addrInfo: info, utxos: utxos.slice(0, 30), txs: txs.slice(0, 30) };
}

const now = () => Math.floor(Date.now() / 1000);
// Timestamp `days` ago at a fixed UTC clock-hour (for demo data whose
// time-of-day pattern must be deterministic, not tied to the visit time).
const atUtcHour = (days, hour) => Math.floor(now() / 86400) * 86400 - 86400 * days + 3600 * hour;
// Pristine demo — designed to score A. CoinJoin-mixed, no dust, no round
// amounts, single script type, balanced UTXO set, low tx count, no
// consolidation. This is what the audit is trying to teach users to look like.
const DEMO_A = {
  addrInfo: { chain_stats: { tx_count: 3 } },
  utxos: [
    { txid:"7a82bc91e3411d05",vout:1,value:17431892,scriptpubkey_type:"v0_p2wpkh",status:{confirmed:true,block_time:now()-86400*30}},
    { txid:"2e91a4bc77f01122",vout:2,value:11254731,scriptpubkey_type:"v0_p2wpkh",status:{confirmed:true,block_time:now()-86400*60}},
    { txid:"d4f1b206c8a99933",vout:0,value:8721400, scriptpubkey_type:"v0_p2wpkh",status:{confirmed:true,block_time:now()-86400*90}},
    { txid:"a51cc1f4d0118855",vout:3,value:15182374,scriptpubkey_type:"v0_p2wpkh",status:{confirmed:true,block_time:now()-86400*45}},
    { txid:"38ee9c7be5f02266",vout:1,value:9847251, scriptpubkey_type:"v0_p2wpkh",status:{confirmed:true,block_time:now()-86400*15}},
  ],
  txs: [
    // CoinJoin #1 — 5 inputs (participants), 8 outputs, 5 share the 5,000,000-sat denomination
    { txid:"7a82bc91",vin:[{txid:"src1a",vout:0},{txid:"src1b",vout:1},{txid:"src1c",vout:0},{txid:"src1d",vout:3},{txid:"src1e",vout:1}],vout:[
      {value:5000000,scriptpubkey_address:"bc1qcj1"},
      {value:5000000,scriptpubkey_address:"bc1qcj2"},
      {value:5000000,scriptpubkey_address:"bc1qcj3"},
      {value:5000000,scriptpubkey_address:"bc1qcj4"},
      {value:5000000,scriptpubkey_address:"bc1qcj5"},
      {value:17431892,scriptpubkey_address:"bc1qme1"},
      {value:3214557,scriptpubkey_address:"bc1qch1"},
      {value:1024113,scriptpubkey_address:"bc1qch2"},
    ],fee:8923,size:545,status:{block_time:now()-86400*30}},
    // CoinJoin #2 — 4 inputs (participants), 6 outputs, 4 share the 1,000,000-sat denomination
    { txid:"2e91a4bc",vin:[{txid:"src2a",vout:0},{txid:"src2b",vout:1},{txid:"src2c",vout:0},{txid:"src2d",vout:2}],vout:[
      {value:1000000,scriptpubkey_address:"bc1qcj6"},
      {value:1000000,scriptpubkey_address:"bc1qcj7"},
      {value:1000000,scriptpubkey_address:"bc1qcj8"},
      {value:1000000,scriptpubkey_address:"bc1qcj9"},
      {value:11254731,scriptpubkey_address:"bc1qme2"},
      {value:887621, scriptpubkey_address:"bc1qch3"},
    ],fee:7824,size:482,status:{block_time:now()-86400*60}},
    // Normal Lightning-funded send (varied fees, no consolidation)
    { txid:"d4f1b206",vin:[{txid:"src3",vout:0}],vout:[
      {value:8721400,scriptpubkey_address:"bc1qme3"},
      {value:2189412,scriptpubkey_address:"bc1qrx1"},
    ],fee:1437,size:223,status:{block_time:now()-86400*90}},
  ],
};

const DEMO = {
  addrInfo: { chain_stats: { tx_count: 7 } },
  utxos: [
    { txid:"a3f21e9b4c7d2f01",vout:0,value:120000000,scriptpubkey_type:"v0_p2wpkh",status:{confirmed:true,block_time:now()-86400*14}},
    { txid:"7b91cc3adf982b44",vout:1,value:84700000,scriptpubkey_type:"v0_p2wpkh", status:{confirmed:true,block_time:now()-86400*60}},
    { txid:"f004d188a2ccef91",vout:0,value:50000000,scriptpubkey_type:"p2pkh",     status:{confirmed:true,block_time:now()-86400*180}},
    { txid:"2d5e4f7c01ba3390",vout:0,value:20000000,scriptpubkey_type:"v0_p2wpkh", status:{confirmed:true,block_time:now()-86400*365}},
    { txid:"9c11a2b0e3ff4d22",vout:2,value:10000000,scriptpubkey_type:"v0_p2wpkh", status:{confirmed:true,block_time:now()-86400*3}},
    { txid:"44cc3b77f19a0011",vout:0,value:546,      scriptpubkey_type:"v0_p2wpkh", status:{confirmed:true,block_time:now()-86400*2}},
  ],
  // Demo tx timestamps are anchored to fixed UTC clock-hours (evening-heavy,
  // quiet 04:00–13:00 UTC) so the Activity Clock tells the same deterministic
  // story for every visitor — a realistic "analysts can read your timezone"
  // pattern, not an artifact of when the page was opened.
  txs: [
    { txid:"a3f21e9b",vin:[{txid:"p1",vout:0}],vout:[{value:120000000,scriptpubkey_address:"bc1qex1"},{value:9871234,scriptpubkey_address:"bc1qex2"}],fee:1420,size:224,status:{block_time:atUtcHour(14,20)}},
    // Input prevout addresses (address only — no type, so scoring is untouched)
    // let the demo showcase the Cluster Exposure panel: this consolidation
    // provably links three sibling addresses to the scanned one.
    { txid:"7b91cc3a",vin:[{txid:"p2",vout:0,prevout:{scriptpubkey_address:"DEMO"}},{txid:"p3",vout:1,prevout:{scriptpubkey_address:"bc1q8f4tr0lk29mzy3w"}},{txid:"p4",vout:0,prevout:{scriptpubkey_address:"bc1qv5dm82apx7hcen4"}},{txid:"p5",vout:2,prevout:{scriptpubkey_address:"bc1qt6ky4w0jr3nqd8s"}}],vout:[{value:84700000,scriptpubkey_address:"bc1qex3"}],fee:3200,size:450,status:{block_time:atUtcHour(60,16)}},
    { txid:"f004d188",vin:[{txid:"p6",vout:0}],vout:[{value:50000000},{value:50000000},{value:50000000},{value:50000000},{value:19874123}],fee:980,size:340,status:{block_time:atUtcHour(180,23)}},
    { txid:"2d5e4f7c",vin:[{txid:"p7",vout:0}],vout:[{value:20000000},{value:8312200}],fee:780,size:224,status:{block_time:atUtcHour(365,14)}},
    { txid:"9c11a2b0",vin:[{txid:"p8",vout:0,prevout:{scriptpubkey_type:"v0_p2wpkh"}}],vout:[{value:10000000,scriptpubkey_type:"p2pkh"},{value:3421000,scriptpubkey_type:"v0_p2wpkh"}],fee:650,size:224,status:{block_time:atUtcHour(3,1)}},
    { txid:"44cc3b77",vin:[{txid:"p9",vout:0}],vout:[{value:546},{value:99999454}],fee:320,size:150,status:{block_time:atUtcHour(2,3)}},
    { txid:"bb44e901",vin:[{txid:"p10",vout:0}],vout:[{value:100000000}],fee:1100,size:200,status:{block_time:atUtcHour(200,18)}},
  ],
};

/* ─────────────────────────────────────────────
   LIGHTNING FETCH + ENGINE
───────────────────────────────────────────── */
const LN_API = "https://mempool.space/api/v1/lightning";

async function fetchLightningNode(pubkey) {
  // Relay path is /ln/nodes/…; direct is mempool's /nodes/…. Same honest-failure
  // rule as fetchAddress: no silent direct fallback when the relay is on.
  const base = relayOn() ? `${RELAY_URL}/ln` : LN_API;
  const safe = encodeURIComponent(pubkey);
  const [node, channels] = await Promise.all([
    fetch(`${base}/nodes/${safe}`).then(r => { if (!r.ok) throw new Error("Node not found"); return r.json(); }),
    fetch(`${base}/nodes/${safe}/channels?status=open`).then(r => r.json()).catch(() => ({ channels: [] })),
  ]);
  if (!node || typeof node !== "object") throw new Error("Invalid node response");
  return { node, channels: (Array.isArray(channels.channels) ? channels.channels : []).slice(0, 30) };
}

// Known KYC/custodial exchange node pubkeys — verified against 1ML/Amboss
const KYC_NODES = new Set([
  "033d8656219478701227199cbd6f670335c8d408a92ae88b176cad16f71555e072", // Bitfinex
  "02f1a8c87607f415c8f22c00593002775941dea48869ce23096af27b0cfdcc0b69", // Kraken
  "03037dc08e9ac63b82581f79b662a4d0ceca8a8ca162b1af3551595b8f2d97b70a", // River Financial
  "035e4ff418fc8b5554c5d9eea66396c227bd429a3251c8cbc711002ba215bfc226", // Wallet of Satoshi (custodial)
  "0279c22ed7a068d10dc1a38ae66d2d6461e269226c60258c021b1ddcdfe4b00bc4", // OKX
  "03cde60a6323f7122d5178255766e38114b4722ede08f7c9e0c5df9b912cc201d6", // Binance
]);
const isKycNode = pub => KYC_NODES.has(pub);

function runLightningEngine(node = {}, channels = []) {
  let score = 100;
  const checks = [];
  const add = (key, name, status, detail, sev, pts) => {
    checks.push({ key, name, status, detail, sev: sev || "medium", pts: pts || 0 });
    score += pts;
  };

  // 1. Public node announcement
  const isPublic = node.public !== false;
  if (isPublic)
    add("announced", "Public Node Announcement", "fail",
      "Your node is publicly announced on the Lightning gossip network. Your IP or Tor address is visible to every peer.", "high", -18);
  else
    add("announced", "Public Node Announcement", "pass",
      "Your node is not publicly announced — it operates privately.", "clean", 0);

  // 2. KYC exchange peers
  const kycPeers = channels.filter(ch =>
    isKycNode(ch.node1_pub) || isKycNode(ch.node2_pub)
  );
  if (kycPeers.length >= 2)
    add("kyc_peers", "KYC Exchange Peer Channels", "fail",
      `${kycPeers.length} channels connect to known KYC exchanges. These entities log routing metadata and can correlate your activity.`, "critical", -22);
  else if (kycPeers.length === 1)
    add("kyc_peers", "KYC Exchange Peer Channels", "warn",
      "1 channel connects to a known KYC exchange. Their logs can correlate payment routing through your node.", "high", -10);
  else
    add("kyc_peers", "KYC Exchange Peer Channels", "pass",
      "No channels detected to known KYC surveillance entities.", "clean", 0);

  // 3. Tor usage
  const hasTorAddr = node.addresses?.some(a => a.addr?.includes(".onion"));
  const hasClearnet = node.addresses?.some(a => !a.addr?.includes(".onion") && a.addr);
  if (hasClearnet && !hasTorAddr)
    add("tor", "Tor / Clearnet Exposure", "fail",
      "Your node only accepts clearnet connections. Your IP address is directly visible to all peers.", "high", -15);
  else if (hasClearnet && hasTorAddr)
    add("tor", "Tor / Clearnet Exposure", "warn",
      "Your node accepts both Tor and clearnet. Clearnet peers can correlate your IP with your node pubkey.", "medium", -7);
  else
    add("tor", "Tor / Clearnet Exposure", "pass",
      "Your node is Tor-only — no IP exposure to peers.", "clean", 0);

  // 4. Channel count (too few = low routing privacy)
  const chCount = channels.length;
  if (chCount === 0)
    add("channels", "Channel Diversity", "warn",
      "No open channels found. A node with no channels has limited routing privacy and cannot receive spontaneous payments.", "medium", -6);
  else if (chCount < 3)
    add("channels", "Channel Diversity", "warn",
      `Only ${chCount} publicly-announced channel${chCount > 1 ? "s" : ""} — low public routing diversity. (Private, unannounced channels don't show up here; keeping channels unannounced is more private, not less.)`, "medium", -4);
  else
    add("channels", "Channel Diversity", "pass",
      `${chCount} publicly-announced channels — good routing diversity makes payment flows harder to trace.`, "clean", 0);

  // 5. Large single channel dominance
  const totalCap = channels.reduce((s, c) => s + (c.capacity || 0), 0);
  const maxCap = channels.length ? Math.max(...channels.map(c => c.capacity || 0)) : 0;
  if (totalCap > 0 && maxCap / totalCap > 0.8)
    add("cap_conc", "Channel Capacity Concentration", "warn",
      "Over 80% of your publicly-visible capacity is in one channel. This makes your routing patterns highly predictable.", "medium", -6);
  else
    add("cap_conc", "Channel Capacity Concentration", "pass",
      "Your capacity is distributed across channels — good for routing privacy.", "clean", 0);

  // 6. Node alias (using real identity)
  // Sanitise alias: strip control chars, newlines, limit to 50 chars
  const rawAlias = node.alias || "";
  const alias = rawAlias.replace(/[\x00-\x1f\x7f]/g, "").trim().slice(0, 50);
  const suspiciousAlias = alias.length > 0 && /^[A-Z][a-z]/.test(alias) && alias.includes(" ");
  if (suspiciousAlias)
    add("alias", "Node Alias Privacy", "warn",
      `Your alias "${alias}" looks like a real name. Node aliases are publicly visible to the entire Lightning network.`, "low", -4);
  else if (alias.length === 0)
    add("alias", "Node Alias Privacy", "pass",
      "No alias set — your node is identified only by its pubkey.", "clean", 0);
  else
    add("alias", "Node Alias Privacy", "pass",
      `Alias "${alias}" appears pseudonymous.`, "clean", 0);

  // 7. Node age (new nodes get less scrutiny pattern)
  const firstSeen = node.first_seen || 0;
  const ageDays = firstSeen ? Math.floor((Date.now() / 1000 - firstSeen) / 86400) : 0;
  if (ageDays > 0 && ageDays < 30)
    add("age", "Node Establishment", "warn",
      "Your node is less than 30 days old. New nodes are more easily tracked as their channel history is limited.", "low", -3);
  else
    add("age", "Node Establishment", "pass",
      ageDays > 0 ? `Node active for ${Math.floor(ageDays / 30)} months — established routing history.` : "Node age unknown.", "clean", 0);

  // 8. On-chain channel footprint — real check: channels opened = on-chain traces
  const openedChannels = channels.length;
  if (openedChannels > 10)
    add("onchain", "On-Chain Channel Footprint", "warn",
      `${openedChannels} publicly-visible channel opens/closes are recorded on-chain. Each one is a permanent trace linking your Lightning and on-chain identity — and private channels add to this on-chain too, they just aren't listed in gossip. Funding channels directly from KYC exchange withdrawals is the riskiest pattern.`,
      "medium", -5);
  else if (openedChannels > 0)
    add("onchain", "On-Chain Channel Footprint", "pass",
      `${openedChannels} publicly-visible channel${openedChannels > 1 ? "s" : ""} — modest public footprint (private channels have on-chain opens too, not shown here). Ensure you fund channels from non-KYC UTXOs to avoid linking your identities.`,
      "clean", 0);
  else
    add("onchain", "On-Chain Channel Footprint", "pass",
      "No open channels found — no on-chain channel footprint to analyse.",
      "clean", 0);

  score = Math.max(0, Math.min(100, Math.round(score)));

  const recs = [];
  const failed = checks.filter(c => c.status !== "pass");
  if (failed.find(f => f.key === "kyc_peers"))
    recs.push({ key: "kyc_peers", icon: "⚡", action: "Close channels with KYC exchange nodes", impact: 22, effort: "Medium",
      detail: "Open replacement channels with privacy-focused or anonymous peers. Look for Tor-only nodes with no identifiable alias.",
      tools: [{ name: "Amboss.space", note: "Find privacy-respecting nodes to peer with" }, { name: "LNRouter", note: "Routing analysis, find good private peers" }] });
  if (failed.find(f => f.key === "announced"))
    recs.push({ key: "announced", icon: "📡", action: "Switch to an unannounced / private node", impact: 18, effort: "Hard",
      detail: "An unannounced node is invisible to the gossip network. You can still open and use channels — they just won't be publicly listed.",
      tools: [{ name: "CLN (Core Lightning)", note: "Supports unannounced channels natively" }, { name: "LND", note: "Use --unexported-channel flag" }] });
  if (failed.find(f => f.key === "tor"))
    recs.push({ key: "tor", icon: "🧅", action: "Enable Tor-only mode", impact: 15, effort: "Medium",
      detail: "Disable clearnet listening entirely. Your IP will no longer be exposed to peers.",
      tools: [{ name: "Umbrel", note: "Settings → Tor → Force Tor" }, { name: "Start9", note: "System → Tor → Enforce Tor" }, { name: "RaspiBlitz", note: "Main menu → CONNECT → TOR" }] });
  if (failed.find(f => f.key === "onchain"))
    recs.push({ key: "onchain", icon: "🔗", action: "Fund channels from non-KYC UTXOs only", impact: 8, effort: "Medium",
      detail: "Use a separate wallet with no KYC history to open channels. Never open a channel directly from an exchange withdrawal.",
      tools: [{ name: "Bisq", note: "Non-KYC bitcoin source" }, { name: "Sparrow Wallet", note: "Coin control before channel open" }] });

  const grade = score >= 90 ? "A+" : score >= 80 ? "A" : score >= 70 ? "B" : score >= 55 ? "C" : score >= 40 ? "D" : "F";
  return { score, grade, checks, recommendations: recs };
}

const DEMO_LN = {
  node: {
    public: true,
    alias: "SatoshiNode 01",
    addresses: [{ addr: "192.168.1.1:9735" }, { addr: "abcdef123456.onion:9735" }],
    first_seen: Math.floor(Date.now() / 1000) - 86400 * 120,
    capacity: 214000000,
    channel_count: 12,
  },
  channels: [
    { node1_pub: "033d8656219478701227199cbd6f670335c8d408a92ae88b176cad16f71555e072", node2_pub: "mynode", capacity: 42000000 }, // Bitfinex
    { node1_pub: "033d8656219478701227199cbd6f670335c8d408a92ae88b176cad16f71555e072", node2_pub: "mynode", capacity: 18000000 }, // Bitfinex
    { node1_pub: "mynode", node2_pub: "02f1a8c87607f415c8f22c00593002775941dea48869ce23096af27b0cfdcc0b69", capacity: 25000000 }, // Kraken
    { node1_pub: "mynode", node2_pub: "anon1aabbccddeeff0011223344556677889900aabbccddeeff00112233445566", capacity: 22000000 },
    { node1_pub: "mynode", node2_pub: "anon2aabbccddeeff0011223344556677889900aabbccddeeff00112233445566", capacity: 31000000 },
    { node1_pub: "mynode", node2_pub: "anon3aabbccddeeff0011223344556677889900aabbccddeeff00112233445566", capacity: 28000000 },
    { node1_pub: "mynode", node2_pub: "anon4aabbccddeeff0011223344556677889900aabbccddeeff00112233445566", capacity: 18000000 },
    { node1_pub: "mynode", node2_pub: "anon5aabbccddeeff0011223344556677889900aabbccddeeff00112233445566", capacity: 10000000 },
    { node1_pub: "mynode", node2_pub: "anon6aabbccddeeff0011223344556677889900aabbccddeeff00112233445566", capacity: 8000000 },
    { node1_pub: "mynode", node2_pub: "anon7aabbccddeeff0011223344556677889900aabbccddeeff00112233445566", capacity: 7000000 },
    { node1_pub: "mynode", node2_pub: "anon8aabbccddeeff0011223344556677889900aabbccddeeff00112233445566", capacity: 3000000 },
    { node1_pub: "mynode", node2_pub: "anon9aabbccddeeff0011223344556677889900aabbccddeeff00112233445566", capacity: 2000000 },
  ],
};


const fmt = {
  btc:  v => v >= 1e8 ? `₿${(v / 1e8).toFixed(4)}` : `${v.toLocaleString()} sats`,
  age:  ts => { const d = Math.floor((Date.now()/1000 - ts) / 86400); return d < 1 ? "Today" : d === 1 ? "Yesterday" : d < 30 ? `${d}d ago` : d < 365 ? `${Math.floor(d/30)}mo ago` : `${Math.floor(d/365)}yr ago`; },
  txid: id => id ? `${id.slice(0,8)}…${id.slice(-4)}` : "—",
  addr: a => a === "DEMO" ? "Demo Wallet" : a ? `${a.slice(0,10)}…${a.slice(-6)}` : "—",
};

/* ─────────────────────────────────────────────
   PLAIN-ENGLISH TRANSLATIONS
   Used when simpleMode is enabled on the dashboard
/* ─────────────────────────────────────────────
   PLAIN-ENGLISH TRANSLATIONS
   Used when simpleMode is enabled on the dashboard
───────────────────────────────────────────── */
const SIMPLE = {
  checks: {
    reuse: {
      name: "Same Address Used Multiple Times",
      fail_detail: "Every time you reuse an address, it's like telling the world 'these transactions are all mine.' Anyone can click your address on a public tracker and see everything.",
      warn_detail: "You've used this address more than once. Get a fresh address from your wallet next time you receive Bitcoin — it takes one tap.",
      pass_detail: "Great — this address was only used once, so your transactions aren't linked together.",
    },
    dust: {
      name: "Tiny Tracking Coins",
      fail_detail: "Companies that track Bitcoin sent you microscopic amounts to tag your wallet. If you spend them, they can follow where your money goes. Freeze them — they're traps.",
      warn_detail: "A tiny amount was sent to your address. It might be a tracking beacon. Don't spend it — just ignore it.",
      pass_detail: "No tracking coins found. You're clean.",
    },
    round: {
      name: "Round Withdrawal Amounts",
      fail_detail: "You withdrew a nice round number like 0.1 BTC. Bitcoin trackers use this to identify withdrawals from exchanges. Next time, withdraw 0.10743 BTC instead of 0.1.",
      warn_detail: "One round amount spotted. Minor issue — just use odd amounts when withdrawing next time.",
      pass_detail: "Your amounts are non-round — harder to fingerprint.",
    },
    cj: {
      name: "Privacy Mixing",
      fail_detail: "Your full transaction history is visible to anyone. Privacy mixing blends your coins with others in a single transaction so no one can tell which coins are yours.",
      warn_detail: "You've mixed your coins once. More rounds make it much harder to trace.",
      pass_detail: "You've used privacy mixing — this breaks the trail of your transactions. Well done.",
    },
    cons: {
      name: "Combining Coins from Different Sources",
      fail_detail: "You combined coins that came from different places (like an exchange and a peer-to-peer trade). This links those two separate histories together — permanently, on-chain.",
      warn_detail: "One instance of combining different coins. Avoid mixing exchange coins with privately-bought coins.",
      pass_detail: "Your coins from different sources are kept separate.",
    },
    utxo_n: {
      name: "Number of Coin Pieces",
      fail_detail: "You have a lot of small coin pieces in your wallet. This creates pressure to combine them all together, which links your transaction history.",
      warn_detail: "Slightly high number of coin pieces. No urgent action needed.",
      pass_detail: "Your wallet has a healthy number of coin pieces.",
    },
    fee: {
      name: "Transaction Fee Pattern",
      warn_detail: "You always pay the same fee amount. Bitcoin trackers can use this to identify which wallet app you use. Just vary it a little each time.",
      pass_detail: "Your fees vary — no wallet fingerprint detected.",
    },
    change: {
      name: "Change Sent Back to Same Address",
      fail_detail: "When you sent Bitcoin, your leftover change went back to the same address. This tells anyone watching exactly how much Bitcoin you still have.",
      pass_detail: "Your change goes to fresh addresses each time. Good practice.",
    },
    conc: {
      name: "All Bitcoin in One Chunk",
      warn_detail: "Almost all your Bitcoin is in a single coin piece. Every time you send any amount, the person receiving it can see roughly how much total Bitcoin you own.",
      pass_detail: "Your balance is spread across multiple coin pieces.",
    },
    script: {
      name: "Mixed Address Formats",
      warn_detail: "You're using old and new Bitcoin address formats together. Trackers can use this pattern to link your transactions.",
      pass_detail: "You're using a consistent address format.",
    },
    changeid: {
      name: "Your Change Gives You Away",
      warn_detail: "When you sent Bitcoin, your 'change' came back in your usual address style while the payment went to a different style. Trackers can spot which coins are still yours that way.",
      pass_detail: "Your change doesn't stand out from your payments.",
    },
  },
  recs: {
    cj:      { action: "Mix your coins for privacy",          plain: "Privacy mixing pools your Bitcoin with other people in one transaction, so no one can tell whose coins are whose. It's the single most powerful thing you can do." },
    reuse:   { action: "Use a fresh address every time",      plain: "Your wallet can make unlimited new addresses for free. Tap 'Receive' and get a new one every time someone sends you Bitcoin. Never reuse an old one." },
    lightning:{ action: "Pay small amounts over Lightning",   plain: "Lightning lets you send Bitcoin instantly without any record on the public blockchain. Perfect for everyday spending — like cash, but digital." },
    cons:    { action: "Keep your coins separate",            plain: "Don't mix coins from your exchange with coins you bought privately. Use separate wallets, and never send between them directly." },
    payjoin: { action: "Pay with Payjoin when you can",       plain: "Some wallets and shops support 'Payjoin' — when you pay, they quietly add one of their own coins to the transaction. That hides which coins are really yours, with no special mixing step. Look for it in wallets like Cake Wallet." },
    changeid: { action: "Keep your change looking like your payments", plain: "Use a wallet that makes your leftover change match the style of the address you're paying (Bitcoin Core does this by itself). Then trackers can't tell which coins came back to you." },
    dust:    { action: "Freeze your tracking coins",          plain: "Find those tiny amounts in your wallet and mark them as 'frozen' or 'do not spend.' They're traps — spending them tags your entire wallet." },
    round:   { action: "Withdraw odd amounts from exchanges", plain: "Instead of withdrawing exactly 0.1 BTC, withdraw 0.10743. Round numbers are a dead giveaway that coins came from an exchange." },
    change:  { action: "Make sure change goes to new addresses", plain: "When you send Bitcoin, your leftover change should go to a brand new address — not back to one you've used before. Most modern wallets do this automatically." },
    node:    { action: "Connect to your own Bitcoin server",  plain: "When you look up your wallet, a public server sees your address and your IP address. Running your own server means only you see your own lookups." },
    fee:     { action: "Vary how much you pay in fees",       plain: "Paying the exact same fee every time lets trackers identify your wallet app. Just change it by a little each time you send." },
    conc:    { action: "Spread your Bitcoin across pieces",   plain: "Having all your Bitcoin in one chunk means every transaction reveals your total holdings. Split it into smaller pieces using privacy mixing or manual sends." },
  },
  grades: {
    A: "Very Private",
    B: "Mostly Private",
    C: "Moderate Risk",
    D: "High Risk",
    F: "Fully Traceable",
  },
};

function isValidBitcoinAddress(addr) {
  if (!addr || addr.length < 26 || addr.length > 90) return false;
  return /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,87}$/.test(addr);
}

function isValidLightningPubkey(str) {
  return /^[0-9a-fA-F]{66}$/.test(str.trim());
}

function isLightningAddress(str) {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(str.trim()) && !str.includes("bitcoin");
}

function detectInputType(val) {
  const v = (val || "").trim();
  if (!v) return null;
  if (isValidLightningPubkey(v)) return "ln_pubkey";
  if (isLightningAddress(v)) return "ln_address";
  if (isValidBitcoinAddress(v) || v === "DEMO" || v === "DEMO_A") return "btc";
  return null;
}

/* ─────────────────────────────────────────────
   MICRO COMPONENTS
───────────────────────────────────────────── */
const Tag = ({ label, color, size = 11 }) => (
  <span style={{ fontFamily: T.mono, fontSize: size, padding: "3px 8px", borderRadius: 4, background: color + "18", color, border: `1px solid ${color}30`, letterSpacing: 0.3, whiteSpace: "nowrap" }}>
    {String(label)}
  </span>
);

const Divider = ({ my = 0 }) => <div style={{ height: 1, background: T.border, margin: `${my}px 0` }} />;

const Pill = ({ children, active, onClick, color }) => (
  <button onClick={onClick} aria-pressed={!!active} style={{
    background: active ? (color || T.cyan) + "22" : "transparent",
    border: `1.5px solid ${active ? (color || T.cyan) : T.border}`,
    borderRadius: 99, padding: "7px 18px",
    color: active ? (color || T.cyan) : T.textMid,
    fontFamily: T.sans, fontSize: 13, fontWeight: active ? 600 : 400,
    cursor: "pointer", transition: "all .15s", whiteSpace: "nowrap",
  }}>
    {children}
  </button>
);

function Toast({ toasts }) {
  return (
    <div role="region" aria-label="Notifications" aria-live="polite" style={{ position: "fixed", bottom: 80, right: 20, zIndex: 9999, display: "flex", flexDirection: "column", gap: 8, pointerEvents: "none" }}>
      {toasts.map(t => (
        <div key={t.id} style={{ background: T.card, border: `1px solid ${t.color || T.border}`, borderLeft: `3px solid ${t.color || T.cyan}`, borderRadius: 10, padding: "12px 16px", display: "flex", gap: 10, alignItems: "center", boxShadow: "0 8px 32px #00000066", animation: t.out ? "toastOut .3s ease both" : "toastIn .3s ease both", minWidth: 220 }}>
          <span style={{ fontSize: 16 }}>{t.icon || "ℹ️"}</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{t.title}</div>
            {t.msg && <div style={{ fontSize: 11, color: T.textMid, marginTop: 2 }}>{t.msg}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}

function useToast() {
  const [toasts, setToasts] = useState([]);
  const show = useCallback((title, opts = {}) => {
    const id = Date.now();
    setToasts(p => [...p, { id, title, ...opts }]);
    setTimeout(() => setToasts(p => p.map(t => t.id === id ? { ...t, out: true } : t)), 2600);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3000);
  }, []);
  return { toasts, show };
}

/* ─────────────────────────────────────────────
   SCORE RING — arc gauge matching logo
   Partial arc (250° sweep), multicolor gradient
   red → orange → cyan → green + glowing dot
/* ─────────────────────────────────────────────
   SCORE RING
   Partial arc (250° sweep), multicolor gradient,
   red → orange → cyan → green + glowing dot
───────────────────────────────────────────── */


function ScoreRing({ score, size = 130, animate = true }) {
  const [cur, setCur] = useState(animate ? 0 : score);
  const rafRef = useRef(null);
  const uid = useRef(`sr${Math.random().toString(36).slice(2,7)}`).current;

  useEffect(() => {
    const reduced = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (!animate || reduced) { setCur(score); return; }
    setCur(0);
    const target = Math.max(0, Math.min(100, score|0));
    let start = 0;
    const ease = t => 1 - Math.pow(1 - t, 3);
    const step = (ts) => {
      if (!start) start = ts;
      const t = Math.min(1, (ts - start) / 1500);
      setCur(Math.round(ease(t) * target));
      if (t < 1) rafRef.current = requestAnimationFrame(step);
    };
    const startTimer = setTimeout(() => { rafRef.current = requestAnimationFrame(step); }, 250);
    return () => { clearTimeout(startTimer); if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [score, animate]);

  const cx = size / 2, cy = size / 2;
  const r = size * 0.37;
  const sw = size * 0.075; // stroke width

  // Arc geometry — 250° sweep, gap at bottom, matching logo
  const START_DEG = 145;   // bottom-left (8 o'clock in SVG coords)
  const SWEEP     = 250;   // degrees of total arc

  const toRad = d => (d * Math.PI) / 180;
  const pt    = d => ({ x: cx + r * Math.cos(toRad(d)), y: cy + r * Math.sin(toRad(d)) });
  const arcD  = (d1, d2) => {
    const p1 = pt(d1), p2 = pt(d2);
    const large = ((d2 - d1) % 360 + 360) % 360 > 180 ? 1 : 0;
    return `M ${p1.x.toFixed(2)} ${p1.y.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  };

  // Color stops matching logo palette
  const STOPS = [
    { t: 0,    rgb: [248, 81,  73 ] }, // red
    { t: 0.35, rgb: [247, 147, 26 ] }, // btc orange
    { t: 0.65, rgb: [34,  211, 238] }, // cyan
    { t: 1,    rgb: [63,  185, 80 ] }, // green
  ];
  const lerpColor = t => {
    for (let i = 0; i < STOPS.length - 1; i++) {
      if (t <= STOPS[i + 1].t) {
        const f = (t - STOPS[i].t) / (STOPS[i + 1].t - STOPS[i].t);
        return STOPS[i].rgb.map((a, j) => Math.round(a + (STOPS[i + 1].rgb[j] - a) * f));
      }
    }
    return STOPS[STOPS.length - 1].rgb;
  };
  const toHex = ([r, g, b]) => `#${[r, g, b].map(v => v.toString(16).padStart(2, "0")).join("")}`;

  const N      = 48;           // segments for smooth gradient
  const filled = cur / 100;
  const dotDeg = START_DEG + SWEEP * filled;
  const dotPt  = pt(dotDeg);
  const dotCol = toHex(lerpColor(filled));
  const textCol = scoreColor(score);

  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} overflow="visible">
        <defs>
          {/* Glow for the filled arc */}
          <filter id={`arcglow-${uid}`} x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation={sw * 0.6} result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          {/* Glow for the dot */}
          <filter id={`dotglow-${uid}`} x="-150%" y="-150%" width="400%" height="400%">
            <feGaussianBlur stdDeviation={sw * 0.9} result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* ── Track (full dim arc) ── */}
        <path d={arcD(START_DEG, START_DEG + SWEEP)}
          fill="none" stroke={T.surface} strokeWidth={sw + 1}
          strokeLinecap="round" />

        {/* ── Filled colored segments ── */}
        {cur > 0 && Array.from({ length: N }).map((_, i) => {
          const t1 = i / N;
          const t2 = (i + 1) / N;
          if (t1 >= filled) return null;
          const actualT2 = Math.min(t2, filled);
          const d1 = START_DEG + SWEEP * t1;
          const d2 = START_DEG + SWEEP * actualT2;
          if (d2 - d1 < 0.05) return null;
          const mid = (t1 + actualT2) / 2;
          return (
            <path key={i} d={arcD(d1, d2)}
              fill="none"
              stroke={toHex(lerpColor(mid))}
              strokeWidth={sw}
              strokeLinecap="butt"
              filter={`url(#arcglow-${uid})`}
            />
          );
        })}

        {/* ── Glowing dot at the score position ── */}
        {cur > 0 && (
          <>
            {/* outer glow halo */}
            <circle cx={dotPt.x} cy={dotPt.y} r={sw * 1.1}
              fill={dotCol} opacity="0.35"
              filter={`url(#dotglow-${uid})`} />
            {/* solid dot */}
            <circle cx={dotPt.x} cy={dotPt.y} r={sw * 0.58}
              fill={dotCol}
              filter={`url(#dotglow-${uid})`} />
            {/* bright white centre */}
            <circle cx={dotPt.x} cy={dotPt.y} r={sw * 0.25} fill="#ffffff" />
          </>
        )}
      </svg>

      {/* ── Centre text — score + /100 ── */}
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        paddingTop: size * 0.06, // nudge up slightly inside the open-bottom arc
      }}>
        <span style={{ fontFamily: T.serif, fontSize: size * .29, color: textCol, lineHeight: 1, fontWeight: 400 }}>{cur}</span>
        <span style={{ fontFamily: T.mono, fontSize: size * .075, color: T.textDim, letterSpacing: 1, marginTop: 2 }}>/100</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   DEMO PREVIEW — rotating F/C/A examples
───────────────────────────────────────────── */
function DemoPreview() {
  const [idx, setIdx] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setIdx(i => (i + 1) % DEMO_EXAMPLES.length);
      setAnimKey(k => k + 1);
    }, 5500);
    return () => clearInterval(intervalRef.current);
  }, []);

  const ex = DEMO_EXAMPLES[idx];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div key={animKey} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 20, padding: 28, boxShadow: "0 16px 64px #00000044", animation: "demoSlide .45s ease both" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 20 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: T.green, animation: "pulse 2s infinite" }} />
          <span style={{ fontFamily: T.mono, fontSize: 10, color: T.textDim, letterSpacing: 1.5 }}>LIVE EXAMPLE · ROTATING</span>
        </div>
        <div style={{ display: "flex", gap: 20, alignItems: "center", marginBottom: 22 }}>
          <ScoreRing score={ex.score} size={100} animate={false} />
          <div>
            <div style={{ fontFamily: T.serif, fontSize: 38, color: ex.color, lineHeight: 1, fontWeight: 400 }}>Grade {ex.grade}</div>
            <div style={{ fontSize: 13, color: T.textMid, marginTop: 5 }}>{ex.label}</div>
            <div style={{ fontFamily: T.mono, fontSize: 10, color: T.textDim, marginTop: 6 }}>{ex.score}/100 privacy score</div>
          </div>
        </div>
        <div style={{ fontSize: 11, color: T.textDim, marginBottom: 10, fontFamily: T.mono, letterSpacing: 1 }}>FINDINGS</div>
        {ex.issues.map((issue, i) => {
          const isGood = issue.includes("✓");
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderTop: `1px solid ${T.borderLo}` }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: isGood ? T.green : (i < 2 ? T.red : T.amber), flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: isGood ? T.textMid : T.text }}>{issue}</span>
            </div>
          );
        })}
      </div>
      {/* Dot indicators */}
      <div style={{ display: "flex", justifyContent: "center", gap: 8 }} role="tablist" aria-label="Example wallets">
        {DEMO_EXAMPLES.map((ex, i) => (
          <button key={i} onClick={() => { setIdx(i); setAnimKey(k => k + 1); }}
            role="tab" aria-selected={i === idx} aria-label={`Show example ${i + 1} of ${DEMO_EXAMPLES.length}${ex.label ? ": " + ex.label : ""}`}
            style={{ width: i === idx ? 20 : 8, height: 8, borderRadius: 4, background: i === idx ? ex.color : T.textDim, border: "none", cursor: "pointer", transition: "all .3s", padding: 0 }} />
        ))}
      </div>
      {/* Source callout */}
      <div style={{ background: T.btcLo, border: `1px solid ${T.btcMid}`, borderRadius: 12, padding: "14px 18px" }}>
        <div style={{ fontSize: 12, color: T.btc, fontWeight: 600, marginBottom: 4 }}>₿ A typical wallet scores ~38/100</div>
        <div style={{ fontSize: 12, color: T.textMid, lineHeight: 1.6 }}>Most wallets have at least 3 fixable issues — usually address reuse, no CoinJoin, and round-amount withdrawals.</div>
        <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, marginTop: 6, letterSpacing: 1 }}>Illustrative baseline — reproducible, we store no scan data</div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SHARE CARD
───────────────────────────────────────────── */
// Lazy-load the self-hosted dom-to-image library on first PNG export (same-origin
// script injection — no third-party request, and non-exporting visitors never pay
// the download). Shared by the score share-card and the case-file card.
function ensureDomToImage() {
  if (window.domtoimage) return Promise.resolve();
  return new Promise((res, rej) => {
    const s = document.createElement("script");
    s.src = "vendor/dom-to-image-more.min.js";
    s.onload = res; s.onerror = rej;
    document.head.appendChild(s);
  });
}

/* ─────────────────────────────────────────────
   VISUAL SCORE CARD — rendered into share modal Card tab
   Used for PNG export via dom-to-image-more
───────────────────────────────────────────── */
function VisualGaugeArc({ score, size = 120, uid }) {
  const col = scoreColor(score);
  const cx = size / 2, cy = size * 0.62, R = size * 0.42;
  const startAngle = -210, sweepTotal = 240;
  const sweep = (score / 100) * sweepTotal;
  const toRad = d => (d * Math.PI) / 180;
  const pt = a => ({ x: cx + R * Math.cos(toRad(a)), y: cy + R * Math.sin(toRad(a)) });
  const arcPath = (s, e) => {
    const p = pt(s), q = pt(e), large = e - s > 180 ? 1 : 0;
    return `M ${p.x} ${p.y} A ${R} ${R} 0 ${large} 1 ${q.x} ${q.y}`;
  };
  const dot = pt(startAngle + sweep);
  const gid = `vg-${uid}`;
  return (
    <svg width={size} height={size * 0.78} viewBox={`0 0 ${size} ${size * 0.78}`} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={gid} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor={T.red} />
          <stop offset="50%"  stopColor={T.amber} />
          <stop offset="100%" stopColor={col} />
        </linearGradient>
      </defs>
      <path d={arcPath(startAngle, startAngle + sweepTotal)} fill="none" stroke="#ffffff10" strokeWidth={size * 0.07} strokeLinecap="round" />
      {score > 0 && <path d={arcPath(startAngle, startAngle + sweep)} fill="none" stroke={`url(#${gid})`} strokeWidth={size * 0.07} strokeLinecap="round" />}
      <circle cx={dot.x} cy={dot.y} r={size * 0.055} fill={col} />
      <text x={cx} y={cy + size * 0.06} textAnchor="middle" dominantBaseline="middle"
        style={{ fontFamily: T.sans, fontWeight: 700, fontSize: size * 0.28, fill: T.btc }}>₿</text>
    </svg>
  );
}

function VisualScoreCard({ score, grade, checks, address, isLightning = false, cardRef }) {
  const col = scoreColor(score);
  const uid = useRef(`vsc${Math.random().toString(36).slice(2,6)}`).current;
  const fails = checks.filter(c => c.status === "fail").length;
  const warns  = checks.filter(c => c.status === "warn").length;
  const passes = checks.filter(c => c.status === "pass").length;
  const topIssues = checks.filter(c => c.status !== "pass").slice(0, 3);
  const auditLabel = isLightning ? "LIGHTNING NODE AUDIT" : "BITCOIN PRIVACY AUDIT";
  const symbol = isLightning ? "⚡" : "₿";
  const dateStr = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }).toUpperCase();

  return (
    <div ref={cardRef} style={{
      width: 320, background: `linear-gradient(145deg,#0f1120 0%,#0b0d14 60%,#0f1120 100%)`,
      border: `1.5px solid ${col}33`, borderRadius: 20, overflow: "hidden",
      boxShadow: `0 0 0 1px #ffffff06, 0 24px 60px #000000cc, 0 0 40px ${col}18`,
      fontFamily: T.sans, position: "relative",
    }}>
      {/* Dot-grid texture */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: "radial-gradient(circle,#ffffff05 1px,transparent 1px)", backgroundSize: "18px 18px" }} />
      {/* Top glow bar */}
      <div style={{ height: 3, background: `linear-gradient(90deg,transparent,${col},transparent)` }} />

      {/* Header */}
      <div style={{ padding: "12px 16px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <VisualGaugeArc score={score} size={32} uid={uid + "h"} />
          <div>
            <div style={{ fontFamily: T.display, fontSize: 14, fontWeight: 800, letterSpacing: 2, color: T.text }}>
              <span style={{ color: T.cyan }}>ANON</span>SCORE
            </div>
            <div style={{ fontFamily: T.mono, fontSize: 6, color: T.textDim, letterSpacing: 1.5, marginTop: 1 }}>{auditLabel}</div>
          </div>
        </div>
        <div style={{ fontFamily: T.mono, fontSize: 7, color: T.textDim, textAlign: "right", lineHeight: 1.6 }}>
          <div style={{ letterSpacing: 1 }}>{dateStr}</div>
          <div style={{ opacity: 0.5 }}>anonscore.com</div>
        </div>
      </div>

      {/* Score hero — arc left, stats right, no dead space */}
      <div style={{ padding: "8px 16px 10px", display: "flex", alignItems: "center", gap: 12 }}>
        <VisualGaugeArc score={score} size={72} uid={uid + "b"} />
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <div style={{ fontFamily: T.serif, fontSize: 52, color: col, lineHeight: 1, fontWeight: 300,
              textShadow: `0 0 20px ${col}55` }}>{grade}</div>
            <div>
              <div style={{ fontFamily: T.mono, fontSize: 9, color: col, letterSpacing: 1 }}>{scoreLabel(score)}</div>
              <div style={{ fontFamily: T.mono, fontSize: 18, color: T.text, fontWeight: 600, lineHeight: 1.1 }}>
                {score}<span style={{ fontSize: 9, color: T.textDim, fontWeight: 400 }}>/100</span>
              </div>
            </div>
          </div>
          {address && address !== "DEMO" && address !== "DEMO_LN" && (
            <div style={{ fontFamily: T.mono, fontSize: 7, color: T.textDim, marginTop: 4 }}>
              {symbol} {fmt.addr(address)}
            </div>
          )}
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: `linear-gradient(90deg,transparent,${T.border},transparent)`, margin: "0 16px" }} />

      {/* Findings */}
      <div style={{ padding: "10px 16px" }}>
        <div style={{ fontFamily: T.mono, fontSize: 7, color: T.textDim, letterSpacing: 1.5, marginBottom: 7 }}>FINDINGS</div>
        <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
          {[{ count: fails, label: "Critical", color: T.red }, { count: warns, label: "Warnings", color: T.amber }, { count: passes, label: "Passed", color: T.green }].map(({ count, label, color }) => (
            <div key={label} style={{ flex: 1, background: `${color}10`, border: `1px solid ${color}28`, borderRadius: 7, padding: "6px 0", textAlign: "center" }}>
              <div style={{ fontFamily: T.display, fontSize: 17, color, fontWeight: 700 }}>{count}</div>
              <div style={{ fontFamily: T.mono, fontSize: 6, color: T.textDim, letterSpacing: 1, marginTop: 1 }}>{label.toUpperCase()}</div>
            </div>
          ))}
        </div>
        {topIssues.map((issue, i) => {
          const dot = issue.status === "fail" ? T.red : T.amber;
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 7, padding: "4px 0", borderTop: `1px solid #1e2130` }}>
              <div style={{ width: 4, height: 4, borderRadius: "50%", background: dot, flexShrink: 0 }} />
              <span style={{ fontSize: 10, color: T.text, flex: 1 }}>{issue.name}</span>
              <span style={{ fontFamily: T.mono, fontSize: 7, color: dot, textTransform: "uppercase" }}>{issue.status}</span>
            </div>
          );
        })}
      </div>

      {/* Footer CTA */}
      <div style={{ margin: "0 16px 14px", background: `${T.cyan}0d`, border: `1px solid ${T.cyan}22`,
        borderRadius: 8, padding: "7px 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontFamily: T.mono, fontSize: 8, color: T.textMid }}>
          {isLightning ? "Score your node free" : "Scan your wallet free"}
        </div>
        <div style={{ fontFamily: T.mono, fontSize: 9, color: T.cyan, fontWeight: 600, letterSpacing: 0.5 }}>anonscore.com →</div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MODAL A11Y — one hook every dialog shares. On open: move focus into the
   panel; while open: trap Tab within it and close on Escape; on close: restore
   focus to whatever the user was on before (the trigger). Attach the returned
   ref to the panel element, and give that element role="dialog" aria-modal
   aria-label + tabIndex={-1}. onClose fires on Escape.
───────────────────────────────────────────── */
function useDialog(onClose) {
  const ref = useRef(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const prev = document.activeElement;
    const focusable = () => [...node.querySelectorAll(
      'a[href],button:not([disabled]),input:not([disabled]),textarea:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])'
    )].filter(el => el.offsetParent !== null || el === document.activeElement);
    (focusable()[0] || node).focus();
    const onKey = (e) => {
      if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); closeRef.current && closeRef.current(); return; }
      if (e.key !== "Tab") return;
      const f = focusable();
      if (!f.length) { e.preventDefault(); node.focus(); return; }
      const first = f[0], last = f[f.length - 1], active = document.activeElement;
      if (e.shiftKey && (active === first || !node.contains(active))) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && (active === last || !node.contains(active))) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("keydown", onKey, true);
      if (prev && typeof prev.focus === "function") prev.focus();
    };
  }, []);
  return ref;
}

/* ─────────────────────────────────────────────
   SHARE MODAL
───────────────────────────────────────────── */
function ShareCard({ score, grade, checks, address, isLightning = false, onClose }) {
  const col = scoreColor(score);
  const dialogRef = useDialog(onClose);
  const [mode, setMode] = useState("copy");
  const [didCopy, setDidCopy] = useState(false);
  const [nostrSent, setNostrSent] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const cardRef = useRef(null);

  const issueCount = checks.filter(c => c.status !== "pass").length;
  const modeStr = isLightning ? "Lightning node" : "Bitcoin wallet";
  const heuristicStr = isLightning ? "8 Lightning privacy checks" : "11 on-chain heuristics";
  const avgStr = isLightning ? "" : "\n\nA typical wallet scores ~38/100. How does yours compare?";

  const shareText = `My ${modeStr} privacy score: Grade ${grade} (${score}/100)\n${issueCount} issue${issueCount !== 1 ? "s" : ""} found.\nCheck yours free → anonscore.com`;
  const xText    = `My ${modeStr} privacy score: Grade ${grade} (${score}/100) — ${issueCount} issue${issueCount !== 1 ? "s" : ""} found.${avgStr}\n\nFree tool 👇\nanonscore.com`;
  const badgeMd  = `\`Privacy: ${score}/100 · Grade ${grade}\` — [AnonScore](https://anonscore.com)`;
  const nostrNote = `🔒 ${modeStr.charAt(0).toUpperCase() + modeStr.slice(1)} privacy score: Grade ${grade} (${score}/100)\n\n${issueCount} issue${issueCount !== 1 ? "s" : ""} detected via AnonScore — a free open-source tool that runs ${heuristicStr} against your ${isLightning ? "node's public footprint" : "on-chain history"}.${avgStr}\n\nhttps://anonscore.com\n\n#Bitcoin #Privacy${isLightning ? " #Lightning" : ""}`;

  const copy = (text) => { navigator.clipboard?.writeText(text).catch(() => {}); setDidCopy(true); setTimeout(() => setDidCopy(false), 2000); };
  const shareToX = () => window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(xText)}`, "_blank", "noopener,noreferrer");
  const shareToNostr = async () => {
    if (window.nostr) {
      try { await window.nostr.signEvent({ kind: 1, content: nostrNote, tags: [], created_at: Math.floor(Date.now() / 1000) }); setNostrSent(true); setTimeout(() => setNostrSent(false), 3000); return; } catch {}
    }
    copy(nostrNote);
  };

  const downloadPng = async () => {
    if (!cardRef.current || downloading) return;
    setDownloading(true);
    try {
      await ensureDomToImage();
      // Give fonts time to load before capture
      await document.fonts.ready;
      await new Promise(r => setTimeout(r, 150));
      const blob = await window.domtoimage.toBlob(cardRef.current, { width: 320, scale: 2, bgcolor: "#0b0d14" });
      const a = document.createElement("a");
      const url = URL.createObjectURL(blob);
      a.href = url;
      a.download = `anonscore-grade${grade}-${score}.png`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 4000); // free the blob once the download has started
    } catch {
      copy(shareText); // fallback
    }
    setDownloading(false);
  };

  const TABS = [["copy","📤 Copy"],["x","𝕏 Post"],["nostr","🟣 Nostr"],["badge","🏷 Badge"],["card","🖼 Card"]];
  const isCard = mode === "card";

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 800, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "#00000088" }} />
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-label="Share your privacy score" tabIndex={-1}
        style={{ position: "relative", background: T.card, border: `1px solid ${T.border}`, borderRadius: 20, padding: 24,
        width: isCard ? "min(380px,96vw)" : "min(400px,94vw)", animation: "fadeUp .3s ease both", transition: "width .2s ease" }}>

        {/* Tab strip */}
        <div style={{ display: "flex", gap: 4, marginBottom: 18 }}>
          {TABS.map(([m, label]) => (
            <button key={m} onClick={() => setMode(m)} style={{ flex: 1, padding: "7px 2px", background: mode === m ? (m === "card" ? T.lnLo : T.cyanLo) : "transparent",
              border: `1.5px solid ${mode === m ? (m === "card" ? T.ln : T.cyan) : T.border}`, borderRadius: 8,
              color: mode === m ? (m === "card" ? T.ln : T.cyan) : T.textMid,
              fontSize: 11, cursor: "pointer", fontFamily: T.sans, transition: "all .15s", whiteSpace: "nowrap" }}>{label}</button>
          ))}
        </div>

        {/* Copy tab */}
        {mode === "copy" && <>
          <div style={{ background: T.surface, borderRadius: 10, padding: 14, marginBottom: 14, border: `1px solid ${T.borderLo}` }}>
            <pre style={{ fontFamily: T.sans, fontSize: 13, color: T.textMid, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{shareText}</pre>
          </div>
          <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <button onClick={() => copy(shareText)} style={{ flex: 1, padding: "12px", background: didCopy ? T.green : T.cyan, border: "none", borderRadius: 10, color: T.bg, fontFamily: T.sans, fontWeight: 700, fontSize: 14, cursor: "pointer", transition: "background .2s" }}>{didCopy ? "✓ Copied!" : "Copy to share"}</button>
            <button onClick={onClose} style={{ padding: "12px 14px", background: "transparent", border: `1px solid ${T.border}`, borderRadius: 10, color: T.textMid, cursor: "pointer" }}>✕</button>
          </div>
          {address && address !== "DEMO" && address !== "DEMO_LN" && (
            <button onClick={() => copy(`https://anonscore.com/?scan=${encodeURIComponent(address)}`)} style={{ width: "100%", padding: "9px", background: "transparent", border: `1px solid ${T.border}`, borderRadius: 10, color: T.textDim, fontFamily: T.mono, fontSize: 11, cursor: "pointer", transition: "all .15s" }}
              onMouseOver={e => { e.currentTarget.style.borderColor = T.cyan; e.currentTarget.style.color = T.cyan; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textDim; }}>
              🔗 Copy result link — anonscore.com/?scan={address.slice(0,12)}…
            </button>
          )}
        </>}

        {/* X tab */}
        {mode === "x" && <>
          <div style={{ background: T.surface, borderRadius: 10, padding: 14, marginBottom: 14, border: `1px solid ${T.borderLo}` }}>
            <pre style={{ fontFamily: T.sans, fontSize: 13, color: T.textMid, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{xText}</pre>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={shareToX} style={{ flex: 1, padding: "12px", background: "#000", border: "none", borderRadius: 10, color: "#fff", fontFamily: T.sans, fontWeight: 700, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <span style={{ fontSize: 16 }}>𝕏</span> Post on X
            </button>
            <button onClick={() => copy(xText)} style={{ padding: "12px 14px", background: "transparent", border: `1px solid ${T.border}`, borderRadius: 10, color: T.textMid, cursor: "pointer", fontSize: 12 }}>{didCopy ? "✓" : "Copy"}</button>
            <button onClick={onClose} style={{ padding: "12px 14px", background: "transparent", border: `1px solid ${T.border}`, borderRadius: 10, color: T.textMid, cursor: "pointer" }}>✕</button>
          </div>
        </>}

        {/* Nostr tab */}
        {mode === "nostr" && <>
          {window.nostr && <div style={{ background: T.greenLo, border: `1px solid ${T.green}33`, borderRadius: 8, padding: "8px 12px", marginBottom: 10, fontSize: 12, color: T.green }}>✓ NIP-07 extension detected — can publish directly</div>}
          <div style={{ background: T.surface, borderRadius: 10, padding: 14, marginBottom: 14, border: `1px solid ${T.borderLo}` }}>
            <pre style={{ fontFamily: T.sans, fontSize: 12, color: T.textMid, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{nostrNote}</pre>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={shareToNostr} style={{ flex: 1, padding: "12px", background: nostrSent ? T.green : "#8B5CF6", border: "none", borderRadius: 10, color: "#fff", fontFamily: T.sans, fontWeight: 700, fontSize: 14, cursor: "pointer", transition: "background .2s" }}>{nostrSent ? "✓ Published!" : window.nostr ? "Publish to Nostr" : "Copy Nostr note"}</button>
            <button onClick={onClose} style={{ padding: "12px 14px", background: "transparent", border: `1px solid ${T.border}`, borderRadius: 10, color: T.textMid, cursor: "pointer" }}>✕</button>
          </div>
        </>}

        {/* Badge tab */}
        {mode === "badge" && <>
          <div style={{ background: T.surface, borderRadius: 10, padding: 14, marginBottom: 10, border: `1px solid ${T.borderLo}` }}>
            <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, letterSpacing: 1.5, marginBottom: 8 }}>MARKDOWN BADGE</div>
            <pre style={{ fontFamily: T.mono, fontSize: 11, color: T.textMid, lineHeight: 1.7, whiteSpace: "pre-wrap", wordBreak: "break-all" }}>{badgeMd}</pre>
          </div>
          <div style={{ fontSize: 12, color: T.textMid, marginBottom: 14, lineHeight: 1.5 }}>Paste into your GitHub README or Nostr profile bio to show your privacy grade.</div>
          <button onClick={() => copy(badgeMd)} style={{ width: "100%", padding: "12px", background: didCopy ? T.green : T.cyan, border: "none", borderRadius: 10, color: T.bg, fontFamily: T.sans, fontWeight: 700, fontSize: 14, cursor: "pointer", transition: "background .2s" }}>{didCopy ? "✓ Copied!" : "Copy badge markdown"}</button>
        </>}

        {/* Card tab */}
        {mode === "card" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <VisualScoreCard score={score} grade={grade} checks={checks} address={address} isLightning={isLightning} cardRef={cardRef} />
            </div>
            <div style={{ display: "flex", gap: 8, width: "100%" }}>
              <button onClick={downloadPng} style={{ flex: 1, padding: "12px", background: downloading ? T.surface : T.ln, border: `1px solid ${downloading ? T.border : "transparent"}`, borderRadius: 10, color: downloading ? T.textMid : T.bg, fontFamily: T.sans, fontWeight: 700, fontSize: 14, cursor: downloading ? "default" : "pointer", transition: "all .2s" }}>
                {downloading ? "Rendering…" : "⬇ Download PNG"}
              </button>
              <button onClick={onClose} style={{ padding: "12px 14px", background: "transparent", border: `1px solid ${T.border}`, borderRadius: 10, color: T.textMid, cursor: "pointer" }}>✕</button>
            </div>
            <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, textAlign: "center", lineHeight: 1.7 }}>
              Save the PNG and drop it into any post. Works on X, Nostr, Telegram.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   PRIVACY RELAY TOGGLE — opt-in mitigation for the browser→explorer IP leak
───────────────────────────────────────────── */
function RelayToggle({ trustLine }) {
  const on = useRelay();
  const expId = useExplorer();
  useLang(); // strings below are localized
  const exp = EXPLORERS[expId];
  return (
    <div style={{ maxWidth: HERO_COL, margin: "0 auto 12px", animation: "fadeUp .5s ease .2s both", background: on ? T.cyanLo : T.surface, border: `1px solid ${on ? T.cyan + "66" : T.border}`, borderRadius: 10, padding: "10px 14px", transition: "all .2s" }}>
      {trustLine && (
        <div style={{ fontFamily: T.sans, fontSize: 12, color: T.textMid, lineHeight: 1.5, textAlign: "left", paddingBottom: 9, marginBottom: 9, borderBottom: `1px solid ${T.borderLo}` }}>
          {trustLine}
        </div>
      )}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 11 }}>
        <button role="switch" aria-checked={on} aria-label={t("relay.aria")}
          onClick={() => setRelay(!on)}
          style={{ flexShrink: 0, width: 40, height: 23, borderRadius: 999, border: "none", cursor: "pointer", background: on ? T.cyan : T.border, position: "relative", transition: "background .2s", marginTop: 1 }}>
          <span style={{ position: "absolute", top: 2.5, left: on ? 19 : 2.5, width: 18, height: 18, borderRadius: "50%", background: on ? T.bg : T.textDim, transition: "left .2s" }} />
        </button>
        <div style={{ fontFamily: T.sans, fontSize: 12, color: T.textMid, lineHeight: 1.5, textAlign: "left" }}>
          <strong style={{ color: on ? T.cyan : T.text }}>{t(on ? "relay.on.label" : "relay.off.label")}</strong>
          {t(on ? "relay.on.body" : "relay.off.body").replace("{x}", exp.label)}
          {" "}
          <a href="https://github.com/netasset/anonscore/blob/main/workers/relay/worker.js" target="_blank" rel="noopener noreferrer"
            style={{ color: T.cyan, textDecoration: "none", fontFamily: T.mono, fontSize: 11, whiteSpace: "nowrap" }}>{t("relay.verify")}</a>
        </div>
      </div>
      {/* Explorer picker — both speak the same esplora API, direct or relayed.
          Styled as an obvious two-way toggle so it reads as switchable. */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 9, paddingLeft: 51, flexWrap: "wrap" }}>
        <span style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, letterSpacing: 1 }}>{t("relay.explorer")}</span>
        {Object.entries(EXPLORERS).map(([id, e]) => (
          <button key={id} onClick={() => setExplorer(id)} aria-pressed={expId === id}
            aria-label={`Switch the block explorer to ${e.label}`} title={`Switch to ${e.label}`}
            style={{ background: expId === id ? T.cyanLo : T.surface, border: `1px solid ${expId === id ? T.cyan + "aa" : T.border}`, borderRadius: 999, padding: "4px 12px", fontFamily: T.mono, fontSize: 10, color: expId === id ? T.cyan : T.textMid, cursor: "pointer", transition: "all .15s" }}
            onMouseOver={e2 => { if (expId !== id) { e2.currentTarget.style.borderColor = T.cyan + "77"; e2.currentTarget.style.color = T.cyan; } }}
            onMouseOut={e2 => { if (expId !== id) { e2.currentTarget.style.borderColor = T.border; e2.currentTarget.style.color = T.textMid; } }}>
            {e.label}
          </button>
        ))}
        <span aria-hidden="true" style={{ fontFamily: T.mono, fontSize: 9.5, color: T.cyan, letterSpacing: 0.5, marginLeft: 2, whiteSpace: "nowrap" }}>⇄ tap to switch</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   TRUST BOX — collapsed by default, expands on click
───────────────────────────────────────────── */
// Every claim links to its proof. That's the standard an open-source privacy
// tool should hold itself to: don't ask for trust — hand over the evidence.
const REPO = "https://github.com/netasset/anonscore";
const GUARANTEES = [
  { icon: "⬡", label: "No server, no backend", desc: "Lookups read a public explorer — through our no-log relay by default, or straight from your browser with the relay off. Either way nothing touches an AnonScore database. There isn't one.",
    proof: "read the fetch code", href: `${REPO}/blob/main/anonscore.jsx` },
  { icon: "◌", label: "Nothing stored or logged", desc: "No database, no analytics, no session tracking. Your scan history lives in your browser's local storage and never leaves it.",
    proof: "see the privacy stance", href: `${REPO}#privacy-stance-what-makes-this-site-different` },
  { icon: "◎", label: "Scoring runs in your browser", desc: "All 11 heuristics execute locally. Your score and results are computed on your device and sent nowhere — not even to us.",
    proof: "read the heuristics", href: `${REPO}/blob/main/anonscore.jsx` },
  { icon: "⬢", label: "Zero third-party requests", desc: "Every script, font, and icon is self-hosted. A strict Content-Security-Policy makes your browser block anything else — enforced by the browser, not by our promise.",
    proof: "read the CSP header", href: `${REPO}/blob/main/_headers` },
  { icon: "◇", label: "Even the relay can't remember you", desc: "A stateless Worker: no storage, no logging code, observability pinned off in its config. 'No logs' is a setting in the public repo, not a claim you have to trust.",
    proof: "read the relay source", href: `${REPO}/blob/main/workers/relay/worker.js` },
  { icon: "▣", label: "Open source, MIT, auditable in minutes", desc: "One readable repo: site, heuristics, relay. Security issues get a private disclosure path. Even our funding is disclosed, in the footer.",
    proof: "browse the repo", href: REPO },
];

function TrustBox() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ background: T.surface, border: `1px solid ${open ? T.green + "44" : T.border}`, borderRadius: 12, marginBottom: 20, animation: "fadeUp .5s ease .18s both", transition: "border-color .2s", overflow: "hidden" }}>
      {/* Collapsed header — always visible */}
      <button onClick={() => setOpen(o => !o)} style={{ width: "100%", background: "transparent", border: "none", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {GUARANTEES.slice(0, 3).map((g, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ color: T.green, fontSize: 11 }}>✓</span>
              <span style={{ fontFamily: T.mono, fontSize: 11, color: T.textMid, letterSpacing: .5, whiteSpace: "nowrap" }}>{g.label}</span>
            </div>
          ))}
        </div>
        <span style={{ fontFamily: T.mono, fontSize: 11, color: T.cyan, flexShrink: 0, marginLeft: 12 }}>{open ? "▲ less" : "▼ how?"}</span>
      </button>
      {/* Expanded detail */}
      {open && (
        <div style={{ padding: "0 16px 14px", borderTop: `1px solid ${T.borderLo}`, animation: "slideDown .2s ease both" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 12 }}>
            {GUARANTEES.map((g, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ fontFamily: T.mono, fontSize: 12, color: T.green, flexShrink: 0, marginTop: 1 }}>{g.icon}</span>
                <div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{g.label} </span>
                  <span style={{ fontSize: 13, color: T.textMid }}>{g.desc}</span>
                  {g.href && <>{" "}<a href={g.href} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: T.cyan, textDecoration: "none", fontFamily: T.mono, whiteSpace: "nowrap" }}>verify: {g.proof} ↗</a></>}
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12, paddingTop: 10, borderTop: `1px solid ${T.borderLo}` }}>
            <a href="https://github.com/netasset/anonscore" target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: T.cyan, textDecoration: "none", fontFamily: T.mono }}>Don't take our word for it — every claim above links to its proof. Audit the full source on GitHub ↗</a>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── GUARANTEE RAIL — the six guarantees as a quick-glance column in the
   hero's right margin, beside the relay switch. Each row links straight to
   its proof (same GUARANTEES data as the trust box). Renders only on wide
   viewports (≥1100px) where the margin actually exists; mobile/tablet users
   get the full trust box further down the page instead. ── */
function GuaranteeRail() {
  // Only render when the viewport is wide enough that the rail can sit right
  // beside the centered 860px content column (not stranded at the far edge).
  const [wide, setWide] = useState(() => typeof window !== "undefined" && window.innerWidth >= 1500);
  useEffect(() => {
    const onR = () => setWide(window.innerWidth >= 1500);
    window.addEventListener("resize", onR);
    return () => window.removeEventListener("resize", onR);
  }, []);
  if (!wide) return null;
  return (
    // left = column centre (50%) + half the 860 column (430) + a 40px gutter.
    // width scales with the leftover space so it fills it without overflowing.
    <aside aria-label="Privacy guarantees — each links to its proof"
      style={{ position: "absolute", left: "calc(50% + 470px)", top: 300, width: "min(360px, calc(50vw - 494px))", zIndex: 1, animation: "fadeUp .5s ease .3s both" }}>
      <div style={{ fontFamily: T.mono, fontSize: 10, color: T.textDim, letterSpacing: 2, marginBottom: 14, paddingBottom: 10, borderBottom: `1px solid ${T.border}` }}>{t("rail.title")}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {GUARANTEES.map((g, i) => (
          <a key={i} href={g.href} target="_blank" rel="noopener noreferrer"
            style={{ display: "flex", alignItems: "flex-start", gap: 10, fontFamily: T.mono, fontSize: 13, color: T.textMid, textDecoration: "none", lineHeight: 1.4, padding: "9px 10px", marginLeft: -10, borderRadius: 8, transition: "color .15s, background .15s", animation: `fadeUp .45s ease ${(0.35 + i * 0.08).toFixed(2)}s both` }}
            onMouseOver={e => { e.currentTarget.style.color = T.cyan; e.currentTarget.style.background = T.cyanLo; }}
            onMouseOut={e => { e.currentTarget.style.color = T.textMid; e.currentTarget.style.background = "transparent"; }}>
            <span style={{ color: T.green, flexShrink: 0, fontSize: 14, lineHeight: 1.3 }}>✓</span>{t(`g.${i}.label`)}
          </a>
        ))}
      </div>
      <div style={{ fontFamily: T.mono, fontSize: 10, color: T.textDim, marginTop: 12, paddingLeft: 10, lineHeight: 1.5 }}>{t("rail.foot")}</div>
    </aside>
  );
}

/* ─────────────────────────────────────────────
   CASE FILES — list page
───────────────────────────────────────────── */
const CATEGORY_META = {
  exchange: { label: "Exchange",  color: "#58a6ff" },
  seizure:  { label: "Seizure",   color: "#f85149" },
  darknet:  { label: "Darknet",   color: "#E8A730" },
  miner:    { label: "Miner",     color: "#3fb950" },
};
const STATUS_META = {
  active:     { label: "Active",      color: "#3fb950" },
  dormant:    { label: "Dormant",     color: "#888fae" },
  liquidating:{ label: "Liquidating", color: "#E8A730" },
  liquidated: { label: "Liquidated",  color: "#58a6ff" },
};

function CaseFiles({ onOpenCase, onBack, isMobile }) {
  const PAGE_ROLE_LABEL = "AnonScore case files — notable Bitcoin wallets";
  const [filter, setFilter] = useState("all");
  const categories = ["all", "exchange", "seizure", "miner"];
  const visible = filter === "all" ? CASE_FILES : CASE_FILES.filter(c => c.category === filter);

  return (
    <div role="main" aria-label={PAGE_ROLE_LABEL} style={{ minHeight: "100vh", background: "transparent", display: "flex", flexDirection: "column" }}>
      {/* Nav */}
      <nav style={{ display: "flex", alignItems: "center", gap: 10, padding: isMobile ? "12px 16px" : "12px 32px", borderBottom: `1px solid ${T.border}`, background: T.bg, position: "sticky", top: 0, zIndex: 100 }}>
        <button onClick={onBack} style={{ background: "transparent", border: `1.5px solid ${T.border}`, borderRadius: 8, padding: "7px 12px", color: T.textMid, fontFamily: T.sans, fontSize: 13, cursor: "pointer", transition: "border .15s" }}
          onMouseOver={e => e.currentTarget.style.borderColor = T.cyan}
          onMouseOut={e => e.currentTarget.style.borderColor = T.border}>← Back</button>
        <div style={{ fontFamily: T.display, fontSize: 15, letterSpacing: 4, fontWeight: 700 }}>ANON<span style={{ color: T.cyan }}>SCORE</span></div>
        <div style={{ flex: 1 }} />
        <div style={{ fontFamily: T.mono, fontSize: 10, color: T.textDim }}>CASE FILES</div>
      </nav>

      <div style={{ flex: 1, padding: isMobile ? "24px 16px" : "40px 48px", maxWidth: 960, margin: "0 auto", width: "100%" }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontFamily: T.mono, fontSize: 10, color: T.textDim, letterSpacing: 2.5, marginBottom: 12 }}>NOTABLE BITCOIN WALLETS</div>
          <h1 style={{ fontFamily: T.serif, fontSize: isMobile ? 32 : 48, color: T.text, fontWeight: 400, marginBottom: 12 }}>Case Files</h1>
          <p style={{ fontSize: 15, color: T.textMid, lineHeight: 1.7, maxWidth: 600, fontWeight: 300 }}>
            The most significant Bitcoin addresses in history — scored, dissected, and explained. Each case shows what blockchain forensics actually reveals about real-world wallets.
          </p>
        </div>

        {/* Filter pills */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setFilter(cat)}
              style={{ padding: "6px 14px", borderRadius: 20, border: `1px solid ${filter === cat ? T.cyan : T.border}`, background: filter === cat ? T.cyanLo : "transparent", color: filter === cat ? T.cyan : T.textDim, fontFamily: T.mono, fontSize: 10, cursor: "pointer", letterSpacing: 1, transition: "all .15s", textTransform: "uppercase" }}>
              {cat === "all" ? `All (${CASE_FILES.length})` : `${CATEGORY_META[cat]?.label} (${CASE_FILES.filter(c => c.category === cat).length})`}
            </button>
          ))}
        </div>

        {/* Case grid */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", gap: 16 }}>
          {visible.map((c, i) => {
            const cat = CATEGORY_META[c.category];
            const st  = STATUS_META[c.status];
            return (
              <div key={c.id} onClick={() => onOpenCase(c)}
                style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: "22px 24px", cursor: "pointer", transition: "transform .13s ease-out, border-color .2s, box-shadow .25s", animation: `fadeUp .35s ease ${i * .06}s both` }}
                onMouseMove={tiltMove}
                onMouseEnter={e => { e.currentTarget.style.borderColor = cat.color + "66"; e.currentTarget.style.boxShadow = `0 16px 40px -18px ${cat.color}`; }}
                onMouseLeave={e => { tiltReset(e); e.currentTarget.style.borderColor = T.border; e.currentTarget.style.boxShadow = "none"; }}>
                {/* Fingerprint thumbnail — the same editorial scene as the detail page */}
                <div style={{ margin: "-22px -24px 16px", borderRadius: "16px 16px 0 0", overflow: "hidden", borderBottom: `1px solid ${T.borderLo}` }}>
                  <CaseHero seed={c.id} color={cat.color} height={56} />
                </div>
                {/* Meta row */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <span style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim }}>#{c.id}</span>
                  <span style={{ fontFamily: T.mono, fontSize: 8, color: cat.color, background: cat.color + "18", border: `1px solid ${cat.color}33`, borderRadius: 4, padding: "2px 7px", letterSpacing: 1 }}>{cat.label.toUpperCase()}</span>
                  <span style={{ fontFamily: T.mono, fontSize: 8, color: st.color, background: st.color + "18", border: `1px solid ${st.color}33`, borderRadius: 4, padding: "2px 7px", letterSpacing: 1 }}>{st.label.toUpperCase()}</span>
                  <span style={{ marginLeft: "auto", fontFamily: T.mono, fontSize: 9, color: T.textDim }}>{c.btc} BTC</span>
                </div>
                {/* Title */}
                <div style={{ fontFamily: T.serif, fontSize: 20, color: T.text, fontWeight: 400, marginBottom: 8 }}>{c.title}</div>
                {/* Entity */}
                <div style={{ fontFamily: T.mono, fontSize: 10, color: T.textDim, marginBottom: 10 }}>{c.entity}</div>
                {/* Hook */}
                <div style={{ fontSize: 13, color: T.textMid, lineHeight: 1.6, marginBottom: 16 }}>{c.hook}</div>
                {/* Address */}
                <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, background: T.surface, borderRadius: 6, padding: "6px 10px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {c.address}
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 14 }}>
                  <span style={{ fontFamily: T.mono, fontSize: 10, color: cat.color }}>Read case →</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   CASE DETAIL — individual case with live scan
───────────────────────────────────────────── */
function CaseDetail({ caseFile, onBack, onAnalyze, isMobile }) {
  const PAGE_ROLE_LABEL = "AnonScore case file: " + caseFile.title;
  const [shareMode, setShareMode] = useState(null); // null | "thread" | "link"
  const [copied, setCopied] = useState(false);
  const cat = CATEGORY_META[caseFile.category];
  const st  = STATUS_META[caseFile.status];

  const copy = (text) => {
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const scanUrl = `https://anonscore.com/?scan=${encodeURIComponent(caseFile.address)}`;
  const threadText = caseFile.thread.join("\n\n---\n\n");

  // Downloadable case card — 600×315 layout exported at 2× (1200×630, the
  // standard social-card size) through the self-hosted dom-to-image pipeline.
  const cardRef = useRef(null);
  const [rendering, setRendering] = useState(false);
  const downloadCard = async () => {
    if (!cardRef.current || rendering) return;
    setRendering(true);
    try {
      await ensureDomToImage();
      await document.fonts.ready;
      await new Promise(r => setTimeout(r, 150));
      const blob = await window.domtoimage.toBlob(cardRef.current, { width: 600, scale: 2, bgcolor: "#0b0d14" });
      const a = document.createElement("a");
      const url = URL.createObjectURL(blob);
      a.href = url;
      a.download = `anonscore-case-${caseFile.id}-${caseFile.slug}.png`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 4000); // free the blob once the download has started
    } catch {
      copy(scanUrl); // fallback: at least give them the link
    }
    setRendering(false);
  };

  return (
    <div role="main" aria-label={PAGE_ROLE_LABEL} style={{ minHeight: "100vh", background: "transparent", display: "flex", flexDirection: "column" }}>
      {/* Nav */}
      <nav style={{ display: "flex", alignItems: "center", gap: 10, padding: isMobile ? "12px 16px" : "12px 32px", borderBottom: `1px solid ${T.border}`, background: T.bg, position: "sticky", top: 0, zIndex: 100 }}>
        <button onClick={onBack} style={{ background: "transparent", border: `1.5px solid ${T.border}`, borderRadius: 8, padding: "7px 12px", color: T.textMid, fontFamily: T.sans, fontSize: 13, cursor: "pointer" }}
          onMouseOver={e => e.currentTarget.style.borderColor = T.cyan}
          onMouseOut={e => e.currentTarget.style.borderColor = T.border}>← Cases</button>
        <div style={{ fontFamily: T.display, fontSize: 15, letterSpacing: 4, fontWeight: 700 }}>ANON<span style={{ color: T.cyan }}>SCORE</span></div>
        <div style={{ flex: 1 }} />
        <span style={{ fontFamily: T.mono, fontSize: 9, color: cat.color, background: cat.color + "18", border: `1px solid ${cat.color}33`, borderRadius: 4, padding: "3px 8px", letterSpacing: 1 }}>CASE #{caseFile.id}</span>
      </nav>

      <div style={{ flex: 1, padding: isMobile ? "24px 16px" : "40px 48px", maxWidth: 800, margin: "0 auto", width: "100%" }}>

        {/* Header */}
        <div style={{ marginBottom: 32, animation: "fadeUp .4s ease both" }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 14 }}>
            <span style={{ fontFamily: T.mono, fontSize: 8, color: cat.color, background: cat.color + "18", border: `1px solid ${cat.color}33`, borderRadius: 4, padding: "2px 7px", letterSpacing: 1 }}>{cat.label.toUpperCase()}</span>
            <span style={{ fontFamily: T.mono, fontSize: 8, color: st.color, background: st.color + "18", border: `1px solid ${st.color}33`, borderRadius: 4, padding: "2px 7px", letterSpacing: 1 }}>{st.label.toUpperCase()}</span>
            <span style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim }}>{caseFile.entity}</span>
          </div>
          <h1 style={{ fontFamily: T.serif, fontSize: isMobile ? 28 : 42, color: T.text, fontWeight: 400, marginBottom: 16, lineHeight: 1.2 }}>{caseFile.title}</h1>
          <p style={{ fontSize: 16, color: T.textMid, lineHeight: 1.7, fontWeight: 300 }}>{caseFile.hook}</p>
        </div>

        {/* On-chain fingerprint hero — breaks up the narrative, sets the tone */}
        <div style={{ position: "relative", background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, overflow: "hidden", marginBottom: 28, animation: "fadeUp .4s ease .06s both" }}>
          <CaseHero seed={caseFile.id} color={cat.color} height={isMobile ? 96 : 132} />
          <div style={{ position: "absolute", bottom: 10, left: 16, fontFamily: T.mono, fontSize: 8, color: T.textDim, letterSpacing: 1.5, pointerEvents: "none" }}>
            ON-CHAIN FLOW · {caseFile.btc} BTC
          </div>
          <div style={{ position: "absolute", top: 10, right: 16, fontFamily: T.mono, fontSize: 8, color: cat.color, letterSpacing: 1.5, pointerEvents: "none" }}>
            FINGERPRINT
          </div>
        </div>

        {/* Scan CTA — prominent */}
        <div style={{ background: T.card, border: `1px solid ${cat.color}33`, borderRadius: 16, padding: "20px 24px", marginBottom: 28, animation: "fadeUp .4s ease .08s both" }}>
          <div style={{ height: 2, background: cat.color, borderRadius: 1, margin: "-20px -24px 16px", opacity: 0.6 }} />
          <div style={{ display: "flex", alignItems: isMobile ? "flex-start" : "center", gap: 16, flexDirection: isMobile ? "column" : "row" }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, letterSpacing: 1.5, marginBottom: 6 }}>ADDRESS</div>
              <div style={{ fontFamily: T.mono, fontSize: isMobile ? 10 : 12, color: T.text, wordBreak: "break-all", lineHeight: 1.5 }}>{caseFile.address}</div>
              <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, marginTop: 4 }}>{caseFile.btc} BTC · {caseFile.entity}</div>
            </div>
            <button onClick={() => onAnalyze(caseFile.address, false, "btc")}
              style={{ flexShrink: 0, background: cat.color, border: "none", borderRadius: 10, padding: "12px 22px", color: T.bg, fontFamily: T.sans, fontWeight: 700, fontSize: 14, cursor: "pointer", whiteSpace: "nowrap", transition: "opacity .15s" }}
              onMouseOver={e => e.currentTarget.style.opacity = ".85"}
              onMouseOut={e => e.currentTarget.style.opacity = "1"}>
              Scan live →
            </button>
          </div>
        </div>

        {/* Notable facts */}
        <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: "16px 20px", marginBottom: 16, animation: "fadeUp .4s ease .12s both" }}>
          <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, letterSpacing: 1.5, marginBottom: 10 }}>KEY FACTS</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {caseFile.notable.map((fact, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ color: cat.color, fontSize: 10, flexShrink: 0, marginTop: 2 }}>◆</span>
                <span style={{ fontSize: 13, color: T.textMid, lineHeight: 1.6 }}>{fact}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI data disclaimer — case files only */}
        <div style={{ background: T.greenLo, border: `1px solid ${T.green}33`, borderRadius: 12, padding: "14px 18px", marginBottom: 28, animation: "fadeUp .4s ease .14s both" }}>
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <span style={{ color: T.green, fontSize: 13, flexShrink: 0, marginTop: 1 }}>🔓</span>
            <div>
              <div style={{ fontFamily: T.mono, fontSize: 9, color: T.green, letterSpacing: 1.5, marginBottom: 6 }}>PUBLIC WALLET — EXTENDED AI ACCESS</div>
              <div style={{ fontSize: 12, color: T.textMid, lineHeight: 1.7 }}>
                This is a publicly known institutional wallet. When you open the AI assistant after scanning, it receives the score, issue breakdown, <strong style={{ color: T.text }}>and a summary of recent on-chain transactions</strong> — all public blockchain data. This allows it to discuss specific transaction patterns, not just the score.
              </div>
              <div style={{ fontSize: 12, color: T.textDim, lineHeight: 1.7, marginTop: 8, paddingTop: 8, borderTop: `1px solid ${T.borderLo}` }}>
                🔒 <strong style={{ color: T.text }}>Personal wallets work differently.</strong> When you scan your own address, the AI receives only your score and issue names — never transaction IDs, UTXO data, or anything that could identify you. That boundary is enforced in code and shown in the consent screen before every session.{" "}
                <a href="https://github.com/netasset/anonscore" target="_blank" rel="noopener noreferrer" style={{ color: T.cyan, textDecoration: "underline" }}>Verify it in the open source code →</a>
              </div>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div style={{ marginBottom: 24, animation: "fadeUp .4s ease .16s both" }}>
          <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, letterSpacing: 1.5, marginBottom: 12 }}>BACKGROUND</div>
          <div style={{ fontSize: 15, color: T.textMid, lineHeight: 1.8, fontWeight: 300 }}>{caseFile.summary}</div>
        </div>

        {/* Full narrative */}
        <div style={{ marginBottom: 32, animation: "fadeUp .4s ease .20s both" }}>
          <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, letterSpacing: 1.5, marginBottom: 16 }}>CASE ANALYSIS</div>
          {caseFile.narrative.split("\n\n").map((para, i) => (
            <p key={i} style={{ fontSize: 15, color: T.textMid, lineHeight: 1.85, marginBottom: 16, fontWeight: 300 }}>{para}</p>
          ))}
        </div>

        {/* Share / publish tools */}
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, overflow: "hidden", marginBottom: 24, animation: "fadeUp .4s ease .24s both" }}>
          <div style={{ display: "flex", borderBottom: `1px solid ${T.border}` }}>
            {[["thread","𝕏 Thread"],["link","🔗 Share link"],["card","🖼 Card"]].map(([m, label]) => (
              <button key={m} onClick={() => setShareMode(shareMode === m ? null : m)}
                style={{ flex: 1, padding: "12px", background: shareMode === m ? T.cyanLo : "transparent", border: "none", borderRight: m !== "card" ? `1px solid ${T.border}` : "none", color: shareMode === m ? T.cyan : T.textMid, fontFamily: T.sans, fontSize: 13, cursor: "pointer", transition: "all .15s" }}>
                {label}
              </button>
            ))}
          </div>
          {shareMode === "thread" && (
            <div style={{ padding: "16px 20px" }}>
              <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, letterSpacing: 1.5, marginBottom: 12 }}>PRE-WRITTEN X THREAD — {caseFile.thread.length} TWEETS</div>
              {caseFile.thread.map((tweet, i) => (
                <div key={i} style={{ display: "flex", gap: 10, padding: "10px 0", borderTop: i > 0 ? `1px solid ${T.borderLo}` : undefined }}>
                  <span style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, flexShrink: 0, width: 20 }}>{i + 1}/</span>
                  <span style={{ fontSize: 13, color: T.textMid, lineHeight: 1.65, flex: 1 }}>{tweet}</span>
                </div>
              ))}
              <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                <button onClick={() => copy(threadText)} style={{ flex: 1, padding: "10px", background: copied ? T.green : T.cyan, border: "none", borderRadius: 8, color: T.bg, fontFamily: T.sans, fontWeight: 700, fontSize: 13, cursor: "pointer", transition: "background .2s" }}>
                  {copied ? "✓ Copied!" : "Copy full thread"}
                </button>
                <button onClick={() => window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(caseFile.thread[0])}`, "_blank", "noopener,noreferrer")}
                  style={{ padding: "10px 16px", background: "#000", border: "none", borderRadius: 8, color: "#fff", fontFamily: T.sans, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                  Post on 𝕏
                </button>
              </div>
            </div>
          )}
          {shareMode === "link" && (
            <div style={{ padding: "16px 20px" }}>
              <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, letterSpacing: 1.5, marginBottom: 10 }}>SHAREABLE SCAN LINK</div>
              <div style={{ fontFamily: T.mono, fontSize: 11, color: T.textMid, background: T.surface, borderRadius: 8, padding: "10px 12px", marginBottom: 12, wordBreak: "break-all" }}>{scanUrl}</div>
              <div style={{ fontSize: 12, color: T.textDim, marginBottom: 12, lineHeight: 1.6 }}>Anyone who opens this link will see a confirmation prompt, then can scan this address live. Perfect for posts and articles.</div>
              <button onClick={() => copy(scanUrl)} style={{ width: "100%", padding: "10px", background: copied ? T.green : T.cyan, border: "none", borderRadius: 8, color: T.bg, fontFamily: T.sans, fontWeight: 700, fontSize: 13, cursor: "pointer", transition: "background .2s" }}>
                {copied ? "✓ Copied!" : "Copy link"}
              </button>
            </div>
          )}
          {shareMode === "card" && (
            <div style={{ padding: "16px 20px" }}>
              <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, letterSpacing: 1.5, marginBottom: 12 }}>SOCIAL CARD — 1200×630 PNG</div>
              <div style={{ overflowX: "auto", marginBottom: 14 }}>
                {/* Fixed 600×315 layout so the 2× export is exactly social-card size */}
                <div ref={cardRef} style={{ width: 600, height: 315, background: T.bg, border: `1px solid ${T.border}`, borderRadius: 12, overflow: "hidden", display: "flex", flexDirection: "column", flexShrink: 0 }}>
                  <CaseHero seed={caseFile.id} color={cat.color} height={132} />
                  <div style={{ flex: 1, padding: "14px 22px 16px", display: "flex", flexDirection: "column" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <span style={{ fontFamily: T.mono, fontSize: 9, color: cat.color, background: cat.color + "18", border: `1px solid ${cat.color}33`, borderRadius: 4, padding: "2px 8px", letterSpacing: 1 }}>CASE #{caseFile.id} · {cat.label.toUpperCase()}</span>
                      <span style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim }}>{caseFile.btc} BTC</span>
                    </div>
                    <div style={{ fontFamily: T.serif, fontSize: 26, color: T.text, fontWeight: 400, lineHeight: 1.15, marginBottom: 8 }}>{caseFile.title}</div>
                    <div style={{ fontSize: 12, color: T.textMid, lineHeight: 1.5, overflow: "hidden" }}>{caseFile.hook}</div>
                    <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontFamily: T.display, fontSize: 11, letterSpacing: 3, fontWeight: 700, color: T.text }}>ANON<span style={{ color: T.cyan }}>SCORE</span></span>
                      <span style={{ fontFamily: T.mono, fontSize: 10, color: T.textDim }}>anonscore.com/?case={caseFile.slug}</span>
                    </div>
                  </div>
                </div>
              </div>
              <button onClick={downloadCard} disabled={rendering}
                style={{ width: "100%", padding: "10px", background: rendering ? T.surface : T.cyan, border: "none", borderRadius: 8, color: rendering ? T.textMid : T.bg, fontFamily: T.sans, fontWeight: 700, fontSize: 13, cursor: rendering ? "wait" : "pointer", transition: "background .2s" }}>
                {rendering ? "Rendering…" : "⬇ Download PNG (1200×630)"}
              </button>
            </div>
          )}
        </div>

        {/* External source */}
        {caseFile.externalUrl && (
          <div style={{ textAlign: "center", marginBottom: 24, animation: "fadeUp .4s ease .28s both" }}>
            <a href={caseFile.externalUrl} target="_blank" rel="noopener noreferrer"
              style={{ fontFamily: T.mono, fontSize: 11, color: T.cyan, textDecoration: "none" }}>
              Further reading ↗
            </a>
          </div>
        )}
      </div>
    </div>
  );
}


// Compact language switcher — cycles/exposes supported locales. Only renders
// when more than one locale exists, so it stays invisible until translations land.
function LangSwitcher({ compact = false }) {
  const lang = useLang();
  if (SUPPORTED_LANGS.length < 2) return null;
  return (
    <div role="group" aria-label="Language" style={{ display: "flex", alignItems: "center", gap: 2, border: `1px solid ${T.border}`, borderRadius: 7, overflow: "hidden" }}>
      {SUPPORTED_LANGS.map(l => (
        <button key={l} onClick={() => setLang(l)} aria-pressed={lang === l} aria-label={`Switch language to ${LANG_LABEL[l]}`}
          style={{ background: lang === l ? T.cyan : "transparent", border: "none", padding: compact ? "4px 7px" : "5px 9px", color: lang === l ? T.bg : T.textDim, fontFamily: T.mono, fontSize: 10, fontWeight: 700, cursor: "pointer", letterSpacing: 0.5, transition: "background .15s, color .15s" }}>
          {LANG_LABEL[l]}
        </button>
      ))}
    </div>
  );
}

// Cursor-driven 3D tilt for cards. Reduced-motion aware (cached). Pair onMouseMove={tiltMove}
// with onMouseLeave/onMouseOut={tiltReset}. The reset transition lives on the element's style.
let _reducedMotion = null;
function prefersReducedMotion() {
  if (_reducedMotion === null) _reducedMotion = !!(typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  return _reducedMotion;
}
function tiltMove(e) {
  if (prefersReducedMotion()) return;
  const el = e.currentTarget, r = el.getBoundingClientRect();
  const px = (e.clientX - r.left) / r.width - 0.5;
  const py = (e.clientY - r.top) / r.height - 0.5;
  el.style.transform = `perspective(760px) rotateX(${(-py * 6.5).toFixed(2)}deg) rotateY(${(px * 6.5).toFixed(2)}deg) translateY(-4px)`;
}
function tiltReset(e) { e.currentTarget.style.transform = ""; }

// Animated count-up: eases a number from 0 to its target the first time it scrolls into view.
// Handles formatted values like "$1.1B", "91%", "546 sat" — preserves prefix/suffix.
function CountUp({ value }) {
  const ref = useRef(null);
  const m = String(value).match(/^(\D*)([\d.,]+)(.*)$/);
  useEffect(() => {
    const el = ref.current;
    if (!el || !m) return;
    const target = parseFloat(m[2].replace(/,/g, ""));
    const decimals = (m[2].split(".")[1] || "").length;
    const settle = () => { el.textContent = value; };
    if (typeof IntersectionObserver === "undefined" || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) { settle(); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        io.unobserve(el);
        const dur = 1150, start = performance.now();
        const step = (now) => {
          const p = Math.min(1, (now - start) / dur);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = m[1] + (target * eased).toFixed(decimals) + m[3];
          if (p < 1) requestAnimationFrame(step); else settle();
        };
        requestAnimationFrame(step);
      });
    }, { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, [value]);
  return <span ref={ref}>{value}</span>;
}

function Landing({ onAnalyze, isMobile, onCases }) {
  useLang(); // re-render this subtree when language changes
  // Nav shows the trust-signal row only when there's room for it beside the
  // centered logo (below this, they'd crowd the brand).
  const [navWide, setNavWide] = useState(() => typeof window !== "undefined" && window.innerWidth >= 1040);
  useEffect(() => {
    const onR = () => setNavWide(window.innerWidth >= 1040);
    window.addEventListener("resize", onR);
    return () => window.removeEventListener("resize", onR);
  }, []);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [spInfo, setSpInfo] = useState(null);   // decoded Silent Payments (BIP352) address, if entered
  const [lnInvoice, setLnInvoice] = useState(null);   // decoded BOLT11 Lightning invoice, if entered
  const [history, setHistory] = useState(() => getHistory());
  const deleteHistory = (addr) => { removeFromHistory(addr); setHistory(getHistory()); };
  const wipeHistory = () => { clearAllHistory(); setHistory([]); };
  const [showFunding, setShowFunding] = useState(false);
  const [tipCopied, setTipCopied] = useState("");
  const copyTip = (label, value) => {
    if (!value) return;
    navigator.clipboard?.writeText(value).catch(() => {});
    setTipCopied(label);
    setTimeout(() => setTipCopied(""), 1800);
  };
  const inputRef = useRef();
  const heroRef = useRef(null);

  // Keyboard shortcut: "/" focuses the address input (unless the user is already typing somewhere).
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      e.preventDefault();
      inputRef.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Scroll-reveal: a single observer fades+lifts each `.reveal` section into view.
  // Degrades safely — no IntersectionObserver (or reduced-motion via CSS) → shown immediately.
  useEffect(() => {
    const els = document.querySelectorAll(".reveal:not(.in)");
    if (typeof IntersectionObserver === "undefined") {
      els.forEach((el) => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.1, rootMargin: "0px 0px -7% 0px" });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Cursor-reactive hero: a soft cyan spotlight follows the pointer (desktop only, reduced-motion off).
  useEffect(() => {
    const el = heroRef.current;
    if (!el || isMobile) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 100;
      const y = ((e.clientY - r.top) / r.height) * 100;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty("--mx", x + "%");
        el.style.setProperty("--my", y + "%");
      });
    };
    el.addEventListener("mousemove", onMove);
    return () => { el.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf); };
  }, [isMobile]);

  const inputType = detectInputType(input);
  const isLn = inputType === "ln_pubkey" || inputType === "ln_address";

  const submit = (val, plain = false) => {
    const v = (val || input).trim();
    setSpInfo(null); setLnInvoice(null);
    if (!v) { setError(t("err.empty")); return; }
    const detected = detectInputType(v);
    if (!detected) {
      const sp = decodeSilentPayment(v);
      if (sp) { setError(""); setSpInfo(sp); return; }   // not scannable — it's a reusable BIP352 address; educate instead
      const inv = decodeBolt11(v);
      if (inv) { setError(""); setLnInvoice(inv); return; }   // a Lightning invoice — decode + lint what it leaks
      setError(t("err.invalid"));
      return;
    }
    if (detected === "ln_address") {
      // Lightning addresses (user@domain) can't be resolved to a node — don't pretend to scan one.
      setError(t("err.lnaddress"));
      return;
    }
    setError("");
    onAnalyze(v, plain, detected);
  };

  return (
    <>
      {/* ── OPNORANGE TOOLKIT STRIP (umbrella cross-links — its own nav landmark, rendered before <main> so cross-site nav isn't nested in main content) ── */}
      <nav aria-label="OPNorange toolkit" style={{ background: T.bg, borderBottom: `1px solid ${T.borderLo}`, display: "flex", alignItems: "center", gap: 12, padding: isMobile ? "7px 20px" : "7px 48px" }}>
        {/* One tidy family cluster on the left — mark, then the three tools */}
        <a href="https://opnorange.com" target="_blank" rel="noopener noreferrer" aria-label="OPNorange — the toolkit hub"
          style={{ display: "flex", alignItems: "center", gap: 7, textDecoration: "none", flexShrink: 0 }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: T.opn, boxShadow: `0 0 7px ${T.opn}`, flexShrink: 0 }} />
          <span style={{ fontFamily: T.mono, fontSize: 10, color: T.textMid, letterSpacing: 1.5, fontWeight: 700 }}>OPN<span style={{ color: T.opn }}>ORANGE</span></span>
          {!isMobile && <span style={{ fontFamily: T.mono, fontSize: 10, color: T.textDim, letterSpacing: 1.5 }}>· {t("umbrella.label")}</span>}
        </a>
        {!isMobile && <>
          <span style={{ color: T.borderLo, flexShrink: 0 }}>|</span>
          <div style={{ display: "flex", alignItems: "center", gap: 9, flexShrink: 0 }}>
            {/* Current tool — highlighted, not a link (you're here) */}
            <span style={{ fontFamily: T.mono, fontSize: 10, color: T.opn, fontWeight: 700, letterSpacing: 0.5 }}>{t("umbrella.privacy")}</span>
            <span style={{ color: T.borderLo }}>·</span>
            <a href="https://dcabutler.com" target="_blank" rel="noopener noreferrer"
              style={{ fontFamily: T.mono, fontSize: 10, color: T.textMid, textDecoration: "none", letterSpacing: 0.5, transition: "color .15s" }}
              onMouseOver={e => e.currentTarget.style.color = T.opn}
              onMouseOut={e => e.currentTarget.style.color = T.textMid}>
              {t("umbrella.dca")} ↗
            </a>
            <span style={{ color: T.borderLo }}>·</span>
            <a href="https://opnorange.com" target="_blank" rel="noopener noreferrer"
              style={{ fontFamily: T.mono, fontSize: 10, color: T.textMid, textDecoration: "none", letterSpacing: 0.5, transition: "color .15s" }}
              onMouseOver={e => e.currentTarget.style.color = T.opn}
              onMouseOut={e => e.currentTarget.style.color = T.textMid}>
              {t("umbrella.hub")} ↗
            </a>
          </div>
        </>}
      </nav>
      <div role="main" aria-label="AnonScore — Bitcoin & Lightning privacy audit" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "transparent" }}>
      {/* Nav — trust signals left · brand centered · actions right */}
      <nav style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", padding: isMobile ? "14px 20px" : "14px 48px", borderBottom: `1px solid ${T.border}`, background: T.bg, position: "sticky", top: 0, zIndex: 100 }}>
        {/* Left — trust signals (proof) */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0, justifySelf: "start" }}>
          {navWide && <>
            <span style={{ fontFamily: T.mono, fontSize: 10, color: T.textDim }}>{t("nav.nocookies")}</span>
            <span style={{ color: T.borderLo }}>·</span>
            <span style={{ fontFamily: T.mono, fontSize: 10, color: T.textDim }}>{t("nav.nothingstored")}</span>
            <span style={{ color: T.borderLo }}>·</span>
            <span style={{ fontFamily: T.mono, fontSize: 10, color: T.textDim }}>{t("nav.tor")}</span>
            <span style={{ color: T.borderLo }}>·</span>
            <span style={{ fontFamily: T.mono, fontSize: 10, color: T.textDim }}>{t("nav.opensource")}</span>
          </>}
        </div>
        {/* Center — the brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, justifySelf: "center" }}>
          <span style={{ color: T.btc, fontFamily: T.mono, fontSize: 15, lineHeight: 1, textShadow: `0 0 14px ${T.btc}77` }}>₿</span>
          <span style={{ fontFamily: T.display, fontWeight: 700, fontSize: 16, letterSpacing: 4, color: T.text, textTransform: "uppercase" }}>ANON<span style={{ color: T.cyan, textShadow: `0 0 14px ${T.cyan}55` }}>SCORE</span></span>
        </div>
        {/* Right — actions */}
        <div style={{ display: "flex", gap: 8, alignItems: "center", justifySelf: "end" }}>
          <a href="https://github.com/netasset/anonscore" target="_blank" rel="noopener noreferrer"
            style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 7, color: T.textMid, textDecoration: "none", fontSize: 11, fontFamily: T.mono, transition: "border-color .15s" }}
            onMouseOver={e => e.currentTarget.style.borderColor = T.cyan}
            onMouseOut={e => e.currentTarget.style.borderColor = T.border}>
            GitHub ↗
          </a>
          {!isMobile && <Tag label={t("nav.free")} color={T.green} size={10} />}
          <LangSwitcher />
        </div>
      </nav>

      {/* ── CASE FILES STRIP ── */}
      <div style={{ background: T.surface, borderBottom: `1px solid ${T.border}`, borderTop: `2px solid ${T.btc}`, overflowX: "auto", WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 0, minWidth: "max-content", padding: "0 20px" }}>
          {/* Label */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 14px 9px 0", borderRight: `1px solid ${T.border}`, marginRight: 14, flexShrink: 0 }}>
            <span style={{ fontFamily: T.mono, fontSize: 9, color: T.btc, letterSpacing: 2, fontWeight: 700 }}>📁 CASE FILES</span>
          </div>
          {/* Case pills */}
          {CASE_FILES.map((c, i) => {
            const cat = CATEGORY_META[c.category];
            return (
              <button key={c.id} onClick={() => onCases(c)}
                style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 14px", background: "transparent", border: "none", borderRight: `1px solid ${T.borderLo}`, color: T.textMid, fontFamily: T.sans, fontSize: 12, cursor: "pointer", whiteSpace: "nowrap", transition: "all .15s", flexShrink: 0 }}
                onMouseEnter={e => { e.currentTarget.style.background = T.card; e.currentTarget.style.color = T.text; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = T.textMid; }}>
                <span style={{ fontFamily: T.mono, fontSize: 9, color: cat.color, fontWeight: 700 }}>#{c.id}</span>
                {c.title}
              </button>
            );
          })}
          {/* View all */}
          <button onClick={() => onCases(null)}
            style={{ display: "flex", alignItems: "center", gap: 5, padding: "9px 16px", background: "transparent", border: "none", color: T.btc, fontFamily: T.mono, fontSize: 9, cursor: "pointer", letterSpacing: 1, whiteSpace: "nowrap", flexShrink: 0, transition: "color .15s", fontWeight: 700 }}
            onMouseEnter={e => e.currentTarget.style.color = T.text}
            onMouseLeave={e => e.currentTarget.style.color = T.btc}>
            VIEW ALL →
          </button>
        </div>
      </div>

      {/* ── HERO ── */}
      <div ref={heroRef} style={{ position: "relative", overflow: "hidden" }}>
        <ParticleCanvas color={T.cyan} />
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0, background: "radial-gradient(360px circle at var(--mx,50%) var(--my,26%), #22D3EE14, transparent 60%)" }} />
        <div style={{ position: "absolute", top: "10%", left: "-10%", width: 520, height: 520, borderRadius: "50%", background: "radial-gradient(circle,#22D3EE18 0%,transparent 70%)", animation: "orb 8s ease-in-out infinite", pointerEvents: "none", filter: "blur(2px)" }} />
        <div className="aurora" style={{ top: "-10%", right: "-12%", width: 460, height: 460, background: "radial-gradient(circle,#F7931A16 0%,transparent 70%)", animationDelay: "-8s" }} />
        <div className="aurora" style={{ bottom: "-24%", left: "32%", width: 400, height: 400, background: "radial-gradient(circle,#22D3EE12 0%,transparent 70%)", animationDelay: "-15s" }} />
        <div className="scan-ov" />
        <GuaranteeRail />

        <section style={{ position: "relative", padding: isMobile ? "34px 20px 40px" : "50px 48px 56px", maxWidth: 860, margin: "0 auto", width: "100%", textAlign: "center" }}>
          {/* Eyebrow */}
          <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: 2.5, marginBottom: 14, animation: "fadeUp .5s ease both", display: "flex", gap: 8, alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: T.btc }}>₿</span>
            <span style={{ color: T.cyan }}>{t("hero.eyebrow")}</span>
          </div>

          {/* Headline */}
          <h1 style={{ fontFamily: T.serif, fontSize: isMobile ? 38 : 56, lineHeight: 1.06, color: T.text, marginBottom: 20, animation: "fadeUp .5s ease .08s both", fontWeight: 400 }}>
            {t("hero.h1.line1")}<br />{t("hero.h1.line2")}<br /><em className="accent-glow" style={{ color: T.cyan, fontStyle: "italic" }}>{t("hero.h1.em")}</em>
          </h1>

          <p style={{ fontSize: isMobile ? 15 : 18, color: T.textMid, lineHeight: 1.6, fontWeight: 300, animation: "fadeUp .5s ease .14s both", maxWidth: 560, margin: "0 auto 20px" }}>
            {t("hero.sub")}
          </p>

          {/* Score spectrum — slim, inline — hidden when Lightning detected */}
          {!isLn && (
            <div style={{ maxWidth: HERO_COL, margin: "0 auto 16px", animation: "fadeUp .5s ease .16s both" }}>
              <div style={{ position: "relative", height: 6, borderRadius: 6, background: `linear-gradient(90deg, ${T.red} 0%, ${T.btc} 40%, ${T.amber} 60%, ${T.green} 100%)`, marginBottom: 6 }}>
                <div style={{ position: "absolute", top: "50%", left: "38%", transform: "translate(-50%,-50%)", width: 12, height: 12, borderRadius: "50%", background: T.bg, border: `2px solid ${T.btc}`, boxShadow: `0 0 8px ${T.btc}`, animation: "dotPulse 2.4s ease-out infinite" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontFamily: T.mono, fontSize: 9, color: T.red }}>{t("spectrum.low")}</span>
                <span style={{ fontFamily: T.mono, fontSize: 9, color: T.btc }}>{t("spectrum.avg")}</span>
                <span style={{ fontFamily: T.mono, fontSize: 9, color: T.green }}>{t("spectrum.high")}</span>
              </div>
            </div>
          )}

          {/* Privacy panel — trust line + relay switch in one compact box */}
          {RELAY_URL
            ? <RelayToggle trustLine={isLn ? t("trust.ln") : t("trust.btc")} />
            : <div style={{ maxWidth: HERO_COL, margin: "0 auto 12px", animation: "fadeUp .5s ease .20s both", background: T.surface, border: `1px solid ${isLn ? T.ln + "44" : T.border}`, borderRadius: 10, padding: "10px 14px", fontFamily: T.sans, fontSize: 12, color: T.textMid, lineHeight: 1.5, textAlign: "left" }}>{isLn ? t("trust.ln") : t("trust.btc")}</div>}

          {/* CTAs — wrapped in a glowing "scan console" panel. Intentionally the
              WIDEST hero element (HERO_WIDE > HERO_COL) so it breaks out of the
              supporting column and is unmistakably the main event. */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: HERO_WIDE, margin: "4px auto 0", animation: "fadeUp .5s ease .22s both, breathe 5s ease-in-out 1.2s infinite", background: T.card, border: `1px solid ${T.cyan}44`, borderRadius: 18, padding: isMobile ? "18px 16px" : "26px 30px", boxShadow: `0 0 60px -14px ${T.cyan}4d` }}>
            <div>
              {/* Type detection pill — appears when input is recognised */}
              {inputType && (
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8, animation: "slideDown .2s ease both" }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: isLn ? T.ln : T.btc, boxShadow: `0 0 6px ${isLn ? T.ln : T.btc}` }} />
                  <span style={{ fontFamily: T.mono, fontSize: 10, color: isLn ? T.ln : T.btc }}>
                    {inputType === "ln_pubkey" ? "⚡ Lightning node pubkey detected" :
                     inputType === "ln_address" ? "⚡ Lightning address — paste your node's pubkey instead" :
                     "₿ Bitcoin address detected"}
                  </span>
                </div>
              )}
              {/* Micro-label so the field reads unmistakably as the input, not prose */}
              <div style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: 1.5, color: T.textDim, marginBottom: 7, textAlign: "left" }}>
                {isLn ? "NODE PUBKEY" : "BITCOIN ADDRESS OR LN PUBKEY"}
              </div>
              {/* Input on its own full-width row so the field is the widest, most
                  prominent element; Analyze becomes a full-width CTA below it. */}
              <div style={{ display: "flex", gap: 8 }}>
                {isMobile && (
                  <button onClick={async () => {
                    try { const t = await navigator.clipboard.readText(); setInput(t.trim()); setError(""); } catch {}
                  }} style={{ background: T.surface, border: `1.5px solid ${T.border}`, borderRadius: 14, padding: "16px 15px", color: T.textMid, fontSize: 18, cursor: "pointer", flexShrink: 0, alignSelf: "stretch" }} title="Paste">
                    📋
                  </button>
                )}
                {/* Recessed input well: leading search glyph + strong border make it stand off the card */}
                <div style={{ position: "relative", flex: 1, minWidth: 0 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"
                    style={{ position: "absolute", left: 18, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                    <circle cx="11" cy="11" r="7" stroke={inputType ? (isLn ? T.ln : T.btc) : T.cyan} strokeWidth="2" opacity="0.9" />
                    <line x1="16.5" y1="16.5" x2="21" y2="21" stroke={inputType ? (isLn ? T.ln : T.btc) : T.cyan} strokeWidth="2" strokeLinecap="round" opacity="0.9" />
                  </svg>
                  <input ref={inputRef} value={input} onChange={e => { setInput(e.target.value); setError(""); setSpInfo(null); setLnInvoice(null); }}
                    onKeyDown={e => e.key === "Enter" && submit(null, true)}
                    aria-label="Paste a Bitcoin address, Lightning node pubkey, or silent payment address"
                    placeholder={isLn ? "03abc… (66-char node pubkey)" : "Paste an address or pubkey…"}
                    style={{ width: "100%", boxSizing: "border-box", background: "#070910",
                      border: `2px solid ${error ? T.red : inputType ? (isLn ? T.ln : T.btc) : T.cyan + "77"}`,
                      borderRadius: 14, padding: "22px 18px 22px 50px", color: T.text, fontFamily: T.mono, fontSize: 17, letterSpacing: 0.3, outline: "none", transition: "border .18s, box-shadow .25s", boxShadow: `inset 0 2px 14px #00000080`, minWidth: 0 }}
                    onFocus={e => {
                      const c = isLn ? T.ln : T.cyan;
                      e.target.style.borderColor = c;
                      e.target.style.boxShadow = `0 0 0 4px ${c}22, 0 0 24px ${c}55, inset 0 2px 14px #00000080`;
                    }}
                    onBlur={e => {
                      e.target.style.borderColor = error ? T.red : inputType ? (isLn ? T.ln : T.btc) : T.cyan + "77";
                      e.target.style.boxShadow = `inset 0 2px 14px #00000080`;
                    }} />
                </div>
              </div>
              <button onClick={() => submit(null, !isLn)} className="sheen"
                style={{ width: "100%", marginTop: 10, background: isLn ? T.ln : T.btc, border: "none", borderRadius: 14, padding: "18px 26px",
                  color: T.bg, fontFamily: T.sans, fontWeight: 700, fontSize: 16, cursor: "pointer", whiteSpace: "nowrap", transition: "all .15s" }}
                onMouseOver={e => e.currentTarget.style.opacity = ".88"}
                onMouseOut={e => e.currentTarget.style.opacity = "1"}>
                {isLn ? t("cta.audit") : t("cta.analyze")}
              </button>
              {isLn && (
                <div style={{ fontFamily: T.mono, fontSize: 10, color: T.textDim, marginTop: 5, textAlign: "left" }}>
                  ⚡ Node pubkeys only work if you run your own node — Umbrel, Start9, Citadel, RaspiBlitz, etc.
                </div>
              )}
              {error && <div style={{ fontSize: 12, color: T.red, marginTop: 6, animation: "slideDown .2s ease" }}>⚠ {error}</div>}
              {spInfo && (
                <div style={{ marginTop: 12, textAlign: "left", background: T.green + "0e", border: `1px solid ${T.green}40`, borderRadius: 14, padding: "14px 16px", animation: "slideDown .25s ease" }}>
                  <div style={{ fontFamily: T.mono, fontSize: 9, color: T.green, letterSpacing: 1.5, marginBottom: 8 }}>SILENT PAYMENT ADDRESS · BIP352{spInfo.network === "testnet" ? " · TESTNET" : ""}</div>
                  {spInfo.error === "v31" ? (
                    <div style={{ fontSize: 13, color: T.textMid, lineHeight: 1.6 }}>This is a valid Silent Payment address, but it uses a future version (v31) this tool doesn't decode yet. Newer software will read it.</div>
                  ) : (
                    <>
                      <div style={{ fontSize: 13.5, color: T.textMid, lineHeight: 1.65, marginBottom: 10 }}>
                        There's nothing here to scan — and that's the whole point. A Silent Payment address is <strong style={{ color: T.text }}>reusable but never reuses on-chain</strong>: every payment to it lands on a fresh, unlinkable output derived just for that sender. Address-reuse clustering — the heuristic most of this site is about — simply <strong style={{ color: T.text }}>can't touch it</strong>. You can post one address publicly and still get an unlinkable set of payments.
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {[["Scan key", spInfo.scanKey, "kept online — detects incoming payments"], ["Spend key", spInfo.spendKey, "kept in cold storage — authorizes spends"]].map(([k, key, note]) => (
                          <div key={k} style={{ background: T.surface, border: `1px solid ${T.borderLo}`, borderRadius: 9, padding: "8px 11px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "baseline" }}>
                              <span style={{ fontFamily: T.sans, fontSize: 12, color: T.text, fontWeight: 600 }}>{k}</span>
                              <span style={{ fontFamily: T.mono, fontSize: 10, color: T.textDim }}>{key.slice(0, 10)}…{key.slice(-6)}</span>
                            </div>
                            <div style={{ fontSize: 11, color: T.textDim, marginTop: 2 }}>{note}</div>
                          </div>
                        ))}
                      </div>
                      <div style={{ fontSize: 11.5, color: T.textDim, lineHeight: 1.55, marginTop: 10 }}>
                        The two-key split is the elegance: the scan key can watch for payments online while the spend key stays offline. Decoded entirely in your browser.
                      </div>
                    </>
                  )}
                </div>
              )}
              {lnInvoice && (() => {
                const inv = lnInvoice, leaky = inv.routes.length > 0;
                const sats = inv.amountMsat == null ? "any amount" : (inv.amountMsat / 1000).toLocaleString() + " sats";
                const cut = s => !s ? "" : s.length > 20 ? s.slice(0, 10) + "…" + s.slice(-6) : s;
                return (
                  <div style={{ marginTop: 12, textAlign: "left", background: (leaky ? T.red : T.ln) + "0e", border: `1px solid ${(leaky ? T.red : T.ln)}40`, borderRadius: 14, padding: "14px 16px", animation: "slideDown .25s ease" }}>
                    <div style={{ fontFamily: T.mono, fontSize: 9, color: leaky ? T.red : T.ln, letterSpacing: 1.5, marginBottom: 8 }}>LIGHTNING INVOICE · BOLT11{inv.network !== "mainnet" ? " · " + inv.network.toUpperCase() : ""}</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 10 }}>
                      <span style={{ fontFamily: T.serif, fontSize: 20, color: T.text }}>{sats}</span>
                      {inv.description && <span style={{ fontSize: 12.5, color: T.textMid, alignSelf: "center" }}>“{inv.description}”</span>}
                    </div>
                    {leaky ? (
                      <div style={{ background: T.red + "10", border: `1px solid ${T.red}33`, borderRadius: 10, padding: "10px 12px", fontSize: 12.5, color: T.textMid, lineHeight: 1.6 }}>
                        <strong style={{ color: T.red }}>This invoice exposes your channel's on-chain funding.</strong> To be paid over a private channel it carries routing hints, and each reveals a peer node plus a short-channel-ID — which <em>is</em> the location of the funding transaction on-chain:
                        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
                          {inv.routes.slice(0, 4).map((r, i) => (
                            <div key={i} style={{ background: T.surface, border: `1px solid ${T.borderLo}`, borderRadius: 8, padding: "7px 10px", fontFamily: T.mono, fontSize: 11 }}>
                              <div style={{ color: T.text }}>peer {cut(r.pubkey)}</div>
                              <div style={{ color: T.textDim, fontSize: 10, marginTop: 2 }}>funding tx → block {r.block.toLocaleString()} · tx #{r.tx} · output {r.out}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div style={{ fontSize: 12.5, color: T.textMid, lineHeight: 1.6 }}>
                        No private-channel routing hints — good. It still discloses the amount{inv.description ? ", a description" : ""}, and your node pubkey is recoverable from the invoice signature, so an observer can probe your public channels' balances.
                      </div>
                    )}
                    <div style={{ fontSize: 11.5, color: T.textDim, lineHeight: 1.55, marginTop: 10 }}>
                      Node balances are cheaply probeable — most channels' exact balances can be recovered in under a minute. Reuse invoices as little as possible; BOLT12 offers and blinded paths reduce this exposure. Decoded entirely in your browser.
                    </div>
                  </div>
                );
              })()}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ flex: 1, height: 1, background: T.borderLo }} />
              <span style={{ fontFamily: T.mono, fontSize: 10, color: T.textDim }}>{t("sample.divider")}</span>
              <div style={{ flex: 1, height: 1, background: T.borderLo }} />
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {[
                { addr: "DEMO",    label: t("sample.risky"),    color: T.btc,  type: "btc" },
                { addr: "DEMO_A",  label: t("sample.pristine"), color: T.green, type: "btc" },
                { addr: "DEMO_LN", label: t("sample.lightning"),color: T.ln,   type: "ln_pubkey" },
              ].map(s => (
                <button key={s.addr} onClick={() => onAnalyze(s.addr, false, s.type)}
                  style={{ flex: "1 1 30%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: T.surface, border: `1.5px solid ${T.border}`, borderRadius: 12, padding: "11px 14px", color: T.textMid, fontFamily: T.sans, fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "border-color .18s, color .18s" }}
                  onMouseOver={e => { e.currentTarget.style.borderColor = s.color; e.currentTarget.style.color = s.color; }}
                  onMouseOut={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textMid; }}>
                  {s.label}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <a href="https://github.com/netasset/anonscore" target="_blank" rel="noopener noreferrer"
                style={{ fontFamily: T.mono, fontSize: 10, color: T.cyan, textDecoration: "none" }}>Open source ↗</a>
            </div>
          </div>

          {/* Recent scans history — only shown if they have prior scans */}
          {history.length > 0 && (
            <div style={{ maxWidth: HERO_COL, margin: "14px auto 0", animation: "fadeUp .5s ease .3s both" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ fontFamily: T.mono, fontSize: 8, color: T.textDim, letterSpacing: 1.5 }}>{t("recent.title")}</div>
                  <button onClick={wipeHistory} aria-label="Clear all scan history from this browser"
                    style={{ background: "none", border: "none", fontFamily: T.mono, fontSize: 8, letterSpacing: 1, color: T.textDim, cursor: "pointer", padding: 0, textDecoration: "underline", textUnderlineOffset: 2 }}
                    onMouseOver={e => e.currentTarget.style.color = T.red}
                    onMouseOut={e => e.currentTarget.style.color = T.textDim}>{t("recent.clear")}</button>
                </div>
                {history.length >= 2 && <Sparkline history={history.map(h => h.score)} width={64} height={22} />}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {history.map((h, i) => {
                  const col = scoreColor(h.score);
                  return (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, padding: "8px 12px", transition: "border-color .15s" }}
                      onMouseOver={e => e.currentTarget.style.borderColor = col}
                      onMouseOut={e => e.currentTarget.style.borderColor = T.border}>
                      <button onClick={() => onAnalyze(h.addr, false, h.isLightning ? "ln_pubkey" : "btc")}
                        style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, background: "none", border: "none", cursor: "pointer", textAlign: "left", minWidth: 0 }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: col, flexShrink: 0 }} />
                        <div style={{ fontFamily: T.mono, fontSize: 10, color: T.textDim, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {h.isLightning ? "⚡ " : "₿ "}{h.addr === "DEMO" || h.addr === "DEMO_A" || h.addr === "DEMO_LN" ? "Demo" : h.addr.slice(0, 14) + "…"}
                        </div>
                        <div style={{ fontFamily: T.serif, fontSize: 14, color: col, flexShrink: 0 }}>{h.grade}</div>
                        <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, flexShrink: 0 }}>{h.score}/100</div>
                        <div style={{ fontFamily: T.mono, fontSize: 8, color: T.textDim, flexShrink: 0 }}>↺</div>
                      </button>
                      <button onClick={() => deleteHistory(h.addr)}
                        style={{ background: "none", border: "none", color: T.textDim, fontSize: 12, cursor: "pointer", padding: "0 2px", flexShrink: 0, lineHeight: 1 }}
                        onMouseOver={e => e.currentTarget.style.color = T.red}
                        onMouseOut={e => e.currentTarget.style.color = T.textDim}>✕</button>
                    </div>
                  );
                })}
              </div>
              <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, marginTop: 5, textAlign: "left", lineHeight: 1.5 }}>
                {t("recent.note")}
              </div>
            </div>
          )}

        </section>
      </div>{/* end hero wrapper */}

      {/* ── HOW IT WORKS — compact strip ── */}
      <div className="reveal hairline-x" style={{ background: T.surface, padding: isMobile ? "28px 20px" : "32px 48px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: isMobile ? 20 : 0 }}>
            {[
              { n:"01", icon:"📋", title:"Paste an address or pubkey", desc:"Bitcoin address (bc1…, 1…, 3…) or Lightning node pubkey (66-char hex). No account, no email, nothing saved." },
              { n:"02", icon:"🔍", title:"We run the checks",  desc:"Bitcoin: 11 on-chain heuristics. Lightning: 8 node privacy checks. Same patterns surveillance firms use — runs in your browser." },
              { n:"03", icon:"🎯", title:"Score + fix plan",  desc:"A score from 0–100, every issue explained, fixes ranked by impact. Bitcoin scan also has a 💬 Plain English mode." },
            ].map((s, i) => (
              <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: isMobile ? 0 : "0 28px", borderLeft: !isMobile && i > 0 ? `1px solid ${T.border}` : "none" }}>
                <div style={{ fontSize: 22, flexShrink: 0, marginTop: 2 }}>{s.icon}</div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontFamily: T.mono, fontSize: 9, color: T.cyan }}>{s.n}</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: T.text }}>{s.title}</span>
                  </div>
                  <div style={{ fontSize: 13, color: T.textMid, lineHeight: 1.6 }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── OPENNESS & PRIVACY — every claim links to its proof ── */}
      <div className="reveal" style={{ padding: isMobile ? "28px 20px 0" : "36px 48px 0" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, letterSpacing: 2, marginBottom: 10 }}>{t("open.title")}</div>
          <h2 style={{ fontFamily: T.serif, fontSize: isMobile ? 28 : 40, color: T.text, fontWeight: 400, marginBottom: 16, lineHeight: 1.15 }}>
            {t("open.h2.pre")} <em className="accent-glow" style={{ color: T.cyan, fontStyle: "italic" }}>{t("open.h2.em")}</em>
          </h2>
          <TrustBox />
        </div>
      </div>

      {/* ── DEMO PREVIEW — desktop full, mobile score cards ── */}
      {!isMobile && (
        <div style={{ padding: "48px 48px 0", maxWidth: 860, margin: "0 auto", width: "100%" }}>
          <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, letterSpacing: 2, marginBottom: 14, textAlign: "center" }}>LIVE EXAMPLE — WHAT YOUR RESULTS LOOK LIKE</div>
          <DemoPreview />
        </div>
      )}
      {isMobile && (
        <div style={{ padding: "32px 20px 0" }}>
          <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, letterSpacing: 2, marginBottom: 14, textAlign: "center" }}>EXAMPLE SCORES</div>
          <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 8, scrollbarWidth: "none" }}>
            {DEMO_EXAMPLES.map((ex, i) => (
              <div key={i} onClick={() => onAnalyze("DEMO", false, "btc")} style={{ flexShrink: 0, background: T.card, border: `1px solid ${ex.color}33`, borderRadius: 14, padding: "16px 18px", cursor: "pointer", minWidth: 140 }}>
                <div style={{ height: 2, background: `linear-gradient(90deg,transparent,${ex.color},transparent)`, margin: "0 -18px 12px", marginTop: -16, borderRadius: "14px 14px 0 0" }} />
                <div style={{ fontFamily: T.serif, fontSize: 38, color: ex.color, lineHeight: 1 }}>{ex.grade}</div>
                <div style={{ fontFamily: T.mono, fontSize: 10, color: ex.color, marginTop: 2 }}>{ex.label}</div>
                <div style={{ fontFamily: T.mono, fontSize: 16, color: T.text, marginTop: 6, fontWeight: 600 }}>{ex.score}<span style={{ fontSize: 9, color: T.textDim }}>/100</span></div>
                <div style={{ fontFamily: T.mono, fontSize: 8, color: T.textDim, marginTop: 8 }}>{ex.issues[0]}</div>
              </div>
            ))}
          </div>
          <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, textAlign: "center", marginTop: 8 }}>tap to try the demo →</div>
        </div>
      )}

      <Divider />

      {/* ── CITED STATS ── */}
      <section className="reveal" style={{ background: T.surface, padding: isMobile ? "48px 20px" : "64px 48px", position: "relative", overflow: "hidden" }}>
        <div className="dot-grid" style={{ position: "absolute", inset: 0, opacity: .4, pointerEvents: "none" }} />
        <div style={{ maxWidth: 900, margin: "0 auto", position: "relative" }}>
          <div style={{ fontFamily: T.mono, fontSize: 10, color: T.textDim, letterSpacing: 2.5, textAlign: "center", marginBottom: 36 }}>BY THE NUMBERS</div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: 16 }}>
            {LANDING_FACTS.map((f, i) => {
              const barColors = [T.red, T.btc, T.btc, T.btc];
              const barWidths = [88, 91, 33, 38];
              const col = barColors[i];
              return (
                <div key={i} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: "22px 18px", animation: `fadeUp .4s ease ${i * .07}s both`, position: "relative", overflow: "hidden", transition: "transform .13s ease-out, border-color .2s, box-shadow .25s" }}
                  onMouseMove={tiltMove}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = col + "66"; e.currentTarget.style.boxShadow = `0 14px 36px -16px ${col}`; }}
                  onMouseLeave={e => { tiltReset(e); e.currentTarget.style.borderColor = T.border; e.currentTarget.style.boxShadow = "none"; }}>
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: col, opacity: .7 }} />
                  <div style={{ fontFamily: T.serif, fontSize: isMobile ? 30 : 36, color: col, lineHeight: 1, marginBottom: 10 }}><CountUp value={f.stat} /></div>
                  <div style={{ fontSize: 13, color: T.textMid, lineHeight: 1.55, marginBottom: 12 }}>{f.desc}</div>
                  <div style={{ height: 3, background: T.surface, borderRadius: 4, marginBottom: 8, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${barWidths[i]}%`, background: col, borderRadius: 4, opacity: .6 }} />
                  </div>
                  <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, letterSpacing: .5 }}>
                    {f.url
                      ? <a href={f.url} target="_blank" rel="noopener noreferrer" style={{ color: T.textDim, textDecoration: "none" }} onMouseOver={e => e.currentTarget.style.color = T.cyan} onMouseOut={e => e.currentTarget.style.color = T.textDim}>Source: {f.source} ↗</a>
                      : `Source: ${f.source}`
                    }
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Divider />

      {/* ── CHECKS ── */}
      <section className="reveal" style={{ background: T.surface, padding: isMobile ? "56px 20px" : "72px 48px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <ChecksSection isMobile={isMobile} />
        </div>
      </section>

      <Divider />

      {/* ── FINAL CTA ── */}
      <section className="reveal" style={{ padding: isMobile ? "56px 20px" : "72px 48px", position: "relative", overflow: "hidden" }}>
        <div className="dot-grid" style={{ position: "absolute", inset: 0, opacity: .3, pointerEvents: "none" }} />
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center", position: "relative", background: "rgba(19,21,31,0.55)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", border: `1px solid ${T.cyan}26`, borderRadius: 16, boxShadow: `0 0 40px ${T.cyan}14`, padding: isMobile ? "32px 22px" : "44px 40px" }}>
          <h2 style={{ fontFamily: T.serif, fontSize: isMobile ? 28 : 40, color: T.text, marginBottom: 14, fontWeight: 400 }}>
            {t("finalcta.h2.a")}<br /><em style={{ color: T.cyan }}>{t("finalcta.h2.b")}</em>
          </h2>
          <p style={{ fontSize: isMobile ? 14 : 16, color: T.textMid, lineHeight: 1.7, maxWidth: HERO_COL, margin: "0 auto 32px", fontWeight: 300 }}>
            {t("finalcta.sub")}
          </p>
          <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: 10, justifyContent: "center" }}>
            <button onClick={() => { inputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }); setTimeout(() => inputRef.current?.focus(), 300); }} className="sheen"
              style={{ background: T.cyan, border: "none", borderRadius: 12, padding: "15px 28px", color: T.bg, fontFamily: T.sans, fontSize: 15, fontWeight: 700, cursor: "pointer", transition: "all .18s", boxShadow: `0 4px 24px ${T.cyanMid}` }}
              onMouseMove={e => { const r = e.currentTarget.getBoundingClientRect(); const dx = (e.clientX - (r.left + r.width / 2)) / r.width; const dy = (e.clientY - (r.top + r.height / 2)) / r.height; e.currentTarget.style.transform = `translate(${dx * 9}px, ${dy * 9}px)`; e.currentTarget.style.opacity = ".92"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translate(0,0)"; e.currentTarget.style.opacity = "1"; }}>
              {t("finalcta.scan")}
            </button>
            <button onClick={() => onAnalyze("DEMO", false, "btc")}
              style={{ background: "transparent", border: `1.5px solid ${T.border}`, borderRadius: 12, padding: "15px 28px", color: T.textMid, fontFamily: T.sans, fontSize: 15, fontWeight: 500, cursor: "pointer", transition: "all .18s" }}
              onMouseOver={e => { e.currentTarget.style.borderColor = T.cyan; e.currentTarget.style.color = T.cyan; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textMid; }}>
              {t("finalcta.sample")}
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter — captures audience for the case files / forensics content */}
      <div className="reveal" style={{ borderTop: `1px solid ${T.border}`, background: T.surface, padding: isMobile ? "32px 20px" : "44px 48px" }}>
        <div style={{ maxWidth: 520, margin: "0 auto" }}>
          <NewsletterSignup />
        </div>
      </div>

      {/* Footer */}
      <div style={{ borderTop: `1px solid ${T.border}`, padding: isMobile ? "18px 20px" : "16px 48px", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
          <span style={{ fontFamily: T.display, fontSize: 10, color: T.textDim, letterSpacing: 3 }}>ANONSCORE · MIT</span>
          <a href="https://github.com/netasset/anonscore" target="_blank" rel="noopener noreferrer"
            style={{ fontFamily: T.mono, fontSize: 10, color: T.cyan, textDecoration: "none" }}>GitHub ↗</a>
          <button onClick={() => setShowFunding(true)}
            style={{ background: "transparent", border: "none", padding: 0, fontFamily: T.mono, fontSize: 10, color: T.textMid, cursor: "pointer", textDecoration: "underline dotted", textUnderlineOffset: 3 }}
            onMouseOver={e => e.currentTarget.style.color = T.cyan}
            onMouseOut={e => e.currentTarget.style.color = T.textMid}>
            How we're paid for
          </button>
          <a href="/?page=wallets"
            style={{ fontFamily: T.mono, fontSize: 10, color: T.textMid, textDecoration: "underline dotted", textUnderlineOffset: 3, transition: "color .15s" }}
            onMouseOver={e => e.currentTarget.style.color = T.btc}
            onMouseOut={e => e.currentTarget.style.color = T.textMid}>
            Wallet directory
          </a>
          <a href="/?page=inspector"
            style={{ fontFamily: T.mono, fontSize: 10, color: T.textMid, textDecoration: "underline dotted", textUnderlineOffset: 3, transition: "color .15s" }}
            onMouseOver={e => e.currentTarget.style.color = T.cyan}
            onMouseOut={e => e.currentTarget.style.color = T.textMid}>
            Transaction Inspector
          </a>
          <a href="/?page=xpub"
            style={{ fontFamily: T.mono, fontSize: 10, color: T.textMid, textDecoration: "underline dotted", textUnderlineOffset: 3, transition: "color .15s" }}
            onMouseOver={e => e.currentTarget.style.color = T.cyan}
            onMouseOut={e => e.currentTarget.style.color = T.textMid}>
            Wallet scan (xpub)
          </a>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          {(FUNDING.lightning || FUNDING.nostr) && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              {FUNDING.lightning && (
                <button onClick={() => copyTip("⚡", FUNDING.lightning)}
                  title={`Lightning: ${FUNDING.lightning} — click to copy`}
                  style={{ background: "transparent", border: `1px solid ${T.ln}55`, borderRadius: 6, padding: "3px 8px", fontFamily: T.mono, fontSize: 10, color: T.ln, cursor: "pointer", letterSpacing: 0.5 }}>
                  {tipCopied === "⚡" ? "⚡ Copied!" : "⚡ Tip"}
                </button>
              )}
              {FUNDING.nostr && (
                <button onClick={() => copyTip("nostr", FUNDING.nostr)}
                  title={`Nostr: ${FUNDING.nostr} — click to copy`}
                  style={{ background: "transparent", border: `1px solid ${T.cyan}55`, borderRadius: 6, padding: "3px 8px", fontFamily: T.mono, fontSize: 10, color: T.cyan, cursor: "pointer", letterSpacing: 0.5 }}>
                  {tipCopied === "nostr" ? "Copied!" : "Zap on Nostr"}
                </button>
              )}
            </span>
          )}
          {/* OPNorange toolkit row — cross-tool nav */}
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.opn, boxShadow: `0 0 6px ${T.opn}`, flexShrink: 0 }} />
            <span style={{ fontFamily: T.mono, fontSize: 10, color: T.opn, letterSpacing: 0.5, fontWeight: 700 }}>{t("umbrella.privacy")}</span>
            <span style={{ color: T.borderLo }}>·</span>
            <a href="https://dcabutler.com" target="_blank" rel="noopener noreferrer"
              style={{ fontFamily: T.mono, fontSize: 10, color: T.textDim, textDecoration: "none", transition: "color .15s" }}
              onMouseOver={e => e.currentTarget.style.color = T.opn}
              onMouseOut={e => e.currentTarget.style.color = T.textDim}>{t("umbrella.dca")} ↗</a>
            <span style={{ color: T.borderLo }}>·</span>
            <a href="https://opnorange.com" target="_blank" rel="noopener noreferrer"
              style={{ fontFamily: T.mono, fontSize: 10, color: T.textDim, textDecoration: "none", transition: "color .15s" }}
              onMouseOver={e => e.currentTarget.style.color = T.opn}
              onMouseOut={e => e.currentTarget.style.color = T.textDim}>{t("umbrella.hub")} ↗</a>
          </span>
        </div>
      </div>
      {showFunding && <FundingDisclosure onClose={() => setShowFunding(false)} />}
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────
   SCANNING — with educational facts
───────────────────────────────────────────── */
function Scanning({ address, isLightning, dataReady }) {
  useLang(); // re-render on language change
  const [step, setStep] = useState(0);
  const intervalRef = useRef(null);

  const LN_STEPS = [
    { label: "Resolving node pubkey…",       fact: "Lightning node pubkeys are permanently public once announced to the gossip network." },
    { label: "Fetching node metadata…",      fact: "Your node alias, IP address, and connection info are visible to every peer on the network." },
    { label: "Loading open channels…",       fact: "Every channel open and close is recorded on-chain — permanently linking your Lightning and on-chain identities." },
    { label: "Identifying peer nodes…",      fact: "KYC exchanges operate Lightning nodes that log routing metadata for all channels they peer with." },
    { label: "Checking IP / Tor exposure…",  fact: "A clearnet Lightning node leaks your physical location and ISP to every peer you connect to." },
    { label: "Analysing channel diversity…", fact: "Nodes with few channels are easier to surveil — payment paths are predictable and limited." },
    { label: "Scoring capacity concentration…", fact: "If 80%+ of your capacity sits in one channel, your routing patterns are trivially predictable." },
    { label: "Checking alias privacy…",      fact: "Your node alias is broadcast to the entire network — using a real name links your identity to every channel." },
    { label: "Calculating privacy score…",   fact: "Score 0 = fully deanonymisable. Score 100 = anonymous-by-default node operation." },
  ];

  const steps = isLightning ? LN_STEPS : SCAN_STEPS;
  const accentColor = isLightning ? T.ln : T.cyan;
  const accentMid = isLightning ? T.lnMid : T.cyanMid;
  // Hold at 85% of steps until data is ready
  const holdStep = Math.floor(steps.length * 0.85);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setStep(s => {
        if (s >= holdStep && !dataReady) return s; // wait for data
        return Math.min(s + 1, steps.length - 1);
      });
    }, 380);
    return () => clearInterval(intervalRef.current);
  }, [steps.length, holdStep, dataReady]);

  // When data arrives, jump to final step immediately
  useEffect(() => {
    if (dataReady) setStep(steps.length - 1);
  }, [dataReady, steps.length]);

  const pct = Math.round((step / (steps.length - 1)) * 100);
  const currentFact = steps[step].fact;

  // Decorative scan mesh — 7 nodes around a center, with animated connecting lines + pulsing center halo
  const meshNodes = useMemo(() => {
    const cx = 90, cy = 60, r = 44;
    const pts = Array.from({ length: 6 }).map((_, i) => {
      const a = (Math.PI * 2 * i) / 6 - Math.PI / 2;
      return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
    });
    return { cx, cy, pts };
  }, []);

  return (
    <div role="main" aria-live="polite" aria-label={isLightning ? "Auditing Lightning node" : "Analyzing wallet"} style={{ minHeight: "100vh", background: "transparent", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, gap: 24, position: "relative", overflow: "hidden" }}>
      <div className="scan-ov" aria-hidden="true" />
      <h1 className="sr-only">{isLightning ? "Auditing Lightning node" : "Analyzing Bitcoin wallet"}</h1>
      {/* Decorative animated visual — bolt for Lightning, mesh for Bitcoin */}
      <div style={{ width: 180, height: 120, position: "relative" }} aria-hidden="true">
        {isLightning ? (
          <svg width="180" height="120" viewBox="0 0 180 120" style={{ overflow: "visible" }}>
            <defs>
              <filter id="boltGlow"><feGaussianBlur stdDeviation="4" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
            </defs>
            <path d="M100 10 L75 55 L95 55 L72 110 L115 50 L92 50 Z" fill={accentColor} opacity="0.9" filter="url(#boltGlow)"
              style={{ animation: "nodePulse 1.2s ease-in-out infinite" }} />
            {[0, 0.6].map(d => (
              <circle key={d} cx="90" cy="60" r="20" fill="none" stroke={accentColor} strokeWidth="1"
                style={{ animation: `scanRing 1.4s ease-out ${d}s infinite`, transformOrigin: "90px 60px" }} />
            ))}
          </svg>
        ) : (
          <svg width="180" height="120" viewBox="0 0 180 120" style={{ overflow: "visible" }}>
            {/* rotating radar sweep */}
            <defs>
              <linearGradient id="radarSweep" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor={accentColor} stopOpacity="0.32" />
                <stop offset="1" stopColor={accentColor} stopOpacity="0" />
              </linearGradient>
            </defs>
            <g style={{ animation: "spin 2.6s linear infinite", transformOrigin: "90px 60px" }}>
              <polygon points="90,60 134,60 126,34" fill="url(#radarSweep)" />
              <line x1="90" y1="60" x2="134" y2="60" stroke={accentColor} strokeWidth="1.5" strokeOpacity="0.75" />
            </g>
            {meshNodes.pts.map((p, i) => (
              <line key={`l${i}`} x1={meshNodes.cx} y1={meshNodes.cy} x2={p.x} y2={p.y}
                stroke={accentColor} strokeWidth="1"
                strokeDasharray="120" strokeDashoffset="120"
                style={{ animation: `scanLink 1.8s ease-out ${i * 0.18}s infinite`, opacity: 0.5 }} />
            ))}
            {meshNodes.pts.map((p, i) => (
              <circle key={`n${i}`} cx={p.x} cy={p.y} r="3.5"
                fill={accentColor}
                style={{ animation: `nodePulse 1.6s ease-in-out ${i * 0.15}s infinite`, transformOrigin: `${p.x}px ${p.y}px` }} />
            ))}
            {[0, 0.8].map(d => (
              <circle key={`ring${d}`} cx={meshNodes.cx} cy={meshNodes.cy} r="8" fill="none" stroke={accentColor} strokeWidth="1.5"
                style={{ animation: `scanRing 1.6s ease-out ${d}s infinite`, transformOrigin: `${meshNodes.cx}px ${meshNodes.cy}px` }} />
            ))}
            <circle cx={meshNodes.cx} cy={meshNodes.cy} r="6" fill={accentColor}
              style={{ filter: `drop-shadow(0 0 8px ${accentColor})` }} />
          </svg>
        )}
      </div>
      {/* Header */}
      <div style={{ textAlign: "center" }}>
        <div style={{ fontFamily: T.mono, fontSize: 10, color: accentColor, letterSpacing: 2, marginBottom: 12 }}>
          {isLightning ? t("scanning.ln.checks") : t("scanning.btc.checks")}
        </div>
        <div style={{ fontFamily: T.serif, fontSize: 26, color: T.text, marginBottom: 8, fontWeight: 400 }}>
          {isLightning ? t("scanning.ln.title") : t("scanning.btc.title")}
        </div>
        <div style={{ fontFamily: T.mono, fontSize: 11, color: T.textDim, letterSpacing: 1 }}>
          {address === "DEMO" || address === "DEMO_A" || address === "DEMO_LN" ? (isLightning ? "Demo Lightning node" : "Demo wallet") : fmt.addr(address)}
        </div>
      </div>

      {/* Progress */}
      <div style={{ width: "min(480px,90vw)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
          <span style={{ fontSize: 13, color: T.textMid }}>{steps[step].label}</span>
          <span style={{ fontFamily: T.mono, fontSize: 13, color: accentColor, fontWeight: 500 }}>{pct}%</span>
        </div>
        <div style={{ height: 3, background: T.surface, borderRadius: 4 }}>
          <div style={{ height: "100%", background: accentColor, borderRadius: 4, width: `${pct}%`, transition: "width .4s ease", boxShadow: `0 0 8px ${accentMid}` }} />
        </div>
      </div>

      {/* Steps log */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "min(480px,90vw)" }}>
        {steps.slice(0, step + 1).map((s, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", animation: "fadeIn .25s ease" }}>
            <span style={{ color: i < step ? T.green : accentColor, fontFamily: T.mono, fontSize: 11 }}>{i < step ? "✓" : "›"}</span>
            <span style={{ fontSize: 13, color: i < step ? T.textDim : T.text }}>{s.label}{i === step && <span className="blink" aria-hidden="true" style={{ color: accentColor, marginLeft: 3, fontFamily: T.mono }}>▍</span>}</span>
          </div>
        ))}
      </div>

      {/* Did you know */}
      <div key={step} style={{ width: "min(480px,90vw)", background: T.surface, border: `1px solid ${T.border}`, borderLeft: `3px solid ${accentColor}`, borderRadius: 10, padding: "14px 18px", animation: "factIn .4s ease both" }}>
        <div style={{ fontFamily: T.mono, fontSize: 9, color: accentColor, letterSpacing: 2, marginBottom: 6 }}>{t("scanning.didyouknow")}</div>
        <div style={{ fontSize: 13, color: T.textMid, lineHeight: 1.65 }}>{currentFact}</div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SCORE SPARKLINE — mini SVG history chart
───────────────────────────────────────────── */
function Sparkline({ history, width = 80, height = 28 }) {
  if (!history || history.length < 2) return null;
  const pts = history.slice(-8); // last 8 scans
  const max = Math.max(...pts, 1);
  const min = Math.max(0, Math.min(...pts) - 5);
  const range = max - min || 1;
  const xs = pts.map((_, i) => (i / (pts.length - 1)) * width);
  const ys = pts.map(v => height - ((v - min) / range) * height);
  const d = xs.map((x, i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${ys[i].toFixed(1)}`).join(" ");
  const lastColor = scoreColor(pts[pts.length - 1]);
  const trend = pts[pts.length - 1] - pts[0];
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2 }}>
      <svg width={width} height={height} style={{ overflow: "visible" }}>
        <defs>
          <linearGradient id="spkFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={lastColor} stopOpacity=".18" />
            <stop offset="100%" stopColor={lastColor} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={`${d} L${xs[xs.length-1].toFixed(1)},${height} L0,${height} Z`} fill="url(#spkFill)" />
        <path d={d} fill="none" stroke={lastColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ strokeDasharray: 220, animation: "lineIn 1.1s ease .2s both" }} />
        <circle cx={xs[xs.length-1]} cy={ys[ys.length-1]} r="2.5" fill={lastColor} />
      </svg>
      <span style={{ fontFamily: T.mono, fontSize: 8, color: trend > 0 ? T.green : trend < 0 ? T.red : T.textDim }}>
        {trend > 0 ? `↑ +${trend}` : trend < 0 ? `↓ ${trend}` : "↔"}
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SCORE BREAKDOWN — "show your work": how the score moved from 100.
   Answers the #1 question about any score ("why is it that number?").
   Renders a waterfall: start at 100, each penalty/bonus, end at the
   final score. Reads check.pts (now persisted by the engines).
───────────────────────────────────────────── */
function ScoreBreakdown({ checks, score, isMobile, simpleMode }) {
  // Only checks that actually moved the score, worst first.
  const movers = checks.filter(c => typeof c.pts === "number" && c.pts !== 0)
    .sort((a, b) => a.pts - b.pts);
  const penalties = movers.filter(c => c.pts < 0);
  const bonuses = movers.filter(c => c.pts > 0);
  const lost = penalties.reduce((a, c) => a + c.pts, 0);   // negative
  const gained = bonuses.reduce((a, c) => a + c.pts, 0);   // positive
  const raw = 100 + lost + gained;                         // pre-clamp arithmetic
  const col = scoreColor(score);
  const nameFor = (c) => { const s = SIMPLE.checks[c.key]; return simpleMode && s ? s.name : c.name; };

  const Row = ({ label, value, color, faded }) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "7px 0", borderTop: `1px solid ${T.borderLo}` }}>
      <span style={{ fontSize: 13, color: faded ? T.textDim : T.text, lineHeight: 1.4 }}>{label}</span>
      <span style={{ fontFamily: T.mono, fontSize: 13, fontWeight: 700, color, flexShrink: 0 }}>{value}</span>
    </div>
  );

  return (
    <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: isMobile ? 18 : 22, marginBottom: 12 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 12, flexWrap: "wrap", gap: 6 }}>
        <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, letterSpacing: 2 }}>HOW YOUR SCORE WAS CALCULATED</div>
        <div style={{ fontFamily: T.mono, fontSize: 10, color: T.textDim }}>
          every wallet starts at <span style={{ color: T.green }}>100</span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 4 : 24 }}>
        {/* Penalties column */}
        <div>
          <div style={{ fontFamily: T.mono, fontSize: 9, color: T.red, letterSpacing: 1.5, marginBottom: 2 }}>POINTS LOST{penalties.length ? ` (${lost})` : ""}</div>
          {penalties.length === 0
            ? <div style={{ fontSize: 12, color: T.textMid, padding: "8px 0" }}>Nothing — clean across every penalised check. 🎉</div>
            : penalties.map(c => <Row key={c.key} label={nameFor(c)} value={c.pts} color={T.red} />)}
        </div>
        {/* Bonuses column */}
        <div>
          <div style={{ fontFamily: T.mono, fontSize: 9, color: T.green, letterSpacing: 1.5, marginBottom: 2 }}>POINTS EARNED{bonuses.length ? ` (+${gained})` : ""}</div>
          {bonuses.length === 0
            ? <div style={{ fontSize: 12, color: T.textMid, padding: "8px 0" }}>No bonuses yet — CoinJoin usage earns points back.</div>
            : bonuses.map(c => <Row key={c.key} label={nameFor(c)} value={`+${c.pts}`} color={T.green} />)}
        </div>
      </div>

      {/* Total */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginTop: 14, paddingTop: 12, borderTop: `2px solid ${T.border}` }}>
        <span style={{ fontFamily: T.serif, fontSize: 16, color: T.text }}>Your score</span>
        <span style={{ fontFamily: T.serif, fontSize: 28, color: col, lineHeight: 1 }}>{score}<span style={{ fontFamily: T.mono, fontSize: 12, color: T.textDim }}>/100</span></span>
      </div>
      <div style={{ fontFamily: T.mono, fontSize: 10, color: T.textDim, marginTop: 8, lineHeight: 1.5 }}>
        100 {lost ? <>− {Math.abs(lost)} lost </> : ""}{gained ? <>+ {gained} earned </> : ""}= {raw}{raw !== score ? ` → ${score} (${raw < 0 ? "floored at 0" : "capped at 100"})` : ""}. Each penalty is recoverable — see the Fix It tab.
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   RADAR CHART — 11-axis privacy heuristic visualization
───────────────────────────────────────────── */
function RadarChart({ checks, size = 220 }) {
  const cx = size / 2, cy = size / 2, r = size * 0.38;
  const n = checks.length;
  if (n < 3) return null;
  const angle = (i) => (Math.PI * 2 * i) / n - Math.PI / 2;
  const pt = (i, pct) => ({
    x: cx + r * pct * Math.cos(angle(i)),
    y: cy + r * pct * Math.sin(angle(i)),
  });
  const statusPct = (s) => s === "pass" ? 1 : s === "warn" ? 0.55 : 0.15;
  const dataPoints = checks.map((c, i) => pt(i, statusPct(c.status)));
  const poly = dataPoints.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ") + " Z";
  const gridLevels = [0.25, 0.5, 0.75, 1];
  const labelR = r + 18;

  return (
    <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: "18px 10px 10px" }}>
      <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, letterSpacing: 2, marginBottom: 8, paddingLeft: 12 }}>PRIVACY RADAR</div>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block", margin: "0 auto" }}>
        {gridLevels.map(g => {
          const gPoly = checks.map((_, i) => pt(i, g)).map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ") + " Z";
          return <path key={g} d={gPoly} fill="none" stroke={T.border} strokeWidth=".5" />;
        })}
        {checks.map((_, i) => (
          <line key={i} x1={cx} y1={cy} x2={pt(i, 1).x} y2={pt(i, 1).y} stroke={T.borderLo} strokeWidth=".5" />
        ))}
        <path d={poly} fill={T.cyan + "18"} stroke={T.cyan} strokeWidth="1.5" strokeLinejoin="round" />
        {dataPoints.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3" fill={checks[i].status === "pass" ? T.green : checks[i].status === "warn" ? T.btc : T.red} />
        ))}
        {checks.map((c, i) => {
          const lp = { x: cx + labelR * Math.cos(angle(i)), y: cy + labelR * Math.sin(angle(i)) };
          const anchor = lp.x < cx - 5 ? "end" : lp.x > cx + 5 ? "start" : "middle";
          const shortName = c.name.split(" ").slice(0, 2).join(" ");
          return (
            <text key={i} x={lp.x} y={lp.y} textAnchor={anchor} dominantBaseline="central"
              style={{ fontFamily: T.mono, fontSize: 7, fill: c.status === "pass" ? T.green : c.status === "warn" ? T.btc : T.red }}>
              {shortName}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────
   PARTICLE CANVAS — animated network background
───────────────────────────────────────────── */
function ParticleCanvas({ width, height, color = T.cyan }) {
  const canvasRef = useRef(null);
  const particles = useRef([]);
  const raf = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const w = width || canvas.parentElement.offsetWidth;
    const h = height || canvas.parentElement.offsetHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.scale(dpr, dpr);

    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    const N = Math.min(40, Math.floor(w * h / 15000));
    const LINK_DIST = 120;
    particles.current = Array.from({ length: N }).map(() => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.5 + 0.5,
    }));

    let running = false;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const pts = particles.current;
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        for (let j = i + 1; j < pts.length; j++) {
          const q = pts[j];
          const dx = p.x - q.x, dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINK_DIST) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = color + Math.round((1 - dist / LINK_DIST) * 30).toString(16).padStart(2, "0");
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = color + "44";
        ctx.fill();
      }
      if (running) raf.current = requestAnimationFrame(draw);
    };
    const start = () => { if (running) return; running = true; raf.current = requestAnimationFrame(draw); };
    const stop = () => { running = false; if (raf.current) { cancelAnimationFrame(raf.current); raf.current = null; } };

    // Only animate while the canvas is on-screen — a continuous rAF loop for
    // a decorative background is wasted CPU/battery once scrolled past.
    let io = null;
    if (typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver((entries) => { entries[0].isIntersecting ? start() : stop(); });
      io.observe(canvas);
    } else {
      start();
    }
    return () => { stop(); if (io) io.disconnect(); };
  }, [width, height, color]);

  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />;
}

/* ─────────────────────────────────────────────
   FUNDING DISCLOSURE — public transparency about how AnonScore is paid for.
   Linked from the footer. Lists exactly which wallet recommendations are
   currently kicking a referral back to us (read from TOOL_AFFILIATE_URL).
───────────────────────────────────────────── */
function FundingDisclosure({ onClose }) {
  const affiliates = Object.keys(TOOL_AFFILIATE_URL);
  const dialogRef = useDialog(onClose);
  return (
    <div onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 950, background: "#000000aa", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-label="How we get paid" tabIndex={-1}
        onClick={e => e.stopPropagation()}
        style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 18, padding: 28, width: "min(560px,94vw)", maxHeight: "88vh", overflow: "auto", animation: "fadeUp .25s ease" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <div>
            <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, letterSpacing: 2 }}>TRANSPARENCY</div>
            <div style={{ fontFamily: T.serif, fontSize: 22, color: T.text, fontWeight: 400, marginTop: 4 }}>How AnonScore is paid for</div>
          </div>
          <button onClick={onClose} aria-label="Close" style={{ background: "transparent", border: `1px solid ${T.border}`, borderRadius: 8, padding: "6px 10px", color: T.textMid, cursor: "pointer" }}>✕</button>
        </div>
        <div style={{ fontSize: 14, color: T.textMid, lineHeight: 1.7, marginBottom: 14 }}>
          AnonScore is free for everyone and always will be. We don't run ads. We don't track you. We don't sell data. There is no account, no email required to scan.
        </div>
        <div style={{ fontSize: 13, color: T.textMid, lineHeight: 1.7, marginBottom: 14 }}>
          To keep the tool sustainable, we use three (only three) revenue sources:
        </div>
        <ol style={{ paddingLeft: 22, marginBottom: 18, color: T.textMid, fontSize: 13, lineHeight: 1.75 }}>
          <li style={{ marginBottom: 8 }}><strong style={{ color: T.text }}>Voluntary tips</strong> — Lightning and Nostr in the footer. Pay if it saved you trouble; ignore otherwise.</li>
          <li style={{ marginBottom: 8 }}><strong style={{ color: T.text }}>Affiliate referrals on wallet recommendations</strong> — when we link to a wallet or tool that offers a referral program, we may earn a small kickback. Recommendations are never changed to favour higher-paying tools; we recommend only what we'd use ourselves.</li>
          <li style={{ marginBottom: 8 }}><strong style={{ color: T.text }}>Grants and B2B audits</strong> — privacy-focused organizations and wallet companies sometimes pay for in-depth audits. The free tool you see is not affected.</li>
        </ol>
        <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: 16, marginBottom: 14 }}>
          <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, letterSpacing: 2, marginBottom: 8 }}>CURRENT AFFILIATE LIST</div>
          {affiliates.length === 0
            ? <div style={{ fontSize: 13, color: T.textMid, lineHeight: 1.6 }}>
                <strong style={{ color: T.green }}>None right now.</strong> Every wallet link on this site goes directly to the project's official homepage with no kickback to us. If that changes, the tool will be listed here, and each affiliate link will be tagged "↗ affiliate" next to the tool name.
              </div>
            : <ul style={{ fontSize: 13, color: T.textMid, lineHeight: 1.7, paddingLeft: 18 }}>
                {affiliates.map(name => (
                  <li key={name}><a href={TOOL_AFFILIATE_URL[name]} target="_blank" rel="noopener noreferrer nofollow" style={{ color: T.cyan, textDecoration: "underline" }}>{name}</a></li>
                ))}
              </ul>}
        </div>
        <div style={{ fontSize: 12, color: T.textDim, lineHeight: 1.6 }}>
          Source code is on <a href="https://github.com/netasset/anonscore" target="_blank" rel="noopener noreferrer" style={{ color: T.cyan, textDecoration: "underline" }}>GitHub</a>. The affiliate list above is generated directly from a single config object — anyone can verify it.
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   NEWSLETTER SIGNUP — minimal form, POSTs to NEWSLETTER.endpoint when set.
   Until then, falls back to a clean mailto: link so it still works.
───────────────────────────────────────────── */
function NewsletterSignup({ compact = false }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | submitting | ok | err
  const [error, setError] = useState("");
  const submit = async (e) => {
    e?.preventDefault();
    const v = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) { setError("Enter a valid email."); return; }
    setStatus("submitting"); setError("");
    if (NEWSLETTER.endpoint) {
      try {
        const fd = new FormData(); fd.append("email", v);
        const r = await fetch(NEWSLETTER.endpoint, { method: "POST", body: fd, mode: "no-cors" });
        // no-cors gives us an opaque response; assume success unless network error fires
        setStatus("ok");
      } catch { setStatus("err"); setError("Couldn't reach the newsletter service — try again later."); }
    } else {
      // Graceful fallback: open the user's mail client pre-addressed
      window.location.href = `mailto:${NEWSLETTER.fallbackMailto}?subject=${encodeURIComponent("Newsletter subscribe")}&body=${encodeURIComponent(v)}`;
      setStatus("ok");
    }
  };
  if (status === "ok") return (
    <div style={{ background: T.greenLo, border: `1px solid ${T.green}33`, borderRadius: 12, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{ color: T.green, fontSize: 18 }}>✓</span>
      <div style={{ fontSize: 13, color: T.text }}>Got it — you'll receive the next issue.</div>
    </div>
  );
  const inputId = compact ? "nl-email-compact" : "nl-email";
  return (
    <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {!compact && (
        <>
          <div style={{ fontFamily: T.serif, fontSize: 22, color: T.text, fontWeight: 400 }}>
            {NEWSLETTER.name}
          </div>
          <div style={{ fontSize: 13, color: T.textMid, lineHeight: 1.6, marginBottom: 4 }}>{NEWSLETTER.pitch}</div>
        </>
      )}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <label htmlFor={inputId} className="sr-only">Email address</label>
        <input id={inputId} type="email" value={email} onChange={e => { setEmail(e.target.value); setError(""); }}
          placeholder="you@somewhere.zone"
          required aria-invalid={!!error}
          style={{ flex: 1, minWidth: 200, background: T.surface, border: `1.5px solid ${error ? T.red : T.border}`, borderRadius: 10, padding: "11px 14px", color: T.text, fontFamily: T.mono, fontSize: 13, outline: "none", transition: "border .15s, box-shadow .2s" }}
          onFocus={e => { e.target.style.borderColor = T.cyan; e.target.style.boxShadow = `0 0 0 3px ${T.cyan}22`; }}
          onBlur={e => { e.target.style.borderColor = error ? T.red : T.border; e.target.style.boxShadow = "0 0 0 0 transparent"; }} />
        <button type="submit" disabled={status === "submitting"}
          style={{ background: T.cyan, border: "none", borderRadius: 10, padding: "11px 18px", color: T.bg, fontFamily: T.sans, fontWeight: 700, fontSize: 13, cursor: status === "submitting" ? "wait" : "pointer", opacity: status === "submitting" ? 0.6 : 1, whiteSpace: "nowrap" }}>
          {status === "submitting" ? "…" : "Subscribe"}
        </button>
      </div>
      {error && <div role="alert" style={{ fontSize: 11, color: T.red }}>{error}</div>}
      <div style={{ fontSize: 10, color: T.textDim, lineHeight: 1.5 }}>
        No spam. Unsubscribe link in every issue. We never link your email to a scanned address.
      </div>
    </form>
  );
}

/* ─────────────────────────────────────────────
   TRANSACTION INSPECTOR — standalone tool at /?page=inspector. Paste a PSBT or
   raw tx your wallet is about to sign and see what it leaks BEFORE you broadcast.
   PSBT/raw-hex are parsed and analyzed entirely in the browser (zero network).
───────────────────────────────────────────── */
function TransactionInspector({ onBack, isMobile, onScan }) {
  useLang();
  const [raw, setRaw] = useState("");
  const [result, setResult] = useState(null);   // { kind, tx }
  const [error, setError] = useState("");
  const detected = detectTxInput(raw);

  useEffect(() => {
    const prev = document.title;
    document.title = "Transaction Inspector — pre-broadcast privacy check — AnonScore";
    const desc = document.querySelector('meta[name="description"]');
    const prevDesc = desc?.getAttribute("content");
    desc?.setAttribute("content", "Paste a PSBT or raw Bitcoin transaction and see exactly what it will leak — before you broadcast. Runs entirely in your browser; nothing is sent anywhere. Free and open source.");
    return () => { document.title = prev; if (desc && prevDesc) desc.setAttribute("content", prevDesc); };
  }, []);

  const inspect = (text) => {
    const input = text != null ? text : raw;
    setError(""); setResult(null);
    try {
      const parsed = parseTransactionInput(input);
      if (parsed.kind === "txid") { setError("Pasting a txid looks up a confirmed transaction — that path is coming soon. For now paste a PSBT (base64) or raw transaction hex, which are analyzed fully offline."); return; }
      setResult(parsed);
    } catch (e) { setError(e && e.message ? e.message : "Couldn't parse that input."); }
  };
  const loadDemo = () => { setRaw(DEMO_PSBT); inspect(DEMO_PSBT); };

  const sats = v => v == null ? "—" : v >= 1e8 ? "₿" + (v / 1e8).toFixed(4) : v.toLocaleString() + " sats";
  const trunc = a => !a ? "—" : a.startsWith("script:") ? "unrecognized script" : a.length > 26 ? a.slice(0, 13) + "…" + a.slice(-6) : a;

  const label = { fontFamily: T.mono, fontSize: 9, color: T.textDim, letterSpacing: 1.5, marginBottom: 8 };
  const panel = extra => ({ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: isMobile ? "16px 18px" : "18px 22px", ...extra });

  // ---- report ----
  let report = null;
  if (result) {
    const tx = result.tx;
    const a = analyzeTx(tx);
    const change = guessChange(tx);
    const clus = clusterUnification(tx);
    const fr = feeRate(tx);
    const link = txLinkability(tx);
    const ent = link.available ? (link.N === 1 ? { c: T.red, t: "Fully deterministic" } : link.entropy < 1 ? { c: T.red, t: "Very low ambiguity" } : link.entropy < 1.585 ? { c: T.amber, t: "Low ambiguity" } : link.entropy < 3 ? { c: T.cyan, t: "Ambiguous" } : { c: T.green, t: "Strongly ambiguous" }) : null;
    const fp = fingerprintTx(tx);
    const lpCell = v => Math.abs(v - 1) < 1e-9 ? { bg: T.red, fg: T.bg, txt: "1" } : v === 0 ? { bg: T.surface, fg: T.textDim, txt: "0" } : { bg: T.red + Math.round(18 + v * 60).toString(16).padStart(2, "0"), fg: T.text, txt: v.toFixed(2).replace(/^0/, "") };
    const inAddrs = new Set((tx.vin || []).map(v => v.prevout && v.prevout.scriptpubkey_address).filter(Boolean));
    const outColor = (o, i) => _txDust(o) ? T.red : (o.scriptpubkey_address && inAddrs.has(o.scriptpubkey_address)) ? T.red
      : _txOpReturn(o) ? T.textDim : (change && change.index === i) ? T.cyan : _txRound(o.value) ? T.btc : T.textMid;
    const outNote = (o, i) => _txDust(o) ? "dust" : (o.scriptpubkey_address && inAddrs.has(o.scriptpubkey_address)) ? "reuse"
      : _txOpReturn(o) ? "data" : (change && change.index === i) ? "likely change" : _txRound(o.value) ? "round" : "payment";
    // Original output indices deterministically linked (LP=1) to some input — i.e.
    // provably funded by this tx's inputs, the concrete face of the entropy metric.
    const detOut = new Set();
    if (link.available) link.lp.forEach(row => row.forEach((v, j) => { if (Math.abs(v - 1) < 1e-9) detOut.add(link.outIdx[j]); }));

    report = (
      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 20, animation: "fadeUp .4s ease both" }}>
        {/* verdict */}
        <div style={{ background: a.leaky ? T.red + "10" : T.green + "12", border: `1px solid ${a.leaky ? T.red + "40" : T.green + "45"}`, borderRadius: 16, padding: isMobile ? "16px 18px" : "18px 22px" }}>
          <div style={{ ...label, color: a.leaky ? T.red : T.green }}>PRE-BROADCAST VERDICT</div>
          <div style={{ fontFamily: T.serif, fontSize: isMobile ? 18 : 21, color: T.text, fontWeight: 400, marginBottom: a.findings.length ? 12 : 0 }}>
            {a.leaky ? "This transaction leaks — you can still fix it before broadcasting." : "Clean — nothing in this transaction obviously links or identifies you."}
          </div>
          {a.findings.length > 0 && (
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 7, padding: 0, margin: 0 }}>
              {a.findings.map((f, i) => (
                <li key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 13, color: T.textMid, lineHeight: 1.5 }}>
                  <span style={{ color: f.ok ? T.green : T.red, flexShrink: 0, marginTop: 1, fontFamily: T.mono }}>{f.ok ? "✓" : "→"}</span>{f.t}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* interpretation entropy / linkability (Boltzmann) */}
        {link.available && (
          <div style={panel({ borderColor: ent.c + "33" })}>
            <div style={{ ...label, color: ent.c }}>INTERPRETATION ENTROPY</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap", marginBottom: 10 }}>
              <span style={{ fontFamily: T.serif, fontSize: isMobile ? 26 : 32, color: ent.c, fontWeight: 400 }}>{link.entropy.toFixed(2)}<span style={{ fontSize: 13, color: T.textDim, marginLeft: 4 }}>bits</span></span>
              <span style={{ fontFamily: T.sans, fontSize: 14, color: T.text, fontWeight: 600 }}>{ent.t}</span>
              <span style={{ fontFamily: T.mono, fontSize: 10, color: T.textDim, marginLeft: "auto" }}>{link.N.toLocaleString()} interpretation{link.N !== 1 ? "s" : ""}</span>
            </div>
            <div style={{ fontSize: 13, color: T.textMid, lineHeight: 1.6, marginBottom: link.dl > 0 ? 12 : 0 }}>
              {link.N === 1
                ? "There is exactly one way to read this transaction — every input maps to every output with certainty. An analyst needs no guesswork; the whole trail is provable."
                : "There are " + link.N.toLocaleString() + " equally-valid ways to map these inputs to these outputs (E = log₂N). The more readings, the less any single input→output link can be proven — this is the metric KYCP.org and OXT scored before they went dark."}
            </div>
            {link.dl > 0 && (
              <div style={{ background: T.red + "10", border: `1px solid ${T.red}33`, borderRadius: 10, padding: "9px 12px", fontSize: 12.5, color: T.textMid, lineHeight: 1.6 }}>
                <strong style={{ color: T.red }}>{link.dl} deterministic link{link.dl !== 1 ? "s" : ""}</strong> — pairing{link.dl !== 1 ? "s" : ""} that hold{link.dl === 1 ? "s" : ""} in <em>every</em> interpretation, so it is provable on-chain which input funded which output. This is precisely what surveillance clustering exploits.
              </div>
            )}
            {link.n * link.m <= 64 && (
              <div style={{ marginTop: 12, overflowX: "auto" }}>
                <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, letterSpacing: 1, marginBottom: 6 }}>LINK PROBABILITY · rows = inputs · cols = outputs</div>
                <div style={{ display: "inline-grid", gridTemplateColumns: `auto repeat(${link.m}, minmax(30px, 1fr))`, gap: 3 }}>
                  <span />
                  {link.outIdx.map((oi, j) => <span key={"h" + j} style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, textAlign: "center", alignSelf: "end", paddingBottom: 2 }}>o{oi + 1}</span>)}
                  {link.lp.map((row, i) => [
                    <span key={"r" + i} style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, alignSelf: "center", paddingRight: 4 }}>in{i + 1}</span>,
                    ...row.map((v, j) => { const c = lpCell(v); return <span key={i + "-" + j} title={"P(input " + (i + 1) + " → output " + (link.outIdx[j] + 1) + ") = " + v.toFixed(3)} style={{ background: c.bg, color: c.fg, fontFamily: T.mono, fontSize: 10, textAlign: "center", padding: "6px 2px", borderRadius: 4, minWidth: 30 }}>{c.txt}</span>; })
                  ])}
                </div>
              </div>
            )}
          </div>
        )}
        {!link.available && (link.reason === "too-many" || link.reason === "iteration-cap") && (
          <div style={panel()}>
            <div style={{ ...label, color: T.green }}>INTERPRETATION ENTROPY</div>
            <div style={{ fontSize: 13, color: T.textMid, lineHeight: 1.6 }}>
              {link.reason === "too-many"
                ? "This transaction has " + link.n + " inputs and " + link.m + " outputs — beyond the 12×12 limit for exact link analysis (the same bound the reference Boltzmann tool uses). Very large transactions have astronomically many interpretations, which on its own means strong ambiguity."
                : "This transaction has too many valid interpretations to count exactly in the browser — which itself signals very high entropy and strong input→output ambiguity (typical of a CoinJoin)."}
            </div>
          </div>
        )}

        {/* wallet fingerprint */}
        {fp.available && fp.signals.length > 0 && (
          <div style={panel({ borderColor: fp.distinctive > 0 ? T.amber + "33" : T.border })}>
            <div style={{ ...label, color: fp.distinctive > 0 ? T.amber : T.textDim }}>WALLET FINGERPRINT</div>
            <div style={{ fontSize: 13, color: T.textMid, lineHeight: 1.6, marginBottom: 12 }}>
              {fp.distinctive > 0
                ? "Your transaction's structure is a fingerprint — it links your transactions to one wallet and narrows which software you run. " + (fp.guess || "")
                : "Your transaction follows common defaults — good: structurally it doesn't stand out. " + (fp.guess || "")}
            </div>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 7, padding: 0, margin: 0 }}>
              {fp.signals.map((s, i) => (
                <li key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 12.5, color: T.textMid, lineHeight: 1.55 }}>
                  <span style={{ color: s.distinctive ? T.amber : T.green, flexShrink: 0, marginTop: 1, fontFamily: T.mono }}>{s.distinctive ? "◆" : "✓"}</span>{s.t}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* likely change */}
        {change && (
          <div style={panel()}>
            <div style={label}>LIKELY CHANGE OUTPUT</div>
            <div style={{ fontSize: 13.5, color: T.textMid, lineHeight: 1.6 }}>
              Output <strong style={{ color: T.cyan }}>#{change.index + 1}</strong> ({sats(tx.vout[change.index].value)}) is most likely your <strong style={{ color: T.text }}>change</strong> — {change.reason}. <span style={{ color: T.textDim }}>Confidence: {change.confidence}.</span> Anyone reading the chain makes the same guess, then keeps following your coins.
            </div>
          </div>
        )}

        {/* cluster unification */}
        {clus.addrs.length > 1 && (
          <div style={panel({ borderColor: T.red + "33" })}>
            <div style={{ ...label, color: T.red }}>CLUSTER THIS SPEND CREATES</div>
            <div style={{ fontSize: 13.5, color: T.textMid, lineHeight: 1.6, marginBottom: 10 }}>
              Broadcasting fuses these <strong style={{ color: T.text }}>{clus.addrs.length} input addresses</strong>{clus.distinctTypes > 1 ? ` (${clus.distinctTypes} script types)` : ""} into one provable identity — the common-input heuristic every chain-surveillance firm runs.
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {clus.addrs.slice(0, 6).map(ad => (
                <div key={ad} style={{ display: "flex", alignItems: "center", gap: 10, background: T.surface, border: `1px solid ${T.borderLo}`, borderRadius: 10, padding: "8px 12px" }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: T.red, flexShrink: 0 }} />
                  <span style={{ fontFamily: T.mono, fontSize: 12, color: T.text, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis" }}>{trunc(ad)}</span>
                  {onScan && isValidBitcoinAddress(ad) && (
                    <button onClick={() => onScan(ad)} style={{ marginLeft: "auto", flexShrink: 0, background: "transparent", border: `1px solid ${T.cyan}55`, borderRadius: 8, padding: "5px 12px", color: T.cyan, fontFamily: T.sans, fontSize: 12, fontWeight: 600, cursor: "pointer" }}
                      onMouseOver={e => e.currentTarget.style.background = T.cyan + "14"} onMouseOut={e => e.currentTarget.style.background = "transparent"}>Audit →</button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* inputs → outputs */}
        <div style={panel()}>
          <div style={label}>INPUTS → OUTPUTS</div>
          {tx.partial && (
            <div style={{ fontSize: 12, color: T.amber, background: T.amber + "12", border: `1px solid ${T.amber}33`, borderRadius: 8, padding: "8px 12px", marginBottom: 12, lineHeight: 1.5 }}>
              {result.kind === "rawhex" ? "Raw hex carries no input data — paste the PSBT for full input-side analysis (cluster + fee)." : "Partial PSBT — some inputs lack UTXO data, so the fee and input analysis cover only the known inputs."}
            </div>
          )}
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr auto 1fr", gap: isMobile ? 12 : 16, alignItems: "start" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {(tx.vin || []).map((v, i) => (
                <div key={i} style={{ fontFamily: T.mono, fontSize: 11.5, color: T.textMid, background: T.surface, border: `1px solid ${T.borderLo}`, borderRadius: 8, padding: "7px 10px" }}>
                  <div style={{ color: T.text }}>{v.prevout ? trunc(v.prevout.scriptpubkey_address) : "input " + (i + 1) + " (no UTXO data)"}</div>
                  <div style={{ color: T.textDim, fontSize: 10, marginTop: 2 }}>{v.prevout ? sats(v.prevout.value) + " · " + v.prevout.scriptpubkey_type : "unknown"}</div>
                </div>
              ))}
            </div>
            <div style={{ display: isMobile ? "none" : "flex", alignItems: "center", justifyContent: "center", color: T.textDim, fontSize: 18, alignSelf: "center" }}>→</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {(tx.vout || []).map((o, i) => (
                <div key={i} style={{ fontFamily: T.mono, fontSize: 11.5, background: T.surface, border: `1px solid ${outColor(o, i)}44`, borderLeft: `3px solid ${outColor(o, i)}`, borderRadius: 8, padding: "7px 10px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                    <span style={{ color: T.text, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis" }}>{trunc(o.scriptpubkey_address)}</span>
                    <span style={{ color: outColor(o, i), flexShrink: 0, fontSize: 9 }}>{outNote(o, i)}</span>
                  </div>
                  <div style={{ color: T.textDim, fontSize: 10, marginTop: 2 }}>{sats(o.value)} · {o.scriptpubkey_type}</div>
                  {detOut.has(i) && <div style={{ color: T.red, fontSize: 9, marginTop: 3, letterSpacing: .3 }}>⛓ provably from these inputs</div>}
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14, alignItems: "center" }}>
            {fr && <Tag label={"≈ " + fr.rate + " sat/vB" + (fr.estimated ? " (est)" : "")} color={T.textMid} size={9} />}
            {tx.fee != null && <Tag label={"fee " + sats(tx.fee)} color={T.textMid} size={9} />}
            {a.coinjoin && <Tag label="CoinJoin shape" color={T.green} size={9} />}
            <span style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, marginLeft: "auto" }}>{(tx.vin || []).length} in · {(tx.vout || []).length} out{tx.txid ? "" : " · unsigned"}</span>
          </div>
        </div>

        <div style={{ fontSize: 11.5, color: T.textDim, lineHeight: 1.6, textAlign: "center" }}>
          Heuristics, not proof — PayJoin and batching can change these readings. This transaction was analyzed entirely in your browser; nothing was sent anywhere.
        </div>
      </div>
    );
  }

  return (
    <div role="main" aria-label="Transaction Inspector" style={{ minHeight: "100vh", background: "transparent", display: "flex", flexDirection: "column" }}>
      <h1 className="sr-only">Bitcoin Transaction Inspector — pre-broadcast privacy analysis</h1>
      <nav style={{ display: "flex", alignItems: "center", gap: 10, padding: isMobile ? "12px 16px" : "14px 32px", borderBottom: `1px solid ${T.border}`, background: T.bg, position: "sticky", top: 0, zIndex: 100 }}>
        <button onClick={onBack} style={{ background: "transparent", border: `1.5px solid ${T.border}`, borderRadius: 8, padding: "7px 12px", color: T.textMid, fontFamily: T.sans, fontSize: 13, cursor: "pointer", transition: "border .15s" }}
          onMouseOver={e => e.currentTarget.style.borderColor = T.cyan} onMouseOut={e => e.currentTarget.style.borderColor = T.border}>← Back</button>
        <div style={{ fontFamily: T.display, fontSize: 15, letterSpacing: 4, fontWeight: 700 }}>ANON<span style={{ color: T.cyan }}>SCORE</span></div>
        <div style={{ flex: 1 }} />
        <span style={{ fontFamily: T.mono, fontSize: 9, color: T.cyan, background: T.cyanLo, border: `1px solid ${T.cyan}44`, borderRadius: 6, padding: "4px 9px", letterSpacing: 1 }}>INSPECTOR</span>
      </nav>

      <div style={{ flex: 1, maxWidth: 760, margin: "0 auto", width: "100%", padding: isMobile ? "28px 16px" : "44px 32px" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontFamily: T.mono, fontSize: 10, color: T.cyan, letterSpacing: 2.5, marginBottom: 14 }}>BEFORE YOU BROADCAST</div>
          <h2 style={{ fontFamily: T.serif, fontSize: isMobile ? 30 : 40, color: T.text, lineHeight: 1.1, fontWeight: 400, marginBottom: 14 }}>
            See what your transaction<br /><em style={{ color: T.cyan }}>leaks — before it's permanent.</em>
          </h2>
          <p style={{ fontSize: isMobile ? 14 : 16, color: T.textMid, lineHeight: 1.7, maxWidth: 560, margin: "0 auto", fontWeight: 300 }}>
            Paste a <strong style={{ color: T.text }}>PSBT</strong> or raw transaction your wallet is about to sign. Every scan runs entirely in your browser — the transaction is never sent anywhere.
          </p>
        </div>

        <div style={{ background: T.card, border: `1.5px solid ${detected ? T.cyan + "55" : T.border}`, borderRadius: 16, padding: isMobile ? "16px" : "20px 22px", transition: "border .2s" }}>
          <label htmlFor="tx-input" style={{ display: "block", fontFamily: T.mono, fontSize: 9, color: T.textDim, letterSpacing: 1.5, marginBottom: 8 }}>PSBT (BASE64) · RAW TX HEX · TXID</label>
          <textarea id="tx-input" value={raw} onChange={e => { setRaw(e.target.value); setError(""); }}
            placeholder="cHNidP8B…  or  0200000001…"
            aria-label="Paste a PSBT (base64), raw transaction hex, or a transaction id"
            spellCheck={false}
            style={{ width: "100%", boxSizing: "border-box", minHeight: 120, resize: "vertical", background: "#070910", border: `1px solid ${T.border}`, borderRadius: 10, padding: "12px 14px", color: T.text, fontFamily: T.mono, fontSize: 12.5, lineHeight: 1.5, outline: "none" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
            <button onClick={() => inspect()} disabled={!raw.trim()} className="sheen"
              style={{ background: raw.trim() ? T.cyan : T.surface, border: "none", borderRadius: 10, padding: "12px 22px", color: raw.trim() ? T.bg : T.textDim, fontFamily: T.sans, fontWeight: 700, fontSize: 14, cursor: raw.trim() ? "pointer" : "default", transition: "all .15s" }}>
              Inspect →
            </button>
            <button onClick={loadDemo} style={{ background: "transparent", border: `1px solid ${T.border}`, borderRadius: 10, padding: "12px 16px", color: T.textMid, fontFamily: T.sans, fontSize: 13, cursor: "pointer" }}
              onMouseOver={e => e.currentTarget.style.borderColor = T.cyan} onMouseOut={e => e.currentTarget.style.borderColor = T.border}>Load example PSBT</button>
            {detected && <span style={{ fontFamily: T.mono, fontSize: 10, color: T.cyan }}>{detected === "psbt" ? "✓ PSBT detected" : detected === "rawhex" ? "✓ raw tx hex" : "txid — fetch coming soon"}</span>}
          </div>
        </div>

        {error && (
          <div role="alert" style={{ marginTop: 14, background: T.red + "12", border: `1px solid ${T.red}44`, borderRadius: 12, padding: "12px 16px", fontSize: 13, color: T.text, lineHeight: 1.6 }}>
            <span style={{ color: T.red, fontFamily: T.mono, marginRight: 6 }}>⚠</span>{error}
          </div>
        )}

        {report}

        {!result && !error && (
          <div style={{ marginTop: 20, fontSize: 12.5, color: T.textDim, lineHeight: 1.7, textAlign: "center" }}>
            Export a PSBT from Sparrow, Electrum, Bitcoin Core, or a hardware wallet — before you sign it — and drop it here. No keys, no signing, nothing leaves the page.
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   XPUB WALLET SCAN — standalone tool at /?page=xpub. Paste an xpub/ypub/zpub,
   derive + gap-limit scan the whole wallet client-side, score it wallet-level.
───────────────────────────────────────────── */
function XpubScan({ onBack, isMobile, onScan }) {
  useLang();
  const [raw, setRaw] = useState("");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(null);   // { derived, used }
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const detected = detectXpub(raw);

  useEffect(() => {
    const prev = document.title;
    document.title = "Wallet Privacy Scan (xpub) — AnonScore";
    const desc = document.querySelector('meta[name="description"]');
    const prevDesc = desc?.getAttribute("content");
    desc?.setAttribute("content", "Paste an xpub/ypub/zpub and audit your entire Bitcoin wallet's privacy — every address derived and scanned in your browser. Free, open source.");
    return () => { document.title = prev; if (desc && prevDesc) desc.setAttribute("content", prevDesc); };
  }, []);

  const runScan = async () => {
    setError(""); setResult(null); setProgress({ derived: 0, used: 0 }); setBusy(true);
    try {
      const scan = await scanXpub(raw.trim(), { onProgress: p => setProgress({ derived: p.derived, used: p.used }) });
      setResult(runWalletEngine(scan));
    } catch (e) {
      setError(e && e.message ? e.message : "Couldn't scan that key.");
    } finally { setBusy(false); setProgress(null); }
  };
  const loadDemo = () => { setError(""); setBusy(false); setProgress(null); setResult(runWalletEngine(DEMO_WALLET)); };

  const sats = v => v == null ? "—" : v >= 1e8 ? "₿" + (v / 1e8).toFixed(4) : v.toLocaleString() + " sats";
  const trunc = a => !a ? "—" : a.length > 24 ? a.slice(0, 12) + "…" + a.slice(-6) : a;
  const label = { fontFamily: T.mono, fontSize: 9, color: T.textDim, letterSpacing: 1.5, marginBottom: 8 };
  const panel = extra => ({ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: isMobile ? "16px 18px" : "18px 22px", ...extra });

  let report = null;
  if (result) {
    const r = result;
    if (r.isEmpty) {
      report = (
        <div style={{ ...panel(), marginTop: 20, textAlign: "center", animation: "fadeUp .4s ease both" }}>
          <div style={{ fontFamily: T.serif, fontSize: 20, color: T.text, marginBottom: 8 }}>No used addresses found</div>
          <div style={{ fontSize: 13.5, color: T.textMid, lineHeight: 1.6 }}>We derived and checked {r.stats.addresses} addresses from this key and none had any on-chain history — an unused (or freshly created) wallet has nothing for an analyst to read.{r.capHit ? " (Scan hit the address cap.)" : ""}</div>
        </div>
      );
    } else {
      const tiles = [
        { k: "USED ADDRESSES", v: r.stats.used, c: T.cyan },
        { k: "REUSED", v: r.stats.reused, c: r.stats.reused ? T.red : T.green },
        { k: "BALANCE", v: sats(r.stats.balance), c: T.blue },
      ];
      report = (
        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 20, animation: "fadeUp .4s ease both" }}>
          {/* score header */}
          <div style={{ ...panel(), display: "flex", gap: isMobile ? 14 : 22, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ flexShrink: 0 }}><ScoreRing score={r.score} size={isMobile ? 96 : 118} /></div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ fontFamily: T.serif, fontSize: isMobile ? 22 : 26, color: r.riskColor, fontWeight: 400 }}>Grade {r.grade} · {r.riskLabel}</div>
              <div style={{ fontSize: 13, color: T.textMid, lineHeight: 1.6, marginTop: 4 }}>Wallet-level privacy across {r.stats.used} used address{r.stats.used !== 1 ? "es" : ""} ({r.stats.addresses} derived & checked).</div>
              <div style={{ display: "flex", gap: 18, marginTop: 12, flexWrap: "wrap" }}>
                {tiles.map(t => (
                  <div key={t.k}>
                    <div style={{ fontFamily: T.mono, fontSize: 8, color: T.textDim, letterSpacing: 1.5 }}>{t.k}</div>
                    <div style={{ fontFamily: T.serif, fontSize: 17, color: t.c, lineHeight: 1.1, marginTop: 2 }}>{t.v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {r.capHit && <div style={{ fontFamily: T.mono, fontSize: 11, color: T.amber, background: T.amber + "12", border: `1px solid ${T.amber}33`, borderRadius: 8, padding: "8px 12px" }}>Scan reached the {r.stats.addresses}-address cap — a very large wallet may have more history than shown.</div>}
          <div style={panel()}><div style={label}>HOW THE WALLET SCORES</div><ScoreBreakdown checks={r.checks} score={r.score} isMobile={isMobile} simpleMode={false} /></div>
          {r.checks.length >= 3 && <div style={{ ...panel(), display: "flex", justifyContent: "center" }}><RadarChart checks={r.checks} size={isMobile ? 200 : 240} /></div>}
          {/* recommendations */}
          {r.recommendations.length > 0 && (
            <div style={panel()}>
              <div style={label}>TOP FIXES</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {r.recommendations.map((rec, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <span style={{ fontSize: 18, flexShrink: 0 }}>{rec.icon}</span>
                    <div><div style={{ fontFamily: T.serif, fontSize: 16, color: T.text }}>{rec.action} <span style={{ fontFamily: T.serif, fontSize: 13, color: T.green }}>+{rec.impact}</span></div>
                      <div style={{ fontSize: 12.5, color: T.textMid, lineHeight: 1.55, marginTop: 3 }}>{rec.plain}</div></div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* per-address table */}
          <div style={panel()}>
            <div style={label}>ADDRESSES ({r.perAddress.length} used)</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {r.perAddress.map(a => {
                const bal = (a.utxos || []).reduce((s, u) => s + (u.value || 0), 0);
                const reused = (a.chain_stats.funded_txo_count || 0) >= 2;
                return (
                  <div key={a.address} style={{ display: "flex", alignItems: "center", gap: 10, background: T.surface, border: `1px solid ${reused ? T.red + "33" : T.borderLo}`, borderRadius: 10, padding: "8px 12px", flexWrap: "wrap" }}>
                    <span style={{ fontFamily: T.mono, fontSize: 8, color: T.textDim }}>{a.branch === 1 ? "chg" : "rcv"}/{a.index}</span>
                    <span style={{ fontFamily: T.mono, fontSize: 12, color: T.text, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis" }}>{trunc(a.address)}</span>
                    {reused && <Tag label="reused" color={T.red} size={8} />}
                    <span style={{ fontFamily: T.mono, fontSize: 10, color: T.textDim, marginLeft: "auto" }}>{sats(bal)} · {a.chain_stats.tx_count} tx</span>
                    {onScan && <button onClick={() => onScan(a.address)} style={{ flexShrink: 0, background: "transparent", border: `1px solid ${T.cyan}55`, borderRadius: 8, padding: "4px 10px", color: T.cyan, fontFamily: T.sans, fontSize: 11, fontWeight: 600, cursor: "pointer" }} onMouseOver={e => e.currentTarget.style.background = T.cyan + "14"} onMouseOut={e => e.currentTarget.style.background = "transparent"}>Audit →</button>}
                  </div>
                );
              })}
            </div>
          </div>
          <div style={{ fontSize: 11.5, color: T.textDim, lineHeight: 1.6, textAlign: "center" }}>
            A wallet scan queries a batch of your addresses at the explorer (via the no-log relay by default) — inherent to reading any wallet from the chain. Only public keys were used; no private keys, ever.
          </div>
        </div>
      );
    }
  }

  return (
    <div role="main" aria-label="Wallet xpub Scan" style={{ minHeight: "100vh", background: "transparent", display: "flex", flexDirection: "column" }}>
      <h1 className="sr-only">Bitcoin Wallet Privacy Scan from an Extended Public Key (xpub)</h1>
      <nav style={{ display: "flex", alignItems: "center", gap: 10, padding: isMobile ? "12px 16px" : "14px 32px", borderBottom: `1px solid ${T.border}`, background: T.bg, position: "sticky", top: 0, zIndex: 100 }}>
        <button onClick={onBack} style={{ background: "transparent", border: `1.5px solid ${T.border}`, borderRadius: 8, padding: "7px 12px", color: T.textMid, fontFamily: T.sans, fontSize: 13, cursor: "pointer", transition: "border .15s" }}
          onMouseOver={e => e.currentTarget.style.borderColor = T.cyan} onMouseOut={e => e.currentTarget.style.borderColor = T.border}>← Back</button>
        <div style={{ fontFamily: T.display, fontSize: 15, letterSpacing: 4, fontWeight: 700 }}>ANON<span style={{ color: T.cyan }}>SCORE</span></div>
        <div style={{ flex: 1 }} />
        <span style={{ fontFamily: T.mono, fontSize: 9, color: T.cyan, background: T.cyanLo, border: `1px solid ${T.cyan}44`, borderRadius: 6, padding: "4px 9px", letterSpacing: 1 }}>WALLET SCAN</span>
      </nav>

      <div style={{ flex: 1, maxWidth: 780, margin: "0 auto", width: "100%", padding: isMobile ? "28px 16px" : "44px 32px" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontFamily: T.mono, fontSize: 10, color: T.cyan, letterSpacing: 2.5, marginBottom: 14 }}>WHOLE-WALLET AUDIT</div>
          <h2 style={{ fontFamily: T.serif, fontSize: isMobile ? 30 : 40, color: T.text, lineHeight: 1.1, fontWeight: 400, marginBottom: 14 }}>
            Audit your <em style={{ color: T.cyan }}>entire wallet</em>,<br />not just one address.
          </h2>
          <p style={{ fontSize: isMobile ? 14 : 16, color: T.textMid, lineHeight: 1.7, maxWidth: 580, margin: "0 auto", fontWeight: 300 }}>
            Paste an <strong style={{ color: T.text }}>xpub, ypub, or zpub</strong> (your wallet's extended <em>public</em> key). We derive every address and scan it — all in your browser. <strong style={{ color: T.text }}>Never paste a private key.</strong>
          </p>
        </div>

        <div style={{ background: T.card, border: `1.5px solid ${detected ? T.cyan + "55" : T.border}`, borderRadius: 16, padding: isMobile ? "16px" : "20px 22px", transition: "border .2s" }}>
          <label htmlFor="xpub-input" style={{ display: "block", fontFamily: T.mono, fontSize: 9, color: T.textDim, letterSpacing: 1.5, marginBottom: 8 }}>EXTENDED PUBLIC KEY (xpub / ypub / zpub)</label>
          <textarea id="xpub-input" value={raw} onChange={e => { setRaw(e.target.value); setError(""); }}
            placeholder="zpub6r… / xpub6C… / ypub6X…" aria-label="Paste your extended public key (xpub, ypub, or zpub)" spellCheck={false}
            style={{ width: "100%", boxSizing: "border-box", minHeight: 84, resize: "vertical", background: "#070910", border: `1px solid ${T.border}`, borderRadius: 10, padding: "12px 14px", color: T.text, fontFamily: T.mono, fontSize: 12.5, lineHeight: 1.5, outline: "none" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
            <button onClick={runScan} disabled={!detected || busy} className="sheen"
              style={{ background: (detected && !busy) ? T.cyan : T.surface, border: "none", borderRadius: 10, padding: "12px 22px", color: (detected && !busy) ? T.bg : T.textDim, fontFamily: T.sans, fontWeight: 700, fontSize: 14, cursor: (detected && !busy) ? "pointer" : "default", transition: "all .15s" }}>
              {busy ? "Scanning…" : "Scan wallet →"}
            </button>
            <button onClick={loadDemo} disabled={busy} style={{ background: "transparent", border: `1px solid ${T.border}`, borderRadius: 10, padding: "12px 16px", color: T.textMid, fontFamily: T.sans, fontSize: 13, cursor: busy ? "default" : "pointer" }}
              onMouseOver={e => { if (!busy) e.currentTarget.style.borderColor = T.cyan; }} onMouseOut={e => e.currentTarget.style.borderColor = T.border}>Load example</button>
            {detected && !busy && <span style={{ fontFamily: T.mono, fontSize: 10, color: T.cyan }}>✓ extended key detected</span>}
          </div>
          {busy && progress && (
            <div style={{ marginTop: 14 }}>
              <div style={{ fontFamily: T.mono, fontSize: 11, color: T.textMid, marginBottom: 6 }}>Deriving &amp; scanning… {progress.derived} addresses checked · {progress.used} used found</div>
              <div style={{ height: 4, borderRadius: 4, background: T.surface, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${Math.min(100, (progress.derived / 44) * 100)}%`, background: T.cyan, transition: "width .2s" }} />
              </div>
            </div>
          )}
        </div>

        {error && (
          <div role="alert" style={{ marginTop: 14, background: T.red + "12", border: `1px solid ${T.red}44`, borderRadius: 12, padding: "12px 16px", fontSize: 13, color: T.text, lineHeight: 1.6 }}>
            <span style={{ color: T.red, fontFamily: T.mono, marginRight: 6 }}>⚠</span>{error}
          </div>
        )}
        {report}
        {!result && !error && !busy && (
          <div style={{ marginTop: 20, fontSize: 12.5, color: T.textDim, lineHeight: 1.7, textAlign: "center" }}>
            Find your account xpub in Sparrow (Settings → Export), Electrum (Wallet → Information), or your hardware wallet. It's public — it reveals addresses, never the ability to spend.
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   WALLET DIRECTORY — standalone curated reviews at /?page=wallets.
   Reads WALLET_REVIEWS + WALLET_CATEGORIES (defined near top of file).
   Filterable by category, links out via toolLink() (so affiliate URLs
   slot in automatically when configured).
───────────────────────────────────────────── */
function WalletDirectory({ onBack, isMobile }) {
  useLang();
  const [cat, setCat] = useState("all");
  const [query, setQuery] = useState("");
  const anyAff = WALLET_REVIEWS.some(w => toolIsAffiliate(w.name));

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return WALLET_REVIEWS.filter(w => {
      if (cat !== "all" && w.category !== cat) return false;
      if (!q) return true;
      return (w.name + " " + w.pitch + " " + (w.os || "")).toLowerCase().includes(q);
    });
  }, [cat, query]);

  // Group by category for "All" view to keep visual hierarchy
  const grouped = useMemo(() => {
    if (cat !== "all") return [[cat, filtered]];
    return WALLET_CATEGORIES.map(c => [c.key, filtered.filter(w => w.category === c.key)]).filter(([, list]) => list.length);
  }, [cat, filtered]);

  useEffect(() => {
    const prev = document.title;
    document.title = "Privacy-First Bitcoin Wallet Directory — AnonScore";
    const desc = document.querySelector('meta[name="description"]');
    const prevDesc = desc?.getAttribute("content");
    desc?.setAttribute("content", "Curated, regularly updated directory of the most privacy-respecting Bitcoin & Lightning wallets. Honest watch-outs included; no pay-to-play.");
    return () => { document.title = prev; if (desc && prevDesc) desc.setAttribute("content", prevDesc); };
  }, []);

  return (
    <div role="main" aria-label="Privacy-First Wallet Directory" style={{ minHeight: "100vh", background: "transparent", display: "flex", flexDirection: "column" }}>
      <h1 className="sr-only">Privacy-First Bitcoin & Lightning Wallet Directory</h1>

      {/* Nav */}
      <nav style={{ display: "flex", alignItems: "center", gap: 10, padding: isMobile ? "12px 16px" : "14px 32px", borderBottom: `1px solid ${T.border}`, background: T.bg, position: "sticky", top: 0, zIndex: 100 }}>
        <button onClick={onBack} style={{ background: "transparent", border: `1.5px solid ${T.border}`, borderRadius: 8, padding: "7px 12px", color: T.textMid, fontFamily: T.sans, fontSize: 13, cursor: "pointer", transition: "border .15s" }}
          onMouseOver={e => e.currentTarget.style.borderColor = T.cyan}
          onMouseOut={e => e.currentTarget.style.borderColor = T.border}>← Back</button>
        <div style={{ fontFamily: T.display, fontSize: 15, letterSpacing: 4, fontWeight: 700 }}>ANON<span style={{ color: T.cyan }}>SCORE</span></div>
        <div style={{ flex: 1 }} />
        <span style={{ fontFamily: T.mono, fontSize: 9, color: T.btc, background: T.btcLo, border: `1px solid ${T.btcMid}`, borderRadius: 6, padding: "4px 9px", letterSpacing: 1 }}>DIRECTORY</span>
      </nav>

      <div style={{ flex: 1, maxWidth: 980, margin: "0 auto", width: "100%", padding: isMobile ? "32px 16px" : "48px 32px" }}>
        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontFamily: T.mono, fontSize: 10, color: T.btc, letterSpacing: 2.5, marginBottom: 14 }}>CURATED · NO PAY-TO-PLAY</div>
          <h2 style={{ fontFamily: T.serif, fontSize: isMobile ? 32 : 44, color: T.text, lineHeight: 1.1, fontWeight: 400, marginBottom: 14 }}>
            The privacy-first<br /><em style={{ color: T.btc }}>Bitcoin wallet directory.</em>
          </h2>
          <p style={{ fontSize: isMobile ? 14 : 16, color: T.textMid, lineHeight: 1.7, maxWidth: 580, margin: "0 auto", fontWeight: 300 }}>
            Every wallet, exchange, and node listed here is one we'd use ourselves. Each entry includes honest watch-outs — what to know before you trust it with your stack.
          </p>
        </div>

        {/* Filter bar */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
          <button onClick={() => setCat("all")}
            style={{ padding: "7px 12px", background: cat === "all" ? T.cyan : T.surface, border: `1px solid ${cat === "all" ? T.cyan : T.border}`, color: cat === "all" ? T.bg : T.textMid, borderRadius: 8, fontFamily: T.mono, fontSize: 10, fontWeight: 700, letterSpacing: 0.5, cursor: "pointer", transition: "all .15s" }}>
            ALL ({WALLET_REVIEWS.length})
          </button>
          {WALLET_CATEGORIES.map(c => {
            const count = WALLET_REVIEWS.filter(w => w.category === c.key).length;
            const active = cat === c.key;
            return (
              <button key={c.key} onClick={() => setCat(c.key)}
                style={{ padding: "7px 12px", background: active ? T.cyan : T.surface, border: `1px solid ${active ? T.cyan : T.border}`, color: active ? T.bg : T.textMid, borderRadius: 8, fontFamily: T.mono, fontSize: 10, fontWeight: 700, letterSpacing: 0.5, cursor: "pointer", transition: "all .15s" }}>
                {c.icon} {c.label.toUpperCase()} ({count})
              </button>
            );
          })}
          <div style={{ flex: 1, minWidth: 180 }}>
            <label htmlFor="wallet-search" className="sr-only">Search wallets</label>
            <input id="wallet-search" type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search…"
              style={{ width: "100%", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, padding: "7px 12px", color: T.text, fontFamily: T.mono, fontSize: 11, outline: "none", transition: "border .15s, box-shadow .2s" }}
              onFocus={e => { e.target.style.borderColor = T.cyan; e.target.style.boxShadow = `0 0 0 3px ${T.cyan}22`; }}
              onBlur={e => { e.target.style.borderColor = T.border; e.target.style.boxShadow = "0 0 0 0 transparent"; }} />
          </div>
        </div>

        {/* Groups */}
        {grouped.length === 0 ? (
          <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: "40px 20px", textAlign: "center", color: T.textMid, fontSize: 14 }}>
            No matches for "{query}".
          </div>
        ) : grouped.map(([catKey, list]) => {
          const meta = WALLET_CATEGORIES.find(c => c.key === catKey);
          return (
            <section key={catKey} style={{ marginBottom: 36 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 14, paddingBottom: 8, borderBottom: `1px solid ${T.borderLo}` }}>
                <span style={{ fontSize: 18 }}>{meta.icon}</span>
                <h3 style={{ fontFamily: T.serif, fontSize: 22, color: T.text, fontWeight: 400, margin: 0 }}>{meta.label}</h3>
                <div style={{ fontFamily: T.mono, fontSize: 10, color: T.textDim }}>· {meta.blurb}</div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", gap: 14 }}>
                {list.map(w => {
                  const href = toolLink(w.name);
                  const aff = toolIsAffiliate(w.name);
                  return (
                    <article key={w.name} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: "18px 20px", display: "flex", flexDirection: "column", gap: 10, transition: "border-color .2s, box-shadow .25s, transform .25s cubic-bezier(.16,.84,.44,1)" }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = T.cyan + "44"; e.currentTarget.style.boxShadow = `0 12px 32px -18px ${T.cyan}77`; e.currentTarget.style.transform = "translateY(-3px)"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}>
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                        <div>
                          <div style={{ fontFamily: T.serif, fontSize: 19, color: T.text, fontWeight: 400 }}>{w.name}</div>
                          {w.os && <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, marginTop: 3 }}>{w.os}</div>}
                        </div>
                        {aff && <span style={{ fontFamily: T.mono, fontSize: 9, color: T.amber, background: T.amberLo, border: `1px solid ${T.amberMid}`, borderRadius: 6, padding: "3px 8px", letterSpacing: 0.5 }}>AFFILIATE</span>}
                      </div>
                      <p style={{ fontSize: 13, color: T.textMid, lineHeight: 1.6, margin: 0 }}>{w.pitch}</p>
                      <div>
                        <div style={{ fontFamily: T.mono, fontSize: 9, color: T.green, letterSpacing: 1.5, marginBottom: 4 }}>STRENGTHS</div>
                        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 3 }}>
                          {w.strengths.map((s, i) => (
                            <li key={i} style={{ display: "flex", gap: 8, fontSize: 12, color: T.text, lineHeight: 1.55 }}>
                              <span style={{ color: T.green, flexShrink: 0 }}>✓</span>
                              <span>{s}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <div style={{ fontFamily: T.mono, fontSize: 9, color: T.amber, letterSpacing: 1.5, marginBottom: 4 }}>WATCH-OUTS</div>
                        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 3 }}>
                          {w.watchOuts.map((s, i) => (
                            <li key={i} style={{ display: "flex", gap: 8, fontSize: 12, color: T.textMid, lineHeight: 1.55 }}>
                              <span style={{ color: T.amber, flexShrink: 0 }}>⚠</span>
                              <span>{s}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      {href && (
                        <div style={{ marginTop: 4 }}>
                          <a href={href} target="_blank" rel="noopener noreferrer nofollow"
                            style={{ display: "inline-block", background: "transparent", border: `1.5px solid ${T.cyan}66`, borderRadius: 8, padding: "7px 14px", color: T.cyan, fontFamily: T.mono, fontSize: 11, textDecoration: "none", transition: "all .15s" }}
                            onMouseOver={e => { e.currentTarget.style.background = T.cyan; e.currentTarget.style.color = T.bg; }}
                            onMouseOut={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = T.cyan; }}>
                            Visit {w.name} ↗
                          </a>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            </section>
          );
        })}

        {/* Disclosure footer */}
        <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: "16px 20px", fontSize: 12, color: T.textMid, lineHeight: 1.7 }}>
          <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, letterSpacing: 2, marginBottom: 8 }}>HOW THIS LIST WORKS</div>
          Every entry was picked because we'd actually use it. Reviews are written by the AnonScore team, not paid for. {anyAff
            ? <>Entries tagged <span style={{ fontFamily: T.mono, color: T.amber }}>AFFILIATE</span> earn AnonScore a small referral when you sign up — we never tune reviews for tier.</>
            : <>No entry on this page currently pays us a referral. If that ever changes, it'll be tagged <span style={{ fontFamily: T.mono, color: T.amber }}>AFFILIATE</span> here and listed in full disclosure.</>}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   COACH WAITLIST — landing page for the optional paid AI tier.
   Reachable at /?page=coach, linked from the AI assistant card. Collects
   no payment — just an email from folks who want it, so we know whether
   it's worth building before we build it.
───────────────────────────────────────────── */
function CoachWaitlist({ onBack, isMobile }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | submitting | ok | err
  const [error, setError] = useState("");

  const submit = async (e) => {
    e?.preventDefault();
    const v = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) { setError("Enter a valid email."); return; }
    setStatus("submitting"); setError("");
    if (COACH.endpoint) {
      try {
        const fd = new FormData();
        fd.append("email", v);
        fd.append("list", "coach-waitlist");
        await fetch(COACH.endpoint, { method: "POST", body: fd, mode: "no-cors" });
        setStatus("ok");
      } catch { setStatus("err"); setError("Couldn't reach the waitlist service. Try again later."); }
    } else {
      window.location.href = `mailto:${COACH.fallbackMailto}?subject=${encodeURIComponent("Coach waitlist")}&body=${encodeURIComponent(v + "\n\n(Add me to the Privacy Coach early-access list.)")}`;
      setStatus("ok");
    }
  };

  // Meta + tab title for shareability
  useEffect(() => {
    const prev = document.title;
    document.title = "Privacy Coach (early access) — AnonScore";
    return () => { document.title = prev; };
  }, []);

  return (
    <div role="main" aria-label="Privacy Coach — early access waitlist" style={{ minHeight: "100vh", background: "transparent", display: "flex", flexDirection: "column" }}>
      <h1 className="sr-only">Privacy Coach — paid AI tier (early access waitlist)</h1>

      {/* Nav */}
      <nav style={{ display: "flex", alignItems: "center", gap: 10, padding: isMobile ? "12px 16px" : "14px 32px", borderBottom: `1px solid ${T.border}`, background: T.bg, position: "sticky", top: 0, zIndex: 100 }}>
        <button onClick={onBack} style={{ background: "transparent", border: `1.5px solid ${T.border}`, borderRadius: 8, padding: "7px 12px", color: T.textMid, fontFamily: T.sans, fontSize: 13, cursor: "pointer", transition: "border .15s" }}
          onMouseOver={e => e.currentTarget.style.borderColor = T.cyan}
          onMouseOut={e => e.currentTarget.style.borderColor = T.border}>← Back</button>
        <div style={{ fontFamily: T.display, fontSize: 15, letterSpacing: 4, fontWeight: 700 }}>ANON<span style={{ color: T.cyan }}>SCORE</span></div>
        <div style={{ flex: 1 }} />
        <span style={{ fontFamily: T.mono, fontSize: 9, color: T.cyan, background: T.cyanLo, border: `1px solid ${T.cyanMid}`, borderRadius: 6, padding: "4px 9px", letterSpacing: 1 }}>EARLY ACCESS</span>
      </nav>

      <div style={{ flex: 1, maxWidth: 760, margin: "0 auto", width: "100%", padding: isMobile ? "32px 20px" : "56px 32px" }}>
        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontFamily: T.mono, fontSize: 10, color: T.cyan, letterSpacing: 2.5, marginBottom: 16 }}>✦ AI PRIVACY ASSISTANT — UPGRADED</div>
          <div style={{ fontFamily: T.serif, fontSize: isMobile ? 36 : 52, color: T.text, lineHeight: 1.1, fontWeight: 400, marginBottom: 18 }}>
            A coach that remembers<br /><em style={{ color: T.cyan }}>every scan, every fix, every step.</em>
          </div>
          <p style={{ fontSize: isMobile ? 15 : 17, color: T.textMid, lineHeight: 1.7, maxWidth: 560, margin: "0 auto", fontWeight: 300 }}>
            The free AI assistant answers 5 questions per session. The Coach has no cap, remembers your history across scans, and tracks a personal fix queue that follows you across devices.
          </p>
        </div>

        {/* Pricing card */}
        <div style={{ background: T.card, border: `1.5px solid ${T.cyan}55`, borderRadius: 18, padding: isMobile ? "24px 20px" : "32px 36px", marginBottom: 28, boxShadow: `0 8px 32px ${T.cyanMid}, 0 0 0 1px ${T.cyan}22` }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 4, marginBottom: 10 }}>
            <span style={{ fontFamily: T.serif, fontSize: isMobile ? 44 : 56, color: T.text, fontWeight: 400 }}>{COACH.price}</span>
            <span style={{ fontFamily: T.mono, fontSize: 14, color: T.textMid }}>{COACH.unit}</span>
          </div>
          <div style={{ textAlign: "center", fontSize: 13, color: T.textDim, marginBottom: 24, fontFamily: T.mono, letterSpacing: 0.5 }}>
            Pay in Bitcoin (Lightning) or card. Cancel anytime.
          </div>

          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 14, marginBottom: 28 }}>
            {COACH.benefits.map(b => (
              <div key={b.title} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ flexShrink: 0, width: 28, height: 28, borderRadius: 8, background: T.cyan + "18", border: `1px solid ${T.cyan}33`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: T.mono, fontSize: 14, color: T.cyan }}>
                  {b.icon}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 3 }}>{b.title}</div>
                  <div style={{ fontSize: 12, color: T.textMid, lineHeight: 1.55 }}>{b.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Waitlist form */}
          {status === "ok" ? (
            <div style={{ background: T.greenLo, border: `1px solid ${T.green}44`, borderRadius: 12, padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ color: T.green, fontSize: 20 }}>✓</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>You're on the list.</div>
                <div style={{ fontSize: 12, color: T.textMid, marginTop: 2 }}>We'll email when the Coach opens for early access — no spam in between.</div>
              </div>
            </div>
          ) : (
            <form onSubmit={submit}>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <label htmlFor="coach-email" className="sr-only">Email address for early-access waitlist</label>
                <input id="coach-email" type="email" value={email} onChange={e => { setEmail(e.target.value); setError(""); }}
                  placeholder="you@somewhere.zone"
                  required aria-invalid={!!error}
                  style={{ flex: 1, minWidth: 220, background: T.surface, border: `1.5px solid ${error ? T.red : T.border}`, borderRadius: 10, padding: "13px 16px", color: T.text, fontFamily: T.mono, fontSize: 13, outline: "none", transition: "border .15s, box-shadow .2s" }}
                  onFocus={e => { e.target.style.borderColor = T.cyan; e.target.style.boxShadow = `0 0 0 3px ${T.cyan}22`; }}
                  onBlur={e => { e.target.style.borderColor = error ? T.red : T.border; e.target.style.boxShadow = "0 0 0 0 transparent"; }} />
                <button type="submit" disabled={status === "submitting"}
                  style={{ background: T.cyan, border: "none", borderRadius: 10, padding: "13px 22px", color: T.bg, fontFamily: T.sans, fontWeight: 700, fontSize: 14, cursor: status === "submitting" ? "wait" : "pointer", opacity: status === "submitting" ? 0.6 : 1, whiteSpace: "nowrap" }}>
                  {status === "submitting" ? "…" : "Join waitlist"}
                </button>
              </div>
              {error && <div role="alert" style={{ fontSize: 11, color: T.red, marginTop: 8 }}>{error}</div>}
              <div style={{ fontSize: 11, color: T.textDim, marginTop: 10, lineHeight: 1.55 }}>
                Target opening: <span style={{ color: T.textMid }}>{COACH.launchTarget}</span>. We'll email once. No spam. Your email is never linked to a scanned address.
              </div>
            </form>
          )}
        </div>

        {/* Comparison table */}
        <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, overflow: "hidden", marginBottom: 28 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", borderBottom: `1px solid ${T.border}` }}>
            <div style={{ padding: "14px 18px", fontFamily: T.mono, fontSize: 9, color: T.textDim, letterSpacing: 2 }}>WHAT YOU GET</div>
            <div style={{ padding: "14px 18px", fontFamily: T.mono, fontSize: 9, color: T.textMid, letterSpacing: 2, borderLeft: `1px solid ${T.border}` }}>FREE</div>
            <div style={{ padding: "14px 18px", fontFamily: T.mono, fontSize: 9, color: T.cyan, letterSpacing: 2, borderLeft: `1px solid ${T.border}`, background: T.cyanLo }}>COACH</div>
          </div>
          {[
            ["The full audit (11 BTC + 8 LN heuristics)", "✓ always free", "✓ always free"],
            ["AI assistant — messages per session",       "5",            "Unlimited"],
            ["Memory across scans",                       "—",            "✓ passphrase-encrypted"],
            ["Multi-device continuity",                   "—",            "✓"],
            ["Personal fix queue with progress",          "Per address",  "✓ across every wallet"],
            ["Address ever sent to the AI",               "Never",        "Never"],
          ].map(([what, free, coach], i, arr) => (
            <div key={what} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", borderBottom: i < arr.length - 1 ? `1px solid ${T.borderLo}` : undefined }}>
              <div style={{ padding: "12px 18px", fontSize: 13, color: T.text }}>{what}</div>
              <div style={{ padding: "12px 18px", fontSize: 12, color: T.textMid, borderLeft: `1px solid ${T.borderLo}`, fontFamily: T.mono }}>{free}</div>
              <div style={{ padding: "12px 18px", fontSize: 12, color: coach.includes("Never") ? T.textMid : T.text, borderLeft: `1px solid ${T.borderLo}`, fontFamily: T.mono, background: T.cyan + "08" }}>{coach}</div>
            </div>
          ))}
        </div>

        {/* Trust copy */}
        <div style={{ background: T.greenLo, border: `1px solid ${T.green}33`, borderRadius: 12, padding: "16px 20px" }}>
          <div style={{ fontFamily: T.mono, fontSize: 9, color: T.green, letterSpacing: 2, marginBottom: 8 }}>HOW PRIVACY HOLDS UP UNDER A PAID TIER</div>
          <div style={{ fontSize: 13, color: T.textMid, lineHeight: 1.7 }}>
            Coach memory is encrypted client-side with a passphrase you choose — the server stores only ciphertext it can't read. Wallet addresses you scan are <strong style={{ color: T.text }}>never</strong> sent to the AI; only your score and issue names are. Free or paid, this stays the same.
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: 32 }}>
          <button onClick={onBack} style={{ background: "transparent", border: "none", color: T.textMid, fontFamily: T.mono, fontSize: 12, cursor: "pointer", padding: 8 }}
            onMouseOver={e => e.currentTarget.style.color = T.cyan}
            onMouseOut={e => e.currentTarget.style.color = T.textMid}>
            ← Back to scanner
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   AI FIX ASSISTANT — privacy-first design
   • Address NEVER sent to API
   • Explicit consent gate before first request
   • Data preview shown verbatim before consent
   • Opt-in only
/* ─────────────────────────────────────────────
   AI ASSISTANT — consent gate component
───────────────────────────────────────────── */

/* Builds context sent to Anthropic — address intentionally excluded */
/* Lightweight markdown renderer for AI chat bubbles
   Handles: **bold**, *italic*, numbered lists, line breaks */
function renderMd(text) {
  if (!text) return null;
  const lines = text.split("\n");
  const out = [];
  let key = 0;

  const inlineStyles = (str) => {
    // Bold: **text** → <strong>
    // Italic: *text* (not preceded/followed by *) → <em>
    const parts = [];
    let remaining = str;
    let idx = 0;
    while (remaining.length > 0) {
      const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
      const italicMatch = remaining.match(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/);
      const first = [boldMatch, italicMatch]
        .filter(Boolean)
        .sort((a, b) => a.index - b.index)[0];
      if (!first) { parts.push(remaining); break; }
      if (first.index > 0) parts.push(remaining.slice(0, first.index));
      if (first === boldMatch) {
        parts.push(<strong key={idx++} style={{ color: T.text, fontWeight: 700 }}>{first[1]}</strong>);
      } else {
        parts.push(<em key={idx++}>{first[1]}</em>);
      }
      remaining = remaining.slice(first.index + first[0].length);
    }
    return parts;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) {
      if (out.length > 0) out.push(<div key={key++} style={{ height: 6 }} />);
      continue;
    }
    // Numbered list: "1. text"
    const numMatch = line.match(/^(\d+)\.\s+(.*)/);
    if (numMatch) {
      out.push(
        <div key={key++} style={{ display: "flex", gap: 8, marginBottom: 2 }}>
          <span style={{ color: T.cyan, fontFamily: T.mono, fontSize: 11, flexShrink: 0, marginTop: 1 }}>{numMatch[1]}.</span>
          <span>{inlineStyles(numMatch[2])}</span>
        </div>
      );
      continue;
    }
    // Bullet: "- text" or "• text"
    const bulletMatch = line.match(/^[-•]\s+(.*)/);
    if (bulletMatch) {
      out.push(
        <div key={key++} style={{ display: "flex", gap: 8, marginBottom: 2 }}>
          <span style={{ color: T.cyan, flexShrink: 0, marginTop: 2, fontSize: 10 }}>›</span>
          <span>{inlineStyles(bulletMatch[1])}</span>
        </div>
      );
      continue;
    }
    out.push(<div key={key++} style={{ marginBottom: 2 }}>{inlineStyles(line)}</div>);
  }
  return <>{out}</>;
}

function buildAiContext(checks, recommendations, score, grade, walletMeta) {
  const issues = checks.filter(c => c.status !== "pass");
  const isPublic = walletMeta?.isPublic;
  const entity   = walletMeta?.entity || "";

  // Build transaction summary for public wallets — all public blockchain data
  let txSection = "";
  if (isPublic && walletMeta?.txs?.length) {
    const txs   = walletMeta.txs.slice(0, 20);
    const utxos = (walletMeta.utxos || []).slice(0, 20);
    const now   = Math.floor(Date.now() / 1000);
    const age   = (ts) => {
      if (!ts) return "unknown date";
      const d = Math.floor((now - ts) / 86400);
      return d === 0 ? "today" : d === 1 ? "1 day ago" : `${d} days ago`;
    };
    const satsBtc = (s) => s >= 1e8 ? `₿${(s/1e8).toFixed(4)}` : `${s.toLocaleString()} sats`;

    const txLines = txs.map((tx, i) => {
      const inCount  = tx.vin?.length  || 0;
      const outCount = tx.vout?.length || 0;
      const fee      = tx.fee ? `${tx.fee} sats fee` : "";
      const time     = age(tx.status?.block_time);
      const totalOut = (tx.vout || []).reduce((s, o) => s + (o.value || 0), 0);
      const flags    = [];
      if (outCount >= 5 && inCount >= 5) flags.push("possible CoinJoin");
      if (inCount >= 4 && outCount <= 2) flags.push("consolidation");
      if (totalOut >= 100000 && totalOut % 100000 === 0) flags.push("round amount");
      return `  ${i+1}. ${time} — ${inCount} inputs → ${outCount} outputs, ${satsBtc(totalOut)} total${fee ? `, ${fee}` : ""}${flags.length ? ` [${flags.join(", ")}]` : ""}`;
    }).join("\n");

    const utxoLines = utxos.slice(0, 10).map((u, i) =>
      `  ${i+1}. ${satsBtc(u.value)} — ${u.status?.confirmed ? "confirmed" : "unconfirmed"}, ${age(u.status?.block_time)}, type: ${u.scriptpubkey_type || "unknown"}`
    ).join("\n");

    txSection = `
On-chain transaction data (${txs.length} most recent, all public blockchain data):
${txLines}

Top UTXOs by value (${utxos.length} sampled):
${utxoLines}`;
  }

  const walletFrame = isPublic
    ? `The user is analyzing a PUBLIC/INSTITUTIONAL wallet — this is NOT the user's own wallet. It belongs to: ${entity}. Always use third-person language ("this wallet", "the entity", "their coins") — NEVER say "your wallet", "your coins", or "you should". Frame analysis as forensic/educational, not personal advice.`
    : `The user ran a privacy analysis on their own wallet. Address was NOT shared — you have analysis results only.`;

  const systemPrompt = `You are a Bitcoin privacy expert assistant. ${walletFrame}

Analysis summary:
- Privacy score: ${score}/100 (Grade ${grade})
- Issues (${issues.length}):
${issues.map(c => `  • ${c.name} [${c.status.toUpperCase()}]: ${c.plain}`).join("\n")}
- Top recommendations:
${recommendations.slice(0, 5).map((r, i) => `  ${i+1}. ${r.action} (+${r.impact}pts) — Options: ${(r.tools||[{name:r.tool}]).map(t=>t.name).join(", ")}`).join("\n")}${txSection}

Rules:
- Plain prose only. NO markdown — no **bold**, no *italic*, no bullet points with -, no # headers.
- Use numbered lists (1. 2. 3.) sparingly if needed for steps.
- Be concise. Under 150 words unless step-by-step instructions require more.
- ${isPublic ? "This is forensic analysis of a public wallet — you have transaction data above. Discuss specific transactions when asked. Focus on what the chain reveals, historical context, and privacy lessons." : "Give practical wallet instructions when asked (Sparrow, Wasabi, Phoenix)."}
- Never reproduce or reference full Bitcoin addresses.`;

  const preview = [
    `Score: ${score}/100 · Grade ${grade}`,
    isPublic ? `Entity: ${entity}` : `${issues.length} issue${issues.length !== 1 ? "s" : ""}: ${issues.slice(0,3).map(c => c.name).join(", ")}${issues.length > 3 ? ` +${issues.length - 3} more` : ""}`,
    isPublic && walletMeta?.txs?.length ? `${walletMeta.txs.length} recent transactions (public blockchain data)` : `Top finding: ${recommendations[0]?.action || issues[0]?.name || "none"}`,
  ];
  return { systemPrompt, preview };
}

/* ── Consent gate — shown before any data leaves the browser ── */
function AiConsentGate({ score, grade, checks, recommendations, walletMeta, onAccept, onDecline }) {
  const { systemPrompt } = buildAiContext(checks, recommendations, score, grade, walletMeta);
  const dialogRef = useDialog(onDecline);
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 950, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, background: "#000000bb" }}>
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-label="AI assistant data disclosure" tabIndex={-1}
        style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 20, padding: 28, width: "min(420px,96vw)", animation: "fadeUp .25s ease both" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <div style={{ width: 32, height: 32, background: T.cyan + "18", border: `1px solid ${T.cyan}33`, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>✦</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: T.text }}>Before you continue</div>
            <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, letterSpacing: 1.2, marginTop: 1 }}>AI ASSISTANT · DATA DISCLOSURE</div>
          </div>
        </div>

        <div style={{ background: T.greenLo, border: `1px solid ${T.green}33`, borderRadius: 12, padding: "14px 16px", marginBottom: 10 }}>
          <div style={{ fontFamily: T.mono, fontSize: 9, color: T.green, letterSpacing: 1.5, marginBottom: 8 }}>✓ SENT TO ANTHROPIC'S API — THE EXACT TEXT</div>
          {/* Show the literal system prompt that gets POSTed — no summary, no
              paraphrase. This is the whole point of a "verify, don't trust" tool. */}
          <pre style={{ margin: 0, maxHeight: 200, overflow: "auto", background: T.bg, border: `1px solid ${T.borderLo}`, borderRadius: 8, padding: "10px 12px", fontFamily: T.mono, fontSize: 10.5, lineHeight: 1.5, color: T.textMid, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{systemPrompt}</pre>
          <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, marginTop: 8, lineHeight: 1.5 }}>
            That's the complete context — plus the questions you type in the chat. Don't paste your address or anything you don't want sent.{" "}
            <a href="https://github.com/netasset/anonscore/blob/main/anonscore.jsx" target="_blank" rel="noopener noreferrer"
              style={{ color: T.cyan, textDecoration: "none" }}>
              verify: the open-source code that builds this exact payload (search "buildAiContext") ↗
            </a>
          </div>
        </div>

        <div style={{ background: T.redLo, border: `1px solid ${T.red}22`, borderRadius: 12, padding: "14px 16px", marginBottom: 18 }}>
          <div style={{ fontFamily: T.mono, fontSize: 9, color: T.red, letterSpacing: 1.5, marginBottom: 10 }}>✕ NEVER SENT</div>
          {(walletMeta?.isPublic
            ? ["Your identity or IP address", "Any data beyond what's shown above"]
            : ["Your Bitcoin address", "Transaction IDs or UTXO data", "Any data that could identify your wallet"]
          ).map((line, i) => (
            <div key={i} style={{ display: "flex", gap: 8, padding: "4px 0", borderTop: i > 0 ? `1px solid ${T.borderLo}` : undefined }}>
              <span style={{ color: T.red, fontSize: 10, flexShrink: 0, marginTop: 1 }}>✕</span>
              <span style={{ fontFamily: T.mono, fontSize: 11, color: T.textMid, lineHeight: 1.5 }}>{line}</span>
            </div>
          ))}
        </div>

        <div style={{ fontSize: 12, color: T.textDim, lineHeight: 1.7, marginBottom: 14 }}>
          Anthropic does not train on API data. Each session is independent — no history persists between conversations.{" "}
          <a href="https://www.anthropic.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: T.cyan, textDecoration: "none" }}>Anthropic privacy policy →</a>
        </div>

        <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: "12px 16px", marginBottom: 18 }}>
          <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, letterSpacing: 1.5, marginBottom: 8 }}>USAGE LIMITS</div>
          <div style={{ fontSize: 12, color: T.textMid, lineHeight: 1.7 }}>
            <strong style={{ color: T.text }}>5 messages per conversation.</strong> To prevent abuse, a temporary anonymous counter is stored for 24 hours against a hashed version of your IP — never linked to you or your address. Resets daily.
          </div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onDecline} style={{ flex: 1, padding: "12px", background: "transparent", border: `1.5px solid ${T.border}`, borderRadius: 10, color: T.textMid, fontSize: 13, cursor: "pointer" }}>
            No thanks
          </button>
          <button onClick={onAccept} style={{ flex: 1, padding: "12px", background: T.cyan, border: "none", borderRadius: 10, color: T.bg, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
            I understand — continue
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Shared-scan-link confirm — a ?scan= link never auto-fires; the user
   confirms first. Its own component so it mounts/unmounts with the prompt
   and gets the shared dialog a11y (focus + Escape + trap). ── */
function ConfirmScanModal({ pendingScan, onCancel, onConfirm }) {
  const dialogRef = useDialog(onCancel);
  const kind = pendingScan.inputType === "btc" ? "Bitcoin address" : pendingScan.inputType === "ln_address" ? "Lightning address" : "Lightning node";
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 900, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, background: "#000000aa" }}>
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-label="Confirm shared scan link" tabIndex={-1}
        style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 18, padding: 28, width: "min(400px,94vw)", animation: "fadeUp .25s ease" }}>
        <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, letterSpacing: 2, marginBottom: 14 }}>SHARED SCAN LINK</div>
        <div style={{ fontFamily: T.serif, fontSize: 20, color: T.text, marginBottom: 10, fontWeight: 400 }}>
          You were linked to scan this {kind}
        </div>
        <div style={{ fontFamily: T.mono, fontSize: 11, color: T.textDim, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, padding: "10px 14px", marginBottom: 16, wordBreak: "break-all" }}>
          {pendingScan.addr.length > 30 ? `${pendingScan.addr.slice(0, 20)}…${pendingScan.addr.slice(-8)}` : pendingScan.addr}
        </div>
        <div style={{ fontSize: 13, color: T.textMid, lineHeight: 1.65, marginBottom: 20 }}>
          This queries a public block explorer directly from your browser. The address is public data — but the explorer sees your IP alongside it. On Tor or your own node, even that link stays private.
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onCancel} style={{ flex: 1, padding: "12px", background: "transparent", border: `1.5px solid ${T.border}`, borderRadius: 10, color: T.textMid, fontSize: 13, cursor: "pointer" }}>
            Cancel
          </button>
          <button onClick={onConfirm}
            style={{ flex: 1, padding: "12px", background: T.cyan, border: "none", borderRadius: 10, color: T.bg, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
            Scan it →
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Chat panel — only shown after consent ── */
function AiAssistant({ checks, recommendations, score, grade, onClose, starters: startersProp, walletMeta }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [msgCount, setMsgCount] = useState(0);
  const [rateLimited, setRateLimited] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  const MAX_MSGS = 5;
  const WORKER_URL = "https://anonscore-ai.netassetpremium.workers.dev";

  const issues = checks.filter(c => c.status !== "pass");
  const { systemPrompt } = buildAiContext(checks, recommendations, score, grade, walletMeta);
  const exhausted = msgCount >= MAX_MSGS;
  const isPublic = walletMeta?.isPublic;
  const entity   = walletMeta?.entity || "";

  const STARTERS = startersProp || (isPublic ? [
    `Why does ${entity || "this wallet"} score so poorly on privacy?`,
    "What does this score reveal about institutional Bitcoin management?",
    "What heuristics flag this wallet as an exchange or institution?",
    "What would this wallet need to do to score higher?",
  ] : [
    "How do I freeze dust UTXOs in Sparrow?",
    `Which of my ${issues.length} issues should I fix first?`,
    "How does CoinJoin actually work?",
    "Is my wallet software identifiable from fee rates?",
  ]);

  const send = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading || exhausted) return;
    setInput("");
    setStarted(true);
    const newCount = msgCount + 1;
    setMsgCount(newCount);
    const next = [...messages, { role: "user", content: msg }];
    setMessages(next);
    setLoading(true);
    try {
      const res = await fetch(WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, systemPrompt }),
      });
      if (res.status === 429) {
        setRateLimited(true);
        setMessages(m => [...m, { role: "assistant", content: "You've reached the daily limit for the Privacy Assistant. It resets at midnight UTC — come back tomorrow." }]);
      } else if (!res.ok) {
        setMessages(m => [...m, { role: "assistant", content: `Server error (${res.status}). Please try again in a moment.` }]);
      } else {
        const data = await res.json();
        const reply = data.reply || "Sorry, I couldn't get a response. Try again.";
        setMessages(m => [...m, { role: "assistant", content: reply }]);
      }
    } catch (err) {
      const msg = err?.name === "TypeError"
        ? "Could not reach the assistant — check your connection and try again."
        : "Connection error. Please try again.";
      setMessages(m => [...m, { role: "assistant", content: msg }]);
    }
    setLoading(false);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const inputDisabled = exhausted || rateLimited || loading;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 900, display: "flex", alignItems: "flex-end", justifyContent: "flex-end", padding: 16, pointerEvents: "none" }}>
      <div style={{ pointerEvents: "all", background: T.card, border: `1px solid ${T.border}`, borderRadius: 20, width: "min(420px, 96vw)", height: "min(580px, 80vh)", display: "flex", flexDirection: "column", boxShadow: "0 24px 80px #000000aa", animation: "fadeUp .3s ease both" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 18px", borderBottom: `1px solid ${T.border}` }}>
          <div style={{ width: 28, height: 28, background: T.cyan + "22", border: `1px solid ${T.cyan}44`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>✦</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: T.text }}>Privacy Assistant</div>
            <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, letterSpacing: 1 }}>Powered by Claude</div>
            <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, letterSpacing: 1 }}>Address never shared</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {!exhausted && !rateLimited && (
              <span style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim }}>
                {MAX_MSGS - msgCount} msg{MAX_MSGS - msgCount !== 1 ? "s" : ""} left
              </span>
            )}
            <button onClick={onClose} style={{ background: "transparent", border: "none", color: T.textDim, fontSize: 18, cursor: "pointer", lineHeight: 1 }}>✕</button>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
          {!started && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ fontSize: 13, color: T.textMid, lineHeight: 1.6 }}>
                {isPublic
                  ? <>I've analysed the score for <strong style={{ color: T.text }}>{entity}</strong>. Ask me anything about what the chain reveals, why it scores this way, or what the forensic patterns mean.</>
                  : <>I've read your wallet analysis. Ask me anything about your {issues.length} issue{issues.length !== 1 ? "s" : ""} or how to improve your score from <span style={{ color: scoreColor(score) }}>{score}</span> to 90+.</>
                }
              </div>
              <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, letterSpacing: 1, marginTop: 4 }}>QUICK QUESTIONS</div>
              {STARTERS.map((s, i) => (
                <button key={i} onClick={() => send(s)} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: "9px 14px", color: T.textMid, fontSize: 12, cursor: "pointer", textAlign: "left", transition: "all .15s" }}
                  onMouseOver={e => { e.currentTarget.style.borderColor = T.cyan; e.currentTarget.style.color = T.text; }}
                  onMouseOut={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textMid; }}>
                  {s}
                </button>
              ))}
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} style={{ display: "flex", flexDirection: m.role === "user" ? "row-reverse" : "row", gap: 8, alignItems: "flex-start" }}>
              {m.role === "assistant" && (
                <div style={{ width: 22, height: 22, background: T.cyan + "22", border: `1px solid ${T.cyan}44`, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, flexShrink: 0, marginTop: 2 }}>✦</div>
              )}
              <div style={{ background: m.role === "user" ? T.cyan + "18" : T.surface, border: `1px solid ${m.role === "user" ? T.cyan + "33" : T.borderLo}`, borderRadius: m.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px", padding: "10px 14px", maxWidth: "85%", fontSize: 13, color: T.text, lineHeight: 1.65 }}>
                {m.role === "assistant" ? renderMd(m.content) : m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
              <div style={{ width: 22, height: 22, background: T.cyan + "22", border: `1px solid ${T.cyan}44`, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, flexShrink: 0, marginTop: 2 }}>✦</div>
              <div style={{ background: T.surface, border: `1px solid ${T.borderLo}`, borderRadius: "14px 14px 14px 4px", padding: "12px 16px" }}>
                <div style={{ display: "flex", gap: 4 }}>
                  {[0,1,2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: T.cyan, animation: `pulse 1.2s ease ${i * .2}s infinite` }} />)}
                </div>
              </div>
            </div>
          )}
          {exhausted && !rateLimited && (
            <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: "12px 16px", textAlign: "center" }}>
              <div style={{ fontSize: 12, color: T.textDim, lineHeight: 1.6 }}>
                5-message limit reached for this conversation.<br />
                <span style={{ color: T.textMid }}>Start a new scan to open a fresh session.</span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{ padding: "12px 14px", borderTop: `1px solid ${T.border}`, display: "flex", gap: 8 }}>
          <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
            placeholder={inputDisabled ? (exhausted ? "Limit reached — start a new scan" : "Rate limited — try tomorrow") : "Ask about your privacy issues…"}
            disabled={inputDisabled}
            style={{ flex: 1, background: inputDisabled ? T.bg : T.surface, border: `1.5px solid ${T.border}`, borderRadius: 10, padding: "10px 14px", color: inputDisabled ? T.textDim : T.text, fontSize: 13, outline: "none", transition: "border .15s", cursor: inputDisabled ? "not-allowed" : "text" }}
            onFocus={e => !inputDisabled && (e.target.style.borderColor = T.cyan)}
            onBlur={e => e.target.style.borderColor = T.border} />
          <button onClick={() => send()} disabled={!input.trim() || inputDisabled}
            style={{ background: input.trim() && !inputDisabled ? T.cyan : T.surface, border: `1.5px solid ${input.trim() && !inputDisabled ? T.cyan : T.border}`, borderRadius: 10, padding: "10px 14px", color: input.trim() && !inputDisabled ? T.bg : T.textDim, fontSize: 13, cursor: input.trim() && !inputDisabled ? "pointer" : "not-allowed", transition: "all .2s", fontWeight: 700 }}>
            →
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   DASHBOARD
───────────────────────────────────────────── */
/* ─────────────────────────────────────────────
   EXPOSURE FLOW — forensic transaction-flow map.
   "What a blockchain analyst sees": inputs → tx → outputs,
   each output colored by its privacy classification.
───────────────────────────────────────────── */
/* ─────────────────────────────────────────────
   ACTIVITY CLOCK — timing analysis, the heuristic people forget.
   Transaction timestamps cluster around the owner's waking hours; chain-
   analysis firms bin them by UTC clock-hour to estimate a wallet owner's
   timezone. Same technique, shown to the owner: 24 hourly bins from the
   sampled txs, the quietest 7-hour window (likely sleep), and — when the
   pattern is strong enough — the rough UTC offset an analyst would infer.
   Purely educational: does not touch the privacy score. Shown with an honest
   caveat — block_time is a CONFIRMATION time (a noisy proxy for broadcast/local
   time), and independent research (MIT DCI) found timing alone is often too weak
   to pin a timezone. Framed as one weak signal, not proof.
───────────────────────────────────────────── */
// Shared by the ActivityClock panel and the text-report export.
function computeActivityClock(txs) {
  const stamps = (txs || []).map(t => t.status?.block_time).filter(Boolean);
  const total = stamps.length;
  const counts = Array(24).fill(0);
  stamps.forEach(ts => counts[Math.floor((ts % 86400) / 3600)]++);
  // Quietest consecutive 7h window (circular) — the likely sleep block.
  const K = 7;
  let qStart = 0, qSum = Infinity;
  for (let s = 0; s < 24; s++) {
    let sum = 0;
    for (let j = 0; j < K; j++) sum += counts[(s + j) % 24];
    if (sum < qSum) { qSum = sum; qStart = s; }
  }
  const qEnd = (qStart + K) % 24;
  const hasData = total >= 6;
  // Strong signal: almost nothing happens in the quiet window.
  const strong = hasData && qSum / total <= 0.2;
  // If the quiet block is sleep centred ~03:30 local, the offset follows.
  const sleepMidUtc = (qStart + K / 2) % 24;
  let off = Math.round(3.5 - sleepMidUtc);
  off = ((off + 11 + 24) % 24) - 11; // normalize to −11…+12
  const tz = `UTC${off >= 0 ? "+" : ""}${off}`;
  const hh = h => `${String(h).padStart(2, "0")}:00`;
  return { counts, total, K, qStart, qEnd, hasData, strong, tz, hh };
}

function ActivityClock({ txs, isMobile, entity }) {
  // Case-file/public wallets get third-person framing — "this wallet's owner",
  // never "you" (same rule the AI assistant follows for forensic mode).
  const third = !!entity;
  const { counts, total, K, qStart, qEnd, hasData, strong, tz, hh } = computeActivityClock(txs);
  const max = Math.max(...counts, 1);
  // Chart geometry — 24 thin bars, baseline axis, quiet-window bracket.
  const BW = 10, GAP = 5, X0 = 8, BASE = 64, HMAX = 46;
  const width = X0 * 2 + 24 * (BW + GAP) - GAP;
  const inQuiet = h => { const d = (h - qStart + 24) % 24; return d < K; };
  return (
    <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: isMobile ? "16px 18px" : "18px 22px" }}>
      <div style={{ fontFamily: T.mono, fontSize: 9, color: T.cyan, letterSpacing: 2, marginBottom: 8 }}>ACTIVITY CLOCK</div>
      <div style={{ fontFamily: T.serif, fontSize: isMobile ? 17 : 19, color: T.text, fontWeight: 400, marginBottom: 6 }}>When you transact is a fingerprint too</div>
      {!hasData ? (
        <div style={{ fontSize: 12.5, color: T.textMid, lineHeight: 1.6 }}>
          Not enough timestamped history here to read a daily rhythm — that's one less pattern the chain gives away.
        </div>
      ) : (
        <>
          <svg viewBox={`0 0 ${width} 92`} role="img"
            aria-label={`Transactions by UTC hour of day. Quietest window ${hh(qStart)} to ${hh(qEnd)} UTC.`}
            style={{ display: "block", width: "100%", maxWidth: 480, height: "auto", marginTop: 6, overflow: "visible" }}>
            {counts.map((c, h) => {
              const x = X0 + h * (BW + GAP);
              const bh = c === 0 ? 2 : Math.max(4, (c / max) * HMAX);
              return (
                <rect key={h} x={x} y={BASE - bh} width={BW} height={bh} rx="2"
                  fill={c === 0 ? T.border : T.cyan} fillOpacity={c === 0 ? 0.6 : 0.9}>
                  <title>{`${hh(h)}–${hh((h + 1) % 24)} UTC — ${c} tx${c !== 1 ? "s" : ""}`}</title>
                </rect>
              );
            })}
            {/* baseline + hour ticks */}
            <line x1={X0} y1={BASE + 1} x2={width - X0} y2={BASE + 1} stroke={T.border} strokeWidth="1" />
            {[0, 6, 12, 18].map(h => (
              <text key={h} x={X0 + h * (BW + GAP) + BW / 2} y={BASE + 12} textAnchor="middle" fontFamily={T.mono} fontSize="8" fill={T.textDim}>{hh(h)}</text>
            ))}
            <text x={width - X0} y={BASE + 12} textAnchor="end" fontFamily={T.mono} fontSize="8" fill={T.textDim}>UTC</text>
            {/* quiet-window bracket (may wrap around midnight → two segments) */}
            {(qStart + K <= 24
              ? [[qStart, qStart + K]]
              : [[qStart, 24], [0, (qStart + K) % 24]]
            ).map(([a, b], i) => (
              <line key={i} x1={X0 + a * (BW + GAP)} y1={BASE + 18} x2={X0 + b * (BW + GAP) - GAP} y2={BASE + 18} stroke={T.textDim} strokeWidth="1.5" strokeLinecap="round" />
            ))}
            <text x={X0 + ((qStart + K / 2) % 24) * (BW + GAP)} y={BASE + 28} textAnchor="middle" fontFamily={T.mono} fontSize="8" fill={T.textDim}>quietest {K}h</text>
          </svg>
          <div style={{ fontSize: 12.5, color: T.textMid, lineHeight: 1.6, marginTop: 10, borderTop: `1px solid ${T.borderLo}`, paddingTop: 10 }}>
            {strong
              ? <>{third ? "This wallet's quiet hours" : "Your quiet hours"} run <strong style={{ color: T.text }}>{hh(qStart)}–{hh(qEnd)} UTC</strong>. If that's {third ? "when its owner sleeps, an analyst would place them" : "when you sleep, an analyst would place you"} around <strong style={{ color: T.text }}>{tz} (±2)</strong> — block timestamps are public, and time-of-day is one of the oldest deanonymization signals. Based on the {total} most recent transactions{total < 12 ? " (small sample — rough read)" : ""}.</>
              : <>No strong daily rhythm across the {total} most recent transactions — {third ? "this wallet's timing gives" : "good: your timing gives"} an analyst less to work with. (Wallets with automated or randomized broadcast times blur this signal on purpose.)</>}
          </div>
          <div style={{ fontSize: 11, color: T.textDim, lineHeight: 1.55, marginTop: 8 }}>
            A hint, not proof: block timestamps record when a transaction <em>confirmed</em>, not when it was broadcast — a noisy proxy for local time. Independent research (<a href="https://www.dci.mit.edu/posts/coinjoin-timing-questions" target="_blank" rel="noopener noreferrer" style={{ color: T.textMid, textDecoration: "underline" }}>MIT DCI</a>) found timing alone often can't pin a timezone. Weigh it as one weak signal among many.
          </div>
        </>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   CLUSTER EXPOSURE — the common-input-ownership heuristic (CIOH), computed
   client-side. When one transaction spends coins sitting on several
   addresses, analysts assume a single owner signed them all — the workhorse
   heuristic of every chain-surveillance firm. We already fetch full input
   prevouts, so we can show the user the exact cluster an analyst would
   build around their address. Equal-output CoinJoins are excluded: their
   inputs deliberately do NOT imply one owner (analysts exclude them too).
───────────────────────────────────────────── */
function computeCluster(txs, address) {
  const links = new Map(); // other input addr -> spend count
  let spends = 0, cjExcluded = 0;
  const list = txs || [];
  list.forEach(tx => {
    const vin = tx.vin || [], vout = tx.vout || [];
    const inAddrs = vin.map(v => v.prevout?.scriptpubkey_address).filter(Boolean);
    if (!inAddrs.includes(address)) return; // only spends FROM this address link anything
    if (isCoinJoinShape(vin, vout)) { cjExcluded++; return; }
    spends++;
    new Set(inAddrs).forEach(a => { if (a !== address) links.set(a, (links.get(a) || 0) + 1); });
  });
  const linked = [...links.entries()].map(([addr, count]) => ({ addr, count })).sort((a, b) => b.count - a.count);
  return { linked, spends, cjExcluded, sample: list.length };
}

/* ─────────────────────────────────────────────
   ADDRESS-POISONING DETECTOR — scammers vanity-generate an address matching
   the first & last characters of yours, plant it in your history with a tiny
   transfer, and wait for you to copy the wrong one. Matching 4 chars after
   the prefix AND the last 4 (bech32 charset = 32 symbols) has a ~32⁻⁸ random
   collision rate — essentially zero false positives, loud alarm on real bait.
   Deliberately NOT scored: being targeted doesn't make a wallet more
   traceable. It's a safety alert with its own job.
───────────────────────────────────────────── */
function isLookalikeAddress(a, b) {
  if (!a || !b || a === b) return false;
  const pfx = s => (s.startsWith("bc1q") || s.startsWith("bc1p")) ? 4 : (s[0] === "1" || s[0] === "3") ? 1 : 0;
  const pa = pfx(a), pb = pfx(b);
  if (!pa || !pb || a.slice(0, pa) !== b.slice(0, pb)) return false; // same address type only
  if (a.length < pa + 8 || b.length < pb + 8) return false;
  return a.slice(pa, pa + 4) === b.slice(pb, pb + 4) && a.slice(-4) === b.slice(-4);
}

function computePoisoning(txs, address) {
  const hits = new Map(); // lookalike addr -> first tx it appeared in
  (txs || []).forEach(tx => {
    const seen = new Set();
    (tx.vout || []).forEach(o => { if (o.scriptpubkey_address) seen.add(o.scriptpubkey_address); });
    (tx.vin || []).forEach(v => { if (v.prevout?.scriptpubkey_address) seen.add(v.prevout.scriptpubkey_address); });
    seen.forEach(a => {
      if (!hits.has(a) && isLookalikeAddress(address, a)) hits.set(a, { addr: a, txid: tx.txid });
    });
  });
  return { lookalikes: [...hits.values()], sample: (txs || []).length };
}

function ClusterMap({ txs, address, isMobile, entity, onScan }) {
  const third = !!entity;
  const [showAll, setShowAll] = useState(false);
  const { linked, spends, cjExcluded, sample } = computeCluster(txs, address);
  const isDemo = address === "DEMO" || address === "DEMO_A";
  const trunc = a => a.length > 17 ? `${a.slice(0, 10)}…${a.slice(-5)}` : a;
  const you = third ? "this wallet" : "your wallet";
  // Radial graph geometry — scanned address centred, linked addresses orbiting.
  const shown = linked.slice(0, 8);
  const W = 520, H = 220, CX = W / 2, CY = H / 2, RX = 185, RY = 78;
  const pos = i => {
    const a = (i / shown.length) * Math.PI * 2 - Math.PI / 2;
    return { x: CX + RX * Math.cos(a), y: CY + RY * Math.sin(a) };
  };
  const listRows = showAll ? linked : linked.slice(0, 4);
  return (
    <div style={{ background: T.card, border: `1px solid ${linked.length ? T.red + "33" : T.border}`, borderRadius: 16, padding: isMobile ? "16px 18px" : "20px 24px" }}>
      <div style={{ fontFamily: T.mono, fontSize: 9, color: linked.length ? T.red : T.cyan, letterSpacing: 2, marginBottom: 8 }}>CLUSTER EXPOSURE</div>
      <div style={{ fontFamily: T.serif, fontSize: isMobile ? 19 : 22, color: T.text, fontWeight: 400, marginBottom: 8 }}>
        {linked.length ? `The chain ties ${linked.length} other address${linked.length !== 1 ? "es" : ""} to ${you}` : "Addresses the chain would tie to this one"}
      </div>
      <div style={{ fontSize: 13, color: T.textMid, lineHeight: 1.65 }}>
        Spend from several addresses in one transaction and every analyst assumes a single owner signed them all — the <strong style={{ color: T.text }}>common-input heuristic</strong>, the workhorse of chain surveillance. This is the cluster it builds around {you}, computed in your browser from the transactions above.
      </div>
      {linked.length > 0 && (
        <>
          <svg viewBox={`0 0 ${W} ${H}`} role="img"
            aria-label={`Cluster graph: ${linked.length} address${linked.length !== 1 ? "es" : ""} linked to the scanned address by co-spending.`}
            style={{ display: "block", width: "100%", maxWidth: 560, height: "auto", margin: "14px auto 0", overflow: "visible" }}>
            {shown.map((n, i) => {
              const p = pos(i);
              return (
                <g key={n.addr} style={{ animation: `clusterIn .5s ease ${0.15 + i * 0.09}s both` }}>
                  <line x1={CX} y1={CY} x2={p.x} y2={p.y} stroke={T.red} strokeOpacity="0.4" strokeWidth="1.2" strokeDasharray="4 4" />
                  <circle cx={p.x} cy={p.y} r="11" fill={T.red} opacity="0.14" />
                  <circle cx={p.x} cy={p.y} r="6" fill={T.bg} stroke={T.red} strokeWidth="1.6">
                    <title>{n.addr} — co-spent with the scanned address in {n.count} transaction{n.count !== 1 ? "s" : ""}</title>
                  </circle>
                  <text x={p.x} y={p.y + (p.y >= CY ? 22 : -14)} textAnchor="middle" fontFamily={T.mono} fontSize="8.5" fill={T.textMid}>{trunc(n.addr)}</text>
                </g>
              );
            })}
            {linked.length > shown.length && (
              <text x={CX} y={H - 4} textAnchor="middle" fontFamily={T.mono} fontSize="9" fill={T.textDim}>+{linked.length - shown.length} more not drawn</text>
            )}
            <circle cx={CX} cy={CY} r="30" fill={T.cyan} style={{ animation: "haloPulse 4s ease-in-out infinite" }} />
            <circle cx={CX} cy={CY} r="21" fill={T.bg} stroke={T.cyan} strokeWidth="2" />
            <text x={CX} y={CY + 3.5} textAnchor="middle" fontFamily={T.mono} fontSize="9" fill={T.cyan} letterSpacing="1">{third ? "WALLET" : "YOU"}</text>
          </svg>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 14 }}>
            {listRows.map(n => {
              const scannable = !!onScan && !isDemo && isValidBitcoinAddress(n.addr);
              return (
                <div key={n.addr} style={{ display: "flex", alignItems: "center", gap: 10, background: T.surface, border: `1px solid ${T.borderLo}`, borderRadius: 10, padding: "8px 12px" }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: T.red, flexShrink: 0 }} />
                  <span style={{ fontFamily: T.mono, fontSize: 12, color: T.text, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis" }}>{trunc(n.addr)}</span>
                  <span style={{ fontFamily: T.mono, fontSize: 10, color: T.textDim, flexShrink: 0 }}>co-spent ×{n.count}</span>
                  {scannable && (
                    <button onClick={() => onScan(n.addr)}
                      style={{ marginLeft: "auto", flexShrink: 0, background: "transparent", border: `1px solid ${T.cyan}55`, borderRadius: 8, padding: "5px 12px", color: T.cyan, fontFamily: T.sans, fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all .15s" }}
                      onMouseOver={e => { e.currentTarget.style.background = T.cyan + "14"; }}
                      onMouseOut={e => { e.currentTarget.style.background = "transparent"; }}>
                      Audit →
                    </button>
                  )}
                </div>
              );
            })}
            {linked.length > 4 && (
              <button onClick={() => setShowAll(s => !s)}
                style={{ background: "none", border: "none", fontFamily: T.mono, fontSize: 11, color: T.cyan, cursor: "pointer", padding: "4px 0", textAlign: "left" }}>
                {showAll ? "▲ show fewer" : `▼ show all ${linked.length} linked addresses`}
              </button>
            )}
          </div>
        </>
      )}
      {linked.length === 0 && (
        <div style={{ marginTop: 12, background: T.green + "12", border: `1px solid ${T.green}45`, borderRadius: 10, padding: "10px 14px", fontSize: 13, color: T.textMid, lineHeight: 1.6 }}>
          <span style={{ color: T.green, fontFamily: T.mono }}>✓</span>{" "}
          {spends === 0
            ? `None of the ${sample} most recent transactions spend from this address together with others — the heuristic has nothing to work with here.`
            : `No co-spend links across ${spends} spend${spends !== 1 ? "s" : ""} — each one used only this address, so the workhorse heuristic comes up empty.`}
        </div>
      )}
      <div style={{ fontSize: 11.5, color: T.textDim, lineHeight: 1.6, marginTop: 12, borderTop: `1px solid ${T.borderLo}`, paddingTop: 10 }}>
        A heuristic, not proof — PayJoin and exchange batching break the one-owner assumption{cjExcluded > 0 ? `, and ${cjExcluded} CoinJoin-style spend${cjExcluded !== 1 ? "s were" : " was"} excluded here for exactly that reason` : ""}. Read from the {sample} most recent transactions.
      </div>
    </div>
  );
}

function ExposureFlow({ txs, isMobile, onFix, entity, address, onScan }) {
  const list = (txs || []).slice(0, 8);
  const isRound = v => v >= 100000 && (v % 1000000 === 0 || v % 500000 === 0);
  // A dust "beacon" is a tiny *spendable* output planted to track you. An
  // OP_RETURN is a provably-unspendable data carrier (value 0) — NOT dust, and
  // flagging it as a tracking beacon (red, +leaky) is simply wrong. Guard both.
  const isOpReturn = o => o.scriptpubkey_type === "op_return";
  const isDust = o => !isOpReturn(o) && o.value > 0 && o.value < 546;
  const KIND = {
    dust:  { color: T.red,    label: "Dust (tracking beacon)" },
    reuse: { color: T.red,    label: "Change → address reuse" },
    mix:   { color: T.green,  label: "Mixed (CoinJoin)" },
    round: { color: T.btc,    label: "Round amount (exchange tell)" },
    spend: { color: T.cyan,   label: "Ordinary spend" },
    data:  { color: T.textDim, label: "Data (OP_RETURN)" },
  };
  if (!list.length) return (
    <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: 28, textAlign: "center", color: T.textMid, fontSize: 14 }}>
      No transactions to map — this address has no spending history to trace.
    </div>
  );
  // Aggregate forensic readout across the mapped transactions.
  const stat = { consolidation: 0, coinjoin: 0, reuse: 0, dust: 0, round: 0, linked: 0, leaky: 0 };
  list.forEach(tx => {
    const vin = tx.vin || [], vout = tx.vout || [];
    const inAddrs = new Set(vin.map(v => v.prevout?.scriptpubkey_address).filter(Boolean));
    const cj = isCoinJoinShape(vin, vout);
    const cons = vin.length >= 4 && vout.length <= 2;
    const dust = vout.some(isDust);
    const reuse = vout.some(o => o.scriptpubkey_address && inAddrs.has(o.scriptpubkey_address));
    const round = vout.some(o => isRound(o.value));
    if (cj) stat.coinjoin++;
    if (cons) { stat.consolidation++; stat.linked += vin.length; }
    if (dust) stat.dust++;
    if (reuse) stat.reuse++;
    if (round && !cj) stat.round++;
    if (cons || dust || reuse || (round && !cj)) stat.leaky++;
  });
  const verdict = stat.leaky === 0
    ? "Clean pass — nothing in these transactions obviously links your coins or identifies you."
    : `An analyst can tie your activity together from ${stat.leaky} of ${list.length} transaction${list.length !== 1 ? "s" : ""} here.`;
  const findings = [];
  if (stat.consolidation) findings.push({ ok: false, t: `${stat.linked}+ of your addresses provably share one owner (consolidation)` });
  if (stat.round) findings.push({ ok: false, t: `${stat.round} withdrawal${stat.round !== 1 ? "s" : ""} fingerprint a KYC exchange (round amounts)` });
  if (stat.reuse) findings.push({ ok: false, t: `${stat.reuse} change output${stat.reuse !== 1 ? "s" : ""} returned to an address you'd reused` });
  if (stat.dust) findings.push({ ok: false, t: `${stat.dust} transaction${stat.dust !== 1 ? "s" : ""} carry dust tracking beacons` });
  if (stat.coinjoin) findings.push({ ok: true, t: `${stat.coinjoin} CoinJoin${stat.coinjoin !== 1 ? "s" : ""} break${stat.coinjoin === 1 ? "s" : ""} the trail — your defence here` });
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: isMobile ? "16px 18px" : "20px 24px" }}>
        <div style={{ fontFamily: T.mono, fontSize: 9, color: T.cyan, letterSpacing: 2, marginBottom: 8 }}>EXPOSURE MAP</div>
        <div style={{ fontFamily: T.serif, fontSize: isMobile ? 19 : 22, color: T.text, fontWeight: 400, marginBottom: 8 }}>What a blockchain analyst sees</div>
        <div style={{ fontSize: 13, color: T.textMid, lineHeight: 1.65, marginBottom: 14 }}>
          Every transaction is public and permanent. Your coins flow left → right: inputs into each transaction, then out to their destinations. Each output is colored by what it leaks — this is the exact view surveillance firms build from the chain.
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          {[KIND.spend, KIND.mix, KIND.round, KIND.reuse, KIND.dust, KIND.data].map(k => (
            <span key={k.label} style={{ display: "inline-flex", alignItems: "center", gap: 5, fontFamily: T.mono, fontSize: 9, color: T.textMid }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: k.color, flexShrink: 0 }} />{k.label}
            </span>
          ))}
        </div>
      </div>
      <div style={{ background: stat.leaky ? T.red + "10" : T.green + "12", border: `1px solid ${stat.leaky ? T.red + "40" : T.green + "45"}`, borderRadius: 16, padding: isMobile ? "16px 18px" : "18px 22px" }}>
        <div style={{ fontFamily: T.mono, fontSize: 9, color: stat.leaky ? T.red : T.green, letterSpacing: 2, marginBottom: 8 }}>FORENSIC READOUT</div>
        <div style={{ fontSize: isMobile ? 14 : 15, color: T.text, lineHeight: 1.6, marginBottom: findings.length ? 12 : 0, fontWeight: 500 }}>{verdict}</div>
        {findings.length > 0 && (
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 7, padding: 0, margin: 0 }}>
            {findings.map((f, i) => (
              <li key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 13, color: T.textMid, lineHeight: 1.5 }}>
                <span style={{ color: f.ok ? T.green : T.red, flexShrink: 0, marginTop: 1, fontFamily: T.mono }}>{f.ok ? "✓" : "→"}</span>
                {f.t}
              </li>
            ))}
          </ul>
        )}
        {stat.leaky > 0 && onFix && (
          <button onClick={onFix} style={{ marginTop: 14, background: "transparent", border: `1px solid ${T.cyan}55`, borderRadius: 10, padding: "9px 16px", color: T.cyan, fontFamily: T.sans, fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all .15s" }}
            onMouseOver={e => { e.currentTarget.style.background = T.cyan + "14"; }}
            onMouseOut={e => { e.currentTarget.style.background = "transparent"; }}>
            See how to fix these →
          </button>
        )}
      </div>
      <ClusterMap txs={txs} address={address} isMobile={isMobile} entity={entity} onScan={onScan} />
      <ActivityClock txs={txs} isMobile={isMobile} entity={entity} />
      {list.map((tx, ti) => {
        const vin = tx.vin || [], vout = tx.vout || [];
        const inputAddrs = new Set(vin.map(v => v.prevout?.scriptpubkey_address).filter(Boolean));
        const outs = vout.slice(0, 8);
        const extra = vout.length - outs.length;
        const maxOut = Math.max(...vout.map(o => o.value || 0), 1);
        const inCount = vin.length, outCount = vout.length;
        const denom = {}; vout.forEach(o => { denom[o.value] = (denom[o.value] || 0) + 1; });
        const coinjoin = isCoinJoinShape(vin, vout);
        const consolidation = inCount >= 4 && outCount <= 2;
        const hasDust = vout.some(isDust);
        const hasReuse = vout.some(o => o.scriptpubkey_address && inputAddrs.has(o.scriptpubkey_address));
        const hasRound = vout.some(o => isRound(o.value));
        const classify = o => {
          if (isOpReturn(o)) return KIND.data;
          if (isDust(o)) return KIND.dust;
          if (o.scriptpubkey_address && inputAddrs.has(o.scriptpubkey_address)) return KIND.reuse;
          if (coinjoin && denom[o.value] >= 3) return KIND.mix;
          if (isRound(o.value)) return KIND.round;
          return KIND.spend;
        };
        const flags = [];
        if (coinjoin) flags.push({ l: "CoinJoin", c: T.green });
        if (consolidation) flags.push({ l: "Consolidation", c: T.red });
        if (hasReuse) flags.push({ l: "Change reuse", c: T.red });
        if (hasRound && !coinjoin) flags.push({ l: "Round amount", c: T.btc });
        if (hasDust) flags.push({ l: "Dust", c: T.red });
        if (!flags.length) flags.push({ l: "No obvious leak", c: T.green });
        const rowH = 22, top = 10, H = Math.max(72, outs.length * rowH + top * 2);
        const hubX = 118, hubY = H / 2, outX = 196, barMax = isMobile ? 78 : 100;
        const worst = flags.some(f => f.c === T.red) ? T.red : coinjoin ? T.green : hasRound ? T.btc : T.cyan;
        const age = tx.status?.block_time ? Math.floor((Date.now() / 1000 - tx.status.block_time) / 86400) : null;
        const explain = coinjoin ? "Joined a set of equal-value outputs — a CoinJoin that breaks the trail between your coins."
          : consolidation ? `Merged ${inCount} separate inputs into one output — those coins are now provably the same owner.`
          : hasReuse ? "Change returned to an address you'd already used — this links the spend back to your history."
          : hasDust ? "Contains a dust output — a tiny ‘beacon’ analysts plant to track where your coins go next."
          : hasRound ? "A round-number output — the classic fingerprint of a withdrawal straight from a KYC exchange."
          : "No obvious linkage leak here — the inputs and outputs don't tie back to your other coins.";
        return (
          <div key={tx.txid || ti} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: isMobile ? "14px 14px" : "16px 20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
              <span style={{ fontFamily: T.mono, fontSize: 10, color: T.textDim }}>{fmt.txid(tx.txid)}</span>
              {age != null && <span style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim }}>· {age === 0 ? "today" : age + "d ago"}</span>}
              <span style={{ marginLeft: "auto", display: "flex", gap: 5, flexWrap: "wrap" }}>{flags.map((f, fi) => <Tag key={fi} label={f.l} color={f.c} size={9} />)}</span>
            </div>
            <svg viewBox={`0 0 ${outX + barMax + 92} ${H}`} style={{ display: "block", width: "100%", maxWidth: outX + barMax + 92, height: "auto", overflow: "visible" }} role="img" aria-label={`Transaction with ${inCount} input${inCount !== 1 ? "s" : ""} and ${outCount} output${outCount !== 1 ? "s" : ""}`}>
              <rect x="6" y={hubY - 18} width="46" height="36" rx="8" fill={T.cardAlt} stroke={T.border} />
              <text x="29" y={hubY - 1} textAnchor="middle" fontFamily={T.mono} fontSize="12" fill={T.text} fontWeight="700">{inCount}</text>
              <text x="29" y={hubY + 11} textAnchor="middle" fontFamily={T.mono} fontSize="7" fill={T.textDim} letterSpacing="1">{inCount === 1 ? "INPUT" : "INPUTS"}</text>
              <path d={`M52 ${hubY} C85 ${hubY} 85 ${hubY} ${hubX} ${hubY}`} stroke={T.border} strokeWidth="2" fill="none" />
              <circle cx={hubX} cy={hubY} r="5.5" fill={worst} style={{ filter: `drop-shadow(0 0 5px ${worst})` }} />
              {outs.map((o, oi) => {
                const k = classify(o), y = top + oi * rowH + 6, w = Math.max(7, (o.value / maxOut) * barMax);
                return (
                  <g key={oi}>
                    <path d={`M${hubX + 5} ${hubY} C${(hubX + outX) / 2} ${hubY} ${(hubX + outX) / 2} ${y + 5} ${outX} ${y + 5}`} stroke={k.color} strokeOpacity="0.45" strokeWidth="1.6" fill="none" />
                    <rect x={outX} y={y} width={w} height="10" rx="4" fill={k.color}><title>{fmt.btc(o.value)} — {k.label}</title></rect>
                    <text x={outX + w + 6} y={y + 9} fontFamily={T.mono} fontSize="9" fill={T.textDim}>{fmt.btc(o.value)}</text>
                  </g>
                );
              })}
              {extra > 0 && <text x={outX} y={top + outs.length * rowH + 9} fontFamily={T.mono} fontSize="9" fill={T.textDim}>+{extra} more output{extra !== 1 ? "s" : ""}</text>}
            </svg>
            <div style={{ fontSize: 12.5, color: T.textMid, lineHeight: 1.55, marginTop: 10, borderTop: `1px solid ${T.borderLo}`, paddingTop: 10 }}>{explain}</div>
          </div>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────
   THREAT MODEL LENS — "who are you hiding from?" Privacy advice ranked for
   everyone at once is ranked for no one: the fix that matters most against a
   chain-surveillance firm (break the graph) isn't the one that matters most
   against a nosy acquaintance (stop showing your balance). Each weight maps a
   Fix It recommendation key → how decisive that fix is against the adversary
   (3 = front line, 0 = still worth doing, lower priority here). Selection is
   session-only — nothing is stored.
───────────────────────────────────────────── */
const THREAT_MODELS = [
  { id: "snoop", label: "Nosy individuals", icon: "👀",
    sees: "Anyone who knows this address — an ex, a landlord, someone who paid you once — can read its balance and full history on a free explorer. The defense is showing them less: fresh addresses, a spread-out balance, day-to-day spending off-chain.",
    w: { reuse: 3, conc: 3, lightning: 3, change: 2, utxo: 1, node: 1 } },
  { id: "exchange", label: "KYC exchanges", icon: "🏦",
    sees: "An exchange knows your identity and watches where withdrawals go — and many report to chain-analysis partners. The defense is cutting the thread at the withdrawal: odd amounts, no reuse, and breaking the trail before coins reach your main stack.",
    w: { round: 3, reuse: 3, cj: 3, cons: 2, payjoin: 2, node: 1 } },
  { id: "analyst", label: "Surveillance firms", icon: "🛰️",
    sees: "Chain-analysis firms cluster the entire graph — co-spends, change patterns, dust responses, wallet fingerprints — and sell the map to exchanges and governments. The defense is starving their heuristics: mixing, Payjoin, and strict coin control.",
    w: { cj: 3, payjoin: 3, cons: 3, dust: 3, changeid: 3, change: 2, fee: 2, reuse: 2, conc: 1, round: 1 } },
  { id: "attacker", label: "A targeted attacker", icon: "🎯",
    sees: "Someone after you specifically — a thief, a stalker, a hostile state — combines everything above with your visible balance and timing patterns. The defense is everything here, starting with never showing your net worth on every spend.",
    w: { conc: 3, reuse: 3, node: 3, cj: 2, lightning: 2, dust: 2, cons: 2, change: 1, changeid: 1, fee: 1, round: 1 } },
];

function Dashboard({ address, addrInfo, utxos, txs, isMobile, onBack, onRescan, toast, autoShare, scanAt, defaultSimple, simpleMode: simpleModeFromApp, onSimpleModeChange, onCoach, delta }) {
  const [tab, setTab] = useState("Fix It");
  const [threat, setThreat] = useState(null); // null = ranked for everyone; session-only, never stored
  const clusterN = useMemo(() => computeCluster(txs, address).linked.length, [txs, address]);
  const poison = useMemo(() => computePoisoning(txs, address), [txs, address]);
  const caseEntity = CASE_FILES.find(c => c.address === address)?.entity;
  const [simpleMode, setSimpleMode] = useState(simpleModeFromApp !== undefined ? simpleModeFromApp : (defaultSimple || false));
  const setSimpleModeSync = (val) => { setSimpleMode(val); onSimpleModeChange && onSimpleModeChange(val); };
  const [shareOpen, setShareOpen] = useState(false);
  const [selectedUtxo, setSelectedUtxo] = useState(null);
  const [doneFixes, setDoneFixes] = useState(() => getDoneFixes(address));

  const toggleDone = (key) => setDoneFixes(prev => {
    const next = new Set(prev);
    next.has(key) ? next.delete(key) : next.add(key);
    saveDoneFixes(address, next);
    return next;
  });
  const [aiStage, setAiStage] = useState(null);
  const [aiWidgetMin, setAiWidgetMin] = useState(false);
  const openAi = () => setAiStage("consent");

  const txCount = addrInfo?.chain_stats?.tx_count || txs.length;
  const analysis = useMemo(() => runEngine(utxos, txs, txCount), [utxos, txs, txCount]);
  const { score, grade, riskLabel, riskColor, checks, recommendations, isEmpty } = analysis;
  // Use addrInfo aggregate balance (accurate) — falls back to summing sampled UTXOs for demo/edge cases
  const totalSats = useMemo(() => {
    const funded = addrInfo?.chain_stats?.funded_txo_sum ?? null;
    const spent  = addrInfo?.chain_stats?.spent_txo_sum  ?? null;
    if (funded !== null && spent !== null) return funded - spent;
    return utxos.reduce((s, u) => s + u.value, 0);
  }, [addrInfo, utxos]);
  const issueCount = checks.filter(c => c.status !== "pass").length;
  const TABS = isMobile
    ? ["Fix It","Overview","Flow","UTXOs","Transactions"]
    : ["Fix It","Overview","Flow","UTXOs","Transactions","Methodology"];

  useEffect(() => {
    if (!autoShare) return;
    const t = setTimeout(() => {
      toast.show("Share your score", { icon: "🔗", color: T.cyan, msg: `Grade ${grade} — tap 'Share score' to post it` });
    }, 8000);
    return () => clearTimeout(t);
  }, [autoShare, grade, toast]);

  // High-score celebration — confetti burst once per scan when score ≥ 85
  useEffect(() => {
    if (score < 85 || isEmpty) return;
    if (typeof window === "undefined" || typeof window.confetti !== "function") return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const fire = (ratio, opts) => window.confetti({
      particleCount: Math.floor(180 * ratio),
      spread: 70,
      startVelocity: 45,
      ticks: 200,
      origin: { y: 0.35 },
      colors: [T.cyan, T.green, T.btc, T.blue, "#ffffff"],
      disableForReducedMotion: true,
      ...opts,
    });
    const id = setTimeout(() => {
      fire(0.25, { spread: 26, startVelocity: 55 });
      fire(0.2,  { spread: 60 });
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.9 });
      fire(0.1,  { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
      fire(0.1,  { spread: 120, startVelocity: 45 });
    }, 700); // wait for score counter + ring to nearly fill
    return () => clearTimeout(id);
  }, [score, isEmpty]);

  // Empty address — show a clear message instead of a misleading score
  if (isEmpty) return (
    <div role="main" aria-label="Empty address" style={{ minHeight: "100vh", background: "transparent", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, gap: 20 }}>
      <h1 className="sr-only">This address has no on-chain history</h1>
      <div style={{ fontFamily: T.mono, fontSize: 10, color: T.textDim, letterSpacing: 2 }}>NO ON-CHAIN HISTORY</div>
      <div style={{ fontFamily: T.serif, fontSize: 28, color: T.text, textAlign: "center", fontWeight: 400 }}>This address has never been used.</div>
      <div style={{ fontSize: 14, color: T.textMid, maxWidth: 400, textAlign: "center", lineHeight: 1.7 }}>
        No transactions, no UTXOs. There's nothing to score yet — paste an address that has received Bitcoin at least once.
      </div>
      <div style={{ fontFamily: T.mono, fontSize: 11, color: T.textDim, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: "10px 16px" }}>
        {address === "DEMO" || address === "DEMO_A" ? "Demo Wallet" : address}
      </div>
      <button onClick={onBack} style={{ background: T.cyan, border: "none", borderRadius: 10, padding: "12px 24px", color: T.bg, fontFamily: T.sans, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
        ← Try a different address
      </button>
    </div>
  );

  const handleRescan = () => onRescan(address);

  const exportReport = () => {
    const lines = [
      "ANONSCORE — PRIVACY REPORT",
      "===========================",
      `Address:    ${address}`,
      `Score:      ${score}/100 (Grade ${grade})`,
      `Risk:       ${riskLabel}`,
      `Scanned:    ${scanAt ? new Date(scanAt).toUTCString() : "—"}`,
      `UTXOs:      ${utxos.length}  |  Transactions: ${txCount}`,
      "",
      "SCORE BREAKDOWN (every wallet starts at 100)",
      "--------------------------------------------",
      ...checks.filter(c => c.pts).sort((a, b) => a.pts - b.pts).map(c => `  ${c.pts > 0 ? "+" + c.pts : c.pts}\t${c.name}`),
      `  = ${score}/100`,
      "",
      "CHECKS",
      "------",
      ...checks.map(c => `[${c.status === "pass" ? "PASS" : c.status === "warn" ? "WARN" : "FAIL"}] ${c.name}: ${c.plain}`),
      "",
      "RECOMMENDATIONS",
      "---------------",
      ...recommendations.map((r, i) => `${i+1}. ${r.action} (+${r.impact}pts, ${r.effort})\n   ${r.plain}\n   Options: ${(r.tools||[{name:r.tool}]).map(t=>t.name).join(", ")}`),
      "",
      "TIMING ANALYSIS (non-scoring insight)",
      "-------------------------------------",
      ...(() => {
        const c = computeActivityClock(txs);
        if (!c.hasData) return ["Not enough timestamped history to read a daily rhythm."];
        return c.strong
          ? [`Quietest window: ${c.hh(c.qStart)}-${c.hh(c.qEnd)} UTC. If that's sleep, an analyst would estimate ${c.tz} (+/-2).`,
             `Based on the ${c.total} most recent transactions${c.total < 12 ? " (small sample - rough read)" : ""}.`]
          : [`No strong daily rhythm across the ${c.total} most recent transactions - timing reveals little here.`];
      })(),
      "",
      "Generated by AnonScore — anonscore.com — open source, no data stored",
    ];
    const a = document.createElement("a");
    const url = URL.createObjectURL(new Blob([lines.join("\n")], { type: "text/plain" }));
    a.href = url;
    a.download = `anonscore-${address.slice(0,8)}-${Date.now()}.txt`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 4000); // free the blob once the download has started
    toast.show("Report downloaded", { icon: "📥", color: T.blue });
  };

  return (
    <div role="main" aria-label={`Privacy audit for ${address === "DEMO" || address === "DEMO_A" ? "demo wallet" : address}`} style={{ minHeight: "100vh", background: "transparent", display: "flex", flexDirection: "column", paddingBottom: isMobile ? 64 : 0 }}>
      <h1 className="sr-only">Privacy score {score} of 100, grade {grade} — {riskLabel}</h1>
      {/* Nav */}
      <nav style={{ display: "flex", alignItems: "center", gap: 10, padding: isMobile ? "12px 16px" : "12px 32px", borderBottom: `1px solid ${T.border}`, background: T.bg, position: "sticky", top: 0, zIndex: 100 }}>
        <button onClick={onBack} style={{ background: "transparent", border: `1.5px solid ${T.border}`, borderRadius: 8, padding: "7px 12px", color: T.textMid, fontFamily: T.sans, fontSize: 13, cursor: "pointer", transition: "border .15s" }}
          onMouseOver={e => e.currentTarget.style.borderColor = T.cyan}
          onMouseOut={e => e.currentTarget.style.borderColor = T.border}>← Back</button>
        {!isMobile && <div style={{ fontFamily: T.display, fontSize: 15, letterSpacing: 4, fontWeight: 700 }}>ANON<span style={{ color: T.cyan }}>SCORE</span></div>}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: T.mono, fontSize: 11, color: T.textDim, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{address === "DEMO" || address === "DEMO_A" ? "Demo Wallet" : fmt.addr(address)}</div>
          {scanAt && <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, marginTop: 2 }}>Scanned {fmt.age(scanAt / 1000)}</div>}
        </div>
        <div style={{ display: "flex", gap: 8, flexShrink: 0, alignItems: "center" }}>
          <Tag label={riskLabel} color={riskColor} size={10} />
          {isMobile && (
            <>
              <button onClick={() => setShareOpen(true)} style={{ background: "transparent", border: `1.5px solid ${T.border}`, borderRadius: 8, padding: "6px 10px", color: T.textMid, fontSize: 12, cursor: "pointer" }}>Share</button>
              <button onClick={exportReport} style={{ background: "transparent", border: `1.5px solid ${T.border}`, borderRadius: 8, padding: "6px 10px", color: T.textMid, fontSize: 12, cursor: "pointer" }}>Export</button>
            </>
          )}
          {!isMobile && (
            <>
              <button onClick={handleRescan} style={{ background: "transparent", border: `1.5px solid ${T.border}`, borderRadius: 8, padding: "6px 12px", color: T.textMid, fontSize: 13, cursor: "pointer", transition: "all .15s" }}
                onMouseOver={e => e.currentTarget.style.borderColor = T.cyan}
                onMouseOut={e => e.currentTarget.style.borderColor = T.border}>↻ Re-scan</button>
              <button onClick={() => setShareOpen(true)} style={{ background: "transparent", border: `1.5px solid ${T.border}`, borderRadius: 8, padding: "6px 12px", color: T.textMid, fontSize: 13, cursor: "pointer", transition: "all .15s" }}
                onMouseOver={e => e.currentTarget.style.borderColor = T.cyan}
                onMouseOut={e => e.currentTarget.style.borderColor = T.border}>Share</button>
              <div style={{ position: "relative" }} onMouseEnter={e => e.currentTarget.querySelector(".export-tip").style.opacity = 1} onMouseLeave={e => e.currentTarget.querySelector(".export-tip").style.opacity = 0}>
                <button onClick={exportReport} style={{ background: "transparent", border: `1.5px solid ${T.border}`, borderRadius: 8, padding: "6px 12px", color: T.textMid, fontSize: 13, cursor: "pointer", transition: "all .15s" }}
                  onMouseOver={e => e.currentTarget.style.borderColor = T.cyan}
                  onMouseOut={e => e.currentTarget.style.borderColor = T.border}>Export</button>
                <div className="export-tip" style={{ position: "absolute", bottom: "calc(100% + 8px)", right: 0, background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, padding: "8px 12px", fontSize: 11, color: T.textMid, whiteSpace: "nowrap", pointerEvents: "none", opacity: 0, transition: "opacity .15s", zIndex: 50 }}>
                  Downloads a .txt file of your full results
                  <div style={{ position: "absolute", bottom: -4, right: 16, width: 8, height: 8, background: T.card, border: `1px solid ${T.border}`, borderRight: "none", borderTop: "none", transform: "rotate(-45deg)" }} />
                </div>
              </div>
            </>
          )}
        </div>
      </nav>

      <div style={{ flex: 1, padding: isMobile ? "12px 12px" : "16px 32px", maxWidth: 1100, margin: "0 auto", width: "100%" }}>
        {/* ── Compact summary bar ── */}
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: isMobile ? "12px 14px" : "12px 20px", marginBottom: 12, display: "flex", alignItems: "center", gap: isMobile ? 12 : 20, flexWrap: "wrap", animation: "fadeUp .35s ease both" }}>
          {/* Score ring — smaller */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            <ScoreRing score={score} size={52} />
            <div>
              <div style={{ fontFamily: T.serif, fontSize: 20, color: riskColor, lineHeight: 1, animation: `popIn .55s cubic-bezier(.34,1.56,.64,1) .85s both${score < 30 ? ", shake .5s ease 2s" : ""}`, transformOrigin: "left center" }}>Grade {grade}</div>
              <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, letterSpacing: 1, marginTop: 2, animation: "fadeIn .35s ease 1.4s both" }}>{score}/100</div>
            </div>
          </div>

          <div style={{ width: 1, height: 36, background: T.border, flexShrink: 0 }} />

          {/* Issues — most important, highlighted */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <div style={{ background: T.red + "18", border: `1px solid ${T.red}44`, borderRadius: 8, padding: "4px 10px", display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ fontFamily: T.mono, fontSize: 16, fontWeight: 700, color: T.red, lineHeight: 1 }}>{checks.filter(c => c.status === "fail").length}</span>
              <span style={{ fontFamily: T.mono, fontSize: 9, color: T.red, letterSpacing: 0.5 }}>FAIL</span>
            </div>
            <div style={{ background: T.amber + "18", border: `1px solid ${T.amber}44`, borderRadius: 8, padding: "4px 10px", display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ fontFamily: T.mono, fontSize: 16, fontWeight: 700, color: T.amber, lineHeight: 1 }}>{checks.filter(c => c.status === "warn").length}</span>
              <span style={{ fontFamily: T.mono, fontSize: 9, color: T.amber, letterSpacing: 0.5 }}>WARN</span>
            </div>
            <div style={{ background: T.green + "18", border: `1px solid ${T.green}44`, borderRadius: 8, padding: "4px 10px", display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ fontFamily: T.mono, fontSize: 16, fontWeight: 700, color: T.green, lineHeight: 1 }}>{checks.filter(c => c.status === "pass").length}</span>
              <span style={{ fontFamily: T.mono, fontSize: 9, color: T.green, letterSpacing: 0.5 }}>PASS</span>
            </div>
          </div>

          <div style={{ width: 1, height: 36, background: T.border, flexShrink: 0 }} />

          {/* Other stats — slim */}
          <div style={{ display: "flex", gap: isMobile ? 14 : 24, flexWrap: "wrap" }}>
            {[
              { label: "BALANCE", val: `₿${(totalSats/1e8).toFixed(4)}`, sub: `${addrInfo?.chain_stats?.funded_txo_count != null ? (addrInfo.chain_stats.funded_txo_count - (addrInfo.chain_stats.spent_txo_count||0)) : utxos.length} UTXOs`, color: T.blue },
              { label: "TXS", val: txCount, sub: "total", color: T.cyan },
              { label: "VS TYPICAL", val: score > 38 ? `+${score-38}` : `${score-38}`, sub: "typical ~38", color: score > 38 ? T.green : T.red },
              // The cluster the common-input heuristic builds — surfaced here so
              // the Flow tab's headline finding is discoverable at a glance.
              ...(clusterN > 0 ? [{ label: "CLUSTER", val: clusterN, sub: "linked addrs", color: T.red, onClick: () => setTab("Flow") }] : []),
              // Progress vs the user's own previous scan of this address — the
              // feedback loop for the Fix It plan. Only shown when it moved.
              ...(delta != null && delta !== 0 ? [{ label: "PROGRESS", val: delta > 0 ? `+${delta}` : `${delta}`, sub: "vs your last scan", color: delta > 0 ? T.green : T.red }] : []),
            ].map(s => s.onClick ? (
              <button key={s.label} onClick={s.onClick} title="See the cluster on the Flow tab"
                style={{ background: "none", border: "none", padding: 0, textAlign: "left", cursor: "pointer", fontFamily: "inherit" }}>
                <div style={{ fontFamily: T.mono, fontSize: 8, color: T.textDim, letterSpacing: 1.5, marginBottom: 2 }}>{s.label}</div>
                <div style={{ fontFamily: T.serif, fontSize: 18, color: s.color, lineHeight: 1 }}>{s.val}</div>
                <div style={{ fontSize: 10, color: T.cyan, marginTop: 1, textDecoration: "underline", textUnderlineOffset: 2 }}>{s.sub} →</div>
              </button>
            ) : (
              <div key={s.label}>
                <div style={{ fontFamily: T.mono, fontSize: 8, color: T.textDim, letterSpacing: 1.5, marginBottom: 2 }}>{s.label}</div>
                <div style={{ fontFamily: T.serif, fontSize: 18, color: s.color, lineHeight: 1 }}>{s.val}</div>
                <div style={{ fontSize: 10, color: T.textDim, marginTop: 1 }}>{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Fix potential — right-aligned */}
          <div style={{ marginLeft: "auto", flexShrink: 0, textAlign: "right" }}>
            <div style={{ fontFamily: T.mono, fontSize: 8, color: T.textDim, letterSpacing: 1.5, marginBottom: 2 }}>TOP 3 FIXES</div>
            <div style={{ fontFamily: T.serif, fontSize: 18, color: T.green, lineHeight: 1 }}>+{recommendations.slice(0, 3).reduce((a, r) => a + r.impact, 0)} pts</div>
            <div style={{ fontSize: 10, color: T.textDim, marginTop: 1 }}>potential gain</div>
          </div>
        </div>

        {/* Address-poisoning alert — a safety check, not a privacy metric, so it
            never moves the score. Loud on purpose: this is planted scam bait. */}
        {poison.lookalikes.length > 0 && (
          <div role="alert" style={{ display: "flex", gap: 12, alignItems: "flex-start", background: T.red + "14", border: `1.5px solid ${T.red}66`, borderRadius: 14, padding: "14px 18px", marginBottom: 14, animation: "slideDown .3s ease" }}>
            <span aria-hidden="true" style={{ fontSize: 20, lineHeight: 1 }}>🎣</span>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: T.mono, fontSize: 10, color: T.red, letterSpacing: 1.5, marginBottom: 4 }}>ADDRESS-POISONING BAIT DETECTED</div>
              <div style={{ fontSize: 13, color: T.text, lineHeight: 1.6 }}>
                {poison.lookalikes.length} address{poison.lookalikes.length !== 1 ? "es" : ""} in this history mimic{poison.lookalikes.length === 1 ? "s" : ""} this one — same first and last characters, different address. Scammers plant these hoping {caseEntity ? "the owner copies" : "you'll copy"} the wrong one from transaction history. <strong>Never copy an address out of history — verify every character before sending.</strong>
              </div>
              <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
                <div style={{ fontFamily: T.mono, fontSize: 11, color: T.textMid, wordBreak: "break-all" }}>
                  <span style={{ color: T.textDim }}>real&nbsp;&nbsp;</span>{address}
                </div>
                {poison.lookalikes.slice(0, 3).map(l => (
                  <div key={l.addr} style={{ fontFamily: T.mono, fontSize: 11, color: T.red, wordBreak: "break-all" }}>
                    <span style={{ color: T.textDim }}>bait&nbsp;&nbsp;</span>{l.addr}
                  </div>
                ))}
                {poison.lookalikes.length > 3 && (
                  <div style={{ fontFamily: T.mono, fontSize: 10, color: T.textDim }}>+{poison.lookalikes.length - 3} more</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tabs + Simple Mode toggle — desktop only; mobile uses bottom bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 14 }}>
          {!isMobile && (
            <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 2 }}>
              {TABS.map(t => <Pill key={t} active={tab === t} onClick={() => setTab(t)}>{t}</Pill>)}
            </div>
          )}
          <button onClick={() => setSimpleModeSync(!simpleMode)} style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 7, background: simpleMode ? T.cyan : T.surface, border: `1.5px solid ${simpleMode ? T.cyan : T.border}`, borderRadius: 20, padding: "8px 16px", cursor: "pointer", transition: "all .2s", boxShadow: simpleMode ? `0 0 12px ${T.cyanMid}` : "none" }}
            onMouseOver={e => { e.currentTarget.style.borderColor = T.cyan; if (!simpleMode) e.currentTarget.style.background = T.cyan + "18"; }}
            onMouseOut={e => { e.currentTarget.style.borderColor = simpleMode ? T.cyan : T.border; if (!simpleMode) e.currentTarget.style.background = T.surface; }}>
            <span style={{ fontSize: 14 }}>💬</span>
            <span style={{ fontSize: 12, fontFamily: T.sans, fontWeight: 700, color: simpleMode ? T.bg : T.textMid, whiteSpace: "nowrap" }}>{simpleMode ? "✓ Plain English ON" : "Plain English"}</span>
          </button>
        </div>

        {/* ── FIX IT — default tab ── */}
        {tab === "Fix It" && (() => {
          const tm = THREAT_MODELS.find(m => m.id === threat) || null;
          const weight = r => tm ? (tm.w[r.key] || 0) : 0;
          const shownRecs = tm
            ? [...recommendations].sort((a, b) => weight(b) - weight(a) || b.impact - a.impact)
            : recommendations;
          return (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {/* Threat-model lens — re-ranks the same plan for a chosen adversary */}
            <div style={{ background: T.card, border: `1px solid ${tm ? T.cyan + "44" : T.border}`, borderRadius: 14, padding: "12px 16px", marginBottom: 2 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <span style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, letterSpacing: 1.5, flexShrink: 0 }}>WHO ARE YOU HIDING FROM?</span>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  <Pill active={!tm} onClick={() => setThreat(null)}>Everyone</Pill>
                  {THREAT_MODELS.map(m => (
                    <Pill key={m.id} active={threat === m.id} onClick={() => setThreat(threat === m.id ? null : m.id)}>{m.icon} {m.label}</Pill>
                  ))}
                </div>
              </div>
              {tm && (
                <div style={{ fontSize: 12.5, color: T.textMid, lineHeight: 1.6, marginTop: 10, borderTop: `1px solid ${T.borderLo}`, paddingTop: 10 }}>
                  {tm.sees}
                </div>
              )}
            </div>
            <div style={{ fontSize: 13, color: T.textMid, marginBottom: 4 }}>
              {tm
                ? <>Re-ranked for <strong style={{ color: T.cyan }}>{tm.label.toLowerCase()}</strong>. Impact points are unchanged — only the priorities shift with the adversary.</>
                : <>Sorted by impact. Fixing the top 3 alone could raise your score by <strong style={{ color: T.cyan }}>{recommendations.slice(0, 3).reduce((a, r) => a + r.impact, 0)} points</strong>.</>}
            </div>
            {/* AI assistant card — privacy guarantees shown before clicking */}
            <div style={{ background: T.card, border: `1px solid ${T.cyan}33`, borderRadius: 16, overflow: "hidden", marginBottom: 2 }}>
              {/* Privacy badges — visible without any interaction */}
              <div style={{ display: "flex", gap: 0, borderBottom: `1px solid ${T.borderLo}` }}>
                {[
                  { icon: "✕", label: "Address never sent" },
                  { icon: "✕", label: "No data stored" },
                  { icon: "✕", label: "Not used for training" },
                ].map((badge, i) => (
                  <div key={i} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, padding: "7px 8px", borderRight: i < 2 ? `1px solid ${T.borderLo}` : undefined, background: T.greenLo }}>
                    <span style={{ fontFamily: T.mono, fontSize: 9, color: T.green, fontWeight: 700 }}>{badge.icon}</span>
                    <span style={{ fontFamily: T.mono, fontSize: 9, color: T.green, letterSpacing: 0.3, whiteSpace: "nowrap" }}>{badge.label}</span>
                  </div>
                ))}
              </div>
              {/* Main clickable area */}
              <button onClick={openAi} style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 18px", cursor: "pointer", textAlign: "left", width: "100%", background: "transparent", border: "none", transition: "background .15s" }}
                onMouseOver={e => e.currentTarget.style.background = T.cyan + "0a"}
                onMouseOut={e => e.currentTarget.style.background = "transparent"}>
                <div style={{ width: 36, height: 36, background: T.cyan + "18", border: `1px solid ${T.cyan}33`, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>✦</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 3 }}>Ask the Privacy Assistant</div>
                  <div style={{ fontSize: 12, color: T.textMid, lineHeight: 1.55 }}>
                    Get step-by-step guidance for your {checks.filter(c => c.status !== "pass").length} specific issues. Only your score and issue names are shared — never your address. <span style={{ color: T.textDim }}>5 questions per session.</span>
                  </div>
                </div>
                <div style={{ flexShrink: 0, textAlign: "center" }}>
                  <div style={{ background: T.cyan, borderRadius: 8, padding: "7px 14px", color: T.bg, fontSize: 12, fontWeight: 700, whiteSpace: "nowrap" }}>Ask now →</div>
                </div>
              </button>
              {/* Coach upsell — subtle, single line, validates demand */}
              {onCoach && (
                <div style={{ borderTop: `1px solid ${T.borderLo}`, padding: "8px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ fontFamily: T.mono, fontSize: 10, color: T.textDim }}>Hit the 5-question cap?</span>
                  <button onClick={onCoach}
                    style={{ background: "none", border: "none", padding: 0, fontFamily: T.mono, fontSize: 10, color: T.cyan, cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 3 }}>
                    Join the Coach early-access waitlist →
                  </button>
                </div>
              )}
            </div>
            {shownRecs.map((r, i) => {
              const done = doneFixes.has(r.key);
              const w = weight(r);
              const simple = SIMPLE.recs[r.key];
              const displayAction = simpleMode && simple ? simple.action : r.action;
              const displayPlain  = simpleMode && simple ? simple.plain  : r.plain;
              return (
              <div key={r.key || i} className={done ? "" : "lift"} style={{ background: done ? T.greenLo : T.card, border: `1px solid ${done ? T.green + "44" : T.border}`, borderLeft: done ? undefined : `3px solid ${r.status === "fail" ? T.red : r.status === "warn" ? T.amber : T.green}`, borderRadius: 16, padding: isMobile ? "18px 16px" : "20px 24px", display: "flex", gap: isMobile ? 12 : 20, animation: `fadeUp .35s ease ${i * .06}s both`, flexDirection: isMobile ? "column" : "row", transition: "border-color .2s, background-color .2s, filter .2s, transform .28s cubic-bezier(.16,.84,.44,1), box-shadow .28s", filter: done ? "opacity(0.65)" : (tm && w === 0 ? "opacity(0.8)" : "none") }}
                onMouseEnter={e => { if (!done) { e.currentTarget.style.borderColor = T.cyan + "55"; e.currentTarget.style.boxShadow = `0 10px 34px -14px ${T.cyan}77`; } }}
                onMouseLeave={e => { if (!done) { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.boxShadow = "none"; } }}>
                <div style={{ fontFamily: T.mono, fontSize: 11, color: T.textDim, flexShrink: 0, paddingTop: 2, minWidth: 28 }}>0{i + 1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <span key={done ? "done" : "todo"} style={{ fontSize: 18, display: "inline-block", animation: done ? "checkPop .45s cubic-bezier(.34,1.56,.64,1) both" : undefined }}>{done ? "✅" : r.icon}</span>
                    <div style={{ fontFamily: T.serif, fontSize: isMobile ? 17 : 20, color: done ? T.green : T.text, fontWeight: 400, textDecoration: done ? "line-through" : "none", transition: "color .25s ease" }}>{displayAction}</div>
                  </div>
                  {!done && <>
                    <div style={{ fontSize: 14, color: T.textMid, lineHeight: 1.7, marginBottom: 10 }}>{displayPlain}</div>
                    {!simpleMode && <div style={{ fontSize: 12, color: T.textDim, lineHeight: 1.6, background: T.surface, borderRadius: 8, padding: "10px 14px" }}><strong style={{ color: T.textMid }}>How:</strong> {r.detail}</div>}
                    <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
                      <span style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, letterSpacing: 1 }}>OPTIONS:</span>
                      {(r.tools || [{ name: r.tool, note: "" }]).map((t, ti) => {
                        const href = toolLink(t.name);
                        const aff = toolIsAffiliate(t.name);
                        const base = { fontFamily: T.mono, fontSize: 9, padding: "3px 8px", borderRadius: 4, background: T.cyan + "18", color: T.cyan, border: `1px solid ${T.cyan}30`, letterSpacing: 0.3, textDecoration: "none", cursor: href ? "pointer" : (t.note ? "help" : "default") };
                        const label = aff ? `${t.name} · affiliate` : t.name;
                        return href
                          ? <a key={ti} href={href} target="_blank" rel="noopener noreferrer nofollow" title={aff ? `${t.note ? t.note + " · " : ""}AnonScore earns a referral when you sign up — see /how-we-get-paid` : t.note} style={base}>{label}</a>
                          : <span key={ti} title={t.note} style={base}>{t.name}</span>;
                      })}
                    </div>
                    {!simpleMode && (r.tools || []).length > 0 && (
                      <div style={{ marginTop: 6, fontSize: 11, color: T.textDim, lineHeight: 1.55 }}>
                        {(r.tools || []).map((t, ti) => t.note ? <span key={ti}><span style={{ color: T.textMid }}>{t.name}</span> — {t.note}{ti < r.tools.length - 1 ? " · " : ""}</span> : null)}
                      </div>
                    )}
                  </>}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: isMobile ? "flex-start" : "flex-end", flexShrink: 0 }}>
                  <div style={{ fontFamily: T.serif, fontSize: 22, color: T.green }}>+{r.impact}pts</div>
                  {tm && !done && w === 3 && <Tag label="front line" color={T.cyan} size={9} />}
                  {tm && !done && w === 0 && <Tag label="lower priority here" color={T.textDim} size={9} />}
                  <Tag label={r.effort} color={r.effort === "Easy" ? T.green : r.effort === "Medium" ? T.amber : T.textMid} size={9} />
                  <button onClick={() => toggleDone(r.key)} style={{ background: done ? T.green : "transparent", border: `1.5px solid ${done ? T.green : T.border}`, borderRadius: 8, padding: "5px 10px", color: done ? T.bg : T.textDim, fontSize: 11, cursor: "pointer", transition: "all .2s", whiteSpace: "nowrap" }}>
                    {done ? "✓ Done" : "Mark done"}
                  </button>
                </div>
              </div>
              );
            })}
            {/* Projection */}
            <div style={{ background: T.greenLo, border: `1px solid ${T.green}33`, borderRadius: 14, padding: "18px 22px", display: "flex", gap: 14, alignItems: "center" }}>
              <div style={{ fontSize: 24 }}>🎯</div>
              <div>
                <div style={{ fontFamily: T.serif, fontSize: 17, color: T.text, fontWeight: 400 }}>After all fixes, projected score: <span style={{ color: T.green }}>{Math.min(score + recommendations.reduce((a, r) => a + r.impact, 0), 97)}/100</span></div>
                <div style={{ fontSize: 13, color: T.textMid, marginTop: 4 }}>Estimated: 1–3 weeks, depending on CoinJoin wait times.</div>
              </div>
            </div>
            <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, padding: "18px 22px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
              <div>
                <div style={{ fontFamily: T.serif, fontSize: 17, color: T.text, fontWeight: 400 }}>Share your privacy score</div>
                <div style={{ fontSize: 13, color: T.textMid, marginTop: 3 }}>Let your Nostr or Twitter followers check theirs.</div>
              </div>
              <button onClick={() => setShareOpen(true)} style={{ background: T.cyan, border: "none", borderRadius: 10, padding: "11px 20px", color: T.bg, fontFamily: T.sans, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>Share Grade {grade} →</button>
            </div>
          </div>
          );
        })()}

        {/* ── OVERVIEW ── */}
        {tab === "Overview" && (
          <>
          <ScoreBreakdown checks={checks} score={score} isMobile={isMobile} simpleMode={simpleMode} />
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12 }}>
            {/* Checks list */}
            <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: 22 }}>
              <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, letterSpacing: 2, marginBottom: 16 }}>PRIVACY CHECKS</div>
              {checks.map((c, i) => {
                const s = SIMPLE.checks[c.key];
                const displayName  = simpleMode && s ? s.name : c.name;
                const displayPlain = simpleMode && s
                  ? (c.status === "fail" ? s.fail_detail : c.status === "warn" ? s.warn_detail : s.pass_detail) || c.plain
                  : c.plain;
                return (
                <div key={c.key} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 12px", margin: "0 -12px", borderRadius: 8, borderBottom: i < checks.length - 1 ? `1px solid ${T.borderLo}` : undefined, animation: `fadeUp .3s ease ${i * .04}s both`, opacity: 0, transition: "background-color .15s" }}
                  onMouseEnter={e => e.currentTarget.style.background = T.surface}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: c.status === "pass" ? T.green : c.status === "warn" ? T.btc : T.red, flexShrink: 0, marginTop: 5 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{displayName}</div>
                    <div style={{ fontSize: 12, color: T.textMid, marginTop: 3, lineHeight: 1.55 }}>{displayPlain}</div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flexShrink: 0 }}>
                    <Tag label={c.status === "pass" ? "Pass" : c.status === "warn" ? "Warn" : "Fail"} color={c.status === "pass" ? T.green : c.status === "warn" ? T.btc : T.red} size={9} />
                    {typeof c.pts === "number" && c.pts !== 0 && (
                      <span title="Effect on your score" style={{ fontFamily: T.mono, fontSize: 10, fontWeight: 700, color: c.pts > 0 ? T.green : T.red }}>
                        {c.pts > 0 ? `+${c.pts}` : c.pts}
                      </span>
                    )}
                  </div>
                </div>
                );
              })}
            </div>
            {/* Right column */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {/* UTXO bars */}
              <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: 22 }}>
                <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, letterSpacing: 2, marginBottom: 14 }}>UTXO BREAKDOWN</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                  {utxos.slice(0, 6).map((u, i) => {
                    const risk = classifyUtxo(u);
                    const col = RISK_META[risk].color;
                    const pct = Math.max(4, (u.value / Math.max(totalSats, 1)) * 100);
                    return (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, width: 56, flexShrink: 0 }}>{fmt.txid(u.txid)}</div>
                        <div style={{ flex: 1, height: 7, background: T.surface, borderRadius: 4, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${pct}%`, background: col, borderRadius: 4, "--w": `${pct}%`, animation: `barGrow .8s cubic-bezier(.16,.84,.44,1) ${i * .07}s both` }} />
                        </div>
                        <div style={{ fontFamily: T.mono, fontSize: 10, color: col, width: 70, textAlign: "right" }}>{fmt.btc(u.value)}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
              {/* Benchmark */}
              <div style={{ background: T.cyanLo, border: `1px solid ${T.cyanMid}`, borderRadius: 14, padding: 20 }}>
                <div style={{ fontFamily: T.mono, fontSize: 9, color: T.cyan, letterSpacing: 1.5, marginBottom: 12 }}>YOUR SCORE VS TYPICAL</div>
                <div style={{ display: "flex", gap: 20 }}>
                  {[{ v: score, l: "YOUR SCORE", c: riskColor }, { v: 38, l: "TYPICAL", c: T.textMid }, { v: 97, l: "ACHIEVABLE", c: T.green }].map(s => (
                    <div key={s.l} style={{ textAlign: "center" }}>
                      <div style={{ fontFamily: T.serif, fontSize: 32, color: s.c, fontWeight: 400 }}>{s.v}</div>
                      <div style={{ fontFamily: T.mono, fontSize: 8, color: T.textDim, letterSpacing: 1, marginTop: 2 }}>{s.l}</div>
                    </div>
                  ))}
                </div>
                <button onClick={() => setShareOpen(true)} style={{ marginTop: 14, width: "100%", background: T.cyan, border: "none", borderRadius: 8, padding: "10px", color: T.bg, fontFamily: T.sans, fontWeight: 700, fontSize: 13, cursor: "pointer", transition: "opacity .15s" }}
                  onMouseOver={e => e.currentTarget.style.opacity = ".85"}
                  onMouseOut={e => e.currentTarget.style.opacity = "1"}>
                  Share my score →
                </button>
              </div>
              {checks.length >= 3 && <RadarChart checks={checks} size={isMobile ? 200 : 220} />}
            </div>
          </div>
          </>
        )}

        {/* ── UTXOs ── */}
        {tab === "UTXOs" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ fontSize: 13, color: T.textMid, marginBottom: 6 }}>
              <strong style={{ color: T.text }}>{utxos.length}</strong> unspent outputs — each is a separate chunk of Bitcoin. Click any row to expand.
            </div>
            {utxos.length === 0 && (
              <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: 40, textAlign: "center", fontSize: 14, color: T.textMid }}>
                No unspent outputs. This address has been fully spent.
              </div>
            )}
            {utxos.map((u, i) => {
              const risk = classifyUtxo(u);
              const { color } = RISK_META[risk];
              const flags = [];
              if (u.value < 1000) flags.push({ t: "Dust — freeze this", c: T.red });
              if (u.value >= 100000 && u.value % 100000 === 0) flags.push({ t: "Round amount", c: T.btc });
              const open = selectedUtxo === i;
              return (
                <div key={u.txid + i} onClick={() => setSelectedUtxo(open ? null : i)}
                  style={{ background: T.card, border: `1.5px solid ${open ? color : T.border}`, borderRadius: 14, padding: isMobile ? "14px" : "16px 20px", cursor: "pointer", transition: "all .15s", animation: `fadeUp .3s ease ${i * .05}s both`, opacity: 0 }}
                  onMouseEnter={e => !open && (e.currentTarget.style.borderColor = T.cyan + "44")}
                  onMouseLeave={e => !open && (e.currentTarget.style.borderColor = T.border)}>
                  <div style={{ display: "flex", alignItems: isMobile ? "flex-start" : "center", flexDirection: isMobile ? "column" : "row", gap: isMobile ? 8 : 18 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: T.serif, fontSize: isMobile ? 20 : 26, color, lineHeight: 1 }}>{fmt.btc(u.value)}</div>
                      <div style={{ fontFamily: T.mono, fontSize: 10, color: T.textDim, marginTop: 4 }}>{fmt.txid(u.txid)} · {u.status?.block_time ? fmt.age(u.status.block_time) : "unconfirmed"}</div>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {flags.length === 0 ? <Tag label="Clean" color={T.green} size={9} /> : flags.map((f, fi) => <Tag key={fi} label={f.t} color={f.c} size={9} />)}
                      <Tag label={RISK_META[risk].label} color={color} size={9} />
                    </div>
                  </div>
                  {open && (
                    <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${T.borderLo}`, display: "flex", flexWrap: "wrap", gap: 20 }}>
                      <div><div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, marginBottom: 4 }}>TXID</div><div style={{ fontFamily: T.mono, fontSize: 11, color: T.textMid, wordBreak: "break-all" }}>{u.txid}</div></div>
                      <div><div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, marginBottom: 4 }}>SATOSHIS</div><div style={{ fontFamily: T.mono, fontSize: 11, color: T.textMid }}>{u.value.toLocaleString()}</div></div>
                      <div><div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, marginBottom: 4 }}>CONFIRMED</div><div style={{ fontFamily: T.mono, fontSize: 11, color: u.status?.confirmed ? T.green : T.btc }}>{u.status?.confirmed ? "Yes" : "Pending"}</div></div>
                      {u.scriptpubkey_type && <div><div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, marginBottom: 4 }}>SCRIPT TYPE</div><div style={{ fontFamily: T.mono, fontSize: 11, color: T.textMid }}>{u.scriptpubkey_type}</div></div>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── TRANSACTIONS ── */}
        {tab === "Transactions" && (
          <div>
            <div style={{ fontSize: 13, color: T.textMid, marginBottom: 12 }}>
              <strong style={{ color: T.text }}>{txs.length}</strong> transactions. We flag CoinJoins, unsafe consolidations, and round amounts.
            </div>
            <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, overflow: "hidden" }}>
              <div style={{ display: "grid", gridTemplateColumns: "130px 90px 60px 60px 1fr 110px", padding: "10px 20px", borderBottom: `1px solid ${T.borderLo}` }}>
                {["TXID","DATE","IN","OUT","FLAGS","FEE"].map(h => (
                  <div key={h} style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, letterSpacing: 1.5 }}>{h}</div>
                ))}
              </div>
              {txs.slice(0, 20).map((tx, i) => {
                const flags = [];
                if (tx.vout?.length >= 5) flags.push({ l: "CoinJoin", c: T.green });
                if (tx.vin?.length >= 4 && tx.vout?.length <= 2) flags.push({ l: "Consolidation", c: T.red });
                if (tx.vout?.[0]?.value >= 100000 && tx.vout[0].value % 100000 === 0) flags.push({ l: "Round amount", c: T.amber });
                if (!flags.length) flags.push({ l: "Standard", c: T.textDim });
                return (
                  <div key={tx.txid} style={{ display: "grid", gridTemplateColumns: "130px 90px 60px 60px 1fr 110px", padding: "10px 20px", borderBottom: `1px solid ${T.borderLo}`, alignItems: "center", animation: `fadeUp .3s ease ${i * .03}s both`, opacity: 0, transition: "background .12s" }}
                    onMouseEnter={e => e.currentTarget.style.background = T.surface}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <span style={{ fontFamily: T.mono, fontSize: 11, color: T.textMid }}>{fmt.txid(tx.txid)}</span>
                    <span style={{ fontFamily: T.mono, fontSize: 11, color: T.textDim }}>{tx.status?.block_time ? fmt.age(tx.status.block_time) : "—"}</span>
                    <span style={{ fontFamily: T.mono, fontSize: 11, color: T.textDim }}>{tx.vin?.length || "?"}</span>
                    <span style={{ fontFamily: T.mono, fontSize: 11, color: T.textDim }}>{tx.vout?.length || "?"}</span>
                    <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>{flags.map((f, fi) => <Tag key={fi} label={f.l} color={f.c} size={9} />)}</div>
                    {/* FIX: sats not s */}
                    <span style={{ fontFamily: T.mono, fontSize: 11, color: T.textDim }}>{tx.fee ? `${tx.fee.toLocaleString()} sats` : "—"}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── FLOW / EXPOSURE MAP ── */}
        {tab === "Flow" && (
          <ExposureFlow txs={txs} isMobile={isMobile} onFix={() => setTab("Fix It")} entity={CASE_FILES.find(c => c.address === address)?.entity} address={address} onScan={onRescan} />
        )}

        {/* ── METHODOLOGY ── */}
        {tab === "Methodology" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: 28 }}>
              <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, letterSpacing: 2, marginBottom: 16 }}>HOW SCORING WORKS</div>
              <div style={{ fontFamily: T.serif, fontSize: 22, color: T.text, marginBottom: 12, fontWeight: 400 }}>11 heuristics, each weighted by severity</div>
              <div style={{ fontSize: 14, color: T.textMid, lineHeight: 1.75, marginBottom: 20 }}>
                Every wallet starts at 100. Each detected issue deducts points based on its real-world impact on traceability. We use the same heuristics published in open blockchain research — nothing proprietary.
              </div>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 10 }}>
                {[
                  { check:"Address Reuse", deduct:"–7 to –28", why:"Permanent public link between all transactions on this address.", sev:"critical" },
                  { check:"CoinJoin Usage", deduct:"+4 to +12", why:"Breaks transaction graph. Positive score if detected. Heavy penalty if absent.", sev:"high" },
                  { check:"Dust Attack", deduct:"–5 to –12", why:"Tracking beacons planted by surveillance firms. Spending them links your cluster.", sev:"high" },
                  { check:"Round Amounts", deduct:"–5 to –10", why:"0.1 BTC is a known KYC exchange withdrawal pattern flagged by Chainalysis.", sev:"high" },
                  { check:"Unsafe Consolidation", deduct:"–4 to –10", why:"Merging inputs from different sources permanently links their histories.", sev:"high" },
                  { check:"Fee Fingerprinting", deduct:"–6", why:"Identical fee rates across transactions identify your wallet software.", sev:"medium" },
                  { check:"Change Address Reuse", deduct:"–10", why:"Returning change to an input address exposes your full balance.", sev:"high" },
                  { check:"UTXO Count", deduct:"–3 to –8", why:"Too many = consolidation pressure. Too few = full balance exposed per spend.", sev:"medium" },
                  { check:"Balance Concentration", deduct:"–5", why:"90%+ in a single UTXO reveals near-total holdings on every transaction.", sev:"medium" },
                  { check:"Script Type Mix", deduct:"–4", why:"Using legacy + SegWit addresses creates cross-UTXO patterns analysts can exploit.", sev:"low" },
                  { check:"Change Detection", deduct:"–4 to –8", why:"Two-output payments where only one output matches the input's script type reveal which output is your change.", sev:"medium" },
                ].map((row, i) => (
                  <div key={i} style={{ background: T.surface, borderRadius: 10, padding: "14px 16px", border: `1px solid ${T.borderLo}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{row.check}</div>
                      <Tag label={row.deduct} color={row.deduct.startsWith("+") ? T.green : RISK_META[row.sev]?.color || T.red} size={9} />
                    </div>
                    <div style={{ fontSize: 12, color: T.textMid, lineHeight: 1.55 }}>{row.why}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: 24 }}>
              <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, letterSpacing: 2, marginBottom: 12 }}>NON-SCORING INSIGHTS</div>
              <div style={{ fontSize: 12.5, color: T.textMid, lineHeight: 1.65 }}>
                Four insights inform without moving the score. The <strong style={{ color: T.text }}>Exposure Map</strong> (what each output leaks, per transaction), <strong style={{ color: T.text }}>Cluster Exposure</strong> (the common-input heuristic's view of which addresses share one owner), and the <strong style={{ color: T.text }}>Activity Clock</strong> (transactions binned by UTC hour; a strong quiet window lets an analyst estimate a timezone) are shown because analysts read them — scoring them would double-count checks already in the table above. The <strong style={{ color: T.text }}>address-poisoning alert</strong> flags lookalike addresses planted in the history as copy-paste bait; it's a safety check, not a privacy metric — being targeted doesn't make a wallet more traceable, so it never moves the score.
              </div>
            </div>
            <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: 24 }}>
              <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, letterSpacing: 2, marginBottom: 12 }}>DATA SOURCES</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { src:"Blockstream / mempool.space Esplora API", desc:"Public blockchain data — UTXOs, transactions, address stats. Read-only, your choice of explorer — by default fetched via our open-source no-log relay so the explorer can't see your IP." },
                  { src:"Bitcoin whitepaper §10 (Nakamoto, 2008)", desc:"Nakamoto's own privacy guidance: use a new address for every payment. Reuse permanently links transactions — the heuristic behind our address-reuse check." },
                  { src:"Chainalysis (Series F, May 2022)", desc:"$8.6B valuation, ~$190M 2023 revenue (Sacra) — the scale of the blockchain-surveillance industry that reads this same public data." },
                  { src:"Bitcoin Core relay policy", desc:"The 546-sat dust threshold (GetDustThreshold) — outputs below it are used as tracking beacons." },
                ].map((s, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, paddingBottom: 10, borderBottom: i < 3 ? `1px solid ${T.borderLo}` : undefined }}>
                    <div style={{ width: 4, borderRadius: 2, background: T.cyan, flexShrink: 0, alignSelf: "stretch" }} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: T.text, marginBottom: 3 }}>{s.src}</div>
                      <div style={{ fontSize: 12, color: T.textMid, lineHeight: 1.55 }}>{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: T.cyanLo, border: `1px solid ${T.cyanMid}`, borderRadius: 14, padding: "16px 20px", fontSize: 13, color: T.textMid, lineHeight: 1.65 }}>
              <strong style={{ color: T.cyan }}>Open source:</strong> All 11 heuristics are implemented in plain JavaScript in this tool's source. No black box. View and audit the full scoring logic at <a href="https://github.com/netasset/anonscore" target="_blank" rel="noopener noreferrer" style={{ color: T.cyan }}>github.com/netasset/anonscore</a>.
            </div>
          </div>
        )}


      </div>

      {/* Mobile bottom nav */}
      {isMobile && (
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: T.card, borderTop: `1px solid ${T.border}`, display: "flex", zIndex: 200 }}>
          {["Fix It","Overview","Flow","UTXOs","Transactions"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: "10px 0 8px", background: "transparent", border: "none", borderTop: `2px solid ${tab === t ? T.cyan : "transparent"}`, color: tab === t ? T.cyan : T.textDim, fontFamily: T.mono, fontSize: 8, letterSpacing: .5, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
              <span style={{ fontSize: 15 }}>{t === "Fix It" ? "★" : t === "Overview" ? "◎" : t === "Flow" ? "⋔" : t === "Transactions" ? "↔" : "⬡"}</span>
              {t}
            </button>
          ))}
        </div>
      )}

      {shareOpen && <ShareCard score={score} grade={grade} checks={checks} address={address} isLightning={false} onClose={() => setShareOpen(false)} />}
      {(() => {
        const matchedCase = CASE_FILES.find(c => c.address === address);
        const walletMeta = matchedCase
          ? { isPublic: true, entity: matchedCase.entity, caseTitle: matchedCase.title, utxos, txs }
          : { isPublic: false };
        return <>
          {aiStage === "consent" && <AiConsentGate score={score} grade={grade} checks={checks} recommendations={recommendations} walletMeta={walletMeta} onAccept={() => setAiStage("chat")} onDecline={() => setAiStage(null)} />}
          {aiStage === "chat" && <AiAssistant checks={checks} recommendations={recommendations} score={score} grade={grade} walletMeta={walletMeta} onClose={() => setAiStage(null)} />}
        </>;
      })()}

      {/* ── Floating AI widget — visible on all tabs, prominent CTA ── */}
      {aiStage === null && (
        <div style={{
          position: "fixed",
          bottom: isMobile ? 72 : 28,
          right: isMobile ? 12 : 28,
          zIndex: 500,
          width: aiWidgetMin ? "auto" : "min(340px, calc(100vw - 24px))",
          animation: "fadeUp .4s ease both",
          filter: "drop-shadow(0 8px 32px #000000aa)",
        }}>
          {aiWidgetMin ? (
            /* ── Minimized pill ── */
            <button onClick={() => setAiWidgetMin(false)} style={{
              display: "flex", alignItems: "center", gap: 10,
              background: T.card, border: `1.5px solid ${T.cyan}55`,
              borderRadius: 99, padding: "10px 18px 10px 14px",
              cursor: "pointer", transition: "all .2s",
              boxShadow: `0 0 24px ${T.cyan}22`,
            }}
              onMouseOver={e => e.currentTarget.style.borderColor = T.cyan}
              onMouseOut={e => e.currentTarget.style.borderColor = T.cyan + "55"}>
              <div style={{ width: 28, height: 28, background: T.cyan + "22", border: `1px solid ${T.cyan}44`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>✦</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: T.text, lineHeight: 1 }}>Privacy Assistant</div>
                <div style={{ fontSize: 11, color: T.cyan, marginTop: 2 }}>Ask about your {issueCount} issues →</div>
              </div>
            </button>
          ) : (
            /* ── Expanded card ── */
            <div style={{
              background: T.card,
              border: `1.5px solid ${T.cyan}44`,
              borderRadius: 20,
              overflow: "hidden",
              boxShadow: `0 0 0 1px ${T.cyan}11, 0 24px 64px #000000bb`,
            }}>
              {/* Privacy guarantee strip */}
              <div style={{ display: "flex", borderBottom: `1px solid ${T.borderLo}`, background: T.greenLo }}>
                {["✕ Address never sent", "✕ Nothing stored", "✕ Not for training"].map((t, i) => (
                  <div key={i} style={{ flex: 1, textAlign: "center", padding: "6px 4px", borderRight: i < 2 ? `1px solid ${T.borderLo}` : undefined }}>
                    <span style={{ fontFamily: T.mono, fontSize: 9, color: T.green, letterSpacing: 0.2 }}>{t}</span>
                  </div>
                ))}
              </div>

              {/* Main content */}
              <div style={{ padding: "20px 22px 22px" }}>
                {/* Header row */}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 44, height: 44, background: T.cyan + "18", border: `1.5px solid ${T.cyan}44`, borderRadius: 13, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0, boxShadow: `0 0 16px ${T.cyan}22` }}>✦</div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: T.text, lineHeight: 1 }}>Privacy Assistant</div>
                      <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, letterSpacing: 1, marginTop: 3 }}>POWERED BY CLAUDE · FREE</div>
                    </div>
                  </div>
                  <button onClick={() => setAiWidgetMin(true)} style={{ background: "transparent", border: `1px solid #ffffff44`, borderRadius: 7, padding: "4px 9px", color: "#ffffff", fontSize: 12, cursor: "pointer", lineHeight: 1, transition: "all .15s", flexShrink: 0 }}
                    onMouseOver={e => e.currentTarget.style.borderColor = "#ffffff88"}
                    onMouseOut={e => e.currentTarget.style.borderColor = "#ffffff44"}>
                    — minimize
                  </button>
                </div>

                <div style={{ fontSize: 13, color: T.textMid, lineHeight: 1.6, marginBottom: 16 }}>
                  Get step-by-step instructions for your <strong style={{ color: T.text }}>{issueCount} specific issue{issueCount !== 1 ? "s" : ""}</strong> — which wallet to use, what to click, in plain English.
                </div>

                <button onClick={openAi} style={{
                  width: "100%", padding: "14px 20px",
                  background: `linear-gradient(135deg, ${T.cyan}, #0ea5e9)`,
                  border: "none", borderRadius: 12,
                  color: T.bg, fontFamily: T.sans, fontWeight: 700, fontSize: 15,
                  cursor: "pointer", transition: "opacity .15s",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                  boxShadow: `0 4px 20px ${T.cyan}44`,
                }}
                  onMouseOver={e => e.currentTarget.style.opacity = ".88"}
                  onMouseOut={e => e.currentTarget.style.opacity = "1"}>
                  <span>✦</span>
                  <span>Ask about your {issueCount} issues →</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Mobile sticky bottom tab bar ── */}
      {isMobile && (
        <nav style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 200, background: T.bg, borderTop: `1px solid ${T.border}`, display: "flex", height: 64, paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
          {TABS.map(t => {
            const icons = { "Fix It": "★", "Overview": "◎", "UTXOs": "⬡", "Transactions": "⇄", "Methodology": "≡" };
            return (
              <button key={t} onClick={() => setTab(t)} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3, background: "none", border: "none", cursor: "pointer", borderTop: `2px solid ${tab === t ? T.cyan : "transparent"}`, transition: "border-color .15s" }}>
                <span style={{ fontSize: 14, color: tab === t ? T.cyan : T.textDim }}>{icons[t]}</span>
                <span style={{ fontFamily: T.mono, fontSize: 8, color: tab === t ? T.cyan : T.textDim, letterSpacing: 0.5 }}>{t.toUpperCase()}</span>
              </button>
            );
          })}
        </nav>
      )}
    </div>
  );
}
/* ─────────────────────────────────────────────
   LIGHTNING DASHBOARD
───────────────────────────────────────────── */
function LightningDashboard({ nodeId, nodeData, channels, isMobile, onBack, onRescan, toast }) {
  const [tab, setTab] = useState("Fix It");
  const { score, grade, checks, recommendations } = useMemo(
    () => runLightningEngine(nodeData, channels), [nodeData, channels]
  );
  const col = scoreColor(score);
  const fails = checks.filter(c => c.status === "fail").length;
  const warns = checks.filter(c => c.status === "warn").length;
  const passes = checks.filter(c => c.status === "pass").length;
  const [expandedCheck, setExpandedCheck] = useState(null);
  const [doneFixes, setDoneFixes] = useState(() => getDoneFixes(nodeId || "ln"));
  const [shareOpen, setShareOpen] = useState(false);
  const [aiStage, setAiStage] = useState(null);
  const toggleDone = k => setDoneFixes(p => { const n = new Set(p); n.has(k) ? n.delete(k) : n.add(k); saveDoneFixes(nodeId || "ln", n); return n; });

  const totalCap = channels.reduce((s, c) => s + (c.capacity || 0), 0);
  const alias = (nodeData.alias || "Unknown Node").replace(/[\x00-\x1f\x7f]/g, "").trim().slice(0, 50) || "Unknown Node";
  const pubkeyShort = nodeId ? `${nodeId.slice(0, 10)}…${nodeId.slice(-6)}` : "—";
  const TABS = isMobile ? ["Fix It", "Checks", "Channels"] : ["Fix It", "Checks", "Channels", "Methodology"];

  const handleRescan = () => onRescan && onRescan(nodeId, false, "ln_pubkey");

  return (
    <div role="main" aria-label={`Lightning privacy audit for ${nodeData?.alias || nodeId.slice(0, 16)}`} style={{ minHeight: "100vh", background: "transparent", display: "flex", flexDirection: "column" }}>
      <h1 className="sr-only">Lightning privacy score {score} of 100, grade {grade}</h1>

      {/* ── Share modal — unified with BTC ── */}
      {shareOpen && <ShareCard score={score} grade={grade} checks={checks} address={nodeId} isLightning={true} onClose={() => setShareOpen(false)} />}

      {/* ── Nav — matches BTC nav ── */}
      <nav style={{ display: "flex", alignItems: "center", gap: 10, padding: isMobile ? "12px 16px" : "12px 32px", borderBottom: `1px solid ${T.border}`, background: T.bg, position: "sticky", top: 0, zIndex: 100 }}>
        <button onClick={onBack} style={{ background: "transparent", border: `1.5px solid ${T.border}`, borderRadius: 8, padding: "7px 12px", color: T.textMid, fontFamily: T.sans, fontSize: 13, cursor: "pointer", transition: "border .15s" }}
          onMouseOver={e => e.currentTarget.style.borderColor = T.ln}
          onMouseOut={e => e.currentTarget.style.borderColor = T.border}>← Back</button>
        {!isMobile && <div style={{ fontFamily: T.display, fontSize: 15, letterSpacing: 4, fontWeight: 700 }}>ANON<span style={{ color: T.cyan }}>SCORE</span></div>}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: T.mono, fontSize: 11, color: T.textDim, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            ⚡ {alias !== "Unknown Node" ? alias : (nodeId ? `${nodeId.slice(0,10)}…${nodeId.slice(-6)}` : "Lightning Node")}
          </div>
          <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, marginTop: 2 }}>Lightning node audit</div>
        </div>
        <div style={{ display: "flex", gap: 8, flexShrink: 0, alignItems: "center" }}>
          <Tag label={grade} color={col} size={10} />
          {!isMobile && (
            <>
              <button onClick={handleRescan} style={{ background: "transparent", border: `1.5px solid ${T.border}`, borderRadius: 8, padding: "6px 12px", color: T.textMid, fontSize: 13, cursor: "pointer", transition: "all .15s" }}
                onMouseOver={e => e.currentTarget.style.borderColor = T.ln}
                onMouseOut={e => e.currentTarget.style.borderColor = T.border}>↻ Re-scan</button>
              <button onClick={() => setShareOpen(true)} style={{ background: "transparent", border: `1.5px solid ${T.border}`, borderRadius: 8, padding: "6px 12px", color: T.textMid, fontSize: 13, cursor: "pointer", transition: "all .15s" }}
                onMouseOver={e => e.currentTarget.style.borderColor = T.ln}
                onMouseOut={e => e.currentTarget.style.borderColor = T.border}>Share</button>
            </>
          )}
          {isMobile && (
            <>
              <button onClick={() => setShareOpen(true)} style={{ background: "transparent", border: `1.5px solid ${T.border}`, borderRadius: 8, padding: "6px 10px", color: T.textMid, fontSize: 12, cursor: "pointer" }}>Share</button>
              <button onClick={handleRescan} style={{ background: "transparent", border: `1.5px solid ${T.border}`, borderRadius: 8, padding: "6px 10px", color: T.textMid, fontSize: 12, cursor: "pointer" }}>↻</button>
            </>
          )}
        </div>
      </nav>

      <div style={{ flex: 1, padding: isMobile ? "12px 12px" : "16px 32px", maxWidth: 1100, margin: "0 auto", width: "100%" }}>

        {/* ── Compact summary bar — matches BTC exactly ── */}
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: isMobile ? "12px 14px" : "12px 20px", marginBottom: 12, display: "flex", alignItems: "center", gap: isMobile ? 12 : 20, flexWrap: "wrap", animation: "fadeUp .35s ease both" }}>

          {/* Score ring + grade */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            <ScoreRing score={score} size={52} />
            <div>
              <div style={{ fontFamily: T.serif, fontSize: 20, color: col, lineHeight: 1 }}>Grade {grade}</div>
              <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, letterSpacing: 1, marginTop: 2 }}>{score}/100</div>
            </div>
          </div>

          <div style={{ width: 1, height: 36, background: T.border, flexShrink: 0 }} />

          {/* FAIL / WARN / PASS badges */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <div style={{ background: T.red + "18", border: `1px solid ${T.red}44`, borderRadius: 8, padding: "4px 10px", display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ fontFamily: T.mono, fontSize: 16, fontWeight: 700, color: T.red, lineHeight: 1 }}>{fails}</span>
              <span style={{ fontFamily: T.mono, fontSize: 9, color: T.red, letterSpacing: 0.5 }}>FAIL</span>
            </div>
            <div style={{ background: T.amber + "18", border: `1px solid ${T.amber}44`, borderRadius: 8, padding: "4px 10px", display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ fontFamily: T.mono, fontSize: 16, fontWeight: 700, color: T.amber, lineHeight: 1 }}>{warns}</span>
              <span style={{ fontFamily: T.mono, fontSize: 9, color: T.amber, letterSpacing: 0.5 }}>WARN</span>
            </div>
            <div style={{ background: T.green + "18", border: `1px solid ${T.green}44`, borderRadius: 8, padding: "4px 10px", display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ fontFamily: T.mono, fontSize: 16, fontWeight: 700, color: T.green, lineHeight: 1 }}>{passes}</span>
              <span style={{ fontFamily: T.mono, fontSize: 9, color: T.green, letterSpacing: 0.5 }}>PASS</span>
            </div>
          </div>

          <div style={{ width: 1, height: 36, background: T.border, flexShrink: 0 }} />

          {/* Node stats */}
          <div style={{ display: "flex", gap: isMobile ? 14 : 24, flexWrap: "wrap" }}>
            {[
              { label: "CHANNELS", val: channels.length,                           sub: "open",      color: T.blue  },
              { label: "CAPACITY", val: `₿${(totalCap/1e8).toFixed(3)}`,           sub: "total",     color: T.btc   },
              { label: "VS TARGET", val: score >= 70 ? `+${score-70}` : `${score-70}`, sub: "target: 70+", color: score >= 70 ? T.green : T.red },
            ].map(s => (
              <div key={s.label}>
                <div style={{ fontFamily: T.mono, fontSize: 8, color: T.textDim, letterSpacing: 1.5, marginBottom: 2 }}>{s.label}</div>
                <div style={{ fontFamily: T.serif, fontSize: 18, color: s.color, lineHeight: 1 }}>{s.val}</div>
                <div style={{ fontSize: 10, color: T.textDim, marginTop: 1 }}>{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Top fixes potential — right-aligned */}
          <div style={{ marginLeft: "auto", flexShrink: 0, textAlign: "right" }}>
            <div style={{ fontFamily: T.mono, fontSize: 8, color: T.textDim, letterSpacing: 1.5, marginBottom: 2 }}>TOP FIXES</div>
            <div style={{ fontFamily: T.serif, fontSize: 18, color: T.green, lineHeight: 1 }}>+{recommendations.slice(0, 3).reduce((a, r) => a + r.impact, 0)} pts</div>
            <div style={{ fontSize: 10, color: T.textDim, marginTop: 1 }}>potential gain</div>
          </div>
        </div>

        {/* ── Tabs — desktop only; mobile uses bottom bar ── */}
        {!isMobile && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14, overflowX: "auto", paddingBottom: 2 }}>
            {TABS.map(t => <Pill key={t} active={tab === t} onClick={() => setTab(t)} color={T.ln}>{t}</Pill>)}
          </div>
        )}
        {isMobile && <div style={{ marginBottom: 14 }} />}

        {/* ── Fix It ── */}
        {tab === "Fix It" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {score >= 80 && (
              <div style={{ background: T.greenLo, border: `1px solid ${T.green}44`, borderRadius: 14, padding: "18px 20px", textAlign: "center" }}>
                <div style={{ fontFamily: T.serif, fontSize: 22, color: T.green, marginBottom: 4 }}>Strong privacy posture ⚡</div>
                <div style={{ fontSize: 13, color: T.textMid }}>Your Lightning node is well-configured. Keep monitoring as your channel peers change.</div>
              </div>
            )}
            {recommendations.length === 0 && score < 80 && (
              <div style={{ fontSize: 13, color: T.textMid, padding: "12px 0" }}>No specific fixes generated. Check the Checks tab for detail.</div>
            )}

            {/* AI assistant card — same pattern as BTC */}
            {aiStage !== "chat" && (
              <div style={{ background: T.card, border: `1px solid ${T.ln}33`, borderRadius: 16, overflow: "hidden", marginBottom: 2 }}>
                <div style={{ display: "flex", gap: 0, borderBottom: `1px solid ${T.borderLo}` }}>
                  {[
                    { icon: "✕", label: "Node ID never sent" },
                    { icon: "✕", label: "No data stored" },
                    { icon: "✕", label: "Not used for training" },
                  ].map((badge, i) => (
                    <div key={i} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, padding: "7px 8px", borderRight: i < 2 ? `1px solid ${T.borderLo}` : undefined, background: T.greenLo }}>
                      <span style={{ fontFamily: T.mono, fontSize: 9, color: T.green, fontWeight: 700 }}>{badge.icon}</span>
                      <span style={{ fontFamily: T.mono, fontSize: 9, color: T.green, letterSpacing: 0.3, whiteSpace: "nowrap" }}>{badge.label}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => setAiStage("consent")} style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 18px", cursor: "pointer", textAlign: "left", width: "100%", background: "transparent", border: "none", transition: "background .15s" }}
                  onMouseOver={e => e.currentTarget.style.background = T.ln + "0a"}
                  onMouseOut={e => e.currentTarget.style.background = "transparent"}>
                  <div style={{ width: 36, height: 36, background: T.ln + "18", border: `1px solid ${T.ln}33`, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>⚡</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 3 }}>Ask the Privacy Assistant</div>
                    <div style={{ fontSize: 12, color: T.textMid, lineHeight: 1.55 }}>
                      Get step-by-step guidance for your {checks.filter(c => c.status !== "pass").length} Lightning issues. Only your score and issue names are shared — never your node ID. <span style={{ color: T.textDim }}>5 questions per session.</span>
                    </div>
                  </div>
                  <div style={{ flexShrink: 0 }}>
                    <div style={{ background: T.ln, borderRadius: 8, padding: "7px 14px", color: T.bg, fontSize: 12, fontWeight: 700, whiteSpace: "nowrap" }}>Ask now →</div>
                  </div>
                </button>
                {aiStage === "consent" && (
                  <div style={{ padding: "14px 18px", borderTop: `1px solid ${T.borderLo}`, background: T.lnLo }}>
                    <div style={{ fontSize: 13, color: T.textMid, marginBottom: 12, lineHeight: 1.6 }}>
                      The assistant will receive your score ({score}/100) and issue names only. No node ID, no channel data, no on-chain info. Powered by Claude.
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => setAiStage("chat")} style={{ flex: 1, background: T.ln, border: "none", borderRadius: 8, padding: "10px", color: T.bg, fontFamily: T.sans, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>I understand — open assistant</button>
                      <button onClick={() => setAiStage(null)} style={{ background: "transparent", border: `1.5px solid ${T.border}`, borderRadius: 8, padding: "10px 14px", color: T.textDim, fontSize: 12, cursor: "pointer" }}>Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {aiStage === "chat" && (
              <AiAssistant
                checks={checks}
                recommendations={recommendations}
                score={score}
                grade={grade}
                onClose={() => setAiStage(null)}
                starters={[
                  `Which of my ${checks.filter(c => c.status !== "pass").length} issues should I fix first?`,
                  "How do I switch my node to Tor-only?",
                  "What's the actual risk of peering with a KYC exchange?",
                  "How do I set a pseudonymous node alias?",
                ]}
              />
            )}
            {recommendations.map((r, i) => {
              const done = doneFixes.has(r.key);
              return (
                <div key={r.key} style={{ background: done ? T.greenLo : T.card, border: `1px solid ${done ? T.green + "44" : T.border}`, borderRadius: 14, overflow: "hidden", transition: "all .2s" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "18px 20px" }}>
                    <div style={{ fontFamily: T.mono, fontSize: 11, color: done ? T.green : T.ln, minWidth: 24, marginTop: 2 }}>{String(i+1).padStart(2,"0")}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: done ? T.textDim : T.text, textDecoration: done ? "line-through" : "none" }}>{r.action}</div>
                        <span style={{ fontFamily: T.mono, fontSize: 10, color: T.green, background: T.greenLo, padding: "3px 8px", borderRadius: 5 }}>+{r.impact} pts</span>
                        <Tag label={r.effort} color={r.effort === "Easy" ? T.green : r.effort === "Medium" ? T.amber : T.red} size={9} />
                      </div>
                      <div style={{ fontSize: 13, color: T.textMid, lineHeight: 1.6, marginBottom: r.tools?.length ? 12 : 0 }}>{r.detail}</div>
                      {r.tools?.length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                          {r.tools.map(t => {
                            const href = toolLink(t.name);
                            const aff = toolIsAffiliate(t.name);
                            const inner = (
                              <>
                                <div style={{ fontSize: 11, fontWeight: 600, color: T.text }}>{t.name}{aff ? " · affiliate" : ""}</div>
                                <div style={{ fontSize: 10, color: T.textDim }}>{t.note}</div>
                              </>
                            );
                            const base = { background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, padding: "5px 10px", textDecoration: "none", display: "block" };
                            return href
                              ? <a key={t.name} href={href} target="_blank" rel="noopener noreferrer nofollow" style={base}>{inner}</a>
                              : <div key={t.name} style={base}>{inner}</div>;
                          })}
                        </div>
                      )}
                    </div>
                    <button onClick={() => toggleDone(r.key)}
                      style={{ background: done ? T.green : "transparent", border: `1.5px solid ${done ? T.green : T.border}`, borderRadius: 8,
                        padding: "6px 10px", color: done ? T.bg : T.textDim, fontSize: 11, cursor: "pointer", transition: "all .2s", whiteSpace: "nowrap" }}>
                      {done ? "✓ Done" : "Mark done"}
                    </button>
                  </div>
                </div>
              );
            })}
            {/* Share card */}
            <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, padding: "18px 22px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
              <div>
                <div style={{ fontFamily: T.serif, fontSize: 17, color: T.text, fontWeight: 400 }}>Share your node score</div>
                <div style={{ fontSize: 13, color: T.textMid, marginTop: 3 }}>Let your Nostr or Twitter followers check theirs.</div>
              </div>
              <button onClick={() => setShareOpen(true)} style={{ background: T.ln, border: "none", borderRadius: 10, padding: "11px 20px", color: T.bg, fontFamily: T.sans, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>Share Grade {grade} →</button>
            </div>

            {/* Lightning privacy explainer */}
            <div style={{ background: T.lnLo, border: `1px solid ${T.lnMid}`, borderRadius: 14, padding: "16px 20px", marginTop: 4 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: T.ln, marginBottom: 6 }}>⚡ What Lightning scores — and what it can't</div>
              <div style={{ fontSize: 13, color: T.textMid, lineHeight: 1.7 }}>
                Lightning <em>payments</em> are private by design — they don't appear on-chain. What we score is your <strong style={{ color: T.text }}>node's public footprint</strong>: IP exposure, KYC peer connections, on-chain channel history, and identity linkage. If you use a custodial wallet (Wallet of Satoshi, Strike), there's nothing to score — your provider sees everything.
              </div>
            </div>
          </div>
        )}

        {/* ── Checks ── */}
        {tab === "Checks" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, letterSpacing: 2, marginBottom: 8 }}>
              {checks.length} CHECKS · LIGHTNING NODE PRIVACY
            </div>
            {checks.map(c => {
              const statusColor = c.status === "pass" ? T.green : c.status === "warn" ? T.amber : T.red;
              const sevColor = { critical: T.red, high: T.btc, medium: T.amber, low: T.blue, clean: T.green }[c.sev] || T.textDim;
              const open = expandedCheck === c.key;
              return (
                <div key={c.key} style={{ borderRadius: 12, border: `1px solid ${open ? statusColor + "44" : T.border}`, overflow: "hidden", transition: "border-color .2s" }}>
                  <div onClick={() => setExpandedCheck(open ? null : c.key)}
                    style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 16px", cursor: "pointer", background: open ? statusColor + "0d" : "transparent" }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: statusColor, flexShrink: 0, boxShadow: `0 0 6px ${statusColor}` }} />
                    <div style={{ flex: 1, fontSize: 13, fontWeight: 600, color: T.text }}>{c.name}</div>
                    <Tag label={c.sev.toUpperCase()} color={sevColor} size={9} />
                    <span style={{ color: T.textDim, fontSize: 11, marginLeft: 4 }}>{open ? "▲" : "▼"}</span>
                  </div>
                  {open && (
                    <div style={{ padding: "0 16px 14px 36px", borderTop: `1px solid ${T.borderLo}` }}>
                      <p style={{ fontSize: 13, color: T.textMid, lineHeight: 1.65, marginTop: 12, marginBottom: 0 }}>{c.detail}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── Channels ── */}
        {tab === "Channels" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, letterSpacing: 2, marginBottom: 8 }}>
              {channels.length} OPEN CHANNELS · PEER RISK ANALYSIS
            </div>
            {channels.length === 0 && (
              <div style={{ fontSize: 13, color: T.textMid, padding: "20px 0" }}>No open channels found for this node.</div>
            )}
            {channels.map((ch, i) => {
              const peerPub = ch.node1_pub === nodeId ? ch.node2_pub : ch.node1_pub;
              const isKyc = isKycNode(ch.node1_pub) || isKycNode(ch.node2_pub);
              const pct = totalCap > 0 ? Math.round((ch.capacity / totalCap) * 100) : 0;
              const riskColor = isKyc ? T.red : T.green;
              const riskLabel = isKyc ? "KYC" : "OK";
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, background: T.card, border: `1px solid ${isKyc ? T.red + "44" : T.border}`, borderRadius: 12, padding: "12px 16px" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: riskColor, flexShrink: 0, boxShadow: `0 0 5px ${riskColor}` }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: T.mono, fontSize: 11, color: T.textMid, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {peerPub ? `${peerPub.slice(0,14)}…` : `Channel ${i+1}`}
                    </div>
                    {/* Capacity bar */}
                    <div style={{ height: 3, background: T.border, borderRadius: 2, marginTop: 6 }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: isKyc ? T.red : T.ln, borderRadius: 2 }} />
                    </div>
                  </div>
                  <div style={{ fontFamily: T.mono, fontSize: 10, color: T.textDim, whiteSpace: "nowrap" }}>{pct}% · {(ch.capacity / 1e8).toFixed(4)} BTC</div>
                  <Tag label={riskLabel} color={riskColor} size={9} />
                </div>
              );
            })}
          </div>
        )}

        {/* ── Methodology ── */}
        {tab === "Methodology" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, letterSpacing: 2, marginBottom: 4 }}>8 HEURISTICS · LIGHTNING NODE PRIVACY SCORING</div>
            {[
              { n:"01", label:"Public Node Announcement", desc:"Whether your node is publicly gossiped on the Lightning network. Public nodes expose their IP or Tor address to every peer." },
              { n:"02", label:"KYC Exchange Peer Channels", desc:"Channels to known KYC exchanges (Bitfinex, Kraken, Binance, OKX). These entities log routing metadata and can correlate payment flows through your node." },
              { n:"03", label:"Tor / Clearnet Exposure", desc:"Whether your node listens on clearnet (IP-visible) or Tor-only (anonymous). Clearnet nodes expose their physical location." },
              { n:"04", label:"Channel Diversity", desc:"Number of open channels. Low channel count limits routing path diversity, making payment flows easier to correlate." },
              { n:"05", label:"Channel Capacity Concentration", desc:"Whether one channel dominates your capacity. Heavy concentration makes routing patterns predictable." },
              { n:"06", label:"Node Alias Privacy", desc:"Whether your node alias looks like a real name. Aliases are publicly visible on the Lightning gossip network." },
              { n:"07", label:"Node Establishment", desc:"How long your node has been active. New nodes have limited routing history, making their activity more trackable." },
              { n:"08", label:"On-Chain Channel Footprint", desc:"Every channel open/close is an on-chain transaction. Funding channels from KYC exchange UTXOs permanently links your Lightning activity to your on-chain identity." },
            ].map(c => (
              <div key={c.n} style={{ display: "flex", gap: 14, background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: "14px 18px" }}>
                <div style={{ fontFamily: T.mono, fontSize: 10, color: T.ln, minWidth: 24, marginTop: 1 }}>{c.n}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: T.text, marginBottom: 4 }}>{c.label}</div>
                  <div style={{ fontSize: 13, color: T.textMid, lineHeight: 1.6 }}>{c.desc}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Mobile sticky bottom tab bar ── */}
      {isMobile && (
        <nav style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 200, background: T.bg, borderTop: `1px solid ${T.border}`, display: "flex", height: 64, paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
          {TABS.map(t => {
            const icons = { "Fix It": "★", "Checks": "◎", "Channels": "⚡", "Methodology": "≡" };
            return (
              <button key={t} onClick={() => setTab(t)} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3, background: "none", border: "none", cursor: "pointer", borderTop: `2px solid ${tab === t ? T.ln : "transparent"}`, transition: "border-color .15s" }}>
                <span style={{ fontSize: 14, color: tab === t ? T.ln : T.textDim }}>{icons[t]}</span>
                <span style={{ fontFamily: T.mono, fontSize: 8, color: tab === t ? T.ln : T.textDim, letterSpacing: 0.5 }}>{t.toUpperCase()}</span>
              </button>
            );
          })}
        </nav>
      )}
    </div>
  );
}
/* ─────────────────────────────────────────────
   ROOT APP
───────────────────────────────────────────── */
// Thin scroll-progress bar pinned to the top of the viewport; width tracks page scroll.
function ScrollProgress() {
  const ref = useRef(null);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = ref.current; if (!el) return;
        const h = document.documentElement;
        const max = h.scrollHeight - h.clientHeight;
        el.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + "%";
      });
    };
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    update();
    return () => { window.removeEventListener("scroll", update); window.removeEventListener("resize", update); cancelAnimationFrame(raf); };
  }, []);
  return (
    <div aria-hidden="true" style={{ position: "fixed", top: 0, left: 0, right: 0, height: 2, zIndex: 300, pointerEvents: "none" }}>
      <div ref={ref} style={{ height: "100%", width: "0%", background: `linear-gradient(90deg, ${T.btc}, ${T.cyan})`, boxShadow: `0 0 8px ${T.cyan}`, transition: "width .1s linear" }} />
    </div>
  );
}

/* ─────────────────────────────────────────────
   AMBIENT BACKDROP — one fixed atmosphere layer behind every page.
   Pure CSS: no fetched assets, transform-only motion (no blur filters —
   the orb softness comes from gradient falloff, which is GPU-cheap),
   film-grain noise to kill gradient banding on dark displays, and the
   whole thing goes still under prefers-reduced-motion. Page roots are
   background:transparent so this shows through; opaque section strips
   (T.surface) deliberately mask it, giving the page depth rhythm.
───────────────────────────────────────────── */
function AmbientBackground({ tint }) {
  // Score-reactive layer: while a dashboard is showing, the atmosphere leans
  // toward the grade color (red→green family from scoreColor). The last hue is
  // remembered so the fade-OUT keeps its color instead of snapping to nothing.
  const lastTint = useRef(tint);
  if (tint) lastTint.current = tint;
  const tc = lastTint.current;
  return (
    <div aria-hidden="true" style={{ position: "fixed", inset: 0, zIndex: -1, pointerEvents: "none", overflow: "hidden", background: T.bg }}>
      {/* Deep-space tint: indigo nebula up top, subtle vignette below */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(120% 70% at 50% -12%, #1b214066 0%, transparent 60%), radial-gradient(90% 90% at 50% 115%, #0d101f88 0%, transparent 55%)" }} />
      {/* Grade glow — fades in over the dashboard, out everywhere else */}
      {tc && <div className="amb" style={{ top: "-12%", left: "26%", width: "58vmax", height: "58vmax", background: `radial-gradient(circle, ${tc}10 0%, transparent 60%)`, opacity: tint ? 1 : 0, transition: "opacity 1.6s ease", animationDelay: "-9s" }} />}
      {/* Slow-drifting glow orbs — brand cyan + Bitcoin orange, whisper-quiet alphas */}
      <div className="amb" style={{ top: "2%", left: "-18%", width: "56vmax", height: "56vmax", background: "radial-gradient(circle,#22D3EE0a 0%,transparent 62%)" }} />
      <div className="amb" style={{ top: "32%", right: "-22%", width: "60vmax", height: "60vmax", background: "radial-gradient(circle,#F7931A08 0%,transparent 60%)", animationDelay: "-18s", animationDuration: "54s" }} />
      <div className="amb" style={{ bottom: "-26%", left: "20%", width: "52vmax", height: "52vmax", background: "radial-gradient(circle,#22D3EE07 0%,transparent 65%)", animationDelay: "-33s", animationDuration: "62s" }} />
      {/* Node grid, masked so it dissolves toward the edges */}
      <div className="dot-grid" style={{ position: "absolute", inset: 0, opacity: .5, WebkitMaskImage: "radial-gradient(90% 60% at 50% 28%, #000 0%, transparent 100%)", maskImage: "radial-gradient(90% 60% at 50% 28%, #000 0%, transparent 100%)" }} />
      {/* Film grain — the difference between "flat dark page" and "premium dark page" */}
      <div className="bg-noise" />
    </div>
  );
}

function App() {
  const [page, setPage] = useState("landing");
  const [activeCaseFile, setActiveCaseFile] = useState(null);
  const [pendingScan, setPendingScan] = useState(null); // { addr, inputType } awaiting user confirmation
  const [scoreTint, setScoreTint] = useState(null);     // grade color for the ambient backdrop while a dashboard shows
  const [scoreDelta, setScoreDelta] = useState(null);   // score change vs the user's previous scan of the same address

  // Inject meta/OG tags
  useEffect(() => {
    try { document.documentElement.lang = _lang; } catch {}
    const set = (sel, attr, val) => { let el = document.querySelector(sel); if (!el) { el = document.createElement("meta"); document.head.appendChild(el); } el.setAttribute(attr, val); };
    document.title = "AnonScore — Free Bitcoin & Lightning Privacy Audit";
    set('meta[name="description"]',    "content", "Paste a Bitcoin address or Lightning node pubkey. Get a privacy score, every issue explained, and a ranked fix plan. Free, open source, nothing stored.");
    set('meta[property="og:title"]',   "content", "AnonScore — Free Bitcoin & Lightning Privacy Audit");
    set('meta[property="og:description"]', "content", "11 Bitcoin heuristics + 8 Lightning checks. Score 0–100. Free, open source, runs in your browser. No data stored.");
    set('meta[property="og:url"]',     "content", "https://anonscore.com");
    set('meta[property="og:type"]',    "content", "website");
    set('meta[property="og:image"]',   "content", "https://anonscore.com/og.png");
    set('meta[name="twitter:card"]',   "content", "summary_large_image");
    set('meta[name="twitter:title"]',  "content", "AnonScore — Bitcoin & Lightning Privacy Score");
    set('meta[name="twitter:description"]', "content", "Is your Bitcoin stack leaking? Find out in 60 seconds. Free, open source.");
    set('meta[name="twitter:image"]',  "content", "https://anonscore.com/og.png");
  }, []);

  // Parse ?scan= and ?case= params. Scan stores for user confirmation (never
  // auto-fires). Case deep-links to a specific case file (makes case URLs
  // shareable + indexable per the SEO sitemap entries).
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const addr = params.get("scan");
      if (addr) {
        const t = detectInputType(addr);
        if (t) setPendingScan({ addr, inputType: t });
      }
      const caseSlug = params.get("case");
      if (caseSlug) {
        const found = CASE_FILES.find(c => c.id === caseSlug || c.slug === caseSlug);
        if (found) { setActiveCaseFile(found); setPage("case_detail"); }
      }
      const pageParam = params.get("page");
      if (pageParam === "coach") setPage("coach");
      else if (pageParam === "wallets") setPage("wallets");
      else if (pageParam === "inspector") setPage("inspector");
      else if (pageParam === "xpub") setPage("xpub");
    } catch {}
  }, []);
  // Bitcoin state
  const [address, setAddress] = useState("");
  const [addrInfo, setAddrInfo] = useState(null);
  const [utxos, setUtxos] = useState([]);
  const [txs, setTxs] = useState([]);
  const [autoShare, setAutoShare] = useState(false);
  const [scanAt, setScanAt] = useState(null);
  const [defaultSimple, setDefaultSimple] = useState(false);
  const [simpleMode, setSimpleMode] = useState(false); // persists across re-scans
  // Lightning state
  const [lnNodeId, setLnNodeId] = useState("");
  const [lnNodeData, setLnNodeData] = useState(null);
  const [lnChannels, setLnChannels] = useState([]);

  const [isScanningLightning, setIsScanningLightning] = useState(false);
  const [scanDataReady, setScanDataReady] = useState(false);
  const [isMobile, setIsMobile] = useState(() => typeof window !== "undefined" ? window.innerWidth < 768 : false);
  const toast = useToast();

  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);

  const analyze = useCallback(async (addr, plain = false, inputType = "btc") => {
    // Guard: a Lightning address (user@domain) has no node-lookup path, so a "scan" would
    // 404 and silently fall back to DEMO data shown as a real result. Refuse it honestly.
    if (inputType === "ln_address") {
      toast.show("Can't audit a Lightning address", { icon: "⚡", color: T.amber, msg: "Enter your node's 66-character pubkey instead" });
      return;
    }
    const isLn = inputType === "ln_pubkey";
    setScanDataReady(false);

    if (isLn) {
      setLnNodeId(addr);
      setIsScanningLightning(true);
      setPage("scanning");
      try {
        if (addr === "DEMO_LN") {
          await new Promise(r => setTimeout(r, 1400));
          setLnNodeData(DEMO_LN.node);
          setLnChannels(DEMO_LN.channels);
          setScoreTint(scoreColor(runLightningEngine(DEMO_LN.node, DEMO_LN.channels).score));
          setScanDataReady(true);
          await new Promise(r => setTimeout(r, 300));
          setPage("ln_dashboard");
          toast.show("Lightning demo loaded", { icon: "⚡", color: T.ln, msg: "Showing a sample node with privacy issues" });
          return;
        }
        const data = await fetchLightningNode(addr);
        const result = runLightningEngine(data.node, data.channels);
        const prevLn = getHistory().find(e => e.addr === addr);
        const lnDelta = prevLn ? result.score - prevLn.score : null;
        setLnNodeData(data.node);
        setLnChannels(data.channels);
        addToHistory({ addr, score: result.score, grade: result.grade, label: scoreLabel(result.score), scanAt: Date.now(), isLightning: true, alias: data.node.alias });
        setScoreTint(scoreColor(result.score));
        setScanDataReady(true);
        await new Promise(r => setTimeout(r, 300));
        setPage("ln_dashboard");
        toast.show(lnDelta > 0 ? "Node score improved" : "Node scan complete", { icon: lnDelta > 0 ? "📈" : "⚡", color: T.ln, msg: `Lightning privacy score: ${result.score}/100${lnDelta != null && lnDelta !== 0 ? ` (${lnDelta > 0 ? "+" : ""}${lnDelta} since your last scan)` : ""}` });
      } catch {
        // Honest failure — never show canned DEMO data as if it were the user's real node.
        await new Promise(r => setTimeout(r, 700));
        setScanDataReady(false);
        setIsScanningLightning(false);
        setPage("landing");
        toast.show("Node scan couldn't complete", { icon: "⚠️", color: T.red, msg: relayOn() ? "Couldn't reach the API via the privacy relay — try again, or switch the relay off to query the API directly (it will then see your IP)." : "Couldn't reach the Lightning API — check your connection and try again." });
      }
      return;
    }

    setAddress(addr);
    setIsScanningLightning(false);
    setPage("scanning");
    setAutoShare(false);
    setDefaultSimple(plain);

    try {
      if (addr === "DEMO" || addr === "DEMO_A") {
        const demoData = addr === "DEMO_A" ? DEMO_A : DEMO;
        const isPristine = addr === "DEMO_A";
        await new Promise(r => setTimeout(r, 1400));
        setAddrInfo(demoData.addrInfo);
        setUtxos(demoData.utxos);
        setTxs(demoData.txs);
        setScanAt(Date.now());
        setScoreDelta(null); // demos don't track progress
        setScoreTint(scoreColor(runEngine(demoData.utxos, demoData.txs, demoData.addrInfo?.chain_stats?.tx_count || demoData.txs.length).score));
        setScanDataReady(true);
        await new Promise(r => setTimeout(r, 300));
        setPage("dashboard");
        toast.show("Demo loaded", { icon: isPristine ? "✨" : "🔍", color: isPristine ? T.green : T.cyan, msg: isPristine ? "Showing a pristine, CoinJoin-mixed wallet" : "Showing a sample high-risk wallet" });
        return;
      }

      const data = await fetchAddress(addr);
      const analysis = runEngine(data.utxos, data.txs, data.addrInfo?.chain_stats?.tx_count || data.txs.length);
      // Progress vs the previous scan of this address — read BEFORE addToHistory
      // replaces the entry. The history (and therefore this) never leaves the browser.
      const prevEntry = getHistory().find(e => e.addr === addr);
      const delta = prevEntry ? analysis.score - prevEntry.score : null;
      setScoreDelta(delta);
      setAddrInfo(data.addrInfo);
      setUtxos(data.utxos);
      setTxs(data.txs);
      setScanAt(Date.now());
      addToHistory({ addr, score: analysis.score, grade: analysis.grade, label: analysis.riskLabel, scanAt: Date.now(), isLightning: false });
      setScoreTint(scoreColor(analysis.score));
      setScanDataReady(true);
      await new Promise(r => setTimeout(r, 300));
      setPage("dashboard");
      setAutoShare(true);
      toast.show(delta > 0 ? "Score improved" : "Scan complete", { icon: delta > 0 ? "📈" : "✅", color: T.green, msg: `Privacy score: ${analysis.score}/100${delta != null && delta !== 0 ? ` (${delta > 0 ? "+" : ""}${delta} since your last scan)` : ""}` });
    } catch {
      // Honest failure — never show canned DEMO data under the user's real address.
      await new Promise(r => setTimeout(r, 700));
      setScanDataReady(false);
      setPage("landing");
      toast.show("Scan couldn't complete", { icon: "⚠️", color: T.red, msg: relayOn() ? "Couldn't reach the explorer via the privacy relay — try again, or switch the relay off to query the explorer directly (it will then see your IP)." : "Couldn't reach the blockchain API — check your connection and try again." });
    }
  }, [toast]);

  return (
    <>
      <style>{CSS}</style>
      <AmbientBackground tint={(page === "dashboard" || page === "ln_dashboard") ? scoreTint : null} />
      <ScrollProgress />
      <Toast toasts={toast.toasts} />

      {/* ?scan= confirmation — shown over landing, never auto-fires */}
      {pendingScan && page === "landing" && (
        <ConfirmScanModal
          pendingScan={pendingScan}
          onCancel={() => setPendingScan(null)}
          onConfirm={() => { const p = pendingScan; setPendingScan(null); analyze(p.addr, false, p.inputType); }}
        />
      )}

      {/* Page transition: opacity-only fade on every navigation (keyed by page so it replays; no transform → sticky nav preserved) */}
      <div key={page} style={{ animation: "fadeIn .35s ease both" }}>
      {page === "landing"      && <Landing onAnalyze={analyze} isMobile={isMobile} onCases={(c) => { if (c) { setActiveCaseFile(c); setPage("case_detail"); } else { setPage("cases"); } }} />}
      {page === "cases"        && <CaseFiles onOpenCase={c => { setActiveCaseFile(c); setPage("case_detail"); }} onBack={() => setPage("landing")} isMobile={isMobile} />}
      {page === "case_detail"  && activeCaseFile && <CaseDetail caseFile={activeCaseFile} onBack={() => setPage("cases")} onAnalyze={analyze} isMobile={isMobile} />}
      {page === "scanning"     && <Scanning address={address || lnNodeId} isLightning={isScanningLightning} dataReady={scanDataReady} />}
      {page === "dashboard"    && <Dashboard address={address} addrInfo={addrInfo} utxos={utxos} txs={txs} isMobile={isMobile} onBack={() => setPage("landing")} onRescan={analyze} toast={toast} autoShare={autoShare} scanAt={scanAt} defaultSimple={defaultSimple} simpleMode={simpleMode} onSimpleModeChange={setSimpleMode} onCoach={() => setPage("coach")} delta={scoreDelta} />}
      {page === "ln_dashboard" && <LightningDashboard nodeId={lnNodeId} nodeData={lnNodeData} channels={lnChannels} isMobile={isMobile} onBack={() => setPage("landing")} onRescan={analyze} toast={toast} />}
      {page === "coach"        && <CoachWaitlist onBack={() => setPage("landing")} isMobile={isMobile} />}
      {page === "wallets"      && <WalletDirectory onBack={() => setPage("landing")} isMobile={isMobile} />}
      {page === "inspector"    && <TransactionInspector onBack={() => setPage("landing")} isMobile={isMobile} onScan={analyze} />}
      {page === "xpub"         && <XpubScan onBack={() => setPage("landing")} isMobile={isMobile} onScan={analyze} />}
      </div>
    </>
  );
}

// Verify, don't trust — the pure engine functions, exposed read-only so anyone
// can test the scoring logic straight from their browser console (and so CI can
// unit-test the built bundle directly). No state, no user data: pure functions.
window.__ANONSCORE_TEST__ = Object.freeze({
  runEngine, runLightningEngine, classifyUtxo, scoreGrade,
  computeCluster, computePoisoning, isLookalikeAddress, computeActivityClock,
  isValidBitcoinAddress, isValidLightningPubkey, detectInputType,
  // Transaction Inspector — parser + analysis (validated against BIP174/173/350)
  parsePsbt, parseRawTx, classifyScript, parseTransactionInput, detectTxInput,
  analyzeTx, guessChange, clusterUnification, feeRate, DEMO_PSBT,
  // transaction entropy / linkability (Boltzmann · validated vs LaurentMT vectors)
  txInterpretations, txLinkability,
  // wallet fingerprint (structural tells: version/locktime/RBF/BIP69/script-mix/low-r)
  fingerprintTx, _derSigInfo,
  // Silent Payments (BIP352) decode/validate — validated vs the spec test vector
  _bech32Decode, decodeSilentPayment, detectSilentPayment,
  // BOLT11 Lightning invoice decode/lint — validated vs the BOLT11 spec vector
  decodeBolt11, detectBolt11,
  // xpub wallet scanner — crypto (validated against BIP32 TV1 + BIP84 vectors)
  _sha512, _hmacSha512, _ripemd160, decodeXpub, ckdPub, deriveWalletAddress, detectXpub,
  runWalletEngine, DEMO_WALLET,
});

ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(App));
