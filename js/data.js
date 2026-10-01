import { ART } from "./art.js";
import { GLHFERS } from "./glhfers.js";

export const BASE_BURN = 420;
export const ORIGINAL_SUPPLY = 3690;
export const ROM_SUPPLY = 10000;

export const MEDALS = ART.medals;

export const RANK_MEDAL = ["giga", "gold", "iron", "copper", "stone", "wood"];

export const TIER_COLOR = {
  Silver: "#d5deea",
  Gold: "#ffd15a",
  Void: "#c084fc",
  Giga: "#5dffe8",
};

export const FACES = ART.faces;

const FACE_LABEL = {
  default: "Default", happy: "Happy", shades: "Shades", anger: "Anger", yay: "Yay",
  cry: "Cry", bigeyes: "Big eyes", uwu: "Uwu", orly: "Orly", ded: "Ded",
  blush: "Blush", clown: "Clown", look: "Look", pain: "Pain", really: "Really",
  sadge: "Sadge", sideeye: "Side eye", unimpressed: "Unimpressed", yay2: "Yay 2",
};

const HEAD_LABEL = {
  archon: "Archon", athena: "Athena", chobo: "Chobo", crusader: "Crusader",
  foxglove: "Foxglove", overseer: "Overseer", summoner: "Summoner", knight: "Knight",
  blackknight: "Black knight", crow: "Crow", greycloak: "Grey cloak", redcloak: "Red cloak",
  boss: "Boss", impaler: "Impaler", enemy: "Enemy",
};

export const AVATARS = [
  { id: "giganoob", group: "Sprites", label: "Giganoob", src: ART.sprites.giganoob },
  { id: "clean", group: "Sprites", label: "Clean noob", src: ART.sprites.clean },
  { id: "dance", group: "Sprites", label: "Dance", src: ART.reactions.dance },
  { id: "praise", group: "Sprites", label: "Praise", src: ART.reactions.praise },
  { id: "haha", group: "Sprites", label: "Haha", src: ART.reactions.haha },
  { id: "running", group: "Sprites", label: "Running", src: ART.reactions.running },
  ...Object.entries(ART.faces).map(([id, src]) => ({
    id,
    group: "Expressions",
    label: FACE_LABEL[id] || id,
    src,
  })),
  ...Object.entries(ART.heads).map(([id, src]) => ({
    id: `head-${id}`,
    group: "Heads",
    label: HEAD_LABEL[id] || id,
    src,
  })),
  ...Object.entries(ART.sideHeads).map(([id, src]) => ({
    id: `side-${id}`,
    group: "Profiles",
    label: HEAD_LABEL[id] || id,
    src,
  })),
];

