/* One sentence a person can read without knowing the heuristics. Built from the
   check that moved the score the most. Does not change the score. */
function firstSentence(s) {
  if (!s) return "";
  const m = String(s).trim().match(/^[\s\S]*?[.!?](?:\s|$)/);
  return (m ? m[0] : s).trim();
}
function worstCheck(checks) {
  const bad = (checks || []).filter(c => c.status !== "pass");
  const scored = bad.filter(c => typeof c.pts === "number");
  if (scored.length) return [...scored].sort((a, b) => a.pts - b.pts)[0];
  return bad[0] || null;
}
const LN_WHY = {
  kyc_peers: "Channels to KYC exchanges can log who this node routes with.",
  announced: "This node is on the public Lightning map, so peers can see where it connects.",
  tor: "Peers can see this node's IP address.",
  channels: "Too few public channels make a payment easier to correlate.",
  cap_conc: "Almost all of the capacity sits in one channel, so routes are predictable.",
  alias: "The alias reads like a real name, and the whole network can see it.",
  age: "A new node has a short history, which is easier to watch.",
  onchain: "Channel opens on the blockchain can tie this node to an on-chain wallet.",
};
function whyLine(check) {
  if (!check) return "";
  const simple = SIMPLE.checks[check.key];
  if (simple) {
    const d = check.status === "fail" ? simple.fail_detail : check.status === "warn" ? simple.warn_detail : simple.pass_detail;
    if (d) return firstSentence(d);
  }
  return firstSentence(check.plain || check.detail || "");
}
function plainVerdict({ score, checks, kind, clusterN = 0 }) {
  const noun = kind === "ln" ? "node" : kind === "wallet" ? "wallet" : "address";
  const fails = (checks || []).filter(c => c.status === "fail").length;
  const worst = worstCheck(checks);
  const why = (kind === "ln" && worst && LN_WHY[worst.key]) || whyLine(worst);
  const link = kind === "btc" && clusterN > 0 ? ` The chain already links it to ${clusterN} other address${clusterN === 1 ? "" : "es"}.` : "";
  if (score >= 80 && fails === 0) {
    if (worst && worst.status === "warn" && why) {
      return `The score is high. One warning is left: ${why.charAt(0).toLowerCase()}${why.slice(1)}` + link;
    }
    return `An observer has little to connect on this ${noun}. Keep receiving on a fresh address, and don't merge these coins with an exchange withdrawal.` + link;
  }
  if (score >= 60) {
    return (why
      ? `An observer can still read part of this ${noun}. ${why}`
      : `An observer can still read part of this ${noun}. The first step below closes the biggest gap.`) + link;
  }
  return (why
    ? `Easy to follow. ${why}`
    : `This ${noun} is easy to follow. The first step below is the one that matters.`) + link;
}

/* Concrete steps for a fix. Keyed off the recommendation, not the score,
   so the engine output stays the same. Wallet-scan recs have no key; match
   them by what they tell the person to do. */
