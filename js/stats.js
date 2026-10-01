import "./shell.js";
import { ART } from "./art.js";
import {
  BASE_BURN,
  ORIGINAL_SUPPLY,
  ROM_SUPPLY,
} from "./data.js";
import {
  baseTraitRows,
  boardShares,
  BOTH_HOLDERS,
  circulatingSupply,
  glhfDistribution,
  glhfHolders,
  romDistribution,
  ROM_HOLDERS,
  SNAPSHOT_DATE,
} from "./club.js";
import { esc, fmt } from "./util.js";

const ROM_TIERS = [
  ["Silver", 5800],
  ["Gold", 3200],
  ["Void", 850],
  ["Giga", 150],
];

function bars(rows) {
  const max = Math.max(...rows.map((row) => row.value), 1);
  return rows.map((row) => {
    const pct = Math.max(4, Math.round((row.value / max) * 100));
    return `<div class="dist-row">
      <span>${esc(row.label)}</span>
      <span class="bar" role="img" aria-label="${esc(row.label)} ${esc(row.valueLabel)}"><span style="width:${pct}%"></span></span>
      <span>${esc(row.valueLabel)}</span>
    </div>`;
  }).join("");
}

function collectionBlock({ id, name, chain, supplyHtml, holders, avg, extra }) {
  return `<section class="panel" id="${id}">
    <h2>${esc(name)}</h2>
    <p class="fine">${esc(chain)}</p>
    ${extra || ""}
    <ul class="stat-list">
      <li><span>Supply</span><strong>${supplyHtml}</strong></li>
      <li><span>Holders</span><strong>${fmt(holders)} <span class="sample-pill">sample</span></strong></li>
      <li><span>Average held</span><strong>${avg} <span class="sample-pill">sample</span></strong></li>
    </ul>
  </section>`;
}

const shares = boardShares();
const circulating = circulatingSupply();
const glhfAvg = (circulating / glhfHolders()).toFixed(1);
const romAvg = (ROM_SUPPLY / ROM_HOLDERS).toFixed(1);
const traits = baseTraitRows();

document.getElementById("stats").innerHTML = `
  <p class="fine">Figures for the ${esc(SNAPSHOT_DATE)} sample snapshot, aligned with the demo wallet ${esc("0xDEMO…GLHF")}. Holder count for GLHFers matches the collection-health panel.</p>
  <figure class="shot-solo">
    <img src="${ART.shots.inventory}" alt="Inventory screen">
    <figcaption>Inventory in the client. Holder counts on this page are sample. ROM supply and the tier mix are the published figures.</figcaption>
  </figure>
  <div class="split">
    ${collectionBlock({
      id: "glhfers",
      name: "GLHFers",
      chain: "Ethereum",
      holders: glhfHolders(),
      avg: glhfAvg,
      supplyHtml: `${fmt(circulating)} circulating`,
      extra: `<p>Minted <b>${fmt(ORIGINAL_SUPPLY)}</b>. Sample burn baseline <b>${fmt(BASE_BURN)}</b>. Circulating is minted minus that baseline.</p>`,
    })}
    ${collectionBlock({
      id: "roms",
      name: "ROMs",
      chain: "Abstract",
      holders: ROM_HOLDERS,
      avg: romAvg,
      supplyHtml: `${fmt(ROM_SUPPLY)}`,
      extra: `<div class="tier-art compact">${ROM_TIERS.map(([name, count]) => `<figure><img src="${ART.romTiers[name]}" alt="${esc(name)} ROM"><figcaption>${esc(name)} ${fmt(count)}</figcaption></figure>`).join("")}</div>`,
    })}
  </div>
  <section class="panel" id="spread">
    <h2>Holdings distribution</h2>
    <p class="fine">How many sample wallets hold how many pieces. Not a price chart.</p>
    <h3>GLHFers</h3>
    ${bars(glhfDistribution().map((row) => ({ label: row.label, value: row.holders, valueLabel: fmt(row.holders) })))}
    <h3>ROMs</h3>
    ${bars(romDistribution().map((row) => ({ label: row.label, value: row.holders, valueLabel: fmt(row.holders) })))}
  </section>
  <section class="panel" id="overlaps">
    <h2>Overlap</h2>
    <div class="stat-row">
      <article class="panel stat"><b>${fmt(BOTH_HOLDERS)}</b> wallets hold both <span class="sample-pill">sample</span></article>
      <article class="panel stat"><b>${shares.glhfPct.toFixed(1)}%</b> of circulating GLHFers in the top 10 board rows <span class="sample-pill">sample</span></article>
      <article class="panel stat"><b>${shares.romPct.toFixed(1)}%</b> of ROM supply in those same rows <span class="sample-pill">sample</span></article>
    </div>
    <p class="fine">Top 10 on the <a href="leaderboard.html">holder board</a> account for ${fmt(shares.glhf)} GLHFers and ${fmt(shares.rom)} ROMs. That board is a 16-wallet sample, not every holder.</p>
  </section>
  <section class="panel" id="bases">
    <h2>GLHFer Base traits</h2>
    <p class="fine">Base names that appear on the 48 GLHFers in this OpenSea slice, rarest in the slice first. Not a full-collection rarity chart, and not the minted supply of 3,690. Lit emblems for the demo wallet are on the loadout.</p>
    ${bars(traits.map((row) => ({ label: row.name, value: row.count, valueLabel: fmt(row.count) })))}
  </section>`;