const MASTERS = [
  {
    id: "archon",
    name: "Archon",
    title: "Master of the Citadel",
    role: "Oathkeeper",
    color: "#e2b143",
    icon: "assets/factions/Faction_Archon_Transparant.png",
    head: "assets/heads/archon_front.png",
    members: 842,
    onRecord: "One of the seven Masters of the Gigaverse, and a GLHFers Special Character.",
    lore: [
      "Sample lore: Archon keeps the Citadel oaths and lights the week clock when Faction Wars open.",
      "Sample lore: The hall logs quests, sets, events, and game results. A heavier wallet does not buy a higher rank.",
    ],
    roster: [
      ["oathkeeper", "shades", 186],
      ["gilded_noob", "happy", 142],
      ["citadel_jan", "default", 121],
      ["banner_mute", "orly", 98],
    ],
    council: [
      ["High Seat", "oathkeeper", "giga"],
      ["Quartermaster", "gilded_noob", "gold"],
      ["Herald", "citadel_jan", "iron"],
    ],
  },
  {
    id: "athena",
    name: "Athena",
    title: "Master of the Star Court",
    role: "Strategist",
    color: "#6ec8ff",
    icon: "assets/factions/Faction_Athena_Transparant.png",
    head: "assets/heads/athena_front.png",
    members: 796,
    onRecord: "One of the seven Masters of the Gigaverse, and a GLHFers Special Character.",
    lore: [
      "Sample lore: Athena drafts the weekly rivalry and likes a fight that can be read on a map.",
      "Sample lore: Star Court points come from calls that land: finished sets, event wins, and logged games.",
    ],
    roster: [
      ["star_draft", "bigeyes", 174],
      ["north_quill", "default", 151],
      ["blue_oath", "shades", 128],
      ["court_mime", "uwu", 101],
    ],
    council: [
      ["High Seat", "star_draft", "giga"],
      ["Mapwright", "north_quill", "gold"],
      ["Caller", "blue_oath", "copper"],
    ],
  },
  {
    id: "chobo",
    name: "Chobo",
    title: "Master of the Sprint",
    role: "Sprinter",
    color: "#8fe05a",
    icon: "assets/factions/Faction_Chobo_Transparant.png",
    head: "assets/heads/chobo_front.png",
    members: 910,
    onRecord: "One of the seven Masters of the Gigaverse, and a GLHFers Special Character.",
    lore: [
      "Sample lore: Chobo treats every quest bar like a race and recruits the loudest noobs in the lobby.",
      "Sample lore: Sprint Lane score is pace and participation. Hoard size is not on the clipboard.",
    ],
    roster: [
      ["sprint_kid", "yay", 168],
      ["camp_drum", "happy", 144],
      ["green_dash", "default", 119],
      ["nap_later", "ded", 88],
    ],
    council: [
      ["High Seat", "sprint_kid", "giga"],
      ["Pace setter", "camp_drum", "gold"],
      ["Recruiter", "green_dash", "stone"],
    ],
  },
  {
    id: "crusader",
    name: "Crusader",
    title: "Master of the Red Keep",
    role: "Banner knight",
    color: "#e23b45",
    icon: "assets/factions/Faction_Crusader_Transparant.png",
    head: "assets/heads/crusader_front.png",
    members: 864,
    onRecord: "One of the seven Masters of the Gigaverse, and a GLHFers Special Character.",
    lore: [
      "Sample lore: Crusader plants the first banner when a zone changes hands.",
      "Sample lore: Red Keep ranks the week by who showed up for the fight, not by who holds the most tokens.",
    ],
    roster: [
      ["red_banner", "anger", 191],
      ["keep_watch", "shades", 147],
      ["oath_blade", "default", 126],
      ["quiet_helm", "orly", 93],
    ],
    council: [
      ["High Seat", "red_banner", "giga"],
      ["Standard", "keep_watch", "gold"],
      ["Armorer", "oath_blade", "iron"],
    ],
  },
  {
    id: "foxglove",
    name: "Foxglove",
    title: "Master of the Hex Garden",
    role: "Hex gardener",
    color: "#d56bff",
    icon: "assets/factions/Faction_Foxglove_Transparant.png",
    head: "assets/heads/foxglove_front.png",
    members: 733,
    onRecord: "One of the seven Masters of the Gigaverse, and a GLHFers Special Character.",
    lore: [
      "Sample lore: Foxglove grows side bets in the garden and still scores them as activity.",
      "Sample lore: Hex Orchard rewards finished sets and event nights. A full vault is just scenery.",
    ],
    roster: [
      ["hex_bloom", "uwu", 177],
      ["garden_hex", "happy", 139],
      ["night_petal", "shades", 118],
      ["soil_note", "cry", 84],
    ],
    council: [
      ["High Seat", "hex_bloom", "giga"],
      ["Gardener", "garden_hex", "gold"],
      ["Scribe", "night_petal", "copper"],
    ],
  },
  {
    id: "overseer",
    name: "Overseer",
    title: "Master of the Ring",
    role: "Watcher",
    color: "#3ee0c5",
    icon: "assets/factions/Faction_Overseer_Transparant.png",
    head: "assets/heads/overseer_front.png",
    members: 705,
    onRecord: "One of the seven Masters of the Gigaverse, and a GLHFers Special Character.",
    lore: [
      "Sample lore: Overseer watches the territory grid and calls stalls before a quest bar freezes.",
      "Sample lore: Ring Tower keeps a public tally. Points move when games, quests, and events move.",
    ],
    roster: [
      ["ring_eye", "bigeyes", 183],
      ["quiet_log", "default", 150],
      ["stall_call", "orly", 122],
      ["late_watch", "ded", 90],
    ],
    council: [
      ["High Seat", "ring_eye", "giga"],
      ["Logger", "quiet_log", "iron"],
      ["Lookout", "stall_call", "stone"],
    ],
  },
  {
    id: "summoner",
    name: "Summoner",
    title: "Master of the Gate",
    role: "Caller",
    color: "#ff8a3d",
    icon: "assets/factions/Faction_Summoner_Transparant.png",
    head: "assets/heads/summoner_front.png",
    members: 771,
    onRecord: "One of the seven Masters of the Gigaverse, and a GLHFers Special Character.",
    lore: [
      "Sample lore: Summoner calls reinforcements when a co-op quest stalls at the gate.",
      "Sample lore: Gate points are the people who answered, the sets they closed, and the games they logged.",
    ],
    roster: [
      ["gate_call", "yay", 188],
      ["side_chapel", "happy", 146],
      ["book_warm", "bigeyes", 124],
      ["late_summon", "cry", 86],
    ],
    council: [
      ["High Seat", "gate_call", "giga"],
      ["Bell", "side_chapel", "gold"],
      ["Archivist", "book_warm", "copper"],
    ],
  },
];

