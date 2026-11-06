/* ─────────────────────────────────────────────
   UTXO CLASSIFIER — hoisted, not per-render
───────────────────────────────────────────── */
function classifyUtxo(u) {
  if (isDustSat(u.value)) return "critical";
  if (isRoundSat(u.value)) return "medium";
  if (u.value > 5000000) return "low";
  return "clean";
}

// A CoinJoin has many *participants*: several inputs (each from a different
// owner) AND several equal-value outputs (the shared denomination). A single-
// sender batch payout also emits many equal outputs — but from ONE input.
// Requiring multiple inputs is what separates a real mix from a batch, so a
// batch is never miscredited as privacy-positive mixing. Used everywhere
// CoinJoin shape is judged (scoring, cluster exclusion, exposure map) so the
// definition can't drift between call sites.
function isCoinJoinShape(vin, vout) {
  const inputs = (vin || []).length;
  const outs = vout || [];
  if (inputs < 3 || outs.length < 5) return false;
  const dn = {};
  outs.forEach(o => { if (o && o.value != null) dn[o.value] = (dn[o.value] || 0) + 1; });
  return Math.max(0, ...Object.values(dn)) >= 3;
}
// Identify the specific CoinJoin protocol from structure alone (cited thresholds).
// Whirlpool: exactly 5-in/5-out, all outputs equal (Samourai fixed-pool design).
// Wasabi/ZeroLink equal-value: ≥10 equal outputs, ≥2 distinct output values, and
//   ≥ as many inputs as the equal-output count — ~99% accurate structurally
//   (Tironsakkul/Maarek, ACM EICC 2022). NOT WabiSabi (variable-amount) — we
//   don't claim to detect modern Wasabi 2.0 rounds. Else a generic equal-output
//   CoinJoin. Returns null when the shape doesn't qualify.
function classifyCoinjoin(vin, vout) {
  const ins = (vin || []).length, outs = vout || [];
  if (ins < 2 || outs.length < 3) return null;
  const dn = {};
  outs.forEach(o => { if (o && o.value != null) dn[o.value] = (dn[o.value] || 0) + 1; });
  const vals = Object.keys(dn);
  if (!vals.length) return null;
  let denom = 0, equal = 0;
  for (const v of vals) { if (dn[v] > equal || (dn[v] === equal && +v > denom)) { equal = dn[v]; denom = +v; } }
  const distinct = vals.length;
  if (equal < 3) return null;
  if (ins === 5 && outs.length === 5 && equal === 5) return { type: "Whirlpool", denom, participants: 5 };
  if (equal >= 10 && distinct >= 2 && ins >= equal) return { type: "Wasabi", denom, participants: equal };
  if (ins >= 3 && outs.length >= 5) return { type: "CoinJoin", denom, participants: equal };
  return null;
}

