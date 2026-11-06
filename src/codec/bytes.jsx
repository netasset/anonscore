/* ─────────────────────────────────────────────
   TRANSACTION INSPECTOR — parse a PSBT / raw tx entirely in the browser and
   analyze what it will leak BEFORE it's broadcast. Pure-JS (no eval/WASM, so
   CSP-clean; no dependency). PSBTs embed their input UTXO data, so a PSBT is
   analyzed with ZERO network — the transaction never leaves the browser.
   Parser + encoders validated against BIP174 / BIP173 / BIP350 test vectors.
───────────────────────────────────────────── */

// -- byte helpers --
function _hexToBytes(h) {
  h = (h || "").trim().replace(/^0x/i, "");
  if (h.length % 2) throw new Error("odd-length hex");
  const out = new Uint8Array(h.length / 2);
  for (let i = 0; i < out.length; i++) {
    const b = parseInt(h.substr(i * 2, 2), 16);
    if (Number.isNaN(b)) throw new Error("invalid hex");
    out[i] = b;
  }
  return out;
}
function _bytesToHex(b) { let s = ""; for (const x of b) s += x.toString(16).padStart(2, "0"); return s; }
function _base64ToBytes(b64) {
  const bin = atob((b64 || "").trim());
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

// -- pure-JS SHA-256 (for base58check + double-SHA256; SubtleCrypto is async
//    and unusable in synchronous parse/render) --
function _sha256(bytes) {
  const K = [0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
  let h0=0x6a09e667,h1=0xbb67ae85,h2=0x3c6ef372,h3=0xa54ff53a,h4=0x510e527f,h5=0x9b05688c,h6=0x1f83d9ab,h7=0x5be0cd19;
  const l = bytes.length, bitLen = l * 8, withOne = l + 1;
  const pad = (56 - (withOne % 64) + 64) % 64, total = withOne + pad + 8;
  const m = new Uint8Array(total); m.set(bytes); m[l] = 0x80;
  const dv = new DataView(m.buffer);
  dv.setUint32(total - 4, bitLen >>> 0);
  dv.setUint32(total - 8, Math.floor(bitLen / 0x100000000));
  const w = new Int32Array(64), rotr = (x, n) => (x >>> n) | (x << (32 - n));
  for (let off = 0; off < total; off += 64) {
    for (let i = 0; i < 16; i++) w[i] = dv.getUint32(off + i * 4);
    for (let i = 16; i < 64; i++) {
      const s0 = rotr(w[i-15],7) ^ rotr(w[i-15],18) ^ (w[i-15] >>> 3);
      const s1 = rotr(w[i-2],17) ^ rotr(w[i-2],19) ^ (w[i-2] >>> 10);
      w[i] = (w[i-16] + s0 + w[i-7] + s1) | 0;
    }
    let a=h0,b=h1,c=h2,d=h3,e=h4,f=h5,g=h6,h=h7;
    for (let i = 0; i < 64; i++) {
      const S1 = rotr(e,6) ^ rotr(e,11) ^ rotr(e,25), ch = (e & f) ^ (~e & g);
      const t1 = (h + S1 + ch + K[i] + w[i]) | 0;
      const S0 = rotr(a,2) ^ rotr(a,13) ^ rotr(a,22), maj = (a & b) ^ (a & c) ^ (b & c);
      const t2 = (S0 + maj) | 0;
      h=g; g=f; f=e; e=(d + t1)|0; d=c; c=b; b=a; a=(t1 + t2)|0;
    }
    h0=(h0+a)|0;h1=(h1+b)|0;h2=(h2+c)|0;h3=(h3+d)|0;h4=(h4+e)|0;h5=(h5+f)|0;h6=(h6+g)|0;h7=(h7+h)|0;
  }
  const out = new Uint8Array(32), odv = new DataView(out.buffer);
  [h0,h1,h2,h3,h4,h5,h6,h7].forEach((hv, i) => odv.setUint32(i * 4, hv >>> 0));
  return out;
}

// -- bech32 / bech32m (BIP173 / BIP350); pure data, no secp256k1 --
const _BECH = "qpzry9x8gf2tvdw0s3jn54khce6mua7l";
function _bechPolymod(v){let chk=1;const G=[0x3b6a57b2,0x26508e6d,0x1ea119fa,0x3d4233dd,0x2a1462b3];for(const x of v){const b=chk>>25;chk=((chk&0x1ffffff)<<5)^x;for(let i=0;i<5;i++)if((b>>i)&1)chk^=G[i];}return chk;}
function _hrpExpand(hrp){const r=[];for(let i=0;i<hrp.length;i++)r.push(hrp.charCodeAt(i)>>5);r.push(0);for(let i=0;i<hrp.length;i++)r.push(hrp.charCodeAt(i)&31);return r;}
function _bechChecksum(hrp,data,spec){const C=spec==="bech32m"?0x2bc830a3:1;const v=_hrpExpand(hrp).concat(data).concat([0,0,0,0,0,0]);const pm=_bechPolymod(v)^C;const r=[];for(let i=0;i<6;i++)r.push((pm>>(5*(5-i)))&31);return r;}
function _bechEncode(hrp,data,spec){const c=data.concat(_bechChecksum(hrp,data,spec));let s=hrp+"1";for(const d of c)s+=_BECH[d];return s;}
function _convertBits(data,from,to,pad){let acc=0,bits=0;const r=[];const maxv=(1<<to)-1;for(const val of data){acc=((acc<<from)|val)&0xffffffff;bits+=from;while(bits>=to){bits-=to;r.push((acc>>bits)&maxv);}}if(pad&&bits)r.push((acc<<(to-bits))&maxv);return r;}
function _segwitAddress(version,program){const data=[version].concat(_convertBits(Array.from(program),8,5,true));return _bechEncode("bc",data,version===0?"bech32":"bech32m");}
// bech32 / bech32m DECODE (checksum-verified) → { hrp, data(5-bit, no checksum),
// spec } or null. No 90-char cap (BIP352 addresses run 117+ chars).
const _BECHKEY = (() => { const m = {}; for (let i = 0; i < _BECH.length; i++) m[_BECH[i]] = i; return m; })();
function _bech32Decode(str) {
  if (typeof str !== "string" || str.length < 8 || str.length > 1023) return null;
  const low = str.toLowerCase(), up = str.toUpperCase();
  if (str !== low && str !== up) return null;                 // mixed case is invalid
  str = low;
  const pos = str.lastIndexOf("1");
  if (pos < 1 || pos + 7 > str.length) return null;
  const hrp = str.slice(0, pos), vals = [];
  for (const c of str.slice(pos + 1)) { const v = _BECHKEY[c]; if (v === undefined) return null; vals.push(v); }
  const poly = _bechPolymod(_hrpExpand(hrp).concat(vals));
  const spec = poly === 1 ? "bech32" : poly === 0x2bc830a3 ? "bech32m" : null;
  if (!spec) return null;
  return { hrp, data: vals.slice(0, -6), spec };
}