const GIGUS = {
  id: "gigus",
  name: "Gigus",
  title: "Sentient AI, creator of Gigaverse",
  role: "Creator",
  color: "#d7e7ff",
  icon: "assets/factions/gigus1x1.png",
  head: "assets/factions/gigus1x1.png",
  members: 1204,
  onRecord: "Gigus is the sentient AI creator of Gigaverse. This hall is lore, not one of the seven Masters.",
  lore: [
    "Sample lore: Gigus does not crusade for a hoard. The hall is an archive of notes, patches, and unfinished maps.",
    "Sample lore: A sample war score is listed so the season board can show eight factions. Those points still come from logged activity, not from wallet size.",
  ],
  roster: [
    ["archive_moth", "default", 132],
    ["margin_note", "orly", 110],
    ["blank_page", "bigeyes", 96],
    ["core_hum", "shades", 80],
  ],
  council: [
    ["Archivist", "archive_moth", "gold"],
    ["Margin", "margin_note", "iron"],
    ["Keeper", "blank_page", "stone"],
  ],
};

function expandFaction(raw) {
  return {
    ...raw,
    icon: ART.factionIcons[raw.id] || raw.icon,
    head: ART.heads[raw.id] || raw.head,
    roster: raw.roster.map(([name, face, pts]) => ({ name, face, pts })),
    council: raw.council.map(([role, holder, medal]) => ({ role, holder, medal })),
  };
}

export const FACTIONS = [...MASTERS, GIGUS].map(expandFaction);

export function factionById(id) {
  return FACTIONS.find((f) => f.id === id) || null;
}

