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

// The single "jump to another analysis" affordance — the app's connective tissue.
// Reimplemented inline in six places before this; one component now, one label,
// one hover, one aria pattern, so every jump reads and behaves identically.
const AuditButton = ({ onClick, color = T.cyan, label = "Audit →", ariaLabel, size = 12, style }) => (
  <button onClick={onClick} aria-label={ariaLabel || label}
    style={{ flexShrink: 0, background: "transparent", border: `1px solid ${color}55`, borderRadius: 8, padding: "5px 12px", color, fontFamily: T.sans, fontSize: size, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", transition: "background .15s", ...style }}
    onMouseOver={e => (e.currentTarget.style.background = color + "14")} onMouseOut={e => (e.currentTarget.style.background = "transparent")}>{label}</button>
);

// EPISTEMIC ENCODING — the "verify, don't trust" grammar for connections. A link's
// HUE carries valence (bad/good/caution); this SEPARATE, colour-blind-safe channel
// (line style + glyph + verb) carries how SURE we are it's real, so a user never
// mistakes an inferred guess for an on-chain fact.
const PROOF = {
  proven:    { glyph: "⛓", dash: "none", verb: "provably", label: "Proven", note: "on-chain fact (common-input / deterministic link)" },
  inferred:  { glyph: "≈", dash: "5 3",  verb: "likely",   label: "Inferred", note: "probabilistic — a strong guess, not proof" },
  heuristic: { glyph: "?", dash: "1.5 3", verb: "consistent with", label: "Heuristic", note: "a weak tell that can misfire" },
};
// A compact legend that decodes the line styles beside any connection graph.
/* Stable slug for a wallet-review deep link (?page=wallets&pick=sparrow-wallet). */
const wSlug = name => (name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/* Shared "OPTIONS:" tool-chip row used by the Dashboard Fix-It plan and the
   xpub Wallet-scan TOP FIXES. Renders each recommended tool as a chip (outbound
   link + affiliate disclosure when applicable) and — when the tool has an entry
   in our own WALLET_REVIEWS — a small "review" link that jumps to the directory
   card, so the fix plan connects to the site's independent reviews instead of
   bypassing them. */
function FixToolChips({ tools, tool, onReview }) {
  const list = tools || (tool ? [{ name: tool, note: "" }] : []);
  if (!list.length) return null;
  return (
    <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
      <span style={{ fontFamily: T.mono, fontSize: 11, color: T.textDim, letterSpacing: 0.6 }}>OPTIONS:</span>
      {list.map((t, ti) => {
        const href = toolLink(t.name);
        const aff = toolIsAffiliate(t.name);
        const base = { fontFamily: T.mono, fontSize: 11, padding: "3px 8px", borderRadius: 4, background: T.cyan + "18", color: T.cyan, border: `1px solid ${T.cyan}30`, letterSpacing: 0.3, textDecoration: "none", cursor: href ? "pointer" : (t.note ? "help" : "default") };
        const label = aff ? `${t.name} · affiliate` : t.name;
        const chip = href
          ? <a href={href} target="_blank" rel="noopener noreferrer nofollow" title={aff ? `${t.note ? t.note + " · " : ""}AnonScore earns a referral when you sign up — see /how-we-get-paid` : t.note} style={base}>{label}</a>
          : <span title={t.note} style={base}>{t.name}</span>;
        const reviewed = onReview && WALLET_REVIEWS.some(w => w.name === t.name);
        return (
          <span key={ti} style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
            {chip}
            {reviewed && (
              <button onClick={() => onReview(t.name)} title={"Our independent review of " + t.name + " — strengths and honest watch-outs"}
                style={{ background: "none", border: "none", padding: 0, fontFamily: T.mono, fontSize: 11, color: T.textMid, cursor: "pointer", textDecoration: "underline dotted", textUnderlineOffset: 2 }}>
                review
              </button>
            )}
          </span>
        );
      })}
    </div>
  );
}

const EpistemicLegend = ({ kinds = ["proven", "inferred"], color = T.textMid, colors }) => {
  const cf = k => (colors && colors[k]) || color;
  return (
    <div role="img" aria-label={"Legend: " + kinds.map(k => PROOF[k].label + " = " + PROOF[k].note).join("; ")}
      style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 8 }}>
      {kinds.map(k => (
        <span key={k} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: T.mono, fontSize: 9.5, color: T.textDim }}>
          <svg width="22" height="8" aria-hidden="true"><line x1="1" y1="4" x2="21" y2="4" stroke={cf(k)} strokeWidth={k === "proven" ? 2.2 : 1.3} strokeDasharray={PROOF[k].dash === "none" ? undefined : PROOF[k].dash} strokeLinecap="round" /></svg>
          <span style={{ color: T.textMid }}>{PROOF[k].glyph} {PROOF[k].label}</span>
        </span>
      ))}
    </div>
  );
};

