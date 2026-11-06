const { useState, useEffect, useCallback, useRef, useMemo, useLayoutEffect } = React;

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
  amber:    "#E6C229",  /* warning yellow — distinct from Bitcoin orange and Lightning violet */
  amberLo:  "#E6C22918",
  amberMid: "#E6C22940",
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
  ln:       "#C4B5FD",  /* Lightning violet — not the orange/gold used for Bitcoin and warnings */
  lnLo:     "#C4B5FD14",
  lnMid:    "#C4B5FD33",
  mono:     "'JetBrains Mono',monospace",
  serif:    "'Fraunces',serif",
  sans:     "'Outfit',sans-serif",
  display:  "'Oxanium',sans-serif",
};

/* Repeated control styles. Spread these and override padding or color
   per call site — the border, radius, and type ramp stay one place. */
const ui = {
  ghost: {
    background: "transparent",
    border: `1.5px solid ${T.border}`,
    borderRadius: 8,
    color: T.textMid,
    fontFamily: T.sans,
    cursor: "pointer",
  },
  primary: (bg) => ({
    background: bg,
    border: "none",
    borderRadius: 12,
    color: T.bg,
    fontFamily: T.sans,
    fontWeight: 700,
    cursor: "pointer",
  }),
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

