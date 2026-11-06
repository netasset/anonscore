/* ─────────────────────────────────────────────
   EXPOSURE FLOW — forensic transaction-flow map.
   "What a blockchain analyst sees": inputs → tx → outputs,
   each output colored by its privacy classification.
───────────────────────────────────────────── */
/* ─────────────────────────────────────────────
   ACTIVITY CLOCK — timing analysis, the heuristic people forget.
   Transaction timestamps cluster around the owner's waking hours; chain-
   analysis firms bin them by UTC clock-hour to estimate a wallet owner's
   timezone. Same technique, shown to the owner: 24 hourly bins from the
   sampled txs, the quietest 7-hour window (likely sleep), and — when the
   pattern is strong enough — the rough UTC offset an analyst would infer.
   Purely educational: does not touch the privacy score. Shown with an honest
   caveat — block_time is a CONFIRMATION time (a noisy proxy for broadcast/local
   time), and independent research (MIT DCI) found timing alone is often too weak
   to pin a timezone. Framed as one weak signal, not proof.
───────────────────────────────────────────── */
// Shared by the ActivityClock panel and the text-report export.
function computeActivityClock(txs) {
  const stamps = (txs || []).map(t => t.status?.block_time).filter(Boolean);
  const total = stamps.length;
  const counts = Array(24).fill(0);
  stamps.forEach(ts => counts[Math.floor((ts % 86400) / 3600)]++);
  // Quietest consecutive 7h window (circular) — the likely sleep block.
  const K = 7;
  let qStart = 0, qSum = Infinity;
  for (let s = 0; s < 24; s++) {
    let sum = 0;
    for (let j = 0; j < K; j++) sum += counts[(s + j) % 24];
    if (sum < qSum) { qSum = sum; qStart = s; }
  }
  const qEnd = (qStart + K) % 24;
  const hasData = total >= 6;
  // Strong signal: almost nothing happens in the quiet window.
  const strong = hasData && qSum / total <= 0.2;
  // If the quiet block is sleep centred ~03:30 local, the offset follows.
  const sleepMidUtc = (qStart + K / 2) % 24;
  let off = Math.round(3.5 - sleepMidUtc);
  off = ((off + 11 + 24) % 24) - 11; // normalize to −11…+12
  const tz = `UTC${off >= 0 ? "+" : ""}${off}`;
  const hh = h => `${String(h).padStart(2, "0")}:00`;
  return { counts, total, K, qStart, qEnd, hasData, strong, tz, hh };
}