const WEEK_RAW = {
  1: {
    rival: ["crusader", "archon"],
    rows: [
      ["crusader", 220, 140, 160, 180],
      ["archon", 200, 120, 110, 150],
      ["athena", 180, 130, 90, 140],
      ["foxglove", 150, 100, 80, 160],
      ["overseer", 140, 90, 100, 120],
      ["summoner", 130, 80, 70, 130],
      ["chobo", 120, 70, 60, 110],
      ["gigus", 80, 40, 30, 150],
    ],
  },
  2: {
    rival: ["athena", "foxglove"],
    rows: [
      ["athena", 240, 150, 170, 160],
      ["foxglove", 190, 120, 100, 170],
      ["crusader", 180, 110, 140, 120],
      ["archon", 160, 130, 90, 140],
      ["summoner", 150, 100, 80, 130],
      ["overseer", 140, 90, 110, 100],
      ["chobo", 130, 80, 70, 120],
      ["gigus", 90, 50, 40, 140],
    ],
  },
  3: {
    rival: ["archon", "crusader"],
    rows: [
      ["archon", 250, 160, 150, 180],
      ["crusader", 200, 120, 130, 140],
      ["athena", 170, 140, 100, 150],
      ["overseer", 160, 110, 120, 130],
      ["foxglove", 150, 100, 90, 150],
      ["summoner", 140, 90, 80, 140],
      ["chobo", 150, 80, 60, 130],
      ["gigus", 100, 40, 30, 160],
    ],
  },
  4: {
    rival: ["foxglove", "summoner"],
    rows: [
      ["foxglove", 230, 170, 140, 200],
      ["summoner", 190, 120, 110, 160],
      ["archon", 180, 130, 100, 140],
      ["athena", 160, 140, 90, 150],
      ["overseer", 150, 100, 130, 120],
      ["crusader", 140, 110, 120, 100],
      ["chobo", 160, 90, 50, 140],
      ["gigus", 90, 50, 40, 170],
    ],
  },
  5: {
    rival: ["overseer", "archon"],
    rows: [
      ["overseer", 240, 150, 180, 160],
      ["archon", 190, 140, 110, 150],
      ["summoner", 180, 120, 100, 170],
      ["foxglove", 160, 130, 90, 160],
      ["athena", 150, 120, 100, 140],
      ["crusader", 140, 100, 130, 110],
      ["chobo", 170, 80, 60, 150],
      ["gigus", 100, 60, 30, 180],
    ],
  },
  6: {
    rival: ["summoner", "foxglove"],
    rows: [
      ["summoner", 250, 160, 150, 190],
      ["foxglove", 200, 140, 100, 170],
      ["overseer", 180, 120, 140, 140],
      ["athena", 170, 150, 90, 150],
      ["archon", 160, 130, 100, 140],
      ["chobo", 180, 100, 70, 160],
      ["crusader", 150, 110, 120, 100],
      ["gigus", 110, 50, 40, 190],
    ],
  },
};

function expandRow([id, activity, sets, events, quests]) {
  return { id, activity, sets, events, quests, total: activity + sets + events + quests };
}

export const WEEKS = [1, 2, 3, 4, 5, 6];

export function standings(week) {
  const pack = WEEK_RAW[week] || WEEK_RAW[6];
  return pack.rows.map(expandRow).sort((a, b) => b.total - a.total || a.id.localeCompare(b.id));
}

export function rivalry(week) {
  const pack = WEEK_RAW[week] || WEEK_RAW[6];
  return pack.rival;
}

export function seasonTotals() {
  const totals = new Map();
  WEEKS.forEach((week) => {
    standings(week).forEach((row) => {
      totals.set(row.id, (totals.get(row.id) || 0) + row.total);
    });
  });
  return [...totals.entries()]
    .map(([id, total]) => ({ id, total }))
    .sort((a, b) => b.total - a.total || a.id.localeCompare(b.id));
}

export const RIVAL_SEED = {
  1: { crusader: 28, archon: 21 },
  2: { athena: 32, foxglove: 24 },
  3: { archon: 30, crusader: 26 },
  4: { foxglove: 29, summoner: 25 },
  5: { overseer: 31, archon: 22 },
  6: { summoner: 34, foxglove: 27 },
};

export const QUESTS = {
  1: [
    ["Dungeon runs", "Co-op clears logged by any hall.", 400, 400],
    ["Faction sets", "Finished sets turned in this week.", 80, 80],
    ["Event nights", "Community event wins recorded.", 25, 25],
    ["Quest slips", "Community quests stamped at the hall.", 600, 600],
  ],
  2: [
    ["Dungeon runs", "Co-op clears logged by any hall.", 388, 420],
    ["Faction sets", "Finished sets turned in this week.", 74, 90],
    ["Event nights", "Community event wins recorded.", 22, 24],
    ["Quest slips", "Community quests stamped at the hall.", 540, 620],
  ],
  3: [
    ["Dungeon runs", "Co-op clears logged by any hall.", 410, 440],
    ["Faction sets", "Finished sets turned in this week.", 96, 100],
    ["Event nights", "Community event wins recorded.", 18, 28],
    ["Quest slips", "Community quests stamped at the hall.", 500, 640],
  ],
  4: [
    ["Dungeon runs", "Co-op clears logged by any hall.", 360, 460],
    ["Faction sets", "Finished sets turned in this week.", 70, 110],
    ["Event nights", "Community event wins recorded.", 20, 26],
    ["Quest slips", "Community quests stamped at the hall.", 610, 660],
  ],
  5: [
    ["Dungeon runs", "Co-op clears logged by any hall.", 402, 480],
    ["Faction sets", "Finished sets turned in this week.", 88, 120],
    ["Event nights", "Community event wins recorded.", 16, 30],
    ["Quest slips", "Community quests stamped at the hall.", 455, 700],
  ],
  6: [
    ["Dungeon runs", "Co-op clears logged by any hall.", 312, 400],
    ["Faction sets", "Finished sets turned in this week.", 54, 80],
    ["Event nights", "Community event wins recorded.", 19, 25],
    ["Quest slips", "Community quests stamped at the hall.", 470, 600],
  ],
};

