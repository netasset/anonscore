/* ─────────────────────────────────────────────
   WALLET DIRECTORY — curated reviews of every tool the audit recommends.
   Standalone page at /?page=wallets. Each entry: factual pitch + the
   privacy STRENGTHS the tool actually delivers, plus honest WATCH-OUTS so
   visitors trust the list isn't pay-to-play. Categories let the page
   double as comparison material.
   When TOOL_AFFILIATE_URL adds an entry, that tool's "Visit" link
   auto-becomes affiliate + the page surfaces the disclosure.
───────────────────────────────────────────── */
const WALLET_CATEGORIES = [
  { key: "desktop",   label: "Desktop wallets",    icon: "🖥",  blurb: "Full coin control, the strongest privacy primitives."          },
  { key: "mobile",    label: "Mobile wallets",     icon: "📱",  blurb: "On-chain BTC in your pocket. Less privacy than desktop — pick carefully." },
  { key: "lightning", label: "Lightning wallets",  icon: "⚡",  blurb: "Off-chain payments. Self-custodial > custodial for privacy."   },
  { key: "p2p",       label: "Non-KYC exchanges",  icon: "🤝",  blurb: "Source Bitcoin without doxxing yourself to a centralised gatekeeper." },
  { key: "node",      label: "Self-hosted nodes",  icon: "📡",  blurb: "Stop leaking every address you query to public Electrum servers." },
];

