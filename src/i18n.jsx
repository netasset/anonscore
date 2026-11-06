/* ─────────────────────────────────────────────
   i18n — minimal, dependency-free.
   English is the default and the fallback for every key, so partial
   translations degrade gracefully (an untranslated string just renders
   in English). Locale is chosen by, in order: ?lang= param → saved
   preference → browser language → "en". Adding a locale = add its key
   map below; adding a string = add an "en" entry and reference it via t().
   Spanish first: large, active Spanish-speaking Bitcoin communities
   (Argentina, Venezuela, El Salvador, Spain, and beyond).
───────────────────────────────────────────── */
const STRINGS = {
  en: {
    "nav.free": "Free",
    "nav.nocookies": "✓ No cookies",
    "nav.nothingstored": "✓ Nothing stored",
    "nav.tor": "✓ Tor compatible",
    "nav.opensource": "✓ Open source",
    "umbrella.label": "TOOLKIT",
    "umbrella.privacy": "Privacy Audit",
    "umbrella.dca": "DCA Butler",
    "umbrella.intel": "BTChub",
    "umbrella.hub": "Hub",
    "hero.eyebrow": "FREE BITCOIN & LIGHTNING PRIVACY AUDIT",
    "hero.h1.line1": "Is your Bitcoin",
    "hero.h1.line2": "stack leaking?",
    "hero.h1.em": "Find out in 60 seconds.",
    "hero.sub": "Paste an address. Get a score from 0–100 and the fix that moves it most. It runs in your browser. Nothing is stored.",
    "spectrum.low": "0 · Fully traceable",
    "spectrum.avg": "typical wallet: ~38",
    "spectrum.high": "100 · Invisible",
    "trust.btc": "₿ Addresses are public by design — we never see or store yours. The relay decides whether the explorer can see your IP too.",
    "trust.ln": "⚡ Node pubkeys are public on the gossip network — we never see or store yours. The relay decides whether mempool.space can see your IP too.",
    "relay.on.label": "Privacy relay on",
    "relay.off.label": "Privacy relay off",
    "relay.on.body": " — your IP stays hidden behind our open-source, no-log relay. The explorer ({x}) sees only the address.",
    "relay.off.body": " — lookups go straight to {x}, which sees your IP next to the address. Flip the relay on to break that link.",
    "relay.verify": "verify: relay source ↗",
    "relay.explorer": "EXPLORER",
    "relay.aria": "Route lookups through the AnonScore privacy relay to hide your IP from the block explorer",
    "rail.title": "GUARANTEES",
    "rail.foot": "Each one links to the code that proves it.",
    "open.title": "RADICALLY OPEN",
    "open.h2.pre": "Don't trust.",
    "open.h2.em": "Verify.",
    "recent.note": "Saved only in this browser's local storage — gone when you hit CLEAR ALL or clear this site's data in your browser. (Note: clearing browsing history alone doesn't remove site data.)",
    "recent.clear": "CLEAR ALL",
    // Guarantee labels (rail + trust box header chips). Keep in sync with GUARANTEES[].label.
    "g.0.label": "No server, no backend",
    "g.1.label": "Nothing stored or logged",
    "g.2.label": "Scoring runs in your browser",
    "g.3.label": "Zero third-party requests",
    "g.4.label": "Even the relay can't remember you",
    "g.5.label": "Open source, MIT, auditable in minutes",
    "cta.analyze": "Analyze →",
    "cta.audit": "⚡ Audit →",
    "sample.divider": "or try a sample",
    "sample.risky": "₿ Risky wallet",
    "sample.pristine": "✨ Strong privacy",
    "sample.lightning": "⚡ Lightning node",
    "recent.title": "RECENT SCANS",
    "err.empty": "Please enter a Bitcoin address or Lightning node pubkey.",
    "err.invalid": "That isn't a Bitcoin address or a Lightning node pubkey.",
    "err.lnaddress": "Lightning addresses can't be audited yet — paste your node's 66-character pubkey instead.",
    "finalcta.h2.a": "A typical wallet scores ~38/100.",
    "finalcta.h2.b": "Where does yours land?",
    "finalcta.sub": "Free, open source, nothing stored. Takes 60 seconds.",
    "finalcta.scan": "Analyze an address ↑",
    "finalcta.sample": "▶ See a sample wallet",
    "scanning.btc.title": "Analyzing your wallet…",
    "scanning.ln.title": "Auditing your node…",
    "scanning.btc.checks": "RUNNING 11 CHECKS",
    "scanning.ln.checks": "⚡ RUNNING 8 LIGHTNING CHECKS",
    "scanning.didyouknow": "DID YOU KNOW",
  },
  es: {
    "nav.free": "Gratis",
    "nav.nocookies": "✓ Sin cookies",
    "nav.nothingstored": "✓ Nada se guarda",
    "nav.tor": "✓ Compatible con Tor",
    "nav.opensource": "✓ Código abierto",
    "umbrella.label": "KIT",
    "umbrella.privacy": "Auditoría de privacidad",
    "umbrella.dca": "DCA Butler",
    "umbrella.intel": "BTChub",
    "umbrella.hub": "Hub",
    "hero.eyebrow": "AUDITORÍA GRATUITA DE PRIVACIDAD BITCOIN Y LIGHTNING",
    "hero.h1.line1": "¿Tu stack de Bitcoin",
    "hero.h1.line2": "está filtrando datos?",
    "hero.h1.em": "Descúbrelo en 60 segundos.",
    "hero.sub": "Pega una dirección. Obtén una puntuación de 0 a 100 y la mejora que más la mueve. Corre en tu navegador. Nada se guarda.",
    "spectrum.low": "0 · Totalmente rastreable",
    "spectrum.avg": "billetera típica: ~38",
    "spectrum.high": "100 · Invisible",
    "trust.btc": "₿ Las direcciones son públicas por diseño — nunca vemos ni guardamos la tuya. El relé decide si el explorador también puede ver tu IP.",
    "trust.ln": "⚡ Las claves de nodo son públicas en la red gossip — nunca vemos ni guardamos la tuya. El relé decide si mempool.space también puede ver tu IP.",
    "relay.on.label": "Relé de privacidad activado",
    "relay.off.label": "Relé de privacidad desactivado",
    "relay.on.body": " — tu IP queda oculta tras nuestro relé de código abierto y sin registros. El explorador ({x}) solo ve la dirección.",
    "relay.off.body": " — las consultas van directas a {x}, que ve tu IP junto a la dirección. Activa el relé para romper ese vínculo.",
    "relay.verify": "verificar: código del relé ↗",
    "relay.explorer": "EXPLORADOR",
    "relay.aria": "Enrutar las consultas por el relé de privacidad de AnonScore para ocultar tu IP al explorador de bloques",
    "rail.title": "GARANTÍAS",
    "rail.foot": "Cada una enlaza al código que la demuestra.",
    "open.title": "RADICALMENTE ABIERTO",
    "open.h2.pre": "No confíes.",
    "open.h2.em": "Verifica.",
    "recent.note": "Guardado solo en el almacenamiento local de este navegador — desaparece con BORRAR TODO o al borrar los datos de este sitio en tu navegador. (Nota: borrar solo el historial de navegación no elimina los datos del sitio.)",
    "recent.clear": "BORRAR TODO",
    "g.0.label": "Sin servidor, sin backend",
    "g.1.label": "Nada guardado ni registrado",
    "g.2.label": "El análisis corre en tu navegador",
    "g.3.label": "Cero peticiones a terceros",
    "g.4.label": "Ni el relé puede recordarte",
    "g.5.label": "Código abierto, MIT, auditable en minutos",
    "cta.analyze": "Analizar →",
    "cta.audit": "⚡ Auditar →",
    "sample.divider": "o prueba un ejemplo",
    "sample.risky": "₿ Billetera riesgosa",
    "sample.pristine": "✨ Privacidad fuerte",
    "sample.lightning": "⚡ Nodo Lightning",
    "recent.title": "ESCANEOS RECIENTES",
    "err.empty": "Ingresa una dirección de Bitcoin o la clave pública de un nodo Lightning.",
    "err.invalid": "Eso no es una dirección de Bitcoin ni la clave pública de un nodo Lightning.",
    "err.lnaddress": "Las direcciones Lightning aún no se pueden auditar — pega la clave pública (66 caracteres hex) de tu nodo.",
    "finalcta.h2.a": "Una billetera típica puntúa ~38/100.",
    "finalcta.h2.b": "¿Dónde queda la tuya?",
    "finalcta.sub": "Gratis, código abierto, nada se guarda. Toma 60 segundos.",
    "finalcta.scan": "Analizar una dirección ↑",
    "finalcta.sample": "▶ Ver una billetera de ejemplo",
    "scanning.btc.title": "Analizando tu billetera…",
    "scanning.ln.title": "Auditando tu nodo…",
    "scanning.btc.checks": "EJECUTANDO 11 VERIFICACIONES",
    "scanning.ln.checks": "⚡ EJECUTANDO 8 VERIFICACIONES LIGHTNING",
    "scanning.didyouknow": "¿SABÍAS QUE?",
  },
};
const SUPPORTED_LANGS = Object.keys(STRINGS);
const LANG_LABEL = { en: "EN", es: "ES" };

