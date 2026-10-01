import "./shell.js";
import { playSuccess } from "./shell.js";
import { ART, itemPortrait, itemSprite } from "./art.js";
import {
  AVATARS,
  DEMO_ADDRESS,
  factionById,
  FACTIONS,
  itemsByIds,
  MEDALS,
  TIER_COLOR,
  VAULT_IDS,
} from "./data.js";
import { badgeStripMarkup } from "./badge-data.js";
import { esc, fmt, pixelSafe } from "./util.js";

const holdings = itemsByIds(VAULT_IDS);
const gate = document.getElementById("gate");
const vault = document.getElementById("vault");
const canvas = document.getElementById("holder-canvas");
const ctx = canvas.getContext("2d");
const status = document.getElementById("card-status");

let avatarId = "giganoob";
let factionId = "archon";
let medalId = "gold";

function countBy(key) {
  const map = new Map();
  holdings.forEach((item) => map.set(item[key], (map.get(item[key]) || 0) + 1));
  return map;
}

function bestMedal() {
  if (holdings.some((item) => item.tier === "Giga")) return "giga";
  if (holdings.some((item) => item.tier === "Gold")) return "gold";
  if (holdings.some((item) => item.tier === "Void")) return "iron";
  return "copper";
}

function sets() {
  const masters = new Set(holdings.map((item) => item.faction).filter((id) => id !== "gigus"));
  const chains = new Set(holdings.map((item) => item.collection));
  const giga = holdings.filter((item) => item.tier === "Giga").length;
  const highStub = holdings.filter((item) => item.stub >= 40).length;
  return [
    { name: "Both chains", current: chains.size, goal: 2 },
    { name: "Masters touched", current: masters.size, goal: 7 },
    { name: "Giga tier chips", current: giga, goal: 4 },
    { name: "Stub 40 club", current: highStub, goal: 8 },
  ];
}

function summaryLines() {
  const glhf = holdings.filter((item) => item.collection === "GLHFers").length;
  const roms = holdings.length - glhf;
  const tiers = ["Silver", "Gold", "Void", "Giga"].map((tier) => {
    const n = holdings.filter((item) => item.tier === tier).length;
    return `${tier} ${n}`;
  });
  return {
    counts: `${glhf} GLHF / ${roms} ROM`,
    tiers: tiers.join("  "),
  };
}

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

function drawImageContain(img, x, y, size) {
  if (!img) return;
  const scale = Math.min(size / img.width, size / img.height);
  const w = img.width * scale;
  const h = img.height * scale;
  ctx.drawImage(img, x + (size - w) / 2, y + (size - h) / 2, w, h);
}

function drawContain(context, img, x, y, size) {
  if (!img) return;
  const scale = Math.min(size / img.width, size / img.height);
  const w = img.width * scale;
  const h = img.height * scale;
  context.drawImage(img, x + (size - w) / 2, y + (size - h) / 2, w, h);
}

const collageCanvas = document.getElementById("collage-canvas");
const collageCtx = collageCanvas.getContext("2d");
const collageStatus = document.getElementById("collage-status");

async function drawCollage() {
  const factionSelect = document.getElementById("collage-faction");
  if (!factionSelect.value) return;
  const n = Number(document.getElementById("collage-grid").value) || 3;
  const faction = factionById(factionSelect.value) || factionById("archon");
  const handle = pixelSafe(document.getElementById("handle").value, 16);
  const size = n === 2 ? 640 : n === 4 ? 800 : 720;
  collageCanvas.width = size;
  collageCanvas.height = size;
  const icons = await Promise.all(Array.from({ length: n * n }, (_, index) => {
    const item = holdings[index % holdings.length];
    return loadImage(itemPortrait(item, factionById(item.faction)));
  }));
  try {
    await document.fonts.load("20px Gigaverse");
    await document.fonts.load("16px Gigaverse");
  } catch {
    /* canvas falls back to a monospace face */
  }
  collageCtx.imageSmoothingEnabled = false;
  collageCtx.fillStyle = faction.color;
  collageCtx.fillRect(0, 0, size, size);
  const pad = 18;
  const gap = 10;
  const cell = (size - pad * 2 - gap * (n - 1)) / n;
  icons.forEach((icon, index) => {
    const col = index % n;
    const row = Math.floor(index / n);
    const x = pad + col * (cell + gap);
    const y = pad + row * (cell + gap);
    collageCtx.fillStyle = "#140c24";
    collageCtx.fillRect(x, y, cell, cell);
    drawContain(collageCtx, icon, x + 8, y + 8, cell - 16);
  });
  collageCtx.fillStyle = "rgba(7, 4, 14, 0.78)";
  collageCtx.fillRect(0, size - 56, size, 56);
  collageCtx.fillStyle = "#f6f1e6";
  collageCtx.font = "20px Gigaverse";
  collageCtx.fillText(handle, 16, size - 22);
  collageCtx.fillStyle = "#ff4fd8";
  collageCtx.font = "16px Gigaverse";
  collageCtx.fillText("SAMPLE", size - 130, size - 22);
}

