# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start the Vite dev server with HMR
- `npm run build` — production build
- `npm run preview` — preview the production build locally
- `npm run lint` — run Oxlint (rules configured in `.oxlintrc.json`)

There is no test runner configured in this project.

## Architecture

React 19 + Vite 8 app (JavaScript, no TypeScript). Gameplay renders to a
`<canvas>` 2D context driven by a `requestAnimationFrame` loop; menu/HUD chrome
(main screen, buttons, mute toggle) is plain React/CSS.

- `src/main.jsx` — entry point, mounts `<App />` into `#root` inside `StrictMode`
- `src/App.jsx` — screen switcher (main menu ↔ game) + mute toggle
- `src/index.css` — global styles, incl. the shared `.pixel-button` style
- `src/components/`
  - `MainScreen.jsx`, `PangIntroArt.jsx`, `PangTitle.jsx` — title screen
  - `GameCanvas.jsx` — owns the game loop, per-stage state, HUD, and end-of-round overlays/buttons
  - `PixelButton.jsx` — shared pixel-art-styled button used across screens
- `src/game/`
  - `constants.js` — all tunable numbers (speeds, cooldowns, sizes, drop rates, etc.)
  - `input.js` — keyboard state (movement, fire, pause)
  - `loop.js` — `requestAnimationFrame` update/render loop helper
  - `audio.js` — Web Audio–synthesized SFX/BGM (no external audio files)
  - `backgrounds.js` — vector-drawn background themes (mountain/lake/castle/sea), picked randomly per stage
  - `entities/` — `player.js`, `harpoon.js`, `balloon.js`, `obstacle.js`, `item.js` (create/update/render for each)
  - `systems/collision.js` — collision checks between entities
  - `stages/` — `mission1.js` (Mission 1 data) and `index.js` (`getStage(stageIndex)`, generates harder stages procedurally)
- `public/` — static assets served as-is (favicon, icons sprite)

`Solution3.slnx` and `.vs/` are Visual Studio solution artifacts alongside the Vite app; `.vs/` is git-ignored.

## Documentation

Game design docs for the PANG game live under `docs/`:

- [`docs/PRD.md`](docs/PRD.md) — overall product requirements: core concept, balloon/obstacle/item systems, difficulty, controls
- [`docs/features/main.md`](docs/features/main.md) — main screen spec
- [`docs/features/rules.md`](docs/features/rules.md) — game rules (win/lose conditions, controls, balloon/obstacle/item rules)
- [`docs/features/mission.md`](docs/features/mission.md) — first stage (mission 1) spec
- [`docs/visualRendering.md`](docs/visualRendering.md) — visual rendering style: colors, shapes, HUD, and planned polish

Phase-by-phase implementation plans (written before each phase's code, one file
per phase) live under `docs_temp/`:

- [`docs_temp/Phases_goal.md`](docs_temp/Phases_goal.md) — overall phase roadmap (Phase 0-10)
- `docs_temp/Phase0.md` through `docs_temp/Phase10.md` — detailed plan for each phase (canvas/input scaffold, player/harpoon, balloon physics, obstacles, stage data, rules, items, HUD/audio, polish, procedural stage progression)