const WALLET_REVIEWS = [
  // ─ Desktop ──────────────────────────────────────────
  { name: "Sparrow Wallet", category: "desktop", os: "macOS · Windows · Linux", pitch: "The pro's desktop Bitcoin wallet. Best-in-class coin control, UTXO labelling, hardware-wallet support, and Tor / your-own-node connectivity by default.",
    strengths: ["Per-UTXO freeze, label, and select before every spend", "Connects to your own Electrum server or Bitcoin Core out of the box — no leaking queries", "Silent Payments send + receive (BIP352), plus strong hardware-wallet support (Coldcard, Trezor, Ledger, Foundation, BitBox, Jade)"],
    watchOuts:  ["Desktop only — there is no mobile app", "No built-in CoinJoin since Samourai's Whirlpool was seized in 2024 (Sparrow removed the integration) — use it for coin control + Silent Payments, and mix via a separate tool if needed"] },
  { name: "Wasabi Wallet", category: "desktop", os: "macOS · Windows · Linux", pitch: "Privacy-first desktop Bitcoin wallet with WabiSabi CoinJoin and automatic coin labelling. Beginner-friendlier than Sparrow.",
    strengths: ["WabiSabi CoinJoin runs automatically once you pick a coordinator", "Default labels every coin by source, helping avoid accidental cluster merges", "Built-in Tor"],
    watchOuts:  ["Its original coordinator (zkSNACKs) shut down in 2024 — you now select a community-run coordinator via 'Change Coordinator'", "Centralized WabiSabi coordinators carry some deanonymization risk; Joinmarket avoids a coordinator entirely", "Desktop only"] },
  { name: "Ginger Wallet", category: "desktop", os: "macOS · Windows · Linux", pitch: "An open-source Wasabi fork that runs its own active WabiSabi CoinJoin coordinator — filling the gap left when the original coordinator shut down in 2024.",
    strengths: ["Ships with a working CoinJoin coordinator out of the box — no hunting for one", "Inherits Wasabi's client-side block filters, coin labelling, and built-in Tor", "Fully open source, community-maintained"],
    watchOuts:  ["Centralized WabiSabi coordinators carry some deanonymization risk — Joinmarket avoids a coordinator entirely", "Desktop only; a younger fork than upstream Wasabi"] },
  { name: "Bitcoin Core", category: "desktop", os: "macOS · Windows · Linux · BSD", pitch: "The reference Bitcoin implementation. The wallet is bundled with a full node, so by definition you query no one but yourself.",
    strengths: ["You ARE your own node — no third-party query leaks possible", "Maximum sovereignty + verification", "Free and battle-tested since 2009"],
    watchOuts:  ["Initial block download requires ~600GB and several days", "UX is functional, not friendly — best paired with a wallet front-end (Sparrow, Electrum, Specter)"] },
  { name: "Electrum", category: "desktop", os: "macOS · Windows · Linux · Android", pitch: "Long-standing lightweight Bitcoin wallet. Fast, scriptable, deeply customisable, with manual coin control.",
    strengths: ["Lightweight — no full-node download needed", "Manual coin control via the Coins tab + UTXO freezing", "Connects to your own Electrum / Bitcoin-Core-with-Electrs server"],
    watchOuts:  ["Default connects to public Electrum servers — change this to your own node before scanning real addresses", "Multiple lookalike fake-Electrum scam wallets exist; verify download signatures"] },
  { name: "Joinmarket", category: "desktop", os: "macOS · Windows · Linux", pitch: "Peer-to-peer CoinJoin protocol where 'makers' earn fees and 'takers' pay them. No operator-run coordinator.",
    strengths: ["No central coordinator — fully P2P, harder to censor or seize", "Earn yield as a maker while improving network-wide privacy", "Mature codebase (since 2015)"],
    watchOuts:  ["Steep learning curve — CLI-first; the YieldGenerator GUI is improving but rough", "Best for users comfortable running a Bitcoin Core node"] },
  { name: "BTCPay Server", category: "desktop", os: "Self-hosted (Docker / Lightning Node)", pitch: "Self-hosted Bitcoin + Lightning payment processor. Merchants own their keys and node — no third-party seeing every payment.",
    strengths: ["Replaces BitPay-style processors that doxx every customer", "Built-in Payjoin + CoinJoin support for merchant flows", "Plugin ecosystem (point-of-sale, accounting, gift cards)"],
    watchOuts:  ["You're running infrastructure — backups, updates, and uptime are on you", "Best for merchants and power users; not a personal wallet"] },

  // ─ Mobile ──────────────────────────────────────────
  { name: "Cake Wallet", category: "mobile", os: "iOS · Android · macOS", pitch: "Open-source mobile wallet for Bitcoin and Monero that brings desktop-grade privacy features — Silent Payments and Payjoin — to your phone.",
    strengths: ["Silent Payments send + receive with on-device scanning (the server never learns which outputs are yours)", "Payjoin v2 in the default send flow — breaks the common-input heuristic on ordinary payments", "Open source; also holds Monero for cross-chain privacy"],
    watchOuts:  ["Multi-coin app is heavier than a Bitcoin-only wallet", "Built-in swap/exchange services are third parties — using them can pull in KYC"] },
  { name: "Blue Wallet", category: "mobile", os: "iOS · Android", pitch: "Open-source mobile Bitcoin wallet with HD support, multisig, Lightning (via LndHub), and Tor.",
    strengths: ["HD wallet — fresh address per receive by default, plus Silent Payments receiving (BIP352)", "Optional Tor for connection privacy", "Multisig (Vault) support"],
    watchOuts:  ["Default Lightning is custodial (LndHub) — fine for spending money, not savings", "Mobile means limited coin control vs. desktop"] },
  { name: "Nunchuk", category: "mobile", os: "iOS · Android · macOS · Windows · Linux", pitch: "Privacy-focused multisig wallet with strong UTXO management and collaborative custody.",
    strengths: ["First-class multisig + assisted recovery", "Per-UTXO tagging and coin control, plus Silent Payments receiving (BIP352)", "Works with most hardware wallets"],
    watchOuts:  ["Some features (key recovery service) involve trusting Nunchuk Pro — read the model before enabling", "Best for users already comfortable with multisig concepts"] },

  // ─ Lightning ──────────────────────────────────────────
  { name: "Phoenix Wallet", category: "lightning", os: "iOS · Android", pitch: "Self-custodial mobile Lightning by ACINQ. Channels managed automatically — feels custodial, but the keys are yours.",
    strengths: ["You hold the keys — true self-custody", "Channels open and rebalance themselves; no liquidity management needed", "Tor-friendly"],
    watchOuts:  ["ACINQ is the only LSP — single peer is fine for spending, less so for receiving large amounts", "Splice/channel fees are unavoidable when on-chain settlement happens"] },
  { name: "Breez", category: "lightning", os: "iOS · Android", pitch: "Self-custodial mobile Lightning wallet with a built-in podcast player and merchant point-of-sale.",
    strengths: ["Self-custodial Lightning + on-chain in one app", "Built-in keysend & podcast support (LN over RSS)", "POS mode for merchants"],
    watchOuts:  ["Like all auto-channel-opening LN wallets, you trust the LSP not to grief during channel opens", "Receive UX can be confusing for first-timers (channel-open fees on first receive)"] },
  { name: "Zeus", category: "lightning", os: "iOS · Android", pitch: "Connect your own LND, CLN, or Eclair node from your phone. Power-user remote control.",
    strengths: ["You run the node — zero LSP / operator trust", "Supports LND, Core Lightning (CLN), Eclair, Embedded LND", "Per-channel routing controls"],
    watchOuts:  ["Requires you to already have a Lightning node — not a beginner starting point", "Mobile connection back to your node needs careful Tor / VPN setup"] },
  { name: "Blixt Wallet", category: "lightning", os: "Android · macOS · Windows · Linux", pitch: "Runs a full LND node directly on your phone — no LSP, no custodian, no compromises.",
    strengths: ["Embedded LND node — you ARE the Lightning node", "Full feature set: keysend, AMP, MPP, splicing, BOLT-12", "Open source, no telemetry"],
    watchOuts:  ["You must manage channels and liquidity yourself", "Battery drain higher than auto-channel wallets — needs to stay online to route"] },
  { name: "Alby", category: "lightning", os: "Browser extension (Chrome / Firefox / Safari)", pitch: "Browser-side Lightning + Nostr identity. Zaps, podcasting, and WebLN-enabled apps without leaving the page.",
    strengths: ["WebLN brings one-click LN payments to web apps", "Nostr signing built in — one extension covers both protocols", "Account → Alby Hub option lets you self-host the back-end"],
    watchOuts:  ["The hosted Alby account is custodial unless you migrate to Alby Hub", "Browser extension model means an attacker who compromises the browser sees your keys"] },

  // ─ Non-KYC exchanges / P2P ──────────────────────────────────────────
  { name: "Bisq", category: "p2p", os: "macOS · Windows · Linux", pitch: "Decentralised peer-to-peer Bitcoin exchange. Trades happen over Tor with two-of-two multisig escrow — no custodian.",
    strengths: ["No KYC, no account, no operator that can be subpoenaed", "Tor-only by default", "Multisig escrow means even a fraudulent counterparty can't take your funds"],
    watchOuts:  ["Liquidity is thinner than KYC venues — expect higher spreads and slower fills", "Bisq2 (the rewrite) is still maturing; Bisq1 will sunset eventually"] },
  { name: "Robosats", category: "p2p", os: "Web (Tor) · Android", pitch: "Lightning-based peer-to-peer Bitcoin exchange. Trades complete in minutes via hold invoices — no custody, no signup.",
    strengths: ["Tor-native + Lightning-fast settlement", "No account, no email, no KYC ever", "Reputation system built around hashed-key identities, not real names"],
    watchOuts:  ["Lower-volume than Bisq for large trades", "You need a Lightning wallet that supports hold invoices (most do, some don't)"] },
  { name: "Peach Bitcoin", category: "p2p", os: "iOS · Android", pitch: "Mobile peer-to-peer Bitcoin marketplace. SEPA, cash-by-mail, and many other payment methods supported.",
    strengths: ["Mobile-first — easier than Bisq for non-technical users", "Wide payment-method support per region", "Optional escrow"],
    watchOuts:  ["Operator-run platform — not as censorship-resistant as Bisq", "Mobile means you trust your phone OS — use a privacy-respecting handset"] },
  { name: "HodlHodl", category: "p2p", os: "Web", pitch: "Non-custodial P2P marketplace using on-chain multisig escrow. Years of operation, broad payment-method support.",
    strengths: ["Multisig escrow — funds locked in 2-of-3 between buyer, seller, HodlHodl arbiter", "Lots of payment methods including cash-by-mail", "Long operating history"],
    watchOuts:  ["Web-only — Tor recommended", "Arbiter participates in escrow; choose counterparties with established reputation"] },
  { name: "AgoraDesk", category: "p2p", os: "Web", pitch: "Peer-to-peer marketplace evolved from LocalBitcoins-style trading. Supports cash-in-person and many fiat methods.",
    strengths: ["Cash-in-person and cash-by-mail support is rare and valuable", "No mandatory KYC for most trades"],
    watchOuts:  ["Operator-run — you trust AgoraDesk's arbitration", "Cash-in-person trades carry physical-safety considerations; meet in public"] },

  // ─ Nodes ──────────────────────────────────────────
  { name: "Umbrel", category: "node", os: "Raspberry Pi · Linux · Umbrel Home (hardware)", pitch: "App-store-style plug-and-play personal server. Bitcoin + Lightning + dozens of self-hostable apps.",
    strengths: ["One-click app installs — easiest path to your own node", "Includes Bitcoin Core, LND, and Electrs out of the box", "Active community + frequent updates"],
    watchOuts:  ["Umbrel OS opens an attack surface — keep it on a separate VLAN, don't expose to the internet without Tor", "App-store model means trusting Umbrel's app review for any add-ons you install"] },
  { name: "Start9", category: "node", os: "StartOS (purpose-built) · Server Hardware", pitch: "Sovereignty-focused Linux distro for self-hosting. Strong privacy and security defaults — Tor by default, no remote telemetry.",
    strengths: ["Tor everywhere by default — clearnet is opt-in", "Reproducible builds for every service", "Lightning + Bitcoin + Nostr relay + many privacy services in the catalogue"],
    watchOuts:  ["Pricier hardware than Umbrel's Pi-based starter setups", "More configuration surface — read each service's docs before exposing it"] },
  { name: "RaspiBlitz", category: "node", os: "Raspberry Pi", pitch: "DIY-style Bitcoin + Lightning node distribution with a focus on transparency and learning.",
    strengths: ["Fully open source — every layer auditable", "Strong Lightning routing-node feature set", "Active maintainer community"],
    watchOuts:  ["More hands-on than Umbrel — assumes Linux comfort", "Display + Pi hardware integration can be finicky"] },
  { name: "MyNode", category: "node", os: "Raspberry Pi · Linux", pitch: "Beginner-friendly Bitcoin / Lightning node with a free community edition and a paid premium tier.",
    strengths: ["Simple web UI", "Free Community Edition covers the essentials", "Premium adds VPN, BTCPay, and pro support"],
    watchOuts:  ["Premium model means some features (VPN, BTCPay one-click) require a paid licence", "Community is smaller than Umbrel's"] },
  { name: "Nodl", category: "node", os: "Nodl hardware appliance", pitch: "Pre-built plug-and-play Bitcoin + Lightning node hardware. Pay once, plug in, done.",
    strengths: ["Zero-assembly hardware — fastest path from 'no node' to 'have node'", "Tor + clearnet + Electrum + LND all preconfigured"],
    watchOuts:  ["Hardware vendor — you trust Nodl's firmware build process", "More expensive than DIY Pi setups"] },
];

