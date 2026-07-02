/* AUTO-GENERATED from anonscore.jsx by build.mjs — do not edit directly. Run `npm run build`. */
const {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo
} = React;
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
@media (prefers-reduced-motion: reduce){
  *,*::before,*::after{animation-duration:.001ms!important;animation-iteration-count:1!important;transition-duration:.001ms!important}
  .reveal{opacity:1!important;transform:none!important}
  .aurora,.accent-glow,.scan-ov::before{animation:none!important}
}
`;
const T = {
  bg: "#0b0d14",
  surface: "#13151f",
  card: "#181b27",
  cardAlt: "#1e2130",
  border: "#2a2d3a",
  borderLo: "#1e2130",
  text: "#e8eaf6",
  textMid: "#9096b8",
  textDim: "#888fae",
  cyan: "#22D3EE",
  cyanLo: "#22D3EE14",
  cyanMid: "#22D3EE28",
  amber: "#E8A730",
  amberLo: "#E8A73018",
  amberMid: "#E8A73040",
  btc: "#F7931A",
  btcLo: "#F7931A18",
  btcMid: "#F7931A40",
  opn: "#FF6600",
  opnLo: "#FF660018",
  opnMid: "#FF660040",
  red: "#f85149",
  redLo: "#f8514914",
  green: "#3fb950",
  greenLo: "#3fb95014",
  blue: "#58a6ff",
  blueLo: "#58a6ff14",
  ln: "#F59E0B",
  lnLo: "#F59E0B14",
  lnMid: "#F59E0B33",
  mono: "'JetBrains Mono',monospace",
  serif: "'Fraunces',serif",
  sans: "'Outfit',sans-serif",
  display: "'Oxanium',sans-serif"
};
const RISK_META = {
  critical: {
    color: T.red,
    bg: T.redLo,
    label: "Critical"
  },
  high: {
    color: T.btc,
    bg: T.btcLo,
    label: "High"
  },
  medium: {
    color: T.amber,
    bg: T.amberLo,
    label: "Medium"
  },
  low: {
    color: T.blue,
    bg: T.blueLo,
    label: "Low"
  },
  clean: {
    color: T.green,
    bg: T.greenLo,
    label: "Clean"
  }
};
const scoreColor = s => s >= 80 ? T.green : s >= 60 ? T.amber : s >= 40 ? T.btc : T.red;
const scoreLabel = s => s >= 80 ? "Low Risk" : s >= 60 ? "Moderate" : s >= 40 ? "High Risk" : "Critical";
const scoreGrade = s => s >= 90 ? "A" : s >= 75 ? "B" : s >= 60 ? "C" : s >= 45 ? "D" : "F";
const LANDING_CHECKS = [{
  n: "01",
  k: "reuse",
  icon: "↩",
  label: "Address Reuse",
  desc: "Every time you reuse an address, you create a permanent public link between all your transactions."
}, {
  n: "02",
  k: "dust",
  icon: "⚠",
  label: "Dust Attacks",
  desc: "Tiny amounts sent to your wallet by trackers. Spending them reveals your wallet cluster to analysts."
}, {
  n: "03",
  k: "round",
  icon: "◯",
  label: "Round Amounts",
  desc: "Withdrawing 0.1 BTC instead of 0.10743 BTC is a primary signal that funds came from a KYC exchange."
}, {
  n: "04",
  k: "coinjoin",
  icon: "⊕",
  label: "CoinJoin Usage",
  desc: "Whether your transaction history includes any mixing events that break the chain of custody."
}, {
  n: "05",
  k: "consolidation",
  icon: "⊞",
  label: "Unsafe Consolidation",
  desc: "Merging UTXOs from different sources permanently links those coin histories on-chain."
}, {
  n: "06",
  k: "utxo",
  icon: "≣",
  label: "UTXO Count",
  desc: "Too many UTXOs tempt consolidation. Too few exposes your full balance in every transaction."
}, {
  n: "07",
  k: "fee",
  icon: "₿",
  label: "Fee Fingerprinting",
  desc: "Using the same sat/vbyte rate every time identifies your wallet software to blockchain analysts."
}, {
  n: "08",
  k: "change",
  icon: "↔",
  label: "Change Address Reuse",
  desc: "Sending change back to an input address reveals your full balance to the transaction recipient."
}, {
  n: "09",
  k: "concentration",
  icon: "◐",
  label: "Balance Concentration",
  desc: "Holding 90%+ in a single UTXO exposes nearly your full holdings in any transaction."
}, {
  n: "10",
  k: "script",
  icon: "T",
  label: "Script Type Mix",
  desc: "Mixing legacy and SegWit addresses creates analyst-exploitable patterns across your UTXO set."
}];
const LANDING_FACTS = [{
  stat: "$1.1B",
  desc: "Chainalysis 2023 revenue — the price governments pay to surveil Bitcoin transactions",
  source: "Bloomberg, Apr 2023",
  url: "https://www.bloomberg.com/news/articles/2023-04-21/crypto-sleuth-chainalysis-raises-170-million-to-expand"
}, {
  stat: "91%",
  desc: "of Bitcoin addresses have been reused at least once — the most common privacy mistake",
  source: "Blockchair analytics, 2023",
  url: "https://blockchair.com"
}, {
  stat: "546 sat",
  desc: "minimum dust threshold — outputs below this are used by surveillance firms as tracking beacons",
  source: "Bitcoin protocol spec / BIP 113",
  url: "https://github.com/bitcoin/bitcoin/blob/master/src/policy/policy.cpp"
}, {
  stat: "38/100",
  desc: "typical wallet privacy score — most users have address reuse, no CoinJoin, and round-amount withdrawals",
  source: "AnonScore internal data, 2024",
  url: ""
}];
const FUNDING = {
  lightning: "",
  nostr: ""
};
const NEWSLETTER = {
  endpoint: "",
  fallbackMailto: "netassetpremium@gmail.com",
  name: "On-Chain Forensics",
  pitch: "Weekly deep-dives on notable wallets, privacy heuristics, and seizure stories."
};
const COACH = {
  price: "$10",
  unit: "/mo",
  launchTarget: "Q4 2026",
  endpoint: "",
  fallbackMailto: "netassetpremium@gmail.com",
  benefits: [{
    icon: "∞",
    title: "Unlimited messages",
    desc: "Today's 5/day cap → none. Ask as much as you need."
  }, {
    icon: "⏱",
    title: "Persistent memory",
    desc: "The Coach remembers your scans, the fixes you've shipped, and what's next."
  }, {
    icon: "⌂",
    title: "Multi-device",
    desc: "Pick up where you left off across devices. Memory is passphrase-encrypted; the server can't read it."
  }, {
    icon: "✓",
    title: "Personal fix queue",
    desc: "Tracked plan across all your wallets, with progress markers."
  }]
};
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
    "spectrum.avg": "avg wallet: 38",
    "spectrum.high": "100 · Invisible",
    "trust.btc": "₿ Bitcoin addresses are public by design. Your browser reads the chain directly from a public explorer (blockstream.info) — AnonScore never sees or stores your address, but that explorer sees your IP alongside it. Browse over Tor to hide even that link.",
    "trust.ln": "⚡ Lightning node pubkeys are public on the gossip network. Your browser queries mempool.space directly — AnonScore never sees or stores your pubkey, but that API sees your IP alongside it. Browse over Tor to hide even that link.",
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
    "finalcta.h2.a": "Most wallets score 38/100.",
    "finalcta.h2.b": "Where does yours land?",
    "finalcta.sub": "Free, open source, nothing stored. Takes 60 seconds.",
    "finalcta.scan": "Scan my address ↑",
    "finalcta.sample": "▶ See a sample wallet",
    "scanning.btc.title": "Analyzing your wallet…",
    "scanning.ln.title": "Auditing your node…",
    "scanning.btc.checks": "RUNNING 10 CHECKS",
    "scanning.ln.checks": "⚡ RUNNING 8 LIGHTNING CHECKS",
    "scanning.didyouknow": "DID YOU KNOW"
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
    "spectrum.avg": "billetera promedio: 38",
    "spectrum.high": "100 · Invisible",
    "trust.btc": "₿ Las direcciones de Bitcoin son públicas por diseño. Tu navegador lee la cadena directamente desde un explorador público (blockstream.info) — AnonScore nunca ve ni guarda tu dirección, pero ese explorador ve tu IP junto a ella. Navega con Tor para ocultar incluso ese vínculo.",
    "trust.ln": "⚡ Las claves públicas de nodos Lightning son públicas en la red de gossip. Tu navegador consulta mempool.space directamente — AnonScore nunca ve ni guarda tu clave, pero esa API ve tu IP junto a ella. Navega con Tor para ocultar incluso ese vínculo.",
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
    "finalcta.h2.a": "La mayoría de billeteras puntúa 38/100.",
    "finalcta.h2.b": "¿Dónde queda la tuya?",
    "finalcta.sub": "Gratis, código abierto, nada se guarda. Toma 60 segundos.",
    "finalcta.scan": "Escanear mi dirección ↑",
    "finalcta.sample": "▶ Ver una billetera de ejemplo",
    "scanning.btc.title": "Analizando tu billetera…",
    "scanning.ln.title": "Auditando tu nodo…",
    "scanning.btc.checks": "EJECUTANDO 10 VERIFICACIONES",
    "scanning.ln.checks": "⚡ EJECUTANDO 8 VERIFICACIONES LIGHTNING",
    "scanning.didyouknow": "¿SABÍAS QUE?"
  }
};
const SUPPORTED_LANGS = Object.keys(STRINGS);
const LANG_LABEL = {
  en: "EN",
  es: "ES"
};
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
let _lang = typeof window !== "undefined" ? detectLang() : "en";
const _langListeners = new Set();
function setLang(l) {
  if (!SUPPORTED_LANGS.includes(l) || l === _lang) return;
  _lang = l;
  try {
    localStorage.setItem("anonscore_lang", l);
  } catch {}
  try {
    document.documentElement.lang = l;
  } catch {}
  _langListeners.forEach(fn => fn());
}
function t(key) {
  return STRINGS[_lang] && STRINGS[_lang][key] || STRINGS.en[key] || key;
}
function useLang() {
  const [, force] = useState(0);
  useEffect(() => {
    const fn = () => force(x => x + 1);
    _langListeners.add(fn);
    return () => {
      _langListeners.delete(fn);
    };
  }, []);
  return _lang;
}
const TOOL_URL = {
  "Wasabi Wallet": "https://wasabiwallet.io",
  "Sparrow Wallet": "https://sparrowwallet.com",
  "Bitcoin Core": "https://bitcoincore.org",
  "Electrum": "https://electrum.org",
  "Joinmarket": "https://github.com/JoinMarket-Org/joinmarket-clientserver",
  "JoinStr": "https://github.com/JoinStr",
  "BTCPay Server": "https://btcpayserver.org",
  "Blue Wallet": "https://bluewallet.io",
  "Nunchuk": "https://nunchuk.io",
  "Phoenix Wallet": "https://phoenix.acinq.co",
  "Breez": "https://breez.technology",
  "Zeus": "https://zeusln.app",
  "Mutiny Wallet": "https://mutinywallet.com",
  "Blixt Wallet": "https://blixtwallet.github.io",
  "Alby": "https://getalby.com",
  "Bisq": "https://bisq.network",
  "Robosats": "https://learn.robosats.com",
  "Peach Bitcoin": "https://peachbitcoin.com",
  "HodlHodl": "https://hodlhodl.com",
  "AgoraDesk": "https://agoradesk.com",
  "Umbrel": "https://umbrel.com",
  "Start9": "https://start9.com",
  "RaspiBlitz": "https://raspiblitz.com",
  "MyNode": "https://mynodebtc.com",
  "Nodl": "https://nodl.it",
  "mempool.space": "https://mempool.space"
};
const TOOL_AFFILIATE_URL = {};
const toolLink = name => TOOL_AFFILIATE_URL[name] || TOOL_URL[name] || null;
const toolIsAffiliate = name => !!TOOL_AFFILIATE_URL[name];
const WALLET_CATEGORIES = [{
  key: "desktop",
  label: "Desktop wallets",
  icon: "🖥",
  blurb: "Full coin control, the strongest privacy primitives."
}, {
  key: "mobile",
  label: "Mobile wallets",
  icon: "📱",
  blurb: "On-chain BTC in your pocket. Less privacy than desktop — pick carefully."
}, {
  key: "lightning",
  label: "Lightning wallets",
  icon: "⚡",
  blurb: "Off-chain payments. Self-custodial > custodial for privacy."
}, {
  key: "p2p",
  label: "Non-KYC exchanges",
  icon: "🤝",
  blurb: "Source Bitcoin without doxxing yourself to a centralised gatekeeper."
}, {
  key: "node",
  label: "Self-hosted nodes",
  icon: "📡",
  blurb: "Stop leaking every address you query to public Electrum servers."
}];
const WALLET_REVIEWS = [{
  name: "Sparrow Wallet",
  category: "desktop",
  os: "macOS · Windows · Linux",
  pitch: "The pro's desktop Bitcoin wallet. Best-in-class coin control, UTXO labelling, hardware-wallet support, and Tor / your-own-node connectivity by default.",
  strengths: ["Per-UTXO freeze, label, and select before every spend", "Connects to your own Electrum server or Bitcoin Core out of the box — no leaking queries", "Silent Payments send + receive (BIP352), plus strong hardware-wallet support (Coldcard, Trezor, Ledger, Foundation, BitBox, Jade)"],
  watchOuts: ["Desktop only — there is no mobile app", "No built-in CoinJoin since Samourai's Whirlpool was seized in 2024 (Sparrow removed the integration) — use it for coin control + Silent Payments, and mix via a separate tool if needed"]
}, {
  name: "Wasabi Wallet",
  category: "desktop",
  os: "macOS · Windows · Linux",
  pitch: "Privacy-first desktop Bitcoin wallet with WabiSabi CoinJoin and automatic coin labelling. Beginner-friendlier than Sparrow.",
  strengths: ["WabiSabi CoinJoin runs automatically once you pick a coordinator", "Default labels every coin by source, helping avoid accidental cluster merges", "Built-in Tor"],
  watchOuts: ["Its original coordinator (zkSNACKs) shut down in 2024 — you now select a community-run coordinator via 'Change Coordinator'", "Centralized WabiSabi coordinators carry some deanonymization risk; Joinmarket avoids a coordinator entirely", "Desktop only"]
}, {
  name: "Ginger Wallet",
  category: "desktop",
  os: "macOS · Windows · Linux",
  pitch: "An open-source Wasabi fork that runs its own active WabiSabi CoinJoin coordinator — filling the gap left when the original coordinator shut down in 2024.",
  strengths: ["Ships with a working CoinJoin coordinator out of the box — no hunting for one", "Inherits Wasabi's client-side block filters, coin labelling, and built-in Tor", "Fully open source, community-maintained"],
  watchOuts: ["Centralized WabiSabi coordinators carry some deanonymization risk — Joinmarket avoids a coordinator entirely", "Desktop only; a younger fork than upstream Wasabi"]
}, {
  name: "Bitcoin Core",
  category: "desktop",
  os: "macOS · Windows · Linux · BSD",
  pitch: "The reference Bitcoin implementation. The wallet is bundled with a full node, so by definition you query no one but yourself.",
  strengths: ["You ARE your own node — no third-party query leaks possible", "Maximum sovereignty + verification", "Free and battle-tested since 2009"],
  watchOuts: ["Initial block download requires ~600GB and several days", "UX is functional, not friendly — best paired with a wallet front-end (Sparrow, Electrum, Specter)"]
}, {
  name: "Electrum",
  category: "desktop",
  os: "macOS · Windows · Linux · Android",
  pitch: "Long-standing lightweight Bitcoin wallet. Fast, scriptable, deeply customisable, with manual coin control.",
  strengths: ["Lightweight — no full-node download needed", "Manual coin control via the Coins tab + UTXO freezing", "Connects to your own Electrum / Bitcoin-Core-with-Electrs server"],
  watchOuts: ["Default connects to public Electrum servers — change this to your own node before scanning real addresses", "Multiple lookalike fake-Electrum scam wallets exist; verify download signatures"]
}, {
  name: "Joinmarket",
  category: "desktop",
  os: "macOS · Windows · Linux",
  pitch: "Peer-to-peer CoinJoin protocol where 'makers' earn fees and 'takers' pay them. No operator-run coordinator.",
  strengths: ["No central coordinator — fully P2P, harder to censor or seize", "Earn yield as a maker while improving network-wide privacy", "Mature codebase (since 2015)"],
  watchOuts: ["Steep learning curve — CLI-first; the YieldGenerator GUI is improving but rough", "Best for users comfortable running a Bitcoin Core node"]
}, {
  name: "BTCPay Server",
  category: "desktop",
  os: "Self-hosted (Docker / Lightning Node)",
  pitch: "Self-hosted Bitcoin + Lightning payment processor. Merchants own their keys and node — no third-party seeing every payment.",
  strengths: ["Replaces BitPay-style processors that doxx every customer", "Built-in Payjoin + CoinJoin support for merchant flows", "Plugin ecosystem (point-of-sale, accounting, gift cards)"],
  watchOuts: ["You're running infrastructure — backups, updates, and uptime are on you", "Best for merchants and power users; not a personal wallet"]
}, {
  name: "Cake Wallet",
  category: "mobile",
  os: "iOS · Android · macOS",
  pitch: "Open-source mobile wallet for Bitcoin and Monero that brings desktop-grade privacy features — Silent Payments and Payjoin — to your phone.",
  strengths: ["Silent Payments send + receive with on-device scanning (the server never learns which outputs are yours)", "Payjoin v2 in the default send flow — breaks the common-input heuristic on ordinary payments", "Open source; also holds Monero for cross-chain privacy"],
  watchOuts: ["Multi-coin app is heavier than a Bitcoin-only wallet", "Built-in swap/exchange services are third parties — using them can pull in KYC"]
}, {
  name: "Blue Wallet",
  category: "mobile",
  os: "iOS · Android",
  pitch: "Open-source mobile Bitcoin wallet with HD support, multisig, Lightning (via LndHub), and Tor.",
  strengths: ["HD wallet — fresh address per receive by default, plus Silent Payments receiving (BIP352)", "Optional Tor for connection privacy", "Multisig (Vault) support"],
  watchOuts: ["Default Lightning is custodial (LndHub) — fine for spending money, not savings", "Mobile means limited coin control vs. desktop"]
}, {
  name: "Nunchuk",
  category: "mobile",
  os: "iOS · Android · macOS · Windows · Linux",
  pitch: "Privacy-focused multisig wallet with strong UTXO management and collaborative custody.",
  strengths: ["First-class multisig + assisted recovery", "Per-UTXO tagging and coin control, plus Silent Payments receiving (BIP352)", "Works with most hardware wallets"],
  watchOuts: ["Some features (key recovery service) involve trusting Nunchuk Pro — read the model before enabling", "Best for users already comfortable with multisig concepts"]
}, {
  name: "Phoenix Wallet",
  category: "lightning",
  os: "iOS · Android",
  pitch: "Self-custodial mobile Lightning by ACINQ. Channels managed automatically — feels custodial, but the keys are yours.",
  strengths: ["You hold the keys — true self-custody", "Channels open and rebalance themselves; no liquidity management needed", "Tor-friendly"],
  watchOuts: ["ACINQ is the only LSP — single peer is fine for spending, less so for receiving large amounts", "Splice/channel fees are unavoidable when on-chain settlement happens"]
}, {
  name: "Breez",
  category: "lightning",
  os: "iOS · Android",
  pitch: "Self-custodial mobile Lightning wallet with a built-in podcast player and merchant point-of-sale.",
  strengths: ["Self-custodial Lightning + on-chain in one app", "Built-in keysend & podcast support (LN over RSS)", "POS mode for merchants"],
  watchOuts: ["Like all auto-channel-opening LN wallets, you trust the LSP not to grief during channel opens", "Receive UX can be confusing for first-timers (channel-open fees on first receive)"]
}, {
  name: "Zeus",
  category: "lightning",
  os: "iOS · Android",
  pitch: "Connect your own LND, CLN, or Eclair node from your phone. Power-user remote control.",
  strengths: ["You run the node — zero LSP / operator trust", "Supports LND, Core Lightning (CLN), Eclair, Embedded LND", "Per-channel routing controls"],
  watchOuts: ["Requires you to already have a Lightning node — not a beginner starting point", "Mobile connection back to your node needs careful Tor / VPN setup"]
}, {
  name: "Mutiny Wallet",
  category: "lightning",
  os: "Web (PWA) · Android",
  pitch: "Self-custodial Lightning + on-chain wallet that runs in your browser. No app store.",
  strengths: ["PWA — no app store to deplatform you", "Self-custodial Lightning via LDK", "Built-in Nostr Wallet Connect (NWC) for zaps"],
  watchOuts: ["Browser environment means cookies/storage hygiene matters", "Younger codebase than Phoenix or Breez; treat as 'spending money', not 'cold storage'"]
}, {
  name: "Blixt Wallet",
  category: "lightning",
  os: "Android · macOS · Windows · Linux",
  pitch: "Runs a full LND node directly on your phone — no LSP, no custodian, no compromises.",
  strengths: ["Embedded LND node — you ARE the Lightning node", "Full feature set: keysend, AMP, MPP, splicing, BOLT-12", "Open source, no telemetry"],
  watchOuts: ["You must manage channels and liquidity yourself", "Battery drain higher than auto-channel wallets — needs to stay online to route"]
}, {
  name: "Alby",
  category: "lightning",
  os: "Browser extension (Chrome / Firefox / Safari)",
  pitch: "Browser-side Lightning + Nostr identity. Zaps, podcasting, and WebLN-enabled apps without leaving the page.",
  strengths: ["WebLN brings one-click LN payments to web apps", "Nostr signing built in — one extension covers both protocols", "Account → Alby Hub option lets you self-host the back-end"],
  watchOuts: ["The hosted Alby account is custodial unless you migrate to Alby Hub", "Browser extension model means an attacker who compromises the browser sees your keys"]
}, {
  name: "Bisq",
  category: "p2p",
  os: "macOS · Windows · Linux",
  pitch: "Decentralised peer-to-peer Bitcoin exchange. Trades happen over Tor with two-of-two multisig escrow — no custodian.",
  strengths: ["No KYC, no account, no operator that can be subpoenaed", "Tor-only by default", "Multisig escrow means even a fraudulent counterparty can't take your funds"],
  watchOuts: ["Liquidity is thinner than KYC venues — expect higher spreads and slower fills", "Bisq2 (the rewrite) is still maturing; Bisq1 will sunset eventually"]
}, {
  name: "Robosats",
  category: "p2p",
  os: "Web (Tor) · Android",
  pitch: "Lightning-based peer-to-peer Bitcoin exchange. Trades complete in minutes via hold invoices — no custody, no signup.",
  strengths: ["Tor-native + Lightning-fast settlement", "No account, no email, no KYC ever", "Reputation system built around hashed-key identities, not real names"],
  watchOuts: ["Lower-volume than Bisq for large trades", "You need a Lightning wallet that supports hold invoices (most do, some don't)"]
}, {
  name: "Peach Bitcoin",
  category: "p2p",
  os: "iOS · Android",
  pitch: "Mobile peer-to-peer Bitcoin marketplace. SEPA, cash-by-mail, and many other payment methods supported.",
  strengths: ["Mobile-first — easier than Bisq for non-technical users", "Wide payment-method support per region", "Optional escrow"],
  watchOuts: ["Operator-run platform — not as censorship-resistant as Bisq", "Mobile means you trust your phone OS — use a privacy-respecting handset"]
}, {
  name: "HodlHodl",
  category: "p2p",
  os: "Web",
  pitch: "Non-custodial P2P marketplace using on-chain multisig escrow. Years of operation, broad payment-method support.",
  strengths: ["Multisig escrow — funds locked in 2-of-3 between buyer, seller, HodlHodl arbiter", "Lots of payment methods including cash-by-mail", "Long operating history"],
  watchOuts: ["Web-only — Tor recommended", "Arbiter participates in escrow; choose counterparties with established reputation"]
}, {
  name: "AgoraDesk",
  category: "p2p",
  os: "Web",
  pitch: "Peer-to-peer marketplace evolved from LocalBitcoins-style trading. Supports cash-in-person and many fiat methods.",
  strengths: ["Cash-in-person and cash-by-mail support is rare and valuable", "No mandatory KYC for most trades"],
  watchOuts: ["Operator-run — you trust AgoraDesk's arbitration", "Cash-in-person trades carry physical-safety considerations; meet in public"]
}, {
  name: "Umbrel",
  category: "node",
  os: "Raspberry Pi · Linux · Umbrel Home (hardware)",
  pitch: "App-store-style plug-and-play personal server. Bitcoin + Lightning + dozens of self-hostable apps.",
  strengths: ["One-click app installs — easiest path to your own node", "Includes Bitcoin Core, LND, and Electrs out of the box", "Active community + frequent updates"],
  watchOuts: ["Umbrel OS opens an attack surface — keep it on a separate VLAN, don't expose to the internet without Tor", "App-store model means trusting Umbrel's app review for any add-ons you install"]
}, {
  name: "Start9",
  category: "node",
  os: "StartOS (purpose-built) · Server Hardware",
  pitch: "Sovereignty-focused Linux distro for self-hosting. Strong privacy and security defaults — Tor by default, no remote telemetry.",
  strengths: ["Tor everywhere by default — clearnet is opt-in", "Reproducible builds for every service", "Lightning + Bitcoin + Nostr relay + many privacy services in the catalogue"],
  watchOuts: ["Pricier hardware than Umbrel's Pi-based starter setups", "More configuration surface — read each service's docs before exposing it"]
}, {
  name: "RaspiBlitz",
  category: "node",
  os: "Raspberry Pi",
  pitch: "DIY-style Bitcoin + Lightning node distribution with a focus on transparency and learning.",
  strengths: ["Fully open source — every layer auditable", "Strong Lightning routing-node feature set", "Active maintainer community"],
  watchOuts: ["More hands-on than Umbrel — assumes Linux comfort", "Display + Pi hardware integration can be finicky"]
}, {
  name: "MyNode",
  category: "node",
  os: "Raspberry Pi · Linux",
  pitch: "Beginner-friendly Bitcoin / Lightning node with a free community edition and a paid premium tier.",
  strengths: ["Simple web UI", "Free Community Edition covers the essentials", "Premium adds VPN, BTCPay, and pro support"],
  watchOuts: ["Premium model means some features (VPN, BTCPay one-click) require a paid licence", "Community is smaller than Umbrel's"]
}, {
  name: "Nodl",
  category: "node",
  os: "Nodl hardware appliance",
  pitch: "Pre-built plug-and-play Bitcoin + Lightning node hardware. Pay once, plug in, done.",
  strengths: ["Zero-assembly hardware — fastest path from 'no node' to 'have node'", "Tor + clearnet + Electrum + LND all preconfigured"],
  watchOuts: ["Hardware vendor — you trust Nodl's firmware build process", "More expensive than DIY Pi setups"]
}];
const CASE_FILES = [{
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
  thread: ["In 2016, hackers stole 119,756 BTC from Bitfinex (~$72M at the time). The funds sat dormant for 6 years. Then in Feb 2022, the DOJ moved it all at once — and arrested a NYC couple the same day. Here's what the on-chain data shows 🧵", "All 94,000+ BTC arrived at this address on a single date: February 1, 2022. Every input, same day. That's not how normal wallets work. That's a government seizure — structured, controlled, and permanent.", "The wallet has NEVER sent anything out. No mixing. No CoinJoin. No obfuscation attempts. It's the forensic opposite of what a privacy-conscious holder would do — which makes sense. The FBI isn't trying to hide.", "The privacy score? Terrible. Balance concentration at 100%. No CoinJoin ever. Round amounts everywhere. Script type inconsistency from the original hack consolidations. It scores F by almost every heuristic.", "The lesson isn't about the DOJ's privacy. It's about what 6 years of blockchain forensics looks like. Chainalysis and CipherTrace traced every hop. The hack funds never really moved — they just waited to be claimed. anonscore.com/?scan=bc1qazcm763858nkj2dj986etajv6wquslv8uxwczt"],
  tags: ["#Bitcoin", "#Bitfinex", "#Forensics", "#DOJ"],
  notable: ["Largest crypto seizure in history", "Funded in a single day — Feb 1 2022", "Connected to 2016 Bitfinex hack", "Lichtenstein & Morgan sentenced Nov 2024 (5 yrs / 18 mo)"],
  externalUrl: "https://www.justice.gov/opa/pr/two-arrested-alleged-conspiracy-launder-45-billion-stolen-cryptocurrency-hack"
}, {
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
  thread: ["This is the single largest Bitcoin address on Earth. ~248,000 BTC. ~$17 billion. One address. It belongs to Binance — and its privacy score is absolutely terrible. Here's why that matters 🧵", "Round amounts everywhere. Binance processes thousands of deposits and withdrawals, almost always in round numbers (0.1 BTC, 1.0 BTC, 10.0 BTC). This is the primary signal Chainalysis uses to identify exchange activity. It's permanently on-chain.", "Zero CoinJoin. Zero mixing. 100% balance concentration. The wallet literally scores 0 on the checks that matter most for privacy. Not because Binance is careless — but because custodial exchanges fundamentally can't be private.", "The deeper point: every sat in this address belongs to a Binance customer, but those customers have no on-chain claim. Their coins are pooled, indistinguishable, and controlled by a single company. That's custodial risk in address form.", "Not your keys, not your coins — this is what that looks like on-chain. Scan it yourself: anonscore.com/?scan=34xp4vRoCGJym3xR7yCVPFHoCNxv4Twseo"],
  tags: ["#Bitcoin", "#Binance", "#NotYourKeys", "#Privacy"],
  notable: ["Largest single Bitcoin address on-chain", "~248,000 BTC / ~$17B", "Primary Binance cold storage", "Perfect example of custodial risk"],
  externalUrl: "https://arkham.com"
}, {
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
  thread: ["On November 3, 2020, $1 billion in Bitcoin moved from this address. It had been dormant for 7 years. The owner was never identified. This is the most mysterious wallet in Bitcoin history 🧵", "Between 2012-2013, someone hacked Silk Road and stole 69,370 BTC. They moved it here — and then never spent a single satoshi for 7 years. No mixing. No splitting. Just held.", "Why hold for 7 years without spending? Because they knew any movement would be traced. Blockchain analytics firms had this address tagged and watched. The only safe move was no move.", "In 2020, 'Individual X' — their identity still unknown — contacted the US Government and voluntarily forfeited the coins. In exchange for what, exactly, was never disclosed. The DOJ auctioned off the BTC.", "The privacy lesson: sometimes the right move is to do nothing. 7 years of inaction was the most effective privacy strategy possible. Until it wasn't. anonscore.com/?scan=1HQ3Go3ggs8pFnXuHVHRytPCq5fGG8Hbhx"],
  tags: ["#Bitcoin", "#SilkRoad", "#Forensics", "#Privacy"],
  notable: ["69,370 BTC dormant for 7 years", "Stolen from Silk Road 2012-2013", "Owner 'Individual X' — never identified", "Largest single BTC movement at time ($1B, Nov 2020)"],
  externalUrl: "https://en.wikipedia.org/wiki/Silk_Road_(marketplace)"
}, {
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
  thread: ["In 2012, James Zhong stole 50,000 BTC from Silk Road using a withdrawal exploit. He then hid the coins for 9 years — barely touching them. The FBI found them under his bathroom floor. Here's the on-chain story 🧵", "The theft was simple: create accounts, deposit small amounts, then trigger multiple rapid withdrawals before Silk Road's system updated balances. Nine accounts. ~50,000 BTC. One exploit. $600,000 in 2012 — $3.3 billion when seized.", "For 9 years, Zhong did almost nothing with the coins. A few consolidations. Some small movements. Remarkable discipline. The blockchain recorded every one of those moves permanently.", "In late 2020, he moved some coins to a mixer. Too late. The FBI had already traced the original theft through the full transaction history. The mixing didn't obscure what had already been established.", "The find: a single-board computer hidden under his bathroom floorboards, containing the wallet. Plus 1 BTC in a popcorn tin in a safe. The blockchain led them straight there. anonscore.com/?scan=bc1qmxjefnuy06v345v6vhwpwt05dztztmx4g3y7wp"],
  tags: ["#Bitcoin", "#SilkRoad", "#Forensics", "#DOJ"],
  notable: ["50,000 BTC stolen via withdrawal exploit in 2012", "Held untouched for 9 years", "Found on Raspberry Pi under bathroom floorboards + in a popcorn tin", "Mixer used in 2020 — too late to obscure the original trace"],
  externalUrl: "https://www.justice.gov/opa/pr/special-agent-james-zhong-pleads-guilty-wire-fraud-stealing-over-50000-bitcoin-silk-road"
}, {
  id: "005",
  slug: "satoshi-patoshi-cluster",
  title: "The Satoshi Cluster",
  address: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
  entity: "Satoshi Nakamoto (attributed)",
  btc: "~1,100,000",
  category: "miner",
  status: "dormant",
  added: "2026-04-01",
  hook: "The genesis address. The first Bitcoin ever mined. 1,000,000+ BTC never moved. What does the original Bitcoin wallet tell us about privacy — and what happens if it ever moves?",
  summary: "Satoshi Nakamoto mined approximately 1.1 million Bitcoin in the early days of the network, identifiable through a distinctive mining pattern called the Patoshi Pattern. None of it has ever been spent. These dormant coins represent the ultimate long-term hodl — and the ultimate privacy case study.",
  narrative: `On January 3, 2009, Satoshi Nakamoto mined the first Bitcoin block — the Genesis Block — and received 50 BTC. That reward has never moved. Neither have the rewards from thousands of subsequent blocks Satoshi mined in the following months.

Researcher Sergio Demian Lerner identified a distinctive pattern in early Bitcoin mining — now called the Patoshi Pattern — that allows attribution of roughly 1.1 million BTC to a single miner, almost certainly Satoshi. The nonce values in these early blocks follow a unique incremental pattern not seen in any other early miner.

From a privacy perspective, Satoshi's approach was actually quite sophisticated for 2009: mining to fresh addresses, never consolidating, never reusing. The problem was scale — mining 1.1 million BTC in a single cohort creates an attribution link that no amount of address rotation can erase. The Patoshi Pattern shows that privacy through address diversity only works if your total activity doesn't form a recognizable signature.

The burning question: what happens if these coins ever move? Every analysis suggests it would be the most significant Bitcoin event in history. The market would likely crash. Every blockchain analytics firm has alerts set. And whoever moved them would immediately become the most watched Bitcoin holder on Earth.

Satoshi's best privacy move was also the simplest: don't spend.`,
  thread: ["1,100,000 Bitcoin. Never moved. The coins mined by Bitcoin's creator, Satoshi Nakamoto, have sat untouched for 15+ years. What do they tell us about privacy — and what happens if they ever move? 🧵", "Researcher Sergio Lerner found a distinctive pattern in early block mining — now called the 'Patoshi Pattern'. The nonce values increment in a unique way that links ~22,000 early blocks to a single miner. Almost certainly Satoshi.", "The privacy lesson: Satoshi used fresh addresses for every block. Smart. But mining 1.1M BTC in one cohort creates an attribution fingerprint that address rotation can't erase. Scale defeats privacy.", "What happens if these coins move? Every analytics firm has alerts set. The market would likely drop significantly. Whoever moved them would be the most-watched Bitcoin holder on Earth. Which may be why they haven't.", "Satoshi's best privacy strategy turned out to be the simplest: don't spend. 15 years of inaction. The coins are worth $77B today. Sometimes the most private wallet is the one that never moves. anonscore.com"],
  tags: ["#Bitcoin", "#Satoshi", "#PatoshiPattern", "#Privacy"],
  notable: ["Genesis Block — first Bitcoin ever mined", "~1.1M BTC attributed via Patoshi Pattern", "Never moved since 2009-2010", "Would be the most significant BTC event in history if moved"],
  externalUrl: "https://bitslog.com/2013/04/17/the-well-deserved-fortune-of-satoshi-nakamoto/"
}, {
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
  thread: ["On March 1, 2011, someone stole 80,000 BTC from Mt. Gox — then put it in this address and never touched it again. 15 years of silence. $5 billion sitting there. Here's the full on-chain story 🧵", "The attack: compromised an auditor's account, transferred 79,957.2 BTC in a single move. Worth $875,000 at the time. Worth $5+ billion now. It was one of the largest Bitcoin thefts ever recorded.", "What makes this forensically unique: in 15 years, not one satoshi has left this address. No test tx. No consolidations. No mixing attempts. The wallet has only ever RECEIVED — including taunting dust sent by onlookers over the years.", "The privacy lesson: for a thief, the most effective strategy is often to do absolutely nothing. Any movement would be traced instantly — Chainalysis has had this wallet flagged since 2011. Moving would trigger alerts at every major exchange.", "The attacker made a choice: billions sitting in an address they can never spend safely, or millions in prison. They chose billions. The coins are still there. Still watched. Still untouched. anonscore.com/?scan=1FeexV6bAHb8ybZjqQMjJrcCrHGW9sb6uF"],
  tags: ["#Bitcoin", "#MtGox", "#Forensics", "#Privacy"],
  notable: ["79,957 BTC stolen on March 1, 2011", "Never sent anything out — 15 years dormant", "Worth $5+ billion at current prices", "Attacker identity never established"],
  externalUrl: "https://bitcointalk.org/index.php?topic=5464048.0"
}];
const HISTORY_KEY = "anonscore_history_v1";
const getHistory = () => {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
  } catch {
    return [];
  }
};
const addToHistory = entry => {
  try {
    const h = getHistory().filter(e => e.addr !== entry.addr);
    h.unshift(entry);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(h.slice(0, 5)));
  } catch {}
};
const removeFromHistory = addr => {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(getHistory().filter(e => e.addr !== addr)));
  } catch {}
};
const FIXES_KEY = "anonscore_fixes_v1";
const getDoneFixes = addr => {
  try {
    return new Set(JSON.parse(localStorage.getItem(FIXES_KEY + ":" + addr) || "[]"));
  } catch {
    return new Set();
  }
};
const saveDoneFixes = (addr, set) => {
  try {
    localStorage.setItem(FIXES_KEY + ":" + addr, JSON.stringify([...set]));
  } catch {}
};
const DEMO_EXAMPLES = [{
  grade: "F",
  score: 22,
  label: "High Risk",
  color: T.red,
  issues: ["Address reused 12 times", "KYC coins merged with private", "3 dust UTXOs (trackers)", "No CoinJoin ever used"]
}, {
  grade: "C",
  score: 61,
  label: "Moderate",
  color: T.amber,
  issues: ["Address reused 3 times", "Round-number withdrawal", "Single UTXO — exposes balance", "Change sent to fresh addresses ✓"]
}, {
  grade: "A",
  score: 91,
  label: "Low Risk",
  color: T.green,
  issues: ["Fresh address every transaction ✓", "CoinJoin used — 2 rounds ✓", "Balanced UTXO set ✓", "Lightning for spending ✓"]
}];
const LANDING_CHECKS_LN = [{
  n: "01",
  k: "node",
  label: "Public Node Announcement",
  desc: "Whether your node is gossiped publicly. Public nodes expose IP or Tor address to every peer on the network."
}, {
  n: "02",
  k: "kyc",
  label: "KYC Exchange Peers",
  desc: "Channels open to Bitfinex, Kraken, Binance or similar. These log routing metadata and can correlate payment flows."
}, {
  n: "03",
  k: "tor",
  label: "Tor / Clearnet Exposure",
  desc: "Clearnet-only nodes leak your physical location and ISP. Tor-only operation prevents this entirely."
}, {
  n: "04",
  k: "diversity",
  label: "Channel Diversity",
  desc: "Fewer channels mean predictable routing paths and limited payment anonymity. More peers = harder to surveil."
}, {
  n: "05",
  k: "capacity",
  label: "Capacity Concentration",
  desc: "If 80%+ of capacity sits in one channel, your routing patterns become trivially predictable to any observer."
}, {
  n: "06",
  k: "alias",
  label: "Node Alias Privacy",
  desc: "Your alias is broadcast to the entire gossip network. A real name or handle links your identity to every channel."
}, {
  n: "07",
  k: "age",
  label: "Node Age",
  desc: "New nodes have thin routing history, making their activity easier to attribute. Older nodes blend into the network."
}, {
  n: "08",
  k: "footprint",
  label: "On-Chain Channel Footprint",
  desc: "Every channel open/close is an on-chain transaction. Funding from KYC UTXOs permanently links your two identities."
}];
function HeuristicIcon({
  k,
  size = 22,
  color = "currentColor"
}) {
  const shapes = {
    reuse: React.createElement(React.Fragment, null, React.createElement("circle", {
      cx: "8",
      cy: "12",
      r: "4"
    }), React.createElement("circle", {
      cx: "16",
      cy: "12",
      r: "4"
    })),
    dust: React.createElement(React.Fragment, null, React.createElement("circle", {
      cx: "6",
      cy: "7",
      r: "1"
    }), React.createElement("circle", {
      cx: "11",
      cy: "5",
      r: "1"
    }), React.createElement("circle", {
      cx: "17",
      cy: "8",
      r: "1"
    }), React.createElement("circle", {
      cx: "8",
      cy: "13",
      r: "1"
    }), React.createElement("circle", {
      cx: "15",
      cy: "15",
      r: "1"
    }), React.createElement("circle", {
      cx: "19",
      cy: "13",
      r: "1"
    }), React.createElement("circle", {
      cx: "5",
      cy: "18",
      r: "1"
    }), React.createElement("circle", {
      cx: "12",
      cy: "19",
      r: "1"
    })),
    round: React.createElement(React.Fragment, null, React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "8"
    }), React.createElement("path", {
      d: "M9.5 12a2.5 3 0 1 0 5 0a2.5 3 0 1 0 -5 0"
    })),
    coinjoin: React.createElement(React.Fragment, null, React.createElement("path", {
      d: "M4 6 L12 12 L4 18"
    }), React.createElement("path", {
      d: "M20 6 L12 12 L20 18"
    }), React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "1.4"
    })),
    consolidation: React.createElement(React.Fragment, null, React.createElement("path", {
      d: "M4 5 L13 12 M4 12 L13 12 M4 19 L13 12"
    }), React.createElement("path", {
      d: "M13 12 L20 12"
    }), React.createElement("circle", {
      cx: "20",
      cy: "12",
      r: "1.4"
    })),
    utxo: React.createElement(React.Fragment, null, React.createElement("rect", {
      x: "4",
      y: "6",
      width: "16",
      height: "3",
      rx: "1.5"
    }), React.createElement("rect", {
      x: "4",
      y: "11",
      width: "11",
      height: "3",
      rx: "1.5"
    }), React.createElement("rect", {
      x: "4",
      y: "16",
      width: "14",
      height: "3",
      rx: "1.5"
    })),
    fee: React.createElement(React.Fragment, null, React.createElement("path", {
      d: "M13 4 L20 11 a1.5 1.5 0 0 1 0 2 L13 20 a1.5 1.5 0 0 1 -2 0 L4 13 L4 6 a2 2 0 0 1 2 -2 Z"
    }), React.createElement("circle", {
      cx: "8",
      cy: "8",
      r: "1.1"
    })),
    change: React.createElement(React.Fragment, null, React.createElement("path", {
      d: "M16 7 L8 7 a4 4 0 0 0 0 8 L17 15"
    }), React.createElement("path", {
      d: "M14 12 L17 15 L14 18"
    })),
    concentration: React.createElement(React.Fragment, null, React.createElement("circle", {
      cx: "10",
      cy: "12",
      r: "6"
    }), React.createElement("circle", {
      cx: "19",
      cy: "6",
      r: "1.6"
    }), React.createElement("circle", {
      cx: "19",
      cy: "18",
      r: "1.6"
    })),
    script: React.createElement(React.Fragment, null, React.createElement("rect", {
      x: "4",
      y: "5",
      width: "8",
      height: "8",
      rx: "1"
    }), React.createElement("circle", {
      cx: "16",
      cy: "15",
      r: "4"
    })),
    node: React.createElement(React.Fragment, null, React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "2"
    }), React.createElement("path", {
      d: "M6 12a6 6 0 0 1 12 0",
      opacity: ".85"
    }), React.createElement("path", {
      d: "M3.5 12a8.5 8.5 0 0 1 17 0",
      opacity: ".5"
    })),
    kyc: React.createElement(React.Fragment, null, React.createElement("path", {
      d: "M4 9 L12 4 L20 9"
    }), React.createElement("path", {
      d: "M5 9 L5 18 M19 9 L19 18 M9 9 L9 18 M15 9 L15 18"
    }), React.createElement("path", {
      d: "M4 19 L20 19"
    })),
    tor: React.createElement(React.Fragment, null, React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "8"
    }), React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "5",
      opacity: ".7"
    }), React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "2",
      opacity: ".5"
    })),
    diversity: React.createElement(React.Fragment, null, React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "2"
    }), React.createElement("path", {
      d: "M12 10 L12 4 M12 14 L12 20 M10 12 L4 12 M14 12 L20 12 M10.5 10.5 L6 6 M13.5 13.5 L18 18"
    }), React.createElement("circle", {
      cx: "12",
      cy: "4",
      r: "1.3"
    }), React.createElement("circle", {
      cx: "12",
      cy: "20",
      r: "1.3"
    }), React.createElement("circle", {
      cx: "4",
      cy: "12",
      r: "1.3"
    }), React.createElement("circle", {
      cx: "20",
      cy: "12",
      r: "1.3"
    })),
    capacity: React.createElement(React.Fragment, null, React.createElement("rect", {
      x: "4",
      y: "5",
      width: "16",
      height: "5",
      rx: "2"
    }), React.createElement("rect", {
      x: "4",
      y: "13",
      width: "6",
      height: "3",
      rx: "1.5",
      opacity: ".55"
    }), React.createElement("rect", {
      x: "4",
      y: "18",
      width: "4",
      height: "2.5",
      rx: "1.2",
      opacity: ".4"
    })),
    alias: React.createElement(React.Fragment, null, React.createElement("path", {
      d: "M4 7 a2 2 0 0 1 2 -2 L13 5 L20 12 L13 19 L6 19 a2 2 0 0 1 -2 -2 Z"
    }), React.createElement("circle", {
      cx: "8.5",
      cy: "9.5",
      r: "1.3"
    })),
    age: React.createElement(React.Fragment, null, React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "8"
    }), React.createElement("path", {
      d: "M12 7.5 L12 12 L15.5 14"
    })),
    footprint: React.createElement(React.Fragment, null, React.createElement("ellipse", {
      cx: "9",
      cy: "12",
      rx: "4",
      ry: "3",
      transform: "rotate(-30 9 12)"
    }), React.createElement("ellipse", {
      cx: "15",
      cy: "12",
      rx: "4",
      ry: "3",
      transform: "rotate(-30 15 12)"
    }))
  };
  return React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: "1.6",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true"
  }, shapes[k] || React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "7"
  }));
}
function CaseHero({
  seed = "0",
  color = "#22D3EE",
  height = 120
}) {
  const W = 800,
    H = height;
  let s = 0;
  for (let i = 0; i < seed.length; i++) s = s * 31 + seed.charCodeAt(i) >>> 0;
  const rnd = () => {
    s = s * 1103515245 + 12345 & 0x7fffffff;
    return s / 0x7fffffff;
  };
  const inputs = 4 + Math.floor(rnd() * 4);
  const outputs = 3 + Math.floor(rnd() * 4);
  const cx = W * 0.5,
    cy = H / 2;
  const yIn = n => H * (n + 1) / (inputs + 1);
  const yOut = n => H * (n + 1) / (outputs + 1);
  return React.createElement("svg", {
    viewBox: `0 0 ${W} ${H}`,
    width: "100%",
    height: H,
    preserveAspectRatio: "none",
    "aria-hidden": "true",
    style: {
      display: "block"
    }
  }, React.createElement("defs", null, React.createElement("radialGradient", {
    id: `ch-glow-${s}`,
    cx: "50%",
    cy: "50%",
    r: "50%"
  }, React.createElement("stop", {
    offset: "0%",
    stopColor: color,
    stopOpacity: "0.35"
  }), React.createElement("stop", {
    offset: "100%",
    stopColor: color,
    stopOpacity: "0"
  }))), React.createElement("rect", {
    x: cx - 120,
    y: cy - 60,
    width: "240",
    height: "120",
    fill: `url(#ch-glow-${s})`
  }), Array.from({
    length: inputs
  }).map((_, i) => React.createElement("path", {
    key: "i" + i,
    d: `M40 ${yIn(i).toFixed(1)} C ${W * 0.3} ${yIn(i).toFixed(1)}, ${cx - 60} ${cy}, ${cx} ${cy}`,
    fill: "none",
    stroke: color,
    strokeWidth: "1",
    strokeOpacity: "0.28"
  })), Array.from({
    length: outputs
  }).map((_, i) => React.createElement("path", {
    key: "o" + i,
    d: `M${cx} ${cy} C ${cx + 60} ${cy}, ${W * 0.7} ${yOut(i).toFixed(1)}, ${W - 40} ${yOut(i).toFixed(1)}`,
    fill: "none",
    stroke: color,
    strokeWidth: "1",
    strokeOpacity: "0.28"
  })), Array.from({
    length: inputs
  }).map((_, i) => React.createElement("circle", {
    key: "ni" + i,
    cx: "40",
    cy: yIn(i).toFixed(1),
    r: "3",
    fill: color,
    fillOpacity: "0.55"
  })), Array.from({
    length: outputs
  }).map((_, i) => React.createElement("circle", {
    key: "no" + i,
    cx: W - 40,
    cy: yOut(i).toFixed(1),
    r: "3",
    fill: color,
    fillOpacity: "0.55"
  })), React.createElement("circle", {
    cx: cx,
    cy: cy,
    r: "11",
    fill: "none",
    stroke: color,
    strokeWidth: "1.5",
    strokeOpacity: "0.5",
    style: {
      animation: "scanRing 2.4s ease-out infinite",
      transformOrigin: `${cx}px ${cy}px`
    }
  }), React.createElement("circle", {
    cx: cx,
    cy: cy,
    r: "6",
    fill: color,
    fillOpacity: "0.9",
    style: {
      filter: `drop-shadow(0 0 6px ${color})`
    }
  }));
}
function ChecksSection({
  isMobile
}) {
  const [mode, setMode] = useState("btc");
  const checks = mode === "btc" ? LANDING_CHECKS : LANDING_CHECKS_LN;
  const accent = mode === "btc" ? T.cyan : T.ln;
  const accentLo = mode === "btc" ? T.cyanLo : T.lnLo;
  const accentMid = mode === "btc" ? T.cyanMid : T.lnMid;
  return React.createElement(React.Fragment, null, React.createElement("div", {
    style: {
      textAlign: "center",
      marginBottom: 32
    }
  }, React.createElement("div", {
    style: {
      fontFamily: T.mono,
      fontSize: 10,
      color: T.textDim,
      letterSpacing: 2.5,
      marginBottom: 12
    }
  }, "WHAT WE CHECK \u2014 PLAIN ENGLISH"), React.createElement("h2", {
    style: {
      fontFamily: T.serif,
      fontSize: isMobile ? 28 : 40,
      color: T.text,
      fontWeight: 400,
      marginBottom: 20
    }
  }, "Every check, explained"), React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      justifyContent: "center"
    }
  }, [["btc", "₿ 10 Bitcoin heuristics", T.cyan, T.cyanLo, T.cyanMid], ["ln", "⚡ 8 Lightning checks", T.ln, T.lnLo, T.lnMid]].map(([m, label, col, lo, mid]) => React.createElement("button", {
    key: m,
    onClick: () => setMode(m),
    style: {
      fontFamily: T.mono,
      fontSize: 10,
      color: mode === m ? col : T.textDim,
      background: mode === m ? lo : "transparent",
      border: `1px solid ${mode === m ? mid : T.border}`,
      borderRadius: 6,
      padding: "6px 14px",
      cursor: "pointer",
      transition: "all .15s"
    }
  }, label)))), React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
      gap: 10
    }
  }, checks.map(c => React.createElement("div", {
    key: c.n,
    style: {
      display: "flex",
      gap: 14,
      alignItems: "flex-start",
      background: T.card,
      border: `1px solid ${T.border}`,
      borderRadius: 12,
      padding: "16px 18px",
      transition: "transform .13s ease-out, border-color .15s, box-shadow .28s"
    },
    onMouseMove: tiltMove,
    onMouseOver: e => {
      e.currentTarget.style.borderColor = accentMid;
      e.currentTarget.style.boxShadow = `0 12px 30px -14px ${accent}`;
    },
    onMouseOut: e => {
      tiltReset(e);
      e.currentTarget.style.borderColor = T.border;
      e.currentTarget.style.boxShadow = "none";
    }
  }, React.createElement("div", {
    style: {
      flexShrink: 0,
      width: 42,
      height: 42,
      borderRadius: 11,
      background: accentLo,
      border: `1px solid ${accentMid}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, React.createElement(HeuristicIcon, {
    k: c.k,
    size: 22,
    color: accent
  })), React.createElement("div", {
    style: {
      flex: 1
    }
  }, React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: 7,
      marginBottom: 4
    }
  }, React.createElement("span", {
    style: {
      fontFamily: T.mono,
      fontSize: 10,
      color: accent
    }
  }, c.n), React.createElement("span", {
    style: {
      fontSize: 14,
      fontWeight: 600,
      color: T.text
    }
  }, c.label)), React.createElement("div", {
    style: {
      fontSize: 13,
      color: T.textMid,
      lineHeight: 1.6
    }
  }, c.desc))))));
}
const SCAN_STEPS = [{
  label: "Resolving address…",
  fact: "Bitcoin addresses are pseudonymous, not anonymous. Every transaction is permanently public."
}, {
  label: "Fetching UTXO set…",
  fact: "UTXOs are like banknotes. How many you hold and their sizes reveal your spending habits."
}, {
  label: "Pulling transaction history…",
  fact: "Chainalysis has processed 1B+ transactions for government agencies since 2014."
}, {
  label: "Checking address reuse…",
  fact: "91% of wallets reuse addresses. It's the single biggest privacy mistake in Bitcoin."
}, {
  label: "Looking for dust attacks…",
  fact: "Exchanges and surveillance firms send dust to wallets they want to track. It's legal."
}, {
  label: "Scanning for consolidations…",
  fact: "Merging a KYC coin with a private coin permanently links them — forever, on-chain."
}, {
  label: "Checking round amounts…",
  fact: "'0.1 BTC' is a Chainalysis red flag. '0.10431 BTC' looks like change — much less identifiable."
}, {
  label: "Detecting CoinJoin patterns…",
  fact: "CoinJoin breaks the chain of custody. With 50+ participants, tracking becomes computationally infeasible."
}, {
  label: "Analysing fee fingerprints…",
  fact: "Your wallet software can be identified by the fee rates it uses. Different wallets have different defaults."
}, {
  label: "Calculating privacy score…",
  fact: "Score 0 = fully traceable in seconds. Score 100 = requires nation-state resources to de-anonymise."
}, {
  label: "Building your fix plan…",
  fact: "Most wallets can improve by 30+ points in under a week with no technical knowledge required."
}];
function classifyUtxo(u) {
  if (u.value < 1000) return "critical";
  if (u.value >= 100000 && u.value % 100000 === 0) return "medium";
  if (u.value > 5000000) return "low";
  return "clean";
}
function runEngine(utxos = [], txs = [], txCount = 0) {
  if (txCount === 0 && utxos.length === 0) {
    return {
      score: null,
      grade: "—",
      riskLabel: "No History",
      riskColor: T.textDim,
      checks: [],
      recommendations: [],
      isEmpty: true
    };
  }
  let score = 100;
  const checks = [];
  const add = (key, name, status, detail, plain, sev, pts) => {
    checks.push({
      key,
      name,
      status,
      detail,
      plain,
      sev: sev || "medium",
      pts: pts || 0
    });
    score += pts;
  };
  if (txCount >= 10) add("reuse", "Address Reuse", "fail", `Used ${txCount}+ times — every spend permanently linked`, "This address has been used many times. Every reuse permanently links your transactions for any analyst to see.", "critical", -28);else if (txCount >= 4) add("reuse", "Address Reuse", "fail", `Used ${txCount} times — linkable on-chain`, "This address has been reused. Ideally, use a fresh address for every transaction.", "high", -15);else if (txCount >= 2) add("reuse", "Address Reuse", "warn", `Used ${txCount} times — minor exposure`, "Minor reuse. Generate a new address for your next receive.", "medium", -7);else add("reuse", "Address Reuse", "pass", "Fresh address — no reuse", "Great. This address has only been used once.", "clean", 0);
  const dust = utxos.filter(u => u.value < 1000);
  if (dust.length > 2) add("dust", "Dust Attack", "fail", `${dust.length} dust UTXOs — tracking beacons planted`, "Small amounts sent by trackers. Spending them reveals your wallet cluster to surveillance firms.", "high", -12);else if (dust.length) add("dust", "Dust Attack", "warn", `${dust.length} dust UTXO — possible tracker`, "A tiny amount was sent to your address. Freeze it in Sparrow — never spend it.", "medium", -5);else add("dust", "Dust Attack", "pass", "No dust UTXOs", "No suspicious tiny amounts found.", "clean", 0);
  const round = utxos.filter(u => u.value >= 100000 && u.value % 100000 === 0);
  if (round.length >= 2) add("round", "Round Amounts", "fail", `${round.length} round-number UTXOs — KYC withdrawal pattern`, "Round amounts like 0.1 BTC are a Chainalysis red flag. Analysts assume these came from KYC exchanges.", "high", -10);else if (round.length) add("round", "Round Amounts", "warn", "1 round-number UTXO — minor fingerprint", "One round amount. Use odd numbers next time you withdraw from an exchange.", "medium", -5);else add("round", "Round Amounts", "pass", "No suspicious round amounts", "Good — your UTXOs use non-round amounts.", "clean", 0);
  let cjCount = 0;
  for (const tx of txs.slice(0, 20)) {
    if (tx.vout?.length >= 5) {
      const vals = tx.vout.map(o => o.value).filter(Boolean);
      if (!vals.length) continue;
      const freq = Math.max(...[...new Set(vals)].map(v => vals.filter(x => x === v).length));
      if (freq >= 3) cjCount++;
    }
  }
  if (cjCount >= 2) add("cj", "CoinJoin Used", "pass", `${cjCount} CoinJoin transactions — strong mixing hygiene`, "You've used CoinJoin to break transaction links. This significantly improves your privacy.", "clean", +12);else if (cjCount === 1) add("cj", "CoinJoin Used", "warn", "1 CoinJoin — anonymity set may be small", "You've used CoinJoin once. More rounds with larger groups improve your score.", "medium", +4);else add("cj", "CoinJoin Used", "fail", "No CoinJoin — full history traceable", "Your transaction history is fully visible. CoinJoin breaks this chain permanently.", "high", -8);
  const cons = txs.filter(t => t.vin?.length >= 4 && t.vout?.length <= 2);
  if (cons.length >= 2) add("cons", "Unsafe Consolidation", "fail", `${cons.length} merges link your coin histories`, "You've combined coins from different sources. This links those histories permanently on-chain.", "high", -10);else if (cons.length) add("cons", "Unsafe Consolidation", "warn", "1 consolidation — minor linking event", "One consolidation detected. Be careful about which coins you combine.", "medium", -4);else add("cons", "Unsafe Consolidation", "pass", "No risky UTXO merges", "Your UTXOs haven't been unsafely combined.", "clean", 0);
  const n = utxos.length;
  if (n > 20) add("utxo_n", "UTXO Count", "fail", `${n} UTXOs — bloated, high consolidation risk`, "Too many small UTXOs create fee pressure and tempt you to consolidate unsafely.", "medium", -8);else if (n > 10) add("utxo_n", "UTXO Count", "warn", `${n} UTXOs — manageable but monitor`, "Slightly high. Manage carefully during low-fee periods.", "low", -3);else if (n === 1) add("utxo_n", "UTXO Count", "warn", "Single UTXO — exposes total balance per spend", "With one UTXO, every transaction reveals your full balance to the recipient.", "medium", -5);else add("utxo_n", "UTXO Count", "pass", `${n} UTXOs — healthy range`, "Good — your balance is spread across a manageable number of UTXOs.", "clean", 0);
  const feeRates = txs.filter(t => t.fee && t.size).map(t => Math.round(t.fee / t.size));
  if (feeRates.length >= 4 && new Set(feeRates).size <= 2) add("fee", "Fee Fingerprinting", "warn", "Identical fee rates — wallet software identifiable", "Using the same fee rate every time fingerprints your wallet software for analysts.", "medium", -6);else add("fee", "Fee Fingerprinting", "pass", "Varied fee rates — no wallet fingerprint", "Good — your fee rates vary, making your wallet harder to identify.", "clean", 0);
  const changeReuse = txs.some(tx => {
    if (tx.vout?.length !== 2) return false;
    const inputAddrs = new Set((tx.vin || []).map(i => i.prevout?.scriptpubkey_address).filter(Boolean));
    return (tx.vout || []).some(o => o.scriptpubkey_address && inputAddrs.has(o.scriptpubkey_address));
  });
  if (changeReuse) add("change", "Change Address Reuse", "fail", "Change sent back to input address — balance exposed", "Your wallet sent change back to the same address it spent from. This exposes your full balance.", "high", -10);else add("change", "Change Address Reuse", "pass", "Change sent to fresh addresses", "Your change outputs go to new addresses — good practice.", "clean", 0);
  const largest = utxos.length ? Math.max(...utxos.map(u => u.value)) : 0;
  const total = utxos.reduce((s, u) => s + u.value, 0);
  if (largest > 0 && total > 0 && largest / total > 0.9) add("conc", "Balance Concentration", "warn", "90%+ in one UTXO — exposes full balance per spend", "Almost all your Bitcoin is in one output. Every transaction reveals nearly your full holdings.", "medium", -5);else add("conc", "Balance Concentration", "pass", "Balance spread across UTXOs", "Good — your balance is distributed.", "clean", 0);
  const scriptTypes = new Set(utxos.map(u => u.scriptpubkey_type || (u.value > 10000000 ? "v0_p2wpkh" : "p2pkh")).filter(Boolean));
  if (scriptTypes.size > 1) add("script", "Mixed Script Types", "warn", "Mixed legacy/SegWit — linkable by script type", "Using different address formats across UTXOs creates patterns analysts can exploit.", "low", -4);else add("script", "Mixed Script Types", "pass", "Consistent script type", "Your UTXOs use a consistent address format.", "clean", 0);
  score = Math.max(0, Math.min(100, Math.round(score)));
  const recs = [];
  const failed = checks.filter(c => c.status !== "pass");
  if (failed.find(f => f.key === "cj")) recs.push({
    icon: "🔀",
    action: "Mix your coins with CoinJoin",
    plain: "CoinJoin pools your Bitcoin with others in a single transaction, making it impossible to trace which output is yours.",
    detail: "The mixing landscape changed in 2024 — Samourai's Whirlpool was seized and Wasabi's original coordinator shut down. CoinJoin still works: you now connect to a community-run coordinator (built into Wasabi 2.x and its forks) or use Joinmarket's coordinator-free peer-to-peer model. Aim for large anonymity sets and time it during low-fee periods. (Note: centralized WabiSabi coordinators carry some deanonymization risk — Joinmarket avoids a coordinator entirely.)",
    impact: 18,
    effort: "Medium",
    tools: [{
      name: "Wasabi Wallet",
      note: "WabiSabi CoinJoin — since its default coordinator closed in 2024, pick a community coordinator in-app (Change Coordinator)"
    }, {
      name: "Ginger Wallet",
      note: "Wasabi fork that runs its own active CoinJoin coordinator, desktop"
    }, {
      name: "Joinmarket",
      note: "Peer-to-peer, no central coordinator — the most censorship-resistant option"
    }, {
      name: "JoinStr",
      note: "Nostr-coordinated CoinJoin, experimental"
    }, {
      name: "BTCPay Server",
      note: "Self-hosted Payjoin for merchants — breaks the common-input heuristic"
    }],
    key: "cj"
  });
  if (failed.find(f => f.key === "cj") || cons.length) recs.push({
    icon: "🤝",
    action: "Use Payjoin when you pay or get paid",
    plain: "Payjoin is a payment where the receiver quietly adds one of their own coins to your transaction. Analysts assume every input to a transaction has one owner — Payjoin breaks that assumption on an ordinary-looking payment, no mixing round or anonymity set required.",
    detail: "Payjoin (BIP78, and the newer async Payjoin / BIP77) needs a receiver who supports it, so it works best when transacting with Payjoin-enabled wallets and merchants. Adoption is climbing fast: Cake Wallet and Bull Bitcoin ship it, and the Payjoin Foundation (2025) is pushing it toward the default payment experience. It's coordinator-free and cheap — a great complement to CoinJoin.",
    impact: 9,
    effort: "Easy",
    tools: [{
      name: "Cake Wallet",
      note: "Mobile, ships Payjoin v2 (async) in the default send flow"
    }, {
      name: "Bull Bitcoin",
      note: "Non-custodial, Payjoin-enabled buy/sell and payments"
    }, {
      name: "BTCPay Server",
      note: "Receive Payjoin payments as a merchant, self-hosted"
    }, {
      name: "Payjoin Dev Kit",
      note: "Open-source Rust library (BIP78 + BIP77) for wallet builders"
    }],
    key: "payjoin"
  });
  if (failed.find(f => f.key === "reuse")) recs.push({
    icon: "🔄",
    action: "Use a new address every time",
    plain: "Your wallet can generate unlimited fresh addresses. Every reuse permanently links your transactions for any analyst to trace.",
    detail: "Every HD wallet generates a new address on each 'Receive' — the trick is discipline: never re-paste an old one. If you need a fixed address to publish (a donation link, an invoice), use a Silent Payment (BIP352): you share ONE reusable string ('sp1…') and the sender's wallet derives a fresh, unlinkable on-chain address for every payment — so a public address never causes reuse. Sparrow, Cake Wallet, Nunchuk and BlueWallet support receiving them today.",
    impact: 15,
    effort: "Easy",
    tools: [{
      name: "Sparrow Wallet",
      note: "Coin control + labelling, and Silent Payments send/receive, desktop"
    }, {
      name: "Cake Wallet",
      note: "Silent Payments send + receive with on-device scanning, mobile"
    }, {
      name: "Nunchuk",
      note: "Silent Payments receiving + multisig, mobile + desktop"
    }, {
      name: "Blue Wallet",
      note: "Silent Payments receiving, open source, mobile"
    }, {
      name: "Electrum",
      note: "Lightweight, long-standing open source, desktop"
    }, {
      name: "Bitcoin Core",
      note: "Full node wallet, maximum sovereignty"
    }],
    key: "reuse"
  });
  recs.push({
    icon: "⚡",
    action: "Move spending money to Lightning",
    plain: "Lightning payments don't appear on-chain at all — zero on-chain footprint for every day-to-day purchase.",
    detail: "Open a channel from a clean UTXO, then use Lightning for all spending. Options range from fully self-custodial to simple custodial — choose based on how much sovereignty you want.",
    impact: 12,
    effort: "Medium",
    tools: [{
      name: "Phoenix Wallet",
      note: "Self-custodial, mobile, simple UX, automatic channels"
    }, {
      name: "Breez",
      note: "Self-custodial, mobile, point-of-sale + podcasting"
    }, {
      name: "Zeus",
      note: "Connect to your own LND/CLN node, advanced"
    }, {
      name: "Mutiny Wallet",
      note: "Self-custodial, web + mobile, open source"
    }, {
      name: "Blixt Wallet",
      note: "Self-custodial, full LND node on mobile"
    }, {
      name: "Alby",
      note: "Browser extension, great for web payments"
    }],
    key: "lightning"
  });
  if (failed.find(f => f.key === "cons")) recs.push({
    icon: "⚗️",
    action: "Never merge coins from different sources",
    plain: "Combining exchange Bitcoin with privately-bought Bitcoin links them permanently on-chain — this cannot be undone.",
    detail: "Use coin control to manually select which UTXOs to spend. Ideally keep KYC and non-KYC coins in entirely separate wallets with no on-chain connection.",
    impact: 10,
    effort: "Medium",
    tools: [{
      name: "Sparrow Wallet",
      note: "Best-in-class coin control UI, UTXO labelling"
    }, {
      name: "Wasabi Wallet",
      note: "Built-in coin labelling and control"
    }, {
      name: "Electrum",
      note: "Coin control via Coins tab"
    }, {
      name: "Bitcoin Core",
      note: "listunspent + coin control in advanced mode"
    }, {
      name: "Nunchuk",
      note: "UTXO management with tags and notes"
    }],
    key: "cons"
  });
  if (failed.find(f => f.key === "dust")) recs.push({
    icon: "🧊",
    action: "Freeze your dust UTXOs immediately",
    plain: "Those tiny amounts are tracking beacons planted by surveillance firms. Spending them links your entire wallet cluster.",
    detail: "Mark each dust UTXO as frozen/do-not-spend. It will be excluded from all future transactions. Never consolidate dust even during low-fee periods.",
    impact: 9,
    effort: "Easy",
    tools: [{
      name: "Sparrow Wallet",
      note: "Right-click UTXO → Freeze"
    }, {
      name: "Wasabi Wallet",
      note: "Label as suspicious, excluded from CoinJoins"
    }, {
      name: "Electrum",
      note: "Right-click → Freeze coin"
    }, {
      name: "Bitcoin Core",
      note: "lockunspent to freeze specific UTXOs"
    }, {
      name: "Nunchuk",
      note: "Tag UTXOs, exclude from spending"
    }],
    key: "dust"
  });
  if (failed.find(f => f.key === "round")) recs.push({
    icon: "🎲",
    action: "Withdraw odd amounts from exchanges",
    plain: "Instead of 0.1 BTC, withdraw 0.10743 BTC. Round numbers are a primary KYC withdrawal fingerprint used by Chainalysis.",
    detail: "Change the last 3–4 digits of every withdrawal. Even better: source Bitcoin from non-KYC options so there's no KYC origin to fingerprint in the first place.",
    impact: 8,
    effort: "Easy",
    tools: [{
      name: "Any KYC exchange",
      note: "Just change the withdrawal amount manually"
    }, {
      name: "Bisq",
      note: "Decentralised, peer-to-peer, no KYC"
    }, {
      name: "Robosats",
      note: "Lightning-based, Tor-native, no KYC"
    }, {
      name: "Peach Bitcoin",
      note: "Mobile peer-to-peer, no KYC"
    }, {
      name: "HodlHodl",
      note: "Non-custodial P2P, no KYC"
    }, {
      name: "AgoraDesk",
      note: "P2P, supports cash and many payment methods"
    }],
    key: "round"
  });
  if (failed.find(f => f.key === "change")) recs.push({
    icon: "↩",
    action: "Never reuse change addresses",
    plain: "Sending change back to an input address exposes your full balance to anyone reading the transaction.",
    detail: "Ensure your wallet sends change to a fresh address every time. This is the default in all modern HD wallets — check settings if you're unsure.",
    impact: 7,
    effort: "Easy",
    tools: [{
      name: "Sparrow Wallet",
      note: "Settings → Script type → Native SegWit (BIP84)"
    }, {
      name: "Wasabi Wallet",
      note: "Fresh change addresses automatic by default"
    }, {
      name: "Electrum",
      note: "Wallet → Preferences → Use change addresses"
    }, {
      name: "Bitcoin Core",
      note: "Default HD wallet behaviour, always fresh change"
    }, {
      name: "Blue Wallet",
      note: "HD wallet, fresh change addresses by default"
    }, {
      name: "Nunchuk",
      note: "BIP84 by default, visible in transaction detail"
    }],
    key: "change"
  });
  recs.push({
    icon: "🖥️",
    action: "Connect to your own Bitcoin node",
    plain: "Public Electrum servers see every address you query and can link your IP to your wallet. Your own node leaks nothing.",
    detail: "Run a full node and point your wallet at it via local network or Tor. Options range from plug-and-play hardware appliances to software on any machine.",
    impact: 6,
    effort: "Hard",
    tools: [{
      name: "Bitcoin Core",
      note: "Original full node, free, runs on any OS"
    }, {
      name: "Umbrel",
      note: "Plug-and-play on Raspberry Pi, app store"
    }, {
      name: "Start9",
      note: "Sovereignty-focused OS, strong privacy defaults"
    }, {
      name: "RaspiBlitz",
      note: "Open source, Lightning + Bitcoin, DIY"
    }, {
      name: "MyNode",
      note: "Beginner-friendly, community edition is free"
    }, {
      name: "Nodl",
      note: "Pre-built hardware node, plug and play"
    }],
    key: "node"
  });
  if (failed.find(f => f.key === "fee")) recs.push({
    icon: "💸",
    action: "Vary your fee rates",
    plain: "Using the same fee rate every time fingerprints your wallet software — analysts can identify which wallet you use.",
    detail: "Check the current mempool before each transaction and manually set a fee rather than using your wallet's default. Vary the rate each time.",
    impact: 6,
    effort: "Easy",
    tools: [{
      name: "Sparrow Wallet",
      note: "Full manual fee control per transaction"
    }, {
      name: "mempool.space",
      note: "Live fee estimates, open source, Tor-accessible"
    }, {
      name: "Bitcoin Core",
      note: "estimatesmartfee RPC for precise control"
    }, {
      name: "Electrum",
      note: "Manual fee slider on every send"
    }, {
      name: "bitcoinfees.earn",
      note: "Simple fee rate overview by confirmation target"
    }],
    key: "fee"
  });
  if (failed.find(f => f.key === "conc")) recs.push({
    icon: "⚖️",
    action: "Distribute your balance across UTXOs",
    plain: "Nearly all your Bitcoin is in one output — every transaction reveals almost your full holdings to the recipient.",
    detail: "A CoinJoin round naturally produces multiple balanced outputs. Or split manually by sending to yourself across several transactions during low-fee periods.",
    impact: 5,
    effort: "Medium",
    tools: [{
      name: "Sparrow Wallet",
      note: "Manual UTXO splitting with coin control"
    }, {
      name: "Wasabi Wallet",
      note: "CoinJoin produces a well-distributed output set"
    }, {
      name: "Joinmarket",
      note: "Yields naturally distributed UTXO set"
    }, {
      name: "Electrum",
      note: "Send-to-self with manual output splitting"
    }, {
      name: "Bitcoin Core",
      note: "createrawtransaction for precise output control"
    }],
    key: "conc"
  });
  recs.sort((a, b) => b.impact - a.impact);
  return {
    score,
    grade: scoreGrade(score),
    riskLabel: scoreLabel(score),
    riskColor: scoreColor(score),
    checks,
    recommendations: recs.slice(0, 6)
  };
}
const API = "https://blockstream.info/api";
async function fetchAddress(addr) {
  const safe = encodeURIComponent(addr);
  const [info, utxos, txs] = await Promise.all([fetch(`${API}/address/${safe}`).then(r => {
    if (!r.ok) throw new Error("Not found");
    return r.json();
  }), fetch(`${API}/address/${safe}/utxo`).then(r => r.json()), fetch(`${API}/address/${safe}/txs`).then(r => r.json())]);
  if (!info || typeof info !== "object") throw new Error("Invalid API response");
  if (!Array.isArray(utxos)) throw new Error("Invalid UTXO response");
  if (!Array.isArray(txs)) throw new Error("Invalid TX response");
  return {
    addrInfo: info,
    utxos: utxos.slice(0, 30),
    txs: txs.slice(0, 30)
  };
}
const now = () => Math.floor(Date.now() / 1000);
const DEMO_A = {
  addrInfo: {
    chain_stats: {
      tx_count: 3
    }
  },
  utxos: [{
    txid: "7a82bc91e3411d05",
    vout: 1,
    value: 17431892,
    scriptpubkey_type: "v0_p2wpkh",
    status: {
      confirmed: true,
      block_time: now() - 86400 * 30
    }
  }, {
    txid: "2e91a4bc77f01122",
    vout: 2,
    value: 11254731,
    scriptpubkey_type: "v0_p2wpkh",
    status: {
      confirmed: true,
      block_time: now() - 86400 * 60
    }
  }, {
    txid: "d4f1b206c8a99933",
    vout: 0,
    value: 8721400,
    scriptpubkey_type: "v0_p2wpkh",
    status: {
      confirmed: true,
      block_time: now() - 86400 * 90
    }
  }, {
    txid: "a51cc1f4d0118855",
    vout: 3,
    value: 15182374,
    scriptpubkey_type: "v0_p2wpkh",
    status: {
      confirmed: true,
      block_time: now() - 86400 * 45
    }
  }, {
    txid: "38ee9c7be5f02266",
    vout: 1,
    value: 9847251,
    scriptpubkey_type: "v0_p2wpkh",
    status: {
      confirmed: true,
      block_time: now() - 86400 * 15
    }
  }],
  txs: [{
    txid: "7a82bc91",
    vin: [{
      txid: "src1",
      vout: 0
    }],
    vout: [{
      value: 5000000,
      scriptpubkey_address: "bc1qcj1"
    }, {
      value: 5000000,
      scriptpubkey_address: "bc1qcj2"
    }, {
      value: 5000000,
      scriptpubkey_address: "bc1qcj3"
    }, {
      value: 5000000,
      scriptpubkey_address: "bc1qcj4"
    }, {
      value: 5000000,
      scriptpubkey_address: "bc1qcj5"
    }, {
      value: 17431892,
      scriptpubkey_address: "bc1qme1"
    }, {
      value: 3214557,
      scriptpubkey_address: "bc1qch1"
    }, {
      value: 1024113,
      scriptpubkey_address: "bc1qch2"
    }],
    fee: 8923,
    size: 545,
    status: {
      block_time: now() - 86400 * 30
    }
  }, {
    txid: "2e91a4bc",
    vin: [{
      txid: "src2",
      vout: 0
    }],
    vout: [{
      value: 1000000,
      scriptpubkey_address: "bc1qcj6"
    }, {
      value: 1000000,
      scriptpubkey_address: "bc1qcj7"
    }, {
      value: 1000000,
      scriptpubkey_address: "bc1qcj8"
    }, {
      value: 1000000,
      scriptpubkey_address: "bc1qcj9"
    }, {
      value: 11254731,
      scriptpubkey_address: "bc1qme2"
    }, {
      value: 887621,
      scriptpubkey_address: "bc1qch3"
    }],
    fee: 7824,
    size: 482,
    status: {
      block_time: now() - 86400 * 60
    }
  }, {
    txid: "d4f1b206",
    vin: [{
      txid: "src3",
      vout: 0
    }],
    vout: [{
      value: 8721400,
      scriptpubkey_address: "bc1qme3"
    }, {
      value: 2189412,
      scriptpubkey_address: "bc1qrx1"
    }],
    fee: 1437,
    size: 223,
    status: {
      block_time: now() - 86400 * 90
    }
  }]
};
const DEMO = {
  addrInfo: {
    chain_stats: {
      tx_count: 7
    }
  },
  utxos: [{
    txid: "a3f21e9b4c7d2f01",
    vout: 0,
    value: 120000000,
    scriptpubkey_type: "v0_p2wpkh",
    status: {
      confirmed: true,
      block_time: now() - 86400 * 14
    }
  }, {
    txid: "7b91cc3adf982b44",
    vout: 1,
    value: 84700000,
    scriptpubkey_type: "v0_p2wpkh",
    status: {
      confirmed: true,
      block_time: now() - 86400 * 60
    }
  }, {
    txid: "f004d188a2ccef91",
    vout: 0,
    value: 50000000,
    scriptpubkey_type: "p2pkh",
    status: {
      confirmed: true,
      block_time: now() - 86400 * 180
    }
  }, {
    txid: "2d5e4f7c01ba3390",
    vout: 0,
    value: 20000000,
    scriptpubkey_type: "v0_p2wpkh",
    status: {
      confirmed: true,
      block_time: now() - 86400 * 365
    }
  }, {
    txid: "9c11a2b0e3ff4d22",
    vout: 2,
    value: 10000000,
    scriptpubkey_type: "v0_p2wpkh",
    status: {
      confirmed: true,
      block_time: now() - 86400 * 3
    }
  }, {
    txid: "44cc3b77f19a0011",
    vout: 0,
    value: 546,
    scriptpubkey_type: "v0_p2wpkh",
    status: {
      confirmed: true,
      block_time: now() - 86400 * 2
    }
  }],
  txs: [{
    txid: "a3f21e9b",
    vin: [{
      txid: "p1",
      vout: 0
    }],
    vout: [{
      value: 120000000,
      scriptpubkey_address: "bc1qex1"
    }, {
      value: 9871234,
      scriptpubkey_address: "bc1qex2"
    }],
    fee: 1420,
    size: 224,
    status: {
      block_time: now() - 86400 * 14
    }
  }, {
    txid: "7b91cc3a",
    vin: [{
      txid: "p2",
      vout: 0
    }, {
      txid: "p3",
      vout: 1
    }, {
      txid: "p4",
      vout: 0
    }, {
      txid: "p5",
      vout: 2
    }],
    vout: [{
      value: 84700000,
      scriptpubkey_address: "bc1qex3"
    }],
    fee: 3200,
    size: 450,
    status: {
      block_time: now() - 86400 * 60
    }
  }, {
    txid: "f004d188",
    vin: [{
      txid: "p6",
      vout: 0
    }],
    vout: [{
      value: 50000000
    }, {
      value: 50000000
    }, {
      value: 50000000
    }, {
      value: 50000000
    }, {
      value: 19874123
    }],
    fee: 980,
    size: 340,
    status: {
      block_time: now() - 86400 * 180
    }
  }, {
    txid: "2d5e4f7c",
    vin: [{
      txid: "p7",
      vout: 0
    }],
    vout: [{
      value: 20000000
    }, {
      value: 8312200
    }],
    fee: 780,
    size: 224,
    status: {
      block_time: now() - 86400 * 365
    }
  }, {
    txid: "9c11a2b0",
    vin: [{
      txid: "p8",
      vout: 0
    }],
    vout: [{
      value: 10000000
    }, {
      value: 3421000
    }],
    fee: 650,
    size: 224,
    status: {
      block_time: now() - 86400 * 3
    }
  }, {
    txid: "44cc3b77",
    vin: [{
      txid: "p9",
      vout: 0
    }],
    vout: [{
      value: 546
    }, {
      value: 99999454
    }],
    fee: 320,
    size: 150,
    status: {
      block_time: now() - 86400 * 2
    }
  }, {
    txid: "bb44e901",
    vin: [{
      txid: "p10",
      vout: 0
    }],
    vout: [{
      value: 100000000
    }],
    fee: 1100,
    size: 200,
    status: {
      block_time: now() - 86400 * 200
    }
  }]
};
const LN_API = "https://mempool.space/api/v1/lightning";
async function fetchLightningNode(pubkey) {
  const safe = encodeURIComponent(pubkey);
  const [node, channels] = await Promise.all([fetch(`${LN_API}/nodes/${safe}`).then(r => {
    if (!r.ok) throw new Error("Node not found");
    return r.json();
  }), fetch(`${LN_API}/nodes/${safe}/channels?status=open`).then(r => r.json()).catch(() => ({
    channels: []
  }))]);
  if (!node || typeof node !== "object") throw new Error("Invalid node response");
  return {
    node,
    channels: (Array.isArray(channels.channels) ? channels.channels : []).slice(0, 30)
  };
}
const KYC_NODES = new Set(["033d8656219478701227199cbd6f670335c8d408a92ae88b176cad16f71555e072", "02f1a8c87607f415c8f22c00593002775941dea48869ce23096af27b0cfdcc0b69", "03037dc08e9ac63b82581f79b662a4d0ceca8a8ca162b1af3551595b8f2d97b70a", "035e4ff418fc8b5554c5d9eea66396c227bd429a3251c8cbc711002ba215bfc226", "0279c22ed7a068d10dc1a38ae66d2d6461e269226c60258c021b1ddcdfe4b00bc4", "03cde60a6323f7122d5178255766e38114b4722ede08f7c9e0c5df9b912cc201d6"]);
const isKycNode = pub => KYC_NODES.has(pub);
function runLightningEngine(node = {}, channels = []) {
  let score = 100;
  const checks = [];
  const add = (key, name, status, detail, sev, pts) => {
    checks.push({
      key,
      name,
      status,
      detail,
      sev: sev || "medium",
      pts: pts || 0
    });
    score += pts;
  };
  const isPublic = node.public !== false;
  if (isPublic) add("announced", "Public Node Announcement", "fail", "Your node is publicly announced on the Lightning gossip network. Your IP or Tor address is visible to every peer.", "high", -18);else add("announced", "Public Node Announcement", "pass", "Your node is not publicly announced — it operates privately.", "clean", 0);
  const kycPeers = channels.filter(ch => isKycNode(ch.node1_pub) || isKycNode(ch.node2_pub));
  if (kycPeers.length >= 2) add("kyc_peers", "KYC Exchange Peer Channels", "fail", `${kycPeers.length} channels connect to known KYC exchanges. These entities log routing metadata and can correlate your activity.`, "critical", -22);else if (kycPeers.length === 1) add("kyc_peers", "KYC Exchange Peer Channels", "warn", "1 channel connects to a known KYC exchange. Their logs can correlate payment routing through your node.", "high", -10);else add("kyc_peers", "KYC Exchange Peer Channels", "pass", "No channels detected to known KYC surveillance entities.", "clean", 0);
  const hasTorAddr = node.addresses?.some(a => a.addr?.includes(".onion"));
  const hasClearnet = node.addresses?.some(a => !a.addr?.includes(".onion") && a.addr);
  if (hasClearnet && !hasTorAddr) add("tor", "Tor / Clearnet Exposure", "fail", "Your node only accepts clearnet connections. Your IP address is directly visible to all peers.", "high", -15);else if (hasClearnet && hasTorAddr) add("tor", "Tor / Clearnet Exposure", "warn", "Your node accepts both Tor and clearnet. Clearnet peers can correlate your IP with your node pubkey.", "medium", -7);else add("tor", "Tor / Clearnet Exposure", "pass", "Your node is Tor-only — no IP exposure to peers.", "clean", 0);
  const chCount = channels.length;
  if (chCount === 0) add("channels", "Channel Diversity", "warn", "No open channels found. A node with no channels has limited routing privacy and cannot receive spontaneous payments.", "medium", -6);else if (chCount < 3) add("channels", "Channel Diversity", "warn", `Only ${chCount} publicly-announced channel${chCount > 1 ? "s" : ""} — low public routing diversity. (Private, unannounced channels don't show up here; keeping channels unannounced is more private, not less.)`, "medium", -4);else add("channels", "Channel Diversity", "pass", `${chCount} publicly-announced channels — good routing diversity makes payment flows harder to trace.`, "clean", 0);
  const totalCap = channels.reduce((s, c) => s + (c.capacity || 0), 0);
  const maxCap = channels.length ? Math.max(...channels.map(c => c.capacity || 0)) : 0;
  if (totalCap > 0 && maxCap / totalCap > 0.8) add("cap_conc", "Channel Capacity Concentration", "warn", "Over 80% of your publicly-visible capacity is in one channel. This makes your routing patterns highly predictable.", "medium", -6);else add("cap_conc", "Channel Capacity Concentration", "pass", "Your capacity is distributed across channels — good for routing privacy.", "clean", 0);
  const rawAlias = node.alias || "";
  const alias = rawAlias.replace(/[\x00-\x1f\x7f]/g, "").trim().slice(0, 50);
  const suspiciousAlias = alias.length > 0 && /^[A-Z][a-z]/.test(alias) && alias.includes(" ");
  if (suspiciousAlias) add("alias", "Node Alias Privacy", "warn", `Your alias "${alias}" looks like a real name. Node aliases are publicly visible to the entire Lightning network.`, "low", -4);else if (alias.length === 0) add("alias", "Node Alias Privacy", "pass", "No alias set — your node is identified only by its pubkey.", "clean", 0);else add("alias", "Node Alias Privacy", "pass", `Alias "${alias}" appears pseudonymous.`, "clean", 0);
  const firstSeen = node.first_seen || 0;
  const ageDays = firstSeen ? Math.floor((Date.now() / 1000 - firstSeen) / 86400) : 0;
  if (ageDays > 0 && ageDays < 30) add("age", "Node Establishment", "warn", "Your node is less than 30 days old. New nodes are more easily tracked as their channel history is limited.", "low", -3);else add("age", "Node Establishment", "pass", ageDays > 0 ? `Node active for ${Math.floor(ageDays / 30)} months — established routing history.` : "Node age unknown.", "clean", 0);
  const openedChannels = channels.length;
  if (openedChannels > 10) add("onchain", "On-Chain Channel Footprint", "warn", `${openedChannels} publicly-visible channel opens/closes are recorded on-chain. Each one is a permanent trace linking your Lightning and on-chain identity — and private channels add to this on-chain too, they just aren't listed in gossip. Funding channels directly from KYC exchange withdrawals is the riskiest pattern.`, "medium", -5);else if (openedChannels > 0) add("onchain", "On-Chain Channel Footprint", "pass", `${openedChannels} publicly-visible channel${openedChannels > 1 ? "s" : ""} — modest public footprint (private channels have on-chain opens too, not shown here). Ensure you fund channels from non-KYC UTXOs to avoid linking your identities.`, "clean", 0);else add("onchain", "On-Chain Channel Footprint", "pass", "No open channels found — no on-chain channel footprint to analyse.", "clean", 0);
  score = Math.max(0, Math.min(100, Math.round(score)));
  const recs = [];
  const failed = checks.filter(c => c.status !== "pass");
  if (failed.find(f => f.key === "kyc_peers")) recs.push({
    key: "kyc_peers",
    icon: "⚡",
    action: "Close channels with KYC exchange nodes",
    impact: 22,
    effort: "Medium",
    detail: "Open replacement channels with privacy-focused or anonymous peers. Look for Tor-only nodes with no identifiable alias.",
    tools: [{
      name: "Amboss.space",
      note: "Find privacy-respecting nodes to peer with"
    }, {
      name: "LNRouter",
      note: "Routing analysis, find good private peers"
    }]
  });
  if (failed.find(f => f.key === "announced")) recs.push({
    key: "announced",
    icon: "📡",
    action: "Switch to an unannounced / private node",
    impact: 18,
    effort: "Hard",
    detail: "An unannounced node is invisible to the gossip network. You can still open and use channels — they just won't be publicly listed.",
    tools: [{
      name: "CLN (Core Lightning)",
      note: "Supports unannounced channels natively"
    }, {
      name: "LND",
      note: "Use --unexported-channel flag"
    }]
  });
  if (failed.find(f => f.key === "tor")) recs.push({
    key: "tor",
    icon: "🧅",
    action: "Enable Tor-only mode",
    impact: 15,
    effort: "Medium",
    detail: "Disable clearnet listening entirely. Your IP will no longer be exposed to peers.",
    tools: [{
      name: "Umbrel",
      note: "Settings → Tor → Force Tor"
    }, {
      name: "Start9",
      note: "System → Tor → Enforce Tor"
    }, {
      name: "RaspiBlitz",
      note: "Main menu → CONNECT → TOR"
    }]
  });
  if (failed.find(f => f.key === "onchain")) recs.push({
    key: "onchain",
    icon: "🔗",
    action: "Fund channels from non-KYC UTXOs only",
    impact: 8,
    effort: "Medium",
    detail: "Use a separate wallet with no KYC history to open channels. Never open a channel directly from an exchange withdrawal.",
    tools: [{
      name: "Bisq",
      note: "Non-KYC bitcoin source"
    }, {
      name: "Sparrow Wallet",
      note: "Coin control before channel open"
    }]
  });
  const grade = score >= 90 ? "A+" : score >= 80 ? "A" : score >= 70 ? "B" : score >= 55 ? "C" : score >= 40 ? "D" : "F";
  return {
    score,
    grade,
    checks,
    recommendations: recs
  };
}
const DEMO_LN = {
  node: {
    public: true,
    alias: "SatoshiNode 01",
    addresses: [{
      addr: "192.168.1.1:9735"
    }, {
      addr: "abcdef123456.onion:9735"
    }],
    first_seen: Math.floor(Date.now() / 1000) - 86400 * 120,
    capacity: 214000000,
    channel_count: 12
  },
  channels: [{
    node1_pub: "033d8656219478701227199cbd6f670335c8d408a92ae88b176cad16f71555e072",
    node2_pub: "mynode",
    capacity: 42000000
  }, {
    node1_pub: "033d8656219478701227199cbd6f670335c8d408a92ae88b176cad16f71555e072",
    node2_pub: "mynode",
    capacity: 18000000
  }, {
    node1_pub: "mynode",
    node2_pub: "02f1a8c87607f415c8f22c00593002775941dea48869ce23096af27b0cfdcc0b69",
    capacity: 25000000
  }, {
    node1_pub: "mynode",
    node2_pub: "anon1aabbccddeeff0011223344556677889900aabbccddeeff00112233445566",
    capacity: 22000000
  }, {
    node1_pub: "mynode",
    node2_pub: "anon2aabbccddeeff0011223344556677889900aabbccddeeff00112233445566",
    capacity: 31000000
  }, {
    node1_pub: "mynode",
    node2_pub: "anon3aabbccddeeff0011223344556677889900aabbccddeeff00112233445566",
    capacity: 28000000
  }, {
    node1_pub: "mynode",
    node2_pub: "anon4aabbccddeeff0011223344556677889900aabbccddeeff00112233445566",
    capacity: 18000000
  }, {
    node1_pub: "mynode",
    node2_pub: "anon5aabbccddeeff0011223344556677889900aabbccddeeff00112233445566",
    capacity: 10000000
  }, {
    node1_pub: "mynode",
    node2_pub: "anon6aabbccddeeff0011223344556677889900aabbccddeeff00112233445566",
    capacity: 8000000
  }, {
    node1_pub: "mynode",
    node2_pub: "anon7aabbccddeeff0011223344556677889900aabbccddeeff00112233445566",
    capacity: 7000000
  }, {
    node1_pub: "mynode",
    node2_pub: "anon8aabbccddeeff0011223344556677889900aabbccddeeff00112233445566",
    capacity: 3000000
  }, {
    node1_pub: "mynode",
    node2_pub: "anon9aabbccddeeff0011223344556677889900aabbccddeeff00112233445566",
    capacity: 2000000
  }]
};
const fmt = {
  btc: v => v >= 1e8 ? `₿${(v / 1e8).toFixed(4)}` : `${v.toLocaleString()} sats`,
  age: ts => {
    const d = Math.floor((Date.now() / 1000 - ts) / 86400);
    return d < 1 ? "Today" : d === 1 ? "Yesterday" : d < 30 ? `${d}d ago` : d < 365 ? `${Math.floor(d / 30)}mo ago` : `${Math.floor(d / 365)}yr ago`;
  },
  txid: id => id ? `${id.slice(0, 8)}…${id.slice(-4)}` : "—",
  addr: a => a === "DEMO" ? "Demo Wallet" : a ? `${a.slice(0, 10)}…${a.slice(-6)}` : "—"
};
const SIMPLE = {
  checks: {
    reuse: {
      name: "Same Address Used Multiple Times",
      fail_detail: "Every time you reuse an address, it's like telling the world 'these transactions are all mine.' Anyone can click your address on a public tracker and see everything.",
      warn_detail: "You've used this address more than once. Get a fresh address from your wallet next time you receive Bitcoin — it takes one tap.",
      pass_detail: "Great — this address was only used once, so your transactions aren't linked together."
    },
    dust: {
      name: "Tiny Tracking Coins",
      fail_detail: "Companies that track Bitcoin sent you microscopic amounts to tag your wallet. If you spend them, they can follow where your money goes. Freeze them — they're traps.",
      warn_detail: "A tiny amount was sent to your address. It might be a tracking beacon. Don't spend it — just ignore it.",
      pass_detail: "No tracking coins found. You're clean."
    },
    round: {
      name: "Round Withdrawal Amounts",
      fail_detail: "You withdrew a nice round number like 0.1 BTC. Bitcoin trackers use this to identify withdrawals from exchanges. Next time, withdraw 0.10743 BTC instead of 0.1.",
      warn_detail: "One round amount spotted. Minor issue — just use odd amounts when withdrawing next time.",
      pass_detail: "Your amounts are non-round — harder to fingerprint."
    },
    cj: {
      name: "Privacy Mixing",
      fail_detail: "Your full transaction history is visible to anyone. Privacy mixing blends your coins with others in a single transaction so no one can tell which coins are yours.",
      warn_detail: "You've mixed your coins once. More rounds make it much harder to trace.",
      pass_detail: "You've used privacy mixing — this breaks the trail of your transactions. Well done."
    },
    cons: {
      name: "Combining Coins from Different Sources",
      fail_detail: "You combined coins that came from different places (like an exchange and a peer-to-peer trade). This links those two separate histories together — permanently, on-chain.",
      warn_detail: "One instance of combining different coins. Avoid mixing exchange coins with privately-bought coins.",
      pass_detail: "Your coins from different sources are kept separate."
    },
    utxo_n: {
      name: "Number of Coin Pieces",
      fail_detail: "You have a lot of small coin pieces in your wallet. This creates pressure to combine them all together, which links your transaction history.",
      warn_detail: "Slightly high number of coin pieces. No urgent action needed.",
      pass_detail: "Your wallet has a healthy number of coin pieces."
    },
    fee: {
      name: "Transaction Fee Pattern",
      warn_detail: "You always pay the same fee amount. Bitcoin trackers can use this to identify which wallet app you use. Just vary it a little each time.",
      pass_detail: "Your fees vary — no wallet fingerprint detected."
    },
    change: {
      name: "Change Sent Back to Same Address",
      fail_detail: "When you sent Bitcoin, your leftover change went back to the same address. This tells anyone watching exactly how much Bitcoin you still have.",
      pass_detail: "Your change goes to fresh addresses each time. Good practice."
    },
    conc: {
      name: "All Bitcoin in One Chunk",
      warn_detail: "Almost all your Bitcoin is in a single coin piece. Every time you send any amount, the person receiving it can see roughly how much total Bitcoin you own.",
      pass_detail: "Your balance is spread across multiple coin pieces."
    },
    script: {
      name: "Mixed Address Formats",
      warn_detail: "You're using old and new Bitcoin address formats together. Trackers can use this pattern to link your transactions.",
      pass_detail: "You're using a consistent address format."
    }
  },
  recs: {
    cj: {
      action: "Mix your coins for privacy",
      plain: "Privacy mixing pools your Bitcoin with other people in one transaction, so no one can tell whose coins are whose. It's the single most powerful thing you can do."
    },
    reuse: {
      action: "Use a fresh address every time",
      plain: "Your wallet can make unlimited new addresses for free. Tap 'Receive' and get a new one every time someone sends you Bitcoin. Never reuse an old one."
    },
    lightning: {
      action: "Pay small amounts over Lightning",
      plain: "Lightning lets you send Bitcoin instantly without any record on the public blockchain. Perfect for everyday spending — like cash, but digital."
    },
    cons: {
      action: "Keep your coins separate",
      plain: "Don't mix coins from your exchange with coins you bought privately. Use separate wallets, and never send between them directly."
    },
    payjoin: {
      action: "Pay with Payjoin when you can",
      plain: "Some wallets and shops support 'Payjoin' — when you pay, they quietly add one of their own coins to the transaction. That hides which coins are really yours, with no special mixing step. Look for it in wallets like Cake Wallet."
    },
    dust: {
      action: "Freeze your tracking coins",
      plain: "Find those tiny amounts in your wallet and mark them as 'frozen' or 'do not spend.' They're traps — spending them tags your entire wallet."
    },
    round: {
      action: "Withdraw odd amounts from exchanges",
      plain: "Instead of withdrawing exactly 0.1 BTC, withdraw 0.10743. Round numbers are a dead giveaway that coins came from an exchange."
    },
    change: {
      action: "Make sure change goes to new addresses",
      plain: "When you send Bitcoin, your leftover change should go to a brand new address — not back to one you've used before. Most modern wallets do this automatically."
    },
    node: {
      action: "Connect to your own Bitcoin server",
      plain: "When you look up your wallet, a public server sees your address and your IP address. Running your own server means only you see your own lookups."
    },
    fee: {
      action: "Vary how much you pay in fees",
      plain: "Paying the exact same fee every time lets trackers identify your wallet app. Just change it by a little each time you send."
    },
    conc: {
      action: "Spread your Bitcoin across pieces",
      plain: "Having all your Bitcoin in one chunk means every transaction reveals your total holdings. Split it into smaller pieces using privacy mixing or manual sends."
    }
  },
  grades: {
    A: "Very Private",
    B: "Mostly Private",
    C: "Moderate Risk",
    D: "High Risk",
    F: "Fully Traceable"
  }
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
const Tag = ({
  label,
  color,
  size = 11
}) => React.createElement("span", {
  style: {
    fontFamily: T.mono,
    fontSize: size,
    padding: "3px 8px",
    borderRadius: 4,
    background: color + "18",
    color,
    border: `1px solid ${color}30`,
    letterSpacing: 0.3,
    whiteSpace: "nowrap"
  }
}, String(label));
const Divider = ({
  my = 0
}) => React.createElement("div", {
  style: {
    height: 1,
    background: T.border,
    margin: `${my}px 0`
  }
});
const Pill = ({
  children,
  active,
  onClick,
  color
}) => React.createElement("button", {
  onClick: onClick,
  style: {
    background: active ? (color || T.cyan) + "22" : "transparent",
    border: `1.5px solid ${active ? color || T.cyan : T.border}`,
    borderRadius: 99,
    padding: "7px 18px",
    color: active ? color || T.cyan : T.textMid,
    fontFamily: T.sans,
    fontSize: 13,
    fontWeight: active ? 600 : 400,
    cursor: "pointer",
    transition: "all .15s",
    whiteSpace: "nowrap"
  }
}, children);
function Toast({
  toasts
}) {
  return React.createElement("div", {
    role: "region",
    "aria-label": "Notifications",
    "aria-live": "polite",
    style: {
      position: "fixed",
      bottom: 80,
      right: 20,
      zIndex: 9999,
      display: "flex",
      flexDirection: "column",
      gap: 8,
      pointerEvents: "none"
    }
  }, toasts.map(t => React.createElement("div", {
    key: t.id,
    style: {
      background: T.card,
      border: `1px solid ${t.color || T.border}`,
      borderLeft: `3px solid ${t.color || T.cyan}`,
      borderRadius: 10,
      padding: "12px 16px",
      display: "flex",
      gap: 10,
      alignItems: "center",
      boxShadow: "0 8px 32px #00000066",
      animation: t.out ? "toastOut .3s ease both" : "toastIn .3s ease both",
      minWidth: 220
    }
  }, React.createElement("span", {
    style: {
      fontSize: 16
    }
  }, t.icon || "ℹ️"), React.createElement("div", null, React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      color: T.text
    }
  }, t.title), t.msg && React.createElement("div", {
    style: {
      fontSize: 11,
      color: T.textMid,
      marginTop: 2
    }
  }, t.msg)))));
}
function useToast() {
  const [toasts, setToasts] = useState([]);
  const show = useCallback((title, opts = {}) => {
    const id = Date.now();
    setToasts(p => [...p, {
      id,
      title,
      ...opts
    }]);
    setTimeout(() => setToasts(p => p.map(t => t.id === id ? {
      ...t,
      out: true
    } : t)), 2600);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3000);
  }, []);
  return {
    toasts,
    show
  };
}
function ScoreRing({
  score,
  size = 130,
  animate = true
}) {
  const [cur, setCur] = useState(animate ? 0 : score);
  const rafRef = useRef(null);
  const uid = useRef(`sr${Math.random().toString(36).slice(2, 7)}`).current;
  useEffect(() => {
    const reduced = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (!animate || reduced) {
      setCur(score);
      return;
    }
    setCur(0);
    const target = Math.max(0, Math.min(100, score | 0));
    let start = 0;
    const ease = t => 1 - Math.pow(1 - t, 3);
    const step = ts => {
      if (!start) start = ts;
      const t = Math.min(1, (ts - start) / 1500);
      setCur(Math.round(ease(t) * target));
      if (t < 1) rafRef.current = requestAnimationFrame(step);
    };
    const startTimer = setTimeout(() => {
      rafRef.current = requestAnimationFrame(step);
    }, 250);
    return () => {
      clearTimeout(startTimer);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [score, animate]);
  const cx = size / 2,
    cy = size / 2;
  const r = size * 0.37;
  const sw = size * 0.075;
  const START_DEG = 145;
  const SWEEP = 250;
  const toRad = d => d * Math.PI / 180;
  const pt = d => ({
    x: cx + r * Math.cos(toRad(d)),
    y: cy + r * Math.sin(toRad(d))
  });
  const arcD = (d1, d2) => {
    const p1 = pt(d1),
      p2 = pt(d2);
    const large = ((d2 - d1) % 360 + 360) % 360 > 180 ? 1 : 0;
    return `M ${p1.x.toFixed(2)} ${p1.y.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  };
  const STOPS = [{
    t: 0,
    rgb: [248, 81, 73]
  }, {
    t: 0.35,
    rgb: [247, 147, 26]
  }, {
    t: 0.65,
    rgb: [34, 211, 238]
  }, {
    t: 1,
    rgb: [63, 185, 80]
  }];
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
  const N = 48;
  const filled = cur / 100;
  const dotDeg = START_DEG + SWEEP * filled;
  const dotPt = pt(dotDeg);
  const dotCol = toHex(lerpColor(filled));
  const textCol = scoreColor(score);
  return React.createElement("div", {
    style: {
      position: "relative",
      width: size,
      height: size,
      flexShrink: 0
    }
  }, React.createElement("svg", {
    width: size,
    height: size,
    overflow: "visible"
  }, React.createElement("defs", null, React.createElement("filter", {
    id: `arcglow-${uid}`,
    x: "-40%",
    y: "-40%",
    width: "180%",
    height: "180%"
  }, React.createElement("feGaussianBlur", {
    stdDeviation: sw * 0.6,
    result: "blur"
  }), React.createElement("feMerge", null, React.createElement("feMergeNode", {
    in: "blur"
  }), React.createElement("feMergeNode", {
    in: "SourceGraphic"
  }))), React.createElement("filter", {
    id: `dotglow-${uid}`,
    x: "-150%",
    y: "-150%",
    width: "400%",
    height: "400%"
  }, React.createElement("feGaussianBlur", {
    stdDeviation: sw * 0.9,
    result: "blur"
  }), React.createElement("feMerge", null, React.createElement("feMergeNode", {
    in: "blur"
  }), React.createElement("feMergeNode", {
    in: "SourceGraphic"
  })))), React.createElement("path", {
    d: arcD(START_DEG, START_DEG + SWEEP),
    fill: "none",
    stroke: T.surface,
    strokeWidth: sw + 1,
    strokeLinecap: "round"
  }), cur > 0 && Array.from({
    length: N
  }).map((_, i) => {
    const t1 = i / N;
    const t2 = (i + 1) / N;
    if (t1 >= filled) return null;
    const actualT2 = Math.min(t2, filled);
    const d1 = START_DEG + SWEEP * t1;
    const d2 = START_DEG + SWEEP * actualT2;
    if (d2 - d1 < 0.05) return null;
    const mid = (t1 + actualT2) / 2;
    return React.createElement("path", {
      key: i,
      d: arcD(d1, d2),
      fill: "none",
      stroke: toHex(lerpColor(mid)),
      strokeWidth: sw,
      strokeLinecap: "butt",
      filter: `url(#arcglow-${uid})`
    });
  }), cur > 0 && React.createElement(React.Fragment, null, React.createElement("circle", {
    cx: dotPt.x,
    cy: dotPt.y,
    r: sw * 1.1,
    fill: dotCol,
    opacity: "0.35",
    filter: `url(#dotglow-${uid})`
  }), React.createElement("circle", {
    cx: dotPt.x,
    cy: dotPt.y,
    r: sw * 0.58,
    fill: dotCol,
    filter: `url(#dotglow-${uid})`
  }), React.createElement("circle", {
    cx: dotPt.x,
    cy: dotPt.y,
    r: sw * 0.25,
    fill: "#ffffff"
  }))), React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      paddingTop: size * 0.06
    }
  }, React.createElement("span", {
    style: {
      fontFamily: T.serif,
      fontSize: size * .29,
      color: textCol,
      lineHeight: 1,
      fontWeight: 400
    }
  }, cur), React.createElement("span", {
    style: {
      fontFamily: T.mono,
      fontSize: size * .075,
      color: T.textDim,
      letterSpacing: 1,
      marginTop: 2
    }
  }, "/100")));
}
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
  return React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 14
    }
  }, React.createElement("div", {
    key: animKey,
    style: {
      background: T.card,
      border: `1px solid ${T.border}`,
      borderRadius: 20,
      padding: 28,
      boxShadow: "0 16px 64px #00000044",
      animation: "demoSlide .45s ease both"
    }
  }, React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6,
      marginBottom: 20
    }
  }, React.createElement("div", {
    style: {
      width: 8,
      height: 8,
      borderRadius: "50%",
      background: T.green,
      animation: "pulse 2s infinite"
    }
  }), React.createElement("span", {
    style: {
      fontFamily: T.mono,
      fontSize: 10,
      color: T.textDim,
      letterSpacing: 1.5
    }
  }, "LIVE EXAMPLE \xB7 ROTATING")), React.createElement("div", {
    style: {
      display: "flex",
      gap: 20,
      alignItems: "center",
      marginBottom: 22
    }
  }, React.createElement(ScoreRing, {
    score: ex.score,
    size: 100,
    animate: false
  }), React.createElement("div", null, React.createElement("div", {
    style: {
      fontFamily: T.serif,
      fontSize: 38,
      color: ex.color,
      lineHeight: 1,
      fontWeight: 400
    }
  }, "Grade ", ex.grade), React.createElement("div", {
    style: {
      fontSize: 13,
      color: T.textMid,
      marginTop: 5
    }
  }, ex.label), React.createElement("div", {
    style: {
      fontFamily: T.mono,
      fontSize: 10,
      color: T.textDim,
      marginTop: 6
    }
  }, ex.score, "/100 privacy score"))), React.createElement("div", {
    style: {
      fontSize: 11,
      color: T.textDim,
      marginBottom: 10,
      fontFamily: T.mono,
      letterSpacing: 1
    }
  }, "FINDINGS"), ex.issues.map((issue, i) => {
    const isGood = issue.includes("✓");
    return React.createElement("div", {
      key: i,
      style: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "8px 0",
        borderTop: `1px solid ${T.borderLo}`
      }
    }, React.createElement("div", {
      style: {
        width: 5,
        height: 5,
        borderRadius: "50%",
        background: isGood ? T.green : i < 2 ? T.red : T.amber,
        flexShrink: 0
      }
    }), React.createElement("span", {
      style: {
        fontSize: 13,
        color: isGood ? T.textMid : T.text
      }
    }, issue));
  })), React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "center",
      gap: 8
    },
    role: "tablist",
    "aria-label": "Example wallets"
  }, DEMO_EXAMPLES.map((ex, i) => React.createElement("button", {
    key: i,
    onClick: () => {
      setIdx(i);
      setAnimKey(k => k + 1);
    },
    role: "tab",
    "aria-selected": i === idx,
    "aria-label": `Show example ${i + 1} of ${DEMO_EXAMPLES.length}${ex.label ? ": " + ex.label : ""}`,
    style: {
      width: i === idx ? 20 : 8,
      height: 8,
      borderRadius: 4,
      background: i === idx ? ex.color : T.textDim,
      border: "none",
      cursor: "pointer",
      transition: "all .3s",
      padding: 0
    }
  }))), React.createElement("div", {
    style: {
      background: T.btcLo,
      border: `1px solid ${T.btcMid}`,
      borderRadius: 12,
      padding: "14px 18px"
    }
  }, React.createElement("div", {
    style: {
      fontSize: 12,
      color: T.btc,
      fontWeight: 600,
      marginBottom: 4
    }
  }, "\u20BF Average wallet scores 38/100"), React.createElement("div", {
    style: {
      fontSize: 12,
      color: T.textMid,
      lineHeight: 1.6
    }
  }, "Most wallets have at least 3 fixable issues. The most common? Address reuse \u2014 found in 91% of wallets."), React.createElement("div", {
    style: {
      fontFamily: T.mono,
      fontSize: 9,
      color: T.textDim,
      marginTop: 6,
      letterSpacing: 1
    }
  }, "Source: OXT Research, 2023")));
}
function VisualGaugeArc({
  score,
  size = 120,
  uid
}) {
  const col = scoreColor(score);
  const cx = size / 2,
    cy = size * 0.62,
    R = size * 0.42;
  const startAngle = -210,
    sweepTotal = 240;
  const sweep = score / 100 * sweepTotal;
  const toRad = d => d * Math.PI / 180;
  const pt = a => ({
    x: cx + R * Math.cos(toRad(a)),
    y: cy + R * Math.sin(toRad(a))
  });
  const arcPath = (s, e) => {
    const p = pt(s),
      q = pt(e),
      large = e - s > 180 ? 1 : 0;
    return `M ${p.x} ${p.y} A ${R} ${R} 0 ${large} 1 ${q.x} ${q.y}`;
  };
  const dot = pt(startAngle + sweep);
  const gid = `vg-${uid}`;
  return React.createElement("svg", {
    width: size,
    height: size * 0.78,
    viewBox: `0 0 ${size} ${size * 0.78}`,
    style: {
      overflow: "visible"
    }
  }, React.createElement("defs", null, React.createElement("linearGradient", {
    id: gid,
    x1: "0%",
    y1: "0%",
    x2: "100%",
    y2: "0%"
  }, React.createElement("stop", {
    offset: "0%",
    stopColor: T.red
  }), React.createElement("stop", {
    offset: "50%",
    stopColor: T.amber
  }), React.createElement("stop", {
    offset: "100%",
    stopColor: col
  }))), React.createElement("path", {
    d: arcPath(startAngle, startAngle + sweepTotal),
    fill: "none",
    stroke: "#ffffff10",
    strokeWidth: size * 0.07,
    strokeLinecap: "round"
  }), score > 0 && React.createElement("path", {
    d: arcPath(startAngle, startAngle + sweep),
    fill: "none",
    stroke: `url(#${gid})`,
    strokeWidth: size * 0.07,
    strokeLinecap: "round"
  }), React.createElement("circle", {
    cx: dot.x,
    cy: dot.y,
    r: size * 0.055,
    fill: col
  }), React.createElement("text", {
    x: cx,
    y: cy + size * 0.06,
    textAnchor: "middle",
    dominantBaseline: "middle",
    style: {
      fontFamily: T.sans,
      fontWeight: 700,
      fontSize: size * 0.28,
      fill: T.btc
    }
  }, "\u20BF"));
}
function VisualScoreCard({
  score,
  grade,
  checks,
  address,
  isLightning = false,
  cardRef
}) {
  const col = scoreColor(score);
  const uid = useRef(`vsc${Math.random().toString(36).slice(2, 6)}`).current;
  const fails = checks.filter(c => c.status === "fail").length;
  const warns = checks.filter(c => c.status === "warn").length;
  const passes = checks.filter(c => c.status === "pass").length;
  const topIssues = checks.filter(c => c.status !== "pass").slice(0, 3);
  const auditLabel = isLightning ? "LIGHTNING NODE AUDIT" : "BITCOIN PRIVACY AUDIT";
  const symbol = isLightning ? "⚡" : "₿";
  const dateStr = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric"
  }).toUpperCase();
  return React.createElement("div", {
    ref: cardRef,
    style: {
      width: 320,
      background: `linear-gradient(145deg,#0f1120 0%,#0b0d14 60%,#0f1120 100%)`,
      border: `1.5px solid ${col}33`,
      borderRadius: 20,
      overflow: "hidden",
      boxShadow: `0 0 0 1px #ffffff06, 0 24px 60px #000000cc, 0 0 40px ${col}18`,
      fontFamily: T.sans,
      position: "relative"
    }
  }, React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      backgroundImage: "radial-gradient(circle,#ffffff05 1px,transparent 1px)",
      backgroundSize: "18px 18px"
    }
  }), React.createElement("div", {
    style: {
      height: 3,
      background: `linear-gradient(90deg,transparent,${col},transparent)`
    }
  }), React.createElement("div", {
    style: {
      padding: "12px 16px 0",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 7
    }
  }, React.createElement(VisualGaugeArc, {
    score: score,
    size: 32,
    uid: uid + "h"
  }), React.createElement("div", null, React.createElement("div", {
    style: {
      fontFamily: T.display,
      fontSize: 14,
      fontWeight: 800,
      letterSpacing: 2,
      color: T.text
    }
  }, React.createElement("span", {
    style: {
      color: T.cyan
    }
  }, "ANON"), "SCORE"), React.createElement("div", {
    style: {
      fontFamily: T.mono,
      fontSize: 6,
      color: T.textDim,
      letterSpacing: 1.5,
      marginTop: 1
    }
  }, auditLabel))), React.createElement("div", {
    style: {
      fontFamily: T.mono,
      fontSize: 7,
      color: T.textDim,
      textAlign: "right",
      lineHeight: 1.6
    }
  }, React.createElement("div", {
    style: {
      letterSpacing: 1
    }
  }, dateStr), React.createElement("div", {
    style: {
      opacity: 0.5
    }
  }, "anonscore.com"))), React.createElement("div", {
    style: {
      padding: "8px 16px 10px",
      display: "flex",
      alignItems: "center",
      gap: 12
    }
  }, React.createElement(VisualGaugeArc, {
    score: score,
    size: 72,
    uid: uid + "b"
  }), React.createElement("div", {
    style: {
      flex: 1
    }
  }, React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: 8
    }
  }, React.createElement("div", {
    style: {
      fontFamily: T.serif,
      fontSize: 52,
      color: col,
      lineHeight: 1,
      fontWeight: 300,
      textShadow: `0 0 20px ${col}55`
    }
  }, grade), React.createElement("div", null, React.createElement("div", {
    style: {
      fontFamily: T.mono,
      fontSize: 9,
      color: col,
      letterSpacing: 1
    }
  }, scoreLabel(score)), React.createElement("div", {
    style: {
      fontFamily: T.mono,
      fontSize: 18,
      color: T.text,
      fontWeight: 600,
      lineHeight: 1.1
    }
  }, score, React.createElement("span", {
    style: {
      fontSize: 9,
      color: T.textDim,
      fontWeight: 400
    }
  }, "/100")))), address && address !== "DEMO" && address !== "DEMO_LN" && React.createElement("div", {
    style: {
      fontFamily: T.mono,
      fontSize: 7,
      color: T.textDim,
      marginTop: 4
    }
  }, symbol, " ", fmt.addr(address)))), React.createElement("div", {
    style: {
      height: 1,
      background: `linear-gradient(90deg,transparent,${T.border},transparent)`,
      margin: "0 16px"
    }
  }), React.createElement("div", {
    style: {
      padding: "10px 16px"
    }
  }, React.createElement("div", {
    style: {
      fontFamily: T.mono,
      fontSize: 7,
      color: T.textDim,
      letterSpacing: 1.5,
      marginBottom: 7
    }
  }, "FINDINGS"), React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      marginBottom: 8
    }
  }, [{
    count: fails,
    label: "Critical",
    color: T.red
  }, {
    count: warns,
    label: "Warnings",
    color: T.amber
  }, {
    count: passes,
    label: "Passed",
    color: T.green
  }].map(({
    count,
    label,
    color
  }) => React.createElement("div", {
    key: label,
    style: {
      flex: 1,
      background: `${color}10`,
      border: `1px solid ${color}28`,
      borderRadius: 7,
      padding: "6px 0",
      textAlign: "center"
    }
  }, React.createElement("div", {
    style: {
      fontFamily: T.display,
      fontSize: 17,
      color,
      fontWeight: 700
    }
  }, count), React.createElement("div", {
    style: {
      fontFamily: T.mono,
      fontSize: 6,
      color: T.textDim,
      letterSpacing: 1,
      marginTop: 1
    }
  }, label.toUpperCase())))), topIssues.map((issue, i) => {
    const dot = issue.status === "fail" ? T.red : T.amber;
    return React.createElement("div", {
      key: i,
      style: {
        display: "flex",
        alignItems: "center",
        gap: 7,
        padding: "4px 0",
        borderTop: `1px solid #1e2130`
      }
    }, React.createElement("div", {
      style: {
        width: 4,
        height: 4,
        borderRadius: "50%",
        background: dot,
        flexShrink: 0
      }
    }), React.createElement("span", {
      style: {
        fontSize: 10,
        color: T.text,
        flex: 1
      }
    }, issue.name), React.createElement("span", {
      style: {
        fontFamily: T.mono,
        fontSize: 7,
        color: dot,
        textTransform: "uppercase"
      }
    }, issue.status));
  })), React.createElement("div", {
    style: {
      margin: "0 16px 14px",
      background: `${T.cyan}0d`,
      border: `1px solid ${T.cyan}22`,
      borderRadius: 8,
      padding: "7px 12px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, React.createElement("div", {
    style: {
      fontFamily: T.mono,
      fontSize: 8,
      color: T.textMid
    }
  }, isLightning ? "Score your node free" : "Scan your wallet free"), React.createElement("div", {
    style: {
      fontFamily: T.mono,
      fontSize: 9,
      color: T.cyan,
      fontWeight: 600,
      letterSpacing: 0.5
    }
  }, "anonscore.com \u2192")));
}
function useDialog(onClose) {
  const ref = useRef(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const prev = document.activeElement;
    const focusable = () => [...node.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),textarea:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])')].filter(el => el.offsetParent !== null || el === document.activeElement);
    (focusable()[0] || node).focus();
    const onKey = e => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        closeRef.current && closeRef.current();
        return;
      }
      if (e.key !== "Tab") return;
      const f = focusable();
      if (!f.length) {
        e.preventDefault();
        node.focus();
        return;
      }
      const first = f[0],
        last = f[f.length - 1],
        active = document.activeElement;
      if (e.shiftKey && (active === first || !node.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !node.contains(active))) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("keydown", onKey, true);
      if (prev && typeof prev.focus === "function") prev.focus();
    };
  }, []);
  return ref;
}
function ShareCard({
  score,
  grade,
  checks,
  address,
  isLightning = false,
  onClose
}) {
  const col = scoreColor(score);
  const dialogRef = useDialog(onClose);
  const [mode, setMode] = useState("copy");
  const [didCopy, setDidCopy] = useState(false);
  const [nostrSent, setNostrSent] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const cardRef = useRef(null);
  const issueCount = checks.filter(c => c.status !== "pass").length;
  const modeStr = isLightning ? "Lightning node" : "Bitcoin wallet";
  const heuristicStr = isLightning ? "8 Lightning privacy checks" : "10 on-chain heuristics";
  const avgStr = isLightning ? "" : "\n\nMost wallets score 38/100. How does yours compare?";
  const shareText = `My ${modeStr} privacy score: Grade ${grade} (${score}/100)\n${issueCount} issue${issueCount !== 1 ? "s" : ""} found.\nCheck yours free → anonscore.com`;
  const xText = `My ${modeStr} privacy score: Grade ${grade} (${score}/100) — ${issueCount} issue${issueCount !== 1 ? "s" : ""} found.${avgStr}\n\nFree tool 👇\nanonscore.com`;
  const badgeMd = `\`Privacy: ${score}/100 · Grade ${grade}\` — [AnonScore](https://anonscore.com)`;
  const nostrNote = `🔒 ${modeStr.charAt(0).toUpperCase() + modeStr.slice(1)} privacy score: Grade ${grade} (${score}/100)\n\n${issueCount} issue${issueCount !== 1 ? "s" : ""} detected via AnonScore — a free open-source tool that runs ${heuristicStr} against your ${isLightning ? "node's public footprint" : "on-chain history"}.${avgStr}\n\nhttps://anonscore.com\n\n#Bitcoin #Privacy${isLightning ? " #Lightning" : ""}`;
  const copy = text => {
    navigator.clipboard?.writeText(text).catch(() => {});
    setDidCopy(true);
    setTimeout(() => setDidCopy(false), 2000);
  };
  const shareToX = () => window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(xText)}`, "_blank", "noopener,noreferrer");
  const shareToNostr = async () => {
    if (window.nostr) {
      try {
        await window.nostr.signEvent({
          kind: 1,
          content: nostrNote,
          tags: [],
          created_at: Math.floor(Date.now() / 1000)
        });
        setNostrSent(true);
        setTimeout(() => setNostrSent(false), 3000);
        return;
      } catch {}
    }
    copy(nostrNote);
  };
  const downloadPng = async () => {
    if (!cardRef.current || downloading) return;
    setDownloading(true);
    try {
      if (!window.domtoimage) {
        await new Promise((res, rej) => {
          const s = document.createElement("script");
          s.src = "vendor/dom-to-image-more.min.js";
          s.onload = res;
          s.onerror = rej;
          document.head.appendChild(s);
        });
      }
      await document.fonts.ready;
      await new Promise(r => setTimeout(r, 150));
      const blob = await window.domtoimage.toBlob(cardRef.current, {
        width: 320,
        scale: 2,
        bgcolor: "#0b0d14"
      });
      const a = document.createElement("a");
      const url = URL.createObjectURL(blob);
      a.href = url;
      a.download = `anonscore-grade${grade}-${score}.png`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
    } catch {
      copy(shareText);
    }
    setDownloading(false);
  };
  const TABS = [["copy", "📤 Copy"], ["x", "𝕏 Post"], ["nostr", "🟣 Nostr"], ["badge", "🏷 Badge"], ["card", "🖼 Card"]];
  const isCard = mode === "card";
  return React.createElement("div", {
    style: {
      position: "fixed",
      inset: 0,
      zIndex: 800,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 20
    }
  }, React.createElement("div", {
    onClick: onClose,
    style: {
      position: "absolute",
      inset: 0,
      background: "#00000088"
    }
  }), React.createElement("div", {
    ref: dialogRef,
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "Share your privacy score",
    tabIndex: -1,
    style: {
      position: "relative",
      background: T.card,
      border: `1px solid ${T.border}`,
      borderRadius: 20,
      padding: 24,
      width: isCard ? "min(380px,96vw)" : "min(400px,94vw)",
      animation: "fadeUp .3s ease both",
      transition: "width .2s ease"
    }
  }, React.createElement("div", {
    style: {
      display: "flex",
      gap: 4,
      marginBottom: 18
    }
  }, TABS.map(([m, label]) => React.createElement("button", {
    key: m,
    onClick: () => setMode(m),
    style: {
      flex: 1,
      padding: "7px 2px",
      background: mode === m ? m === "card" ? T.lnLo : T.cyanLo : "transparent",
      border: `1.5px solid ${mode === m ? m === "card" ? T.ln : T.cyan : T.border}`,
      borderRadius: 8,
      color: mode === m ? m === "card" ? T.ln : T.cyan : T.textMid,
      fontSize: 11,
      cursor: "pointer",
      fontFamily: T.sans,
      transition: "all .15s",
      whiteSpace: "nowrap"
    }
  }, label))), mode === "copy" && React.createElement(React.Fragment, null, React.createElement("div", {
    style: {
      background: T.surface,
      borderRadius: 10,
      padding: 14,
      marginBottom: 14,
      border: `1px solid ${T.borderLo}`
    }
  }, React.createElement("pre", {
    style: {
      fontFamily: T.sans,
      fontSize: 13,
      color: T.textMid,
      lineHeight: 1.6,
      whiteSpace: "pre-wrap"
    }
  }, shareText)), React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginBottom: 8
    }
  }, React.createElement("button", {
    onClick: () => copy(shareText),
    style: {
      flex: 1,
      padding: "12px",
      background: didCopy ? T.green : T.cyan,
      border: "none",
      borderRadius: 10,
      color: T.bg,
      fontFamily: T.sans,
      fontWeight: 700,
      fontSize: 14,
      cursor: "pointer",
      transition: "background .2s"
    }
  }, didCopy ? "✓ Copied!" : "Copy to share"), React.createElement("button", {
    onClick: onClose,
    style: {
      padding: "12px 14px",
      background: "transparent",
      border: `1px solid ${T.border}`,
      borderRadius: 10,
      color: T.textMid,
      cursor: "pointer"
    }
  }, "\u2715")), address && address !== "DEMO" && address !== "DEMO_LN" && React.createElement("button", {
    onClick: () => copy(`https://anonscore.com/?scan=${encodeURIComponent(address)}`),
    style: {
      width: "100%",
      padding: "9px",
      background: "transparent",
      border: `1px solid ${T.border}`,
      borderRadius: 10,
      color: T.textDim,
      fontFamily: T.mono,
      fontSize: 11,
      cursor: "pointer",
      transition: "all .15s"
    },
    onMouseOver: e => {
      e.currentTarget.style.borderColor = T.cyan;
      e.currentTarget.style.color = T.cyan;
    },
    onMouseOut: e => {
      e.currentTarget.style.borderColor = T.border;
      e.currentTarget.style.color = T.textDim;
    }
  }, "\uD83D\uDD17 Copy result link \u2014 anonscore.com/?scan=", address.slice(0, 12), "\u2026")), mode === "x" && React.createElement(React.Fragment, null, React.createElement("div", {
    style: {
      background: T.surface,
      borderRadius: 10,
      padding: 14,
      marginBottom: 14,
      border: `1px solid ${T.borderLo}`
    }
  }, React.createElement("pre", {
    style: {
      fontFamily: T.sans,
      fontSize: 13,
      color: T.textMid,
      lineHeight: 1.6,
      whiteSpace: "pre-wrap"
    }
  }, xText)), React.createElement("div", {
    style: {
      display: "flex",
      gap: 10
    }
  }, React.createElement("button", {
    onClick: shareToX,
    style: {
      flex: 1,
      padding: "12px",
      background: "#000",
      border: "none",
      borderRadius: 10,
      color: "#fff",
      fontFamily: T.sans,
      fontWeight: 700,
      fontSize: 14,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8
    }
  }, React.createElement("span", {
    style: {
      fontSize: 16
    }
  }, "\uD835\uDD4F"), " Post on X"), React.createElement("button", {
    onClick: () => copy(xText),
    style: {
      padding: "12px 14px",
      background: "transparent",
      border: `1px solid ${T.border}`,
      borderRadius: 10,
      color: T.textMid,
      cursor: "pointer",
      fontSize: 12
    }
  }, didCopy ? "✓" : "Copy"), React.createElement("button", {
    onClick: onClose,
    style: {
      padding: "12px 14px",
      background: "transparent",
      border: `1px solid ${T.border}`,
      borderRadius: 10,
      color: T.textMid,
      cursor: "pointer"
    }
  }, "\u2715"))), mode === "nostr" && React.createElement(React.Fragment, null, window.nostr && React.createElement("div", {
    style: {
      background: T.greenLo,
      border: `1px solid ${T.green}33`,
      borderRadius: 8,
      padding: "8px 12px",
      marginBottom: 10,
      fontSize: 12,
      color: T.green
    }
  }, "\u2713 NIP-07 extension detected \u2014 can publish directly"), React.createElement("div", {
    style: {
      background: T.surface,
      borderRadius: 10,
      padding: 14,
      marginBottom: 14,
      border: `1px solid ${T.borderLo}`
    }
  }, React.createElement("pre", {
    style: {
      fontFamily: T.sans,
      fontSize: 12,
      color: T.textMid,
      lineHeight: 1.6,
      whiteSpace: "pre-wrap"
    }
  }, nostrNote)), React.createElement("div", {
    style: {
      display: "flex",
      gap: 10
    }
  }, React.createElement("button", {
    onClick: shareToNostr,
    style: {
      flex: 1,
      padding: "12px",
      background: nostrSent ? T.green : "#8B5CF6",
      border: "none",
      borderRadius: 10,
      color: "#fff",
      fontFamily: T.sans,
      fontWeight: 700,
      fontSize: 14,
      cursor: "pointer",
      transition: "background .2s"
    }
  }, nostrSent ? "✓ Published!" : window.nostr ? "Publish to Nostr" : "Copy Nostr note"), React.createElement("button", {
    onClick: onClose,
    style: {
      padding: "12px 14px",
      background: "transparent",
      border: `1px solid ${T.border}`,
      borderRadius: 10,
      color: T.textMid,
      cursor: "pointer"
    }
  }, "\u2715"))), mode === "badge" && React.createElement(React.Fragment, null, React.createElement("div", {
    style: {
      background: T.surface,
      borderRadius: 10,
      padding: 14,
      marginBottom: 10,
      border: `1px solid ${T.borderLo}`
    }
  }, React.createElement("div", {
    style: {
      fontFamily: T.mono,
      fontSize: 9,
      color: T.textDim,
      letterSpacing: 1.5,
      marginBottom: 8
    }
  }, "MARKDOWN BADGE"), React.createElement("pre", {
    style: {
      fontFamily: T.mono,
      fontSize: 11,
      color: T.textMid,
      lineHeight: 1.7,
      whiteSpace: "pre-wrap",
      wordBreak: "break-all"
    }
  }, badgeMd)), React.createElement("div", {
    style: {
      fontSize: 12,
      color: T.textMid,
      marginBottom: 14,
      lineHeight: 1.5
    }
  }, "Paste into your GitHub README or Nostr profile bio to show your privacy grade."), React.createElement("button", {
    onClick: () => copy(badgeMd),
    style: {
      width: "100%",
      padding: "12px",
      background: didCopy ? T.green : T.cyan,
      border: "none",
      borderRadius: 10,
      color: T.bg,
      fontFamily: T.sans,
      fontWeight: 700,
      fontSize: 14,
      cursor: "pointer",
      transition: "background .2s"
    }
  }, didCopy ? "✓ Copied!" : "Copy badge markdown")), mode === "card" && React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 14
    }
  }, React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "center"
    }
  }, React.createElement(VisualScoreCard, {
    score: score,
    grade: grade,
    checks: checks,
    address: address,
    isLightning: isLightning,
    cardRef: cardRef
  })), React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      width: "100%"
    }
  }, React.createElement("button", {
    onClick: downloadPng,
    style: {
      flex: 1,
      padding: "12px",
      background: downloading ? T.surface : T.ln,
      border: `1px solid ${downloading ? T.border : "transparent"}`,
      borderRadius: 10,
      color: downloading ? T.textMid : T.bg,
      fontFamily: T.sans,
      fontWeight: 700,
      fontSize: 14,
      cursor: downloading ? "default" : "pointer",
      transition: "all .2s"
    }
  }, downloading ? "Rendering…" : "⬇ Download PNG"), React.createElement("button", {
    onClick: onClose,
    style: {
      padding: "12px 14px",
      background: "transparent",
      border: `1px solid ${T.border}`,
      borderRadius: 10,
      color: T.textMid,
      cursor: "pointer"
    }
  }, "\u2715")), React.createElement("div", {
    style: {
      fontFamily: T.mono,
      fontSize: 9,
      color: T.textDim,
      textAlign: "center",
      lineHeight: 1.7
    }
  }, "Save the PNG and drop it into any post. Works on X, Nostr, Telegram."))));
}
const GUARANTEES = [{
  icon: "⬡",
  label: "No server, no backend",
  desc: "Your address goes directly from your browser to Blockstream's public API. It never touches our infrastructure."
}, {
  icon: "◌",
  label: "Nothing stored or logged",
  desc: "We have no database, no analytics, no session tracking. Close the tab and it's gone."
}, {
  icon: "◎",
  label: "Scoring runs in your browser",
  desc: "All 10 heuristics execute locally. Your score and results are computed on your device and sent nowhere — not even to us. (The address itself does reach Blockstream's public API to fetch the chain data, as noted above.)"
}];
function TrustBox() {
  const [open, setOpen] = useState(false);
  return React.createElement("div", {
    style: {
      background: T.surface,
      border: `1px solid ${open ? T.green + "44" : T.border}`,
      borderRadius: 12,
      marginBottom: 20,
      animation: "fadeUp .5s ease .18s both",
      transition: "border-color .2s",
      overflow: "hidden"
    }
  }, React.createElement("button", {
    onClick: () => setOpen(o => !o),
    style: {
      width: "100%",
      background: "transparent",
      border: "none",
      padding: "12px 16px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      cursor: "pointer"
    }
  }, React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 14
    }
  }, GUARANTEES.map((g, i) => React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 5
    }
  }, React.createElement("span", {
    style: {
      color: T.green,
      fontSize: 11
    }
  }, "\u2713"), React.createElement("span", {
    style: {
      fontFamily: T.mono,
      fontSize: 11,
      color: T.textMid,
      letterSpacing: .5,
      whiteSpace: "nowrap"
    }
  }, g.label)))), React.createElement("span", {
    style: {
      fontFamily: T.mono,
      fontSize: 11,
      color: T.cyan,
      flexShrink: 0,
      marginLeft: 12
    }
  }, open ? "▲ less" : "▼ how?")), open && React.createElement("div", {
    style: {
      padding: "0 16px 14px",
      borderTop: `1px solid ${T.borderLo}`,
      animation: "slideDown .2s ease both"
    }
  }, React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 10,
      marginTop: 12
    }
  }, GUARANTEES.map((g, i) => React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      gap: 10,
      alignItems: "flex-start"
    }
  }, React.createElement("span", {
    style: {
      fontFamily: T.mono,
      fontSize: 12,
      color: T.green,
      flexShrink: 0,
      marginTop: 1
    }
  }, g.icon), React.createElement("div", null, React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      color: T.text
    }
  }, g.label, " "), React.createElement("span", {
    style: {
      fontSize: 13,
      color: T.textMid
    }
  }, g.desc))))), React.createElement("div", {
    style: {
      marginTop: 12,
      paddingTop: 10,
      borderTop: `1px solid ${T.borderLo}`
    }
  }, React.createElement("a", {
    href: "https://github.com/netasset/anonscore",
    target: "_blank",
    rel: "noopener noreferrer",
    style: {
      fontSize: 12,
      color: T.cyan,
      textDecoration: "none",
      fontFamily: T.mono
    }
  }, "Don't take our word for it \u2014 audit the source on GitHub \u2197"))));
}
const CATEGORY_META = {
  exchange: {
    label: "Exchange",
    color: "#58a6ff"
  },
  seizure: {
    label: "Seizure",
    color: "#f85149"
  },
  darknet: {
    label: "Darknet",
    color: "#E8A730"
  },
  miner: {
    label: "Miner",
    color: "#3fb950"
  }
};
const STATUS_META = {
  active: {
    label: "Active",
    color: "#3fb950"
  },
  dormant: {
    label: "Dormant",
    color: "#888fae"
  },
  liquidating: {
    label: "Liquidating",
    color: "#E8A730"
  },
  liquidated: {
    label: "Liquidated",
    color: "#58a6ff"
  }
};
function CaseFiles({
  onOpenCase,
  onBack,
  isMobile
}) {
  const PAGE_ROLE_LABEL = "AnonScore case files — notable Bitcoin wallets";
  const [filter, setFilter] = useState("all");
  const categories = ["all", "exchange", "seizure", "miner"];
  const visible = filter === "all" ? CASE_FILES : CASE_FILES.filter(c => c.category === filter);
  return React.createElement("div", {
    role: "main",
    "aria-label": PAGE_ROLE_LABEL,
    style: {
      minHeight: "100vh",
      background: T.bg,
      display: "flex",
      flexDirection: "column"
    }
  }, React.createElement("nav", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: isMobile ? "12px 16px" : "12px 32px",
      borderBottom: `1px solid ${T.border}`,
      background: T.bg,
      position: "sticky",
      top: 0,
      zIndex: 100
    }
  }, React.createElement("button", {
    onClick: onBack,
    style: {
      background: "transparent",
      border: `1.5px solid ${T.border}`,
      borderRadius: 8,
      padding: "7px 12px",
      color: T.textMid,
      fontFamily: T.sans,
      fontSize: 13,
      cursor: "pointer",
      transition: "border .15s"
    },
    onMouseOver: e => e.currentTarget.style.borderColor = T.cyan,
    onMouseOut: e => e.currentTarget.style.borderColor = T.border
  }, "\u2190 Back"), React.createElement("div", {
    style: {
      fontFamily: T.display,
      fontSize: 15,
      letterSpacing: 4,
      fontWeight: 700
    }
  }, "ANON", React.createElement("span", {
    style: {
      color: T.cyan
    }
  }, "SCORE")), React.createElement("div", {
    style: {
      flex: 1
    }
  }), React.createElement("div", {
    style: {
      fontFamily: T.mono,
      fontSize: 10,
      color: T.textDim
    }
  }, "CASE FILES")), React.createElement("div", {
    style: {
      flex: 1,
      padding: isMobile ? "24px 16px" : "40px 48px",
      maxWidth: 960,
      margin: "0 auto",
      width: "100%"
    }
  }, React.createElement("div", {
    style: {
      marginBottom: 32
    }
  }, React.createElement("div", {
    style: {
      fontFamily: T.mono,
      fontSize: 10,
      color: T.textDim,
      letterSpacing: 2.5,
      marginBottom: 12
    }
  }, "NOTABLE BITCOIN WALLETS"), React.createElement("h1", {
    style: {
      fontFamily: T.serif,
      fontSize: isMobile ? 32 : 48,
      color: T.text,
      fontWeight: 400,
      marginBottom: 12
    }
  }, "Case Files"), React.createElement("p", {
    style: {
      fontSize: 15,
      color: T.textMid,
      lineHeight: 1.7,
      maxWidth: 600,
      fontWeight: 300
    }
  }, "The most significant Bitcoin addresses in history \u2014 scored, dissected, and explained. Each case shows what blockchain forensics actually reveals about real-world wallets.")), React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginBottom: 24,
      flexWrap: "wrap"
    }
  }, categories.map(cat => React.createElement("button", {
    key: cat,
    onClick: () => setFilter(cat),
    style: {
      padding: "6px 14px",
      borderRadius: 20,
      border: `1px solid ${filter === cat ? T.cyan : T.border}`,
      background: filter === cat ? T.cyanLo : "transparent",
      color: filter === cat ? T.cyan : T.textDim,
      fontFamily: T.mono,
      fontSize: 10,
      cursor: "pointer",
      letterSpacing: 1,
      transition: "all .15s",
      textTransform: "uppercase"
    }
  }, cat === "all" ? `All (${CASE_FILES.length})` : `${CATEGORY_META[cat]?.label} (${CASE_FILES.filter(c => c.category === cat).length})`))), React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
      gap: 16
    }
  }, visible.map((c, i) => {
    const cat = CATEGORY_META[c.category];
    const st = STATUS_META[c.status];
    return React.createElement("div", {
      key: c.id,
      onClick: () => onOpenCase(c),
      style: {
        background: T.card,
        border: `1px solid ${T.border}`,
        borderRadius: 16,
        padding: "22px 24px",
        cursor: "pointer",
        transition: "transform .13s ease-out, border-color .2s, box-shadow .25s",
        animation: `fadeUp .35s ease ${i * .06}s both`
      },
      onMouseMove: tiltMove,
      onMouseEnter: e => {
        e.currentTarget.style.borderColor = cat.color + "66";
        e.currentTarget.style.boxShadow = `0 16px 40px -18px ${cat.color}`;
      },
      onMouseLeave: e => {
        tiltReset(e);
        e.currentTarget.style.borderColor = T.border;
        e.currentTarget.style.boxShadow = "none";
      }
    }, React.createElement("div", {
      style: {
        height: 2,
        background: cat.color,
        borderRadius: 1,
        marginBottom: 16,
        opacity: 0.7
      }
    }), React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginBottom: 10
      }
    }, React.createElement("span", {
      style: {
        fontFamily: T.mono,
        fontSize: 9,
        color: T.textDim
      }
    }, "#", c.id), React.createElement("span", {
      style: {
        fontFamily: T.mono,
        fontSize: 8,
        color: cat.color,
        background: cat.color + "18",
        border: `1px solid ${cat.color}33`,
        borderRadius: 4,
        padding: "2px 7px",
        letterSpacing: 1
      }
    }, cat.label.toUpperCase()), React.createElement("span", {
      style: {
        fontFamily: T.mono,
        fontSize: 8,
        color: st.color,
        background: st.color + "18",
        border: `1px solid ${st.color}33`,
        borderRadius: 4,
        padding: "2px 7px",
        letterSpacing: 1
      }
    }, st.label.toUpperCase()), React.createElement("span", {
      style: {
        marginLeft: "auto",
        fontFamily: T.mono,
        fontSize: 9,
        color: T.textDim
      }
    }, c.btc, " BTC")), React.createElement("div", {
      style: {
        fontFamily: T.serif,
        fontSize: 20,
        color: T.text,
        fontWeight: 400,
        marginBottom: 8
      }
    }, c.title), React.createElement("div", {
      style: {
        fontFamily: T.mono,
        fontSize: 10,
        color: T.textDim,
        marginBottom: 10
      }
    }, c.entity), React.createElement("div", {
      style: {
        fontSize: 13,
        color: T.textMid,
        lineHeight: 1.6,
        marginBottom: 16
      }
    }, c.hook), React.createElement("div", {
      style: {
        fontFamily: T.mono,
        fontSize: 9,
        color: T.textDim,
        background: T.surface,
        borderRadius: 6,
        padding: "6px 10px",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
      }
    }, c.address), React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "flex-end",
        marginTop: 14
      }
    }, React.createElement("span", {
      style: {
        fontFamily: T.mono,
        fontSize: 10,
        color: cat.color
      }
    }, "Read case \u2192")));
  }))));
}
function CaseDetail({
  caseFile,
  onBack,
  onAnalyze,
  isMobile
}) {
  const PAGE_ROLE_LABEL = "AnonScore case file: " + caseFile.title;
  const [shareMode, setShareMode] = useState(null);
  const [copied, setCopied] = useState(false);
  const cat = CATEGORY_META[caseFile.category];
  const st = STATUS_META[caseFile.status];
  const copy = text => {
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const scanUrl = `https://anonscore.com/?scan=${encodeURIComponent(caseFile.address)}`;
  const threadText = caseFile.thread.join("\n\n---\n\n");
  return React.createElement("div", {
    role: "main",
    "aria-label": PAGE_ROLE_LABEL,
    style: {
      minHeight: "100vh",
      background: T.bg,
      display: "flex",
      flexDirection: "column"
    }
  }, React.createElement("nav", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: isMobile ? "12px 16px" : "12px 32px",
      borderBottom: `1px solid ${T.border}`,
      background: T.bg,
      position: "sticky",
      top: 0,
      zIndex: 100
    }
  }, React.createElement("button", {
    onClick: onBack,
    style: {
      background: "transparent",
      border: `1.5px solid ${T.border}`,
      borderRadius: 8,
      padding: "7px 12px",
      color: T.textMid,
      fontFamily: T.sans,
      fontSize: 13,
      cursor: "pointer"
    },
    onMouseOver: e => e.currentTarget.style.borderColor = T.cyan,
    onMouseOut: e => e.currentTarget.style.borderColor = T.border
  }, "\u2190 Cases"), React.createElement("div", {
    style: {
      fontFamily: T.display,
      fontSize: 15,
      letterSpacing: 4,
      fontWeight: 700
    }
  }, "ANON", React.createElement("span", {
    style: {
      color: T.cyan
    }
  }, "SCORE")), React.createElement("div", {
    style: {
      flex: 1
    }
  }), React.createElement("span", {
    style: {
      fontFamily: T.mono,
      fontSize: 9,
      color: cat.color,
      background: cat.color + "18",
      border: `1px solid ${cat.color}33`,
      borderRadius: 4,
      padding: "3px 8px",
      letterSpacing: 1
    }
  }, "CASE #", caseFile.id)), React.createElement("div", {
    style: {
      flex: 1,
      padding: isMobile ? "24px 16px" : "40px 48px",
      maxWidth: 800,
      margin: "0 auto",
      width: "100%"
    }
  }, React.createElement("div", {
    style: {
      marginBottom: 32,
      animation: "fadeUp .4s ease both"
    }
  }, React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      alignItems: "center",
      marginBottom: 14
    }
  }, React.createElement("span", {
    style: {
      fontFamily: T.mono,
      fontSize: 8,
      color: cat.color,
      background: cat.color + "18",
      border: `1px solid ${cat.color}33`,
      borderRadius: 4,
      padding: "2px 7px",
      letterSpacing: 1
    }
  }, cat.label.toUpperCase()), React.createElement("span", {
    style: {
      fontFamily: T.mono,
      fontSize: 8,
      color: st.color,
      background: st.color + "18",
      border: `1px solid ${st.color}33`,
      borderRadius: 4,
      padding: "2px 7px",
      letterSpacing: 1
    }
  }, st.label.toUpperCase()), React.createElement("span", {
    style: {
      fontFamily: T.mono,
      fontSize: 9,
      color: T.textDim
    }
  }, caseFile.entity)), React.createElement("h1", {
    style: {
      fontFamily: T.serif,
      fontSize: isMobile ? 28 : 42,
      color: T.text,
      fontWeight: 400,
      marginBottom: 16,
      lineHeight: 1.2
    }
  }, caseFile.title), React.createElement("p", {
    style: {
      fontSize: 16,
      color: T.textMid,
      lineHeight: 1.7,
      fontWeight: 300
    }
  }, caseFile.hook)), React.createElement("div", {
    style: {
      position: "relative",
      background: T.card,
      border: `1px solid ${T.border}`,
      borderRadius: 16,
      overflow: "hidden",
      marginBottom: 28,
      animation: "fadeUp .4s ease .06s both"
    }
  }, React.createElement(CaseHero, {
    seed: caseFile.id,
    color: cat.color,
    height: isMobile ? 96 : 132
  }), React.createElement("div", {
    style: {
      position: "absolute",
      bottom: 10,
      left: 16,
      fontFamily: T.mono,
      fontSize: 8,
      color: T.textDim,
      letterSpacing: 1.5,
      pointerEvents: "none"
    }
  }, "ON-CHAIN FLOW \xB7 ", caseFile.btc, " BTC"), React.createElement("div", {
    style: {
      position: "absolute",
      top: 10,
      right: 16,
      fontFamily: T.mono,
      fontSize: 8,
      color: cat.color,
      letterSpacing: 1.5,
      pointerEvents: "none"
    }
  }, "FINGERPRINT")), React.createElement("div", {
    style: {
      background: T.card,
      border: `1px solid ${cat.color}33`,
      borderRadius: 16,
      padding: "20px 24px",
      marginBottom: 28,
      animation: "fadeUp .4s ease .08s both"
    }
  }, React.createElement("div", {
    style: {
      height: 2,
      background: cat.color,
      borderRadius: 1,
      margin: "-20px -24px 16px",
      opacity: 0.6
    }
  }), React.createElement("div", {
    style: {
      display: "flex",
      alignItems: isMobile ? "flex-start" : "center",
      gap: 16,
      flexDirection: isMobile ? "column" : "row"
    }
  }, React.createElement("div", {
    style: {
      flex: 1
    }
  }, React.createElement("div", {
    style: {
      fontFamily: T.mono,
      fontSize: 9,
      color: T.textDim,
      letterSpacing: 1.5,
      marginBottom: 6
    }
  }, "ADDRESS"), React.createElement("div", {
    style: {
      fontFamily: T.mono,
      fontSize: isMobile ? 10 : 12,
      color: T.text,
      wordBreak: "break-all",
      lineHeight: 1.5
    }
  }, caseFile.address), React.createElement("div", {
    style: {
      fontFamily: T.mono,
      fontSize: 9,
      color: T.textDim,
      marginTop: 4
    }
  }, caseFile.btc, " BTC \xB7 ", caseFile.entity)), React.createElement("button", {
    onClick: () => onAnalyze(caseFile.address, false, "btc"),
    style: {
      flexShrink: 0,
      background: cat.color,
      border: "none",
      borderRadius: 10,
      padding: "12px 22px",
      color: T.bg,
      fontFamily: T.sans,
      fontWeight: 700,
      fontSize: 14,
      cursor: "pointer",
      whiteSpace: "nowrap",
      transition: "opacity .15s"
    },
    onMouseOver: e => e.currentTarget.style.opacity = ".85",
    onMouseOut: e => e.currentTarget.style.opacity = "1"
  }, "Scan live \u2192"))), React.createElement("div", {
    style: {
      background: T.surface,
      border: `1px solid ${T.border}`,
      borderRadius: 12,
      padding: "16px 20px",
      marginBottom: 16,
      animation: "fadeUp .4s ease .12s both"
    }
  }, React.createElement("div", {
    style: {
      fontFamily: T.mono,
      fontSize: 9,
      color: T.textDim,
      letterSpacing: 1.5,
      marginBottom: 10
    }
  }, "KEY FACTS"), React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 6
    }
  }, caseFile.notable.map((fact, i) => React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      gap: 10,
      alignItems: "flex-start"
    }
  }, React.createElement("span", {
    style: {
      color: cat.color,
      fontSize: 10,
      flexShrink: 0,
      marginTop: 2
    }
  }, "\u25C6"), React.createElement("span", {
    style: {
      fontSize: 13,
      color: T.textMid,
      lineHeight: 1.6
    }
  }, fact))))), React.createElement("div", {
    style: {
      background: T.greenLo,
      border: `1px solid ${T.green}33`,
      borderRadius: 12,
      padding: "14px 18px",
      marginBottom: 28,
      animation: "fadeUp .4s ease .14s both"
    }
  }, React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      alignItems: "flex-start"
    }
  }, React.createElement("span", {
    style: {
      color: T.green,
      fontSize: 13,
      flexShrink: 0,
      marginTop: 1
    }
  }, "\uD83D\uDD13"), React.createElement("div", null, React.createElement("div", {
    style: {
      fontFamily: T.mono,
      fontSize: 9,
      color: T.green,
      letterSpacing: 1.5,
      marginBottom: 6
    }
  }, "PUBLIC WALLET \u2014 EXTENDED AI ACCESS"), React.createElement("div", {
    style: {
      fontSize: 12,
      color: T.textMid,
      lineHeight: 1.7
    }
  }, "This is a publicly known institutional wallet. When you open the AI assistant after scanning, it receives the score, issue breakdown, ", React.createElement("strong", {
    style: {
      color: T.text
    }
  }, "and a summary of recent on-chain transactions"), " \u2014 all public blockchain data. This allows it to discuss specific transaction patterns, not just the score."), React.createElement("div", {
    style: {
      fontSize: 12,
      color: T.textDim,
      lineHeight: 1.7,
      marginTop: 8,
      paddingTop: 8,
      borderTop: `1px solid ${T.borderLo}`
    }
  }, "\uD83D\uDD12 ", React.createElement("strong", {
    style: {
      color: T.text
    }
  }, "Personal wallets work differently."), " When you scan your own address, the AI receives only your score and issue names \u2014 never transaction IDs, UTXO data, or anything that could identify you. That boundary is enforced in code and shown in the consent screen before every session.", " ", React.createElement("a", {
    href: "https://github.com/netasset/anonscore",
    target: "_blank",
    rel: "noopener noreferrer",
    style: {
      color: T.cyan,
      textDecoration: "underline"
    }
  }, "Verify it in the open source code \u2192"))))), React.createElement("div", {
    style: {
      marginBottom: 24,
      animation: "fadeUp .4s ease .16s both"
    }
  }, React.createElement("div", {
    style: {
      fontFamily: T.mono,
      fontSize: 9,
      color: T.textDim,
      letterSpacing: 1.5,
      marginBottom: 12
    }
  }, "BACKGROUND"), React.createElement("div", {
    style: {
      fontSize: 15,
      color: T.textMid,
      lineHeight: 1.8,
      fontWeight: 300
    }
  }, caseFile.summary)), React.createElement("div", {
    style: {
      marginBottom: 32,
      animation: "fadeUp .4s ease .20s both"
    }
  }, React.createElement("div", {
    style: {
      fontFamily: T.mono,
      fontSize: 9,
      color: T.textDim,
      letterSpacing: 1.5,
      marginBottom: 16
    }
  }, "CASE ANALYSIS"), caseFile.narrative.split("\n\n").map((para, i) => React.createElement("p", {
    key: i,
    style: {
      fontSize: 15,
      color: T.textMid,
      lineHeight: 1.85,
      marginBottom: 16,
      fontWeight: 300
    }
  }, para))), React.createElement("div", {
    style: {
      background: T.card,
      border: `1px solid ${T.border}`,
      borderRadius: 16,
      overflow: "hidden",
      marginBottom: 24,
      animation: "fadeUp .4s ease .24s both"
    }
  }, React.createElement("div", {
    style: {
      display: "flex",
      borderBottom: `1px solid ${T.border}`
    }
  }, [["thread", "𝕏 Thread"], ["link", "🔗 Share link"]].map(([m, label]) => React.createElement("button", {
    key: m,
    onClick: () => setShareMode(shareMode === m ? null : m),
    style: {
      flex: 1,
      padding: "12px",
      background: shareMode === m ? T.cyanLo : "transparent",
      border: "none",
      borderRight: m === "thread" ? `1px solid ${T.border}` : "none",
      color: shareMode === m ? T.cyan : T.textMid,
      fontFamily: T.sans,
      fontSize: 13,
      cursor: "pointer",
      transition: "all .15s"
    }
  }, label))), shareMode === "thread" && React.createElement("div", {
    style: {
      padding: "16px 20px"
    }
  }, React.createElement("div", {
    style: {
      fontFamily: T.mono,
      fontSize: 9,
      color: T.textDim,
      letterSpacing: 1.5,
      marginBottom: 12
    }
  }, "PRE-WRITTEN X THREAD \u2014 ", caseFile.thread.length, " TWEETS"), caseFile.thread.map((tweet, i) => React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      gap: 10,
      padding: "10px 0",
      borderTop: i > 0 ? `1px solid ${T.borderLo}` : undefined
    }
  }, React.createElement("span", {
    style: {
      fontFamily: T.mono,
      fontSize: 9,
      color: T.textDim,
      flexShrink: 0,
      width: 20
    }
  }, i + 1, "/"), React.createElement("span", {
    style: {
      fontSize: 13,
      color: T.textMid,
      lineHeight: 1.65,
      flex: 1
    }
  }, tweet))), React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginTop: 14
    }
  }, React.createElement("button", {
    onClick: () => copy(threadText),
    style: {
      flex: 1,
      padding: "10px",
      background: copied ? T.green : T.cyan,
      border: "none",
      borderRadius: 8,
      color: T.bg,
      fontFamily: T.sans,
      fontWeight: 700,
      fontSize: 13,
      cursor: "pointer",
      transition: "background .2s"
    }
  }, copied ? "✓ Copied!" : "Copy full thread"), React.createElement("button", {
    onClick: () => window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(caseFile.thread[0])}`, "_blank", "noopener,noreferrer"),
    style: {
      padding: "10px 16px",
      background: "#000",
      border: "none",
      borderRadius: 8,
      color: "#fff",
      fontFamily: T.sans,
      fontWeight: 700,
      fontSize: 13,
      cursor: "pointer"
    }
  }, "Post on \uD835\uDD4F"))), shareMode === "link" && React.createElement("div", {
    style: {
      padding: "16px 20px"
    }
  }, React.createElement("div", {
    style: {
      fontFamily: T.mono,
      fontSize: 9,
      color: T.textDim,
      letterSpacing: 1.5,
      marginBottom: 10
    }
  }, "SHAREABLE SCAN LINK"), React.createElement("div", {
    style: {
      fontFamily: T.mono,
      fontSize: 11,
      color: T.textMid,
      background: T.surface,
      borderRadius: 8,
      padding: "10px 12px",
      marginBottom: 12,
      wordBreak: "break-all"
    }
  }, scanUrl), React.createElement("div", {
    style: {
      fontSize: 12,
      color: T.textDim,
      marginBottom: 12,
      lineHeight: 1.6
    }
  }, "Anyone who opens this link will see a confirmation prompt, then can scan this address live. Perfect for posts and articles."), React.createElement("button", {
    onClick: () => copy(scanUrl),
    style: {
      width: "100%",
      padding: "10px",
      background: copied ? T.green : T.cyan,
      border: "none",
      borderRadius: 8,
      color: T.bg,
      fontFamily: T.sans,
      fontWeight: 700,
      fontSize: 13,
      cursor: "pointer",
      transition: "background .2s"
    }
  }, copied ? "✓ Copied!" : "Copy link"))), caseFile.externalUrl && React.createElement("div", {
    style: {
      textAlign: "center",
      marginBottom: 24,
      animation: "fadeUp .4s ease .28s both"
    }
  }, React.createElement("a", {
    href: caseFile.externalUrl,
    target: "_blank",
    rel: "noopener noreferrer",
    style: {
      fontFamily: T.mono,
      fontSize: 11,
      color: T.cyan,
      textDecoration: "none"
    }
  }, "Further reading \u2197"))));
}
function LangSwitcher({
  compact = false
}) {
  const lang = useLang();
  if (SUPPORTED_LANGS.length < 2) return null;
  return React.createElement("div", {
    role: "group",
    "aria-label": "Language",
    style: {
      display: "flex",
      alignItems: "center",
      gap: 2,
      border: `1px solid ${T.border}`,
      borderRadius: 7,
      overflow: "hidden"
    }
  }, SUPPORTED_LANGS.map(l => React.createElement("button", {
    key: l,
    onClick: () => setLang(l),
    "aria-pressed": lang === l,
    "aria-label": `Switch language to ${LANG_LABEL[l]}`,
    style: {
      background: lang === l ? T.cyan : "transparent",
      border: "none",
      padding: compact ? "4px 7px" : "5px 9px",
      color: lang === l ? T.bg : T.textDim,
      fontFamily: T.mono,
      fontSize: 10,
      fontWeight: 700,
      cursor: "pointer",
      letterSpacing: 0.5,
      transition: "background .15s, color .15s"
    }
  }, LANG_LABEL[l])));
}
let _reducedMotion = null;
function prefersReducedMotion() {
  if (_reducedMotion === null) _reducedMotion = !!(typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  return _reducedMotion;
}
function tiltMove(e) {
  if (prefersReducedMotion()) return;
  const el = e.currentTarget,
    r = el.getBoundingClientRect();
  const px = (e.clientX - r.left) / r.width - 0.5;
  const py = (e.clientY - r.top) / r.height - 0.5;
  el.style.transform = `perspective(760px) rotateX(${(-py * 6.5).toFixed(2)}deg) rotateY(${(px * 6.5).toFixed(2)}deg) translateY(-4px)`;
}
function tiltReset(e) {
  e.currentTarget.style.transform = "";
}
function CountUp({
  value
}) {
  const ref = useRef(null);
  const m = String(value).match(/^(\D*)([\d.,]+)(.*)$/);
  useEffect(() => {
    const el = ref.current;
    if (!el || !m) return;
    const target = parseFloat(m[2].replace(/,/g, ""));
    const decimals = (m[2].split(".")[1] || "").length;
    const settle = () => {
      el.textContent = value;
    };
    if (typeof IntersectionObserver === "undefined" || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      settle();
      return;
    }
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        io.unobserve(el);
        const dur = 1150,
          start = performance.now();
        const step = now => {
          const p = Math.min(1, (now - start) / dur);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = m[1] + (target * eased).toFixed(decimals) + m[3];
          if (p < 1) requestAnimationFrame(step);else settle();
        };
        requestAnimationFrame(step);
      });
    }, {
      threshold: 0.5
    });
    io.observe(el);
    return () => io.disconnect();
  }, [value]);
  return React.createElement("span", {
    ref: ref
  }, value);
}
function Landing({
  onAnalyze,
  isMobile,
  onCases
}) {
  useLang();
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [history, setHistory] = useState(() => getHistory());
  const deleteHistory = addr => {
    removeFromHistory(addr);
    setHistory(getHistory());
  };
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
  useEffect(() => {
    const onKey = e => {
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      e.preventDefault();
      inputRef.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  useEffect(() => {
    const els = document.querySelectorAll(".reveal:not(.in)");
    if (typeof IntersectionObserver === "undefined") {
      els.forEach(el => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: "0px 0px -7% 0px"
    });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    const el = heroRef.current;
    if (!el || isMobile) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const onMove = e => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width * 100;
      const y = (e.clientY - r.top) / r.height * 100;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty("--mx", x + "%");
        el.style.setProperty("--my", y + "%");
      });
    };
    el.addEventListener("mousemove", onMove);
    return () => {
      el.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [isMobile]);
  const inputType = detectInputType(input);
  const isLn = inputType === "ln_pubkey" || inputType === "ln_address";
  const submit = (val, plain = false) => {
    const v = (val || input).trim();
    if (!v) {
      setError(t("err.empty"));
      return;
    }
    const detected = detectInputType(v);
    if (!detected) {
      setError(t("err.invalid"));
      return;
    }
    if (detected === "ln_address") {
      setError(t("err.lnaddress"));
      return;
    }
    setError("");
    onAnalyze(v, plain, detected);
  };
  return React.createElement(React.Fragment, null, React.createElement("nav", {
    "aria-label": "OPNorange toolkit",
    style: {
      background: T.bg,
      borderBottom: `1px solid ${T.borderLo}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 10,
      padding: isMobile ? "7px 20px" : "7px 48px"
    }
  }, React.createElement("a", {
    href: "https://opnorange.com",
    target: "_blank",
    rel: "noopener noreferrer",
    "aria-label": "OPNorange \u2014 the toolkit hub",
    style: {
      display: "flex",
      alignItems: "center",
      gap: 7,
      textDecoration: "none",
      flexShrink: 0
    }
  }, React.createElement("span", {
    style: {
      width: 7,
      height: 7,
      borderRadius: "50%",
      background: T.opn,
      boxShadow: `0 0 7px ${T.opn}`,
      flexShrink: 0
    }
  }), React.createElement("span", {
    style: {
      fontFamily: T.mono,
      fontSize: 10,
      color: T.textMid,
      letterSpacing: 1.5,
      fontWeight: 700
    }
  }, "OPN", React.createElement("span", {
    style: {
      color: T.opn
    }
  }, "ORANGE")), !isMobile && React.createElement("span", {
    style: {
      fontFamily: T.mono,
      fontSize: 10,
      color: T.textDim,
      letterSpacing: 1.5
    }
  }, "\xB7 ", t("umbrella.label"))), React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 9,
      flexShrink: 0
    }
  }, !isMobile && React.createElement("span", {
    style: {
      fontFamily: T.mono,
      fontSize: 10,
      color: T.opn,
      fontWeight: 700,
      letterSpacing: 0.5
    }
  }, t("umbrella.privacy")), !isMobile && React.createElement("span", {
    style: {
      color: T.borderLo
    }
  }, "\xB7"), React.createElement("a", {
    href: "https://dcabutler.com",
    target: "_blank",
    rel: "noopener noreferrer",
    style: {
      fontFamily: T.mono,
      fontSize: 10,
      color: T.textMid,
      textDecoration: "none",
      letterSpacing: 0.5,
      transition: "color .15s"
    },
    onMouseOver: e => e.currentTarget.style.color = T.opn,
    onMouseOut: e => e.currentTarget.style.color = T.textMid
  }, t("umbrella.dca"), " \u2197"), React.createElement("span", {
    style: {
      color: T.borderLo
    }
  }, "\xB7"), React.createElement("a", {
    href: "https://opnorange.com",
    target: "_blank",
    rel: "noopener noreferrer",
    style: {
      fontFamily: T.mono,
      fontSize: 10,
      color: T.textMid,
      textDecoration: "none",
      letterSpacing: 0.5,
      transition: "color .15s"
    },
    onMouseOver: e => e.currentTarget.style.color = T.opn,
    onMouseOut: e => e.currentTarget.style.color = T.textMid
  }, t("umbrella.hub"), " \u2197"))), React.createElement("div", {
    role: "main",
    "aria-label": "AnonScore \u2014 Bitcoin & Lightning privacy audit",
    style: {
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      background: T.bg
    }
  }, React.createElement("nav", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: isMobile ? "14px 20px" : "14px 48px",
      borderBottom: `1px solid ${T.border}`,
      background: T.bg,
      position: "sticky",
      top: 0,
      zIndex: 100
    }
  }, React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, React.createElement("span", {
    style: {
      color: T.btc,
      fontFamily: T.mono,
      fontSize: 14,
      lineHeight: 1,
      textShadow: `0 0 14px ${T.btc}77`
    }
  }, "\u20BF"), React.createElement("span", {
    style: {
      fontFamily: T.display,
      fontWeight: 700,
      fontSize: 15,
      letterSpacing: 4,
      color: T.text,
      textTransform: "uppercase"
    }
  }, "ANON", React.createElement("span", {
    style: {
      color: T.cyan,
      textShadow: `0 0 14px ${T.cyan}55`
    }
  }, "SCORE"))), React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      alignItems: "center",
      flexWrap: "wrap",
      justifyContent: "flex-end"
    }
  }, !isMobile && React.createElement(React.Fragment, null, React.createElement("span", {
    style: {
      fontFamily: T.mono,
      fontSize: 10,
      color: T.textDim
    }
  }, t("nav.nocookies")), React.createElement("span", {
    style: {
      color: T.borderLo
    }
  }, "\xB7"), React.createElement("span", {
    style: {
      fontFamily: T.mono,
      fontSize: 10,
      color: T.textDim
    }
  }, t("nav.nothingstored")), React.createElement("span", {
    style: {
      color: T.borderLo
    }
  }, "\xB7"), React.createElement("span", {
    style: {
      fontFamily: T.mono,
      fontSize: 10,
      color: T.textDim
    }
  }, t("nav.tor")), React.createElement("span", {
    style: {
      color: T.borderLo
    }
  }, "\xB7"), React.createElement("span", {
    style: {
      fontFamily: T.mono,
      fontSize: 10,
      color: T.textDim
    }
  }, t("nav.opensource")), React.createElement("span", {
    style: {
      color: T.borderLo,
      margin: "0 4px"
    }
  }, "|")), React.createElement("a", {
    href: "https://github.com/netasset/anonscore",
    target: "_blank",
    rel: "noopener noreferrer",
    style: {
      display: "flex",
      alignItems: "center",
      gap: 5,
      padding: "5px 10px",
      background: T.surface,
      border: `1px solid ${T.border}`,
      borderRadius: 7,
      color: T.textMid,
      textDecoration: "none",
      fontSize: 11,
      fontFamily: T.mono,
      transition: "border-color .15s"
    },
    onMouseOver: e => e.currentTarget.style.borderColor = T.cyan,
    onMouseOut: e => e.currentTarget.style.borderColor = T.border
  }, "GitHub \u2197"), React.createElement(Tag, {
    label: t("nav.free"),
    color: T.green,
    size: 10
  }), React.createElement(LangSwitcher, null))), React.createElement("div", {
    style: {
      background: T.surface,
      borderBottom: `1px solid ${T.border}`,
      borderTop: `2px solid ${T.btc}`,
      overflowX: "auto",
      WebkitOverflowScrolling: "touch",
      scrollbarWidth: "none"
    }
  }, React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 0,
      minWidth: "max-content",
      padding: "0 20px"
    }
  }, React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6,
      padding: "9px 14px 9px 0",
      borderRight: `1px solid ${T.border}`,
      marginRight: 14,
      flexShrink: 0
    }
  }, React.createElement("span", {
    style: {
      fontFamily: T.mono,
      fontSize: 9,
      color: T.btc,
      letterSpacing: 2,
      fontWeight: 700
    }
  }, "\uD83D\uDCC1 CASE FILES")), CASE_FILES.map((c, i) => {
    const cat = CATEGORY_META[c.category];
    return React.createElement("button", {
      key: c.id,
      onClick: () => onCases(c),
      style: {
        display: "flex",
        alignItems: "center",
        gap: 7,
        padding: "9px 14px",
        background: "transparent",
        border: "none",
        borderRight: `1px solid ${T.borderLo}`,
        color: T.textMid,
        fontFamily: T.sans,
        fontSize: 12,
        cursor: "pointer",
        whiteSpace: "nowrap",
        transition: "all .15s",
        flexShrink: 0
      },
      onMouseEnter: e => {
        e.currentTarget.style.background = T.card;
        e.currentTarget.style.color = T.text;
      },
      onMouseLeave: e => {
        e.currentTarget.style.background = "transparent";
        e.currentTarget.style.color = T.textMid;
      }
    }, React.createElement("span", {
      style: {
        fontFamily: T.mono,
        fontSize: 9,
        color: cat.color,
        fontWeight: 700
      }
    }, "#", c.id), c.title);
  }), React.createElement("button", {
    onClick: () => onCases(null),
    style: {
      display: "flex",
      alignItems: "center",
      gap: 5,
      padding: "9px 16px",
      background: "transparent",
      border: "none",
      color: T.btc,
      fontFamily: T.mono,
      fontSize: 9,
      cursor: "pointer",
      letterSpacing: 1,
      whiteSpace: "nowrap",
      flexShrink: 0,
      transition: "color .15s",
      fontWeight: 700
    },
    onMouseEnter: e => e.currentTarget.style.color = T.text,
    onMouseLeave: e => e.currentTarget.style.color = T.btc
  }, "VIEW ALL \u2192"))), React.createElement("div", {
    ref: heroRef,
    style: {
      position: "relative",
      overflow: "hidden"
    }
  }, React.createElement(ParticleCanvas, {
    color: T.cyan
  }), React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      zIndex: 0,
      background: "radial-gradient(360px circle at var(--mx,50%) var(--my,26%), #22D3EE14, transparent 60%)"
    }
  }), React.createElement("div", {
    style: {
      position: "absolute",
      top: "10%",
      left: "-10%",
      width: 520,
      height: 520,
      borderRadius: "50%",
      background: "radial-gradient(circle,#22D3EE18 0%,transparent 70%)",
      animation: "orb 8s ease-in-out infinite",
      pointerEvents: "none",
      filter: "blur(2px)"
    }
  }), React.createElement("div", {
    className: "aurora",
    style: {
      top: "-10%",
      right: "-12%",
      width: 460,
      height: 460,
      background: "radial-gradient(circle,#F7931A16 0%,transparent 70%)",
      animationDelay: "-8s"
    }
  }), React.createElement("div", {
    className: "aurora",
    style: {
      bottom: "-24%",
      left: "32%",
      width: 400,
      height: 400,
      background: "radial-gradient(circle,#22D3EE12 0%,transparent 70%)",
      animationDelay: "-15s"
    }
  }), React.createElement("div", {
    className: "scan-ov"
  }), React.createElement("section", {
    style: {
      position: "relative",
      padding: isMobile ? "34px 20px 40px" : "50px 48px 56px",
      maxWidth: 860,
      margin: "0 auto",
      width: "100%",
      textAlign: "center"
    }
  }, React.createElement("div", {
    style: {
      fontFamily: T.mono,
      fontSize: 10,
      letterSpacing: 2.5,
      marginBottom: 14,
      animation: "fadeUp .5s ease both",
      display: "flex",
      gap: 8,
      alignItems: "center",
      justifyContent: "center"
    }
  }, React.createElement("span", {
    style: {
      color: T.btc
    }
  }, "\u20BF"), React.createElement("span", {
    style: {
      color: T.cyan
    }
  }, t("hero.eyebrow"))), React.createElement("h1", {
    style: {
      fontFamily: T.serif,
      fontSize: isMobile ? 38 : 56,
      lineHeight: 1.06,
      color: T.text,
      marginBottom: 20,
      animation: "fadeUp .5s ease .08s both",
      fontWeight: 400
    }
  }, t("hero.h1.line1"), React.createElement("br", null), t("hero.h1.line2"), React.createElement("br", null), React.createElement("em", {
    className: "accent-glow",
    style: {
      color: T.cyan,
      fontStyle: "italic"
    }
  }, t("hero.h1.em"))), React.createElement("p", {
    style: {
      fontSize: isMobile ? 15 : 18,
      color: T.textMid,
      lineHeight: 1.6,
      fontWeight: 300,
      animation: "fadeUp .5s ease .14s both",
      maxWidth: 560,
      margin: "0 auto 20px"
    }
  }, t("hero.sub")), !isLn && React.createElement("div", {
    style: {
      maxWidth: 480,
      margin: "0 auto 16px",
      animation: "fadeUp .5s ease .16s both"
    }
  }, React.createElement("div", {
    style: {
      position: "relative",
      height: 6,
      borderRadius: 6,
      background: `linear-gradient(90deg, ${T.red} 0%, ${T.btc} 40%, ${T.amber} 60%, ${T.green} 100%)`,
      marginBottom: 6
    }
  }, React.createElement("div", {
    style: {
      position: "absolute",
      top: "50%",
      left: "38%",
      transform: "translate(-50%,-50%)",
      width: 12,
      height: 12,
      borderRadius: "50%",
      background: T.bg,
      border: `2px solid ${T.btc}`,
      boxShadow: `0 0 8px ${T.btc}`,
      animation: "dotPulse 2.4s ease-out infinite"
    }
  })), React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between"
    }
  }, React.createElement("span", {
    style: {
      fontFamily: T.mono,
      fontSize: 9,
      color: T.red
    }
  }, t("spectrum.low")), React.createElement("span", {
    style: {
      fontFamily: T.mono,
      fontSize: 9,
      color: T.btc
    }
  }, t("spectrum.avg")), React.createElement("span", {
    style: {
      fontFamily: T.mono,
      fontSize: 9,
      color: T.green
    }
  }, t("spectrum.high")))), React.createElement("div", {
    style: {
      maxWidth: 480,
      margin: "0 auto 12px",
      animation: "fadeUp .5s ease .20s both",
      background: T.surface,
      border: `1px solid ${isLn ? T.ln + "44" : T.border}`,
      borderRadius: 10,
      padding: "10px 14px",
      fontFamily: T.sans,
      fontSize: 12,
      color: T.textMid,
      lineHeight: 1.5,
      textAlign: "left",
      transition: "border-color .2s"
    }
  }, isLn ? t("trust.ln") : t("trust.btc")), history.length > 0 && React.createElement("div", {
    style: {
      maxWidth: 480,
      margin: "0 auto 12px",
      animation: "fadeUp .5s ease .21s both"
    }
  }, React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 6
    }
  }, React.createElement("div", {
    style: {
      fontFamily: T.mono,
      fontSize: 8,
      color: T.textDim,
      letterSpacing: 1.5
    }
  }, t("recent.title")), history.length >= 2 && React.createElement(Sparkline, {
    history: history.map(h => h.score),
    width: 64,
    height: 22
  })), React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 4
    }
  }, history.map((h, i) => {
    const col = scoreColor(h.score);
    return React.createElement("div", {
      key: i,
      style: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        background: T.surface,
        border: `1px solid ${T.border}`,
        borderRadius: 8,
        padding: "8px 12px",
        transition: "border-color .15s"
      },
      onMouseOver: e => e.currentTarget.style.borderColor = col,
      onMouseOut: e => e.currentTarget.style.borderColor = T.border
    }, React.createElement("button", {
      onClick: () => onAnalyze(h.addr, false, h.isLightning ? "ln_pubkey" : "btc"),
      style: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        flex: 1,
        background: "none",
        border: "none",
        cursor: "pointer",
        textAlign: "left",
        minWidth: 0
      }
    }, React.createElement("div", {
      style: {
        width: 6,
        height: 6,
        borderRadius: "50%",
        background: col,
        flexShrink: 0
      }
    }), React.createElement("div", {
      style: {
        fontFamily: T.mono,
        fontSize: 10,
        color: T.textDim,
        flex: 1,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
      }
    }, h.isLightning ? "⚡ " : "₿ ", h.addr === "DEMO" || h.addr === "DEMO_A" || h.addr === "DEMO_LN" ? "Demo" : h.addr.slice(0, 14) + "…"), React.createElement("div", {
      style: {
        fontFamily: T.serif,
        fontSize: 14,
        color: col,
        flexShrink: 0
      }
    }, h.grade), React.createElement("div", {
      style: {
        fontFamily: T.mono,
        fontSize: 9,
        color: T.textDim,
        flexShrink: 0
      }
    }, h.score, "/100"), React.createElement("div", {
      style: {
        fontFamily: T.mono,
        fontSize: 8,
        color: T.textDim,
        flexShrink: 0
      }
    }, "\u21BA")), React.createElement("button", {
      onClick: () => deleteHistory(h.addr),
      style: {
        background: "none",
        border: "none",
        color: T.textDim,
        fontSize: 12,
        cursor: "pointer",
        padding: "0 2px",
        flexShrink: 0,
        lineHeight: 1
      },
      onMouseOver: e => e.currentTarget.style.color = T.red,
      onMouseOut: e => e.currentTarget.style.color = T.textDim
    }, "\u2715"));
  }))), React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 10,
      maxWidth: 480,
      margin: "0 auto",
      animation: "fadeUp .5s ease .22s both, breathe 5s ease-in-out 1.2s infinite",
      background: T.card,
      border: `1px solid ${T.cyan}33`,
      borderRadius: 16,
      padding: isMobile ? "16px" : "20px 22px",
      boxShadow: `0 0 50px -14px ${T.cyan}40`
    }
  }, React.createElement("div", null, inputType && React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6,
      marginBottom: 8,
      animation: "slideDown .2s ease both"
    }
  }, React.createElement("div", {
    style: {
      width: 6,
      height: 6,
      borderRadius: "50%",
      background: isLn ? T.ln : T.btc,
      boxShadow: `0 0 6px ${isLn ? T.ln : T.btc}`
    }
  }), React.createElement("span", {
    style: {
      fontFamily: T.mono,
      fontSize: 10,
      color: isLn ? T.ln : T.btc
    }
  }, inputType === "ln_pubkey" ? "⚡ Lightning node pubkey detected" : inputType === "ln_address" ? "⚡ Lightning address — paste your node's pubkey instead" : "₿ Bitcoin address detected")), React.createElement("div", {
    style: {
      display: "flex",
      gap: 8
    }
  }, isMobile && React.createElement("button", {
    onClick: async () => {
      try {
        const t = await navigator.clipboard.readText();
        setInput(t.trim());
        setError("");
      } catch {}
    },
    style: {
      background: T.surface,
      border: `1.5px solid ${T.border}`,
      borderRadius: 10,
      padding: "13px 14px",
      color: T.textMid,
      fontSize: 16,
      cursor: "pointer",
      flexShrink: 0
    },
    title: "Paste"
  }, "\uD83D\uDCCB"), React.createElement("input", {
    ref: inputRef,
    value: input,
    onChange: e => {
      setInput(e.target.value);
      setError("");
    },
    onKeyDown: e => e.key === "Enter" && submit(null, true),
    placeholder: isLn ? "03abc… (66-char node pubkey)" : "bc1q… or 1… or 3…  ·  or Lightning 03…",
    style: {
      flex: 1,
      background: T.bg,
      border: `1.5px solid ${error ? T.red : inputType ? isLn ? T.ln : T.btc : T.cyan + "55"}`,
      borderRadius: 10,
      padding: "13px 16px",
      color: T.text,
      fontFamily: T.mono,
      fontSize: 13,
      outline: "none",
      transition: "border .18s, box-shadow .25s",
      boxShadow: "0 0 0 0 transparent",
      minWidth: 0
    },
    onFocus: e => {
      const c = isLn ? T.ln : T.cyan;
      e.target.style.borderColor = c;
      e.target.style.boxShadow = `0 0 0 4px ${c}22, 0 0 18px ${c}55`;
    },
    onBlur: e => {
      e.target.style.borderColor = error ? T.red : inputType ? isLn ? T.ln : T.btc : T.cyan + "55";
      e.target.style.boxShadow = "0 0 0 0 transparent";
    }
  }), React.createElement("button", {
    onClick: () => submit(null, !isLn),
    className: "sheen",
    style: {
      background: isLn ? T.ln : T.btc,
      border: "none",
      borderRadius: 10,
      padding: "13px 20px",
      color: T.bg,
      fontFamily: T.sans,
      fontWeight: 700,
      fontSize: 14,
      cursor: "pointer",
      whiteSpace: "nowrap",
      transition: "all .15s"
    },
    onMouseOver: e => e.currentTarget.style.opacity = ".88",
    onMouseOut: e => e.currentTarget.style.opacity = "1"
  }, isLn ? t("cta.audit") : t("cta.analyze"))), isLn && React.createElement("div", {
    style: {
      fontFamily: T.mono,
      fontSize: 10,
      color: T.textDim,
      marginTop: 5,
      textAlign: "left"
    }
  }, "\u26A1 Node pubkeys only work if you run your own node \u2014 Umbrel, Start9, Citadel, RaspiBlitz, etc."), error && React.createElement("div", {
    style: {
      fontSize: 12,
      color: T.red,
      marginTop: 6,
      animation: "slideDown .2s ease"
    }
  }, "\u26A0 ", error)), React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10
    }
  }, React.createElement("div", {
    style: {
      flex: 1,
      height: 1,
      background: T.borderLo
    }
  }), React.createElement("span", {
    style: {
      fontFamily: T.mono,
      fontSize: 10,
      color: T.textDim
    }
  }, t("sample.divider")), React.createElement("div", {
    style: {
      flex: 1,
      height: 1,
      background: T.borderLo
    }
  })), React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      flexWrap: "wrap"
    }
  }, [{
    addr: "DEMO",
    label: t("sample.risky"),
    color: T.btc,
    type: "btc"
  }, {
    addr: "DEMO_A",
    label: t("sample.pristine"),
    color: T.green,
    type: "btc"
  }, {
    addr: "DEMO_LN",
    label: t("sample.lightning"),
    color: T.ln,
    type: "ln_pubkey"
  }].map(s => React.createElement("button", {
    key: s.addr,
    onClick: () => onAnalyze(s.addr, false, s.type),
    style: {
      flex: "1 1 30%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      background: T.surface,
      border: `1.5px solid ${T.border}`,
      borderRadius: 12,
      padding: "11px 14px",
      color: T.textMid,
      fontFamily: T.sans,
      fontSize: 13,
      fontWeight: 600,
      cursor: "pointer",
      transition: "border-color .18s, color .18s"
    },
    onMouseOver: e => {
      e.currentTarget.style.borderColor = s.color;
      e.currentTarget.style.color = s.color;
    },
    onMouseOut: e => {
      e.currentTarget.style.borderColor = T.border;
      e.currentTarget.style.color = T.textMid;
    }
  }, s.label))), React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 6
    }
  }, React.createElement("a", {
    href: "https://github.com/netasset/anonscore",
    target: "_blank",
    rel: "noopener noreferrer",
    style: {
      fontFamily: T.mono,
      fontSize: 10,
      color: T.cyan,
      textDecoration: "none"
    }
  }, "Open source \u2197"))))), React.createElement("div", {
    className: "reveal",
    style: {
      borderTop: `1px solid ${T.border}`,
      borderBottom: `1px solid ${T.border}`,
      background: T.surface,
      padding: isMobile ? "28px 20px" : "32px 48px"
    }
  }, React.createElement("div", {
    style: {
      maxWidth: 860,
      margin: "0 auto"
    }
  }, React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
      gap: isMobile ? 20 : 0
    }
  }, [{
    n: "01",
    icon: "📋",
    title: "Paste an address or pubkey",
    desc: "Bitcoin address (bc1…, 1…, 3…) or Lightning node pubkey (66-char hex). No account, no email, nothing saved."
  }, {
    n: "02",
    icon: "🔍",
    title: "We run the checks",
    desc: "Bitcoin: 10 on-chain heuristics. Lightning: 8 node privacy checks. Same patterns surveillance firms use — runs in your browser."
  }, {
    n: "03",
    icon: "🎯",
    title: "Score + fix plan",
    desc: "A score from 0–100, every issue explained, fixes ranked by impact. Bitcoin scan also has a 💬 Plain English mode."
  }].map((s, i) => React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      gap: 14,
      alignItems: "flex-start",
      padding: isMobile ? 0 : "0 28px",
      borderLeft: !isMobile && i > 0 ? `1px solid ${T.border}` : "none"
    }
  }, React.createElement("div", {
    style: {
      fontSize: 22,
      flexShrink: 0,
      marginTop: 2
    }
  }, s.icon), React.createElement("div", null, React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      marginBottom: 4
    }
  }, React.createElement("span", {
    style: {
      fontFamily: T.mono,
      fontSize: 9,
      color: T.cyan
    }
  }, s.n), React.createElement("span", {
    style: {
      fontSize: 14,
      fontWeight: 600,
      color: T.text
    }
  }, s.title)), React.createElement("div", {
    style: {
      fontSize: 13,
      color: T.textMid,
      lineHeight: 1.6
    }
  }, s.desc))))))), !isMobile && React.createElement("div", {
    style: {
      padding: "48px 48px 0",
      maxWidth: 860,
      margin: "0 auto",
      width: "100%"
    }
  }, React.createElement("div", {
    style: {
      fontFamily: T.mono,
      fontSize: 9,
      color: T.textDim,
      letterSpacing: 2,
      marginBottom: 14,
      textAlign: "center"
    }
  }, "LIVE EXAMPLE \u2014 WHAT YOUR RESULTS LOOK LIKE"), React.createElement(DemoPreview, null)), isMobile && React.createElement("div", {
    style: {
      padding: "32px 20px 0"
    }
  }, React.createElement("div", {
    style: {
      fontFamily: T.mono,
      fontSize: 9,
      color: T.textDim,
      letterSpacing: 2,
      marginBottom: 14,
      textAlign: "center"
    }
  }, "EXAMPLE SCORES"), React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      overflowX: "auto",
      paddingBottom: 8,
      scrollbarWidth: "none"
    }
  }, DEMO_EXAMPLES.map((ex, i) => React.createElement("div", {
    key: i,
    onClick: () => onAnalyze("DEMO", false, "btc"),
    style: {
      flexShrink: 0,
      background: T.card,
      border: `1px solid ${ex.color}33`,
      borderRadius: 14,
      padding: "16px 18px",
      cursor: "pointer",
      minWidth: 140
    }
  }, React.createElement("div", {
    style: {
      height: 2,
      background: `linear-gradient(90deg,transparent,${ex.color},transparent)`,
      margin: "0 -18px 12px",
      marginTop: -16,
      borderRadius: "14px 14px 0 0"
    }
  }), React.createElement("div", {
    style: {
      fontFamily: T.serif,
      fontSize: 38,
      color: ex.color,
      lineHeight: 1
    }
  }, ex.grade), React.createElement("div", {
    style: {
      fontFamily: T.mono,
      fontSize: 10,
      color: ex.color,
      marginTop: 2
    }
  }, ex.label), React.createElement("div", {
    style: {
      fontFamily: T.mono,
      fontSize: 16,
      color: T.text,
      marginTop: 6,
      fontWeight: 600
    }
  }, ex.score, React.createElement("span", {
    style: {
      fontSize: 9,
      color: T.textDim
    }
  }, "/100")), React.createElement("div", {
    style: {
      fontFamily: T.mono,
      fontSize: 8,
      color: T.textDim,
      marginTop: 8
    }
  }, ex.issues[0])))), React.createElement("div", {
    style: {
      fontFamily: T.mono,
      fontSize: 9,
      color: T.textDim,
      textAlign: "center",
      marginTop: 8
    }
  }, "tap to try the demo \u2192")), React.createElement(Divider, null), React.createElement("section", {
    className: "reveal",
    style: {
      background: T.surface,
      padding: isMobile ? "48px 20px" : "64px 48px",
      position: "relative",
      overflow: "hidden"
    }
  }, React.createElement("div", {
    className: "dot-grid",
    style: {
      position: "absolute",
      inset: 0,
      opacity: .4,
      pointerEvents: "none"
    }
  }), React.createElement("div", {
    style: {
      maxWidth: 900,
      margin: "0 auto",
      position: "relative"
    }
  }, React.createElement("div", {
    style: {
      fontFamily: T.mono,
      fontSize: 10,
      color: T.textDim,
      letterSpacing: 2.5,
      textAlign: "center",
      marginBottom: 36
    }
  }, "BY THE NUMBERS"), React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)",
      gap: 16
    }
  }, LANDING_FACTS.map((f, i) => {
    const barColors = [T.red, T.btc, T.btc, T.btc];
    const barWidths = [88, 91, 33, 38];
    const col = barColors[i];
    return React.createElement("div", {
      key: i,
      style: {
        background: T.card,
        border: `1px solid ${T.border}`,
        borderRadius: 14,
        padding: "22px 18px",
        animation: `fadeUp .4s ease ${i * .07}s both`,
        position: "relative",
        overflow: "hidden",
        transition: "transform .13s ease-out, border-color .2s, box-shadow .25s"
      },
      onMouseMove: tiltMove,
      onMouseEnter: e => {
        e.currentTarget.style.borderColor = col + "66";
        e.currentTarget.style.boxShadow = `0 14px 36px -16px ${col}`;
      },
      onMouseLeave: e => {
        tiltReset(e);
        e.currentTarget.style.borderColor = T.border;
        e.currentTarget.style.boxShadow = "none";
      }
    }, React.createElement("div", {
      style: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        background: col,
        opacity: .7
      }
    }), React.createElement("div", {
      style: {
        fontFamily: T.serif,
        fontSize: isMobile ? 30 : 36,
        color: col,
        lineHeight: 1,
        marginBottom: 10
      }
    }, React.createElement(CountUp, {
      value: f.stat
    })), React.createElement("div", {
      style: {
        fontSize: 13,
        color: T.textMid,
        lineHeight: 1.55,
        marginBottom: 12
      }
    }, f.desc), React.createElement("div", {
      style: {
        height: 3,
        background: T.surface,
        borderRadius: 4,
        marginBottom: 8,
        overflow: "hidden"
      }
    }, React.createElement("div", {
      style: {
        height: "100%",
        width: `${barWidths[i]}%`,
        background: col,
        borderRadius: 4,
        opacity: .6
      }
    })), React.createElement("div", {
      style: {
        fontFamily: T.mono,
        fontSize: 9,
        color: T.textDim,
        letterSpacing: .5
      }
    }, f.url ? React.createElement("a", {
      href: f.url,
      target: "_blank",
      rel: "noopener noreferrer",
      style: {
        color: T.textDim,
        textDecoration: "none"
      },
      onMouseOver: e => e.currentTarget.style.color = T.cyan,
      onMouseOut: e => e.currentTarget.style.color = T.textDim
    }, "Source: ", f.source, " \u2197") : `Source: ${f.source}`));
  })))), React.createElement(Divider, null), React.createElement("section", {
    className: "reveal",
    style: {
      background: T.surface,
      padding: isMobile ? "56px 20px" : "72px 48px"
    }
  }, React.createElement("div", {
    style: {
      maxWidth: 1000,
      margin: "0 auto"
    }
  }, React.createElement(ChecksSection, {
    isMobile: isMobile
  }))), React.createElement(Divider, null), React.createElement("section", {
    className: "reveal",
    style: {
      padding: isMobile ? "56px 20px" : "72px 48px",
      position: "relative",
      overflow: "hidden"
    }
  }, React.createElement("div", {
    className: "dot-grid",
    style: {
      position: "absolute",
      inset: 0,
      opacity: .3,
      pointerEvents: "none"
    }
  }), React.createElement("div", {
    style: {
      maxWidth: 700,
      margin: "0 auto",
      textAlign: "center",
      position: "relative",
      background: "rgba(19,21,31,0.55)",
      backdropFilter: "blur(14px)",
      WebkitBackdropFilter: "blur(14px)",
      border: `1px solid ${T.cyan}26`,
      borderRadius: 16,
      boxShadow: `0 0 40px ${T.cyan}14`,
      padding: isMobile ? "32px 22px" : "44px 40px"
    }
  }, React.createElement("h2", {
    style: {
      fontFamily: T.serif,
      fontSize: isMobile ? 28 : 40,
      color: T.text,
      marginBottom: 14,
      fontWeight: 400
    }
  }, t("finalcta.h2.a"), React.createElement("br", null), React.createElement("em", {
    style: {
      color: T.cyan
    }
  }, t("finalcta.h2.b"))), React.createElement("p", {
    style: {
      fontSize: isMobile ? 14 : 16,
      color: T.textMid,
      lineHeight: 1.7,
      maxWidth: 480,
      margin: "0 auto 32px",
      fontWeight: 300
    }
  }, t("finalcta.sub")), React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      gap: 10,
      justifyContent: "center"
    }
  }, React.createElement("button", {
    onClick: () => {
      inputRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
      setTimeout(() => inputRef.current?.focus(), 300);
    },
    className: "sheen",
    style: {
      background: T.cyan,
      border: "none",
      borderRadius: 12,
      padding: "15px 28px",
      color: T.bg,
      fontFamily: T.sans,
      fontSize: 15,
      fontWeight: 700,
      cursor: "pointer",
      transition: "all .18s",
      boxShadow: `0 4px 24px ${T.cyanMid}`
    },
    onMouseMove: e => {
      const r = e.currentTarget.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
      const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
      e.currentTarget.style.transform = `translate(${dx * 9}px, ${dy * 9}px)`;
      e.currentTarget.style.opacity = ".92";
    },
    onMouseLeave: e => {
      e.currentTarget.style.transform = "translate(0,0)";
      e.currentTarget.style.opacity = "1";
    }
  }, t("finalcta.scan")), React.createElement("button", {
    onClick: () => onAnalyze("DEMO", false, "btc"),
    style: {
      background: "transparent",
      border: `1.5px solid ${T.border}`,
      borderRadius: 12,
      padding: "15px 28px",
      color: T.textMid,
      fontFamily: T.sans,
      fontSize: 15,
      fontWeight: 500,
      cursor: "pointer",
      transition: "all .18s"
    },
    onMouseOver: e => {
      e.currentTarget.style.borderColor = T.cyan;
      e.currentTarget.style.color = T.cyan;
    },
    onMouseOut: e => {
      e.currentTarget.style.borderColor = T.border;
      e.currentTarget.style.color = T.textMid;
    }
  }, t("finalcta.sample"))))), React.createElement("div", {
    className: "reveal",
    style: {
      borderTop: `1px solid ${T.border}`,
      background: T.surface,
      padding: isMobile ? "32px 20px" : "44px 48px"
    }
  }, React.createElement("div", {
    style: {
      maxWidth: 520,
      margin: "0 auto"
    }
  }, React.createElement(NewsletterSignup, null))), React.createElement("div", {
    style: {
      borderTop: `1px solid ${T.border}`,
      padding: isMobile ? "18px 20px" : "16px 48px",
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 14
    }
  }, React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 14,
      flexWrap: "wrap"
    }
  }, React.createElement("span", {
    style: {
      fontFamily: T.display,
      fontSize: 10,
      color: T.textDim,
      letterSpacing: 3
    }
  }, "ANONSCORE \xB7 MIT"), React.createElement("a", {
    href: "https://github.com/netasset/anonscore",
    target: "_blank",
    rel: "noopener noreferrer",
    style: {
      fontFamily: T.mono,
      fontSize: 10,
      color: T.cyan,
      textDecoration: "none"
    }
  }, "GitHub \u2197"), React.createElement("button", {
    onClick: () => setShowFunding(true),
    style: {
      background: "transparent",
      border: "none",
      padding: 0,
      fontFamily: T.mono,
      fontSize: 10,
      color: T.textMid,
      cursor: "pointer",
      textDecoration: "underline dotted",
      textUnderlineOffset: 3
    },
    onMouseOver: e => e.currentTarget.style.color = T.cyan,
    onMouseOut: e => e.currentTarget.style.color = T.textMid
  }, "How we're paid for"), React.createElement("a", {
    href: "/?page=wallets",
    style: {
      fontFamily: T.mono,
      fontSize: 10,
      color: T.textMid,
      textDecoration: "underline dotted",
      textUnderlineOffset: 3,
      transition: "color .15s"
    },
    onMouseOver: e => e.currentTarget.style.color = T.btc,
    onMouseOut: e => e.currentTarget.style.color = T.textMid
  }, "Wallet directory")), React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      flexWrap: "wrap"
    }
  }, (FUNDING.lightning || FUNDING.nostr) && React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8
    }
  }, FUNDING.lightning && React.createElement("button", {
    onClick: () => copyTip("⚡", FUNDING.lightning),
    title: `Lightning: ${FUNDING.lightning} — click to copy`,
    style: {
      background: "transparent",
      border: `1px solid ${T.ln}55`,
      borderRadius: 6,
      padding: "3px 8px",
      fontFamily: T.mono,
      fontSize: 10,
      color: T.ln,
      cursor: "pointer",
      letterSpacing: 0.5
    }
  }, tipCopied === "⚡" ? "⚡ Copied!" : "⚡ Tip"), FUNDING.nostr && React.createElement("button", {
    onClick: () => copyTip("nostr", FUNDING.nostr),
    title: `Nostr: ${FUNDING.nostr} — click to copy`,
    style: {
      background: "transparent",
      border: `1px solid ${T.cyan}55`,
      borderRadius: 6,
      padding: "3px 8px",
      fontFamily: T.mono,
      fontSize: 10,
      color: T.cyan,
      cursor: "pointer",
      letterSpacing: 0.5
    }
  }, tipCopied === "nostr" ? "Copied!" : "Zap on Nostr")), React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      flexWrap: "wrap"
    }
  }, React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: "50%",
      background: T.opn,
      boxShadow: `0 0 6px ${T.opn}`,
      flexShrink: 0
    }
  }), React.createElement("span", {
    style: {
      fontFamily: T.mono,
      fontSize: 10,
      color: T.opn,
      letterSpacing: 0.5,
      fontWeight: 700
    }
  }, t("umbrella.privacy")), React.createElement("span", {
    style: {
      color: T.borderLo
    }
  }, "\xB7"), React.createElement("a", {
    href: "https://dcabutler.com",
    target: "_blank",
    rel: "noopener noreferrer",
    style: {
      fontFamily: T.mono,
      fontSize: 10,
      color: T.textDim,
      textDecoration: "none",
      transition: "color .15s"
    },
    onMouseOver: e => e.currentTarget.style.color = T.opn,
    onMouseOut: e => e.currentTarget.style.color = T.textDim
  }, t("umbrella.dca"), " \u2197"), React.createElement("span", {
    style: {
      color: T.borderLo
    }
  }, "\xB7"), React.createElement("a", {
    href: "https://opnorange.com",
    target: "_blank",
    rel: "noopener noreferrer",
    style: {
      fontFamily: T.mono,
      fontSize: 10,
      color: T.textDim,
      textDecoration: "none",
      transition: "color .15s"
    },
    onMouseOver: e => e.currentTarget.style.color = T.opn,
    onMouseOut: e => e.currentTarget.style.color = T.textDim
  }, t("umbrella.hub"), " \u2197")))), showFunding && React.createElement(FundingDisclosure, {
    onClose: () => setShowFunding(false)
  })));
}
function Scanning({
  address,
  isLightning,
  dataReady
}) {
  useLang();
  const [step, setStep] = useState(0);
  const intervalRef = useRef(null);
  const LN_STEPS = [{
    label: "Resolving node pubkey…",
    fact: "Lightning node pubkeys are permanently public once announced to the gossip network."
  }, {
    label: "Fetching node metadata…",
    fact: "Your node alias, IP address, and connection info are visible to every peer on the network."
  }, {
    label: "Loading open channels…",
    fact: "Every channel open and close is recorded on-chain — permanently linking your Lightning and on-chain identities."
  }, {
    label: "Identifying peer nodes…",
    fact: "KYC exchanges operate Lightning nodes that log routing metadata for all channels they peer with."
  }, {
    label: "Checking IP / Tor exposure…",
    fact: "A clearnet Lightning node leaks your physical location and ISP to every peer you connect to."
  }, {
    label: "Analysing channel diversity…",
    fact: "Nodes with few channels are easier to surveil — payment paths are predictable and limited."
  }, {
    label: "Scoring capacity concentration…",
    fact: "If 80%+ of your capacity sits in one channel, your routing patterns are trivially predictable."
  }, {
    label: "Checking alias privacy…",
    fact: "Your node alias is broadcast to the entire network — using a real name links your identity to every channel."
  }, {
    label: "Calculating privacy score…",
    fact: "Score 0 = fully deanonymisable. Score 100 = anonymous-by-default node operation."
  }];
  const steps = isLightning ? LN_STEPS : SCAN_STEPS;
  const accentColor = isLightning ? T.ln : T.cyan;
  const accentMid = isLightning ? T.lnMid : T.cyanMid;
  const holdStep = Math.floor(steps.length * 0.85);
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setStep(s => {
        if (s >= holdStep && !dataReady) return s;
        return Math.min(s + 1, steps.length - 1);
      });
    }, 380);
    return () => clearInterval(intervalRef.current);
  }, [steps.length, holdStep, dataReady]);
  useEffect(() => {
    if (dataReady) setStep(steps.length - 1);
  }, [dataReady, steps.length]);
  const pct = Math.round(step / (steps.length - 1) * 100);
  const currentFact = steps[step].fact;
  const meshNodes = useMemo(() => {
    const cx = 90,
      cy = 60,
      r = 44;
    const pts = Array.from({
      length: 6
    }).map((_, i) => {
      const a = Math.PI * 2 * i / 6 - Math.PI / 2;
      return {
        x: cx + r * Math.cos(a),
        y: cy + r * Math.sin(a)
      };
    });
    return {
      cx,
      cy,
      pts
    };
  }, []);
  return React.createElement("div", {
    role: "main",
    "aria-live": "polite",
    "aria-label": isLightning ? "Auditing Lightning node" : "Analyzing wallet",
    style: {
      minHeight: "100vh",
      background: T.bg,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: 32,
      gap: 24,
      position: "relative",
      overflow: "hidden"
    }
  }, React.createElement("div", {
    className: "scan-ov",
    "aria-hidden": "true"
  }), React.createElement("h1", {
    className: "sr-only"
  }, isLightning ? "Auditing Lightning node" : "Analyzing Bitcoin wallet"), React.createElement("div", {
    style: {
      width: 180,
      height: 120,
      position: "relative"
    },
    "aria-hidden": "true"
  }, isLightning ? React.createElement("svg", {
    width: "180",
    height: "120",
    viewBox: "0 0 180 120",
    style: {
      overflow: "visible"
    }
  }, React.createElement("defs", null, React.createElement("filter", {
    id: "boltGlow"
  }, React.createElement("feGaussianBlur", {
    stdDeviation: "4",
    result: "b"
  }), React.createElement("feMerge", null, React.createElement("feMergeNode", {
    in: "b"
  }), React.createElement("feMergeNode", {
    in: "SourceGraphic"
  })))), React.createElement("path", {
    d: "M100 10 L75 55 L95 55 L72 110 L115 50 L92 50 Z",
    fill: accentColor,
    opacity: "0.9",
    filter: "url(#boltGlow)",
    style: {
      animation: "nodePulse 1.2s ease-in-out infinite"
    }
  }), [0, 0.6].map(d => React.createElement("circle", {
    key: d,
    cx: "90",
    cy: "60",
    r: "20",
    fill: "none",
    stroke: accentColor,
    strokeWidth: "1",
    style: {
      animation: `scanRing 1.4s ease-out ${d}s infinite`,
      transformOrigin: "90px 60px"
    }
  }))) : React.createElement("svg", {
    width: "180",
    height: "120",
    viewBox: "0 0 180 120",
    style: {
      overflow: "visible"
    }
  }, React.createElement("defs", null, React.createElement("linearGradient", {
    id: "radarSweep",
    x1: "0",
    y1: "0",
    x2: "1",
    y2: "0"
  }, React.createElement("stop", {
    offset: "0",
    stopColor: accentColor,
    stopOpacity: "0.32"
  }), React.createElement("stop", {
    offset: "1",
    stopColor: accentColor,
    stopOpacity: "0"
  }))), React.createElement("g", {
    style: {
      animation: "spin 2.6s linear infinite",
      transformOrigin: "90px 60px"
    }
  }, React.createElement("polygon", {
    points: "90,60 134,60 126,34",
    fill: "url(#radarSweep)"
  }), React.createElement("line", {
    x1: "90",
    y1: "60",
    x2: "134",
    y2: "60",
    stroke: accentColor,
    strokeWidth: "1.5",
    strokeOpacity: "0.75"
  })), meshNodes.pts.map((p, i) => React.createElement("line", {
    key: `l${i}`,
    x1: meshNodes.cx,
    y1: meshNodes.cy,
    x2: p.x,
    y2: p.y,
    stroke: accentColor,
    strokeWidth: "1",
    strokeDasharray: "120",
    strokeDashoffset: "120",
    style: {
      animation: `scanLink 1.8s ease-out ${i * 0.18}s infinite`,
      opacity: 0.5
    }
  })), meshNodes.pts.map((p, i) => React.createElement("circle", {
    key: `n${i}`,
    cx: p.x,
    cy: p.y,
    r: "3.5",
    fill: accentColor,
    style: {
      animation: `nodePulse 1.6s ease-in-out ${i * 0.15}s infinite`,
      transformOrigin: `${p.x}px ${p.y}px`
    }
  })), [0, 0.8].map(d => React.createElement("circle", {
    key: `ring${d}`,
    cx: meshNodes.cx,
    cy: meshNodes.cy,
    r: "8",
    fill: "none",
    stroke: accentColor,
    strokeWidth: "1.5",
    style: {
      animation: `scanRing 1.6s ease-out ${d}s infinite`,
      transformOrigin: `${meshNodes.cx}px ${meshNodes.cy}px`
    }
  })), React.createElement("circle", {
    cx: meshNodes.cx,
    cy: meshNodes.cy,
    r: "6",
    fill: accentColor,
    style: {
      filter: `drop-shadow(0 0 8px ${accentColor})`
    }
  }))), React.createElement("div", {
    style: {
      textAlign: "center"
    }
  }, React.createElement("div", {
    style: {
      fontFamily: T.mono,
      fontSize: 10,
      color: accentColor,
      letterSpacing: 2,
      marginBottom: 12
    }
  }, isLightning ? t("scanning.ln.checks") : t("scanning.btc.checks")), React.createElement("div", {
    style: {
      fontFamily: T.serif,
      fontSize: 26,
      color: T.text,
      marginBottom: 8,
      fontWeight: 400
    }
  }, isLightning ? t("scanning.ln.title") : t("scanning.btc.title")), React.createElement("div", {
    style: {
      fontFamily: T.mono,
      fontSize: 11,
      color: T.textDim,
      letterSpacing: 1
    }
  }, address === "DEMO" || address === "DEMO_A" || address === "DEMO_LN" ? isLightning ? "Demo Lightning node" : "Demo wallet" : fmt.addr(address))), React.createElement("div", {
    style: {
      width: "min(480px,90vw)"
    }
  }, React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: 10
    }
  }, React.createElement("span", {
    style: {
      fontSize: 13,
      color: T.textMid
    }
  }, steps[step].label), React.createElement("span", {
    style: {
      fontFamily: T.mono,
      fontSize: 13,
      color: accentColor,
      fontWeight: 500
    }
  }, pct, "%")), React.createElement("div", {
    style: {
      height: 3,
      background: T.surface,
      borderRadius: 4
    }
  }, React.createElement("div", {
    style: {
      height: "100%",
      background: accentColor,
      borderRadius: 4,
      width: `${pct}%`,
      transition: "width .4s ease",
      boxShadow: `0 0 8px ${accentMid}`
    }
  }))), React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 6,
      width: "min(480px,90vw)"
    }
  }, steps.slice(0, step + 1).map((s, i) => React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      gap: 10,
      alignItems: "center",
      animation: "fadeIn .25s ease"
    }
  }, React.createElement("span", {
    style: {
      color: i < step ? T.green : accentColor,
      fontFamily: T.mono,
      fontSize: 11
    }
  }, i < step ? "✓" : "›"), React.createElement("span", {
    style: {
      fontSize: 13,
      color: i < step ? T.textDim : T.text
    }
  }, s.label, i === step && React.createElement("span", {
    className: "blink",
    "aria-hidden": "true",
    style: {
      color: accentColor,
      marginLeft: 3,
      fontFamily: T.mono
    }
  }, "\u258D"))))), React.createElement("div", {
    key: step,
    style: {
      width: "min(480px,90vw)",
      background: T.surface,
      border: `1px solid ${T.border}`,
      borderLeft: `3px solid ${accentColor}`,
      borderRadius: 10,
      padding: "14px 18px",
      animation: "factIn .4s ease both"
    }
  }, React.createElement("div", {
    style: {
      fontFamily: T.mono,
      fontSize: 9,
      color: accentColor,
      letterSpacing: 2,
      marginBottom: 6
    }
  }, t("scanning.didyouknow")), React.createElement("div", {
    style: {
      fontSize: 13,
      color: T.textMid,
      lineHeight: 1.65
    }
  }, currentFact)));
}
function Sparkline({
  history,
  width = 80,
  height = 28
}) {
  if (!history || history.length < 2) return null;
  const pts = history.slice(-8);
  const max = Math.max(...pts, 1);
  const min = Math.max(0, Math.min(...pts) - 5);
  const range = max - min || 1;
  const xs = pts.map((_, i) => i / (pts.length - 1) * width);
  const ys = pts.map(v => height - (v - min) / range * height);
  const d = xs.map((x, i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${ys[i].toFixed(1)}`).join(" ");
  const lastColor = scoreColor(pts[pts.length - 1]);
  const trend = pts[pts.length - 1] - pts[0];
  return React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-end",
      gap: 2
    }
  }, React.createElement("svg", {
    width: width,
    height: height,
    style: {
      overflow: "visible"
    }
  }, React.createElement("defs", null, React.createElement("linearGradient", {
    id: "spkFill",
    x1: "0",
    y1: "0",
    x2: "0",
    y2: "1"
  }, React.createElement("stop", {
    offset: "0%",
    stopColor: lastColor,
    stopOpacity: ".18"
  }), React.createElement("stop", {
    offset: "100%",
    stopColor: lastColor,
    stopOpacity: "0"
  }))), React.createElement("path", {
    d: `${d} L${xs[xs.length - 1].toFixed(1)},${height} L0,${height} Z`,
    fill: "url(#spkFill)"
  }), React.createElement("path", {
    d: d,
    fill: "none",
    stroke: lastColor,
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      strokeDasharray: 220,
      animation: "lineIn 1.1s ease .2s both"
    }
  }), React.createElement("circle", {
    cx: xs[xs.length - 1],
    cy: ys[ys.length - 1],
    r: "2.5",
    fill: lastColor
  })), React.createElement("span", {
    style: {
      fontFamily: T.mono,
      fontSize: 8,
      color: trend > 0 ? T.green : trend < 0 ? T.red : T.textDim
    }
  }, trend > 0 ? `↑ +${trend}` : trend < 0 ? `↓ ${trend}` : "↔"));
}
function ScoreBreakdown({
  checks,
  score,
  isMobile,
  simpleMode
}) {
  const movers = checks.filter(c => typeof c.pts === "number" && c.pts !== 0).sort((a, b) => a.pts - b.pts);
  const penalties = movers.filter(c => c.pts < 0);
  const bonuses = movers.filter(c => c.pts > 0);
  const lost = penalties.reduce((a, c) => a + c.pts, 0);
  const gained = bonuses.reduce((a, c) => a + c.pts, 0);
  const raw = 100 + lost + gained;
  const col = scoreColor(score);
  const nameFor = c => {
    const s = SIMPLE.checks[c.key];
    return simpleMode && s ? s.name : c.name;
  };
  const Row = ({
    label,
    value,
    color,
    faded
  }) => React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
      padding: "7px 0",
      borderTop: `1px solid ${T.borderLo}`
    }
  }, React.createElement("span", {
    style: {
      fontSize: 13,
      color: faded ? T.textDim : T.text,
      lineHeight: 1.4
    }
  }, label), React.createElement("span", {
    style: {
      fontFamily: T.mono,
      fontSize: 13,
      fontWeight: 700,
      color,
      flexShrink: 0
    }
  }, value));
  return React.createElement("div", {
    style: {
      background: T.card,
      border: `1px solid ${T.border}`,
      borderRadius: 16,
      padding: isMobile ? 18 : 22,
      marginBottom: 12
    }
  }, React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      justifyContent: "space-between",
      marginBottom: 12,
      flexWrap: "wrap",
      gap: 6
    }
  }, React.createElement("div", {
    style: {
      fontFamily: T.mono,
      fontSize: 9,
      color: T.textDim,
      letterSpacing: 2
    }
  }, "HOW YOUR SCORE WAS CALCULATED"), React.createElement("div", {
    style: {
      fontFamily: T.mono,
      fontSize: 10,
      color: T.textDim
    }
  }, "every wallet starts at ", React.createElement("span", {
    style: {
      color: T.green
    }
  }, "100"))), React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
      gap: isMobile ? 4 : 24
    }
  }, React.createElement("div", null, React.createElement("div", {
    style: {
      fontFamily: T.mono,
      fontSize: 9,
      color: T.red,
      letterSpacing: 1.5,
      marginBottom: 2
    }
  }, "POINTS LOST", penalties.length ? ` (${lost})` : ""), penalties.length === 0 ? React.createElement("div", {
    style: {
      fontSize: 12,
      color: T.textMid,
      padding: "8px 0"
    }
  }, "Nothing \u2014 clean across every penalised check. \uD83C\uDF89") : penalties.map(c => React.createElement(Row, {
    key: c.key,
    label: nameFor(c),
    value: c.pts,
    color: T.red
  }))), React.createElement("div", null, React.createElement("div", {
    style: {
      fontFamily: T.mono,
      fontSize: 9,
      color: T.green,
      letterSpacing: 1.5,
      marginBottom: 2
    }
  }, "POINTS EARNED", bonuses.length ? ` (+${gained})` : ""), bonuses.length === 0 ? React.createElement("div", {
    style: {
      fontSize: 12,
      color: T.textMid,
      padding: "8px 0"
    }
  }, "No bonuses yet \u2014 CoinJoin usage earns points back.") : bonuses.map(c => React.createElement(Row, {
    key: c.key,
    label: nameFor(c),
    value: `+${c.pts}`,
    color: T.green
  })))), React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
      marginTop: 14,
      paddingTop: 12,
      borderTop: `2px solid ${T.border}`
    }
  }, React.createElement("span", {
    style: {
      fontFamily: T.serif,
      fontSize: 16,
      color: T.text
    }
  }, "Your score"), React.createElement("span", {
    style: {
      fontFamily: T.serif,
      fontSize: 28,
      color: col,
      lineHeight: 1
    }
  }, score, React.createElement("span", {
    style: {
      fontFamily: T.mono,
      fontSize: 12,
      color: T.textDim
    }
  }, "/100"))), React.createElement("div", {
    style: {
      fontFamily: T.mono,
      fontSize: 10,
      color: T.textDim,
      marginTop: 8,
      lineHeight: 1.5
    }
  }, "100 ", lost ? React.createElement(React.Fragment, null, "\u2212 ", Math.abs(lost), " lost ") : "", gained ? React.createElement(React.Fragment, null, "+ ", gained, " earned ") : "", "= ", raw, raw !== score ? ` → ${score} (${raw < 0 ? "floored at 0" : "capped at 100"})` : "", ". Each penalty is recoverable \u2014 see the Fix It tab."));
}
function RadarChart({
  checks,
  size = 220
}) {
  const cx = size / 2,
    cy = size / 2,
    r = size * 0.38;
  const n = checks.length;
  if (n < 3) return null;
  const angle = i => Math.PI * 2 * i / n - Math.PI / 2;
  const pt = (i, pct) => ({
    x: cx + r * pct * Math.cos(angle(i)),
    y: cy + r * pct * Math.sin(angle(i))
  });
  const statusPct = s => s === "pass" ? 1 : s === "warn" ? 0.55 : 0.15;
  const dataPoints = checks.map((c, i) => pt(i, statusPct(c.status)));
  const poly = dataPoints.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ") + " Z";
  const gridLevels = [0.25, 0.5, 0.75, 1];
  const labelR = r + 18;
  return React.createElement("div", {
    style: {
      background: T.card,
      border: `1px solid ${T.border}`,
      borderRadius: 16,
      padding: "18px 10px 10px"
    }
  }, React.createElement("div", {
    style: {
      fontFamily: T.mono,
      fontSize: 9,
      color: T.textDim,
      letterSpacing: 2,
      marginBottom: 8,
      paddingLeft: 12
    }
  }, "PRIVACY RADAR"), React.createElement("svg", {
    width: size,
    height: size,
    viewBox: `0 0 ${size} ${size}`,
    style: {
      display: "block",
      margin: "0 auto"
    }
  }, gridLevels.map(g => {
    const gPoly = checks.map((_, i) => pt(i, g)).map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ") + " Z";
    return React.createElement("path", {
      key: g,
      d: gPoly,
      fill: "none",
      stroke: T.border,
      strokeWidth: ".5"
    });
  }), checks.map((_, i) => React.createElement("line", {
    key: i,
    x1: cx,
    y1: cy,
    x2: pt(i, 1).x,
    y2: pt(i, 1).y,
    stroke: T.borderLo,
    strokeWidth: ".5"
  })), React.createElement("path", {
    d: poly,
    fill: T.cyan + "18",
    stroke: T.cyan,
    strokeWidth: "1.5",
    strokeLinejoin: "round"
  }), dataPoints.map((p, i) => React.createElement("circle", {
    key: i,
    cx: p.x,
    cy: p.y,
    r: "3",
    fill: checks[i].status === "pass" ? T.green : checks[i].status === "warn" ? T.btc : T.red
  })), checks.map((c, i) => {
    const lp = {
      x: cx + labelR * Math.cos(angle(i)),
      y: cy + labelR * Math.sin(angle(i))
    };
    const anchor = lp.x < cx - 5 ? "end" : lp.x > cx + 5 ? "start" : "middle";
    const shortName = c.name.split(" ").slice(0, 2).join(" ");
    return React.createElement("text", {
      key: i,
      x: lp.x,
      y: lp.y,
      textAnchor: anchor,
      dominantBaseline: "central",
      style: {
        fontFamily: T.mono,
        fontSize: 7,
        fill: c.status === "pass" ? T.green : c.status === "warn" ? T.btc : T.red
      }
    }, shortName);
  })));
}
function ParticleCanvas({
  width,
  height,
  color = T.cyan
}) {
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
    particles.current = Array.from({
      length: N
    }).map(() => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.5 + 0.5
    }));
    let running = false;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const pts = particles.current;
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        for (let j = i + 1; j < pts.length; j++) {
          const q = pts[j];
          const dx = p.x - q.x,
            dy = p.y - q.y;
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
    const start = () => {
      if (running) return;
      running = true;
      raf.current = requestAnimationFrame(draw);
    };
    const stop = () => {
      running = false;
      if (raf.current) {
        cancelAnimationFrame(raf.current);
        raf.current = null;
      }
    };
    let io = null;
    if (typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(entries => {
        entries[0].isIntersecting ? start() : stop();
      });
      io.observe(canvas);
    } else {
      start();
    }
    return () => {
      stop();
      if (io) io.disconnect();
    };
  }, [width, height, color]);
  return React.createElement("canvas", {
    ref: canvasRef,
    style: {
      position: "absolute",
      inset: 0,
      pointerEvents: "none"
    }
  });
}
function FundingDisclosure({
  onClose
}) {
  const affiliates = Object.keys(TOOL_AFFILIATE_URL);
  const dialogRef = useDialog(onClose);
  return React.createElement("div", {
    onClick: onClose,
    style: {
      position: "fixed",
      inset: 0,
      zIndex: 950,
      background: "#000000aa",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 20
    }
  }, React.createElement("div", {
    ref: dialogRef,
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "How we get paid",
    tabIndex: -1,
    onClick: e => e.stopPropagation(),
    style: {
      background: T.card,
      border: `1px solid ${T.border}`,
      borderRadius: 18,
      padding: 28,
      width: "min(560px,94vw)",
      maxHeight: "88vh",
      overflow: "auto",
      animation: "fadeUp .25s ease"
    }
  }, React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 14
    }
  }, React.createElement("div", null, React.createElement("div", {
    style: {
      fontFamily: T.mono,
      fontSize: 9,
      color: T.textDim,
      letterSpacing: 2
    }
  }, "TRANSPARENCY"), React.createElement("div", {
    style: {
      fontFamily: T.serif,
      fontSize: 22,
      color: T.text,
      fontWeight: 400,
      marginTop: 4
    }
  }, "How AnonScore is paid for")), React.createElement("button", {
    onClick: onClose,
    "aria-label": "Close",
    style: {
      background: "transparent",
      border: `1px solid ${T.border}`,
      borderRadius: 8,
      padding: "6px 10px",
      color: T.textMid,
      cursor: "pointer"
    }
  }, "\u2715")), React.createElement("div", {
    style: {
      fontSize: 14,
      color: T.textMid,
      lineHeight: 1.7,
      marginBottom: 14
    }
  }, "AnonScore is free for everyone and always will be. We don't run ads. We don't track you. We don't sell data. There is no account, no email required to scan."), React.createElement("div", {
    style: {
      fontSize: 13,
      color: T.textMid,
      lineHeight: 1.7,
      marginBottom: 14
    }
  }, "To keep the tool sustainable, we use three (only three) revenue sources:"), React.createElement("ol", {
    style: {
      paddingLeft: 22,
      marginBottom: 18,
      color: T.textMid,
      fontSize: 13,
      lineHeight: 1.75
    }
  }, React.createElement("li", {
    style: {
      marginBottom: 8
    }
  }, React.createElement("strong", {
    style: {
      color: T.text
    }
  }, "Voluntary tips"), " \u2014 Lightning and Nostr in the footer. Pay if it saved you trouble; ignore otherwise."), React.createElement("li", {
    style: {
      marginBottom: 8
    }
  }, React.createElement("strong", {
    style: {
      color: T.text
    }
  }, "Affiliate referrals on wallet recommendations"), " \u2014 when we link to a wallet or tool that offers a referral program, we may earn a small kickback. Recommendations are never changed to favour higher-paying tools; we recommend only what we'd use ourselves."), React.createElement("li", {
    style: {
      marginBottom: 8
    }
  }, React.createElement("strong", {
    style: {
      color: T.text
    }
  }, "Grants and B2B audits"), " \u2014 privacy-focused organizations and wallet companies sometimes pay for in-depth audits. The free tool you see is not affected.")), React.createElement("div", {
    style: {
      background: T.surface,
      border: `1px solid ${T.border}`,
      borderRadius: 12,
      padding: 16,
      marginBottom: 14
    }
  }, React.createElement("div", {
    style: {
      fontFamily: T.mono,
      fontSize: 9,
      color: T.textDim,
      letterSpacing: 2,
      marginBottom: 8
    }
  }, "CURRENT AFFILIATE LIST"), affiliates.length === 0 ? React.createElement("div", {
    style: {
      fontSize: 13,
      color: T.textMid,
      lineHeight: 1.6
    }
  }, React.createElement("strong", {
    style: {
      color: T.green
    }
  }, "None right now."), " Every wallet link on this site goes directly to the project's official homepage with no kickback to us. If that changes, the tool will be listed here, and each affiliate link will be tagged \"\u2197 affiliate\" next to the tool name.") : React.createElement("ul", {
    style: {
      fontSize: 13,
      color: T.textMid,
      lineHeight: 1.7,
      paddingLeft: 18
    }
  }, affiliates.map(name => React.createElement("li", {
    key: name
  }, React.createElement("a", {
    href: TOOL_AFFILIATE_URL[name],
    target: "_blank",
    rel: "noopener noreferrer nofollow",
    style: {
      color: T.cyan,
      textDecoration: "underline"
    }
  }, name))))), React.createElement("div", {
    style: {
      fontSize: 12,
      color: T.textDim,
      lineHeight: 1.6
    }
  }, "Source code is on ", React.createElement("a", {
    href: "https://github.com/netasset/anonscore",
    target: "_blank",
    rel: "noopener noreferrer",
    style: {
      color: T.cyan,
      textDecoration: "underline"
    }
  }, "GitHub"), ". The affiliate list above is generated directly from a single config object \u2014 anyone can verify it.")));
}
function NewsletterSignup({
  compact = false
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const submit = async e => {
    e?.preventDefault();
    const v = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
      setError("Enter a valid email.");
      return;
    }
    setStatus("submitting");
    setError("");
    if (NEWSLETTER.endpoint) {
      try {
        const fd = new FormData();
        fd.append("email", v);
        const r = await fetch(NEWSLETTER.endpoint, {
          method: "POST",
          body: fd,
          mode: "no-cors"
        });
        setStatus("ok");
      } catch {
        setStatus("err");
        setError("Couldn't reach the newsletter service — try again later.");
      }
    } else {
      window.location.href = `mailto:${NEWSLETTER.fallbackMailto}?subject=${encodeURIComponent("Newsletter subscribe")}&body=${encodeURIComponent(v)}`;
      setStatus("ok");
    }
  };
  if (status === "ok") return React.createElement("div", {
    style: {
      background: T.greenLo,
      border: `1px solid ${T.green}33`,
      borderRadius: 12,
      padding: "12px 16px",
      display: "flex",
      alignItems: "center",
      gap: 10
    }
  }, React.createElement("span", {
    style: {
      color: T.green,
      fontSize: 18
    }
  }, "\u2713"), React.createElement("div", {
    style: {
      fontSize: 13,
      color: T.text
    }
  }, "Got it \u2014 you'll receive the next issue."));
  const inputId = compact ? "nl-email-compact" : "nl-email";
  return React.createElement("form", {
    onSubmit: submit,
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 8
    }
  }, !compact && React.createElement(React.Fragment, null, React.createElement("div", {
    style: {
      fontFamily: T.serif,
      fontSize: 22,
      color: T.text,
      fontWeight: 400
    }
  }, NEWSLETTER.name), React.createElement("div", {
    style: {
      fontSize: 13,
      color: T.textMid,
      lineHeight: 1.6,
      marginBottom: 4
    }
  }, NEWSLETTER.pitch)), React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      flexWrap: "wrap"
    }
  }, React.createElement("label", {
    htmlFor: inputId,
    className: "sr-only"
  }, "Email address"), React.createElement("input", {
    id: inputId,
    type: "email",
    value: email,
    onChange: e => {
      setEmail(e.target.value);
      setError("");
    },
    placeholder: "you@somewhere.zone",
    required: true,
    "aria-invalid": !!error,
    style: {
      flex: 1,
      minWidth: 200,
      background: T.surface,
      border: `1.5px solid ${error ? T.red : T.border}`,
      borderRadius: 10,
      padding: "11px 14px",
      color: T.text,
      fontFamily: T.mono,
      fontSize: 13,
      outline: "none",
      transition: "border .15s, box-shadow .2s"
    },
    onFocus: e => {
      e.target.style.borderColor = T.cyan;
      e.target.style.boxShadow = `0 0 0 3px ${T.cyan}22`;
    },
    onBlur: e => {
      e.target.style.borderColor = error ? T.red : T.border;
      e.target.style.boxShadow = "0 0 0 0 transparent";
    }
  }), React.createElement("button", {
    type: "submit",
    disabled: status === "submitting",
    style: {
      background: T.cyan,
      border: "none",
      borderRadius: 10,
      padding: "11px 18px",
      color: T.bg,
      fontFamily: T.sans,
      fontWeight: 700,
      fontSize: 13,
      cursor: status === "submitting" ? "wait" : "pointer",
      opacity: status === "submitting" ? 0.6 : 1,
      whiteSpace: "nowrap"
    }
  }, status === "submitting" ? "…" : "Subscribe")), error && React.createElement("div", {
    role: "alert",
    style: {
      fontSize: 11,
      color: T.red
    }
  }, error), React.createElement("div", {
    style: {
      fontSize: 10,
      color: T.textDim,
      lineHeight: 1.5
    }
  }, "No spam. Unsubscribe link in every issue. We never link your email to a scanned address."));
}
function WalletDirectory({
  onBack,
  isMobile
}) {
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
    return () => {
      document.title = prev;
      if (desc && prevDesc) desc.setAttribute("content", prevDesc);
    };
  }, []);
  return React.createElement("div", {
    role: "main",
    "aria-label": "Privacy-First Wallet Directory",
    style: {
      minHeight: "100vh",
      background: T.bg,
      display: "flex",
      flexDirection: "column"
    }
  }, React.createElement("h1", {
    className: "sr-only"
  }, "Privacy-First Bitcoin & Lightning Wallet Directory"), React.createElement("nav", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: isMobile ? "12px 16px" : "14px 32px",
      borderBottom: `1px solid ${T.border}`,
      background: T.bg,
      position: "sticky",
      top: 0,
      zIndex: 100
    }
  }, React.createElement("button", {
    onClick: onBack,
    style: {
      background: "transparent",
      border: `1.5px solid ${T.border}`,
      borderRadius: 8,
      padding: "7px 12px",
      color: T.textMid,
      fontFamily: T.sans,
      fontSize: 13,
      cursor: "pointer",
      transition: "border .15s"
    },
    onMouseOver: e => e.currentTarget.style.borderColor = T.cyan,
    onMouseOut: e => e.currentTarget.style.borderColor = T.border
  }, "\u2190 Back"), React.createElement("div", {
    style: {
      fontFamily: T.display,
      fontSize: 15,
      letterSpacing: 4,
      fontWeight: 700
    }
  }, "ANON", React.createElement("span", {
    style: {
      color: T.cyan
    }
  }, "SCORE")), React.createElement("div", {
    style: {
      flex: 1
    }
  }), React.createElement("span", {
    style: {
      fontFamily: T.mono,
      fontSize: 9,
      color: T.btc,
      background: T.btcLo,
      border: `1px solid ${T.btcMid}`,
      borderRadius: 6,
      padding: "4px 9px",
      letterSpacing: 1
    }
  }, "DIRECTORY")), React.createElement("div", {
    style: {
      flex: 1,
      maxWidth: 980,
      margin: "0 auto",
      width: "100%",
      padding: isMobile ? "32px 16px" : "48px 32px"
    }
  }, React.createElement("div", {
    style: {
      textAlign: "center",
      marginBottom: 28
    }
  }, React.createElement("div", {
    style: {
      fontFamily: T.mono,
      fontSize: 10,
      color: T.btc,
      letterSpacing: 2.5,
      marginBottom: 14
    }
  }, "CURATED \xB7 NO PAY-TO-PLAY"), React.createElement("h2", {
    style: {
      fontFamily: T.serif,
      fontSize: isMobile ? 32 : 44,
      color: T.text,
      lineHeight: 1.1,
      fontWeight: 400,
      marginBottom: 14
    }
  }, "The privacy-first", React.createElement("br", null), React.createElement("em", {
    style: {
      color: T.btc
    }
  }, "Bitcoin wallet directory.")), React.createElement("p", {
    style: {
      fontSize: isMobile ? 14 : 16,
      color: T.textMid,
      lineHeight: 1.7,
      maxWidth: 580,
      margin: "0 auto",
      fontWeight: 300
    }
  }, "Every wallet, exchange, and node listed here is one we'd use ourselves. Each entry includes honest watch-outs \u2014 what to know before you trust it with your stack.")), React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginBottom: 20,
      flexWrap: "wrap",
      alignItems: "center"
    }
  }, React.createElement("button", {
    onClick: () => setCat("all"),
    style: {
      padding: "7px 12px",
      background: cat === "all" ? T.cyan : T.surface,
      border: `1px solid ${cat === "all" ? T.cyan : T.border}`,
      color: cat === "all" ? T.bg : T.textMid,
      borderRadius: 8,
      fontFamily: T.mono,
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: 0.5,
      cursor: "pointer",
      transition: "all .15s"
    }
  }, "ALL (", WALLET_REVIEWS.length, ")"), WALLET_CATEGORIES.map(c => {
    const count = WALLET_REVIEWS.filter(w => w.category === c.key).length;
    const active = cat === c.key;
    return React.createElement("button", {
      key: c.key,
      onClick: () => setCat(c.key),
      style: {
        padding: "7px 12px",
        background: active ? T.cyan : T.surface,
        border: `1px solid ${active ? T.cyan : T.border}`,
        color: active ? T.bg : T.textMid,
        borderRadius: 8,
        fontFamily: T.mono,
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: 0.5,
        cursor: "pointer",
        transition: "all .15s"
      }
    }, c.icon, " ", c.label.toUpperCase(), " (", count, ")");
  }), React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 180
    }
  }, React.createElement("label", {
    htmlFor: "wallet-search",
    className: "sr-only"
  }, "Search wallets"), React.createElement("input", {
    id: "wallet-search",
    type: "search",
    value: query,
    onChange: e => setQuery(e.target.value),
    placeholder: "Search\u2026",
    style: {
      width: "100%",
      background: T.surface,
      border: `1px solid ${T.border}`,
      borderRadius: 8,
      padding: "7px 12px",
      color: T.text,
      fontFamily: T.mono,
      fontSize: 11,
      outline: "none",
      transition: "border .15s, box-shadow .2s"
    },
    onFocus: e => {
      e.target.style.borderColor = T.cyan;
      e.target.style.boxShadow = `0 0 0 3px ${T.cyan}22`;
    },
    onBlur: e => {
      e.target.style.borderColor = T.border;
      e.target.style.boxShadow = "0 0 0 0 transparent";
    }
  }))), grouped.length === 0 ? React.createElement("div", {
    style: {
      background: T.card,
      border: `1px solid ${T.border}`,
      borderRadius: 12,
      padding: "40px 20px",
      textAlign: "center",
      color: T.textMid,
      fontSize: 14
    }
  }, "No matches for \"", query, "\".") : grouped.map(([catKey, list]) => {
    const meta = WALLET_CATEGORIES.find(c => c.key === catKey);
    return React.createElement("section", {
      key: catKey,
      style: {
        marginBottom: 36
      }
    }, React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "baseline",
        gap: 10,
        marginBottom: 14,
        paddingBottom: 8,
        borderBottom: `1px solid ${T.borderLo}`
      }
    }, React.createElement("span", {
      style: {
        fontSize: 18
      }
    }, meta.icon), React.createElement("h3", {
      style: {
        fontFamily: T.serif,
        fontSize: 22,
        color: T.text,
        fontWeight: 400,
        margin: 0
      }
    }, meta.label), React.createElement("div", {
      style: {
        fontFamily: T.mono,
        fontSize: 10,
        color: T.textDim
      }
    }, "\xB7 ", meta.blurb)), React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
        gap: 14
      }
    }, list.map(w => {
      const href = toolLink(w.name);
      const aff = toolIsAffiliate(w.name);
      return React.createElement("article", {
        key: w.name,
        style: {
          background: T.card,
          border: `1px solid ${T.border}`,
          borderRadius: 14,
          padding: "18px 20px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          transition: "border-color .2s, box-shadow .25s, transform .25s cubic-bezier(.16,.84,.44,1)"
        },
        onMouseEnter: e => {
          e.currentTarget.style.borderColor = T.cyan + "44";
          e.currentTarget.style.boxShadow = `0 12px 32px -18px ${T.cyan}77`;
          e.currentTarget.style.transform = "translateY(-3px)";
        },
        onMouseLeave: e => {
          e.currentTarget.style.borderColor = T.border;
          e.currentTarget.style.boxShadow = "none";
          e.currentTarget.style.transform = "none";
        }
      }, React.createElement("div", {
        style: {
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 10,
          flexWrap: "wrap"
        }
      }, React.createElement("div", null, React.createElement("div", {
        style: {
          fontFamily: T.serif,
          fontSize: 19,
          color: T.text,
          fontWeight: 400
        }
      }, w.name), w.os && React.createElement("div", {
        style: {
          fontFamily: T.mono,
          fontSize: 9,
          color: T.textDim,
          marginTop: 3
        }
      }, w.os)), aff && React.createElement("span", {
        style: {
          fontFamily: T.mono,
          fontSize: 9,
          color: T.amber,
          background: T.amberLo,
          border: `1px solid ${T.amberMid}`,
          borderRadius: 6,
          padding: "3px 8px",
          letterSpacing: 0.5
        }
      }, "AFFILIATE")), React.createElement("p", {
        style: {
          fontSize: 13,
          color: T.textMid,
          lineHeight: 1.6,
          margin: 0
        }
      }, w.pitch), React.createElement("div", null, React.createElement("div", {
        style: {
          fontFamily: T.mono,
          fontSize: 9,
          color: T.green,
          letterSpacing: 1.5,
          marginBottom: 4
        }
      }, "STRENGTHS"), React.createElement("ul", {
        style: {
          listStyle: "none",
          padding: 0,
          margin: 0,
          display: "flex",
          flexDirection: "column",
          gap: 3
        }
      }, w.strengths.map((s, i) => React.createElement("li", {
        key: i,
        style: {
          display: "flex",
          gap: 8,
          fontSize: 12,
          color: T.text,
          lineHeight: 1.55
        }
      }, React.createElement("span", {
        style: {
          color: T.green,
          flexShrink: 0
        }
      }, "\u2713"), React.createElement("span", null, s))))), React.createElement("div", null, React.createElement("div", {
        style: {
          fontFamily: T.mono,
          fontSize: 9,
          color: T.amber,
          letterSpacing: 1.5,
          marginBottom: 4
        }
      }, "WATCH-OUTS"), React.createElement("ul", {
        style: {
          listStyle: "none",
          padding: 0,
          margin: 0,
          display: "flex",
          flexDirection: "column",
          gap: 3
        }
      }, w.watchOuts.map((s, i) => React.createElement("li", {
        key: i,
        style: {
          display: "flex",
          gap: 8,
          fontSize: 12,
          color: T.textMid,
          lineHeight: 1.55
        }
      }, React.createElement("span", {
        style: {
          color: T.amber,
          flexShrink: 0
        }
      }, "\u26A0"), React.createElement("span", null, s))))), href && React.createElement("div", {
        style: {
          marginTop: 4
        }
      }, React.createElement("a", {
        href: href,
        target: "_blank",
        rel: "noopener noreferrer nofollow",
        style: {
          display: "inline-block",
          background: "transparent",
          border: `1.5px solid ${T.cyan}66`,
          borderRadius: 8,
          padding: "7px 14px",
          color: T.cyan,
          fontFamily: T.mono,
          fontSize: 11,
          textDecoration: "none",
          transition: "all .15s"
        },
        onMouseOver: e => {
          e.currentTarget.style.background = T.cyan;
          e.currentTarget.style.color = T.bg;
        },
        onMouseOut: e => {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = T.cyan;
        }
      }, "Visit ", w.name, " \u2197")));
    })));
  }), React.createElement("div", {
    style: {
      background: T.surface,
      border: `1px solid ${T.border}`,
      borderRadius: 12,
      padding: "16px 20px",
      fontSize: 12,
      color: T.textMid,
      lineHeight: 1.7
    }
  }, React.createElement("div", {
    style: {
      fontFamily: T.mono,
      fontSize: 9,
      color: T.textDim,
      letterSpacing: 2,
      marginBottom: 8
    }
  }, "HOW THIS LIST WORKS"), "Every entry was picked because we'd actually use it. Reviews are written by the AnonScore team, not paid for. ", anyAff ? React.createElement(React.Fragment, null, "Entries tagged ", React.createElement("span", {
    style: {
      fontFamily: T.mono,
      color: T.amber
    }
  }, "AFFILIATE"), " earn AnonScore a small referral when you sign up \u2014 we never tune reviews for tier.") : React.createElement(React.Fragment, null, "No entry on this page currently pays us a referral. If that ever changes, it'll be tagged ", React.createElement("span", {
    style: {
      fontFamily: T.mono,
      color: T.amber
    }
  }, "AFFILIATE"), " here and listed in full disclosure."))));
}
function CoachWaitlist({
  onBack,
  isMobile
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const submit = async e => {
    e?.preventDefault();
    const v = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
      setError("Enter a valid email.");
      return;
    }
    setStatus("submitting");
    setError("");
    if (COACH.endpoint) {
      try {
        const fd = new FormData();
        fd.append("email", v);
        fd.append("list", "coach-waitlist");
        await fetch(COACH.endpoint, {
          method: "POST",
          body: fd,
          mode: "no-cors"
        });
        setStatus("ok");
      } catch {
        setStatus("err");
        setError("Couldn't reach the waitlist service. Try again later.");
      }
    } else {
      window.location.href = `mailto:${COACH.fallbackMailto}?subject=${encodeURIComponent("Coach waitlist")}&body=${encodeURIComponent(v + "\n\n(Add me to the Privacy Coach early-access list.)")}`;
      setStatus("ok");
    }
  };
  useEffect(() => {
    const prev = document.title;
    document.title = "Privacy Coach (early access) — AnonScore";
    return () => {
      document.title = prev;
    };
  }, []);
  return React.createElement("div", {
    role: "main",
    "aria-label": "Privacy Coach \u2014 early access waitlist",
    style: {
      minHeight: "100vh",
      background: T.bg,
      display: "flex",
      flexDirection: "column"
    }
  }, React.createElement("h1", {
    className: "sr-only"
  }, "Privacy Coach \u2014 paid AI tier (early access waitlist)"), React.createElement("nav", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: isMobile ? "12px 16px" : "14px 32px",
      borderBottom: `1px solid ${T.border}`,
      background: T.bg,
      position: "sticky",
      top: 0,
      zIndex: 100
    }
  }, React.createElement("button", {
    onClick: onBack,
    style: {
      background: "transparent",
      border: `1.5px solid ${T.border}`,
      borderRadius: 8,
      padding: "7px 12px",
      color: T.textMid,
      fontFamily: T.sans,
      fontSize: 13,
      cursor: "pointer",
      transition: "border .15s"
    },
    onMouseOver: e => e.currentTarget.style.borderColor = T.cyan,
    onMouseOut: e => e.currentTarget.style.borderColor = T.border
  }, "\u2190 Back"), React.createElement("div", {
    style: {
      fontFamily: T.display,
      fontSize: 15,
      letterSpacing: 4,
      fontWeight: 700
    }
  }, "ANON", React.createElement("span", {
    style: {
      color: T.cyan
    }
  }, "SCORE")), React.createElement("div", {
    style: {
      flex: 1
    }
  }), React.createElement("span", {
    style: {
      fontFamily: T.mono,
      fontSize: 9,
      color: T.cyan,
      background: T.cyanLo,
      border: `1px solid ${T.cyanMid}`,
      borderRadius: 6,
      padding: "4px 9px",
      letterSpacing: 1
    }
  }, "EARLY ACCESS")), React.createElement("div", {
    style: {
      flex: 1,
      maxWidth: 760,
      margin: "0 auto",
      width: "100%",
      padding: isMobile ? "32px 20px" : "56px 32px"
    }
  }, React.createElement("div", {
    style: {
      textAlign: "center",
      marginBottom: 40
    }
  }, React.createElement("div", {
    style: {
      fontFamily: T.mono,
      fontSize: 10,
      color: T.cyan,
      letterSpacing: 2.5,
      marginBottom: 16
    }
  }, "\u2726 AI PRIVACY ASSISTANT \u2014 UPGRADED"), React.createElement("div", {
    style: {
      fontFamily: T.serif,
      fontSize: isMobile ? 36 : 52,
      color: T.text,
      lineHeight: 1.1,
      fontWeight: 400,
      marginBottom: 18
    }
  }, "A coach that remembers", React.createElement("br", null), React.createElement("em", {
    style: {
      color: T.cyan
    }
  }, "every scan, every fix, every step.")), React.createElement("p", {
    style: {
      fontSize: isMobile ? 15 : 17,
      color: T.textMid,
      lineHeight: 1.7,
      maxWidth: 560,
      margin: "0 auto",
      fontWeight: 300
    }
  }, "The free AI assistant answers 5 questions per session. The Coach has no cap, remembers your history across scans, and tracks a personal fix queue that follows you across devices.")), React.createElement("div", {
    style: {
      background: T.card,
      border: `1.5px solid ${T.cyan}55`,
      borderRadius: 18,
      padding: isMobile ? "24px 20px" : "32px 36px",
      marginBottom: 28,
      boxShadow: `0 8px 32px ${T.cyanMid}, 0 0 0 1px ${T.cyan}22`
    }
  }, React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      justifyContent: "center",
      gap: 4,
      marginBottom: 10
    }
  }, React.createElement("span", {
    style: {
      fontFamily: T.serif,
      fontSize: isMobile ? 44 : 56,
      color: T.text,
      fontWeight: 400
    }
  }, COACH.price), React.createElement("span", {
    style: {
      fontFamily: T.mono,
      fontSize: 14,
      color: T.textMid
    }
  }, COACH.unit)), React.createElement("div", {
    style: {
      textAlign: "center",
      fontSize: 13,
      color: T.textDim,
      marginBottom: 24,
      fontFamily: T.mono,
      letterSpacing: 0.5
    }
  }, "Pay in Bitcoin (Lightning) or card. Cancel anytime."), React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
      gap: 14,
      marginBottom: 28
    }
  }, COACH.benefits.map(b => React.createElement("div", {
    key: b.title,
    style: {
      display: "flex",
      gap: 12,
      alignItems: "flex-start"
    }
  }, React.createElement("div", {
    style: {
      flexShrink: 0,
      width: 28,
      height: 28,
      borderRadius: 8,
      background: T.cyan + "18",
      border: `1px solid ${T.cyan}33`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: T.mono,
      fontSize: 14,
      color: T.cyan
    }
  }, b.icon), React.createElement("div", null, React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 700,
      color: T.text,
      marginBottom: 3
    }
  }, b.title), React.createElement("div", {
    style: {
      fontSize: 12,
      color: T.textMid,
      lineHeight: 1.55
    }
  }, b.desc))))), status === "ok" ? React.createElement("div", {
    style: {
      background: T.greenLo,
      border: `1px solid ${T.green}44`,
      borderRadius: 12,
      padding: "16px 20px",
      display: "flex",
      alignItems: "center",
      gap: 12
    }
  }, React.createElement("span", {
    style: {
      color: T.green,
      fontSize: 20
    }
  }, "\u2713"), React.createElement("div", null, React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 700,
      color: T.text
    }
  }, "You're on the list."), React.createElement("div", {
    style: {
      fontSize: 12,
      color: T.textMid,
      marginTop: 2
    }
  }, "We'll email when the Coach opens for early access \u2014 no spam in between."))) : React.createElement("form", {
    onSubmit: submit
  }, React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      flexWrap: "wrap"
    }
  }, React.createElement("label", {
    htmlFor: "coach-email",
    className: "sr-only"
  }, "Email address for early-access waitlist"), React.createElement("input", {
    id: "coach-email",
    type: "email",
    value: email,
    onChange: e => {
      setEmail(e.target.value);
      setError("");
    },
    placeholder: "you@somewhere.zone",
    required: true,
    "aria-invalid": !!error,
    style: {
      flex: 1,
      minWidth: 220,
      background: T.surface,
      border: `1.5px solid ${error ? T.red : T.border}`,
      borderRadius: 10,
      padding: "13px 16px",
      color: T.text,
      fontFamily: T.mono,
      fontSize: 13,
      outline: "none",
      transition: "border .15s, box-shadow .2s"
    },
    onFocus: e => {
      e.target.style.borderColor = T.cyan;
      e.target.style.boxShadow = `0 0 0 3px ${T.cyan}22`;
    },
    onBlur: e => {
      e.target.style.borderColor = error ? T.red : T.border;
      e.target.style.boxShadow = "0 0 0 0 transparent";
    }
  }), React.createElement("button", {
    type: "submit",
    disabled: status === "submitting",
    style: {
      background: T.cyan,
      border: "none",
      borderRadius: 10,
      padding: "13px 22px",
      color: T.bg,
      fontFamily: T.sans,
      fontWeight: 700,
      fontSize: 14,
      cursor: status === "submitting" ? "wait" : "pointer",
      opacity: status === "submitting" ? 0.6 : 1,
      whiteSpace: "nowrap"
    }
  }, status === "submitting" ? "…" : "Join waitlist")), error && React.createElement("div", {
    role: "alert",
    style: {
      fontSize: 11,
      color: T.red,
      marginTop: 8
    }
  }, error), React.createElement("div", {
    style: {
      fontSize: 11,
      color: T.textDim,
      marginTop: 10,
      lineHeight: 1.55
    }
  }, "Target opening: ", React.createElement("span", {
    style: {
      color: T.textMid
    }
  }, COACH.launchTarget), ". We'll email once. No spam. Your email is never linked to a scanned address."))), React.createElement("div", {
    style: {
      background: T.surface,
      border: `1px solid ${T.border}`,
      borderRadius: 14,
      overflow: "hidden",
      marginBottom: 28
    }
  }, React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr",
      borderBottom: `1px solid ${T.border}`
    }
  }, React.createElement("div", {
    style: {
      padding: "14px 18px",
      fontFamily: T.mono,
      fontSize: 9,
      color: T.textDim,
      letterSpacing: 2
    }
  }, "WHAT YOU GET"), React.createElement("div", {
    style: {
      padding: "14px 18px",
      fontFamily: T.mono,
      fontSize: 9,
      color: T.textMid,
      letterSpacing: 2,
      borderLeft: `1px solid ${T.border}`
    }
  }, "FREE"), React.createElement("div", {
    style: {
      padding: "14px 18px",
      fontFamily: T.mono,
      fontSize: 9,
      color: T.cyan,
      letterSpacing: 2,
      borderLeft: `1px solid ${T.border}`,
      background: T.cyanLo
    }
  }, "COACH")), [["The full audit (10 BTC + 8 LN heuristics)", "✓ always free", "✓ always free"], ["AI assistant — messages per session", "5", "Unlimited"], ["Memory across scans", "—", "✓ passphrase-encrypted"], ["Multi-device continuity", "—", "✓"], ["Personal fix queue with progress", "Per address", "✓ across every wallet"], ["Address ever sent to the AI", "Never", "Never"]].map(([what, free, coach], i, arr) => React.createElement("div", {
    key: what,
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr",
      borderBottom: i < arr.length - 1 ? `1px solid ${T.borderLo}` : undefined
    }
  }, React.createElement("div", {
    style: {
      padding: "12px 18px",
      fontSize: 13,
      color: T.text
    }
  }, what), React.createElement("div", {
    style: {
      padding: "12px 18px",
      fontSize: 12,
      color: T.textMid,
      borderLeft: `1px solid ${T.borderLo}`,
      fontFamily: T.mono
    }
  }, free), React.createElement("div", {
    style: {
      padding: "12px 18px",
      fontSize: 12,
      color: coach.includes("Never") ? T.textMid : T.text,
      borderLeft: `1px solid ${T.borderLo}`,
      fontFamily: T.mono,
      background: T.cyan + "08"
    }
  }, coach)))), React.createElement("div", {
    style: {
      background: T.greenLo,
      border: `1px solid ${T.green}33`,
      borderRadius: 12,
      padding: "16px 20px"
    }
  }, React.createElement("div", {
    style: {
      fontFamily: T.mono,
      fontSize: 9,
      color: T.green,
      letterSpacing: 2,
      marginBottom: 8
    }
  }, "HOW PRIVACY HOLDS UP UNDER A PAID TIER"), React.createElement("div", {
    style: {
      fontSize: 13,
      color: T.textMid,
      lineHeight: 1.7
    }
  }, "Coach memory is encrypted client-side with a passphrase you choose \u2014 the server stores only ciphertext it can't read. Wallet addresses you scan are ", React.createElement("strong", {
    style: {
      color: T.text
    }
  }, "never"), " sent to the AI; only your score and issue names are. Free or paid, this stays the same.")), React.createElement("div", {
    style: {
      textAlign: "center",
      marginTop: 32
    }
  }, React.createElement("button", {
    onClick: onBack,
    style: {
      background: "transparent",
      border: "none",
      color: T.textMid,
      fontFamily: T.mono,
      fontSize: 12,
      cursor: "pointer",
      padding: 8
    },
    onMouseOver: e => e.currentTarget.style.color = T.cyan,
    onMouseOut: e => e.currentTarget.style.color = T.textMid
  }, "\u2190 Back to scanner"))));
}
function renderMd(text) {
  if (!text) return null;
  const lines = text.split("\n");
  const out = [];
  let key = 0;
  const inlineStyles = str => {
    const parts = [];
    let remaining = str;
    let idx = 0;
    while (remaining.length > 0) {
      const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
      const italicMatch = remaining.match(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/);
      const first = [boldMatch, italicMatch].filter(Boolean).sort((a, b) => a.index - b.index)[0];
      if (!first) {
        parts.push(remaining);
        break;
      }
      if (first.index > 0) parts.push(remaining.slice(0, first.index));
      if (first === boldMatch) {
        parts.push(React.createElement("strong", {
          key: idx++,
          style: {
            color: T.text,
            fontWeight: 700
          }
        }, first[1]));
      } else {
        parts.push(React.createElement("em", {
          key: idx++
        }, first[1]));
      }
      remaining = remaining.slice(first.index + first[0].length);
    }
    return parts;
  };
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) {
      if (out.length > 0) out.push(React.createElement("div", {
        key: key++,
        style: {
          height: 6
        }
      }));
      continue;
    }
    const numMatch = line.match(/^(\d+)\.\s+(.*)/);
    if (numMatch) {
      out.push(React.createElement("div", {
        key: key++,
        style: {
          display: "flex",
          gap: 8,
          marginBottom: 2
        }
      }, React.createElement("span", {
        style: {
          color: T.cyan,
          fontFamily: T.mono,
          fontSize: 11,
          flexShrink: 0,
          marginTop: 1
        }
      }, numMatch[1], "."), React.createElement("span", null, inlineStyles(numMatch[2]))));
      continue;
    }
    const bulletMatch = line.match(/^[-•]\s+(.*)/);
    if (bulletMatch) {
      out.push(React.createElement("div", {
        key: key++,
        style: {
          display: "flex",
          gap: 8,
          marginBottom: 2
        }
      }, React.createElement("span", {
        style: {
          color: T.cyan,
          flexShrink: 0,
          marginTop: 2,
          fontSize: 10
        }
      }, "\u203A"), React.createElement("span", null, inlineStyles(bulletMatch[1]))));
      continue;
    }
    out.push(React.createElement("div", {
      key: key++,
      style: {
        marginBottom: 2
      }
    }, inlineStyles(line)));
  }
  return React.createElement(React.Fragment, null, out);
}
function buildAiContext(checks, recommendations, score, grade, walletMeta) {
  const issues = checks.filter(c => c.status !== "pass");
  const isPublic = walletMeta?.isPublic;
  const entity = walletMeta?.entity || "";
  let txSection = "";
  if (isPublic && walletMeta?.txs?.length) {
    const txs = walletMeta.txs.slice(0, 20);
    const utxos = (walletMeta.utxos || []).slice(0, 20);
    const now = Math.floor(Date.now() / 1000);
    const age = ts => {
      if (!ts) return "unknown date";
      const d = Math.floor((now - ts) / 86400);
      return d === 0 ? "today" : d === 1 ? "1 day ago" : `${d} days ago`;
    };
    const satsBtc = s => s >= 1e8 ? `₿${(s / 1e8).toFixed(4)}` : `${s.toLocaleString()} sats`;
    const txLines = txs.map((tx, i) => {
      const inCount = tx.vin?.length || 0;
      const outCount = tx.vout?.length || 0;
      const fee = tx.fee ? `${tx.fee} sats fee` : "";
      const time = age(tx.status?.block_time);
      const totalOut = (tx.vout || []).reduce((s, o) => s + (o.value || 0), 0);
      const flags = [];
      if (outCount >= 5 && inCount >= 5) flags.push("possible CoinJoin");
      if (inCount >= 4 && outCount <= 2) flags.push("consolidation");
      if (totalOut >= 100000 && totalOut % 100000 === 0) flags.push("round amount");
      return `  ${i + 1}. ${time} — ${inCount} inputs → ${outCount} outputs, ${satsBtc(totalOut)} total${fee ? `, ${fee}` : ""}${flags.length ? ` [${flags.join(", ")}]` : ""}`;
    }).join("\n");
    const utxoLines = utxos.slice(0, 10).map((u, i) => `  ${i + 1}. ${satsBtc(u.value)} — ${u.status?.confirmed ? "confirmed" : "unconfirmed"}, ${age(u.status?.block_time)}, type: ${u.scriptpubkey_type || "unknown"}`).join("\n");
    txSection = `
On-chain transaction data (${txs.length} most recent, all public blockchain data):
${txLines}

Top UTXOs by value (${utxos.length} sampled):
${utxoLines}`;
  }
  const walletFrame = isPublic ? `The user is analyzing a PUBLIC/INSTITUTIONAL wallet — this is NOT the user's own wallet. It belongs to: ${entity}. Always use third-person language ("this wallet", "the entity", "their coins") — NEVER say "your wallet", "your coins", or "you should". Frame analysis as forensic/educational, not personal advice.` : `The user ran a privacy analysis on their own wallet. Address was NOT shared — you have analysis results only.`;
  const systemPrompt = `You are a Bitcoin privacy expert assistant. ${walletFrame}

Analysis summary:
- Privacy score: ${score}/100 (Grade ${grade})
- Issues (${issues.length}):
${issues.map(c => `  • ${c.name} [${c.status.toUpperCase()}]: ${c.plain}`).join("\n")}
- Top recommendations:
${recommendations.slice(0, 5).map((r, i) => `  ${i + 1}. ${r.action} (+${r.impact}pts) — Options: ${(r.tools || [{
    name: r.tool
  }]).map(t => t.name).join(", ")}`).join("\n")}${txSection}

Rules:
- Plain prose only. NO markdown — no **bold**, no *italic*, no bullet points with -, no # headers.
- Use numbered lists (1. 2. 3.) sparingly if needed for steps.
- Be concise. Under 150 words unless step-by-step instructions require more.
- ${isPublic ? "This is forensic analysis of a public wallet — you have transaction data above. Discuss specific transactions when asked. Focus on what the chain reveals, historical context, and privacy lessons." : "Give practical wallet instructions when asked (Sparrow, Wasabi, Phoenix)."}
- Never reproduce or reference full Bitcoin addresses.`;
  const preview = [`Score: ${score}/100 · Grade ${grade}`, isPublic ? `Entity: ${entity}` : `${issues.length} issue${issues.length !== 1 ? "s" : ""}: ${issues.slice(0, 3).map(c => c.name).join(", ")}${issues.length > 3 ? ` +${issues.length - 3} more` : ""}`, isPublic && walletMeta?.txs?.length ? `${walletMeta.txs.length} recent transactions (public blockchain data)` : `Top finding: ${recommendations[0]?.action || issues[0]?.name || "none"}`];
  return {
    systemPrompt,
    preview
  };
}
function AiConsentGate({
  score,
  grade,
  checks,
  recommendations,
  walletMeta,
  onAccept,
  onDecline
}) {
  const {
    preview
  } = buildAiContext(checks, recommendations, score, grade, walletMeta);
  const dialogRef = useDialog(onDecline);
  return React.createElement("div", {
    style: {
      position: "fixed",
      inset: 0,
      zIndex: 950,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
      background: "#000000bb"
    }
  }, React.createElement("div", {
    ref: dialogRef,
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "AI assistant data disclosure",
    tabIndex: -1,
    style: {
      background: T.card,
      border: `1px solid ${T.border}`,
      borderRadius: 20,
      padding: 28,
      width: "min(420px,96vw)",
      animation: "fadeUp .25s ease both"
    }
  }, React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      marginBottom: 20
    }
  }, React.createElement("div", {
    style: {
      width: 32,
      height: 32,
      background: T.cyan + "18",
      border: `1px solid ${T.cyan}33`,
      borderRadius: 9,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 15
    }
  }, "\u2726"), React.createElement("div", null, React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 700,
      color: T.text
    }
  }, "Before you continue"), React.createElement("div", {
    style: {
      fontFamily: T.mono,
      fontSize: 9,
      color: T.textDim,
      letterSpacing: 1.2,
      marginTop: 1
    }
  }, "AI ASSISTANT \xB7 DATA DISCLOSURE"))), React.createElement("div", {
    style: {
      background: T.greenLo,
      border: `1px solid ${T.green}33`,
      borderRadius: 12,
      padding: "14px 16px",
      marginBottom: 10
    }
  }, React.createElement("div", {
    style: {
      fontFamily: T.mono,
      fontSize: 9,
      color: T.green,
      letterSpacing: 1.5,
      marginBottom: 10
    }
  }, "\u2713 SENT TO ANTHROPIC'S API"), preview.map((line, i) => React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      gap: 8,
      padding: "4px 0",
      borderTop: i > 0 ? `1px solid ${T.borderLo}` : undefined
    }
  }, React.createElement("span", {
    style: {
      color: T.textDim,
      fontSize: 10,
      flexShrink: 0,
      marginTop: 1
    }
  }, "\u203A"), React.createElement("span", {
    style: {
      fontFamily: T.mono,
      fontSize: 11,
      color: T.textMid,
      lineHeight: 1.5
    }
  }, line))), React.createElement("div", {
    style: {
      fontFamily: T.mono,
      fontSize: 9,
      color: T.textDim,
      marginTop: 10,
      lineHeight: 1.5
    }
  }, "This is the complete list. Nothing else leaves your browser.")), React.createElement("div", {
    style: {
      background: T.redLo,
      border: `1px solid ${T.red}22`,
      borderRadius: 12,
      padding: "14px 16px",
      marginBottom: 18
    }
  }, React.createElement("div", {
    style: {
      fontFamily: T.mono,
      fontSize: 9,
      color: T.red,
      letterSpacing: 1.5,
      marginBottom: 10
    }
  }, "\u2715 NEVER SENT"), (walletMeta?.isPublic ? ["Your identity or IP address", "Any data beyond what's shown above"] : ["Your Bitcoin address", "Transaction IDs or UTXO data", "Any data that could identify your wallet"]).map((line, i) => React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      gap: 8,
      padding: "4px 0",
      borderTop: i > 0 ? `1px solid ${T.borderLo}` : undefined
    }
  }, React.createElement("span", {
    style: {
      color: T.red,
      fontSize: 10,
      flexShrink: 0,
      marginTop: 1
    }
  }, "\u2715"), React.createElement("span", {
    style: {
      fontFamily: T.mono,
      fontSize: 11,
      color: T.textMid,
      lineHeight: 1.5
    }
  }, line)))), React.createElement("div", {
    style: {
      fontSize: 12,
      color: T.textDim,
      lineHeight: 1.7,
      marginBottom: 14
    }
  }, "Anthropic does not train on API data. Each session is independent \u2014 no history persists between conversations.", " ", React.createElement("a", {
    href: "https://www.anthropic.com/privacy",
    target: "_blank",
    rel: "noopener noreferrer",
    style: {
      color: T.cyan,
      textDecoration: "none"
    }
  }, "Anthropic privacy policy \u2192")), React.createElement("div", {
    style: {
      background: T.surface,
      border: `1px solid ${T.border}`,
      borderRadius: 12,
      padding: "12px 16px",
      marginBottom: 18
    }
  }, React.createElement("div", {
    style: {
      fontFamily: T.mono,
      fontSize: 9,
      color: T.textDim,
      letterSpacing: 1.5,
      marginBottom: 8
    }
  }, "USAGE LIMITS"), React.createElement("div", {
    style: {
      fontSize: 12,
      color: T.textMid,
      lineHeight: 1.7
    }
  }, React.createElement("strong", {
    style: {
      color: T.text
    }
  }, "5 messages per conversation."), " To prevent abuse, a temporary anonymous counter is stored for 24 hours against a hashed version of your IP \u2014 never linked to you or your address. Resets daily.")), React.createElement("div", {
    style: {
      display: "flex",
      gap: 10
    }
  }, React.createElement("button", {
    onClick: onDecline,
    style: {
      flex: 1,
      padding: "12px",
      background: "transparent",
      border: `1.5px solid ${T.border}`,
      borderRadius: 10,
      color: T.textMid,
      fontSize: 13,
      cursor: "pointer"
    }
  }, "No thanks"), React.createElement("button", {
    onClick: onAccept,
    style: {
      flex: 1,
      padding: "12px",
      background: T.cyan,
      border: "none",
      borderRadius: 10,
      color: T.bg,
      fontSize: 13,
      fontWeight: 700,
      cursor: "pointer"
    }
  }, "I understand \u2014 continue"))));
}
function ConfirmScanModal({
  pendingScan,
  onCancel,
  onConfirm
}) {
  const dialogRef = useDialog(onCancel);
  const kind = pendingScan.inputType === "btc" ? "Bitcoin address" : pendingScan.inputType === "ln_address" ? "Lightning address" : "Lightning node";
  return React.createElement("div", {
    style: {
      position: "fixed",
      inset: 0,
      zIndex: 900,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
      background: "#000000aa"
    }
  }, React.createElement("div", {
    ref: dialogRef,
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "Confirm shared scan link",
    tabIndex: -1,
    style: {
      background: T.card,
      border: `1px solid ${T.border}`,
      borderRadius: 18,
      padding: 28,
      width: "min(400px,94vw)",
      animation: "fadeUp .25s ease"
    }
  }, React.createElement("div", {
    style: {
      fontFamily: T.mono,
      fontSize: 9,
      color: T.textDim,
      letterSpacing: 2,
      marginBottom: 14
    }
  }, "SHARED SCAN LINK"), React.createElement("div", {
    style: {
      fontFamily: T.serif,
      fontSize: 20,
      color: T.text,
      marginBottom: 10,
      fontWeight: 400
    }
  }, "You were linked to scan this ", kind), React.createElement("div", {
    style: {
      fontFamily: T.mono,
      fontSize: 11,
      color: T.textDim,
      background: T.surface,
      border: `1px solid ${T.border}`,
      borderRadius: 8,
      padding: "10px 14px",
      marginBottom: 16,
      wordBreak: "break-all"
    }
  }, pendingScan.addr.length > 30 ? `${pendingScan.addr.slice(0, 20)}…${pendingScan.addr.slice(-8)}` : pendingScan.addr), React.createElement("div", {
    style: {
      fontSize: 13,
      color: T.textMid,
      lineHeight: 1.65,
      marginBottom: 20
    }
  }, "This queries a public block explorer directly from your browser. The address is public data \u2014 but the explorer sees your IP alongside it. On Tor or your own node, even that link stays private."), React.createElement("div", {
    style: {
      display: "flex",
      gap: 10
    }
  }, React.createElement("button", {
    onClick: onCancel,
    style: {
      flex: 1,
      padding: "12px",
      background: "transparent",
      border: `1.5px solid ${T.border}`,
      borderRadius: 10,
      color: T.textMid,
      fontSize: 13,
      cursor: "pointer"
    }
  }, "Cancel"), React.createElement("button", {
    onClick: onConfirm,
    style: {
      flex: 1,
      padding: "12px",
      background: T.cyan,
      border: "none",
      borderRadius: 10,
      color: T.bg,
      fontSize: 13,
      fontWeight: 700,
      cursor: "pointer"
    }
  }, "Scan it \u2192"))));
}
function AiAssistant({
  checks,
  recommendations,
  score,
  grade,
  onClose,
  starters: startersProp,
  walletMeta
}) {
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
  const {
    systemPrompt
  } = buildAiContext(checks, recommendations, score, grade, walletMeta);
  const exhausted = msgCount >= MAX_MSGS;
  const isPublic = walletMeta?.isPublic;
  const entity = walletMeta?.entity || "";
  const STARTERS = startersProp || (isPublic ? [`Why does ${entity || "this wallet"} score so poorly on privacy?`, "What does this score reveal about institutional Bitcoin management?", "What heuristics flag this wallet as an exchange or institution?", "What would this wallet need to do to score higher?"] : ["How do I freeze dust UTXOs in Sparrow?", `Which of my ${issues.length} issues should I fix first?`, "How does CoinJoin actually work?", "Is my wallet software identifiable from fee rates?"]);
  const send = async text => {
    const msg = text || input.trim();
    if (!msg || loading || exhausted) return;
    setInput("");
    setStarted(true);
    const newCount = msgCount + 1;
    setMsgCount(newCount);
    const next = [...messages, {
      role: "user",
      content: msg
    }];
    setMessages(next);
    setLoading(true);
    try {
      const res = await fetch(WORKER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: next,
          systemPrompt
        })
      });
      if (res.status === 429) {
        setRateLimited(true);
        setMessages(m => [...m, {
          role: "assistant",
          content: "You've reached the daily limit for the Privacy Assistant. It resets at midnight UTC — come back tomorrow."
        }]);
      } else if (!res.ok) {
        setMessages(m => [...m, {
          role: "assistant",
          content: `Server error (${res.status}). Please try again in a moment.`
        }]);
      } else {
        const data = await res.json();
        const reply = data.reply || "Sorry, I couldn't get a response. Try again.";
        setMessages(m => [...m, {
          role: "assistant",
          content: reply
        }]);
      }
    } catch (err) {
      const msg = err?.name === "TypeError" ? "Could not reach the assistant — check your connection and try again." : "Connection error. Please try again.";
      setMessages(m => [...m, {
        role: "assistant",
        content: msg
      }]);
    }
    setLoading(false);
  };
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages, loading]);
  const inputDisabled = exhausted || rateLimited || loading;
  return React.createElement("div", {
    style: {
      position: "fixed",
      inset: 0,
      zIndex: 900,
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "flex-end",
      padding: 16,
      pointerEvents: "none"
    }
  }, React.createElement("div", {
    style: {
      pointerEvents: "all",
      background: T.card,
      border: `1px solid ${T.border}`,
      borderRadius: 20,
      width: "min(420px, 96vw)",
      height: "min(580px, 80vh)",
      display: "flex",
      flexDirection: "column",
      boxShadow: "0 24px 80px #000000aa",
      animation: "fadeUp .3s ease both"
    }
  }, React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "14px 18px",
      borderBottom: `1px solid ${T.border}`
    }
  }, React.createElement("div", {
    style: {
      width: 28,
      height: 28,
      background: T.cyan + "22",
      border: `1px solid ${T.cyan}44`,
      borderRadius: 8,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 14
    }
  }, "\u2726"), React.createElement("div", {
    style: {
      flex: 1
    }
  }, React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: T.text
    }
  }, "Privacy Assistant"), React.createElement("div", {
    style: {
      fontFamily: T.mono,
      fontSize: 9,
      color: T.textDim,
      letterSpacing: 1
    }
  }, "Powered by Claude"), React.createElement("div", {
    style: {
      fontFamily: T.mono,
      fontSize: 9,
      color: T.textDim,
      letterSpacing: 1
    }
  }, "Address never shared")), React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10
    }
  }, !exhausted && !rateLimited && React.createElement("span", {
    style: {
      fontFamily: T.mono,
      fontSize: 9,
      color: T.textDim
    }
  }, MAX_MSGS - msgCount, " msg", MAX_MSGS - msgCount !== 1 ? "s" : "", " left"), React.createElement("button", {
    onClick: onClose,
    style: {
      background: "transparent",
      border: "none",
      color: T.textDim,
      fontSize: 18,
      cursor: "pointer",
      lineHeight: 1
    }
  }, "\u2715"))), React.createElement("div", {
    style: {
      flex: 1,
      overflowY: "auto",
      padding: 16,
      display: "flex",
      flexDirection: "column",
      gap: 12
    }
  }, !started && React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 8
    }
  }, React.createElement("div", {
    style: {
      fontSize: 13,
      color: T.textMid,
      lineHeight: 1.6
    }
  }, isPublic ? React.createElement(React.Fragment, null, "I've analysed the score for ", React.createElement("strong", {
    style: {
      color: T.text
    }
  }, entity), ". Ask me anything about what the chain reveals, why it scores this way, or what the forensic patterns mean.") : React.createElement(React.Fragment, null, "I've read your wallet analysis. Ask me anything about your ", issues.length, " issue", issues.length !== 1 ? "s" : "", " or how to improve your score from ", React.createElement("span", {
    style: {
      color: scoreColor(score)
    }
  }, score), " to 90+.")), React.createElement("div", {
    style: {
      fontFamily: T.mono,
      fontSize: 9,
      color: T.textDim,
      letterSpacing: 1,
      marginTop: 4
    }
  }, "QUICK QUESTIONS"), STARTERS.map((s, i) => React.createElement("button", {
    key: i,
    onClick: () => send(s),
    style: {
      background: T.surface,
      border: `1px solid ${T.border}`,
      borderRadius: 10,
      padding: "9px 14px",
      color: T.textMid,
      fontSize: 12,
      cursor: "pointer",
      textAlign: "left",
      transition: "all .15s"
    },
    onMouseOver: e => {
      e.currentTarget.style.borderColor = T.cyan;
      e.currentTarget.style.color = T.text;
    },
    onMouseOut: e => {
      e.currentTarget.style.borderColor = T.border;
      e.currentTarget.style.color = T.textMid;
    }
  }, s))), messages.map((m, i) => React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      flexDirection: m.role === "user" ? "row-reverse" : "row",
      gap: 8,
      alignItems: "flex-start"
    }
  }, m.role === "assistant" && React.createElement("div", {
    style: {
      width: 22,
      height: 22,
      background: T.cyan + "22",
      border: `1px solid ${T.cyan}44`,
      borderRadius: 6,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 10,
      flexShrink: 0,
      marginTop: 2
    }
  }, "\u2726"), React.createElement("div", {
    style: {
      background: m.role === "user" ? T.cyan + "18" : T.surface,
      border: `1px solid ${m.role === "user" ? T.cyan + "33" : T.borderLo}`,
      borderRadius: m.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
      padding: "10px 14px",
      maxWidth: "85%",
      fontSize: 13,
      color: T.text,
      lineHeight: 1.65
    }
  }, m.role === "assistant" ? renderMd(m.content) : m.content))), loading && React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      alignItems: "flex-start"
    }
  }, React.createElement("div", {
    style: {
      width: 22,
      height: 22,
      background: T.cyan + "22",
      border: `1px solid ${T.cyan}44`,
      borderRadius: 6,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 10,
      flexShrink: 0,
      marginTop: 2
    }
  }, "\u2726"), React.createElement("div", {
    style: {
      background: T.surface,
      border: `1px solid ${T.borderLo}`,
      borderRadius: "14px 14px 14px 4px",
      padding: "12px 16px"
    }
  }, React.createElement("div", {
    style: {
      display: "flex",
      gap: 4
    }
  }, [0, 1, 2].map(i => React.createElement("div", {
    key: i,
    style: {
      width: 6,
      height: 6,
      borderRadius: "50%",
      background: T.cyan,
      animation: `pulse 1.2s ease ${i * .2}s infinite`
    }
  }))))), exhausted && !rateLimited && React.createElement("div", {
    style: {
      background: T.surface,
      border: `1px solid ${T.border}`,
      borderRadius: 12,
      padding: "12px 16px",
      textAlign: "center"
    }
  }, React.createElement("div", {
    style: {
      fontSize: 12,
      color: T.textDim,
      lineHeight: 1.6
    }
  }, "5-message limit reached for this conversation.", React.createElement("br", null), React.createElement("span", {
    style: {
      color: T.textMid
    }
  }, "Start a new scan to open a fresh session."))), React.createElement("div", {
    ref: bottomRef
  })), React.createElement("div", {
    style: {
      padding: "12px 14px",
      borderTop: `1px solid ${T.border}`,
      display: "flex",
      gap: 8
    }
  }, React.createElement("input", {
    ref: inputRef,
    value: input,
    onChange: e => setInput(e.target.value),
    onKeyDown: e => e.key === "Enter" && !e.shiftKey && send(),
    placeholder: inputDisabled ? exhausted ? "Limit reached — start a new scan" : "Rate limited — try tomorrow" : "Ask about your privacy issues…",
    disabled: inputDisabled,
    style: {
      flex: 1,
      background: inputDisabled ? T.bg : T.surface,
      border: `1.5px solid ${T.border}`,
      borderRadius: 10,
      padding: "10px 14px",
      color: inputDisabled ? T.textDim : T.text,
      fontSize: 13,
      outline: "none",
      transition: "border .15s",
      cursor: inputDisabled ? "not-allowed" : "text"
    },
    onFocus: e => !inputDisabled && (e.target.style.borderColor = T.cyan),
    onBlur: e => e.target.style.borderColor = T.border
  }), React.createElement("button", {
    onClick: () => send(),
    disabled: !input.trim() || inputDisabled,
    style: {
      background: input.trim() && !inputDisabled ? T.cyan : T.surface,
      border: `1.5px solid ${input.trim() && !inputDisabled ? T.cyan : T.border}`,
      borderRadius: 10,
      padding: "10px 14px",
      color: input.trim() && !inputDisabled ? T.bg : T.textDim,
      fontSize: 13,
      cursor: input.trim() && !inputDisabled ? "pointer" : "not-allowed",
      transition: "all .2s",
      fontWeight: 700
    }
  }, "\u2192"))));
}
function ExposureFlow({
  txs,
  isMobile,
  onFix
}) {
  const list = (txs || []).slice(0, 8);
  const isRound = v => v >= 100000 && (v % 1000000 === 0 || v % 500000 === 0);
  const isOpReturn = o => o.scriptpubkey_type === "op_return";
  const isDust = o => !isOpReturn(o) && o.value > 0 && o.value < 546;
  const KIND = {
    dust: {
      color: T.red,
      label: "Dust (tracking beacon)"
    },
    reuse: {
      color: T.red,
      label: "Change → address reuse"
    },
    mix: {
      color: T.green,
      label: "Mixed (CoinJoin)"
    },
    round: {
      color: T.btc,
      label: "Round amount (exchange tell)"
    },
    spend: {
      color: T.cyan,
      label: "Ordinary spend"
    },
    data: {
      color: T.textDim,
      label: "Data (OP_RETURN)"
    }
  };
  if (!list.length) return React.createElement("div", {
    style: {
      background: T.card,
      border: `1px solid ${T.border}`,
      borderRadius: 16,
      padding: 28,
      textAlign: "center",
      color: T.textMid,
      fontSize: 14
    }
  }, "No transactions to map \u2014 this address has no spending history to trace.");
  const stat = {
    consolidation: 0,
    coinjoin: 0,
    reuse: 0,
    dust: 0,
    round: 0,
    linked: 0,
    leaky: 0
  };
  list.forEach(tx => {
    const vin = tx.vin || [],
      vout = tx.vout || [];
    const inAddrs = new Set(vin.map(v => v.prevout?.scriptpubkey_address).filter(Boolean));
    const dn = {};
    vout.forEach(o => {
      dn[o.value] = (dn[o.value] || 0) + 1;
    });
    const cj = vout.length >= 5 && Math.max(0, ...Object.values(dn)) >= 3;
    const cons = vin.length >= 4 && vout.length <= 2;
    const dust = vout.some(isDust);
    const reuse = vout.some(o => o.scriptpubkey_address && inAddrs.has(o.scriptpubkey_address));
    const round = vout.some(o => isRound(o.value));
    if (cj) stat.coinjoin++;
    if (cons) {
      stat.consolidation++;
      stat.linked += vin.length;
    }
    if (dust) stat.dust++;
    if (reuse) stat.reuse++;
    if (round && !cj) stat.round++;
    if (cons || dust || reuse || round && !cj) stat.leaky++;
  });
  const verdict = stat.leaky === 0 ? "Clean pass — nothing in these transactions obviously links your coins or identifies you." : `An analyst can tie your activity together from ${stat.leaky} of ${list.length} transaction${list.length !== 1 ? "s" : ""} here.`;
  const findings = [];
  if (stat.consolidation) findings.push({
    ok: false,
    t: `${stat.linked}+ of your addresses provably share one owner (consolidation)`
  });
  if (stat.round) findings.push({
    ok: false,
    t: `${stat.round} withdrawal${stat.round !== 1 ? "s" : ""} fingerprint a KYC exchange (round amounts)`
  });
  if (stat.reuse) findings.push({
    ok: false,
    t: `${stat.reuse} change output${stat.reuse !== 1 ? "s" : ""} returned to an address you'd reused`
  });
  if (stat.dust) findings.push({
    ok: false,
    t: `${stat.dust} transaction${stat.dust !== 1 ? "s" : ""} carry dust tracking beacons`
  });
  if (stat.coinjoin) findings.push({
    ok: true,
    t: `${stat.coinjoin} CoinJoin${stat.coinjoin !== 1 ? "s" : ""} break${stat.coinjoin === 1 ? "s" : ""} the trail — your defence here`
  });
  return React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 14
    }
  }, React.createElement("div", {
    style: {
      background: T.card,
      border: `1px solid ${T.border}`,
      borderRadius: 16,
      padding: isMobile ? "16px 18px" : "20px 24px"
    }
  }, React.createElement("div", {
    style: {
      fontFamily: T.mono,
      fontSize: 9,
      color: T.cyan,
      letterSpacing: 2,
      marginBottom: 8
    }
  }, "EXPOSURE MAP"), React.createElement("div", {
    style: {
      fontFamily: T.serif,
      fontSize: isMobile ? 19 : 22,
      color: T.text,
      fontWeight: 400,
      marginBottom: 8
    }
  }, "What a blockchain analyst sees"), React.createElement("div", {
    style: {
      fontSize: 13,
      color: T.textMid,
      lineHeight: 1.65,
      marginBottom: 14
    }
  }, "Every transaction is public and permanent. Your coins flow left \u2192 right: inputs into each transaction, then out to their destinations. Each output is colored by what it leaks \u2014 this is the exact view surveillance firms build from the chain."), React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: 12
    }
  }, [KIND.spend, KIND.mix, KIND.round, KIND.reuse, KIND.dust, KIND.data].map(k => React.createElement("span", {
    key: k.label,
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      fontFamily: T.mono,
      fontSize: 9,
      color: T.textMid
    }
  }, React.createElement("span", {
    style: {
      width: 10,
      height: 10,
      borderRadius: 2,
      background: k.color,
      flexShrink: 0
    }
  }), k.label)))), React.createElement("div", {
    style: {
      background: stat.leaky ? T.red + "10" : T.green + "12",
      border: `1px solid ${stat.leaky ? T.red + "40" : T.green + "45"}`,
      borderRadius: 16,
      padding: isMobile ? "16px 18px" : "18px 22px"
    }
  }, React.createElement("div", {
    style: {
      fontFamily: T.mono,
      fontSize: 9,
      color: stat.leaky ? T.red : T.green,
      letterSpacing: 2,
      marginBottom: 8
    }
  }, "FORENSIC READOUT"), React.createElement("div", {
    style: {
      fontSize: isMobile ? 14 : 15,
      color: T.text,
      lineHeight: 1.6,
      marginBottom: findings.length ? 12 : 0,
      fontWeight: 500
    }
  }, verdict), findings.length > 0 && React.createElement("ul", {
    style: {
      listStyle: "none",
      display: "flex",
      flexDirection: "column",
      gap: 7,
      padding: 0,
      margin: 0
    }
  }, findings.map((f, i) => React.createElement("li", {
    key: i,
    style: {
      display: "flex",
      gap: 8,
      alignItems: "flex-start",
      fontSize: 13,
      color: T.textMid,
      lineHeight: 1.5
    }
  }, React.createElement("span", {
    style: {
      color: f.ok ? T.green : T.red,
      flexShrink: 0,
      marginTop: 1,
      fontFamily: T.mono
    }
  }, f.ok ? "✓" : "→"), f.t))), stat.leaky > 0 && onFix && React.createElement("button", {
    onClick: onFix,
    style: {
      marginTop: 14,
      background: "transparent",
      border: `1px solid ${T.cyan}55`,
      borderRadius: 10,
      padding: "9px 16px",
      color: T.cyan,
      fontFamily: T.sans,
      fontSize: 13,
      fontWeight: 600,
      cursor: "pointer",
      transition: "all .15s"
    },
    onMouseOver: e => {
      e.currentTarget.style.background = T.cyan + "14";
    },
    onMouseOut: e => {
      e.currentTarget.style.background = "transparent";
    }
  }, "See how to fix these \u2192")), list.map((tx, ti) => {
    const vin = tx.vin || [],
      vout = tx.vout || [];
    const inputAddrs = new Set(vin.map(v => v.prevout?.scriptpubkey_address).filter(Boolean));
    const outs = vout.slice(0, 8);
    const extra = vout.length - outs.length;
    const maxOut = Math.max(...vout.map(o => o.value || 0), 1);
    const inCount = vin.length,
      outCount = vout.length;
    const denom = {};
    vout.forEach(o => {
      denom[o.value] = (denom[o.value] || 0) + 1;
    });
    const coinjoin = outCount >= 5 && Math.max(0, ...Object.values(denom)) >= 3;
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
    if (coinjoin) flags.push({
      l: "CoinJoin",
      c: T.green
    });
    if (consolidation) flags.push({
      l: "Consolidation",
      c: T.red
    });
    if (hasReuse) flags.push({
      l: "Change reuse",
      c: T.red
    });
    if (hasRound && !coinjoin) flags.push({
      l: "Round amount",
      c: T.btc
    });
    if (hasDust) flags.push({
      l: "Dust",
      c: T.red
    });
    if (!flags.length) flags.push({
      l: "No obvious leak",
      c: T.green
    });
    const rowH = 22,
      top = 10,
      H = Math.max(72, outs.length * rowH + top * 2);
    const hubX = 118,
      hubY = H / 2,
      outX = 196,
      barMax = isMobile ? 78 : 100;
    const worst = flags.some(f => f.c === T.red) ? T.red : coinjoin ? T.green : hasRound ? T.btc : T.cyan;
    const age = tx.status?.block_time ? Math.floor((Date.now() / 1000 - tx.status.block_time) / 86400) : null;
    const explain = coinjoin ? "Joined a set of equal-value outputs — a CoinJoin that breaks the trail between your coins." : consolidation ? `Merged ${inCount} separate inputs into one output — those coins are now provably the same owner.` : hasReuse ? "Change returned to an address you'd already used — this links the spend back to your history." : hasDust ? "Contains a dust output — a tiny ‘beacon’ analysts plant to track where your coins go next." : hasRound ? "A round-number output — the classic fingerprint of a withdrawal straight from a KYC exchange." : "No obvious linkage leak here — the inputs and outputs don't tie back to your other coins.";
    return React.createElement("div", {
      key: tx.txid || ti,
      style: {
        background: T.card,
        border: `1px solid ${T.border}`,
        borderRadius: 14,
        padding: isMobile ? "14px 14px" : "16px 20px"
      }
    }, React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginBottom: 10,
        flexWrap: "wrap"
      }
    }, React.createElement("span", {
      style: {
        fontFamily: T.mono,
        fontSize: 10,
        color: T.textDim
      }
    }, fmt.txid(tx.txid)), age != null && React.createElement("span", {
      style: {
        fontFamily: T.mono,
        fontSize: 9,
        color: T.textDim
      }
    }, "\xB7 ", age === 0 ? "today" : age + "d ago"), React.createElement("span", {
      style: {
        marginLeft: "auto",
        display: "flex",
        gap: 5,
        flexWrap: "wrap"
      }
    }, flags.map((f, fi) => React.createElement(Tag, {
      key: fi,
      label: f.l,
      color: f.c,
      size: 9
    })))), React.createElement("svg", {
      viewBox: `0 0 ${outX + barMax + 92} ${H}`,
      style: {
        display: "block",
        width: "100%",
        maxWidth: outX + barMax + 92,
        height: "auto",
        overflow: "visible"
      },
      role: "img",
      "aria-label": `Transaction with ${inCount} input${inCount !== 1 ? "s" : ""} and ${outCount} output${outCount !== 1 ? "s" : ""}`
    }, React.createElement("rect", {
      x: "6",
      y: hubY - 18,
      width: "46",
      height: "36",
      rx: "8",
      fill: T.cardAlt,
      stroke: T.border
    }), React.createElement("text", {
      x: "29",
      y: hubY - 1,
      textAnchor: "middle",
      fontFamily: T.mono,
      fontSize: "12",
      fill: T.text,
      fontWeight: "700"
    }, inCount), React.createElement("text", {
      x: "29",
      y: hubY + 11,
      textAnchor: "middle",
      fontFamily: T.mono,
      fontSize: "7",
      fill: T.textDim,
      letterSpacing: "1"
    }, inCount === 1 ? "INPUT" : "INPUTS"), React.createElement("path", {
      d: `M52 ${hubY} C85 ${hubY} 85 ${hubY} ${hubX} ${hubY}`,
      stroke: T.border,
      strokeWidth: "2",
      fill: "none"
    }), React.createElement("circle", {
      cx: hubX,
      cy: hubY,
      r: "5.5",
      fill: worst,
      style: {
        filter: `drop-shadow(0 0 5px ${worst})`
      }
    }), outs.map((o, oi) => {
      const k = classify(o),
        y = top + oi * rowH + 6,
        w = Math.max(7, o.value / maxOut * barMax);
      return React.createElement("g", {
        key: oi
      }, React.createElement("path", {
        d: `M${hubX + 5} ${hubY} C${(hubX + outX) / 2} ${hubY} ${(hubX + outX) / 2} ${y + 5} ${outX} ${y + 5}`,
        stroke: k.color,
        strokeOpacity: "0.45",
        strokeWidth: "1.6",
        fill: "none"
      }), React.createElement("rect", {
        x: outX,
        y: y,
        width: w,
        height: "10",
        rx: "4",
        fill: k.color
      }, React.createElement("title", null, fmt.btc(o.value), " \u2014 ", k.label)), React.createElement("text", {
        x: outX + w + 6,
        y: y + 9,
        fontFamily: T.mono,
        fontSize: "9",
        fill: T.textDim
      }, fmt.btc(o.value)));
    }), extra > 0 && React.createElement("text", {
      x: outX,
      y: top + outs.length * rowH + 9,
      fontFamily: T.mono,
      fontSize: "9",
      fill: T.textDim
    }, "+", extra, " more output", extra !== 1 ? "s" : "")), React.createElement("div", {
      style: {
        fontSize: 12.5,
        color: T.textMid,
        lineHeight: 1.55,
        marginTop: 10,
        borderTop: `1px solid ${T.borderLo}`,
        paddingTop: 10
      }
    }, explain));
  }));
}
function Dashboard({
  address,
  addrInfo,
  utxos,
  txs,
  isMobile,
  onBack,
  onRescan,
  toast,
  autoShare,
  scanAt,
  defaultSimple,
  simpleMode: simpleModeFromApp,
  onSimpleModeChange,
  onCoach
}) {
  const [tab, setTab] = useState("Fix It");
  const [simpleMode, setSimpleMode] = useState(simpleModeFromApp !== undefined ? simpleModeFromApp : defaultSimple || false);
  const setSimpleModeSync = val => {
    setSimpleMode(val);
    onSimpleModeChange && onSimpleModeChange(val);
  };
  const [shareOpen, setShareOpen] = useState(false);
  const [selectedUtxo, setSelectedUtxo] = useState(null);
  const [doneFixes, setDoneFixes] = useState(() => getDoneFixes(address));
  const toggleDone = key => setDoneFixes(prev => {
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
  const {
    score,
    grade,
    riskLabel,
    riskColor,
    checks,
    recommendations,
    isEmpty
  } = analysis;
  const totalSats = useMemo(() => {
    const funded = addrInfo?.chain_stats?.funded_txo_sum ?? null;
    const spent = addrInfo?.chain_stats?.spent_txo_sum ?? null;
    if (funded !== null && spent !== null) return funded - spent;
    return utxos.reduce((s, u) => s + u.value, 0);
  }, [addrInfo, utxos]);
  const issueCount = checks.filter(c => c.status !== "pass").length;
  const TABS = isMobile ? ["Fix It", "Overview", "Flow", "UTXOs", "Transactions"] : ["Fix It", "Overview", "Flow", "UTXOs", "Transactions", "Methodology"];
  useEffect(() => {
    if (!autoShare) return;
    const t = setTimeout(() => {
      toast.show("Share your score", {
        icon: "🔗",
        color: T.cyan,
        msg: `Grade ${grade} — tap 'Share score' to post it`
      });
    }, 8000);
    return () => clearTimeout(t);
  }, [autoShare, grade, toast]);
  useEffect(() => {
    if (score < 85 || isEmpty) return;
    if (typeof window === "undefined" || typeof window.confetti !== "function") return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const fire = (ratio, opts) => window.confetti({
      particleCount: Math.floor(180 * ratio),
      spread: 70,
      startVelocity: 45,
      ticks: 200,
      origin: {
        y: 0.35
      },
      colors: [T.cyan, T.green, T.btc, T.blue, "#ffffff"],
      disableForReducedMotion: true,
      ...opts
    });
    const id = setTimeout(() => {
      fire(0.25, {
        spread: 26,
        startVelocity: 55
      });
      fire(0.2, {
        spread: 60
      });
      fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.9
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 45
      });
    }, 700);
    return () => clearTimeout(id);
  }, [score, isEmpty]);
  if (isEmpty) return React.createElement("div", {
    role: "main",
    "aria-label": "Empty address",
    style: {
      minHeight: "100vh",
      background: T.bg,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: 32,
      gap: 20
    }
  }, React.createElement("h1", {
    className: "sr-only"
  }, "This address has no on-chain history"), React.createElement("div", {
    style: {
      fontFamily: T.mono,
      fontSize: 10,
      color: T.textDim,
      letterSpacing: 2
    }
  }, "NO ON-CHAIN HISTORY"), React.createElement("div", {
    style: {
      fontFamily: T.serif,
      fontSize: 28,
      color: T.text,
      textAlign: "center",
      fontWeight: 400
    }
  }, "This address has never been used."), React.createElement("div", {
    style: {
      fontSize: 14,
      color: T.textMid,
      maxWidth: 400,
      textAlign: "center",
      lineHeight: 1.7
    }
  }, "No transactions, no UTXOs. There's nothing to score yet \u2014 paste an address that has received Bitcoin at least once."), React.createElement("div", {
    style: {
      fontFamily: T.mono,
      fontSize: 11,
      color: T.textDim,
      background: T.surface,
      border: `1px solid ${T.border}`,
      borderRadius: 10,
      padding: "10px 16px"
    }
  }, address === "DEMO" || address === "DEMO_A" ? "Demo Wallet" : address), React.createElement("button", {
    onClick: onBack,
    style: {
      background: T.cyan,
      border: "none",
      borderRadius: 10,
      padding: "12px 24px",
      color: T.bg,
      fontFamily: T.sans,
      fontWeight: 700,
      fontSize: 14,
      cursor: "pointer"
    }
  }, "\u2190 Try a different address"));
  const handleRescan = () => onRescan(address);
  const exportReport = () => {
    const lines = ["ANONSCORE — PRIVACY REPORT", "===========================", `Address:    ${address}`, `Score:      ${score}/100 (Grade ${grade})`, `Risk:       ${riskLabel}`, `Scanned:    ${scanAt ? new Date(scanAt).toUTCString() : "—"}`, `UTXOs:      ${utxos.length}  |  Transactions: ${txCount}`, "", "SCORE BREAKDOWN (every wallet starts at 100)", "--------------------------------------------", ...checks.filter(c => c.pts).sort((a, b) => a.pts - b.pts).map(c => `  ${c.pts > 0 ? "+" + c.pts : c.pts}\t${c.name}`), `  = ${score}/100`, "", "CHECKS", "------", ...checks.map(c => `[${c.status === "pass" ? "PASS" : c.status === "warn" ? "WARN" : "FAIL"}] ${c.name}: ${c.plain}`), "", "RECOMMENDATIONS", "---------------", ...recommendations.map((r, i) => `${i + 1}. ${r.action} (+${r.impact}pts, ${r.effort})\n   ${r.plain}\n   Options: ${(r.tools || [{
      name: r.tool
    }]).map(t => t.name).join(", ")}`), "", "Generated by AnonScore — anonscore.com — open source, no data stored"];
    const a = document.createElement("a");
    const url = URL.createObjectURL(new Blob([lines.join("\n")], {
      type: "text/plain"
    }));
    a.href = url;
    a.download = `anonscore-${address.slice(0, 8)}-${Date.now()}.txt`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
    toast.show("Report downloaded", {
      icon: "📥",
      color: T.blue
    });
  };
  return React.createElement("div", {
    role: "main",
    "aria-label": `Privacy audit for ${address === "DEMO" || address === "DEMO_A" ? "demo wallet" : address}`,
    style: {
      minHeight: "100vh",
      background: T.bg,
      display: "flex",
      flexDirection: "column",
      paddingBottom: isMobile ? 64 : 0
    }
  }, React.createElement("h1", {
    className: "sr-only"
  }, "Privacy score ", score, " of 100, grade ", grade, " \u2014 ", riskLabel), React.createElement("nav", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: isMobile ? "12px 16px" : "12px 32px",
      borderBottom: `1px solid ${T.border}`,
      background: T.bg,
      position: "sticky",
      top: 0,
      zIndex: 100
    }
  }, React.createElement("button", {
    onClick: onBack,
    style: {
      background: "transparent",
      border: `1.5px solid ${T.border}`,
      borderRadius: 8,
      padding: "7px 12px",
      color: T.textMid,
      fontFamily: T.sans,
      fontSize: 13,
      cursor: "pointer",
      transition: "border .15s"
    },
    onMouseOver: e => e.currentTarget.style.borderColor = T.cyan,
    onMouseOut: e => e.currentTarget.style.borderColor = T.border
  }, "\u2190 Back"), !isMobile && React.createElement("div", {
    style: {
      fontFamily: T.display,
      fontSize: 15,
      letterSpacing: 4,
      fontWeight: 700
    }
  }, "ANON", React.createElement("span", {
    style: {
      color: T.cyan
    }
  }, "SCORE")), React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, React.createElement("div", {
    style: {
      fontFamily: T.mono,
      fontSize: 11,
      color: T.textDim,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    }
  }, address === "DEMO" || address === "DEMO_A" ? "Demo Wallet" : fmt.addr(address)), scanAt && React.createElement("div", {
    style: {
      fontFamily: T.mono,
      fontSize: 9,
      color: T.textDim,
      marginTop: 2
    }
  }, "Scanned ", fmt.age(scanAt / 1000))), React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      flexShrink: 0,
      alignItems: "center"
    }
  }, React.createElement(Tag, {
    label: riskLabel,
    color: riskColor,
    size: 10
  }), isMobile && React.createElement(React.Fragment, null, React.createElement("button", {
    onClick: () => setShareOpen(true),
    style: {
      background: "transparent",
      border: `1.5px solid ${T.border}`,
      borderRadius: 8,
      padding: "6px 10px",
      color: T.textMid,
      fontSize: 12,
      cursor: "pointer"
    }
  }, "Share"), React.createElement("button", {
    onClick: exportReport,
    style: {
      background: "transparent",
      border: `1.5px solid ${T.border}`,
      borderRadius: 8,
      padding: "6px 10px",
      color: T.textMid,
      fontSize: 12,
      cursor: "pointer"
    }
  }, "Export")), !isMobile && React.createElement(React.Fragment, null, React.createElement("button", {
    onClick: handleRescan,
    style: {
      background: "transparent",
      border: `1.5px solid ${T.border}`,
      borderRadius: 8,
      padding: "6px 12px",
      color: T.textMid,
      fontSize: 13,
      cursor: "pointer",
      transition: "all .15s"
    },
    onMouseOver: e => e.currentTarget.style.borderColor = T.cyan,
    onMouseOut: e => e.currentTarget.style.borderColor = T.border
  }, "\u21BB Re-scan"), React.createElement("button", {
    onClick: () => setShareOpen(true),
    style: {
      background: "transparent",
      border: `1.5px solid ${T.border}`,
      borderRadius: 8,
      padding: "6px 12px",
      color: T.textMid,
      fontSize: 13,
      cursor: "pointer",
      transition: "all .15s"
    },
    onMouseOver: e => e.currentTarget.style.borderColor = T.cyan,
    onMouseOut: e => e.currentTarget.style.borderColor = T.border
  }, "Share"), React.createElement("div", {
    style: {
      position: "relative"
    },
    onMouseEnter: e => e.currentTarget.querySelector(".export-tip").style.opacity = 1,
    onMouseLeave: e => e.currentTarget.querySelector(".export-tip").style.opacity = 0
  }, React.createElement("button", {
    onClick: exportReport,
    style: {
      background: "transparent",
      border: `1.5px solid ${T.border}`,
      borderRadius: 8,
      padding: "6px 12px",
      color: T.textMid,
      fontSize: 13,
      cursor: "pointer",
      transition: "all .15s"
    },
    onMouseOver: e => e.currentTarget.style.borderColor = T.cyan,
    onMouseOut: e => e.currentTarget.style.borderColor = T.border
  }, "Export"), React.createElement("div", {
    className: "export-tip",
    style: {
      position: "absolute",
      bottom: "calc(100% + 8px)",
      right: 0,
      background: T.card,
      border: `1px solid ${T.border}`,
      borderRadius: 8,
      padding: "8px 12px",
      fontSize: 11,
      color: T.textMid,
      whiteSpace: "nowrap",
      pointerEvents: "none",
      opacity: 0,
      transition: "opacity .15s",
      zIndex: 50
    }
  }, "Downloads a .txt file of your full results", React.createElement("div", {
    style: {
      position: "absolute",
      bottom: -4,
      right: 16,
      width: 8,
      height: 8,
      background: T.card,
      border: `1px solid ${T.border}`,
      borderRight: "none",
      borderTop: "none",
      transform: "rotate(-45deg)"
    }
  })))))), React.createElement("div", {
    style: {
      flex: 1,
      padding: isMobile ? "12px 12px" : "16px 32px",
      maxWidth: 1100,
      margin: "0 auto",
      width: "100%"
    }
  }, React.createElement("div", {
    style: {
      background: T.card,
      border: `1px solid ${T.border}`,
      borderRadius: 14,
      padding: isMobile ? "12px 14px" : "12px 20px",
      marginBottom: 12,
      display: "flex",
      alignItems: "center",
      gap: isMobile ? 12 : 20,
      flexWrap: "wrap",
      animation: "fadeUp .35s ease both"
    }
  }, React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      flexShrink: 0
    }
  }, React.createElement(ScoreRing, {
    score: score,
    size: 52
  }), React.createElement("div", null, React.createElement("div", {
    style: {
      fontFamily: T.serif,
      fontSize: 20,
      color: riskColor,
      lineHeight: 1,
      animation: `popIn .55s cubic-bezier(.34,1.56,.64,1) .85s both${score < 30 ? ", shake .5s ease 2s" : ""}`,
      transformOrigin: "left center"
    }
  }, "Grade ", grade), React.createElement("div", {
    style: {
      fontFamily: T.mono,
      fontSize: 9,
      color: T.textDim,
      letterSpacing: 1,
      marginTop: 2,
      animation: "fadeIn .35s ease 1.4s both"
    }
  }, score, "/100"))), React.createElement("div", {
    style: {
      width: 1,
      height: 36,
      background: T.border,
      flexShrink: 0
    }
  }), React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      flexShrink: 0
    }
  }, React.createElement("div", {
    style: {
      background: T.red + "18",
      border: `1px solid ${T.red}44`,
      borderRadius: 8,
      padding: "4px 10px",
      display: "flex",
      alignItems: "center",
      gap: 5
    }
  }, React.createElement("span", {
    style: {
      fontFamily: T.mono,
      fontSize: 16,
      fontWeight: 700,
      color: T.red,
      lineHeight: 1
    }
  }, checks.filter(c => c.status === "fail").length), React.createElement("span", {
    style: {
      fontFamily: T.mono,
      fontSize: 9,
      color: T.red,
      letterSpacing: 0.5
    }
  }, "FAIL")), React.createElement("div", {
    style: {
      background: T.amber + "18",
      border: `1px solid ${T.amber}44`,
      borderRadius: 8,
      padding: "4px 10px",
      display: "flex",
      alignItems: "center",
      gap: 5
    }
  }, React.createElement("span", {
    style: {
      fontFamily: T.mono,
      fontSize: 16,
      fontWeight: 700,
      color: T.amber,
      lineHeight: 1
    }
  }, checks.filter(c => c.status === "warn").length), React.createElement("span", {
    style: {
      fontFamily: T.mono,
      fontSize: 9,
      color: T.amber,
      letterSpacing: 0.5
    }
  }, "WARN")), React.createElement("div", {
    style: {
      background: T.green + "18",
      border: `1px solid ${T.green}44`,
      borderRadius: 8,
      padding: "4px 10px",
      display: "flex",
      alignItems: "center",
      gap: 5
    }
  }, React.createElement("span", {
    style: {
      fontFamily: T.mono,
      fontSize: 16,
      fontWeight: 700,
      color: T.green,
      lineHeight: 1
    }
  }, checks.filter(c => c.status === "pass").length), React.createElement("span", {
    style: {
      fontFamily: T.mono,
      fontSize: 9,
      color: T.green,
      letterSpacing: 0.5
    }
  }, "PASS"))), React.createElement("div", {
    style: {
      width: 1,
      height: 36,
      background: T.border,
      flexShrink: 0
    }
  }), React.createElement("div", {
    style: {
      display: "flex",
      gap: isMobile ? 14 : 24,
      flexWrap: "wrap"
    }
  }, [{
    label: "BALANCE",
    val: `₿${(totalSats / 1e8).toFixed(4)}`,
    sub: `${addrInfo?.chain_stats?.funded_txo_count != null ? addrInfo.chain_stats.funded_txo_count - (addrInfo.chain_stats.spent_txo_count || 0) : utxos.length} UTXOs`,
    color: T.blue
  }, {
    label: "TXS",
    val: txCount,
    sub: "total",
    color: T.cyan
  }, {
    label: "VS AVG",
    val: score > 38 ? `+${score - 38}` : `${score - 38}`,
    sub: "avg is 38",
    color: score > 38 ? T.green : T.red
  }].map(s => React.createElement("div", {
    key: s.label
  }, React.createElement("div", {
    style: {
      fontFamily: T.mono,
      fontSize: 8,
      color: T.textDim,
      letterSpacing: 1.5,
      marginBottom: 2
    }
  }, s.label), React.createElement("div", {
    style: {
      fontFamily: T.serif,
      fontSize: 18,
      color: s.color,
      lineHeight: 1
    }
  }, s.val), React.createElement("div", {
    style: {
      fontSize: 10,
      color: T.textDim,
      marginTop: 1
    }
  }, s.sub)))), React.createElement("div", {
    style: {
      marginLeft: "auto",
      flexShrink: 0,
      textAlign: "right"
    }
  }, React.createElement("div", {
    style: {
      fontFamily: T.mono,
      fontSize: 8,
      color: T.textDim,
      letterSpacing: 1.5,
      marginBottom: 2
    }
  }, "TOP 3 FIXES"), React.createElement("div", {
    style: {
      fontFamily: T.serif,
      fontSize: 18,
      color: T.green,
      lineHeight: 1
    }
  }, "+", recommendations.slice(0, 3).reduce((a, r) => a + r.impact, 0), " pts"), React.createElement("div", {
    style: {
      fontSize: 10,
      color: T.textDim,
      marginTop: 1
    }
  }, "potential gain"))), React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 8,
      marginBottom: 14
    }
  }, !isMobile && React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      overflowX: "auto",
      paddingBottom: 2
    }
  }, TABS.map(t => React.createElement(Pill, {
    key: t,
    active: tab === t,
    onClick: () => setTab(t)
  }, t))), React.createElement("button", {
    onClick: () => setSimpleModeSync(!simpleMode),
    style: {
      flexShrink: 0,
      display: "flex",
      alignItems: "center",
      gap: 7,
      background: simpleMode ? T.cyan : T.surface,
      border: `1.5px solid ${simpleMode ? T.cyan : T.border}`,
      borderRadius: 20,
      padding: "8px 16px",
      cursor: "pointer",
      transition: "all .2s",
      boxShadow: simpleMode ? `0 0 12px ${T.cyanMid}` : "none"
    },
    onMouseOver: e => {
      e.currentTarget.style.borderColor = T.cyan;
      if (!simpleMode) e.currentTarget.style.background = T.cyan + "18";
    },
    onMouseOut: e => {
      e.currentTarget.style.borderColor = simpleMode ? T.cyan : T.border;
      if (!simpleMode) e.currentTarget.style.background = T.surface;
    }
  }, React.createElement("span", {
    style: {
      fontSize: 14
    }
  }, "\uD83D\uDCAC"), React.createElement("span", {
    style: {
      fontSize: 12,
      fontFamily: T.sans,
      fontWeight: 700,
      color: simpleMode ? T.bg : T.textMid,
      whiteSpace: "nowrap"
    }
  }, simpleMode ? "✓ Plain English ON" : "Plain English"))), tab === "Fix It" && React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 10
    }
  }, React.createElement("div", {
    style: {
      fontSize: 13,
      color: T.textMid,
      marginBottom: 4
    }
  }, "Sorted by impact. Fixing the top 3 alone could raise your score by ", React.createElement("strong", {
    style: {
      color: T.cyan
    }
  }, recommendations.slice(0, 3).reduce((a, r) => a + r.impact, 0), " points"), "."), React.createElement("div", {
    style: {
      background: T.card,
      border: `1px solid ${T.cyan}33`,
      borderRadius: 16,
      overflow: "hidden",
      marginBottom: 2
    }
  }, React.createElement("div", {
    style: {
      display: "flex",
      gap: 0,
      borderBottom: `1px solid ${T.borderLo}`
    }
  }, [{
    icon: "✕",
    label: "Address never sent"
  }, {
    icon: "✕",
    label: "No data stored"
  }, {
    icon: "✕",
    label: "Not used for training"
  }].map((badge, i) => React.createElement("div", {
    key: i,
    style: {
      flex: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 5,
      padding: "7px 8px",
      borderRight: i < 2 ? `1px solid ${T.borderLo}` : undefined,
      background: T.greenLo
    }
  }, React.createElement("span", {
    style: {
      fontFamily: T.mono,
      fontSize: 9,
      color: T.green,
      fontWeight: 700
    }
  }, badge.icon), React.createElement("span", {
    style: {
      fontFamily: T.mono,
      fontSize: 9,
      color: T.green,
      letterSpacing: 0.3,
      whiteSpace: "nowrap"
    }
  }, badge.label)))), React.createElement("button", {
    onClick: openAi,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 14,
      padding: "16px 18px",
      cursor: "pointer",
      textAlign: "left",
      width: "100%",
      background: "transparent",
      border: "none",
      transition: "background .15s"
    },
    onMouseOver: e => e.currentTarget.style.background = T.cyan + "0a",
    onMouseOut: e => e.currentTarget.style.background = "transparent"
  }, React.createElement("div", {
    style: {
      width: 36,
      height: 36,
      background: T.cyan + "18",
      border: `1px solid ${T.cyan}33`,
      borderRadius: 10,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 16,
      flexShrink: 0
    }
  }, "\u2726"), React.createElement("div", {
    style: {
      flex: 1
    }
  }, React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 700,
      color: T.text,
      marginBottom: 3
    }
  }, "Ask the Privacy Assistant"), React.createElement("div", {
    style: {
      fontSize: 12,
      color: T.textMid,
      lineHeight: 1.55
    }
  }, "Get step-by-step guidance for your ", checks.filter(c => c.status !== "pass").length, " specific issues. Only your score and issue names are shared \u2014 never your address. ", React.createElement("span", {
    style: {
      color: T.textDim
    }
  }, "5 questions per session."))), React.createElement("div", {
    style: {
      flexShrink: 0,
      textAlign: "center"
    }
  }, React.createElement("div", {
    style: {
      background: T.cyan,
      borderRadius: 8,
      padding: "7px 14px",
      color: T.bg,
      fontSize: 12,
      fontWeight: 700,
      whiteSpace: "nowrap"
    }
  }, "Ask now \u2192"))), onCoach && React.createElement("div", {
    style: {
      borderTop: `1px solid ${T.borderLo}`,
      padding: "8px 18px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 8,
      flexWrap: "wrap"
    }
  }, React.createElement("span", {
    style: {
      fontFamily: T.mono,
      fontSize: 10,
      color: T.textDim
    }
  }, "Hit the 5-question cap?"), React.createElement("button", {
    onClick: onCoach,
    style: {
      background: "none",
      border: "none",
      padding: 0,
      fontFamily: T.mono,
      fontSize: 10,
      color: T.cyan,
      cursor: "pointer",
      textDecoration: "underline",
      textUnderlineOffset: 3
    }
  }, "Join the Coach early-access waitlist \u2192"))), recommendations.map((r, i) => {
    const done = doneFixes.has(r.key);
    const simple = SIMPLE.recs[r.key];
    const displayAction = simpleMode && simple ? simple.action : r.action;
    const displayPlain = simpleMode && simple ? simple.plain : r.plain;
    return React.createElement("div", {
      key: r.key || i,
      className: done ? "" : "lift",
      style: {
        background: done ? T.greenLo : T.card,
        border: `1px solid ${done ? T.green + "44" : T.border}`,
        borderLeft: done ? undefined : `3px solid ${r.status === "fail" ? T.red : r.status === "warn" ? T.amber : T.green}`,
        borderRadius: 16,
        padding: isMobile ? "18px 16px" : "20px 24px",
        display: "flex",
        gap: isMobile ? 12 : 20,
        animation: `fadeUp .35s ease ${i * .06}s both`,
        flexDirection: isMobile ? "column" : "row",
        transition: "border-color .2s, background-color .2s, filter .2s, transform .28s cubic-bezier(.16,.84,.44,1), box-shadow .28s",
        filter: done ? "opacity(0.65)" : "none"
      },
      onMouseEnter: e => {
        if (!done) {
          e.currentTarget.style.borderColor = T.cyan + "55";
          e.currentTarget.style.boxShadow = `0 10px 34px -14px ${T.cyan}77`;
        }
      },
      onMouseLeave: e => {
        if (!done) {
          e.currentTarget.style.borderColor = T.border;
          e.currentTarget.style.boxShadow = "none";
        }
      }
    }, React.createElement("div", {
      style: {
        fontFamily: T.mono,
        fontSize: 11,
        color: T.textDim,
        flexShrink: 0,
        paddingTop: 2,
        minWidth: 28
      }
    }, "0", i + 1), React.createElement("div", {
      style: {
        flex: 1
      }
    }, React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginBottom: 8
      }
    }, React.createElement("span", {
      key: done ? "done" : "todo",
      style: {
        fontSize: 18,
        display: "inline-block",
        animation: done ? "checkPop .45s cubic-bezier(.34,1.56,.64,1) both" : undefined
      }
    }, done ? "✅" : r.icon), React.createElement("div", {
      style: {
        fontFamily: T.serif,
        fontSize: isMobile ? 17 : 20,
        color: done ? T.green : T.text,
        fontWeight: 400,
        textDecoration: done ? "line-through" : "none",
        transition: "color .25s ease"
      }
    }, displayAction)), !done && React.createElement(React.Fragment, null, React.createElement("div", {
      style: {
        fontSize: 14,
        color: T.textMid,
        lineHeight: 1.7,
        marginBottom: 10
      }
    }, displayPlain), !simpleMode && React.createElement("div", {
      style: {
        fontSize: 12,
        color: T.textDim,
        lineHeight: 1.6,
        background: T.surface,
        borderRadius: 8,
        padding: "10px 14px"
      }
    }, React.createElement("strong", {
      style: {
        color: T.textMid
      }
    }, "How:"), " ", r.detail), React.createElement("div", {
      style: {
        marginTop: 10,
        display: "flex",
        flexWrap: "wrap",
        gap: 6,
        alignItems: "center"
      }
    }, React.createElement("span", {
      style: {
        fontFamily: T.mono,
        fontSize: 9,
        color: T.textDim,
        letterSpacing: 1
      }
    }, "OPTIONS:"), (r.tools || [{
      name: r.tool,
      note: ""
    }]).map((t, ti) => {
      const href = toolLink(t.name);
      const aff = toolIsAffiliate(t.name);
      const base = {
        fontFamily: T.mono,
        fontSize: 9,
        padding: "3px 8px",
        borderRadius: 4,
        background: T.cyan + "18",
        color: T.cyan,
        border: `1px solid ${T.cyan}30`,
        letterSpacing: 0.3,
        textDecoration: "none",
        cursor: href ? "pointer" : t.note ? "help" : "default"
      };
      const label = aff ? `${t.name} · affiliate` : t.name;
      return href ? React.createElement("a", {
        key: ti,
        href: href,
        target: "_blank",
        rel: "noopener noreferrer nofollow",
        title: aff ? `${t.note ? t.note + " · " : ""}AnonScore earns a referral when you sign up — see /how-we-get-paid` : t.note,
        style: base
      }, label) : React.createElement("span", {
        key: ti,
        title: t.note,
        style: base
      }, t.name);
    })), !simpleMode && (r.tools || []).length > 0 && React.createElement("div", {
      style: {
        marginTop: 6,
        fontSize: 11,
        color: T.textDim,
        lineHeight: 1.55
      }
    }, (r.tools || []).map((t, ti) => t.note ? React.createElement("span", {
      key: ti
    }, React.createElement("span", {
      style: {
        color: T.textMid
      }
    }, t.name), " \u2014 ", t.note, ti < r.tools.length - 1 ? " · " : "") : null)))), React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 8,
        alignItems: isMobile ? "flex-start" : "flex-end",
        flexShrink: 0
      }
    }, React.createElement("div", {
      style: {
        fontFamily: T.serif,
        fontSize: 22,
        color: T.green
      }
    }, "+", r.impact, "pts"), React.createElement(Tag, {
      label: r.effort,
      color: r.effort === "Easy" ? T.green : r.effort === "Medium" ? T.amber : T.textMid,
      size: 9
    }), React.createElement("button", {
      onClick: () => toggleDone(r.key),
      style: {
        background: done ? T.green : "transparent",
        border: `1.5px solid ${done ? T.green : T.border}`,
        borderRadius: 8,
        padding: "5px 10px",
        color: done ? T.bg : T.textDim,
        fontSize: 11,
        cursor: "pointer",
        transition: "all .2s",
        whiteSpace: "nowrap"
      }
    }, done ? "✓ Done" : "Mark done")));
  }), React.createElement("div", {
    style: {
      background: T.greenLo,
      border: `1px solid ${T.green}33`,
      borderRadius: 14,
      padding: "18px 22px",
      display: "flex",
      gap: 14,
      alignItems: "center"
    }
  }, React.createElement("div", {
    style: {
      fontSize: 24
    }
  }, "\uD83C\uDFAF"), React.createElement("div", null, React.createElement("div", {
    style: {
      fontFamily: T.serif,
      fontSize: 17,
      color: T.text,
      fontWeight: 400
    }
  }, "After all fixes, projected score: ", React.createElement("span", {
    style: {
      color: T.green
    }
  }, Math.min(score + recommendations.reduce((a, r) => a + r.impact, 0), 97), "/100")), React.createElement("div", {
    style: {
      fontSize: 13,
      color: T.textMid,
      marginTop: 4
    }
  }, "Estimated: 1\u20133 weeks, depending on CoinJoin wait times."))), React.createElement("div", {
    style: {
      background: T.surface,
      border: `1px solid ${T.border}`,
      borderRadius: 14,
      padding: "18px 22px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: 12
    }
  }, React.createElement("div", null, React.createElement("div", {
    style: {
      fontFamily: T.serif,
      fontSize: 17,
      color: T.text,
      fontWeight: 400
    }
  }, "Share your privacy score"), React.createElement("div", {
    style: {
      fontSize: 13,
      color: T.textMid,
      marginTop: 3
    }
  }, "Let your Nostr or Twitter followers check theirs.")), React.createElement("button", {
    onClick: () => setShareOpen(true),
    style: {
      background: T.cyan,
      border: "none",
      borderRadius: 10,
      padding: "11px 20px",
      color: T.bg,
      fontFamily: T.sans,
      fontWeight: 700,
      fontSize: 14,
      cursor: "pointer"
    }
  }, "Share Grade ", grade, " \u2192"))), tab === "Overview" && React.createElement(React.Fragment, null, React.createElement(ScoreBreakdown, {
    checks: checks,
    score: score,
    isMobile: isMobile,
    simpleMode: simpleMode
  }), React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
      gap: 12
    }
  }, React.createElement("div", {
    style: {
      background: T.card,
      border: `1px solid ${T.border}`,
      borderRadius: 16,
      padding: 22
    }
  }, React.createElement("div", {
    style: {
      fontFamily: T.mono,
      fontSize: 9,
      color: T.textDim,
      letterSpacing: 2,
      marginBottom: 16
    }
  }, "PRIVACY CHECKS"), checks.map((c, i) => {
    const s = SIMPLE.checks[c.key];
    const displayName = simpleMode && s ? s.name : c.name;
    const displayPlain = simpleMode && s ? (c.status === "fail" ? s.fail_detail : c.status === "warn" ? s.warn_detail : s.pass_detail) || c.plain : c.plain;
    return React.createElement("div", {
      key: c.key,
      style: {
        display: "flex",
        alignItems: "flex-start",
        gap: 10,
        padding: "10px 12px",
        margin: "0 -12px",
        borderRadius: 8,
        borderBottom: i < checks.length - 1 ? `1px solid ${T.borderLo}` : undefined,
        animation: `fadeUp .3s ease ${i * .04}s both`,
        opacity: 0,
        transition: "background-color .15s"
      },
      onMouseEnter: e => e.currentTarget.style.background = T.surface,
      onMouseLeave: e => e.currentTarget.style.background = "transparent"
    }, React.createElement("div", {
      style: {
        width: 7,
        height: 7,
        borderRadius: "50%",
        background: c.status === "pass" ? T.green : c.status === "warn" ? T.btc : T.red,
        flexShrink: 0,
        marginTop: 5
      }
    }), React.createElement("div", {
      style: {
        flex: 1
      }
    }, React.createElement("div", {
      style: {
        fontSize: 13,
        fontWeight: 600,
        color: T.text
      }
    }, displayName), React.createElement("div", {
      style: {
        fontSize: 12,
        color: T.textMid,
        marginTop: 3,
        lineHeight: 1.55
      }
    }, displayPlain)), React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: 4,
        flexShrink: 0
      }
    }, React.createElement(Tag, {
      label: c.status === "pass" ? "Pass" : c.status === "warn" ? "Warn" : "Fail",
      color: c.status === "pass" ? T.green : c.status === "warn" ? T.btc : T.red,
      size: 9
    }), typeof c.pts === "number" && c.pts !== 0 && React.createElement("span", {
      title: "Effect on your score",
      style: {
        fontFamily: T.mono,
        fontSize: 10,
        fontWeight: 700,
        color: c.pts > 0 ? T.green : T.red
      }
    }, c.pts > 0 ? `+${c.pts}` : c.pts)));
  })), React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 12
    }
  }, React.createElement("div", {
    style: {
      background: T.card,
      border: `1px solid ${T.border}`,
      borderRadius: 16,
      padding: 22
    }
  }, React.createElement("div", {
    style: {
      fontFamily: T.mono,
      fontSize: 9,
      color: T.textDim,
      letterSpacing: 2,
      marginBottom: 14
    }
  }, "UTXO BREAKDOWN"), React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 9
    }
  }, utxos.slice(0, 6).map((u, i) => {
    const risk = classifyUtxo(u);
    const col = RISK_META[risk].color;
    const pct = Math.max(4, u.value / Math.max(totalSats, 1) * 100);
    return React.createElement("div", {
      key: i,
      style: {
        display: "flex",
        alignItems: "center",
        gap: 10
      }
    }, React.createElement("div", {
      style: {
        fontFamily: T.mono,
        fontSize: 9,
        color: T.textDim,
        width: 56,
        flexShrink: 0
      }
    }, fmt.txid(u.txid)), React.createElement("div", {
      style: {
        flex: 1,
        height: 7,
        background: T.surface,
        borderRadius: 4,
        overflow: "hidden"
      }
    }, React.createElement("div", {
      style: {
        height: "100%",
        width: `${pct}%`,
        background: col,
        borderRadius: 4,
        "--w": `${pct}%`,
        animation: `barGrow .8s cubic-bezier(.16,.84,.44,1) ${i * .07}s both`
      }
    })), React.createElement("div", {
      style: {
        fontFamily: T.mono,
        fontSize: 10,
        color: col,
        width: 70,
        textAlign: "right"
      }
    }, fmt.btc(u.value)));
  }))), React.createElement("div", {
    style: {
      background: T.cyanLo,
      border: `1px solid ${T.cyanMid}`,
      borderRadius: 14,
      padding: 20
    }
  }, React.createElement("div", {
    style: {
      fontFamily: T.mono,
      fontSize: 9,
      color: T.cyan,
      letterSpacing: 1.5,
      marginBottom: 12
    }
  }, "YOUR SCORE VS AVERAGE"), React.createElement("div", {
    style: {
      display: "flex",
      gap: 20
    }
  }, [{
    v: score,
    l: "YOUR SCORE",
    c: riskColor
  }, {
    v: 38,
    l: "AVERAGE",
    c: T.textMid
  }, {
    v: 97,
    l: "ACHIEVABLE",
    c: T.green
  }].map(s => React.createElement("div", {
    key: s.l,
    style: {
      textAlign: "center"
    }
  }, React.createElement("div", {
    style: {
      fontFamily: T.serif,
      fontSize: 32,
      color: s.c,
      fontWeight: 400
    }
  }, s.v), React.createElement("div", {
    style: {
      fontFamily: T.mono,
      fontSize: 8,
      color: T.textDim,
      letterSpacing: 1,
      marginTop: 2
    }
  }, s.l)))), React.createElement("button", {
    onClick: () => setShareOpen(true),
    style: {
      marginTop: 14,
      width: "100%",
      background: T.cyan,
      border: "none",
      borderRadius: 8,
      padding: "10px",
      color: T.bg,
      fontFamily: T.sans,
      fontWeight: 700,
      fontSize: 13,
      cursor: "pointer",
      transition: "opacity .15s"
    },
    onMouseOver: e => e.currentTarget.style.opacity = ".85",
    onMouseOut: e => e.currentTarget.style.opacity = "1"
  }, "Share my score \u2192")), checks.length >= 3 && React.createElement(RadarChart, {
    checks: checks,
    size: isMobile ? 200 : 220
  })))), tab === "UTXOs" && React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 8
    }
  }, React.createElement("div", {
    style: {
      fontSize: 13,
      color: T.textMid,
      marginBottom: 6
    }
  }, React.createElement("strong", {
    style: {
      color: T.text
    }
  }, utxos.length), " unspent outputs \u2014 each is a separate chunk of Bitcoin. Click any row to expand."), utxos.length === 0 && React.createElement("div", {
    style: {
      background: T.card,
      border: `1px solid ${T.border}`,
      borderRadius: 14,
      padding: 40,
      textAlign: "center",
      fontSize: 14,
      color: T.textMid
    }
  }, "No unspent outputs. This address has been fully spent."), utxos.map((u, i) => {
    const risk = classifyUtxo(u);
    const {
      color
    } = RISK_META[risk];
    const flags = [];
    if (u.value < 1000) flags.push({
      t: "Dust — freeze this",
      c: T.red
    });
    if (u.value >= 100000 && u.value % 100000 === 0) flags.push({
      t: "Round amount",
      c: T.btc
    });
    const open = selectedUtxo === i;
    return React.createElement("div", {
      key: u.txid + i,
      onClick: () => setSelectedUtxo(open ? null : i),
      style: {
        background: T.card,
        border: `1.5px solid ${open ? color : T.border}`,
        borderRadius: 14,
        padding: isMobile ? "14px" : "16px 20px",
        cursor: "pointer",
        transition: "all .15s",
        animation: `fadeUp .3s ease ${i * .05}s both`,
        opacity: 0
      },
      onMouseEnter: e => !open && (e.currentTarget.style.borderColor = T.cyan + "44"),
      onMouseLeave: e => !open && (e.currentTarget.style.borderColor = T.border)
    }, React.createElement("div", {
      style: {
        display: "flex",
        alignItems: isMobile ? "flex-start" : "center",
        flexDirection: isMobile ? "column" : "row",
        gap: isMobile ? 8 : 18
      }
    }, React.createElement("div", {
      style: {
        flex: 1
      }
    }, React.createElement("div", {
      style: {
        fontFamily: T.serif,
        fontSize: isMobile ? 20 : 26,
        color,
        lineHeight: 1
      }
    }, fmt.btc(u.value)), React.createElement("div", {
      style: {
        fontFamily: T.mono,
        fontSize: 10,
        color: T.textDim,
        marginTop: 4
      }
    }, fmt.txid(u.txid), " \xB7 ", u.status?.block_time ? fmt.age(u.status.block_time) : "unconfirmed")), React.createElement("div", {
      style: {
        display: "flex",
        flexWrap: "wrap",
        gap: 6
      }
    }, flags.length === 0 ? React.createElement(Tag, {
      label: "Clean",
      color: T.green,
      size: 9
    }) : flags.map((f, fi) => React.createElement(Tag, {
      key: fi,
      label: f.t,
      color: f.c,
      size: 9
    })), React.createElement(Tag, {
      label: RISK_META[risk].label,
      color: color,
      size: 9
    }))), open && React.createElement("div", {
      style: {
        marginTop: 12,
        paddingTop: 12,
        borderTop: `1px solid ${T.borderLo}`,
        display: "flex",
        flexWrap: "wrap",
        gap: 20
      }
    }, React.createElement("div", null, React.createElement("div", {
      style: {
        fontFamily: T.mono,
        fontSize: 9,
        color: T.textDim,
        marginBottom: 4
      }
    }, "TXID"), React.createElement("div", {
      style: {
        fontFamily: T.mono,
        fontSize: 11,
        color: T.textMid,
        wordBreak: "break-all"
      }
    }, u.txid)), React.createElement("div", null, React.createElement("div", {
      style: {
        fontFamily: T.mono,
        fontSize: 9,
        color: T.textDim,
        marginBottom: 4
      }
    }, "SATOSHIS"), React.createElement("div", {
      style: {
        fontFamily: T.mono,
        fontSize: 11,
        color: T.textMid
      }
    }, u.value.toLocaleString())), React.createElement("div", null, React.createElement("div", {
      style: {
        fontFamily: T.mono,
        fontSize: 9,
        color: T.textDim,
        marginBottom: 4
      }
    }, "CONFIRMED"), React.createElement("div", {
      style: {
        fontFamily: T.mono,
        fontSize: 11,
        color: u.status?.confirmed ? T.green : T.btc
      }
    }, u.status?.confirmed ? "Yes" : "Pending")), u.scriptpubkey_type && React.createElement("div", null, React.createElement("div", {
      style: {
        fontFamily: T.mono,
        fontSize: 9,
        color: T.textDim,
        marginBottom: 4
      }
    }, "SCRIPT TYPE"), React.createElement("div", {
      style: {
        fontFamily: T.mono,
        fontSize: 11,
        color: T.textMid
      }
    }, u.scriptpubkey_type))));
  })), tab === "Transactions" && React.createElement("div", null, React.createElement("div", {
    style: {
      fontSize: 13,
      color: T.textMid,
      marginBottom: 12
    }
  }, React.createElement("strong", {
    style: {
      color: T.text
    }
  }, txs.length), " transactions. We flag CoinJoins, unsafe consolidations, and round amounts."), React.createElement("div", {
    style: {
      background: T.card,
      border: `1px solid ${T.border}`,
      borderRadius: 16,
      overflow: "hidden"
    }
  }, React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "130px 90px 60px 60px 1fr 110px",
      padding: "10px 20px",
      borderBottom: `1px solid ${T.borderLo}`
    }
  }, ["TXID", "DATE", "IN", "OUT", "FLAGS", "FEE"].map(h => React.createElement("div", {
    key: h,
    style: {
      fontFamily: T.mono,
      fontSize: 9,
      color: T.textDim,
      letterSpacing: 1.5
    }
  }, h))), txs.slice(0, 20).map((tx, i) => {
    const flags = [];
    if (tx.vout?.length >= 5) flags.push({
      l: "CoinJoin",
      c: T.green
    });
    if (tx.vin?.length >= 4 && tx.vout?.length <= 2) flags.push({
      l: "Consolidation",
      c: T.red
    });
    if (tx.vout?.[0]?.value >= 100000 && tx.vout[0].value % 100000 === 0) flags.push({
      l: "Round amount",
      c: T.amber
    });
    if (!flags.length) flags.push({
      l: "Standard",
      c: T.textDim
    });
    return React.createElement("div", {
      key: tx.txid,
      style: {
        display: "grid",
        gridTemplateColumns: "130px 90px 60px 60px 1fr 110px",
        padding: "10px 20px",
        borderBottom: `1px solid ${T.borderLo}`,
        alignItems: "center",
        animation: `fadeUp .3s ease ${i * .03}s both`,
        opacity: 0,
        transition: "background .12s"
      },
      onMouseEnter: e => e.currentTarget.style.background = T.surface,
      onMouseLeave: e => e.currentTarget.style.background = "transparent"
    }, React.createElement("span", {
      style: {
        fontFamily: T.mono,
        fontSize: 11,
        color: T.textMid
      }
    }, fmt.txid(tx.txid)), React.createElement("span", {
      style: {
        fontFamily: T.mono,
        fontSize: 11,
        color: T.textDim
      }
    }, tx.status?.block_time ? fmt.age(tx.status.block_time) : "—"), React.createElement("span", {
      style: {
        fontFamily: T.mono,
        fontSize: 11,
        color: T.textDim
      }
    }, tx.vin?.length || "?"), React.createElement("span", {
      style: {
        fontFamily: T.mono,
        fontSize: 11,
        color: T.textDim
      }
    }, tx.vout?.length || "?"), React.createElement("div", {
      style: {
        display: "flex",
        gap: 5,
        flexWrap: "wrap"
      }
    }, flags.map((f, fi) => React.createElement(Tag, {
      key: fi,
      label: f.l,
      color: f.c,
      size: 9
    }))), React.createElement("span", {
      style: {
        fontFamily: T.mono,
        fontSize: 11,
        color: T.textDim
      }
    }, tx.fee ? `${tx.fee.toLocaleString()} sats` : "—"));
  }))), tab === "Flow" && React.createElement(ExposureFlow, {
    txs: txs,
    isMobile: isMobile,
    onFix: () => setTab("Fix It")
  }), tab === "Methodology" && React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 12
    }
  }, React.createElement("div", {
    style: {
      background: T.card,
      border: `1px solid ${T.border}`,
      borderRadius: 16,
      padding: 28
    }
  }, React.createElement("div", {
    style: {
      fontFamily: T.mono,
      fontSize: 9,
      color: T.textDim,
      letterSpacing: 2,
      marginBottom: 16
    }
  }, "HOW SCORING WORKS"), React.createElement("div", {
    style: {
      fontFamily: T.serif,
      fontSize: 22,
      color: T.text,
      marginBottom: 12,
      fontWeight: 400
    }
  }, "10 heuristics, each weighted by severity"), React.createElement("div", {
    style: {
      fontSize: 14,
      color: T.textMid,
      lineHeight: 1.75,
      marginBottom: 20
    }
  }, "Every wallet starts at 100. Each detected issue deducts points based on its real-world impact on traceability. We use the same heuristics published in open blockchain research \u2014 nothing proprietary."), React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
      gap: 10
    }
  }, [{
    check: "Address Reuse",
    deduct: "–7 to –28",
    why: "Permanent public link between all transactions on this address.",
    sev: "critical"
  }, {
    check: "CoinJoin Usage",
    deduct: "+4 to +12",
    why: "Breaks transaction graph. Positive score if detected. Heavy penalty if absent.",
    sev: "high"
  }, {
    check: "Dust Attack",
    deduct: "–5 to –12",
    why: "Tracking beacons planted by surveillance firms. Spending them links your cluster.",
    sev: "high"
  }, {
    check: "Round Amounts",
    deduct: "–5 to –10",
    why: "0.1 BTC is a known KYC exchange withdrawal pattern flagged by Chainalysis.",
    sev: "high"
  }, {
    check: "Unsafe Consolidation",
    deduct: "–4 to –10",
    why: "Merging inputs from different sources permanently links their histories.",
    sev: "high"
  }, {
    check: "Fee Fingerprinting",
    deduct: "–6",
    why: "Identical fee rates across transactions identify your wallet software.",
    sev: "medium"
  }, {
    check: "Change Address Reuse",
    deduct: "–10",
    why: "Returning change to an input address exposes your full balance.",
    sev: "high"
  }, {
    check: "UTXO Count",
    deduct: "–3 to –8",
    why: "Too many = consolidation pressure. Too few = full balance exposed per spend.",
    sev: "medium"
  }, {
    check: "Balance Concentration",
    deduct: "–5",
    why: "90%+ in a single UTXO reveals near-total holdings on every transaction.",
    sev: "medium"
  }, {
    check: "Script Type Mix",
    deduct: "–4",
    why: "Using legacy + SegWit addresses creates cross-UTXO patterns analysts can exploit.",
    sev: "low"
  }].map((row, i) => React.createElement("div", {
    key: i,
    style: {
      background: T.surface,
      borderRadius: 10,
      padding: "14px 16px",
      border: `1px solid ${T.borderLo}`
    }
  }, React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 6
    }
  }, React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      color: T.text
    }
  }, row.check), React.createElement(Tag, {
    label: row.deduct,
    color: row.deduct.startsWith("+") ? T.green : RISK_META[row.sev]?.color || T.red,
    size: 9
  })), React.createElement("div", {
    style: {
      fontSize: 12,
      color: T.textMid,
      lineHeight: 1.55
    }
  }, row.why))))), React.createElement("div", {
    style: {
      background: T.card,
      border: `1px solid ${T.border}`,
      borderRadius: 16,
      padding: 24
    }
  }, React.createElement("div", {
    style: {
      fontFamily: T.mono,
      fontSize: 9,
      color: T.textDim,
      letterSpacing: 2,
      marginBottom: 12
    }
  }, "DATA SOURCES"), React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 10
    }
  }, [{
    src: "Blockstream Esplora API",
    desc: "Public blockchain data — UTXOs, transactions, address stats. Read-only. Same source your wallet uses."
  }, {
    src: "OXT Research (2023)",
    desc: "Wallet address reuse rates — 91% of wallets reuse at least one address."
  }, {
    src: "Chainalysis 2023 Annual Report",
    desc: "$1.1B surveillance contract revenue figure. 1B+ transactions processed for governments."
  }, {
    src: "Blockstream Research",
    desc: "1-in-3 wallets contain dust UTXOs planted by tracking services."
  }].map((s, i) => React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      gap: 12,
      paddingBottom: 10,
      borderBottom: i < 3 ? `1px solid ${T.borderLo}` : undefined
    }
  }, React.createElement("div", {
    style: {
      width: 4,
      borderRadius: 2,
      background: T.cyan,
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }), React.createElement("div", null, React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      color: T.text,
      marginBottom: 3
    }
  }, s.src), React.createElement("div", {
    style: {
      fontSize: 12,
      color: T.textMid,
      lineHeight: 1.55
    }
  }, s.desc)))))), React.createElement("div", {
    style: {
      background: T.cyanLo,
      border: `1px solid ${T.cyanMid}`,
      borderRadius: 14,
      padding: "16px 20px",
      fontSize: 13,
      color: T.textMid,
      lineHeight: 1.65
    }
  }, React.createElement("strong", {
    style: {
      color: T.cyan
    }
  }, "Open source:"), " All 10 heuristics are implemented in plain JavaScript in this tool's source. No black box. View and audit the full scoring logic at ", React.createElement("a", {
    href: "https://github.com/netasset/anonscore",
    target: "_blank",
    rel: "noopener noreferrer",
    style: {
      color: T.cyan
    }
  }, "github.com/netasset/anonscore"), "."))), isMobile && React.createElement("div", {
    style: {
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      background: T.card,
      borderTop: `1px solid ${T.border}`,
      display: "flex",
      zIndex: 200
    }
  }, ["Fix It", "Overview", "Flow", "UTXOs", "Transactions"].map(t => React.createElement("button", {
    key: t,
    onClick: () => setTab(t),
    style: {
      flex: 1,
      padding: "10px 0 8px",
      background: "transparent",
      border: "none",
      borderTop: `2px solid ${tab === t ? T.cyan : "transparent"}`,
      color: tab === t ? T.cyan : T.textDim,
      fontFamily: T.mono,
      fontSize: 8,
      letterSpacing: .5,
      cursor: "pointer",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 3
    }
  }, React.createElement("span", {
    style: {
      fontSize: 15
    }
  }, t === "Fix It" ? "★" : t === "Overview" ? "◎" : t === "Flow" ? "⋔" : t === "Transactions" ? "↔" : "⬡"), t))), shareOpen && React.createElement(ShareCard, {
    score: score,
    grade: grade,
    checks: checks,
    address: address,
    isLightning: false,
    onClose: () => setShareOpen(false)
  }), (() => {
    const matchedCase = CASE_FILES.find(c => c.address === address);
    const walletMeta = matchedCase ? {
      isPublic: true,
      entity: matchedCase.entity,
      caseTitle: matchedCase.title,
      utxos,
      txs
    } : {
      isPublic: false
    };
    return React.createElement(React.Fragment, null, aiStage === "consent" && React.createElement(AiConsentGate, {
      score: score,
      grade: grade,
      checks: checks,
      recommendations: recommendations,
      walletMeta: walletMeta,
      onAccept: () => setAiStage("chat"),
      onDecline: () => setAiStage(null)
    }), aiStage === "chat" && React.createElement(AiAssistant, {
      checks: checks,
      recommendations: recommendations,
      score: score,
      grade: grade,
      walletMeta: walletMeta,
      onClose: () => setAiStage(null)
    }));
  })(), aiStage === null && React.createElement("div", {
    style: {
      position: "fixed",
      bottom: isMobile ? 72 : 28,
      right: isMobile ? 12 : 28,
      zIndex: 500,
      width: aiWidgetMin ? "auto" : "min(340px, calc(100vw - 24px))",
      animation: "fadeUp .4s ease both",
      filter: "drop-shadow(0 8px 32px #000000aa)"
    }
  }, aiWidgetMin ? React.createElement("button", {
    onClick: () => setAiWidgetMin(false),
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      background: T.card,
      border: `1.5px solid ${T.cyan}55`,
      borderRadius: 99,
      padding: "10px 18px 10px 14px",
      cursor: "pointer",
      transition: "all .2s",
      boxShadow: `0 0 24px ${T.cyan}22`
    },
    onMouseOver: e => e.currentTarget.style.borderColor = T.cyan,
    onMouseOut: e => e.currentTarget.style.borderColor = T.cyan + "55"
  }, React.createElement("div", {
    style: {
      width: 28,
      height: 28,
      background: T.cyan + "22",
      border: `1px solid ${T.cyan}44`,
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 14,
      flexShrink: 0
    }
  }, "\u2726"), React.createElement("div", null, React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: T.text,
      lineHeight: 1
    }
  }, "Privacy Assistant"), React.createElement("div", {
    style: {
      fontSize: 11,
      color: T.cyan,
      marginTop: 2
    }
  }, "Ask about your ", issueCount, " issues \u2192"))) : React.createElement("div", {
    style: {
      background: T.card,
      border: `1.5px solid ${T.cyan}44`,
      borderRadius: 20,
      overflow: "hidden",
      boxShadow: `0 0 0 1px ${T.cyan}11, 0 24px 64px #000000bb`
    }
  }, React.createElement("div", {
    style: {
      display: "flex",
      borderBottom: `1px solid ${T.borderLo}`,
      background: T.greenLo
    }
  }, ["✕ Address never sent", "✕ Nothing stored", "✕ Not for training"].map((t, i) => React.createElement("div", {
    key: i,
    style: {
      flex: 1,
      textAlign: "center",
      padding: "6px 4px",
      borderRight: i < 2 ? `1px solid ${T.borderLo}` : undefined
    }
  }, React.createElement("span", {
    style: {
      fontFamily: T.mono,
      fontSize: 9,
      color: T.green,
      letterSpacing: 0.2
    }
  }, t)))), React.createElement("div", {
    style: {
      padding: "20px 22px 22px"
    }
  }, React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between",
      marginBottom: 14
    }
  }, React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12
    }
  }, React.createElement("div", {
    style: {
      width: 44,
      height: 44,
      background: T.cyan + "18",
      border: `1.5px solid ${T.cyan}44`,
      borderRadius: 13,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 20,
      flexShrink: 0,
      boxShadow: `0 0 16px ${T.cyan}22`
    }
  }, "\u2726"), React.createElement("div", null, React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 700,
      color: T.text,
      lineHeight: 1
    }
  }, "Privacy Assistant"), React.createElement("div", {
    style: {
      fontFamily: T.mono,
      fontSize: 9,
      color: T.textDim,
      letterSpacing: 1,
      marginTop: 3
    }
  }, "POWERED BY CLAUDE \xB7 FREE"))), React.createElement("button", {
    onClick: () => setAiWidgetMin(true),
    style: {
      background: "transparent",
      border: `1px solid #ffffff44`,
      borderRadius: 7,
      padding: "4px 9px",
      color: "#ffffff",
      fontSize: 12,
      cursor: "pointer",
      lineHeight: 1,
      transition: "all .15s",
      flexShrink: 0
    },
    onMouseOver: e => e.currentTarget.style.borderColor = "#ffffff88",
    onMouseOut: e => e.currentTarget.style.borderColor = "#ffffff44"
  }, "\u2014 minimize")), React.createElement("div", {
    style: {
      fontSize: 13,
      color: T.textMid,
      lineHeight: 1.6,
      marginBottom: 16
    }
  }, "Get step-by-step instructions for your ", React.createElement("strong", {
    style: {
      color: T.text
    }
  }, issueCount, " specific issue", issueCount !== 1 ? "s" : ""), " \u2014 which wallet to use, what to click, in plain English."), React.createElement("button", {
    onClick: openAi,
    style: {
      width: "100%",
      padding: "14px 20px",
      background: `linear-gradient(135deg, ${T.cyan}, #0ea5e9)`,
      border: "none",
      borderRadius: 12,
      color: T.bg,
      fontFamily: T.sans,
      fontWeight: 700,
      fontSize: 15,
      cursor: "pointer",
      transition: "opacity .15s",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      boxShadow: `0 4px 20px ${T.cyan}44`
    },
    onMouseOver: e => e.currentTarget.style.opacity = ".88",
    onMouseOut: e => e.currentTarget.style.opacity = "1"
  }, React.createElement("span", null, "\u2726"), React.createElement("span", null, "Ask about your ", issueCount, " issues \u2192"))))), isMobile && React.createElement("nav", {
    style: {
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 200,
      background: T.bg,
      borderTop: `1px solid ${T.border}`,
      display: "flex",
      height: 64,
      paddingBottom: "env(safe-area-inset-bottom, 0px)"
    }
  }, TABS.map(t => {
    const icons = {
      "Fix It": "★",
      "Overview": "◎",
      "UTXOs": "⬡",
      "Transactions": "⇄",
      "Methodology": "≡"
    };
    return React.createElement("button", {
      key: t,
      onClick: () => setTab(t),
      style: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 3,
        background: "none",
        border: "none",
        cursor: "pointer",
        borderTop: `2px solid ${tab === t ? T.cyan : "transparent"}`,
        transition: "border-color .15s"
      }
    }, React.createElement("span", {
      style: {
        fontSize: 14,
        color: tab === t ? T.cyan : T.textDim
      }
    }, icons[t]), React.createElement("span", {
      style: {
        fontFamily: T.mono,
        fontSize: 8,
        color: tab === t ? T.cyan : T.textDim,
        letterSpacing: 0.5
      }
    }, t.toUpperCase()));
  })));
}
function LightningDashboard({
  nodeId,
  nodeData,
  channels,
  isMobile,
  onBack,
  onRescan,
  toast
}) {
  const [tab, setTab] = useState("Fix It");
  const {
    score,
    grade,
    checks,
    recommendations
  } = useMemo(() => runLightningEngine(nodeData, channels), [nodeData, channels]);
  const col = scoreColor(score);
  const fails = checks.filter(c => c.status === "fail").length;
  const warns = checks.filter(c => c.status === "warn").length;
  const passes = checks.filter(c => c.status === "pass").length;
  const [expandedCheck, setExpandedCheck] = useState(null);
  const [doneFixes, setDoneFixes] = useState(() => getDoneFixes(nodeId || "ln"));
  const [shareOpen, setShareOpen] = useState(false);
  const [aiStage, setAiStage] = useState(null);
  const toggleDone = k => setDoneFixes(p => {
    const n = new Set(p);
    n.has(k) ? n.delete(k) : n.add(k);
    saveDoneFixes(nodeId || "ln", n);
    return n;
  });
  const totalCap = channels.reduce((s, c) => s + (c.capacity || 0), 0);
  const alias = (nodeData.alias || "Unknown Node").replace(/[\x00-\x1f\x7f]/g, "").trim().slice(0, 50) || "Unknown Node";
  const pubkeyShort = nodeId ? `${nodeId.slice(0, 10)}…${nodeId.slice(-6)}` : "—";
  const TABS = isMobile ? ["Fix It", "Checks", "Channels"] : ["Fix It", "Checks", "Channels", "Methodology"];
  const handleRescan = () => onRescan && onRescan(nodeId, false, "ln_pubkey");
  return React.createElement("div", {
    role: "main",
    "aria-label": `Lightning privacy audit for ${nodeData?.alias || nodeId.slice(0, 16)}`,
    style: {
      minHeight: "100vh",
      background: T.bg,
      display: "flex",
      flexDirection: "column"
    }
  }, React.createElement("h1", {
    className: "sr-only"
  }, "Lightning privacy score ", score, " of 100, grade ", grade), shareOpen && React.createElement(ShareCard, {
    score: score,
    grade: grade,
    checks: checks,
    address: nodeId,
    isLightning: true,
    onClose: () => setShareOpen(false)
  }), React.createElement("nav", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: isMobile ? "12px 16px" : "12px 32px",
      borderBottom: `1px solid ${T.border}`,
      background: T.bg,
      position: "sticky",
      top: 0,
      zIndex: 100
    }
  }, React.createElement("button", {
    onClick: onBack,
    style: {
      background: "transparent",
      border: `1.5px solid ${T.border}`,
      borderRadius: 8,
      padding: "7px 12px",
      color: T.textMid,
      fontFamily: T.sans,
      fontSize: 13,
      cursor: "pointer",
      transition: "border .15s"
    },
    onMouseOver: e => e.currentTarget.style.borderColor = T.ln,
    onMouseOut: e => e.currentTarget.style.borderColor = T.border
  }, "\u2190 Back"), !isMobile && React.createElement("div", {
    style: {
      fontFamily: T.display,
      fontSize: 15,
      letterSpacing: 4,
      fontWeight: 700
    }
  }, "ANON", React.createElement("span", {
    style: {
      color: T.cyan
    }
  }, "SCORE")), React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, React.createElement("div", {
    style: {
      fontFamily: T.mono,
      fontSize: 11,
      color: T.textDim,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    }
  }, "\u26A1 ", alias !== "Unknown Node" ? alias : nodeId ? `${nodeId.slice(0, 10)}…${nodeId.slice(-6)}` : "Lightning Node"), React.createElement("div", {
    style: {
      fontFamily: T.mono,
      fontSize: 9,
      color: T.textDim,
      marginTop: 2
    }
  }, "Lightning node audit")), React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      flexShrink: 0,
      alignItems: "center"
    }
  }, React.createElement(Tag, {
    label: grade,
    color: col,
    size: 10
  }), !isMobile && React.createElement(React.Fragment, null, React.createElement("button", {
    onClick: handleRescan,
    style: {
      background: "transparent",
      border: `1.5px solid ${T.border}`,
      borderRadius: 8,
      padding: "6px 12px",
      color: T.textMid,
      fontSize: 13,
      cursor: "pointer",
      transition: "all .15s"
    },
    onMouseOver: e => e.currentTarget.style.borderColor = T.ln,
    onMouseOut: e => e.currentTarget.style.borderColor = T.border
  }, "\u21BB Re-scan"), React.createElement("button", {
    onClick: () => setShareOpen(true),
    style: {
      background: "transparent",
      border: `1.5px solid ${T.border}`,
      borderRadius: 8,
      padding: "6px 12px",
      color: T.textMid,
      fontSize: 13,
      cursor: "pointer",
      transition: "all .15s"
    },
    onMouseOver: e => e.currentTarget.style.borderColor = T.ln,
    onMouseOut: e => e.currentTarget.style.borderColor = T.border
  }, "Share")), isMobile && React.createElement(React.Fragment, null, React.createElement("button", {
    onClick: () => setShareOpen(true),
    style: {
      background: "transparent",
      border: `1.5px solid ${T.border}`,
      borderRadius: 8,
      padding: "6px 10px",
      color: T.textMid,
      fontSize: 12,
      cursor: "pointer"
    }
  }, "Share"), React.createElement("button", {
    onClick: handleRescan,
    style: {
      background: "transparent",
      border: `1.5px solid ${T.border}`,
      borderRadius: 8,
      padding: "6px 10px",
      color: T.textMid,
      fontSize: 12,
      cursor: "pointer"
    }
  }, "\u21BB")))), React.createElement("div", {
    style: {
      flex: 1,
      padding: isMobile ? "12px 12px" : "16px 32px",
      maxWidth: 1100,
      margin: "0 auto",
      width: "100%"
    }
  }, React.createElement("div", {
    style: {
      background: T.card,
      border: `1px solid ${T.border}`,
      borderRadius: 14,
      padding: isMobile ? "12px 14px" : "12px 20px",
      marginBottom: 12,
      display: "flex",
      alignItems: "center",
      gap: isMobile ? 12 : 20,
      flexWrap: "wrap",
      animation: "fadeUp .35s ease both"
    }
  }, React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      flexShrink: 0
    }
  }, React.createElement(ScoreRing, {
    score: score,
    size: 52
  }), React.createElement("div", null, React.createElement("div", {
    style: {
      fontFamily: T.serif,
      fontSize: 20,
      color: col,
      lineHeight: 1
    }
  }, "Grade ", grade), React.createElement("div", {
    style: {
      fontFamily: T.mono,
      fontSize: 9,
      color: T.textDim,
      letterSpacing: 1,
      marginTop: 2
    }
  }, score, "/100"))), React.createElement("div", {
    style: {
      width: 1,
      height: 36,
      background: T.border,
      flexShrink: 0
    }
  }), React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      flexShrink: 0
    }
  }, React.createElement("div", {
    style: {
      background: T.red + "18",
      border: `1px solid ${T.red}44`,
      borderRadius: 8,
      padding: "4px 10px",
      display: "flex",
      alignItems: "center",
      gap: 5
    }
  }, React.createElement("span", {
    style: {
      fontFamily: T.mono,
      fontSize: 16,
      fontWeight: 700,
      color: T.red,
      lineHeight: 1
    }
  }, fails), React.createElement("span", {
    style: {
      fontFamily: T.mono,
      fontSize: 9,
      color: T.red,
      letterSpacing: 0.5
    }
  }, "FAIL")), React.createElement("div", {
    style: {
      background: T.amber + "18",
      border: `1px solid ${T.amber}44`,
      borderRadius: 8,
      padding: "4px 10px",
      display: "flex",
      alignItems: "center",
      gap: 5
    }
  }, React.createElement("span", {
    style: {
      fontFamily: T.mono,
      fontSize: 16,
      fontWeight: 700,
      color: T.amber,
      lineHeight: 1
    }
  }, warns), React.createElement("span", {
    style: {
      fontFamily: T.mono,
      fontSize: 9,
      color: T.amber,
      letterSpacing: 0.5
    }
  }, "WARN")), React.createElement("div", {
    style: {
      background: T.green + "18",
      border: `1px solid ${T.green}44`,
      borderRadius: 8,
      padding: "4px 10px",
      display: "flex",
      alignItems: "center",
      gap: 5
    }
  }, React.createElement("span", {
    style: {
      fontFamily: T.mono,
      fontSize: 16,
      fontWeight: 700,
      color: T.green,
      lineHeight: 1
    }
  }, passes), React.createElement("span", {
    style: {
      fontFamily: T.mono,
      fontSize: 9,
      color: T.green,
      letterSpacing: 0.5
    }
  }, "PASS"))), React.createElement("div", {
    style: {
      width: 1,
      height: 36,
      background: T.border,
      flexShrink: 0
    }
  }), React.createElement("div", {
    style: {
      display: "flex",
      gap: isMobile ? 14 : 24,
      flexWrap: "wrap"
    }
  }, [{
    label: "CHANNELS",
    val: channels.length,
    sub: "open",
    color: T.blue
  }, {
    label: "CAPACITY",
    val: `₿${(totalCap / 1e8).toFixed(3)}`,
    sub: "total",
    color: T.btc
  }, {
    label: "VS TARGET",
    val: score >= 70 ? `+${score - 70}` : `${score - 70}`,
    sub: "target: 70+",
    color: score >= 70 ? T.green : T.red
  }].map(s => React.createElement("div", {
    key: s.label
  }, React.createElement("div", {
    style: {
      fontFamily: T.mono,
      fontSize: 8,
      color: T.textDim,
      letterSpacing: 1.5,
      marginBottom: 2
    }
  }, s.label), React.createElement("div", {
    style: {
      fontFamily: T.serif,
      fontSize: 18,
      color: s.color,
      lineHeight: 1
    }
  }, s.val), React.createElement("div", {
    style: {
      fontSize: 10,
      color: T.textDim,
      marginTop: 1
    }
  }, s.sub)))), React.createElement("div", {
    style: {
      marginLeft: "auto",
      flexShrink: 0,
      textAlign: "right"
    }
  }, React.createElement("div", {
    style: {
      fontFamily: T.mono,
      fontSize: 8,
      color: T.textDim,
      letterSpacing: 1.5,
      marginBottom: 2
    }
  }, "TOP FIXES"), React.createElement("div", {
    style: {
      fontFamily: T.serif,
      fontSize: 18,
      color: T.green,
      lineHeight: 1
    }
  }, "+", recommendations.slice(0, 3).reduce((a, r) => a + r.impact, 0), " pts"), React.createElement("div", {
    style: {
      fontSize: 10,
      color: T.textDim,
      marginTop: 1
    }
  }, "potential gain"))), !isMobile && React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      marginBottom: 14,
      overflowX: "auto",
      paddingBottom: 2
    }
  }, TABS.map(t => React.createElement(Pill, {
    key: t,
    active: tab === t,
    onClick: () => setTab(t),
    color: T.ln
  }, t))), isMobile && React.createElement("div", {
    style: {
      marginBottom: 14
    }
  }), tab === "Fix It" && React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 16
    }
  }, score >= 80 && React.createElement("div", {
    style: {
      background: T.greenLo,
      border: `1px solid ${T.green}44`,
      borderRadius: 14,
      padding: "18px 20px",
      textAlign: "center"
    }
  }, React.createElement("div", {
    style: {
      fontFamily: T.serif,
      fontSize: 22,
      color: T.green,
      marginBottom: 4
    }
  }, "Strong privacy posture \u26A1"), React.createElement("div", {
    style: {
      fontSize: 13,
      color: T.textMid
    }
  }, "Your Lightning node is well-configured. Keep monitoring as your channel peers change.")), recommendations.length === 0 && score < 80 && React.createElement("div", {
    style: {
      fontSize: 13,
      color: T.textMid,
      padding: "12px 0"
    }
  }, "No specific fixes generated. Check the Checks tab for detail."), aiStage !== "chat" && React.createElement("div", {
    style: {
      background: T.card,
      border: `1px solid ${T.ln}33`,
      borderRadius: 16,
      overflow: "hidden",
      marginBottom: 2
    }
  }, React.createElement("div", {
    style: {
      display: "flex",
      gap: 0,
      borderBottom: `1px solid ${T.borderLo}`
    }
  }, [{
    icon: "✕",
    label: "Node ID never sent"
  }, {
    icon: "✕",
    label: "No data stored"
  }, {
    icon: "✕",
    label: "Not used for training"
  }].map((badge, i) => React.createElement("div", {
    key: i,
    style: {
      flex: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 5,
      padding: "7px 8px",
      borderRight: i < 2 ? `1px solid ${T.borderLo}` : undefined,
      background: T.greenLo
    }
  }, React.createElement("span", {
    style: {
      fontFamily: T.mono,
      fontSize: 9,
      color: T.green,
      fontWeight: 700
    }
  }, badge.icon), React.createElement("span", {
    style: {
      fontFamily: T.mono,
      fontSize: 9,
      color: T.green,
      letterSpacing: 0.3,
      whiteSpace: "nowrap"
    }
  }, badge.label)))), React.createElement("button", {
    onClick: () => setAiStage("consent"),
    style: {
      display: "flex",
      alignItems: "center",
      gap: 14,
      padding: "16px 18px",
      cursor: "pointer",
      textAlign: "left",
      width: "100%",
      background: "transparent",
      border: "none",
      transition: "background .15s"
    },
    onMouseOver: e => e.currentTarget.style.background = T.ln + "0a",
    onMouseOut: e => e.currentTarget.style.background = "transparent"
  }, React.createElement("div", {
    style: {
      width: 36,
      height: 36,
      background: T.ln + "18",
      border: `1px solid ${T.ln}33`,
      borderRadius: 10,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 16,
      flexShrink: 0
    }
  }, "\u26A1"), React.createElement("div", {
    style: {
      flex: 1
    }
  }, React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 700,
      color: T.text,
      marginBottom: 3
    }
  }, "Ask the Privacy Assistant"), React.createElement("div", {
    style: {
      fontSize: 12,
      color: T.textMid,
      lineHeight: 1.55
    }
  }, "Get step-by-step guidance for your ", checks.filter(c => c.status !== "pass").length, " Lightning issues. Only your score and issue names are shared \u2014 never your node ID. ", React.createElement("span", {
    style: {
      color: T.textDim
    }
  }, "5 questions per session."))), React.createElement("div", {
    style: {
      flexShrink: 0
    }
  }, React.createElement("div", {
    style: {
      background: T.ln,
      borderRadius: 8,
      padding: "7px 14px",
      color: T.bg,
      fontSize: 12,
      fontWeight: 700,
      whiteSpace: "nowrap"
    }
  }, "Ask now \u2192"))), aiStage === "consent" && React.createElement("div", {
    style: {
      padding: "14px 18px",
      borderTop: `1px solid ${T.borderLo}`,
      background: T.lnLo
    }
  }, React.createElement("div", {
    style: {
      fontSize: 13,
      color: T.textMid,
      marginBottom: 12,
      lineHeight: 1.6
    }
  }, "The assistant will receive your score (", score, "/100) and issue names only. No node ID, no channel data, no on-chain info. Powered by Claude."), React.createElement("div", {
    style: {
      display: "flex",
      gap: 8
    }
  }, React.createElement("button", {
    onClick: () => setAiStage("chat"),
    style: {
      flex: 1,
      background: T.ln,
      border: "none",
      borderRadius: 8,
      padding: "10px",
      color: T.bg,
      fontFamily: T.sans,
      fontWeight: 700,
      fontSize: 13,
      cursor: "pointer"
    }
  }, "I understand \u2014 open assistant"), React.createElement("button", {
    onClick: () => setAiStage(null),
    style: {
      background: "transparent",
      border: `1.5px solid ${T.border}`,
      borderRadius: 8,
      padding: "10px 14px",
      color: T.textDim,
      fontSize: 12,
      cursor: "pointer"
    }
  }, "Cancel")))), aiStage === "chat" && React.createElement(AiAssistant, {
    checks: checks,
    recommendations: recommendations,
    score: score,
    grade: grade,
    onClose: () => setAiStage(null),
    starters: [`Which of my ${checks.filter(c => c.status !== "pass").length} issues should I fix first?`, "How do I switch my node to Tor-only?", "What's the actual risk of peering with a KYC exchange?", "How do I set a pseudonymous node alias?"]
  }), recommendations.map((r, i) => {
    const done = doneFixes.has(r.key);
    return React.createElement("div", {
      key: r.key,
      style: {
        background: done ? T.greenLo : T.card,
        border: `1px solid ${done ? T.green + "44" : T.border}`,
        borderRadius: 14,
        overflow: "hidden",
        transition: "all .2s"
      }
    }, React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "flex-start",
        gap: 14,
        padding: "18px 20px"
      }
    }, React.createElement("div", {
      style: {
        fontFamily: T.mono,
        fontSize: 11,
        color: done ? T.green : T.ln,
        minWidth: 24,
        marginTop: 2
      }
    }, String(i + 1).padStart(2, "0")), React.createElement("div", {
      style: {
        flex: 1
      }
    }, React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginBottom: 6
      }
    }, React.createElement("div", {
      style: {
        fontSize: 14,
        fontWeight: 700,
        color: done ? T.textDim : T.text,
        textDecoration: done ? "line-through" : "none"
      }
    }, r.action), React.createElement("span", {
      style: {
        fontFamily: T.mono,
        fontSize: 10,
        color: T.green,
        background: T.greenLo,
        padding: "3px 8px",
        borderRadius: 5
      }
    }, "+", r.impact, " pts"), React.createElement(Tag, {
      label: r.effort,
      color: r.effort === "Easy" ? T.green : r.effort === "Medium" ? T.amber : T.red,
      size: 9
    })), React.createElement("div", {
      style: {
        fontSize: 13,
        color: T.textMid,
        lineHeight: 1.6,
        marginBottom: r.tools?.length ? 12 : 0
      }
    }, r.detail), r.tools?.length > 0 && React.createElement("div", {
      style: {
        display: "flex",
        flexWrap: "wrap",
        gap: 6
      }
    }, r.tools.map(t => {
      const href = toolLink(t.name);
      const aff = toolIsAffiliate(t.name);
      const inner = React.createElement(React.Fragment, null, React.createElement("div", {
        style: {
          fontSize: 11,
          fontWeight: 600,
          color: T.text
        }
      }, t.name, aff ? " · affiliate" : ""), React.createElement("div", {
        style: {
          fontSize: 10,
          color: T.textDim
        }
      }, t.note));
      const base = {
        background: T.surface,
        border: `1px solid ${T.border}`,
        borderRadius: 8,
        padding: "5px 10px",
        textDecoration: "none",
        display: "block"
      };
      return href ? React.createElement("a", {
        key: t.name,
        href: href,
        target: "_blank",
        rel: "noopener noreferrer nofollow",
        style: base
      }, inner) : React.createElement("div", {
        key: t.name,
        style: base
      }, inner);
    }))), React.createElement("button", {
      onClick: () => toggleDone(r.key),
      style: {
        background: done ? T.green : "transparent",
        border: `1.5px solid ${done ? T.green : T.border}`,
        borderRadius: 8,
        padding: "6px 10px",
        color: done ? T.bg : T.textDim,
        fontSize: 11,
        cursor: "pointer",
        transition: "all .2s",
        whiteSpace: "nowrap"
      }
    }, done ? "✓ Done" : "Mark done")));
  }), React.createElement("div", {
    style: {
      background: T.surface,
      border: `1px solid ${T.border}`,
      borderRadius: 14,
      padding: "18px 22px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: 12
    }
  }, React.createElement("div", null, React.createElement("div", {
    style: {
      fontFamily: T.serif,
      fontSize: 17,
      color: T.text,
      fontWeight: 400
    }
  }, "Share your node score"), React.createElement("div", {
    style: {
      fontSize: 13,
      color: T.textMid,
      marginTop: 3
    }
  }, "Let your Nostr or Twitter followers check theirs.")), React.createElement("button", {
    onClick: () => setShareOpen(true),
    style: {
      background: T.ln,
      border: "none",
      borderRadius: 10,
      padding: "11px 20px",
      color: T.bg,
      fontFamily: T.sans,
      fontWeight: 700,
      fontSize: 14,
      cursor: "pointer"
    }
  }, "Share Grade ", grade, " \u2192")), React.createElement("div", {
    style: {
      background: T.lnLo,
      border: `1px solid ${T.lnMid}`,
      borderRadius: 14,
      padding: "16px 20px",
      marginTop: 4
    }
  }, React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      color: T.ln,
      marginBottom: 6
    }
  }, "\u26A1 What Lightning scores \u2014 and what it can't"), React.createElement("div", {
    style: {
      fontSize: 13,
      color: T.textMid,
      lineHeight: 1.7
    }
  }, "Lightning ", React.createElement("em", null, "payments"), " are private by design \u2014 they don't appear on-chain. What we score is your ", React.createElement("strong", {
    style: {
      color: T.text
    }
  }, "node's public footprint"), ": IP exposure, KYC peer connections, on-chain channel history, and identity linkage. If you use a custodial wallet (Wallet of Satoshi, Strike), there's nothing to score \u2014 your provider sees everything."))), tab === "Checks" && React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 6
    }
  }, React.createElement("div", {
    style: {
      fontFamily: T.mono,
      fontSize: 9,
      color: T.textDim,
      letterSpacing: 2,
      marginBottom: 8
    }
  }, checks.length, " CHECKS \xB7 LIGHTNING NODE PRIVACY"), checks.map(c => {
    const statusColor = c.status === "pass" ? T.green : c.status === "warn" ? T.amber : T.red;
    const sevColor = {
      critical: T.red,
      high: T.btc,
      medium: T.amber,
      low: T.blue,
      clean: T.green
    }[c.sev] || T.textDim;
    const open = expandedCheck === c.key;
    return React.createElement("div", {
      key: c.key,
      style: {
        borderRadius: 12,
        border: `1px solid ${open ? statusColor + "44" : T.border}`,
        overflow: "hidden",
        transition: "border-color .2s"
      }
    }, React.createElement("div", {
      onClick: () => setExpandedCheck(open ? null : c.key),
      style: {
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "13px 16px",
        cursor: "pointer",
        background: open ? statusColor + "0d" : "transparent"
      }
    }, React.createElement("div", {
      style: {
        width: 8,
        height: 8,
        borderRadius: "50%",
        background: statusColor,
        flexShrink: 0,
        boxShadow: `0 0 6px ${statusColor}`
      }
    }), React.createElement("div", {
      style: {
        flex: 1,
        fontSize: 13,
        fontWeight: 600,
        color: T.text
      }
    }, c.name), React.createElement(Tag, {
      label: c.sev.toUpperCase(),
      color: sevColor,
      size: 9
    }), React.createElement("span", {
      style: {
        color: T.textDim,
        fontSize: 11,
        marginLeft: 4
      }
    }, open ? "▲" : "▼")), open && React.createElement("div", {
      style: {
        padding: "0 16px 14px 36px",
        borderTop: `1px solid ${T.borderLo}`
      }
    }, React.createElement("p", {
      style: {
        fontSize: 13,
        color: T.textMid,
        lineHeight: 1.65,
        marginTop: 12,
        marginBottom: 0
      }
    }, c.detail)));
  })), tab === "Channels" && React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 6
    }
  }, React.createElement("div", {
    style: {
      fontFamily: T.mono,
      fontSize: 9,
      color: T.textDim,
      letterSpacing: 2,
      marginBottom: 8
    }
  }, channels.length, " OPEN CHANNELS \xB7 PEER RISK ANALYSIS"), channels.length === 0 && React.createElement("div", {
    style: {
      fontSize: 13,
      color: T.textMid,
      padding: "20px 0"
    }
  }, "No open channels found for this node."), channels.map((ch, i) => {
    const peerPub = ch.node1_pub === nodeId ? ch.node2_pub : ch.node1_pub;
    const isKyc = isKycNode(ch.node1_pub) || isKycNode(ch.node2_pub);
    const pct = totalCap > 0 ? Math.round(ch.capacity / totalCap * 100) : 0;
    const riskColor = isKyc ? T.red : T.green;
    const riskLabel = isKyc ? "KYC" : "OK";
    return React.createElement("div", {
      key: i,
      style: {
        display: "flex",
        alignItems: "center",
        gap: 14,
        background: T.card,
        border: `1px solid ${isKyc ? T.red + "44" : T.border}`,
        borderRadius: 12,
        padding: "12px 16px"
      }
    }, React.createElement("div", {
      style: {
        width: 8,
        height: 8,
        borderRadius: "50%",
        background: riskColor,
        flexShrink: 0,
        boxShadow: `0 0 5px ${riskColor}`
      }
    }), React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, React.createElement("div", {
      style: {
        fontFamily: T.mono,
        fontSize: 11,
        color: T.textMid,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis"
      }
    }, peerPub ? `${peerPub.slice(0, 14)}…` : `Channel ${i + 1}`), React.createElement("div", {
      style: {
        height: 3,
        background: T.border,
        borderRadius: 2,
        marginTop: 6
      }
    }, React.createElement("div", {
      style: {
        height: "100%",
        width: `${pct}%`,
        background: isKyc ? T.red : T.ln,
        borderRadius: 2
      }
    }))), React.createElement("div", {
      style: {
        fontFamily: T.mono,
        fontSize: 10,
        color: T.textDim,
        whiteSpace: "nowrap"
      }
    }, pct, "% \xB7 ", (ch.capacity / 1e8).toFixed(4), " BTC"), React.createElement(Tag, {
      label: riskLabel,
      color: riskColor,
      size: 9
    }));
  })), tab === "Methodology" && React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 10
    }
  }, React.createElement("div", {
    style: {
      fontFamily: T.mono,
      fontSize: 9,
      color: T.textDim,
      letterSpacing: 2,
      marginBottom: 4
    }
  }, "8 HEURISTICS \xB7 LIGHTNING NODE PRIVACY SCORING"), [{
    n: "01",
    label: "Public Node Announcement",
    desc: "Whether your node is publicly gossiped on the Lightning network. Public nodes expose their IP or Tor address to every peer."
  }, {
    n: "02",
    label: "KYC Exchange Peer Channels",
    desc: "Channels to known KYC exchanges (Bitfinex, Kraken, Binance, OKX). These entities log routing metadata and can correlate payment flows through your node."
  }, {
    n: "03",
    label: "Tor / Clearnet Exposure",
    desc: "Whether your node listens on clearnet (IP-visible) or Tor-only (anonymous). Clearnet nodes expose their physical location."
  }, {
    n: "04",
    label: "Channel Diversity",
    desc: "Number of open channels. Low channel count limits routing path diversity, making payment flows easier to correlate."
  }, {
    n: "05",
    label: "Channel Capacity Concentration",
    desc: "Whether one channel dominates your capacity. Heavy concentration makes routing patterns predictable."
  }, {
    n: "06",
    label: "Node Alias Privacy",
    desc: "Whether your node alias looks like a real name. Aliases are publicly visible on the Lightning gossip network."
  }, {
    n: "07",
    label: "Node Establishment",
    desc: "How long your node has been active. New nodes have limited routing history, making their activity more trackable."
  }, {
    n: "08",
    label: "On-Chain Channel Footprint",
    desc: "Every channel open/close is an on-chain transaction. Funding channels from KYC exchange UTXOs permanently links your Lightning activity to your on-chain identity."
  }].map(c => React.createElement("div", {
    key: c.n,
    style: {
      display: "flex",
      gap: 14,
      background: T.card,
      border: `1px solid ${T.border}`,
      borderRadius: 12,
      padding: "14px 18px"
    }
  }, React.createElement("div", {
    style: {
      fontFamily: T.mono,
      fontSize: 10,
      color: T.ln,
      minWidth: 24,
      marginTop: 1
    }
  }, c.n), React.createElement("div", null, React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      color: T.text,
      marginBottom: 4
    }
  }, c.label), React.createElement("div", {
    style: {
      fontSize: 13,
      color: T.textMid,
      lineHeight: 1.6
    }
  }, c.desc)))))), isMobile && React.createElement("nav", {
    style: {
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 200,
      background: T.bg,
      borderTop: `1px solid ${T.border}`,
      display: "flex",
      height: 64,
      paddingBottom: "env(safe-area-inset-bottom, 0px)"
    }
  }, TABS.map(t => {
    const icons = {
      "Fix It": "★",
      "Checks": "◎",
      "Channels": "⚡",
      "Methodology": "≡"
    };
    return React.createElement("button", {
      key: t,
      onClick: () => setTab(t),
      style: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 3,
        background: "none",
        border: "none",
        cursor: "pointer",
        borderTop: `2px solid ${tab === t ? T.ln : "transparent"}`,
        transition: "border-color .15s"
      }
    }, React.createElement("span", {
      style: {
        fontSize: 14,
        color: tab === t ? T.ln : T.textDim
      }
    }, icons[t]), React.createElement("span", {
      style: {
        fontFamily: T.mono,
        fontSize: 8,
        color: tab === t ? T.ln : T.textDim,
        letterSpacing: 0.5
      }
    }, t.toUpperCase()));
  })));
}
function ScrollProgress() {
  const ref = useRef(null);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = ref.current;
        if (!el) return;
        const h = document.documentElement;
        const max = h.scrollHeight - h.clientHeight;
        el.style.width = (max > 0 ? h.scrollTop / max * 100 : 0) + "%";
      });
    };
    window.addEventListener("scroll", update, {
      passive: true
    });
    window.addEventListener("resize", update, {
      passive: true
    });
    update();
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      cancelAnimationFrame(raf);
    };
  }, []);
  return React.createElement("div", {
    "aria-hidden": "true",
    style: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      height: 2,
      zIndex: 300,
      pointerEvents: "none"
    }
  }, React.createElement("div", {
    ref: ref,
    style: {
      height: "100%",
      width: "0%",
      background: `linear-gradient(90deg, ${T.btc}, ${T.cyan})`,
      boxShadow: `0 0 8px ${T.cyan}`,
      transition: "width .1s linear"
    }
  }));
}
function App() {
  const [page, setPage] = useState("landing");
  const [activeCaseFile, setActiveCaseFile] = useState(null);
  const [pendingScan, setPendingScan] = useState(null);
  useEffect(() => {
    try {
      document.documentElement.lang = _lang;
    } catch {}
    const set = (sel, attr, val) => {
      let el = document.querySelector(sel);
      if (!el) {
        el = document.createElement("meta");
        document.head.appendChild(el);
      }
      el.setAttribute(attr, val);
    };
    document.title = "AnonScore — Free Bitcoin & Lightning Privacy Audit";
    set('meta[name="description"]', "content", "Paste a Bitcoin address or Lightning node pubkey. Get a privacy score, every issue explained, and a ranked fix plan. Free, open source, nothing stored.");
    set('meta[property="og:title"]', "content", "AnonScore — Free Bitcoin & Lightning Privacy Audit");
    set('meta[property="og:description"]', "content", "10 Bitcoin heuristics + 8 Lightning checks. Score 0–100. Free, open source, runs in your browser. No data stored.");
    set('meta[property="og:url"]', "content", "https://anonscore.com");
    set('meta[property="og:type"]', "content", "website");
    set('meta[property="og:image"]', "content", "https://anonscore.com/og.png");
    set('meta[name="twitter:card"]', "content", "summary_large_image");
    set('meta[name="twitter:title"]', "content", "AnonScore — Bitcoin & Lightning Privacy Score");
    set('meta[name="twitter:description"]', "content", "Is your Bitcoin stack leaking? Find out in 60 seconds. Free, open source.");
    set('meta[name="twitter:image"]', "content", "https://anonscore.com/og.png");
  }, []);
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const addr = params.get("scan");
      if (addr) {
        const t = detectInputType(addr);
        if (t) setPendingScan({
          addr,
          inputType: t
        });
      }
      const caseSlug = params.get("case");
      if (caseSlug) {
        const found = CASE_FILES.find(c => c.id === caseSlug || c.slug === caseSlug);
        if (found) {
          setActiveCaseFile(found);
          setPage("case_detail");
        }
      }
      const pageParam = params.get("page");
      if (pageParam === "coach") setPage("coach");else if (pageParam === "wallets") setPage("wallets");
    } catch {}
  }, []);
  const [address, setAddress] = useState("");
  const [addrInfo, setAddrInfo] = useState(null);
  const [utxos, setUtxos] = useState([]);
  const [txs, setTxs] = useState([]);
  const [autoShare, setAutoShare] = useState(false);
  const [scanAt, setScanAt] = useState(null);
  const [defaultSimple, setDefaultSimple] = useState(false);
  const [simpleMode, setSimpleMode] = useState(false);
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
    if (inputType === "ln_address") {
      toast.show("Can't audit a Lightning address", {
        icon: "⚡",
        color: T.amber,
        msg: "Enter your node's 66-character pubkey instead"
      });
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
          setScanDataReady(true);
          await new Promise(r => setTimeout(r, 300));
          setPage("ln_dashboard");
          toast.show("Lightning demo loaded", {
            icon: "⚡",
            color: T.ln,
            msg: "Showing a sample node with privacy issues"
          });
          return;
        }
        const data = await fetchLightningNode(addr);
        const result = runLightningEngine(data.node, data.channels);
        setLnNodeData(data.node);
        setLnChannels(data.channels);
        addToHistory({
          addr,
          score: result.score,
          grade: result.grade,
          label: scoreLabel(result.score),
          scanAt: Date.now(),
          isLightning: true,
          alias: data.node.alias
        });
        setScanDataReady(true);
        await new Promise(r => setTimeout(r, 300));
        setPage("ln_dashboard");
        toast.show("Node scan complete", {
          icon: "⚡",
          color: T.ln,
          msg: `Lightning privacy score: ${result.score}/100`
        });
      } catch {
        await new Promise(r => setTimeout(r, 700));
        setScanDataReady(false);
        setIsScanningLightning(false);
        setPage("landing");
        toast.show("Node scan couldn't complete", {
          icon: "⚠️",
          color: T.red,
          msg: "Couldn't reach the Lightning API — check your connection and try again."
        });
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
        setScanDataReady(true);
        await new Promise(r => setTimeout(r, 300));
        setPage("dashboard");
        toast.show("Demo loaded", {
          icon: isPristine ? "✨" : "🔍",
          color: isPristine ? T.green : T.cyan,
          msg: isPristine ? "Showing a pristine, CoinJoin-mixed wallet" : "Showing a sample high-risk wallet"
        });
        return;
      }
      const data = await fetchAddress(addr);
      const analysis = runEngine(data.utxos, data.txs, data.addrInfo?.chain_stats?.tx_count || data.txs.length);
      setAddrInfo(data.addrInfo);
      setUtxos(data.utxos);
      setTxs(data.txs);
      setScanAt(Date.now());
      addToHistory({
        addr,
        score: analysis.score,
        grade: analysis.grade,
        label: analysis.riskLabel,
        scanAt: Date.now(),
        isLightning: false
      });
      setScanDataReady(true);
      await new Promise(r => setTimeout(r, 300));
      setPage("dashboard");
      setAutoShare(true);
      toast.show("Scan complete", {
        icon: "✅",
        color: T.green,
        msg: `Privacy score: ${analysis.score}/100`
      });
    } catch {
      await new Promise(r => setTimeout(r, 700));
      setScanDataReady(false);
      setPage("landing");
      toast.show("Scan couldn't complete", {
        icon: "⚠️",
        color: T.red,
        msg: "Couldn't reach the blockchain API — check your connection and try again."
      });
    }
  }, [toast]);
  return React.createElement(React.Fragment, null, React.createElement("style", null, CSS), React.createElement(ScrollProgress, null), React.createElement(Toast, {
    toasts: toast.toasts
  }), pendingScan && page === "landing" && React.createElement(ConfirmScanModal, {
    pendingScan: pendingScan,
    onCancel: () => setPendingScan(null),
    onConfirm: () => {
      const p = pendingScan;
      setPendingScan(null);
      analyze(p.addr, false, p.inputType);
    }
  }), React.createElement("div", {
    key: page,
    style: {
      animation: "fadeIn .35s ease both"
    }
  }, page === "landing" && React.createElement(Landing, {
    onAnalyze: analyze,
    isMobile: isMobile,
    onCases: c => {
      if (c) {
        setActiveCaseFile(c);
        setPage("case_detail");
      } else {
        setPage("cases");
      }
    }
  }), page === "cases" && React.createElement(CaseFiles, {
    onOpenCase: c => {
      setActiveCaseFile(c);
      setPage("case_detail");
    },
    onBack: () => setPage("landing"),
    isMobile: isMobile
  }), page === "case_detail" && activeCaseFile && React.createElement(CaseDetail, {
    caseFile: activeCaseFile,
    onBack: () => setPage("cases"),
    onAnalyze: analyze,
    isMobile: isMobile
  }), page === "scanning" && React.createElement(Scanning, {
    address: address || lnNodeId,
    isLightning: isScanningLightning,
    dataReady: scanDataReady
  }), page === "dashboard" && React.createElement(Dashboard, {
    address: address,
    addrInfo: addrInfo,
    utxos: utxos,
    txs: txs,
    isMobile: isMobile,
    onBack: () => setPage("landing"),
    onRescan: analyze,
    toast: toast,
    autoShare: autoShare,
    scanAt: scanAt,
    defaultSimple: defaultSimple,
    simpleMode: simpleMode,
    onSimpleModeChange: setSimpleMode,
    onCoach: () => setPage("coach")
  }), page === "ln_dashboard" && React.createElement(LightningDashboard, {
    nodeId: lnNodeId,
    nodeData: lnNodeData,
    channels: lnChannels,
    isMobile: isMobile,
    onBack: () => setPage("landing"),
    onRescan: analyze,
    toast: toast
  }), page === "coach" && React.createElement(CoachWaitlist, {
    onBack: () => setPage("landing"),
    isMobile: isMobile
  }), page === "wallets" && React.createElement(WalletDirectory, {
    onBack: () => setPage("landing"),
    isMobile: isMobile
  })));
}
ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(App));