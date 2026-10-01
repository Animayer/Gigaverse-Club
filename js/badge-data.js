import { itemsByIds, MEDALS, VAULT_IDS } from "./data.js";
import { esc } from "./util.js";

const TIER_MEDAL = {
  bronze: MEDALS.copper,
  silver: MEDALS.iron,
  gold: MEDALS.gold,
};

const TIER_ORDER = ["bronze", "silver", "gold"];

function tierRow(name, current, goal) {
  const earned = current >= goal;
  const shown = Math.min(current, goal);
  const pct = Math.min(100, Math.round((shown / goal) * 100));
  return { name, current: shown, goal, earned, pct };
}

function pack(id, name, blurb, rows) {
  return { id, name, blurb, tiers: rows.map(([name, current, goal]) => tierRow(name, current, goal)) };
}

export function demoBadges() {
  const holdings = itemsByIds(VAULT_IDS);
  const factionCount = new Set(holdings.map((item) => item.faction).filter((id) => id !== "gigus")).size;
  const chains = new Set(holdings.map((item) => item.collection)).size;
  const giga = holdings.filter((item) => item.tier === "Giga").length;
  const highStub = holdings.filter((item) => item.stub >= 40).length;
  const warsPoints = 640;

  return [
    pack("first-vault", "First Vault", "Open the demo vault. Sample profile, not a signature.", [
      ["bronze", 1, 1],
      ["silver", 1, 3],
      ["gold", 1, 8],
    ]),
    pack("set-complete", "Set Complete", "Both collections in the demo vault close the bronze set. Higher tiers stay open.", [
      ["bronze", chains, 2],
      ["silver", giga, 4],
      ["gold", highStub, 8],
    ]),
    pack("faction-veteran", "Faction Veteran", "Masters touched by the demo vault. Gigus is lore and does not count.", [
      ["bronze", factionCount, 2],
      ["silver", factionCount, 4],
      ["gold", factionCount, 7],
    ]),
    pack("burn-witness", "Burn Witness", "Watched the sample burn counter. The gold tier waits on a burn this mockup does not record.", [
      ["bronze", 1, 1],
      ["silver", 4, 12],
      ["gold", 0, 1],
    ]),
    pack("event-winner", "Event Winner", "One sample event slip is marked earned. Season repeats stay locked.", [
      ["bronze", 1, 1],
      ["silver", 1, 3],
      ["gold", 1, 6],
    ]),
    pack("deep-diver", "Deep Diver", "Read sample deep dives on the wiki. Writing one does not save, so it does not raise this bar.", [
      ["bronze", 1, 1],
      ["silver", 2, 4],
      ["gold", 2, 8],
    ]),
    pack("party-planner", "Party Planner", "The demo profile already named a three-slot party. A five-slot share is still open.", [
      ["bronze", 1, 1],
      ["silver", 3, 5],
      ["gold", 0, 1],
    ]),
    pack("season-champion", "Season Champion", "Faction Wars points can unlock this badge. The 640 sample points are activity, not a wallet.", [
      ["bronze", warsPoints, 500],
      ["silver", warsPoints, 1200],
      ["gold", warsPoints, 2000],
    ]),
    pack("giga-sighting", "Giga Sighting", "Giga-tier chips in the demo vault.", [
      ["bronze", giga, 1],
      ["silver", giga, 3],
      ["gold", giga, 6],
    ]),
    pack("stub-club", "Stub Club", "Stub level 40 and up in the demo vault. Gold asks for a full club of eight.", [
      ["bronze", highStub, 1],
      ["silver", highStub, 4],
      ["gold", highStub, 8],
    ]),
    pack("lore-scribe", "Lore Scribe", "Write a deep dive stays a demo form. Nothing is stored, so every tier stays locked.", [
      ["bronze", 0, 1],
      ["silver", 0, 3],
      ["gold", 0, 5],
    ]),
    pack("collection-tour", "Collection Tour", "Sample explorer visits. Not a chain indexer.", [
      ["bronze", 1, 1],
      ["silver", 2, 4],
      ["gold", 2, 6],
    ]),
  ];
}

export function highestTier(badge) {
  let found = null;
  TIER_ORDER.forEach((name) => {
    const tier = badge.tiers.find((row) => row.name === name);
    if (tier?.earned) found = name;
  });
  return found;
}

export function tierMedal(name) {
  return TIER_MEDAL[name] || MEDALS.wood;
}

export function badgeStripMarkup(badges = demoBadges()) {
  return badges.filter((badge) => highestTier(badge)).map((badge) => {
    const tier = highestTier(badge);
    return `<a class="badge-pill" href="badges.html#${badge.id}">
      <img src="${tierMedal(tier)}" alt="">
      <span>${esc(badge.name)}</span>
      <small>${tier}</small>
    </a>`;
  }).join("");
}
