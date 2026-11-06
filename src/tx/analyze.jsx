
// CANONICAL amount predicates — ONE definition of "round" and "dust", shared by
// the score engines AND every forensic surface (Exposure Map, Inspector), so the
// same coin can never get contradictory verdicts. Round = a clean KYC-withdrawal
// amount: an exact 0.005-or-larger multiple of 0.005/0.01 BTC (the 500k/1M-sat
// rule — more defensible than "any 0.001-multiple"). Dust = below the canonical
// 546-sat relay dust limit.
const DUST_SAT = 546;
const isRoundSat = v => v >= 100000 && (v % 1000000 === 0 || v % 500000 === 0);
const isDustSat = v => v > 0 && v < DUST_SAT;

// -- transaction privacy analysis (mirrors the on-chain Exposure heuristics,
//    applied to one not-yet-broadcast transaction) --
const _txRound = v => isRoundSat(v);
const _txOpReturn = o => o.scriptpubkey_type === "op_return";
const _txDust = o => !_txOpReturn(o) && isDustSat(o.value);
function analyzeTx(tx) {
  const vin = tx.vin || [], vout = tx.vout || [];
  const inAddrs = new Set(vin.map(v => v.prevout && v.prevout.scriptpubkey_address).filter(Boolean));
  const coinjoin = isCoinJoinShape(vin, vout);
  const consolidation = vin.length >= 4 && vout.length <= 2;
  const dust = vout.some(_txDust);
  const reuse = vout.some(o => o.scriptpubkey_address && inAddrs.has(o.scriptpubkey_address));
  const round = vout.some(o => _txRound(o.value));
  const leaky = consolidation || dust || reuse || (round && !coinjoin);
  const findings = [];
  if (coinjoin) findings.push({ ok: true, t: "Looks like a CoinJoin (many inputs, repeated equal outputs) — this breaks the trail" });
  if (consolidation) findings.push({ ok: false, t: vin.length + " inputs merge into " + vout.length + " output" + (vout.length !== 1 ? "s" : "") + " — this provably links those coins' histories forever" });
  if (reuse) findings.push({ ok: false, t: "An output pays back to one of the input addresses — address reuse exposes your whole balance" });
  if (round && !coinjoin) findings.push({ ok: false, t: "A round-number output — the classic KYC-exchange withdrawal fingerprint" });
  if (dust) findings.push({ ok: false, t: "A sub-546-sat dust output — a tracking beacon if it's ever spent" });
  return { coinjoin, consolidation, reuse, dust, round, leaky, findings };
}
// Which output is likely change (for a not-yet-broadcast tx)
function guessChange(tx) {
  const vin = tx.vin || [], vout = tx.vout || [];
  const spend = vout.map((o, i) => ({ o, i })).filter(x => x.o.scriptpubkey_type !== "op_return");
  const inAddrs = new Set(vin.map(v => v.prevout && v.prevout.scriptpubkey_address).filter(Boolean));
  const reuseHit = spend.find(x => x.o.scriptpubkey_address && inAddrs.has(x.o.scriptpubkey_address));
  if (reuseHit) return { index: reuseHit.i, confidence: "High", reason: "it pays back to one of the input addresses" };
  const inTypes = new Set(vin.map(v => v.prevout && v.prevout.scriptpubkey_type).filter(Boolean));
  if (spend.length === 2 && inTypes.size === 1) {
    const only = [...inTypes][0];
    const match = spend.filter(x => x.o.scriptpubkey_type === only);
    if (match.length === 1) return { index: match[0].i, confidence: "Medium", reason: "its address type (" + only + ") matches the inputs, and the other output's doesn't" };
  }
  if (spend.length === 2) {
    const rnd = spend.filter(x => _txRound(x.o.value));
    if (rnd.length === 1) { const other = spend.find(x => !_txRound(x.o.value)); return { index: other.i, confidence: "Low", reason: "the other output is a round payment amount, so this non-round one is likely change" }; }
  }
  return null;
}
// Addresses this spend fuses into one provable identity (common-input heuristic)
function clusterUnification(tx) {
  const vin = tx.vin || [];
  const addrs = [...new Set(vin.map(v => v.prevout && v.prevout.scriptpubkey_address).filter(a => a && !a.startsWith("script:")))];
  const types = new Set(vin.map(v => v.prevout && v.prevout.scriptpubkey_type).filter(Boolean));
  return { addrs, distinctTypes: types.size, knownInputs: vin.filter(v => v.prevout).length, totalInputs: vin.length };
}
function estimateVsize(tx) {
  const vin = tx.vin || [], vout = tx.vout || [];
  let vb = 10.5 + vout.length * 33;
  for (const v of vin) { const t = v.prevout && v.prevout.scriptpubkey_type; vb += (t === "v0_p2wpkh" || t === "v1_p2tr") ? 68 : t === "p2sh" ? 91 : 148; }
  return Math.max(1, Math.round(vb));
}
function feeRate(tx) {
  if (tx.fee == null) return null;
  // A fetched confirmed tx carries its real weight → exact vsize, exact rate.
  const vs = tx.weight ? Math.ceil(tx.weight / 4) : estimateVsize(tx);
  return { sat: tx.fee, vsize: vs, rate: +(tx.fee / vs).toFixed(1), estimated: !tx.weight && !tx.txid };
}

