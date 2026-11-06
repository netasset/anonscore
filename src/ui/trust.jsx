/* ─────────────────────────────────────────────
   PRIVACY RELAY TOGGLE — opt-in mitigation for the browser→explorer IP leak
───────────────────────────────────────────── */
function RelayToggle({ trustLine }) {
  const on = useRelay();
  const expId = useExplorer();
  const [open, setOpen] = useState(false);
  useLang(); // strings below are localized
  const exp = EXPLORERS[expId];
  return (
    <div style={{ maxWidth: HERO_COL, margin: "0 auto 12px", animation: "fadeUp .5s ease .2s both", background: on ? T.cyanLo : T.surface, border: `1px solid ${on ? T.cyan + "66" : T.border}`, borderRadius: 10, padding: "10px 14px", transition: "all .2s" }}>
      {trustLine && (
        <div style={{ fontFamily: T.sans, fontSize: 12, color: T.textMid, lineHeight: 1.5, textAlign: "left", marginBottom: open ? 9 : 0, paddingBottom: open ? 9 : 0, borderBottom: open ? `1px solid ${T.borderLo}` : "none" }}>
          {trustLine}
        </div>
      )}
      {!open && (
        <button type="button" onClick={() => setOpen(true)} aria-expanded={false}
          style={{ marginTop: trustLine ? 8 : 0, width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, background: "transparent", border: "none", padding: 0, cursor: "pointer", textAlign: "left" }}>
          <span style={{ fontFamily: T.sans, fontSize: 12, color: T.textMid, lineHeight: 1.4 }}>
            <strong style={{ color: on ? T.cyan : T.text }}>{t(on ? "relay.on.label" : "relay.off.label")}</strong>
            {" · "}{exp.label}
          </span>
          <span style={{ fontFamily: T.mono, fontSize: 10, color: T.cyan, flexShrink: 0 }}>Change</span>
        </button>
      )}
      {open && <>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 11 }}>
        <button role="switch" aria-checked={on} aria-label={t("relay.aria")}
          onClick={() => setRelay(!on)}
          style={{ flexShrink: 0, width: 40, height: 23, borderRadius: 999, border: "none", cursor: "pointer", background: on ? T.cyan : T.border, position: "relative", transition: "background .2s", marginTop: 1 }}>
          <span style={{ position: "absolute", top: 2.5, left: on ? 19 : 2.5, width: 18, height: 18, borderRadius: "50%", background: on ? T.bg : T.textDim, transition: "left .2s" }} />
        </button>
        <div style={{ fontFamily: T.sans, fontSize: 12, color: T.textMid, lineHeight: 1.5, textAlign: "left" }}>
          <strong style={{ color: on ? T.cyan : T.text }}>{t(on ? "relay.on.label" : "relay.off.label")}</strong>
          {t(on ? "relay.on.body" : "relay.off.body").replace("{x}", exp.label)}
          {" "}
          <a href="https://github.com/netasset/anonscore/blob/main/workers/relay/worker.js" target="_blank" rel="noopener noreferrer"
            style={{ color: T.cyan, textDecoration: "none", fontFamily: T.mono, fontSize: 11, whiteSpace: "nowrap" }}>{t("relay.verify")}</a>
        </div>
      </div>
      {/* Explorer picker — both speak the same esplora API, direct or relayed.
          Styled as an obvious two-way toggle so it reads as switchable. */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 9, paddingLeft: 51, flexWrap: "wrap" }}>
        <span style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, letterSpacing: 1 }}>{t("relay.explorer")}</span>
        {Object.entries(EXPLORERS).map(([id, e]) => (
          <button key={id} onClick={() => setExplorer(id)} aria-pressed={expId === id}
            aria-label={`Switch the block explorer to ${e.label}`} title={`Switch to ${e.label}`}
            style={{ background: expId === id ? T.cyanLo : T.surface, border: `1px solid ${expId === id ? T.cyan + "aa" : T.border}`, borderRadius: 999, padding: "4px 12px", fontFamily: T.mono, fontSize: 10, color: expId === id ? T.cyan : T.textMid, cursor: "pointer", transition: "all .15s" }}
            onMouseOver={e2 => { if (expId !== id) { e2.currentTarget.style.borderColor = T.cyan + "77"; e2.currentTarget.style.color = T.cyan; } }}
            onMouseOut={e2 => { if (expId !== id) { e2.currentTarget.style.borderColor = T.border; e2.currentTarget.style.color = T.textMid; } }}>
            {e.label}
          </button>
        ))}
        <span aria-hidden="true" style={{ fontFamily: T.mono, fontSize: 9.5, color: T.cyan, letterSpacing: 0.5, marginLeft: 2, whiteSpace: "nowrap" }}>⇄ tap to switch</span>
        <button type="button" onClick={() => setOpen(false)} aria-expanded={true}
          style={{ marginLeft: "auto", background: "transparent", border: "none", padding: 0, fontFamily: T.mono, fontSize: 10, color: T.textDim, cursor: "pointer" }}>
          Done
        </button>
      </div>
      </>}
    </div>
  );
}

