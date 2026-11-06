/* ─────────────────────────────────────────────
   AI FIX ASSISTANT — privacy-first design
   • Address NEVER sent to API
   • Explicit consent gate before first request
   • Data preview shown verbatim before consent
   • Opt-in only
/* ─────────────────────────────────────────────
   AI ASSISTANT — consent gate component
───────────────────────────────────────────── */

/* Builds context sent to Anthropic — address intentionally excluded */
/* Lightweight markdown renderer for AI chat bubbles
   Handles: **bold**, *italic*, numbered lists, line breaks */
function renderMd(text) {
  if (!text) return null;
  const lines = text.split("\n");
  const out = [];
  let key = 0;

  const inlineStyles = (str) => {
    // Bold: **text** → <strong>
    // Italic: *text* (not preceded/followed by *) → <em>
    const parts = [];
    let remaining = str;
    let idx = 0;
    while (remaining.length > 0) {
      const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
      const italicMatch = remaining.match(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/);
      const first = [boldMatch, italicMatch]
        .filter(Boolean)
        .sort((a, b) => a.index - b.index)[0];
      if (!first) { parts.push(remaining); break; }
      if (first.index > 0) parts.push(remaining.slice(0, first.index));
      if (first === boldMatch) {
        parts.push(<strong key={idx++} style={{ color: T.text, fontWeight: 700 }}>{first[1]}</strong>);
      } else {
        parts.push(<em key={idx++}>{first[1]}</em>);
      }
      remaining = remaining.slice(first.index + first[0].length);
    }
    return parts;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) {
      if (out.length > 0) out.push(<div key={key++} style={{ height: 6 }} />);
      continue;
    }
    // Numbered list: "1. text"
    const numMatch = line.match(/^(\d+)\.\s+(.*)/);
    if (numMatch) {
      out.push(
        <div key={key++} style={{ display: "flex", gap: 8, marginBottom: 2 }}>
          <span style={{ color: T.cyan, fontFamily: T.mono, fontSize: 11, flexShrink: 0, marginTop: 1 }}>{numMatch[1]}.</span>
          <span>{inlineStyles(numMatch[2])}</span>
        </div>
      );
      continue;
    }
    // Bullet: "- text" or "• text"
    const bulletMatch = line.match(/^[-•]\s+(.*)/);
    if (bulletMatch) {
      out.push(
        <div key={key++} style={{ display: "flex", gap: 8, marginBottom: 2 }}>
          <span style={{ color: T.cyan, flexShrink: 0, marginTop: 2, fontSize: 10 }}>›</span>
          <span>{inlineStyles(bulletMatch[1])}</span>
        </div>
      );
      continue;
    }
    out.push(<div key={key++} style={{ marginBottom: 2 }}>{inlineStyles(line)}</div>);
  }
  return <>{out}</>;
}

// Structured analysis the worker turns into its own system prompt. The browser
// never sends a system prompt — the worker rejects one. This object is exactly
// what the consent gate shows and what gets POSTed as `context`.
function buildAiContext(checks, recommendations, score, grade, walletMeta) {
  const issues = checks.filter(c => c.status !== "pass").slice(0, 20).map(c => ({
    name: String(c.name || ""),
    status: String(c.status || ""),
    plain: String(c.plain || ""),
  }));
  const recs = recommendations.slice(0, 5).map(r => ({
    action: String(r.action || ""),
    impact: r.impact || 0,
    tools: (r.tools || (r.tool ? [{ name: r.tool }] : [])).map(t => t.name).filter(Boolean),
  }));
  const isPublic = !!walletMeta?.isPublic;
  const entity = walletMeta?.entity || "";
  const context = { score, grade, isPublic, entity, issues, recommendations: recs };

  if (isPublic && walletMeta?.txs?.length) {
    const txs = walletMeta.txs.slice(0, 20);
    const utxos = (walletMeta.utxos || []).slice(0, 10);
    const now = Math.floor(Date.now() / 1000);
    const age = (ts) => {
      if (!ts) return "unknown date";
      const d = Math.floor((now - ts) / 86400);
      return d === 0 ? "today" : d === 1 ? "1 day ago" : `${d} days ago`;
    };
    const satsBtc = (s) => s >= 1e8 ? `₿${(s / 1e8).toFixed(4)}` : `${(s || 0).toLocaleString()} sats`;
    context.transactions = txs.map(tx => {
      const inputs = tx.vin?.length || 0;
      const outputs = tx.vout?.length || 0;
      const totalOut = (tx.vout || []).reduce((s, o) => s + (o.value || 0), 0);
      const flags = [];
      if (outputs >= 5 && inputs >= 5) flags.push("possible CoinJoin");
      if (inputs >= 4 && outputs <= 2) flags.push("consolidation");
      if (isRoundSat(totalOut)) flags.push("round amount");
      return {
        time: age(tx.status?.block_time),
        inputs, outputs,
        total: satsBtc(totalOut),
        fee: tx.fee ? `${tx.fee} sats fee` : "",
        flags,
      };
    });
    context.utxos = utxos.map(u => ({
      value: satsBtc(u.value),
      confirmed: !!u.status?.confirmed,
      age: age(u.status?.block_time),
      type: u.scriptpubkey_type || "unknown",
    }));
  }

  const preview = [
    `Score: ${score}/100 · Grade ${grade}`,
    isPublic ? `Entity: ${entity}` : `${issues.length} issue${issues.length !== 1 ? "s" : ""}: ${issues.slice(0, 3).map(c => c.name).join(", ")}${issues.length > 3 ? ` +${issues.length - 3} more` : ""}`,
    isPublic && walletMeta?.txs?.length ? `${walletMeta.txs.length} recent transactions (public blockchain data)` : `Top finding: ${recommendations[0]?.action || issues[0]?.name || "none"}`,
  ];
  return { context, preview };
}

