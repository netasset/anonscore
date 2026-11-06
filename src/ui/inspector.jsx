/* ─────────────────────────────────────────────
   FLOW GRAPH — a reusable inputs→outputs value-flow. Renders the input and output
   cards as HTML (keeps text, "Audit →" jumps, and screen-reader semantics native)
   and draws the input→output relationships as an inline-SVG bezier overlay,
   measured from the real card positions (robust to variable heights). Each edge is
   weighted by the link-probability matrix (lp) the entropy engine already computes:
   deterministic links (LP=1, provable on-chain) are solid red; ambiguous links
   fade with their probability. The overlay is aria-hidden — the same linkage is
   conveyed textually by the "⛓ provably" note and the LP heatmap. Desktop only;
   mobile stacks the cards. No deps, no network, no auto-fire.
───────────────────────────────────────────── */
function FlowGraph({ inputs, outputs, lp, outIdx, isMobile, onAudit }) {
  const wrapRef = useRef(null), leftRef = useRef(null), rightRef = useRef(null);
  const inRefs = useRef([]), outRefs = useRef([]);
  const [edges, setEdges] = useState([]);
  const [box, setBox] = useState({ w: 0, h: 0 });
  inRefs.current = []; outRefs.current = [];

  const measure = useCallback(() => {
    const wrap = wrapRef.current, left = leftRef.current, right = rightRef.current;
    if (!wrap || !left || !right) return;
    const wb = wrap.getBoundingClientRect();
    if (!wb.width) return;
    const cy = el => { const r = el.getBoundingClientRect(); return r.top - wb.top + r.height / 2; };
    const xIn = left.getBoundingClientRect().right - wb.left;
    const xOut = right.getBoundingClientRect().left - wb.left;
    const inY = inRefs.current.map(el => el ? cy(el) : null);
    const outY = outRefs.current.map(el => el ? cy(el) : null);
    const es = [];
    if (lp && lp.length) {
      for (let i = 0; i < lp.length; i++) for (let j = 0; j < lp[i].length; j++) {
        const v = lp[i][j]; if (v <= 0.001) continue;
        const oj = outIdx ? outIdx[j] : j;
        if (inY[i] == null || outY[oj] == null) continue;
        es.push({ x1: xIn, y1: inY[i], x2: xOut, y2: outY[oj], v, det: Math.abs(v - 1) < 1e-9 });
      }
    } else {                                   // no link data (raw hex): faint neutral fan
      for (let i = 0; i < inputs.length; i++) for (let j = 0; j < outputs.length; j++) {
        if (inY[i] == null || outY[j] == null) continue;
        es.push({ x1: xIn, y1: inY[i], x2: xOut, y2: outY[j], v: 0.1, neutral: true });
      }
    }
    es.sort((a, b) => a.v - b.v);              // strongest links drawn last (on top)
    setEdges(es);
    setBox({ w: wb.width, h: wb.height });
  }, [lp, outIdx, inputs, outputs]);

  useLayoutEffect(() => {
    if (isMobile) return;
    measure();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : null;
    if (ro && wrapRef.current) ro.observe(wrapRef.current);
    return () => ro && ro.disconnect();
  }, [measure, isMobile]);

  const inputCard = (v, i) => (
    <div key={i} ref={el => (inRefs.current[i] = el)} style={{ fontFamily: T.mono, fontSize: 11.5, color: T.textMid, background: T.surface, border: `1px solid ${T.borderLo}`, borderRadius: 8, padding: "7px 10px" }}>
      <div style={{ color: v.faint ? T.textDim : T.text, overflow: "hidden", textOverflow: "ellipsis" }}>{v.title}</div>
      <div style={{ color: T.textDim, fontSize: 10, marginTop: 2 }}>{v.sub}</div>
    </div>
  );
  const outputCard = (o, i) => (
    <div key={i} ref={el => (outRefs.current[i] = el)} style={{ fontFamily: T.mono, fontSize: 11.5, background: T.surface, border: `1px solid ${o.color}44`, borderLeft: `3px solid ${o.color}`, borderRadius: 8, padding: "7px 10px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
        <span style={{ color: T.text, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis" }}>{o.title}</span>
        <span style={{ color: o.color, flexShrink: 0, fontSize: 9 }}>{o.note}</span>
      </div>
      <div style={{ color: T.textDim, fontSize: 10, marginTop: 2 }}>{o.sub}</div>
      {o.det && <div style={{ color: T.red, fontSize: 9, marginTop: 3, letterSpacing: 0.3 }}>⛓ provably from these inputs</div>}
      {o.address && onAudit && (
        <AuditButton onClick={() => onAudit(o.address)} size={11} ariaLabel={"Audit output address " + o.address} style={{ marginTop: 6 }} />
      )}
    </div>
  );

  if (isMobile) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {inputs.map(inputCard)}
        <div style={{ textAlign: "center", color: T.textDim, fontSize: 15 }} aria-hidden="true">↓</div>
        {outputs.map(outputCard)}
      </div>
    );
  }
  return (
    <div ref={wrapRef} style={{ position: "relative", display: "grid", gridTemplateColumns: "1fr 76px 1fr", alignItems: "start" }}>
      <svg width={box.w} height={box.h} viewBox={`0 0 ${box.w || 1} ${box.h || 1}`} preserveAspectRatio="none" aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        {edges.map((e, k) => {
          const xm = (e.x1 + e.x2) / 2;
          return <path key={k} d={`M ${e.x1} ${e.y1} C ${xm} ${e.y1}, ${xm} ${e.y2}, ${e.x2} ${e.y2}`} fill="none"
            stroke={e.neutral ? T.textDim : T.red}
            strokeWidth={e.det ? 2.4 : e.neutral ? 1 : 0.7 + e.v * 1.1}
            strokeOpacity={e.det ? 0.92 : e.neutral ? 0.14 : 0.12 + e.v * 0.58}
            strokeDasharray={e.det ? undefined : e.neutral ? "1.5 3" : "5 3"}
            strokeLinecap="round" />;
        })}
      </svg>
      <div ref={leftRef} style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: 6 }}>{inputs.map(inputCard)}</div>
      <div aria-hidden="true" />
      <div ref={rightRef} style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: 6 }}>{outputs.map(outputCard)}</div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   TRANSACTION INSPECTOR — standalone tool at /?page=inspector. Paste a PSBT or
   raw tx your wallet is about to sign and see what it leaks BEFORE you broadcast.
   PSBT/raw-hex are parsed and analyzed entirely in the browser (zero network).
