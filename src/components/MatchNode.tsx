import { useDroppable } from '@dnd-kit/core';
import { motion } from 'framer-motion';
import type { KnockoutMatch, Team } from '../types';
import { TeamCard } from './TeamCard';

interface P { match: KnockoutMatch; team1: Team | null; team2: Team | null; isComplete: boolean; onTeamClick: (mid: string, t: Team | null) => void; }

export function MatchPair({ match, team1, team2, isComplete, onTeamClick }: P) {
  const { setNodeRef, isOver } = useDroppable({ id: `match-${match.id}` });

  const hasBoth = !!(team1 && team2);
  const hasOne = !!(team1 || team2);
  const isEmpty = !hasOne;
  const canInteract = hasBoth && !isComplete;

  const h1 = () => { if (canInteract && team1) onTeamClick(match.id, team1); };
  const h2 = () => { if (canInteract && team2) onTeamClick(match.id, team2); };
  const hCancel = () => { if (isComplete) onTeamClick(match.id, null); };

  return (
    <motion.div ref={setNodeRef} data-match-id={match.id}
      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: 'easeOut' }}
      className={`
        w-[192px] p-2.5 transition-all duration-300 ease-out
        ${isOver && canInteract ? 'rounded-2xl ring-2 ring-accent-gold bg-accent-gold/8 scale-[1.04] z-50 shadow-xl shadow-accent-gold/10'
          : isComplete ? 'rounded-2xl ring-1 ring-emerald-400/15 bg-emerald-500/[0.03]'
          : hasBoth ? 'rounded-2xl ring-1 ring-white/8 bg-white/[0.02]'
          : 'rounded-2xl ring-1 ring-white/5 bg-white/[0.01]'}
      `}>
      <div className="flex items-center justify-center gap-2">
        {isComplete ? (
          <div className="flex-shrink-0">
            {match.winnerId && team1 && match.winnerId === team1.id
              ? <TeamCard team={team1} matchId={match.id} isWinner={true} isLoser={false} canInteract={true} onClick={hCancel} />
              : team2
                ? <TeamCard team={team2} matchId={match.id} isWinner={true} isLoser={false} canInteract={true} onClick={hCancel} />
                : null}
          </div>
        ) : (
          <>
            <div className="flex-shrink-0">
              {team1
                ? <TeamCard team={team1} matchId={match.id} isWinner={false} isLoser={false} canInteract={canInteract} onClick={h1} />
                : <div className="w-[88px] h-[72px] rounded-2xl ring-1 ring-white/5 flex items-center justify-center bg-white/[0.01]"><span className="text-[10px] text-white/20">{isEmpty ? '待开赛' : '待定'}</span></div>}
            </div>
            <div className="flex-shrink-0">
              {team2
                ? <TeamCard team={team2} matchId={match.id} isWinner={false} isLoser={false} canInteract={canInteract} onClick={h2} />
                : <div className="w-[88px] h-[72px] rounded-2xl ring-1 ring-white/5 flex items-center justify-center bg-white/[0.01]"><span className="text-[10px] text-white/20">{isEmpty ? '待开赛' : '待定'}</span></div>}
            </div>
          </>
        )}
      </div>
      <div className="flex items-center justify-between mt-2.5 px-1">
        <span className="text-[10px] text-white/25 font-medium tracking-wider">{match.label}</span>
        <span className={`text-[10px] font-medium ${isComplete ? 'text-emerald-400' : hasBoth ? 'text-amber-300/60' : 'text-white/20'}`}>
          {isComplete ? '✓' : hasBoth ? '● 点击/拖拽' : '○'} {match.matchDate?.date} {match.matchDate?.time}
        </span>
      </div>
      {isComplete && (
        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} style={{ originX: 0.5 }} transition={{ duration: 0.4, ease: 'easeOut' }}
          className="h-px mx-4 mt-1.5 rounded-full bg-gradient-to-r from-transparent via-accent-gold/60 to-transparent" />
      )}
    </motion.div>
  );
}
