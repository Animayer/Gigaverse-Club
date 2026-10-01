import "./shell.js";
import { playSuccess } from "./shell.js";
import { itemPortrait } from "./art.js";
import { factionById, itemsByIds, VAULT_IDS } from "./data.js";
import { esc, pixelSafe } from "./util.js";

const glhfers = itemsByIds(VAULT_IDS).filter((item) => item.collection === "GLHFers");
const canvas = document.getElementById("party-canvas");
const ctx = canvas.getContext("2d");
const status = document.getElementById("party-status");

let slotCount = 3;
let activeSlot = 0;
let slots = glhfers.slice(0, 3).map((item) => item.id);

const imageCache = new Map();

function loadImage(src) {
  if (imageCache.has(src)) return imageCache.get(src);
  const pending = new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
  imageCache.set(src, pending);
  return pending;
}

function filledItems() {
  return slots.map((id) => glhfers.find((item) => item.id === id)).filter(Boolean);
}

function synergies(items) {
  const tags = [];
  if (items.length < 3) tags.push("Need 3 GLHFers");
  const counts = new Map();
  items.forEach((item) => counts.set(item.faction, (counts.get(item.faction) || 0) + 1));
  const factions = [...counts.keys()];
  const max = Math.max(0, ...counts.values());
  if (items.length >= 2 && factions.length === 1) tags.push("Pure hall");
  else if (max >= 3) tags.push("Faction stack");
  else if (max >= 2) tags.push("Faction pair");
  if (items.length >= 3 && factions.length === items.length) tags.push("Mixed hall");
  if (factions.length >= 3) tags.push("Cross hall");
  if (items.some((item) => item.special)) tags.push("Special 1/1");
  const bases = new Set(items.map((item) => item.base).filter(Boolean));
  if (bases.size === 1 && items.filter((item) => item.base).length >= 2) tags.push("Shared base");
  if (!tags.length) tags.push("No synergy yet");
  return tags;
}

function mixMarkup(items) {
  const counts = new Map();
  items.forEach((item) => counts.set(item.faction, (counts.get(item.faction) || 0) + 1));
  if (!counts.size) return `<p class="fine">No GLHFers in slots yet.</p>`;
  return [...counts.entries()].map(([id, count]) => {
    const faction = factionById(id);
    return `<span class="chip"><img src="${faction.icon}" alt="" width="16" height="16"> ${esc(faction.name)} ${count}</span>`;
  }).join("");
}

function render() {
  const items = filledItems();
  document.getElementById("party-slots").innerHTML = Array.from({ length: slotCount }, (_, index) => {
    const item = slots[index] ? glhfers.find((entry) => entry.id === slots[index]) : null;
    const faction = item ? factionById(item.faction) : null;
    return `<button type="button" class="party-slot ${index === activeSlot ? "is-active" : ""}" data-slot="${index}" aria-pressed="${index === activeSlot}">
      ${faction ? `<img class="glhfer" src="${itemPortrait(item, faction)}" alt="">` : `<span class="slot-empty">Open</span>`}
      <strong>${item ? esc(item.name) : "Empty slot"}</strong>
      <span class="fine">${item ? `${item.special ? "Special 1/1" : esc(item.base || "GLHFer")} · sample faction` : "Pick a GLHFer"}</span>
    </button>`;
  }).join("");

  document.getElementById("party-picker").innerHTML = glhfers.map((item) => {
    const faction = factionById(item.faction);
    const used = slots.includes(item.id);
    return `<button type="button" class="party-pick" data-pick="${item.id}" aria-pressed="${used}">
      <img class="glhfer" src="${itemPortrait(item, faction)}" alt="">
      <span>
        <strong>${esc(item.name)}</strong>
        <span class="fine">${item.special ? "Special 1/1" : esc(item.base || "GLHFer")} · ${esc(faction.name)} sample faction</span>
      </span>
    </button>`;
  }).join("");

  document.getElementById("party-mix").innerHTML = mixMarkup(items);
  document.getElementById("party-synergy").innerHTML = synergies(items).map((tag) => `<span class="chip">${esc(tag)}</span>`).join("");
  document.getElementById("add-slot").disabled = slotCount >= 5;
  document.getElementById("drop-slot").disabled = slotCount <= 3;
}

function drawImageContain(img, x, y, size) {
  if (!img) return;
  const scale = Math.min(size / img.width, size / img.height);
  const w = img.width * scale;
  const h = img.height * scale;
  ctx.drawImage(img, x + (size - w) / 2, y + (size - h) / 2, w, h);
}