/* Normalize an Esplora /tx/:txid response into the Inspector's internal tx
   shape. The fields are already near-identical by design (fetchAddress txs flow
   through the same analyzers); the two real differences: Esplora witness items
   are HEX STRINGS (the low-r fingerprint reads bytes — convert, or the check
   silently never fires), and a coinbase input has no prevout (mark partial). */
// "3 days later" phrasing for the outspends timeline (confirm time → spend time).
const _sinceDays = (t0, t1) => { const d = Math.floor(((t1 || 0) - (t0 || 0)) / 86400); return d < 1 ? "hours later" : d === 1 ? "1 day later" : d < 60 ? d + " days later" : Math.floor(d / 30) + " months later"; };

function normalizeEsploraTx(raw) {
  if (!raw || !Array.isArray(raw.vin) || !Array.isArray(raw.vout)) throw new Error("Unexpected transaction format from the explorer");
  let partial = false;
  const vin = raw.vin.map(v => {
    if (v.is_coinbase || !v.prevout) partial = true;
    return {
      txid: v.txid, vout: v.vout, sequence: v.sequence,
      prevout: v.prevout ? { value: v.prevout.value, scriptpubkey_type: v.prevout.scriptpubkey_type, scriptpubkey_address: v.prevout.scriptpubkey_address } : null,
      witness: Array.isArray(v.witness) ? v.witness.map(h => { try { return _hexToBytes(h); } catch { return new Uint8Array(0); } }) : undefined,
      scriptsigPushes: (v.scriptsig && !v.is_coinbase) ? (() => { try { return _scriptPushes(_hexToBytes(v.scriptsig)); } catch { return undefined; } })() : undefined,
      coinbase: !!v.is_coinbase,
    };
  });
  const vout = raw.vout.map(o => ({ value: o.value, scriptpubkey: o.scriptpubkey, scriptpubkey_type: o.scriptpubkey_type, scriptpubkey_address: o.scriptpubkey_address }));
  return {
    txid: raw.txid, vin, vout,
    fee: raw.fee != null ? raw.fee : null,
    partial,
    version: raw.version, locktime: raw.locktime,
    size: raw.size, weight: raw.weight,
    status: raw.status || null,
    confirmed: !!(raw.status && raw.status.confirmed),
  };
}

