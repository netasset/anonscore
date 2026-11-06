/* A shareable report and one plan across the address, the wallet, and the node.
   Both are built from check keys, statuses, and point deltas only. Free text
   from a scan (an address, a txid, an alias, an xpub) is never copied in, so
   the fragment and the exported text cannot carry one. Neither changes a score. */
const REPORT_KEYS = new Set([
  "reuse", "dust", "round", "cj", "cons", "utxo_n", "fee", "change", "conc", "script", "changeid",
  "cluster", "lightning", "payjoin", "node",
  "announced", "kyc_peers", "tor", "channels", "cap_conc", "alias", "age", "onchain",
]);
const REPORT_GRADES = new Set(["A+", "A", "B", "C", "D", "F", "-"]);
const REPORT_KIND = { a: "address", w: "wallet", n: "node" };
const REPORT_CODE = { address: "a", wallet: "w", node: "n" };
const REPORT_STATUS = { f: "fail", w: "warn", p: "pass" };
const REPORT_ST = { fail: "f", warn: "w", pass: "p" };
const PLAN_RANK = ["dust", "reuse", "cons", "round", "change", "changeid", "kyc_peers", "tor", "onchain", "alias", "announced", "cj", "payjoin", "conc", "script", "utxo_n", "fee", "channels", "cap_conc", "node", "age", "lightning"];
const PLAN_PLACE = { address: "this address", wallet: "the wallet", node: "the node" };
const PLAN_COPY = {
  dust: { title: "Freeze the dust. Do not spend it.", why: "A tiny coin is often a tracker. Spending it shows where the rest of the wallet went." },
  reuse: { title: "Use a new address for the next payment you receive.", why: "An address used more than once ties every payment to it together." },
  cons: { title: "Do not spend coins from different places in one payment.", why: "One transaction with those inputs tells an observer they share an owner." },
  round: { title: "Keep the round-amount coins out of the private ones.", why: "A round amount is a common shape of an exchange withdrawal. It is not proof of one, and it should not be spent together with coins you want to keep separate." },
  change: { title: "Send the change to a new address.", why: "Change that returns to an address you already used shows the balance you have left." },
  changeid: { title: "Make the change the same address type as the payment.", why: "When only one output matches the coin you spent, that output is the one an observer follows." },
  kyc_peers: { title: "Close the channels to exchanges.", why: "An exchange on the other end of a channel can log who it routes with." },
  tor: { title: "Turn the node to Tor only.", why: "A clearnet address is the node's IP, and every peer can see it." },
  onchain: { title: "Open the next channel from a coin that is not a round amount.", why: "The channel open is a normal Bitcoin transaction. A round coin in it is a common way an exchange withdrawal gets tied to the node." },
  alias: { title: "Change the node name so it is not a real name.", why: "The alias is public to the whole Lightning network." },
  announced: { title: "Open the next channels as unannounced.", why: "A public node is on the map. An unannounced channel still works, and it is not listed." },
  cj: { title: "Mix the coins whose history you want to break.", why: "Nothing in what was scanned breaks the transaction graph yet. A CoinJoin, or Payjoin on an ordinary payment, is the step that does." },
  payjoin: { title: "Pay with Payjoin when the other person supports it.", why: "Payjoin adds one of their coins to the payment, so the inputs are no longer one owner." },
  conc: { title: "Split the one large coin, without mixing in other sources.", why: "One coin that holds almost the whole balance shows that balance on every spend." },
  script: { title: "Keep the wallet on one address type.", why: "Mixing old and new address types gives an observer a pattern, and it can mark which output is the change." },
  utxo_n: { title: "Do not merge coins just to shorten the list.", why: "A long list is annoying. Combining it links histories that were separate." },
  fee: { title: "Set the fee yourself, and change it a little each time.", why: "The same fee on every payment is a fingerprint of the wallet app." },
  channels: { title: "Open another channel, and keep it unannounced if you can.", why: "Very few public channels make a payment easier to correlate." },
  cap_conc: { title: "Spread the capacity across more than one channel.", why: "Almost all of the capacity in one channel makes routes predictable." },
  node: { title: "Point the wallet at a node you run.", why: "A public server sees every address the wallet asks about, next to your IP." },
  age: { title: "Leave the node running.", why: "A new node has a short history, which is easier to watch. Closing and reopening channels does not help." },
  lightning: { title: "Move day-to-day spending to Lightning.", why: "Those payments are not on the blockchain. Fund the channel from a coin you are willing to tie to it." },
};

