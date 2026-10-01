import "./shell.js";
import { playSuccess } from "./shell.js";
import {
  FACES,
  factionById,
  FACTIONS,
  FEED,
  ITEMS,
  MAP_ROWS,
  MEDALS,
  questsFor,
  RANK_MEDAL,
  RECRUITS,
  REWARDS,
  RIVAL_SEED,
  rivalry,
  SCORE_RULE,
  seasonTotals,
  standings,
  zoneOwner,
  zonePoints,
  ZONES,
} from "./data.js";
import { esc, fmt, readStore, writeStore } from "./util.js";

const app = document.getElementById("app");
let week = 6;
let builtFor = "";
let hallTab = "overview";
let playing = false;
let playTimer = 0;
let pinnedZone = "K";
const cheers = new Set(readStore("glhf-cheers", []));
const reactions = readStore("glhf-reacts", {});
const recruits = new Set(readStore("glhf-recruit", []));
const votes = readStore("glhf-rivalry", {});

function stopPlay() {
  playing = false;
  clearInterval(playTimer);
  playTimer = 0;
}

function seasonLeader() {
  return seasonTotals()[0];
}

function weekButtons() {
  return [1, 2, 3, 4, 5, 6].map((n) =>
    `<button type="button" class="pixel-btn small week-btn" data-week="${n}" aria-pressed="${n === week}">W${n}</button>`).join("");
}

function medalImg(id, className = "medal") {
  return `<img class="${className}" src="${MEDALS[id]}" alt="">`;
}

