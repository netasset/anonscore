/* ─────────────────────────────────────────────
   PRIVACY ENGINE — 11 heuristics
───────────────────────────────────────────── */
function runEngine(utxos = [], txs = [], txCount = 0, receiveCount = null) {
  // Guard: no on-chain history at all — new/unused address
  if (txCount === 0 && utxos.length === 0) {
    return {
      score: null,
      grade: "—",
      riskLabel: "No History",
      riskColor: T.textDim,
      checks: [],
      recommendations: [],
      isEmpty: true,
    };
  }

  let score = 100;
  const checks = [];
  const add = (key, name, status, detail, plain, sev, pts) => {
    checks.push({ key, name, status, detail, plain, sev: sev || "medium", pts: pts || 0 });
    score += pts;
  };

  // 1. Address reuse — judged by RECEIVE count (funded_txo_count), matching the
  // wallet engine and the true definition: receiving MORE THAN ONCE on one
  // address is reuse. A normal receive-then-spend (tx_count 2, funded_txo_count 1)
  // is NOT reuse. Falls back to tx_count only when receive count is unavailable.
  const rc = receiveCount != null ? receiveCount : txCount;
  if (rc >= 10)     add("reuse","Address Reuse","fail",`Received ${rc}+ times — every payment permanently linked`,"This address has received many payments. Every reuse permanently links your transactions for any analyst to see.","critical",-28);
  else if (rc >= 4) add("reuse","Address Reuse","fail",`Received ${rc} times — linkable on-chain`,"This address has been reused to receive. Ideally, use a fresh address for every payment.","high",-15);
  else if (rc >= 2) add("reuse","Address Reuse","warn",`Received ${rc} times — minor exposure`,"Minor reuse. Generate a new address for your next receive.","medium",-7);
  else              add("reuse","Address Reuse","pass","Fresh address — received once","Great. This address has only received once.","clean",0);

  // 2. Dust
  const dust = utxos.filter(u => isDustSat(u.value));
  if (dust.length > 2)   add("dust","Dust Attack","fail",`${dust.length} dust UTXOs — tracking beacons planted`,"Small amounts sent by trackers. Spending them reveals your wallet cluster to surveillance firms.","high",-12);
  else if (dust.length)  add("dust","Dust Attack","warn",`${dust.length} dust UTXO — possible tracker`,"A tiny amount was sent to your address. Freeze it in Sparrow — never spend it.","medium",-5);
  else                   add("dust","Dust Attack","pass","No dust UTXOs","No suspicious tiny amounts found.","clean",0);

  // 3. Round amounts
  const round = utxos.filter(u => isRoundSat(u.value));
  if (round.length >= 2) add("round","Round Amounts","fail",`${round.length} round-number UTXOs — KYC withdrawal pattern`,"Round amounts like 0.1 BTC are a Chainalysis red flag. Analysts assume these came from KYC exchanges.","high",-10);
  else if (round.length) add("round","Round Amounts","warn","1 round-number UTXO — minor fingerprint","One round amount. Use odd numbers next time you withdraw from an exchange.","medium",-5);
  else                   add("round","Round Amounts","pass","No suspicious round amounts","Good — your UTXOs use non-round amounts.","clean",0);

  // 4. CoinJoin — requires multiple inputs (participants), not just repeated
  // outputs, so a single-sender batch payout isn't miscredited as a mix.
  let cjCount = 0;
  for (const tx of txs) {                        // scan the full window, like every other check
    if (isCoinJoinShape(tx.vin, tx.vout)) cjCount++;
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

  // 11. Change detection via script-type mismatch — the classic two-output
  // tell: when a payment has exactly two outputs and only ONE matches the
  // input's script type, that one is almost certainly the change. Analysts use
  // this to know which coins are still yours, hop after hop.
  const changeIdCount = txs.filter(tx => {
    if (tx.vout?.length !== 2) return false;
    const inType = (tx.vin || []).map(i => i.prevout?.scriptpubkey_type).find(Boolean);
    if (!inType) return false;
    const [a, b] = tx.vout.map(o => o.scriptpubkey_type);
    if (!a || !b || a === b) return false;
    return a === inType || b === inType;
  }).length;
  if (changeIdCount >= 3)
    add("changeid","Change Detection","fail",`${changeIdCount} payments reveal which output is your change`,"In several of your payments, only one output matches your input's address type — analysts read that output as your change and keep following your coins.","high",-8);
  else if (changeIdCount >= 1)
    add("changeid","Change Detection","warn",`${changeIdCount} payment${changeIdCount > 1 ? "s" : ""} reveal${changeIdCount > 1 ? "" : "s"} which output is the change`,"A payment's two outputs used different address types, and only one matched your input — that one is identifiable as your change.","medium",-4);
  else
    add("changeid","Change Detection","pass","Change not identifiable by script type","Your payments don't give away which output is the change via mismatched address types.","clean",0);

  score = Math.max(0, Math.min(100, Math.round(score)));

  const recs = [];
  const failed = checks.filter(c => c.status !== "pass");
  if (failed.find(f => f.key === "cj"))
    recs.push({ icon:"🔀", action:"Mix your coins with CoinJoin", plain:"CoinJoin pools your Bitcoin with others in a single transaction, making it impossible to trace which output is yours.", detail:"The mixing landscape changed in 2024 — Samourai's Whirlpool was seized and Wasabi's original coordinator shut down. CoinJoin still works: you now connect to a community-run coordinator (built into Wasabi 2.x and its forks) or use Joinmarket's coordinator-free peer-to-peer model. Aim for large anonymity sets and time it during low-fee periods. (Note: centralized WabiSabi coordinators carry some deanonymization risk — Joinmarket avoids a coordinator entirely.)", impact:18, effort:"Medium", tools:[
      { name:"Wasabi Wallet",  note:"WabiSabi CoinJoin — since its default coordinator closed in 2024, pick a community coordinator in-app (Change Coordinator)" },
      { name:"Ginger Wallet",  note:"Wasabi fork that runs its own active CoinJoin coordinator, desktop" },
      { name:"Joinmarket",     note:"Peer-to-peer, no central coordinator — the most censorship-resistant option" },
      { name:"JoinStr",        note:"Nostr-coordinated CoinJoin, experimental" },
      { name:"BTCPay Server",  note:"Self-hosted Payjoin for merchants — breaks the common-input heuristic" },
    ], key:"cj" });
  if (failed.find(f => f.key === "cj") || cons.length)
    recs.push({ icon:"🤝", action:"Use Payjoin when you pay or get paid", plain:"Payjoin is a payment where the receiver quietly adds one of their own coins to your transaction. Analysts assume every input to a transaction has one owner — Payjoin breaks that assumption on an ordinary-looking payment, no mixing round or anonymity set required.", detail:"Payjoin (BIP78, and the newer async Payjoin / BIP77) needs a receiver who supports it, so it works best when transacting with Payjoin-enabled wallets and merchants. Adoption is climbing fast: Cake Wallet and Bull Bitcoin ship it, and the Payjoin Foundation (2025) is pushing it toward the default payment experience. It's coordinator-free and cheap — a great complement to CoinJoin.", impact:9, effort:"Easy", tools:[
      { name:"Cake Wallet",    note:"Mobile, ships Payjoin v2 (async) in the default send flow" },
      { name:"Bull Bitcoin",   note:"Non-custodial, Payjoin-enabled buy/sell and payments" },
      { name:"BTCPay Server",  note:"Receive Payjoin payments as a merchant, self-hosted" },
      { name:"Payjoin Dev Kit",note:"Open-source Rust library (BIP78 + BIP77) for wallet builders" },
    ], key:"payjoin" });
  if (failed.find(f => f.key === "reuse"))
    recs.push({ icon:"🔄", action:"Use a new address every time", plain:"Your wallet can generate unlimited fresh addresses. Every reuse permanently links your transactions for any analyst to trace.", detail:"Every HD wallet generates a new address on each 'Receive' — the trick is discipline: never re-paste an old one. If you need a fixed address to publish (a donation link, an invoice), use a Silent Payment (BIP352): you share ONE reusable string ('sp1…') and the sender's wallet derives a fresh, unlinkable on-chain address for every payment — so a public address never causes reuse. Sparrow, Cake Wallet, Nunchuk and BlueWallet support receiving them today.", impact:15, effort:"Easy", tools:[
      { name:"Sparrow Wallet",  note:"Coin control + labelling, and Silent Payments send/receive, desktop" },
      { name:"Cake Wallet",     note:"Silent Payments send + receive with on-device scanning, mobile" },
      { name:"Nunchuk",         note:"Silent Payments receiving + multisig, mobile + desktop" },
      { name:"Blue Wallet",     note:"Silent Payments receiving, open source, mobile" },
      { name:"Electrum",        note:"Lightweight, long-standing open source, desktop" },
      { name:"Bitcoin Core",    note:"Full node wallet, maximum sovereignty" },
    ], key:"reuse" });
  recs.push({ icon:"⚡", action:"Move spending money to Lightning", plain:"Lightning payments don't appear on-chain at all — zero on-chain footprint for every day-to-day purchase.", detail:"Open a channel from a clean UTXO, then use Lightning for all spending. Options range from fully self-custodial to simple custodial — choose based on how much sovereignty you want.", impact:12, effort:"Medium", tools:[
    { name:"Phoenix Wallet", note:"Self-custodial, mobile, simple UX, automatic channels" },
    { name:"Breez",          note:"Self-custodial, mobile, point-of-sale + podcasting" },
    { name:"Zeus",           note:"Connect to your own LND/CLN node, advanced" },
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
  if (failed.find(f => f.key === "changeid"))
    recs.push({ icon:"⇄", action:"Match your change to the payment type", plain:"When you pay a different address type than your own, your change output sticks out — analysts can tell which coins are still yours and keep following them.", detail:"Use a wallet that matches the change output's address type to the payment's (Bitcoin Core does this automatically; Sparrow lets you choose the change type per transaction). Keeping your whole wallet on one script type and preferring recipients of the same type also blurs the tell.", impact:8, effort:"Easy", tools:[
      { name:"Bitcoin Core",    note:"Matches change type to the destination automatically" },
      { name:"Sparrow Wallet",  note:"Choose the change address type per transaction" },
      { name:"Wasabi Wallet",   note:"Single script type wallet-wide — no mismatch to read" },
    ], key:"changeid" });
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

