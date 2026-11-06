/* ─────────────────────────────────────────────
   THREAT MODEL LENS — "who are you hiding from?" Privacy advice ranked for
   everyone at once is ranked for no one: the fix that matters most against a
   chain-surveillance firm (break the graph) isn't the one that matters most
   against a nosy acquaintance (stop showing your balance). Each weight maps a
   Fix It recommendation key → how decisive that fix is against the adversary
   (3 = front line, 0 = still worth doing, lower priority here). Selection is
   session-only — nothing is stored.
───────────────────────────────────────────── */
/* The scoring brain, published — hoisted so the standalone
   ?page=methodology page is the one write-up. Results link to it. */
const BTC_METHODOLOGY = [
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
  { check:"Change Detection", deduct:"–4 to –8", why:"Two-output payments where only one output matches the input's script type reveal which output is your change.", sev:"medium" },
];
const BTC_DATA_SOURCES = [
  { src:"Blockstream / mempool.space Esplora API", desc:"Public blockchain data — UTXOs, transactions, address stats. Read-only, your choice of explorer — by default fetched via our open-source no-log relay so the explorer can't see your IP." },
  { src:"Bitcoin whitepaper §10 (Nakamoto, 2008)", desc:"Nakamoto's own privacy guidance: use a new address for every payment. Reuse permanently links transactions — the heuristic behind our address-reuse check." },
  { src:"Chainalysis (Series F, May 2022)", desc:"$8.6B valuation, ~$190M 2023 revenue (Sacra) — the scale of the blockchain-surveillance industry that reads this same public data." },
  { src:"Bitcoin Core relay policy", desc:"The 546-sat dust threshold (GetDustThreshold) — outputs below it are used as tracking beacons." },
];
const LN_METHODOLOGY = [
  { n:"01", label:"Public Node Announcement", desc:"Whether your node is publicly gossiped on the Lightning network. Public nodes expose their IP or Tor address to every peer." },
  { n:"02", label:"KYC Exchange Peer Channels", desc:"Channels to known KYC exchanges (Bitfinex, Kraken, Binance, OKX). These entities log routing metadata and can correlate payment flows through your node." },
  { n:"03", label:"Tor / Clearnet Exposure", desc:"Whether your node listens on clearnet (IP-visible) or Tor-only (anonymous). Clearnet nodes expose their physical location." },
  { n:"04", label:"Channel Diversity", desc:"Number of open channels. Low channel count limits routing path diversity, making payment flows easier to correlate." },
  { n:"05", label:"Channel Capacity Concentration", desc:"Whether one channel dominates your capacity. Heavy concentration makes routing patterns predictable." },
  { n:"06", label:"Node Alias Privacy", desc:"Whether your node alias looks like a real name. Aliases are publicly visible on the Lightning gossip network." },
  { n:"07", label:"Node Establishment", desc:"How long your node has been active. New nodes have limited routing history, making their activity more trackable." },
  { n:"08", label:"On-Chain Channel Footprint", desc:"Every channel open/close is an on-chain transaction. Funding channels from KYC exchange UTXOs permanently links your Lightning activity to your on-chain identity." },
];

const THREAT_MODELS = [
  { id: "snoop", label: "Nosy individuals", icon: "👀",
    sees: "Anyone who knows this address — an ex, a landlord, someone who paid you once — can read its balance and full history on a free explorer. The defense is showing them less: fresh addresses, a spread-out balance, day-to-day spending off-chain.",
    w: { reuse: 3, conc: 3, lightning: 3, change: 2, utxo: 1, node: 1 } },
  { id: "exchange", label: "KYC exchanges", icon: "🏦",
    sees: "An exchange knows your identity and watches where withdrawals go — and many report to chain-analysis partners. The defense is cutting the thread at the withdrawal: odd amounts, no reuse, and breaking the trail before coins reach your main stack.",
    w: { round: 3, reuse: 3, cj: 3, cons: 2, payjoin: 2, node: 1 } },
  { id: "analyst", label: "Surveillance firms", icon: "🛰️",
    sees: "Chain-analysis firms cluster the entire graph — co-spends, change patterns, dust responses, wallet fingerprints — and sell the map to exchanges and governments. The defense is starving their heuristics: mixing, Payjoin, and strict coin control.",
    w: { cj: 3, payjoin: 3, cons: 3, dust: 3, changeid: 3, change: 2, fee: 2, reuse: 2, conc: 1, round: 1 } },
  { id: "attacker", label: "A targeted attacker", icon: "🎯",
    sees: "Someone after you specifically — a thief, a stalker, a hostile state — combines everything above with your visible balance and timing patterns. The defense is everything here, starting with never showing your net worth on every spend.",
    w: { conc: 3, reuse: 3, node: 3, cj: 2, lightning: 2, dust: 2, cons: 2, change: 1, changeid: 1, fee: 1, round: 1 } },
];

