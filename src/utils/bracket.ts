import type { KnockoutMatch, KnockoutRound, MatchDate } from '../types';

function m(round: KnockoutRound, index: number): string {
  return `${round}-${index}`;
}

type R32Slot = { t1: string; t2: string; label: string; date: MatchDate; targetR16: number };

// Official FIFA bracket order — pairs grouped to feed same R16 (no crossing lines)
// Source: worldcupstats.football/bracket + ESPN API
const R32_DATA: R32Slot[] = [
  // ─── Pair 1 → R16-1 ───
  { t1: 'ger', t2: 'par', label: 'M74', date: { date: '6/29', time: '4:30PM', venue: 'Gillette' }, targetR16: 1 },
  { t1: 'fra', t2: 'swe', label: 'M77', date: { date: '6/30', time: '5PM', venue: 'MetLife' }, targetR16: 1 },
  // ─── Pair 2 → R16-2 ───
  { t1: 'rsa', t2: 'can', label: 'M73', date: { date: '6/28', time: '3PM', venue: 'SoFi' }, targetR16: 2 },
  { t1: 'ned', t2: 'mar', label: 'M75', date: { date: '6/29', time: '9PM', venue: 'Estadio BBVA' }, targetR16: 2 },
  // ─── Pair 3 → R16-3 ───
  { t1: 'por', t2: 'cro', label: 'M83', date: { date: '7/2',  time: '7PM', venue: 'BMO Field' }, targetR16: 3 },
  { t1: 'esp', t2: 'aut', label: 'M84', date: { date: '7/2',  time: '3PM', venue: 'SoFi' }, targetR16: 3 },
  // ─── Pair 4 → R16-4 ───
  { t1: 'usa', t2: 'bih', label: 'M81', date: { date: '7/1',  time: '8PM', venue: "Levi's" }, targetR16: 4 },
  { t1: 'bel', t2: 'sen', label: 'M82', date: { date: '7/1',  time: '4PM', venue: 'Lumen Field' }, targetR16: 4 },
  // ─── Pair 5 → R16-5 ───
  { t1: 'bra', t2: 'jpn', label: 'M76', date: { date: '6/29', time: '1PM', venue: 'NRG' }, targetR16: 5 },
  { t1: 'civ', t2: 'nor', label: 'M78', date: { date: '6/30', time: '1PM', venue: 'AT&T' }, targetR16: 5 },
  // ─── Pair 6 → R16-6 ───
  { t1: 'mex', t2: 'ecu', label: 'M79', date: { date: '6/30', time: '9PM', venue: 'Azteca' }, targetR16: 6 },
  { t1: 'eng', t2: 'cod', label: 'M80', date: { date: '7/1',  time: '12PM', venue: 'Mercedes-Benz' }, targetR16: 6 },
  // ─── Pair 7 → R16-7 ───
  { t1: 'arg', t2: 'cpv', label: 'M86', date: { date: '7/3',  time: '6PM', venue: 'Hard Rock' }, targetR16: 7 },
  { t1: 'aus', t2: 'egy', label: 'M88', date: { date: '7/3',  time: '2PM', venue: 'AT&T' }, targetR16: 7 },
  // ─── Pair 8 → R16-8 ───
  { t1: 'sui', t2: 'alg', label: 'M85', date: { date: '7/2',  time: '11PM', venue: 'BC Place' }, targetR16: 8 },
  { t1: 'col', t2: 'gha', label: 'M87', date: { date: '7/3',  time: '9:30PM', venue: 'Arrowhead' }, targetR16: 8 },
];