function warsHtml() {
  const season = seasonTotals();
  const leader = season[0];
  const leaderFaction = factionById(leader.id);
  const next = REWARDS.find((reward) => reward.need > leader.total);
  const hallCards = FACTIONS.map((faction) => `
    <a class="faction-card card" href="#${faction.id}" style="--faction:${faction.color}">
      <img class="head" src="${faction.head}" alt="">
      <span>
        <strong>${esc(faction.name)}</strong>
        <span class="fine">${esc(faction.title)}</span><br>
        <span class="fine">${fmt(faction.members)} sample members</span>
      </span>
    </a>`).join("");

  const rewards = REWARDS.map((reward) => {
    const got = leader.total >= reward.need;
    const isNext = next && next.id === reward.id;
    return `<article class="reward ${got ? "got" : ""} ${isNext ? "next" : ""}">
      ${medalImg(reward.medal)}
      <h3>${esc(reward.name)}</h3>
      <p class="fine">${fmt(reward.need)} pts</p>
      <p class="fine">${esc(reward.blurb)}</p>
    </article>`;
  }).join("");

  const council = FACTIONS.map((faction) => `
    <article class="council-card">
      <header><img src="${faction.icon}" alt="" width="28" height="28"><strong>${esc(faction.name)}</strong></header>
      ${faction.council.map((badge) => `
        <div class="badge">${medalImg(badge.medal)}<span><b>${esc(badge.role)}</b> ${esc(badge.holder)}</span></div>`).join("")}
    </article>`).join("");

  const recruitCards = RECRUITS.map((post) => {
    const faction = factionById(post.faction);
    const noted = recruits.has(post.id);
    return `<article class="recruit-card">
      <header class="badge-row"><img src="${faction.icon}" alt="" width="24" height="24"><strong>${esc(faction.name)}</strong></header>
      <h3>${esc(post.title)}</h3>
      <p class="fine">${esc(post.detail)}</p>
      <button type="button" class="pixel-btn small" data-recruit="${post.id}" aria-pressed="${noted}">${noted ? "Noted" : "Signal interest"}</button>
    </article>`;
  }).join("");

  const feed = FEED.map((post) => {
    const faction = factionById(post.faction);
    const buttons = post.reacts.map(([emoji, seed]) => {
      const key = `${post.id}:${emoji}`;
      const total = seed + (reactions[key] || 0);
      return `<button type="button" data-react="${esc(key)}">${emoji} <span class="count">${total}</span></button>`;
    }).join("");
    return `<article class="post">
      <img class="avatar" src="${FACES[post.face]}" alt="">
      <div>
        <header>${esc(post.name)} · ${esc(faction.name)} · ${esc(post.ago)}</header>
        <p>${esc(post.text)}</p>
        <div class="reacts">${buttons}</div>
      </div>
    </article>`;
  }).join("");

  const pct = Math.min(100, Math.round((leader.total / REWARDS[REWARDS.length - 1].need) * 100));

  return `
    <img class="banner-strip" src="assets/gifs/Gigaverse_Banner.gif" alt="Gigaverse banner">
    <nav class="subnav" aria-label="Faction wars">
      <a href="#halls">Halls</a>
      <a href="#relic">Relic</a>
      <a href="#board">Standings</a>
      <a href="#rivalry">Rivalry</a>
      <a href="#quests">Quests</a>
      <a href="#rewards">Rewards</a>
      <a href="#map">Map</a>
      <a href="#council">Council</a>
      <a href="#recruit">Recruit</a>
      <a href="#feed">War room</a>
    </nav>
    <section id="halls">
      <h2>Faction halls</h2>
      <p class="fine">Seven Masters, plus Gigus lore. Sample member counts.</p>
      <div class="faction-grid">${hallCards}</div>
    </section>
    <div class="weekbar">
      <span class="kicker">Season week</span>
      ${weekButtons()}
      <button type="button" class="pixel-btn ghost small" id="play-weeks">Play weeks</button>
      <label class="fine">Board week <input class="week-slider" type="range" min="1" max="6" value="${week}" aria-label="Season week"></label>
    </div>
    <section id="relic"><div id="relic-slot"></div></section>
    <section id="board">
      <h2>Faction Wars season board</h2>
      <p class="rule" id="score-rule">${esc(SCORE_RULE)}</p>
      <p class="swipe-hint fine">Swipe sideways for the point split.</p>
      <div id="board-slot"></div>
    </section>
    <section id="rivalry"><div id="rival-slot"></div></section>
    <div class="two-col">
      <section id="quests" class="panel">
        <h2>Quest board</h2>
        <p class="fine">Weekly co-op goals. Celebrate plays a local success chime if sound is on.</p>
        <div id="quest-slot"></div>
      </section>
      <section id="rewards" class="panel">
        <h2>Season rewards</h2>
        <p>${esc(leaderFaction.name)} leads the six-week sample total at <strong>${fmt(leader.total)}</strong>. ${next ? `Next trophy: ${esc(next.name)} at ${fmt(next.need)}.` : "Season Relic threshold cleared."}</p>
        <div class="bar" role="progressbar" aria-valuenow="${leader.total}" aria-valuemin="0" aria-valuemax="${REWARDS[REWARDS.length - 1].need}"><span data-w="${pct}%" style="--faction:${leaderFaction.color}"></span></div>
        <div class="reward-track">${rewards}</div>
      </section>
    </div>
    <section id="map" class="panel">
      <h2>Territory map</h2>
      <p class="fine">Strongholds stay put. Contested zones move with the week. Hover or tap a tile.</p>
      <div id="map-slot"></div>
      <div class="map-controls">
        <label class="fine">Map week <input class="week-slider" type="range" min="1" max="6" value="${week}" aria-label="Map week"></label>
      </div>
      <div id="zone-readout" class="zone-readout panel"></div>
      <div class="legend">${FACTIONS.map((faction) => `<span style="--faction:${faction.color}"><i class="swatch" aria-hidden="true"></i><img src="${faction.icon}" alt="">${esc(faction.name)}</span>`).join("")}</div>
    </section>
    <section id="council">
      <h2>Faction council</h2>
      <p class="fine">Sample badges. They mark a role, not a balance.</p>
      <div class="council-grid">${council}</div>
    </section>
    <section id="recruit">
      <h2>Recruitment board</h2>
      <div class="recruit-grid">${recruitCards}</div>
    </section>
    <section id="feed">
      <h2>War room</h2>
      <p class="fine">Sample posts. Reactions stay in this browser.</p>
      <div class="feed">${feed}</div>
    </section>`;
}

