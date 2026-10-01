import { ART } from "./art.js";
import {
  BASE_BURN,
  BASE_NAMES,
  DEMO_ADDRESS,
  MEDALS,
  ORIGINAL_SUPPLY,
  ROM_SUPPLY,
  factionById,
  ITEMS,
  itemsByIds,
  VAULT_IDS,
} from "./data.js";
import { HEALTH } from "./health.js";

export const SNAPSHOT_DATE = "2026-09-18";
export const TENURE_ANCHOR = "2024-01-15";
export const EARLIEST_HOLD = "2024-02-02";
export const PAGE_SIZE = 12;

const TIER_RANK = { Giga: 4, Void: 3, Gold: 2, Silver: 1 };

const EMBLEM_SRC = ART.emblems;

const OTHER_HOLDERS = [
  { handle: "floor_whale", address: "0xSAMP…01", glhf: 48, rom: 62 },
  { handle: "keep_stack", address: "0xSAMP…02", glhf: 36, rom: 44 },
  { handle: "void_bin", address: "0xSAMP…03", glhf: 30, rom: 28 },
  { handle: "gold_row", address: "0xSAMP…04", glhf: 22, rom: 24 },
  { handle: "silver_run", address: "0xSAMP…05", glhf: 18, rom: 20 },
  { handle: "gate_call", address: "0xSAMP…06", glhf: 16, rom: 14 },
  { handle: "hex_bloom", address: "0xSAMP…07", glhf: 12, rom: 12 },
  { handle: "ring_eye", address: "0xSAMP…08", glhf: 10, rom: 8 },
  { handle: "quiet_helm", address: "0xSAMP…09", glhf: 9, rom: 4 },
  { handle: "north_quill", address: "0xSAMP…10", glhf: 6, rom: 6 },
  { handle: "oath_blade", address: "0xSAMP…11", glhf: 4, rom: 7 },
  { handle: "garden_hex", address: "0xSAMP…12", glhf: 7, rom: 3 },
  { handle: "stall_call", address: "0xSAMP…13", glhf: 2, rom: 6 },
  { handle: "camp_drum", address: "0xSAMP…14", glhf: 5, rom: 2 },
  { handle: "archive_moth", address: "0xSAMP…15", glhf: 3, rom: 3 },
];

export const SCORE_BANDS = [
  { min: 0, max: 39, name: "Starter", medal: "wood", requirement: "Example partner requirement: hold 1 GLHFer and join the project list." },
  { min: 40, max: 59, name: "Regular", medal: "copper", requirement: "Example partner requirement: raffle entry for 20 whitelist spots." },
  { min: 60, max: 79, name: "Veteran", medal: "iron", requirement: "Example partner requirement: guaranteed whitelist, 5 spots." },
  { min: 80, max: 100, name: "Archivist", medal: "giga", requirement: "Example partner requirement: one claim from a 10-piece partner drop." },
];

