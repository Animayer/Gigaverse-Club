export function esc(value) {
  return String(value).replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[ch]));
}

export function fmt(n) {
  return Number(n).toLocaleString("en-US");
}

export function readStore(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw == null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function writeStore(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* demo storage can be blocked; the page still works */
  }
}

export function pixelSafe(value, max = 16) {
  const clean = String(value).replace(/[^a-zA-Z0-9 !#$%'()+,\-./:;<=>?\[\\\]^_`|~]/g, "");
  const trimmed = clean.trim().slice(0, max);
  return trimmed || "noob";
}
