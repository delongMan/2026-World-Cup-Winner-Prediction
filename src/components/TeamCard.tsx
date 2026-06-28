import { useDraggable } from '@dnd-kit/core';
import { motion } from 'framer-motion';
import type { Team } from '../types';

interface P {
  team: Team; matchId: string; isWinner: boolean; isLoser: boolean;
  isChampion: boolean;
  canInteract: boolean; canDrag: boolean; onClick?: () => void;
  cardW: number; cardH: number; fs: number;
  lang: string;
}

export function TeamCard({ team, matchId, isWinner, isLoser, isChampion, canInteract, canDrag, onClick, cardW, cardH, fs, lang }: P) {
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
      whileHover={clickable ? { scale: 1.04, y: -1 } : {}}
      whileTap={clickable ? { scale: 0.97 } : {}}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      style={{ width: cardW, height: cardH }}
      className={`
        relative overflow-hidden select-none transition-all duration-250 ease-out
        ${isChampion
          ? 'rounded-2xl border-[3px] border-accent-gold/90 shadow-[0_0_40px_rgba(240,192,64,0.6),inset_0_0_20px_rgba(240,192,64,0.1)] z-10'
          : isWinner
            ? 'rounded-2xl ring-2 ring-emerald-400/60 shadow-[0_0_28px_rgba(52,211,153,0.40)] z-10 cursor-pointer'
            : isLoser
              ? 'rounded-2xl ring-1 ring-white/5 opacity-30 saturate-0'
              : canDrag
                ? 'rounded-2xl ring-1 ring-white/10 bg-white/[0.04] hover:ring-accent-gold/30 hover:bg-white/[0.08] cursor-grab active:cursor-grabbing'
                : canInteract
                  ? 'rounded-2xl ring-1 ring-white/10 bg-white/[0.04] hover:ring-accent-gold/30 hover:bg-white/[0.08] cursor-pointer'
                  : 'rounded-2xl ring-1 ring-white/5 bg-white/[0.02]'}
      `}>
      <img src={team.flagUrl} alt="" className="absolute inset-0 w-full h-full object-cover rounded-2xl" />
      <div className={`absolute inset-0 ${isChampion
        ? 'bg-gradient-to-t from-amber-900/90 via-amber-800/30 to-transparent'
        : isWinner
          ? 'bg-gradient-to-t from-emerald-900/80 via-emerald-900/25 to-transparent'
          : isLoser
            ? 'bg-gradient-to-t from-black/70 via-black/30 to-black/20'
            : 'bg-gradient-to-t from-black/65 via-black/25 to-transparent'}`} />
      <div className="absolute inset-x-0 bottom-1.5 px-1">
        <p className="font-bold leading-tight text-center text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]"
          style={{ fontSize: fs <= 9 ? fs : fs - 1 }}>{(team.name as Record<string,string>)[lang] || team.name.en}</p>
      </div>
      {isChampion && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 15 }}
          className="absolute top-0.5 right-0.5 flex items-center justify-center shadow-lg"
          style={{ width: Math.max(14, cardW * 0.22), height: Math.max(14, cardW * 0.22) }}>
          <div className="w-full h-full bg-accent-gold rounded-full flex items-center justify-center shadow-lg shadow-accent-gold/50">
            <span style={{ fontSize: Math.max(8, fs - 2) }}>👑</span>
          </div>
        </motion.div>
      )}
      {isWinner && !isChampion && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 15 }}
          className="absolute top-0.5 right-0.5 flex items-center justify-center"
          style={{ width: Math.max(12, cardW * 0.20), height: Math.max(12, cardW * 0.20) }}>
          <div className="w-full h-full bg-emerald-400 rounded-full flex items-center justify-center shadow-lg">
            <svg width="60%" height="50%" viewBox="0 0 10 8" fill="none"><path d="M1 4l2.5 2.5L9 1" stroke="#0a0f1e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
