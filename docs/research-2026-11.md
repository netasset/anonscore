# Research — November 2026

What a person can already do about Bitcoin privacy, what they still cannot do simply, and which of those gaps AnonScore should close next.

Checked 5 November 2026 against public docs, papers, and the complaints people actually post. This is a product note for the app, not a threat model for an analyst. The score and the eleven on-chain heuristics are left alone; the question is what a non-expert still cannot get from any tool in one sitting.

AnonScore today already says, in one sentence, why a score landed where it did, lists the first steps in a named wallet, draws the addresses an observer can already link, checks a PSBT before broadcast, and labels each coin. Those shipped in the November push. The holes below are what is still missing after that.

## Wallets, and the privacy they actually hand you

The mixing market split in 2024 and has not grown back together.

- **Sparrow** (2.5.4, compared by Ginger's docs on 14 September 2026) is still the wallet where a careful person picks coins, labels them, sends Payjoin, uses PayNyms, and can point at their own node. It removed Whirlpool in 1.9.0 (April 2024). What remains of "mix" inside Sparrow is Stonewall: an extra equal output built from your own coins. It looks a bit like a coinjoin and it is not one. Syncing through a public Electrum server tells that server your addresses.
- **Wasabi** still maintains the client (2.7.2 was current in a November 2025 comparison). zkSNACKs shut the default coordinator on 1 June 2024. You now pick a community coordinator (people on Reddit name `coinjoin.kruw.io`; lists such as wabisator.com exist). WabiSabi can hide the input-to-output mapping from the coordinator and uses variable amounts. The client does not ship a coordinator.
- **Ginger Wallet** is the Wasabi fork that does ship one (InvisibleBit LLC, documented against v2.0.26). Inputs of 0.03 BTC or less are exempt; larger inputs pay 0.3%. The operator refuses some coins and excludes US persons. Tor is on by default and history comes from compact filters, so the wallet does not hand a server the address list. CoinJoin signing is a software wallet; a hardware wallet can receive the outputs.
- **Ashigaru** is the Whirlpool-style successor: Tor-only, fixed pools, a new coordinator, a desktop terminal forked from Sparrow. A June 2026 survey puts the entry fee at about 5% of the pool, with free remixes. It is younger and thinner than JoinMarket. Do not use the old Samourai binaries or domains; those were seized in April 2024, and the founders were sentenced in November 2025.
- **JoinMarket** is the coordinator-free maker/taker market, alive since 2015. The original client is being retired: PriFi recorded the maintainers pointing at **JoinMarket NG** (0.42.0 on 19 October 2026, an external audit described as ongoing) and saying there would be no further updates of the old tree after v0.9.12. Jam is the friendlier UI. It wants your own node. Self Custody Labs switched their recommendation to JoinMarket NG on 22 August 2026 for that reason: there is no coordinator to seize. Peter Todd's criticism, still circulating on Stacker News, is the other edge: some JoinMarket shapes leave a clue about which input paid the fee. Wasabi does not, because every participant pays part of it.
- **Joinstr** (CoinJoin coordinated over Nostr) is still described as experimental, with known bugs, and not something to put mainnet coins in.
- **Bitcoin Core** gives the primitives and not the guidance. Coin control, locking an output, `avoidpartialspends`, and a custom change address are all there. Avoiding a partial spend can cost more in fees; Core's own notes say so. BIP352 code for silent payments landed on master in September 2026 and sending or receiving had not shipped in a release. Payjoin is an external client, not a button. Nothing in Core tells a person which of their coins came from an exchange.
- **BlueWallet** has coin control, labels, and Payjoin sending. Silent payments are send-only on the public support table. It is a phone wallet that can do the right thing and does not tell you when the next send will merge two histories.
- **Phoenix** is the wallet people actually use for Lightning. Splicing (Phoenix 2.2 and later, on the quiescence work Eclair shipped) replaced a lot of submarine swaps: one on-chain transaction adds to or removes from the channel. That transaction is public, it spends the channel output plus whatever coin the wallet added, and ACINQ is the peer. Payments inside the channel stay off-chain. The footprint people forget is the splice.
- **Muun** is the simple on-chain-plus-Lightning wallet. Submarine swaps move money between the chain and Lightning, and the swap is visible as an on-chain transaction whose amount and timing sit next to the Lightning payment. There is no coin control worth the name. "Send everything to Muun and then to cold storage" does not mix anything; a Coldcard thread in February 2026 still had someone hoping it did.
- **Cake Wallet** is the phone wallet that currently lines up with the advice AnonScore already gives: fresh addresses by default, coin control, silent payments with on-device scanning, and Payjoin v1 and v2. It is the realistic "do this on the phone you already have" target. It will still spend whatever coins are selected if the person never looks.

The pattern across all of them: the power is in the desktop tool, the people are on the phone, and nobody states the order of operations across the address they were paid on, the wallet that holds the rest, and the node that spends it.

## What an observer actually uses

These are published heuristics, not a tour of anyone's proprietary stack. Chainalysis describes the same shape in public: start from a known service, then grow the cluster with deterministic rules. The rules below are the ones a person can see in papers and in wallet docs.

- **Common-input ownership.** Meiklejohn et al. (2013) and every clustering paper since: the inputs of one transaction are one owner, unless the transaction is a CoinJoin. A 2024 clustering note (arXiv 2403.00523) restates it and then exempts transactions their CoinJoin detector flags. One careless consolidation undoes a year of fresh addresses.
- **Change detection.** Fresh change versus a reused payment address. Script-type mismatch: the output that matches the input's type is the change. Round payment, odd change. Unnecessary-input and optimal-change heuristics. The peel chain is this repeated: one input, a payment, and the change becomes the next input (Forensic Science International, the 2023 peeling-chain study). Whirlpool's toxic change is the cousin: the output that was not the pool denomination, sitting there with the pre-mix history still attached.
- **Round amounts.** A round BTC or round fiat-sized output is the usual fingerprint of an exchange withdrawal. It is a weak tell on its own and a strong one next to a known exchange cluster.
- **Address reuse.** Still the cheapest link. One published address collapses every payment to it.
- **Script-type mismatch and mixed types inside one wallet.** Legacy next to native SegWit next to Taproot is a wallet habit, and on a two-output payment it picks the change.
- **Wallet fingerprinting.** Version, locktime, nSequence, RBF signalling, BIP69 ordering, low-R signatures, fee rounding, change position. DISCRYPT's write-up of the recent literature is blunt: the same small choices identify the software. A 2025 Forensic Science International paper used those fingerprints to separate a tumbler's own addresses from its customers. AnonScore's inspector already names some of these on a single transaction. The wallet list above does not randomise them.
- **Timing.** Sleeping hours, the gap between an exchange withdrawal and the next hop, and the gap between a mix and the spend that follows it. Waiting is part of the advice on Stacker News because the amount match plus a same-day spend is enough.
- **CoinJoin detection.** Equal outputs at known pool sizes (Whirlpool's 5-of-5), many equal outputs (Wasabi's older ZeroLink shape; Tironsakkul and Maarek, ACM EICC 2022), JoinMarket's maker/taker shape. WabiSabi's variable amounts are harder. Detecting the mix is not the same as undoing it. The undo is usually the user's next transaction: a mixed output spent together with a round withdrawal, or several mixed outputs combined because the wallet auto-selected them.

## Scorers and explorers

The two tools ordinary people used to see this themselves went offline in April 2024, with the Samourai arrests.

- **OXT** was the public Boltzmann explorer: link probability for a transaction, laid out so you could argue with it. It is gone.
- **KYCP** (kycp.org) was the "is this coinjoin actually private, and is this coin close to a KYC cluster" view. It is gone.
- **Blockchair's privacy-o-meter** is still up. It scores a transaction from a long list of indicators and gives generic advice ("don't send round numbers", "don't use send-everything"). It does not know which wallet you are holding, and the page you load is the transaction itself, on their server, from your IP.
- **mempool.space** is the explorer people trust. Its privacy work is operational: self-host, an onion, no third-party analytics, IP logs kept about ten days (their privacy policy). A 2021 discussion (#744) asked them to embed KYCP, the privacy-o-meter, and OXT. They did not. The features that shipped since are about seeing what is in a transaction (inscriptions, runes, accelerators), which is a different job. Looking yourself up there still ties the address to the request.
- **am-i.exposed** (Copexit, GitHub) is the serious attempt to replace OXT and KYCP. It says so in the welcome page. Client-side, 34 heuristics, Boltzmann entropy in WASM, entity labels, a PSBT check, xpub and QR. The lookups go straight to mempool.space unless you bring Tor or your own instance. The result is a dense report a specialist can love. It is not a short plan, and posting it means posting the address or a screenshot of it.
- **BTC Medusa** answers a different question: can the scanner itself avoid learning which coin you asked about, using blinded queries and filter downloads. That is a real problem. It is a paid wallet fork, not a page you paste into, and the report is still inside the wallet.

AnonScore sits closer to am-i.exposed than to Medusa: the analysis runs in the browser, and the explorer request is the remaining leak (the relay hides your IP from the explorer and not the fact of the lookup from the relay). The difference that matters for this pass is the sentence and the next click, which the denser tools still bury.

## What people say is missing

The posts are about what to do, not about a missing chart.

- Reddit, r/Bitcoin, 30 August 2026, "How to clean bitcoin now CoinJoin is gone?": the title is the misconception. The useful reply is "Wasabi is not gone, the default coordinator is." The next reply is the fear underneath: a mixer mark can get a coin refused by an exchange. People want "clean," and the honest answer is "separate, and don't create a new link."
- Reddit, r/BitcoinBeginners, 20 April 2026, "Best wallet for coinjoin?": Sparrow's Whirlpool button is gone, Wasabi rejected their coins and banned them for two days, and the thread ends on "there's no clear best anymore." The failure is a coordinator policy, and what the person feels is that the tool is broken.
- Reddit, r/coldcard, February 2026: one person asks if exchange → Muun → cold storage "mixes." It does not. Another prefers Ashigaru because Wasabi leaves too many small coins and JoinMarket costs too much.
- Reddit, r/CryptoCurrency, September 2025: recommendations still name Samourai and Whirlpool, which have been dead for a year, and one person reports losing coins to a tampered Wasabi download. The advice graph is stale, and the install is the dangerous moment.
- Stacker News, "Bitcoin Privacy: Coinjoin Best Practices" (item 1015766) and the coin-control guide (1017600): the answers collapse into a three-wallet ritual (old coins, a hot mixing wallet, a clean cold wallet), with Stonewall sometimes offered as if it were a mix. The comments that push back say to use a real CoinJoin, sweep into it with no change, and never combine the mixed output with an unmixed one. Peter Todd's thread (1062286) argues about which implementation leaks the fee, and his own practice is to open Lightning channels with the mixed coins and spend there. A Wasabi question (856680) repeats the same two warnings: don't deposit the mixed coin back to the exchange that sold it to you, and don't leak the xpub to a public server.
- GitHub, mempool discussion #744: people wanted the dead explorers' privacy views inside the explorer they already use. Years later that view still is not there.

The complaint under all of these is the same. The person has an address, a wallet, and sometimes a node. The tools each show one of those, in an expert dialect, and the thing they need to ask a friend ("is this bad, and what do I tap") requires pasting the address into a chat.

## The gap

No tool does both of these, and they are the whole job for someone who is not going to learn BIP157:

1. **Let them show the findings to someone else without showing the wallet.** Every share path today is the address, a txid, a screenshot with the address truncated but still searchable, or a score with no reason. A redacted report is not a privacy technique on the chain. It is how you get help without creating a new off-chain link between your name and your coins. OXT, KYCP, Blockchair, am-i.exposed, and AnonScore's own share card all miss it. The share card's "result link" is `?scan=` plus the address. The PNG prints a shortened address.
2. **One plan across the three things they actually hold.** The address score, the xpub scan, and the node score are three screens. A person does not live that way. The Stacker News guides invent a three-wallet system because nothing will say "this address was reused, the wallet already spends two of its addresses together, and the node is about to open a channel from the round coin — do these three, in this order." That sentence is computable from checks AnonScore already runs. It is not a new heuristic and it must not be a new score.

Close behind those, and not in this change:

3. **A "you are about to undo the mix" signal that follows the coin, not the transaction.** The before-you-send check covers a PSBT in front of you. It does not sit on the result and say that a CoinJoin already in the history is one combined spend away from being pointless. The plan's bridge sentence covers the case where the checks already show both facts. A real coin-level flag would need to remember which UTXO was the mixed output. That is the right next analysis, and it is a separate signal, not a rescoring.
4. **The phone-wallet preview.** "You are about to splice in Phoenix" or "this Muun swap will land on-chain next to the payment" is the advice the majority of holders need, and it is easy to say wrongly. It wants a maintained fingerprint of each wallet's next transaction, shown as a guess with a name, never as a deduction from the score. Worth doing when it can be checked against a transaction from that wallet, not from memory.
5. **A KYC boundary that is a label, not a probability.** Round amounts plus a peel are a hint. am-i.exposed and Medusa try to answer "which service" with large label sets. AnonScore should not invent a service name it cannot show the evidence for. The coin-control labels already say "don't merge this round coin with the private one." A wallet-level "keep these in a second wallet" is the same fact, said once. Useful, and partly shipped.
6. **Lookup privacy of the Medusa kind.** Blinded queries would mean the relay never sees the address either. That is a protocol project, it is not a page in this repo, and it does not change what the person should do with the coins.
7. **WabiSabi-aware CoinJoin detection.** The current detector is the equal-output shape, which is Whirlpool, older Wasabi, and some JoinMarket. Variable-amount rounds can be scored as ordinary payments. Fixing that is an engine change and this pass does not touch the engine. It is the right heuristic correction later, with vectors, not a UI pass.
8. **A fresh-install path that does not send people to a dead coordinator.** The fix steps already name Ginger, Wasabi's community coordinator, and JoinMarket. The research says to keep JoinMarket NG and Ashigaru in that list as the coordinator-free and the Whirlpool-style options, and to keep saying Stonewall is not a mix. Copy, not a feature.

## Ranked

Usefulness is "does a non-expert leave with a different next tap." Novelty is "nobody simple does this." Effort is the size of a client-side change in this repo. Higher is more.

| # | Idea | Usefulness | Novelty | Effort | Why it would be different | Risk |
|---|---|---|---|---|---|---|
| 1 | Redacted report, as a fragment and a text file | High | High | Low | You can ask for help. The link never contained the address, so a host log cannot collect it either. | A score plus a check pattern is still a fingerprint of a sort. Say that. Do not pretend the chain got more private. |
| 2 | One plan across address, wallet, and node | High | High | Medium | The order is the product. Dust and reuse before a mix you have already done; the channel open after the round coin is kept aside. | Three scans are still three pastes. The plan has to be honest when only one of them happened. |
| 3 | "Don't undo the mix" on the result | High | Medium | Medium | It is the sentence in every Stacker News comment, and it is the one the score currently rewards you for having mixed without warning you about the next spend. | Easy to overclaim. Only say it when a CoinJoin check passed and a linking check did not. |
| 4 | Phone-wallet next-spend preview | High | High | High | Phoenix, Muun, and BlueWallet are where the coins actually move. | A wrong fingerprint teaches a false lesson. Needs fixtures from those wallets. |
| 5 | Second-wallet boundary for round coins | Medium | Low | Low | Same fact as the coin labels, said once, at wallet scale. | Round is not proof of an exchange. The wording has to stay "a common shape," never "this is Binance." |
| 6 | Blinded lookups | Medium | High | Very high | Removes the last party who sees the address. | A new protocol. Out of scope for a static page, and the live relay is already stale. |
| 7 | Detect variable-amount CoinJoins | Medium | Low | Medium | Stops a modern Wasabi round looking like a normal payment. | It changes the score. Not in this pass. Needs published vectors. |
| 8 | Stale-advice cleanup in the existing steps | Medium | Low | Low | People are still being sent to Whirlpool. | Copy only. Do it when those steps are next edited, and do not let it move the points. |

## What this pass should build

1 and 2, with 3 folded into the plan as a sentence that only appears when the checks already support it.

The report is a versioned string of check keys, statuses, and point deltas. No free text from the scan, so an alias, an address, or a txid has nowhere to go. It lives in the URL fragment, which a server does not receive. Opening it redraws the grade, the sentence, and the steps from that string and does not fetch the chain. The plan reads the same snapshots for whichever of the address, the wallet, and the node have been scanned in this session, orders the failures as "what the next spend would make worse," and says how they connect. Neither one writes a point.

Left for a later change, on purpose: anything that edits `runEngine`, `runWalletEngine`, or `runLightningEngine`; a new relay route; a wallet-fingerprint guess; a service-name label.
