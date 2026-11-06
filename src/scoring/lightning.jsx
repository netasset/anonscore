/* ─────────────────────────────────────────────
   LIGHTNING FETCH + ENGINE
───────────────────────────────────────────── */
const LN_API = "https://mempool.space/api/v1/lightning";

async function fetchLightningNode(pubkey) {
  // Relay path is /ln/nodes/…; direct is mempool's /nodes/…. Same honest-failure
  // rule as fetchAddress: no silent direct fallback when the relay is on.
  const base = relayOn() ? `${RELAY_URL}/ln` : LN_API;
  const safe = encodeURIComponent(pubkey);
  const [node, channels] = await Promise.all([
    fetch(`${base}/nodes/${safe}`).then(r => { if (!r.ok) throw new Error("Node not found"); return r.json(); }),
    fetch(`${base}/nodes/${safe}/channels?status=open`).then(r => r.json()).catch(() => ({ channels: [] })),
  ]);
  if (!node || typeof node !== "object") throw new Error("Invalid node response");
  return { node, channels: (Array.isArray(channels.channels) ? channels.channels : []).slice(0, 30) };
}

// Known KYC/custodial exchange node pubkeys — verified against 1ML/Amboss
const KYC_NODES = new Set([
  "033d8656219478701227199cbd6f670335c8d408a92ae88b176cad16f71555e072", // Bitfinex
  "02f1a8c87607f415c8f22c00593002775941dea48869ce23096af27b0cfdcc0b69", // Kraken
  "03037dc08e9ac63b82581f79b662a4d0ceca8a8ca162b1af3551595b8f2d97b70a", // River Financial
  "035e4ff418fc8b5554c5d9eea66396c227bd429a3251c8cbc711002ba215bfc226", // Wallet of Satoshi (custodial)
  "0279c22ed7a068d10dc1a38ae66d2d6461e269226c60258c021b1ddcdfe4b00bc4", // OKX
  "03cde60a6323f7122d5178255766e38114b4722ede08f7c9e0c5df9b912cc201d6", // Binance
]);
const isKycNode = pub => KYC_NODES.has(pub);

