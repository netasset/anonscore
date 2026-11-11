
function FixSteps({ rec }) {
  const how = howtoFor(rec);
  if (!how) return null;
  return (
    <div style={{ marginTop: 10 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 6 }}>How, in {how.where}</div>
      <ol style={{ margin: 0, paddingLeft: 18, display: "flex", flexDirection: "column", gap: 5 }}>
        {how.steps.map((s, n) => (
          <li key={n} style={{ fontSize: 14, color: T.textMid, lineHeight: 1.5 }}>{s}</li>
        ))}
      </ol>
    </div>
  );
}

function ResultHero({ score, grade, riskLabel, riskColor, verdict, linkage, fail, warn, pass, stats, statsOpen, onToggleStats, isMobile }) {
  return (
    <section aria-label="Your score" style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: isMobile ? "16px" : "18px 22px", marginBottom: 14 }}>
      <div style={{ display: "flex", gap: isMobile ? 12 : 16, alignItems: "flex-start" }}>
        <ScoreRing score={score} size={isMobile ? 76 : 88} animate={false} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontFamily: T.serif, fontSize: isMobile ? 26 : 32, color: riskColor, lineHeight: 1 }}>Grade {grade}</span>
            <span style={{ fontFamily: T.mono, fontSize: 13, color: T.textMid }}>{score}/100</span>
            <Tag label={riskLabel} color={riskColor} size={12} />
          </div>
          <p style={{ fontSize: isMobile ? 15 : 16.5, color: T.text, lineHeight: 1.55, margin: "10px 0 0" }}>{verdict}</p>
        </div>
      </div>
      {linkage && <LinkageMap map={linkage} />}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
        <div style={{ fontSize: 13, color: T.textMid, lineHeight: 1.4 }}>
          <span style={{ color: T.red, fontWeight: 700 }}>{fail}</span> failed
          <span style={{ color: T.textDim }}> · </span>
          <span style={{ color: T.amber, fontWeight: 700 }}>{warn}</span> {warn === 1 ? "warning" : "warnings"}
          <span style={{ color: T.textDim }}> · </span>
          <span style={{ color: T.green, fontWeight: 700 }}>{pass}</span> passed
        </div>
        {stats && stats.length > 0 && (
          <button type="button" onClick={onToggleStats} aria-expanded={!!statsOpen}
            style={{ background: "none", border: "none", padding: 0, cursor: "pointer", fontFamily: T.sans, fontSize: 13, fontWeight: 600, color: T.cyan }}>
            {statsOpen ? "Hide balance and comparison" : "Balance and comparison"}
          </button>
        )}
      </div>
      {statsOpen && stats && (
        <div style={{ display: "flex", gap: isMobile ? 16 : 28, flexWrap: "wrap", marginTop: 12, paddingTop: 12, borderTop: `1px solid ${T.border}` }}>
          {stats.map(s => {
            const body = (
              <>
                <div style={{ fontFamily: T.mono, fontSize: 11, color: T.textDim, letterSpacing: 0.6, marginBottom: 3 }}>{s.label}</div>
                <div style={{ fontFamily: T.serif, fontSize: 18, color: s.color, lineHeight: 1 }}>{s.val}</div>
                {s.sub && <div style={{ fontSize: 12, color: s.onClick ? T.cyan : T.textDim, marginTop: 3 }}>{s.sub}{s.onClick ? " →" : ""}</div>}
              </>
            );
            return s.onClick ? (
              <button key={s.label} type="button" onClick={s.onClick} title={s.title || s.sub}
                style={{ background: "none", border: "none", padding: 0, textAlign: "left", cursor: "pointer", fontFamily: "inherit" }}>{body}</button>
            ) : (
              <div key={s.label}>{body}</div>
            );
          })}
        </div>
      )}
    </section>
  );
}