function snapshotPart(input) {
  if (!input || (input.kind !== "address" && input.kind !== "wallet" && input.kind !== "node")) return null;
  const checks = [];
  const seen = new Set();
  for (const c of input.checks || []) {
    if (!c || !REPORT_KEYS.has(c.key) || seen.has(c.key)) continue;
    if (c.status !== "fail" && c.status !== "warn" && c.status !== "pass") continue;
    let pts = Number.isFinite(c.pts) ? Math.round(c.pts) : 0;
    if (pts > 99) pts = 99;
    if (pts < -99) pts = -99;
    checks.push({ key: c.key, status: c.status, pts });
    seen.add(c.key);
    if (checks.length >= 24) break;
  }
  let score = null;
  if (Number.isFinite(input.score)) score = Math.max(0, Math.min(100, Math.round(input.score)));
  const grade = REPORT_GRADES.has(input.grade) ? input.grade : (score == null ? "-" : scoreGrade(score));
  const clusterN = input.kind === "address" ? Math.max(0, Math.min(999, input.clusterN | 0)) : 0;
  return { kind: input.kind, score, grade, clusterN, checks };
}

function encodePart(p) {
  const head = `${REPORT_CODE[p.kind]}.${p.score == null ? "x" : p.score}.${p.grade}.${p.clusterN}`;
  if (!p.checks.length) return head;
  return head + "." + p.checks.map(c => `${c.key}:${REPORT_ST[c.status]}:${c.pts}`).join(".");
}
function encodeReport(parts) {
  const list = orderParts(parts);
  if (!list.length) return "";
  if (list.length === 1) return "1." + encodePart(list[0]);
  return "1.p." + list.map(encodePart).join("~");
}
function decodePart(s) {
  const bits = s.split(".");
  if (bits.length < 4) return null;
  const kind = REPORT_KIND[bits[0]];
  if (!kind) return null;
  let score = null;
  if (bits[1] !== "x") {
    if (!/^\d{1,3}$/.test(bits[1])) return null;
    score = Number(bits[1]);
    if (score > 100) return null;
  }
  if (!REPORT_GRADES.has(bits[2])) return null;
  if (!/^\d{1,3}$/.test(bits[3])) return null;
  const clusterN = Number(bits[3]);
  if (kind !== "address" && clusterN !== 0) return null;
  const checks = [];
  const seen = new Set();
  for (let i = 4; i < bits.length; i++) {
    const m = /^([a-z][a-z0-9_]*):([fwp]):(-?\d{1,2})$/.exec(bits[i]);
    if (!m || !REPORT_KEYS.has(m[1]) || seen.has(m[1])) return null;
    const pts = Number(m[3]);
    if (pts > 99 || pts < -99) return null;
    checks.push({ key: m[1], status: REPORT_STATUS[m[2]], pts });
    seen.add(m[1]);
  }
  return { kind, score, grade: bits[2], clusterN, checks };
}
function decodeReport(raw) {
  if (typeof raw !== "string") return null;
  let s = raw.trim();
  if (s.length < 6 || s.length > 2000) return null;
  try { if (s.includes("%")) s = decodeURIComponent(s); } catch { return null; }
  if (s.length < 6 || s.length > 2000) return null;
  if (/[^0-9A-Za-z:._~+-]/.test(s)) return null;
  if (/bc1|tb1|xpub|ypub|zpub|sp1|npub|lnbc/i.test(s)) return null;
  if (!s.startsWith("1.")) return null;
  if (s.startsWith("1.p.")) {
    const body = s.slice(4);
    if (!body || body.includes("~~") || body.startsWith("~") || body.endsWith("~")) return null;
    const segs = body.split("~");
    if (segs.length < 2 || segs.length > 3) return null;
    const parts = [];
    const kinds = new Set();
    for (const seg of segs) {
      const p = decodePart(seg);
      if (!p || kinds.has(p.kind)) return null;
      kinds.add(p.kind);
      parts.push(p);
    }
    return { parts: orderParts(parts) };
  }
  const p = decodePart(s.slice(2));
  if (!p) return null;
  return { parts: [p] };
}
function orderParts(parts) {
  const rank = { address: 0, wallet: 1, node: 2 };
  return (parts || []).filter(p => p && rank[p.kind] != null).slice().sort((a, b) => rank[a.kind] - rank[b.kind]);
}
function mergePlanParts(mine, saved) {
  const map = {};
  if (saved) for (const k of ["address", "wallet", "node"]) if (saved[k]) map[k] = saved[k];
  if (mine && mine.kind) map[mine.kind] = mine;
  return ["address", "wallet", "node"].map(k => map[k]).filter(Boolean);
}
function planBad(part, key) {
  const c = part && part.checks.find(x => x.key === key);
  return !!(c && c.status !== "pass");
}
function planHas(parts, key, status) {
  return parts.some(p => p.checks.some(c => c.key === key && (status ? c.status === status : c.status !== "pass")));
}
function sourceLine(sources) {
  const names = sources.map(k => PLAN_PLACE[k]).filter(Boolean);
  if (names.length === 1) {
    if (names[0] === "this address") return "On this address";
    if (names[0] === "the wallet") return "In the wallet";
    return "On the node";
  }
  return "Seen on " + names.join(" and ");
}
function coveredPhrase(covered) {
  const names = covered.map(k => PLAN_PLACE[k]);
  if (names.length <= 1) return names[0] || "";
  if (names.length === 2) return names[0] + " and " + names[1];
  return names[0] + ", " + names[1] + ", and " + names[2];
}
function buildPrivacyPlan(parts) {
  const list = orderParts(parts);
  const covered = list.map(p => p.kind);
  const missing = ["address", "wallet", "node"].filter(k => !covered.includes(k));
  const bundle = new Map();
  for (const p of list) {
    for (const c of p.checks) {
      if (c.status === "pass" || !PLAN_COPY[c.key === "cluster" ? "cons" : c.key]) continue;
      const key = c.key === "cluster" ? "cons" : c.key;
      const cur = bundle.get(key) || { key, sources: [], pts: 0, cluster: false };
      if (!cur.sources.includes(p.kind)) cur.sources.push(p.kind);
      if (c.pts < cur.pts) cur.pts = c.pts;
      if (c.key === "cluster") cur.cluster = true;
      bundle.set(key, cur);
    }
  }
  const steps = [...bundle.values()]
    .sort((a, b) => PLAN_RANK.indexOf(a.key) - PLAN_RANK.indexOf(b.key) || a.pts - b.pts)
    .slice(0, 6)
    .map(s => {
      const copy = PLAN_COPY[s.key];
      let why = copy.why;
      if (s.key === "cons" && s.cluster) why = "The wallet already has a transaction that spends from more than one of its own addresses. The chain treats those as one owner. Do not add another coin to that spend.";
      return { key: s.key, sources: s.sources, title: copy.title, why, where: (FIX_HOWTO[s.key] || {}).where || "", steps: (FIX_HOWTO[s.key] || {}).steps || [] };
    });
  let bridge = null;
  if (planHas(list, "cj", "pass") && (planHas(list, "reuse") || planHas(list, "dust") || planHas(list, "round") || planHas(list, "cons") || planHas(list, "cluster"))) {
    bridge = "A CoinJoin is already in this history, and so is something that would link it back: a reused address, dust, a round amount, or a payment that combines coins. The mix did its job. Spending the mixed coin together with one of those undoes it.";
  } else if (list.some(p => p.kind === "address" && planBad(p, "reuse")) && list.some(p => p.kind === "wallet" && (planBad(p, "cluster") || planBad(p, "cons")))) {
    bridge = "The address was used more than once, and the wallet already spends from more than one of its own addresses in one transaction. The next payment can tie that reused address to the rest of the wallet. Use a new address first, and do not combine those coins.";
  } else if ((list.some(p => p.kind !== "node" && planBad(p, "round"))) && list.some(p => p.kind === "node" && planBad(p, "onchain"))) {
    bridge = "Some coins are round amounts, a common shape of an exchange withdrawal, and this node opens channels on the blockchain. Open the next channel from a coin that is not one of those.";
  } else if (list.some(p => p.kind === "address" && planBad(p, "dust")) && list.some(p => p.kind === "wallet" && (planBad(p, "cluster") || planBad(p, "cons")))) {
    bridge = "There is dust on the address, and the wallet already links its own addresses. Spending the dust would show an observer the rest of the wallet.";
  } else if (covered.length >= 2) {
    bridge = "These scans are the same stack seen from different places. The list is one order, starting with the move that stops the next spend from linking them.";
  }
  const missNames = missing.map(k => k === "address" ? "an address" : PLAN_PLACE[k]);
  let sentence;
  if (!covered.length) sentence = "Scan an address, a wallet, or a node and the plan will show up here.";
  else if (!steps.length) sentence = covered.length === 1
    ? `Nothing on ${PLAN_PLACE[covered[0]]} has to change before the next spend. Scan ${missNames.join(" or ")} and this list will add those steps.`
    : `Nothing in ${coveredPhrase(covered)} has to change before the next spend.`;
  else if (covered.length === 1) sentence = `This plan is only ${PLAN_PLACE[covered[0]]}. Scan ${missNames.join(" or ")} and the same list will add those steps. Nothing you paste is put into the shared report.`;
  else sentence = `One plan for ${coveredPhrase(covered)}. Do them in this order.`;
  return { sentence, bridge, steps, covered, missing };
}
function reportVerdict(part) {
  const checks = part.checks.map(c => ({ key: c.key, status: c.status, pts: c.pts, plain: "" }));
  const kind = part.kind === "address" ? "btc" : part.kind === "wallet" ? "wallet" : "ln";
  return plainVerdict({ score: part.score == null ? 0 : part.score, checks, kind, clusterN: part.clusterN || 0 });
}
function reportText(view) {
  if (!view || !view.parts) return "";
  const plan = buildPrivacyPlan(view.parts);
  const lines = [
    "AnonScore privacy report",
    "No address, no transaction id, and no node key are in this report.",
    "",
  ];
  for (const p of view.parts) {
    lines.push(`${p.kind === "address" ? "Address" : p.kind === "wallet" ? "Wallet" : "Node"} · Grade ${p.grade} · ${p.score == null ? "no score" : p.score + "/100"}`);
    lines.push(reportVerdict(p));
    lines.push("");
  }
  if (plan.bridge) {
    lines.push("How these connect");
    lines.push(plan.bridge);
    lines.push("This is a reading of the checks. It does not change the score.");
    lines.push("");
  }
  lines.push(plan.sentence);
  lines.push("");
  if (plan.steps.length) {
    lines.push("Do these in order");
    plan.steps.forEach((s, i) => {
      lines.push(`${i + 1}. ${s.title}`);
      lines.push(`   ${sourceLine(s.sources)}`);
      lines.push(`   ${s.why}`);
      if (s.where && s.steps.length) {
        lines.push(`   In ${s.where}`);
        s.steps.forEach(st => lines.push(`   - ${st}`));
      }
    });
  }
  lines.push("");
  lines.push("anonscore.com");
  return lines.join("\n");
}
function reportLink(token) {
  return "https://anonscore.com/#r=" + token;
}
function readReportHash() {
  try {
    const h = (typeof window !== "undefined" && window.location.hash || "").replace(/^#/, "");
    const m = /^r=(.*)$/.exec(h);
    return m && m[1] ? m[1] : "";
  } catch { return ""; }
}

function ReportBody({ view, compact }) {
  const plan = buildPrivacyPlan(view.parts);
  const [open, setOpen] = useState(null);
  const steps = compact ? plan.steps.slice(0, 3) : plan.steps;
  return (
    <div>
      {view.parts.map(p => (
        <div key={p.kind} style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontFamily: T.serif, fontSize: 22, color: scoreColor(p.score || 0), lineHeight: 1 }}>Grade {p.grade}</span>
            <span style={{ fontFamily: T.mono, fontSize: 13, color: T.textMid }}>{p.score == null ? "no score" : p.score + "/100"}</span>
            <span style={{ fontFamily: T.mono, fontSize: 11, color: T.textDim, letterSpacing: 0.4 }}>{p.kind === "address" ? "ADDRESS" : p.kind === "wallet" ? "WALLET" : "NODE"}</span>
          </div>
          <p style={{ fontSize: 15, color: T.text, lineHeight: 1.55, margin: "8px 0 0" }}>{reportVerdict(p)}</p>
        </div>
      ))}
      {plan.bridge && (
        <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: "12px 14px", marginBottom: 12 }}>
          <div style={{ fontFamily: T.mono, fontSize: 11, color: T.cyan, letterSpacing: 0.6, marginBottom: 6 }}>{plan.covered.length > 1 ? "HOW THESE CONNECT" : "READ THIS FIRST"}</div>
          <p style={{ fontSize: 14, color: T.text, lineHeight: 1.55, margin: 0 }}>{plan.bridge}</p>
          <div style={{ fontSize: 12, color: T.textMid, marginTop: 6 }}>A reading of the checks. It does not change the score.</div>
        </div>
      )}
      <p style={{ fontSize: 14, color: T.textMid, lineHeight: 1.55, margin: "0 0 12px" }}>{plan.sentence}</p>
      {steps.length > 0 && (
        <ol style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
          {steps.map((s, i) => (
            <li key={s.key} style={{ background: T.surface, border: `1px solid ${T.borderLo}`, borderRadius: 12, padding: "12px 14px" }}>
              <div style={{ fontFamily: T.mono, fontSize: 11, color: T.textDim, marginBottom: 4 }}>{String(i + 1).padStart(2, "0")} · {sourceLine(s.sources)}</div>
              <div style={{ fontSize: 15, color: T.text, lineHeight: 1.45 }}>{s.title}</div>
              {!compact && <div style={{ fontSize: 13, color: T.textMid, lineHeight: 1.5, marginTop: 4 }}>{s.why}</div>}
              {!compact && s.steps.length > 0 && (
                <div style={{ marginTop: 8 }}>
                  <button type="button" onClick={() => setOpen(open === s.key ? null : s.key)} aria-expanded={open === s.key}
                    style={{ background: "none", border: "none", padding: 0, cursor: "pointer", fontFamily: T.sans, fontSize: 13, fontWeight: 600, color: T.cyan }}>
                    {open === s.key ? "Hide the clicks" : `Show the clicks in ${s.where}`}
                  </button>
                  {open === s.key && (
                    <ol style={{ margin: "8px 0 0", paddingLeft: 18 }}>
                      {s.steps.map((st, n) => <li key={n} style={{ fontSize: 14, color: T.textMid, lineHeight: 1.5 }}>{st}</li>)}
                    </ol>
                  )}
                </div>
              )}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

function PrivacyPlanCard({ parts, onShare }) {
  const plan = buildPrivacyPlan(parts);
  const [open, setOpen] = useState(null);
  const [more, setMore] = useState(false);
  if (!parts || !parts.length) return null;
  const shown = more ? plan.steps : plan.steps.slice(0, 3);
  return (
    <section aria-label="Your privacy plan" data-report-token={encodeReport(parts)} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: "16px 18px", marginBottom: 14, overflowWrap: "break-word" }}>
      <div style={{ fontFamily: T.mono, fontSize: 11, color: T.cyan, letterSpacing: 1.1, marginBottom: 6 }}>YOUR PRIVACY PLAN</div>
      <h2 style={{ fontFamily: T.serif, fontSize: 22, color: T.text, fontWeight: 400, margin: "0 0 8px" }}>Before the next spend</h2>
      {plan.bridge && (
        <div style={{ background: T.surface, borderRadius: 12, padding: "12px 14px", marginBottom: 10 }}>
          <div style={{ fontFamily: T.mono, fontSize: 11, color: T.cyan, letterSpacing: 0.6, marginBottom: 6 }}>{plan.covered.length > 1 ? "HOW THESE CONNECT" : "READ THIS FIRST"}</div>
          <p style={{ fontSize: 15, color: T.text, lineHeight: 1.55, margin: 0 }}>{plan.bridge}</p>
          <div style={{ fontSize: 12, color: T.textMid, marginTop: 6 }}>A reading of the checks. It does not change the score.</div>
        </div>
      )}
      <p style={{ fontSize: 14, color: T.textMid, lineHeight: 1.55, margin: "0 0 12px" }}>{plan.sentence}</p>
      {shown.length > 0 && (
        <ol style={{ margin: "0 0 12px", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
          {shown.map((s, i) => (
            <li key={s.key}>
              <div style={{ fontFamily: T.mono, fontSize: 11, color: T.textDim, marginBottom: 2 }}>{String(i + 1).padStart(2, "0")} · {sourceLine(s.sources)}</div>
              <div style={{ fontSize: 15, color: T.text, lineHeight: 1.45 }}>{s.title}</div>
              <button type="button" onClick={() => setOpen(open === s.key ? null : s.key)} aria-expanded={open === s.key}
                style={{ background: "none", border: "none", padding: 0, marginTop: 4, cursor: "pointer", fontFamily: T.sans, fontSize: 13, fontWeight: 600, color: T.cyan }}>
                {open === s.key ? "Hide the clicks" : `Show the clicks in ${s.where || "your wallet"}`}
              </button>
              {open === s.key && (
                <div style={{ marginTop: 6 }}>
                  <div style={{ fontSize: 13, color: T.textMid, lineHeight: 1.5 }}>{s.why}</div>
                  {s.steps.length > 0 && (
                    <ol style={{ margin: "6px 0 0", paddingLeft: 18 }}>
                      {s.steps.map((st, n) => <li key={n} style={{ fontSize: 14, color: T.textMid, lineHeight: 1.5 }}>{st}</li>)}
                    </ol>
                  )}
                </div>
              )}
            </li>
          ))}
        </ol>
      )}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 10 }}>
        {plan.steps.length > 3 && (
          <button type="button" onClick={() => setMore(v => !v)} aria-expanded={more}
            style={{ background: "none", border: "none", padding: 0, cursor: "pointer", fontFamily: T.sans, fontSize: 13, fontWeight: 600, color: T.textMid }}>
            {more ? "Hide the other steps" : `Show ${plan.steps.length - 3} more steps`}
          </button>
        )}
        {onShare && (
          <button type="button" onClick={onShare}
            style={{ background: T.cyan, border: "none", borderRadius: 10, padding: "11px 16px", color: T.bg, fontFamily: T.sans, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
            Share this plan
          </button>
        )}
      </div>
      <div style={{ fontSize: 12, color: T.textMid, lineHeight: 1.5, marginTop: 8 }}>The shared link leaves out every address, transaction id, and node key.</div>
    </section>
  );
}

function ReportPage({ token, isMobile, onNav }) {
  const view = decodeReport(token || "");
  return (
    <div role="main" aria-label="Shared privacy report" style={{ minHeight: "100vh", background: "transparent", display: "flex", flexDirection: "column" }}>
      <h1 className="sr-only">Shared privacy report with no address</h1>
      <SiteNav isMobile={isMobile} onBack={() => onNav && onNav("landing")} onNav={onNav} badge="SHARED REPORT" />
      <div style={{ flex: 1, maxWidth: 720, margin: "0 auto", width: "100%", padding: isMobile ? "28px 16px" : "40px 32px" }}>
        {!view ? (
          <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: "20px 18px" }}>
            <h2 style={{ fontFamily: T.serif, fontSize: 28, color: T.text, fontWeight: 400, margin: "0 0 10px" }}>This link is not a privacy report.</h2>
            <p style={{ fontSize: 15, color: T.textMid, lineHeight: 1.6, margin: 0 }}>Nothing was looked up. A report link only redraws the grade and the steps that were packed into it.</p>
          </div>
        ) : (
          <>
            <div style={{ fontFamily: T.mono, fontSize: 11, color: T.cyan, letterSpacing: 1.2, marginBottom: 8 }}>SHARED REPORT</div>
            <h2 style={{ fontFamily: T.serif, fontSize: isMobile ? 28 : 36, color: T.text, fontWeight: 400, lineHeight: 1.15, margin: "0 0 10px" }}>The findings, without the wallet.</h2>
            <p style={{ fontSize: 15, color: T.textMid, lineHeight: 1.6, margin: "0 0 16px" }}>This page did not look up the chain. The link has no address, no transaction id, and no node key. It is a reading of the checks someone chose to share, and it does not change their score.</p>
            <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: isMobile ? "16px" : "20px 22px" }}>
              <ReportBody view={view} />
            </div>
            <button type="button" onClick={() => onNav && onNav("landing")}
              style={{ marginTop: 16, background: T.cyan, border: "none", borderRadius: 10, padding: "12px 18px", color: T.bg, fontFamily: T.sans, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
              Check your own
            </button>
          </>
        )}
      </div>
    </div>
  );
}
