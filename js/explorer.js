import "./shell.js";
import { ART, itemPortrait, itemSprite } from "./art.js";
import { FACES, factionById, FACTIONS, ITEMS, TIER_COLOR, VAULT_IDS } from "./data.js";
import { byRarest, PAGE_SIZE } from "./club.js";
import { esc, fmt } from "./util.js";

const grid = document.getElementById("grid");
const count = document.getElementById("result-count");
const form = document.getElementById("filters");
const modal = document.getElementById("modal");
const modalBody = document.getElementById("modal-body");
const pager = document.getElementById("pager");
const vaultIds = new Set(VAULT_IDS);
let lastFocus = null;
let state = readState();

function clamp(value, min, max, fallback) {
  if (value == null || value === "") return fallback;
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, Math.round(n)));
}

function readState() {
  const params = new URLSearchParams(location.search);
  const sort = params.get("sort");
  return {
    collection: ["GLHFers", "ROMs"].includes(params.get("collection")) ? params.get("collection") : "all",
    tier: ["Silver", "Gold", "Void", "Giga"].includes(params.get("tier")) ? params.get("tier") : "all",
    faction: FACTIONS.some((faction) => faction.id === params.get("faction")) ? params.get("faction") : "all",
    q: params.get("q") || "",
    sort: ["rarest", "stub"].includes(sort) ? sort : "serial",
    memMin: clamp(params.get("memMin"), 0, 100, 0),
    memMax: clamp(params.get("memMax"), 0, 100, 100),
    stubMin: clamp(params.get("stubMin"), 1, 60, 1),
    stubMax: clamp(params.get("stubMax"), 1, 60, 60),
    held: params.get("held") === "vault",
    page: Math.max(1, Number.parseInt(params.get("page") || "1", 10) || 1),
  };
}

function writeUrl(mode) {
  const params = new URLSearchParams();
  if (state.collection !== "all") params.set("collection", state.collection);
  if (state.tier !== "all") params.set("tier", state.tier);
  if (state.faction !== "all") params.set("faction", state.faction);
  if (state.q) params.set("q", state.q);
  if (state.sort !== "serial") params.set("sort", state.sort);
  if (state.memMin !== 0) params.set("memMin", String(state.memMin));
  if (state.memMax !== 100) params.set("memMax", String(state.memMax));
  if (state.stubMin !== 1) params.set("stubMin", String(state.stubMin));
  if (state.stubMax !== 60) params.set("stubMax", String(state.stubMax));
  if (state.held) params.set("held", "vault");
  if (state.page > 1) params.set("page", String(state.page));
  const query = params.toString();
  const next = `${location.pathname}${query ? `?${query}` : ""}`;
  const current = `${location.pathname}${location.search}`;
  if (next === current) return;
  if (mode === "push") history.pushState(null, "", next);
  else history.replaceState(null, "", next);
}

function syncForm() {
  form.collection.value = state.collection;
  form.tier.value = state.tier;
  form.faction.value = state.faction;
  form.sort.value = state.sort;
  form.held.value = state.held ? "vault" : "all";
  if (form.q.value !== state.q) form.q.value = state.q;
  document.getElementById("mem-min").value = String(state.memMin);
  document.getElementById("mem-max").value = String(state.memMax);
  document.getElementById("stub-min").value = String(state.stubMin);
  document.getElementById("stub-max").value = String(state.stubMax);
  document.querySelectorAll("[data-faction]").forEach((button) => {
    button.setAttribute("aria-pressed", button.dataset.faction === state.faction ? "true" : "false");
  });
}

function normalizedRanges() {
  const memMin = Math.min(state.memMin, state.memMax);
  const memMax = Math.max(state.memMin, state.memMax);
  const stubMin = Math.min(state.stubMin, state.stubMax);
  const stubMax = Math.max(state.stubMin, state.stubMax);
  document.getElementById("mem-label").textContent = `${memMin}-${memMax}`;
  document.getElementById("stub-label").textContent = `${stubMin}-${stubMax}`;
  return { memMin, memMax, stubMin, stubMax };
}

