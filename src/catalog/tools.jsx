// Canonical homepage for each tool we recommend. Source of truth for outbound
// links — the recommendation text in `recs[].tools[].name` looks up here at
// render time. Adding a new tool name without a URL is fine; it just renders
// as plain text (graceful fallback).
const TOOL_URL = {
  // Desktop wallets
  "Wasabi Wallet":   "https://wasabiwallet.io",
  "Ginger Wallet":   "https://gingerwallet.io",
  "Sparrow Wallet":  "https://sparrowwallet.com",
  "Bitcoin Core":    "https://bitcoincore.org",
  "Electrum":        "https://electrum.org",
  "Joinmarket":      "https://github.com/JoinMarket-Org/joinmarket-clientserver",
  "JoinStr":         "https://github.com/JoinStr",
  "BTCPay Server":   "https://btcpayserver.org",
  // Mobile wallets
  "Blue Wallet":     "https://bluewallet.io",
  "Nunchuk":         "https://nunchuk.io",
  // Lightning wallets
  "Phoenix Wallet":  "https://phoenix.acinq.co",
  "Breez":           "https://breez.technology",
  "Zeus":            "https://zeusln.app",
  "Blixt Wallet":    "https://blixtwallet.github.io",
  "Alby":            "https://getalby.com",
  // Non-KYC exchanges / P2P
  "Bisq":            "https://bisq.network",
  "Robosats":        "https://learn.robosats.com",
  "Peach Bitcoin":   "https://peachbitcoin.com",
  "HodlHodl":        "https://hodlhodl.com",
  "AgoraDesk":       "https://agoradesk.com",
  // Nodes / infra
  "Umbrel":          "https://umbrel.com",
  "Start9":          "https://start9.com",
  "RaspiBlitz":      "https://raspiblitz.com",
  "MyNode":          "https://mynodebtc.com",
  "Nodl":            "https://nodl.it",
  // Fee tools
  "mempool.space":   "https://mempool.space",
};

// When an affiliate program is signed up for, drop the affiliate URL here and
// it overrides the canonical TOOL_URL for that tool. Empty by default —
// every recommendation today links to the official homepage with no kickback.
// See /how-we-get-paid for the public disclosure page (lists whatever's in here).
const TOOL_AFFILIATE_URL = {
  // e.g. "Phoenix Wallet": "https://phoenix.acinq.co?ref=anonscore",
};

const toolLink = (name) => TOOL_AFFILIATE_URL[name] || TOOL_URL[name] || null;
const toolIsAffiliate = (name) => !!TOOL_AFFILIATE_URL[name];

