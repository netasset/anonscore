/* ─────────────────────────────────────────────
   CASE FILES — list page
───────────────────────────────────────────── */
const CATEGORY_META = {
  exchange: { label: "Exchange",  color: "#58a6ff" },
  seizure:  { label: "Seizure",   color: "#f85149" },
  darknet:  { label: "Darknet",   color: "#E6C229" },
  miner:    { label: "Miner",     color: "#3fb950" },
};
const STATUS_META = {
  active:     { label: "Active",      color: "#3fb950" },
  dormant:    { label: "Dormant",     color: "#888fae" },
  liquidating:{ label: "Liquidating", color: "#E6C229" },
  liquidated: { label: "Liquidated",  color: "#58a6ff" },
};

function CaseFiles({ onOpenCase, onBack, isMobile, onNav }) {
  const PAGE_ROLE_LABEL = "AnonScore case files — notable Bitcoin wallets";
  const [filter, setFilter] = useState("all");
  const categories = ["all", "exchange", "seizure", "miner"];
  const visible = filter === "all" ? CASE_FILES : CASE_FILES.filter(c => c.category === filter);

  return (
    <div role="main" aria-label={PAGE_ROLE_LABEL} style={{ minHeight: "100vh", background: "transparent", display: "flex", flexDirection: "column" }}>
      <SiteNav isMobile={isMobile} onBack={onBack} onNav={onNav} current="cases" badge="CASE FILES" badgeColor={T.btc} />

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
function CaseDetail({ caseFile, onBack, onAnalyze, isMobile, onNav }) {
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
      <SiteNav isMobile={isMobile} onBack={onBack} backLabel="← Cases" onNav={onNav} current="cases" badge={`CASE #${caseFile.id}`} badgeColor={cat.color} />

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

