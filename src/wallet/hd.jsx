/* ─────────────────────────────────────────────
   BIP32 PUBLIC DERIVATION — derive a whole wallet's addresses from an xpub,
   entirely in the browser (pure-JS BigInt, no eval/WASM, no dependency). Public
   keys only: no private keys, no signing, non-hardened indices only. Reuses the
   Inspector's _sha256 / _segwitAddress / _base58check. The added primitives
   (SHA-512, HMAC-SHA512, RIPEMD-160, secp256k1 point math) are validated against
   the BIP32 Test Vector 1 (non-hardened public path) and BIP84 (zpub → the exact
   bc1q addresses) known-answer vectors in the test suite before being trusted.
───────────────────────────────────────────── */
const _M64 = (1n << 64n) - 1n;
function _sha512(bytes) {
  const K=[0x428a2f98d728ae22n,0x7137449123ef65cdn,0xb5c0fbcfec4d3b2fn,0xe9b5dba58189dbbcn,0x3956c25bf348b538n,0x59f111f1b605d019n,0x923f82a4af194f9bn,0xab1c5ed5da6d8118n,0xd807aa98a3030242n,0x12835b0145706fben,0x243185be4ee4b28cn,0x550c7dc3d5ffb4e2n,0x72be5d74f27b896fn,0x80deb1fe3b1696b1n,0x9bdc06a725c71235n,0xc19bf174cf692694n,0xe49b69c19ef14ad2n,0xefbe4786384f25e3n,0x0fc19dc68b8cd5b5n,0x240ca1cc77ac9c65n,0x2de92c6f592b0275n,0x4a7484aa6ea6e483n,0x5cb0a9dcbd41fbd4n,0x76f988da831153b5n,0x983e5152ee66dfabn,0xa831c66d2db43210n,0xb00327c898fb213fn,0xbf597fc7beef0ee4n,0xc6e00bf33da88fc2n,0xd5a79147930aa725n,0x06ca6351e003826fn,0x142929670a0e6e70n,0x27b70a8546d22ffcn,0x2e1b21385c26c926n,0x4d2c6dfc5ac42aedn,0x53380d139d95b3dfn,0x650a73548baf63den,0x766a0abb3c77b2a8n,0x81c2c92e47edaee6n,0x92722c851482353bn,0xa2bfe8a14cf10364n,0xa81a664bbc423001n,0xc24b8b70d0f89791n,0xc76c51a30654be30n,0xd192e819d6ef5218n,0xd69906245565a910n,0xf40e35855771202an,0x106aa07032bbd1b8n,0x19a4c116b8d2d0c8n,0x1e376c085141ab53n,0x2748774cdf8eeb99n,0x34b0bcb5e19b48a8n,0x391c0cb3c5c95a63n,0x4ed8aa4ae3418acbn,0x5b9cca4f7763e373n,0x682e6ff3d6b2b8a3n,0x748f82ee5defb2fcn,0x78a5636f43172f60n,0x84c87814a1f0ab72n,0x8cc702081a6439ecn,0x90befffa23631e28n,0xa4506cebde82bde9n,0xbef9a3f7b2c67915n,0xc67178f2e372532bn,0xca273eceea26619cn,0xd186b8c721c0c207n,0xeada7dd6cde0eb1en,0xf57d4f7fee6ed178n,0x06f067aa72176fban,0x0a637dc5a2c898a6n,0x113f9804bef90daen,0x1b710b35131c471bn,0x28db77f523047d84n,0x32caab7b40c72493n,0x3c9ebe0a15c9bebcn,0x431d67c49c100d4cn,0x4cc5d4becb3e42b6n,0x597f299cfc657e2an,0x5fcb6fab3ad6faecn,0x6c44198c4a475817n];
  let h=[0x6a09e667f3bcc908n,0xbb67ae8584caa73bn,0x3c6ef372fe94f82bn,0xa54ff53a5f1d36f1n,0x510e527fade682d1n,0x9b05688c2b3e6c1fn,0x1f83d9abfb41bd6bn,0x5be0cd19137e2179n];
  const l=bytes.length, bitLen=BigInt(l)*8n, withOne=l+1, pad=(112-(withOne%128)+128)%128, total=withOne+pad+16;
  const m=new Uint8Array(total); m.set(bytes); m[l]=0x80;
  for(let i=0;i<8;i++) m[total-1-i]=Number((bitLen>>BigInt(8*i))&0xffn);
  const rot=(x,n)=>((x>>n)|(x<<(64n-n)))&_M64, W=new Array(80);
  for(let off=0;off<total;off+=128){
    for(let i=0;i<16;i++){ let w=0n; for(let j=0;j<8;j++) w=(w<<8n)|BigInt(m[off+i*8+j]); W[i]=w; }
    for(let i=16;i<80;i++){ const s0=rot(W[i-15],1n)^rot(W[i-15],8n)^(W[i-15]>>7n), s1=rot(W[i-2],19n)^rot(W[i-2],61n)^(W[i-2]>>6n); W[i]=(W[i-16]+s0+W[i-7]+s1)&_M64; }
    let [a,b,c,d,e,f,g,hh]=h;
    for(let i=0;i<80;i++){ const S1=rot(e,14n)^rot(e,18n)^rot(e,41n), ch=(e&f)^((~e&_M64)&g), t1=(hh+S1+ch+K[i]+W[i])&_M64, S0=rot(a,28n)^rot(a,34n)^rot(a,39n), maj=(a&b)^(a&c)^(b&c), t2=(S0+maj)&_M64; hh=g;g=f;f=e;e=(d+t1)&_M64;d=c;c=b;b=a;a=(t1+t2)&_M64; }
    h=[(h[0]+a)&_M64,(h[1]+b)&_M64,(h[2]+c)&_M64,(h[3]+d)&_M64,(h[4]+e)&_M64,(h[5]+f)&_M64,(h[6]+g)&_M64,(h[7]+hh)&_M64];
  }
  const out=new Uint8Array(64); for(let i=0;i<8;i++) for(let j=0;j<8;j++) out[i*8+j]=Number((h[i]>>BigInt(56-8*j))&0xffn); return out;
}
function _hmacSha512(key, data) {
  const B=128; if(key.length>B) key=_sha512(key);
  const k=new Uint8Array(B); k.set(key); const ip=new Uint8Array(B), op=new Uint8Array(B);
  for(let i=0;i<B;i++){ ip[i]=k[i]^0x36; op[i]=k[i]^0x5c; }
  const cat=(a,b)=>{ const o=new Uint8Array(a.length+b.length); o.set(a); o.set(b,a.length); return o; };
  return _sha512(cat(op, _sha512(cat(ip, data))));
}
function _ripemd160(bytes) {
  const rol=(x,n)=>((x<<n)|(x>>>(32-n)))>>>0;
  const f=(j,x,y,z)=> j<16?(x^y^z): j<32?((x&y)|(~x&z)): j<48?((x|~y)^z): j<64?((x&z)|(y&~z)): (x^(y|~z));
  const K=[0x00000000,0x5a827999,0x6ed9eba1,0x8f1bbcdc,0xa953fd4e], KK=[0x50a28be6,0x5c4dd124,0x6d703ef3,0x7a6d76e9,0x00000000];
  const r=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,7,4,13,1,10,6,15,3,12,0,9,5,2,14,11,8,3,10,14,4,9,15,8,1,2,7,0,6,13,11,5,12,1,9,11,10,0,8,12,4,13,3,7,15,14,5,6,2,4,0,5,9,7,12,2,10,14,1,3,8,11,6,15,13];
  const rr=[5,14,7,0,9,2,11,4,13,6,15,8,1,10,3,12,6,11,3,7,0,13,5,10,14,15,8,12,4,9,1,2,15,5,1,3,7,14,6,9,11,8,12,2,10,0,4,13,8,6,4,1,3,11,15,0,5,12,2,13,9,7,10,14,12,15,10,4,1,5,8,7,6,2,13,14,0,3,9,11];
  const s=[11,14,15,12,5,8,7,9,11,13,14,15,6,7,9,8,7,6,8,13,11,9,7,15,7,12,15,9,11,7,13,12,11,13,6,7,14,9,13,15,14,8,13,6,5,12,7,5,11,12,14,15,14,15,9,8,9,14,5,6,8,6,5,12,9,15,5,11,6,8,13,12,5,12,13,14,11,8,5,6];
  const ss=[8,9,9,11,13,15,15,5,7,7,8,11,14,14,12,6,9,13,15,7,12,8,9,11,7,7,12,7,6,15,13,11,9,7,15,11,8,6,6,14,12,13,5,14,13,13,7,5,15,5,8,11,14,14,6,14,6,9,12,9,12,5,15,8,8,5,12,9,12,5,14,6,8,13,6,5,15,13,11,11];
  const l=bytes.length, bitLen=l*8, withOne=l+1, pad=(56-(withOne%64)+64)%64, total=withOne+pad+8;
  const m=new Uint8Array(total); m.set(bytes); m[l]=0x80; const dv=new DataView(m.buffer);
  dv.setUint32(total-8,bitLen>>>0,true); dv.setUint32(total-4,Math.floor(bitLen/0x100000000),true);
  let h0=0x67452301,h1=0xefcdab89,h2=0x98badcfe,h3=0x10325476,h4=0xc3d2e1f0; const X=new Array(16);
  for(let off=0;off<total;off+=64){
    for(let i=0;i<16;i++)X[i]=dv.getUint32(off+i*4,true);
    let a=h0,b=h1,c=h2,d=h3,e=h4,a2=h0,b2=h1,c2=h2,d2=h3,e2=h4;
    for(let j=0;j<80;j++){ const jj=(j/16)|0;
      let tt=(a+f(j,b,c,d)+X[r[j]]+K[jj])>>>0; tt=(rol(tt,s[j])+e)>>>0; a=e;e=d;d=rol(c,10);c=b;b=tt;
      let t2=(a2+f(79-j,b2,c2,d2)+X[rr[j]]+KK[jj])>>>0; t2=(rol(t2,ss[j])+e2)>>>0; a2=e2;e2=d2;d2=rol(c2,10);c2=b2;b2=t2;
    }
    const tmp=(h1+c+d2)>>>0; h1=(h2+d+e2)>>>0; h2=(h3+e+a2)>>>0; h3=(h4+a+b2)>>>0; h4=(h0+b+c2)>>>0; h0=tmp;
  }
  const out=new Uint8Array(20), odv=new DataView(out.buffer); [h0,h1,h2,h3,h4].forEach((hv,i)=>odv.setUint32(i*4,hv>>>0,true)); return out;
}
function _hash160(b) { return _ripemd160(_sha256(b)); }

