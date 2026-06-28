import { useMemo } from 'react';
import type { KnockoutMatch, Team } from '../types';
import { MatchPair } from './MatchNode';
import { computeLayout, computeConnectors, computeBounds, CARD_W, CARD_H, ROUND_ORDER } from './bracketLayout';
import { ROUND_LABELS } from '../utils/bracket';

interface P { allMatches: KnockoutMatch[]; getTeam: (m: KnockoutMatch) => { team1: Team | null; team2: Team | null }; winners: Record<string, string>; onTeamClick: (mid: string, t: Team | null) => void; }

export function BracketTree({ allMatches, getTeam, winners, onTeamClick }: P) {
  const layout = useMemo(() => computeLayout(allMatches), [allMatches]);
  const conns = useMemo(() => computeConnectors(allMatches, layout, winners), [allMatches, layout, winners]);
  const bounds = useMemo(() => computeBounds(layout), [layout]);

  return (
    <div className="overflow-auto">
      {/* Round headers */}
      <div className="sticky top-0 z-30 flex bg-[#060b14]/95 backdrop-blur-md border-b border-white/5">
        {ROUND_ORDER.map((r, idx) => {
          const nextX = idx < ROUND_ORDER.length - 1 ? layout.get(`${ROUND_ORDER[idx + 1]}-1`)?.x ?? (idx + 1) * 250 : bounds.maxX + 40;
          const thisX = idx > 0 ? layout.get(`${r}-1`)?.x ?? idx * 250 : 0;
          const w = nextX - thisX;
          return (
            <div key={r} className="text-center py-2.5 shrink-0 border-r border-white/5" style={{ width: w }}>
              <span className="text-[11px] font-semibold text-white/40 tracking-widest uppercase">{ROUND_LABELS[r]}</span>
            </div>
          );
        })}
      </div>

      {/* Bracket body */}
      <div className="relative" style={{ width: bounds.totalW, height: bounds.totalH }}>
        {/* SVG lines */}
        <svg className="absolute inset-0 pointer-events-none z-0" width={bounds.totalW} height={bounds.totalH}>
          <defs>
            <linearGradient id="lg" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="rgba(255,255,255,0.08)" /><stop offset="100%" stopColor="#34d399" /></linearGradient>
            <filter id="gl"><feGaussianBlur stdDeviation="2.5" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          </defs>
          <g fill="none">
            {conns.map((c, i) => {
              const mx = (c.x1 + c.x2) / 2;
              const oy = -bounds.minY + 24;
              return (
                <g key={`l${i}`}>
                  <polyline
                    points={`${c.x1},${c.y1 + oy} ${mx},${c.y1 + oy} ${mx},${c.y2 + oy} ${c.x2},${c.y2 + oy}`}
                    stroke={c.active ? '#34d399' : 'rgba(255,255,255,0.06)'}
                    strokeWidth={c.active ? 2 : 1} strokeLinecap="round" strokeLinejoin="round"
                    opacity={c.active ? 0.9 : 0.5}
                    filter={c.active ? 'url(#gl)' : undefined}
                  />
                  {c.active && (
                    <polyline
                      points={`${c.x1},${c.y1 + oy} ${mx},${c.y1 + oy} ${mx},${c.y2 + oy} ${c.x2},${c.y2 + oy}`}
                      stroke="url(#lg)" strokeWidth="1.5" strokeDasharray="6 18" opacity="0.7"
                      className="animate-glow-line" strokeLinecap="round"
                    />
                  )}
                </g>
              );
            })}
          </g>
        </svg>

        {/* Match cards */}
        {allMatches.map((m, i) => {
          const node = layout.get(m.id);
          if (!node) return null;
          const { team1, team2 } = getTeam(m);
          return (
            <div key={m.id} className="absolute z-10 animate-fade-up" data-match-id={m.id}
              style={{ left: node.x, top: node.y - bounds.minY + 24, width: node.w, height: node.h, animationDelay: `${i * 15}ms` }}>
              <MatchPair match={m} team1={team1} team2={team2} isComplete={!!winners[m.id]} onTeamClick={onTeamClick} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