function formatAiContext(context) {
  const lines = [
    `Privacy score: ${context.score}/100 (Grade ${context.grade})`,
  ];
  if (context.isPublic) lines.push(`Public wallet: ${context.entity || "unnamed"}`);
  lines.push(`Issues (${context.issues.length}):`);
  for (const issue of context.issues) lines.push(`  • ${issue.name} [${String(issue.status).toUpperCase()}]: ${issue.plain}`);
  if (!context.issues.length) lines.push("  (none)");
  lines.push("Recommendations:");
  context.recommendations.forEach((r, n) => {
    lines.push(`  ${n + 1}. ${r.action} (+${r.impact}pts)${r.tools?.length ? ` — ${r.tools.join(", ")}` : ""}`);
  });
  if (context.transactions?.length) {
    lines.push(`Transactions (${context.transactions.length}, public chain data):`);
    context.transactions.forEach((tx, n) => {
      lines.push(`  ${n + 1}. ${tx.time} — ${tx.inputs} inputs → ${tx.outputs} outputs, ${tx.total}${tx.fee ? `, ${tx.fee}` : ""}${tx.flags?.length ? ` [${tx.flags.join(", ")}]` : ""}`);
    });
  }
  if (context.utxos?.length) {
    lines.push(`UTXOs (${context.utxos.length}):`);
    context.utxos.forEach((u, n) => {
      lines.push(`  ${n + 1}. ${u.value} — ${u.confirmed ? "confirmed" : "unconfirmed"}, ${u.age}, type: ${u.type}`);
    });
  }
  return lines.join("\n");
}

