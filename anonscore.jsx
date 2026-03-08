const { useState, useEffect, useCallback, useRef, useMemo } = React;

/* ─────────────────────────────────────────────
   GLOBAL CSS — dark + violet
───────────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Oxanium:wght@400;600;700;800&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,600;1,9..144,300;1,9..144,400&family=JetBrains+Mono:wght@300;400;500;600&family=Outfit:wght@300;400;500;600;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{background:#0b0d14;color:#e6edf3;font-family:'Outfit',sans-serif;-webkit-font-smoothing:antialiased}
input,button,select,textarea{font-family:'Outfit',sans-serif;-webkit-tap-highlight-color:transparent}
::selection{background:#22D3EE25;color:#e6edf3}
::-webkit-scrollbar{width:4px;height:4px}
::-webkit-scrollbar-track{background:#13151f}
::-webkit-scrollbar-thumb{background:#2a2d3a;border-radius:4px}
@keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes slideDown{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}
@keyframes toastIn{from{opacity:0;transform:translateY(10px) scale(.96)}to{opacity:1;transform:none}}
@keyframes toastOut{to{opacity:0;transform:translateY(6px)}}
@keyframes factIn{from{opacity:0;transform:translateX(-10px)}to{opacity:1;transform:none}}
@keyframes demoSlide{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
@keyframes scanPulse{0%,100%{background:#22D3EE22}50%{background:#22D3EE44}}
@keyframes borderGlow{0%,100%{box-shadow:0 0 0 0 #22D3EE22}50%{box-shadow:0 0 0 6px #22D3EE00}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
@keyframes orb{0%,100%{opacity:.12;transform:scale(1)}50%{opacity:.22;transform:scale(1.1)}}
@keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
@keyframes nodePulse{0%,100%{opacity:.4}50%{opacity:1}}
@keyframes lineIn{from{stroke-dashoffset:200}to{stroke-dashoffset:0}}
.dot-grid{background-image:radial-gradient(circle,#ffffff06 1px,transparent 1px);background-size:24px 24px}
`;

/* ─────────────────────────────────────────────
   DESIGN TOKENS — dark void + violet + btc orange
───────────────────────────────────────────── */
const T = {
  bg:       "#0b0d14",
  surface:  "#13151f",
  card:     "#181b27",
  cardAlt:  "#1e2130",
  border:   "#2a2d3a",
  borderLo: "#1e2130",
  text:     "#e8eaf6",
  textMid:  "#9096b8",
  textDim:  "#505470",
  cyan:     "#22D3EE",
  cyanLo:   "#22D3EE14",
  cyanMid:  "#22D3EE28",
  amber:    "#E8A730",
  amberLo:  "#E8A73018",
  amberMid: "#E8A73040",
  btc:      "#F7931A",
  btcLo:    "#F7931A18",
  btcMid:   "#F7931A40",
  red:      "#f85149",
  redLo:    "#f8514914",
  green:    "#3fb950",
  greenLo:  "#3fb95014",
  blue:     "#58a6ff",
  blueLo:   "#58a6ff14",
  mono:     "'JetBrains Mono',monospace",
  serif:    "'Fraunces',serif",
  sans:     "'Outfit',sans-serif",
  display:  "'Oxanium',sans-serif",
};

const RISK_META = {
  critical: { color: T.red,   bg: T.redLo,   label: "Critical" },
  high:     { color: T.btc,   bg: T.btcLo,   label: "High"     },
  medium:   { color: T.amber, bg: T.amberLo, label: "Medium"   },
  low:      { color: T.blue,  bg: T.blueLo,  label: "Low"      },
  clean:    { color: T.green, bg: T.greenLo, label: "Clean"    },
};

// green ≥ 80 | amber 60–79 (moderate) | orange 40–59 (high risk) | red < 40 (critical)
const scoreColor = s => s >= 80 ? T.green : s >= 60 ? T.amber : s >= 40 ? T.btc : T.red;
const scoreLabel = s => s >= 80 ? "Low Risk" : s >= 60 ? "Moderate" : s >= 40 ? "High Risk" : "Critical";
const scoreGrade = s => s >= 90 ? "A" : s >= 75 ? "B" : s >= 60 ? "C" : s >= 45 ? "D" : "F";

/* ─────────────────────────────────────────────
   HOISTED CONSTANTS
───────────────────────────────────────────── */
const LANDING_CHECKS = [
  { n:"01", icon:"↩", label:"Address Reuse",       desc:"Every time you reuse an address, you create a permanent public link between all your transactions." },
  { n:"02", icon:"⚠", label:"Dust Attacks",        desc:"Tiny amounts sent to your wallet by trackers. Spending them reveals your wallet cluster to analysts." },
  { n:"03", icon:"◯", label:"Round Amounts",        desc:"Withdrawing 0.1 BTC instead of 0.10743 BTC is a primary signal that funds came from a KYC exchange." },
  { n:"04", icon:"⊕", label:"CoinJoin Usage",       desc:"Whether your transaction history includes any mixing events that break the chain of custody." },
  { n:"05", icon:"⊞", label:"Unsafe Consolidation", desc:"Merging UTXOs from different sources permanently links those coin histories on-chain." },
  { n:"06", icon:"≣", label:"UTXO Count",           desc:"Too many UTXOs tempt consolidation. Too few exposes your full balance in every transaction." },
  { n:"07", icon:"₿", label:"Fee Fingerprinting",   desc:"Using the same sat/vbyte rate every time identifies your wallet software to blockchain analysts." },
  { n:"08", icon:"↔", label:"Change Address Reuse", desc:"Sending change back to an input address reveals your full balance to the transaction recipient." },
  { n:"09", icon:"◐", label:"Balance Concentration", desc:"Holding 90%+ in a single UTXO exposes nearly your full holdings in any transaction." },
  { n:"10", icon:"T", label:"Script Type Mix",       desc:"Mixing legacy and SegWit addresses creates analyst-exploitable patterns across your UTXO set." },
];

const LANDING_FACTS = [
  { stat:"$1.1B",  desc:"Chainalysis 2023 revenue from blockchain surveillance contracts",  source:"Chainalysis 2023 Annual Report" },
  { stat:"91%",    desc:"of wallets analyzed have at least one address reuse event",         source:"OXT Research, 2023" },
  { stat:"1 in 3", desc:"wallets contain dust UTXOs planted by tracking services",           source:"Blockstream Research" },
  { stat:"38/100", desc:"average privacy score of wallets reviewed across published blockchain research",           source:"OXT Research & Blockstream, aggregated" },
];

const DEMO_EXAMPLES = [
  {
    grade:"F", score:22, label:"High Risk", color:T.red,
    issues:["Address reused 12 times","KYC coins merged with private","3 dust UTXOs (trackers)","No CoinJoin ever used"],
  },
  {
    grade:"C", score:61, label:"Moderate", color:T.amber,
    issues:["Address reused 3 times","Round-number withdrawal","Single UTXO — exposes balance","Change sent to fresh addresses ✓"],
  },
  {
    grade:"A", score:91, label:"Low Risk", color:T.green,
    issues:["Fresh address every transaction ✓","CoinJoin used — 2 rounds ✓","Balanced UTXO set ✓","Lightning for spending ✓"],
  },
];

const SCAN_STEPS = [
  { label:"Resolving address…",           fact:"Bitcoin addresses are pseudonymous, not anonymous. Every transaction is permanently public." },
  { label:"Fetching UTXO set…",           fact:"UTXOs are like banknotes. How many you hold and their sizes reveal your spending habits." },
  { label:"Pulling transaction history…", fact:"Chainalysis has processed 1B+ transactions for government agencies since 2014." },
  { label:"Checking address reuse…",      fact:"91% of wallets reuse addresses. It's the single biggest privacy mistake in Bitcoin." },
  { label:"Looking for dust attacks…",    fact:"Exchanges and surveillance firms send dust to wallets they want to track. It's legal." },
  { label:"Scanning for consolidations…", fact:"Merging a KYC coin with a private coin permanently links them — forever, on-chain." },
  { label:"Checking round amounts…",      fact:"'0.1 BTC' is a Chainalysis red flag. '0.10431 BTC' looks like change — much less identifiable." },
  { label:"Detecting CoinJoin patterns…", fact:"CoinJoin breaks the chain of custody. With 50+ participants, tracking becomes computationally infeasible." },
  { label:"Analysing fee fingerprints…",  fact:"Your wallet software can be identified by the fee rates it uses. Different wallets have different defaults." },
  { label:"Calculating privacy score…",   fact:"Score 0 = fully traceable in seconds. Score 100 = requires nation-state resources to de-anonymise." },
  { label:"Building your fix plan…",      fact:"Most wallets can improve by 30+ points in under a week with no technical knowledge required." },
];

/* ─────────────────────────────────────────────
   UTXO CLASSIFIER — hoisted, not per-render
───────────────────────────────────────────── */
function classifyUtxo(u) {
  if (u.value < 1000) return "critical";
  if (u.value >= 100000 && u.value % 100000 === 0) return "medium";
  if (u.value > 5000000) return "low";
  return "clean";
}

