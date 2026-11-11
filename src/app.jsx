/* ─────────────────────────────────────────────
   ROOT APP
───────────────────────────────────────────── */
// Thin scroll-progress bar pinned to the top of the viewport; width tracks page scroll.
function ScrollProgress() {
  const ref = useRef(null);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = ref.current; if (!el) return;
        const h = document.documentElement;
        const max = h.scrollHeight - h.clientHeight;
        el.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + "%";
      });
    };
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    update();
    return () => { window.removeEventListener("scroll", update); window.removeEventListener("resize", update); cancelAnimationFrame(raf); };
  }, []);
  return (
    <div aria-hidden="true" style={{ position: "fixed", top: 0, left: 0, right: 0, height: 2, zIndex: 300, pointerEvents: "none" }}>
      <div ref={ref} style={{ height: "100%", width: "0%", background: `linear-gradient(90deg, ${T.btc}, ${T.cyan})`, boxShadow: `0 0 8px ${T.cyan}`, transition: "width .1s linear" }} />
    </div>
  );
}

/* ─────────────────────────────────────────────
   AMBIENT BACKDROP — one fixed atmosphere layer behind every page.
   Pure CSS: no fetched assets, transform-only motion (no blur filters —
   the orb softness comes from gradient falloff, which is GPU-cheap),
   film-grain noise to kill gradient banding on dark displays, and the
   whole thing goes still under prefers-reduced-motion. Page roots are
   background:transparent so this shows through; opaque section strips
   (T.surface) deliberately mask it, giving the page depth rhythm.
───────────────────────────────────────────── */
function AmbientBackground({ tint }) {
  // Score-reactive layer: while a dashboard is showing, the atmosphere leans
  // toward the grade color (red→green family from scoreColor). The last hue is
  // remembered so the fade-OUT keeps its color instead of snapping to nothing.
  const lastTint = useRef(tint);
  if (tint) lastTint.current = tint;
  const tc = lastTint.current;
  return (
    <div aria-hidden="true" style={{ position: "fixed", inset: 0, zIndex: -1, pointerEvents: "none", overflow: "hidden", background: T.bg }}>
      {/* Deep-space tint: indigo nebula up top, subtle vignette below */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(120% 70% at 50% -12%, #1b214066 0%, transparent 60%), radial-gradient(90% 90% at 50% 115%, #0d101f88 0%, transparent 55%)" }} />
      {/* Grade glow — fades in over the dashboard, out everywhere else */}
      {tc && <div className="amb" style={{ top: "-12%", left: "26%", width: "58vmax", height: "58vmax", background: `radial-gradient(circle, ${tc}10 0%, transparent 60%)`, opacity: tint ? 1 : 0, transition: "opacity 1.6s ease", animationDelay: "-9s" }} />}
      {/* Slow-drifting glow orbs — brand cyan + Bitcoin orange, whisper-quiet alphas */}
      <div className="amb" style={{ top: "2%", left: "-18%", width: "56vmax", height: "56vmax", background: "radial-gradient(circle,#22D3EE0a 0%,transparent 62%)" }} />
      <div className="amb" style={{ top: "32%", right: "-22%", width: "60vmax", height: "60vmax", background: "radial-gradient(circle,#F7931A08 0%,transparent 60%)", animationDelay: "-18s", animationDuration: "54s" }} />
      <div className="amb" style={{ bottom: "-26%", left: "20%", width: "52vmax", height: "52vmax", background: "radial-gradient(circle,#22D3EE07 0%,transparent 65%)", animationDelay: "-33s", animationDuration: "62s" }} />
      {/* Node grid, masked so it dissolves toward the edges */}
      <div className="dot-grid" style={{ position: "absolute", inset: 0, opacity: .5, WebkitMaskImage: "radial-gradient(90% 60% at 50% 28%, #000 0%, transparent 100%)", maskImage: "radial-gradient(90% 60% at 50% 28%, #000 0%, transparent 100%)" }} />
      {/* Film grain — the difference between "flat dark page" and "premium dark page" */}
      <div className="bg-noise" />
    </div>
  );
}

function sleepAbortable(ms, signal) {
  return new Promise((resolve, reject) => {
    if (signal && signal.aborted) {
      const err = new Error("cancelled");
      err.kind = "cancelled";
      reject(err);
      return;
    }
    const t = setTimeout(() => {
      if (signal) signal.removeEventListener("abort", onAbort);
      resolve();
    }, ms);
    if (!signal) return;
    const onAbort = () => {
      clearTimeout(t);
      const err = new Error("cancelled");
      err.kind = "cancelled";
      reject(err);
    };
    signal.addEventListener("abort", onAbort, { once: true });
  });
}
function scanFailureMessage(e, fallback) {
  if (!e || e.kind === "cancelled") return null;
  if (e.message && (e.kind === "blocked" || e.kind === "timeout" || e.kind === "upstream" || e.kind === "unknown" || e.kind === "channels")) return e.message;
  return fallback;
}

function App() {
  const [page, setPage] = useState("landing");
  const [activeCaseFile, setActiveCaseFile] = useState(null);
  const [pendingScan, setPendingScan] = useState(null); // { addr, inputType } awaiting user confirmation
  const [toolPrefill, setToolPrefill] = useState(null); // { page, value } — landing handed an xpub/PSBT to its tool
  const [walletPick, setWalletPick] = useState(null);   // slug of a directory review card to highlight (?page=wallets&pick=…)
  const [scoreTint, setScoreTint] = useState(null);     // grade color for the ambient backdrop while a dashboard shows
  const [scoreDelta, setScoreDelta] = useState(null);   // score change vs the user's previous scan of the same address
  const [planParts, setPlanParts] = useState({});
  const [reportToken, setReportToken] = useState("");
  const rememberPlan = useCallback((part) => {
    if (!part || !part.kind) return;
    setPlanParts(prev => {
      const old = prev[part.kind];
      if (old && encodeReport([old]) === encodeReport([part])) return prev;
      return { ...prev, [part.kind]: part };
    });
  }, []);

  // Inject meta/OG tags
  useEffect(() => {
    try { document.documentElement.lang = _lang; } catch {}
    const set = (sel, attr, val) => { let el = document.querySelector(sel); if (!el) { el = document.createElement("meta"); document.head.appendChild(el); } el.setAttribute(attr, val); };
    document.title = "AnonScore — Free Bitcoin & Lightning Privacy Audit";
    set('meta[name="description"]',    "content", "Paste a Bitcoin address or Lightning node pubkey. Get a privacy score, every issue explained, and a ranked fix plan. Free, open source, nothing stored.");
    set('meta[property="og:title"]',   "content", "AnonScore — Free Bitcoin & Lightning Privacy Audit");
    set('meta[property="og:description"]', "content", "11 Bitcoin heuristics + 8 Lightning checks. Score 0–100. Free, open source, runs in your browser. No data stored.");
    set('meta[property="og:url"]',     "content", "https://anonscore.com");
    set('meta[property="og:type"]',    "content", "website");
    set('meta[property="og:image"]',   "content", "https://anonscore.com/og.png");
    set('meta[name="twitter:card"]',   "content", "summary_large_image");
    set('meta[name="twitter:title"]',  "content", "AnonScore — Bitcoin & Lightning Privacy Score");
    set('meta[name="twitter:description"]', "content", "Is your Bitcoin stack leaking? Find out in 60 seconds. Free, open source.");
    set('meta[name="twitter:image"]',  "content", "https://anonscore.com/og.png");
  }, []);

  // Parse ?scan= and ?case= params. Scan stores for user confirmation (never
  // auto-fires). Case deep-links to a specific case file (makes case URLs
  // shareable + indexable per the SEO sitemap entries).
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const addr = params.get("scan");
      if (addr) {
        const t = detectInputType(addr);
        if (t) setPendingScan({ addr, inputType: t });
      }
      const caseSlug = params.get("case");
      if (caseSlug) {
        const found = CASE_FILES.find(c => c.id === caseSlug || c.slug === caseSlug);
        if (found) { setActiveCaseFile(found); setPage("case_detail"); }
      }
      const pageParam = params.get("page");
      const reportTok = readReportHash();
      if (pageParam === "coach") setPage("coach");
      else if (pageParam === "wallets") { setPage("wallets"); setWalletPick(params.get("pick") || null); }
      else if (pageParam === "inspector") setPage("inspector");
      else if (pageParam === "xpub") setPage("xpub");
      else if (pageParam === "cases") setPage("cases");
      else if (pageParam === "methodology") setPage("methodology");
      else if (reportTok && !params.get("scan") && !params.get("case")) { setReportToken(reportTok); setPage("report"); }
    } catch {}
  }, []);

  // Keep the browser URL + history in sync with in-app navigation, so the
  // Back/Forward buttons move between sections and a mid-session tool URL
  // (e.g. /?page=inspector) is copy-shareable — not just the deep links parsed
  // on load. Only the static content pages sync; transient result pages
  // (scanning / dashboards) hold scan state that can't be rebuilt from a URL,
  // so they don't push a history entry and their "← Back" returns to landing.
  const _skipPush = useRef(false);   // this page change came from popstate — don't re-push
  const _firstSync = useRef(true);   // never rewrite the load URL on first render
  const scanGen = useRef(0);
  const scanAbort = useRef(null);
  // Drop an in-flight scan so a late response can't paint over wherever the
  // user went (Cancel, Back, or a newer scan).
  const invalidateScan = () => {
    scanGen.current += 1;
    const prev = scanAbort.current;
    scanAbort.current = null;
    if (prev) prev.abort("cancel");
  };
  const pageUrl = useCallback((pg, cf) => {
    if (pg === "report") {
      const tok = reportToken || readReportHash();
      return tok ? "/#r=" + tok : "/";
    }
    if (pg === "coach" || pg === "wallets" || pg === "inspector" || pg === "xpub" || pg === "cases" || pg === "methodology") return "/?page=" + pg;
    if (pg === "case_detail" && cf) return "/?case=" + (cf.slug || cf.id);
    if (pg === "landing") return "/";
    return null;                     // scanning / dashboard / ln_dashboard — transient
  }, [reportToken]);
  useEffect(() => {
    const onPop = () => {
      _skipPush.current = true;
      invalidateScan();
      try {
        const params = new URLSearchParams(window.location.search);
        const caseSlug = params.get("case");
        if (caseSlug) {
          const found = CASE_FILES.find(c => c.id === caseSlug || c.slug === caseSlug);
          if (found) { setActiveCaseFile(found); setPage("case_detail"); return; }
        }
        const pg = params.get("page");
        const reportTok = readReportHash();
        if (reportTok && !pg && !params.get("case")) { setReportToken(reportTok); setPage("report"); return; }
        setPage(["coach", "wallets", "inspector", "xpub", "cases", "methodology"].includes(pg) ? pg : "landing");
      } catch { setPage("landing"); }
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);
  useEffect(() => {
    if (_firstSync.current) { _firstSync.current = false; return; }
    if (_skipPush.current) { _skipPush.current = false; return; }
    const url = pageUrl(page, activeCaseFile);
    if (url && (window.location.pathname + window.location.search + window.location.hash) !== url) {
      try { window.history.pushState({ page }, "", url); } catch {}
    }
  }, [page, activeCaseFile, pageUrl]);

  // Bitcoin state
  const [address, setAddress] = useState("");
  const [addrInfo, setAddrInfo] = useState(null);
  const [utxos, setUtxos] = useState([]);
  const [txs, setTxs] = useState([]);
  const [txSample, setTxSample] = useState(null);
  const [utxoSample, setUtxoSample] = useState(null);
  const [autoShare, setAutoShare] = useState(false);
  const [scanAt, setScanAt] = useState(null);
  const [defaultSimple, setDefaultSimple] = useState(false);
  const [simpleMode, setSimpleMode] = useState(null); // null until a plain-English scan or the toggle chooses; then it persists across rescans
  // Lightning state
  const [lnNodeId, setLnNodeId] = useState("");
  const [lnNodeData, setLnNodeData] = useState(null);
  const [lnChannels, setLnChannels] = useState([]);

  const [isScanningLightning, setIsScanningLightning] = useState(false);
  const [scanDataReady, setScanDataReady] = useState(false);
  const [isMobile, setIsMobile] = useState(() => typeof window !== "undefined" ? window.innerWidth < 768 : false);
  const toast = useToast();

  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);

  const analyze = useCallback(async (addr, plain = false, inputType = "btc") => {
    // Guard: a Lightning address (user@domain) has no node-lookup path, so a "scan" would
    // 404 and silently fall back to DEMO data shown as a real result. Refuse it honestly.
    if (inputType === "ln_address") {
      toast.show("Can't audit a Lightning address", { icon: "⚡", color: T.amber, msg: "Enter your node's 66-character pubkey instead" });
      return;
    }
    invalidateScan();
    const gen = scanGen.current;
    const ctrl = new AbortController();
    scanAbort.current = ctrl;
    const live = () => scanGen.current === gen;
    const isLn = inputType === "ln_pubkey";
    setScanDataReady(false);

    if (isLn) {
      setLnNodeId(addr);
      setIsScanningLightning(true);
      setPage("scanning");
      try {
        if (addr === "DEMO_LN") {
          await sleepAbortable(1400, ctrl.signal);
          if (!live()) return;
          setLnNodeData(DEMO_LN.node);
          setLnChannels(DEMO_LN.channels);
          setScoreTint(scoreColor(runLightningEngine(DEMO_LN.node, DEMO_LN.channels).score));
          setScanDataReady(true);
          await sleepAbortable(300, ctrl.signal);
          if (!live()) return;
          setPage("ln_dashboard");
          toast.show("Lightning demo loaded", { icon: "⚡", color: T.ln, msg: "Showing a sample node with privacy issues" });
          return;
        }
        const data = await fetchLightningNode(addr, { signal: ctrl.signal });
        if (!live()) return;
        const result = runLightningEngine(data.node, data.channels);
        const prevLn = getHistory().find(e => e.addr === addr);
        const lnDelta = prevLn ? result.score - prevLn.score : null;
        setLnNodeData(data.node);
        setLnChannels(data.channels);
        addToHistory({ addr, score: result.score, grade: result.grade, label: scoreLabel(result.score), scanAt: Date.now(), isLightning: true, alias: data.node.alias });
        setScoreTint(scoreColor(result.score));
        setScanDataReady(true);
        await sleepAbortable(300, ctrl.signal);
        if (!live()) return;
        setPage("ln_dashboard");
        toast.show(lnDelta > 0 ? "Node score improved" : "Node scan complete", { icon: lnDelta > 0 ? "📈" : "⚡", color: T.ln, msg: `Lightning privacy score: ${result.score}/100${lnDelta != null && lnDelta !== 0 ? ` (${lnDelta > 0 ? "+" : ""}${lnDelta} since your last scan)` : ""}` });
      } catch (e) {
        if (!live() || (e && e.kind === "cancelled")) return;
        // Honest failure — never show canned DEMO data as if it were the user's real node.
        await sleepAbortable(700, ctrl.signal).catch(() => {});
        if (!live()) return;
        setScanDataReady(false);
        setIsScanningLightning(false);
        setPage("landing");
        const msg = scanFailureMessage(e, relayOn() ? "Couldn't reach the API via the privacy relay — try again, or switch the relay off to query the API directly (it will then see your IP)." : "Couldn't reach the Lightning API — check your connection and try again.");
        if (msg) toast.show("Node scan couldn't complete", { icon: "⚠️", color: T.red, msg });
      }
      return;
    }

    setAddress(addr);
    setIsScanningLightning(false);
    setPage("scanning");
    setAutoShare(false);
    setDefaultSimple(plain);
    setTxSample(null);
    setUtxoSample(null);

    try {
      if (addr === "DEMO" || addr === "DEMO_A") {
        const demoData = addr === "DEMO_A" ? DEMO_A : DEMO;
        const isPristine = addr === "DEMO_A";
        await sleepAbortable(1400, ctrl.signal);
        if (!live()) return;
        setAddrInfo(demoData.addrInfo);
        setUtxos(demoData.utxos);
        setTxs(demoData.txs);
        setScanAt(Date.now());
        setScoreDelta(null); // demos don't track progress
        setScoreTint(scoreColor(runEngine(demoData.utxos, demoData.txs, demoData.addrInfo?.chain_stats?.tx_count || demoData.txs.length, demoData.addrInfo?.chain_stats?.funded_txo_count ?? null).score));
        setScanDataReady(true);
        await sleepAbortable(300, ctrl.signal);
        if (!live()) return;
        if (plain) setSimpleMode(prev => (prev == null ? true : prev));
        setPage("dashboard");
        toast.show("Demo loaded", { icon: isPristine ? "✨" : "🔍", color: isPristine ? T.green : T.cyan, msg: isPristine ? "Showing a pristine, CoinJoin-mixed wallet" : "Showing a sample high-risk wallet" });
        return;
      }

      const data = await fetchAddress(addr, { signal: ctrl.signal });
      if (!live()) return;
      const analysis = runEngine(data.utxos, data.txs, data.addrInfo?.chain_stats?.tx_count || data.txs.length, data.addrInfo?.chain_stats?.funded_txo_count ?? null);
      // Progress vs the previous scan of this address — read BEFORE addToHistory
      // replaces the entry. The history (and therefore this) never leaves the browser.
      const prevEntry = getHistory().find(e => e.addr === addr);
      const delta = prevEntry ? analysis.score - prevEntry.score : null;
      setScoreDelta(delta);
      setAddrInfo(data.addrInfo);
      setUtxos(data.utxos);
      setTxs(data.txs);
      setTxSample(data.txSample || null);
      setUtxoSample(data.utxoSample || null);
      setScanAt(Date.now());
      addToHistory({ addr, score: analysis.score, grade: analysis.grade, label: analysis.riskLabel, scanAt: Date.now(), isLightning: false });
      setScoreTint(scoreColor(analysis.score));
      setScanDataReady(true);
      await sleepAbortable(300, ctrl.signal);
      if (!live()) return;
      if (plain) setSimpleMode(prev => (prev == null ? true : prev));
      setPage("dashboard");
      setAutoShare(true);
      toast.show(delta > 0 ? "Score improved" : "Scan complete", { icon: delta > 0 ? "📈" : "✅", color: T.green, msg: `Privacy score: ${analysis.score}/100${delta != null && delta !== 0 ? ` (${delta > 0 ? "+" : ""}${delta} since your last scan)` : ""}` });
    } catch (e) {
      if (!live() || (e && e.kind === "cancelled")) return;
      // Honest failure — never show canned DEMO data under the user's real address.
      // A relay allowlist block (the deployed worker still 404s /txs/chain) names
      // itself. A timeout or an explorer HTTP error names itself too.
      await sleepAbortable(700, ctrl.signal).catch(() => {});
      if (!live()) return;
      setScanDataReady(false);
      setPage("landing");
      const msg = scanFailureMessage(e, relayOn() ? "Couldn't reach the explorer via the privacy relay — try again, or switch the relay off to query the explorer directly (it will then see your IP)." : "Couldn't reach the blockchain API — check your connection and try again.");
      if (msg) toast.show("Scan couldn't complete", { icon: "⚠️", color: T.red, msg });
    }
  }, [toast]);

  return (
    <>
      <style>{CSS}</style>
      <AmbientBackground tint={(page === "dashboard" || page === "ln_dashboard") ? scoreTint : null} />
      <ScrollProgress />
      <Toast toasts={toast.toasts} />

      {/* ?scan= confirmation — shown over landing, never auto-fires */}
      {pendingScan && page === "landing" && (
        <ConfirmScanModal
          pendingScan={pendingScan}
          onCancel={() => setPendingScan(null)}
          onConfirm={() => { const p = pendingScan; setPendingScan(null); analyze(p.addr, false, p.inputType); }}
        />
      )}

      {/* Page transition: opacity-only fade on every navigation (keyed by page so it replays; no transform → sticky nav preserved) */}
      <div key={page} style={{ animation: "fadeIn .35s ease both" }}>
      {page === "landing"      && <Landing onAnalyze={analyze} isMobile={isMobile} onNav={setPage} onOpenTool={(pg, value) => { setToolPrefill({ page: pg, value }); setPage(pg); }} onCases={(c) => { if (c) { setActiveCaseFile(c); setPage("case_detail"); } else { setPage("cases"); } }} />}
      {page === "cases"        && <CaseFiles onOpenCase={c => { setActiveCaseFile(c); setPage("case_detail"); }} onBack={() => setPage("landing")} isMobile={isMobile} onNav={setPage} />}
      {page === "case_detail"  && activeCaseFile && <CaseDetail caseFile={activeCaseFile} onBack={() => setPage("cases")} onAnalyze={analyze} isMobile={isMobile} onNav={setPage} />}
      {page === "scanning"     && <Scanning address={address || lnNodeId} isLightning={isScanningLightning} dataReady={scanDataReady} onCancel={() => { invalidateScan(); setScanDataReady(false); setPage("landing"); }} />}
      {page === "dashboard"    && <Dashboard address={address} addrInfo={addrInfo} utxos={utxos} txs={txs} txSample={txSample} utxoSample={utxoSample} isMobile={isMobile} onBack={() => setPage("landing")} onRescan={analyze} toast={toast} autoShare={autoShare} scanAt={scanAt} defaultSimple={defaultSimple} simpleMode={simpleMode} onSimpleModeChange={setSimpleMode} onCoach={() => setPage("coach")} delta={scoreDelta} onNav={setPage} onOpenCase={c => { setActiveCaseFile(c); setPage("case_detail"); }} onOpenWalletReview={name => { setWalletPick(wSlug(name)); setPage("wallets"); }} onInspectTx={tx => { setToolPrefill({ page: "inspector", txObj: tx }); setPage("inspector"); }} onInspectTxid={txid => { setToolPrefill({ page: "inspector", value: txid }); setPage("inspector"); }} planSaved={planParts} onPlan={rememberPlan} />}
      {page === "ln_dashboard" && <LightningDashboard nodeId={lnNodeId} nodeData={lnNodeData} channels={lnChannels} isMobile={isMobile} onBack={() => setPage("landing")} onRescan={analyze} toast={toast} onNav={setPage} onOpenWalletReview={name => { setWalletPick(wSlug(name)); setPage("wallets"); }} planSaved={planParts} onPlan={rememberPlan} />}
      {page === "coach"        && <CoachWaitlist onBack={() => setPage("landing")} isMobile={isMobile} onNav={setPage} />}
      {page === "wallets"      && <WalletDirectory onBack={() => setPage("landing")} isMobile={isMobile} onNav={setPage} pick={walletPick} />}
      {page === "inspector"    && <TransactionInspector onBack={() => setPage("landing")} isMobile={isMobile} onScan={analyze} onNav={setPage} prefill={toolPrefill?.page === "inspector" ? toolPrefill.value : null} prefillTx={toolPrefill?.page === "inspector" ? toolPrefill.txObj : null} />}
      {page === "xpub"         && <XpubScan onBack={() => setPage("landing")} isMobile={isMobile} onScan={analyze} onNav={setPage} prefill={toolPrefill?.page === "xpub" ? toolPrefill.value : null} onOpenWalletReview={name => { setWalletPick(wSlug(name)); setPage("wallets"); }} planSaved={planParts} onPlan={rememberPlan} />}
      {page === "methodology"  && <MethodologyPage onBack={() => setPage("landing")} isMobile={isMobile} onNav={setPage} />}
      {page === "report"       && <ReportPage token={reportToken} isMobile={isMobile} onNav={setPage} />}
      </div>
    </>
  );
}

