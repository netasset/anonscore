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
function ScoreBreakdown({ checks, score, isMobile, simpleMode, recover = "see the fixes on this page" }) {
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
        100 {lost ? <>− {Math.abs(lost)} lost </> : ""}{gained ? <>+ {gained} earned </> : ""}= {raw}{raw !== score ? ` → ${score} (${raw < 0 ? "floored at 0" : "capped at 100"})` : ""}. Each penalty is recoverable — {recover}.
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