function runLightningEngine(node = {}, channels = []) {
  let score = 100;
  const checks = [];
  const add = (key, name, status, detail, sev, pts) => {
    checks.push({ key, name, status, detail, sev: sev || "medium", pts: pts || 0 });
    score += pts;
  };

  // 1. Public node announcement
  const isPublic = node.public !== false;
  if (isPublic)
    add("announced", "Public Node Announcement", "fail",
      "Your node is publicly announced on the Lightning gossip network. Your IP or Tor address is visible to every peer.", "high", -18);
  else
    add("announced", "Public Node Announcement", "pass",
      "Your node is not publicly announced — it operates privately.", "clean", 0);

  // 2. KYC exchange peers
  const kycPeers = channels.filter(ch =>
    isKycNode(ch.node1_pub) || isKycNode(ch.node2_pub)
  );
  if (kycPeers.length >= 2)
    add("kyc_peers", "KYC Exchange Peer Channels", "fail",
      `${kycPeers.length} channels connect to known KYC exchanges. These entities log routing metadata and can correlate your activity.`, "critical", -22);
  else if (kycPeers.length === 1)
    add("kyc_peers", "KYC Exchange Peer Channels", "warn",
      "1 channel connects to a known KYC exchange. Their logs can correlate payment routing through your node.", "high", -10);
  else
    add("kyc_peers", "KYC Exchange Peer Channels", "pass",
      "No channels detected to known KYC surveillance entities.", "clean", 0);

  // 3. Tor usage
  const hasTorAddr = node.addresses?.some(a => a.addr?.includes(".onion"));
  const hasClearnet = node.addresses?.some(a => !a.addr?.includes(".onion") && a.addr);
  if (hasClearnet && !hasTorAddr)
    add("tor", "Tor / Clearnet Exposure", "fail",
      "Your node only accepts clearnet connections. Your IP address is directly visible to all peers.", "high", -15);
  else if (hasClearnet && hasTorAddr)
    add("tor", "Tor / Clearnet Exposure", "warn",
      "Your node accepts both Tor and clearnet. Clearnet peers can correlate your IP with your node pubkey.", "medium", -7);
  else
    add("tor", "Tor / Clearnet Exposure", "pass",
      "Your node is Tor-only — no IP exposure to peers.", "clean", 0);

  // 4. Channel count (too few = low routing privacy)
  const chCount = channels.length;
  if (chCount === 0)
    add("channels", "Channel Diversity", "warn",
      "No open channels found. A node with no channels has limited routing privacy and cannot receive spontaneous payments.", "medium", -6);
  else if (chCount < 3)
    add("channels", "Channel Diversity", "warn",
      `Only ${chCount} publicly-announced channel${chCount > 1 ? "s" : ""} — low public routing diversity. (Private, unannounced channels don't show up here; keeping channels unannounced is more private, not less.)`, "medium", -4);
  else
    add("channels", "Channel Diversity", "pass",
      `${chCount} publicly-announced channels — good routing diversity makes payment flows harder to trace.`, "clean", 0);

  // 5. Large single channel dominance
  const totalCap = channels.reduce((s, c) => s + (c.capacity || 0), 0);
  const maxCap = channels.length ? Math.max(...channels.map(c => c.capacity || 0)) : 0;
  if (totalCap > 0 && maxCap / totalCap > 0.8)
    add("cap_conc", "Channel Capacity Concentration", "warn",
      "Over 80% of your publicly-visible capacity is in one channel. This makes your routing patterns highly predictable.", "medium", -6);
  else
    add("cap_conc", "Channel Capacity Concentration", "pass",
      "Your capacity is distributed across channels — good for routing privacy.", "clean", 0);

  // 6. Node alias (using real identity)
  // Sanitise alias: strip control chars, newlines, limit to 50 chars
  const rawAlias = node.alias || "";
  const alias = rawAlias.replace(/[\x00-\x1f\x7f]/g, "").trim().slice(0, 50);
  const suspiciousAlias = alias.length > 0 && /^[A-Z][a-z]/.test(alias) && alias.includes(" ");
  if (suspiciousAlias)
    add("alias", "Node Alias Privacy", "warn",
      `Your alias "${alias}" looks like a real name. Node aliases are publicly visible to the entire Lightning network.`, "low", -4);
  else if (alias.length === 0)
    add("alias", "Node Alias Privacy", "pass",
      "No alias set — your node is identified only by its pubkey.", "clean", 0);
  else
    add("alias", "Node Alias Privacy", "pass",
      `Alias "${alias}" appears pseudonymous.`, "clean", 0);

  // 7. Node age (new nodes get less scrutiny pattern)
  const firstSeen = node.first_seen || 0;
  const ageDays = firstSeen ? Math.floor((Date.now() / 1000 - firstSeen) / 86400) : 0;
  if (ageDays > 0 && ageDays < 30)
    add("age", "Node Establishment", "warn",
      "Your node is less than 30 days old. New nodes are more easily tracked as their channel history is limited.", "low", -3);
  else
    add("age", "Node Establishment", "pass",
      ageDays > 0 ? `Node active for ${Math.floor(ageDays / 30)} months — established routing history.` : "Node age unknown.", "clean", 0);

  // 8. On-chain channel footprint — real check: channels opened = on-chain traces
  const openedChannels = channels.length;
  if (openedChannels > 10)
    add("onchain", "On-Chain Channel Footprint", "warn",
      `${openedChannels} publicly-visible channel opens/closes are recorded on-chain. Each one is a permanent trace linking your Lightning and on-chain identity — and private channels add to this on-chain too, they just aren't listed in gossip. Funding channels directly from KYC exchange withdrawals is the riskiest pattern.`,
      "medium", -5);
  else if (openedChannels > 0)
    add("onchain", "On-Chain Channel Footprint", "pass",
      `${openedChannels} publicly-visible channel${openedChannels > 1 ? "s" : ""} — modest public footprint (private channels have on-chain opens too, not shown here). Ensure you fund channels from non-KYC UTXOs to avoid linking your identities.`,
      "clean", 0);
  else
    add("onchain", "On-Chain Channel Footprint", "pass",
      "No open channels found — no on-chain channel footprint to analyse.",
      "clean", 0);

  score = Math.max(0, Math.min(100, Math.round(score)));

  const recs = [];
  const failed = checks.filter(c => c.status !== "pass");
  if (failed.find(f => f.key === "kyc_peers"))
    recs.push({ key: "kyc_peers", icon: "⚡", action: "Close channels with KYC exchange nodes", impact: 22, effort: "Medium",
      detail: "Open replacement channels with privacy-focused or anonymous peers. Look for Tor-only nodes with no identifiable alias.",
      tools: [{ name: "Amboss.space", note: "Find privacy-respecting nodes to peer with" }, { name: "LNRouter", note: "Routing analysis, find good private peers" }] });
  if (failed.find(f => f.key === "announced"))
    recs.push({ key: "announced", icon: "📡", action: "Switch to an unannounced / private node", impact: 18, effort: "Hard",
      detail: "An unannounced node is invisible to the gossip network. You can still open and use channels — they just won't be publicly listed.",
      tools: [{ name: "CLN (Core Lightning)", note: "Supports unannounced channels natively" }, { name: "LND", note: "Use --unexported-channel flag" }] });
  if (failed.find(f => f.key === "tor"))
    recs.push({ key: "tor", icon: "🧅", action: "Enable Tor-only mode", impact: 15, effort: "Medium",
      detail: "Disable clearnet listening entirely. Your IP will no longer be exposed to peers.",
      tools: [{ name: "Umbrel", note: "Settings → Tor → Force Tor" }, { name: "Start9", note: "System → Tor → Enforce Tor" }, { name: "RaspiBlitz", note: "Main menu → CONNECT → TOR" }] });
  if (failed.find(f => f.key === "onchain"))
    recs.push({ key: "onchain", icon: "🔗", action: "Fund channels from non-KYC UTXOs only", impact: 8, effort: "Medium",
      detail: "Use a separate wallet with no KYC history to open channels. Never open a channel directly from an exchange withdrawal.",
      tools: [{ name: "Bisq", note: "Non-KYC bitcoin source" }, { name: "Sparrow Wallet", note: "Coin control before channel open" }] });

  const grade = score >= 90 ? "A+" : score >= 80 ? "A" : score >= 70 ? "B" : score >= 55 ? "C" : score >= 40 ? "D" : "F";
  return { score, grade, checks, recommendations: recs };
}

