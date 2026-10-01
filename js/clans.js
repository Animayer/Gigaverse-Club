import "./shell.js";
import { playSuccess } from "./shell.js";
import { CLANS, clanById, factionMix } from "./club.js";
import { esc, fmt, readStore, writeStore } from "./util.js";

const JOIN_KEY = "glhf-clan-join";
const joined = new Set(readStore(JOIN_KEY, []));
const grid = document.getElementById("clan-grid");
const modal = document.getElementById("modal");
const modalBody = document.getElementById("modal-body");
let lastFocus = null;

function isMember(clan) {
  return clan.demoMember || joined.has(clan.id);
}

function card(clan) {
  return `<button type="button" class="clan-card card" data-id="${esc(clan.id)}">
    <img src="${esc(clan.art)}" alt="">
    <span>
      <strong>${esc(clan.name)}</strong>
      <span class="fine">${esc(clan.focus)} · ${fmt(clan.members)} sample members</span>
      ${isMember(clan) ? `<span class="sample-pill">Sample member</span>` : ""}
    </span>
  </button>`;
}

function renderGrid() {
  grid.innerHTML = CLANS.map(card).join("");
}

function mixHtml(clan) {
  const rows = factionMix(clan.mix);
  const max = Math.max(...rows.map((row) => row.count), 1);
  return rows.map((row) => {
    const pct = Math.round((row.count / max) * 100);
    return `<div class="dist-row">
      <span><img class="ficon" src="${esc(row.faction.icon)}" alt=""> ${esc(row.faction.name)}</span>
      <span class="bar"><span style="width:${pct}%"></span></span>
      <span>${fmt(row.count)}</span>
    </div>`;
  }).join("");
}

function openClan(id) {
  const clan = clanById(id);
  if (!clan) return;
  lastFocus = document.activeElement;
  const member = isMember(clan);
  modalBody.innerHTML = `
    <p><span class="sample-pill">Sample</span></p>
    <img class="portrait" src="${esc(clan.art)}" alt="">
    <h2 id="modal-title">${esc(clan.name)}</h2>
    <p>${esc(clan.blurb)}</p>
    <p class="fine">${fmt(clan.members)} sample members · ${esc(clan.focus)}</p>
    <h3>Lore factions in the roster</h3>
    <p class="fine">A mix, not a hall. These counts are sample.</p>
    ${mixHtml(clan)}
    <h3>Sample roster</h3>
    <ul class="roster">
      ${clan.roster.map(([name, address, faction]) => `<li><b>${esc(name)}</b> <span class="mono">${esc(address)}</span> <span class="fine">${esc(faction)}</span></li>`).join("")}
    </ul>
    <div class="row-actions">
      <button type="button" class="pixel-btn" id="join-clan" ${member ? "disabled" : ""}>${member ? "Already a sample member" : "Join (demo)"}</button>
    </div>
    <p id="join-note" class="fine">${member && clan.demoMember ? "The demo wallet is already on this roster." : "Joining saves in this browser only. It does not create a membership."}</p>`;
  modal.hidden = false;
  document.body.classList.add("modal-open");
  modal.querySelector(".modal-close").focus();
  document.getElementById("join-clan").addEventListener("click", () => {
    if (isMember(clan)) return;
    joined.add(clan.id);
    writeStore(JOIN_KEY, [...joined]);
    const note = document.getElementById("join-note");
    const button = document.getElementById("join-clan");
    button.disabled = true;
    button.textContent = "Already a sample member";
    note.textContent = "Saved in this browser. Sample only. This does not join a live guild.";
    renderGrid();
    playSuccess();
  });
}

function closeModal() {
  if (modal.hidden) return;
  modal.hidden = true;
  document.body.classList.remove("modal-open");
  if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
}

grid.addEventListener("click", (event) => {
  const cardHit = event.target.closest("[data-id]");
  if (cardHit) openClan(cardHit.dataset.id);
});
modal.addEventListener("click", (event) => {
  if (event.target === modal) closeModal();
});
modal.querySelector(".modal-close").addEventListener("click", closeModal);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeModal();
});

renderGrid();
