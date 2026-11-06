
const fmt = {
  btc:  v => v >= 1e8 ? `₿${(v / 1e8).toFixed(4)}` : `${v.toLocaleString()} sats`,
  // One unit for a list, so a 1.2 BTC row and a 546-sat row compare.
  btcRow: v => "₿" + (v / 1e8).toFixed(8).replace(/0+$/, "").replace(/\.$/, ""),
  age:  ts => { const d = Math.floor((Date.now()/1000 - ts) / 86400); return d < 1 ? "Today" : d === 1 ? "Yesterday" : d < 30 ? `${d}d ago` : d < 365 ? `${Math.floor(d/30)}mo ago` : `${Math.floor(d/365)}yr ago`; },
  txid: id => id ? `${id.slice(0,8)}…${id.slice(-4)}` : "—",
  addr: a => a === "DEMO" ? "Demo Wallet" : a ? `${a.slice(0,10)}…${a.slice(-6)}` : "—",
};

/* ─────────────────────────────────────────────
   PLAIN-ENGLISH TRANSLATIONS
   Used when simpleMode is enabled on the dashboard
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
    changeid: {
      name: "Your Change Gives You Away",
      warn_detail: "When you sent Bitcoin, your 'change' came back in your usual address style while the payment went to a different style. Trackers can spot which coins are still yours that way.",
      pass_detail: "Your change doesn't stand out from your payments.",
    },
  },
  recs: {
    cj:      { action: "Mix your coins for privacy",          plain: "Privacy mixing pools your Bitcoin with other people in one transaction, so no one can tell whose coins are whose. It's the single most powerful thing you can do." },
    reuse:   { action: "Use a fresh address every time",      plain: "Your wallet can make unlimited new addresses for free. Tap 'Receive' and get a new one every time someone sends you Bitcoin. Never reuse an old one." },
    lightning:{ action: "Pay small amounts over Lightning",   plain: "Lightning lets you send Bitcoin instantly without any record on the public blockchain. Perfect for everyday spending — like cash, but digital." },
    cons:    { action: "Keep your coins separate",            plain: "Don't mix coins from your exchange with coins you bought privately. Use separate wallets, and never send between them directly." },
    payjoin: { action: "Pay with Payjoin when you can",       plain: "Some wallets and shops support 'Payjoin' — when you pay, they quietly add one of their own coins to the transaction. That hides which coins are really yours, with no special mixing step. Look for it in wallets like Cake Wallet." },
    changeid: { action: "Keep your change looking like your payments", plain: "Use a wallet that makes your leftover change match the style of the address you're paying (Bitcoin Core does this by itself). Then trackers can't tell which coins came back to you." },
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

function isValidLightningPubkey(str) {
  return /^[0-9a-fA-F]{66}$/.test(str.trim());
}

function isLightningAddress(str) {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(str.trim()) && !str.includes("bitcoin");
}

function detectInputType(val) {
  const v = (val || "").trim();
  if (!v) return null;
  if (isValidLightningPubkey(v)) return "ln_pubkey";
  if (isLightningAddress(v)) return "ln_address";
  if (isValidBitcoinAddress(v) || v === "DEMO" || v === "DEMO_A") return "btc";
  return null;
}