/* Fetch one confirmed transaction (+ what happened to its outputs since) from
   the user-selected explorer, via the no-log relay when enabled — the same
   honest-failure rule as fetchAddress: never silently fall back to a direct
   query when the relay is on. The outspends call is the confirmed-only intel:
   which outputs have been spent since, and by which transaction.

   Failures are four different events, and the message says which one:
     invalid  — txid shape rejected here, no request
     blocked  — relay refused a well-formed txid (403, or the legacy 404 JSON)
     unknown  — explorer 404 passed through (the tx really isn't indexed)
     upstream — 5xx, 429, timeout, or the connection failed */
const TX_LOOKUP_TIMEOUT_MS = 20000;
function txLookupTimeoutMs() {
  try {
    const override = typeof window !== "undefined" && window.__TX_LOOKUP_TIMEOUT_MS;
    if (Number.isFinite(override) && override > 0) return override;
  } catch { /* no window in a worker */ }
  return TX_LOOKUP_TIMEOUT_MS;
}
function blockedTxMessage(status) {
  return `The privacy relay blocked this lookup (HTTP ${status}) before any explorer saw it. The txid is validly formed, so this is a relay allowlist problem, not a missing transaction. Turn the relay off to ask the explorer directly — it will then see your IP — or retry after the relay is updated.`;
}
function upstreamTxMessage(status, viaRelay, reason) {
  const via = viaRelay ? " through the privacy relay" : "";
  let lead;
  if (status == null && reason === "timeout") lead = `The lookup timed out${via} before the explorer answered.`;
  else if (status == null) lead = `The lookup didn't reach the explorer${via} — the connection failed.`;
  else if (status === 429) lead = `The explorer rate-limited this lookup (HTTP 429)${via}.`;
  else if (status >= 500) lead = `The explorer failed this lookup (HTTP ${status})${via}.`;
  else lead = `The lookup failed (HTTP ${status})${via}.`;
  const tail = viaRelay
    ? " Try again in a moment, switch to the other explorer, or turn the relay off and query the explorer directly (it will then see your IP)."
    : " Try again in a moment, or switch to the other explorer.";
  return lead + tail;
}
function txLookupFailure(status, contentType, bodyText, viaRelay) {
  const ct = String(contentType || "").toLowerCase();
  const trimmed = String(bodyText || "").trim();
  let payload = null;
  if (ct.includes("json") || trimmed.startsWith("{")) {
    try { payload = JSON.parse(trimmed); } catch { payload = null; }
  }
  // The deployed relay answers a blocked path with 404 {"error":"not found"}.
  // The build in this repo answers 403 {"error":"path not allowed"}. An
  // explorer's missing-tx 404 is text/plain "Transaction not found" and must
  // not take this branch.
  const relayBlock = !!(payload && (payload.error === "path not allowed" || payload.error === "not found"));
  if (viaRelay && (status === 403 || (status === 404 && relayBlock))) {
    return { kind: "blocked", message: blockedTxMessage(status) };
  }
  if (status === 404) {
    return { kind: "unknown", message: "No explorer has a transaction with that txid. Check it for a typo, or wait if it has not been confirmed yet — unconfirmed transactions are not indexed." };
  }
  return { kind: "upstream", message: upstreamTxMessage(status, viaRelay) };
}
async function fetchTx(txid) {
  const id = (txid || "").trim();
  if (!/^[0-9a-fA-F]{64}$/.test(id)) {
    const err = new Error(txidShapeIssue(id) || "That isn't a valid transaction id. A txid is exactly 64 hexadecimal characters (0-9, a-f). This one was rejected before any request was sent.");
    err.kind = "invalid";
    throw err;
  }
  const exp = explorer();
  const viaRelay = relayOn();
  const base = viaRelay ? `${RELAY_URL}${exp.relayPath}` : exp.api;
  const safe = encodeURIComponent(id);
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), txLookupTimeoutMs());
  const outspendsP = fetch(`${base}/tx/${safe}/outspends`, { signal: ctrl.signal })
    .then(r => r.ok ? r.json() : null)
    .catch(() => null);
  try {
    let txRes;
    try {
      txRes = await fetch(`${base}/tx/${safe}`, { signal: ctrl.signal });
    } catch (e) {
      const timeout = !!(e && (e.name === "AbortError" || e.name === "TimeoutError"));
      const err = new Error(upstreamTxMessage(null, viaRelay, timeout ? "timeout" : "network"));
      err.kind = "upstream";
      throw err;
    }
    if (!txRes.ok) {
      const bodyText = await txRes.text().catch(() => "");
      ctrl.abort();
      const failure = txLookupFailure(txRes.status, txRes.headers.get("content-type"), bodyText, viaRelay);
      const err = new Error(failure.message);
      err.kind = failure.kind;
      err.status = txRes.status;
      throw err;
    }
    let tx;
    try { tx = await txRes.json(); }
    catch {
      const tail = viaRelay
        ? " Try again in a moment, switch to the other explorer, or turn the relay off and query the explorer directly (it will then see your IP)."
        : " Try again in a moment, or switch to the other explorer.";
      const err = new Error("The explorer returned a transaction the page couldn't read." + tail);
      err.kind = "upstream";
      throw err;
    }
    const norm = normalizeEsploraTx(tx);
    const outspends = await outspendsP;
    norm.outspends = Array.isArray(outspends) ? outspends : null;
    return norm;
  } finally {
    clearTimeout(timer);
  }
}

