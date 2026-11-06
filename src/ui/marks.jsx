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
  { label:"Detecting CoinJoin patterns…", fact:"CoinJoin mixes your coins with others in one transaction — the more participants, the larger your anonymity set and the harder reliable tracking becomes." },
  { label:"Analysing fee fingerprints…",  fact:"Your wallet software can be identified by the fee rates it uses. Different wallets have different defaults." },
  { label:"Calculating privacy score…",   fact:"Score 0 = fully traceable in seconds. Score 100 = requires nation-state resources to de-anonymise." },
  { label:"Building your fix plan…",      fact:"Most wallets can improve by 30+ points in under a week with no technical knowledge required." },
];