async function drawCard() {
  const handle = pixelSafe(document.getElementById("handle").value, 16);
  const faction = factionById(factionId);
  const avatar = AVATARS.find((entry) => entry.id === avatarId) || AVATARS[0];
  const lines = summaryLines();
  try {
    await document.fonts.load("32px Gigaverse");
    await document.fonts.load("20px Gigaverse");
    await document.fonts.load("16px Gigaverse");
    await document.fonts.load("28px Gigaverse");
  } catch {
    /* canvas falls back to a monospace face */
  }
  const glhfHoldings = holdings.filter((item) => item.collection === "GLHFers");
  const [avatarImg, iconImg, medalImg, logoImg, ...glhfImgs] = await Promise.all([
    loadImage(avatar.src),
    loadImage(faction.icon),
    loadImage(MEDALS[medalId]),
    loadImage(ART.logos.glhfShallow),
    ...glhfHoldings.map((item) => loadImage(item.image)),
  ]);

  ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = "#07040e";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = faction.color;
  ctx.fillRect(18, 18, canvas.width - 36, canvas.height - 36);
  ctx.fillStyle = "#140c24";
  ctx.fillRect(34, 34, canvas.width - 68, canvas.height - 68);

  ctx.fillStyle = "#07040f";
  ctx.fillRect(58, 78, 300, 300);
  drawImageContain(avatarImg, 58, 78, 300);

  ctx.fillStyle = faction.color;
  ctx.font = "32px Gigaverse";
  ctx.fillText(handle, 390, 130);
  ctx.fillStyle = "#f6f1e6";
  ctx.font = "20px Gigaverse";
  ctx.fillText(faction.name, 390, 172);
  ctx.font = "16px Gigaverse";
  ctx.fillStyle = "#cbbddd";
  ctx.fillText("Gigaverse Club", 390, 214);
  ctx.fillStyle = "#ffd15a";
  ctx.fillText(lines.counts, 390, 268);
  ctx.fillStyle = "#f6f1e6";
  ctx.fillText(lines.tiers, 390, 304);
  ctx.fillStyle = "#8d7ca8";
  ctx.fillText("Demo vault  0xDEMO...GLHF", 390, 360);

  drawImageContain(iconImg, 820, 150, 72);
  drawImageContain(medalImg, 820, 70, 84);
  if (logoImg) ctx.drawImage(logoImg, 58, 430, 180, 60);
  glhfImgs.forEach((img, index) => {
    const x = 250 + index * 86;
    ctx.fillStyle = "#07040f";
    ctx.fillRect(x, 418, 78, 78);
    drawImageContain(img, x + 4, 422, 70);
  });

  ctx.save();
  ctx.translate(700, 450);
  ctx.rotate(-0.18);
  ctx.fillStyle = "#ff4fd8";
  ctx.font = "28px Gigaverse";
  ctx.fillText("SAMPLE", 0, 0);
  ctx.restore();
}

function renderPicker() {
  const mount = document.getElementById("avatar-picker");
  const groups = ["Sprites", "Expressions", "Heads", "Profiles"];
  mount.innerHTML = groups.map((group) => {
    const buttons = AVATARS.filter((avatar) => avatar.group === group).map((avatar) => `
      <button type="button" data-avatar="${avatar.id}" aria-pressed="${avatar.id === avatarId}" title="${esc(avatar.label)}" aria-label="${esc(avatar.label)}">
        <img src="${avatar.src}" alt="">
      </button>`).join("");
    return `<p class="kicker">${group}</p><div class="avatar-grid">${buttons}</div>`;
  }).join("");
}