/* ─────────────────────────────────────────────
   TRANSACTION ENTROPY & LINKABILITY (Boltzmann / KYCP methodology, in pure JS)
   ───────────────────────────────────────────────
   The metric KYCP.org and OXT.me were built on — both offline since April 2024.
   An "interpretation" is a way to read the transaction as one or more independent
   sub-payments: a partition of the inputs and outputs into matched blocks (a
   bijection between input-blocks and output-blocks) where each block's inputs
   cover its outputs — the surplus is that sub-tx's share of the fee, so every
   block's surplus is ≥ 0 and the surpluses sum to the total fee. N = the number
   of such interpretations; the transaction's ENTROPY is E = log2(N) bits
   (LaurentMT's definition: a plain payment N=1 → E=0; an ambiguous 2×2 N=2 →
   E=1; a 2×2 equal-value CoinJoin N=3 → E=1.585). The LINK PROBABILITY LP(i,j)
   is the fraction of interpretations in which input i and output j share a block;
   LP=1 is a DETERMINISTIC link — an input→output connection provable on-chain,
   the exact thing surveillance clustering exploits. Validated against those
   canonical vectors (and LP=2/3 for the 2×2 CoinJoin) in the test suite.

   Pure-JS bitmask enumeration with memoised partition counting — no eval, no
   WASM, no dependency, unlike the Rust→WASM engines other tools ship. Capped at
   12 inputs / 12 outputs (the reference Boltzmann limit) with an iteration budget
   so it can never hang the browser; large equal-value CoinJoins are the only
   shape that explodes, and their ambiguity is exactly the point. */