export function generateBracket(): KnockoutMatch[] {
  const ms: KnockoutMatch[] = [];

  // R32 — adjacent pairs feed same R16
  R32_DATA.forEach((s, i) => {
    ms.push({
      id: m('round32', i + 1), round: 'round32', matchIndex: i + 1,
      team1Id: s.t1, team2Id: s.t2, winnerId: null,
      nextMatchId: m('round16', s.targetR16), nextLoserMatchId: null,
      label: s.label, matchDate: s.date,
      source1: null, source2: null,
    });
  });

  // R16 — adjacent pairs feed same QF
  const r16Dates: MatchDate[] = [
    { date: '7/4', time: '5PM' }, { date: '7/4', time: '1PM' },
    { date: '7/6', time: '3PM' }, { date: '7/6', time: '8PM' },
    { date: '7/5', time: '4PM' }, { date: '7/5', time: '8PM' },
    { date: '7/7', time: '12PM' }, { date: '7/7', time: '4PM' },
  ];
  for (let i = 0; i < 8; i++) {
    ms.push({
      id: m('round16', i + 1), round: 'round16', matchIndex: i + 1,
      team1Id: null, team2Id: null, winnerId: null,
      nextMatchId: m('quarter', Math.floor(i / 2) + 1), nextLoserMatchId: null,
      label: `R16-${i + 1}`, matchDate: r16Dates[i],
      source1: { type: 'match', matchId: m('round32', i * 2 + 1) },
      source2: { type: 'match', matchId: m('round32', i * 2 + 2) },
    });
  }

  // QF — adjacent pairs feed same SF
  const qfDates: MatchDate[] = [
    { date: '7/9', time: '4PM' }, { date: '7/10', time: '3PM' },
    { date: '7/11', time: '5PM' }, { date: '7/11', time: '9PM' },
  ];
  for (let i = 0; i < 4; i++) {
    ms.push({
      id: m('quarter', i + 1), round: 'quarter', matchIndex: i + 1,
      team1Id: null, team2Id: null, winnerId: null,
      nextMatchId: m('semi', Math.floor(i / 2) + 1), nextLoserMatchId: null,
      label: `QF-${i + 1}`, matchDate: qfDates[i],
      source1: { type: 'match', matchId: m('round16', i * 2 + 1) },
      source2: { type: 'match', matchId: m('round16', i * 2 + 2) },
    });
  }

  // SF — both feed Final
  ms.push({
    id: m('semi', 1), round: 'semi', matchIndex: 1,
    team1Id: null, team2Id: null, winnerId: null,
    nextMatchId: m('final', 1), nextLoserMatchId: null,
    label: 'SF-1', matchDate: { date: '7/14', time: '3PM' },
    source1: { type: 'match', matchId: m('quarter', 1) },
    source2: { type: 'match', matchId: m('quarter', 2) },
  });
  ms.push({
    id: m('semi', 2), round: 'semi', matchIndex: 2,
    team1Id: null, team2Id: null, winnerId: null,
    nextMatchId: m('final', 1), nextLoserMatchId: null,
    label: 'SF-2', matchDate: { date: '7/15', time: '3PM' },
    source1: { type: 'match', matchId: m('quarter', 3) },
    source2: { type: 'match', matchId: m('quarter', 4) },
  });

  // Final
  ms.push({
    id: m('final', 1), round: 'final', matchIndex: 1,
    team1Id: null, team2Id: null, winnerId: null,
    nextMatchId: null, nextLoserMatchId: null,
    label: '决赛', matchDate: { date: '7/19', time: '3PM' },
    source1: { type: 'match', matchId: m('semi', 1) },
    source2: { type: 'match', matchId: m('semi', 2) },
  });

  return ms;
}

export function getMatchesByRound(matches: KnockoutMatch[], round: KnockoutRound): KnockoutMatch[] {
  return matches.filter(m => m.round === round);
}

export function getMatchById(matches: KnockoutMatch[], id: string): KnockoutMatch | undefined {
  return matches.find(m => m.id === id);
}

export const ROUND_LABELS: Record<KnockoutRound, string> = {
  round32: '1/16', round16: '1/8', quarter: '1/4',
  semi: '半决赛', final: '决赛',
};
