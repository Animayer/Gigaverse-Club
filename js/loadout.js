import "./shell.js";
import { playSuccess } from "./shell.js";
import { ART, itemSprite } from "./art.js";
import { factionById, MEDALS, TIER_COLOR } from "./data.js";
import { demoProfile, SCORE_BANDS, SNAPSHOT_DATE } from "./club.js";
import { esc, fmt, copyText } from "./util.js";

const gate = document.getElementById("gate");
const view = document.getElementById("loadout");
const profile = demoProfile();

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

function drawContain(context, img, x, y, size) {
  if (!img) return;
  const scale = Math.min(size / img.width, size / img.height);
  const w = img.width * scale;
  const h = img.height * scale;
  context.drawImage(img, x + (size - w) / 2, y + (size - h) / 2, w, h);
}

function slotCard(item) {
  const faction = factionById(item.faction);
  const src = itemSprite(item, faction);
  const klass = item.collection === "ROMs" ? "rom-chip" : "glhfer";
  const label = item.special ? "Special 1/1" : item.collection === "ROMs" ? `${item.tier} · ${faction.name}` : `${item.base || "GLHFer"} · sample faction`;
  return `<a class="party-slot" href="explorer.html?q=${encodeURIComponent(item.name)}">
    <img class="${klass}" src="${esc(src)}" alt="">
    <strong>${esc(item.name)}</strong>
    <span class="fine" style="color:${TIER_COLOR[item.tier] || "var(--gold)"}">${esc(label)}</span>
  </a>`;
}

function render() {
  const band = SCORE_BANDS.find((row) => profile.total >= row.min && profile.total <= row.max);
  const parts = profile.collectParts;
  view.innerHTML = `
    <p class="kicker">Sample loadout</p>
    <h1>Giga Loadout</h1>
    <p class="mono">${esc(profile.address)}</p>
    <p class="fine">Same demo wallet as My Vault. Snapshot ${esc(SNAPSHOT_DATE)}. Earliest sample hold ${esc(profile.earliest)}. Not a chain read.</p>
    <figure class="shot-solo">
      <img src="${ART.shots.roms}" alt="Giga ROMs in the game client">
      <figcaption>Giga ROMs in the client. This loadout is the sample wallet, not a live inventory.</figcaption>
    </figure>
    <div class="tier-art compact">
      ${["Silver", "Gold", "Void", "Giga"].map((tier) => `<figure><img src="${ART.romTiers[tier]}" alt="${tier} ROM"></figure>`).join("")}
    </div>
    <div class="row-actions">
      <button type="button" class="pixel-btn ghost small" id="disconnect">Disconnect demo</button>
      <a class="pixel-btn small" href="vault.html">My Vault</a>
      <a class="pixel-btn small alt" href="drops.html">Partner drops</a>
    </div>
    <div class="split">
      <section class="panel">
        <h2>Holdings</h2>
        <ul class="stat-list">
          <li><span>Pieces</span><strong>${fmt(profile.pieces)}</strong></li>
          <li><span>GLHFers</span><strong>${fmt(profile.glhf.length)}</strong></li>
          <li><span>ROMs</span><strong>${fmt(profile.roms.length)}</strong></li>
          <li><span>Base emblems</span><strong>${fmt(profile.earnedCount)} / ${fmt(profile.emblems.length)}</strong></li>
          <li><span>Holding tier</span><strong><img class="medal" src="${MEDALS[profile.tier.medal]}" alt=""> ${esc(profile.tier.name)}</strong></li>
        </ul>
        <p class="fine">Holding tier follows piece count: Holder, Keeper, Stack, Vault, Archive. Archive starts at 400 pieces. This wallet is ${esc(profile.tier.name)}.</p>
      </section>
      <section class="panel">
        <h2>Collector score</h2>
        <p class="big-num">${fmt(profile.total)}<span class="plain"> / 100</span></p>
        <p><span class="sample-pill">Sample</span> ${band ? `${esc(band.name)} band` : ""}</p>
        <div class="score-track" role="img" aria-label="Score ${profile.total} out of 100"><span style="width:${profile.total}%"></span></div>
        <ul class="stat-list">
          <li><span>Collect</span><strong>${fmt(profile.collect)} / 40</strong></li>
          <li><span>Tenure</span><strong>${fmt(profile.tenure)} / 30</strong></li>
          <li><span>Play</span><strong class="muted">not tracked yet</strong></li>
          <li><span>Participation</span><strong class="muted">not tracked yet</strong></li>
        </ul>
        <p class="fine">Collect is ${parts.fullStack} for holding both collections, plus ${parts.emblems} from emblems, plus ${parts.pieces} from pieces. Tenure scales days from 15 Jan 2024 to ${esc(SNAPSHOT_DATE)}, up to 30. Play and Participation stay reserved at 15 each.</p>
      </section>
    </div>
    <section class="panel">
      <h2>Slots</h2>
      <p class="fine">Two rarest GLHFers and two rarest ROMs in the demo vault. Rarest means tier, then stub level.</p>
      <div class="slot-row slots-4">${profile.slots.map(slotCard).join("")}</div>
    </section>
    <section class="panel">
      <h2>Base emblems</h2>
      <p class="fine">${fmt(profile.earnedCount)} of ${fmt(profile.emblems.length)} Base names in this OpenSea slice are lit. Stats counts that same slice. Grey emblems are not in this vault. Special 1/1s have no Base trait.</p>
      <div class="emblem-grid">
        ${profile.emblems.map((emblem) => `<article class="emblem ${emblem.earned ? "is-on" : "is-off"}">
          <img src="${esc(emblem.src)}" alt="">
          <span>${esc(emblem.name)}</span>
        </article>`).join("")}
      </div>
    </section>
    <section class="panel">
      <h2>Share stats card</h2>
      <p class="fine">PNG stays in this browser. Copy link copies this page. Nothing is posted.</p>
      <canvas class="px" id="share-canvas" width="960" height="540"></canvas>
      <div class="row-actions">
        <button type="button" class="pixel-btn" id="download-card">Download PNG</button>
        <button type="button" class="pixel-btn ghost" id="copy-link">Copy link</button>
      </div>
      <p id="share-status" role="status"></p>
    </section>`;
}

