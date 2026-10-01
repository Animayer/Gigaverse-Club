import "./shell.js";
import { demoBadges, highestTier, tierMedal } from "./badge-data.js";
import { esc } from "./util.js";

const badges = demoBadges();
const grid = document.getElementById("badge-grid");

function tierBlock(tier) {
  const state = tier.earned ? "Earned" : "Locked";
  return `<div class="tier-block ${tier.earned ? "is-earned" : "is-locked"}">
    <img src="${tierMedal(tier.name)}" alt="">
    <div>
      <strong>${tier.name}</strong>
      <span class="fine"> ${state} · ${tier.current} / ${tier.goal}</span>
      <div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="${tier.goal}" aria-valuenow="${tier.current}">
        <span style="width:${tier.pct}%"></span>
      </div>
    </div>
  </div>`;
}

if (grid) {
  grid.innerHTML = badges.map((badge) => {
    const top = highestTier(badge);
    const locked = !top;
    return `<article class="badge-card panel ${locked ? "is-locked" : "is-earned"}" id="${badge.id}">
      <p class="kicker">${locked ? "Locked" : esc(top)}</p>
      <h2>${esc(badge.name)}</h2>
      <p>${esc(badge.blurb)}</p>
      ${badge.tiers.map(tierBlock).join("")}
    </article>`;
  }).join("");
}