/* ─────────────────────────────────────────────
   TRUST BOX — collapsed by default, expands on click
───────────────────────────────────────────── */
// Every claim links to its proof. That's the standard an open-source privacy
// tool should hold itself to: don't ask for trust — hand over the evidence.
const REPO = "https://github.com/netasset/anonscore";
const GUARANTEES = [
  { icon: "⬡", label: "No server, no backend", desc: "Lookups read a public explorer — through our no-log relay by default, or straight from your browser with the relay off. Either way nothing touches an AnonScore database. There isn't one.",
    proof: "read the fetch code", href: `${REPO}/blob/main/src/client/chain.jsx` },
  { icon: "◌", label: "Nothing stored or logged", desc: "No database, no analytics, no session tracking. Your scan history lives in your browser's local storage and never leaves it.",
    proof: "see the privacy stance", href: `${REPO}#privacy-stance-what-makes-this-site-different` },
  { icon: "◎", label: "Scoring runs in your browser", desc: "All 11 heuristics execute locally. Your score and results are computed on your device and sent nowhere — not even to us.",
    proof: "read the heuristics", href: `${REPO}/blob/main/src/scoring/engine.jsx` },
  { icon: "⬢", label: "Zero third-party requests", desc: "Every script, font, and icon is self-hosted. A strict Content-Security-Policy makes your browser block anything else — enforced by the browser, not by our promise.",
    proof: "read the CSP header", href: `${REPO}/blob/main/_headers` },
  { icon: "◇", label: "Even the relay can't remember you", desc: "A stateless Worker: no storage, no logging code, observability pinned off in its config. 'No logs' is a setting in the public repo, not a claim you have to trust.",
    proof: "read the relay source", href: `${REPO}/blob/main/workers/relay/worker.js` },
  { icon: "▣", label: "Open source, MIT, auditable in minutes", desc: "One readable repo: site, heuristics, relay. Security issues get a private disclosure path. Even our funding is disclosed, in the footer.",
    proof: "browse the repo", href: REPO },
];

function TrustBox() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ background: T.surface, border: `1px solid ${open ? T.green + "44" : T.border}`, borderRadius: 12, marginBottom: 20, animation: "fadeUp .5s ease .18s both", transition: "border-color .2s", overflow: "hidden" }}>
      {/* Collapsed header — always visible */}
      <button onClick={() => setOpen(o => !o)} style={{ width: "100%", background: "transparent", border: "none", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {GUARANTEES.slice(0, 3).map((g, i) => (
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
                  {g.href && <>{" "}<a href={g.href} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: T.cyan, textDecoration: "none", fontFamily: T.mono, whiteSpace: "nowrap" }}>verify: {g.proof} ↗</a></>}
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12, paddingTop: 10, borderTop: `1px solid ${T.borderLo}` }}>
            <a href="https://github.com/netasset/anonscore" target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: T.cyan, textDecoration: "none", fontFamily: T.mono }}>Don't take our word for it — every claim above links to its proof. Audit the full source on GitHub ↗</a>
          </div>
        </div>
      )}
    </div>
  );
}