function matching() {
  const q = state.q.trim().toLowerCase();
  const { memMin, memMax, stubMin, stubMax } = normalizedRanges();
  const rows = ITEMS.filter((item) => {
    if (state.collection !== "all" && item.collection !== state.collection) return false;
    if (state.tier !== "all" && item.tier !== state.tier) return false;
    if (state.faction !== "all" && item.faction !== state.faction) return false;
    if (state.held && !vaultIds.has(item.id)) return false;
    if (item.collection === "ROMs") {
      if (item.memory < memMin || item.memory > memMax) return false;
      if (item.stub < stubMin || item.stub > stubMax) return false;
    } else if (!(memMin === 0 && memMax === 100 && stubMin === 1 && stubMax === 60)) {
      return false;
    }
    if (!q) return true;
    const factionName = factionById(item.faction).name.toLowerCase();
    const traitText = item.traits ? Object.entries(item.traits).map(([key, value]) => `${key} ${value}`).join(" ") : "";
    const hay = `${item.name} ${item.collection} ${item.chain} ${item.tier} ${factionName} ${item.serial} ${item.base} ${traitText}`.toLowerCase();
    return hay.includes(q);
  });
  if (state.sort === "rarest") rows.sort(byRarest);
  else if (state.sort === "stub") rows.sort((a, b) => (b.stub || 0) - (a.stub || 0) || a.serial - b.serial);
  else rows.sort((a, b) => a.serial - b.serial);
  return rows;
}

function render() {
  const items = matching();
  const pages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  if (state.page > pages) {
    state.page = pages;
    writeUrl("replace");
  }
  const start = (state.page - 1) * PAGE_SIZE;
  const view = items.slice(start, start + PAGE_SIZE);
  const from = items.length ? start + 1 : 0;
  const to = start + view.length;
  count.textContent = items.length
    ? `Showing ${fmt(from)}–${fmt(to)} of ${fmt(items.length)} matches · page ${state.page} of ${pages} · ${fmt(ITEMS.length)} sample items`
    : `No matches in the sample set · ${fmt(ITEMS.length)} sample items`;
  pager.innerHTML = `<button type="button" class="pixel-btn ghost small" data-page="prev"${state.page <= 1 ? " disabled" : ""}>Previous</button>
    <button type="button" class="pixel-btn ghost small" data-page="next"${state.page >= pages ? " disabled" : ""}>Next</button>`;
  if (!view.length) {
    grid.innerHTML = `<div class="empty panel">
      <img src="${FACES.cry}" alt="">
      <p>No matches in the sample set.</p>
    </div>`;
    return;
  }
  grid.innerHTML = view.map((item) => {
    const faction = factionById(item.faction);
    const held = vaultIds.has(item.id) ? `<span class="sample-pill">In demo vault</span>` : "";
    const sprite = itemSprite(item, faction);
    const klass = item.collection === "ROMs" ? "rom-chip" : "glhfer";
    const kicker = item.special ? "Special 1/1" : item.collection === "ROMs" ? item.tier : (item.base || "GLHFer");
    const detail = item.collection === "GLHFers"
      ? `${esc(faction.name)} · sample faction`
      : `${esc(faction.name)} · stub ${item.stub}`;
    return `<button type="button" class="item-card" data-id="${item.id}" style="--faction:${faction.color};--tier:${TIER_COLOR[item.tier] || "var(--gold)"}">
      <img class="${klass}" src="${sprite}" alt="">
      <p class="tier">${esc(kicker)}</p>
      <h3>${esc(item.name)}</h3>
      <p class="fine">${esc(item.collection)} · ${esc(item.chain)}<br>${detail}</p>
      ${held}
    </button>`;
  }).join("");
}

function pullForm(page) {
  state = {
    collection: form.collection.value,
    tier: form.tier.value,
    faction: form.faction.value,
    q: form.q.value,
    sort: form.sort.value,
    memMin: Number(document.getElementById("mem-min").value),
    memMax: Number(document.getElementById("mem-max").value),
    stubMin: Number(document.getElementById("stub-min").value),
    stubMax: Number(document.getElementById("stub-max").value),
    held: form.held.value === "vault",
    page,
  };
}