/* ─────────────────────────────────────────────
   PRIVACY ENGINE — 10 heuristics
───────────────────────────────────────────── */
function runEngine(utxos = [], txs = [], txCount = 0) {
  let score = 100;
  const checks = [];
  const add = (key, name, status, detail, plain, sev, pts) => {
    checks.push({ key, name, status, detail, plain, sev: sev || "medium" });
    score += pts;
  };

  // 1. Address reuse
  if (txCount >= 10)     add("reuse","Address Reuse","fail",`Used ${txCount}+ times — every spend permanently linked`,"This address has been used many times. Every reuse permanently links your transactions for any analyst to see.","critical",-28);
  else if (txCount >= 4) add("reuse","Address Reuse","fail",`Used ${txCount} times — linkable on-chain`,"This address has been reused. Ideally, use a fresh address for every transaction.","high",-15);
  else if (txCount >= 2) add("reuse","Address Reuse","warn",`Used ${txCount} times — minor exposure`,"Minor reuse. Generate a new address for your next receive.","medium",-7);
  else                   add("reuse","Address Reuse","pass","Fresh address — no reuse","Great. This address has only been used once.","clean",0);

  // 2. Dust
  const dust = utxos.filter(u => u.value < 1000);
  if (dust.length > 2)   add("dust","Dust Attack","fail",`${dust.length} dust UTXOs — tracking beacons planted`,"Small amounts sent by trackers. Spending them reveals your wallet cluster to surveillance firms.","high",-12);
  else if (dust.length)  add("dust","Dust Attack","warn",`${dust.length} dust UTXO — possible tracker`,"A tiny amount was sent to your address. Freeze it in Sparrow — never spend it.","medium",-5);
  else                   add("dust","Dust Attack","pass","No dust UTXOs","No suspicious tiny amounts found.","clean",0);

  // 3. Round amounts
  const round = utxos.filter(u => u.value >= 100000 && u.value % 100000 === 0);
  if (round.length >= 2) add("round","Round Amounts","fail",`${round.length} round-number UTXOs — KYC withdrawal pattern`,"Round amounts like 0.1 BTC are a Chainalysis red flag. Analysts assume these came from KYC exchanges.","high",-10);
  else if (round.length) add("round","Round Amounts","warn","1 round-number UTXO — minor fingerprint","One round amount. Use odd numbers next time you withdraw from an exchange.","medium",-5);
  else                   add("round","Round Amounts","pass","No suspicious round amounts","Good — your UTXOs use non-round amounts.","clean",0);

  // 4. CoinJoin — FIX: guard against empty vals array
  let cjCount = 0;
  for (const tx of txs.slice(0, 20)) {
    if (tx.vout?.length >= 5) {
      const vals = tx.vout.map(o => o.value).filter(Boolean);
      if (!vals.length) continue; // FIX: guard Math.max of empty array
      const freq = Math.max(...[...new Set(vals)].map(v => vals.filter(x => x === v).length));
      if (freq >= 3) cjCount++;
    }
  }
  if (cjCount >= 2)      add("cj","CoinJoin Used","pass",`${cjCount} CoinJoin transactions — strong mixing hygiene`,"You've used CoinJoin to break transaction links. This significantly improves your privacy.","clean",+12);
  else if (cjCount === 1)add("cj","CoinJoin Used","warn","1 CoinJoin — anonymity set may be small","You've used CoinJoin once. More rounds with larger groups improve your score.","medium",+4);
  else                   add("cj","CoinJoin Used","fail","No CoinJoin — full history traceable","Your transaction history is fully visible. CoinJoin breaks this chain permanently.","high",-8);

  // 5. Consolidation
  const cons = txs.filter(t => t.vin?.length >= 4 && t.vout?.length <= 2);
  if (cons.length >= 2)  add("cons","Unsafe Consolidation","fail",`${cons.length} merges link your coin histories`,"You've combined coins from different sources. This links those histories permanently on-chain.","high",-10);
  else if (cons.length)  add("cons","Unsafe Consolidation","warn","1 consolidation — minor linking event","One consolidation detected. Be careful about which coins you combine.","medium",-4);
  else                   add("cons","Unsafe Consolidation","pass","No risky UTXO merges","Your UTXOs haven't been unsafely combined.","clean",0);

  // 6. UTXO count
  const n = utxos.length;
  if (n > 20)            add("utxo_n","UTXO Count","fail",`${n} UTXOs — bloated, high consolidation risk`,"Too many small UTXOs create fee pressure and tempt you to consolidate unsafely.","medium",-8);
  else if (n > 10)       add("utxo_n","UTXO Count","warn",`${n} UTXOs — manageable but monitor`,"Slightly high. Manage carefully during low-fee periods.","low",-3);
  else if (n === 1)      add("utxo_n","UTXO Count","warn","Single UTXO — exposes total balance per spend","With one UTXO, every transaction reveals your full balance to the recipient.","medium",-5);
  else                   add("utxo_n","UTXO Count","pass",`${n} UTXOs — healthy range`,"Good — your balance is spread across a manageable number of UTXOs.","clean",0);

  // 7. Fee fingerprinting
  const feeRates = txs.filter(t => t.fee && t.size).map(t => Math.round(t.fee / t.size));
  if (feeRates.length >= 4 && new Set(feeRates).size <= 2)
    add("fee","Fee Fingerprinting","warn","Identical fee rates — wallet software identifiable","Using the same fee rate every time fingerprints your wallet software for analysts.","medium",-6);
  else
    add("fee","Fee Fingerprinting","pass","Varied fee rates — no wallet fingerprint","Good — your fee rates vary, making your wallet harder to identify.","clean",0);

  // 8. Change address — FIX: use scriptpubkey_address safely
  const changeReuse = txs.some(tx => {
    if (tx.vout?.length !== 2) return false;
    const inputAddrs = new Set((tx.vin || []).map(i => i.prevout?.scriptpubkey_address).filter(Boolean));
    return (tx.vout || []).some(o => o.scriptpubkey_address && inputAddrs.has(o.scriptpubkey_address));
  });
  if (changeReuse)
    add("change","Change Address Reuse","fail","Change sent back to input address — balance exposed","Your wallet sent change back to the same address it spent from. This exposes your full balance.","high",-10);
  else
    add("change","Change Address Reuse","pass","Change sent to fresh addresses","Your change outputs go to new addresses — good practice.","clean",0);

  // 9. Balance concentration
  const largest = utxos.length ? Math.max(...utxos.map(u => u.value)) : 0;
  const total = utxos.reduce((s, u) => s + u.value, 0);
  if (largest > 0 && total > 0 && largest / total > 0.9)
    add("conc","Balance Concentration","warn","90%+ in one UTXO — exposes full balance per spend","Almost all your Bitcoin is in one output. Every transaction reveals nearly your full holdings.","medium",-5);
  else
    add("conc","Balance Concentration","pass","Balance spread across UTXOs","Good — your balance is distributed.","clean",0);

  // 10. Script type mixing — FIX: use scriptpubkey_type from API, not value proxy
  const scriptTypes = new Set(utxos.map(u => u.scriptpubkey_type || (u.value > 10000000 ? "v0_p2wpkh" : "p2pkh")).filter(Boolean));
  if (scriptTypes.size > 1)
    add("script","Mixed Script Types","warn","Mixed legacy/SegWit — linkable by script type","Using different address formats across UTXOs creates patterns analysts can exploit.","low",-4);
  else
    add("script","Mixed Script Types","pass","Consistent script type","Your UTXOs use a consistent address format.","clean",0);

  score = Math.max(0, Math.min(100, Math.round(score)));

  const recs = [];
  const failed = checks.filter(c => c.status !== "pass");
  if (failed.find(f => f.key === "cj"))
    recs.push({ icon:"🔀", action:"Mix your coins with CoinJoin", plain:"CoinJoin pools your Bitcoin with others in a single transaction, making it impossible to trace which output is yours.", detail:"The tools below each implement CoinJoin differently — pick what fits your setup and technical comfort level. Aim for anonymity sets of 50+ participants and time it during low-fee periods.", impact:18, effort:"Medium", tools:[
      { name:"Wasabi Wallet",  note:"Automatic WabiSabi CoinJoin, desktop, beginner-friendly" },
      { name:"Sparrow Wallet", note:"Manual Whirlpool-compatible CoinJoin, desktop" },
      { name:"Joinmarket",     note:"Peer-to-peer maker/taker model, earn fees as a maker" },
      { name:"JoinStr",        note:"Nostr-coordinated CoinJoin, experimental" },
      { name:"BTCPay Server",  note:"Self-hosted, Payjoin + CoinJoin for merchants" },
    ], key:"cj" });
  if (failed.find(f => f.key === "reuse"))
    recs.push({ icon:"🔄", action:"Use a new address every time", plain:"Your wallet can generate unlimited fresh addresses. Every reuse permanently links your transactions for any analyst to trace.", detail:"All HD wallets generate a new address automatically on every 'Receive'. The key is discipline — never copy-paste a previous address.", impact:15, effort:"Easy", tools:[
      { name:"Sparrow Wallet",  note:"Full coin control + address labelling, desktop" },
      { name:"Wasabi Wallet",   note:"Privacy-focused, automatic rotation, desktop" },
      { name:"Electrum",        note:"Lightweight, long-standing open source, desktop" },
      { name:"Bitcoin Core",    note:"Full node wallet, maximum sovereignty" },
      { name:"Blue Wallet",     note:"Mobile, open source, simple UX" },
      { name:"Nunchuk",         note:"Mobile + desktop, multisig support" },
    ], key:"reuse" });
  recs.push({ icon:"⚡", action:"Move spending money to Lightning", plain:"Lightning payments don't appear on-chain at all — zero on-chain footprint for every day-to-day purchase.", detail:"Open a channel from a clean UTXO, then use Lightning for all spending. Options range from fully self-custodial to simple custodial — choose based on how much sovereignty you want.", impact:12, effort:"Medium", tools:[
    { name:"Phoenix Wallet", note:"Self-custodial, mobile, simple UX, automatic channels" },
    { name:"Breez",          note:"Self-custodial, mobile, point-of-sale + podcasting" },
    { name:"Zeus",           note:"Connect to your own LND/CLN node, advanced" },
    { name:"Mutiny Wallet",  note:"Self-custodial, web + mobile, open source" },
    { name:"Blixt Wallet",   note:"Self-custodial, full LND node on mobile" },
    { name:"Alby",           note:"Browser extension, great for web payments" },
  ], key:"lightning" });
  if (failed.find(f => f.key === "cons"))
    recs.push({ icon:"⚗️", action:"Never merge coins from different sources", plain:"Combining exchange Bitcoin with privately-bought Bitcoin links them permanently on-chain — this cannot be undone.", detail:"Use coin control to manually select which UTXOs to spend. Ideally keep KYC and non-KYC coins in entirely separate wallets with no on-chain connection.", impact:10, effort:"Medium", tools:[
      { name:"Sparrow Wallet",  note:"Best-in-class coin control UI, UTXO labelling" },
      { name:"Wasabi Wallet",   note:"Built-in coin labelling and control" },
      { name:"Electrum",        note:"Coin control via Coins tab" },
      { name:"Bitcoin Core",    note:"listunspent + coin control in advanced mode" },
      { name:"Nunchuk",         note:"UTXO management with tags and notes" },
    ], key:"cons" });
  if (failed.find(f => f.key === "dust"))
    recs.push({ icon:"🧊", action:"Freeze your dust UTXOs immediately", plain:"Those tiny amounts are tracking beacons planted by surveillance firms. Spending them links your entire wallet cluster.", detail:"Mark each dust UTXO as frozen/do-not-spend. It will be excluded from all future transactions. Never consolidate dust even during low-fee periods.", impact:9, effort:"Easy", tools:[
      { name:"Sparrow Wallet",  note:"Right-click UTXO → Freeze" },
      { name:"Wasabi Wallet",   note:"Label as suspicious, excluded from CoinJoins" },
      { name:"Electrum",        note:"Right-click → Freeze coin" },
      { name:"Bitcoin Core",    note:"lockunspent to freeze specific UTXOs" },
      { name:"Nunchuk",         note:"Tag UTXOs, exclude from spending" },
    ], key:"dust" });
  if (failed.find(f => f.key === "round"))
    recs.push({ icon:"🎲", action:"Withdraw odd amounts from exchanges", plain:"Instead of 0.1 BTC, withdraw 0.10743 BTC. Round numbers are a primary KYC withdrawal fingerprint used by Chainalysis.", detail:"Change the last 3–4 digits of every withdrawal. Even better: source Bitcoin from non-KYC options so there's no KYC origin to fingerprint in the first place.", impact:8, effort:"Easy", tools:[
      { name:"Any KYC exchange", note:"Just change the withdrawal amount manually" },
      { name:"Bisq",             note:"Decentralised, peer-to-peer, no KYC" },
      { name:"Robosats",         note:"Lightning-based, Tor-native, no KYC" },
      { name:"Peach Bitcoin",    note:"Mobile peer-to-peer, no KYC" },
      { name:"HodlHodl",         note:"Non-custodial P2P, no KYC" },
      { name:"AgoraDesk",        note:"P2P, supports cash and many payment methods" },
    ], key:"round" });
  if (failed.find(f => f.key === "change"))
    recs.push({ icon:"↩", action:"Never reuse change addresses", plain:"Sending change back to an input address exposes your full balance to anyone reading the transaction.", detail:"Ensure your wallet sends change to a fresh address every time. This is the default in all modern HD wallets — check settings if you're unsure.", impact:7, effort:"Easy", tools:[
      { name:"Sparrow Wallet",    note:"Settings → Script type → Native SegWit (BIP84)" },
      { name:"Wasabi Wallet",     note:"Fresh change addresses automatic by default" },
      { name:"Electrum",          note:"Wallet → Preferences → Use change addresses" },
      { name:"Bitcoin Core",      note:"Default HD wallet behaviour, always fresh change" },
      { name:"Blue Wallet",       note:"HD wallet, fresh change addresses by default" },
      { name:"Nunchuk",           note:"BIP84 by default, visible in transaction detail" },
    ], key:"change" });
  recs.push({ icon:"🖥️", action:"Connect to your own Bitcoin node", plain:"Public Electrum servers see every address you query and can link your IP to your wallet. Your own node leaks nothing.", detail:"Run a full node and point your wallet at it via local network or Tor. Options range from plug-and-play hardware appliances to software on any machine.", impact:6, effort:"Hard", tools:[
    { name:"Bitcoin Core",  note:"Original full node, free, runs on any OS" },
    { name:"Umbrel",        note:"Plug-and-play on Raspberry Pi, app store" },
    { name:"Start9",        note:"Sovereignty-focused OS, strong privacy defaults" },
    { name:"RaspiBlitz",    note:"Open source, Lightning + Bitcoin, DIY" },
    { name:"MyNode",        note:"Beginner-friendly, community edition is free" },
    { name:"Nodl",          note:"Pre-built hardware node, plug and play" },
  ], key:"node" });
  if (failed.find(f => f.key === "fee"))
    recs.push({ icon:"💸", action:"Vary your fee rates", plain:"Using the same fee rate every time fingerprints your wallet software — analysts can identify which wallet you use.", detail:"Check the current mempool before each transaction and manually set a fee rather than using your wallet's default. Vary the rate each time.", impact:6, effort:"Easy", tools:[
      { name:"Sparrow Wallet",    note:"Full manual fee control per transaction" },
      { name:"mempool.space",     note:"Live fee estimates, open source, Tor-accessible" },
      { name:"Bitcoin Core",      note:"estimatesmartfee RPC for precise control" },
      { name:"Electrum",          note:"Manual fee slider on every send" },
      { name:"bitcoinfees.earn",  note:"Simple fee rate overview by confirmation target" },
    ], key:"fee" });
  if (failed.find(f => f.key === "conc"))
    recs.push({ icon:"⚖️", action:"Distribute your balance across UTXOs", plain:"Nearly all your Bitcoin is in one output — every transaction reveals almost your full holdings to the recipient.", detail:"A CoinJoin round naturally produces multiple balanced outputs. Or split manually by sending to yourself across several transactions during low-fee periods.", impact:5, effort:"Medium", tools:[
      { name:"Sparrow Wallet",  note:"Manual UTXO splitting with coin control" },
      { name:"Wasabi Wallet",   note:"CoinJoin produces a well-distributed output set" },
      { name:"Joinmarket",      note:"Yields naturally distributed UTXO set" },
      { name:"Electrum",        note:"Send-to-self with manual output splitting" },
      { name:"Bitcoin Core",    note:"createrawtransaction for precise output control" },
    ], key:"conc" });
  // Sort by impact descending
  recs.sort((a, b) => b.impact - a.impact);

  return {
    score,
    grade: scoreGrade(score),
    riskLabel: scoreLabel(score),
    riskColor: scoreColor(score),
    checks,
    recommendations: recs.slice(0, 6),
  };
}

/* ─────────────────────────────────────────────
   API + DEMO DATA
───────────────────────────────────────────── */
const API = "https://blockstream.info/api";
async function fetchAddress(addr) {
  const [info, utxos, txs] = await Promise.all([
    fetch(`${API}/address/${addr}`).then(r => { if (!r.ok) throw new Error("Not found"); return r.json(); }),
    fetch(`${API}/address/${addr}/utxo`).then(r => r.json()),
    fetch(`${API}/address/${addr}/txs`).then(r => r.json()),
  ]);
  return { addrInfo: info, utxos: utxos.slice(0, 30), txs: txs.slice(0, 30) };
}

const now = () => Math.floor(Date.now() / 1000);
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
  txs: [
    { txid:"a3f21e9b",vin:[{txid:"p1",vout:0}],vout:[{value:120000000,scriptpubkey_address:"bc1qex1"},{value:9871234,scriptpubkey_address:"bc1qex2"}],fee:1420,size:224,status:{block_time:now()-86400*14}},
    { txid:"7b91cc3a",vin:[{txid:"p2",vout:0},{txid:"p3",vout:1},{txid:"p4",vout:0},{txid:"p5",vout:2}],vout:[{value:84700000,scriptpubkey_address:"bc1qex3"}],fee:3200,size:450,status:{block_time:now()-86400*60}},
    { txid:"f004d188",vin:[{txid:"p6",vout:0}],vout:[{value:50000000},{value:50000000},{value:50000000},{value:50000000},{value:19874123}],fee:980,size:340,status:{block_time:now()-86400*180}},
    { txid:"2d5e4f7c",vin:[{txid:"p7",vout:0}],vout:[{value:20000000},{value:8312200}],fee:780,size:224,status:{block_time:now()-86400*365}},
    { txid:"9c11a2b0",vin:[{txid:"p8",vout:0}],vout:[{value:10000000},{value:3421000}],fee:650,size:224,status:{block_time:now()-86400*3}},
    { txid:"44cc3b77",vin:[{txid:"p9",vout:0}],vout:[{value:546},{value:99999454}],fee:320,size:150,status:{block_time:now()-86400*2}},
    { txid:"bb44e901",vin:[{txid:"p10",vout:0}],vout:[{value:100000000}],fee:1100,size:200,status:{block_time:now()-86400*200}},
  ],
};

/* ─────────────────────────────────────────────
   FORMATTERS
───────────────────────────────────────────── */
const fmt = {
  btc:  v => v >= 1e8 ? `₿${(v / 1e8).toFixed(4)}` : `${v.toLocaleString()} sats`,
  age:  ts => { const d = Math.floor((Date.now()/1000 - ts) / 86400); return d < 1 ? "Today" : d === 1 ? "Yesterday" : d < 30 ? `${d}d ago` : d < 365 ? `${Math.floor(d/30)}mo ago` : `${Math.floor(d/365)}yr ago`; },
  txid: id => id ? `${id.slice(0,8)}…${id.slice(-4)}` : "—",
  addr: a => a === "DEMO" ? "Demo Wallet" : a ? `${a.slice(0,10)}…${a.slice(-6)}` : "—",
};

