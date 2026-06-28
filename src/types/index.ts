export type Stage = 'round32' | 'round16' | 'quarter' | 'semi' | 'final';

export type KnockoutRound = 'round32' | 'round16' | 'quarter' | 'semi' | 'final';

export type MatchStatus = 'upcoming' | 'live' | 'completed';

export type Lang = 'en' | 'zh-CN' | 'zh-TW' | 'es' | 'fr' | 'de' | 'ja' | 'ko' | 'ar' | 'pt' | 'nl' | 'it' | 'sv' | 'hr' | 'no' | 'bs';

export interface Team {
  id: string;
  flagEmoji: string;
  flagUrl: string;
  name: Record<Lang, string>;
  group: string;
}

export interface MatchDate {
  date: string;
  time: string;
  venue?: string;
}

export interface KnockoutMatch {
  id: string;
  round: KnockoutRound;
  matchIndex: number;
  team1Id: string | null;
  team2Id: string | null;
  winnerId: string | null;
  nextMatchId: string | null;
  nextLoserMatchId: string | null;
  label: string;
  matchDate: MatchDate | null;
  source1: MatchSource | null;
  source2: MatchSource | null;
}

export interface MatchSource {
  type: 'match' | 'loser';
  matchId?: string;
}

export interface PredictionState {
  knockoutWinners: Record<string, string>;
  currentStage: Stage;

  setKnockoutWinner: (matchId: string, teamId: string) => void;
  removeKnockoutWinner: (matchId: string) => void;
  setStage: (stage: Stage) => void;
  resetAll: () => void;
  getMatchTeams: (match: KnockoutMatch) => { team1: Team | null; team2: Team | null };
  getMatchStatus: (match: KnockoutMatch) => MatchStatus;
}
