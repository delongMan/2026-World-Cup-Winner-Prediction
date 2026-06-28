import { usePredictionStore } from '../store/usePredictionStore';
import { ExportButton } from './ExportButton';
import type { ReactNode } from 'react';
import type { Lang } from '../types';

const LANG_OPTS: { key: Lang; label: string }[] = [
  { key: 'en', label: 'EN' },
  { key: 'zh-CN', label: '简体中文' },
  { key: 'zh-TW', label: '繁體中文' },
  { key: 'es', label: 'Español' },
  { key: 'pt', label: 'Português' },
  { key: 'fr', label: 'Français' },
  { key: 'de', label: 'Deutsch' },
  { key: 'nl', label: 'Nederlands' },
  { key: 'it', label: 'Italiano' },
  { key: 'sv', label: 'Svenska' },
  { key: 'no', label: 'Norsk' },
  { key: 'hr', label: 'Hrvatski' },
  { key: 'bs', label: 'Bosanski' },
  { key: 'ja', label: '日本語' },
  { key: 'ko', label: '한국어' },
  { key: 'ar', label: 'العربية' },
];

export function Layout({ children }: { children: ReactNode }) {
  const resetAll = usePredictionStore(s => s.resetAll);
  const isLocked = usePredictionStore(s => s.isLocked);
  const toggleLock = usePredictionStore(s => s.toggleLock);
  const lang = usePredictionStore(s => s.lang);
  const setLang = usePredictionStore(s => s.setLang);

  return (
    <div className="min-h-dvh bg-[#060b14] text-white flex flex-col">
      <header className="flex items-center justify-between px-3 sm:px-6 py-2 sm:py-3 bg-[#060b14] fixed top-0 left-0 w-full z-50 gap-2">
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <span className="text-xl sm:text-2xl">🏆</span>
          <div className="hidden sm:block">
            <h1 className="text-xs sm:text-sm font-bold text-white/90 tracking-wide">FIFA World Cup 2026</h1>
            <p className="text-[10px] text-white/30">Knockout Stage</p>
          </div>
          <span className="sm:hidden text-xs font-bold text-white/80">WC2026</span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          {/* Language switcher */}
          <select
            value={lang}
            onChange={e => setLang(e.target.value as Lang)}
            className="bg-transparent text-[10px] sm:text-[11px] text-white/50 border border-white/10 rounded-lg px-1.5 py-1 outline-none cursor-pointer hover:border-white/20"
          >
            {LANG_OPTS.map(o => (
              <option key={o.key} value={o.key} className="bg-[#111827] text-white">{o.label}</option>
            ))}
          </select>
          <span className="hidden lg:inline text-[10px] text-white/25">点击或拖动晋级</span>
          <button onClick={resetAll}
            className="px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-[11px] font-medium text-white/40 hover:text-red-400 rounded-lg sm:rounded-xl ring-1 ring-white/10 hover:ring-red-400/30 transition-all duration-200">
            重置
          </button>
          <button onClick={toggleLock}
            className={`px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-[11px] font-medium rounded-lg sm:rounded-xl ring-1 transition-all duration-200 ${
              isLocked ? 'text-emerald-400 ring-emerald-400/40 bg-emerald-500/10' : 'text-white/40 ring-white/10 hover:text-amber-400 hover:ring-amber-400/30'
            }`}>
            {isLocked ? '🔒' : '🔓'}
          </button>
          <ExportButton />
        </div>
      </header>
      <main id="prediction-content" className="flex-1 pt-11 sm:pt-14">{children}</main>
    </div>
  );
}