// Verify, don't trust — the pure engine functions, exposed read-only so anyone
// can test the scoring logic straight from their browser console (and so CI can
// unit-test the built bundle directly). No state, no user data: pure functions.
window.__ANONSCORE_TEST__ = Object.freeze({
  runEngine, runLightningEngine, classifyUtxo, scoreGrade, isRoundSat, isDustSat,
  computeCluster, computeCounterparties, computePoisoning, isLookalikeAddress, computeActivityClock,
  buildLinkageMap,
  isValidBitcoinAddress, decodeBitcoinAddress, addressChecksumIssue, isValidLightningPubkey, detectInputType,
  scanXpub, fetchAddress,
  // Transaction Inspector — parser + analysis (validated against BIP174/173/350)
  parsePsbt, parseRawTx, classifyScript, parseTransactionInput, detectTxInput, normalizeEsploraTx,
  analyzeTx, guessChange, clusterUnification, feeRate, DEMO_PSBT,
  parseSendDescription, checkBeforeSend, runSendCheck,
  labelCoin, groupCoins, previewCoinSpend, coinName,
  // transaction entropy / linkability (Boltzmann · validated vs LaurentMT vectors)
  txInterpretations, txLinkability, isCoinJoinShape, classifyCoinjoin,
  // wallet fingerprint (structural tells: version/locktime/RBF/BIP69/script-mix/low-r)
  fingerprintTx, _derSigInfo, _scriptPushes,
  // Silent Payments (BIP352) decode/validate — validated vs the spec test vector
  _bech32Decode, decodeSilentPayment, detectSilentPayment,
  // BOLT11 Lightning invoice decode/lint — validated vs the BOLT11 spec vector
  decodeBolt11, detectBolt11,
  // BOLT12 offer + LNURL + Lightning-address decode/lint (payment-string linter)
  decodeBolt12Offer, detectBolt12, decodeLnurl, resolveLnAddress,
  // Cashu ecash token decode (V3 base64-JSON / V4 CBOR) — validated vs NUT-00
  decodeCashu, detectCashu,
  // xpub wallet scanner — crypto (validated against BIP32 TV1 + BIP84 vectors)
  _sha512, _hmacSha512, _ripemd160, decodeXpub, ckdPub, deriveWalletAddress, detectXpub,
  runWalletEngine, DEMO_WALLET,
  snapshotPart, encodeReport, decodeReport, reportText, buildPrivacyPlan, mergePlanParts,
});

ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(App));
