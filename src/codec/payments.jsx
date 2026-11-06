/* SILENT PAYMENTS (BIP352) — decode/validate an sp1…/tsp1… address entirely in
   the browser. A silent payment address is a REUSABLE address that never reuses
   on-chain: each payment derives a fresh, unlinkable output, so address-reuse
   clustering simply can't touch it. It encodes two keys — a scan key (kept
   online to detect payments) and a spend key (kept in cold storage). bech32m,
   hrp "sp"/"tsp", version 0 = char 'q', 66-byte payload = ser(B_scan)‖ser(B_spend).
   Validated against the BIP352 "Simple send" test-vector address. */
function decodeSilentPayment(str) {
  const d = _bech32Decode((str || "").trim());
  if (!d || d.spec !== "bech32m") return null;
  const network = d.hrp === "sp" ? "mainnet" : d.hrp === "tsp" ? "testnet" : null;
  if (!network || d.data.length < 1) return null;
  const version = d.data[0];
  if (version === 31) return { network, version, error: "v31" };   // reserved breaking change
  // strict 5→8 bit unpacking (reject bad padding / stray bits)
  let acc = 0, bits = 0; const out = [];
  for (const v of d.data.slice(1)) { acc = (acc << 5) | v; bits += 5; while (bits >= 8) { bits -= 8; out.push((acc >> bits) & 0xff); } }
  if (bits >= 5 || (acc & ((1 << bits) - 1))) return null;
  if (version === 0 && out.length !== 66) return null;   // BIP352: v0 data part is EXACTLY 66 bytes
  if (out.length < 66) return null;                      // v1–30 may append trailing bytes; read the first 66
  const scan = out.slice(0, 33), spend = out.slice(33, 66);
  const ok = b => b[0] === 0x02 || b[0] === 0x03;
  if (!ok(scan) || !ok(spend)) return null;
  const hex = a => a.map(x => x.toString(16).padStart(2, "0")).join("");
  return { network, version, scanKey: hex(scan), spendKey: hex(spend) };
}
function detectSilentPayment(v) { const s = (v || "").trim().toLowerCase(); if (!/^t?sp1[a-z0-9]+$/.test(s)) return null; return decodeSilentPayment(s) ? (s.startsWith("tsp1") ? "tsp" : "sp") : null; }

/* BOLT11 LIGHTNING INVOICE decode + privacy lint (pure JS, no network). The big
   leak: to be paid over a PRIVATE channel, an invoice MUST carry routing hints —
   the peer's node pubkey plus a short-channel-ID, and a SCID is defined (BOLT7)
   as block_height × tx_index × output_index of the channel's FUNDING transaction.
   So anyone you hand the invoice to learns the exact on-chain UTXO backing your
   channel. Decoded here purely by parsing the invoice; validated against the
   BOLT11 spec's routing-hint example. */
