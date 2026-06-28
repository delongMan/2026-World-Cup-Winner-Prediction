# 2026 世界杯晋级预测 — 设计文档

## 概述

一个支持拖选操作的世界杯晋级预测 Web 应用。用户从小组赛开始选择出线队伍，在淘汰赛阶段拖动胜者晋级，最终导出预测结果为图片分享。

- **使用场景**: 个人预测 + 截图分享
- **赛制范围**: 小组赛（48队/12组）→ 32强 → 16强 → 8强 → 半决赛 → 决赛
- **核心交互**: 拖动晋级者到下一轮位置（类 CS2 MAJOR 风格）
- **技术栈**: React + TypeScript + Vite + Tailwind CSS + @dnd-kit + Framer Motion + Zustand + html-to-image

---

## 文件目录结构

```
worldcup-predictor/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.ts
├── .gitignore
├── AGENTS.md
├── public/
│   └── flags/                    # 48队国旗 SVG
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── index.css                 # Tailwind + 全局动效
    ├── constants/
    │   └── teams.ts              # 48队数据
    ├── types/
    │   └── index.ts
    ├── store/
    │   └── usePredictionStore.ts # Zustand 全局状态
    ├── hooks/
    │   └── useTournament.ts      # 赛程计算
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

## UI 布局

```
┌─────────────────────────────────────────────────┐
│  🏆 2026 世界杯晋级预测          [导出结果] [重置] │
├─────────────────────────────────────────────────┤
│  小组赛  │ 32强 │ 16强 │ 8强 │ 半决赛 │ 决赛 │  │
├─────────────────────────────────────────────────┤
│  左侧：当前阶段内容区（75%）        │ 队伍池(25%) │
│  - 小组赛: 3×4 网格卡片            │ 待选队伍列表 │
│  - 淘汰赛: SVG 对阵树形图          │ (可拖拽)    │
└─────────────────────────────────────────────────┘
```

---

## 核心交互流程

### 小组赛阶段
1. 12 个小组以 3×4 网格展示，每组 4 队已预设
2. 用户将队伍从小组中**拖入小组出线槽位**（前 2 名 + 6 个最佳第 3 名）
3. 拖入成功 → 国旗弹入动画 + 金色边框脉冲

### 淘汰赛阶段
1. SVG 渲染标准淘汰赛对阵树形图
2. 每个对阵节点自动填入上轮出线队伍
3. 用户**拖动胜者**到下一轮槽位
4. 拖入瞬间 → 连线流光动画 + 目标位置粒子爆发

### 导出
- html-to-image 将整个 bracket 区域截图为 PNG 下载

---

## 动效设计

| 动效 | 实现方式 |
|------|---------|
| 拖入弹入 | Framer Motion `spring` scale 0→1 + 金色光晕 |
| 晋级连线流光 | SVG `stroke-dasharray` + CSS animation 渐变跑过 |
| 槽位呼吸脉冲 | CSS `@keyframes` 微弱 opacity 脉动 |
| 粒子爆发 | Framer Motion 粒子组件，晋级时在目标点生成 |
| 阶段切换 | `AnimatePresence` 横向滑动过渡 |
| 拖拽悬浮阴影 | @dnd-kit `DragOverlay` + Framer Motion `whileDrag` |

---

## 视觉风格

- **暗色主题**: 深蓝/藏青背景 `#0a0f1e`，金色强调 `#f0c040`
- **卡片**: 金属质感边框，微光反射效果
- **字体**: 系统无衬线字体（system-ui）
- **颜色系统**:
  - 背景: `#0a0f1e` (最深) → `#111827` (卡片)
  - 强调: `#f0c040` (金色)
  - 晋级成功: `#22c55e` (绿色闪烁)
  - 空槽位: `#374151` (灰色半透明)

---

## 状态设计 (Zustand)

```typescript
interface PredictionState {
  // 小组赛：groupId -> [出线队伍ID, ...]
  groupAdvancements: Record<string, string[]>;
  // 淘汰赛：matchId -> 胜者队伍ID
  knockoutWinners: Record<string, string>;
  // 当前查看阶段
  currentStage: 'groups' | 'round32' | 'round16' | 'quarter' | 'semi' | 'final';

  // Actions
  setGroupAdvancement: (groupId: string, teamIds: string[]) => void;
  setKnockoutWinner: (matchId: string, teamId: string) => void;
  setStage: (stage: string) => void;
  resetAll: () => void;
}
```

### 赛程生成逻辑 (`useTournament.ts`)
- 小组出线结果 → 按 FIFA 规则计算 32 强对阵表
- 每轮晋级结果 → 自动生成下一轮对阵节点
- 决赛完成后 → 确定冠军

---

## 约束

- 纯前端，无后端
- localStorage 持久化预测数据
- 国旗 SVG 使用 FlagCDN 或内置静态资源
- 响应式最小支持 1280px 宽度（桌面优先）
- 导出图片使用 html-to-image，支持 2x 高清截图

---

## 不包含

- 不允许在同一对阵节点重复放置相同队伍
- 不做实时多人同步
- 不做历史记录/多套预测方案
- 不做移动端适配（桌面优先）