function txInterpretations(ins, outs, fee, opts) {
  opts = opts || {};
  const n = ins.length, m = outs.length;
  const CAP = opts.cap || 12;
  if (n === 0 || m === 0) return { error: "empty" };
  if (n > CAP || m > CAP) return { error: "too-many", n, m, cap: CAP };
  if (fee == null) fee = ins.reduce((a, x) => a + x, 0) - outs.reduce((a, x) => a + x, 0);
  if (fee < 0) return { error: "negative-fee" };

  // subset sums (n,m ≤ 12 → ≤ 4096 masks each)
  const inSum = new Array(1 << n), outSum = new Array(1 << m);
  inSum[0] = 0; outSum[0] = 0;
  for (let mask = 1; mask < (1 << n); mask++) { const low = mask & -mask; inSum[mask] = inSum[mask ^ low] + ins[31 - Math.clz32(low)]; }
  for (let mask = 1; mask < (1 << m); mask++) { const low = mask & -mask; outSum[mask] = outSum[mask ^ low] + outs[31 - Math.clz32(low)]; }

  const fullIn = (1 << n) - 1, fullOut = (1 << m) - 1;
  const memo = new Map();
  const IT_CAP = opts.itCap || 8_000_000;
  let iterations = 0, bailed = false;

  // number of valid matched partitions of (inMask, outMask)
  function count(inMask, outMask) {
    if (inMask === 0) return outMask === 0 ? 1 : 0;
    if (outMask === 0) return 0;
    const key = inMask * (1 << m) + outMask;
    const hit = memo.get(key);
    if (hit !== undefined) return hit;
    const i0 = inMask & -inMask, restIn = inMask ^ i0;   // lowest input must be placed
    let total = 0, sub = restIn;
    for (;;) {
      if (bailed) break;
      const si = sub | i0, sIn = inSum[si];
      let osub = outMask;
      for (;;) {
        if (++iterations > IT_CAP) { bailed = true; break; }
        if (osub !== 0) { const surplus = sIn - outSum[osub]; if (surplus >= 0 && surplus <= fee) total += count(inMask ^ si, outMask ^ osub); }
        if (osub === 0) break;
        osub = (osub - 1) & outMask;
      }
      if (sub === 0) break;
      sub = (sub - 1) & restIn;
    }
    memo.set(key, total);
    return total;
  }

  const N = count(fullIn, fullOut);
  if (bailed) return { error: "iteration-cap" };
  if (N === 0) return { error: "no-interpretation" };

  // LP(i,j) = Σ over valid blocks (Si,So) containing i and j of count(rest) / N
  const link = [];
  for (let i = 0; i < n; i++) link.push(new Array(m).fill(0));
  for (let si = 1; si <= fullIn; si++) {
    const sIn = inSum[si];
    for (let so = 1; so <= fullOut; so++) {
      const surplus = sIn - outSum[so];
      if (surplus < 0 || surplus > fee) continue;
      const rest = count(fullIn ^ si, fullOut ^ so);
      if (rest === 0) continue;
      for (let i = 0; i < n; i++) if (si & (1 << i)) for (let j = 0; j < m; j++) if (so & (1 << j)) link[i][j] += rest;
    }
  }
  const lp = link.map(row => row.map(v => v / N));
  let dl = 0;
  for (let i = 0; i < n; i++) for (let j = 0; j < m; j++) if (Math.abs(lp[i][j] - 1) < 1e-9) dl++;
  return { N, entropy: Math.log2(N), lp, dl };
}

// Wrap a parsed tx: pull input/output values, drop OP_RETURN data outputs, and
// run the entropy analysis. Needs input amounts (a full PSBT or fetched tx), so
// raw hex — which carries none — reports unavailable rather than guessing.
function txLinkability(tx) {
  const vin = tx.vin || [], voutAll = tx.vout || [];
  if (!vin.length || vin.some(v => !v.prevout || v.prevout.value == null)) return { available: false, reason: "input-values-unknown" };
  const outs = [];
  voutAll.forEach((o, i) => { if (o.scriptpubkey_type !== "op_return" && o.value != null) outs.push({ v: o.value, idx: i }); });
  if (!outs.length) return { available: false, reason: "no-outputs" };
  const inVals = vin.map(v => v.prevout.value), outVals = outs.map(o => o.v);
  const fee = inVals.reduce((a, b) => a + b, 0) - outVals.reduce((a, b) => a + b, 0);
  if (fee < 0) return { available: false, reason: "negative-fee" };
  if (vin.length > 12 || outs.length > 12) return { available: false, reason: "too-many", n: vin.length, m: outs.length };
  const res = txInterpretations(inVals, outVals, fee);
  if (res.error) return { available: false, reason: res.error, n: vin.length, m: outs.length };
  const eff = _txEfficiency(res.N, vin.length, outs.length);
  return { available: true, n: vin.length, m: outs.length, N: res.N, entropy: res.entropy, dl: res.dl, lp: res.lp, outIdx: outs.map(o => o.idx), fee,
           nmax: eff.nmax, efficiency: eff.efficiency };
}

