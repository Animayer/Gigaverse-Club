import "./shell.js";
import { AWAKENING_END, SPOTLIGHT } from "./data.js";
import { esc, readStore, writeStore } from "./util.js";

const VOTE_KEY = "glhf-spotlight";
let choice = readStore(VOTE_KEY, null);

function totals() {
  return SPOTLIGHT.map((entry) => ({
    ...entry,
    votes: entry.seed + (choice === entry.id ? 1 : 0),
  }));
}

function renderVotes() {
  const rows = totals();
  const max = Math.max(...rows.map((row) => row.votes), 1);
  document.getElementById("vote-list").innerHTML = rows.map((row) => {
    const pct = Math.round((row.votes / max) * 100);
    const pressed = choice === row.id;
    return `<div class="vote-row">
      <img src="${row.src}" alt="">
      <div>
        <strong>${esc(row.name)}</strong>
        <div class="bar" role="progressbar" aria-valuenow="${row.votes}" aria-valuemin="0" aria-valuemax="${max}">
          <span data-w="${pct}%" style="--faction:#ffd15a"></span>
        </div>
      </div>
      <button type="button" class="pixel-btn small" data-vote="${row.id}" aria-pressed="${pressed}">${pressed ? "Voted" : "Vote"} ${row.votes}</button>
    </div>`;
  }).join("");
  requestAnimationFrame(() => {
    document.querySelectorAll("#vote-list .bar > span").forEach((bar) => {
      bar.style.width = bar.dataset.w;
    });
  });
}

document.getElementById("vote-list").addEventListener("click", (event) => {
  const button = event.target.closest("[data-vote]");
  if (!button) return;
  choice = button.dataset.vote;
  writeStore(VOTE_KEY, choice);
  renderVotes();
});

function tick() {
  const diff = AWAKENING_END - Date.now();
  const mount = document.getElementById("countdown");
  if (diff <= 0) {
    mount.innerHTML = `<p>The Awakening end date has passed. Gigaverse Online launch date is still TBA.</p>`;
    return;
  }
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff / 3600000) % 24);
  const mins = Math.floor((diff / 60000) % 60);
  const secs = Math.floor((diff / 1000) % 60);
  const boxes = [["Days", days], ["Hours", hours], ["Min", mins], ["Sec", secs]];
  mount.innerHTML = boxes.map(([label, value]) => `<div class="count-box"><b>${value}</b><span>${label}</span></div>`).join("");
}

renderVotes();
tick();
setInterval(tick, 1000);