function detectLang() {
  try {
    const q = new URLSearchParams(window.location.search).get("lang");
    if (q && SUPPORTED_LANGS.includes(q)) return q;
    const saved = localStorage.getItem("anonscore_lang");
    if (saved && SUPPORTED_LANGS.includes(saved)) return saved;
    const nav = (navigator.language || "en").slice(0, 2).toLowerCase();
    if (SUPPORTED_LANGS.includes(nav)) return nav;
  } catch {}
  return "en";
}

let _lang = (typeof window !== "undefined") ? detectLang() : "en";
const _langListeners = new Set();
function setLang(l) {
  if (!SUPPORTED_LANGS.includes(l) || l === _lang) return;
  _lang = l;
  try { localStorage.setItem("anonscore_lang", l); } catch {}
  try { document.documentElement.lang = l; } catch {}
  _langListeners.forEach(fn => fn());
}
function t(key) {
  return (STRINGS[_lang] && STRINGS[_lang][key]) || STRINGS.en[key] || key;
}
// Hook: re-renders the calling component whenever the language changes.
function useLang() {
  const [, force] = useState(0);
  useEffect(() => {
    const fn = () => force(x => x + 1);
    _langListeners.add(fn);
    return () => { _langListeners.delete(fn); };
  }, []);
  return _lang;
}