// base58check DECODE (the Inspector added ENCODE only)
const _B58MAP = (() => { const m = {}; for (let i=0;i<_B58.length;i++) m[_B58[i]]=i; return m; })();
function _base58decode(str) {
  let z=0; while(z<str.length && str[z]==="1") z++;
  const bytes=[0];
  for(let i=z;i<str.length;i++){ const c=_B58MAP[str[i]]; if(c===undefined) throw new Error("invalid base58"); let carry=c; for(let j=0;j<bytes.length;j++){ carry+=bytes[j]*58; bytes[j]=carry&0xff; carry>>=8; } while(carry){ bytes.push(carry&0xff); carry>>=8; } }
  const out=new Uint8Array(z+bytes.length); for(let i=0;i<bytes.length;i++) out[z+i]=bytes[bytes.length-1-i]; return out;
}
function _base58checkDecode(str) {
  const full=_base58decode(str); if(full.length<5) throw new Error("too short");
  const body=full.slice(0,full.length-4), chk=full.slice(full.length-4), calc=_sha256(_sha256(body)).slice(0,4);
  for(let i=0;i<4;i++) if(chk[i]!==calc[i]) throw new Error("bad checksum");
  return body;
}

// secp256k1 (affine, a=0 b=7) — public-key math only
const _ecP=0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2Fn;
const _ecN=0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141n;
const _ecG={x:0x79BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798n,y:0x483ADA7726A3C4655DA4FBFC0E1108A8FD17B448A68554199C47D08FFB10D4B8n};
const _ecMod=(a)=>{ a%=_ecP; return a<0n?a+_ecP:a; };
function _modpow(b,e,m){ b=((b%m)+m)%m; let r=1n; while(e>0n){ if(e&1n) r=(r*b)%m; b=(b*b)%m; e>>=1n; } return r; }
const _modinv=(a)=>_modpow(_ecMod(a),_ecP-2n,_ecP);
function _ptDouble(A){ if(!A) return null; const s=_ecMod((3n*A.x*A.x)*_modinv(2n*A.y)); const x=_ecMod(s*s-2n*A.x); return {x,y:_ecMod(s*(A.x-x)-A.y)}; }
function _ptAdd(A,B){ if(!A) return B; if(!B) return A; if(A.x===B.x){ if(_ecMod(A.y+B.y)===0n) return null; return _ptDouble(A); } const s=_ecMod((B.y-A.y)*_modinv(B.x-A.x)); const x=_ecMod(s*s-A.x-B.x); return {x,y:_ecMod(s*(A.x-x)-A.y)}; }
function _ptMul(k,Pt){ let r=null,a=Pt; while(k>0n){ if(k&1n) r=_ptAdd(r,a); a=_ptDouble(a); k>>=1n; } return r; }
const _beToBig=(b)=>{ let v=0n; for(const x of b) v=(v<<8n)|BigInt(x); return v; };
const _bigTo32=(v)=>{ const o=new Uint8Array(32); for(let i=31;i>=0;i--){ o[i]=Number(v&0xffn); v>>=8n; } return o; };
function _decompressPt(pub33){ const prefix=pub33[0]; const x=_beToBig(pub33.slice(1,33)); const rhs=_ecMod(x*x*x+7n); let y=_modpow(rhs,(_ecP+1n)/4n,_ecP); if((y&1n)!==BigInt(prefix&1)) y=_ecMod(-y); if(_ecMod(y*y)!==rhs) throw new Error("point not on curve"); return {x,y}; }
function _compressPt(pt){ const o=new Uint8Array(33); o[0]=(pt.y&1n)===0n?0x02:0x03; o.set(_bigTo32(pt.x),1); return o; }