function Dashboard({ address, addrInfo, utxos, txs, txSample, utxoSample, isMobile, onBack, onRescan, toast, autoShare, scanAt, defaultSimple, simpleMode: simpleModeFromApp, onSimpleModeChange, onCoach, delta, onNav, onOpenCase, onOpenWalletReview, onInspectTx, onInspectTxid, planSaved, onPlan }) {
  const [tab, setTab] = useState("Fix It");
  const [threat, setThreat] = useState(null); // null = ranked for everyone; session-only, never stored
  const [threatOpen, setThreatOpen] = useState(false);
  const clusterN = useMemo(() => computeCluster(txs, address).linked.length, [txs, address]);
  const poison = useMemo(() => computePoisoning(txs, address), [txs, address]);
  const caseHit = CASE_FILES.find(c => c.address === address);
  const caseEntity = caseHit?.entity;
  const [simpleMode, setSimpleMode] = useState(simpleModeFromApp != null ? !!simpleModeFromApp : !!defaultSimple);
  const setSimpleModeSync = (val) => { setSimpleMode(val); onSimpleModeChange && onSimpleModeChange(val); };
  const [shareOpen, setShareOpen] = useState(false);
  const [selectedUtxo, setSelectedUtxo] = useState(null);
  const [pickedCoins, setPickedCoins] = useState([]);
  const [doneFixes, setDoneFixes] = useState(() => getDoneFixes(address));
  const [statsOpen, setStatsOpen] = useState(false);
  const [moreFixes, setMoreFixes] = useState(false);
  const [whyKey, setWhyKey] = useState(null);

  const toggleDone = (key) => setDoneFixes(prev => {
    const next = new Set(prev);
    next.has(key) ? next.delete(key) : next.add(key);
    saveDoneFixes(address, next);
    return next;
  });
  const [aiStage, setAiStage] = useState(null);
  const openAi = () => setAiStage("consent");

  const txCount = addrInfo?.chain_stats?.tx_count || txs.length;
  const receiveCount = addrInfo?.chain_stats?.funded_txo_count ?? null;   // reuse = received >1×
  const analysis = useMemo(() => runEngine(utxos, txs, txCount, receiveCount), [utxos, txs, txCount, receiveCount]);
  const linkage = useMemo(() => buildLinkageMap(txs, address, { receiveCount: receiveCount != null ? receiveCount : txCount }), [txs, address, receiveCount, txCount]);
  const { score, grade, riskLabel, riskColor, checks, recommendations, isEmpty } = analysis;
  const planMine = useMemo(() => isEmpty ? null : snapshotPart({ kind: "address", score, grade, checks, clusterN }), [isEmpty, score, grade, checks, clusterN]);
  const planList = useMemo(() => mergePlanParts(planMine, planSaved), [planMine, planSaved]);
  useEffect(() => { if (onPlan && planMine) onPlan(planMine); }, [onPlan, planMine]);
  // Use addrInfo aggregate balance (accurate) — falls back to summing sampled UTXOs for demo/edge cases
  const totalSats = useMemo(() => {
    const funded = addrInfo?.chain_stats?.funded_txo_sum ?? null;
    const spent  = addrInfo?.chain_stats?.spent_txo_sum  ?? null;
    if (funded !== null && spent !== null) return funded - spent;
    return utxos.reduce((s, u) => s + u.value, 0);
  }, [addrInfo, utxos]);
  const issueCount = checks.filter(c => c.status !== "pass").length;
  const TABS = ["Fix It","Overview","Flow","UTXOs","Transactions"];

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
      ...(txSample?.capped && txSample.total != null ? [`Sample:     based on the latest ${txSample.fetched} of ${txSample.total} transactions`] : []),
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
    <div role="main" aria-label={`Privacy audit for ${address === "DEMO" || address === "DEMO_A" ? "demo wallet" : address}`} style={{ minHeight: "100vh", background: "transparent", display: "flex", flexDirection: "column", paddingBottom: isMobile ? "calc(72px + env(safe-area-inset-bottom, 0px))" : 0 }}>
      <h1 className="sr-only">Privacy score {score} of 100, grade {grade} — {riskLabel}</h1>
      {/* Nav */}
      <nav style={{ display: "flex", alignItems: "center", gap: 10, padding: isMobile ? "12px 16px" : "12px 32px", borderBottom: `1px solid ${T.border}`, background: T.bg, position: "sticky", top: 0, zIndex: 100 }}>
        <button onClick={onBack} style={{ background: "transparent", border: `1.5px solid ${T.border}`, borderRadius: 8, padding: "7px 12px", color: T.textMid, fontFamily: T.sans, fontSize: 13, cursor: "pointer", transition: "border .15s" }}
          onMouseOver={e => e.currentTarget.style.borderColor = T.cyan}
          onMouseOut={e => e.currentTarget.style.borderColor = T.border}>← Back</button>
        {!isMobile && <div style={{ fontFamily: T.display, fontSize: 15, letterSpacing: 4, fontWeight: 700 }}>ANON<span style={{ color: T.cyan }}>SCORE</span></div>}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: T.mono, fontSize: 11, color: T.textDim, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{address === "DEMO" || address === "DEMO_A" ? "Demo Wallet" : fmt.addr(address)}</div>
          {scanAt && <div style={{ fontFamily: T.mono, fontSize: 11, color: T.textDim, marginTop: 2 }}>Scanned {fmt.age(scanAt / 1000)}</div>}
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
        <ResultHero
          score={score}
          grade={grade}
          riskLabel={riskLabel}
          riskColor={riskColor}
          verdict={plainVerdict({ score, checks, kind: "btc", clusterN })}
          linkage={linkage}
          fail={checks.filter(c => c.status === "fail").length}
          warn={checks.filter(c => c.status === "warn").length}
          pass={checks.filter(c => c.status === "pass").length}
          statsOpen={statsOpen}
          onToggleStats={() => setStatsOpen(o => !o)}
          isMobile={isMobile}
          stats={[
            { label: "BALANCE", val: `₿${(totalSats/1e8).toFixed(4)}`, sub: `${addrInfo?.chain_stats?.funded_txo_count != null ? (addrInfo.chain_stats.funded_txo_count - (addrInfo.chain_stats.spent_txo_count||0)) : utxos.length} UTXOs`, color: T.blue },
            { label: "TRANSACTIONS", val: txCount, sub: txSample?.capped ? `latest ${txSample.fetched}` : "total", color: T.cyan },
            { label: "VS TYPICAL", val: score > 38 ? `+${score-38}` : `${score-38}`, sub: "typical ~38", color: score > 38 ? T.green : T.red },
            ...(clusterN > 0 ? [{ label: "CLUSTER", val: clusterN, sub: "linked addresses", color: T.red, onClick: () => setTab("Flow"), title: "See the cluster on the Flow tab" }] : []),
            ...(delta != null && delta !== 0 ? [{ label: "PROGRESS", val: delta > 0 ? `+${delta}` : `${delta}`, sub: "vs your last scan", color: delta > 0 ? T.green : T.red }] : []),
          ]}
        />

        {txSample?.capped && txSample.total != null && (
          <div style={{ fontFamily: T.mono, fontSize: 11, color: T.textDim, margin: "-4px 4px 12px", lineHeight: 1.5 }}>
            Based on the latest {txSample.fetched} of {txSample.total} transactions.
          </div>
        )}
        {utxoSample?.capped && (
          <div style={{ fontFamily: T.mono, fontSize: 11, color: T.textDim, margin: "-4px 4px 12px", lineHeight: 1.5 }}>
            Showing {utxoSample.fetched} of {utxoSample.total} unspent outputs. The balance is the full total. The score uses these {utxoSample.fetched}.
          </div>
        )}

        <PrivacyPlanCard parts={planList} onShare={() => setShareOpen(true)} />

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

        {/* This scanned address IS one of our forensic case files — link the story */}
        {caseHit && onOpenCase && (
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", background: T.btc + "10", border: `1px solid ${T.btc}44`, borderRadius: 14, padding: "12px 18px", marginBottom: 14 }}>
            <span aria-hidden="true" style={{ fontSize: 16 }}>📁</span>
            <div style={{ flex: 1, minWidth: 200, fontSize: 13, color: T.textMid, lineHeight: 1.5 }}>
              This address is <strong style={{ color: T.text }}>Case File #{caseHit.id} — {caseHit.title}</strong>. You're auditing a wallet with a story; we've written it up.
            </div>
            <button onClick={() => onOpenCase(caseHit)}
              style={{ background: "transparent", border: `1.5px solid ${T.btc}66`, borderRadius: 8, padding: "7px 14px", color: T.btc, fontFamily: T.mono, fontSize: 11, cursor: "pointer", transition: "all .15s", whiteSpace: "nowrap" }}
              onMouseOver={e => { e.currentTarget.style.background = T.btc; e.currentTarget.style.color = T.bg; }}
              onMouseOut={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = T.btc; }}>
              Read the case →
            </button>
          </div>
        )}

        {/* Tabs + Simple Mode toggle — desktop only; mobile uses bottom bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 14 }}>
          {!isMobile && (
            <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 2, alignItems: "center" }}>
              {TABS.map(t => <Pill key={t} active={tab === t} onClick={() => setTab(t)}>{t}</Pill>)}
              {onNav && (
                <button type="button" onClick={() => onNav("methodology")}
                  style={{ background: "none", border: "none", fontFamily: T.sans, fontSize: 13, color: T.textMid, cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 3, whiteSpace: "nowrap" }}>
                  How scoring works
                </button>
              )}
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
          <div key={tab} style={{ display: "flex", flexDirection: "column", gap: 10, animation: "fadeIn .22s ease both" }}>
            <div>
              <h2 style={{ fontFamily: T.serif, fontSize: isMobile ? 20 : 22, color: T.text, fontWeight: 400, margin: "2px 0 4px" }}>
                {checks.some(c => c.status === "fail") || score < 60 ? "Do these first" : checks.some(c => c.status === "warn") ? "The one thing left" : "If you want to go further"}
              </h2>
              <div style={{ fontSize: 14, color: T.textMid, lineHeight: 1.5, marginBottom: 4 }}>
                {tm
                  ? <>Re-ranked for <strong style={{ color: T.cyan }}>{tm.label.toLowerCase()}</strong>. The points do not change — only the order does.</>
                  : <>Start with the first one. It returns the most points. The rest can wait.</>}
              </div>
            </div>
            {shownRecs.slice(0, moreFixes ? shownRecs.length : 3).map((r, i) => {
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
                    <div style={{ fontSize: 14, color: T.textMid, lineHeight: 1.65 }}>{displayPlain}</div>
                    {i < 3 && <FixSteps rec={r} />}
                    <FixToolChips tools={r.tools} tool={r.tool} onReview={onOpenWalletReview} />
                    {r.detail && r.detail !== displayPlain && (
                      <div style={{ marginTop: 8 }}>
                        <button type="button" onClick={() => setWhyKey(whyKey === r.key ? null : r.key)} aria-expanded={whyKey === r.key}
                          style={{ background: "none", border: "none", padding: 0, cursor: "pointer", fontFamily: T.sans, fontSize: 13, fontWeight: 600, color: T.cyan }}>
                          {whyKey === r.key ? "Hide the background" : "Why this works"}
                        </button>
                        {whyKey === r.key && (
                          <div style={{ fontSize: 13, color: T.textMid, lineHeight: 1.6, marginTop: 8 }}>
                            {r.detail}
                            {(r.tools || []).some(t => t.note) && (
                              <div style={{ marginTop: 8 }}>
                                {(r.tools || []).map((t, ti) => t.note ? <div key={ti}><span style={{ color: T.text }}>{t.name}.</span> {t.note}</div> : null)}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </>}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: isMobile ? "flex-start" : "flex-end", flexShrink: 0 }}>
                  <div style={{ textAlign: isMobile ? "left" : "right" }}>
                    <div style={{ fontFamily: T.serif, fontSize: 22, color: T.green }}>+{r.impact}pts</div>
                    {scoreGrade(Math.min(score + r.impact, 97)) !== grade && (
                      <div title="Your grade if you complete just this one fix" style={{ fontFamily: T.mono, fontSize: 11, color: T.green, marginTop: 1 }}>→ grade {scoreGrade(Math.min(score + r.impact, 97))}</div>
                    )}
                  </div>
                  {tm && !done && w === 3 && <Tag label="front line" color={T.cyan} size={11} />}
                  {tm && !done && w === 0 && <Tag label="lower priority here" color={T.textDim} size={11} />}
                  <Tag label={r.effort} color={r.effort === "Easy" ? T.green : r.effort === "Medium" ? T.amber : T.textMid} size={11} />
                  <button onClick={() => toggleDone(r.key)} style={{ background: done ? T.green : "transparent", border: `1.5px solid ${done ? T.green : T.border}`, borderRadius: 8, padding: "5px 10px", color: done ? T.bg : T.textDim, fontSize: 11, cursor: "pointer", transition: "all .2s", whiteSpace: "nowrap" }}>
                    {done ? "✓ Done" : "Mark done"}
                  </button>
                </div>
              </div>
              );
            })}
            {shownRecs.length > 3 && (
              <button type="button" onClick={() => setMoreFixes(v => !v)} aria-expanded={moreFixes}
                style={{ background: "none", border: `1px solid ${T.border}`, borderRadius: 10, padding: "10px 14px", cursor: "pointer", fontFamily: T.sans, fontSize: 13, fontWeight: 600, color: T.textMid, textAlign: "left" }}>
                {moreFixes ? "Hide the other fixes" : `Show ${shownRecs.length - 3} more fixes`}
              </button>
            )}
            {/* Projection */}
            {(() => { const proj = Math.min(score + recommendations.reduce((a, r) => a + r.impact, 0), 97); return (
            <div style={{ background: T.greenLo, border: `1px solid ${T.green}33`, borderRadius: 14, padding: "18px 22px", display: "flex", gap: 14, alignItems: "center" }}>
              <div style={{ fontSize: 24 }}>🎯</div>
              <div>
                <div style={{ fontFamily: T.serif, fontSize: 17, color: T.text, fontWeight: 400 }}>After all fixes, projected score: <span style={{ color: T.green }}>{proj}/100 (grade {scoreGrade(proj)})</span></div>
                <div style={{ fontSize: 13, color: T.textMid, marginTop: 4 }}>Estimated: 1–3 weeks, depending on CoinJoin wait times. The ceiling is 97, not 100 — what's already on-chain can't be erased, only diluted going forward.</div>
              </div>
            </div>
            ); })()}

            <div style={{ background: T.card, border: `1px solid ${threatOpen || tm ? T.cyan + "44" : T.border}`, borderRadius: 14, padding: "12px 16px" }}>
              {!threatOpen ? (
                <button type="button" onClick={() => setThreatOpen(true)} aria-expanded={false}
                  style={{ background: "none", border: "none", padding: 0, cursor: "pointer", fontFamily: T.mono, fontSize: 11, color: T.cyan, letterSpacing: 0.4 }}>
                  Rank these for a specific adversary →
                </button>
              ) : (
                <>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                    <span style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, letterSpacing: 1.5, flexShrink: 0 }}>WHO ARE YOU HIDING FROM?</span>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      <Pill active={!tm} onClick={() => setThreat(null)}>Everyone</Pill>
                      {THREAT_MODELS.map(m => (
                        <Pill key={m.id} active={threat === m.id} onClick={() => setThreat(threat === m.id ? null : m.id)}>{m.icon} {m.label}</Pill>
                      ))}
                    </div>
                    <button type="button" onClick={() => setThreatOpen(false)} aria-expanded={true}
                      style={{ marginLeft: "auto", background: "none", border: "none", padding: 0, cursor: "pointer", fontFamily: T.mono, fontSize: 10, color: T.textDim }}>
                      Hide
                    </button>
                  </div>
                  {tm && (
                    <div style={{ fontSize: 12.5, color: T.textMid, lineHeight: 1.6, marginTop: 10, borderTop: `1px solid ${T.borderLo}`, paddingTop: 10 }}>
                      {tm.sees}
                    </div>
                  )}
                </>
              )}
            </div>

            <div style={{ background: T.card, border: `1px solid ${T.cyan}33`, borderRadius: 16, overflow: "hidden" }}>
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
              <button onClick={openAi} style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 18px", cursor: "pointer", textAlign: "left", width: "100%", background: "transparent", border: "none", transition: "background .15s" }}
                onMouseOver={e => e.currentTarget.style.background = T.cyan + "0a"}
                onMouseOut={e => e.currentTarget.style.background = "transparent"}>
                <div style={{ width: 36, height: 36, background: T.cyan + "18", border: `1px solid ${T.cyan}33`, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>✦</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 3 }}>Ask the Privacy Assistant</div>
                  <div style={{ fontSize: 12, color: T.textMid, lineHeight: 1.55 }}>
                    A walkthrough for your {checks.filter(c => c.status !== "pass").length} issues. You'll see the exact text first — the score and these findings, never your address. <span style={{ color: T.textDim }}>5 questions per session.</span>
                  </div>
                </div>
                <div style={{ flexShrink: 0, textAlign: "center" }}>
                  <div style={{ background: T.cyan, borderRadius: 8, padding: "7px 14px", color: T.bg, fontSize: 12, fontWeight: 700, whiteSpace: "nowrap" }}>Ask now →</div>
                </div>
              </button>
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

            {/* Next moves — close the loop into the sibling tools. Diagnosis is
                only half the hub; these hand the user the tool that prevents the
                NEXT leak (Inspector) and the one that sees the real perimeter
                (whole-wallet xpub scan). */}
            {onNav && (
              <div style={{ background: T.card, border: `1px solid ${T.cyan}2e`, borderRadius: 14, padding: "18px 22px" }}>
                <div style={{ fontFamily: T.mono, fontSize: 9, color: T.cyan, letterSpacing: 2, marginBottom: 12 }}>NEXT MOVES</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-start", flexWrap: "wrap" }}>
                    <span aria-hidden="true" style={{ fontSize: 18, flexShrink: 0 }}>🔬</span>
                    <div style={{ flex: 1, minWidth: 220, fontSize: 13, color: T.textMid, lineHeight: 1.6 }}>
                      <strong style={{ color: T.text }}>Protect the next transaction.</strong> Before you broadcast your next spend, paste the unsigned transaction (PSBT) into the Inspector and see what it leaks — while you can still fix it. Then rescan here and watch your score move.
                    </div>
                    <button onClick={() => onNav("inspector")}
                      style={{ background: "transparent", border: `1.5px solid ${T.cyan}55`, borderRadius: 8, padding: "7px 14px", color: T.cyan, fontFamily: T.mono, fontSize: 11, cursor: "pointer", transition: "all .15s", whiteSpace: "nowrap", flexShrink: 0 }}
                      onMouseOver={e => { e.currentTarget.style.background = T.cyan; e.currentTarget.style.color = T.bg; }}
                      onMouseOut={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = T.cyan; }}>
                      Open the Inspector →
                    </button>
                  </div>
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-start", flexWrap: "wrap", borderTop: `1px solid ${T.borderLo}`, paddingTop: 12 }}>
                    <span aria-hidden="true" style={{ fontSize: 18, flexShrink: 0 }}>🔑</span>
                    <div style={{ flex: 1, minWidth: 220, fontSize: 13, color: T.textMid, lineHeight: 1.6 }}>
                      <strong style={{ color: T.text }}>This score covers one address.</strong> {clusterN > 0
                        ? <>The chain already links it to <strong style={{ color: T.red }}>{clusterN} other{clusterN > 1 ? "s" : ""}</strong> — your real exposure is wallet-wide. The xpub scan derives every address in your browser and audits the whole perimeter.</>
                        : <>If it belongs to an HD wallet, the xpub scan audits every address the wallet derives — including the reuse and cross-address links no single-address scan can see.</>}
                    </div>
                    <button onClick={() => onNav("xpub")}
                      style={{ background: "transparent", border: `1.5px solid ${T.cyan}55`, borderRadius: 8, padding: "7px 14px", color: T.cyan, fontFamily: T.mono, fontSize: 11, cursor: "pointer", transition: "all .15s", whiteSpace: "nowrap", flexShrink: 0 }}
                      onMouseOver={e => { e.currentTarget.style.background = T.cyan; e.currentTarget.style.color = T.bg; }}
                      onMouseOut={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = T.cyan; }}>
                      Scan the whole wallet →
                    </button>
                  </div>
                </div>
              </div>
            )}
            {isMobile && onNav && (
              <div style={{ textAlign: "center", padding: "2px 0 0" }}>
                <button onClick={() => onNav("methodology")}
                  style={{ background: "none", border: "none", fontFamily: T.mono, fontSize: 10, color: T.textMid, cursor: "pointer", textDecoration: "underline dotted", textUnderlineOffset: 3 }}>
                  How scoring works — every heuristic, in the open →
                </button>
              </div>
            )}
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
        {tab === "UTXOs" && (() => {
          const plan = groupCoins(utxos);
          const picked = plan.coins.filter(c => pickedCoins.includes(c.i));
          const preview = picked.length ? previewCoinSpend(picked) : null;
          const toggleCoin = (i) => setPickedCoins(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);
          return (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ fontSize: 13, color: T.textMid, marginBottom: 6 }}>
              <strong style={{ color: T.text }}>{utxos.length}</strong> unspent outputs — each is a separate chunk of Bitcoin. Click any row to expand. Select coins to see what spending them together would reveal.
            </div>
            {plan.separate && (
              <div style={{ background: T.card, border: `1px solid ${T.amber}55`, borderRadius: 14, padding: isMobile ? "12px 14px" : "14px 16px" }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: T.text }}>Coins that must never be spent together</div>
                <p style={{ fontSize: 14, color: T.text, lineHeight: 1.45, margin: "4px 0 8px" }}>An observer learns they are one wallet the moment one transaction spends a coin from each group.</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {plan.buckets.map(b => (
                    <div key={b.id} style={{ fontSize: 14, color: T.textMid, lineHeight: 1.4 }}>
                      <span style={{ color: T.text, fontWeight: 700 }}>{b.title}. </span>
                      {b.coins.map(c => coinName(c.utxo.value)).join(", ")}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {preview && (
              <div style={{ background: preview.ok ? T.greenLo : T.card, border: `1px solid ${preview.ok ? T.green : T.amber}66`, borderRadius: 14, padding: isMobile ? "12px 14px" : "14px 16px" }}>
                <div style={{ fontSize: 13, color: T.textMid }}>If you spend these {picked.length} together</div>
                <div style={{ fontFamily: T.serif, fontSize: isMobile ? 18 : 20, color: T.text, marginTop: 4 }}>{preview.headline}</div>
                <p style={{ fontSize: 14, color: T.text, lineHeight: 1.45, margin: "6px 0 0" }}>{preview.ok ? "An observer learns about as much as they would from a normal payment." : preview.changes[0].learns}</p>
                {!preview.ok && preview.changes[0] && (
                  <p style={{ fontSize: 14, color: T.textMid, lineHeight: 1.45, margin: "6px 0 0" }}>How, in {preview.changes[0].where}: {preview.changes[0].steps[0]}</p>
                )}
              </div>
            )}
            {utxos.length === 0 && (
              <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: 40, textAlign: "center", fontSize: 14, color: T.textMid }}>
                No unspent outputs. This address has been fully spent.
              </div>
            )}
            {plan.coins.map((c) => {
              const u = c.utxo;
              const i = c.i;
              const risk = classifyUtxo(u);
              const { color } = RISK_META[risk];
              const open = selectedUtxo === i;
              const on = pickedCoins.includes(i);
              return (
                <div key={u.txid + i}
                  style={{ background: T.card, border: `1.5px solid ${on ? T.cyan : open ? color : T.border}`, borderRadius: 14, padding: isMobile ? "14px" : "16px 20px", transition: "all .15s", animation: `fadeUp .3s ease ${i * .05}s both` }}
                  onMouseEnter={e => !open && (e.currentTarget.style.borderColor = T.cyan + "44")}
                  onMouseLeave={e => !open && !on && (e.currentTarget.style.borderColor = T.border)}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <input type="checkbox" checked={on} onChange={() => toggleCoin(i)}
                      aria-label={"Select " + coinName(u.value) + ", " + c.label}
                      style={{ width: 18, height: 18, marginTop: 4, flexShrink: 0, accentColor: T.cyan }} />
                    <button type="button" aria-expanded={open} onClick={() => setSelectedUtxo(open ? null : i)}
                      style={{ flex: 1, minWidth: 0, textAlign: "left", background: "none", border: "none", padding: 0, cursor: "pointer", font: "inherit", color: "inherit" }}>
                      <span style={{ display: "block", fontFamily: T.serif, fontSize: isMobile ? 20 : 26, color, lineHeight: 1 }}>{fmt.btcRow(u.value)}</span>
                      <span style={{ display: "block", fontSize: 15, fontWeight: 700, color: T.text, marginTop: 6 }}>{c.label}</span>
                      <span style={{ display: "block", fontSize: 14, color: T.textMid, lineHeight: 1.45, marginTop: 2 }}>{c.reason}</span>
                      <span style={{ display: "block", fontSize: 14, color: T.text, lineHeight: 1.45, marginTop: 4 }}>In Sparrow: {c.sparrow}</span>
                      {c.also && <span style={{ display: "block", fontSize: 13, color: T.textMid, lineHeight: 1.45, marginTop: 2 }}>{c.also}</span>}
                      <span style={{ display: "block", fontFamily: T.mono, fontSize: 12, color: T.textDim, marginTop: 4 }}>{fmt.txid(u.txid)} · {u.status?.block_time ? fmt.age(u.status.block_time) : "unconfirmed"}</span>
                    </button>
                  </div>
                  {open && (
                    <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${T.borderLo}` }}>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 20, alignItems: "flex-end" }}>
                        <div><div style={{ fontFamily: T.mono, fontSize: 11, color: T.textDim, marginBottom: 4 }}>TXID</div><div style={{ fontFamily: T.mono, fontSize: 12, color: T.textMid, wordBreak: "break-all" }}>{u.txid}</div></div>
                        <div><div style={{ fontFamily: T.mono, fontSize: 11, color: T.textDim, marginBottom: 4 }}>SATOSHIS</div><div style={{ fontFamily: T.mono, fontSize: 12, color: T.textMid }}>{u.value.toLocaleString()}</div></div>
                        <div><div style={{ fontFamily: T.mono, fontSize: 11, color: T.textDim, marginBottom: 4 }}>CONFIRMED</div><div style={{ fontFamily: T.mono, fontSize: 12, color: u.status?.confirmed ? T.green : T.btc }}>{u.status?.confirmed ? "Yes" : "Pending"}</div></div>
                        {u.scriptpubkey_type && <div><div style={{ fontFamily: T.mono, fontSize: 11, color: T.textDim, marginBottom: 4 }}>SCRIPT TYPE</div><div style={{ fontFamily: T.mono, fontSize: 12, color: T.textMid }}>{u.scriptpubkey_type}</div></div>}
                        {onInspectTx && /^[0-9a-fA-F]{64}$/.test(u.txid) && (
                          <button onClick={e => { e.stopPropagation(); const full = txs.find(t => t.txid === u.txid); if (full) onInspectTx(full); else if (onInspectTxid) onInspectTxid(u.txid); }}
                            aria-label={"Deep-inspect the transaction that created this UTXO: " + u.txid}
                            title="Full forensics on the transaction that created this coin — entropy, deterministic links, fingerprint (uses already-loaded data when available)"
                            style={{ background: "transparent", border: `1px solid ${T.cyan}44`, borderRadius: 6, padding: "4px 8px", color: T.cyan, fontFamily: T.mono, fontSize: 11, cursor: "pointer", letterSpacing: 0.5, whiteSpace: "nowrap", marginLeft: "auto", transition: "all .15s" }}
                            onMouseOver={e => { e.currentTarget.style.background = T.cyan; e.currentTarget.style.color = T.bg; }}
                            onMouseOut={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = T.cyan; }}>
                            Inspect funding tx →
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          );
        })()}

        {/* ── TRANSACTIONS ── */}
        {tab === "Transactions" && (
          <div>
            <div style={{ fontSize: 13, color: T.textMid, marginBottom: 12 }}>
              {txSample?.capped && txSample.total != null ? (
                <>Based on the latest <strong style={{ color: T.text }}>{txSample.fetched}</strong> of <strong style={{ color: T.text }}>{txSample.total}</strong> transactions.</>
              ) : (
                <><strong style={{ color: T.text }}>{txs.length}</strong> transactions.</>
              )}
              {" "}We flag CoinJoins, unsafe consolidations, and round amounts.
              {txs.length > 20 ? " Showing the latest 20." : ""}
            </div>
            <div tabIndex={isMobile ? 0 : undefined} role="region" aria-label="Transactions"
              style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
              <div style={{ minWidth: 680 }}>
              <div style={{ display: "grid", gridTemplateColumns: onInspectTx ? "130px 90px 50px 50px 1fr 100px 76px" : "130px 90px 60px 60px 1fr 110px", padding: "10px 20px", borderBottom: `1px solid ${T.borderLo}` }}>
                {(onInspectTx ? ["TXID","DATE","IN","OUT","FLAGS","FEE",""] : ["TXID","DATE","IN","OUT","FLAGS","FEE"]).map((h, hi) => (
                  <div key={hi} style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, letterSpacing: 1.5 }}>{h}</div>
                ))}
              </div>
              {txs.slice(0, 20).map((tx, i) => {
                const flags = [];
                if (isCoinJoinShape(tx.vin, tx.vout)) flags.push({ l: (classifyCoinjoin(tx.vin, tx.vout) || {}).type === "Whirlpool" ? "Whirlpool" : "CoinJoin", c: T.green });
                if (tx.vin?.length >= 4 && tx.vout?.length <= 2) flags.push({ l: "Consolidation", c: T.red });
                if ((tx.vout || []).some(o => isRoundSat(o.value))) flags.push({ l: "Round amount", c: T.amber });
                if (!flags.length) flags.push({ l: "Standard", c: T.textDim });
                return (
                  <div key={tx.txid} style={{ display: "grid", gridTemplateColumns: onInspectTx ? "130px 90px 50px 50px 1fr 100px 76px" : "130px 90px 60px 60px 1fr 110px", padding: "10px 20px", borderBottom: `1px solid ${T.borderLo}`, alignItems: "center", animation: `fadeUp .3s ease ${i * .03}s both`, opacity: 0, transition: "background .12s" }}
                    onMouseEnter={e => e.currentTarget.style.background = T.surface}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <span style={{ fontFamily: T.mono, fontSize: 11, color: T.textMid }}>{fmt.txid(tx.txid)}</span>
                    <span style={{ fontFamily: T.mono, fontSize: 11, color: T.textDim }}>{tx.status?.block_time ? fmt.age(tx.status.block_time) : "—"}</span>
                    <span style={{ fontFamily: T.mono, fontSize: 11, color: T.textDim }}>{tx.vin?.length || "?"}</span>
                    <span style={{ fontFamily: T.mono, fontSize: 11, color: T.textDim }}>{tx.vout?.length || "?"}</span>
                    <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>{flags.map((f, fi) => <Tag key={fi} label={f.l} color={f.c} size={9} />)}</div>
                    {/* FIX: sats not s */}
                    <span style={{ fontFamily: T.mono, fontSize: 11, color: T.textDim }}>{tx.fee ? `${tx.fee.toLocaleString()} sats` : "—"}</span>
                    {onInspectTx && (
                      <button onClick={() => onInspectTx(tx)} aria-label={"Deep-inspect transaction " + tx.txid}
                        title="Full forensics on this transaction — entropy, deterministic links, fingerprint (no refetch: uses the data already loaded)"
                        style={{ background: "transparent", border: `1px solid ${T.cyan}44`, borderRadius: 6, padding: "4px 8px", color: T.cyan, fontFamily: T.mono, fontSize: 9, cursor: "pointer", letterSpacing: 0.5, whiteSpace: "nowrap", justifySelf: "end", transition: "all .15s" }}
                        onMouseOver={e => { e.currentTarget.style.background = T.cyan; e.currentTarget.style.color = T.bg; }}
                        onMouseOut={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = T.cyan; }}>
                        Inspect →
                      </button>
                    )}
                  </div>
                );
              })}
              </div>
            </div>
          </div>
        )}

        {/* ── FLOW / EXPOSURE MAP ── */}
        {tab === "Flow" && (
          <ExposureFlow txs={txs} isMobile={isMobile} onFix={() => setTab("Fix It")} entity={CASE_FILES.find(c => c.address === address)?.entity} address={address} onScan={onRescan} />
        )}

        {/* Scoring write-up lives on ?page=methodology. The results link there
            instead of repeating it. */}


      </div>

      {shareOpen && <ShareCard parts={planList} score={score} grade={grade} checks={checks} address={address} isLightning={false} onClose={() => setShareOpen(false)} />}
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

      {/* ── Mobile sticky bottom tab bar ── */}
      {isMobile && (
        <nav style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 200, background: T.bg, borderTop: `1px solid ${T.border}`, display: "flex", height: "calc(64px + env(safe-area-inset-bottom, 0px))", paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
          {TABS.map(t => {
            const icons = { "Fix It": "★", "Overview": "◎", "Flow": "⋔", "UTXOs": "⬡", "Transactions": "⇄", "Methodology": "≡" };
            return (
              <button key={t} onClick={() => setTab(t)} aria-current={tab === t ? "page" : undefined} style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3, background: "none", border: "none", cursor: "pointer", borderTop: `2px solid ${tab === t ? T.cyan : "transparent"}`, transition: "border-color .15s" }}>
                <span style={{ fontSize: 14, color: tab === t ? T.cyan : T.textDim }}>{icons[t]}</span>
                <span style={{ fontFamily: T.mono, fontSize: 10, color: tab === t ? T.cyan : T.textDim, letterSpacing: 0, maxWidth: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t}</span>
              </button>
            );
          })}
        </nav>
      )}
    </div>
  );
}
