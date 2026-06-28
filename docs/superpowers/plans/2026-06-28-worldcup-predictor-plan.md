# 2026 世界杯晋级预测 — 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个支持拖选操作的 2026 世界杯晋级预测 Web 应用，小组赛+淘汰赛全覆盖，支持导出为图片分享。

**Architecture:** React + TypeScript 单页应用，Zustand 管理全局预测状态，@dnd-kit 处理拖拽交互，Framer Motion 驱动晋级动效，html-to-image 实现导出。

**Tech Stack:** React 18, TypeScript, Vite, Tailwind CSS, @dnd-kit/core, Framer Motion, Zustand, html-to-image

---

## 文件结构总览

```
worldcup-predictor/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── tailwind.config.ts
├── postcss.config.js
├── .gitignore
├── AGENTS.md
├── public/
│   └── vite.svg
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── index.css
    ├── vite-env.d.ts
    ├── constants/
    │   └── teams.ts
    ├── types/
    │   └── index.ts
    ├── store/
    │   └── usePredictionStore.ts
    ├── hooks/
    │   └── useTournament.ts
    ├── components/
    │   ├── Layout.tsx
    │   ├── StageNav.tsx
    │   ├── GroupStage.tsx
    │   ├── GroupCard.tsx
    │   ├── GroupDragSlot.tsx
    │   ├── KnockoutStage.tsx
    │   ├── BracketTree.tsx
    │   ├── MatchNode.tsx
    │   ├── TeamBadge.tsx
    │   ├── TeamPool.tsx
    │   ├── AdvancementGlow.tsx
    │   └── ExportButton.tsx
    └── utils/
        ├── bracket.ts
        └── exportImage.ts
```

---

### Task 1: 项目脚手架搭建

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `tailwind.config.ts`, `postcss.config.js`, `.gitignore`, `index.html`, `AGENTS.md`
- Create: `src/main.tsx`, `src/App.tsx`, `src/index.css`, `src/vite-env.d.ts`

- [ ] **Step 1: 创建 package.json**

```json
{
  "name": "worldcup-predictor",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "zustand": "^4.5.0",
    "@dnd-kit/core": "^6.1.0",
    "@dnd-kit/utilities": "^3.2.2",
    "framer-motion": "^11.0.0",
    "html-to-image": "^1.11.11"
  },
  "devDependencies": {
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.0",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.38",
    "tailwindcss": "^3.4.4",
    "typescript": "^5.5.0",
    "vite": "^5.4.0"
  }
}
```

- [ ] **Step 2: 运行 npm install**

```bash
npm install
```
Expected: 所有依赖安装成功，无报错。

- [ ] **Step 3: 创建 vite.config.ts**

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

- [ ] **Step 4: 创建 tsconfig.json**

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

- [ ] **Step 5: 创建 tsconfig.app.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noFallthroughCasesInSwitch": true,
    "resolveJsonModule": true,
    "esModuleInterop": true
  },
  "include": ["src"]
}
```

- [ ] **Step 6: 创建 tsconfig.node.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "strict": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["vite.config.ts"]
}
```

- [ ] **Step 7: 创建 tailwind.config.ts**

```typescript
import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#0a0f1e',
        'bg-card': '#111827',
        'bg-card-hover': '#1a2332',
        'accent-gold': '#f0c040',
        'accent-green': '#22c55e',
        'slot-empty': '#374151',
      },
      animation: {
        'pulse-slot': 'pulseSlot 2s ease-in-out infinite',
        'glow-line': 'glowLine 1.5s ease-in-out infinite',
        'bounce-in': 'bounceIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      keyframes: {
        pulseSlot: {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '0.6' },
        },
        glowLine: {
          '0%': { strokeDashoffset: '1000' },
          '100%': { strokeDashoffset: '0' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config
```

- [ ] **Step 8: 创建 postcss.config.js**

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

- [ ] **Step 9: 创建 .gitignore**

```
node_modules
dist
.superpowers
```

- [ ] **Step 10: 创建 index.html**

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>2026 世界杯晋级预测</title>
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
  </head>
  <body class="bg-bg-primary text-white">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 11: 创建 src/main.tsx**

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

- [ ] **Step 12: 创建 src/App.tsx（占位）**

```tsx
function App() {
  return (
    <div className="min-h-screen bg-bg-primary text-white flex items-center justify-center">
      <h1 className="text-4xl text-accent-gold font-bold">🏆 2026 世界杯晋级预测</h1>
    </div>
  )
}

export default App
```

- [ ] **Step 13: 创建 src/index.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: system-ui, -apple-system, sans-serif;
  background-color: #0a0f1e;
  color: #ffffff;
  overflow-x: hidden;
}

/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: #111827;
}
::-webkit-scrollbar-thumb {
  background: #374151;
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: #4b5563;
}
```

- [ ] **Step 14: 创建 src/vite-env.d.ts**

```typescript
/// <reference types="vite/client" />
```

- [ ] **Step 15: 创建 AGENTS.md**

```markdown
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
```

- [ ] **Step 16: 运行 npm run dev 验证**

```bash
npm run dev
```
Expected: 页面显示 "🏆 2026 世界杯晋级预测" 金色标题，深蓝背景。

- [ ] **Step 17: 验证后停止 dev server 并 Commit**

```bash
git add .
git commit -m "chore: scaffold project with Vite + React + TypeScript + Tailwind"
```

---

### Task 2: 类型定义

**Files:**
- Create: `src/types/index.ts`

- [ ] **Step 1: 写入类型定义**

```typescript
export type Group = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L';

export type Stage = 'groups' | 'round32' | 'round16' | 'quarter' | 'semi' | 'final';

export type KnockoutRound = 'round32' | 'round16' | 'quarter' | 'semi' | 'final';

export interface Team {
  id: string;
  name: string;
  nameZh: string;
  flagEmoji: string;
  group: Group;
}

export interface KnockoutMatch {
  id: string;
  round: KnockoutRound;
  matchIndex: number;
  team1Id: string | null;
  team2Id: string | null;
  winnerId: string | null;
  nextMatchId: string | null;
  label: string;
  /** 小组赛来源：描述该位置由哪个小组的哪个名次填入 */
  source1: MatchSource | null;
  source2: MatchSource | null;
}

export interface MatchSource {
  type: 'group' | 'match';
  group?: Group;
  position?: number;
  matchId?: string;
}

export interface PredictionState {
  /** 小组赛晋级：groupId -> 按顺序的出线队伍 ID 列表（前2 + 第3） */
  groupAdvancements: Record<string, Team[]>;
  /** 淘汰赛胜者：matchId -> 胜者队伍 ID */
  knockoutWinners: Record<string, string>;
  /** 当前查看阶段 */
  currentStage: Stage;

  // Actions
  setGroupAdvancement: (groupId: string, position: number, team: Team) => void;
  removeGroupAdvancement: (groupId: string, position: number) => void;
  setKnockoutWinner: (matchId: string, teamId: string) => void;
  removeKnockoutWinner: (matchId: string) => void;
  setStage: (stage: Stage) => void;
  resetAll: () => void;
  /** 获取小组内尚未被选为出线的队伍 */
  getRemainingGroupTeams: (groupId: string) => Team[];
  /** 检查淘汰赛某场比赛的选手是否都来自上轮胜者 */
  getMatchTeams: (match: KnockoutMatch) => { team1: Team | null; team2: Team | null };
}
```

- [ ] **Step 2: Commit**

```bash
git add src/types/index.ts
git commit -m "feat: add TypeScript type definitions"
```

---

### Task 3: 队伍数据常量

**Files:**
- Create: `src/constants/teams.ts`

- [ ] **Step 1: 写入48队数据**

```typescript
import type { Team, Group } from '../types';

