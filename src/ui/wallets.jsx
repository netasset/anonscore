/* ─────────────────────────────────────────────
   WALLET DIRECTORY — standalone curated reviews at /?page=wallets.
   Reads WALLET_REVIEWS + WALLET_CATEGORIES (src/catalog/wallets.jsx).
   Filterable by category, links out via toolLink() (so affiliate URLs
   slot in automatically when configured).
───────────────────────────────────────────── */
function WalletDirectory({ onBack, isMobile, onNav, pick }) {
  useLang();
  const [cat, setCat] = useState("all");
  const [query, setQuery] = useState("");
  // Arrived via a "review" link in a fix plan — bring that card into view.
  useEffect(() => {
    if (!pick) return;
    const tm = setTimeout(() => document.getElementById("wd-" + pick)?.scrollIntoView({ behavior: "smooth", block: "center" }), 150);
    return () => clearTimeout(tm);
  }, [pick]);
  const anyAff = WALLET_REVIEWS.some(w => toolIsAffiliate(w.name));

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return WALLET_REVIEWS.filter(w => {
      if (cat !== "all" && w.category !== cat) return false;
      if (!q) return true;
      return (w.name + " " + w.pitch + " " + (w.os || "")).toLowerCase().includes(q);
    });
  }, [cat, query]);

  // Group by category for "All" view to keep visual hierarchy
  const grouped = useMemo(() => {
    if (cat !== "all") return [[cat, filtered]];
    return WALLET_CATEGORIES.map(c => [c.key, filtered.filter(w => w.category === c.key)]).filter(([, list]) => list.length);
  }, [cat, filtered]);

  useEffect(() => {
    const prev = document.title;
    document.title = "Privacy-First Bitcoin Wallet Directory — AnonScore";
    const desc = document.querySelector('meta[name="description"]');
    const prevDesc = desc?.getAttribute("content");
    desc?.setAttribute("content", "Curated, regularly updated directory of the most privacy-respecting Bitcoin & Lightning wallets. Honest watch-outs included; no pay-to-play.");
    return () => { document.title = prev; if (desc && prevDesc) desc.setAttribute("content", prevDesc); };
  }, []);

  return (
    <div role="main" aria-label="Privacy-First Wallet Directory" style={{ minHeight: "100vh", background: "transparent", display: "flex", flexDirection: "column" }}>
      <h1 className="sr-only">Privacy-First Bitcoin & Lightning Wallet Directory</h1>

      <SiteNav isMobile={isMobile} onBack={onBack} onNav={onNav} current="wallets" badge="DIRECTORY" badgeColor={T.btc} />

      <div style={{ flex: 1, maxWidth: 980, margin: "0 auto", width: "100%", padding: isMobile ? "32px 16px" : "48px 32px" }}>
        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontFamily: T.mono, fontSize: 10, color: T.btc, letterSpacing: 2.5, marginBottom: 14 }}>CURATED · NO PAY-TO-PLAY</div>
          <h2 style={{ fontFamily: T.serif, fontSize: isMobile ? 32 : 44, color: T.text, lineHeight: 1.1, fontWeight: 400, marginBottom: 14 }}>
            The privacy-first<br /><em style={{ color: T.btc }}>Bitcoin wallet directory.</em>
          </h2>
          <p style={{ fontSize: isMobile ? 14 : 16, color: T.textMid, lineHeight: 1.7, maxWidth: 580, margin: "0 auto", fontWeight: 300 }}>
            Every wallet, exchange, and node listed here is one we'd use ourselves. Each entry includes honest watch-outs — what to know before you trust it with your stack.
          </p>
        </div>

        {/* Filter bar */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
          <button onClick={() => setCat("all")}
            style={{ padding: "7px 12px", background: cat === "all" ? T.cyan : T.surface, border: `1px solid ${cat === "all" ? T.cyan : T.border}`, color: cat === "all" ? T.bg : T.textMid, borderRadius: 8, fontFamily: T.mono, fontSize: 10, fontWeight: 700, letterSpacing: 0.5, cursor: "pointer", transition: "all .15s" }}>
            ALL ({WALLET_REVIEWS.length})
          </button>
          {WALLET_CATEGORIES.map(c => {
            const count = WALLET_REVIEWS.filter(w => w.category === c.key).length;
            const active = cat === c.key;
            return (
              <button key={c.key} onClick={() => setCat(c.key)}
                style={{ padding: "7px 12px", background: active ? T.cyan : T.surface, border: `1px solid ${active ? T.cyan : T.border}`, color: active ? T.bg : T.textMid, borderRadius: 8, fontFamily: T.mono, fontSize: 10, fontWeight: 700, letterSpacing: 0.5, cursor: "pointer", transition: "all .15s" }}>
                {c.icon} {c.label.toUpperCase()} ({count})
              </button>
            );
          })}
          <div style={{ flex: 1, minWidth: 180 }}>
            <label htmlFor="wallet-search" className="sr-only">Search wallets</label>
            <input id="wallet-search" type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search…"
              style={{ width: "100%", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, padding: "7px 12px", color: T.text, fontFamily: T.mono, fontSize: 11, outline: "none", transition: "border .15s, box-shadow .2s" }}
              onFocus={e => { e.target.style.borderColor = T.cyan; e.target.style.boxShadow = `0 0 0 3px ${T.cyan}22`; }}
              onBlur={e => { e.target.style.borderColor = T.border; e.target.style.boxShadow = "0 0 0 0 transparent"; }} />
          </div>
        </div>

        {/* Groups */}
        {grouped.length === 0 ? (
          <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: "40px 20px", textAlign: "center", color: T.textMid, fontSize: 14 }}>
            No matches for "{query}".
          </div>
        ) : grouped.map(([catKey, list]) => {
          const meta = WALLET_CATEGORIES.find(c => c.key === catKey);
          return (
            <section key={catKey} style={{ marginBottom: 36 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 14, paddingBottom: 8, borderBottom: `1px solid ${T.borderLo}` }}>
                <span style={{ fontSize: 18 }}>{meta.icon}</span>
                <h3 style={{ fontFamily: T.serif, fontSize: 22, color: T.text, fontWeight: 400, margin: 0 }}>{meta.label}</h3>
                <div style={{ fontFamily: T.mono, fontSize: 10, color: T.textDim }}>· {meta.blurb}</div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", gap: 14 }}>
                {list.map(w => {
                  const href = toolLink(w.name);
                  const aff = toolIsAffiliate(w.name);
                  const picked = pick && wSlug(w.name) === pick;
                  return (
                    <article key={w.name} id={"wd-" + wSlug(w.name)} style={{ background: T.card, border: `1px solid ${picked ? T.cyan + "88" : T.border}`, boxShadow: picked ? `0 0 28px -8px ${T.cyan}88` : "none", borderRadius: 14, padding: "18px 20px", display: "flex", flexDirection: "column", gap: 10, transition: "border-color .2s, box-shadow .25s, transform .25s cubic-bezier(.16,.84,.44,1)" }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = T.cyan + "44"; e.currentTarget.style.boxShadow = `0 12px 32px -18px ${T.cyan}77`; e.currentTarget.style.transform = "translateY(-3px)"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}>
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                        <div>
                          <div style={{ fontFamily: T.serif, fontSize: 19, color: T.text, fontWeight: 400 }}>{w.name}</div>
                          {w.os && <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, marginTop: 3 }}>{w.os}</div>}
                        </div>
                        {aff && <span style={{ fontFamily: T.mono, fontSize: 9, color: T.amber, background: T.amberLo, border: `1px solid ${T.amberMid}`, borderRadius: 6, padding: "3px 8px", letterSpacing: 0.5 }}>AFFILIATE</span>}
                      </div>
                      <p style={{ fontSize: 13, color: T.textMid, lineHeight: 1.6, margin: 0 }}>{w.pitch}</p>
                      <div>
                        <div style={{ fontFamily: T.mono, fontSize: 9, color: T.green, letterSpacing: 1.5, marginBottom: 4 }}>STRENGTHS</div>
                        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 3 }}>
                          {w.strengths.map((s, i) => (
                            <li key={i} style={{ display: "flex", gap: 8, fontSize: 12, color: T.text, lineHeight: 1.55 }}>
                              <span style={{ color: T.green, flexShrink: 0 }}>✓</span>
                              <span>{s}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <div style={{ fontFamily: T.mono, fontSize: 9, color: T.amber, letterSpacing: 1.5, marginBottom: 4 }}>WATCH-OUTS</div>
                        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 3 }}>
                          {w.watchOuts.map((s, i) => (
                            <li key={i} style={{ display: "flex", gap: 8, fontSize: 12, color: T.textMid, lineHeight: 1.55 }}>
                              <span style={{ color: T.amber, flexShrink: 0 }}>⚠</span>
                              <span>{s}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      {href && (
                        <div style={{ marginTop: 4 }}>
                          <a href={href} target="_blank" rel="noopener noreferrer nofollow"
                            style={{ display: "inline-block", background: "transparent", border: `1.5px solid ${T.cyan}66`, borderRadius: 8, padding: "7px 14px", color: T.cyan, fontFamily: T.mono, fontSize: 11, textDecoration: "none", transition: "all .15s" }}
                            onMouseOver={e => { e.currentTarget.style.background = T.cyan; e.currentTarget.style.color = T.bg; }}
                            onMouseOut={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = T.cyan; }}>
                            Visit {w.name} ↗
                          </a>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            </section>
          );
        })}

        {/* Disclosure footer */}
        <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: "16px 20px", fontSize: 12, color: T.textMid, lineHeight: 1.7 }}>
          <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, letterSpacing: 2, marginBottom: 8 }}>HOW THIS LIST WORKS</div>
          Every entry was picked because we'd actually use it. Reviews are written by the AnonScore team, not paid for. {anyAff
            ? <>Entries tagged <span style={{ fontFamily: T.mono, color: T.amber }}>AFFILIATE</span> earn AnonScore a small referral when you sign up — we never tune reviews for tier.</>
            : <>No entry on this page currently pays us a referral. If that ever changes, it'll be tagged <span style={{ fontFamily: T.mono, color: T.amber }}>AFFILIATE</span> here and listed in full disclosure.</>}
        </div>
      </div>
    </div>
  );
}