export function questsFor(week) {
  return (QUESTS[week] || QUESTS[6]).map(([title, detail, current, goal], index) => ({
    id: `w${week}-q${index}`,
    title,
    detail,
    current,
    goal,
  }));
}

export const REWARDS = [
  { id: "wood", medal: "wood", name: "Rally badge", need: 500, blurb: "Showed up for a co-op quest." },
  { id: "stone", medal: "stone", name: "Camp role", need: 1200, blurb: "Sample role flair for the hall." },
  { id: "copper", medal: "copper", name: "Rival pin", need: 1800, blurb: "Pinned on the war-room roster." },
  { id: "iron", medal: "iron", name: "Veteran badge", need: 2400, blurb: "Council ribbon for a full month of activity." },
  { id: "gold", medal: "gold", name: "Champion trophy", need: 3000, blurb: "Sits in the hall for the season." },
  { id: "giga", medal: "giga", name: "Season Relic", need: 3600, blurb: "Top of the track. Still unclaimed in this sample." },
];

export const STRONGHOLDS = {
  A: "archon",
  B: "athena",
  C: "foxglove",
  D: "crusader",
  E: "chobo",
  F: "overseer",
  J: "gigus",
  L: "summoner",
  P: "gigus",
};

export const CONTESTED = {
  1: { G: "archon", H: "crusader", I: "foxglove", K: "crusader", M: "athena", N: "crusader", O: "crusader" },
  2: { G: "athena", H: "chobo", I: "athena", K: "athena", M: "athena", N: "crusader", O: "athena" },
  3: { G: "archon", H: "archon", I: "foxglove", K: "archon", M: "archon", N: "archon", O: "summoner" },
  4: { G: "archon", H: "foxglove", I: "foxglove", K: "foxglove", M: "foxglove", N: "crusader", O: "foxglove" },
  5: { G: "overseer", H: "chobo", I: "overseer", K: "overseer", M: "athena", N: "overseer", O: "overseer" },
  6: { G: "archon", H: "summoner", I: "foxglove", K: "summoner", M: "summoner", N: "crusader", O: "summoner" },
};

export const ZONES = {
  A: "Citadel Steps",
  B: "Star Court",
  C: "Fox Garden",
  D: "Red Keep",
  E: "Chobo Camp",
  F: "Ring Tower",
  G: "Oath Hall",
  H: "Sprint Lane",
  I: "Hex Orchard",
  J: "Quiet Archive",
  K: "Void Market",
  L: "Summon Gate",
  M: "North Watch",
  N: "Banner Field",
  O: "Side Chapel",
  P: "Gigus Core",
};

const ZONE_BASE = {
  A: 210, B: 180, C: 170, D: 200, E: 150, F: 160, G: 140, H: 130,
  I: 155, J: 120, K: 175, L: 165, M: 145, N: 190, O: 135, P: 125,
};

export const MAP_ROWS = [
  "............",
  "..AAA.BB.CC.",
  ".AAAA.BB.CCC",
  "..AA..BB..C.",
  "DDDD..EE..FF",
  "DDDD.EEEE.FF",
  "DDD...EE..F.",
  ".GGG.HHH.III",
  "GGGG.HH..III",
  ".GG.HHHH..II",
  "JJJ..KKK.LL.",
  "JJJJ.KKK.LLL",
  ".JJ...K..LL.",
  "MMM.NNN.OO.P",
  "MMM.NN.OOO.P",
  ".MM..N..O.PP",
];