function ActivityClock({ txs, isMobile, entity }) {
  // Case-file/public wallets get third-person framing — "this wallet's owner",
  // never "you" (same rule the AI assistant follows for forensic mode).
  const third = !!entity;
  const { counts, total, K, qStart, qEnd, hasData, strong, tz, hh } = computeActivityClock(txs);
  const max = Math.max(...counts, 1);
  // Chart geometry — 24 thin bars, baseline axis, quiet-window bracket.
  const BW = 10, GAP = 5, X0 = 8, BASE = 64, HMAX = 46;
  const width = X0 * 2 + 24 * (BW + GAP) - GAP;
  const inQuiet = h => { const d = (h - qStart + 24) % 24; return d < K; };
  return (
    <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: isMobile ? "16px 18px" : "18px 22px" }}>
      <div style={{ fontFamily: T.mono, fontSize: 9, color: T.cyan, letterSpacing: 2, marginBottom: 8 }}>ACTIVITY CLOCK</div>
      <div style={{ fontFamily: T.serif, fontSize: isMobile ? 17 : 19, color: T.text, fontWeight: 400, marginBottom: 6 }}>When you transact is a fingerprint too</div>
      {!hasData ? (
        <div style={{ fontSize: 12.5, color: T.textMid, lineHeight: 1.6 }}>
          Not enough timestamped history here to read a daily rhythm — that's one less pattern the chain gives away.
        </div>
      ) : (
        <>
          <svg viewBox={`0 0 ${width} 92`} role="img"
            aria-label={`Transactions by UTC hour of day. Quietest window ${hh(qStart)} to ${hh(qEnd)} UTC.`}
            style={{ display: "block", width: "100%", maxWidth: 480, height: "auto", marginTop: 6, overflow: "visible" }}>
            {counts.map((c, h) => {
              const x = X0 + h * (BW + GAP);
              const bh = c === 0 ? 2 : Math.max(4, (c / max) * HMAX);
              return (
                <rect key={h} x={x} y={BASE - bh} width={BW} height={bh} rx="2"
                  fill={c === 0 ? T.border : T.cyan} fillOpacity={c === 0 ? 0.6 : 0.9}>
                  <title>{`${hh(h)}–${hh((h + 1) % 24)} UTC — ${c} tx${c !== 1 ? "s" : ""}`}</title>
                </rect>
              );
            })}
            {/* baseline + hour ticks */}
            <line x1={X0} y1={BASE + 1} x2={width - X0} y2={BASE + 1} stroke={T.border} strokeWidth="1" />
            {[0, 6, 12, 18].map(h => (
              <text key={h} x={X0 + h * (BW + GAP) + BW / 2} y={BASE + 12} textAnchor="middle" fontFamily={T.mono} fontSize="8" fill={T.textDim}>{hh(h)}</text>
            ))}
            <text x={width - X0} y={BASE + 12} textAnchor="end" fontFamily={T.mono} fontSize="8" fill={T.textDim}>UTC</text>
            {/* quiet-window bracket (may wrap around midnight → two segments) */}
            {(qStart + K <= 24
              ? [[qStart, qStart + K]]
              : [[qStart, 24], [0, (qStart + K) % 24]]
            ).map(([a, b], i) => (
              <line key={i} x1={X0 + a * (BW + GAP)} y1={BASE + 18} x2={X0 + b * (BW + GAP) - GAP} y2={BASE + 18} stroke={T.textDim} strokeWidth="1.5" strokeLinecap="round" />
            ))}
            <text x={X0 + ((qStart + K / 2) % 24) * (BW + GAP)} y={BASE + 28} textAnchor="middle" fontFamily={T.mono} fontSize="8" fill={T.textDim}>quietest {K}h</text>
          </svg>
          <div style={{ fontSize: 12.5, color: T.textMid, lineHeight: 1.6, marginTop: 10, borderTop: `1px solid ${T.borderLo}`, paddingTop: 10 }}>
            {strong
              ? <>{third ? "This wallet's quiet hours" : "Your quiet hours"} run <strong style={{ color: T.text }}>{hh(qStart)}–{hh(qEnd)} UTC</strong>. If that's {third ? "when its owner sleeps, an analyst would place them" : "when you sleep, an analyst would place you"} around <strong style={{ color: T.text }}>{tz} (±2)</strong> — block timestamps are public, and time-of-day is one of the oldest deanonymization signals. Based on the {total} most recent transactions{total < 12 ? " (small sample — rough read)" : ""}.</>
              : <>No strong daily rhythm across the {total} most recent transactions — {third ? "this wallet's timing gives" : "good: your timing gives"} an analyst less to work with. (Wallets with automated or randomized broadcast times blur this signal on purpose.)</>}
          </div>
          <div style={{ fontSize: 11, color: T.textDim, lineHeight: 1.55, marginTop: 8 }}>
            A hint, not proof: block timestamps record when a transaction <em>confirmed</em>, not when it was broadcast — a noisy proxy for local time. Independent research (<a href="https://www.dci.mit.edu/posts/coinjoin-timing-questions" target="_blank" rel="noopener noreferrer" style={{ color: T.textMid, textDecoration: "underline" }}>MIT DCI</a>) found timing alone often can't pin a timezone. Weigh it as one weak signal among many.
          </div>
        </>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   CLUSTER EXPOSURE — the common-input-ownership heuristic (CIOH), computed
   client-side. When one transaction spends coins sitting on several
   addresses, analysts assume a single owner signed them all — the workhorse
   heuristic of every chain-surveillance firm. We already fetch full input
   prevouts, so we can show the user the exact cluster an analyst would
   build around their address. Equal-output CoinJoins are excluded: their
   inputs deliberately do NOT imply one owner (analysts exclude them too).
───────────────────────────────────────────── */
function computeCluster(txs, address) {
  const links = new Map(); // other input addr -> spend count
  let spends = 0, cjExcluded = 0;
  const list = txs || [];
  list.forEach(tx => {
    const vin = tx.vin || [], vout = tx.vout || [];
    const inAddrs = vin.map(v => v.prevout?.scriptpubkey_address).filter(Boolean);
    if (!inAddrs.includes(address)) return; // only spends FROM this address link anything
    if (isCoinJoinShape(vin, vout)) { cjExcluded++; return; }
    spends++;
    new Set(inAddrs).forEach(a => { if (a !== address) links.set(a, (links.get(a) || 0) + 1); });
  });
  const linked = [...links.entries()].map(([addr, count]) => ({ addr, count })).sort((a, b) => b.count - a.count);
  return { linked, spends, cjExcluded, sample: list.length };
}

// INFERRED neighbours — the addresses this one has TRANSACTED with (paid to /
// received from), as opposed to the PROVEN same-owner cluster above. The tx is
// on-chain fact, but the counterparty relationship is softer: a "destination"
// can be your own change, and a counterparty address rarely maps 1:1 to a real
// entity — so these render as INFERRED (dashed) links, never as proof. CoinJoins
// excluded (ambiguous), the proven-cluster members excluded (they're drawn as the
// inner ring), change-back-to-an-input excluded (not a counterparty).
function computeCounterparties(txs, address, exclude) {
  const skip = exclude instanceof Set ? exclude : new Set(exclude || []);
  const cp = new Map(); // addr -> { paid, received }
  (txs || []).forEach(tx => {
    const vin = tx.vin || [], vout = tx.vout || [];
    if (isCoinJoinShape(vin, vout)) return;
    const inAddrs = vin.map(v => v.prevout?.scriptpubkey_address).filter(Boolean);
    const inSet = new Set(inAddrs);
    if (inSet.has(address)) {
      vout.forEach(o => { const a = o.scriptpubkey_address; if (a && a !== address && !inSet.has(a)) { const e = cp.get(a) || { paid: 0, received: 0 }; e.paid++; cp.set(a, e); } });
    } else if (vout.some(o => o.scriptpubkey_address === address)) {
      inSet.forEach(a => { if (a && a !== address) { const e = cp.get(a) || { paid: 0, received: 0 }; e.received++; cp.set(a, e); } });
    }
  });
  return [...cp.entries()]
    .filter(([a]) => a !== address && !skip.has(a))
    .map(([addr, e]) => ({ addr, count: e.paid + e.received, kind: e.paid && e.received ? "both" : e.paid ? "paid" : "received" }))
    .sort((a, b) => b.count - a.count);
}

/* What an observer can already tie to this address, drawn from the transactions
   already loaded. Reuses the cluster, change, round, and coinjoin checks.
   Does not fetch anything and does not move the score. */
const LINK_DRAW_CAP = 7;
const LINK_COLOR = {
  "common-input": T.red,
  "address reuse": T.btc,
  "change detection": T.amber,
  "round amount": T.ln,
};
function linkShort(s, head, tail) {
  if (!s) return "";
  if (s === "DEMO" || s === "DEMO_A") return "this address";
  if (s.length <= head + tail + 1) return s;
  return s.slice(0, head) + "…" + s.slice(-tail);
}
function linkSat(v) {
  if (v == null) return "";
  if (v >= 1e8) return "₿" + (v / 1e8).toFixed(2);
  if (v >= 1e6) return (v / 1e6).toFixed(2) + "M sats";
  return v.toLocaleString() + " sats";
}
function buildLinkageMap(txs, address, opts) {
  const opt = opts || {};
  const list = txs || [];
  const items = [];
  const seen = new Set();
  const push = (item) => {
    if (!item || !item.id || seen.has(item.id)) return;
    seen.add(item.id);
    items.push(item);
  };
  const cluster = computeCluster(list, address);
  const txFor = new Map();
  list.forEach(tx => {
    const vin = tx.vin || [], vout = tx.vout || [];
    if (isCoinJoinShape(vin, vout)) return;
    const inAddrs = vin.map(v => v.prevout && v.prevout.scriptpubkey_address).filter(Boolean);
    if (!inAddrs.includes(address)) return;
    inAddrs.forEach(a => { if (a !== address && !txFor.has(a)) txFor.set(a, tx.txid); });
  });
  cluster.linked.forEach(n => {
    push({
      id: "addr:" + n.addr,
      kind: "address",
      heuristic: "common-input",
      label: linkShort(n.addr, 8, 4),
      full: n.addr,
      detail: "Spent together" + (n.count > 1 ? " " + n.count + " times" : "") + ". An observer treats this as the same wallet.",
    });
  });
  [...new Set(cluster.linked.map(n => txFor.get(n.addr)).filter(Boolean))].forEach(txid => {
    push({
      id: "tx:" + txid,
      kind: "tx",
      heuristic: "common-input",
      label: linkShort(txid, 8, 4),
      full: txid,
      detail: "This transaction is the link. It spends your address together with the others.",
    });
  });
  const rc = opt.receiveCount != null ? opt.receiveCount : null;
  if (rc != null && rc >= 2) {
    push({
      id: "reuse:self",
      kind: "address",
      heuristic: "address reuse",
      label: rc + " receives",
      full: address || "",
      detail: "This address received " + rc + " times. Every payment on it is one trail.",
    });
  }
  list.forEach(tx => {
    const vin = tx.vin || [], vout = tx.vout || [];
    if (isCoinJoinShape(vin, vout)) return;
    const inAddrs = vin.map(v => v.prevout && v.prevout.scriptpubkey_address).filter(Boolean);
    const inSet = new Set(inAddrs);
    const youIn = inAddrs.includes(address);
    vout.forEach((o, i) => {
      if (!o.scriptpubkey_address || !inSet.has(o.scriptpubkey_address)) return;
      if (!youIn && o.scriptpubkey_address !== address) return;
      push({
        id: "reuse:" + (tx.txid || "tx") + ":" + i,
        kind: "address",
        heuristic: "address reuse",
        label: linkShort(o.scriptpubkey_address, 8, 4),
        full: o.scriptpubkey_address,
        detail: "An output pays an address that also spent here, so the balance is visible.",
      });
    });
    const g = guessChange(tx);
    if (g && g.confidence !== "Low") {
      const o = vout[g.index] || {};
      const why = g.confidence === "High"
        ? "It pays an address that already spent in this transaction."
        : "Only one output matches the input address type, so that one is the change.";
      push({
        id: "chg:" + (tx.txid || "tx") + ":" + g.index,
        kind: "change",
        heuristic: "change detection",
        label: "change " + (o.value != null ? linkSat(o.value) : ""),
        full: (tx.txid || "") + "#" + g.index,
        detail: why,
      });
    }
    vout.forEach((o, i) => {
      if (o.scriptpubkey_type === "op_return" || !isRoundSat(o.value)) return;
      push({
        id: "round:" + (tx.txid || "tx") + ":" + i,
        kind: "output",
        heuristic: "round amount",
        label: linkSat(o.value),
        full: String(o.value),
        detail: "A round amount. Observers read that as an exchange withdrawal.",
      });
    });
  });
  const picked = [];
  const have = new Set();
  const take = (pred, n) => {
    let k = 0;
    for (const it of items) {
      if (k >= n) break;
      if (have.has(it.id) || !pred(it)) continue;
      have.add(it.id);
      picked.push(it);
      k++;
    }
  };
  take(i => i.kind === "address" && i.heuristic === "common-input", 4);
  take(i => i.kind === "tx", 1);
  take(i => i.heuristic === "address reuse", 1);
  take(i => i.heuristic === "change detection", 1);
  take(i => i.heuristic === "round amount", 1);
  for (const it of items) { if (!have.has(it.id)) { have.add(it.id); picked.push(it); } }
  const shown = picked.slice(0, LINK_DRAW_CAP);
  const hidden = picked.length - shown.length;
  return {
    items: shown,
    total: picked.length,
    hidden,
    more: hidden > 0 ? "+" + hidden + " more" : "",
    cluster: cluster.linked.length,
  };
}

function LinkageMap({ map }) {
  const items = (map && map.items) || [];
  const [sel, setSel] = useState(null);
  if (!map || !map.total) {
    return (
      <p style={{ fontSize: 14, color: T.textMid, lineHeight: 1.5, margin: "12px 0 0" }}>
        From the transactions loaded, an observer cannot tie another address, transaction, or change output to this one.
      </p>
    );
  }
  const rows = items.length + (map.hidden > 0 ? 1 : 0);
  const rowH = 34;
  const W = 360;
  const H = rows * rowH + 10;
  const yOf = i => 6 + i * rowH + rowH / 2;
  const hubY = H / 2;
  return (
    <figure style={{ margin: "14px 0 0" }}>
      <figcaption style={{ fontSize: 14, fontWeight: 700, color: T.text, lineHeight: 1.4 }}>What an observer can already link</figcaption>
      <p style={{ fontSize: 13, color: T.textMid, lineHeight: 1.45, margin: "4px 0 8px" }}>You are the hub. Each line is a link the chain already gives an observer.</p>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-hidden="true" focusable="false" style={{ display: "block", width: "100%", maxWidth: 560, height: "auto" }}>
        <line x1="60" y1={hubY} x2="74" y2={hubY} stroke={T.cyan} strokeWidth="2" />
        {rows > 1 && <line x1="74" y1={yOf(0)} x2="74" y2={yOf(rows - 1)} stroke={T.border} strokeWidth="1.5" />}
        <circle cx="34" cy={hubY} r="22" fill={T.bg} stroke={T.cyan} strokeWidth="2" />
        <text x="34" y={hubY + 4} textAnchor="middle" fontFamily={T.sans} fontSize="13" fontWeight="700" fill={T.cyan}>You</text>
        {items.map((item, i) => {
          const y = yOf(i);
          const col = LINK_COLOR[item.heuristic] || T.text;
          const on = sel === item.id;
          return (
            <g key={item.id}>
              <line x1="74" y1={y} x2="90" y2={y} stroke={col} strokeWidth={on ? 3 : 2} />
              <text x="96" y={y + 4} fontFamily={T.mono} fontSize="12" fill={col}>{item.heuristic}</text>
              <text x="228" y={y + 4} fontFamily={T.mono} fontSize="12" fill={on ? T.cyan : T.text}>{item.label}</text>
            </g>
          );
        })}
        {map.hidden > 0 && (
          <g>
            <line x1="74" y1={yOf(items.length)} x2="90" y2={yOf(items.length)} stroke={T.textDim} strokeWidth="1.5" strokeDasharray="3 3" />
            <text x="96" y={yOf(items.length) + 4} fontFamily={T.mono} fontSize="12" fill={T.textMid}>{map.more}</text>
          </g>
        )}
      </svg>
      <ul aria-label="Links an observer can already make" style={{ listStyle: "none", margin: "8px 0 0", padding: 0, display: "flex", flexDirection: "column", gap: 6 }}>
        {items.map(item => {
          const on = sel === item.id;
          return (
            <li key={item.id}>
              <button type="button" aria-pressed={on} onClick={() => setSel(item.id)} onFocus={() => setSel(item.id)}
                style={{ display: "block", width: "100%", textAlign: "left", background: on ? T.cyanLo : T.surface, border: `1px solid ${on ? T.cyan : T.border}`, borderLeft: `3px solid ${LINK_COLOR[item.heuristic] || T.cyan}`, borderRadius: 10, padding: "7px 10px", cursor: "pointer", fontFamily: T.sans }}>
                <span style={{ fontFamily: T.mono, fontSize: 12, color: T.text }}>{item.heuristic}</span>
                <span style={{ display: "block", fontSize: 14, color: T.text, lineHeight: 1.45, marginTop: 2 }}>{item.label}. {item.detail}</span>
              </button>
            </li>
          );
        })}
        {map.hidden > 0 && <li style={{ fontSize: 14, color: T.textMid, lineHeight: 1.4, paddingLeft: 2 }}>{map.more}</li>}
      </ul>
    </figure>
  );
}

/* ─────────────────────────────────────────────
   ADDRESS-POISONING DETECTOR — scammers vanity-generate an address matching
   the first & last characters of yours, plant it in your history with a tiny
   transfer, and wait for you to copy the wrong one. Matching 4 chars after
   the prefix AND the last 4 (bech32 charset = 32 symbols) has a ~32⁻⁸ random
   collision rate — essentially zero false positives, loud alarm on real bait.
   Deliberately NOT scored: being targeted doesn't make a wallet more
   traceable. It's a safety alert with its own job.
───────────────────────────────────────────── */
function isLookalikeAddress(a, b) {
  if (!a || !b || a === b) return false;
  const pfx = s => (s.startsWith("bc1q") || s.startsWith("bc1p")) ? 4 : (s[0] === "1" || s[0] === "3") ? 1 : 0;
  const pa = pfx(a), pb = pfx(b);
  if (!pa || !pb || a.slice(0, pa) !== b.slice(0, pb)) return false; // same address type only
  if (a.length < pa + 8 || b.length < pb + 8) return false;
  return a.slice(pa, pa + 4) === b.slice(pb, pb + 4) && a.slice(-4) === b.slice(-4);
}

function computePoisoning(txs, address) {
  const hits = new Map(); // lookalike addr -> first tx it appeared in
  (txs || []).forEach(tx => {
    const seen = new Set();
    (tx.vout || []).forEach(o => { if (o.scriptpubkey_address) seen.add(o.scriptpubkey_address); });
    (tx.vin || []).forEach(v => { if (v.prevout?.scriptpubkey_address) seen.add(v.prevout.scriptpubkey_address); });
    seen.forEach(a => {
      if (!hits.has(a) && isLookalikeAddress(address, a)) hits.set(a, { addr: a, txid: tx.txid });
    });
  });
  return { lookalikes: [...hits.values()], sample: (txs || []).length };
}

function ClusterMap({ txs, address, isMobile, entity, onScan }) {
  const third = !!entity;
  const [showAll, setShowAll] = useState(false);
  const { linked, spends, cjExcluded, sample } = computeCluster(txs, address);
  const isDemo = address === "DEMO" || address === "DEMO_A";
  const trunc = a => a.length > 17 ? `${a.slice(0, 10)}…${a.slice(-5)}` : a;
  const you = third ? "this wallet" : "your wallet";
  // Two concentric rings around the subject: PROVEN same-owner cluster (inner,
  // solid) + INFERRED counterparties this address transacted with (outer, dashed).
  const clusterSet = new Set(linked.map(n => n.addr));
  const counterparties = computeCounterparties(txs, address, clusterSet);
  const hasGraph = linked.length > 0 || counterparties.length > 0;
  const innerShown = linked.slice(0, 8), outerShown = counterparties.slice(0, 10);
  const W = 480, H = 424, CX = 240, CY = 206, RIN = 88, ROUT = 164;
  const ringPos = (i, n, R) => { const a = (i / Math.max(n, 1)) * Math.PI * 2 - Math.PI / 2; return { x: CX + R * Math.cos(a), y: CY + R * Math.sin(a) }; };
  const listRows = showAll ? linked : linked.slice(0, 4);
  const cpRows = showAll ? counterparties : counterparties.slice(0, 4);
  return (
    <div style={{ background: T.card, border: `1px solid ${linked.length ? T.red + "33" : T.border}`, borderRadius: 16, padding: isMobile ? "16px 18px" : "20px 24px" }}>
      <div style={{ fontFamily: T.mono, fontSize: 9, color: linked.length ? T.red : T.cyan, letterSpacing: 2, marginBottom: 8 }}>CONNECTIONS</div>
      <div style={{ fontFamily: T.serif, fontSize: isMobile ? 19 : 22, color: T.text, fontWeight: 400, marginBottom: 8 }}>
        {hasGraph ? `The neighborhood the chain draws around ${you}` : "The neighborhood the chain would draw around this address"}
      </div>
      <div style={{ fontSize: 13, color: T.textMid, lineHeight: 1.65 }}>
        {linked.length > 0
          ? <><strong style={{ color: T.red }}>{linked.length} address{linked.length !== 1 ? "es" : ""}</strong> are <strong style={{ color: T.text }}>provably {you}</strong> via the common-input heuristic (spent together — solid links). </>
          : "No co-spend proves other addresses are the same owner. "}
        {counterparties.length > 0 && <><strong style={{ color: T.amber }}>{counterparties.length}</strong> more are <strong style={{ color: T.text }}>inferred counterparties</strong> — addresses {you} paid or was paid by (dashed; a destination can be your own change, so these are likely, not proven). </>}
        Computed in your browser from the transactions above.
      </div>
      {hasGraph && (
        <>
          <EpistemicLegend kinds={["proven", "inferred"]} colors={{ proven: T.red, inferred: T.amber }} />
          <svg viewBox={`0 0 ${W} ${H}`} role="img"
            aria-label={`Connections graph: ${linked.length} proven same-owner address${linked.length !== 1 ? "es" : ""} and ${counterparties.length} inferred counterpart${counterparties.length !== 1 ? "ies" : "y"} around the scanned address.`}
            style={{ display: "block", width: "100%", maxWidth: 460, height: "auto", margin: "14px auto 0", overflow: "visible" }}>
            {/* outer ring = INFERRED counterparties (dashed amber) */}
            {outerShown.map((n, i) => {
              const p = ringPos(i, outerShown.length, ROUT);
              return (
                <g key={"cp" + n.addr} style={{ animation: `clusterIn .5s ease ${0.25 + i * 0.05}s both` }}>
                  <line x1={CX} y1={CY} x2={p.x} y2={p.y} stroke={T.amber} strokeOpacity="0.4" strokeWidth="1" strokeDasharray="5 3" strokeLinecap="round" />
                  <circle cx={p.x} cy={p.y} r="5" fill={T.bg} stroke={T.amber} strokeWidth="1.4" strokeDasharray="2.4 1.6">
                    <title>{n.addr} — {n.kind === "both" ? "paid and received" : n.kind === "paid" ? "paid" : "received from"}, {n.count}×  (inferred counterparty)</title>
                  </circle>
                  <text x={p.x} y={p.y + (p.y >= CY ? 15 : -9)} textAnchor="middle" fontFamily={T.mono} fontSize="7.5" fill={T.textDim}>{trunc(n.addr)}</text>
                </g>
              );
            })}
            {/* inner ring = PROVEN cluster (solid red) */}
            {innerShown.map((n, i) => {
              const p = ringPos(i, innerShown.length, RIN);
              return (
                <g key={n.addr} style={{ animation: `clusterIn .5s ease ${0.15 + i * 0.07}s both` }}>
                  <line x1={CX} y1={CY} x2={p.x} y2={p.y} stroke={T.red} strokeOpacity="0.55" strokeWidth={1.2 + Math.min(n.count, 5) * 0.4} strokeLinecap="round" />
                  <circle cx={p.x} cy={p.y} r="11" fill={T.red} opacity="0.14" />
                  <circle cx={p.x} cy={p.y} r="6" fill={T.bg} stroke={T.red} strokeWidth="1.6">
                    <title>{n.addr} — co-spent with the scanned address in {n.count} transaction{n.count !== 1 ? "s" : ""} (proven common-input)</title>
                  </circle>
                  <text x={p.x} y={p.y + (p.y >= CY ? 18 : -11)} textAnchor="middle" fontFamily={T.mono} fontSize="8" fill={T.textMid}>{trunc(n.addr)}</text>
                </g>
              );
            })}
            {(linked.length > innerShown.length || counterparties.length > outerShown.length) && (
              <text x={CX} y={H - 2} textAnchor="middle" fontFamily={T.mono} fontSize="9" fill={T.textDim}>
                {[linked.length > innerShown.length ? `+${linked.length - innerShown.length} proven` : null, counterparties.length > outerShown.length ? `+${counterparties.length - outerShown.length} inferred` : null].filter(Boolean).join(" · ")} not drawn
              </text>
            )}
            <circle cx={CX} cy={CY} r="30" fill={T.cyan} style={{ animation: "haloPulse 4s ease-in-out infinite" }} />
            <circle cx={CX} cy={CY} r="21" fill={T.bg} stroke={T.cyan} strokeWidth="2" />
            <text x={CX} y={CY + 3.5} textAnchor="middle" fontFamily={T.mono} fontSize="9" fill={T.cyan} letterSpacing="1">{third ? "WALLET" : "YOU"}</text>
          </svg>
          {linked.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 14 }}>
              <div style={{ fontFamily: T.mono, fontSize: 9, color: T.red, letterSpacing: 1.5 }}>⛓ PROVEN — SAME OWNER</div>
              {listRows.map(n => {
                const scannable = !!onScan && !isDemo && isValidBitcoinAddress(n.addr);
                return (
                  <div key={n.addr} style={{ display: "flex", alignItems: "center", gap: 10, background: T.surface, border: `1px solid ${T.borderLo}`, borderRadius: 10, padding: "8px 12px" }}>
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: T.red, flexShrink: 0 }} />
                    <span style={{ fontFamily: T.mono, fontSize: 12, color: T.text, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis" }}>{trunc(n.addr)}</span>
                    <span style={{ fontFamily: T.mono, fontSize: 10, color: T.textDim, flexShrink: 0 }}>co-spent ×{n.count}</span>
                    {scannable && <AuditButton onClick={() => onScan(n.addr)} ariaLabel={"Audit linked address " + n.addr} style={{ marginLeft: "auto" }} />}
                  </div>
                );
              })}
            </div>
          )}
          {counterparties.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 12 }}>
              <div style={{ fontFamily: T.mono, fontSize: 9, color: T.amber, letterSpacing: 1.5 }}>≈ INFERRED — COUNTERPARTIES</div>
              {cpRows.map(n => {
                const scannable = !!onScan && !isDemo && isValidBitcoinAddress(n.addr);
                return (
                  <div key={"cp" + n.addr} style={{ display: "flex", alignItems: "center", gap: 10, background: T.surface, border: `1px solid ${T.borderLo}`, borderRadius: 10, padding: "8px 12px" }}>
                    <span style={{ width: 7, height: 7, borderRadius: "50%", border: `1.5px solid ${T.amber}`, flexShrink: 0 }} />
                    <span style={{ fontFamily: T.mono, fontSize: 12, color: T.text, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis" }}>{trunc(n.addr)}</span>
                    <span style={{ fontFamily: T.mono, fontSize: 10, color: T.textDim, flexShrink: 0 }}>{n.kind === "both" ? "paid + received" : n.kind} ×{n.count}</span>
                    {scannable && <AuditButton onClick={() => onScan(n.addr)} color={T.amber} ariaLabel={"Audit counterparty " + n.addr} style={{ marginLeft: "auto" }} />}
                  </div>
                );
              })}
            </div>
          )}
          {(linked.length > 4 || counterparties.length > 4) && (
            <button onClick={() => setShowAll(s => !s)}
              style={{ background: "none", border: "none", fontFamily: T.mono, fontSize: 11, color: T.cyan, cursor: "pointer", padding: "8px 0 0", textAlign: "left" }}>
              {showAll ? "▲ show fewer" : `▼ show all (${linked.length} proven · ${counterparties.length} inferred)`}
            </button>
          )}
        </>
      )}
      {!hasGraph && (
        <div style={{ marginTop: 12, background: T.green + "12", border: `1px solid ${T.green}45`, borderRadius: 10, padding: "10px 14px", fontSize: 13, color: T.textMid, lineHeight: 1.6 }}>
          <span style={{ color: T.green, fontFamily: T.mono }}>✓</span>{" "}
          {spends === 0
            ? `None of the ${sample} most recent transactions spend from this address together with others, and no counterparties stand out — the graph has nothing to draw here.`
            : `No co-spend links across ${spends} spend${spends !== 1 ? "s" : ""} — each one used only this address, so the workhorse heuristic comes up empty.`}
        </div>
      )}
      <div style={{ fontSize: 11.5, color: T.textDim, lineHeight: 1.6, marginTop: 12, borderTop: `1px solid ${T.borderLo}`, paddingTop: 10 }}>
        A heuristic, not proof — PayJoin and exchange batching break the one-owner assumption{cjExcluded > 0 ? `, and ${cjExcluded} CoinJoin-style spend${cjExcluded !== 1 ? "s were" : " was"} excluded here for exactly that reason` : ""}. Read from the {sample} most recent transactions.
      </div>
    </div>
  );
}