───────────────────────────────────────────── */
const txErrBtn = { background: "transparent", border: `1px solid ${T.border}`, borderRadius: 8, padding: "8px 12px", color: T.text, fontFamily: T.sans, fontSize: 13, cursor: "pointer" };

function TransactionInspector({ onBack, isMobile, onScan, onNav, prefill, prefillTx }) {
  useLang();
  const relayEnabled = useRelay() && !!RELAY_URL;
  const expId = useExplorer();
  const [raw, setRaw] = useState(prefill || "");
  const [busy, setBusy] = useState(false);   // fetching a confirmed tx by txid
  const [result, setResult] = useState(null);   // { kind, tx }
  const [error, setError] = useState(null);     // { kind, message } | null
  const detected = detectTxInput(raw);

  // The whole analysis pipeline (incl. the Boltzmann entropy counter) computed
  // ONCE per Inspect and memoised on the parsed tx — not on every keystroke /
  // language-toggle re-render, which previously re-ran the entire pipeline.
  const derived = useMemo(() => {
    if (!result) return null;
    const tx = result.tx;
    return { tx, a: analyzeTx(tx), change: guessChange(tx), clus: clusterUnification(tx), fr: feeRate(tx), link: txLinkability(tx), fp: fingerprintTx(tx), cj: classifyCoinjoin(tx.vin, tx.vout) };
  }, [result]);

  useEffect(() => {
    const prev = document.title;
    document.title = "Transaction Inspector — pre-broadcast privacy check — AnonScore";
    const desc = document.querySelector('meta[name="description"]');
    const prevDesc = desc?.getAttribute("content");
    desc?.setAttribute("content", "Paste a PSBT or raw Bitcoin transaction and see exactly what it will leak — before you broadcast. Runs entirely in your browser; nothing is sent anywhere. Free and open source.");
    return () => { document.title = prev; if (desc && prevDesc) desc.setAttribute("content", prevDesc); };
  }, []);

  const inspect = async (text) => {
    const input = text != null ? text : raw;
    setError(null); setResult(null);
    let parsed;
    try {
      parsed = parseTransactionInput(input);
    } catch (e) {
      setError({ kind: e && e.kind ? e.kind : "parse", message: e && e.message ? e.message : "Couldn't parse that input." });
      return;
    }
    if (parsed.kind !== "txid") { setResult(parsed); return; }
    // Confirmed-tx lookup — the one networked path in the Inspector. It runs on
    // the user's Inspect click (or the landing handoff click), via the relay
    // when enabled, and fails honestly — never a silent direct fallback.
    // fetchTx names which failure it was (relay block, explorer outage,
    // unknown txid). An invalid shape never gets this far.
    setBusy(true);
    try {
      const tx = await fetchTx(input.trim());
      setResult({ kind: "txid", tx });
    } catch (e) {
      setError({ kind: e && e.kind ? e.kind : "upstream", message: e && e.message ? e.message : "Couldn't fetch that transaction." });
    } finally { setBusy(false); }
  };
  const loadDemo = () => { setRaw(DEMO_PSBT); inspect(DEMO_PSBT); };

  // Landing handed us a transaction the user already asked to analyze — parse it
  // on arrival (for a txid this runs the fetch the user's click requested).
  // The Dashboard can also hand an ALREADY-FETCHED tx object (prefillTx):
  // zero network, straight to the report.
  useEffect(() => {
    if (prefillTx) { try { setResult({ kind: "txobj", tx: normalizeEsploraTx(prefillTx) }); } catch {} return; }
    if (prefill) inspect(prefill);
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  const sats = v => v == null ? "—" : v >= 1e8 ? "₿" + (v / 1e8).toFixed(4) : v.toLocaleString() + " sats";
  const trunc = a => !a ? "—" : a.startsWith("script:") ? "unrecognized script" : a.length > 26 ? a.slice(0, 13) + "…" + a.slice(-6) : a;

  const label = { fontFamily: T.mono, fontSize: 9, color: T.textDim, letterSpacing: 1.5, marginBottom: 8 };
  const panel = extra => ({ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: isMobile ? "16px 18px" : "18px 22px", ...extra });

  // ---- report ----
  let report = null;
  if (result && derived) {
    const { tx, a, change, clus, fr, link, fp, cj } = derived;
    const ent = link.available ? (link.N === 1 ? { c: T.red, t: "Fully deterministic" } : link.entropy < 1 ? { c: T.red, t: "Very low ambiguity" } : link.entropy < 1.585 ? { c: T.amber, t: "Low ambiguity" } : link.entropy < 3 ? { c: T.cyan, t: "Ambiguous" } : { c: T.green, t: "Strongly ambiguous" }) : null;
    const lpCell = v => Math.abs(v - 1) < 1e-9 ? { bg: T.red, fg: T.bg, txt: "1" } : v === 0 ? { bg: T.surface, fg: T.textDim, txt: "0" } : { bg: T.red + Math.round(18 + v * 60).toString(16).padStart(2, "0"), fg: T.text, txt: v.toFixed(2).replace(/^0/, "") };
    const inAddrs = new Set((tx.vin || []).map(v => v.prevout && v.prevout.scriptpubkey_address).filter(Boolean));
    const outColor = (o, i) => _txDust(o) ? T.red : (o.scriptpubkey_address && inAddrs.has(o.scriptpubkey_address)) ? T.red
      : _txOpReturn(o) ? T.textDim : (change && change.index === i) ? T.cyan : _txRound(o.value) ? T.btc : T.textMid;
    const outNote = (o, i) => _txDust(o) ? "dust" : (o.scriptpubkey_address && inAddrs.has(o.scriptpubkey_address)) ? "reuse"
      : _txOpReturn(o) ? "data" : (change && change.index === i) ? "likely change" : _txRound(o.value) ? "round" : "payment";
    // Original output indices deterministically linked (LP=1) to some input — i.e.
    // provably funded by this tx's inputs, the concrete face of the entropy metric.
    const detOut = new Set();
    if (link.available) link.lp.forEach(row => row.forEach((v, j) => { if (Math.abs(v - 1) < 1e-9) detOut.add(link.outIdx[j]); }));

    report = (
      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 20, animation: "fadeUp .4s ease both" }}>
        {/* verdict */}
        <div style={{ background: a.leaky ? T.red + "10" : T.green + "12", border: `1px solid ${a.leaky ? T.red + "40" : T.green + "45"}`, borderRadius: 16, padding: isMobile ? "16px 18px" : "18px 22px" }}>
          <div style={{ ...label, color: a.leaky ? T.red : T.green }}>{tx.confirmed ? "FORENSIC VERDICT · CONFIRMED TX" : "PRE-BROADCAST VERDICT"}</div>
          <div style={{ fontFamily: T.serif, fontSize: isMobile ? 18 : 21, color: T.text, fontWeight: 400, marginBottom: a.findings.length ? 12 : 0 }}>
            {tx.confirmed
              ? (a.leaky
                  ? "This transaction leaked. What follows is what every analyst already reads from it."
                  : (link && link.available && link.entropy === 0
                      ? "An ordinary payment. An analyst can follow the coins, which is true of almost every payment, and nothing here adds reuse, a round amount, or a merge."
                      : "Nothing in this transaction adds a special fingerprint. The readings below are what is already public."))
              : (a.leaky
                  ? "This transaction leaks. You can still fix it before broadcasting."
                  : (link && link.available && link.entropy === 0
                      ? "An ordinary payment. An analyst could follow the coins, which is true of almost every payment, and nothing here adds reuse, a round amount, or a merge. You can still change it before you broadcast."
                      : "Nothing here adds a special fingerprint. You can still change it before you broadcast."))}
          </div>
          {a.findings.length > 0 && (
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 7, padding: 0, margin: 0 }}>
              {a.findings.map((f, i) => (
                <li key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 13, color: T.textMid, lineHeight: 1.5 }}>
                  <span style={{ color: f.ok ? T.green : T.red, flexShrink: 0, marginTop: 1, fontFamily: T.mono }}>{f.ok ? "✓" : "→"}</span>{f.t}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Raw hex is the degraded path (no input values) — route to the full-power
            confirmed-tx lookup, which is one paste away. */}
        {result.kind === "rawhex" && (tx.partial || (link && !link.available && link.reason === "input-values-unknown")) && (
          <div style={{ background: T.surface, border: `1px solid ${T.borderLo}`, borderRadius: 12, padding: "12px 16px" }}>
            <div style={{ fontFamily: T.mono, fontSize: 9, color: T.cyan, letterSpacing: 1.5, marginBottom: 6 }}>ALREADY BROADCAST?</div>
            <div style={{ fontSize: 12.5, color: T.textMid, lineHeight: 1.6 }}>
              Paste this transaction's 64-character <strong style={{ color: T.text }}>txid</strong> instead — the explorer supplies the input amounts, so interpretation entropy, deterministic links, the exact fee rate, and the what-happened-since timeline all light up.
            </div>
          </div>
        )}

        {/* Confirmation context — this analysis is permanent, not preventable */}
        {tx.confirmed && tx.status && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", background: T.surface, border: `1px solid ${T.borderLo}`, borderRadius: 12, padding: "10px 16px" }}>
            <span style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, letterSpacing: 1.5 }}>CONFIRMED</span>
            {tx.status.block_height != null && <Tag label={"block " + tx.status.block_height.toLocaleString()} color={T.textMid} size={9} />}
            {tx.status.block_time != null && <Tag label={fmt.age(tx.status.block_time)} color={T.textMid} size={9} />}
            {fr && <Tag label={fr.rate + " sat/vB" + (fr.estimated ? " (est)" : "")} color={T.textMid} size={9} />}
            <span style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, marginLeft: "auto" }}>on-chain forever — every reading below is public</span>
          </div>
        )}

        {/* What happened since — the confirmed-only intel a pre-broadcast check
            can never see: which outputs were spent, and whether any were later
            RE-MERGED in one spend (proving common ownership after the fact). */}
        {tx.outspends && tx.outspends.length === (tx.vout || []).length && (() => {
          const spentIn = {};
          tx.outspends.forEach((o, i) => { if (o && o.spent && o.txid) (spentIn[o.txid] = spentIn[o.txid] || []).push(i); });
          const remerged = Object.entries(spentIn).filter(([, idxs]) => idxs.length >= 2);
          const spentN = tx.outspends.filter(o => o && o.spent).length;
          const changeSpent = change && tx.outspends[change.index] && tx.outspends[change.index].spent;
          return (
            <div style={panel({ borderColor: (remerged.length ? T.red : T.border) + (remerged.length ? "55" : "") })}>
              <div style={{ ...label, color: remerged.length ? T.red : T.textDim }}>WHAT HAPPENED SINCE</div>
              <div style={{ fontSize: 13, color: T.textMid, lineHeight: 1.6, marginBottom: 10 }}>
                {spentN === 0
                  ? "None of this transaction's outputs have been spent yet — the trail pauses here, but every output is being watched from the moment it moves."
                  : <>{spentN} of {tx.outspends.length} output{tx.outspends.length !== 1 ? "s" : ""} ha{spentN === 1 ? "s" : "ve"} been spent since confirmation{changeSpent ? " — including the likely change, so the owner's trail continued and an analyst kept following it" : ""}.</>}
              </div>
              {remerged.length > 0 && (
                <div style={{ background: T.red + "10", border: `1px solid ${T.red}33`, borderRadius: 10, padding: "9px 12px", fontSize: 12.5, color: T.textMid, lineHeight: 1.6, marginBottom: 10 }}>
                  <strong style={{ color: T.red }}>Outputs re-merged.</strong> {remerged.map(([, idxs]) => "#" + idxs.map(i => i + 1).join(" + #")).join(", ")} were later spent <em>together in one transaction</em> — on-chain proof they belonged to one owner. Whatever ambiguity this transaction created, that spend undid it.
                </div>
              )}
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                {tx.outspends.map((o, i) => {
                  const out = (tx.vout || [])[i] || {};
                  const spent = o && o.spent;
                  return (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, background: T.surface, border: `1px solid ${T.borderLo}`, borderRadius: 8, padding: "7px 11px", fontFamily: T.mono, fontSize: 10.5 }}>
                      <span style={{ color: T.textDim, flexShrink: 0 }}>#{i + 1}</span>
                      <span style={{ color: T.textMid, flexShrink: 0 }}>{sats(out.value)}</span>
                      <span style={{ width: 7, height: 7, borderRadius: "50%", background: spent ? T.red : T.green, flexShrink: 0 }} aria-hidden="true" />
                      <span style={{ color: spent ? T.textMid : T.green, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
                        {spent ? <>spent{o.status && o.status.block_time && tx.status && tx.status.block_time ? " " + _sinceDays(tx.status.block_time, o.status.block_time) : ""} in {o.txid ? o.txid.slice(0, 10) + "…" : "?"}</> : "unspent — still watchable"}
                      </span>
                      {spent && o.txid && (
                        <button onClick={() => { setRaw(o.txid); inspect(o.txid); }} aria-label={"Follow the coins: inspect spending transaction " + o.txid}
                          title="Follow the coins — run the same forensics on the transaction that spent this output"
                          style={{ background: "transparent", border: `1px solid ${T.cyan}44`, borderRadius: 5, padding: "2px 7px", color: T.cyan, fontFamily: T.mono, fontSize: 9, cursor: "pointer", flexShrink: 0, transition: "all .15s" }}
                          onMouseOver={e => { e.currentTarget.style.background = T.cyan; e.currentTarget.style.color = T.bg; }}
                          onMouseOut={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = T.cyan; }}>
                          follow →
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}

        {/* interpretation entropy / linkability (Boltzmann) */}
        {link.available && (
          <div style={panel({ borderColor: ent.c + "33" })}>
            <div style={{ ...label, color: ent.c }}>INTERPRETATION ENTROPY</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap", marginBottom: 10 }}>
              <span style={{ fontFamily: T.serif, fontSize: isMobile ? 26 : 32, color: ent.c, fontWeight: 400 }}>{link.entropy.toFixed(2)}<span style={{ fontSize: 13, color: T.textDim, marginLeft: 4 }}>bits</span></span>
              <span style={{ fontFamily: T.sans, fontSize: 14, color: T.text, fontWeight: 600 }}>{ent.t}</span>
              <span style={{ fontFamily: T.mono, fontSize: 10, color: T.textDim, marginLeft: "auto" }}>{link.N.toLocaleString()} interpretation{link.N !== 1 ? "s" : ""}</span>
              {link.efficiency != null
                ? <span title={"This transaction's interpretations as a share of the best-possible transaction with the same input/output count (Nmax = " + link.nmax.toLocaleString() + ") — the wallet-efficiency metric LaurentMT's Boltzmann and KYCP.org printed. Entropy density: " + (link.entropy / (link.n + link.m)).toFixed(2) + " bits per input/output."}
                    style={{ fontFamily: T.mono, fontSize: 10, color: ent.c }}>{Math.round(link.efficiency * 100)}% efficiency</span>
                : <span title="The ideal same-shape transaction exceeds the exact-count cap, so efficiency can't be computed at this size." style={{ fontFamily: T.mono, fontSize: 10, color: T.textDim }}>efficiency n/a at this size</span>}
            </div>
            <div style={{ fontSize: 13, color: T.textMid, lineHeight: 1.6, marginBottom: link.dl > 0 ? 12 : 0 }}>
              {link.N === 1
                ? "There is exactly one way to read this transaction — every input maps to every output with certainty. An analyst needs no guesswork; the whole trail is provable."
                : "There are " + link.N.toLocaleString() + " equally-valid ways to map these inputs to these outputs (E = log₂N). The more readings, the less any single input→output link can be proven — this is the metric KYCP.org and OXT scored before they went dark."}
            </div>
            {link.dl > 0 && (
              <div style={{ background: T.red + "10", border: `1px solid ${T.red}33`, borderRadius: 10, padding: "9px 12px", fontSize: 12.5, color: T.textMid, lineHeight: 1.6 }}>
                <strong style={{ color: T.red }}>{link.dl} deterministic link{link.dl !== 1 ? "s" : ""}</strong> — pairing{link.dl !== 1 ? "s" : ""} that hold{link.dl === 1 ? "s" : ""} in <em>every</em> interpretation, so it is provable on-chain which input funded which output. This is precisely what surveillance clustering exploits.
              </div>
            )}
            {link.n * link.m <= 64 && (
              <div style={{ marginTop: 12, overflowX: "auto" }}>
                <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, letterSpacing: 1, marginBottom: 6 }}>LINK PROBABILITY · rows = inputs · cols = outputs</div>
                <div style={{ display: "inline-grid", gridTemplateColumns: `auto repeat(${link.m}, minmax(30px, 1fr))`, gap: 3 }}>
                  <span />
                  {link.outIdx.map((oi, j) => <span key={"h" + j} style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, textAlign: "center", alignSelf: "end", paddingBottom: 2 }}>o{oi + 1}</span>)}
                  {link.lp.map((row, i) => [
                    <span key={"r" + i} style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, alignSelf: "center", paddingRight: 4 }}>in{i + 1}</span>,
                    ...row.map((v, j) => { const c = lpCell(v); return <span key={i + "-" + j} title={"P(input " + (i + 1) + " → output " + (link.outIdx[j] + 1) + ") = " + v.toFixed(3)} style={{ background: c.bg, color: c.fg, fontFamily: T.mono, fontSize: 10, textAlign: "center", padding: "6px 2px", borderRadius: 4, minWidth: 30 }}>{c.txt}</span>; })
                  ])}
                </div>
              </div>
            )}
          </div>
        )}
        {!link.available && (link.reason === "too-many" || link.reason === "iteration-cap") && (
          <div style={panel()}>
            <div style={{ ...label, color: T.green }}>INTERPRETATION ENTROPY</div>
            <div style={{ fontSize: 13, color: T.textMid, lineHeight: 1.6 }}>
              {link.reason === "too-many"
                ? "This transaction has " + link.n + " inputs and " + link.m + " outputs — beyond the 12×12 limit for exact link analysis (the same bound the reference Boltzmann tool uses). Very large transactions have astronomically many interpretations, which on its own means strong ambiguity."
                : "This transaction has too many valid interpretations to count exactly in the browser — which itself signals very high entropy and strong input→output ambiguity (typical of a CoinJoin)."}
            </div>
          </div>
        )}

        {/* coinjoin classification + post-mix consolidation warning */}
        {cj && (
          <div style={panel({ borderColor: T.green + "3a" })}>
            <div style={{ ...label, color: T.green }}>{cj.type === "Whirlpool" ? "WHIRLPOOL COINJOIN" : cj.type === "Wasabi" ? "EQUAL-VALUE COINJOIN" : "COINJOIN DETECTED"}</div>
            <div style={{ fontSize: 13, color: T.textMid, lineHeight: 1.6 }}>
              {cj.participants} equal outputs of <strong style={{ color: T.text }}>{sats(cj.denom)}</strong>{cj.type === "Whirlpool" ? " in a 5×5 pool" : cj.type === "Wasabi" ? " — an equal-value (ZeroLink / legacy Wasabi-style) round, ~99% detectable by its structure (not modern WabiSabi, which uses variable amounts)" : ""}. Good: equal outputs break the deterministic input→output trail for everyone in the round.
            </div>
            <div style={{ background: T.amber + "10", border: `1px solid ${T.amber}33`, borderRadius: 10, padding: "9px 12px", fontSize: 12.5, color: T.textMid, lineHeight: 1.6, marginTop: 10 }}>
              <strong style={{ color: T.amber }}>Don't undo it by consolidating.</strong> If you later spend several of these mixed outputs together, the common-input heuristic re-links them into one cluster — measured to erode a mix's anonymity set by <strong style={{ color: T.text }}>10–50%</strong>, worst in the first day. Spend mixed coins one output at a time, and let them rest.
            </div>
          </div>
        )}

        {/* wallet fingerprint */}
        {fp.available && fp.signals.length > 0 && (
          <div style={panel({ borderColor: fp.distinctive > 0 ? T.amber + "33" : T.border })}>
            <div style={{ ...label, color: fp.distinctive > 0 ? T.amber : T.textDim }}>WALLET FINGERPRINT</div>
            <div style={{ fontSize: 13, color: T.textMid, lineHeight: 1.6, marginBottom: 12 }}>
              {fp.distinctive > 0
                ? "Your transaction's structure is a fingerprint — it links your transactions to one wallet and narrows which software you run. " + (fp.guess || "")
                : "Your transaction follows common defaults — good: structurally it doesn't stand out. " + (fp.guess || "")}
            </div>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 7, padding: 0, margin: 0 }}>
              {fp.signals.map((s, i) => (
                <li key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 12.5, color: T.textMid, lineHeight: 1.55 }}>
                  <span style={{ color: s.distinctive ? T.amber : T.green, flexShrink: 0, marginTop: 1, fontFamily: T.mono }}>{s.distinctive ? "◆" : "✓"}</span>{s.t}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* likely change */}
        {change && (
          <div style={panel()}>
            <div style={label}>LIKELY CHANGE OUTPUT</div>
            <div style={{ fontSize: 13.5, color: T.textMid, lineHeight: 1.6 }}>
              Output <strong style={{ color: T.cyan }}>#{change.index + 1}</strong> ({sats(tx.vout[change.index].value)}) is most likely your <strong style={{ color: T.text }}>change</strong> — {change.reason}. <span style={{ color: T.textDim }}>Confidence: {change.confidence}.</span> Anyone reading the chain makes the same guess, then keeps following your coins.
            </div>
          </div>
        )}

        {/* cluster unification */}
        {clus.addrs.length > 1 && (
          <div style={panel({ borderColor: T.red + "33" })}>
            <div style={{ ...label, color: T.red }}>CLUSTER THIS SPEND CREATES</div>
            <div style={{ fontSize: 13.5, color: T.textMid, lineHeight: 1.6, marginBottom: 10 }}>
              Broadcasting fuses these <strong style={{ color: T.text }}>{clus.addrs.length} input addresses</strong>{clus.distinctTypes > 1 ? ` (${clus.distinctTypes} script types)` : ""} into one provable identity — the common-input heuristic every chain-surveillance firm runs.
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {clus.addrs.slice(0, 6).map(ad => (
                <div key={ad} style={{ display: "flex", alignItems: "center", gap: 10, background: T.surface, border: `1px solid ${T.borderLo}`, borderRadius: 10, padding: "8px 12px" }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: T.red, flexShrink: 0 }} />
                  <span style={{ fontFamily: T.mono, fontSize: 12, color: T.text, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis" }}>{trunc(ad)}</span>
                  {onScan && isValidBitcoinAddress(ad) && <AuditButton onClick={() => onScan(ad)} ariaLabel={"Audit input address " + ad} style={{ marginLeft: "auto" }} />}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* inputs → outputs */}
        <div style={panel()}>
          <div style={label}>INPUTS → OUTPUTS</div>
          {tx.partial && (
            <div style={{ fontSize: 12, color: T.amber, background: T.amber + "12", border: `1px solid ${T.amber}33`, borderRadius: 8, padding: "8px 12px", marginBottom: 12, lineHeight: 1.5 }}>
              {result.kind === "rawhex" ? "Raw hex carries no input data — paste the PSBT for full input-side analysis (cluster + fee)." : (result.kind === "txid" || result.kind === "txobj") ? ((tx.vin || []).some(v => v.coinbase) ? "This transaction has a coinbase (newly-mined) input, so input-side analysis covers only the regular inputs." : "Some inputs lack source data, so the fee and input-side analysis cover only the known inputs.") : "Partial PSBT — some inputs lack UTXO data, so the fee and input analysis cover only the known inputs."}
            </div>
          )}
          {link.available && (tx.vin || []).length >= 1 && (
            <div style={{ fontSize: 11, color: T.textDim, lineHeight: 1.5, marginBottom: 8 }}>
              Threads show which input funds which output. A <span style={{ color: T.red }}>solid</span> thread is a deterministic link (provable on-chain); dashed threads are ambiguous — the more they blur, the less any single link can be proven.
              <EpistemicLegend kinds={["proven", "inferred"]} color={T.red} />
            </div>
          )}
          <FlowGraph
            inputs={(tx.vin || []).map((v, i) => ({
              title: v.prevout ? trunc(v.prevout.scriptpubkey_address) : "input " + (i + 1) + " (no UTXO data)",
              sub: v.prevout ? sats(v.prevout.value) + " · " + v.prevout.scriptpubkey_type : "unknown",
              faint: !v.prevout,
            }))}
            outputs={(tx.vout || []).map((o, i) => ({
              title: trunc(o.scriptpubkey_address), sub: sats(o.value) + " · " + o.scriptpubkey_type,
              color: outColor(o, i), note: outNote(o, i), det: detOut.has(i),
              address: (o.scriptpubkey_address && !o.scriptpubkey_address.startsWith("script:") && isValidBitcoinAddress(o.scriptpubkey_address)) ? o.scriptpubkey_address : null,
            }))}
            lp={link.available ? link.lp : null} outIdx={link.available ? link.outIdx : null}
            isMobile={isMobile} onAudit={onScan ? (a => onScan(a)) : null}
          />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14, alignItems: "center" }}>
            {fr && <Tag label={"≈ " + fr.rate + " sat/vB" + (fr.estimated ? " (est)" : "")} color={T.textMid} size={9} />}
            {tx.fee != null && <Tag label={"fee " + sats(tx.fee)} color={T.textMid} size={9} />}
            {a.coinjoin && <Tag label="CoinJoin shape" color={T.green} size={9} />}
            <span style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, marginLeft: "auto" }}>{(tx.vin || []).length} in · {(tx.vout || []).length} out{tx.txid ? "" : " · unsigned"}</span>
          </div>
        </div>

        {/* broadcast-layer (network) exposure — the leak that isn't in the bytes */}
        <div style={panel({ borderColor: T.amber + "2e" })}>
          <div style={{ ...label, color: T.amber }}>WHEN YOU BROADCAST IT</div>
          <div style={{ fontSize: 13, color: T.textMid, lineHeight: 1.6 }}>
            Everything above is in the transaction itself. One leak isn't: the moment you broadcast, the first nodes that see it can tie the transaction to <strong style={{ color: T.text }}>your IP address</strong> — Bitcoin's default relay links a tx to its origin with near-certainty, and surveillance firms run hundreds of listening nodes to harvest exactly that. An IP↔tx link can undo all the on-chain care above.
          </div>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 7, padding: 0, margin: "10px 0 0" }}>
            {[
              "Broadcast through your OWN full node — it has no wallet to correlate the tx with.",
              "Or broadcast over Tor (a Tor-routed node, or paste the signed hex into a broadcaster in Tor Browser) so no peer sees your real IP.",
              "Don't rely on wallet \"private broadcast\" toggles blindly — even Bitcoin Core's -privatebroadcast leaked the sender's IP in 2026 when the encrypted connection was forced to downgrade.",
            ].map((tline, i) => (
              <li key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 12.5, color: T.textMid, lineHeight: 1.55 }}>
                <span style={{ color: T.amber, flexShrink: 0, marginTop: 1, fontFamily: T.mono }}>→</span>{tline}
              </li>
            ))}
          </ul>
        </div>

        <div style={{ fontSize: 11.5, color: T.textDim, lineHeight: 1.6, textAlign: "center" }}>
          Heuristics, not proof — PayJoin and batching can change these readings. This transaction was analyzed entirely in your browser; nothing was sent anywhere.
        </div>
      </div>
    );
  }

  return (
    <div role="main" aria-label="Transaction Inspector" style={{ minHeight: "100vh", background: "transparent", display: "flex", flexDirection: "column" }}>
      <h1 className="sr-only">Bitcoin Transaction Inspector — pre-broadcast privacy analysis</h1>
      <SiteNav isMobile={isMobile} onBack={onBack} onNav={onNav} current="inspector" badge="INSPECTOR" />

      <div style={{ flex: 1, maxWidth: 760, margin: "0 auto", width: "100%", padding: isMobile ? "28px 16px" : "44px 32px" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontFamily: T.mono, fontSize: 10, color: T.cyan, letterSpacing: 2.5, marginBottom: 14 }}>BEFORE YOU BROADCAST</div>
          <h2 style={{ fontFamily: T.serif, fontSize: isMobile ? 30 : 40, color: T.text, lineHeight: 1.1, fontWeight: 400, marginBottom: 14 }}>
            See what your transaction<br /><em style={{ color: T.cyan }}>leaks — before it's permanent.</em>
          </h2>
          <p style={{ fontSize: isMobile ? 14 : 16, color: T.textMid, lineHeight: 1.7, maxWidth: 560, margin: "0 auto", fontWeight: 300 }}>
            Paste a <strong style={{ color: T.text }}>PSBT</strong> or raw transaction your wallet is about to sign — analyzed entirely in your browser, never sent anywhere. Or paste a <strong style={{ color: T.text }}>txid</strong> to run the same forensics on any confirmed transaction (fetched from your chosen explorer{RELAY_URL ? ", via the no-log relay" : ""}).
          </p>
        </div>

        <div style={{ background: T.card, border: `1.5px solid ${detected ? T.cyan + "55" : T.border}`, borderRadius: 16, padding: isMobile ? "16px" : "20px 22px", transition: "border .2s" }}>
          <label htmlFor="tx-input" style={{ display: "block", fontFamily: T.mono, fontSize: 9, color: T.textDim, letterSpacing: 1.5, marginBottom: 8 }}>PSBT (BASE64) · RAW TX HEX · TXID</label>
          <textarea id="tx-input" value={raw} onChange={e => { setRaw(e.target.value); setError(null); setResult(null); }}
            placeholder="cHNidP8B…  or  0200000001…"
            aria-label="Paste a PSBT (base64), raw transaction hex, or a transaction id"
            spellCheck={false}
            onFocus={e => { e.target.style.borderColor = T.cyan; e.target.style.boxShadow = `0 0 0 3px ${T.cyan}22`; }}
            onBlur={e => { e.target.style.borderColor = T.border; e.target.style.boxShadow = "none"; }}
            style={{ width: "100%", boxSizing: "border-box", minHeight: 120, resize: "vertical", background: "#070910", border: `1px solid ${T.border}`, borderRadius: 10, padding: "12px 14px", color: T.text, fontFamily: T.mono, fontSize: 12.5, lineHeight: 1.5, outline: "none", transition: "border .15s, box-shadow .2s" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
            <button onClick={() => inspect()} disabled={!raw.trim() || busy} className="sheen"
              style={{ background: raw.trim() && !busy ? T.cyan : T.surface, border: "none", borderRadius: 10, padding: "12px 22px", color: raw.trim() && !busy ? T.bg : T.textDim, fontFamily: T.sans, fontWeight: 700, fontSize: 14, cursor: raw.trim() && !busy ? "pointer" : "default", transition: "all .15s" }}>
              {busy ? "Fetching…" : "Inspect →"}
            </button>
            <button onClick={loadDemo} style={{ background: "transparent", border: `1px solid ${T.border}`, borderRadius: 10, padding: "12px 16px", color: T.textMid, fontFamily: T.sans, fontSize: 13, cursor: "pointer" }}
              onMouseOver={e => e.currentTarget.style.borderColor = T.cyan} onMouseOut={e => e.currentTarget.style.borderColor = T.border}>Load example PSBT</button>
            {detected && <span style={{ fontFamily: T.mono, fontSize: 10, color: T.cyan }}>{detected === "psbt" ? "✓ PSBT detected" : detected === "rawhex" ? "✓ raw tx hex" : "✓ txid — looks up the confirmed transaction"}</span>}
          </div>
        </div>

        {error && (
          <div style={{ marginTop: 14, background: T.red + "12", border: `1px solid ${T.red}44`, borderRadius: 12, padding: "12px 16px", fontSize: 13, color: T.text, lineHeight: 1.6 }}>
            <div role="alert">
              <span style={{ color: T.red, fontFamily: T.mono, marginRight: 6 }} aria-hidden="true">⚠</span>{error.message}
            </div>
            {error.kind === "upstream" && (
              <div role="group" aria-label="Retry this lookup" style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
                <button type="button" onClick={() => inspect()} style={txErrBtn}>Try again</button>
                <button type="button" onClick={() => { setExplorer(expId === "mempool" ? "blockstream" : "mempool"); inspect(); }} style={txErrBtn}>
                  {`Switch to ${EXPLORERS[expId === "mempool" ? "blockstream" : "mempool"].label} and retry`}
                </button>
                {relayEnabled && (
                  <button type="button" onClick={() => { setRelay(false); inspect(); }} style={txErrBtn}>Turn the relay off and retry</button>
                )}
              </div>
            )}
            {error.kind === "blocked" && relayEnabled && (
              <div role="group" aria-label="Look up this transaction without the relay" style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
                <button type="button" onClick={() => { setRelay(false); inspect(); }} style={txErrBtn}>Turn the relay off and retry</button>
              </div>
            )}
          </div>
        )}

        {report}

        {!result && !error && (
          <div style={{ marginTop: 20, fontSize: 12.5, color: T.textDim, lineHeight: 1.7, textAlign: "center" }}>
            Export a PSBT from Sparrow, Electrum, Bitcoin Core, or a hardware wallet — before you sign it — and drop it here. No keys, no signing, nothing leaves the page.
          </div>
        )}
      </div>
    </div>
  );
}

