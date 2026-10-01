import "./shell.js";
import { playSuccess } from "./shell.js";
import { MEDALS } from "./data.js";
import { demoProfile, SCORE_BANDS } from "./club.js";
import { esc, fmt } from "./util.js";

const profile = demoProfile();

document.getElementById("drops").innerHTML = `
  <p>Snapshot score for <span class="mono">${esc(profile.address)}</span>: <b>${fmt(profile.total)} / 100</b> <span class="sample-pill">sample</span>. Same number as Giga Loadout. It is not Faction Wars points and it does not unlock badges by itself.</p>
  <div class="band-grid">
    ${SCORE_BANDS.map((band) => {
      const yours = profile.total >= band.min && profile.total <= band.max;
      return `<article class="panel band${yours ? " is-yours" : ""}">
        <h2><img class="medal" src="${MEDALS[band.medal]}" alt=""> ${band.min}–${band.max}</h2>
        <p>${esc(band.name)}${yours ? " · this wallet" : ""}</p>
        <p class="fine">${esc(band.requirement)} <span class="sample-pill">sample</span></p>
        <div class="empty-slot">Empty drop slot</div>
        <div class="empty-slot">Empty drop slot</div>
      </article>`;
    }).join("")}
  </div>
  <section class="panel">
    <h2>Want your project here?</h2>
    <p class="fine">Partner listings are not open in this mockup.</p>
    <button type="button" class="pixel-btn" id="partner-cta">Want your project here?</button>
    <p id="partner-note" class="fine" hidden>Prototype only. This does not send a request.</p>
  </section>`;

document.getElementById("partner-cta").addEventListener("click", () => {
  const note = document.getElementById("partner-note");
  note.hidden = false;
  note.textContent = "Prototype only. This does not send a request.";
  playSuccess();
});
