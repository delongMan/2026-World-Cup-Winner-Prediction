import { toPng } from 'html-to-image';

export async function exportPredictionImage(): Promise<void> {
  // Export the full bracket body (has explicit width/height containing all cards + SVG)
  const el = document.getElementById('bracket-body') || document.getElementById('prediction-content');
  if (!el) throw new Error('Content not found');

  const dataUrl = await toPng(el, {
    backgroundColor: '#060b14',
    pixelRatio: 2,
    quality: 1,
    width: el.scrollWidth || el.clientWidth,
    height: el.scrollHeight || el.clientHeight,
    style: { transform: 'none' }, // remove any GPU transforms that break rendering
  });

  const link = document.createElement('a');
  link.download = `worldcup-2026-prediction-${Date.now()}.png`;
  link.href = dataUrl;
  link.click();
}