// SLIP-132 version → scriptType; derivation math is identical for all three.
const SLIP132 = { 0x0488b21e: "p2pkh", 0x049d7cb2: "p2sh-p2wpkh", 0x04b24746: "p2wpkh" };
function decodeXpub(str) {
  const p = _base58checkDecode(str.trim());
  if (p.length !== 78) throw new Error("Not an extended public key");
  const version = ((p[0]<<24)|(p[1]<<16)|(p[2]<<8)|p[3]) >>> 0;
  const scriptType = SLIP132[version];
  const keyData = p.slice(45, 78);
  if (!scriptType) throw new Error("Unsupported key — paste an xpub, ypub, or zpub (mainnet)");
  if (keyData[0] !== 0x02 && keyData[0] !== 0x03) throw new Error("That's a private key (xprv). Never paste a private key — use the public xpub/ypub/zpub.");
  return { version, scriptType, depth: p[4], childNumber: ((p[9]<<24)|(p[10]<<16)|(p[11]<<8)|p[12])>>>0, chainCode: p.slice(13, 45), keyData };
}
function _ser32(i) { return new Uint8Array([(i>>>24)&0xff,(i>>>16)&0xff,(i>>>8)&0xff,i&0xff]); }
function ckdPub(pub33, cc32, i) {
  if (i >= 0x80000000) return null;   // hardened is impossible from a public key — skip
  const data = new Uint8Array(37); data.set(pub33); data.set(_ser32(i), 33);
  const I = _hmacSha512(cc32, data), IL = I.slice(0, 32), IR = I.slice(32, 64);
  const ILint = _beToBig(IL);
  if (ILint >= _ecN) return null;                       // invalid — caller skips this index
  const child = _ptAdd(_ptMul(ILint, _ecG), _decompressPt(pub33));
  if (!child) return null;
  return { pub33: _compressPt(child), cc32: IR };
}
function deriveWalletAddress(pub33, scriptType) {
  const h = _hash160(pub33);
  if (scriptType === "p2pkh") return _base58check(0x00, h);
  if (scriptType === "p2sh-p2wpkh") { const redeem = new Uint8Array(22); redeem[0]=0x00; redeem[1]=0x14; redeem.set(h, 2); return _base58check(0x05, _hash160(redeem)); }
  return _segwitAddress(0, h);   // p2wpkh
}
function detectXpub(v) {
  const s = (v || "").trim();
  return /^(xpub|ypub|zpub)[1-9A-HJ-NP-Za-km-z]{100,116}$/.test(s) ? "xpub" : null;
}

