/* ─────────────────────────────────────────────
   API + DEMO DATA
───────────────────────────────────────────── */
// Esplora serves about 25 confirmed transactions per page (the first /txs
// response also includes mempool txs). Follow /txs/chain/:last_seen_txid so a
// busy address isn't scored on only the newest screen, and stop at a cap so
// one scan can't turn into an unbounded crawl.
const TX_PAGE_SIZE = 25;
const TX_PAGE_CAP = 10;
const TX_HISTORY_CAP = 250;

function confirmedOnPage(list) {
  const out = [];
  for (const tx of list || []) if (tx && tx.status && tx.status.confirmed && tx.txid) out.push(tx.txid);
  return out;
}

async function fetchAddress(addr, opts = {}) {
  // Uses the user-selected explorer (blockstream / mempool — same esplora API),
  // directly or via the relay's mirror path for it. If the relay is on but
  // unreachable, the fetch below rejects and analyze() fails honestly — we
  // never silently fall back to a direct query, which would leak the very IP
  // the user has the relay on to hide.
  const pageCap = opts.pageCap || TX_PAGE_CAP;
  const txCap = opts.txCap || TX_HISTORY_CAP;
  const exp = explorer();
  const base = relayOn() ? `${RELAY_URL}${exp.relayPath}` : exp.api;
  const safe = encodeURIComponent(addr);
  const [info, utxos, firstPage] = await Promise.all([
    fetch(`${base}/address/${safe}`).then(r => { if (!r.ok) throw new Error("Not found"); return r.json(); }),
    fetch(`${base}/address/${safe}/utxo`).then(r => r.json()),
    fetch(`${base}/address/${safe}/txs`).then(r => r.json()),
  ]);
  if (!info || typeof info !== "object") throw new Error("Invalid API response");
  if (!Array.isArray(utxos)) throw new Error("Invalid UTXO response");
  if (!Array.isArray(firstPage)) throw new Error("Invalid TX response");

  const txs = [];
  const seen = new Set();
  const pushPage = (page) => {
    let added = 0;
    for (const tx of page) {
      if (!tx || !tx.txid || seen.has(tx.txid)) continue;
      if (txs.length >= txCap) break;
      seen.add(tx.txid);
      txs.push(tx);
      added++;
    }
    return added;
  };
  pushPage(firstPage);

  const chainCount = info.chain_stats && Number.isFinite(info.chain_stats.tx_count) ? info.chain_stats.tx_count : null;
  let pages = 1;
  let cursor = confirmedOnPage(firstPage).slice(-1)[0] || null;
  let more = confirmedOnPage(firstPage).length >= TX_PAGE_SIZE;
  while (more && cursor && pages < pageCap && txs.length < txCap && (chainCount == null || confirmedOnPage(txs).length < chainCount)) {
    const res = await fetch(`${base}/address/${safe}/txs/chain/${encodeURIComponent(cursor)}`);
    if (!res.ok) {
      const bodyText = await res.text().catch(() => "");
      const failure = txLookupFailure(res.status, res.headers.get("content-type"), bodyText, relayOn());
      const err = new Error(failure.kind === "blocked" ? failure.message : "Invalid TX response");
      err.kind = failure.kind;
      throw err;
    }
    const page = await res.json();
    if (!Array.isArray(page)) throw new Error("Invalid TX response");
    const added = pushPage(page);
    pages++;
    if (added === 0 || page.length === 0) break;
    const next = confirmedOnPage(page).slice(-1)[0] || null;
    if (!next || next === cursor) break;
    cursor = next;
    more = page.length >= TX_PAGE_SIZE;
  }

  const confirmedFetched = confirmedOnPage(txs).length;
  const hitCap = pages >= pageCap || txs.length >= txCap;
  const capped = chainCount != null && confirmedFetched < chainCount && hitCap;
  return {
    addrInfo: info,
    utxos: utxos.slice(0, 30),
    txs,
    txSample: { fetched: txs.length, total: chainCount, capped },
  };
}

