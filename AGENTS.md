# AGENTS.md

## Project: 2026 世界杯晋级预测

A drag-and-drop World Cup 2026 knockout-stage prediction web app with CS:GO Major-style team cards and animations.

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
- flagcdn.com for national flag images

## File Structure
```
src/
├── main.tsx                          # Entry point
├── App.tsx                           # Root component
├── index.css                         # Tailwind + global styles (safe-area, touch-action)
├── vite-env.d.ts
├── constants/
│   └── teams.ts                      # 32 knockout teams data (flag URLs, names)
├── types/
│   └── index.ts                      # TypeScript interfaces (Team, KnockoutMatch, Stage...)
├── store/
│   └── usePredictionStore.ts         # Zustand global state (bracket, winners, lock)
├── utils/
│   ├── bracket.ts                    # Official FIFA 2026 knockout bracket generation
│   └── exportImage.ts                # html-to-image PNG export
└── components/
    ├── Layout.tsx                     # Header (reset, lock, export buttons)
    ├── BracketTree.tsx                # SVG connector lines + match card grid
    ├── KnockoutStage.tsx              # DndContext + drag/click handlers
    ├── MatchNode.tsx                  # MatchPair: two TeamCards + info bar (React.memo)
    ├── TeamCard.tsx                   # Single team card (flag bg, winner/loser/champion)
    ├── TeamBadge.tsx                  # Inline team badge with flag
    ├── ExportButton.tsx               # Export to PNG button
    ├── bracketLayout.ts              # Layout engine (X/Y positions, connectors, bounds)
    └── breakpoint.ts                 # Responsive breakpoint detection (useBreakpoint)
```

## Branches
- `master` — Initial stable release
- `optimize-logic` — R32 click-only, cascade cancel fix
- `optimize-layout` — Cascade gray effect, champion gold, lock button
- `optimize-responsive` — Responsive layout, single body scroll, auto-advance drag

## Key Features
- **R32**: click-only selection (no drag)
- **R16+**: click or drag to advance
- **Auto-advance drag**: drag anywhere, auto-advances to highlighted next target
- **Cascade gray**: eliminated winners turn gray in prior rounds
- **Champion gold**: final winner gets gold border + crown badge
- **Lock**: freeze all selections for sharing/export
- **Reset**: clear all predictions
- **Export**: download bracket as PNG (2x quality)
- **Cancel**: click completed winner to undo

## Scrolling
- Single body-level scroll only — no inner scroll containers
- `main#prediction-content` uses `flex-1` (no overflow)
- BracketTree uses plain `div` (no overflow-auto)
- Horizontal overflow handled by natural page scroll
- `body` has no overflow restrictions

## Bracket Data
- Source: FIFA 2026 official knockout bracket (ESPN / worldcupstats)
- 32 teams from group stage, R32 → R16 → QF → SF → Final
- Match dates, times, and venues included