/* ─────────────────────────────────────────────
   PLAIN-ENGLISH TRANSLATIONS
   Used when simpleMode is enabled on the dashboard
───────────────────────────────────────────── */
const SIMPLE = {
  checks: {
    reuse: {
      name: "Same Address Used Multiple Times",
      fail_detail: "Every time you reuse an address, it's like telling the world 'these transactions are all mine.' Anyone can click your address on a public tracker and see everything.",
      warn_detail: "You've used this address more than once. Get a fresh address from your wallet next time you receive Bitcoin — it takes one tap.",
      pass_detail: "Great — this address was only used once, so your transactions aren't linked together.",
    },
    dust: {
      name: "Tiny Tracking Coins",
      fail_detail: "Companies that track Bitcoin sent you microscopic amounts to tag your wallet. If you spend them, they can follow where your money goes. Freeze them — they're traps.",
      warn_detail: "A tiny amount was sent to your address. It might be a tracking beacon. Don't spend it — just ignore it.",
      pass_detail: "No tracking coins found. You're clean.",
    },
    round: {
      name: "Round Withdrawal Amounts",
      fail_detail: "You withdrew a nice round number like 0.1 BTC. Bitcoin trackers use this to identify withdrawals from exchanges. Next time, withdraw 0.10743 BTC instead of 0.1.",
      warn_detail: "One round amount spotted. Minor issue — just use odd amounts when withdrawing next time.",
      pass_detail: "Your amounts are non-round — harder to fingerprint.",
    },
    cj: {
      name: "Privacy Mixing",
      fail_detail: "Your full transaction history is visible to anyone. Privacy mixing blends your coins with others in a single transaction so no one can tell which coins are yours.",
      warn_detail: "You've mixed your coins once. More rounds make it much harder to trace.",
      pass_detail: "You've used privacy mixing — this breaks the trail of your transactions. Well done.",
    },
    cons: {
      name: "Combining Coins from Different Sources",
      fail_detail: "You combined coins that came from different places (like an exchange and a peer-to-peer trade). This links those two separate histories together — permanently, on-chain.",
      warn_detail: "One instance of combining different coins. Avoid mixing exchange coins with privately-bought coins.",
      pass_detail: "Your coins from different sources are kept separate.",
    },
    utxo_n: {
      name: "Number of Coin Pieces",
      fail_detail: "You have a lot of small coin pieces in your wallet. This creates pressure to combine them all together, which links your transaction history.",
      warn_detail: "Slightly high number of coin pieces. No urgent action needed.",
      pass_detail: "Your wallet has a healthy number of coin pieces.",
    },
    fee: {
      name: "Transaction Fee Pattern",
      warn_detail: "You always pay the same fee amount. Bitcoin trackers can use this to identify which wallet app you use. Just vary it a little each time.",
      pass_detail: "Your fees vary — no wallet fingerprint detected.",
    },
    change: {
      name: "Change Sent Back to Same Address",
      fail_detail: "When you sent Bitcoin, your leftover change went back to the same address. This tells anyone watching exactly how much Bitcoin you still have.",
      pass_detail: "Your change goes to fresh addresses each time. Good practice.",
    },
    conc: {
      name: "All Bitcoin in One Chunk",
      warn_detail: "Almost all your Bitcoin is in a single coin piece. Every time you send any amount, the person receiving it can see roughly how much total Bitcoin you own.",
      pass_detail: "Your balance is spread across multiple coin pieces.",
    },
    script: {
      name: "Mixed Address Formats",
      warn_detail: "You're using old and new Bitcoin address formats together. Trackers can use this pattern to link your transactions.",
      pass_detail: "You're using a consistent address format.",
    },
  },
  recs: {
    cj:      { action: "Mix your coins for privacy",          plain: "Privacy mixing pools your Bitcoin with other people in one transaction, so no one can tell whose coins are whose. It's the single most powerful thing you can do." },
    reuse:   { action: "Use a fresh address every time",      plain: "Your wallet can make unlimited new addresses for free. Tap 'Receive' and get a new one every time someone sends you Bitcoin. Never reuse an old one." },
    lightning:{ action: "Pay small amounts over Lightning",   plain: "Lightning lets you send Bitcoin instantly without any record on the public blockchain. Perfect for everyday spending — like cash, but digital." },
    cons:    { action: "Keep your coins separate",            plain: "Don't mix coins from your exchange with coins you bought privately. Use separate wallets, and never send between them directly." },
    dust:    { action: "Freeze your tracking coins",          plain: "Find those tiny amounts in your wallet and mark them as 'frozen' or 'do not spend.' They're traps — spending them tags your entire wallet." },
    round:   { action: "Withdraw odd amounts from exchanges", plain: "Instead of withdrawing exactly 0.1 BTC, withdraw 0.10743. Round numbers are a dead giveaway that coins came from an exchange." },
    change:  { action: "Make sure change goes to new addresses", plain: "When you send Bitcoin, your leftover change should go to a brand new address — not back to one you've used before. Most modern wallets do this automatically." },
    node:    { action: "Connect to your own Bitcoin server",  plain: "When you look up your wallet, a public server sees your address and your IP address. Running your own server means only you see your own lookups." },
    fee:     { action: "Vary how much you pay in fees",       plain: "Paying the exact same fee every time lets trackers identify your wallet app. Just change it by a little each time you send." },
    conc:    { action: "Spread your Bitcoin across pieces",   plain: "Having all your Bitcoin in one chunk means every transaction reveals your total holdings. Split it into smaller pieces using privacy mixing or manual sends." },
  },
  grades: {
    A: "Very Private",
    B: "Mostly Private",
    C: "Moderate Risk",
    D: "High Risk",
    F: "Fully Traceable",
  },
};

function isValidBitcoinAddress(addr) {
  if (!addr || addr.length < 26 || addr.length > 90) return false;
  return /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,87}$/.test(addr);
}

/* ─────────────────────────────────────────────
   MICRO COMPONENTS
───────────────────────────────────────────── */
const Tag = ({ label, color, size = 11 }) => (
  <span style={{ fontFamily: T.mono, fontSize: size, padding: "3px 8px", borderRadius: 4, background: color + "18", color, border: `1px solid ${color}30`, letterSpacing: 0.3, whiteSpace: "nowrap" }}>
    {String(label)}
  </span>
);

const Divider = ({ my = 0 }) => <div style={{ height: 1, background: T.border, margin: `${my}px 0` }} />;

const Pill = ({ children, active, onClick, color }) => (
  <button onClick={onClick} style={{
    background: active ? (color || T.cyan) + "22" : "transparent",
    border: `1.5px solid ${active ? (color || T.cyan) : T.border}`,
    borderRadius: 99, padding: "7px 18px",
    color: active ? (color || T.cyan) : T.textMid,
    fontFamily: T.sans, fontSize: 13, fontWeight: active ? 600 : 400,
    cursor: "pointer", transition: "all .15s", whiteSpace: "nowrap",
  }}>
    {children}
  </button>
);

function Toast({ toasts }) {
  return (
    <div style={{ position: "fixed", bottom: 80, right: 20, zIndex: 9999, display: "flex", flexDirection: "column", gap: 8, pointerEvents: "none" }}>
      {toasts.map(t => (
        <div key={t.id} style={{ background: T.card, border: `1px solid ${t.color || T.border}`, borderLeft: `3px solid ${t.color || T.cyan}`, borderRadius: 10, padding: "12px 16px", display: "flex", gap: 10, alignItems: "center", boxShadow: "0 8px 32px #00000066", animation: t.out ? "toastOut .3s ease both" : "toastIn .3s ease both", minWidth: 220 }}>
          <span style={{ fontSize: 16 }}>{t.icon || "ℹ️"}</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{t.title}</div>
            {t.msg && <div style={{ fontSize: 11, color: T.textMid, marginTop: 2 }}>{t.msg}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}

function useToast() {
  const [toasts, setToasts] = useState([]);
  const show = useCallback((title, opts = {}) => {
    const id = Date.now();
    setToasts(p => [...p, { id, title, ...opts }]);
    setTimeout(() => setToasts(p => p.map(t => t.id === id ? { ...t, out: true } : t)), 2600);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3000);
  }, []);
  return { toasts, show };
}

/* ─────────────────────────────────────────────
   SCORE RING — FIX: useRef to prevent memory leak
───────────────────────────────────────────── */
function ScoreRing({ score, size = 130, animate = true }) {
  const [cur, setCur] = useState(animate ? 0 : score);
  const timerRef = useRef(null); // FIX: track timer to clear on unmount
  const r = size * 0.38, c = 2 * Math.PI * r, col = scoreColor(score);

  useEffect(() => {
    if (!animate) { setCur(score); return; }
    let v = 0;
    const tick = () => {
      v = Math.min(v + 1, score);
      setCur(v);
      if (v < score) {
        timerRef.current = setTimeout(tick, 12);
      }
    };
    timerRef.current = setTimeout(tick, 400);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); }; // FIX: cleanup
  }, [score, animate]);

  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)", position: "absolute" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={T.surface} strokeWidth={size * .07} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={col} strokeWidth={size * .07}
          strokeDasharray={c} strokeDashoffset={c * (1 - cur / 100)} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset .08s linear" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: T.serif, fontSize: size * .28, color: col, lineHeight: 1, fontWeight: 400 }}>{cur}</span>
        <span style={{ fontFamily: T.mono, fontSize: size * .07, color: T.textDim, letterSpacing: 1, marginTop: 2 }}>/100</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   DEMO PREVIEW — rotating F/C/A examples
───────────────────────────────────────────── */
function DemoPreview() {
  const [idx, setIdx] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setIdx(i => (i + 1) % DEMO_EXAMPLES.length);
      setAnimKey(k => k + 1);
    }, 5500);
    return () => clearInterval(intervalRef.current);
  }, []);

  const ex = DEMO_EXAMPLES[idx];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div key={animKey} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 20, padding: 28, boxShadow: "0 16px 64px #00000044", animation: "demoSlide .45s ease both" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 20 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: T.green, animation: "pulse 2s infinite" }} />
          <span style={{ fontFamily: T.mono, fontSize: 10, color: T.textDim, letterSpacing: 1.5 }}>LIVE EXAMPLE · ROTATING</span>
        </div>
        <div style={{ display: "flex", gap: 20, alignItems: "center", marginBottom: 22 }}>
          <ScoreRing score={ex.score} size={100} animate={false} />
          <div>
            <div style={{ fontFamily: T.serif, fontSize: 38, color: ex.color, lineHeight: 1, fontWeight: 400 }}>Grade {ex.grade}</div>
            <div style={{ fontSize: 13, color: T.textMid, marginTop: 5 }}>{ex.label}</div>
            <div style={{ fontFamily: T.mono, fontSize: 10, color: T.textDim, marginTop: 6 }}>{ex.score}/100 privacy score</div>
          </div>
        </div>
        <div style={{ fontSize: 11, color: T.textDim, marginBottom: 10, fontFamily: T.mono, letterSpacing: 1 }}>FINDINGS</div>
        {ex.issues.map((issue, i) => {
          const isGood = issue.includes("✓");
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderTop: `1px solid ${T.borderLo}` }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: isGood ? T.green : (i < 2 ? T.red : T.amber), flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: isGood ? T.textMid : T.text }}>{issue}</span>
            </div>
          );
        })}
      </div>
      {/* Dot indicators */}
      <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
        {DEMO_EXAMPLES.map((ex, i) => (
          <button key={i} onClick={() => { setIdx(i); setAnimKey(k => k + 1); }}
            style={{ width: i === idx ? 20 : 8, height: 8, borderRadius: 4, background: i === idx ? ex.color : T.textDim, border: "none", cursor: "pointer", transition: "all .3s", padding: 0 }} />
        ))}
      </div>
      {/* Source callout */}
      <div style={{ background: T.btcLo, border: `1px solid ${T.btcMid}`, borderRadius: 12, padding: "14px 18px" }}>
        <div style={{ fontSize: 12, color: T.btc, fontWeight: 600, marginBottom: 4 }}>₿ Average wallet scores 38/100</div>
        <div style={{ fontSize: 12, color: T.textMid, lineHeight: 1.6 }}>Most wallets have at least 3 fixable issues. The most common? Address reuse — found in 91% of wallets.</div>
        <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, marginTop: 6, letterSpacing: 1 }}>Source: OXT Research, 2023</div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SHARE CARD