const now = () => Math.floor(Date.now() / 1000);
// Timestamp `days` ago at a fixed UTC clock-hour (for demo data whose
// time-of-day pattern must be deterministic, not tied to the visit time).
const atUtcHour = (days, hour) => Math.floor(now() / 86400) * 86400 - 86400 * days + 3600 * hour;
// Pristine demo — designed to score A. CoinJoin-mixed, no dust, no round
// amounts, single script type, balanced UTXO set, low tx count, no
// consolidation. This is what the audit is trying to teach users to look like.
// Strong-privacy sample. INTERNALLY CONSISTENT: every UTXO is one of the
// three transactions' outputs paid to this address (the "me" outputs), so
// funded_txo_count (3) == tx_count (3) == utxos.length. Its one honest caveat
// is receiving all three to the SAME address — minor reuse that costs a few
// points even for an otherwise-excellent (CoinJoin, no dust/round) wallet.
const DEMO_A = {
  addrInfo: { chain_stats: { tx_count: 3, funded_txo_count: 3, spent_txo_count: 0 } },
  utxos: [
    { txid:"7a82bc91e3411d05",vout:5,value:17431892,scriptpubkey_type:"v0_p2wpkh",status:{confirmed:true,block_time:now()-86400*30}},
    { txid:"2e91a4bc77f01122",vout:4,value:11254731,scriptpubkey_type:"v0_p2wpkh",status:{confirmed:true,block_time:now()-86400*60}},
    { txid:"d4f1b206c8a99933",vout:0,value:8721400, scriptpubkey_type:"v0_p2wpkh",status:{confirmed:true,block_time:now()-86400*90}},
  ],
  txs: [
    // CoinJoin #1 — 5 inputs (participants), 8 outputs, 5 share the 5,000,000-sat denomination
    { txid:"7a82bc91",vin:[{txid:"src1a",vout:0},{txid:"src1b",vout:1},{txid:"src1c",vout:0},{txid:"src1d",vout:3},{txid:"src1e",vout:1}],vout:[
      {value:5000000,scriptpubkey_address:"bc1qcj1"},
      {value:5000000,scriptpubkey_address:"bc1qcj2"},
      {value:5000000,scriptpubkey_address:"bc1qcj3"},
      {value:5000000,scriptpubkey_address:"bc1qcj4"},
      {value:5000000,scriptpubkey_address:"bc1qcj5"},
      {value:17431892,scriptpubkey_address:"bc1qme1"},
      {value:3214557,scriptpubkey_address:"bc1qch1"},
      {value:1024113,scriptpubkey_address:"bc1qch2"},
    ],fee:8923,size:545,status:{block_time:now()-86400*30}},
    // CoinJoin #2 — 4 inputs (participants), 6 outputs, 4 share the 1,000,000-sat denomination
    { txid:"2e91a4bc",vin:[{txid:"src2a",vout:0},{txid:"src2b",vout:1},{txid:"src2c",vout:0},{txid:"src2d",vout:2}],vout:[
      {value:1000000,scriptpubkey_address:"bc1qcj6"},
      {value:1000000,scriptpubkey_address:"bc1qcj7"},
      {value:1000000,scriptpubkey_address:"bc1qcj8"},
      {value:1000000,scriptpubkey_address:"bc1qcj9"},
      {value:11254731,scriptpubkey_address:"bc1qme2"},
      {value:887621, scriptpubkey_address:"bc1qch3"},
    ],fee:7824,size:482,status:{block_time:now()-86400*60}},
    // Normal Lightning-funded send (varied fees, no consolidation)
    { txid:"d4f1b206",vin:[{txid:"src3",vout:0}],vout:[
      {value:8721400,scriptpubkey_address:"bc1qme3"},
      {value:2189412,scriptpubkey_address:"bc1qrx1"},
    ],fee:1437,size:223,status:{block_time:now()-86400*90}},
  ],
};