export const CLANS = [
  {
    id: "henchmen",
    name: "Auctioneer's Henchmen",
    art: ART.gifs.auctioneer,
    focus: "Burn watch",
    members: 48,
    demoMember: true,
    blurb: "A player-formed guild that logs sample Auctioneer burns. It is not a lore faction.",
    mix: [
      ["crusader", 12], ["archon", 8], ["athena", 6], ["summoner", 7],
      ["foxglove", 5], ["overseer", 4], ["chobo", 3], ["gigus", 3],
    ],
    roster: [
      ["noob_demo", DEMO_ADDRESS, "gigus"],
      ["red_banner", "0xSAMP…01", "crusader"],
      ["oathkeeper", "0xSAMP…11", "archon"],
      ["late_summon", "0xSAMP…06", "summoner"],
    ],
  },
  {
    id: "regulars",
    name: "Lobby Regulars",
    art: ART.faces.happy,
    focus: "Social",
    members: 120,
    demoMember: false,
    blurb: "Sample guild for people who show up on event nights. Membership is not a faction.",
    mix: [
      ["chobo", 28], ["athena", 22], ["foxglove", 18], ["crusader", 16],
      ["archon", 14], ["summoner", 12], ["overseer", 8], ["gigus", 2],
    ],
    roster: [
      ["sprint_kid", "0xSAMP…21", "chobo"],
      ["star_draft", "0xSAMP…22", "athena"],
      ["hex_bloom", "0xSAMP…23", "foxglove"],
      ["camp_drum", "0xSAMP…24", "chobo"],
    ],
  },
  {
    id: "stub40",
    name: "Stub 40 Club",
    art: ART.medals.iron,
    focus: "Stub level",
    members: 36,
    demoMember: false,
    blurb: "Player guild for sample pieces at stub 40 or higher. The Stub Club badge stays on Badges.",
    mix: [
      ["overseer", 8], ["summoner", 7], ["archon", 6], ["crusader", 5],
      ["athena", 4], ["foxglove", 3], ["chobo", 2], ["gigus", 1],
    ],
    roster: [
      ["ring_eye", "0xSAMP…31", "overseer"],
      ["book_warm", "0xSAMP…32", "summoner"],
      ["keep_watch", "0xSAMP…33", "crusader"],
      ["quiet_log", "0xSAMP…34", "overseer"],
    ],
  },
  {
    id: "callers",
    name: "Sunday Callers",
    art: ART.heads.summoner,
    focus: "Quests",
    members: 64,
    demoMember: false,
    blurb: "Cross-faction guild that rings co-op quests. Faction Wars still scores the halls, not this roster.",
    mix: [
      ["summoner", 16], ["chobo", 12], ["athena", 10], ["crusader", 8],
      ["foxglove", 7], ["archon", 6], ["overseer", 4], ["gigus", 1],
    ],
    roster: [
      ["gate_call", "0xSAMP…41", "summoner"],
      ["green_dash", "0xSAMP…42", "chobo"],
      ["north_quill", "0xSAMP…43", "athena"],
      ["banner_mute", "0xSAMP…44", "archon"],
    ],
  },
];

export function baseTraitRows() {
  const counts = new Map(BASE_NAMES.map((name) => [name, 0]));
  ITEMS.forEach((item) => {
    if (item.collection === "GLHFers" && counts.has(item.base)) {
      counts.set(item.base, counts.get(item.base) + 1);
    }
  });
  return BASE_NAMES.map((name) => ({
    name,
    count: counts.get(name),
    src: emblemSrc(name),
  })).sort((a, b) => a.count - b.count || a.name.localeCompare(b.name));
}

export function emblemSrc(name) {
  const index = BASE_NAMES.indexOf(name);
  return EMBLEM_SRC[index >= 0 ? index : 0];
}

export function walletTier(total) {
  if (total >= 400) return { id: "archive", name: "Archive", medal: "gold" };
  if (total >= 80) return { id: "vault", name: "Vault", medal: "iron" };
  if (total >= 15) return { id: "stack", name: "Stack", medal: "copper" };
  if (total >= 6) return { id: "keeper", name: "Keeper", medal: "stone" };
  return { id: "holder", name: "Holder", medal: "wood" };
}

export function rarityScore(item) {
  if (item.special) return 9000;
  return (TIER_RANK[item.tier] || 0) * 1000 + (item.stub || 0);
}

export function byRarest(a, b) {
  return rarityScore(b) - rarityScore(a) || a.serial - b.serial;
}

export function tenurePoints(earliest = EARLIEST_HOLD, snapshot = SNAPSHOT_DATE) {
  const start = Date.parse(`${TENURE_ANCHOR}T00:00:00Z`);
  const end = Date.parse(`${snapshot}T00:00:00Z`);
  const first = Date.parse(`${earliest}T00:00:00Z`);
  const frac = (end - first) / (end - start);
  return Math.max(0, Math.min(30, Math.round(frac * 30)));
}