/* KYCP/Boltzmann "wallet efficiency": this transaction's interpretation count
   as a share of the BEST-POSSIBLE transaction with the same shape — the
   canonical zero-fee, equal-value n×m tx (2×2 → Nmax 3; Whirlpool 5×5 →
   Nmax 1496). Value-independent, so memoized per shape (≤144 keys under the
   12×12 cap). Returns { nmax: null } when even the ideal shape exceeds the
   iteration cap — the caller labels that honestly rather than omitting it. */
const _nmaxCache = new Map();
function _txEfficiency(N, n, m) {
  const key = n + ":" + m;
  if (!_nmaxCache.has(key)) {
    const ideal = txInterpretations(Array(n).fill(m), Array(m).fill(n), 0);
    _nmaxCache.set(key, ideal.error ? null : ideal.N);
  }
  const nmax = _nmaxCache.get(key);
  return { nmax, efficiency: nmax ? N / nmax : null };
}

/* ─────────────────────────────────────────────
   WALLET FINGERPRINT — what a transaction's STRUCTURE reveals about the
   software that built it. Wallets differ in defaults an analyst reads directly
   off-chain: anti-fee-sniping nLockTime, nVersion, RBF nSequence, BIP69 input/
   output ordering, and script-type uniformity. A distinctive combination links
   all of a user's transactions to one wallet and narrows which software they
   run. Computed purely from the parsed tx (no network). Probabilistic by nature
   — reported as "consistent with / rules out", never as certain identification.
   Refs: Bitcoin Optech (fee-sniping, RBF, output linking), BIP69, BIP125. */