const DEMO = {
  addrInfo: { chain_stats: { tx_count: 7 } },
  utxos: [
    { txid:"a3f21e9b4c7d2f01",vout:0,value:120000000,scriptpubkey_type:"v0_p2wpkh",status:{confirmed:true,block_time:now()-86400*14}},
    { txid:"7b91cc3adf982b44",vout:1,value:84700000,scriptpubkey_type:"v0_p2wpkh", status:{confirmed:true,block_time:now()-86400*60}},
    { txid:"f004d188a2ccef91",vout:0,value:50000000,scriptpubkey_type:"p2pkh",     status:{confirmed:true,block_time:now()-86400*180}},
    { txid:"2d5e4f7c01ba3390",vout:0,value:20000000,scriptpubkey_type:"v0_p2wpkh", status:{confirmed:true,block_time:now()-86400*365}},
    { txid:"9c11a2b0e3ff4d22",vout:2,value:10000000,scriptpubkey_type:"v0_p2wpkh", status:{confirmed:true,block_time:now()-86400*3}},
    { txid:"44cc3b77f19a0011",vout:0,value:546,      scriptpubkey_type:"v0_p2wpkh", status:{confirmed:true,block_time:now()-86400*2}},
  ],
  // Demo tx timestamps are anchored to fixed UTC clock-hours (evening-heavy,
  // quiet 04:00–13:00 UTC) so the Activity Clock tells the same deterministic
  // story for every visitor — a realistic "analysts can read your timezone"
  // pattern, not an artifact of when the page was opened.
  txs: [
    { txid:"a3f21e9b",vin:[{txid:"p1",vout:0}],vout:[{value:120000000,scriptpubkey_address:"bc1qex1"},{value:9871234,scriptpubkey_address:"bc1qex2"}],fee:1420,size:224,status:{block_time:atUtcHour(14,20)}},
    // Input prevout addresses (address only — no type, so scoring is untouched)
    // let the demo showcase the Cluster Exposure panel: this consolidation
    // provably links three sibling addresses to the scanned one.
    { txid:"7b91cc3a",vin:[{txid:"p2",vout:0,prevout:{scriptpubkey_address:"DEMO"}},{txid:"p3",vout:1,prevout:{scriptpubkey_address:"bc1q8f4tr0lk29mzy3w"}},{txid:"p4",vout:0,prevout:{scriptpubkey_address:"bc1qv5dm82apx7hcen4"}},{txid:"p5",vout:2,prevout:{scriptpubkey_address:"bc1qt6ky4w0jr3nqd8s"}}],vout:[{value:84700000,scriptpubkey_address:"bc1qex3"}],fee:3200,size:450,status:{block_time:atUtcHour(60,16)}},
    { txid:"f004d188",vin:[{txid:"p6",vout:0}],vout:[{value:50000000},{value:50000000},{value:50000000},{value:50000000},{value:19874123}],fee:980,size:340,status:{block_time:atUtcHour(180,23)}},
    { txid:"2d5e4f7c",vin:[{txid:"p7",vout:0}],vout:[{value:20000000},{value:8312200}],fee:780,size:224,status:{block_time:atUtcHour(365,14)}},
    { txid:"9c11a2b0",vin:[{txid:"p8",vout:0,prevout:{scriptpubkey_type:"v0_p2wpkh"}}],vout:[{value:10000000,scriptpubkey_type:"p2pkh"},{value:3421000,scriptpubkey_type:"v0_p2wpkh"}],fee:650,size:224,status:{block_time:atUtcHour(3,1)}},
    { txid:"44cc3b77",vin:[{txid:"p9",vout:0}],vout:[{value:546},{value:99999454}],fee:320,size:150,status:{block_time:atUtcHour(2,3)}},
    { txid:"bb44e901",vin:[{txid:"p10",vout:0}],vout:[{value:100000000}],fee:1100,size:200,status:{block_time:atUtcHour(200,18)}},
  ],
};