function hallOverview(faction) {
  const season = seasonTotals().find((row) => row.id === faction.id);
  return `
    <ul class="hall-stats">
      <li><b id="hall-rank">-</b><span>Week rank</span></li>
      <li><b id="hall-score">0</b><span>Week score</span></li>
      <li><b>${fmt(faction.members)}</b><span>Sample members</span></li>
      <li><b id="hall-season">${fmt(season.total)}</b><span>Season total</span></li>
    </ul>
    <div class="weekbar">
      <span class="kicker">Week score</span>
      ${weekButtons()}
    </div>
    <div class="two-col">
      <article class="panel">
        <h2>Lore</h2>
        ${faction.lore.map((line) => `<p>${esc(line)}</p>`).join("")}
        <p><a href="wiki.html#${faction.id}">Wiki entry</a></p>
      </article>
      <article class="panel">
        <h2>Top members</h2>
        <p class="fine">Sample contributors. Their points are a slice of activity, not a wallet readout.</p>
        ${faction.roster.map((member) => `
          <div class="badge"><img class="avatar" src="${FACES[member.face]}" alt="" width="36" height="36"><span>${esc(member.name)} · ${fmt(member.pts)} pts</span></div>`).join("")}
      </article>
    </div>
    <article class="panel">
      <h2>Council badges</h2>
      ${faction.council.map((badge) => `
        <div class="badge">${medalImg(badge.medal)}<span><b>${esc(badge.role)}</b> ${esc(badge.holder)}</span></div>`).join("")}
    </article>`;
}

function factionVaultHtml(faction) {
  const members = ITEMS.filter((item) => item.faction === faction.id);
  const shots = [
    { src: faction.icon, caption: `${faction.name} icon` },
    { src: faction.head, caption: `${faction.name} portrait` },
    ...faction.roster.map((member) => ({ src: FACES[member.face], caption: member.name })),
    ...members.slice(0, 4).map((item) => ({ src: faction.icon, caption: item.name })),
  ];
  const posts = [
    ...FEED.filter((post) => post.faction === faction.id).map((post) => ({
      name: post.name,
      ago: post.ago,
      text: post.text,
    })),
    { name: "vault_pin", ago: "pinned", text: `${faction.name} vault pin: the art on this wall is from the media kit.` },
    { name: "war_note", ago: "sample", text: `${faction.name} war-room note: points still come from quests, sets, events, and game results.` },
  ];
  return `
    <section class="panel" id="faction-vault">
      <h2>Faction Vault</h2>
      <p class="fine">Member art for ${esc(faction.name)}. Sample gallery. No live metadata.</p>
      <div class="gallery">
        ${shots.map((shot) => `
          <figure>
            <img src="${shot.src}" alt="${esc(shot.caption)}">
            <figcaption>${esc(shot.caption)}</figcaption>
          </figure>`).join("")}
      </div>
    </section>
    <article class="panel">
      <h2>Pinned lore</h2>
      <p><span class="sample-pill">Pinned</span></p>
      <p>${esc(faction.lore[0])}</p>
      ${faction.lore.slice(1).map((line) => `<p>${esc(line)}</p>`).join("")}
      <p>${esc(faction.onRecord)}</p>
    </article>
    <section class="panel">
      <h2>War room</h2>
      <p class="fine">Sample posts for this hall.</p>
      ${posts.map((post) => `
        <article class="vault-post">
          <p class="fine">${esc(post.name)} · ${esc(post.ago)}</p>
          <p>${esc(post.text)}</p>
        </article>`).join("")}
    </section>`;
}

function hallHtml(faction) {
  return `
    <p><a href="#halls">Back to Faction Wars</a></p>
    <section class="hall-banner panel" style="--faction:${faction.color}">
      <img class="hall-head" src="${faction.head}" alt="${esc(faction.name)} portrait">
      <div>
        <p class="kicker">${esc(faction.role)}</p>
        <h2>${esc(faction.name)}</h2>
        <p>${esc(faction.title)}</p>
        <p>${esc(faction.onRecord)}</p>
      </div>
      <img class="hall-icon" src="${faction.icon}" alt="">
    </section>
    <div class="hall-tabs" role="tablist" aria-label="${esc(faction.name)} sections">
      <button type="button" class="pixel-btn small" data-hall-tab="overview" aria-pressed="${hallTab === "overview"}">Hall</button>
      <button type="button" class="pixel-btn ghost small" data-hall-tab="vault" aria-pressed="${hallTab === "vault"}">Faction Vault</button>
    </div>
    <div id="hall-body">${hallTab === "vault" ? factionVaultHtml(faction) : hallOverview(faction)}</div>`;
}

