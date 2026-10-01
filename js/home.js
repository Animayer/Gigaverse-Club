import "./shell.js";
import { ART, itemSprite } from "./art.js";
import { factionById, MEDALS, RANK_MEDAL, standings, TIER_COLOR } from "./data.js";
import { demoProfile } from "./club.js";
import { esc, fmt } from "./util.js";
import { onBurn } from "./pulse.js";
import { ORIGINAL_SUPPLY } from "./data.js";
import { mountHealth } from "./health.js";

mountHealth(document.getElementById("health"));

const rows = standings(6);
const leader = factionById(rows[0].id);
const eventCopy = document.getElementById("event-copy");
if (eventCopy) {
  eventCopy.textContent = `${leader.name} leads the sample board with ${fmt(rows[0].total)} activity points. Open Faction Wars to move the week, the relic, and the map.`;
}

const list = document.getElementById("standings");
if (list) {
  list.innerHTML = rows.map((row, index) => {
    const faction = factionById(row.id);
    const medal = RANK_MEDAL[index];
    const medalHtml = medal
      ? `<img class="medal" src="${MEDALS[medal]}" alt="">`
      : `<span class="rank-num" aria-hidden="true">#</span>`;
    return `<a class="standing-row card" href="factions.html#${faction.id}">
      ${medalHtml}
      <span class="rank-num">${index + 1}</span>
      <span class="faction-cell"><img class="ficon" src="${faction.icon}" alt=""> ${esc(faction.name)}</span>
      <strong>${fmt(row.total)}</strong>
    </a>`;
  }).join("");
}

const profile = demoProfile();
const scoreEl = document.getElementById("home-score");
const slotsEl = document.getElementById("home-slots");
if (scoreEl) {
  scoreEl.textContent = `Collector score ${fmt(profile.total)} / 100. ${fmt(profile.glhf.length)} GLHFers and ${fmt(profile.roms.length)} ROMs. ${profile.tier.name} holding tier. Sample.`;
}
if (slotsEl) {
  slotsEl.innerHTML = profile.slots.map((item) => {
    const faction = factionById(item.faction);
    const src = itemSprite(item, faction);
    const klass = item.collection === "ROMs" ? "rom-chip" : "glhfer";
    const label = item.special ? "Special 1/1" : item.collection === "ROMs" ? item.tier : (item.base || "GLHFer");
    return `<a class="party-slot" href="loadout.html">
      <img class="${klass}" src="${esc(src)}" alt="">
      <strong>${esc(item.name)}</strong>
      <span class="fine" style="color:${TIER_COLOR[item.tier] || "var(--gold)"}">${esc(label)}</span>
    </a>`;
  }).join("");
}

const preview = document.getElementById("game-preview");
if (preview) {
  const shots = [
    ["lobby", "Lobby"],
    ["dungeon", "Dungeon"],
    ["roms", "Giga ROMs"],
    ["juice", "Giga Juice"],
    ["inventory", "Inventory"],
    ["market", "GigaMarket"],
    ["workbench", "Workbench"],
    ["alchemy", "Alchemy"],
    ["merchant", "Traveling merchant"],
  ];
  preview.innerHTML = `
    <div class="preview-head">
      <div>
        <p class="kicker">Official stills</p>
        <h2>Game preview</h2>
        <p class="fine">Downscaled screenshots from the Gigaverse client. The in-game stubs board is separate from the sample holder board.</p>
      </div>
      <img class="watch" src="${ART.gigusWatch}" alt="Gigus watching">
    </div>
    <div class="shot-grid">
      ${shots.map(([key, label]) => `<figure>
        <img src="${ART.shots[key]}" alt="${label}">
        <figcaption>${label}</figcaption>
      </figure>`).join("")}
    </div>`;
}

const burnEl = document.getElementById("burn-num");
const pulseEl = document.getElementById("pulse-num");
const supplyEl = document.getElementById("supply-num");

onBurn((value, extra) => {
  if (burnEl) {
    burnEl.textContent = fmt(value);
    burnEl.classList.remove("tick");
    void burnEl.offsetWidth;
    burnEl.classList.add("tick");
  }
  if (pulseEl) pulseEl.textContent = `+${fmt(extra)} sample burns this session`;
  if (supplyEl) supplyEl.textContent = fmt(ORIGINAL_SUPPLY - value);
});