async function drawParty() {
  const name = pixelSafe(document.getElementById("party-name").value, 18);
  const lined = Array.from({ length: slotCount }, (_, index) => {
    const id = slots[index];
    return id ? glhfers.find((item) => item.id === id) : null;
  });
  const items = lined.filter(Boolean);
  const tags = synergies(items);
  const lead = items[0] ? factionById(items[0].faction) : factionById("archon");
  try {
    await document.fonts.load("32px Gigaverse");
    await document.fonts.load("16px Gigaverse");
    await document.fonts.load("20px Gigaverse");
  } catch {
    /* canvas falls back to a monospace face */
  }
  const heads = await Promise.all(lined.map((item) => (item ? loadImage(itemPortrait(item, factionById(item.faction))) : null)));
  const logo = await loadImage("assets/logo/GLHF_Logo_Shallow.png");

  ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = "#07040e";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = lead.color;
  ctx.fillRect(16, 16, canvas.width - 32, canvas.height - 32);
  ctx.fillStyle = "#140c24";
  ctx.fillRect(32, 32, canvas.width - 64, canvas.height - 64);

  ctx.fillStyle = lead.color;
  ctx.font = "32px Gigaverse";
  ctx.fillText(name, 56, 92);
  ctx.fillStyle = "#cbbddd";
  ctx.font = "16px Gigaverse";
  ctx.fillText("GLHFers party card", 56, 124);
  ctx.fillStyle = "#ffd15a";
  ctx.fillText(tags.slice(0, 3).join("  "), 56, 156);

  const box = 148;
  const gap = 16;
  const total = slotCount * box + (slotCount - 1) * gap;
  let x = (canvas.width - total) / 2;
  for (let index = 0; index < slotCount; index += 1) {
    ctx.fillStyle = "#07040f";
    ctx.fillRect(x, 190, box, box);
    if (heads[index]) drawImageContain(heads[index], x + 10, 200, box - 20);
    ctx.fillStyle = "#f6f1e6";
    ctx.font = "16px Gigaverse";
    const label = lined[index] ? factionById(lined[index].faction).name : "Open";
    ctx.fillText(label, x + 8, 368);
    x += box + gap;
  }

  if (logo) ctx.drawImage(logo, 56, 430, 180, 60);
  ctx.fillStyle = "#8d7ca8";
  ctx.font = "16px Gigaverse";
  ctx.fillText("Demo vault  sample data", 260, 470);
  ctx.save();
  ctx.translate(760, 470);
  ctx.rotate(-0.15);
  ctx.fillStyle = "#ff4fd8";
  ctx.font = "20px Gigaverse";
  ctx.fillText("SAMPLE", 0, 0);
  ctx.restore();
}

document.getElementById("party-slots").addEventListener("click", (event) => {
  const slot = event.target.closest("[data-slot]");
  if (!slot) return;
  activeSlot = Number(slot.dataset.slot);
  render();
  drawParty();
});

document.getElementById("party-picker").addEventListener("click", (event) => {
  const pick = event.target.closest("[data-pick]");
  if (!pick) return;
  const id = pick.dataset.pick;
  const existing = slots.indexOf(id);
  if (existing === activeSlot) {
    slots[activeSlot] = null;
  } else {
    if (existing >= 0) slots[existing] = slots[activeSlot] || null;
    slots[activeSlot] = id;
  }
  render();
  drawParty();
});

document.getElementById("add-slot").addEventListener("click", () => {
  if (slotCount >= 5) return;
  slotCount += 1;
  slots.length = slotCount;
  activeSlot = slotCount - 1;
  render();
  drawParty();
});

document.getElementById("drop-slot").addEventListener("click", () => {
  if (slotCount <= 3) return;
  slotCount -= 1;
  slots = slots.slice(0, slotCount);
  activeSlot = Math.min(activeSlot, slotCount - 1);
  render();
  drawParty();
});

document.getElementById("party-name").addEventListener("input", () => drawParty());

document.getElementById("share-party").addEventListener("click", async () => {
  await drawParty();
  canvas.toBlob((blob) => {
    if (!blob || blob.size < 32) {
      status.textContent = "Could not build the PNG.";
      return;
    }
    const name = pixelSafe(document.getElementById("party-name").value, 18).replace(/\s+/g, "-");
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `glhf-party-${name}.png`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
    status.textContent = "Party PNG saved to your downloads.";
    playSuccess();
  }, "image/png");
});

render();
drawParty();