export function zoneOwner(week, letter) {
  const contested = CONTESTED[week] || CONTESTED[6];
  return contested[letter] || STRONGHOLDS[letter];
}

export function zonePoints(week, letter) {
  return (ZONE_BASE[letter] || 100) + week * 15;
}

export const FEED = [
  {
    id: "p1",
    name: "red_banner",
    faction: "crusader",
    face: "anger",
    ago: "12m ago",
    text: "Banner Field is still red. Bring a quest slip if you want the zone to stay that way.",
    reacts: [["🔥", 6], ["⚔️", 4], ["👀", 2]],
  },
  {
    id: "p2",
    name: "gate_call",
    faction: "summoner",
    face: "yay",
    ago: "28m ago",
    text: "Week 6 gate is open. Points are quests, sets, events, and game results. Do not flex a wallet at the bell.",
    reacts: [["🔥", 8], ["💜", 5], ["👀", 1]],
  },
  {
    id: "p3",
    name: "hex_bloom",
    faction: "foxglove",
    face: "uwu",
    ago: "1h ago",
    text: "Hex Orchard set night is at the garden. Sample board, real enthusiasm.",
    reacts: [["💜", 7], ["🔥", 3], ["👀", 4]],
  },
  {
    id: "p4",
    name: "ring_eye",
    faction: "overseer",
    face: "bigeyes",
    ago: "2h ago",
    text: "Star Court flipped last week and can flip again. Watch the map slider before you plant a banner.",
    reacts: [["👀", 9], ["⚔️", 2], ["🔥", 1]],
  },
  {
    id: "p5",
    name: "sprint_kid",
    faction: "chobo",
    face: "happy",
    ago: "3h ago",
    text: "Sprint Lane is short on quest slips. Camp is recruiting a Sunday caller.",
    reacts: [["🔥", 4], ["👀", 3], ["💜", 2]],
  },
  {
    id: "p6",
    name: "star_draft",
    faction: "athena",
    face: "shades",
    ago: "5h ago",
    text: "Rivalry vote is a demo poll. It does not move the season table. Play the match anyway.",
    reacts: [["⚔️", 6], ["👀", 5], ["🔥", 2]],
  },
  {
    id: "p7",
    name: "archive_moth",
    faction: "gigus",
    face: "orly",
    ago: "8h ago",
    text: "Gigus Core is an archive, not a treasury. Sample lore is tagged. Do not quote it as patch notes.",
    reacts: [["👀", 6], ["💜", 3], ["🔥", 1]],
  },
];

export const RECRUITS = [
  { id: "archon-caller", faction: "archon", title: "Sunday oath caller", detail: "Ping the co-op quest before the week clock flips. Sample posting." },
  { id: "athena-map", faction: "athena", title: "Map scribe", detail: "Mark zone flips during the rivalry hour. Sample posting." },
  { id: "chobo-pace", faction: "chobo", title: "Pace setter", detail: "Lead one sprint-lane quest bar. Sample posting." },
  { id: "crusader-banner", faction: "crusader", title: "Banner bearer", detail: "Show up when Banner Field is contested. Sample posting." },
  { id: "fox-set", faction: "foxglove", title: "Set hunter", detail: "Help close the faction set. Sample posting." },
  { id: "overseer-log", faction: "overseer", title: "Night logger", detail: "Write the war-room recap. Sample posting." },
  { id: "summoner-bell", faction: "summoner", title: "Gate bell", detail: "Call reinforcements when a quest stalls. Sample posting." },
  { id: "gigus-margin", faction: "gigus", title: "Margin keeper", detail: "File sample lore so it is not mistaken for docs. Sample posting." },
];

