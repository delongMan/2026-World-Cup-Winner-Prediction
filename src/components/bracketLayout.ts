import type { KnockoutMatch, KnockoutRound } from '../types';
import type { BpSize } from './breakpoint';

export const ROUND_ORDER: KnockoutRound[] = ['round32', 'round16', 'quarter', 'semi', 'final'];

export interface LayoutNode { match: KnockoutMatch; x: number; y: number; w: number; h: number; }
export interface Connector { x1: number; y1: number; x2: number; y2: number; active: boolean; }

const rx = (bp: BpSize, r: KnockoutRound): number => {
  const i = ROUND_ORDER.indexOf(r);
  return (bp.roundX[i] ?? bp.roundX[bp.roundX.length - 1]) + bp.gap / 2;
};

export function computeLayout(allMatches: KnockoutMatch[], bp: BpSize): Map<string, LayoutNode> {
  const { cardW, cardH, gap } = bp;
  const map = new Map<string, LayoutNode>();
  const byRound = new Map<KnockoutRound, KnockoutMatch[]>();

  for (const m of allMatches) {
    const a = byRound.get(m.round) || [];
    a.push(m);
    byRound.set(m.round, a);
  }
  for (const a of byRound.values()) a.sort((x, y) => x.matchIndex - y.matchIndex);

  // R32 — vertical spacing between rows
  const rowH = cardH + 42;
  (byRound.get('round32') || []).forEach((m, i) =>
    map.set(m.id, { match: m, x: rx(bp, 'round32'), y: i * rowH, w: bp.matchW, h: cardH })
  );

  // R16 → QF → SF
  for (const round of ['round16', 'quarter', 'semi'] as KnockoutRound[]) {
    for (const m of (byRound.get(round) || [])) {
      const n1 = m.source1?.matchId ? map.get(m.source1.matchId) : null;
      const n2 = m.source2?.matchId ? map.get(m.source2.matchId) : null;
      let y = 0;
      if (n1 && n2) y = ((n1.y + cardH / 2) + (n2.y + cardH / 2)) / 2 - cardH / 2;
      else if (n1) y = n1.y;
      map.set(m.id, { match: m, x: rx(bp, round), y: Math.round(y), w: bp.matchW, h: cardH });
    }
  }

  // Final
  const sf1 = map.get('semi-1'), sf2 = map.get('semi-2');
  const mid = sf1 && sf2 ? (sf1.y + sf2.y) / 2 + cardH / 2 : 0;
  const fin = (byRound.get('final') || [])[0];
  if (fin) map.set(fin.id, { match: fin, x: rx(bp, 'final'), y: mid - cardH / 2, w: bp.matchW + 16, h: cardH + 12 });

  return map;
}

export function computeConnectors(all: KnockoutMatch[], layout: Map<string, LayoutNode>, winners: Record<string, string>): Connector[] {
  const res: Connector[] = [];
  const borderOffset = (r: KnockoutRound): number => {
    if (r === 'semi') return 3;   // ring-[3px]
    if (r === 'final') return 4;  // border-[4px]
    return 0;
  };
  for (const m of all) {
    for (const tid of [m.nextMatchId, m.nextLoserMatchId]) {
      if (!tid) continue;
      const from = layout.get(m.id), to = layout.get(tid);
      if (!from || !to) continue;
      const srcR = from.match.round;
      const tgtR = to.match.round;
      res.push({
        x1: from.x + from.w + borderOffset(srcR),
        y1: from.y + from.h / 2,
        x2: to.x - borderOffset(tgtR),
        y2: to.y + to.h / 2,
        active: !!winners[m.id],
      });
    }
  }
  return res;
}

export function computeBounds(layout: Map<string, LayoutNode>) {
  const ns = Array.from(layout.values());
  const minY = Math.min(...ns.map(n => n.y));
  const maxY = Math.max(...ns.map(n => n.y + n.h));
  const maxX = Math.max(...ns.map(n => n.x + n.w));
  return { minY, maxY, maxX, totalW: maxX + 80, totalH: maxY - minY + 88 };
}