async function drawCard() {
  const live = document.getElementById("share-canvas");
  const context = live.getContext("2d");
  const faction = factionById(profile.top[0].faction);
  try {
    await document.fonts.load("32px Gigaverse");
    await document.fonts.load("20px Gigaverse");
    await document.fonts.load("16px Gigaverse");
  } catch {
    /* canvas falls back to a monospace face */
  }
  const icons = await Promise.all(profile.top.map((item) => loadImage(itemSprite(item, factionById(item.faction)))));
  const [medalImg, logoImg] = await Promise.all([
    loadImage(MEDALS[profile.tier.medal]),
    loadImage(ART.logos.glhfShallow),
  ]);
  context.imageSmoothingEnabled = false;
  context.fillStyle = "#07040e";
  context.fillRect(0, 0, live.width, live.height);
  context.fillStyle = faction.color;
  context.fillRect(18, 18, live.width - 36, live.height - 36);
  context.fillStyle = "#140c24";
  context.fillRect(34, 34, live.width - 68, live.height - 68);
  context.fillStyle = "#ffd15a";
  context.font = "32px Gigaverse";
  context.fillText("Giga Loadout", 58, 100);
  context.fillStyle = "#f6f1e6";
  context.font = "20px Gigaverse";
  context.fillText(profile.address, 58, 146);
  context.fillStyle = "#cbbddd";
  context.font = "16px Gigaverse";
  context.fillText(`Score ${profile.total} / 100   ${profile.tier.name}   ${profile.pieces} pieces`, 58, 186);
  context.fillText(`${profile.glhf.length} GLHF   ${profile.roms.length} ROM   emblems ${profile.earnedCount}/${profile.emblems.length}`, 58, 216);
  context.fillText("Gigaverse Club   sample", 58, 246);
  profile.top.forEach((item, index) => {
    const x = 58 + index * 150;
    context.fillStyle = "#07040f";
    context.fillRect(x, 280, 130, 150);
    drawContain(context, icons[index], x + 15, 292, 100);
    context.fillStyle = "#f6f1e6";
    context.font = "14px Gigaverse";
    context.fillText(item.tier, x + 8, 414);
  });
  drawContain(context, medalImg, 820, 70, 84);
  if (logoImg) context.drawImage(logoImg, 700, 430, 200, 66);
}

function bind() {
  document.getElementById("disconnect").addEventListener("click", () => {
    view.hidden = true;
    view.innerHTML = "";
    gate.hidden = false;
  });
  document.getElementById("download-card").addEventListener("click", async () => {
    const live = document.getElementById("share-canvas");
    const note = document.getElementById("share-status");
    await drawCard();
    live.toBlob((blob) => {
      if (!blob || blob.size < 32) {
        note.textContent = "Could not build the PNG.";
        return;
      }
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "gigaverse-club-loadout.png";
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1500);
      note.textContent = "Loadout PNG saved to your downloads.";
      playSuccess();
    }, "image/png");
  });
  document.getElementById("copy-link").addEventListener("click", async () => {
    const note = document.getElementById("share-status");
    const url = new URL("loadout.html", window.location.href);
    const ok = await copyText(url.toString());
    note.textContent = ok ? "Link copied." : "Clipboard blocked. The loadout URL is still in the address bar.";
    if (ok) playSuccess();
  });
}

document.getElementById("connect").addEventListener("click", async () => {
  gate.hidden = true;
  render();
  view.hidden = false;
  await drawCard();
  bind();
  playSuccess();
});
