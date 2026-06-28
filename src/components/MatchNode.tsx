import { memo } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { motion } from 'framer-motion';
import type { KnockoutMatch, Team } from '../types';
import { TeamCard } from './TeamCard';
import { usePredictionStore } from '../store/usePredictionStore';
import type { BpSize } from './breakpoint';

interface P {
  match: KnockoutMatch; team1: Team | null; team2: Team | null;
  isComplete: boolean; onTeamClick: (mid: string, t: Team | null) => void;
  bp: BpSize; highlightId?: string | null;
}

export const MatchPair = memo(function MatchPair({ match, team1, team2, isComplete, onTeamClick, bp, highlightId }: P) {
  const { setNodeRef, isOver } = useDroppable({ id: `match-${match.id}` });
  const isLocked = usePredictionStore(s => s.isLocked);
  const bracket = usePredictionStore(s => s.bracket);

  const { cardW, cardH, matchW, gap, fs } = bp;

  const hasBoth = !!(team1 && team2);
  const hasOne = !!(team1 || team2);
  const isEmpty = !hasOne;
  const canInteract = hasBoth && !isComplete && !isLocked;
  const isR32 = match.round === 'round32';
  const canDrag = canInteract && !isR32;
  const isFinal = match.round === 'final';

  const winnerTeam = match.winnerId ? (team1?.id === match.winnerId ? team1 : team2) : null;
  const eliminatedLater: boolean = !!winnerTeam && (() => {
    let nextId: string | null = match.nextMatchId;
    while (nextId) {
      const nm = bracket.find(m => m.id === nextId);
      if (!nm) break;
      if (nm.winnerId) return nm.winnerId !== winnerTeam.id;
      nextId = nm.nextMatchId;
    }
    return false;
  })();

  const isHighlighted = !isComplete && highlightId === match.id;

  const h1 = () => { if (canInteract && team1) onTeamClick(match.id, team1); };
  const h2 = () => { if (canInteract && team2) onTeamClick(match.id, team2); };
  const hCancel = () => { if (isComplete && !isLocked) onTeamClick(match.id, null); };

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: 'easeOut' }}
      className="flex items-center justify-center"
      style={{ width: matchW + 20, height: cardH + 30, margin: -15 }}>
      <div ref={setNodeRef} className="absolute inset-0 z-0" />
      <motion.div data-match-id={match.id}
        className={`relative z-10 flex-shrink-0 transition-all duration-200 ease-out overflow-hidden
          ${isHighlighted ? 'rounded-2xl ring-2 ring-accent-gold bg-accent-gold/8 scale-105 shadow-xl shadow-accent-gold/10'
            : isComplete ? 'rounded-2xl ring-1 ring-emerald-400/15 bg-emerald-500/[0.03]'
            : hasBoth ? 'rounded-2xl ring-1 ring-white/8 bg-white/[0.02]'
            : 'rounded-2xl ring-1 ring-white/5 bg-white/[0.01]'}
        `}
        style={{ width: matchW, padding: '4px 6px' }}
      >
      <div className="flex items-center justify-center" style={{ gap: 4 }}>
        {isComplete ? (
          <div className="flex-shrink-0">
            {winnerTeam
              ? <TeamCard team={winnerTeam} matchId={match.id} isWinner={!eliminatedLater} isLoser={eliminatedLater} isChampion={isFinal && !eliminatedLater} canInteract={!isLocked} canDrag={false} onClick={hCancel} cardW={cardW} cardH={cardH} fs={fs} />
              : null}
          </div>
        ) : (
          <>
            <div className="flex-shrink-0">
              {team1
                ? <TeamCard team={team1} matchId={match.id} isWinner={false} isLoser={false} isChampion={false} canInteract={canInteract} canDrag={canDrag} onClick={h1} cardW={cardW} cardH={cardH} fs={fs} />
                : <div className="rounded-2xl ring-1 ring-white/5 flex items-center justify-center bg-white/[0.01]" style={{ width: cardW, height: cardH }}><span style={{ fontSize: fs - 1 }} className="text-white/20">{isEmpty ? '待开赛' : '待定'}</span></div>}
            </div>
            <div className="flex-shrink-0">
              {team2
                ? <TeamCard team={team2} matchId={match.id} isWinner={false} isLoser={false} isChampion={false} canInteract={canInteract} canDrag={canDrag} onClick={h2} cardW={cardW} cardH={cardH} fs={fs} />
                : <div className="rounded-2xl ring-1 ring-white/5 flex items-center justify-center bg-white/[0.01]" style={{ width: cardW, height: cardH }}><span style={{ fontSize: fs - 1 }} className="text-white/20">{isEmpty ? '待开赛' : '待定'}</span></div>}
            </div>
          </>
        )}
      </div>
      <div className="flex items-center justify-between mt-1.5 px-0.5" style={{ fontSize: fs - 1 }}>
        <span className="text-white/25 font-medium tracking-wider">{match.label}</span>
        <span className={`font-medium ${isComplete ? 'text-emerald-400' : hasBoth ? 'text-amber-300/60' : 'text-white/20'}`}>
          {isComplete ? '✓' : canDrag ? '● 拖拽' : hasBoth ? '● 点击' : '○'} {match.matchDate?.date} {match.matchDate?.time}
        </span>
      </div>
      {isComplete && (
        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} style={{ originX: 0.5 }} transition={{ duration: 0.4, ease: 'easeOut' }}
          className="h-px mx-3 mt-1 rounded-full bg-gradient-to-r from-transparent via-accent-gold/60 to-transparent" />
      )}
    </motion.div>
    </motion.div>
  );
});
