import { DndContext, DragOverlay, closestCenter, type DragStartEvent, type DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useState, useCallback } from 'react';
import { usePredictionStore } from '../store/usePredictionStore';
import { BracketTree } from './BracketTree';
import type { Team, KnockoutMatch } from '../types';

export function KnockoutStage({ allMatches }: { allMatches: KnockoutMatch[] }) {
  const setKnockoutWinner = usePredictionStore(s => s.setKnockoutWinner);
  const removeKnockoutWinner = usePredictionStore(s => s.removeKnockoutWinner);
  const getMatchTeams = usePredictionStore(s => s.getMatchTeams);
  const knockoutWinners = usePredictionStore(s => s.knockoutWinners);
  const [activeTeam, setActiveTeam] = useState<Team | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 3 } }));

  // Click: select winner (team) or cancel (null)
  const handleTeamClick = useCallback((matchId: string, team: Team | null) => {
    if (team) setKnockoutWinner(matchId, team.id);
    else removeKnockoutWinner(matchId);
  }, [setKnockoutWinner, removeKnockoutWinner]);

  // Drag to advance
  const handleDragStart = useCallback((e: DragStartEvent) => {
    const t = e.active.data.current?.team as Team | undefined;
    if (t) setActiveTeam(t);
  }, []);

  const handleDragEnd = useCallback((e: DragEndEvent) => {
    setActiveTeam(null);
    const { active, over } = e;
    if (!over) return;
    const team = active.data.current?.team as Team | undefined;
    const src = active.data.current?.sourceMatchId as string | undefined;
    if (!team || !src) return;
    const targetId = String(over.id).replace('match-', '');
    const sm = allMatches.find(m => m.id === src);
    if (sm?.nextMatchId === targetId || sm?.nextLoserMatchId === targetId) {
      setKnockoutWinner(src, team.id);
    }
  }, [setKnockoutWinner, allMatches]);

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="p-3">
        <BracketTree allMatches={allMatches} getTeam={getMatchTeams} winners={knockoutWinners} onTeamClick={handleTeamClick} />
      </div>
      <DragOverlay dropAnimation={null}>
        {activeTeam ? (
          <div className="w-[88px] h-[72px] rounded-2xl overflow-hidden ring-2 ring-accent-gold/60 shadow-xl opacity-90" style={{ backgroundImage: `url(${activeTeam.flagUrl})`, backgroundSize: 'cover' }}>
            <div className="w-full h-full bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end justify-center pb-2.5">
              <p className="text-[11px] font-bold text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">{activeTeam.nameZh}</p>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