/* ─────────────────────────────────────────────
   WALLET SCANNER + ENGINE — gap-limit scan a whole wallet from its xpub and
   score it at the WALLET level (not per address). Reuses the single-address
   detectors on a txid-deduped combined set, and adds the checks only a
   wallet-wide view can see (true address reuse, cross-address common-input
   linkage). Every derived address is fetched as an ordinary single-address
   lookup, so the relay/explorer path is unchanged.
───────────────────────────────────────────── */
// Cheap probe — the address summary only (chain_stats), for gap-limit detection.
async function fetchAddrInfo(addr) {
  const exp = explorer();
  const base = relayOn() ? RELAY_URL + exp.relayPath : exp.api;
  const r = await fetch(`${base}/address/${encodeURIComponent(addr)}`);
  if (!r.ok) throw new Error("Address lookup failed");
  return r.json();
}

async function scanXpub(xpub, opts = {}) {
  const onProgress = opts.onProgress || (() => {});
  const node = decodeXpub(xpub);
  const GAP = 20, CAP = 100;              // gap limit + hard per-branch cap
  const addresses = [];
  let derived = 0, capHit = false;
  for (const branch of [0, 1]) {          // 0 = receive, 1 = change
    const b = ckdPub(node.keyData, node.chainCode, branch);
    if (!b) continue;
    let gap = 0, i = 0;
    while (gap < GAP && i < CAP) {         // CAP is PER-BRANCH so a big receive chain can't starve change
      const child = ckdPub(b.pub33, b.cc32, i);
      if (!child) { i++; continue; }
      const address = deriveWalletAddress(child.pub33, node.scriptType);
      derived++;
      onProgress({ derived, branch, used: addresses.length });
      const info = await fetchAddrInfo(address);
      const cs = info.chain_stats || {};
      if ((cs.tx_count || 0) > 0) {
        gap = 0;
        // First page only. A gap-limit scan already does one summary plus one
        // full fetch per used address; paging each of those to 250 txs would
        // fan out into hundreds of explorer calls. Reuse is judged from
        // chain_stats on the summary, which is complete without the pages.
        const full = await fetchAddress(address, { pageCap: 1, txCap: 30 });
        (full.utxos || []).forEach(u => { u.address = address; });
        addresses.push({ address, branch, index: i, chain_stats: cs, utxos: full.utxos || [], txs: full.txs || [] });
      } else gap++;
      i++;
    }
    if (i >= CAP) capHit = true;
  }
  return { scriptType: node.scriptType, addresses, derived, capHit };
}

