import type { KnockoutMatch, KnockoutRound } from '../types';

export const CARD_W = 208;
export const CARD_H = 112;
export const GAP = 14;

export const ROUND_X: Record<KnockoutRound, number> = {
  round32: 0, round16: 250, quarter: 500, semi: 750, final: 1000,
};

export const ROUND_ORDER: KnockoutRound[] = ['round32', 'round16', 'quarter', 'semi', 'final'];

export interface LayoutNode { match: KnockoutMatch; x: number; y: number; w: number; h: number; }
export interface Connector { x1: number; y1: number; x2: number; y2: number; active: boolean; }

export function computeLayout(allMatches: KnockoutMatch[]): Map<string, LayoutNode> {
  const map = new Map<string, LayoutNode>();
  const byRound = new Map<KnockoutRound, KnockoutMatch[]>();
  for (const m of allMatches) {
    const a = byRound.get(m.round) || []; a.push(m); byRound.set(m.round, a);
  }
  Object.values(byRound).forEach(a => a.sort((x: KnockoutMatch, y: KnockoutMatch) => x.matchIndex - y.matchIndex));

  // R32
  const ROW_H = CARD_H + GAP;
  const r32 = byRound.get('round32') || [];
  r32.forEach((m, i) => map.set(m.id, { match: m, x: ROUND_X['round32'], y: i * ROW_H, w: CARD_W, h: CARD_H }));

  // Subsequent rounds centered between source matches
  for (const round of ['round16', 'quarter', 'semi'] as KnockoutRound[]) {
    for (const m of (byRound.get(round) || [])) {
      const n1 = m.source1?.matchId ? map.get(m.source1.matchId) : null;
      const n2 = m.source2?.matchId ? map.get(m.source2.matchId) : null;
      let y = 0;
      if (n1 && n2) y = ((n1.y + CARD_H / 2) + (n2.y + CARD_H / 2)) / 2 - CARD_H / 2;
      else if (n1) y = n1.y;
      map.set(m.id, { match: m, x: ROUND_X[round], y: Math.round(y), w: CARD_W, h: CARD_H });
    }
  }

  // Final centered between SFs
  const sf1 = map.get('semi-1'); const sf2 = map.get('semi-2');
  const sfMid = sf1 && sf2 ? (sf1.y + sf2.y) / 2 + CARD_H / 2 : 0;
  const fin = (byRound.get('final') || [])[0];
  if (fin) map.set(fin.id, { match: fin, x: ROUND_X['final'], y: sfMid - CARD_H / 2, w: CARD_W + 20, h: CARD_H + 16 });

  return map;
}

export function computeConnectors(all: KnockoutMatch[], layout: Map<string, LayoutNode>, winners: Record<string, string>): Connector[] {
  const res: Connector[] = [];
  for (const m of all) {
    for (const tid of [m.nextMatchId, m.nextLoserMatchId]) {
      if (!tid) continue;
      const from = layout.get(m.id); const to = layout.get(tid);
      if (!from || !to) continue;
      res.push({ x1: from.x + CARD_W, y1: from.y + CARD_H / 2, x2: to.x, y2: to.y + CARD_H / 2, active: !!winners[m.id] });
    }
  }
  return res;
}

export function computeBounds(layout: Map<string, LayoutNode>) {
  const ns = Array.from(layout.values());
  const minY = Math.min(...ns.map(n => n.y));
  const maxY = Math.max(...ns.map(n => n.y + n.h));
  const maxX = Math.max(...ns.map(n => n.x + n.w));
  return { minY, maxY, maxX, totalW: maxX + 100, totalH: maxY - minY + 80 };
}
