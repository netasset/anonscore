
/* Privacy relay ────────────────────────────────────────────────────
   Lookups go through the AnonScore relay (a stateless, no-log Cloudflare
   Worker — source in workers/relay/) so the explorer sees the relay's IP
   instead of the visitor's. Default ON. One click turns it off for anyone
   who would rather the address never touch AnonScore infrastructure; that
   choice is saved and then wins over the default. Leave RELAY_URL "" and
   the toggle stays hidden. The relay origin must stay in _headers connect-src. */
const RELAY_URL = "https://anonscore-relay.netassetpremium.workers.dev";
// Default ON: the average visitor gets IP↔address unlinkability out of the box,
// and the relay is verifiably no-log (open source, stateless, observability
// pinned off). The toggle stays one click away for anyone who prefers their
// address to touch no AnonScore infrastructure at all — an explicit choice is
// saved either way and wins over the default forever after.
let _relay = (() => { try { const s = localStorage.getItem("anonscore_relay"); return s === null ? true : s === "1"; } catch { return true; } })();
const _relayListeners = new Set();
function setRelay(on) {
  _relay = !!on;
  try { localStorage.setItem("anonscore_relay", _relay ? "1" : "0"); } catch {}
  _relayListeners.forEach(fn => fn());
}
function relayOn() { return !!RELAY_URL && _relay; }
function useRelay() {
  const [, force] = useState(0);
  useEffect(() => {
    const fn = () => force(x => x + 1);
    _relayListeners.add(fn);
    return () => { _relayListeners.delete(fn); };
  }, []);
  return _relay;
}

