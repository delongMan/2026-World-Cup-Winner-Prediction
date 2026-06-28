import { usePredictionStore } from '../store/usePredictionStore';
import { ExportButton } from './ExportButton';
import type { ReactNode } from 'react';

export function Layout({ children }: { children: ReactNode }) {
  const resetAll = usePredictionStore(s => s.resetAll);
  const isLocked = usePredictionStore(s => s.isLocked);
  const toggleLock = usePredictionStore(s => s.toggleLock);

  return (
    <div className="min-h-screen bg-[#060b14] text-white flex flex-col">
      <header className="flex items-center justify-between px-6 py-3 border-b border-white/5 bg-[#060b14]/90 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🏆</span>
          <div>
            <h1 className="text-sm font-bold text-white/90 tracking-wide">2026 FIFA World Cup</h1>
            <p className="text-[10px] text-white/30">Knockout Stage · 淘汰赛预测</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-white/25 hidden sm:inline">点击或拖动队伍卡片晋级</span>
          <button onClick={resetAll}
            className="px-3 py-1.5 text-[11px] font-medium text-white/40 hover:text-red-400 rounded-xl ring-1 ring-white/10 hover:ring-red-400/30 transition-all duration-200">
            重置
          </button>
          <button onClick={toggleLock}
            className={`px-3 py-1.5 text-[11px] font-medium rounded-xl ring-1 transition-all duration-200 ${
              isLocked ? 'text-emerald-400 ring-emerald-400/40 bg-emerald-500/10' : 'text-white/40 ring-white/10 hover:text-amber-400 hover:ring-amber-400/30'
            }`}>
            {isLocked ? '🔒 已锁定' : '🔓 锁定'}
          </button>
          <ExportButton />
        </div>
      </header>
      <main id="prediction-content" className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
