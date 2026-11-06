/* ─────────────────────────────────────────────
   COACH WAITLIST — landing page for the optional paid AI tier.
   Reachable at /?page=coach, linked from the AI assistant card. Collects
   no payment — just an email from folks who want it, so we know whether
   it's worth building before we build it.
───────────────────────────────────────────── */
function CoachWaitlist({ onBack, isMobile, onNav }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | submitting | ok | err
  const [error, setError] = useState("");

  const submit = async (e) => {
    e?.preventDefault();
    const v = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) { setError("Enter a valid email."); return; }
    setStatus("submitting"); setError("");
    if (COACH.endpoint) {
      try {
        const fd = new FormData();
        fd.append("email", v);
        fd.append("list", "coach-waitlist");
        await fetch(COACH.endpoint, { method: "POST", body: fd, mode: "no-cors" });
        setStatus("ok");
      } catch { setStatus("err"); setError("Couldn't reach the waitlist service. Try again later."); }
    } else {
      window.location.href = `mailto:${COACH.fallbackMailto}?subject=${encodeURIComponent("Coach waitlist")}&body=${encodeURIComponent(v + "\n\n(Add me to the Privacy Coach early-access list.)")}`;
      setStatus("ok");
    }
  };

  // Meta + tab title for shareability
  useEffect(() => {
    const prev = document.title;
    document.title = "Privacy Coach (early access) — AnonScore";
    return () => { document.title = prev; };
  }, []);

  return (
    <div role="main" aria-label="Privacy Coach — early access waitlist" style={{ minHeight: "100vh", background: "transparent", display: "flex", flexDirection: "column" }}>
      <h1 className="sr-only">Privacy Coach — paid AI tier (early access waitlist)</h1>

      <SiteNav isMobile={isMobile} onBack={onBack} onNav={onNav} badge="EARLY ACCESS" />

      <div style={{ flex: 1, maxWidth: 760, margin: "0 auto", width: "100%", padding: isMobile ? "32px 20px" : "56px 32px" }}>
        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontFamily: T.mono, fontSize: 10, color: T.cyan, letterSpacing: 2.5, marginBottom: 16 }}>✦ AI PRIVACY ASSISTANT — UPGRADED</div>
          <div style={{ fontFamily: T.serif, fontSize: isMobile ? 36 : 52, color: T.text, lineHeight: 1.1, fontWeight: 400, marginBottom: 18 }}>
            A coach that remembers<br /><em style={{ color: T.cyan }}>every scan, every fix, every step.</em>
          </div>
          <p style={{ fontSize: isMobile ? 15 : 17, color: T.textMid, lineHeight: 1.7, maxWidth: 560, margin: "0 auto", fontWeight: 300 }}>
            The free AI assistant answers 5 questions per session. The Coach has no cap, remembers your history across scans, and tracks a personal fix queue that follows you across devices.
          </p>
        </div>

        {/* Pricing card */}
        <div style={{ background: T.card, border: `1.5px solid ${T.cyan}55`, borderRadius: 18, padding: isMobile ? "24px 20px" : "32px 36px", marginBottom: 28, boxShadow: `0 8px 32px ${T.cyanMid}, 0 0 0 1px ${T.cyan}22` }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 4, marginBottom: 10 }}>
            <span style={{ fontFamily: T.serif, fontSize: isMobile ? 44 : 56, color: T.text, fontWeight: 400 }}>{COACH.price}</span>
            <span style={{ fontFamily: T.mono, fontSize: 14, color: T.textMid }}>{COACH.unit}</span>
          </div>
          <div style={{ textAlign: "center", fontSize: 13, color: T.textDim, marginBottom: 24, fontFamily: T.mono, letterSpacing: 0.5 }}>
            Pay in Bitcoin (Lightning) or card. Cancel anytime.
          </div>

          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 14, marginBottom: 28 }}>
            {COACH.benefits.map(b => (
              <div key={b.title} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ flexShrink: 0, width: 28, height: 28, borderRadius: 8, background: T.cyan + "18", border: `1px solid ${T.cyan}33`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: T.mono, fontSize: 14, color: T.cyan }}>
                  {b.icon}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 3 }}>{b.title}</div>
                  <div style={{ fontSize: 12, color: T.textMid, lineHeight: 1.55 }}>{b.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Waitlist form */}
          {status === "ok" ? (
            <div style={{ background: T.greenLo, border: `1px solid ${T.green}44`, borderRadius: 12, padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ color: T.green, fontSize: 20 }}>✓</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>You're on the list.</div>
                <div style={{ fontSize: 12, color: T.textMid, marginTop: 2 }}>We'll email when the Coach opens for early access — no spam in between.</div>
              </div>
            </div>
          ) : (
            <form onSubmit={submit}>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <label htmlFor="coach-email" className="sr-only">Email address for early-access waitlist</label>
                <input id="coach-email" type="email" value={email} onChange={e => { setEmail(e.target.value); setError(""); }}
                  placeholder="you@somewhere.zone"
                  required aria-invalid={!!error}
                  style={{ flex: 1, minWidth: 220, background: T.surface, border: `1.5px solid ${error ? T.red : T.border}`, borderRadius: 10, padding: "13px 16px", color: T.text, fontFamily: T.mono, fontSize: 13, outline: "none", transition: "border .15s, box-shadow .2s" }}
                  onFocus={e => { e.target.style.borderColor = T.cyan; e.target.style.boxShadow = `0 0 0 3px ${T.cyan}22`; }}
                  onBlur={e => { e.target.style.borderColor = error ? T.red : T.border; e.target.style.boxShadow = "0 0 0 0 transparent"; }} />
                <button type="submit" disabled={status === "submitting"}
                  style={{ background: T.cyan, border: "none", borderRadius: 10, padding: "13px 22px", color: T.bg, fontFamily: T.sans, fontWeight: 700, fontSize: 14, cursor: status === "submitting" ? "wait" : "pointer", opacity: status === "submitting" ? 0.6 : 1, whiteSpace: "nowrap" }}>
                  {status === "submitting" ? "…" : "Join waitlist"}
                </button>
              </div>
              {error && <div role="alert" style={{ fontSize: 11, color: T.red, marginTop: 8 }}>{error}</div>}
              <div style={{ fontSize: 11, color: T.textDim, marginTop: 10, lineHeight: 1.55 }}>
                Target opening: <span style={{ color: T.textMid }}>{COACH.launchTarget}</span>. We'll email once. No spam. Your email is never linked to a scanned address.
              </div>
            </form>
          )}
        </div>

        {/* Comparison table */}
        <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, overflow: "hidden", marginBottom: 28 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", borderBottom: `1px solid ${T.border}` }}>
            <div style={{ padding: "14px 18px", fontFamily: T.mono, fontSize: 9, color: T.textDim, letterSpacing: 2 }}>WHAT YOU GET</div>
            <div style={{ padding: "14px 18px", fontFamily: T.mono, fontSize: 9, color: T.textMid, letterSpacing: 2, borderLeft: `1px solid ${T.border}` }}>FREE</div>
            <div style={{ padding: "14px 18px", fontFamily: T.mono, fontSize: 9, color: T.cyan, letterSpacing: 2, borderLeft: `1px solid ${T.border}`, background: T.cyanLo }}>COACH</div>
          </div>
          {[
            ["The full audit (11 BTC + 8 LN heuristics)", "✓ always free", "✓ always free"],
            ["AI assistant — messages per session",       "5",            "Unlimited"],
            ["Memory across scans",                       "—",            "✓ passphrase-encrypted"],
            ["Multi-device continuity",                   "—",            "✓"],
            ["Personal fix queue with progress",          "Per address",  "✓ across every wallet"],
            ["Address ever sent to the AI",               "Never",        "Never"],
          ].map(([what, free, coach], i, arr) => (
            <div key={what} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", borderBottom: i < arr.length - 1 ? `1px solid ${T.borderLo}` : undefined }}>
              <div style={{ padding: "12px 18px", fontSize: 13, color: T.text }}>{what}</div>
              <div style={{ padding: "12px 18px", fontSize: 12, color: T.textMid, borderLeft: `1px solid ${T.borderLo}`, fontFamily: T.mono }}>{free}</div>
              <div style={{ padding: "12px 18px", fontSize: 12, color: coach.includes("Never") ? T.textMid : T.text, borderLeft: `1px solid ${T.borderLo}`, fontFamily: T.mono, background: T.cyan + "08" }}>{coach}</div>
            </div>
          ))}
        </div>

        {/* Trust copy */}
        <div style={{ background: T.greenLo, border: `1px solid ${T.green}33`, borderRadius: 12, padding: "16px 20px" }}>
          <div style={{ fontFamily: T.mono, fontSize: 9, color: T.green, letterSpacing: 2, marginBottom: 8 }}>HOW PRIVACY HOLDS UP UNDER A PAID TIER</div>
          <div style={{ fontSize: 13, color: T.textMid, lineHeight: 1.7 }}>
            Coach memory is encrypted client-side with a passphrase you choose — the server stores only ciphertext it can't read. Wallet addresses you scan are <strong style={{ color: T.text }}>never</strong> sent to the AI; only your score and issue names are. Free or paid, this stays the same.
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: 32 }}>
          <button onClick={onBack} style={{ background: "transparent", border: "none", color: T.textMid, fontFamily: T.mono, fontSize: 12, cursor: "pointer", padding: 8 }}
            onMouseOver={e => e.currentTarget.style.color = T.cyan}
            onMouseOut={e => e.currentTarget.style.color = T.textMid}>
            ← Back to scanner
          </button>
        </div>
      </div>
    </div>
  );
}