function fingerprintTx(tx) {
  const vin = tx.vin || [], vout = tx.vout || [];
  const nIn = vin.length, nOut = vout.length;
  if (!nIn || !nOut) return { available: false };
  const seqs = vin.map(v => v.sequence).filter(s => s != null);
  const haveSeq = seqs.length === nIn;
  const signals = [];

  // nVersion — 2 is near-universal post-BIP68; 1 is a mild tell of older/simpler software.
  if (tx.version === 1) signals.push({ key: "version", distinctive: true, t: "nVersion = 1 — most modern wallets set version 2; this is a mild tell of older or minimal software." });

  // Anti-fee-sniping: a height-based nLockTime near the chain tip (Core, Electrum).
  // Height-based locktime is < 500,000,000; 0 means the wallet doesn't bother.
  const lt = tx.locktime;
  const antiSnipe = lt != null && lt > 0 && lt < 500000000;
  if (lt != null) {
    // On a CONFIRMED tx the inclusion height lets us VERIFY the anti-fee-sniping
    // claim instead of assuming it: Core/Electrum set nLockTime to the current
    // tip, so it confirms within ~a few blocks of the locktime (delta >= 1
    // always — consensus requires inclusion height > a height locktime).
    const incH = tx.status && tx.status.block_height;
    if (antiSnipe && incH) {
      const delta = incH - lt;
      if (delta >= 1 && delta <= 100) signals.push({ key: "locktime", distinctive: false, t: `nLockTime = ${lt}, confirmed at height ${incH} (${delta} block${delta !== 1 ? "s" : ""} later) — verified anti-fee-sniping, the Bitcoin Core / Electrum / Sparrow default. Good: it's the herd behaviour.` });
      else signals.push({ key: "locktime", distinctive: false, t: `nLockTime = ${lt}, well below the inclusion height (${incH}) — either a non-standard locktime, or the transaction waited a long time to confirm. Not a reliable tell on its own.` });
    }
    else if (antiSnipe) signals.push({ key: "locktime", distinctive: false, t: `nLockTime = ${lt} (a recent block height) — anti-fee-sniping, the Bitcoin Core / Electrum default. Good: it's the herd behaviour.` });
    else if (lt === 0) signals.push({ key: "locktime", distinctive: true, t: "nLockTime = 0 — no anti-fee-sniping. Rules out current Bitcoin Core / Electrum defaults; common in many mobile and hardware wallets." });
  }

  // RBF (BIP125): a tx opts in if any input sequence < 0xfffffffe. Uniform
  // 0xfffffffd is the Core/Electrum default (RBF + locktime-enabled).
  let rbf = null;
  if (haveSeq) {
    rbf = seqs.some(s => s < 0xfffffffe);
    const allFD = seqs.every(s => s === 0xfffffffd);
    const allMax = seqs.every(s => s === 0xffffffff);
    if (allFD) signals.push({ key: "rbf", distinctive: false, t: "All inputs nSequence = 0xfffffffd — opt-in RBF, the Core / Electrum default. Good: common." });
    else if (allMax) signals.push({ key: "rbf", distinctive: true, t: "All inputs nSequence = 0xffffffff — no RBF, no locktime. A distinctive default of some wallets; also disables anti-fee-sniping." });
    else if (rbf) signals.push({ key: "rbf", distinctive: true, t: "Mixed / non-standard nSequence values — an unusual signature that stands out." });
  }

  // BIP69: deterministic lexicographic ordering of inputs and outputs. Only a
  // handful of wallets do it, so it's a strong minority fingerprint.
  const inSorted = vin.every((v, i) => i === 0 || cmpIn(vin[i - 1], v) <= 0);
  const outSorted = vout.every((o, i) => i === 0 || cmpOut(vout[i - 1], o) <= 0);
  const bip69Meaningful = nIn > 1 || nOut > 1;
  if (bip69Meaningful && inSorted && outSorted) signals.push({ key: "bip69", distinctive: true, t: "Inputs and outputs are in BIP69 lexicographic order — a deterministic-ordering scheme only a minority of wallets use, so it narrows the field." });

  // Script-type uniformity. Mixed input types = manual coin control or a merged
  // wallet — itself a behavioural fingerprint an analyst notes.
  const inTypes = new Set(vin.map(v => v.prevout && v.prevout.scriptpubkey_type).filter(Boolean));
  if (inTypes.size > 1) signals.push({ key: "mixin", distinctive: true, t: `Inputs mix ${inTypes.size} script types — spending different address types together is unusual and links those coins as one owner's coin-control choice.` });

  // Low-r signature grinding — the strongest deterministic tell, but only visible
  // on a SIGNED tx (raw hex with witnesses); PSBTs are unsigned so it's skipped.
  let sawSig = false, sawHighR = false;
  for (const v of vin) for (const it of [...(v.witness || []), ...(v.scriptsigPushes || [])]) { const si = _derSigInfo(it); if (si) { sawSig = true; if (si.highR) sawHighR = true; } }
  if (sawSig) {
    if (sawHighR) signals.push({ key: "lowr", distinctive: true, t: "A high-r ECDSA signature (72 bytes) is present — Bitcoin Core grinds every signature to low-r since v0.17 (2018), so this rules Core out as the signer." });
    else signals.push({ key: "lowr", distinctive: false, t: "All signatures are low-r (≤71 bytes) — consistent with Bitcoin Core and other modern wallets that grind signatures. Good: the common case." });
  }

  // A soft narrowing narrative from the strongest tells.
  let guess = "";
  const allFDseq = haveSeq && seqs.every(s => s === 0xfffffffd);
  if (sawHighR) return { available: true, signals, distinctive: signals.filter(s => s.distinctive).length, guess: "The high-r signature is decisive: this transaction was not signed by Bitcoin Core.", version: tx.version, locktime: lt, rbf };
  if (antiSnipe && rbf) guess = "Structure is consistent with Bitcoin Core or Electrum (anti-fee-sniping + opt-in RBF defaults).";
  else if (lt === 0 && haveSeq && seqs.every(s => s === 0xffffffff)) guess = "Structure rules out current Core / Electrum defaults (no anti-fee-sniping, no RBF) — consistent with several mobile / hardware wallets.";
  else if (allFDseq && !antiSnipe) guess = "The RBF default matches Core / Electrum, but the missing anti-fee-sniping locktime doesn't — an inconsistent pairing that itself stands out.";

  const distinctive = signals.filter(s => s.distinctive).length;
  return { available: true, signals, distinctive, guess, version: tx.version, locktime: lt, rbf };
}
// BIP69 comparators (module scope so fingerprintTx stays flat).
function cmpIn(a, b) { if (a.txid !== b.txid) return a.txid < b.txid ? -1 : 1; return (a.vout || 0) - (b.vout || 0); }
function cmpOut(a, b) { if ((a.value || 0) !== (b.value || 0)) return (a.value || 0) - (b.value || 0); const x = a.scriptpubkey || "", y = b.scriptpubkey || ""; return x < y ? -1 : x > y ? 1 : 0; }
// A witness/scriptSig signature push is a DER ECDSA sig + 1 sighash byte:
// 30 <len> 02 <rlen> <r> 02 <slen> <s> <sighash>. Bitcoin Core (≥v0.17, 2018)
// grinds every signature to low-r, so r fits in 32 bytes (rlen=0x20) and the sig
// is ≤71 bytes; a high-r sig (rlen=0x21, 33 bytes, total 72) is one Core would
// never produce — a deterministic "not Core" tell. Returns null for non-sigs.
// Extract the data pushes from a scriptSig (legacy P2PKH/P2SH spends carry
// their signatures here, not in the witness). Walks push opcodes only —
// 0x01-0x4b direct, 0x4c PUSHDATA1, 0x4d PUSHDATA2 — and stops at anything
// else. Capped so a malformed script can't build a huge array.
function _scriptPushes(b) {
  const out = [];
  let p = 0;
  while (p < b.length && out.length < 32) {
    const op = b[p++];
    let n = -1;
    if (op >= 0x01 && op <= 0x4b) n = op;
    else if (op === 0x4c) { n = b[p]; p += 1; }
    else if (op === 0x4d) { n = b[p] | (b[p + 1] << 8); p += 2; }
    else break;                                  // non-push opcode — done
    if (n < 0 || p + n > b.length) break;        // truncated — stop cleanly
    out.push(b.slice(p, p + n));
    p += n;
  }
  return out;
}

