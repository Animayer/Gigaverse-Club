// Single map of image and sound paths. Swap a file here when better official art arrives.
// Static HTML that cannot wait for JS repeats the same path and sets data-art="group.key"
// so the shell replaces it from this map after load.

export const ART = {
  letters: {
    G: "assets/letters/G.png",
    L: "assets/letters/L.png",
    H: "assets/letters/H.png",
    F: "assets/letters/F.png",
  },
  logos: {
    glhfAnimated: "assets/logo/GLHF_Logo_Animated.gif",
    glhfDeep: "assets/logo/GLHF_Logo_Deep.png",
    glhfShallow: "assets/logo/GLHF_Logo_Shallow.png",
    gigaverse: "assets/logo/Gigaverse_Logo.png",
  },
  gifs: {
    auctioneer: "assets/gifs/Auctioneer.gif",
    arcade: "assets/gifs/GLHF_Arcade.gif",
    banner: "assets/gifs/Gigaverse_Banner.gif",
    dancing: "assets/gifs/Gigaverse_Dancing.gif",
    void: "assets/gifs/void.png",
  },
  medals: {
    giga: "assets/medals/Icon_Giga-Medal.png",
    gold: "assets/medals/Icon_Gold-Medal.png",
    iron: "assets/medals/Icon_Iron-Medal.png",
    copper: "assets/medals/Icon_Copper-Medal.png",
    stone: "assets/medals/Icon_Stone-Medal.png",
    wood: "assets/medals/Icon_Wood-Medal.png",
  },
  faces: {
    default: "assets/expressions/noob_default.png",
    happy: "assets/expressions/noob_happy.png",
    shades: "assets/expressions/noob_shades.png",
    anger: "assets/expressions/noob_anger.png",
    yay: "assets/expressions/noob_yay1.png",
    cry: "assets/expressions/noob_cry.png",
    bigeyes: "assets/expressions/noob_bigeyes.png",
    uwu: "assets/expressions/noob_uwu1.png",
    orly: "assets/expressions/noob_orly.png",
    ded: "assets/expressions/noob_ded.png",
    blush: "assets/drive/expressions/noob_blush.png",
    clown: "assets/drive/expressions/noob_clown.png",
    look: "assets/drive/expressions/noob_look.png",
    pain: "assets/drive/expressions/noob_pain.png",
    really: "assets/drive/expressions/noob_really.png",
    sadge: "assets/drive/expressions/noob_sadge.png",
    sideeye: "assets/drive/expressions/noob_sideeye1.png",
    unimpressed: "assets/drive/expressions/noob_unimpressed.png",
    yay2: "assets/drive/expressions/noob_yay2.png",
  },
  heads: {
    archon: "assets/heads/archon_front.png",
    athena: "assets/heads/athena_front.png",
    chobo: "assets/heads/chobo_front.png",
    crusader: "assets/heads/crusader_front.png",
    foxglove: "assets/heads/foxglove_front.png",
    overseer: "assets/heads/overseer_front.png",
    summoner: "assets/heads/summoner_front.png",
    knight: "assets/heads/knight_front.png",
    blackknight: "assets/heads/blackknight_front.png",
    crow: "assets/heads/crow_front.png",
    greycloak: "assets/heads/greycloak_front.png",
    redcloak: "assets/heads/redcloak_front.png",
    boss: "assets/heads/boss_1.png",
    impaler: "assets/heads/impaler_1.png",
  },
  factionIcons: {
    archon: "assets/factions/Faction_Archon_Transparant.png",
    athena: "assets/factions/Faction_Athena_Transparant.png",
    chobo: "assets/factions/Faction_Chobo_Transparant.png",
    crusader: "assets/factions/Faction_Crusader_Transparant.png",
    foxglove: "assets/factions/Faction_Foxglove_Transparant.png",
    overseer: "assets/factions/Faction_Overseer_Transparant.png",
    summoner: "assets/factions/Faction_Summoner_Transparant.png",
    gigus: "assets/factions/gigus1x1.png",
  },
  sprites: {
    giganoob: "assets/sprites/Giganoob_PFP.png",
    clean: "assets/sprites/Noob_Clean_Avatar.png",
  },
  sounds: {
    click: "assets/sounds/Click.mp3",
    success: "assets/sounds/Success.mp3",
    press: "assets/sounds/Press_Start.mp3",
    theme: "assets/sounds/GLHFers_Theme.mp3",
  },
  romTiers: {
    Silver: "assets/web/rom-silver.png",
    Gold: "assets/web/rom-gold.png",
    Void: "assets/web/rom-void.png",
    Giga: "assets/web/rom-giga.png",
  },
  romBenefits: "assets/web/rom-benefits.png",
  banners: {
    thumbnail: "assets/drive/banners/gigaverse_thumbnail.png",
    juice: "assets/web/gigajuice.gif",
    refer: "assets/drive/banners/refer_to_earn.gif",
    masters: "assets/drive/banners/auction_masters_chobo.gif",
    abstract: "assets/drive/banners/abstract_badge.gif",
    posters: "assets/drive/glhf/glhf_wall_posters.png",
  },
  shots: {
    lobby: "assets/web/main_lobby.jpg",
    dungeon: "assets/web/dungeon.jpg",
    roms: "assets/web/giga_roms.jpg",
    inventory: "assets/web/inventory.jpg",
    stubs: "assets/web/stubs_leaderboard.jpg",
    workbench: "assets/web/workbench.jpg",
    juice: "assets/web/giga_juice.jpg",
    market: "assets/web/gigamarket.jpg",
    alchemy: "assets/web/alchemy.jpg",
    merchant: "assets/web/traveling_merchant.jpg",
  },
  reactions: {
    dance: "assets/drive/reactions/giganoob_dance.gif",
    praise: "assets/drive/reactions/giganoob_praise.gif",
    haha: "assets/drive/reactions/chat_haha.gif",
    running: "assets/drive/reactions/giganoob_running.gif",
  },
  sideHeads: {
    archon: "assets/drive/heads/archon_side.png",
    athena: "assets/drive/heads/athena_side.png",
    chobo: "assets/drive/heads/chobo_side.png",
    crusader: "assets/drive/heads/crusader_side.png",
    foxglove: "assets/drive/heads/foxglove_side.png",
    overseer: "assets/drive/heads/overseer_side.png",
    knight: "assets/drive/heads/knight_side.png",
    blackknight: "assets/drive/heads/blackknight_profile.png",
    crow: "assets/drive/heads/crow_side.png",
    greycloak: "assets/drive/heads/greycloak_side.png",
    redcloak: "assets/drive/heads/redcloak_side.png",
    enemy: "assets/drive/heads/enemy_front.png",
  },
  gigusWatch: "assets/drive/characters/gigus_watching.gif",
  sticker: "assets/drive/characters/giganoob_sticker.png",
};