function runWalletEngine(scan) {
  const addrs = scan.addresses || [];
  const ownAddrs = new Set(addrs.map(a => a.address));
  const utxos = addrs.flatMap(a => a.utxos || []);
  const balance = utxos.reduce((s, u) => s + (u.value || 0), 0);
  const stats = { addresses: scan.derived || addrs.length, used: addrs.length, reused: 0, balance };

  if (addrs.length === 0) {
    return { score: null, grade: "—", riskLabel: "No history", riskColor: T.textDim, checks: [], recommendations: [], stats, isEmpty: true, capHit: scan.capHit };
  }

  // Dedupe transactions by txid (a self-send touches >=2 scanned addresses).
  const txMap = new Map();
  addrs.forEach(a => (a.txs || []).forEach(tx => { if (tx.txid && !txMap.has(tx.txid)) txMap.set(tx.txid, tx); }));
  const txs = [...txMap.values()];
  const spentByMe = tx => (tx.vin || []).some(v => v.prevout && ownAddrs.has(v.prevout.scriptpubkey_address));

  // True reuse = an address that RECEIVED more than once (funded_txo_count>=2).
  // tx_count>=2 alone is the normal receive-then-spend lifecycle and is NOT reuse.
  const reusedAddrs = addrs.filter(a => (a.chain_stats.funded_txo_count || 0) >= 2);
  stats.reused = reusedAddrs.length;

  // Cross-address common-input: a tx whose inputs span >=2 of the wallet's own
  // addresses — the chain provably tying your addresses to one owner.
  const linkTxs = txs.filter(tx => new Set((tx.vin || []).map(v => v.prevout && v.prevout.scriptpubkey_address).filter(a => ownAddrs.has(a))).size >= 2);
  const consolidations = txs.filter(tx => spentByMe(tx) && (tx.vin || []).length >= 4 && (tx.vout || []).length <= 2);
  const coinjoins = txs.filter(tx => isCoinJoinShape(tx.vin, tx.vout));
  const dustU = utxos.filter(u => isDustSat(u.value));
  const roundU = utxos.filter(u => isRoundSat(u.value));
  const largest = utxos.reduce((m, u) => Math.max(m, u.value || 0), 0);
  const concentrated = balance > 0 && largest / balance > 0.9 && addrs.length > 1;

  let score = 100;
  const checks = [];
  const add = (key, name, status, detail, plain, sev, pts) => { checks.push({ key, name, status, detail, plain, sev, pts }); score += pts; };

  if (reusedAddrs.length >= 3)      add("reuse", "Address Reuse", "fail", `${reusedAddrs.length} of your addresses were reused (received more than once)`, "Reusing an address links all its payments. Several of your addresses received more than once.", "high", -22);
  else if (reusedAddrs.length)      add("reuse", "Address Reuse", "warn", `${reusedAddrs.length} address${reusedAddrs.length > 1 ? "es" : ""} reused`, "One or two addresses received more than once — use a fresh address every time.", "medium", -8);
  else                             add("reuse", "Address Reuse", "pass", "Every address received at most once", "No reuse — your wallet uses a fresh address per payment. This is the single most important habit.", "clean", 0);

  if (linkTxs.length)               add("cluster", "Address Linkage", "fail", `${linkTxs.length} transaction${linkTxs.length > 1 ? "s" : ""} co-spend from ${linkTxs.length > 1 ? "several" : "two"} of your addresses`, "When one transaction spends from two of your addresses, the chain proves they share one owner — collapsing your wallet into a single cluster.", "high", -18);
  else                             add("cluster", "Address Linkage", "pass", "No transaction links your addresses together", "None of your spends co-spend from multiple of your addresses, so the chain can't merge them via the common-input heuristic.", "clean", 0);

  if (coinjoins.length)             add("cj", "CoinJoin", "pass", `${coinjoins.length} CoinJoin${coinjoins.length > 1 ? "s" : ""} in this wallet`, "This wallet has used CoinJoin — the strongest break in the transaction graph.", "clean", +8);
  else                             add("cj", "CoinJoin", "warn", "No CoinJoin — history is fully linkable", "Nothing in this wallet breaks the transaction graph. A CoinJoin (or Payjoin on payments) is the highest-impact fix.", "medium", -6);

  if (consolidations.length)        add("cons", "Unsafe Consolidation", "warn", `${consolidations.length} consolidation${consolidations.length > 1 ? "s" : ""} merge coins`, "Merging many inputs into one output links those coins' histories permanently. Use coin control to keep sources separate.", "medium", -6);
  else                             add("cons", "Unsafe Consolidation", "pass", "No risky consolidations", "You haven't merged coins from different sources into one output.", "clean", 0);

  if (dustU.length)                 add("dust", "Dust", "warn", `${dustU.length} dust output${dustU.length > 1 ? "s" : ""} in the wallet`, "Sub-1000-sat outputs are often tracking beacons. Freeze them — never spend them.", "medium", -8);
  else                             add("dust", "Dust", "pass", "No dust outputs", "No suspicious tiny outputs found across the wallet.", "clean", 0);

  if (roundU.length)                add("round", "Round Amounts", "warn", `${roundU.length} round-amount output${roundU.length > 1 ? "s" : ""}`, "Round amounts fingerprint KYC-exchange withdrawals.", "low", -4);
  if (concentrated)                 add("conc", "Balance Concentration", "warn", "90%+ of the balance is in one output", "Nearly all your Bitcoin sits in a single output — every spend reveals almost your whole balance.", "medium", -5);

  score = Math.max(0, Math.min(100, Math.round(score)));

  const recs = [];
  const R = (icon, action, plain, impact, effort, tools) => recs.push({ icon, action, plain, detail: plain, impact, effort, tools });
  if (reusedAddrs.length) R("🔄", "Use a fresh address every time", "Reusing an address links all its payments. Let your wallet generate a new receive address for each payment, or publish a Silent Payment (sp1…) so a single shareable string derives a fresh address per sender.", 15, "Easy", [{ name: "Sparrow Wallet", note: "" }, { name: "Cake Wallet", note: "Silent Payments" }]);
  if (linkTxs.length || consolidations.length) R("⚗️", "Use coin control — don't merge sources", "Combining coins from different addresses links them forever. Select inputs manually and keep KYC and non-KYC coins in separate wallets.", 12, "Medium", [{ name: "Sparrow Wallet", note: "best-in-class coin control" }]);
  if (!coinjoins.length) R("🔀", "Break the graph with CoinJoin / Payjoin", "Nothing in this wallet breaks the transaction graph. A CoinJoin round or Payjoin on ordinary payments makes the common-input heuristic fail.", 18, "Medium", [{ name: "Wasabi Wallet", note: "" }, { name: "Joinmarket", note: "" }]);
  if (dustU.length) R("🧊", "Freeze your dust", "Those tiny outputs may be tracking beacons. Mark them do-not-spend so they're never pulled into a transaction.", 9, "Easy", [{ name: "Sparrow Wallet", note: "right-click → Freeze" }]);
  recs.sort((a, b) => b.impact - a.impact);

  return { score, grade: scoreGrade(score), riskLabel: scoreLabel(score), riskColor: scoreColor(score), checks, recommendations: recs.slice(0, 5), stats, isEmpty: false, capHit: scan.capHit, perAddress: addrs };
}

