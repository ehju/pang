# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start the Vite dev server with HMR
- `npm run build` — production build
- `npm run preview` — preview the production build locally
- `npm run lint` — run Oxlint (rules configured in `.oxlintrc.json`)

There is no test runner configured in this project.

## Architecture

Minimal React 19 + Vite 8 scaffold (JavaScript, no TypeScript):

- `src/main.jsx` — entry point, mounts `<App />` into `#root` inside `StrictMode`
- `src/App.jsx` — root component
- `src/index.css` — global styles
- `public/` — static assets served as-is (favicon, icons sprite)

`Solution3.slnx` and `.vs/` are Visual Studio solution artifacts alongside the Vite app; `.vs/` is git-ignored.

## Documentation

Game design docs for the PANG game live under `docs/`:

- [`docs/PRD.md`](docs/PRD.md) — overall product requirements: core concept, balloon/obstacle/item systems, difficulty, controls
- [`docs/features/main.md`](docs/features/main.md) — main screen spec
- [`docs/features/rules.md`](docs/features/rules.md) — game rules (win/lose conditions, controls, balloon/obstacle/item rules)
- [`docs/features/mission.md`](docs/features/mission.md) — first stage (mission 1) spec
