import "./shell.js";
import { FACTIONS } from "./data.js";
import { esc } from "./util.js";

const DIVES = [
  {
    id: "dive-stub-60",
    title: "Stub 60 is a story, not a price",
    author: "citadel_jan",
    upvotes: 128,
    tags: ["trait", "stub"],
    body: [
      "Sample deep dive. Stub level is a trait on the public ROM notes, and this lobby copies that field onto sample GLHFers too. A stub of 60 is the cap called out in those notes.",
      "Nothing in this post is a listing, a sale, or a contract read. The demo vault happens to hold one Giga chip at stub 60 so the party builder can light a High stub tag.",
    ],
  },
  {
    id: "dive-foxglove-hex",
    title: "Foxglove hex notes from a sample garden",
    author: "hex_bloom",
    upvotes: 86,
    tags: ["faction", "Foxglove"],
    body: [
      "Sample deep dive. Foxglove is one of the seven Masters. The hall icon and the front-facing head in the faction vault are media-kit art, not a live mint preview.",
      "If you open the Faction Vault tab on the Foxglove hall, the pinned lore and the war-room lines are labeled sample. They do not move the week score.",
    ],
  },
  {
    id: "dive-archon-character",
    title: "Archon is a Special Character and a hall",
    author: "oathkeeper",
    upvotes: 204,
    tags: ["special character", "faction"],
    body: [
      "Sample deep dive. Archon is both a faction you can open from the wars map and one of the Special Characters the wiki calls a 1/1 sample.",
      "Gigaverse Collectors Hub keeps those roles on separate cards: the hall tracks sample activity, and the wiki keeps the on-record sentence. This post does not add a new canon line.",
    ],
  },
  {
    id: "dive-memory-trait",
    title: "Memory trait, with sample numbers only",
    author: "margin_note",
    upvotes: 64,
    tags: ["trait", "memory"],
    body: [
      "Sample deep dive. Memory on the explorer runs from the sample generator: a low chip, a high chip, and the rest scattered. It is not pulled from token metadata.",
      "Use it to practice filters. Pair it with faction and stub if you want a narrower grid. The numbers will not match a wallet.",
    ],
  },
];

const auctioneer = {
  id: "auctioneer",
  name: "Auctioneer",
  title: "Floor burner",
  kicker: "Special Character · 1/1 sample",
  head: "assets/gifs/Auctioneer.gif",
  onRecord: "Auctions 1/1 Special Characters and uses the proceeds to sweep and burn the GLHFers floor. Docs put the burn count at 420, which this mockup uses as its baseline.",
  lore: [
    "Sample lore: The gavel drops on Sundays in this lobby. The portrait is the Auctioneer gif from the media kit.",
  ],
  link: "burn.html",
  linkLabel: "Burn tracker",
};

const cards = [
  ...FACTIONS.filter((faction) => faction.id !== "gigus").map((faction) => ({
    ...faction,
    kicker: "Master · 1/1 sample",
    link: `factions.html#${faction.id}`,
    linkLabel: "Faction hall",
  })),
  auctioneer,
  {
    ...FACTIONS.find((faction) => faction.id === "gigus"),
    kicker: "Creator · lore, not a 1/1",
    link: "factions.html#gigus",
    linkLabel: "Gigus lore hall",
  },
];

document.getElementById("wiki-grid").innerHTML = cards.map((card) => `
  <article class="wiki-card" id="${card.id}">
    <img class="portrait" src="${card.head}" alt="${esc(card.name)} portrait">
    <p class="kicker">${esc(card.kicker)}</p>
    <h2>${esc(card.name)}</h2>
    <p>${esc(card.onRecord)}</p>
    ${card.lore.map((line) => `<p>${esc(line)}</p>`).join("")}
    <p><span class="sample-pill">Sample</span></p>
    <p><a href="${card.link}">${esc(card.linkLabel)}</a></p>
  </article>`).join("");

const diveList = document.getElementById("dive-list");
const diveDetail = document.getElementById("dive-detail");
const diveForm = document.getElementById("dive-form");
const diveNote = document.getElementById("dive-note");

function renderDives() {
  diveList.innerHTML = DIVES.map((post) => `
    <article class="dive-card panel" id="${post.id}">
      <button type="button" class="dive-open" data-dive="${post.id}">
        <span class="kicker">${post.upvotes} upvotes</span>
        <strong>${esc(post.title)}</strong>
      </button>
      <p class="fine">u/${esc(post.author)}</p>
      <p class="chip-row">${post.tags.map((tag) => `<span class="chip">${esc(tag)}</span>`).join("")}</p>
    </article>`).join("");
}

function showDive(id, scroll) {
  const post = DIVES.find((entry) => entry.id === id);
  if (!post) return;
  diveDetail.hidden = false;
  diveDetail.innerHTML = `
    <p class="kicker">${post.upvotes} upvotes</p>
    <h2>${esc(post.title)}</h2>
    <p class="fine">u/${esc(post.author)}</p>
    <p class="chip-row">${post.tags.map((tag) => `<span class="chip">${esc(tag)}</span>`).join("")}</p>
    ${post.body.map((line) => `<p>${esc(line)}</p>`).join("")}
    <p><span class="sample-pill">Sample</span></p>
    <button type="button" class="pixel-btn ghost small" id="dive-back">Back to list</button>`;
  if (scroll) diveDetail.scrollIntoView();
}

renderDives();

diveList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-dive]");
  if (!button) return;
  const id = button.dataset.dive;
  if (location.hash !== `#${id}`) history.replaceState(null, "", `#${id}`);
  showDive(id, true);
});

diveDetail.addEventListener("click", (event) => {
  if (event.target.id !== "dive-back") return;
  diveDetail.hidden = true;
  history.replaceState(null, "", location.pathname + location.search);
  document.getElementById("deep-dives").scrollIntoView();
});

document.getElementById("write-dive").addEventListener("click", () => {
  diveForm.hidden = !diveForm.hidden;
  diveNote.textContent = "";
  if (!diveForm.hidden) diveForm.querySelector("input").focus();
});

diveForm.addEventListener("submit", (event) => {
  event.preventDefault();
  diveNote.textContent = "Demo only. This deep dive was not saved.";
});

const openHash = location.hash.replace("#", "");
if (openHash.startsWith("dive-")) showDive(openHash, false);
else if (location.hash) document.querySelector(location.hash)?.scrollIntoView();
