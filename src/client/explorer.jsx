/* BTC block-explorer choice ──────────────────────────────────────────
   Both upstreams speak the same esplora API, so they're drop-in swaps —
   direct or through the relay (which mirrors them at /btc and /btcm).
   Lightning data always comes from mempool.space's LN endpoints. */
const EXPLORERS = {
  blockstream: { label: "blockstream.info", api: "https://blockstream.info/api", relayPath: "/btc" },
  mempool:     { label: "mempool.space",    api: "https://mempool.space/api",    relayPath: "/btcm" },
};
let _explorer = (() => { try { const s = localStorage.getItem("anonscore_explorer"); return EXPLORERS[s] ? s : "blockstream"; } catch { return "blockstream"; } })();
const _explorerListeners = new Set();
function setExplorer(id) {
  if (!EXPLORERS[id]) return;
  _explorer = id;
  try { localStorage.setItem("anonscore_explorer", id); } catch {}
  _explorerListeners.forEach(fn => fn());
}
function explorer() { return EXPLORERS[_explorer]; }
function useExplorer() {
  const [, force] = useState(0);
  useEffect(() => {
    const fn = () => force(x => x + 1);
    _explorerListeners.add(fn);
    return () => { _explorerListeners.delete(fn); };
  }, []);
  return _explorer;
}