function relicHtml() {
  const rows = standings(week);
  const holder = factionById(rows[0].id);
  return `<article class="relic panel swap" style="--faction:${holder.color}">
    <div class="relic-stage">
      <img class="relic-medal" src="${MEDALS.giga}" alt="Giga medal, the week relic">
      <img class="relic-head" src="${holder.head}" alt="">
    </div>
    <div>
      <p class="kicker">Relic of the week</p>
      <h2 id="relic-name">${esc(holder.name)} holds the relic</h2>
      <p>Week ${week} sample leader with ${fmt(rows[0].total)} points. The relic rotates when the week changes. It follows activity, not wallet size.</p>
    </div>
  </article>`;
}

function boardHtml() {
  const rows = standings(week);
  const body = rows.map((row, index) => {
    const faction = factionById(row.id);
    const medal = RANK_MEDAL[index];
    return `<tr>
      <td>${medal ? medalImg(medal) : ""} ${index + 1}</td>
      <td><a class="faction-cell" href="#${faction.id}"><img src="${faction.icon}" alt="">${esc(faction.name)}</a></td>
      <td class="num">${fmt(row.activity)}</td>
      <td class="num">${fmt(row.sets)}</td>
      <td class="num">${fmt(row.events)}</td>
      <td class="num">${fmt(row.quests)}</td>
      <td class="num"><strong>${fmt(row.total)}</strong></td>
    </tr>`;
  }).join("");
  return `<div class="table-wrap"><table data-leader="${rows[0].id}">
    <thead><tr>
      <th>Rank</th><th>Faction</th>
      <th class="num" title="Holder activity, including game results">Activity</th>
      <th class="num">Sets</th><th class="num">Events</th><th class="num">Quests</th><th class="num">Total</th>
    </tr></thead>
    <tbody>${body}</tbody>
  </table></div>`;
}

function rivalHtml() {
  const [leftId, rightId] = rivalry(week);
  const rows = standings(week);
  const left = rows.find((row) => row.id === leftId);
  const right = rows.find((row) => row.id === rightId);
  const max = Math.max(left.total, right.total, 1);
  const seed = RIVAL_SEED[week];
  const pick = votes[String(week)] || null;
  const leftVotes = seed[leftId] + (pick === leftId ? 1 : 0);
  const rightVotes = seed[rightId] + (pick === rightId ? 1 : 0);
  const voteMax = Math.max(leftVotes, rightVotes, 1);
  const card = (row, votesNow, pressed) => {
    const faction = factionById(row.id);
    const scorePct = Math.round((row.total / max) * 100);
    const votePct = Math.round((votesNow / voteMax) * 100);
    return `<article class="rival-card" style="--faction:${faction.color}">
      <img class="head" src="${faction.head}" alt="">
      <h3>${esc(faction.name)}</h3>
      <p class="bar-label">Week score</p>
      <p class="fine">${fmt(row.total)} week pts</p>
      <div class="bar" aria-label="Week score"><span data-w="${scorePct}%" style="--faction:${faction.color}"></span></div>
      <p class="bar-label">Vote share</p>
      <button type="button" class="pixel-btn small" data-rival="${faction.id}" aria-pressed="${pressed}">${pressed ? "Voted" : "Demo vote"} ${votesNow}</button>
      <div class="bar" aria-label="Vote share"><span data-w="${votePct}%" style="--faction:${faction.color}"></span></div>
    </article>`;
  };
  return `<h2>Rivalry of the week</h2>
    <p class="fine">Score bars are the week table. The vote is a local demo and does not award points.</p>
    <div class="rival">
      ${card(left, leftVotes, pick === leftId)}
      ${card(right, rightVotes, pick === rightId)}
    </div>`;
}

