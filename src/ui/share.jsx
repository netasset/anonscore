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
function ShareCard({ parts, score, grade, checks, address, isLightning = false, onClose }) {
  const col = scoreColor(score);
  const dialogRef = useDialog(onClose);
  const [mode, setMode] = useState("safe");
  const [didCopy, setDidCopy] = useState(false);
  const [nostrSent, setNostrSent] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const cardRef = useRef(null);
  const safeParts = (parts && parts.length)
    ? parts
    : [snapshotPart({ kind: isLightning ? "node" : "address", score, grade, checks, clusterN: 0 })].filter(Boolean);
  const token = encodeReport(safeParts);
  const view = decodeReport(token);
  const safeText = view ? reportText(view) : "";
  const link = token ? reportLink(token) : "";
  const downloadSafe = () => {
    if (!safeText) return;
    const a = document.createElement("a");
    const url = URL.createObjectURL(new Blob([safeText], { type: "text/plain" }));
    a.href = url;
    a.download = "anonscore-report.txt";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  };

  const issueCount = (checks || []).filter(c => c.status !== "pass").length;
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
  const wide = mode === "safe" || isCard;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 800, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "#00000088" }} />
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-label="Share your privacy score" tabIndex={-1}
        style={{ position: "relative", background: T.card, border: `1px solid ${T.border}`, borderRadius: 20, padding: 24,
        width: wide ? "min(460px,96vw)" : "min(400px,94vw)", maxHeight: "88vh", overflow: "auto", animation: "fadeUp .3s ease both", transition: "width .2s ease" }}>

        {mode === "safe" && view && <>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 6 }}>
            <div style={{ fontFamily: T.mono, fontSize: 11, color: T.cyan, letterSpacing: 1.1 }}>SAFE TO POST</div>
            <button onClick={onClose} aria-label="Close" style={{ background: "transparent", border: `1px solid ${T.border}`, borderRadius: 8, padding: "4px 10px", color: T.textMid, cursor: "pointer" }}>✕</button>
          </div>
          <h2 style={{ fontFamily: T.serif, fontSize: 24, color: T.text, fontWeight: 400, margin: "0 0 8px" }}>Share the findings, not the wallet.</h2>
          <p style={{ fontSize: 14, color: T.textMid, lineHeight: 1.55, margin: "0 0 12px" }}>This report has the grade, the reason, and the steps. It has no address, no transaction id, and no node key. Opening the link does not look anything up.</p>
          <div data-report-token={token} style={{ background: T.surface, border: `1px solid ${T.borderLo}`, borderRadius: 12, padding: "12px 14px", marginBottom: 12 }}>
            <ReportBody view={view} compact />
          </div>
          <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
            <button onClick={() => copy(safeText)} style={{ flex: "1 1 140px", padding: "12px", background: didCopy ? T.green : T.cyan, border: "none", borderRadius: 10, color: T.bg, fontFamily: T.sans, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>{didCopy ? "Copied" : "Copy the report"}</button>
            <button onClick={() => copy(link)} style={{ flex: "1 1 140px", padding: "12px", background: "transparent", border: `1.5px solid ${T.cyan}`, borderRadius: 10, color: T.cyan, fontFamily: T.sans, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>Copy the link</button>
          </div>
          <button onClick={downloadSafe} style={{ width: "100%", padding: "10px", marginBottom: 8, background: "transparent", border: `1px solid ${T.border}`, borderRadius: 10, color: T.textMid, fontFamily: T.sans, fontSize: 13, cursor: "pointer" }}>Download the report</button>
          <div style={{ fontFamily: T.mono, fontSize: 11, color: T.textDim, lineHeight: 1.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: 10 }}>{link}</div>
          <button type="button" onClick={() => setMode("copy")}
            style={{ width: "100%", background: "none", border: `1px solid ${T.border}`, borderRadius: 10, padding: "10px 12px", cursor: "pointer", fontFamily: T.sans, fontSize: 13, color: T.textMid, textAlign: "left" }}>
            Other ways to share
          </button>
        </>}

        {mode !== "safe" && <>
        <button type="button" onClick={() => setMode("safe")} style={{ background: "none", border: "none", padding: 0, marginBottom: 12, cursor: "pointer", fontFamily: T.sans, fontSize: 13, fontWeight: 600, color: T.cyan }}>
          ← Back to the report with no address
        </button>
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
            <>
            <button onClick={() => copy(`https://anonscore.com/?scan=${encodeURIComponent(address)}`)} style={{ width: "100%", padding: "9px", background: "transparent", border: `1px solid ${T.border}`, borderRadius: 10, color: T.textDim, fontFamily: T.mono, fontSize: 11, cursor: "pointer", transition: "all .15s" }}
              onMouseOver={e => { e.currentTarget.style.borderColor = T.cyan; e.currentTarget.style.color = T.cyan; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textDim; }}>
              Copy result link — this one includes the address
            </button>
            <div style={{ fontSize: 12, color: T.textMid, lineHeight: 1.45, marginTop: 8 }}>Anyone with that link can open this scan. The report leaves the address out.</div>
            </>
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
            <div style={{ fontFamily: T.mono, fontSize: 11, color: T.textDim, textAlign: "center", lineHeight: 1.6 }}>
              The image shows a shortened address. The report on the previous screen leaves it out.
            </div>
          </div>
        )}
        </>}
      </div>
    </div>
  );
}