export const BURN_SERIES = [
  ["2024-02", 18],
  ["2024-04", 46],
  ["2024-06", 80],
  ["2024-08", 110],
  ["2024-10", 142],
  ["2024-12", 176],
  ["2025-02", 210],
  ["2025-04", 248],
  ["2025-06", 275],
  ["2025-08", 302],
  ["2025-10", 330],
  ["2025-12", 358],
  ["2026-02", 380],
  ["2026-04", 396],
  ["2026-06", 408],
  ["2026-09", 420],
];

export const RECENT_BURNS = [
  ["2026-09-18", "GLHFer #2401", "0xSAMP0a91", "Floor sweep after a sample 1/1 auction"],
  ["2026-09-04", "GLHFer #1888", "0xSAMP17c4", "Auctioneer gavel, sample row"],
  ["2026-08-21", "GLHFer #990", "0xSAMP22de", "Floor sweep, sample row"],
  ["2026-08-02", "GLHFer #3104", "0xSAMP09ab", "Proceeds routed to burn, sample row"],
  ["2026-07-14", "GLHFer #512", "0xSAMP77f0", "Sample burn, not a live transaction"],
  ["2026-06-30", "GLHFer #1420", "0xSAMP3e18", "Chart baseline still closes at 420"],
];

const SPOT_SEEDS = [42, 38, 36, 33, 29, 27, 24, 21];

export const SPOTLIGHT = GLHFERS.filter((token) => token.traits["Special Character"] === "Yes").map((token, index) => ({
  id: `glhf-${token.tokenId}`,
  name: token.name,
  src: token.image,
  seed: SPOT_SEEDS[index] || 20,
  openseaUrl: token.openseaUrl,
}));

const FACTION_IDS = MASTERS.map((f) => f.id).concat("gigus");

export const BASE_NAMES = [...new Set(GLHFERS.map((token) => token.traits.Base).filter(Boolean))].sort();

function tierOf(index) {
  if (index < 8) return "Silver";
  if (index < 16) return "Gold";
  if (index < 24) return "Void";
  if (index < 32) return "Giga";
  if (index < 40) return "Silver";
  return "Gold";
}

function memoryOf(index) {
  if (index === 0) return 0;
  if (index === 47) return 100;
  return (index * 13) % 99 + 1;
}

function stubOf(index) {
  if (index === 0) return 1;
  if (index === 24) return 60;
  if (index === 16) return 48;
  if (index === 4) return 41;
  return (index * 5) % 59 + 1;
}

const GLHF_ITEMS = GLHFERS.map((token, index) => ({
  id: `glhf-${token.tokenId}`,
  name: token.name,
  collection: "GLHFers",
  chain: "Ethereum",
  tier: "",
  faction: FACTION_IDS[index % FACTION_IDS.length],
  memory: null,
  stub: null,
  serial: Number(token.tokenId),
  base: token.traits.Base || "",
  image: token.image,
  traits: token.traits,
  openseaUrl: token.openseaUrl,
  special: token.traits["Special Character"] === "Yes",
}));

const ROM_ITEMS = [];
for (let index = 1; index < 48; index += 2) {
  const serial = 8800 + index * 17;
  ROM_ITEMS.push({
    id: `item-${index}`,
    name: `ROM #${serial}`,
    collection: "ROMs",
    chain: "Abstract",
    tier: tierOf(index),
    faction: FACTION_IDS[index % FACTION_IDS.length],
    memory: memoryOf(index),
    stub: stubOf(index),
    serial,
    base: "",
    image: "",
    traits: null,
    openseaUrl: "",
    special: false,
  });
}

export const ITEMS = [...GLHF_ITEMS, ...ROM_ITEMS];

export const VAULT_IDS = [
  "glhf-13", "glhf-70", "glhf-388", "glhf-425", "glhf-610", "glhf-639", "glhf-753", "glhf-845",
  "item-1", "item-11", "item-21", "item-27", "item-31", "item-33",
];

export function itemsByIds(ids) {
  const wanted = new Set(ids);
  return ITEMS.filter((item) => wanted.has(item.id));
}

export const DEMO_ADDRESS = "0xDEMO…GLHF";

export const AWAKENING_END = Date.UTC(2026, 9, 12, 23, 59, 0);

export const SCORE_RULE = "Points come from activity (quests, sets, events, and game results), not wallet size.";