export function demoProfile() {
  const holdings = itemsByIds(VAULT_IDS);
  const glhf = holdings.filter((item) => item.collection === "GLHFers");
  const roms = holdings.filter((item) => item.collection === "ROMs");
  const earned = new Set(glhf.map((item) => item.base).filter(Boolean));
  const emblems = BASE_NAMES.map((name) => ({
    name,
    earned: earned.has(name),
    src: emblemSrc(name),
  }));
  const earnedCount = emblems.filter((row) => row.earned).length;
  const pieces = holdings.length;
  const fullStack = glhf.length > 0 && roms.length > 0;
  const collectParts = {
    fullStack: fullStack ? 12 : 0,
    emblems: Math.round((earnedCount / BASE_NAMES.length) * 16),
    pieces: Math.min(12, Math.round(pieces * 0.5)),
  };
  const collect = collectParts.fullStack + collectParts.emblems + collectParts.pieces;
  const tenure = tenurePoints();
  const total = collect + tenure;
  return {
    address: DEMO_ADDRESS,
    handle: "noob_demo",
    holdings,
    glhf,
    roms,
    emblems,
    earnedCount,
    pieces,
    fullStack,
    collectParts,
    collect,
    tenure,
    total,
    max: 100,
    tier: walletTier(pieces),
    slots: [
      ...glhf.slice().sort(byRarest).slice(0, 2),
      ...roms.slice().sort(byRarest).slice(0, 2),
    ],
    top: holdings.slice().sort(byRarest).slice(0, 3),
    snapshotDate: SNAPSHOT_DATE,
    earliest: EARLIEST_HOLD,
  };
}

export function holderBoard() {
  const profile = demoProfile();
  const rows = OTHER_HOLDERS.map((row) => ({ ...row, demo: false })).concat({
    handle: profile.handle,
    address: profile.address,
    glhf: profile.glhf.length,
    rom: profile.roms.length,
    demo: true,
  });
  rows.sort((a, b) => (b.glhf + b.rom) - (a.glhf + a.rom) || a.address.localeCompare(b.address));
  return rows.map((row, index) => {
    const total = row.glhf + row.rom;
    return { ...row, total, rank: index + 1, tier: walletTier(total) };
  });
}

export function boardShares() {
  const top = holderBoard().slice(0, 10);
  const glhf = top.reduce((sum, row) => sum + row.glhf, 0);
  const rom = top.reduce((sum, row) => sum + row.rom, 0);
  const circulating = ORIGINAL_SUPPLY - BASE_BURN;
  return {
    glhf,
    rom,
    glhfPct: (glhf / circulating) * 100,
    romPct: (rom / ROM_SUPPLY) * 100,
  };
}

export function glhfHolders() {
  return HEALTH.holders;
}

export function glhfDistribution() {
  return [
    { label: "1", holders: 1680 },
    { label: "2–5", holders: 590 },
    { label: "6–10", holders: 112 },
    { label: "11–25", holders: 22 },
    { label: "26+", holders: 6 },
  ];
}

export const ROM_HOLDERS = 4545;

export function romDistribution() {
  return [
    { label: "1", holders: 2442 },
    { label: "2–5", holders: 2087 },
    { label: "6–10", holders: 7 },
    { label: "11–25", holders: 3 },
    { label: "26+", holders: 6 },
  ];
}

export const BOTH_HOLDERS = 612;

export function circulatingSupply() {
  return ORIGINAL_SUPPLY - BASE_BURN;
}

export function medalForRank(rank) {
  if (rank <= 1) return MEDALS.giga;
  if (rank <= 3) return MEDALS.gold;
  if (rank <= 10) return MEDALS.iron;
  if (rank <= 25) return MEDALS.copper;
  return MEDALS.stone;
}

export function factionMix(pairs) {
  return pairs.map(([id, count]) => ({ faction: factionById(id), count }));
}

export function clanById(id) {
  return CLANS.find((clan) => clan.id === id) || null;
}