const FIX_HOWTO = {
  cj: { where: "Ginger Wallet or Wasabi", steps: [
    "Install Ginger Wallet (it runs a coordinator) or Wasabi, then choose a community coordinator under Change Coordinator.",
    "Load only the coins you want to mix. Leave any dust frozen so it is not pulled in.",
    "Start a CoinJoin and wait until the round finishes. Come back here and rescan.",
  ]},
  payjoin: { where: "Cake Wallet", steps: [
    "Install Cake Wallet and open the wallet you spend from.",
    "Pay someone who accepts Payjoin the way you normally would. Cake adds one of their coins to the payment.",
    "If you receive payments, turn Payjoin on so the sender's coins mix with yours.",
  ]},
  reuse: { where: "Sparrow, Cake, or the wallet you already use", steps: [
    "Tap Receive and copy the new address. Send that one. Do not paste an address you have already used.",
    "If you must publish one address, use a Silent Payment (it starts with sp1) in Sparrow or Cake. Each payer still lands on a fresh on-chain address.",
    "After the next payment arrives, rescan the new address.",
  ]},
  lightning: { where: "Phoenix Wallet", steps: [
    "Install Phoenix or Breez. Both are self-custodial.",
    "Send a small amount in from a coin that is not dust and not an exchange withdrawal you want to keep separate.",
    "Pay everyday amounts over Lightning. Those payments do not appear on the blockchain.",
  ]},
  cons: { where: "Sparrow Wallet", steps: [
    "Keep exchange coins and private coins in two wallets. Do not send from one to the other.",
    "Open the Coins tab. Before you send, select only the coins that belong together.",
    "Label each coin (exchange, private, mixed) so the next spend does not merge them.",
  ]},
  dust: { where: "Sparrow Wallet", steps: [
    "Open the coin list and find outputs under 546 sats.",
    "Right-click each one and choose Freeze. In Electrum that is Freeze coin. In Bitcoin Core it is lockunspent.",
    "Leave them frozen. Spending one tells the sender where the rest of the wallet went.",
  ]},
  round: { where: "the exchange withdrawal screen", steps: [
    "Do not withdraw a round number such as 0.1. Change the last digits, for example 0.10381.",
    "Send it to a fresh address, and keep those coins out of your private stack.",
    "When you can, buy without KYC (Bisq, RoboSats, or Peach) so there is no exchange trail.",
  ]},
  change: { where: "Sparrow or Electrum", steps: [
    "In Sparrow, use a Native SegWit wallet. Change already goes to a new address.",
    "In Electrum, open Preferences and turn on Use change addresses.",
    "Send a small payment to yourself and confirm the change is a new address, then rescan.",
  ]},
  node: { where: "Umbrel, Start9, or Bitcoin Core", steps: [
    "Run your own node: Umbrel or Start9 on a small computer, or Bitcoin Core on a machine you leave on.",
    "In the wallet's server settings, point it at that node and turn off public Electrum servers.",
    "Lookups then stay on your machine. A public explorer never sees your addresses next to your IP.",
  ]},
  fee: { where: "Sparrow Wallet", steps: [
    "Before you send, check the fee on mempool.space.",
    "Set the fee yourself instead of accepting the wallet default.",
    "Change it a little every time. The same sat/vB on every payment is a fingerprint.",
  ]},
  conc: { where: "Sparrow Wallet", steps: [
    "Open coin control and send part of the large coin to a new address of your own.",
    "Do it when fees are low, and do not combine it with coins from another source.",
    "A CoinJoin also splits the balance into several pieces.",
  ]},
  changeid: { where: "Bitcoin Core or Sparrow", steps: [
    "Use a wallet that makes the change the same address type as the person you pay. Bitcoin Core does this on its own.",
    "In Sparrow, set the change address type to match the payment before you broadcast.",
    "Keeping the whole wallet on Native SegWit removes the tell.",
  ]},
  kyc_peers: { where: "Amboss, then your node", steps: [
    "On Amboss, pick Tor-only nodes with no real-name alias and enough capacity.",
    "In Umbrel, Thunderhub, or RTL, close the channels to exchanges such as Bitfinex, Kraken, Binance, and OKX.",
    "Open replacement channels to the nodes you picked, then rescan.",
  ]},
  announced: { where: "Core Lightning or LND", steps: [
    "New channels can stay unannounced. They still work. They are just not on the public map.",
    "In Core Lightning, open the channel as unannounced. In LND, do not advertise it.",
    "Channels that are already public stay public until you close them.",
  ]},
  tor: { where: "Umbrel, Start9, or RaspiBlitz", steps: [
    "Umbrel: Settings, then Tor, then force Tor. Start9: System, then Tor, then enforce Tor. RaspiBlitz: CONNECT, then TOR.",
    "Turn off clearnet listening so the node has no public IP.",
    "Restart and rescan. The address list should be onion-only.",
  ]},
  onchain: { where: "Sparrow, then your node", steps: [
    "Do not open a channel straight from an exchange withdrawal.",
    "In Sparrow, pick a coin that did not come from an exchange and send it to the node's on-chain wallet.",
    "Open the channel from that coin.",
  ]},
  alias: { where: "your node's settings", steps: [
    "Open the node settings and edit the alias.",
    "Pick a word that is not a real name and not a business.",
    "Restart the node, then come back and rescan.",
  ]},
  channels: { where: "your node", steps: [
    "Open another channel to a node that is not an exchange.",
    "Leave it unannounced if the software lets you.",
    "Rescan. A payment is harder to pin on a node with several channels.",
  ]},
  cap_conc: { where: "your node", steps: [
    "Open another channel so one channel is not almost all of the capacity.",
    "Or move some capacity out of the large channel.",
    "Rescan.",
  ]},
  age: { where: "your node", steps: [
    "Leave the node online. A new node is easier to watch.",
    "Do not close and reopen channels just to look busy.",
    "Rescan once it has been up for a few weeks.",
  ]},
  script: { where: "Sparrow or Bitcoin Core", steps: [
    "Receive on one address type. Native SegWit is the usual choice.",
    "When you pay, send the change as that same type.",
    "Rescan after the next payment.",
  ]},
  utxo_n: { where: "Sparrow Wallet", steps: [
    "Do not merge the coins just to tidy the list. That links their histories.",
    "If fees are low and the coins came from the same place, you can combine those.",
    "Leave dust frozen while you do it.",
  ]},
};
function howtoFor(rec) {
  if (!rec) return null;
  if (rec.key && FIX_HOWTO[rec.key]) return FIX_HOWTO[rec.key];
  const blob = `${rec.action || ""} ${rec.plain || ""}`;
  if (/CoinJoin/i.test(blob)) return FIX_HOWTO.cj;
  if (/fresh address|new address|reuse/i.test(blob)) return FIX_HOWTO.reuse;
  if (/coin control|merge|different sources/i.test(blob)) return FIX_HOWTO.cons;
  if (/dust|Freeze/i.test(blob)) return FIX_HOWTO.dust;
  if (/Payjoin/i.test(blob)) return FIX_HOWTO.payjoin;
  if (/Lightning/i.test(blob)) return FIX_HOWTO.lightning;
  return null;
}

