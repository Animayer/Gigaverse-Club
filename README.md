# Gigaverse Collectors Hub (Mockup)

A **community-run** home base for GLHFers and Gigaverse ROM holders, presented as a clickable static **mockup**. It is built to feel like a pixel-art game lobby.

> **Mockup - sample data.** Nothing here is live on-chain data. No wallet signing. The "Connect wallet (demo)" button loads a sample vault.

- Live (GitHub Pages, after merge): https://animayer.github.io/GLHF-Collector-Hub/
- Built for a demo with the Gigaverse team. Community-run, supported by Gigaverse (placeholder).

## Pages

- **Home** — GLHF hero, sample burn pulse (starts at the documented 420), this week's Faction Wars card, week-6 standings with medal ranks.
- **Explorer** — 48 sample GLHFers (Ethereum) and ROMs (Abstract). Filters for collection, tier, faction, memory, stub level, and text. Item modal lists tier, faction, memory, serial, and stub level.
- **My Vault** — demo wallet only (`0xDEMO…GLHF`). Holdings, tier and faction counts, set progress, a badge strip, a holder card PNG, and a vault collage PNG (2x2, 3x3, or 4x4, faction-colour background, handle watermark).
- **Party** — pick 3 to 5 demo-vault GLHFers, see faction mix and synergy tags, name the party, and download a PNG share card.
- **Factions** — halls for Archon, Athena, Chobo, Crusader, Foxglove, Overseer, and Summoner, plus Gigus lore. Each hall has a Faction Vault tab (member art, pinned lore, sample war-room posts). Season board (weeks 1–6), quest bars, territory map, rotating week relic, rivalry with a local demo vote, council badges, recruitment board, war-room feed, and a season rewards track.
- **Events** — Set Hunt, Special Character spotlight vote, holder card contest, and a countdown to the end of The Awakening (Oct 12). Gigaverse Online launch date is TBA.
- **Wiki** — the seven Masters, the Auctioneer, and a Gigus lore card, plus Community Deep Dives (sample posts and a demo write form that does not save).
- **Guide** — GLHFers 101. Supply and burn figures are marked sample/unverified. Includes a placeholder badge: Seeking official co-sign from Gigaverse.
- **Badges** — twelve sample achievements with bronze, silver, and gold tiers, earned and locked states, and progress bars. Faction Wars points can unlock badges. Onchain badges possible later.
- **Burn** — inline chart of sample cumulative burns ending at 420, supply math (3,690 minus burned), recent sample rows, the Auctioneer, and a collection-health panel (holder conviction, not price). Home shows the same health panel.

Faction points come from activity (quests, sets, events, and game results), not wallet size.

## Facts used (public, docs.gigaverse.io)

- **Gigaverse ROMs**: 10,000 on Abstract (ERC-721). Tiers: Silver 5,800 / Gold 3,200 / Void 850 / Giga 150. Traits: tier, faction, memory, serial number, stub boost level (max 60).
- **GLHFers**: ERC-721 on Ethereum, launched Jan 2024, original supply 3,690. Deflationary: the Auctioneer auctions 1/1 Special Characters and uses proceeds to sweep and burn the floor (420 burned used as the sample baseline).
- **Factions** (8): Archon, Athena, Chobo, Crusader, Foxglove, Overseer, Summoner (the 7 Masters of the Gigaverse) + Gigus.
- Gigaverse Online is coming after The Awakening event (ends Oct 12). Launch date TBA.

## Assets

`assets/` holds a curated set of official Gigaverse/GLHF art from the team's media kit (logo, `gigaverse.ttf` font, GigaNoob expressions, character heads, faction icons, leaderboard medals, GIFs, sounds). All rights belong to GLHF / Gigaverse. Sound is off until the lobby toggle is pressed. Click, success, Press Start, and the theme all live under `assets/sounds/`.

## Stack

Plain static HTML, CSS, and vanilla ES modules. No build step, no backend, no external CDN. Served from the repo root on `main` via GitHub Pages (`.nojekyll` is present). Paths are relative so the site works under `/GLHF-Collector-Hub/`.
