import "./shell.js";
import { ART } from "./art.js";
import { factionById, standings } from "./data.js";
import { holderBoard, medalForRank } from "./club.js";
import { esc, fmt } from "./util.js";

const week = standings(6)[0];
const leader = factionById(week.id);
const rows = holderBoard();

document.getElementById("season-pointer").innerHTML = `
  <p class="kicker">Not this table</p>
  <h2>Faction Wars is activity</h2>
  <p>${esc(leader.name)} leads week 6 with ${fmt(week.total)} sample activity points. That season board does not sort wallets by how many tokens they hold.</p>
  <div class="row-actions">
    <a class="pixel-btn" href="factions.html#board">Season board</a>
    <a class="pixel-btn alt" href="badges.html">Badges</a>
  </div>`;

const stubs = document.createElement("figure");
stubs.className = "panel shot-solo";
stubs.innerHTML = `<img src="${ART.shots.stubs}" alt="In-game stubs leaderboard"><figcaption>In-game stubs board. Separate from the sample holder board below.</figcaption>`;
document.getElementById("board").before(stubs);

document.getElementById("board").innerHTML = `
  <div class="board-scroll">
    <div class="board-row board-head" aria-hidden="true">
      <span>Rank</span><span>Wallet</span><span>Pieces</span><span>GLHF</span><span>ROM</span><span>Tier</span>
    </div>
    <ol class="board-list">
      ${rows.map((row) => `<li class="board-row${row.demo ? " is-demo" : ""}">
        <span class="rank-cell"><img class="medal" src="${medalForRank(row.rank)}" alt=""> #${row.rank}</span>
        <span><b>${esc(row.handle)}</b><br><span class="mono">${esc(row.address)}</span>${row.demo ? " · this demo wallet" : ""}</span>
        <span>${fmt(row.total)}</span>
        <span>${fmt(row.glhf)}</span>
        <span>${fmt(row.rom)}</span>
        <span>${esc(row.tier.name)}</span>
      </li>`).join("")}
    </ol>
  </div>
  <p class="fine">Holding tiers: Holder under 6, Keeper from 6, Stack from 15, Vault from 80, Archive from 400. No sample wallet on this board reaches Archive.</p>`;
