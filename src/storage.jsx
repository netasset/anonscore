const HISTORY_KEY = "anonscore_history_v1";
const getHistory = () => { try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]"); } catch { return []; } };
const addToHistory = (entry) => {
  try {
    const h = getHistory().filter(e => e.addr !== entry.addr);
    h.unshift(entry);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(h.slice(0, 5)));
  } catch {}
};
const removeFromHistory = (addr) => {
  try { localStorage.setItem(HISTORY_KEY, JSON.stringify(getHistory().filter(e => e.addr !== addr))); } catch {}
};
const clearAllHistory = () => { try { localStorage.removeItem(HISTORY_KEY); } catch {} };

const FIXES_KEY = "anonscore_fixes_v1";
const getDoneFixes  = (addr) => { try { return new Set(JSON.parse(localStorage.getItem(FIXES_KEY + ":" + addr) || "[]")); } catch { return new Set(); } };
const saveDoneFixes = (addr, set) => { try { localStorage.setItem(FIXES_KEY + ":" + addr, JSON.stringify([...set])); } catch {} };

