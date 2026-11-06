/* ─────────────────────────────────────────────
   XPUB WALLET SCAN — standalone tool at /?page=xpub. Paste an xpub/ypub/zpub,
   derive + gap-limit scan the whole wallet client-side, score it wallet-level.
───────────────────────────────────────────── */
function XpubScan({ onBack, isMobile, onScan, onNav, prefill, onOpenWalletReview, planSaved, onPlan }) {
  useLang();
  const [raw, setRaw] = useState(prefill || "");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(null);   // { derived, used }
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [shareOpen, setShareOpen] = useState(false);
  const detected = detectXpub(raw);
  const walletPart = result && !result.isEmpty ? snapshotPart({ kind: "wallet", score: result.score, grade: result.grade, checks: result.checks }) : null;
  const planList = mergePlanParts(walletPart, planSaved);
  useEffect(() => { if (onPlan && walletPart) onPlan(walletPart); }, [onPlan, walletPart]);

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
      const rep = runWalletEngine(scan);
      // History parity with address/LN scans — keyed on the BIP32 fingerprint
      // (hash160 of the key)[0..4]; the xpub itself is NEVER stored.
      if (!rep.isEmpty) {
        try {
          const k = decodeXpub(raw.trim());
          const fp = Array.from(_hash160(k.keyData).slice(0, 4)).map(b => b.toString(16).padStart(2, "0")).join("");
          const key = "wallet:" + fp;
          const prev = getHistory().find(e => e.addr === key);
          rep.delta = prev ? rep.score - prev.score : null;
          addToHistory({ addr: key, score: rep.score, grade: rep.grade, label: rep.riskLabel, scanAt: Date.now(), isXpub: true });
        } catch {}
      }
      setResult(rep);
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
        ...(r.delta != null && r.delta !== 0 ? [{ k: "SINCE LAST SCAN", v: (r.delta > 0 ? "+" : "") + r.delta, c: r.delta > 0 ? T.green : T.red }] : []),
      ];
      report = (
        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 20, animation: "fadeUp .4s ease both" }}>
          {/* score header */}
          <div style={{ ...panel(), display: "flex", gap: isMobile ? 14 : 22, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ flexShrink: 0 }}><ScoreRing score={r.score} size={isMobile ? 96 : 118} animate={false} /></div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ fontFamily: T.serif, fontSize: isMobile ? 22 : 26, color: r.riskColor, fontWeight: 400 }}>Grade {r.grade} · {r.riskLabel}</div>
              <p style={{ fontSize: 15, color: T.text, lineHeight: 1.55, margin: "8px 0 0" }}>{plainVerdict({ score: r.score, checks: r.checks, kind: "wallet" })}</p>
              <div style={{ fontSize: 13, color: T.textMid, lineHeight: 1.6, marginTop: 6 }}>Across {r.stats.used} used address{r.stats.used !== 1 ? "es" : ""} ({r.stats.addresses} derived and checked in this browser).</div>
              <div style={{ display: "flex", gap: 18, marginTop: 12, flexWrap: "wrap" }}>
                {tiles.map(t => (
                  <div key={t.k}>
                    <div style={{ fontFamily: T.mono, fontSize: 11, color: T.textDim, letterSpacing: 0.6 }}>{t.k}</div>
                    <div style={{ fontFamily: T.serif, fontSize: 17, color: t.c, lineHeight: 1.1, marginTop: 2 }}>{t.v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <PrivacyPlanCard parts={planList} onShare={() => setShareOpen(true)} />
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
                      <div style={{ fontSize: 14, color: T.textMid, lineHeight: 1.55, marginTop: 3 }}>{rec.plain}</div>
                      {i === 0 && <FixSteps rec={rec} />}
                      <FixToolChips tools={rec.tools} tool={rec.tool} onReview={onOpenWalletReview} /></div>
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
                    {onScan && <AuditButton onClick={() => onScan(a.address)} size={11} ariaLabel={"Audit derived address " + a.address} />}
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
      <SiteNav isMobile={isMobile} onBack={onBack} onNav={onNav} current="xpub" badge="WALLET SCAN" />

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
            onFocus={e => { e.target.style.borderColor = T.cyan; e.target.style.boxShadow = `0 0 0 3px ${T.cyan}22`; }}
            onBlur={e => { e.target.style.borderColor = T.border; e.target.style.boxShadow = "none"; }}
            style={{ width: "100%", boxSizing: "border-box", minHeight: 84, resize: "vertical", background: "#070910", border: `1px solid ${T.border}`, borderRadius: 10, padding: "12px 14px", color: T.text, fontFamily: T.mono, fontSize: 12.5, lineHeight: 1.5, outline: "none", transition: "border .15s, box-shadow .2s" }} />
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
        {shareOpen && walletPart && (
          <ShareCard parts={planList} score={result.score} grade={result.grade} checks={result.checks} address="" onClose={() => setShareOpen(false)} />
        )}
        {!result && !error && !busy && (
          <div style={{ marginTop: 20, fontSize: 12.5, color: T.textDim, lineHeight: 1.7, textAlign: "center" }}>
            Find your account xpub in Sparrow (Settings → Export), Electrum (Wallet → Information), or your hardware wallet. It's public — it reveals addresses, never the ability to spend.
          </div>
        )}
      </div>
    </div>
  );
}