function _g5Int(g) { let n = 0; for (const x of g) n = n * 32 + x; return n; }               // 5-bit groups → int (≤~45 bits)
function _g5Bytes(g) { let acc = 0, bits = 0; const out = []; for (const x of g) { acc = (acc << 5) | x; bits += 5; if (bits >= 8) { bits -= 8; out.push((acc >> bits) & 0xff); } } return out; }
const _BOLT_MULT = { m: 1e8, u: 1e5, n: 1e2, p: 0.1 };   // multiplier → msat per unit (1 BTC = 1e11 msat)
function decodeBolt11(str) {
  const d = _bech32Decode((str || "").trim());
  if (!d || d.spec !== "bech32" || !d.hrp.startsWith("ln")) return null;
  const m = d.hrp.slice(2).match(/^(bcrt|tbs|bc|tb)([0-9]*)([munp]?)$/);   // tbs (signet) before tb so it wins
  if (!m) return null;
  const network = { bc: "mainnet", tb: "testnet", tbs: "signet", bcrt: "regtest" }[m[1]];
  let amountMsat = null;
  if (m[2]) { const num = parseInt(m[2], 10); amountMsat = m[3] ? Math.round(num * _BOLT_MULT[m[3]]) : num * 1e11; }
  const data = d.data;
  if (data.length < 7 + 104) return null;                 // timestamp(7) + 520-bit sig(104)
  const timestamp = _g5Int(data.slice(0, 7));
  const end = data.length - 104;
  const TYPE = { 1: "p", 16: "s", 13: "d", 19: "n", 23: "h", 6: "x", 3: "r", 9: "f", 5: "9", 27: "m", 24: "c" };
  const hex = a => a.map(x => x.toString(16).padStart(2, "0")).join("");
  const f = {}; const routes = [];
  let pos = 7;
  while (pos + 3 <= end) {
    const len = data[pos + 1] * 32 + data[pos + 2];
    const name = TYPE[data[pos]];
    pos += 3;
    if (pos + len > end) break;
    const g = data.slice(pos, pos + len); pos += len;
    if (name === "p" || name === "h") f[name] = hex(_g5Bytes(g)).slice(0, 64);
    else if (name === "n") f.n = hex(_g5Bytes(g)).slice(0, 66);
    else if (name === "d") { try { f.d = new TextDecoder().decode(new Uint8Array(_g5Bytes(g))); } catch { f.d = null; } }
    else if (name === "x") f.x = _g5Int(g);
    else if (name === "r") {
      const b = _g5Bytes(g);
      for (let i = 0; i + 51 <= b.length; i += 51) {
        // SCID (BOLT7) = 3-byte block_height · 3-byte tx_index · 2-byte output_index
        // of the funding tx. Read each field straight from the bytes (the full
        // 8-byte value exceeds 2^53, so never form it as a Number).
        const o = i + 33;
        routes.push({ pubkey: hex(b.slice(i, i + 33)),
          block: (b[o] << 16) | (b[o + 1] << 8) | b[o + 2],
          tx: (b[o + 3] << 16) | (b[o + 4] << 8) | b[o + 5],
          out: (b[o + 6] << 8) | b[o + 7] });
      }
    }
  }
  return { network, amountMsat, timestamp, paymentHash: f.p, description: f.d ?? null, payeePubkey: f.n ?? null, expiry: f.x ?? null, descHash: f.h ?? null, routes };
}
function detectBolt11(v) { const s = (v || "").trim().toLowerCase(); if (!/^ln(bcrt|tbs|bc|tb)[0-9]*[munp]?1[a-z0-9]+$/.test(s)) return null; return decodeBolt11(s) ? "bolt11" : null; }

/* BOLT12 OFFER decode + privacy lint (pure JS, no network). Offers are the
   privacy upgrade to BOLT11: reusable without a static invoice/payment-hash to
   correlate, and when they carry BLINDED PATHS (offer_paths, TLV 16) the payee's
   node identity is hidden behind intermediaries. The lint: blinded paths = good
   (identity hidden); a bare offer_issuer_id (TLV 22) with no paths exposes the
   node pubkey. bech32 WITHOUT a checksum, hrp "lno", '+'/whitespace stripped;
   a TLV stream of BigSize type·BigSize length·value. Validated vs a BOLT12
   spec test-vector offer. */
