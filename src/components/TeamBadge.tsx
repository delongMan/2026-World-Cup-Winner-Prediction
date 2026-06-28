import { forwardRef } from 'react';
import type { Team } from '../types';

interface TeamBadgeProps {
  team: Team;
  size?: 'sm' | 'md' | 'lg';
  isWinner?: boolean;
  style?: React.CSSProperties;
  listeners?: Record<string, unknown>;
  attributes?: Record<string, unknown>;
}

const sizeMap = {
  sm: { pad: 'px-1.5 py-1', text: 'text-[11px]', flag: 'w-5 h-3.5' },
  md: { pad: 'px-2.5 py-1.5', text: 'text-sm', flag: 'w-7 h-5' },
  lg: { pad: 'px-3 py-2', text: 'text-base', flag: 'w-9 h-6' },
};

export const TeamBadge = forwardRef<HTMLDivElement, TeamBadgeProps>(
  ({ team, size = 'md', isWinner = false, style, listeners, attributes }, ref) => {
    const s = sizeMap[size];

    return (
      <div
        ref={ref}
        className={`
          inline-flex items-center rounded-lg font-semibold select-none gap-1.5
          ${s.pad} ${s.text}
          ${isWinner
            ? 'bg-accent-gold/20 border border-accent-gold/60 text-accent-gold'
            : 'bg-bg-card border border-gray-700/60 text-gray-200'}
          transition-all duration-200
        `}
        style={style}
        {...listeners}
        {...attributes}
      >
        <img
          src={team.flagUrl}
          alt={team.name}
          className={`${s.flag} rounded-sm object-cover shadow-sm flex-shrink-0`}
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
            (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
          }}
        />
        <span className="hidden">{team.flagEmoji}</span>
        <span className="truncate max-w-[90px] leading-tight">{team.nameZh}</span>
        {isWinner && <span className="text-[10px] ml-0.5">👑</span>}
      </div>
    );
  }
);

TeamBadge.displayName = 'TeamBadge';
