// -- byte cursor for deserialization --
function _makeCursor(bytes) {
  let p = 0;
  return {
    get p() { return p; },
    byte() { return bytes[p++]; },
    peek() { return bytes[p]; },
    slice(n) { if (p + n > bytes.length) throw new Error("unexpected end of data"); const s = bytes.slice(p, p + n); p += n; return s; },
    u32() { if (p + 4 > bytes.length) throw new Error("unexpected end of data"); const v = (bytes[p]|(bytes[p+1]<<8)|(bytes[p+2]<<16)|(bytes[p+3]<<24)) >>> 0; p += 4; return v; },
    u64() { if (p + 8 > bytes.length) throw new Error("unexpected end of data"); let v = 0n; for (let i = 0; i < 8; i++) v |= BigInt(bytes[p+i]) << BigInt(8*i); p += 8; if (v > BigInt(Number.MAX_SAFE_INTEGER)) throw new Error("value exceeds 2^53"); return Number(v); },
    varint() { const f = bytes[p++]; if (f === undefined) throw new Error("unexpected end of data"); if (f < 0xfd) return f; if (f === 0xfd) { const v = bytes[p]|(bytes[p+1]<<8); p += 2; return v; } if (f === 0xfe) { const v = (bytes[p]|(bytes[p+1]<<8)|(bytes[p+2]<<16)|(bytes[p+3]<<24)) >>> 0; p += 4; return v; } let v = 0n; for (let i = 0; i < 8; i++) v |= BigInt(bytes[p+i]) << BigInt(8*i); p += 8; if (v > BigInt(Number.MAX_SAFE_INTEGER)) throw new Error("varint exceeds 2^53"); return Number(v); },
    varslice() { const n = this.varint(); return this.slice(n); },
  };
}

// -- scriptPubKey → { type, address }. The address is deterministic from the
//    script bytes (real bc1…/1…/3… where encodable, else a "script:<hex>"
//    sentinel), so equality — used for reuse/cluster detection — is byte-exact
//    for every type while common cases still show a real address. --
function classifyScript(s) {
  if (s.length === 25 && s[0]===0x76 && s[1]===0xa9 && s[2]===0x14 && s[23]===0x88 && s[24]===0xac)
    return { type: "p2pkh", address: _base58check(0x00, s.slice(3, 23)) };
  if (s.length === 23 && s[0]===0xa9 && s[1]===0x14 && s[22]===0x87)
    return { type: "p2sh", address: _base58check(0x05, s.slice(2, 22)) };
  if (s.length === 22 && s[0]===0x00 && s[1]===0x14)
    return { type: "v0_p2wpkh", address: _segwitAddress(0, s.slice(2)) };
  if (s.length === 34 && s[0]===0x00 && s[1]===0x20)
    return { type: "v0_p2wsh", address: _segwitAddress(0, s.slice(2)) };
  if (s.length === 34 && s[0]===0x51 && s[1]===0x20)
    return { type: "v1_p2tr", address: _segwitAddress(1, s.slice(2)) };
  if (s.length >= 1 && s[0]===0x6a)
    return { type: "op_return", address: null };
  return { type: "unknown", address: null };
}
function _spkAddr(cl, spk) { return cl.address ?? ("script:" + _bytesToHex(spk)); }

// -- deserialize a raw Bitcoin transaction → Esplora-ish shape --
function parseRawTx(bytes) {
  const c = _makeCursor(bytes);
  const version = c.u32();
  let segwit = false;
  if (c.peek() === 0x00) { c.byte(); const flag = c.byte(); if (flag !== 0x01) throw new Error("bad segwit flag"); segwit = true; }
  const nIn = c.varint();
  if (nIn > 5000) throw new Error("too many inputs");
  const vin = [];
  for (let i = 0; i < nIn; i++) {
    const prevTxid = c.slice(32);
    const vout = c.u32();
    const ss = c.varslice();     // scriptSig — legacy inputs carry their signatures here
    const sequence = c.u32();    // nSequence — kept for RBF / anti-fee-sniping fingerprinting
    vin.push({ txid: _bytesToHex(prevTxid.slice().reverse()), vout, prevout: null, sequence, scriptsigPushes: ss.length ? _scriptPushes(ss) : undefined });
  }
  const nOut = c.varint();
  if (nOut > 5000) throw new Error("too many outputs");
  const vout = [];
  for (let i = 0; i < nOut; i++) {
    const value = c.u64();
    const spk = c.varslice();
    const cl = classifyScript(spk);
    vout.push({ value, scriptpubkey: _bytesToHex(spk), scriptpubkey_type: cl.type, scriptpubkey_address: _spkAddr(cl, spk) });
  }
  if (segwit) { for (let i = 0; i < nIn; i++) { const items = c.varint(); const w = []; for (let j = 0; j < items; j++) w.push(c.varslice()); vin[i].witness = w; } }
  const locktime = c.u32();
  return { version, vin, vout, locktime, segwit };
}

