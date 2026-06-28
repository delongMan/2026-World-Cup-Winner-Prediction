import { useEffect, useRef, useState } from 'react';

export type BpSize = {
  name: string;
  cardW: number; cardH: number;
  matchW: number;
  gap: number;
  roundX: number[];
  fs: number;
};

export const BP: Record<string, BpSize> = {
  sm:  { name:'sm',  cardW:56, cardH:48, matchW:136, gap:20, roundX:[0,156,312,468,624],  fs:8  },
  md:  { name:'md',  cardW:68, cardH:56, matchW:160, gap:28, roundX:[0,188,376,564,752],  fs:9  },
  lg:  { name:'lg',  cardW:80, cardH:66, matchW:184, gap:34, roundX:[0,218,436,654,872],  fs:11 },
  xl:  { name:'xl',  cardW:92, cardH:76, matchW:208, gap:40, roundX:[0,248,496,744,992],  fs:12 },
};

const MQ = { sm: 480, md: 768, lg: 1200 };

function detectBp(): BpSize {
  if (typeof window === 'undefined') return BP.md;
  const w = window.innerWidth;
  if (w < MQ.sm) return BP.sm;
  if (w < MQ.md) return BP.md;
  if (w < MQ.lg) return BP.lg;
  return BP.xl;
}

export function useBreakpoint(): BpSize {
  const [bp, setBp] = useState<BpSize>(detectBp);
  const bpRef = useRef(bp);
  bpRef.current = bp;

  useEffect(() => {
    const el = document.getElementById('prediction-content');
    if (!el) return;

    let timer: ReturnType<typeof setTimeout>;
    const ro = new ResizeObserver(() => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        const next = detectBp();
        if (next.name !== bpRef.current.name) setBp(next);
      }, 300);
    });
    ro.observe(el);
    return () => { ro.disconnect(); clearTimeout(timer); };
  }, []);

  return bp;
}