function ExposureFlow({ txs, isMobile, onFix, entity, address, onScan }) {
  const list = (txs || []).slice(0, 8);
  const isRound = v => isRoundSat(v);            // canonical shared predicate
  // A dust "beacon" is a tiny *spendable* output planted to track you. An
  // OP_RETURN is a provably-unspendable data carrier (value 0) — NOT dust, and
  // flagging it as a tracking beacon (red, +leaky) is simply wrong. Guard both.
  const isOpReturn = o => o.scriptpubkey_type === "op_return";
  const isDust = o => !isOpReturn(o) && isDustSat(o.value);
  const KIND = {
    dust:  { color: T.red,    label: "Dust (tracking beacon)" },
    reuse: { color: T.red,    label: "Change → address reuse" },
    mix:   { color: T.green,  label: "Mixed (CoinJoin)" },
    round: { color: T.btc,    label: "Round amount (exchange tell)" },
    spend: { color: T.cyan,   label: "Ordinary spend" },
    data:  { color: T.textDim, label: "Data (OP_RETURN)" },
  };
  if (!list.length) return (
    <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: 28, textAlign: "center", color: T.textMid, fontSize: 14 }}>
      No transactions to map — this address has no spending history to trace.
    </div>
  );
  // Aggregate forensic readout across the mapped transactions.
  const stat = { consolidation: 0, coinjoin: 0, reuse: 0, dust: 0, round: 0, linked: 0, leaky: 0 };
  list.forEach(tx => {
    const vin = tx.vin || [], vout = tx.vout || [];
    const inAddrs = new Set(vin.map(v => v.prevout?.scriptpubkey_address).filter(Boolean));
    const cj = isCoinJoinShape(vin, vout);
    const cons = vin.length >= 4 && vout.length <= 2;
    const dust = vout.some(isDust);
    const reuse = vout.some(o => o.scriptpubkey_address && inAddrs.has(o.scriptpubkey_address));
    const round = vout.some(o => isRound(o.value));
    if (cj) stat.coinjoin++;
    if (cons) { stat.consolidation++; stat.linked += vin.length; }
    if (dust) stat.dust++;
    if (reuse) stat.reuse++;
    if (round && !cj) stat.round++;
    if (cons || dust || reuse || (round && !cj)) stat.leaky++;
  });
  const verdict = stat.leaky === 0
    ? "Clean pass — nothing in these transactions obviously links your coins or identifies you."
    : `An analyst can tie your activity together from ${stat.leaky} of ${list.length} transaction${list.length !== 1 ? "s" : ""} here.`;
  const findings = [];
  if (stat.consolidation) findings.push({ ok: false, t: `${stat.linked}+ of your addresses provably share one owner (consolidation)` });
  if (stat.round) findings.push({ ok: false, t: `${stat.round} withdrawal${stat.round !== 1 ? "s" : ""} fingerprint a KYC exchange (round amounts)` });
  if (stat.reuse) findings.push({ ok: false, t: `${stat.reuse} change output${stat.reuse !== 1 ? "s" : ""} returned to an address you'd reused` });
  if (stat.dust) findings.push({ ok: false, t: `${stat.dust} transaction${stat.dust !== 1 ? "s" : ""} carry dust tracking beacons` });
  if (stat.coinjoin) findings.push({ ok: true, t: `${stat.coinjoin} CoinJoin${stat.coinjoin !== 1 ? "s" : ""} break${stat.coinjoin === 1 ? "s" : ""} the trail — your defence here` });
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: isMobile ? "16px 18px" : "20px 24px" }}>
        <div style={{ fontFamily: T.mono, fontSize: 9, color: T.cyan, letterSpacing: 2, marginBottom: 8 }}>EXPOSURE MAP</div>
        <div style={{ fontFamily: T.serif, fontSize: isMobile ? 19 : 22, color: T.text, fontWeight: 400, marginBottom: 8 }}>What a blockchain analyst sees</div>
        <div style={{ fontSize: 13, color: T.textMid, lineHeight: 1.65, marginBottom: 14 }}>
          Every transaction is public and permanent. Your coins flow left → right: inputs into each transaction, then out to their destinations. Each output is colored by what it leaks — this is the exact view surveillance firms build from the chain.
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          {[KIND.spend, KIND.mix, KIND.round, KIND.reuse, KIND.dust, KIND.data].map(k => (
            <span key={k.label} style={{ display: "inline-flex", alignItems: "center", gap: 5, fontFamily: T.mono, fontSize: 9, color: T.textMid }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: k.color, flexShrink: 0 }} />{k.label}
            </span>
          ))}
        </div>
      </div>
      <div style={{ background: stat.leaky ? T.red + "10" : T.green + "12", border: `1px solid ${stat.leaky ? T.red + "40" : T.green + "45"}`, borderRadius: 16, padding: isMobile ? "16px 18px" : "18px 22px" }}>
        <div style={{ fontFamily: T.mono, fontSize: 9, color: stat.leaky ? T.red : T.green, letterSpacing: 2, marginBottom: 8 }}>FORENSIC READOUT</div>
        <div style={{ fontSize: isMobile ? 14 : 15, color: T.text, lineHeight: 1.6, marginBottom: findings.length ? 12 : 0, fontWeight: 500 }}>{verdict}</div>
        {findings.length > 0 && (
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 7, padding: 0, margin: 0 }}>
            {findings.map((f, i) => (
              <li key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 13, color: T.textMid, lineHeight: 1.5 }}>
                <span style={{ color: f.ok ? T.green : T.red, flexShrink: 0, marginTop: 1, fontFamily: T.mono }}>{f.ok ? "✓" : "→"}</span>
                {f.t}
              </li>
            ))}
          </ul>
        )}
        {stat.leaky > 0 && onFix && (
          <button onClick={onFix} style={{ marginTop: 14, background: "transparent", border: `1px solid ${T.cyan}55`, borderRadius: 10, padding: "9px 16px", color: T.cyan, fontFamily: T.sans, fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all .15s" }}
            onMouseOver={e => { e.currentTarget.style.background = T.cyan + "14"; }}
            onMouseOut={e => { e.currentTarget.style.background = "transparent"; }}>
            See how to fix these →
          </button>
        )}
      </div>
      <ClusterMap txs={txs} address={address} isMobile={isMobile} entity={entity} onScan={onScan} />
      <ActivityClock txs={txs} isMobile={isMobile} entity={entity} />
      {list.map((tx, ti) => {
        const vin = tx.vin || [], vout = tx.vout || [];
        const inputAddrs = new Set(vin.map(v => v.prevout?.scriptpubkey_address).filter(Boolean));
        const outs = vout.slice(0, 8);
        const extra = vout.length - outs.length;
        const maxOut = Math.max(...vout.map(o => o.value || 0), 1);
        const inCount = vin.length, outCount = vout.length;
        const denom = {}; vout.forEach(o => { denom[o.value] = (denom[o.value] || 0) + 1; });
        const coinjoin = isCoinJoinShape(vin, vout);
        const consolidation = inCount >= 4 && outCount <= 2;
        const hasDust = vout.some(isDust);
        const hasReuse = vout.some(o => o.scriptpubkey_address && inputAddrs.has(o.scriptpubkey_address));
        const hasRound = vout.some(o => isRound(o.value));
        const classify = o => {
          if (isOpReturn(o)) return KIND.data;
          if (isDust(o)) return KIND.dust;
          if (o.scriptpubkey_address && inputAddrs.has(o.scriptpubkey_address)) return KIND.reuse;
          if (coinjoin && denom[o.value] >= 3) return KIND.mix;
          if (isRound(o.value)) return KIND.round;
          return KIND.spend;
        };
        const flags = [];
        if (coinjoin) flags.push({ l: "CoinJoin", c: T.green });
        if (consolidation) flags.push({ l: "Consolidation", c: T.red });
        if (hasReuse) flags.push({ l: "Change reuse", c: T.red });
        if (hasRound && !coinjoin) flags.push({ l: "Round amount", c: T.btc });
        if (hasDust) flags.push({ l: "Dust", c: T.red });
        if (!flags.length) flags.push({ l: "No obvious leak", c: T.green });
        const rowH = 22, top = 10, H = Math.max(72, outs.length * rowH + top * 2);
        const hubX = 118, hubY = H / 2, outX = 196, barMax = isMobile ? 78 : 100;
        const worst = flags.some(f => f.c === T.red) ? T.red : coinjoin ? T.green : hasRound ? T.btc : T.cyan;
        const age = tx.status?.block_time ? Math.floor((Date.now() / 1000 - tx.status.block_time) / 86400) : null;
        const explain = coinjoin ? "Joined a set of equal-value outputs — a CoinJoin that breaks the trail between your coins."
          : consolidation ? `Merged ${inCount} separate inputs into one output — those coins are now provably the same owner.`
          : hasReuse ? "Change returned to an address you'd already used — this links the spend back to your history."
          : hasDust ? "Contains a dust output — a tiny ‘beacon’ analysts plant to track where your coins go next."
          : hasRound ? "A round-number output — the classic fingerprint of a withdrawal straight from a KYC exchange."
          : "No obvious linkage leak here — the inputs and outputs don't tie back to your other coins.";
        return (
          <div key={tx.txid || ti} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: isMobile ? "14px 14px" : "16px 20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
              <span style={{ fontFamily: T.mono, fontSize: 10, color: T.textDim }}>{fmt.txid(tx.txid)}</span>
              {age != null && <span style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim }}>· {age === 0 ? "today" : age + "d ago"}</span>}
              <span style={{ marginLeft: "auto", display: "flex", gap: 5, flexWrap: "wrap" }}>{flags.map((f, fi) => <Tag key={fi} label={f.l} color={f.c} size={9} />)}</span>
            </div>
            <svg viewBox={`0 0 ${outX + barMax + 92} ${H}`} style={{ display: "block", width: "100%", maxWidth: outX + barMax + 92, height: "auto", overflow: "visible" }} role="img" aria-label={`Transaction with ${inCount} input${inCount !== 1 ? "s" : ""} and ${outCount} output${outCount !== 1 ? "s" : ""}`}>
              <rect x="6" y={hubY - 18} width="46" height="36" rx="8" fill={T.cardAlt} stroke={T.border} />
              <text x="29" y={hubY - 1} textAnchor="middle" fontFamily={T.mono} fontSize="12" fill={T.text} fontWeight="700">{inCount}</text>
              <text x="29" y={hubY + 11} textAnchor="middle" fontFamily={T.mono} fontSize="7" fill={T.textDim} letterSpacing="1">{inCount === 1 ? "INPUT" : "INPUTS"}</text>
              <path d={`M52 ${hubY} C85 ${hubY} 85 ${hubY} ${hubX} ${hubY}`} stroke={T.border} strokeWidth="2" fill="none" />
              <circle cx={hubX} cy={hubY} r="5.5" fill={worst} style={{ filter: `drop-shadow(0 0 5px ${worst})` }} />
              {outs.map((o, oi) => {
                const k = classify(o), y = top + oi * rowH + 6, w = Math.max(7, (o.value / maxOut) * barMax);
                return (
                  <g key={oi}>
                    <path d={`M${hubX + 5} ${hubY} C${(hubX + outX) / 2} ${hubY} ${(hubX + outX) / 2} ${y + 5} ${outX} ${y + 5}`} stroke={k.color} strokeOpacity="0.45" strokeWidth="1.6" fill="none" />
                    <rect x={outX} y={y} width={w} height="10" rx="4" fill={k.color}><title>{fmt.btc(o.value)} — {k.label}</title></rect>
                    <text x={outX + w + 6} y={y + 9} fontFamily={T.mono} fontSize="9" fill={T.textDim}>{fmt.btc(o.value)}</text>
                  </g>
                );
              })}
              {extra > 0 && <text x={outX} y={top + outs.length * rowH + 9} fontFamily={T.mono} fontSize="9" fill={T.textDim}>+{extra} more output{extra !== 1 ? "s" : ""}</text>}
            </svg>
            <div style={{ fontSize: 12.5, color: T.textMid, lineHeight: 1.55, marginTop: 10, borderTop: `1px solid ${T.borderLo}`, paddingTop: 10 }}>{explain}</div>
          </div>
        );
      })}
    </div>
  );
}