function questHtml() {
  return questsFor(week).map((quest) => {
    const pct = Math.min(100, Math.round((quest.current / quest.goal) * 100));
    const done = quest.current >= quest.goal;
    const cheered = cheers.has(quest.id);
    return `<article class="quest">
      <h3>${esc(quest.title)}</h3>
      <p class="fine">${esc(quest.detail)} ${fmt(quest.current)} / ${fmt(quest.goal)}</p>
      <div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="${quest.goal}" aria-valuenow="${Math.min(quest.current, quest.goal)}">
        <span data-w="${pct}%" style="--faction:#ffd15a"></span>
      </div>
      ${done ? `<button type="button" class="pixel-btn small" data-cheer="${quest.id}">${cheered ? "Cheered" : "Celebrate"}</button>` : ""}
    </article>`;
  }).join("");
}

function mapHtml() {
  const seen = new Set();
  return `<div class="map">${MAP_ROWS.map((row) => [...row].map((letter) => {
    if (letter === ".") return `<span class="cell void"></span>`;
    const owner = zoneOwner(week, letter);
    const faction = factionById(owner);
    const anchor = !seen.has(letter);
    seen.add(letter);
    const hot = letter === pinnedZone ? " hot" : "";
    return `<button type="button" class="cell zone${hot}" data-zone="${letter}" data-owner="${owner}" style="--faction:${faction.color}" aria-label="${esc(ZONES[letter])}, ${esc(faction.name)}">${anchor ? `<img src="${faction.icon}" alt="">` : ""}</button>`;
  }).join("")).join("")}</div>`;
}

function readoutHtml() {
  const owner = zoneOwner(week, pinnedZone);
  const faction = factionById(owner);
  return `<img src="${faction.icon}" alt="" width="28" height="28"><span><strong>${esc(ZONES[pinnedZone])}</strong> · ${esc(faction.name)} · ${fmt(zonePoints(week, pinnedZone))} pts</span>`;
}

function animateBars(root) {
  requestAnimationFrame(() => {
    root.querySelectorAll(".bar > span").forEach((bar) => {
      bar.style.width = bar.dataset.w || "0%";
    });
  });
}

function syncWeekControls() {
  document.querySelectorAll(".week-btn").forEach((button) => {
    button.setAttribute("aria-pressed", Number(button.dataset.week) === week ? "true" : "false");
  });
  document.querySelectorAll(".week-slider").forEach((slider) => {
    if (document.activeElement !== slider) slider.value = String(week);
  });
}

function fillHall(faction) {
  const rows = standings(week);
  const row = rows.find((entry) => entry.id === faction.id);
  const rank = document.getElementById("hall-rank");
  const score = document.getElementById("hall-score");
  if (rank) rank.textContent = String(rows.findIndex((entry) => entry.id === faction.id) + 1);
  if (score) score.textContent = fmt(row.total);
  syncWeekControls();
}

function fillWars() {
  const relic = document.getElementById("relic-slot");
  const board = document.getElementById("board-slot");
  const rival = document.getElementById("rival-slot");
  const quests = document.getElementById("quest-slot");
  const map = document.getElementById("map-slot");
  const readout = document.getElementById("zone-readout");
  if (!relic) return;
  relic.innerHTML = relicHtml();
  board.innerHTML = boardHtml();
  rival.innerHTML = rivalHtml();
  quests.innerHTML = questHtml();
  map.innerHTML = mapHtml();
  readout.innerHTML = readoutHtml();
  syncWeekControls();
  animateBars(app);
}

function render(scroll) {
  const hash = location.hash.replace("#", "");
  const faction = factionById(hash);
  const mode = faction ? `hall:${faction.id}` : "wars";
  if (builtFor !== mode) {
    hallTab = "overview";
    builtFor = mode;
    app.innerHTML = faction ? hallHtml(faction) : warsHtml();
    animateBars(app);
  }
  if (faction) fillHall(faction);
  else fillWars();
  if (scroll && hash && !faction) document.getElementById(hash)?.scrollIntoView();
  if (scroll && faction) window.scrollTo(0, 0);
}

