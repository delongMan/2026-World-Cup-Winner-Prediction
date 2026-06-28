# AGENTS.md

## Project: 2026 World Cup Winner Prediction

A drag-and-drop World Cup 2026 knockout-stage prediction web app with CS:GO Major-style team cards and animations.

## Repository
- GitHub: https://github.com/delongMan/2026-World-Cup-Winner-Prediction
- Gitee: https://gitee.com/delongMan/2026-World-Cup-Winner-Prediction

## Commands
- `npm run dev` — Start dev server
- `npm run build` — TypeScript check + Vite build (outputs single HTML via vite-plugin-singlefile)
- `npm run preview` — Preview production build

## Tech Stack
- React 18 + TypeScript + Vite
- Tailwind CSS for styling
- @dnd-kit/core for drag-and-drop
- Framer Motion for animations
- Zustand for state management
- html-to-image for screenshot export
- vite-plugin-singlefile for standalone HTML output
- flagcdn.com for national flag images

## File Structure
```
src/
├── main.tsx                          # Entry point
├── App.tsx                           # Root component
├── index.css                         # Tailwind + global styles (safe-area, touch-action, background)
├── vite-env.d.ts
├── constants/
│   └── teams.ts                      # 32 knockout teams data (flag URLs, names, 16 languages)
├── types/
│   └── index.ts                      # TypeScript interfaces (Team, KnockoutMatch, Stage, Lang...)
├── store/
│   └── usePredictionStore.ts         # Zustand global state (bracket, winners, lock, lang, i18n)
├── utils/
│   ├── bracket.ts                    # FIFA 2026 knockout bracket generation + i18n round labels
│   └── exportImage.ts                # html-to-image PNG export
└── components/
    ├── Layout.tsx                     # Top bar (language, reset, lock, export) — in-flow, non-scroll
    ├── BracketTree.tsx                # SVG connectors + round headers + match card grid (absolute positioning)
    ├── KnockoutStage.tsx              # DndContext + drag/click handlers + language-aware timezone
    ├── MatchNode.tsx                  # MatchPair: two TeamCards + info bar (React.memo, i18n)
    ├── TeamCard.tsx                   # Single team card (flag bg, winner/loser/champion effects)
    ├── TeamBadge.tsx                  # Inline team badge with flag
    ├── ExportButton.tsx               # Export to PNG button
    ├── bracketLayout.ts              # Layout engine (X/Y positions, connectors, bounds, breakpoints)
    └── breakpoint.ts                 # Responsive breakpoint detection (sm/md/lg/xl, ResizeObserver)
```

## Layout & Scrolling
- `html/body`: `overflow: hidden`, `height: 100dvh` — no page-level scroll
- Layout root: `flex flex-col`, `height: 100dvh`
- Header: regular in-flow element, no fixed/sticky — always visible at top
- `main#prediction-content`: `flex-1 overflow-auto` — single scroll container for vertical + horizontal
- Round headers + match cards: both use absolute positioning within the same relative container for pixel-perfect alignment
- Horizontal overflow handled by main's scroll, not body

## Round Labels (i18n)
- Round labels are defined in `getRoundLabel(round, lang)` in `src/utils/bracket.ts`
- 16 languages supported: en, zh-CN, zh-TW, es, fr, de, ja, ko, ar, pt, nl, it, sv, hr, no, bs
- Winners-based naming (Chinese): 16强 / 8强 / 4强 / 半决赛 / 总决赛
- All languages unified to follow the same pattern (Last 16, Last 8, Last 4, Semi-finals, Grand Final)

## Key Features
- **R32**: click-only selection (no drag)
- **R16+**: click or drag to advance
- **Auto-advance drag**: drag anywhere, auto-advances to highlighted next target
- **Cascade gray**: eliminated winners turn gray in prior rounds
- **Champion gold**: final winner gets gold border + crown badge
- **Lock**: freeze all selections for sharing/export
- **Reset**: clear all predictions
- **Export PNG**: download bracket as PNG (2x quality)
- **Cancel**: click completed winner to undo
- **16 languages**: full i18n for teams, rounds, and UI text
- **Timezone**: match times auto-convert to local timezone
- **Standalone HTML**: `2026-World-Cup-Winner-Prediction.html` — single-file build, open in browser directly

## Bracket Data
- Source: FIFA 2026 official knockout bracket (ESPN / worldcupstats)
- 32 teams from group stage, R32 → R16 → QF → SF → Final
- Match dates, times, and venues included

## Build Output
- `npm run build` → `dist/index.html` (single file, all assets inlined)
- Root `2026-World-Cup-Winner-Prediction.html` kept in sync with latest build for direct download