// Offline demo wallet (zero network): the three real BIP84 addresses, with a
// reused address, a cross-address link tx, and a dust output — fed straight to
// runWalletEngine by the "Load example" button.
const _DA = ["bc1qcr8te4kr609gcawutmrza0j4xv80jy8z306fyu", "bc1qnjg0jd8228aq7egyzacy8cys3knf9xvrerkf9g", "bc1q8c6fshw2dlwun7ekn9qwf37cu2rn755upcp6el"];
const DEMO_WALLET = {
  scriptType: "p2wpkh", derived: 26, capHit: false,
  addresses: [
    { address: _DA[0], branch: 0, index: 0, chain_stats: { tx_count: 3, funded_txo_count: 2, spent_txo_count: 1 },
      utxos: [{ txid: "w1", value: 4200000, address: _DA[0] }],
      txs: [{ txid: "link1", vin: [{ prevout: { scriptpubkey_address: _DA[0] } }, { prevout: { scriptpubkey_address: _DA[1] } }], vout: [{ value: 6100000, scriptpubkey_address: "bc1qexternalpayee000000000000000000000000" }], fee: 600, size: 200 }] },
    { address: _DA[1], branch: 0, index: 1, chain_stats: { tx_count: 2, funded_txo_count: 1, spent_txo_count: 1 },
      utxos: [{ txid: "w2", value: 546, address: _DA[1] }],
      txs: [{ txid: "link1" }, { txid: "d1", vin: [{ prevout: { scriptpubkey_address: "bc1qtracker00000000000000000000000000000" } }], vout: [{ value: 546, scriptpubkey_address: _DA[1] }], fee: 200, size: 150 }] },
    { address: _DA[2], branch: 1, index: 0, chain_stats: { tx_count: 1, funded_txo_count: 1, spent_txo_count: 0 },
      utxos: [{ txid: "w3", value: 3000000, address: _DA[2] }], txs: [] },
  ],
};

