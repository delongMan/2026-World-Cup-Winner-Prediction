import { DndContext, DragOverlay, closestCenter, type DragStartEvent, type DragEndEvent, type DragCancelEvent, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
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
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const lang = usePredictionStore(s => s.lang);
  const bp = useBreakpoint();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 3 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
  );

  // Click: select winner (team) or cancel (null)
  const handleTeamClick = useCallback((matchId: string, team: Team | null) => {
    if (team) setKnockoutWinner(matchId, team.id);
    else removeKnockoutWinner(matchId);
  }, [setKnockoutWinner, removeKnockoutWinner]);

  const handleDragStart = useCallback((e: DragStartEvent) => {
    const t = e.active.data.current?.team as Team | undefined;
    if (t) setActiveTeam(t);
    // Find and highlight the valid target match
    const src = e.active.data.current?.sourceMatchId as string | undefined;
    if (src) {
      const sm = allMatches.find(m => m.id === src);
      if (sm?.nextMatchId) setHighlightId(sm.nextMatchId);
      else if (sm?.nextLoserMatchId) setHighlightId(sm.nextLoserMatchId);
    }
  }, [allMatches]);

  const handleDragEnd = useCallback((e: DragEndEvent) => {
    const team = e.active.data.current?.team as Team | undefined;
    const src = e.active.data.current?.sourceMatchId as string | undefined;
    if (team && src && highlightId) {
      setKnockoutWinner(src, team.id);
    }
    setActiveTeam(null);
    setHighlightId(null);
  }, [setKnockoutWinner, highlightId]);

  const handleDragCancel = useCallback(() => {
    setActiveTeam(null);
    setHighlightId(null);
  }, []);

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDragCancel={handleDragCancel}>
      <div className="p-3">
        <BracketTree allMatches={allMatches} getTeam={getMatchTeams} winners={knockoutWinners} onTeamClick={handleTeamClick} highlightId={highlightId} />
      </div>
      <DragOverlay dropAnimation={null}>
        {activeTeam ? (
          <div className="rounded-2xl overflow-hidden ring-2 ring-accent-gold/60 shadow-2xl relative opacity-90"
            style={{ width: bp.cardW, height: bp.cardH }}>
            <img src={activeTeam.flagUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-2 flex justify-center">
              <p className="font-bold text-white drop-shadow-lg" style={{ fontSize: bp.fs - 1 }}>{(activeTeam.name as Record<string,string>)[lang] || activeTeam.name.en}</p>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