ART.emblems = [
  ART.faces.default,
  ART.faces.happy,
  ART.faces.shades,
  ART.faces.anger,
  ART.faces.yay,
  ART.faces.cry,
  ART.faces.bigeyes,
  ART.faces.uwu,
  ART.faces.orly,
  ART.faces.ded,
  ART.heads.archon,
  ART.heads.athena,
  ART.heads.chobo,
  ART.heads.crusader,
  ART.heads.foxglove,
  ART.heads.overseer,
  ART.heads.summoner,
  ART.heads.knight,
  ART.heads.crow,
];

export function artPath(spec) {
  const [group, key] = String(spec).split(".");
  const bucket = ART[group];
  if (!bucket) return "";
  return typeof bucket === "string" ? bucket : bucket[key] || "";
}

export function itemSprite(item, faction) {
  if (item?.image) return item.image;
  if (item?.collection === "ROMs" && ART.romTiers[item.tier]) return ART.romTiers[item.tier];
  return faction?.icon || ART.factionIcons.gigus;
}

export function itemPortrait(item, faction) {
  if (item?.image) return item.image;
  if (item?.collection === "ROMs" && ART.romTiers[item.tier]) return ART.romTiers[item.tier];
  return faction?.head || faction?.icon || ART.factionIcons.gigus;
}
