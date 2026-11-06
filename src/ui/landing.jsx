
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

function Landing({ onAnalyze, isMobile, onCases, onNav, onOpenTool }) {
  // Left-click a tool link → navigate in-app (no cold SPA reload); keep the href so
  // middle-click / open-in-new-tab / deep-link still work.
  const navLink = page => e => { if (onNav && e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) { e.preventDefault(); onNav(page); } };
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
  const [boxMode, setBoxMode] = useState("score");
  const [sendReport, setSendReport] = useState(null);
  const [formatsOpen, setFormatsOpen] = useState(false);
  const [spInfo, setSpInfo] = useState(null);   // decoded Silent Payments (BIP352) address, if entered
  const [lnInvoice, setLnInvoice] = useState(null);   // decoded BOLT11 Lightning invoice, if entered
  const [lnPay, setLnPay] = useState(null);           // { kind: "offer"|"lnurl"|"lnaddress", ...decoded }
  const [toolHint, setToolHint] = useState(null);     // { kind: "xpub"|"tx", value } — input belongs to a sibling tool
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
    setSpInfo(null); setLnInvoice(null); setLnPay(null); setToolHint(null);
    if (boxMode === "send") {
      const res = runSendCheck(v);
      setSendReport(res.report || null);
      setError(res.error || "");
      return;
    }
    if (!v) { setError(t("err.empty")); return; }
    const detected = detectInputType(v);
    if (!detected) {
      const sp = decodeSilentPayment(v);
      if (sp) { setError(""); setSpInfo(sp); return; }   // not scannable — it's a reusable BIP352 address; educate instead
      const inv = decodeBolt11(v);
      if (inv) { setError(""); setLnInvoice(inv); return; }   // a Lightning invoice — decode + lint what it leaks
      const off = decodeBolt12Offer(v);
      if (off) { setError(""); setLnPay({ kind: "offer", ...off }); return; }   // BOLT12 offer — blinded-path privacy lint
      const lu = decodeLnurl(v);
      if (lu) { setError(""); setLnPay({ kind: "lnurl", ...lu }); return; }     // LNURL — metadata chokepoint lint
      const cs = decodeCashu(v);
      if (cs) { setError(""); setLnPay({ kind: "cashu", ...cs }); return; }     // Cashu ecash token — custodial + cleartext-bearer lint
      // Inputs that belong to a sibling tool: hand off instead of erroring.
      if (detectXpub(v)) { setError(""); setToolHint({ kind: "xpub", value: v }); return; }   // whole-wallet key → Wallet scan
      const txk = detectTxInput(v);
      if (txk === "txid") { setError(""); setToolHint({ kind: "txid", value: v }); return; }  // confirmed tx → Inspector lookup
      if (txk === "psbt" || txk === "rawhex") {
        // Only offer the handoff when it genuinely parses (pure local check).
        try { parseTransactionInput(v); setError(""); setToolHint({ kind: "tx", value: v }); return; } catch {}
      }
      setFormatsOpen(true);
      setError(t("err.invalid"));
      return;
    }
    if (detected === "ln_address") {
      // A Lightning address (user@domain) can't be scanned — but we can decode
      // where it resolves and explain the metadata exposure, rather than just error.
      const la = resolveLnAddress(v);
      if (la) { setError(""); setLnPay({ kind: "lnaddress", ...la }); return; }
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
        <a href="https://opnorange.com" target="_blank" rel="noopener noreferrer"
          style={{ display: "flex", alignItems: "center", gap: 7, textDecoration: "none", flexShrink: 0 }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: T.opn, boxShadow: `0 0 7px ${T.opn}`, flexShrink: 0 }} />
          <span style={{ fontFamily: T.mono, fontSize: 10, color: T.textMid, letterSpacing: 1.5, fontWeight: 700 }}>OPN<span style={{ color: T.opn }}>ORANGE</span></span>
          {!isMobile && <span style={{ fontFamily: T.mono, fontSize: 10, color: T.textDim, letterSpacing: 1.5 }}>· {t("umbrella.label")}</span>}
        </a>
        <span style={{ color: T.borderLo, flexShrink: 0 }}>|</span>
          <div style={{ display: "flex", alignItems: "center", gap: 9, flex: "1 1 auto", minWidth: 0, overflowX: "auto", scrollbarWidth: "none" }}>
            {/* Current tool — highlighted, not a link (you're here) */}
            {!isMobile && <>
            <span style={{ fontFamily: T.mono, fontSize: 10, color: T.opn, fontWeight: 700, letterSpacing: 0.5, whiteSpace: "nowrap", flexShrink: 0 }}>{t("umbrella.privacy")}</span>
            <span style={{ color: T.borderLo }}>·</span>
            </>}
            <a href="https://dcabutler.com" target="_blank" rel="noopener noreferrer"
              style={{ fontFamily: T.mono, fontSize: 10, color: T.textMid, textDecoration: "none", letterSpacing: 0.5, whiteSpace: "nowrap", flexShrink: 0, transition: "color .15s" }}
              onMouseOver={e => e.currentTarget.style.color = T.opn}
              onMouseOut={e => e.currentTarget.style.color = T.textMid}>
              {t("umbrella.dca")} ↗
            </a>
            <span style={{ color: T.borderLo }}>·</span>
            <a href={`${BTCHUB_URL}/?from=anonscore`} target="_blank" rel="noopener noreferrer"
              style={{ fontFamily: T.mono, fontSize: 10, color: T.textMid, textDecoration: "none", letterSpacing: 0.5, whiteSpace: "nowrap", flexShrink: 0, transition: "color .15s" }}
              onMouseOver={e => e.currentTarget.style.color = T.opn}
              onMouseOut={e => e.currentTarget.style.color = T.textMid}>
              {t("umbrella.intel")} ↗
            </a>
            <span style={{ color: T.borderLo }}>·</span>
            <a href="https://opnorange.com" target="_blank" rel="noopener noreferrer"
              style={{ fontFamily: T.mono, fontSize: 10, color: T.textMid, textDecoration: "none", letterSpacing: 0.5, whiteSpace: "nowrap", flexShrink: 0, transition: "color .15s" }}
              onMouseOver={e => e.currentTarget.style.color = T.opn}
              onMouseOut={e => e.currentTarget.style.color = T.textMid}>
              {t("umbrella.hub")} ↗
            </a>
          </div>
      </nav>
      <div role="main" aria-label="AnonScore — Bitcoin & Lightning privacy audit" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "transparent" }}>
      {/* Nav — trust signals left · brand centered · actions right */}
      <nav style={{ display: "grid", gridTemplateColumns: navWide ? "1fr auto 1fr" : "1fr auto", alignItems: "center", gap: 8, padding: isMobile ? "12px 16px" : "14px 48px", borderBottom: `1px solid ${T.border}`, background: T.bg, position: "sticky", top: 0, zIndex: 100 }}>
        {navWide && (
        <div style={{ display: "flex", alignItems: "center", gap: 2, minWidth: 0, justifySelf: "start" }}>
          {NAV_LINKS.map(l => (
            <a key={l.page} href={l.href} onClick={l.page === "cases" ? (e => { if (e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) { e.preventDefault(); onCases(null); } }) : navLink(l.page)}
              style={{ fontFamily: T.mono, fontSize: 10, color: T.textMid, textDecoration: "none", letterSpacing: 0.5, padding: "4px 7px", transition: "color .15s", whiteSpace: "nowrap" }}
              onMouseOver={e => e.currentTarget.style.color = T.cyan}
              onMouseOut={e => e.currentTarget.style.color = T.textMid}>{l.label}</a>
          ))}
        </div>
        )}
        {/* Brand. Centered when the tool links flank it; left-aligned on a phone so GitHub doesn't wrap. */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, justifySelf: navWide ? "center" : "start" }}>
          <span style={{ color: T.btc, fontFamily: T.mono, fontSize: 15, lineHeight: 1, textShadow: `0 0 14px ${T.btc}77` }}>₿</span>
          <span style={{ fontFamily: T.display, fontWeight: 700, fontSize: 16, letterSpacing: 4, color: T.text, textTransform: "uppercase" }}>ANON<span style={{ color: T.cyan, textShadow: `0 0 14px ${T.cyan}55` }}>SCORE</span></span>
        </div>
        {/* Right — actions */}
        <div style={{ display: "flex", gap: 8, alignItems: "center", justifySelf: "end" }}>
          <a href="https://github.com/netasset/anonscore" target="_blank" rel="noopener noreferrer" aria-label="AnonScore on GitHub"
            style={{ ...ui.ghost, display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", background: T.surface, borderRadius: 7, textDecoration: "none", fontSize: 11, fontFamily: T.mono, whiteSpace: "nowrap", transition: "border-color .15s" }}
            onMouseOver={e => e.currentTarget.style.borderColor = T.cyan}
            onMouseOut={e => e.currentTarget.style.borderColor = T.border}>
            GitHub ↗
          </a>
          {!isMobile && <Tag label={t("nav.free")} color={T.green} size={10} />}
          <LangSwitcher />
        </div>
      </nav>

      {/* ── HERO ── */}
      <div ref={heroRef} style={{ position: "relative", overflow: "hidden" }}>
        <ParticleCanvas color={T.cyan} />
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0, background: "radial-gradient(360px circle at var(--mx,50%) var(--my,26%), #22D3EE14, transparent 60%)" }} />
        <div style={{ position: "absolute", top: "10%", left: "-10%", width: 520, height: 520, borderRadius: "50%", background: "radial-gradient(circle,#22D3EE18 0%,transparent 70%)", animation: "orb 8s ease-in-out infinite", pointerEvents: "none", filter: "blur(2px)" }} />
        <div className="aurora" style={{ top: "-10%", right: "-12%", width: 460, height: 460, background: "radial-gradient(circle,#F7931A16 0%,transparent 70%)", animationDelay: "-8s" }} />
        <div className="aurora" style={{ bottom: "-24%", left: "32%", width: 400, height: 400, background: "radial-gradient(circle,#22D3EE12 0%,transparent 70%)", animationDelay: "-15s" }} />
        <div className="scan-ov" />

        <section style={{ position: "relative", padding: isMobile ? "18px 16px 28px" : "28px 48px 36px", maxWidth: 860, margin: "0 auto", width: "100%", textAlign: "center" }}>
          {/* Eyebrow */}
          <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: 2.5, marginBottom: 14, animation: "fadeUp .5s ease both", display: "flex", gap: 8, alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: T.btc }}>₿</span>
            <span style={{ color: T.cyan }}>{t("hero.eyebrow")}</span>
          </div>

          {/* Headline */}
          <h1 style={{ fontFamily: T.serif, fontSize: isMobile ? 34 : 52, lineHeight: 1.06, color: T.text, marginBottom: 12, animation: "fadeUp .5s ease .08s both", fontWeight: 400 }}>
            {t("hero.h1.line1")}<br />{t("hero.h1.line2")}<br /><em className="accent-glow" style={{ color: T.cyan, fontStyle: "italic" }}>{t("hero.h1.em")}</em>
          </h1>

          <p style={{ fontSize: isMobile ? 15 : 17, color: T.textMid, lineHeight: 1.55, fontWeight: 300, animation: "fadeUp .5s ease .14s both", maxWidth: 520, margin: "0 auto 14px" }}>
            {t("hero.sub")}
          </p>

          {/* Privacy panel — trust line + relay switch in one compact box */}
          {RELAY_URL
            ? <RelayToggle trustLine={isLn ? t("trust.ln") : t("trust.btc")} />
            : <div style={{ maxWidth: HERO_COL, margin: "0 auto 12px", animation: "fadeUp .5s ease .20s both", background: T.surface, border: `1px solid ${isLn ? T.ln + "44" : T.border}`, borderRadius: 10, padding: "10px 14px", fontFamily: T.sans, fontSize: 12, color: T.textMid, lineHeight: 1.5, textAlign: "left" }}>{isLn ? t("trust.ln") : t("trust.btc")}</div>}

          {/* CTAs — wrapped in a glowing "scan console" panel. Intentionally the
              WIDEST hero element (HERO_WIDE > HERO_COL) so it breaks out of the
              supporting column and is unmistakably the main event. */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: HERO_WIDE, margin: "4px auto 0", animation: "fadeUp .5s ease .22s both", background: T.card, border: `1px solid ${T.cyan}44`, borderRadius: 18, padding: isMobile ? "14px 14px" : "18px 22px", boxShadow: `0 0 60px -14px ${T.cyan}4d` }}>
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
              <div role="group" aria-label="What to check" style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                {[["score", "Score an address"], ["send", "Check a send"]].map(([id, label]) => (
                  <button key={id} type="button" aria-pressed={boxMode === id} onClick={() => { setBoxMode(id); setError(""); setSendReport(null); setSpInfo(null); setLnInvoice(null); setLnPay(null); setToolHint(null); }}
                    style={{ background: boxMode === id ? T.cyanLo : "transparent", border: `1px solid ${boxMode === id ? T.cyan : T.border}`, borderRadius: 99, padding: "6px 12px", color: boxMode === id ? T.cyan : T.textMid, fontFamily: T.sans, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                    {label}
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8, marginBottom: 7 }}>
                <div style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: 1.5, color: T.textDim, textAlign: "left" }}>
                  {boxMode === "send" ? "UNSIGNED PSBT OR A DESCRIPTION" : isLn ? "NODE PUBKEY" : "BITCOIN ADDRESS OR LIGHTNING NODE"}
                </div>
                <button type="button" onClick={() => setFormatsOpen(o => !o)} aria-expanded={formatsOpen}
                  style={{ background: "none", border: "none", padding: 0, fontFamily: T.mono, fontSize: 9, letterSpacing: 0.4, color: T.cyan, cursor: "pointer", flexShrink: 0 }}>
                  {formatsOpen ? "Hide other formats" : "Other formats"}
                </button>
              </div>
              {formatsOpen && (
                <div style={{ fontSize: 12, color: T.textMid, lineHeight: 1.55, textAlign: "left", marginBottom: 8, animation: "slideDown .2s ease" }}>
                  This box also reads a BOLT11 invoice, a BOLT12 offer, an LNURL or Lightning address, a Silent Payment address (sp1…), an xpub, ypub or zpub, a PSBT or raw transaction, and a Cashu token. Paste one and it stays on this page.
                </div>
              )}
              {/* Input on its own full-width row so the field is the widest, most
                  prominent element; Analyze becomes a full-width CTA below it. */}
              <div style={{ display: "flex", gap: 8 }}>
                {isMobile && (
                  <button type="button" aria-label="Paste from clipboard" onClick={async () => {
                    try { const t = await navigator.clipboard.readText(); setInput(t.trim()); setError(""); } catch {}
                  }} style={{ ...ui.ghost, background: T.surface, borderRadius: 14, padding: "12px 14px", fontSize: 18, flexShrink: 0, alignSelf: "stretch" }}>
                    📋
                  </button>
                )}
                {/* Recessed input well: leading search glyph + strong border make it stand off the card */}
                <div style={{ position: "relative", flex: 1, minWidth: 0 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"
                    style={{ position: "absolute", left: 18, top: boxMode === "send" ? 18 : "50%", transform: boxMode === "send" ? "none" : "translateY(-50%)", pointerEvents: "none" }}>
                    <circle cx="11" cy="11" r="7" stroke={inputType ? (isLn ? T.ln : T.btc) : T.cyan} strokeWidth="2" opacity="0.9" />
                    <line x1="16.5" y1="16.5" x2="21" y2="21" stroke={inputType ? (isLn ? T.ln : T.btc) : T.cyan} strokeWidth="2" strokeLinecap="round" opacity="0.9" />
                  </svg>
                  {boxMode === "send" ? (
                  <textarea ref={inputRef} value={input} rows={4} onChange={e => { setInput(e.target.value); setError(""); setSendReport(null); }}
                    aria-label="Paste an unsigned PSBT or describe the inputs and outputs"
                    placeholder={"Paste an unsigned PSBT, or describe it:\nin bc1q… 50000000 p2wpkh\nout bc1q… 10000 p2wpkh"}
                    style={{ width: "100%", boxSizing: "border-box", background: "#070910", resize: "vertical",
                      border: `2px solid ${error ? T.red : T.cyan + "77"}`,
                      borderRadius: 14, padding: "16px 16px 16px 48px", color: T.text, fontFamily: T.mono, fontSize: 16, letterSpacing: 0.3, outline: "none", transition: "border .18s, box-shadow .25s", boxShadow: `inset 0 2px 14px #00000080`, minWidth: 0, lineHeight: 1.45 }}
                  />
                  ) : (
                  <input ref={inputRef} value={input} onChange={e => { setInput(e.target.value); setError(""); setSpInfo(null); setLnInvoice(null); setLnPay(null); }}
                    onKeyDown={e => e.key === "Enter" && submit(null, true)}
                    aria-label="Paste a Bitcoin address, Lightning node pubkey, or silent payment address"
                    placeholder={isLn ? "03abc… (66-char node pubkey)" : "Paste an address or pubkey…"}
                    style={{ width: "100%", boxSizing: "border-box", background: "#070910",
                      border: `2px solid ${error ? T.red : inputType ? (isLn ? T.ln : T.btc) : T.cyan + "77"}`,
                      borderRadius: 14, padding: "16px 16px 16px 48px", color: T.text, fontFamily: T.mono, fontSize: 16, letterSpacing: 0.3, outline: "none", transition: "border .18s, box-shadow .25s", boxShadow: `inset 0 2px 14px #00000080`, minWidth: 0 }}
                    onFocus={e => {
                      const c = isLn ? T.ln : T.cyan;
                      e.target.style.borderColor = c;
                      e.target.style.boxShadow = `0 0 0 4px ${c}22, 0 0 24px ${c}55, inset 0 2px 14px #00000080`;
                    }}
                    onBlur={e => {
                      e.target.style.borderColor = error ? T.red : inputType ? (isLn ? T.ln : T.btc) : T.cyan + "77";
                      e.target.style.boxShadow = `inset 0 2px 14px #00000080`;
                    }} />
                  )}
                </div>
              </div>
              <button onClick={() => submit(null, !isLn)} className="sheen"
                style={{ ...ui.primary(boxMode === "send" ? T.cyan : isLn ? T.ln : T.btc), width: "100%", marginTop: 10, borderRadius: 14, padding: "14px 22px", fontSize: 16, whiteSpace: "nowrap", transition: "opacity .15s" }}
                onMouseOver={e => e.currentTarget.style.opacity = ".88"}
                onMouseOut={e => e.currentTarget.style.opacity = "1"}>
                {boxMode === "send" ? "Check this send" : isLn ? t("cta.audit") : t("cta.analyze")}
              </button>
              {boxMode === "send" && (
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center", marginTop: 8, flexWrap: "wrap" }}>
                  <button type="button" onClick={() => { setInput(DEMO_PSBT); setError(""); const res = runSendCheck(DEMO_PSBT); setSendReport(res.report || null); }}
                    style={{ background: "none", border: "none", padding: 0, color: T.cyan, fontFamily: T.sans, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                    Load example send
                  </button>
                  <span style={{ fontSize: 12, color: T.textMid, textAlign: "left" }}>Nothing is broadcast.</span>
                </div>
              )}
              {boxMode === "send" && <SendVerdict report={sendReport} />}
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
                            <div key={i} style={{ background: T.surface, border: `1px solid ${T.borderLo}`, borderRadius: 8, padding: "7px 10px", fontFamily: T.mono, fontSize: 11, display: "flex", alignItems: "center", gap: 10 }}>
                              <div style={{ minWidth: 0, flex: 1 }}>
                                <div style={{ color: T.text }}>peer {cut(r.pubkey)}</div>
                                <div style={{ color: T.textDim, fontSize: 10, marginTop: 2 }}>funding tx → block {r.block.toLocaleString()} · tx #{r.tx} · output {r.out}</div>
                              </div>
                              {isValidLightningPubkey(r.pubkey) && (
                                <AuditButton onClick={() => onAnalyze(r.pubkey, false, "ln_pubkey")} color={T.ln} size={11} ariaLabel={"Audit peer node " + r.pubkey} />
                              )}
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
              {lnPay && (() => {
                const p = lnPay, cut = s => !s ? "" : s.length > 22 ? s.slice(0, 11) + "…" + s.slice(-6) : s;
                // offer: blinded paths = good (hidden node); bare issuer id = exposed
                const good = p.kind === "offer" ? p.hasBlindedPaths : false;
                const accent = good ? T.green : p.kind === "cashu" ? T.btc : T.ln;
                const head = p.kind === "offer" ? "BOLT12 OFFER" : p.kind === "lnurl" ? "LNURL" : p.kind === "lnaddress" ? "LIGHTNING ADDRESS" : "CASHU ECASH TOKEN";
                return (
                  <div style={{ marginTop: 12, textAlign: "left", background: accent + "0e", border: `1px solid ${accent}40`, borderRadius: 14, padding: "14px 16px", animation: "slideDown .25s ease" }}>
                    <div style={{ fontFamily: T.mono, fontSize: 9, color: accent, letterSpacing: 1.5, marginBottom: 8 }}>{head}{p.kind === "offer" && p.currency ? " · " + p.currency : ""}</div>
                    {p.kind === "offer" && (
                      <>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 10 }}>
                          {p.amountMsat != null && <span style={{ fontFamily: T.serif, fontSize: 19, color: T.text }}>{p.currency ? (p.amountMsat + " " + p.currency) : (p.amountMsat / 1000).toLocaleString() + " sats"}</span>}
                          {p.description && <span style={{ fontSize: 12.5, color: T.textMid, alignSelf: "center" }}>“{p.description}”</span>}
                        </div>
                        {p.hasBlindedPaths ? (
                          <div style={{ fontSize: 12.5, color: T.textMid, lineHeight: 1.6 }}>
                            <strong style={{ color: T.green }}>Uses blinded paths — the payee's node identity is hidden.</strong> This is BOLT12's privacy win over BOLT11 invoices: reusable without a static payment hash to correlate, and no node pubkey or funding UTXO exposed. {p.issuer ? "Issuer: " + p.issuer + "." : ""}
                          </div>
                        ) : (
                          <div style={{ fontSize: 12.5, color: T.textMid, lineHeight: 1.6 }}>
                            <strong style={{ color: T.ln }}>Exposes the payee's node pubkey directly</strong>{p.issuerId ? <> (<span style={{ fontFamily: T.mono, fontSize: 11 }}>{cut(p.issuerId)}</span>)</> : ""} — no blinded paths. An observer can look the node up, map its public channels and probe balances. Still better than a BOLT11 invoice (reusable, no static payment hash), but a blinded-path offer would hide the identity. {p.issuer ? "Issuer: " + p.issuer + "." : ""}
                            {p.issuerId && isValidLightningPubkey(p.issuerId) && (
                              <div style={{ marginTop: 8 }}>
                                <AuditButton onClick={() => onAnalyze(p.issuerId, false, "ln_pubkey")} color={T.ln} label="Audit this node →" ariaLabel={"Audit issuer node " + p.issuerId} />
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    )}
                    {(p.kind === "lnurl" || p.kind === "lnaddress") && (
                      <>
                        <div style={{ fontFamily: T.mono, fontSize: 12, color: T.text, wordBreak: "break-all", marginBottom: 8 }}>{p.kind === "lnaddress" ? p.user + "@" + p.host : p.host}</div>
                        <div style={{ fontSize: 12.5, color: T.textMid, lineHeight: 1.6 }}>
                          Payments funnel through <strong style={{ color: T.text }}>{p.host}</strong>{p.kind === "lnaddress" ? <> — it resolves to <span style={{ fontFamily: T.mono, fontSize: 11, color: T.textDim, wordBreak: "break-all" }}>{p.endpoint}</span></> : ""}. That server is a <strong style={{ color: T.ln }}>metadata chokepoint</strong>: it sees your IP and every payment request, and can log who pays you and when. Convenient, but the operator (and its host) can build a payment profile — not private the way an on-chain or blinded-path payment is.
                        </div>
                      </>
                    )}
                    {p.kind === "cashu" && (
                      <>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 8 }}>
                          <span style={{ fontFamily: T.serif, fontSize: 19, color: T.text }}>{p.total.toLocaleString()} {p.unit}</span>
                          <span style={{ fontSize: 12, color: T.textDim, alignSelf: "center" }}>· {p.count} proof{p.count !== 1 ? "s" : ""} · Cashu V{p.version}</span>
                        </div>
                        <div style={{ fontFamily: T.mono, fontSize: 11.5, color: T.textMid, wordBreak: "break-all", marginBottom: 8 }}>mint: {p.mints[0] || "—"}</div>
                        <div style={{ fontSize: 12.5, color: T.textMid, lineHeight: 1.6 }}>
                          Chaumian ecash: the mint blind-signs tokens, so it <strong style={{ color: T.green }}>can't link who withdrew a token to who redeemed it</strong> — strong payment unlinkability. The trade-off: the mint is a <strong style={{ color: T.ln }}>trusted custodian</strong> that holds the funds and can vanish or censor, and this token is a <strong style={{ color: T.red }}>cleartext bearer note</strong> — anyone who sees this string (chat, email, screen) can redeem it first. Treat it like cash on the table.
                        </div>
                      </>
                    )}
                    <div style={{ fontSize: 11.5, color: T.textDim, lineHeight: 1.55, marginTop: 10 }}>Decoded entirely in your browser.</div>
                  </div>
                );
              })()}
              {/* Input belongs to a sibling tool — hand off instead of erroring.
                  The user pressed Analyze; the click below is the navigation. */}
              {toolHint && (
                <div style={{ marginTop: 12, textAlign: "left", background: T.cyan + "0e", border: `1px solid ${T.cyan}40`, borderRadius: 14, padding: "14px 16px", animation: "slideDown .25s ease" }}>
                  <div style={{ fontFamily: T.mono, fontSize: 9, color: T.cyan, letterSpacing: 1.5, marginBottom: 8 }}>
                    {toolHint.kind === "xpub" ? "EXTENDED PUBLIC KEY · WHOLE-WALLET SCAN" : toolHint.kind === "txid" ? "TRANSACTION ID · CONFIRMED-TX FORENSICS" : "TRANSACTION · PRE-BROADCAST INSPECTOR"}
                  </div>
                  <div style={{ fontSize: 13.5, color: T.textMid, lineHeight: 1.65, marginBottom: 12 }}>
                    {toolHint.kind === "xpub"
                      ? <>That's an <strong style={{ color: T.text }}>extended public key</strong> — the map of an entire wallet, not one address. The Wallet scan derives every address from it <strong style={{ color: T.text }}>in your browser</strong>, gap-limit scans them, and scores the whole wallet — including the reuse and cross-address links no single-address scan can see.</>
                      : toolHint.kind === "txid"
                      ? <>That's a <strong style={{ color: T.text }}>transaction id</strong>. The Inspector fetches the confirmed transaction from your chosen explorer{RELAY_URL ? " (via the no-log relay)" : ""} and runs the full forensics on it — interpretation entropy, deterministic links, wallet fingerprint, change detection, and what has happened to its outputs since.</>
                      : <>That's a <strong style={{ color: T.text }}>transaction</strong>, not an address. The Inspector shows what it leaks — change detection, wallet fingerprint, input→output linkability — <strong style={{ color: T.text }}>before you broadcast</strong>, so you can still fix it. Fully offline; it never leaves the page.</>}
                  </div>
                  <button onClick={() => onOpenTool && onOpenTool(toolHint.kind === "xpub" ? "xpub" : "inspector", toolHint.value)}
                    style={{ background: T.cyan, border: "none", borderRadius: 10, padding: "10px 18px", color: T.bg, fontFamily: T.sans, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                    {toolHint.kind === "xpub" ? "Audit the whole wallet →" : toolHint.kind === "txid" ? "Run the forensics →" : "Inspect before you broadcast →"}
                  </button>
                </div>
              )}
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
            {!isLn && (
              <div style={{ maxWidth: HERO_COL, margin: "2px auto 0", width: "100%" }}>
                <div style={{ position: "relative", height: 6, borderRadius: 6, background: `linear-gradient(90deg, ${T.red} 0%, ${T.btc} 40%, ${T.amber} 60%, ${T.green} 100%)`, marginBottom: 6 }}>
                  <div style={{ position: "absolute", top: "50%", left: "38%", transform: "translate(-50%,-50%)", width: 12, height: 12, borderRadius: "50%", background: T.bg, border: `2px solid ${T.btc}`, boxShadow: `0 0 8px ${T.btc}` }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontFamily: T.mono, fontSize: 9, color: T.red }}>{t("spectrum.low")}</span>
                  <span style={{ fontFamily: T.mono, fontSize: 9, color: T.btc }}>{t("spectrum.avg")}</span>
                  <span style={{ fontFamily: T.mono, fontSize: 9, color: T.green }}>{t("spectrum.high")}</span>
                </div>
              </div>
            )}
            <button type="button" onClick={() => onCases(null)}
              style={{ background: "none", border: "none", padding: 0, fontFamily: T.mono, fontSize: 11, color: T.textMid, cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 3 }}>
              See this audit on famous wallets →
            </button>
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
                      <button onClick={() => h.isXpub ? (onNav && onNav("xpub")) : onAnalyze(h.addr, false, h.isLightning ? "ln_pubkey" : "btc")}
                        title={h.isXpub ? "Wallet scans are keyed by fingerprint — the xpub itself is never stored. Re-paste it to rescan." : undefined}
                        style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, background: "none", border: "none", cursor: "pointer", textAlign: "left", minWidth: 0 }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: col, flexShrink: 0 }} />
                        <div style={{ fontFamily: T.mono, fontSize: 10, color: T.textDim, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {h.isXpub ? "🔑 " : h.isLightning ? "⚡ " : "₿ "}{h.isXpub ? "Wallet " + h.addr.slice(7) : h.addr === "DEMO" || h.addr === "DEMO_A" || h.addr === "DEMO_LN" ? "Demo" : h.addr.slice(0, 14) + "…"}
                        </div>
                        <div style={{ fontFamily: T.serif, fontSize: 14, color: col, flexShrink: 0 }}>{h.grade}</div>
                        <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, flexShrink: 0 }}>{h.score}/100</div>
                        <div style={{ fontFamily: T.mono, fontSize: 8, color: T.textDim, flexShrink: 0 }}>{h.isXpub ? "→" : "↺"}</div>
                      </button>
                      <button onClick={() => deleteHistory(h.addr)} aria-label={"Remove " + (h.addr || "scan") + " from recent scans"}
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
              { n:"01", icon:"📋", title:"Paste an address", desc:"A Bitcoin address or a Lightning node pubkey. No account. The result stays in this browser." },
              { n:"02", icon:"🔍", title:"The checks run here",  desc:"Eleven on-chain heuristics, or eight Lightning checks. The same patterns surveillance firms use — nothing is uploaded to score it." },
              { n:"03", icon:"🎯", title:"Score, then the first fix",  desc:"0–100, every issue explained, fixes ranked by the points they return. Plain English is one toggle." },
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
          <a href="/?page=wallets" onClick={navLink("wallets")}
            style={{ fontFamily: T.mono, fontSize: 10, color: T.textMid, textDecoration: "underline dotted", textUnderlineOffset: 3, transition: "color .15s" }}
            onMouseOver={e => e.currentTarget.style.color = T.btc}
            onMouseOut={e => e.currentTarget.style.color = T.textMid}>
            Wallet directory
          </a>
          <a href="/?page=inspector" onClick={navLink("inspector")}
            style={{ fontFamily: T.mono, fontSize: 10, color: T.textMid, textDecoration: "underline dotted", textUnderlineOffset: 3, transition: "color .15s" }}
            onMouseOver={e => e.currentTarget.style.color = T.cyan}
            onMouseOut={e => e.currentTarget.style.color = T.textMid}>
            Transaction Inspector
          </a>
          <a href="/?page=xpub" onClick={navLink("xpub")}
            style={{ fontFamily: T.mono, fontSize: 10, color: T.textMid, textDecoration: "underline dotted", textUnderlineOffset: 3, transition: "color .15s" }}
            onMouseOver={e => e.currentTarget.style.color = T.cyan}
            onMouseOut={e => e.currentTarget.style.color = T.textMid}>
            Wallet scan (xpub)
          </a>
          <a href="/?page=methodology" onClick={navLink("methodology")}
            style={{ fontFamily: T.mono, fontSize: 10, color: T.textMid, textDecoration: "underline dotted", textUnderlineOffset: 3, transition: "color .15s" }}
            onMouseOver={e => e.currentTarget.style.color = T.cyan}
            onMouseOut={e => e.currentTarget.style.color = T.textMid}>
            Methodology
          </a>
          <a href="/?page=cases" onClick={navLink("cases")}
            style={{ fontFamily: T.mono, fontSize: 10, color: T.textMid, textDecoration: "underline dotted", textUnderlineOffset: 3, transition: "color .15s" }}
            onMouseOver={e => e.currentTarget.style.color = T.btc}
            onMouseOut={e => e.currentTarget.style.color = T.textMid}>
            Case files
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

