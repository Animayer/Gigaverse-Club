import "./shell.js";
import { BASE_BURN, BURN_SERIES, ITEMS, ORIGINAL_SUPPLY, RECENT_BURNS } from "./data.js";
import { esc, fmt } from "./util.js";
import { onBurn } from "./pulse.js";
import { mountHealth } from "./health.js";

mountHealth(document.getElementById("health"));

const strip = document.getElementById("glhfer-strip");
if (strip) {
  strip.innerHTML = ITEMS.filter((item) => item.collection === "GLHFers" && !item.special).slice(0, 8).map((item) =>
    `<a href="${item.openseaUrl}" target="_blank" rel="noopener noreferrer"><img src="${item.image}" alt="${esc(item.name)}"></a>`).join("");
}

const baseline = document.getElementById("burn-baseline");
const pulse = document.getElementById("burn-pulse");
const shown = document.getElementById("burn-shown");
const supply = document.getElementById("burn-supply");

if (baseline) baseline.textContent = fmt(BASE_BURN);

onBurn((value, extra) => {
  if (pulse) pulse.textContent = `+${fmt(extra)}`;
  if (shown) shown.textContent = fmt(value);
  if (supply) supply.textContent = fmt(ORIGINAL_SUPPLY - value);
});

function chart() {
  const w = 720;
  const h = 320;
  const pad = 42;
  const max = 460;
  const coords = BURN_SERIES.map(([, burned], index) => {
    const x = pad + (index / (BURN_SERIES.length - 1)) * (w - pad * 2);
    const y = h - pad - (burned / max) * (h - pad * 2);
    return [x, y, burned];
  });
  const line = coords.map(([x, y]) => `${x},${y}`).join(" ");
  const area = `${pad},${h - pad} ${line} ${coords[coords.length - 1][0]},${h - pad}`;
  const dots = coords.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4" fill="#ffd15a"></circle>`).join("");
  const yLabels = [0, 140, 280, 420].map((tick) => {
    const y = h - pad - (tick / max) * (h - pad * 2);
    return `<text x="4" y="${y + 4}" fill="#cbbddd" font-size="12" font-family="Trebuchet MS, sans-serif">${tick}</text>
      <line x1="${pad}" y1="${y}" x2="${w - pad}" y2="${y}" stroke="#3c2a62" stroke-width="1"></line>`;
  }).join("");
  const xLabels = BURN_SERIES.map(([label], index) => {
    if (index % 3 !== 0 && index !== BURN_SERIES.length - 1) return "";
    const x = pad + (index / (BURN_SERIES.length - 1)) * (w - pad * 2);
    return `<text x="${x}" y="${h - 12}" fill="#cbbddd" font-size="12" text-anchor="middle" font-family="Trebuchet MS, sans-serif">${label.slice(2)}</text>`;
  }).join("");
  document.getElementById("burn-chart").innerHTML = `
    <svg class="chart" viewBox="0 0 ${w} ${h}" role="img" aria-label="Sample cumulative GLHFers burned, ending at 420">
      <rect width="${w}" height="${h}" fill="#07040f"></rect>
      ${yLabels}
      <polygon points="${area}" fill="rgba(255, 209, 90, 0.25)"></polygon>
      <polyline points="${line}" fill="none" stroke="#5dffe8" stroke-width="3"></polyline>
      ${dots}
      ${xLabels}
    </svg>`;
}

document.getElementById("burn-table").innerHTML = RECENT_BURNS.map(([when, token, tx, note]) => `
  <tr>
    <td>${esc(when)}</td>
    <td>${esc(token)}</td>
    <td>${esc(tx)}</td>
    <td>${esc(note)}</td>
  </tr>`).join("");

chart();