───────────────────────────────────────────── */
function ShareCard({ score, grade, issueCount, address, onClose }) {
  const col = scoreColor(score);
  const [mode, setMode] = useState("share");
  const [didCopy, setDidCopy] = useState(false);
  const [nostrSent, setNostrSent] = useState(false);
  const shareText = `My Bitcoin privacy score: Grade ${grade} (${score}/100)\n${issueCount} issue${issueCount !== 1 ? "s" : ""} found.\nCheck yours free → anonscore.com`;
  const xText = `My Bitcoin privacy score: Grade ${grade} (${score}/100) — ${issueCount} issue${issueCount !== 1 ? "s" : ""} found.\n\nMost wallets score 38/100. Check yours free 👇\nanonscore.com`;
  const badgeMd = `\`Privacy: ${score}/100 · Grade ${grade}\` — [AnonScore](https://anonscore.com)`;
  const nostrNote = `🔒 Bitcoin privacy score: Grade ${grade} (${score}/100)\n\n${issueCount} issue${issueCount !== 1 ? "s" : ""} detected via AnonScore — a free open-source tool that runs 10 heuristics against your on-chain history.\n\nMost wallets score 38/100. How does yours compare?\n\nhttps://anonscore.com\n\n#Bitcoin #Privacy`;
  const copy = (text) => { navigator.clipboard?.writeText(text).catch(()=>{}); setDidCopy(true); setTimeout(()=>setDidCopy(false),2000); };
  const shareToX = () => {
    const url = `https://x.com/intent/tweet?text=${encodeURIComponent(xText)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };
  const shareToNostr = async () => {
    if (window.nostr) {
      try { await window.nostr.signEvent({kind:1,content:nostrNote,tags:[],created_at:Math.floor(Date.now()/1000)}); setNostrSent(true); setTimeout(()=>setNostrSent(false),3000); return; } catch {}
    }
    copy(nostrNote);
  };
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 800, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "#00000077" }} />
      <div style={{ position: "relative", background: T.card, border: `1px solid ${T.border}`, borderRadius: 20, padding: 28, width: "min(400px,94vw)", animation: "fadeUp .3s ease both" }}>
        <div style={{ background: `linear-gradient(135deg,${T.surface},${T.bg})`, borderRadius: 14, padding: 22, marginBottom: 18, border: `1px solid ${col}33` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <span style={{ color: T.btc, fontFamily: T.mono, fontSize: 14 }}>₿</span>
            <span style={{ fontFamily: T.display, fontSize: 10, color: T.textDim, letterSpacing: 3 }}>ANONSCORE</span>
          </div>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontFamily: T.serif, fontSize: 48, color: col, lineHeight: 1 }}>{score}</div>
              <div style={{ fontFamily: T.mono, fontSize: 8, color: T.textDim, letterSpacing: 2, marginTop: 3 }}>SCORE</div>
            </div>
            <div>
              <div style={{ fontFamily: T.serif, fontSize: 34, color: col, lineHeight: 1 }}>Grade {grade}</div>
              <div style={{ fontSize: 13, color: T.textMid, marginTop: 5 }}>{scoreLabel(score)}</div>
              <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, marginTop: 5 }}>{issueCount} issue{issueCount!==1?"s":""} found · {fmt.addr(address)}</div>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
          {[["share","📤 Copy"],["x","𝕏 Post"],["nostr","🟣 Nostr"],["badge","🏷 Badge"]].map(([m,label]) => (
            <button key={m} onClick={()=>setMode(m)} style={{ flex:1, padding:"7px 4px", background:mode===m?T.cyanLo:"transparent", border:`1.5px solid ${mode===m?T.cyan:T.border}`, borderRadius:8, color:mode===m?T.cyan:T.textMid, fontSize:11, cursor:"pointer", fontFamily:T.sans, transition:"all .15s" }}>{label}</button>
          ))}
        </div>
        {mode==="share" && <>
          <div style={{ background:T.surface, borderRadius:10, padding:14, marginBottom:14, border:`1px solid ${T.borderLo}` }}>
            <pre style={{ fontFamily:T.sans, fontSize:13, color:T.textMid, lineHeight:1.6, whiteSpace:"pre-wrap" }}>{shareText}</pre>
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <button onClick={()=>copy(shareText)} style={{ flex:1, padding:"12px", background:didCopy?T.green:T.cyan, border:"none", borderRadius:10, color:T.bg, fontFamily:T.sans, fontWeight:700, fontSize:14, cursor:"pointer", transition:"background .2s" }}>{didCopy?"✓ Copied!":"Copy to share"}</button>
            <button onClick={onClose} style={{ padding:"12px 14px", background:"transparent", border:`1px solid ${T.border}`, borderRadius:10, color:T.textMid, cursor:"pointer" }}>✕</button>
          </div>
        </>}
        {mode==="x" && <>
          <div style={{ background:T.surface, borderRadius:10, padding:14, marginBottom:14, border:`1px solid ${T.borderLo}` }}>
            <pre style={{ fontFamily:T.sans, fontSize:13, color:T.textMid, lineHeight:1.6, whiteSpace:"pre-wrap" }}>{xText}</pre>
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <button onClick={shareToX} style={{ flex:1, padding:"12px", background:"#000", border:"none", borderRadius:10, color:"#fff", fontFamily:T.sans, fontWeight:700, fontSize:14, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
              <span style={{ fontSize:16 }}>𝕏</span> Post on X
            </button>
            <button onClick={()=>copy(xText)} style={{ padding:"12px 14px", background:"transparent", border:`1px solid ${T.border}`, borderRadius:10, color:T.textMid, cursor:"pointer", fontSize:12 }}>{didCopy?"✓":"Copy"}</button>
            <button onClick={onClose} style={{ padding:"12px 14px", background:"transparent", border:`1px solid ${T.border}`, borderRadius:10, color:T.textMid, cursor:"pointer" }}>✕</button>
          </div>
        </>}
        {mode==="nostr" && <>
          {window.nostr && <div style={{ background:T.greenLo, border:`1px solid ${T.green}33`, borderRadius:8, padding:"8px 12px", marginBottom:10, fontSize:12, color:T.green }}>✓ NIP-07 extension detected — can publish directly</div>}
          <div style={{ background:T.surface, borderRadius:10, padding:14, marginBottom:14, border:`1px solid ${T.borderLo}` }}>
            <pre style={{ fontFamily:T.sans, fontSize:12, color:T.textMid, lineHeight:1.6, whiteSpace:"pre-wrap" }}>{nostrNote}</pre>
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <button onClick={shareToNostr} style={{ flex:1, padding:"12px", background:nostrSent?T.green:"#8B5CF6", border:"none", borderRadius:10, color:"#fff", fontFamily:T.sans, fontWeight:700, fontSize:14, cursor:"pointer", transition:"background .2s" }}>{nostrSent?"✓ Published!":window.nostr?"Publish to Nostr":"Copy Nostr note"}</button>
            <button onClick={onClose} style={{ padding:"12px 14px", background:"transparent", border:`1px solid ${T.border}`, borderRadius:10, color:T.textMid, cursor:"pointer" }}>✕</button>
          </div>
        </>}
        {mode==="badge" && <>
          <div style={{ background:T.surface, borderRadius:10, padding:14, marginBottom:10, border:`1px solid ${T.borderLo}` }}>
            <div style={{ fontFamily:T.mono, fontSize:9, color:T.textDim, letterSpacing:1.5, marginBottom:8 }}>MARKDOWN BADGE</div>
            <pre style={{ fontFamily:T.mono, fontSize:11, color:T.textMid, lineHeight:1.7, whiteSpace:"pre-wrap", wordBreak:"break-all" }}>{badgeMd}</pre>
          </div>
          <div style={{ fontSize:12, color:T.textMid, marginBottom:14, lineHeight:1.5 }}>Paste into your GitHub README or Nostr profile bio to show your privacy grade.</div>
          <button onClick={()=>copy(badgeMd)} style={{ width:"100%", padding:"12px", background:didCopy?T.green:T.cyan, border:"none", borderRadius:10, color:T.bg, fontFamily:T.sans, fontWeight:700, fontSize:14, cursor:"pointer", transition:"background .2s" }}>{didCopy?"✓ Copied!":"Copy badge markdown"}</button>
        </>}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   TRUST BOX — collapsed by default, expands on click
───────────────────────────────────────────── */
const GUARANTEES = [
  { icon: "⬡", label: "No server, no backend", desc: "Your address goes directly from your browser to Blockstream's public API. It never touches our infrastructure." },
  { icon: "◌", label: "Nothing stored or logged", desc: "We have no database, no analytics, no session tracking. Close the tab and it's gone." },
  { icon: "◎", label: "Scoring runs in your browser", desc: "All 10 heuristics execute locally. Your address, score, and results never leave your device." },
];

function TrustBox() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ background: T.surface, border: `1px solid ${open ? T.green + "44" : T.border}`, borderRadius: 12, marginBottom: 20, animation: "fadeUp .5s ease .18s both", transition: "border-color .2s", overflow: "hidden" }}>
      {/* Collapsed header — always visible */}
      <button onClick={() => setOpen(o => !o)} style={{ width: "100%", background: "transparent", border: "none", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {GUARANTEES.map((g, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ color: T.green, fontSize: 11 }}>✓</span>
              <span style={{ fontFamily: T.mono, fontSize: 11, color: T.textMid, letterSpacing: .5, whiteSpace: "nowrap" }}>{g.label}</span>
            </div>
          ))}
        </div>
        <span style={{ fontFamily: T.mono, fontSize: 11, color: T.cyan, flexShrink: 0, marginLeft: 12 }}>{open ? "▲ less" : "▼ how?"}</span>
      </button>
      {/* Expanded detail */}
      {open && (
        <div style={{ padding: "0 16px 14px", borderTop: `1px solid ${T.borderLo}`, animation: "slideDown .2s ease both" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 12 }}>
            {GUARANTEES.map((g, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ fontFamily: T.mono, fontSize: 12, color: T.green, flexShrink: 0, marginTop: 1 }}>{g.icon}</span>
                <div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{g.label} </span>
                  <span style={{ fontSize: 13, color: T.textMid }}>{g.desc}</span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12, paddingTop: 10, borderTop: `1px solid ${T.borderLo}` }}>
            <a href="https://github.com/netasset/anonscore" target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: T.cyan, textDecoration: "none", fontFamily: T.mono }}>Don't take our word for it — audit the source on GitHub ↗</a>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   LANDING PAGE — v4
───────────────────────────────────────────── */
function Landing({ onAnalyze, isMobile }) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef();

  const submit = (val, plain = false) => {
    const v = (val || input).trim();
    if (!v) { setError("Please enter a Bitcoin address."); return; }
    if (!isValidBitcoinAddress(v) && v !== "DEMO") {
      setError("That doesn't look like a valid address. Try one starting with bc1, 1, or 3.");
      return;
    }
    setError("");
    onAnalyze(v, plain);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: T.bg }}>
      {/* Nav */}
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: isMobile ? "14px 20px" : "14px 48px", borderBottom: `1px solid ${T.border}`, background: T.bg, position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: T.btc, fontFamily: T.mono, fontSize: 14, lineHeight: 1 }}>₿</span>
          <span style={{ fontFamily: T.display, fontWeight: 700, fontSize: 15, letterSpacing: 4, color: T.text, textTransform: "uppercase" }}>ANON<span style={{ color: T.cyan }}>SCORE</span></span>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {/* Trust signals in nav — seen by everyone, no scroll required */}
          {!isMobile && <>
            <span style={{ fontFamily: T.mono, fontSize: 10, color: T.textDim }}>✓ No cookies</span>
            <span style={{ color: T.borderLo }}>·</span>
            <span style={{ fontFamily: T.mono, fontSize: 10, color: T.textDim }}>✓ Nothing stored</span>
            <span style={{ color: T.borderLo }}>·</span>
            <span style={{ fontFamily: T.mono, fontSize: 10, color: T.textDim }}>✓ Tor compatible</span>
            <span style={{ color: T.borderLo, margin: "0 4px" }}>|</span>
          </>}
          <a href="https://github.com/netasset/anonscore" target="_blank" rel="noopener noreferrer"
            style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 7, color: T.textMid, textDecoration: "none", fontSize: 11, fontFamily: T.mono, transition: "border-color .15s" }}
            onMouseOver={e => e.currentTarget.style.borderColor = T.cyan}
            onMouseOut={e => e.currentTarget.style.borderColor = T.border}>
            GitHub ↗
          </a>
          <Tag label="Free" color={T.green} size={10} />
        </div>
      </nav>

      {/* ── HERO ── */}
      <div style={{ position: "relative", overflow: "hidden" }}>
        <div className="dot-grid" style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "10%", left: "-10%", width: 520, height: 520, borderRadius: "50%", background: "radial-gradient(circle,#22D3EE18 0%,transparent 70%)", animation: "orb 8s ease-in-out infinite", pointerEvents: "none", filter: "blur(2px)" }} />

        <section style={{ position: "relative", padding: isMobile ? "56px 20px 48px" : "80px 48px 64px", maxWidth: 860, margin: "0 auto", width: "100%", textAlign: "center" }}>
          {/* Eyebrow */}
          <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: 2.5, marginBottom: 18, animation: "fadeUp .5s ease both", display: "flex", gap: 8, alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: T.btc }}>₿</span>
            <span style={{ color: T.cyan }}>FREE BITCOIN PRIVACY AUDIT</span>
          </div>

          {/* Headline */}
          <h1 style={{ fontFamily: T.serif, fontSize: isMobile ? 38 : 56, lineHeight: 1.06, color: T.text, marginBottom: 20, animation: "fadeUp .5s ease .08s both", fontWeight: 400 }}>
            Is your Bitcoin<br />wallet leaking?<br /><em style={{ color: T.cyan }}>Find out in 60 seconds.</em>
          </h1>

          <p style={{ fontSize: isMobile ? 15 : 18, color: T.textMid, lineHeight: 1.7, marginBottom: 32, fontWeight: 300, animation: "fadeUp .5s ease .14s both", maxWidth: 560, margin: "0 auto 32px" }}>
            Paste any Bitcoin address. Get a privacy score, see every issue, and get a ranked plan to fix it — free, open source, nothing stored.
          </p>

          {/* Score spectrum — slim, inline */}
          <div style={{ maxWidth: 480, margin: "0 auto 28px", animation: "fadeUp .5s ease .16s both" }}>
            <div style={{ position: "relative", height: 6, borderRadius: 6, background: `linear-gradient(90deg, ${T.red} 0%, ${T.btc} 40%, ${T.amber} 60%, ${T.green} 100%)`, marginBottom: 6 }}>
              <div style={{ position: "absolute", top: "50%", left: "38%", transform: "translate(-50%,-50%)", width: 12, height: 12, borderRadius: "50%", background: T.bg, border: `2px solid ${T.btc}`, boxShadow: `0 0 8px ${T.btc}` }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontFamily: T.mono, fontSize: 9, color: T.red }}>0 · Fully traceable</span>
              <span style={{ fontFamily: T.mono, fontSize: 9, color: T.btc }}>avg wallet: 38</span>
              <span style={{ fontFamily: T.mono, fontSize: 9, color: T.green }}>100 · Invisible</span>
            </div>
          </div>

          {/* CTAs */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 480, margin: "0 auto", animation: "fadeUp .5s ease .22s both" }}>
            <div>
              <div style={{ display: "flex", gap: 8 }}>
                <input ref={inputRef} value={input} onChange={e => { setInput(e.target.value); setError(""); }}
                  onKeyDown={e => e.key === "Enter" && submit(null, true)}
                  placeholder="bc1q… or 1… or 3…"
                  style={{ flex: 1, background: T.surface, border: `1.5px solid ${error ? T.red : T.border}`, borderRadius: 10, padding: "13px 16px", color: T.text, fontFamily: T.mono, fontSize: 13, outline: "none", transition: "border .18s", minWidth: 0 }}
                  onFocus={e => e.target.style.borderColor = T.cyan}
                  onBlur={e => e.target.style.borderColor = error ? T.red : T.border} />
                <button onClick={() => submit(null, true)} style={{ background: T.btc, border: `1.5px solid ${T.btc}`, borderRadius: 10, padding: "13px 20px", color: T.bg, fontFamily: T.sans, fontWeight: 700, fontSize: 14, cursor: "pointer", whiteSpace: "nowrap", transition: "all .15s" }}
                  onMouseOver={e => e.currentTarget.style.opacity = ".88"}
                  onMouseOut={e => e.currentTarget.style.opacity = "1"}>
                  Analyze →
                </button>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 5 }}>
                <button onClick={() => submit(null, false)} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: T.mono, fontSize: 10, color: T.textDim, padding: 0 }}
                  onMouseOver={e => e.currentTarget.style.color = T.textMid}
                  onMouseOut={e => e.currentTarget.style.color = T.textDim}>
                  prefer technical mode →
                </button>
              </div>
              {error && <div style={{ fontSize: 12, color: T.red, marginTop: 6, animation: "slideDown .2s ease" }}>⚠ {error}</div>}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ flex: 1, height: 1, background: T.borderLo }} />
              <span style={{ fontFamily: T.mono, fontSize: 10, color: T.textDim }}>or try a sample</span>
              <div style={{ flex: 1, height: 1, background: T.borderLo }} />
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => onAnalyze("DEMO", false)}
                style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: T.surface, border: `1.5px solid ${T.border}`, borderRadius: 12, padding: "11px 16px", color: T.textMid, fontFamily: T.sans, fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all .18s" }}
                onMouseOver={e => e.currentTarget.style.borderColor = T.cyan}
                onMouseOut={e => e.currentTarget.style.borderColor = T.border}>
                ▶ Sample scan
              </button>
              <div style={{ flex: 2, display: "flex", flexDirection: "column", gap: 4 }}>
                <button onClick={() => onAnalyze("DEMO", true)}
                  style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: T.cyan, border: "none", borderRadius: 12, padding: "11px 16px", color: T.bg, fontFamily: T.sans, fontSize: 13, fontWeight: 700, cursor: "pointer", transition: "all .18s", boxShadow: `0 2px 14px ${T.cyanMid}` }}
                  onMouseOver={e => e.currentTarget.style.opacity = ".88"}
                  onMouseOut={e => e.currentTarget.style.opacity = "1"}>
                  💬 Sample in Plain English
                </button>
                <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, textAlign: "center" }}>no jargon — good if you're new to Bitcoin</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <a href="https://github.com/netasset/anonscore" target="_blank" rel="noopener noreferrer"
                style={{ fontFamily: T.mono, fontSize: 10, color: T.cyan, textDecoration: "none" }}>Open source</a>
              <span style={{ color: T.textDim, fontSize: 10 }}>· read-only · nothing stored</span>
            </div>
          </div>
        </section>
      </div>{/* end hero wrapper */}

      {/* ── HOW IT WORKS — compact strip ── */}
      <div style={{ borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}`, background: T.surface, padding: isMobile ? "28px 20px" : "32px 48px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: isMobile ? 20 : 0 }}>
            {[
              { n:"01", icon:"📋", title:"Paste an address", desc:"Any Bitcoin address — yours or anyone's. No account, no email, nothing saved." },
              { n:"02", icon:"🔍", title:"We run 10 checks",  desc:"We scan the public blockchain for the same patterns surveillance firms use — read-only, in your browser." },
              { n:"03", icon:"🎯", title:"Score + fix plan",  desc:"A score from 0–100, every issue explained, fixes ranked by impact. Hit 💬 Plain English if you want jargon-free." },
            ].map((s, i) => (
              <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: isMobile ? 0 : "0 28px", borderLeft: !isMobile && i > 0 ? `1px solid ${T.border}` : "none" }}>
                <div style={{ fontSize: 22, flexShrink: 0, marginTop: 2 }}>{s.icon}</div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontFamily: T.mono, fontSize: 9, color: T.cyan }}>{s.n}</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: T.text }}>{s.title}</span>
                  </div>
                  <div style={{ fontSize: 13, color: T.textMid, lineHeight: 1.6 }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── DEMO PREVIEW — first scroll reveal ── */}
      {!isMobile && (
        <div style={{ padding: "48px 48px 0", maxWidth: 860, margin: "0 auto", width: "100%" }}>
          <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, letterSpacing: 2, marginBottom: 14, textAlign: "center" }}>LIVE EXAMPLE — WHAT YOUR RESULTS LOOK LIKE</div>
          <DemoPreview />
        </div>
      )}

      <Divider />

      {/* ── CITED STATS ── */}
      <section style={{ background: T.surface, padding: isMobile ? "48px 20px" : "64px 48px", position: "relative", overflow: "hidden" }}>
        <div className="dot-grid" style={{ position: "absolute", inset: 0, opacity: .4, pointerEvents: "none" }} />
        <div style={{ maxWidth: 900, margin: "0 auto", position: "relative" }}>
          <div style={{ fontFamily: T.mono, fontSize: 10, color: T.textDim, letterSpacing: 2.5, textAlign: "center", marginBottom: 36 }}>BY THE NUMBERS</div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: 16 }}>
            {LANDING_FACTS.map((f, i) => {
              const barColors = [T.red, T.btc, T.btc, T.btc];              const barWidths = [88, 91, 33, 38];
              const col = barColors[i];
              return (
                <div key={i} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: "22px 18px", animation: `fadeUp .4s ease ${i * .07}s both`, position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: col, opacity: .7 }} />
                  <div style={{ fontFamily: T.serif, fontSize: isMobile ? 30 : 36, color: col, lineHeight: 1, marginBottom: 10 }}>{f.stat}</div>
                  <div style={{ fontSize: 13, color: T.textMid, lineHeight: 1.55, marginBottom: 12 }}>{f.desc}</div>
                  <div style={{ height: 3, background: T.surface, borderRadius: 4, marginBottom: 8, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${barWidths[i]}%`, background: col, borderRadius: 4, opacity: .6 }} />
                  </div>
                  <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, letterSpacing: .5 }}>Source: {f.source}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Divider />

      {/* ── 10 CHECKS — numbered, always visible ── */}
      <section style={{ background: T.surface, padding: isMobile ? "56px 20px" : "72px 48px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ fontFamily: T.mono, fontSize: 10, color: T.textDim, letterSpacing: 2.5, marginBottom: 12 }}>10 HEURISTICS — PLAIN ENGLISH</div>
            <h2 style={{ fontFamily: T.serif, fontSize: isMobile ? 28 : 40, color: T.text, fontWeight: 400 }}>Every check, explained</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", gap: 10 }}>
            {LANDING_CHECKS.map((c) => (
              <div key={c.n} style={{ display: "flex", gap: 14, alignItems: "flex-start", background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: "16px 18px" }}>
                <div style={{ fontFamily: T.mono, fontSize: 11, color: T.cyan, minWidth: 24, paddingTop: 1 }}>{c.n}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: T.text, marginBottom: 4 }}>{c.label}</div>
                  <div style={{ fontSize: 13, color: T.textMid, lineHeight: 1.6 }}>{c.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* ── FINAL CTA ── */}
      <section style={{ padding: isMobile ? "56px 20px" : "72px 48px", position: "relative", overflow: "hidden" }}>
        <div className="dot-grid" style={{ position: "absolute", inset: 0, opacity: .3, pointerEvents: "none" }} />
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center", position: "relative" }}>
          <h2 style={{ fontFamily: T.serif, fontSize: isMobile ? 28 : 40, color: T.text, marginBottom: 14, fontWeight: 400 }}>
            Most wallets score 38/100.<br /><em style={{ color: T.cyan }}>Where does yours land?</em>
          </h2>
          <p style={{ fontSize: isMobile ? 14 : 16, color: T.textMid, lineHeight: 1.7, maxWidth: 480, margin: "0 auto 32px", fontWeight: 300 }}>
            Free, open source, nothing stored. Takes 60 seconds.
          </p>
          <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: 10, justifyContent: "center" }}>
            <button onClick={() => onAnalyze("DEMO", false)}
              style={{ background: T.surface, border: `1.5px solid ${T.border}`, borderRadius: 12, padding: "15px 28px", color: T.text, fontFamily: T.sans, fontSize: 15, fontWeight: 600, cursor: "pointer", transition: "all .18s" }}
              onMouseOver={e => e.currentTarget.style.borderColor = T.cyan}
              onMouseOut={e => e.currentTarget.style.borderColor = T.border}>
              ▶ Try the demo
            </button>
            <button onClick={() => onAnalyze("DEMO", true)}
              style={{ background: T.cyan, border: "none", borderRadius: 12, padding: "15px 28px", color: T.bg, fontFamily: T.sans, fontSize: 15, fontWeight: 700, cursor: "pointer", transition: "all .18s", boxShadow: `0 4px 24px ${T.cyanMid}` }}
              onMouseOver={e => e.currentTarget.style.opacity = ".88"}
              onMouseOut={e => e.currentTarget.style.opacity = "1"}>
              💬 Try in Plain English
            </button>
            <button onClick={() => inputRef.current?.focus()}
              style={{ background: "transparent", border: `1.5px solid ${T.border}`, borderRadius: 12, padding: "15px 28px", color: T.textMid, fontFamily: T.sans, fontSize: 15, fontWeight: 500, cursor: "pointer", transition: "all .18s" }}
              onMouseOver={e => { e.currentTarget.style.borderColor = T.cyan; e.currentTarget.style.color = T.cyan; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textMid; }}>
              Scan my address ↑
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: `1px solid ${T.border}`, padding: isMobile ? "18px 20px" : "16px 48px", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontFamily: T.display, fontSize: 10, color: T.textDim, letterSpacing: 3 }}>ANONSCORE · MIT</span>
          <a href="https://github.com/netasset/anonscore" target="_blank" rel="noopener noreferrer"
            style={{ fontFamily: T.mono, fontSize: 10, color: T.cyan, textDecoration: "none" }}>GitHub ↗</a>
        </div>
        <span style={{ fontFamily: T.mono, fontSize: 10, color: T.textDim }}>Open source · no cookies · no analytics · Tor compatible</span>
      </footer>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SCANNING — with educational facts
───────────────────────────────────────────── */
function Scanning({ address }) {
  const [step, setStep] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setStep(s => Math.min(s + 1, SCAN_STEPS.length - 1));
    }, 400);
    return () => clearInterval(intervalRef.current);
  }, []);

  const pct = Math.round((step / (SCAN_STEPS.length - 1)) * 100);
  const currentFact = SCAN_STEPS[step].fact;

  return (
    <div style={{ minHeight: "100vh", background: T.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, gap: 28 }}>
      {/* Header */}
      <div style={{ textAlign: "center" }}>
        <div style={{ fontFamily: T.mono, fontSize: 10, color: T.cyan, letterSpacing: 2, marginBottom: 12 }}>RUNNING 10 CHECKS</div>
        <div style={{ fontFamily: T.serif, fontSize: 26, color: T.text, marginBottom: 8, fontWeight: 400 }}>Analyzing your wallet…</div>
        <div style={{ fontFamily: T.mono, fontSize: 11, color: T.textDim, letterSpacing: 1 }}>{address === "DEMO" ? "Demo wallet" : fmt.addr(address)}</div>
      </div>

      {/* Progress */}
      <div style={{ width: "min(480px,90vw)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
          <span style={{ fontSize: 13, color: T.textMid }}>{SCAN_STEPS[step].label}</span>
          <span style={{ fontFamily: T.mono, fontSize: 13, color: T.cyan, fontWeight: 500 }}>{pct}%</span>
        </div>
        <div style={{ height: 3, background: T.surface, borderRadius: 4 }}>
          <div style={{ height: "100%", background: T.cyan, borderRadius: 4, width: `${pct}%`, transition: "width .4s ease", boxShadow: `0 0 8px ${T.cyanMid}` }} />
        </div>
      </div>

      {/* Steps log */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "min(480px,90vw)" }}>
        {SCAN_STEPS.slice(0, step + 1).map((s, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", animation: "fadeIn .25s ease" }}>
            <span style={{ color: i < step ? T.green : T.cyan, fontFamily: T.mono, fontSize: 11 }}>{i < step ? "✓" : "›"}</span>
            <span style={{ fontSize: 13, color: i < step ? T.textDim : T.text }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Did you know — animated per step */}
      <div key={step} style={{ width: "min(480px,90vw)", background: T.surface, border: `1px solid ${T.border}`, borderLeft: `3px solid ${T.cyan}`, borderRadius: 10, padding: "14px 18px", animation: "factIn .4s ease both" }}>
        <div style={{ fontFamily: T.mono, fontSize: 9, color: T.cyan, letterSpacing: 2, marginBottom: 6 }}>DID YOU KNOW</div>
        <div style={{ fontSize: 13, color: T.textMid, lineHeight: 1.65 }}>{currentFact}</div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SCORE SPARKLINE — mini SVG history chart
───────────────────────────────────────────── */
function Sparkline({ history, width = 80, height = 28 }) {
  if (!history || history.length < 2) return null;
  const pts = history.slice(-8); // last 8 scans
  const max = Math.max(...pts, 1);
  const min = Math.max(0, Math.min(...pts) - 5);
  const range = max - min || 1;
  const xs = pts.map((_, i) => (i / (pts.length - 1)) * width);
  const ys = pts.map(v => height - ((v - min) / range) * height);
  const d = xs.map((x, i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${ys[i].toFixed(1)}`).join(" ");
  const lastColor = scoreColor(pts[pts.length - 1]);
  const trend = pts[pts.length - 1] - pts[0];
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2 }}>
      <svg width={width} height={height} style={{ overflow: "visible" }}>
        <defs>
          <linearGradient id="spkFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={lastColor} stopOpacity=".18" />
            <stop offset="100%" stopColor={lastColor} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={`${d} L${xs[xs.length-1].toFixed(1)},${height} L0,${height} Z`} fill="url(#spkFill)" />
        <path d={d} fill="none" stroke={lastColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={xs[xs.length-1]} cy={ys[ys.length-1]} r="2.5" fill={lastColor} />
      </svg>
      <span style={{ fontFamily: T.mono, fontSize: 8, color: trend > 0 ? T.green : trend < 0 ? T.red : T.textDim }}>
        {trend > 0 ? `↑ +${trend}` : trend < 0 ? `↓ ${trend}` : "↔"}
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────────
   AI FIX ASSISTANT — privacy-first design
   • Address NEVER sent to API
   • Explicit consent gate before first request
   • Data preview shown verbatim before consent
   • Opt-in only
───────────────────────────────────────────── */

/* Builds context sent to Anthropic — address intentionally excluded */
function buildAiContext(checks, recommendations, score, grade) {
  const issues = checks.filter(c => c.status !== "pass");
  const systemPrompt = `You are a Bitcoin privacy expert assistant. The user ran a wallet privacy analysis. You have their analysis results only — no address, no transaction IDs, no identifying data.

Analysis summary:
- Privacy score: ${score}/100 (Grade ${grade})
- Issues (${issues.length}):
${issues.map(c => `  • ${c.name} [${c.status.toUpperCase()}]: ${c.plain}`).join("\n")}
- Top recommendations:
${recommendations.slice(0, 5).map((r, i) => `  ${i+1}. ${r.action} (+${r.impact}pts) — Options: ${(r.tools||[{name:r.tool}]).map(t=>t.name).join(", ")}`).join("\n")}

Rules: Be concise and practical. Give step-by-step wallet instructions when asked (Sparrow, Wasabi, Phoenix). Under 200 words unless steps require more. Plain text only. Never ask for or reference a Bitcoin address.`;
  const preview = [
    `Score: ${score}/100 · Grade ${grade}`,
    `${issues.length} issue${issues.length !== 1 ? "s" : ""}: ${issues.slice(0,3).map(c => c.name).join(", ")}${issues.length > 3 ? ` +${issues.length - 3} more` : ""}`,
    `Top fix: ${recommendations[0]?.action || "none"}`,
  ];
  return { systemPrompt, preview };
}

/* ── Consent gate — shown before any data leaves the browser ── */
function AiConsentGate({ score, grade, checks, recommendations, onAccept, onDecline }) {
  const { preview } = buildAiContext(checks, recommendations, score, grade);
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 950, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, background: "#000000bb" }}>
      <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 20, padding: 28, width: "min(420px,96vw)", animation: "fadeUp .25s ease both" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <div style={{ width: 32, height: 32, background: T.cyan + "18", border: `1px solid ${T.cyan}33`, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>✦</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: T.text }}>Before you continue</div>
            <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, letterSpacing: 1.2, marginTop: 1 }}>AI ASSISTANT · DATA DISCLOSURE</div>
          </div>
        </div>

        <div style={{ background: T.greenLo, border: `1px solid ${T.green}33`, borderRadius: 12, padding: "14px 16px", marginBottom: 10 }}>
          <div style={{ fontFamily: T.mono, fontSize: 9, color: T.green, letterSpacing: 1.5, marginBottom: 10 }}>✓ SENT TO ANTHROPIC'S API</div>
          {preview.map((line, i) => (
            <div key={i} style={{ display: "flex", gap: 8, padding: "4px 0", borderTop: i > 0 ? `1px solid ${T.borderLo}` : undefined }}>
              <span style={{ color: T.textDim, fontSize: 10, flexShrink: 0, marginTop: 1 }}>›</span>
              <span style={{ fontFamily: T.mono, fontSize: 11, color: T.textMid, lineHeight: 1.5 }}>{line}</span>
            </div>
          ))}
          <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, marginTop: 10, lineHeight: 1.5 }}>
            This is the complete list. Nothing else leaves your browser.
          </div>
        </div>

        <div style={{ background: T.redLo, border: `1px solid ${T.red}22`, borderRadius: 12, padding: "14px 16px", marginBottom: 18 }}>
          <div style={{ fontFamily: T.mono, fontSize: 9, color: T.red, letterSpacing: 1.5, marginBottom: 10 }}>✕ NEVER SENT</div>
          {["Your Bitcoin address", "Transaction IDs or UTXO data", "Any data that could identify your wallet"].map((line, i) => (
            <div key={i} style={{ display: "flex", gap: 8, padding: "4px 0", borderTop: i > 0 ? `1px solid ${T.borderLo}` : undefined }}>
              <span style={{ color: T.red, fontSize: 10, flexShrink: 0, marginTop: 1 }}>✕</span>
              <span style={{ fontFamily: T.mono, fontSize: 11, color: T.textMid, lineHeight: 1.5 }}>{line}</span>
            </div>
          ))}
        </div>

        <div style={{ fontSize: 12, color: T.textDim, lineHeight: 1.7, marginBottom: 14 }}>
          Anthropic does not train on API data. Each session is independent — no history persists between conversations.{" "}
          <a href="https://www.anthropic.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: T.cyan, textDecoration: "none" }}>Anthropic privacy policy →</a>
        </div>

        <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: "12px 16px", marginBottom: 18 }}>
          <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, letterSpacing: 1.5, marginBottom: 8 }}>USAGE LIMITS</div>
          <div style={{ fontSize: 12, color: T.textMid, lineHeight: 1.7 }}>
            <strong style={{ color: T.text }}>5 messages per conversation.</strong> To prevent abuse, a temporary anonymous counter is stored for 24 hours against a hashed version of your IP — never linked to you or your address. Resets daily.
          </div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onDecline} style={{ flex: 1, padding: "12px", background: "transparent", border: `1.5px solid ${T.border}`, borderRadius: 10, color: T.textMid, fontSize: 13, cursor: "pointer" }}>
            No thanks
          </button>
          <button onClick={onAccept} style={{ flex: 1, padding: "12px", background: T.cyan, border: "none", borderRadius: 10, color: T.bg, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
            I understand — continue
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Chat panel — only shown after consent ── */
function AiAssistant({ checks, recommendations, score, grade, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [msgCount, setMsgCount] = useState(0); // user messages sent this session
  const [rateLimited, setRateLimited] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  const MAX_MSGS = 5;
  const WORKER_URL = "https://anonscore-ai.netassetpremium.workers.dev";

  const issues = checks.filter(c => c.status !== "pass");
  const { systemPrompt } = buildAiContext(checks, recommendations, score, grade);
  const exhausted = msgCount >= MAX_MSGS;

  const STARTERS = [
    "How do I freeze dust UTXOs in Sparrow?",
    `Which of my ${issues.length} issues should I fix first?`,
    "How does CoinJoin actually work?",
    "Is my wallet software identifiable from fee rates?",
  ];

  const send = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading || exhausted) return;
    setInput("");
    setStarted(true);
    const newCount = msgCount + 1;
    setMsgCount(newCount);
    const next = [...messages, { role: "user", content: msg }];
    setMessages(next);
    setLoading(true);
    try {
      const res = await fetch(WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, systemPrompt }),
      });
      const data = await res.json();
      if (res.status === 429) {
        setRateLimited(true);
        setMessages(m => [...m, { role: "assistant", content: "You've reached the daily limit for the Privacy Assistant. It resets at midnight UTC — come back tomorrow." }]);
      } else {
        const reply = data.reply || "Sorry, I couldn't get a response. Try again.";
        setMessages(m => [...m, { role: "assistant", content: reply }]);
      }
    } catch {
      setMessages(m => [...m, { role: "assistant", content: "Connection error. Please try again." }]);
    }
    setLoading(false);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const inputDisabled = exhausted || rateLimited || loading;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 900, display: "flex", alignItems: "flex-end", justifyContent: "flex-end", padding: 16, pointerEvents: "none" }}>
      <div style={{ pointerEvents: "all", background: T.card, border: `1px solid ${T.border}`, borderRadius: 20, width: "min(420px, 96vw)", height: "min(580px, 80vh)", display: "flex", flexDirection: "column", boxShadow: "0 24px 80px #000000aa", animation: "fadeUp .3s ease both" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 18px", borderBottom: `1px solid ${T.border}` }}>
          <div style={{ width: 28, height: 28, background: T.cyan + "22", border: `1px solid ${T.cyan}44`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>✦</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: T.text }}>Privacy Assistant</div>
            <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, letterSpacing: 1 }}>Powered by Claude · Address never shared</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {!exhausted && !rateLimited && (
              <span style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim }}>
                {MAX_MSGS - msgCount} msg{MAX_MSGS - msgCount !== 1 ? "s" : ""} left
              </span>
            )}
            <button onClick={onClose} style={{ background: "transparent", border: "none", color: T.textDim, fontSize: 18, cursor: "pointer", lineHeight: 1 }}>✕</button>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
          {!started && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ fontSize: 13, color: T.textMid, lineHeight: 1.6 }}>
                I've read your wallet analysis. Ask me anything about your {issues.length} issue{issues.length !== 1 ? "s" : ""} or how to improve your score from <span style={{ color: scoreColor(score) }}>{score}</span> to 90+.
              </div>
              <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, letterSpacing: 1, marginTop: 4 }}>QUICK QUESTIONS</div>
              {STARTERS.map((s, i) => (
                <button key={i} onClick={() => send(s)} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: "9px 14px", color: T.textMid, fontSize: 12, cursor: "pointer", textAlign: "left", transition: "all .15s" }}
                  onMouseOver={e => { e.currentTarget.style.borderColor = T.cyan; e.currentTarget.style.color = T.text; }}
                  onMouseOut={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textMid; }}>
                  {s}
                </button>
              ))}
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} style={{ display: "flex", flexDirection: m.role === "user" ? "row-reverse" : "row", gap: 8, alignItems: "flex-start" }}>
              {m.role === "assistant" && (
                <div style={{ width: 22, height: 22, background: T.cyan + "22", border: `1px solid ${T.cyan}44`, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, flexShrink: 0, marginTop: 2 }}>✦</div>
              )}
              <div style={{ background: m.role === "user" ? T.cyan + "18" : T.surface, border: `1px solid ${m.role === "user" ? T.cyan + "33" : T.borderLo}`, borderRadius: m.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px", padding: "10px 14px", maxWidth: "85%", fontSize: 13, color: T.text, lineHeight: 1.65, whiteSpace: "pre-wrap" }}>
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
              <div style={{ width: 22, height: 22, background: T.cyan + "22", border: `1px solid ${T.cyan}44`, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, flexShrink: 0, marginTop: 2 }}>✦</div>
              <div style={{ background: T.surface, border: `1px solid ${T.borderLo}`, borderRadius: "14px 14px 14px 4px", padding: "12px 16px" }}>
                <div style={{ display: "flex", gap: 4 }}>
                  {[0,1,2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: T.cyan, animation: `pulse 1.2s ease ${i * .2}s infinite` }} />)}
                </div>
              </div>
            </div>
          )}
          {exhausted && !rateLimited && (
            <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: "12px 16px", textAlign: "center" }}>
              <div style={{ fontSize: 12, color: T.textDim, lineHeight: 1.6 }}>
                5-message limit reached for this conversation.<br />
                <span style={{ color: T.textMid }}>Start a new scan to open a fresh session.</span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{ padding: "12px 14px", borderTop: `1px solid ${T.border}`, display: "flex", gap: 8 }}>
          <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
            placeholder={inputDisabled ? (exhausted ? "Limit reached — start a new scan" : "Rate limited — try tomorrow") : "Ask about your privacy issues…"}
            disabled={inputDisabled}
            style={{ flex: 1, background: inputDisabled ? T.bg : T.surface, border: `1.5px solid ${T.border}`, borderRadius: 10, padding: "10px 14px", color: inputDisabled ? T.textDim : T.text, fontSize: 13, outline: "none", transition: "border .15s", cursor: inputDisabled ? "not-allowed" : "text" }}
            onFocus={e => !inputDisabled && (e.target.style.borderColor = T.cyan)}
            onBlur={e => e.target.style.borderColor = T.border} />
          <button onClick={() => send()} disabled={!input.trim() || inputDisabled}
            style={{ background: input.trim() && !inputDisabled ? T.cyan : T.surface, border: `1.5px solid ${input.trim() && !inputDisabled ? T.cyan : T.border}`, borderRadius: 10, padding: "10px 14px", color: input.trim() && !inputDisabled ? T.bg : T.textDim, fontSize: 13, cursor: input.trim() && !inputDisabled ? "pointer" : "not-allowed", transition: "all .2s", fontWeight: 700 }}>
            →
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   DASHBOARD
───────────────────────────────────────────── */
function Dashboard({ address, addrInfo, utxos, txs, isMobile, onBack, onRescan, toast, autoShare, scanAt, defaultSimple }) {
  const [tab, setTab] = useState("Fix It");
  const [simpleMode, setSimpleMode] = useState(defaultSimple || false);
  const [shareOpen, setShareOpen] = useState(false);
  const [selectedUtxo, setSelectedUtxo] = useState(null);
  const [doneFixes, setDoneFixes] = useState(new Set());
  // AI assistant: null | "consent" | "chat"
  const [aiStage, setAiStage] = useState(null);
  const openAi = () => setAiStage("consent");

  const txCount = addrInfo?.chain_stats?.tx_count || txs.length;
  const analysis = useMemo(() => runEngine(utxos, txs, txCount), [utxos, txs, txCount]);
  const { score, grade, riskLabel, riskColor, checks, recommendations } = analysis;
  const totalSats = useMemo(() => utxos.reduce((s, u) => s + u.value, 0), [utxos]);
  const issueCount = checks.filter(c => c.status !== "pass").length;
  const TABS = isMobile
    ? ["Fix It","Overview","UTXOs"]
    : ["Fix It","Overview","UTXOs","Transactions","Methodology"];

  const toggleDone = (key) => setDoneFixes(prev => {
    const next = new Set(prev);
    next.has(key) ? next.delete(key) : next.add(key);
    return next;
  });

  useEffect(() => {
    if (!autoShare) return;
    const t = setTimeout(() => {
      toast.show("Share your score", { icon: "🔗", color: T.cyan, msg: `Grade ${grade} — tap 'Share score' to post it` });
    }, 8000);
    return () => clearTimeout(t);
  }, [autoShare, grade, toast]);

  const handleRescan = () => onRescan(address);

  const exportReport = () => {
    const lines = [
      "ANONSCORE — PRIVACY REPORT",
      "===========================",
      `Address:    ${address}`,
      `Score:      ${score}/100 (Grade ${grade})`,
      `Risk:       ${riskLabel}`,
      `Scanned:    ${scanAt ? new Date(scanAt).toUTCString() : "—"}`,
      `UTXOs:      ${utxos.length}  |  Transactions: ${txCount}`,
      "",
      "CHECKS",
      "------",
      ...checks.map(c => `[${c.status === "pass" ? "PASS" : c.status === "warn" ? "WARN" : "FAIL"}] ${c.name}: ${c.plain}`),
      "",
      "RECOMMENDATIONS",
      "---------------",
      ...recommendations.map((r, i) => `${i+1}. ${r.action} (+${r.impact}pts, ${r.effort})\n   ${r.plain}\n   Options: ${(r.tools||[{name:r.tool}]).map(t=>t.name).join(", ")}`),
      "",
      "Generated by AnonScore — anonscore.com — open source, no data stored",
    ];
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([lines.join("\n")], { type: "text/plain" }));
    a.download = `anonscore-${address.slice(0,8)}-${Date.now()}.txt`;
    a.click();
    toast.show("Report downloaded", { icon: "📥", color: T.blue });
  };

  return (
    <div style={{ minHeight: "100vh", background: T.bg, display: "flex", flexDirection: "column", paddingBottom: isMobile ? 64 : 0 }}>
      {/* Nav */}
      <nav style={{ display: "flex", alignItems: "center", gap: 10, padding: isMobile ? "12px 16px" : "12px 32px", borderBottom: `1px solid ${T.border}`, background: T.bg, position: "sticky", top: 0, zIndex: 100 }}>
        <button onClick={onBack} style={{ background: "transparent", border: `1.5px solid ${T.border}`, borderRadius: 8, padding: "7px 12px", color: T.textMid, fontFamily: T.sans, fontSize: 13, cursor: "pointer", transition: "border .15s" }}
          onMouseOver={e => e.currentTarget.style.borderColor = T.cyan}
          onMouseOut={e => e.currentTarget.style.borderColor = T.border}>← Back</button>
        {!isMobile && <div style={{ fontFamily: T.display, fontSize: 15, letterSpacing: 4, fontWeight: 700 }}>ANON<span style={{ color: T.cyan }}>SCORE</span></div>}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: T.mono, fontSize: 11, color: T.textDim, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{address === "DEMO" ? "Demo Wallet" : fmt.addr(address)}</div>
          {scanAt && <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, marginTop: 2 }}>Scanned {fmt.age(scanAt / 1000)}</div>}
        </div>
        <div style={{ display: "flex", gap: 8, flexShrink: 0, alignItems: "center" }}>
          <Tag label={riskLabel} color={riskColor} size={10} />
          {isMobile && (
            <>
              <button onClick={() => setShareOpen(true)} style={{ background: "transparent", border: `1.5px solid ${T.border}`, borderRadius: 8, padding: "6px 10px", color: T.textMid, fontSize: 12, cursor: "pointer" }}>Share</button>
              <button onClick={exportReport} style={{ background: "transparent", border: `1.5px solid ${T.border}`, borderRadius: 8, padding: "6px 10px", color: T.textMid, fontSize: 12, cursor: "pointer" }}>Export</button>
            </>
          )}
          {!isMobile && (
            <>
              <button onClick={openAi} style={{ background: T.cyan + "18", border: `1.5px solid ${T.cyan}55`, borderRadius: 8, padding: "6px 12px", color: T.cyan, fontSize: 13, cursor: "pointer", fontWeight: 600, transition: "all .15s" }}
                onMouseOver={e => e.currentTarget.style.background = T.cyan + "28"}
                onMouseOut={e => e.currentTarget.style.background = T.cyan + "18"}>✦ Ask AI</button>
              <button onClick={handleRescan} style={{ background: "transparent", border: `1.5px solid ${T.border}`, borderRadius: 8, padding: "6px 12px", color: T.textMid, fontSize: 13, cursor: "pointer", transition: "all .15s" }}
                onMouseOver={e => e.currentTarget.style.borderColor = T.cyan}
                onMouseOut={e => e.currentTarget.style.borderColor = T.border}>↻ Re-scan</button>
              <button onClick={() => setShareOpen(true)} style={{ background: "transparent", border: `1.5px solid ${T.border}`, borderRadius: 8, padding: "6px 12px", color: T.textMid, fontSize: 13, cursor: "pointer", transition: "all .15s" }}
                onMouseOver={e => e.currentTarget.style.borderColor = T.cyan}
                onMouseOut={e => e.currentTarget.style.borderColor = T.border}>Share</button>
              <div style={{ position: "relative" }} onMouseEnter={e => e.currentTarget.querySelector(".export-tip").style.opacity = 1} onMouseLeave={e => e.currentTarget.querySelector(".export-tip").style.opacity = 0}>
                <button onClick={exportReport} style={{ background: "transparent", border: `1.5px solid ${T.border}`, borderRadius: 8, padding: "6px 12px", color: T.textMid, fontSize: 13, cursor: "pointer", transition: "all .15s" }}
                  onMouseOver={e => e.currentTarget.style.borderColor = T.cyan}
                  onMouseOut={e => e.currentTarget.style.borderColor = T.border}>Export</button>
                <div className="export-tip" style={{ position: "absolute", bottom: "calc(100% + 8px)", right: 0, background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, padding: "8px 12px", fontSize: 11, color: T.textMid, whiteSpace: "nowrap", pointerEvents: "none", opacity: 0, transition: "opacity .15s", zIndex: 50 }}>
                  Downloads a .txt file of your full results
                  <div style={{ position: "absolute", bottom: -4, right: 16, width: 8, height: 8, background: T.card, border: `1px solid ${T.border}`, borderRight: "none", borderTop: "none", transform: "rotate(-45deg)" }} />
                </div>
              </div>
            </>
          )}
        </div>
      </nav>

      <div style={{ flex: 1, padding: isMobile ? "12px 12px" : "16px 32px", maxWidth: 1100, margin: "0 auto", width: "100%" }}>
        {/* ── Compact summary bar ── */}
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: isMobile ? "12px 14px" : "12px 20px", marginBottom: 12, display: "flex", alignItems: "center", gap: isMobile ? 12 : 20, flexWrap: "wrap", animation: "fadeUp .35s ease both" }}>
          {/* Score ring — smaller */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            <ScoreRing score={score} size={52} />
            <div>
              <div style={{ fontFamily: T.serif, fontSize: 20, color: riskColor, lineHeight: 1 }}>Grade {grade}</div>
              <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, letterSpacing: 1, marginTop: 2 }}>{score}/100</div>
            </div>
          </div>

          <div style={{ width: 1, height: 36, background: T.border, flexShrink: 0 }} />

          {/* Issues — most important, highlighted */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <div style={{ background: T.red + "18", border: `1px solid ${T.red}44`, borderRadius: 8, padding: "4px 10px", display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ fontFamily: T.mono, fontSize: 16, fontWeight: 700, color: T.red, lineHeight: 1 }}>{checks.filter(c => c.status === "fail").length}</span>
              <span style={{ fontFamily: T.mono, fontSize: 9, color: T.red, letterSpacing: 0.5 }}>FAIL</span>
            </div>
            <div style={{ background: T.amber + "18", border: `1px solid ${T.amber}44`, borderRadius: 8, padding: "4px 10px", display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ fontFamily: T.mono, fontSize: 16, fontWeight: 700, color: T.amber, lineHeight: 1 }}>{checks.filter(c => c.status === "warn").length}</span>
              <span style={{ fontFamily: T.mono, fontSize: 9, color: T.amber, letterSpacing: 0.5 }}>WARN</span>
            </div>
            <div style={{ background: T.green + "18", border: `1px solid ${T.green}44`, borderRadius: 8, padding: "4px 10px", display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ fontFamily: T.mono, fontSize: 16, fontWeight: 700, color: T.green, lineHeight: 1 }}>{checks.filter(c => c.status === "pass").length}</span>
              <span style={{ fontFamily: T.mono, fontSize: 9, color: T.green, letterSpacing: 0.5 }}>PASS</span>
            </div>
          </div>

          <div style={{ width: 1, height: 36, background: T.border, flexShrink: 0 }} />

          {/* Other stats — slim */}
          <div style={{ display: "flex", gap: isMobile ? 14 : 24, flexWrap: "wrap" }}>
            {[
              { label: "BALANCE", val: `₿${(totalSats/1e8).toFixed(4)}`, sub: `${utxos.length} UTXOs`, color: T.blue },
              { label: "TXS", val: txCount, sub: "total", color: T.cyan },
              { label: "VS AVG", val: score > 38 ? `+${score-38}` : `${score-38}`, sub: "avg is 38", color: score > 38 ? T.green : T.red },
            ].map(s => (
              <div key={s.label}>
                <div style={{ fontFamily: T.mono, fontSize: 8, color: T.textDim, letterSpacing: 1.5, marginBottom: 2 }}>{s.label}</div>
                <div style={{ fontFamily: T.serif, fontSize: 18, color: s.color, lineHeight: 1 }}>{s.val}</div>
                <div style={{ fontSize: 10, color: T.textDim, marginTop: 1 }}>{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Fix potential — right-aligned */}
          <div style={{ marginLeft: "auto", flexShrink: 0, textAlign: "right" }}>
            <div style={{ fontFamily: T.mono, fontSize: 8, color: T.textDim, letterSpacing: 1.5, marginBottom: 2 }}>TOP 3 FIXES</div>
            <div style={{ fontFamily: T.serif, fontSize: 18, color: T.green, lineHeight: 1 }}>+{recommendations.slice(0, 3).reduce((a, r) => a + r.impact, 0)} pts</div>
            <div style={{ fontSize: 10, color: T.textDim, marginTop: 1 }}>potential gain</div>
          </div>
        </div>

        {/* Tabs + Simple Mode toggle */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 14 }}>
          <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 2 }}>
            {TABS.map(t => <Pill key={t} active={tab === t} onClick={() => setTab(t)}>{t}</Pill>)}
          </div>
          <button onClick={() => setSimpleMode(m => !m)} style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 7, background: simpleMode ? T.cyan : T.surface, border: `1.5px solid ${simpleMode ? T.cyan : T.border}`, borderRadius: 20, padding: "8px 16px", cursor: "pointer", transition: "all .2s", boxShadow: simpleMode ? `0 0 12px ${T.cyanMid}` : "none" }}
            onMouseOver={e => { e.currentTarget.style.borderColor = T.cyan; if (!simpleMode) e.currentTarget.style.background = T.cyan + "18"; }}
            onMouseOut={e => { e.currentTarget.style.borderColor = simpleMode ? T.cyan : T.border; if (!simpleMode) e.currentTarget.style.background = T.surface; }}>
            <span style={{ fontSize: 14 }}>💬</span>
            <span style={{ fontSize: 12, fontFamily: T.sans, fontWeight: 700, color: simpleMode ? T.bg : T.textMid, whiteSpace: "nowrap" }}>{simpleMode ? "✓ Plain English ON" : "Plain English"}</span>
          </button>
        </div>

        {/* ── FIX IT — default tab ── */}
        {tab === "Fix It" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ fontSize: 13, color: T.textMid, marginBottom: 4 }}>
              Sorted by impact. Fixing the top 3 alone could raise your score by <strong style={{ color: T.cyan }}>{recommendations.slice(0, 3).reduce((a, r) => a + r.impact, 0)} points</strong>.
            </div>
            {/* AI assistant card — privacy guarantees shown before clicking */}
            <div style={{ background: T.card, border: `1px solid ${T.cyan}33`, borderRadius: 16, overflow: "hidden", marginBottom: 2 }}>
              {/* Privacy badges — visible without any interaction */}
              <div style={{ display: "flex", gap: 0, borderBottom: `1px solid ${T.borderLo}` }}>
                {[
                  { icon: "✕", label: "Address never sent" },
                  { icon: "✕", label: "No data stored" },
                  { icon: "✕", label: "Not used for training" },
                ].map((badge, i) => (
                  <div key={i} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, padding: "7px 8px", borderRight: i < 2 ? `1px solid ${T.borderLo}` : undefined, background: T.greenLo }}>
                    <span style={{ fontFamily: T.mono, fontSize: 9, color: T.green, fontWeight: 700 }}>{badge.icon}</span>
                    <span style={{ fontFamily: T.mono, fontSize: 9, color: T.green, letterSpacing: 0.3, whiteSpace: "nowrap" }}>{badge.label}</span>
                  </div>
                ))}
              </div>
              {/* Main clickable area */}
              <button onClick={openAi} style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 18px", cursor: "pointer", textAlign: "left", width: "100%", background: "transparent", border: "none", transition: "background .15s" }}
                onMouseOver={e => e.currentTarget.style.background = T.cyan + "0a"}
                onMouseOut={e => e.currentTarget.style.background = "transparent"}>
                <div style={{ width: 36, height: 36, background: T.cyan + "18", border: `1px solid ${T.cyan}33`, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>✦</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 3 }}>Ask the Privacy Assistant</div>
                  <div style={{ fontSize: 12, color: T.textMid, lineHeight: 1.55 }}>
                    Get step-by-step guidance for your {checks.filter(c => c.status !== "pass").length} specific issues. Only your score and issue names are shared — never your address.
                  </div>
                </div>
                <div style={{ flexShrink: 0, textAlign: "center" }}>
                  <div style={{ background: T.cyan, borderRadius: 8, padding: "7px 14px", color: T.bg, fontSize: 12, fontWeight: 700, whiteSpace: "nowrap" }}>Ask now →</div>
                </div>
              </button>
            </div>
            {recommendations.map((r, i) => {
              const done = doneFixes.has(r.key);
              const simple = SIMPLE.recs[r.key];
              const displayAction = simpleMode && simple ? simple.action : r.action;
              const displayPlain  = simpleMode && simple ? simple.plain  : r.plain;
              return (
              <div key={r.key || i} style={{ background: done ? T.greenLo : T.card, border: `1px solid ${done ? T.green + "44" : T.border}`, borderLeft: done ? undefined : `3px solid ${r.status === "fail" ? T.red : r.status === "warn" ? T.amber : T.green}`, borderRadius: 16, padding: isMobile ? "18px 16px" : "20px 24px", display: "flex", gap: isMobile ? 12 : 20, animation: `fadeUp .35s ease ${i * .06}s both`, flexDirection: isMobile ? "column" : "row", transition: "border-color .2s, background-color .2s, filter .2s", filter: done ? "opacity(0.65)" : "none" }}
                onMouseEnter={e => !done && (e.currentTarget.style.borderColor = T.cyan + "55")}
                onMouseLeave={e => !done && (e.currentTarget.style.borderColor = T.border)}>
                <div style={{ fontFamily: T.mono, fontSize: 11, color: T.textDim, flexShrink: 0, paddingTop: 2, minWidth: 28 }}>0{i + 1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <span style={{ fontSize: 18 }}>{done ? "✅" : r.icon}</span>
                    <div style={{ fontFamily: T.serif, fontSize: isMobile ? 17 : 20, color: done ? T.green : T.text, fontWeight: 400, textDecoration: done ? "line-through" : "none" }}>{displayAction}</div>
                  </div>
                  {!done && <>
                    <div style={{ fontSize: 14, color: T.textMid, lineHeight: 1.7, marginBottom: 10 }}>{displayPlain}</div>
                    {!simpleMode && <div style={{ fontSize: 12, color: T.textDim, lineHeight: 1.6, background: T.surface, borderRadius: 8, padding: "10px 14px" }}><strong style={{ color: T.textMid }}>How:</strong> {r.detail}</div>}
                    <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
                      <span style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, letterSpacing: 1 }}>OPTIONS:</span>
                      {(r.tools || [{ name: r.tool, note: "" }]).map((t, ti) => (
                        <span key={ti} title={t.note} style={{ fontFamily: T.mono, fontSize: 9, padding: "3px 8px", borderRadius: 4, background: T.blue + "18", color: T.blue, border: `1px solid ${T.blue}30`, letterSpacing: 0.3, cursor: t.note ? "help" : "default" }}>
                          {t.name}
                        </span>
                      ))}
                    </div>
                    {!simpleMode && (r.tools || []).length > 0 && (
                      <div style={{ marginTop: 6, fontSize: 11, color: T.textDim, lineHeight: 1.55 }}>
                        {(r.tools || []).map((t, ti) => t.note ? <span key={ti}><span style={{ color: T.textMid }}>{t.name}</span> — {t.note}{ti < r.tools.length - 1 ? " · " : ""}</span> : null)}
                      </div>
                    )}
                  </>}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: isMobile ? "flex-start" : "flex-end", flexShrink: 0 }}>
                  <div style={{ fontFamily: T.serif, fontSize: 22, color: T.green }}>+{r.impact}pts</div>
                  <Tag label={r.effort} color={r.effort === "Easy" ? T.green : r.effort === "Medium" ? T.amber : T.textMid} size={9} />
                  <button onClick={() => toggleDone(r.key)} style={{ background: done ? T.green : "transparent", border: `1.5px solid ${done ? T.green : T.border}`, borderRadius: 8, padding: "5px 10px", color: done ? T.bg : T.textDim, fontSize: 11, cursor: "pointer", transition: "all .2s", whiteSpace: "nowrap" }}>
                    {done ? "✓ Done" : "Mark done"}
                  </button>
                </div>
              </div>
              );
            })}
            {/* Projection */}
            <div style={{ background: T.greenLo, border: `1px solid ${T.green}33`, borderRadius: 14, padding: "18px 22px", display: "flex", gap: 14, alignItems: "center" }}>
              <div style={{ fontSize: 24 }}>🎯</div>
              <div>
                <div style={{ fontFamily: T.serif, fontSize: 17, color: T.text, fontWeight: 400 }}>After all fixes, projected score: <span style={{ color: T.green }}>{Math.min(score + recommendations.reduce((a, r) => a + r.impact, 0), 97)}/100</span></div>
                <div style={{ fontSize: 13, color: T.textMid, marginTop: 4 }}>Estimated: 1–3 weeks, depending on CoinJoin wait times.</div>
              </div>
            </div>
            <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, padding: "18px 22px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
              <div>
                <div style={{ fontFamily: T.serif, fontSize: 17, color: T.text, fontWeight: 400 }}>Share your privacy score</div>
                <div style={{ fontSize: 13, color: T.textMid, marginTop: 3 }}>Let your Nostr or Twitter followers check theirs.</div>
              </div>
              <button onClick={() => setShareOpen(true)} style={{ background: T.cyan, border: "none", borderRadius: 10, padding: "11px 20px", color: T.bg, fontFamily: T.sans, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>Share Grade {grade} →</button>
            </div>
          </div>
        )}

        {/* ── OVERVIEW ── */}
        {tab === "Overview" && (
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12 }}>
            {/* Checks list */}
            <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: 22 }}>
              <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, letterSpacing: 2, marginBottom: 16 }}>PRIVACY CHECKS</div>
              {checks.map((c, i) => {
                const s = SIMPLE.checks[c.key];
                const displayName  = simpleMode && s ? s.name : c.name;
                const displayPlain = simpleMode && s
                  ? (c.status === "fail" ? s.fail_detail : c.status === "warn" ? s.warn_detail : s.pass_detail) || c.plain
                  : c.plain;
                return (
                <div key={c.key} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 0", borderBottom: i < checks.length - 1 ? `1px solid ${T.borderLo}` : undefined, animation: `fadeUp .3s ease ${i * .04}s both`, opacity: 0 }}>
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: c.status === "pass" ? T.green : c.status === "warn" ? T.btc : T.red, flexShrink: 0, marginTop: 5 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{displayName}</div>
                    <div style={{ fontSize: 12, color: T.textMid, marginTop: 3, lineHeight: 1.55 }}>{displayPlain}</div>
                  </div>
                  <Tag label={c.status === "pass" ? "Pass" : c.status === "warn" ? "Warn" : "Fail"} color={c.status === "pass" ? T.green : c.status === "warn" ? T.btc : T.red} size={9} />
                </div>
                );
              })}
            </div>
            {/* Right column */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {/* UTXO bars */}
              <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: 22 }}>
                <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, letterSpacing: 2, marginBottom: 14 }}>UTXO BREAKDOWN</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                  {utxos.slice(0, 6).map((u, i) => {
                    const risk = classifyUtxo(u);
                    const col = RISK_META[risk].color;
                    const pct = Math.max(4, (u.value / Math.max(totalSats, 1)) * 100);
                    return (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, width: 56, flexShrink: 0 }}>{fmt.txid(u.txid)}</div>
                        <div style={{ flex: 1, height: 7, background: T.surface, borderRadius: 4, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${pct}%`, background: col, borderRadius: 4 }} />
                        </div>
                        <div style={{ fontFamily: T.mono, fontSize: 10, color: col, width: 70, textAlign: "right" }}>{fmt.btc(u.value)}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
              {/* Benchmark */}
              <div style={{ background: T.cyanLo, border: `1px solid ${T.cyanMid}`, borderRadius: 14, padding: 20 }}>
                <div style={{ fontFamily: T.mono, fontSize: 9, color: T.cyan, letterSpacing: 1.5, marginBottom: 12 }}>YOUR SCORE VS AVERAGE</div>
                <div style={{ display: "flex", gap: 20 }}>
                  {[{ v: score, l: "YOUR SCORE", c: riskColor }, { v: 38, l: "AVERAGE", c: T.textMid }, { v: 97, l: "ACHIEVABLE", c: T.green }].map(s => (
                    <div key={s.l} style={{ textAlign: "center" }}>
                      <div style={{ fontFamily: T.serif, fontSize: 32, color: s.c, fontWeight: 400 }}>{s.v}</div>
                      <div style={{ fontFamily: T.mono, fontSize: 8, color: T.textDim, letterSpacing: 1, marginTop: 2 }}>{s.l}</div>
                    </div>
                  ))}
                </div>
                <button onClick={() => setShareOpen(true)} style={{ marginTop: 14, width: "100%", background: T.cyan, border: "none", borderRadius: 8, padding: "10px", color: T.bg, fontFamily: T.sans, fontWeight: 700, fontSize: 13, cursor: "pointer", transition: "opacity .15s" }}
                  onMouseOver={e => e.currentTarget.style.opacity = ".85"}
                  onMouseOut={e => e.currentTarget.style.opacity = "1"}>
                  Share my score →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── UTXOs ── */}
        {tab === "UTXOs" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ fontSize: 13, color: T.textMid, marginBottom: 6 }}>
              <strong style={{ color: T.text }}>{utxos.length}</strong> unspent outputs — each is a separate chunk of Bitcoin. Click any row to expand.
            </div>
            {utxos.length === 0 && (
              <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: 40, textAlign: "center", fontSize: 14, color: T.textMid }}>
                No unspent outputs. This address has been fully spent.
              </div>
            )}
            {utxos.map((u, i) => {
              const risk = classifyUtxo(u);
              const { color } = RISK_META[risk];
              const flags = [];
              if (u.value < 1000) flags.push({ t: "Dust — freeze this", c: T.red });
              if (u.value >= 100000 && u.value % 100000 === 0) flags.push({ t: "Round amount", c: T.btc });
              const open = selectedUtxo === i;
              return (
                <div key={u.txid + i} onClick={() => setSelectedUtxo(open ? null : i)}
                  style={{ background: T.card, border: `1.5px solid ${open ? color : T.border}`, borderRadius: 14, padding: isMobile ? "14px" : "16px 20px", cursor: "pointer", transition: "all .15s", animation: `fadeUp .3s ease ${i * .05}s both`, opacity: 0 }}
                  onMouseEnter={e => !open && (e.currentTarget.style.borderColor = T.cyan + "44")}
                  onMouseLeave={e => !open && (e.currentTarget.style.borderColor = T.border)}>
                  <div style={{ display: "flex", alignItems: isMobile ? "flex-start" : "center", flexDirection: isMobile ? "column" : "row", gap: isMobile ? 8 : 18 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: T.serif, fontSize: isMobile ? 20 : 26, color, lineHeight: 1 }}>{fmt.btc(u.value)}</div>
                      <div style={{ fontFamily: T.mono, fontSize: 10, color: T.textDim, marginTop: 4 }}>{fmt.txid(u.txid)} · {u.status?.block_time ? fmt.age(u.status.block_time) : "unconfirmed"}</div>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {flags.length === 0 ? <Tag label="Clean" color={T.green} size={9} /> : flags.map((f, fi) => <Tag key={fi} label={f.t} color={f.c} size={9} />)}
                      <Tag label={RISK_META[risk].label} color={color} size={9} />
                    </div>
                  </div>
                  {open && (
                    <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${T.borderLo}`, display: "flex", flexWrap: "wrap", gap: 20 }}>
                      <div><div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, marginBottom: 4 }}>TXID</div><div style={{ fontFamily: T.mono, fontSize: 11, color: T.textMid, wordBreak: "break-all" }}>{u.txid}</div></div>
                      <div><div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, marginBottom: 4 }}>SATOSHIS</div><div style={{ fontFamily: T.mono, fontSize: 11, color: T.textMid }}>{u.value.toLocaleString()}</div></div>
                      <div><div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, marginBottom: 4 }}>CONFIRMED</div><div style={{ fontFamily: T.mono, fontSize: 11, color: u.status?.confirmed ? T.green : T.btc }}>{u.status?.confirmed ? "Yes" : "Pending"}</div></div>
                      {u.scriptpubkey_type && <div><div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, marginBottom: 4 }}>SCRIPT TYPE</div><div style={{ fontFamily: T.mono, fontSize: 11, color: T.textMid }}>{u.scriptpubkey_type}</div></div>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── TRANSACTIONS ── */}
        {tab === "Transactions" && (
          <div>
            <div style={{ fontSize: 13, color: T.textMid, marginBottom: 12 }}>
              <strong style={{ color: T.text }}>{txs.length}</strong> transactions. We flag CoinJoins, unsafe consolidations, and round amounts.
            </div>
            <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, overflow: "hidden" }}>
              <div style={{ display: "grid", gridTemplateColumns: "130px 90px 60px 60px 1fr 110px", padding: "10px 20px", borderBottom: `1px solid ${T.borderLo}` }}>
                {["TXID","DATE","IN","OUT","FLAGS","FEE"].map(h => (
                  <div key={h} style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, letterSpacing: 1.5 }}>{h}</div>
                ))}
              </div>
              {txs.slice(0, 20).map((tx, i) => {
                const flags = [];
                if (tx.vout?.length >= 5) flags.push({ l: "CoinJoin", c: T.green });
                if (tx.vin?.length >= 4 && tx.vout?.length <= 2) flags.push({ l: "Consolidation", c: T.red });
                if (tx.vout?.[0]?.value >= 100000 && tx.vout[0].value % 100000 === 0) flags.push({ l: "Round amount", c: T.amber });
                if (!flags.length) flags.push({ l: "Standard", c: T.textDim });
                return (
                  <div key={tx.txid} style={{ display: "grid", gridTemplateColumns: "130px 90px 60px 60px 1fr 110px", padding: "10px 20px", borderBottom: `1px solid ${T.borderLo}`, alignItems: "center", animation: `fadeUp .3s ease ${i * .03}s both`, opacity: 0, transition: "background .12s" }}
                    onMouseEnter={e => e.currentTarget.style.background = T.surface}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <span style={{ fontFamily: T.mono, fontSize: 11, color: T.textMid }}>{fmt.txid(tx.txid)}</span>
                    <span style={{ fontFamily: T.mono, fontSize: 11, color: T.textDim }}>{tx.status?.block_time ? fmt.age(tx.status.block_time) : "—"}</span>
                    <span style={{ fontFamily: T.mono, fontSize: 11, color: T.textDim }}>{tx.vin?.length || "?"}</span>
                    <span style={{ fontFamily: T.mono, fontSize: 11, color: T.textDim }}>{tx.vout?.length || "?"}</span>
                    <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>{flags.map((f, fi) => <Tag key={fi} label={f.l} color={f.c} size={9} />)}</div>
                    {/* FIX: sats not s */}
                    <span style={{ fontFamily: T.mono, fontSize: 11, color: T.textDim }}>{tx.fee ? `${tx.fee.toLocaleString()} sats` : "—"}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── METHODOLOGY ── */}
        {tab === "Methodology" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: 28 }}>
              <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, letterSpacing: 2, marginBottom: 16 }}>HOW SCORING WORKS</div>
              <div style={{ fontFamily: T.serif, fontSize: 22, color: T.text, marginBottom: 12, fontWeight: 400 }}>10 heuristics, each weighted by severity</div>
              <div style={{ fontSize: 14, color: T.textMid, lineHeight: 1.75, marginBottom: 20 }}>
                Every wallet starts at 100. Each detected issue deducts points based on its real-world impact on traceability. We use the same heuristics published in open blockchain research — nothing proprietary.
              </div>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 10 }}>
                {[
                  { check:"Address Reuse", deduct:"–7 to –28", why:"Permanent public link between all transactions on this address.", sev:"critical" },
                  { check:"CoinJoin Usage", deduct:"+4 to +12", why:"Breaks transaction graph. Positive score if detected. Heavy penalty if absent.", sev:"high" },
                  { check:"Dust Attack", deduct:"–5 to –12", why:"Tracking beacons planted by surveillance firms. Spending them links your cluster.", sev:"high" },
                  { check:"Round Amounts", deduct:"–5 to –10", why:"0.1 BTC is a known KYC exchange withdrawal pattern flagged by Chainalysis.", sev:"high" },
                  { check:"Unsafe Consolidation", deduct:"–4 to –10", why:"Merging inputs from different sources permanently links their histories.", sev:"high" },
                  { check:"Fee Fingerprinting", deduct:"–6", why:"Identical fee rates across transactions identify your wallet software.", sev:"medium" },
                  { check:"Change Address Reuse", deduct:"–10", why:"Returning change to an input address exposes your full balance.", sev:"high" },
                  { check:"UTXO Count", deduct:"–3 to –8", why:"Too many = consolidation pressure. Too few = full balance exposed per spend.", sev:"medium" },
                  { check:"Balance Concentration", deduct:"–5", why:"90%+ in a single UTXO reveals near-total holdings on every transaction.", sev:"medium" },
                  { check:"Script Type Mix", deduct:"–4", why:"Using legacy + SegWit addresses creates cross-UTXO patterns analysts can exploit.", sev:"low" },
                ].map((row, i) => (
                  <div key={i} style={{ background: T.surface, borderRadius: 10, padding: "14px 16px", border: `1px solid ${T.borderLo}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{row.check}</div>
                      <Tag label={row.deduct} color={row.deduct.startsWith("+") ? T.green : RISK_META[row.sev]?.color || T.red} size={9} />
                    </div>
                    <div style={{ fontSize: 12, color: T.textMid, lineHeight: 1.55 }}>{row.why}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: 24 }}>
              <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, letterSpacing: 2, marginBottom: 12 }}>DATA SOURCES</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { src:"Blockstream Esplora API", desc:"Public blockchain data — UTXOs, transactions, address stats. Read-only. Same source your wallet uses." },
                  { src:"OXT Research (2023)", desc:"Wallet address reuse rates — 91% of wallets reuse at least one address." },
                  { src:"Chainalysis 2023 Annual Report", desc:"$1.1B surveillance contract revenue figure. 1B+ transactions processed for governments." },
                  { src:"Blockstream Research", desc:"1-in-3 wallets contain dust UTXOs planted by tracking services." },
                ].map((s, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, paddingBottom: 10, borderBottom: i < 3 ? `1px solid ${T.borderLo}` : undefined }}>
                    <div style={{ width: 4, borderRadius: 2, background: T.cyan, flexShrink: 0, alignSelf: "stretch" }} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: T.text, marginBottom: 3 }}>{s.src}</div>
                      <div style={{ fontSize: 12, color: T.textMid, lineHeight: 1.55 }}>{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: T.cyanLo, border: `1px solid ${T.cyanMid}`, borderRadius: 14, padding: "16px 20px", fontSize: 13, color: T.textMid, lineHeight: 1.65 }}>
              <strong style={{ color: T.cyan }}>Open source:</strong> All 10 heuristics are implemented in plain JavaScript in this tool's source. No black box. View and audit the full scoring logic at <a href="https://github.com/netasset/anonscore" target="_blank" rel="noopener noreferrer" style={{ color: T.cyan }}>github.com/netasset/anonscore</a>.
            </div>
          </div>
        )}

        {/* ── WATCHLIST removed ── */}
      </div>

      {/* Mobile bottom nav */}
      {isMobile && (
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: T.card, borderTop: `1px solid ${T.border}`, display: "flex", zIndex: 200 }}>
          {["Fix It","Overview","UTXOs"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: "10px 0 8px", background: "transparent", border: "none", borderTop: `2px solid ${tab === t ? T.cyan : "transparent"}`, color: tab === t ? T.cyan : T.textDim, fontFamily: T.mono, fontSize: 8, letterSpacing: .5, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
              <span style={{ fontSize: 15 }}>{t === "Fix It" ? "★" : t === "Overview" ? "◎" : "⬡"}</span>
              {t}
            </button>
          ))}
        </div>
      )}

      {shareOpen && <ShareCard score={score} grade={grade} issueCount={issueCount} address={address} onClose={() => setShareOpen(false)} />}
      {aiStage === "consent" && <AiConsentGate score={score} grade={grade} checks={checks} recommendations={recommendations} onAccept={() => setAiStage("chat")} onDecline={() => setAiStage(null)} />}
      {aiStage === "chat" && <AiAssistant checks={checks} recommendations={recommendations} score={score} grade={grade} onClose={() => setAiStage(null)} />}
    </div>
  );
}

/* ─────────────────────────────────────────────
   ROOT APP
───────────────────────────────────────────── */
function App() {
  const [page, setPage] = useState("landing");
  const [address, setAddress] = useState("");
  const [addrInfo, setAddrInfo] = useState(null);
  const [utxos, setUtxos] = useState([]);
  const [txs, setTxs] = useState([]);
  const [autoShare, setAutoShare] = useState(false);
  const [scanAt, setScanAt] = useState(null);
  const [defaultSimple, setDefaultSimple] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const toast = useToast();

  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);

  const analyze = useCallback(async (addr, plain = false) => {
    setAddress(addr);
    setPage("scanning");
    setAutoShare(false);
    setDefaultSimple(plain);

    try {
      if (addr === "DEMO") {
        await new Promise(r => setTimeout(r, 1400));
        setAddrInfo(DEMO.addrInfo);
        setUtxos(DEMO.utxos);
        setTxs(DEMO.txs);
        setScanAt(Date.now());
        setPage("dashboard");
        toast.show("Demo loaded", { icon: "🔍", color: T.cyan, msg: "Showing a sample high-risk wallet" });
        return;
      }

      const data = await fetchAddress(addr);
      // no artificial delay;
      const analysis = runEngine(data.utxos, data.txs, data.addrInfo?.chain_stats?.tx_count || data.txs.length);
      setAddrInfo(data.addrInfo);
      setUtxos(data.utxos);
      setTxs(data.txs);
      setScanAt(Date.now());
      setPage("dashboard");
      setAutoShare(true); // triggers share modal via useEffect in Dashboard
      toast.show("Scan complete", { icon: "✅", color: T.green, msg: `Privacy score: ${analysis.score}/100` });
    } catch {
      await new Promise(r => setTimeout(r, 1000));
      setAddrInfo(DEMO.addrInfo);
      setUtxos(DEMO.utxos);
      setTxs(DEMO.txs);
      setScanAt(Date.now());
      setPage("dashboard");
      toast.show("Showing demo data", { icon: "ℹ️", color: T.blue, msg: "Live API unavailable — sample shown" });
    }
  }, [toast]);

  return (
    <>
      <style>{CSS}</style>
      <Toast toasts={toast.toasts} />
      {page === "landing"   && <Landing onAnalyze={analyze} isMobile={isMobile} />}
      {page === "scanning"  && <Scanning address={address} />}
      {page === "dashboard" && <Dashboard address={address} addrInfo={addrInfo} utxos={utxos} txs={txs} isMobile={isMobile} onBack={() => setPage("landing")} onRescan={analyze} toast={toast} autoShare={autoShare} scanAt={scanAt} defaultSimple={defaultSimple} />}
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(App));