/* ── Consent gate — shown before any data leaves the browser ── */
function AiConsentGate({ score, grade, checks, recommendations, walletMeta, onAccept, onDecline }) {
  const { context } = buildAiContext(checks, recommendations, score, grade, walletMeta);
  const dialogRef = useDialog(onDecline);
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 950, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, background: "#000000bb" }}>
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-label="AI assistant data disclosure" tabIndex={-1}
        style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 20, padding: 28, width: "min(420px,96vw)", animation: "fadeUp .25s ease both" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <div style={{ width: 32, height: 32, background: T.cyan + "18", border: `1px solid ${T.cyan}33`, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>✦</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: T.text }}>Before you continue</div>
            <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, letterSpacing: 1.2, marginTop: 1 }}>AI ASSISTANT · DATA DISCLOSURE</div>
          </div>
        </div>

        <div style={{ background: T.greenLo, border: `1px solid ${T.green}33`, borderRadius: 12, padding: "14px 16px", marginBottom: 10 }}>
          <div style={{ fontFamily: T.mono, fontSize: 9, color: T.green, letterSpacing: 1.5, marginBottom: 8 }}>✓ SENT TO THE ASSISTANT — THE EXACT CONTEXT</div>
          {/* The worker builds the system prompt. Show the structured context
              that actually leaves the browser — no summary, no paraphrase. */}
          <pre style={{ margin: 0, maxHeight: 200, overflow: "auto", background: T.bg, border: `1px solid ${T.borderLo}`, borderRadius: 8, padding: "10px 12px", fontFamily: T.mono, fontSize: 10.5, lineHeight: 1.5, color: T.textMid, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{formatAiContext(context)}</pre>
          <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, marginTop: 8, lineHeight: 1.5 }}>
            That's the analysis sent to the assistant — plus the questions you type in the chat. The worker writes its own system prompt from these fields and rejects any system prompt a browser tries to attach. Don't paste your address or anything you don't want sent.{" "}
            <a href="https://github.com/netasset/anonscore/blob/main/workers/ai/worker.js" target="_blank" rel="noopener noreferrer"
              style={{ color: T.cyan, textDecoration: "none" }}>
              verify: the open-source worker that builds the prompt (search "buildSystemPrompt") ↗
            </a>
          </div>
        </div>

        <div style={{ background: T.redLo, border: `1px solid ${T.red}22`, borderRadius: 12, padding: "14px 16px", marginBottom: 18 }}>
          <div style={{ fontFamily: T.mono, fontSize: 9, color: T.red, letterSpacing: 1.5, marginBottom: 10 }}>✕ NEVER SENT</div>
          {(walletMeta?.isPublic
            ? ["Your identity or IP address", "Any data beyond what's shown above"]
            : ["Your Bitcoin address", "Transaction IDs or UTXO data", "Any data that could identify your wallet"]
          ).map((line, i) => (
            <div key={i} style={{ display: "flex", gap: 8, padding: "4px 0", borderTop: i > 0 ? `1px solid ${T.borderLo}` : undefined }}>
              <span style={{ color: T.red, fontSize: 10, flexShrink: 0, marginTop: 1 }}>✕</span>
              <span style={{ fontFamily: T.mono, fontSize: 11, color: T.textMid, lineHeight: 1.5 }}>{line}</span>
            </div>
          ))}
        </div>

        <div style={{ fontSize: 12, color: T.textDim, lineHeight: 1.7, marginBottom: 14 }}>
          Anthropic does not train on API data. Each session is independent — no history persists between conversations.{" "}
          <a href="https://www.anthropic.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: T.cyan, textDecoration: "none" }}>Anthropic privacy policy →</a>
        </div>

        <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: "12px 16px", marginBottom: 18 }}>
          <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, letterSpacing: 1.5, marginBottom: 8 }}>USAGE LIMITS</div>
          <div style={{ fontSize: 12, color: T.textMid, lineHeight: 1.7 }}>
            <strong style={{ color: T.text }}>5 messages per conversation.</strong> To prevent abuse, a temporary anonymous counter is stored for 24 hours against a hashed version of your IP — never linked to you or your address. Resets daily.
          </div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onDecline} style={{ flex: 1, padding: "12px", background: "transparent", border: `1.5px solid ${T.border}`, borderRadius: 10, color: T.textMid, fontSize: 13, cursor: "pointer" }}>
            No thanks
          </button>
          <button onClick={onAccept} style={{ flex: 1, padding: "12px", background: T.cyan, border: "none", borderRadius: 10, color: T.bg, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
            I understand — continue
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Shared-scan-link confirm — a ?scan= link never auto-fires; the user
   confirms first. Its own component so it mounts/unmounts with the prompt
   and gets the shared dialog a11y (focus + Escape + trap). ── */
function ConfirmScanModal({ pendingScan, onCancel, onConfirm }) {
  const dialogRef = useDialog(onCancel);
  const relay = useRelay() && !!RELAY_URL;
  const exp = explorer();
  const kind = pendingScan.inputType === "btc" ? "Bitcoin address" : pendingScan.inputType === "ln_address" ? "Lightning address" : "Lightning node";
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 900, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, background: "#000000aa" }}>
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-label="Confirm shared scan link" tabIndex={-1}
        style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 18, padding: 28, width: "min(400px,94vw)", animation: "fadeUp .25s ease" }}>
        <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, letterSpacing: 2, marginBottom: 14 }}>SHARED SCAN LINK</div>
        <div style={{ fontFamily: T.serif, fontSize: 20, color: T.text, marginBottom: 10, fontWeight: 400 }}>
          You were linked to analyze this {kind}
        </div>
        <div style={{ fontFamily: T.mono, fontSize: 11, color: T.textDim, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, padding: "10px 14px", marginBottom: 16, wordBreak: "break-all" }}>
          {pendingScan.addr.length > 30 ? `${pendingScan.addr.slice(0, 20)}…${pendingScan.addr.slice(-8)}` : pendingScan.addr}
        </div>
        <div style={{ fontSize: 13, color: T.textMid, lineHeight: 1.65, marginBottom: 20 }}>
          {relay
            ? <>The privacy relay is on, so {exp.label} sees the address and not your IP. Nothing is stored. Turn the relay off under the address box if you would rather the lookup never touch AnonScore.</>
            : <>The privacy relay is off, so this queries {exp.label} directly and that explorer sees your IP next to the address. Turn the relay on under the address box to hide it.</>}
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onCancel} style={{ flex: 1, padding: "12px", background: "transparent", border: `1.5px solid ${T.border}`, borderRadius: 10, color: T.textMid, fontSize: 13, cursor: "pointer" }}>
            Cancel
          </button>
          <button onClick={onConfirm}
            style={{ flex: 1, padding: "12px", background: T.cyan, border: "none", borderRadius: 10, color: T.bg, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
            Analyze →
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Chat panel — only shown after consent ── */
function AiAssistant({ checks, recommendations, score, grade, onClose, starters: startersProp, walletMeta }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [msgCount, setMsgCount] = useState(0);
  const [rateLimited, setRateLimited] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  const MAX_MSGS = 5;
  const WORKER_URL = "https://anonscore-ai.netassetpremium.workers.dev";

  const issues = checks.filter(c => c.status !== "pass");
  const { context } = buildAiContext(checks, recommendations, score, grade, walletMeta);
  const exhausted = msgCount >= MAX_MSGS;
  const isPublic = walletMeta?.isPublic;
  const entity   = walletMeta?.entity || "";

  const STARTERS = startersProp || (isPublic ? [
    `Why does ${entity || "this wallet"} score so poorly on privacy?`,
    "What does this score reveal about institutional Bitcoin management?",
    "What heuristics flag this wallet as an exchange or institution?",
    "What would this wallet need to do to score higher?",
  ] : [
    "How do I freeze dust UTXOs in Sparrow?",
    `Which of my ${issues.length} issues should I fix first?`,
    "How does CoinJoin actually work?",
    "Is my wallet software identifiable from fee rates?",
  ]);

  const send = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading || exhausted) return;
    setInput("");
    setStarted(true);
    const newCount = msgCount + 1;
    setMsgCount(newCount);
    const next = [...messages, { role: "user", content: msg }];
    setMessages(next);
    setLoading(true);
    try {
      const res = await fetch(WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, context }),
      });
      if (res.status === 429) {
        setRateLimited(true);
        setMessages(m => [...m, { role: "assistant", content: "You've reached the daily limit for the Privacy Assistant. It resets at midnight UTC — come back tomorrow." }]);
      } else if (!res.ok) {
        setMessages(m => [...m, { role: "assistant", content: `Server error (${res.status}). Please try again in a moment.` }]);
      } else {
        const data = await res.json();
        const reply = data.reply || "Sorry, I couldn't get a response. Try again.";
        setMessages(m => [...m, { role: "assistant", content: reply }]);
      }
    } catch (err) {
      const msg = err?.name === "TypeError"
        ? "Could not reach the assistant — check your connection and try again."
        : "Connection error. Please try again.";
      setMessages(m => [...m, { role: "assistant", content: msg }]);
    }
    setLoading(false);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const inputDisabled = exhausted || rateLimited || loading;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 900, display: "flex", alignItems: "flex-end", justifyContent: "flex-end", padding: 16, pointerEvents: "none" }}>
      <div style={{ pointerEvents: "all", background: T.card, border: `1px solid ${T.border}`, borderRadius: 20, width: "min(420px, 96vw)", height: "min(580px, 80vh)", display: "flex", flexDirection: "column", boxShadow: "0 24px 80px #000000aa", animation: "fadeUp .3s ease both" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 18px", borderBottom: `1px solid ${T.border}` }}>
          <div style={{ width: 28, height: 28, background: T.cyan + "22", border: `1px solid ${T.cyan}44`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>✦</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: T.text }}>Privacy Assistant</div>
            <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, letterSpacing: 1 }}>Powered by Claude</div>
            <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, letterSpacing: 1 }}>Address never shared</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {!exhausted && !rateLimited && (
              <span style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim }}>
                {MAX_MSGS - msgCount} msg{MAX_MSGS - msgCount !== 1 ? "s" : ""} left
              </span>
            )}
            <button onClick={onClose} style={{ background: "transparent", border: "none", color: T.textDim, fontSize: 18, cursor: "pointer", lineHeight: 1 }}>✕</button>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
          {!started && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ fontSize: 13, color: T.textMid, lineHeight: 1.6 }}>
                {isPublic
                  ? <>I've analysed the score for <strong style={{ color: T.text }}>{entity}</strong>. Ask me anything about what the chain reveals, why it scores this way, or what the forensic patterns mean.</>
                  : <>I've read your wallet analysis. Ask me anything about your {issues.length} issue{issues.length !== 1 ? "s" : ""} or how to improve your score from <span style={{ color: scoreColor(score) }}>{score}</span> to 90+.</>
                }
              </div>
              <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, letterSpacing: 1, marginTop: 4 }}>QUICK QUESTIONS</div>
              {STARTERS.map((s, i) => (
                <button key={i} onClick={() => send(s)} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: "9px 14px", color: T.textMid, fontSize: 12, cursor: "pointer", textAlign: "left", transition: "all .15s" }}
                  onMouseOver={e => { e.currentTarget.style.borderColor = T.cyan; e.currentTarget.style.color = T.text; }}
                  onMouseOut={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textMid; }}>
                  {s}
                </button>
              ))}
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} style={{ display: "flex", flexDirection: m.role === "user" ? "row-reverse" : "row", gap: 8, alignItems: "flex-start" }}>
              {m.role === "assistant" && (
                <div style={{ width: 22, height: 22, background: T.cyan + "22", border: `1px solid ${T.cyan}44`, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, flexShrink: 0, marginTop: 2 }}>✦</div>
              )}
              <div style={{ background: m.role === "user" ? T.cyan + "18" : T.surface, border: `1px solid ${m.role === "user" ? T.cyan + "33" : T.borderLo}`, borderRadius: m.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px", padding: "10px 14px", maxWidth: "85%", fontSize: 13, color: T.text, lineHeight: 1.65 }}>
                {m.role === "assistant" ? renderMd(m.content) : m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
              <div style={{ width: 22, height: 22, background: T.cyan + "22", border: `1px solid ${T.cyan}44`, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, flexShrink: 0, marginTop: 2 }}>✦</div>
              <div style={{ background: T.surface, border: `1px solid ${T.borderLo}`, borderRadius: "14px 14px 14px 4px", padding: "12px 16px" }}>
                <div style={{ display: "flex", gap: 4 }}>
                  {[0,1,2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: T.cyan, animation: `pulse 1.2s ease ${i * .2}s infinite` }} />)}
                </div>
              </div>
            </div>
          )}
          {exhausted && !rateLimited && (
            <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: "12px 16px", textAlign: "center" }}>
              <div style={{ fontSize: 12, color: T.textDim, lineHeight: 1.6 }}>
                5-message limit reached for this conversation.<br />
                <span style={{ color: T.textMid }}>Start a new scan to open a fresh session.</span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{ padding: "12px 14px", borderTop: `1px solid ${T.border}`, display: "flex", gap: 8 }}>
          <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
            placeholder={inputDisabled ? (exhausted ? "Limit reached — start a new scan" : "Rate limited — try tomorrow") : "Ask about your privacy issues…"}
            disabled={inputDisabled}
            style={{ flex: 1, background: inputDisabled ? T.bg : T.surface, border: `1.5px solid ${T.border}`, borderRadius: 10, padding: "10px 14px", color: inputDisabled ? T.textDim : T.text, fontSize: 13, outline: "none", transition: "border .15s", cursor: inputDisabled ? "not-allowed" : "text" }}
            onFocus={e => !inputDisabled && (e.target.style.borderColor = T.cyan)}
            onBlur={e => e.target.style.borderColor = T.border} />
          <button onClick={() => send()} disabled={!input.trim() || inputDisabled}
            style={{ background: input.trim() && !inputDisabled ? T.cyan : T.surface, border: `1.5px solid ${input.trim() && !inputDisabled ? T.cyan : T.border}`, borderRadius: 10, padding: "10px 14px", color: input.trim() && !inputDisabled ? T.bg : T.textDim, fontSize: 13, cursor: input.trim() && !inputDisabled ? "pointer" : "not-allowed", transition: "all .2s", fontWeight: 700 }}>
            →
          </button>
        </div>
      </div>
    </div>
  );
}