function renderVault() {
  const tierCounts = countBy("tier");
  const factionCounts = countBy("faction");
  document.getElementById("vault-address").textContent = DEMO_ADDRESS;
  document.getElementById("vault-chips").innerHTML = [
    ["GLHFers", holdings.filter((item) => item.collection === "GLHFers").length],
    ["ROMs", holdings.filter((item) => item.collection === "ROMs").length],
    ...["Silver", "Gold", "Void", "Giga"].map((tier) => [tier, tierCounts.get(tier) || 0]),
  ].map(([label, n]) => `<span class="chip">${esc(label)} ${n}</span>`).join("")
    + [...factionCounts.entries()].map(([id, n]) => {
      const faction = factionById(id);
      return `<span class="chip"><img src="${faction.icon}" alt="" width="16" height="16"> ${esc(faction.name)} ${n}</span>`;
    }).join("");

  document.getElementById("set-bars").innerHTML = sets().map((set) => {
    const pct = Math.min(100, Math.round((set.current / set.goal) * 100));
    return `<div class="quest">
      <strong>${esc(set.name)}</strong>
      <span class="fine"> ${set.current} / ${set.goal}</span>
      <div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="${set.goal}" aria-valuenow="${set.current}"><span data-w="${pct}%"></span></div>
    </div>`;
  }).join("");

  document.getElementById("badge-strip").innerHTML = badgeStripMarkup();

  document.getElementById("holding-grid").innerHTML = holdings.map((item) => {
    const faction = factionById(item.faction);
    const src = itemSprite(item, faction);
    const klass = item.collection === "ROMs" ? "rom-chip" : "glhfer";
    const kicker = item.special ? "Special 1/1" : item.collection === "ROMs" ? item.tier : (item.base || "GLHFer");
    const detail = item.collection === "GLHFers"
      ? `${esc(faction.name)} · sample faction`
      : `${esc(faction.name)} · mem ${item.memory} · stub ${item.stub}`;
    return `<article class="item-card" style="--faction:${faction.color};--tier:${TIER_COLOR[item.tier] || "var(--gold)"}">
      <img class="${klass}" src="${src}" alt="">
      <p class="tier">${esc(kicker)}</p>
      <h3>${esc(item.name)}</h3>
      <p class="fine">${detail}</p>
    </article>`;
  }).join("");

  requestAnimationFrame(() => {
    document.querySelectorAll("#set-bars .bar > span").forEach((bar) => {
      bar.style.width = bar.dataset.w;
    });
  });
}

function fillSelects() {
  document.getElementById("card-faction").innerHTML = FACTIONS.map((faction) =>
    `<option value="${faction.id}">${esc(faction.name)}</option>`).join("");
  document.getElementById("card-medal").innerHTML = Object.keys(MEDALS).map((id) =>
    `<option value="${id}">${id}</option>`).join("");
  document.getElementById("collage-faction").innerHTML = FACTIONS.map((faction) =>
    `<option value="${faction.id}">${esc(faction.name)}</option>`).join("");
}

document.getElementById("connect").addEventListener("click", async () => {
  gate.hidden = true;
  vault.hidden = false;
  medalId = bestMedal();
  fillSelects();
  document.getElementById("card-faction").value = factionId;
  document.getElementById("card-medal").value = medalId;
  document.getElementById("collage-faction").value = factionId;
  renderPicker();
  renderVault();
  await drawCard();
  await drawCollage();
  if (location.hash === "#card") document.getElementById("card").scrollIntoView();
});

document.getElementById("disconnect").addEventListener("click", () => {
  vault.hidden = true;
  gate.hidden = false;
});

document.getElementById("avatar-picker").addEventListener("click", (event) => {
  const button = event.target.closest("[data-avatar]");
  if (!button) return;
  avatarId = button.dataset.avatar;
  renderPicker();
  drawCard();
});

document.getElementById("handle").addEventListener("input", () => {
  drawCard();
  drawCollage();
});
document.getElementById("collage-grid").addEventListener("change", () => drawCollage());
document.getElementById("collage-faction").addEventListener("change", () => drawCollage());
document.getElementById("card-faction").addEventListener("change", (event) => {
  factionId = event.target.value;
  drawCard();
});
document.getElementById("card-medal").addEventListener("change", (event) => {
  medalId = event.target.value;
  drawCard();
});

document.getElementById("download-collage").addEventListener("click", async () => {
  await drawCollage();
  collageCanvas.toBlob((blob) => {
    if (!blob || blob.size < 32) {
      collageStatus.textContent = "Could not build the PNG.";
      return;
    }
    const handle = pixelSafe(document.getElementById("handle").value, 16).replace(/\s+/g, "-");
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `glhf-collage-${handle}.png`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
    collageStatus.textContent = "Collage PNG saved to your downloads.";
    playSuccess();
  }, "image/png");
});

document.getElementById("download-card").addEventListener("click", () => {
  canvas.toBlob((blob) => {
    if (!blob) {
      status.textContent = "Could not build the PNG.";
      return;
    }
    const handle = pixelSafe(document.getElementById("handle").value, 16).replace(/\s+/g, "-");
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `glhf-holder-${handle}.png`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
    status.textContent = "PNG saved to your downloads.";
    playSuccess();
  }, "image/png");
});
