import { useState } from 'react';
import { exportPredictionImage } from '../utils/exportImage';
import { usePredictionStore } from '../store/usePredictionStore';

export function ExportButton() {
  const [exporting, setExporting] = useState(false);
  const hasChampion = usePredictionStore(s => !!s.knockoutWinners['final-1']);

  async function handleExport() {
    if (!hasChampion) {
      alert('请先完成所有预测，选出冠军后再导出。');
      return;
    }
    setExporting(true);
    try {
      await exportPredictionImage();
    } catch (err) {
      console.error('Export failed:', err);
    }
    setExporting(false);
  }

  return (
    <button
      onClick={handleExport}
      disabled={exporting}
      className={`px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-[11px] font-medium rounded-lg sm:rounded-xl ring-1 transition-all duration-200 ${
        hasChampion
          ? 'text-accent-gold/80 hover:text-accent-gold ring-accent-gold/20 hover:ring-accent-gold/40'
          : 'text-white/20 ring-white/5 cursor-not-allowed'
      }`}
    >
      {exporting ? '...' : '📸 导出'}
    </button>
  );
}
