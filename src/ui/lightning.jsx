/* ─────────────────────────────────────────────
   LIGHTNING DASHBOARD
───────────────────────────────────────────── */
function LightningDashboard({ nodeId, nodeData, channels, isMobile, onBack, onRescan, toast, onNav, onOpenWalletReview, planSaved, onPlan }) {
  const [tab, setTab] = useState("Fix It");
  const { score, grade, checks, recommendations } = useMemo(
    () => runLightningEngine(nodeData, channels), [nodeData, channels]
  );
  const col = scoreColor(score);
  const fails = checks.filter(c => c.status === "fail").length;
  const warns = checks.filter(c => c.status === "warn").length;
  const passes = checks.filter(c => c.status === "pass").length;
  const planMine = useMemo(() => snapshotPart({ kind: "node", score, grade, checks }), [score, grade, checks]);
  const planList = useMemo(() => mergePlanParts(planMine, planSaved), [planMine, planSaved]);
  useEffect(() => { if (onPlan && planMine) onPlan(planMine); }, [onPlan, planMine]);
  const [expandedCheck, setExpandedCheck] = useState(null);
  const [doneFixes, setDoneFixes] = useState(() => getDoneFixes(nodeId || "ln"));
  const [shareOpen, setShareOpen] = useState(false);
  const [aiStage, setAiStage] = useState(null);
  const [statsOpen, setStatsOpen] = useState(false);
  const [moreLn, setMoreLn] = useState(false);
  const toggleDone = k => setDoneFixes(p => { const n = new Set(p); n.has(k) ? n.delete(k) : n.add(k); saveDoneFixes(nodeId || "ln", n); return n; });

  const totalCap = channels.reduce((s, c) => s + (c.capacity || 0), 0);
  const alias = (nodeData.alias || "Unknown Node").replace(/[\x00-\x1f\x7f]/g, "").trim().slice(0, 50) || "Unknown Node";
  const pubkeyShort = nodeId ? `${nodeId.slice(0, 10)}…${nodeId.slice(-6)}` : "—";
  const TABS = ["Fix It", "Checks", "Channels"];

  const handleRescan = () => onRescan && onRescan(nodeId, false, "ln_pubkey");

  return (
    <div role="main" aria-label={`Lightning privacy audit for ${nodeData?.alias || nodeId.slice(0, 16)}`} style={{ minHeight: "100vh", background: "transparent", display: "flex", flexDirection: "column", paddingBottom: isMobile ? "calc(72px + env(safe-area-inset-bottom, 0px))" : 0 }}>
      <h1 className="sr-only">Lightning privacy score {score} of 100, grade {grade}</h1>

      {/* ── Share modal — unified with BTC ── */}
      {shareOpen && <ShareCard parts={planList} score={score} grade={grade} checks={checks} address={nodeId} isLightning={true} onClose={() => setShareOpen(false)} />}
      {aiStage === "consent" && (
        <AiConsentGate score={score} grade={grade} checks={checks} recommendations={recommendations} walletMeta={{ isPublic: false }} onAccept={() => setAiStage("chat")} onDecline={() => setAiStage(null)} />
      )}

      {/* ── Nav — matches BTC nav ── */}
      <nav style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10, padding: isMobile ? "12px 16px" : "12px 32px", borderBottom: `1px solid ${T.border}`, background: T.bg, position: "sticky", top: 0, zIndex: 100 }}>
        <button onClick={onBack} style={{ background: "transparent", border: `1.5px solid ${T.border}`, borderRadius: 8, padding: "7px 12px", color: T.textMid, fontFamily: T.sans, fontSize: 13, cursor: "pointer", transition: "border .15s", flex: "0 0 auto" }}
          onMouseOver={e => e.currentTarget.style.borderColor = T.ln}
          onMouseOut={e => e.currentTarget.style.borderColor = T.border}>← Back</button>
        {!isMobile && <div style={{ fontFamily: T.display, fontSize: 15, letterSpacing: 4, fontWeight: 700, flex: "0 0 auto" }}>ANON<span style={{ color: T.cyan }}>SCORE</span></div>}
        <div style={{ display: "flex", gap: 8, flex: "0 0 auto", marginLeft: "auto", alignItems: "center" }}>
          <Tag label={scoreLabel(score)} color={col} size={12} />
          {!isMobile && (
            <>
              <button onClick={handleRescan} style={{ background: "transparent", border: `1.5px solid ${T.border}`, borderRadius: 8, padding: "6px 12px", color: T.textMid, fontSize: 13, cursor: "pointer", transition: "all .15s" }}
                onMouseOver={e => e.currentTarget.style.borderColor = T.ln}
                onMouseOut={e => e.currentTarget.style.borderColor = T.border}>↻ Re-scan</button>
              <button onClick={() => setShareOpen(true)} style={{ background: "transparent", border: `1.5px solid ${T.border}`, borderRadius: 8, padding: "6px 12px", color: T.textMid, fontSize: 13, cursor: "pointer", transition: "all .15s" }}
                onMouseOver={e => e.currentTarget.style.borderColor = T.ln}
                onMouseOut={e => e.currentTarget.style.borderColor = T.border}>Share</button>
            </>
          )}
          {isMobile && (
            <>
              <button onClick={() => setShareOpen(true)} style={{ background: "transparent", border: `1.5px solid ${T.border}`, borderRadius: 8, padding: "6px 10px", color: T.textMid, fontSize: 12, cursor: "pointer" }}>Share</button>
              <button onClick={handleRescan} aria-label="Re-scan this node" style={{ background: "transparent", border: `1.5px solid ${T.border}`, borderRadius: 8, padding: "6px 10px", color: T.textMid, fontSize: 12, cursor: "pointer" }}>↻</button>
            </>
          )}
        </div>
        {/* Alias on its own row so a long name cannot shrink the risk tag. */}
        <div style={{ flex: "1 0 100%", minWidth: 0 }}>
          <div title={alias} style={{ fontFamily: T.mono, fontSize: 13, color: T.textMid, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            ⚡ {alias !== "Unknown Node" ? alias : (nodeId ? `${nodeId.slice(0,10)}…${nodeId.slice(-6)}` : "Lightning Node")}
          </div>
          <div style={{ fontFamily: T.mono, fontSize: 11, color: T.textDim, marginTop: 2 }}>Lightning node audit{nodeId && nodeId.length >= 20 ? ` · ${pubkeyShort}` : ""}</div>
        </div>
      </nav>

      <div style={{ flex: 1, padding: isMobile ? "12px 12px" : "16px 32px", maxWidth: 1100, margin: "0 auto", width: "100%" }}>

        <ResultHero
          score={score}
          grade={grade}
          riskLabel={scoreLabel(score)}
          riskColor={col}
          verdict={plainVerdict({ score, checks, kind: "ln" })}
          fail={fails}
          warn={warns}
          pass={passes}
          statsOpen={statsOpen}
          onToggleStats={() => setStatsOpen(o => !o)}
          isMobile={isMobile}
          stats={[
            { label: "CHANNELS", val: channels.length, sub: "open", color: T.blue },
            { label: "CAPACITY", val: `₿${(totalCap/1e8).toFixed(3)}`, sub: "total", color: T.btc },
            { label: "VS TARGET", val: score >= 70 ? `+${score-70}` : `${score-70}`, sub: "target 70+", color: score >= 70 ? T.green : T.red },
          ]}
        />

        <PrivacyPlanCard parts={planList} onShare={() => setShareOpen(true)} />

        {/* ── Tabs — desktop only; mobile uses bottom bar ── */}
        {!isMobile && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14, overflowX: "auto", paddingBottom: 2 }}>
            {TABS.map(t => <Pill key={t} active={tab === t} onClick={() => setTab(t)} color={T.ln}>{t}</Pill>)}
            {onNav && (
              <button type="button" onClick={() => onNav("methodology")}
                style={{ background: "none", border: "none", fontFamily: T.sans, fontSize: 13, color: T.textMid, cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 3, whiteSpace: "nowrap" }}>
                How scoring works
              </button>
            )}
          </div>
        )}
        {isMobile && <div style={{ marginBottom: 14 }} />}

        {/* ── Fix It ── */}
        {tab === "Fix It" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {recommendations.length > 0 && (
              <h2 style={{ fontFamily: T.serif, fontSize: isMobile ? 20 : 22, color: T.text, fontWeight: 400, margin: 0 }}>
                {fails > 0 || score < 60 ? "Do these first" : warns > 0 ? "The one thing left" : "If you want to go further"}
              </h2>
            )}
            {recommendations.length === 0 && score < 80 && (
              <div style={{ fontSize: 14, color: T.textMid, padding: "4px 0" }}>No specific fix for this node. The Checks tab lists what was looked at.</div>
            )}

            {recommendations.slice(0, moreLn ? recommendations.length : 3).map((r, i) => {
              const done = doneFixes.has(r.key);
              return (
                <div key={r.key} style={{ background: done ? T.greenLo : T.card, border: `1px solid ${done ? T.green + "44" : T.border}`, borderRadius: 14, overflow: "hidden", transition: "all .2s" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "18px 20px" }}>
                    <div style={{ fontFamily: T.mono, fontSize: 11, color: done ? T.green : T.ln, minWidth: 24, marginTop: 2 }}>{String(i+1).padStart(2,"0")}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, marginBottom: 6 }}>
                        <div style={{ fontSize: 15, fontWeight: 700, color: done ? T.textDim : T.text, textDecoration: done ? "line-through" : "none", flex: "1 1 200px" }}>{r.action}</div>
                        <span style={{ fontFamily: T.mono, fontSize: 12, color: T.green, background: T.greenLo, padding: "3px 8px", borderRadius: 5, flexShrink: 0 }}>+{r.impact} pts</span>
                        <Tag label={r.effort} color={r.effort === "Easy" ? T.green : r.effort === "Medium" ? T.amber : T.red} size={11} />
                      </div>
                      {!done && <div style={{ fontSize: 14, color: T.textMid, lineHeight: 1.6 }}>{r.detail}</div>}
                      {!done && i < 3 && <FixSteps rec={r} />}
                      {!done && <FixToolChips tools={r.tools} onReview={onOpenWalletReview} />}
                    </div>
                    <button onClick={() => toggleDone(r.key)}
                      style={{ background: done ? T.green : "transparent", border: `1.5px solid ${done ? T.green : T.border}`, borderRadius: 8,
                        padding: "6px 10px", color: done ? T.bg : T.textDim, fontSize: 11, cursor: "pointer", transition: "all .2s", whiteSpace: "nowrap" }}>
                      {done ? "✓ Done" : "Mark done"}
                    </button>
                  </div>
                </div>
              );
            })}
            {recommendations.length > 3 && (
              <button type="button" onClick={() => setMoreLn(v => !v)} aria-expanded={moreLn}
                style={{ background: "none", border: `1px solid ${T.border}`, borderRadius: 10, padding: "10px 14px", cursor: "pointer", fontFamily: T.sans, fontSize: 13, fontWeight: 600, color: T.textMid, textAlign: "left" }}>
                {moreLn ? "Hide the other fixes" : `Show ${recommendations.length - 3} more fixes`}
              </button>
            )}
            {/* AI assistant card — same pattern as BTC */}
            {aiStage !== "chat" && (
              <div style={{ background: T.card, border: `1px solid ${T.ln}33`, borderRadius: 16, overflow: "hidden", marginBottom: 2 }}>
                <div style={{ display: "flex", gap: 0, borderBottom: `1px solid ${T.borderLo}` }}>
                  {[
                    { icon: "✕", label: "Node ID never sent" },
                    { icon: "✕", label: "No data stored" },
                    { icon: "✕", label: "Not used for training" },
                  ].map((badge, i) => (
                    <div key={i} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, padding: "7px 8px", borderRight: i < 2 ? `1px solid ${T.borderLo}` : undefined, background: T.greenLo }}>
                      <span style={{ fontFamily: T.mono, fontSize: 9, color: T.green, fontWeight: 700 }}>{badge.icon}</span>
                      <span style={{ fontFamily: T.mono, fontSize: 9, color: T.green, letterSpacing: 0.3, whiteSpace: "nowrap" }}>{badge.label}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => setAiStage("consent")} style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 18px", cursor: "pointer", textAlign: "left", width: "100%", background: "transparent", border: "none", transition: "background .15s" }}
                  onMouseOver={e => e.currentTarget.style.background = T.ln + "0a"}
                  onMouseOut={e => e.currentTarget.style.background = "transparent"}>
                  <div style={{ width: 36, height: 36, background: T.ln + "18", border: `1px solid ${T.ln}33`, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>⚡</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 3 }}>Ask the Privacy Assistant</div>
                    <div style={{ fontSize: 12, color: T.textMid, lineHeight: 1.55 }}>
                      A walkthrough for your {checks.filter(c => c.status !== "pass").length} Lightning issues. You'll see the exact text first — the score and these findings, never your node pubkey. <span style={{ color: T.textDim }}>5 questions per session.</span>
                    </div>
                  </div>
                  <div style={{ flexShrink: 0 }}>
                    <div style={{ background: T.ln, borderRadius: 8, padding: "7px 14px", color: T.bg, fontSize: 12, fontWeight: 700, whiteSpace: "nowrap" }}>Ask now →</div>
                  </div>
                </button>
              </div>
            )}

            {aiStage === "chat" && (
              <AiAssistant
                checks={checks}
                recommendations={recommendations}
                score={score}
                grade={grade}
                onClose={() => setAiStage(null)}
                starters={[
                  `Which of my ${checks.filter(c => c.status !== "pass").length} issues should I fix first?`,
                  "How do I switch my node to Tor-only?",
                  "What's the actual risk of peering with a KYC exchange?",
                  "How do I set a pseudonymous node alias?",
                ]}
              />
            )}
            {/* Next moves — Lightning's on-chain feet + the open methodology.
                Also the mobile path to Methodology (the tab is desktop-only). */}
            {onNav && (
              <div style={{ background: T.card, border: `1px solid ${T.ln}2e`, borderRadius: 14, padding: "18px 22px" }}>
                <div style={{ fontFamily: T.mono, fontSize: 9, color: T.ln, letterSpacing: 2, marginBottom: 12 }}>NEXT MOVES</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-start", flexWrap: "wrap" }}>
                    <span aria-hidden="true" style={{ fontSize: 18, flexShrink: 0 }}>&#x1F52C;</span>
                    <div style={{ flex: 1, minWidth: 220, fontSize: 13, color: T.textMid, lineHeight: 1.6 }}>
                      <strong style={{ color: T.text }}>Your channels have on-chain feet.</strong> Every channel open and close is an ordinary Bitcoin transaction — paste a funding txid into the Inspector to see exactly what it reveals about your node's wallet.
                    </div>
                    <button onClick={() => onNav("inspector")}
                      style={{ background: "transparent", border: `1.5px solid ${T.ln}55`, borderRadius: 8, padding: "7px 14px", color: T.ln, fontFamily: T.mono, fontSize: 11, cursor: "pointer", transition: "all .15s", whiteSpace: "nowrap", flexShrink: 0 }}
                      onMouseOver={e => { e.currentTarget.style.background = T.ln; e.currentTarget.style.color = T.bg; }}
                      onMouseOut={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = T.ln; }}>
                      Open the Inspector &#x2192;
                    </button>
                  </div>
                  <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", borderTop: `1px solid ${T.borderLo}`, paddingTop: 12 }}>
                    <span style={{ flex: 1, minWidth: 220, fontSize: 12.5, color: T.textMid, lineHeight: 1.5 }}>All 8 Lightning heuristics — deductions, sources, threat models — are published.</span>
                    <button onClick={() => onNav("methodology")}
                      style={{ background: "none", border: "none", padding: 0, fontFamily: T.mono, fontSize: 10, color: T.textMid, cursor: "pointer", textDecoration: "underline dotted", textUnderlineOffset: 3 }}>
                      How scoring works &#x2192;
                    </button>
                  </div>
                </div>
              </div>
            )}
            {/* Share card */}
            <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, padding: "18px 22px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
              <div>
                <div style={{ fontFamily: T.serif, fontSize: 17, color: T.text, fontWeight: 400 }}>Share your node score</div>
                <div style={{ fontSize: 13, color: T.textMid, marginTop: 3 }}>Let your Nostr or Twitter followers check theirs.</div>
              </div>
              <button onClick={() => setShareOpen(true)} style={{ background: T.ln, border: "none", borderRadius: 10, padding: "11px 20px", color: T.bg, fontFamily: T.sans, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>Share Grade {grade} →</button>
            </div>

            {/* Lightning privacy explainer */}
            <div style={{ background: T.lnLo, border: `1px solid ${T.lnMid}`, borderRadius: 14, padding: "16px 20px", marginTop: 4 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: T.ln, marginBottom: 6 }}>⚡ What Lightning scores — and what it can't</div>
              <div style={{ fontSize: 13, color: T.textMid, lineHeight: 1.7 }}>
                Lightning <em>payments</em> are private by design — they don't appear on-chain. What we score is your <strong style={{ color: T.text }}>node's public footprint</strong>: IP exposure, KYC peer connections, on-chain channel history, and identity linkage. If you use a custodial wallet (Wallet of Satoshi, Strike), there's nothing to score — your provider sees everything.
              </div>
            </div>
          </div>
        )}

        {/* ── Checks ── */}
        {tab === "Checks" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, letterSpacing: 2, marginBottom: 8 }}>
              {checks.length} CHECKS · LIGHTNING NODE PRIVACY
            </div>
            {checks.map(c => {
              const statusColor = c.status === "pass" ? T.green : c.status === "warn" ? T.amber : T.red;
              const sevColor = { critical: T.red, high: T.btc, medium: T.amber, low: T.blue, clean: T.green }[c.sev] || T.textDim;
              const open = expandedCheck === c.key;
              return (
                <div key={c.key} style={{ borderRadius: 12, border: `1px solid ${open ? statusColor + "44" : T.border}`, overflow: "hidden", transition: "border-color .2s" }}>
                  <div onClick={() => setExpandedCheck(open ? null : c.key)}
                    style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 16px", cursor: "pointer", background: open ? statusColor + "0d" : "transparent" }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: statusColor, flexShrink: 0, boxShadow: `0 0 6px ${statusColor}` }} />
                    <div style={{ flex: 1, fontSize: 13, fontWeight: 600, color: T.text }}>{c.name}</div>
                    <Tag label={c.sev.toUpperCase()} color={sevColor} size={9} />
                    <span style={{ color: T.textDim, fontSize: 11, marginLeft: 4 }}>{open ? "▲" : "▼"}</span>
                  </div>
                  {open && (
                    <div style={{ padding: "0 16px 14px 36px", borderTop: `1px solid ${T.borderLo}` }}>
                      <p style={{ fontSize: 13, color: T.textMid, lineHeight: 1.65, marginTop: 12, marginBottom: 0 }}>{c.detail}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── Channels ── */}
        {tab === "Channels" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, letterSpacing: 2, marginBottom: 8 }}>
              {channels.length} OPEN CHANNELS · PEER RISK ANALYSIS
            </div>
            {channels.length === 0 && (
              <div style={{ fontSize: 13, color: T.textMid, padding: "20px 0" }}>No open channels found for this node.</div>
            )}
            {channels.map((ch, i) => {
              const peerPub = ch.node1_pub === nodeId ? ch.node2_pub : ch.node1_pub;
              const isKyc = isKycNode(ch.node1_pub) || isKycNode(ch.node2_pub);
              const pct = totalCap > 0 ? Math.round((ch.capacity / totalCap) * 100) : 0;
              const riskColor = isKyc ? T.red : T.green;
              const riskLabel = isKyc ? "KYC" : "OK";
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, background: T.card, border: `1px solid ${isKyc ? T.red + "44" : T.border}`, borderRadius: 12, padding: "12px 16px" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: riskColor, flexShrink: 0, boxShadow: `0 0 5px ${riskColor}` }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: T.mono, fontSize: 11, color: T.textMid, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {peerPub ? `${peerPub.slice(0,14)}…` : `Channel ${i+1}`}
                    </div>
                    {/* Capacity bar */}
                    <div style={{ height: 3, background: T.border, borderRadius: 2, marginTop: 6 }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: isKyc ? T.red : T.ln, borderRadius: 2 }} />
                    </div>
                  </div>
                  <div style={{ fontFamily: T.mono, fontSize: 12, color: T.textDim, whiteSpace: "nowrap", flexShrink: 0 }}>{pct}% · {(ch.capacity / 1e8).toFixed(4)} BTC</div>
                  <span style={{ flexShrink: 0 }}><Tag label={riskLabel} color={riskColor} size={11} /></span>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* ── Mobile sticky bottom tab bar ── */}
      {isMobile && (
        <nav style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 200, background: T.bg, borderTop: `1px solid ${T.border}`, display: "flex", height: "calc(64px + env(safe-area-inset-bottom, 0px))", paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
          {TABS.map(t => {
            const icons = { "Fix It": "★", "Checks": "◎", "Channels": "⚡", "Methodology": "≡" };
            return (
              <button key={t} onClick={() => setTab(t)} aria-current={tab === t ? "page" : undefined} style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3, background: "none", border: "none", cursor: "pointer", borderTop: `2px solid ${tab === t ? T.ln : "transparent"}`, transition: "border-color .15s" }}>
                <span style={{ fontSize: 14, color: tab === t ? T.ln : T.textDim }}>{icons[t]}</span>
                <span style={{ fontFamily: T.mono, fontSize: 10, color: tab === t ? T.ln : T.textDim, letterSpacing: 0, maxWidth: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.toUpperCase()}</span>
              </button>
            );
          })}
        </nav>
      )}
    </div>
  );
}
