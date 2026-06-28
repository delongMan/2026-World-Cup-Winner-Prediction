import { useMemo } from 'react';
import type { KnockoutMatch, Team } from '../types';
import { MatchPair } from './MatchNode';
import { computeLayout, computeConnectors, computeBounds, ROUND_ORDER } from './bracketLayout';
import { useBreakpoint } from './breakpoint';
import { ROUND_LABELS } from '../utils/bracket';

interface P {
  allMatches: KnockoutMatch[];
  getTeam: (m: KnockoutMatch) => { team1: Team | null; team2: Team | null };
  winners: Record<string, string>;
  onTeamClick: (mid: string, t: Team | null) => void;
  highlightId?: string | null;
}

export function BracketTree({ allMatches, getTeam, winners, onTeamClick, highlightId }: P) {
  const bp = useBreakpoint();
  const layout = useMemo(() => computeLayout(allMatches, bp), [allMatches, bp]);
  const conns = useMemo(() => computeConnectors(allMatches, layout, winners), [allMatches, layout, winners]);
  const bounds = useMemo(() => computeBounds(layout), [layout]);
  const teamsCache = useMemo(() => {
    const cache = new Map<string, { team1: Team | null; team2: Team | null }>();
    allMatches.forEach(m => cache.set(m.id, getTeam(m)));
    return cache;
  }, [allMatches, getTeam]);

  return (
    <div className="bg-[#060b14]">
      {/* Round headers */}
      <div className="flex bg-[#060b14] min-w-max mx-auto" style={{ width: bounds.totalW }}>
        {ROUND_ORDER.map((r, idx) => (
          <div key={r} className="text-center py-2 shrink-0 border-r border-white/5"
            style={{ width: idx < ROUND_ORDER.length - 1 ? bp.matchW + bp.gap : bp.matchW + 80 }}>
            <span className="font-semibold text-white/40 tracking-widest uppercase" style={{ fontSize: bp.fs }}>{ROUND_LABELS[r]}</span>
          </div>
        ))}
      </div>

      {/* Bracket body */}
      <div id="bracket-body" className="pt-4 px-8 pb-8" style={{ width: bounds.totalW + 64, height: bounds.totalH + 64 }}>
        <div className="relative" style={{ width: bounds.totalW, height: bounds.totalH }}>
        <svg className="absolute inset-0 pointer-events-none z-0" width={bounds.totalW} height={bounds.totalH}>
          <defs>
            <linearGradient id="lg" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="rgba(255,255,255,0.08)" /><stop offset="100%" stopColor="#34d399" /></linearGradient>
            <filter id="gl"><feGaussianBlur stdDeviation="2" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          </defs>
          <g fill="none">
            {conns.map((c, i) => {
              const mx = (c.x1 + c.x2) / 2;
              const oy = -bounds.minY + 16;
              return (
                <g key={`l${i}`}>
                  <polyline
                    points={`${c.x1},${c.y1 + oy} ${mx},${c.y1 + oy} ${mx},${c.y2 + oy} ${c.x2},${c.y2 + oy}`}
                    stroke={c.active ? '#34d399' : 'rgba(255,255,255,0.06)'}
                    strokeWidth={c.active ? 2 : 1} strokeLinecap="round" strokeLinejoin="round"
                    opacity={c.active ? 0.9 : 0.5} filter={c.active ? 'url(#gl)' : undefined}
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

        {allMatches.map((m, i) => {
          const node = layout.get(m.id);
          if (!node) return null;
          const teams = teamsCache.get(m.id)!;
          return (
            <div key={m.id} className="absolute z-10 animate-fade-up" data-match-id={m.id}
              style={{ left: node.x, top: node.y - bounds.minY + 16, width: node.w, height: node.h, animationDelay: `${i * 12}ms` }}>
              <MatchPair match={m} team1={teams.team1} team2={teams.team2} isComplete={!!winners[m.id]} onTeamClick={onTeamClick} bp={bp} highlightId={highlightId} />
            </div>
          );
        })}
        </div>
      </div>
    </div>
  );
}
