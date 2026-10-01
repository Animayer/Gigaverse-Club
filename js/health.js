import { fmt } from "./util.js";

export const HEALTH = {
  listedPct: 18,
  holders: 2410,
  holdDays: 214,
  listings: [42, 39, 44, 37, 33, 36, 31, 28],
};

function sparkline(series) {
  const w = 640;
  const h = 88;
  const max = Math.max(...series);
  const min = Math.min(...series);
  const span = Math.max(1, max - min);
  const coords = series.map((n, index) => {
    const x = 16 + (index / (series.length - 1)) * (w - 32);
    const y = h - 16 - ((n - min) / span) * (h - 32);
    return [x, y];
  });
  const line = coords.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const last = coords[coords.length - 1];
  const dots = coords.map(([x, y], index) => {
    const label = index === coords.length - 1 || index === coords.length - 2 ? series[index] : "";
    return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.5" fill="#5dffe8"></circle>${label ? `<text x="${x.toFixed(1)}" y="${Math.max(14, y - 8).toFixed(1)}" fill="#f6f1e6" font-size="12" text-anchor="middle" font-family="Trebuchet MS, sans-serif">${label}</text>` : ""}`;
  }).join("");
  return `<svg class="spark" viewBox="0 0 ${w} ${h}" role="img" aria-label="Sample listings over eight weeks, ending at ${series[series.length - 1]}">
    <rect width="${w}" height="${h}" fill="#07040f"></rect>
    <polyline points="${line}" fill="none" stroke="#ffd15a" stroke-width="3"></polyline>
    ${dots}
    <circle cx="${last[0].toFixed(1)}" cy="${last[1].toFixed(1)}" r="5" fill="#ff4fd8"></circle>
  </svg>`;
}

export function healthMarkup() {
  const series = HEALTH.listings;
  const latest = series[series.length - 1];
  const prior = series[series.length - 2];
  const delta = latest - prior;
  const direction = delta < 0 ? "fewer listings than last week" : delta > 0 ? "more listings than last week" : "the same listing count as last week";
  return `
    <p class="kicker">Collection health</p>
    <h2>Holder conviction</h2>
    <p>Sample read of how the collection sits with holders. These figures are not prices and not contract data.</p>
    <div class="health-metrics">
      <article class="panel stat"><b>${HEALTH.listedPct}<span class="plain">%</span></b> listed <span class="sample-pill">sample</span></article>
      <article class="panel stat"><b>${fmt(HEALTH.holders)}</b> unique holders <span class="sample-pill">sample</span></article>
      <article class="panel stat"><b>${fmt(HEALTH.holdDays)}</b> avg hold, days <span class="sample-pill">sample</span></article>
      <article class="panel stat"><b>${latest}</b> listings this week <span class="sample-pill">sample</span></article>
    </div>
    <p class="fine">Listings versus last week: ${latest} now, ${prior} last week (${direction}). A lower listing count is framed here as holders keeping tokens.</p>
    ${sparkline(series)}
    <p class="fine">Eight sample weeks. Unverified. Not a price chart.</p>`;
}

export function mountHealth(root) {
  if (!root) return;
  root.innerHTML = healthMarkup();
}