function _bech32NoChecksum(str) {
  str = (str || "").toLowerCase().replace(/[+\s]/g, "");
  const pos = str.lastIndexOf("1");
  if (pos < 1) return null;
  const hrp = str.slice(0, pos), vals = [];
  for (const c of str.slice(pos + 1)) { const v = _BECHKEY[c]; if (v === undefined) return null; vals.push(v); }
  return { hrp, bytes: _g5Bytes(vals) };
}
function _bigSize(b, pos) {
  const f = b[pos];
  if (f === undefined) return null;
  if (f < 0xfd) return [f, pos + 1];
  if (f === 0xfd) return [(b[pos + 1] << 8) | b[pos + 2], pos + 3];
  if (f === 0xfe) return [((b[pos + 1] << 24) | (b[pos + 2] << 16) | (b[pos + 3] << 8) | b[pos + 4]) >>> 0, pos + 5];
  let v = 0; for (let i = 1; i <= 8; i++) v = v * 256 + b[pos + i]; return [v, pos + 9];
}
function decodeBolt12Offer(str) {
  const d = _bech32NoChecksum((str || "").trim());
  if (!d || d.hrp !== "lno") return null;
  const b = d.bytes; const tlv = {}; let pos = 0;
  while (pos < b.length) {
    let r = _bigSize(b, pos); if (!r) return null; const type = r[0]; pos = r[1];
    r = _bigSize(b, pos); if (!r) return null; const len = r[0]; pos = r[1];
    if (pos + len > b.length) return null;
    tlv[type] = b.slice(pos, pos + len); pos += len;
  }
  if (!Object.keys(tlv).length) return null;
  const hex = a => a.map(x => x.toString(16).padStart(2, "0")).join("");
  const utf8 = a => { try { return new TextDecoder().decode(new Uint8Array(a)); } catch { return null; } };
  const beInt = a => { let n = 0; for (const x of a) n = n * 256 + x; return n; };
  const out = { hasBlindedPaths: 16 in tlv, tlvTypes: Object.keys(tlv).map(Number).sort((a, b) => a - b) };
  if (8 in tlv) out.amountMsat = beInt(tlv[8]);
  if (6 in tlv) out.currency = utf8(tlv[6]);
  if (10 in tlv) out.description = utf8(tlv[10]);
  if (18 in tlv) out.issuer = utf8(tlv[18]);
  if (22 in tlv) out.issuerId = hex(tlv[22]);
  return out;
}
function detectBolt12(v) { const s = (v || "").trim().toLowerCase().replace(/[+\s]/g, ""); if (!/^lno1[a-z0-9]+$/.test(s)) return null; return decodeBolt12Offer(s) ? "bolt12" : null; }

/* LNURL (LUD-01) decode + Lightning address (LUD-16). Both funnel payments
   through an HTTPS endpoint the operator controls — a metadata chokepoint that
   sees your IP and every request. bech32-encoded https URL for LNURL; user@host
   → https://host/.well-known/lnurlp/user for a Lightning address. */
