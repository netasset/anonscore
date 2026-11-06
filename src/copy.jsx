/* ─────────────────────────────────────────────
   HOISTED CONSTANTS
───────────────────────────────────────────── */
const LANDING_CHECKS = [
  { n:"01", k:"reuse",  icon:"↩", label:"Address Reuse",       desc:"Every time you reuse an address, you create a permanent public link between all your transactions." },
  { n:"02", k:"dust",   icon:"⚠", label:"Dust Attacks",        desc:"Tiny amounts sent to your wallet by trackers. Spending them reveals your wallet cluster to analysts." },
  { n:"03", k:"round",  icon:"◯", label:"Round Amounts",        desc:"Withdrawing 0.1 BTC instead of 0.10743 BTC is a primary signal that funds came from a KYC exchange." },
  { n:"04", k:"coinjoin", icon:"⊕", label:"CoinJoin Usage",     desc:"Whether your transaction history includes any mixing events that break the chain of custody." },
  { n:"05", k:"consolidation", icon:"⊞", label:"Unsafe Consolidation", desc:"Merging UTXOs from different sources permanently links those coin histories on-chain." },
  { n:"06", k:"utxo",   icon:"≣", label:"UTXO Count",           desc:"Too many UTXOs tempt consolidation. Too few exposes your full balance in every transaction." },
  { n:"07", k:"fee",    icon:"₿", label:"Fee Fingerprinting",   desc:"Using the same sat/vbyte rate every time identifies your wallet software to blockchain analysts." },
  { n:"08", k:"change", icon:"↔", label:"Change Address Reuse", desc:"Sending change back to an input address reveals your full balance to the transaction recipient." },
  { n:"09", k:"concentration", icon:"◐", label:"Balance Concentration", desc:"Holding 90%+ in a single UTXO exposes nearly your full holdings in any transaction." },
  { n:"10", k:"script", icon:"T", label:"Script Type Mix",       desc:"Mixing legacy and SegWit addresses creates analyst-exploitable patterns across your UTXO set." },
  { n:"11", k:"changeid", icon:"⇄", label:"Change Detection",     desc:"When a payment's two outputs use different address types and only one matches your input, analysts know that one is your change." },
];

const LANDING_FACTS = [
  { stat:"$8.6B",  desc:"valuation of Chainalysis — the largest blockchain-surveillance firm, whose customers include governments and exchanges (~$190M 2023 revenue)",  source:"Chainalysis Series F, May 2022", url:"https://www.chainalysis.com/blog/series-f/" },
  { stat:"§10",    desc:"of the Bitcoin whitepaper says to use a new address for every payment. Reusing one permanently links all its transactions — the most common avoidable privacy mistake.", source:"Bitcoin whitepaper (Nakamoto, 2008)", url:"https://bitcoin.org/bitcoin.pdf" },
  { stat:"546 sat",desc:"dust threshold for legacy (P2PKH) outputs — ~294 sat for native SegWit; below it, outputs are used by surveillance firms as tracking beacons", source:"Bitcoin Core relay policy (GetDustThreshold)", url:"https://github.com/bitcoin/bitcoin/blob/master/src/policy/policy.cpp" },
  { stat:"~38/100", desc:"what this tool scores a typical wallet — address reuse, no CoinJoin, round-amount withdrawals. An illustrative baseline you can reproduce, not survey data.", source:"AnonScore scoring rubric — we store no scan data", url:"" },
];

/* ─────────────────────────────────────────────
   FUNDING — how AnonScore keeps the lights on, in the open.
   The tool is free for everyone, never tracks users, never sells data.
   Funding is voluntary tips + transparent affiliate links, and it's all
   disclosed to users on the "How we're paid for" page (FundingDisclosure
   component). This object is where those funding hooks are configured.
───────────────────────────────────────────── */

// Lightning + Nostr tip jar. Set these to real values when ready.
// Leave them empty strings to hide the tip jar (graceful fallback).
const FUNDING = {
  lightning: "",  // e.g. "anonscore@getalby.com" or "anonscore@strike.me"
  nostr:     "",  // e.g. "npub1..." — set to enable a "Zap on Nostr" button
};

// Newsletter signup. POSTs the email to this endpoint (set up Buttondown /
// Beehiiv / Substack / mailerlite later and drop the URL in here). Until
// then, the signup form falls back to a clean mailto: link.
const NEWSLETTER = {
  endpoint: "",                                  // e.g. "https://buttondown.email/api/emails/embed-subscribe/anonscore"
  fallbackMailto: "netassetpremium@gmail.com",   // until provider is set up
  name: "On-Chain Forensics",
  pitch: "Weekly deep-dives on notable wallets, privacy heuristics, and seizure stories.",
};

// Privacy Coach — an optional paid tier of the AI assistant (unlimited
// messages + memory across scans). This is just the waitlist landing page
// (reachable at /?page=coach, linked from the AI assistant card); the Coach
// product itself isn't built yet — we're gauging interest first.
const COACH = {
  price:        "$10",
  unit:         "/mo",
  launchTarget: "Q4 2026",
  endpoint:     "",                                // Same provider as NEWSLETTER once chosen — or a separate list
  fallbackMailto: "netassetpremium@gmail.com",
  benefits: [
    { icon: "∞",  title: "Unlimited messages",  desc: "Today's 5/day cap → none. Ask as much as you need." },
    { icon: "⏱",  title: "Persistent memory",   desc: "The Coach remembers your scans, the fixes you've shipped, and what's next." },
    { icon: "⌂",  title: "Multi-device",        desc: "Pick up where you left off across devices. Memory is passphrase-encrypted; the server can't read it." },
    { icon: "✓",  title: "Personal fix queue",  desc: "Tracked plan across all your wallets, with progress markers." },
  ],
};

// BTChub — OPNorange's Bitcoin desk (bitcoin, energy & macro dispatches beside
// computable indicators), linked from the toolkit strip and the footer.
const BTCHUB_URL = "https://btchub.opnorange.com";

