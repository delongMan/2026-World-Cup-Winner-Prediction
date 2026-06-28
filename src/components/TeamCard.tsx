import { useDraggable } from '@dnd-kit/core';
import { motion } from 'framer-motion';
import type { Team } from '../types';

interface P {
  team: Team; matchId: string; isWinner: boolean; isLoser: boolean;
  isChampion: boolean;
  canInteract: boolean; canDrag: boolean; onClick?: () => void;
}

export function TeamCard({ team, matchId, isWinner, isLoser, isChampion, canInteract, canDrag, onClick }: P) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: `team-${team.id}-from-${matchId}`,
    data: { team, sourceMatchId: matchId },
    disabled: !canDrag,
  });

  const clickable = canInteract;

  return (
    <motion.div
      ref={setNodeRef}
      {...(canDrag ? { ...listeners, ...attributes } : {})}
      onClick={(e) => { if (clickable && onClick) { e.stopPropagation(); onClick(); } }}
      whileHover={clickable ? { scale: 1.04, y: -2 } : {}}
      whileTap={clickable ? { scale: 0.97 } : {}}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`
        relative w-[88px] h-[72px] overflow-hidden select-none transition-all duration-250 ease-out
        ${isChampion
          ? 'rounded-2xl ring-2 ring-accent-gold/80 shadow-[0_0_28px_rgba(240,192,64,0.45)] scale-[1.05] z-10'
          : isWinner
            ? 'rounded-2xl ring-2 ring-emerald-400/60 shadow-[0_0_24px_rgba(52,211,153,0.35)] scale-[1.03] z-10 cursor-pointer'
            : isLoser
              ? 'rounded-2xl ring-1 ring-white/5 opacity-30 scale-95 saturate-0'
              : canDrag
                ? 'rounded-2xl ring-1 ring-white/10 bg-white/[0.04] hover:ring-accent-gold/30 hover:bg-white/[0.08] cursor-grab active:cursor-grabbing'
                : canInteract
                  ? 'rounded-2xl ring-1 ring-white/10 bg-white/[0.04] hover:ring-accent-gold/30 hover:bg-white/[0.08] cursor-pointer'
                  : 'rounded-2xl ring-1 ring-white/5 bg-white/[0.02]'}
      `}>
      <div className="absolute inset-0 bg-center bg-cover" style={{ backgroundImage: `url(${team.flagUrl})` }} />
      <div className={`absolute inset-0 ${isChampion
        ? 'bg-gradient-to-t from-amber-900/80 via-amber-900/20 to-transparent'
        : isWinner
          ? 'bg-gradient-to-t from-emerald-900/80 via-emerald-900/25 to-transparent'
          : isLoser
            ? 'bg-gradient-to-t from-black/70 via-black/30 to-black/20'
            : 'bg-gradient-to-t from-black/65 via-black/25 to-transparent'}`} />
      <div className="absolute inset-x-0 bottom-2.5 px-1.5">
        <p className={`text-[11px] font-bold leading-tight text-center ${isWinner || isChampion ? 'text-white' : 'text-white/85'} drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]`}>{team.nameZh}</p>
      </div>
      {isChampion && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 15 }}
          className="absolute top-1.5 right-1.5 w-5 h-5 bg-accent-gold rounded-full flex items-center justify-center shadow-lg shadow-accent-gold/50">
          <span className="text-[10px]">👑</span>
        </motion.div>
      )}
      {isWinner && !isChampion && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 15 }}
          className="absolute top-1.5 right-1.5 w-5 h-5 bg-emerald-400 rounded-full flex items-center justify-center shadow-lg">
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l2.5 2.5L9 1" stroke="#0a0f1e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </motion.div>
      )}
    </motion.div>
  );
}