// -- deserialize a PSBT (BIP174, v0) → the same shape, with input prevouts
//    resolved from witness_utxo / non_witness_utxo (so fully offline) --
function parsePsbt(bytes) {
  const c = _makeCursor(bytes);
  if (_bytesToHex(c.slice(5)) !== "70736274ff") throw new Error("not a PSBT (bad magic)");
  let unsigned = null;
  while (true) {                                  // global map
    const kl = c.varint(); if (kl === 0) break;
    const key = c.slice(kl); const val = c.varslice();
    if (key[0] === 0x00) unsigned = parseRawTx(val);
  }
  if (!unsigned) throw new Error("PSBTv2 (or missing unsigned tx) isn't supported yet — paste a v0 PSBT or the raw transaction hex");
  let partial = false;
  for (let i = 0; i < unsigned.vin.length; i++) {  // one input map per vin
    let wUtxo = null, nwUtxo = null;
    while (true) {
      const kl = c.varint(); if (kl === 0) break;
      const key = c.slice(kl); const val = c.varslice();
      if (key[0] === 0x01) { const ic = _makeCursor(val); const value = ic.u64(); const spk = ic.varslice(); wUtxo = { value, spk }; }
      else if (key[0] === 0x00) { nwUtxo = parseRawTx(val); }
    }
    let uxo = null;
    if (wUtxo) uxo = wUtxo;
    else if (nwUtxo) { const o = nwUtxo.vout[unsigned.vin[i].vout]; if (o) uxo = { value: o.value, spk: _hexToBytes(o.scriptpubkey) }; }
    if (!uxo) { partial = true; continue; }
    const cl = classifyScript(uxo.spk);
    unsigned.vin[i].prevout = { value: uxo.value, scriptpubkey_type: cl.type, scriptpubkey_address: _spkAddr(cl, uxo.spk) };
  }
  const inSum = unsigned.vin.reduce((a, v) => a + (v.prevout ? v.prevout.value : 0), 0);
  const outSum = unsigned.vout.reduce((a, o) => a + o.value, 0);
  return { txid: null, vin: unsigned.vin, vout: unsigned.vout, fee: partial ? null : inSum - outSum, partial, version: unsigned.version, locktime: unsigned.locktime };
}

// -- input detection + dispatch (paste-DoS capped) --
function detectTxInput(v) {
  const s = (v || "").trim();
  if (!s) return null;
  if (/^[0-9a-fA-F]{64}$/.test(s)) return "txid";
  if (/^cHNidP/.test(s)) return "psbt";                                  // base64 PSBT magic
  if (/^[0-9a-fA-F]+$/.test(s) && s.length % 2 === 0 && s.length >= 20) return "rawhex";
  return null;
}
// A paste that is trying to be a txid but isn't 64 hex characters. Returns a
// message and never a network call. Raw transaction hex and PSBTs return null
// so the parser below can take them. Valid txids return null too.
function txidShapeIssue(raw) {
  const s = (raw || "").trim();
  if (!s || /^cHNidP/.test(s)) return null;
  if (/^[0-9a-fA-F]{64}$/.test(s)) return null;
  if (/^[0-9a-fA-F]+$/.test(s) && s.length % 2 === 0 && s.length >= 20) return null;
  const bare = s.replace(/^0x/i, "");
  const hexBody = /^[0-9a-fA-F]+$/.test(bare);
  const prefixed = /^0x/i.test(s);
  const almost = /^[0-9a-zA-Z]+$/.test(s) && s.length >= 32 && s.length <= 80;
  if (!prefixed && !hexBody && !almost) return null;
  const sent = " This one was rejected before any request was sent.";
  if (prefixed && /^[0-9a-fA-F]{64}$/.test(bare))
    return "That isn't a valid transaction id — drop the 0x prefix. A txid is exactly 64 hexadecimal characters (0-9, a-f)." + sent;
  if (hexBody)
    return `That isn't a valid transaction id — ${bare.length} hex character${bare.length === 1 ? "" : "s"}, and a txid is exactly 64.` + sent;
  return "That isn't a valid transaction id. A txid is exactly 64 hexadecimal characters (0-9, a-f)." + sent;
}
function parseTransactionInput(raw) {
  const s = (raw || "").trim();
  if (s.length > 100000) throw new Error("Input too large — paste a single transaction");
  const shape = txidShapeIssue(s);
  if (shape) { const e = new Error(shape); e.kind = "invalid"; throw e; }
  const kind = detectTxInput(s);
  if (kind === "psbt") return { kind, tx: parsePsbt(_base64ToBytes(s)) };
  if (kind === "rawhex") { const t = parseRawTx(_hexToBytes(s)); return { kind, tx: { txid: null, vin: t.vin, vout: t.vout, fee: null, partial: true, version: t.version, locktime: t.locktime } }; }
  if (kind === "txid") return { kind, tx: null };   // networked path (handled by the caller)
  throw new Error("Unrecognized input — paste a PSBT (base64), raw transaction hex, or a 64-character txid");
}
