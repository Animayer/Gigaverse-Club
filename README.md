# Gigaverse Club (Mockup)

A **community-run** home base for GLHFers and Gigaverse ROM holders. One pixel-art lobby, built as a clickable static mockup.

> **Mockup - sample data.** Nothing here is live on-chain data. No wallet signing. The "Connect wallet (demo)" button loads a sample vault for `0xDEMO…GLHF`.

- Live (GitHub Pages, after merge to `main`): https://animayer.github.io/Gigaverse-Club/
- Community-run, supported by Gigaverse (placeholder).

The lobby keeps the Collector Hub look: dark pixel shell, sticky nav, sound off until the mute toggle is pressed, and the same sample wallet on every page.

## Pages

- **Home** — GLHF hero, sample burn pulse (starts at the documented 420), demo loadout strip, links into clans, the holder board, stats, and partner drops, this week's Faction Wars card, and week-6 standings.
- **Explorer** — 48 GLHFers from the OpenSea catalog (Ethereum) and 24 sample ROMs (Abstract). GLHFer traits are the OpenSea fields. Faction on a GLHFer is labeled sample. ROM filters cover tier, faction, memory, and stub level. Faction chips, sort, and the page number stay in the URL. The item modal links each GLHFer to OpenSea.
- **My Vault** — demo wallet only (`0xDEMO…GLHF`, 8 GLHFers and 6 ROMs). Holdings, tier and faction counts, set progress, a badge strip, a holder card PNG, and a vault collage PNG.
- **Giga Loadout** — the same demo wallet as slots (two rarest of each collection), 19 Base emblems, a sample collector score (54 / 100 for this vault), a holding tier (Keeper), a stats-card PNG, and copy link. Play and Participation are reserved and not tracked.
- **Party** — pick 3 to 5 demo-vault GLHFers, see faction mix and synergy tags, name the party, and download a PNG share card.
- **Factions** — the eight lore factions (Archon, Athena, Chobo, Crusader, Foxglove, Overseer, Summoner, plus Gigus). Halls, Faction Vault, season board (weeks 1–6), quests, territory map, relic, rivalry vote, council, recruitment, war room, and rewards. Activity points, not wallet size.
- **Clans** — player-formed guilds (Auctioneer's Henchmen, Lobby Regulars, Stub 40 Club, Sunday Callers). A guild can mix lore factions. Join (demo) saves in this browser only.
- **Holder board** — sixteen sample wallets ranked by piece count. The demo wallet is rank 9 with 14 pieces. This is not the Faction Wars season board and not Badges.
- **Events** — Set Hunt, Special Character spotlight vote, holder card contest, and a countdown to the end of The Awakening (Oct 12). Gigaverse Online launch date is TBA.
- **Stats** — circulating GLHFers (3,690 minted minus the 420 sample burn baseline), ROM supply and tier mix, sample holder distributions (GLHFer holders match the collection-health count of 2,410), overlap, top-10 share of the holder board, and Base counts inside the 48-token slice.
- **Partner drops** — empty slots in four collector-score bands. The demo wallet sits in Regular (40–59). The partner button does not send a request.
- **Wiki** — the seven Masters, the Auctioneer, and a Gigus lore card, plus Community Deep Dives.
- **Guide** — GLHFers 101. Includes a placeholder badge: Seeking official co-sign from Gigaverse.
- **Badges** — twelve sample achievements with bronze, silver, and gold tiers. Faction Wars points can unlock badges.
- **Burn** — inline chart of sample cumulative burns ending at 420, supply math, recent sample rows, the Auctioneer, and collection health (holder conviction, not price).

Faction points come from activity (quests, sets, events, and game results), not wallet size.

## Facts used (public, docs.gigaverse.io)

- **Gigaverse ROMs**: 10,000 on Abstract (ERC-721). Tiers: Silver 5,800 / Gold 3,200 / Void 850 / Giga 150. Traits: tier, faction, memory, serial number, stub boost level (max 60).
- **GLHFers**: ERC-721 on Ethereum, launched Jan 2024, original supply 3,690. Deflationary: the Auctioneer auctions 1/1 Special Characters and uses proceeds to sweep and burn the floor (420 burned used as the sample baseline).
- **Factions** (8): Archon, Athena, Chobo, Crusader, Foxglove, Overseer, Summoner (the 7 Masters of the Gigaverse) + Gigus.
- Gigaverse Online is coming after The Awakening event (ends Oct 12). Launch date TBA.

Every other number on the site is sample data and labeled as such.

## Assets

`assets/` holds a curated set of official Gigaverse/GLHF art from the team's media kit (logo, `gigaverse.ttf` font, GigaNoob expressions, character heads, faction icons, leaderboard medals, GIFs, sounds), plus Drive stills staged under `assets/drive/` and web-size copies in `assets/web/`. Image and sound paths are centralized in `js/art.js`. Swap a file there when better art arrives. All rights belong to GLHF / Gigaverse. Sound is off until the lobby toggle is pressed. Click, success, Press Start, and the theme all live under `assets/sounds/`.

## Stack

Plain static HTML, CSS, and vanilla ES modules. No build step, no backend, no external CDN. Served from the repo root on `main` via GitHub Pages (`.nojekyll` is present). Paths are relative so the site works under `/Gigaverse-Club/`.