function openItem(id) {
  const item = ITEMS.find((entry) => entry.id === id);
  if (!item) return;
  const faction = factionById(item.faction);
  lastFocus = document.activeElement;
  const factionValue = item.collection === "GLHFers"
    ? `${esc(faction.name)} <span class="sample-pill">sample assignment</span>`
    : esc(faction.name);
  const portrait = itemPortrait(item, faction);
  const traitOrder = ["Name", "Special Character", "Base", "Gender", "Eyes", "Mouth", "Head", "Helmet", "Hoodie", "Mask", "Apparel", "Back Item", "Background"];
  const traitRows = item.traits
    ? traitOrder.filter((key) => item.traits[key]).map((key) => `<dt>${esc(key)}</dt><dd>${esc(item.traits[key])}</dd>`).join("")
    : "";
  const romRows = item.collection === "ROMs" ? `
      <dt>Tier</dt><dd>${esc(item.tier)}</dd>
      <dt>Faction</dt><dd>${factionValue}</dd>
      <dt>Memory</dt><dd>${item.memory}</dd>
      <dt>Serial</dt><dd>${item.serial}</dd>
      <dt>Stub level</dt><dd>${item.stub} / 60</dd>` : `
      <dt>Faction</dt><dd>${factionValue}</dd>
      <dt>Token</dt><dd>#${item.serial}</dd>
      ${traitRows}`;
  const sea = item.openseaUrl
    ? `<p><a href="${esc(item.openseaUrl)}" target="_blank" rel="noopener noreferrer">View on OpenSea</a></p>`
    : "";
  const note = item.collection === "GLHFers"
    ? "Art and traits are the OpenSea catalog for this token. Faction is not an onchain GLHFer trait. This vault row is sample."
    : "Sample ROM. Not a live token. Rarity sort uses tier, then stub.";
  modalBody.innerHTML = `
    <p><span class="sample-pill">Sample</span> ${vaultIds.has(item.id) ? `<span class="sample-pill">In demo vault</span>` : ""}</p>
    <img class="portrait${item.collection === "ROMs" ? " rom-portrait" : " glhfer"}" src="${portrait}" alt="${esc(item.name)}">
    <h2 id="modal-title">${esc(item.name)}</h2>
    <dl class="traits">
      <dt>Collection</dt><dd>${esc(item.collection)} · ${esc(item.chain)}</dd>
      ${romRows}
    </dl>
    ${sea}
    <p class="fine">${note}</p>`;
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
form.addEventListener("input", (event) => {
  if (event.target.type !== "range" && event.target.name !== "q") return;
  pullForm(1);
  syncForm();
  writeUrl("replace");
  render();
});
form.addEventListener("change", (event) => {
  if (event.target.type === "range" || event.target.name === "q") return;
  pullForm(1);
  syncForm();
  writeUrl("push");
  render();
});

document.getElementById("faction-chips").addEventListener("click", (event) => {
  const button = event.target.closest("[data-faction]");
  if (!button) return;
  form.faction.value = button.dataset.faction;
  pullForm(1);
  syncForm();
  writeUrl("push");
  render();
});

document.getElementById("reset-filters").addEventListener("click", () => {
  form.reset();
  document.getElementById("mem-min").value = "0";
  document.getElementById("mem-max").value = "100";
  document.getElementById("stub-min").value = "1";
  document.getElementById("stub-max").value = "60";
  pullForm(1);
  syncForm();
  writeUrl("replace");
  render();
});

pager.addEventListener("click", (event) => {
  const button = event.target.closest("[data-page]");
  if (!button || button.disabled) return;
  const pages = Math.max(1, Math.ceil(matching().length / PAGE_SIZE));
  const next = button.dataset.page === "next" ? Math.min(pages, state.page + 1) : Math.max(1, state.page - 1);
  state.page = next;
  writeUrl("push");
  render();
  count.scrollIntoView({ block: "nearest" });
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
window.addEventListener("popstate", () => {
  state = readState();
  syncForm();
  render();
});

const romStrip = document.createElement("section");
romStrip.className = "panel rom-strip";
romStrip.innerHTML = `
  <p class="kicker">Official tier art</p>
  <h2>ROM tiers</h2>
  <div class="tier-art">
    ${["Silver", "Gold", "Void", "Giga"].map((tier) => `<button type="button" class="tier-chip" data-tier="${tier}" aria-label="Show ${tier} ROMs">
      <img src="${ART.romTiers[tier]}" alt="${tier} ROM">
    </button>`).join("")}
  </div>
  <figure class="benefits">
    <img src="${ART.romBenefits}" alt="ROM tier benefits">
    <figcaption class="fine">Official ROM benefits. Tier, memory, and stub filters apply to the 24 sample ROMs.</figcaption>
  </figure>`;
document.getElementById("pager").after(romStrip);
romStrip.addEventListener("click", (event) => {
  const button = event.target.closest("[data-tier]");
  if (!button) return;
  form.tier.value = button.dataset.tier;
  form.collection.value = "ROMs";
  pullForm(1);
  syncForm();
  writeUrl("push");
  render();
});

syncForm();
render();
