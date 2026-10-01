import "./shell.js";
import { FACES, factionById, ITEMS, TIER_COLOR } from "./data.js";
import { esc, fmt } from "./util.js";

const grid = document.getElementById("grid");
const count = document.getElementById("result-count");
const form = document.getElementById("filters");
const modal = document.getElementById("modal");
const modalBody = document.getElementById("modal-body");
let lastFocus = null;
let lastRenderKey = "";

function rangeValue(minId, maxId) {
  const min = Number(document.getElementById(minId).value);
  const max = Number(document.getElementById(maxId).value);
  return [Math.min(min, max), Math.max(min, max)];
}

function filtered() {
  const collection = form.collection.value;
  const tier = form.tier.value;
  const faction = form.faction.value;
  const q = form.q.value.trim().toLowerCase();
  const [memMin, memMax] = rangeValue("mem-min", "mem-max");
  const [stubMin, stubMax] = rangeValue("stub-min", "stub-max");
  document.getElementById("mem-label").textContent = `${memMin}-${memMax}`;
  document.getElementById("stub-label").textContent = `${stubMin}-${stubMax}`;
  return ITEMS.filter((item) => {
    if (collection !== "all" && item.collection !== collection) return false;
    if (tier !== "all" && item.tier !== tier) return false;
    if (faction !== "all" && item.faction !== faction) return false;
    if (item.memory < memMin || item.memory > memMax) return false;
    if (item.stub < stubMin || item.stub > stubMax) return false;
    if (!q) return true;
    const factionName = factionById(item.faction).name.toLowerCase();
    const hay = `${item.name} ${item.collection} ${item.chain} ${item.tier} ${factionName} ${item.serial}`.toLowerCase();
    return hay.includes(q);
  });
}

function render() {
  const items = filtered();
  const key = `${items.map((item) => item.id).join(",")}|${form.q.value}`;
  count.textContent = `${fmt(items.length)} of ${fmt(ITEMS.length)} sample items`;
  if (key === lastRenderKey) return;
  lastRenderKey = key;
  if (!items.length) {
    grid.innerHTML = `<div class="empty panel">
      <img src="${FACES.cry}" alt="">
      <p>No matches in the sample set.</p>
    </div>`;
    return;
  }
  grid.innerHTML = items.map((item) => {
    const faction = factionById(item.faction);
    return `<button type="button" class="item-card" data-id="${item.id}" style="--faction:${faction.color};--tier:${TIER_COLOR[item.tier]}">
      <img class="icon" src="${faction.icon}" alt="">
      <p class="tier">${esc(item.tier)}</p>
      <h3>${esc(item.name)}</h3>
      <p class="fine">${esc(item.collection)} · ${esc(item.chain)}<br>${esc(faction.name)} · stub ${item.stub}</p>
    </button>`;
  }).join("");
}

function openItem(id) {
  const item = ITEMS.find((entry) => entry.id === id);
  if (!item) return;
  const faction = factionById(item.faction);
  lastFocus = document.activeElement;
  modalBody.innerHTML = `
    <p><span class="sample-pill">Sample</span></p>
    <img class="portrait" src="${faction.head}" alt="${esc(faction.name)} portrait">
    <h2 id="modal-title">${esc(item.name)}</h2>
    <dl class="traits">
      <dt>Collection</dt><dd>${esc(item.collection)} · ${esc(item.chain)}</dd>
      <dt>Tier</dt><dd>${esc(item.tier)}</dd>
      <dt>Faction</dt><dd>${esc(faction.name)}</dd>
      <dt>Memory</dt><dd>${item.memory}</dd>
      <dt>Serial</dt><dd>${item.serial}</dd>
      <dt>Stub level</dt><dd>${item.stub} / 60</dd>
    </dl>
    <p class="fine">Sample item. Not a live token.</p>`;
  modal.hidden = false;
  document.body.classList.add("modal-open");
  modal.querySelector(".modal-close").focus();
}

function closeModal() {
  if (modal.hidden) return;
  modal.hidden = true;
  document.body.classList.remove("modal-open");
  if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
}

form.addEventListener("submit", (event) => event.preventDefault());
form.addEventListener("input", render);
form.addEventListener("change", render);
document.getElementById("reset-filters").addEventListener("click", () => {
  form.reset();
  render();
});

grid.addEventListener("click", (event) => {
  const card = event.target.closest("[data-id]");
  if (card) openItem(card.dataset.id);
});

modal.addEventListener("click", (event) => {
  if (event.target === modal) closeModal();
});
modal.querySelector(".modal-close").addEventListener("click", closeModal);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeModal();
});

render();
