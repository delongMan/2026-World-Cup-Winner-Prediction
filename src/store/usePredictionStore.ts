import { create } from 'zustand';
import type { PredictionState, Team, Stage, KnockoutMatch, MatchStatus } from '../types';
import { getTeamById } from '../constants/teams';
import { generateBracket, getMatchById } from '../utils/bracket';

interface StoreState extends PredictionState {
  bracket: KnockoutMatch[];
  isLocked: boolean;
  toggleLock: () => void;
}

function cascadeClear(winners: Record<string, string>, bracket: KnockoutMatch[], fromId: string | null): void {
  if (!fromId) return;
  delete winners[fromId];
  const m = getMatchById(bracket, fromId);
  if (m) {
    if (m.nextMatchId) cascadeClear(winners, bracket, m.nextMatchId);
    if (m.nextLoserMatchId) cascadeClear(winners, bracket, m.nextLoserMatchId);
  }
}

function findTeam(
  src: { type: 'match' | 'loser'; matchId?: string } | null,
  winners: Record<string, string>,
  bracket: KnockoutMatch[]
): Team | null {
  if (!src || !src.matchId) return null;
  const m = getMatchById(bracket, src.matchId);
  if (!m) return null;
  if (src.type === 'loser') {
    if (!m.winnerId || !m.team1Id || !m.team2Id) return null;
    return getTeamById(m.winnerId === m.team1Id ? m.team2Id : m.team1Id) || null;
  }
  const wid = winners[src.matchId];
  if (wid) return getTeamById(wid) || null;
  return null;
}

function regenerate(base: KnockoutMatch[], winners: Record<string, string>): KnockoutMatch[] {
  return base.map(match => {
    const team1 = findTeam(match.source1, winners, base);
    const team2 = findTeam(match.source2, winners, base);
    const isR32 = match.round === 'round32';
    return {
      ...match,
      team1Id: team1 ? team1.id : (isR32 ? match.team1Id : null),
      team2Id: team2 ? team2.id : (isR32 ? match.team2Id : null),
      winnerId: winners[match.id] || null,
    };
  });
}

const baseBracket = generateBracket();

export const usePredictionStore = create<StoreState>((set, get) => ({
  knockoutWinners: {},
  currentStage: 'round32',
  bracket: baseBracket,
  isLocked: false,

  toggleLock: () => set(state => ({ isLocked: !state.isLocked })),

  setKnockoutWinner: (matchId: string, teamId: string) =>
    set(state => {
      const w = { ...state.knockoutWinners, [matchId]: teamId };
      const m = getMatchById(state.bracket, matchId);
      if (m) {
        if (m.nextMatchId) cascadeClear(w, state.bracket, m.nextMatchId);
        if (m.nextLoserMatchId) cascadeClear(w, state.bracket, m.nextLoserMatchId);
      }
      return { knockoutWinners: w, bracket: regenerate(state.bracket, w) };
    }),

  removeKnockoutWinner: (matchId: string) =>
    set(state => {
      const w = { ...state.knockoutWinners };
      delete w[matchId];
      const m = getMatchById(state.bracket, matchId);
      if (m) {
        if (m.nextMatchId) cascadeClear(w, state.bracket, m.nextMatchId);
        if (m.nextLoserMatchId) cascadeClear(w, state.bracket, m.nextLoserMatchId);
      }
      return { knockoutWinners: w, bracket: regenerate(state.bracket, w) };
    }),

  setStage: (stage: Stage) => set({ currentStage: stage }),

  resetAll: () => set({
    knockoutWinners: {},
    currentStage: 'round32',
    bracket: generateBracket(),
  }),

  getMatchTeams: (match: KnockoutMatch) => ({
    team1: match.team1Id ? getTeamById(match.team1Id) || null : null,
    team2: match.team2Id ? getTeamById(match.team2Id) || null : null,
  }),

  getMatchStatus: (match: KnockoutMatch): MatchStatus => {
    if (match.winnerId) return 'completed';
    return 'upcoming';
  },
}));