function setWeek(next) {
  stopPlay();
  const play = document.getElementById("play-weeks");
  if (play) play.textContent = "Play weeks";
  week = next;
  const faction = factionById(location.hash.replace("#", ""));
  if (faction) fillHall(faction);
  else fillWars();
}

app.addEventListener("click", (event) => {
  const tab = event.target.closest("[data-hall-tab]");
  if (tab) {
    const faction = factionById(location.hash.replace("#", ""));
    if (!faction) return;
    hallTab = tab.dataset.hallTab === "vault" ? "vault" : "overview";
    document.querySelectorAll("[data-hall-tab]").forEach((button) => {
      const on = button.dataset.hallTab === hallTab;
      button.setAttribute("aria-pressed", on ? "true" : "false");
      button.classList.toggle("ghost", !on);
    });
    document.getElementById("hall-body").innerHTML = hallTab === "vault" ? factionVaultHtml(faction) : hallOverview(faction);
    if (hallTab === "overview") fillHall(faction);
    return;
  }
  const weekBtn = event.target.closest("[data-week]");
  if (weekBtn) {
    setWeek(Number(weekBtn.dataset.week));
    return;
  }
  if (event.target.id === "play-weeks") {
    if (playing) {
      stopPlay();
      event.target.textContent = "Play weeks";
    } else {
      playing = true;
      event.target.textContent = "Stop";
      playTimer = setInterval(() => {
        week = week >= 6 ? 1 : week + 1;
        fillWars();
      }, 900);
    }
    return;
  }
  const zone = event.target.closest("[data-zone]");
  if (zone) {
    pinnedZone = zone.dataset.zone;
    document.querySelectorAll("[data-zone]").forEach((cell) => cell.classList.toggle("hot", cell.dataset.zone === pinnedZone));
    document.getElementById("zone-readout").innerHTML = readoutHtml();
    return;
  }
  const cheer = event.target.closest("[data-cheer]");
  if (cheer) {
    cheers.add(cheer.dataset.cheer);
    writeStore("glhf-cheers", [...cheers]);
    cheer.textContent = "Cheered";
    playSuccess();
    return;
  }
  const react = event.target.closest("[data-react]");
  if (react) {
    const key = react.dataset.react;
    reactions[key] = (reactions[key] || 0) + 1;
    writeStore("glhf-reacts", reactions);
    const count = react.querySelector(".count");
    count.textContent = String(Number(count.textContent) + 1);
    return;
  }
  const recruit = event.target.closest("[data-recruit]");
  if (recruit) {
    const id = recruit.dataset.recruit;
    if (recruits.has(id)) recruits.delete(id);
    else recruits.add(id);
    writeStore("glhf-recruit", [...recruits]);
    const on = recruits.has(id);
    recruit.setAttribute("aria-pressed", on ? "true" : "false");
    recruit.textContent = on ? "Noted" : "Signal interest";
    return;
  }
  const rival = event.target.closest("[data-rival]");
  if (rival) {
    votes[String(week)] = rival.dataset.rival;
    writeStore("glhf-rivalry", votes);
    fillWars();
  }
});

app.addEventListener("input", (event) => {
  if (!event.target.classList.contains("week-slider")) return;
  setWeek(Number(event.target.value));
});

app.addEventListener("mouseover", (event) => {
  const zone = event.target.closest("[data-zone]");
  if (!zone || zone.dataset.zone === pinnedZone) return;
  pinnedZone = zone.dataset.zone;
  document.querySelectorAll("[data-zone]").forEach((cell) => cell.classList.toggle("hot", cell.dataset.zone === pinnedZone));
  const readout = document.getElementById("zone-readout");
  if (readout) readout.innerHTML = readoutHtml();
});

app.addEventListener("focusin", (event) => {
  const zone = event.target.closest("[data-zone]");
  if (!zone) return;
  pinnedZone = zone.dataset.zone;
  document.getElementById("zone-readout").innerHTML = readoutHtml();
});

window.addEventListener("hashchange", () => {
  stopPlay();
  render(true);
});

render(true);