function decodeLnurl(str) {
  const d = _bech32Decode((str || "").trim());
  if (!d || d.spec !== "bech32" || d.hrp !== "lnurl") return null;
  let url; try { url = new TextDecoder().decode(new Uint8Array(_g5Bytes(d.data))); } catch { return null; }
  if (!/^https?:\/\//i.test(url)) return null;
  try { return { url, host: new URL(url).host }; } catch { return null; }
}
function resolveLnAddress(str) {
  const s = (str || "").trim();
  const m = s.match(/^([a-z0-9._%+-]+)@([a-z0-9.-]+\.[a-z]{2,})$/i);
  if (!m) return null;
  return { user: m[1], host: m[2].toLowerCase(), endpoint: `https://${m[2].toLowerCase()}/.well-known/lnurlp/${m[1]}` };
}

/* CASHU ECASH token decode + privacy note (pure JS, no network). Cashu is
   Chaumian ecash on top of Lightning: a mint issues blind-signed tokens, so it
   can't link who withdrew a token to who redeemed it (strong sender/receiver
   unlinkability) — but the mint is a TRUSTED CUSTODIAN that holds the funds and
   knows total balances, and tokens pasted in cleartext (chat, email) can be
   stolen or correlated by anyone who sees them. Two serializations: V3
   "cashuA" = base64url JSON, V4 "cashuB" = base64url CBOR (minimal pure-JS CBOR
   decoder below). Validated against the NUT-00 V4 example token. */
function _b64urlBytes(s) {
  s = (s || "").replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4) s += "=";
  let bin; try { bin = atob(s); } catch { return null; }
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}
function _cborDecode(b) {
  let p = 0;
  const rlen = ai => {
    if (ai < 24) return ai;
    if (ai === 24) return b[p++];
    if (ai === 25) { const v = (b[p] << 8) | b[p + 1]; p += 2; return v; }
    if (ai === 26) { const v = ((b[p] << 24) | (b[p + 1] << 16) | (b[p + 2] << 8) | b[p + 3]) >>> 0; p += 4; return v; }
    if (ai === 27) { let v = 0; for (let i = 0; i < 8; i++) v = v * 256 + b[p++]; return v; }
    throw new Error("cbor");
  };
  function item() {
    const ib = b[p++], major = ib >> 5, ai = ib & 0x1f;
    if (major === 0) return rlen(ai);
    if (major === 1) return -1 - rlen(ai);
    if (major === 2) { const n = rlen(ai); const s = b.slice(p, p + n); p += n; return s; }
    if (major === 3) { const n = rlen(ai); const s = new TextDecoder().decode(b.slice(p, p + n)); p += n; return s; }
    if (major === 4) { const n = rlen(ai); const a = []; for (let i = 0; i < n; i++) a.push(item()); return a; }
    if (major === 5) { const n = rlen(ai); const m = {}; for (let i = 0; i < n; i++) { const k = item(); m[k] = item(); } return m; }
    if (major === 7) { if (ai === 20) return false; if (ai === 21) return true; if (ai === 22) return null; }
    throw new Error("cbor");
  }
  return item();
}
function decodeCashu(str) {
  str = (str || "").trim();
  const hex = a => Array.from(a).map(x => x.toString(16).padStart(2, "0")).join("");
  if (/^cashuA/.test(str)) {
    const bytes = _b64urlBytes(str.slice(6)); if (!bytes) return null;
    let obj; try { obj = JSON.parse(new TextDecoder().decode(bytes)); } catch { return null; }
    if (!obj || !Array.isArray(obj.token)) return null;
    const mints = [], proofs = [];
    for (const t of obj.token) { if (t.mint) mints.push(t.mint); for (const pr of (t.proofs || [])) proofs.push(pr.amount || 0); }
    return { version: 3, mints: [...new Set(mints)], unit: obj.unit || "sat", memo: obj.memo || null, count: proofs.length, total: proofs.reduce((a, x) => a + x, 0) };
  }
  if (/^cashuB/.test(str)) {
    const bytes = _b64urlBytes(str.slice(6)); if (!bytes) return null;
    let m; try { m = _cborDecode(bytes); } catch { return null; }
    if (!m || !Array.isArray(m.t)) return null;
    const proofs = [];
    for (const t of m.t) for (const pr of (t.p || [])) proofs.push(pr.a || 0);
    return { version: 4, mints: m.m ? [m.m] : [], unit: m.u || "sat", memo: m.d || null, count: proofs.length, total: proofs.reduce((a, x) => a + x, 0) };
  }
  return null;
}
function detectCashu(v) { const s = (v || "").trim(); if (!/^cashu[AB][A-Za-z0-9_-]+=*$/.test(s)) return null; return decodeCashu(s) ? "cashu" : null; }

// -- base58check (P2PKH / P2SH) --
const _B58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function _base58encode(bytes){let zeros=0;while(zeros<bytes.length&&bytes[zeros]===0)zeros++;const digits=[0];for(let i=zeros;i<bytes.length;i++){let carry=bytes[i];for(let j=0;j<digits.length;j++){carry+=digits[j]<<8;digits[j]=carry%58;carry=(carry/58)|0;}while(carry){digits.push(carry%58);carry=(carry/58)|0;}}let s="";for(let i=0;i<zeros;i++)s+="1";for(let i=digits.length-1;i>=0;i--)s+=_B58[digits[i]];return s;}
function _base58check(version,payload){const buf=new Uint8Array(1+payload.length);buf[0]=version;buf.set(payload,1);const chk=_sha256(_sha256(buf)).slice(0,4);const full=new Uint8Array(buf.length+4);full.set(buf);full.set(chk,buf.length);return _base58encode(full);}

