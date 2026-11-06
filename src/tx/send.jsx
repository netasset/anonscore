
/* Before-you-send check. Parses a PSBT already in the page, or a plain
   description of inputs and outputs, and says what an observer would learn
   if it were broadcast. Never broadcasts and never leaves the browser.
   The score engine is not involved. */
const SEND_SCRIPTS = {
  p2wpkh: "v0_p2wpkh", segwit: "v0_p2wpkh", wpkh: "v0_p2wpkh",
  p2tr: "v1_p2tr", taproot: "v1_p2tr", tr: "v1_p2tr",
  p2pkh: "p2pkh", legacy: "p2pkh",
  p2sh: "p2sh",
};
function parseSendAmount(tok) {
  const s = String(tok || "").replace(/,/g, "").toLowerCase();
  const m = s.match(/^(\d+(?:\.\d+)?)(btc|sats?)?$/);
  if (!m) return null;
  const n = Number(m[1]);
  if (!Number.isFinite(n) || n < 0) return null;
  return m[2] === "btc" ? Math.round(n * 1e8) : Math.round(n);
}
function parseSendDescription(text) {
  const inputs = [], outputs = [];
  let fee = null, locktime = null;
  String(text || "").split(/\r?\n/).forEach((line, idx) => {
    const raw = line.trim();
    if (!raw || raw.startsWith("#")) return;
    const parts = raw.split(/\s+/);
    const head = parts[0].toLowerCase();
    const n = idx + 1;
    if (head === "fee") {
      let amountTok = parts[1] || "";
      if (parts[2] && /^(btc|sats?)$/i.test(parts[2]) && /^\d+(?:\.\d+)?$/.test(amountTok)) amountTok += parts[2].toLowerCase();
      const v = parseSendAmount(amountTok);
      if (v == null) throw new Error("Line " + n + ": fee needs an amount in sats.");
      fee = v;
      return;
    }
    if (head === "locktime") {
      if (!/^\d+$/.test(parts[1] || "")) throw new Error("Line " + n + ": locktime needs a number.");
      locktime = parseInt(parts[1], 10);
      return;
    }
    if (head !== "in" && head !== "out") throw new Error("Line " + n + " should start with in or out. Example: in bc1q… 50000000 p2wpkh");
    const address = parts[1];
    // "0.1 btc" and "50000 sats" are one amount. The unit may sit in the next token.
    let amountTok = parts[2] || "";
    let flagAt = 3;
    if (parts[3] && /^(btc|sats?)$/i.test(parts[3]) && /^\d+(?:\.\d+)?$/.test(amountTok)) {
      amountTok += parts[3].toLowerCase();
      flagAt = 4;
    }
    const value = parseSendAmount(amountTok);
    if (!address || value == null) throw new Error("Line " + n + " needs an address and an amount in sats.");
    let script = null;
    const flags = { cluster: null, reused: false, toxic: false, kyc: false, exchange: false };
    parts.slice(flagAt).forEach(p => {
      const k = p.toLowerCase();
      if (SEND_SCRIPTS[k]) script = SEND_SCRIPTS[k];
      else if (k === "reused") flags.reused = true;
      else if (k === "toxic" || k === "kyc" || k === "exchange") { flags.toxic = true; if (k !== "toxic") flags[k] = true; }
      else if (k.startsWith("cluster:")) flags.cluster = p.slice(8);
      else throw new Error("Line " + n + ": don't know \"" + p + "\". Use p2wpkh, p2tr, p2pkh, reused, kyc, toxic, or cluster:name.");
    });
    const row = { address, value, script: script || "v0_p2wpkh", ...flags };
    if (head === "in") inputs.push(row);
    else outputs.push(row);
  });
  if (!inputs.length || !outputs.length) throw new Error("Describe at least one in line and one out line.");
  const inn = inputs.reduce((s, i) => s + i.value, 0);
  const out = outputs.reduce((s, o) => s + o.value, 0);
  if (fee == null) fee = inn - out;
  if (fee < 0) throw new Error("The outputs add up to more than the inputs.");
  const tx = {
    version: 2,
    locktime: locktime == null ? 0 : locktime,
    fee,
    vin: inputs.map((inp, i) => ({
      txid: String(i).padStart(64, "0"),
      vout: 0,
      sequence: 0xfffffffd,
      prevout: { value: inp.value, scriptpubkey_type: inp.script, scriptpubkey_address: inp.address },
    })),
    vout: outputs.map(o => ({ value: o.value, scriptpubkey_type: o.script, scriptpubkey_address: o.address })),
  };
  return { tx, notes: inputs };
}
function checkBeforeSend(tx, opts) {
  const opt = opts || {};
  const vin = (tx && tx.vin) || [];
  const vout = (tx && tx.vout) || [];
  const missing = !!opt.partial || vin.length === 0 || vin.some(v => !v.prevout || v.prevout.value == null);
  const stays = "This stays in this browser. Nothing is broadcast, and the PSBT is not sent anywhere.";
  if (!vin.length || !vout.length) return { ok: false, headline: "This transaction has nothing to check yet.", changes: [], stays };
  if (missing) {
    return {
      ok: false,
      headline: "Paste the unsigned PSBT.",
      stays,
      changes: [{
        id: "partial",
        title: "The input amounts are missing",
        learns: "A raw transaction does not carry the coins you are spending, so a merge or change call would be a guess.",
        where: "Sparrow",
        also: "In Electrum, use File, then Export, then PSBT, and paste that here.",
        steps: [
          "Open the send you have not broadcast.",
          "Choose File, then Save PSBT, and copy the unsigned PSBT.",
          "Paste it here. It is not sent anywhere.",
        ],
      }],
    };
  }
  const notes = opt.notes || [];
  const coinjoin = isCoinJoinShape(vin, vout);
  const changes = [];
  const cluster = clusterUnification(tx);
  const clusters = [...new Set(notes.map(n => n && n.cluster).filter(Boolean))];
  const reusedIn = notes.some(n => n && n.reused);
  if (!coinjoin && (cluster.addrs.length >= 2 || clusters.length >= 2 || reusedIn)) {
    const cross = clusters.length >= 2;
    const alone = cluster.addrs.length < 2 && !cross;
    changes.push({
      id: "merge",
      title: cross ? "Don't merge coins from different groups" : alone ? "This input is an address you already used" : "These inputs will be tied as one owner",
      learns: cross
        ? "An observer learns the " + clusters.join(" and ") + " coins are one wallet, because one transaction spends them together."
        : alone
          ? "An observer learns the older payments on this address, because you are spending it again."
          : "An observer learns these " + cluster.addrs.length + " addresses are one wallet. Spending them together is what creates that link.",
      where: "Sparrow",
      also: "In Electrum, open View, then Coins, and select only one group before you send.",
      steps: [
        "Open the wallet, then View, then Coins.",
        cross ? "Click only the coins from one label. Leave the other label unchecked." : "Click only the coins that already belong together. Leave the rest unchecked.",
        reusedIn ? "Right-click the coin on the address you already used, then Freeze." : "Right-click any coin you are not spending, then Freeze, so the next send cannot pull it in.",
        "Click Send and build the payment from that selection. Come back here and check again before you broadcast.",
      ],
    });
  }
  const analyzed = analyzeTx(tx);
  const spend = vout.map((o, i) => ({ o, i })).filter(x => x.o.scriptpubkey_type !== "op_return");
  const g = guessChange(tx);
  const reasons = [];
  if (g && g.confidence === "Medium") reasons.push("one output's address type matches the inputs and the other does not");
  if (g && g.confidence === "Low") reasons.push("the payment is a round amount, so the other output reads as the change");
  if (!coinjoin && analyzed.round && !(g && g.confidence === "Low")) reasons.push("an output is a round amount");
  if (spend.length === 2) {
    const big = spend[0].o.value >= spend[1].o.value ? spend[0] : spend[1];
    const small = big === spend[0] ? spend[1] : spend[0];
    if (small.o.value > 0 && big.o.value >= small.o.value * 3 && !isRoundSat(big.o.value)) reasons.push("the larger output is about " + Math.round(big.o.value / small.o.value) + " times the smaller one, which reads as change");
  }
  if (!coinjoin && reasons.length) {
    changes.push({
      id: "change",
      title: "The change is easy to pick out",
      learns: "An observer can see which coins come back to you, because " + reasons.join(", and ") + ".",
      where: "Sparrow",
      also: "Bitcoin Core matches the change type to the payment on its own. In Electrum, turn on Use change addresses under Tools, then Preferences.",
      steps: [
        "On the Send screen, open the change address menu.",
        "Set the change type to the same type as the address you are paying: Native SegWit, Taproot, or Legacy.",
        "If the amount is a round number, change the last digits. If the change is still much larger than the payment, split the payment, or use Payjoin when the receiver offers it.",
        "Create the transaction again and check it here before you broadcast.",
      ],
    });
  }
  const outAddrs = vout.map(o => o.scriptpubkey_address).filter(Boolean);
  const dupOut = outAddrs.some((a, i) => outAddrs.indexOf(a) !== i);
  if (analyzed.reuse || dupOut) {
    changes.push({
      id: "reuse",
      title: "An output reuses an address",
      learns: "An observer learns the whole balance behind that address, because this payment pays it again.",
      where: "Sparrow",
      also: "In Electrum, click Receive and copy the new address. Turn on Use change addresses under Tools, then Preferences.",
      steps: [
        "Click Receive and copy a new address. Paste that as the destination, not an address this wallet has used.",
        "If the change address is one you have used, open Settings, then script type, then Native SegWit, so change goes to a fresh address.",
        "Build the send again and check it here before you broadcast.",
      ],
    });
  }
  const toxicIn = vin.some((v, i) => {
    const n = notes[i] || {};
    const val = v.prevout && v.prevout.value;
    return !!(n.toxic || n.kyc || n.exchange) || (val != null && (isDustSat(val) || isRoundSat(val)));
  });
  if (!coinjoin && toxicIn && (reasons.length > 0 || spend.length >= 2)) {
    const why = notes.some(n => n && (n.toxic || n.kyc || n.exchange))
      ? "one input is marked as coming from an exchange or as toxic"
      : vin.some(v => v.prevout && isDustSat(v.prevout.value))
        ? "one input is dust"
        : "one input is a round amount, the shape of an exchange withdrawal";
    changes.push({
      id: "toxic",
      title: "The change carries a toxic history",
      learns: "The coins that come back stay tied to that history, because " + why + ".",
      where: "Sparrow",
      also: "In Electrum, right-click that coin on the Coins tab and choose Freeze.",
      steps: [
        "Open View, then Coins, and find the coin from the exchange or the dust send.",
        "Right-click it, then Freeze, so this send cannot select it.",
        "Spend a coin that is not tied to that source. Check the new PSBT here before you broadcast.",
      ],
    });
  }
  const fp = fingerprintTx(tx);
  const rate = feeRate(tx);
  const feeRound = !!(rate && Number.isInteger(rate.rate) && [1, 2, 5, 10, 20].includes(rate.rate));
  const distinctive = (fp && fp.available && fp.signals) ? fp.signals.filter(s => s.distinctive) : [];
  if (distinctive.length || feeRound) {
    const bits = [];
    distinctive.forEach(s => {
      if (s.key === "locktime") bits.push("locktime is 0, so this does not set a recent block height the way Sparrow, Core, and Electrum do");
      else if (s.key === "rbf") bits.push("the inputs opt out of replace-by-fee");
      else if (s.key === "version") bits.push("the version is 1, which most wallets no longer use");
      else if (s.key === "bip69") bits.push("the inputs and outputs are sorted in a way only a few wallets do");
      else if (s.key === "mixin") bits.push("the inputs mix address types");
    });
    if (feeRound) bits.push("the fee is an exact " + rate.rate + " sat/vB, a round default an observer can match to a wallet");
    if (bits.length) {
      changes.push({
        id: "fingerprint",
        title: "The fee or the locktime stands out",
        learns: "An observer can narrow which wallet built this, because " + bits.join(", and ") + ".",
        where: "Sparrow",
        also: "Electrum's fee slider and Bitcoin Core's fee settings let you move off a round rate. Leave anti-fee-sniping on.",
        steps: [
          "On Send, set the fee yourself with the fee slider instead of accepting a whole number.",
          "Nudge it off the round rate, for example 3.1 sat/vB instead of 3.",
          "Leave locktime on the default. Sparrow sets a recent block height. Do not clear it to 0. Rebuild and check again.",
        ],
      });
    }
  }
  const n = changes.length;
  const headline = n === 0
    ? "Safe to send."
    : "Don't broadcast yet: change " + (n === 1 ? "this one thing" : "these " + n + " things") + ".";
  return { ok: n === 0, headline, changes, stays, coinjoin: !!coinjoin };
}
function coinName(v) {
  if (v >= 1e6) return "₿" + (v / 1e8).toFixed(2);
  return v.toLocaleString() + " sats";
}
function labelCoin(u, utxos) {
  const list = utxos || [];
  const others = list.filter(x => x !== u);
  const spendable = list.filter(x => !isDustSat(x.value));
  const privateCoins = spendable.filter(x => !isRoundSat(x.value));
  const biggestPrivate = privateCoins.slice().sort((a, b) => b.value - a.value)[0];
  const biggestOther = others.filter(x => !isDustSat(x.value)).sort((a, b) => b.value - a.value)[0];
  const typeCount = {};
  spendable.forEach(x => { const t = x.scriptpubkey_type; if (t) typeCount[t] = (typeCount[t] || 0) + 1; });
  let majority = null, majorityN = 0;
  Object.keys(typeCount).forEach(t => { if (typeCount[t] > majorityN) { majority = t; majorityN = typeCount[t]; } });
  if (isDustSat(u.value)) {
    return {
      id: "freeze", label: "freeze", bucket: "dust",
      reason: "Spending this tells the sender where the rest of the wallet went.",
      sparrow: "Open View, then Coins. Right-click this coin, then Freeze.",
      also: "In Electrum, right-click the coin and choose Freeze. In Bitcoin Core it is lockunspent.",
    };
  }
  if (isRoundSat(u.value) && biggestPrivate) {
    const other = coinName(biggestPrivate.value);
    return {
      id: "merge", label: "don't merge with " + other, bucket: "exchange",
      reason: "This amount looks like an exchange withdrawal. Spending it with the " + other + " coin ties them as one owner.",
      sparrow: "Open View, then Coins. Leave this coin unchecked when you select the " + other + " coin. Right-click it and Freeze if you are not moving it on its own.",
      also: "In Electrum, open View, then Coins, and do not select this coin together with the private one.",
    };
  }
  if (isRoundSat(u.value)) {
    return {
      id: "alone", label: "spend alone", bucket: "exchange",
      reason: "This amount looks like an exchange withdrawal. Spend it by itself so it never joins a private coin.",
      sparrow: "Open View, then Coins. Select only this coin, then Send.",
      also: "In Electrum, select only this coin on the Coins tab before you send.",
    };
  }
  if (u.scriptpubkey_type && majority && u.scriptpubkey_type !== majority && biggestOther) {
    const other = coinName(biggestOther.value);
    return {
      id: "merge", label: "don't merge with " + other, bucket: "script",
      reason: "This coin uses a different address type from the rest. Spending them together is a link and a fingerprint.",
      sparrow: "Open View, then Coins. Do not select this coin in the same send as the " + other + " coin.",
      also: "In Electrum, leave it unchecked on the Coins tab.",
    };
  }
  const total = spendable.reduce((s, x) => s + x.value, 0);
  if (total > 0 && spendable.length > 1 && u.value / total > 0.8) {
    return {
      id: "alone", label: "spend alone", bucket: "private",
      reason: "This coin is most of the balance. Spending it shows the recipient almost everything you hold.",
      sparrow: "On Send, select only this coin. Send the amount you owe so the change is a new coin.",
      also: "In Electrum, select only this coin, and turn on Use change addresses.",
    };
  }
  return {
    id: "safe", label: "safe to spend", bucket: "private",
    reason: "Nothing in this coin's amount or address type ties it to a different source.",
    sparrow: "Open View, then Coins, and select this coin. Leave dust and exchange-shaped coins unchecked.",
    also: "In Electrum, select it on the Coins tab and leave the others unchecked.",
  };
}
function groupCoins(utxos) {
  const coins = (utxos || []).map((u, i) => ({ i, utxo: u, ...labelCoin(u, utxos) }));
  const titles = { dust: "Freeze these", exchange: "Exchange-shaped", script: "Different address type", private: "Private coins" };
  const buckets = ["dust", "exchange", "script", "private"].map(id => ({
    id, title: titles[id], coins: coins.filter(c => c.bucket === id),
  })).filter(b => b.coins.length);
  const spendGroups = buckets.filter(b => b.id !== "dust");
  return { coins, buckets, separate: spendGroups.length >= 2 };
}
function previewCoinSpend(selected) {
  const coins = selected || [];
  if (!coins.length) return null;
  const sum = coins.reduce((s, c) => s + c.utxo.value, 0);
  const fee = Math.min(1500, Math.max(200, Math.floor(sum / 50)));
  const notes = coins.map(c => ({
    cluster: c.bucket,
    reused: false,
    toxic: c.bucket === "dust" || c.bucket === "exchange",
    kyc: c.bucket === "exchange",
    exchange: c.bucket === "exchange",
  }));
  const vin = coins.map((c, i) => ({
    txid: String(c.utxo.txid || "coin") + ":" + i,
    vout: c.utxo.vout || 0,
    sequence: 0xfffffffd,
    prevout: {
      value: c.utxo.value,
      scriptpubkey_type: c.utxo.scriptpubkey_type || "v0_p2wpkh",
      scriptpubkey_address: "coin-" + c.bucket + "-" + i,
    },
  }));
  const type = (coins[0].utxo.scriptpubkey_type) || "v0_p2wpkh";
  let pay = Math.max(8000, Math.floor((sum - fee) * 0.45));
  if (isRoundSat(pay)) pay += 137;
  let change = sum - pay - fee;
  if (change < 800) { pay = Math.max(800, sum - fee - 1000); change = sum - pay - fee; }
  let vout = change >= 546
    ? [
        { value: pay, scriptpubkey_type: type, scriptpubkey_address: "payee-fresh" },
        { value: change, scriptpubkey_type: type, scriptpubkey_address: "change-fresh" },
      ]
    : [{ value: Math.max(0, sum - fee), scriptpubkey_type: type, scriptpubkey_address: "payee-fresh" }];
  if (vout.length === 2 && vout[0].value < vout[1].value) vout = [vout[1], vout[0]];
  return checkBeforeSend({ version: 2, locktime: 840000, fee, vin, vout }, { notes });
}
function runSendCheck(raw) {
  const s = (raw || "").trim();
  if (!s) return { error: "Paste an unsigned PSBT, or describe the inputs and outputs." };
  const kind = detectTxInput(s);
  if (kind === "psbt" || kind === "rawhex") {
    try {
      const parsed = parseTransactionInput(s);
      const tx = parsed.tx;
      const partial = !tx || tx.partial || (tx.vin || []).some(v => !v.prevout || v.prevout.value == null);
      return { report: checkBeforeSend(tx || { vin: [], vout: [] }, { partial }) };
    } catch (e) {
      return { error: (e && e.message) || "That transaction didn't parse." };
    }
  }
  if (/^(in|out|fee|locktime)\b/im.test(s)) {
    try {
      const described = parseSendDescription(s);
      return { report: checkBeforeSend(described.tx, { notes: described.notes }) };
    } catch (e) {
      return { error: (e && e.message) || "That description didn't parse." };
    }
  }
  if (detectInputType(s)) return { error: "That's an address or a node. Switch to Score an address to audit it. This check is for a send you have not broadcast." };
  return { error: "Paste an unsigned PSBT, or one line per coin. Example: in bc1q… 50000000 p2wpkh" };
}
function SendVerdict({ report }) {
  if (!report) return null;
  const tone = report.ok ? T.green : T.amber;
  return (
    <div role="status" style={{ marginTop: 12, textAlign: "left", background: T.surface, border: `1px solid ${tone}55`, borderRadius: 14, padding: "14px 14px", animation: "slideDown .25s ease" }}>
      <div style={{ fontFamily: T.serif, fontSize: 20, color: T.text, fontWeight: 400, lineHeight: 1.3 }}>{report.headline}</div>
      <p style={{ fontSize: 13, color: T.textMid, lineHeight: 1.5, margin: "6px 0 0" }}>{report.stays}</p>
      {report.ok && (
        <p style={{ fontSize: 14, color: T.text, lineHeight: 1.5, margin: "10px 0 0" }}>An observer learns about as much as they would from any normal payment. Broadcast it from your wallet when you are ready.</p>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: report.changes.length ? 12 : 0 }}>
        {report.changes.map((c, i) => (
          <div key={c.id} style={{ borderTop: `1px solid ${T.border}`, paddingTop: 10 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: T.text }}>{i + 1}. {c.title}</div>
            <p style={{ fontSize: 14, color: T.text, lineHeight: 1.5, margin: "4px 0 0" }}>{c.learns}</p>
            <div style={{ fontSize: 13, fontWeight: 700, color: T.text, marginTop: 8 }}>How, in {c.where}</div>
            <ol style={{ margin: "4px 0 0", paddingLeft: 18 }}>
              {c.steps.map((step, n) => <li key={n} style={{ fontSize: 14, color: T.textMid, lineHeight: 1.45, marginTop: 3 }}>{step}</li>)}
            </ol>
            {c.also && <p style={{ fontSize: 13, color: T.textMid, lineHeight: 1.45, margin: "6px 0 0" }}>{c.also}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

