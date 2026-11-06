/* ─────────────────────────────────────────────
   CASE FILES — notable Bitcoin wallets
───────────────────────────────────────────── */
const CASE_FILES = [
  {
    id: "001",
    slug: "bitfinex-hack-recovery",
    title: "The Bitfinex Hack Recovery",
    address: "bc1qazcm763858nkj2dj986etajv6wquslv8uxwczt",
    entity: "US Department of Justice",
    btc: "~94,000",
    category: "seizure",
    status: "active",
    added: "2026-04-01",
    hook: "In 2016, hackers stole 119,756 BTC from Bitfinex. In 2022, the DOJ seized it back — and the wallet fingerprint tells the whole story.",
    summary: "The largest cryptocurrency seizure in history. After sitting dormant for six years, the 2016 Bitfinex hack funds were traced to a New York couple — Ilya Lichtenstein and Heather Morgan — who had laundered only a fraction before being caught. The rest sat in this wallet.",
    narrative: `In August 2016, hackers executed 2,072 transactions to drain 119,756 BTC from Bitfinex, then worth ~$72 million. The funds sat largely untouched for years while investigators built their case.

On February 1, 2022, everything moved at once — all the hack proceeds consolidated into this single government-controlled address in a single day. Lichtenstein and Morgan were arrested the same week. The government had been watching the wallet for years, waiting for the launderers to move.

What makes this address forensically remarkable: the funding pattern is completely unlike normal wallet behaviour. Every input arrived on a single date. The address has never sent anything out. There is zero mixing, zero CoinJoin, zero attempt at obfuscation — the DOJ simply took custody and held.

The privacy score here is interesting not because of what the wallet's owner did wrong, but because of what a government seizure wallet looks like on-chain: extreme balance concentration, no transaction diversity, no privacy measures whatsoever. It scores poorly by every heuristic — not because of bad habits, but because it was never meant to be private.

The case resolved after the seizure: both pleaded guilty to money-laundering conspiracy in August 2023 — Lichtenstein admitting he was the original 2016 hacker. On November 14, 2024 he was sentenced to five years; Heather "Razzlekhan" Morgan followed on November 18 with 18 months. (Lichtenstein was released early in 2026 under the First Step Act.) The forensic point stands: the chain preserved the whole trail for years, and the coins never had to move for the case to close.`,
    thread: [
      "In 2016, hackers stole 119,756 BTC from Bitfinex (~$72M at the time). The funds sat dormant for 6 years. Then in Feb 2022, the DOJ moved it all at once — and arrested a NYC couple the same day. Here's what the on-chain data shows 🧵",
      "All 94,000+ BTC arrived at this address on a single date: February 1, 2022. Every input, same day. That's not how normal wallets work. That's a government seizure — structured, controlled, and permanent.",
      "The wallet has NEVER sent anything out. No mixing. No CoinJoin. No obfuscation attempts. It's the forensic opposite of what a privacy-conscious holder would do — which makes sense. The FBI isn't trying to hide.",
      "The privacy score? Terrible. Balance concentration at 100%. No CoinJoin ever. Round amounts everywhere. Script type inconsistency from the original hack consolidations. It scores F by almost every heuristic.",
      "The lesson isn't about the DOJ's privacy. It's about what 6 years of blockchain forensics looks like. Chainalysis and CipherTrace traced every hop. The hack funds never really moved — they just waited to be claimed. anonscore.com/?scan=bc1qazcm763858nkj2dj986etajv6wquslv8uxwczt",
    ],
    tags: ["#Bitcoin", "#Bitfinex", "#Forensics", "#DOJ"],
    notable: ["Largest crypto seizure in history", "Funded in a single day — Feb 1 2022", "Connected to 2016 Bitfinex hack", "Lichtenstein & Morgan sentenced Nov 2024 (5 yrs / 18 mo)"],
    externalUrl: "https://www.justice.gov/opa/pr/two-arrested-alleged-conspiracy-launder-45-billion-stolen-cryptocurrency-hack",
  },
  {
    id: "002",
    slug: "binance-cold-wallet-1",
    title: "Binance Cold Wallet #1",
    address: "34xp4vRoCGJym3xR7yCVPFHoCNxv4Twseo",
    entity: "Binance",
    btc: "~248,000",
    category: "exchange",
    status: "active",
    added: "2026-04-01",
    hook: "The single largest Bitcoin address on the blockchain. Nearly $17 billion in one wallet, with zero privacy measures — a perfect surveillance target.",
    summary: "The largest known single-address Bitcoin wallet belongs to Binance. With ~248,000 BTC, it holds more Bitcoin than any other individual address on-chain. Its transaction patterns are a textbook case of what custodial exchanges look like — and why they score so poorly on privacy.",
    narrative: `This address holds more Bitcoin than any other single address on the blockchain — roughly 248,000 BTC, worth approximately $17 billion at current prices.

Binance uses this as a primary cold storage address. Funds flow in from exchange operations in large batches, and flow out rarely — only for major withdrawals, exchange operations, or proof-of-reserves audits. The activity pattern is unmistakable to any blockchain analyst.

From a privacy standpoint, this wallet commits almost every heuristic violation in the book. Round-number transactions are pervasive — exchange deposits and withdrawals almost always come in round amounts, a primary Chainalysis fingerprint. The balance is extremely concentrated. There is no CoinJoin usage. The address itself is a legacy P2SH format, mixing with SegWit inputs over time.

But the most important thing this wallet illustrates is custodial risk. Every Bitcoin in this address belongs to Binance customers — yet those customers have no on-chain claim. Their funds are mixed together, indistinguishable, and fully controlled by Binance. If this address moved tomorrow, every customer would know instantly. That's both transparency and vulnerability in the same package.`,
    thread: [
      "This is the single largest Bitcoin address on Earth. ~248,000 BTC. ~$17 billion. One address. It belongs to Binance — and its privacy score is absolutely terrible. Here's why that matters 🧵",
      "Round amounts everywhere. Binance processes thousands of deposits and withdrawals, almost always in round numbers (0.1 BTC, 1.0 BTC, 10.0 BTC). This is the primary signal Chainalysis uses to identify exchange activity. It's permanently on-chain.",
      "Zero CoinJoin. Zero mixing. 100% balance concentration. The wallet literally scores 0 on the checks that matter most for privacy. Not because Binance is careless — but because custodial exchanges fundamentally can't be private.",
      "The deeper point: every sat in this address belongs to a Binance customer, but those customers have no on-chain claim. Their coins are pooled, indistinguishable, and controlled by a single company. That's custodial risk in address form.",
      "Not your keys, not your coins — this is what that looks like on-chain. Scan it yourself: anonscore.com/?scan=34xp4vRoCGJym3xR7yCVPFHoCNxv4Twseo",
    ],
    tags: ["#Bitcoin", "#Binance", "#NotYourKeys", "#Privacy"],
    notable: ["Largest single Bitcoin address on-chain", "~248,000 BTC / ~$17B", "Primary Binance cold storage", "Perfect example of custodial risk"],
    externalUrl: "https://arkham.com",
  },
  {
    id: "003",
    slug: "silk-road-individual-x",
    title: "Silk Road — Individual X",
    address: "1HQ3Go3ggs8pFnXuHVHRytPCq5fGG8Hbhx",
    entity: "US Government (seized from Individual X)",
    btc: "~0",
    category: "seizure",
    status: "liquidated",
    added: "2026-04-01",
    hook: "69,370 BTC sat in this address for 8 years. Nobody knew who owned it. Then on November 3, 2020, it all moved — and the US Government revealed they'd seized it from an anonymous hacker.",
    summary: "The most mysterious wallet in Bitcoin history. An unknown person — called only 'Individual X' in court documents — hacked Silk Road between 2012 and 2013, stealing tens of thousands of BTC. They held it for 7 years without spending a satoshi. Then in 2020, they agreed to forfeit it to the US government, who auctioned it off.",
    narrative: `Between 2012 and 2013, someone hacked Silk Road — the darknet marketplace that pioneered Bitcoin commerce — and quietly stole 69,370 BTC. The funds were moved to this address and then never touched again. For seven years.

Nobody knew who owned it. On-chain, it was just a dormant address with an enormous balance. Blockchain analysts tracked it, wondered about it, and waited. When it finally moved on November 3, 2020, the entire Bitcoin world noticed: $1 billion moved in a single transaction, the largest single on-chain movement in Bitcoin's history at the time.

The court documents revealed the holder had been "Individual X" — an anonymous hacker who approached the US Government and agreed to forfeit the funds. In exchange, they presumably received some form of immunity or reduced liability. Their identity was never revealed.

What makes this address fascinating from a forensics perspective: the holding pattern itself is the signature. A single large inflow in 2013. Then absolute silence for 7 years. No mixing, no splitting, no consolidation attempts. The holder knew that any movement would be traced. So they held. Until they didn't.`,
    thread: [
      "On November 3, 2020, $1 billion in Bitcoin moved from this address. It had been dormant for 7 years. The owner was never identified. This is the most mysterious wallet in Bitcoin history 🧵",
      "Between 2012-2013, someone hacked Silk Road and stole 69,370 BTC. They moved it here — and then never spent a single satoshi for 7 years. No mixing. No splitting. Just held.",
      "Why hold for 7 years without spending? Because they knew any movement would be traced. Blockchain analytics firms had this address tagged and watched. The only safe move was no move.",
      "In 2020, 'Individual X' — their identity still unknown — contacted the US Government and voluntarily forfeited the coins. In exchange for what, exactly, was never disclosed. The DOJ auctioned off the BTC.",
      "The privacy lesson: sometimes the right move is to do nothing. 7 years of inaction was the most effective privacy strategy possible. Until it wasn't. anonscore.com/?scan=1HQ3Go3ggs8pFnXuHVHRytPCq5fGG8Hbhx",
    ],
    tags: ["#Bitcoin", "#SilkRoad", "#Forensics", "#Privacy"],
    notable: ["69,370 BTC dormant for 7 years", "Stolen from Silk Road 2012-2013", "Owner 'Individual X' — never identified", "Largest single BTC movement at time ($1B, Nov 2020)"],
    externalUrl: "https://en.wikipedia.org/wiki/Silk_Road_(marketplace)",
  },
  {
    id: "004",
    slug: "james-zhong-silk-road-hacker",
    title: "James Zhong — Silk Road Hacker",
    address: "bc1qmxjefnuy06v345v6vhwpwt05dztztmx4g3y7wp",
    entity: "US Department of Justice (James Zhong seizure)",
    btc: "~50,000",
    category: "seizure",
    status: "liquidating",
    added: "2026-04-01",
    hook: "In 2012, James Zhong stole 50,000 BTC from Silk Road by exploiting a withdrawal bug. He hid it for 9 years — under floorboards and in a popcorn tin. The FBI found it anyway.",
    summary: "James Zhong stole approximately 50,000 BTC from Silk Road in 2012 by rapidly triggering withdrawals faster than the system could process. He held the coins for nearly a decade, moving them only occasionally. In November 2021, the FBI executed a search warrant and found the coins hidden in a single-board computer buried under his bathroom floor and in a popcorn tin in a safe.",
    narrative: `In September 2012, James Zhong executed one of the earliest and most audacious Bitcoin thefts. He created nine Silk Road accounts, deposited small amounts of Bitcoin, then rapidly triggered multiple withdrawals before the system could update balances. The exploit netted him approximately 50,000 BTC — worth around $600,000 at the time.

Zhong then did something remarkable: almost nothing. The coins sat largely untouched for years. Between 2012 and 2019, he made a small number of movements — consolidations, some conversions — but showed unusual discipline in not spending the bulk of the funds.

In late 2020 and early 2021, Zhong moved some coins to a mixing service. But by then, blockchain forensics had advanced dramatically. The FBI traced the funds through the mixer and eventually to wallets on Zhong's devices.

The November 2021 search warrant produced one of law enforcement's most colourful seizures: 50,491 BTC found on a single-board Raspberry Pi-style computer hidden under floorboards in a bathroom, along with 1 BTC in a popcorn tin inside a safe. Zhong pleaded guilty in November 2022 and was sentenced to a year in prison.

The forensic lesson: holding coins without moving them is effective short-term privacy. But the blockchain is permanent. Nine years later, every original transaction was still there, fully traceable. The mixer didn't help — the pattern analysis connecting his accounts to the original theft was complete before he ever tried to obscure it.`,
    thread: [
      "In 2012, James Zhong stole 50,000 BTC from Silk Road using a withdrawal exploit. He then hid the coins for 9 years — barely touching them. The FBI found them under his bathroom floor. Here's the on-chain story 🧵",
      "The theft was simple: create accounts, deposit small amounts, then trigger multiple rapid withdrawals before Silk Road's system updated balances. Nine accounts. ~50,000 BTC. One exploit. $600,000 in 2012 — $3.3 billion when seized.",
      "For 9 years, Zhong did almost nothing with the coins. A few consolidations. Some small movements. Remarkable discipline. The blockchain recorded every one of those moves permanently.",
      "In late 2020, he moved some coins to a mixer. Too late. The FBI had already traced the original theft through the full transaction history. The mixing didn't obscure what had already been established.",
      "The find: a single-board computer hidden under his bathroom floorboards, containing the wallet. Plus 1 BTC in a popcorn tin in a safe. The blockchain led them straight there. anonscore.com/?scan=bc1qmxjefnuy06v345v6vhwpwt05dztztmx4g3y7wp",
    ],
    tags: ["#Bitcoin", "#SilkRoad", "#Forensics", "#DOJ"],
    notable: ["50,000 BTC stolen via withdrawal exploit in 2012", "Held untouched for 9 years", "Found on Raspberry Pi under bathroom floorboards + in a popcorn tin", "Mixer used in 2020 — too late to obscure the original trace"],
    externalUrl: "https://www.justice.gov/opa/pr/special-agent-james-zhong-pleads-guilty-wire-fraud-stealing-over-50000-bitcoin-silk-road",
  },
  {
    id: "005",
    slug: "satoshi-patoshi-cluster",
    title: "The Satoshi Cluster",
    address: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
    entity: "Satoshi Nakamoto (attributed)",
    btc: "~100",
    category: "miner",
    status: "dormant",
    added: "2026-04-01",
    hook: "The genesis address holds the first 50 BTC ever mined — provably unspendable, never moved (the ~100 BTC you see is well-wishers' tribute dust). It anchors the ~1.1M-BTC 'Patoshi' cluster: thousands of early addresses, identified by one mining fingerprint, untouched for 15+ years. What happens if it ever moves?",
    summary: "Satoshi Nakamoto mined approximately 1.1 million Bitcoin in the early days of the network, identifiable through a distinctive mining pattern called the Patoshi Pattern. None of it has ever been spent. These dormant coins represent the ultimate long-term hodl — and the ultimate privacy case study.",
    narrative: `On January 3, 2009, Satoshi Nakamoto mined the first Bitcoin block — the Genesis Block — and received 50 BTC. That reward has never moved. Neither have the rewards from thousands of subsequent blocks Satoshi mined in the following months.

Researcher Sergio Demian Lerner identified a distinctive pattern in early Bitcoin mining — now called the Patoshi Pattern — that allows attribution of roughly 1.1 million BTC to a single miner, almost certainly Satoshi. The nonce values in these early blocks follow a unique incremental pattern not seen in any other early miner.

From a privacy perspective, Satoshi's approach was actually quite sophisticated for 2009: mining to fresh addresses, never consolidating, never reusing. The problem was scale — mining 1.1 million BTC in a single cohort creates an attribution link that no amount of address rotation can erase. The Patoshi Pattern shows that privacy through address diversity only works if your total activity doesn't form a recognizable signature.

The burning question: what happens if these coins ever move? Every analysis suggests it would be the most significant Bitcoin event in history. The market would likely crash. Every blockchain analytics firm has alerts set. And whoever moved them would immediately become the most watched Bitcoin holder on Earth.

Satoshi's best privacy move was also the simplest: don't spend.`,
    thread: [
      "1,100,000 Bitcoin. Never moved. The coins mined by Bitcoin's creator, Satoshi Nakamoto, have sat untouched for 15+ years. What do they tell us about privacy — and what happens if they ever move? 🧵",
      "Researcher Sergio Lerner found a distinctive pattern in early block mining — now called the 'Patoshi Pattern'. The nonce values increment in a unique way that links ~22,000 early blocks to a single miner. Almost certainly Satoshi.",
      "The privacy lesson: Satoshi used fresh addresses for every block. Smart. But mining 1.1M BTC in one cohort creates an attribution fingerprint that address rotation can't erase. Scale defeats privacy.",
      "What happens if these coins move? Every analytics firm has alerts set. The market would likely drop significantly. Whoever moved them would be the most-watched Bitcoin holder on Earth. Which may be why they haven't.",
      "Satoshi's best privacy strategy turned out to be the simplest: don't spend. 15 years of inaction. The coins are worth $77B today. Sometimes the most private wallet is the one that never moves. anonscore.com",
    ],
    tags: ["#Bitcoin", "#Satoshi", "#PatoshiPattern", "#Privacy"],
    notable: ["Genesis Block — first Bitcoin ever mined", "~1.1M BTC attributed via Patoshi Pattern", "Never moved since 2009-2010", "Would be the most significant BTC event in history if moved"],
    externalUrl: "https://bitslog.com/2013/04/17/the-well-deserved-fortune-of-satoshi-nakamoto/",
  },
  {
    id: "006",
    slug: "mt-gox-hacker-1feex",
    title: "The Mt. Gox Hacker — 79,957 BTC Untouched",
    address: "1FeexV6bAHb8ybZjqQMjJrcCrHGW9sb6uF",
    entity: "Unknown (2011 Mt. Gox hack attacker)",
    btc: "~79,957",
    category: "seizure",
    status: "dormant",
    added: "2026-04-01",
    hook: "In March 2011, an attacker drained 80,000 BTC from Mt. Gox. The funds landed in this address and have never moved. It's the biggest untouched heist wallet in Bitcoin history.",
    summary: "One of the earliest and largest Bitcoin thefts ever recorded. On March 1, 2011, an attacker compromised a Mt. Gox auditor account and transferred 79,957.2 BTC into this single address. Nothing has ever been sent out — not a single satoshi in 15 years. The attacker is still unknown. At current prices, the dormant balance is worth over $5 billion.",
    narrative: `In March 2011, Mt. Gox was the dominant Bitcoin exchange — handling most of the world's trading volume. The compromise started when an attacker obtained access to an auditor's account. Within a short window, 79,957.2 BTC was transferred out of Mt. Gox's operational wallets into a single address: 1FeexV6bAHb8ybZjqQMjJrcCrHGW9sb6uF.

At the time, those coins were worth roughly $875,000. Today, the same balance is worth more than $5 billion.

What makes this wallet extraordinary is what hasn't happened. In 15 years, the attacker has not sent a single satoshi out. No consolidations. No test transactions. No mixing attempts. No exchanges. The wallet has only ever received — including small taunting amounts sent by onlookers over the years — and has never sent.

From a privacy perspective, this is the most effective strategy available to a thief: do nothing. Moving stolen coins creates forensic opportunities. Chainalysis, CipherTrace, and every major blockchain analytics firm have had this wallet tagged and watched since 2011. Any outbound transaction would be flagged instantly, traced to exchanges, and likely lead to prosecution — especially under modern KYC regimes.

Mt. Gox itself survived this 2011 incident but ultimately collapsed in 2014 after a separate, much larger loss. This specific theft was considered one of several early signs that the exchange's security practices were inadequate. The attacker, whoever they were, saw no path to spending the coins safely — so they chose to simply hold.

Whether those coins will ever move is one of the longest-running open questions in Bitcoin. Every few years, a tiny dust transaction to the address triggers a market reaction. But the 79,957 BTC itself has not moved since March 1, 2011.`,
    thread: [
      "On March 1, 2011, someone stole 80,000 BTC from Mt. Gox — then put it in this address and never touched it again. 15 years of silence. $5 billion sitting there. Here's the full on-chain story 🧵",
      "The attack: compromised an auditor's account, transferred 79,957.2 BTC in a single move. Worth $875,000 at the time. Worth $5+ billion now. It was one of the largest Bitcoin thefts ever recorded.",
      "What makes this forensically unique: in 15 years, not one satoshi has left this address. No test tx. No consolidations. No mixing attempts. The wallet has only ever RECEIVED — including taunting dust sent by onlookers over the years.",
      "The privacy lesson: for a thief, the most effective strategy is often to do absolutely nothing. Any movement would be traced instantly — Chainalysis has had this wallet flagged since 2011. Moving would trigger alerts at every major exchange.",
      "The attacker made a choice: billions sitting in an address they can never spend safely, or millions in prison. They chose billions. The coins are still there. Still watched. Still untouched. anonscore.com/?scan=1FeexV6bAHb8ybZjqQMjJrcCrHGW9sb6uF",
    ],
    tags: ["#Bitcoin", "#MtGox", "#Forensics", "#Privacy"],
    notable: ["79,957 BTC stolen on March 1, 2011", "Never sent anything out — 15 years dormant", "Worth $5+ billion at current prices", "Attacker identity never established"],
    externalUrl: "https://bitcointalk.org/index.php?topic=5464048.0",
  },
];


