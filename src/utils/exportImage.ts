import { toPng } from 'html-to-image';

export async function exportPredictionImage(): Promise<void> {
  const el = document.getElementById('prediction-content');
  if (!el) throw new Error('Content not found');

  const dataUrl = await toPng(el, {
    backgroundColor: '#0a0f1e',
    pixelRatio: 2,
    quality: 1,
  });

  const link = document.createElement('a');
  link.download = `worldcup-2026-prediction-${Date.now()}.png`;
  link.href = dataUrl;
  link.click();
}