/* ─────────────────────────────────────────────
   SITE NAV — the one shared spine across every sub-page. ← Back, a clickable
   brand (→ landing), the toolkit link row (desktop), and a right-side page
   badge. Every link is a real href (?page=…) so middle-click / open-in-new-tab
   / copy-link work; a plain left-click navigates in-app via onNav. Before this
   existed, every sub-page's only exit was "← Back" and three of the four
   flagship tools were reachable solely through 10px footer links.
───────────────────────────────────────────── */
const NAV_LINKS = [
  { page: "inspector", label: "Inspector",   href: "/?page=inspector" },
  { page: "xpub",      label: "Wallet scan", href: "/?page=xpub" },
  { page: "wallets",   label: "Wallets",     href: "/?page=wallets" },
  { page: "cases",     label: "Case Files",  href: "/?page=cases" },
  { page: "methodology", label: "Methodology", href: "/?page=methodology" },
];
function SiteNav({ isMobile, onBack, backLabel = "← Back", onNav, current, badge, badgeColor = T.cyan }) {
  const go = page => e => { if (onNav && e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) { e.preventDefault(); onNav(page); } };
  return (
    <nav aria-label="AnonScore" style={{ display: "flex", alignItems: "center", gap: 10, padding: isMobile ? "12px 16px" : "14px 32px", borderBottom: `1px solid ${T.border}`, background: T.bg, position: "sticky", top: 0, zIndex: 100 }}>
      {onBack && (
        <button onClick={onBack} style={{ background: "transparent", border: `1.5px solid ${T.border}`, borderRadius: 8, padding: "7px 12px", color: T.textMid, fontFamily: T.sans, fontSize: 13, cursor: "pointer", transition: "border .15s" }}
          onMouseOver={e => e.currentTarget.style.borderColor = T.cyan}
          onMouseOut={e => e.currentTarget.style.borderColor = T.border}>{backLabel}</button>
      )}
      <a href="/" onClick={go("landing")} aria-label="AnonScore home"
        style={{ fontFamily: T.display, fontSize: 15, letterSpacing: 4, fontWeight: 700, color: T.text, textDecoration: "none" }}>
        ANON<span style={{ color: T.cyan }}>SCORE</span>
      </a>
      <div style={{ flex: 1 }} />
      {!isMobile && NAV_LINKS.filter(l => l.page !== current).map(l => (
        <a key={l.page} href={l.href} onClick={go(l.page)}
          style={{ fontFamily: T.mono, fontSize: 10, color: T.textMid, textDecoration: "none", letterSpacing: 0.5, padding: "4px 6px", transition: "color .15s" }}
          onMouseOver={e => e.currentTarget.style.color = T.cyan}
          onMouseOut={e => e.currentTarget.style.color = T.textMid}>{l.label}</a>
      ))}
      {badge && <span style={{ fontFamily: T.mono, fontSize: 9, color: badgeColor, background: badgeColor + "14", border: `1px solid ${badgeColor}44`, borderRadius: 6, padding: "4px 9px", letterSpacing: 1, whiteSpace: "nowrap" }}>{badge}</span>}
    </nav>
  );
}

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
        <span style={{ fontFamily: T.mono, fontSize: Math.max(11, size * .075), color: T.textDim, letterSpacing: 0.4, marginTop: 2 }}>/100</span>
      </div>
    </div>
  );
}