const DEMO_LN = {
  node: {
    public: true,
    alias: "SatoshiNode 01",
    addresses: [{ addr: "192.168.1.1:9735" }, { addr: "abcdef123456.onion:9735" }],
    first_seen: Math.floor(Date.now() / 1000) - 86400 * 120,
    capacity: 214000000,
    channel_count: 12,
  },
  channels: [
    { node1_pub: "033d8656219478701227199cbd6f670335c8d408a92ae88b176cad16f71555e072", node2_pub: "mynode", capacity: 42000000 }, // Bitfinex
    { node1_pub: "033d8656219478701227199cbd6f670335c8d408a92ae88b176cad16f71555e072", node2_pub: "mynode", capacity: 18000000 }, // Bitfinex
    { node1_pub: "mynode", node2_pub: "02f1a8c87607f415c8f22c00593002775941dea48869ce23096af27b0cfdcc0b69", capacity: 25000000 }, // Kraken
    { node1_pub: "mynode", node2_pub: "anon1aabbccddeeff0011223344556677889900aabbccddeeff00112233445566", capacity: 22000000 },
    { node1_pub: "mynode", node2_pub: "anon2aabbccddeeff0011223344556677889900aabbccddeeff00112233445566", capacity: 31000000 },
    { node1_pub: "mynode", node2_pub: "anon3aabbccddeeff0011223344556677889900aabbccddeeff00112233445566", capacity: 28000000 },
    { node1_pub: "mynode", node2_pub: "anon4aabbccddeeff0011223344556677889900aabbccddeeff00112233445566", capacity: 18000000 },
    { node1_pub: "mynode", node2_pub: "anon5aabbccddeeff0011223344556677889900aabbccddeeff00112233445566", capacity: 10000000 },
    { node1_pub: "mynode", node2_pub: "anon6aabbccddeeff0011223344556677889900aabbccddeeff00112233445566", capacity: 8000000 },
    { node1_pub: "mynode", node2_pub: "anon7aabbccddeeff0011223344556677889900aabbccddeeff00112233445566", capacity: 7000000 },
    { node1_pub: "mynode", node2_pub: "anon8aabbccddeeff0011223344556677889900aabbccddeeff00112233445566", capacity: 3000000 },
    { node1_pub: "mynode", node2_pub: "anon9aabbccddeeff0011223344556677889900aabbccddeeff00112233445566", capacity: 2000000 },
  ],
};

