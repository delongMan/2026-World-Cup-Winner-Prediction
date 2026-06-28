# AGENTS.md

## Project: 2026 世界杯晋级预测

A drag-and-drop World Cup 2026 prediction web app with CS2 MAJOR-style animations.

## Commands
- `npm run dev` — Start dev server
- `npm run build` — TypeScript check + Vite build
- `npm run preview` — Preview production build

## Tech Stack
- React 18 + TypeScript + Vite
- Tailwind CSS for styling
- @dnd-kit/core for drag-and-drop
- Framer Motion for animations
- Zustand for state management
- html-to-image for screenshot export

## File Structure
- `src/constants/teams.ts` — 48 teams data
- `src/types/index.ts` — TypeScript interfaces
- `src/store/usePredictionStore.ts` — Zustand global state
- `src/utils/bracket.ts` — Knockout bracket generation
- `src/components/` — React components