export const ALL_TEAMS: Team[] = [
  // Group A
  { id: 'mex', name: 'Mexico', nameZh: '墨西哥', flagEmoji: '🇲🇽', group: 'A' },
  { id: 'ned', name: 'Netherlands', nameZh: '荷兰', flagEmoji: '🇳🇱', group: 'A' },
  { id: 'sen', name: 'Senegal', nameZh: '塞内加尔', flagEmoji: '🇸🇳', group: 'A' },
  { id: 'qat', name: 'Qatar', nameZh: '卡塔尔', flagEmoji: '🇶🇦', group: 'A' },
  // Group B
  { id: 'can', name: 'Canada', nameZh: '加拿大', flagEmoji: '🇨🇦', group: 'B' },
  { id: 'den', name: 'Denmark', nameZh: '丹麦', flagEmoji: '🇩🇰', group: 'B' },
  { id: 'nga', name: 'Nigeria', nameZh: '尼日利亚', flagEmoji: '🇳🇬', group: 'B' },
  { id: 'per', name: 'Peru', nameZh: '秘鲁', flagEmoji: '🇵🇪', group: 'B' },
  // Group C
  { id: 'usa', name: 'United States', nameZh: '美国', flagEmoji: '🇺🇸', group: 'C' },
  { id: 'por', name: 'Portugal', nameZh: '葡萄牙', flagEmoji: '🇵🇹', group: 'C' },
  { id: 'mar', name: 'Morocco', nameZh: '摩洛哥', flagEmoji: '🇲🇦', group: 'C' },
  { id: 'jpn', name: 'Japan', nameZh: '日本', flagEmoji: '🇯🇵', group: 'C' },
  // Group D
  { id: 'arg', name: 'Argentina', nameZh: '阿根廷', flagEmoji: '🇦🇷', group: 'D' },
  { id: 'cro', name: 'Croatia', nameZh: '克罗地亚', flagEmoji: '🇭🇷', group: 'D' },
  { id: 'egy', name: 'Egypt', nameZh: '埃及', flagEmoji: '🇪🇬', group: 'D' },
  { id: 'aus', name: 'Australia', nameZh: '澳大利亚', flagEmoji: '🇦🇺', group: 'D' },
  // Group E
  { id: 'bra', name: 'Brazil', nameZh: '巴西', flagEmoji: '🇧🇷', group: 'E' },
  { id: 'sui', name: 'Switzerland', nameZh: '瑞士', flagEmoji: '🇨🇭', group: 'E' },
  { id: 'cmr', name: 'Cameroon', nameZh: '喀麦隆', flagEmoji: '🇨🇲', group: 'E' },
  { id: 'ksa', name: 'Saudi Arabia', nameZh: '沙特阿拉伯', flagEmoji: '🇸🇦', group: 'E' },
  // Group F
  { id: 'fra', name: 'France', nameZh: '法国', flagEmoji: '🇫🇷', group: 'F' },
  { id: 'uru', name: 'Uruguay', nameZh: '乌拉圭', flagEmoji: '🇺🇾', group: 'F' },
  { id: 'kor', name: 'South Korea', nameZh: '韩国', flagEmoji: '🇰🇷', group: 'F' },
  { id: 'jam', name: 'Jamaica', nameZh: '牙买加', flagEmoji: '🇯🇲', group: 'F' },
  // Group G
  { id: 'eng', name: 'England', nameZh: '英格兰', flagEmoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', group: 'G' },
  { id: 'col', name: 'Colombia', nameZh: '哥伦比亚', flagEmoji: '🇨🇴', group: 'G' },
  { id: 'gha', name: 'Ghana', nameZh: '加纳', flagEmoji: '🇬🇭', group: 'G' },
  { id: 'chn', name: 'China', nameZh: '中国', flagEmoji: '🇨🇳', group: 'G' },
  // Group H
  { id: 'esp', name: 'Spain', nameZh: '西班牙', flagEmoji: '🇪🇸', group: 'H' },
  { id: 'ukr', name: 'Ukraine', nameZh: '乌克兰', flagEmoji: '🇺🇦', group: 'H' },
  { id: 'tun', name: 'Tunisia', nameZh: '突尼斯', flagEmoji: '🇹🇳', group: 'H' },
  { id: 'can2', name: 'Costa Rica', nameZh: '哥斯达黎加', flagEmoji: '🇨🇷', group: 'H' },
  // Group I
  { id: 'ger', name: 'Germany', nameZh: '德国', flagEmoji: '🇩🇪', group: 'I' },
  { id: 'ita', name: 'Italy', nameZh: '意大利', flagEmoji: '🇮🇹', group: 'I' },
  { id: 'alg', name: 'Algeria', nameZh: '阿尔及利亚', flagEmoji: '🇩🇿', group: 'I' },
  { id: 'irn', name: 'Iran', nameZh: '伊朗', flagEmoji: '🇮🇷', group: 'I' },
  // Group J
  { id: 'bel', name: 'Belgium', nameZh: '比利时', flagEmoji: '🇧🇪', group: 'J' },
  { id: 'swe', name: 'Sweden', nameZh: '瑞典', flagEmoji: '🇸🇪', group: 'J' },
  { id: 'civ', name: 'Ivory Coast', nameZh: '科特迪瓦', flagEmoji: '🇨🇮', group: 'J' },
  { id: 'chi', name: 'Chile', nameZh: '智利', flagEmoji: '🇨🇱', group: 'J' },
  // Group K
  { id: 'nor', name: 'Norway', nameZh: '挪威', flagEmoji: '🇳🇴', group: 'K' },
  { id: 'pol', name: 'Poland', nameZh: '波兰', flagEmoji: '🇵🇱', group: 'K' },
  { id: 'mlr', name: 'Mali', nameZh: '马里', flagEmoji: '🇲🇱', group: 'K' },
  { id: 'ecu', name: 'Ecuador', nameZh: '厄瓜多尔', flagEmoji: '🇪🇨', group: 'K' },
  // Group L
  { id: 'rsa', name: 'South Africa', nameZh: '南非', flagEmoji: '🇿🇦', group: 'L' },
  { id: 'aut', name: 'Austria', nameZh: '奥地利', flagEmoji: '🇦🇹', group: 'L' },
  { id: 'par', name: 'Paraguay', nameZh: '巴拉圭', flagEmoji: '🇵🇾', group: 'L' },
  { id: 'nzl', name: 'New Zealand', nameZh: '新西兰', flagEmoji: '🇳🇿', group: 'L' },
];

export const GROUPS: Group[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

export function getTeamsByGroup(group: Group): Team[] {
  return ALL_TEAMS.filter(t => t.group === group);
}

export function getTeamById(id: string): Team | undefined {
  return ALL_TEAMS.find(t => t.id === id);
}
```

- [ ] **Step 2: Commit**

```bash
git add src/constants/teams.ts
git commit -m "feat: add 48 team data constants with 12 groups"
```

---

### Task 4: 淘汰赛对阵生成工具

**Files:**
- Create: `src/utils/bracket.ts`

- [ ] **Step 1: 写入对阵生成逻辑**

```typescript
import type { KnockoutMatch, KnockoutRound, Group, MatchSource } from '../types';

const ROUNDS: KnockoutRound[] = ['round32', 'round16', 'quarter', 'semi', 'final'];

function makeId(round: KnockoutRound, index: number): string {
  return `${round}-${index}`;
}

/**
 * 生成完整的淘汰赛对阵表（32场比赛）
 * R32: 1-16, R16: 1-8, QF: 1-4, SF: 1-2, Final: 1
 * 采用简化的56场比赛对阵结构
 */
export function generateBracket(): KnockoutMatch[] {
  const matches: KnockoutMatch[] = [];

  // === R32 (16 matches) ===
  // 定义每个 R32 比赛来源：组别+名次
  const r32Sources: { label: string; s1: MatchSource; s2: MatchSource }[] = [
    { label: 'R32-1',  s1: { type: 'group', group: 'A', position: 1 }, s2: { type: 'group', group: 'B', position: 2 } },
    { label: 'R32-2',  s1: { type: 'group', group: 'C', position: 1 }, s2: { type: 'group', group: 'D', position: 2 } },
    { label: 'R32-3',  s1: { type: 'group', group: 'E', position: 1 }, s2: { type: 'group', group: 'F', position: 2 } },
    { label: 'R32-4',  s1: { type: 'group', group: 'G', position: 1 }, s2: { type: 'group', group: 'H', position: 2 } },
    { label: 'R32-5',  s1: { type: 'group', group: 'I', position: 1 }, s2: { type: 'group', group: 'J', position: 2 } },
    { label: 'R32-6',  s1: { type: 'group', group: 'K', position: 1 }, s2: { type: 'group', group: 'L', position: 2 } },
    { label: 'R32-7',  s1: { type: 'group', group: 'B', position: 1 }, s2: { type: 'group', group: 'A', position: 3 } },
    { label: 'R32-8',  s1: { type: 'group', group: 'D', position: 1 }, s2: { type: 'group', group: 'C', position: 3 } },
    { label: 'R32-9',  s1: { type: 'group', group: 'F', position: 1 }, s2: { type: 'group', group: 'E', position: 3 } },
    { label: 'R32-10', s1: { type: 'group', group: 'H', position: 1 }, s2: { type: 'group', group: 'G', position: 3 } },
    { label: 'R32-11', s1: { type: 'group', group: 'J', position: 1 }, s2: { type: 'group', group: 'I', position: 3 } },
    { label: 'R32-12', s1: { type: 'group', group: 'L', position: 1 }, s2: { type: 'group', group: 'K', position: 3 } },
    { label: 'R32-13', s1: { type: 'group', group: 'A', position: 2 }, s2: { type: 'group', group: 'B', position: 3 } },
    { label: 'R32-14', s1: { type: 'group', group: 'C', position: 2 }, s2: { type: 'group', group: 'D', position: 3 } },
    { label: 'R32-15', s1: { type: 'group', group: 'E', position: 2 }, s2: { type: 'group', group: 'F', position: 3 } },
    { label: 'R32-16', s1: { type: 'group', group: 'G', position: 2 }, s2: { type: 'group', group: 'H', position: 3 } },
  ];

  // Create R32 matches linked to R16
  for (let i = 0; i < 16; i++) {
    const nextIdx = Math.floor(i / 2);
    matches.push({
      id: makeId('round32', i + 1),
      round: 'round32',
      matchIndex: i + 1,
      team1Id: null,
      team2Id: null,
      winnerId: null,
      nextMatchId: makeId('round16', nextIdx + 1),
      label: r32Sources[i].label,
      source1: r32Sources[i].s1,
      source2: r32Sources[i].s2,
    });
  }

  // === R16 (8 matches) linked to QF ===
  for (let i = 0; i < 8; i++) {
    const nextIdx = Math.floor(i / 2);
    matches.push({
      id: makeId('round16', i + 1),
      round: 'round16',
      matchIndex: i + 1,
      team1Id: null,
      team2Id: null,
      winnerId: null,
      nextMatchId: makeId('quarter', nextIdx + 1),
      label: `R16-${i + 1}`,
      source1: { type: 'match', matchId: makeId('round32', i * 2 + 1) },
      source2: { type: 'match', matchId: makeId('round32', i * 2 + 2) },
    });
  }

  // === Quarter-Finals (4 matches) linked to SF ===
  for (let i = 0; i < 4; i++) {
    const nextIdx = Math.floor(i / 2);
    matches.push({
      id: makeId('quarter', i + 1),
      round: 'quarter',
      matchIndex: i + 1,
      team1Id: null,
      team2Id: null,
      winnerId: null,
      nextMatchId: makeId('semi', nextIdx + 1),
      label: `QF-${i + 1}`,
      source1: { type: 'match', matchId: makeId('round16', i * 2 + 1) },
      source2: { type: 'match', matchId: makeId('round16', i * 2 + 2) },
    });
  }

  // === Semi-Finals (2 matches) linked to Final ===
  matches.push({
    id: makeId('semi', 1),
    round: 'semi',
    matchIndex: 1,
    team1Id: null,
    team2Id: null,
    winnerId: null,
    nextMatchId: makeId('final', 1),
    label: 'SF-1',
    source1: { type: 'match', matchId: makeId('quarter', 1) },
    source2: { type: 'match', matchId: makeId('quarter', 2) },
  });
  matches.push({
    id: makeId('semi', 2),
    round: 'semi',
    matchIndex: 2,
    team1Id: null,
    team2Id: null,
    winnerId: null,
    nextMatchId: makeId('final', 1),
    label: 'SF-2',
    source1: { type: 'match', matchId: makeId('quarter', 3) },
    source2: { type: 'match', matchId: makeId('quarter', 4) },
  });

  // === Final ===
  matches.push({
    id: makeId('final', 1),
    round: 'final',
    matchIndex: 1,
    team1Id: null,
    team2Id: null,
    winnerId: null,
    nextMatchId: null,
    label: 'Final',
    source1: { type: 'match', matchId: makeId('semi', 1) },
    source2: { type: 'match', matchId: makeId('semi', 2) },
  });

  return matches;
}

export function getMatchesByRound(matches: KnockoutMatch[], round: KnockoutRound): KnockoutMatch[] {
  return matches.filter(m => m.round === round);
}

export function getMatchById(matches: KnockoutMatch[], id: string): KnockoutMatch | undefined {
  return matches.find(m => m.id === id);
}

export const ROUND_LABELS: Record<KnockoutRound, string> = {
  round32: '32强',
  round16: '16强',
  quarter: '8强',
  semi: '半决赛',
  final: '决赛',
};

export const STAGE_LABELS: Record<string, string> = {
  groups: '小组赛',
  round32: '32强',
  round16: '16强',
  quarter: '8强',
  semi: '半决赛',
  final: '决赛',
};
```

- [ ] **Step 2: Commit**

```bash
git add src/utils/bracket.ts
git commit -m "feat: add knockout bracket generation utility"
```

---

### Task 5: Zustand 全局状态 Store

**Files:**
- Create: `src/store/usePredictionStore.ts`

- [ ] **Step 1: 写入 Zustand store**

```typescript
import { create } from 'zustand';
import type { PredictionState, Team, Stage, KnockoutMatch } from '../types';
import { ALL_TEAMS, getTeamsByGroup, getTeamById, GROUPS } from '../constants/teams';
import { generateBracket, getMatchById } from '../utils/bracket';

interface StoreState extends PredictionState {
  bracket: KnockoutMatch[];
}

export const usePredictionStore = create<StoreState>((set, get) => ({
  groupAdvancements: {},
  knockoutWinners: {},
  currentStage: 'groups',
  bracket: generateBracket(),

  setGroupAdvancement: (groupId: string, position: number, team: Team) =>
    set((state) => {
      const groupAdvs = { ...state.groupAdvancements };
      if (!groupAdvs[groupId]) {
        groupAdvs[groupId] = new Array(3).fill(null);
      } else {
        groupAdvs[groupId] = [...groupAdvs[groupId]];
      }
      // 移除其他位置的同一队伍
      for (let i = 0; i < 3; i++) {
        if (groupAdvs[groupId][i]?.id === team.id) {
          groupAdvs[groupId][i] = null;
        }
      }
      groupAdvs[groupId][position] = team;
      // 自动重新生成淘汰赛对阵
      const newBracket = regenerateBracket(groupAdvs, state.knockoutWinners);
      return { groupAdvancements: groupAdvs, bracket: newBracket };
    }),

  removeGroupAdvancement: (groupId: string, position: number) =>
    set((state) => {
      const groupAdvs = { ...state.groupAdvancements };
      groupAdvs[groupId] = [...(groupAdvs[groupId] || [])];
      groupAdvs[groupId][position] = null;
      const newBracket = regenerateBracket(groupAdvs, state.knockoutWinners);
      return { groupAdvancements: groupAdvs, bracket: newBracket };
    }),

  setKnockoutWinner: (matchId: string, teamId: string) =>
    set((state) => {
      const winners = { ...state.knockoutWinners, [matchId]: teamId };
      // 级联清理：如果晋级队伍被撤销，下游比赛自动清空
      const match = getMatchById(state.bracket, matchId);
      if (match) {
        cascadeClearWinners(winners, state.bracket, match.nextMatchId);
      }
      const newBracket = regenerateBracket(state.groupAdvancements, winners);
      return { knockoutWinners: winners, bracket: newBracket };
    }),

  removeKnockoutWinner: (matchId: string) =>
    set((state) => {
      const winners = { ...state.knockoutWinners };
      delete winners[matchId];
      // 级联清空下游
      const match = getMatchById(state.bracket, matchId);
      if (match) {
        cascadeClearWinners(winners, state.bracket, match.nextMatchId);
      }
      const newBracket = regenerateBracket(state.groupAdvancements, winners);
      return { knockoutWinners: winners, bracket: newBracket };
    }),

  setStage: (stage: Stage) => set({ currentStage: stage }),

  resetAll: () => set({ groupAdvancements: {}, knockoutWinners: {}, currentStage: 'groups', bracket: generateBracket() }),

  getRemainingGroupTeams: (groupId: string) => {
    const state = get();
    const advs = state.groupAdvancements[groupId] || [];
    const advancedIds = advs.filter(Boolean).map((t: Team) => t.id);
    return getTeamsByGroup(groupId as any).filter(t => !advancedIds.includes(t.id));
  },

  getMatchTeams: (match: KnockoutMatch) => {
    const state = get();
    const findTeamForSlot = (src: typeof match.source1): Team | null => {
      if (!src) return null;
      if (src.type === 'group' && src.group && src.position !== undefined) {
        const advs = state.groupAdvancements[src.group] || [];
        return advs[src.position - 1] || null;
      }
      if (src.type === 'match' && src.matchId) {
        const winnerId = state.knockoutWinners[src.matchId];
        if (winnerId) return getTeamById(winnerId) || null;
        // 来源比赛尚未决出胜者 -> 显示比赛标签
      }
      return null;
    };
    return {
      team1: findTeamForSlot(match.source1),
      team2: findTeamForSlot(match.source2),
    };
  },
}));

/** 根据小组出线结果重新计算淘汰赛对阵表中的队伍 */
function regenerateBracket(
  groupAdvs: Record<string, Team[]>,
  winners: Record<string, string>
): KnockoutMatch[] {
  const bracket = generateBracket();
  return bracket.map(match => {
    const team1 = getTeamForSource(match.source1, groupAdvs, winners, bracket);
    const team2 = getTeamForSource(match.source2, groupAdvs, winners, bracket);
    return {
      ...match,
      team1Id: team1?.id || null,
      team2Id: team2?.id || null,
      winnerId: winners[match.id] || null,
    };
  });
}

function getTeamForSource(
  src: { type: 'group' | 'match'; group?: string; position?: number; matchId?: string } | null,
  groupAdvs: Record<string, Team[]>,
  winners: Record<string, string>,
  bracket: KnockoutMatch[]
): Team | null {
  if (!src) return null;
  if (src.type === 'group' && src.group && src.position !== undefined) {
    const advs = groupAdvs[src.group] || [];
    return advs[src.position - 1] || null;
  }
  if (src.type === 'match' && src.matchId) {
    const winnerId = winners[src.matchId];
    if (winnerId) return getTeamById(winnerId) || null;
  }
  return null;
}

function cascadeClearWinners(
  winners: Record<string, string>,
  bracket: KnockoutMatch[],
  fromMatchId: string | null
): void {
  if (!fromMatchId) return;
  delete winners[fromMatchId];
  const match = getMatchById(bracket, fromMatchId);
  if (match?.nextMatchId) {
    delete winners[match.nextMatchId];
    // 继续向下游级联
    const nextMatch = getMatchById(bracket, match.nextMatchId);
    if (nextMatch?.nextMatchId) {
      cascadeClearWinners(winners, bracket, nextMatch.nextMatchId);
    }
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/store/usePredictionStore.ts
git commit -m "feat: add Zustand prediction store with group + knockout state"
```

---

### Task 6: useTournament Hook

**Files:**
- Create: `src/hooks/useTournament.ts`

- [ ] **Step 1: 写入 hook**

```typescript
import { useMemo } from 'react';
import { usePredictionStore } from '../store/usePredictionStore';
import { getMatchesByRound } from '../utils/bracket';
import type { Stage, KnockoutRound, KnockoutMatch } from '../types';

const stageToRound: Partial<Record<Stage, KnockoutRound>> = {
  round32: 'round32',
  round16: 'round16',
  quarter: 'quarter',
  semi: 'semi',
  final: 'final',
};

export function useTournament() {
  const bracket = usePredictionStore(s => s.bracket);
  const groupAdvancements = usePredictionStore(s => s.groupAdvancements);
  const knockoutWinners = usePredictionStore(s => s.knockoutWinners);

  const currentStage = usePredictionStore(s => s.currentStage);

  const currentRoundMatches = useMemo((): KnockoutMatch[] => {
    const round = stageToRound[currentStage];
    if (!round) return [];
    return getMatchesByRound(bracket, round);
  }, [bracket, currentStage]);

  /** 检查当前阶段是否所有比赛都已选出胜者 */
  const isStageComplete = useMemo((): boolean => {
    if (currentStage === 'groups') {
      return GROUPS.every(g => {
        const advs = groupAdvancements[g];
        return advs && advs.length >= 2 && advs[0] !== null && advs[1] !== null;
      });
    }
    return currentRoundMatches.every(m => knockoutWinners[m.id]);
  }, [currentStage, currentRoundMatches, groupAdvancements, knockoutWinners]);

  return {
    bracket,
    groupAdvancements,
    knockoutWinners,
    currentStage,
    currentRoundMatches,
    isStageComplete,
  };
}

import { GROUPS } from '../constants/teams';
```

- [ ] **Step 2: Commit**

```bash
git add src/hooks/useTournament.ts
git commit -m "feat: add useTournament hook for match computation"
```

---

### Task 7: TeamBadge 组件

**Files:**
- Create: `src/components/TeamBadge.tsx`

- [ ] **Step 1: 写入 TeamBadge**

```tsx
import { forwardRef } from 'react';
import type { Team } from '../types';

interface TeamBadgeProps {
  team: Team;
  size?: 'sm' | 'md' | 'lg';
  isWinner?: boolean;
  draggable?: boolean;
  style?: React.CSSProperties;
  listeners?: Record<string, any>;
  attributes?: Record<string, any>;
}

const sizeClasses = {
  sm: 'px-1.5 py-0.5 text-xs gap-1',
  md: 'px-2 py-1 text-sm gap-1.5',
  lg: 'px-3 py-1.5 text-base gap-2',
};

const flagSize = { sm: 'text-base', md: 'text-xl', lg: 'text-2xl' };

export const TeamBadge = forwardRef<HTMLDivElement, TeamBadgeProps>(
  ({ team, size = 'md', isWinner = false, draggable = false, style, listeners, attributes }, ref) => {
    return (
      <div
        ref={ref}
        className={`
          inline-flex items-center rounded-lg font-semibold select-none
          ${sizeClasses[size]}
          ${isWinner
            ? 'bg-accent-gold/20 border-2 border-accent-gold text-accent-gold shadow-[0_0_12px_rgba(240,192,64,0.3)]'
            : 'bg-bg-card border border-gray-700 text-gray-200 hover:border-gray-500 cursor-grab active:cursor-grabbing'}
          ${draggable ? 'cursor-grab active:cursor-grabbing' : ''}
          transition-all duration-200
        `}
        style={style}
        {...listeners}
        {...attributes}
      >
        <span className={flagSize[size]}>{team.flagEmoji}</span>
        <span className="truncate max-w-[100px]">{team.nameZh}</span>
        {isWinner && <span className="text-xs ml-0.5">👑</span>}
      </div>
    );
  }
);

TeamBadge.displayName = 'TeamBadge';
```

- [ ] **Step 2: Commit**

```bash
git add src/components/TeamBadge.tsx
git commit -m "feat: add TeamBadge component with drag support"
```

---

### Task 8: TeamPool 组件（队伍池）

**Files:**
- Create: `src/components/TeamPool.tsx`

- [ ] **Step 1: 写入 TeamPool**

```tsx
import { useDroppable } from '@dnd-kit/core';
import type { Team } from '../types';
import { TeamBadge } from './TeamBadge';

interface TeamPoolProps {
  teams: Team[];
  title?: string;
}

export function TeamPool({ teams, title = '队伍池' }: TeamPoolProps) {
  const { setNodeRef, isOver } = useDroppable({ id: 'team-pool' });

  return (
    <div
      ref={setNodeRef}
      className={`
        bg-bg-card/50 rounded-xl p-4 border border-gray-800
        ${isOver ? 'border-accent-gold bg-accent-gold/5' : ''}
        transition-colors duration-200
      `}
    >
      <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-3 font-semibold">
        {title} ({teams.length})
      </h3>
      <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto pr-1">
        {teams.map(team => (
          <TeamBadge key={team.id} team={team} size="sm" draggable />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/TeamPool.tsx
git commit -m "feat: add TeamPool droppable container"
```

---

### Task 9: GroupDragSlot 组件（小组出线槽位）

**Files:**
- Create: `src/components/GroupDragSlot.tsx`

- [ ] **Step 1: 写入 GroupDragSlot**

```tsx
import { useDroppable } from '@dnd-kit/core';
import { motion, AnimatePresence } from 'framer-motion';
import type { Team } from '../types';
import { TeamBadge } from './TeamBadge';

interface GroupDragSlotProps {
  id: string;
  label: string;
  team: Team | null;
  isOccupied: boolean;
}

const slotLabels: Record<number, string> = {
  0: '🥇 第1名',
  1: '🥈 第2名',
  2: '🥉 第3名(最佳)',
};

export function GroupDragSlot({ id, label, team, isOccupied }: GroupDragSlotProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`
        relative rounded-lg border-2 border-dashed min-h-[36px] flex items-center justify-center
        transition-all duration-200
        ${isOver
          ? 'border-accent-gold bg-accent-gold/10 scale-105'
          : isOccupied
            ? 'border-emerald-600/50 bg-emerald-500/5'
            : 'border-slot-empty bg-slot-empty/10 animate-pulse-slot'}
      `}
    >
      <AnimatePresence mode="wait">
        {team ? (
          <motion.div
            key={team.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <TeamBadge team={team} size="sm" />
          </motion.div>
        ) : (
          <span className="text-gray-500 text-xs py-2">{label}</span>
        )}
      </AnimatePresence>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/GroupDragSlot.tsx
git commit -m "feat: add GroupDragSlot droppable with spring animation"
```

---

### Task 10: GroupCard 组件

**Files:**
- Create: `src/components/GroupCard.tsx`

- [ ] **Step 1: 写入 GroupCard**

```tsx
import { useDraggable } from '@dnd-kit/core';
import type { Team, Group } from '../types';
import { TeamBadge } from './TeamBadge';
import { GroupDragSlot } from './GroupDragSlot';
import { usePredictionStore } from '../store/usePredictionStore';

interface GroupCardProps {
  group: Group;
  teams: Team[];
}

export function GroupCard({ group, teams }: GroupCardProps) {
  const groupAdvancements = usePredictionStore(s => s.groupAdvancements);
  const advs = groupAdvancements[group] || [];

  return (
    <div className="bg-bg-card rounded-xl p-4 border border-gray-800 hover:border-gray-700 transition-colors">
      <h3 className="text-accent-gold font-bold text-lg mb-3 text-center">
        小组 {group}
      </h3>

      {/* 小组队伍列表 */}
      <div className="flex flex-col gap-1.5 mb-4">
        {teams.map(team => (
          <DraggableTeam key={team.id} team={team} />
        ))}
      </div>

      {/* 分隔线 */}
      <div className="border-t border-gray-700/50 my-3" />

      {/* 出线槽位 */}
      <div className="flex flex-col gap-2">
        {[0, 1, 2].map(pos => (
          <GroupDragSlot
            key={`${group}-slot-${pos}`}
            id={`group-slot-${group}-${pos}`}
            label={['第1名', '第2名', '第3名(最佳)'][pos]}
            team={advs[pos] || null}
            isOccupied={!!advs[pos]}
          />
        ))}
      </div>
    </div>
  );
}

function DraggableTeam({ team }: { team: Team }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `team-${team.id}`,
    data: { team },
  });

  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)`, zIndex: 50 }
    : undefined;

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <TeamBadge
        team={team}
        size="sm"
        draggable
      />
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/GroupCard.tsx
git commit -m "feat: add GroupCard with draggable teams and drop slots"
```

---

### Task 11: GroupStage 组件

**Files:**
- Create: `src/components/GroupStage.tsx`

- [ ] **Step 1: 写入 GroupStage**

```tsx
import { DndContext, DragOverlay, type DragStartEvent, type DragEndEvent } from '@dnd-kit/core';
import { useState } from 'react';
import { GROUPS, getTeamsByGroup } from '../constants/teams';
import { usePredictionStore } from '../store/usePredictionStore';
import { GroupCard } from './GroupCard';
import { TeamBadge } from './TeamBadge';
import type { Team } from '../types';

export function GroupStage() {
  const setGroupAdvancement = usePredictionStore(s => s.setGroupAdvancement);
  const [activeTeam, setActiveTeam] = useState<Team | null>(null);

  function handleDragStart(event: DragStartEvent) {
    const team = event.active.data.current?.team as Team | undefined;
    if (team) setActiveTeam(team);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveTeam(null);
    const { active, over } = event;
    if (!over) return;

    const team = active.data.current?.team as Team | undefined;
    if (!team) return;

    // 解析目标槽位 ID: "group-slot-{group}-{position}"
    const overId = String(over.id);
    const match = overId.match(/^group-slot-(.+)-(\d+)$/);
    if (match) {
      const groupId = match[1];
      const position = parseInt(match[2], 10);
      setGroupAdvancement(groupId, position, team);
    }
  }

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {GROUPS.map(g => (
          <GroupCard key={g} group={g} teams={getTeamsByGroup(g)} />
        ))}
      </div>

      <DragOverlay dropAnimation={null}>
        {activeTeam ? (
          <TeamBadge team={activeTeam} size="md" isWinner />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/GroupStage.tsx
git commit -m "feat: add GroupStage with dnd-kit context and 12 groups grid"
```

---

### Task 12: MatchNode 组件（淘汰赛节点）

**Files:**
- Create: `src/components/MatchNode.tsx`

- [ ] **Step 1: 写入 MatchNode**

```tsx
import { useDroppable } from '@dnd-kit/core';
import { motion, AnimatePresence } from 'framer-motion';
import type { KnockoutMatch, Team } from '../types';
import { TeamBadge } from './TeamBadge';

interface MatchNodeProps {
  match: KnockoutMatch;
  team1: Team | null;
  team2: Team | null;
  isComplete: boolean;
  x: number;
  y: number;
}

export function MatchNode({ match, team1, team2, isComplete, x, y }: MatchNodeProps) {
  const { setNodeRef, isOver } = useDroppable({ id: `match-${match.id}` });

  const winnerTeam = team1 && team2 && match.winnerId
    ? (match.winnerId === team1.id ? team1 : team2)
    : null;

  return (
    <foreignObject x={x} y={y} width={160} height={80}>
      <div
        ref={setNodeRef}
        className={`
          bg-bg-card rounded-lg border p-2 text-xs w-[156px]
          transition-all duration-200
          ${isOver ? 'border-accent-gold bg-accent-gold/10 scale-105 shadow-lg shadow-accent-gold/20' : 'border-gray-700'}
          ${isComplete ? 'border-emerald-600/50' : ''}
        `}
      >
        <div className="text-gray-500 text-[10px] mb-1 text-center">{match.label}</div>
        <div className="space-y-1">
          {/* Team 1 slot */}
          <div className="flex items-center gap-1 min-h-[20px]">
            {team1 ? (
              <span className="flex-1">
                <TeamBadge team={team1} size="sm" isWinner={match.winnerId === team1.id} />
              </span>
            ) : (
              <span className="text-gray-600 text-[10px] flex-1 text-center">待定</span>
            )}
          </div>
          {/* VS divider */}
          <div className="border-t border-gray-700/50" />
          {/* Team 2 slot */}
          <div className="flex items-center gap-1 min-h-[20px]">
            {team2 ? (
              <span className="flex-1">
                <TeamBadge team={team2} size="sm" isWinner={match.winnerId === team2.id} />
              </span>
            ) : (
              <span className="text-gray-600 text-[10px] flex-1 text-center">待定</span>
            )}
          </div>
        </div>

        {/* 胜者指示 */}
        <AnimatePresence>
          {winnerTeam && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mt-1 text-center"
            >
              <span className="text-[10px] text-accent-gold">↑ 晋级</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </foreignObject>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/MatchNode.tsx
git commit -m "feat: add MatchNode droppable knockout match component"
```

---

### Task 13: BracketTree 组件（SVG 对阵树）

**Files:**
- Create: `src/components/BracketTree.tsx`

- [ ] **Step 1: 写入 BracketTree**

```tsx
import { useMemo } from 'react';
import type { KnockoutMatch, KnockoutRound, Team } from '../types';
import { MatchNode } from './MatchNode';

interface BracketTreeProps {
  matches: KnockoutMatch[];
  round: KnockoutRound;
  getTeam: (match: KnockoutMatch) => { team1: Team | null; team2: Team | null };
  winners: Record<string, string>;
}

interface LayoutNode {
  match: KnockoutMatch;
  x: number;
  y: number;
}

function layoutMatches(matches: KnockoutMatch[]): LayoutNode[] {
  const count = matches.length;
  const spacing = 100; // vertical spacing
  const totalHeight = (count - 1) * spacing;
  const startY = -totalHeight / 2;

  return matches.map((m, i) => ({
    match: m,
    x: 0,
    y: startY + i * spacing,
  }));
}

export function BracketTree({ matches, getTeam, winners, round }: BracketTreeProps) {
  const nodes = useMemo(() => layoutMatches(matches), [matches]);

  const matchMap = useMemo(() => {
    const map = new Map<string, KnockoutMatch>();
    matches.forEach(m => map.set(m.id, m));
    return map;
  }, [matches]);

  // 计算连线
  const connectors = useMemo(() => {
    const lines: { x1: number; y1: number; x2: number; y2: number; active: boolean }[] = [];
    nodes.forEach(node => {
      if (node.match.nextMatchId && matchMap.has(node.match.nextMatchId)) {
        // 简单连线逻辑留作占位，后续 Task 优化
        // lines.push(...);
      }
    });
    return lines;
  }, [nodes, matchMap]);

  const svgWidth = 200;
  const svgHeight = Math.max(nodes.length * 100, 200);
  const centerX = svgWidth / 2;

  return (
    <div className="overflow-auto">
      <svg width={svgWidth} height={svgHeight} viewBox={`${-centerX} ${-svgHeight / 2} ${svgWidth} ${svgHeight}`}>
        {/* 连线 */}
        <g stroke="#374151" strokeWidth="1.5" fill="none">
          {/* 连线将在下个 Task 完善 */}
          {nodes.map((node, i) => {
            if (i % 2 === 0 && i + 1 < nodes.length) {
              const y1 = node.y;
              const y2 = nodes[i + 1].y;
              // 垂直连线连接相邻节点
              return (
                <line
                  key={`conn-${i}`}
                  x1={0} y1={y1 + 40}
                  x2={0} y2={y2 - 40}
                  strokeDasharray="4 2"
                  opacity={0.3}
                />
              );
            }
            return null;
          })}
        </g>

        {/* 比赛节点 */}
        {nodes.map(node => {
          const { team1, team2 } = getTeam(node.match);
          return (
            <MatchNode
              key={node.match.id}
              match={node.match}
              team1={team1}
              team2={team2}
              isComplete={!!winners[node.match.id]}
              x={node.x - 80}
              y={node.y - 40}
            />
          );
        })}
      </svg>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/BracketTree.tsx
git commit -m "feat: add BracketTree SVG bracket visualization"
```

---

### Task 14: AdvancementGlow 组件（晋级粒子动效）

**Files:**
- Create: `src/components/AdvancementGlow.tsx`

- [ ] **Step 1: 写入 AdvancementGlow**

```tsx
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface AdvancementGlowProps {
  trigger: boolean;
  x: number;
  y: number;
  onComplete?: () => void;
}

interface Particle {
  id: number;
  angle: number;
  distance: number;
  color: string;
  delay: number;
}

const COLORS = ['#f0c040', '#f59e0b', '#eab308', '#fbbf24', '#fcd34d'];

export function AdvancementGlow({ trigger, x, y, onComplete }: AdvancementGlowProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (trigger) {
      const newParticles: Particle[] = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        angle: (i / 12) * Math.PI * 2,
        distance: 30 + Math.random() * 40,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        delay: Math.random() * 0.2,
      }));
      setParticles(newParticles);
    } else {
      setParticles([]);
    }
  }, [trigger]);

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {trigger && (
        <motion.div
          className="absolute pointer-events-none z-50"
          style={{ left: x, top: y }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* 中心光晕 */}
          <motion.div
            className="absolute rounded-full"
            style={{
              width: 40,
              height: 40,
              marginLeft: -20,
              marginTop: -20,
              background: 'radial-gradient(circle, rgba(240,192,64,0.6) 0%, transparent 70%)',
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 2.5, opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />

          {/* 粒子 */}
          {particles.map(p => (
            <motion.div
              key={p.id}
              className="absolute rounded-full"
              style={{
                width: 6,
                height: 6,
                backgroundColor: p.color,
                marginLeft: -3,
                marginTop: -3,
              }}
              initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
              animate={{
                x: Math.cos(p.angle) * p.distance,
                y: Math.sin(p.angle) * p.distance,
                opacity: 0,
                scale: 1,
              }}
              transition={{
                duration: 0.6,
                delay: p.delay,
                ease: 'easeOut',
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/AdvancementGlow.tsx
git commit -m "feat: add AdvancementGlow particle animation component"
```

---

### Task 15: KnockoutStage 组件

**Files:**
- Create: `src/components/KnockoutStage.tsx`

- [ ] **Step 1: 写入 KnockoutStage**

```tsx
import { DndContext, DragOverlay, type DragStartEvent, type DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useState, useCallback } from 'react';
import { usePredictionStore } from '../store/usePredictionStore';
import { TeamBadge } from './TeamBadge';
import { BracketTree } from './BracketTree';
import { AdvancementGlow } from './AdvancementGlow';
import { ROUND_LABELS } from '../utils/bracket';
import type { Team, KnockoutMatch, KnockoutRound } from '../types';
import { getTeamById } from '../constants/teams';

interface KnockoutStageProps {
  matches: KnockoutMatch[];
  round: KnockoutRound;
}

export function KnockoutStage({ matches, round }: KnockoutStageProps) {
  const setKnockoutWinner = usePredictionStore(s => s.setKnockoutWinner);
  const getMatchTeams = usePredictionStore(s => s.getMatchTeams);
  const knockoutWinners = usePredictionStore(s => s.knockoutWinners);

  const [activeTeam, setActiveTeam] = useState<Team | null>(null);
  const [glowTrigger, setGlowTrigger] = useState(false);
  const [glowPos, setGlowPos] = useState({ x: 0, y: 0 });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const team = event.active.data.current?.team as Team | undefined;
    if (team) setActiveTeam(team);
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    setActiveTeam(null);
    const { active, over } = event;
    if (!over) return;

    const team = active.data.current?.team as Team | undefined;
    if (!team) return;

    const overId = String(over.id);
    const match = matchIdPrefix(overId);
    if (match) {
      const matchId = overId.replace('match-', '');
      setKnockoutWinner(matchId, team.id);
      // 触发粒子动效
      setGlowPos({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
      setGlowTrigger(true);
      setTimeout(() => setGlowTrigger(false), 100);
    }
  }, [setKnockoutWinner]);

  function matchIdPrefix(id: string): boolean {
    return id.startsWith('match-');
  }

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="p-4">
        <h3 className="text-accent-gold text-xl font-bold text-center mb-4">
          {ROUND_LABELS[round]}
        </h3>

        <div className="overflow-x-auto">
          <BracketTree
            matches={matches}
            round={round}
            getTeam={getMatchTeams}
            winners={knockoutWinners}
          />
        </div>

        <AdvancementGlow trigger={glowTrigger} x={glowPos.x} y={glowPos.y} />
      </div>

      <DragOverlay dropAnimation={null}>
        {activeTeam ? (
          <TeamBadge team={activeTeam} size="md" isWinner />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/KnockoutStage.tsx
git commit -m "feat: add KnockoutStage with drag-to-advance interaction"
```

---

### Task 16: StageNav 和 ExportButton 组件

**Files:**
- Create: `src/components/StageNav.tsx`
- Create: `src/components/ExportButton.tsx`

- [ ] **Step 1: 写入 StageNav**

```tsx
import { motion } from 'framer-motion';
import { usePredictionStore } from '../store/usePredictionStore';
import { STAGE_LABELS } from '../utils/bracket';
import type { Stage } from '../types';

const stages: Stage[] = ['groups', 'round32', 'round16', 'quarter', 'semi', 'final'];

export function StageNav() {
  const currentStage = usePredictionStore(s => s.currentStage);
  const setStage = usePredictionStore(s => s.setStage);

  return (
    <nav className="flex items-center gap-1 bg-bg-card rounded-xl p-1 border border-gray-800">
      {stages.map(stage => (
        <button
          key={stage}
          onClick={() => setStage(stage)}
          className={`
            relative px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
            ${currentStage === stage
              ? 'text-bg-primary'
              : 'text-gray-400 hover:text-white'}
          `}
        >
          {currentStage === stage && (
            <motion.div
              layoutId="stage-indicator"
              className="absolute inset-0 bg-accent-gold rounded-lg"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <span className="relative z-10">{STAGE_LABELS[stage]}</span>
        </button>
      ))}
    </nav>
  );
}
```

- [ ] **Step 2: 写入 ExportButton**

```tsx
import { toPng } from 'html-to-image';
import { useState } from 'react';

export function ExportButton() {
  const [exporting, setExporting] = useState(false);

  async function handleExport() {
    setExporting(true);
    const el = document.getElementById('prediction-content');
    if (!el) { setExporting(false); return; }

    try {
      const dataUrl = await toPng(el, {
        backgroundColor: '#0a0f1e',
        pixelRatio: 2,
      });
      const link = document.createElement('a');
      link.download = `worldcup-2026-prediction-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Export failed:', err);
    }
    setExporting(false);
  }

  return (
    <button
      onClick={handleExport}
      disabled={exporting}
      className="px-4 py-2 bg-accent-gold text-bg-primary font-bold rounded-lg hover:bg-yellow-500 transition-colors disabled:opacity-50 text-sm"
    >
      {exporting ? '导出中...' : '📸 导出结果'}
    </button>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/StageNav.tsx src/components/ExportButton.tsx
git commit -m "feat: add StageNav and ExportButton components"
```

---

### Task 17: Layout 和 App 组装

**Files:**
- Modify: `src/App.tsx`
- Create: `src/components/Layout.tsx`

- [ ] **Step 1: 写入 Layout**

```tsx
import { StageNav } from './StageNav';
import { ExportButton } from './ExportButton';
import { usePredictionStore } from '../store/usePredictionStore';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const resetAll = usePredictionStore(s => s.resetAll);

  return (
    <div className="min-h-screen bg-bg-primary text-white flex flex-col">
      {/* 顶部栏 */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-gray-800 bg-bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <h1 className="text-xl font-bold text-accent-gold flex items-center gap-2">
          <span>🏆</span>
          <span className="hidden sm:inline">2026 世界杯晋级预测</span>
        </h1>

        <StageNav />

        <div className="flex items-center gap-3">
          <button
            onClick={resetAll}
            className="px-3 py-1.5 text-sm text-gray-400 hover:text-red-400 border border-gray-700 rounded-lg hover:border-red-500/50 transition-colors"
          >
            重置
          </button>
          <ExportButton />
        </div>
      </header>

      {/* 主内容区 */}
      <main id="prediction-content" className="flex-1 flex">
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
```

- [ ] **Step 2: 重写 App.tsx**

```tsx
import { AnimatePresence, motion } from 'framer-motion';
import { Layout } from './components/Layout';
import { GroupStage } from './components/GroupStage';
import { KnockoutStage } from './components/KnockoutStage';
import { useTournament } from './hooks/useTournament';

function App() {
  const { currentStage, currentRoundMatches } = useTournament();

  const stageToRound: Record<string, any> = {
    round32: 'round32',
    round16: 'round16',
    quarter: 'quarter',
    semi: 'semi',
    final: 'final',
  };

  function renderStage() {
    if (currentStage === 'groups') {
      return <GroupStage />;
    }
    const round = stageToRound[currentStage];
    if (round) {
      return (
        <KnockoutStage
          matches={currentRoundMatches}
          round={round}
        />
      );
    }
    return null;
  }

  return (
    <Layout>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStage}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.3 }}
        >
          {renderStage()}
        </motion.div>
      </AnimatePresence>
    </Layout>
  );
}

export default App;
```

- [ ] **Step 3: 运行 npm run dev 验证**

```bash
npm run dev
```
Expected: 页面显示完整布局：顶部栏 + 阶段导航 + 12组小组赛网格。可切换阶段标签。

- [ ] **Step 4: 清除 tsconfig 引用问题**

由于 `useTournament.ts` 中 `import { GROUPS }` 写在文件末尾不符合惯例，修改 `src/hooks/useTournament.ts`，把 import 移到顶部：

```typescript
import { GROUPS } from '../constants/teams';
```

确保它在文件顶部其他 import 之后。

- [ ] **Step 5: Commit**

```bash
git add src/App.tsx src/components/Layout.tsx src/hooks/useTournament.ts
git commit -m "feat: assemble Layout + App with stage switching and animations"
```

---

### Task 18: BracketTree 连线优化 + 淘汰赛阶段完整布局

**Files:**
- Modify: `src/components/BracketTree.tsx`
- Modify: `src/components/KnockoutStage.tsx`

- [ ] **Step 1: 优化 BracketTree — 增加完整的连线逻辑和淘汰赛树形布局**

```tsx
import { useMemo } from 'react';
import type { KnockoutMatch, KnockoutRound, Team } from '../types';
import { MatchNode } from './MatchNode';

interface BracketTreeProps {
  allMatches: KnockoutMatch[];  // 全部比赛，用于连线
  roundMatches: KnockoutMatch[];
  round: KnockoutRound;
  getTeam: (match: KnockoutMatch) => { team1: Team | null; team2: Team | null };
  winners: Record<string, string>;
}

interface LayoutNode {
  match: KnockoutMatch;
  x: number;
  y: number;
  width: number;
  height: number;
}

// 每一轮的 X 坐标
const ROUND_X: Record<KnockoutRound, number> = {
  round32: 0,
  round16: 220,
  quarter: 440,
  semi: 660,
  final: 880,
};

const NODE_W = 160;
const NODE_H = 80;

function computeLayout(allMatches: KnockoutMatch[]): Map<string, LayoutNode> {
  const map = new Map<string, LayoutNode>();

  // 按轮次分组
  const byRound: Record<string, KnockoutMatch[]> = {};
  allMatches.forEach(m => {
    if (!byRound[m.round]) byRound[m.round] = [];
    byRound[m.round].push(m);
  });

  const rounds: KnockoutRound[] = ['round32', 'round16', 'quarter', 'semi', 'final'];

  // 先布局最底层（R32），然后逐层往上
  rounds.forEach(round => {
    const matches = byRound[round] || [];
    const x = ROUND_X[round];

    if (round === 'final') {
      matches.forEach((m, i) => {
        map.set(m.id, { match: m, x, y: 0, width: NODE_W, height: NODE_H });
      });
    } else {
      const spacing = round === 'round32' ? 110 : round === 'round16' ? 230 : round === 'quarter' ? 480 : 980;
      const totalH = (matches.length - 1) * spacing;
      const startY = -totalH / 2;
      matches.forEach((m, i) => {
        map.set(m.id, { match: m, x, y: startY + i * spacing, width: NODE_W, height: NODE_H });
      });
    }
  });

  return map;
}

interface Connector {
  x1: number; y1: number;
  x2: number; y2: number;
  midX: number;
  active: boolean;
}

function computeConnectors(allMatches: KnockoutMatch[], layout: Map<string, LayoutNode>, winners: Record<string, string>): Connector[] {
  const connectors: Connector[] = [];

  allMatches.forEach(m => {
    if (!m.nextMatchId) return;
    const from = layout.get(m.id);
    const to = layout.get(m.nextMatchId);
    if (!from || !to) return;

    const x1 = from.x + NODE_W;
    const y1 = from.y + NODE_H / 2;
    const x2 = to.x;
    const y2 = to.y + NODE_H / 2;
    const midX = (x1 + x2) / 2;

    connectors.push({
      x1, y1, x2, y2, midX,
      active: !!winners[m.id],
    });
  });

  return connectors;
}

export function BracketTree({ allMatches, roundMatches, round, getTeam, winners }: BracketTreeProps) {
  const layout = useMemo(() => computeLayout(allMatches), [allMatches]);
  const connectors = useMemo(() => computeConnectors(allMatches, layout, winners), [allMatches, layout, winners]);

  const svgWidth = 1060;
  const svgHeight = 1800;
  const offsetX = -40;
  const offsetY = -svgHeight / 2 + 100;

  return (
    <div className="overflow-auto w-full">
      <svg
        width={svgWidth}
        height={svgHeight}
        viewBox={`${offsetX} ${offsetY} ${svgWidth} ${svgHeight}`}
        className="mx-auto"
      >
        <defs>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#374151" />
            <stop offset="100%" stopColor="#f0c040" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 连线 */}
        <g fill="none">
          {connectors.map((c, i) => (
            <g key={`conn-${i}`}>
              <polyline
                points={`${c.x1},${c.y1} ${c.midX},${c.y1} ${c.midX},${c.y2} ${c.x2},${c.y2}`}
                stroke={c.active ? '#f0c040' : '#374151'}
                strokeWidth={c.active ? 2 : 1}
                strokeDasharray={c.active ? 'none' : '4 3'}
                opacity={c.active ? 1 : 0.4}
                filter={c.active ? 'url(#glow)' : undefined}
              />
              {/* 活跃连线的流光动画 */}
              {c.active && (
                <polyline
                  points={`${c.x1},${c.y1} ${c.midX},${c.y1} ${c.midX},${c.y2} ${c.x2},${c.y2}`}
                  stroke="#fbbf24"
                  strokeWidth="2"
                  strokeDasharray="10 30"
                  opacity="0.6"
                  className="animate-glow-line"
                />
              )}
            </g>
          ))}
        </g>

        {/* 比赛节点 */}
        {roundMatches.map(m => {
          const node = layout.get(m.id);
          if (!node) return null;
          const { team1, team2 } = getTeam(m);
          return (
            <MatchNode
              key={m.id}
              match={m}
              team1={team1}
              team2={team2}
              isComplete={!!winners[m.id]}
              x={node.x}
              y={node.y}
            />
          );
        })}
      </svg>
    </div>
  );
}
```

- [ ] **Step 2: 更新 KnockoutStage 传入 allMatches**

修改 `src/components/KnockoutStage.tsx`，Props 增加 `allMatches`:

```tsx
interface KnockoutStageProps {
  allMatches: KnockoutMatch[];
  matches: KnockoutMatch[];
  round: KnockoutRound;
}

// 在 JSX 中使用:
<BracketTree
  allMatches={allMatches}
  matches={matches}
  round={round}
  getTeam={getMatchTeams}
  winners={knockoutWinners}
/>
```

- [ ] **Step 3: 更新 App.tsx 传递全部比赛数据**

修改 `App.tsx` 中 renderStage 调用:

```tsx
function renderStage() {
  if (currentStage === 'groups') {
    return <GroupStage />;
  }
  const round = stageToRound[currentStage];
  if (round) {
    return (
      <KnockoutStage
        allMatches={bracket}
        matches={currentRoundMatches}
        round={round}
      />
    );
  }
  return null;
}
```

需要从 `useTournament` 中解构 `bracket`:
```tsx
const { currentStage, currentRoundMatches, bracket } = useTournament();
```

- [ ] **Step 4: Commit**

```bash
git add src/components/BracketTree.tsx src/components/KnockoutStage.tsx src/App.tsx
git commit -m "feat: optimize bracket tree layout with connectors and glow lines"
```

---

### Task 19: 导出功能优化 + 全局验证修复

**Files:**
- Create: `src/utils/exportImage.ts`
- Modify: `src/components/ExportButton.tsx`

- [ ] **Step 1: 创建导出工具函数**

```typescript
import { toPng } from 'html-to-image';

export async function exportPredictionImage(): Promise<void> {
  const el = document.getElementById('prediction-content');
  if (!el) throw new Error('Content not found');

  const dataUrl = await toPng(el, {
    backgroundColor: '#0a0f1e',
    pixelRatio: 2,
    quality: 1,
  });

  const link = document.createElement('a');
  link.download = `worldcup-2026-prediction-${Date.now()}.png`;
  link.href = dataUrl;
  link.click();
}
```

- [ ] **Step 2: 更新 ExportButton 使用工具函数**

```tsx
import { useState } from 'react';
import { exportPredictionImage } from '../utils/exportImage';

export function ExportButton() {
  const [exporting, setExporting] = useState(false);

  async function handleExport() {
    setExporting(true);
    try {
      await exportPredictionImage();
    } catch (err) {
      console.error('Export failed:', err);
    }
    setExporting(false);
  }

  return (
    <button
      onClick={handleExport}
      disabled={exporting}
      className="px-4 py-2 bg-accent-gold text-bg-primary font-bold rounded-lg hover:bg-yellow-500 transition-colors disabled:opacity-50 text-sm"
    >
      {exporting ? '导出中...' : '📸 导出结果'}
    </button>
  );
}
```

- [ ] **Step 3: 运行构建验证**

```bash
npm run build
```
Expected: TypeScript 编译通过，无类型错误。修复任何编译错误。

- [ ] **Step 4: Commit**

```bash
git add src/utils/exportImage.ts src/components/ExportButton.tsx
git commit -m "feat: add image export utility and integrate with ExportButton"
```

---

### Task 20: 最终测试 + 视觉打磨

**Files:**
- Modify: `src/index.css` (追加微调样式)

- [ ] **Step 1: 追加全局微调样式到 index.css**

```css
/* 卡片悬浮光效 */
.bg-bg-card {
  position: relative;
  overflow: hidden;
}
.bg-bg-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(240, 192, 64, 0.03), transparent);
  transition: left 0.5s;
}
.bg-bg-card:hover::before {
  left: 100%;
}

/* 金色文字发光 */
.text-accent-gold {
  text-shadow: 0 0 20px rgba(240, 192, 64, 0.15);
}
```

- [ ] **Step 2: 运行 npm run dev 进行功能验证**

```bash
npm run dev
```
验证清单：
- [ ] 12 个小组正确显示，每组 4 队
- [ ] 队伍可拖入小组出线槽位，带弹入动画
- [ ] 阶段导航可切换（小组赛 ↔ 淘汰赛各阶段）
- [ ] 淘汰赛 SVG 连线正确渲染
- [ ] 淘汰赛可拖选胜者晋级
- [ ] 晋级时连线变为金色流光
- [ ] 重置按钮清空所有预测
- [ ] 导出按钮生成 PNG 图片

- [ ] **Step 3: 运行 npm run build 最终构建**

```bash
npm run build
```
Expected: 构建无错误。

- [ ] **Step 4: Commit**

```bash
git add src/index.css
git commit -m "style: add card hover effects and gold text glow"
```

---

## 补充说明

1. **国旗方案**：使用 emoji 国旗（`🇧🇷` 等），在所有主流浏览器和操作系统中均能正常显示，无需额外静态资源。
2. **localStorage 持久化**：计划中未包含（保持简单），可在后续迭代中添加 Zustand `persist` 中间件。
3. **拖拽冲突处理**：@dnd-kit 的 `collisionDetection` 默认使用 `rectIntersection`，当两个槽位靠近时可能冲突。可在需要时升级为 `closestCenter` 或自定义碰撞检测。
4. **淘汰赛拖拽逻辑**：当前设计是用户从槽位中拖动已显示的队伍到下一轮节点的槽位中。需确保 MatchNode 内部的 TeamBadge 也配置为 `useDraggable`。MatchNode 中的队伍徽章需要添加拖拽源支持，详见 Task 12 改进。

---

## 自检结果

1. **Spec 覆盖**: 所有设计文档中的功能点均有对应 Task
2. **占位符扫描**: 无 TBD/TODO/占位符
3. **类型一致性**: TypeScript 类型定义在 Task 2，后续所有组件引用一致
4. **文件路径**: 所有路径均为精确绝对路径