function _derSigInfo(b) {
  if (!b || b.length < 9 || b[0] !== 0x30) return null;
  if (b[1] !== b.length - 3) return null;                 // DER length (excl. 2 header + 1 sighash)
  if (b[2] !== 0x02) return null;                         // r INTEGER marker
  const rlen = b[3];
  if (4 + rlen >= b.length || b[4 + rlen] !== 0x02) return null; // s INTEGER marker
  return { der: true, len: b.length, highR: rlen >= 0x21 };
}

// A real, minted PSBT (validated round-trip): 3 bech32 inputs fused, a round
// 5,000,000-sat payment, and change reused back to input #1 — a compact tour
// of what the Inspector catches. Parsed live by the real parser (zero network).
const DEMO_PSBT = "cHNidP8BAMMCAAAAAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD9////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAP3///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAA/f///wJAS0wAAAAAABYAFEREREREREREREREREREREREREREUC0ZAAAAAAAWABQREREREREREREREREREREREREREQAAAAAAAQEfwMYtAAAAAAAWABQREREREREREREREREREREREREREQABAR+gJSYAAAAAABYAFCIiIiIiIiIiIiIiIiIiIiIiIiIiAAEBH4BPEgAAAAAAFgAUMzMzMzMzMzMzMzMzMzMzMzMzMzMAAAA=";