/* ─────────────────────────────────────────────
   METHODOLOGY — the Intel page at /?page=methodology. The site's core claim
   ("open heuristics, no black box") is the page results link to, on every
   screen size. It composes the hoisted constants — the
   full scoring brain, the threat-model briefing, and the data sources — as a
   pre-scan orientation surface. Zero new content, one new URL.
───────────────────────────────────────────── */
function MethodologyPage({ onBack, isMobile, onNav }) {
  useLang();
  useEffect(() => {
    const prev = document.title;
    document.title = "Methodology — how AnonScore scores Bitcoin & Lightning privacy";
    const desc = document.querySelector('meta[name="description"]');
    const prevDesc = desc?.getAttribute("content");
    desc?.setAttribute("content", "Every heuristic, every deduction, in the open: the 11 on-chain checks, 8 Lightning checks, threat models, and data sources behind the AnonScore privacy score. No black box.");
    return () => { document.title = prev; if (desc && prevDesc) desc.setAttribute("content", prevDesc); };
  }, []);
  const label = { fontFamily: T.mono, fontSize: 9, color: T.textDim, letterSpacing: 2, marginBottom: 14 };
  const panel = extra => ({ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: isMobile ? "18px 18px" : "24px 28px", ...extra });
  return (
    <div role="main" aria-label="Methodology — how AnonScore scores privacy" style={{ minHeight: "100vh", background: "transparent", display: "flex", flexDirection: "column" }}>
      <h1 className="sr-only">AnonScore Methodology — open Bitcoin and Lightning privacy scoring</h1>
      <SiteNav isMobile={isMobile} onBack={onBack} onNav={onNav} current="methodology" badge="METHODOLOGY" />
      <div style={{ flex: 1, maxWidth: 860, margin: "0 auto", width: "100%", padding: isMobile ? "28px 16px" : "44px 32px", display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ textAlign: "center", marginBottom: 12 }}>
          <div style={{ fontFamily: T.mono, fontSize: 10, color: T.cyan, letterSpacing: 2.5, marginBottom: 14 }}>VERIFY, DON'T TRUST</div>
          <h2 style={{ fontFamily: T.serif, fontSize: isMobile ? 30 : 40, color: T.text, lineHeight: 1.1, fontWeight: 400, marginBottom: 14 }}>
            Every heuristic, every deduction,<br /><em style={{ color: T.cyan }}>in the open.</em>
          </h2>
          <p style={{ fontSize: isMobile ? 14 : 16, color: T.textMid, lineHeight: 1.7, maxWidth: 580, margin: "0 auto", fontWeight: 300 }}>
            This is the entire scoring brain — the same clustering logic the surveillance industry sells, published. Every rule below is implemented in plain JavaScript you can read, audit, and challenge.
          </p>
        </div>

        {/* Threat-model briefing — orientation BEFORE a scan; the interactive
            re-ranking itself lives in the post-scan Fix-It plan. */}
        <div style={panel()}>
          <div style={label}>WHO ARE YOU HIDING FROM?</div>
          <div style={{ fontSize: 13, color: T.textMid, lineHeight: 1.65, marginBottom: 14 }}>
            Privacy is relative to an adversary. These are the four we model — after a scan, the Fix-It plan re-ranks your fixes for whichever one you pick.
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 10 }}>
            {THREAT_MODELS.map(m => (
              <div key={m.id} style={{ background: T.surface, border: `1px solid ${T.borderLo}`, borderRadius: 10, padding: "14px 16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span aria-hidden="true" style={{ fontSize: 16 }}>{m.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{m.label}</span>
                </div>
                <div style={{ fontSize: 12, color: T.textMid, lineHeight: 1.6 }}>{m.sees}</div>
              </div>
            ))}
          </div>
        </div>

        {/* On-chain scoring table */}
        <div style={panel()}>
          <div style={label}>ON-CHAIN · 11 HEURISTICS</div>
          <div style={{ fontSize: 13, color: T.textMid, lineHeight: 1.65, marginBottom: 14 }}>
            Every wallet starts at 100. Each detected issue deducts points by its real-world impact on traceability — CoinJoin is the one positive signal.
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 10 }}>
            {BTC_METHODOLOGY.map((row, i) => (
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

        {/* Lightning scoring table */}
        <div style={panel()}>
          <div style={label}>LIGHTNING · 8 HEURISTICS</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {LN_METHODOLOGY.map(c => (
              <div key={c.n} style={{ display: "flex", gap: 14, background: T.surface, border: `1px solid ${T.borderLo}`, borderRadius: 10, padding: "12px 16px" }}>
                <div style={{ fontFamily: T.mono, fontSize: 10, color: T.ln, minWidth: 24, marginTop: 1 }}>{c.n}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: T.text, marginBottom: 3 }}>{c.label}</div>
                  <div style={{ fontSize: 12.5, color: T.textMid, lineHeight: 1.55 }}>{c.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Data sources */}
        <div style={panel()}>
          <div style={label}>DATA SOURCES</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {BTC_DATA_SOURCES.map((src, i) => (
              <div key={i} style={{ display: "flex", gap: 12, paddingBottom: 10, borderBottom: i < BTC_DATA_SOURCES.length - 1 ? `1px solid ${T.borderLo}` : undefined }}>
                <div style={{ width: 4, borderRadius: 2, background: T.cyan, flexShrink: 0, alignSelf: "stretch" }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: T.text, marginBottom: 3 }}>{src.src}</div>
                  <div style={{ fontSize: 12, color: T.textMid, lineHeight: 1.55 }}>{src.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: T.cyanLo, border: `1px solid ${T.cyanMid}`, borderRadius: 14, padding: "16px 20px", fontSize: 13, color: T.textMid, lineHeight: 1.65 }}>
          <strong style={{ color: T.cyan }}>Open source:</strong> all of the above is implemented in plain JavaScript in this tool's source — no black box, no server-side scoring. Audit every rule at <a href="https://github.com/netasset/anonscore" target="_blank" rel="noopener noreferrer" style={{ color: T.cyan }}>github.com/netasset/anonscore</a>, then <a href="/" onClick={e => { if (onNav && e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) { e.preventDefault(); onNav("landing"); } }} style={{ color: T.cyan }}>run it against a wallet</a>.
        </div>
      </div>
    </div>
  );
}

