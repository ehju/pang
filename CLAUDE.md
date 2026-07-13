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
