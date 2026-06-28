import { DndContext, DragOverlay, closestCenter, type DragStartEvent, type DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useState, useCallback } from 'react';
import { usePredictionStore } from '../store/usePredictionStore';
import { BracketTree } from './BracketTree';
import { useBreakpoint } from './breakpoint';
import type { Team, KnockoutMatch } from '../types';

export function KnockoutStage({ allMatches }: { allMatches: KnockoutMatch[] }) {
  const setKnockoutWinner = usePredictionStore(s => s.setKnockoutWinner);
  const removeKnockoutWinner = usePredictionStore(s => s.removeKnockoutWinner);
  const getMatchTeams = usePredictionStore(s => s.getMatchTeams);
  const knockoutWinners = usePredictionStore(s => s.knockoutWinners);
  const [activeTeam, setActiveTeam] = useState<Team | null>(null);
  const bp = useBreakpoint();

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
          <div className="rounded-2xl overflow-hidden ring-2 ring-accent-gold/60 shadow-2xl relative opacity-90"
            style={{ width: bp.cardW, height: bp.cardH }}>
            <img src={activeTeam.flagUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-2 flex justify-center">
              <p className="font-bold text-white drop-shadow-lg" style={{ fontSize: bp.fs - 1 }}>{activeTeam.nameZh}</p>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
